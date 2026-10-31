import { describe, expect, it } from 'vitest'
import {
  CEMETERY_PIECE_HALF_EXTENTS,
  cemeteryCounts,
  cemeteryCryptLayout,
  cemeteryGraveLayout,
  cemeteryLocalToWorld,
  cemeteryObbColliders,
  cemeteryPlotDistanceToPoint,
  cemeteryPlotDistanceToSegment,
  cemeteryPlotExtents,
  type CemeterySize,
  pickCemeteryMarkerPiece,
} from './cemeteryLayout'

const SIZES: CemeterySize[] = ['SM', 'MD', 'LG']
const SCALES = [0.9, 1, 1.2]

/** Separating-axis overlap test for two OBBs (ObbCollider convention). */
function obbOverlap(a: ReturnType<typeof cemeteryObbColliders>[number], b: typeof a): boolean {
  const axes = (o: typeof a) => [
    { x: Math.cos(o.rotationY), z: Math.sin(o.rotationY) },
    { x: -Math.sin(o.rotationY), z: Math.cos(o.rotationY) },
  ]
  const radius = (o: typeof a, ax: { x: number, z: number }) => {
    const [u, v] = axes(o)
    return o.halfWidth * Math.abs(ax.x * u!.x + ax.z * u!.z) + o.halfDepth * Math.abs(ax.x * v!.x + ax.z * v!.z)
  }
  for (const ax of [...axes(a), ...axes(b)]) {
    const d = Math.abs((b.x - a.x) * ax.x + (b.z - a.z) * ax.z)
    if (d > radius(a, ax) + radius(b, ax)) return false
  }
  return true
}

function insideObb(o: ReturnType<typeof cemeteryObbColliders>[number], x: number, z: number): boolean {
  const cos = Math.cos(o.rotationY)
  const sin = Math.sin(o.rotationY)
  const lx = (x - o.x) * cos + (z - o.z) * sin
  const lz = -(x - o.x) * sin + (z - o.z) * cos
  return Math.abs(lx) <= o.halfWidth && Math.abs(lz) <= o.halfDepth
}

describe('cemeteryLayout', () => {
  it('has the V2 class counts (9/15/25 graves, 1/2/3 crypts)', () => {
    expect(SIZES.map((s) => cemeteryGraveLayout(s, 1).length)).toEqual([9, 15, 25])
    expect(SIZES.map((s) => cemeteryCryptLayout(s, 1).length)).toEqual([1, 2, 3])
    expect(SIZES.map((s) => cemeteryCounts(s))).toEqual([
      { graves: 9, crypts: 1 },
      { graves: 15, crypts: 2 },
      { graves: 25, crypts: 3 },
    ])
  })

  it('is deterministic: slot i is unchanged between calls', () => {
    for (const size of SIZES) {
      const a = cemeteryGraveLayout(size, 1.07)
      const b = cemeteryGraveLayout(size, 1.07)
      expect(b).toEqual(a)
    }
  })

  it('orders slots row-major from the crypt row towards the entrance', () => {
    for (const size of SIZES) {
      const layout = cemeteryGraveLayout(size, 1)
      const { crypts } = cemeteryCounts(size)
      const cryptZ = cemeteryCryptLayout(size, 1)[0]!.z
      expect(crypts).toBeGreaterThan(0)
      // First slot is behind the last slot (towards -Z) and everything is in front of the crypt row.
      expect(layout[0]!.z).toBeLessThan(layout[layout.length - 1]!.z)
      for (const slot of layout) expect(slot.z).toBeGreaterThan(cryptZ)
    }
  })

  it('keeps the plot extents centred: the elements fill both halves', () => {
    for (const size of SIZES) {
      const { hd } = cemeteryPlotExtents(size, 1)
      const zs = cemeteryGraveLayout(size, 1).map((s) => s.z)
      expect(Math.min(...zs, cemeteryCryptLayout(size, 1)[0]!.z)).toBeLessThan(-hd * 0.4)
      expect(Math.max(...zs)).toBeGreaterThan(hd * 0.4)
    }
  })

  it('matches the documented extents at scale 1', () => {
    const hw = SIZES.map((s) => cemeteryPlotExtents(s, 1).hw)
    const hd = SIZES.map((s) => cemeteryPlotExtents(s, 1).hd)
    expect(hw[0]).toBeCloseTo(8.5, 1)
    expect(hw[1]).toBeCloseTo(9.8, 1)
    expect(hw[2]).toBeCloseTo(12.4, 1)
    expect(hd[0]).toBeCloseTo(10.5, 1)
    expect(hd[2]).toBeCloseTo(12.1, 1)
  })

  it.each(SIZES.flatMap((size) => SCALES.map((scale) => [size, scale] as const)))(
    '%s @ %s: every element is inside the extents, no OBB overlaps, every slot is outside every OBB',
    (size, scale) => {
      const { hw, hd } = cemeteryPlotExtents(size, scale)
      const slots = cemeteryGraveLayout(size, scale)
      for (const slot of slots) {
        expect(Math.abs(slot.x)).toBeLessThanOrEqual(hw)
        expect(Math.abs(slot.z)).toBeLessThanOrEqual(hd)
      }
      for (const variant of [0.05, 0.5, 0.95]) {
        for (const id of ['cemetery:a:x', 'cemetery:w:1:2:0:h']) {
          const obbs = cemeteryObbColliders({ id, x: 0, z: 0, rotationY: 0.7, scale, variant, cemeterySize: size })
          expect(obbs.length).toBe(slots.length + cemeteryCounts(size).crypts)
          for (let i = 0; i < obbs.length; i++) {
            for (let j = i + 1; j < obbs.length; j++) expect(obbOverlap(obbs[i]!, obbs[j]!)).toBe(false)
          }
          for (const slot of slots) {
            const w = cemeteryLocalToWorld({ x: 0, z: 0, rotationY: 0.7 }, slot.x, slot.z)
            for (const o of obbs) expect(insideObb(o, w.x, w.z)).toBe(false)
          }
          // Every OBB corner stays inside the plot rectangle (rotated back to the local frame).
          for (const o of obbs) {
            const local = cemeteryLocalToWorld({ x: 0, z: 0, rotationY: -0.7 }, o.x, o.z)
            expect(Math.abs(local.x) + o.halfWidth).toBeLessThanOrEqual(hw + 0.2)
            expect(Math.abs(local.z) + o.halfDepth).toBeLessThanOrEqual(hd + 0.2)
          }
        }
      }
    },
  )

  it('picks pieces deterministically and respects the abandoned mix', () => {
    const count = (abandoned: boolean) => {
      let damaged = 0
      for (let v = 0; v < 40; v++) {
        for (let i = 0; i < 25; i++) if (pickCemeteryMarkerPiece(v / 40, i, abandoned) === 'Grave_Damaged') damaged++
      }
      return damaged
    }
    expect(pickCemeteryMarkerPiece(0.3, 4, false)).toBe(pickCemeteryMarkerPiece(0.3, 4, false))
    expect(count(true)).toBeGreaterThan(count(false) * 2)
    for (let i = 0; i < 50; i++) {
      expect(Object.keys(CEMETERY_PIECE_HALF_EXTENTS)).toContain(pickCemeteryMarkerPiece(0.77, i, false))
    }
  })
})

describe('plot distance helpers (Q47)', () => {
  const plot = { x: 10, z: 20, rotationY: 0.6, size: 'MD' as const, scale: 1 }
  const { hw, hd } = cemeteryPlotExtents('MD', 1)

  it('distance to a point: 0 inside, edge distance outside (rotation-aware)', () => {
    expect(cemeteryPlotDistanceToPoint(plot, plot.x, plot.z)).toBe(0)
    const edge = cemeteryLocalToWorld(plot, hw + 5, 0)
    expect(cemeteryPlotDistanceToPoint(plot, edge.x, edge.z)).toBeCloseTo(5, 6)
    const corner = cemeteryLocalToWorld(plot, hw + 3, hd + 4)
    expect(cemeteryPlotDistanceToPoint(plot, corner.x, corner.z)).toBeCloseTo(5, 6)
  })

  it('distance to a segment: crossing = 0, parallel offset = gap, beyond the end = corner distance', () => {
    const l = (x: number, z: number) => cemeteryLocalToWorld(plot, x, z)
    const seg = (a: { x: number, z: number }, b: { x: number, z: number }) =>
      cemeteryPlotDistanceToSegment(plot, a.x, a.z, b.x, b.z)
    expect(seg(l(-hw - 5, 0), l(hw + 5, 0))).toBe(0)
    expect(seg(l(hw + 4, -50), l(hw + 4, 50))).toBeCloseTo(4, 6)
    expect(seg(l(hw + 3, hd + 4), l(hw + 3, hd + 40))).toBeCloseTo(5, 6)
    expect(seg(l(0, 0), l(1, 1))).toBe(0)
  })
})
