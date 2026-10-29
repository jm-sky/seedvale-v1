/**
 * Isolated reference import from SeedVale V3 (V2-derived cave system).
 * Source: src/game/world/gen/caves.ts
 * Source revision: 47733d6ba0fe96d4607be22c470c7331c76c2c5c
 * Copied with local import paths only; algorithms unchanged.
 * Inactive: do not import from production code. See README.md.
 */
/**
 * Ported from SeedVales v2 world/gen/caves.ts (placeCaves, caveIsValid, makeSpine, gradient), adapted to a scene
 * window (D-M1-11): grid helpers from world/grid.ts, no settlements, roads, landmarks, home or bank data, and the
 * sandbox spacing and edge margin. Caves: small and medium caves cut into mountain slopes. Each is a spine of
 * tunnel/chamber points that starts on a slope and runs uphill into the rock. Deterministic for the seed (GEN_VERSION is not mixed into seeds or noise: a bump would reshuffle every world; it is a compatibility number for saves and caches, RF-03);
 * every candidate is validated against the derived geometry (roof cover, length of the open-air cutting, floor never
 * above the surface) before it is accepted.
 * @domain world
 * @subdomain world-gen
 */
import { CAVE, CAVE_MIN_SPACING_M, CONTINENT_CAVE_COUNT, SANDBOX_CAVE_EDGE_MARGIN_M, SANDBOX_CAVE_MIN_SPACING_M, SEA_LEVEL } from '../caveConfig'
import { hashInts, Rng, SALTS } from '../rng'
import { buildCaveGrid, caveAllPoints, caveRoutes, caveTopHeight, CELL_SKY, CELL_UNDER, clearanceFor, spineFloor } from '../caveShape'
import { idx, nearestCell, sampleGrid } from '../grid'
import { Biome, type CaveSize, type GenCave, type GenCaveBranch, type WorldWindow } from '../caveTypes'

/** Fields the placement reads: one scene window (sampled with the window's own cell grid). */
export interface CaveFields {
  window: WorldWindow
  height: Float32Array
  biome: Uint8Array
  waterKind: Uint8Array
}

/** Slope (rise per metre) the entrance needs: steep enough that the rock closes over the tunnel quickly. */
const MIN_SLOPE = 0.4
const MAX_SLOPE = 0.65
/** Sandbox counts, tried in this order (v2 CAVE_COUNTS, one of each size). */
const SANDBOX_SIZES: readonly CaveSize[] = ['large', 'medium', 'small']
/** Candidate tries per cave (v2). */
const MAX_TRIES = 600

export const CAVE_NAMES = [
  'Wolfmaw Cave', 'The Hollow Deep', 'Ravenhole', 'Greywater Grotto', 'Bearclaw Cave', 'The Echoing Mouth',
  'Stonethroat', 'Old Marrow Cave', 'The Cold Cellar', 'Hagstone Cave',
]

/** Uphill direction and slope magnitude of the generated surface at (x, z). */
function gradient(height: Float32Array, w: WorldWindow, x: number, z: number): { dx: number; dz: number; slope: number } {
  const e = 6
  const gx = (sampleGrid(height, w, x + e, z) - sampleGrid(height, w, x - e, z)) / (2 * e)
  const gz = (sampleGrid(height, w, x, z + e) - sampleGrid(height, w, x, z - e)) / (2 * e)
  const slope = Math.sqrt(gx * gx + gz * gz)
  return { dx: gx / (slope || 1), dz: gz / (slope || 1), slope }
}

/** Main route and dead-end side branches of one cave (D-M2-22). Small and medium caves have no branches. */
interface CaveSpine {
  spine: number[]
  branches: GenCaveBranch[]
}

/** Legs (0-based) whose end carries a junction in a large cave: the end of leg 1 and leg 3 of the five. */
const JUNCTION_LEGS = [0, 2] as const

/**
 * Builds one spine: tunnel(s) with a chamber at the end of each leg. Spacing ~6 m, gentle meander. A large cave's main
 * corridor is wider (`mainRadiusScale`, `mainChamberRadius`) and opens dead-end side branches at its junctions; their
 * values come from `branchRng`, so the main route draws are the same with or without branches.
 */
function makeSpine(rng: Rng, branchRng: Rng, x: number, z: number, heading: number, size: CaveSize): CaveSpine {
  const out: number[] = []
  const branches: GenCaveBranch[] = []
  const large = size === 'large'
  const legs =
    size === 'small' ? [rng.range(18, 26)] :
    size === 'medium' ? [rng.range(14, 20), rng.range(12, 18), rng.range(10, 14)] :
    [rng.range(16, 22), rng.range(14, 20), rng.range(14, 18), rng.range(12, 16), rng.range(10, 14)]
  let cx = x
  let cz = z
  let h = heading
  out.push(cx, cz, CAVE.tunnelRadius)
  legs.forEach((len, li) => {
    const steps = Math.max(2, Math.round(len / 6))
    for (let s = 0; s < steps; s++) {
      h += rng.range(-0.22, 0.22)
      cx += Math.sin(h) * (len / steps)
      cz += Math.cos(h) * (len / steps)
      const r = CAVE.tunnelRadius * rng.range(0.9, 1.2)
      out.push(cx, cz, large ? r * rng.range(CAVE.mainRadiusScale[0], CAVE.mainRadiusScale[1]) : r)
    }
    // Chamber: two wide points a few metres apart.
    const cr = large ? rng.range(CAVE.mainChamberRadius[0], CAVE.mainChamberRadius[1]) : rng.range(CAVE.chamberRadius[0], CAVE.chamberRadius[1])
    h += rng.range(-0.5, 0.5) * Math.min(li + 1, 2)
    for (let k = 0; k < 2; k++) {
      cx += Math.sin(h) * 4.5
      cz += Math.cos(h) * 4.5
      out.push(cx, cz, large ? cr : cr * (k ? 0.9 : 1))
    }
    const junction = large && (JUNCTION_LEGS as readonly number[]).includes(li) && branches.length < CAVE.junctionCount
    if (junction) branches.push(makeBranch(branchRng, out.length / 3 - 1, cx, cz, h, branches.length))
  })
  return large ? { spine: out, branches } : { spine: out, branches: [] }
}

/**
 * One dead-end branch at a junction: heading the main heading +- 60..72 degrees (sign alternates per branch), two passage
 * points of the tunnel radius, then `CAVE.branchChambers` side chambers (r 4.5-5.5). Steps of 6-8 m, like the main route.
 */
function makeBranch(rng: Rng, from: number, x: number, z: number, mainHeading: number, n: number): GenCaveBranch {
  const sign = n % 2 === 0 ? 1 : -1
  let h = mainHeading + sign * rng.range(60, 72) * (Math.PI / 180)
  let cx = x
  let cz = z
  const pts: number[] = []
  const parts: number[] = [CAVE.tunnelRadius, CAVE.tunnelRadius]
  for (let c = 0; c < CAVE.branchChambers; c++) parts.push(-1)
  for (const kind of parts) {
    h += rng.range(-0.22, 0.22)
    const step = rng.range(6, 8)
    cx += Math.sin(h) * step
    cz += Math.cos(h) * step
    pts.push(cx, cz, kind < 0 ? rng.range(4.5, 5.5) : kind)
  }
  return { from, pts: pts.map((v) => Math.round(v * 100) / 100) }
}

/**
 * True when the cave is valid for the window's surface: roofed everywhere beyond the cutting, a short cutting, and no
 * floor above the ground. The surface is lowered by `CAVE.surfaceMargin` (runtime micro-detail can dip below the grid).
 * Spine points must keep `SANDBOX_CAVE_EDGE_MARGIN_M` from the window edge.
 */
export function caveIsValid(cave: GenCave, f: CaveFields, edgeMarginM = SANDBOX_CAVE_EDGE_MARGIN_M): boolean {
  const w = f.window
  const lower = (x: number, z: number) => sampleGrid(f.height, w, x, z) - CAVE.surfaceMargin
  const pts = caveAllPoints(cave)
  const m = edgeMarginM
  for (const p of pts) {
    if (p.x < w.x0 + m || p.z < w.z0 + m || p.x > w.x0 + w.sizeM - m || p.z > w.z0 + w.sizeM - m) return false
    if (p.s > CAVE.maxCuttingM && lower(p.x, p.z) - spineFloor(cave.y0, p.s) < clearanceFor(p.r, caveTopHeight(cave)) + CAVE.minCover + 0.6) return false
  }
  // A tunnel must not fold back into itself: non-neighbouring spine points keep their distance.
  const routes = caveRoutes(cave)
  const main = routes[0]!
  for (let i = 0; i < main.length; i++) {
    for (let j = i + 3; j < main.length; j++) {
      if (Math.sqrt((main[i]!.x - main[j]!.x) * (main[i]!.x - main[j]!.x) + (main[i]!.z - main[j]!.z) * (main[i]!.z - main[j]!.z)) < 0.8 * (main[i]!.r + main[j]!.r)) return false
    }
  }
  // Side branches (D-M2-22): a branch point may not fold back onto the main route, except next to its own junction.
  for (let b = 1; b < routes.length; b++) {
    const from = cave.branches![b - 1]!.from
    for (const p of routes[b]!) {
      for (let mi = 0; mi < main.length; mi++) {
        if (Math.abs(mi - from) < 3) continue
        const q = main[mi]!
        if (Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.z - q.z) * (p.z - q.z)) < 0.8 * (p.r + q.r)) return false
      }
    }
  }
  const g = buildCaveGrid(cave, lower)
  if (g.open < 40) return false
  // The first open point on the approach axis must meet the ground within a step (with some slack), so the player can walk in.
  for (let t = 4; t >= 0; t -= 0.25) {
    const bx = cave.x - Math.sin(cave.yaw) * t
    const bz = cave.z - Math.cos(cave.yaw) * t
    if (!g.flagAt(bx, bz)) continue
    if (Math.abs(g.floorAt(bx, bz) - sampleGrid(f.height, w, bx, bz)) > CAVE.stepM * 0.85) return false
    break
  }
  for (let j = 0; j < g.nz; j++) {
    for (let i = 0; i < g.nx; i++) {
      const flag = g.flag[j * g.nx + i]!
      if (!flag) continue
      const x = g.ox + i + 0.5
      const z = g.oz + j + 0.5
      const floor = g.floorAt(x, z)
      // Floor must not rise above the true surface (it would float over the cutting).
      if (floor > sampleGrid(f.height, w, x, z) + 0.5) return false
      // Open sky only near the entrance.
      if (flag === CELL_SKY && Math.sqrt((x - cave.x) * (x - cave.x) + (z - cave.z) * (z - cave.z)) > CAVE.maxCuttingM + 4) return false
    }
  }
  // Roof cover as the runtime grid draws it (raw surface, follows the ground): the vertex-averaged ceiling can rise above a
  // cell's own clearance next to a big chamber (D-M2-22), so the check runs on that grid, not on the validation grid.
  const rt = buildCaveGrid(cave, (x, z) => sampleGrid(f.height, w, x, z), true)
  for (let j = 0; j < rt.nz; j++) {
    for (let i = 0; i < rt.nx; i++) {
      if (rt.flag[j * rt.nx + i] !== CELL_UNDER) continue
      const x = rt.ox + i + 0.5
      const z = rt.oz + j + 0.5
      if (sampleGrid(f.height, w, x, z) - rt.ceilAt(x, z) < CAVE.minCover - 0.05) return false
    }
  }
  return true
}

/** Cave placement knobs: the sandbox scene windows use {@link SANDBOX_CAVE_OPTIONS}; the continent uses its own (M2 S1). */
export interface CavePlaceOptions {
  /** Caves placed, sizes cycling large, medium, small. */
  count: number
  minSpacingM: number
  edgeMarginM: number
}

export const SANDBOX_CAVE_OPTIONS: CavePlaceOptions = { count: 3, minSpacingM: SANDBOX_CAVE_MIN_SPACING_M, edgeMarginM: SANDBOX_CAVE_EDGE_MARGIN_M }

/** Continent caves (M2 S1): {@link CONTINENT_CAVE_COUNT} caves at {@link CAVE_MIN_SPACING_M}; the sandbox edge margin. */
export const CONTINENT_CAVE_OPTIONS: CavePlaceOptions = { count: CONTINENT_CAVE_COUNT, minSpacingM: CAVE_MIN_SPACING_M, edgeMarginM: SANDBOX_CAVE_EDGE_MARGIN_M }

/**
 * Places the caves of one scene window: one large, one medium and one small cave (v2 order), each on a mountain slope
 * of the window, at least `SANDBOX_CAVE_MIN_SPACING_M` from the others. Pure function of (seed, fields).
 */
export function placeCaves(seed: number, f: CaveFields, opts: CavePlaceOptions = SANDBOX_CAVE_OPTIONS): GenCave[] {
  const w = f.window
  const out: GenCave[] = []
  const sizes = Array.from({ length: opts.count }, (_, n) => SANDBOX_SIZES[n % SANDBOX_SIZES.length]!)
  // Entrance candidates: mountain cells on a grid of 4-cell steps, scanned once in a fixed order.
  const cand: [number, number][] = []
  const step = 4
  for (let j = 8; j < w.n - 8; j += step) {
    for (let i = 8; i < w.n - 8; i += step) {
      if (f.biome[idx(i, j, w.n)] !== Biome.Mountain) continue
      cand.push([w.x0 + i * w.cellM, w.z0 + j * w.cellM])
    }
  }
  if (!cand.length) return out
  let nameCursor = seed & 7
  for (const [slot, size] of sizes.entries()) {
    for (let t = 0; t < MAX_TRIES; t++) {
      // One stream per (slot, try): a rejected try never shifts the draws of the others.
      const rng = new Rng(hashInts(seed, SALTS.caveSlot, slot, t))
      const c = cand[rng.int(0, cand.length - 1)]!
      const x = c[0] + rng.range(-16, 16)
      const z = c[1] + rng.range(-16, 16)
      const [ci, cj] = nearestCell(w, x, z)
      const k = idx(ci, cj, w.n)
      if (f.waterKind[k] || f.height[k]! < SEA_LEVEL + 12) continue
      if (f.biome[k] !== Biome.Mountain) continue
      const gr = gradient(f.height, w, x, z)
      if (gr.slope < MIN_SLOPE || gr.slope > MAX_SLOPE) continue
      if (out.some((o) => Math.sqrt((o.x - x) * (o.x - x) + (o.z - z) * (o.z - z)) < opts.minSpacingM)) continue
      const heading = Math.atan2(gr.dx, gr.dz)
      // Id from the seed and the entrance's world cell: the same cave keeps its id in a scene window and in the continent.
      const wi = ci + Math.round(w.x0 / w.cellM)
      const wj = cj + Math.round(w.z0 / w.cellM)
      const id = 'cave-' + hashInts(seed, wi, wj).toString(36)
      for (let tryN = 0; tryN < 4; tryN++) {
        const { spine, branches } = makeSpine(
          new Rng(hashInts(seed, SALTS.caveSpine, wi, wj, tryN)),
          new Rng(hashInts(seed, SALTS.caveBranch, wi, wj, tryN)),
          x, z, heading, size,
        )
        const cave: GenCave = {
          id,
          name: CAVE_NAMES[nameCursor % CAVE_NAMES.length]!,
          size,
          x,
          z,
          yaw: heading,
          // Floor starts level with the ground at the back edge of the mouth, so the player steps straight in.
          y0: Math.round(sampleGrid(f.height, w, x - gr.dx * CAVE.tunnelRadius, z - gr.dz * CAVE.tunnelRadius) * 100) / 100,
          spine: spine.map((v) => Math.round(v * 100) / 100),
          ...(branches.length ? { branches } : {}),
        }
        if (!caveIsValid(cave, f, opts.edgeMarginM)) continue
        out.push(cave)
        nameCursor++
        t = MAX_TRIES
        break
      }
    }
  }
  return out
}
