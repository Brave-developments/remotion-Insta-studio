import React from 'react';
import {useVideoConfig} from 'remotion';
import {clamp01, easeInOutCubic, easeOutQuint} from './motion';
import {accentSoft, C, FONT} from './theme';

/* ------------------------------------------------------------------ */
/* cursor                                                              */
/* ------------------------------------------------------------------ */

export type CursorPoint = {at: number; x: number; y: number};

/**
 * Deterministic typing schedule: pauses after punctuation, a beat after
 * spaces and a small per-character hesitation, so the typing looks human and
 * is identical on every render.
 */
export const typingSchedule = (text: string, startAt: number, cps: number): number[] => {
  const base = 30 / Math.max(1, cps);
  const times: number[] = [];
  let t = startAt;

  for (let i = 0; i < text.length; i++) {
    times.push(t);
    // pseudo-random-but-fixed variation keyed on the character index
    t += base * (0.78 + 0.44 * (((i * 37) % 11) / 11));
    const c = text[i];
    if ('.,?!:;\u2014'.includes(c)) t += 7;
    else if (c === ' ') t += 1.4;
    else if (i % 9 === 8) t += 2.5;
  }
  return times;
};

export const typedCount = (local: number, schedule: number[]): number => {
  let n = 0;
  while (n < schedule.length && local >= schedule[n]) n++;
  return n;
};

/**
 * Mouse pointer that eases between waypoints along a path and fires a click
 * ripple. Waypoints are in local scene frames and canvas pixels.
 */
export const Cursor: React.FC<{
  local: number;
  path: CursorPoint[];
  /** Local frame(s) at which a click ripple fires. */
  clickAt?: number | number[];
  fadeAt?: number;
  size?: number;
  accent?: string;
}> = ({local, path, clickAt, fadeAt, size = 46, accent = C.blue}) => {
  if (path.length === 0) return null;

  const first = path[0];
  const last = path[path.length - 1];

  let x = first.x;
  let y = first.y;

  if (local >= last.at) {
    x = last.x;
    y = last.y;
  } else if (local > first.at) {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      if (local >= a.at && local <= b.at) {
        const t = easeInOutCubic((local - a.at) / Math.max(1, b.at - a.at));
        x = a.x + (b.x - a.x) * t;
        y = a.y + (b.y - a.y) * t;
        break;
      }
    }
  }

  const fade = fadeAt === undefined ? 1 : 1 - clamp01((local - fadeAt) / 12);
  if (fade <= 0.01) return null;

  const clicks = clickAt === undefined ? [] : Array.isArray(clickAt) ? clickAt : [clickAt];

  let press = 1;
  let ripple: number | null = null;
  for (const at of clicks) {
    if (local >= at) {
      const p = clamp01((local - at) / 16);
      if (p < 1) ripple = p;
      if (local - at >= 0 && local - at < 12) press = 1 - Math.sin(Math.PI * clamp01((local - at) / 12)) * 0.22;
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        opacity: fade,
        zIndex: 40,
      }}
    >
      {ripple !== null ? (
        <span
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `3px solid ${accent}`,
            transform: `scale(${(1 + ripple * 3.4).toFixed(3)})`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}

      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          transform: `translate(-2px, -2px) scale(${press.toFixed(3)})`,
          transformOrigin: '0 0',
          filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.65))',
        }}
        aria-hidden
      >
        <path
          d="M5 2.5 L19 12.4 L12.2 13.4 L9.4 20.6 Z"
          fill="#FFFFFF"
          stroke="#0A0B0D"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* typing                                                              */
/* ------------------------------------------------------------------ */

/** Text that types itself character by character, with a blinking caret. */
export const TypingInput: React.FC<{
  local: number;
  schedule: number[];
  text: string;
  accent?: string;
  size?: number;
  /** Keep the caret blinking after the text is complete. */
  keepCaret?: boolean;
  style?: React.CSSProperties;
}> = ({local, schedule, text, accent = C.blue, size = 34, keepCaret = true, style}) => {
  const n = typedCount(local, schedule);
  const shown = text.slice(0, n);
  const complete = n >= text.length;
  const caretVisible = complete ? keepCaret && Math.floor(local / 8) % 2 === 0 : Math.floor(local / 8) % 2 === 0;

  return (
    <span style={{fontFamily: FONT.sans, fontSize: size, fontWeight: 600, ...style}}>
      {shown}
      <span
        style={{
          display: 'inline-block',
          width: Math.max(2, size * 0.06),
          height: size * 0.95,
          marginLeft: 3,
          verticalAlign: size * -0.12,
          background: caretVisible ? accent : 'transparent',
          opacity: caretVisible ? 1 : 0,
        }}
      />
      {n < text.length ? <span style={{opacity: 0}}>{text.slice(n)}</span> : null}
    </span>
  );
};

/** Single key that presses down when `pressed` is true. */
export const KeyCap: React.FC<{
  label: string;
  pressed?: number;
  accent?: string;
  width?: number;
}> = ({label, pressed = 0, accent = C.blue, width = 96}) => {
  const down = clamp01(pressed);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: width,
        height: 62,
        padding: '0 18px',
        borderRadius: 14,
        background: down > 0.05 ? accentSoft(accent, 0.28 + down * 0.3) : C.surfaceRaised,
        border: `1px solid ${down > 0.05 ? accent : C.border}`,
        color: down > 0.05 ? C.text : C.textDim,
        fontFamily: FONT.mono,
        fontSize: 24,
        fontWeight: 600,
        transform: `translateY(${(down * 3).toFixed(2)}px)`,
        boxShadow: down > 0.05 ? `0 ${4 - down * 3}px 0 rgba(0,0,0,0.6)` : '0 4px 0 rgba(0,0,0,0.45)',
      }}
    >
      {label}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* small shared controls                                               */
/* ------------------------------------------------------------------ */

/** Pill that reads as a live/running state. */
export const LiveDot: React.FC<{local: number; label: string; accent?: string}> = ({
  local,
  label,
  accent = C.green,
}) => {
  const pulse = 0.7 + 0.3 * Math.sin(local / 6);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 18px',
        borderRadius: 999,
        background: accentSoft(accent, 0.14),
        border: `1px solid ${accentSoft(accent, 0.45)}`,
      }}
    >
      <span
        style={{
          width: 11,
          height: 11,
          borderRadius: 6,
          background: accent,
          opacity: 0.5 + 0.5 * pulse,
          transform: `scale(${pulse.toFixed(3)})`,
        }}
      />
      <span style={{fontSize: 21, fontWeight: 700, color: accent, letterSpacing: '0.05em'}}>
        {label}
      </span>
    </span>
  );
};

/** Radial progress ring driven by 0..1 progress. */
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  stroke?: number;
  accent?: string;
  label?: string;
  value?: string;
}> = ({progress, size = 168, stroke = 14, accent = C.green, label, value}) => {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const p = clamp01(progress);

  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - p)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value ? (
          <span
            style={{
              fontSize: size * 0.3,
              fontWeight: 800,
              color: C.text,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </span>
        ) : null}
        {label ? (
          <span
            style={{
              fontSize: size * 0.12,
              fontWeight: 600,
              color: C.textFaint,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
};

/** Counting number that eases up to `to`. */
export const Counter: React.FC<{
  local: number;
  from: number;
  to: number;
  startAt: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({local, from, to, startAt, duration = 26, style}) => {
  const t = easeOutQuint(clamp01((local - startAt) / duration));
  const value = Math.round(from + (to - from) * t);
  return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{value}</span>;
};
