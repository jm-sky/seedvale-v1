import type { HomeVillageSize } from '../config/worldConfig'
import type { HeightSampler } from '../player/PlayerController'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { LandformIndex } from '../terrain/landformDescriptors'
import type { TerrainSamplers } from './settlementTerrain'
import { WORLD_HALF_EXTENT } from '../terrain/continentMask'
import { isInWaterfallReserve, waterfallReservesIn } from '../terrain/waterfallSites'
import { perennialChannelDistance } from '../terrain/worldHydrologyStore'
import { createSeededRandom } from '../world/parseSeed'
import { TRAVEL_HOUR_M } from '../world/travelUnits'
import { villageSizeConfig } from './families'
import { ROUTE_WATER_CLEARANCE } from './routeConstants'
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
export const SETTLEMENT_SPACING_M = 950
/** Radius decrement between selection passes. */
const SPACING_RELAX_STEP_M = 100
/** Settlements to select (059 decision 4: 20–25 in total, home included). */
export const SETTLEMENT_TARGET_COUNT = 25
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

/** Home-connectivity filter (plan world-terrain-063 V4): search step (m), equal to the router's grid. */
const MAINLAND_STEP_M = 18
/** Suitability term: full water access within `NEAR`, none beyond `FAR`; ring probes for coast / lake access. */
const WATER_ACCESS_NEAR_M = 150
const WATER_ACCESS_FAR_M = 400
const COAST_PROBE_RINGS_M = [60, 120] as const

/** Weight of the climate + water-access suitability term over the cheap score (plan world-terrain-063 V1 §3). */
export type SettlementSuitabilityWeight = 'none' | 'moderate' | 'strong'
const SUITABILITY_W: Record<SettlementSuitabilityWeight, number> = { none: 0, moderate: 0.4, strong: 0.8 }

export type SettlementLayoutInput = {
  seed: number
  sampleHeight: HeightSampler
  waterLevel: number
  localSearchRadius: number
  terrainSamplers: TerrainSamplers
  heightScale: number
  region: RegionParams
  homeSize?: HomeVillageSize
  /** Installed global hydrology of this world — reads waterfall reserves and the perennial-channel distance. */
  hydrologyId: string
  /** 060 landform index of this world (`landformIndexOf(rawParams)`); sites inside a footprint are rejected. */
  landformIndex: LandformIndex
}

/** Tooling-only overrides of the selection constants (plan world-terrain-063 V0). */
export type SettlementLayoutOverrides = {
  /** Replaces `SETTLEMENT_TARGET_COUNT`. */
  target?: number
  /** Replaces `SETTLEMENT_SPACING_M` (first-pass radius). */
  startSpacing?: number
  /** Climate + water-access weight; default `none` (plan world-terrain-063 V1). */
  suitability?: SettlementSuitabilityWeight
}

let layoutOverrides: SettlementLayoutOverrides | null = null

/**
 * Tooling seam for the variant runner (`scripts/perf/settlement-variants.ts`). Never called by
 * the game. The caller must also reset the settlement/road/cemetery caches, because the layout is
 * memoized per world; the runner avoids that by using one fresh process per variant.
 */
export function setSettlementLayoutOverrides(overrides: SettlementLayoutOverrides | null): void {
  layoutOverrides = overrides
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
  /** Home-connectivity filter counters (tooling / census). */
  readonly filterStats: Readonly<MainlandFilterStats>
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
  const base = 1 - Math.min(1, slope * 3) - 0.5 * Math.max(0, ridge) + SCORE_JITTER * rand
  const weight = SUITABILITY_W[layoutOverrides?.suitability ?? 'none']
  return weight === 0 ? base : base + weight * (0.5 * climateTerm(c.x, c.z, y0, input) + 0.5 * waterAccessTerm(c.x, c.z, input))
}

/** `1 − (desert + swamp)` biome weights at the cell centre (the sampler has no tundra/snow weights). */
function climateTerm(x: number, z: number, y: number, input: SettlementLayoutInput): number {
  const sample = input.terrainSamplers.sampleBiomeWeights
  if (!sample) {
    if (input.region.continentMask) throw new Error('settlement suitability needs terrainSamplers.sampleBiomeWeights in this realm')
    return 1
  }
  const altitude01 = Math.min(1, Math.max(0, (y - input.waterLevel) / Math.max(input.heightScale, 0.001)))
  const w = sample(x, z, altitude01, input.terrainSamplers.sampleMoistureRegion(x, z))
  return Math.min(1, Math.max(0, 1 - (w.desert + w.swamp)))
}

/** 1 within `WATER_ACCESS_NEAR_M` of a perennial channel, coast or lake, linear to 0 at `WATER_ACCESS_FAR_M`. */
function waterAccessTerm(x: number, z: number, input: SettlementLayoutInput): number {
  let dist = perennialChannelDistance(input.hydrologyId, x, z, WATER_ACCESS_FAR_M)
  for (const ring of COAST_PROBE_RINGS_M) {
    if (dist <= ring) break
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4
      if (input.sampleHeight(x + Math.cos(a) * ring, z + Math.sin(a) * ring) <= input.waterLevel) { dist = ring; break }
    }
  }
  return 1 - Math.min(1, Math.max(0, (dist - WATER_ACCESS_NEAR_M) / (WATER_ACCESS_FAR_M - WATER_ACCESS_NEAR_M)))
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

/** Largest (promoted) village footprint radius — the reserve guard checks the rectangle a promoted site could occupy. */
const PROMOTED_FOOTPRINT_M = villageSizeConfig('XL').footprintRadius

/** Search cap (cells) of one home-connectivity search; reaching it without proof rejects the site as `unproven`. */
export const MAINLAND_SEARCH_MAX_CELLS = 4 * 4630

/** Counters of the home-connectivity filter (plan world-terrain-063 V4 / Q188-a), reported by the census tools. */
export type MainlandFilterStats = {
  /** Sites rejected because their landmass is detached from the home landmass (exhausted search). */
  detached: number
  /** Sites rejected because the search hit `MAINLAND_SEARCH_MAX_CELLS` without proof (not cached as detached). */
  unproven: number
  /** Cells expanded by all searches (cost indicator). */
  expandedCells: number
}

/**
 * Home-connectivity test (plan world-terrain-063 V4, Q186-a / Q188-a): a site is feasible iff a best-first 8-neighbour
 * search at `MAINLAND_STEP_M` on the router's walkable rule reaches a cell already proven home-connected. Targets are
 * the home and every site accepted so far (accepted sites are proven by construction). An exhausted search means a
 * detached landmass of any size (reject, cached as a fact); the cap means `unproven` (reject, not cached). Pure
 * function of the terrain and the deterministic acceptance order.
 */
function createMainlandTest(
  input: SettlementLayoutInput,
  home: { x: number, z: number },
  stats: MainlandFilterStats,
): (x: number, z: number) => boolean {
  const proven = new Set<number>()
  const detached = new Set<number>()
  const targets: Array<{ ix: number, iz: number }> = []
  const keyOf = (ix: number, iz: number): number => (ix + 8192) * 16384 + (iz + 8192)
  const walkable = (ix: number, iz: number): boolean =>
    input.sampleHeight(ix * MAINLAND_STEP_M, iz * MAINLAND_STEP_M) > input.waterLevel + ROUTE_WATER_CLEARANCE
  const addTarget = (x: number, z: number): void => {
    const ix = Math.round(x / MAINLAND_STEP_M)
    const iz = Math.round(z / MAINLAND_STEP_M)
    targets.push({ ix, iz })
    proven.add(keyOf(ix, iz))
  }
  addTarget(home.x, home.z)
  return (x, z) => {
    const ix0 = Math.round(x / MAINLAND_STEP_M)
    const iz0 = Math.round(z / MAINLAND_STEP_M)
    const startKey = keyOf(ix0, iz0)
    if (detached.has(startKey)) { stats.detached++; return false }
    if (proven.has(startKey)) { addTarget(x, z); return true }
    // Nearest accepted target (distance, then acceptance order).
    let tgt = targets[0]!
    let best = Infinity
    for (const t of targets) {
      const d = (t.ix - ix0) ** 2 + (t.iz - iz0) ** 2
      if (d < best) { best = d; tgt = t }
    }
    // Binary min-heap of (priority = squared distance to target, cell key) — ties by key.
    const heapP: number[] = []
    const heapK: number[] = []
    const less = (i: number, j: number): boolean => heapP[i]! < heapP[j]! || (heapP[i] === heapP[j] && heapK[i]! < heapK[j]!)
    const swap = (i: number, j: number): void => {
      const p = heapP[i]!; heapP[i] = heapP[j]!; heapP[j] = p
      const k = heapK[i]!; heapK[i] = heapK[j]!; heapK[j] = k
    }
    const push = (ix: number, iz: number): void => {
      heapP.push((ix - tgt.ix) ** 2 + (iz - tgt.iz) ** 2)
      heapK.push(keyOf(ix, iz))
      let i = heapP.length - 1
      while (i > 0) {
        const parent = (i - 1) >> 1
        if (!less(i, parent)) break
        swap(i, parent)
        i = parent
      }
    }
    const pop = (): number => {
      const top = heapK[0]!
      const lastP = heapP.pop()!
      const lastK = heapK.pop()!
      if (heapP.length > 0) {
        heapP[0] = lastP
        heapK[0] = lastK
        let i = 0
        for (;;) {
          const l = 2 * i + 1
          const r = l + 1
          let m = i
          if (l < heapP.length && less(l, m)) m = l
          if (r < heapP.length && less(r, m)) m = r
          if (m === i) break
          swap(i, m)
          i = m
        }
      }
      return top
    }
    const seen = new Set<number>([startKey])
    push(ix0, iz0)
    let expanded = 0
    let proof = false
    while (heapP.length > 0 && !proof) {
      if (expanded >= MAINLAND_SEARCH_MAX_CELLS) {
        stats.expandedCells += expanded
        stats.unproven++
        return false
      }
      const k = pop()
      const ix = Math.floor(k / 16384) - 8192
      const iz = (k % 16384) - 8192
      expanded++
      for (let dz = -1; dz <= 1 && !proof; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue
          const nk = keyOf(ix + dx, iz + dz)
          if (seen.has(nk)) continue
          if (proven.has(nk)) { proof = true; break }
          if (detached.has(nk)) { seen.add(nk); continue }
          if (!walkable(ix + dx, iz + dz)) continue
          seen.add(nk)
          push(ix + dx, iz + dz)
        }
      }
    }
    stats.expandedCells += expanded
    if (proof) {
      for (const k of seen) if (!detached.has(k)) proven.add(k)
      addTarget(x, z)
      return true
    }
    // Exhausted: every seen cell belongs to the same walkable component, which never reached home.
    for (const k of seen) detached.add(k)
    stats.detached++
    return false
  }
}

/** Hard feasibility filters on a probed site (plan world-terrain-063 V1 §2): landform footprints, waterfall reserves, mainland. */
function createSiteFilter(
  input: SettlementLayoutInput,
  home: { x: number, z: number },
  stats: MainlandFilterStats,
): (site: { x: number, z: number }) => boolean {
  const onMainland = createMainlandTest(input, home, stats)
  return (site) => {
    for (const d of input.landformIndex.near(site.x, site.z)) {
      if (Math.hypot(site.x - d.centreX, site.z - d.centreZ) < d.radius) return false
    }
    const r = PROMOTED_FOOTPRINT_M
    if (isInWaterfallReserve(input.hydrologyId, site.x, site.z)
      || waterfallReservesIn(input.hydrologyId, { minX: site.x - r, maxX: site.x + r, minZ: site.z - r, maxZ: site.z + r }).length > 0) return false
    return onMainland(site.x, site.z)
  }
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

  const targetCount = layoutOverrides?.target ?? SETTLEMENT_TARGET_COUNT
  const startSpacing = layoutOverrides?.startSpacing ?? SETTLEMENT_SPACING_M
  const sites: LayoutSite[] = []
  const homeSite = probe({ gx: 0, gz: 0 })
  const homeCenter = settlementCellCenter({ gx: 0, gz: 0 }, input.seed)
  sites.push({ cell: { gx: 0, gz: 0 }, x: homeSite?.x ?? homeCenter.x, z: homeSite?.z ?? homeCenter.z })

  const filterStats: MainlandFilterStats = { detached: 0, unproven: 0, expandedCells: 0 }
  const siteFeasible = createSiteFilter(input, sites[0]!, filterStats)
  const limit = Math.ceil(WORLD_HALF_EXTENT / SETTLEMENT_GRID_STEP)
  const candidates = candidateCells(input, limit)
  const probed = new Map<string, { x: number, z: number } | null>()
  const feasible = new Map<string, boolean>()
  const taken = new Set<string>([cellKey({ gx: 0, gz: 0 })])

  const farEnough = (x: number, z: number, radius: number): boolean =>
    sites.every((s) => Math.hypot(s.x - x, s.z - z) >= radius)

  for (
    let radius = startSpacing;
    radius >= SETTLEMENT_MIN_DISTANCE_M && sites.length < targetCount;
    radius -= SPACING_RELAX_STEP_M
  ) {
    for (const { cell } of candidates) {
      if (sites.length >= targetCount) break
      const key = cellKey(cell)
      if (taken.has(key)) continue
      const c = settlementCellCenter(cell, input.seed)
      // Cheap reject on the nominal centre first (sites move at most ~margin from it).
      if (!farEnough(c.x, c.z, radius - 2 * input.localSearchRadius)) continue
      if (!probed.has(key)) probed.set(key, probe(cell))
      const site = probed.get(key)
      if (!site || !farEnough(site.x, site.z, radius)) continue
      // Feasibility last (the mainland flood fill is the expensive part) and once per cell.
      if (!feasible.has(key)) feasible.set(key, siteFeasible(site))
      if (!feasible.get(key)) continue
      sites.push({ cell, x: site.x, z: site.z })
      taken.add(key)
    }
  }

  return buildLayout(sites, filterStats)
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

function buildLayout(sites: readonly LayoutSite[], filterStats: MainlandFilterStats): SettlementLayout {
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
    filterStats,
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
