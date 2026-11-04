import { describe, expect, it } from 'vitest'
import {
  advanceProjectile,
  type Projectile,
  segmentPointDistance,
  sweptProjectileHit,
} from './projectile'

function makeProjectile(overrides: Partial<Projectile> = {}): Projectile {
  return {
    id: 'p1',
    sourceId: 'player',
    x: 0,
    z: 0,
    dirX: 0,
    dirZ: -1,
    speed: 10,
    maxDistance: 20,
    travelled: 0,
    damage: 10,
    damageType: 'pierce',
    criticalChance: 0,
    criticalMultiplier: 1.5,
    attackKey: 'ranged:arrow',
    attempt: 0,
    ammoKind: 'arrow',
    ...overrides,
  }
}

describe('segmentPointDistance', () => {
  it('is zero for a point on the segment', () => {
    expect(segmentPointDistance(0, 0, 0, -10, 0, -5)).toBeCloseTo(0)
  })

  it('measures perpendicular distance for an off-segment point', () => {
    expect(segmentPointDistance(0, 0, 0, -10, 2, -5)).toBeCloseTo(2)
  })

  it('clamps to the nearest endpoint outside the segment span', () => {
    expect(segmentPointDistance(0, 0, 0, -10, 0, 5)).toBeCloseTo(5)
  })
})

describe('advanceProjectile', () => {
  it('moves along its direction by speed*dt', () => {
    const p = makeProjectile()
    advanceProjectile(p, 0.5)
    expect(p.x).toBeCloseTo(0)
    expect(p.z).toBeCloseTo(-5)
    expect(p.travelled).toBeCloseTo(5)
  })

  it('clamps travel at maxDistance and reports expiry', () => {
    const p = makeProjectile({ maxDistance: 3 })
    const expired = advanceProjectile(p, 1)
    expect(p.travelled).toBeCloseTo(3)
    expect(expired).toBe(true)
  })

  it('does not report expiry before maxDistance', () => {
    const p = makeProjectile({ maxDistance: 100 })
    expect(advanceProjectile(p, 0.1)).toBe(false)
  })
})

describe('sweptProjectileHit', () => {
  it('detects a candidate within the swept segment', () => {
    const candidates = [{ id: 'a', x: 0, z: -5, alive: true }]
    expect(sweptProjectileHit(0, 0, 0, -10, candidates)).toBe('a')
  })

  it('ignores dead candidates', () => {
    const candidates = [{ id: 'a', x: 0, z: -5, alive: false }]
    expect(sweptProjectileHit(0, 0, 0, -10, candidates)).toBeNull()
  })

  it('ignores candidates outside the hit radius', () => {
    const candidates = [{ id: 'a', x: 5, z: -5, alive: true }]
    expect(sweptProjectileHit(0, 0, 0, -10, candidates, 0.6)).toBeNull()
  })

  it('picks the earliest circle intersection, rather than the closest center', () => {
    const candidates = [
      { id: 'far', x: 0.5, z: -5, alive: true },
      { id: 'near', x: 0.1, z: -5, alive: true },
    ]
    expect(sweptProjectileHit(0, 0, 0, -10, candidates, 0.6)).toBe('near')
  })

  it('no tunnelling: a fast step still registers a hit crossed mid-segment', () => {
    const candidates = [{ id: 'a', x: 0, z: -5, alive: true }]
    expect(sweptProjectileHit(0, 0, 0, -20, candidates)).toBe('a')
  })
})


describe('067 P1 earliest projectile contact', () => {
  it('hits a nearer off-center target before a farther centered target regardless of input order', () => {
    const candidates = [{ id: 'early', x: .5, z: -2, alive: true }, { id: 'late', x: 0, z: -8, alive: true }]
    expect(sweptProjectileHit(0, 0, 0, -10, candidates)).toBe('early')
    expect(sweptProjectileHit(0, 0, 0, -10, [...candidates].reverse())).toBe('early')
  })

  it('resolves ties and start-inside contacts by lexical ID', () => {
    const candidates = [{ id: 'z', x: .1, z: 0, alive: true }, { id: 'a', x: -.1, z: 0, alive: true }]
    expect(sweptProjectileHit(0, 0, 0, -10, candidates)).toBe('a')
    expect(sweptProjectileHit(0, 0, 0, -10, [...candidates].reverse())).toBe('a')
    const same = [{ id: 'z', x: 0, z: -5, alive: true }, { id: 'a', x: 0, z: -5, alive: true }]
    expect(sweptProjectileHit(0, 0, 0, -10, same)).toBe('a')
  })

  it('zero-length is containment only, including the circle boundary', () => {
    expect(sweptProjectileHit(0, 0, 0, 0, [{ id: 'a', x: .6, z: 0, alive: true }])).toBe('a')
    expect(sweptProjectileHit(0, 0, 0, 0, [{ id: 'a', x: .61, z: 0, alive: true }])).toBeNull()
  })

  it('includes tangent/end contacts, excludes circles beyond either end and dead candidates', () => {
    expect(sweptProjectileHit(0, 0, 0, -10, [{ id: 'a', x: .6, z: -5, alive: true }])).toBe('a')
    expect(sweptProjectileHit(0, 0, 0, -10, [{ id: 'a', x: 0, z: -10.6, alive: true }])).toBe('a')
    expect(sweptProjectileHit(0, 0, 0, -10, [{ id: 'a', x: 0, z: -10.61, alive: true }, { id: 'b', x: 0, z: 1, alive: true }])).toBeNull()
  })
})
