import type { SightCylinder } from './sightBlockers'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — pure chunk-environment placement → sight cylinder
 *  mapping. Only large solid landmarks block sight: `largeRock`, `tower`,
 *  `shipwreck`. `rockCluster`, logs, boats, trees and vegetation never do
 *  (low / see-through; a deliberate soft choice).
 */

export type SightEnvironmentKind = 'largeRock' | 'tower' | 'shipwreck'

/** ASSUMPTION: rock height ≈ 1.2 × its (collision) radius — the rock GLB
 *  templates are not measured for sight. */
export const LARGE_ROCK_SIGHT_HEIGHT_PER_RADIUS = 1.2
/** ASSUMPTION: tower GLB is fitted to a 10 m max dimension
 *  (`LANDMARK_TOWER_FIT_MAX`) and is tall — height ≈ 10 m × scale. */
export const TOWER_SIGHT_HEIGHT_M = 10
/** ASSUMPTION: shipwreck fitted to 12 m max (`LANDMARK_SHIPWRECK_FIT_MAX`),
 *  mostly long and low — hull/mast block height ≈ 4.5 m × scale. */
export const SHIPWRECK_SIGHT_HEIGHT_M = 4.5

/**
 * Cylinder for one environment placement, or `null` when the kind never
 * blocks sight / has no collision radius. `collisionRadius` is the
 * pre-scale `ENVIRONMENT_COLLISION_RADIUS` of the *effective* kind (a mined
 * large rock that became a cluster must be passed as `rockCluster` → null);
 * `groundY` is the terrain height at `(x, z)`.
 */
export function environmentSightBlocker(
  kind: string,
  x: number,
  z: number,
  scale: number,
  collisionRadius: number,
  groundY: number,
): SightCylinder | null {
  if (collisionRadius <= 0) return null
  const radius = collisionRadius * scale
  let height: number
  switch (kind) {
    case 'largeRock':
      height = radius * LARGE_ROCK_SIGHT_HEIGHT_PER_RADIUS
      break
    case 'shipwreck':
      height = SHIPWRECK_SIGHT_HEIGHT_M * scale
      break
    case 'tower':
      height = TOWER_SIGHT_HEIGHT_M * scale
      break
    default:
      return null
  }
  return { kind: 'cylinder', x, z, radius, minY: groundY, maxY: groundY + height }
}
