import { describe, expect, it } from 'vitest'
import {
  createRatInfestationRegistry,
  NO_RAT_INFESTATION,
  type RatInfestationState,
  SEEDED_RAT_INFESTATION,
  shouldSeedAuthoredHomeInfestation,
} from './ratInfestation'

function bootstrapHomeInfestation(
  persisted: Record<string, RatInfestationState> | undefined,
  seedRequested: boolean,
  homeId = 'home',
) {
  const registry = createRatInfestationRegistry(persisted)
  if (shouldSeedAuthoredHomeInfestation(seedRequested, persisted, homeId)) {
    registry.seed(homeId)
  }
  return registry
}

describe('rat infestation registry (plan quests-progression-013)', () => {
  it('seeds damaged storage with an intact nest', () => {
    const registry = createRatInfestationRegistry()
    expect(registry.get('home')).toEqual(NO_RAT_INFESTATION)
    registry.seed('home')
    expect(registry.get('home')).toEqual(SEEDED_RAT_INFESTATION)
    expect(registry.isStorageDamaged('home')).toBe(true)
    expect(registry.hasActiveNest('home')).toBe(true)
    expect(registry.isNestDestroyed('home')).toBe(false)
  })

  it('repairs storage without destroying the nest', () => {
    const registry = createRatInfestationRegistry()
    registry.seed('home')
    registry.repairStorage('home')
    expect(registry.get('home')).toEqual({ storageDamaged: false, nestDestroyed: false })
    expect(registry.hasActiveNest('home')).toBe(true)
  })

  it('destroys the nest without repairing storage', () => {
    const registry = createRatInfestationRegistry()
    registry.seed('home')
    registry.destroyNest('home')
    expect(registry.get('home')).toEqual({ storageDamaged: true, nestDestroyed: true })
    expect(registry.isStorageDamaged('home')).toBe(true)
    expect(registry.hasActiveNest('home')).toBe(false)
  })

  it('round-trips independent storage and nest facts', () => {
    const registry = createRatInfestationRegistry()
    registry.seed('home')
    registry.repairStorage('home')
    registry.destroyNest('home')
    expect(registry.serialize()).toEqual({
      home: { storageDamaged: false, nestDestroyed: true },
    })
    const restored = createRatInfestationRegistry(registry.serialize())
    expect(restored.get('home')).toEqual({ storageDamaged: false, nestDestroyed: true })
  })

  it('does not invent a nest for a settlement without a record', () => {
    const registry = createRatInfestationRegistry()
    expect(registry.hasActiveNest('other')).toBe(false)
    expect(registry.isNestDestroyed('other')).toBe(true)
    registry.repairStorage('other')
    registry.destroyNest('other')
    expect(registry.serialize()).toEqual({})
  })
})

describe('rat infestation presence and authored seed (plan quests-progression-078)', () => {
  it('treats an empty registry as absent while get() still returns NO_RAT_INFESTATION', () => {
    const registry = createRatInfestationRegistry()
    expect(registry.has('home')).toBe(false)
    expect(registry.get('home')).toEqual(NO_RAT_INFESTATION)
  })

  it('reports presence after seed and after a resolved record', () => {
    const registry = createRatInfestationRegistry()
    registry.seed('home')
    expect(registry.has('home')).toBe(true)
    registry.repairStorage('home')
    registry.destroyNest('home')
    expect(registry.has('home')).toBe(true)
    expect(registry.get('home')).toEqual({ storageDamaged: false, nestDestroyed: true })
  })

  it('seeds authored home infestation when the persisted field is missing', () => {
    const fresh = bootstrapHomeInfestation(undefined, true)
    expect(fresh.get('home')).toEqual(SEEDED_RAT_INFESTATION)
    expect(fresh.has('home')).toBe(true)
    expect(isSettlementLikeResolved(fresh, 'home', 0)).toBe(false)
  })

  it('seeds authored home infestation for a legacy save whose storageInfestation field is absent', () => {
    const persisted = undefined
    const seedRequested = persisted === undefined
    const restored = bootstrapHomeInfestation(persisted, seedRequested)
    expect(restored.get('home')).toEqual(SEEDED_RAT_INFESTATION)
  })

  it('does not reseed when the persisted field exists, including an empty object', () => {
    expect(bootstrapHomeInfestation({}, false).has('home')).toBe(false)
    expect(bootstrapHomeInfestation({}, false).get('other')).toEqual(NO_RAT_INFESTATION)
  })

  it('does not reseed active, partial, or resolved home records', () => {
    const active = { home: { ...SEEDED_RAT_INFESTATION } }
    const partial = { home: { storageDamaged: false, nestDestroyed: false } }
    const resolved = { home: { storageDamaged: false, nestDestroyed: true } }
    for (const persisted of [active, partial, resolved]) {
      const registry = bootstrapHomeInfestation(persisted, false)
      expect(registry.serialize()).toEqual(persisted)
    }
  })

  it('carries active/partial/resolved state 1:1 on ordinary rebuild without reseeding', () => {
    const previous = { home: { storageDamaged: false, nestDestroyed: false } }
    const resetCollectedItems = false
    const carried = resetCollectedItems ? undefined : previous
    const rebuilt = bootstrapHomeInfestation(carried, resetCollectedItems)
    expect(rebuilt.serialize()).toEqual(previous)
  })

  it('seeds a fresh authored problem on New Game rebuild after discarding carried state', () => {
    const previous = { home: { storageDamaged: false, nestDestroyed: true } }
    const resetCollectedItems = true
    const carried = resetCollectedItems ? undefined : previous
    const rebuilt = bootstrapHomeInfestation(carried, resetCollectedItems)
    expect(rebuilt.get('home')).toEqual(SEEDED_RAT_INFESTATION)
  })
})

function isSettlementLikeResolved(
  registry: ReturnType<typeof createRatInfestationRegistry>,
  settlementId: string,
  aliveRatCount: number,
): boolean {
  const exists = registry.has(settlementId)
  const state = registry.get(settlementId)
  return exists && !state.storageDamaged && state.nestDestroyed && aliveRatCount <= 1
}
