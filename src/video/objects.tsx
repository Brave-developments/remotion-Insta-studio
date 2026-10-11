import React from 'react';
import {C, FONT, accentSoft} from './theme';
import {AgentMark, Icon} from './assets';

export const STAGE_WIDTH = 866;

/* ------------------------------------------------------------------ */
/* window chrome                                                       */
/* ------------------------------------------------------------------ */

export const WindowDots: React.FC<{dim?: number}> = ({dim = 1}) => (
  <div style={{display: 'flex', gap: 10, alignItems: 'center', opacity: dim}}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{width: 14, height: 14, borderRadius: 7, background: C.border}} />
    ))}
  </div>
);

/**
 * Browser window shell. Children render into the content slot, so scenes can
 * swap the whole interface underneath while the chrome stays continuous.
 */
export const BrowserFrame: React.FC<{
  url: string;
  tab?: string;
  accent?: string;
  width?: number;
  children: React.ReactNode;
}> = ({url, tab = 'agent', accent = C.blue, width = STAGE_WIDTH, children}) => (
  <div
    style={{
      width,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 26,
      overflow: 'hidden',
      boxShadow: '0 44px 96px rgba(0,0,0,0.62)',
    }}
  >
    <div style={{padding: '20px 24px 0'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <WindowDots />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: C.surfaceRaised,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: '13px 13px 0 0',
            padding: '9px 18px',
            marginBottom: -15,
            fontFamily: FONT.mono,
            fontSize: 20,
            color: C.textDim,
          }}
        >
          <Icon name="browser" size={18} color={accent} />
          {tab}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 13,
          margin: '0 0 18px',
          padding: '13px 20px',
          background: C.bgSoft,
          border: `1px solid ${C.borderSoft}`,
          borderRadius: 13,
        }}
      >
        <Icon name="shield-check" size={20} color={C.textFaint} />
        <span style={{fontFamily: FONT.mono, fontSize: 22, color: C.textFaint}}>{url}</span>
      </div>
    </div>
    <div style={{padding: '0 24px 24px'}}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* chat                                                                */
/* ------------------------------------------------------------------ */

export type ChatMsg = {from: 'user' | 'bot'; text: string};

/** Chat bubble. `p` is 0..1 entrance progress for this bubble. */
export const ChatBubble: React.FC<{
  msg: ChatMsg;
  p: number;
  accent?: string;
  maxWidth?: number;
}> = ({msg, p, accent = C.blue, maxWidth = 460}) => {
  if (p <= 0.004) return null;
  const user = msg.from === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: user ? 'flex-end' : 'flex-start',
        opacity: p,
        transform: `translateY(${((1 - p) * 22).toFixed(2)}px)`,
      }}
    >
      <div
        style={{
          maxWidth,
          padding: '15px 22px',
          borderRadius: 20,
          borderBottomRightRadius: user ? 6 : 20,
          borderBottomLeftRadius: user ? 20 : 6,
          background: user ? accentSoft(accent, 0.22) : C.surfaceRaised,
          border: `1px solid ${user ? accentSoft(accent, 0.5) : C.border}`,
          color: user ? C.text : C.textDim,
          fontSize: 27,
          fontWeight: 550,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}
      >
        {msg.text}
      </div>
    </div>
  );
};

/**
 * A chat window. Reused across scenes 2, 3, 11 and 14 so the same object
 * literally carries through the film.
 */
export const ChatWindow: React.FC<{
  title?: string;
  messages: ChatMsg[];
  /** absolute local frame used for bubble stagger */
  local: number;
  startAt?: number;
  step?: number;
  accent?: string;
  width?: number;
  /** draws a lock bar across the window when 1 */
  locked?: number;
  children?: React.ReactNode;
}> = ({title, messages, local, startAt = 0, step = 9, accent = C.blue, width = 520, locked, children}) => (
  <div
    style={{
      position: 'relative',
      width,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 26,
      overflow: 'hidden',
      boxShadow: '0 40px 84px rgba(0,0,0,0.6)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '18px 22px',
        borderBottom: `1px solid ${C.borderSoft}`,
      }}
    >
      <WindowDots />
      <span style={{flex: 1}} />
      <AgentMark size={26} accent={accent} />
      <span style={{fontSize: 22, fontWeight: 700, color: C.textDim}}>{title}</span>
      <span style={{flex: 1}} />
    </div>

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 24,
        minHeight: 300,
      }}
    >
      {messages.map((m, i) => (
        <ChatBubble
          key={i}
          msg={m}
          p={clamp01((local - (startAt + i * step)) / 14)}
          accent={accent}
          maxWidth={width * 0.72}
        />
      ))}
      {children}
    </div>

    {locked !== undefined && locked > 0.01 ? (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `rgba(5,5,6,${(locked * 0.55).toFixed(3)})`,
          opacity: locked,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '18px 30px',
            borderRadius: 18,
            background: C.surfaceRaised,
            border: `1px solid ${accent}`,
            transform: `scale(${(0.86 + locked * 0.14).toFixed(3)})`,
          }}
        >
          <Icon name="shield-check" size={34} color={accent} />
          <span style={{fontSize: 30, fontWeight: 750, color: C.text, letterSpacing: '-0.02em'}}>
            trapped
          </span>
        </div>
      </div>
    ) : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* tiles, nodes, chips                                                 */
/* ------------------------------------------------------------------ */

export const AppTile: React.FC<{
  label: string;
  icon?: string;
  p?: number;
  accent?: string;
  size?: number;
  active?: boolean;
  style?: React.CSSProperties;
}> = ({label, icon, p = 1, accent = C.violet, size = 158, active = false, style}) => {
  if (p <= 0.004) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: active ? accentSoft(accent, 0.2) : C.surfaceRaised,
        border: `1px solid ${active ? accent : C.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: p,
        transform: `scale(${(0.7 + 0.3 * p).toFixed(4)})`,
        boxShadow: active ? `0 16px 40px ${accentSoft(accent, 0.28)}` : undefined,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={size * 0.3} color={active ? accent : C.textDim} /> : null}
      <span
        style={{
          fontSize: size * 0.145,
          fontWeight: 650,
          color: active ? C.text : C.textFaint,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Small labelled node used by the network / hub diagrams. */
export const NodeChip: React.FC<{
  label: string;
  icon?: string;
  p: number;
  accent?: string;
  emphasis?: number;
  x?: number;
  y?: number;
}> = ({label, icon, p, accent = C.violet, emphasis = 0, x, y}) => {
  if (p <= 0.004) return null;
  return (
    <div
      style={{
        position: x === undefined ? 'relative' : 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '15px 22px',
        borderRadius: 18,
        background: C.surface,
        border: `1px solid ${emphasis > 0.5 ? accent : C.border}`,
        opacity: p,
        transform: `translate(-50%, -50%) scale(${(0.78 + 0.22 * p).toFixed(4)})`,
        boxShadow: emphasis > 0.5 ? `0 14px 34px ${accentSoft(accent, 0.3)}` : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {icon ? <Icon name={icon} size={26} color={accent} /> : null}
      <span style={{fontSize: 26, fontWeight: 650, color: C.text, letterSpacing: '-0.02em'}}>
        {label}
      </span>
    </div>
  );
};

/** Accent rule that sweeps in — an alternative to boxing words in colour. */
export const SweepRule: React.FC<{p: number; accent?: string; width?: number}> = ({
  p,
  accent = C.violet,
  width = 340,
}) => {
  if (p <= 0.004) return null;
  return (
    <span
      style={{
        display: 'block',
        width,
        height: 7,
        borderRadius: 4,
        marginTop: 34,
        background: accent,
        transformOrigin: 'left center',
        transform: `scaleX(${clamp01(p).toFixed(4)})`,
        opacity: 0.95,
      }}
    />
  );
};

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
