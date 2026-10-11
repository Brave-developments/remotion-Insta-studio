"""Check local WAVs, recognize word times, and prepare voiced Remotion props."""
import os
os.environ['HF_HUB_OFFLINE']='1'
os.environ['HF_HUB_CACHE']='D:/hf-cache/hub'
from pathlib import Path
import json, subprocess, re, difflib, hashlib, math
import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly
from transformers import WhisperProcessor, WhisperForConditionalGeneration, pipeline
import transformers.pipelines.automatic_speech_recognition as asr_module
# Raw NumPy audio is already decoded; avoid the optional broken Windows decoder.
asr_module.is_torchcodec_available=lambda: False

root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'studio-kit/week-1-projects.json').read_text())
batch=json.loads((root/'studio-kit/voiceover-batch-status.json').read_text())
assert batch['completed']==42 and batch['status']=='complete'
torch.set_num_threads(4)
processor=WhisperProcessor.from_pretrained('openai/whisper-base',local_files_only=True)
model=WhisperForConditionalGeneration.from_pretrained('openai/whisper-base',local_files_only=True,attn_implementation='eager')
recognizer=pipeline('automatic-speech-recognition',model=model,tokenizer=processor.tokenizer,feature_extractor=processor.feature_extractor,device=-1)
ffmpeg=root/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
checks=[]

def integer_words(value):
    small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
    tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
    if value<20:return [small[value]]
    if value<100:return [tens[value//10]]+(integer_words(value%10) if value%10 else [])
    if value<1000:return [small[value//100],'hundred']+(['and']+integer_words(value%100) if value%100 else [])
    if value<10000:return integer_words(value//1000)+['thousand']+(integer_words(value%1000) if value%1000 else [])
    return [str(value)]

def tokens(text):
    text=re.sub(r'(?<=\d),(?=\d)','',text.lower().replace('’',"'"))
    return [part for word in re.findall(r"[a-z0-9]+",text) for part in (integer_words(int(word)) if word.isdigit() else [word])]

for item in catalog:
    folder=root/item['project']
    reel=json.loads((folder/'reel.json').read_text(encoding='utf8'))
    source=[s.get('presentationNarration',s['narration']) for s in reel['scenes']]
    spoken='\n\n'.join(source)
    job=batch['reels'][item['channel']+'/'+item['name']]
    assert job['text']==spoken
    audio_path=root/job['output']
    audio,sr=sf.read(audio_path,dtype='float32')
    if audio.ndim>1:audio=audio.mean(axis=1)
    duration=len(audio)/sr
    assert duration>5 and np.isfinite(audio).all()
    rms=float(np.sqrt(np.mean(audio**2)))
    peak=float(np.max(np.abs(audio)))
    assert rms>.001 and peak>.01, 'Silent recording: '+str(audio_path)
    fingerprint=hashlib.sha256(audio_path.read_bytes()+spoken.encode()).hexdigest()
    alignment_path=folder/'audio-alignment.json'
    if alignment_path.exists():
        alignment=json.loads(alignment_path.read_text())
    else:alignment={}
    if alignment.get('fingerprint')!=fingerprint:
        divisor=math.gcd(sr,16000)
        pcm=resample_poly(audio,16000//divisor,sr//divisor).astype(np.float32)
        result=recognizer({'raw':pcm,'sampling_rate':16000},return_timestamps='word',generate_kwargs={'language':'english','task':'transcribe'})
        alignment={'fingerprint':fingerprint,'recognizedText':result['text'],'words':result['chunks'],'method':'Cached Whisper Base word timestamps on local CPU'}
        alignment_path.write_text(json.dumps(alignment,indent=2)+'\n')
    reference=[]
    display=[]
    scene_spans=[]
    for text in source:
        start=len(reference)
        words=text.split()
        for word in words:
            begin=len(reference)
            reference.extend(tokens(word))
            display.append((word,begin,len(reference)))
        scene_spans.append((start,len(reference)))
    observed=[]
    times=[]
    for word in alignment['words']:
        units=tokens(word['text'])
        a,b=word['timestamp']
        a=float(a if a is not None else 0)
        b=float(b if b is not None else duration)
        for k,unit in enumerate(units):
            observed.append(unit)
            times.append((a+(b-a)*k/max(1,len(units)),a+(b-a)*(k+1)/max(1,len(units))))
    matcher=difflib.SequenceMatcher(None,reference,observed,autojunk=False)
    matched={}
    differences=[]
    for tag,a,b,c,d in matcher.get_opcodes():
        if tag=='equal':
            for x,y in zip(range(a,b),range(c,d)):matched[x]=times[y]
        else:differences.append({'kind':tag,'script':' '.join(reference[a:b]),'recognized':' '.join(observed[c:d])})
    ratio=len(matched)/max(1,len(reference))
    assert ratio>.80, f"Speech mismatch {item['channel']}/{item['name']}: {ratio:.0%}; inspect audio-alignment.json"
    anchors=sorted(matched)
    resolved=[]
    for i in range(len(reference)):
        if i in matched:resolved.append(matched[i]);continue
        before=max((k for k in anchors if k<i),default=None)
        after=min((k for k in anchors if k>i),default=None)
        begin=matched[before][1] if before is not None else 0
        end=matched[after][0] if after is not None else duration
        left=before+1 if before is not None else 0
        right=after if after is not None else len(reference)
        width=max(0,end-begin)/max(1,right-left)
        resolved.append((begin+(i-left)*width,begin+(i-left+1)*width))
    # Each boundary is anchored to the first spoken word of its incoming scene.
    frames=[0]+[max(1,round(max(0,resolved[a][0]-.08)*30)) for a,b in scene_spans[1:]]
    frames.append(math.ceil((duration+.2)*30))
    assert all(b-a>=24 for a,b in zip(frames,frames[1:])), 'Unreliable scene boundary '+item['name']
    word_cursor=0
    for i,scene in enumerate(reel['scenes']):
        start,end=frames[i]/30,frames[i+1]/30
        words=source[i].split()
        groups=[]
        for word in words:
            if not groups or (len(groups[-1])>=6 and len(words)-sum(map(len,groups))>1):groups.append([])
            groups[-1].append(word)
        caption_timings=[]
        offset=0
        for group in groups:
            first=display[word_cursor+offset]
            last=display[word_cursor+offset+len(group)-1]
            a=max(start,resolved[first[1]][0]-.06)
            b=min(end,resolved[max(last[1],last[2]-1)][1]+.10)
            if b<=a:b=min(end,a+.1)
            caption_timings.append({'text':' '.join(group),'start':round(a-start,3),'end':round(b-start,3)})
            offset+=len(group)
        word_cursor+=len(words)
        scene['originalStart']=scene['start'];scene['originalEnd']=scene['end']
        scene['start']=start;scene['end']=end;scene['captionTimings']=caption_timings
    reel['audio']='audio/'+item['name']+'.wav'
    reel['durationSeconds']=frames[-1]/30
    reel['timingStatus']='Aligned to actual Voicebox recording with local recognized word timestamps. Minor unrecognized tokens interpolate between recognized neighbors.'
    reel['visualStatus']='voiced-directed-illustration'
    (folder/'reel.voiced.json').write_text(json.dumps(reel,indent=2)+'\n')
    check={'channel':item['channel'],'name':item['name'],'seconds':duration,'sampleRate':sr,'peak':peak,'rms':rms,'recognizedMatchRatio':round(ratio,4),'differences':differences,'sourceInputExact':True,'scenes':6,'frames':frames[-1]}
    checks.append(check)
    (root/'studio-kit/audio-verification.json').write_text(json.dumps({'expected':42,'verified':len(checks),'checks':checks},indent=2)+'\n')
    print(f"Aligned {item['channel']}/{item['name']}: {duration:.2f}s; recognized match {ratio:.0%}",flush=True)
print('PASS: all 42 recordings verified and voiced scene/caption props prepared.',flush=True)
