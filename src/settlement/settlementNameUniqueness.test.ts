import { afterEach, describe, expect, it } from 'vitest'
import type { RegionParams } from '../terrain/chunkHeightmap'
import type { SettlementResolveContext } from './settlementPlanCache'
import type { TerrainSamplers } from './settlementTerrain'
import { agreeAdjective, generateSettlementBaseName, type SettlementBaseName, settlementOrdinalName } from '../shared/SettlementName'
import {
  cellsWithinRadius,
  settlementBaseNameFor,
  type SettlementCell,
  settlementCellCenter,
} from './settlementGenerator'
import {
  compareSettlementNameOrder,
  fallbackSettlementName,
  LOCAL_SETTLEMENT_NAME_RADIUS_M,
  localSettlementName,
} from './settlementNameUniqueness'
import { cachedLostTreasureArchaeologistHostCell, clearSettlementDefCache, settlementDefFor } from './settlementPlanCache'

const flatHeight = (): number => 12
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
  roadNetwork: {
    dockSearchRadius: 140,
  },
} as RegionParams

function ctxFor(seed: number): SettlementResolveContext {
  return {
    seed,
    sampleHeight: flatHeight,
    waterLevel: 0,
    localSearchRadius: 56,
    terrainSamplers: samplers,
    heightScale: 1,
    region,
  }
}

function nameMap(cells: readonly SettlementCell[], ctx: SettlementResolveContext): Map<string, string> {
  const names = new Map<string, string>()
  for (const cell of cells) {
    const def = settlementDefFor(cell, ctx)
    if (def) names.set(def.id, def.name)
  }
  return names
}

function baseOf(cell: SettlementCell, ctx: SettlementResolveContext): SettlementBaseName {
  return settlementBaseNameFor(cell, ctx.seed, ctx.sampleHeight, ctx.waterLevel, ctx.terrainSamplers, ctx.heightScale, ctx.region)
}

afterEach(() => {
  clearSettlementDefCache()
})

describe('settlement base names', () => {
  it('agrees adjectives with the noun gender', () => {
    expect(agreeAdjective('Lipowa', 'm')).toBe('Lipowy')
    expect(agreeAdjective('Lipowa', 'n')).toBe('Lipowe')
    expect(agreeAdjective('Głęboka', 'm')).toBe('Głęboki')
    expect(agreeAdjective('Głęboka', 'pl')).toBe('Głębokie')
    expect(agreeAdjective('Mewia', 'm')).toBe('Mewi')
    expect(agreeAdjective('Mewia', 'n')).toBe('Mewie')
    expect(agreeAdjective('Cicha', 'f')).toBe('Cicha')
  })

  it('adds agreeing ordinal words, null past the last one', () => {
    expect(settlementOrdinalName({ name: 'Osowiec', gender: 'm' }, 1)).toBe('Osowiec')
    expect(settlementOrdinalName({ name: 'Osowiec', gender: 'm' }, 2)).toBe('Osowiec Drugi')
    expect(settlementOrdinalName({ name: 'Wola Cicha', gender: 'f' }, 3)).toBe('Wola Cicha Trzecia')
    expect(settlementOrdinalName({ name: 'Rybaki', gender: 'pl' }, 2)).toBe('Rybaki Drugie')
    expect(settlementOrdinalName({ name: 'Lipowo', gender: 'n' }, 10)).toBe('Lipowo Dziesiąte')
    expect(settlementOrdinalName({ name: 'Lipowo', gender: 'n' }, 11)).toBeNull()
  })

  it('is deterministic and applies resource flavor without breaking agreement', () => {
    const resource = { type: 'iron' as const, richness: 1 }
    expect(generateSettlementBaseName(99, 'mountain', resource)).toEqual(generateSettlementBaseName(99, 'mountain', resource))
    for (let seed = 0; seed < 400; seed++) {
      const { name } = generateSettlementBaseName(seed, 'forest', resource)
      expect(name).not.toMatch(/\b(Lipowa|Zielona|Cicha) (Grąd|Gaj|Bór|Jar|Kąt)\b/)
    }
  })

  it('has enough distinct forest base names that local duplicates stay rare', () => {
    const names = new Set<string>()
    for (let seed = 0; seed < 20000; seed++) names.add(generateSettlementBaseName(seed * 7919, 'forest').name)
    expect(names.size).toBeGreaterThan(1000)
  })
})

describe('localSettlementName (author decision 2026-10-30)', () => {
  const center = (cell: SettlementCell) => ({ x: cell.gx * 280, z: cell.gz * 280 })

  it('suffixes same-name neighbours in stable order and leaves far duplicates alone', () => {
    const same: SettlementBaseName = { name: 'Osowiec', gender: 'm' }
    const other: SettlementBaseName = { name: 'Lipowo', gender: 'n' }
    const sameCells = new Set(['1_0', '2_0', '9_0'])
    const deps = () => ({
      baseNameFor: (cell: SettlementCell) => (sameCells.has(`${cell.gx}_${cell.gz}`) ? same : other),
      centerOf: center,
      ordinals: new Map<string, number>(),
      cellKey: (cell: SettlementCell) => `${cell.gx}_${cell.gz}`,
    })
    const d = deps()
    expect(localSettlementName({ gx: 1, gz: 0 }, d)).toBe('Osowiec')
    expect(localSettlementName({ gx: 2, gz: 0 }, d)).toBe('Osowiec Drugi')
    // 9_0 is > 1 km from both: plain name again.
    expect(9 * 280 - 2 * 280).toBeGreaterThan(LOCAL_SETTLEMENT_NAME_RADIUS_M)
    expect(localSettlementName({ gx: 9, gz: 0 }, d)).toBe('Osowiec')
    // Lookup order does not matter.
    const reversed = deps()
    expect(localSettlementName({ gx: 9, gz: 0 }, reversed)).toBe('Osowiec')
    expect(localSettlementName({ gx: 2, gz: 0 }, reversed)).toBe('Osowiec Drugi')
    expect(localSettlementName({ gx: 1, gz: 0 }, reversed)).toBe('Osowiec')
  })

  it('reuses a free ordinal along a chain instead of colliding', () => {
    // A(1,0) – B(4,0) – C(7,0): A–B and B–C within 1 km, A–C not.
    const same: SettlementBaseName = { name: 'Wola', gender: 'f' }
    const other: SettlementBaseName = { name: 'Gaj', gender: 'm' }
    const sameCells = new Set(['1_0', '4_0', '7_0'])
    const deps = {
      baseNameFor: (cell: SettlementCell) => (sameCells.has(`${cell.gx}_${cell.gz}`) ? same : other),
      centerOf: (cell: SettlementCell) => ({ x: cell.gx * 300, z: cell.gz * 300 }),
      ordinals: new Map<string, number>(),
      cellKey: (cell: SettlementCell) => `${cell.gx}_${cell.gz}`,
    }
    expect(localSettlementName({ gx: 7, gz: 0 }, deps)).toBe('Wola')
    expect(localSettlementName({ gx: 4, gz: 0 }, deps)).toBe('Wola Druga')
    expect(localSettlementName({ gx: 1, gz: 0 }, deps)).toBe('Wola')
  })

  it('fallbackSettlementName is unique per cell', () => {
    expect(fallbackSettlementName('Lipowo', { gx: 1, gz: -2 })).toBe('Lipowo 1:-2')
  })
})

describe('settlementDefFor local unique names', () => {
  const seed = 7

  it('names a def by its center-based base name, matching plan identity', () => {
    const ctx = ctxFor(seed)
    const home = settlementDefFor({ gx: 0, gz: 0 }, ctx)
    expect(home).not.toBeNull()
    expect(home!.name).toBe(baseOf({ gx: 0, gz: 0 }, ctx).name)
    expect(home!.name).toBe(home!.plan.identity.name)
  })

  it('is deterministic across cache clears and lookup order', () => {
    const cells = cellsWithinRadius({ gx: 0, gz: 0 }, 4)
    const forward = nameMap(cells, ctxFor(seed))
    clearSettlementDefCache()
    const reversed = nameMap([...cells].reverse(), ctxFor(seed))
    expect(reversed).toEqual(forward)
  })

  it('has no duplicate names within the local radius', () => {
    const ctx = ctxFor(seed)
    const cells = cellsWithinRadius({ gx: 0, gz: 0 }, 6)
    const names = nameMap(cells, ctx)
    const byId = new Map(cells.map((cell) => [`${cell.gx}_${cell.gz}`, cell]))
    const entries = [...names.entries()]
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        if (entries[i]![1] !== entries[j]![1]) continue
        const a = settlementCellCenter(byId.get(entries[i]![0])!, seed)
        const b = settlementCellCenter(byId.get(entries[j]![0])!, seed)
        expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThan(LOCAL_SETTLEMENT_NAME_RADIUS_M)
      }
    }
  })

  it('orders cells by ring from home first', () => {
    expect(compareSettlementNameOrder({ gx: 0, gz: 0 }, { gx: -1, gz: -1 })).toBeLessThan(0)
    expect(compareSettlementNameOrder({ gx: 2, gz: 0 }, { gx: -1, gz: 1 })).toBeGreaterThan(0)
  })
})

describe('Lost Treasure host search scope', () => {
  it('a cell beyond every host search radius never triggers the host search', () => {
    settlementDefFor({ gx: 9, gz: 0 }, ctxFor(7))
    expect(cachedLostTreasureArchaeologistHostCell()).toBeUndefined()
    settlementDefFor({ gx: 2, gz: 0 }, ctxFor(7))
    expect(cachedLostTreasureArchaeologistHostCell()).not.toBeUndefined()
  })
})
