import { describe, expect, it } from 'vitest'
import { landmarkName, uniqueLandformNames } from './worldLocationNames'

describe('landmarkName', () => {
  it('is a pure, stable function of (seed, kind, id)', () => {
    const a = landmarkName(42, 'cave', 'cave:cave-1')
    const b = landmarkName(42, 'cave', 'cave:cave-1')
    expect(a).toBe(b)
  })

  it('is never generated per-UI-call at random (two fresh calls agree)', () => {
    const names = new Set<string>()
    for (let i = 0; i < 5; i++) names.add(landmarkName(1, 'lake', 'lake:3,4'))
    expect(names.size).toBe(1)
  })

  it('reads as "<Noun> <Adjective>" for each landmark kind', () => {
    for (const kind of ['cave', 'cemetery', 'lake', 'mountainPeak', 'ruins', 'abandonedMine', 'searchArea'] as const) {
      const name = landmarkName(5, kind, `${kind}:x`)
      expect(name.split(' ').length).toBeGreaterThanOrEqual(2)
    }
  })

  it('unique landform names (world-041 L2): distinct, deterministic, order-independent, gender-agreeing', () => {
    const many = Array.from({ length: 60 }, (_, i) => ({ id: `landform:crag:${i}_0`, subtype: 'crag' as const }))
    const a = uniqueLandformNames(7, many)
    expect(new Set(a.values()).size).toBe(many.length)
    const b = uniqueLandformNames(7, [...many].reverse())
    expect([...a.entries()].sort()).toEqual([...b.entries()].sort())
    const one = { id: 'landform:crater:3_4', subtype: 'crater' as const }
    expect(uniqueLandformNames(7, [one]).get(one.id)).toBe(landmarkName(7, 'landform', one.id, undefined, 'crater'))
    for (let i = 0; i < 40; i++) {
      const [noun, adj] = landmarkName(3, 'landform', `landform:spineSummit:${i}`, undefined, 'spineSummit').split(' ')
      expect(adj!.endsWith(noun === 'Szczyt' || noun === 'Wierch' ? 'y' : 'a')).toBe(true)
    }
  })

  it('different ids under the same seed vary (not a single fixed name per kind)', () => {
    const names = new Set<string>()
    for (let i = 0; i < 20; i++) names.add(landmarkName(1, 'lake', `lake:${i},0`))
    expect(names.size).toBeGreaterThan(1)
  })
})
