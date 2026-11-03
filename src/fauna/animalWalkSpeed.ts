import type { AnimalDef, AnimalRole } from './animalDefs'

/** Prey ordinary-walk slowdown at night vs day (matches `AnimalAgent`). */
export const NIGHT_PREY_WALK_MULT = 0.5

/**
 * Species baseline for ordinary local wander (plan fauna-038).
 * Falls back to `walkSpeed` when `calmWalkSpeed` is absent.
 *
 * @domain fauna
 */
export function calmWanderWalkBaseline(
  def: Pick<AnimalDef, 'walkSpeed' | 'calmWalkSpeed'>,
): number {
  return def.calmWalkSpeed ?? def.walkSpeed
}

/**
 * Shared autonomous walk modifiers: prey night slowdown + variant speed.
 * Used by both purposeful `walkSpeedNow` and calm ordinary wander.
 *
 * @domain fauna
 */
export function resolveAutonomousWalkSpeed(
  baseSpeed: number,
  opts: {
    isNight: boolean
    role: AnimalRole
    speedMultiplier: number
  },
): number {
  const nightAdjusted = opts.isNight && opts.role === 'prey'
    ? baseSpeed * NIGHT_PREY_WALK_MULT
    : baseSpeed
  return nightAdjusted * opts.speedMultiplier
}

/** Speed ratio (vs `sprintSpeed`) above which a non-sprinting mover is shown on
 *  the gallop clip — mounted "walk" (10.5 m/s) is far beyond a walk cycle. */
const GALLOP_CLIP_SPEED_RATIO = 0.8
const MIN_LOCOMOTION_TIME_SCALE = 0.5
const MAX_LOCOMOTION_TIME_SCALE = 1.8

export type LocomotionClipKey = 'walk' | 'gallop'

/**
 * Presentation-only: which locomotion clip to show and how fast to play it so
 * feet roughly track the real speed (IMP-008). The walk clip is authored for
 * `walkSpeed`, the gallop clip for `sprintSpeed`. Never feeds back into
 * authoritative movement.
 *
 * @domain fauna
 */
export function resolveLocomotionPlayback(
  def: Pick<AnimalDef, 'walkSpeed' | 'sprintSpeed'>,
  speed: number,
  sprinting: boolean,
  hasGallopClip: boolean,
): { clip: LocomotionClipKey, timeScale: number } {
  const gallop = hasGallopClip && (sprinting || speed > def.sprintSpeed * GALLOP_CLIP_SPEED_RATIO)
  const clip: LocomotionClipKey = gallop ? 'gallop' : 'walk'
  const ref = gallop ? def.sprintSpeed : def.walkSpeed
  if (!(speed > 0) || !(ref > 0)) return { clip, timeScale: 1 }
  const timeScale = Math.min(MAX_LOCOMOTION_TIME_SCALE, Math.max(MIN_LOCOMOTION_TIME_SCALE, speed / ref))
  return { clip, timeScale }
}
