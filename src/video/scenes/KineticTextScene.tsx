import React from 'react';
import {CameraWrapper, Layer, SceneShell, clamp01, easeOutQuint, span, useLocal} from '../motion';
import {Icon} from '../assets';
import {SweepRule} from '../objects';
import {accentSoft, C} from '../theme';
import type {KineticSceneData, SceneProps} from '../types';

/**
 * 7. "And we're already seeing this happen."
 *
 * A short bridging beat. Emphasis comes from an animated underline and a
 * weight shift rather than a filled box, and the report badge carried over
 * from the previous scene holds its position for continuity.
 */
export const KineticTextScene: React.FC<SceneProps> = ({entry}) => {
  const scene = entry.scene as KineticSceneData;
  const local = useLocal(entry);
  const accent = '#8B7CFF';

  const words = scene.text.split(/\s+/);
  const target = (scene.highlight ?? '').toLowerCase();
  const idx = words.findIndex((w) => w.toLowerCase().replace(/[.,]/g, '') === target);

  const badgeP = span(local, 0, 24, easeOutQuint);
  const ruleP = span(local, 40, 74, easeOutQuint);

  return (
    <SceneShell entry={entry}>
      <CameraWrapper entry={entry} from={{scale: 1.1, y: 26}} to={{scale: 1.0, y: -22}}>
        <Layer depth={1.15} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: 40,
            }}
          >
            {/* carried-over badge from the previous scene */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                padding: '14px 26px',
                borderRadius: 999,
                background: C.surfaceRaised,
                border: `1px solid ${C.border}`,
                opacity: clamp01(badgeP),
                transform: `scale(${(0.86 + badgeP * 0.14).toFixed(3)})`,
              }}
            >
              <Icon name="circle-check" size={26} color={accent} />
              <span style={{fontSize: 25, fontWeight: 650, color: C.textDim}}>report ready</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                columnGap: '0.28em',
                rowGap: '0.1em',
                maxWidth: 860,
                fontSize: 88,
                fontWeight: 750,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: C.text,
              }}
            >
              {words.map((w, i) => {
                const p = span(local, 12 + i * 3.5, 44 + i * 3.5, easeOutQuint);
                if (p <= 0.004) return <span key={i} style={{opacity: 0}}>{w}</span>;
                const on = i === idx;
                return (
                  <span
                    key={i}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      opacity: p,
                      transform: `translateY(${((1 - p) * 30).toFixed(2)}px) scale(${(
                        0.94 + p * 0.06
                      ).toFixed(3)})`,
                      color: on ? accent : undefined,
                      fontWeight: on ? 900 : undefined,
                      textShadow: on ? `0 0 40px ${accentSoft(accent, 0.5)}` : undefined,
                    }}
                  >
                    {w}
                    {on ? (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: -10,
                          height: 8,
                          borderRadius: 5,
                          background: accent,
                          transformOrigin: 'left center',
                          transform: `scaleX(${ruleP.toFixed(4)})`,
                        }}
                      />
                    ) : null}
                  </span>
                );
              })}
            </div>

            <SweepRule p={ruleP} accent={accent} width={280} />
          </div>
        </Layer>
      </CameraWrapper>
    </SceneShell>
  );
};
