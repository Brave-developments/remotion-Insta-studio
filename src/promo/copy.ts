export type VoiceLine = {
  /** Spoken text */
  t: string
  /** Target start time in seconds (refined from the real WAV by align script) */
  at: number
}

/**
 * Final voice-over — measured starts (seconds) from the real recording in
 * src/promo/audio/promo-alignment.json (Whisper word timestamps, 96% match).
 * Promotion framed as visibility, ending on "Find it. Build it. Get seen."
 */
export const VOICE_LINES: VoiceLine[] = [
  { t: 'FiveM resources are everywhere.', at: 0.0 },
  { t: "Finding the right one shouldn't feel like a full-time job.", at: 2.7 },
  { t: 'Meet FiveM Resource Hub — one place to discover free scripts, MLOs, vehicles, maps, UI packs, and more.', at: 6.3 },
  { t: 'Search exactly what you need, browse what’s trending, or jump straight into the latest releases.', at: 14.38 },
  { t: 'Every listing is built around the original resource, with clear publish dates and official project destinations.', at: 19.76 },
  { t: 'So you spend less time hunting and more time building.', at: 26.0 },
  { t: 'Want more eyes on what you’re building?', at: 29.72 },
  { t: 'Promote your server, stream, giveaway, or hosting brand and reach more of the FiveM community.', at: 31.82 },
  { t: 'Get featured, gain more visibility, and put your project in front of the right audience.', at: 37.66 },
  { t: 'And if you’ve built a resource worth sharing, submit it directly for review.', at: 42.8 },
  { t: 'One hub. More discovery. More visibility. Less searching.', at: 47.06 },
  { t: 'FiveM Resource Hub. Find it. Build it. Get seen.', at: 51.06 },
]

/** Plain narration text used for the voice-over batch. */
export const VOICE_TEXT = VOICE_LINES.map((l) => l.t).join('\n')

/** Style directions recorded into the Voicebox request metadata. */
export const VOICE_STYLE = {
  delivery: 'Confident, conversational',
  energy: '7/10',
  paceWPM: '145–155',
  pitch: 'Neutral/slightly low',
  accent: 'Neutral international English',
  emotion: 'Excited but controlled',
  processing: 'Light compression, very light EQ, no reverb',
  avoid: ['radio announcer', 'movie-trailer dramatics'],
}

export type Caption = { t: string; from: number; during: number; accent?: boolean; big?: boolean }

/** On-screen display text, retimed to the real narration (seconds). */
export const CAPTIONS: Caption[] = [
  { t: 'STILL HUNTING FOR FIVEM RESOURCES?', from: 0.2, during: 3.7, accent: true },
  { t: 'FIVEM RESOURCE HUB', from: 6.0, during: 2.5, accent: true, big: true },
  { t: 'SCRIPTS · MLOs · VEHICLES · MAPS · UI', from: 8.6, during: 5.5, accent: true },
  { t: 'Search exactly what you need.', from: 14.4, during: 2.8 },
  { t: 'TRENDING NOW → LATEST RELEASES', from: 17.3, during: 2.4, accent: true },
  { t: 'Original releases. Official destinations.', from: 19.9, during: 5.8 },
  { t: 'Less hunting. More building.', from: 26.1, during: 3.5 },
  { t: 'GET SEEN BY MORE PLAYERS', from: 29.8, during: 2.2, accent: true },
  { t: 'PROMOTE YOUR SERVER · STREAM · GIVEAWAY · BRAND', from: 32.1, during: 5.6, accent: true },
  { t: 'MORE VISIBILITY. MORE REACH.', from: 37.8, during: 2.6, accent: true },
  { t: 'Built something? Share it.', from: 42.9, during: 4.0 },
  { t: 'ONE HUB. MORE DISCOVERY. MORE VISIBILITY. LESS SEARCHING.', from: 47.1, during: 3.7, accent: true },
]

/** Caption schedule for the 30s cut (synced to SCENES_30 beats). */
export const CAPTIONS_30: Caption[] = [
  { t: 'STILL HUNTING FOR FIVEM RESOURCES?', from: 0.2, during: 1.6, accent: true },
  { t: 'FIVEM RESOURCE HUB', from: 2.1, during: 1.6, accent: true, big: true },
  { t: 'SCRIPTS · MLOs · VEHICLES · MAPS · UI', from: 3.9, during: 2.8, accent: true },
  { t: 'Search exactly what you need.', from: 7.0, during: 4.6 },
  { t: 'TRENDING NOW → LATEST RELEASES', from: 11.9, during: 3.7, accent: true },
  { t: 'Original releases. Official destinations.', from: 15.9, during: 3.7 },
  { t: 'Less hunting. More building.', from: 19.8, during: 0.9 },
  { t: 'PROMOTE YOUR SERVER · STREAM · GIVEAWAY · BRAND', from: 20.9, during: 2.4, accent: true },
  { t: 'Built something? Share it.', from: 23.6, during: 1.7 },
  { t: 'ONE HUB. LESS SEARCHING.', from: 25.6, during: 4.2, accent: true },
]
