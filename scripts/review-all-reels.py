from pathlib import Path
import json, sys
from PIL import Image, ImageDraw, ImageFont

root=Path.cwd()
font_path=Path('C:/Windows/Fonts/segoeui.ttf')
font=ImageFont.truetype(str(font_path),18) if font_path.exists() else ImageFont.load_default()
small=ImageFont.truetype(str(font_path),14) if font_path.exists() else font
counts=[]
voiced='--voiced' in sys.argv
for channel in ['TOMORROW-EXE','BUILDMode-AI','TOOLPROOF']:
    edition=root/'projects'/channel/('out/week-1/voiced' if voiced else 'out/week-1')
    review=edition/'review'
    output=edition/'contact-sheets'
    output.mkdir(parents=True,exist_ok=True)
    for day in range(1,8):
        sheet=Image.new('RGB',(1296,872),'#161616')
        draw=ImageDraw.Draw(sheet)
        draw.text((18,12),f'{channel} / day {day} + day {day}.2 / six scene checkpoints',font=font,fill='white')
        complete=True
        for row,name in enumerate([f'day {day}',f'day {day}.2']):
            draw.text((18,44+row*405),name,font=small,fill='#d0d0d0')
            for scene in range(1,7):
                file=review/name/f'scene {scene}.png'
                if not file.exists():complete=False;continue
                image=Image.open(file).convert('RGB').resize((216,384))
                sheet.paste(image,((scene-1)*216,65+row*405))
        if complete:
            sheet.save(output/f'day {day}.jpg',quality=93)
            counts.append({'channel':channel,'day':day,'checkedFrames':12,'contactSheet':str(output/f'day {day}.jpg')})
    transitions=Image.new('RGB',(1296,872),'#161616')
    draw=ImageDraw.Draw(transitions)
    draw.text((18,12),f'{channel} / transition midpoint sampling / no colour wipes',font=font,fill='white')
    # Every boundary is exported; these twelve give a readable overview.
    samples=[(f'day {d}',t) for d,t in [(1,1),(1,2),(2,1),(3,2),(4,3),(5,4),(6,2),(7,1),(7,3)]]+[(f'day {d}.2',t) for d,t in [(1,2),(4,3),(7,4)]]
    complete=True
    for i,(name,index) in enumerate(samples):
        file=review/name/f'transition {index}.png'
        if not file.exists():complete=False;continue
        transitions.paste(Image.open(file).convert('RGB').resize((216,384)),((i%6)*216,65+(i//6)*405))
    if complete:transitions.save(output/'transitions.jpg',quality=93)
(root/('studio-kit/voiced-scene-review-catalog.json' if voiced else 'studio-kit/scene-review-catalog.json')).write_text(json.dumps(counts,indent=2)+'\n')
print(f'Built {len(counts)} daily review sheets; complete coverage is 21 sheets / 252 scene frames.')
