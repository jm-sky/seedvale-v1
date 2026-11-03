import { describe, expect, it } from 'vitest'
import type { SettlementDef } from './settlementGenerator'
import { buildRouteObstacles, ROUTE_ENDPOINT_FREE_RADIUS, ROUTE_OBSTACLE_PAD } from './routeObstacles'

function fakeDef(): SettlementDef {
  return {
    id: 'v',
    x: 0,
    z: 0,
    size: 'MD',
    plan: {
      plaza: { x: 0, z: 0, radius: 6 },
      plots: [{ id: 'p', role: 'house', x: 20, z: 0, radius: 5 }],
    },
  } as unknown as SettlementDef
}

describe('buildRouteObstacles', () => {
  const defs = [fakeDef()]

  it('blocks plazas and plots with padding but leaves open ground inside the footprint soft', () => {
    const o = buildRouteObstacles(defs, [], [])
    expect(o.isBlocked(0, 0)).toBe(true)
    expect(o.isBlocked(20 + 5 + ROUTE_OBSTACLE_PAD - 0.5, 0)).toBe(true)
    expect(o.isBlocked(20 + 5 + ROUTE_OBSTACLE_PAD + 0.5, 0)).toBe(false)
    expect(o.isBlocked(0, 30)).toBe(false)
    expect(o.costMultiplier(0, 30)).toBeGreaterThan(1)
    expect(o.costMultiplier(500, 500)).toBe(1)
  })

  it('treats the own footprint as cheaper than a foreign one', () => {
    const own = buildRouteObstacles(defs, [], ['v']).costMultiplier(0, 30)
    const foreign = buildRouteObstacles(defs, [], []).costMultiplier(0, 30)
    expect(own).toBeLessThan(foreign)
  })

  it('frees the neighbourhood of route endpoints', () => {
    const o = buildRouteObstacles(defs, [{ x: 20, z: 0 }], ['v'])
    expect(o.isBlocked(20 + ROUTE_ENDPOINT_FREE_RADIUS - 1, 0)).toBe(false)
    expect(o.isBlocked(0, 0)).toBe(true)
  })
})
