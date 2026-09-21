import { describe, expect, it } from 'vitest'
import {
  AGENT_PRESENTATION_MID_DISTANCE_M,
  AGENT_PRESENTATION_NEAR_DISTANCE_M,
  resolveAgentPresentationLevel,
} from './agentPresentationLod'

describe('resolveAgentPresentationLevel', () => {
  it('is near at zero distance', () => {
    expect(resolveAgentPresentationLevel({ distance: 0, important: false })).toBe('near')
  })

  it('treats the near boundary as inclusive', () => {
    expect(resolveAgentPresentationLevel({ distance: AGENT_PRESENTATION_NEAR_DISTANCE_M, important: false })).toBe('near')
    expect(resolveAgentPresentationLevel({ distance: AGENT_PRESENTATION_NEAR_DISTANCE_M + 0.01, important: false })).toBe('mid')
  })

  it('treats the mid boundary as inclusive', () => {
    expect(resolveAgentPresentationLevel({ distance: AGENT_PRESENTATION_MID_DISTANCE_M, important: false })).toBe('mid')
    expect(resolveAgentPresentationLevel({ distance: AGENT_PRESENTATION_MID_DISTANCE_M + 0.01, important: false })).toBe('far')
  })

  it('is far well beyond the mid boundary', () => {
    expect(resolveAgentPresentationLevel({ distance: 1000, important: false })).toBe('far')
  })

  it('important forces near at any distance', () => {
    expect(resolveAgentPresentationLevel({ distance: 0, important: true })).toBe('near')
    expect(resolveAgentPresentationLevel({ distance: AGENT_PRESENTATION_MID_DISTANCE_M, important: true })).toBe('near')
    expect(resolveAgentPresentationLevel({ distance: 1000, important: true })).toBe('near')
  })

  it('is deterministic and stateless — same input always yields the same output', () => {
    const input = { distance: 25, important: false }
    const first = resolveAgentPresentationLevel(input)
    const second = resolveAgentPresentationLevel({ ...input })
    expect(first).toBe(second)
    expect(input).toEqual({ distance: 25, important: false })
  })
})
