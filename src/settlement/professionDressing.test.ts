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
  WALL_FACE_OFFSET_M,
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
    // The lantern now hangs above the door (door module 0 → x=-1), leaving the wall beside it free.
    expect(lamp).toMatchObject({ side: 'front', along: -1 })
    expect(lamp.bottomY).toBeGreaterThan(2.4)
    const [shield, banner] = wallsOf(def, ['guard'], REF_SEED)
    expect(shield?.kit).toBe('shield')
    expect(banner?.kit).toBe('banner')
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
    // A 2×2 house, one window per wall: no stretch is wide enough for a 0.68 m piece → nothing placed, no throw.
    const sides = ['front', 'back', 'left', 'right'] as const
    const openings = sides.map((side) => ({ type: 'window', side, moduleIndex: 0 })) as unknown as typeof base.openings
    const packed = { ...base, footprint: { width: 2, depth: 2 }, openings, lamp: undefined }
    expect(wallsOf(packed, ['guard'], REF_SEED)).toEqual([])
  })

  it('a wall-lantern obstacle also blocks other kits at its height', () => {
    const def = DEFS.find((d) => d.id === 'cottage-4x4-c')!
    const lamp = lampWallObstacle(def)!
    const low = { ...lamp, side: 'back' as const, along: -1, bottomY: 1.0, topY: 1.9 } // a lantern at shield height
    expect(wallKitFits(def, 'back', -1, WALL_KITS.shield, [])).toBe(true) // free of openings
    expect(wallKitFits(def, 'back', -1, WALL_KITS.shield, [low])).toBe(false)
    expect(wallKitFits(def, 'back', -1, WALL_KITS.antlers, [low])).toBe(true) // antlers hang above it
  })

  it('sits flush on every side (left/right exterior face is only 0.093 m out, front/back 0.314 m)', () => {
    for (const def of DEFS) {
      for (let seed = 0; seed < 10; seed++) {
        for (const w of wallsOf(def, ['guard', 'hunter'], REF_SEED + seed, seed)) {
          const alongAxis = w.side === 'front' || w.side === 'back' ? def.footprint.depth : def.footprint.width
          const off = Math.abs(w.side === 'front' || w.side === 'back' ? w.z : w.x) - alongAxis / 2
          expect(off).toBeCloseTo(WALL_FACE_OFFSET_M[w.side], 6)
        }
      }
    }
  })

  it('hangs the guard shield on the entrance wall, centred in the widest free gap', () => {
    for (const def of DEFS) {
      const door = def.openings.find((o) => o.type === 'door')!
      const shield = wallsOf(def, ['guard'], REF_SEED)[0]!
      expect(shield.kit).toBe('shield')
      // The shield is 1.3x since ba487c41: on tight entrance walls (e.g. 4x4 door + window) no gap fits it, and it
      // falls back to another wall. Only when some gap fits must it hang on the entrance wall.
      let gapExists = false
      const half = (door.side === 'front' || door.side === 'back' ? def.footprint.width : def.footprint.depth) / 2
      for (let a = -half; a <= half; a += 0.01) gapExists ||= wallKitFits(def, door.side!, a, WALL_KITS.shield, [])
      if (gapExists) expect(shield.side, def.id).toBe(door.side)
    }
    const b = DEFS.find((d) => d.id === 'cottage-6x4-b')!
    const shield = wallsOf(b, ['guard'], REF_SEED)[0]!
    // door at x=-2 (right edge -1.33), window at x=+2 (left edge 1.38): gap centre ≈ 0
    expect(Math.abs(alongOf(shield))).toBeLessThan(0.1)
  })

  it('hangs the banner on a wall without openings when one has room', () => {
    for (const def of DEFS) {
      const blank = (['front', 'left', 'right', 'back'] as const).filter((side) => !def.openings.some((o) => o.side === side))
      if (blank.length === 0) continue
      const banner = wallsOf(def, ['guard'], REF_SEED).find((w) => w.kit === 'banner')
      if (banner) expect(blank).toContain(banner.side)
    }
    const b = DEFS.find((d) => d.id === 'cottage-6x4-b')!
    expect(wallsOf(b, ['guard'], REF_SEED).find((w) => w.kit === 'banner')?.side).toBe('right')
  })
})
