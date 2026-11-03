import type { MapTileData } from '../../world/map/mapRasterTile'

export type RiverStroke = { path: Path2D, width: number }

/** Groups a tile's river runs by quantised width — one stroke call per bucket. */
export function buildRiverStrokes(tile: MapTileData): RiverStroke[] {
  // Group runs by quantised width — one stroke call per width bucket.
  const byWidth = new Map<number, Path2D>()
  let offset = 0
  for (const count of tile.riverRuns) {
    let widthSum = 0
    for (let p = 0; p < count; p++) widthSum += tile.riverPoints[(offset + p) * 3 + 2]!
    const width = Math.max(0.5, Math.round((widthSum / count) * 2) / 2)
    let path = byWidth.get(width)
    if (!path) {
      path = new Path2D()
      byWidth.set(width, path)
    }
    for (let p = 0; p < count; p++) {
      const x = tile.riverPoints[(offset + p) * 3]!
      const z = tile.riverPoints[(offset + p) * 3 + 1]!
      if (p === 0) path.moveTo(x, z)
      else path.lineTo(x, z)
    }
    offset += count
  }
  return [...byWidth].map(([width, path]) => ({ path, width }))
}
