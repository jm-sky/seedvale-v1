/**
 * Cave geometry (WORLD-05), pure and deterministic. A `GenCave` is only a spine (entrance + tunnel/chamber
 * points); this module derives the walkable volume on a 1 m grid: which cells are open, the floor and the
 * ceiling height per grid vertex, and which cells are open to the sky (the cutting at the entrance, where the
 * terrain mesh gets a hole). Shared by the generator (validation), the sim (grounding/collision) and the
 * renderer (mesh), so what you see is what you walk on.
 * @domain world
 * @subdomain caves
 */
import type { GenCave } from './types'
import { CAVE } from '../config/calibration'
import { Noise2D } from '../core/noise'
import { hashString } from '../core/rng'

export const CELL_CLOSED = 0
/** Open cell under rock: floor + ceiling. */
export const CELL_UNDER = 1
/** Open cell without a roof (too little rock above): the terrain mesh is cut out here. */
export const CELL_SKY = 2

export type SurfaceFn = (x: number, z: number) => number

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export interface SpinePoint {
  x: number
  z: number
  r: number
  /** Arc length from the entrance (m). */
  s: number
}

export function spinePoints(cave: GenCave): SpinePoint[] {
  const out: SpinePoint[] = []
  let s = 0
  for (let i = 0; i + 2 < cave.spine.length; i += 3) {
    const x = cave.spine[i]!
    const z = cave.spine[i + 1]!
    if (out.length) {
      const p = out[out.length - 1]!
      s += Math.hypot(x - p.x, z - p.z)
    }
    out.push({ x, z, r: cave.spine[i + 2]!, s })
  }
  return out
}

/** Floor height of the spine at arc length `s` (before noise): descends from the entrance, then levels out. */
export const spineFloor = (y0: number, s: number) => y0 - Math.min(CAVE.rampSlope * s, CAVE.maxDepth)

/** Ceiling clearance for a local spine radius: tunnel height up to chamber height. */
export const clearanceFor = (r: number) => CAVE.tunnelHeight + (CAVE.chamberHeight - CAVE.tunnelHeight) * clamp01((r - CAVE.tunnelRadius) / (CAVE.chamberRadius[0] - CAVE.tunnelRadius))

export class CaveGrid {
  /** World position of the grid origin (even metres, aligned with the 2 m terrain quads). */
  readonly ox: number
  readonly oz: number
  /** Cells per side. */
  readonly nx: number
  readonly nz: number
  /** Per cell: {@link CELL_CLOSED} | {@link CELL_UNDER} | {@link CELL_SKY}. */
  readonly flag: Uint8Array
  /** Per grid vertex ((nx+1) × (nz+1)): floor height (valid next to any open cell). */
  readonly floor: Float32Array
  /** Per grid vertex: ceiling height of roofed cells (valid next to an {@link CELL_UNDER} cell). */
  readonly ceil: Float32Array
  /** Per cell: 1 inside the entrance region R (sky blocks plus a one-block collar); the terrain mesh is cut out there (world--003 9.4). */
  readonly cut: Uint8Array
  /** Number of open cells (stats/tests). */
  open = 0
  /** Surface the grid was built against (the unedited terrain for {@link CaveField} grids); the cached mouth patch always uses it (review 026 #1). */
  surface?: SurfaceFn

  constructor(ox: number, oz: number, nx: number, nz: number) {
    this.ox = ox
    this.oz = oz
    this.nx = nx
    this.nz = nz
    this.flag = new Uint8Array(nx * nz)
    this.cut = new Uint8Array(nx * nz)
    this.floor = new Float32Array((nx + 1) * (nz + 1))
    this.ceil = new Float32Array((nx + 1) * (nz + 1))
  }

  contains(x: number, z: number) {
    return x >= this.ox && z >= this.oz && x < this.ox + this.nx && z < this.oz + this.nz
  }

  /** True when (x, z) lies in the entrance region R (the terrain mesh has a hole there). */
  cutAt(x: number, z: number): boolean {
    const i = Math.floor(x - this.ox)
    const j = Math.floor(z - this.oz)
    return i >= 0 && j >= 0 && i < this.nx && j < this.nz && this.cut[j * this.nx + i] === 1
  }

  flagAt(x: number, z: number): number {
    const i = Math.floor(x - this.ox)
    const j = Math.floor(z - this.oz)
    if (i < 0 || j < 0 || i >= this.nx || j >= this.nz) return CELL_CLOSED
    return this.flag[j * this.nx + i]!
  }

  private bilinear(a: Float32Array, x: number, z: number): number {
    const fx = Math.min(Math.max(x - this.ox, 0), this.nx - 1e-6)
    const fz = Math.min(Math.max(z - this.oz, 0), this.nz - 1e-6)
    const i = Math.floor(fx)
    const j = Math.floor(fz)
    const tx = fx - i
    const tz = fz - j
    const w = this.nx + 1
    return (a[j * w + i]! * (1 - tx) + a[j * w + i + 1]! * tx) * (1 - tz) + (a[(j + 1) * w + i]! * (1 - tx) + a[(j + 1) * w + i + 1]! * tx) * tz
  }

  /** Floor height at a point inside an open cell. */
  floorAt(x: number, z: number): number {
    return this.bilinear(this.floor, x, z)
  }

  /** Ceiling height at a point inside a roofed cell; +Infinity for sky cells. */
  ceilAt(x: number, z: number): number {
    return this.flagAt(x, z) === CELL_SKY ? Infinity : this.bilinear(this.ceil, x, z)
  }
}

/**
 * Derives the grid of a cave. `surfaceAt` is the terrain height the roof cover is measured against.
 * `followGround` (runtime only; generator validation leaves it off so placement is unchanged) keeps the cutting
 * floor from standing above the ground outside: no raised platform at the mouth.
 */
export function buildCaveGrid(cave: GenCave, surfaceAt: SurfaceFn, followGround = false): CaveGrid {
  const pts = spinePoints(cave)
  let minX = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxZ = -Infinity
  for (const p of pts) {
    const m = p.r * 1.3 + 2
    minX = Math.min(minX, p.x - m)
    maxX = Math.max(maxX, p.x + m)
    minZ = Math.min(minZ, p.z - m)
    maxZ = Math.max(maxZ, p.z + m)
  }
  // Even origin: grid blocks (2 × 2 cells) line up with the LOD-0 terrain quads.
  const ox = Math.floor(minX / CAVE.block) * CAVE.block
  const oz = Math.floor(minZ / CAVE.block) * CAVE.block
  const nx = Math.ceil((maxX - ox) / CAVE.block) * CAVE.block
  const nz = Math.ceil((maxZ - oz) / CAVE.block) * CAVE.block
  const g = new CaveGrid(ox, oz, nx, nz)
  g.surface = surfaceAt
  const noise = new Noise2D(hashString(cave.id) ^ 0x5ca7e)
  const cellFloor = new Float32Array(nx * nz)
  const cellH = new Float32Array(nx * nz)

  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const cx = ox + i + 0.5
      const cz = oz + j + 0.5
      // Nearest spine segment (distance relative to the local radius).
      let best = Infinity
      let bestS = 0
      let bestR = 0
      let bestD = 0
      for (let k = 0; k + 1 < pts.length; k++) {
        const a = pts[k]!
        const b = pts[k + 1]!
        const dx = b.x - a.x
        const dz = b.z - a.z
        const len2 = dx * dx + dz * dz || 1
        const t = clamp01(((cx - a.x) * dx + (cz - a.z) * dz) / len2)
        const d = Math.hypot(cx - (a.x + dx * t), cz - (a.z + dz * t))
        const r = a.r + (b.r - a.r) * t
        if (d - r < best) {
          best = d - r
          bestD = d
          bestR = r
          bestS = a.s + (b.s - a.s) * t
        }
      }
      // Nothing opens behind the entrance: the cutting starts at the spine origin.
      const wobble = 1 + 0.2 * noise.get(cx * 0.3, cz * 0.3)
      if (bestD >= bestR * wobble) continue
      const k = j * nx + i
      cellFloor[k] = spineFloor(cave.y0, bestS) + (bestS < 2 ? 0 : 0.18 * noise.fbm(cx * 0.22 + 40, cz * 0.22, 2))
      cellH[k] = clearanceFor(bestR) + 0.35 * noise.get(cx * 0.4 + 90, cz * 0.4)
      const roofed = surfaceAt(cx, cz) - cellFloor[k]! >= cellH[k]! + CAVE.minCover
      g.flag[k] = roofed ? CELL_UNDER : CELL_SKY
    }
  }
  // Sky cells are cut out of the terrain in whole blocks: every cell of a block that has one becomes sky.
  for (let bj = 0; bj < nz; bj += 2) {
    for (let bi = 0; bi < nx; bi += 2) {
      let sky = false
      let sum = 0
      let cnt = 0
      for (let dj = 0; dj < 2; dj++) {
        for (let di = 0; di < 2; di++) {
          const k = (bj + dj) * nx + bi + di
          if (g.flag[k] === CELL_SKY) sky = true
          if (g.flag[k] !== CELL_CLOSED) {
            sum += cellFloor[k]!
            cnt++
          }
        }
      }
      if (!sky) continue
      for (let dj = 0; dj < 2; dj++) {
        for (let di = 0; di < 2; di++) {
          const k = (bj + dj) * nx + bi + di
          // Cells that were closed take the block's mean floor; open ones keep theirs.
          if (g.flag[k] === CELL_CLOSED) cellFloor[k] = sum / cnt
          g.flag[k] = CELL_SKY
          // The cutting floor never stands above the ground outside (no raised platform at the mouth).
          if (followGround) cellFloor[k] = Math.min(cellFloor[k]!, surfaceAt(ox + (k % nx) + 0.5, oz + Math.floor(k / nx) + 0.5) - 0.05)
        }
      }
    }
  }
  // A cell that is still open next to a sky block but whose floor was never set can only be sky: set above.
  // Vertex heights: average of the open cells touching the vertex.
  const w = nx + 1
  for (let vj = 0; vj <= nz; vj++) {
    for (let vi = 0; vi <= nx; vi++) {
      let f = 0
      let h = 0
      let n = 0
      let nu = 0
      let sky = false
      for (let dj = -1; dj <= 0; dj++) {
        for (let di = -1; di <= 0; di++) {
          const i = vi + di
          const j = vj + dj
          if (i < 0 || j < 0 || i >= nx || j >= nz) continue
          const k = j * nx + i
          if (g.flag[k] === CELL_CLOSED) continue
          f += cellFloor[k]!
          n++
          if (g.flag[k] === CELL_SKY) sky = true
          if (g.flag[k] === CELL_UNDER) {
            h += cellH[k]!
            nu++
          }
        }
      }
      // Averaging must not lift a cutting vertex above the ground (steep slopes): the floor meets the terrain.
      if (n) g.floor[vj * w + vi] = followGround && sky ? Math.min(f / n, surfaceAt(ox + vi, oz + vj) - 0.02) : f / n
      if (nu) g.ceil[vj * w + vi] = g.floor[vj * w + vi]! + h / nu
    }
  }
  for (let k = 0; k < g.flag.length; k++) if (g.flag[k] !== CELL_CLOSED) g.open++
  // Entrance region R: every block with a sky cell plus the ring of blocks around it (the collar the bank is built on).
  const bw = nx / 2
  const bh = nz / 2
  const skyBlock = (bi: number, bj: number) => g.flag[(bj * 2) * nx + bi * 2] === CELL_SKY
  for (let bj = 0; bj < bh; bj++) {
    for (let bi = 0; bi < bw; bi++) {
      if (!skyBlock(bi, bj)) continue
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const ci = bi + di
          const cj = bj + dj
          if (ci < 0 || cj < 0 || ci >= bw || cj >= bh) continue
          for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) g.cut[(cj * 2 + b) * nx + ci * 2 + a] = 1
        }
      }
    }
  }
  return g
}

/**
 * Surface height of the entrance patch per grid vertex (world--003 9.4): `NaN` for vertices that touch no cell of the
 * entrance region R. Region border vertices equal the LOD-0 terrain mesh exactly (2 m vertices = `surfaceAt`, 1 m
 * midpoints = the average of their two 2 m neighbours), vertices touching a cutting cell start at the cutting floor, and
 * the collar in between rises smoothly to the terrain (never above it) with a small deterministic bump. Vertices next
 * to a roofed cell stay at least 0.3 m above its ceiling, so the lintel has a face. Pure; render and tests share it.
 */
export function buildMouthPatch(g: CaveGrid, surfaceAt: SurfaceFn): Float32Array {
  const w = g.nx + 1
  const out = new Float32Array(w * (g.nz + 1)).fill(NaN)
  const cells = (vi: number, vj: number) => [[-1, -1], [0, -1], [-1, 0], [0, 0]].map(([di, dj]) => [vi + di!, vj + dj!] as const)
  const inR = (i: number, j: number) => i >= 0 && j >= 0 && i < g.nx && j < g.nz && g.cut[j * g.nx + i] === 1
  const sky: number[] = []
  const border: number[] = []
  const borderSet = new Set<number>()
  const region: number[] = []
  const edgeHeight = (vi: number, vj: number) => {
    const x = g.ox + vi
    const z = g.oz + vj
    if (x % 2 !== 0) return (surfaceAt(x - 1, z) + surfaceAt(x + 1, z)) / 2
    if (z % 2 !== 0) return (surfaceAt(x, z - 1) + surfaceAt(x, z + 1)) / 2
    return surfaceAt(x, z)
  }
  for (let vj = 0; vj <= g.nz; vj++) {
    for (let vi = 0; vi <= g.nx; vi++) {
      const cs = cells(vi, vj)
      if (!cs.some(([i, j]) => inR(i, j))) continue
      const k = vj * w + vi
      region.push(k)
      if (cs.some(([i, j]) => !inR(i, j))) {
        border.push(k)
        borderSet.add(k)
        out[k] = edgeHeight(vi, vj)
      } else if (cs.some(([i, j]) => g.flag[j * g.nx + i] === CELL_SKY)) {
        sky.push(k)
        out[k] = g.floor[k]!
      }
    }
  }
  const at = (k: number) => [k % w, Math.floor(k / w)] as const
  for (const k of region) {
    if (!Number.isNaN(out[k]!)) continue
    const [vi, vj] = at(k)
    let dS = Infinity
    let ref = 0
    for (const s of sky) {
      const [si, sj] = at(s)
      const d = Math.hypot(si - vi, sj - vj)
      if (d < dS) {
        dS = d
        ref = g.floor[s]!
      }
    }
    let dB = Infinity
    for (const b of border) {
      const [bi, bj] = at(b)
      dB = Math.min(dB, Math.hypot(bi - vi, bj - vj))
    }
    const top = surfaceAt(g.ox + vi, g.oz + vj)
    const t = Number.isFinite(dS) ? dS / (dS + dB) : 1
    const sm = t * t * (3 - 2 * t)
    const bump = 0.22 * (hashString(`${g.ox},${g.oz},${vi},${vj}`) % 1000) / 1000 * Math.sin(Math.PI * t)
    out[k] = Math.min(top, ref + (top - ref) * sm + bump)
  }
  // Roofed neighbours: the lintel and the roof patch stay above the ceiling.
  for (const k of region) {
    const [vi, vj] = at(k)
    if (cells(vi, vj).some(([i, j]) => i >= 0 && j >= 0 && i < g.nx && j < g.nz && g.flag[j * g.nx + i] === CELL_UNDER) && !borderSet.has(k)) {
      out[k] = Math.max(out[k]!, g.ceil[k]! + 0.3)
    }
  }
  return out
}

const patchCache = new WeakMap<CaveGrid, Float32Array>()

/**
 * Height of the entrance patch at (x, z) (bilinear over the 1 m patch vertices of {@link buildMouthPatch}, cached per
 * grid), or `NaN` outside the entrance region R. Sim grounding on the collar (world--003 9.4c) and render share it, so a
 * walker stands on the bank that is drawn. The patch is always built from the surface the grid was built against
 * (`g.surface`, the unedited terrain), never from the first caller's `surfaceAt`, so it cannot depend on render order.
 */
export function mouthPatchHeight(g: CaveGrid, surfaceAt: SurfaceFn, x: number, z: number): number {
  if (!g.cutAt(x, z)) return NaN
  let patch = patchCache.get(g)
  if (!patch) {
    patch = buildMouthPatch(g, g.surface ?? surfaceAt)
    patchCache.set(g, patch)
  }
  const fx = x - g.ox
  const fz = z - g.oz
  const i = Math.floor(fx)
  const j = Math.floor(fz)
  const tx = fx - i
  const tz = fz - j
  const w = g.nx + 1
  const a = patch[j * w + i]!
  const b = patch[j * w + i + 1]!
  const c = patch[(j + 1) * w + i]!
  const d = patch[(j + 1) * w + i + 1]!
  return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz
}
