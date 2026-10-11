from pathlib import Path
import json, subprocess, math
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'studio-kit/week-1-projects.json').read_text())
probe=root/'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
ffmpeg=root/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
checks=[]
missing=[]
for item in catalog:
    reel=json.loads((root/item['project']/'reel.voiced.json').read_text())
    video=root/'projects'/item['channel']/'out/week-1/voiced'/(item['name']+'.mp4')
    if not video.exists():missing.append(str(video));continue
    meta=json.loads(subprocess.check_output([str(probe),'-v','error','-show_streams','-show_format','-of','json',str(video)]))
    visual=next(s for s in meta['streams'] if s['codec_type']=='video')
    audio=next(s for s in meta['streams'] if s['codec_type']=='audio')
    assert (visual['width'],visual['height'],visual['r_frame_rate'],visual['codec_name'])==(1080,1920,'30/1','h264')
    assert audio['codec_name']=='aac'
    assert abs(float(meta['format']['duration'])-reel['durationSeconds'])<.1
    assert int(visual['nb_frames'])==round(reel['durationSeconds']*30)
    assert float(audio.get('start_time',0))<.1
    original=json.loads((root/item['project']/'voiceover.json').read_text())
    assert float(audio['duration'])>=original['durationSeconds']-.1,'Audio tail cut: '+str(video)
    assert abs(float(audio['duration'])-original['durationSeconds'])<.6
    previous=0
    for scene in reel['scenes']:
        assert abs(scene['start']-previous)<1/30+.0001
        assert scene['end']>scene['start']
        assert ' '.join(c['text'] for c in scene['captionTimings'])==(scene.get('presentationNarration',scene['narration']))
        for caption in scene['captionTimings']:
            assert 0<=caption['start']<caption['end']<=scene['end']-scene['start']+.002
        previous=scene['end']
    review=video.parent/'review'/item['name']
    review.mkdir(parents=True,exist_ok=True)
    for i,scene in enumerate(reel['scenes']):
        points=[(f'scene {i+1}.png',scene['start']+(scene['end']-scene['start'])*.55)]
        if i>0:points.append((f'transition {i}.png',scene['start']+8/30))
        for filename,second in points:
            subprocess.run([str(ffmpeg),'-y','-v','error','-ss',str(second),'-i',str(video),'-frames:v','1','-update','1',str(review/filename)],check=True,stdout=subprocess.DEVNULL)
    checks.append({'channel':item['channel'],'name':item['name'],'video':str(video),'seconds':float(meta['format']['duration']),'audioSeconds':float(audio['duration']),'size':'1080x1920','fps':30,'videoCodec':'h264','audioCodec':'aac','timing':'recognized word-timed captions and scene boundaries','bytes':video.stat().st_size})
    print(f"Verified voiced {item['channel']}/{item['name']}",flush=True)
report={'expected':42,'verified':len(checks),'missing':missing,'checks':checks}
(root/'studio-kit/voiced-export-verification.json').write_text(json.dumps(report,indent=2)+'\n')
assert len(checks)==42 and not missing
print('PASS: all 42 voiced MP4s verified, with full recordings and timed captions.')
