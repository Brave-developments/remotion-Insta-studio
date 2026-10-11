import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK } from '../theme'
import { VideoResourceGalaxy } from '../components/VideoResourceGalaxy'
import { SharedStarfield, Flash } from '../components/SharedStarfield'
import { cap, smooth } from '../components/typeHelpers'

/**
 * Card convergence: reuse the galaxy with a fully-scattered start that snaps
 * into formation over the first ~55% of the scene; core glow builds with it.
 */
export const GalaxyRevealScene: React.FC = () => {
  const frame = useCurrentFrame()
  const durationInFrames = useSceneDuration()
  const { fps } = useVideoConfig()
  const form = smooth(cap(frame / (durationInFrames * 0.55)))
  const camera = 1.16 - 0.16 * smooth(cap(frame / (durationInFrames * 0.75)))
  const flashT = (frame - durationInFrames * 0.5) / fps
  const logoIn = smooth(cap((frame - durationInFrames * 0.52) / 20))
  return (
    <AbsoluteFill style={{ background: '#02040A' }}>
      <SharedStarfield opacity={0.85} drift={0.5} />
      <AbsoluteFill style={{ transform: `scale(${camera})` }}>
        <VideoResourceGalaxy form={form} totalResources="2,400+" orbitSpeed={0.02} radius={470} showChips={false} />
      </AbsoluteFill>
      <Flash t={flashT} peak={0.7} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 120,
          fontFamily: FONT_STACK,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: '0.06em',
            color: '#F8FAFC',
            textShadow: '0 0 42px rgba(59,130,246,0.65)',
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 30}px)`,
          }}
        >
          FIVEM <span style={{ color: '#55E3FF' }}>RESOURCE HUB</span>
        </div>
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 52%, rgba(2,4,10,0.8) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
