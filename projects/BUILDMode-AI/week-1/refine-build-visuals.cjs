const fs=require('fs'),path=require('path');
const p=path.join(__dirname,'../../studio-kit/src/BuildVisuals.tsx');
let s=fs.readFileSync(p,'utf8');
s=s.replace('b===2?<Panel title="challenge.txt">','b===5?<RaceLanes frame={frame}/>:b===4?<Panel title="scorecard / await actual runs"><div style={{fontSize:44,lineHeight:1.2,marginBottom:30}}>Every score needs a verified check.</div><div style={{display:"flex",gap:20}}>{["Fixed","Unresolved","Regressions"].map(v=><div key={v} style={{flex:1,padding:22,border:"1px solid #334155",borderRadius:10}}><div style={{fontSize:25}}>{v}</div><div style={{fontSize:65,color:muted,marginTop:25}}>—</div></div>)}</div><div style={{marginTop:35,color:blue,fontSize:25}}>No winner before evidence.</div></Panel>:b===2?<Panel title="challenge.txt">');
let start=s.indexOf("    case 'D02R1':"),end=s.indexOf("    case 'D02R2':",start);
s=s.slice(0,start)+`    case 'D02R1':view=b===0?<Panel title="browser agent / assignment"><div style={{fontSize:47,lineHeight:1.2}}>Find five projects.<br/>Source every field.<br/><span style={{color:blue}}>Finish the task.</span></div><div style={{marginTop:40}}><Tag>No silent handoff</Tag></div></Panel>:<ResearchBeat frame={frame} beat={b}/>;break;\n`+s.slice(end);
s=s.replace('y={75-(20+Math.sin(i*.75)*14+Math.sin(frame/12+i)*8)} width="5" height={40+Math.sin(i*.75)*28+Math.sin(frame/12+i)*16}','y={75-Math.max(4,40+Math.sin(i*.75)*28+Math.sin(frame/12+i)*16)/2} width="5" height={Math.max(4,40+Math.sin(i*.75)*28+Math.sin(frame/12+i)*16)}');
fs.writeFileSync(p,s);
