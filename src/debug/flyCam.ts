import type { KeyState } from '../input/Keyboard'
import type { LookState } from '../input/MouseLook'
import type { PlayerController } from '../player/PlayerController'
/**
 * `?fly` — free-flight observer for terrain/settlement screenshots (v1 vs v3 comparison).
 *
 * Flags: `?fly` or `?fly=<heightAboveGroundM>`; optional `&flyPose=x,z,h,yaw,pitch` (h above ground).
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

export type FlyConfig = {
  startAgl: number
  pose: { x: number; z: number; agl: number; yaw: number; pitch: number } | null
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
  if (poseRaw) {
    const [x, z, h, yaw, pitch] = poseRaw.split(',').map(Number)
    if ([x, z, h].every(Number.isFinite)) {
      pose = { x, z, agl: h, yaw: Number.isFinite(yaw) ? yaw : 0, pitch: Number.isFinite(pitch) ? pitch : 0 }
    }
  }
  return { startAgl, pose }
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

  const init = () => {
    const { pose } = config
    if (pose) {
      player.setPosition(pose.x, pose.z)
      look.yaw = pose.yaw
      look.pitch = pose.pitch
    }
    flyY = player.mesh.position.y + (pose?.agl ?? config.startAgl)
    player.mesh.visible = false
    initialised = true
  }

  const update = (dt: number, inputEnabled: boolean) => {
    if (!initialised) init()
    const pos = player.mesh.position
    let x = pos.x
    let z = pos.z
    if (inputEnabled) {
      const yaw = look.yaw
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
    const { yaw, pitch } = look
    const cp = Math.cos(pitch)
    camera.position.set(x, flyY, z)
    // Mouse down looks down (unlike the orbit camera, whose pitch lifts the lens above the player).
    camera.lookAt(x - Math.sin(yaw) * cp, flyY + Math.sin(pitch), z - Math.cos(yaw) * cp)
  }

  return {
    update,
    dispose: () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    },
  }
}
