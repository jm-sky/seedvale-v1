import { describe, expect, it } from 'vitest'
import { PLATE_MAX_DELTA_M, rockPlateAt } from './rockPlates'

describe('rockPlateAt', () => {
  it('is empty outside the rock zone', () => {
    for (let i = 0; i < 50; i++) expect(rockPlateAt(7, i * 3.3, i * 1.7, 0)).toMatchObject({ delta: 0, patch: 0 })
  })

  it('is deterministic and bounded', () => {
    let rock = 0
    for (let i = 0; i < 4000; i++) {
      const x = (i % 80) * 1.5
      const z = Math.floor(i / 80) * 1.5
      const a = rockPlateAt(7, x, z, 1)
      expect(rockPlateAt(7, x, z, 1)).toEqual(a)
      expect(Math.abs(a.delta)).toBeLessThanOrEqual(PLATE_MAX_DELTA_M)
      if (a.patch > 0) rock++
    }
    // Sparse patches with gaps: a minority of a full-zone area is bare rock (edges fade, so coverage is below the plate share).
    expect(rock / 4000).toBeGreaterThan(0.08)
    expect(rock / 4000).toBeLessThan(0.5)
  })

  it('weakens toward the zone edge', () => {
    let full = 0
    let edge = 0
    for (let i = 0; i < 2000; i++) {
      if (rockPlateAt(3, i * 2.1, i * 0.7, 1).patch > 0) full++
      if (rockPlateAt(3, i * 2.1, i * 0.7, 0.15).patch > 0) edge++
    }
    expect(edge).toBeLessThan(full)
  })
})
