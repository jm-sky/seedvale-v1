import type { EconomyRegistry } from '../economy/registry'
import type { ExpeditionAssignment } from '../world/expeditionAssignment'
import type { HouseholdRegistry, HouseholdSnapshot } from './household'
import type { NpcAuthoritativeState, NpcId } from './npcState'
import { observeNpcTravelArrival } from '../ai/npcTravel'
import { isTentItemInstance } from '../items/itemInstances'
import {
  foundedHomePlaceId,
  foundedHouseholdId,
  foundedSettlementId,
  type FoundedSettlementRecord,
  type FoundedSettlementRegistry,
  foundedTentId,
} from './foundedSettlement'

/** Reusable operation input (plan settlements-003 §"Bootstrap API") — the
 *  caller (a quest/consumer) selects the expedition and validates
 *  site-readiness; this transaction never chooses either. */
export type BootstrapFoundedSettlementInput = {
  /** Stable destination/site id — the founded settlement id is derived from
   *  this, never randomized. */
  siteId: string
  x: number
  z: number
  sponsorSettlementId: string
  /** Only `id`/`memberNpcIds` are read — this transaction never advances or
   *  reselects the assignment itself. */
  assignment: Pick<ExpeditionAssignment, 'id' | 'memberNpcIds'>
  /** Caller-validated site-readiness result (plan world-019's
   *  `querySiteInfrastructure` + the caller's own policy). This transaction
   *  does not hard-code readiness thresholds. */
  siteReady: boolean
  nowDays: number
}

export type BootstrapFoundedSettlementFailureReason =
  | 'site-not-ready'
  | 'missing-npc-state'
  | 'member-dead'
  | 'not-travelling-for-this-assignment'
  | 'travel-blocked'
  | 'not-arrived'
  | 'missing-tent-instance'

/** Persistent corruption/conflict reasons (plan settlements-020) — distinct
 *  from `BootstrapFoundedSettlementFailureReason`'s transient "try later"
 *  cases. A caller must not treat these as retryable. */
export type BootstrapFoundedSettlementInconsistencyReason =
  | 'settlement-id-mismatch'
  | 'sponsor-mismatch'
  | 'member-set-mismatch'
  | 'household-binding-conflict'
  | 'missing-founded-tent'
  | 'tent-placement-conflict'
  | 'unrecognized-legacy-state'

export type BootstrapFoundedSettlementResult =
  | { status: 'created', settlementId: string }
  | { status: 'existing', settlementId: string }
  | { status: 'not_ready', reason: BootstrapFoundedSettlementFailureReason }
  | { status: 'inconsistent', reason: BootstrapFoundedSettlementInconsistencyReason }

/** Minimal `PlacedTents` slice this transaction needs — narrower than the
 *  full type so unit tests don't need a real `Scene`/`HeightSampler`. Widened
 *  (plan settlements-020) beyond bare `id` to the transform/condition fields
 *  needed for placement-consistency checks and legacy relocation. */
export type FoundedSettlementTentsDeps = {
  get: (id: string) => {
    id: string
    x: number
    z: number
    yaw: number
    condition: number
    lastConditionUpdateAtDays: number
  } | null
  place: (
    x: number,
    z: number,
    yaw: number,
    worldDays: number,
    from?: { id: string, condition: number },
  ) => unknown
  relocate: (id: string, x: number, z: number, yaw: number) => boolean
}

export type BootstrapFoundedSettlementDeps = {
  founded: FoundedSettlementRegistry
  getNpcState: (id: NpcId) => NpcAuthoritativeState | undefined
  households: HouseholdRegistry
  economies: EconomyRegistry
  placedTents: FoundedSettlementTentsDeps
}

/** Deliberate zero-supply starting snapshot (plan settlements-003 §"Households")
 *  — a founding household must not silently mint the usual jittered starting
 *  food/wood/water a brand-new procedural household gets; expedition
 *  provisioning (settlements-npcs-027/028) is the only intended source. */
const FOUNDED_HOUSEHOLD_ZERO_SNAPSHOT: HouseholdSnapshot = {
  water: 0,
  items: { counts: {}, instances: [] },
  agriculture: { starterSeedsGranted: true },
}

/** Small fixed-radius ring — a compact founding camp, never village planning. */
const FOUNDED_CAMP_RING_RADIUS_METERS = 4
/** Legacy Stage-3 bootstrap always placed founding tents at exactly this yaw. */
const FOUNDED_LEGACY_TENT_YAW = 0
/** Small epsilon for saved-float position/yaw comparisons — not bit-exact JSON floats. */
const FOUNDED_POSITION_EPSILON = 0.05

/** Same xor/FNV idiom used throughout `settlement/`/`world/` for small
 *  deterministic per-string derivations (e.g. `household.ts`'s starting
 *  stock jitter) — kept local rather than a shared utility, matching that
 *  convention. */
function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export type FoundedCampPlacement = {
  npcId: NpcId
  x: number
  z: number
  yaw: number
}

/**
 * Deterministic, bounded camp layout for founding tents (plan
 * settlements-020) — a small non-overlapping ring around the settlement
 * center, rotated by a stable hash of `settlementId` so placement and yaw
 * never depend on frame/runtime RNG or a new seed field. First creation,
 * repeat-call validation, and legacy reconciliation all call this same
 * helper so they agree on "expected" placement.
 *
 * @domain settlements
 */
export function resolveFoundedCampLayout(
  settlementId: string,
  centerX: number,
  centerZ: number,
  residentNpcIds: readonly NpcId[],
): readonly FoundedCampPlacement[] {
  const baseAngle = (hashString(`${settlementId}:camp`) % 360) * (Math.PI / 180)
  const angleStep = (2 * Math.PI) / Math.max(1, residentNpcIds.length)
  return residentNpcIds.map((npcId, index) => {
    const angle = baseAngle + angleStep * index
    return {
      npcId,
      x: centerX + FOUNDED_CAMP_RING_RADIUS_METERS * Math.cos(angle),
      z: centerZ + FOUNDED_CAMP_RING_RADIUS_METERS * Math.sin(angle),
      yaw: angle,
    }
  })
}

function approxEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= FOUNDED_POSITION_EPSILON
}

function matchesPlacement(
  tent: { x: number, z: number, yaw: number },
  expected: { x: number, z: number, yaw: number },
): boolean {
  return approxEqual(tent.x, expected.x) && approxEqual(tent.z, expected.z) && approxEqual(tent.yaw, expected.yaw)
}

function matchesLegacyPlacement(tent: { x: number, z: number, yaw: number }, record: FoundedSettlementRecord): boolean {
  return approxEqual(tent.x, record.x) && approxEqual(tent.z, record.z) && approxEqual(tent.yaw, FOUNDED_LEGACY_TENT_YAW)
}

function sameMemberOrder(a: readonly NpcId[], b: readonly NpcId[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

type ResolvedFounder = {
  npcId: NpcId
  state: NpcAuthoritativeState
  /** `undefined` when this founder's stable tent already exists (repeat call
   *  path, or a validated pre-existing tent) and no instance should be
   *  consumed/placed. */
  tentInstanceId: string | undefined
  tentCondition: number
}

/**
 * Reusable, idempotent expedition-arrival -> settlement transaction (plan
 * settlements-003, correctness pass in settlements-020). Validates every
 * fallible precondition — assignment member travel arrival, site readiness,
 * tent-instance availability, stable-id conflicts, deterministic camp
 * placement — before any irreversible mutation (tent-instance removal,
 * residency change, household/economy creation). A settlement that already
 * exists for `siteId` short-circuits to a validated `existing`/`inconsistent`
 * result without re-consuming anything.
 *
 * @domain settlements
 * @system founded-settlement
 * @role Turns an arrived expedition into ordinary founded-settlement/household/economy state.
 */
export function bootstrapFoundedSettlement(
  input: BootstrapFoundedSettlementInput,
  deps: BootstrapFoundedSettlementDeps,
): BootstrapFoundedSettlementResult {
  const settlementId = foundedSettlementId(input.siteId)
  const existing = deps.founded.get(settlementId)
  if (existing) return reconcileExistingFoundedSettlement(input, deps, settlementId, existing)

  if (!input.siteReady) return { status: 'not_ready', reason: 'site-not-ready' }

  // `memberNpcIds` is a fixed 3-tuple (`EXPEDITION_PARTY_SIZE`) — always
  // non-empty by the assignment's own type contract.
  const memberNpcIds = input.assignment.memberNpcIds
  const layout = resolveFoundedCampLayout(settlementId, input.x, input.z, memberNpcIds)

  // Preflight — resolve every fallible precondition without mutating anything.
  const resolved: ResolvedFounder[] = []
  for (let index = 0; index < memberNpcIds.length; index++) {
    const npcId = memberNpcIds[index]!
    const expected = layout[index]!

    const state = deps.getNpcState(npcId)
    if (!state) return { status: 'not_ready', reason: 'missing-npc-state' }
    if (state.health.dead) return { status: 'not_ready', reason: 'member-dead' }
    const travel = state.travel
    if (!travel || travel.purpose?.kind !== 'expedition' || travel.purpose.assignmentId !== input.assignment.id) {
      return { status: 'not_ready', reason: 'not-travelling-for-this-assignment' }
    }
    if (travel.blocked) return { status: 'not_ready', reason: 'travel-blocked' }
    if (travel.arrival !== 'reached') return { status: 'not_ready', reason: 'not-arrived' }

    // A stable household id must not already be bound to something else —
    // never silently adopted just because the id string matches.
    if (deps.households.get(foundedHouseholdId(settlementId, npcId))) {
      return { status: 'inconsistent', reason: 'household-binding-conflict' }
    }

    const tentId = foundedTentId(settlementId, npcId)
    const preexistingTent = deps.placedTents.get(tentId)
    if (preexistingTent) {
      // A pre-existing stable tent id is only adoptable when its full
      // physical binding already matches the expected deterministic
      // placement — never call `place()` again for this id either way.
      if (!matchesPlacement(preexistingTent, expected)) {
        return { status: 'inconsistent', reason: 'tent-placement-conflict' }
      }
      resolved.push({ npcId, state, tentInstanceId: undefined, tentCondition: preexistingTent.condition })
      continue
    }
    const tentInstance = state.personalInventory.getInstances('tent').find(isTentItemInstance)
    if (!tentInstance) return { status: 'not_ready', reason: 'missing-tent-instance' }
    resolved.push({ npcId, state, tentInstanceId: tentInstance.id, tentCondition: tentInstance.condition })
  }

  // Commit — every precondition above held for every founder.
  const record: FoundedSettlementRecord = {
    id: settlementId,
    siteId: input.siteId,
    x: input.x,
    z: input.z,
    sponsorSettlementId: input.sponsorSettlementId,
    residentNpcIds: [...memberNpcIds],
    foundedAtDays: input.nowDays,
  }
  deps.founded.create(record)
  deps.economies.getOrCreate({
    id: settlementId,
    size: 'OUTPOST',
    foodSourceType: 'foraging',
    familyCount: memberNpcIds.length,
    dominantResource: null,
  })

  for (let index = 0; index < resolved.length; index++) {
    const founder = resolved[index]!
    const expected = layout[index]!
    deps.founded.setResidency(founder.npcId, settlementId)
    const tentId = foundedTentId(settlementId, founder.npcId)
    if (founder.tentInstanceId) {
      founder.state.personalInventory.removeInstance(founder.tentInstanceId)
      deps.placedTents.place(expected.x, expected.z, expected.yaw, input.nowDays, { id: tentId, condition: founder.tentCondition })
    }
    deps.households.getOrCreate(
      foundedHouseholdId(settlementId, founder.npcId),
      settlementId,
      foundedHomePlaceId(settlementId, founder.npcId),
      undefined,
      FOUNDED_HOUSEHOLD_ZERO_SNAPSHOT,
    )
    observeNpcTravelArrival(founder.state)
  }

  return { status: 'created', settlementId }
}

type FounderTentStatus = 'expected' | 'legacy'

/**
 * Repeat-call / legacy-reconciliation path for an already-existing founded
 * record (plan settlements-020). Two phases: first classify every founder's
 * tent/household as already-correct, recognized-legacy-Stage-3, or
 * inconsistent, without mutating anything; only once the *entire* set is
 * accounted for does it apply residency/home repairs and relocate legacy
 * tents. A missing physical tent is never minted here — that is persistent
 * corruption, not a transient "try later" case.
 */
function reconcileExistingFoundedSettlement(
  input: BootstrapFoundedSettlementInput,
  deps: BootstrapFoundedSettlementDeps,
  settlementId: string,
  existing: FoundedSettlementRecord,
): BootstrapFoundedSettlementResult {
  if (existing.id !== settlementId || existing.siteId !== input.siteId) {
    return { status: 'inconsistent', reason: 'settlement-id-mismatch' }
  }
  if (existing.sponsorSettlementId !== input.sponsorSettlementId) {
    return { status: 'inconsistent', reason: 'sponsor-mismatch' }
  }
  if (!sameMemberOrder(existing.residentNpcIds, input.assignment.memberNpcIds)) {
    return { status: 'inconsistent', reason: 'member-set-mismatch' }
  }

  const layout = resolveFoundedCampLayout(settlementId, existing.x, existing.z, existing.residentNpcIds)
  const tentStatus = new Map<NpcId, FounderTentStatus>()

  // Phase 1 — inspect the entire set before touching anything.
  for (let index = 0; index < existing.residentNpcIds.length; index++) {
    const npcId = existing.residentNpcIds[index]!
    const expected = layout[index]!
    const tent = deps.placedTents.get(foundedTentId(settlementId, npcId))
    if (!tent) return { status: 'inconsistent', reason: 'missing-founded-tent' }
    if (matchesPlacement(tent, expected)) tentStatus.set(npcId, 'expected')
    else if (matchesLegacyPlacement(tent, existing)) tentStatus.set(npcId, 'legacy')
    else return { status: 'inconsistent', reason: 'unrecognized-legacy-state' }

    const household = deps.households.get(foundedHouseholdId(settlementId, npcId))
    if (household) {
      const expectedHomeId = foundedHomePlaceId(settlementId, npcId)
      const legacyHomeId = foundedTentId(settlementId, npcId)
      const validBinding = household.settlementId === settlementId
        && (household.homeId === expectedHomeId || household.homeId === legacyHomeId)
      if (!validBinding) return { status: 'inconsistent', reason: 'household-binding-conflict' }
    }
  }

  // Phase 2 — every founder classified as expected/legacy; apply repairs.
  for (let index = 0; index < existing.residentNpcIds.length; index++) {
    const npcId = existing.residentNpcIds[index]!
    const expected = layout[index]!
    deps.founded.setResidency(npcId, settlementId)

    if (tentStatus.get(npcId) === 'legacy') {
      deps.placedTents.relocate(foundedTentId(settlementId, npcId), expected.x, expected.z, expected.yaw)
    }

    const householdId = foundedHouseholdId(settlementId, npcId)
    const homeId = foundedHomePlaceId(settlementId, npcId)
    const household = deps.households.get(householdId)
    if (household) {
      if (household.homeId !== homeId) deps.households.rebindHome(householdId, settlementId, homeId)
    } else {
      deps.households.getOrCreate(householdId, settlementId, homeId, undefined, FOUNDED_HOUSEHOLD_ZERO_SNAPSHOT)
    }
  }

  deps.economies.getOrCreate({
    id: settlementId,
    size: 'OUTPOST',
    foodSourceType: 'foraging',
    familyCount: existing.residentNpcIds.length,
    dominantResource: null,
  })

  return { status: 'existing', settlementId }
}
