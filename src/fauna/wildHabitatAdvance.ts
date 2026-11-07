import type { AnimalKind, AnimalSaveState } from './AnimalAgent'
import { resolveInjuryRecovery } from '../shared/injuryRecovery'
import { createStaminaState } from '../shared/StaminaState'
import { gameDaysToRealSeconds } from '../world/timeConversion'
import { corpseLingerDays } from './animalCorpse'
import { ANIMAL_DEFS } from './animalDefs'
import { type AnimalLifeState, createAnimalLifeState, NEED_ELEVATED_THRESHOLD, tickAnimalLife } from './AnimalLife'
import {
  canUseDepletedNaturalRecovery,
  depletedRecoveryIntervalDays,
  MIN_RECOVERY_POPULATION,
  type PreySpawner,
  respawnIntervalDaysFor,
  SPAWNER_RADIUS,
  tickSpawnPointRecovery,
} from './AnimalSpawner'
import { MAX_HP } from './faunaCombat'
import { faunaEventRandom } from './faunaEventRandom'
import { JUVENILE_MATURITY_SECONDS } from './herdCohesion'
import { ordinaryHabitatCapacity } from './persistentOccupants'
import { type WildFaunaRecord, type WildRecordOrigin, wildSexFromRoll } from './wildFaunaRecords'
import { effectiveMaxPreyCount, effectiveRespawnIntervalDays } from './wolfDenScenario'

/**
 * @domain fauna
 * @system wild-fauna-records
 * @role Common world-time transition of one wild habitat (plan fauna-050 C3).
 *  ONE path for dormant promote / load, time skip and rebuild: pure functions over
 *  records + the spawner's lifecycle fields, event-driven (not day quanta), with no
 *  day cap. Conservation per record, births / immigration per Q035-b (c) and
 *  Q160-a (b). No Three.js, no agents; the caller owns terrain placement
 *  (`createRecord`) and applies the returned events.
 */

/** Dormant animals are presumed to forage: needs never rise above this offscreen, so there is
 *  no starvation death during a dormant span. 🟡 = the shared "start searching" threshold. */
export const OFFSCREEN_NEED_CEILING = NEED_ELEVATED_THRESHOLD

/** One placed creation decided by the lifecycle (live respawn and `advance` share it). */
export type WildCreationPlan =
  | { origin: 'birth', mother: WildCreationMember, rng: () => number }
  | { origin: 'immigrant', rng: () => number }

/** Minimal view of a habitat member for birth-vs-immigration and mother pick. */
export type WildCreationMember = {
  animalId: string
  kind: string
  sex: 'female' | 'male'
  alive: boolean
  juvenile: boolean
}

/**
 * Birth-vs-immigration rule (Q160-a (b)): an alive adult female of the spawner's kind in the habitat
 * -> birth (mother picked by `birth:<habitatId>:<seq>` over candidates sorted by id); otherwise an
 * adult immigrates at the spawner. The returned `rng` is the keyed stream with the mother draw
 * already consumed, to be reused for placement.
 */
export function planWildCreation(
  spawner: Pick<PreySpawner, 'id' | 'kind'>,
  seq: number,
  members: readonly WildCreationMember[],
  seed: number,
): WildCreationPlan {
  const rng = faunaEventRandom(seed, `birth:${spawner.id}:${seq}`)
  const mothers = members
    .filter((m) => m.alive && !m.juvenile && m.sex === 'female' && m.kind === spawner.kind)
    .sort((a, b) => (a.animalId < b.animalId ? -1 : a.animalId > b.animalId ? 1 : 0))
  if (mothers.length === 0) return { origin: 'immigrant', rng }
  const mother = mothers[Math.min(mothers.length - 1, Math.floor(rng() * mothers.length))]
  return { origin: 'birth', mother, rng }
}

export type WildFaunaEvent =
  | { kind: 'birth' | 'immigration', atDays: number, habitatId: string, seq: number, record: WildFaunaRecord }
  | { kind: 'removal', atDays: number, habitatId: string, animalId: string }
  | { kind: 'matured', atDays: number, habitatId: string, animalId: string }

export type AdvanceWildHabitatInput = {
  spawner: PreySpawner
  /** All records of this habitat (`habitatId === spawner.id`); mutated in place. */
  records: WildFaunaRecord[]
  fromDays: number
  toDays: number
  seed: number
  dayLengthSec: number
  /** Alive animals of `kind` within `r` of (x, z) from OTHER habitats (active + dormant). The
   *  habitat's own records are counted by `advance` itself. */
  countKindNear: (kind: string, x: number, z: number, r: number) => number
  /** Persistent-occupant slots that reduce ordinary capacity (live, corpse or tombstone). */
  reservedPersistentSlots?: number
  /** Builds the record of one creation (placement, HP, needs live in the caller). */
  createRecord: (spec: {
    spawner: PreySpawner
    seq: number
    origin: WildRecordOrigin
    atDays: number
    sex: 'female' | 'male'
    mother?: WildFaunaRecord
    rng: () => number
  }) => WildFaunaRecord | null
}

const EPS = 1e-9

function memberOf(record: WildFaunaRecord): WildCreationMember {
  return {
    animalId: record.animalId,
    kind: record.kind,
    sex: record.sex,
    alive: !record.state.health.dead,
    juvenile: record.state.lifeStage === 'juvenile',
  }
}

/** Advances one record's own state from `record.advancedAtDays` to `toDays` (conservation). */
function advanceRecordState(
  record: WildFaunaRecord,
  toDays: number,
  dayLengthSec: number,
  events: WildFaunaEvent[],
  drop: Set<string>,
): void {
  const from = record.advancedAtDays
  if (!(toDays > from)) return
  const state = record.state
  if (state.health.dead) {
    const corpse = state.corpse
    if (corpse) {
      const removeAt = corpse.meatHarvested
        ? (corpse.harvestedAtDays ?? corpse.deathAtDays) + corpseLingerDays(true)
        : corpse.deathAtDays + corpseLingerDays(false)
      if (removeAt <= toDays + EPS) {
        drop.add(record.animalId)
        events.push({ kind: 'removal', atDays: Math.max(from, removeAt), habitatId: record.habitatId, animalId: record.animalId })
      }
    }
    record.advancedAtDays = toDays
    return
  }
  const elapsedSec = gameDaysToRealSeconds(toDays - from, dayLengthSec)
  const def = ANIMAL_DEFS[record.kind]
  const life: AnimalLifeState = {
    hunger: state.life.hunger,
    thirst: state.life.thirst,
    stamina: { ...createStaminaState(def.metabolism.staminaCapacity), current: state.life.stamina * def.metabolism.staminaCapacity },
  }
  tickAnimalLife(life, elapsedSec, false, {}, def.metabolism)
  // Dormant animals forage: needs rest at the ceiling, never starve (no offscreen starvation death).
  state.life = {
    hunger: Math.min(life.hunger, OFFSCREEN_NEED_CEILING),
    thirst: Math.min(life.thirst, OFFSCREEN_NEED_CEILING),
    stamina: life.stamina.max > 0 ? life.stamina.current / life.stamina.max : 0,
  }
  if (state.lifeStage === 'juvenile') {
    const before = state.ageSec ?? 0
    const after = before + elapsedSec
    if (after >= JUVENILE_MATURITY_SECONDS) {
      const matureAt = from + (JUVENILE_MATURITY_SECONDS - before) / dayLengthSec
      delete state.lifeStage
      delete state.ageSec
      delete state.motherId
      events.push({ kind: 'matured', atDays: Math.max(from, matureAt), habitatId: record.habitatId, animalId: record.animalId })
    } else {
      state.ageSec = after
    }
  }
  if (state.physicalInjury && state.physicalInjury > 0) {
    const host = {
      health: { currentHp: state.health.current, maxHp: state.health.max, dead: false },
      physicalInjury: state.physicalInjury,
      injuryRecoveryUpdatedAtDays: state.injuryRecoveryUpdatedAtDays,
    }
    resolveInjuryRecovery(host, toDays)
    state.health = { ...state.health, current: host.health.currentHp }
    state.physicalInjury = host.physicalInjury
    state.injuryRecoveryUpdatedAtDays = host.injuryRecoveryUpdatedAtDays
  }
  record.advancedAtDays = toDays
}

/**
 * Conservation-only advance of records that belong to no spawner (ring individuals, orphaned
 * habitats): needs, juvenile age, injury, corpse removal. Returns the removal/maturity events.
 */
export function advanceWildRecords(
  records: WildFaunaRecord[],
  toDays: number,
  dayLengthSec: number,
): WildFaunaEvent[] {
  const events: WildFaunaEvent[] = []
  const drop = new Set<string>()
  for (const r of records) advanceRecordState(r, toDays, dayLengthSec, events, drop)
  for (const id of drop) {
    const i = records.findIndex((r) => r.animalId === id)
    if (i >= 0) records.splice(i, 1)
  }
  return events.sort((a, b) => a.atDays - b.atDays)
}

/** Initial persisted state of a newly created wild individual (adult or juvenile). Variant-free. */
export function freshWildAnimalState(input: {
  kind: AnimalKind
  x: number
  z: number
  yaw: number
  lifeOffset: number
  juvenileOf?: string
}): AnimalSaveState {
  const def = ANIMAL_DEFS[input.kind]
  const life = createAnimalLifeState(input.lifeOffset, def.metabolism)
  return {
    x: input.x,
    z: input.z,
    yaw: input.yaw,
    ...(input.juvenileOf ? { lifeStage: 'juvenile' as const, ageSec: 0, motherId: input.juvenileOf } : {}),
    health: { current: MAX_HP[input.kind], max: MAX_HP[input.kind], dead: false },
    life: { hunger: life.hunger, thirst: life.thirst, stamina: 1 },
    productionReadyAtDays: null,
    eggPending: false,
    corpse: null,
  }
}

/**
 * Advances one habitat from `fromDays` to `toDays`. Mutates `spawner` (timers, state, birth cursor),
 * mutates `records` in place and appends creations to it; returns the ordered events. Idempotent for
 * `toDays <= fromDays`. Splitting `[from, to]` at any point yields the same result (the timer and
 * the per-record cursor carry the remainder) up to float error.
 *
 * Birth / immigration / depletion recovery fire exactly at their due time (loaded play fires at the
 * first frame at or after it). Only bubble deaths can change the live count while dormant, so the
 * count is constant between events. The wolf-den problem scenario and settlement trips are excluded
 * offscreen (the contract), their windows simply elapse.
 *
 * Deviation: habitats are advanced one call at a time (caller orders by habitat id) instead of one
 * global `(atDays, habitatId, key)` queue; only the `disabled/recovering` predicate reads other habitats.
 */
export function advanceWildHabitat(input: AdvanceWildHabitatInput): { events: WildFaunaEvent[] } {
  const { spawner, records, fromDays, toDays, seed, dayLengthSec } = input
  const events: WildFaunaEvent[] = []
  if (!(toDays > fromDays) || !(dayLengthSec > 0)) return { events }
  const reserved = input.reservedPersistentSlots ?? 0
  const drop = new Set<string>()
  const live = (): WildFaunaRecord[] => records.filter((r) => !drop.has(r.animalId))
  const boundCount = (): number =>
    live().filter((r) => r.kind === spawner.kind && !r.state.health.dead).length

  // Per-record state is advanced lazily to each event time, then to `toDays`.
  const advanceRecordsTo = (t: number): void => {
    for (const r of live()) advanceRecordState(r, t, dayLengthSec, events, drop)
  }

  /** Returns false when placement failed (live semantics: the attempt ends the pass, time is kept). */
  const create = (t: number): boolean => {
    advanceRecordsTo(t)
    const seq = spawner.nextBirthSeq ?? 0
    const plan = planWildCreation(spawner, seq, live().map(memberOf), seed)
    const id = `${spawner.id}:b${seq}`
    const sex = wildSexFromRoll(faunaEventRandom(seed, `sex:${id}`)())
    const mother = plan.origin === 'birth' ? records.find((r) => r.animalId === plan.mother.animalId) : undefined
    const record = input.createRecord({ spawner, seq, origin: plan.origin, atDays: t, sex, mother, rng: plan.rng })
    if (!record) return false
    spawner.nextBirthSeq = seq + 1
    record.advancedAtDays = t
    records.push(record)
    events.push({
      kind: plan.origin === 'birth' ? 'birth' : 'immigration',
      atDays: t,
      habitatId: spawner.id,
      seq,
      record,
    })
    return true
  }

  const cap = (): number => ordinaryHabitatCapacity(effectiveMaxPreyCount(spawner), reserved)
  let t = fromDays
  // Daily check boundaries follow the live convention: floor of world days changes.
  let lastCheckDay = Math.floor(fromDays)
  let guard = 0
  while (t < toDays - EPS && guard++ < 100000) {
    if (spawner.state === 'active') {
      const base = effectiveRespawnIntervalDays(spawner)
      if (!Number.isFinite(base) || base <= 0) break
      const bound = boundCount()
      if (bound >= cap()) {
        spawner.daysSinceLastRespawn = 0
        break
      }
      const interval = respawnIntervalDaysFor(base, bound)
      const due = Math.max(0, interval - spawner.daysSinceLastRespawn)
      if (t + due > toDays + EPS) {
        spawner.daysSinceLastRespawn += toDays - t
        break
      }
      t = Math.min(toDays, t + due)
      spawner.daysSinceLastRespawn = spawner.daysSinceLastRespawn + due - interval
      if (!create(t)) {
        spawner.daysSinceLastRespawn += interval
        break
      }
      if (boundCount() >= cap()) spawner.daysSinceLastRespawn = 0
      continue
    }
    if (spawner.state === 'depleted') {
      if (!canUseDepletedNaturalRecovery(spawner, reserved > 0 ? new Map([[spawner.id, reserved]]) : undefined)) {
        break
      }
      const bound = boundCount()
      if (bound >= MIN_RECOVERY_POPULATION || bound >= cap()) {
        spawner.depletedRecoveryDays += toDays - t
        break
      }
      const interval = depletedRecoveryIntervalDays(bound)
      const due = Math.max(0, interval - spawner.depletedRecoveryDays)
      if (t + due > toDays + EPS) {
        spawner.depletedRecoveryDays += toDays - t
        break
      }
      t = Math.min(toDays, t + due)
      spawner.depletedRecoveryDays = spawner.depletedRecoveryDays + due - interval
      if (!create(t)) {
        spawner.depletedRecoveryDays += interval
        break
      }
      if (boundCount() >= MIN_RECOVERY_POPULATION) {
        spawner.state = 'active'
        spawner.deathsThisCycle = 0
        spawner.depletedRecoveryDays = 0
        spawner.daysSinceLastRespawn = 0
      }
      continue
    }
    if (spawner.state === 'disabled' || spawner.state === 'recovering') {
      // Next integer day boundary strictly after the current cursor.
      const day = Math.floor(Math.max(t, lastCheckDay)) + 1
      if (day > toDays + EPS) {
        break
      }
      lastCheckDay = day
      t = day
      advanceRecordsTo(t)
      let nearby = input.countKindNear(spawner.kind, spawner.x, spawner.z, SPAWNER_RADIUS)
      for (const r of live()) {
        if (r.kind !== spawner.kind || r.state.health.dead) continue
        if (Math.hypot(r.state.x - spawner.x, r.state.z - spawner.z) < SPAWNER_RADIUS) nearby++
      }
      tickSpawnPointRecovery(spawner, t, nearby)
      continue
    }
    t = toDays
  }
  advanceRecordsTo(toDays)
  for (const id of drop) {
    const i = records.findIndex((r) => r.animalId === id)
    if (i >= 0) records.splice(i, 1)
  }
  spawner.advancedAtDays = toDays
  events.sort((a, b) => a.atDays - b.atDays)
  return { events }
}
