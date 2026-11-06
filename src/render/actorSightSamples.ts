/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — writes semantic sight-target sample points for an
 *  actor (body/head/limbs) into a caller-owned buffer. Pure, allocation-free.
 */

export type ActorSightShape = 'biped' | 'quadruped'

/**
 * Yaw is Three.js `mesh.rotation.y`; agents derive it as `Math.atan2(dx, dz)`
 * so forward = (sin yaw, cos yaw) in XZ and the actor's left = (cos yaw, -sin yaw).
 * `y` is the feet position. Writes xyz triples (first = body centre) and
 * returns the sample count (7 biped, 6 quadruped). `out` needs >= 21 floats.
 */
export function writeActorSightSamples(
  out: Float32Array,
  x: number,
  y: number,
  z: number,
  yaw: number,
  height: number,
  halfWidth: number,
  halfLength: number,
  shape: ActorSightShape,
): number {
  const fx = Math.sin(yaw)
  const fz = Math.cos(yaw)
  const lx = fz
  const lz = -fx
  let n = 0
  const put = (fwd: number, lat: number, hFrac: number): void => {
    out[n++] = x + fx * fwd + lx * lat
    out[n++] = y + height * hFrac
    out[n++] = z + fz * fwd + lz * lat
  }
  if (shape === 'biped') {
    put(0, 0, 0.65)
    put(0, 0, 0.93)
    put(0, 0, 0.5)
    put(0, halfWidth, 0.78)
    put(0, -halfWidth, 0.78)
    put(0, 0, 0.25)
    put(0, 0, 0.1)
  }
  else {
    put(0, 0, 0.6)
    put(halfLength, 0, 0.8)
    put(-halfLength, 0, 0.6)
    put(0, halfWidth, 0.55)
    put(0, -halfWidth, 0.55)
    put(0, 0, 0.25)
  }
  return n / 3
}
