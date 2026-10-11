import React, {createContext, useContext} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {timeline} from './data/reel';
import type {TimelineEntry} from './types';

/* ------------------------------------------------------------------ */
/* easing                                                              */
/* ------------------------------------------------------------------ */

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutExpo = (t: number): number =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp01(t));

export const easeOutQuint = (t: number): number => 1 - Math.pow(1 - clamp01(t), 5);

export const easeInQuint = (t: number): number => Math.pow(clamp01(t), 5);

/** Ease-out with a touch of overshoot — reads as "settling" rather than stopping. */
export const settle = (t: number): number => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3) * Math.cos(x * Math.PI * 1.15) * 0.35 - Math.pow(1 - x, 3) * 0.65;
};

export const smooth = (t: number): number => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/** Progress of `local` across [a, b], eased. */
export const span = (local: number, a: number, b: number, ease = easeOutQuint): number =>
  ease(clamp01((local - a) / Math.max(1, b - a)));

/* ------------------------------------------------------------------ */
/* local frame helpers                                                 */
/* ------------------------------------------------------------------ */

export const useLocal = (entry: TimelineEntry): number => useCurrentFrame() - entry.from;

export const useStagger = (local: number, delay: number, step = 4, damping = 16): number => {
  const {fps} = useVideoConfig();
  return clamp01(
    spring({
      frame: local - delay - step * 0,
      fps,
      config: {damping, mass: 0.5, stiffness: 120},
    }),
  );
};

/** Spring positioned by absolute local frame: local - (delay + index * step). */
export const springAt = (
  local: number,
  fps: number,
  delay: number,
  index = 0,
  step = 4,
  damping = 16,
): number =>
  clamp01(
    spring({
      frame: local - delay - index * step,
      fps,
      config: {damping, mass: 0.5, stiffness: 120},
    }),
  );

/* ------------------------------------------------------------------ */
/* camera                                                              */
/* ------------------------------------------------------------------ */

export type CamState = {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  rotate?: number;
};

/**
 * Hard limits on the camera.
 *
 * Content is 740px wide inside a 1080px frame, and the share/comment rail
 * starts at x=950. Clamping here means a scene can ask for any move it likes
 * and the safe area still holds — one place to tune instead of fourteen.
 */
const MAX_CAM_X = 26;
const MAX_CAM_Y = 96;
const MIN_CAM_SCALE = 0.96;
const MAX_CAM_SCALE = 1.05;

type CameraValue = {cam: Required<CamState>};

const CameraContext = createContext<CameraValue>({
  cam: {x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotate: 0},
});

/**
 * A virtual camera. Interpolates between two states across the scene so every
 * scene has deliberate movement (push-in, pull-out, tracking, perspective
 * drift) instead of a static frame.
 */
export const CameraWrapper: React.FC<{
  entry: TimelineEntry;
  from?: CamState;
  to?: CamState;
  ease?: (t: number) => number;
  children: React.ReactNode;
}> = ({entry, from = {}, to = {}, ease = easeInOutCubic, children}) => {
  const local = useLocal(entry);
  const t = ease(clamp01(local / Math.max(1, entry.length)));

  const cam: Required<CamState> = {
    x: clampRange(mix(from.x ?? 0, to.x ?? 0, t), MAX_CAM_X),
    y: clampRange(mix(from.y ?? 0, to.y ?? 0, t), MAX_CAM_Y),
    z: mix(from.z ?? 0, to.z ?? 0, t),
    scale: Math.min(MAX_CAM_SCALE, Math.max(MIN_CAM_SCALE, mix(from.scale ?? 1, to.scale ?? 1, t))),
    rotateX: clampRange(mix(from.rotateX ?? 0, to.rotateX ?? 0, t), 9),
    rotateY: clampRange(mix(from.rotateY ?? 0, to.rotateY ?? 0, t), 7),
    rotate: clampRange(mix(from.rotate ?? 0, to.rotate ?? 0, t), 4),
  };

  return (
    <CameraContext.Provider value={{cam}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: 1700,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform:
              `translate3d(${cam.x.toFixed(2)}px, ${cam.y.toFixed(2)}px, ${cam.z.toFixed(2)}px) ` +
              `rotateX(${cam.rotateX.toFixed(3)}deg) rotateY(${cam.rotateY.toFixed(3)}deg) ` +
              `rotate(${cam.rotate.toFixed(3)}deg) scale(${cam.scale.toFixed(4)})`,
          }}
        >
          {children}
        </div>
      </div>
    </CameraContext.Provider>
  );
};

/**
 * A parallax plane inside the camera.
 * depth 0 = far background (counter-moves), 1 = midground (locked),
 * >1 = foreground (overtakes the camera).
 */
export const Layer: React.FC<{
  depth?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({depth = 1, style, children}) => {
  const {cam} = useContext(CameraContext);
  const k = depth - 1;
  const px = -cam.x * k * 0.55;
  const py = -cam.y * k * 0.55;
  const scale = 1 + k * 0.06;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform:
          `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, ${(k * 90).toFixed(1)}px) ` +
          `scale(${scale.toFixed(4)}) rotate(${(cam.rotate * k * 0.4).toFixed(3)}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* enter / exit shell                                                  */
/* ------------------------------------------------------------------ */

const ENTER_STAGGER_FRAMES = 16;

const clampRange = (v: number, limit: number): number =>
  v < -limit ? -limit : v > limit ? limit : v;

/** Content column width inside the safe area, leaving room for camera moves. */
const CONTENT_MAX = 740;

/**
 * Scene container: crossfades with its neighbour (the two share an identical
 * window, so outgoing `1 - smooth(t)` and incoming `smooth(t)` sum to 1),
 * applies the enter direction, ambient drift and safe-area padding.
 */
export const SceneShell: React.FC<{
  entry: TimelineEntry;
  align?: 'center' | 'left';
  children: React.ReactNode;
}> = ({entry, align = 'center', children}) => {
  const local = useLocal(entry);
  const {length, lead, index} = entry;

  // Only the first scene fades up from black; only the last one holds to the
  // end instead of fading out.
  const isFirst = index === 0;
  const isLast = index === timeline.length - 1;

  const enterLen = isFirst ? Math.min(ENTER_STAGGER_FRAMES, length) : lead;
  const exitLen = isLast ? 0 : lead;

  const enterT = clamp01(local / Math.max(1, enterLen));
  const exitT = exitLen > 0 ? clamp01((local - (length - exitLen)) / exitLen) : 0;

  const e = smooth(enterT);
  const x = smooth(exitT);

  const dir = entry.scene.enter ?? 'up';
  const p = 1 - e;

  let tx = 0;
  let ty = 0;
  if (dir === 'up') ty = p * 64;
  else if (dir === 'down') ty = -p * 64;
  else if (dir === 'left') tx = -p * 88;
  else if (dir === 'right') tx = p * 88;

  const t = length > 1 ? clamp01(local / (length - 1)) : 1;
  ty += mix(0, -18, t);
  ty += mix(0, -26, x);

  let scale = dir === 'scale' ? mix(0.96, 1, e) : mix(0.995, 1, e);
  scale *= mix(1, 1.016, t);
  scale *= 1 + x * 0.05;

  const blur = mix(11, 0, e) + mix(0, 13, x);
  const opacity = e * (1 - x);

  if (opacity <= 0.002) return null;

  // Captions move with the scene: scenes captioned at the top reserve the
  // top band so type never covers the visual it describes.
  const anchor = entry.scene.captionAnchor ?? 'bottom';
  const topPad = anchor === 'top' || anchor === 'top-left' ? 460 : 120;
  const bottomPad = anchor === 'top' || anchor === 'top-left' ? 170 : 430;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform:
          `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
        filter: blur > 0.04 ? `blur(${blur.toFixed(2)}px)` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'left' ? 'flex-start' : 'center',
        padding: `${topPad}px 150px ${bottomPad}px 72px`,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: CONTENT_MAX,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: align === 'left' ? 'flex-start' : 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Sequential beats inside one scene: each fades up as the previous rolls out. */
export type PhaseRender = (
  phase: import('./types').Phase,
  opts: {startAt: number; i: number; isLast: boolean},
) => React.ReactNode;

const PHASE_CROSSFADE = 7;

export const Phases: React.FC<{
  entry: TimelineEntry;
  phases: import('./types').Phase[];
  align?: 'center' | 'left';
  render: PhaseRender;
}> = ({entry, phases, align = 'center', render}) => {
  const local = useLocal(entry);
  const {length, from} = entry;

  if (phases.length === 1) {
    return <>{render(phases[0], {startAt: from, i: 0, isLast: true})}</>;
  }

  const share = length / phases.length;
  const justify = align === 'left' ? 'flex-start' : 'center';

  return (
    <>
      {phases.map((phase, i) => {
        const s = i * share;
        const e = (i + 1) * share;
        const X = PHASE_CROSSFADE;

        const enterT = smooth((local - Math.max(0, s - X)) / Math.max(1, Math.min(length, s + X) - Math.max(0, s - X)));
        const outStart = Math.max(0, e - X);
        const outEnd = Math.min(length, e + X);
        const exitT = i === phases.length - 1 ? 0 : smooth((local - outStart) / Math.max(1, outEnd - outStart));
        const opacity = enterT * (1 - exitT);

        if (opacity <= 0.004) return null;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: justify,
              opacity,
              transform: `translateY(${((1 - enterT) * 16 - exitT * 20).toFixed(2)}px)`,
            }}
          >
            {render(phase, {startAt: Math.round(from + s), i, isLast: i === phases.length - 1})}
          </div>
        );
      })}
    </>
  );
};
