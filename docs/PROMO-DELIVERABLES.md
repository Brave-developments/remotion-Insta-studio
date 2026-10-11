# Promo campaign — build summary (Oct 8, 2026)

## What was built

A single Remotion scene library at `src/promo/` powering **four deliverables**,
all registered in [Root.tsx](../src/Root.tsx):

| Composition id | Size | Length | Purpose |
|---|---|---|---|
| `ResourceHubPromo` | 1920×1080@30 | 59s (1,770 f) | Master brand video |
| `ResourceHubPromo30` | 1920×1080@30 | 30s | Discord/ad cut (captions re-timed) |
| `ResourceHubReel` | 1080×1920@30 | 59s (1,770 f) | Reels/TikTok via 9:16 camera stage |
| `ResourceHubHeroLoop` | 1920×1080@30 | 10s | Silent website hero loop (search→trending) |

Everything follows the final creative decisions:
- 0:43 section reframed as **promotion/visibility** (Servers → Streamers →
  Giveaways → Hosting with featured cards + impressions rail) — not discovery.
- Ending is **"Find it. Build it. Get seen."** — selling discovery + paid promotion.
- Galaxy intro/outro bookends the UI tour (cards converge in, UI collapses back).
- Site-accurate replicas: top bar/nav/search pill, card grid language, galaxy
  core with oct frame + TOTAL RESOURCES counter, palette from the real site CSS.

## Verified

- `npx tsc --noEmit` — clean.
- `npx remotion compositions` — all four registered.
- ~25 still frames rendered across all scenes/compositions and visually QA'd;
  three visual bugs found and fixed during QA (search-bar framing during
  zoom, empty trending cards, outro logo/galaxy overlap, Reel centering).
- Voice-over alignment: `scripts/align-promo-voiceover.py` (Whisper Base,
  CPU) → [src/promo/audio/promo-alignment.json](../src/promo/audio/promo-alignment.json)
  — 95.8% recognized match, drift up to 12.4s vs the old plan.
- Retimed `SCENES` + `VOICE_LINES.at` + captions to the real recording
  (55.15s VO → 1,770 f / 59s master); 11 retime stills re-verified across
  master, Reel and 30s cut (including caption/text probes at exact frames).

## Render

```bash
npm run render:promo      # out/resource-hub-master.mp4 (59s, with VO)
npm run render:promo30    # out/resource-hub-30s.mp4
npm run render:promoreel  # out/resource-hub-reel.mp4 (1080x1920)
npx remotion render ResourceHubHeroLoop out/hero-loop.mp4
```

## Voice-over

`npm run voiceover:promo` → [scripts/generate-promo-voiceover.cjs](../scripts/generate-promo-voiceover.cjs)
sends the exact final script to the local Voicebox (Brave 1 profile, same as
Week 1), polls, downloads + ffprobe-validates, and saves
`src/promo/audio/voiceover.wav`. It is **resumable** — rerun to re-attach.

The WAV exists (55.15s) and scene timing has been re-checked against the real
audio per [docs/PROMO-VOICE.md](PROMO-VOICE.md): `scripts/align-promo-voiceover.py`
produced word timestamps, and `SCENES` beats + `VOICE_LINES.at` in
[copy.ts](../src/promo/copy.ts) were retimed to them (drift had reached 12.4s).
Re-run the script + retime only if the VO is regenerated.

## Not included (next steps)

- Music bed + SFX (plan in [PROMO-STORYBOARD.md](PROMO-STORYBOARD.md)) — drop
  stems into `src/promo/audio/` and add `<Audio>` tracks in the compositions.
- Optional per-line VO takes (the batch generates one continuous read, which
  matches the "confident conversational" direction).
- Final MP4 renders are ~59s of 1080p (master/Reel) — run overnight or lower
  `--concurrency`. None of the three MP4s has been rendered yet.
