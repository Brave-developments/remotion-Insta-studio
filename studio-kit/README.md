# Shared Remotion studio kit

Reusable engine, motion primitives, original SVG objects, rendering helpers and production rules for three sibling channels. Existing parent node_modules supplies the current runtime; every channel declares pinned dependencies for a separate install if desired. Keep this folder beside all three channel projects.

The earlier remotion-ai-agent-reel is preserved. Its production lessons are included in PRODUCTION_RULES.md.

## Optional Editorial Motion template

[Editorial Motion](../docs/EDITORIAL-MOTION.md) is one opt-in three-mode pastel visual template. Five colours only: ivory, white, mint, peach and lilac. It is implemented in [src/EditorialMotion.tsx](src/EditorialMotion.tsx) with [palette tokens](src/editorialPalette.ts), and the optional `EditorialMotionPreview` composition is available in every Studio entry point. Existing channel palettes and all current Reel scenes remain unchanged unless a scene explicitly selects `editorial.template: "editorial-motion"`.
