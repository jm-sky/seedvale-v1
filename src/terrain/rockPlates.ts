/**
 * Bare-rock patches (plan world-terrain-060 R3 correction 7, author answer (A) 2026-11-06): irregular angular planes that
 * emerge from the surrounding soil/moss/snow mix on crag tops, summit zones and high ridges. Terrain-integrated — a jittered
 * Voronoi grid of ~9 m plates; a plate is "rock" by a per-cell hash (denser inside the zone), and a rock plate gets its own
 * tilted plane (sharp edges against neighbours, amplitude ≤ {@link PLATE_MAX_DELTA_M}) plus a rock-colour weight that joins
 * the *reported* `mountainRidge` (grass thins, trees rejected, `applyMountainRock` colours it). Pure function of world
 * coordinates → identical across chunk borders. Adjacent rock plates merge into patches ≥ 10 × 10 m.
 *
 * Cost: callers gate on the zone weight (> 0 only on crags / summit zones / high ridge); inside, one 3 × 3 Voronoi scan.
 *
 * @domain world-terrain
 */

/** Plate cell size (m): neighbouring rock cells form patches ≥ 10 m across. */
export const PLATE_CELL_M = 9
/** Largest plate height offset from the surrounding ground (m); author: ≤ ~0.8 m. */
export const PLATE_MAX_DELTA_M = 0.8
/** Maximum plane slope (m per m) of a plate. */
const PLATE_MAX_SLOPE = 0.16
/** Probability that a plate is rock at zone weight 1 / at the zone threshold. */
const ROCK_PROB_FULL = 0.85
const ROCK_PROB_EDGE = 0.2
/** Zone weight below this → no plates at all. */
const ZONE_MIN = 0.05
const SALT = 0x5bd1e995

function hash2(ix: number, iz: number, seed: number, k: number): number {
  let h = (Math.imul(ix, 0x27d4eb2d) ^ Math.imul(iz, 0x165667b1) ^ Math.imul(seed ^ k, 0x9e3779b1)) >>> 0
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function smooth01(a: number, b: number, v: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export type RockPlate = {
  /** Height offset (m) to add to the floor. */
  delta: number
  /** 0..1 rock-colour / exposure weight. */
  patch: number
}

const NONE: RockPlate = { delta: 0, patch: 0 }

/**
 * Plate at `(x, z)` for a rock-zone weight `zone` (0..1). Returns a shared zero object when outside the zone — do not mutate.
 * `seed` = world seed (determinism, per-world patterns).
 */
export function rockPlateAt(seed: number, x: number, z: number, zone: number): RockPlate {
  if (zone < ZONE_MIN) return NONE
  const gx = Math.floor(x / PLATE_CELL_M)
  const gz = Math.floor(z / PLATE_CELL_M)
  let best = Infinity
  let bx = 0
  let bz = 0
  let bix = 0
  let biz = 0
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const ix = gx + i
      const iz = gz + j
      const sx = (ix + 0.15 + hash2(ix, iz, seed, SALT) * 0.7) * PLATE_CELL_M
      const sz = (iz + 0.15 + hash2(ix, iz, seed, SALT + 1) * 0.7) * PLATE_CELL_M
      const d = (x - sx) ** 2 + (z - sz) ** 2
      if (d < best) {
        best = d
        bx = sx
        bz = sz
        bix = ix
        biz = iz
      }
    }
  }
  const prob = ROCK_PROB_EDGE + (ROCK_PROB_FULL - ROCK_PROB_EDGE) * zone
  if (hash2(bix, biz, seed, SALT + 2) >= prob) return NONE
  const slopeX = (hash2(bix, biz, seed, SALT + 3) * 2 - 1) * PLATE_MAX_SLOPE
  const slopeZ = (hash2(bix, biz, seed, SALT + 4) * 2 - 1) * PLATE_MAX_SLOPE
  const raw = slopeX * (x - bx) + slopeZ * (z - bz)
  const delta = Math.max(-PLATE_MAX_DELTA_M, Math.min(PLATE_MAX_DELTA_M, raw)) * smooth01(ZONE_MIN, 0.4, zone)
  return { delta, patch: smooth01(0.1, 0.4, zone) }
}
