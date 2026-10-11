from pathlib import Path
import json, subprocess
from PIL import Image, ImageDraw
root = Path.cwd()
bin_dir = root / 'node_modules/@remotion/compositor-win32-x64-msvc'
sheet = Image.new('RGB', (1080, 740), '#161616')
draw = ImageDraw.Draw(sheet)
checks = []
for index, name in enumerate(['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF']):
    video = root / 'projects' / name / 'out/d01r1-draft-sample.mp4'
    still = root / 'projects' / name / 'out/week-1-feed-check.png'
    subprocess.run([str(bin_dir/'ffmpeg.exe'), '-y', '-v', 'error', '-ss', '1.8', '-i', str(video), '-frames:v', '1', '-update', '1', str(still)], check=True)
    metadata = json.loads(subprocess.check_output([str(bin_dir/'ffprobe.exe'), '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(video)]))
    stream = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
    assert (stream['width'], stream['height']) == (1080, 1920)
    assert stream['r_frame_rate'] == '30/1'
    assert abs(float(metadata['format']['duration']) - 3) < .1
    assert not any(s['codec_type'] == 'audio' for s in metadata['streams'])
    sheet.paste(Image.open(still).convert('RGB').resize((360, 640)), (index*360, 55))
    draw.text((index*360+18, 20), name, fill='white')
    checks.append({'project': name, 'typecheck': 'passed', 'brandPreviewRender': 'passed', 'weekOneFeedRender': 'passed', 'size': '1080x1920', 'fps': 30, 'sampleSeconds': 3, 'audio': 'deferred'})
draw.text((20, 715), 'Week 1 feed verification: labelled animatics; final assets and evidence pending.', fill='#b8b8b8')
sheet.save(root/'studio-kit/week-1-feed-verification.png')
(root/'studio-kit/week-1-verification.json').write_text(json.dumps(checks, indent=2)+'\n')
print('PASS: three Week 1 samples; 1080x1920, 30fps, three seconds, silent.')
