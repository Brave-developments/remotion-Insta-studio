const fs=require('fs');
const defs=require('./channel-definitions.cjs');
const difficulties={
'TOMORROW-EXE':['Easy','Medium','Easy','Hard','Medium','Hard','Medium','Medium','Medium','Medium','Easy','Hard','Medium','Hard'],
'BUILDMode-AI':['Medium','Easy','Hard','Easy','Medium','Easy','Medium','Easy','Hard','Medium','Easy','Easy','Medium','Hard'],
'TOOLPROOF':Array.from({length:14},(_,i)=>i%2?'Medium':'Easy')
};
for(const def of defs){
 const file='projects/'+def.folder+'/content/week-01.json';
 const plan=JSON.parse(fs.readFileSync(file,'utf8'));
 plan.reels.forEach((r,i)=>{
  r.difficulty=difficulties[def.folder][i];
  r.effort=r.difficulty==='Easy'?'25–50 minutes':r.difficulty==='Medium'?'45–75 minutes':'75–90 minutes';
  r.quickBuild=r.difficulty==='Easy';
 });
 fs.writeFileSync(file,JSON.stringify(plan,null,2)+'\n');
 const profile=JSON.parse(fs.readFileSync('projects/'+def.folder+'/channel.json','utf8'));
 profile.fontFamily=def.folder==='TOMORROW-EXE'?'Manrope, Inter, DM Sans, Segoe UI, sans-serif':def.folder==='BUILDMode-AI'?'Inter, Geist, Manrope, Segoe UI, sans-serif':'Inter, Segoe UI, sans-serif';
 fs.writeFileSync('projects/'+def.folder+'/channel.json',JSON.stringify(profile,null,2)+'\n');
 for(const reel of plan.reels){
  const brief='projects/'+def.folder+'/content/reels/'+reel.id+'.md';
  let text=fs.readFileSync(brief,'utf8');
  text=text.replace('## Concept',`**Difficulty:** ${reel.difficulty} · **Effort:** ${reel.effort}${reel.quickBuild?' · QUICK BUILD':''}\n\n## Concept`);
  fs.writeFileSync(brief,text);
 }
}
