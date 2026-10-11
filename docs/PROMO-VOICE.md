# Promo voice-over + TTS workflow

## Final script (recorded / TTS text)

FiveM resources are everywhere.
Finding the right one shouldn't feel like a full-time job.
Meet FiveM Resource Hub — one place to discover free scripts, MLOs, vehicles, maps, UI packs, and more.
Search exactly what you need, browse what's trending, or jump straight into the latest releases.
Every listing is built around the original resource, with clear publish dates and official project destinations.
So you spend less time hunting and more time building.
Want more eyes on what you're building?
Promote your server, stream, giveaway, or hosting brand and reach more of the FiveM community.
Get featured, gain more visibility, and put your project in front of the right audience.
And if you've built a resource worth sharing, submit it directly for review.
One hub. More discovery. More visibility. Less searching.
FiveM Resource Hub. Find it. Build it. Get seen.

The finale sells **both sides of the site**: discovery ("Find it. Build it.") and
paid promotion ("Get seen.") — replacing the earlier "Launch it." ending.

## TTS / voice-generation prompt (for manual generation)

Read this like a modern technology product launch.
Use a confident, natural male voice with a clean neutral English accent. Keep the
delivery energetic and engaging, but do not sound like a movie trailer, salesman,
or radio announcer. Start the first two sentences slightly slower to create
curiosity. Increase the energy when saying "Meet FiveM Resource Hub." Keep the
middle section fast and smooth while describing search, trending resources,
servers, streamers and hosting. Slow down slightly for the final lines: "One hub.
More discovery. More visibility. Less searching." Then pause briefly before:
"FiveM Resource Hub. Find it. Build it. Get seen." The final brand name should
sound confident and memorable rather than shouted.

Style targets: delivery confident conversational · energy 7/10 · pace ~145–155
wpm · pitch neutral/slightly low · accent neutral international English ·
processing light compression, very light EQ · reverb none to extremely subtle ·
avoid radio-announcer feel and AI-news dramatics.

Voice profile used: **Brave 1** (same Voicebox profile as Week 1, profileId
`741b1aae-46cc-4941-b754-46245dfb69c9`).

## Automated generation

1. Start the local Voicebox server (port 17493).
2. Double-click-free run: `node scripts/generate-promo-voiceover.cjs`
   - Sends the exact script text.
   - Queues one generation, polls `/generate/status-batch`, downloads through `/audio/`,
     checks the WAV with ffprobe (duration, sample rate, channels).
   - Resumable: rerun and it re-uses the remembered generation ID
     ([voiceover-status.json](../src/promo/audio/voiceover-status.json)).
3. Output lands at [src/promo/audio/voiceover.wav](../src/promo/audio/voiceover.wav).

## Aligning timings to the real audio

The scene lengths in [src/promo/config.ts](../src/promo/config.ts) total **59s
(1,770 frames)** to host the final script at ~150 wpm. This step is **done**: the
real recording is 55.15s and the scenes were retimed against it.

1. Measure duration + word timestamps with the local Whisper alignment script:

   ```bash
   "C:/Users/georg/Desktop/Fivem 2026/bot/accent bot/.venv/Scripts/python.exe" scripts/align-promo-voiceover.py
   ```

   (transformers venv only; the script forces CPU, overrides the dead `D:` HF
   cache, and writes [src/promo/audio/promo-alignment.json](../src/promo/audio/promo-alignment.json)
   — 95.8% recognized match, drift up to 12.4s vs the original plan.)
2. Update `VOICE_LINES` `at` values in [src/promo/copy.ts](../src/promo/copy.ts)
   and the `SCENES` beats in [src/promo/config.ts](../src/promo/config.ts) to the
   recognized boundaries (only if they drift more than ~0.4s).
3. The final logo beat must stay ≥3.5s so the brand lockup has room to breathe.
   Current retimed master: last line starts at 51.06s, logo lands just before it,
   and the outro holds to 59s — tagline fully lit while the line is spoken.

Re-run this only if the voice-over is regenerated.
