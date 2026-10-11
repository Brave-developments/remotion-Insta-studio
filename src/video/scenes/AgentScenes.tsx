import React from 'react';
import {useVideoConfig} from 'remotion';
import {CameraWrapper, Layer, SceneShell, clamp01, easeOutQuint, span, useLocal} from '../motion';
import {Cutout, Icon} from '../assets';
import {NodeChip, STAGE_WIDTH} from '../objects';
import {accentSoft, C} from '../theme';
import type {DiagramSceneData, NetworkSceneData, SceneProps} from '../types';

const BOX_H = 700;

const nodePos = (i: number, count: number, rx: number, ry: number) => {
  const angle = ((-90 + (360 / Math.max(count, 1)) * i) * Math.PI) / 180;
  return {x: Math.cos(angle) * rx, y: Math.sin(angle) * ry};
};

/* ------------------------------------------------------------------ */
/* 3. "The next big thing is called an AI agent."                      */
/* 9. "Microsoft is turning Copilot into an operating system for work."*/
/*     Same component, two variants: the artwork collapses into a node  */
/*     (3) or scattered apps orbit into a hub (9).                      */
/* ------------------------------------------------------------------ */

export const NetworkScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as NetworkSceneData;
  const local = useLocal(entry);
  const {fps} = useVideoConfig();
  const hub = scene.variant === 'hub';
  const accent = hub ? '#3B82F6' : '#8B7CFF';
  const nodes = scene.nodes ?? [];
  const cx = STAGE_WIDTH / 2;
  const cy = BOX_H / 2;

  const collapse = span(local, 0, 26, easeOutQuint);
  const centerP = span(local, hub ? 8 : 20, hub ? 34 : 46, easeOutQuint);

  const rx = 300;
  const ry = 215;

  return (
    <SceneShell entry={entry}>
      <CameraWrapper
        entry={entry}
        from={hub ? {scale: 1.2, rotateY: 7, x: 40} : {scale: 1.34, rotateY: -5}}
        to={hub ? {scale: 1.0, rotateY: -4, x: -30} : {scale: 1.0, rotateY: 3}}
      >
        {/* far plane: supplied artwork used as atmosphere */}
        <Layer depth={0.55} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: hub ? 0.3 : 1 - collapse}}>
            <Cutout name={hub ? 'hybrid-work' : 'conversation'} width={hub ? 700 : 470} shadow={false} />
          </div>
        </Layer>

        {/* mid plane: the diagram */}
        <Layer depth={1.1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: STAGE_WIDTH, height: BOX_H}}>
            <svg
              width={STAGE_WIDTH}
              height={BOX_H}
              style={{position: 'absolute', inset: 0, overflow: 'visible'}}
              aria-hidden
            >
              {nodes.map((n, i) => {
                const drawAt = (hub ? 30 : 34) + i * 5;
                const p = span(local, drawAt, drawAt + 22, easeOutQuint);
                if (p <= 0.01) return null;
                const orbit = hub ? 1.65 - 0.65 * span(local, 12 + i * 4, 46 + i * 4, easeOutQuint) : 1;
                const {x, y} = nodePos(i, nodes.length, rx * orbit, ry * orbit);
                const len = Math.hypot(x, y);
                return (
                  <line
                    key={n.label}
                    x1={cx}
                    y1={cy}
                    x2={cx + x}
                    y2={cy + y}
                    stroke={accent}
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    opacity={0.5}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - p)}
                  />
                );
              })}

              {!hub ? null : (
                <circle
                  cx={cx}
                  cy={cy}
                  r={100 + (local % 50) * 1.6}
                  fill="none"
                  stroke={accent}
                  strokeWidth={2}
                  opacity={Math.max(0, 0.3 * (1 - (local % 50) / 50)) * (centerP > 0.5 ? 1 : 0)}
                />
              )}
            </svg>

            {/* centre node */}
            <div
              style={{
                position: 'absolute',
                left: cx - 88,
                top: cy - 88,
                width: 176,
                height: 176,
                borderRadius: 50,
                background: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: centerP,
                transform: `scale(${(0.62 + 0.38 * centerP).toFixed(4)})`,
                boxShadow: `0 26px 64px ${accentSoft(accent, 0.4)}`,
                zIndex: 3,
              }}
            >
              <span
                style={{
                  fontSize: hub ? 30 : 34,
                  fontWeight: 800,
                  color: '#08080A',
                  letterSpacing: '-0.03em',
                  textAlign: 'center',
                  lineHeight: 1.05,
                  padding: '0 16px',
                }}
              >
                {scene.center}
              </span>
            </div>

            {/* satellites */}
            {nodes.map((n, i) => {
              const p = span(local, (hub ? 12 : 30) + i * 6, (hub ? 40 : 54) + i * 6, easeOutQuint);
              if (p <= 0.004) return null;
              const orbit = hub ? 1.65 - 0.65 * span(local, 12 + i * 4, 46 + i * 4, easeOutQuint) : 1;
              const {x, y} = nodePos(i, nodes.length, rx * orbit, ry * orbit);
              return (
                <div
                  key={n.label}
                  style={{position: 'absolute', left: cx + x, top: cy + y, zIndex: 2}}
                >
                  <NodeChip label={n.label} icon={n.icon} p={p} accent={accent} />
                </div>
              );
            })}
          </div>
        </Layer>

        {/* foreground: caption typography for the hub variant */}
        {hub && scene.caption ? (
          <Layer depth={1.4} style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 30}}>
            <span
              style={{
                fontSize: 46,
                fontWeight: 650,
                color: C.text,
                letterSpacing: '-0.025em',
                opacity: clamp01(span(local, 96, 122, easeOutQuint)),
                transform: `translateY(${((1 - span(local, 96, 122, easeOutQuint)) * 20).toFixed(2)}px)`,
              }}
            >
              {scene.caption}
            </span>
          </Layer>
        ) : null}
      </CameraWrapper>

      {/* scene 3: the artwork physically becomes the node */}
      {!hub && collapse < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              opacity: 1 - span(local, 4, 24, easeOutQuint),
              transform: `scale(${(1 - collapse * 0.86).toFixed(4)})`,
              filter: `blur(${(collapse * 7).toFixed(2)}px)`,
              position: 'absolute',
            }}
          >
            <Cutout name="conversation" width={470} />
          </div>
        </div>
      ) : null}
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 4. "Instead of waiting for you to ask ... it can do the work."      */
/*     A draining queue of questions beside a live task pipeline.       */
/* ------------------------------------------------------------------ */

export const DiagramScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as DiagramSceneData;
  const local = useLocal(entry);
  const accent = '#F5B544';
  const queued = scene.queued ?? [];
  const steps = scene.steps ?? [];

  return (
    <SceneShell entry={entry} align="left">
      <CameraWrapper
        entry={entry}
        from={{x: -70, scale: 1.1, rotateY: 5}}
        to={{x: 55, scale: 1.0, rotateY: -3}}
      >
        <Layer depth={0.6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: 0.3, position: 'absolute', left: -30, top: 40}}>
            <Cutout name="search" width={420} shadow={false} />
          </div>
        </Layer>

        <Layer depth={1.15} style={{display: 'flex', alignItems: 'center'}}>
          <div
            style={{
              display: 'flex',
              gap: 56,
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            {/* left: the queue that nobody answers */}
            <div style={{width: 300, flexShrink: 0}}>
              <span
                style={{
                  fontFamily: "'Cascadia Code', Consolas, monospace",
                  fontSize: 21,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                }}
              >
                {scene.title}
              </span>
              <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 26}}>
                {queued.map((q, i) => {
                  const inP = span(local, 4 + i * 5, 20 + i * 5, easeOutQuint);
                  const out = span(local, 52 + i * 11, 74 + i * 11, easeOutQuint);
                  const opacity = inP * (1 - out);
                  if (opacity <= 0.01) return null;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 92,
                        height: 78,
                        borderRadius: 20,
                        background: C.surfaceRaised,
                        border: `1px solid ${C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 42,
                        fontWeight: 800,
                        color: C.textFaint,
                        opacity,
                        transform: `translateY(${(-out * 46).toFixed(2)}px) scale(${(
                          0.82 + inP * 0.18
                        ).toFixed(3)})`,
                      }}
                    >
                      {q}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* right: work happening without being asked */}
            <div style={{flex: 1, position: 'relative'}}>
              <span
                style={{
                  fontFamily: "'Cascadia Code', Consolas, monospace",
                  fontSize: 21,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: accent,
                }}
              >
                runs itself
              </span>

              <div
                style={{
                  position: 'absolute',
                  left: 33,
                  top: 62,
                  width: 3,
                  background: C.border,
                  height: 340,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 33,
                  top: 62,
                  width: 3,
                  background: accent,
                  height: 340,
                  borderRadius: 2,
                  transformOrigin: 'top center',
                  transform: `scaleY(${span(local, 60, 150, easeOutQuint).toFixed(4)})`,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 34,
                  marginTop: 26,
                }}
              >
                {steps.map((s, i) => {
                  const p = span(local, 66 + i * 26, 90 + i * 26, easeOutQuint);
                  if (p <= 0.004) return null;
                  return (
                    <div
                      key={s.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 22,
                        opacity: p,
                        transform: `translateX(${((1 - p) * 46).toFixed(2)}px)`,
                      }}
                    >
                      <span
                        style={{
                          width: 68,
                          height: 68,
                          borderRadius: 20,
                          background: accentSoft(accent, 0.16),
                          border: `1px solid ${accentSoft(accent, 0.55)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: accent,
                          flexShrink: 0,
                          marginLeft: -1,
                        }}
                      >
                        <Icon name={s.icon} size={34} />
                      </span>
                      <span
                        style={{
                          fontSize: 40,
                          fontWeight: 650,
                          color: C.text,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};
