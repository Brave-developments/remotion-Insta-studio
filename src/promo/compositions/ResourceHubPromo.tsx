import React from 'react'
import { AbsoluteFill, Audio } from 'remotion'
import { SCENES, MASTER_TOTAL } from '../config'
import { SceneStack } from './SceneStack'
import { CaptionOverlay } from './CaptionOverlay'
import voiceover from '../audio/voiceover.wav'

export const ResourceHubPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#02040A' }}>
      <Audio src={voiceover} />
      <SceneStack map={SCENES} />
      <CaptionOverlay variant="master" />
    </AbsoluteFill>
  )
}

export const RESOURCE_HUB_PROMO_ID = 'ResourceHubPromo'
export const RESOURCE_HUB_PROMO_DURATION = MASTER_TOTAL
