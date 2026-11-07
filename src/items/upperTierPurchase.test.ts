import { describe, expect, it } from 'vitest'
import { Inventory } from './Inventory'
import { ITEM_DEFS, type ItemKind } from './items'
import { settleMerchantStockTransaction } from './trade'
import { merchantInstancePrice } from './tradeCatalog'
import { UPPER_TIER_IDENTITY_LIST } from './upperTierIdentities'
import { claimUpperTierInstance, type UpperTierIssuanceLedger } from './upperTierIssuance'

const REGISTERED = UPPER_TIER_IDENTITY_LIST.filter((kind) => kind in ITEM_DEFS)

function stockWith(kind: (typeof REGISTERED)[number], ledger: UpperTierIssuanceLedger): { stock: Inventory, id: string } {
  const stock = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
  const specimen = claimUpperTierInstance({
    ledger, kind, issuanceKey: `merchant:test:npc:${kind}`, destination: stock,
    preflightSource: () => true, snapshotSource: () => null, commitSource: () => true, restoreSource: () => {},
  })
  return { stock, id: specimen!.id }
}

describe('upper-tier exact-instance purchase (064 U4)', () => {
  it.each(REGISTERED)('buying %s moves the same instance id to the player and keeps one ledger claim', (kind) => {
    const ledger: UpperTierIssuanceLedger = {}
    const { stock, id } = stockWith(kind, ledger)
    const price = merchantInstancePrice(stock.getInstance(id)!)
    expect(price).not.toBeNull()
    const player = new Inventory({ coin: 5000 })
    expect(settleMerchantStockTransaction(player, stock, {}, {}, undefined, [id])).toBe('ok')
    expect(player.getInstance(id)?.kind).toBe(kind)
    expect(stock.getInstance(id)).toBeNull()
    expect(ledger[kind]).toMatchObject({ instanceId: id, status: 'live' })
    expect(player.count('coin')).toBeLessThan(5000)
  })

  it('refuses count purchases, barter-offering a specimen, and selling it back', () => {
    const ledger: UpperTierIssuanceLedger = {}
    const kind = REGISTERED[0]!
    const { stock, id } = stockWith(kind, ledger)
    const player = new Inventory({ coin: 5000 })
    expect(settleMerchantStockTransaction(player, stock, { [kind]: 1 }, {})).toBe('not_sold')
    expect(stock.getInstance(id)).not.toBeNull()
    expect(settleMerchantStockTransaction(player, stock, {}, {}, undefined, [id])).toBe('ok')
    // The player now holds the specimen; offering it to a (different) merchant must not consume it.
    const other = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
    const result = settleMerchantStockTransaction(player, other, {}, { [kind]: 1 })
    expect(result).not.toBe('ok')
    expect(player.getInstance(id)).not.toBeNull()
    expect(other.countInstances(kind as ItemKind)).toBe(0)
  })
})
