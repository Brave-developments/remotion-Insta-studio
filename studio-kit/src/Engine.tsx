import type {ReactNode} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CameraWrapper, Cursor, ease, ProgressRing, TypingInput} from './Motion';
import {Icon} from './Objects';
import {SceneTransition, TRANSITION_FRAMES} from './SceneTransition';
import type {Channel, Reel, ReelScene} from './types';
import {TomorrowVisuals} from './TomorrowVisuals';
import {BuildVisuals} from './BuildVisuals';
import {ToolVisuals} from './ToolVisuals';

const CaptionRenderer = ({text, duration, channel, chunks, timings}: {text: string; duration: number; channel: Channel; chunks?: string[]; timings?: {text: string; start: number; end: number}[]}) => {
  const frame = useCurrentFrame();
  if (frame >= duration || text.startsWith('[')) return null;
  const timedCaption=timings?.find(c=>frame/30>=c.start&&frame/30<c.end);
  if(timings&&!timedCaption)return null;
  const words = text.split(/\s+/);
  const groups=chunks??words.reduce<string[]>((list,word,i)=>{
    if(i%6===0 && !(i===words.length-1&&list.length))list.push(word);
    else list[list.length-1]+=' '+word;
    return list;
  },[]);
  const total=groups.reduce((sum,group)=>sum+group.split(/\s+/).length,0);
  const wordAt=Math.floor(frame/duration*total);
  let chunk=0,seen=0;
  for(let i=0;i<groups.length;i++) {seen+=groups[i].split(/\s+/).length;if(wordAt<seen){chunk=i;break;}}
  return <div style={{position:'absolute',left:90,right:90,bottom:170,textAlign:'center',zIndex:30}}>
    <div style={{display:'inline-block',fontSize:36,lineHeight:1.25,padding:'18px 22px',background:channel.palette.background+'ed',borderTop:`1px solid ${channel.palette.muted}55`}}>
      {timedCaption?.text??groups[chunk]}
    </div>
  </div>;
};

const Backdrop = ({channel, children, draft = false, edition, voiced = false}: {channel: Channel; children: ReactNode; draft?: boolean; edition?: string; voiced?: boolean}) => <AbsoluteFill style={{background:channel.palette.background,color:channel.palette.text,fontFamily:'Segoe UI, Arial, sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{background:`radial-gradient(ellipse at 65% 35%, ${channel.palette.accent}0e, transparent 65%)`}}/>
  <div style={{position:'absolute',left:80,right:80,top:76,display:'flex',justifyContent:'space-between',fontFamily:'Consolas, monospace',fontSize:21,letterSpacing:2,color:channel.palette.muted}}><span>{channel.name}</span><span>{edition?(voiced?'VOICED EDITION':'SILENT EDITION'):draft?'PRODUCTION DRAFT':'MOTION STUDY'}</span></div>
  <div style={{position:'absolute',left:35,right:35,top:128,height:1,background:channel.palette.muted+'35'}}/>
  {children}
  {(edition||draft) && <div style={{position:'absolute',left:80,right:80,bottom:78,fontSize:19,letterSpacing:1,color:channel.palette.muted,textAlign:'center'}}>{edition??'PLANNED CONTENT / MEDIA AND FACTUAL REVIEW PENDING'}</div>}
</AbsoluteFill>;

const Stage = ({children}: {children: ReactNode}) => <div style={{position:'absolute',inset:'215px 80px 340px',display:'flex',flexDirection:'column',justifyContent:'center'}}>{children}</div>;
const Heading = ({children, size = 90}: {children: ReactNode; size?: number}) => <div style={{fontSize:size,fontWeight:650,letterSpacing:-3.5,lineHeight:1.04}}>{children}</div>;

export const BrowserInteraction = ({channel, children, title}: {channel: Channel; children: ReactNode; title: string}) => <div style={{border:`1px solid ${channel.palette.muted}66`,borderRadius:20,background:channel.palette.panel,overflow:'hidden',boxShadow:'0 35px 90px #0006'}}>
  <div style={{height:65,borderBottom:`1px solid ${channel.palette.muted}33`,display:'flex',alignItems:'center',gap:8,padding:'0 24px'}}>{[0,1,2].map(n=><div key={n} style={{height:9,width:9,background:channel.palette.muted,borderRadius:'50%'}}/>)}<div style={{fontSize:21,color:channel.palette.muted,marginLeft:20}}>{title}</div></div>{children}
</div>;

export const AgentGraph = ({channel}: {channel: Channel}) => {
  const frame = useCurrentFrame();
  const labels=['GOAL','BUILD','TEST','REVIEW'];
  return <div style={{height:600,position:'relative'}}><svg width="920" height="600" style={{position:'absolute'}}>{labels.map((_,i)=>{
    const angle=i*Math.PI/2-Math.PI/4;
    const x=460+Math.cos(angle)*295,y=300+Math.sin(angle)*220;
    const p=ease(frame,i*8,i*8+35);
    return <g key={i}><path d={`M460 300 L${x} ${y}`} stroke={channel.palette.muted+'55'} strokeWidth="2"/><path d={`M460 300 L${x} ${y}`} stroke={channel.palette.accent} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/></g>;
  })}</svg>{labels.map((label,i)=>{const a=i*Math.PI/2-Math.PI/4;return <div key={label} style={{position:'absolute',left:460+Math.cos(a)*295-70,top:300+Math.sin(a)*220-38,width:140,height:76,border:`1px solid ${channel.palette.muted}66`,background:channel.palette.panel,display:'grid',placeItems:'center',fontSize:21,letterSpacing:2,opacity:ease(frame,i*8,i*8+20)}}>{label}</div>})}<div style={{position:'absolute',left:370,top:210,height:180,width:180,borderRadius:'50%',background:channel.palette.panel,border:`1px solid ${channel.palette.accent}`,display:'grid',placeItems:'center'}}><Icon kind="Agent" size={95} color={channel.palette.accent}/></div></div>;
};

export const TimelineScene = ({channel}: {channel: Channel}) => {
  const frame=useCurrentFrame();
  return <div style={{height:360,position:'relative',marginTop:40}}><div style={{position:'absolute',left:35,right:35,top:150,height:2,background:channel.palette.muted+'55'}}/><div style={{position:'absolute',left:35,top:148,height:5,width:ease(frame,0,90,0,810),background:channel.palette.accent}}/>{['REAL TODAY','WHAT IF','CONSEQUENCE'].map((v,i)=><div key={v} style={{position:'absolute',left:i*305,top:110,width:260,textAlign:'center'}}><div style={{margin:'0 auto 38px',height:80,width:80,border:`1px solid ${channel.palette.accent}`,background:channel.palette.panel,borderRadius:'50%',display:'grid',placeItems:'center'}}><Icon kind={['Search','Agent','Calendar'][i]} size={40} color={i===2?channel.palette.secondary:channel.palette.accent}/></div><span style={{fontSize:18,letterSpacing:2,color:channel.palette.muted}}>{v}</span></div>)}</div>;
};

export const CinematicImageScene = ({channel, asset}: {channel: Channel; asset?: string | null}) => {
  const frame=useCurrentFrame();
  if(asset) return <CameraWrapper depth={0.6}><Img src={staticFile(asset)} style={{width:'100%',height:690,objectFit:'cover',borderRadius:12}}/></CameraWrapper>;
  return <div style={{height:600,position:'relative',overflow:'hidden',borderBottom:`1px solid ${channel.palette.muted}55`}}>
    <svg viewBox="0 0 920 600" width="920" height="600" style={{transform:`translateX(${-frame*.12}px) scale(${1+frame*.0004})`,transformOrigin:'center'}}>
      <circle cx="670" cy="150" r="88" fill="none" stroke={channel.palette.accent} strokeWidth="2" opacity=".5"/>
      {[100,210,140,300,180,260,140,330,170,220].map((h,i)=><g key={i}><rect x={i*98} y={600-h} width="78" height={h} fill={i%2?channel.palette.panel:channel.palette.accent+'18'} stroke={channel.palette.muted+'44'}/>{[0,1,2].map(n=><path key={n} d={`M${i*98+14} ${600-h+28+n*30}h47`} stroke={channel.palette.accent} opacity=".45"/>)}</g>)}
      <path d="M0 590h920M100 600L460 390L820 600" fill="none" stroke={channel.palette.accent} opacity=".3"/>
    </svg><div style={{position:'absolute',left:0,bottom:25,fontSize:17,letterSpacing:2,color:channel.palette.muted}}>ORIGINAL VECTOR STUDY / ADD CINEMATIC ASSETS FOR THE STORY</div>
  </div>;
};

export const PhoneScene = ({channel}: {channel: Channel}) => {
  const frame=useCurrentFrame();
  return <div style={{height:610,display:'grid',placeItems:'center'}}><div style={{width:340,height:580,border:`2px solid ${channel.palette.muted}88`,borderRadius:42,background:channel.palette.panel,padding:30,transform:`perspective(1300px) rotateY(${ease(frame,0,100,-9,4)}deg)`}}><div style={{width:105,height:18,borderRadius:20,margin:'0 auto 55px',background:channel.palette.background}}/><Icon kind="Agent" size={85} color={channel.palette.accent}/><div style={{fontSize:34,marginTop:40}}>Imagine<br/>what comes next.</div><div style={{height:2,marginTop:35,width:ease(frame,5,80,0,240),background:channel.palette.secondary}}/><div style={{fontSize:20,color:channel.palette.muted,marginTop:40}}>Fictional interface<br/>Concept study</div></div></div>;
};

export const ScoreBoard = ({channel}: {channel: Channel}) => <div style={{marginTop:60,borderTop:`1px solid ${channel.palette.muted}55`,paddingTop:35,display:'flex',alignItems:'center',gap:40}}><ProgressRing progress={0} color={channel.palette.accent} size={190}><span style={{fontSize:50,color:channel.palette.muted}}>—</span></ProgressRing><div><div style={{fontSize:34}}>Result pending</div><div style={{fontSize:22,color:channel.palette.muted,marginTop:12}}>Run the test. Record the evidence.</div></div></div>;

const DemoScene = ({channel,index}: {channel: Channel; index: number}) => {
  const frame=useCurrentFrame();
  const future=channel.name==='TOMORROW.EXE';
  const proof=channel.name==='TOOLPROOF';
  return <Stage>
    <div style={{fontFamily:'Consolas, monospace',fontSize:21,letterSpacing:3,color:channel.palette.accent,marginBottom:30}}>{['THE PREMISE','SHOW THE ACTION','THE STANDARD'][index]}</div>
    <Heading>{index===0?(future?'A possible future.':proof?'A claim needs proof.':'One task. Real work.'):index===1?(future?'Reality, then what if.':proof?'Test the useful part.':'From goal to action.'):(future?'Make the viewer think.':proof?'Evidence earns the verdict.':'Show what happened.')}</Heading>
    <div style={{marginTop:60}}>{index===0?(future?<CinematicImageScene channel={channel}/>:proof?<div style={{display:'flex',justifyContent:'center'}}><ProgressRing progress={ease(frame,10,100)} color={channel.palette.accent} size={430}><Icon kind="Search" size={140} color={channel.palette.accent}/></ProgressRing></div>:<AgentGraph channel={channel}/>):index===1?(future?<TimelineScene channel={channel}/>:<BrowserInteraction channel={channel} title="Illustrative motion study"><div style={{height:410,padding:40,position:'relative'}}><div style={{fontSize:21,color:channel.palette.muted,marginBottom:30}}>ONE CLEAR TASK</div><div style={{fontFamily:'Consolas, monospace',fontSize:34,lineHeight:1.4}}><TypingInput text={proof?'Test the claim. Record the result.':'Build. Test. Review the result.'} start={15} end={80}/></div><Cursor x={ease(frame,0,18,730,210)} y={ease(frame,0,18,320,140)} click={frame>18&&frame<25}/><div style={{position:'absolute',left:40,bottom:35,fontSize:19,color:channel.palette.muted}}>Illustrative UI, not experimental evidence</div></div></BrowserInteraction>):future?<PhoneScene channel={channel}/>:<ScoreBoard channel={channel}/>}</div>
  </Stage>;
};

export const BrandPreview = ({channel}: {channel: Channel}) => <Backdrop channel={channel}>
  {[0,1,2].map((index)=><Sequence key={index} from={index*120} durationInFrames={120+(index===2?0:TRANSITION_FRAMES)}><SceneTransition durationFrames={120} sceneIndex={index} lastScene={index===2}><DemoScene channel={channel} index={index}/></SceneTransition></Sequence>)}
  <div style={{position:'absolute',left:80,right:80,bottom:170,fontSize:25,color:channel.palette.muted,textAlign:'center'}}>{channel.position}</div>
</Backdrop>;

const AuthoredSceneMotion = ({scene,duration,children}: {scene: ReelScene; duration: number; children: ReactNode}) => {
  const frame=useCurrentFrame();
  const camera=scene.camera;
  if(!camera) return <>{children}</>;
  const scale=ease(frame,0,duration,camera.fromScale,camera.toScale);
  const x=ease(frame,0,duration,camera.fromX,camera.toX);
  return <AbsoluteFill style={{transform:`translateX(${x}px) scale(${scale})`,transformOrigin:'50% 48%'}}>{children}</AbsoluteFill>;
};

const SceneBody = ({scene,channel}: {scene: ReelScene; channel: Channel}) => <Stage>
  <div style={{fontSize:20,color:channel.palette.accent,letterSpacing:3,marginBottom:28}}>{scene.type.toUpperCase()}</div>
  <Heading size={scene.type==='hook'?94:76}>{scene.text}</Heading>
  <div style={{marginTop:55}}>{scene.asset?(scene.assetKind==='video'?<OffthreadVideo src={staticFile(scene.asset)} style={{width:'100%',height:660,objectFit:'contain'}}/>:<CinematicImageScene channel={channel} asset={scene.asset}/>):scene.type==='cinematic'?<CinematicImageScene channel={channel}/>:scene.type==='phone'?<PhoneScene channel={channel}/>:scene.type==='workflow'?<AgentGraph channel={channel}/>:scene.type==='result'?(channel.name==='TOMORROW.EXE'?<TimelineScene channel={channel}/>:<ScoreBoard channel={channel}/>):scene.type==='evidence'?<div style={{height:510,border:`1px dashed ${channel.palette.muted}66`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:25,color:channel.palette.muted}}><Icon kind="Browser" size={120} color={channel.palette.muted}/><div style={{fontSize:30}}>Add the actual recording</div><div style={{fontSize:22}}>Scene asset path in week-1/remotion-week.json</div></div>:<div style={{height:400,display:'grid',placeItems:'center'}}><Icon kind={scene.type==='question'?'Search':'Agent'} size={200} color={channel.palette.accent}/></div>}</div>
</Stage>;

const DirectedScene = ({channel,reel,scene,sceneIndex,duration}: {channel: Channel; reel: Reel; scene: ReelScene; sceneIndex: number; duration: number}) => {
  const frame=useCurrentFrame();
  const text=scene.presentationText??scene.text;
  const label=channel.name==='TOMORROW.EXE'?'A POSSIBLE FUTURE':channel.name==='BUILDMode AI'?'BUILD / EXPERIMENT PLAN':'TOOL / WORKFLOW STUDY';
  const textOpacity=(sceneIndex===0?1:ease(frame,8,22))*(1-ease(frame,duration-12,duration));
  return <>
    <div style={{position:'absolute',left:80,right:80,top:196,opacity:textOpacity}}>
      <div style={{fontFamily:'Consolas, monospace',fontSize:20,letterSpacing:3,color:channel.palette.accent,marginBottom:23}}>{label}</div>
      <Heading size={text.length>40?68:text.length>27?78:94}>{text}</Heading>
    </div>
    <div style={{position:'absolute',left:80,top:475,width:920,height:850}}>
      {channel.name==='TOMORROW.EXE'?<TomorrowVisuals reel={reel} scene={scene} sceneIndex={sceneIndex} channel={channel}/>:channel.name==='BUILDMode AI'?<BuildVisuals reel={reel} scene={scene} sceneIndex={sceneIndex} channel={channel}/>:<ToolVisuals reel={reel} scene={scene} sceneIndex={sceneIndex} channel={channel}/>}
    </div>
    <div style={{position:'absolute',left:80,right:80,top:1410,height:2,background:channel.palette.muted+'25'}}><div style={{height:2,width:`${ease(frame,0,duration)*100}%`,background:channel.palette.accent,opacity:.6}}/></div>
  </>;
};

export const PlannedReel = ({channel,reel}: {channel: Channel; reel: Reel}) => <Backdrop channel={channel} draft={!reel.productionReady} voiced={!!reel.audio} edition={channel.name==='TOMORROW.EXE'?'SPECULATIVE STORY / ORIGINAL ILLUSTRATIONS':channel.name==='BUILDMode AI'?'ILLUSTRATIVE BUILD / EXTERNAL EXPERIMENT RESULTS NOT CLAIMED':'ILLUSTRATIVE WORKFLOW / MATCHED TEST RESULTS NOT CLAIMED'}>
  {reel.audio && <Audio src={staticFile(reel.audio)}/>}
  {reel.scenes.map((scene,index)=>{
    const from=Math.round(scene.start*30),duration=Math.round(scene.end*30)-from,lastScene=index===reel.scenes.length-1;
    return <Sequence key={scene.id} from={from} durationInFrames={duration+(lastScene?0:TRANSITION_FRAMES)}>
      <SceneTransition durationFrames={duration} sceneIndex={index} lastScene={lastScene} incomingKind={index>0?reel.scenes[index-1].transition:undefined} outgoingKind={scene.transition}><AuthoredSceneMotion scene={scene} duration={duration}><DirectedScene channel={channel} reel={reel} scene={scene} sceneIndex={index} duration={duration}/></AuthoredSceneMotion></SceneTransition>
      <CaptionRenderer text={scene.presentationNarration??scene.narration} duration={duration} channel={channel} chunks={scene.presentationNarration?undefined:scene.captionChunks} timings={scene.captionTimings}/>
    </Sequence>;
  })}
</Backdrop>;
