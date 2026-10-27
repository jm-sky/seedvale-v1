import { describe, expect, expectTypeOf, it } from 'vitest'
import type { V3EquipmentDefinition } from './types'
import { findV3EquipmentDefinition, V3_EQUIPMENT_DEFINITIONS } from './catalogue'

describe('inert V3 equipment catalogue', () => {
  it('enumerates 87 definitions with stable canonical lookups', () => {
    expectTypeOf(V3_EQUIPMENT_DEFINITIONS).toEqualTypeOf<readonly V3EquipmentDefinition[]>()
    expect(V3_EQUIPMENT_DEFINITIONS).toHaveLength(87)
    for (const definition of V3_EQUIPMENT_DEFINITIONS) {
      expect(findV3EquipmentDefinition(definition.id)).toBe(definition)
    }
    expect(findV3EquipmentDefinition('missing')).toBeUndefined()
    expect(findV3EquipmentDefinition('damascus_knife')).toBeUndefined()
    expect(findV3EquipmentDefinition('broadhead_arrow')).toBeUndefined()
    expect(findV3EquipmentDefinition('arrow')?.name).toBe('Arrow (broadhead)')
  })

  it('deeply freezes every record, nested object and array', () => {
    const check = (value: unknown): void => {
      if (value !== null && typeof value === 'object') {
        expect(Object.isFrozen(value)).toBe(true)
        for (const key of Reflect.ownKeys(value)) {
          const original = Reflect.get(value, key)
          expect(Reflect.set(value, key, 'mutation')).toBe(false)
          expect(Reflect.deleteProperty(value, key)).toBe(false)
          expect(Reflect.get(value, key)).toBe(original)
          check(original)
        }
        expect(Reflect.set(value, 'extra', true)).toBe(false)
      }
    }
    check(V3_EQUIPMENT_DEFINITIONS)
    expect(() => (V3_EQUIPMENT_DEFINITIONS as V3EquipmentDefinition[]).pop()).toThrow(TypeError)
  })

  it('preserves constructor defaults and exact optional-key presence', () => {
    const cap = findV3EquipmentDefinition('padded_cap')!
    expect(Object.hasOwn(cap, 'legacyIds')).toBe(true)
    expect(Object.hasOwn(cap, 'lore')).toBe(true)
    expect(cap.legacyIds).toBeUndefined()
    expect(cap.lore).toBeUndefined()
    expect(cap).toMatchObject({ durability: 300, size: 'SM', tier: 'common', origin: 'new', layer: 'under', resist: { blunt: 0.2, cut: 0.15, pierce: 0.05 } })
    const knife = findV3EquipmentDefinition('knife')!
    expect(Object.hasOwn(knife, 'lore')).toBe(false)
    expect(knife).toMatchObject({ durability: 200, size: 'SM', availability: 'active', capabilities: ['cut'] })
    const halberd = findV3EquipmentDefinition('halberd')!
    expect(Object.hasOwn(halberd, 'legacyIds')).toBe(true)
    expect(halberd.legacyIds).toBeUndefined()
    expect(Object.hasOwn(halberd, 'capabilities')).toBe(false)
    expect(findV3EquipmentDefinition('short_bow')).toMatchObject({ durability: 150, size: 'LG' })
    expect(findV3EquipmentDefinition('sling_stone')).toMatchObject({ durability: 1, size: 'XXS' })
    expect(findV3EquipmentDefinition('leather_boots')).toMatchObject({ speedPenalty: -0.03 })
  })

  it('retains reviewed availability, tier and armor slot counts as metadata', () => {
    const counts = (key: 'availability' | 'slot' | 'tier') => {
      const result: Record<string, number> = {}
      for (const item of V3_EQUIPMENT_DEFINITIONS) {
        const value = key === 'slot' ? item.category === 'armor' ? item.slot : undefined : item[key]
        if (value !== undefined) result[value] = (result[value] ?? 0) + 1
      }
      return result
    }
    expect(counts('availability')).toEqual({ active: 60, future: 12, unique: 14, 'quest-only': 1 })
    expect(counts('tier')).toEqual({ common: 73, masterwork: 7, legendary: 7 })
    expect(counts('slot')).toEqual({ head: 6, shoulders: 6, torso: 11, forearms: 4, hands: 4, legs: 5, feet: 3 })
  })
})
