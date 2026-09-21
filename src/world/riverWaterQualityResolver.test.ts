import { describe, expect, it, vi } from 'vitest'
import type { SettlementDef } from '../settlement/settlementGenerator'
import { RIVER_CELL_STEP, type RiverHydrologyContext } from '../terrain/riverNetwork'
import { createRiverWaterQualityResolver } from './riverWaterQualityResolver'

/** A safe-candidate hydrology sample (small flow, high elevation), centered
 *  on hydrology cell (10, 20) so its exact cell coordinates are easy to
 *  reason about. */
function safeContext(x = 10 * RIVER_CELL_STEP + 1, z = 20 * RIVER_CELL_STEP + 1): RiverHydrologyContext {
  return { x, z, elevation: 100, accumulation: 20, distanceToWaterEdge: -0.5 }
}

describe('createRiverWaterQualityResolver (plan world-017 §6, §9.3; world-terrain-046 §4)', () => {
  it('composes hydrology + settlement proximity into the final quality', () => {
    const near = createRiverWaterQualityResolver(
      () => ({ x: safeContext().x, z: safeContext().z } as SettlementDef),
    )
    expect(near.resolveFromContext(safeContext())).toBe('unsafe') // safe base, degraded by proximity

    const far = createRiverWaterQualityResolver(() => null)
    expect(far.resolveFromContext(safeContext())).toBe('safe')
  })

  it('caches by hydrology cell: repeated queries do not re-invoke the settlement lookup', () => {
    const peekDef = vi.fn(() => null)
    const resolver = createRiverWaterQualityResolver(peekDef)

    resolver.resolveFromContext(safeContext())
    resolver.resolveFromContext(safeContext())
    resolver.resolveFromContext(safeContext())

    // Bounded to a fixed 9-cell settlement lookup on the *first* resolve for
    // this hydrology cell only — later calls hit the cache instead.
    expect(peekDef.mock.calls.length).toBeGreaterThan(0)
    expect(peekDef.mock.calls.length).toBeLessThanOrEqual(9)
  })

  it('two contexts in the same hydrology cell (e.g. opposite riverbanks) share one cache entry/result', () => {
    const resolver = createRiverWaterQualityResolver(() => null)

    const left = resolver.resolveFromContext(safeContext(10 * RIVER_CELL_STEP + 1, 20 * RIVER_CELL_STEP + 1))
    const right = resolver.resolveFromContext(safeContext(10 * RIVER_CELL_STEP + 2, 20 * RIVER_CELL_STEP + 1))

    expect(left).toBe(right)
    expect(left).toBe('safe')
  })

  it('a neighboring hydrology cell can produce a distinct cache entry', () => {
    const resolver = createRiverWaterQualityResolver(() => null)
    expect(resolver.resolveFromContext(safeContext(10 * RIVER_CELL_STEP + 1, 20 * RIVER_CELL_STEP + 1))).toBe('safe')
    expect(resolver.resolveFromContext(safeContext(11 * RIVER_CELL_STEP + 1, 20 * RIVER_CELL_STEP + 1))).toBe('safe')
  })

  it('a fresh resolver instance (world rebuild / seed change) starts with an empty cache', () => {
    const peekDefA = vi.fn(() => null)
    const a = createRiverWaterQualityResolver(peekDefA)
    a.resolveFromContext(safeContext())
    expect(peekDefA).toHaveBeenCalled()

    const peekDefB = vi.fn(() => null)
    const b = createRiverWaterQualityResolver(peekDefB)
    b.resolveFromContext(safeContext())
    expect(peekDefB).toHaveBeenCalled()
  })

  it('never rediscovers a river candidate to resolve quality — resolveFromContext only ever consumes a context the caller already has', () => {
    // No dependency on `ChunkManager.riverShoreQuery` exists on this seam at
    // all (plan world-terrain-046): the resolver's only input is the context
    // itself, so there is nothing here that could re-scan loaded chunks.
    const resolver = createRiverWaterQualityResolver(() => null)
    expect(resolver.resolveFromContext(safeContext())).toBe('safe')
  })
})
