import { describe, expect, it } from 'vitest'
import type { WorldHydrology } from './worldHydrology'
import { detectWaterfallSites, LANDMARK_POOL_RADIUS_M, waterfallReserveHalfWidth, waterfallReservesIn } from './waterfallSites'
import { isInWaterfallReserve, waterfallSitesOf } from './waterfallSites'
import { clearWorldHydrology, installWorldHydrology } from './worldHydrologyStore'

type Leg = { length: number, slope: number }
type Pt = { x: number, z: number, elevation: number, accumulation: number }

/** Chain running along +x from (x0, z0), 2 m spacing, legs of constant downhill slope. */
function chain(x0: number, z0: number, startElevation: number, legs: Leg[], accumulation = 100): Pt[] {
  const pts: Pt[] = [{ x: x0, z: z0, elevation: startElevation, accumulation }]
  for (const leg of legs) {
    for (let d = 2; d <= leg.length; d += 2) {
      const prev = pts[pts.length - 1]!
      pts.push({ x: prev.x + 2, z: z0, elevation: prev.elevation - leg.slope * 2, accumulation })
    }
  }
  return pts
}

describe('detectWaterfallSites', () => {
  it('finds a steep run and ignores gentle flow and small drops', () => {
    const sites = detectWaterfallSites([chain(0, 0, 100, [{ length: 100, slope: 0.05 }, { length: 20, slope: 0.4 }, { length: 100, slope: 0.05 }]), chain(0, 500, 100, [{ length: 4, slope: 0.4 }])])
    expect(sites).toHaveLength(1)
    expect(sites[0]!.dropM).toBeCloseTo(8, 5)
    expect(sites[0]!.tier).toBe('minor')
    expect(sites[0]!.top.x).toBe(100)
    expect(sites[0]!.chainIndex).toBe(0)
  })

  it('merges runs separated by < 30 m of gentle flow and keeps runs further apart separate', () => {
    const near = detectWaterfallSites([chain(0, 0, 100, [{ length: 10, slope: 0.4 }, { length: 20, slope: 0.05 }, { length: 10, slope: 0.4 }])])
    expect(near).toHaveLength(1)
    expect(near[0]!.dropM).toBeCloseTo(4 + 1 + 4, 5)
    const far = detectWaterfallSites([chain(0, 0, 100, [{ length: 10, slope: 0.4 }, { length: 40, slope: 0.05 }, { length: 10, slope: 0.4 }])])
    expect(far).toHaveLength(2)
  })

  it('assigns landmark tier by drop ≥ 10 m and 300 m spacing (largest wins)', () => {
    const big = chain(0, 0, 200, [{ length: 40, slope: 0.5 }]) // 20 m
    const mid = chain(100, 100, 200, [{ length: 30, slope: 0.5 }]) // 15 m, ~141 m from big
    const farBig = chain(0, 1000, 200, [{ length: 30, slope: 0.4 }]) // 12 m, far away
    const small = chain(0, 2000, 200, [{ length: 20, slope: 0.4 }]) // 8 m
    const sites = detectWaterfallSites([mid, big, farBig, small])
    const tiers = Object.fromEntries(sites.map((s) => [s.dropM.toFixed(0), s.tier]))
    expect(tiers).toEqual({ 20: 'landmark', 15: 'minor', 12: 'landmark', 8: 'minor' })
  })

  it('ids are positional: stable when unrelated chains are reordered or added', () => {
    const a = chain(0, 0, 100, [{ length: 20, slope: 0.4 }])
    const b = chain(1000, 1000, 100, [{ length: 20, slope: 0.4 }])
    const c = chain(-500, 300, 100, [{ length: 20, slope: 0.4 }])
    const idsOf = (chains: Pt[][]) => detectWaterfallSites(chains).map((s) => s.id)
    const base = idsOf([a, b])
    expect(idsOf([b, a])).toEqual(base)
    expect(idsOf([c, a, b])).toEqual(expect.arrayContaining(base))
    expect(new Set(base).size).toBe(2)
    expect(base[0]).toMatch(/^waterfall:-?\d+_-?\d+$/)
  })

  it('keeps the larger drop on a lip-cell id collision', () => {
    const a = chain(0, 0, 100, [{ length: 20, slope: 0.4 }]) // 8 m
    const b = chain(1, 1, 100, [{ length: 30, slope: 0.4 }]) // 12 m, same 16 m cell
    const sites = detectWaterfallSites([a, b])
    expect(sites).toHaveLength(1)
    expect(sites[0]!.dropM).toBeCloseTo(12, 5)
  })

  it('sites carry across a chunk boundary unchanged (chunk-independent)', () => {
    const sites = detectWaterfallSites([chain(-10, 0, 100, [{ length: 20, slope: 0.4 }])])
    expect(sites).toHaveLength(1)
    expect(sites[0]!.top.x).toBe(-10)
    expect(sites[0]!.bottom.x).toBe(10)
  })
})

describe('reserve queries', () => {
  const id = 'waterfall-sites-test'
  const data = (chains: Pt[][]): WorldHydrology => {
    const offsets = [0]
    const flat: number[] = []
    for (const c of chains) {
      for (const p of c) flat.push(p.x, p.z, p.elevation, p.accumulation)
      offsets.push(offsets[offsets.length - 1]! + c.length)
    }
    return { chains: { offsets: Uint32Array.from(offsets), points: Float32Array.from(flat), flags: new Uint8Array(chains.length) } } as unknown as WorldHydrology
  }

  it('reserves the buffered polyline and, for landmarks, the bottom pool', () => {
    installWorldHydrology(id, data([chain(0, 0, 200, [{ length: 40, slope: 0.5 }])]))
    try {
      const [site] = waterfallSitesOf(id)
      expect(site!.tier).toBe('landmark')
      const half = waterfallReserveHalfWidth(site!)
      expect(isInWaterfallReserve(id, 20, half - 1)).toBe(true)
      expect(isInWaterfallReserve(id, 20, half + 1)).toBe(false)
      expect(isInWaterfallReserve(id, 40, LANDMARK_POOL_RADIUS_M - 1)).toBe(true) // pool beyond the half-width
      expect(isInWaterfallReserve(id, 40, LANDMARK_POOL_RADIUS_M + 2)).toBe(false)
      expect(waterfallReservesIn(id, { minX: 100, maxX: 200, minZ: 0, maxZ: 10 })).toHaveLength(0)
      expect(waterfallReservesIn(id, { minX: 30, maxX: 60, minZ: -5, maxZ: 5 })).toHaveLength(1)
    } finally {
      clearWorldHydrology(id)
    }
  })
})
