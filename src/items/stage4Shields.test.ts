import { describe, expect, it } from 'vitest'
import { createHeldTool } from './HeldTool'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { ITEM_CATALOG } from './itemCatalog'
import { createItemMesh, ITEM_DEFS } from './items'
import { createAcquiredInstance } from './trade'
import { tradeValue } from './tradeCatalog'

const expected = {
  wooden_shield: { weight: 2.5, price: 25 },
  iron_rimmed_shield: { weight: 4, price: 55 },
  buckler: { weight: 1.5, price: 35 },
} as const
const kinds = Object.keys(expected) as (keyof typeof expected)[]

describe('062 W4 inventory-only shields (A7)', () => {
  it('are count-backed goods with no defense, hold, melee, ranged or source', () => {
    for (const kind of kinds) {
      const entry = ITEM_CATALOG[kind]
      expect(entry.holdable).toBe(false)
      expect(entry.defense).toBeUndefined()
      expect(entry.melee).toBeNull()
      expect(entry.ranged).toBeUndefined()
      expect(entry.armor).toBeUndefined()
      expect(entry.spawn).toBe('none')
      expect(ITEM_DEFS[kind].weight).toBe(expected[kind].weight)
      expect(ITEM_DEFS[kind].categories).not.toContain('armor')
      expect(ITEM_DEFS[kind].categories).not.toContain('weapon')
      expect(ITEM_DEFS[kind].description).toContain('nie można jej używać do blokowania')
      expect(tradeValue(kind)).toBe(expected[kind].price)
      expect(createAcquiredInstance(kind)).toBeNull()
    }
  })

  it('cannot be held and survive count snapshot round-trips', () => {
    for (const kind of kinds) {
      const inventory = new Inventory()
      inventory.add(kind, 2)
      expect(createHeldTool(inventory).equip(kind)).toBe(false)
      const restored = inventoryFromContents(snapshotInventoryContents(inventory))
      expect(restored.count(kind)).toBe(2)
    }
  })

  it('build a procedural ground mesh', () => {
    for (const kind of kinds) expect(createItemMesh(kind).children.length + 1).toBeGreaterThan(0)
  })
})
