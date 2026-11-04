import { describe, expect, it } from 'vitest'
import { resolveNpcAmmo } from '../ai/npcCombat'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { AMMO_DAMAGE_TYPE, ammoDamageBonus, ITEM_CATALOG, rangedConfigFromThrowable } from './itemCatalog'
import { createItemMesh, hasItemCategory, ITEM_DEFS } from './items'
import { createAcquiredInstance } from './trade'
import { tradeValue } from './tradeCatalog'

describe('062 W3c crossbow bolts', () => {
  it('admits the new bolts only on the crossbow, in order, with authored types and bonuses', () => {
    expect(ITEM_CATALOG.crossbow.ranged!.ammoKinds).toEqual(['bolt', 'bolt_heavy', 'bolt_blunt'])
    for (const kind of ['bolt_heavy', 'bolt_blunt'] as const) {
      expect(ITEM_CATALOG[kind]).toMatchObject({ holdable: false, spawn: 'none' })
      expect(ITEM_CATALOG[kind].throwable).toBeUndefined()
      expect(createAcquiredInstance(kind)).toBeNull()
      expect(createItemMesh(kind).children.length + 1).toBeGreaterThan(0)
      for (const other of Object.keys(ITEM_CATALOG) as (keyof typeof ITEM_CATALOG)[]) {
        if (other !== 'crossbow') expect(ITEM_CATALOG[other].ranged?.ammoKinds ?? []).not.toContain(kind)
      }
    }
    expect([AMMO_DAMAGE_TYPE.bolt_heavy, AMMO_DAMAGE_TYPE.bolt_blunt]).toEqual(['pierce', 'blunt'])
    expect([ITEM_DEFS.bolt_heavy.weight, ITEM_DEFS.bolt_blunt.weight]).toEqual([0.12, 0.1])
    expect([tradeValue('bolt_heavy'), tradeValue('bolt_blunt')]).toEqual([4, 3])
    expect([ammoDamageBonus('bolt_heavy', 'player'), ammoDamageBonus('bolt_heavy', 'npc')]).toEqual([6, 6])
    expect([ammoDamageBonus('bolt_blunt', 'player'), ammoDamageBonus('bolt_blunt', 'npc')]).toEqual([0, 0])
    expect([ammoDamageBonus('bolt', 'player'), ammoDamageBonus('bolt', 'npc')]).toEqual([0, 0])
  })

  it('selects mixed bolt stacks in ammoKinds order and consumes one unit; sling_stone is rejected', () => {
    const crossbow = ITEM_CATALOG.crossbow.ranged!
    const inventory = new Inventory()
    inventory.add('bolt_blunt', 2)
    inventory.add('bolt_heavy', 2)
    expect(resolveNpcAmmo([inventory], crossbow)).toMatchObject({ kind: 'bolt_heavy' })
    inventory.remove('bolt_heavy', 2)
    expect(resolveNpcAmmo([inventory], crossbow)).toMatchObject({ kind: 'bolt_blunt' })
    const onlySling = new Inventory()
    onlySling.add('sling_stone', 5)
    expect(resolveNpcAmmo([onlySling], crossbow)).toBeNull()
    const restored = inventoryFromContents(snapshotInventoryContents(inventory))
    expect([restored.count('bolt_blunt'), restored.count('bolt_heavy')]).toEqual([2, 0])
  })
})

describe('062 W3b sling_stone', () => {
  it('is count-backed sling-only blunt ammo: not a resource, not throwable, no source', () => {
    expect(ITEM_CATALOG.sling_stone).toMatchObject({ holdable: false, spawn: 'none' })
    expect(ITEM_CATALOG.sling_stone.throwable).toBeUndefined()
    expect(rangedConfigFromThrowable('sling_stone')).toBeNull()
    expect(hasItemCategory(ITEM_DEFS.sling_stone, 'resource')).toBe(false)
    expect(hasItemCategory(ITEM_DEFS.stone, 'resource')).toBe(true)
    expect(ITEM_DEFS.sling_stone.weight).toBe(0.08)
    expect(tradeValue('sling_stone')).toBe(2)
    expect(AMMO_DAMAGE_TYPE.sling_stone).toBe('blunt')
    expect(createAcquiredInstance('sling_stone')).toBeNull()
    expect(createItemMesh('sling_stone').children.length + 1).toBeGreaterThan(0)
  })

  it('is admitted only by the sling, after stone, and stone keeps its throw role', () => {
    expect(ITEM_CATALOG.sling.ranged!.ammoKinds).toEqual(['stone', 'sling_stone'])
    for (const kind of Object.keys(ITEM_CATALOG) as (keyof typeof ITEM_CATALOG)[]) {
      if (kind === 'sling') continue
      expect(ITEM_CATALOG[kind].ranged?.ammoKinds ?? []).not.toContain('sling_stone')
    }
    expect(rangedConfigFromThrowable('stone')).not.toBeNull()
    expect(ITEM_CATALOG.sling.ranged!.ammoKinds).toContain('stone')
  })

  it('applies the +2 bonus to player and NPC while native arrow bonuses stay player-only', () => {
    expect(ammoDamageBonus('sling_stone', 'player')).toBe(2)
    expect(ammoDamageBonus('sling_stone', 'npc')).toBe(2)
    expect(ammoDamageBonus('stone', 'player')).toBe(0)
    expect(ammoDamageBonus('stone', 'npc')).toBe(0)
    expect(ammoDamageBonus('war_arrow', 'player')).toBe(8)
    expect(ammoDamageBonus('war_arrow', 'npc')).toBe(0)
    expect(ammoDamageBonus('broadhead_arrow', 'npc')).toBe(0)
  })

  it('picks ammo deterministically in ammoKinds order and consumes exactly one unit from the chosen owner', () => {
    const sling = ITEM_CATALOG.sling.ranged!
    const personal = new Inventory()
    const carried = new Inventory()
    personal.add('sling_stone', 3)
    carried.add('stone', 2)
    const first = resolveNpcAmmo([personal, carried], sling)
    expect(first).toMatchObject({ kind: 'stone', inventory: carried })
    first!.inventory.remove(first!.kind, 1)
    expect(carried.count('stone')).toBe(1)
    expect(personal.count('sling_stone')).toBe(3)
    carried.remove('stone', 1)
    const second = resolveNpcAmmo([personal, carried], sling)
    expect(second).toMatchObject({ kind: 'sling_stone', inventory: personal })
    second!.inventory.remove(second!.kind, 1)
    expect(personal.count('sling_stone')).toBe(2)
    expect(resolveNpcAmmo([personal], ITEM_CATALOG.long_bow.ranged!)).toBeNull()
    expect(resolveNpcAmmo([personal], ITEM_CATALOG.crossbow.ranged!)).toBeNull()
  })

  it('round-trips counts through inventory snapshots', () => {
    const inventory = new Inventory()
    inventory.add('sling_stone', 7)
    const restored = inventoryFromContents(snapshotInventoryContents(inventory))
    expect(restored.count('sling_stone')).toBe(7)
  })
})
