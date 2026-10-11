import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { FONT_STACK, C } from '../theme'
import { CAPTIONS, type Caption } from '../copy'
import { cap, smooth } from '../components/typeHelpers'

export const CaptionOverlay: React.FC<{ variant?: 'master' | 'reel'; schedule?: Caption[] }> = ({ variant = 'master', schedule = CAPTIONS }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = frame / fps
  const active = schedule.find((c) => t >= c.from && t < c.from + c.during)
  if (!active) return null
  const localT = (t - active.from) / active.during
  const fadeIn = smooth(cap(localT * 8))
  const fadeOut = 1 - smooth(cap((localT - 0.88) * 8))
  const opacity = Math.min(fadeIn, fadeOut)
  const slideY = (1 - fadeIn) * 18
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: variant === 'reel' ? 480 : 64,
          display: 'flex',
          justifyContent: 'center',
          padding: variant === 'reel' ? '0 80px' : 0,
        }}
      >
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: active.big ? 64 : active.accent ? 34 : 42,
            fontWeight: active.accent ? 850 : 750,
            letterSpacing: active.accent ? '0.16em' : '-0.01em',
            color: active.accent ? C.text : C.text,
            textAlign: 'center',
            opacity,
            transform: `translateY(${slideY}px)`,
            textShadow: '0 4px 30px rgba(2,4,10,0.85)',
            ...(active.accent
              ? {
                  color: C.cyan,
                  textShadow: `0 0 34px rgba(85,227,255,0.35), 0 4px 30px rgba(2,4,10,0.9)`,
                }
              : {}),
          }}
        >
          {active.t}
        </div>
      </div>
    </AbsoluteFill>
  )
}
