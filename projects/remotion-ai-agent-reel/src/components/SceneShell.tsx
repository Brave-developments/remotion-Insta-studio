import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {SceneTransition} from './SceneTransition';

export const SceneShell = ({children, durationFrames, sceneIndex, lastScene}: {
  children: ReactNode; durationFrames: number; sceneIndex: number; lastScene: boolean;
}) => (
  <AbsoluteFill style={{color: theme.text, fontFamily: theme.font}}>
    <SceneTransition durationFrames={durationFrames} sceneIndex={sceneIndex} lastScene={lastScene}>
      {children}
    </SceneTransition>
  </AbsoluteFill>
);
