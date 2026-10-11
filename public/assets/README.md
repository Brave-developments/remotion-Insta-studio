# public/assets

Drop real assets here and register them in [`src/video/assets.ts`](../../src/video/assets.ts).

This directory ships empty: the reel draws every visual it needs with React,
CSS and SVG, so nothing is missing and no file is invented. Once a file is
registered, the matching component prefers it over its SVG fallback
automatically.

| Kind         | Example path               | Used by                          |
| ------------ | -------------------------- | -------------------------------- |
| `logo`       | `assets/logo.png`          | app window chrome, outro         |
| `image`      | `assets/screenshot.png`    | browser + app window scenes      |
| `video`      | `assets/clip.mp4`          | full-bleed B-roll scenes         |
| `icon`       | `assets/icon.svg`          | feature list + diagram nodes     |
| `background` | `assets/backdrop.png`      | persistent backdrop              |
| `audio`      | `assets/narration.mp3`     | `<Audio>` in the main composition |

## Registering

```ts
// src/video/assets.ts
const REGISTRY: Record<string, AssetEntry> = {
  narration: {path: 'assets/narration.mp3', kind: 'audio'},
};
```

## Fonts

Fonts live in [`public/fonts`](../fonts) and are loaded through
`@remotion/fonts` in [`src/video/fonts.ts`](../../src/video/fonts.ts). Inter is
bundled locally so renders never depend on network access.
