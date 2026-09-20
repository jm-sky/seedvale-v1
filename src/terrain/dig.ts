import type { HeightSampler } from '../player/PlayerController'
import type { RegionParams } from './chunkHeightmap'
import { sandBandAt } from './biomeColors'
import { isShellDigShore } from './coastalResources'

/** Radius (world units) of one dig's terrain depression — see
 *  `ChunkManager.modifyTerrain()`. Large enough to read as a real hole while
 *  still merging nearby digs into one shared pit. */
export const DIG_RADIUS = 1.4
export const DIG_DEPTH_SOIL = 0.28
export const DIG_DEPTH_SAND = 0.14
export const DIG_DEPTH_ROCK = 0.22
export const STONE_CHANCE_SOIL = 0.45
export const STONE_CHANCE_SAND = 0.15
export const STONE_CHANCE_ROCK = 0.8
/** Chance that a found stone is noticed and goes to inventory (when there is
 *  capacity); otherwise it drops beside the hole. */
export const STONE_NOTICE_CHANCE = 0.65
/** Real-time seconds for dig / level / mound channel before terrain applies. */
export const DIG_DURATION_SEC = 2

/** `sampleMountainRidge` above this reads as bare mountain rock (see
 *  `biomeColors.ts`'s `applyMountainRock` — starts blending toward `ROCK`/
 *  `SNOW` as soon as this is > 0). Digging is rejected well before the
 *  surface visually looks like solid stone, not exactly at that blend's
 *  first pixel. */
export const ROCK_MOUNTAIN_RIDGE_THRESHOLD = 0.3
/** Minimum clearance above `waterLevel` for a dig to be allowed — rejects
 *  water/seabed and the immediate shoreline. */
const WATER_MARGIN = 0.1

export type DigSurface = 'rock' | 'sand' | 'soil'

export type DigProfile = { depth: number, stoneChance: number, surface: DigSurface }

/** Narrow structural subset of `ChunkManager` — `ChunkManager` satisfies this
 *  by duck typing, but keeping it separate lets pure logic/tests construct a
 *  plain object instead of a real chunk manager (same pattern as
 *  `naturalResources.ts`'s `ResourceEnv`). */
export type DigEnv = {
  sampleHeight: HeightSampler
  sampleMountainRidge: (x: number, z: number) => number
  waterLevel: number
  /** World seed — same value coloring/grass use for `sandBandAt`. */
  seed: number
  /** Continentalness sampler + ocean/coast thresholds (plan world-terrain-047)
   *  — feeds the shared `coastalResources.ts` shoreline predicate that gates
   *  the shallow ocean-water shovel-dig exception. */
  sampleContinentalness: (x: number, z: number) => number
  region: Pick<RegionParams, 'oceanThreshold' | 'coastThreshold'>
}

/** True when `(x, z)` is bare mountain rock — the same ridge signal shovel
 *  digging already rejects. Steep grassy slopes are not rock. */
export function isRockGround(x: number, z: number, env: DigEnv): boolean {
  return env.sampleMountainRidge(x, z) > ROCK_MOUNTAIN_RIDGE_THRESHOLD
}

/** Classifies the ground at `(x, z)` for digging — `null` means not diggable
 *  (rock/mountain or water/seabed), matching the plan's soil table without a
 *  full terrain-type taxonomy: reuses the exact same signals (`mountainRidge`,
 *  height vs. `waterLevel` + local `sandBandAt`) `buildChunkGeometry.ts`'s
 *  coloring already keys off, so "looks like rock/sand" and "digs like
 *  rock/sand" stay in sync without a second terrain-type system. */
export function getDigProfileAt(x: number, z: number, env: DigEnv): DigProfile | null {
  const height = env.sampleHeight(x, z)
  if (height < env.waterLevel + WATER_MARGIN) {
    // Shallow ocean-shoreline water exception (plan world-terrain-047) — a
    // shovel may still dig here for a shell find; every other underwater/
    // seabed point (lakes, rivers, deeper ocean) stays rejected exactly as
    // before. Never widen this by lowering `WATER_MARGIN` itself.
    if (isRockGround(x, z, env)) return null
    const continentalness = env.sampleContinentalness(x, z)
    if (!isShellDigShore(height, env.waterLevel, continentalness, env.region)) return null
    return { depth: DIG_DEPTH_SAND, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }
  }
  if (isRockGround(x, z, env)) return null
  const isSand = height < env.waterLevel + sandBandAt(x, z, env.seed)
  return isSand
    ? { depth: DIG_DEPTH_SAND, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }
    : { depth: DIG_DEPTH_SOIL, stoneChance: STONE_CHANCE_SOIL, surface: 'soil' }
}

/** Pickaxe-only counterpart of `getDigProfileAt` — soil/sand return null;
 *  mountain rock (and dry land above water) returns a rock profile. */
export function getRockDigProfileAt(x: number, z: number, env: DigEnv): DigProfile | null {
  const height = env.sampleHeight(x, z)
  if (height < env.waterLevel + WATER_MARGIN) return null
  if (!isRockGround(x, z, env)) return null
  return { depth: DIG_DEPTH_ROCK, stoneChance: STONE_CHANCE_ROCK, surface: 'rock' }
}

export type DigStoneOutcome =
  | { kind: 'none' }
  | { kind: 'inventory' }
  | { kind: 'ground'; reason: 'unnoticed' | 'full' }

/** Pure stone-resolution after a successful dig roll — injectable RNG for tests. */
export function resolveDigStone(
  stoneChance: number,
  canAddStone: boolean,
  random: () => number = Math.random,
): DigStoneOutcome {
  if (random() >= stoneChance) return { kind: 'none' }
  if (!canAddStone) return { kind: 'ground', reason: 'full' }
  if (random() >= STONE_NOTICE_CHANCE) return { kind: 'ground', reason: 'unnoticed' }
  return { kind: 'inventory' }
}

/** Independent shell-find chance on eligible coastal sand digging (plan
 *  world-terrain-047) — 18%, deliberately in the requested 15–20% range. */
export const SHELL_CHANCE_SHORE_DIG = 0.18

export type DigShellOutcome = { kind: 'none' } | { kind: 'inventory' } | { kind: 'ground' }

/** Pure shell-find resolution after a successful eligible dig — an
 *  independent roll from `resolveDigStone`, so a single dig may yield both a
 *  stone and a shell. No "unnoticed" branch, unlike stone: a found shell
 *  either fits or drops beside the dig. Injectable RNG for tests. */
export function resolveDigShell(
  canAddShell: boolean,
  random: () => number = Math.random,
): DigShellOutcome {
  if (random() >= SHELL_CHANCE_SHORE_DIG) return { kind: 'none' }
  return canAddShell ? { kind: 'inventory' } : { kind: 'ground' }
}

/** True when `(x, z)` is eligible for the coastal-sand shell-find roll: the
 *  ground `profile` this dig already resolved is sand, and the point sits on
 *  the shared ocean-shoreline shore/shallow-water band (plan
 *  world-terrain-047). Never true for soil/rock, or for sand on an inland
 *  lake/river shoreline. */
export function isEligibleShellDigSpot(
  x: number,
  z: number,
  profile: Pick<DigProfile, 'surface'>,
  env: DigEnv,
): boolean {
  if (profile.surface !== 'sand') return false
  const height = env.sampleHeight(x, z)
  const continentalness = env.sampleContinentalness(x, z)
  return isShellDigShore(height, env.waterLevel, continentalness, env.region)
}
