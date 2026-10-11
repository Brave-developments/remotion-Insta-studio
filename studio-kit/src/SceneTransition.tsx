import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease} from './Motion';

export const TRANSITION_FRAMES = 16;
// The previous scene lingers underneath the incoming scene, preserving all
// original scene timestamps and the full 60-second composition duration.
export const transitionKinds = [
  'pull-back', 'track-left', 'push-in', 'track-up', 'push-in',
  'track-left', 'pull-back', 'track-left', 'track-up', 'pull-back',
  'track-left', 'push-in', 'pull-back',
] as const;

const pose = (kind: string, amount: number, incoming: boolean) => {
  const direction = incoming ? 1 : -1;
  if (kind === 'track-left') return `translateX(${amount * 100 * direction}px)`;
  if (kind === 'track-up') return `translateY(${amount * 85 * direction}px)`;
  if (kind === 'push-in') return `scale(${1 + amount * (incoming ? -0.08 : 0.12)})`;
  return `scale(${1 + amount * (incoming ? 0.09 : -0.07)}) translateY(${amount * 24 * direction}px)`;
};

export const SceneTransition = ({children, durationFrames, sceneIndex, lastScene, incomingKind, outgoingKind}: {
  children: ReactNode;
  durationFrames: number;
  sceneIndex: number;
  lastScene: boolean;
  incomingKind?: string;
  outgoingKind?: string;
}) => {
  const frame = useCurrentFrame();
  const entering = sceneIndex === 0 ? 1 : ease(frame, 0, TRANSITION_FRAMES);
  const exiting = lastScene ? 0 : ease(frame, durationFrames, durationFrames + TRANSITION_FRAMES);
  const inKind = incomingKind ?? transitionKinds[sceneIndex - 1] ?? 'pull-back';
  const outKind = outgoingKind ?? transitionKinds[sceneIndex] ?? 'pull-back';
  const style: CSSProperties = {
    opacity: entering * (1 - exiting),
    transform: `${pose(inKind, 1 - entering, true)} ${pose(outKind, exiting, false)}`,
    transformOrigin: '50% 48%',
    filter: `blur(${(1 - entering + exiting) * 3}px)`,
    willChange: 'transform, opacity',
  };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
