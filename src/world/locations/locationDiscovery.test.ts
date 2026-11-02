import { describe, expect, it } from 'vitest'
import type { WorldLocation } from './worldLocationTypes'
import { FAR_RANGE_HOURS, MEDIUM_RANGE_HOURS, NEAR_RANGE_HOURS, WORLD_UNITS_PER_HOUR } from './locationConfig'
import {
  classifyRange,
  formatDistance,
  landmarksInBand,
  pickRandomReveal,
  pickRandomSubset,
  settlementsInBand,
  weightedTopN,
} from './locationDiscovery'
import { emptyLocationScanDiagnostics, type WorldLocationCatalog } from './worldLocationCatalog'

function loc(id: string, km: number, discoveryWeight = 0): WorldLocation {
  return { id, kind: 'cave', x: km * WORLD_UNITS_PER_HOUR, z: 0, name: id, discoveryWeight }
}

describe('classifyRange', () => {
  it('buckets hours into near/medium/far at the plan §4 thresholds', () => {
    expect(classifyRange(0)).toBe('near')
    expect(classifyRange(NEAR_RANGE_HOURS)).toBe('near')
    expect(classifyRange(NEAR_RANGE_HOURS + 0.01)).toBe('medium')
    expect(classifyRange(MEDIUM_RANGE_HOURS)).toBe('medium')
    expect(classifyRange(MEDIUM_RANGE_HOURS + 0.01)).toBe('far')
    expect(classifyRange(FAR_RANGE_HOURS)).toBe('far')
  })
})

describe('formatDistance', () => {
  it('reads as travel time and never shows km or the raw near/medium/far bucket', () => {
    expect(formatDistance(3)).toBe('ok. 3 h drogi')
    expect(formatDistance(12)).toBe('pół dnia drogi')
    expect(formatDistance(24)).toBe('dzień drogi')
    expect(formatDistance(40)).toContain('dni drogi')
    for (const h of [3, 12, 24, 40]) expect(formatDistance(h)).not.toMatch(/km|near|medium|far/i)
  })

  it('calls out a sub-hour distance distinctly', () => {
    expect(formatDistance(0.5)).toContain('mniej niż godzina drogi')
  })
})

describe('weightedTopN', () => {
  it('sorts by discoveryWeight descending with a stable id tie-break', () => {
    const locations = [loc('c', 1, 0.5), loc('a', 1, 0.9), loc('b', 1, 0.5)]
    const top = weightedTopN(locations, 3)
    expect(top.map((l) => l.id)).toEqual(['a', 'b', 'c'])
  })

  it('is deterministic for the same input across repeated calls', () => {
    const locations = [loc('x', 1, 0.3), loc('y', 1, 0.3), loc('z', 1, 0.8)]
    expect(weightedTopN(locations, 2)).toEqual(weightedTopN(locations, 2))
  })

  it('truncates to n', () => {
    const locations = [loc('a', 1, 1), loc('b', 1, 0.5), loc('c', 1, 0.1)]
    expect(weightedTopN(locations, 2)).toHaveLength(2)
  })
})

describe('pickRandomSubset / pickRandomReveal', () => {
  function seededRng(seed: number): () => number {
    let a = seed >>> 0
    return () => {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  it('never returns more than the pool has', () => {
    const pool = [loc('a', 1), loc('b', 1)]
    expect(pickRandomSubset(pool, 5, seededRng(1))).toHaveLength(2)
  })

  it('pickRandomReveal always stays within [min, max] (plan §7 "1-3 lokacje")', () => {
    const pool = [loc('a', 1), loc('b', 1), loc('c', 1), loc('d', 1), loc('e', 1)]
    for (let seed = 0; seed < 50; seed++) {
      const revealed = pickRandomReveal(pool, 1, 3, seededRng(seed))
      expect(revealed.length).toBeGreaterThanOrEqual(1)
      expect(revealed.length).toBeLessThanOrEqual(3)
    }
  })

  it('is deterministic given the same rng stream', () => {
    const pool = [loc('a', 1), loc('b', 1), loc('c', 1)]
    expect(pickRandomReveal(pool, 1, 3, seededRng(7))).toEqual(pickRandomReveal(pool, 1, 3, seededRng(7)))
  })
})

describe('landmarksInBand / settlementsInBand', () => {
  function fakeCatalog(all: readonly WorldLocation[]): WorldLocationCatalog {
    const hoursOf = (x: number, z: number, l: WorldLocation) => Math.hypot(l.x - x, l.z - z) / WORLD_UNITS_PER_HOUR
    return {
      getById: (id) => all.find((l) => l.id === id) ?? null,
      nearestSettlements: (x, z, maxHours) => all.filter((l) => hoursOf(x, z, l) <= maxHours),
      landmarksWithin: (x, z, maxHours) => all.filter((l) => hoursOf(x, z, l) <= maxHours),
      landmarksInRange: (x, z, minHours, maxHours) => all.filter((l) => hoursOf(x, z, l) > minHours && hoursOf(x, z, l) <= maxHours),
      landmarksInRangeAsync: async (x, z, minHours, maxHours) => all.filter((l) => hoursOf(x, z, l) > minHours && hoursOf(x, z, l) <= maxHours),
      abandonedMine: () => null,
      abandonedMineBinding: () => null,
      stableLandmarksInRange: (x, z, minHours, maxHours) => all.filter((l) => hoursOf(x, z, l) > minHours && hoursOf(x, z, l) <= maxHours),
      invalidateScanCache: () => {},
      getScanDiagnostics: () => emptyLocationScanDiagnostics(),
    }
  }

  it('excludes the inner band, so Far Map never repeats what Near Map already covers', () => {
    const all = [loc('near1', 2), loc('mid1', 8), loc('far1', 30)]
    const catalog = fakeCatalog(all)
    const near = landmarksInBand(catalog, 0, 0, 0, NEAR_RANGE_HOURS)
    const far = landmarksInBand(catalog, 0, 0, MEDIUM_RANGE_HOURS, FAR_RANGE_HOURS)
    expect(near.map((l) => l.id)).toEqual(['near1'])
    expect(far.map((l) => l.id)).toEqual(['far1'])
    expect(near.some((l) => far.some((f) => f.id === l.id))).toBe(false)
  })

  it('applies the same band exclusion to settlements', () => {
    const all = [loc('s-near', 2), loc('s-far', 40)]
    const catalog = fakeCatalog(all)
    expect(settlementsInBand(catalog, 0, 0, 0, NEAR_RANGE_HOURS).map((l) => l.id)).toEqual(['s-near'])
    expect(settlementsInBand(catalog, 0, 0, MEDIUM_RANGE_HOURS, FAR_RANGE_HOURS).map((l) => l.id)).toEqual(['s-far'])
  })
})
