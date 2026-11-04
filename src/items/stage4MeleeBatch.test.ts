import { describe, expect, it } from 'vitest'
import { npcMeleeWeaponFamily, resolveNpcMeleeWeapon } from '../ai/npcCombat'
import { isMeleeTool } from '../fauna/faunaCombat'
import { createHeldTool } from './HeldTool'
import { createHeldToolObject, HELD_ATTACH } from './heldToolVisual'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { transferInventoryInstance } from './inventoryTransfer'
import { ITEM_CATALOG } from './itemCatalog'
import { isWeaponMaintenanceKind } from './itemInstances'
import { createItemMesh, ITEM_DEFS } from './items'
import { createAcquiredInstance } from './trade'
import { tradeValue } from './tradeCatalog'

const kinds = ['obsidian_knife', 'halberd', 'mace', 'sword', 'obsidian_dagger', 'club', 'war_hammer', 'staff'] as const

describe('062 W2a/W2b authored melee intake', () => {
  it('uses the shared melee/held pipeline and has no catalog source', () => {
    const expected = { obsidian_knife: ['pierce', 'compact', 30], halberd: ['cut', 'spear', 45], mace: ['blunt', 'tool', 30], sword: ['cut', 'sword', 45], obsidian_dagger: ['pierce', 'compact', 36], club: ['blunt', 'tool', 12], war_hammer: ['blunt', 'tool', 45], staff: ['blunt', 'tool', 15] } as const
    const weights = { obsidian_knife: .35, halberd: 3.5, mace: 1.8, sword: 1.9, obsidian_dagger: .45, club: 1.2, war_hammer: 3, staff: 1 } as const
    for (const kind of kinds) {
      expect(ITEM_CATALOG[kind].spawn).toBe('none')
      expect(ITEM_DEFS[kind].weight).toBe(weights[kind])
      expect(ITEM_CATALOG[kind].melee?.damageType).toBe(expected[kind][0])
      expect(npcMeleeWeaponFamily(kind)).toBe(expected[kind][1])
      expect(tradeValue(kind)).toBe(expected[kind][2])
      expect(ITEM_CATALOG[kind].holdable).toBe(true)
      expect(isMeleeTool(kind)).toBe(true)
      expect(HELD_ATTACH[kind]).toBeDefined()
    }
  })

  it('applies review 033 profile corrections and preserves knife harvesting auto-pick', () => {
    expect(ITEM_DEFS.sword.weight).toBe(1.9)
    expect(ITEM_CATALOG.sword.defense).toMatchObject({ baseBlockChance: .24, partialReduction: .48 })
    expect(ITEM_CATALOG.obsidian_knife.capabilities ?? []).not.toContain('meat_harvesting')
    expect(ITEM_CATALOG.obsidian_dagger.capabilities ?? []).not.toContain('meat_harvesting')
    const inventory = new Inventory()
    inventory.add('knife', 1)
    inventory.add('obsidian_knife', 1)
    inventory.add('obsidian_dagger', 1)
    expect(inventory.findWithCapability('meat_harvesting')).toBe('knife')
  })

  it('preserves count/instance identity through equip, transfer and snapshot restore', () => {
    for (const kind of kinds) {
      const inventory = new Inventory()
      const acquired = createAcquiredInstance(kind)
      expect(isWeaponMaintenanceKind(kind)).toBe(kind === 'obsidian_knife' || kind === 'halberd' || kind === 'sword' || kind === 'obsidian_dagger')
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
