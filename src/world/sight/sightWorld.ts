import type { Caves } from '../createCaves'
import type { SightWorld } from './querySight'
import type { SightBlockerRegistry } from './sightBlockers'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — assembles the `SightWorld` a `WorldBundle` hands
 *  to `querySight`. No `isAreaReady`: the chunk manager has no readiness API
 *  yet, so queries never return `'unloaded'`.
 */
export function createSightWorld(
  blockers: SightBlockerRegistry,
  chunkManager: { sampleHeight: (x: number, z: number) => number },
  caves: Pick<Caves, 'occupancyAt' | 'canPerceiveAcrossEntrance'>,
): SightWorld {
  return {
    blockers,
    sampleHeight: chunkManager.sampleHeight,
    occupancyAt: caves.occupancyAt,
    canPerceiveAcrossEntrance: caves.canPerceiveAcrossEntrance,
  }
}
