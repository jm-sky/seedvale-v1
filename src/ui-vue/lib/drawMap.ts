import type { MapKnownLocation, MapViewport } from '../../world/map/mapTypes'
import { getActiveNavigationTargets } from '../../world/locations/navigationTargets'
import { worldLocationKindFromId } from '../../world/locations/worldLocationTypes'
import {
  MAP_EXTENT_HALF,
  MAP_WORLD_ZOOM_MAX,
  MAP_WORLD_ZOOM_MIN,
} from '../../world/map/mapConfig'
import { getActiveMapData } from '../../world/map/mapData'
import { selectMapRasterStep } from '../../world/map/mapRasterTile'
import { LOCATION_KIND_EMOJI, locationKindColor, MAP_FOG_FILL, MAP_UNAVAILABLE_FILL, targetSlotColor } from './mapColors'
import { resolveMapLocationLabelPresentations } from './mapLocationLabelLayout'
import { drawMapRasterLayers, getActiveMapRasterLayers } from './mapRasterLayers'

export type WorldMapView = {
  viewX: number
  viewZ: number
  zoom: number
}

export type WorldMapDrawContext = {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
}

export function clampWorldMapZoom(zoom: number): number {
  return Math.min(MAP_WORLD_ZOOM_MAX, Math.max(MAP_WORLD_ZOOM_MIN, zoom))
}

export function worldToCanvas(
  worldX: number,
  worldZ: number,
  view: WorldMapView,
  width: number,
  height: number,
): { x: number, y: number } {
  return {
    x: width / 2 + (worldX - view.viewX) * view.zoom,
    y: height / 2 + (worldZ - view.viewZ) * view.zoom,
  }
}

export function canvasToWorld(
  canvasX: number,
  canvasY: number,
  view: WorldMapView,
  width: number,
  height: number,
): { x: number, z: number } {
  return {
    x: view.viewX + (canvasX - width / 2) / view.zoom,
    z: view.viewZ + (canvasY - height / 2) / view.zoom,
  }
}

export function viewportFor(
  view: WorldMapView,
  width: number,
  height: number,
): MapViewport {
  const halfW = width / 2 / view.zoom
  const halfH = height / 2 / view.zoom
  return {
    minX: view.viewX - halfW,
    maxX: view.viewX + halfW,
    minZ: view.viewZ - halfH,
    maxZ: view.viewZ + halfH,
  }
}

/**
 * Unit look direction on the north-up world map canvas from `MouseLook` yaw.
 * Canvas +Y follows world +Z; yaw `0` points north (canvas up).
 *
 * @domain ui-input
 */
export function worldMapPlayerLookDirection(yaw: number): { dirX: number, dirY: number } {
  return { dirX: -Math.sin(yaw), dirY: -Math.cos(yaw) }
}

/** Terrain-layer consumer id of the world map (see `MapTerrainLayer.clearConsumer`). */
export const WORLD_MAP_RASTER_CONSUMER = 'worldMap'

function drawUnavailable(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = MAP_UNAVAILABLE_FILL
  ctx.fillRect(0, 0, width, height)
}

/**
 * North-up world map. Canvas +Y follows world +Z (world −Z / north is up).
 * Call only when the overlay is visible — not every game frame.
 */
export function drawWorldMapFrame(
  { ctx, width, height }: WorldMapDrawContext,
  view: WorldMapView,
  playerX: number,
  playerZ: number,
  playerYaw: number,
): void {
  drawUnavailable(ctx, width, height)

  const viewport = viewportFor(view, width, height)
  const mapData = getActiveMapData()

  ctx.fillStyle = MAP_FOG_FILL
  const fogOrigin = worldToCanvas(-MAP_EXTENT_HALF, -MAP_EXTENT_HALF, view, width, height)
  const fogSize = MAP_EXTENT_HALF * 2 * view.zoom
  ctx.fillRect(fogOrigin.x, fogOrigin.y, fogSize, fogSize)

  // Raster terrain LOD follows zoom; `worldToCanvas` as a canvas transform.
  const layers = getActiveMapRasterLayers()
  if (layers) {
    const devicePxPerUnit = view.zoom * Math.abs(ctx.getTransform().a)
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(view.zoom, view.zoom)
    ctx.translate(-view.viewX, -view.viewZ)
    drawMapRasterLayers(ctx, layers, WORLD_MAP_RASTER_CONSUMER, viewport, selectMapRasterStep(devicePxPerUnit), view.zoom)
    ctx.restore()
  }

  if (mapData) {
    const targetSlotById = new Map((getActiveNavigationTargets()?.list() ?? []).map((t) => [t.id, t.slot]))
    const activeTargetIds = new Set(targetSlotById.keys())
    const knownLocations = mapData.knownLocations(viewport)
    const mineBinding = mapData.catalog.abandonedMineBinding()

    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const presentations = resolveMapLocationLabelPresentations(
      knownLocations,
      activeTargetIds,
      mineBinding,
      (location) => worldToCanvas(location.x, location.z, view, width, height),
      (text) => ctx.measureText(text).width,
    )
    for (const presentation of presentations) {
      const location = presentation.location
      const { x, y } = worldToCanvas(location.x, location.z, view, width, height)
      const targetSlot = targetSlotById.get(location.id)
      // Kind read from the id prefix, not `location.kind` — the latter is
      // the map's coarse `settlement`/`landmark` split (`mapData.ts`), while
      // the id encodes the real `WorldLocationKind` (see
      // `worldLocationKindFromId`).
      const kind = worldLocationKindFromId(location.id)
      ctx.fillStyle = targetSlot != null ? targetSlotColor(targetSlot) : locationKindColor(kind)
      if (presentation.showMarker) {
        if (location.areaRadius && location.areaRadius > 0) {
          const radiusPx = location.areaRadius * view.zoom
          ctx.beginPath()
          ctx.arc(x, y, radiusPx, 0, Math.PI * 2)
          ctx.globalAlpha = 0.16
          ctx.fill()
          ctx.globalAlpha = 0.75
          ctx.lineWidth = 1.5
          ctx.strokeStyle = ctx.fillStyle
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        // `estimated`/`discovered`/`confirmed` read as outline / translucent /
        // solid (plan §16/§22 — visually distinguishable without extra UI).
        if (location.state === 'estimated') {
          ctx.globalAlpha = 1
          ctx.strokeStyle = ctx.fillStyle
          ctx.lineWidth = 1.5
          ctx.strokeRect(x - 5, y - 5, 10, 10)
        } else {
          ctx.globalAlpha = location.state === 'discovered' ? 0.65 : 1
          ctx.fillRect(x - 5, y - 5, 10, 10)
          ctx.globalAlpha = 1
        }
        // Native-colour emoji glyph — a colour-independent cue for kind,
        // alongside (never instead of) the marker fill colour.
        if (kind) {
          ctx.globalAlpha = 1
          ctx.fillText(LOCATION_KIND_EMOJI[kind], x, y - 13)
        }
      }
      if (presentation.showLabel && presentation.labelText) {
        const lx = x + presentation.labelOffsetX
        const ly = y + presentation.labelOffsetY
        ctx.fillStyle = 'rgba(20, 24, 28, 0.85)'
        ctx.fillText(presentation.labelText, lx + 1, ly + 1)
        ctx.fillStyle = '#f2f6fa'
        ctx.fillText(presentation.labelText, lx, ly)
      }
    }
  }

  const player = worldToCanvas(playerX, playerZ, view, width, height)
  const { dirX, dirY } = worldMapPlayerLookDirection(playerYaw)
  const perpX = -dirY
  const perpY = dirX
  ctx.fillStyle = '#f2f6fa'
  ctx.beginPath()
  ctx.moveTo(player.x + dirX * 7, player.y + dirY * 7)
  ctx.lineTo(player.x - dirX * 7 + perpX * 5, player.y - dirY * 7 + perpY * 5)
  ctx.lineTo(player.x - dirX * 7 - perpX * 5, player.y - dirY * 7 - perpY * 5)
  ctx.closePath()
  ctx.fill()

  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(20, 24, 28, 0.85)'
  ctx.fillText('N', width / 2 + 1, 16)
  ctx.fillStyle = '#f2f6fa'
  ctx.fillText('N', width / 2, 15)
}

/** Nearest known location to a canvas click, within `maxCanvasPx` (plan §12
 *  "Kliknięcie lokacji na mapie otwiera informacje o niej" — a hit-test
 *  against world data, never canvas pixel colour, and never a discovery
 *  side effect). `null` when nothing known is close enough. */
export function findLocationAtCanvasPoint(
  view: WorldMapView,
  width: number,
  height: number,
  canvasX: number,
  canvasY: number,
  maxCanvasPx = 10,
): MapKnownLocation | null {
  const mapData = getActiveMapData()
  if (!mapData) return null
  const { x: worldX, z: worldZ } = canvasToWorld(canvasX, canvasY, view, width, height)
  const maxWorldDist = maxCanvasPx / view.zoom
  const viewport = {
    minX: worldX - maxWorldDist,
    maxX: worldX + maxWorldDist,
    minZ: worldZ - maxWorldDist,
    maxZ: worldZ + maxWorldDist,
  }
  let nearest: MapKnownLocation | null = null
  let nearestDist = Infinity
  for (const location of mapData.knownLocations(viewport)) {
    const dist = Math.hypot(location.x - worldX, location.z - worldZ)
    if (dist <= maxWorldDist && dist < nearestDist) {
      nearest = location
      nearestDist = dist
    }
  }
  return nearest
}
