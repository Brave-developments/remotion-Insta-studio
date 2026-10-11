import type {ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Project, Scene} from './types';

export const FPS = 30;

/** Clamp to 0..1. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Normalised progress of `frame` inside [start, end]. */
export const span = (frame: number, start: number, end: number) =>
  clamp01((frame - start) / Math.max(1, end - start));

/** Anticipation + deceleration. Never linear. */
export const ease = (frame: number, start: number, end: number, from = 0, to = 1) => {
  const t = span(frame, start, end);
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return from + (to - from) * eased;
};

/** Snappy settle with a small overshoot — for entrances. */
export const settle = (frame: number, start: number, end: number, from = 0, to = 1) => {
  const t = span(frame, start, end);
  const p = 1 - Math.pow(1 - t, 4);
  const overshoot = Math.sin(t * Math.PI) * 0.045 * (1 - t);
  return from + (to - from) * (p + overshoot);
};

export const useLocal = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return {frame, duration: durationInFrames};
};

/** Virtual camera: slow push-in plus a directional track, clamped to stay in frame. */
export const CameraWrapper = ({
  scene,
  children,
}: {
  scene: Scene;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const duration = Math.max(1, (scene.end - scene.start) * FPS);
  const cam = scene.camera;
  if (!cam) return <AbsoluteFill>{children}</AbsoluteFill>;
  const scale = ease(frame, 0, duration, cam.fromScale, cam.toScale);
  const x = ease(frame, 0, duration, cam.fromX, cam.toX);
  return (
    <AbsoluteFill
      style={{transform: `translateX(${x}px) scale(${scale})`, transformOrigin: '50% 48%'}}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Per-scene shell. Fades in and out inside the scene's own span so neighbours
 * never overlap and no full-screen wipe is ever used.
 */
export const SceneShell = ({
  scene,
  children,
}: {
  scene: Scene;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const duration = Math.max(1, (scene.end - scene.start) * FPS);
  const enter = ease(frame, 0, 10);
  const exit = 1 - ease(frame, duration - 9, duration);
  const opacity = Math.min(enter, exit);
  const drift = ease(frame, 0, duration, 10, -10);
  return (
    <AbsoluteFill style={{opacity, transform: `translateY(${drift}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

/** Content column that keeps text out of the right rail and bottom safe area. */
export const Stage = ({children}: {children: ReactNode}) => (
  <div
    style={{
      position: 'absolute',
      inset: '300px 150px 430px 96px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

export const Label = ({project, children}: {project: Project; children: ReactNode}) => (
  <div
    style={{
      fontFamily: 'Consolas, "Cascadia Code", monospace',
      fontSize: 21,
      letterSpacing: 3,
      color: project.palette.accent,
      marginBottom: 24,
    }}
  >
    {children}
  </div>
);

export const Heading = ({children, size = 86}: {children: ReactNode; size?: number}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 700,
      letterSpacing: -3,
      lineHeight: 1.05,
      color: 'inherit',
    }}
  >
    {children}
  </div>
);

export const Note = ({project, children}: {project: Project; children: ReactNode}) => (
  <div style={{fontSize: 22, color: project.palette.muted, marginTop: 26, lineHeight: 1.45}}>
    {children}
  </div>
);

export const panelStyle = (project: Project) => ({
  border: `1px solid ${project.palette.muted}55`,
  borderRadius: 18,
  background: project.palette.panel,
  boxShadow: '0 30px 80px #0007',
});
