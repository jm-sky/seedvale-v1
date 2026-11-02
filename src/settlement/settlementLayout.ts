import type { HomeVillageSize } from '../config/worldConfig'
import type { HeightSampler } from '../player/PlayerController'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { TerrainSamplers } from './settlementTerrain'
import { WORLD_HALF_EXTENT } from '../terrain/continentMask'
import { createSeededRandom } from '../world/parseSeed'
import { TRAVEL_HOUR_M } from '../world/travelUnits'
import {
  cellKey,
  cellSeed,
  probeSettlementSite,
  SETTLEMENT_GRID_STEP,
  type SettlementCell,
  settlementCellCenter,
  settlementCellInsideWorld,
} from './settlementGenerator'

/**
 * World-wide settlement layout (plan world-terrain-059, W4 / decisions 2–4).
 *
 * The 300 m lattice stays the *identity* of a settlement (`settlement:<gx>_<gz>`),
 * but only the cells chosen here ever resolve to a def: a deterministic, seeded
 * Poisson-disc selection over all land cells. A relative-neighbourhood graph over
 * the selected sites then replaces the old ring-1 lattice neighbourhood for roads,
 * road entrances and (formerly) cemetery sharing.
 *
 * Pure function of seed + terrain config (no hydrology, no player, no streaming
 * order), so every realm (main thread, terrain workers, census scripts) computes
 * the same layout. Memoized per world by `settlementPlanCache`.
 */

/** Hard floor between two settlement sites: 4 game hours on foot (059 decision 4). */
export const SETTLEMENT_MIN_DISTANCE_M = 4 * TRAVEL_HOUR_M
/** First-pass selection radius — the spacing the world is *aimed* at. The pass radius
 *  relaxes towards `SETTLEMENT_MIN_DISTANCE_M` only when the target count is not met. */
export const SETTLEMENT_SPACING_M = 1150
/** Radius decrement between selection passes. */
const SPACING_RELAX_STEP_M = 100
/** Settlements to select (059 decision 4: 20–25 in total, home included). */
export const SETTLEMENT_TARGET_COUNT = 22
/** Graph edges longer than this are dropped unless they are the only link (connectivity). */
export const SETTLEMENT_MAX_EDGE_M = 2400
/** Edges beyond the 10 h band (`1800 m`) are pruned when both ends keep ≥ 2 other links and
 *  the ends stay connected without them (059 decision 4: ≥ 90 % of edges within 4–10 h). */
export const SETTLEMENT_BAND_MAX_EDGE_M = 10 * TRAVEL_HOUR_M
/** A site left with one edge gets its second-nearest Gabriel neighbour when within this. */
const SECOND_EDGE_MAX_M = 1800

/** Probe radius (m) of the cheap suitability score around a cell centre. */
const SCORE_PROBE_RADIUS_M = 40
/** Heights above `waterLevel` a cell's samples must clear to be a candidate. */
const SCORE_WATER_CLEARANCE = 1.5
/** Seeded jitter weight so equally flat cells do not always win in lattice order. */
const SCORE_JITTER = 0.6
const LAYOUT_SALT = 0x4c41594f

export type SettlementLayoutInput = {
  seed: number
  sampleHeight: HeightSampler
  waterLevel: number
  localSearchRadius: number
  terrainSamplers: TerrainSamplers
  heightScale: number
  region: RegionParams
  homeSize?: HomeVillageSize
}

export type LayoutSite = {
  cell: SettlementCell
  x: number
  z: number
}

export type SettlementLayout = {
  /** Selected sites; home first, then selection order. */
  readonly sites: readonly LayoutSite[]
  has(cell: SettlementCell): boolean
  siteOf(cell: SettlementCell): LayoutSite | null
  /** Graph neighbours of `cell`, nearest first. Empty for an unselected cell. */
  neighborsOf(cell: SettlementCell): readonly LayoutSite[]
  /** Number of undirected graph edges. */
  readonly edgeCount: number
}

type Candidate = { cell: SettlementCell, score: number }

function cheapScore(
  cell: SettlementCell,
  input: SettlementLayoutInput,
): number | null {
  const c = settlementCellCenter(cell, input.seed)
  const r = SCORE_PROBE_RADIUS_M
  const y0 = input.sampleHeight(c.x, c.z)
  const floor = input.waterLevel + SCORE_WATER_CLEARANCE
  if (y0 <= floor) return null
  let maxDelta = 0
  for (const [dx, dz] of [[r, 0], [-r, 0], [0, r], [0, -r]] as const) {
    const y = input.sampleHeight(c.x + dx, c.z + dz)
    if (y <= floor) return null
    maxDelta = Math.max(maxDelta, Math.abs(y - y0))
  }
  const slope = maxDelta / (2 * r)
  const ridge = input.terrainSamplers.sampleMountainRidge(c.x, c.z)
  const rand = createSeededRandom(cellSeed(input.seed, cell) ^ LAYOUT_SALT)()
  return 1 - Math.min(1, slope * 3) - 0.5 * Math.max(0, ridge) + SCORE_JITTER * rand
}

/** Home first, then every land cell by score descending (ties by gz, gx). */
function candidateCells(input: SettlementLayoutInput, limit: number): Candidate[] {
  const out: Candidate[] = []
  for (let gz = -limit; gz <= limit; gz++) {
    for (let gx = -limit; gx <= limit; gx++) {
      const cell = { gx, gz }
      if ((gx === 0 && gz === 0) || !settlementCellInsideWorld(cell)) continue
      const score = cheapScore(cell, input)
      if (score !== null) out.push({ cell, score })
    }
  }
  return out.sort((a, b) => b.score - a.score || a.cell.gz - b.cell.gz || a.cell.gx - b.cell.gx)
}

/**
 * Select settlements and build the neighbour graph.
 *
 * Feasibility of a selected cell is confirmed with the real site probe (no river query,
 * no progression floor — both would make the layout depend on later stages), so a
 * selected cell practically always yields a def. Probe results give the *site*
 * positions the distance rules and the graph use.
 *
 * @domain settlements
 */
export function computeSettlementLayout(input: SettlementLayoutInput): SettlementLayout {
  const probe = (cell: SettlementCell) => probeSettlementSite(
    cell,
    input.seed,
    input.sampleHeight,
    input.waterLevel,
    input.localSearchRadius,
    input.terrainSamplers,
    input.heightScale,
    input.region,
    input.homeSize ?? 'auto',
  ).site

  const sites: LayoutSite[] = []
  const homeSite = probe({ gx: 0, gz: 0 })
  const homeCenter = settlementCellCenter({ gx: 0, gz: 0 }, input.seed)
  sites.push({ cell: { gx: 0, gz: 0 }, x: homeSite?.x ?? homeCenter.x, z: homeSite?.z ?? homeCenter.z })

  const limit = Math.ceil(WORLD_HALF_EXTENT / SETTLEMENT_GRID_STEP)
  const candidates = candidateCells(input, limit)
  const probed = new Map<string, { x: number, z: number } | null>()
  const taken = new Set<string>([cellKey({ gx: 0, gz: 0 })])

  const farEnough = (x: number, z: number, radius: number): boolean =>
    sites.every((s) => Math.hypot(s.x - x, s.z - z) >= radius)

  for (
    let radius = SETTLEMENT_SPACING_M;
    radius >= SETTLEMENT_MIN_DISTANCE_M && sites.length < SETTLEMENT_TARGET_COUNT;
    radius -= SPACING_RELAX_STEP_M
  ) {
    for (const { cell } of candidates) {
      if (sites.length >= SETTLEMENT_TARGET_COUNT) break
      const key = cellKey(cell)
      if (taken.has(key)) continue
      const c = settlementCellCenter(cell, input.seed)
      // Cheap reject on the nominal centre first (sites move at most ~margin from it).
      if (!farEnough(c.x, c.z, radius - 2 * input.localSearchRadius)) continue
      if (!probed.has(key)) probed.set(key, probe(cell))
      const site = probed.get(key)
      if (!site || !farEnough(site.x, site.z, radius)) continue
      sites.push({ cell, x: site.x, z: site.z })
      taken.add(key)
    }
  }

  return buildLayout(sites)
}

type EdgeCandidate = { a: number, b: number, d: number }

/** Relative-neighbourhood graph + Gabriel fallback for degree-1 sites, long edges pruned. */
function buildEdges(sites: readonly LayoutSite[]): EdgeCandidate[] {
  const n = sites.length
  const dist = (i: number, j: number) => Math.hypot(sites[i]!.x - sites[j]!.x, sites[i]!.z - sites[j]!.z)
  const rng: EdgeCandidate[] = []
  const gabrielOnly: EdgeCandidate[] = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dij = dist(i, j)
      let rngOk = true
      let gabrielOk = true
      for (let k = 0; k < n && (rngOk || gabrielOk); k++) {
        if (k === i || k === j) continue
        const dik = dist(i, k)
        const djk = dist(j, k)
        if (Math.max(dik, djk) < dij) rngOk = false
        if (dik * dik + djk * djk < dij * dij) gabrielOk = false
      }
      if (rngOk) rng.push({ a: i, b: j, d: dij })
      else if (gabrielOk) gabrielOnly.push({ a: i, b: j, d: dij })
    }
  }
  const degree = new Array<number>(n).fill(0)
  const kept: EdgeCandidate[] = []
  const parent = Array.from({ length: n }, (_, i) => i)
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)))
  for (const e of [...rng].sort((l, r) => l.d - r.d)) {
    if (e.d > SETTLEMENT_MAX_EDGE_M && find(e.a) === find(e.b)) continue
    // Long edges stay only when they are the sole link (processed shortest-first, so a
    // long edge between already-connected components is redundant and dropped above).
    kept.push(e)
    degree[e.a]!++
    degree[e.b]!++
    parent[find(e.a)] = find(e.b)
  }
  for (const e of [...gabrielOnly].sort((l, r) => l.d - r.d)) {
    if (e.d > SECOND_EDGE_MAX_M) continue
    if (degree[e.a] !== 1 && degree[e.b] !== 1) continue
    kept.push(e)
    degree[e.a]!++
    degree[e.b]!++
  }
  return pruneRedundantLongEdges(kept, n)
}

function pruneRedundantLongEdges(edges: EdgeCandidate[], n: number): EdgeCandidate[] {
  const out = [...edges]
  const degree = new Array<number>(n).fill(0)
  for (const e of out) { degree[e.a]!++; degree[e.b]!++ }
  const connectedWithout = (skip: EdgeCandidate): boolean => {
    const seen = new Set<number>([skip.a])
    const stack = [skip.a]
    while (stack.length > 0) {
      const v = stack.pop()!
      for (const e of out) {
        if (e === skip) continue
        const w = e.a === v ? e.b : e.b === v ? e.a : -1
        if (w < 0 || seen.has(w)) continue
        if (w === skip.b) return true
        seen.add(w)
        stack.push(w)
      }
    }
    return false
  }
  for (const e of [...out].sort((l, r) => r.d - l.d)) {
    if (e.d <= SETTLEMENT_BAND_MAX_EDGE_M) break
    if (degree[e.a]! < 3 || degree[e.b]! < 3) continue
    if (!connectedWithout(e)) continue
    out.splice(out.indexOf(e), 1)
    degree[e.a]!--
    degree[e.b]!--
  }
  return out
}

function buildLayout(sites: readonly LayoutSite[]): SettlementLayout {
  const byKey = new Map(sites.map((s, i) => [cellKey(s.cell), i]))
  const edges = buildEdges(sites)
  const adjacency: Array<Array<{ j: number, d: number }>> = sites.map(() => [])
  for (const e of edges) {
    adjacency[e.a]!.push({ j: e.b, d: e.d })
    adjacency[e.b]!.push({ j: e.a, d: e.d })
  }
  const neighbors = adjacency.map((list) => list.sort((l, r) => l.d - r.d || l.j - r.j).map((x) => sites[x.j]!))
  return {
    sites,
    edgeCount: edges.length,
    has: (cell) => byKey.has(cellKey(cell)),
    siteOf: (cell) => {
      const i = byKey.get(cellKey(cell))
      return i === undefined ? null : sites[i]!
    },
    neighborsOf: (cell) => {
      const i = byKey.get(cellKey(cell))
      return i === undefined ? [] : neighbors[i]!
    },
  }
}
