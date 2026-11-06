import type { SightBlocker, SightCylinder, SightPanel } from './sightBlockers'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — exact segment tests against sight primitives.
 *  Pure math, no allocation.
 */

const EPS = 1e-9

/** True when segment `a → b` (world) passes through solid part of `blocker`. */
export function segmentBlockedBy(
  blocker: SightBlocker,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
): boolean {
  return blocker.kind === 'panel'
    ? segmentBlockedByPanel(blocker, ax, ay, az, bx, by, bz)
    : segmentBlockedByCylinder(blocker, ax, ay, az, bx, by, bz)
}

/** Slab clip of `p + d·t` on one axis against `[lo, hi]`; narrows `range`. */
function clipAxis(p: number, d: number, lo: number, hi: number, range: { t0: number, t1: number }): boolean {
  if (Math.abs(d) < EPS) return p >= lo && p <= hi
  let ta = (lo - p) / d
  let tb = (hi - p) / d
  if (ta > tb) {
    const s = ta
    ta = tb
    tb = s
  }
  if (ta > range.t0) range.t0 = ta
  if (tb < range.t1) range.t1 = tb
  return range.t0 <= range.t1
}

const _range = { t0: 0, t1: 1 }

function insideAperture(panel: SightPanel, lx: number, y: number): boolean {
  const apertures = panel.apertures
  if (!apertures) return false
  for (const a of apertures) {
    if (lx >= a.offsetX - a.halfWidth && lx <= a.offsetX + a.halfWidth && y >= a.minY && y <= a.maxY) return true
  }
  return false
}

function segmentBlockedByPanel(
  panel: SightPanel,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
): boolean {
  const cos = Math.cos(panel.rotationY)
  const sin = Math.sin(panel.rotationY)
  // World → panel local (same mapping as `collision.ts` toObbLocal).
  const wx = ax - panel.x
  const wz = az - panel.z
  const lax = wx * cos + wz * sin
  const laz = -wx * sin + wz * cos
  const dwx = bx - ax
  const dwz = bz - az
  const ldx = dwx * cos + dwz * sin
  const ldz = -dwx * sin + dwz * cos
  const dy = by - ay
  _range.t0 = 0
  _range.t1 = 1
  if (!clipAxis(lax, ldx, -panel.halfWidth, panel.halfWidth, _range)) return false
  if (!clipAxis(laz, ldz, -panel.halfDepth, panel.halfDepth, _range)) return false
  if (!clipAxis(ay, dy, panel.minY, panel.maxY, _range)) return false
  if (!panel.apertures || panel.apertures.length === 0) return true
  // Thin panels: the segment transmits when its entry, middle and exit
  // points through the panel all lie inside an aperture.
  const t0 = _range.t0
  const t1 = _range.t1
  const tm = (t0 + t1) / 2
  if (!insideAperture(panel, lax + ldx * t0, ay + dy * t0)) return true
  if (!insideAperture(panel, lax + ldx * tm, ay + dy * tm)) return true
  return !insideAperture(panel, lax + ldx * t1, ay + dy * t1)
}

function segmentBlockedByCylinder(
  cyl: SightCylinder,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
): boolean {
  const fx = ax - cyl.x
  const fz = az - cyl.z
  const dx = bx - ax
  const dz = bz - az
  const dy = by - ay
  const a = dx * dx + dz * dz
  const c = fx * fx + fz * fz - cyl.radius * cyl.radius
  let t0: number
  let t1: number
  if (a < EPS) {
    if (c > 0) return false
    t0 = 0
    t1 = 1
  } else {
    const b = 2 * (fx * dx + fz * dz)
    const disc = b * b - 4 * a * c
    if (disc < 0) return false
    const sq = Math.sqrt(disc)
    t0 = Math.max(0, (-b - sq) / (2 * a))
    t1 = Math.min(1, (-b + sq) / (2 * a))
    if (t0 > t1) return false
  }
  _range.t0 = t0
  _range.t1 = t1
  return clipAxis(ay, dy, cyl.minY, cyl.maxY, _range)
}
