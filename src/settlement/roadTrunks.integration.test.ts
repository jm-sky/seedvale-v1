import { afterAll, describe, expect, it } from 'vitest'
import { censusHydrologyId } from '../../scripts/perf/censusHydrology'
import { defaultTerrainConfig } from '../config/worldConfig'
import { createRiverQuery } from '../terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../terrain/worldKnowledgeScan'
import { clearRoadNetworkCaches, type RoadNetworkContext, type RoadRoute, roadRoutesForSettlement } from './roadNetwork'
import { cellsWithinRadius, type SettlementDef } from './settlementGenerator'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementDefFor } from './settlementPlanCache'

const SEED = 42
const RINGS = 3

function setup(): { ctx: RoadNetworkContext, defs: SettlementDef[] } {
  clearSettlementDefCache()
  clearRoadNetworkCaches()
  const t = defaultTerrainConfig(65)
  const snap: WorldKnowledgeTerrainSnapshot = {
    chunkSize: t.chunkSize, resolution: t.resolution, seed: SEED, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: 56, hydrologyId: censusHydrologyId(SEED),
  }
  setSettlementRiverQuery(createRiverQuery({
    seed: SEED, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const defs: SettlementDef[] = []
  for (const cell of cellsWithinRadius({ gx: 0, gz: 0 }, RINGS)) {
    const def = settlementDefFor(cell, ctx)
    if (def) defs.push(def)
  }
  return { ctx, defs }
}

function resolveAll(defs: readonly SettlementDef[], ctx: RoadNetworkContext): Map<string, RoadRoute> {
  const out = new Map<string, RoadRoute>()
  for (const def of defs) {
    for (const route of roadRoutesForSettlement(def, ctx)) {
      if (route.kind !== 'road') continue
      const first = route.points[0]!
      const last = route.points[route.points.length - 1]!
      const key = [`${first.x.toFixed(1)},${first.z.toFixed(1)}`, `${last.x.toFixed(1)},${last.z.toFixed(1)}`].sort().join('|')
      const prev = out.get(key)
      // the same pair resolved from either endpoint must give the same road
      if (prev) expect(route.points).toEqual(prev.points)
      else out.set(key, route)
    }
  }
  return out
}

describe('shared trunks (Q194) through roadRoutesForSettlement', () => {
  afterAll(() => clearRoadNetworkCaches())

  it('gives identical final routes when settlements resolve in reversed order', () => {
    const a = setup()
    const forward = resolveAll(a.defs, a.ctx)
    const b = setup()
    const reversed = resolveAll([...b.defs].reverse(), b.ctx)
    expect(forward.size).toBeGreaterThan(3)
    expect([...reversed.keys()].sort()).toEqual([...forward.keys()].sort())
    for (const [key, route] of forward) {
      const other = reversed.get(key)!
      expect(other.points).toEqual(route.points)
      expect(other.crossings.map((c) => c.id)).toEqual(route.crossings.map((c) => c.id))
    }
  }, 120_000)
})
