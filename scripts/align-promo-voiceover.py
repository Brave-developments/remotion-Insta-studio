"""Align the promo voice-over WAV to VOICE_LINES with local Whisper word timestamps.

Reads the 12 spoken lines from src/promo/copy.ts, recognizes word start/end times
in src/promo/audio/voiceover.wav, and writes src/promo/audio/promo-alignment.json:
per-line {planned, actual, drift} plus the recognized match ratio.
"""
import os
from pathlib import Path
_root = Path(__file__).resolve().parents[1]
os.environ['HF_HOME'] = str(_root / '.cache/huggingface')  # D: (old week-1 cache) no longer exists
os.environ.pop('HUGGINGFACE_HUB_CACHE', None)
os.environ.pop('HF_HUB_CACHE', None)
import json, re, math, hashlib, difflib
import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly
from transformers import WhisperProcessor, WhisperForConditionalGeneration, pipeline
import transformers.pipelines.automatic_speech_recognition as asr_module
asr_module.is_torchcodec_available = lambda: False

root = Path(__file__).resolve().parents[1]
copy_ts = root / 'src/promo/copy.ts'
wav_path = root / 'src/promo/audio/voiceover.wav'
out_path = root / 'src/promo/audio/promo-alignment.json'

# --- Parse VOICE_LINES (t, at) straight from copy.ts so script and audio can't drift ---
src = copy_ts.read_text(encoding='utf8')
line_re = re.compile(r"\{ t: (?:\"((?:[^\"\\]|\\.)*)\"|'((?:[^'\\]|\\.)*)'), at: ([0-9.]+) \}")
lines = []
for dq, sq, at in line_re.findall(src):
    text = (dq or sq).encode().decode('unicode_escape') if '\\' in (dq or sq) else (dq or sq)
    lines.append({'text': text, 'planned': float(at)})
assert len(lines) == 12, f'expected 12 VOICE_LINES, parsed {len(lines)}'

# Reference token stream with per-line boundaries (mirrors week-1 align-voiceovers.py)
def integer_words(value):
    small = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    if value < 20: return [small[value]]
    if value < 100: return [tens[value // 10]] + (integer_words(value % 10) if value % 10 else [])
    if value < 1000: return [small[value // 100], 'hundred'] + (['and'] + integer_words(value % 100) if value % 100 else [])
    if value < 10000: return integer_words(value // 1000) + ['thousand'] + (integer_words(value % 1000) if value % 1000 else [])
    return [str(value)]

def tokens(text):
    text = re.sub(r'(?<=\d),(?=\d)', '', text.lower().replace('’', "'"))
    return [part for word in re.findall(r'[a-z0-9]+', text) for part in (integer_words(int(word)) if word.isdigit() else [word])]

reference, line_spans = [], []
for line in lines:
    start = len(reference)
    for word in line['text'].split():
        reference.extend(tokens(word))
    line_spans.append((start, len(reference)))

spoken = '\n'.join(l['text'] for l in lines)
audio, sr = sf.read(str(wav_path), dtype='float32')
if audio.ndim > 1: audio = audio.mean(axis=1)
duration = len(audio) / sr
assert duration > 5 and np.isfinite(audio).all()
peak = float(np.max(np.abs(audio)))
rms = float(np.sqrt(np.mean(audio ** 2)))
assert rms > .001 and peak > .01, 'Silent recording'

fingerprint = hashlib.sha256(wav_path.read_bytes() + spoken.encode()).hexdigest()
torch.set_num_threads(4)
processor = WhisperProcessor.from_pretrained('openai/whisper-base')
model = WhisperForConditionalGeneration.from_pretrained('openai/whisper-base', attn_implementation='eager')
device = -1  # CPU: this venv's CUDA build segfaults at pipeline init; 55s of audio is quick anyway
recognizer = pipeline('automatic-speech-recognition', model=model, tokenizer=processor.tokenizer,
                      feature_extractor=processor.feature_extractor, device=device)

alignment = json.loads(out_path.read_text()) if out_path.exists() else {}
if alignment.get('fingerprint') != fingerprint:
    divisor = math.gcd(sr, 16000)
    pcm = resample_poly(audio, 16000 // divisor, sr // divisor).astype(np.float32)
    result = recognizer({'raw': pcm, 'sampling_rate': 16000}, return_timestamps='word',
                        generate_kwargs={'language': 'english', 'task': 'transcribe'})
    alignment = {'fingerprint': fingerprint, 'recognizedText': result['text'],
                 'words': result['chunks'], 'method': 'Cached Whisper Base word timestamps on local CPU'}

observed, times = [], []
for word in alignment['words']:
    units = tokens(word['text'])
    a, b = word['timestamp']
    a = float(a if a is not None else 0)
    b = float(b if b is not None else duration)
    for k, unit in enumerate(units):
        observed.append(unit)
        times.append((a + (b - a) * k / max(1, len(units)), a + (b - a) * (k + 1) / max(1, len(units))))

matcher = difflib.SequenceMatcher(None, reference, observed, autojunk=False)
matched = {}
for tag, a, b, c, d in matcher.get_opcodes():
    if tag == 'equal':
        for x, y in zip(range(a, b), range(c, d)):
            matched[x] = times[y]
ratio = len(matched) / max(1, len(reference))
assert ratio > .80, f'Speech mismatch: only {ratio:.0%} recognized; inspect alignment'

# Interpolate unmatched tokens between recognized anchors (week-1 recipe)
anchors = sorted(matched)
resolved = []
for i in range(len(reference)):
    if i in matched:
        resolved.append(matched[i]); continue
    before = max((k for k in anchors if k < i), default=None)
    after = min((k for k in anchors if k > i), default=None)
    begin = matched[before][1] if before is not None else 0
    end = matched[after][0] if after is not None else duration
    left = before + 1 if before is not None else 0
    right = after if after is not None else len(reference)
    width = max(0, end - begin) / max(1, right - left)
    resolved.append((begin + (i - left) * width, begin + (i - left + 1) * width))

report = []
for line, (a, b) in zip(lines, line_spans):
    start, end = resolved[a][0], resolved[b - 1][1]
    report.append({'text': line['text'], 'planned': line['planned'],
                   'actual': round(start, 2), 'end': round(end, 2),
                   'drift': round(start - line['planned'], 2)})

out = {'fingerprint': fingerprint, 'durationSeconds': round(duration, 3), 'sampleRate': sr,
       'peak': round(peak, 4), 'rms': round(rms, 4), 'recognizedMatchRatio': round(ratio, 4),
       'recognizedText': alignment.get('recognizedText', ''),
       'method': alignment.get('method', 'Cached Whisper Base word timestamps on local CPU'),
       'lines': report}
out_path.write_text(json.dumps(out, indent=2) + '\n', encoding='utf8')

max_drift = max(abs(r['drift']) for r in report)
for r in report:
    print(f"{r['planned']:6.2f} -> {r['actual']:6.2f} ({r['drift']:+.2f}s)  {r['text'][:60]}")
print(f"duration {duration:.2f}s | match {ratio:.0%} | max |drift| {max_drift:.2f}s")
print(f"PASS: wrote {out_path.relative_to(root)}")
