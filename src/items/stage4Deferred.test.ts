import { describe, expect, it } from 'vitest'
import { ITEM_CATALOG } from './itemCatalog'
import { ITEM_DEFS } from './items'
import { MERCHANT_PRICES, MERCHANT_STOCK } from './tradeCatalog'
import { UPPER_TIER_IDENTITY_LIST } from './upperTierIdentities'
import { findV3EquipmentDefinition, V3_EQUIPMENT_DEFINITIONS } from './v3Equipment/catalogue'

const deferred = ['falchion', 'composite_bow', 'arrow_blunt'] as const

describe('062 W5 deferred records stay unregistered', () => {
  it('have no V1 item, catalog row, price, stock, ammo admission or issuance identity', () => {
    for (const id of deferred) {
      expect(Object.keys(ITEM_DEFS)).not.toContain(id)
      expect(Object.keys(ITEM_CATALOG)).not.toContain(id)
      expect(Object.keys(MERCHANT_PRICES)).not.toContain(id)
      expect((MERCHANT_STOCK as readonly string[])).not.toContain(id)
      expect((UPPER_TIER_IDENTITY_LIST as readonly string[])).not.toContain(id)
      for (const entry of Object.values(ITEM_CATALOG)) {
        expect((entry.ranged?.ammoKinds ?? []) as readonly string[]).not.toContain(id)
      }
    }
  })

  it('remain immutable donor records and the 12 future flags are unchanged', () => {
    for (const id of deferred) expect(findV3EquipmentDefinition(id)).toBeDefined()
    expect(V3_EQUIPMENT_DEFINITIONS.filter(row => row.availability === 'future')).toHaveLength(12)
  })
})
