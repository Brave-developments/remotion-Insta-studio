# TOMORROW-EXE / day 6.2

**The City Without Parking**

This is an individual editable Reel project sharing the channel's Remotion engine and installed environment. No additional dependency installation is needed.

- [Script and shot list](script.md)
- [Editable scene data](reel.json)
- [Full daily director brief](../day-06.md)
- [Rendered MP4](<../../out/week-1/day 6.2.mp4>)

Run `npm run render` from this folder to render just this film. Run `npm run proof` for a short proof or `npm run review` to export every scene and transition review frame. Output stays in the channel's out/week-1/.

Edit this folder's reel.json to change this individual render. Timing, narration, presentation copy, scene assignments and source evidence remain available there. The channel-wide week-1/remotion-week.json supplies Studio defaults. If editing duration here, the renderer resolves composition length from the input Reel. The packaging script overwrites reel.json from the master data; do not rerun it after manual package edits without reconciling changes.

Assets are meaningfully used as objects/layers/evidence, never assumed to be backgrounds. Audio intentionally deferred. This is a fictional possible-future story.

## Voiced edition

Brave 1 audio is saved in this channel’s public/audio with the matching day name. reel.voiced.json contains scene boundaries and caption timings aligned to the actual recording. Run npm run render:voiced to export the voiced version under out/week-1/voiced. The original reel.json and silent MP4 remain available. Audio transcription and waveform checks are recorded in audio-alignment.json and the shared audio-verification report.
