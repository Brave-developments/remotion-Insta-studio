import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { FONT_STACK, C } from '../theme'
import { SequencedBrowserFrame } from '../components/SequencedBrowserFrame'
import { WidgetCard, Cursor } from '../components/Cursor'
import { cap, smooth } from '../components/typeHelpers'

type PageDef = {
  key: 'servers' | 'streamers' | 'giveaways' | 'hosting'
  title: string
  icon: string
  rows: { title: string; sub: string; stat: string; badge?: string; icon: string }[]
}

const PAGES: PageDef[] = [
  {
    key: 'servers',
    title: 'Featured Servers',
    icon: '🎮',
    rows: [
      { title: 'NYC Roleplay', sub: 'Qbox · 24/7 whitelist city', stat: '482', badge: 'FEATURED', icon: '🏙' },
      { title: 'Los Santos Life', sub: 'ESX · heavy RP economy', stat: '317', icon: '🌴' },
      { title: 'Vice Streets', sub: 'Standalone · racing scene', stat: '198', icon: '🏁' },
      { title: 'NorthCounty RP', sub: 'Qbox · semi-serious', stat: '151', icon: '🌲' },
    ],
  },
  {
    key: 'streamers',
    title: 'Live Now — Streamers',
    icon: '📺',
    rows: [
      { title: 'Vaixel', sub: 'Roleplay · 18.4k followers', stat: '2.1k', badge: 'LIVE', icon: '🎧' },
      { title: 'Töre', sub: 'FiveM racing nights', stat: '940', icon: '🎤' },
      { title: 'MikaDev', sub: 'Dev streams · Qbox teardowns', stat: '612', icon: '🛠' },
      { title: 'NolimitsRP Cast', sub: 'City events host', stat: '455', icon: '📣' },
    ],
  },
  {
    key: 'giveaways',
    title: 'Active Giveaways',
    icon: '🎁',
    rows: [
      { title: 'Vehicle Pack Giveaway', sub: 'Ends in 2 days · 1,204 entries', stat: '1.2k', badge: 'HOT', icon: '🚗' },
      { title: 'Qbox Server Kit', sub: 'Ends in 5 days · 830 entries', stat: '830', icon: '📦' },
      { title: 'MLO Bundle Raffle', sub: 'Ends in 1 week · 640 entries', stat: '640', icon: '🏘' },
      { title: 'Custom Paint Slot', sub: 'Ends in 3 days · 402 entries', stat: '402', icon: '🎨' },
    ],
  },
  {
    key: 'hosting',
    title: 'Trusted Hosting',
    icon: '🛡',
    rows: [
      { title: 'Zap-Hosting', sub: 'FiveM servers from €5.60/mo', stat: '4.8★', badge: 'PARTNER', icon: '⚡' },
      { title: 'Symplica Host', sub: 'NVMe + DDoS shield', stat: '4.7★', icon: '🖥' },
      { title: 'GPortal', sub: 'Global edge locations', stat: '4.6★', icon: '🌐' },
      { title: 'Nodecraft', sub: 'Instant setup · 24/7 support', stat: '4.5★', icon: '🚀' },
    ],
  },
]

const SECTION_FRAMES = 64

export const DirectoriesScene: React.FC = () => {
  const frame = useCurrentFrame()
  const idx = Math.min(PAGES.length - 1, Math.floor(frame / SECTION_FRAMES))
  const page = PAGES[idx]
  const localIn = (frame % SECTION_FRAMES) / SECTION_FRAMES
  const enter = smooth(cap(localIn * 4))
  const exit = 1 - smooth(cap((localIn - 0.86) * 8))
  const slide = (1 - enter) * 60 - (1 - exit) * 60
  const featured = page.rows[0]
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: FONT_STACK }}>
      <SequencedBrowserFrame
        active={page.key === 'servers' ? 'Servers' : page.key === 'streamers' ? 'Streamers' : page.key === 'giveaways' ? 'Giveaways' : 'Hosting'}
        sceneKey={page.key}
        frame={frame}
        buildPage={() => (
          <AbsoluteFill>
            <div key={page.key} style={{ transform: `translateX(${slide}px)`, opacity: Math.min(enter, exit) }}>
              <div style={{ padding: '40px 90px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26 }}>{page.icon}</span>
                <span style={{ fontSize: 30, fontWeight: 850, color: C.text, letterSpacing: '-0.02em' }}>{page.title}</span>
              </div>
              {/* featured hero card pushes forward */}
              <div style={{ padding: '26px 90px 0' }}>
                <div
                  style={{
                    transform: `scale(${1 + 0.05 * smooth(cap(localIn * 3))}) translateY(${-6 * smooth(cap(localIn * 3))}px)`,
                    width: 900,
                    boxShadow: '0 30px 90px rgba(3,8,20,0.55)',
                    borderRadius: 18,
                  }}
                >
                  <WidgetCard
                    title={featured.title}
                    subtitle={featured.sub}
                    icon={featured.icon}
                    width={900}
                    stat={featured.stat}
                    badge={featured.badge}
                    style={{ padding: '26px 30px', border: `1px solid ${C.lineStrong}` }}
                  />
                </div>
              </div>
              {/* rest list */}
              <div style={{ padding: '20px 90px 0', display: 'flex', flexDirection: 'column', gap: 12, filter: 'brightness(0.85)' }}>
                {page.rows.slice(1).map((r) => (
                  <WidgetCard key={r.title} title={r.title} subtitle={r.sub} icon={r.icon} width={860} stat={r.stat} />
                ))}
              </div>
              {/* metrics strip (impressions) */}
              <div style={{ position: 'absolute', right: 100, top: 150, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ['Impressions / day', '182,400'],
                  ['Click-throughs', '9,120'],
                  ['Avg. featured dwell', '1m 48s'],
                ].map(([k, v], i) => {
                  const e = smooth(cap((localIn - 0.3 - i * 0.1) * 5))
                  return (
                    <div key={k} style={{ ...{ padding: '18px 22px', borderRadius: 14, border: `1px solid ${C.line}`, background: 'rgba(11,18,32,0.9)' }, opacity: e, transform: `translateX(${(1 - e) * 40}px)` }}>
                      <div style={{ fontSize: 13, color: C.muted, letterSpacing: '0.08em' }}>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 30, fontWeight: 850, color: C.cyan }}>{v}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </AbsoluteFill>
        )}
      />
      <Cursor x={1500} y={430} opacity={0.55} />
    </AbsoluteFill>
  )
}
