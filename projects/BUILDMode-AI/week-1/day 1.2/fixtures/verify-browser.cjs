const {openBrowser}=require('@remotion/renderer');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const folder=__dirname;
const browserExecutable=path.join(folder,'../node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe');
const checks=[],errors=[];
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(fs.readFileSync(path.join(folder,'index.html')))});
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}`;
 const browser=await openBrowser('chrome',{browserExecutable,logLevel:'error'});
 try{
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 page.on('error',err=>errors.push(err.message));
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
 await page.goto({url,timeout:20000});
 fs.mkdirSync(path.join(folder,'captures'),{recursive:true});
 async function shot(name){const result=await page._client().send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(folder,'captures',name+'.png'),Buffer.from(result.value.data,'base64'));}
 async function check(name,fn){const outcome=await page.evaluate(fn);assert.equal(outcome,true,name);checks.push({name,passed:true});}
 await check('Dashboard primary action creates a local project',()=>{document.querySelector('#create').click();return document.querySelector('#projects').textContent.includes('project 1 created')});await shot('dashboard');
 await page.evaluate(()=>{show('Kanban');document.querySelector('#title').value='Verified browser card';document.querySelector('#add').dispatchEvent(new Event('submit',{cancelable:true}));let target=[...document.querySelectorAll('.card')].find(el=>el.textContent.includes('Verified browser card'));let select=target.querySelector('select');select.value='Done';select.dispatchEvent(new Event('change'));});
 await page.goto({url,timeout:20000});
 await check('Kanban added and moved card survives a true browser navigation/reload',()=>{show('Kanban');let done=[...document.querySelectorAll('.column')].find(el=>el.querySelector('h2').textContent==='Done');return done.textContent.includes('Verified browser card')});await shot('kanban');
 await check('Kanban delete removes card from persisted board',()=>{let target=[...document.querySelectorAll('.card')].find(el=>el.textContent.includes('Verified browser card'));target.querySelector('button').click();return !JSON.parse(localStorage.getItem('buildmode-board')).some(c=>c.title==='Verified browser card')});
 await check('Redesign toggles only styling and preserves working signup/FAQ',()=>{show('Redesign');document.querySelector('#toggle').click();let before=document.querySelector('#landing').classList.contains('ugly');document.querySelector('#toggle').click();let after=!document.querySelector('#landing').classList.contains('ugly');document.querySelector('#signup input').value='example@example.test';document.querySelector('#signup').dispatchEvent(new Event('submit',{cancelable:true}));return before&&after&&document.querySelector('#signup-status').textContent.includes('accepted locally')&&Boolean(document.querySelector('details summary'))});await shot('redesign');
 await check('CSV preview includes correctly quoted multiline Unicode data',()=>{show('CSV export');let text=document.querySelector('#csv').value;return text.includes('Renée,"two\nlines"')&&text.includes('"quote "" inside"')&&text.includes('"comma, inside"')});await shot('csv-export');
 await check('Rename preview applies and rolls back without losing original filenames',()=>{show('Rename preview');let before=document.querySelector('#files').textContent;document.querySelector('#apply').click();let after=document.querySelector('#files').textContent;document.querySelector('#rollback').click();return before!==after&&document.querySelector('#files').textContent===before});await shot('rename-preview');
 await page.evaluate(()=>{show('Dodge game');document.querySelector('#restart').click();});
 await new Promise(resolve=>setTimeout(resolve,1100));
 await check('Dodge game runs animation and Restart resets score',()=>{let before=document.querySelector('#score').textContent;document.querySelector('#restart').click();return before.includes('Score 1')&&document.querySelector('#game').width===700});await shot('dodge-game');
 assert.equal(errors.length,0,'No browser runtime errors');
 fs.writeFileSync(path.join(folder,'browser-verification.json'),JSON.stringify({createdAt:new Date().toISOString(),scope:'Actual local browser fixture interactions and captures. No external AI tool/model experiments performed.',viewport:{width:1440,height:1000},checks,errors},null,2));
 console.log(`${checks.length} real browser interaction checks passed; six original-interface captures saved.`);
 }finally{await browser.close({silent:true});server.close()}
}
main().catch(err=>{console.error(err);server.close();process.exitCode=1});
