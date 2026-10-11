import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {CaptionChunk} from '../types';

// Editorial captions use the script timing, pending a future voice-over recording.
export const CaptionBar = ({captions}: {captions: CaptionChunk[]}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const caption=captions.find(c=>f/fps>=c.start&&f/fps<c.end);
 if(!caption)return null;
 const words=caption.text.split(/\s+/);
 const active=Math.min(words.length-1,Math.floor(((f/fps-caption.start)/(caption.end-caption.start))*words.length));
 return <div style={{position:'absolute',left:90,right:90,bottom:135,zIndex:50,textAlign:'center'}}><div style={{display:'inline-block',background:'#080908e8',borderTop:'1px solid #45473c',padding:'22px 20px',fontSize:36,fontWeight:550,lineHeight:1.35,letterSpacing:-.6}}>{words.map((w,i)=><span key={i} style={{color:i===active?'#d2fb76':i<active?'#f3f0e9':'#a4a69a',marginRight:9}}>{w}</span>)}</div></div>;
};
