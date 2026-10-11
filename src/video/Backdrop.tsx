import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from './theme';

/**
 * Base layer for the whole film: near-black, a soft vignette to keep the
 * centre readable, and a faint atmospheric lift. Deliberately colourless —
 * accents belong to the scenes, not the canvas.
 */
export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse 92% 66% at 50% 42%, rgba(30,31,38,0.55) 0%, rgba(8,8,10,0.25) 46%, rgba(0,0,0,0) 78%)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse 78% 62% at 50% 44%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.72) 100%)',
      }}
    />
  </AbsoluteFill>
);

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Film grain on top of everything, drifting deterministically. Keeps the flat
 * charcoal surfaces from banding after H.264 compression.
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => {
  const frame = useCurrentFrame();
  const x = (frame * 37) % 300;
  const y = (frame * 23) % 300;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundSize: '300px 300px',
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

/** Thin edge darkening so nothing important touches the frame border. */
export const EdgeVignette: React.FC = () => (
  <AbsoluteFill
    style={{
      boxShadow: 'inset 0 0 240px 60px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
    }}
  />
);
