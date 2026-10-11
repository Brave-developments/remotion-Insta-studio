import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, EdgeVignette, Grain} from './Backdrop';
import {Captions} from './Captions';
import {SceneRenderer} from './SceneRenderer';
import {C, FONT} from './theme';

/**
 * The 60-second vertical reel.
 *
 * Layer order matters:
 *   1. backdrop  — constant canvas, so transitions never flash to black
 *   2. scenes    — crossfade between neighbours, each with its own camera
 *   3. captions  — follow the narration and move per scene
 *   4. grain + edge — one treatment over everything so the film reads as one
 *
 * Everything is driven by src/video/data/reel.json: timings come from the
 * narration, and each scene declares its concept, assets, accent, caption
 * anchor and hand-off to the next scene.
 */
export const Reel: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      fontFamily: FONT.sans,
      color: C.text,
      overflow: 'hidden',
    }}
  >
    <Backdrop />
    <SceneRenderer />
    <Captions />
    <EdgeVignette />
    <Grain />
  </AbsoluteFill>
);
