import { describe, expect, it } from 'vitest'
import { polylineIsClear, roundCorners, type RouteShapeEnv, type ShapePoint, straightChordAround, stringPull } from './routeShape'

const env: RouteShapeEnv = {
  sampleHeight: () => 10,
  sampleMountainRidge: () => 0,
  waterLevel: 0,
  waterClearance: 0.5,
  elevationWeight: 6,
  mountainCostWeight: 25,
  riverSegments: [],
}
const pt = (x: number, z: number): ShapePoint => ({ x, z, h: 10 })

describe('routeShape', () => {
  it('string-pulls a staircase into a straight line on flat ground', () => {
    const stairs = [pt(0, 0), pt(9, 0), pt(9, 9), pt(18, 9), pt(18, 18), pt(27, 18)]
    const out = stringPull(stairs, new Set(), env)
    expect(out.points.length).toBeLessThan(stairs.length)
    expect(out.points[0]).toEqual(stairs[0])
    expect(out.points.at(-1)).toEqual(stairs.at(-1))
  })

  it('never skips a locked waypoint and keeps it exactly through rounding', () => {
    const line = [pt(0, 0), pt(9, 0), pt(18, 0), pt(27, 0)]
    const pulled = stringPull(line, new Set([1]), env)
    expect(pulled.points.some((p) => p.x === 9 && p.z === 0)).toBe(true)
    const rounded = roundCorners(pulled.points, pulled.locked, () => 10)
    const lockedIdx = [...rounded.locked]
    expect(lockedIdx.some((i) => rounded.points[i]!.x === 9)).toBe(true)
  })

  it('refuses a shortcut over water and is deterministic', () => {
    const wet: RouteShapeEnv = { ...env, sampleHeight: (x, z) => (x > 3 && x < 7 && z < 7 ? -3 : 10) }
    const detour = [pt(0, 0), pt(0, 9), pt(9, 9), pt(9, 0)]
    const a = stringPull(detour, new Set(), wet)
    expect(a.points.length).toBe(detour.length)
    expect(stringPull(detour, new Set(), wet)).toEqual(a)
    expect(polylineIsClear([pt(5, 1)], wet)).toBe(false)
  })

  it('straightChordAround replaces the bend around a centre with one straight chord (Q97)', () => {
    // An L-shaped road bending at (0, 0); chord of radius 10 around the bend.
    const pts: ShapePoint[] = [
      { x: -30, z: 0, h: 10 }, { x: -6, z: 0, h: 10 }, { x: 0, z: 0, h: 10 }, { x: 0, z: 6, h: 10 }, { x: 0, z: 30, h: 10 },
    ]
    const out = straightChordAround(pts, 0, 0, 10, env)!
    expect(out).not.toBeNull()
    expect(out[0]).toEqual(pts[0])
    expect(out[out.length - 1]).toEqual(pts[4])
    expect(out).toHaveLength(4)
    expect(Math.hypot(out[1]!.x, out[1]!.z)).toBeCloseTo(10, 3)
    expect(Math.hypot(out[2]!.x, out[2]!.z)).toBeCloseTo(10, 3)
    // No original point inside the radius survives.
    expect(out.some((p) => Math.hypot(p.x, p.z) < 9.99)).toBe(false)
  })

  it('straightChordAround returns null when the route ends inside the radius or a chord end is wet', () => {
    const short: ShapePoint[] = [{ x: -5, z: 0, h: 10 }, { x: 5, z: 0, h: 10 }]
    expect(straightChordAround(short, 0, 0, 10, env)).toBeNull()
    const line: ShapePoint[] = [{ x: -30, z: 0, h: 10 }, { x: 30, z: 0, h: 10 }]
    const wetEnd: RouteShapeEnv = { ...env, sampleHeight: (x) => (x < -9 && x > -11 ? -3 : 10) }
    expect(straightChordAround(line, 0, 0, 10, wetEnd)).toBeNull()
  })
})
