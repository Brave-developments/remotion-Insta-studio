import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK, C } from '../theme'
import { VideoResourceGalaxy } from '../components/VideoResourceGalaxy'
import { SharedStarfield, CodeFragment } from '../components/SharedStarfield'
import { cap, seeded, smooth } from '../components/typeHelpers'

const FRAGMENTS = [
  'git clone github.com/…/qbx_policejob',
  '[RELEASE] Advanced HUD • ESX/Qbox',
  'v3.2.1 — 412 downloads today',
  'ensure qb-target',
  'MLO · Los Santos PD interior',
  'gui_page = "nui://hud/index.html"',
  '+18 new vehicle configs',
  'forum: “best mapping resource?”',
]

/** Scattered frozen-galaxy cards used for the hook (form = 0 state of the galaxy). */
const HookCard: React.FC<{ index: number; total: number }> = ({ index }) => {
  const frame = useCurrentFrame()
  const x = 140 + seeded(index * 3) * 1640
  const y = 120 + seeded(index * 3 + 1) * 800
  const rot = (seeded(index * 3 + 2) - 0.5) * 14
  const float = Math.sin(frame * 0.05 + index * 1.7) * 7
  const labels = ['qbx_policejob', 'LSPD MLO Pack', 'Vehicle Shop UI', 'HUD Modern Pack', 'qb-target', '_ls-driftv3']
  const types = ['script', 'mlo', 'ui', 'ui', 'script', 'vehicle']
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float,
        width: 250,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.94 + seeded(index + 40) * 0.14})`,
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${C.line}`,
        background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
        boxShadow: '0 20px 50px rgba(3,8,20,0.6)',
        opacity: 0.96,
        zIndex: 10,
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ height: 96, background: `linear-gradient(135deg, hsl(${(index * 47) % 360} 65% 30%), hsl(${(index * 47 + 50) % 360} 75% 20%))` }} />
      <div style={{ padding: '11px 13px' }}>
        <div style={{ fontSize: 15, fontWeight: 750, color: C.text }}>{labels[index % labels.length]}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: C.muted }}>Free · {['Qbox', 'ESX', 'Standalone'][index % 3]}</div>
      </div>
    </div>
  )
}

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame()
  const durationInFrames = useSceneDuration()
  // camera push: scale 1 → 1.14 with slight drift toward centre
  const push = smooth(cap(frame / (durationInFrames - 10)))
  const scale = 1 + 0.14 * push
  const tx = -30 * push
  const ty = -18 * push
  return (
    <AbsoluteFill style={{ background: '#02040A', fontFamily: FONT_STACK }}>
      <AbsoluteFill style={{ transform: `scale(${scale}) translate(${tx}px, ${ty}px)` }}>
        <SharedStarfield opacity={0.9} drift={0.8} />
        {FRAGMENTS.map((f, i) => {
          const cycle = (frame + i * 9) % 46
          const on = cycle < 20
          const x = 200 + seeded(i * 11) * 1520
          const y = 140 + seeded(i * 11 + 3) * 760
          const rot = (seeded(i * 11 + 5) - 0.5) * 16
          return <CodeFragment key={i} x={x} y={y} rot={rot} text={f} opacity={on ? 0.9 : 0} />
        })}
        {Array.from({ length: 6 }, (_, i) => (
          <HookCard key={i} index={i} total={6} />
        ))}
      </AbsoluteFill>
      {/* subtle vignette */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(2,4,10,0.75) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
