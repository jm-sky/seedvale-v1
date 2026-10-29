/**
 * Isolated reference import from SeedVale V3 (V2-derived cave system).
 * Source: src/game/world/grid.ts
 * Source revision: 47733d6ba0fe96d4607be22c470c7331c76c2c5c
 * Extracted idx, sampleGrid and nearestCell only; algorithms unchanged.
 * Inactive: do not import from production code. See README.md.
 */
import type { WorldWindow } from './caveTypes'

export const idx = (i: number, j: number, n: number) => j * n + i

/**
 * Bilinear sample of a float grid at world position (clamped to the window). Unlike v2 (which clamps to n - 1.001),
 * the last vertex is sampled exactly: the cell index is capped at n - 2 and the fraction may reach 1.
 */
export function sampleGrid(g: Float32Array, w: WorldWindow, x: number, z: number): number {
  const fx = Math.min(Math.max((x - w.x0) / w.cellM, 0), w.n - 1)
  const fz = Math.min(Math.max((z - w.z0) / w.cellM, 0), w.n - 1)
  const i = Math.min(Math.floor(fx), w.n - 2)
  const j = Math.min(Math.floor(fz), w.n - 2)
  const tx = fx - i
  const tz = fz - j
  const a = g[j * w.n + i]!
  const b = g[j * w.n + i + 1]!
  const c = g[(j + 1) * w.n + i]!
  const d = g[(j + 1) * w.n + i + 1]!
  return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz
}

/** Nearest vertex (cell index pair) of a window, clamped to its bounds. */
export function nearestCell(w: WorldWindow, x: number, z: number): [number, number] {
  return [
    Math.min(w.n - 1, Math.max(0, Math.round((x - w.x0) / w.cellM))),
    Math.min(w.n - 1, Math.max(0, Math.round((z - w.z0) / w.cellM))),
  ]
}
