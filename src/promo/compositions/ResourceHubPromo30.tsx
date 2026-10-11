import React from 'react'
import { AbsoluteFill } from 'remotion'
import { SCENES_30 } from '../config'
import { SceneStack } from './SceneStack'
import { CaptionOverlay } from './CaptionOverlay'
import { CAPTIONS_30 } from '../copy'

export const ResourceHubPromo30: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#02040A' }}>
      <SceneStack map={SCENES_30} />
      <CaptionOverlay variant="master" schedule={CAPTIONS_30} />
    </AbsoluteFill>
  )
}

export const RESOURCE_HUB_PROMO30_ID = 'ResourceHubPromo30'
