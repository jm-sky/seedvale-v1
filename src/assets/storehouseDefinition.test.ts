import { describe, expect, it } from 'vitest'
import type { VillageSize } from '../settlement/families'
import { houseDefinitionById, pickHouseDefinition, STOREHOUSE_DEFINITION } from './houseDefinitionExample'

describe('STOREHOUSE_DEFINITION (Q43)', () => {
  it('is a windowless shell with one front door and no furniture, lamp or chimney', () => {
    expect(STOREHOUSE_DEFINITION.footprint).toEqual({ width: 6, depth: 4 })
    expect(STOREHOUSE_DEFINITION.openings.map((o) => o.type)).toEqual(['door'])
    expect(STOREHOUSE_DEFINITION.openings[0]).toMatchObject({ side: 'front', moduleIndex: 1 })
    expect(STOREHOUSE_DEFINITION.furniture).toBeUndefined()
    expect(STOREHOUSE_DEFINITION.lamp).toBeUndefined()
    expect(STOREHOUSE_DEFINITION.decorations).toBeUndefined()
    expect(STOREHOUSE_DEFINITION.label).toBe('Magazyn')
  })

  it('resolves by id and is never picked as a home', () => {
    expect(houseDefinitionById('storehouse-6x4')).toBe(STOREHOUSE_DEFINITION)
    for (const size of ['OUTPOST', 'SM', 'MD', 'LG', 'XL'] as VillageSize[]) {
      for (let i = 0; i < 200; i++) {
        expect(pickHouseDefinition(size, i, 415424794).id).not.toBe('storehouse-6x4')
      }
    }
  })
})
