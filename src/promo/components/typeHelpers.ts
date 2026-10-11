import { C } from '../theme'

export { C }

/** Clamp 0..1 (or a custom range) */
export const cap = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Smoothstep easing (no overshoot) for camera and reveal excursions. */
export const smooth = (t: number) => {
  const x = cap(t)
  return x * x * (3 - 2 * x)
}

/** Mirror of smooth: 1 → 0 ramp (ease-out to rest). */
export const settle = (t: number) => {
  const x = cap(t)
  return 1 - smooth(x)
}

/** Two-phase mirror: rises to 1 at 0.5 then eases back to 0. */
export const bump = (t: number) => {
  const x = cap(t)
  return x < 0.5 ? smooth(x * 2) : 1 - smooth((x - 0.5) * 2)
}

/** Cubic ease-out that returns 0 until tStart, then rises to 1 over `rise` units. */
export const pop = (t: number, tStart: number, rise = 4) => {
  if (t <= tStart) return 0
  const x = cap((t - tStart) / rise, 0, 1)
  return 1 - Math.pow(1 - x, 3)
}

/** Deterministic pseudo-random in [0,1) from an integer seed (stable across renders). */
export const seeded = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export type Vec = { x: number; y: number }

/**
 * Deterministic starfield generator shared by intro/outro scenes.
 * Coordinates are normalized 0..1 so scenes work on any canvas size.
 */
export const makeStars = (count: number, seed = 7) =>
  Array.from({ length: count }, (_, i) => ({
    x: seeded(i * 3 + seed),
    y: seeded(i * 3 + seed + 1),
    r: 0.6 + seeded(i * 3 + seed + 2) * 1.7,
    tw: seeded(i + 91) * Math.PI * 2,
  }))
