import { describe, expect, it } from 'vitest'
import {
  anyWithinRadius,
  createShadowBudgetState,
  recordShadowBudgetFrame,
  SHADOW_DIRTY_MAX_STALE_FRAMES,
  SHADOW_DIRTY_PLAYER_EPS_M,
  shouldUpdateShadowMap,
} from './shadowBudget'

describe('shouldUpdateShadowMap', () => {
  it('stays clean when the player has not moved and nothing is nearby', () => {
    const state = createShadowBudgetState(10, 20)
    expect(shouldUpdateShadowMap(state, 10, 20, false)).toBe(false)
  })

  it('goes dirty once the player moves beyond the epsilon', () => {
    const state = createShadowBudgetState(0, 0)
    expect(shouldUpdateShadowMap(state, SHADOW_DIRTY_PLAYER_EPS_M * 0.5, 0, false)).toBe(false)
    expect(shouldUpdateShadowMap(state, SHADOW_DIRTY_PLAYER_EPS_M * 2, 0, false)).toBe(true)
  })

  it('is fail-open: any nearby caster forces dirty regardless of player movement', () => {
    const state = createShadowBudgetState(0, 0)
    expect(shouldUpdateShadowMap(state, 0, 0, true)).toBe(true)
  })

  it('forces a refresh once the stale-frame safety net is reached', () => {
    const state = createShadowBudgetState(0, 0)
    state.framesSinceUpdate = SHADOW_DIRTY_MAX_STALE_FRAMES - 1
    expect(shouldUpdateShadowMap(state, 0, 0, false)).toBe(false)
    state.framesSinceUpdate = SHADOW_DIRTY_MAX_STALE_FRAMES
    expect(shouldUpdateShadowMap(state, 0, 0, false)).toBe(true)
  })
})

describe('recordShadowBudgetFrame', () => {
  it('resets the stale counter and rebaselines position on an update', () => {
    const state = createShadowBudgetState(0, 0)
    state.framesSinceUpdate = 4
    recordShadowBudgetFrame(state, 5, 6, true)
    expect(state).toEqual({ lastPlayerX: 5, lastPlayerZ: 6, framesSinceUpdate: 0 })
  })

  it('increments the stale counter and keeps the baseline on a skipped frame', () => {
    const state = createShadowBudgetState(1, 2)
    recordShadowBudgetFrame(state, 1, 2, false)
    recordShadowBudgetFrame(state, 1, 2, false)
    expect(state).toEqual({ lastPlayerX: 1, lastPlayerZ: 2, framesSinceUpdate: 2 })
  })
})

describe('anyWithinRadius', () => {
  const positionOf = (p: { x: number, z: number }): { x: number, z: number } => p

  it('is false for an empty list', () => {
    expect(anyWithinRadius(0, 0, [], 36, positionOf)).toBe(false)
  })

  it('finds an item inside the radius', () => {
    const items = [{ x: 100, z: 100 }, { x: 5, z: 0 }]
    expect(anyWithinRadius(0, 0, items, 36, positionOf)).toBe(true)
  })

  it('is false when every item is outside the radius', () => {
    const items = [{ x: 100, z: 100 }, { x: -50, z: 0 }]
    expect(anyWithinRadius(0, 0, items, 36, positionOf)).toBe(false)
  })

  it('treats the radius as inclusive', () => {
    expect(anyWithinRadius(0, 0, [{ x: 36, z: 0 }], 36, positionOf)).toBe(true)
  })
})

describe('shouldUpdateShadowMap actor cadence (world-terrain-055 S2)', () => {
  it('refreshes every 2nd frame when only a nearby caster triggers it', () => {
    const state = createShadowBudgetState(0, 0)
    expect(shouldUpdateShadowMap(state, 0, 0, true, true)).toBe(false)
    recordShadowBudgetFrame(state, 0, 0, false)
    expect(shouldUpdateShadowMap(state, 0, 0, true, true)).toBe(true)
    recordShadowBudgetFrame(state, 0, 0, true)
    expect(shouldUpdateShadowMap(state, 0, 0, true, true)).toBe(false)
  })

  it('still refreshes every frame when the frustum centre moved', () => {
    const state = createShadowBudgetState(0, 0)
    expect(shouldUpdateShadowMap(state, SHADOW_DIRTY_PLAYER_EPS_M * 2, 0, true, true)).toBe(true)
  })

  it('does nothing without a caster and keeps the stale cap', () => {
    const state = createShadowBudgetState(0, 0)
    expect(shouldUpdateShadowMap(state, 0, 0, false, true)).toBe(false)
    state.framesSinceUpdate = SHADOW_DIRTY_MAX_STALE_FRAMES
    expect(shouldUpdateShadowMap(state, 0, 0, false, true)).toBe(true)
  })

  it('is unchanged (every frame with a caster) when the flag is off', () => {
    const state = createShadowBudgetState(0, 0)
    expect(shouldUpdateShadowMap(state, 0, 0, true)).toBe(true)
  })
})


describe('decideShadowUpdate reasons (world-terrain-056 S0)', () => {
  it('reports the trigger and agrees with shouldUpdateShadowMap', async () => {
    const m = await import('./shadowBudget')
    const s = m.createShadowBudgetState(0, 0)
    expect(m.decideShadowUpdate(s, 0, 0, false)).toBe('none')
    expect(m.decideShadowUpdate(s, 1, 0, false)).toBe('move')
    expect(m.decideShadowUpdate(s, 0, 0, true)).toBe('actor')
    s.framesSinceUpdate = 0
    expect(m.decideShadowUpdate(s, 0, 0, true, true)).toBe('none')
    s.framesSinceUpdate = 1
    expect(m.decideShadowUpdate(s, 0, 0, true, true)).toBe('actor')
    s.framesSinceUpdate = m.SHADOW_DIRTY_MAX_STALE_FRAMES
    expect(m.decideShadowUpdate(s, 0, 0, false)).toBe('stale')
    for (const [x, near, half] of [[0, false, false], [1, false, true], [0, true, true], [0, true, false]] as const) {
      expect(m.shouldUpdateShadowMap(s, x, 0, near, half)).toBe(m.decideShadowUpdate(s, x, 0, near, half) !== 'none')
    }
  })
})

describe('shadow motion cadence (world-terrain-056 S1)', () => {
  const D2R = Math.PI / 180
  it('alternates while walking at 60 FPS', async () => {
    const m = await import('./shadowBudget')
    const s = m.createShadowBudgetState(0, 0)
    let x = 0
    let t = 1000
    let refreshes = 0
    for (let f = 0; f < 20; f++) {
      x += 0.05 // 3 m/s at 60 FPS
      t += 16.7
      const mo = { yaw: 0, nowMs: t }
      const up = m.decideShadowUpdate(s, x, 0, false, false, mo) !== 'none'
      if (up) refreshes++
      m.recordShadowBudgetFrame(s, x, 0, up, mo)
    }
    expect(refreshes).toBeGreaterThanOrEqual(9)
    expect(refreshes).toBeLessThanOrEqual(11)
  })
  it('escapes: fast yaw, teleport, max-ms (low FPS)', async () => {
    const m = await import('./shadowBudget')
    const mk = () => {
      const s = m.createShadowBudgetState(0, 0)
      s.lastUpdateMs = 1000
      s.lastYaw = 0
      return s
    }
    const alt = { yaw: 0, nowMs: 1016 }
    expect(m.decideShadowUpdate(mk(), 0.1, 0, false, false, alt)).toBe('none')
    expect(m.decideShadowUpdate(mk(), 0.1, 0, false, false, { yaw: 13 * D2R, nowMs: 1016 })).toBe('move')
    expect(m.decideShadowUpdate(mk(), 30, 0, false, false, alt)).toBe('move')
    for (const frameMs of [50, 28, 16.7]) {
      const r = m.decideShadowUpdate(mk(), 0.1, 0, false, false, { yaw: 0, nowMs: 1000 + frameMs })
      expect(r).toBe(frameMs > m.SHADOW_MOTION_MS_MAX ? 'move' : 'none')
    }
    expect(m.decideShadowUpdate(mk(), 0.1, 0, false, false, { yaw: 0, nowMs: 1000 + 70 })).toBe('move')
  })
  it('flag off / stationary behave as before', async () => {
    const m = await import('./shadowBudget')
    const s = m.createShadowBudgetState(0, 0)
    expect(m.decideShadowUpdate(s, 0.1, 0, false)).toBe('move')
    expect(m.decideShadowUpdate(s, 0, 0, false, false, { yaw: 0, nowMs: 5 })).toBe('none')
    expect(m.decideShadowUpdate(s, 0, 0, true, false, { yaw: 0, nowMs: 5 })).toBe('actor')
  })
})
