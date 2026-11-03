import { type Object3D, PointLight } from 'three'
import type { HouseDefinition } from '../assets/houseDefinitionExampleConfig'
import type { HouseBrowserLampConfig, HouseBrowserLampDefault } from './houseBrowserTypes'
import { disposeObject3D, loadGltf, prepareAuthoredScaleMax } from '../assets/loadGltf'
import { createHouseLight, type HouseLight } from '../settlement/houseLighting'
import { houseLampMountFor } from '../settlement/professionDressing'
import { LANTERN_FLOOR_MAX, LANTERN_STANDING_URL, LANTERN_WALL_MAX, LANTERN_WALL_URL } from '../settlement/propSpecs'

/** Lamp position/style a house definition resolves to in the game (`props.ts`: `def.lamp` → `houseLampMountFor`). */
export function defaultLampFor(def: HouseDefinition): HouseBrowserLampDefault {
  const mount = houseLampMountFor(def)
  return {
    x: mount.x,
    y: mount.y,
    z: mount.z,
    style: def.lamp?.style ?? 'wall',
    yawDeg: mount.yaw === undefined ? null : Math.round((mount.yaw * 180) / Math.PI),
  }
}

/** Exterior lamp light = the PointLight that is not the 12 m interior fill. */
function exteriorLight(object: Object3D): PointLight | null {
  let found: PointLight | null = null
  object.traverse((o) => {
    if (o instanceof PointLight && o.distance !== 12) found = o
  })
  return found
}

type Templates = { wall: Object3D | null, floor: Object3D | null }
let templatesPromise: Promise<Templates> | null = null

/** Same load/prepare/fallback as `props.ts`; cached `loadGltf` assets are shared (`sharedGpu`). */
function loadLanternTemplates(): Promise<Templates> {
  templatesPromise ??= (async () => {
    const out: Templates = { wall: null, floor: null }
    try { out.wall = prepareAuthoredScaleMax(await loadGltf(LANTERN_WALL_URL), LANTERN_WALL_MAX) } catch { /* procedural */ }
    try { out.floor = prepareAuthoredScaleMax(await loadGltf(LANTERN_STANDING_URL), LANTERN_FLOOR_MAX) } catch { /* procedural */ }
    return out
  })()
  return templatesPromise
}

export interface LampPreview {
  /** Attach to a freshly built house root (disposes any previous lamp). */
  attach(root: Object3D, def: HouseDefinition): void
  /** Apply panel state; rebuilds the lamp only when the position changes. */
  apply(config: HouseBrowserLampConfig): void
  /** Lamp as currently shown (null when hidden) — used for dressing collision. */
  current(): HouseBrowserLampDefault | null
  dispose(): void
}

/** Temp-only preview of the real `createHouseLight` lamp; never writes to definitions. */
export function createLampPreview(onRebuilt: () => void): LampPreview {
  let root: Object3D | null = null
  let style: HouseBrowserLampDefault['style'] = 'wall'
  let light: HouseLight | null = null
  let built: { x: number, y: number, z: number, yawDeg: number | null } | null = null
  let config: HouseBrowserLampConfig | null = null
  let generation = 0

  function remove(): void {
    if (light) {
      light.object.removeFromParent()
      disposeObject3D(light.object)
    }
    light = null
    built = null
  }

  function applyLightState(): void {
    if (!light || !config) return
    light.setNightIntensity(config.night ? 1 : 0)
    const ext = exteriorLight(light.object)
    if (ext && config.night) ext.intensity = config.intensity
  }

  async function rebuild(): Promise<void> {
    const gen = ++generation
    remove()
    if (!root || !config?.show) { onRebuilt(); return }
    const templates = await loadLanternTemplates()
    if (gen !== generation || !root) return
    const { x, y, z } = config
    const tpl = style === 'wall' ? templates.wall : templates.floor
    const yaw = config.yawDeg === null ? undefined : (config.yawDeg * Math.PI) / 180
    light = createHouseLight(y, x, z, style, tpl, yaw)
    const inv = 1 / Math.max(Math.abs(root.scale.x), 1e-6)
    for (const child of light.object.children) child.scale.multiplyScalar(inv)
    root.add(light.object)
    built = { x, y, z, yawDeg: config.yawDeg }
    applyLightState()
    onRebuilt()
  }

  return {
    attach(nextRoot, def) {
      remove()
      root = nextRoot
      style = defaultLampFor(def).style
      generation++
    },
    apply(next) {
      const prev = config
      config = { ...next }
      const moved = !built || built.x !== next.x || built.y !== next.y || built.z !== next.z || built.yawDeg !== next.yawDeg
      if (!root) return
      if (prev?.show !== next.show || (next.show && (moved || !light))) void rebuild()
      else applyLightState()
    },
    current: () => (light && built ? { x: built.x, y: built.y, z: built.z, style, yawDeg: built.yawDeg } : null),
    dispose() {
      generation++
      remove()
      root = null
    },
  }
}
