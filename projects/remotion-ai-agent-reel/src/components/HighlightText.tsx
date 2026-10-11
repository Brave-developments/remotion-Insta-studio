import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const HighlightText = ({text, delay = 0, size = 88}: {text: string; delay?: number; size?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 19, stiffness: 150}});

  return (
    <div
      style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        backgroundColor: theme.blue,
        borderRadius: 18,
        padding: '10px 22px 14px',
        fontSize: size,
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: -4,
        transform: `scaleX(${0.8 + progress * 0.2}) scaleY(${0.85 + progress * 0.15})`,
        opacity: progress,
        boxShadow: `0 20px 60px ${theme.blueGlow}`
      }}
    >
      {text}
    </div>
  );
};
