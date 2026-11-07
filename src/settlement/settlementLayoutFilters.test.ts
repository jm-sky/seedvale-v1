import { afterEach, describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { LandformDescriptor } from '../terrain/landformDescriptors'
import type { WorldHydrology } from '../terrain/worldHydrology'
import type { TerrainSamplers } from './settlementTerrain'
import { buildLandformIndex, EMPTY_LANDFORM_INDEX } from '../terrain/landformDescriptors'
import { clearWorldHydrology, installWorldHydrology } from '../terrain/worldHydrologyStore'
import { computeSettlementLayout, setSettlementLayoutOverrides, type SettlementLayoutInput } from './settlementLayout'

const region = {
  coastThreshold: 0.45,
  desertThreshold: 0.35,
  desertThresholdWidth: 0.12,
  swampThreshold: 0.72,
  swampThresholdWidth: 0.15,
  village: { coreRadius: 9, houseRadius: 4.5, heightStrength: 0.8, tintStrength: 0.75, regionalHeightStrengthFlat: 0.3, regionalHeightStrengthMountain: 0.15 },
  roadNetwork: { dockSearchRadius: 140, maxNeighborRoads: 3 },
} as RegionParams

const samplers: TerrainSamplers = {
  sampleContinentalness: () => 0.55,
  sampleMountainRidge: () => 0.05,
  sampleMoistureRegion: () => 0.45,
}

/** Mainland disc (r = 2400 m) and a 250 m island disc 900 m east of it, separated by water. */
const ISLAND = { x: 3300, z: 0, r: 250 }
function islandWorldHeight(x: number, z: number): number {
  if (Math.hypot(x, z) < 2400) return 12
  if (Math.hypot(x - ISLAND.x, z - ISLAND.z) < ISLAND.r) return 12
  return 0
}

function input(extra: Partial<SettlementLayoutInput> = {}): SettlementLayoutInput {
  return {
    seed: 42,
    sampleHeight: islandWorldHeight,
    waterLevel: 0,
    localSearchRadius: 56,
    terrainSamplers: samplers,
    heightScale: 1,
    region,
    hydrologyId: 'unconditioned',
    landformIndex: EMPTY_LANDFORM_INDEX,
    ...extra,
  }
}

afterEach(() => setSettlementLayoutOverrides(null))

describe('settlement layout feasibility filters (plan world-terrain-063 V1)', () => {
  it('never selects a site on an island too small to be mainland', () => {
    const layout = computeSettlementLayout(input())
    expect(layout.sites.length).toBeGreaterThan(5)
    for (const s of layout.sites) expect(Math.hypot(s.x - ISLAND.x, s.z - ISLAND.z)).toBeGreaterThan(ISLAND.r)
  })

  it('does select the island when the mainland filter has nothing to reject (control)', () => {
    // A world whose "island" is part of the mainland: same disc, no separating water.
    const joined = computeSettlementLayout(input({ sampleHeight: (x, z) => (Math.hypot(x, z) < 3600 ? 12 : 0) }))
    expect(joined.sites.some((s) => Math.hypot(s.x - ISLAND.x, s.z - ISLAND.z) < ISLAND.r + 150)).toBe(true)
  })

  it('rejects sites inside a landform footprint', () => {
    const base = computeSettlementLayout(input())
    const victim = base.sites[3]!
    const crag: LandformDescriptor = { id: 'lf:crag:test', kind: 'crag', centreX: victim.x, centreZ: victim.z, radius: 120, params: {}, intendedOutcome: 'test' }
    const layout = computeSettlementLayout(input({ landformIndex: buildLandformIndex([crag]) }))
    expect(layout.sites.some((s) => Math.hypot(s.x - victim.x, s.z - victim.z) < crag.radius)).toBe(false)
    expect(layout.sites.length).toBeGreaterThan(5)
  })

  it('rejects sites whose promoted footprint touches a waterfall reserve', () => {
    const base = computeSettlementLayout(input())
    const victim = base.sites[3]!
    // A 20 m cascade (slope 0.5 over 40 m) 50 m beside the site: inside the promoted XL footprint rectangle.
    const pts: number[] = []
    for (let i = 0; i <= 20; i++) pts.push(victim.x - 20 + i * 2, victim.z + 50, 100 - i, 100)
    const id = 'layout-filter-test'
    installWorldHydrology(id, {
      chains: { offsets: Uint32Array.from([0, 21]), points: Float32Array.from(pts), flags: new Uint8Array(1) },
    } as unknown as WorldHydrology)
    try {
      const layout = computeSettlementLayout(input({ hydrologyId: id }))
      expect(layout.sites.some((s) => Math.hypot(s.x - victim.x, s.z - victim.z) < 1)).toBe(false)
      expect(layout.sites.length).toBeGreaterThan(5)
    } finally {
      clearWorldHydrology(id)
    }
  })

  it('suitability `none` reproduces the unweighted selection', () => {
    const none = computeSettlementLayout(input())
    setSettlementLayoutOverrides({ suitability: 'none' })
    expect(computeSettlementLayout(input()).sites.map((s) => s.cell)).toEqual(none.sites.map((s) => s.cell))
  })

  it('a suitability weight steers selection away from desert, weakly or strongly', () => {
    const desertEast: TerrainSamplers = {
      ...samplers,
      sampleBiomeWeights: (x) => (x > 0 ? { desert: 1, swamp: 0, forest: 0 } : { desert: 0, swamp: 0, forest: 1 }),
    }
    const eastCount = (w?: 'moderate' | 'strong'): number => {
      setSettlementLayoutOverrides(w ? { suitability: w, target: 12 } : { target: 12 })
      return computeSettlementLayout(input({ terrainSamplers: desertEast })).sites.filter((s) => s.x > 0).length
    }
    const none = eastCount()
    const strong = eastCount('strong')
    expect(strong).toBeLessThanOrEqual(none)
    expect(strong).toBeLessThan(none)
  })

  it('throws instead of ranking without climate when a weight needs the biome sampler', () => {
    setSettlementLayoutOverrides({ suitability: 'strong' })
    const withMask = { ...region, continentMask: {} } as unknown as RegionParams
    expect(() => computeSettlementLayout(input({ region: withMask }))).toThrow(/sampleBiomeWeights/)
  })
})
