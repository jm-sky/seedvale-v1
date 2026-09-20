import { describe, expect, it } from 'vitest'
import type { SettlementCell, SettlementDef } from '../settlement/settlementGenerator'
import type { ForestBiome } from './biomeRegions'
import type { RegionParams } from './chunkHeightmap'
import { DIG_DEPTH_SOIL, STONE_CHANCE_SAND } from './dig'
import {
  buildDigContextualFindContext,
  COASTAL_AMBER_CHANCE,
  COASTAL_EXCEPTIONAL_SHELL_CHANCE,
  type DigContextualFindContext,
  INLAND_AMBER_CHANCE,
  isWithinSettlementDigFootprint,
  MOUNTAIN_PROSPECTING_RANGE,
  MOUNTAIN_TRACE_ORE_CHANCE,
  resolveContextualDigFind,
  SETTLEMENT_DIG_FOOTPRINT_MARGIN,
  SETTLEMENT_LOST_OBJECT_CHANCE,
} from './digFinds'

const WATER_LEVEL = 2
const REGION = { oceanThreshold: 0.32, coastThreshold: 0.45, desertThreshold: 0.2, desertThresholdWidth: 0.1, swampThreshold: 0.7, swampThresholdWidth: 0.1 } as RegionParams

function digEnv(overrides: Partial<import('./digFinds').DigContextualFindEnv> = {}) {
  return {
    sampleHeight: () => WATER_LEVEL + 2,
    sampleMountainRidge: () => 0,
    waterLevel: WATER_LEVEL,
    seed: 42,
    sampleContinentalness: () => 0.7,
    region: REGION,
    sampleMoistureRegion: () => 0.5,
    sampleForestBiome: () => 'open' as ForestBiome,
    heightScale: 40,
    ...overrides,
  }
}

describe('resolveContextualDigFind — coastal', () => {
  const coastal: DigContextualFindContext = { coastal: true, settlement: false, swamp: false, forest: false }

  it('awards exceptional_shell below 0.05', () => {
    expect(resolveContextualDigFind(coastal, () => 0)).toBe('exceptional_shell')
    expect(resolveContextualDigFind(coastal, () => COASTAL_EXCEPTIONAL_SHELL_CHANCE - 0.001)).toBe('exceptional_shell')
  })

  it('awards amber in 0.05–0.07', () => {
    expect(resolveContextualDigFind(coastal, () => COASTAL_EXCEPTIONAL_SHELL_CHANCE)).toBe('amber')
    expect(resolveContextualDigFind(coastal, () => COASTAL_EXCEPTIONAL_SHELL_CHANCE + COASTAL_AMBER_CHANCE - 0.001)).toBe('amber')
  })

  it('returns null above the coastal special band', () => {
    expect(resolveContextualDigFind(coastal, () => COASTAL_EXCEPTIONAL_SHELL_CHANCE + COASTAL_AMBER_CHANCE)).toBeNull()
  })
})

describe('resolveContextualDigFind — settlement lost object', () => {
  const settlement: DigContextualFindContext = { coastal: false, settlement: true, swamp: false, forest: false }

  it('misses the 2% category roll', () => {
    expect(resolveContextualDigFind(settlement, () => SETTLEMENT_LOST_OBJECT_CHANCE)).toBeNull()
  })

  it('maps weighted branches after a category hit', () => {
    const seq = (...values: number[]) => {
      let i = 0
      return () => values[i++] ?? 1
    }
    expect(resolveContextualDigFind(settlement, seq(0, 0))).toBe('coin')
    expect(resolveContextualDigFind(settlement, seq(0, 0.7))).toBe('firestarter')
    expect(resolveContextualDigFind(settlement, seq(0, 0.85))).toBe('knife')
    expect(resolveContextualDigFind(settlement, seq(0, 0.95))).toBe('sickle')
  })
})

describe('resolveContextualDigFind — inland amber', () => {
  it('swamp hit/miss', () => {
    const swampCtx: DigContextualFindContext = { coastal: false, settlement: false, swamp: true, forest: false }
    expect(resolveContextualDigFind(swampCtx, () => INLAND_AMBER_CHANCE - 0.001)).toBe('amber')
    expect(resolveContextualDigFind(swampCtx, () => INLAND_AMBER_CHANCE)).toBeNull()
  })

  it('forest hit/miss', () => {
    const forestCtx: DigContextualFindContext = { coastal: false, settlement: false, swamp: false, forest: true }
    expect(resolveContextualDigFind(forestCtx, () => 0)).toBe('amber')
    expect(resolveContextualDigFind(forestCtx, () => INLAND_AMBER_CHANCE)).toBeNull()
  })
})

describe('resolveContextualDigFind — mountain trace ore', () => {
  it('maps every mineable ore type', () => {
    for (const ore of ['iron', 'coal', 'gold', 'copper_ore'] as const) {
      const ctx: DigContextualFindContext = { coastal: false, settlement: false, swamp: false, forest: false, mountainOre: ore }
      expect(resolveContextualDigFind(ctx, () => 0)).toBe(ore)
      expect(resolveContextualDigFind(ctx, () => MOUNTAIN_TRACE_ORE_CHANCE)).toBeNull()
    }
  })
})

describe('resolveContextualDigFind — priority', () => {
  it('coastal wins over settlement/forest flags', () => {
    const ctx: DigContextualFindContext = { coastal: true, settlement: true, swamp: true, forest: true, mountainOre: 'iron' }
    expect(resolveContextualDigFind(ctx, () => 0)).toBe('exceptional_shell')
  })
})

describe('isWithinSettlementDigFootprint', () => {
  it('accepts points inside boundary radius + margin', () => {
    const peekDef = (cell: SettlementCell): SettlementDef | null => {
      if (cell.gx !== 0 || cell.gz !== 0) return null
      return {
        x: 0,
        z: 0,
        plan: { boundary: { kind: 'circle', x: 0, z: 0, radius: 40 } },
      } as SettlementDef
    }
    expect(isWithinSettlementDigFootprint(peekDef, 40 + SETTLEMENT_DIG_FOOTPRINT_MARGIN, 0)).toBe(true)
    expect(isWithinSettlementDigFootprint(peekDef, 40 + SETTLEMENT_DIG_FOOTPRINT_MARGIN + 0.01, 0)).toBe(false)
  })
})

describe('buildDigContextualFindContext', () => {
  it('skips deposit query when mountain eligibility is false', () => {
    let queried = false
    const ctx = buildDigContextualFindContext(
      0,
      0,
      { depth: DIG_DEPTH_SOIL, stoneChance: STONE_CHANCE_SAND, surface: 'soil' },
      digEnv({ sampleMountainRidge: () => 0, sampleHeight: () => WATER_LEVEL + 1 }),
      () => null,
      () => {
        queried = true
        return null
      },
    )
    expect(queried).toBe(false)
    expect(ctx.mountainOre).toBeUndefined()
  })

  it('passes nearby deposit type into mountain context', () => {
    const ctx = buildDigContextualFindContext(
      0,
      0,
      { depth: DIG_DEPTH_SOIL, stoneChance: STONE_CHANCE_SAND, surface: 'soil' },
      digEnv({
        sampleMountainRidge: () => 0.2,
        sampleHeight: () => WATER_LEVEL + 30,
      }),
      () => null,
      (_x, _z, range) => {
        expect(range).toBe(MOUNTAIN_PROSPECTING_RANGE)
        return { type: 'gold' }
      },
    )
    expect(ctx.mountainOre).toBe('gold')
  })
})
