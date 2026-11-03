import { describe, expect, it } from 'vitest'
import { WORLD_HALF_EXTENT } from './continentMask'
import {
  clampToWorldBox,
  isInsideWorldBox,
  WORLD_EDGE_BAND_START,
  WORLD_EDGE_MAX_PUSH_SPEED,
  worldEdgePushVelocity,
} from './worldEdge'

describe('worldEdge', () => {
  it('clamps to the box on both axes', () => {
    expect(clampToWorldBox(WORLD_HALF_EXTENT + 50, -WORLD_HALF_EXTENT - 9)).toEqual({
      x: WORLD_HALF_EXTENT,
      z: -WORLD_HALF_EXTENT,
    })
    expect(clampToWorldBox(10, -20)).toEqual({ x: 10, z: -20 })
  })

  it('reports box membership', () => {
    expect(isInsideWorldBox(0, 0)).toBe(true)
    expect(isInsideWorldBox(WORLD_HALF_EXTENT, 0)).toBe(true)
    expect(isInsideWorldBox(0, -WORLD_HALF_EXTENT - 0.1)).toBe(false)
  })

  it('has no push before the band and ramps towards the origin', () => {
    expect(worldEdgePushVelocity(WORLD_EDGE_BAND_START, 0)).toEqual({ x: 0, z: 0 })
    const mid = worldEdgePushVelocity(WORLD_EDGE_BAND_START + 150, 0)
    expect(mid.x).toBeCloseTo(-WORLD_EDGE_MAX_PUSH_SPEED / 2)
    expect(worldEdgePushVelocity(-WORLD_HALF_EXTENT, 0).x).toBe(WORLD_EDGE_MAX_PUSH_SPEED)
    expect(worldEdgePushVelocity(WORLD_HALF_EXTENT + 100, 0).x).toBe(-WORLD_EDGE_MAX_PUSH_SPEED)
  })

  it('exceeds swim speed at the edge so a swimmer cannot make progress', () => {
    expect(WORLD_EDGE_MAX_PUSH_SPEED).toBeGreaterThan(6)
  })
})
