import { describe, expect, it } from 'vitest'
import type { VillageSize } from './families'
import { COTTAGE_DEFINITIONS, HOUSE_DEFINITIONS } from '../assets/houseDefinitionExample'
import { blacksmithYardGeometry } from './blacksmithYard'
import { householdYardPlanFor, pointInYard, YARD_DEPTH } from './householdYard'

const dist = (a: { x: number, z: number }, b: { x: number, z: number }) => Math.hypot(a.x - b.x, a.z - b.z)
const SIZES = Object.keys(YARD_DEPTH) as VillageSize[]

describe('blacksmithYardGeometry (profession slot, Q41)', () => {
  it('is deterministic', () => {
    const y = householdYardPlanFor(COTTAGE_DEFINITIONS[0]!.footprint, 10, -6, 0.9, 'MD', 4)
    expect(blacksmithYardGeometry(y)).toEqual(blacksmithYardGeometry(y))
  })

  it('keeps anvil, workbench and anchor inside the yard, clear of the common yard props', () => {
    for (const def of [...COTTAGE_DEFINITIONS, ...HOUSE_DEFINITIONS]) {
      for (const size of SIZES) {
        for (let seed = 0; seed < 6; seed++) {
          const y = householdYardPlanFor(def.footprint, 3, 8, seed * 1.3, size, seed)
          const g = blacksmithYardGeometry(y)
          for (const p of [g.anvil, g.workbench, g.anchor]) {
            expect(pointInYard(y, p.x, p.z, 0.3)).toBe(true)
            for (const slot of [y.slots.barrel, y.slots.trough, y.slots.wood, y.slots.storage]) {
              expect(dist(p, slot)).toBeGreaterThan(1)
            }
          }
        }
      }
    }
  })

  it('preserves the original anvil -> grind-workbench arrangement (plan settlements-npcs-002)', () => {
    const y = householdYardPlanFor(COTTAGE_DEFINITIONS[0]!.footprint, 0, 0, 0.5, 'SM', 1)
    const g = blacksmithYardGeometry(y)
    expect(dist(g.anvil, g.workbench)).toBeCloseTo(Math.hypot(1.0, 0.4), 5)
  })

  it('puts the NPC anchor beside the equipment, never at a mesh centre, on the gate side', () => {
    const y = householdYardPlanFor(HOUSE_DEFINITIONS[0]!.footprint, 0, 0, 1.2, 'LG', 2)
    const g = blacksmithYardGeometry(y)
    expect(dist(g.anchor, g.anvil)).toBeGreaterThan(0.5)
    expect(dist(g.anchor, g.workbench)).toBeGreaterThan(0.5)
    expect(dist(g.anchor, y.slots.gate)).toBeLessThan(dist(g.workbench, y.slots.gate))
  })
})
