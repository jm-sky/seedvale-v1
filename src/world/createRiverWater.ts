import { Mesh, type Scene, type Vector3 } from 'three'
import type { RiverChain, WorldRect } from '../terrain/riverNetwork'
import type { WaterfallSite } from '../terrain/waterfallSites'
import { buildRiverRibbonGeometry, clipChainToRect } from './riverGeometry'
import { createRiverWaterMaterial } from './riverWaterMaterial'
import { createWaterfallSpray } from './waterfallSpray'
import { setWaterDayNight, tickWaterTime } from './waterMaterial'
import { WATER_RENDER_LAYER } from './waterMirror'

export type WorldRiver = {
  mesh: Mesh
  update: (dt: number) => void
  setDayNight: (dayFactor: number, sunDirection: Vector3) => void
  addTo: (scene: Scene) => void
  dispose: () => void
}

/**
 * Per-chunk river ribbon. `chains` are the cached, already-computed chains
 * from every river tile overlapping this chunk (`riverTileCache`) — this
 * function only clips + builds geometry, it never recomputes hydrology.
 * Returns `null` when nothing overlaps this chunk's rectangle, so the common
 * case (a chunk with no river nearby) costs nothing.
 *
 * `waterfallSites` (plan world-terrain-064 W2) are the cascade sites whose bottom may lie within
 * {@link POOL_FOAM_RADIUS_M} (riverGeometry) of this chunk: every one feeds the ribbon's pool-foam attribute; landmark sites whose
 * bottom lies inside the chunk also get the shared-material spray mesh (≤ 1 extra draw, child of the river mesh).
 */
export function createChunkRiver(
  chains: RiverChain[],
  chunkRect: WorldRect,
  chunkOriginX: number,
  chunkOriginZ: number,
  waterfallSites: readonly WaterfallSite[] = [],
): WorldRiver | null {
  const runs = chains.flatMap((chain) => clipChainToRect(chain, chunkRect))
  const geometry = buildRiverRibbonGeometry(runs, chunkOriginX, chunkOriginZ, waterfallSites.map((s) => s.bottom))
  if (!geometry) return null

  const material = createRiverWaterMaterial()
  const mesh = new Mesh(geometry, material)
  mesh.position.set(chunkOriginX, 0, chunkOriginZ)
  mesh.renderOrder = 1
  mesh.name = 'chunk-river'
  mesh.layers.set(WATER_RENDER_LAYER)

  const ownedLandmarks = waterfallSites.filter(
    (s) => s.tier === 'landmark'
      && s.bottom.x >= chunkRect.minX && s.bottom.x < chunkRect.maxX
      && s.bottom.z >= chunkRect.minZ && s.bottom.z < chunkRect.maxZ,
  )
  const spray = createWaterfallSpray(ownedLandmarks, chunkOriginX, chunkOriginZ)
  // Spray vertices are chunk-relative like the ribbon's, so as a child (same origin) it needs no offset of its own.
  if (spray) mesh.add(spray.mesh)
  let sprayTime = 0

  return {
    mesh,
    update(dt) {
      tickWaterTime(material, dt)
      if (spray) {
        sprayTime += dt
        spray.setTime(sprayTime)
      }
    },
    setDayNight(dayFactor, sunDirection) {
      setWaterDayNight(material, dayFactor, sunDirection)
      spray?.setDayNight(dayFactor)
    },
    addTo(scene) {
      scene.add(mesh)
    },
    dispose() {
      spray?.dispose()
      geometry.dispose()
      material.dispose()
      mesh.removeFromParent()
    },
  }
}
