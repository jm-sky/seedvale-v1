/**
 * Face-shape variants of the Universal Base Characters head (D-REN-8, Node only): one smooth spatial warp of the
 * rest-pose positions, applied identically to the head, eyes, eyebrows and the hair pack, so eyes sit in their sockets
 * and hair/beard keep their fit. Skin weights, UVs, skeleton and animations are untouched (variants are drop-in
 * replacements for Male_Head.glb / Female_Head.glb / hair.glb).
 *
 * The warp is written in the Blender frame used while tuning it (x right, y = -glTF z forward is negative, z up) and in
 * head-local height `v = z - zEye`. Male and female heads differ by a pure shift (eyes 1.698 m / 1.656 m), so one set of
 * constants serves both; the hair pack lives in the male frame (hair is rebound to the head bone at runtime).
 *
 * The base faces are stern (low brows, flat mouth), so every variant carries a smile: mouth corners and cheeks up, mouth a
 * little wider, brows raised (`FRIENDLY`, strength per variant).
 * Round: wide soft jaw and full cheeks, shorter chin (plump, round face), gentle smile.
 * Lean:  narrow jaw, longer chin, hollow cheeks, broad smile (lean, cheerful).
 * Warm:  the base face shape with a friendly smile and raised brows (for people who should not look grim).
 */
export const FACE_VARIANTS = ['Round', 'Lean', 'Warm']
/** Smile strength and brow lift (m) per variant. */
const FRIENDLY = { Round: { smile: 0.8, brow: 0.003 }, Lean: { smile: 0.9, brow: 0.005 }, Warm: { smile: 1, brow: 0.004 } }
export const EYE_Z = { Male: 1.6985, Female: 1.6559 }

const ss = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const g = (x, c, s) => Math.exp(-(((x - c) / s) ** 2))
const clamp01 = (x) => Math.min(1, Math.max(0, x))

/** Warps one point [x, y(up), z(back)] (glTF frame); `brow` raises eyebrows in the Lean variant. */
export function warpPoint(kind, p, zEye, brow = false) {
  let x = p[0]
  let y = -p[2] // Blender y (front is negative)
  let v = p[1] - zEye
  const w = ss(-0.178, -0.098, v)
  const lf = ss(0.022, -0.122, v) * w
  const front = clamp01((0.02 - y) / 0.1)
  if (kind === 'Warm') {
    // base face shape: only the expression below
  } else if (kind === 'Round') {
    const cheek = g(v, -0.0635, 0.04) * w
    x *= 1 + 0.06 * w + 0.17 * lf + 0.1 * cheek
    y = 0.02 + (y - 0.02) * (1 + 0.05 * w)
    y -= 0.012 * cheek * front
    v = -0.0385 + (v + 0.0385) * (1 - 0.1 * lf)
  } else {
    // narrow the jaw below the mouth only: squeezing the mouth line made the lips pointed
    x *= 1 - 0.06 * w - 0.16 * ss(-0.07, -0.125, v) * w
    v = -0.0385 + (v + 0.0385) * (1 + 0.09 * lf)
    x *= 1 - 0.05 * g(v, -0.0585, 0.03) * w
  }
  // friendly expression (all variants): mouth corners and cheeks up, mouth wider, brows raised
  const f = FRIENDLY[kind]
  const ax = Math.abs(p[0])
  const mouth = g(v, -0.0835, 0.024) * front * ss(0.075, 0.05, ax)
  v += 0.009 * f.smile * mouth * (0.35 + 0.65 * clamp01(ax / 0.045))
  v += 0.004 * f.smile * g(v, -0.05, 0.02) * front * clamp01(ax / 0.04) * ss(0.09, 0.065, ax)
  x *= 1 + 0.04 * f.smile * mouth
  if (brow) v += f.brow
  return [x, v + zEye, -y]
}

/** Warps a primitive in place: positions, and normals through the finite-difference Jacobian of the warp. */
export function warpPrimitive(prim, kind, zEye, brow = false) {
  const pos = prim.getAttribute('POSITION')
  const nor = prim.getAttribute('NORMAL')
  const p = [0, 0, 0]
  const n = [0, 0, 0]
  const eps = 0.002
  for (let i = 0; i < pos.getCount(); i++) {
    pos.getElement(i, p)
    const a = warpPoint(kind, p, zEye, brow)
    if (nor) {
      nor.getElement(i, n)
      const b = warpPoint(kind, [p[0] + n[0] * eps, p[1] + n[1] * eps, p[2] + n[2] * eps], zEye, brow)
      const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
      const l = Math.hypot(...d) || 1
      nor.setElement(i, [d[0] / l, d[1] / l, d[2] / l])
    }
    pos.setElement(i, a)
  }
}

/** glTF Transform step: warps every mesh in the document (nodes named `Eyebrows*` get the brow lift). */
export const warpDocument = (kind, zEye) => (doc) => {
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh()
    if (!mesh) continue
    const brow = /Eyebrows/.test(node.getName())
    for (const prim of mesh.listPrimitives()) warpPrimitive(prim, kind, zEye, brow)
  }
}
