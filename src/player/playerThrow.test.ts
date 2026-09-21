import { describe, expect, it } from 'vitest'
import { createPlayerThrow } from './playerThrow'

describe('createPlayerThrow (plan items-player-059 §17)', () => {
  it('starts unarmed', () => {
    expect(createPlayerThrow().armedKind()).toBeNull()
  })

  it('arms the requested kind', () => {
    const playerThrow = createPlayerThrow()
    playerThrow.arm('stone')
    expect(playerThrow.armedKind()).toBe('stone')
  })

  it('clears back to unarmed', () => {
    const playerThrow = createPlayerThrow()
    playerThrow.arm('stone')
    playerThrow.clear()
    expect(playerThrow.armedKind()).toBeNull()
  })

  it('re-arming replaces the previously armed kind', () => {
    const playerThrow = createPlayerThrow()
    playerThrow.arm('stone')
    playerThrow.arm('stone')
    expect(playerThrow.armedKind()).toBe('stone')
  })
})
