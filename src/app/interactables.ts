import type { PreySpawner } from '../fauna/AnimalSpawner'
import type { Fauna } from '../fauna/createFauna'
import type { Interactable, InteractablePayload, WorldItemRef } from '../interaction/Interactable'
import type { DroppedItem, DroppedItems } from '../items/createDroppedItems'
import type { ItemSpawners } from '../items/createItemSpawners'
import type { PlacedTents } from '../items/createPlacedTents'
import type { ToolKind } from '../items/HeldTool'
import type { SaveItemInstance } from '../items/Inventory'
import type { ItemInstance } from '../items/itemInstances'
import type { Settlement } from '../settlement/createSettlement'
import type { LandOwnershipRegistry } from '../settlement/landOwnership'
import type { SettlementStructureState } from '../settlement/structureCondition'
import type { ChunkManager } from '../terrain/chunkManager'
import type { ResourceDeposits } from '../terrain/resourceDeposits'
import type { RiverHydrologyContext } from '../terrain/riverNetwork'
import type { Beehives } from '../world/createBeehives'
import type { DryingRacks } from '../world/createDryingRacks'
import type { Palisades } from '../world/createPalisades'
import type { PlacedContainers } from '../world/createPlacedContainers'
import type { PlacedTraps } from '../world/createPlacedTraps'
import type { PlayerGardens } from '../world/createPlayerGardens'
import type { PlayerTroughs } from '../world/createPlayerTroughs'
import type { PlayerWells } from '../world/createPlayerWells'
import type { ResidentialBuildings } from '../world/createResidentialBuildings'
import type { SleepingUtilities } from '../world/createSleepingUtilities'
import type { StandingTorches } from '../world/createStandingTorches'
import type { TerrainPreparations } from '../world/createTerrainPreparations'
import type { WorldGeneratedContainers } from '../world/worldGeneratedContainers'
import { ANIMAL_DEFS, ANIMAL_LABELS, type AnimalAgent, type AnimalKind } from '../fauna/AnimalAgent'
import { SPAWNER_LABELS, spawnerDestroyPromptLabel } from '../fauna/createFauna'
import { isMeleeTool } from '../fauna/faunaCombat'
import { containerGroundPrompt } from '../items/container'
import { type FoodBatch, type FreshnessStage, getFoodBatchFreshnessStage } from '../items/foodFreshness'
import { Inventory } from '../items/Inventory'
import { consumeVerbLabel, hasItemCapability, isRangedTool, ITEM_CATALOG } from '../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../items/items'
import { createAcquiredInstance } from '../items/trade'
import { type MeleeHitCandidate, pickCombatTarget } from '../player/playerMelee'
import { pastureTroughCanFill, pastureTroughPromptLabel } from '../settlement/pastureWater'
import { isPlayerPlacedFire, type PlacedFires } from '../settlement/PlacedFires'
import {
  hasActiveStructureRepair,
  isStructureRepairProblem,
  resolveStructureCondition,
  structureRepairPolicy,
} from '../settlement/structureCondition'
import { LANDMARK_LABELS } from '../terrain/chunkEnvironment'
import { ORE_YIELD_LABEL } from '../terrain/depositMining'
import { getDigProfileAt, getRockDigProfileAt } from '../terrain/dig'
import {
  isMedicinalForageKind,
  medicinalHerbInteractRange,
} from '../terrain/renewableWorldItems'
import { resolveWaterShore, type WaterShoreResult } from '../terrain/waterBodyKind'
import { TRAP_DEFS, type TrapKind, type TrapState } from '../world/animalTraps'
import { honeyAvailable } from '../world/beehives'
import { cartAcceptsAnimal } from '../world/cart'
import { CROP_DEFS, type CropGrowthStage, type CropId } from '../world/cropLifecycle'
import { isDryingComplete } from '../world/dryingRacks'
import { isPalisadeConstructionComplete, palisadePromptLabel } from '../world/palisade'
import { gardenPlotPromptLabel, resolveCultivationCare } from '../world/playerGarden'
import { isPlayerTroughConstructionComplete, playerTroughPromptLabel } from '../world/playerTrough'
import { isWellCompleted, isWellWaterAvailable, resolveWellRoofCondition, wellPromptLabel, wellWaterSource } from '../world/playerWell'
import {
  isPlayerOwnedResidentialBuilding,
  isResidentialBuildingComplete,
  residentialBuildingPromptLabel,
} from '../world/residentialBuilding'
import {
  spatialContextsEqual,
  WORLD_SPATIAL_CONTEXT_SURFACE,
  type WorldSpatialContext,
} from '../world/spatialContext'
import { isStandingTorchConstructionComplete, standingTorchPromptLabel } from '../world/standingTorch'
import { isChoppableStage } from '../world/treeLifecycle'
import { createWaterSource, type WaterQuality, type WaterSource } from '../world/WaterSource'
import { resolveCampInteractionMembers } from './campRestSnapshot'
import type { Vector3 } from 'three'

/** How close (world units) the player must be to an interactable before it's
 *  picked up by `[E]`. */
export const INTERACT_RANGE = 2.5
/** Minimum dot(playerForward, toTarget) to count as "looking at" — ~60° half-angle
 *  cone, needed so a dense cluster doesn't pick whichever is merely nearest. */
export const INTERACT_MIN_DOT = 0.5
/** Gaze-highlight range — deliberately larger than `INTERACT_RANGE` so the glow
 *  reads as an "approaching" cue before the `[E]` prompt appears. */
export const GAZE_RANGE = INTERACT_RANGE * 2
/** How far ahead (world units) of the player the shovel's synthetic dig
 *  target sits — inside `INTERACT_RANGE` so it's always within reach once
 *  offered; see `buildDigTarget`. */
export const DIG_REACH = 1.5
/** Melee target-acquisition range (plan 124 §1) — deliberately larger than
 *  `GAZE_RANGE` so `buildCombatTarget`'s forgiving fallback still finds a
 *  live animal even when the player isn't standing right on top of it.
 *  Independent of `MeleeConfig.range` (the actual weapon hit range, plan
 *  124 §2) and of `GAZE_RANGE` (shared by every other interactable kind). */
export const COMBAT_TARGET_RANGE = 7
/** How the player is aiming this session — a pointer/keyboard rig aims with
 *  the mouse-look yaw itself, a touch rig has to drag the same finger that
 *  also moves and attacks (plan 142). Only combat acquisition/facing branches
 *  on this; nothing else in the interaction pipeline does. */
export type CombatAimMode = 'pointer' | 'touch'

/** Target-acquisition cone per aim mode (plan 124 §1, plan 142 §1).
 *  `pointer` keeps the original 90° full cone (`cos(45°)`), already wider than
 *  `INTERACT_MIN_DOT`'s ~60° cone. `touch` widens it to ~168° full
 *  (`cos(~84°)`) so a tap doesn't require lining the body up with the joystick
 *  — still clearly directional, so an animal squarely to the side or behind the
 *  player is never acquired. Targets acquired beyond a weapon's own `arcDot`
 *  are made hittable by touch auto-facing (plan 142 §2), not by widening the
 *  hit arc. */
export const COMBAT_TARGET_CONE_DOT: Record<CombatAimMode, number> = {
  pointer: Math.SQRT1_2,
  touch: 0.1,
}

/** Plan 106 §4, extended to river/ocean shorelines by plan `ui-input-006` —
 *  `[E]` always drinks directly (well, lake, river or ocean); `[R]` fills a
 *  carried liquid container (waterskin or bucket — plan items-player-001).
 *  Static regardless of inventory (same convention as `campfire`'s "Dołóż
 *  opał" prompt not checking for fuel first) — `gameLoop.ts` toasts an
 *  error if `[R]` is pressed without one. */
const WATER_SOURCE_PROMPT = '[E] Napij się · [R] Napełnij pojemnik'
/** Plan world-011 — shown instead of `WATER_SOURCE_PROMPT` at an ocean
 *  shoreline (`createWaterSource('ocean').quality === 'undrinkable'`): salt
 *  water can't be drunk or bottled, so neither `[E]` nor `[R]` is offered as
 *  a real action. Still built for a fishing rod holder — `FISHING_PROMPT`
 *  wins over this the same way it wins over `WATER_SOURCE_PROMPT`. */
const OCEAN_WATER_PROMPT = 'Słona woda — niezdatna do picia'
/** Plan 159 §9-10 — shown instead of `WATER_SOURCE_PROMPT` while a fishing
 *  rod is held, since `[E]`/`[R]` are only two keys and fishing needs both
 *  (cast, apply bait). Drinking is unavailable while the rod is equipped —
 *  same "one held tool at a time" tradeoff the rest of the game already
 *  makes. */
const FISHING_PROMPT = '[E] Łów rybę · [R] Zanęć'
/** Lit campfire — `[E]` adds fuel (existing), `[R]` cooks raw_meat (plan
 *  106 §6). Static regardless of inventory, same convention as
 *  `WATER_SOURCE_PROMPT` — any catalog fuel kind works (plan
 *  items-player-023), not just a branch. */
const CAMPFIRE_LIT_PROMPT = '[E] Dołóż opał · [R] Upiecz mięso'

/** `canMilk` (plan fauna-002) is the caller's precomputed "player carries a
 *  bucket with room for milk" check — only meaningful for a `cow`/`sheep`
 *  whose own milking cooldown (`animal.canBeMilked(nowDays)`) has cleared;
 *  every other combination falls through to the existing prompts unchanged. */
/** `feedItemKind` (plan fauna-011 §6) is the caller's precomputed "player
 *  carries an item this animal's `def.diet.items` accepts" check
 *  (`selectDietFeedKind(inventory, animal.def.diet.items)`) — same
 *  "precompute, stay inventory-agnostic" convention as `canMilk` above. */
function animalPromptLabel(
  animal: AnimalAgent,
  heldTool: ToolKind | null,
  canMilk: boolean,
  nowDays: number,
  feedItemKind: ItemKind | null,
  ledAnimalId: string | null = null,
  canShear = false,
): string {
  const kind = animal.def.kind
  const label = ANIMAL_LABELS[kind]
  if (isMeleeTool(heldTool) || isRangedTool(heldTool)) return `Atakuj: ${label}`
  if (ledAnimalId === animal.animalId) return `Prowadzisz: ${label}`
  // Any animal carrying a `mount` config is mountable (plan fauna-003 §5) —
  // no ownership/taming gate yet, so the prompt is unconditional whenever no
  // weapon is held.
  if (animal.isPlayerOwned()) return `Steruj: ${label}`
  if (animal.isLeadable() && !ANIMAL_DEFS[kind].mount) return `Prowadź: ${label}`
  if (ANIMAL_DEFS[kind].mount) return `Dosiądź: ${label}`
  if (canShear && animal.canBeSheared(nowDays)) return `Ostrzyż: ${label}`
  if (canMilk && animal.canBeMilked(nowDays)) return `Wydój: ${label}`
  if (feedItemKind) return `Nakarm: ${label}`
  return `Obserwuj: ${label}`
}

function cartPromptLabel(
  cart: { pulledByAnimalId: string | null },
  ledAnimal: AnimalAgent | null,
): string {
  if (cart.pulledByAnimalId) return 'Odepnij wózek'
  if (ledAnimal && cartAcceptsAnimal(ledAnimal.def)) return 'Przywiąż do wózka'
  return 'Wózek'
}

/** A held bow's own attack range, so a distant animal still enters the gaze
 *  list (`interactRange` override) instead of being capped at melee-scale
 *  `GAZE_RANGE` — without this a bow's target could never be acquired beyond
 *  ~5 units, far short of any bow's actual range (plan 162 was missing this;
 *  the ranged fire/projectile pipeline it added never widened target
 *  acquisition, so `[E]`/LMB silently did nothing at real bow distance). */
function rangedToolRange(heldTool: ToolKind | null): number | null {
  return isRangedTool(heldTool) ? ITEM_CATALOG[heldTool].ranged?.range ?? null : null
}

/** Plan 172 — natural crop lifecycle prompt. `young` and a `spoiled` crop
 *  with no `spoiledItem` still show (flavor/inspection), just without
 *  `[E] Zbierz`; the actual yield decision is re-validated at harvest time
 *  (`ChunkManager.harvestCrop`), never trusted from this per-frame label. */
function cropPromptLabel(cropId: CropId, stage: CropGrowthStage): string {
  const label = ITEM_DEFS[CROP_DEFS[cropId].harvestItem].label
  if (stage === 'mature') return `[E] Zbierz: ${label}`
  if (stage === 'young') return `Młoda roślina: ${label}`
  const def = CROP_DEFS[cropId]
  return def.spoiledItem ? `[E] Zbierz: ${label} (przejrzałe)` : `Przejrzała roślina: ${label}`
}

/** Spawn-point prompt (plan 125 §6) — only `depleted` offers the destructive
 *  `[E] Zniszcz` action; every other state keeps the existing inspection
 *  prompt, just annotated so the player can tell why nothing spawns there. */
function spawnerPromptLabel(spawner: PreySpawner): string {
  const label = SPAWNER_LABELS[spawner.type]
  switch (spawner.state) {
    case 'depleted':
      return spawnerDestroyPromptLabel(spawner.type)
    case 'disabled':
      return `Zbadaj: ${label} (wypalone)`
    case 'recovering':
      return `Zbadaj: ${label} (odradza się)`
    default:
      return `Zbadaj: ${label}`
  }
}

/** Placed-trap prompt (plan 141 §9) — the state is readable from the prop
 *  itself, so the prompt only names the action. An armed trap can't be picked
 *  up (disarm first); a broken one can only be cleared away. */
function trapPromptLabel(kind: TrapKind, state: TrapState): string {
  const label = TRAP_DEFS[kind].label
  switch (state) {
    case 'active':
      return `[E] Rozbrój: ${label}`
    case 'broken':
      return `[R] Usuń zniszczoną: ${label}`
    case 'placed':
      return `[E] Uzbrój · [R] Zabierz: ${label}`
  }
}

/** `bury` (shovel) and `harvest` (knife, plan 106) never overlap on the same
 *  corpse — the single `HeldTool` slot means only one tool is held at once.
 *  `knifeAvailable` covers both "harvest knife already held" and "harvest
 *  knife in inventory, hand free" (plan 153, plan 160 damascus_knife) —
 *  `startHarvestMeat` auto-equips it either way, so the prompt should appear
 *  whenever the action would actually succeed. */
function corpseCandidate(
  animal: AnimalAgent,
  shovelHeld: boolean,
  knifeAvailable: boolean,
): InteractablePayload | null {
  const position = animal.interactionPosition()
  const label = ANIMAL_LABELS[animal.def.kind]
  if (animal.canInspectStrayedCorpse()) {
    return {
      kind: 'corpse',
      position,
      promptLabel: `Zbadaj zwłoki: ${label}`,
      animal,
      action: 'inspect',
    }
  }
  if (shovelHeld && !animal.readyToRemove()) {
    return {
      kind: 'corpse',
      position,
      promptLabel: `Zakop zwłoki: ${label}`,
      animal,
      action: 'bury',
    }
  }
  if (knifeAvailable && animal.canHarvestMeat()) {
    return {
      kind: 'corpse',
      position,
      promptLabel: `Wytnij mięso: ${label}`,
      animal,
      action: 'harvest',
    }
  }
  return null
}

/**
 * Whether world `[R]` is a real alternate on this item target.
 *
 * Only the plan-153 pickup+consume quick-action qualifies. Plain world
 * pickup is always `[E]`; `[R]` must never alias generic pickup (tools,
 * materials, grouped stacks, etc.). Spoiled perishable food (plan
 * items-player-025) is still pick-uppable with `[E]` but is not offered as
 * a consume shortcut.
 *
 * @domain ui-input
 */
export function worldItemAllowsAltInteract(
  kind: ItemKind,
  quantity = 1,
  freshness?: FreshnessStage,
): boolean {
  if (freshness === 'spoiled') return false
  return quantity <= 1 && Boolean(ITEM_CATALOG[kind].consumable)
}

/** World pickup prompt (plan 153) — adds a `[R] Zjedz`/`Wypij`/`Opatrz`
 *  quick-action for items immediately usable straight out of inventory
 *  (gated on `worldItemAllowsAltInteract`, the same flag execution uses).
 *  Spoiled dropped food (plan items-player-025) is labelled like crop
 *  overripe (`(zepsute)`) and omits `[R]`. Plain pickup keeps the
 *  auto-`[E]`-prefixed short form used everywhere else. */
export function itemPromptLabel(kind: ItemKind, quantity = 1, freshness?: FreshnessStage): string {
  const baseLabel = ITEM_DEFS[kind].label
  const label = freshness === 'spoiled' ? `${baseLabel} (zepsute)` : baseLabel
  const quantityLabel = quantity > 1 ? `${label} ×${quantity}` : label
  if (!worldItemAllowsAltInteract(kind, quantity, freshness)) return `Podnieś: ${quantityLabel}`
  const consumable = ITEM_CATALOG[kind].consumable!
  return `[E] Podnieś: ${label} · [R] ${consumeVerbLabel(consumable.need)}`
}

/** XZ metres two plain dropped units of the same kind may sit apart and
 *  still share one interaction target (plan items-player-022). */
export const DROPPED_ITEM_GROUP_RADIUS = 1.5

/** One grouped or singleton dropped-item interaction candidate (plan ui-input-027). */
export type DroppedItemGroupCandidate = {
  kind: ItemKind
  x: number
  z: number
  memberIds: readonly string[]
  /** First member in source order — carries freshness without a registry rescan. */
  first: DroppedItem
}

/**
 * Groups nearby identical plain dropped records into one interaction
 * candidate each. Records with `instance` or `foodBatch` stay individual.
 * Membership and member order follow the source array so Tab identity does
 * not flicker (plan items-player-022). Uses coarse local buckets so work
 * scales with nearby density, not global dropped count (plan ui-input-027).
 *
 * @domain items-player
 */
export function groupDroppedItemCandidates(items: readonly DroppedItem[]): DroppedItemGroupCandidate[] {
  const n = items.length
  if (n === 0) return []

  const parent = items.map((_, i) => i)
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]!]!
      i = parent[i]!
    }
    return i
  }
  const union = (a: number, b: number): void => {
    const pa = find(a)
    const pb = find(b)
    if (pa < pb) parent[pb] = pa
    else if (pb < pa) parent[pa] = pb
  }

  const radiusSq = DROPPED_ITEM_GROUP_RADIUS * DROPPED_ITEM_GROUP_RADIUS
  const cellSize = DROPPED_ITEM_GROUP_RADIUS
  const cellStride = 1 << 16
  const cellCoord = (v: number): number => Math.floor(v / cellSize)
  const cellKey = (cx: number, cz: number): number => cx * cellStride + cz

  const buckets = new Map<number, number[]>()
  for (let i = 0; i < n; i++) {
    const item = items[i]!
    if (item.instance || item.foodBatch) continue
    const key = cellKey(cellCoord(item.x), cellCoord(item.z))
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = []
      buckets.set(key, bucket)
    }
    bucket.push(i)
  }

  const neighborCover = DROPPED_ITEM_GROUP_RADIUS + cellSize
  for (let i = 0; i < n; i++) {
    const a = items[i]!
    if (a.instance || a.foodBatch) continue
    const minCx = cellCoord(a.x - neighborCover)
    const maxCx = cellCoord(a.x + neighborCover)
    const minCz = cellCoord(a.z - neighborCover)
    const maxCz = cellCoord(a.z + neighborCover)
    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cz = minCz; cz <= maxCz; cz++) {
        const bucket = buckets.get(cellKey(cx, cz))
        if (!bucket) continue
        for (const j of bucket) {
          if (j <= i) continue
          const b = items[j]!
          if (a.kind !== b.kind) continue
          const dx = a.x - b.x
          const dz = a.z - b.z
          if (dx * dx + dz * dz <= radiusSq) union(i, j)
        }
      }
    }
  }

  const rootMembers = new Map<number, DroppedItem[]>()
  for (let i = 0; i < n; i++) {
    const item = items[i]!
    if (item.instance || item.foodBatch) continue
    const root = find(i)
    let members = rootMembers.get(root)
    if (!members) {
      members = []
      rootMembers.set(root, members)
    }
    members.push(item)
  }

  const emitted = new Set<number>()
  const groups: DroppedItemGroupCandidate[] = []
  for (let i = 0; i < n; i++) {
    const item = items[i]!
    if (item.instance || item.foodBatch) {
      groups.push({ kind: item.kind, x: item.x, z: item.z, memberIds: [item.id], first: item })
      continue
    }
    const root = find(i)
    if (emitted.has(root)) continue
    emitted.add(root)
    const members = rootMembers.get(root)!
    const first = members[0]!
    groups.push({
      kind: first.kind,
      x: first.x,
      z: first.z,
      memberIds: members.map((entry) => entry.id),
      first,
    })
  }
  return groups
}

/** True if `(x, z)` is within `range` of `playerPos` (XZ plane, squared distance). */
function withinRange(x: number, z: number, playerPos: { x: number, z: number }, range: number): boolean {
  const dx = x - playerPos.x
  const dz = z - playerPos.z
  return dx * dx + dz * dz <= range * range
}

/** Player `[E]` position for a blacksmith grind workbench — the geometry
 *  workbench, never the NPC access anchor stored on `workplace.position`. */
export function grindstoneInteractPosition(workplace: {
  position: { x: number, z: number }
  workbenchPosition: { x: number, z: number }
}): { x: number, z: number } {
  return { x: workplace.workbenchPosition.x, z: workplace.workbenchPosition.z }
}

/** Picks the settlement's actual physical hay-bale placement nearest the
 *  player, among those within `range` (plan 168 hay-range bugfix) — pulled
 *  out of `buildInteractables` as a small pure function so the "use the real
 *  prop position, not the garden pad center" fix stays unit-testable without
 *  a full `Settlement`. A settlement can place up to two hay bales; this
 *  picks one, never both. Falls back to `garden` only for pre-fix landmark
 *  fixtures that never populated `haySpots`. */
export function resolveHaySpot(
  haySpots: readonly { x: number, z: number }[] | undefined,
  garden: { x: number, z: number },
  playerPos: { x: number, z: number },
  range: number,
): { x: number, z: number } | null {
  const spots = haySpots?.length ? haySpots : [garden]
  let best: { x: number, z: number } | null = null
  let bestDistSq = Infinity
  for (const spot of spots) {
    const dx = spot.x - playerPos.x
    const dz = spot.z - playerPos.z
    const distSq = dx * dx + dz * dz
    if (distSq <= range * range && distSq < bestDistSq) {
      best = spot
      bestDistSq = distSq
    }
  }
  return best
}

/** Unified lake/river/ocean shoreline resolver — replaces the old lake-only
 *  `isNearLakeShore` (plan `ui-input-006`) so drinking/filling and the
 *  fishing interaction both work at any of the three water bodies. Delegates
 *  to `terrain/waterBodyKind.ts`'s `resolveWaterShore` (plan world-terrain-046)
 *  — the same shared shore/body query fauna's natural-water eligibility
 *  consumes — after resolving the river candidate once via
 *  `chunkManager.riverShoreQuery`, so this and the fauna path can never
 *  disagree on precedence or repeat the river scan. No discrete "Lake"/
 *  "River" world object exists (plan 106 §4) — this is a synthetic candidate
 *  built fresh each frame, same pattern as `buildDigTarget`.
 *
 *  Returns the real world point the interaction happens at, not the player's
 *  own position — `waterEdge` used to sit exactly on `playerPos`, which
 *  `pickInGaze`'s `dist < 1e-4` self-distance guard then always rejected,
 *  silently disabling drinking/filling/fishing at every shoreline (plan
 *  `ui-input-006` follow-up: ocean fishing never worked). */
function resolveWaterBodyShore(
  playerPos: Vector3,
  chunkManager: ChunkManager,
): WaterShoreResult | null {
  const riverCandidate = chunkManager.riverShoreQuery(playerPos.x, playerPos.z)
  return resolveWaterShore(playerPos.x, playerPos.z, chunkManager, riverCandidate)
}

/** `WaterSource` for an already-resolved shore result — `river` reuses the
 *  exact hydrology context `resolveWaterBodyShore` already found instead of
 *  asking `resolveRiverWaterQuality` to re-resolve river context from
 *  coordinates (plan world-terrain-046). */
function waterSourceForShore(
  waterBody: WaterShoreResult,
  resolveRiverWaterQuality: (context: RiverHydrologyContext) => WaterQuality,
): WaterSource {
  if (waterBody.kind === 'river') {
    return { kind: 'river', quality: resolveRiverWaterQuality(waterBody.river) }
  }
  return createWaterSource(waterBody.kind)
}

/** Live shoreline `WaterSource` at `playerPos` (plan ui-input-034) — same
 *  quality rules as the synthetic `waterEdge` interactable. */
export function resolveShorelineWaterSource(
  playerPos: Vector3,
  chunkManager: ChunkManager,
  resolveRiverWaterQuality: (context: RiverHydrologyContext) => WaterQuality,
): WaterSource | null {
  const waterBody = resolveWaterBodyShore(playerPos, chunkManager)
  return waterBody ? waterSourceForShore(waterBody, resolveRiverWaterQuality) : null
}

type SpatialContextResolver = (x: number, y: number, z: number) => WorldSpatialContext

function spatialContextForPayload(
  payload: InteractablePayload,
  resolveAt: SpatialContextResolver,
  worldGeneratedContextById: ReadonlyMap<string, WorldSpatialContext>,
): WorldSpatialContext {
  switch (payload.kind) {
    case 'animal':
    case 'corpse': {
      const pos = payload.animal.mesh.position
      return resolveAt(pos.x, pos.y, pos.z)
    }
    case 'container': {
      const authored = worldGeneratedContextById.get(payload.id)
      return authored ?? WORLD_SPATIAL_CONTEXT_SURFACE
    }
    case 'deposit':
      return payload.depositContext
    case 'npc':
    case 'npcCorpse': {
      const pos = payload.npc.mesh.position
      return resolveAt(pos.x, pos.y, pos.z)
    }
    default:
      return WORLD_SPATIAL_CONTEXT_SURFACE
  }
}

function finalizeInteractables(
  payloads: readonly InteractablePayload[],
  resolveAt: SpatialContextResolver,
  worldGeneratedContextById: ReadonlyMap<string, WorldSpatialContext>,
): Interactable[] {
  return payloads.map((payload) => ({
    ...payload,
    spatialContext: spatialContextForPayload(payload, resolveAt, worldGeneratedContextById),
  }))
}

/** Drops candidates whose spatial context differs from the player's (plan world-027). */
export function filterInteractablesSameSpatialContext(
  interactables: readonly Interactable[],
  playerContext: WorldSpatialContext,
): Interactable[] {
  return interactables.filter((candidate) => spatialContextsEqual(candidate.spatialContext, playerContext))
}

/** Assembles this frame's `Interactable` candidates from every world system —
 *  NPCs, the well, nearby trees (settlement + streamed via lifecycle), live fauna,
 *  fauna spawn points, player-built campfires, and nearby pickup items
 *  (world-generated + the renewable pool + player-dropped). Settlement/fauna
 *  candidates aren't pre-filtered by their source systems (unlike trees/items,
 *  which already query `chunkManager` by range), so each is checked against
 *  `GAZE_RANGE` here before allocating its description object — `GAZE_RANGE`
 *  is the largest range any consumer of this list picks against, so nothing
 *  a caller could select is dropped. */
export function buildInteractables(
  settlements: readonly Settlement[],
  fauna: Fauna,
  chunkManager: ChunkManager,
  itemSpawners: ItemSpawners,
  droppedItems: DroppedItems,
  placedFires: PlacedFires,
  placedTents: PlacedTents,
  sleepingUtilities: SleepingUtilities,
  placedTraps: PlacedTraps,
  placedContainers: PlacedContainers,
  worldGeneratedContainers: WorldGeneratedContainers,
  resourceDeposits: ResourceDeposits,
  dryingRacks: DryingRacks,
  hives: Beehives,
  placedWells: PlayerWells,
  playerGardens: PlayerGardens,
  standingTorches: StandingTorches,
  playerTroughs: PlayerTroughs,
  palisades: Palisades,
  residentialBuildings: ResidentialBuildings,
  terrainPreparations: TerrainPreparations,
  /** Current world day (plan 159) — drives drying-complete/honey-available
   *  prompt text. */
  nowDays: number,
  playerPos: Vector3,
  /** Currently held tool — drives axe harvest prompts and animal attack prompts. */
  heldTool: ToolKind | null = null,
  /** Persistent land-plot ownership (plan 129) — an owned sale plot yields
   *  no candidate at all (no sign, no purchase prompt). Optional so existing
   *  callers/tests that never touch land plots don't need one. */
  landOwnership?: LandOwnershipRegistry,
  /** Knife sitting in inventory with the hand free — `startHarvestMeat`
   *  auto-equips it, so this counts toward the harvest prompt the same as
   *  already holding it (plan 153). Includes damascus_knife (plan 160).
   *  Defaults to false for existing callers/tests that don't model inventory
   *  contents. */
  inventoryHasFreeKnife = false,
  /** Per-`AnimalKind` interact-range override, from `QuestManager
   *  .activeSpotAnimalRange` (plan 153) — passed as a resolver rather than
   *  the manager itself so this module stays quest-agnostic (same
   *  convention as `heldTool`/`landOwnership` above). `null`/undefined
   *  result means "no override, use the normal range". */
  activeSpotAnimalRange?: (kind: AnimalKind) => number | null,
  /** Player carries a liquid container with room for milk right now (plan
   *  fauna-002) — precomputed the same way `inventoryHasFreeKnife` is, so
   *  this module stays inventory-agnostic. Defaults to false for existing
   *  callers/tests. */
  hasMilkContainer = false,
  /** Player carries a water-filled liquid container (plan items-player-020). */
  hasCarriedWaterContainer = false,
  /** Player-feeding resolver (plan fauna-011 §6) — precomputed the same way
   *  `hasMilkContainer`/`inventoryHasFreeKnife` are, so this module stays
   *  inventory-agnostic. Returns the first inventory item compatible with
   *  `animal`'s diet, or `null`. Optional/defaulted so existing callers/
   *  tests that don't model inventory contents keep prior behaviour (no
   *  "Nakarm" prompt ever offered). */
  feedItemKindFor?: (animal: AnimalAgent) => ItemKind | null,
  /** Contextual river water quality (plan world-017), lazy/cached at world
   *  scope — `bundle.riverWaterQuality.resolveFromContext` in production
   *  (`world/riverWaterQualityResolver.ts`), fed the already-resolved
   *  hydrology context from this frame's own `resolveWaterBodyShore` call
   *  (plan world-terrain-046) rather than re-querying by coordinate. Defaults
   *  to a fail-closed `unsafe` for any test/caller that doesn't model river
   *  hydrology, rather than reintroducing the old blanket `river = safe`. */
  resolveRiverWaterQuality: (context: RiverHydrologyContext) => WaterQuality = () => 'unsafe',
  /** Detached player-owned livestock (plan fauna-020) — not in any loaded
   *  settlement's `livestock` array but still interactable. */
  detachedLivestock: readonly AnimalAgent[] = [],
  /** World seed for lazy well-roof weather (plan world-020). Optional so
   *  existing callers/tests that never touch wells keep compiling; `0` is
   *  deterministic, not a hidden live clock. */
  worldSeed = 0,
  /** Movable draft carts (plan fauna-007). Empty for callers/tests that
   *  don't model carts. */
  carts: readonly { id: string, x: number, z: number, pulledByAnimalId: string | null }[] = [],
  /** Currently led animal, if any — drives cart hitch prompts and the
   *  `Prowadzisz` animal label. */
  ledAnimal: AnimalAgent | null = null,
  /** Plan items-player-026 — prompt override for systemic treasure chests. */
  worldGeneratedContainerPrompt?: (id: string) => string | null,
  /** Player carries a `shearing` tool (plan fauna-004). */
  hasShearingTool = false,
  /** Fresh-resolving settlement-structure condition lookup (plan
   *  settlements-007) — `SettlementsManager.getStructureSnapshot` in
   *  production. Optional so existing callers/tests that never touch
   *  structure condition keep compiling; a missing resolver leaves every
   *  `house` candidate pristine/non-repairable. */
  getStructureSnapshot?: (settlementId: string, structureId: string, nowDays: number) => SettlementStructureState,
  /** Resolves live entity XYZ to gameplay spatial identity (plan world-027).
   *  Defaults to surface for callers/tests that do not model caves. */
  resolveSpatialContextAt: SpatialContextResolver = () => WORLD_SPATIAL_CONTEXT_SURFACE,
  /** Plan items-player-043 — Survival skill value (0..1) for medicinal herb
   *  discovery radius. Defaults to 0 (novice / base interact range). */
  survivalSkillValue = 0,
): Interactable[] {
  const list: InteractablePayload[] = []
  const worldGeneratedContextById = new Map(
    worldGeneratedContainers.list().map((entry) => [entry.id, entry.spatialContext]),
  )
  const axeHeld = hasItemCapability(heldTool, 'wood_chopping')
  const shovelHeld = hasItemCapability(heldTool, 'soil_digging')
  const pickaxeHeld = hasItemCapability(heldTool, 'rock_mining')
  const knifeHeld = hasItemCapability(heldTool, 'meat_harvesting')
  const knifeAvailable = knifeHeld || (heldTool === null && inventoryHasFreeKnife)

  for (const pf of placedFires.list()) {
    if (!isPlayerPlacedFire(pf)) continue
    if (!withinRange(pf.x, pf.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'campfire',
      position: { x: pf.x, z: pf.z },
      promptLabel: pf.fire.isLit()
        ? CAMPFIRE_LIT_PROMPT
        : pf.kind === 'pit' ? 'Zapal ognisko w palenisku'
        : pf.kind === 'pile' ? 'Zapal stos drewna'
        : 'Zapal ognisko',
      fire: pf.fire,
      source: { kind: 'placed', id: pf.id, fireKind: pf.kind },
    })
  }

  const representedBedrolls = new Set<string>()
  const representedPlatforms = new Set<string>()
  const bedrollRecords = sleepingUtilities.bedrolls.list()
  const platformRecords = sleepingUtilities.platforms.list()
  for (const tent of placedTents.list()) {
    if (!withinRange(tent.x, tent.z, playerPos, GAZE_RANGE)) continue
    const members = resolveCampInteractionMembers(tent, bedrollRecords, platformRecords)
    if (members.bedrollId) representedBedrolls.add(members.bedrollId)
    if (members.platformId) representedPlatforms.add(members.platformId)
    list.push({
      kind: 'camp',
      position: { x: tent.x, z: tent.z },
      promptLabel: '[E] Odpocznij · [R] Zbadaj',
      tentId: tent.id,
      bedrollId: members.bedrollId,
      platformId: members.platformId,
    })
  }

  for (const bedroll of bedrollRecords) {
    if (representedBedrolls.has(bedroll.id)) continue
    if (!withinRange(bedroll.x, bedroll.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'bedroll',
      position: { x: bedroll.x, z: bedroll.z },
      promptLabel: '[E] Zbadaj posłanie',
      id: bedroll.id,
    })
  }

  for (const platform of platformRecords) {
    if (representedPlatforms.has(platform.id)) continue
    if (!withinRange(platform.x, platform.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'platform',
      position: { x: platform.x, z: platform.z },
      promptLabel: '[E] Zbadaj podest',
      id: platform.id,
    })
  }

  for (const trap of placedTraps.list()) {
    if (!withinRange(trap.x, trap.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'trap',
      position: { x: trap.x, z: trap.z },
      promptLabel: trapPromptLabel(trap.kind, trap.state),
      id: trap.id,
      trapKind: trap.kind,
      state: trap.state,
    })
  }

  for (const cart of carts) {
    if (!withinRange(cart.x, cart.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'cart',
      position: { x: cart.x, z: cart.z },
      promptLabel: cartPromptLabel(cart, ledAnimal),
      id: cart.id,
    })
  }

  for (const container of placedContainers.list()) {
    if (!withinRange(container.x, container.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'container',
      position: { x: container.x, z: container.z },
      promptLabel: containerGroundPrompt(container.kind, container.contents.isEmpty()),
      id: container.id,
    })
  }

  for (const container of worldGeneratedContainers.list()) {
    if (!withinRange(container.x, container.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'container',
      position: { x: container.x, z: container.z },
      promptLabel: worldGeneratedContainerPrompt?.(container.id) ?? '[E] Otwórz skrzynię',
      id: container.id,
    })
  }

  for (const rack of dryingRacks.list()) {
    if (!withinRange(rack.x, rack.z, playerPos, GAZE_RANGE)) continue
    const promptLabel = !rack.process
      ? '[E] Zacznij suszenie'
      : isDryingComplete(rack.process, nowDays)
        ? '[E] Odbierz suszony produkt'
        : 'Suszy się…'
    list.push({
      kind: 'dryingRack',
      position: { x: rack.x, z: rack.z },
      promptLabel,
      id: rack.id,
    })
  }

  for (const hive of hives.list()) {
    if (!withinRange(hive.x, hive.z, playerPos, GAZE_RANGE)) continue
    const promptLabel = hive.burned
      ? 'Spalony ul'
      : honeyAvailable(hive, nowDays) > 0
        ? '[E] Zbierz miód · [R] Spal ul'
        : 'Dziki ul · [R] Spal ul'
    list.push({
      kind: 'hive',
      position: { x: hive.x, z: hive.z },
      promptLabel,
      id: hive.id,
      burned: hive.burned,
    })
  }

  // Plan 127 / world-021 — player-built wells keep `playerWell` identity
  // after the roof completes so inspect/repair can relookup by id.
  // Settlement wells below stay the generic `well` kind.
  for (const well of placedWells.list()) {
    if (!withinRange(well.x, well.z, playerPos, GAZE_RANGE)) continue
    const roofCondition = resolveWellRoofCondition(well, worldSeed, nowDays)
    const complete = isWellCompleted(well)
    list.push({
      kind: 'playerWell',
      position: { x: well.x, z: well.z },
      promptLabel: wellPromptLabel(well, roofCondition),
      id: well.id,
      stage: well.stage,
      waterSource: isWellWaterAvailable(well) ? wellWaterSource(well, roofCondition) : null,
      complete,
    })
  }

  // Plan 176 — always offered, even while fully maintained (plan §4).
  for (const garden of playerGardens.list()) {
    if (!withinRange(garden.x, garden.z, playerPos, GAZE_RANGE)) continue
    const care = resolveCultivationCare(garden, nowDays)
    const hydration = playerGardens.hydrationOf(garden.id, nowDays)?.hydration ?? garden.hydration
    list.push({
      kind: 'gardenPlot',
      position: { x: garden.x, z: garden.z },
      promptLabel: gardenPlotPromptLabel(care, hydration),
      id: garden.id,
      care,
    })
  }

  // Plan items-player-009 — player-built standing torches; `[E]` ignites a
  // completed unlit one, an already-lit one is flavor-only (no action to
  // offer). Since plan items-player-017, an unfinished torch instead offers
  // `[E]` construction work and can never be ignited.
  for (const torch of standingTorches.list()) {
    if (!withinRange(torch.x, torch.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'standingTorch',
      position: { x: torch.x, z: torch.z },
      promptLabel: standingTorchPromptLabel(torch),
      id: torch.id,
      lit: torch.lit,
      complete: isStandingTorchConstructionComplete(torch),
    })
  }

  for (const trough of playerTroughs.list()) {
    if (!withinRange(trough.x, trough.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'playerTrough',
      position: { x: trough.x, z: trough.z },
      promptLabel: playerTroughPromptLabel(trough, hasCarriedWaterContainer),
      id: trough.id,
      complete: isPlayerTroughConstructionComplete(trough),
      canFill: hasCarriedWaterContainer,
    })
  }

  // Plan items-player-010 — player-built palisade segments; `[R]` removes
  // the one segment gazed at, with partial material recovery. Since plan
  // items-player-017, an unfinished segment also offers `[E]` construction
  // work alongside the existing removal.
  for (const segment of palisades.list()) {
    if (!withinRange(segment.x, segment.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'palisade',
      position: { x: segment.x, z: segment.z },
      promptLabel: palisadePromptLabel(segment),
      id: segment.id,
      complete: isPalisadeConstructionComplete(segment),
    })
  }

  for (const house of residentialBuildings.list()) {
    if (!withinRange(house.x, house.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'residentialBuilding',
      position: { x: house.x, z: house.z },
      promptLabel: residentialBuildingPromptLabel(house),
      id: house.id,
      complete: isResidentialBuildingComplete(house),
      materialsSupplied: house.materialsSupplied,
      playerOwned: isPlayerOwnedResidentialBuilding(house),
    })
  }

  // Plan `world-terrain-002` §8 — active preparation work sites, same
  // "always-offered [E]" shape as `playerWell`/`gardenPlot` above.
  for (const prep of terrainPreparations.list()) {
    if (!withinRange(prep.center.x, prep.center.z, playerPos, GAZE_RANGE)) continue
    const done = prep.completedWork.toFixed(1)
    const total = prep.requiredWork.toFixed(1)
    list.push({
      kind: 'terrainPreparation',
      position: { x: prep.center.x, z: prep.center.z },
      promptLabel: `[E] Przygotuj teren (${done}/${total} h)`,
      id: prep.id,
    })
  }

  for (const settlement of settlements) {
    for (const npc of settlement.npcs) {
      // A dead NPC stays in `settlement.npcs` while its corpse is active
      // (plan npc-010) — talk targeting still excludes it; loot uses the
      // `npcCorpse` candidate below.
      if (npc.health.dead) {
        if (npc.hasLootableCorpse() && withinRange(npc.mesh.position.x, npc.mesh.position.z, playerPos, GAZE_RANGE)) {
          list.push({
            kind: 'npcCorpse',
            position: npc.mesh.position,
            promptLabel: `Przeszukaj zwłoki: ${npc.displayName}`,
            npc,
          })
        }
        continue
      }
      if (!withinRange(npc.mesh.position.x, npc.mesh.position.z, playerPos, GAZE_RANGE)) continue
      list.push({
        kind: 'npc',
        position: npc.mesh.position,
        promptLabel: `Rozmawiaj z ${npc.displayName}`,
        npc,
        settlement,
      })
    }

    for (const animal of settlement.livestock) {
      const rangeOverride = activeSpotAnimalRange?.(animal.def.kind) ?? rangedToolRange(heldTool)
      if (!withinRange(animal.mesh.position.x, animal.mesh.position.z, playerPos, Math.max(GAZE_RANGE, rangeOverride ?? 0))) continue
      if (animal.isDead()) {
        const corpse = corpseCandidate(animal, shovelHeld, knifeAvailable)
        if (corpse) list.push(corpse)
        continue
      }
      list.push({
        kind: 'animal',
        position: animal.mesh.position,
        promptLabel: animalPromptLabel(animal, heldTool, hasMilkContainer, nowDays, feedItemKindFor?.(animal) ?? null, ledAnimal?.animalId ?? null, hasShearingTool),
        animal,
        interactRange: rangeOverride ?? undefined,
      })
    }

    // Plan fauna-021 — settlement rats are combat targets only. Unarmed
    // gaze must not grow Observe/feed/mount prompts; the weapon-held
    // branch of `animalPromptLabel` already yields `Atakuj: szczur`.
    if (isMeleeTool(heldTool) || isRangedTool(heldTool)) {
      for (const animal of settlement.rats) pushLiveAnimalCandidate(animal)
    }

    const settlementWells = settlement.landmarks.wells && settlement.landmarks.wells.length > 0
      ? settlement.landmarks.wells
      : [{ position: settlement.landmarks.well }]
    for (const well of settlementWells) {
      if (withinRange(well.position.x, well.position.z, playerPos, GAZE_RANGE)) {
        list.push({
          kind: 'well',
          position: well.position,
          promptLabel: WATER_SOURCE_PROMPT,
          source: createWaterSource('well'),
        })
      }
    }

    // Plan settlements-npcs-046 — generated pasture trough only; never the
    // household-yard/vendor-paddock trough (those get no `[E]` fill action).
    // `resolvePastureWaterUse` re-derives the paired well/household from the
    // planned pasture and live settlement composition, never a cached pair.
    const pastureWaterUse = settlement.resolvePastureWaterUse()
    if (pastureWaterUse && withinRange(pastureWaterUse.troughPosition.x, pastureWaterUse.troughPosition.z, playerPos, GAZE_RANGE)) {
      list.push({
        kind: 'pastureTrough',
        position: pastureWaterUse.troughPosition,
        promptLabel: pastureTroughPromptLabel(pastureWaterUse.household),
        settlementId: settlement.id,
        canFill: pastureTroughCanFill(pastureWaterUse.household),
      })
    }

    // Plan 168 follow-up — the settlement's hay fallback as a real `[E]`
    // target, anchored on the actual physical hay-bale placement(s)
    // (`landmarks.haySpots`, plan 168 hay-range bugfix) rather than the
    // garden pad center, which can sit several meters from where the hay
    // prop itself was placed (`buildSettlementProps`'s `dist` offset) — using
    // the garden center let `[E]` fire from well outside `INTERACT_RANGE` of
    // the visible bale. Falls back to `garden` only for pre-fix landmark
    // fixtures that never populated `haySpots`.
    const haySpot = resolveHaySpot(settlement.landmarks.haySpots, settlement.landmarks.garden, playerPos, GAZE_RANGE)
    if (haySpot) {
      list.push({
        kind: 'hay',
        position: { x: haySpot.x, z: haySpot.z },
        promptLabel: '[E] Nocuj w sianie',
        settlementId: settlement.id,
      })
    }

    const residentialRepairPolicy = structureRepairPolicy('residential')
    for (const house of settlement.landmarks.houses) {
      if (!withinRange(house.position.x, house.position.z, playerPos, GAZE_RANGE)) continue
      const structureState = getStructureSnapshot?.(settlement.id, house.structureId, nowDays)
      const condition = structureState ? resolveStructureCondition(structureState, nowDays) : 100
      const repairActive = structureState ? hasActiveStructureRepair(structureState) : false
      const repairNeeded = Boolean(
        structureState && residentialRepairPolicy && isStructureRepairProblem(residentialRepairPolicy, structureState, nowDays),
      )
      const repairHint = repairActive || repairNeeded ? ' · [R] Napraw' : ''
      list.push({
        kind: 'house',
        position: house.position,
        promptLabel: `Obejrzyj: ${house.label}${repairHint}`,
        houseId: house.houseId,
        modelUrl: house.modelUrl,
        label: house.label,
        examine: house.examine,
        lampMount: house.lampMount,
        lampMountSource: house.lampMountSource,
        settlementId: settlement.id,
        structureId: house.structureId,
        condition,
        repairNeeded,
        repairActive,
        repairCompletedWork: structureState?.repair?.completedWork ?? null,
        repairRequiredWork: structureState?.repair?.requiredWork ?? null,
      })
    }

    // Authored starter repair targets (plan quests-progression-073) — home
    // only; gaze anchors stay available while damaged even when the mesh is
    // intentionally absent (missing fence segment / stone pile only).
    for (const target of settlement.authoredRepairGazeTargets) {
      if (!withinRange(target.position.x, target.position.z, playerPos, GAZE_RANGE)) continue
      const policy = structureRepairPolicy(target.kind)
      if (!policy || !getStructureSnapshot) continue
      const structureState = getStructureSnapshot(settlement.id, target.structureId, nowDays)
      const repairActive = hasActiveStructureRepair(structureState)
      const repairNeeded = isStructureRepairProblem(policy, structureState, nowDays)
      if (!repairActive && !repairNeeded) continue
      const condition = resolveStructureCondition(structureState, nowDays)
      list.push({
        kind: 'structureRepair',
        position: target.position,
        promptLabel: `[R] Napraw: ${policy.label}`,
        label: policy.label,
        settlementId: settlement.id,
        structureId: target.structureId,
        condition,
        repairNeeded,
        repairActive,
        repairCompletedWork: structureState.repair?.completedWork ?? null,
        repairRequiredWork: structureState.repair?.requiredWork ?? null,
      })
    }

    if (
      settlement.fire &&
      withinRange(settlement.fire.position.x, settlement.fire.position.z, playerPos, GAZE_RANGE)
    ) {
      list.push({
        kind: 'campfire',
        position: settlement.fire.position,
        promptLabel: settlement.fire.isLit() ? CAMPFIRE_LIT_PROMPT : 'Zapal ognisko',
        fire: settlement.fire,
        source: { kind: 'settlement' },
      })
    }

    for (const torch of settlement.villageTorches) {
      if (!withinRange(torch.position.x, torch.position.z, playerPos, GAZE_RANGE)) continue
      const lit = torch.torch.isLit()
      list.push({
        kind: 'villageTorch',
        position: { x: torch.position.x, z: torch.position.z },
        promptLabel: lit ? 'Pochodnia (płonie)' : '[E] Zapal pochodnię',
        settlementId: settlement.id,
        torchId: torch.id,
        lit,
      })
    }

    for (const hs of settlement.householdStorages) {
      if (!withinRange(hs.position.x, hs.position.z, playerPos, GAZE_RANGE)) continue
      list.push({
        kind: 'householdStorage',
        position: { x: hs.position.x, z: hs.position.z },
        promptLabel: '[E] Przekaż zasoby',
        household: hs.household,
      })
    }

    if (withinRange(
      settlement.landmarks.settlementStorage.x,
      settlement.landmarks.settlementStorage.z,
      playerPos,
      GAZE_RANGE,
    )) {
      list.push({
        kind: 'settlementStorage',
        position: { x: settlement.landmarks.settlementStorage.x, z: settlement.landmarks.settlementStorage.z },
        promptLabel: 'Zbadaj: Magazyn osady',
        economy: settlement.economy,
        settlementId: settlement.id,
      })
    }

    const nest = settlement.landmarks.ratNest
    if (nest && settlement.hasActiveNest() && withinRange(nest.x, nest.z, playerPos, GAZE_RANGE)) {
      list.push({
        kind: 'ratNest',
        position: { x: nest.x, z: nest.z },
        promptLabel: '[E] Zniszcz gniazdo szczurów',
        settlementId: settlement.id,
      })
    }

    // Plan settlements-npcs-012 — settlement bulk wood at `landmarks.stockpile`,
    // distinct from household yard piles and from the `settlementStorage` crate.
    if (withinRange(settlement.landmarks.stockpile.x, settlement.landmarks.stockpile.z, playerPos, GAZE_RANGE)) {
      list.push({
        kind: 'woodStorage',
        position: { x: settlement.landmarks.stockpile.x, z: settlement.landmarks.stockpile.z },
        promptLabel: '[E] Zbadaj stertę drewna',
        economy: settlement.economy,
      })
    }

    for (const plot of settlement.landmarks.landPlots) {
      if (!withinRange(plot.position.x, plot.position.z, playerPos, GAZE_RANGE)) continue
      if (landOwnership?.isOwned(settlement.id, plot.plotId)) continue
      list.push({
        kind: 'landPlot',
        position: plot.position,
        promptLabel: `Kup działkę — ${plot.price} monet`,
        settlementId: settlement.id,
        plotId: plot.plotId,
      })
    }

    // Plan npc-014 — the settlement's notice board, a physical publication
    // point for posted work-contract announcements.
    if (withinRange(settlement.landmarks.noticeBoard.x, settlement.landmarks.noticeBoard.z, playerPos, GAZE_RANGE)) {
      list.push({
        kind: 'noticeBoard',
        position: { x: settlement.landmarks.noticeBoard.x, z: settlement.landmarks.noticeBoard.z },
        promptLabel: '[E] Tablica ogłoszeń',
        settlementId: settlement.id,
      })
    }

    for (const workplace of settlement.landmarks.blacksmithWorkplaces) {
      const position = grindstoneInteractPosition(workplace)
      if (!withinRange(position.x, position.z, playerPos, GAZE_RANGE)) continue
      list.push({
        kind: 'grindstone',
        position,
        promptLabel: '[E] Naostrz broń',
        settlementId: settlement.id,
        familyIndex: workplace.familyIndex,
      })
    }
  }

  // Settlement + streamed trees share TreeLifecycle registration — one nearby
  // query avoids duplicates and covers chunk vegetation (plan 057).
  for (const tree of chunkManager.getNearbyTrees(playerPos, GAZE_RANGE)) {
    const canHarvest = axeHeld && isChoppableStage(tree.stage)
    let promptLabel = 'Obejrzyj drzewo'
    if (canHarvest) {
      if (tree.stage === 'mature' || tree.stage === 'old') promptLabel = 'Oczyść gałęzie'
      else if (tree.stage === 'limbed') promptLabel = 'Ścinaj drzewo'
      else promptLabel = 'Porąb pień'
    } else if (tree.stage === 'limbed' || tree.stage === 'felled' || tree.stage === 'harvested') {
      promptLabel = 'Obejrzyj pień'
    } else if (tree.stage === 'sapling') {
      promptLabel = 'Obejrzyj drzewko'
    }
    list.push({
      kind: 'tree',
      position: { x: tree.x, z: tree.z },
      promptLabel,
      id: tree.id,
      stage: tree.stage,
      sizeClass: tree.sizeClass,
      canHarvest,
    })
  }

  for (const crop of chunkManager.getNearbyCrops(playerPos, GAZE_RANGE)) {
    list.push({
      kind: 'crop',
      position: { x: crop.x, z: crop.z },
      promptLabel: cropPromptLabel(crop.cropId, crop.stage),
      id: crop.id,
      cropId: crop.cropId,
      stage: crop.stage,
    })
  }

  function pushLiveAnimalCandidate(animal: AnimalAgent): void {
    const rangeOverride = activeSpotAnimalRange?.(animal.def.kind) ?? rangedToolRange(heldTool)
    if (!withinRange(animal.mesh.position.x, animal.mesh.position.z, playerPos, Math.max(GAZE_RANGE, rangeOverride ?? 0))) return
    if (animal.isDead()) {
      const corpse = corpseCandidate(animal, shovelHeld, knifeAvailable)
      if (corpse) list.push(corpse)
      return
    }
    list.push({
      kind: 'animal',
      position: animal.mesh.position,
      promptLabel: animalPromptLabel(animal, heldTool, hasMilkContainer, nowDays, feedItemKindFor?.(animal) ?? null, ledAnimal?.animalId ?? null, hasShearingTool),
      animal,
      interactRange: rangeOverride ?? undefined,
    })
  }

  for (const animal of detachedLivestock) pushLiveAnimalCandidate(animal)

  for (const animal of fauna.getAgents()) pushLiveAnimalCandidate(animal)

  for (const landmark of chunkManager.getNearbyLandmarks(playerPos, GAZE_RANGE)) {
    list.push({
      kind: 'landmark',
      position: { x: landmark.x, z: landmark.z },
      promptLabel: `Zbadaj: ${LANDMARK_LABELS[landmark.kind]}`,
      landmarkId: landmark.id,
      envKind: landmark.kind,
    })
  }

  // Mineable environment rocks (plan world-terrain-047) — offered only while
  // the held item has `rock_mining`, same held-tool gate as ore deposits.
  if (pickaxeHeld) {
    for (const rock of chunkManager.getNearbyMineableRocks(playerPos, GAZE_RANGE)) {
      list.push({
        kind: 'mineableRock',
        position: { x: rock.x, z: rock.z },
        promptLabel: rock.promptLabel,
        resourceId: rock.resourceId,
        rockKind: rock.kind,
      })
    }
  }

  for (const spawner of fauna.getSpawners()) {
    if (!withinRange(spawner.x, spawner.z, playerPos, GAZE_RANGE)) continue
    list.push({
      kind: 'spawner',
      position: { x: spawner.x, z: spawner.z },
      promptLabel: spawnerPromptLabel(spawner),
      spawner,
    })
  }

  for (const item of chunkManager.getNearbyItems(
    playerPos,
    medicinalHerbInteractRange(survivalSkillValue, INTERACT_RANGE),
  )) {
    const herbRange = isMedicinalForageKind(item.kind)
      ? medicinalHerbInteractRange(survivalSkillValue, INTERACT_RANGE)
      : INTERACT_RANGE
    if (!withinRange(item.x, item.z, playerPos, herbRange)) continue
    list.push({
      kind: 'item',
      position: { x: item.x, z: item.z },
      promptLabel: itemPromptLabel(item.kind),
      item: { id: item.id, kind: item.kind, source: 'world' },
      interactRange: isMedicinalForageKind(item.kind) ? herbRange : undefined,
    })
  }

  for (const node of itemSpawners.nodes()) {
    if (node.collected) continue
    list.push({
      kind: 'item',
      position: { x: node.x, z: node.z },
      promptLabel: itemPromptLabel(node.kind),
      item: { id: node.id, kind: node.kind, source: 'spawner' },
    })
  }

  for (const group of groupDroppedItemCandidates(
    droppedItems.queryNear(
      playerPos.x,
      playerPos.z,
      GAZE_RANGE + DROPPED_ITEM_GROUP_RADIUS,
    ),
  )) {
    const freshness = group.first.foodBatch
      ? getFoodBatchFreshnessStage(group.kind, group.first.foodBatch, nowDays)
      : undefined
    list.push({
      kind: 'item',
      position: { x: group.x, z: group.z },
      promptLabel: itemPromptLabel(group.kind, group.memberIds.length, freshness),
      item: {
        id: group.memberIds[0]!,
        kind: group.kind,
        source: 'dropped',
        memberIds: group.memberIds,
      },
    })
  }

  if (pickaxeHeld) {
    const playerContext = resolveSpatialContextAt(playerPos.x, playerPos.y, playerPos.z)
    const deposit = resourceDeposits.queryNearest(playerPos.x, playerPos.z, GAZE_RANGE, {
      y: playerPos.y,
      spatialContext: playerContext,
    })
    if (deposit) {
      list.push({
        kind: 'deposit',
        position: { x: deposit.x, z: deposit.z },
        promptLabel: `Wydobądź: ${ORE_YIELD_LABEL[deposit.type]}`,
        id: deposit.id,
        oreType: deposit.type,
        depositContext: deposit.spatialContext,
      })
    }
  }

  const waterBody = resolveWaterBodyShore(playerPos, chunkManager)
  if (waterBody) {
    const fishingHeld = hasItemCapability(heldTool, 'fishing')
    list.push({
      kind: 'waterEdge',
      position: waterBody.position,
      promptLabel: fishingHeld ? FISHING_PROMPT : waterBody.kind === 'ocean' ? OCEAN_WATER_PROMPT : WATER_SOURCE_PROMPT,
      source: waterSourceForShore(waterBody, resolveRiverWaterQuality),
    })
  }

  return finalizeInteractables(list, resolveSpatialContextAt, worldGeneratedContextById)
}

function groundWorkPrompt(
  digLabel: string,
  profile: ReturnType<typeof getDigProfileAt>,
  canLevel: boolean,
): string {
  if (profile && canLevel) return `${digLabel} · [R] Wyrównaj`
  if (profile) return digLabel
  return '[R] Wyrównaj'
}

/** Ground-work target ahead of the player. Unlike everything in
 *  `buildInteractables()`, this isn't a fixed world object competing for gaze
 *  — `gameLoop.ts` only asks for one when `pickInGaze` found nothing, so it
 *  never outcompetes a real target (including ore deposits). Shovel: soil/sand
 *  only. Pickaxe: mountain rock only. `[E]` digs when a profile exists;
 *  `[R]` levels a depression on the same surface. */
export function buildDigTarget(
  playerPos: { x: number, z: number },
  playerYaw: number,
  heldTool: ToolKind | null,
  chunkManager: ChunkManager,
  playerSpatialContext: WorldSpatialContext = WORLD_SPATIAL_CONTEXT_SURFACE,
): Interactable | null {
  const x = playerPos.x - Math.sin(playerYaw) * DIG_REACH
  const z = playerPos.z - Math.cos(playerYaw) * DIG_REACH

  if (hasItemCapability(heldTool, 'soil_digging')) {
    const profile = getDigProfileAt(x, z, chunkManager)
    // "Wyrównaj" (plan `world-terrain-002`) now levels the surrounding 3×3
    // grid samples to the center's own height rather than raising toward a
    // procedural-base depression — it's offered on exactly the same ground
    // digging already is, not a separately-gated depression check.
    const canLevel = profile !== null
    if (!profile && !canLevel) return null
    return {
      kind: 'dig',
      position: { x, z },
      promptLabel: groundWorkPrompt('Wykop dołek', profile, canLevel),
      profile,
      canLevel,
      spatialContext: playerSpatialContext,
    }
  }

  if (hasItemCapability(heldTool, 'rock_mining')) {
    const profile = getRockDigProfileAt(x, z, chunkManager)
    const canLevel = profile !== null
    if (!profile && !canLevel) return null
    return {
      kind: 'dig',
      position: { x, z },
      promptLabel: groundWorkPrompt('Wykop skałę', profile, canLevel),
      profile,
      canLevel,
      spatialContext: playerSpatialContext,
    }
  }

  return null
}

/** Forgiving melee/ranged-attack fallback (plan 124 §1, widened for ranged
 *  tools per plan 162's own "extend the existing target query parameter
 *  instead of a second target manager" instruction) — same "only tried once
 *  nothing narrower was found" pattern as `buildDigTarget` above. Reuses the
 *  existing `kind: 'animal'` `Interactable`/`[E]` attack branch in
 *  `gameLoop.ts` unchanged: this only widens which live animal that branch
 *  sees, it is not a second targeting system. Only searches while a melee or
 *  ranged tool is held; a held bow widens the range to its own attack range
 *  (otherwise capped at melee-scale `COMBAT_TARGET_RANGE`, far short of any
 *  bow). `aim` selects the acquisition cone (plan 142 §1) — the only thing
 *  that differs between a pointer and a touch rig here. */
export function buildCombatTarget(
  settlements: readonly Settlement[],
  fauna: Fauna,
  playerPos: Vector3,
  playerYaw: number,
  heldTool: ToolKind | null,
  recentTargetIds: readonly string[],
  aim: CombatAimMode,
  playerSpatialContext: WorldSpatialContext = WORLD_SPATIAL_CONTEXT_SURFACE,
  resolveSpatialContextAt: SpatialContextResolver = () => WORLD_SPATIAL_CONTEXT_SURFACE,
): Interactable | null {
  if (!isMeleeTool(heldTool) && !isRangedTool(heldTool)) return null
  const range = Math.max(COMBAT_TARGET_RANGE, rangedToolRange(heldTool) ?? 0)

  const candidates: MeleeHitCandidate[] = []
  const byId = new Map<string, AnimalAgent>()
  const collect = (animal: AnimalAgent): void => {
    if (animal.isDead()) return
    const pos = animal.mesh.position
    if (!withinRange(pos.x, pos.z, playerPos, range)) return
    if (!spatialContextsEqual(resolveSpatialContextAt(pos.x, pos.y, pos.z), playerSpatialContext)) return
    candidates.push({ id: animal.animalId, x: animal.mesh.position.x, z: animal.mesh.position.z, alive: true })
    byId.set(animal.animalId, animal)
  }
  // Same sources as `forEachLivingCombatAnimal` (plan fauna-021) — kept
  // inline to avoid a `playerCombat` ↔ `interactables` import cycle.
  for (const settlement of settlements) {
    for (const animal of settlement.livestock) collect(animal)
    for (const animal of settlement.rats) collect(animal)
  }
  for (const animal of fauna.getAgents()) collect(animal)

  const targetId = pickCombatTarget(
    candidates,
    playerPos.x,
    playerPos.z,
    playerYaw,
    range,
    COMBAT_TARGET_CONE_DOT[aim],
    recentTargetIds,
  )
  const animal = targetId ? byId.get(targetId) ?? null : null
  if (!animal) return null
  const pos = animal.mesh.position
  return {
    kind: 'animal',
    position: animal.mesh.position,
    promptLabel: animalPromptLabel(animal, heldTool, false, 0, null),
    animal,
    spatialContext: resolveSpatialContextAt(pos.x, pos.y, pos.z),
  }
}

/**
 * Read-only, mutation-free pickup descriptor for a `WorldItemRef`, resolved
 * from whichever registry currently owns it — world-generated (finite,
 * id-based collected set), the renewable pool, or a player drop (plan
 * items-player-053). `null` means the ref no longer resolves to a live
 * source (already collected/stale) — never partially resolved.
 *
 * Callers must complete the full destination admission/commit sequence and
 * call `retire()` at most once, synchronously, only after that commit
 * succeeds — no `await`/callback may separate resolution from retirement,
 * so the source this descriptor names cannot change out from under the
 * transaction. `retire()` returning `false` is an invariant failure (the
 * source vanished despite that synchronous contract), never a normal retry
 * case.
 *
 * @domain items-player
 */
export type WorldPickupResolution = {
  itemKind: ItemKind
  /** Exact saved instance payload the source claims, if any — a dropped
   *  instance-backed item or an authored/renewable spawner's `instanceId`. */
  instance?: SaveItemInstance
  /** Perishable food provenance (dropped sources only). */
  foodBatch?: FoodBatch
  /** True only for an authored one-shot spawner pickup. */
  authoredOneShot: boolean
  /** Retires the exact source this resolution came from. */
  retire: () => boolean
}

export function resolveWorldPickup(
  ref: WorldItemRef,
  chunkManager: ChunkManager,
  itemSpawners: ItemSpawners,
  droppedItems: DroppedItems,
): WorldPickupResolution | null {
  switch (ref.source) {
    case 'dropped': {
      const item = droppedItems.get(ref.id)
      if (!item) return null
      return {
        itemKind: item.kind,
        instance: item.instance,
        foodBatch: item.foodBatch,
        authoredOneShot: false,
        retire: () => droppedItems.collect(ref.id) !== null,
      }
    }
    case 'spawner': {
      const point = itemSpawners.nodes().find((p) => p.id === ref.id)
      if (!point || point.collected) return null
      return {
        itemKind: point.kind,
        instance: point.instanceId ? { id: point.instanceId, kind: point.kind } : undefined,
        authoredOneShot: point.authoredOneShot ?? false,
        retire: () => itemSpawners.collect(ref.id) !== null,
      }
    }
    case 'world': {
      // Chunk world items never carry an exact instance/food payload — the
      // interaction candidate's own `ref.kind` is already the ordinary
      // destination kind, so admission resolves without a separate peek.
      // `retire` IS the source's mutating read (`ChunkManager` has no
      // separate non-mutating lookup by id).
      return {
        itemKind: ref.kind,
        authoredOneShot: false,
        retire: () => chunkManager.collectItem(ref.id) !== null,
      }
    }
  }
}

/** Outcome of `commitWorldPickup()` — `ok: false` carries the concrete
 *  `instance` that was rejected (when the transaction reached that stage),
 *  so a caller with UI feedback can explain a payload-mass rejection
 *  precisely (`inventoryFullToastTextForInstance`) instead of falling back
 *  to the kind-level message. */
export type WorldPickupCommit =
  | { ok: true, itemKind: ItemKind, authoredOneShot: boolean }
  | { ok: false, itemKind: ItemKind, instance?: ItemInstance }

/**
 * Commits one already-`resolveWorldPickup()`-resolved pickup into
 * `inventory` (plan items-player-053): reconstructs/validates the exact
 * destination payload, commits it, and only then retires the source. A
 * malformed exact saved instance fails closed — it is never replaced by a
 * freshly minted instance. A rejected or malformed destination leaves
 * `inventory` and the source completely unchanged (`ok: false`); the source
 * is retired, and `inventory` gains the item, only on `ok: true`.
 *
 * @domain items-player
 */
export function commitWorldPickup(
  resolution: WorldPickupResolution,
  inventory: Inventory,
  nowDays: number,
): WorldPickupCommit {
  const { itemKind, authoredOneShot } = resolution
  let acquiredInstance: ItemInstance | null
  if (resolution.instance) {
    const [restored] = Inventory.instancesFromJSON([resolution.instance])
    if (!restored) return { ok: false, itemKind }
    acquiredInstance = restored
  } else {
    // Fresh-instance minting only applies when the source does not claim an
    // exact instance payload — e.g. a renewable spawner point with no
    // `instanceId` for an otherwise instance-backed kind.
    acquiredInstance = createAcquiredInstance(itemKind)
  }

  if (acquiredInstance) {
    if (!inventory.canAddInstance(acquiredInstance)) return { ok: false, itemKind, instance: acquiredInstance }
    if (!inventory.addInstance(acquiredInstance)) return { ok: false, itemKind, instance: acquiredInstance }
    if (!resolution.retire()) {
      // Invariant failure: the source vanished between resolve and retire
      // despite the required synchronous, no-await ordering. Roll back the
      // just-committed destination payload rather than leaving a duplicate.
      inventory.removeInstance(acquiredInstance.id)
      return { ok: false, itemKind, instance: acquiredInstance }
    }
    return { ok: true, itemKind, authoredOneShot }
  }

  if (resolution.foodBatch) {
    if (!inventory.canAdd(itemKind, 1)) return { ok: false, itemKind }
    if (!inventory.addWithFreshness(itemKind, 1, [resolution.foodBatch], nowDays)) return { ok: false, itemKind }
    if (!resolution.retire()) {
      inventory.remove(itemKind, 1, nowDays)
      return { ok: false, itemKind }
    }
    return { ok: true, itemKind, authoredOneShot }
  }

  if (!inventory.canAdd(itemKind, 1)) return { ok: false, itemKind }
  if (!inventory.add(itemKind, 1, nowDays)) return { ok: false, itemKind }
  if (!resolution.retire()) {
    inventory.remove(itemKind, 1, nowDays)
    return { ok: false, itemKind }
  }
  return { ok: true, itemKind, authoredOneShot }
}
