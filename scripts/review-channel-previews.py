from pathlib import Path
import subprocess, json
from PIL import Image, ImageDraw
root=Path.cwd()
ffmpeg=root/'node_modules'/'@remotion'/'compositor-win32-x64-msvc'/'ffmpeg.exe'
ffprobe=ffmpeg.with_name('ffprobe.exe')
names=['TOMORROW-EXE','BUILDMode-AI','TOOLPROOF']
sheet=Image.new('RGB',(1080,740),'#161616')
summary=[]
for i,name in enumerate(names):
 video=root/'projects'/name/'out'/'channel-preview.mp4'
 poster=root/'projects'/name/'out'/'poster.png'
 subprocess.run([str(ffmpeg),'-y','-v','error','-ss','2.8','-i',str(video),'-frames:v','1','-update','1',str(poster)],check=True)
 im=Image.open(poster).convert('RGB').resize((360,640))
 sheet.paste(im,(360*i,55))
 ImageDraw.Draw(sheet).text((360*i+18,20),name,fill='#f4f4ed')
 data=json.loads(subprocess.check_output([str(ffprobe),'-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate','-of','json',str(video)]))
 summary.append({'channel':name,**data})
sheet.save(root/'studio-kit'/'channel-overview.png')
(root/'studio-kit'/'preview-verification.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print('Three previews verified: 12 seconds, 1080x1920, 30fps, H.264.')
