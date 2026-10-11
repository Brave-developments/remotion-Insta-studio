import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { makeStars } from './typeHelpers'

const STARS = makeStars(150, 7)

export const SharedStarfield: React.FC<{ opacity?: number; drift?: number }> = ({ opacity = 0.8, drift = 0.5 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {STARS.map((s, i) => {
        const tw = 0.6 + 0.4 * Math.sin(frame * 0.08 * fps * 0.016 + s.tw)
        const xPct = (((s.x * 100) - frame * drift * (0.06 + (i % 5) * 0.02)) % 100 + 100) % 100
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xPct}%`,
              top: `${s.y * 100}%`,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: '50%',
              background: '#BFE9FF',
              opacity: tw * 0.85,
              boxShadow: '0 0 6px rgba(85,227,255,0.8)',
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

export const Flash: React.FC<{ t: number; peak?: number }> = ({ t, peak = 0.85 }) => {
  const a = t <= 0 ? 0 : Math.max(0, peak * Math.exp(-t * 5.2))
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(200,235,255,${a}), rgba(59,130,246,${a * 0.4}) 40%, transparent 72%)` }} />
}

export const CodeFragment: React.FC<{ x: number; y: number; rot: number; text: string; opacity: number }> = ({ x, y, rot, text, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `rotate(${rot}deg)`,
      fontFamily: 'Consolas, monospace',
      fontSize: 15,
      color: 'rgba(126,196,255,0.65)',
      border: '1px solid rgba(59,130,246,0.28)',
      borderRadius: 8,
      padding: '8px 12px',
      background: 'rgba(9,16,30,0.72)',
      whiteSpace: 'pre',
      opacity,
    }}
  >
    {text}
  </div>
)

