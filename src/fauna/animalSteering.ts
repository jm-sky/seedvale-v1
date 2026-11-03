/**
 * Pure steering helpers for autonomous fauna movement (`AnimalAgent.steerToward`).
 * Presentation-level only: they never choose targets or routes.
 *
 * @domain fauna
 */

/** Autonomous yaw turn rate (rad/s, 720°/s). Fast enough that a normal
 *  re-aim still looks immediate at behaviour-cadence `dt`, slow enough that a
 *  target flipping every tick shows as a small wobble instead of 180° snaps. */
export const ANIMAL_TURN_RATE_RAD_PER_SEC = 4 * Math.PI

/** Net displacement (m) over one behaviour tick below which an animal that
 *  tried to step is treated as not having moved (blocked, or clamped back by
 *  an area bound). */
export const ANIMAL_MIN_REAL_STEP_M = 1e-4

/** Shortest signed angular difference `target - current`, in (-π, π]. */
export function shortestYawDelta(current: number, target: number): number {
  const twoPi = Math.PI * 2
  let delta = (target - current) % twoPi
  if (delta > Math.PI) delta -= twoPi
  else if (delta <= -Math.PI) delta += twoPi
  return delta
}

/** Rotates `current` toward `target` by at most `maxDelta` radians. */
export function turnYawToward(current: number, target: number, maxDelta: number): number {
  const delta = shortestYawDelta(current, target)
  if (Math.abs(delta) <= maxDelta) return current + delta
  return current + Math.sign(delta) * maxDelta
}
