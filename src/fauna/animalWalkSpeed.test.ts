import { describe, expect, it } from 'vitest'
import { ANIMAL_DEFS } from './animalDefs'
import { ANIMAL_VARIANT_DEFS } from './animalVariants'
import {
  calmWanderWalkBaseline,
  NIGHT_PREY_WALK_MULT,
  resolveAutonomousWalkSpeed,
  resolveLocomotionPlayback,
} from './animalWalkSpeed'

describe('calm settlement wander gait (fauna-038)', () => {
  it('horse has calmWalkSpeed below autonomous walkSpeed', () => {
    const horse = ANIMAL_DEFS.horse
    expect(horse.calmWalkSpeed).toBeDefined()
    expect(horse.calmWalkSpeed!).toBeLessThan(horse.walkSpeed)
    expect(horse.walkSpeed).toBe(2.6)
    expect(horse.sprintSpeed).toBe(6.0)
  })

  it('horse mount speeds stay independent of calmWalkSpeed', () => {
    const horse = ANIMAL_DEFS.horse
    expect(horse.mount!.walkSpeed).toBe(10.5)
    expect(horse.mount!.sprintSpeed).toBe(17.5)
    expect(horse.mount!.walkSpeed).toBeGreaterThan(horse.calmWalkSpeed!)
    expect(horse.mount!.walkSpeed).toBeGreaterThan(horse.walkSpeed)
  })

  it('species without calmWalkSpeed keep legacy wander baseline', () => {
    const cow = ANIMAL_DEFS.cow
    expect(cow.calmWalkSpeed).toBeUndefined()
    expect(calmWanderWalkBaseline(cow)).toBe(cow.walkSpeed)
  })

  it('IMP-008: sheep, dog and donkey have a calm stroll below run speed and below purposeful walk', () => {
    for (const kind of ['sheep', 'dog', 'donkey', 'horse'] as const) {
      const def = ANIMAL_DEFS[kind]
      expect(def.calmWalkSpeed, kind).toBeDefined()
      expect(def.calmWalkSpeed!, kind).toBeLessThan(def.walkSpeed)
      expect(def.calmWalkSpeed!, kind).toBeLessThan(def.sprintSpeed / 2)
    }
    // Species keep distinct characters.
    expect(ANIMAL_DEFS.dog.calmWalkSpeed!).toBeGreaterThan(ANIMAL_DEFS.horse.calmWalkSpeed!)
    expect(ANIMAL_DEFS.sheep.calmWalkSpeed!).toBeLessThan(ANIMAL_DEFS.horse.calmWalkSpeed!)
    // Purposeful / sprint / mount speeds untouched.
    expect(ANIMAL_DEFS.sheep.walkSpeed).toBe(2.2)
    expect(ANIMAL_DEFS.dog.sprintSpeed).toBe(6.8)
    expect(ANIMAL_DEFS.donkey.mount!.walkSpeed).toBe(9.0)
  })

  it('IMP-007: only sheep declare a walk clip fallback (Jump)', () => {
    expect(ANIMAL_DEFS.sheep.walkClipFallbacks).toEqual(['Jump'])
    for (const [kind, def] of Object.entries(ANIMAL_DEFS)) {
      if (kind !== 'sheep') expect(def.walkClipFallbacks, kind).toBeUndefined()
    }
  })

  it('calm baseline selects calmWalkSpeed when present', () => {
    expect(calmWanderWalkBaseline(ANIMAL_DEFS.horse)).toBe(ANIMAL_DEFS.horse.calmWalkSpeed)
  })

  it('resolveAutonomousWalkSpeed applies variant speedMultiplier', () => {
    const base = calmWanderWalkBaseline(ANIMAL_DEFS.horse)
    const mult = ANIMAL_VARIANT_DEFS.alpha.speedMultiplier
    expect(resolveAutonomousWalkSpeed(base, {
      isNight: false,
      role: 'livestock',
      speedMultiplier: mult,
    })).toBe(base * mult)
  })

  it('resolveAutonomousWalkSpeed preserves prey night slowdown only', () => {
    const walk = ANIMAL_DEFS.sheep.walkSpeed
    expect(resolveAutonomousWalkSpeed(walk, {
      isNight: true,
      role: 'prey',
      speedMultiplier: 1,
    })).toBe(walk * NIGHT_PREY_WALK_MULT)

    expect(resolveAutonomousWalkSpeed(walk, {
      isNight: true,
      role: 'livestock',
      speedMultiplier: 1,
    })).toBe(walk)

    const horseCalm = calmWanderWalkBaseline(ANIMAL_DEFS.horse)
    expect(resolveAutonomousWalkSpeed(horseCalm, {
      isNight: true,
      role: 'livestock',
      speedMultiplier: 1,
    })).toBe(horseCalm)
  })

  it('absent calmWalkSpeed + modifiers matches purposeful walk result shape', () => {
    const def = ANIMAL_DEFS.deer
    const purposeful = resolveAutonomousWalkSpeed(def.walkSpeed, {
      isNight: true,
      role: def.role,
      speedMultiplier: 1.05,
    })
    const calm = resolveAutonomousWalkSpeed(calmWanderWalkBaseline(def), {
      isNight: true,
      role: def.role,
      speedMultiplier: 1.05,
    })
    expect(calm).toBe(purposeful)
  })
})

describe('locomotion playback (IMP-008, presentation only)', () => {
  const horse = ANIMAL_DEFS.horse

  it('walk clip plays at 1x at the species walk speed and slows for calm stroll', () => {
    expect(resolveLocomotionPlayback(horse, horse.walkSpeed, false, true)).toEqual({ clip: 'walk', timeScale: 1 })
    const calm = resolveLocomotionPlayback(horse, horse.calmWalkSpeed!, false, true)
    expect(calm.clip).toBe('walk')
    expect(calm.timeScale).toBeLessThan(1)
    expect(calm.timeScale).toBeGreaterThanOrEqual(0.5)
  })

  it('sprint uses gallop clip scaled by sprint speed', () => {
    expect(resolveLocomotionPlayback(horse, horse.sprintSpeed, true, true)).toEqual({ clip: 'gallop', timeScale: 1 })
  })

  it('mounted speeds map to gallop clip with bounded rate', () => {
    const walk = resolveLocomotionPlayback(horse, horse.mount!.walkSpeed, false, true)
    const sprint = resolveLocomotionPlayback(horse, horse.mount!.sprintSpeed, true, true)
    expect(walk.clip).toBe('gallop')
    expect(sprint.clip).toBe('gallop')
    expect(sprint.timeScale).toBeLessThanOrEqual(1.8)
  })

  it('species without a gallop clip stay on walk, rate clamped', () => {
    const sheep = ANIMAL_DEFS.sheep
    const r = resolveLocomotionPlayback(sheep, sheep.sprintSpeed, true, false)
    expect(r.clip).toBe('walk')
    expect(r.timeScale).toBe(1.8)
  })

  it('zero speed yields neutral rate', () => {
    expect(resolveLocomotionPlayback(horse, 0, false, true).timeScale).toBe(1)
  })
})
