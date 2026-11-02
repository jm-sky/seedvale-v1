import type { HomeVillageSize } from '../config/worldConfig'
import type { HeightSampler } from '../player/PlayerController'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { RiverQuery } from '../terrain/riverQuery'
import type { RolledVillageSize } from './families'
import type { SettlementLayout } from './settlementLayout'
import type { TerrainSamplers } from './settlementTerrain'
import { minRolledVillageSize, rolledVillageSizeRank } from './families'
import {
  probeSettlementSite,
  type SettlementCell,
} from './settlementGenerator'

/**
 * Largest ordinary size by graph hops from home (059 decision 6). A hop is one
 * edge of the settlement neighbour graph. Hops beyond the table are uncapped.
 */
export const SETTLEMENT_PROGRESSION_HOP_CAPS: Readonly<Record<number, RolledVillageSize>> = {
  1: 'MD',
  2: 'LG',
}
/** Hops (inclusive) where the guaranteed large settlement may sit. */
export const SETTLEMENT_PROGRESSION_LG_HOPS = { min: 1, max: 3 } as const
/** Hops (inclusive) where the guaranteed XL may sit; hops 3–4 are tried before 2. */
export const SETTLEMENT_PROGRESSION_XL_HOPS = { min: 2, max: 4 } as const
/** Furthest straight-line distance from home for the guaranteed XL. */
export const SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M = 4000

/** Dedicated candidate-order salts — must not reuse `cellSeed` or layout/name streams. */
export const SETTLEMENT_PROGRESSION_MD_ORDER_SALT = 0x50724d44
export const SETTLEMENT_PROGRESSION_LG_ORDER_SALT = 0x50724c47
export const SETTLEMENT_PROGRESSION_XL_ORDER_SALT = 0x50725843

const HOME_CELL: SettlementCell = { gx: 0, gz: 0 }

export type SettlementProgressionWorldInput = {
  seed: number
  sampleHeight: HeightSampler
  waterLevel: number
  localSearchRadius: number
  terrainSamplers: TerrainSamplers
  heightScale: number
  region: RegionParams
  homeSize?: HomeVillageSize
}

/** One cell whose size differs from its ordinary `rollVillageSize()` result. */
export type SettlementProgressionOverride = {
  cell: SettlementCell
  size: RolledVillageSize
}

/**
 * Deterministic size policy by graph hops from home. `sizeFor` is `null` for
 * cells that keep their ordinary `rollVillageSize()` path.
 *
 * @domain settlements
 */
export type SettlementProgressionPolicy = {
  readonly homeSize: RolledVillageSize
  /** Cells whose size is assigned; sorted by `gx`, then `gz`. */
  readonly overrides: readonly SettlementProgressionOverride[]
  /** Graph hops from home for each reachable selected cell (`gx_gz`). */
  readonly hops: ReadonlyMap<string, number>
  /** Final normal size of every non-outpost selected cell (`gx_gz`), for census/tests. */
  readonly sizes: ReadonlyMap<string, RolledVillageSize>
  sizeFor(cell: SettlementCell): RolledVillageSize | null
}

function cellKeyOf(cell: SettlementCell): string {
  return `${cell.gx}_${cell.gz}`
}

/** Graph hops from the home cell over the settlement neighbour graph. */
export function settlementGraphHops(layout: SettlementLayout): Map<string, number> {
  const hops = new Map<string, number>([[cellKeyOf(HOME_CELL), 0]])
  if (!layout.has(HOME_CELL)) return hops
  let frontier: SettlementCell[] = [HOME_CELL]
  for (let hop = 1; frontier.length > 0; hop++) {
    const next: SettlementCell[] = []
    for (const cell of frontier) {
      for (const neighbor of layout.neighborsOf(cell)) {
        const key = cellKeyOf(neighbor.cell)
        if (hops.has(key)) continue
        hops.set(key, hop)
        next.push(neighbor.cell)
      }
    }
    frontier = next
  }
  return hops
}

function progressionCandidateRank(seed: number, cell: SettlementCell, salt: number): number {
  let h = (cell.gx * 374761393 + cell.gz * 668265263) | 0
  h = (h ^ salt ^ (seed | 0)) | 0
  h = (h ^ (h >>> 13)) | 0
  h = Math.imul(h, 1274126177)
  h = (h ^ (h >>> 16)) | 0
  h = Math.imul(h, 2246822519)
  h = (h ^ (h >>> 13) ^ (seed | 0)) | 0
  return h >>> 0
}

/**
 * Seeded order of guarantee candidates. Independent of streaming / lookup order.
 *
 * @domain settlements
 */
export function orderProgressionCandidates(
  seed: number,
  cells: readonly SettlementCell[],
  salt: number,
): SettlementCell[] {
  return [...cells].sort((a, b) => {
    const rankA = progressionCandidateRank(seed, a, salt)
    const rankB = progressionCandidateRank(seed, b, salt)
    if (rankA !== rankB) return rankA - rankB
    if (a.gx !== b.gx) return a.gx - b.gx
    return a.gz - b.gz
  })
}

function probeCandidate(
  cell: SettlementCell,
  input: SettlementProgressionWorldInput,
  riverQuery: RiverQuery | undefined,
  assignedSize?: RolledVillageSize,
) {
  return probeSettlementSite(
    cell,
    input.seed,
    input.sampleHeight,
    input.waterLevel,
    input.localSearchRadius,
    input.terrainSamplers,
    input.heightScale,
    input.region,
    input.homeSize ?? 'auto',
    riverQuery,
    assignedSize,
  )
}

/**
 * Resolve the size policy for default `homeSize: auto` (059 decision 6):
 * hop 1 ≤ MD with ≥ 1 MD+, hop 2 ≤ LG, ≥ 1 LG in hops 1–3, ≥ 1 XL at hops 2–4
 * within ~4 km of home. Guarantees promote the seeded-first *feasible*
 * candidate (a site exists and it is not a resource outpost); a guarantee
 * with no feasible candidate is simply absent (visible in the census).
 * Explicit `WorldConfig.settlements.homeSize` stays authoritative: no policy.
 *
 * @domain settlements
 */
export function resolveSettlementProgressionPolicy(
  input: SettlementProgressionWorldInput,
  riverQuery: RiverQuery | undefined,
  layout: SettlementLayout,
): SettlementProgressionPolicy | null {
  if ((input.homeSize ?? 'auto') !== 'auto') return null

  const homeSize = probeCandidate(HOME_CELL, input, riverQuery).provisionalSize
  const hops = settlementGraphHops(layout)
  const homeSite = layout.siteOf(HOME_CELL)

  type Entry = {
    cell: SettlementCell
    hop: number | undefined
    natural: RolledVillageSize
    size: RolledVillageSize
    feasible: boolean
  }
  const entries: Entry[] = []
  for (const site of layout.sites) {
    if (site.cell.gx === 0 && site.cell.gz === 0) continue
    const probe = probeCandidate(site.cell, input, riverQuery)
    const hop = hops.get(cellKeyOf(site.cell))
    const cap = hop === undefined ? undefined : SETTLEMENT_PROGRESSION_HOP_CAPS[hop]
    entries.push({
      cell: site.cell,
      hop,
      natural: probe.provisionalSize,
      size: cap ? minRolledVillageSize(probe.provisionalSize, cap) : probe.provisionalSize,
      feasible: !!probe.site && !probe.wouldBeOutpost,
    })
  }

  const inHops = (entry: Entry, range: { min: number, max: number }): boolean =>
    entry.hop !== undefined && entry.hop >= range.min && entry.hop <= range.max

  /** Promote the seeded-first feasible candidate to `size` unless one already qualifies. */
  const guarantee = (
    pool: readonly Entry[],
    size: RolledVillageSize,
    salt: number,
  ): void => {
    const rank = rolledVillageSizeRank(size)
    if (pool.some((entry) => entry.feasible && rolledVillageSizeRank(entry.size) >= rank)) return
    const byKey = new Map(pool.map((entry) => [cellKeyOf(entry.cell), entry]))
    const ordered = orderProgressionCandidates(input.seed, pool.map((entry) => entry.cell), salt)
    for (const cell of ordered) {
      const entry = byKey.get(cellKeyOf(cell))!
      if (!entry.feasible) continue
      // Re-probe at the promoted size: a bigger footprint may no longer fit.
      const probe = probeCandidate(cell, input, riverQuery, size)
      if (!probe.site || probe.wouldBeOutpost) continue
      entry.size = size
      return
    }
  }

  guarantee(entries.filter((e) => e.hop === 1), 'MD', SETTLEMENT_PROGRESSION_MD_ORDER_SALT)
  guarantee(
    entries.filter((e) => inHops(e, SETTLEMENT_PROGRESSION_LG_HOPS)),
    'LG',
    SETTLEMENT_PROGRESSION_LG_ORDER_SALT,
  )
  const withinXlRange = (entry: Entry): boolean => {
    if (!homeSite) return true
    const site = layout.siteOf(entry.cell)
    if (!site) return false
    return Math.hypot(site.x - homeSite.x, site.z - homeSite.z) <= SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M
  }
  const xlPool = entries.filter((e) => inHops(e, SETTLEMENT_PROGRESSION_XL_HOPS) && withinXlRange(e))
  // Hop 2 is capped at LG, so a deeper hop is preferred for the XL guarantee.
  const deepXl = xlPool.filter((e) => e.hop! >= 3)
  guarantee(deepXl, 'XL', SETTLEMENT_PROGRESSION_XL_ORDER_SALT)
  if (!xlPool.some((e) => e.feasible && e.size === 'XL')) {
    guarantee(xlPool, 'XL', SETTLEMENT_PROGRESSION_XL_ORDER_SALT)
  }

  const overrides: SettlementProgressionOverride[] = entries
    .filter((entry) => entry.size !== entry.natural)
    .map((entry) => ({ cell: entry.cell, size: entry.size }))
    .sort((a, b) => a.cell.gx - b.cell.gx || a.cell.gz - b.cell.gz)
  const byKey = new Map(overrides.map((o) => [cellKeyOf(o.cell), o.size]))
  const sizes = new Map<string, RolledVillageSize>(
    entries.filter((e) => e.feasible).map((e) => [cellKeyOf(e.cell), e.size]),
  )

  return {
    homeSize,
    overrides,
    hops,
    sizes,
    sizeFor(cell) {
      return byKey.get(cellKeyOf(cell)) ?? null
    },
  }
}
