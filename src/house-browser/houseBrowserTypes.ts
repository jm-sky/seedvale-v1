import type { HouseAssemblyCensus } from '../settlement/houseBuilder'

/** Scene-side visual configuration (plan tools-003) — Vue holds this as
 *  reactive state and pushes it through `HouseBrowserScene.setConfig()`. */
export interface HouseBrowserConfig {
  showGrid: boolean
  showGround: boolean
  showShadows: boolean
  showColliders: boolean
  colliderPadding: number
  cameraAutoFit: boolean
  doorsOpen: boolean
  lamp: HouseBrowserLampConfig
  profession: HouseBrowserProfession
}

/** Profession whose dressing is previewed on the house (`none` = no dressing). */
export type HouseBrowserProfession =
  | 'none' | 'guard' | 'hunter' | 'fisher' | 'woodcutter' | 'farmer' | 'trader' | 'herbalist'

export const HOUSE_BROWSER_PROFESSIONS: readonly HouseBrowserProfession[] = [
  'none', 'guard', 'hunter', 'fisher', 'woodcutter', 'farmer', 'trader', 'herbalist',
]

export type HouseBrowserLampStyle = 'wall' | 'floorCenter'

/** Lamp position (house-local metres) and style as resolved from the `HouseDefinition`. */
export interface HouseBrowserLampDefault {
  x: number
  y: number
  z: number
  style: HouseBrowserLampStyle
  /** Definition yaw in degrees; `null` = game default facing. */
  yawDeg: number | null
}

/** Temporary panel state — never written back to definitions. */
export interface HouseBrowserLampConfig {
  show: boolean
  x: number
  y: number
  z: number
  /** Exterior `PointLight.intensity` while lit (browser default 2.0; game uses 2.5 wall / 5 floor). */
  intensity: number
  night: boolean
  /** Lamp yaw in degrees (0 = faces +Z, 180 = faces -Z/front wall); `null` = game default (outward from house centre through the mount). */
  yawDeg: number | null
}

export const DEFAULT_LAMP_INTENSITY = 2.0

export const DEFAULT_HOUSE_BROWSER_CONFIG: HouseBrowserConfig = {
  showGrid: true,
  showGround: true,
  showShadows: true,
  showColliders: false,
  colliderPadding: 0,
  cameraAutoFit: true,
  doorsOpen: false,
  lamp: { show: true, x: 0, y: 0, z: 0, intensity: DEFAULT_LAMP_INTENSITY, night: false, yawDeg: null },
  profession: 'none',
}

export type CameraView = 'front' | 'back' | 'left' | 'right' | 'top'

/** Read-only info about the currently attached `HouseAssembly`, reported to
 *  Vue after a successful `setHouse()` so House Info never duplicates
 *  `HouseAssembly`/`HouseDefinition` data of its own. */
export interface HouseBrowserAssemblyInfo {
  definitionId: string
  census: HouseAssemblyCensus
  colliderCount: number
  doorCount: number
  defaultLamp: HouseBrowserLampDefault
}

export interface HouseBrowserScene {
  setHouse(id: string): Promise<void>
  setConfig(config: HouseBrowserConfig): void
  resetCamera(): void
  setCameraView(view: CameraView): void
  dispose(): void
}
