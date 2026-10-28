// @vitest-environment jsdom
import { Scene } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { Settlement } from './createSettlement'
import type { TerrainSamplers } from './settlementTerrain'
import { clearSettlementDefCache } from './settlementPlanCache'
import { createSettlementsManager } from './SettlementsManager'

type Deferred = {
  id: string
  fake: ReturnType<typeof fakeSettlement>
  resolve: () => void
  reject: (err: Error) => void
}

const factoryCalls: Deferred[] = []

vi.mock('./createSettlement', async (importOriginal) => {
  const original = await importOriginal<typeof import('./createSettlement')>()
  return {
    ...original,
    createSettlement: vi.fn((def: { id: string }) => new Promise<Settlement>((resolve, reject) => {
      const fake = fakeSettlement(def.id)
      factoryCalls.push({
        id: def.id,
        fake,
        resolve: () => resolve(fake as unknown as Settlement),
        reject,
      })
    })),
  }
})

function fakeSettlement(id: string) {
  return {
    id,
    npcs: [] as { id: string, commitDetailedTravelOwnership: ReturnType<typeof vi.fn> }[],
    livestock: [],
    rats: [],
    households: [],
    dispose: vi.fn(),
    setDayNight: vi.fn(),
    update: vi.fn(),
    tickFire: vi.fn(),
  }
}

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

const flush = async (): Promise<void> => {
  for (let i = 0; i < 20; i++) await Promise.resolve()
}

async function makeManager(onAvailable?: (s: { id: string }) => void) {
  const args: unknown[] = new Array(63).fill(undefined)
  args[0] = new Scene()
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
  args[15] = () => {}
  args[16] = () => {}
  args[57] = onAvailable
  return (createSettlementsManager as (...a: unknown[]) => ReturnType<typeof createSettlementsManager>)(...args)
}

function tick(manager: Awaited<ReturnType<typeof makeManager>>, x: number, z: number): void {
  ;(manager.update as (...a: unknown[]) => void)(
    0.016, { x, y: 0, z }, 0, 0.5, 1, [], [], 480, [], () => {}, 1, undefined, undefined, [], undefined, [], undefined,
  )
}

afterEach(() => {
  factoryCalls.length = 0
  clearSettlementDefCache()
})

describe('SettlementsManager streaming lifecycle (settlements-023)', () => {
  it('builds home and eager neighbors through the factory', async () => {
    const manager = await makeManager()
    await flush()
    expect(factoryCalls.length).toBeGreaterThanOrEqual(1)
    manager.dispose()
  })

  it('discards a speculative neighbor build completed after a teleport, without notification', async () => {
    const available = vi.fn()
    const manager = await makeManager(available)
    await flush()
    tick(manager, 5000, 5000)
    for (const call of factoryCalls) call.resolve()
    await flush()
    const discarded = factoryCalls.filter((c) => c.fake.dispose.mock.calls.length > 0)
    expect(discarded.length).toBeGreaterThan(0)
    for (const call of discarded) {
      expect(call.fake.dispose).toHaveBeenCalledTimes(1)
      expect(available.mock.calls.map((c) => (c[0] as { id: string }).id)).not.toContain(call.id)
    }
    manager.dispose()
  })

  it('keeps eager neighbors while the player stays at home and notifies once per accepted build', async () => {
    const available = vi.fn()
    const manager = await makeManager(available)
    await flush()
    tick(manager, 0, 0)
    for (const call of factoryCalls) call.resolve()
    await flush()
    const ids = available.mock.calls.map((c) => (c[0] as { id: string }).id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.length).toBe(factoryCalls.length)
    for (const call of factoryCalls) expect(call.fake.dispose).not.toHaveBeenCalled()
    manager.dispose()
  })

  it('disposes a completed build when the manager is disposed during construction', async () => {
    const manager = await makeManager()
    await flush()
    tick(manager, 0, 0)
    manager.dispose()
    for (const call of factoryCalls) call.resolve()
    await flush()
    for (const call of factoryCalls) expect(call.fake.dispose).toHaveBeenCalledTimes(1)
  })

  it('a factory rejection neither notifies nor leaves the manager unusable', async () => {
    const available = vi.fn()
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const manager = await makeManager(available)
    await flush()
    tick(manager, 0, 0)
    const [first, ...rest] = factoryCalls
    first!.reject(new Error('boom'))
    for (const call of rest) call.resolve()
    await flush()
    expect(available.mock.calls.map((c) => (c[0] as { id: string }).id)).not.toContain(first!.id)
    expect(() => tick(manager, 10, 10)).not.toThrow()
    errors.mockRestore()
    manager.dispose()
  })

  it('keeps an accepted settlement when onSettlementAvailable throws', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const available = vi.fn(() => { throw new Error('listener') })
    const manager = await makeManager(available)
    await flush()
    tick(manager, 0, 0)
    for (const call of factoryCalls) call.resolve()
    await flush()
    for (const call of factoryCalls) expect(call.fake.dispose).not.toHaveBeenCalled()
    expect(available).toHaveBeenCalledTimes(factoryCalls.length)
    manager.dispose()
    for (const call of factoryCalls) expect(call.fake.dispose).toHaveBeenCalledTimes(1)
    errors.mockRestore()
  })
})
