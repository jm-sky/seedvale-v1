import type { RawSampleParams } from './chunkHeightmap'
import type { WorldHydrology } from './worldHydrology'
import { worldgenFingerprint } from '../persistence/worldgenFingerprint'
import { DEFAULT_WORLD_HYDROLOGY_OPTIONS, WORLD_HYDROLOGY_VERSION, type WorldHydrologyOptions } from './worldHydrology'

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
  return `h${WORLD_HYDROLOGY_VERSION}-${worldgenFingerprint({
    options: worldHydrologyOptionsFor(p),
    terrain: {
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
    },
  })}`
}

const installed = new Map<string, WorldHydrology>()

/** Installs `data` under `id` (replaces an earlier install of the same id). */
export function installWorldHydrology(id: string, data: WorldHydrology): void {
  installed.set(id, data)
}

export function hasWorldHydrology(id: string): boolean {
  return installed.has(id)
}

/** The installed hydrology for `id`; throws when none is installed (see module doc). */
export function worldHydrologyFor(id: string): WorldHydrology {
  const data = installed.get(id)
  if (!data) throw new Error(`world hydrology "${id}" is not installed`)
  return data
}

/** Drops installed hydrology — all of it, or one id. World rebuilds and tests. */
export function clearWorldHydrology(id?: string): void {
  if (id === undefined) installed.clear()
  else installed.delete(id)
}
