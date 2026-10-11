// Run after the batch completes. Correct the single review finding, then verify exports.
const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const source=path.join(root,'studio-kit/src/TomorrowVisuals.tsx');
let text=fs.readFileSync(source,'utf8');
const newTitle="i===1?'TUTOR TODAY → WHAT IF':i===3?'LEARNING HISTORY':i===4?'HISTORY SHARING PERMISSIONS':i===5?'HISTORY CLOSED · LESSON KEPT':'A DIFFERENT WAY TO LEARN'";
if(!text.includes('HISTORY SHARING PERMISSIONS')) {
 const lines=text.split('\n');
 const index=lines.findIndex(line=>line.includes('<Laptop x={362} y={230}')&&line.includes('translate(608 454)'));
 if(index<0)throw new Error('Education shot source changed; review the intended patch manually.');
 let line=lines[index];
 line=line.replace("i===1?'TUTOR TODAY → WHAT IF':'A DIFFERENT WAY TO LEARN'",newTitle);
 line=line.replace("i===4?['Teacher: allowed','Parent: shared by choice','Platform: your permission']:['One whole, four pieces','Two pieces = one half','Try a different explanation']","i===4?['Teacher: allowed','Parent: shared by choice','Platform: your permission']:i===3?['First lesson remembered','New explanation saved','A history, not a diagnosis']:i===5?['History drawer: closed','Successful explanation kept','Your permissions remain']:['One whole, four pieces','Two pieces = one half','Try a different explanation']");
 line=line.replace('<g transform="translate(608 454)">','{i<=2&&<g transform="translate(635 637)">');
 line=line.replace('</g></g>}','</g>}</g>}');
 if(!line.includes('{i<=2&&')||!line.includes('HISTORY SHARING PERMISSIONS'))throw new Error('Education correction did not apply cleanly.');
 lines[index]=line;text=lines.join('\n');fs.writeFileSync(source,text,'utf8');
 console.log('Corrected fraction object placement and history/privacy states.');
}
function run(command,args,cwd=root) {
 const result=spawnSync(command,args,{cwd,stdio:'inherit',shell:false});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error(command+' exited '+result.status);
}
const tsc=path.join(root,'node_modules/typescript/bin/tsc');
for(const folder of ['TOMORROW-EXE','BUILDMode-AI','TOOLPROOF'])run(process.execPath,[tsc,'--noEmit'],path.join(root,'projects',folder));
run(process.execPath,[path.join(root,'studio-kit/scripts/render-week.cjs'),'--channel=TOMORROW-EXE','--id=D04R1']);
const python='C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
run(python,[path.join(root,'scripts/verify-week-one-exports.py')]);
run(python,[path.join(root,'scripts/review-all-reels.py')]);
run(process.execPath,[path.join(root,'scripts/make-reel-gallery.cjs')]);
console.log('All42 final named exports verified; inspect final contact sheets and corrected education scene.');
