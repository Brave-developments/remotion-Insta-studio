import React from 'react'
import { AbsoluteFill, Audio, useCurrentFrame } from 'remotion'
import { SCENES } from '../config'
import { SceneStack } from './SceneStack'
import { CaptionOverlay } from './CaptionOverlay'
import { smooth, cap } from '../components/typeHelpers'
import voiceover from '../audio/voiceover.wav'

export type ReelTrack = { zoom: number; stage: 'galaxy' | 'ui'; originY?: number; originX?: string }

/**
 * Galaxy acts (hook/galaxy/categories/outro) are canvas-agnostic: the galaxy
 * self-centers on the 9:16 frame. UI acts render the 1920×1080 website frame
 * centered, then zoom into the act's focal band via `originY` (stage px).
 */
export const REEL_TRACK: Record<keyof typeof SCENES, ReelTrack> = {
  hook: { zoom: 1, stage: 'galaxy' },
  galaxy: { zoom: 1, stage: 'galaxy' },
  categories: { zoom: 1, stage: 'galaxy' },
  search: { zoom: 1.3, stage: 'ui', originY: 190 },
  trending: { zoom: 1.12, stage: 'ui', originY: 560 },
  details: { zoom: 1.18, stage: 'ui', originY: 470, originX: '62%' },
  montage: { zoom: 1.14, stage: 'ui', originY: 420 },
  promote: { zoom: 1.14, stage: 'ui', originY: 400, originX: '60%' },
  submit: { zoom: 1.16, stage: 'ui', originY: 430 },
  outro: { zoom: 1, stage: 'galaxy' },
}

const UI_SCENE_KEYS = new Set(['search', 'trending', 'details', 'montage', 'promote', 'submit'])

const sceneAt = (frame: number) => {
  const entries = Object.entries(SCENES) as [keyof typeof SCENES, { from: number; duration: number }][]
  return entries.find(([, s]) => frame >= s.from && frame < s.from + s.duration) ?? entries[0]
}

/** UI acts: 16:9 stage centered on the vertical canvas, eased zoom-in per act. */
const UiStage: React.FC<{ activeKey: keyof typeof SCENES; local: number; children: React.ReactNode }> = ({ activeKey, local, children }) => {
  const track = REEL_TRACK[activeKey]
  const e = smooth(cap(local / 20))
  const scale = 1 + (track.zoom - 1) * e
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 1920, height: 1080, flex: 'none', transform: `scale(${scale})`, transformOrigin: `${track.originX ?? '50%'} ${track.originY ?? 400}px` }}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </div>
      {/* letterbox mask kills any scale overflow bleeding outside 9:16 */}
      <AbsoluteFill style={{ boxShadow: '0 0 0 100000px #02040A', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}

export const ResourceHubReel: React.FC = () => {
  const frame = useCurrentFrame()
  const [activeKey, sceneDef] = sceneAt(frame)
  const local = frame - sceneDef.from
  const isUi = UI_SCENE_KEYS.has(activeKey as string)
  return (
    <AbsoluteFill style={{ background: '#02040A', overflow: 'hidden' }}>
      <Audio src={voiceover} />
      {isUi ? (
        <UiStage activeKey={activeKey} local={local}>
          <SceneStack map={SCENES} />
        </UiStage>
      ) : (
        <SceneStack map={SCENES} />
      )}
      <CaptionOverlay variant="reel" />
    </AbsoluteFill>
  )
}

export const RESOURCE_HUB_REEL_ID = 'ResourceHubReel'
