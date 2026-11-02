/**
 * @domain tools
 * Asset Browser body-build preview (tools-022): pure helpers that add the preview morph targets `Fat` and `Slim`
 * to already-built character GLBs (outfit bodies and the eq module packs). Preview-only: nothing here is wired
 * into the game runtime and the production GLBs are never written.
 *
 * Contract (verified against shipped files, see tools-022 implementation notes):
 *  - skinned positions are stored quantized (normalized int16) in a node/IBM-defined space; the "rest space" the
 *    warps expect (metres, +Y up, +Z forward) is `joint.world * inverseBind` of the skin, which must be one uniform
 *    scale + translation for every joint of the skin;
 *  - morph targets are RELATIVE deltas in the same local attribute units as the base POSITION/NORMAL;
 *  - an existing target of the wanted name is reused untouched (idempotence, no accumulated deformation).
 */
import { BODY_MORPH, warpBody } from './body-warp.mjs'

export const SLIM_MORPH = 'Slim'
export const PREVIEW_MORPHS = [BODY_MORPH, SLIM_MORPH]

/** Slim rest-pose warp constants (metres); same frame/heights as `BODY` in body-warp.mjs. */
export const SLIM_STRENGTH = 0.85
export const SLIM = {
  Male: {
    pelvisY: 0.949,
    neckY: 1.52,
    armY: 1.455,
    armZ: -0.065,
    zc: -0.03,
    legX: 0.1,
    waist: 0.32,
    depth: 0.26,
    chest: 0.13,
    arms: 0.32,
    legs: 0.28 },
  Female: {
    pelvisY: 0.932,
    neckY: 1.485,
    armY: 1.418,
    armZ: -0.054,
    zc: -0.005,
    legX: 0.095,
    waist: 0.26,
    depth: 0.22,
    chest: 0.1,
    arms: 0.3,
    legs: 0.26
  },
}

const ss = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const g = (x, c, s) => Math.exp(-(((x - c) / s) ** 2))

/**
 * @domain tools
 * Slim build warp of one rest-space point (k = 1). Narrower waist/torso, slimmer arms and thighs; nothing above the
 * shoulders, at the hands or at the feet (hands/feet/neck attachment zones keep their rest positions).
 */
export function warpSlim(sex, p, opts) {
  const b = SLIM[sex]
  let [x, y, z] = p
  const L = b.neckY - b.pelvisY
  const t = (y - b.pelvisY) / L
  const ax = Math.abs(x)
  const top = ss(1.0, 0.85, t)
  const torso = ss(0.36, 0.26, ax)
  const gb = g(t, 0.25, 0.3) * top
  x *= 1 - b.waist * gb * torso
  z = b.zc + (z - b.zc) * (1 - b.depth * gb * torso)
  x *= 1 - b.chest * g(t, 0.65, 0.2) * top * torso
  // drape (skirts/robes): torso only — no leg or arm terms, the hem keeps its shape
  if (opts && opts.drape) return [x, y, z]
  // legs: radial about each leg axis, fading out towards the feet and into the pelvis
  const gl = ss(b.pelvisY + 0.06, b.pelvisY - 0.12, y) * ss(0.12, 0.45, y) * ss(0.14, 0.07, Math.abs(ax - b.legX))
  if (gl > 0) {
    const cx = Math.sign(x) * b.legX
    x = cx + (x - cx) * (1 - b.legs * gl)
    z = b.zc + (z - b.zc) * (1 - b.legs * gl)
  }
  // arms: radial about the horizontal arm axis, none at the shoulder and none at the hands
  const ga = ss(0.2, 0.3, ax) * ss(0.7, 0.55, ax)
  y = b.armY + (y - b.armY) * (1 - b.arms * ga)
  z = b.armZ + (z - b.armZ) * (1 - b.arms * ga)

return [
  p[0] + (x - p[0]) * SLIM_STRENGTH,
  p[1] + (y - p[1]) * SLIM_STRENGTH,
  p[2] + (z - p[2]) * SLIM_STRENGTH,
]
}

export const WARPS = {
  [BODY_MORPH]: (sex, p, opts) => warpBody(sex, p, opts && opts.drape ? { arms: false } : undefined),
  [SLIM_MORPH]: warpSlim,
}

/** Long garments that flare far from the leg/arm axes (female work skirts, bodice dress, aprons, robes). */
export const DRAPE_MESH = /skirt|noble|apron|robe|dress/i

const mul = (a, b) => {
  const o = new Array(16).fill(0)
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]
  return o
}

/**
 * @domain tools
 * Rest transform (uniform scale + translation) of a skin: `joint.world * inverseBind` for every joint.
 * Throws with the node/file name when joints disagree or the transform is not a positive uniform scale + translation.
 */
export function skinRestTransform(skin, label = 'skin') {
  const joints = skin.listJoints()
  const ibm = skin.getInverseBindMatrices()
  if (!joints.length || !ibm) throw new Error(`${label}: skin without joints/inverse binds`)
  let ref = null
  const tmp = new Array(16)
  joints.forEach((j, i) => {
    ibm.getElement(i, tmp)
    const m = mul(j.getWorldMatrix(), tmp)
    if (!ref) ref = m
    else if (m.some((v, k) => Math.abs(v - ref[k]) > 1e-4)) throw new Error(`${label}: joints disagree on rest transform (joint ${j.getName()})`)
  })
  const s = ref[0]
  const diag = [ref[0], ref[5], ref[10]]
  const offDiag = [1, 2, 4, 6, 8, 9, 3, 7, 11].some((k) => Math.abs(ref[k]) > 1e-5)
  if (offDiag || !(s > 0) || diag.some((v) => Math.abs(v - s) > 1e-5 * Math.max(1, s)) || Math.abs(ref[15] - 1) > 1e-5) {
    throw new Error(`${label}: rest transform is not a positive uniform scale + translation`)
  }
  return { scale: s, translation: [ref[12], ref[13], ref[14]] }
}

/**
 * @domain tools
 * Relative POSITION/NORMAL target arrays for one primitive. Positions in `rest` metres go through `warp`; normals
 * use the inverse-transpose Jacobian (central differences) so non-uniform deformation shades correctly.
 */
export function computeTarget(prim, rest, warp) {
  const pos = prim.getAttribute('POSITION')
  const nor = prim.getAttribute('NORMAL')
  const n = pos.getCount()
  const dp = new Float32Array(n * 3)
  const dn = nor ? new Float32Array(n * 3) : null
  const v = [0, 0, 0]
  const nv = [0, 0, 0]
  const h = 1e-3
  const { scale: s, translation: t } = rest
  for (let i = 0; i < n; i++) {
    pos.getElement(i, v)
    const r = [v[0] * s + t[0], v[1] * s + t[1], v[2] * s + t[2]]
    const w = warp(r)
    for (let k = 0; k < 3; k++) {
      dp[i * 3 + k] = (w[k] - r[k]) / s
      if (!Number.isFinite(dp[i * 3 + k])) throw new Error('non-finite position delta')
    }
    if (nor) {
      nor.getElement(i, nv)
      // J columns by central differences, then n' = normalize(J^-T n).
      const J = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      for (let c = 0; c < 3; c++) {
        const a = [...r]; const bb = [...r]
        a[c] += h; bb[c] -= h
        const wa = warp(a); const wb = warp(bb)
        for (let rr = 0; rr < 3; rr++) J[rr][c] = (wa[rr] - wb[rr]) / (2 * h)
      }
      const det = J[0][0] * (J[1][1] * J[2][2] - J[1][2] * J[2][1]) - J[0][1] * (J[1][0] * J[2][2] - J[1][2] * J[2][0]) + J[0][2] * (J[1][0] * J[2][1] - J[1][1] * J[2][0])
      // cofactor matrix equals det * J^-T, i.e. the direction we want (sign preserved while det > 0).
      const cof = [
        [J[1][1] * J[2][2] - J[1][2] * J[2][1], -(J[1][0] * J[2][2] - J[1][2] * J[2][0]), J[1][0] * J[2][1] - J[1][1] * J[2][0]],
        [-(J[0][1] * J[2][2] - J[0][2] * J[2][1]), J[0][0] * J[2][2] - J[0][2] * J[2][0], -(J[0][0] * J[2][1] - J[0][1] * J[2][0])],
        [J[0][1] * J[1][2] - J[0][2] * J[1][1], -(J[0][0] * J[1][2] - J[0][2] * J[1][0]), J[0][0] * J[1][1] - J[0][1] * J[1][0]],
      ]
      const sign = det < 0 ? -1 : 1
      let m = [0, 1, 2].map((rr) => sign * (cof[rr][0] * nv[0] + cof[rr][1] * nv[1] + cof[rr][2] * nv[2]))
      const len = Math.hypot(m[0], m[1], m[2]) || 1
      m = m.map((c) => c / len)
      for (let k = 0; k < 3; k++) dn[i * 3 + k] = m[k] - nv[k]
    }
  }
  return { dp, dn }
}

/**
 * @domain tools
 * Add the missing preview morph targets (`Fat`, `Slim`) to every skinned mesh of `doc`. Existing targets (incl. the
 * shipped `Fat`) are kept untouched; unrelated target names/weights are preserved; new targets are appended in order
 * so target indices of existing morphs never change. Returns a per-mesh report.
 */
export function addPreviewTargets(doc, sex, { morphs = PREVIEW_MORPHS, fileLabel = 'glb' } = {}) {
  const report = []
  const processed = new Map()
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh()
    const skin = node.getSkin()
    if (!mesh || !skin) continue
    const label = `${fileLabel}:${node.getName()}`
    const rest = skinRestTransform(skin, label)
    const prev = processed.get(mesh)
    if (prev) {
      if (Math.abs(prev.scale - rest.scale) > 1e-6 || prev.translation.some((v, k) => Math.abs(v - rest.translation[k]) > 1e-6)) {
        throw new Error(`${label}: shared mesh used with different rest transforms`)
      }
      continue
    }
    processed.set(mesh, rest)
    const extras = mesh.getExtras() ?? {}
    const prims = mesh.listPrimitives()
    const names = [...(extras.targetNames ?? [])]
    for (const p of prims) {
      if (p.listTargets().length !== names.length) throw new Error(`${label}: target count does not match extras.targetNames`)
    }
    const added = []
    for (const morph of morphs) {
      if (names.includes(morph) && morph !== 'Fat') continue
      if (!WARPS[morph]) throw new Error(`unknown morph ${morph}`)
      const warp = (p) => WARPS[morph](sex, p, { drape: DRAPE_MESH.test(`${node.getName()} ${mesh.getName()}`) })
      for (const prim of prims) {
        const { dp, dn } = computeTarget(prim, rest, warp)
        // The glTF writer derives mesh extras.targetNames from the target names, so name the target itself.
        const tgt = doc.createPrimitiveTarget(morph)
        tgt.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(dp).setBuffer(prim.getAttribute('POSITION').getBuffer()))
        if (dn) tgt.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(dn).setBuffer(prim.getAttribute('POSITION').getBuffer()))
        prim.addTarget(tgt)
      }
      names.push(morph)
      added.push(morph)
    }
    if (added.length) {
      mesh.setExtras({ ...extras, targetNames: names })
      const w = [...(mesh.getWeights() ?? [])]
      while (w.length < names.length) w.push(0)
      mesh.setWeights(w)
    }
    report.push({ mesh: mesh.getName(), added, targets: names })
  }
  return report
}
