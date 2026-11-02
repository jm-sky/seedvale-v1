import type { HomeVillageSize } from '../config/worldConfig'
import type { HeightSampler } from '../player/PlayerController'
import type { SettlementBaseName } from '../shared/SettlementName'
import type { RawSampleParams, RegionParams } from '../terrain/chunkHeightmap'
import type { RiverQuery } from '../terrain/riverQuery'
import type { VillageSize } from './families'
import type { TerrainSamplers } from './settlementTerrain'
import { pickNameCulture } from '../ai/nameCultures'
import { getMonitor } from '../perf/active'
import { withStage } from '../perf/monitor'
import { createHomeElderFamily } from './homeAuthoredResidents'
import {
  createLostTreasureArchaeologistFamily,
  LOST_TREASURE_ARCHAEOLOGIST_SETTLEMENT_SEARCH_RADIUS,
  selectLostTreasureChroniclesArchaeologistSettlement,
} from './lostTreasureChroniclesArchaeologistResident'
import {
  createLostTreasureElderFamily,
  LOST_TREASURE_ELDER_SETTLEMENT_SEARCH_RADIUS,
  selectLostTreasureChroniclesElderSettlement,
} from './lostTreasureChroniclesElderResident'
import {
  createLostTreasureSpecialistFamily,
  LOST_TREASURE_SPECIALIST_SETTLEMENT_SEARCH_RADIUS,
  selectLostTreasureChroniclesSpecialistSettlement,
} from './lostTreasureChroniclesSpecialistResident'
import {
  cellFromId,
  cellKey,
  cellSeed,
  cellsWithinRadius,
  generateSettlementDef,
  probeSettlementSite,
  settlementBaseNameFor,
  type SettlementCell,
  settlementCellCenter,
  type SettlementDef,
  type SettlementSiteProbe,
} from './settlementGenerator'
import { localSettlementName } from './settlementNameUniqueness'
import {
  resolveSettlementProgressionPolicy,
  type SettlementProgressionPolicy,
} from './settlementProgression'
import {
  parseSettlementCellSubKey,
  SETTLEMENT_LOST_TREASURE_HOSTS_SUB_KEY,
  settlementCellSubKey,
  settlementDefinitionFingerprint,
  type SettlementLostTreasureHostsPayload,
  type SettlementProgressionIdentity,
  type SettlementWorldgenCache,
  type SettlementWorldgenCachePayload,
} from './settlementWorldgenCache'

/** Shared generation context for the single settlement-definition cache
 *  (plan 047 §9.14–15). Both `SettlementsManager` and `RoadNetwork` must
 *  resolve defs through this module — never keep a second authoritative cache. */
export type SettlementResolveContext = {
  seed: number
  sampleHeight: HeightSampler
  waterLevel: number
  localSearchRadius: number
  terrainSamplers: TerrainSamplers
  heightScale: number
  region: RegionParams
  /** Home village size override (`WorldConfig.settlements.homeSize`). */
  homeSize?: HomeVillageSize
}

/** The running world's canonical river geometry lookup (`terrain/riverQuery.ts`).
 *  World-scoped rather than a `SettlementResolveContext` field on purpose: the
 *  def cache below is itself world-scoped and "first resolver wins", so if one
 *  caller (`SettlementsManager`) passed a query and another (`ChunkManager`'s
 *  road context) did not, a village's layout would silently depend on which
 *  one asked first. One registration point makes that impossible.
 *  `null` (the default, and after `clearSettlementDefCache`) means settlements
 *  generate river-agnostically, as they did before world-terrain river
 *  integration — the behaviour unit tests and any hydrology-less caller get. */
let activeRiverQuery: RiverQuery | null = null

/** Registers the river query for the world being built. Call once per world
 *  (`ChunkManager` construction), always *after* `clearSettlementDefCache()`
 *  has dropped the previous world's defs. */
export function setSettlementRiverQuery(query: RiverQuery | null): void {
  activeRiverQuery = query
}

/** The world's canonical river lookup, for the other world-scoped worldgen
 *  consumers that must see the *same* hydrology as settlement placement —
 *  currently `roadNetwork.ts`'s river-aware routing (plan world-terrain-023
 *  §4). Reading the one registration rather than threading a query through
 *  each `RoadNetworkContext` is what makes caller order (`ChunkManager`'s road
 *  context vs. `SettlementsManager`'s) worldgen-insignificant: both contexts
 *  share one route cache, so both must resolve routes against identical
 *  rivers. `null` before registration — routing then behaves river-agnostically,
 *  exactly as it did before this plan. */
export function worldRiverQuery(): RiverQuery | null {
  return activeRiverQuery
}

const defCache = new Map<string, SettlementDef | null>()
/** Site probes for the Lost Treasure host searches only — naming never probes. */
const siteProbeCache = new Map<string, SettlementSiteProbe>()
const baseNameCache = new Map<string, SettlementBaseName>()
const nameOrdinalCache = new Map<string, number>()

/**
 * Optional IndexedDB adapter (plan settlements-014). Main thread attaches
 * it; the heightmap worker must not — it only uses in-memory `defCache`.
 */
let persistentDefs: SettlementWorldgenCache | null = null

/** Derived near/far size policy for the current world. Cleared with defs. */
let progressionPolicy: SettlementProgressionPolicy | null | undefined
/** Memoized host cell key for the Lost Treasure Chronicles elder, or `null` when none. */
let elderHostCellKey: string | null | undefined
/** Memoized host cell key for the Lost Treasure Chronicles archaeologist, or `null` when none. */
let archaeologistHostCellKey: string | null | undefined
/** Memoized host cell key for the Lost Treasure Chronicles specialist, or `null` when none. */
let specialistHostCellKey: string | null | undefined

export function clearSettlementDefCache(): void {
  defCache.clear()
  siteProbeCache.clear()
  baseNameCache.clear()
  nameOrdinalCache.clear()
  activeRiverQuery = null
  progressionPolicy = undefined
  elderHostCellKey = undefined
  archaeologistHostCellKey = undefined
  specialistHostCellKey = undefined
  persistentDefs?.invalidate()
}

/**
 * Merge one hydrated persistent def into the runtime map without overwriting
 * a key this realm already computed.
 *
 * @domain settlements
 * @system worldgen-cache
 */
export function ingestHydratedSettlementDef(subKey: string, payload: SettlementWorldgenCachePayload): void {
  if (subKey === SETTLEMENT_LOST_TREASURE_HOSTS_SUB_KEY) {
    ingestLostTreasureHosts(payload as SettlementLostTreasureHostsPayload)
    return
  }
  const def = payload as SettlementDef | null
  const cell = parseSettlementCellSubKey(subKey)
  if (!cell) return
  const key = cellKey(cell)
  if (defCache.has(key)) return
  defCache.set(key, def)
}

/**
 * Bind the main-thread IndexedDB adapter. No-op to skip when running inside
 * the terrain worker.
 *
 * @domain settlements
 * @system worldgen-cache
 */
export function attachSettlementDefinitionPersistence(cache: SettlementWorldgenCache | null): void {
  persistentDefs = cache
}

function progressionIdentityOf(
  policy: SettlementProgressionPolicy | null,
): SettlementProgressionIdentity {
  if (!policy) return null
  return {
    homeSize: policy.homeSize,
    near: policy.near
      ? { gx: policy.near.cell.gx, gz: policy.near.cell.gz, minimum: policy.near.minimum }
      : null,
    far: policy.far
      ? { gx: policy.far.cell.gx, gz: policy.far.cell.gz, minimum: policy.far.minimum }
      : null,
  }
}

/**
 * Resolve the deterministic progression policy, then activate best-effort
 * IndexedDB hydrate for this world identity. Persistent hits must not skip
 * policy resolution — its identity is part of the fingerprint.
 *
 * Call after `setSettlementRiverQuery()` so river-aware site probes match
 * generation. Consumers stay synchronous; await
 * {@link settlementDefinitionCacheReady} before the first home lookup when
 * the caller can spare a small IndexedDB read.
 *
 * @domain settlements
 * @system worldgen-cache
 */
export function activateSettlementDefinitionCacheForWorld(
  ctx: SettlementResolveContext,
  params: RawSampleParams,
): void {
  const policy = progressionPolicyFor(ctx)
  persistentDefs?.activate(
    ctx.seed,
    settlementDefinitionFingerprint({
      params,
      localSearchRadius: ctx.localSearchRadius,
      homeSize: ctx.homeSize,
      progression: progressionIdentityOf(policy),
    }),
  )
}

/** Test/lifecycle seam: resolves when the current activation's hydrate finishes. */
export function settlementDefinitionCacheReady(): Promise<void> {
  return persistentDefs?.ready() ?? Promise.resolve()
}

function progressionPolicyFor(ctx: SettlementResolveContext): SettlementProgressionPolicy | null {
  if (progressionPolicy !== undefined) return progressionPolicy
  progressionPolicy = resolveSettlementProgressionPolicy(ctx, activeRiverQuery ?? undefined)
  return progressionPolicy
}

function probeArgs(cell: SettlementCell, ctx: SettlementResolveContext) {
  return [
    cell,
    ctx.seed,
    ctx.sampleHeight,
    ctx.waterLevel,
    ctx.localSearchRadius,
    ctx.terrainSamplers,
    ctx.heightScale,
    ctx.region,
    ctx.homeSize ?? 'auto',
    activeRiverQuery ?? undefined,
    progressionPolicyFor(ctx)?.minimumFor(cell) ?? undefined,
  ] as const
}

function siteProbeFor(cell: SettlementCell, ctx: SettlementResolveContext): SettlementSiteProbe {
  const key = cellKey(cell)
  const cached = siteProbeCache.get(key)
  if (cached) return cached
  const probe = probeSettlementSite(...probeArgs(cell, ctx))
  siteProbeCache.set(key, probe)
  return probe
}

/** Ring-1 neighbour sites of `cell` (probe only), nearest first. */
function ringSitesNearestFirst(cell: SettlementCell, ctx: SettlementResolveContext): { x: number, z: number }[] {
  const own = siteProbeFor(cell, ctx).site
  if (!own) return []
  return cellsWithinRadius(cell, 1)
    .filter((n) => !(n.gx === cell.gx && n.gz === cell.gz))
    .map((n) => siteProbeFor(n, ctx).site)
    .filter((site): site is NonNullable<typeof site> => site !== null)
    .map((site) => ({ x: site.x, z: site.z, d: Math.hypot(site.x - own.x, site.z - own.z) }))
    .sort((l, r) => l.d - r.d)
}

/**
 * Neighbour sites a village must open road entrances toward (Q59): its own
 * `maxNeighborRoads` nearest ring-1 neighbours, plus every neighbour that has
 * this village among *its* nearest ones (an edge exists when either side picks
 * it, see `roadRoutesForSettlement`). Probe only — the probe site equals the
 * final def site because both resolve identical inputs (`probeArgs`).
 */
function neighborSitesFor(cell: SettlementCell, ctx: SettlementResolveContext): { x: number, z: number }[] {
  const own = siteProbeFor(cell, ctx).site
  if (!own) return []
  const limit = Math.max(0, ctx.region.roadNetwork.maxNeighborRoads ?? 3)
  const sites = ringSitesNearestFirst(cell, ctx)
  const wanted = sites.slice(0, limit)
  for (const n of cellsWithinRadius(cell, 1)) {
    if (n.gx === cell.gx && n.gz === cell.gz) continue
    const nSite = siteProbeFor(n, ctx).site
    if (!nSite || wanted.some((w) => w.x === nSite.x && w.z === nSite.z)) continue
    const theirs = ringSitesNearestFirst(n, ctx).slice(0, limit)
    if (theirs.some((t) => t.x === own.x && t.z === own.z)) wanted.push({ x: nSite.x, z: nSite.z })
  }
  return wanted
}

function baseNameOf(cell: SettlementCell, ctx: SettlementResolveContext): SettlementBaseName {
  const key = cellKey(cell)
  const cached = baseNameCache.get(key)
  if (cached) return cached
  const base = settlementBaseNameFor(
    cell,
    ctx.seed,
    ctx.sampleHeight,
    ctx.waterLevel,
    ctx.terrainSamplers,
    ctx.heightScale,
    ctx.region,
  )
  baseNameCache.set(key, base)
  return base
}

/**
 * Locally unique display name for `cell` (queue Q26, author decision
 * 2026-10-30): base name from cheap cell-center inputs plus an ordinal suffix
 * among same-name neighbours within `LOCAL_SETTLEMENT_NAME_RADIUS_M`. No site
 * search, independent of stream/lookup order.
 *
 * @domain settlements
 */
function localNameFor(cell: SettlementCell, ctx: SettlementResolveContext): string {
  return localSettlementName(cell, {
    baseNameFor: (c) => baseNameOf(c, ctx),
    centerOf: (c) => settlementCellCenter(c, ctx.seed),
    ordinals: nameOrdinalCache,
    cellKey,
  })
}

function applyResolvedSettlementName(def: SettlementDef, name: string): void {
  def.name = name
  def.plan.identity.name = name
}

function elderHostCellFor(ctx: SettlementResolveContext): SettlementCell | null {
  if (elderHostCellKey !== undefined) return elderHostCellKey ? cellFromId(elderHostCellKey) : null
  const origin: SettlementCell = { gx: 0, gz: 0 }
  const selected = selectLostTreasureChroniclesElderSettlement(
    probeCandidatesWithin(ctx, origin, LOST_TREASURE_ELDER_SETTLEMENT_SEARCH_RADIUS),
  )
  elderHostCellKey = selected ? cellKey(selected.cell) : null
  return selected?.cell ?? null
}

function probeCandidatesWithin(
  ctx: SettlementResolveContext,
  origin: SettlementCell,
  radius: number,
): Array<{
  cell: SettlementCell
  id: string
  size: VillageSize
  x: number
  z: number
  isHome: boolean
}> {
  const candidates = []
  for (const cell of cellsWithinRadius(origin, radius)) {
    if (cell.gx === origin.gx && cell.gz === origin.gz) continue
    const probe = siteProbeFor(cell, ctx)
    if (!probe.site) continue
    candidates.push({
      cell,
      id: cellKey(cell),
      size: probe.wouldBeOutpost ? 'OUTPOST' as const : probe.provisionalSize,
      x: probe.site.x,
      z: probe.site.z,
      isHome: false,
    })
  }
  return candidates
}

function archaeologistHostCellFor(ctx: SettlementResolveContext): SettlementCell | null {
  if (archaeologistHostCellKey !== undefined) {
    return archaeologistHostCellKey ? cellFromId(archaeologistHostCellKey) : null
  }
  const origin: SettlementCell = { gx: 0, gz: 0 }
  const elderHost = elderHostCellFor(ctx)
  const selected = selectLostTreasureChroniclesArchaeologistSettlement(
    probeCandidatesWithin(ctx, origin, LOST_TREASURE_ARCHAEOLOGIST_SETTLEMENT_SEARCH_RADIUS),
    elderHost ? cellKey(elderHost) : null,
  )
  archaeologistHostCellKey = selected ? cellKey(selected.cell) : null
  return selected?.cell ?? null
}

function specialistHostCellFor(ctx: SettlementResolveContext): SettlementCell | null {
  if (specialistHostCellKey !== undefined) {
    return specialistHostCellKey ? cellFromId(specialistHostCellKey) : null
  }
  const origin: SettlementCell = { gx: 0, gz: 0 }
  const elderHost = elderHostCellFor(ctx)
  const archaeologistHost = archaeologistHostCellFor(ctx)
  const selected = selectLostTreasureChroniclesSpecialistSettlement(
    probeCandidatesWithin(ctx, origin, LOST_TREASURE_SPECIALIST_SETTLEMENT_SEARCH_RADIUS),
    elderHost ? cellKey(elderHost) : null,
    archaeologistHost ? cellKey(archaeologistHost) : null,
  )
  specialistHostCellKey = selected ? cellKey(selected.cell) : null
  return selected?.cell ?? null
}

function authoredResidentsFor(cell: SettlementCell, ctx: SettlementResolveContext) {
  const seedForCell = cellSeed(ctx.seed, cell)
  const nameCulture = pickNameCulture(seedForCell)
  const residents = []
  if (cell.gx === 0 && cell.gz === 0) residents.push(createHomeElderFamily(seedForCell, nameCulture))
  // Hosts are chosen only among cells within their search radius of home, so
  // farther cells skip the (probe-heavy) host searches entirely — exact.
  if (Math.max(Math.abs(cell.gx), Math.abs(cell.gz)) > LOST_TREASURE_HOST_MAX_RING) return residents
  ensureLostTreasureHosts(ctx)
  const elderHost = elderHostCellFor(ctx)
  if (elderHost && elderHost.gx === cell.gx && elderHost.gz === cell.gz) {
    residents.push(createLostTreasureElderFamily(seedForCell, nameCulture))
  }
  const archaeologistHost = archaeologistHostCellFor(ctx)
  if (archaeologistHost && archaeologistHost.gx === cell.gx && archaeologistHost.gz === cell.gz) {
    residents.push(createLostTreasureArchaeologistFamily(seedForCell, nameCulture))
  }
  const specialistHost = specialistHostCellFor(ctx)
  if (specialistHost && specialistHost.gx === cell.gx && specialistHost.gz === cell.gz) {
    residents.push(createLostTreasureSpecialistFamily(seedForCell, nameCulture))
  }
  return residents
}

const LOST_TREASURE_HOST_MAX_RING = Math.max(
  LOST_TREASURE_ELDER_SETTLEMENT_SEARCH_RADIUS,
  LOST_TREASURE_ARCHAEOLOGIST_SETTLEMENT_SEARCH_RADIUS,
  LOST_TREASURE_SPECIALIST_SETTLEMENT_SEARCH_RADIUS,
)

/** Resolve all three Lost Treasure host cells (or reuse the memo, possibly
 *  hydrated from the worldgen cache) and persist them once, so a later session
 *  never repeats the ~120 site probes mid-play (queue Q26). */
function ensureLostTreasureHosts(ctx: SettlementResolveContext): void {
  if (elderHostCellKey !== undefined && archaeologistHostCellKey !== undefined && specialistHostCellKey !== undefined) return
  specialistHostCellFor(ctx)
  persistentDefs?.remember(SETTLEMENT_LOST_TREASURE_HOSTS_SUB_KEY, {
    elder: elderHostCellKey ?? null,
    archaeologist: archaeologistHostCellKey ?? null,
    specialist: specialistHostCellKey ?? null,
  })
}

function ingestLostTreasureHosts(payload: SettlementLostTreasureHostsPayload): void {
  // A value this realm already computed wins (same rule as defs).
  if (elderHostCellKey !== undefined || archaeologistHostCellKey !== undefined || specialistHostCellKey !== undefined) return
  elderHostCellKey = payload.elder
  archaeologistHostCellKey = payload.archaeologist
  specialistHostCellKey = payload.specialist
}

/**
 * Lost Treasure archaeologist host cell for the current world, resolving it
 * when neither this session nor the worldgen cache has it yet.
 *
 * @domain settlements
 */
export function lostTreasureArchaeologistHostCell(ctx: SettlementResolveContext): SettlementCell | null {
  ensureLostTreasureHosts(ctx)
  return archaeologistHostCellKey ? cellFromId(archaeologistHostCellKey) : null
}

/**
 * Lost Treasure specialist host cell for the current world (see
 * {@link lostTreasureArchaeologistHostCell}).
 *
 * @domain settlements
 */
export function lostTreasureSpecialistHostCell(ctx: SettlementResolveContext): SettlementCell | null {
  ensureLostTreasureHosts(ctx)
  return specialistHostCellKey ? cellFromId(specialistHostCellKey) : null
}

/** Test/debug seam: `undefined` before first resolve, then the memoized archaeologist host (or `null`). */
export function cachedLostTreasureArchaeologistHostCell(): SettlementCell | null | undefined {
  return archaeologistHostCellKey === undefined
    ? undefined
    : archaeologistHostCellKey
      ? cellFromId(archaeologistHostCellKey)
      : null
}

/** Test/debug seam: `undefined` before first resolve, then the memoized specialist host (or `null`). */
export function cachedLostTreasureSpecialistHostCell(): SettlementCell | null | undefined {
  return specialistHostCellKey === undefined
    ? undefined
    : specialistHostCellKey
      ? cellFromId(specialistHostCellKey)
      : null
}

export function settlementDefFor(
  cell: SettlementCell,
  ctx: SettlementResolveContext,
): SettlementDef | null {
  const key = cellKey(cell)
  if (defCache.has(key)) return defCache.get(key)!
  const monitor = getMonitor()
  const residents = withStage(monitor, 'settlementDefResidents', () => authoredResidentsFor(cell, ctx))
  const def = withStage(monitor, 'settlementDefGenerate', () => generateSettlementDef(...probeArgs(cell, ctx), residents, neighborSitesFor(cell, ctx)))
  if (def) applyResolvedSettlementName(def, withStage(monitor, 'settlementDefName', () => localNameFor(cell, ctx)))
  defCache.set(key, def)
  persistentDefs?.remember(settlementCellSubKey(cell.gx, cell.gz), def)
  return def
}

export function cachedSettlementDefCount(): number {
  return defCache.size
}

/** Test/debug seam: `undefined` before first resolve, then the memoized policy (or `null`). */
export function cachedSettlementProgressionPolicy(): SettlementProgressionPolicy | null | undefined {
  return progressionPolicy
}
