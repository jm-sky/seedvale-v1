import type { KeyState } from '../input/Keyboard'
import type { LookState } from '../input/MouseLook'
import type { PlayerController } from '../player/PlayerController'
/**
 * `?fly` — free-flight observer for terrain/settlement screenshots (v1 vs v3 comparison).
 *
 * Flags: `?fly` or `?fly=<heightAboveGroundM>`; optional `&flyPose=x,z,h,yaw,pitch` (h above ground).
 * Screenshot mode (plan tools-024): `&flyPose=home[,agl]` centres on the home settlement and implies `&flyTop`
 * (straight down, north-up: image up = world -Z, image right = +X); `&flyFov=<deg>` overrides the vertical FOV.
 * Top-down mode ignores mouse look so the shot cannot drift.
 * Controls: WASD / arrows move, Space rises, Z descends, Shift = 3x; mouse look as usual (click for pointer lock).
 * Speed grows with height above ground, so overview flights stay quick.
 */
import type { PerspectiveCamera } from 'three'

const BASE_SPEED_M_S = 14
/** Extra speed per metre above ground (1/s) — at 200 m the base is 14 + 160 = 174 m/s. */
const ALTITUDE_SPEED_FACTOR = 0.8
const SPRINT = 3
const MIN_AGL_M = 1.5
const DEFAULT_START_AGL_M = 40
const MAX_AGL_M = 3000
/** Default height above ground for `flyPose=home` — tuned so the whole home village fits at the default FOV. */
export const DEFAULT_HOME_SHOT_AGL_M = 150
/** Consecutive settled frames required by `__seedvaleFlyShotReady()`. */
const SHOT_READY_STABLE_FRAMES = 30

export type FlyConfig = {
  startAgl: number
  pose: { x: number; z: number; agl: number; yaw: number; pitch: number } | null
  /** `flyPose=home[,agl]` — pose resolved at init from the injected home resolver. `agl` null = default. */
  home: { agl: number | null } | null
  /** Straight-down north-up camera, mouse look ignored (`flyTop`, implied by `flyPose=home`). */
  top: boolean
  /** Vertical FOV override in degrees (`flyFov`), or null to keep the camera's own. */
  fov: number | null
}

/** Minimal world-readiness probe injected by the game loop (keeps settlement/chunk code out of this module). */
export type FlyShotHooks = {
  /** Home settlement site position. */
  resolveHome: () => { x: number; z: number }
  /** Cheap per-frame snapshot of the streaming state; the shot is ready once it is unchanged for N frames and `complete`. */
  streamingState: () => { signature: string; complete: boolean }
}

declare global {
  interface Window {
    /** `?fly` only — true once the world around the camera has settled (plan tools-024). */
    __seedvaleFlyShotReady?: () => boolean
    /** `?fly` only — traceability info for screenshots. */
    __seedvaleFlyShotInfo?: () => { homeX: number; homeZ: number; cameraX: number; cameraY: number; cameraZ: number; agl: number; fov: number } | null
  }
}

/**
 * Aims the camera from (x,y,z). Normal mode: yaw/pitch as in the observer. Top mode: straight down with
 * `camera.up` = world -Z (north), which avoids the `lookAt` degeneracy at pitch -π/2. Restores `up` otherwise.
 */
export function aimFlyCamera(camera: PerspectiveCamera, x: number, y: number, z: number, yaw: number, pitch: number, top: boolean): void {
  camera.position.set(x, y, z)
  if (top) {
    camera.up.set(0, 0, -1)
    camera.lookAt(x, y - 1, z)
    return
  }
  camera.up.set(0, 1, 0)
  const cp = Math.cos(pitch)
  // Mouse down looks down (unlike the orbit camera, whose pitch lifts the lens above the player).
  camera.lookAt(x - Math.sin(yaw) * cp, y + Math.sin(pitch), z - Math.cos(yaw) * cp)
}

export function readFlyConfig(search = typeof window === 'undefined' ? '' : window.location.search): FlyConfig | null {
  const params = new URLSearchParams(search)
  if (!params.has('fly')) return null
  const raw = (params.get('fly') ?? '').trim().toLowerCase()
  if (raw === '0' || raw === 'false' || raw === 'no') return null
  const agl = Number(raw)
  const startAgl = raw !== '' && Number.isFinite(agl) && agl > 0 ? agl : DEFAULT_START_AGL_M
  const poseRaw = params.get('flyPose')
  let pose: FlyConfig['pose'] = null
  let home: FlyConfig['home'] = null
  if (poseRaw) {
    const parts = poseRaw.split(',')
    if (parts[0]!.trim().toLowerCase() === 'home') {
      const a = parts.length > 1 ? Number(parts[1]) : NaN
      home = { agl: Number.isFinite(a) && a > 0 ? a : null }
    } else {
      const [x, z, h, yaw, pitch] = parts.map(Number)
      if ([x, z, h].every(Number.isFinite)) {
        pose = { x, z, agl: h, yaw: Number.isFinite(yaw) ? yaw : 0, pitch: Number.isFinite(pitch) ? pitch : 0 }
      }
    }
  }
  const topRaw = params.get('flyTop')?.trim().toLowerCase()
  const top = home !== null || (params.has('flyTop') && topRaw !== '0' && topRaw !== 'false' && topRaw !== 'no')
  const fovNum = Number(params.get('flyFov'))
  const fov = params.has('flyFov') && Number.isFinite(fovNum) && fovNum > 1 && fovNum < 170 ? fovNum : null
  return { startAgl, pose, home, top, fov }
}

export type FlyCam = {
  /** Call once per frame instead of `player.update()`. `inputEnabled` is false while a modal is open. */
  update: (dt: number, inputEnabled: boolean) => void
  dispose: () => void
}

export function createFlyCam(
  config: FlyConfig,
  player: PlayerController,
  camera: PerspectiveCamera,
  look: LookState,
  keys: KeyState,
  hooks?: FlyShotHooks,
): FlyCam {
  const held = new Set<string>()
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'KeyZ') held.add(e.code)
  }
  const onKeyUp = (e: KeyboardEvent) => held.delete(e.code)
  const onBlur = () => held.clear()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)

  let initialised = false
  let flyY = 0

  const baseFov = camera.fov
  const baseFar = camera.far
  let settledFrames = 0
  let lastSignature = ''
  let shotReady = false
  let homeXZ: { x: number; z: number } | null = null

  const init = () => {
    const { pose } = config
    let startAgl = config.startAgl
    if (config.home && hooks) {
      homeXZ = hooks.resolveHome()
      player.setPosition(homeXZ.x, homeXZ.z)
      look.yaw = 0
      look.pitch = -Math.PI / 2
      startAgl = config.home.agl ?? DEFAULT_HOME_SHOT_AGL_M
    } else if (pose) {
      player.setPosition(pose.x, pose.z)
      look.yaw = pose.yaw
      look.pitch = pose.pitch
    }
    flyY = player.mesh.position.y + (config.home ? startAgl : (pose?.agl ?? startAgl))
    if (config.fov !== null) {
      camera.fov = config.fov
      camera.far = Math.max(baseFar, flyY + 4000)
      camera.updateProjectionMatrix()
    } else if (config.top) {
      camera.far = Math.max(baseFar, flyY + 1000)
      camera.updateProjectionMatrix()
    }
    player.mesh.visible = false
    initialised = true
  }

  const update = (dt: number, inputEnabled: boolean) => {
    if (!initialised) init()
    const pos = player.mesh.position
    let x = pos.x
    let z = pos.z
    if (inputEnabled) {
      const yaw = config.top ? 0 : look.yaw
      const f = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0)
      const r = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
      const v = (held.has('Space') ? 1 : 0) - (held.has('KeyZ') ? 1 : 0)
      const agl = Math.max(0, flyY - pos.y)
      const step = (BASE_SPEED_M_S + agl * ALTITUDE_SPEED_FACTOR) * (keys.sprint ? SPRINT : 1) * dt
      if (v !== 0) flyY = Math.min(pos.y + MAX_AGL_M, flyY + v * step)
      if (f !== 0 || r !== 0) {
        const len = Math.hypot(f, r)
        // Same convention as PlayerController: forward (-sin yaw, -cos yaw), right (cos yaw, -sin yaw).
        x += ((-Math.sin(yaw) * f + Math.cos(yaw) * r) / len) * step
        z += ((-Math.cos(yaw) * f - Math.sin(yaw) * r) / len) * step
      }
    }
    // The (hidden) player rides along on the ground below the camera, so streaming and sim follow the flight.
    player.setPosition(x, z)
    flyY = Math.max(flyY, pos.y + MIN_AGL_M)
    aimFlyCamera(camera, x, flyY, z, look.yaw, look.pitch, config.top)
    if (hooks) {
      const s = hooks.streamingState()
      if (s.signature === lastSignature && s.complete) settledFrames++
      else settledFrames = 0
      lastSignature = s.signature
      shotReady = settledFrames >= SHOT_READY_STABLE_FRAMES
    }
  }

  if (hooks && typeof window !== 'undefined') {
    window.__seedvaleFlyShotReady = () => initialised && shotReady && window.__seedvaleReady === true
    window.__seedvaleFlyShotInfo = () => {
      if (!initialised) return null
      const home = homeXZ ?? hooks.resolveHome()
      const p = camera.position
      return { homeX: home.x, homeZ: home.z, cameraX: p.x, cameraY: p.y, cameraZ: p.z, agl: p.y - player.mesh.position.y, fov: camera.fov }
    }
  }

  return {
    update,
    dispose: () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      if (hooks && typeof window !== 'undefined') {
        delete window.__seedvaleFlyShotReady
        delete window.__seedvaleFlyShotInfo
      }
      camera.up.set(0, 1, 0)
      camera.fov = baseFov
      camera.far = baseFar
      camera.updateProjectionMatrix()
    },
  }
}
