import { describe, expect, it } from 'vitest'
import { npcMeleeWeaponFamily, resolveNpcMeleeWeapon } from '../ai/npcCombat'
import { isMeleeTool } from '../fauna/faunaCombat'
import { createHeldTool } from './HeldTool'
import { createHeldToolObject, HELD_ATTACH } from './heldToolVisual'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { transferInventoryInstance } from './inventoryTransfer'
import { ITEM_CATALOG } from './itemCatalog'
import { isWeaponMaintenanceKind } from './itemInstances'
import { createItemMesh } from './items'
import { createAcquiredInstance } from './trade'
import { tradeValue } from './tradeCatalog'

const kinds = ['obsidian_knife', 'halberd', 'mace', 'sword'] as const

describe('062 W2a authored melee intake', () => {
  it('uses the shared melee/held pipeline and has no catalog source', () => {
    const expected = { obsidian_knife: ['pierce', 'compact', 55], halberd: ['cut', 'spear', 95], mace: ['blunt', 'tool', 50], sword: ['cut', 'sword', 65] } as const
    for (const kind of kinds) {
      expect(ITEM_CATALOG[kind].spawn).toBe('none')
      expect(ITEM_CATALOG[kind].melee?.damageType).toBe(expected[kind][0])
      expect(npcMeleeWeaponFamily(kind)).toBe(expected[kind][1])
      expect(tradeValue(kind)).toBe(expected[kind][2])
      expect(isMeleeTool(kind)).toBe(true)
      expect(HELD_ATTACH[kind]).toBeDefined()
    }
  })

  it('preserves count/instance identity through equip, transfer and snapshot restore', () => {
    for (const kind of kinds) {
      const inventory = new Inventory()
      const acquired = createAcquiredInstance(kind)
      expect(isWeaponMaintenanceKind(kind)).toBe(kind !== 'mace')
      if (acquired) expect(inventory.addInstance(acquired)).toBe(true)
      else inventory.add(kind, 1)
      const held = createHeldTool(inventory)
      expect(held.equip(kind, acquired?.id)).toBe(true)
      expect(held.held()).toBe(kind)
      expect(held.heldInstanceId()).toBe(acquired?.id ?? null)
      expect(resolveNpcMeleeWeapon(inventory, 'guard')?.kind).toBe(kind)
      const restored = inventoryFromContents(snapshotInventoryContents(inventory))
      expect(snapshotInventoryContents(restored)).toEqual(snapshotInventoryContents(inventory))
      if (acquired) {
        const destination = new Inventory()
        expect(transferInventoryInstance(restored, destination, acquired.id)).toBe(true)
        expect(destination.getInstance(acquired.id)).toEqual(acquired)
        expect(restored.getInstance(acquired.id)).toBeNull()
      }
    }
  })

  it('produces real procedural ground and held geometry without a missing asset request', async () => {
    for (const kind of kinds) {
      const ground = createItemMesh(kind)
      const held = await createHeldToolObject(kind)
      expect(ground.children.length, kind).toBeGreaterThan(0)
      expect(held.children.length, kind).toBeGreaterThan(0)
    }
  })
})
