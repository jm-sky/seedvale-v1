import {
  ClampToEdgeWrapping,
  DataTexture,
  FloatType,
  LinearFilter,
  Mesh,
  PlaneGeometry,
  RedFormat,
  type Scene,
  type ShaderMaterial,
  type Vector3,
} from 'three'
import { WET_EPS } from '../terrain/waterSurface'
import { createWaterMaterial, setWaterDayNight, tickWaterTime } from './waterMaterial'
import { bindWaterMirror, WATER_RENDER_LAYER, type WaterMirror } from './waterMirror'

export type WorldWater = {
  /** First (sea-level if present, else lowest lake) mesh — kept for callers that need one handle. */
  mesh: Mesh
  /** Every water mesh of the chunk: the sea-level plane and one plane per distinct lake level (plan 058 L2). */
  meshes: Mesh[]
  update: (dt: number) => void
  /** 0 = full night, 1 = full day — darkens/tints water in step with sky/fog/lights. */
  setDayNight: (dayFactor: number, sunDirection: Vector3) => void
  addTo: (scene: Scene) => void
  dispose: () => void
}

function createDataTexture(data: Float32Array, resolution: number): DataTexture {
  const tex = new DataTexture(data, resolution, resolution, RedFormat, FloatType)
  tex.wrapS = ClampToEdgeWrapping
  tex.wrapT = ClampToEdgeWrapping
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.needsUpdate = true
  return tex
}

/** Cap on water mesh segments — keeps the shoreline mask sharp without matching
 *  the terrain 1:1 at very high resolutions (water doesn't need that much detail). */
const MAX_WATER_SEGMENTS = 256

/** Lake surfaces closer than this (m) to the sea-level plane's soft shore band are treated as sea level. */
const SEA_BAND = 0.35
/** Lake levels are grouped at this resolution (m); a group's plane sits at its highest texel. */
const LEVEL_QUANT = 0.01
/** Marker lift for texels that must read as dry in a lake plane's cover mask (> the shader's +0.35 soft band). */
const DRY_LIFT = 10

/**
 * Distinct lake surface levels present in a chunk (wet texels — `h − floor > WET_EPS` — above the sea-level
 * band), ascending. Sea-level water is drawn by the base plane and is not listed here.
 */
export function lakeLevelsInChunk(
  heights: Float32Array,
  floorHeights: Float32Array,
  waterLevel: number,
): number[] {
  const groups = new Map<number, number>()
  for (let i = 0; i < heights.length; i++) {
    const h = heights[i]!
    if (h <= waterLevel + SEA_BAND || h - floorHeights[i]! <= WET_EPS) continue
    const key = Math.round(h / LEVEL_QUANT)
    const prev = groups.get(key)
    if (prev === undefined || h > prev) groups.set(key, h)
  }
  return [...groups.values()].sort((a, b) => a - b)
}

/**
 * Cover-mask heights for the lake plane at `level`: wet texels of that level keep `level`, dry banks at or above
 * it keep their floor (soft shoreline), everything else (other levels, lower dry ground) is lifted out of the
 * shader's cover band so the plane never draws there.
 */
export function maskHeightsForLakeLevel(
  heights: Float32Array,
  floorHeights: Float32Array,
  level: number,
): Float32Array {
  const out = new Float32Array(heights.length)
  for (let i = 0; i < heights.length; i++) {
    const h = heights[i]!
    const floor = floorHeights[i]!
    const wet = h - floor > WET_EPS
    if (wet) out[i] = Math.abs(h - level) <= LEVEL_QUANT ? level : level + DRY_LIFT
    else out[i] = floor >= level ? floor : level + DRY_LIFT
  }
  return out
}

/**
 * Per-chunk water from the shared lake/ocean shader family. Waves live in
 * world XZ so neighbouring chunks stay in phase. Ocean cells (bodyScale 1)
 * are drawn here with the shoreline mask — the singleton ocean fills only
 * the open sea beyond loaded chunks. Lakes (plan 058 L2) get one plane per
 * distinct surface level in the chunk, at that level, **without** the planar
 * mirror (sky/fog tint and sun specular only — author, 2026-11-02).
 * Returns `null` when the chunk has no submerged texels at all, so dry chunks
 * (the common case in an open world) cost nothing.
 */
export function createChunkWater(
  heights: Float32Array,
  floorHeights: Float32Array,
  bodyScale: Float32Array,
  resolution: number,
  chunkOriginX: number,
  chunkOriginZ: number,
  chunkSize: number,
  waterLevel: number,
  waterMirror?: WaterMirror,
): WorldWater | null {
  let hasSea = false
  for (let i = 0; i < heights.length; i++) {
    if (heights[i]! <= waterLevel + SEA_BAND) {
      hasSea = true
      break
    }
  }
  const lakeLevels = lakeLevelsInChunk(heights, floorHeights, waterLevel)
  if (!hasSea && lakeLevels.length === 0) return null

  const segments = Math.min(resolution - 1, MAX_WATER_SEGMENTS)
  const geometry = new PlaneGeometry(chunkSize, chunkSize, segments, segments)
  geometry.rotateX(-Math.PI / 2)

  const floorTex = createDataTexture(floorHeights, resolution)
  const bodyScaleTex = createDataTexture(bodyScale, resolution)
  const textures: DataTexture[] = [floorTex, bodyScaleTex]
  const materials: ShaderMaterial[] = []
  const meshes: Mesh[] = []

  const addPlane = (level: number, heightData: Float32Array, mirror: WaterMirror | undefined): void => {
    const heightTex = createDataTexture(heightData, resolution)
    textures.push(heightTex)
    const material = createWaterMaterial({
      ocean: 0,
      waterLevel: level,
      mapSize: chunkSize,
      heightmap: heightTex,
      floorHeights: floorTex,
      bodyScale: bodyScaleTex,
    })
    if (mirror) bindWaterMirror(material, mirror)
    const mesh = new Mesh(geometry, material)
    mesh.position.set(chunkOriginX, level + 0.07, chunkOriginZ)
    mesh.renderOrder = 1
    mesh.name = 'chunk-water'
    mesh.layers.set(WATER_RENDER_LAYER)
    materials.push(material)
    meshes.push(mesh)
  }

  if (hasSea) addPlane(waterLevel, heights, waterMirror)
  for (const level of lakeLevels) addPlane(level, maskHeightsForLakeLevel(heights, floorHeights, level), undefined)

  return {
    mesh: meshes[0]!,
    meshes,
    update(dt) {
      for (const m of materials) tickWaterTime(m, dt)
    },
    setDayNight(dayFactor, sunDirection) {
      for (const m of materials) setWaterDayNight(m, dayFactor, sunDirection)
    },
    addTo(scene) {
      for (const mesh of meshes) scene.add(mesh)
    },
    dispose() {
      geometry.dispose()
      for (const m of materials) m.dispose()
      for (const t of textures) t.dispose()
      for (const mesh of meshes) mesh.removeFromParent()
    },
  }
}
