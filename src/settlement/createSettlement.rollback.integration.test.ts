// @vitest-environment jsdom
import { Scene } from 'three'
import { describe, expect, it, vi } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { TerrainSamplers } from './settlementTerrain'
import { createSettlementsManager } from './SettlementsManager'

vi.mock('./livestock', async (importOriginal) => {
  const original = await importOriginal<typeof import('./livestock')>()
  return {
    ...original,
    spawnLivestock: vi.fn(async () => { throw new Error('injected livestock failure') }),
  }
})

const samplers: TerrainSamplers = {
  sampleContinentalness: () => 0.55,
  sampleMountainRidge: () => 0.05,
  sampleMoistureRegion: () => 0.45,
}
const region = {
  coastThreshold: 0.45,
  desertThreshold: 0.35,
  desertThresholdWidth: 0.12,
  swampThreshold: 0.72,
  swampThresholdWidth: 0.15,
  village: {
    coreRadius: 9,
    houseRadius: 4.5,
    heightStrength: 0.8,
    tintStrength: 0.75,
    regionalHeightStrengthFlat: 0.3,
    regionalHeightStrengthMountain: 0.15,
  },
  roadNetwork: { dockSearchRadius: 140 },
} as RegionParams

describe('createSettlement rollback (real factory, injected failure after attachment)', () => {
  it('releases the group, colliders and light registration when a later phase rejects', async () => {
    const scene = new Scene()
    const registerColliders = vi.fn()
    const clearColliders = vi.fn()
    const registerSubtree = vi.fn()
    const unregisterSubtree = vi.fn()
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const args: unknown[] = new Array(63).fill(undefined)
    args[0] = scene
    args[1] = () => 12
    args[2] = 0
    args[3] = () => ({ depth: 0, flowX: 0, flowZ: 0, kind: 'none' })
    args[4] = 56
    args[5] = 1337
    args[6] = () => {}
    args[7] = 300
    args[8] = 420
    args[9] = samplers
    args[10] = 1
    args[11] = region
    args[12] = () => Promise.resolve()
    args[13] = 32
    args[14] = () => []
    args[15] = registerColliders
    args[16] = clearColliders
    args[24] = {
      registerSubtree,
      unregisterSubtree,
      register: () => {},
      unregister: () => {},
      update: () => {},
    }
    const manager = await (createSettlementsManager as (...a: unknown[]) => ReturnType<typeof createSettlementsManager>)(...args)
    await expect(manager.homeReady).rejects.toThrow('injected livestock failure')

    // Home and both eager neighbors hit the same injected failure; each one
    // that attached must have been released exactly once.
    await new Promise((resolve) => setTimeout(resolve, 200))
    const registered = registerColliders.mock.calls.map((c) => c[0] as string)
    const cleared = clearColliders.mock.calls.map((c) => c[0] as string)
    expect(registered.length).toBeGreaterThan(0)
    expect(new Set(cleared)).toEqual(new Set(registered))
    expect(cleared).toHaveLength(new Set(cleared).size)
    expect(registerSubtree.mock.calls.length).toBeGreaterThan(0)
    expect(unregisterSubtree).toHaveBeenCalledTimes(registerSubtree.mock.calls.length)
    for (const [group] of registerSubtree.mock.calls) {
      expect(unregisterSubtree.mock.calls.map((c) => c[0])).toContain(group)
    }
    const settlementGroups = scene.children.filter((c) => c.type === 'Group')
    expect(settlementGroups).toHaveLength(0)
    manager.dispose()
    errors.mockRestore()
  }, 30000)
})
