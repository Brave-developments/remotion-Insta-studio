from pathlib import Path
import subprocess
from PIL import Image, ImageDraw
root=Path.cwd()
ffmpeg=root.parent/'node_modules'/'@remotion'/'compositor-win32-x64-msvc'/'ffmpeg.exe'
folder=root/'out'/'transition-review'
folder.mkdir(parents=True,exist_ok=True)
sheet=Image.new('RGB',(1080,3*520),'#12140f')
for row,boundary in enumerate([7.5,21,53]):
    for col,offset in enumerate([-4,0,8,17]):
        frame=round(boundary*30)+offset
        path=folder/f'{frame}.png'
        subprocess.run([str(ffmpeg),'-y','-v','error','-ss',str(frame/30),'-i','ai-agent-era-smooth.mp4','-frames:v','1','-update','1',str(path)],check=True)
        image=Image.open(path).convert('RGB').resize((270,480))
        sheet.paste(image,(col*270,row*520))
        ImageDraw.Draw(sheet).text((col*270+10,row*520+491),f'{boundary:.1f}s / {offset:+d} frames',fill='#d2fb76')
sheet.save(root/'transition-review.png')
