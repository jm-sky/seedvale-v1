import { describe, expect, it } from 'vitest'
import type { VillageSize } from './families'
import {
  COTTAGE_DEFINITIONS,
  HOME_HOUSE_DEFINITIONS,
  HOUSE_DEFINITIONS,
} from '../assets/houseDefinitionExample'
import { houseFootprintRadius } from './houseBuilder'
import {
  householdYardFenceSegments,
  householdYardPlanFor,
  houseLocalToWorld,
  pointInYard,
  worldToYardLocal,
  YARD_DEPTH,
  YARD_GATE_WIDTH,
  YARD_PROP_SPACING,
  yawFacing,
} from './householdYard'

const SIZES: VillageSize[] = ['OUTPOST', 'SM', 'MD', 'LG', 'XL']
const DEFS = [...COTTAGE_DEFINITIONS, ...HOUSE_DEFINITIONS, ...HOME_HOUSE_DEFINITIONS]

describe('householdYard compound geometry (Q41)', () => {
  it('keeps every slot inside the yard rectangle and apart from the others', () => {
    for (const def of DEFS) {
      for (const size of SIZES) {
        for (let seed = 0; seed < 8; seed++) {
          const yaw = seed * 0.77
          const y = householdYardPlanFor(def.footprint, 10, -4, yaw, size, seed)
          const named = ['barrel', 'trough', 'wood', 'storage'] as const
          for (const n of named) {
            expect(pointInYard(y, y.slots[n].x, y.slots[n].z, 0.5)).toBe(true)
          }
          for (let i = 0; i < named.length; i++) {
            for (let j = i + 1; j < named.length; j++) {
              const a = y.slots[named[i]!]
              const b = y.slots[named[j]!]
              expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThanOrEqual(YARD_PROP_SPACING - 1e-6)
            }
          }
        }
      }
    }
  })

  it('fits the profession rectangle fully inside the yard, clear of the prop row', () => {
    for (const def of DEFS) {
      for (const size of SIZES) {
        const y = householdYardPlanFor(def.footprint, 0, 0, 0.3, size, 3)
        const p = worldToYardLocal(y, y.slots.profession.x, y.slots.profession.z)
        expect(Math.abs(p.u) + y.professionHalf.u).toBeLessThanOrEqual(y.halfWidth + 1e-6)
        expect(p.v - y.professionHalf.v).toBeGreaterThanOrEqual(1.6)
        expect(p.v + y.professionHalf.v).toBeLessThanOrEqual(YARD_DEPTH[size] + 1e-6)
      }
    }
  })

  it('attaches the yard behind the house: shares only the back side, never the footprint', () => {
    for (const def of DEFS) {
      const y = householdYardPlanFor(def.footprint, 5, 7, 1.1, 'MD', 1)
      const near = houseLocalToWorld(5, 7, 1.1, 0, def.footprint.depth / 2)
      const edge = worldToYardLocal(y, near.x, near.z)
      expect(edge.v).toBeLessThan(0) // house back wall is outside (behind) the yard
      expect(-edge.v).toBeLessThanOrEqual(0.31)
      const front = houseLocalToWorld(5, 7, 1.1, 0, -def.footprint.depth / 2)
      expect(pointInYard(y, front.x, front.z)).toBe(false)
      expect(houseFootprintRadius(def)).toBeGreaterThan(0)
    }
  })

  it('yawFacing points the door side (local -z) along the requested direction', () => {
    for (const a of [0, 0.7, 2.1, -1.4, 3.0]) {
      const dx = Math.cos(a)
      const dz = Math.sin(a)
      const yaw = yawFacing(dx, dz)
      const f = houseLocalToWorld(0, 0, yaw, 0, -1)
      expect(f.x).toBeCloseTo(dx, 6)
      expect(f.z).toBeCloseTo(dz, 6)
    }
  })

  it('is deterministic', () => {
    const d = COTTAGE_DEFINITIONS[0]!
    expect(householdYardPlanFor(d.footprint, 1, 2, 0.4, 'LG', 9)).toEqual(
      householdYardPlanFor(d.footprint, 1, 2, 0.4, 'LG', 9),
    )
  })
})

describe('householdYardFenceSegments (Q35)', () => {
  const footprint = { width: 8, depth: 6 }
  const yard = householdYardPlanFor(footprint, 10, -4, 0.7, 'MD', 123)
  const segs = householdYardFenceSegments(yard, 3)

  it('uses stable ids and is deterministic', () => {
    expect(segs.map((s) => s.id)).toEqual(segs.map((_, n) => `household-yard-fence-3-${n}`))
    expect(householdYardFenceSegments(yard, 3)).toEqual(segs)
  })

  it('keeps every endpoint on the yard boundary and leaves a gate gap beside the gate slot', () => {
    for (const s of segs) {
      for (const [x, z] of [[s.ax, s.az], [s.bx, s.bz]]) {
        expect(pointInYard(yard, x, z, -1e-6)).toBe(true)
        expect(pointInYard(yard, x, z, 1e-3) ).toBe(false)
      }
    }
    const g = yard.slots.gate
    for (const s of segs) {
      const dx = s.bx - s.ax
      const dz = s.bz - s.az
      const t = Math.max(0, Math.min(1, ((g.x - s.ax) * dx + (g.z - s.az) * dz) / (dx * dx + dz * dz)))
      expect(Math.hypot(s.ax + dx * t - g.x, s.az + dz * t - g.z)).toBeGreaterThanOrEqual(YARD_GATE_WIDTH / 2 - 1e-6)
    }
  })

  it('does not fence through yard prop slots', () => {
    for (const name of ['barrel', 'trough', 'wood', 'storage'] as const) {
      const p = yard.slots[name]
      for (const s of segs) {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const t = Math.max(0, Math.min(1, ((p.x - s.ax) * dx + (p.z - s.az) * dz) / (dx * dx + dz * dz)))
        expect(Math.hypot(s.ax + dx * t - p.x, s.az + dz * t - p.z)).toBeGreaterThan(0.5)
      }
    }
  })
})
