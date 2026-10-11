# BUILDMode AI

I build and test things with AI.

A separate local Remotion project. Its plan is adapted from the [supplied chat](https://chatgpt.com/share/6ac22572-77ec-83ec-9307-9786067165ba); shared instructions incorporate BUILDMode and our local visual/transition decisions.

## Content and scripts
AI coding challenges · Real agent experiments · Small useful apps · Screenshot-to-interface builds · Open-source automation · Developer workflows

The developed [Week 1 production book](week-1/README.md) contains seven daily script files, each with two full scripts and shot direction. week-1/remotion-week.json now supplies the 14 compositions. Earlier content/reels/ files remain reference briefs. The directed scripts are ready for asset production and test capture; these are not completed tests or publication-ready videos.

| Day | Reel | Script brief | Format | Estimated length |
| --- | --- | --- | --- | --- |
| 1 | 1 | [Three AI Coders. One Broken App.](content/reels/D01R1.md) | Experiment | 48s |
| 1 | 2 | [I Gave AI One Screenshot](content/reels/D01R2.md) | Build | 30s |
| 2 | 1 | [Can an AI Finish a Browser Task?](content/reels/D02R1.md) | Experiment | 50s |
| 2 | 2 | [I Described an App. AI Built It.](content/reels/D02R2.md) | Build | 30s |
| 3 | 1 | [Does Cursor Remember Your Project?](content/reels/D03R1.md) | Experiment | 40s |
| 3 | 2 | [AI Rescues a Terrible Website](content/reels/D03R2.md) | Build | 30s |
| 4 | 1 | [Open-Source Browser Agent Test](content/reels/D04R1.md) | Experiment | 40s |
| 4 | 2 | [Same AI. One Extra Skill.](content/reels/D04R2.md) | Build | 30s |
| 5 | 1 | [AI Builds Its Own Dev Team](content/reels/D05R1.md) | Experiment | 55s |
| 5 | 2 | [One GitHub Issue Into a PR](content/reels/D05R2.md) | Build | 40s |
| 6 | 1 | [Codex Versus Codex Speed Test](content/reels/D06R1.md) | Experiment | 35s |
| 6 | 2 | [One Sentence. One Game.](content/reels/D06R2.md) | Build | 25s |
| 7 | 1 | [A Harmless Trap for an AI Coder](content/reels/D07R1.md) | Experiment | 40s |
| 7 | 2 | [AI Screenshot Cleaner](content/reels/D07R2.md) | Build | 45s |

## Preview and render
From this folder:

- npm start — Studio on port 3022. ChannelPreview is the motion study; D01R1 through D07R2 are draft compositions.
- npm run typecheck — check channel and shared engine.
- npm run render:preview — out/channel-preview.mp4.
- npm run still — out/poster.png.
- npm run render:reel -- D01R1 --draft — marked production draft.
- npm run render:reel -- D01R1 — finished Reel after productionReady and evidence review.

## Environment
Node v24.16.0, React 19.1.1, Remotion 4.0.532, TypeScript 5.9.2. Existing parent node_modules supplies the runtime. Exact dependencies are declared here; npm install creates a separate installation if desired. Keep ../../studio-kit alongside this project.

Edit channel.json for branding and content/week-01.json for scripts, scenes, timings and media paths. Assets live in public/assets; outputs live in out/. Audio is deferred.

Read ../../studio-kit/PRODUCTION_RULES.md and content/CHANNEL_BRIEF.md. No solid-colour transition wipes. Never fabricate outcomes or use illustrative UI as evidence. Audio controls timing when supplied.

## Individual Week 1 builds

Week 1 now has fourteen individually named projects, day 1 / day 1.2 through day 7 / day 7.2, as part of the 42 individual Reel builds. See [all projects](../WEEK-1-PROJECTS.md) and [video gallery](../WEEK-1-GALLERY.html). Custom original visuals are implemented. Silent MP4s export into out/week-1 with matching day names. External model races and matched tool comparisons remain explicitly illustrated test-plan editions; they do not claim unmeasured results.
