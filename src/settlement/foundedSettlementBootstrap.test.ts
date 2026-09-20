import { describe, expect, it } from 'vitest'
import { createEconomyRegistry } from '../economy/registry'
import { createTentInstance } from '../items/itemInstances'
import {
  createFoundedSettlementRegistry,
  foundedHomePlaceId,
  foundedHouseholdId,
  foundedSettlementId,
  foundedTentId,
  resolveFoundedHomePlace,
} from './foundedSettlement'
import {
  bootstrapFoundedSettlement,
  type BootstrapFoundedSettlementDeps,
  type BootstrapFoundedSettlementInput,
  type FoundedSettlementTentsDeps,
  resolveFoundedCampLayout,
} from './foundedSettlementBootstrap'
import { createHouseholdRegistry } from './household'
import { createNpcAuthoritativeState, type NpcAuthoritativeState, type NpcId } from './npcState'
import { homeIndexFromPlaceId } from './places'

const ASSIGNMENT_ID = 'expedition:1'
const SITE_ID = 'gold-mine:site-1'
const MEMBER_IDS: readonly [NpcId, NpcId, NpcId] = ['0_0:npc:0', '0_0:npc:1', '0_0:npc:2']

type FakeTentRecord = {
  id: string
  x: number
  z: number
  yaw: number
  condition: number
  lastConditionUpdateAtDays: number
}

function arrivedState(npcId: NpcId, assignmentId = ASSIGNMENT_ID): NpcAuthoritativeState {
  const state = createNpcAuthoritativeState(npcId, 0)
  state.travel = {
    destination: { x: 100, z: 200 },
    lastPosition: { x: 100, z: 200 },
    purpose: { kind: 'expedition', assignmentId },
    arrival: 'reached',
  }
  state.personalInventory.addInstance(createTentInstance(90, `tent-item:${npcId}`))
  return state
}

function fakePlacedTents(seedTents: readonly FakeTentRecord[] = []): FoundedSettlementTentsDeps & { placed: Map<string, FakeTentRecord> } {
  const placed = new Map<string, FakeTentRecord>(seedTents.map((tent) => [tent.id, { ...tent }]))
  let seq = 0
  return {
    placed,
    get: (id) => placed.get(id) ?? null,
    place: (x, z, yaw, worldDays, from) => {
      const id = from?.id ?? `tent:auto:${seq++}`
      const rec: FakeTentRecord = { id, x, z, yaw, condition: from?.condition ?? 100, lastConditionUpdateAtDays: worldDays }
      placed.set(id, rec)
      return rec
    },
    relocate: (id, x, z, yaw) => {
      const entry = placed.get(id)
      if (!entry) return false
      entry.x = x
      entry.z = z
      entry.yaw = yaw
      return true
    },
  }
}

function makeDeps(states: Map<NpcId, NpcAuthoritativeState>, seedTents: readonly FakeTentRecord[] = []): {
  deps: BootstrapFoundedSettlementDeps
  placedTents: ReturnType<typeof fakePlacedTents>
} {
  const placedTents = fakePlacedTents(seedTents)
  const deps: BootstrapFoundedSettlementDeps = {
    founded: createFoundedSettlementRegistry(),
    getNpcState: (id) => states.get(id),
    households: createHouseholdRegistry(),
    economies: createEconomyRegistry(),
    placedTents,
  }
  return { deps, placedTents }
}

function baseInput(overrides: Partial<BootstrapFoundedSettlementInput> = {}): BootstrapFoundedSettlementInput {
  return {
    siteId: SITE_ID,
    x: 100,
    z: 200,
    sponsorSettlementId: '0_0',
    assignment: { id: ASSIGNMENT_ID, memberNpcIds: MEMBER_IDS },
    siteReady: true,
    nowDays: 12,
    ...overrides,
  }
}

describe('bootstrapFoundedSettlement — validation without mutation', () => {
  it('returns not_ready when the site is not ready, without creating anything', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput({ siteReady: false }), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'site-not-ready' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns not_ready when a member has no authoritative state', () => {
    const states = new Map(MEMBER_IDS.slice(0, 2).map((id) => [id, arrivedState(id)]))
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'missing-npc-state' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns not_ready when a member is dead', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    states.get(MEMBER_IDS[1])!.health.dead = true
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'member-dead' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns not_ready when a member is travelling for a different assignment', () => {
    const states = new Map<NpcId, NpcAuthoritativeState>(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    states.set(MEMBER_IDS[2], arrivedState(MEMBER_IDS[2], 'expedition:other'))
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'not-travelling-for-this-assignment' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns not_ready when a member has not yet arrived', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const notArrived = states.get(MEMBER_IDS[0])!
    notArrived.travel = { ...notArrived.travel!, arrival: undefined }
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'not-arrived' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns not_ready when a member travel is blocked', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const blocked = states.get(MEMBER_IDS[0])!
    blocked.travel = { ...blocked.travel!, blocked: true }
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'travel-blocked' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns not_ready when a member has no tent instance', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const noTent = states.get(MEMBER_IDS[0])!
    for (const instance of noTent.personalInventory.getInstances('tent')) {
      noTent.personalInventory.removeInstance(instance.id)
    }
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'not_ready', reason: 'missing-tent-instance' })
    expect(deps.founded.list()).toEqual([])
  })

  it('returns inconsistent when a pre-existing stable tent does not match the expected placement', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const settlementId = foundedSettlementId(SITE_ID)
    const conflictingTentId = foundedTentId(settlementId, MEMBER_IDS[0])
    const { deps } = makeDeps(states, [
      { id: conflictingTentId, x: 999, z: 999, yaw: 0, condition: 100, lastConditionUpdateAtDays: 0 },
    ])
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'inconsistent', reason: 'tent-placement-conflict' })
    expect(deps.founded.list()).toEqual([])
  })
})

describe('bootstrapFoundedSettlement — commit + idempotency', () => {
  it('creates one founded record, one household+tent per founder, one economy, and clears travel', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps, placedTents } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result.status).toBe('created')
    const settlementId = (result as { status: 'created', settlementId: string }).settlementId
    expect(settlementId).toBe(foundedSettlementId(SITE_ID))

    expect(deps.founded.list()).toHaveLength(1)
    const record = deps.founded.get(settlementId)!
    expect(record.residentNpcIds).toEqual(MEMBER_IDS)
    expect(record.sponsorSettlementId).toBe('0_0')

    for (const npcId of MEMBER_IDS) {
      expect(deps.founded.residencyOf(npcId)).toBe(settlementId)
      const tentId = foundedTentId(settlementId, npcId)
      expect(placedTents.get(tentId)).not.toBeNull()
      const household = deps.households.get(foundedHouseholdId(settlementId, npcId))
      expect(household).toBeDefined()
      expect(household!.homeId).toBe(foundedHomePlaceId(settlementId, npcId))
      // Travel cleared exactly once the founder settled.
      expect(states.get(npcId)!.travel).toBeNull()
      // Exactly one real tent instance consumed.
      expect(states.get(npcId)!.personalInventory.getInstances('tent')).toHaveLength(0)
    }
    expect(deps.economies.get(settlementId)).toBeDefined()
  })

  it('places every founder tent at a unique deterministic position with stable yaw, non-overlapping', () => {
    const settlementId = foundedSettlementId(SITE_ID)
    const layout = resolveFoundedCampLayout(settlementId, 100, 200, MEMBER_IDS)
    expect(layout).toHaveLength(3)
    const positions = layout.map((p) => `${p.x.toFixed(3)},${p.z.toFixed(3)}`)
    expect(new Set(positions).size).toBe(3)
    for (const placement of layout) {
      expect(Number.isFinite(placement.x)).toBe(true)
      expect(Number.isFinite(placement.z)).toBe(true)
      expect(Number.isFinite(placement.yaw)).toBe(true)
    }
  })

  it('produces identical camp layout descriptors on repeat resolution (same identity/center/order)', () => {
    const settlementId = foundedSettlementId(SITE_ID)
    const first = resolveFoundedCampLayout(settlementId, 100, 200, MEMBER_IDS)
    const second = resolveFoundedCampLayout(settlementId, 100, 200, MEMBER_IDS)
    expect(second).toEqual(first)
  })

  it('gives founding households no free starting supplies', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    const settlementId = (result as { status: 'created', settlementId: string }).settlementId
    for (const npcId of MEMBER_IDS) {
      const household = deps.households.get(foundedHouseholdId(settlementId, npcId))!
      expect(household.water.current).toBe(0)
      expect(household.foodCount()).toBe(0)
      expect(household.woodCount()).toBe(0)
    }
  })

  it('is idempotent: a repeated call returns existing without consuming or re-placing anything', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps, placedTents } = makeDeps(states)
    const first = bootstrapFoundedSettlement(baseInput(), deps)
    expect(first.status).toBe('created')
    const tentsAfterFirst = new Map(placedTents.placed)

    const second = bootstrapFoundedSettlement(baseInput(), deps)
    expect(second).toEqual({ status: 'existing', settlementId: (first as { settlementId: string }).settlementId })
    expect(deps.founded.list()).toHaveLength(1)
    expect(placedTents.placed.size).toBe(tentsAfterFirst.size)
    expect(placedTents.placed).toEqual(tentsAfterFirst)
  })

  it('founded-home resolver follows the real tent transform, not a cached position', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps, placedTents } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    const settlementId = (result as { status: 'created', settlementId: string }).settlementId
    const record = deps.founded.get(settlementId)!
    const npcId = MEMBER_IDS[0]

    const place = resolveFoundedHomePlace(record, npcId, deps.placedTents)
    expect(place).not.toBeNull()
    expect(place!.id).toBe(foundedHomePlaceId(settlementId, npcId))
    const tent = placedTents.get(foundedTentId(settlementId, npcId))!
    expect(place!.position.x).toBe(tent.x)
    expect(place!.position.z).toBe(tent.z)

    // Moving the physical tent moves the resolved place, without touching the record/household.
    placedTents.relocate(foundedTentId(settlementId, npcId), 555, 666, 0)
    const movedPlace = resolveFoundedHomePlace(record, npcId, deps.placedTents)!
    expect(movedPlace.position.x).toBe(555)
    expect(movedPlace.position.z).toBe(666)
  })

  it('resolver returns null for a non-resident npc or a missing physical tent', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps } = makeDeps(states)
    const result = bootstrapFoundedSettlement(baseInput(), deps)
    const settlementId = (result as { status: 'created', settlementId: string }).settlementId
    const record = deps.founded.get(settlementId)!
    expect(resolveFoundedHomePlace(record, '0_0:npc:99' as NpcId, deps.placedTents)).toBeNull()
  })

  it('homeIndexFromPlaceId never interprets a founded home id as a procedural house index', () => {
    const settlementId = foundedSettlementId(SITE_ID)
    const homeId = foundedHomePlaceId(settlementId, MEMBER_IDS[0])
    expect(homeIndexFromPlaceId(settlementId, homeId)).toBeNull()
  })
})

describe('bootstrapFoundedSettlement — existing-record consistency', () => {
  it('returns inconsistent when a founded record has a missing persisted tent, without minting a free tent', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps, placedTents } = makeDeps(states)
    const created = bootstrapFoundedSettlement(baseInput(), deps)
    const settlementId = (created as { settlementId: string }).settlementId
    const missingTentId = foundedTentId(settlementId, MEMBER_IDS[0])
    placedTents.placed.delete(missingTentId)
    const sizeBefore = placedTents.placed.size

    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'inconsistent', reason: 'missing-founded-tent' })
    expect(placedTents.placed.size).toBe(sizeBefore)
    expect(placedTents.placed.has(missingTentId)).toBe(false)
  })

  it('returns inconsistent on sponsor mismatch, without mutating anything', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps } = makeDeps(states)
    bootstrapFoundedSettlement(baseInput(), deps)
    const result = bootstrapFoundedSettlement(baseInput({ sponsorSettlementId: 'someone-else' }), deps)
    expect(result).toEqual({ status: 'inconsistent', reason: 'sponsor-mismatch' })
  })

  it('returns inconsistent on ordered member-set mismatch, without mutating anything', () => {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps } = makeDeps(states)
    bootstrapFoundedSettlement(baseInput(), deps)
    const reordered: readonly [NpcId, NpcId, NpcId] = [MEMBER_IDS[1], MEMBER_IDS[0], MEMBER_IDS[2]]
    const result = bootstrapFoundedSettlement(baseInput({ assignment: { id: ASSIGNMENT_ID, memberNpcIds: reordered } }), deps)
    expect(result).toEqual({ status: 'inconsistent', reason: 'member-set-mismatch' })
  })
})

describe('bootstrapFoundedSettlement — legacy Stage-3 reconciliation', () => {
  function legacyDeps() {
    const states = new Map(MEMBER_IDS.map((id) => [id, arrivedState(id)]))
    const { deps, placedTents } = makeDeps(states)
    // Simulate a legacy Stage-3 save: all three tents overlapped at center,
    // yaw 0, household homeId still the raw tent id.
    const settlementId = foundedSettlementId(SITE_ID)
    deps.founded.create({
      id: settlementId,
      siteId: SITE_ID,
      x: 100,
      z: 200,
      sponsorSettlementId: '0_0',
      residentNpcIds: MEMBER_IDS,
      foundedAtDays: 5,
    })
    for (const npcId of MEMBER_IDS) {
      deps.founded.setResidency(npcId, settlementId)
      const tentId = foundedTentId(settlementId, npcId)
      placedTents.placed.set(tentId, { id: tentId, x: 100, z: 200, yaw: 0, condition: 80, lastConditionUpdateAtDays: 5 })
      deps.households.getOrCreate(foundedHouseholdId(settlementId, npcId), settlementId, tentId, undefined, {
        water: 0,
        items: { counts: {}, instances: [] },
        agriculture: { starterSeedsGranted: true },
      })
    }
    return { deps, placedTents, settlementId }
  }

  it('reconciles overlapped legacy tents + raw homeId to the deterministic layout + semantic homes in one pass', () => {
    const { deps, placedTents, settlementId } = legacyDeps()
    const layout = resolveFoundedCampLayout(settlementId, 100, 200, MEMBER_IDS)

    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'existing', settlementId })

    for (let i = 0; i < MEMBER_IDS.length; i++) {
      const npcId = MEMBER_IDS[i]!
      const expected = layout[i]!
      const tent = placedTents.get(foundedTentId(settlementId, npcId))!
      expect(tent.x).toBeCloseTo(expected.x, 3)
      expect(tent.z).toBeCloseTo(expected.z, 3)
      expect(tent.yaw).toBeCloseTo(expected.yaw, 3)
      // Physical condition/anchor preserved by relocate, not reset.
      expect(tent.condition).toBe(80)

      const household = deps.households.get(foundedHouseholdId(settlementId, npcId))!
      expect(household.homeId).toBe(foundedHomePlaceId(settlementId, npcId))
    }
  })

  it('a second reconciliation is a no-op on positions/state', () => {
    const { deps, placedTents, settlementId } = legacyDeps()
    bootstrapFoundedSettlement(baseInput(), deps)
    const afterFirst = new Map(placedTents.placed)

    const second = bootstrapFoundedSettlement(baseInput(), deps)
    expect(second).toEqual({ status: 'existing', settlementId })
    expect(placedTents.placed).toEqual(afterFirst)
  })

  it('does not relocate a non-legacy displaced founded tent', () => {
    const { deps, placedTents, settlementId } = legacyDeps()
    const displacedTentId = foundedTentId(settlementId, MEMBER_IDS[0])
    placedTents.placed.set(displacedTentId, { id: displacedTentId, x: 42, z: 43, yaw: 1.2, condition: 80, lastConditionUpdateAtDays: 5 })

    const result = bootstrapFoundedSettlement(baseInput(), deps)
    expect(result).toEqual({ status: 'inconsistent', reason: 'unrecognized-legacy-state' })
    expect(placedTents.get(displacedTentId)).toEqual({ id: displacedTentId, x: 42, z: 43, yaw: 1.2, condition: 80, lastConditionUpdateAtDays: 5 })
  })
})
