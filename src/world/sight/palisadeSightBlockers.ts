import type { PropPlacement } from '../../render/instancedProps'
import type { SightPanel } from './sightBlockers'
import { PALISADE_WALL_HALF_DEPTH, WALL_HALF_LENGTH, WALL_TARGET_HEIGHT } from '../../settlement/settlementPalisade'
import { PALISADE_FOOTPRINT_RADIUS, PALISADE_HALF_LENGTH } from '../palisade'
import { PALISADE_POST_HEIGHT } from '../palisadeProp'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — palisade sight blockers. Settlement entrance
 *  palisades block sight; pasture/paddock/yard rail fences deliberately do NOT
 *  (open rails, soft — they are movement obstacles only), and are simply not
 *  registered by the settlement.
 */

/**
 * One panel per settlement palisade placement `[groundY, groundY + 1.85 * scale]`
 * — same footprint/yaw convention as `fencePlacementColliders`.
 */
export function settlementPalisadeSightBlockers(placements: readonly PropPlacement[]): SightPanel[] {
  return placements.map((placement): SightPanel => ({
    kind: 'panel',
    x: placement.x,
    z: placement.z,
    halfWidth: WALL_HALF_LENGTH * placement.scale * (placement.lengthScale ?? 1),
    halfDepth: PALISADE_WALL_HALF_DEPTH * placement.scale,
    rotationY: 0 - placement.rotationY,
    minY: placement.groundY,
    maxY: placement.groundY + WALL_TARGET_HEIGHT * placement.scale,
  }))
}

/**
 * Panel for one *completed* player palisade segment at terrain height
 * `groundY` (the height `placeOnGround` places the mesh at). Height =
 * `PALISADE_POST_HEIGHT` (posts + ~0.2 m sharpened tips ignored).
 * ASSUMPTION: the procedural fence is a row of thin posts 0.55 m apart; it is
 * treated as a solid panel, same as its collider.
 */
export function playerPalisadeSightBlocker(
  record: { x: number, z: number, yaw: number },
  groundY: number,
): SightPanel {
  return {
    kind: 'panel',
    x: record.x,
    z: record.z,
    halfWidth: PALISADE_FOOTPRINT_RADIUS,
    halfDepth: PALISADE_HALF_LENGTH,
    rotationY: 0 - record.yaw,
    minY: groundY,
    maxY: groundY + PALISADE_POST_HEIGHT,
  }
}
