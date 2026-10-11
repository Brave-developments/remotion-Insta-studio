# TOOLPROOF

I test internet tools so you don’t have to.

A separate local Remotion project. Its plan is adapted from the [supplied chat](https://chatgpt.com/share/6ac2257c-2e48-83ec-ba52-d3d271715ee9); shared instructions incorporate BUILDMode and our local visual/transition decisions.

## Content and scripts
Useful tool discovery · Objective hands-on tests · Free versus paid · Open-source software · Creator/productivity tools · Honest limitations

The developed [Week 1 production book](week-1/README.md) contains seven daily script files, each with two full scripts and shot direction. week-1/remotion-week.json now supplies the 14 compositions. Earlier content/reels/ files remain reference briefs. The directed scripts are ready for asset production and test capture; these are not completed tests or publication-ready videos.

| Day | Reel | Script brief | Format | Estimated length |
| --- | --- | --- | --- | --- |
| 1 | 1 | [Kando — Discovery](content/reels/D01R1.md) | Discovery | 35s |
| 1 | 2 | [Kando — Start Menu Test](content/reels/D01R2.md) | Test | 50s |
| 2 | 1 | [LocalSend — Discovery](content/reels/D02R1.md) | Discovery | 35s |
| 2 | 2 | [LocalSend — Transfer Test](content/reels/D02R2.md) | Test | 50s |
| 3 | 1 | [Stirling PDF — Discovery](content/reels/D03R1.md) | Discovery | 35s |
| 3 | 2 | [Stirling PDF — Acrobat Test](content/reels/D03R2.md) | Test | 55s |
| 4 | 1 | [Cap — Discovery](content/reels/D04R1.md) | Discovery | 35s |
| 4 | 2 | [Cap — Loom Test](content/reels/D04R2.md) | Test | 55s |
| 5 | 1 | [OpenCut — Discovery](content/reels/D05R1.md) | Discovery | 35s |
| 5 | 2 | [OpenCut — CapCut Test](content/reels/D05R2.md) | Test | 55s |
| 6 | 1 | [AppFlowy — Discovery](content/reels/D06R1.md) | Discovery | 35s |
| 6 | 2 | [AppFlowy — Notion Test](content/reels/D06R2.md) | Test | 55s |
| 7 | 1 | [Butterfly — Discovery](content/reels/D07R1.md) | Discovery | 35s |
| 7 | 2 | [Butterfly — Goodnotes Test](content/reels/D07R2.md) | Test | 50s |

## Preview and render
From this folder:

- npm start — Studio on port 3023. ChannelPreview is the motion study; D01R1 through D07R2 are draft compositions.
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
