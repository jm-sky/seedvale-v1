import type { ItemKind } from '../items/items'
import { ORE_ITEM, type MineableOre } from './depositMining'
import { biomeWeightsAt, type ForestBiome } from './biomeRegions'
import type { RegionParams } from './chunkHeightmap'
import type { DigProfile } from './dig'
import { isEligibleShellDigSpot, type DigEnv } from './dig'
import type { ChunkManager } from './chunkManager'
import { cellsWithinRadius, type SettlementCell, type SettlementDef, worldToCell, SETTLEMENT_GRID_STEP } from '../settlement/settlementGenerator'

/** @domain world-terrain
 *  Contextual shovel-find resolution (plan world-terrain-048) — repeatable
 *  low-probability material discovery during physical digging, separate from
 *  one-shot Hidden Finds. */

export const COASTAL_EXCEPTIONAL_SHELL_CHANCE = 0.05
export const COASTAL_AMBER_CHANCE = 0.02
export const INLAND_AMBER_CHANCE = 0.02
export const SETTLEMENT_LOST_OBJECT_CHANCE = 0.02
export const MOUNTAIN_TRACE_ORE_CHANCE = 0.02
export const MOUNTAIN_PROSPECTING_RANGE = 100

/** Matches established swamp-site use (`treasureSites.ts`). */
export const SWAMP_CONTEXT_THRESHOLD = 0.55

/** Extra margin beyond `SettlementDef.plan.boundary.radius` (implementation notes §7). */
export const SETTLEMENT_DIG_FOOTPRINT_MARGIN = 12

/** Highland altitude fraction — aligned with `mapProjection.ts`'s `HIGHLAND_ALTITUDE`. */
const DIG_MOUNTAIN_ALTITUDE_MIN = 0.45
/** Shoulder band below bare-rock dig rejection (`ROCK_MOUNTAIN_RIDGE_THRESHOLD`). */
const DIG_MOUNTAIN_RIDGE_MIN = 0.08

export type DigContextualFindContext = {
  coastal: boolean
  settlement: boolean
  swamp: boolean
  forest: boolean
  mountainOre?: MineableOre
}

export function isDigSwampContext(swampWeight: number): boolean {
  return swampWeight >= SWAMP_CONTEXT_THRESHOLD
}

export function isDigForestContext(forestBiome: ForestBiome): boolean {
  return forestBiome === 'forest' || forestBiome === 'deepForest'
}

export function isMountainProspectingDigContext(altitude01: number, mountainRidge: number): boolean {
  return altitude01 >= DIG_MOUNTAIN_ALTITUDE_MIN || mountainRidge > DIG_MOUNTAIN_RIDGE_MIN
}

/** True when `(x, z)` lies inside some settlement's planned circular boundary
 *  plus a small fixed margin — bounded grid walk via `peekDef`, no streaming
 *  requirement (plan world-terrain-048 §3). */
export function isWithinSettlementDigFootprint(
  peekDef: (cell: SettlementCell) => SettlementDef | null,
  x: number,
  z: number,
  margin = SETTLEMENT_DIG_FOOTPRINT_MARGIN,
): boolean {
  const maxBoundary = 72 + margin
  const center = worldToCell(x, z)
  const cellRadius = Math.ceil(maxBoundary / SETTLEMENT_GRID_STEP) + 1
  for (const cell of cellsWithinRadius(center, cellRadius)) {
    const def = peekDef(cell)
    if (!def) continue
    const boundary = def.plan.boundary
    if (Math.hypot(boundary.x - x, boundary.z - z) <= boundary.radius + margin) return true
  }
  return false
}

function resolveCoastalSpecialFind(random: () => number): ItemKind | null {
  const roll = random()
  if (roll < COASTAL_EXCEPTIONAL_SHELL_CHANCE) return 'exceptional_shell'
  if (roll < COASTAL_EXCEPTIONAL_SHELL_CHANCE + COASTAL_AMBER_CHANCE) return 'amber'
  return null
}

function resolveSettlementLostFind(random: () => number): ItemKind | null {
  if (random() >= SETTLEMENT_LOST_OBJECT_CHANCE) return null
  const pick = random()
  if (pick < 0.7) return 'coin'
  if (pick < 0.85) return 'firestarter'
  if (pick < 0.95) return 'knife'
  return 'sickle'
}

/**
 * Resolves at most one contextual special find for a completed shovel dig.
 * Priority: coastal → settlement → swamp → forest → mountain trace ore.
 */
export function resolveContextualDigFind(
  context: DigContextualFindContext,
  random: () => number = Math.random,
): ItemKind | null {
  if (context.coastal) return resolveCoastalSpecialFind(random)
  if (context.settlement) return resolveSettlementLostFind(random)
  if (context.swamp) return random() < INLAND_AMBER_CHANCE ? 'amber' : null
  if (context.forest) return random() < INLAND_AMBER_CHANCE ? 'amber' : null
  if (context.mountainOre) {
    return random() < MOUNTAIN_TRACE_ORE_CHANCE ? ORE_ITEM[context.mountainOre] : null
  }
  return null
}

export type DigContextualFindEnv = Omit<DigEnv, 'region'> & {
  region: RegionParams
  sampleMoistureRegion: (x: number, z: number) => number
  sampleForestBiome: (x: number, z: number) => ForestBiome
  heightScale: number
}

/** Composition helper — samples terrain/settlement/deposit context at dig time.
 *  Keeps `digAction.ts` free of settlement/deposit imports. */
export function buildDigContextualFindContext(
  x: number,
  z: number,
  profile: DigProfile,
  env: DigContextualFindEnv,
  peekDef: (cell: SettlementCell) => SettlementDef | null,
  queryNearestDeposit: (x: number, z: number, range: number) => { type: MineableOre } | null,
): DigContextualFindContext {
  const coastal = isEligibleShellDigSpot(x, z, profile, env)
  const settlement = !coastal && isWithinSettlementDigFootprint(peekDef, x, z)

  const height = env.sampleHeight(x, z)
  const altitude01 = Math.max(0, (height - env.waterLevel) / Math.max(env.heightScale, 0.001))
  const moisture = env.sampleMoistureRegion(x, z)
  const swampWeight = biomeWeightsAt(moisture, altitude01, env.region).swamp

  let swamp = false
  let forest = false
  if (!coastal && !settlement && profile.surface === 'soil') {
    swamp = isDigSwampContext(swampWeight)
    if (!swamp) forest = isDigForestContext(env.sampleForestBiome(x, z))
  }

  let mountainOre: MineableOre | undefined
  if (!coastal && !settlement && !swamp && !forest && profile.surface === 'soil') {
    const ridge = env.sampleMountainRidge(x, z)
    if (isMountainProspectingDigContext(altitude01, ridge)) {
      const nearest = queryNearestDeposit(x, z, MOUNTAIN_PROSPECTING_RANGE)
      if (nearest) mountainOre = nearest.type
    }
  }

  return { coastal, settlement, swamp, forest, mountainOre }
}

/** Builds the terrain sampler env for contextual-find composition at dig time. */
export function digContextualFindEnvFromChunkManager(chunkManager: ChunkManager): DigContextualFindEnv {
  return {
    sampleHeight: chunkManager.sampleHeight,
    sampleMountainRidge: chunkManager.sampleMountainRidge,
    waterLevel: chunkManager.waterLevel,
    seed: chunkManager.seed,
    sampleContinentalness: chunkManager.sampleContinentalness,
    region: chunkManager.region,
    sampleMoistureRegion: chunkManager.sampleMoistureRegion,
    sampleForestBiome: chunkManager.sampleForestBiome,
    heightScale: chunkManager.heightScale,
  }
}
