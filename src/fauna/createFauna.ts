import { Group, type Object3D, type Scene, type Vector3 } from 'three'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import type { ColliderSource, HeightSampler, RuntimeGroundSampler } from '../player/PlayerController'
import type { RoadCorridorSegment } from '../terrain/chunkHeightmap'
import type { LocalWaterSample } from '../terrain/waterSample'
import type { AnimalAttractionSource } from '../world/animalAttractionSource'
import type { GrassForageService } from '../world/createGrassForagePatches'
import type { WildAnimalSex } from './animalDefs'
import type { PlayerStealthState } from './playerAwareness'
import {
  disposeObject3D,
  type GltfAsset,
  loadGltfAsset,
  prepareProp,
} from '../assets/loadGltf'
import { isSystemEnabled, isWildBoarGlbEnabled } from '../debug/debugMode'
import { distanceToSegment } from '../math/segment'
import { getAgentCpuDiag } from '../perf/agentCpuDiag'
import {
  createCaveMouth,
  createThicket,
  createTree,
  loadPropTemplates,
  THICKET_TREE_SPECS,
  tintPropMaterials,
} from '../settlement/props'
import { useBootMark } from '../shared/bootMark'
import { isCoastalPlacement } from '../terrain/coastPlacement'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { labelOpacityForDistance } from '../ui/labelDistance'
import { skyParamsFromTime } from '../world/dayNight'
import { createSeededRandom } from '../world/parseSeed'
import { gameHoursToRealSeconds } from '../world/timeConversion'
import {
  ANIMAL_DEFS,
  AnimalAgent,
  type AnimalKind,
  type AnimalLifeStage,
  forageEdgeScore,
  type NearbyNpcCandidate,
  type VillageInfo,
} from './AnimalAgent'
import {
  type AnimalCaveContext,
  animalCaveEntityDimensions,
  type AnimalCaveWorldContract,
  type AnimalHabitatBinding,
  resolveAnimalCaveHabitat,
} from './animalCaveHabitat'
import { findSettlementOutskirtsDestination } from './animalRoaming'
import {
  defaultSpawnPointScenarioFields,
  type PreySpawner,
  restoreSpawnPointState,
  type SavedSpawnPointState,
  shouldDeplete,
  SPAWNER_RADIUS,
  tickSpawnPointRecovery,
  updateDepletedSpawnerRecovery,
  updateSpawners,
} from './AnimalSpawner'
import {
  type AnimalVariant,
  wolfDenInitialFillVariant,
} from './animalVariants'
import {
  canBumpClosedPressureSpawner,
  closedPressurePlacementSeed,
  type ClosedSettlementSite,
  resolveClosedPredatorPressure,
} from './closedPredatorPressure'
import {
  CarriedSpawnerStore,
  catchUpSpawnerLifecycle,
  ENGAGED_DEMATERIALIZE_TIMEOUT_SEC,
  type FaunaHabitatGroupInput,
  isGroupEngaged,
  materializedPopulation,
  type SpawnerSnapshotRow,
} from './faunaGroupLifecycle'
import { createFaunaProximityIndex } from './faunaProximity'
import {
  type HabitatPressureCacheEntry,
  type HabitatPressureSnapshot,
  resolveHabitatPressure,
} from './habitatPressure'
import {
  createPersistentOccupantRegistry,
  ordinaryHabitatCapacity,
  persistentAnimalId,
  type PersistentOccupantDecl,
  type PersistentOccupantSnapshot,
} from './persistentOccupants'
import { createBoarModel, createDuckModel, createRabbitModel } from './proceduralAnimals'
import {
  CAVE_MIN_SLOPE_DROP,
  CAVE_SLOPE_SAMPLE_RADIUS,
  findWalkableNearSite,
  PREDATOR_DEN_RING_OFFSET as HOME_DEN_RING,
  measureSlope,
  MIN_SPAWN_SEPARATION,
  type PlannedHabitatSpawner,
  type PlannedRingAnimal,
  planSettlementFaunaHabitats,
  type SettlementFaunaPlan,
  settlementFaunaSiteRandom,
  SPAWN_RIVER_CLEARANCE,
  SPAWNER_RING_OFFSET,
  SPAWNER_RIVER_CLEARANCE,
  SPAWNER_SPECS,
  type SpawnProfile,
  SPAWNS,
} from './settlementFaunaHabitats'
import {
  birthAnimalId,
  ringAnimalId,
  ringHabitatId,
  type WildFaunaRecord,
  WildFaunaRegistry,
  wildRecordFrom,
  type WildRecordOrigin,
  wildSexFromRoll,
} from './wildFaunaRecords'
import {
  activateWolfDenProblem,
  canOfferSettlementTrip,
  effectiveMaxPreyCount,
  isQuestSpawnPointPermanentlyDestroyed,
  recordSettlementTripOpportunity,
  SETTLEMENT_TRIP_STAY_SEC,
  shouldActivateWolfDenProblem,
} from './wolfDenScenario'

/** Extra clearance past each corridor's `halfWidth` — matches forest-belt
 *  road avoidance in `props.ts` (`ROAD_TREE_CLEARANCE`). */
const SPAWNER_ROAD_CLEARANCE = 1

/** Label height above ground for a cave mouth (prop ~1.1 m tall at scale 1). */
const CAVE_LABEL_HEIGHT = 1.8
/** Label above a thicket canopy (~4 m TREE_SPECS GLBs, slightly scaled). */
const THICKET_LABEL_HEIGHT = 5.8
const DEFAULT_SPAWNER_LABEL_HEIGHT = 0.6

export type { FaunaHabitatGroupInput, SpawnerSnapshotRow } from './faunaGroupLifecycle'

/** Runtime record of one habitat group inside the single fauna registry
 *  (plan fauna-050 F2). Home is `pinned`: always materialized, never disposed. */
type HabitatGroupRecord = {
  id: string
  pinned: boolean
  center: { x: number, z: number }
  /** Settlement boundary radius — destination of this group's den trips (C0). */
  footprintRadius: number
  /** Road corridors queried at this group's own anchor (C0); home uses the build-time query. */
  roadSegments: readonly RoadCorridorSegment[]
  /** Deterministic plan, computed once on first materialization and reused. */
  plan: SettlementFaunaPlan | null
  materialized: boolean
  spawnerIds: Set<string>
  ringAnimalIds: Set<string>
  /** Virtual bound counts from the lazy catch-up, consumed by the population fill. */
  virtualBounds: Map<string, number>
  /** True when this group's initial ring/fill already exists as durable records (fauna-050 C2):
   *  the build then replays nothing and dormant records are promoted instead. */
  fromRecords: boolean
}

/** Identity of a generated wild individual (fauna-050 C1.2), kept per live agent. */
type WildMeta = { habitatId: string, occupantKey: string, origin: WildRecordOrigin }

/** Margin past the outer predator-den ring inside which a record is activated with its group (C1.8). */
const ACTIVATION_MARGIN = 20

export type Fauna = {
  update: (
    dt: number,
    observerPos: Vector3,
    timeOfDay: number,
    /** `dayNight.elapsedDays` — drives the low-frequency spawn-point
     *  recovery check (plan 125 §8), at most once per in-game day. */
    worldDays: number,
    litFires: readonly { x: number, z: number }[],
    /** Loaded settlements' centers + real footprint radii
     *  (`SettlementsManager.getLoaded()`, plan 080) — wild animals react to
     *  proximity to any of these, see `AnimalAgent.ts`'s village-avoidance/
     *  flee-bias (plan 044 §2.3/§2.4). Owned livestock (horse/cow/sheep/
     *  chicken) isn't spawned here at all — see `settlement/livestock.ts`,
     *  spawned per-settlement instead. */
    villages: readonly VillageInfo[],
    /** Bounded/local live household/player livestock candidates for wild
     *  predator prey acquisition (plan fauna-026) — assembled once per fauna
     *  pass by the caller (`gameLoop.ts`'s `buildHuntableLivestock`, after
     *  `SettlementsManager.update()` so this frame's stream-in/out is
     *  reflected) from currently loaded settlements' livestock plus detached
     *  livestock, deduplicated by `animalId`. Forwarded unchanged to every
     *  wild `AnimalAgent.update()`'s `huntableLivestock` — never merged into
     *  `others`/the wild `agents` pool, never ticked here. Membership in
     *  this set, not `AnimalDef.role`, is what makes an agent
     *  huntable-as-livestock (see `AnimalUpdateContext.huntableLivestock`'s
     *  own doc for why `role` alone can't tell livestock apart). Required
     *  (not optional) so TypeScript forces every caller to make this
     *  composition decision explicitly instead of silently omitting real
     *  livestock huntability. */
    huntableLivestock: readonly AnimalAgent[],
    /** Player + nearby NPCs for predator crowd fear (plan 056). Default 1. */
    nearbyHumanCount?: number,
    /** Fauna→player damage callback when a predator bites in contact range. */
    onHumanHit?: (damage: number, attackerX: number, attackerZ: number, attackerAnimalId: string, species: AnimalKind) => void,
    /** Sneak/movement stealth inputs (plan 124 §4). Defaults to "no effect"
     *  (see `AnimalAgent.update`'s own default) when omitted. */
    playerStealth?: PlayerStealthState,
    /** Bounded/local NPC candidates for frenzied-predator targeting (plan
     *  179 §5/§7) — forwarded straight to `AnimalAgent.update`, see its own
     *  doc. Loaded settlements' NPCs, not a world scan. */
    nearbyNpcs?: readonly NearbyNpcCandidate[],
    /** Fauna→NPC damage callback (plan 179 §9/§11), mirrors `onHumanHit`.
     *  `attackerAnimalId` is the stable defense-roll source identity; species is forwarded for future physical profiles. */
    onNpcHit?: (targetId: string, damage: number, attackerX: number, attackerZ: number, attackerAnimalId: string, species: AnimalKind) => void,
    /** Aggression/alert audio hook (plan 188 §11) — forwarded to each
     *  `AnimalAgent.update()`, fired once per predator on the rising edge of
     *  committing to a human chase (see `AnimalAgent`'s own doc). */
    onAnimalAggro?: (kind: AnimalKind, x: number, z: number) => void,
    /** Spontaneous ambient vocalization hook (plan fauna-009 §1) — forwarded
     *  to each `AnimalAgent.update()`'s spontaneous cooldown roll, same as
     *  livestock's own `onAnimalVocalize` (`createSettlement.ts`). Wild
     *  fauna's only currently-configured spontaneous vocalizer is `wolf`
     *  (howl); every other wild kind has no `SPONTANEOUS_VOCALIZE_CONFIG`
     *  entry and this stays a no-op for it. */
    onAnimalVocalize?: (kind: AnimalKind, x: number, z: number) => void,
    /** Currently active attraction sources (plan fauna-023 §11) — assembled
     *  once by the caller (`gameLoop.ts`) and forwarded unchanged into every
     *  `AnimalAgent.update()` call below, never a per-animal query. Defaults
     *  to none so existing callers/tests keep prior behaviour. */
    attractionSources?: readonly AnimalAttractionSource[],
    /** Atomic dropped-food consume/peek for attraction completion. */
    consumeAttractedFood?: (droppedItemId: string) => { kind: import('../items/items').ItemKind, foodBatch?: import('../items/foodFreshness').FoodBatch } | null,
    peekAttractedFood?: (droppedItemId: string) => { kind: import('../items/items').ItemKind, foodBatch?: import('../items/foodFreshness').FoodBatch } | null,
    onAttractedFoodConsumed?: (event: {
      animalId: string
      animalKind: import('./AnimalAgent').AnimalKind
      spawnPointId?: string
      itemKind: import('../items/items').ItemKind
    }) => void,
    /** World seed for deterministic dropped-food rolls (plan items-player-049). */
    worldSeed?: number,
    /** Player-as-observer presentation inputs (npc-023) — forwarded to each
     *  wild `AnimalAgent.update()`. */
    playerObservation?: import('../simulation/observation').PlayerObservationInput,
  ) => void
  dispose: () => void
  /** Deterministic time-skip catch-up (plan 196) — called once by
   *  `gameLoop.ts` on `skip.justFinished`, mirroring `SettlementsManager.
   *  resolveTimeSkip`. `update()` itself is gated off entirely while a skip
   *  is active, so this is the sole place fauna state advances for that
   *  period — see `AnimalAgent.resolveTimeSkip`'s own doc for why a single
   *  one-shot call (not a stepped replay like NPC's) is sufficient here. */
  resolveTimeSkip: (hours: number, dayLengthSec: number) => void
  getAgents: () => AnimalAgent[]
  /** LIVE spawners only (materialized groups). Use `snapshotSpawnPoints()` for saving. */
  getSpawners: () => readonly PreySpawner[]
  /** Persisted spawner rows: union of live spawners and states carried for
   *  unmaterialized habitat groups (plan fauna-050 F2). The save shape is unchanged
   *  (`SaveSpawnPoint[]`); the list is a subset of the world's spawners. */
  snapshotSpawnPoints: () => SpawnerSnapshotRow[]
  /** Materializes a non-home habitat group (plan fauna-050 F2): spawners, props, labels,
   *  ring/individuals, with saved/carried lifecycle restored and caught up lazily to
   *  `nowDays`. Idempotent; sites are planned once per group (per-group seeded RNG) and
   *  reused on re-materialization. Returns `false` when disabled by the
   *  `worldFaunaHabitats` toggle, when `animals` is off, or for the home group. */
  materializeGroup: (group: FaunaHabitatGroupInput, nowDays: number) => boolean
  /** Requests dematerialization of a materialized non-home group: carries its spawner
   *  state and disposes its agents/props. `'deferred'` while an agent is engaged (it is
   *  retried each `update()` until disengaged or `ENGAGED_DEMATERIALIZE_TIMEOUT_SEC`). */
  dematerializeGroup: (groupId: string, nowDays: number) => 'done' | 'deferred' | 'unknown' | 'pinned'
  isGroupMaterialized: (groupId: string) => boolean
  getMaterializedGroupIds: () => string[]
  /** True once every wolf originally spawned by the wolf den (`WOLF_DEN_ID`,
   *  plan 093 Etap E) is dead — `false` if the den has none tracked yet
   *  (including a failed placement) or any tracked wolf is still alive. */
  isWolfDenCleared: () => boolean
  /** Label suffix (e.g. quest `!`/`?`) for one spawner's CSS2D label — set
   *  externally (e.g. by a QuestManager), mirrors `NpcAgent.setQuestMarker`. */
  setSpawnerMarker: (spawnerId: string, marker: string | null) => void
  /** Player "Zniszcz" on a `depleted` spawn point (plan 125 §6 / plan 137) —
   *  moves it to `disabled`, burns its prop dark and carves a charcoal scorch
   *  patch. Applies to cave/thicket **and** `wolfDen` (a cleared den is
   *  burnable; it still never respawns). Caller (`createApp.ts`) is
   *  responsible for the busy channel, the 4 branches and lighting the fire;
   *  returns `false` (no state change, no branches should be spent) if
   *  `spawnerId` isn't found or isn't currently `depleted`. */
  destroySpawner: (spawnerId: string, nowDays: number) => boolean
  /** Permanent habitat destruction for quest `destroy_spawn_point` (plan
   *  quests-progression-007) — accepts stable `WOLF_DEN_ID` or a real
   *  `PreySpawner.id`. */
  isQuestSpawnPointPermanentlyDestroyed: (questSpawnerId: string) => boolean
  /** Sparse persistent habitat-occupant snapshot (plan fauna-018) — live
   *  capture plus tombstones, for save/load and in-session rebuild carry. */
  snapshotPersistentOccupants: () => PersistentOccupantSnapshot
  /**
   * Derived, read-only habitat condition for one managed spawner
   * (plan fauna-031). Runtime cache only — never persisted. Unknown ids
   * return `null` without scanning live agents or querying forage.
   *
   * @domain fauna
   */
  getHabitatPressure: (spawnerId: string, nowDays: number) => HabitatPressureSnapshot | null
}

// Placement constants/helpers moved to `settlementFaunaHabitats.ts` (plan fauna-050 F1);
// re-exported so existing importers and tests keep their import path.
export {
  habitatSpawnerRingAttempts,
  isPredatorDenSpec,
  measureSlope,
  MIN_PREDATOR_DEN_SEPARATION,
  PREDATOR_DEN_RING_OFFSET,
  SPAWNER_RING_OFFSET,
  SPAWNER_SPECS,
  spawnerId,
} from './settlementFaunaHabitats'

/** Whether a candidate spawn position keeps `clearance` between itself and a
 *  river's water edge, given `ChunkManager.riverShoreDistance`'s signed
 *  distance there (negative inside the water, `null` with no river nearby,
 *  `undefined` when the caller supplied no river lookup at all). Pure so the
 *  "no river data means no restriction" contract is pinned by a test rather
 *  than re-read off the call sites. */
export function clearsRiverChannel(
  distanceToWaterEdge: number | null | undefined,
  clearance: number,
): boolean {
  return distanceToWaterEdge == null || distanceToWaterEdge >= clearance
}

/** Ordinary wild-fauna spawn/respawn site: physically dry (ocean, lake, or
 *  river — `LocalWaterSample.present`) plus optional river-bank clearance.
 *  Species habitat filters sit on top of this; they never replace it. */
export function isValidWildFaunaSpawnSite(
  water: LocalWaterSample,
  riverDistanceToEdge: number | null | undefined,
  riverClearance: number,
): boolean {
  return !water.present && clearsRiverChannel(riverDistanceToEdge, riverClearance)
}

/** Probe result wins when `findWalkableNear` found a site; otherwise the
 *  fallback is used only when it is itself a valid dry site. `null` means
 *  skip spawn — never place an animal on an unvalidated wet fallback. */
export function resolveWildFaunaSpawnPosition(
  probed: { x: number, z: number } | null,
  fallback: { x: number, z: number },
  fallbackOk: boolean,
): { x: number, z: number } | null {
  if (probed) return probed
  return fallbackOk ? fallback : null
}

/** True when `(x, z)` sits within `clearance` of any road corridor's own
 *  `halfWidth` (plan fauna-016 §2) — the same corridor-geometry check
 *  `spawnerSiteOk()` already applies to cave/thicket/wolfDen placement,
 *  pulled out as a pure/exported function so ordinary wild ring-spawn
 *  candidates can share it instead of a second road representation. */
export function isNearRoadCorridor(
  x: number,
  z: number,
  roadSegments: readonly RoadCorridorSegment[],
  clearance: number,
): boolean {
  for (const seg of roadSegments) {
    if (distanceToSegment(x, z, seg.ax, seg.az, seg.bx, seg.bz) < seg.halfWidth + clearance) return true
  }
  return false
}

/** Deer/stag forest-edge spawn-habitat acceptance (plan fauna-016 §1) —
 *  reuses `AnimalAgent.ts`'s `forageEdgeScore` (same edge-density peak
 *  already used for forage-target suitability) rather than a second
 *  edge-scoring function, so "spawn habitat" and "forage suitability" can
 *  never drift apart for the same forest reading. A transitional band
 *  (neither open meadow nor deep forest), not a binary `forest > x`
 *  threshold — see the plan's §1 "unikać prostego binarnego forest=true". */
export function isDeerEdgeHabitat(forestFactor: number): boolean {
  return forageEdgeScore(forestFactor) > 0.5
}

/** "Zniszcz" burn-site (plan 125 §7, enlarged in plan 137) — a wide, shallow
 *  charcoal patch around the habitat prop, not a second walk-in pit. The
 *  lit fire + darkened prop + vertex-color scorch are the burnt-site read. */
const BURN_PATCH_RADIUS = 7
const BURN_PATCH_DEPTH = 0.15
/** Tint applied to a destroyed spawn point's prop (`tintPropMaterials`, same
 *  technique as `AnimalAgent.markDangerous()`) — near-black char, not the
 *  "dangerous" red-black. */
const BURNED_SPAWNER_TINT_HEX = 0x0a0806

/** Cave depression carve (plan 083) — a real terrain pit under the rock
 *  ring, replacing the old flat dark prop disc. Sized for a walk-in opening,
 *  not shovel-dig scale (`terrain/dig.ts`'s `DIG_RADIUS`/`DIG_DEPTH_SOIL` are
 *  far too small to read as a cave mouth). */
const CAVE_DEPRESSION_RADIUS = 2.6
const CAVE_DEPRESSION_DEPTH = 1.8
/** Skip carving into terrain that already reads as bare mountain rock — same
 *  threshold `terrain/dig.ts`'s `getDigProfileAt` rejects digging into,
 *  duplicated locally since it's fauna-placement-specific and `dig.ts`
 *  doesn't export it. */
const CAVE_ROCK_MOUNTAIN_RIDGE_THRESHOLD = 0.3

/** First home-settlement rock den (`${settlementId}:cave`) — the original
 *  type-unique cave id from plan 188, unchanged by the `rockDen` rename. */
export function findHomeCaveSpawner(
  spawners: readonly PreySpawner[],
  settlementId: string,
): PreySpawner | undefined {
  const firstId = `${settlementId}:cave`
  return spawners.find((spawner) => spawner.id === firstId)
    ?? spawners.find((spawner) => spawner.type === 'rockDen' && spawner.id.startsWith(`${settlementId}:`))
}

export const SPAWNER_LABELS: Record<PreySpawner['type'], string> = {
  rockDen: 'jaskinia',
  thicket: 'zagajnik',
  grove: 'gaj',
  wolfDen: 'wilcza jama',
}

/** Accusative object of `[E] Zniszcz …` on a `depleted` spawn point. */
export const SPAWNER_DESTROY_ACCUSATIVE: Record<PreySpawner['type'], string> = {
  rockDen: 'jaskinię',
  thicket: 'zagajnik',
  grove: 'gaj',
  wolfDen: 'wilczą jamę',
}

/** Genitive object of the busy-channel title `Niszczenie …`. */
export const SPAWNER_DESTROYING_GENITIVE: Record<PreySpawner['type'], string> = {
  rockDen: 'jaskini',
  thicket: 'zagajnika',
  grove: 'gaju',
  wolfDen: 'wilczej jamy',
}

export function spawnerDestroyPromptLabel(type: PreySpawner['type']): string {
  return `[E] Zniszcz ${SPAWNER_DESTROY_ACCUSATIVE[type]}`
}

export function spawnerDestroyBusyLabel(type: PreySpawner['type']): string {
  return `Niszczenie ${SPAWNER_DESTROYING_GENITIVE[type]}…`
}

/** Wild fauna GLBs (Quaternius pack + wild_boar/rabbit). Livestock GLBs live in `livestock.ts`. */
export const FAUNA_URLS: Partial<Record<AnimalKind, string>> = {
  wolf: '/models/fauna/wolf.glb',
  fox: '/models/fauna/fox.glb',
  deer: '/models/fauna/deer.glb',
  stag: '/models/fauna/stag.glb',
  bear: '/models/fauna/bear.glb',
  boar: '/models/fauna/wild_boar.glb',
  rabbit: '/models/fauna/rabbit.glb',
}

/**
 * GLB URLs actually loaded at boot. `FAUNA_URLS` stays the full catalog
 * (asset browser); `boar` is gated by `isWildBoarGlbEnabled()` so
 * `?boarGlb=0` keeps `createBoarModel` without deleting that path.
 */
export function faunaGltfUrls(): Partial<Record<AnimalKind, string>> {
  if (isWildBoarGlbEnabled()) return FAUNA_URLS
  const { boar: _boar, ...rest } = FAUNA_URLS
  return rest
}

/** Primitive-built visuals (`proceduralAnimals.ts`) for species with no GLB,
 *  a disabled GLB flag, or a load failure — same role as `AnimalAgent`'s
 *  capsule fallback, just species-shaped. Origin at each animal's feet
 *  already, so no `wrapModel`/`prepareProp` needed. */
const PROCEDURAL_FALLBACKS: Partial<Record<AnimalKind, () => Object3D>> = {
  rabbit: createRabbitModel,
  duck: createDuckModel,
  boar: createBoarModel,
}

type FaunaTemplate = GltfAsset

async function loadFaunaTemplates(): Promise<
  Partial<Record<AnimalKind, FaunaTemplate>>
> {
  const { bootMark, bootMarkEnd } = useBootMark('loadFaunaTemplates')
  const entries = await Promise.all(
    (Object.entries(faunaGltfUrls()) as [AnimalKind, string][]).map(async ([kind, url]) => {
      try {
        bootMark(`loadGltfAsset:${url}`)
        const asset = await loadGltfAsset(url)
        bootMarkEnd(`loadGltfAsset:${url}`)
        bootMark(`prepareProp:${url}`)
        prepareProp(asset.root, ANIMAL_DEFS[kind].modelHeight)
        bootMarkEnd(`prepareProp:${url}`)
        return [kind, asset] as const
      } catch (err) {
        console.warn(`[fauna] failed to load ${url}, capsule fallback`, err)
        return [kind, null] as const
      }
    }),
  )
  const out: Partial<Record<AnimalKind, FaunaTemplate>> = {}
  for (const [kind, asset] of entries) {
    if (asset) out[kind] = asset
  }
  return out
}

/** Keep prepareProp foot/center offsets on the child; world pos lives on the wrap. */
function wrapModel(model: Object3D): Group {
  const wrap = new Group()
  wrap.add(model)
  return wrap
}

/** Hysteresis view of an agent: `immediate` update importance = combat/chase/trip/player-led
 *  (a group is dematerialized when the observer is far, so the distance signal is off). */
function engagementOf(agent: AnimalAgent): { isDead: () => boolean, isEngaged: () => boolean } {
  return {
    isDead: () => agent.isDead(),
    isEngaged: () => agent.getDebugInfo().updateImportance === 'immediate',
  }
}

function disposeAgent(agent: AnimalAgent): void {
  agent.dispose()
  agent.mesh.removeFromParent()
  // `disposeObject3D` checks `sharedGpu` per mesh/material, so it already
  // no-ops safely on anything still cache-shared with the GLB loader — this
  // is unconditional so materials un-shared by e.g. `markDangerous()`'s
  // `tintPropMaterials` clone (plan 110) actually get freed on despawn
  // (matches the existing pattern in `terrain/resourceDeposits.ts`).
  disposeObject3D(agent.mesh)
}

/**
 * Place animals in a ring around the settlement (forest belt).
 * Prefers GLB from `public/models/fauna/` keyed by `userData.animalKind`.
 * `roadSegments` — corridors near home used to keep prey spawners off roads.
 * `footprintRadius` — this settlement's real boundary radius
 * (`VILLAGE_SIZE_CONFIG.footprintRadius`, plan 080) — spawn rings anchor past
 * it instead of a fixed guess, see `SPAWN_RING_OFFSET`/`SPAWNER_RING_OFFSET`.
 * `terrainCarving` — lets the cave spawner cut a real depression into the
 * terrain (plan 083) instead of relying on a flat prop; optional so callers
 * without terrain-modification access (e.g. future tests) still work, just
 * without the carved pit.
 */
export async function createFauna(
  scene: Scene,
  sampleHeight: HeightSampler,
  sampleForestFactor: (x: number, z: number) => number,
  waterLevel: number,
  sampleLocalWater: (x: number, z: number) => LocalWaterSample,
  collidersNear: ColliderSource,
  homeRadius: number,
  settlementCenter: Vector3,
  /** Stable settlement id (`Settlement.id`) — seeds each managed spawn
   *  point's deterministic `PreySpawner.id` (plan 125 §5), independent of
   *  runtime spawn order/rebuilds. */
  settlementId: string,
  seed: number,
  footprintRadius: number,
  roadSegments: readonly RoadCorridorSegment[] = [],
  coast?: {
    sampleContinentalness: (x: number, z: number) => number
    coastThreshold: number
  },
  terrainCarving?: {
    modifyTerrain: (x: number, z: number, radius: number, depth: number, source: 'player' | 'system') => boolean
    scorchTerrain?: (x: number, z: number, radius: number, depth: number, source: 'player' | 'system') => boolean
    sampleMountainRidge: (x: number, z: number) => number
  },
  /** Reports any wild-fauna death (any cause) by `animalId` — forwarded into
   *  every `AnimalAgent` this factory spawns (plan 110). */
  onAnimalDeath?: (animalId: string) => void,
  /** Saved spawn-point lifecycle (plan 125 persistence follow-up), keyed by
   *  the same deterministic `PreySpawner.id` this factory derives below —
   *  applied right after each managed spawn point is (re)created, both on a
   *  real save/load and on an in-session `rebuildWorldBundle()` (config
   *  change, not a new seed). Absent/missing entries mean "fresh spawn
   *  point" (defaults already set by the constructor below). */
  initialSpawnerState?: ReadonlyMap<string, SavedSpawnPointState>,
  /** Shared world-owned grass forage service (plan fauna-010 §3/§4) —
   *  forwarded unchanged into every `AnimalAgent.update()` call below and
   *  ticked once per frame for patch-visual streaming near the observer.
   *  Optional so existing tests that don't model it keep prior behaviour
   *  (herbivores simply fall back to the old abstract forage spot). */
  grassForage?: GrassForageService,
  /** Shared world-owned player-trough water provider (plan items-player-020
   *  §4) — forwarded unchanged into every `AnimalAgent.update()` call below. */
  waterSourceProvider?: import('./animalForaging').AnimalWaterSourceProvider,
  naturalWaterKindAt?: (x: number, z: number) => import('../world/WaterSource').WaterBodyKind | null,
  /** Signed distance from a point to the nearest loaded river's water edge
   *  (`ChunkManager.riverShoreDistance`) — negative inside the water, `null`
   *  when no river channel is near. Optional so callers/tests without
   *  hydrology keep prior behaviour; when present, every wild spawn and
   *  habitat spawn point keeps clear of the active channel. */
  riverShoreDistance?: (x: number, z: number) => number | null,
  /** Fixed-position habitat spawners (plan quests-progression-009) — world
   *  sites outside the settlement ring, same lifecycle as settlement dens. */
  extraHabitatSpawners?: readonly {
    id: string
    x: number
    z: number
    type: PreySpawner['type']
    kind: AnimalKind
    respawnIntervalDays: number
    maxPreyCount: number
  }[],
  /** Explicit persistent habitat occupants (plan fauna-018) — applied
   *  before generic initial fill. Absent means no persistent slots. */
  persistentOccupantDecls?: readonly PersistentOccupantDecl[],
  /** Restored persistent occupant records/tombstones (save/load or
   *  in-session rebuild). Absent means first construction of each declaration. */
  initialPersistentOccupants?: PersistentOccupantSnapshot,
  /** Narrow, read-only world-cave contract (plan fauna-019) — the
   *  composition root's adapter over the real `Caves` instance. Required
   *  only to resolve a `caveHabitats` binding; absent/no matching binding
   *  means every occupant declaration falls back to its existing
   *  `PreySpawner`-backed path unchanged. */
  caveWorld?: AnimalCaveWorldContract,
  /** Fauna-owned cave habitat bindings (plan fauna-019) — a
   *  `PersistentOccupantDecl.habitatId` that matches one of these resolves
   *  its home/route from the named real cave instead of a `PreySpawner`.
   *  Absent means no cave-backed habitat this build. */
  caveHabitats?: readonly AnimalHabitatBinding[],
  /** Shared bridge-deck movement-ground query (plan world-terrain-033 §7) —
   *  composed below into a bridge-aware `sampleHeight`/`sampleLocalWater`
   *  used only for the `AnimalAgent` this factory constructs, never
   *  reassigned onto the raw `sampleHeight`/`sampleLocalWater` above (both
   *  stay pure terrain for spawn-site/habitat placement, where a bridge deck
   *  is not terrain). Optional so existing callers/tests keep compiling. */
  sampleBridgeDeck?: (x: number, z: number) => number | null,
  /** Death vocal at `collapse()` (S26) — forwarded into every `AnimalAgent`
   *  this factory spawns, same optional convention as `onAnimalDeath`. */
  onAnimalDeathSound?: (kind: AnimalKind, x: number, y: number, z: number) => void,
  /** Nearby closed settlements whose configured predator pressure this
   *  home-centric fauna build may fill (plan settlements-010). Optional so
   *  existing callers/tests keep compiling. Placement uses a dedicated RNG,
   *  never the fauna `0xfa11` stream. */
  closedSettlements?: readonly ClosedSettlementSite[],
  /** Resident/runtime movement-ground query (plan world-terrain-044) —
   *  `ChunkManager.sampleRuntimeSurfaceGround`, composed below into the
   *  `AnimalAgent` this factory constructs' detailed-movement sampler
   *  (`null` at a streaming frontier holds the step instead of
   *  `sampleBridgeDeck ?? sampleHeight`'s silent analytical fallback).
   *  Optional so existing callers/tests without a `ChunkManager` keep
   *  compiling. */
  sampleResidentSurfaceGround?: RuntimeGroundSampler,
  /** Large-cave mouth positions (queue Q100) — predator dens keep
   *  `MIN_PREDATOR_DEN_SEPARATION` from them so a den never reads as a
   *  second cave next to a real one. Optional; omitted = no constraint. */
  denAvoidPoints?: readonly { x: number, z: number }[],
): Promise<Fauna> {
  const { bootMark, bootMarkEnd } = useBootMark('createFauna')

  // Bridge-aware ground/water composed once, consumed only by the
  // `AnimalAgent` construction inside `spawnAgent` below.
  const agentSampleHeight: HeightSampler = sampleBridgeDeck
    ? (x, z) => sampleBridgeDeck(x, z) ?? sampleHeight(x, z)
    : sampleHeight
  const agentSampleLocalWater: (x: number, z: number) => LocalWaterSample = sampleBridgeDeck
    ? (x, z) => (sampleBridgeDeck(x, z) != null ? DRY_WATER_SAMPLE : sampleLocalWater(x, z))
    : sampleLocalWater

  const random = createSeededRandom(seed ^ 0xfa11)
  /** Spawner lifecycle states not owned by a live spawner (save-loaded, rebuild-carried
   *  or dematerialized groups) — plan fauna-050 F2. */
  const carried = new CarriedSpawnerStore(initialSpawnerState)
  const groups = new Map<string, HabitatGroupRecord>()
  /** Groups whose dematerialization waits on engaged agents -> real seconds waited. */
  const pendingDematerialize = new Map<string, number>()
  /** Terrain edits are not persisted per spawner and not idempotent: apply each once per instance. */
  const terrainEditedKeys = new Set<string>()
  let agents: AnimalAgent[] = []
  const proximity = createFaunaProximityIndex()
  /** Reusable fauna-041 membership counts keyed by `spawnPointId` (plan fauna-042). */
  const boundOccupancyCounts = new Map<string, number>()
  /** `animalId`s of the wolf den's initial pack (plan 093 Etap E) — set once
   *  at placement, checked by `isWolfDenCleared()`. Empty if the den failed
   *  to find a valid site (`isWolfDenCleared()` then always reports `false`,
   *  never a false "cleared"). */
  const denWolfAnimalIds = new Set<string>()
  bootMark('loadFaunaTemplates')
  let templates: Partial<Record<AnimalKind, FaunaTemplate>>
  let thicketTreeTemplates: Object3D[]
  try {
    ;[templates, thicketTreeTemplates] = await Promise.all([
      loadFaunaTemplates(),
      loadPropTemplates(THICKET_TREE_SPECS, () => createTree(1)),
    ])
  } finally {
    bootMarkEnd('loadFaunaTemplates')
  }
  const spawnerMeshes: Object3D[] = []
  /** Managed spawn-point lifecycle state (plan 125), keyed by the stable
   *  `PreySpawner.id` — same objects also live in the `spawners` array below;
   *  this map exists purely for O(1) lookup from `destroySpawner()`/death
   *  accounting instead of a linear scan. */
  const spawnerById = new Map<string, PreySpawner>()
  /** A managed spawn point's prop mesh, keyed by `PreySpawner.id` — lets
   *  `destroySpawner()` tint the right prop without relying on array-index
   *  correlation with `spawnerMeshes`. */
  const spawnerMeshById = new Map<string, Object3D>()
  /** `animalId -> PreySpawner.id` for animals currently alive and generated
   *  by a managed spawn point (plan 125 §4/§5) — populated by `spawnAgent`
   *  when given a `spawnPointId`, consumed (and removed) exactly once by
   *  `handleAnimalDeath` so one animal can never be counted twice. */
  const animalToSpawner = new Map<string, string>()
  /** At most one settlement-directed trip per wolf den at a time (runtime). */
  const settlementTripAnimalBySpawner = new Map<string, string>()
  /** Runtime-only habitat pressure snapshots (plan fauna-031) — never persisted. */
  const habitatPressureCache = new Map<string, HabitatPressureCacheEntry>()
  const queryHabitatForage = grassForage
    ? (x: number, z: number, radius: number, days: number) =>
      grassForage.queryNear(x, z, radius, days)
    : undefined

  /** Wraps the injected `onAnimalDeath` (quest hook, plan 110) with local
   *  spawn-point death accounting (plan 125 §4) — every animal this factory
   *  spawns uses this as its `onDeath`, whether or not it carries a
   *  `spawnPointId`. Cause-independent (player, predator, life-need
   *  starvation): `AnimalAgent.collapse()` is the single call site regardless
   *  of what triggered it. */
  const handleAnimalDeath = (animalId: string): void => {
    for (const [denId, travellerId] of settlementTripAnimalBySpawner) {
      if (travellerId === animalId) settlementTripAnimalBySpawner.delete(denId)
    }
    const spawnerId = animalToSpawner.get(animalId)
    if (spawnerId) {
      animalToSpawner.delete(animalId)
      const spawner = spawnerById.get(spawnerId)
      if (spawner && spawner.state === 'active') {
        spawner.deathsThisCycle++
        if (shouldDeplete(spawner.deathsThisCycle, effectiveMaxPreyCount(spawner))) spawner.state = 'depleted'
      }
    }
    onAnimalDeath?.(animalId)
  }

  const onRoad = (x: number, z: number): boolean =>
    isNearRoadCorridor(x, z, roadSegments, SPAWNER_ROAD_CLEARANCE)

  const drySpawnSite = (x: number, z: number, riverClearance: number): boolean =>
    isValidWildFaunaSpawnSite(sampleLocalWater(x, z), riverShoreDistance?.(x, z), riverClearance)

  /** Random point within [minDist, maxDist] of (cx, cz), clear of water and
   *  a safety bound around (cx, cz) — `filter` adds a habitat preference
   *  (meadow/forest/shoreline) on top, see `SPAWN_RING_OFFSET`/`SPAWNS`. The
   *  safety bound is `homeRadius` by default but never tighter than the
   *  caller's own `maxDist` (plan 080 — `footprintRadius`-anchored rings for
   *  `LG`/`XL` villages can legitimately exceed the historical `homeRadius`
   *  guess, and a bound narrower than the requested ring would make
   *  placement impossible by construction). */
  const findWalkableNear = (
    cx: number,
    cz: number,
    minDist: number,
    maxDist: number,
    filter?: (x: number, z: number) => boolean,
    maxAttempts = 24,
    rng: () => number = random,
  ): { x: number, z: number } | null =>
    findWalkableNearSite({ homeRadius, isDry: drySpawnSite }, rng, cx, cz, minDist, maxDist, filter, maxAttempts)

  /** Wild-fauna spawn points placed so far this build (ring spawns + cave/
   *  thicket/wolfDen spawners) — `MIN_SPAWN_SEPARATION` rejection reads this, both
   *  loops below push into it (plan 080). */
  const placedSpawnPoints: { x: number, z: number }[] = []
  const farFromOtherSpawns = (x: number, z: number): boolean =>
    placedSpawnPoints.every((p) => Math.hypot(p.x - x, p.z - z) >= MIN_SPAWN_SEPARATION)

  /** True if any point a few meters out from (x, z) dips into water — used to
   *  bias duck spawns toward the shoreline without requiring the duck's own
   *  spot to be wet. The duck's own candidate is still a dry spawn site. */
  const nearWater = (x: number, z: number): boolean => {
    const offsets: Array<[number, number]> = [
      [5, 0], [-5, 0], [0, 5], [0, -5], [3.5, 3.5], [-3.5, -3.5], [3.5, -3.5], [-3.5, 3.5],
    ]
    return offsets.some(([dx, dz]) => sampleLocalWater(x + dx, z + dz).present)
  }

  const habitatFilterFor = (profile: SpawnProfile): ((x: number, z: number) => boolean) | undefined => {
    switch (profile) {
      case 'edge':
        return (x, z) => isDeerEdgeHabitat(sampleForestFactor(x, z))
      case 'forest':
        return (x, z) => sampleForestFactor(x, z) > 0.45
      case 'meadow':
        return (x, z) => sampleForestFactor(x, z) < 0.35
      case 'water':
        return nearWater
      default:
        return undefined
    }
  }

  /** Per-build counter for `animalId` — unique within this settlement's live
   *  `Fauna` (one instance per game session, see `worldBundle.ts`'s
   *  `buildFauna`), covering both the initial ring spawn and later
   *  spawner-driven respawns below. */
  let nextAnimalId = 0
  const occupantDecls = isSystemEnabled('animals') ? (persistentOccupantDecls ?? []) : []
  const occupantRegistry = createPersistentOccupantRegistry(initialPersistentOccupants)
  /** Generated wild individuals (fauna-050 C2): an active agent is authoritative, a dormant record
   *  is authoritative otherwise. Never two agents per record. */
  const wildRegistry = new WildFaunaRegistry(initialPersistentOccupants?.wild)
  const wildMeta = new Map<string, WildMeta>()
  occupantRegistry.registerDeclarations(occupantDecls)
  const reservedPersistentSlots = occupantRegistry.slotCountsByHabitatId()
  /** Fauna-owned cave habitat bindings (plan fauna-019), keyed by
   *  `habitatId` for O(1) lookup from the occupant-declaration loop below —
   *  never a `PreySpawner` stand-in for the physical cave. */
  const caveHabitatBindings = new Map<string, AnimalHabitatBinding>()
  for (const binding of caveHabitats ?? []) caveHabitatBindings.set(binding.habitatId, binding)
  const spawnAgent = (
    kind: AnimalKind,
    x: number,
    z: number,
    herdId?: string,
    lifeStage?: AnimalLifeStage,
    motherId?: string,
    /** Managed spawn point this animal belongs to (plan 125 §5) — only
     *  passed by spawner-driven creation (initial placement + respawn) below,
     *  never by ring spawns/livestock. */
    spawnPointId?: string,
    /** Stable id for a persistent habitat occupant (plan fauna-018). Ordinary
     *  callers omit this and keep the per-build `${kind}-${n}` path. */
    explicitAnimalId?: string,
    /** Resolved cave habitat (plan fauna-019) — only a cave-backed
     *  persistent occupant passes this. */
    cave?: AnimalCaveContext,
    /** Per-individual variant (plan fauna-022). Omitted → `normal`. */
    variant?: AnimalVariant,
    /** Generated wild individual (fauna-050 C2): registers its durable identity. */
    wild?: WildMeta & { sex?: WildAnimalSex, forceFemale?: boolean },
  ): AnimalAgent => {
    const tpl = templates[kind]
    let visual: Object3D | undefined
    let animations = tpl?.animations ?? []
    if (tpl) {
      visual = wrapModel(tpl.clone())
      animations = tpl.animations
    } else {
      visual = PROCEDURAL_FALLBACKS[kind]?.()
    }
    const animalId = explicitAnimalId ?? `${kind}-${nextAnimalId++}`
    if (spawnPointId) animalToSpawner.set(animalId, spawnPointId)
    const boundSpawner = spawnPointId ? spawnerById.get(spawnPointId) : undefined
    const sex: WildAnimalSex | undefined = wild
      ? (wild.sex ?? wildSexFromRoll(settlementFaunaSiteRandom(seed, `sex:${animalId}`)(), wild.forceFemale))
      : undefined
    if (wild) wildMeta.set(animalId, { habitatId: wild.habitatId, occupantKey: wild.occupantKey, origin: wild.origin })
    return new AnimalAgent({
      def: ANIMAL_DEFS[kind],
      animalId,
      sampleHeight: agentSampleHeight,
      sampleResidentSurfaceGround,
      waterLevel,
      sampleLocalWater: agentSampleLocalWater,
      naturalWaterKindAt,
      collidersNear,
      x,
      z,
      visual,
      animations,
      sampleForestFactor,
      onDeath: handleAnimalDeath,
      onDeathSound: onAnimalDeathSound,
      herdId,
      lifeStage,
      motherId,
      spawnPointId,
      humanTaste: boundSpawner?.humanTaste ?? false,
      cave,
      variant,
      ...(sex ? { sex } : {}),
    })
  }

  /** Creates the next durable `b<seq>` individual of a spawner (initial fill, respawn, birth). */
  const spawnBirth = (
    spawner: PreySpawner,
    x: number,
    z: number,
    origin: WildRecordOrigin,
    variant?: AnimalVariant,
  ): AnimalAgent => {
    const seq = spawner.nextBirthSeq ?? 0
    spawner.nextBirthSeq = seq + 1
    return spawnAgent(
      spawner.kind, x, z, undefined, undefined, undefined, spawner.id,
      birthAnimalId(spawner.id, seq), undefined, variant,
      { habitatId: spawner.id, occupantKey: `b${seq}`, origin },
    )
  }

  /** Record of a live generated individual (refresh on demote / save). */
  const recordOf = (agent: AnimalAgent, nowDays: number): WildFaunaRecord | undefined => {
    const meta = wildMeta.get(agent.animalId)
    if (!meta) return undefined
    return wildRecordFrom(
      {
        ...meta,
        animalId: agent.animalId,
        kind: agent.def.kind,
        sex: agent.sex,
        herdId: agent.herdId,
        variant: agent.variant === 'normal' ? undefined : agent.variant,
        humanTaste: agent.humanTaste || undefined,
      },
      agent.snapshot(),
      nowDays,
    )
  }

  const spawners: PreySpawner[] = []
  const spawnerLabels: {
    id: string
    type: PreySpawner['type']
    object: CSS2DObject
    el: HTMLDivElement
    marker: string | null
    lastOpacity: number
  }[] = []
  /** Habitat spawners (esp. thicket) stay inland — not on beach / coastal
   *  band, and not on top of a river channel (`SPAWNER_RIVER_CLEARANCE`).
   *  `roadTest` is the owning group's road predicate (C0: never the home query for a remote site). */
  const spawnerSiteOkFor = (roadTest: (x: number, z: number) => boolean) => (x: number, z: number): boolean => {
    if (!drySpawnSite(x, z, SPAWNER_RIVER_CLEARANCE)) return false
    if (roadTest(x, z)) return false
    return !isCoastalPlacement(x, z, {
      sampleHeight,
      waterLevel,
      sampleContinentalness: coast?.sampleContinentalness,
      coastThreshold: coast?.coastThreshold,
    })
  }
  /** Home / extra-site gate (build-time road query). */
  const spawnerSiteOk = spawnerSiteOkFor(onRoad)

  /** Spawner id -> owning group (C0): destination owner for den trips and the
   *  home-only wolf-den scenario guard. Absent = extra/closed-pressure site, treated as home. */
  const spawnerGroupById = new Map<string, HabitatGroupRecord>()
  /** Site-owned placement streams for non-home spawners (C0): independent of
   *  materialization order. Home keeps the shared `0xfa11` stream (bit-identical). */
  const spawnerRngById = new Map<string, () => number>()
  const rngForSpawner = (spawner: PreySpawner): (() => number) => {
    if (spawnerGroupById.get(spawner.id)?.pinned ?? true) return random
    let rng = spawnerRngById.get(spawner.id)
    if (!rng) {
      rng = settlementFaunaSiteRandom(seed, `spawner:${spawner.id}`)
      spawnerRngById.set(spawner.id, rng)
    }
    return rng
  }
  /** Walkable point near a spawner, drawn from that spawner's own stream. */
  const findWalkableNearSpawner = (spawner: PreySpawner, minDist: number, maxDist: number) =>
    findWalkableNear(spawner.x, spawner.z, minDist, maxDist, undefined, 24, rngForSpawner(spawner))

  /** Creates the planned ring individuals (planner hook, after the ring phase and
   *  before any spawner is placed/carved). */
  const spawnRing = (ring: readonly PlannedRingAnimal[], group: HabitatGroupRecord): void => {
    // Initial population already exists as durable records: never replayed (removed = gone).
    if (group.fromRecords) return
    bootMark('ringSpawns')
    try {
      const created: AnimalAgent[] = []
      const motherIndexes = new Set<number>()
      for (const planned of ring) if (planned.motherIndex !== undefined) motherIndexes.add(planned.motherIndex)
      for (const [index, planned] of ring.entries()) {
        const mother = planned.motherIndex === undefined ? undefined : created[planned.motherIndex]
        const agent = spawnAgent(
          planned.kind, planned.x, planned.z, planned.herdId, planned.lifeStage, mother?.animalId,
          undefined, ringAnimalId(group.id, index), undefined, undefined,
          { habitatId: ringHabitatId(group.id), occupantKey: `r${index}`, origin: 'ring', forceFemale: motherIndexes.has(index) },
        )
        scene.add(agent.mesh)
        agents.push(agent)
        created.push(agent)
        group.ringAnimalIds.add(agent.animalId)
      }
    } finally {
      bootMarkEnd('ringSpawns')
    }
  }

  /** Materializes one planned habitat spawner (state restore, terrain carve/scorch,
   *  prop, label). Runs inside the planner's per-site hook so carving keeps
   *  influencing the next site's samples, as in the inline home build. */
  const materializeSpawner = (planned: PlannedHabitatSpawner, group: HabitatGroupRecord, nowDays: number): void => {
    const { spec } = planned
    const pos = { x: planned.x, z: planned.z }
    const spawner: PreySpawner = {
      x: pos.x,
      z: pos.z,
      ...spec,
      id: planned.id,
      daysSinceLastRespawn: 0,
      state: 'active',
      deathsThisCycle: 0,
      disabledAtDay: null,
      depletedRecoveryDays: 0,
      ...defaultSpawnPointScenarioFields(spec.type),
    }
    const carriedEntry = carried.take(spawner.id)
    restoreSpawnPointState(spawner, carriedEntry?.saved)
    if (carriedEntry?.runtime) {
      // Lazy day catch-up for the time this group was unloaded (plan fauna-050 F2).
      group.virtualBounds.set(
        spawner.id,
        catchUpSpawnerLifecycle(spawner, carriedEntry.runtime, nowDays, occupantRegistry.slotCountFor(spawner.id)),
      )
    }
    group.spawnerIds.add(spawner.id)
    spawnerGroupById.set(spawner.id, group)
    spawners.push(spawner)
    spawnerById.set(spawner.id, spawner)

    const { groundY } = planned
    if (spec.type === 'rockDen') {
      const slope = planned.slope ?? measureSlope(pos.x, pos.z, CAVE_SLOPE_SAMPLE_RADIUS, sampleHeight)
      const facingVillage = Math.atan2(pos.x - group.center.x, pos.z - group.center.z)
      if (
        terrainCarving
        && !terrainEditedKeys.has(`${spawner.id}:carve`)
        && terrainCarving.sampleMountainRidge(pos.x, pos.z) <= CAVE_ROCK_MOUNTAIN_RIDGE_THRESHOLD
      ) {
        terrainEditedKeys.add(`${spawner.id}:carve`)
        // Deterministic from seed/settlement placement, redone from scratch
        // on every world build — never persisted (plan `world-terrain-save`).
        terrainCarving.modifyTerrain(pos.x, pos.z, CAVE_DEPRESSION_RADIUS, CAVE_DEPRESSION_DEPTH, 'system')
      }
      const mouth = createCaveMouth(1, planned.propRandoms[0])
      mouth.position.set(pos.x, groundY, pos.z)
      // Open side (+Z) faces downhill when a slope was found, otherwise away
      // from the settlement into the wild (pre-083 fallback behavior).
      mouth.rotation.y = slope.drop >= CAVE_MIN_SLOPE_DROP ? slope.yaw : facingVillage
      scene.add(mouth)
      spawnerMeshes.push(mouth)
      spawnerMeshById.set(spawner.id, mouth)
    } else if (spec.type === 'thicket') {
      const thicket = createThicket(1, planned.propRandoms[0], thicketTreeTemplates)
      thicket.position.set(pos.x, groundY, pos.z)
      thicket.rotation.y = planned.propRandoms[1] * Math.PI * 2
      scene.add(thicket)
      spawnerMeshes.push(thicket)
      spawnerMeshById.set(spawner.id, thicket)
    } else if (spec.type === 'wolfDen') {
      // Reuses the cave-mouth prop (no dedicated den asset yet — plan 093
      // Etap E keeps this deliberately simple; a real `CaveVolume` (plan 104)
      // could replace this visual later without touching the den's identity/
      // quest contract). No terrain carving — that's cave-specific (083).
      const facingVillage = Math.atan2(pos.x - group.center.x, pos.z - group.center.z)
      const mouth = createCaveMouth(1, planned.propRandoms[0])
      mouth.position.set(pos.x, groundY, pos.z)
      mouth.rotation.y = facingVillage
      scene.add(mouth)
      spawnerMeshes.push(mouth)
      spawnerMeshById.set(spawner.id, mouth)
    }

    // A restored `disabled`/`recovering` point looks freshly-burned again on
    // reload/rebuild instead of a mismatched pristine prop — same visual as
    // `destroySpawner()` below, reapplied rather than duplicated. This replay
    // is driven entirely by the already-separately-persisted
    // `SavedSpawnPointState`, so it's `'system'` (never itself persisted) —
    // `destroySpawner()`'s own scorch below is the genuine player-caused one.
    // Generic population fill happens after all spawners exist and after
    // persistent occupants are restored (plan fauna-018).
    if (spawner.state === 'disabled' || spawner.state === 'recovering') {
      const mesh = spawnerMeshById.get(spawner.id)
      if (mesh) tintPropMaterials(mesh, BURNED_SPAWNER_TINT_HEX)
      if (!terrainEditedKeys.has(`${spawner.id}:scorch`)) {
        terrainEditedKeys.add(`${spawner.id}:scorch`)
        if (terrainCarving?.scorchTerrain) {
          terrainCarving.scorchTerrain(spawner.x, spawner.z, BURN_PATCH_RADIUS, BURN_PATCH_DEPTH, 'system')
        } else {
          terrainCarving?.modifyTerrain(spawner.x, spawner.z, BURN_PATCH_RADIUS, BURN_PATCH_DEPTH, 'system')
        }
      }
    }

    const el = document.createElement('div')
    el.className = 'npc-label'
    el.textContent = SPAWNER_LABELS[spec.type]
    const label = new CSS2DObject(el)
    const labelH = spec.type === 'rockDen' || spec.type === 'wolfDen'
      ? CAVE_LABEL_HEIGHT
      : spec.type === 'thicket'
        ? THICKET_LABEL_HEIGHT
        : DEFAULT_SPAWNER_LABEL_HEIGHT
    label.position.set(pos.x, groundY + labelH, pos.z)
    scene.add(label)
    spawnerLabels.push({ id: spawner.id, type: spec.type, object: label, el, marker: null, lastOpacity: -1 })
  }

  /** Creates `count` ordinary animals bound to `habitat` (initial fill and group
   *  re-materialization). Only the home build feeds the quest wolf-den tracker. */
  const spawnHabitatPopulation = (habitat: PreySpawner, count: number, trackDenWolves: boolean): void => {
    for (let i = 0; i < count; i++) {
      const spot = findWalkableNearSpawner(habitat, 0, 4) ?? habitat
      const variant = habitat.type === 'wolfDen' ? wolfDenInitialFillVariant(i) : undefined
      const agent = spawnBirth(habitat, spot.x, spot.z, 'fill', variant)
      scene.add(agent.mesh)
      agents.push(agent)
      if (trackDenWolves && habitat.type === 'wolfDen') denWolfAnimalIds.add(agent.animalId)
    }
  }

  /** Removes one spawner's prop and label (group dematerialization). */
  const removeSpawnerVisuals = (id: string): void => {
    const mesh = spawnerMeshById.get(id)
    if (mesh) {
      mesh.removeFromParent()
      disposeObject3D(mesh)
      const i = spawnerMeshes.indexOf(mesh)
      if (i >= 0) spawnerMeshes.splice(i, 1)
      spawnerMeshById.delete(id)
    }
    const li = spawnerLabels.findIndex((entry) => entry.id === id)
    if (li >= 0) {
      const [{ object, el }] = spawnerLabels.splice(li, 1)
      object.removeFromParent()
      el.remove()
    }
  }

  const groupAgents = (group: HabitatGroupRecord): AnimalAgent[] =>
    agents.filter((a) =>
      group.ringAnimalIds.has(a.animalId) || (a.spawnPointId !== undefined && group.spawnerIds.has(a.spawnPointId)))

  /** Fills a freshly (re)materialized group's spawners from the carried/virtual state. */
  const fillGroupPopulation = (group: HabitatGroupRecord): void => {
    // Records already exist: `restoreGroupFromRecords` consumes the caught-up bounds instead.
    if (group.fromRecords) return
    for (const id of group.spawnerIds) {
      const habitat = spawnerById.get(id)
      if (!habitat) continue
      const count = materializedPopulation(habitat, group.virtualBounds.get(id), occupantRegistry.slotCountFor(id))
      spawnHabitatPopulation(habitat, count, group.pinned)
    }
    group.virtualBounds.clear()
  }

  /** Re-creates a dormant record's agent (fauna-050 C1.8): same durable id and constructor
   *  inputs, then `hydrate`. The record stays in the registry; the live agent is authoritative. */
  const promoteRecord = (record: WildFaunaRecord, group: HabitatGroupRecord): void => {
    const boundSpawner = spawnerById.get(record.habitatId)
    const isRing = record.origin === 'ring'
    const agent = spawnAgent(
      record.kind, record.state.x, record.state.z, record.herdId, undefined, undefined,
      isRing || !boundSpawner ? undefined : boundSpawner.id,
      record.animalId, undefined, record.variant,
      { habitatId: record.habitatId, occupantKey: record.occupantKey, origin: record.origin, sex: record.sex },
    )
    agent.hydrate(record.state)
    scene.add(agent.mesh)
    agents.push(agent)
    if (isRing) group.ringAnimalIds.add(agent.animalId)
  }

  /** Promotes every dormant record inside the group's activation disk, then tops a carried
   *  spawner up to its caught-up population with new births (interim until C3 `advance`). */
  const restoreGroupFromRecords = (group: HabitatGroupRecord, denRing: readonly [number, number]): void => {
    const live = new Set(agents.map((a) => a.animalId))
    const radius = group.footprintRadius + denRing[1] + ACTIVATION_MARGIN
    for (const record of wildRegistry.inDisk(group.center.x, group.center.z, radius, (id) => !live.has(id))) {
      promoteRecord(record, group)
    }
    for (const id of group.spawnerIds) {
      const habitat = spawnerById.get(id)
      const virtual = group.virtualBounds.get(id)
      if (!habitat || virtual === undefined) continue
      const target = materializedPopulation(habitat, virtual, occupantRegistry.slotCountFor(id))
      const alive = wildRegistry.forHabitat(id).filter((r) => !r.state.health.dead).length
      for (let i = alive; i < target; i++) {
        const spot = findWalkableNearSpawner(habitat, 0, 4) ?? habitat
        const agent = spawnBirth(habitat, spot.x, spot.z, 'birth')
        scene.add(agent.mesh)
        agents.push(agent)
      }
    }
    group.virtualBounds.clear()
  }

  const doMaterializeGroup = (input: FaunaHabitatGroupInput, nowDays: number): void => {
    let group = groups.get(input.groupId)
    if (!group) {
      group = {
        id: input.groupId,
        pinned: false,
        center: { x: input.center.x, z: input.center.z },
        footprintRadius: input.footprintRadius,
        roadSegments: input.roadSegments ?? [],
        plan: null,
        materialized: false,
        spawnerIds: new Set(),
        ringAnimalIds: new Set(),
        virtualBounds: new Map(),
        fromRecords: wildRegistry.isGroupInitialized(input.groupId),
      }
      groups.set(input.groupId, group)
    }
    const target = group
    target.materialized = true
    if (target.plan) {
      // Same sites as the first time: replay the cached plan, no re-sampling of (possibly carved) terrain.
      spawnRing(target.plan.ring, target)
      for (const planned of target.plan.spawners) materializeSpawner(planned, target, nowDays)
    } else {
      // Plan against frozen inputs (no per-site hooks), then apply ring and terrain edits,
      // so a site's carving never feeds the next site's samples (review 035 R7).
      const groupRoadTest = (x: number, z: number): boolean =>
        isNearRoadCorridor(x, z, target.roadSegments, SPAWNER_ROAD_CLEARANCE)
      target.plan = planSettlementFaunaHabitats({
        settlementId: input.groupId,
        center: target.center,
        footprintRadius: input.footprintRadius,
        homeRadius,
        random: settlementFaunaSiteRandom(seed, input.groupId),
        denRing: input.denRing,
        ringSpecs: SPAWNS,
        spawnerSpecs: SPAWNER_SPECS,
        isDry: drySpawnSite,
        onRoad: groupRoadTest,
        spawnerSiteOk: spawnerSiteOkFor(groupRoadTest),
        ringHabitatFilter: habitatFilterFor,
        sampleHeight,
        sampleForestFactor,
        denAvoidPoints,
      })
      spawnRing(target.plan.ring, target)
      for (const planned of target.plan.spawners) materializeSpawner(planned, target, nowDays)
    }
    fillGroupPopulation(target)
    if (target.fromRecords) restoreGroupFromRecords(target, input.denRing ?? HOME_DEN_RING)
    else {
      wildRegistry.markGroupInitialized(target.id, nowDays)
      target.fromRecords = true
    }
  }

  const doDematerializeGroup = (group: HabitatGroupRecord, nowDays: number): void => {
    const members = groupAgents(group)
    // Persistent occupants (none are declared for non-home groups today) must not be lost with the group.
    occupantRegistry.capture(members.filter((a) => occupantRegistry.hasPersistentAnimalId(a.animalId)))
    // Lossless demote (fauna-050 C2): every generated individual becomes a dormant record, corpses included.
    for (const a of members) {
      const record = recordOf(a, nowDays)
      if (record) wildRegistry.set(record)
      wildMeta.delete(a.animalId)
    }
    for (const id of group.spawnerIds) {
      const spawner = spawnerById.get(id)
      if (!spawner) continue
      let bound = 0
      for (const a of members) {
        if (!a.isDead() && a.def.kind === spawner.kind && a.spawnPointId === id && !occupantRegistry.hasPersistentAnimalId(a.animalId)) bound++
      }
      carried.carry(spawner, bound, nowDays)
      const index = spawners.indexOf(spawner)
      if (index >= 0) spawners.splice(index, 1)
      spawnerById.delete(id)
      spawnerGroupById.delete(id)
      habitatPressureCache.delete(id)
      settlementTripAnimalBySpawner.delete(id)
      removeSpawnerVisuals(id)
    }
    const memberSet = new Set(members)
    for (const a of members) {
      animalToSpawner.delete(a.animalId)
      disposeAgent(a)
    }
    agents = agents.filter((a) => !memberSet.has(a))
    group.spawnerIds.clear()
    group.ringAnimalIds.clear()
    group.virtualBounds.clear()
    group.materialized = false
  }

  // `animals` also gates habitat spawners (cave/thicket/wolfDen) — when off, no
  // respawn/replenishment can occur either.
  bootMark('habitatSpawners')
  try {
  const animalsOn = isSystemEnabled('animals')
  const homeGroup: HabitatGroupRecord = {
    id: settlementId,
    pinned: true,
    center: { x: settlementCenter.x, z: settlementCenter.z },
    footprintRadius,
    roadSegments,
    plan: null,
    materialized: true,
    spawnerIds: new Set(),
    ringAnimalIds: new Set(),
    virtualBounds: new Map(),
    fromRecords: animalsOn && wildRegistry.isGroupInitialized(settlementId),
  }
  groups.set(settlementId, homeGroup)
  const plan = planSettlementFaunaHabitats({
    settlementId,
    center: { x: settlementCenter.x, z: settlementCenter.z },
    footprintRadius,
    homeRadius,
    random,
    ringSpecs: animalsOn ? SPAWNS : [],
    spawnerSpecs: animalsOn ? SPAWNER_SPECS : [],
    isDry: drySpawnSite,
    onRoad,
    spawnerSiteOk,
    ringHabitatFilter: habitatFilterFor,
    sampleHeight,
    sampleForestFactor,
    denAvoidPoints,
    onRingPlanned: (ring) => spawnRing(ring, homeGroup),
    onSpawnerPlaced: (planned) => materializeSpawner(planned, homeGroup, 0),
  })
  homeGroup.plan = plan
  placedSpawnPoints.push(...plan.placedSpawnPoints)

  for (const extra of extraHabitatSpawners ?? []) {
    if (!spawnerSiteOk(extra.x, extra.z)) continue
    const spawner: PreySpawner = {
      x: extra.x,
      z: extra.z,
      type: extra.type,
      kind: extra.kind,
      respawnIntervalDays: extra.respawnIntervalDays,
      maxPreyCount: extra.maxPreyCount,
      id: extra.id,
      daysSinceLastRespawn: 0,
      state: 'active',
      deathsThisCycle: 0,
      disabledAtDay: null,
      depletedRecoveryDays: 0,
      ...defaultSpawnPointScenarioFields(extra.type),
    }
    restoreSpawnPointState(spawner, carried.take(spawner.id)?.saved)
    spawners.push(spawner)
    spawnerById.set(spawner.id, spawner)
    const groundY = sampleHeight(extra.x, extra.z)
    const facing = Math.atan2(extra.x - settlementCenter.x, extra.z - settlementCenter.z)
    const mouth = createCaveMouth(1, random())
    mouth.position.set(extra.x, groundY, extra.z)
    mouth.rotation.y = facing
    scene.add(mouth)
    spawnerMeshes.push(mouth)
    spawnerMeshById.set(spawner.id, mouth)
    const el = document.createElement('div')
    el.className = 'npc-label'
    el.textContent = SPAWNER_LABELS[extra.type]
    const label = new CSS2DObject(el)
    label.position.set(extra.x, groundY + CAVE_LABEL_HEIGHT, extra.z)
    scene.add(label)
    spawnerLabels.push({ id: extra.id, type: extra.type, object: label, el, marker: null, lastOpacity: -1 })
  }

  if (isSystemEnabled('animals') && (closedSettlements?.length ?? 0) > 0) {
    const pressure = resolveClosedPredatorPressure(
      spawners.map((spawner) => ({
        id: spawner.id,
        x: spawner.x,
        z: spawner.z,
        type: spawner.type,
        kind: spawner.kind,
        maxPreyCount: spawner.maxPreyCount,
      })),
      closedSettlements ?? [],
    )
    for (const bump of pressure.capacityBumps) {
      const spawner = spawnerById.get(bump.id)
      if (!spawner || !canBumpClosedPressureSpawner(spawner)) continue
      spawner.maxPreyCount = bump.maxPreyCount
    }
    for (const extra of pressure.extraSpawners) {
      const rng = createSeededRandom(closedPressurePlacementSeed(seed, extra.id))
      // Closed-settlement pressure dens keep the near ring (not part of Q100).
      const minDist = extra.footprintRadius + SPAWNER_RING_OFFSET[0]
      const maxDist = extra.footprintRadius + SPAWNER_RING_OFFSET[1]
      const filter = (x: number, z: number) => spawnerSiteOk(x, z) && farFromOtherSpawns(x, z)
      const slopedFilter = (x: number, z: number) =>
        filter(x, z) && measureSlope(x, z, CAVE_SLOPE_SAMPLE_RADIUS, sampleHeight).drop >= CAVE_MIN_SLOPE_DROP
      const pos = findWalkableNear(extra.x, extra.z, minDist, maxDist, slopedFilter, 72, rng)
        ?? findWalkableNear(extra.x, extra.z, minDist, maxDist, filter, 72, rng)
      if (!pos) continue
      placedSpawnPoints.push(pos)
      const spawner: PreySpawner = {
        ...pos,
        type: extra.type,
        kind: extra.kind,
        respawnIntervalDays: extra.respawnIntervalDays,
        maxPreyCount: extra.maxPreyCount,
        id: extra.id,
        daysSinceLastRespawn: 0,
        state: 'active',
        deathsThisCycle: 0,
        disabledAtDay: null,
        depletedRecoveryDays: 0,
        ...defaultSpawnPointScenarioFields(extra.type),
      }
      restoreSpawnPointState(spawner, carried.take(spawner.id)?.saved)
      spawners.push(spawner)
      spawnerById.set(spawner.id, spawner)

      const groundY = sampleHeight(pos.x, pos.z)
      const slope = measureSlope(pos.x, pos.z, CAVE_SLOPE_SAMPLE_RADIUS, sampleHeight)
      const facingVillage = Math.atan2(pos.x - extra.x, pos.z - extra.z)
      if (
        extra.type === 'rockDen'
        && terrainCarving
        && terrainCarving.sampleMountainRidge(pos.x, pos.z) <= CAVE_ROCK_MOUNTAIN_RIDGE_THRESHOLD
      ) {
        terrainCarving.modifyTerrain(pos.x, pos.z, CAVE_DEPRESSION_RADIUS, CAVE_DEPRESSION_DEPTH, 'system')
      }
      const mouth = createCaveMouth(1, rng())
      mouth.position.set(pos.x, groundY, pos.z)
      mouth.rotation.y = slope.drop >= CAVE_MIN_SLOPE_DROP ? slope.yaw : facingVillage
      scene.add(mouth)
      spawnerMeshes.push(mouth)
      spawnerMeshById.set(spawner.id, mouth)

      if (spawner.state === 'disabled' || spawner.state === 'recovering') {
        tintPropMaterials(mouth, BURNED_SPAWNER_TINT_HEX)
        if (terrainCarving?.scorchTerrain) {
          terrainCarving.scorchTerrain(spawner.x, spawner.z, BURN_PATCH_RADIUS, BURN_PATCH_DEPTH, 'system')
        } else {
          terrainCarving?.modifyTerrain(spawner.x, spawner.z, BURN_PATCH_RADIUS, BURN_PATCH_DEPTH, 'system')
        }
      }

      const el = document.createElement('div')
      el.className = 'npc-label'
      el.textContent = SPAWNER_LABELS[extra.type]
      const label = new CSS2DObject(el)
      label.position.set(pos.x, groundY + CAVE_LABEL_HEIGHT, pos.z)
      scene.add(label)
      spawnerLabels.push({ id: extra.id, type: extra.type, object: label, el, marker: null, lastOpacity: -1 })
    }
  }

  // Persistent occupants first (plan fauna-018) — tombstone skips, hydrate
  // before the first update, fresh spawn only on an active habitat. Generic
  // fill below uses the remaining ordinary capacity so the reserved slot
  // cannot become `maxPreyCount + 1`.
  for (const decl of occupantDecls) {
    const caveBinding = caveHabitatBindings.get(decl.habitatId)
    if (caveBinding) {
      // Cave-backed habitat (plan fauna-019 §9) — no `PreySpawner` stands in
      // for the physical cave, so a missing/unresolvable descriptor fails
      // safely (no resident this build) rather than falling back to a
      // spawner lookup or a stale/(0,0) position.
      if (!caveWorld) continue
      const resolved = resolveAnimalCaveHabitat(caveBinding, caveWorld, animalCaveEntityDimensions(ANIMAL_DEFS[decl.kind]))
      if (!resolved) continue
      const action = occupantRegistry.restoreAction(decl)
      if (action.type === 'skip' || action.type === 'mismatch') continue
      const animalId = persistentAnimalId(decl.habitatId, decl.occupantKey)
      const agent = spawnAgent(
        decl.kind,
        resolved.context.home.x,
        resolved.context.home.z,
        undefined,
        undefined,
        undefined,
        undefined,
        animalId,
        resolved.context,
      )
      if (action.type === 'hydrate') agent.hydrate(action.record.state)
      scene.add(agent.mesh)
      agents.push(agent)
      continue
    }
    const habitat = spawnerById.get(decl.habitatId)
    if (!habitat) continue
    const action = occupantRegistry.restoreAction(decl)
    if (action.type === 'skip' || action.type === 'mismatch') continue
    if (action.type === 'fresh' && habitat.state !== 'active') continue
    const animalId = persistentAnimalId(decl.habitatId, decl.occupantKey)
    const spot = findWalkableNear(habitat.x, habitat.z, 0, 4) ?? habitat
    const agent = spawnAgent(
      decl.kind,
      spot.x,
      spot.z,
      undefined,
      undefined,
      undefined,
      habitat.id,
      animalId,
    )
    if (action.type === 'hydrate') agent.hydrate(action.record.state)
    scene.add(agent.mesh)
    agents.push(agent)
  }

  // Ordinary habitat population (plan 139) — tagged with `spawnPointId` so
  // deaths count toward depletion. A restored depleted/disabled/recovering
  // point stays empty until `tickSpawnPointRecovery`.
  if (homeGroup.fromRecords) {
    restoreGroupFromRecords(homeGroup, HOME_DEN_RING)
    // `isWolfDenCleared()` stays derivable: the initial pack's ids are `b0..b(n-1)`; a removed
    // record simply is not among the live agents (fauna-050 C1.2).
    for (const habitat of spawners) {
      if (habitat.type !== 'wolfDen') continue
      const initial = ordinaryHabitatCapacity(habitat.maxPreyCount, occupantRegistry.slotCountFor(habitat.id))
      for (let i = 0; i < initial; i++) denWolfAnimalIds.add(birthAnimalId(habitat.id, i))
    }
  } else {
    for (const habitat of spawners) {
      if (habitat.state !== 'active') continue
      const ordinary = ordinaryHabitatCapacity(
        habitat.maxPreyCount,
        occupantRegistry.slotCountFor(habitat.id),
      )
      spawnHabitatPopulation(habitat, ordinary, true)
    }
    if (animalsOn) {
      wildRegistry.markGroupInitialized(settlementId, 0)
      homeGroup.fromRecords = true
    }
  }
  } finally {
    bootMarkEnd('habitatSpawners')
  }

  /** Last in-game day (floored) recovery was checked — guards the
   *  `disabled`/`recovering` scan below to at most once per in-game day
   *  (plan 125 §9), not per frame. `-1` so the first `update()` call always
   *  runs it once regardless of the starting `worldDays`. */
  let lastRecoveryCheckDay = -1
  /** Previous `worldDays` seen by `update()` — first frame after create/load
   *  contributes `dayDelta = 0` so a restored `elapsedDays` does not dump a
   *  backlog of animals (plan 139). */
  let lastWorldDays: number | null = null

  return {
    update(
      dt,
      observerPos,
      timeOfDay,
      worldDays,
      litFires,
      villages,
      huntableLivestock,
      nearbyHumanCount = 1,
      onHumanHit,
      playerStealth,
      nearbyNpcs,
      onNpcHit,
      onAnimalAggro,
      onAnimalVocalize,
      attractionSources = [],
      consumeAttractedFood,
      peekAttractedFood,
      onAttractedFoodConsumed,
      worldSeed,
      playerObservation,
    ) {
      if (pendingDematerialize.size > 0) {
        // At most one group per frame (amortized cost, plan fauna-050 workload budget).
        for (const [groupId, waited] of pendingDematerialize) {
          pendingDematerialize.set(groupId, waited + dt)
        }
        for (const [groupId, waited] of pendingDematerialize) {
          const group = groups.get(groupId)
          if (!group || !group.materialized) {
            pendingDematerialize.delete(groupId)
            continue
          }
          if (waited >= ENGAGED_DEMATERIALIZE_TIMEOUT_SEC || !isGroupEngaged(groupAgents(group).map(engagementOf))) {
            pendingDematerialize.delete(groupId)
            doDematerializeGroup(group, worldDays)
            break
          }
        }
      }
      const dayFactor = skyParamsFromTime(timeOfDay).dayFactor
      const agentCpu = getAgentCpuDiag()
      const diagOn = agentCpu.isEnabled()
      const proximityT0 = diagOn ? performance.now() : 0
      // fauna-042 snapshot: one rebuild, then every wild agent updates
      // against that bucket snapshot plus live positions. Physical removal
      // and managed-spawner respawn run only after this loop so a later
      // agent still sees current `health.dead` / carcass state and a
      // same-pass spawn is not required to appear in the index.
      proximity.rebuild(agents)
      if (diagOn) agentCpu.addFaunaProximityRebuildMs(performance.now() - proximityT0)
      agentCpu.beginFaunaAgentUpdates()
      for (const a of agents) {
        // `forestSampling` (fauna-cpu-diagnostics): caller-side environment
        // sampling that runs ahead of `AnimalAgent.update()` itself, but
        // still inside this loop's `faunaAgentUpdatesMs` window — measured
        // separately so the diagnostic report can show how much of that
        // total is spent here vs. inside the agent's own update.
        const forestSampleT0 = diagOn ? performance.now() : 0
        const forestFactor = sampleForestFactor(a.mesh.position.x, a.mesh.position.z)
        if (diagOn) {
          agentCpu.addFaunaForestSamplingMs(performance.now() - forestSampleT0)
          agentCpu.recordForestSample()
        }
        // Den-defense habitat context (plan fauna-034 §6/§8) — the O(1)
        // `spawnerById` lookup existing spawner lifecycle already uses,
        // adapted to plain data; gated on `def.territorial` so a non-
        // territorial agent (the vast majority) never even does the lookup.
        const territorialHabitat = a.def.territorial && a.spawnPointId
          ? spawnerById.get(a.spawnPointId)
          : undefined
        a.update({
          dt,
          others: agents,
          proximity,
          observerPos,
          dayFactor,
          forestFactor,
          litFires,
          villages,
          huntableLivestock,
          nearbyHumanCount,
          onHumanHit,
          playerStealth,
          nearbyNpcs,
          onNpcHit,
          onAggro: onAnimalAggro,
          habitat: territorialHabitat
            ? {
              id: territorialHabitat.id,
              type: territorialHabitat.type,
              x: territorialHabitat.x,
              z: territorialHabitat.z,
              state: territorialHabitat.state,
            }
            : undefined,
          // Wild fauna's only spontaneous-vocalization kind is `wolf` (howl,
          // plan fauna-009) — cow/sheep/chicken/rooster never spawn here,
          // only via `settlement/livestock.ts` (`createSettlement.ts`).
          onVocalize: onAnimalVocalize,
          nowDays: worldDays,
          timeOfDay,
          grassForage,
          waterSourceProvider,
          attractionSources,
          consumeAttractedFood,
          peekAttractedFood,
          onAttractedFoodConsumed,
          worldSeed,
          playerObservation,
        })
      }
      agentCpu.endFaunaAgentUpdates()
      grassForage?.tickVisuals(dt, observerPos.x, observerPos.z, worldDays)

      if (agents.some((a) => a.readyToRemove())) {
        const alive: AnimalAgent[] = []
        for (const a of agents) {
          if (a.readyToRemove()) {
            const slot = occupantRegistry.slotKeyForAnimalId(a.animalId)
            if (slot) occupantRegistry.markRemoved(slot)
            // Removal deletes the durable record without a tombstone (fauna-050 C1.5).
            if (wildMeta.delete(a.animalId)) wildRegistry.remove(a.animalId)
            disposeAgent(a)
          }
          else alive.push(a)
        }
        agents = alive
      }

      if (lastWorldDays === null) lastWorldDays = worldDays
      const dayDelta = Math.max(0, worldDays - lastWorldDays)
      lastWorldDays = worldDays
      const spawnerT0 = diagOn ? performance.now() : 0
      if (dayDelta > 0) {
        boundOccupancyCounts.clear()
        for (const a of agents) {
          if (a.isDead() || !a.spawnPointId || occupantRegistry.hasPersistentAnimalId(a.animalId)) continue
          boundOccupancyCounts.set(a.spawnPointId, (boundOccupancyCounts.get(a.spawnPointId) ?? 0) + 1)
        }
      }
      const materializeManagedSpawnerAnimal = (spawner: PreySpawner): boolean => {
        const pos = resolveWildFaunaSpawnPosition(
          findWalkableNearSpawner(spawner, 0, 4),
          spawner,
          drySpawnSite(spawner.x, spawner.z, SPAWN_RIVER_CLEARANCE),
        )
        if (!pos) return false
        const agent = spawnBirth(spawner, pos.x, pos.z, 'birth')
        scene.add(agent.mesh)
        agents.push(agent)
        boundOccupancyCounts.set(spawner.id, (boundOccupancyCounts.get(spawner.id) ?? 0) + 1)
        return true
      }
      const boundCountForSpawner = (spawner: PreySpawner) => boundOccupancyCounts.get(spawner.id) ?? 0
      updateSpawners(
        spawners,
        dayDelta,
        boundCountForSpawner,
        materializeManagedSpawnerAnimal,
        reservedPersistentSlots,
      )
      updateDepletedSpawnerRecovery(
        spawners,
        dayDelta,
        boundCountForSpawner,
        materializeManagedSpawnerAnimal,
        reservedPersistentSlots,
      )
      if (diagOn) agentCpu.addFaunaSpawnerBookkeepingMs(performance.now() - spawnerT0)

      // Recovery check (plan 125 §8) — at most once per in-game day, and
      // only for spawners actually waiting on it (`disabled`/`recovering`);
      // `tickSpawnPointRecovery` itself no-ops for every other state. Nearby
      // same-kind count reuses `agents` (already iterated above), scoped to
      // `SPAWNER_RADIUS` — no independent per-frame scan.
      const dayIndex = Math.floor(worldDays)
      if (dayIndex !== lastRecoveryCheckDay) {
        lastRecoveryCheckDay = dayIndex
        for (const spawner of spawners) {
          if (spawner.type === 'wolfDen') {
            // Q142-a (b): the wolf-den problem scenario is home-only for now.
            const denGroup = spawnerGroupById.get(spawner.id)
            const tripGroup = denGroup ?? groups.get(settlementId)!
            if ((!denGroup || denGroup.pinned) && shouldActivateWolfDenProblem(spawner, dayIndex)) {
              activateWolfDenProblem(spawner)
              const targetCap = effectiveMaxPreyCount(spawner)
              let nearby = 0
              for (const a of agents) {
                if (a.isDead() || a.spawnPointId !== spawner.id) continue
                nearby++
              }
              while (nearby < targetCap && spawner.state === 'active') {
                const spot = resolveWildFaunaSpawnPosition(
                  findWalkableNearSpawner(spawner, 0, 4),
                  spawner,
                  drySpawnSite(spawner.x, spawner.z, SPAWN_RIVER_CLEARANCE),
                )
                if (!spot) break
                const agent = spawnBirth(spawner, spot.x, spot.z, 'birth')
                scene.add(agent.mesh)
                agents.push(agent)
                nearby++
              }
            }
            const activeTripAnimalId = settlementTripAnimalBySpawner.get(spawner.id)
            const tripAnimal = activeTripAnimalId
              ? agents.find((a) => a.animalId === activeTripAnimalId && !a.isDead())
              : undefined
            if (!tripAnimal || !tripAnimal.hasActiveTrip()) {
              if (activeTripAnimalId) settlementTripAnimalBySpawner.delete(spawner.id)
              if (canOfferSettlementTrip(spawner, worldDays)) {
                const traveller = agents.find(
                  (a) => !a.isDead()
                    && a.spawnPointId === spawner.id
                    && a.def.kind === 'wolf'
                    && !a.hasActiveTrip(),
                )
                const destination = findSettlementOutskirtsDestination(
                  { x: tripGroup.center.x, z: tripGroup.center.z },
                  tripGroup.footprintRadius + 6,
                  sampleHeight,
                  waterLevel,
                  (x, z) => sampleHeight(x, z) > waterLevel + 0.6,
                  random,
                )
                if (traveller && destination && traveller.startSettlementDirectedTrip(destination, SETTLEMENT_TRIP_STAY_SEC)) {
                  recordSettlementTripOpportunity(spawner, worldDays)
                  settlementTripAnimalBySpawner.set(spawner.id, traveller.animalId)
                }
              }
            }
          }
          if (spawner.state !== 'disabled' && spawner.state !== 'recovering') continue
          let nearby = 0
          for (const a of agents) {
            if (a.isDead() || a.def.kind !== spawner.kind) continue
            if (Math.hypot(a.mesh.position.x - spawner.x, a.mesh.position.z - spawner.z) < SPAWNER_RADIUS) nearby++
          }
          tickSpawnPointRecovery(spawner, worldDays, nearby)
        }
      }

      for (const entry of spawnerLabels) {
        const opacity = labelOpacityForDistance(entry.object.position.distanceTo(observerPos))
        if (opacity === entry.lastOpacity) continue
        entry.lastOpacity = opacity
        entry.el.style.opacity = String(opacity)
      }
    },
    resolveTimeSkip(hours, dayLengthSec) {
      const elapsedSeconds = gameHoursToRealSeconds(hours, dayLengthSec)
      for (const a of agents) a.resolveTimeSkip(elapsedSeconds)
    },
    dispose() {
      pendingDematerialize.clear()
      for (const group of groups.values()) {
        group.materialized = false
        group.spawnerIds.clear()
        group.ringAnimalIds.clear()
      }
      for (const a of agents) disposeAgent(a)
      agents = []
      for (const mesh of spawnerMeshes) {
        mesh.removeFromParent()
        disposeObject3D(mesh)
      }
      spawnerMeshes.length = 0
      for (const { object, el } of spawnerLabels) {
        object.removeFromParent()
        el.remove()
      }
      spawnerLabels.length = 0
    },
    getAgents: () => agents,
    getSpawners: () => spawners,
    snapshotSpawnPoints: () => carried.snapshot(spawners),
    materializeGroup(input, nowDays) {
      if (!isSystemEnabled('animals') || !isSystemEnabled('worldFaunaHabitats')) return false
      const existing = groups.get(input.groupId)
      if (existing?.pinned) return false
      if (existing?.materialized) {
        pendingDematerialize.delete(input.groupId)
        return true
      }
      doMaterializeGroup(input, nowDays)
      return true
    },
    dematerializeGroup(groupId, nowDays) {
      const group = groups.get(groupId)
      if (!group || !group.materialized) return 'unknown'
      if (group.pinned) return 'pinned'
      if (isGroupEngaged(groupAgents(group).map(engagementOf))) {
        if (!pendingDematerialize.has(groupId)) pendingDematerialize.set(groupId, 0)
        return 'deferred'
      }
      pendingDematerialize.delete(groupId)
      doDematerializeGroup(group, nowDays)
      return 'done'
    },
    isGroupMaterialized: (groupId) => groups.get(groupId)?.materialized === true,
    getMaterializedGroupIds: () => [...groups.values()].filter((g) => g.materialized).map((g) => g.id),
    isWolfDenCleared() {
      if (denWolfAnimalIds.size === 0) return false
      for (const a of agents) {
        if (denWolfAnimalIds.has(a.animalId) && !a.isDead()) return false
      }
      return true
    },
    setSpawnerMarker(spawnerId, marker) {
      for (const entry of spawnerLabels) {
        if (entry.id !== spawnerId || entry.marker === marker) continue
        entry.marker = marker
        entry.el.textContent = marker
          ? `${SPAWNER_LABELS[entry.type]} · ${marker}`
          : SPAWNER_LABELS[entry.type]
      }
    },
    destroySpawner(spawnerId, nowDays) {
      const spawner = spawnerById.get(spawnerId)
      if (!spawner || spawner.state !== 'depleted') return false
      spawner.state = 'disabled'
      spawner.disabledAtDay = nowDays
      spawner.depletedRecoveryDays = 0
      const mesh = spawnerMeshById.get(spawnerId)
      if (mesh) tintPropMaterials(mesh, BURNED_SPAWNER_TINT_HEX)
      // The genuine player action ("[E] Zniszcz") — persisted, unlike the
      // restore-replay above.
      terrainEditedKeys.add(`${spawnerId}:scorch`)
      if (terrainCarving?.scorchTerrain) {
        terrainCarving.scorchTerrain(spawner.x, spawner.z, BURN_PATCH_RADIUS, BURN_PATCH_DEPTH, 'player')
      } else {
        terrainCarving?.modifyTerrain(spawner.x, spawner.z, BURN_PATCH_RADIUS, BURN_PATCH_DEPTH, 'player')
      }
      return true
    },
    isQuestSpawnPointPermanentlyDestroyed(questSpawnerId: string) {
      return isQuestSpawnPointPermanentlyDestroyed(spawners, questSpawnerId)
    },
    snapshotPersistentOccupants() {
      occupantRegistry.capture(agents.filter((a) => occupantRegistry.hasPersistentAnimalId(a.animalId)))
      // Live agents are authoritative: refresh their records, then one serialize path for save and rebuild.
      const nowDays = lastWorldDays ?? 0
      for (const a of agents) {
        const record = recordOf(a, nowDays)
        if (record) wildRegistry.set(record)
      }
      const wild = wildRegistry.serialize()
      return {
        ...occupantRegistry.serialize(),
        ...(wild.groups.length > 0 || wild.records.length > 0 ? { wild } : {}),
      }
    },
    getHabitatPressure(spawnerId, nowDays) {
      return resolveHabitatPressure({
        spawnerId,
        nowDays,
        cache: habitatPressureCache,
        getSpawner: (id) => spawnerById.get(id),
        agents,
        slotCountFor: (habitatId) => occupantRegistry.slotCountFor(habitatId),
        queryForage: queryHabitatForage,
      })
    },
  }
}
