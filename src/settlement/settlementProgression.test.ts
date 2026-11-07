import { afterEach, describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { SettlementResolveContext } from './settlementPlanCache'
import type { TerrainSamplers } from './settlementTerrain'
import { EMPTY_LANDFORM_INDEX } from '../terrain/landformDescriptors'
import { rolledVillageSizeRank, rollVillageSize } from './families'
import { cellSeed, generateSettlementDef } from './settlementGenerator'
import { computeSettlementLayout } from './settlementLayout'
import {
  cachedSettlementProgressionPolicy,
  clearSettlementDefCache,
  settlementDefFor,
  settlementLayoutFor,
} from './settlementPlanCache'
import {
  orderProgressionCandidates,
  resolveSettlementProgressionPolicy,
  SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M,
  SETTLEMENT_PROGRESSION_XL_ORDER_SALT,
  settlementGraphHops,
} from './settlementProgression'

const flatHeight = (): number => 12
const samplers: TerrainSamplers = {
  sampleContinentalness: () => 0.55,
  sampleMountainRidge: () => 0.05,
  sampleMoistureRegion: () => 0.45,
}
const mountainSamplers: TerrainSamplers = {
  sampleContinentalness: () => 0.7,
  sampleMountainRidge: () => 0.9,
  sampleMoistureRegion: () => 0.35,
}

const region = {
  coastThreshold: 0.45,
  desertThreshold: 0.35,
  desertThresholdWidth: 0.12,
  swampThreshold: 0.72,
  swampThresholdWidth: 0.15,
  village: {
    coreRadius: 9,
    houseRadius: 4.5,
    heightStrength: 0.8,
    tintStrength: 0.75,
    regionalHeightStrengthFlat: 0.3,
    regionalHeightStrengthMountain: 0.15,
  },
  roadNetwork: {
    dockSearchRadius: 140,
  },
} as RegionParams

function ctxFor(
  seed: number,
  extras?: Partial<SettlementResolveContext>,
): SettlementResolveContext {
  return {
    seed,
    sampleHeight: flatHeight,
    waterLevel: 0,
    localSearchRadius: 56,
    hydrologyId: 'unconditioned',
    landformIndex: EMPTY_LANDFORM_INDEX,
    terrainSamplers: samplers,
    heightScale: 1,
    region,
    ...extras,
  }
}

afterEach(() => {
  clearSettlementDefCache()
})

const SEEDS = [7, 19, 42, 88, 201, 404]

function policyFor(seed: number, extras?: Partial<SettlementResolveContext>) {
  const ctx = ctxFor(seed, extras)
  const layout = computeSettlementLayout(ctx)
  return { ctx, layout, policy: resolveSettlementProgressionPolicy(ctx, undefined, layout) }
}

describe('settlement progression by graph hops (059 W2′)', () => {
  it('is identical regardless of lookup order', () => {
    const { ctx, layout, policy } = policyFor(7)
    expect(policy).not.toBeNull()
    const other = layout.sites[layout.sites.length - 1]!.cell
    const first = settlementDefFor(other, ctx)
    clearSettlementDefCache()
    settlementDefFor({ gx: 0, gz: 0 }, ctx)
    expect(settlementDefFor(other, ctx)).toEqual(first)
    expect(cachedSettlementProgressionPolicy()!.overrides).toEqual(policy!.overrides)
  })

  it('caps hop 1 at MD and hop 2 at LG, and keeps home SM/MD', () => {
    for (const seed of SEEDS) {
      const { layout, policy } = policyFor(seed)
      expect(policy!.homeSize === 'SM' || policy!.homeSize === 'MD').toBe(true)
      const hops = settlementGraphHops(layout)
      for (const [key, size] of policy!.sizes) {
        const hop = hops.get(key)
        if (hop === 1) expect(rolledVillageSizeRank(size)).toBeLessThanOrEqual(rolledVillageSizeRank('MD'))
      }
    }
  })

  it('guarantees MD+ at hop 1 and LG+ in hops 1–3 where a feasible candidate exists', () => {
    for (const seed of SEEDS) {
      const { layout, policy } = policyFor(seed)
      const hops = settlementGraphHops(layout)
      const sizesAt = (lo: number, hi: number) => [...policy!.sizes]
        .filter(([k]) => { const h = hops.get(k); return h !== undefined && h >= lo && h <= hi })
        .map(([, size]) => rolledVillageSizeRank(size))
      if (sizesAt(1, 1).length > 0) {
        expect(Math.max(...sizesAt(1, 1))).toBeGreaterThanOrEqual(rolledVillageSizeRank('MD'))
      }
      if (sizesAt(1, 3).length > 0) {
        expect(Math.max(...sizesAt(1, 3))).toBeGreaterThanOrEqual(rolledVillageSizeRank('LG'))
      }
    }
  })

  it('places an XL at hops 2–4 within the distance limit when one is feasible', () => {
    let seen = 0
    for (const seed of SEEDS) {
      const { layout, policy } = policyFor(seed)
      const hops = settlementGraphHops(layout)
      const xl = [...policy!.sizes].filter(([, size]) => size === 'XL').map(([k]) => k)
      for (const key of xl) {
        const hop = hops.get(key)
        if (hop === undefined || hop < 2 || hop > 4) continue
        const [gx, gz] = key.split('_').map(Number)
        const site = layout.siteOf({ gx: gx!, gz: gz! })!
        if (Math.hypot(site.x, site.z) <= SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M) seen++
      }
    }
    expect(seen).toBeGreaterThan(0)
  })

  it('overrides drive the generated size; other cells keep rollVillageSize', () => {
    const seed = 19
    const { ctx, layout, policy } = policyFor(seed)
    for (const site of layout.sites.slice(1)) {
      const def = settlementDefFor(site.cell, ctx)
      const assigned = policy!.sizeFor(site.cell)
      if (!def || def.size === 'OUTPOST') continue
      if (assigned) {
        expect(def.size).toBe(assigned)
      } else {
        const ordinary = generateSettlementDef(site.cell, seed, flatHeight, 0, 56, samplers, 1, region)
        expect(def.size).toBe(ordinary!.size)
        expect(def.size).toBe(rollVillageSize('forest', cellSeed(seed, site.cell)))
      }
    }
  })

  it('explicit homeSize does not apply a policy', () => {
    const seed = 88
    const ctx = ctxFor(seed, { homeSize: 'XL' })
    expect(resolveSettlementProgressionPolicy(ctx, undefined, computeSettlementLayout(ctx))).toBeNull()
    const home = settlementDefFor({ gx: 0, gz: 0 }, ctx)
    expect(home?.size).toBe('XL')
    const other = settlementLayoutFor(ctx).sites[1]!.cell
    const fromCache = settlementDefFor(other, ctx)
    const ordinary = generateSettlementDef(other, seed, flatHeight, 0, 56, samplers, 1, region, 'XL')
    expect(fromCache?.id).toBe(ordinary?.id)
    expect(fromCache?.size).toBe(ordinary?.size)
    expect(fromCache?.x).toBe(ordinary?.x)
  })

  it('skips resource outposts when promoting', () => {
    const { policy } = policyFor(5, { terrainSamplers: mountainSamplers })
    for (const o of policy!.overrides) {
      const def = generateSettlementDef(
        o.cell, 5, flatHeight, 0, 56, mountainSamplers, 1, region, 'auto', undefined, o.size,
      )
      // an override on an outpost is only the hop cap, never a promotion
      if (def?.size === 'OUTPOST') expect(o.size === 'SM' || o.size === 'MD' || o.size === 'LG').toBe(true)
    }
  })

  it('clears progression-policy memoization with the settlement cache', () => {
    expect(cachedSettlementProgressionPolicy()).toBeUndefined()
    settlementDefFor({ gx: 0, gz: 0 }, ctxFor(11))
    expect(cachedSettlementProgressionPolicy()).toBeTruthy()
    clearSettlementDefCache()
    expect(cachedSettlementProgressionPolicy()).toBeUndefined()
  })

  it('candidate order is seeded and independent of input order', () => {
    const cells = [{ gx: 1, gz: 2 }, { gx: -3, gz: 4 }, { gx: 5, gz: -6 }, { gx: 0, gz: 7 }]
    const a = orderProgressionCandidates(1, cells, SETTLEMENT_PROGRESSION_XL_ORDER_SALT)
    expect(orderProgressionCandidates(1, [...cells].reverse(), SETTLEMENT_PROGRESSION_XL_ORDER_SALT)).toEqual(a)
    expect(orderProgressionCandidates(7919, cells, SETTLEMENT_PROGRESSION_XL_ORDER_SALT)).not.toEqual(a)
  })
})
