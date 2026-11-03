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
  lampWallObstacle,
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

describe('wall-piece collision avoidance (HOUSE-GUARD)', () => {
  const REF_SEED = 415424794
  const wallsOf = (def: (typeof DEFS)[number], roles: Role[], seed: number, fi = 0) =>
    professionDressingFor(family(roles), fi, def, householdYardPlanFor(def.footprint, 0, 0, 0, 'MD', 1), seed)
      .filter((p): p is WallDressingPlacement => p.kind === 'wall')
  const alongOf = (w: WallDressingPlacement) => (w.side === 'front' || w.side === 'back' ? w.x : w.z)

  it('never overlaps the wall lantern, openings or another piece (all defs, many seeds)', () => {
    for (const def of DEFS) {
      const lamp = lampWallObstacle(def)!
      for (let seed = 0; seed < 25; seed++) {
        for (const roles of [['guard'], ['hunter', 'guard'], ['guard', 'fisher', 'hunter']] as Role[][]) {
          const walls = wallsOf(def, roles, REF_SEED + seed, seed)
          walls.forEach((w, i) => {
            const spec = WALL_KITS[w.kit]
            if (w.side === lamp.side) {
              const clearX = Math.abs(alongOf(w) - lamp.along) >= lamp.half + spec.halfAlong
              const clearY = spec.bottomY >= lamp.topY || spec.topY <= lamp.bottomY
              expect(clearX || clearY).toBe(true)
            }
            expect(wallKitFits(def, w.side, alongOf(w), spec)).toBe(true)
            for (const o of walls.slice(0, i)) {
              if (o.side !== w.side) continue
              const os = WALL_KITS[o.kit]
              const clearX = Math.abs(alongOf(o) - alongOf(w)) >= os.halfAlong + spec.halfAlong
              const clearY = spec.bottomY >= os.topY || spec.topY <= os.bottomY
              expect(clearX || clearY).toBe(true)
            }
          })
        }
      }
    }
  })

  it('reference case: cottage-4x4-c shield no longer sits on the lantern (was x=0.98 vs lamp x=1)', () => {
    const def = DEFS.find((d) => d.id === 'cottage-4x4-c')!
    const lamp = lampWallObstacle(def)!
    expect(lamp).toMatchObject({ side: 'front', along: 1 })
    const [shield, banner] = wallsOf(def, ['guard'], REF_SEED)
    expect(shield?.kit).toBe('shield')
    expect(banner?.kit).toBe('banner')
    expect(shield!.side === 'front' && Math.abs(shield!.x - lamp.along) < 0.44).toBe(false)
  })

  it('places the shield before the banner and both when a free wall exists', () => {
    for (const def of DEFS) {
      const kits = wallsOf(def, ['guard'], REF_SEED).map((w) => w.kit)
      expect(kits).toEqual(['shield', 'banner'])
    }
  })

  it('is deterministic for the same seed', () => {
    for (const def of DEFS) expect(wallsOf(def, ['guard'], REF_SEED, 3)).toEqual(wallsOf(def, ['guard'], REF_SEED, 3))
  })

  it('drops a piece only after every valid spot is used up (no room → omitted, shield wins)', () => {
    const base = DEFS[0]!
    // Every wall module has a window: the banner (tall) has no valid spot, the shield too → nothing placed, no throw.
    const sides = ['front', 'back', 'left', 'right'] as const
    const openings = sides.flatMap((side) => [0, 1].map((moduleIndex) => ({ type: 'window', side, moduleIndex }))) as unknown as typeof base.openings
    const packed = { ...base, openings }
    expect(wallsOf(packed, ['guard'], REF_SEED)).toEqual([])
  })

  it('a wall-lantern obstacle also blocks other kits at its height', () => {
    const def = DEFS.find((d) => d.id === 'cottage-4x4-c')!
    const lamp = lampWallObstacle(def)!
    expect(wallKitFits(def, lamp.side, lamp.along, WALL_KITS.shield)).toBe(true) // openings alone allow it
    expect(wallKitFits(def, lamp.side, lamp.along, WALL_KITS.shield, [lamp])).toBe(false)
    expect(wallKitFits(def, lamp.side, lamp.along, WALL_KITS.antlers, [lamp])).toBe(true) // antlers hang above the lantern
  })
})

