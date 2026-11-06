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
/** Facet cell size (m): the plate surface is broken into small tilted facets so it reads as rough, fractured rock. */
export const FACET_CELL_M = 2.6
/** Largest plate height offset from the surrounding ground (m); author: ≤ ~0.8 m (plane) + facets. */
export const PLATE_MAX_DELTA_M = 0.8
const PLANE_MAX_DELTA_M = 0.6
const FACET_MAX_SLOPE = 0.22
const FACET_MAX_DELTA_M = 0.2
/** Maximum plane slope (m per m) of a plate. */
const PLATE_MAX_SLOPE = 0.16
/** Probability that a plate is rock at zone weight 1 / at the zone threshold. */
const ROCK_PROB_FULL = 0.7
const ROCK_PROB_EDGE = 0.12
/** Coarse clusters (m): only about {@link CLUSTER_KEEP} of them hold plates, so the patches have gaps between them. */
const CLUSTER_CELL_M = 40
const CLUSTER_KEEP = 0.6
/** Height fades to 0 over this distance (m) from a plate edge; colour over {@link COLOR_BLEND_M}. */
const EDGE_BLEND_M = 2.8
const COLOR_BLEND_M = 5
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

/**
 * Rock-zone weight from the *reported* `mountainRidge`: plates exist only where the ground is already bare grey/white rock
 * (author 2026-11-06: not on green mountainsides). Used identically by the height sampler and the vertex-colour pass.
 */
export function rockPlateZoneOf(ridge: number): number {
  return smooth01(0.8, 0.95, ridge)
}

export type RockPlate = {
  /** Height offset (m) to add to the floor. */
  delta: number
  /** 0..1 rock-colour / exposure weight. */
  patch: number
  /** 0..1 per-plate / per-facet brightness variation for the colour pass. */
  tone: number
}

const NONE: RockPlate = { delta: 0, patch: 0, tone: 0.5 }

/**
 * Plate at `(x, z)` for a rock-zone weight `zone` (0..1). Returns a shared zero object when outside the zone — do not mutate.
 * `seed` = world seed (determinism, per-world patterns).
 */
export function rockPlateAt(seed: number, x0: number, z0: number, zone: number): RockPlate {
  if (zone < ZONE_MIN) return NONE
  // Wobbly plate borders (cheap domain warp): no long straight edges.
  const x = x0 + 2.6 * Math.sin(z0 * 0.29 + seed * 0.013) + 1.1 * Math.sin(z0 * 0.83 + x0 * 0.21)
  const z = z0 + 2.6 * Math.sin(x0 * 0.31 + seed * 0.017) + 1.1 * Math.sin(x0 * 0.79 + z0 * 0.23)
  const gx = Math.floor(x / PLATE_CELL_M)
  const gz = Math.floor(z / PLATE_CELL_M)
  let best = Infinity
  let second = Infinity
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
        second = best
        best = d
        bx = sx
        bz = sz
        bix = ix
        biz = iz
      } else if (d < second) second = d
    }
  }
  const edgeDist = (Math.sqrt(second) - Math.sqrt(best)) * 0.5
  const prob = ROCK_PROB_EDGE + (ROCK_PROB_FULL - ROCK_PROB_EDGE) * zone
  if (hash2(bix, biz, seed, SALT + 2) >= prob) return NONE
  if (hash2(Math.floor(bx / CLUSTER_CELL_M), Math.floor(bz / CLUSTER_CELL_M), seed, SALT + 20) >= CLUSTER_KEEP) return NONE
  const slopeX = (hash2(bix, biz, seed, SALT + 3) * 2 - 1) * PLATE_MAX_SLOPE
  const slopeZ = (hash2(bix, biz, seed, SALT + 4) * 2 - 1) * PLATE_MAX_SLOPE
  const plane = Math.max(-PLANE_MAX_DELTA_M, Math.min(PLANE_MAX_DELTA_M, slopeX * (x - bx) + slopeZ * (z - bz)))

  // Facets: second, finer Voronoi layer on top of the plane (rough, fractured surface).
  const fx = Math.floor(x / FACET_CELL_M)
  const fz = Math.floor(z / FACET_CELL_M)
  let fbest = Infinity
  let fsx = 0
  let fsz = 0
  let fix = 0
  let fiz = 0
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const ix = fx + i
      const iz = fz + j
      const sx = (ix + 0.1 + hash2(ix, iz, seed, SALT + 10) * 0.8) * FACET_CELL_M
      const sz = (iz + 0.1 + hash2(ix, iz, seed, SALT + 11) * 0.8) * FACET_CELL_M
      const d = (x - sx) ** 2 + (z - sz) ** 2
      if (d < fbest) {
        fbest = d
        fsx = sx
        fsz = sz
        fix = ix
        fiz = iz
      }
    }
  }
  const facet = Math.max(
    -FACET_MAX_DELTA_M,
    Math.min(
      FACET_MAX_DELTA_M,
      (hash2(fix, fiz, seed, SALT + 12) * 2 - 1) * FACET_MAX_SLOPE * (x - fsx) + (hash2(fix, fiz, seed, SALT + 13) * 2 - 1) * FACET_MAX_SLOPE * (z - fsz),
    ),
  )
  const delta = (plane + facet) * smooth01(ZONE_MIN, 0.4, zone) * smooth01(0, EDGE_BLEND_M, edgeDist)
  const tone = hash2(bix, biz, seed, SALT + 5) * 0.6 + hash2(fix, fiz, seed, SALT + 14) * 0.4
  return { delta, patch: smooth01(0.1, 0.4, zone) * smooth01(0, COLOR_BLEND_M, edgeDist), tone }
}
