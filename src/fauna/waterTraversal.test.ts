import { describe, expect, it } from 'vitest'
import {
  autonomousDestinationAccepts,
  classifyWaterTraversal,
  evaluateWaterRouteFeasibility,
  isDispreferredSwim,
  predictSwimStaminaCost,
  shouldApplyDrowningDamage,
  SWIM_PREFER_DRY_CELL_COST,
  SWIM_SAFETY_RESERVE_RATIO,
  swimStaminaExertion,
  wadeDepthFor,
  type WaterRouteSample,
  waterTraversalCellCost,
} from './waterTraversal'

describe('classifyWaterTraversal (plan fauna-015)', () => {
  it('classifies zero/negative depth as dry', () => {
    expect(classifyWaterTraversal(0, 1, undefined)).toBe('dry')
    expect(classifyWaterTraversal(-0.1, 1, undefined)).toBe('dry')
  })

  it('classifies shallow depth (within the scale-derived wading depth) as wading', () => {
    const scale = 1
    const shallow = wadeDepthFor(scale) - 0.05
    expect(classifyWaterTraversal(shallow, scale, undefined)).toBe('wading')
  })

  it('classifies depth beyond the wading threshold as swimming for a default (unconfigured) species', () => {
    const scale = 1
    const deep = wadeDepthFor(scale) + 0.5
    expect(classifyWaterTraversal(deep, scale, undefined)).toBe('swimming')
  })

  it('a larger scale wades deeper before swimming is required', () => {
    const depth = 0.6
    expect(classifyWaterTraversal(depth, 0.4, undefined)).toBe('swimming')
    expect(classifyWaterTraversal(depth, 1.5, undefined)).toBe('wading')
  })

  it('a species without safe swimming cannot enter water deeper than its wading depth', () => {
    const scale = 1
    const deep = wadeDepthFor(scale) + 0.5
    expect(classifyWaterTraversal(deep, scale, { canSwim: false })).toBeNull()
  })

  it('a species without safe swimming can still wade shallow water', () => {
    const scale = 1
    const shallow = wadeDepthFor(scale) - 0.05
    expect(classifyWaterTraversal(shallow, scale, { canSwim: false })).toBe('wading')
  })

  it('waterAdapted (duck) still swims normally in deep water — the capability only affects stamina cost', () => {
    const scale = 0.4
    const deep = wadeDepthFor(scale) + 0.2
    expect(classifyWaterTraversal(deep, scale, { waterAdapted: true })).toBe('swimming')
  })
})

describe('swimStaminaExertion (plan fauna-015 §5/§6)', () => {
  it('defaults to the generic (sprint-equivalent) exertion when unconfigured', () => {
    expect(swimStaminaExertion(undefined)).toBe(1)
  })

  it('is much lower for a waterAdapted species (duck) than the generic default', () => {
    expect(swimStaminaExertion({ waterAdapted: true })).toBeLessThan(swimStaminaExertion(undefined))
  })
})

describe('shouldApplyDrowningDamage (plan fauna-015 §7)', () => {
  it('zero stamina on dry land does not drown', () => {
    expect(shouldApplyDrowningDamage('dry', true)).toBe(false)
  })

  it('zero stamina while wading does not drown', () => {
    expect(shouldApplyDrowningDamage('wading', true)).toBe(false)
  })

  it('zero stamina while swimming drowns', () => {
    expect(shouldApplyDrowningDamage('swimming', true)).toBe(true)
  })

  it('swimming with stamina remaining does not drown', () => {
    expect(shouldApplyDrowningDamage('swimming', false)).toBe(false)
  })

  it('leaving swimming for wading/dry stops drowning immediately, even still exhausted', () => {
    expect(shouldApplyDrowningDamage('wading', true)).toBe(false)
    expect(shouldApplyDrowningDamage('dry', true)).toBe(false)
  })
})

describe('autonomous water route preference (plan fauna-029)', () => {
  it('lets a land animal pick dry and wading destinations, not swimming', () => {
    expect(autonomousDestinationAccepts('dry', undefined)).toBe(true)
    expect(autonomousDestinationAccepts('wading', undefined)).toBe(true)
    expect(autonomousDestinationAccepts('swimming', undefined)).toBe(false)
    expect(autonomousDestinationAccepts(null, undefined)).toBe(false)
  })

  it('still classifies deep water as physically swimmable for a default land animal', () => {
    const deep = wadeDepthFor(1) + 0.5
    expect(classifyWaterTraversal(deep, 1, undefined)).toBe('swimming')
  })

  it('charges swimming under preferDry but not under allowSwim', () => {
    expect(waterTraversalCellCost('swimming', undefined, 'preferDry')).toBe(SWIM_PREFER_DRY_CELL_COST)
    expect(waterTraversalCellCost('swimming', undefined, 'allowSwim')).toBe(1)
    expect(waterTraversalCellCost('wading', undefined, 'preferDry')).toBe(1)
    expect(isDispreferredSwim('swimming', undefined, 'preferDry')).toBe(true)
    expect(isDispreferredSwim('swimming', undefined, 'allowSwim')).toBe(false)
  })

  it('treats waterAdapted swimming as ordinary locomotion for dest and cost', () => {
    expect(autonomousDestinationAccepts('swimming', { waterAdapted: true })).toBe(true)
    expect(waterTraversalCellCost('swimming', { waterAdapted: true }, 'preferDry')).toBe(1)
    expect(isDispreferredSwim('swimming', { waterAdapted: true }, 'preferDry')).toBe(false)
  })
})

describe('predictSwimStaminaCost (plan fauna-046 §1)', () => {
  it('scales with swim time (distance / speed) times drain rate times exertion', () => {
    expect(predictSwimStaminaCost(10, 2, 0.18, 1)).toBeCloseTo(5 * 0.18 * 1, 5)
  })

  it('is zero for a non-positive distance', () => {
    expect(predictSwimStaminaCost(0, 2, 0.18, 1)).toBe(0)
    expect(predictSwimStaminaCost(-1, 2, 0.18, 1)).toBe(0)
  })

  it('guards near-zero/zero speed as Infinity for a real distance, never NaN', () => {
    expect(predictSwimStaminaCost(5, 0, 0.18, 1)).toBe(Infinity)
    expect(Number.isNaN(predictSwimStaminaCost(5, 0, 0.18, 1))).toBe(false)
  })
})

describe('evaluateWaterRouteFeasibility (plan fauna-046 §2)', () => {
  const drainRate = 0.18
  const speed = 3

  function swim(distance: number): WaterRouteSample {
    return { stepDistance: distance, mode: 'swimming' }
  }
  function dry(distance = 1): WaterRouteSample {
    return { stepDistance: distance, mode: 'dry' }
  }

  it('a route with no swimming is always safe', () => {
    const result = evaluateWaterRouteFeasibility([dry(5), dry(5)], undefined, 1, 1, speed, drainRate)
    expect(result.safe).toBe(true)
    expect(result.reason).toBe('no-swim')
    expect(result.totalSwimDistance).toBe(0)
  })

  it('dry -> short swim -> dry is safe with full stamina', () => {
    const result = evaluateWaterRouteFeasibility([dry(3), swim(4), dry(3)], undefined, 1, 1, speed, drainRate)
    expect(result.safe).toBe(true)
    expect(result.maxContinuousSwimDistance).toBe(4)
  })

  it('the same crossing is unsafe with low stamina', () => {
    const result = evaluateWaterRouteFeasibility([dry(3), swim(4), dry(3)], undefined, 0.15, 1, speed, drainRate)
    expect(result.safe).toBe(false)
    expect(result.reason).toBe('unsafe-distance')
  })

  it('a higher staminaDrainRate shortens the safe range for the same crossing', () => {
    const samples = [dry(3), swim(2), dry(3)]
    const normal = evaluateWaterRouteFeasibility(samples, undefined, 0.5, 1, speed, drainRate)
    const higherDrain = evaluateWaterRouteFeasibility(samples, undefined, 0.5, 1, speed, drainRate * 3)
    expect(normal.safe).toBe(true)
    expect(higherDrain.safe).toBe(false)
  })

  it('waterAdapted gets a much larger safe range through its lower exertion', () => {
    const samples = [dry(3), swim(20), dry(3)]
    const landAnimal = evaluateWaterRouteFeasibility(samples, undefined, 0.5, 1, speed, drainRate)
    const duck = evaluateWaterRouteFeasibility(samples, { waterAdapted: true }, 0.5, 1, speed, drainRate)
    expect(landAnimal.safe).toBe(false)
    expect(duck.safe).toBe(true)
  })

  it('keeps the configured safety reserve — an exact zero-at-exit budget only passes without one', () => {
    const staminaCapacity = 1
    const cost = predictSwimStaminaCost(5, speed, drainRate, 1)
    const samples = [swim(5), dry(1)]
    const noReserve = evaluateWaterRouteFeasibility(samples, undefined, cost, staminaCapacity, speed, drainRate, 0)
    expect(noReserve.safe).toBe(true)
    const withReserve = evaluateWaterRouteFeasibility(
      samples, undefined, cost, staminaCapacity, speed, drainRate, SWIM_SAFETY_RESERVE_RATIO,
    )
    expect(withReserve.safe).toBe(false)
  })

  it('zero/near-zero stamina never approves an ordinary crossing', () => {
    const result = evaluateWaterRouteFeasibility([swim(0.5)], undefined, 0.001, 1, speed, drainRate)
    expect(result.safe).toBe(false)
  })

  it('a long continuous crossing (ocean) is unsafe even at full stamina', () => {
    const result = evaluateWaterRouteFeasibility([swim(400)], undefined, 1, 1, speed, drainRate)
    expect(result.safe).toBe(false)
    expect(result.maxContinuousSwimDistance).toBe(400)
  })

  it('several short segments separated by dry/wading are not treated as one continuous swim', () => {
    const samples = [swim(3), dry(1), swim(3), { stepDistance: 1, mode: 'wading' } as WaterRouteSample, swim(3)]
    const result = evaluateWaterRouteFeasibility(samples, undefined, 1, 1, speed, drainRate)
    expect(result.maxContinuousSwimDistance).toBe(3)
    expect(result.totalSwimDistance).toBe(9)
  })

  it('a route ending in swimming has no confirmed exit and is unsafe for a non-waterAdapted species', () => {
    const result = evaluateWaterRouteFeasibility([dry(3), swim(2)], undefined, 1, 1, speed, drainRate)
    expect(result.safe).toBe(false)
    expect(result.reason).toBe('no-safe-exit')
  })

  it('a route ending in swimming is fine for a waterAdapted species', () => {
    const result = evaluateWaterRouteFeasibility([dry(3), swim(2)], { waterAdapted: true }, 1, 1, speed, drainRate)
    expect(result.safe).toBe(true)
  })
})
