import React, { useMemo } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { C, FONT_STACK } from '../theme'
import { cap, seeded, smooth } from './typeHelpers'

export type GalaxyCardSeed = {
  chip: string
  icon: string
  type: string
  title: string
  phase: number
  size: number
}

/** Category slots mirroring the real galaxy's six orbiters. */
export const GALAXY_CARDS: GalaxyCardSeed[] = [
  { chip: 'MLOs', icon: '⌂', type: 'mlo', title: 'Los Santos Police Dept MLO', phase: 4.18879, size: 1 },
  { chip: 'Vehicles', icon: '◈', type: 'vehicle', title: '2024 Police Cruiser Pack', phase: 5.23599, size: 1.03 },
  { chip: 'UI', icon: '▣', type: 'ui', title: 'qbx_hud — Modern UI', phase: 0, size: 0.96 },
  { chip: 'Jobs', icon: '▲', type: 'job', title: 'qbx_policejob', phase: 1.0472, size: 1.04 },
  { chip: 'Weapons', icon: '✦', type: 'weapon', title: 'Weapon Attachments v2', phase: 2.0944, size: 1.01 },
  { chip: 'Scripts', icon: '⟨⟩', type: 'script', title: 'qb-target Advanced', phase: 3.14159, size: 0.9 },
]

const TYPE_GRADIENT: Record<string, string> = {
  script: 'linear-gradient(135deg,#1E3A8A,#3B82F6)',
  mlo: 'linear-gradient(135deg,#134E4A,#2DD4BF)',
  map: 'linear-gradient(135deg,#134E4A,#2DD4BF)',
  vehicle: 'linear-gradient(135deg,#1F2937,#60A5FA)',
  ui: 'linear-gradient(135deg,#312E81,#818CF8)',
  job: 'linear-gradient(135deg,#14532D,#34D399)',
  weapon: 'linear-gradient(135deg,#3B0764,#A78BFA)',
}

const octPath = (inset: number, w = 390, h = 356, k = 38) => {
  const x0 = inset
  const y0 = inset
  const x1 = w - inset
  const y1 = h - inset
  return `M${x0 + k} ${y0} H${x1 - k} L${x1} ${y0 + k} V${y1 - k} L${x1 - k} ${y1} H${x0 + k} L${x0} ${y1 - k} V${y0 + k} Z`
}

const GalaxyCard: React.FC<{ seed: GalaxyCardSeed; index: number; form: number; radius: number; speed: number }> = ({
  seed,
  index,
  form,
  radius,
  speed,
}) => {
  const frame = useCurrentFrame()
  const t = frame * speed + seed.phase
  const orbitX = Math.cos(t) * radius
  const orbitY = Math.sin(t) * radius * 0.42
  const depth = Math.sin(t) // -1 back .. 1 front
  // Scatter envelope stays inside a 1920×1080 frame at up to ~1.2× zoom so
  // the pre-formation state is always visible (convergence reads as cards
  // flying IN, not materializing from nothing).
  const scatterX = (seeded(index * 7 + 1) - 0.5) * 1660
  const scatterY = (seeded(index * 7 + 2) - 0.5) * 960
  const scatterRot = (seeded(index * 7 + 3) - 0.5) * 50
  const e = smooth(form)
  const x = scatterX + (orbitX - scatterX) * e
  const y = scatterY + (orbitY - scatterY) * e
  const rot = scatterRot * (1 - e)
  const scale = (0.9 + depth * 0.08) * seed.size * (0.7 + 0.3 * e)
  // Visible from the first frame (scattered state) so the scene opens with
  // cards on screen, then they only brighten slightly as they settle in.
  const opacity = cap(0.55 + form * 0.45)
  const z = depth >= 0 ? 20 : 6
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 236,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        zIndex: z,
        opacity,
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${depth >= 0 ? C.lineStrong : C.line}`,
        background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
        boxShadow: depth >= 0 ? '0 24px 60px rgba(3,8,20,0.55)' : '0 10px 30px rgba(3,8,20,0.4)',
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ position: 'relative', height: 104, background: TYPE_GRADIENT[seed.type] ?? TYPE_GRADIENT.script }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.18), transparent 55%)' }} />
        <div style={{ position: 'absolute', left: 10, top: 8, fontSize: 34, color: 'rgba(255,255,255,0.9)' }}>{seed.icon}</div>
        <span
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#04121F',
            background: C.green,
            borderRadius: 6,
            padding: '3px 7px',
          }}
        >
          FREE
        </span>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 15, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {seed.title}
        </div>
        <div style={{ marginTop: 5, fontSize: 12, color: C.muted }}>
          {seed.chip} · Qbox/ESX
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 14, fontSize: 12, color: C.muted }}>
          <span>2d ago</span>
          <span style={{ color: C.fire }}>♡ {40 + Math.round(seeded(index * 13) * 960)}</span>
        </div>
      </div>
    </div>
  )
}

const Chip: React.FC<{ label: string; icon: string; angle: number; radius: number; form: number; speed: number }> = ({
  label,
  icon,
  angle,
  radius,
  form,
  speed,
}) => {
  const frame = useCurrentFrame()
  const t = frame * speed + angle
  const x = Math.cos(t) * radius
  const y = Math.sin(t) * radius * 0.42
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 999,
        border: `1px solid ${C.lineStrong}`,
        background: 'rgba(11,18,32,0.92)',
        color: C.text,
        fontFamily: FONT_STACK,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '0.04em',
        opacity: cap(form * 1.2),
        zIndex: 24,
        boxShadow: '0 0 22px rgba(59,130,246,0.25)',
      }}
    >
      <span style={{ color: C.cyan }}>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

export const VideoResourceGalaxy: React.FC<{
  /** 0 = scattered cards, 1 = fully formed galaxy */
  form: number
  totalResources?: string
  orbitSpeed?: number
  radius?: number
  showChips?: boolean
}> = ({ form, totalResources = '2,400+', orbitSpeed = 0.016, radius = 470, showChips = true }) => {
  const frame = useCurrentFrame()
  const e = smooth(cap(form))
  const coreScale = 0.55 + 0.45 * e
  const bars = [4, 7, 10, 5, 12, 7, 9, 4, 11, 6]
  const chips = useMemo(() => GALAXY_CARDS.map((c, i) => ({ ...c, angle: c.phase + Math.PI / 6, i })), [])
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      {/* center glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 560,
          height: 560,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(85,227,255,0.14) 0, rgba(63,125,255,0.12) 24%, rgba(11,29,56,0.08) 42%, transparent 68%)',
          filter: 'blur(8px)',
        }}
      />
      {/* wire globe */}
      <svg
        viewBox="0 0 500 500"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 430,
          height: 430,
          transform: `translate(-50%, -50%) rotate(${frame * 0.12}deg)`,
          opacity: 0.55 * e,
        }}
      >
        <ellipse cx="250" cy="250" rx="178" ry="178" fill="none" stroke="#42B8FF" strokeWidth="1" opacity="0.14" />
        <ellipse cx="250" cy="250" rx="178" ry="116" fill="none" stroke="#42B8FF" strokeWidth="1" opacity="0.2" />
        <ellipse cx="250" cy="250" rx="178" ry="42" fill="none" stroke="#55E3FF" strokeWidth="1" opacity="0.3" strokeDasharray="4 9" />
        <ellipse cx="250" cy="250" rx="118" ry="178" fill="none" stroke="#42B8FF" strokeWidth="1" opacity="0.18" />
        <ellipse cx="250" cy="250" rx="146" ry="178" fill="none" stroke="#55E3FF" strokeWidth="1" opacity="0.3" />
      </svg>
      {/* orbit network */}
      <svg
        viewBox="0 0 900 710"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 900 * (radius / 380),
          height: 710 * (radius / 380),
          transform: 'translate(-50%, -50%)',
          opacity: 0.9 * e,
          overflow: 'visible',
        }}
      >
        <ellipse cx="450" cy="355" rx="344" ry="152" fill="none" stroke="rgba(85,227,255,0.5)" strokeWidth="1.3" strokeDasharray="4 12" transform="rotate(-8 450 355)" />
        <ellipse cx="450" cy="355" rx="328" ry="136" fill="none" stroke="rgba(63,125,255,0.22)" strokeWidth="1.1" transform="rotate(18 450 355)" />
        <ellipse cx="450" cy="355" rx="220" ry="300" fill="none" stroke="rgba(66,184,255,0.3)" strokeWidth="1.1" strokeDasharray="2 10" transform="rotate(78 450 355)" />
        <circle r="2.4" fill="#F4F7FB">
          <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* core */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 390,
          height: 356,
          transform: `translate(-50%, -50%) scale(${coreScale})`,
          opacity: cap(e * 1.3),
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -30,
            borderRadius: 32,
            background: 'radial-gradient(circle, rgba(59,130,246,0.22), transparent 65%)',
            filter: 'blur(10px)',
          }}
        />
        <svg viewBox="0 0 390 356" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d={octPath(6)} fill="rgba(7,14,30,0.85)" stroke={C.blue} strokeWidth="2" opacity="0.95" />
          <path d={octPath(20)} fill="none" stroke="rgba(85,227,255,0.5)" strokeWidth="1.2" strokeDasharray="6 10" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: C.muted, fontWeight: 700 }}>LIVE RESOURCE HUB</div>
          <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: '0.02em', color: C.text, textShadow: `0 0 26px ${C.blue}` }}>FIVEM</div>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '0.44em', color: C.cyan }}>RESOURCE HUB</div>
          <div style={{ marginTop: 8, fontSize: 11, letterSpacing: '0.22em', color: C.muted }}>
            <span style={{ color: C.green }}>▎</span> TOTAL RESOURCES
          </div>
          <div style={{ fontSize: 24, fontWeight: 850, color: C.text }}>{totalResources}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 14, marginTop: 4 }}>
            {bars.map((h, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: 6,
                  height: h + Math.round(Math.sin(frame * 0.1 + i) * 2),
                  background: i % 3 === 0 ? C.cyan : C.blue,
                  opacity: 0.85,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* orbiting cards + chips */}
      {GALAXY_CARDS.map((seed, i) => (
        <GalaxyCard key={seed.chip} seed={seed} index={i} form={form} radius={radius} speed={orbitSpeed} />
      ))}
      {showChips
        ? chips.map((c) => (
            <Chip key={`chip-${c.chip}`} label={c.chip} icon={c.icon} angle={c.angle} radius={radius * 0.84} form={form} speed={orbitSpeed} />
          ))
        : null}
    </AbsoluteFill>
  )
}
