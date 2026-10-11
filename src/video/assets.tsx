import React from 'react';
import {Img, staticFile} from 'remotion';
import {ICONS} from './generated/tabler-icons';
import {C} from './theme';

/* ------------------------------------------------------------------ */
/* optional file assets                                                */
/* ------------------------------------------------------------------ */

export type AssetKind = 'logo' | 'image' | 'video' | 'audio' | 'background';

export type AssetEntry = {path: string; kind: AssetKind};

/**
 * Supplied files that live outside the generated cutouts (screenshots,
 * recordings, audio). Empty by default — nothing was supplied — so scenes
 * fall back to their drawn equivalents rather than referencing missing files.
 */
const REGISTRY: Record<string, AssetEntry> = {};

export const getAsset = (key: string): string | null => {
  const entry = REGISTRY[key];
  return entry ? staticFile(entry.path) : null;
};

export const Asset: React.FC<{
  assetKey: string;
  fallback: React.ReactNode;
  style?: React.CSSProperties;
}> = ({assetKey, fallback, style}) => {
  const src = getAsset(assetKey);
  if (!src) return <>{fallback}</>;
  return <Img src={src} style={{display: 'block', ...style}} />;
};

/* ------------------------------------------------------------------ */
/* generated cut-outs                                                  */
/* ------------------------------------------------------------------ */

/**
 * A supplied Tabler illustration, converted to a transparent cut-out by
 * scripts/make-cutouts.mjs. Treated as a motion-design object: it can be
 * scaled, depth-shifted and shadowed rather than dropped in flat.
 *
 * Remotion's <Img> throws if the file is missing, so a typo in a scene's
 * `assets` list fails the render instead of silently disappearing.
 */
export const Cutout: React.FC<{
  name: string;
  width?: number;
  height?: number;
  depth?: number;
  opacity?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({name, width, height, depth = 1, opacity = 1, shadow = true, style}) => (
  <Img
    src={staticFile(`assets/cutouts/${name}.png`)}
    style={{
      display: 'block',
      width,
      height,
      opacity,
      transform: depth !== 1 ? `scale(${depth})` : undefined,
      filter: shadow
        ? 'drop-shadow(0 34px 54px rgba(0,0,0,0.6)) drop-shadow(0 6px 14px rgba(0,0,0,0.4))'
        : undefined,
      ...style,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* supplied Tabler icons                                               */
/* ------------------------------------------------------------------ */

/**
 * Inlined from pngs/tabler-icons-main (MIT, Tabler Icons) at build time by
 * scripts/extract-icons.mjs — the reel ships the real icon artwork.
 * An unknown name throws, so a bad reference fails loudly at render.
 */
export const Icon: React.FC<{
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({name, size = 28, color = 'currentColor', strokeWidth = 1.7, style}) => {
  const icon = (ICONS as Record<string, {viewBox: string; body: string} | undefined>)[name];
  if (!icon) {
    throw new Error(
      `Unknown icon "${name}". Available: ${Object.keys(ICONS).slice(0, 12).join(', ')}, ...`,
    );
  }

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{display: 'block', flexShrink: 0, ...style}}
      dangerouslySetInnerHTML={{__html: icon.body}}
      aria-hidden
    />
  );
};

export const ICON_NAMES = Object.keys(ICONS);

/* ------------------------------------------------------------------ */
/* brand mark                                                          */
/* ------------------------------------------------------------------ */

/** Neutral agent mark — no third-party logo ships with this project. */
export const AgentMark: React.FC<{size?: number; color?: string; accent?: string}> = ({
  size = 34,
  color = C.text,
  accent = C.violet,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{display: 'block'}}>
    <rect x="1" y="1" width="30" height="30" rx="9" stroke={color} strokeOpacity="0.32" />
    <path
      d="M16 7.5l7 4.05v8.9L16 24.5l-7-4.05v-8.9L16 7.5z"
      stroke={accent}
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="2.7" fill={accent} />
  </svg>
);
