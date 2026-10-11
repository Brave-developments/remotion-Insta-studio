import type {CSSProperties, ReactNode} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const ease = (frame: number, start: number, end: number, from = 0, to = 1) => interpolate(frame, [start, end], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
export const useMotion = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 22, stiffness: 110, mass: 0.8}});
};
export const CameraWrapper = ({children, style, depth = 1}: {children: ReactNode; style?: CSSProperties; depth?: number}) => {
  const frame = useCurrentFrame();
  return <div style={{transform: `perspective(1600px) translateY(${-frame * 0.055 * depth}px) scale(${1 + frame * 0.00013 * depth})`, transformOrigin: '50% 45%', ...style}}>{children}</div>;
};
export const Cursor = ({x, y, click = false}: {x: number; y: number; click?: boolean}) => <div style={{position: 'absolute', left: x, top: y, zIndex: 20, pointerEvents: 'none'}}>
  {click && <div style={{position: 'absolute', width: 64, height: 64, border: '2px solid #d2fb76', borderRadius: '50%', left: -24, top: -24, opacity: 0.7}}/>}
  <svg width="38" height="46" viewBox="0 0 38 46"><path d="M3 3 L3 35 L13 27 L21 42 L28 38 L20 24 L33 23 Z" fill="#faf9f5" stroke="#101010" strokeWidth="3"/></svg>
</div>;
export const TypingInput = ({text, start = 15, end = 80}: {text: string; start?: number; end?: number}) => {
  const frame = useCurrentFrame();
  const count = Math.floor(interpolate(frame, [start, end], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <>{text.slice(0, count)}<span style={{color: '#d2fb76', opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0}}>│</span></>;
};
export const ProgressRing = ({progress, size = 220, color = '#d2fb76', children}: {progress: number; size?: number; color?: string; children?: ReactNode}) => <div style={{width: size, height: size, position: 'relative', display: 'grid', placeItems: 'center'}}>
  <svg viewBox="0 0 200 200" style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}><circle cx="100" cy="100" r="88" fill="none" stroke="#292929" strokeWidth="3"/><circle cx="100" cy="100" r="88" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={553} strokeDashoffset={553 * (1 - progress)}/></svg>{children}
</div>;
