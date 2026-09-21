import {
  spatialContextsEqual,
  type WorldSpatialContext,
} from '../world/spatialContext'

/**
 * Whether a distance-attenuated world one-shot may play given resolved listener
 * and source spatial contexts. Unknown context on either side keeps legacy
 * distance-only behaviour (backward compatible).
 *
 * @domain world
 */
export function worldSoundSpatialContextsCompatible(
  listenerContext: WorldSpatialContext | null,
  sourceContext: WorldSpatialContext | null,
): boolean {
  if (listenerContext === null || sourceContext === null) return true
  return spatialContextsEqual(listenerContext, sourceContext)
}
