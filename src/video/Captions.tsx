import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {accentOf, captionAnchorAt, captionStyleAt, cuesNear, sceneAt} from './data/reel';
import {clamp01, smooth} from './motion';
import {accentSoft, C, FONT, LAYOUT, SIZE} from './theme';
import type {CaptionAnchor, CaptionCue, CaptionStyle} from './types';

const OUT_TAIL = 5;
const IN_FRAMES = 6;

/** Fixed slot so a cue can sit absolutely and roll over its predecessor. */
const slotFor = (anchor: CaptionAnchor): React.CSSProperties => {
  const base: React.CSSProperties = {position: 'absolute'};
  if (anchor === 'top') return {...base, left: LAYOUT.left, right: LAYOUT.right, top: 130, height: 340};
  if (anchor === 'top-left')
    return {...base, left: LAYOUT.left, right: 380, top: 130, height: 340};
  if (anchor === 'bottom-left')
    return {...base, left: LAYOUT.left, right: LAYOUT.right, bottom: 190, height: 340};
  return {...base, left: LAYOUT.left, right: LAYOUT.right, bottom: 190, height: 340};
};

const isTop = (anchor: CaptionAnchor) => anchor === 'top' || anchor === 'top-left';

/** One cue's emphasis treatment — deliberately varies from scene to scene. */
const Word: React.FC<{
  text: string;
  hl: boolean;
  style: CaptionStyle;
  accent: string;
  delay: number;
  local: number;
}> = ({text, hl, style, accent, delay, local}) => {
  const {fps} = useVideoConfig();
  const s = clamp01(spring({frame: local - delay, fps, config: {damping: 200, mass: 0.4}}));
  const a = clamp01(spring({frame: local - delay - 3, fps, config: {damping: 200, mass: 0.5}}));

  const base: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    opacity: s,
    transform: `translateY(${((1 - s) * 13).toFixed(2)}px)`,
  };

  if (!hl) return <span style={base}>{text}</span>;

  if (style === 'weight') {
    return (
      <span
        style={{
          ...base,
          color: accent,
          fontWeight: 900,
          textShadow: `0 0 28px ${accentSoft(accent, 0.45)}`,
        }}
      >
        {text}
      </span>
    );
  }

  if (style === 'underline') {
    return (
      <span style={base}>
        <span
          style={{
            position: 'absolute',
            left: '-0.04em',
            right: '-0.04em',
            bottom: '-0.1em',
            height: '0.1em',
            borderRadius: '0.06em',
            background: accent,
            transformOrigin: 'left center',
            transform: `scaleX(${a.toFixed(4)})`,
          }}
        />
        <span style={{position: 'relative'}}>{text}</span>
      </span>
    );
  }

  if (style === 'tint') {
    return (
      <span
        style={{
          ...base,
          background: accentSoft(accent, 0.22 * a),
          borderRadius: 12,
          padding: '0 0.16em',
          boxShadow: `inset 0 -0.07em 0 ${accentSoft(accent, 0.9 * a)}`,
        }}
      >
        {text}
      </span>
    );
  }

  // box — the one scene that still uses a filled rounded rectangle
  return (
    <span style={base}>
      <span
        style={{
          position: 'absolute',
          left: '-0.26em',
          right: '-0.26em',
          top: '-0.16em',
          bottom: '-0.14em',
          background: accent,
          borderRadius: '0.26em',
          transformOrigin: 'left center',
          transform: `scaleX(${a.toFixed(4)})`,
        }}
      />
      <span style={{position: 'relative', color: '#08080A', fontWeight: 850}}>{text}</span>
    </span>
  );
};

const Cue: React.FC<{
  cue: CaptionCue;
  local: number;
  anchor: CaptionAnchor;
  style: CaptionStyle;
  accent: string;
}> = ({cue, local, anchor, style, accent}) => {
  const {fps} = useVideoConfig();
  const start = cue.start * fps;
  const end = cue.end * fps;
  const inT = smooth((local - start) / IN_FRAMES);
  const outT = smooth((local - end) / OUT_TAIL);
  const opacity = inT * (1 - outT);
  if (opacity <= 0.004) return null;

  const y = (1 - inT) * 24 - outT * 24;
  const top = isTop(anchor);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [top ? 'top' : 'bottom']: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: anchor === 'top-left' || anchor === 'bottom-left' ? 'flex-start' : 'center',
        alignContent: top ? 'flex-start' : 'flex-end',
        columnGap: '0.26em',
        rowGap: '0.16em',
        opacity,
        transform: `translateY(${y.toFixed(2)}px)`,
        fontFamily: FONT.sans,
        fontSize: SIZE.caption,
        fontWeight: 700,
        color: C.text,
        letterSpacing: '-0.022em',
        lineHeight: 1.24,
        textAlign: anchor.includes('left') ? 'left' : 'center',
        textShadow: '0 2px 18px rgba(0,0,0,0.85)',
      } as React.CSSProperties}
    >
      {cue.words.map((word, i) => (
        <Word
          key={`${i}-${word.text}`}
          text={word.text}
          hl={word.hl}
          style={style}
          accent={accent}
          delay={start + i * 1.3}
          local={local}
        />
      ))}
    </div>
  );
};

/**
 * Narration captions.
 *
 * Position, accent and emphasis style all follow the scene underneath, so
 * captions never sit in one fixed spot and never cover the visual they are
 * describing.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const anchor = captionAnchorAt(frame);
  const style = captionStyleAt(frame);
  const entry = sceneAt(frame);
  const accent = entry ? accentOf(entry.scene) : C.violet;

  const visible = cuesNear(frame, OUT_TAIL);
  if (visible.length === 0) return null;

  return (
    <div style={slotFor(anchor)}>
      {visible.map((cue) => (
        <Cue
          key={`${cue.start}-${cue.end}`}
          cue={cue}
          local={frame}
          anchor={anchor}
          style={style}
          accent={accent}
        />
      ))}
    </div>
  );
};
