# Week 1 Voicebox audio generation

The batch uses the installed local Voicebox server at http://127.0.0.1:17493 and the selected **Brave 1** voice for all three channels. It sends each video's exact scene narration, using presentation narration when the illustrated edition supplies it. Personality rewriting and voice effects are disabled. Original scripts are preserved.

Double-click **GENERATE-VOICEOVERS.bat** with Voicebox running to start or resume the batch. It generates one reel at a time and remembers the generation ID immediately. Completed files are skipped when the script, voice and engine match. If Voicebox reports a failure, the batch stops and records the error instead of repeatedly generating new takes.

Each channel gets a separate Voicebox project named **Remotion Week 1 — CHANNEL**. WAV files are downloaded into:

- projects/TOMORROW-EXE/public/audio/day 1.wav through day 7.2.wav
- projects/BUILDMode-AI/public/audio/day 1.wav through day 7.2.wav
- projects/TOOLPROOF/public/audio/day 1.wav through day 7.2.wav

Each individual reel folder receives voiceover.json with its audio path, measured duration, generation ID and input-script fingerprint. Batch progress is saved in studio-kit/voiceover-batch-status.json. Audio containers and durations are checked before files are marked complete. This verifies valid audio and exact script submission; it does not guarantee every synthesized word was pronounced correctly.

All 42 WAV files have now been generated and checked. The original MP4s remain silent. Local Whisper word timestamps are saved in each project's audio-alignment.json; reel.voiced.json holds the new scene boundaries and caption timings. Minor unrecognized tokens interpolate between recognized neighboring words. The text of the captions and scripts is unchanged, and recordings play at their generated speed.

The voiced export batch is in progress. New videos and posters are saved under each channel's out/week-1/voiced, preserving the same day names. The gallery offers voiced versions when their render receipt is complete, plus a link to each silent original. scripts/finish-voiced-week.cjs resumes renders, checks video/audio streams and full recording duration, extracts scene/transition review frames, and updates the gallery. Progress is in studio-kit/voiced-render-status.json; final checks are in voiced-export-verification.json.

Keep the computer awake and Voicebox running during generation. The batch itself runs locally without ongoing AI chat tokens. Do not start a second copy while one is active.
