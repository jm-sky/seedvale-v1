import { describe, expect, it } from 'vitest'
import { createDayNightState, tickDayNight } from './dayNight'
import { createTimeSkip } from './timeSkip'

const DAY_LENGTH_SEC = 480
const SKIP_HOURS = 8
const SKIP_DAYS = SKIP_HOURS / 24

function runSkipFrames(
  hours: number,
  frames: readonly number[],
  opts?: { startTimeOfDay?: number, timeMultiplier?: number },
): {
  elapsedDays: number
  timeOfDay: number
  skipElapsedDays: number | null
  skipTimeOfDay: number | null
  timeMultiplier: number
  catchUpHours: number[]
  justFinishedCount: number
} {
  const dayNight = createDayNightState({
    dayLengthSec: DAY_LENGTH_SEC,
    elapsedDays: 0,
    timeOfDay: opts?.startTimeOfDay ?? 0.32,
    timeMultiplier: opts?.timeMultiplier ?? 1,
  })
  const timeSkip = createTimeSkip(dayNight)
  timeSkip.start(hours, { fadeStrength: 0.5, label: 'Wait' })
  const catchUpHours: number[] = []
  let justFinishedCount = 0
  let skipElapsedDays: number | null = null
  let skipTimeOfDay: number | null = null
  for (const dt of frames) {
    const skip = timeSkip.tick(dt)
    if (skip?.justFinished) {
      justFinishedCount += 1
      catchUpHours.push(skip.hours)
      skipElapsedDays = dayNight.elapsedDays
      skipTimeOfDay = dayNight.timeOfDay
    }
    tickDayNight(dayNight, skip?.leftoverDt ?? dt)
  }
  return {
    elapsedDays: dayNight.elapsedDays,
    timeOfDay: dayNight.timeOfDay,
    skipElapsedDays,
    skipTimeOfDay,
    timeMultiplier: dayNight.timeMultiplier,
    catchUpHours,
    justFinishedCount,
  }
}

function framesCovering(totalSec: number, dt: number, extraFinalDt?: number): number[] {
  const frames: number[] = []
  let remaining = totalSec
  while (remaining > 0) {
    const step = Math.min(dt, remaining)
    frames.push(step)
    remaining -= step
  }
  if (extraFinalDt != null) frames.push(extraFinalDt)
  return frames
}

describe('timeSkip clock exactness (plan world-034)', () => {
  it('a finishing frame larger than remainingSec still advances exactly N/24 days', () => {
    const almostDone = framesCovering(SKIP_HOURS - 0.01, 1 / 60)
    almostDone.push(0.05)
    const result = runSkipFrames(SKIP_HOURS, almostDone)
    expect(result.justFinishedCount).toBe(1)
    expect(result.catchUpHours).toEqual([SKIP_HOURS])
    expect(result.skipElapsedDays).toBeCloseTo(SKIP_DAYS, 10)
    expect(result.skipTimeOfDay).toBeCloseTo((0.32 + SKIP_DAYS) % 1, 10)
    expect(result.elapsedDays).toBeGreaterThanOrEqual(result.skipElapsedDays!)
    expect(result.timeMultiplier).toBe(1)
  })

  it('different frame partitions land on the same elapsedDays and timeOfDay', () => {
    const fine = runSkipFrames(SKIP_HOURS, framesCovering(SKIP_HOURS, 1 / 60))
    const coarse = runSkipFrames(SKIP_HOURS, framesCovering(SKIP_HOURS, 0.05))
    expect(fine.skipElapsedDays).toBeCloseTo(SKIP_DAYS, 10)
    expect(coarse.skipElapsedDays).toBeCloseTo(fine.skipElapsedDays!, 10)
    expect(coarse.skipTimeOfDay).toBeCloseTo(fine.skipTimeOfDay!, 10)
    expect(fine.catchUpHours).toEqual([SKIP_HOURS])
    expect(coarse.catchUpHours).toEqual([SKIP_HOURS])
  })

  it('cancel advances only the completed portion and restores the previous multiplier', () => {
    const dayNight = createDayNightState({
      dayLengthSec: DAY_LENGTH_SEC,
      elapsedDays: 0,
      timeOfDay: 0.1,
      timeMultiplier: 2,
    })
    const timeSkip = createTimeSkip(dayNight)
    timeSkip.start(SKIP_HOURS, { fadeStrength: 1, label: 'Rest' })
    expect(dayNight.timeMultiplier).toBeGreaterThan(2)
    const catchUpHours: number[] = []
    for (const dt of framesCovering(3, 0.05)) {
      const skip = timeSkip.tick(dt)
      if (skip?.justFinished) catchUpHours.push(skip.hours)
      tickDayNight(dayNight, skip?.leftoverDt ?? dt)
    }
    expect(timeSkip.isActive()).toBe(true)
    timeSkip.cancel()
    expect(timeSkip.isActive()).toBe(false)
    expect(dayNight.timeMultiplier).toBe(2)
    expect(catchUpHours).toEqual([])
    expect(dayNight.elapsedDays).toBeCloseTo(3 / 24, 10)
    tickDayNight(dayNight, 1)
    expect(dayNight.elapsedDays).toBeCloseTo(3 / 24 + 2 / DAY_LENGTH_SEC, 10)
  })
})
