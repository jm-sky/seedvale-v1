import type { DayNightState } from './dayNight'
import { tickDayNight } from './dayNight'
import { gameHoursToRealSeconds } from './timeConversion'

/** Real seconds held per skipped game-hour — 1h skip ≈ 1s, 8h skip ≈ 8s. */
const SECONDS_PER_SKIPPED_HOUR = 1

/** Overlay filter intensity: `0` = label only, `0.5` = wait, `1` = rest. */
export type TimeSkipFadeStrength = 0 | 0.5 | 1

export type TimeSkipTickResult = {
  label: string
  fadeStrength: TimeSkipFadeStrength
  /** True on the exact frame the skip completes — the caller's cue to hide
   *  the overlay (see `createTimeSkipOverlay.ts`). */
  justFinished: boolean
  /** Game hours actually completed by this skip. On `justFinished` this is
   *  the full requested interval; catch-up owners (`SettlementsManager.
   *  resolveTimeSkip`, `Fauna.resolveTimeSkip`) must apply it exactly once. */
  hours: number
  /** `dayNight.timeOfDay` (0-1) at the moment this skip started. */
  startTimeOfDay: number
  /** Real seconds of this frame that remain after the skip interval closed.
   *  `0` while the skip is still in flight. `gameLoop.ts` feeds this to
   *  `tickDayNight` at the restored multiplier so leftover frame time is
   *  ordinary World Time, never a second skip charge. */
  leftoverDt: number
  /** Simulation `dt` for live-ticked exceptions (player needs) this frame:
   *  skip-owned seconds at the skip multiplier plus leftover at the restored
   *  multiplier. */
  worldDt: number
}

export type TimeSkip = {
  isActive: () => boolean
  /** No-op if a skip is already in progress. `fadeStrength` picks the visual
   *  filter intensity (`app/createApp.ts` wires this to
   *  `createTimeSkipOverlay`) — the underlying mechanism is identical. */
  start: (hours: number, opts: { fadeStrength: TimeSkipFadeStrength, label: string }) => void
  /** Call once per frame regardless of any modal/pause state. Applies this
   *  frame's skip-owned World Time through `tickDayNight` while the skip
   *  multiplier is still set, then restores the previous multiplier on
   *  completion. Returns null when no skip is active. */
  tick: (dt: number) => TimeSkipTickResult | null
  /** Overlay intensity of the in-flight skip, or `null` when idle. Rest
   *  uses `1`; wait uses `0.5`. */
  fadeStrength: () => TimeSkipFadeStrength | null
  /** Elapsed fraction of the in-flight skip (`0`–`1`), or `null` when idle. */
  progress: () => number | null
  /** Restores `timeMultiplier` immediately without finishing normally — for
   *  app teardown mid-skip and player cancel. Does not credit the uncompleted
   *  remainder and does not emit `justFinished`. */
  cancel: () => void
}

function skipTimeMultiplier(dayLengthSec: number): number {
  return gameHoursToRealSeconds(1, dayLengthSec) / SECONDS_PER_SKIPPED_HOUR
}

/**
 * A "wait N hours" / "rest N hours" mechanism shared by both Quick Actions
 * flavors (`createQuickActions.ts`) — advances the clock by temporarily
 * boosting `dayNight.timeMultiplier` for `hours * SECONDS_PER_SKIPPED_HOUR`
 * real seconds, then restoring it. Skip-owned World Time is committed
 * through `tickDayNight` (the sole clock-advance seam) for exactly
 * `min(dt, remainingSec)` each frame, so a finishing frame whose `dt` is
 * larger than the leftover skip interval still advances exactly `N / 24`
 * days. `gameLoop.ts` then applies any leftover real seconds at the restored
 * multiplier and, on `justFinished`, asks catch-up owners to resolve the
 * completed interval once — see `NpcAgent.resolveTimeSkip` /
 * `SettlementsManager.resolveTimeSkip` / `Fauna.resolveTimeSkip`
 * (`docs/plans/archive/world-034-time-skip-clock-exactness-and-catch-up-coverage.md`,
 * `docs/plans/archive/2026-08-22--196--arch--time-skip-simulation-semantics.md`).
 * NPC/fauna/traps stay frozen for the duration; player needs keep live-ticking
 * through `worldDt`. `app/createApp.ts` is responsible for blocking player
 * input while active and for not gating this out of the per-frame
 * world-update block (the clock needs to keep ticking).
 */
export function createTimeSkip(dayNight: DayNightState): TimeSkip {
  let active: {
    remainingSec: number
    completedSec: number
    previousMultiplier: number
    fadeStrength: TimeSkipFadeStrength
    label: string
    hours: number
    startTimeOfDay: number
  } | null = null

  return {
    isActive: () => active !== null,
    fadeStrength: () => active?.fadeStrength ?? null,
    progress: () => {
      if (!active) return null
      const total = active.hours * SECONDS_PER_SKIPPED_HOUR
      if (total <= 0) return null
      return Math.min(1, Math.max(0, active.completedSec / total))
    },
    start(hours, opts) {
      if (active) return
      active = {
        remainingSec: hours * SECONDS_PER_SKIPPED_HOUR,
        completedSec: 0,
        previousMultiplier: dayNight.timeMultiplier,
        fadeStrength: opts.fadeStrength,
        label: opts.label,
        hours,
        startTimeOfDay: dayNight.timeOfDay,
      }
      dayNight.timeMultiplier = skipTimeMultiplier(dayNight.dayLengthSec)
    },
    tick(dt) {
      if (!active) return null
      const frameDt = Math.max(0, dt)
      const skipDt = Math.min(frameDt, active.remainingSec)
      const leftoverDt = frameDt - skipDt
      const skipMultiplier = dayNight.timeMultiplier
      if (skipDt > 0) {
        tickDayNight(dayNight, skipDt)
        active.remainingSec -= skipDt
        active.completedSec += skipDt
      }
      const { label, fadeStrength, hours, startTimeOfDay, previousMultiplier } = active
      const worldDt = skipDt * skipMultiplier + leftoverDt * previousMultiplier
      if (active.remainingSec > 0) {
        return {
          label,
          fadeStrength,
          justFinished: false,
          hours,
          startTimeOfDay,
          leftoverDt: 0,
          worldDt: skipDt * skipMultiplier,
        }
      }
      const completedHours = hours
      dayNight.timeMultiplier = previousMultiplier
      active = null
      return {
        label,
        fadeStrength,
        justFinished: true,
        hours: completedHours,
        startTimeOfDay,
        leftoverDt,
        worldDt,
      }
    },
    cancel() {
      if (!active) return
      dayNight.timeMultiplier = active.previousMultiplier
      active = null
    },
  }
}
