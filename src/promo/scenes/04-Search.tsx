import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK, C } from '../theme'
import { SequencedBrowserFrame } from '../components/SequencedBrowserFrame'
import { Cursor, GradientThumb } from '../components/Cursor'
import { cap, smooth, seeded } from '../components/typeHelpers'

const QUERY = 'police job qbox'

const RESULTS = [
  { title: 'qbx_policejob', meta: 'Job · Qbox · 2 days ago', hue: 215, icon: '▲' },
  { title: 'ps-policejob (port)', meta: 'Job · ESX · 5 days ago', hue: 250, icon: '▲' },
  { title: 'LSPD MLO + Interior', meta: 'MLO · Map · 1 week ago', hue: 172, icon: '⌂' },
  { title: 'Police Cruiser Pack 2024', meta: 'Vehicles · 12 models', hue: 300, icon: '◈' },
  { title: 'MDT — Tablet UI', meta: 'UI · React/NUI', hue: 30, icon: '▣' },
]

const SearchResultRow: React.FC<{ r: (typeof RESULTS)[number]; i: number; appear: number }> = ({ r, i, appear }) => {
  const e = smooth(cap(appear))
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: '14px 18px',
        borderRadius: 14,
        border: `1px solid ${C.line}`,
        background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
        opacity: e,
        transform: `translateY(${(1 - e) * 22}px)`,
      }}
    >
      <GradientThumb w={64} h={48} hue={r.hue} label={r.icon} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 750, color: C.text }}>{r.title}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: C.muted }}>{r.meta}</div>
      </div>
      <div style={{ fontSize: 13, color: C.green, fontWeight: 750 }}>FREE</div>
    </div>
  )
}

export const SearchScene: React.FC = () => {
  const frame = useCurrentFrame()
  const d = useSceneDuration()
  // Duration-aware beats (same order at any scene length): zoom → type →
  // results → pullback. Typing keeps a human speed but finishes by ~55% of
  // the scene so the results grid and pullback both get their moment.
  const zoomEnd = Math.max(8, Math.round(d * 0.11))
  const typeStart = zoomEnd
  const typeSpeed = Math.max(1.6, Math.min(3.4, (d * 0.55 - typeStart) / QUERY.length))
  const typeEnd = Math.round(typeStart + QUERY.length * typeSpeed)
  const resultsStart = Math.max(zoomEnd, typeEnd - 2)
  const pullStart = Math.max(typeEnd + 6, Math.round(d * 0.66))
  const pullDur = Math.max(16, d - pullStart - 4)
  // The zoom pivots around the hero search bar's screen position, so the bar
  // stays framed while the page magnifies behind it.
  const zoom = 1 + 0.35 * smooth(cap(frame / zoomEnd)) - 0.27 * smooth(cap((frame - pullStart) / pullDur))
  const typed = QUERY.slice(0, Math.max(0, Math.floor((frame - typeStart) / typeSpeed)))
  const typingDone = frame >= typeEnd
  const cursorX = 960 + Math.sin(frame * 0.03) * 4
  const cursorY = typingDone ? 330 : 300
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: FONT_STACK }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 190px' }}>
        <SequencedBrowserFrame
          active="Resources"
          sceneKey="search"
          frame={frame}
          headerSearchValue={typed || undefined}
          searchWidth={560}
          buildPage={() => (
            <AbsoluteFill style={{ padding: '42px 90px' }}>
              {/* big search hero */}
              <div
                style={{
                  margin: '30px auto 0',
                  width: 1100,
                  height: 66,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '0 24px',
                  borderRadius: 999,
                  border: `2px solid ${typingDone ? C.blue : C.line}`,
                  background: 'rgba(16,16,22,0.95)',
                  boxShadow: typingDone ? `0 0 44px rgba(59,130,246,0.35)` : 'none',
                }}
              >
                <span style={{ fontSize: 22, color: C.muted }}>⌕</span>
                <span style={{ fontSize: 20, color: C.text, fontWeight: 550 }}>{typed}</span>
                {frame % 24 < 12 && !typingDone ? <span style={{ width: 2, height: 26, background: C.cyan }} /> : null}
                {typingDone ? (
                  <span
                    style={{
                      marginLeft: 'auto',
                      background: C.blue,
                      color: 'white',
                      fontWeight: 800,
                      fontSize: 14,
                      borderRadius: 999,
                      padding: '10px 22px',
                    }}
                  >
                    Search
                  </span>
                ) : null}
              </div>
              {/* result rows */}
              <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12, width: 1100, margin: '34px auto 0' }}>
                {RESULTS.map((r, i) => (
                  <SearchResultRow key={r.title} r={r} i={i} appear={(frame - resultsStart - i * 6) / 9} />
                ))}
              </div>
            </AbsoluteFill>
          )}
        />
      </AbsoluteFill>
      <Cursor x={cursorX} y={cursorY} opacity={frame > 8 && frame < pullStart + 12 ? 0.95 : 0} click={typingDone && frame - typeEnd < 8} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, transparent 60%, rgba(2,4,10,0.55) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
