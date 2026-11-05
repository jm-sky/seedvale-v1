import type { WorldSpatialContext } from '../world/spatialContext'
import { spatialContextsEqual } from '../world/spatialContext'

/**
 * @domain npc
 * @system observation
 * @role World-042 Stage 0 — spatial gate for player-facing actor information
 *  (status label + highlight). Pure; the world supplies the resolvers.
 */

type Xyz = { x: number, y: number, z: number }

/**
 * Per-frame view of the player's spatial situation, built once in the game
 * loop (player context is already resolved there) and handed to agents via
 * `PlayerObservationInput.labelSpatial`.
 */
export type PlayerLabelSpatialView = {
  /** Player's context this frame (resolved once, not per actor). */
  context: WorldSpatialContext
  /** Live player position (not copied). */
  position: Xyz
  /** `Caves.spatialContextAt` — called once per in-range actor per presentation tick. */
  resolveContextAt: (x: number, y: number, z: number) => WorldSpatialContext
  /** `Caves.canPerceiveAcrossEntrance` — O(1) per cave id. */
  canPerceiveAcrossEntrance: (caveId: string, a: Xyz, b: Xyz) => boolean
}

/**
 * True when an actor at `actorPos` may show its label/highlight to the
 * player: same `WorldSpatialContext`, or different contexts joined through
 * the matching cave mouth. Cave A vs cave B and surface-over-tunnel are
 * hidden. `view === undefined` (no world wiring, tests) keeps the old
 * behaviour: visible.
 */
export function isActorInfoSpatiallyVisible(
  view: PlayerLabelSpatialView | undefined,
  actorPos: Xyz,
): boolean {
  if (!view) return true
  const actorContext = view.resolveContextAt(actorPos.x, actorPos.y, actorPos.z)
  if (spatialContextsEqual(actorContext, view.context)) return true
  // Different contexts: cave A vs cave B never connect.
  if (actorContext.kind === 'cave' && view.context.kind === 'cave') return false
  const caveContext = actorContext.kind === 'cave' ? actorContext : view.context
  if (caveContext.kind !== 'cave') return false
  return view.canPerceiveAcrossEntrance(caveContext.caveId, actorPos, view.position)
}
