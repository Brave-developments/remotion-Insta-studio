# Paper Reel Studio — real-image vertical video generator

A NEW, opt-in 1080 × 1920, 30 FPS Remotion composition named **PaperReel**. It does not replace the existing dark Reel, channel templates, or FiveM promotional scenes.

## Visual system

Warm paper (#F5F0E6), near-white photo borders (#FFFDF8), editorial serif headlines, thin ink rules, procedural fibre texture, restrained sage/blush details. Five layouts: **photo, collage, browser, metric, quote**. Images are downloaded before rendering, not requested remotely during each frame.

The paper-specific src/paper/motion/KitWidgets.tsx adapts the animated BrowserReveal and MetricReveal patterns from https://github.com/Brave-developments/remotion-motion-kit, restyled to fit this template. The stock kit components have dark-blue cards and cannot be used directly without violating this art direction. The original repository is not modified.

## Getting started

Requires Node 22+, a functioning local Remotion browser, internet access for photo preparation, and npm dependencies installed.

1. Run npm install in the remotion-Insta-studio root.
2. Edit content/paper/example.json with narration-aligned scenes, duration, headline, layout and specific real-photo search terms.
3. Optional: provide PEXELS_API_KEY as an environment variable to search Pexels photographs. If unset, the script searches Wikimedia Commons for raster images labelled with reusable licences.
4. Run npm run paper:prepare. The images are saved under public/paper/assets/ and the generated project becomes content/paper/generated.json.
5. Open npm run studio and select PaperReel. Review the photo relevance, crop, on-screen source and motion.
6. Render with npm run render:paper, which prepares the images first, then exports out/paper-reel.mp4.

At checkout, the committed generated.json intentionally contains no photographs and renders a setup notice. It is NOT a finished Reels export until images have actually downloaded.

Commands:

    npm run paper:prepare
    npm run paper:test
    npm run typecheck
    npm run studio
    npm run render:paper

Custom brief:

    node scripts/paper-media.mjs --brief content/paper/your-film.json

## Flashcut AI: real media in both directions

The Flashcut AI library lives at https://github.com/Brave-developments/flashcut-ai. It stores imported genuine media under public/media and a searchable index in public/media/index.json.

To use existing Flashcut photography, place flashcutAssetId in the PaperReel scene instead of photoQuery. Collages can use flashcutAssetId2 for a second photograph.

    node scripts/paper-media.mjs --brief content/paper/your-film.json --flashcut-dir ../flashcut-ai

For sending sourced PaperReel imagery back to the Flashcut library:

    node scripts/paper-media.mjs --export-flashcut-dir ../flashcut-ai

This copies real images under Flashcut's public/media/paper directory and puts paper-credits.json beside them. Use the Flashcut app's **Sync Library** action or POST /api/assets/sync to index those files. The existing indexer does not automatically map the sidecar into every photo's rights field, so keep the source log and review it separately.

### Scene brief format

Each scene needs an id (unique lowercase slug), layout, headline and integer seconds (3–18). The photo, browser and collage layouts need a photoQuery or flashcutAssetId. Collage requires a second query or asset ID. Optional body, label and address let you tailor the scene. Metric scenes must include a real numerical value, attribution and sourceUrl. Quote scenes require a body, attribution and sourceUrl. Example: content/paper/example.json.

The preparation step outputs:
- content/paper/generated.json — timeline / local image paths
- content/paper/credits.json — provider, original link, artist, detected licence, rights review status
- public/paper/assets — local downloaded source images (gitignored to avoid huge image commits)

**Source and image limitations:** Photographs found by a search are NOT automatically evidence of the narration. Confirm the actual subject depicted, license attribution terms and any third-party personality/property rights. The Commons licence filter is intentionally conservative and will refuse unknown/restricted terms. Pexels images are subject to the Pexels License restrictions. The generated credits mark all downloads rightsStatus: review-required. Never claim verified reuse rights just because the source was indexed.

## Instructions for AI coding/video agents

Read AGENTS.md and this document first. PaperReel is an opt-in style, not a global default for TOMORROW.EXE, TOOLPROOF, BUILDMode AI or FiveM material. Do not rewrite those channel templates.

Use real photographs from the preparation script or existing Flashcut assets; do NOT invent snapshots, benchmark results or news quotes. For an actual website screenshot, use Flashcut's existing headless Chrome capture and import it with flashcutAssetId; the browser frame here is a motion presentation of a real asset, not a simulated website. Prefer original artwork where the claim cannot be sourced. Keep the safe margins and readable attribution.

Run paper:test, typecheck, export MP4 and inspect actual rendered frames before shipping. GitHub code uploads alone do not prove that a local browser render, external photo lookup, or MP4 QA succeeded.
