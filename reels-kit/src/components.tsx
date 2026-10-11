import {useCurrentFrame} from 'remotion';
import type {CSSProperties, ReactNode} from 'react';
import {clamp01, ease, panelStyle, settle, span} from './primitives';
import type {Project} from './types';

const mono = 'Consolas, "Cascadia Code", monospace';

/* ---------------------------------------------------------------- windows */

export const BrowserWindow = ({
  project,
  title,
  children,
  style,
}: {
  project: Project;
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div style={{...panelStyle(project), overflow: 'hidden', ...style}}>
    <div
      style={{
        height: 58,
        borderBottom: `1px solid ${project.palette.muted}33`,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '0 22px',
      }}
    >
      {[0, 1, 2].map((n) => (
        <div
          key={n}
          style={{width: 10, height: 10, borderRadius: '50%', background: project.palette.muted}}
        />
      ))}
      <div style={{fontSize: 20, color: project.palette.muted, marginLeft: 16}}>{title}</div>
    </div>
    {children}
  </div>
);

export const PhoneFrame = ({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 330,
        height: 620,
        margin: '0 auto',
        border: `2px solid ${project.palette.muted}88`,
        borderRadius: 44,
        background: project.palette.panel,
        padding: 26,
        transform: `perspective(1400px) rotateY(${ease(frame, 0, 70, -10, 3)}deg)`,
        boxShadow: '0 40px 90px #0009',
      }}
    >
      <div
        style={{
          width: 96,
          height: 16,
          borderRadius: 20,
          margin: '0 auto 34px',
          background: project.palette.background,
        }}
      />
      {children}
    </div>
  );
};

/* ----------------------------------------------------------------- cursor */

export const Cursor = ({
  x,
  y,
  click = false,
  color,
}: {
  x: number;
  y: number;
  click?: boolean;
  color: string;
}) => {
  const frame = useCurrentFrame();
  const ripple = span(frame, 0, 16);
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none'}}>
      {click ? (
        <div
          style={{
            position: 'absolute',
            left: -26,
            top: -26,
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            opacity: 1 - ripple,
            transform: `scale(${0.4 + ripple * 1.6})`,
          }}
        />
      ) : null}
      <svg width="34" height="42" viewBox="0 0 34 42" style={{transform: click ? 'scale(.9)' : ''}}>
        <path d="M2 2 L2 30 L10 23 L16 36 L22 33 L16 20 L27 19 Z" fill="#fff" stroke="#000" strokeWidth="2" />
      </svg>
    </div>
  );
};

/* ----------------------------------------------------------------- typing */

export const TypingText = ({
  text,
  start,
  end,
  color,
  caret = true,
}: {
  text: string;
  start: number;
  end: number;
  color: string;
  caret?: boolean;
}) => {
  const frame = useCurrentFrame();
  const count = Math.round(span(frame, start, end) * text.length);
  const shown = text.slice(0, count);
  const done = count >= text.length;
  const blink = Math.floor(frame / 14) % 2 === 0;
  return (
    <span style={{fontFamily: mono}}>
      {shown}
      {caret && (!done || blink) ? (
        <span style={{color, opacity: done && blink ? 1 : 0.9}}>|</span>
      ) : null}
    </span>
  );
};

/* --------------------------------------------------------------- counters */

export const Counter = ({
  from,
  to,
  prefix = '',
  suffix = '',
  start,
  end,
  color,
  size = 120,
}: {
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  start: number;
  end: number;
  color: string;
  size?: number;
}) => {
  const frame = useCurrentFrame();
  const value = Math.round(from + (to - from) * ease(frame, start, end));
  const grow = settle(frame, start, start + 18, 0.94, 1);
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: size,
        fontWeight: 700,
        color,
        letterSpacing: -4,
        transform: `scale(${grow})`,
        transformOrigin: 'left center',
      }}
    >
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </div>
  );
};

export const ProgressBar = ({
  project,
  progress,
  height = 16,
  label,
}: {
  project: Project;
  progress: number;
  height?: number;
  label?: string;
}) => (
  <div style={{width: '100%'}}>
    {label ? (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 19,
          color: project.palette.muted,
          marginBottom: 12,
          fontFamily: mono,
        }}
      >
        <span>{label}</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    ) : null}
    <div style={{height, borderRadius: height, background: `${project.palette.muted}30`, overflow: 'hidden'}}>
      <div
        style={{
          height: '100%',
          width: `${clamp01(progress) * 100}%`,
          borderRadius: height,
          background: `linear-gradient(90deg, ${project.palette.accent}, ${project.palette.secondary})`,
        }}
      />
    </div>
  </div>
);

export const MetricCard = ({
  project,
  label,
  value,
  accent = false,
  children,
}: {
  project: Project;
  label: string;
  value?: string;
  accent?: boolean;
  children?: ReactNode;
}) => (
  <div
    style={{
      ...panelStyle(project),
      padding: '26px 28px',
      borderColor: accent ? project.palette.accent : undefined,
      flex: 1,
    }}
  >
    <div style={{fontSize: 19, letterSpacing: 2, color: project.palette.muted, fontFamily: mono}}>
      {label}
    </div>
    {value ? (
      <div style={{fontSize: 52, fontWeight: 700, marginTop: 14, color: accent ? project.palette.accent : undefined}}>
        {value}
      </div>
    ) : null}
    {children}
  </div>
);

/* ------------------------------------------------------------- structures */

export const DiagramNode = ({
  project,
  label,
  active = 0,
  index = 0,
}: {
  project: Project;
  label: string;
  active?: number;
  index?: number;
}) => {
  const frame = useCurrentFrame();
  const on = active >= index;
  const pop = settle(frame, index * 7, index * 7 + 16, 0.85, 1);
  return (
    <div
      style={{
        ...panelStyle(project),
        padding: '22px 26px',
        textAlign: 'center',
        minWidth: 190,
        borderColor: on ? project.palette.accent : project.palette.muted + '44',
        opacity: on ? 1 : 0.45,
        transform: `scale(${pop})`,
      }}
    >
      <div style={{fontSize: 25, fontWeight: 650}}>{label}</div>
    </div>
  );
};

export const ConnectorLine = ({
  project,
  progress,
  vertical = false,
  length = 120,
}: {
  project: Project;
  progress: number;
  vertical?: boolean;
  length?: number;
}) => {
  const size = vertical ? {width: 2, height: length} : {width: length, height: 2};
  return (
    <div style={{position: 'relative', ...size, background: `${project.palette.muted}44`}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          ...(vertical ? {width: 2, height: length} : {width: length, height: 2}),
          background: project.palette.accent,
          transformOrigin: 'left top',
          transform: vertical ? `scaleY(${clamp01(progress)})` : `scaleX(${clamp01(progress)})`,
        }}
      />
    </div>
  );
};

export const TimelineBlocks = ({
  project,
  items,
  progress,
}: {
  project: Project;
  items: string[];
  progress: number;
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 12, alignItems: 'stretch'}}>
      {items.map((item, i) => {
        const slot = 1 / items.length;
        const on = progress >= i * slot;
        const lift = on ? 0 : 14;
        return (
          <div
            key={item}
            style={{
              flex: 1,
              padding: '24px 20px',
              borderRadius: 14,
              background: on ? `${project.palette.accent}22` : project.palette.panel,
              border: `1px solid ${on ? project.palette.accent : project.palette.muted + '44'}`,
              opacity: on ? 1 : 0.4,
              transform: `translateY(${lift}px)`,
              transition: 'none',
            }}
          >
            <div style={{fontFamily: mono, fontSize: 18, color: project.palette.muted}}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{fontSize: 24, fontWeight: 650, marginTop: 10, lineHeight: 1.2}}>{item}</div>
            <div style={{height: 3, marginTop: 16, background: project.palette.accent, width: `${ease(frame, i * 6, i * 6 + 20, 0, 100)}%`}} />
          </div>
        );
      })}
    </div>
  );
};

export const BeforeAfter = ({
  project,
  a,
  b,
  progress,
}: {
  project: Project;
  a: string;
  b: string;
  progress: number;
}) => (
  <div style={{...panelStyle(project), overflow: 'hidden', height: 420, position: 'relative'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(45deg, ${project.palette.background}, ${project.palette.background} 18px, ${project.palette.panel} 18px, ${project.palette.panel} 36px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
        fontWeight: 700,
        color: project.palette.muted,
        textAlign: 'center',
        padding: 40,
      }}
    >
      {a}
    </div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: `${clamp01(progress) * 100}%`,
        overflow: 'hidden',
        background: project.palette.panel,
        borderRight: `3px solid ${project.palette.accent}`,
      }}
    >
      <div
        style={{
          width: 920,
          height: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          fontWeight: 700,
          color: project.palette.accent,
          textAlign: 'center',
          padding: 40,
        }}
      >
        {b}
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 26,
        bottom: 22,
        fontFamily: mono,
        fontSize: 19,
        letterSpacing: 2,
        color: project.palette.muted,
      }}
    >
      BEFORE
    </div>
    <div
      style={{
        position: 'absolute',
        right: 26,
        bottom: 22,
        fontFamily: mono,
        fontSize: 19,
        letterSpacing: 2,
        color: project.palette.accent,
      }}
    >
      AFTER
    </div>
  </div>
);

export const CodeEditor = ({
  project,
  file,
  code,
  highlight = [],
}: {
  project: Project;
  file: string;
  code: string[];
  highlight?: number[];
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...panelStyle(project), overflow: 'hidden'}}>
      <div
        style={{
          height: 52,
          borderBottom: `1px solid ${project.palette.muted}33`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          fontFamily: mono,
          fontSize: 19,
          color: project.palette.muted,
        }}
      >
        {file}
      </div>
      <div style={{padding: '24px 26px', fontFamily: mono, fontSize: 27, lineHeight: 1.6}}>
        {code.map((line, i) => {
          const on = highlight.includes(i);
          const reveal = span(frame, 4 + i * 3, 14 + i * 3);
          return (
            <div
              key={i}
              style={{
                opacity: reveal,
                color: on ? project.palette.accent : project.palette.text,
                background: on ? `${project.palette.accent}18` : 'transparent',
                borderLeft: on ? `3px solid ${project.palette.accent}` : '3px solid transparent',
                paddingLeft: 14,
                whiteSpace: 'pre-wrap',
              }}
            >
              {line || ' '}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Checklist = ({
  project,
  items,
  progress,
  successColor,
}: {
  project: Project;
  items: string[];
  progress: number;
  successColor?: string;
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      {items.map((item, i) => {
        const slot = (i + 1) / (items.length + 1);
        const done = progress >= slot;
        const pop = settle(frame, i * 8, i * 8 + 16, 0.9, 1);
        const color = successColor ?? project.palette.accent;
        return (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '22px 26px',
              borderRadius: 14,
              background: project.palette.panel,
              border: `1px solid ${done ? color + '88' : project.palette.muted + '44'}`,
              opacity: done ? 1 : 0.5,
              transform: `scale(${pop})`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `2px solid ${done ? color : project.palette.muted}`,
                display: 'grid',
                placeItems: 'center',
                color,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {done ? '✓' : ''}
            </div>
            <div style={{fontSize: 27, fontWeight: 600}}>{item}</div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------- retention graph */

const curve = (drops: number[], samples = 60) => {
  const points: {x: number; y: number}[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const x = (i / samples) * 100;
    let y = 100;
    for (const drop of drops) {
      const d = Math.abs(x - drop);
      y -= Math.max(0, 46 - d * 2.6) * (drop < 34 ? 1 : drop < 68 ? 0.82 : 0.66);
    }
    points.push({x, y: Math.max(6, y)});
  }
  return points;
};

export const RetentionGraph = ({
  project,
  drops,
  progress,
  patched = false,
}: {
  project: Project;
  drops: number[];
  progress: number;
  patched?: boolean;
}) => {
  const frame = useCurrentFrame();
  const pts = curve(drops);
  const toPath = (list: {x: number; y: number}[]) =>
    list.map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.x * 8.6).toFixed(1)} ${((100 - p.y) * 4.6).toFixed(1)}`).join(' ');
  const drawn = pts.filter((_, i) => i / pts.length <= clamp01(progress));
  const color = patched ? project.palette.secondary : project.palette.accent;
  return (
    <div style={{...panelStyle(project), padding: '30px 32px', position: 'relative'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'Consolas, monospace',
          fontSize: 19,
          color: project.palette.muted,
          marginBottom: 18,
        }}
      >
        <span>RETENTION</span>
        <span style={{color}}>{patched ? 'PATCHED' : 'DROPPING'}</span>
      </div>
      <svg viewBox="0 0 860 460" width="100%" height={380}>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" y1={i * 115 + 10} x2="860" y2={i * 115 + 10} stroke={`${project.palette.muted}22`} />
        ))}
        <path d={toPath(pts)} fill="none" stroke={`${project.palette.muted}44`} strokeWidth="4" />
        <path d={toPath(drawn)} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        {drops.map((drop, i) => {
          const on = progress > drop / 100;
          const pulse = 1 + Math.sin(frame / 9 + i) * 0.12;
          const y = pts[Math.round((drop / 100) * 60)].y;
          return on ? (
            <g key={drop}>
              <line x1={drop * 8.6} y1="8" x2={drop * 8.6} y2="452" stroke={project.palette.secondary} strokeDasharray="7 9" strokeWidth="2" />
              <circle cx={drop * 8.6} cy={(100 - y) * 4.6} r={11 * pulse} fill={project.palette.secondary} />
              <text x={drop * 8.6 + 16} y="34" fill={project.palette.secondary} fontSize="22" fontFamily="Consolas, monospace">
                {i + 1}
              </text>
            </g>
          ) : null;
        })}
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Consolas, monospace', fontSize: 18, color: project.palette.muted}}>
        <span>0s</span>
        <span>{patched ? 'FIX APPLIED — CURVE HOLDS' : 'CLIFF DETECTED'}</span>
      </div>
    </div>
  );
};
