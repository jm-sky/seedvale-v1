import type { HeightSampler } from '../player/PlayerController'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { RiverShoreCandidate } from '../terrain/riverNetwork'
import type { WaterBodyKind } from '../world/WaterSource'
import { resolveWaterShore } from '../terrain/waterBodyKind'

export type NaturalWaterKindSamplerDeps = {
  sampleHeight: HeightSampler
  waterLevel: number
  sampleContinentalness: (x: number, z: number) => number
  region: RegionParams
  /** `ChunkManager.riverShoreQuery` in production — one bounded river-shore
   *  candidate lookup (plan world-terrain-046), the same shared query the
   *  player drink/fill/fishing seam consumes, so this never re-derives a
   *  second flat-plane-gated classifier. */
  riverShoreQuery: (x: number, z: number) => RiverShoreCandidate | null
}

/** Classifies natural surface water at (x, z) the same way player drink/fill
 *  does — both consume `terrain/waterBodyKind.ts`'s shared `resolveWaterShore`
 *  (plan world-terrain-046), so a river's own precedence/eligibility here can
 *  never disagree with `app/interactables.ts`'s shoreline resolver. `null`
 *  when the point is not a drinkable natural shore (dry land, deep interior,
 *  etc.). */
export function createNaturalWaterKindAt(
  deps: NaturalWaterKindSamplerDeps,
): (x: number, z: number) => WaterBodyKind | null {
  const { riverShoreQuery, ...samplers } = deps
  return (x, z) => resolveWaterShore(x, z, samplers, riverShoreQuery(x, z))?.kind ?? null
}
