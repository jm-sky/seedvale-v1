import { describe, expect, it } from 'vitest'
import type { AnimalSaveState } from './AnimalAgent'
import {
  birthAnimalId,
  ringAnimalId,
  ringHabitatId,
  WildFaunaRegistry,
  wildRecordFrom,
  wildSexFromRoll,
} from './wildFaunaRecords'

const state = (x: number, z: number): AnimalSaveState => ({ x, z }) as AnimalSaveState

const rec = (animalId: string, habitatId: string, x = 0, z = 0) =>
  wildRecordFrom(
    { habitatId, occupantKey: animalId.slice(habitatId.length + 1), animalId, kind: 'wolf', origin: 'fill', sex: 'female' },
    state(x, z),
    1,
  )

describe('wild fauna ids', () => {
  it('uses the durable scheme', () => {
    expect(ringAnimalId('g', 3)).toBe('g:ring:r3')
    expect(ringHabitatId('g')).toBe('g:ring')
    expect(birthAnimalId('g:cave', 0)).toBe('g:cave:b0')
  })
  it('draws sex from the roll, forced female wins', () => {
    expect(wildSexFromRoll(0.2)).toBe('female')
    expect(wildSexFromRoll(0.7)).toBe('male')
    expect(wildSexFromRoll(0.7, true)).toBe('female')
  })
})

describe('WildFaunaRegistry', () => {
  it('serializes sorted and round-trips', () => {
    const reg = new WildFaunaRegistry()
    reg.markGroupInitialized('b', 2)
    reg.markGroupInitialized('a', 1)
    reg.markGroupInitialized('a', 9) // idempotent
    reg.set(rec('h:cave:b1', 'h:cave'))
    reg.set(rec('h:cave:b0', 'h:cave'))
    const snap = reg.serialize()
    expect(snap.groups.map((g) => g.id)).toEqual(['a', 'b'])
    expect(snap.groups[0].initializedAtDays).toBe(1)
    expect(snap.records.map((r) => r.animalId)).toEqual(['h:cave:b0', 'h:cave:b1'])
    const again = new WildFaunaRegistry(JSON.parse(JSON.stringify(snap)))
    expect(again.serialize()).toEqual(snap)
    expect(again.isGroupInitialized('a')).toBe(true)
  })

  it('removes without tombstone and finds dormant records in a disk', () => {
    const reg = new WildFaunaRegistry()
    reg.set(rec('h:cave:b0', 'h:cave', 0, 0))
    reg.set(rec('h:cave:b1', 'h:cave', 100, 0))
    reg.set(rec('h:cave:b2', 'h:cave', 5, 5))
    expect(reg.inDisk(0, 0, 10, (id) => id !== 'h:cave:b2').map((r) => r.animalId)).toEqual(['h:cave:b0'])
    expect(reg.remove('h:cave:b0')).toBe(true)
    expect(reg.has('h:cave:b0')).toBe(false)
    expect(reg.serialize().records.map((r) => r.animalId)).toEqual(['h:cave:b1', 'h:cave:b2'])
    expect(reg.forHabitat('h:cave')).toHaveLength(2)
  })
})
