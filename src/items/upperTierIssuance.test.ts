import { afterEach, describe, expect, it } from 'vitest'
import type { ItemKind } from './items'
import { upperTierOwnerRowsFromSave } from '../persistence/saveData'
import { Inventory } from './Inventory'
import { ITEM_DEFS } from './items'
import { createAcquiredInstance, sellInstancesForCoins } from './trade'
import { resolveInstanceSellPrice } from './tradeCatalog'
import { UPPER_TIER_IDENTITY_LIST } from './upperTierIdentities'
import { claimUpperTierInstance, markUpperTierDestroyed, type UpperTierIssuanceLedger } from './upperTierIssuance'

const kind = 'yewmaster_longbow' as const
const mutableDefs = ITEM_DEFS as Record<string, (typeof ITEM_DEFS)[ItemKind] | undefined>
const originalDef = mutableDefs[kind]

afterEach(() => {
  if (originalDef) mutableDefs[kind] = originalDef
  else delete mutableDefs[kind]
})

function registerTestBow(): void {
  mutableDefs[kind] = { ...ITEM_DEFS.hunting_bow, kind } as unknown as (typeof ITEM_DEFS)[ItemKind]
}

function sourceTxn(source: { eligible: boolean, coins: number }) {
  return {
    preflightSource: () => source.eligible && source.coins >= 10,
    snapshotSource: () => ({ ...source }),
    commitSource: () => {
      source.eligible = false
      source.coins -= 10
      return true
    },
    restoreSource: (snapshot: unknown) => Object.assign(source, snapshot),
  }
}

describe('upper-tier issuance ledger', () => {
  it('claims once across sources and blocks reentrant issuance before source mutation', () => {
    registerTestBow()
    const ledger: UpperTierIssuanceLedger = {}
    const destination = new Inventory()
    const source = { eligible: true, coins: 20 }
    let reentrant: ReturnType<typeof claimUpperTierInstance> = null
    const first = claimUpperTierInstance({
      ledger, kind, issuanceKey: 'merchant:one', destination,
      ...sourceTxn(source),
      commitSource: (instance) => {
        reentrant = claimUpperTierInstance({ ledger, kind, issuanceKey: 'quest:two', destination, ...sourceTxn(source) })
        expect(instance.kind).toBe(kind)
        source.eligible = false
        source.coins -= 10
        return true
      },
    })
    expect(first).not.toBeNull()
    expect(reentrant).toBeNull()
    expect(destination.countInstances(kind as ItemKind)).toBe(1)
    expect(ledger[kind]?.instanceId).toBe(first?.id)
    expect(claimUpperTierInstance({ ledger, kind, issuanceKey: 'quest:two', destination, ...sourceTxn(source) })).toBeNull()
    expect(createAcquiredInstance(kind as ItemKind)).toBeNull()
  })

  it('rolls destination and payment/source state back when source commit fails', () => {
    registerTestBow()
    const ledger: UpperTierIssuanceLedger = {}
    const destination = new Inventory()
    const source = { eligible: true, coins: 20 }
    const txn = sourceTxn(source)
    const result = claimUpperTierInstance({
      ledger, kind, issuanceKey: 'quest:one', destination,
      ...txn,
      commitSource: () => {
        source.eligible = false
        source.coins = 0
        return false
      },
    })
    expect(result).toBeNull()
    expect(destination.countInstances(kind as ItemKind)).toBe(0)
    expect(ledger[kind]).toBeUndefined()
    expect(source).toEqual({ eligible: true, coins: 20 })
  })

  it('restores source state when payment/source commit throws after a partial mutation', () => {
    registerTestBow()
    const ledger: UpperTierIssuanceLedger = {}
    const destination = new Inventory()
    const source = { eligible: true, coins: 20 }
    const txn = sourceTxn(source)
    const result = claimUpperTierInstance({
      ledger, kind, issuanceKey: 'quest:one', destination,
      ...txn,
      commitSource: () => {
        source.eligible = false
        source.coins = 0
        throw new Error('payment failed')
      },
    })
    expect(result).toBeNull()
    expect(destination.countInstances(kind as ItemKind)).toBe(0)
    expect(ledger[kind]).toBeUndefined()
    expect(source).toEqual({ eligible: true, coins: 20 })
  })

  it('does not consume a source or claim on destination capacity failure', () => {
    registerTestBow()
    const ledger: UpperTierIssuanceLedger = {}
    const destination = new Inventory({}, 0)
    const source = { eligible: true, coins: 20 }
    const txn = sourceTxn(source)
    const result = claimUpperTierInstance({ ledger, kind, issuanceKey: 'quest:one', destination, ...txn })
    expect(result).toBeNull()
    expect(source).toEqual({ eligible: true, coins: 20 })
    expect(ledger[kind]).toBeUndefined()
  })

  it('retains a permanent destruction tombstone for only the claimed instance', () => {
    const ledger: UpperTierIssuanceLedger = { [kind]: { instanceId: 'item:one', issuanceKey: 'quest:one', status: 'live' } }
    expect(markUpperTierDestroyed(ledger, kind, 'item:other')).toBe(false)
    expect(markUpperTierDestroyed(ledger, kind, 'item:one')).toBe(true)
    expect(ledger[kind]?.status).toBe('destroyed')
    expect(markUpperTierDestroyed(ledger, kind, 'item:one')).toBe(false)
  })

  it('recognizes exactly the matrix U identities and blocks all generic count grants', () => {
    expect(UPPER_TIER_IDENTITY_LIST).toHaveLength(14)
    for (const restricted of UPPER_TIER_IDENTITY_LIST) {
      expect(createAcquiredInstance(restricted as ItemKind)).toBeNull()
      expect(new Inventory().canAdd(restricted as ItemKind, 1)).toBe(false)
    }
  })

  it.each([
    ['player inventory', { inventoryInstances: [{ id: 'a', kind }] }],
    ['NPC personal inventory', { npcStates: { npc: { personalInventory: { instances: [{ id: 'a', kind }] } } } }],
    ['NPC transport cargo', { npcStates: { npc: { transportCargo: { instances: [{ id: 'a', kind }] } } } }],
    ['NPC merchant stock', { npcStates: { npc: { merchantStock: { instances: [{ id: 'a', kind }] } } } }],
    ['NPC corpse loot', { npcStates: { npc: { postDeath: { loot: { instances: [{ id: 'a', kind }] } } } } }],
    ['household items', { households: { household: { items: { instances: [{ id: 'a', kind }] } } } }],
    ['placed container', { placedContainers: [{ instances: [{ id: 'a', kind }] }] }],
    ['carried container', { carriedContainer: { instances: [{ id: 'a', kind }] } }],
    ['world generated container', { worldGeneratedContainers: [{ instances: [{ id: 'a', kind }] }] }],
    ['resource site inventory', { resourceSiteInventories: { site: { instances: [{ id: 'a', kind }] } } }],
    ['world drop payload', { droppedItems: [{ id: 'drop', kind, instance: { id: 'a', kind } }] }],
  ])('finds a restricted owner in %s', (_label, domain) => {
    const rows = upperTierOwnerRowsFromSave(domain)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.instance).toEqual({ id: 'a', kind })
  })
})

describe('upper-tier owner coverage (review 042 R3)', () => {
  const specimen = { id: 'a', kind }
  const pack = { equipment: 'saddlebags', contents: { counts: {}, instances: [specimen] } }
  it.each([
    ['settlement economy food', { settlementEconomies: { s: { stock: {}, food: { counts: {}, instances: [specimen] } } } }],
    ['livestock animal pack', { livestock: [{ id: 'cow', pack }] }],
    ['wild fauna pack', { wildFauna: { animals: [{ id: 'horse', pack }] } }],
    ['persistent habitat occupant pack', { persistentHabitatOccupants: [{ id: 'o', pack }] }],
    ['rat record pack', { rats: [{ id: 'r', pack }] }],
    ['arbitrary future nested domain', { someFutureDomain: { nested: [{ holder: { instances: [specimen] } }] } }],
  ])('finds a restricted owner in %s', (_label, domain) => {
    const rows = upperTierOwnerRowsFromSave(domain)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.instance).toEqual(specimen)
  })

  it('does not treat count-only player inventory or held references as owners', () => {
    expect(upperTierOwnerRowsFromSave({ inventory: { [kind]: 1 }, heldTool: kind, playerEquipment: { weapon: 'a' } })).toEqual([])
  })
})

describe('upper-tier sale refusal (review 042 R1)', () => {
  it('never sells a claimed specimen into the void', () => {
    registerTestBow()
    const ledger: UpperTierIssuanceLedger = {}
    const inv = new Inventory()
    const source = { eligible: true, coins: 20 }
    const instance = claimUpperTierInstance({ ledger, kind, issuanceKey: 'fixture', destination: inv, ...sourceTxn(source) })
    expect(instance).not.toBeNull()
    expect(resolveInstanceSellPrice(instance!)).toBeNull()
    expect(sellInstancesForCoins(inv, [instance!.id])).toEqual({ result: 'not_sold' })
    expect(inv.getInstance(instance!.id)).not.toBeNull()
    expect(ledger[kind]?.status).toBe('live')
  })
})
