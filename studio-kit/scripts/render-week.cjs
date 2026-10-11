const fs=require('fs');
const path=require('path');
const os=require('os');
const crypto=require('crypto');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderMedia,renderStill}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../..');
const args=process.argv.slice(2);
const channelArg=args.find(a=>a.startsWith('--channel='))?.split('=')[1];
const idArg=args.find(a=>a.startsWith('--id='))?.split('=')[1];
const voiced=args.includes('--voiced');
const proof=args.includes('--proof');
const stillsOnly=args.includes('--stills');
const framesArg=args.find(a=>a.startsWith('--frames='))?.split('=')[1];
const folders=channelArg?[channelArg]:['TOMORROW-EXE','BUILDMode-AI','TOOLPROOF'];
// Six total browser frame workers leave memory for the user's other applications.
const concurrency=2;
const browserCandidates=[
 path.join(root,'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe'),
 ...folders.map(f=>path.join(root,'projects',f,'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe'))
];
const browserExecutable=browserCandidates.find(p=>fs.existsSync(p));
const fileName=reel=>`day ${reel.day}${reel.reelNumber===2?'.2':''}`;
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const statePath=path.join(root,voiced?'studio-kit/voiced-render-status.json':'studio-kit/render-week-status.json');
const state={startedAt:new Date().toISOString(),mode:stillsOnly?'stills':proof?'proof':'full',quality:'1080x1920 / 30fps / H.264 CRF 18 / PNG render frames',audio:voiced?'included':'deferred',channels:{}};
const save=()=>fs.writeFileSync(statePath,JSON.stringify(state,null,2)+'\n');
function validate(reel) {
 if(!reel.scenes.length)throw new Error(reel.id+' has no scenes');
 for(const scene of reel.scenes) {
  if(/\[[^\]]+\]/.test((scene.presentationNarration??scene.narration)+(scene.presentationText??scene.text)))throw new Error(reel.id+' has unresolved rendered copy: '+scene.id);
  if(scene.asset && !fs.existsSync(path.join(root,'projects',reel.channelFolder,'public',scene.asset)))throw new Error('Missing asset '+scene.asset);
 }
}
async function channel(folder) {
 const project=path.join(root,'projects',folder);
 const week=JSON.parse(fs.readFileSync(path.join(project,'week-1/remotion-week.json'),'utf8'));
 const channelInfo=JSON.parse(fs.readFileSync(path.join(project,'channel.json'),'utf8'));
 const reels=week.reels.filter(r=>!idArg||r.id===idArg);
 const out=path.join(project,voiced?'out/week-1/voiced':'out/week-1');fs.mkdirSync(out,{recursive:true});
 const stats=state.channels[folder]={status:'bundling',completed:0,total:reels.length,reels:{}};save();
 const serveUrl=await bundle({entryPoint:path.join(project,'src/index.ts'),rootDir:project,publicDir:path.join(project,'public'),outDir:path.join(project,'.render-cache/week-1'),enableCaching:true});
 const browser=await openBrowser('chrome',{browserExecutable,logLevel:'error'});
 try {
  for(const sourceReel of reels) {
   const name=fileName(sourceReel);
   const packagePath=path.join(project,'week-1',name,voiced?'reel.voiced.json':'reel.json');
   const reel={...(fs.existsSync(packagePath)?JSON.parse(fs.readFileSync(packagePath,'utf8')):sourceReel),channelFolder:folder};
   if(voiced&&!reel.audio)throw new Error(reel.id+' is missing aligned voice props');
   validate(reel);
   const outputDir=proof?path.join(out,'proofs'):out;fs.mkdirSync(outputDir,{recursive:true});
   const outputLocation=path.join(outputDir,name+'.mp4');
   const inputProps={channel:channelInfo,reel};
   if(stillsOnly) {
    stats.status='reviewing';stats.reels[reel.id]={status:'reviewing'};save();
    const composition=await selectComposition({serveUrl,id:reel.id,inputProps,puppeteerInstance:browser,logLevel:'error'});
    const reviewDir=path.join(out,'review',name);fs.mkdirSync(reviewDir,{recursive:true});
    for(let i=0;i<reel.scenes.length;i++) {
     const scene=reel.scenes[i];
     await renderStill({serveUrl,composition,inputProps,output:path.join(reviewDir,`scene ${i+1}.png`),frame:Math.min(Math.round((scene.start+(scene.end-scene.start)*.55)*30),composition.durationInFrames-1),imageFormat:'png',puppeteerInstance:browser,logLevel:'error'});
     if(i>0)await renderStill({serveUrl,composition,inputProps,output:path.join(reviewDir,`transition ${i}.png`),frame:Math.round(scene.start*30)+8,imageFormat:'png',puppeteerInstance:browser,logLevel:'error'});
    }
    stats.completed++;stats.reels[reel.id]={status:'review-frames-complete',output:reviewDir};save();console.log(`${folder} / ${name}: 6 scenes + 5 transition frames`);continue;
   }
   const signature=hash({reel,channelInfo,engine:fs.readFileSync(path.join(root,'studio-kit/src/Engine.tsx'),'utf8'),visuals:fs.readFileSync(path.join(root,'studio-kit/src',folder==='TOMORROW-EXE'?'TomorrowVisuals.tsx':folder==='BUILDMode-AI'?'BuildVisuals.tsx':'ToolVisuals.tsx'),'utf8'),proof,framesArg,audioHash:reel.audio?crypto.createHash('sha256').update(fs.readFileSync(path.join(project,'public',reel.audio))).digest('hex'):null});
   const receipt=outputLocation+'.json';
   if(fs.existsSync(outputLocation)&&fs.existsSync(receipt)&&JSON.parse(fs.readFileSync(receipt,'utf8')).signature===signature) {
    stats.reels[reel.id]={status:'verified-cache',output:outputLocation};stats.completed++;save();continue;
   }
   stats.status='rendering';stats.reels[reel.id]={status:'rendering',output:outputLocation,progress:0};save();
   console.log(`${folder} / ${name}: rendering ${reel.durationSeconds}s (${stats.completed+1}/${reels.length})`);
   const composition=await selectComposition({serveUrl,id:reel.id,inputProps,puppeteerInstance:browser,logLevel:'error'});
   const frameRange=framesArg?framesArg.split('-').map(Number):proof?[0,Math.min(89,composition.durationInFrames-1)]:undefined;
   let last=0;
   await renderMedia({serveUrl,composition,inputProps,codec:'h264',outputLocation,crf:18,imageFormat:'png',pixelFormat:'yuv420p',concurrency,puppeteerInstance:browser,logLevel:'error',overwrite:true,frameRange,onProgress:p=>{if(Date.now()-last>5000){stats.reels[reel.id].progress=Number(p.progress.toFixed(3));save();last=Date.now();}}});
   await renderStill({serveUrl,composition,inputProps,output:path.join(out,name+'.png'),frame:Math.min(Math.round(reel.scenes[0].end*30*.55),composition.durationInFrames-1),imageFormat:'png',puppeteerInstance:browser,logLevel:'error'});
   fs.writeFileSync(receipt,JSON.stringify({signature,id:reel.id,title:reel.title,status:reel.visualStatus??'directed-illustration',audio:voiced?'included':'deferred',renderedAt:new Date().toISOString()},null,2)+'\n');
   stats.reels[reel.id]={status:'complete',output:outputLocation,progress:1};stats.completed++;save();
   console.log(`${folder} / ${name}: complete`);
  }
  stats.status='complete';save();
 } finally {await browser.close({silent:true});}
}
console.log(`Render batch: ${folders.length} channel lanes, ${concurrency} frame workers per lane. No quality reduction.`);
Promise.allSettled(folders.map(channel)).then(results=>{
 let failed=false;
 results.forEach((r,i)=>{if(r.status==='rejected'){failed=true;state.channels[folders[i]].status='failed';state.channels[folders[i]].error=r.reason?.stack??String(r.reason);console.error(folders[i]+': '+r.reason);}});
 state.finishedAt=new Date().toISOString();save();process.exitCode=failed?1:0;
});
