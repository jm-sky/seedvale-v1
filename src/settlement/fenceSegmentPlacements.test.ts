import { describe, expect, it } from 'vitest'
import { householdYardFenceSegments, householdYardPlanFor, pointInYard, YARD_GATE_WIDTH } from './householdYard'
import { fencePlacementColliders, WALL_HALF_LENGTH } from './settlementPalisade'
import { fenceSegmentPlacements } from './villagePasture'

const flat = () => 0
const HALF = WALL_HALF_LENGTH * 0.62
const halfOf = (p: { lengthScale?: number }) => HALF * (p.lengthScale ?? 1)

/** Extent of a placed piece along its own axis, as the two end points. */
function ends(p: { x: number, z: number, rotationY: number, lengthScale?: number }) {
  // yawToward convention: local +X maps to (cos θ, −sin θ).
  const ux = Math.cos(p.rotationY)
  const uz = -Math.sin(p.rotationY)
  return [
    { x: p.x - ux * halfOf(p), z: p.z - uz * halfOf(p) },
    { x: p.x + ux * halfOf(p), z: p.z + uz * halfOf(p) },
  ]
}

describe('fenceSegmentPlacements', () => {
  it('keeps every piece of a long segment within its endpoints and without gaps', () => {
    const seg = { id: 's', ax: 0, az: 0, bx: 10, bz: 0 }
    const ps = fenceSegmentPlacements([seg], flat)
    const xs = ps.map((p) => p.x).sort((a, b) => a - b)
    expect(xs[0]! - HALF).toBeGreaterThanOrEqual(-1e-9)
    expect(xs.at(-1)! + HALF).toBeLessThanOrEqual(10 + 1e-9)
    for (let i = 1; i < xs.length; i++) expect(xs[i]! - xs[i - 1]!).toBeLessThanOrEqual(2 * HALF + 1e-9)
    // flush with both ends
    expect(xs[0]! - HALF).toBeCloseTo(0, 6)
    expect(xs.at(-1)! + HALF).toBeCloseTo(10, 6)
  })

  it('does not overshoot a corner of two perpendicular segments', () => {
    const ps = fenceSegmentPlacements([
      { id: 'a', ax: 0, az: 0, bx: 8, bz: 0 },
      { id: 'b', ax: 8, az: 0, bx: 8, bz: 8 },
    ], flat)
    for (const p of ps) for (const e of ends(p)) {
      expect(e.x).toBeLessThanOrEqual(8 + 1e-6)
      expect(e.z).toBeGreaterThanOrEqual(-1e-6)
    }
  })

  it('leaves a gate gap no narrower than the planned gap', () => {
    const ps = fenceSegmentPlacements([
      { id: 'a', ax: 0, az: 0, bx: 4, bz: 0 },
      { id: 'b', ax: 4 + YARD_GATE_WIDTH, az: 0, bx: 9, bz: 0 },
    ], flat)
    const inGap = ps.flatMap(ends).filter((e) => e.x > 4 + 1e-6 && e.x < 4 + YARD_GATE_WIDTH - 1e-6)
    expect(inGap).toHaveLength(0)
  })

  it('is deterministic', () => {
    const seg = [{ id: 's', ax: 1, az: 2, bx: 9, bz: 5 }]
    expect(fenceSegmentPlacements(seg, flat)).toEqual(fenceSegmentPlacements(seg, flat))
  })

  it('a segment shorter than one piece is shortened to fit exactly (height unchanged)', () => {
    const [p] = fenceSegmentPlacements([{ id: 's', ax: 0, az: 0, bx: 1, bz: 0 }], flat)
    expect(p!.scale).toBeCloseTo(0.62, 6)
    const [lo, hi] = ends(p!)
    expect(lo!.x).toBeCloseTo(0, 6)
    expect(hi!.x).toBeCloseTo(1, 6)
  })

  it('household yard: no piece pokes outside the yard rectangle (no "+"/"T" corners)', () => {
    for (let seed = 0; seed < 12; seed++) {
      const yard = householdYardPlanFor({ width: 8, depth: 6 }, 10, -4, seed * 0.9, 'MD', seed)
      const ps = fenceSegmentPlacements(householdYardFenceSegments(yard, seed), flat)
      expect(ps.length).toBeGreaterThan(0)
      for (const p of ps) for (const e of ends(p)) {
        expect(pointInYard(yard, e.x, e.z, -0.05)).toBe(true)
      }
    }
  })

  it('colliders follow the visible (shortened) piece', () => {
    const ps = fenceSegmentPlacements([{ id: 's', ax: 0, az: 0, bx: 1, bz: 0 }], flat)
    const [c] = fencePlacementColliders(ps)
    expect(c).toMatchObject({ type: 'obb' })
    expect((c as { halfWidth: number }).halfWidth).toBeCloseTo(0.5, 6)
  })
})
