# Storyboard season — three projects

Three separate Remotion projects, each built from one supplied storyboard README in
[`story board/`](story%20board/). They share one component kit so the bank is built once and
reused, while each project keeps its own name, palette and port.

| Project | Storyboard source | Port | Accent |
| --- | --- | --- | --- |
| [RETENTION-LAB](projects/RETENTION-LAB) | `story board/README_60_REMOTION_REELS (1).md` — 60 storyboards | 3024 | `#8B7CFF` violet |
| [UI-MOTION-LAB](projects/UI-MOTION-LAB) | `story board/README_UI_MOTION_45S (1).md` — 27 storyboards | 3025 | `#2DD4BF` teal |
| [BUILDMODE-LAB](projects/BUILDMODE-LAB) | `story board/BUILDMode_AI_45s_Storyboards_README (1).md` — 30 storyboards | 3026 | `#4ADE80` green |

## Where the storyboards came from

The three READMEs are **research extracts from three different Instagram page bundles**. Each
one says so itself and instructs that the source Reels are *idea references only* — no source
wording, captions, layouts, branding or scene order may be copied. Every reel here is an
original script written from the storyboard's own hook, beats and voiceover spine.

## Pipeline

```bash
# 1. scaffold the projects and rebuild season/reels.json from season/source.json
node scripts/setup-season.cjs

# 2. voice-overs from the local Voicebox server (default profile: Brave 1)
node scripts/generate-season-voiceovers.cjs

# 3. typecheck
cd projects/RETENTION-LAB && npm run typecheck        # repeat for the other two

# 4. preview in Remotion Studio
cd projects/RETENTION-LAB && npm start                # http://localhost:3024

# 5. render one reel, or the whole bank
npx remotion render src/index.ts R01-BUG-REPORT out/R01-BUG-REPORT.mp4 --codec=h264
npm run render:bank                          # every reel in this project
npm run render:bank -- --id=R01-BUG-REPORT   # a single reel

# 6. verify rendered frames at pixel level
node scripts/check-season.mjs <framesDir> <reelId>
```

## Files

- `<PROJECT>/season/source.json` — **the editable source.** Scenes, timings, narration, visuals.
- `<PROJECT>/season/reels.json` — **generated.** Never edit by hand; captions are derived here.
- `<PROJECT>/project.json` — name, position, palette, port.
- `reels-kit/src/` — the shared kit: `primitives` (camera, easing, stage), `components`
  (browser, phone, cursor, typing, counter, progress, metric, diagram, connector, timeline,
  before/after, code editor, checklist, retention graph), `player` (backdrop, captions, the
  11 scene types, composition registrar).
- `studio-kit/scripts/render-bank.cjs` — resumable, signature-cached batch renderer.

## Timing honesty

- Scene and caption timings are **editorial**, authored from each storyboard's beats. Each reel
  records this in `timingSource`. Nothing is transcribed from a recording.
- After a voice-over is generated, the measured WAV duration is written to
  `season/source.json` as `audioSeconds`, and `setup-season.cjs` **scales every scene boundary
  to that duration** — the recording becomes the master timeline instead of the nominal 45s.
- Captions are derived from the narration in 3–7 word chunks, so they can never drift from
  what is spoken.

## Measured voice speed

Local Voicebox `Brave 1` on the `voxcpm` engine speaks at roughly **187 words per minute**.
The storyboard word targets (90–110 words for 45s) assume ~140 wpm, so narrations here were
expanded to **130–140 words** to land inside the specified 42–45 second window.

## Status — first batch delivered

**6 reels rendered with audio, all checks passing.**

| Reel | Project | Audio (Brave 1) | Video | Frames |
| --- | --- | --- | --- | --- |
| R01-BUG-REPORT | RETENTION-LAB | 45.87s | 45.87s | 1376 |
| R02-RETENTION-CLIFF | RETENTION-LAB | 44.80s | 44.80s | 1344 |
| U01-LATE-REJECT | UI-MOTION-LAB | 47.31s | 47.32s | 1419 |
| U02-PERCEIVED-SPEED | UI-MOTION-LAB | 43.68s | 43.67s | 1310 |
| B01-DONE-TRAP | BUILDMODE-LAB | 47.36s | 47.38s | 1421 |
| B02-SETUP-BACKWARDS | BUILDMODE-LAB | 43.84s | 43.84s | 1315 |

Verified: h264 1080×1920 30/1, AAC audio present, container duration within 0.02s of the
refit timeline (`node scripts/probe-season.mjs`), and 18 sampled frames passing canvas /
content / caption / right-rail / bottom-safe-area / accent checks
(`node scripts/extract-season-frames.mjs` then `node scripts/check-season.mjs <dir> <reelId>`).

Two fixes were made at the cause rather than by loosening checks:

1. **Narration length** — Voicebox `Brave 1` speaks at ~187 wpm, so the storyboard's 90–110
   word target produced 34s audio against a 45s cut. Narrations were expanded to 130–140 words.
2. **Caption overflow** — a 7-word chunk was wider than the caption box, so the centred block
   overflowed past x=930 into the right rail. The caption is now `width: fit-content;
   maxWidth: 100%`, so it wraps instead of overflowing.

Remaining: 54 + 25 + 28 storyboards are available in the three banks. Author each into
`season/source.json`, then run setup → voice-over → render → check.
