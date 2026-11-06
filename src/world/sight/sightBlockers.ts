/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — sight blocker primitives and their spatial index.
 *  Sight geometry is deliberately separate from movement colliders (window
 *  walls are full movement OBBs; houses used to be 8 m camera cylinders):
 *  producers that own the geometry (settlements, player buildings, terrain
 *  chunks) register blockers on the same load/unload lifecycle as their
 *  colliders. Pure and headless — no Three.js scene dependency.
 */

/**
 * Rectangular hole through a panel's full depth, in the panel's local frame:
 * `offsetX ± halfWidth` along the panel's width axis, `[minY, maxY]` world Y.
 * Windows and door gaps transmit sight; a closed door leaf is registered as
 * its own panel while the door is logically closed.
 */
export type SightAperture = {
  offsetX: number
  halfWidth: number
  minY: number
  maxY: number
}

/**
 * Oriented box prism — walls, door leaves, roof slabs, palisade runs, fences.
 * XZ frame follows `collision.ts`' OBB convention: local x axis is world
 * `(cos rotationY, sin rotationY)`. Finite height `[minY, maxY]` (world Y):
 * a low fence blocks only below its top, a roof only around its own band.
 */
export type SightPanel = {
  kind: 'panel'
  x: number
  z: number
  halfWidth: number
  halfDepth: number
  rotationY: number
  minY: number
  maxY: number
  apertures?: readonly SightAperture[]
}

/** Vertical cylinder — large rocks / boulders. */
export type SightCylinder = {
  kind: 'cylinder'
  x: number
  z: number
  radius: number
  minY: number
  maxY: number
}

export type SightBlocker = SightPanel | SightCylinder

/** Lifecycle-keyed blocker registry with an extent-aware XZ grid (a blocker
 *  is bucketed into every cell its XZ bounding box covers, so a segment
 *  walk finds a long wall even when its centre lies outside the walked
 *  cells). */
export type SightBlockerRegistry = {
  /** Registers/replaces everything owned by `ownerKey` (settlement id,
   *  chunk key, building id). Bumps `revision()`. */
  setBlockers: (ownerKey: string, blockers: readonly SightBlocker[]) => void
  /** Removes `ownerKey`'s blockers. No-op (no revision bump) when absent. */
  clearBlockers: (ownerKey: string) => void
  /** Calls `visit` once per distinct blocker whose cell range intersects
   *  the XZ bounding box of segment `a → b`. Stops when `visit` returns true. */
  forEachNearSegment: (
    ax: number, az: number, bx: number, bz: number,
    visit: (blocker: SightBlocker) => boolean,
  ) => void
  /** Monotonic counter; changes whenever any blocker set changes (cache key). */
  revision: () => number
  /** Number of registered blockers (diagnostics/tests). */
  size: () => number
  clear: () => void
}

/** Grid cell size (m). Sight segments are ≤ ~50 m; 16 m cells keep a walk to
 *  ≤ ~16 cells while a house (≤ ~12 m) touches ≤ 4. */
export const SIGHT_GRID_CELL_M = 16

type Bounds = { minX: number, maxX: number, minZ: number, maxZ: number }

/** XZ bounding box of a blocker (exported for producers' tests). */
export function sightBlockerBounds(b: SightBlocker): Bounds {
  if (b.kind === 'cylinder') {
    return { minX: b.x - b.radius, maxX: b.x + b.radius, minZ: b.z - b.radius, maxZ: b.z + b.radius }
  }
  const cos = Math.abs(Math.cos(b.rotationY))
  const sin = Math.abs(Math.sin(b.rotationY))
  const ex = b.halfWidth * cos + b.halfDepth * sin
  const ez = b.halfWidth * sin + b.halfDepth * cos
  return { minX: b.x - ex, maxX: b.x + ex, minZ: b.z - ez, maxZ: b.z + ez }
}

/** Creates an empty registry. One per `WorldBundle`. */
export function createSightBlockerRegistry(cellSize = SIGHT_GRID_CELL_M): SightBlockerRegistry {
  const byOwner = new Map<string, readonly SightBlocker[]>()
  const cells = new Map<number, SightBlocker[]>()
  let revision = 0
  let count = 0
  // Dedup without allocation: a per-blocker stamp compared to the query id.
  const stamp = new WeakMap<SightBlocker, number>()
  let queryId = 0

  // Integer cell key; cell indices stay well within ±2^15 for any world we build.
  const key = (cx: number, cz: number): number => (cx + 32768) * 65536 + (cz + 32768)

  const eachCell = (b: Bounds, fn: (k: number) => void): void => {
    const x0 = Math.floor(b.minX / cellSize)
    const x1 = Math.floor(b.maxX / cellSize)
    const z0 = Math.floor(b.minZ / cellSize)
    const z1 = Math.floor(b.maxZ / cellSize)
    for (let cx = x0; cx <= x1; cx++) {
      for (let cz = z0; cz <= z1; cz++) fn(key(cx, cz))
    }
  }

  const remove = (blockers: readonly SightBlocker[]): void => {
    for (const blocker of blockers) {
      eachCell(sightBlockerBounds(blocker), (k) => {
        const bucket = cells.get(k)
        if (!bucket) return
        const i = bucket.indexOf(blocker)
        if (i !== -1) bucket.splice(i, 1)
        if (bucket.length === 0) cells.delete(k)
      })
    }
    count -= blockers.length
  }

  return {
    setBlockers(ownerKey, blockers) {
      const previous = byOwner.get(ownerKey)
      if (previous) remove(previous)
      const owned = [...blockers]
      byOwner.set(ownerKey, owned)
      for (const blocker of owned) {
        eachCell(sightBlockerBounds(blocker), (k) => {
          let bucket = cells.get(k)
          if (!bucket) {
            bucket = []
            cells.set(k, bucket)
          }
          bucket.push(blocker)
        })
      }
      count += owned.length
      revision++
    },
    clearBlockers(ownerKey) {
      const previous = byOwner.get(ownerKey)
      if (!previous) return
      remove(previous)
      byOwner.delete(ownerKey)
      revision++
    },
    forEachNearSegment(ax, az, bx, bz, visit) {
      if (count === 0) return
      queryId++
      const x0 = Math.floor(Math.min(ax, bx) / cellSize)
      const x1 = Math.floor(Math.max(ax, bx) / cellSize)
      const z0 = Math.floor(Math.min(az, bz) / cellSize)
      const z1 = Math.floor(Math.max(az, bz) / cellSize)
      for (let cx = x0; cx <= x1; cx++) {
        for (let cz = z0; cz <= z1; cz++) {
          const bucket = cells.get(key(cx, cz))
          if (!bucket) continue
          for (const blocker of bucket) {
            if (stamp.get(blocker) === queryId) continue
            stamp.set(blocker, queryId)
            if (visit(blocker)) return
          }
        }
      }
    },
    revision: () => revision,
    size: () => count,
    clear() {
      if (byOwner.size === 0) return
      byOwner.clear()
      cells.clear()
      count = 0
      revision++
    },
  }
}
