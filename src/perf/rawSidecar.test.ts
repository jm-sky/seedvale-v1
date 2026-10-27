import { describe, expect, it } from 'vitest'
import { emptySessionTotals } from './monitor'
import { buildRawSidecar, RAW_SIDECAR_FULL_LIMIT } from './rawSidecar'

describe('buildRawSidecar', () => {
  it('exports a full series under the limit', () => {
    const totals = emptySessionTotals()
    for (let i = 0; i < 10; i++) {
      totals.frameMs.push(16 + i)
      totals.simulateMs.push(4)
      totals.renderWallMs.push(12)
      totals.drawCallsSeries.push(100)
      totals.trianglesSeries.push(1000)
    }
    const raw = buildRawSidecar(totals)
    expect(raw.sampling.mode).toBe('full')
    expect(raw.sampling.factor).toBe(1)
    expect(raw.sampling.exportedCount).toBe(10)
    expect(raw.frames[0]?.simulateMs).toBe(4)
  })

  it('decimates with explicit sampling metadata when over the limit', () => {
    const totals = emptySessionTotals()
    const n = RAW_SIDECAR_FULL_LIMIT + 100
    for (let i = 0; i < n; i++) {
      totals.frameMs.push(16)
      totals.simulateMs.push(5)
      totals.renderWallMs.push(11)
      totals.drawCallsSeries.push(1)
      totals.trianglesSeries.push(1)
    }
    const raw = buildRawSidecar(totals)
    expect(raw.sampling.mode).toBe('decimated')
    expect(raw.sampling.factor).toBeGreaterThan(1)
    expect(raw.sampling.originalCount).toBe(n)
    expect(raw.sampling.exportedCount).toBe(raw.frames.length)
    expect(raw.frames.length).toBeLessThanOrEqual(RAW_SIDECAR_FULL_LIMIT)
  })
})
