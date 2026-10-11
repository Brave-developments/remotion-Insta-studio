import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type MainProps = {
  title: string;
  subtitle: string;
};

export const Main: React.FC<MainProps> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200}});
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          opacity: enter,
          transform: `translateY(${(1 - enter) * 60}px)`,
          textAlign: 'center',
        }}
      >
        <h1 style={{fontSize: 120, color: 'white', margin: 0}}>{title}</h1>
        <p style={{fontSize: 48, color: '#a8a8d8', marginTop: 24}}>{subtitle}</p>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 60,
          right: 60,
          height: 8,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.15)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 4,
            background: '#7c5cff',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
