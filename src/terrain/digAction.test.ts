import { describe, expect, it, vi } from 'vitest'
import type { ChunkManager } from './chunkManager'
import type { DigFeedback } from './digAction'
import { STONE_CHANCE_SAND } from './dig'
import { applyDigAt } from './digAction'

const WATER_LEVEL = 2
const OCEAN_REGION = { oceanThreshold: 0.32, coastThreshold: 0.45 }

function fakeChunkManager(overrides: Partial<ChunkManager> = {}): ChunkManager {
  return {
    modifyTerrain: vi.fn(),
    sampleHeight: () => WATER_LEVEL + 2,
    sampleContinentalness: () => 0.7,
    waterLevel: WATER_LEVEL,
    region: OCEAN_REGION,
    ...overrides,
  } as unknown as ChunkManager
}

function fakeFeedback(overrides: Partial<DigFeedback> = {}): DigFeedback {
  return {
    inventory: {
      canAdd: () => true,
      add: vi.fn(),
      count: () => 1,
      totalWeight: () => 0,
      maxWeight: 100,
    },
    droppedItems: { settleNear: vi.fn(), drop: vi.fn() },
    toast: { show: vi.fn() },
    hud: { setInventoryWeight: vi.fn() },
    playOnce: vi.fn(),
    showCountAcquisition: vi.fn(),
    ...overrides,
  } as unknown as DigFeedback
}

describe('applyDigAt — stone behavior (regression)', () => {
  it('ordinary soil digging is unaffected by the shell roll (never eligible)', () => {
    const chunkManager = fakeChunkManager()
    const feedback = fakeFeedback()
    applyDigAt(chunkManager, 0, 0, { depth: 0.28, stoneChance: 0.45, surface: 'soil' }, feedback, () => 0.99)
    expect(feedback.droppedItems.drop).not.toHaveBeenCalled()
    expect(feedback.inventory.add).not.toHaveBeenCalled()
  })

  it('ordinary (non-coastal) sand keeps its existing stone chance and never rolls a shell', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.7 })
    const feedback = fakeFeedback()
    const rolls = [0, 0, 0.99] // stone: hit + noticed; shell: eligibility check never even reads this
    applyDigAt(chunkManager, 0, 0, { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }, feedback, () => rolls.shift()!)
    expect(feedback.inventory.add).toHaveBeenCalledWith('stone', 1)
    expect(feedback.inventory.add).not.toHaveBeenCalledWith('shell', expect.anything())
  })
})

describe('applyDigAt — independent shell find (plan world-terrain-047)', () => {
  it('eligible coastal sand can add a shell alongside a stone in one dig', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.4, sampleHeight: () => WATER_LEVEL + 0.2 })
    const feedback = fakeFeedback()
    // stone roll: hit (0) + noticed (below STONE_NOTICE_CHANCE); shell roll: hit (0)
    const rolls = [0, 0, 0]
    applyDigAt(chunkManager, 0, 0, { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }, feedback, () => rolls.shift()!)
    expect(feedback.inventory.add).toHaveBeenCalledWith('stone', 1)
    expect(feedback.inventory.add).toHaveBeenCalledWith('shell', 1)
  })

  it('a missed shell roll adds nothing extra', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.4, sampleHeight: () => WATER_LEVEL + 0.2 })
    const feedback = fakeFeedback()
    const rolls = [0.99, 0.99] // stone: miss; shell: miss
    applyDigAt(chunkManager, 0, 0, { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }, feedback, () => rolls.shift()!)
    expect(feedback.inventory.add).not.toHaveBeenCalled()
    expect(feedback.droppedItems.drop).not.toHaveBeenCalled()
  })

  it('drops the shell beside the dig when inventory is full', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.4, sampleHeight: () => WATER_LEVEL + 0.2 })
    const feedback = fakeFeedback({
      inventory: { canAdd: () => false, add: vi.fn(), count: () => 0, totalWeight: () => 0, maxWeight: 100 } as unknown as DigFeedback['inventory'],
    })
    // stone: miss (canAdd-false path never reached since the stone chance
    // already missed); shell: hit but full, then the drop-angle roll.
    const rolls = [0.99, 0, 0.5]
    applyDigAt(chunkManager, 5, 7, { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }, feedback, () => rolls.shift()!)
    expect(feedback.droppedItems.drop).toHaveBeenCalledWith('shell', expect.any(Number), expect.any(Number))
  })

  it('shallow coastal water eligible for digging is also eligible for the shell roll', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.4, sampleHeight: () => WATER_LEVEL - 0.2 })
    const feedback = fakeFeedback()
    const rolls = [0.99, 0] // stone miss, shell hit
    applyDigAt(chunkManager, 0, 0, { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }, feedback, () => rolls.shift()!)
    expect(feedback.inventory.add).toHaveBeenCalledWith('shell', 1)
  })

  it('inland shallow water sand never rolls a shell', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.7, sampleHeight: () => WATER_LEVEL - 0.2 })
    const feedback = fakeFeedback()
    const rolls = [0.99, 0] // if the shell roll ran, this 0 would hit — it must never run
    applyDigAt(chunkManager, 0, 0, { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' }, feedback, () => rolls.shift()!)
    expect(feedback.inventory.add).not.toHaveBeenCalledWith('shell', expect.anything())
  })
})

describe('applyDigAt — contextual special find (plan world-terrain-048)', () => {
  it('grants at most one contextual special alongside an ordinary shell', () => {
    const chunkManager = fakeChunkManager({ sampleContinentalness: () => 0.4, sampleHeight: () => WATER_LEVEL + 0.2 })
    const feedback = fakeFeedback()
    const rolls = [0.99, 0, 0]
    applyDigAt(
      chunkManager,
      0,
      0,
      { depth: 0.14, stoneChance: STONE_CHANCE_SAND, surface: 'sand' },
      feedback,
      () => rolls.shift()!,
      { coastal: true, settlement: false, swamp: false, forest: false },
    )
    expect(feedback.inventory.add).toHaveBeenCalledWith('shell', 1)
    expect(feedback.inventory.add).toHaveBeenCalledWith('exceptional_shell', 1)
    expect(feedback.inventory.add).toHaveBeenCalledTimes(2)
  })

  it('drops the contextual find when inventory is full', () => {
    const chunkManager = fakeChunkManager()
    const feedback = fakeFeedback({
      inventory: {
        canAdd: (kind: string) => kind !== 'amber',
        add: vi.fn(),
        count: () => 0,
        totalWeight: () => 0,
        maxWeight: 100,
      } as unknown as DigFeedback['inventory'],
    })
    const rolls = [0.99, 0]
    applyDigAt(
      chunkManager,
      1,
      2,
      { depth: 0.28, stoneChance: 0.45, surface: 'soil' },
      feedback,
      () => rolls.shift()!,
      { coastal: false, settlement: false, swamp: false, forest: true },
    )
    expect(feedback.droppedItems.drop).toHaveBeenCalledWith('amber', expect.any(Number), expect.any(Number))
  })
})
