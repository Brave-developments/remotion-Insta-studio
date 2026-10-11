from pathlib import Path
import json, subprocess
from PIL import Image, ImageDraw
root=Path.cwd()
frames=root/'out'/'review'
frames.mkdir(parents=True,exist_ok=True)
plan=json.loads((root/'public'/'scene-data.json').read_text(encoding='utf-8'))
ffmpeg=root.parent/'node_modules'/'@remotion'/'compositor-win32-x64-msvc'/'ffmpeg.exe'
sheet=Image.new('RGB',(1080,4*424),'#141610')
for i,scene in enumerate(plan['scenes']):
    timestamp=scene['start']+scene['duration']*.6
    path=frames/f'{i+1:02d}.png'
    subprocess.run([str(ffmpeg),'-y','-v','error','-ss',str(timestamp),'-i','ai-agent-era-smooth.mp4','-frames:v','1','-update','1',str(path)],check=True)
    im=Image.open(path).convert('RGB').resize((270,480))
    # Five columns show the complete sequence in one compact review artifact.
    im=im.resize((216,384))
    x=(i%5)*216; y=(i//5)*424
    sheet.paste(im,(x,y))
    ImageDraw.Draw(sheet).text((x+8,y+391),f'{i+1:02d} / {timestamp:.1f}s',fill='#d2fb76')
sheet.crop((0,0,1080,3*424)).save(root/'storyboard.png')


