import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK, C } from '../theme'
import { SequencedBrowserFrame } from '../components/SequencedBrowserFrame'
import { GradientThumb } from '../components/Cursor'
import { cap, smooth, seeded } from '../components/typeHelpers'

const TRENDING = [
  { title: 'qbx_policejob', fire: 482, hue: 215 },
  { title: 'Renegade MLO Pack', fire: 391, hue: 172 },
  { title: 'HUD Modern', fire: 356, hue: 268 },
  { title: 'Drift handling pack', fire: 310, hue: 24 },
  { title: 'Advanced Garage', fire: 287, hue: 200 },
  { title: 'qb-inventory hud skin', fire: 262, hue: 320 },
]

const LATEST = [
  { title: 'Advanced Impound v2', when: '2h ago', hue: 140 },
  { title: 'Fivem-Map Loader', when: '6h ago', hue: 190 },
  { title: 'Dispatch UI Lite', when: '11h ago', hue: 258 },
  { title: 'Vehicle Keys Qbox', when: '1d ago', hue: 12 },
]

const MiniCard: React.FC<{ title: string; sub: string; hue: number; appear: number }> = ({ title, sub, hue, appear }) => {
  const e = smooth(cap(appear))
  return (
    <div
      style={{
        width: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${C.line}`,
        background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
        opacity: e,
        transform: `translateY(${(1 - e) * 26}px)`,
      }}
    >
      <div style={{ width: '100%' }}>
        <GradientThumb w={556} h={104} hue={hue} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: 15, fontWeight: 720, color: C.text }}>{title}</div>
        <div style={{ marginTop: 5, fontSize: 12, color: C.muted }}>{sub}</div>
      </div>
    </div>
  )
}

export const TrendingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const durationInFrames = useSceneDuration()
  // vertical travel: 0 → 780px over the scene with an ease-in-out curve
  const travel = smooth(cap(frame / (durationInFrames - 8))) * 780
  // card cascades scale with scene length so every grid fully lands in time
  const trendingStart = Math.round(durationInFrames * 0.1)
  const latestStart = Math.round(durationInFrames * 0.42)
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: FONT_STACK }}>
      <SequencedBrowserFrame
        active="Resources"
        sceneKey="trending"
        frame={frame}
        headerSearchValue="police job qbox"
        buildPage={() => (
          <AbsoluteFill>
            <div style={{ transform: `translateY(${-travel}px)` }}>
              {/* top: search results tail */}
              <div style={{ padding: '30px 90px 0', opacity: 0.85 }}>
                <div style={{ fontSize: 14, color: C.muted, marginBottom: 14 }}>Results for “police job qbox”</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, width: 1740 }}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <MiniCard key={i} title={['qbx_policejob', 'MDT Tablet', 'LSPD MLO', 'Cruiser Pack', 'Dispatch UI', 'Holster anim'][i]} sub="Qbox · Free" hue={(i * 57) % 360} appear={1} />
                  ))}
                </div>
              </div>
              {/* trending */}
              <div style={{ padding: '60px 90px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>🔥</span>
                  <span style={{ fontSize: 26, fontWeight: 850, color: C.text, letterSpacing: '-0.02em' }}>Trending Now</span>
                  <span style={{ fontSize: 12, color: C.fire, fontWeight: 800, border: `1px solid rgba(251,113,133,0.4)`, borderRadius: 999, padding: '4px 10px' }}>LIVE</span>
                </div>
                <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, width: 1740 }}>
                  {TRENDING.map((r, i) => (
                    <MiniCard key={r.title} title={r.title} sub={`♡ ${r.fire} fires this week`} hue={r.hue} appear={cap((frame - trendingStart - i * 6) / 12)} />
                  ))}
                </div>
              </div>
              {/* latest releases */}
              <div style={{ padding: '60px 90px 0' }}>
                <div style={{ fontSize: 26, fontWeight: 850, color: C.text, letterSpacing: '-0.02em' }}>Latest Free Releases</div>
                <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, width: 1740 }}>
                  {LATEST.map((r, i) => (
                    <MiniCard key={r.title} title={r.title} sub={r.when} hue={r.hue} appear={cap((frame - latestStart - i * 7) / 12)} />
                  ))}
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,11,20,0.25) 0%, transparent 18%, transparent 82%, rgba(7,11,20,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
