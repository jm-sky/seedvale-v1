import { describe, expect, it } from 'vitest'
import { browserState } from './state'

describe('browserState defaults', () => {
  it('opens on Player (UBC Peasant) with idle pose so clips play', () => {
    expect(browserState.referenceId).toBe('character:ubc-peasant')
    expect(browserState.pose).toBe('idle')
  })
})
