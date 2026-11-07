import { afterEach, describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { SettlementResolveContext } from './settlementPlanCache'
import type { TerrainSamplers } from './settlementTerrain'
import { Inventory } from '../items/Inventory'
import { ITEM_DEFS, type ItemKind } from '../items/items'
import { diagnoseUpperTierOwnerRows, UPPER_TIER_IDENTITY_LIST, type UpperTierIdentity } from '../items/upperTierIdentities'
import { type UpperTierIssuanceLedger } from '../items/upperTierIssuance'
import { upperTierOwnerRowsFromSave } from '../persistence/saveData'
import { EMPTY_LANDFORM_INDEX } from '../terrain/landformDescriptors'
import { createNpcStateRegistry } from './npcState'
import { clearSettlementDefCache, settlementDefFor, settlementLayoutFor } from './settlementPlanCache'
import { createUpperTierHostResolver, issueHostedUpperTierStock, type UpperTierHostResolver } from './upperTierHosts'

const samplers: TerrainSamplers = {
  sampleContinentalness: () => 0.55,
  sampleMountainRidge: () => 0.05,
  sampleMoistureRegion: () => 0.45,
}
const region = {
  coastThreshold: 0.45, desertThreshold: 0.35, desertThresholdWidth: 0.12, swampThreshold: 0.72, swampThresholdWidth: 0.15,
  village: { coreRadius: 9, houseRadius: 4.5, heightStrength: 0.8, tintStrength: 0.75, regionalHeightStrengthFlat: 0.3, regionalHeightStrengthMountain: 0.15 },
  roadNetwork: { dockSearchRadius: 140 },
} as RegionParams

function ctxFor(seed: number): SettlementResolveContext {
  return {
    seed, sampleHeight: () => 12, waterLevel: 0, localSearchRadius: 56, hydrologyId: 'unconditioned',
    landformIndex: EMPTY_LANDFORM_INDEX, terrainSamplers: samplers, heightScale: 1, region,
  }
}

function resolverFor(seed: number): UpperTierHostResolver {
  const ctx = ctxFor(seed)
  return createUpperTierHostResolver({
    seed,
    cells: () => settlementLayoutFor(ctx).sites.map((site) => site.cell),
    defFor: (cell) => settlementDefFor(cell, ctx),
  })
}

const SEEDS = [7, 42, 415424794]
const REGISTERED = UPPER_TIER_IDENTITY_LIST.filter((kind) => kind in ITEM_DEFS)
const UNREGISTERED = UPPER_TIER_IDENTITY_LIST.filter((kind) => !(kind in ITEM_DEFS))

afterEach(() => clearSettlementDefCache())

function hostTable(resolver: UpperTierHostResolver): Record<string, string> {
  return Object.fromEntries(UPPER_TIER_IDENTITY_LIST.map((kind) => [kind, resolver.hostFor(kind)?.issuanceKey ?? 'none']))
}

describe('upper-tier host designation (064 U1)', () => {
  it.each(SEEDS)('designates exactly one host per identity, spread, never home — seed %i', (seed) => {
    const resolver = resolverFor(seed)
    const table = hostTable(resolver)
    for (const kind of UPPER_TIER_IDENTITY_LIST) {
      const host = resolver.hostFor(kind)
      expect(host, kind).not.toBeNull()
      expect(host!.issuanceKey).toBe(`merchant:${host!.settlementId}:${host!.npcId}:${kind}`)
      expect(host!.settlementId).not.toBe('0_0')
    }
    const load = new Map<string, number>()
    for (const kind of UPPER_TIER_IDENTITY_LIST) load.set(resolver.hostFor(kind)!.npcId, (load.get(resolver.hostFor(kind)!.npcId) ?? 0) + 1)
    expect(Math.max(...load.values())).toBeLessThanOrEqual(4)
    for (const [npcId, count] of load) expect(resolver.hostedKindsFor(npcId)).toHaveLength(count)
    expect(Object.keys(table)).toHaveLength(14)
  })

  it.each(SEEDS)('is independent of resolution order and repeat runs — seed %i', (seed) => {
    const first = hostTable(resolverFor(seed))
    clearSettlementDefCache()
    const ctx = ctxFor(seed)
    // Pre-resolve defs in reverse layout order (an arbitrary "exploration order").
    for (const site of [...settlementLayoutFor(ctx).sites].reverse()) settlementDefFor(site.cell, ctx)
    expect(hostTable(resolverFor(seed))).toEqual(first)
    clearSettlementDefCache()
    expect(hostTable(resolverFor(seed))).toEqual(first)
  })

  it('differs between seeds', () => {
    expect(hostTable(resolverFor(7))).not.toEqual(hostTable(resolverFor(42)))
  })

  it('designates the armor identities too, so registering them later issues them', () => {
    expect(UNREGISTERED.length + REGISTERED.length).toBe(14)
    for (const kind of UNREGISTERED) expect(resolverFor(7).hostFor(kind)).not.toBeNull()
  })
})

function issueAll(resolver: UpperTierHostResolver, ledger: UpperTierIssuanceLedger, stocks: Map<string, Inventory>, order: readonly string[]): void {
  for (const npcId of order) {
    if (!stocks.has(npcId)) stocks.set(npcId, new Inventory(undefined, Infinity, undefined, undefined, Infinity))
    issueHostedUpperTierStock({ ledger, hosts: resolver, npcId, stock: stocks.get(npcId)!, alive: true })
  }
}

function hostNpcIds(resolver: UpperTierHostResolver): string[] {
  return [...new Set(UPPER_TIER_IDENTITY_LIST.map((kind) => resolver.hostFor(kind)!.npcId))].sort()
}

function totalSpecimens(stocks: Map<string, Inventory>, kind: UpperTierIdentity): number {
  return [...stocks.values()].reduce((sum, stock) => sum + stock.countInstances(kind as ItemKind), 0)
}

describe('upper-tier merchant issuance (064 U3, all seeds)', () => {
  it.each(SEEDS)('issues every registered identity exactly once, dormant for unregistered — seed %i', (seed) => {
    const resolver = resolverFor(seed)
    const ledger: UpperTierIssuanceLedger = {}
    const stocks = new Map<string, Inventory>()
    const order = hostNpcIds(resolver)
    issueAll(resolver, ledger, stocks, order)
    for (const kind of REGISTERED) {
      expect(ledger[kind], kind).toMatchObject({ status: 'live', issuanceKey: resolver.hostFor(kind)!.issuanceKey })
      expect(totalSpecimens(stocks, kind)).toBe(1)
      const holder = [...stocks.entries()].find(([, stock]) => stock.countInstances(kind as ItemKind) === 1)!
      expect(holder[0]).toBe(resolver.hostFor(kind)!.npcId)
      expect(holder[1].getInstance(ledger[kind]!.instanceId)?.kind).toBe(kind)
    }
    for (const kind of UNREGISTERED) expect(ledger[kind]).toBeUndefined()
    expect(Object.keys(ledger).sort()).toEqual([...REGISTERED].sort())
    // Reconstruction / reload / materialization again: no second specimen, same IDs.
    const before = JSON.stringify(ledger)
    issueAll(resolver, ledger, stocks, [...order].reverse())
    expect(JSON.stringify(ledger)).toBe(before)
    for (const kind of REGISTERED) expect(totalSpecimens(stocks, kind)).toBe(1)
  })

  it('same ledger keys regardless of materialization order, and a non-host trader issues nothing', () => {
    const resolver = resolverFor(42)
    const keys = (order: readonly string[]): Record<string, string> => {
      const ledger: UpperTierIssuanceLedger = {}
      issueAll(resolver, ledger, new Map(), order)
      return Object.fromEntries(Object.entries(ledger).map(([kind, claim]) => [kind, claim.issuanceKey]))
    }
    const order = hostNpcIds(resolver)
    expect(keys(order)).toEqual(keys([...order].reverse()))
    const ledger: UpperTierIssuanceLedger = {}
    const stock = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
    issueHostedUpperTierStock({ ledger, hosts: resolver, npcId: 'nowhere:npc:0', stock, alive: true })
    expect(ledger).toEqual({})
  })

  it('a dead host issues nothing and leaves the ledger empty', () => {
    const resolver = resolverFor(7)
    const npcId = resolver.hostFor(REGISTERED[0]!)!.npcId
    const ledger: UpperTierIssuanceLedger = {}
    const stock = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
    expect(issueHostedUpperTierStock({ ledger, hosts: resolver, npcId, stock, alive: false })).toEqual([])
    expect(ledger).toEqual({})
  })

  it('sold-out, destroyed and orphaned claims are never reissued (Q-U1)', () => {
    const resolver = resolverFor(7)
    const kind = REGISTERED[0]!
    const npcId = resolver.hostFor(kind)!.npcId
    const ledger: UpperTierIssuanceLedger = {}
    const stock = new Inventory(undefined, Infinity, undefined, undefined, Infinity)
    issueHostedUpperTierStock({ ledger, hosts: resolver, npcId, stock, alive: true })
    const id = ledger[kind]!.instanceId
    stock.removeInstance(id) // sold to the player
    ledger[kind] = { ...ledger[kind]!, status: 'destroyed' }
    issueHostedUpperTierStock({ ledger, hosts: resolver, npcId, stock, alive: true })
    expect(stock.countInstances(kind as ItemKind)).toBe(0)
    expect(ledger[kind]!.instanceId).toBe(id)
  })

  it('survives a save round trip through the NPC state registry with exactly one owner per specimen', () => {
    const resolver = resolverFor(415424794)
    const ledger: UpperTierIssuanceLedger = {}
    const registry = createNpcStateRegistry()
    for (const npcId of hostNpcIds(resolver)) {
      const state = registry.getOrCreate(npcId, 0)
      issueHostedUpperTierStock({ ledger, hosts: resolver, npcId, stock: state.merchantStock, alive: true })
    }
    const save = { npcStates: registry.serialize(), upperTierIssuanceLedger: structuredClone(ledger) }
    expect(upperTierOwnerRowsFromSave(save).filter((row) => REGISTERED.includes(row.instance.kind as UpperTierIdentity))).toHaveLength(REGISTERED.length)
    expect(diagnoseUpperTierOwnerRows(save.upperTierIssuanceLedger, upperTierOwnerRowsFromSave(save))).toBeNull()
    // Reload: hydrate a fresh registry from the snapshot and materialize again — nothing new issued.
    const reloaded = createNpcStateRegistry(save.npcStates)
    const reloadedLedger = structuredClone(save.upperTierIssuanceLedger)
    for (const npcId of hostNpcIds(resolver)) {
      const state = reloaded.getOrCreate(npcId, 0)
      issueHostedUpperTierStock({ ledger: reloadedLedger, hosts: resolver, npcId, stock: state.merchantStock, alive: true })
    }
    expect(reloadedLedger).toEqual(save.upperTierIssuanceLedger)
    const after = { npcStates: reloaded.serialize(), upperTierIssuanceLedger: reloadedLedger }
    expect(diagnoseUpperTierOwnerRows(after.upperTierIssuanceLedger, upperTierOwnerRowsFromSave(after))).toBeNull()
  })
})
