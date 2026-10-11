const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
for(const folder of ['TOMORROW-EXE','BUILDMode-AI','TOOLPROOF']) {
 const project=path.join(root,'projects',folder);
 const week=JSON.parse(fs.readFileSync(path.join(project,'week-1/remotion-week.json'),'utf8'));
 const outcomes={instructions:'Record real observations here, with raw capture paths and audit notes. Null is not a result. Apply verified values to narration/screen text in remotion-week.json and its daily script before publication.',reels:[]};
 for(const reel of week.reels) {
  fs.mkdirSync(path.join(project,'public/assets/week-1',reel.id.toLowerCase()),{recursive:true});
  const slots=[...new Set([...reel.script.matchAll(/\[([^\]]+)\]/g)].map(m=>m[1]))];
  if(slots.length)outcomes.reels.push({id:reel.id,toolVersion:null,modelAndConfiguration:null,osAndHardware:null,plan:null,capturedOn:null,rawCapture:null,auditNotes:null,fields:Object.fromEntries(slots.map(s=>[s,null]))});
 }
 const target=path.join(project,'week-1/outcomes-template.json');
 if(outcomes.reels.length && !fs.existsSync(target))fs.writeFileSync(target,JSON.stringify(outcomes,null,2)+'\n');
}
console.log('Week 1 asset target folders prepared; empty evidence intake templates created for the two test channels.');
