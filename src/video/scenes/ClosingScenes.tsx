import React from 'react';
import {CameraWrapper, Layer, Phases, SceneShell, clamp01, easeOutQuint, span, useLocal} from '../motion';
import {Cutout, Icon} from '../assets';
import {KeyCap, TypingInput, typingSchedule} from '../interaction';
import {ChatWindow, SweepRule, type ChatMsg} from '../objects';
import {accentSoft, C, FONT} from '../theme';
import {normalizePhases} from '../data/reel';
import type {
  AppsSceneData,
  CodeSceneData,
  ComparisonSceneData,
  OutroSceneData,
  SceneProps,
} from '../types';

const codeColor: Record<string, string> = {
  kw: '#8B7CFF',
  fn: '#F2F0EC',
  op: '#5E6065',
  call: '#8B7CFF',
  prop: '#9A9A9E',
  str: '#4ADE80',
};

/* ------------------------------------------------------------------ */
/* 11. "Chatbots answer questions. Agents complete tasks."             */
/*     Left: conversation piles up and stays trapped.                  */
/*     Right: one task travels through four apps and lands as a check. */
/* ------------------------------------------------------------------ */

export const ComparisonScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as ComparisonSceneData;
  const local = useLocal(entry);
  const green = '#4ADE80';
  const leftMsgs: ChatMsg[] = (scene.left?.items ?? []).map((t, i) => ({
    from: i % 2 === 0 ? 'user' : 'bot',
    text: t === 'question' ? 'so which one?' : 'either works.',
  }));

  const dimLeft = span(local, 96, 124, easeOutQuint);
  const steps = scene.right?.steps ?? [];

  return (
    <SceneShell entry={entry}>
      <CameraWrapper
        entry={entry}
        from={{scale: 1.1, x: -50, rotateY: 5}}
        to={{scale: 1.0, x: 45, rotateY: -5}}
      >
        <Layer depth={1.1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', gap: 34, width: '100%', alignItems: 'flex-start'}}>
            {/* left — trapped */}
            <div style={{flex: 1, minWidth: 0, opacity: 1 - dimLeft * 0.5}}>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: C.textDim,
                  letterSpacing: '-0.025em',
                  marginBottom: 20,
                  lineHeight: 1.15,
                  opacity: clamp01(span(local, 4, 26, easeOutQuint)),
                }}
              >
                {scene.left?.title}
              </div>
              <div style={{transform: `scale(${(1 - dimLeft * 0.05).toFixed(3)})`, transformOrigin: 'top left'}}>
                <ChatWindow
                  title="chat"
                  messages={leftMsgs}
                  local={local}
                  startAt={10}
                  step={9}
                  accent="#FF7A6B"
                  width={400}
                />
              </div>
            </div>

            {/* right — a task that travels */}
            <div style={{flex: 1.1, minWidth: 0}}>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 750,
                  color: C.text,
                  letterSpacing: '-0.025em',
                  marginBottom: 20,
                  lineHeight: 1.15,
                  opacity: clamp01(span(local, 72, 94, easeOutQuint)),
                  transform: `translateY(${((1 - span(local, 72, 94, easeOutQuint)) * 18).toFixed(1)}px)`,
                }}
              >
                {scene.right?.title}
              </div>

              <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 16}}>
                {steps.map((s, i) => {
                  const at = 84 + i * 20;
                  const arrive = span(local, at, at + 16, easeOutQuint);
                  const p = span(local, 6 + i * 3, 24 + i * 3, easeOutQuint);
                  if (p <= 0.004) return null;
                  const active = arrive > 0.55;
                  return (
                    <div
                      key={s.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        padding: '20px 24px',
                        borderRadius: 18,
                        background: active ? accentSoft(green, 0.14) : C.surface,
                        border: `1px solid ${active ? green : C.border}`,
                        opacity: clamp01(p),
                        transform: `translateX(${((1 - p) * 44).toFixed(2)}px)`,
                        boxShadow: active ? `0 14px 34px ${accentSoft(green, 0.22)}` : undefined,
                      }}
                    >
                      <span
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          background: active ? accentSoft(green, 0.2) : C.surfaceRaised,
                          border: `1px solid ${active ? green : C.borderSoft}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: active ? green : C.textFaint,
                          flexShrink: 0,
                        }}
                      >
                        <Icon name={s.icon} size={28} />
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: 33,
                          fontWeight: 650,
                          color: active ? C.text : C.textDim,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: green,
                          opacity: active ? 1 : 0,
                          transform: `scale(${(0.5 + arrive * 0.5).toFixed(3)})`,
                        }}
                      >
                        <Icon name="circle-check" size={26} />
                      </span>
                    </div>
                  );
                })}

                {/* the travelling task itself */}
                <div
                  style={{
                    position: 'absolute',
                    left: -34,
                    top: 34,
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    background: green,
                    boxShadow: `0 0 22px ${accentSoft(green, 0.8)}`,
                    opacity: clamp01(span(local, 80, 92, easeOutQuint)) * (1 - span(local, 156, 172, easeOutQuint)),
                    transform: `translateY(${span(local, 84, 158, easeOutQuint) * (steps.length * 74)}px)`,
                  }}
                />
              </div>

              {/* verdict */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginTop: 28,
                  opacity: clamp01(span(local, 150, 170, easeOutQuint)),
                  transform: `translateY(${((1 - span(local, 150, 170, easeOutQuint)) * 18).toFixed(
                    1,
                  )}px)`,
                }}
              >
                <Icon name="circle-check" size={34} color={green} />
                <span style={{fontSize: 32, fontWeight: 750, color: C.text, letterSpacing: '-0.02em'}}>
                  {scene.verdict}
                </span>
              </div>
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 12. "Coding. Research. Emails. ..."                                 */
/*     An editor types a real line while capability chips illuminate.   */
/* ------------------------------------------------------------------ */

export const CodeScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as CodeSceneData;
  const local = useLocal(entry);
  const accent = '#8B7CFF';

  const tokens = scene.lines ?? [];
  const full = tokens.map((t) => t.t).join('');
  const schedule = React.useMemo(() => typingSchedule(full, 10, 26), [full]);
  const revealed = React.useMemo(() => {
    let n = 0;
    while (n < schedule.length && local >= schedule[n]) n++;
    return n;
  }, [local, schedule]);

  const caps = scene.capabilities ?? [];
  const glyph = full.slice(0, revealed);
  const lineCount = (glyph.match(/\n/g) ?? []).length + 1;

  let offset = 0;
  const rendered = tokens.map((tok, i) => {
    const start = offset;
    offset += tok.t.length;
    if (revealed <= start) return null;
    const slice = tok.t.slice(0, revealed - start);
    return (
      <span key={i} style={{color: codeColor[kind(tok)] ?? C.text}}>
        {slice}
      </span>
    );
  });

  return (
    <SceneShell entry={entry} align="left">
      <CameraWrapper
        entry={entry}
        from={{scale: 1.12, y: 40, rotateX: 5}}
        to={{scale: 1.0, y: -24, rotateX: -2}}
      >
        <Layer depth={0.55} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          <div style={{opacity: 0.26, marginRight: -40}}>
            <Cutout name="version-control" width={380} shadow={false} />
          </div>
        </Layer>

        <Layer depth={1.2} style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '100%'}}>
            {/* editor */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: '0 44px 90px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '17px 22px',
                  borderBottom: `1px solid ${C.borderSoft}`,
                  background: C.surfaceRaised,
                }}
              >
                <span style={{width: 13, height: 13, borderRadius: 7, background: C.border}} />
                <span style={{width: 13, height: 13, borderRadius: 7, background: C.border}} />
                <Icon name="code" size={22} color={accent} />
                <span style={{fontFamily: FONT.mono, fontSize: 24, color: C.textDim}}>
                  {scene.file}
                </span>
                <span style={{flex: 1}} />
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 19,
                    color: C.textFaint,
                    opacity: clamp01(span(local, 8, 26, easeOutQuint)),
                  }}
                >
                  agent.ts — saved
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  padding: '24px 26px 30px',
                  fontFamily: FONT.mono,
                  fontSize: 31,
                  lineHeight: 1.55,
                  minHeight: 300,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0,
                    paddingRight: 26,
                    marginRight: 26,
                    borderRight: `1px solid ${C.borderSoft}`,
                    color: C.textFaint,
                    userSelect: 'none',
                  }}
                >
                  {Array.from({length: Math.max(3, lineCount)}, (_, i) => (
                    <span key={i} style={{opacity: i < lineCount ? 1 : 0.3}}>
                      {i + 1}
                    </span>
                  ))}
                </div>
                <div style={{flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                  {rendered}
                  <span
                    style={{
                      display: 'inline-block',
                      width: 3,
                      height: '1em',
                      background: accent,
                      verticalAlign: '-0.14em',
                      marginLeft: 2,
                      opacity: Math.floor(local / 8) % 2 === 0 ? 1 : 0,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* capability chips lighting up with the spoken words */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 15,
                marginTop: 30,
              }}
            >
              {caps.map((cap, i) => {
                const at = 16 + i * 19;
                const p = span(local, at, at + 20, easeOutQuint);
                if (p <= 0.004) return null;
                const span2 = cap.label === 'Controlling software';
                return (
                  <div
                    key={cap.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '20px 24px',
                      borderRadius: 17,
                      background: C.surfaceRaised,
                      border: `1px solid ${accentSoft(accent, 0.28 + p * 0.45)}`,
                      gridColumn: span2 ? '1 / -1' : undefined,
                      justifyContent: span2 ? 'center' : 'flex-start',
                      opacity: p,
                      transform: `translateY(${((1 - p) * 26).toFixed(2)}px) scale(${(
                        0.96 + p * 0.04
                      ).toFixed(3)})`,
                    }}
                  >
                    <span
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: accentSoft(accent, 0.16),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accent,
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={cap.icon} size={26} />
                    </span>
                    <span
                      style={{
                        fontSize: span2 ? 32 : 34,
                        fontWeight: 680,
                        color: C.text,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {cap.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

function kind(tok: {t: string; k?: string}): string {
  return tok.k ?? 'fn';
}

/* ------------------------------------------------------------------ */
/* 13. "you might not open ten different apps ..."                     */
/*     Ten tiles collapse into one command line that types itself.      */
/* ------------------------------------------------------------------ */

export const AppsScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as AppsSceneData;
  const local = useLocal(entry);
  const accent = '#3B82F6';

  const tiles = scene.tiles ?? [];
  const labels = scene.labels ?? ['', ''];
  const collapseAt = 56;

  const grow = span(local, 4, 44, easeOutQuint);
  const shrink = span(local, collapseAt, collapseAt + 40, easeOutQuint);
  const value = Math.round((scene.from ?? 10) * grow * (1 - shrink) + (scene.to ?? 1) * shrink);

  const schedule = React.useMemo(
    () => typingSchedule(scene.command, 104, 17),
    [scene.command],
  );
  const inputIn = span(local, 82, 104, easeOutQuint);
  const enterAt = 156;

  const labelA = 1 - span(local, collapseAt - 4, collapseAt + 22, easeOutQuint);
  const labelB = span(local, collapseAt + 16, collapseAt + 44, easeOutQuint);

  return (
    <SceneShell entry={entry}>
      <CameraWrapper
        entry={entry}
        from={{scale: 1.06, rotateX: 8, y: 30}}
        to={{scale: 1.0, rotateX: 0, y: -18}}
      >
        <Layer depth={1.15} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 40,
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: 176,
                fontWeight: 900,
                color: C.text,
                letterSpacing: '-0.07em',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 16,
                justifyContent: 'center',
              }}
            >
              {tiles.map((label, i) => {
                const inP = span(local, 6 + i * 3, 26 + i * 3, easeOutQuint);
                const out = span(local, collapseAt + i * 3, collapseAt + 22 + i * 3, easeOutQuint);
                const opacity = inP * (1 - out);
                if (opacity <= 0.005) return null;
                return (
                  <div
                    key={label}
                    style={{
                      height: 158,
                      borderRadius: 24,
                      background: C.surfaceRaised,
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      fontWeight: 650,
                      color: C.textFaint,
                      opacity,
                      transform: `scale(${((0.72 + inP * 0.28) * (1 - out * 0.6)).toFixed(4)})`,
                    }}
                  >
                    {label}
                  </div>
                );
              })}

              {inputIn > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '86%',
                    marginLeft: '-43%',
                    marginTop: -79,
                    height: 158,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '0 30px',
                    borderRadius: 26,
                    background: C.bgSoft,
                    border: `1.5px solid ${accent}`,
                    boxShadow: `0 0 0 6px ${accentSoft(accent, 0.12)}, 0 30px 70px rgba(0,0,0,0.6)`,
                    opacity: inputIn,
                    transform: `scale(${(0.9 + inputIn * 0.1).toFixed(3)})`,
                  }}
                >
                  <span
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 17,
                      background: accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="sparkles" size={28} />
                  </span>
                  <span style={{flex: 1, minWidth: 0, color: C.text, overflow: 'hidden'}}>
                    <TypingInput
                      local={local}
                      schedule={schedule}
                      text={scene.command}
                      accent={accent}
                      size={38}
                    />
                  </span>
                  <KeyCap label="Enter" pressed={span(local, enterAt, enterAt + 8)} accent={accent} width={84} />
                </div>
              ) : null}
            </div>

            <div style={{position: 'relative', height: 56, width: '100%'}}>
              {labels.map((text, i) => {
                const opacity = i === 0 ? labelA : labelB;
                if (opacity <= 0.005) return null;
                const drift = i === 0 ? 1 - labelA : 1 - labelB;
                return (
                  <div
                    key={`${i}-${text}`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 44,
                      fontWeight: 650,
                      color: C.textDim,
                      letterSpacing: '-0.025em',
                      opacity,
                      transform: `translateY(${(drift * 14).toFixed(2)}px)`,
                    }}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 14. "The chatbot era was only the beginning..."                     */
/*     The chat window shrinks into a node inside a live network.       */
/* ------------------------------------------------------------------ */

const NET_NODES = Array.from({length: 14}, (_, i) => {
  const a = ((i * 137.508) % 360) * (Math.PI / 180);
  const r = 250 + ((i * 71) % 100) * 4.4;
  return {x: Math.cos(a) * r * 1.3, y: Math.sin(a) * r * 0.95, i};
});

export const OutroScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as OutroSceneData;
  const local = useLocal(entry);
  const accent = '#8B7CFF';
  const phases = normalizePhases(scene);

  const netIn = span(local, 4, 52, easeOutQuint);
  const shrink = span(local, 6, 62, easeOutQuint);

  return (
    <SceneShell entry={entry}>
      <CameraWrapper entry={entry} from={{scale: 1.14, rotateY: -5}} to={{scale: 1.0, rotateY: 3}}>
        {/* far plane: live network */}
        <Layer depth={0.7} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={1000} height={1000} viewBox="-500 -500 1000 1000" style={{overflow: 'visible'}} aria-hidden>
            {NET_NODES.map((n, i) => {
              const nb = NET_NODES[(i + 3) % NET_NODES.length];
              const d = Math.hypot(n.x - nb.x, n.y - nb.y);
              if (d > 460) return null;
              return (
                <line
                  key={i}
                  x1={n.x}
                  y1={n.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={accent}
                  strokeWidth={1.4}
                  opacity={netIn * 0.24}
                />
              );
            })}
            {NET_NODES.map((n, i) => (
              <circle
                key={`c${i}`}
                cx={n.x}
                cy={n.y}
                r={i % 4 === 0 ? 7 : 4.5}
                fill={i % 4 === 0 ? accent : C.textDim}
                opacity={netIn * (i % 4 === 0 ? 0.85 : 0.5)}
              />
            ))}
          </svg>
        </Layer>

        {/* the chat window from scene 2 collapses into the network */}
        <Layer depth={1.0} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              transform: `scale(${(1 - shrink * 0.82).toFixed(4)})`,
              opacity: 1 - span(local, 46, 70, easeOutQuint),
              filter: `blur(${(shrink * 3).toFixed(2)}px)`,
            }}
          >
            <ChatWindow
              title="chat"
              messages={[
                {from: 'user', text: 'so which one?'},
                {from: 'bot', text: 'either works.'},
              ]}
              local={999}
              accent="#FF7A6B"
              width={440}
            />
          </div>
        </Layer>

        {/* typography */}
        <Layer depth={1.35} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Phases
            entry={entry}
            phases={phases}
            render={(phase, {startAt, isLast}) => {
              const hero = phase.tone === 'bright' || Boolean(phase.highlight);
              const p = clamp01(
                span(local, startAt - entry.from + 6, startAt - entry.from + 44, easeOutQuint),
              );
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: hero ? 108 : 62,
                      fontWeight: hero ? 850 : 600,
                      color: phase.tone === 'muted' ? C.textDim : C.text,
                      letterSpacing: '-0.04em',
                      lineHeight: 1.06,
                      textAlign: 'center',
                      maxWidth: 860,
                      opacity: p,
                      transform: `translateY(${((1 - p) * 34).toFixed(2)}px)`,
                    }}
                  >
                    {phase.highlight ? (
                      <Marked text={phase.text} highlight={phase.highlight} accent={accent} p={p} />
                    ) : (
                      phase.text
                    )}
                  </div>
                  {isLast && phase.highlight ? <SweepRule p={p} accent={accent} width={320} /> : null}
                </div>
              );
            }}
          />
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/** Emphasises a phrase with a weight+colour shift rather than a filled box. */
export const Marked: React.FC<{
  text: string;
  highlight: string;
  accent: string;
  p: number;
}> = ({text, highlight, accent, p}) => {
  const words = text.split(/\s+/);
  const target = highlight.toLowerCase().split(/\s+/);
  const idx = words.findIndex((_, i) =>
    target.every((t, j) => (words[i + j] ?? '').toLowerCase().replace(/[.,]/g, '') === t),
  );

  return (
    <>
      {words.map((w, i) => {
        const on = idx >= 0 && i >= idx && i < idx + target.length;
        return (
          <span
            key={i}
            style={{
              color: on ? accent : undefined,
              fontWeight: on ? 900 : undefined,
              textShadow: on ? `0 0 34px ${accentSoft(accent, 0.55 * p)}` : undefined,
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </>
  );
};
