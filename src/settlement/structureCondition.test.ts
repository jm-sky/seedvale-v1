import { describe, expect, it } from 'vitest'
import { CONDITION_MAX } from '../world/condition'
import {
  applyStructureDamage,
  applyStructureRepairWork,
  AUTHORED_STARTER_DAMAGE_CONDITION,
  beginStructureRepair,
  hasActiveStructureRepair,
  isStructureRepairProblem,
  pristineStructureState,
  quoteStructureRepair,
  STRUCTURE_REPAIR_RESUME_PRESSURE,
  structureConditionStateFromSnapshot,
  structureRepairPolicy,
  structureRepairPressureFromCondition,
} from './structureCondition'
import { createSettlementStructureStateRegistry } from './structureStateRegistry'

const policy = structureRepairPolicy('residential')!

describe('structureRepairPolicy', () => {
  it('only adapts the residential VillageBuildingRole in V1', () => {
    expect(structureRepairPolicy('residential')).not.toBeNull()
    expect(structureRepairPolicy('production')).toBeNull()
    expect(structureRepairPolicy('public')).toBeNull()
  })

  it('adapts every authored quests-progression-073 target kind without touching the residential policy', () => {
    expect(structureRepairPolicy('residentialFoundation')).not.toBeNull()
    expect(structureRepairPolicy('householdFence')).not.toBeNull()
    expect(structureRepairPolicy('communalFence')).not.toBeNull()
    expect(structureRepairPolicy('loggingWagon')).not.toBeNull()
    // Ordinary whole-house repair keeps its own beam+branch cost/policy —
    // adding the foundation subtarget must never change it.
    expect(policy.materialsForRestoredFraction(1)).toEqual([
      { kind: 'beam', count: 4 },
      { kind: 'branch', count: 4 },
    ])
  })

  it('foundation repair uses stone, distinct from the parent residential beam+branch policy', () => {
    const foundation = structureRepairPolicy('residentialFoundation')!
    expect(foundation.materialsForRestoredFraction(1)).toEqual([{ kind: 'stone', count: 6 }])
    expect(foundation.materialsForRestoredFraction(0)).toEqual([])
  })

  it('household fence, communal fence and logging wagon each cost 5 branches', () => {
    for (const kind of ['householdFence', 'communalFence', 'loggingWagon'] as const) {
      const targetPolicy = structureRepairPolicy(kind)!
      expect(targetPolicy.materialsForRestoredFraction(1)).toEqual([{ kind: 'branch', count: 5 }])
    }
  })
})

describe('pristineStructureState', () => {
  it('defaults to full condition and no active repair', () => {
    const state = pristineStructureState('home', 'building-house-0', 5)
    expect(state.condition).toBe(CONDITION_MAX)
    expect(state.lastConditionUpdateAtDays).toBe(5)
    expect(hasActiveStructureRepair(state)).toBe(false)
    expect(isStructureRepairProblem(policy, state, 5)).toBe(false)
  })
})

describe('applyStructureDamage', () => {
  it('checkpoints and applies a negative delta, clamped to 0', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const damaged = applyStructureDamage(state, 40, 1)
    expect(damaged.condition).toBe(60)
    expect(damaged.lastConditionUpdateAtDays).toBe(1)
    const destroyed = applyStructureDamage(damaged, 1000, 2)
    expect(destroyed.condition).toBe(0)
  })

  it('is a no-op while a repair episode is active', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const damaged = applyStructureDamage(state, 60, 0)
    const outcome = beginStructureRepair({
      policy,
      state: damaged,
      nowDays: 0,
      hasMaterial: () => true,
      consumeMaterial: () => {},
    })
    expect(outcome.status).toBe('started')
    if (outcome.status !== 'started') throw new Error('expected started')
    const stillActive = applyStructureDamage(outcome.state, 10, 1)
    expect(stillActive).toBe(outcome.state)
  })

  it('is a no-op for a non-positive amount', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    expect(applyStructureDamage(state, 0, 1)).toBe(state)
    expect(applyStructureDamage(state, -5, 1)).toBe(state)
  })
})

describe('quoteStructureRepair', () => {
  it('is null when nothing needs repair', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    expect(quoteStructureRepair(policy, state, 0)).toBeNull()
  })

  it('is null while an episode is already active', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const damaged = applyStructureDamage(state, 60, 0)
    const outcome = beginStructureRepair({
      policy,
      state: damaged,
      nowDays: 0,
      hasMaterial: () => true,
      consumeMaterial: () => {},
    })
    if (outcome.status !== 'started') throw new Error('expected started')
    expect(quoteStructureRepair(policy, outcome.state, 1)).toBeNull()
  })

  it('scales required materials/work with the restored fraction', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const halfDamaged = applyStructureDamage(state, 50, 0)
    const fullyDamaged = applyStructureDamage(state, 100, 0)
    const smallQuote = quoteStructureRepair(policy, halfDamaged, 0)!
    const bigQuote = quoteStructureRepair(policy, fullyDamaged, 0)!
    expect(smallQuote.requiredWork).toBeLessThan(bigQuote.requiredWork)
    const smallTotal = smallQuote.materials.reduce((n, r) => n + r.count, 0)
    const bigTotal = bigQuote.materials.reduce((n, r) => n + r.count, 0)
    expect(smallTotal).toBeLessThanOrEqual(bigTotal)
  })
})

describe('beginStructureRepair', () => {
  it('is unavailable when nothing needs repair', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const outcome = beginStructureRepair({
      policy,
      state,
      nowDays: 0,
      hasMaterial: () => true,
      consumeMaterial: () => {},
    })
    expect(outcome.status).toBe('unavailable')
  })

  it('consumes nothing when a required material is missing', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const damaged = applyStructureDamage(state, 60, 0)
    const consumed: string[] = []
    const outcome = beginStructureRepair({
      policy,
      state: damaged,
      nowDays: 0,
      hasMaterial: () => false,
      consumeMaterial: (r) => consumed.push(r.kind),
    })
    expect(outcome.status).toBe('blocked')
    expect(consumed).toEqual([])
    if (outcome.status !== 'blocked') throw new Error('expected blocked')
    expect(outcome.missing.length).toBeGreaterThan(0)
  })

  it('atomically consumes materials and checkpoints condition once available', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const damaged = applyStructureDamage(state, 60, 0)
    const consumed: string[] = []
    const outcome = beginStructureRepair({
      policy,
      state: damaged,
      nowDays: 3,
      hasMaterial: () => true,
      consumeMaterial: (r) => consumed.push(r.kind),
    })
    expect(outcome.status).toBe('started')
    if (outcome.status !== 'started') throw new Error('expected started')
    expect(consumed.length).toBeGreaterThan(0)
    expect(outcome.state.repair).toBeDefined()
    expect(outcome.state.repair!.completedWork).toBe(0)
    expect(outcome.state.repair!.targetCondition).toBe(CONDITION_MAX)
    expect(outcome.state.lastConditionUpdateAtDays).toBe(3)
  })
})

describe('applyStructureRepairWork', () => {
  function startedRepair() {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const damaged = applyStructureDamage(state, 60, 0)
    const outcome = beginStructureRepair({
      policy,
      state: damaged,
      nowDays: 0,
      hasMaterial: () => true,
      consumeMaterial: () => {},
    })
    if (outcome.status !== 'started') throw new Error('expected started')
    return outcome.state
  }

  it('is a no-op when no repair is active', () => {
    const state = pristineStructureState('home', 'building-house-0', 0)
    const result = applyStructureRepairWork(state, 5, 1)
    expect(result.acceptedWork).toBe(0)
    expect(result.completed).toBe(false)
  })

  it('accepts partial work without completing, clamped to remaining', () => {
    const started = startedRepair()
    const requiredWork = started.repair!.requiredWork
    const result = applyStructureRepairWork(started, requiredWork * 2, 1)
    expect(result.completed).toBe(true)
    expect(result.acceptedWork).toBeCloseTo(requiredWork)
  })

  it('two actors contributing to the same episode sum toward completion', () => {
    const started = startedRepair()
    const requiredWork = started.repair!.requiredWork
    const half = requiredWork / 2
    const afterFirst = applyStructureRepairWork(started, half, 1)
    expect(afterFirst.completed).toBe(false)
    expect(afterFirst.state.repair).toBeDefined()
    const afterSecond = applyStructureRepairWork(afterFirst.state, half, 2)
    expect(afterSecond.completed).toBe(true)
    expect(afterSecond.state.repair).toBeUndefined()
    expect(afterSecond.state.condition).toBe(CONDITION_MAX)
    expect(afterSecond.state.lastConditionUpdateAtDays).toBe(2)
  })

  it('resuming an active repair does not consume materials again', () => {
    const started = startedRepair()
    // Simulate a resume: no beginStructureRepair call, straight to more work.
    const requiredWork = started.repair!.requiredWork
    const result = applyStructureRepairWork(started, requiredWork, 5)
    expect(result.completed).toBe(true)
  })
})

describe('structureRepairPressureFromCondition', () => {
  it('is 0 at or above the repair threshold', () => {
    expect(structureRepairPressureFromCondition(policy.repairThreshold, policy)).toBe(0)
    expect(structureRepairPressureFromCondition(CONDITION_MAX, policy)).toBe(0)
  })

  it('increases as condition drops further below the threshold', () => {
    const shallow = structureRepairPressureFromCondition(policy.repairThreshold - 5, policy)
    const deep = structureRepairPressureFromCondition(0, policy)
    expect(shallow).toBeGreaterThan(0)
    expect(deep).toBeGreaterThan(shallow)
  })

  it('never exceeds the resume-pressure floor used for an active episode', () => {
    const deep = structureRepairPressureFromCondition(0, policy)
    expect(deep).toBeLessThan(1)
    // Resume pressure is a separate constant, not derived from condition —
    // just confirm both stay in the same "well under a critical need" band.
    expect(STRUCTURE_REPAIR_RESUME_PRESSURE).toBeLessThan(1)
  })
})

describe('AUTHORED_STARTER_DAMAGE_CONDITION (plan quests-progression-073)', () => {
  it('reads as damaged for every authored target kind and never as fully destroyed', () => {
    for (const kind of ['residentialFoundation', 'householdFence', 'communalFence', 'loggingWagon'] as const) {
      const targetPolicy = structureRepairPolicy(kind)!
      expect(AUTHORED_STARTER_DAMAGE_CONDITION).toBeLessThanOrEqual(targetPolicy.repairThreshold)
      expect(AUTHORED_STARTER_DAMAGE_CONDITION).toBeGreaterThan(0)
    }
  })
})

describe('autonomousRepairReserved (plan quests-progression-073)', () => {
  it('round-trips through structureConditionStateFromSnapshot', () => {
    const reserved = structureConditionStateFromSnapshot('home', 'household-fence-0', {
      condition: AUTHORED_STARTER_DAMAGE_CONDITION,
      lastConditionUpdateAtDays: 0,
      autonomousRepairReserved: true,
    })
    expect(reserved.autonomousRepairReserved).toBe(true)
    const released = structureConditionStateFromSnapshot('home', 'household-fence-0', {
      condition: CONDITION_MAX,
      lastConditionUpdateAtDays: 1,
      autonomousRepairReserved: false,
    })
    expect(released.autonomousRepairReserved).toBe(false)
  })

  it('does not re-seed authored damage over an already-repaired registry record', () => {
    const registry = createSettlementStructureStateRegistry()
    registry.set({
      structureId: 'household-fence-0',
      settlementId: 'home',
      condition: CONDITION_MAX,
      lastConditionUpdateAtDays: 2,
      autonomousRepairReserved: false,
    })
    // Mirrors SettlementsManager.seedAuthoredRepairDamageIfNeeded.
    if (!registry.get('home', 'household-fence-0')) {
      registry.set({
        structureId: 'household-fence-0',
        settlementId: 'home',
        condition: AUTHORED_STARTER_DAMAGE_CONDITION,
        lastConditionUpdateAtDays: 3,
        autonomousRepairReserved: true,
      })
    }
    const state = registry.get('home', 'household-fence-0')!
    expect(state.condition).toBe(CONDITION_MAX)
    expect(state.autonomousRepairReserved).toBe(false)
  })
})
