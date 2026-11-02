import { describe, expect, it } from 'vitest'
import {
  SETTLEMENT_WALK_LOOP_SEC,
  SETTLEMENT_WALK_RADIUS_M,
  settlementWalkPosition,
  settlementWalkYawOffset,
} from './settlementWalkRoute'

describe('settlement-walk route', () => {
  it('is periodic and stays on the circle', () => {
    const a = settlementWalkPosition(100, 50, 3.7)
    const b = settlementWalkPosition(100, 50, 3.7 + SETTLEMENT_WALK_LOOP_SEC)
    expect(b.x).toBeCloseTo(a.x, 6)
    expect(b.z).toBeCloseTo(a.z, 6)
    expect(Math.hypot(a.x - 100, a.z - 50)).toBeCloseTo(SETTLEMENT_WALK_RADIUS_M, 6)
  })

  it('yaw is periodic and returns to start after the fast turns', () => {
    expect(settlementWalkYawOffset(0)).toBeCloseTo(0, 6)
    expect(settlementWalkYawOffset(SETTLEMENT_WALK_LOOP_SEC * 2.3)).toBeCloseTo(settlementWalkYawOffset(SETTLEMENT_WALK_LOOP_SEC * 0.3), 6)
  })

  it('contains a fast ~90° turn within ~0.25 s', () => {
    const t0 = SETTLEMENT_WALK_LOOP_SEC * 0.5
    const d = settlementWalkYawOffset(t0 + 0.3) - settlementWalkYawOffset(t0 - 0.01)
    expect(d).toBeGreaterThan(Math.PI / 2 - 0.1)
  })
})
