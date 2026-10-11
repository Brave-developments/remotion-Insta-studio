/**
 * Design tokens for the vertical reel.
 *
 * Base is deliberately neutral — charcoal, off-white, grey. Colour is an
 * accent applied per scene, never a wash: scenes declare which accent they
 * use, so the film does not read as "everything is blue".
 */
export const C = {
  // base
  bg: '#050506',
  bgSoft: '#0A0B0D',
  surface: '#111214',
  surfaceRaised: '#17181B',
  border: '#232529',
  borderSoft: '#1B1D20',

  // type
  text: '#F2F0EC', // off-white, not pure white
  textDim: '#9A9A9E',
  textFaint: '#5E6065',

  // accents — pick per scene, do not use them all at once
  violet: '#8B7CFF',
  blue: '#3B82F6',
  green: '#4ADE80',
  amber: '#F5B544',
  coral: '#FF7A6B',

  // the illustration set ships on this navy; useful as an intentional plate
  plate: '#232B41',
} as const;

export type AccentKey = 'violet' | 'blue' | 'green' | 'amber' | 'coral';

export const ACCENT: Record<AccentKey, string> = {
  violet: C.violet,
  blue: C.blue,
  green: C.green,
  amber: C.amber,
  coral: C.coral,
};

/** Translucent washes built from an accent, for fills and glows. */
export const accentSoft = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const FONT = {
  sans: `'Inter', 'Segoe UI', system-ui, -apple-system, Helvetica, Arial, sans-serif`,
  mono: `'Cascadia Code', 'Cascadia Mono', Consolas, 'SF Mono', 'Roboto Mono', monospace`,
} as const;

export const R = {sm: 10, md: 16, lg: 24, xl: 32, pill: 999} as const;

/**
 * Safe-area padding for 1080x1920 short-form video.
 * Right clears the share/comment rail, bottom clears captions + CTA.
 */
export const LAYOUT = {left: 72, right: 150, top: 120, bottom: 420} as const;

export const SIZE = {
  hero: 128,
  title: 92,
  sub: 64,
  body: 50,
  caption: 54,
  kicker: 24,
} as const;

export type SizeKey = keyof typeof SIZE;
