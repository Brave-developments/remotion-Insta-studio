import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK, C } from '../theme'
import { SequencedBrowserFrame } from '../components/SequencedBrowserFrame'
import { Cursor } from '../components/Cursor'
import { cap, smooth } from '../components/typeHelpers'

export const SubmitScene: React.FC = () => {
  const frame = useCurrentFrame()
  const durationInFrames = useSceneDuration()
  const slide = (1 - smooth(cap(frame / 22))) * 900
  const iconBounce = Math.abs(Math.sin(frame * 0.09)) * 12
  const progress = cap((frame - 40) / (durationInFrames - 70))
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: FONT_STACK }}>
      <SequencedBrowserFrame
        active="Upload"
        sceneKey="submit"
        frame={frame}
        buildPage={() => (
          <AbsoluteFill>
            <div style={{ transform: `translateX(${slide}px)` }}>
              <div style={{ padding: '52px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* animated upload icon */}
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 32,
                    border: `2px solid ${C.lineStrong}`,
                    background: 'rgba(11,18,32,0.9)',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: `0 0 60px rgba(59,130,246,0.3)`,
                    transform: `translateY(${-iconBounce}px)`,
                  }}
                >
                  <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V6M12 6l-6 6M12 6l6 6" stroke={C.cyan} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 21h16" stroke={C.blue} strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ marginTop: 26, fontSize: 34, fontWeight: 850, color: C.text, letterSpacing: '-0.02em' }}>Submit your resource</div>
                <div style={{ marginTop: 10, fontSize: 16, color: C.muted }}>Original work only — reviewed by the team before listing.</div>
                {/* fake form */}
                <div style={{ marginTop: 36, width: 900, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    ['Resource name', 'qbx_my_new_job'],
                    ['Source URL (GitHub / forum post)', 'https://github.com/…'],
                    ['Category', 'Job · Qbox'],
                  ].map(([label, value], i) => (
                    <div key={label} style={{ opacity: smooth(cap((frame - 26 - i * 8) / 12)) }}>
                      <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{label}</div>
                      <div
                        style={{
                          height: 46,
                          borderRadius: 12,
                          border: `1px solid ${C.line}`,
                          background: 'rgba(16,16,22,0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          color: C.text,
                          fontSize: 15,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, height: 54, borderRadius: 12, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16, boxShadow: `0 14px 44px rgba(59,130,246,0.35)` }}>
                    Submit for review
                  </div>
                  {frame > 60 ? (
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.green }}>
                      <span>✓</span> Queued for review · typical turnaround &lt; 24h
                    </div>
                  ) : null}
                  <div style={{ marginTop: 10, height: 6, borderRadius: 6, background: 'rgba(148,163,184,0.15)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})` }} />
                  </div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )}
      />
      <Cursor x={960} y={880} opacity={frame > 50 ? 0.9 : 0} click={frame > 62 && frame < 72} />
    </AbsoluteFill>
  )
}
