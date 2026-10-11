import React from 'react';
import {CameraWrapper, Layer, SceneShell, clamp01, easeOutQuint, span, useLocal} from '../motion';
import {Cutout, Icon} from '../assets';
import {LiveDot, ProgressRing} from '../interaction';
import {AppTile as _AppTile, WindowDots} from '../objects';
import {accentSoft, C} from '../theme';
import type {DeviceSceneData, RaceSceneData, SceneProps} from '../types';

/* ------------------------------------------------------------------ */
/* 8. "OpenAI is building always-on agents."                           */
/*     An app window of continuously running jobs plus a live ring.     */
/* ------------------------------------------------------------------ */

export const DeviceScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as DeviceSceneData;
  const local = useLocal(entry);
  const accent = '#4ADE80';

  const windowIn = clamp01(
    span(local, 0, 30, easeOutQuint),
  );
  const ringP = span(local, 26, 78, easeOutQuint);
  const ringValue = Math.round((scene.ring?.value ?? 0) * ringP);

  return (
    <SceneShell entry={entry}>
      <CameraWrapper
        entry={entry}
        from={{scale: 1.14, x: -46, rotateY: -7}}
        to={{scale: 1.0, x: 34, rotateY: 5}}
      >
        <Layer depth={0.55} style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: '0 0 60px 10px'}}>
          <div style={{opacity: 0.34}}>
            <Cutout name="computer-fix" width={440} shadow={false} />
          </div>
        </Layer>

        <Layer depth={1.15} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              width: 830,
              opacity: windowIn,
              transform: `translateY(${((1 - windowIn) * 46).toFixed(2)}px)`,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 28,
              overflow: 'hidden',
              boxShadow: '0 46px 96px rgba(0,0,0,0.64)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '22px 26px',
                borderBottom: `1px solid ${C.borderSoft}`,
              }}
            >
              <WindowDots />
              <span style={{flex: 1}} />
              <span style={{fontSize: 27, fontWeight: 750, color: C.text, letterSpacing: '-0.02em'}}>
                {scene.app}
              </span>
              <span style={{flex: 1}} />
              <LiveDot local={local} label={scene.badge ?? 'live'} accent={accent} />
            </div>

            <div style={{display: 'flex'}}>
              <div
                style={{
                  width: 82,
                  padding: '22px 19px',
                  borderRight: `1px solid ${C.borderSoft}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {['layout-grid', 'message-2', 'world', 'chart-bar', 'folder'].map((n, i) => (
                  <span
                    key={n}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background: i === 0 ? accentSoft(accent, 0.18) : C.surfaceRaised,
                      border: `1px solid ${i === 0 ? accentSoft(accent, 0.5) : C.borderSoft}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: i === 0 ? accent : C.textFaint,
                    }}
                  >
                    <Icon name={n} size={24} />
                  </span>
                ))}
              </div>

              <div style={{flex: 1, padding: '22px 26px 26px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
                  {(scene.rows ?? []).map((row, i) => {
                    const p = span(local, 22 + i * 9, 44 + i * 9, easeOutQuint);
                    if (p <= 0.004) return null;
                    return (
                      <div
                        key={row}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 17,
                          padding: '18px 20px',
                          borderRadius: 15,
                          background: C.surfaceRaised,
                          border: `1px solid ${C.borderSoft}`,
                          opacity: p,
                          transform: `translateX(${((1 - p) * 40).toFixed(2)}px)`,
                        }}
                      >
                        <span
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 13,
                            background: accentSoft(accent, 0.16),
                            border: `1px solid ${accentSoft(accent, 0.4)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: accent,
                            flexShrink: 0,
                          }}
                        >
                          <Icon name="bolt" size={24} />
                        </span>
                        <span style={{flex: 1, fontSize: 28, fontWeight: 620, color: C.text}}>
                          {row}
                        </span>
                        <LiveDot local={local + i * 9} label="run" accent={accent} />
                      </div>
                    );
                  })}
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 26}}>
                  <ProgressRing
                    progress={ringP}
                    size={150}
                    stroke={13}
                    accent={accent}
                    label={scene.ring?.label}
                    value={`${ringValue}%`}
                  />
                  <div style={{display: 'flex', gap: 16, flex: 1}}>
                    {(scene.metrics ?? []).map((m, i) => {
                      const p = span(local, 40 + i * 10, 66 + i * 10, easeOutQuint);
                      const target = Number.parseInt(m.value, 10);
                      const shown = Number.isFinite(target)
                        ? Math.round(target * easeOutQuint(p))
                        : m.value;
                      return (
                        <div
                          key={m.label}
                          style={{
                            flex: 1,
                            padding: '18px 22px',
                            borderRadius: 17,
                            background: C.bgSoft,
                            border: `1px solid ${C.border}`,
                            opacity: clamp01(p * 1.6),
                          }}
                        >
                          <div
                            style={{
                              fontSize: 52,
                              fontWeight: 800,
                              color: C.text,
                              letterSpacing: '-0.045em',
                              lineHeight: 1,
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {shown}
                          </div>
                          <div style={{fontSize: 21, color: C.textFaint, marginTop: 7}}>
                            {m.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 10. "... every major AI company is racing in the same direction."   */
/*      Lanes accelerate toward one shared finish line and converge.    */
/* ------------------------------------------------------------------ */

export const RaceScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as RaceSceneData;
  const local = useLocal(entry);
  const accent = '#F5B544';
  const runners = scene.runners ?? [];
  const goalX = 780;

  const converge = span(local, entry.length * 0.66, entry.length * 0.92, easeOutQuint);

  return (
    <SceneShell entry={entry} align="left">
      <CameraWrapper
        entry={entry}
        from={{x: -60, scale: 1.08, rotateY: 5}}
        to={{x: 60, scale: 1.0, rotateY: -4}}
      >
        <Layer depth={0.55} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          <div style={{opacity: 0.26, marginRight: -60}}>
            <Cutout name="dart" width={500} shadow={false} />
          </div>
        </Layer>

        <Layer depth={1.2} style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '100%', position: 'relative'}}>
            {/* finish line */}
            <div
              style={{
                position: 'absolute',
                left: goalX,
                top: -34,
                bottom: -34,
                width: 3,
                background: `repeating-linear-gradient(to bottom, ${accent} 0 14px, transparent 14px 28px)`,
                opacity: clamp01(span(local, 14, 40, easeOutQuint)),
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: goalX + 16,
                top: -74,
                fontFamily: "'Cascadia Code', Consolas, monospace",
                fontSize: 21,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: accent,
                opacity: clamp01(span(local, 22, 48, easeOutQuint)),
                whiteSpace: 'nowrap',
              }}
            >
              {scene.goal}
            </span>

            <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              {runners.map((r, i) => {
                const p = span(local, 6 + i * 5, 60 + i * 5, easeOutQuint);
                if (p <= 0.004) return null;
                const w = (r.pct / 100) * goalX;
                return (
                  <div
                    key={r.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      opacity: p,
                      transform: `translateY(${((1 - p) * 26).toFixed(2)}px)`,
                    }}
                  >
                    <span
                      style={{
                        width: 190,
                        fontSize: 30,
                        fontWeight: 700,
                        color: C.text,
                        letterSpacing: '-0.02em',
                        textAlign: 'right',
                        flexShrink: 0,
                      }}
                    >
                      {r.label}
                    </span>
                    <div style={{position: 'relative', width: goalX, height: 34}}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 6,
                          width: w * p,
                          height: 22,
                          borderRadius: 12,
                          background: accentSoft(accent, 0.28 + 0.3 * p),
                          transform: `translateX(${(converge * (goalX - w * p) * 0.16).toFixed(1)}px)`,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: w * p - 4,
                          top: 0,
                          width: 34,
                          height: 34,
                          borderRadius: 11,
                          background: accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: `translateX(${(converge * (goalX - w * p) * 0.16).toFixed(1)}px) scale(${(
                            1 - converge * 0.35
                          ).toFixed(3)})`,
                          boxShadow: `0 8px 24px ${accentSoft(accent, 0.4)}`,
                        }}
                      >
                        <Icon name="rocket" size={20} color="#0A0A0A" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* everything converges into one arrow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 44,
                opacity: converge,
                transform: `translateX(${((1 - converge) * -30).toFixed(1)}px)`,
              }}
            >
              <Icon name="arrow-narrow-right" size={56} color={accent} strokeWidth={2} />
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 750,
                  color: C.text,
                  letterSpacing: '-0.03em',
                }}
              >
                one direction
              </span>
            </div>
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};

/** Kept for scenes that compose tiles directly. */
export const Tile = _AppTile;
