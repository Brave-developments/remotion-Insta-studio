import React from 'react';
import {useVideoConfig} from 'remotion';
import {CameraWrapper, Layer, SceneShell, clamp01, easeOutQuint, span, useLocal} from '../motion';
import {Cutout, Icon} from '../assets';
import {ChatWindow, SweepRule, type ChatMsg} from '../objects';
import {accentSoft, C} from '../theme';
import type {ChatSceneData, ParticleSceneData, SceneProps} from '../types';

/* ------------------------------------------------------------------ */
/* 1. "AI is changing again."                                          */
/*     The supplied AI artwork is pushed through by the camera, then    */
/*     breaks apart into a particle field that links into a network.    */
/* ------------------------------------------------------------------ */

const PARTICLES = Array.from({length: 58}, (_, i) => {
  const angle = ((i * 137.508) % 360) * (Math.PI / 180); // golden-angle scatter
  const radius = 120 + ((i * 53) % 100) * 4.1;
  return {
    x: Math.cos(angle) * radius * 1.35,
    y: Math.sin(angle) * radius * 0.92,
    delay: (i % 9) * 1.8,
    size: 3 + (i % 4) * 1.9,
  };
});

export const ParticleScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as ParticleSceneData;
  const local = useLocal(entry);
  const accent = '#8B7CFF';

  const artOut = span(local, entry.length * 0.5, entry.length * 0.82, easeOutQuint);
  const parts = span(local, 30, 88, easeOutQuint);
  const links = span(local, 62, 104, easeOutQuint);

  return (
    <SceneShell entry={entry}>
      <CameraWrapper
        entry={entry}
        from={{scale: 0.98, z: -60, rotateY: 4}}
        to={{scale: 1.42, z: 300, rotateY: -5, y: -70}}
      >
        {/* far plane: oversized type used as texture, cropped by the frame */}
        <Layer depth={0.35} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span
            style={{
              fontSize: 760,
              fontWeight: 900,
              letterSpacing: '-0.09em',
              color: '#101116',
              lineHeight: 1,
              transform: 'scale(1.5)',
              opacity: 1 - parts * 0.75,
            }}
          >
            {scene.word}
          </span>
        </Layer>

        {/* mid plane: the supplied artwork */}
        <Layer
          depth={0.85}
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
          <div
            style={{
              opacity: 1 - artOut,
              transform: `scale(${(1 + artOut * 0.55).toFixed(3)})`,
              filter: artOut > 0.02 ? `blur(${(artOut * 16).toFixed(2)}px)` : undefined,
            }}
          >
            <Cutout name="ai" width={660} />
          </div>
        </Layer>

        {/* near plane: particles emerging from the artwork */}
        <Layer depth={1.35} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: 1, height: 1}}>
            <svg
              width={900}
              height={900}
              viewBox="-450 -450 900 900"
              style={{position: 'absolute', left: -450, top: -450, overflow: 'visible'}}
              aria-hidden
            >
              {links > 0.01
                ? PARTICLES.map((a, i) =>
                    PARTICLES.slice(i + 1)
                      .map((b, j) => {
                        const d = Math.hypot(a.x - b.x, a.y - b.y);
                        if (d > 210) return null;
                        return (
                          <line
                            key={`${i}-${j}`}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke={accent}
                            strokeWidth={1.4}
                            opacity={links * 0.32}
                          />
                        );
                      })
                      .filter(Boolean),
                  )
                : null}

              {PARTICLES.map((p, i) => {
                const t = span(local, 30 + p.delay, 74 + p.delay, easeOutQuint);
                if (t <= 0.01) return null;
                const spread = 0.12 + t * 0.88;
                return (
                  <circle
                    key={i}
                    cx={p.x * spread}
                    cy={p.y * spread}
                    r={p.size * (0.5 + t * 0.5)}
                    fill={i % 5 === 0 ? C.text : accent}
                    opacity={0.35 + t * 0.6}
                  />
                );
              })}
            </svg>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 2. "it's not about getting a smarter chatbot"                       */
/*     The conversation piles up inside one window and is then locked. */
/* ------------------------------------------------------------------ */

export const ChatScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as ChatSceneData;
  const local = useLocal(entry);
  const accent = '#FF7A6B';
  const messages = (scene.messages ?? []) as ChatMsg[];

  const lock = span(local, entry.length * 0.6, entry.length * 0.78);
  const verdictP = span(local, entry.length * 0.66, entry.length * 0.84);

  return (
    <SceneShell entry={entry} align="left">
      <CameraWrapper
        entry={entry}
        from={{scale: 1.12, x: 30, rotateY: -6}}
        to={{scale: 1.0, x: -30, rotateY: 3}}
      >
        <Layer
          depth={0.6}
          style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0 40px 120px 0'}}
        >
          <div style={{opacity: 0.42, filter: 'blur(1.5px)'}}>
            <Cutout name="chatbot" width={430} shadow={false} />
          </div>
        </Layer>

        <Layer depth={1.1} style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '100%'}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                marginBottom: 34,
                opacity: clamp01(verdictP),
                transform: `translateX(${((1 - verdictP) * -30).toFixed(2)}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Cascadia Code', Consolas, monospace",
                  fontSize: 23,
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                }}
              >
                {scene.title}
              </span>
              <SweepRule p={verdictP} accent={accent} width={190} />
            </div>

            <ChatWindow
              title={scene.title}
              messages={messages}
              local={local}
              startAt={8}
              step={11}
              accent={accent}
              width={640}
              locked={lock}
            />
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/* Small helper reused by scenes that need a struck-through phrase. */
export const Struck: React.FC<{text: string; p: number; accent?: string}> = ({
  text,
  p,
  accent = C.coral,
}) => (
  <span style={{position: 'relative', display: 'inline-block', color: C.textDim}}>
    <span style={{position: 'relative'}}>{text}</span>
    <span
      style={{
        position: 'absolute',
        left: '-0.06em',
        right: '-0.06em',
        top: 'calc(50% - 0.05em)',
        height: '0.1em',
        background: accent,
        borderRadius: '0.06em',
        transformOrigin: 'left center',
        transform: `scaleX(${clamp01(p).toFixed(4)})`,
      }}
    />
  </span>
);

/** Pulse used wherever an "always on" state needs to read as live. */
export const pulse = (local: number, speed = 6): number =>
  0.72 + 0.28 * Math.sin(local / speed);

export const useFps = (): number => useVideoConfig().fps;

/** Accent wash helper re-exported for scene files. */
export {accentSoft};
export {Icon};
