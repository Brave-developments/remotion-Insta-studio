import {Composition} from 'remotion';
import {AIAgentVideo} from './Video';
import {FPS, HEIGHT, totalDurationInFrames, WIDTH} from './data/ai-agent-scenes';

export const RemotionRoot = () => (
  <Composition
    id="AIAgentReel"
    component={AIAgentVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
