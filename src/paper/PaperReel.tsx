/**
 * Opt-in vertical paper Reel. Existing dark Reel and channel looks are not touched.
 * Every photo is a local file downloaded or imported before render; no random
 * external image requests occur in the frame renderer.
 */
import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import prepared from '../../content/paper/generated.json';
import {KitBrowser, KitMetric} from './motion/KitWidgets';

export type PaperScene = {
  id: string;
  seconds: number;
  layout: 'photo' | 'collage' | 'browser' | 'metric' | 'quote';
  headline: string;
  body?: string;
  label?: string;
  image?: string;
  image2?: string;
  attribution?: string;
  sourceUrl?: string;
  address?: string;
  value?: number;
  suffix?: string;
};
export type PaperJob = {
  title: string;
  fps: number;
  width: number;
  height: number;
  totalSeconds: number;
  scenes: PaperScene[];
};
export const paperJob = prepared as PaperJob;

const P = {
  paper: '#F5F0E6',
  white: '#FFFDF8',
  ink: '#302E2A',
  muted: '#787065',
  border: '#DBD1C3',
  blush: '#F0E1D5',
  sage: '#DEE9DF',
} as const;
const serif = "Georgia, 'Times New Roman', serif";
const sans = "Arial, Helvetica, sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
// Procedural fibres/grain so the template needs no external licensed texture.
const grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.63' numOctaves='3' seed='11' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Paper: React.FC = () => <AbsoluteFill style={{background: P.paper}}>
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 15% 5%, #FFFDF8 0, transparent 55%), radial-gradient(ellipse at 91% 80%, #EAE0D1 0, transparent 55%)'}}/>
  <AbsoluteFill style={{backgroundImage: grain, backgroundSize: '220px 220px', opacity: .12,
    mixBlendMode: 'multiply', pointerEvents: 'none'}}/>
  <div style={{position: 'absolute', top: 55, left: 63, right: 63, borderTop: '2px solid ' + P.border}}/>
  <div style={{position: 'absolute', bottom: 58, left: 63, right: 63, borderTop: '2px solid ' + P.border}}/>
</AbsoluteFill>;

const Photo: React.FC<{src: string; label?: string; height?: number; frame: number}> =
  ({src, label, height = 940, frame}) => {
    const scale = interpolate(frame, [0, 230], [1.035, 1.12], clamp);
    return <div style={{background: P.white, padding: 18, paddingBottom: label ? 76 : 18,
      boxShadow: '12px 22px 46px #6D584526', border: '1px solid #E0D6C7',
      transform: 'rotate(-1.1deg)', overflow: 'hidden'}}>
      <div style={{height, overflow: 'hidden'}}>
        <Img src={staticFile(src.replace(/^\/+/, ''))} alt={label || 'Sourced photo'}
          style={{height: '100%', width: '100%', objectFit: 'cover', transform: 'scale(' + scale + ')'}}/>
      </div>
      {label ? <div style={{fontSize: 27, color: P.muted, margin: '24px 14px 0',
        fontFamily: serif, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'}}>{label}</div> : null}
    </div>;
  };

const PaperSceneView: React.FC<{scene: PaperScene; index: number; total: number}> =
  ({scene, index, total}) => {
    const frame = useCurrentFrame();
    const {fps} = useVideoConfig();
    const enter = spring({frame, fps, config: {damping: 23, stiffness: 105, mass: 1}});
    const opacity = interpolate(frame, [0, 15, Math.max(16, scene.seconds * fps - 12),
      Math.max(18, scene.seconds * fps - 1)], [0, 1, 1, 0], clamp);
    const offset = (1 - enter) * 65;
    const pic = scene.image ? staticFile(scene.image.replace(/^\/+/, '')) : null;
    if (['photo', 'collage', 'browser'].includes(scene.layout) && !pic) {
      throw new Error('Scene ' + scene.id + ' needs a real local image. Run npm run paper:prepare.');
    }
    if (scene.layout === 'collage' && !scene.image2) {
      throw new Error('Collage ' + scene.id + ' needs two sourced images.');
    }
    const largeHeadline = scene.headline.length > 68 ? 63 : scene.headline.length > 38 ? 77 : 94;
    return <AbsoluteFill style={{opacity, color: P.ink, fontFamily: sans}}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 95, display: 'flex',
        justifyContent: 'space-between', fontSize: 24, letterSpacing: 3, fontWeight: 700,
        color: P.muted}}>
        <span>{scene.label || 'THE EDITORIAL FILE'}</span>
        <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 95, top: 188,
        transform: 'translateY(' + (offset * .65) + 'px)'}}>
        <div style={{fontFamily: serif, fontSize: largeHeadline, fontWeight: 700,
          letterSpacing: -2.5, lineHeight: 1.13}}>{scene.headline}</div>
        {scene.body ? <div style={{marginTop: 28, color: P.muted, fontSize: 34,
          lineHeight: 1.38, maxWidth: 875}}>{scene.body}</div> : null}
      </div>
      {scene.layout === 'photo' && pic ? <div style={{position: 'absolute', top: 620,
        left: 75, right: 105, transform: 'translateY(' + offset + 'px)'}}>
        <Photo src={scene.image!} frame={frame} height={990} label={scene.attribution}/>
      </div> : null}
      {scene.layout === 'collage' && pic ? <div style={{position: 'absolute',
        top: 670, left: 55, right: 55, transform: 'translateY(' + offset + 'px)'}}>
        <div style={{width: 730, transform: 'rotate(-3deg)'}}>
          <Photo src={scene.image!} frame={frame} height={780}/>
        </div>
        <div style={{width: 585, position: 'absolute', top: 390, right: 0, transform: 'rotate(6deg)'}}>
          <Photo src={scene.image2!} frame={frame} height={645}/>
        </div>
      </div> : null}
      {scene.layout === 'browser' && pic ? <div style={{position: 'absolute', top: 640,
        left: 80, right: 80, transform: 'translateY(' + offset + 'px)'}}>
        <KitBrowser title={scene.headline} address={scene.address || 'Verified source'}
          image={pic}/>
      </div> : null}
      {scene.layout === 'metric' ? <div style={{position: 'absolute', top: 720,
        left: 85, right: 85, transform: 'translateY(' + offset + 'px)'}}>
        <KitMetric label={scene.label || 'KEY FIGURE'} value={scene.value ?? 0}
          suffix={scene.suffix} source={scene.attribution}/>
      </div> : null}
      {scene.layout === 'quote' ? <div style={{position: 'absolute', top: 710,
        left: 82, right: 82, padding: 63, background: P.white,
        borderLeft: '13px solid #B59F87', boxShadow: '18px 18px 0 ' + P.blush,
        transform: 'translateY(' + offset + 'px)'}}>
        <div style={{fontFamily: serif, fontSize: 52, lineHeight: 1.32,
          fontStyle: 'italic'}}>{scene.body || scene.headline}</div>
        <div style={{fontSize: 27, marginTop: 55, color: P.muted}}>{scene.attribution || 'SOURCE REQUIRED'}</div>
      </div> : null}
      <div style={{position: 'absolute', bottom: 101, left: 70, right: 70, display: 'flex',
        justifyContent: 'space-between', alignItems: 'end', gap: 35,
        color: P.muted, fontSize: 21}}>
        <div style={{maxWidth: 690, whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis'}}>{scene.sourceUrl ? 'SOURCE: ' + scene.sourceUrl : 'PAPER SERIES'}</div>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 25}}>Made with care</div>
      </div>
    </AbsoluteFill>;
  };

export const PaperReel: React.FC = () => {
  let offset = 0;
  return <AbsoluteFill style={{background: P.paper}}>
    <Paper/>
    {paperJob.scenes.length === 0 ? <AbsoluteFill style={{justifyContent: 'center',
      alignItems: 'center', padding: 115, textAlign: 'center', color: P.ink}}>
      <div style={{fontFamily: serif, fontSize: 86}}>Paper Reel Studio</div>
      <div style={{fontSize: 36, marginTop: 25, color: P.muted}}>
        Prepare the real photos first: npm run paper:prepare
      </div>
    </AbsoluteFill> : paperJob.scenes.map((scene, i) => {
      const start = offset;
      const duration = Math.round(scene.seconds * paperJob.fps);
      offset += duration;
      return <Sequence key={scene.id} from={start} durationInFrames={duration}>
        <PaperSceneView scene={scene} index={i} total={paperJob.scenes.length}/>
      </Sequence>;
    })}
  </AbsoluteFill>;
};
