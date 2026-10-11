# src/promo — FiveM Resource Hub campaign module

One scene library → four deliverables ([Root.tsx](../../Root.tsx)).

```
compositions/
  ResourceHubPromo.tsx     master 1920×1080, 1770 frames (59s, with VO)
  ResourceHubPromo30.tsx   30s ad cut, same scenes on compressed beats
  ResourceHubReel.tsx      1080×1920, same timeline + per-scene 9:16 camera
  SceneStack.tsx           mounts scenes as <Sequence> ranges (frames in config.ts)
  CaptionOverlay.tsx       timed on-screen text (variant: master | reel)
scenes/
  01-Hook … 09-Outro       nine acts; each scene reads local frames via useCurrentFrame()
components/
  VideoResourceGalaxy.tsx  canvas-free deterministic replica of the site galaxy
  SequencedBrowserFrame.tsx top bar + nav + search + page slot (site look)
  Cursor.tsx               animated cursor + WidgetCard/GradientThumb primitives
  LogoReveal.tsx           end-card brand lockup ("Find it. Build it. Get seen.")
  SharedStarfield.tsx      starfield, impact Flash, code-fragment chips
  typeHelpers.ts           deterministic seeded random + easing (stable frames)
config.ts                  frame beats: SCENES (59s, retimed to the real VO), SCENES_30 (30s), sizes
copy.ts                    VOICE_LINES (exact narration) + CAPTIONS (on-screen)
audio/                     voiceover.wav (55.15s) + status json + promo-alignment.json (Whisper word timestamps)
```

Key design rules:
- **No HTML canvas / requestAnimationFrame loops** — every frame must be a pure
  function of `useCurrentFrame()` so renders are deterministic.
- Everything is **theme-matched** to the real site palette (theme.ts tokens);
  grid columns 1740px wide inside a 1920 frame mirrors the site max width.
- To make a new cut, add a beat map in `config.ts` and mount `SceneStack` with it.
- To retime scenes after the real voice-over is measured, update `SCENES`
  beats + `VOICE_LINES.at` (see docs/PROMO-VOICE.md) — captions auto-track.
