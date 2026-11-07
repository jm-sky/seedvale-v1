/**
 * Cave lookup for a world (WORLD-05): which cave grid covers a position. Grids are derived lazily from the
 * compact `GenCave` descriptors and cached; a coarse bucket index makes the "no cave here" answer (almost
 * every position) a single map miss. Immutable with the world, shared by sim, render and node generation.
 * @domain world
 * @subdomain caves
 */
import type { SurfaceFn } from './caveShape'
import type { GenCave } from './types'
import { buildCaveGrid, type CaveGrid, CELL_SKY, mouthPatchHeight, spinePoints } from './caveShape'

const BUCKET_M = 64

/** Numeric bucket key (no per-call string allocation: `walkHeightAt` runs at movement rate, review 026 #11). */
const bucketKey = (bi: number, bj: number) => (bi + 4096) * 8192 + (bj + 4096)

export class CaveField {
  readonly caves: readonly GenCave[]
  private grids = new Map<number, CaveGrid>()
  private buckets = new Map<number, number[]>()
  private surface: SurfaceFn

  constructor(caves: readonly GenCave[], surface: SurfaceFn) {
    this.caves = caves
    this.surface = surface
    caves.forEach((c, i) => {
      let minX = Infinity
      let minZ = Infinity
      let maxX = -Infinity
      let maxZ = -Infinity
      for (const p of spinePoints(c)) {
        const m = p.r * 1.3 + 3
        minX = Math.min(minX, p.x - m)
        maxX = Math.max(maxX, p.x + m)
        minZ = Math.min(minZ, p.z - m)
        maxZ = Math.max(maxZ, p.z + m)
      }
      for (let bi = Math.floor(minX / BUCKET_M); bi <= Math.floor(maxX / BUCKET_M); bi++) {
        for (let bj = Math.floor(minZ / BUCKET_M); bj <= Math.floor(maxZ / BUCKET_M); bj++) {
          const k = bucketKey(bi, bj)
          const arr = this.buckets.get(k)
          if (arr) arr.push(i)
          else this.buckets.set(k, [i])
        }
      }
    })
  }

  get count() {
    return this.caves.length
  }

  /** Grid of cave `index` (0-based), built on first use. */
  grid(index: number): CaveGrid {
    let g = this.grids.get(index)
    if (!g) {
      g = buildCaveGrid(this.caves[index]!, this.surface, true)
      this.grids.set(index, g)
    }
    return g
  }

  /** Index of the first cave whose grid covers (x, z) with an open cell of any kind, or -1. */
  indexAt(x: number, z: number): number {
    const arr = this.buckets.get(bucketKey(Math.floor(x / BUCKET_M), Math.floor(z / BUCKET_M)))
    if (!arr) return -1
    for (const i of arr) {
      const g = this.grid(i)
      if (g.flagAt(x, z) !== 0) return i
    }
    return -1
  }

  /** True when (x, z) is in a cutting: the terrain mesh is cut out and surface walkers must not step in. */
  skyAt(x: number, z: number): boolean {
    const arr = this.buckets.get(bucketKey(Math.floor(x / BUCKET_M), Math.floor(z / BUCKET_M)))
    if (!arr) return false
    for (const i of arr) if (this.grid(i).flagAt(x, z) === CELL_SKY) return true
    return false
  }

  /** True when (x, z) is in the entrance region R of a cave (sky blocks + collar): the terrain mesh has a hole here (world--003 9.4). */
  cutAt(x: number, z: number): boolean {
    const arr = this.buckets.get(bucketKey(Math.floor(x / BUCKET_M), Math.floor(z / BUCKET_M)))
    if (!arr) return false
    for (const i of arr) if (this.grid(i).cutAt(x, z)) return true
    return false
  }

  /** Entrance-patch surface height at (x, z) inside a cave's region R (world--003 9.4c), `NaN` elsewhere. */
  mouthHeightAt(x: number, z: number): number {
    const arr = this.buckets.get(bucketKey(Math.floor(x / BUCKET_M), Math.floor(z / BUCKET_M)))
    if (!arr) return NaN
    for (const i of arr) {
      const h = mouthPatchHeight(this.grid(i), this.surface, x, z)
      if (!Number.isNaN(h)) return h
    }
    return NaN
  }

  /** Index of the cave with a cutting (sky cell) at (x, z), or -1. */
  skyIndexAt(x: number, z: number): number {
    const arr = this.buckets.get(bucketKey(Math.floor(x / BUCKET_M), Math.floor(z / BUCKET_M)))
    if (!arr) return -1
    for (const i of arr) if (this.grid(i).flagAt(x, z) === CELL_SKY) return i
    return -1
  }

  /**
   * True when a tree/rock at (x, z) would stand in a cutting or block the approach to a cave mouth
   * (resource nodes skip these spots; cheap map miss almost everywhere).
   */
  keepsClear(x: number, z: number): boolean {
    const arr = this.buckets.get(bucketKey(Math.floor(x / BUCKET_M), Math.floor(z / BUCKET_M)))
    if (!arr) return false
    for (const i of arr) {
      const c = this.caves[i]!
      if (Math.hypot(c.x - x, c.z - z) < 10) return true
      const g = this.grid(i)
      for (const [dx, dz] of [[0, 0], [3, 0], [-3, 0], [0, 3], [0, -3]] as const) if (g.flagAt(x + dx, z + dz) === CELL_SKY) return true
    }
    return false
  }

  /** True when any cave bucket intersects the rectangle [x0, x1] × [z0, z1] (pre-test for chunk building). */
  overlaps(x0: number, z0: number, x1: number, z1: number): boolean {
    for (let bi = Math.floor(x0 / BUCKET_M); bi <= Math.floor(x1 / BUCKET_M); bi++) {
      for (let bj = Math.floor(z0 / BUCKET_M); bj <= Math.floor(z1 / BUCKET_M); bj++) {
        if (this.buckets.has(bucketKey(bi, bj))) return true
      }
    }
    return false
  }
}
