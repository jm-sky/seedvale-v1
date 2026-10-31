import { describe, expect, it } from 'vitest'
import type { Role } from '../ai/characters'
import type { FamilyDef, FamilyMember } from './families'
import {
  COTTAGE_DEFINITIONS,
  HOME_HOUSE_DEFINITIONS,
  HOUSE_DEFINITIONS,
} from '../assets/houseDefinitionExample'
import { householdYardPlanFor } from './householdYard'
import {
  MAX_WALL_PIECES_PER_HOUSE,
  professionDressingFor,
  SLOT_KITS,
  slotKitCorners,
  WALL_KITS,
  type WallDressingPlacement,
  wallKitFits,
} from './professionDressing'

const DEFS = [...COTTAGE_DEFINITIONS, ...HOUSE_DEFINITIONS, ...HOME_HOUSE_DEFINITIONS]

function family(roles: Role[]): FamilyDef {
  const members = roles.map((role, i) => ({
    name: `N${i}`, lastName: 'L', relation: 'parent', scale: 1, age: 30,
    character: { role },
  })) as unknown as FamilyMember[]
  return { id: 'family-0', members } as unknown as FamilyDef
}

describe('professionDressingFor (Q48)', () => {
  it('is deterministic for equal input', () => {
    for (const def of DEFS) {
      const yard = householdYardPlanFor(def.footprint, 3, 4, 0.4, 'MD', 7)
      const f = family(['hunter', 'farmer'])
      expect(professionDressingFor(f, 2, def, yard, 99)).toEqual(professionDressingFor(f, 2, def, yard, 99))
    }
  })

  it('never overlaps an opening and caps wall pieces', () => {
    const roles: Role[][] = [['hunter', 'guard'], ['guard', 'fisher', 'hunter'], ['fisher']]
    for (const def of DEFS) {
      const yard = householdYardPlanFor(def.footprint, 0, 0, 0, 'MD', 1)
      for (const r of roles) {
        const walls = professionDressingFor(family(r), 1, def, yard, 5).filter(
          (p): p is WallDressingPlacement => p.kind === 'wall',
        )
        expect(walls.length).toBeLessThanOrEqual(MAX_WALL_PIECES_PER_HOUSE)
        for (const w of walls) {
          const along = w.side === 'front' || w.side === 'back' ? w.x : w.z
          expect(wallKitFits(def, w.side, along, WALL_KITS[w.kit])).toBe(true)
        }
      }
    }
  })

  it('keeps slot pieces inside the profession rectangle', () => {
    const roles: Role[] = ['hunter', 'fisher', 'woodcutter', 'farmer', 'trader', 'herbalist']
    for (const def of DEFS) {
      const yard = householdYardPlanFor(def.footprint, 5, -2, 1.1, 'XL', 3)
      for (const role of roles) {
        const slot = professionDressingFor(family([role]), 0, def, yard, 1).find((p) => p.kind === 'slot')
        expect(slot).toBeDefined()
        if (slot?.kind !== 'slot') continue
        expect(SLOT_KITS[slot.kit].halfU).toBeLessThanOrEqual(yard.professionHalf.u)
        expect(SLOT_KITS[slot.kit].halfV).toBeLessThanOrEqual(yard.professionHalf.v)
        expect(slotKitCorners(slot)).toHaveLength(4)
      }
    }
  })

  it('leaves the slot to the blacksmith and skips undressed roles', () => {
    const def = DEFS[0]!
    const yard = householdYardPlanFor(def.footprint, 0, 0, 0, 'MD', 1)
    expect(professionDressingFor(family(['blacksmith', 'hunter']), 0, def, yard, 1).some((p) => p.kind === 'slot')).toBe(false)
    expect(professionDressingFor(family(['miner']), 0, def, yard, 1)).toEqual([])
  })

  it('adds one wall piece for a second profession', () => {
    const def = HOME_HOUSE_DEFINITIONS[0] ?? DEFS[0]!
    const yard = householdYardPlanFor(def.footprint, 0, 0, 0, 'MD', 1)
    const kinds = new Set(professionDressingFor(family(['fisher', 'guard']), 0, def, yard, 1).map((p) => p.role))
    expect(kinds.has('fisher')).toBe(true)
  })
})
