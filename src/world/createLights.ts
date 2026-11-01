import * as THREE from 'three'
import { AGENT_RENDER_LAYER, REFLECTION_DISTANT_LAYER } from '../world/waterMirror'

export type WorldLights = {
  ambient: THREE.AmbientLight
  hemi: THREE.HemisphereLight
  sun: THREE.DirectionalLight
  addTo: (scene: THREE.Scene) => void
  /** Recenter the sun/shadow frustum on the player — in a streamed world the
   *  frustum only needs to cover the area immediately around the camera, not
   *  the whole loaded region, so its size stays fixed and only the target moves. */
  follow: (x: number, z: number) => void
  /** Metres the shadow frustum centre is shifted ahead of the player along the
   *  camera's ground-plane forward (0 for the legacy ±80 frustum). */
  shadowForwardOffset: number
  /** Live resize of the directional shadow map (plan 103). Disposes the
   *  current GPU target so Three.js reallocates on the next shadow pass. */
  setShadowMapSize: (size: number) => void
  /** Frees the sun's shadow-map render target and detaches the lights from
   *  their scene. `WebGLRenderer.dispose()` does **not** touch shadow maps
   *  (see its body in `three/src/renderers/WebGLRenderer.js` — it disposes
   *  render lists/states/properties/programs, not `shadowMap`), so without
   *  this the 512²/1024² depth target survives app teardown. */
  dispose: () => void
}

/** Sun offset from the followed point; fixed, so the shadow camera's
 *  orientation (and its light-space basis below) never changes. */
const SUN_OFFSET = new THREE.Vector3(40, 70, 30)
/** Legacy sun shadow half-extent, centred on the player. */
export const SHADOW_FRUSTUM_HALF = 80
/** world-terrain-055 S1 (`?shadowFrustum=tight`): tighter half-extent... */
export const SHADOW_FRUSTUM_TIGHT_HALF = 56
/** ...centred this far ahead of the player along camera forward (XZ). */
export const SHADOW_FRUSTUM_TIGHT_FORWARD_OFFSET = 24

export type ShadowFrustumMode = 'legacy' | 'tight'

export function createLights(shadowMapSize = 1024, frustumMode: ShadowFrustumMode = 'legacy'): WorldLights {
  const frustumHalf = frustumMode === 'tight' ? SHADOW_FRUSTUM_TIGHT_HALF : SHADOW_FRUSTUM_HALF
  const shadowForwardOffset = frustumMode === 'tight' ? SHADOW_FRUSTUM_TIGHT_FORWARD_OFFSET : 0
  // Shadow-camera right/up axes, built exactly like `LightShadow.updateMatrices`
  // (`Camera.lookAt` from the sun towards its target with the default up).
  const shadowRight = new THREE.Vector3()
  const shadowUp = new THREE.Vector3()
  const shadowForward = new THREE.Vector3()
  new THREE.Matrix4()
    .lookAt(SUN_OFFSET, new THREE.Vector3(), THREE.Object3D.DEFAULT_UP)
    .extractBasis(shadowRight, shadowUp, shadowForward)
  const followTarget = new THREE.Vector3()

  const ambient = new THREE.AmbientLight(0xc5d8ea, 0.35)
  const hemi = new THREE.HemisphereLight(0x9ec9ff, 0x6b8f4a, 0.55)

  const sun = new THREE.DirectionalLight(0xfff0d4, 1.4)
  sun.position.copy(SUN_OFFSET)
  sun.castShadow = true
  // 1024 is enough for the ~160-unit shadow frustum around the player;
  // 2048 mostly burned fill-rate without a matching clarity gain (perf 012).
  const size = shadowMapSize === 512 ? 512 : 1024
  sun.shadow.mapSize.set(size, size)
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 200
  sun.shadow.camera.left = -frustumHalf
  sun.shadow.camera.right = frustumHalf
  sun.shadow.camera.top = frustumHalf
  sun.shadow.camera.bottom = -frustumHalf
  sun.shadow.bias = -0.0002
  // Agents live on AGENT_RENDER_LAYER so the water mirror (layer 0) skips
  // them. Keep them in the shadow camera or NPC/fauna stop casting.
  sun.shadow.camera.layers.enable(AGENT_RENDER_LAYER)
  // Outer-ring terrain/vegetation/environment content (plan 144 S) is moved
  // to REFLECTION_DISTANT_LAYER only to skip the mirror pass — it must keep
  // casting shadows, so the shadow camera enables this layer too.
  sun.shadow.camera.layers.enable(REFLECTION_DISTANT_LAYER)

  return {
    ambient,
    hemi,
    sun,
    shadowForwardOffset,
    addTo(scene) {
      scene.add(ambient)
      scene.add(hemi)
      scene.add(sun)
      scene.add(sun.target)
    },
    follow(x, z) {
      // Snap the frustum centre to whole shadow-map texels in light space so
      // the texel grid stays fixed in the world while the player walks —
      // otherwise every shadow edge (and any residual acne) crawls/shimmers.
      // Depth along the light axis is left unsnapped; it doesn't move texels.
      const texel = (2 * frustumHalf) / sun.shadow.mapSize.x
      followTarget.set(x, 0, z)
      const r = Math.round(followTarget.dot(shadowRight) / texel) * texel
      const u = Math.round(followTarget.dot(shadowUp) / texel) * texel
      const f = followTarget.dot(shadowForward)
      followTarget
        .copy(shadowRight).multiplyScalar(r)
        .addScaledVector(shadowUp, u)
        .addScaledVector(shadowForward, f)
      sun.position.copy(followTarget).add(SUN_OFFSET)
      sun.target.position.copy(followTarget)
      sun.target.updateMatrixWorld()
    },
    setShadowMapSize(next) {
      const resolved = next === 512 ? 512 : 1024
      if (sun.shadow.mapSize.x === resolved) return
      sun.shadow.mapSize.set(resolved, resolved)
      if (sun.shadow.map) {
        sun.shadow.map.dispose()
        sun.shadow.map = null
      }
    },
    dispose() {
      // `DirectionalLight.dispose()` forwards to `LightShadow.dispose()`,
      // which frees `shadow.map` (and `shadow.mapPass`, VSM-only).
      sun.dispose()
      sun.target.removeFromParent()
      sun.removeFromParent()
      hemi.removeFromParent()
      ambient.removeFromParent()
    },
  }
}
