# AI Agent Era — editorial motion reel

1080 × 1920 · 30 fps · 60 seconds · H.264 MP4.

## Finished files

- `ai-agent-era-smooth.mp4` — revised silent video, saved in this folder.
- `poster.png` — final title frame.
- `storyboard.png` — visual review of all 14 scenes.
- `public/scene-data.json` — narration, scene timings, visual concepts and asset details.
- `public/script-timing.json` — estimated sentence and caption timings.
- `SCENE_PLAN.md` — visual scene plan.

## Preview and render

Run `npm install` for an independent installation, then `npm start` to open Remotion Studio. Select `AIAgentReel`.

Run `npm run render` to produce `ai-agent-era-smooth.mp4` directly in this folder. Run `npm run still` for a poster.

## Design and reuse

Scenes are driven by `src/data/ai-agent-scenes.ts`. `src/components/Motion.tsx` contains camera movement, eased cursor movement, typing and progress rings. `src/components/Objects.tsx` contains original vector laptop artwork, app icons, browser framing and the agent network. Scene components compose these reusable elements into task demonstrations and visual metaphors.

The neutral charcoal/off-white base uses restrained lime, amber and violet accents. Scenes overlap for 16 frames, with eased camera tracking, push-ins and pull-backs applied directly to the artwork. The background and frame remain continuous throughout. Caption and scene timestamps retain the original 60-second timeline. The agent mark, browser and app icons recur across the film.

The laptop models, prices, specifications and work interfaces are illustrative artwork, not actual product screenshots or recommendations.

## Audio deferred

Audio was explicitly deferred for this version. Captions use editorial script pacing, including estimated per-word emphasis; they are not derived from a recording. No transcription or measured word timestamps are claimed.

To integrate a future recording, place it in `public/assets`, set `narrationAudio` in `src/assets.ts`, then revise scene durations and caption chunks to follow the unmodified recording. Composition duration is calculated from scene durations.

After changing scene data, run `node scripts/export-plan.cjs` to update the JSON and scene plan.

