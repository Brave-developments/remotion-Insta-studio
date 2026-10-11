import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Inter is bundled in public/fonts so renders never depend on network access.
 * loadFont() registers a delayRender handle internally and calls cancelRender()
 * on failure, so a missing/broken font file fails the render instead of
 * silently falling back to a system font.
 */
const WEIGHTS = [400, 500, 600, 700, 800, 900] as const;

for (const weight of WEIGHTS) {
  loadFont({
    family: 'Inter',
    url: staticFile(`fonts/inter-latin-${weight}.woff2`),
    weight: String(weight),
    style: 'normal',
  });
}

/**
 * The monospace face used for kickers, URLs and code-flavoured labels resolves
 * to Cascadia Code / Consolas, both present on the rendering machine, so it
 * needs no network load.
 */
export const FONTS_READY = true;
