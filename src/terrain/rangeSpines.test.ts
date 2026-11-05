import { describe, expect, it } from 'vitest'
import {
  generateRangeSpines,
  RANGE_HOME_RESERVE_M,
  RANGE_MAX_SPINES,
  type RangeBaseRelief,
  sampleRangeSpines,
  softCapSummitHeight,
  SUMMIT_SOFT_CEILING_M,
  SUMMIT_SOFT_KNEE_M,
} from './rangeSpines'

/** Round island of radius 3.8 km, no noise massifs. */
const island: RangeBaseRelief = { land: (x, z) => (Math.hypot(x, z) < 3800 ? 1 : 0), mountain: () => 0 }

describe('range spines (plan 060 R1–R2)', () => {
  it('is deterministic per seed', () => {
    expect(generateRangeSpines(415424794, island)).toEqual(generateRangeSpines(415424794, island))
  })

  it('lays 1–3 spines on land, outside the home reserve, with passes and stable ids', () => {
    for (const seed of [1, 42, 7, 415424794]) {
      const { spines } = generateRangeSpines(seed, island)
      expect(spines.length).toBeGreaterThanOrEqual(1)
      expect(spines.length).toBeLessThanOrEqual(RANGE_MAX_SPINES)
      for (const s of spines) {
        expect(s.id).toMatch(/^rs:-?\d+_-?\d+$/)
        expect(s.passes.length).toBeGreaterThanOrEqual(1)
        for (const p of s.passes) expect(p.id.startsWith(`rp:${s.id}:`)).toBe(true)
        for (let i = 0; i < s.xs.length; i++) {
          expect(Math.hypot(s.xs[i]!, s.zs[i]!)).toBeGreaterThan(RANGE_HOME_RESERVE_M - 120) // resampled chord tolerance
          expect(Math.hypot(s.xs[i]!, s.zs[i]!)).toBeLessThan(3800)
        }
      }
    }
  })

  it('gives no spines when there is no inland run long enough', () => {
    expect(generateRangeSpines(42, { land: () => 0, mountain: () => 0 }).spines).toEqual([])
  })

  it('samples a full crest on the spine, a lowered saddle at a pass and nothing far away', () => {
    const { spines } = generateRangeSpines(42, island)
    const s = spines[0]!
    expect(sampleRangeSpines({ spines }, 9000, 9000)).toEqual({ gate: 0, crest: 0, summitM: 0, passFactor: 1 })

    const pass = s.passes[0]!
    const saddle = sampleRangeSpines({ spines: [s] }, pass.corridor.centreX, pass.corridor.centreZ)
    expect(saddle.passFactor).toBeCloseTo(1 - pass.depth, 5)

    // Mid-spine point away from every pass window and the end tapers.
    const t = s.passes.every((p) => Math.abs(p.t - s.length * 0.5) > p.halfWindow * 2) ? s.length * 0.5 : s.length * 0.3
    let i = 0
    while (s.cum[i + 1]! < t) i++
    const u = (t - s.cum[i]!) / (s.cum[i + 1]! - s.cum[i]!)
    const crest = sampleRangeSpines({ spines: [s] }, s.xs[i]! + (s.xs[i + 1]! - s.xs[i]!) * u, s.zs[i]! + (s.zs[i + 1]! - s.zs[i]!) * u)
    expect(crest.gate).toBeGreaterThan(0.9)
    expect(crest.crest).toBeGreaterThan(0.9)
    expect(crest.summitM).toBeGreaterThan(saddle.summitM)
  })

  it('soft-caps summit heights above the knee only', () => {
    expect(softCapSummitHeight(30)).toBe(30)
    expect(softCapSummitHeight(SUMMIT_SOFT_KNEE_M)).toBe(SUMMIT_SOFT_KNEE_M)
    expect(softCapSummitHeight(95)).toBeLessThan(SUMMIT_SOFT_CEILING_M)
    expect(softCapSummitHeight(80)).toBeGreaterThan(softCapSummitHeight(75))
  })
})
