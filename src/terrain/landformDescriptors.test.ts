import { describe, expect, it } from 'vitest'
import {
  buildLandformIndex,
  generateLandforms,
  LANDFORM_BUCKET_SIZE_M,
  LANDFORM_MAX_PER_BUCKET,
  type LandformDescriptor,
  landformHeightDeltaAt,
} from './landformDescriptors'

const crag = (id: string, x: number, z: number, radius: number): LandformDescriptor => ({
  id: `lf:crag:${id}`,
  kind: 'crag',
  centreX: x,
  centreZ: z,
  radius,
  params: {},
  intendedOutcome: 'test',
})

describe('landform descriptors (index)', () => {
  it('finds a descriptor from every bucket its footprint touches', () => {
    const d = crag('a', 500, 0, 100) // straddles the x = 512 bucket border
    const index = buildLandformIndex([d])
    expect(index.near(480, 10)).toContain(d)
    expect(index.near(520, 10)).toContain(d)
    expect(index.near(5000, 5000)).toHaveLength(0)
  })

  it('rejects a footprint wider than one bucket and an over-full bucket', () => {
    expect(() => buildLandformIndex([crag('big', 0, 0, LANDFORM_BUCKET_SIZE_M + 1)])).toThrow(/radius/)
    const crowd = Array.from({ length: LANDFORM_MAX_PER_BUCKET + 1 }, (_, i) => crag(String(i), 100 + i, 100, 20))
    expect(() => buildLandformIndex(crowd)).toThrow(/overlapping/)
  })
})

describe('landform generation + profiles (R3)', () => {
  const ctx = { floorH: () => 8, waterLevel: 0.45, halfExtent: 4000 }

  it('is deterministic, respects the home reserve and separation, and ids are cell-based', () => {
    const a = generateLandforms(42, ctx)
    const b = generateLandforms(42, ctx)
    expect(a).toEqual(b)
    expect(a.length).toBeGreaterThanOrEqual(3)
    for (const d of a) {
      expect(d.id).toMatch(/^lf:(crag|crater|lakeIsland):-?\d+_-?\d+$/)
      expect(Math.hypot(d.centreX, d.centreZ)).toBeGreaterThanOrEqual(1150 + d.radius)
    }
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
      expect(Math.hypot(a[i]!.centreX - a[j]!.centreX, a[i]!.centreZ - a[j]!.centreZ)).toBeGreaterThanOrEqual(700)
    }
  })

  it('places nothing on terrain that is not flat lowland (no stamping onto ranges)', () => {
    expect(generateLandforms(42, { ...ctx, floorH: (x) => 30 + x * 0.001 })).toHaveLength(0)
  })

  it('height profiles are continuous and vanish at the footprint edge', () => {
    for (const d of generateLandforms(7, ctx)) {
      const index = buildLandformIndex([d])
      const edge = landformHeightDeltaAt(index, d.centreX + d.radius - 0.01, d.centreZ)
      expect(Math.abs(edge)).toBeLessThan(0.05)
      expect(landformHeightDeltaAt(index, d.centreX + d.radius + 1, d.centreZ)).toBe(0)
      if (d.kind === 'crag') expect(landformHeightDeltaAt(index, d.centreX, d.centreZ)).toBeGreaterThan(5)
      if (d.kind === 'crater') {
        // Dry ring: never a pit (no negative delta), interior at ground level, rim up on the far side of the gap.
        expect(landformHeightDeltaAt(index, d.centreX, d.centreZ)).toBeCloseTo(0, 6)
        const notch = d.params.notch ?? 0
        const rimAt = (a: number) => landformHeightDeltaAt(index, d.centreX + Math.cos(a) * d.radius * 0.78, d.centreZ + Math.sin(a) * d.radius * 0.78)
        expect(rimAt(notch + Math.PI)).toBeGreaterThan(3)
        expect(rimAt(notch)).toBeLessThan(0.05)
        for (let k = 0; k < 24; k++) expect(rimAt((k / 24) * Math.PI * 2)).toBeGreaterThanOrEqual(0)
      }
      if (d.kind === 'lakeIsland') {
        expect(landformHeightDeltaAt(index, d.centreX, d.centreZ)).toBeGreaterThan(0)
        expect(landformHeightDeltaAt(index, d.centreX + d.radius * 0.6, d.centreZ)).toBeLessThan(-2)
      }
    }
  })
})
