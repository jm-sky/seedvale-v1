import { describe, expect, it } from 'vitest'
import { createSightBlockerRegistry, type SightBlocker, sightBlockerBounds, type SightPanel } from './sightBlockers'

const panel = (x: number, z: number, halfWidth = 1, rotationY = 0): SightPanel => ({
  kind: 'panel', x, z, halfWidth, halfDepth: 0.2, rotationY, minY: 0, maxY: 3,
})

function collect(reg: ReturnType<typeof createSightBlockerRegistry>, ax: number, az: number, bx: number, bz: number): SightBlocker[] {
  const out: SightBlocker[] = []
  reg.forEachNearSegment(ax, az, bx, bz, (b) => { out.push(b); return false })
  return out
}

describe('SightBlockerRegistry', () => {
  it('bumps revision on set/clear but not when clearing an absent owner', () => {
    const reg = createSightBlockerRegistry()
    const r0 = reg.revision()
    reg.clearBlockers('nobody')
    expect(reg.revision()).toBe(r0)
    reg.setBlockers('a', [panel(0, 0)])
    expect(reg.revision()).toBe(r0 + 1)
    reg.setBlockers('a', [panel(1, 0)])
    expect(reg.revision()).toBe(r0 + 2)
    expect(reg.size()).toBe(1)
    reg.clearBlockers('a')
    expect(reg.revision()).toBe(r0 + 3)
    expect(reg.size()).toBe(0)
    reg.clear()
    expect(reg.revision()).toBe(r0 + 3)
  })

  it('replaces an owner’s blockers (old ones are no longer found)', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('a', [panel(0, 0)])
    reg.setBlockers('a', [panel(100, 100)])
    expect(collect(reg, -5, 0, 5, 0)).toHaveLength(0)
    expect(collect(reg, 95, 100, 105, 100)).toHaveLength(1)
  })

  it('visits a blocker spanning many cells exactly once', () => {
    const reg = createSightBlockerRegistry(4)
    reg.setBlockers('a', [panel(0, 0, 20)])
    expect(collect(reg, -30, -30, 30, 30)).toHaveLength(1)
  })

  it('finds a long panel whose centre lies outside the segment’s cells', () => {
    const reg = createSightBlockerRegistry(4)
    // 40 m long wall centred at x=0; segment crosses it at x=17 (cell far from centre).
    reg.setBlockers('a', [panel(0, 0, 20)])
    expect(collect(reg, 17, -3, 17, 3)).toHaveLength(1)
  })

  it('bounds account for rotation', () => {
    const b = sightBlockerBounds(panel(0, 0, 5, Math.PI / 2))
    expect(b.maxZ).toBeCloseTo(5)
    expect(b.maxX).toBeCloseTo(0.2)
  })

  it('stops visiting when the visitor returns true', () => {
    const reg = createSightBlockerRegistry()
    reg.setBlockers('a', [panel(0, 0), panel(1, 0), panel(2, 0)])
    let n = 0
    reg.forEachNearSegment(-5, 0, 5, 0, () => { n++; return true })
    expect(n).toBe(1)
  })
})
