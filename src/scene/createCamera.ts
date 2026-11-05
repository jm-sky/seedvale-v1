import * as THREE from 'three'

/** Default far plane (m). With the far terrain ring (plan world-terrain-066) callers pass a larger value. */
export const DEFAULT_CAMERA_FAR = 500

export function createCamera(
  aspect: number,
  far: number = DEFAULT_CAMERA_FAR,
): THREE.PerspectiveCamera {
  return new THREE.PerspectiveCamera(60, aspect, 0.1, far)
}
