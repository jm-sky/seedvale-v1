// Usage: pnpm worldgen:caves:census [--seeds=42,415424794]
// Queue Q91: diagnostic census of large-cave siting against the world's real settlement layout (no runtime,
// no Three.js scene). Reports site count with home-only exclusion vs. real footprints, and how many mouths
// sit inside any real settlement footprint (must be 0 with footprints). Uses the conservative XL radius for
// non-home sites (progression sizes are <= XL). Diagnostic only; roads are not queried.
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { villageSizeConfig } from '../../src/settlement/families'
import { clearSettlementDefCache, setSettlementRiverQuery, settlementLayoutFor } from '../../src/settlement/settlementPlanCache'
import { createRiverQuery } from '../../src/terrain/riverQuery'
import { worldKnowledgeRoadContext, type WorldKnowledgeTerrainSnapshot } from '../../src/terrain/worldKnowledgeScan'
import { pickLargeCaveSites, type VillageFootprint } from '../../src/world/largeCaves'
import { censusHydrologyId } from './censusHydrology'

const HOME_RADIUS = 56
const seeds = (process.argv.find((a) => a.startsWith('--seeds='))?.slice(8) ?? '42,415424794').split(',').map(Number)

for (const seed of seeds) {
  clearSettlementDefCache()
  const t = defaultTerrainConfig(65)
  const snap: WorldKnowledgeTerrainSnapshot = {
    chunkSize: t.chunkSize, resolution: t.resolution, seed, heightScale: t.heightScale, waterLevel: t.waterLevel,
    noiseScale: t.noiseScale, detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale,
    hillsAmplitude: t.hillsAmplitude, hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region,
    vegetationSpeciesCount: {} as WorldKnowledgeTerrainSnapshot['vegetationSpeciesCount'],
    homeChunks: [], localSearchRadius: HOME_RADIUS, hydrologyId: censusHydrologyId(seed),
  }
  setSettlementRiverQuery(createRiverQuery({
    seed, heightScale: snap.heightScale, waterLevel: snap.waterLevel, noiseScale: snap.noiseScale,
    detailAmplitude: snap.detailAmplitude, hillsScale: snap.hillsScale, hillsAmplitude: snap.hillsAmplitude,
    hillsFbm: snap.hillsFbm, fbm: snap.fbm, biome: snap.biome, region: snap.region, hydrologyId: snap.hydrologyId,
  }))
  const ctx = worldKnowledgeRoadContext(snap)
  const sites = settlementLayoutFor(ctx).sites
  const xl = villageSizeConfig('XL').footprintRadius
  const home = Math.max(HOME_RADIUS, villageSizeConfig('MD').footprintRadius)
  const real: VillageFootprint[] = sites.map((s) => ({
    x: s.x, z: s.z, radius: s.cell.gx === 0 && s.cell.gz === 0 ? home : xl,
  }))
  const base = {
    seed,
    sampleHeight: ctx.sampleHeight,
    sampleContinentalness: ctx.terrainSamplers!.sampleContinentalness,
    sampleMountainRidge: ctx.terrainSamplers!.sampleMountainRidge,
    waterLevel: ctx.waterLevel,
    coastThreshold: snap.region.coastThreshold,
    roadsNear: () => [],
  }
  const homeOnly = pickLargeCaveSites({ ...base, villages: [{ x: 0, z: 0, radius: home }] })
  const withReal = pickLargeCaveSites({ ...base, villages: real })
  const inside = (list: typeof withReal) => list.filter((c) => real.some((v) => Math.hypot(c.x - v.x, c.z - v.z) < v.radius)).length
  console.log(`seed ${seed}: settlements ${sites.length} | caves home-only ${homeOnly.length} (inside real footprint: ${inside(homeOnly)}) | caves real-footprints ${withReal.length} (inside: ${inside(withReal)})`)
}
