# TOMORROW.EXE

Stories from the future.

A separate local Remotion project. Its plan is adapted from the [supplied chat](https://chatgpt.com/share/6ac2255e-1c68-83ec-9547-ea75c52a0126); shared instructions incorporate BUILDMode and our local visual/transition decisions.

## Content and scripts
Work and money · Robotics and daily life · Education · Identity and privacy · Transport and cities · Relationships and synthetic media

The developed [Week 1 production book](week-1/README.md) contains seven daily script files, each with two full scripts and shot direction. week-1/remotion-week.json now supplies the 14 compositions. Earlier content/reels/ files remain reference briefs. The directed scripts are ready for asset production and test capture; these are not completed tests or publication-ready videos.

| Day | Reel | Script brief | Format | Estimated length |
| --- | --- | --- | --- | --- |
| 1 | 1 | [AI Gets Your Wallet](content/reels/D01R1.md) | What If | 30s |
| 1 | 2 | [Your AI Went to Work](content/reels/D01R2.md) | Future Story | 48s |
| 2 | 1 | [The Last Password](content/reels/D02R1.md) | What If | 26s |
| 2 | 2 | [The Internet Leaves Your Phone](content/reels/D02R2.md) | Future Story | 46s |
| 3 | 1 | [Robots Cheaper Than Cars](content/reels/D03R1.md) | What If | 30s |
| 3 | 2 | [Rent a Robot](content/reels/D03R2.md) | Future Story | 50s |
| 4 | 1 | [Every Child Gets an AI Teacher](content/reels/D04R1.md) | What If | 32s |
| 4 | 2 | [The Classroom of 2033](content/reels/D04R2.md) | Future Story | 48s |
| 5 | 1 | [Your Thoughts Become Text](content/reels/D05R1.md) | What If | 32s |
| 5 | 2 | [Your Brain Gets a Privacy Policy](content/reels/D05R2.md) | Future Story | 46s |
| 6 | 1 | [What If Nobody Owned Cars?](content/reels/D06R1.md) | What If | 29s |
| 6 | 2 | [The City Without Parking](content/reels/D06R2.md) | Future Story | 44s |
| 7 | 1 | [AI Dates For You](content/reels/D07R1.md) | What If | 30s |
| 7 | 2 | [The Video Call You Can’t Trust](content/reels/D07R2.md) | Future Story | 50s |

## Preview and render
From this folder:

- npm start — Studio on port 3021. ChannelPreview is the motion study; D01R1 through D07R2 are draft compositions.
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
