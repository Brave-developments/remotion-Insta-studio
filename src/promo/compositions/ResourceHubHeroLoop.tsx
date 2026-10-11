import React from 'react'
import { AbsoluteFill } from 'remotion'
import { SceneStack } from './SceneStack'

/**
 * ~10s silent loop for the website hero background (1920×1080).
 * No captions, no logo — just the living homepage UI.
 * For a seamless loop the trending scene's scroll eases back, so frame 300
 * sits close to frame 0's framing; encode with a small crossfade if needed.
 */
const HERO_MAP = {
  search: { from: 0, duration: 150 },
  trending: { from: 150, duration: 150 },
} as const

export const ResourceHubHeroLoop: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#02040A' }}>
      <SceneStack map={HERO_MAP} />
    </AbsoluteFill>
  )
}

export const RESOURCE_HUB_HERO_LOOP_ID = 'ResourceHubHeroLoop'
