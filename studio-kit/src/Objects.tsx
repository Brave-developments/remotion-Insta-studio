import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {ease} from './Motion';

export const colors = {lime: '#d2fb76', orange: '#ffad72', violet: '#b6a4fa', white: '#f3f0e9', muted: '#858580'};
export const Icon = ({kind, size = 48, color = colors.white}: {kind: string; size?: number; color?: string}) => {
  const paths: Record<string, ReactNode> = {
    Browser: <><rect x="5" y="8" width="38" height="32" rx="4"/><path d="M5 17H43M12 12h1m5 0h1M16 25h16M16 32h10"/></>,
    Code: <><path d="M17 13L5 24l12 11M31 13l12 11-12 11M28 8l-8 32"/></>,
    Mail: <><rect x="4" y="10" width="40" height="29" rx="4"/><path d="M5 12l19 16 19-16"/></>,
    Docs: <><path d="M12 4h17l9 9v31H12zM28 4v11h10M18 23h14M18 30h14M18 37h9"/></>,
    Calendar: <><rect x="6" y="10" width="36" height="33" rx="4"/><path d="M6 20h36M15 5v10M33 5v10M15 28h4m10 0h4m-18 8h4"/></>,
    Data: <><path d="M6 42h38M11 36V25h6v11M23 36V15h6v21M35 36V5h6v31"/></>,
    Search: <><circle cx="21" cy="21" r="14"/><path d="M31 31l12 12"/></>,
    Check: <path d="M9 25l10 10L40 12"/>,
    Agent: <><path d="M24 4l6 13 14 7-14 7-6 13-6-13L4 24l14-7z"/><circle cx="24" cy="24" r="5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[kind] ?? paths.Agent}</svg>;
};
export const BrowserWindow = ({children, title = 'Research workspace', style}: {children: ReactNode; title?: string; style?: React.CSSProperties}) => <div style={{background: '#121312', border: '1px solid #40413c', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px #0008', ...style}}>
  <div style={{height: 66, display: 'flex', alignItems: 'center', gap: 9, padding: '0 24px', background: '#20211e', borderBottom: '1px solid #393a35'}}>{['#6b6b66','#85857e','#a6a69c'].map(c => <span key={c} style={{width: 10, height: 10, background: c, borderRadius: 20}}/>)}<div style={{marginLeft: 22, fontSize: 20, color: '#c5c5bc', flex: 1}}>{title}</div><Icon kind="Agent" size={25} color={colors.lime}/></div>{children}
</div>;
export const Laptop = ({variant = 0, size = 400, open = 1}: {variant?: number; size?: number; open?: number}) => {
  const palette = [colors.lime, colors.violet, colors.orange][variant % 3];
  return <svg width={size} viewBox="0 0 500 340" style={{overflow: 'visible', filter: 'drop-shadow(0 24px 20px #0008)'}}>
    <defs><linearGradient id={`metal${variant}`} x2="0" y2="1"><stop stopColor="#c1c1ba"/><stop offset="0.4" stopColor="#484944"/><stop offset="1" stopColor="#8f9188"/></linearGradient><linearGradient id={`screen${variant}`} x2="1" y2="1"><stop stopColor="#262b22"/><stop offset="1" stopColor="#090b08"/></linearGradient></defs>
    <g transform={`translate(250 285) scale(1 ${Math.max(0.05, open)}) translate(-250 -285)`}><rect x="68" y="20" width="364" height="256" rx="15" fill={`url(#metal${variant})`}/><rect x="76" y="28" width="348" height="240" rx="9" fill="#060706"/><rect x="86" y="40" width="328" height="215" rx="3" fill={`url(#screen${variant})`}/><circle cx="250" cy="33" r="2" fill="#888"/><path d="M160 209L220 83l50 98 52-60 50 88Z" fill={palette} opacity=".18"/><path d="M111 210L192 151l58 32 60-71 79 60" stroke={palette} strokeWidth="2" fill="none"/><circle cx="250" cy="142" r="46" stroke={palette} fill="none" opacity=".5"/><text x="250" y="150" fill={palette} textAnchor="middle" fontSize="23" fontFamily="Segoe UI">{['AIR / 01','PRO / 02','STUDIO / 03'][variant % 3]}</text></g>
    <path d="M68 276h364l56 35H12z" fill={`url(#metal${variant})`} stroke="#989a91"/><path d="M12 311h476l-12 11H25z" fill="#555750"/><path d="M196 280h108l12 22H184z" fill="#62655c"/><path d="M95 282h75m160 0h75M77 290h86m174 0h86" stroke="#383a35" strokeWidth="4"/>
  </svg>;
};
export const Network = ({progress = 1, compact = false}: {progress?: number; compact?: boolean}) => {
  const frame = useCurrentFrame();
  const labels = ['Browser','Code','Mail','Calendar','Docs','Data'];
  return <div style={{position: 'relative', width: 880, height: compact ? 620 : 880}}>
    <svg width="880" height={compact ? 620 : 880} style={{position: 'absolute'}}>{labels.map((_, i) => {
      const angle = i * Math.PI / 3 - Math.PI / 2;
      const x = 440 + Math.cos(angle) * 305;
      const y = (compact ? 310 : 440) + Math.sin(angle) * (compact ? 230 : 305);
      const p = ease(frame, 10 + i * 5, 40 + i * 5) * progress;
      return <g key={i}><path d={`M440 ${compact ? 310 : 440} L${x} ${y}`} stroke="#3c3e36" strokeWidth="2"/><path d={`M440 ${compact ? 310 : 440} L${x} ${y}`} pathLength="1" stroke={colors.lime} strokeWidth="2" strokeDasharray="1" strokeDashoffset={1-p}/><circle cx={440 + (x-440) * ((frame / 80 + i/6) % 1)} cy={(compact ? 310 : 440) + (y-(compact ? 310 : 440)) * ((frame / 80 + i/6) % 1)} r="4" fill={colors.lime} opacity={p}/></g>;
    })}</svg>
    {labels.map((label, i) => {const a = i * Math.PI/3 - Math.PI/2; return <div key={label} style={{position: 'absolute', left: 440 + Math.cos(a) * 305 - 66, top: (compact ? 310 : 440) + Math.sin(a) * (compact ? 230 : 305) - 60, width: 132, height: 120, background: '#161714', border: '1px solid #414338', borderRadius: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 9, opacity: ease(frame, i*4, i*4+15)}}><Icon kind={label} size={40}/><span style={{fontSize: 20, color: '#b5b6ac'}}>{label}</span></div>})}
    <div style={{position: 'absolute', left: 340, top: (compact ? 310 : 440)-100, width: 200, height: 200, borderRadius: '50%', border: `1px solid ${colors.lime}`, background: '#242a1a', display: 'grid', placeItems: 'center', boxShadow: '0 0 80px #d2fb7610'}}><Icon kind="Agent" size={105} color={colors.lime}/></div>
  </div>;
};
