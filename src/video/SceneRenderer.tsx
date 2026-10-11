import React from 'react';
import {useCurrentFrame} from 'remotion';
import {scenesAt} from './data/reel';
import type {SceneType} from './types';
import type {SceneProps} from './types';

import {ParticleScene, ChatScene} from './scenes/OpeningScenes';
import {NetworkScene, DiagramScene} from './scenes/AgentScenes';
import {BrowserScene, TaskFlowScene} from './scenes/BrowserScenes';
import {KineticTextScene} from './scenes/KineticTextScene';
import {DeviceScene, RaceScene} from './scenes/WorkScenes';
import {ComparisonScene, CodeScene, AppsScene, OutroScene} from './scenes/ClosingScenes';

/**
 * One entry per scene type. Adding a scene means adding a component here and
 * a `case` to the validator in data/reel.ts — the JSON alone never changes
 * this file.
 */
export const SCENE_COMPONENTS: Record<SceneType, React.FC<SceneProps>> = {
  particle: ParticleScene,
  chat: ChatScene,
  network: NetworkScene,
  diagram: DiagramScene,
  browser: BrowserScene,
  taskflow: TaskFlowScene,
  kinetic: KineticTextScene,
  device: DeviceScene,
  race: RaceScene,
  comparison: ComparisonScene,
  code: CodeScene,
  apps: AppsScene,
  outro: OutroScene,
};

/**
 * Draws every scene whose frame window contains the current frame. Adjacent
 * scenes overlap during their crossfade, so two are on screen at once — DOM
 * order puts the later scene on top.
 */
export const SceneRenderer: React.FC = () => {
  const frame = useCurrentFrame();
  const active = scenesAt(frame);

  return (
    <>
      {active.map((entry) => {
        const Comp = SCENE_COMPONENTS[entry.scene.type];
        if (!Comp) {
          throw new Error(`No component registered for scene type "${entry.scene.type}"`);
        }
        return <Comp key={entry.scene.id} entry={entry} />;
      })}
    </>
  );
};
