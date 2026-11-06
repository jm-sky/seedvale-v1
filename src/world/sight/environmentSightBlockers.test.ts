import { describe, expect, it } from 'vitest'
import { environmentSightBlocker } from './environmentSightBlockers'

describe('environmentSightBlocker', () => {
  it('large rock: radius*scale, height above ground', () => {
    const c = environmentSightBlocker('largeRock', 3, 4, 2, 0.9, 10)!
    expect(c.radius).toBeCloseTo(1.8)
    expect(c.minY).toBe(10)
    expect(c.maxY).toBeCloseTo(10 + 1.8 * 1.2)
  })
  it('tower and shipwreck block with scaled heights', () => {
    expect(environmentSightBlocker('tower', 0, 0, 1, 1.6, 0)!.maxY).toBeGreaterThan(5)
    expect(environmentSightBlocker('shipwreck', 0, 0, 1, 3.5, 0)!.radius).toBeCloseTo(3.5)
  })
  it('clusters, logs, trees, zero-radius kinds never block', () => {
    for (const kind of ['rockCluster', 'fallenLog', 'oldTree', 'campfire', 'monolith', 'boat', 'wagon']) {
      expect(environmentSightBlocker(kind, 0, 0, 1, 1, 0)).toBeNull()
    }
    expect(environmentSightBlocker('tower', 0, 0, 1, 0, 0)).toBeNull()
  })
})
