import { describe, expect, it } from 'vitest'
import type { RoadRiverCrossing } from './roadRiverCrossing'
import { snapRouteToTrunks, type TrunkPartner, type TrunkPoint, type TrunkRoute } from './roadTrunks'

const env = { connectorIsClear: () => true }

function line(points: [number, number][], hs = 5): TrunkPoint[] {
  return points.map(([x, z]) => ({ x, z, h: hs, hs }))
}

function ford(id: string, x: number, z: number): RoadRiverCrossing {
  return { id, kind: 'ford', x, z, span: 8, angle: 0 } as unknown as RoadRiverCrossing
}

/** Primary runs straight east along z = 0; the secondary starts 60 m north, drops onto it and leaves again. */
const primary: TrunkRoute = {
  points: line([[0, 0], [100, 0], [200, 0], [300, 0], [400, 0], [500, 0]], 10),
  crossings: [ford('a|b#0', 250, 0)],
}
const secondary: TrunkRoute = {
  points: line([[0, 60], [60, 30], [120, 6], [200, 4], [300, 5], [380, 8], [440, 40], [500, 90]], 3),
  crossings: [ford('c|d#0', 251, 4)],
}

describe('snapRouteToTrunks', () => {
  it('snaps a shared stretch onto the primary vertices and adopts its crossing', () => {
    const out = snapRouteToTrunks('c|d', secondary, [{ key: 'a|b', route: primary }], env)
    const onPrimary = out.points.filter((p) => p.z === 0)
    expect(onPrimary.length).toBeGreaterThanOrEqual(3)
    // exact primary vertices with the primary's profile
    for (const v of [[200, 0], [300, 0]]) {
      const hit = out.points.find((p) => p.x === v[0] && p.z === v[1])
      expect(hit?.hs).toBe(10)
    }
    expect(out.crossings.map((c) => c.id)).toEqual(['a|b#0'])
    // endpoints stay put
    expect(out.points[0]).toMatchObject({ x: 0, z: 60 })
    expect(out.points[out.points.length - 1]).toMatchObject({ x: 500, z: 90 })
  })

  it('leaves the primary and unrelated roads untouched', () => {
    expect(snapRouteToTrunks('a|b', primary, [{ key: 'c|d', route: secondary }], env)).toBe(primary)
    const far: TrunkRoute = { points: line([[0, 500], [500, 500]]), crossings: [] }
    expect(snapRouteToTrunks('c|d', far, [{ key: 'a|b', route: primary }], env)).toBe(far)
  })

  it('refuses a run whose connector is not clear', () => {
    const out = snapRouteToTrunks('c|d', secondary, [{ key: 'a|b', route: primary }], { connectorIsClear: () => false })
    expect(out.points).toEqual(secondary.points)
  })

  it('is independent of partner order (two-order determinism)', () => {
    const second: TrunkPartner = {
      key: 'a|c',
      route: { points: line([[0, -20], [150, -20], [250, 20], [350, 20], [500, 20]], 8), crossings: [] },
    }
    const partners: TrunkPartner[] = [{ key: 'a|b', route: primary }, second, { key: 'z|z', route: primary }]
    const forward = snapRouteToTrunks('c|d', secondary, partners, env)
    const reversed = snapRouteToTrunks('c|d', secondary, [...partners].reverse(), env)
    expect(reversed).toEqual(forward)
  })

  it('inserts a junction vertex where a secondary crosses a primary transversely', () => {
    const cross: TrunkRoute = { points: line([[150, -100], [150, 100]], 2), crossings: [] }
    const out = snapRouteToTrunks('c|d', cross, [{ key: 'a|b', route: primary }], { connectorIsClear: () => true })
    expect(out.points.some((p) => Math.abs(p.x - 150) < 1e-6 && Math.abs(p.z) < 1e-6 && p.hs === 10)).toBe(true)
  })
})
