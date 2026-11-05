import { describe, expect, it } from 'vitest'
import {
  buildLandformIndex,
  EMPTY_LANDFORM_INDEX,
  LANDFORM_BUCKET_SIZE_M,
  LANDFORM_MAX_PER_BUCKET,
  type LandformDescriptor,
  landformDescriptorsFor,
  landformHeightDeltaAt,
  landformIndexFor,
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

describe('landform descriptors (R0 framework)', () => {
  it('produces no descriptors yet, so the height delta is exactly zero', () => {
    for (const seed of [42, 415424794]) {
      expect(landformDescriptorsFor(seed)).toHaveLength(0)
      const index = landformIndexFor(seed)
      expect(index).toBe(EMPTY_LANDFORM_INDEX)
      expect(landformHeightDeltaAt(index, 123, -456)).toBe(0)
    }
  })

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
