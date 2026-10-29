import type { MapDiscovery } from '../../world/map/mapDiscovery'
import type { MapRect } from '../../world/map/mapRasterTile'
import type { MapCanvasLike } from './mapTerrainLayer'
import { MAP_CELL_SIZE } from '../../world/map/mapConfig'
import { createMapFogGrid, MAP_FOG_ORIGIN, MAP_FOG_SIDE, type MapFogGrid } from '../../world/map/mapFogGrid'
import { parseMapCellKey } from '../../world/map/mapProjection'
import { MAP_FOG_RGB } from './mapColors'

export type MapFogLayer = {
  readonly grid: MapFogGrid
  /** Bumped on every discovery change. */
  readonly revision: number
  /** Draws the fog mask over `rect` into `ctx` (world-unit transform). */
  draw(ctx: CanvasRenderingContext2D, rect: MapRect): void
  dispose(): void
}

type DirtyRect = { ix0: number, iz0: number, ix1: number, iz1: number }

function defaultCreateCanvas(width: number, height: number): MapCanvasLike {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Fog of War presentation (plan ui-input-046): one pixel per 8-unit map cell
 * over the map extent, fully opaque where unexplored and feathered *inward*
 * on explored edges. Bilinear scaling at draw time softens the edges. Follows
 * `MapDiscovery` incrementally; a clear/restore repaints everything.
 *
 * @domain ui-input
 */
export function createMapFogLayer(
  discovery: MapDiscovery,
  createCanvas: (width: number, height: number) => MapCanvasLike = defaultCreateCanvas,
): MapFogLayer {
  const grid = createMapFogGrid()
  grid.reset(discovery.serialize())
  let canvas: MapCanvasLike | null = null
  let ctx2d: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null
  let dirty: DirtyRect | null = { ix0: 0, iz0: 0, ix1: MAP_FOG_SIDE - 1, iz1: MAP_FOG_SIDE - 1 }
  let revision = 0

  const markDirty = (ix: number, iz: number) => {
    // ±1: a new explored cell changes its neighbours' edge feathering too.
    const ix0 = Math.max(0, ix - 1)
    const iz0 = Math.max(0, iz - 1)
    const ix1 = Math.min(MAP_FOG_SIDE - 1, ix + 1)
    const iz1 = Math.min(MAP_FOG_SIDE - 1, iz + 1)
    if (!dirty) dirty = { ix0, iz0, ix1, iz1 }
    else {
      dirty.ix0 = Math.min(dirty.ix0, ix0)
      dirty.iz0 = Math.min(dirty.iz0, iz0)
      dirty.ix1 = Math.max(dirty.ix1, ix1)
      dirty.iz1 = Math.max(dirty.iz1, iz1)
    }
  }

  const unsubscribe = discovery.subscribe((change) => {
    revision++
    if (change.kind === 'reset') {
      grid.reset(discovery.serialize())
      dirty = { ix0: 0, iz0: 0, ix1: MAP_FOG_SIDE - 1, iz1: MAP_FOG_SIDE - 1 }
      return
    }
    for (const key of change.keys) {
      const cell = parseMapCellKey(key)
      if (!cell) continue
      const index = grid.add(cell.cx, cell.cz)
      if (index >= 0) markDirty(index % MAP_FOG_SIDE, Math.floor(index / MAP_FOG_SIDE))
    }
  })

  function flush(): boolean {
    if (!canvas) {
      canvas = createCanvas(MAP_FOG_SIDE, MAP_FOG_SIDE)
      ctx2d = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
    }
    if (!ctx2d) return false
    if (!dirty) return true
    const { ix0, iz0, ix1, iz1 } = dirty
    dirty = null
    const w = ix1 - ix0 + 1
    const h = iz1 - iz0 + 1
    const image = ctx2d.createImageData(w, h)
    const data = image.data
    const [r, g, b] = MAP_FOG_RGB
    // Opaque fog everywhere (one typed fill; RGBA bytes on little-endian),
    // then only explored cells — the only ones that can be translucent —
    // get their feathered alpha. Keeps a full 1024² repaint cheap.
    new Uint32Array(data.buffer).fill(((255 << 24) | (b << 16) | (g << 8) | r) >>> 0)
    const cells = grid.cells
    for (let z = 0; z < h; z++) {
      const row = (iz0 + z) * MAP_FOG_SIDE + ix0
      for (let x = 0; x < w; x++) {
        if (cells[row + x] === 1) data[(z * w + x) * 4 + 3] = grid.alphaAt(ix0 + x, iz0 + z)
      }
    }
    ctx2d.putImageData(image, ix0, iz0)
    return true
  }

  return {
    grid,
    get revision() {
      return revision
    },
    draw(ctx, rect) {
      if (!flush() || !canvas) return
      const ix0 = Math.max(0, Math.floor((rect.minX - MAP_FOG_ORIGIN) / MAP_CELL_SIZE) - 1)
      const iz0 = Math.max(0, Math.floor((rect.minZ - MAP_FOG_ORIGIN) / MAP_CELL_SIZE) - 1)
      const ix1 = Math.min(MAP_FOG_SIDE, Math.ceil((rect.maxX - MAP_FOG_ORIGIN) / MAP_CELL_SIZE) + 1)
      const iz1 = Math.min(MAP_FOG_SIDE, Math.ceil((rect.maxZ - MAP_FOG_ORIGIN) / MAP_CELL_SIZE) + 1)
      if (ix1 <= ix0 || iz1 <= iz0) return
      const smoothing = ctx.imageSmoothingEnabled
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(
        canvas,
        ix0,
        iz0,
        ix1 - ix0,
        iz1 - iz0,
        MAP_FOG_ORIGIN + ix0 * MAP_CELL_SIZE,
        MAP_FOG_ORIGIN + iz0 * MAP_CELL_SIZE,
        (ix1 - ix0) * MAP_CELL_SIZE,
        (iz1 - iz0) * MAP_CELL_SIZE,
      )
      ctx.imageSmoothingEnabled = smoothing
    },
    dispose() {
      unsubscribe()
      canvas = null
      ctx2d = null
    },
  }
}
