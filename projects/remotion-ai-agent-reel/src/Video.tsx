import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {assets} from './assets';
import {FPS, scenes} from './data/ai-agent-scenes';
import {SceneRenderer} from './components/SceneRenderer';
import {TRANSITION_FRAMES} from './components/SceneTransition';
import {theme} from './theme';

export const AIAgentVideo = () => {
  let startFrame = 0;
  return (
    <AbsoluteFill style={{background: theme.bg, color: theme.text, fontFamily: theme.font, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(ellipse at 65% 35%, #25271e55, transparent 65%)'}} />
      <div style={{position: 'absolute', top: 75, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', fontFamily: 'Consolas, monospace', fontSize: 18, letterSpacing: 3, color: '#777a6f'}}>
        <span>FIELD NOTES / AI</span><span>VOL. 001</span>
      </div>
      {[35, 1045].map((left) => <div key={left} style={{position: 'absolute', left, top: 75, bottom: 100, width: 1, background: '#303329'}} />)}
      {assets.narrationAudio ? <Audio src={staticFile(assets.narrationAudio)} /> : null}
      {scenes.map((scene, index) => {
        const durationInFrames = Math.round(scene.duration * FPS);
        const from = startFrame;
        startFrame += durationInFrames;
        const lastScene = index === scenes.length - 1;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames + (lastScene ? 0 : TRANSITION_FRAMES)}>
            <SceneRenderer scene={scene} durationFrames={durationInFrames} sceneIndex={index} lastScene={lastScene} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.1, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.72%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 opacity=%27.35%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")'}} />
    </AbsoluteFill>
  );
};
