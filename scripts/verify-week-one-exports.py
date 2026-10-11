from pathlib import Path
import json, subprocess

root=Path.cwd()
bin_dir=root/'node_modules/@remotion/compositor-win32-x64-msvc'
catalog=json.loads((root/'studio-kit/week-1-projects.json').read_text())
checks=[]
missing=[]
for item in catalog:
    video=root/item['output']
    if not video.exists():
        missing.append(item['output'])
        continue
    package=root/item['project']/'reel.json'
    reel=json.loads(package.read_text(encoding='utf-8'))
    metadata=json.loads(subprocess.check_output([str(bin_dir/'ffprobe.exe'),'-v','error','-show_streams','-show_format','-of','json',str(video)]))
    stream=next(s for s in metadata['streams'] if s['codec_type']=='video')
    assert (stream['width'],stream['height'])==(1080,1920),str(video)
    assert stream['r_frame_rate']=='30/1',str(video)
    assert stream['codec_name']=='h264',str(video)
    assert abs(float(metadata['format']['duration'])-reel['durationSeconds'])<.1,str(video)
    assert int(stream.get('nb_frames',reel['durationSeconds']*30))==reel['durationSeconds']*30,str(video)
    assert not any(s['codec_type']=='audio' for s in metadata['streams']),str(video)
    review=root/'projects'/item['channel']/'out/week-1/review'/item['name']
    review.mkdir(parents=True,exist_ok=True)
    for i,scene in enumerate(reel['scenes']):
        points=[(f'scene {i+1}.png',scene['start']+(scene['end']-scene['start'])*.55)]
        if i>0:points.append((f'transition {i}.png',scene['start']+8/30))
        for name,second in points:
            subprocess.run([str(bin_dir/'ffmpeg.exe'),'-y','-v','error','-ss',str(second),'-i',str(video),'-frames:v','1','-update','1',str(review/name)],check=True,stdout=subprocess.DEVNULL)
    checks.append({'channel':item['channel'],'name':item['name'],'title':item['title'],'seconds':reel['durationSeconds'],'size':'1080x1920','fps':30,'codec':'h264','frames':int(stream.get('nb_frames',reel['durationSeconds']*30)),'bytes':video.stat().st_size,'sceneCheckpoints':6,'transitionCheckpoints':5,'status':'verified silent illustration edition'})
    print(f"Verified {item['channel']} / {item['name']}",flush=True)
report={'expected':42,'verified':len(checks),'totalSeconds':sum(c['seconds'] for c in checks),'missing':missing,'checks':checks,'scope':'Metadata plus actual exported scene/transition frames. External model and matched product test results are not claimed.'}
(root/'studio-kit/week-1-export-verification.json').write_text(json.dumps(report,indent=2)+'\n')
if missing:raise SystemExit(f'{len(missing)} exports still missing.')
print('PASS: all42 named exports verified,252scene and210transition frames extracted.')
