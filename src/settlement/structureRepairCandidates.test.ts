import { describe, expect, it } from 'vitest'
import {
  applyStructureDamage,
  AUTHORED_STARTER_DAMAGE_CONDITION,
  pristineStructureState,
  STRUCTURE_REPAIR_RESUME_PRESSURE,
} from './structureCondition'
import { createAuthoredNpcRepairTarget, createNpcStructureRepairHooks } from './structureRepairCandidates'
import { createSettlementStructureStateRegistry } from './structureStateRegistry'

describe('createNpcStructureRepairHooks.pressure (plan settlements-npcs-034)', () => {
  const settlementId = 'home'
  const structureId = 'building-house-0'
  const position = { x: 0, y: 0, z: 0 }

  function hooksWithCondition(condition: number, registry = createSettlementStructureStateRegistry()) {
    const damaged = applyStructureDamage(pristineStructureState(settlementId, structureId, 0), 100 - condition, 0)
    registry.set(damaged)
    return createNpcStructureRepairHooks(settlementId, 0, position, registry)!
  }

  it('returns 0 when required repair materials are missing', () => {
    const registry = createSettlementStructureStateRegistry()
    const hooks = hooksWithCondition(40, registry)
    const pressure = hooks.pressure(0, () => false)
    expect(pressure).toBe(0)
  })

  it('returns non-zero pressure when quote materials are all available', () => {
    const registry = createSettlementStructureStateRegistry()
    const hooks = hooksWithCondition(40, registry)
    const pressure = hooks.pressure(0, () => true)
    expect(pressure).toBeGreaterThan(0)
  })

  it('returns resume pressure during an active repair without re-checking materials', () => {
    const registry = createSettlementStructureStateRegistry()
    const hooks = hooksWithCondition(40, registry)
    const started = hooks.beginRepair(0, () => true, () => {})
    expect(started.status).toBe('started')
    const pressure = hooks.pressure(0, () => false)
    expect(pressure).toBe(STRUCTURE_REPAIR_RESUME_PRESSURE)
  })
})

describe('createAuthoredNpcRepairTarget (plan quests-progression-073)', () => {
  const settlementId = 'home'
  const structureId = 'household-fence-0'
  const position = { x: 1, y: 0, z: 1 }

  function seededTarget(registry = createSettlementStructureStateRegistry(), material = { hasMaterial: () => true, consumeMaterial: () => {} }) {
    registry.set({
      structureId,
      settlementId,
      condition: AUTHORED_STARTER_DAMAGE_CONDITION,
      lastConditionUpdateAtDays: 0,
      autonomousRepairReserved: true,
    })
    return { registry, target: createAuthoredNpcRepairTarget(settlementId, structureId, 'householdFence', position, registry, material)! }
  }

  it('blocks autonomous pressure and repair start while the starter reservation holds', () => {
    const { target } = seededTarget()
    expect(target.pressure(0)).toBe(0)
    expect(target.beginRepair(0)).toEqual({ status: 'unavailable' })
  })

  it('resolves normal pressure once the reservation is released', () => {
    const { registry, target } = seededTarget()
    const current = registry.get(settlementId, structureId)!
    registry.set({ ...current, autonomousRepairReserved: false })
    expect(target.pressure(0)).toBeGreaterThan(0)
    const outcome = target.beginRepair(0)
    expect(outcome.status).toBe('started')
  })

  it('resolves 0 pressure when the material adapter reports missing materials, even when released', () => {
    const { registry, target } = seededTarget(undefined, { hasMaterial: () => false, consumeMaterial: () => {} })
    const current = registry.get(settlementId, structureId)!
    registry.set({ ...current, autonomousRepairReserved: false })
    expect(target.pressure(0)).toBe(0)
  })

  it('is null for a target kind with no repair policy — never true for the four authored kinds', () => {
    const registry = createSettlementStructureStateRegistry()
    // @ts-expect-error exercising the defensive null branch with an invalid kind
    const missing = createAuthoredNpcRepairTarget(settlementId, structureId, 'notARealKind', position, registry, {
      hasMaterial: () => true,
      consumeMaterial: () => {},
    })
    expect(missing).toBeNull()
  })
})
