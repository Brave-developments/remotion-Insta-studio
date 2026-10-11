/**
 * Reusable, opt-in 1080x1920 Remotion editorial scene.
 * Three modes in ONE optional template; not applied on every Remotion render.
 * Illustrative placeholders MUST NOT be passed off as actual product evidence.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  EDITORIAL_NEUTRALS as n, EDITORIAL_PALETTE as p, EDITORIAL_UPPER_HEIGHT,
} from './editorialPalette';
import type {EditorialLayout, EditorialMode} from './editorialPalette';

export type EditorialMotionProps = {
  mode: EditorialMode;
  layout?: EditorialLayout;
  headline: string;
  subheadline?: string;
  items?: string[];
  /** Phrase to emphasise using pastel background instead of yellow. */
  emphasis?: string;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const serif = "Georgia, 'Times New Roman', serif";
const sans = "Arial, Helvetica, sans-serif";

export const EditorialMotion: React.FC<EditorialMotionProps> = ({
  mode, layout = 'full', headline, subheadline = '', items = [], emphasis = '',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const height = layout === 'upper' ? EDITORIAL_UPPER_HEIGHT : 1920;
  const names = (items.length ? items : ['Option A', 'Option B', 'Option C']).slice(0, 3);
  const enter = (delay: number, rise = 65): React.CSSProperties => {
    const s = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 22, stiffness: 145, mass: 0.9}});
    return {
      opacity: interpolate(frame, [delay, delay + 12], [0, 1], clamp),
      transform: `translateY(${(1 - s) * rise}px)`,
    };
  };
  const split = emphasis ? headline.toLowerCase().indexOf(emphasis.toLowerCase()) : -1;
  const heading = split < 0 || !emphasis ? headline : (
    <>
      {headline.slice(0, split)}
      <span style={{background: p.lilac, boxShadow: `6px 0 ${p.lilac}, -4px 0 ${p.lilac}`}}>
        {headline.slice(split, split + emphasis.length)}
      </span>
      {headline.slice(split + emphasis.length)}
    </>
  );
  const card: React.CSSProperties = {
    background: p.white, border: `2px solid ${n.border}`, borderRadius: 29,
    boxShadow: `0 20px 44px ${n.shadow}28`, boxSizing: 'border-box',
  };
  const small: React.CSSProperties = {fontSize: 23, letterSpacing: 2.5, color: n.muted, fontWeight: 800};

  return <AbsoluteFill style={{backgroundColor: layout === 'upper' ? 'transparent' : p.ivory, color: n.text, fontFamily: sans}}>
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height,
      overflow: 'hidden', background: mode === 'saas-ui'
        ? `radial-gradient(ellipse at 92% 0%, ${p.peach}, transparent 48%), radial-gradient(ellipse at 10% 95%, ${p.mint}, transparent 46%), ${p.ivory}`
        : p.ivory,
    }}>
      <div style={{position: 'absolute', left: 60, right: 60, top: layout === 'upper' ? 65 : 150, ...enter(0)}}>
        <div style={{fontFamily: serif, fontSize: headline.length > 42 ? 65 : 85,
          lineHeight: 1.08, letterSpacing: -2.7, textAlign: 'center', overflowWrap: 'anywhere'}}>{heading}</div>
        {subheadline ? <div style={{fontSize: 30, color: n.muted, textAlign: 'center', marginTop: 24}}>{subheadline}</div> : null}
      </div>

      {mode === 'product-comparison' ? <div style={{
        position: 'absolute', left: 45, right: 45, top: layout === 'upper' ? 330 : 520,
        display: 'flex', gap: 16,
      }}>
        {names.map((name, i) => <div key={i} style={{
          ...card, ...enter(10 + i * 11, 110), flex: 1, minWidth: 0,
          height: layout === 'upper' ? 565 : 775, padding: '35px 12px',
          background: [p.mint, p.peach, p.lilac][i],
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around',
        }}>
          <div style={{height: 132, width: 132, borderRadius: 26,
            display: 'grid', placeItems: 'center', background: p.white,
            fontSize: 80, fontWeight: 800}}>{name.trim().charAt(0).toUpperCase() || '?'}</div>
          <div style={{fontFamily: serif, fontSize: 45, textAlign: 'center', lineHeight: 1.1,
            overflowWrap: 'anywhere'}}>{name}</div>
          <div style={{...small, fontSize: 18, textAlign: 'center'}}>ILLUSTRATIVE</div>
        </div>)}
      </div> : null}

      {mode === 'illustrated-explainer' ? <>
        <div style={{position: 'absolute', left: 70, right: 70, top: layout === 'upper' ? 335 : 690,
          display: 'flex', justifyContent: 'space-between', gap: 24}}>
          {names.map((name, i) => <div key={i} style={{
            ...enter(14 + i * 9), width: '31%', padding: '24px 16px',
            borderRadius: 26, textAlign: 'center', background: [p.mint, p.peach, p.lilac][i],
          }}>
            <div style={{fontSize: 68, fontWeight: 800}}>{name.trim().charAt(0).toUpperCase() || '?'}</div>
            <div style={{fontSize: 25, overflowWrap: 'anywhere'}}>{name}</div>
          </div>)}
        </div>
        <div style={{
          ...card, ...enter(43), position: 'absolute', left: 70, right: 70,
          top: layout === 'upper' ? 690 : 1120, padding: 44,
          boxShadow: `10px 10px 0 ${p.lilac}`,
        }}>
          <div style={small}>ILLUSTRATIVE NOTIFICATION</div>
          <div style={{fontSize: 44, fontWeight: 800, marginTop: 19}}>A detail worth checking</div>
          <div style={{fontSize: 29, color: n.muted, marginTop: 18}}>Replace with sourced facts when publishing.</div>
        </div>
      </> : null}

      {mode === 'saas-ui' ? <>
        <div style={{...card, ...enter(12), position: 'absolute', top: layout === 'upper' ? 330 : 610,
          left: 60, right: 60, padding: 35}}>
          <div style={small}>AI AGENT · EXAMPLE</div>
          <div style={{fontSize: 39, marginTop: 25}}>Review the generated workflow.</div>
          <div style={{background: p.mint, borderRadius: 13, padding: 23, marginTop: 26,
            fontSize: 29, fontFamily: 'Consolas, monospace'}}>status: AWAITING_APPROVAL</div>
        </div>
        <div style={{...card, ...enter(30), position: 'absolute', top: layout === 'upper' ? 700 : 1060,
          left: 60, right: 60, padding: 35}}>
          <div style={small}>AUTOMATION · MOCK INTERFACE</div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30, alignItems: 'center'}}>
            <div style={{fontSize: 37, fontWeight: 700}}>Ready for approval</div>
            <div style={{width: 97, height: 51, padding: 6, background: p.lilac, borderRadius: 40, boxSizing: 'border-box'}}>
              <div style={{width: 39, height: 39, borderRadius: 40, background: p.white}}/>
            </div>
          </div>
          <div style={{height: 12, borderRadius: 12, marginTop: 32, background: p.peach}}>
            <div style={{height: '100%', width: `${interpolate(frame, [35, 96], [0, 70], {...clamp, easing: Easing.out(Easing.cubic)})}%`,
              background: p.mint, borderRadius: 12}}/>
          </div>
        </div>
      </> : null}
      <div style={{position: 'absolute', left: 35, right: 35, bottom: 18, fontSize: 17,
        letterSpacing: 1.5, color: n.muted, textAlign: 'center'}}>EDITORIAL MOTION · ILLUSTRATIVE TEMPLATE</div>
    </div>
  </AbsoluteFill>;
};

/** Optional 12-second style gallery; deliberately not a default Reel. */
export const EditorialMotionPreview: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120}>
      <EditorialMotion mode="illustrated-explainer" headline="Explain the important detail."
        emphasis="important" subheadline="Minimal illustrated editorial motion"
        items={['Concept', 'Risk', 'Review']}/>
    </Sequence>
    <Sequence from={120} durationInFrames={120}>
      <EditorialMotion mode="saas-ui" headline="Make the process visible."
        emphasis="visible" subheadline="Animated cards and software interactions"/>
    </Sequence>
    <Sequence from={240} durationInFrames={120}>
      <EditorialMotion mode="product-comparison" headline="Which one fits?"
        subheadline="Three pastel cards, one clear question"
        items={['Tool A', 'Tool B', 'Tool C']}/>
    </Sequence>
  </AbsoluteFill>
);
