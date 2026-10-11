# Create a Reel

1. Open a channel folder and run npm start. Select ChannelPreview to inspect branding, or D01R1 through D07R2 for an editable production draft.
2. Read that Reel's week-1/day-XX.md production script and week-1/README.md. Edit the script and storyboard in week-1/remotion-week.json. Research present-day claims using primary sources and perform any required real experiment.
3. Copy media into public/assets. Track origin and whether each item is actual evidence or illustration in manifest.json. Set a scene's asset to a public-relative path such as assets/screenshots/before.png. For video set assetKind to video.
4. Audio is deferred. Draft start/end times are editorial estimates. When recording exists, put it in assets/audio, set the Reel audio field to its public-relative path, and revise durationSeconds and scene times to the unmodified audio. Obtain measured sentence/word timestamps before replacing the draft captions. The starter renderer's chunk timing is estimated and must be extended/replaced with measured timing for speech-synchronized captions.
5. Develop the scene components in studio-kit/src/Engine.tsx or add channel-specific components. Current planned scenes are intentionally scaffolded; finished films need their own visual concepts, real media and per-action beats. Keep camera/object continuity and avoid full-screen colour masks.
6. Run npm run typecheck, then npm run render:reel -- D01R1 --draft. For a quick render use --frames=0-29; this saves a separate -sample.mp4. Review the export and scene boundaries.
7. Replace all placeholders, record actual results, add media and primary-source checks, then set productionReady to true. Render without --draft to write the finished MP4 in out/. Posting is a separate action.

## Branding and fonts

The channel.json files include the source palettes and preferred font families. The current engine uses a stable Segoe UI/Arial fallback available on this computer. For final brand typography, bundle licensed Inter, Geist, Manrope or DM Sans files under public/assets/fonts and load them before rendering. No font-service dependency is required for the previews.

## Folder layout

Each channel: README.md, AGENTS.md, channel.json, week-1/remotion-week.json, week-1/day-01.md through day-07.md, week-1/asset-manifest.json, content/reels/, content/SCRIPT_TEMPLATE.md, references/SHARED_CHAT.md, public/assets/, src/, out/.

Shared: studio-kit/PRODUCTION_RULES.md, src/Engine.tsx, Motion.tsx, Objects.tsx, SceneTransition.tsx and scripts/render-reel.cjs.

Keep all three projects and studio-kit as siblings. The existing parent node_modules is used now; project package.json files pin independent install versions if needed.
