import type { WorldSpatialContext } from '../world/spatialContext'
import { spatialContextsEqual } from '../world/spatialContext'

/**
 * Centre-to-centre XZ distance (m) at which a predator may bite a human
 * (player or NPC) — fauna-051 §A, consumer of the contact contract in
 * items-player-067 (centre-to-centre, no target radius). Deliberately NOT
 * `AnimalAgent`'s `CONTACT_RANGE` (animal-on-animal: prey hunt, dog pest
 * pursuit, rabid). Same value today; tune here only with §C evidence.
 */
export const HUMAN_BITE_RANGE = 0.8

/** Maximum vertical separation (m) between biter and human for a bite to land
 *  (bridge/overhang/ledge ghost hits). Terrain slope over 0.8 m and a jump
 *  stay well below it. */
export const HUMAN_BITE_MAX_DY = 2

export type BitePosition = { x: number, y: number, z: number }

/**
 * @domain fauna
 * @role Attack-time bite eligibility (fauna-051 §A3): the biter and the human
 *  must share one `WorldSpatialContext` (surface vs the same cave) and not be
 *  vertically separated. Called once per landed-bite candidate, never per
 *  frame, with the world's existing `spatialContextAt` resolver — no raycasts,
 *  no scans. Perception stays owned by fauna-045.
 */
export function biteSharesSpatialContext(
  resolveSpatialContextAt: (x: number, y: number, z: number) => WorldSpatialContext,
  biter: BitePosition,
  target: BitePosition,
): boolean {
  if (Math.abs(biter.y - target.y) > HUMAN_BITE_MAX_DY) return false
  return spatialContextsEqual(
    resolveSpatialContextAt(biter.x, biter.y, biter.z),
    resolveSpatialContextAt(target.x, target.y, target.z),
  )
}
