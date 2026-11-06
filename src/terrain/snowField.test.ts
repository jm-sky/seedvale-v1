import { describe, expect, it } from 'vitest'
import { createSurfaceWeatherLut, surfaceWeatherAtOffset } from '../world/weather'
import { climateOffsetC, climateOffsetFromParams, SURFACE_CLIMATE_OFF, surfaceClimateParams } from './macroClimate'
import {
  grassSnowBury,
  grassSnowCoverAt,
  grassSnowFrost,
  grassSnowVisible,
  parseSnowParam,
  snowCover,
  snowThreshold,
  terrainSnowCoverAt,
} from './snowField'

const grid = (n: number, f: (x: number, z: number) => void): void => {
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) f(1000 + i * 13.7, -500 + j * 11.3)
}

describe('snowField (world-terrain-053)', () => {
  it('coverage at a fixed point never decreases while snow amount rises', () => {
    const amounts = Array.from({ length: 21 }, (_, k) => k / 20)
    let points = 0
    grid(45, (x, z) => {
      const n = snowThreshold(x, z, 1)
      let prev = -1
      for (const s of amounts) {
        const c = snowCover(n, s, 0.05)
        expect(c).toBeGreaterThanOrEqual(prev - 1e-12)
        prev = c
      }
      points++
    })
    expect(points).toBeGreaterThanOrEqual(2000)
  })

  it('coverage at a fixed point never increases while snow amount melts', () => {
    const amounts = Array.from({ length: 21 }, (_, k) => 1 - k / 20)
    grid(30, (x, z) => {
      const n = snowThreshold(x, z, 1)
      let prev = 2
      for (const s of amounts) {
        const c = snowCover(n, s, 0.05)
        expect(c).toBeLessThanOrEqual(prev + 1e-12)
        prev = c
      }
    })
  })

  it('is world-anchored: same xz is stable and neighbours differ', () => {
    expect(snowThreshold(123.4, -56.7, 1)).toBe(snowThreshold(123.4, -56.7, 1))
    expect(snowThreshold(123.4, -56.7, 1)).not.toBe(snowThreshold(223.4, -56.7, 1))
    grid(20, (x, z) => {
      const n = snowThreshold(x, z, 1)
      expect(n).toBeGreaterThan(0)
      expect(n).toBeLessThan(1)
    })
  })

  it('coverage fractions per snow band on flat ground stay within expected ranges', () => {
    const frac = (s: number, bias = 0): number => {
      let c = 0
      let t = 0
      grid(100, (x, z) => {
        c += snowCover(snowThreshold(x, z, 1), s, bias) > 0.5 ? 1 : 0
        t++
      })
      return c / t
    }
    expect(frac(0)).toBe(0)
    expect(frac(0.1)).toBeLessThan(0.03)
    expect(frac(0.25)).toBeGreaterThan(0.003)
    expect(frac(0.25)).toBeLessThan(0.08)
    expect(frac(0.5)).toBeGreaterThan(0.35)
    expect(frac(0.5)).toBeLessThan(0.55)
    expect(frac(0.8)).toBeGreaterThan(0.85)
    expect(frac(1)).toBeGreaterThan(0.97)
  })

  it('terrain and grass cover are both monotone and agree on spatial threshold', () => {
    const amounts = [0, 0.2, 0.5, 0.8, 1]
    grid(25, (x, z) => {
      const up = 0.95
      let prevT = -1
      let prevG = -1
      for (const s of amounts) {
        const t = terrainSnowCoverAt(x, z, s, { up })
        const g = grassSnowCoverAt(x, z, s)
        expect(t).toBeGreaterThanOrEqual(prevT - 1e-12)
        expect(g).toBeGreaterThanOrEqual(prevG - 1e-12)
        prevT = t
        prevG = g
        // Same underlying threshold: when both are mid-cover they should not
        // disagree about whether the patch exists (bias differs, so not equal).
        if (t > 0.6 && g < 0.05) {
          throw new Error(`terrain covered but grass empty at ${x},${z} s=${s}`)
        }
        if (g > 0.6 && t < 0.05) {
          throw new Error(`grass covered but terrain empty at ${x},${z} s=${s}`)
        }
      }
    })
  })

  it('identical world state yields identical cover (deterministic)', () => {
    const a = terrainSnowCoverAt(12.5, -88.25, 0.55, { up: 0.92 })
    const b = terrainSnowCoverAt(12.5, -88.25, 0.55, { up: 0.92 })
    expect(a).toBe(b)
    expect(grassSnowCoverAt(12.5, -88.25, 0.55)).toBe(grassSnowCoverAt(12.5, -88.25, 0.55))
  })

  it('grass bury/frost/visible twins are bounded and monotone in cover', () => {
    let prevBury = -1
    for (let i = 0; i <= 20; i++) {
      const sc = i / 20
      const bury = grassSnowBury(sc)
      expect(bury).toBeGreaterThanOrEqual(prevBury - 1e-12)
      prevBury = bury
      const frost = grassSnowFrost(sc, 1)
      expect(frost).toBeGreaterThanOrEqual(0)
      expect(frost).toBeLessThanOrEqual(1)
      const vis = grassSnowVisible(bury)
      expect(vis).toBeGreaterThanOrEqual(0)
      expect(vis).toBeLessThanOrEqual(1)
    }
    expect(grassSnowBury(0)).toBe(0)
    expect(grassSnowFrost(1, 0)).toBe(0)
    expect(grassSnowVisible(1)).toBe(0)
  })

  it('parseSnowParam reads ?snow= override or returns null', () => {
    expect(parseSnowParam('')).toBeNull()
    expect(parseSnowParam('?tod=0.5')).toBeNull()
    expect(parseSnowParam('?snow=0')).toBe(0)
    expect(parseSnowParam('?snow=0.5')).toBe(0.5)
    expect(parseSnowParam('?snow=1')).toBe(1)
    expect(parseSnowParam('?snow=1.5')).toBe(1)
    expect(parseSnowParam('?snow=-0.2')).toBe(0)
    expect(parseSnowParam('?snow=abc')).toBeNull()
  })
})

describe('position-dependent surface climate (062 W2)', () => {
  it('shader offset params are an exact twin of climateOffsetC', () => {
    const wl = 0
    const p = surfaceClimateParams(wl)
    for (const z of [-7000, -6144, -3000, 0, 1234.5, 6144, 9000]) {
      for (const y of [-5, 0, 3, 25, 51]) {
        expect(climateOffsetFromParams(p, z, y)).toBeCloseTo(climateOffsetC(z, y, wl), 9)
      }
    }
    expect(climateOffsetFromParams(SURFACE_CLIMATE_OFF, 4000, 40)).toBe(0)
  })

  it('terrain and grass read the same LUT value at a point and agree on the front', () => {
    const lut = createSurfaceWeatherLut()
    // Snow on cold knots only (north / hills), none on warm knots.
    for (let k = 0; k < 16; k++) lut.snow[k] = k < 8 ? 1 : 0
    const p = surfaceClimateParams(0)
    const north = surfaceWeatherAtOffset(lut, climateOffsetFromParams(p, -5000, 10)).snowAmount
    const south = surfaceWeatherAtOffset(lut, climateOffsetFromParams(p, 5000, 2)).snowAmount
    expect(north).toBeGreaterThan(south)
    grid(25, (x, z) => {
      const t = terrainSnowCoverAt(x, z, north, { up: 1 })
      const g = grassSnowCoverAt(x, z, north)
      if (t > 0.6 && g < 0.05) throw new Error(`terrain covered but grass empty at ${x},${z}`)
    })
  })
})
