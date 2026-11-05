import * as THREE from 'three'
import { type RawSampleParams, sampleRawTexelAt } from './chunkHeightmap'
import { classifyBiomeColor, isFarLake } from './farTileColor'

/** World size of one far-terrain tile (m). Tiles are world-aligned: tile `(tx, tz)` spans `[tx·size, (tx+1)·size)`. */
export const FAR_TILE_SIZE = 256

/** Cells per tile edge at the two far levels (8 m and 16 m grids, plan world-terrain-066 notes §4). */
export const FAR_TILE_CELLS_FINE = 32
export const FAR_TILE_CELLS_COARSE = 16

/** Skirt drop under the tile edge (m) — hides cracks where an 8 m tile meets a 16 m tile. */
export const FAR_SKIRT_DROP = 6

/** Far vertices sit this far under the raw surface (m) so a seam against streamed terrain never pokes through. */
export const FAR_SURFACE_DROP = 0.3

export type FarTileRequest = {
  params: RawSampleParams
  tx: number
  tz: number
  /** `FAR_TILE_CELLS_FINE` or `FAR_TILE_CELLS_COARSE`. */
  cells: number
}

export type FarTileData = {
  tx: number
  tz: number
  cells: number
  /** Grid vertices `(cells + 1)²` (row-major z-then-x) followed by the skirt ring (`4 · cells`, see `skirtSourceIndex`). */
  y: Float32Array
  normal: Float32Array
  color: Float32Array
  elapsedMs: number
}

/** Vertex count of the grid part of a far tile. */
export function farGridVertexCount(cells: number): number {
  return (cells + 1) * (cells + 1)
}

/** Total vertex count including the skirt ring. */
export function farTileVertexCount(cells: number): number {
  return farGridVertexCount(cells) + 4 * cells
}

/**
 * Grid index of the edge vertex a skirt vertex hangs under. Ring order: south edge (z = 0) west→east, east edge,
 * north edge east→west, west edge north→south; each edge contributes `cells` vertices (the last corner belongs to the
 * next edge), so the ring closes without a duplicate.
 */
export function skirtSourceIndex(cells: number, k: number): number {
  const side = cells + 1
  const edge = Math.floor(k / cells)
  const t = k % cells
  if (edge === 0) return t // z = 0, x = t
  if (edge === 1) return t * side + cells // x = cells, z = t
  if (edge === 2) return cells * side + (cells - t) // z = cells, x = cells - t
  return (cells - t) * side // x = 0, z = cells - t
}

/**
 * Builds the shared (index) buffer of one far tile: grid triangles, then skirt quads (outward-facing). Same topology
 * for every tile of a given `cells`, so callers build it once per level.
 */
export function buildFarTileIndices(cells: number): Uint32Array {
  const side = cells + 1
  const gridTris = cells * cells * 2
  const skirtTris = 4 * cells * 2
  const out = new Uint32Array((gridTris + skirtTris) * 3)
  let o = 0
  for (let z = 0; z < cells; z++) {
    for (let x = 0; x < cells; x++) {
      const a = z * side + x
      const b = a + 1
      const c = a + side
      const d = c + 1
      // Counter-clockwise seen from +Y with x east, z south (Three.js: +Z toward viewer when looking down −Y).
      out[o++] = a; out[o++] = c; out[o++] = b
      out[o++] = b; out[o++] = c; out[o++] = d
    }
  }
  const base = farGridVertexCount(cells)
  for (let k = 0; k < 4 * cells; k++) {
    const top0 = skirtSourceIndex(cells, k)
    const top1 = skirtSourceIndex(cells, (k + 1) % (4 * cells))
    const low0 = base + k
    const low1 = base + ((k + 1) % (4 * cells))
    // Ring runs counter-clockwise seen from above; outward-facing quad = top0, low0, top1 / top1, low0, low1 reversed
    // winding is irrelevant for the material (DoubleSide) — skirts are only ever seen at cracks.
    out[o++] = top0; out[o++] = low0; out[o++] = top1
    out[o++] = top1; out[o++] = low0; out[o++] = low1
  }
  return out
}

const tmpColor = new THREE.Color()

/**
 * One far-terrain tile (plan world-terrain-066 F1). Pure and deterministic in `(params, tx, tz, cells)`; runs in the
 * chunk worker (`farTile` job). Heights are the raw map-raster surface (`sampleRawTexelAt`, no roads/rivers/village
 * shaping — notes §1), minus {@link FAR_SURFACE_DROP}. Sea vertices follow the bathymetry (the ocean plane draws over
 * them); lake vertices sit at the lake surface in a flat water colour. Colours reuse the streamed terrain's palette
 * (`biomeColors.ts`). Presentation only: never read by simulation, collision, AI, map or saves.
 *
 * @domain world-terrain
 */
export function computeFarTile(request: FarTileRequest): FarTileData {
  const started = performance.now()
  const { params, tx, tz, cells } = request
  const step = FAR_TILE_SIZE / cells
  const side = cells + 1
  const originX = tx * FAR_TILE_SIZE
  const originZ = tz * FAR_TILE_SIZE

  // Apron-inclusive sample grid (−1 … cells + 1) so edge normals use true neighbours and tiles stay seamless.
  const apron = cells + 3
  const surface = new Float32Array(apron * apron)
  const texels: ReturnType<typeof sampleRawTexelAt>[] = new Array(apron * apron)
  for (let j = 0; j < apron; j++) {
    for (let i = 0; i < apron; i++) {
      const texel = sampleRawTexelAt(originX + (i - 1) * step, originZ + (j - 1) * step, params)
      texels[j * apron + i] = texel
      surface[j * apron + i] = farRenderHeight(texel, params)
    }
  }

  const count = farTileVertexCount(cells)
  const y = new Float32Array(count)
  const normal = new Float32Array(count * 3)
  const color = new Float32Array(count * 3)
  for (let j = 0; j < side; j++) {
    for (let i = 0; i < side; i++) {
      const g = j * side + i
      const a = (j + 1) * apron + (i + 1)
      const texel = texels[a]!
      const h = surface[a]!
      y[g] = h
      const dHdx = (surface[a + 1]! - surface[a - 1]!) / (2 * step)
      const dHdz = (surface[a + apron]! - surface[a - apron]!) / (2 * step)
      const nLen = Math.hypot(dHdx, 1, dHdz)
      normal[g * 3] = -dHdx / nLen
      normal[g * 3 + 1] = 1 / nLen
      normal[g * 3 + 2] = -dHdz / nLen
      classifyBiomeColor(texel, h, 1 - 1 / nLen, originX + i * step, originZ + j * step, params, tmpColor)
      color[g * 3] = tmpColor.r
      color[g * 3 + 1] = tmpColor.g
      color[g * 3 + 2] = tmpColor.b
    }
  }

  // Skirt ring: the same position/colour/normal as its edge vertex, dropped.
  const base = farGridVertexCount(cells)
  for (let k = 0; k < 4 * cells; k++) {
    const src = skirtSourceIndex(cells, k)
    const dst = base + k
    y[dst] = y[src]! - FAR_SKIRT_DROP
    for (let c = 0; c < 3; c++) {
      normal[dst * 3 + c] = normal[src * 3 + c]!
      color[dst * 3 + c] = color[src * 3 + c]!
    }
  }

  return { tx, tz, cells, y, normal, color, elapsedMs: performance.now() - started }
}

/** Render height of one raw sample: lake → lake surface, sea/land → floor (bathymetry for sea), minus the seam drop. */
function farRenderHeight(texel: ReturnType<typeof sampleRawTexelAt>, params: RawSampleParams): number {
  if (isFarLake(texel, params)) return texel.h - FAR_SURFACE_DROP
  return texel.floorH - FAR_SURFACE_DROP
}
