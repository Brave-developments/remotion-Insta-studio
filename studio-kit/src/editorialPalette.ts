/**
 * Optional editorial-motion palette. Five user-approved background/card colours only.
 * Source: https://github.com/Brave-developments/remotion-motion-kit/tree/main/templates/editorial-motion
 * This NEVER overrides channel.json, video/theme.ts or other scene presets.
 */
export const EDITORIAL_PALETTE = {
  ivory: '#F2EFE7',
  white: '#FFFEFA',
  mint: '#DEF4EA',
  peach: '#FAE7D7',
  lilac: '#EDE6FE',
} as const;

/** Functional neutrals for text/edges only; not additional accent colours. */
export const EDITORIAL_NEUTRALS = {
  text: '#514D57',
  muted: '#817D87',
  border: '#CDC8D0',
  shadow: '#AEA4B4',
} as const;

export type EditorialMode = 'illustrated-explainer' | 'saas-ui' | 'product-comparison';
export type EditorialLayout = 'full' | 'upper';

export const EDITORIAL_TEMPLATE_ID = 'editorial-motion' as const;
export const EDITORIAL_UPPER_HEIGHT = 1160;
