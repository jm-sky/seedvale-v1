import { describe, expect, it } from 'vitest'
import { npcMeleeWeaponFamily } from '../ai/npcCombat'
import { isMeleeTool } from '../fauna/faunaCombat'
import { createHeldTool } from './HeldTool'
import { createHeldToolObject, HELD_ATTACH } from './heldToolVisual'
import { Inventory } from './Inventory'
import { ITEM_CATALOG } from './itemCatalog'
import { isWeaponMaintenanceKind } from './itemInstances'
import { createItemMesh, ITEM_DEFS } from './items'
import { createAcquiredInstance } from './trade'
import { tradeValue } from './tradeCatalog'
import { UPPER_TIER_IDENTITY_LIST } from './upperTierIdentities'
import { claimUpperTierInstance, type UpperTierIssuanceLedger } from './upperTierIssuance'

const expected = {
  pinewatch_longsword: { family: 'sword', price: 600, weight: 1.7, damage: 42, type: 'cut' },
  kestrel_dagger: { family: 'compact', price: 900, weight: .35, damage: 29, type: 'pierce' },
  harrow_shortsword: { family: 'sword', price: 1100, weight: 1.15, damage: 43, type: 'cut' },
  ironvale_sword: { family: 'sword', price: 1300, weight: 1.4, damage: 49, type: 'cut' },
  greywatch_longsword: { family: 'sword', price: 1500, weight: 1.7, damage: 55, type: 'cut' },
} as const
const kinds = Object.keys(expected) as (keyof typeof expected)[]

describe('062 W2d upper-tier melee profiles (no source)', () => {
  it('registers exactly the five A8 melee identities with authored profiles and no spawn', () => {
    for (const kind of kinds) {
      const row = expected[kind]
      expect(UPPER_TIER_IDENTITY_LIST).toContain(kind)
      expect(ITEM_CATALOG[kind].spawn).toBe('none')
      expect(ITEM_CATALOG[kind].holdable).toBe(true)
      expect(ITEM_CATALOG[kind].melee).toMatchObject({ damage: row.damage, damageType: row.type })
      expect(ITEM_DEFS[kind].weight).toBe(row.weight)
      expect(npcMeleeWeaponFamily(kind)).toBe(row.family)
      expect(tradeValue(kind)).toBe(row.price)
      expect(isMeleeTool(kind)).toBe(true)
      expect(isWeaponMaintenanceKind(kind)).toBe(true)
      expect(HELD_ATTACH[kind]).toBeDefined()
    }
  })

  it('keeps tier ordering by overall envelope: Legendary above Exceptional above every Masterwork', () => {
    expect(ITEM_CATALOG.pinewatch_longsword.melee!.damage).toBeGreaterThan(ITEM_CATALOG.stonebridge_longsword.melee!.damage)
    expect(ITEM_CATALOG.greywatch_longsword.melee!.damage).toBeGreaterThan(ITEM_CATALOG.pinewatch_longsword.melee!.damage)
    expect(ITEM_CATALOG.kestrel_dagger.melee!.damage).toBeGreaterThan(ITEM_CATALOG.ashgrove_dagger.melee!.damage)
    expect(ITEM_CATALOG.harrow_shortsword.melee!.damage).toBeGreaterThan(ITEM_CATALOG.millbrook_shortsword.melee!.damage)
    expect(ITEM_CATALOG.ironvale_sword.melee!.damage).toBeGreaterThan(ITEM_CATALOG.fenmoor_sword.melee!.damage)
  })

  it('refuses generic acquisition and count grants; only the ledger claim yields a condition instance', () => {
    for (const kind of kinds) {
      expect(createAcquiredInstance(kind)).toBeNull()
      expect(new Inventory().canAdd(kind, 1)).toBe(false)
      const ledger: UpperTierIssuanceLedger = {}
      const destination = new Inventory()
      const instance = claimUpperTierInstance({
        ledger, kind, issuanceKey: `test:${kind}`, destination,
        preflightSource: () => true, snapshotSource: () => null, commitSource: () => true, restoreSource: () => undefined,
      })
      expect(instance).toMatchObject({ kind, durability: 1, sharpness: 1 })
      expect(ledger[kind]?.status).toBe('live')
      const held = createHeldTool(destination)
      expect(held.equip(kind, instance!.id)).toBe(true)
      expect(held.heldInstanceId()).toBe(instance!.id)
    }
  })

  it('builds procedural ground and held geometry', async () => {
    for (const kind of kinds) {
      expect(createItemMesh(kind).children.length).toBeGreaterThan(0)
      expect(await createHeldToolObject(kind)).toBeTruthy()
    }
  })
})
