import { describe, expect, it } from 'vitest'
import type { CharacterAppearance } from './characterTypes'
import { baseGarments } from './baseGarments'
import {
  ANIMS_URL,
  bodyUrl,
  characterUrls,
  eqNodeName,
  eqUrl,
  hairNodeName,
  hairUrl,
  headUrl,
} from './characterFiles'
import { CHARACTER_OUTFITS, CHARACTER_SEXES, HAIR_STYLES, HEAD_VARIANTS } from './characterTypes'

const base: CharacterAppearance = {
  sex: 'Male',
  outfit: 'Peasant',
  head: 'Base',
  hair: 'Parted',
  beard: false,
  clothTint: null,
  garments: [],
}

describe('characterFiles', () => {
  it('builds body/head/hair/eq/anims paths under /assets/characters/', () => {
    expect(bodyUrl('Male', 'Blacksmith')).toBe('/assets/characters/Male_Blacksmith.glb')
    expect(bodyUrl('Female', 'Wizard')).toBe('/assets/characters/Female_Wizard.glb')
    expect(headUrl('Female', 'Base')).toBe('/assets/characters/Female_Head.glb')
    expect(headUrl('Male', 'Round')).toBe('/assets/characters/Male_Head_Round.glb')
    expect(hairUrl('Lean')).toBe('/assets/characters/hair_Lean.glb')
    expect(eqUrl('Female')).toBe('/assets/characters/eq/Female.glb')
    expect(ANIMS_URL).toBe('/assets/characters/anims.glb')
    expect(eqNodeName('WorkSkirtRed')).toBe('EQ_WorkSkirtRed')
    expect(hairNodeName('Parted')).toBe('HAIR_Parted')
    expect(hairNodeName('Beard')).toBe('HAIR_Beard')
  })

  it('lists load order for a skirted female', () => {
    const a: CharacterAppearance = {
      ...base,
      sex: 'Female',
      outfit: 'Peasant',
      hair: 'Long',
      garments: ['WorkSkirt'],
    }
    expect(characterUrls(a)).toEqual([
      '/assets/characters/Female_Peasant.glb',
      '/assets/characters/Female_Head.glb',
      '/assets/characters/hair.glb',
      '/assets/characters/eq/Female.glb',
      '/assets/characters/anims.glb',
    ])
  })

  it('covers every sex × outfit body path shape', () => {
    for (const sex of CHARACTER_SEXES) {
      for (const outfit of CHARACTER_OUTFITS) {
        expect(bodyUrl(sex, outfit)).toBe(`/assets/characters/${sex}_${outfit}.glb`)
      }
    }
    for (const head of HEAD_VARIANTS) {
      expect(headUrl('Male', head)).toContain('Male_Head')
    }
    for (const style of HAIR_STYLES) {
      expect(hairNodeName(style)).toBe(`HAIR_${style}`)
    }
  })
})

describe('baseGarments', () => {
  it('adds a work skirt only for skirted female outfits', () => {
    expect(baseGarments('Female', 'Peasant')).toEqual(['WorkSkirt'])
    expect(baseGarments('Female', 'Peasant_Boots')).toEqual(['WorkSkirt'])
    expect(baseGarments('Female', 'Herbalist')).toEqual(['WorkSkirt'])
    expect(baseGarments('Female', 'Wizard')).toEqual(['WorkSkirt'])
    expect(baseGarments('Female', 'Peasant', 'WorkSkirtBlue')).toEqual(['WorkSkirtBlue'])
    expect(baseGarments('Female', 'Ranger')).toEqual([])
    expect(baseGarments('Female', 'Blacksmith')).toEqual([])
    expect(baseGarments('Male', 'Peasant')).toEqual([])
    expect(baseGarments('Male', 'Wizard')).toEqual([])
  })
})
