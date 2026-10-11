const fs=require('fs');
const path=require('path');
const assert=require('assert');
const root=path.resolve(__dirname,'..');
let total=0;
for(const folder of ['TOMORROW-EXE','BUILDMode-AI','TOOLPROOF']) {
 const dir=path.join(root,'projects',folder,'week-1');
 const week=JSON.parse(fs.readFileSync(path.join(dir,'remotion-week.json'),'utf8'));
 assert.equal(week.reels.length,14);
 for(let day=1;day<=7;day++) {
  const script=fs.readFileSync(path.join(dir,`day-${String(day).padStart(2,'0')}.md`),'utf8');
  assert.equal((script.match(/^## Reel /gm)||[]).length,2);
 }
 for(const reel of week.reels) {
  assert.equal(reel.scenes.length,6);
  assert(reel.directorReady && !reel.productionReady);
  assert.equal(reel.hooks.length,3);
  assert(reel.thumbnail.split(/\s+/).length<=4,reel.id+' thumbnail');
  assert.equal(reel.scenes[0].start,0);
  let end=0;
  for(const scene of reel.scenes) {
   assert.equal(scene.start,end);
   assert(scene.end>scene.start);
   assert(scene.direction && scene.animation && scene.soundCue);
   assert(['push-in','pull-back','track-left','track-up'].includes(scene.transition));
   assert.equal(scene.asset,null);
   assert(scene.captionChunks.every(c=>c.split(/\s+/).length<=7));
   end=scene.end;
  }
  assert.equal(end,reel.durationSeconds);
  assert.equal(reel.script,reel.scenes.map(s=>s.narration).join(' '));
  assert(reel.estimatedWpm<=170);
  if(folder==='TOMORROW-EXE') assert(!/\[[^\]]+\]/.test(reel.script),reel.id+' unresolved story');
  total++;
 }
 assert(fs.readFileSync(path.join(root,'projects',folder,'src/Root.tsx'),'utf8').includes('../week-1/remotion-week.json'));
 console.log(folder+': seven daily files; 14 scripts, 84 contiguous scenes, thumbnails and render feed checked.');
}
assert.equal(total,42);
console.log('PASS: 42 directed scripts; audio deferred; production status correctly pending.');
