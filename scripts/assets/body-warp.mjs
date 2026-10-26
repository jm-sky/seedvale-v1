/**
 * Body-build warp ("heavy", render--016 stage 2, D-REN-19): one smooth spatial warp of the T-pose rest positions,
 * baked as the glTF morph target `Fat` into every outfit and equipment GLB (build-body-morph.mjs). The same function
 * runs over every file, so clothes and armour fatten with the body; the influence is a runtime number
 * (0 = normal, 1 = obese). Everything above the shoulders is untouched (head, hair, neck seam).
 *
 * Frame: real rest space, metres, x right, y up, z towards the front of the body (glTF: characters face +z). Heights are normalised by the
 * pelvis and neck joints so one set of constants serves both sexes.
 *   belly - front surface of the abdomen moves forward, torso gets wider and deeper around the waist
 *   hips  - hips and thighs wider and deeper
 *   arms  - upper arms and forearms thicker (radial about the arm axis, tapering to 0 at the hands)
 *   chest - slightly broader chest
 */
export const BODY_MORPH = 'Fat'
export const BODY = {
  Male: { pelvisY: 0.949, neckY: 1.52, armY: 1.455, armZ: -0.065, zc: -0.03, belly: 0.2, waist: 0.42, hips: 0.26, arms: 0.26 },
  Female: { pelvisY: 0.932, neckY: 1.485, armY: 1.418, armZ: -0.054, zc: -0.005, belly: 0.13, waist: 0.3, hips: 0.3, arms: 0.26 },
}

const ss = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const g = (x, c, s) => Math.exp(-(((x - c) / s) ** 2))

/** Warps one point [x, y, z] at full build (k = 1); `sex` is a key of BODY. */
export function warpBody(sex, p) {
  const b = BODY[sex]
  let [x, y, z] = p
  const L = b.neckY - b.pelvisY
  const t = (y - b.pelvisY) / L
  const ax = Math.abs(x)
  const top = ss(1.0, 0.85, t) // nothing above the shoulders
  const torso = ss(0.36, 0.26, ax) // lateral falloff: arms are not part of the belly
  // belly: forward push of the front surface + wider and deeper waist
  const gb = g(t, 0.3, 0.26) * top
  const front = ss(b.zc - 0.04, b.zc + 0.1, z)
  z += b.belly * gb * front * ss(0.3, 0.15, ax)
  x *= 1 + b.waist * gb * torso
  z = b.zc + (z - b.zc) * (1 + 0.18 * gb * torso)
  // chest
  x *= 1 + 0.1 * g(t, 0.65, 0.2) * top * torso
  // hips and thighs
  const gh = g(t, -0.25, 0.3)
  x *= 1 + b.hips * gh
  z = b.zc + (z - b.zc) * (1 + 0.2 * gh)
  // arms: radial about the horizontal arm axis, none at the shoulder and none at the hands
  const ga = ss(0.2, 0.3, ax) * ss(0.7, 0.55, ax)
  y = b.armY + (y - b.armY) * (1 + b.arms * ga)
  z = b.armZ + (z - b.armZ) * (1 + b.arms * ga)
  return [x, y, z]
}
