/**
 * Mouth framing rocks (world--003 9.8): rim rocks along the outer border of the entrance region, two jamb rocks at the
 * lintel ends and one brow rock over the lintel. Pure and deterministic from the cave id; render instances the Quaternius
 * `Rock_Medium` models at these placements. A rock is never allowed inside the walkable volume (see {@link rockClear}).
 * @domain world
 * @subdomain caves
 */
import type { CaveGrid, SurfaceFn } from './caveShape'
import { hashString } from '../core/rng'
import { CELL_SKY, CELL_UNDER, mouthPatchHeight } from './caveShape'

export type MouthRockKind = 'rim' | 'jamb' | 'brow'

export interface MouthRock {
  kind: MouthRockKind
  /** Index of the rock model (0 | 1). */
  model: 0 | 1
  x: number
  /** Height of the rock's base point (before burial). */
  y: number
  z: number
  yaw: number
  /** Height in metres (the unit-height model is scaled by this; width scales along). */
  scale: number
  /** Share of the height that sits below `y` (0.35 to 0.5). */
  buried: number
  /** Tilt to the slope (radians about x and z). */
  tiltX: number
  tiltZ: number
}

/** Horizontal footprint radius of a rock of height `s` (conservative: the model is wider than tall). */
export const rockRadius = (s: number) => 0.8 * s
/** A rock must stay this far above the ceiling of any roofed cell it overlaps. */
export const ROCK_ROOF_GAP = 0.1
/** How far (share of the rock height) the ground may fall away below a rock's lowest point at its footprint edge. */
export const FLOAT_TOL = 0.3
/** Steepest ground (rise over run across the whole footprint) a rim or jamb rock may rest on: a loose boulder on a steeper bank would roll off and reads as stuck to the wall (world--003 9.9). */
export const MAX_REST_SLOPE = 0.7

/** Lowest point of the rock (base minus burial, minus a bound for the tilt over the footprint). */
export const rockBottom = (r: MouthRock) => r.y - r.buried * r.scale - Math.tan(Math.max(Math.abs(r.tiltX), Math.abs(r.tiltZ))) * rockRadius(r.scale) * 0.5

/**
 * The 9.8 constraint: the footprint disc touches no cutting cell, and over roofed cells the rock bottom stays above the
 * ceiling (which is at least 2.4 m above the floor). Cells outside the grid count as rock.
 */
export function rockClear(g: CaveGrid, r: MouthRock): boolean {
  const rad = rockRadius(r.scale) + 0.2
  const bottom = rockBottom(r)
  const w = g.nx + 1
  for (let j = Math.floor(r.z - rad - g.oz); j <= Math.floor(r.z + rad - g.oz); j++) {
    for (let i = Math.floor(r.x - rad - g.ox); i <= Math.floor(r.x + rad - g.ox); i++) {
      if (i < 0 || j < 0 || i >= g.nx || j >= g.nz) continue
      const f = g.flag[j * g.nx + i]!
      if (f === 0) continue
      // Nearest point of the cell to the rock centre must be inside the disc to count as an overlap.
      const nx = Math.min(Math.max(r.x, g.ox + i), g.ox + i + 1)
      const nz = Math.min(Math.max(r.z, g.oz + j), g.oz + j + 1)
      if (Math.hypot(nx - r.x, nz - r.z) > rad) continue
      if (f === CELL_SKY) return false
      const ceil = Math.max(g.ceil[j * w + i]!, g.ceil[j * w + i + 1]!, g.ceil[(j + 1) * w + i]!, g.ceil[(j + 1) * w + i + 1]!)
      if (bottom < ceil + ROCK_ROOF_GAP) return false
    }
  }
  return true
}

const SIDES = [[0, -1], [0, 1], [-1, 0], [1, 0]] as const

/** Plans the framing rocks of one cave (deterministic from `caveId`; every returned rock passes {@link rockClear}). */
export function planMouthRocks(g: CaveGrid, surfaceAt: SurfaceFn, caveId: string): MouthRock[] {
  const seed = hashString(`mouthrocks:${caveId}`)
  const rnd = (k: string) => (hashString(`${seed}:${k}`) % 10000) / 10000
  const patchY = (x: number, z: number) => {
    const h = mouthPatchHeight(g, surfaceAt, x, z)
    return Number.isNaN(h) ? surfaceAt(x, z) : h
  }
  const w = g.nx + 1
  const sky: [number, number, number][] = []
  const lintel: { x: number; z: number; dx: number; dz: number }[] = []
  const inR = (i: number, j: number) => i >= 0 && j >= 0 && i < g.nx && j < g.nz && g.cut[j * g.nx + i] === 1
  const border: [number, number][] = []
  for (let j = 0; j < g.nz; j++) {
    for (let i = 0; i < g.nx; i++) {
      const f = g.flag[j * g.nx + i]!
      const cx = g.ox + i + 0.5
      const cz = g.oz + j + 0.5
      if (f === CELL_SKY) sky.push([cx, cz, g.floor[j * w + i]!])
      if (f === CELL_UNDER) {
        for (const [di, dj] of SIDES) {
          const ni = i + di
          const nj = j + dj
          if (ni >= 0 && nj >= 0 && ni < g.nx && nj < g.nz && g.flag[nj * g.nx + ni] === CELL_SKY) lintel.push({ x: cx + di * 0.5, z: cz + dj * 0.5, dx: di, dz: dj })
        }
      }
      if (inR(i, j) && SIDES.some(([di, dj]) => !inR(i + di, j + dj))) border.push([cx, cz])
    }
  }
  if (!sky.length) return []
  const mx = sky.reduce((a, s) => a + s[0], 0) / sky.length
  const mz = sky.reduce((a, s) => a + s[1], 0) / sky.length
  const out: MouthRock[] = []
  /**
   * Grounding on the patch surface over the whole footprint (not only its centre): the tilt follows the slope across half the
   * footprint radius (clamped), and the base point is the lowest patch height on that ring, so the downhill side of a rock on
   * a steep bank sits in the ground instead of floating (the uphill side is buried deeper).
   */
  const ground = (x: number, z: number, s: number): { y: number; tiltX: number; tiltZ: number } => {
    const cl = (v: number) => Math.max(-0.35, Math.min(0.35, v))
    const r = 0.5 * rockRadius(s)
    let y = patchY(x, z)
    for (let a = 0; a < 8; a++) y = Math.min(y, patchY(x + Math.cos((a * Math.PI) / 4) * r, z + Math.sin((a * Math.PI) / 4) * r))
    return { y, tiltX: cl(Math.atan((patchY(x, z + r) - patchY(x, z - r)) / (2 * r))), tiltZ: cl(-Math.atan((patchY(x + r, z) - patchY(x - r, z)) / (2 * r))) }
  }
  /** Review 027 #10: no rock may hang over a drop. The surface under its footprint edge may lie at most `FLOAT_TOL` of its height below its lowest point. */
  const grounded = (r: MouthRock) => {
    const bottom = r.y - r.buried * r.scale
    const rad = 0.9 * rockRadius(r.scale)
    for (let a = 0; a < 8; a++) if (patchY(r.x + Math.cos((a * Math.PI) / 4) * rad, r.z + Math.sin((a * Math.PI) / 4) * rad) < bottom - FLOAT_TOL * r.scale) return false
    return true
  }
  /** Steepest rise over run across the full footprint (both axes and both diagonals). */
  const slopeAt = (x: number, z: number, s: number) => {
    const r = rockRadius(s)
    let m = 0
    for (let a = 0; a < 4; a++) {
      const dx = Math.cos((a * Math.PI) / 4) * r
      const dz = Math.sin((a * Math.PI) / 4) * r
      m = Math.max(m, Math.abs(patchY(x + dx, z + dz) - patchY(x - dx, z - dz)) / (2 * r))
    }
    return m
  }
  const make = (kind: MouthRockKind, key: string, x: number, z: number, s: number, buried: number): MouthRock | null => {
    if (!(slopeAt(x, z, s) <= MAX_REST_SLOPE)) return null
    const gr = ground(x, z, s)
    const r: MouthRock = { kind, model: rnd(`${key}:m`) < 0.5 ? 0 : 1, x, y: gr.y, z, yaw: rnd(`${key}:y`) * Math.PI * 2, scale: s, buried, tiltX: gr.tiltX, tiltZ: gr.tiltZ }
    return rockClear(g, r) && grounded(r) ? r : null
  }
  const nearestFloor = (x: number, z: number) => {
    let best = Infinity
    let fl = 0
    for (const [sx, sz, f] of sky) {
      const d = (sx - x) ** 2 + (sz - z) ** 2
      if (d < best) {
        best = d
        fl = f
      }
    }
    return fl
  }
  // Rim: border cells ordered by angle around the cutting, one every 2.5 to 4 m of arc, 60 % kept.
  const ordered = border.map(([x, z]) => ({ x, z, a: Math.atan2(z - mz, x - mx) })).sort((p, q) => p.a - q.a)
  let acc = 0
  let next = 2.5 + rnd('gap0') * 1.5
  ordered.forEach((c, n) => {
    const prev = ordered[n - 1]
    if (prev) acc += Math.hypot(c.x - prev.x, c.z - prev.z)
    if (acc < next) return
    acc = 0
    next = 2.5 + rnd(`gap${n}`) * 1.5
    if (rnd(`keep${n}`) > 0.6) return
    const depth = Math.max(0, surfaceAt(c.x, c.z) - nearestFloor(c.x, c.z))
    const s = Math.min(1.4, 0.6 + 0.1 * depth) * (0.85 + 0.3 * rnd(`s${n}`))
    const r = make('rim', `rim${n}`, c.x, c.z, s, 0.35 + 0.15 * rnd(`b${n}`))
    if (r) out.push(r)
  })
  if (!lintel.length) return out
  const lx = lintel.reduce((a, e) => a + e.x, 0) / lintel.length
  const lz = lintel.reduce((a, e) => a + e.z, 0) / lintel.length
  const ix = lintel.reduce((a, e) => a - e.dx, 0)
  const iz = lintel.reduce((a, e) => a - e.dz, 0)
  const il = Math.hypot(ix, iz) || 1
  // Inward = from the cutting into the hill; tangent along the lintel.
  const inx = ix / il
  const inz = iz / il
  const tx = -inz
  const tz = inx
  let tMin = Infinity
  let tMax = -Infinity
  for (const e of lintel) {
    const t = (e.x - lx) * tx + (e.z - lz) * tz
    tMin = Math.min(tMin, t)
    tMax = Math.max(tMax, t)
  }
  const ends: [number, number][] = [[tMin, -1], [tMax, 1]]
  ends.forEach(([t, side], n) => {
    const s = 1.5 + 0.7 * rnd(`jamb${n}`)
    for (let off = 0; off < 4; off++) {
      const tt = t + side * (rockRadius(s) * 0.6 + 0.4 + off * 0.5)
      const r = make('jamb', `jamb${n}.${off}`, lx + tx * tt, lz + tz * tt, s, 0.35 + 0.1 * rnd(`jb${n}`))
      if (r) {
        out.push(r)
        return
      }
    }
  })
  const s = 2 + rnd('brow')
  for (let step = 0; step < 8; step++) {
    const d = 1.2 + step * 0.6
    const x = lx + inx * d
    const z = lz + inz * d
    const gr = ground(x, z, s)
    const r: MouthRock = { kind: 'brow', model: rnd('brow:m') < 0.5 ? 0 : 1, x, y: gr.y, z, yaw: rnd('brow:y') * Math.PI * 2, scale: s, buried: 0.5, tiltX: gr.tiltX, tiltZ: gr.tiltZ }
    // Pushed into the hillside: lift it clear of the roof where the ceiling pokes up into its footprint.
    for (let k = 0; k < 6 && !rockClear(g, r); k++) r.y += 0.25
    if (rockClear(g, r) && grounded(r)) {
      out.push(r)
      break
    }
  }
  return out
}
