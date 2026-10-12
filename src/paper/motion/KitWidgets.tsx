/**
 * Paper-colour adaptations of Brave-developments/remotion-motion-kit:
 * components/MetricReveal.tsx and components/BrowserReveal.tsx.
 * Keep the source credit when reusing or modifying these animation patterns.
 * Inputs are genuine evidence/images supplied by the paper media pipeline.
 */
import React from 'react';
import {Img, interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ink = '#39352F';
const line = '#D9D0C2';

export const KitMetric: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  source?: string;
}> = ({label, value, suffix = '', source}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const current = interpolate(frame, [0, fps * 1.1], [0, value], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{background: '#FFFDF8', border: '2px solid ' + line, padding: 50,
      borderRadius: 22, boxShadow: '13px 17px 0 #E9E0D2'}}>
    <div style={{fontSize: 32, color: '#706A62', letterSpacing: 2}}>{label.toUpperCase()}</div>
    <div style={{fontFamily: 'Georgia, serif', fontSize: 174, color: ink, letterSpacing: -9,
      fontWeight: 700, lineHeight: 1.2}}>
      {Math.round(current).toLocaleString('en-US')}<span style={{fontSize: 72, color: '#997D63'}}>{suffix}</span>
    </div>
    {suffix === '%' ? <div style={{height: 12, background: '#E8DFD2', borderRadius: 12, overflow: 'hidden'}}>
      <div style={{height: '100%', width: Math.max(0, Math.min(100, current)) + '%',
        background: '#A7957D'}}/>
    </div> : <div style={{borderTop: '2px solid #D9D0C2'}}/>}
    {source ? <div style={{fontSize: 21, marginTop: 28, color: '#767067'}}>{source}</div> : null}
  </div>;
};

export const KitBrowser: React.FC<{
  image: string;
  address: string;
  title: string;
}> = ({image, address, title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * .55], [0, 1], clamp);
  const zoom = interpolate(frame, [0, fps * 5], [1, 1.045], clamp);
  return <div style={{opacity, transform: 'translateY(' + ((1 - opacity) * 58) + 'px)',
    border: '3px solid #D5CBBD', borderRadius: 22, overflow: 'hidden', background: '#FFFDF8',
    boxShadow: '16px 22px 0 #E2D9C9'}}>
    <div style={{display: 'flex', gap: 12, alignItems: 'center', padding: '28px 30px',
      borderBottom: '2px solid ' + line}}>
      {['#D9B7A8', '#E5D6B0', '#BED4C5'].map(c =>
        <div key={c} style={{height: 17, width: 17, borderRadius: 30, background: c}}/>)}
      <div style={{marginLeft: 25, fontSize: 23, color: '#6D665E', overflow: 'hidden',
        whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{address}</div>
    </div>
    <div style={{height: 780, overflow: 'hidden'}}>
      <Img src={image} alt={title} style={{width: '100%', height: '100%', objectFit: 'contain',
        objectPosition: 'top', transform: 'scale(' + zoom + ')'}}/>
    </div>
  </div>;
};
