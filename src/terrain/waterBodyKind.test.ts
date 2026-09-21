import { describe, expect, it } from 'vitest'
import type { RiverShoreCandidate } from './riverNetwork'
import {
  lakeProximityAt,
  nearestShoreProbePoint,
  resolveWaterBodyKind,
  resolveWaterShore,
  shoreProbeHits,
  type WaterShoreSamplers,
} from './waterBodyKind'

describe('shoreProbeHits (plan 094)', () => {
  const flatAt = (h: number) => () => h

  it('is 0 for a point far from any water (all probes above threshold)', () => {
    expect(shoreProbeHits(0, 0, flatAt(10), 0)).toBe(0)
  })

  it('is 4 for a point fully submerged (all probes at/below threshold)', () => {
    expect(shoreProbeHits(0, 0, flatAt(-1), 0)).toBe(4)
  })

  it('is between 0 and 4 for a point straddling the shoreline', () => {
    // Water to the +x side only, dry land to -x/+z/-z.
    const sampleHeight = (x: number) => (x > 0 ? -1 : 10)
    const hits = shoreProbeHits(0, 0, sampleHeight, 0)
    expect(hits).toBeGreaterThan(0)
    expect(hits).toBeLessThan(4)
  })
})

describe('nearestShoreProbePoint (plan ui-input-006 ocean fishing fix)', () => {
  const flatAt = (h: number) => () => h

  it('is null for a point far from any water', () => {
    expect(nearestShoreProbePoint(5, -5, flatAt(10), 0)).toBeNull()
  })

  it('returns a real point distinct from the query position when water is nearby', () => {
    const point = nearestShoreProbePoint(5, -5, flatAt(-1), 0)
    expect(point).not.toBeNull()
    expect(point).not.toEqual({ x: 5, z: -5 })
    // Must be one of the actual probe offsets, not an arbitrary point.
    expect(Math.hypot(point!.x - 5, point!.z - (-5))).toBeCloseTo(1.5, 5)
  })

  it('only returns a point that actually reads as water', () => {
    // Water only on the +x side.
    const sampleHeight = (x: number) => (x > 5 ? -1 : 10)
    const point = nearestShoreProbePoint(5, 0, sampleHeight, 0)
    expect(point).toEqual({ x: 6.5, z: 0 })
  })
})

describe('resolveWaterBodyKind (plan ui-input-006)', () => {
  it('is lake when the shore probe hits and the point reads inland', () => {
    expect(resolveWaterBodyKind(true, 0, null)).toBe('lake')
  })

  it('is ocean when the shore probe hits and the point reads oceanic', () => {
    expect(resolveWaterBodyKind(true, 1, null)).toBe('ocean')
  })

  it('is river when within the shore margin of a river bank, even with no lake/ocean probe hit', () => {
    expect(resolveWaterBodyKind(false, 0, 0)).toBe('river')
    expect(resolveWaterBodyKind(false, 0, 1.5)).toBe('river')
  })

  it('is null away from any shoreline', () => {
    expect(resolveWaterBodyKind(false, 0, null)).toBeNull()
    expect(resolveWaterBodyKind(false, 0, 1.51)).toBeNull()
  })

  it('prefers a river reading over the lake/ocean probe at the same point (plan world-terrain-046)', () => {
    // River overlap must follow the same "river always wins" precedence
    // `terrain/waterSample.ts`'s `sampleLocalWater()` already uses for
    // physical water — a river mouth is not decided by call order.
    expect(resolveWaterBodyKind(true, 0, 0)).toBe('river')
    expect(resolveWaterBodyKind(true, 1, 1.5)).toBe('river')
  })
})

describe('resolveWaterShore (plan world-terrain-046)', () => {
  // `continentalness` is low (oceanic) .. high (inland) — `oceanMixAt` turns
  // it into the ocean/lake mix `resolveWaterBodyKind` reads, so 1 (well
  // inland) reads lake and 0 (unambiguously oceanic) reads ocean.
  const flatSamplers = (sampleHeight: (x: number, z: number) => number, continentalness = 1): WaterShoreSamplers => ({
    sampleHeight,
    waterLevel: 0,
    sampleContinentalness: () => continentalness,
    region: { oceanThreshold: 0.3, coastThreshold: 0.5 },
  })

  function riverCandidate(overrides: Partial<RiverShoreCandidate> = {}): RiverShoreCandidate {
    return {
      x: 0,
      z: 0,
      elevation: 10,
      accumulation: 20,
      distanceToWaterEdge: 0,
      bankX: 1,
      bankZ: 0,
      ...overrides,
    }
  }

  it('is null with no river candidate and no flat shore nearby', () => {
    expect(resolveWaterShore(0, 0, flatSamplers(() => 10), null)).toBeNull()
  })

  it('resolves lake/ocean from the flat probe when no river candidate is supplied', () => {
    const lake = resolveWaterShore(0, 0, flatSamplers(() => -1), null)
    expect(lake).toEqual({ kind: 'lake', position: { x: 1.5, z: 0 }, distance: 0 })

    const ocean = resolveWaterShore(0, 0, flatSamplers(() => -1, 0), null)
    expect(ocean?.kind).toBe('ocean')
  })

  it('resolves an elevated river shore purely from the river candidate, with no flat waterLevel probe hit anywhere', () => {
    // Terrain never dips near `waterLevel` (a carved mountain stream can sit
    // entirely above it) — the old flat `shoreProbeHits` prerequisite would
    // have rejected this point outright before a river was ever considered.
    const candidate = riverCandidate({ distanceToWaterEdge: 0.5, bankX: 3, bankZ: 4 })
    const result = resolveWaterShore(0, 0, flatSamplers(() => 100), candidate)
    expect(result).toEqual({ kind: 'river', position: { x: 3, z: 4 }, distance: 0.5, river: candidate })
  })

  it('a river candidate within the shore margin wins over a lake/ocean probe hit at the same point (overlap/river-mouth precedence)', () => {
    const candidate = riverCandidate({ distanceToWaterEdge: -0.2, bankX: 5, bankZ: 5 })
    // Flat probe would also hit here (shallow everywhere) and reads oceanic.
    const result = resolveWaterShore(0, 0, flatSamplers(() => -1, 0), candidate)
    expect(result).toEqual({ kind: 'river', position: { x: 5, z: 5 }, distance: -0.2, river: candidate })
  })

  it('falls through to the flat lake/ocean probe once the river candidate is too far to count as shore', () => {
    const candidate = riverCandidate({ distanceToWaterEdge: 50 })
    const result = resolveWaterShore(0, 0, flatSamplers(() => -1), candidate)
    expect(result).toEqual({ kind: 'lake', position: { x: 1.5, z: 0 }, distance: 0 })
  })

  it('a null river candidate never produces a river result, even standing at a would-be river point', () => {
    // Fail-closed contract at the orchestration boundary (plan
    // world-terrain-046): the only way `resolveWaterShore` ever returns
    // `kind: 'river'` is a real, already-resolved candidate — never a
    // fabricated/assumed one.
    expect(resolveWaterShore(0, 0, flatSamplers(() => 100), null)).toBeNull()
  })
})

describe('lakeProximityAt (plan world-016)', () => {
  const region = { oceanThreshold: 0.3, coastThreshold: 0.5 }
  const inlandSamplers = (waterLevel: number, sampleHeight: (x: number, z: number) => number) => ({
    sampleHeight,
    sampleContinentalness: () => 1, // well inland, never ocean
    waterLevel,
    region,
  })

  it('is 0 with no water anywhere nearby', () => {
    const s = inlandSamplers(0, () => 10)
    expect(lakeProximityAt(0, 0, s)).toBe(0)
  })

  it('is 1 standing at/inside the lake', () => {
    const s = inlandSamplers(0, () => -1)
    expect(lakeProximityAt(0, 0, s)).toBe(1)
  })

  it('rises as the listener approaches a lake shore', () => {
    // Water beyond x = 30 only.
    const sampleHeight = (x: number) => (x > 30 ? -1 : 10)
    const s = inlandSamplers(0, sampleHeight)
    const far = lakeProximityAt(0, 0, s)
    const near = lakeProximityAt(20, 0, s)
    expect(far).toBe(0)
    expect(near).toBeGreaterThan(far)
    expect(near).toBeLessThanOrEqual(1)
  })

  it('is 0 near the ocean even where the shore-probe height check would read as water', () => {
    const s = {
      sampleHeight: () => -1,
      sampleContinentalness: () => 0, // unambiguously oceanic
      waterLevel: 0,
      region,
    }
    expect(lakeProximityAt(0, 0, s)).toBe(0)
  })
})
