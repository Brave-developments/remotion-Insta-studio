export const PROMO = {
  width: 1920,
  height: 1080,
  fps: 30,
}

/**
 * Timeline beats for the promo master — 1770 frames = 59s @ 30fps.
 * Retimed to the REAL Voicebox recording (55.15s, see
 * src/promo/audio/promo-alignment.json): every scene start is anchored to the
 * first word of the line it serves, so visuals track the narration instead of
 * the original ~64s estimate. The last ~4s after the final line is the logo
 * breathing room (PROMO-VOICE.md: final logo beat >= 3.5s).
 */
export const SCENES = {
  hook: { from: 0, duration: 120 },
  galaxy: { from: 120, duration: 135 },
  categories: { from: 255, duration: 156 },
  search: { from: 411, duration: 105 },
  trending: { from: 516, duration: 79 },
  details: { from: 595, duration: 167 },
  montage: { from: 762, duration: 193 },
  promote: { from: 955, duration: 318 },
  submit: { from: 1273, duration: 136 },
  outro: { from: 1409, duration: 361 },
}

export const MASTER_TOTAL = 1770

export const CUT30_TOTAL = 900

/** 30-second cut beat map (frames, sums to 900). Keeps the promote section
 *  and gives the galaxy-collapse outro room (~4.5s). */
export const SCENES_30 = {
  hook: { from: 0, duration: 60 },
  galaxy: { from: 60, duration: 55 },
  categories: { from: 115, duration: 90 },
  search: { from: 205, duration: 150 },
  trending: { from: 355, duration: 120 },
  details: { from: 475, duration: 120 },
  montage: { from: 595, duration: 30 },
  promote: { from: 625, duration: 80 },
  submit: { from: 705, duration: 60 },
  outro: { from: 765, duration: 135 },
}

export type SceneKey = keyof typeof SCENES
