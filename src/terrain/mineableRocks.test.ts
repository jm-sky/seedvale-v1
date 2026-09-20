import { describe, expect, it } from 'vitest'
import {
  applyMineableRockAction,
  DEPLETED_STAGE_INDEX,
  deserializeMineableRockState,
  effectiveMineableRockKind,
  isMineableRockKind,
  mineableRockPromptLabel,
  type MineableRockRuntimeState,
  type MineableRockWorkOutcome,
  serializeMineableRockState,
} from './mineableRocks'

describe('isMineableRockKind', () => {
  it('accepts only largeRock/rockCluster', () => {
    expect(isMineableRockKind('largeRock')).toBe(true)
    expect(isMineableRockKind('rockCluster')).toBe(true)
    expect(isMineableRockKind('fallenLog')).toBe(false)
    expect(isMineableRockKind('monolith')).toBe(false)
  })
})

describe('effectiveMineableRockKind', () => {
  it('an untouched largeRock stays largeRock', () => {
    expect(effectiveMineableRockKind('largeRock', undefined)).toBe('largeRock')
  })

  it('a largeRock mid-boulder-stage (actions 1-3) still reads as largeRock', () => {
    expect(effectiveMineableRockKind('largeRock', { stageIndex: 0, actionsInStage: 3 })).toBe('largeRock')
  })

  it('a largeRock past action 4 (stage index 1) reads as rockCluster', () => {
    expect(effectiveMineableRockKind('largeRock', { stageIndex: 1, actionsInStage: 0 })).toBe('rockCluster')
    expect(effectiveMineableRockKind('largeRock', { stageIndex: 1, actionsInStage: 2 })).toBe('rockCluster')
  })

  it('a depleted rock (either base kind) reads as depleted', () => {
    expect(effectiveMineableRockKind('largeRock', 'depleted')).toBe('depleted')
    expect(effectiveMineableRockKind('rockCluster', 'depleted')).toBe('depleted')
  })

  it('an ordinary rockCluster never becomes largeRock', () => {
    expect(effectiveMineableRockKind('rockCluster', undefined)).toBe('rockCluster')
    expect(effectiveMineableRockKind('rockCluster', { stageIndex: 0, actionsInStage: 2 })).toBe('rockCluster')
  })
})

describe('mineableRockPromptLabel', () => {
  it('boulder vs pile/cluster prompts', () => {
    expect(mineableRockPromptLabel('largeRock')).toBe('Rozbij skałę')
    expect(mineableRockPromptLabel('rockCluster')).toBe('Rozbij kamienie')
  })
})

describe('applyMineableRockAction', () => {
  it('a large rock requires exactly 4 boulder actions before transitioning to the pile', () => {
    let state: MineableRockRuntimeState | undefined
    for (let i = 0; i < 3; i++) {
      const outcome = applyMineableRockAction('largeRock', state, () => 0)!
      expect(outcome.stageCompleted).toBe(false)
      expect(effectiveMineableRockKind('largeRock', outcome.nextState)).toBe('largeRock')
      state = outcome.nextState
    }
    const fourth = applyMineableRockAction('largeRock', state, () => 0)!
    expect(fourth.stageCompleted).toBe(true)
    expect(effectiveMineableRockKind('largeRock', fourth.nextState)).toBe('rockCluster')
    state = fourth.nextState

    // Pile stage needs 3 more actions.
    for (let i = 0; i < 2; i++) {
      const pileOutcome: MineableRockWorkOutcome = applyMineableRockAction('largeRock', state, () => 0)!
      expect(pileOutcome.depleted).toBe(false)
      state = pileOutcome.nextState
    }
    const final = applyMineableRockAction('largeRock', state, () => 0)!
    expect(final.depleted).toBe(true)
    expect(final.nextState).toBe('depleted')
  })

  it('every large-rock action yields 1-2 stone', () => {
    const min = applyMineableRockAction('largeRock', undefined, () => 0)!
    expect(min.yield).toEqual({ kind: 'stone', amount: 1 })
    const max = applyMineableRockAction('largeRock', undefined, () => 0.999999)!
    expect(max.yield).toEqual({ kind: 'stone', amount: 2 })
  })

  it('an ordinary cluster takes exactly 3 actions and then depletes', () => {
    let state: MineableRockRuntimeState | undefined
    for (let i = 0; i < 2; i++) {
      const outcome = applyMineableRockAction('rockCluster', state, () => 0)!
      expect(outcome.depleted).toBe(false)
      state = outcome.nextState
    }
    const final = applyMineableRockAction('rockCluster', state, () => 0)!
    expect(final.depleted).toBe(true)
    expect(final.nextState).toBe('depleted')
  })

  it('returns null for an already-depleted rock instead of advancing further', () => {
    expect(applyMineableRockAction('rockCluster', 'depleted')).toBeNull()
  })
})

describe('mineable-rock save state round-trip', () => {
  it('round-trips partial progress and the depleted tombstone', () => {
    const state = new Map<string, MineableRockRuntimeState>([
      ['rock:largeRock:0:0:0:a', { stageIndex: 1, actionsInStage: 2 }],
      ['rock:rockCluster:1:1:0:a', 'depleted'],
    ])
    const rows = serializeMineableRockState(state)
    expect(rows).toContainEqual({ id: 'rock:largeRock:0:0:0:a', stageIndex: 1, actionsInStage: 2 })
    expect(rows).toContainEqual({ id: 'rock:rockCluster:1:1:0:a', stageIndex: DEPLETED_STAGE_INDEX, actionsInStage: 0 })

    const restored = deserializeMineableRockState(rows)
    expect(restored.get('rock:largeRock:0:0:0:a')).toEqual({ stageIndex: 1, actionsInStage: 2 })
    expect(restored.get('rock:rockCluster:1:1:0:a')).toBe('depleted')
  })

  it('an untouched rock (no map entry) is not part of the serialized rows', () => {
    expect(serializeMineableRockState(new Map())).toEqual([])
  })
})
