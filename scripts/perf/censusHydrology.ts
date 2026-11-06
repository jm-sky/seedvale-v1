import type { RawSampleParams } from '../../src/terrain/chunkHeightmap'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { computeWorldHydrology, sampleRawFloorRows, WORLD_HYDROLOGY_GRID, worldHydrologyGridFor } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'

/**
 * Shared by the worldgen census scripts: installs the production (conditioned, 058) global hydrology of `seed` once
 * and returns its id. `--hydrology=raw` returns the unconditioned id instead (raw floor, no rivers or lakes — NOT
 * comparable to production baselines). Costs ~5 s per seed, memoised.
 */
const cache = new Map<number, string>()

export function censusHydrologyId(seed: number): string {
  if (process.argv.includes('--hydrology=raw')) return UNCONDITIONED_HYDROLOGY_ID
  const hit = cache.get(seed)
  if (hit) return hit
  const t = defaultTerrainConfig(65)
  const params: RawSampleParams = {
    seed, heightScale: t.heightScale, waterLevel: t.waterLevel, noiseScale: t.noiseScale,
    detailAmplitude: t.detailAmplitude, hillsScale: t.hillsScale, hillsAmplitude: t.hillsAmplitude,
    hillsFbm: t.hillsFbm, fbm: t.fbm, biome: t.biome, region: t.region, hydrologyId: UNCONDITIONED_HYDROLOGY_ID,
  }
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(params, grid, 0, grid.size)
  const hydrology = computeWorldHydrology(worldHydrologyGridFor(params, floor), { waterLevel: params.waterLevel, seed })
  const id = hydrologyIdFor(params)
  installWorldHydrology(id, hydrology)
  cache.set(seed, id)
  return id
}
