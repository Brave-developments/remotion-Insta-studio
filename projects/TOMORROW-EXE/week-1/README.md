# TOMORROW.EXE · Week 1 production book

Seven daily script files, two Reels per day: 14 developed scripts and 84 timed scenes. These are directed production packages connected to Remotion. The stories are written; original environment assets and final scene implementation remain. Audio remains deferred by request.

## Daily scripts

- [Day 1](day-01.md): AI Gets Your Wallet + Your AI Went to Work
- [Day 2](day-02.md): The Last Password + The Internet Leaves Your Phone
- [Day 3](day-03.md): Robots Cheaper Than Cars + Rent a Robot
- [Day 4](day-04.md): Every Child Gets an AI Teacher + The Classroom of 2033
- [Day 5](day-05.md): Your Thoughts Become Text + Your Brain Gets a Privacy Policy
- [Day 6](day-06.md): What If Nobody Owned Cars? + The City Without Parking
- [Day 7](day-07.md): AI Dates For You + The Video Call You Can’t Trust

## Director's priorities

1. **D01R2 — Your AI Went to Work:** Your AI joins a meeting, fixes a spreadsheet and drafts replies; HR asks who did the work.
2. **D07R1 — AI Dates For You:** Two agents discuss boundaries before their humans meet.
3. **D05R1 — Your Thoughts Become Text:** Medical BCI communication inspires future thought interfaces and a neural-privacy question.
4. **D03R2 — Rent a Robot:** A humanoid arrives in a van, moves furniture and leaves for its next booking.
5. **D07R2 — The Video Call You Can’t Trust:** A convincing fake call forces a choice between appearance and proof of origin.

Produce one priority Reel to final visual quality before batch-rendering the week. Open with action in the first two seconds; give one idea visual dominance per beat. Aim for roughly 70% objects/environments/real captures and 30% type. Keep text inside X=80–1000, Y=215–1580 and captions above the bottom app controls. Never use a full-screen solid-colour wipe. Preserve the opening object for the ending when possible.

## Build / test list

- **D01R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D01R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D02R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D02R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D03R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D03R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D04R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D04R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D05R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D05R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D06R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D06R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D07R1:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.
- **D07R2:** Produce original story assets, review factual grounding, verify every future claim is conditional or explicitly fictional, then inspect continuity and safe zones. No real-world experiment outcome is claimed.

## Asset batching

- Agents and phones: 1, 2, 3, 13, 14
- Robotics: 5, 6; keep one robot design
- Education: 7, 8; warm daylight
- Neural future: 9, 10; restrained medical imagery
- Future city: 4, 11, 12

Use [asset-manifest.json](asset-manifest.json) as the named shot queue. It specifies every external asset target and its direction; assets are not generated or captured yet. Save originals and derivative crops separately. Source pages support background facts only. Record actual version/plan/date again before publishing.

## Remotion feed

[remotion-week.json](remotion-week.json) is canonical. src/Root.tsx imports it and registers D01R1 through D07R2. The older content/reels briefs remain reference material. Each Reel carries script, hooks, directing treatment, protocol, captions, thumbnail, sound, sources and timed scene instructions. scene.asset is null until a real asset exists; plannedAsset is an assignment, not an existing file. The shared engine makes a labelled animatic, with authored camera moves and transitions; native shot details still require implementation.

Run `npm start` in this project to review. Run `npm run render:reel -- D01R1 --draft` for a silent draft in out/. Production render refuses pending content. After capture: assign assets, fill measured outcome slots, confirm factual review and inspect the final visuals before productionReady=true.

When voice-over arrives, keep that audio unchanged and replace estimated scene/caption timings with measured speech timing. Do not accelerate audio or force every Reel to sixty seconds. No audio track has been added.

## Individual illustrated editions

The original capture/experiment instructions above remain the factual production plan. The new silent illustrated edition implements all fourteen reels with original scene objects and directed transitions. Each day 1, day 1.2 through day 7.2 folder contains its own README, script and editable reel.json. Run npm run render in that folder; the final MP4 and poster are saved under this channel’s out/week-1 with the matching day name. See the workspace WEEK-1-GALLERY.html and WEEK-1-PROJECTS.md.

Asset folders and PNGs are source elements, not automatic backgrounds. Select them only when meaningful to the scene. Local illustrated interfaces do not constitute measured external product or model tests. Audio remains deferred. The shared render runner supports this edition; the earlier productionReady gate applies to the original evidence-based production workflow.
