import { describe, expect, it } from 'vitest'
import { createPlayerSightContacts } from './playerSightContacts'

const P = { x: 10, y: 1, z: 20, yaw: 0.5 }
const setup = () => {
  const c = createPlayerSightContacts()
  c.observe('a', 'clear', P, 'human', 'surface', 0)
  return c
}

describe('playerSightContacts', () => {
  it('waits for grace before concealing, creating one frozen billboard', () => {
    const c = setup()
    expect(c.observe('a', 'blocked', { ...P, x: 11 }, 'human', 'surface', 1)).toBe('seen')
    expect(c.lastKnown()).toHaveLength(0)
    expect(c.observe('a', 'blocked', { ...P, x: 12 }, 'human', 'surface', 1.25)).toBe('concealed')
    expect(c.lastKnown()).toHaveLength(1)
    const rev = c.revision()
    c.observe('a', 'blocked', { ...P, x: 99 }, 'human', 'surface', 2)
    expect(c.lastKnown()).toHaveLength(1)
    expect(c.lastKnown()[0]!.x).toBe(10)
    expect(c.revision()).toBe(rev)
  })
  it('reveals instantly on clear and removes billboard', () => {
    const c = setup()
    c.observe('a', 'blocked', P, 'human', 'surface', 1)
    c.observe('a', 'blocked', P, 'human', 'surface', 2)
    expect(c.isConcealed('a')).toBe(true)
    expect(c.observe('a', 'clear', P, 'human', 'surface', 2.01)).toBe('seen')
    expect(c.lastKnown()).toHaveLength(0)
  })
  it('conceals without billboard when never seen clear', () => {
    const c = createPlayerSightContacts()
    c.observe('b', 'blocked', P, 'human', 'surface', 0)
    expect(c.observe('b', 'blocked', P, 'human', 'surface', 1)).toBe('concealed')
    expect(c.lastKnown()).toHaveLength(0)
  })
  it('unknown shows actor, drops billboard, resets timer, keeps clear pose', () => {
    const c = setup()
    c.observe('a', 'blocked', P, 'human', 'surface', 1)
    c.observe('a', 'blocked', P, 'human', 'surface', 2)
    expect(c.observe('a', 'unknown', { ...P, x: 50 }, 'human', 'surface', 3)).toBe('seen')
    expect(c.lastKnown()).toHaveLength(0)
    c.observe('a', 'blocked', P, 'human', 'surface', 4)
    expect(c.isConcealed('a')).toBe(false)
    c.observe('a', 'blocked', P, 'human', 'surface', 5)
    expect(c.lastKnown()[0]!.x).toBe(10)
  })
  describe('expiry', () => {
    const concealed = () => {
      const c = setup()
      c.observe('a', 'blocked', P, 'human', 'surface', 1)
      c.observe('a', 'blocked', P, 'human', 'surface', 2)
      return c
    }
    it('keeps when in range', () => {
      const c = concealed()
      c.tick(3, 10, 30, 'surface')
      expect(c.lastKnown()).toHaveLength(1)
    })
    it('near', () => {
      const c = concealed()
      c.tick(3, 11, 21, 'surface')
      expect(c.lastKnown()).toHaveLength(0)
      expect(c.isConcealed('a')).toBe(true)
    })
    it('far', () => {
      const c = concealed()
      c.tick(3, 10, 80, 'surface')
      expect(c.lastKnown()).toHaveLength(0)
    })
    it('age', () => {
      const c = concealed()
      c.tick(62, 10, 30, 'surface')
      expect(c.lastKnown()).toHaveLength(0)
    })
    it('context', () => {
      const c = concealed()
      c.tick(3, 10, 30, 'cave:1')
      expect(c.lastKnown()).toHaveLength(0)
    })
  })
  it('forget / retainOnly / clear', () => {
    const c = createPlayerSightContacts()
    for (const id of ['a', 'b', 'c']) {
      c.observe(id, 'clear', P, 'human', 's', 0)
      c.observe(id, 'blocked', P, 'human', 's', 1)
      c.observe(id, 'blocked', P, 'human', 's', 2)
    }
    expect(c.lastKnown()).toHaveLength(3)
    c.forget('a')
    expect(c.lastKnown()).toHaveLength(2)
    expect(c.isConcealed('a')).toBe(false)
    c.retainOnly(new Set(['b']))
    expect(c.lastKnown().map(x => x.actorId)).toEqual(['b'])
    expect(c.isConcealed('c')).toBe(false)
    const rev = c.revision()
    c.clear()
    expect(c.lastKnown()).toHaveLength(0)
    expect(c.isConcealed('b')).toBe(false)
    expect(c.revision()).toBeGreaterThan(rev)
  })
  it('keeps stable snapshot identity when unchanged', () => {
    const c = setup()
    const a = c.lastKnown()
    c.tick(1, 0, 0, 'surface')
    expect(c.lastKnown()).toBe(a)
  })
})
