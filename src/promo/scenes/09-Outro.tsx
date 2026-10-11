import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK, C } from '../theme'
import { VideoResourceGalaxy } from '../components/VideoResourceGalaxy'
import { SharedStarfield, Flash } from '../components/SharedStarfield'
import { LogoReveal } from '../components/LogoReveal'
import { cap, smooth } from '../components/typeHelpers'

const FALLING_CARDS = [
  { x: 320, hue: 215, label: 'qbx_policejob' },
  { x: 700, hue: 172, label: 'LSPD MLO' },
  { x: 1100, hue: 268, label: 'HUD Modern' },
  { x: 1500, hue: 24, label: 'Cruiser Pack' },
  { x: 500, hue: 320, label: 'qb-target' },
  { x: 1350, hue: 140, label: 'Garage v2' },
]

export const OutroScene: React.FC<{ logoHold?: boolean }> = ({ logoHold = false }) => {
  const frame = useCurrentFrame()
  const durationInFrames = useSceneDuration()
  const { fps } = useVideoConfig()
  // phase A: UI recedes (0-40) — simulated by falling resource cards shrinking from UI world into galaxy space
  const recede = smooth(cap(frame / 40))
  // phase B: cards collide into core (30-70); galaxy reform (40-90); flash at 70
  const reform = smooth(cap((frame - 40) / 50))
  const flashT = (frame - 70) / fps
  // phase C: logo end card — paced so the logo lands just BEFORE the final
  // brand line (frame ~123 into this scene on the master) while short cuts
  // keep the original early beat; tagline then lights during that line.
  const logoStart = Math.max(84, Math.round(durationInFrames * 0.32))
  const logoIn = smooth(cap((frame - logoStart) / 22))
  const taglineT = cap((frame - (logoStart + 16)) / Math.min(45, Math.max(25, durationInFrames - 115)))
  return (
    <AbsoluteFill style={{ background: '#02040A' }}>
      <SharedStarfield opacity={0.85} drift={0.6} />
      {/* galaxy reforming, then recedes as the logo lands */}
      <AbsoluteFill style={{ transform: `scale(${1.5 - 0.5 * reform})`, opacity: cap((frame - 30) / 25) * (1 - logoIn * 0.92) }}>
        <VideoResourceGalaxy form={reform} totalResources="2,400+" orbitSpeed={0.016} radius={470} showChips={false} />
      </AbsoluteFill>
      {/* UI cards falling away */}
      {FALLING_CARDS.map((c, i) => {
        const delay = i * 3
        const t = smooth(cap((frame - delay) / 34))
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x,
              top: 300 + c.x * 0.12,
              width: 240,
              opacity: (1 - t) * 0.95,
              transform: `translate(0px, ${-260 + t * 900}px) scale(${1.05 - t * 0.55}) rotate(${(seededLike(i) - 0.5) * 20}deg)`,
              zIndex: 20,
              borderRadius: 14,
              overflow: 'hidden',
              border: `1px solid ${C.line}`,
              background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
            }}
          >
            <div style={{ height: 92, background: `linear-gradient(135deg, hsl(${c.hue} 70% 32%), hsl(${(c.hue + 50) % 360} 75% 22%))` }} />
            <div style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: C.text }}>{c.label}</div>
          </div>
        )
      })}
      <Flash t={flashT} peak={0.6} />
      {logoHold ? null : (
        <LogoReveal
          intro={logoIn}
          // domain + tagline must be fully lit WHILE the final line is spoken,
          // so the fade window is capped instead of stretching scene-long.
          outro={taglineT}
        />
      )}
      {/* core glow surge near collapse */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.0) 40%, rgba(59,130,246,0.18) 55%, transparent 75%)',
          opacity: cap((frame - 40) / 30) * (1 - logoIn),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

// tiny local helper (deterministic jitter), keeps this scene dependency-free
function seededLike(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
