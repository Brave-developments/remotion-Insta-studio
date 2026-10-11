# Week 1 · Director's production handoff

Three channel projects, seven daily script files in each, two Reels per file: **21 files / 42 developed scripts / 252 timed scenes**.

- [TOMORROW.EXE production book](projects/TOMORROW-EXE/week-1/README.md): cinematic possible futures, human consequences and clearly separated factual grounding.
- [BUILDMode AI production book](projects/BUILDMode-AI/week-1/README.md): reproducible builds, constraints, recorded first attempts and independently checked results.
- [TOOLPROOF production book](projects/TOOLPROOF/week-1/README.md): real software discovery, matched tests, current terms and specific recommendations.

Each daily file contains the full narration, three hook choices, the selected hook, exact screen copy, six timed shots, camera/transition direction, asset assignments, sound direction, recording protocol, captions, thumbnail and publishing copy. Each project has a machine-readable `week-1/remotion-week.json` already imported by Remotion and a named `asset-manifest.json` production queue.

All 42 individual reel projects are now built. All 42 silent MP4 exports are complete and verified at 1080 × 1920, 30 fps. Actual exported frames cover all 252 scenes and 210 transition checkpoints. Use [WEEK-1-PROJECTS.md](WEEK-1-PROJECTS.md) for individual folders and [WEEK-1-GALLERY.html](WEEK-1-GALLERY.html) to preview available exports. Names are day 1, day 1.2 through day 7, day 7.2 within each channel.

The silent illustrated edition uses original scene-specific React/SVG objects and directed camera moves. TOMORROW.EXE contains speculative stories; BUILDMode AI and TOOLPROOF comparisons show proposed build or test workflows, with presentation copy that does not claim unperformed measurements. Original experiment scripts and unfilled outcome fields remain preserved for later factual production. Six BUILDMode local fixtures have passed functional and browser checks. Audio is intentionally deferred; all timing is estimated.

No full-screen solid-colour transition masks. Preserve object continuity, use eased camera moves and short overlaps, and inspect transition midpoints for overlapping text. Final films render inside their own project `out/` folder.

The authoring files in `scripts/week-one-*.cjs` and generator `scripts/develop-week-one.cjs` produced the original script handoff. Do not rerun the generator or packaging script after directly editing production JSON or individual folders without reconciling those edits: they replace generated files. Each individual folder's reel.json is its editable render source; the channel remotion-week.json retains the original weekly contract. Run npm run render inside an individual folder to render that reel. The shared studio-kit/scripts/render-week.cjs runner supports all channels, a selected channel, or a selected reel.
