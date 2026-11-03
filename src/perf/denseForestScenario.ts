/**
 * Anchor search for the `dense-forest` benchmark scenario (queue Q2, tree LOD
 * recon §6). The older `forest` scenario takes the single highest
 * `forestFactor` sample within 384 m of home, which on the canonical fixture
 * lands on forest edge (~176 vegetation instances, grass-bound). This search
 * scores a candidate by the **mean** forest factor over a window about the
 * size of the near load ring, so the anchor sits inside a large forest
 * rather than next to one, and it looks farther out.
 *
 * Pure and deterministic: candidates and sample order are fixed, ties keep
 * the earlier candidate. The probe reads world-generation fields, so it works
 * before any chunk around the candidate is loaded.
 *
 * @domain tools
 */

export type DenseForestProbe = {
  sampleForestFactor: (x: number, z: number) => number
  sampleHeight: (x: number, z: number) => number
  /** Placement land view (lakes read as `waterLevel`, plan 058 L1); falls back to `sampleHeight`. */
  sampleLandHeight?: (x: number, z: number) => number
  waterLevel: number
}

export type DenseForestAnchor = { x: number; z: number; score: number }

/** Ring step and outer radius of the candidate search (m). */
export const DENSE_FOREST_RING_STEP = 64
export const DENSE_FOREST_MAX_RADIUS = 1536
const DENSE_FOREST_ANGLES = 16
/** Scoring window: (2·HALF+1)² samples spaced `SAMPLE_STEP` apart, i.e.
 *  ±96 m around the candidate (roughly the 3×3 chunks nearest the camera). */
const WINDOW_HALF = 2
const WINDOW_SAMPLE_STEP = 48
/** Candidate centre must be this far above `waterLevel` (m), so the player
 *  is not placed in a lake or on a shoreline. */
const DRY_MARGIN = 1

/** Mean forest factor over the scoring window centred on (x, z). */
export function forestWindowScore(probe: DenseForestProbe, x: number, z: number): number {
  let sum = 0
  let n = 0
  for (let dz = -WINDOW_HALF; dz <= WINDOW_HALF; dz++) {
    for (let dx = -WINDOW_HALF; dx <= WINDOW_HALF; dx++) {
      sum += probe.sampleForestFactor(x + dx * WINDOW_SAMPLE_STEP, z + dz * WINDOW_SAMPLE_STEP)
      n++
    }
  }
  return sum / n
}

/** Best dry candidate by window score on rings around the origin; the origin
 *  itself is the fallback when no dry candidate exists. */
export function seekDenseForest(probe: DenseForestProbe, originX: number, originZ: number): DenseForestAnchor {
  let best: DenseForestAnchor = { x: originX, z: originZ, score: forestWindowScore(probe, originX, originZ) }
  for (let r = DENSE_FOREST_RING_STEP; r <= DENSE_FOREST_MAX_RADIUS; r += DENSE_FOREST_RING_STEP) {
    for (let a = 0; a < DENSE_FOREST_ANGLES; a++) {
      const angle = (a / DENSE_FOREST_ANGLES) * Math.PI * 2
      const x = originX + Math.cos(angle) * r
      const z = originZ + Math.sin(angle) * r
      if ((probe.sampleLandHeight ?? probe.sampleHeight)(x, z) < probe.waterLevel + DRY_MARGIN) continue
      const score = forestWindowScore(probe, x, z)
      if (score > best.score) best = { x, z, score }
    }
  }
  return best
}
