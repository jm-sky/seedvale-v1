import { describe, expect, it } from 'vitest'
import type { WaterfallSite } from '../terrain/waterfallSites'
import { buildWaterfallSprayGeometry, SPRAY_QUADS_PER_SITE } from './waterfallSpray'

function site(id: WaterfallSite['id'], bx: number, bz: number): WaterfallSite {
  return {
    id,
    tier: 'landmark',
    top: { x: bx - 10, z: bz, water: 30 },
    bottom: { x: bx, z: bz, water: 10 },
    dropM: 20,
    lengthM: 30,
    widthM: 4,
    chainIndex: 0,
    offsetTopM: 0,
    offsetBottomM: 30,
  }
}

describe('buildWaterfallSprayGeometry', () => {
  it('returns null without sites', () => {
    expect(buildWaterfallSprayGeometry([], 0, 0)).toBeNull()
  })

  it('stays within the per-site budget (≤ 48 quads = 96 tris)', () => {
    const g = buildWaterfallSprayGeometry([site('waterfall:1_1', 20, 20), site('waterfall:5_5', 90, 90)], 0, 0)!
    expect(g.getIndex()!.count / 3).toBe(2 * SPRAY_QUADS_PER_SITE * 2)
    expect(SPRAY_QUADS_PER_SITE * 2).toBeLessThanOrEqual(96)
  })

  it('is deterministic per site and independent of the chunk origin (world-space layout)', () => {
    const s = site('waterfall:3_4', 50, 70)
    const a = buildWaterfallSprayGeometry([s], 0, 0)!.getAttribute('position')
    const b = buildWaterfallSprayGeometry([s], 64, 64)!.getAttribute('position')
    for (let i = 0; i < a.count; i++) {
      expect(a.getX(i) - 64).toBeCloseTo(b.getX(i) + 0, 4)
      expect(a.getY(i)).toBe(b.getY(i))
    }
  })
})
