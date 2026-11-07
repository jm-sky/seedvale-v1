import { afterEach, describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { TerrainSamplers } from './settlementTerrain'
import { EMPTY_LANDFORM_INDEX } from '../terrain/landformDescriptors'
import { cellsWithinRadius, probeSettlementSite } from './settlementGenerator'
import { clearSettlementDefCache, settlementDefFor, settlementLayoutFor, type SettlementResolveContext } from './settlementPlanCache'
import { roadEntranceAngles } from './villagePlanner'

const deg = (d: number): number => (d * Math.PI) / 180
const diff = (a: number, b: number): number => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)))

describe('roadEntranceAngles (Q59)', () => {
  it('equals the layout-pattern angles without neighbours', () => {
    const angles = roadEntranceAngles('clustered', 7, 2, 0, [])
    expect(angles).toHaveLength(2)
  })

  it('opens an entrance toward each neighbour bearing, nearest first', () => {
    const angles = roadEntranceAngles('clustered', 7, 2, 0, [deg(10), deg(200)])
    expect(angles[0]).toBeCloseTo(deg(10))
    expect(angles[1]).toBeCloseTo(deg(200))
  })

  it('merges bearings closer than ~40° into one entrance', () => {
    const angles = roadEntranceAngles('clustered', 7, 3, 0, [deg(10), deg(30), deg(50)])
    expect(angles.slice(0, 1)).toEqual([deg(10)])
    expect(angles.filter((a) => diff(a, deg(30)) < deg(1))).toHaveLength(0)
  })

  it('opens one entrance per distinct neighbour direction, at most 4', () => {
    const four = [deg(0), deg(90), deg(180), deg(270)]
    expect(roadEntranceAngles('clustered', 7, 1, 0, four)).toEqual(four)
    expect(roadEntranceAngles('clustered', 7, 2, 0, [...four, deg(45), deg(135)])).toHaveLength(4)
  })

  it('fills spare slots with layout angles that do not duplicate a neighbour direction', () => {
    const angles = roadEntranceAngles('clustered', 7, 2, 0, [deg(10)])
    expect(angles[0]).toBeCloseTo(deg(10))
    for (const [i, a] of angles.entries()) {
      for (const b of angles.slice(i + 1)) expect(diff(a, b)).toBeGreaterThanOrEqual(deg(39))
    }
  })
})

describe('neighbour-facing entrances in generated defs', () => {
  const samplers: TerrainSamplers = {
    sampleContinentalness: () => 0.55,
    sampleMountainRidge: () => 0.05,
    sampleMoistureRegion: () => 0.45,
  }
  const region = {
    coastThreshold: 0.45,
    desertThreshold: 0.35,
    desertThresholdWidth: 0.12,
    swampThreshold: 0.72,
    swampThresholdWidth: 0.15,
    village: { coreRadius: 9, houseRadius: 4.5, heightStrength: 0.8, tintStrength: 0.75, regionalHeightStrengthFlat: 0.3, regionalHeightStrengthMountain: 0.15 },
    roadNetwork: { dockSearchRadius: 140, maxNeighborRoads: 3 },
  } as RegionParams
  const ctx: SettlementResolveContext = {
    seed: 42, sampleHeight: () => 12, waterLevel: 0, localSearchRadius: 56, terrainSamplers: samplers, heightScale: 1, region,
    hydrologyId: 'unconditioned',
    landformIndex: EMPTY_LANDFORM_INDEX,
  }
  afterEach(() => clearSettlementDefCache())

  it('probe site equals the final def site (probe-based neighbour bearings are exact)', () => {
    // Sample the lattice ring plus every selected site: unselected cells resolve to no def and no site.
    const cells = [...cellsWithinRadius({ gx: 0, gz: 0 }, 1), ...settlementLayoutFor(ctx).sites.map((site) => site.cell)]
    for (const cell of cells) {
      if (!settlementLayoutFor(ctx).has(cell)) continue
      const probe = probeSettlementSite(cell, ctx.seed, ctx.sampleHeight, ctx.waterLevel, ctx.localSearchRadius, ctx.terrainSamplers, ctx.heightScale, ctx.region)
      const def = settlementDefFor(cell, ctx)
      expect(def === null).toBe(probe.site === null)
      if (def && probe.site) {
        expect(def.x).toBe(probe.site.x)
        expect(def.z).toBe(probe.site.z)
      }
    }
  })

  it('every layout-graph neighbour of home has an entrance within 90° of its bearing', () => {
    const home = settlementDefFor({ gx: 0, gz: 0 }, ctx)!
    const nearest = settlementLayoutFor(ctx).neighborsOf({ gx: 0, gz: 0 })
      .map((n) => settlementDefFor(n.cell, ctx))
      .filter((d) => d !== null)
      .sort((a, b) => Math.hypot(a.x - home.x, a.z - home.z) - Math.hypot(b.x - home.x, b.z - home.z))[0]!
    const bearing = Math.atan2(nearest.z - home.z, nearest.x - home.x)
    expect(home.plan.entrances.some((e) => diff(e.angle, bearing) < Math.PI / 2)).toBe(true)
  })
})
