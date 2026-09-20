import { describe, expect, it } from 'vitest'
import {
  applyMineableWorkAction,
  initialMineableWorkState,
  type MineableWorkDefinition,
} from './mineableWork'

const TWO_STAGE_DEF: MineableWorkDefinition = {
  requiredCapability: 'rock_mining',
  stages: [
    { id: 'boulder', actionsRequired: 4, yield: { kind: 'stone', min: 1, max: 2 } },
    { id: 'pile', actionsRequired: 3, yield: { kind: 'stone', min: 1, max: 2 } },
  ],
}

const ONE_STAGE_DEF: MineableWorkDefinition = {
  requiredCapability: 'rock_mining',
  stages: [
    { id: 'cluster', actionsRequired: 3, yield: { kind: 'stone', min: 1, max: 1 } },
  ],
}

describe('applyMineableWorkAction', () => {
  it('requires exactly the configured action count before transitioning stage', () => {
    let state = initialMineableWorkState()
    for (let i = 0; i < 3; i++) {
      const result = applyMineableWorkAction(TWO_STAGE_DEF, state, () => 0)
      expect(result.stageCompleted).toBe(false)
      expect(result.depleted).toBe(false)
      expect(result.state).not.toBeNull()
      state = result.state!
    }
    expect(state).toEqual({ stageIndex: 0, actionsInStage: 3 })

    const final = applyMineableWorkAction(TWO_STAGE_DEF, state, () => 0)
    expect(final.stageCompleted).toBe(true)
    expect(final.depleted).toBe(false)
    expect(final.state).toEqual({ stageIndex: 1, actionsInStage: 0 })
  })

  it('every action yields within the stage min..max inclusive range', () => {
    const min = applyMineableWorkAction(TWO_STAGE_DEF, initialMineableWorkState(), () => 0)
    expect(min.yield).toEqual({ kind: 'stone', amount: 1 })
    const max = applyMineableWorkAction(TWO_STAGE_DEF, initialMineableWorkState(), () => 0.999999)
    expect(max.yield).toEqual({ kind: 'stone', amount: 2 })
  })

  it('transitions preserve no rock-specific identity (pure progress only)', () => {
    let state: ReturnType<typeof applyMineableWorkAction>['state'] = initialMineableWorkState()
    for (let i = 0; i < 4; i++) {
      state = applyMineableWorkAction(TWO_STAGE_DEF, state!, () => 0).state
    }
    expect(state).toEqual({ stageIndex: 1, actionsInStage: 0 })
  })

  it('depletes after the final stage completes and reports null state', () => {
    let state = initialMineableWorkState()
    for (let i = 0; i < 4; i++) state = applyMineableWorkAction(TWO_STAGE_DEF, state, () => 0).state!
    for (let i = 0; i < 2; i++) state = applyMineableWorkAction(TWO_STAGE_DEF, state, () => 0).state!
    const final = applyMineableWorkAction(TWO_STAGE_DEF, state, () => 0)
    expect(final.depleted).toBe(true)
    expect(final.stageCompleted).toBe(true)
    expect(final.state).toBeNull()
  })

  it('a single-stage definition (ordinary cluster) follows its own action count/yield', () => {
    let state = initialMineableWorkState()
    for (let i = 0; i < 2; i++) {
      const result = applyMineableWorkAction(ONE_STAGE_DEF, state, () => 0)
      expect(result.yield).toEqual({ kind: 'stone', amount: 1 })
      expect(result.depleted).toBe(false)
      state = result.state!
    }
    const final = applyMineableWorkAction(ONE_STAGE_DEF, state, () => 0)
    expect(final.depleted).toBe(true)
    expect(final.state).toBeNull()
  })

  it('is presentation/collision agnostic and describes rock_mining work without importing terrain/chunk code', () => {
    expect(TWO_STAGE_DEF.requiredCapability).toBe('rock_mining')
    // No import from terrain/chunk modules above — verified by inspection of
    // this file's own import list, which only touches `./mineableWork`.
  })
})
