const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('./core.cjs');
const results=[];
function test(name,fn){fn();results.push({name,passed:true});}
test('CSV retains quoted commas, doubled quotes, multiline Unicode and empty cells',()=>{
 const output=core.exportCsv(['name','note','empty'],[{name:'Renée',note:'comma, quote " and\nnewline',empty:null}]);
 assert.equal(output,'name,note,empty\r\nRenée,"comma, quote "" and\nnewline",');
});
test('CSV values are not silently truncated at carriage returns',()=>assert.equal(core.csvCell('one\rtwo'),'"one\rtwo"'));
test('Duplicate names receive distinct safe targets and retain rollback source mapping',()=>{
 const input=[{name:'image.png',category:'design'},{name:'image (copy).png',category:'design'},{name:'a.JPG',category:'../Design'}];
 const copy=JSON.stringify(input),preview=core.renamePreview(input);
 assert.equal(JSON.stringify(input),copy);assert.equal(new Set(preview.map(p=>p.to.toLowerCase())).size,3);
 assert.deepEqual(preview.map(p=>p.from),input.map(p=>p.name));
 assert(preview.every(p=>!p.to.includes('/')&&!p.to.includes('..')));
});
test('Kanban transitions preserve IDs and other cards; serialized board round-trips',()=>{
 const original=[{id:'a',title:'Ship',column:'To do'},{id:'b',title:'Test',column:'Done'}];
 const moved=core.moveCard(original,'a','Doing');
 assert.equal(original[0].column,'To do');assert.equal(moved[0].column,'Doing');assert.equal(moved[1],original[1]);
 assert.deepEqual(JSON.parse(JSON.stringify(moved)),moved);assert.throws(()=>core.moveCard(moved,'a','unknown'));
});
test('Game collision distinguishes an overlap from a near miss',()=>{
 const p={x:30,y:40,w:20,h:20};assert(core.collision(p,{x:40,y:50,w:20,h:20}));
 assert(!core.collision(p,{x:51,y:50,w:20,h:20}));
});
const report={createdAt:new Date().toISOString(),scope:'Local fixture logic only. No external model race, browser agent or visual browser acceptance test was performed.',results};
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2));
console.log(`${results.length} meaningful local fixture checks passed. External experiments remain unperformed.`);
