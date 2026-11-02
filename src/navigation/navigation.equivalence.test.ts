import { describe, expect, it } from 'vitest'
import { findPath, type NavigationQuery } from './navigation'
import { referenceFindPath } from './navigationReference.testing'

/** Small deterministic PRNG (mulberry32) — fixed seeds keep the cases stable. */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Disc = { x: number, z: number, r: number }

function randomWorld(seed: number): { query: NavigationQuery, calls: { n: number } } {
  const rand = rng(seed)
  const discs: Disc[] = []
  const count = 4 + Math.floor(rand() * 30)
  for (let i = 0; i < count; i++) discs.push({ x: rand() * 40 - 10, z: rand() * 30 - 15, r: 0.5 + rand() * 4 })
  const hilly = rand() < 0.3
  const withCost = rand() < 0.4
  const swamp: Disc = { x: rand() * 20, z: rand() * 10 - 5, r: 2 + rand() * 5 }
  const calls = { n: 0 }
  const query: NavigationQuery = {
    isWalkable: (x, z) => {
      calls.n++
      for (const d of discs) if (Math.hypot(x - d.x, z - d.z) < d.r) return false
      return true
    },
    sampleHeight: hilly ? (x, z) => Math.sin(x * 0.4) * 3 + Math.cos(z * 0.3) * 2 : () => 0,
  }
  if (withCost) query.cellCost = (x, z) => (Math.hypot(x - swamp.x, z - swamp.z) < swamp.r ? 4 : 1)
  return { query, calls }
}

describe('findPath equivalence with the pre-optimisation reference', () => {
  it('returns identical routes and visited counts on 400 random obstacle fields', () => {
    let searched = 0
    let refCalls = 0
    let newCalls = 0
    for (let seed = 1; seed <= 400; seed++) {
      const rand = rng(seed * 7919)
      const start = { x: rand() * 4 - 2, z: rand() * 4 - 2 }
      const goal = { x: 15 + rand() * 15, z: rand() * 20 - 10 }
      const opts = { boundsPadding: 4 + rand() * 8, maxNodes: rand() < 0.2 ? 40 : 1500 }
      const a = randomWorld(seed)
      const b = randomWorld(seed)
      const expected = referenceFindPath(a.query, {}, start, goal, opts)
      const actual = findPath(b.query, {}, start, goal, opts)
      expect(actual).toEqual(expected)
      if (expected && expected.visitedNodes > 0) searched++
      refCalls += a.calls.n
      newCalls += b.calls.n
    }
    // Sanity: the fixture really exercises the grid search, and the memo
    // really removes repeated walkability probes.
    expect(searched).toBeGreaterThan(50)
    expect(newCalls).toBeLessThan(refCalls)
  })
})
