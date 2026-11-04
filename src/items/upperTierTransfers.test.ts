import { afterEach, describe, expect, it } from 'vitest'
import type { ItemInstance } from './itemInstances'
import { commitWorldPickup } from '../app/interactables'
import { commitNpcDeath, transferCorpseInstanceTo } from '../settlement/npcPostDeath'
import { createNpcAuthoritativeState } from '../settlement/npcState'
import { Inventory, inventoryFromContents, snapshotInventoryContents } from './Inventory'
import { transferInventoryInstance } from './inventoryTransfer'
import { ITEM_CATALOG, type ItemCatalogEntry } from './itemCatalog'
import { ITEM_DEFS, type ItemDef, type ItemKind } from './items'
import { diagnoseUpperTierOwnerRows } from './upperTierIdentities'
import { claimUpperTierInstance, type UpperTierIssuanceLedger } from './upperTierIssuance'

// Register only inside this isolated fixture: production upper-tier profiles and
// sources remain disabled until their separate intake/review gates pass.
const reserved = 'yewmaster_longbow'
const defs = ITEM_DEFS as Record<string, ItemDef | undefined>
const catalog = ITEM_CATALOG as Record<string, ItemCatalogEntry | undefined>
const originalDef = defs[reserved]
const originalCatalog = catalog[reserved]
afterEach(() => {
  if (originalDef) defs[reserved] = originalDef
  else delete defs[reserved]
  if (originalCatalog) catalog[reserved] = originalCatalog
  else delete catalog[reserved]
})

function issue(destination: Inventory, ledger: UpperTierIssuanceLedger) {
  defs[reserved] = { ...ITEM_DEFS.hunting_bow, kind: reserved as ItemKind }
  catalog[reserved] = { ...ITEM_CATALOG.hunting_bow, kind: reserved as ItemKind }
  return claimUpperTierInstance({
    ledger, destination, kind: reserved, issuanceKey: 'fixture:reward',
    preflightSource: () => true,
    snapshotSource: () => null,
    commitSource: () => true,
    restoreSource: () => {},
  })!
}

function ownerRows(owners: Record<string, Inventory>) {
  return Object.entries(owners).flatMap(([owner, inventory]) => (
    inventory.instancesToJSON().map(instance => ({ owner, instance }))
  ))
}

describe('063 exact-instance ownership integration', () => {
  it('keeps one claim through transfers and full owner snapshot reconstruction in different orders', () => {
    const ledger: UpperTierIssuanceLedger = {}
    const owners = Object.fromEntries(['player', 'npc', 'merchant', 'household', 'container', 'cargo'].map(owner => [owner, new Inventory()]))
    const instance = issue(owners.player!, ledger)
    expect(instance).not.toBeNull()
    const names = Object.keys(owners)
    for (let index = 1; index < names.length; index++) {
      expect(transferInventoryInstance(owners[names[index - 1]!]!, owners[names[index]!]!, instance.id)).toBe(true)
      expect(diagnoseUpperTierOwnerRows(ledger, ownerRows(owners))).toBeNull()
      expect(ledger[reserved]?.instanceId).toBe(instance.id)
    }
    const payload = JSON.parse(JSON.stringify({ ledger, owners: Object.entries(owners).map(([owner, inventory]) => [owner, snapshotInventoryContents(inventory)]) }))
    for (const order of [payload.owners, [...payload.owners].reverse()]) {
      const rebuilt = Object.fromEntries(order.map(([owner, contents]: [string, ReturnType<typeof snapshotInventoryContents>]) => [owner, inventoryFromContents(contents)]))
      expect(diagnoseUpperTierOwnerRows(payload.ledger, ownerRows(rebuilt))).toBeNull()
      expect(rebuilt.cargo.getInstance(instance.id)).toEqual(instance)
    }
    expect(transferInventoryInstance(owners.cargo!, owners.player!, instance.id)).toBe(true)
    expect(diagnoseUpperTierOwnerRows(ledger, ownerRows(owners))).toBeNull()
  })

  it('moves the claimed specimen into corpse loot and back without issuing a replacement', () => {
    const ledger: UpperTierIssuanceLedger = {}
    const npc = createNpcAuthoritativeState('fixture:npc', 0)
    const instance = issue(npc.personalInventory, ledger)
    expect(commitNpcDeath({ state: npc, personalInventory: npc.personalInventory, x: 1, z: 2, yaw: 0, nowDays: 3 })).toBe(true)
    expect(npc.personalInventory.getInstance(instance.id)).toBeNull()
    expect(npc.postDeath!.loot.instances).toEqual([instance])
    expect(diagnoseUpperTierOwnerRows(ledger, npc.postDeath!.loot.instances.map(instance => ({ owner: 'corpse', instance })))).toBeNull()
    const player = new Inventory()
    expect(transferCorpseInstanceTo(npc.postDeath!, player, instance.id)).toBe(true)
    expect(npc.postDeath!.loot.instances).toEqual([])
    expect(player.getInstance(instance.id)).toEqual(instance)
    expect(ledger[reserved]?.instanceId).toBe(instance.id)
    expect(diagnoseUpperTierOwnerRows(ledger, ownerRows({ player }))).toBeNull()
    expect(diagnoseUpperTierOwnerRows(ledger, [])).toMatch(/live claim/)
  })

  it('reloads an issued drop and picks up that exact specimen, retaining its source on capacity failure', () => {
    const ledger: UpperTierIssuanceLedger = {}
    const source = new Inventory()
    const instance = issue(source, ledger)
    source.removeInstance(instance.id)
    const drop = JSON.parse(JSON.stringify(instance)) as typeof instance
    let retired = false
    const resolution = {
      itemKind: reserved as ItemKind, instance: drop, authoredOneShot: false,
      retire: () => { retired = true; return true },
    }
    expect(commitWorldPickup(resolution, new Inventory({}, 0), 0).ok).toBe(false)
    expect(retired).toBe(false)
    const destination = new Inventory()
    expect(commitWorldPickup(resolution, destination, 0).ok).toBe(true)
    expect(retired).toBe(true)
    expect(destination.getInstance(instance.id)).toEqual(instance)
    expect(diagnoseUpperTierOwnerRows(ledger, ownerRows({ destination }))).toBeNull()
  })

  it('can commit a durable pickup payload using the existing destination transaction contract', () => {
    // Reuse the registered fixture profile; no source is added to the world.
    issue(new Inventory(), {})
    const ledger: UpperTierIssuanceLedger = {}
    const pickup: { instance: ItemInstance | null } = { instance: null }
    const destination = {
      canAddInstance: () => pickup.instance === null,
      addInstance: (instance: ItemInstance) => { pickup.instance = instance; return true },
      removeInstance: (id: string) => {
        if (pickup.instance?.id !== id) return false
        pickup.instance = null
        return true
      },
    }
    const issued = claimUpperTierInstance({
      ledger, destination, kind: reserved, issuanceKey: 'fixture:pickup',
      preflightSource: () => true, snapshotSource: () => null,
      commitSource: () => true, restoreSource: () => {},
    })
    expect(issued).not.toBeNull()
    expect(pickup.instance).toEqual(issued)
    expect(ledger[reserved]?.instanceId).toBe(issued?.id)
  })

  it('diagnoses duplicate IDs, multiple specimens and contradictory or missing claims', () => {
    const ledger: UpperTierIssuanceLedger = {}
    const player = new Inventory()
    const instance = issue(player, ledger)
    const row = { owner: 'player', instance }
    expect(diagnoseUpperTierOwnerRows(ledger, [row, { owner: 'merchant', instance }])).toMatch(/duplicate instance/)
    expect(diagnoseUpperTierOwnerRows(ledger, [row, { owner: 'container', instance: { ...instance, id: 'other' } }])).toMatch(/live claim/)
    expect(diagnoseUpperTierOwnerRows(ledger, [row, { owner: 'ordinary', instance: { id: instance.id, kind: 'knife' } }])).toMatch(/duplicate instance/)
    expect(diagnoseUpperTierOwnerRows({}, [row])).toMatch(/unclaimed/)
    expect(diagnoseUpperTierOwnerRows({ [reserved]: { ...ledger[reserved]!, status: 'destroyed' } }, [row])).toMatch(/destroyed claim/)
  })
})
