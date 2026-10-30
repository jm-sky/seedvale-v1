import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { createLights } from './createLights'

/** Light-space (shadow camera view) x/y of the world origin after `follow`. */
function shadowViewOrigin(lights: ReturnType<typeof createLights>): THREE.Vector3 {
  const { sun } = lights
  sun.updateMatrixWorld()
  sun.shadow.updateMatrices(sun)
  return new THREE.Vector3().applyMatrix4(sun.shadow.camera.matrixWorldInverse)
}

describe('createLights follow (shadow texel snapping)', () => {
  it.each([1024, 512])('keeps the %i² shadow texel grid fixed in world space', (size) => {
    const lights = createLights(size)
    const texel = 160 / size
    for (const [x, z] of [[0, 0], [0.037, -0.011], [13.3, 7.77], [-401.25, 92.6]] as const) {
      lights.follow(x, z)
      const origin = shadowViewOrigin(lights)
      expect(Math.abs(origin.x / texel - Math.round(origin.x / texel))).toBeLessThan(1e-3)
      expect(Math.abs(origin.y / texel - Math.round(origin.y / texel))).toBeLessThan(1e-3)
    }
  })

  it('keeps the sun direction and centres the frustum within one texel of the player', () => {
    const lights = createLights(1024)
    lights.follow(13.3, 7.77)
    const offset = lights.sun.position.clone().sub(lights.sun.target.position)
    expect(offset.distanceTo(new THREE.Vector3(40, 70, 30))).toBeLessThan(1e-9)
    const toPlayer = new THREE.Vector3(13.3, 0, 7.77).sub(lights.sun.target.position)
    const lateral = toPlayer.sub(offset.normalize().multiplyScalar(toPlayer.dot(offset)))
    expect(lateral.length()).toBeLessThan(Math.SQRT2 * (160 / 1024) / 2 + 1e-6)
  })
})
