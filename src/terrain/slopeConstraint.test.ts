import { describe, expect, it } from 'vitest'
import {
  applySlopeMovementConstraint,
  sampleResidentSlope,
  sampleSlope,
  SLOPE_FALLOFF_START_DEG,
  SLOPE_MAX_WALKABLE_DEG,
  SLOPE_SAMPLE_STEP,
  stepWithSlopeAndCollisionResident,
} from './slopeConstraint'

/** Height field sloping downhill in +x (uphill direction is -x). */
function slopedHeight(angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180
  return (x: number, _z: number) => -x * Math.tan(angle)
}

describe('slopeConstraint', () => {
  it('flat terrain leaves movement at full speed in any direction', () => {
    const flat = () => 0
    const wish = applySlopeMovementConstraint(3, -2, 0, 0, flat)
    expect(wish.x).toBeCloseTo(3)
    expect(wish.z).toBeCloseTo(-2)
  })

  it('scales down uphill movement between the falloff start and max walkable angle', () => {
    const midAngle = (SLOPE_FALLOFF_START_DEG + SLOPE_MAX_WALKABLE_DEG) / 2
    const sampleHeight = slopedHeight(midAngle)
    // (-4, 0) points uphill (toward -x).
    const wish = applySlopeMovementConstraint(-4, 0, 0, 0, sampleHeight)
    expect(wish.x).toBeLessThan(0)
    expect(wish.x).toBeGreaterThan(-4)
    expect(wish.z).toBeCloseTo(0)
  })

  it('does not affect movement across the slope', () => {
    const sampleHeight = slopedHeight(SLOPE_MAX_WALKABLE_DEG + 5)
    // (0, 4) is perpendicular to the uphill direction (-x, 0).
    const wish = applySlopeMovementConstraint(0, 4, 0, 0, sampleHeight)
    expect(wish.x).toBeCloseTo(0)
    expect(wish.z).toBeCloseTo(4)
  })

  it('does not affect downhill movement, even past the max walkable angle', () => {
    const sampleHeight = slopedHeight(SLOPE_MAX_WALKABLE_DEG + 5)
    // (4, 0) points downhill (toward +x).
    const wish = applySlopeMovementConstraint(4, 0, 0, 0, sampleHeight)
    expect(wish.x).toBeCloseTo(4)
    expect(wish.z).toBeCloseTo(0)
  })

  it('fully blocks uphill movement beyond the max walkable angle', () => {
    const sampleHeight = slopedHeight(SLOPE_MAX_WALKABLE_DEG + 5)
    const wish = applySlopeMovementConstraint(-4, 0, 0, 0, sampleHeight)
    expect(wish.x).toBeCloseTo(0)
    expect(wish.z).toBeCloseTo(0)
  })

  it('slides sideways along a too-steep slope instead of stopping the whole vector', () => {
    const sampleHeight = slopedHeight(SLOPE_MAX_WALKABLE_DEG + 5)
    // Diagonal: uphill component blocked, across-slope component preserved.
    const wish = applySlopeMovementConstraint(-3, 2, 0, 0, sampleHeight)
    expect(wish.x).toBeCloseTo(0)
    expect(wish.z).toBeCloseTo(2)
  })

  it('sampleSlope reports zero angle and no direction on flat ground', () => {
    const slope = sampleSlope(0, 0, () => 5)
    expect(slope.angleRad).toBe(0)
    expect(slope.upX).toBe(0)
    expect(slope.upZ).toBe(0)
  })
})

/** plan world-terrain-044 — the resident-aware siblings must never mix a
 *  resident sample with raw analytical fallback: any unavailable probe
 *  collapses the whole result to `null`/held, instead of a mismatched
 *  reading that could fabricate a cliff at a residency boundary. */
describe('sampleResidentSlope (plan world-terrain-044)', () => {
  it('matches sampleSlope when every probe sample is available (unchanged behavior)', () => {
    const raw = slopedHeight(20)
    const plain = sampleSlope(0, 0, raw)
    const resident = sampleResidentSlope(0, 0, raw)
    expect(resident).not.toBeNull()
    expect(resident!.angleRad).toBeCloseTo(plain.angleRad, 10)
    expect(resident!.upX).toBeCloseTo(plain.upX, 10)
    expect(resident!.upZ).toBeCloseTo(plain.upZ, 10)
  })

  it('is null the moment any one of the 4 finite-difference probes is unavailable', () => {
    // Unavailable just past +x, inside the SLOPE_SAMPLE_STEP probe reach.
    const resident = (x: number) => (x > SLOPE_SAMPLE_STEP - 0.1 ? null : 5)
    expect(sampleResidentSlope(0, 0, resident)).toBeNull()
  })

  it('reports flat/no-direction where every probe is available and level', () => {
    expect(sampleResidentSlope(0, 0, () => 3)).toEqual({ angleRad: 0, upX: 0, upZ: 0 })
  })
})

describe('stepWithSlopeAndCollisionResident (plan world-terrain-044)', () => {
  it('holds position when the current-point slope probe is unavailable', () => {
    const result = stepWithSlopeAndCollisionResident({
      x: 0,
      z: 0,
      dirX: 1,
      dirZ: 0,
      speed: 5,
      dt: 1,
      sampleGround: () => null,
      isWalkable: () => true,
    })
    expect(result).toEqual({ x: 0, z: 0, moved: false })
  })

  it('holds position when every candidate step lands on unavailable ground (no step across the boundary)', () => {
    // Available (flat) inside [0, 4) on both axes; unavailable at/after the
    // boundary — every one of the 3 collision-fallback candidates below
    // lands past it.
    const resident = (x: number, z: number) => (x >= 4 || z >= 4 ? null : 0)
    const result = stepWithSlopeAndCollisionResident({
      x: 0,
      z: 0,
      dirX: 1,
      dirZ: 1,
      speed: 5,
      dt: 1,
      sampleGround: resident,
      isWalkable: () => true,
    })
    expect(result).toEqual({ x: 0, z: 0, moved: false })
  })

  it('steps normally when every required sample is available', () => {
    const result = stepWithSlopeAndCollisionResident({
      x: 0,
      z: 0,
      dirX: 1,
      dirZ: 0,
      speed: 5,
      dt: 1,
      sampleGround: () => 0,
      isWalkable: () => true,
    })
    expect(result.moved).toBe(true)
    expect(result.x).toBeCloseTo(5, 5)
    expect(result.z).toBeCloseTo(0, 5)
  })
})
