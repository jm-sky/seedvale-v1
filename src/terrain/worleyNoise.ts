import { smin } from '../world/caves/caveMath'

export type WorleyRidgeResult = {
  /** Distance to the nearest feature point. */
  f1: number
  /** Distance to the second-nearest feature point. */
  f2: number
  /** 1 near a Voronoi cell boundary (equidistant from two feature points), 0 deep
   *  inside a cell. Boundaries form a connected line network across the whole
   *  plane — this is what produces connected mountain ridges/ranges rather than
   *  isolated cone-shaped peaks (which a plain "distance to nearest point" field
   *  would give). */
  ridge01: number
}

/** Deterministic per-cell hash → [0,1), no allocation, safe to call thousands of
 *  times per texel without RNG-object overhead. Integer mix (Wang-style). */
function hash01(ix: number, iz: number, salt: number): number {
  let h = (ix * 374761393 + iz * 668265263 + salt * 2246822519) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  h = h ^ (h >>> 16)
  return (h >>> 0) / 4294967296
}

/** Per-cell feature-point jitter, within [0,1) of the cell — keeps the point
 *  inside its own cell (standard jittered-grid Worley), just not at the corner. */
function cellJitter(ix: number, iz: number, seed: number): [number, number] {
  return [hash01(ix, iz, seed ^ 0x1a2b3c4d), hash01(ix, iz, seed ^ 0x5e6f7089)]
}

/** Smooth-min width (m) between the 2nd and 3rd nearest distances (see the C¹ note in `worleyRidge`). */
const WORLEY_F2_SOFTMIN_M = 20
/** Width (m) of the band next to the ridge line where the F2 − F1 gap is rounded, so the crest is C¹. */
const WORLEY_CREST_ROUND_M = 40
/** Softness of the 0-floor of `ridge01` (softplus instead of a hard clamp). */
const WORLEY_FLOOR_SOFTNESS = 0.04

/**
 * C¹ rounding of a non-negative distance-like value at 0 (plan world-terrain-065): `g²(2a − g)/a²` below `a` (value and
 * slope 0 at 0, value `a` and slope 1 at `a`), identity from `a` on. A ridge/crest profile driven by `|d|` gets a
 * rounded top instead of a crease, and nothing farther than `a` from the crest line changes.
 *
 * @domain world-terrain
 */
export function roundCrease(g: number, a: number): number {
  return g >= a ? g : (g * g * (2 * a - g)) / (a * a)
}

/** `k · ln(1 + e^(v/k))` — a C∞ `max(v, 0)`. */
function softplus(v: number, k: number): number {
  const t = v / k
  // Outside ±10 the curve is within 5e−5·k of its asymptotes (< 0.1 mm of terrain height) — skip exp/log1p.
  if (t > 10) return v
  if (t < -10) return 0
  return k * Math.log1p(Math.exp(t))
}

/**
 * Classic jittered-grid Worley/cellular noise, 3×3 neighbor-cell scan (sufficient
 * for correct F1/F2 given jitter confined to one cell). Pure function of
 * `(x, z, cellSize, seed)` — no per-seed setup/cache needed (unlike simplex),
 * and safe across chunk boundaries by construction (continuous world-space input).
 */
export function worleyRidge(
  x: number,
  z: number,
  cellSize: number,
  seed: number,
  ridgeSharpness = 2,
): WorleyRidgeResult {
  const cx = Math.floor(x / cellSize)
  const cz = Math.floor(z / cellSize)

  let f1 = Infinity
  let f2 = Infinity
  let f3 = Infinity

  for (let dz = -1; dz <= 1; dz++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ix = cx + dx
      const iz = cz + dz
      const [jx, jz] = cellJitter(ix, iz, seed)
      const fx = (ix + jx) * cellSize
      const fz = (iz + jz) * cellSize
      const d = Math.hypot(x - fx, z - fz)
      if (d < f1) {
        f3 = f2
        f2 = f1
        f1 = d
      } else if (d < f2) {
        f3 = f2
        f2 = d
      } else if (d < f3) {
        f3 = d
      }
    }
  }

  // C¹ ridge (plan world-terrain-065). The raw `1 − (F2 − F1)` field creases on every Voronoi edge (the ridge line
  // itself), wherever the 2nd and 3rd nearest points swap, and where the clamp hits 0 — each crease is a sharp
  // lit/shaded facet edge on the mesh. F2 becomes a polynomial smooth min of F2 and F3 (exact wherever F3 − F2 ≥ k,
  // continuous where the nearest point swaps since both candidate pairs then hold equal distances), the gap is rounded
  // at 0 (`roundCrease`) and the lower clamp is a softplus.
  const f2Soft = smin(f2, f3, WORLEY_F2_SOFTMIN_M)
  const gap = Math.max(0, f2Soft - f1)
  const rounded = roundCrease(gap, WORLEY_CREST_ROUND_M)
  const ridge01 = Math.min(1, softplus(1 - (rounded / cellSize) * ridgeSharpness, WORLEY_FLOOR_SOFTNESS))
  return { f1, f2, ridge01 }
}
