import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { useSceneDuration } from '../compositions/SceneStack'
import { FONT_STACK, C } from '../theme'
import { VideoResourceGalaxy } from '../components/VideoResourceGalaxy'
import { SharedStarfield } from '../components/SharedStarfield'
import { cap, smooth } from '../components/typeHelpers'

const LABELS = ['SCRIPTS', 'MLOs', 'VEHICLES', 'MAPS', 'UI']

export const CategoriesScene: React.FC = () => {
  const frame = useCurrentFrame()
  const durationInFrames = useSceneDuration()
  const t = frame / durationInFrames
  // slow orbit: lateral drift + parallax rotation on the whole rig
  const orbit = Math.sin(t * Math.PI * 0.9)
  const cameraScale = 1.06 + 0.1 * smooth(cap(t * 1.4))
  const rotY = orbit * 7
  const current = LABELS[Math.min(LABELS.length - 1, Math.floor(t * LABELS.length))]
  const labelOpacity = 0.92
  return (
    <AbsoluteFill style={{ background: '#02040A' }}>
      <SharedStarfield opacity={0.75} drift={0.35} />
      <AbsoluteFill
        style={{
          transform: `perspective(1600px) rotateY(${rotY}deg) scale(${cameraScale}) translateX(${orbit * -40}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <VideoResourceGalaxy form={1} totalResources="2,400+" orbitSpeed={0.02} radius={470} showChips />
      </AbsoluteFill>
      {/* big rotating category word */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96, pointerEvents: 'none' }}>
        <div
          key={current}
          style={{
            fontSize: 74,
            fontWeight: 900,
            letterSpacing: '0.14em',
            color: C.text,
            textShadow: `0 0 34px rgba(85,227,255,0.4)`,
            opacity: labelOpacity,
          }}
        >
          {current}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(2,4,10,0.7) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
