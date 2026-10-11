import React, { createContext, useContext } from 'react'
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion'
import type { SceneKey, SCENES } from '../config'
import { HookScene } from '../scenes/01-Hook'
import { GalaxyRevealScene } from '../scenes/02-GalaxyReveal'
import { CategoriesScene } from '../scenes/03-Categories'
import { SearchScene } from '../scenes/04-Search'
import { TrendingScene } from '../scenes/05-Trending'
import { ResourceDetailsScene } from '../scenes/06-ResourceDetails'
import { DirectoriesScene } from '../scenes/07-Directories'
import { SubmitScene } from '../scenes/08-Submit'
import { OutroScene } from '../scenes/09-Outro'

// eslint-disable-next-line @typescript-eslint/no-redeclare
const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  hook: HookScene,
  galaxy: GalaxyRevealScene,
  categories: CategoriesScene,
  search: SearchScene,
  trending: TrendingScene,
  details: ResourceDetailsScene,
  montage: DirectoriesScene,
  promote: DirectoriesScene,
  submit: SubmitScene,
  outro: OutroScene,
}

export type SceneMap = Partial<Record<SceneKey, { from: number; duration: number }>>

/**
 * Scenes must pace their animations by THEIR OWN length (which differs between
 * the 66s master and the 30s cut), never by the composition duration.
 * SceneStack provides the active Sequence's length here.
 */
export const SceneDurationContext = createContext<number>(0)

export const useSceneDuration = (): number => {
  const scene = useContext(SceneDurationContext)
  const { durationInFrames } = useVideoConfig()
  return scene > 0 ? scene : durationInFrames
}

export const SceneStack: React.FC<{ map: SceneMap; skip?: SceneKey[] }> = ({ map, skip = [] }) => {
  return (
    <AbsoluteFill>
      {(Object.entries(map) as [SceneKey, { from: number; duration: number }][])
        .filter(([key]) => !skip.includes(key))
        .map(([key, s]) => {
          const Scene = SCENE_COMPONENTS[key]
          return (
            <Sequence key={key} from={s.from} durationInFrames={s.duration} name={key}>
              <SceneDurationContext.Provider value={s.duration}>
                <Scene />
              </SceneDurationContext.Provider>
            </Sequence>
          )
        })}
    </AbsoluteFill>
  )
}
