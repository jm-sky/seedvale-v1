import type { NpcAgent } from '../../ai/NpcAgent'
import { getActiveNavigationTargets } from '../../world/locations/navigationTargets'
import { worldLocationKindFromId } from '../../world/locations/worldLocationTypes'
import { getActiveMapData } from '../../world/map/mapData'
import { selectMapRasterStep } from '../../world/map/mapRasterTile'
import { locationKindColor, MAP_FOG_FILL, targetSlotColor } from './mapColors'
import { drawMapRasterLayers, getActiveMapRasterLayers } from './mapRasterLayers'
import { selectNearbyMinimapPois } from './minimapLocationMarkers'
import type { Vector3 } from 'three'

export type MinimapSettlement = {
  position: Vector3
  npcs: readonly NpcAgent[]
  name: string
}

/** Canvas size in CSS px (square) — smaller on touch so the expanded map has
 *  less chance of reaching into the bottom-right action-button cluster on a
 *  short landscape viewport. */
export function minimapSize(touch: boolean): number {
  return touch ? 130 : 200
}

/** World units → minimap px at the `near` zoom step (≈200 units across a
 *  200 px minimap; plan ui-input-046). */
export const MINIMAP_SCALE = 1

export const DEFAULT_ARROW_TIP_SIZE = 7

/** Two discrete minimap scales instead of continuous zoom (author decision,
 *  2026-10-29): `near` ≈200 units across, `far` ≈400. */
export type MinimapZoomLevel = 'near' | 'far'

const MINIMAP_ZOOM_SCALE: Record<MinimapZoomLevel, number> = {
  near: MINIMAP_SCALE,
  far: MINIMAP_SCALE / 2,
}

let minimapZoom: MinimapZoomLevel = 'near'

export function getMinimapZoom(): MinimapZoomLevel {
  return minimapZoom
}

export function setMinimapZoom(level: MinimapZoomLevel): void {
  minimapZoom = level
}

/** Minimap px per world unit for `level`. */
export function minimapScale(level: MinimapZoomLevel = minimapZoom): number {
  return MINIMAP_ZOOM_SCALE[level]
}

/** Raster LOD never finer than this on the minimap — its two fixed scales
 *  don't need 1-unit samples, and that keeps cold travel cheap. */
const MINIMAP_MIN_RASTER_STEP = 2

export type MinimapDrawContext = {
  ctx: CanvasRenderingContext2D
  size: number
}

/** Small filled triangle at (x, y) pointing along the unit direction (dirX, dirY). */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dirX: number,
  dirY: number,
  tipSize = DEFAULT_ARROW_TIP_SIZE,
  outline = false,
): void {
  const perpX = -dirY
  const perpY = dirX
  ctx.beginPath()
  ctx.moveTo(x + dirX * tipSize, y + dirY * tipSize)
  ctx.lineTo(x - dirX * tipSize + perpX * tipSize * 0.6, y - dirY * tipSize + perpY * tipSize * 0.6)
  ctx.lineTo(x - dirX * tipSize - perpX * tipSize * 0.6, y - dirY * tipSize - perpY * tipSize * 0.6)
  ctx.closePath()
  ctx.fill()

  if (outline) {
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.75)'
    ctx.lineWidth = 2.5
    ctx.stroke()
  }
}

/**
 * Heading-up minimap: canvas up = player look direction (`MouseLook` yaw).
 * World −Z is north; with yaw=0 that already maps to canvas up, so rotating
 * world deltas by yaw keeps forward at the top.
 */
export function drawMinimapFrame(
  { ctx, size }: MinimapDrawContext,
  playerPos: Vector3,
  settlements: readonly MinimapSettlement[],
  yaw: number,
): void {
  const scale = minimapScale()
  const halfRange = size / 2 / scale
  const arrowRadius = size / 2 - 14
  const northRadius = size / 2 - 10
  const cos = Math.cos(yaw)
  const sin = Math.sin(yaw)

  ctx.fillStyle = MAP_FOG_FILL
  ctx.fillRect(0, 0, size, size)

  const centerX = size / 2
  const centerY = size / 2

  const toMap = (worldX: number, worldZ: number): { x: number, y: number } => {
    const dx = worldX - playerPos.x
    const dz = worldZ - playerPos.z
    const rx = dx * cos - dz * sin
    const ry = dx * sin + dz * cos
    return { x: centerX + rx * scale, y: centerY + ry * scale }
  }

  const rotateDelta = (dx: number, dz: number): { x: number, y: number } => ({
    x: dx * cos - dz * sin,
    y: dx * sin + dz * cos,
  })

  const mapData = getActiveMapData()
  const queryRange = halfRange * Math.SQRT2
  const viewport = {
    minX: playerPos.x - queryRange,
    maxX: playerPos.x + queryRange,
    minZ: playerPos.z - queryRange,
    maxZ: playerPos.z + queryRange,
  }

  // Cached raster terrain + fog under the same heading-up transform `toMap` uses.
  const layers = getActiveMapRasterLayers()
  if (layers) {
    const devicePxPerUnit = scale * Math.abs(ctx.getTransform().a)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(yaw)
    ctx.scale(scale, scale)
    ctx.translate(-playerPos.x, -playerPos.z)
    drawMapRasterLayers(
      ctx,
      layers,
      'minimap',
      viewport,
      selectMapRasterStep(devicePxPerUnit, MINIMAP_MIN_RASTER_STEP),
      scale,
    )
    ctx.restore()
  }

  ctx.fillStyle = '#4a89e0'
  for (const settlement of settlements) {
    for (const npc of settlement.npcs) {
      const { x, y } = toMap(npc.mesh.position.x, npc.mesh.position.z)
      if (x < 0 || x > size || y < 0 || y > size) continue
      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const targets = getActiveNavigationTargets()?.list() ?? []
  const activeTargetIds = new Set(targets.map((t) => t.id))

  if (mapData) {
    const nearbyPois = selectNearbyMinimapPois(
      mapData.knownLocations(viewport),
      activeTargetIds,
      (location) => {
        const { x, y } = toMap(location.x, location.z)
        return x >= 0 && x <= size && y >= 0 && y <= size
      },
    )
    for (const location of nearbyPois) {
      const kind = worldLocationKindFromId(location.id)
      const { x, y } = toMap(location.x, location.z)
      ctx.fillStyle = locationKindColor(kind)
      ctx.globalAlpha = location.state === 'discovered' ? 0.65 : 1
      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }

  for (const target of targets) {
    const location = mapData?.resolveKnown(target.id)
    if (!location) continue
    const color = targetSlotColor(target.slot)
    const dx = location.x - playerPos.x
    const dz = location.z - playerPos.z
    const dist = Math.hypot(dx, dz)

    if (dist <= halfRange) {
      const { x, y } = toMap(location.x, location.z)
      ctx.fillStyle = color
      ctx.fillRect(x - 4, y - 4, 8, 8)

      ctx.strokeStyle = 'rgba(10, 10, 10, 0.75)'
      ctx.lineWidth = 2
      ctx.strokeRect(x - 4.5, y - 4.5, 9, 9)

      if (location.label) {
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(20, 24, 28, 0.85)'
        ctx.fillText(location.label, x + 1, y + 17)
        ctx.fillStyle = '#f2f6fa'
        ctx.fillText(location.label, x, y + 16)
      }
    } else if (dist > 1e-4) {
      const rotated = rotateDelta(dx, dz)
      const len = Math.hypot(rotated.x, rotated.y)
      const dirX = rotated.x / len
      const dirY = rotated.y / len
      ctx.fillStyle = color
      drawArrow(ctx, centerX + dirX * arrowRadius, centerY + dirY * arrowRadius, dirX, dirY, DEFAULT_ARROW_TIP_SIZE, true)
    }
  }

  // True north (−Z) after heading rotation → rim marker.
  const northX = centerX + sin * northRadius
  const northY = centerY - cos * northRadius
  ctx.font = 'bold 12px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(20, 24, 28, 0.85)'
  ctx.fillText('N', northX + 1, northY + 1)
  ctx.fillStyle = '#f2f6fa'
  ctx.fillText('N', northX, northY)

  // Player: fixed upward triangle (canvas up = look direction).
  ctx.fillStyle = '#f2f6fa'
  drawArrow(ctx, centerX, centerY, 0, -1, 6)

  maskToLens(ctx, size)
}

/** Round lens (V3 minimap): keep only the inscribed circle, then a dark rim.
 *  `destination-in` rather than `clip()` — a curved clip came out empty on
 *  some WSL GPU drivers in V3. */
function maskToLens(ctx: CanvasRenderingContext2D, size: number): void {
  const c = size / 2
  ctx.save()
  ctx.globalCompositeOperation = 'destination-in'
  ctx.beginPath()
  ctx.arc(c, c, c, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.beginPath()
  ctx.arc(c, c, c - 1, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()
}

type MinimapDrawer = (playerPos: Vector3, settlements: readonly MinimapSettlement[], yaw: number) => void

let registeredDrawer: MinimapDrawer | null = null
let lastPlayerX = 0
let lastPlayerZ = 0
let lastPlayerYaw = 0

export function lastMinimapPlayer(): { x: number, z: number, yaw: number } {
  return { x: lastPlayerX, z: lastPlayerZ, yaw: lastPlayerYaw }
}

/** MinimapScreen registers an imperative drawer so gameLoop can paint without
 *  putting per-frame positions into Vue reactive state. */
export function registerMinimapDrawer(drawer: MinimapDrawer | null): void {
  registeredDrawer = drawer
}

export function updateRegisteredMinimap(
  playerPos: Vector3,
  settlements: readonly MinimapSettlement[],
  yaw: number,
): void {
  lastPlayerX = playerPos.x
  lastPlayerZ = playerPos.z
  lastPlayerYaw = yaw
  registeredDrawer?.(playerPos, settlements, yaw)
}
