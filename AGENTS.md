# Remotion Insta Studio — agent instructions

Read `studio-kit/PRODUCTION_RULES.md` before producing or editing Reels. Each channel has its own palette and visual identity. Do not change them globally.

## Optional editorial-motion style
- The light Editorial Motion style is **one explicitly selected template**, not the studio's default. Remotion renders every Reel but must not trigger pastel colours automatically.
- For the full contract, read `docs/EDITORIAL-MOTION.md` and `studio-kit/editorial-motion.manifest.json`.
- Use only five thematic swatches within selected editorial graphics: ivory `#F2EFE7`, white `#FFFEFA`, mint `#DEF4EA`, peach `#FAE7D7`, lilac `#EDE6FE`. Functional greys for text/borders/shadows are allowed. No black/dark product cards and no yellow highlights in this selected template.
- Select per-scene only via `editorial.template: "editorial-motion"`. Mode must be `illustrated-explainer`, `saas-ui` or `product-comparison`. Do not rewrite pre-existing scene JSON to use it.
- Upper layout reserves the top 1160 pixels for animated visuals; if using a lower presenter video, keep that video muted and sync its visual time to global Reel timing while retaining the original narration audio.
- The component is `studio-kit/src/EditorialMotion.tsx`; preview composition `EditorialMotionPreview` is registered in the main and channel-specific roots. No external brand logo is automatically included.
- Mock interfaces, cards and product examples are not facts. Use verified sources and valid media rights for evidence; don't invent benchmark results.
- Before calling this production-ready, run root and relevant channel TypeScript checks plus actual Remotion MP4 renders and review the resulting frames. Report unrun tests accurately.

Other templates, channel identities and videos must remain unchanged.
