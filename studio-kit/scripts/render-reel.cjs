const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');
const args = process.argv.slice(2);
const id = args.find(arg => /^D0[1-7]R[12]$/.test(arg));
const draft = args.includes('--draft');
const frames = args.find(arg => /^--frames=\d+-\d+$/.test(arg));
if (!id) {console.error('Usage: npm run render:reel -- D01R1 [--draft]'); process.exit(1);}
const week = JSON.parse(fs.readFileSync('week-1/remotion-week.json','utf8'));
const reel = week.reels.find(r=>r.id===id);
if (!reel) {console.error('Reel not found.'); process.exit(1);}
if (!draft && (!reel.productionReady || /\[[^\]]+\]/.test(reel.script) || reel.scenes.some(s=>/\[[^\]]+\]/.test(s.text+s.narration)))) {
  console.error('This Reel still has planned content or placeholders. Complete its script/evidence/media and set productionReady, or render with --draft.');
  process.exit(1);
}
if (!draft && reel.scenes.some(s=>s.plannedAsset && !s.asset)) {
  console.error('Planned shot assets are still unassigned. Add the captured/produced assets before a production render.'); process.exit(1);
}
for (const scene of reel.scenes) {
  if (scene.asset && !fs.existsSync(path.join('public',scene.asset))) {console.error(`Missing scene asset: ${scene.asset}`); process.exit(1);}
}
if(reel.audio && !fs.existsSync(path.join('public',reel.audio))) {console.error(`Missing audio: ${reel.audio}`); process.exit(1);}
const cli=path.join(path.dirname(require.resolve('@remotion/cli/package.json')),'remotion-cli.js');
const props = draft ? {reel:{...reel,productionReady:false}} : {};
const output = `out/${id.toLowerCase()}${draft?'-draft':''}${frames?'-sample':''}.mp4`;
const result=spawnSync(process.execPath,[cli,'render','src/index.ts',id,output,'--codec=h264','--props='+JSON.stringify(props),...(frames?[frames]:[])],{stdio:'inherit',cwd:process.cwd()});
if(result.error)console.error(result.error.message);
process.exit(result.status??1);
