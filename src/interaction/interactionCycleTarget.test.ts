import { describe, expect, it } from 'vitest'
import {
  advanceCycleCommittedKey,
  cycleHintPosition,
  resolveCycleCommittedTarget,
} from './interactionCycleTarget'

type Entry = { id: string }

const key = (entry: Entry) => entry.id

describe('interactionCycleTarget (plan ui-input-028)', () => {
  const a: Entry = { id: 'a' }
  const b: Entry = { id: 'b' }
  const c: Entry = { id: 'c' }

  it('keeps the committed target when another candidate disappears or reorders', () => {
    expect(resolveCycleCommittedTarget([b, c], 'b', key)).toBe(b)
    expect(resolveCycleCommittedTarget([c, b], 'b', key)).toBe(b)
  })

  it('clears resolution when the committed candidate is gone', () => {
    expect(resolveCycleCommittedTarget([a, c], 'b', key)).toBeNull()
  })

  it('keeps the committed target when a new candidate sorts ahead of it', () => {
    expect(resolveCycleCommittedTarget([a, b, c], 'b', key)).toBe(b)
  })

  it('advances Tab from the committed target current position', () => {
    expect(advanceCycleCommittedKey([a, b, c], 'b', key)).toBe('c')
    expect(advanceCycleCommittedKey([c, b, a], 'b', key)).toBe('a')
  })

  it('starts from the first ranked candidate when nothing is committed', () => {
    expect(advanceCycleCommittedKey([a, b], null, key)).toBe('a')
  })

  it('derives cycle hint position from the resolved target, not a stale index', () => {
    expect(cycleHintPosition([c, b, a], b, key)).toEqual({ position: 2, total: 3 })
    expect(cycleHintPosition([a, b], a, key)).toEqual({ position: 1, total: 2 })
  })
})
