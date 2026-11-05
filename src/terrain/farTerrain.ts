import * as THREE from 'three'
import type { ChunkCoord } from './chunkGrid'
import type { RawSampleParams } from './chunkHeightmap'
import {
  buildFarTileIndices,
  FAR_TILE_CELLS_COARSE,
  FAR_TILE_CELLS_FINE,
  FAR_TILE_SIZE,
  type FarTileData,
  type FarTileRequest,
  farTileVertexCount,
  skirtSourceIndex,
} from './farTile'

/** Tiles whose centre is within this distance of the player use the 8 m grid, farther ones the 16 m grid. */
export const FAR_FINE_RADIUS = 450
/** Residency mask edge in chunks; toroidal (chunk index mod size), so it never needs re-centring. */
export const FAR_MASK_SIZE = 64
/** Max tile jobs in flight at once (the pool serialises them anyway; keeps cancel cheap on fast movement). */
const MAX_INFLIGHT = 6
/**
 * Streamed chunks at Chebyshev distance from the player's chunk ≥ this keep the far canopy shell drawn over them: the
 * tree density LOD (`distanceLod.ts`) thins trees there (49 % at 2, 8 % at 3 with the default radius), and the shell
 * stands in for the missing trees so forest never reads as bare ground (plan 066 F2, author constraint 2).
 */
export const FAR_CANOPY_KEEP_CHUNKS = Number.POSITIVE_INFINITY
// Author look 2026-11-05: with 2 the kept shell floated ~9 m above the streamed ground (ground fragments discarded,
// shell not), was seen from underneath and could be walked up to. Disabled (never kept over resident chunks) until the
// LOD-thinned band gets a real solution (impostors / higher tree-LOD floor, queue Q148).
/** Mask texel values: nothing resident · terrain resident, canopy kept · terrain resident, trees at full LOD. */
const MASK_OPEN = 0
const MASK_CANOPY = 128
const MASK_CLOSED = 255

/** Minimum time between merged-geometry rebuilds (ms) — tiles arrive in bursts after a teleport. */
const REBUILD_INTERVAL_MS = 120

export type FarTileCells = typeof FAR_TILE_CELLS_FINE | typeof FAR_TILE_CELLS_COARSE

export type FarTileWanted = { tx: number, tz: number, cells: FarTileCells, dist: number }

/**
 * Pure. Far tiles wanted around the player: every world-aligned 256 m tile whose centre lies within
 * `farRadius + half-diagonal` (so no visible tile edge falls inside the fog-opaque radius), nearest first, each with
 * its grid level.
 *
 * @domain world-terrain
 */
export function wantedFarTiles(px: number, pz: number, farRadius: number): FarTileWanted[] {
  const reach = farRadius + FAR_TILE_SIZE * Math.SQRT1_2
  const span = Math.ceil(reach / FAR_TILE_SIZE) + 1
  const ctx = Math.floor(px / FAR_TILE_SIZE)
  const ctz = Math.floor(pz / FAR_TILE_SIZE)
  const out: FarTileWanted[] = []
  for (let tz = ctz - span; tz <= ctz + span; tz++) {
    for (let tx = ctx - span; tx <= ctx + span; tx++) {
      const dist = Math.hypot((tx + 0.5) * FAR_TILE_SIZE - px, (tz + 0.5) * FAR_TILE_SIZE - pz)
      if (dist > reach) continue
      out.push({ tx, tz, cells: dist <= FAR_FINE_RADIUS ? FAR_TILE_CELLS_FINE : FAR_TILE_CELLS_COARSE, dist })
    }
  }
  return out.sort((a, b) => a.dist - b.dist)
}

export type FarTerrainOptions = {
  scene: THREE.Scene
  chunkSize: number
  /** Fog is opaque here; tiles are wanted out to this radius (+ tile half-diagonal). */
  farRadius: number
  params: RawSampleParams
  /** Read-only streamed-terrain residency (`ChunkManager.terrainResidency`). */
  residency: () => { version: number, coords: readonly ChunkCoord[] }
  requestTile: (key: string, request: FarTileRequest) => Promise<FarTileData>
  cancelTile: (key: string) => void
}

export type FarTerrain = {
  /** Call every frame with the player position; does work only when the tile window or residency changed. */
  update: (playerX: number, playerZ: number) => void
  /** Diagnostics: tiles held per level and pending jobs. */
  stats: () => { fine: number, coarse: number, pending: number, triangles: number }
  dispose: () => void
}

type Level = {
  cells: FarTileCells
  capacity: number
  mesh: THREE.Mesh
  geometry: THREE.BufferGeometry
  tileVertices: number
  tileIndices: number
  indexTemplate: Uint32Array
}

/**
 * Far ground ring (plan world-terrain-066 F1): worker-built 256 m tiles merged into one mesh per grid level (two draw
 * calls). Streamed chunks win over it — fragments over chunks whose terrain mesh is attached are discarded using a
 * toroidal per-chunk residency texture, so near and far never overlap. Presentation only: no simulation, collision,
 * map or save reads it; rebuilt with the `WorldBundle`.
 *
 * @domain world-terrain
 */
export function createFarTerrain(options: FarTerrainOptions): FarTerrain {
  const { scene, chunkSize, farRadius, params } = options
  const maskData = new Uint8Array(FAR_MASK_SIZE * FAR_MASK_SIZE)
  const maskTexture = new THREE.DataTexture(maskData, FAR_MASK_SIZE, FAR_MASK_SIZE, THREE.RedFormat, THREE.UnsignedByteType)
  maskTexture.wrapS = THREE.RepeatWrapping
  maskTexture.wrapT = THREE.RepeatWrapping
  maskTexture.magFilter = THREE.NearestFilter
  maskTexture.minFilter = THREE.NearestFilter
  maskTexture.needsUpdate = true
  const material = createFarMaterial(maskTexture, chunkSize)

  const reachTiles = Math.ceil((farRadius + FAR_TILE_SIZE) / FAR_TILE_SIZE) + 1
  const makeLevel = (cells: FarTileCells, capacity: number): Level => {
    const tileVertices = farTileVertexCount(cells)
    const indexTemplate = buildFarTileIndices(cells)
    const tileIndices = indexTemplate.length
    const index = new Uint32Array(capacity * tileIndices)
    for (let s = 0; s < capacity; s++) {
      const off = s * tileVertices
      for (let k = 0; k < tileIndices; k++) index[s * tileIndices + k] = indexTemplate[k]! + off
    }
    const geometry = new THREE.BufferGeometry()
    const total = capacity * tileVertices
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(total * 3), 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(total * 3), 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aCanopy', new THREE.BufferAttribute(new Float32Array(total), 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setIndex(new THREE.BufferAttribute(index, 1))
    geometry.setDrawRange(0, 0)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false // geometry spans the whole ring and is rebuilt in world coordinates
    mesh.matrixAutoUpdate = false
    mesh.name = cells === FAR_TILE_CELLS_FINE ? 'farTerrainFine' : 'farTerrainCoarse'
    mesh.renderOrder = -1
    scene.add(mesh)
    return { cells, capacity, mesh, geometry, tileVertices, tileIndices, indexTemplate }
  }
  const fineSpan = Math.ceil(FAR_FINE_RADIUS / FAR_TILE_SIZE) + 1
  const levels: Record<FarTileCells, Level> = {
    [FAR_TILE_CELLS_FINE]: makeLevel(FAR_TILE_CELLS_FINE, (2 * fineSpan + 1) ** 2),
    [FAR_TILE_CELLS_COARSE]: makeLevel(FAR_TILE_CELLS_COARSE, (2 * reachTiles + 1) ** 2),
  }

  const tiles = new Map<string, FarTileData>() // by `tx,tz`; level may lag the wanted level until the new tile lands
  const pending = new Map<string, FarTileCells>() // by `tx,tz` → cells requested
  let wanted = new Map<string, FarTileWanted>()
  let lastCellX = Number.NaN
  let lastCellZ = Number.NaN
  let residencyVersion = -1
  let maskChunkX = Number.NaN
  let maskChunkZ = Number.NaN
  let dirty = false
  let lastRebuildMs = -Infinity
  let disposed = false

  const key = (tx: number, tz: number) => `${tx},${tz}`

  function refreshWindow(px: number, pz: number): void {
    const list = wantedFarTiles(px, pz, farRadius)
    wanted = new Map(list.map((w) => [key(w.tx, w.tz), w]))
    for (const [k, cells] of pending) {
      const w = wanted.get(k)
      if (!w || w.cells !== cells) {
        options.cancelTile(k)
        pending.delete(k)
      }
    }
    for (const k of [...tiles.keys()]) {
      if (!wanted.has(k)) {
        tiles.delete(k)
        dirty = true
      }
    }
  }

  function pump(): void {
    for (const w of wanted.values()) {
      if (pending.size >= MAX_INFLIGHT) return
      const k = key(w.tx, w.tz)
      if (pending.get(k) === w.cells || tiles.get(k)?.cells === w.cells) continue
      pending.set(k, w.cells)
      options.requestTile(k, { params, tx: w.tx, tz: w.tz, cells: w.cells }).then(
        (tile) => {
          if (disposed || pending.get(k) !== w.cells) return
          pending.delete(k)
          if (wanted.get(k)?.cells !== tile.cells) return
          tiles.set(k, tile)
          dirty = true
        },
        () => {
          // Cancelled or failed: forget the pending marker so a later update may retry (a cancel already removed it).
          if (pending.get(k) === w.cells) pending.delete(k)
        },
      )
    }
  }

  function syncMask(playerX: number, playerZ: number): void {
    const { version, coords } = options.residency()
    const pcx = Math.floor(playerX / chunkSize)
    const pcz = Math.floor(playerZ / chunkSize)
    if (version === residencyVersion && pcx === maskChunkX && pcz === maskChunkZ) return
    residencyVersion = version
    maskChunkX = pcx
    maskChunkZ = pcz
    maskData.fill(MASK_OPEN)
    for (const { cx, cz } of coords) {
      const mx = ((cx % FAR_MASK_SIZE) + FAR_MASK_SIZE) % FAR_MASK_SIZE
      const mz = ((cz % FAR_MASK_SIZE) + FAR_MASK_SIZE) % FAR_MASK_SIZE
      const dist = Math.max(Math.abs(cx - pcx), Math.abs(cz - pcz))
      maskData[mz * FAR_MASK_SIZE + mx] = dist >= FAR_CANOPY_KEEP_CHUNKS ? MASK_CANOPY : MASK_CLOSED
    }
    maskTexture.needsUpdate = true
  }

  function rebuild(): void {
    const slots: Record<FarTileCells, number> = { [FAR_TILE_CELLS_FINE]: 0, [FAR_TILE_CELLS_COARSE]: 0 }
    for (const tile of tiles.values()) {
      const level = levels[tile.cells as FarTileCells]
      const slot = slots[tile.cells as FarTileCells]
      if (slot >= level.capacity) continue
      slots[tile.cells as FarTileCells] = slot + 1
      writeTile(level, slot, tile)
    }
    for (const level of Object.values(levels)) {
      const used = slots[level.cells]
      level.geometry.setDrawRange(0, used * level.tileIndices)
      for (const name of ['position', 'normal', 'color', 'aCanopy'] as const) {
        const attr = level.geometry.getAttribute(name) as THREE.BufferAttribute
        attr.clearUpdateRanges()
        attr.addUpdateRange(0, used * level.tileVertices * attr.itemSize)
        attr.needsUpdate = true
      }
    }
    dirty = false
    lastRebuildMs = performance.now()
  }

  return {
    update(playerX, playerZ) {
      if (disposed) return
      syncMask(playerX, playerZ)
      // Level boundaries (450 m) depend on the exact position, so re-evaluate on a 32 m grid, not per tile.
      const gx = Math.floor(playerX / 32)
      const gz = Math.floor(playerZ / 32)
      if (gx !== lastCellX || gz !== lastCellZ) {
        lastCellX = gx
        lastCellZ = gz
        refreshWindow(playerX, playerZ)
      }
      pump()
      if (dirty && performance.now() - lastRebuildMs >= REBUILD_INTERVAL_MS) rebuild()
    },
    stats() {
      const fine = [...tiles.values()].filter((t) => t.cells === FAR_TILE_CELLS_FINE).length
      const coarse = tiles.size - fine
      return {
        fine,
        coarse,
        pending: pending.size,
        triangles: fine * (FAR_TILE_CELLS_FINE * FAR_TILE_CELLS_FINE * 2 + 8 * FAR_TILE_CELLS_FINE)
          + coarse * (FAR_TILE_CELLS_COARSE * FAR_TILE_CELLS_COARSE * 2 + 8 * FAR_TILE_CELLS_COARSE),
      }
    },
    dispose() {
      disposed = true
      for (const k of pending.keys()) options.cancelTile(k)
      pending.clear()
      tiles.clear()
      for (const level of Object.values(levels)) {
        scene.remove(level.mesh)
        level.geometry.dispose()
      }
      material.dispose()
      maskTexture.dispose()
    },
  }
}

/** Copies one tile into slot `slot` of a level's merged geometry (world-coordinate positions). */
function writeTile(level: Level, slot: number, tile: FarTileData): void {
  const side = tile.cells + 1
  const step = FAR_TILE_SIZE / tile.cells
  const originX = tile.tx * FAR_TILE_SIZE
  const originZ = tile.tz * FAR_TILE_SIZE
  const base = slot * level.tileVertices
  const position = (level.geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
  const normal = (level.geometry.getAttribute('normal') as THREE.BufferAttribute).array as Float32Array
  const color = (level.geometry.getAttribute('color') as THREE.BufferAttribute).array as Float32Array
  const canopy = (level.geometry.getAttribute('aCanopy') as THREE.BufferAttribute).array as Float32Array
  const gridCount = side * side
  for (let v = 0; v < level.tileVertices; v++) {
    const dst = (base + v) * 3
    let g: number
    if (v < gridCount) {
      g = v
    } else {
      // Skirt vertex: same x/z as the edge vertex it hangs under (see `skirtSourceIndex`).
      g = skirtSourceIndex(tile.cells, v - gridCount)
    }
    position[dst] = originX + (g % side) * step
    position[dst + 1] = tile.y[v]!
    position[dst + 2] = originZ + Math.floor(g / side) * step
    normal[dst] = tile.normal[v * 3]!
    normal[dst + 1] = tile.normal[v * 3 + 1]!
    normal[dst + 2] = tile.normal[v * 3 + 2]!
    color[dst] = tile.color[v * 3]!
    color[dst + 1] = tile.color[v * 3 + 1]!
    color[dst + 2] = tile.color[v * 3 + 2]!
    canopy[base + v] = tile.canopy[v]!
  }
}

/**
 * Lambert ground with a residency cut-out: fragments whose world XZ falls in a chunk with an attached terrain mesh are
 * discarded, so the streamed terrain (with roads, rivers, grass) is never covered or z-fought by the far ring. The canopy
 * shell (`aCanopy` raise, plan 066 F2) survives over chunks whose trees are LOD-thinned (mask value ~0.5) and is
 * discarded only where trees are at full LOD (mask 1).
 */
function createFarMaterial(mask: THREE.DataTexture, chunkSize: number): THREE.MeshLambertMaterial {
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
  material.polygonOffset = true
  material.polygonOffsetFactor = 1
  material.polygonOffsetUnits = 1
  material.name = 'farTerrain'
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFarMask = { value: mask }
    shader.uniforms.uFarChunkSize = { value: chunkSize }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vFarWorldXZ;\nvarying float vFarCanopy;\nattribute float aCanopy;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFarWorldXZ = position.xz;\nvFarCanopy = aCanopy;\ntransformed.y += aCanopy;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec2 vFarWorldXZ;
varying float vFarCanopy;
uniform sampler2D uFarMask;
uniform float uFarChunkSize;`,
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
{
  vec2 farChunk = floor(vFarWorldXZ / uFarChunkSize + 0.5);
  vec2 farUv = (mod(farChunk, ${FAR_MASK_SIZE.toFixed(1)}) + 0.5) / ${FAR_MASK_SIZE.toFixed(1)};
  float farMask = texture2D(uFarMask, farUv).r;
  if (farMask > 0.75) discard;
  if (farMask > 0.25 && vFarCanopy < 2.0) discard;
}`,
      )
  }
  material.customProgramCacheKey = () => 'farTerrain-v2'
  return material
}
