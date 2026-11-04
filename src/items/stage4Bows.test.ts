import { describe, expect, it } from 'vitest'
import { npcRangedWeaponFamily } from '../ai/npcCombat'
import { createHeldTool } from './HeldTool'
import { createHeldToolObject, HELD_ATTACH } from './heldToolVisual'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { transferInventoryInstance } from './inventoryTransfer'
import { ITEM_CATALOG } from './itemCatalog'
import { isRangedWeaponKind, isWeaponMaintenanceKind } from './itemInstances'
import { createItemMesh, ITEM_DEFS } from './items'
import { createAcquiredInstance } from './trade'
import { tradeValue } from './tradeCatalog'
import { claimUpperTierInstance, type UpperTierIssuanceLedger } from './upperTierIssuance'

describe('062 W3a authored longbows', () => {
  it('registers both bows as maintenance-free ranged weapons with the W0 envelope', () => {
    const marlow = ITEM_CATALOG.marlow_longbow.ranged!
    const yew = ITEM_CATALOG.yewmaster_longbow.ranged!
    expect(marlow).toMatchObject({ damageType: 'pierce', damage: 30, range: 21, projectileSpeed: 35, drawTime: 0.64, recovery: 0.38, staminaCost: 11, accuracy: 0.82, criticalChance: 0.08 })
    expect(yew).toMatchObject({ damageType: 'pierce', damage: 43, range: 25, projectileSpeed: 39, drawTime: 0.58, recovery: 0.34, staminaCost: 10, accuracy: 0.92, criticalChance: 0.14 })
    for (const kind of ['marlow_longbow', 'yewmaster_longbow'] as const) {
      expect(ITEM_CATALOG[kind].ranged!.ammoKinds).toEqual(ITEM_CATALOG.long_bow.ranged!.ammoKinds)
      expect(ITEM_CATALOG[kind].spawn).toBe('none')
      expect(ITEM_CATALOG[kind].holdable).toBe(true)
      expect(isRangedWeaponKind(kind)).toBe(true)
      expect(isWeaponMaintenanceKind(kind)).toBe(false)
      expect(npcRangedWeaponFamily(kind)).toBe('bow')
      expect(HELD_ATTACH[kind]).toBeDefined()
    }
    expect(marlow.damage).toBeGreaterThan(ITEM_CATALOG.long_bow.ranged!.damage)
    expect(marlow.damage).toBeGreaterThan(ITEM_CATALOG.masterwork_hunting_bow.ranged!.damage)
    expect(yew.damage).toBeGreaterThan(marlow.damage)
    expect([ITEM_DEFS.marlow_longbow.weight, ITEM_DEFS.yewmaster_longbow.weight]).toEqual([1.5, 1.3])
    expect([tradeValue('marlow_longbow'), tradeValue('yewmaster_longbow')]).toEqual([280, 1300])
    expect(ITEM_CATALOG.hunting_bow.ranged).toMatchObject({ damage: ITEM_CATALOG.hunting_bow.ranged!.damage })
  })

  it('keeps marlow identity through acquisition, hold, transfer and snapshot restore', () => {
    const instance = createAcquiredInstance('marlow_longbow')
    expect(instance).toMatchObject({ kind: 'marlow_longbow' })
    const inventory = new Inventory()
    expect(inventory.addInstance(instance!)).toBe(true)
    const held = createHeldTool(inventory)
    expect(held.equip('marlow_longbow', instance!.id)).toBe(true)
    expect(held.heldInstanceId()).toBe(instance!.id)
    const restored = inventoryFromContents(snapshotInventoryContents(inventory))
    expect(snapshotInventoryContents(restored)).toEqual(snapshotInventoryContents(inventory))
    const destination = new Inventory()
    expect(transferInventoryInstance(restored, destination, instance!.id)).toBe(true)
    expect(destination.getInstance(instance!.id)).toEqual(instance)
  })

  it('issues yewmaster only through the 063 ledger', () => {
    expect(createAcquiredInstance('yewmaster_longbow')).toBeNull()
    expect(new Inventory().canAdd('yewmaster_longbow', 1)).toBe(false)
    const ledger: UpperTierIssuanceLedger = {}
    const destination = new Inventory()
    const instance = claimUpperTierInstance({
      ledger, kind: 'yewmaster_longbow', issuanceKey: 'test:yew', destination,
      preflightSource: () => true, snapshotSource: () => null, commitSource: () => true, restoreSource: () => undefined,
    })
    expect(instance).toMatchObject({ kind: 'yewmaster_longbow' })
    expect(ledger.yewmaster_longbow?.status).toBe('live')
    expect(createHeldTool(destination).equip('yewmaster_longbow', instance!.id)).toBe(true)
  })

  it('builds procedural ground and held geometry', async () => {
    for (const kind of ['marlow_longbow', 'yewmaster_longbow'] as const) {
      expect(createItemMesh(kind).children.length).toBeGreaterThan(0)
      expect(await createHeldToolObject(kind)).toBeTruthy()
    }
  })
})
