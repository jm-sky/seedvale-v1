/** `settlement-walk` benchmark route (world-terrain-056 S0).
 *
 *  Deterministic, derived from elapsed wall-clock seconds only (never
 *  accumulated per tick — same rule as the `stream` route). The player walks a
 *  circle around the scenario anchor at walking speed while the camera yaw does
 *  a slow sweep plus one fast ~90° turn (and the matching turn back) per loop,
 *  so the shadow frustum centre moves, rotates and pauses like real play. */
export const SETTLEMENT_WALK_RADIUS_M = 12
export const SETTLEMENT_WALK_SPEED_MPS = 3
export const SETTLEMENT_WALK_UPDATE_MS = 50
/** Slow yaw sweep amplitude (rad) over one loop. */
export const SETTLEMENT_WALK_YAW_SWEEP_RAD = 0.35
/** Fast turn: +90° at loop phase 0.5, −90° at phase 0.9, each over this long. */
export const SETTLEMENT_WALK_FAST_TURN_RAD = Math.PI / 2
export const SETTLEMENT_WALK_FAST_TURN_SEC = 0.25
export const SETTLEMENT_WALK_LOOP_SEC = (2 * Math.PI * SETTLEMENT_WALK_RADIUS_M) / SETTLEMENT_WALK_SPEED_MPS

export const SETTLEMENT_WALK_ROUTE = {
  radiusM: SETTLEMENT_WALK_RADIUS_M,
  loopSec: SETTLEMENT_WALK_LOOP_SEC,
  yawSweepRad: SETTLEMENT_WALK_YAW_SWEEP_RAD,
  fastTurnRad: SETTLEMENT_WALK_FAST_TURN_RAD,
  fastTurnSec: SETTLEMENT_WALK_FAST_TURN_SEC,
} as const

const smoothstep = (t: number): number => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

/** Player position on the loop, starting at the anchor + (radius, 0). */
export function settlementWalkPosition(anchorX: number, anchorZ: number, elapsedSec: number): { x: number, z: number } {
  const a = (elapsedSec / SETTLEMENT_WALK_LOOP_SEC) * 2 * Math.PI
  return {
    x: anchorX + SETTLEMENT_WALK_RADIUS_M * Math.cos(a),
    z: anchorZ + SETTLEMENT_WALK_RADIUS_M * Math.sin(a),
  }
}

/** Camera yaw offset (rad) to add to the base yaw at `elapsedSec`. */
export function settlementWalkYawOffset(elapsedSec: number): number {
  const loops = elapsedSec / SETTLEMENT_WALK_LOOP_SEC
  const phase = loops - Math.floor(loops)
  const tInLoop = phase * SETTLEMENT_WALK_LOOP_SEC
  const sweep = SETTLEMENT_WALK_YAW_SWEEP_RAD * Math.sin(phase * 2 * Math.PI)
  const up = smoothstep((tInLoop - 0.5 * SETTLEMENT_WALK_LOOP_SEC) / SETTLEMENT_WALK_FAST_TURN_SEC)
  const down = smoothstep((tInLoop - 0.9 * SETTLEMENT_WALK_LOOP_SEC) / SETTLEMENT_WALK_FAST_TURN_SEC)
  return sweep + SETTLEMENT_WALK_FAST_TURN_RAD * (up - down)
}
