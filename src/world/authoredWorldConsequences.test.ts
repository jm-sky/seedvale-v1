import { describe, expect, it } from 'vitest'
import { createAuthoredWorldConsequenceRegistry } from './authoredWorldConsequences'

const FIXTURE_DEFS = [
  { id: 'outpost:fixture-01' },
  { id: 'farm:fixture-01' },
]

describe('authored world consequence registry (world-031)', () => {
  it('starts empty and rejects an id without a predefined definition', () => {
    const registry = createAuthoredWorldConsequenceRegistry([], FIXTURE_DEFS)
    expect(registry.snapshot()).toEqual([])
    expect(registry.isActive('outpost:fixture-01')).toBe(false)
    expect(() => registry.activate('outpost:unknown')).toThrow()
    expect(registry.snapshot()).toEqual([])
  })

  it('activate is idempotent: first call stores and returns true, later calls are a no-op', () => {
    const registry = createAuthoredWorldConsequenceRegistry([], FIXTURE_DEFS)
    expect(registry.activate('outpost:fixture-01')).toBe(true)
    expect(registry.isActive('outpost:fixture-01')).toBe(true)
    expect(registry.activate('outpost:fixture-01')).toBe(false)
    expect(registry.snapshot()).toEqual(['outpost:fixture-01'])
  })

  it('snapshot is deterministically ordered and round-trips through restore', () => {
    const registry = createAuthoredWorldConsequenceRegistry([], FIXTURE_DEFS)
    registry.activate('outpost:fixture-01')
    registry.activate('farm:fixture-01')
    const snapshot = registry.snapshot()
    expect(snapshot).toEqual([...snapshot].sort())

    const restored = createAuthoredWorldConsequenceRegistry(snapshot, FIXTURE_DEFS)
    expect(restored.snapshot()).toEqual(snapshot)
    expect(restored.isActive('outpost:fixture-01')).toBe(true)
    expect(restored.isActive('farm:fixture-01')).toBe(true)
  })

  it('rejects duplicate definition ids at construction', () => {
    expect(() => createAuthoredWorldConsequenceRegistry([], [{ id: 'dup' }, { id: 'dup' }])).toThrow()
  })

  it('rejects a restored id that has no matching definition (fail-closed)', () => {
    expect(() => createAuthoredWorldConsequenceRegistry(['outpost:unknown'], FIXTURE_DEFS)).toThrow()
  })

  it('getDefinition returns the static definition for a known id and undefined otherwise', () => {
    const registry = createAuthoredWorldConsequenceRegistry([], FIXTURE_DEFS)
    expect(registry.getDefinition('outpost:fixture-01')).toEqual({ id: 'outpost:fixture-01' })
    expect(registry.getDefinition('outpost:unknown')).toBeUndefined()
  })

  it('defaults to the empty production catalog, so any id is unknown', () => {
    const registry = createAuthoredWorldConsequenceRegistry()
    expect(() => registry.activate('outpost:forest-road-01')).toThrow()
  })
})
