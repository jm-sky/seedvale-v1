import { describe, expect, it } from 'vitest'
import { STOREHOUSE_BAY_SLOTS, storehouseBaySlotFor, storehouseLayoutFor } from './storehouseLayout'

describe('storehouseLayout (Q43)', () => {
  const layout = storehouseLayoutFor({ width: 6, depth: 4 }, 10, 20, 0.4)

  it('has three distinct, ≥1.5 m apart bay slots outside the shell', () => {
    expect(layout.baySlots).toHaveLength(STOREHOUSE_BAY_SLOTS)
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        const a = layout.baySlots[i]!
        const b = layout.baySlots[j]!
        expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThanOrEqual(1.5)
      }
      const s = layout.baySlots[i]!
      // inverse-rotate into house-local: |x| beyond half width
      const dx = s.x - 10
      const dz = s.z - 20
      const lx = dx * Math.cos(0.4) - dz * Math.sin(0.4)
      expect(lx).toBeGreaterThan(3)
    }
  })

  it('picks a stable slot per npc id and spreads over all slots', () => {
    expect(storehouseBaySlotFor('npc-1', 3)).toBe(storehouseBaySlotFor('npc-1', 3))
    const used = new Set(Array.from({ length: 60 }, (_, i) => storehouseBaySlotFor(`npc-${i}`, 3)))
    expect(used.size).toBe(3)
    expect(storehouseBaySlotFor('x', 1)).toBe(0)
  })
})
