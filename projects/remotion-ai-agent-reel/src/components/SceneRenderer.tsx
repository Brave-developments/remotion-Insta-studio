import type {Scene} from '../types';
import {CaptionBar} from './CaptionBar';
import {SceneShell} from './SceneShell';
import {
  AppWindowScene,
  BrowserScene,
  ComparisonScene,
  DiagramScene,
  FeatureListScene,
  HookScene,
  KineticTextScene,
  NumberScene,
  OutroScene,
  PromptScene
} from './scenes/Scenes';

export const SceneRenderer = ({scene, durationFrames, sceneIndex, lastScene}: {scene: Scene; durationFrames: number; sceneIndex: number; lastScene: boolean}) => {
  const content = (() => {
    switch (scene.type) {
      case 'hook': return <HookScene />;
      case 'kinetic': return <KineticTextScene scene={scene} />;
      case 'prompt': return <PromptScene />;
      case 'browser': return <BrowserScene />;
      case 'app-window': return <AppWindowScene scene={scene} />;
      case 'comparison': return <ComparisonScene />;
      case 'feature-list': return <FeatureListScene />;
      case 'diagram': return <DiagramScene scene={scene} />;
      case 'number': return <NumberScene />;
      case 'outro': return <OutroScene />;
      default: return null;
    }
  })();

  return (
    <>
    <SceneShell durationFrames={durationFrames} sceneIndex={sceneIndex} lastScene={lastScene}>
      {content}
    </SceneShell>
      <CaptionBar captions={scene.captions} />
    </>
  );
};



