import type {ReactNode} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const WindowFrame = ({title, children}: {title: string; children: ReactNode}) => (
  <div
    style={{
      width: 900,
      minHeight: 720,
      border: `1px solid ${theme.line}`,
      backgroundColor: '#0D1015',
      borderRadius: 30,
      boxShadow: '0 34px 120px rgba(0,0,0,0.45)',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        height: 70,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 10,
        borderBottom: `1px solid ${theme.line}`,
        backgroundColor: '#11151B'
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 13, height: 13, borderRadius: 99, backgroundColor: '#343B47'}} />
      ))}
      <div style={{marginLeft: 16, color: theme.muted, fontSize: 23, fontWeight: 650}}>{title}</div>
    </div>
    {children}
  </div>
);

export const CheckRow = ({label, index}: {label: string; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: Math.max(0, frame - 10 - index * 9), fps, config: {damping: 20, stiffness: 140}});
  return (
    <div
      style={{
        height: 92,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 24px',
        border: `1px solid ${theme.line}`,
        borderRadius: 20,
        backgroundColor: theme.panel,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [48, 0])}px)`
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: theme.blueSoft,
          color: theme.blue,
          fontWeight: 900,
          fontSize: 24
        }}
      >
        ✓
      </div>
      <div style={{fontSize: 31, fontWeight: 720}}>{label}</div>
    </div>
  );
};

export const MiniAppIcon = ({label, index = 0}: {label: string; index?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: Math.max(0, frame - index * 4), fps, config: {damping: 16, stiffness: 160}});
  return (
    <div
      style={{
        width: 118,
        height: 118,
        borderRadius: 28,
        border: `1px solid ${theme.line}`,
        backgroundColor: theme.panel,
        display: 'grid',
        placeItems: 'center',
        fontSize: 22,
        fontWeight: 750,
        color: theme.muted,
        transform: `scale(${0.6 + p * 0.4})`,
        opacity: p
      }}
    >
      {label}
    </div>
  );
};

export const Arrow = ({width = 120}: {width?: number}) => (
  <svg width={width} height="40" viewBox="0 0 120 40" fill="none">
    <path d="M2 20H105" stroke={theme.blue} strokeWidth="5" strokeLinecap="round" />
    <path d="M91 7L106 20L91 33" stroke={theme.blue} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PulseDot = () => {
  const frame = useCurrentFrame();
  const p = (Math.sin(frame / 8) + 1) / 2;
  return (
    <div style={{position: 'relative', width: 22, height: 22}}>
      <div
        style={{
          position: 'absolute',
          inset: -10 * p,
          borderRadius: 99,
          border: `2px solid rgba(47,125,255,${0.45 - 0.3 * p})`
        }}
      />
      <div style={{position: 'absolute', inset: 3, borderRadius: 99, backgroundColor: theme.blue}} />
    </div>
  );
};
