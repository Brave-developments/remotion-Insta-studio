# FiveM Resource Hub — Promo Storyboard

Compositions in [Root.tsx](../src/Root.tsx), shared scene library in [src/promo/](../src/promo/).
All deliverables render from **one scene library** (`src/promo/`) — not four separate videos.

## Deliverables

| Composition | Size | Duration | Purpose |
|---|---|---|---|
| `ResourceHubPromo` | 1920×1080 @30 | 1,770 f / **59s** | Master brand video (website + YouTube) |
| `ResourceHubPromo30` | 1920×1080 @30 | 900 f / **30s** | Discord/ad cut (discovery-first, ends on galaxy) |
| `ResourceHubReel` | 1080×1920 @30 | 1,770 f / **59s** | Reels/TikTok version via 9:16 camera tracks |

> The master runs **59s (1,770 frames)** — retimed from the original 66s plan
> against the real 55.15s voice-over recording (Whisper word alignment, see
> [PROMO-VOICE.md](PROMO-VOICE.md)); every scene start is anchored to the first
> word of the line it serves, and the last ~4s give the ending room to breathe.

## Master timeline (1,770 frames @ 30fps)

| # | Time | Scene component | On-screen text | Voice |
|---|---|---|---|---|
| 1 | 0.0–4.0s | [01-Hook](../src/promo/scenes/01-Hook.tsx) | STILL HUNTING FOR FIVEM RESOURCES? | "FiveM resources are everywhere… full-time job." |
| 2 | 4.0–8.5s | [02-GalaxyReveal](../src/promo/scenes/02-GalaxyReveal.tsx) | FIVEM RESOURCE HUB | "Meet FiveM Resource Hub." |
| 3 | 8.5–13.7s | [03-Categories](../src/promo/scenes/03-Categories.tsx) | SCRIPTS · MLOs · VEHICLES · MAPS · UI | "One place to discover free scripts, MLOs, vehicles, maps, UI packs, and more." |
| 4 | 13.7–17.2s | [04-Search](../src/promo/scenes/04-Search.tsx) | Search exactly what you need. | "Search exactly what you need, browse what's trending, or jump straight into the latest releases." |
| 5 | 17.2–19.8s | [05-Trending](../src/promo/scenes/05-Trending.tsx) | TRENDING NOW → LATEST RELEASES | (continuation of line 4) |
| 6 | 19.8–25.4s | [06-ResourceDetails](../src/promo/scenes/06-ResourceDetails.tsx) | Original releases. Official destinations. | "Every listing is built around the original resource…" |
| 7 | 25.4–31.8s | [07-Directories](../src/promo/scenes/07-Directories.tsx) | Less hunting. More building. | "So you spend less time hunting and more time building." |
| 8 | 31.8–42.4s | [07-Directories](../src/promo/scenes/07-Directories.tsx) | GET SEEN BY MORE PLAYERS · PROMOTE YOUR SERVER · STREAM · GIVEAWAY · BRAND · MORE VISIBILITY. MORE REACH. | "Want more eyes… front of the right audience." |
| 9 | 42.4–47.0s | [08-Submit](../src/promo/scenes/08-Submit.tsx) | Built something? Share it. | "And if you've built a resource worth sharing, submit it directly for review." |
| 10 | 47.0–59.0s | [09-Outro](../src/promo/scenes/09-Outro.tsx) | ONE HUB. MORE DISCOVERY. MORE VISIBILITY. LESS SEARCHING. | "One hub. More discovery. More visibility. Less searching." + "FiveM Resource Hub. Find it. Build it. Get seen." |

### Camera notes
- Hook: slow push-in on scattered cards + code fragments.
- Categories: lateral orbit with per-category rotating word cards.
- Search: 1.35× zoom pivoting on the hero search bar, pullback as results land ([04-Search.tsx](../src/promo/scenes/04-Search.tsx)).
- Directories: featured card pushes forward ~5% with an impressions/metrics rail.
- Outro: UI collapses into the galaxy (falling → pull-in), core flare, logo lockup.

## Music and sound design plan

Processing notes: light compression, light EQ, no reverb; voice sits clearly above the music.
| Time | Sound |
|---|---|
| 0.0–4.0 | Low atmospheric pulse |
| ~4.0 | Impact hit as galaxy forms ([Flash] overlay marks the hit) |
| 8.5+ | Subtle beat under categories orbit |
| 14–32 | Soft digital clicks/whooshes with results + scrolls |
| 42–47 | Percussion strips away as UI collapses |
| ~51 | Clean bass hit + subtle shimmer on final logo lockup (logo lands just before the last line) |

The voice must sit clearly above the music (sidechain duck −6 dB under VO).

## 30-second cut (`ResourceHubPromo30`, 900 frames)

Discovery-first: Hook (0–2s) → Galaxy (2–3.8s) → Categories (3.8–6.8s) → Search (6.8–11.8s) → Trending (11.8–15.8s) → Details (15.8–19.8s) → Montage (19.8–20.8s) → Promote (20.8–23.5s) → Submit (23.5–25.5s) → Galaxy outro (25.5–30s). Exact frame beats in [config.ts](../src/promo/config.ts) (`SCENES_30`); scenes pace off their own Sequence length, so they compress correctly on this map.

## Render commands

```bash
npm run render ResourceHubPromo out/resource-hub-master.mp4
npm run render ResourceHubPromo30 out/resource-hub-30s.mp4
npm run render ResourceHubReel out/resource-hub-reel.mp4
```
