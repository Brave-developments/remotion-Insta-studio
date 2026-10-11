import React from 'react'
import { AbsoluteFill } from 'remotion'
import { C, FONT_STACK } from '../theme'
import { cap, smooth } from './typeHelpers'

export const LogoReveal: React.FC<{
  intro: number
  outro: number
  tagline?: string
  domain?: string
  scale?: number
}> = ({ intro, outro, tagline = 'Find it. Build it. Get seen.', domain = 'fivemresourcehub.com', scale = 1 }) => {
  const a = smooth(cap(intro))
  const b = smooth(cap(outro))
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: FONT_STACK, transform: `scale(${scale})` }}>
      <div style={{ transform: `translateY(${(1 - a) * 26}px)`, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ width: 96, height: 86, position: 'relative', transform: 'skew(-10deg)', opacity: a }}>
            <div style={{ position: 'absolute', width: 78, height: 23, left: 8, top: 5, borderRadius: 8, background: C.blue, boxShadow: `0 0 50px rgba(59,130,246,0.6)` }} />
            <div style={{ position: 'absolute', width: 28, height: 74, left: 5, top: 8, borderRadius: 8, background: C.blue, boxShadow: `0 0 50px rgba(59,130,246,0.6)` }} />
            <div style={{ position: 'absolute', width: 55, height: 20, left: 18, top: 38, borderRadius: 8, background: C.blue }} />
          </div>
          <div style={{ opacity: a }}>
            <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: '-0.02em', color: C.text, textShadow: `0 0 40px rgba(59,130,246,0.45)` }}>FIVEM</div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '0.5em', color: C.cyan, marginTop: -6 }}>RESOURCE HUB</div>
          </div>
        </div>
        <div style={{ marginTop: 34, fontSize: 20, letterSpacing: '0.14em', color: C.muted, opacity: b * 0.95 }}>{domain}</div>
        <div style={{ marginTop: 12, fontSize: 30, fontWeight: 750, color: C.text, opacity: b }}>
          Find it. <span style={{ color: C.cyan }}>Build it.</span> <span style={{ color: C.green }}>Get seen.</span>
        </div>
      </div>
    </AbsoluteFill>
  )
}
