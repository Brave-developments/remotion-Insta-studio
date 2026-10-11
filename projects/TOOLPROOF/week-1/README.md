# TOOLPROOF · Week 1 production book

Seven daily script files, two Reels per day: 14 developed scripts and 84 timed scenes. These are directed production packages connected to Remotion. The experiment protocols are written; actual runs, captures and results remain. Audio remains deferred by request.

## Daily scripts

- [Day 1](day-01.md): Kando — Discovery + Kando — Start Menu Test
- [Day 2](day-02.md): LocalSend — Discovery + LocalSend — Transfer Test
- [Day 3](day-03.md): Stirling PDF — Discovery + Stirling PDF — Acrobat Test
- [Day 4](day-04.md): Cap — Discovery + Cap — Loom Test
- [Day 5](day-05.md): OpenCut — Discovery + OpenCut — CapCut Test
- [Day 6](day-06.md): AppFlowy — Discovery + AppFlowy — Notion Test
- [Day 7](day-07.md): Butterfly — Discovery + Butterfly — Goodnotes Test

## Director's priorities

1. **D01R1 — Kando — Discovery:** Radial gestures, app/folder launch, shortcuts and multi-action workflow.
2. **D02R1 — LocalSend — Discovery:** Phone-to-desktop and desktop-to-phone without a cloud upload.
3. **D03R1 — Stirling PDF — Discovery:** Merge, split, compress, OCR, redact and reorder in one workspace.
4. **D04R1 — Cap — Discovery:** Recording software and personal-use versus commercial licensing.
5. **D05R1 — OpenCut — Discovery:** Current editor and development status rather than a CapCut-killer claim.

Produce one priority Reel to final visual quality before batch-rendering the week. Open with action in the first two seconds; give one idea visual dominance per beat. Aim for roughly 70% objects/environments/real captures and 30% type. Keep text inside X=80–1000, Y=215–1580 and captions above the bottom app controls. Never use a full-screen solid-colour wipe. Preserve the opening object for the ending when possible.

## Build / test list

- **D01R1:** Install only from the official project after checking supported OS and version. Set up ten actions: browser, editor, calculator, notes, terminal, downloads, project folder, search, screenshot command and a second folder. Replace unavailable commands consistently for both methods before timing. Capture a clean real gesture, settings and dated platform/license source. No claim of speed from a demo.
- **D01R2:** Use the exact ten actions from discovery. Time setup separately. Practice both methods for five minutes. Alternate Start/Kando order across three rounds, same initial desktop state and app cache condition. Start at invocation, stop at usable target. Include correction time for wrong selections. Log task-level durations, round totals, median/range, wrong selections and idle memory snapshots. Recommendation depends on observed benefit and setup cost.
- **D02R1:** Use two available supported devices on the same controlled local network. Record device OS, app versions, discovery permissions and transfer mode. Send one non-sensitive sample both directions, accept on receiver and open it. Capture official platform list separately from tested-device scope. Do not expose device names, private Wi-Fi identifiers or personal file contents.
- **D02R2:** Prepare 100 synthetic photos, a video with documented 1GB decimal byte size and a folder totaling documented 5GB decimal bytes. Reuse identical source bytes for LocalSend and a named cloud provider. Record device/network specs and cloud plan. Time each from send/upload start to destination files usable; cloud includes upload and download. Compare counts and SHA-256 hashes. Run interrupted-Wi-Fi recovery separately on an isolated test network and record resume/restart/error behavior.
- **D03R1:** Use a local desktop or self-hosted setup supported by current Stirling docs. Capture exact version and mode, official license and available features. Use synthetic PDFs only. Demonstrate merge, split and one additional installed operation, then open output independently. Any claim of local processing must be tied to actual chosen setup and relevant docs; hosted service access is not proof of offline privacy.
- **D03R2:** Seven synthetic input sets: editable text PDF, three merge files, high-resolution scan, OCR page with known text, redaction token page, signature form and numbered reorder pages. Run both tools on fresh copies with installed version and plan logged. Measure correct output before elapsed time. OCR compare to known text; compression compare size plus readable image quality; redaction search/copy/extract the synthetic secret token; distinguish drawn from certificate signatures. Record missing/gated features and actual workarounds.
- **D04R1:** Check official Cap pricing/licensing on capture day and record account plan. Prepare a local demo website with small text, scrolling, clicks and cursor movement. Show actual capture and export options on this installation. Distinguish personal and commercial licensing using dated source evidence. Do not copy stale quoted prices or assume all export/share options are on the free tier.
- **D04R2:** Use identical 60-second demo script, viewport, resolution target, microphone, camera state and plan metadata in Cap and Loom. Log settings that cannot match. Time setup, recording-to-usable-export and sharing. Inspect text at 100%, cursor/zoom, edits, caption accuracy if available and output dimensions. Open share link in a fresh viewer session. Report feature gates and dated cost/license evidence; no unconditional free commercial-use recommendation.
- **D05R1:** The current official README states a rewrite and points users to the classic version. Record classic app URL and version/build identifier; keep rewrite preview separate. Use three original short clips, licensed/original music and a title. Capture import, timeline interaction and available export options. Missing operation is a finding, not permission to create a simulated screenshot.
- **D05R2:** Use the classic OpenCut build identified in discovery and a recorded CapCut version/plan. Eight tasks on identical original media: import, trim, split, text, music, one transition, 1080×1920 resize and H.264 export. Specify final 20-second reference edit. Time each task and workarounds, then export and open independently. Check duration, dimensions, audio, title placement and visual defects. Mark unavailable tools and feature gates; no broad production claim beyond this edit.
- **D06R1:** Capture current AppFlowy client version, license, hosted plan and official limits. Create a synthetic five-row workspace. Record actual available table/board/page operations. Identify local and hosted modes separately. Avoid claiming offline use before disconnect test and avoid claiming free cloud has unlimited team/AI/storage access.
- **D06R2:** Build the same five-row project dataset and attachments in AppFlowy and Notion. Attempt table, board, calendar, project page and form; record availability by plan. Disconnect an isolated test device, open/edit/save, reconnect and inspect persistence/conflicts. Export, parse and count rows/properties/attachments independently. Invite a second test account only if available and authorized; otherwise mark team test unperformed. Report offline/export fidelity and actual gaps.
- **D07R1:** Use a supported available device and synthetic three-page PDF. Log OS, stylus/mouse, Butterfly version and platform status. Demonstrate import, writing, highlighting, moving a note and export if supported. Inspect exported PDF independently. Capture official local-first/platform claims and experimental feature labels separately from observed actions.
- **D07R2:** Use the same supported device/stylus where possible for Butterfly and Goodnotes; disclose hardware mismatch or inaccessible app. Annotate identical PDF pages for five minutes per tool using fixed text, highlight, rectangle and moved note. Compare readability, object handling, organization, subjective responsiveness and export position. Check sync only with available test devices/accounts; otherwise mark untested. Do not invent latency numbers or universal replacement claims.

## Asset batching

- Desktop utilities: Kando + LocalSend
- Documents/notes: Stirling PDF + AppFlowy + Butterfly
- Creator tools: Cap + OpenCut
- Record discovery and test evidence together for each tool

Use [asset-manifest.json](asset-manifest.json) as the named shot queue. It specifies every external asset target and its direction; assets are not generated or captured yet. Save originals and derivative crops separately. Source pages support background facts only. Record actual version/plan/date again before publishing.

## Remotion feed

[remotion-week.json](remotion-week.json) is canonical. src/Root.tsx imports it and registers D01R1 through D07R2. The older content/reels briefs remain reference material. Each Reel carries script, hooks, directing treatment, protocol, captions, thumbnail, sound, sources and timed scene instructions. scene.asset is null until a real asset exists; plannedAsset is an assignment, not an existing file. The shared engine makes a labelled animatic, with authored camera moves and transitions; native shot details still require implementation.

Run `npm start` in this project to review. Run `npm run render:reel -- D01R1 --draft` for a silent draft in out/. Production render refuses pending content. After capture: assign assets, fill measured outcome slots, confirm factual review and inspect the final visuals before productionReady=true.

When voice-over arrives, keep that audio unchanged and replace estimated scene/caption timings with measured speech timing. Do not accelerate audio or force every Reel to sixty seconds. No audio track has been added.

## Individual illustrated editions

The original capture/experiment instructions above remain the factual production plan. The new silent illustrated edition implements all fourteen reels with original scene objects and directed transitions. Each day 1, day 1.2 through day 7.2 folder contains its own README, script and editable reel.json. Run npm run render in that folder; the final MP4 and poster are saved under this channel’s out/week-1 with the matching day name. See the workspace WEEK-1-GALLERY.html and WEEK-1-PROJECTS.md.

Asset folders and PNGs are source elements, not automatic backgrounds. Select them only when meaningful to the scene. Local illustrated interfaces do not constitute measured external product or model tests. Audio remains deferred. The shared render runner supports this edition; the earlier productionReady gate applies to the original evidence-based production workflow.
