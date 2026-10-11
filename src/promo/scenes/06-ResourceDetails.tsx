import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { FONT_STACK, C } from '../theme'
import { SequencedBrowserFrame } from '../components/SequencedBrowserFrame'
import { Cursor } from '../components/Cursor'
import { cap, smooth } from '../components/typeHelpers'

const DetailPage: React.FC<{ reveal: number }> = ({ reveal }) => {
  const e = smooth(cap(reveal))
  return (
    <div style={{ padding: '46px 110px', display: 'flex', gap: 40, opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
      <div style={{ flex: 1.25 }}>
        <div
          style={{
            height: 430,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #1E3A8A, #2563EB 60%, #1D4ED8)',
            boxShadow: '0 30px 80px rgba(3,8,20,0.55)',
            display: 'grid',
            placeItems: 'center',
            color: 'rgba(255,255,255,0.9)',
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: '0.08em',
          }}
        >
          QBX_POLICEJOB
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
          {['Overview', 'Installation', 'Preview', 'Changelog'].map((tab, i) => (
            <div
              key={tab}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                color: i === 0 ? C.text : C.muted,
                background: i === 0 ? 'rgba(59,130,246,0.16)' : 'transparent',
                border: `1px solid ${i === 0 ? C.line : 'transparent'}`,
              }}
            >
              {tab}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[86, 64, 74].map((w, i) => (
            <div key={i} style={{ height: 15, width: `${w}%`, borderRadius: 8, background: 'rgba(148,163,184,0.18)' }} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 34, fontWeight: 850, color: C.text, letterSpacing: '-0.02em' }}>qbx_policejob</div>
        <div style={{ marginTop: 6, fontSize: 15, color: C.muted }}>Job script · Qbox framework</div>
        {/* highlight panel */}
        <div
          style={{
            marginTop: 20,
            padding: '18px 20px',
            borderRadius: 14,
            border: `1px solid ${C.lineStrong}`,
            background: 'rgba(11,18,32,0.92)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {[
            ['Published', '2 days ago — Oct 6, 2026'],
            ['Creator', 'Qbox Community (original release)'],
            ['Version', 'v3.2.1'],
            ['License', 'Open source · Free'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
              <span style={{ color: C.muted }}>{k}</span>
              <span style={{ color: C.text, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        {/* official destination button */}
        <div
          style={{
            marginTop: 22,
            height: 58,
            borderRadius: 14,
            background: C.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 18,
            fontWeight: 800,
            boxShadow: `0 14px 44px rgba(59,130,246,0.4)`,
          }}
        >
          ↗ View on official project page
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: C.muted, textAlign: 'center' }}>Always routed to the original release — never re-hosted.</div>
      </div>
    </div>
  )
}

export const ResourceDetailsScene: React.FC = () => {
  const frame = useCurrentFrame()
  // phases: grid w/ card lift (0-30), expansion wipe (30-64), detail hold (64+)
  const lift = smooth(cap(frame / 30))
  const expand = smooth(cap((frame - 30) / 34))
  const cardScale = 1 + 1.7 * expand
  const cardOpacity = 1 - cap((frame - 52) / 14)
  const pageReveal = cap((frame - 46) / 20)
  const cursorX = 1210 - 120 * expand
  const cursorY = 700 - 300 * expand
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: FONT_STACK }}>
      {/* phase 1: grid + highlighted card */}
      <AbsoluteFill style={{ opacity: 1 - cap((frame - 44) / 18) }}>
        <SequencedBrowserFrame
          active="Resources"
          sceneKey="details"
          frame={frame}
          buildPage={() => (
            <AbsoluteFill style={{ padding: '38px 90px' }}>
              <div style={{ fontSize: 24, fontWeight: 850, color: C.text }}>Trending Resources</div>
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, width: 1740 }}>
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 210,
                      borderRadius: 16,
                      border: `1px solid ${i === 4 ? C.lineStrong : C.line}`,
                      background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
                      filter: i === 4 ? 'brightness(1.15)' : 'brightness(0.72) saturate(0.85)',
                      transform: i === 4 ? `scale(${1 + 0.06 * lift})` : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </AbsoluteFill>
          )}
        />
        {/* lifted card flying toward camera */}
        <div
          style={{
            position: 'absolute',
            left: 960,
            top: 620,
            width: 560,
            transform: `translate(-50%, -50%) scale(${cardScale})`,
            opacity: cardOpacity,
            zIndex: 60,
          }}
        >
          <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.lineStrong}`, background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`, boxShadow: '0 40px 110px rgba(3,8,20,0.65)' }}>
            <div style={{ height: 230, background: 'linear-gradient(135deg, #1E3A8A, #2563EB)' }} />
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>qbx_policejob</div>
              <div style={{ marginTop: 6, fontSize: 14, color: C.muted }}>Job · Qbox · Free</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {/* phase 2: detail page materialising behind */}
      <AbsoluteFill style={{ opacity: cap((frame - 40) / 16) }}>
        <SequencedBrowserFrame active="Resources" sceneKey="details" frame={frame} buildPage={() => <DetailPage reveal={pageReveal} />} />
      </AbsoluteFill>
      <Cursor x={cursorX} y={cursorY} opacity={frame < 60 ? 0.9 : 0} click={frame > 24 && frame < 34} />
    </AbsoluteFill>
  )
}
