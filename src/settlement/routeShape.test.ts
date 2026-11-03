import { describe, expect, it } from 'vitest'
import { polylineIsClear, roundCorners, type RouteShapeEnv, type ShapePoint, stringPull } from './routeShape'

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
})
