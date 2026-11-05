import type { HeightSampler } from '../player/PlayerController'
import type { VillageSize } from '../settlement/families'
import type { SettlementCharacter } from '../settlement/villagePlan'
import type { AnimalKind, AnimalLifeStage } from './AnimalAgent'
import type { PreySpawner } from './AnimalSpawner'
import { createSeededRandom } from '../world/parseSeed'
import { HERD_CLUSTER_RADIUS, HERD_SPECIES, JUVENILE_SPAWN_CHANCE } from './herdCohesion'

/**
 * Settlement fauna habitat planner (plan fauna-050 F1) — the placement logic
 * `createFauna()` used to run inline for the home settlement, extracted so it
 * can be parametrized per settlement. Placement only: no Three.js, no scene,
 * no agents. The caller materializes the returned plan.
 */

/** Where a species prefers to spawn relative to the home settlement (plan
 *  044 §2.1/§2.2's habitat preferences): `open` is the original ring used by
 *  wolf/fox (no habitat check beyond dry land), `meadow`/`forest`/`water` add
 *  a `sampleForestFactor`/shoreline check for the new wild species. `edge`
 *  (plan fauna-016 §1) is deer/stag's own transitional forest-edge band —
 *  not a plain binary forest/meadow split, see `habitatFilterFor`'s `edge`
 *  case. Domestic livestock used to have a `farmstead` profile here — moved
 *  to `settlement/livestock.ts` (house-anchored, per-settlement, see the
 *  village livestock ownership plan) since a settlement-center ring can't
 *  express "belongs to this specific house". */
export type SpawnProfile = 'open' | 'meadow' | 'forest' | 'water' | 'edge'
export type SpawnSpec = { kind: AnimalKind, count: number, profile: SpawnProfile }

export const SPAWNS: SpawnSpec[] = [
  { kind: 'wolf', count: 2, profile: 'open' },
  { kind: 'fox', count: 2, profile: 'open' },
  { kind: 'deer', count: 4, profile: 'edge' },
  { kind: 'stag', count: 2, profile: 'edge' },
  { kind: 'rabbit', count: 3, profile: 'meadow' },
  { kind: 'duck', count: 2, profile: 'water' },
  { kind: 'boar', count: 2, profile: 'forest' },
]

/** [minOffset, maxOffset] *past* the settlement's real footprint radius
 *  (`footprintRadius` — `VILLAGE_SIZE_CONFIG.footprintRadius`, see
 *  `settlement/families.ts`) for each `SpawnProfile` (plan 080) — starts a
 *  bit past `AnimalAgent.ts`'s `VILLAGE_AVOID_MARGIN` so a freshly-spawned
 *  wild animal's own home point isn't already inside the zone its wander
 *  logic then refuses to path back into. Offset widths match the original
 *  flat-radius bands (18/18/21/20); only the anchor changed from a fixed
 *  guess (~20) to the settlement's real boundary, which ranges 22 (`OUTPOST`)
 *  to 72 (`XL`). `edge` (plan fauna-016 §1) reuses the old `open` band that
 *  deer/stag were placed with before this plan. */
export const SPAWN_RING_OFFSET: Record<SpawnProfile, [number, number]> = {
  open: [6, 24],
  meadow: [6, 24],
  forest: [6, 27],
  water: [4, 24],
  edge: [6, 24],
}

/** [minOffset, maxOffset] past the settlement's real footprint radius for
 *  cave/thicket/wolfDen habitat spawners (plan 080) — same reasoning as
 *  `SPAWN_RING_OFFSET`, widths matching the original flat 45–65 band.
 *  Exported so `worldBundle.ts`'s `buildFauna` can size its
 *  `roadCorridorsNear` query to actually cover the (now size-dependent)
 *  spawner ring instead of a fixed guess. */
export const SPAWNER_RING_OFFSET: [number, number] = [25, 45]

/** [minOffset, maxOffset] past the footprint radius for **predator dens**
 *  (`rockDen`, `wolfDen`) — queue Q100 (author 2026-11-03: wolf/bear dens
 *  sat right at the home village edge, too near and too dense). The deer
 *  thicket keeps `SPAWNER_RING_OFFSET`. A den that finds no site here falls
 *  back to `SPAWNER_RING_OFFSET`, so no den is ever dropped. */
export const PREDATOR_DEN_RING_OFFSET: [number, number] = [70, 130]

/** Minimum distance (m) between two predator dens, and between a den and any
 *  large-cave mouth (`denAvoidPoints`) — queue Q100: every den reuses the
 *  cave-mouth prop, so clustered dens read as a cluster of caves. */
export const MIN_PREDATOR_DEN_SEPARATION = 60

/** Whether a `SPAWNER_SPECS` entry is a predator den (Q100 ring + spacing). */
export function isPredatorDenSpec(spec: { type: PreySpawner['type'] }): boolean {
  return spec.type === 'rockDen' || spec.type === 'wolfDen'
}

/** Ordered `[ring, keepDenSpacing]` attempts for one habitat spawner (Q100):
 *  predator dens try their own ring with den spacing, then the near ring with
 *  spacing, then the near ring without it (the pre-Q100 rule) — a mandatory
 *  den (quests bind to the wolf den / home rock den) is never dropped. */
export function habitatSpawnerRingAttempts(
  spec: { type: PreySpawner['type'] },
  /** Predator-den ring past the footprint; home keeps `PREDATOR_DEN_RING_OFFSET`
   *  (= `predatorDenRingForBelt(HOME_SAFETY_BELT_WIDTH)`). */
  denRing: readonly [number, number] = PREDATOR_DEN_RING_OFFSET,
): readonly { ring: readonly [number, number], denSpacing: boolean }[] {
  if (!isPredatorDenSpec(spec)) return [{ ring: SPAWNER_RING_OFFSET, denSpacing: false }]
  return [
    { ring: denRing, denSpacing: true },
    { ring: SPAWNER_RING_OFFSET, denSpacing: true },
    { ring: SPAWNER_RING_OFFSET, denSpacing: false },
  ]
}

/** Minimum distance (world units) between any two wild-fauna spawn points
 *  placed while building one settlement's fauna — ring spawns and cave/
 *  thicket spawners share one running list so e.g. a cave spawner can't land
 *  next to a thicket spawner, or one species' initial spawn next to
 *  another's (plan 080). Not applied to `updateSpawners`'s runtime
 *  respawn-near-spawner call — that's intentionally close to its own
 *  spawner, not a new independent spawn point. */
export const MIN_SPAWN_SEPARATION = 10

/** Clearance (world units) from a river's water edge for any wild spawn
 *  position — extra bank distance on top of canonical `LocalWaterSample.present`,
 *  not a substitute for detecting water. Applies to every wild spawn, prey
 *  and predator alike. */
export const SPAWN_RIVER_CLEARANCE = 1.5
/** Wider berth for a habitat spawn *point* — a cave mouth / thicket / den is a
 *  physical prop with a footprint plus the pack that lives around it, so
 *  "not in the water" is not enough; it must sit on real bank. Generic across
 *  every `SPAWNER_SPECS` entry, never a per-species exception. */
export const SPAWNER_RIVER_CLEARANCE = 6

/** Radius (world units) `measureSlope` samples around a cave candidate. */
export const CAVE_SLOPE_SAMPLE_RADIUS = 3
/** Minimum height drop across `CAVE_SLOPE_SAMPLE_RADIUS` for a site to count
 *  as "sloped" — below this, the cave falls back to flat-ground placement/
 *  orientation (facing away from the settlement, the pre-083 behavior). */
export const CAVE_MIN_SLOPE_DROP = 0.6

/** Steepest-descent direction + height drop across `radius` around (cx, cz)
 *  — 8-direction sample, same shape as `settlement/villagePlanner.ts`'s
 *  `downhillAngle`. `yaw` is Three.js Y-rotation convention (`atan2(dx, dz)`,
 *  matching how `createCaveMouth`'s `mouth.rotation.y` is already set
 *  elsewhere in this file) so an object can be oriented to open toward the
 *  downhill side; `drop` is ~0 on flat ground. Pure — no Three.js dependency
 *  — exported for unit testing. */
export function measureSlope(
  cx: number,
  cz: number,
  radius: number,
  sampleHeight: HeightSampler,
): { yaw: number, drop: number } {
  const centerH = sampleHeight(cx, cz)
  let bestDrop = 0
  let bestYaw = 0
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const dx = Math.cos(angle) * radius
    const dz = Math.sin(angle) * radius
    const drop = centerH - sampleHeight(cx + dx, cz + dz)
    if (drop > bestDrop) {
      bestDrop = drop
      bestYaw = Math.atan2(dx, dz)
    }
  }
  return { yaw: bestYaw, drop: bestDrop }
}

/** Habitat spawners — see docs/plans/archive/2026-08-07--predator-prey-system.md.
 *  `rockDen` (renamed from `cave` — plan fauna-019 §8, a purely decorative
 *  `createCaveMouth()` prop, never a real walk-in cave) are predator dens
 *  (wolf, and now bear — plan 188: each is its own physical `PreySpawner`
 *  instance/world location, a rock den is not a singleton "the bear den"
 *  resource, see `spawnerId` below); thickets are deer cover. `wolfDen`
 *  (plan 093 Etap E) piggybacks on the same list/shape for a labeled quest
 *  den — `respawnIntervalDays: Infinity` keeps `updateSpawners` from ever
 *  repopulating it; its initial pack is spawned once, tagged with
 *  `spawnPointId` so a cleared den can deplete and be burned. RockDen/thicket
 *  intervals are game-days (plan 139). Multiple entries of the same `type`
 *  are supported (see `spawnerId` below) — a bear den doesn't turn the
 *  existing wolf den into a multi-species spawner, it's simply a second
 *  `rockDen`-type habitat placed independently by the same generic loop. */
export const SPAWNER_SPECS: {
  type: PreySpawner['type']
  kind: AnimalKind
  respawnIntervalDays: number
  maxPreyCount: number
}[] = [
  { type: 'rockDen', kind: 'wolf', respawnIntervalDays: 2, maxPreyCount: 2 },
  { type: 'thicket', kind: 'deer', respawnIntervalDays: 1, maxPreyCount: 4 },
  { type: 'wolfDen', kind: 'wolf', respawnIntervalDays: Infinity, maxPreyCount: 2 },
  // Bear den — solitary occupant, slower respawn than the wolf den.
  { type: 'rockDen', kind: 'bear', respawnIntervalDays: 3, maxPreyCount: 1 },
]

/** Stable on-disk id segment per `type` (plan fauna-019 §8) — decoupled from
 *  the type label itself so the `cave` -> `rockDen` rename never changes an
 *  existing save's spawner id / `SavedSpawnPointState` key. `rockDen` keeps
 *  deriving the pre-rename `cave` segment; every other type still derives
 *  its own name, unchanged. */
const SPAWNER_ID_SEGMENT: Record<PreySpawner['type'], string> = {
  rockDen: 'cave',
  thicket: 'thicket',
  grove: 'grove',
  wolfDen: 'wolfDen',
}

/** Stable id for a `SPAWNER_SPECS` entry (plan 188) — `${settlementId}:${segment}`
 *  for the first spawner of a given `type` (unchanged from pre-188 saves, which
 *  only ever had one spawner per `type`), `${settlementId}:${segment}:${kind}` for
 *  any later spawner sharing that `type` (e.g. the bear den alongside the
 *  wolf den) so two physical dens never collide on one save-restorable id. */
export function spawnerId(settlementId: string, type: PreySpawner['type'], kind: AnimalKind, seenOfType: number): string {
  const segment = SPAWNER_ID_SEGMENT[type]
  return seenOfType === 0 ? `${settlementId}:${segment}` : `${settlementId}:${segment}:${kind}`
}

// ---------------------------------------------------------------------------
// Safety belt (plan fauna-050 §Design, Q116-d / Q134 (a))
// ---------------------------------------------------------------------------

/** Width (m, past the footprint radius) of the home settlement's safety belt
 *  — the inner edge of the predator-den ring, `PREDATOR_DEN_RING_OFFSET[0]`
 *  since Q100. Home always uses exactly this, whatever its (variable) size. */
export const HOME_SAFETY_BELT_WIDTH = PREDATOR_DEN_RING_OFFSET[0]

/** 🟡 Provisional per-size belt widths (m past the footprint). `MD` is
 *  calibrated to the home belt; other sizes are proposals, re-tuned in F3/F4. */
const SAFETY_BELT_BY_SIZE: Record<VillageSize, number> = {
  OUTPOST: 40,
  SM: 55,
  MD: HOME_SAFETY_BELT_WIDTH,
  LG: 85,
  XL: 100,
}
/** Closed (palisaded) settlements near predators: narrower belt (author Q116-d). */
const CLOSED_BELT_FACTOR = 0.75
/** Forest share (0..1) above which the belt narrows. */
const REFERENCE_FOREST_SHARE = 0.35
/** Metres removed per 1.0 of forest share above the reference. */
const FOREST_BELT_NARROWING = 40
const MIN_SAFETY_BELT_WIDTH = 30

/**
 * Derived width (m past the footprint radius) of a settlement's relative-safety
 * belt: the inner edge of its predator-den ring and the wilderness exclusion
 * margin. Pure and deterministic; larger towns are wider, closed settlements and
 * forested surroundings narrower. `MD` / `default` / reference forest share = 70 m,
 * i.e. the home belt. No safe zone is implied — avoidance stays as it is.
 *
 * @domain fauna
 */
export function safetyBeltWidth(
  size: VillageSize,
  character: SettlementCharacter,
  forestShare: number,
): number {
  const share = Math.min(1, Math.max(0, forestShare))
  const excess = Math.max(0, share - REFERENCE_FOREST_SHARE)
  const raw = SAFETY_BELT_BY_SIZE[size] * (character === 'closed' ? CLOSED_BELT_FACTOR : 1)
    - excess * FOREST_BELT_NARROWING
  return Math.max(MIN_SAFETY_BELT_WIDTH, Math.round(raw))
}

/** Predator-den ring `[min, max]` past the footprint for a belt: the inner edge
 *  is the belt, the band keeps today's 60 m width. `belt = 70` -> `[70, 130]`. */
export function predatorDenRingForBelt(belt: number): readonly [number, number] {
  return [belt, belt + (PREDATOR_DEN_RING_OFFSET[1] - PREDATOR_DEN_RING_OFFSET[0])]
}

/** Per-site placement RNG for a non-home settlement (independent of build order
 *  and of the shared `seed ^ 0xfa11` stream, so adding sites never moves home). */
export function settlementFaunaSiteRandom(worldSeed: number, settlementId: string): () => number {
  let h = 0x811c9dc5
  for (let i = 0; i < settlementId.length; i++) {
    h ^= settlementId.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return createSeededRandom((worldSeed ^ 0x5e771e ^ h) >>> 0)
}

// ---------------------------------------------------------------------------
// Planner
// ---------------------------------------------------------------------------

type XZ = { x: number, z: number }

/** One ring individual, in creation order (`motherIndex` indexes this list). */
export type PlannedRingAnimal = {
  kind: AnimalKind
  x: number
  z: number
  herdId?: string
  lifeStage?: AnimalLifeStage
  motherIndex?: number
}

/** One habitat spawner site plus the deterministic values the caller needs to
 *  build its prop (so materialization draws no further RNG for it). */
export type PlannedHabitatSpawner = {
  spec: (typeof SPAWNER_SPECS)[number]
  id: string
  x: number
  z: number
  /** Ground height at the site, sampled before any carving. */
  groundY: number
  /** Slope at the site (rock den only), sampled before carving. */
  slope: { yaw: number, drop: number } | null
  /** RNG draws for the prop, in order: rock/wolf den = 1 (mouth variant),
   *  thicket = 2 (variant, yaw). */
  propRandoms: number[]
}

export type SettlementFaunaPlan = {
  ring: PlannedRingAnimal[]
  spawners: PlannedHabitatSpawner[]
  /** Every placed spawn point (ring + spawners), for later `MIN_SPAWN_SEPARATION` checks. */
  placedSpawnPoints: XZ[]
}

export type SettlementFaunaPlanInput = {
  settlementId: string
  center: XZ
  footprintRadius: number
  /** Historical safety bound (`HOME_RADIUS`); never tighter than a ring's own `maxDist`. */
  homeRadius: number
  /** Placement RNG: home passes the shared `seed ^ 0xfa11` stream (bit-identical
   *  to the pre-extraction build), other sites `settlementFaunaSiteRandom`. */
  random: () => number
  /** Predator-den ring past the footprint; omit for home (`PREDATOR_DEN_RING_OFFSET`). */
  denRing?: readonly [number, number]
  ringSpecs: readonly SpawnSpec[]
  spawnerSpecs: readonly (typeof SPAWNER_SPECS)[number][]
  /** Dry-site gate with a river clearance (water + river bank). */
  isDry: (x: number, z: number, riverClearance: number) => boolean
  onRoad: (x: number, z: number) => boolean
  /** Inland/off-road/non-coastal habitat spawner gate. */
  spawnerSiteOk: (x: number, z: number) => boolean
  /** Species habitat filter for a ring profile (`undefined` = none). */
  ringHabitatFilter: (profile: SpawnProfile) => ((x: number, z: number) => boolean) | undefined
  sampleHeight: HeightSampler
  sampleForestFactor: (x: number, z: number) => number
  /** Large-cave mouths etc. predator dens keep `MIN_PREDATOR_DEN_SEPARATION` from. */
  denAvoidPoints?: readonly XZ[]
  /** Called once after the ring phase, before any spawner is sampled — lets the
   *  caller create ring agents (reading ground height) before spawner carving. */
  onRingPlanned?: (ring: readonly PlannedRingAnimal[]) => void
  /** Called right after each spawner is placed and its prop randoms drawn —
   *  lets the caller apply terrain carving before the next site is sampled
   *  (the home build's carve changes later slope samples). */
  onSpawnerPlaced?: (spawner: PlannedHabitatSpawner) => void
}

/** Random walkable point in `[minDist, maxDist]` of `(cx, cz)`; shared by the planner
 *  and by `createFauna`'s later placements (closed-pressure dens). */
export function findWalkableNearSite(
  args: {
    homeRadius: number
    isDry: (x: number, z: number, riverClearance: number) => boolean
  },
  rng: () => number,
  cx: number,
  cz: number,
  minDist: number,
  maxDist: number,
  filter?: (x: number, z: number) => boolean,
  maxAttempts = 24,
): XZ | null {
  const clampRadius = Math.max(args.homeRadius - 4, maxDist)
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const angle = rng() * Math.PI * 2
    const dist = minDist + rng() * (maxDist - minDist)
    const x = cx + Math.cos(angle) * dist
    const z = cz + Math.sin(angle) * dist
    if (Math.abs(x - cx) > clampRadius || Math.abs(z - cz) > clampRadius) continue
    if (!args.isDry(x, z, SPAWN_RIVER_CLEARANCE)) continue
    if (filter && !filter(x, z)) continue
    return { x, z }
  }
  return null
}

/**
 * Plan one settlement's wild-fauna habitat: ring individuals first, then habitat
 * spawners, consuming `input.random` in exactly the order the inline home build
 * did. Pure apart from the optional `onSpawnerPlaced` hook.
 *
 * @domain fauna
 */
export function planSettlementFaunaHabitats(input: SettlementFaunaPlanInput): SettlementFaunaPlan {
  const { center, footprintRadius, random } = input
  const placedSpawnPoints: XZ[] = []
  const farFromOtherSpawns = (x: number, z: number): boolean =>
    placedSpawnPoints.every((p) => Math.hypot(p.x - x, p.z - z) >= MIN_SPAWN_SEPARATION)
  const near = (
    cx: number,
    cz: number,
    minDist: number,
    maxDist: number,
    filter?: (x: number, z: number) => boolean,
    maxAttempts = 24,
  ): XZ | null => findWalkableNearSite(input, random, cx, cz, minDist, maxDist, filter, maxAttempts)

  // --- ring individuals -----------------------------------------------------
  const ring: PlannedRingAnimal[] = []
  let nextHerdId = 0
  for (const spec of input.ringSpecs) {
    const [minOffset, maxOffset] = SPAWN_RING_OFFSET[spec.profile]
    const habitatFilter = input.ringHabitatFilter(spec.profile)
    const filter = (x: number, z: number) =>
      (!habitatFilter || habitatFilter(x, z)) && farFromOtherSpawns(x, z) && !input.onRoad(x, z)
    const minR = footprintRadius + minOffset
    const maxR = footprintRadius + maxOffset
    const herdTier = HERD_SPECIES[spec.kind]
    if (herdTier) {
      const anchor = near(center.x, center.z, minR, maxR, filter)
      if (!anchor) continue
      placedSpawnPoints.push(anchor)
      const herdId = `${spec.kind}-herd-${nextHerdId++}`
      const [clusterMin, clusterMax] = HERD_CLUSTER_RADIUS[herdTier]
      const adultIndices: number[] = [ring.length]
      ring.push({ kind: spec.kind, x: anchor.x, z: anchor.z, herdId, lifeStage: 'adult' })
      for (let i = 1; i < spec.count; i++) {
        const pos = near(anchor.x, anchor.z, clusterMin, clusterMax) ?? anchor
        adultIndices.push(ring.length)
        ring.push({ kind: spec.kind, x: pos.x, z: pos.z, herdId, lifeStage: 'adult' })
      }
      const juvenileChance = JUVENILE_SPAWN_CHANCE[spec.kind]
      if (juvenileChance) {
        for (const chance of [juvenileChance.first, juvenileChance.second]) {
          if (random() >= chance) continue
          const motherIndex = adultIndices[Math.floor(random() * adultIndices.length)]
          const mother = ring[motherIndex]
          const pos = near(mother.x, mother.z, clusterMin, clusterMax) ?? { x: mother.x, z: mother.z }
          ring.push({ kind: spec.kind, x: pos.x, z: pos.z, herdId, lifeStage: 'juvenile', motherIndex })
        }
      }
      continue
    }
    for (let i = 0; i < spec.count; i++) {
      const pos = near(center.x, center.z, minR, maxR, filter)
      if (!pos) continue
      placedSpawnPoints.push(pos)
      ring.push({ kind: spec.kind, x: pos.x, z: pos.z })
    }
  }

  input.onRingPlanned?.(ring)

  // --- habitat spawners -----------------------------------------------------
  const spawners: PlannedHabitatSpawner[] = []
  const denSpacingPoints: XZ[] = [...(input.denAvoidPoints ?? [])]
  const denSpaced = (x: number, z: number): boolean =>
    denSpacingPoints.every((p) => Math.hypot(p.x - x, p.z - z) >= MIN_PREDATOR_DEN_SEPARATION)
  const spawnerTypeSeen = new Map<PreySpawner['type'], number>()
  for (const spec of input.spawnerSpecs) {
    const seenOfType = spawnerTypeSeen.get(spec.type) ?? 0
    spawnerTypeSeen.set(spec.type, seenOfType + 1)
    const baseFilter = spec.type === 'thicket'
      ? (x: number, z: number) => input.spawnerSiteOk(x, z) && input.sampleForestFactor(x, z) > 0.28
      : input.spawnerSiteOk
    let pos: XZ | null = null
    for (const attempt of habitatSpawnerRingAttempts(spec, input.denRing)) {
      const filter = (x: number, z: number) =>
        baseFilter(x, z) && farFromOtherSpawns(x, z) && (!attempt.denSpacing || denSpaced(x, z))
      const slopedFilter = (x: number, z: number) =>
        filter(x, z) && measureSlope(x, z, CAVE_SLOPE_SAMPLE_RADIUS, input.sampleHeight).drop >= CAVE_MIN_SLOPE_DROP
      const minR = footprintRadius + attempt.ring[0]
      const maxR = footprintRadius + attempt.ring[1]
      pos = (spec.type === 'rockDen'
        ? near(center.x, center.z, minR, maxR, slopedFilter, 72)
        : null)
        ?? near(center.x, center.z, minR, maxR, filter, 72)
      if (pos) break
    }
    if (!pos) continue
    placedSpawnPoints.push(pos)
    if (isPredatorDenSpec(spec)) denSpacingPoints.push(pos)
    const groundY = input.sampleHeight(pos.x, pos.z)
    const slope = spec.type === 'rockDen'
      ? measureSlope(pos.x, pos.z, CAVE_SLOPE_SAMPLE_RADIUS, input.sampleHeight)
      : null
    const propRandoms = spec.type === 'thicket' ? [random(), random()] : [random()]
    const planned: PlannedHabitatSpawner = {
      spec,
      id: spawnerId(input.settlementId, spec.type, spec.kind, seenOfType),
      x: pos.x,
      z: pos.z,
      groundY,
      slope,
      propRandoms,
    }
    spawners.push(planned)
    input.onSpawnerPlaced?.(planned)
  }

  return { ring, spawners, placedSpawnPoints }
}
