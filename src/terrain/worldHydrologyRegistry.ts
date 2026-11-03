import type { RawSampleParams } from './chunkHeightmap'
import { worldgenFingerprint } from '../persistence/worldgenFingerprint'
import { DEFAULT_WORLD_HYDROLOGY_OPTIONS, WORLD_HYDROLOGY_VERSION, type WorldHydrologyOptions } from './worldHydrology'
import { clearWorldHydrology, hasWorldHydrology, installWorldHydrology, LEGACY_HYDROLOGY_PREFIX, worldHydrologyFor } from './worldHydrologyStore'

/**
 * Module registry of installed global hydrology, keyed by `hydrologyId` (plan world-terrain-058 decision 4; same
 * pattern as `noiseHandlesFor(seed)`). The identity travels in `RawSampleParams.hydrologyId` (so every fingerprint that
 * hashes the params follows hydrology automatically); the data is installed once per realm — the main thread at boot
 * (`worldHydrologyRuntime.ts`) and every chunk worker via the pool's install message. A lookup of an id that is not
 * installed throws: a silent fallback would write uncorrected terrain into caches stored under a corrected fingerprint.
 *
 * @domain world-terrain
 * @subdomain hydrology
 */

/** Terrain inputs that the hydrology floor depends on — exactly the shared terrain part of `RawSampleParams`. */
type HydrologyTerrainInputs = Omit<RawSampleParams, 'hydrologyId'>

/** Options a world's hydrology is computed with — the defaults plus the per-world inputs. */
export function worldHydrologyOptionsFor(params: Pick<RawSampleParams, 'seed' | 'waterLevel'>): WorldHydrologyOptions {
  return { ...DEFAULT_WORLD_HYDROLOGY_OPTIONS, waterLevel: params.waterLevel, seed: params.seed }
}

/**
 * Identity of the hydrology for a terrain: hash of `WORLD_HYDROLOGY_VERSION`, the computation options and every
 * terrain input. Pure and cheap (one stringify); changes whenever the algorithm version, a knob or the terrain does.
 * Explicit field pick, so extra properties of a wider params object never leak into the id.
 */
export function hydrologyIdFor(p: HydrologyTerrainInputs): string {
  const terrain = {
    seed: p.seed,
    heightScale: p.heightScale,
    waterLevel: p.waterLevel,
    noiseScale: p.noiseScale,
    detailAmplitude: p.detailAmplitude,
    hillsScale: p.hillsScale,
    hillsAmplitude: p.hillsAmplitude,
    hillsFbm: p.hillsFbm,
    fbm: p.fbm,
    biome: p.biome,
    region: p.region,
  }
  // `?hydrology=legacy` (A/B against the pre-058 per-tile rivers): no data, uncorrected terrain, own cache keys.
  if (legacyHydrologyRequested()) return `${LEGACY_HYDROLOGY_PREFIX}${worldgenFingerprint({ terrain })}`
  return `h${WORLD_HYDROLOGY_VERSION}-${worldgenFingerprint({ options: worldHydrologyOptionsFor(p), terrain })}`
}

/** `?hydrology=legacy` in the page URL (main thread only; workers receive the resulting id inside their params). */
function legacyHydrologyRequested(): boolean {
  try {
    return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('hydrology') === 'legacy'
  } catch {
    return false
  }
}

export { clearWorldHydrology, hasWorldHydrology, installWorldHydrology, worldHydrologyFor }
