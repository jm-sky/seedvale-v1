/**
 * Animal surface polish (P2 experiment): patches PBR scalars (B) and selectively smoothed
 * normals (C) into the fauna GLBs without touching geometry, skins or animations.
 * Usage: node scripts/animalSurfacePolish.mjs [name…]  (reads public/models/fauna/experimental/original/*.glb;
 * bear/boar read the V3 sources in public/models/fauna/v3/ — see SOURCES)
 * Writes experimental/<name>.B.glb and <name>.C.glb, then verifies invariants against the original.
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'

const DIR = 'public/models/fauna'
const SMOOTH_DEG_DEFAULT = 50
/** Per-model smoothing angle (deg); bear is the most faceted low-poly mesh. */
const SMOOTH_DEG = { bear: 70, boar: 58 }
let COS = Math.cos((SMOOTH_DEG_DEFAULT * Math.PI) / 180)
/** Non-default source files (V3 migration); everything else: experimental/original/<name>.glb. */
const SOURCES = { bear: `${DIR}/v3/Bear.glb`, boar: `${DIR}/v3/Boar.glb` }

/** [pattern, roughness] — first match wins; metalness is always 0 (dielectric). */
const ROUGHNESS = {
  sheep: [[/^black/i, 0.85], [/./, 0.92]],
  wolf: [[/eye/i, 0.3], [/nose/i, 0.45], [/./, 0.82]],
  cow: [[/eye/i, 0.3], [/muzzle/i, 0.55], [/hoof/i, 0.6], [/horn/i, 0.5], [/./, 0.78]],
  deer: [[/eye/i, 0.3], [/hoof/i, 0.6], [/./, 0.8]],
  stag: [[/^Material\.011$/, 0.3], [/^Material\.001$/, 0.6], [/./, 0.8]], // .011 eyes, .001 hooves/antlers
  bear: [[/./, 0.88]], // single textured fur material (dark palette texture, white base factor)
  // V3 boar: #54 body, #60 mane/dark hair, #55 grey (tusks/hooves), #56 eyes, #57 pink (snout/ears)
  boar: [[/^Material #56/, 0.3], [/^Material #55/, 0.5], [/^Material #57/, 0.6], [/^Material #60/, 0.85], [/./, 0.85]],
  horse: [[/eye/i, 0.3], [/muzzle/i, 0.55], [/hoof/i, 0.6], [/hair/i, 0.7], [/./, 0.62]],
}
const KEEP_HARD_DEFAULT = /eye|hoof|horn|^Material\.011$/i // never averaged with neighbours
const KEEP_HARD_BY_MODEL = { boar: /^Material #5[567]/ } // grey/eyes/pink detail primitives stay crisp
let KEEP_HARD = KEEP_HARD_DEFAULT

/** Linear base-colour overrides applied before roughness (boar: darker, browner, less red). */
const BASE_COLOR = {
  boar: [
    [/^Material #54/, [0.058, 0.036, 0.024]], // body: was [0.115,0.03,0.02] (reddish)
    [/^Material #60/, [0.016, 0.010, 0.007]], // mane/dark hair: was [0.022,0.004,0.001]
  ],
}
/** Fur tone variation baked into COLOR_0 (multiplies base colour/texture; zero extra draws/textures).
 *  [material pattern, amplitude, warm shift] — low-frequency deterministic value noise on rest-pose position. */
const FUR_VARIATION = {
  bear: [[/./, 0.18, 0.02]],
  boar: [[/^Material #54/, 0.20, 0.03], [/^Material #60/, 0.14, 0.02]],
}

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder })

function applyMaterials(doc, name) {
  for (const mat of doc.getRoot().listMaterials()) {
    mat.setMetallicFactor(0)
    mat.setRoughnessFactor(ROUGHNESS[name].find(([re]) => re.test(mat.getName()))[1])
  }
}

function hash3(x, y, z, seed) {
  let h = (Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647) ^ Math.imul(seed, 1274126177)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
/** Smooth value noise in [0,1] (trilinear, smoothstep). */
function noise3(x, y, z, seed) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const f = (t) => t * t * (3 - 2 * t)
  const fx = f(x - xi), fy = f(y - yi), fz = f(z - zi)
  const l = (a, b, t) => a + (b - a) * t
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz, seed)
  const out = l(
    l(l(c(0, 0, 0), c(1, 0, 0), fx), l(c(0, 1, 0), c(1, 1, 0), fx), fy),
    l(l(c(0, 0, 1), c(1, 0, 1), fx), l(c(0, 1, 1), c(1, 1, 1), fx), fy),
    fz,
  )
  return out
}

/** Subtle per-vertex fur tone variation (COLOR_0, normalized uint8 RGB-A); positions untouched. */
function applyFurVariation(doc, name) {
  const rules = FUR_VARIATION[name]
  if (!rules) return 0
  let n = 0
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const p of mesh.listPrimitives()) {
      const rule = rules.find(([re]) => re.test(p.getMaterial()?.getName() ?? ''))
      if (!rule) continue
      const [, amp, warm] = rule
      const pos = p.getAttribute('POSITION')
      const buf = doc.getRoot().listBuffers()[0]
      const arr = new Uint8Array(pos.getCount() * 4)
      const v = []
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v)
        // two octaves: broad patches (~0.5 u) + finer mottling (~0.2 u)
        const t = 0.65 * noise3(v[0] * 2.2, v[1] * 2.2, v[2] * 2.2, 7) + 0.35 * noise3(v[0] * 5.5, v[1] * 5.5, v[2] * 5.5, 13)
        const d = (t - 0.5) * 2 * amp // ±amp
        const m = (x) => Math.max(0, Math.min(255, Math.round(x * 255)))
        arr[i * 4] = m(1 + d + warm * d * 1.5)
        arr[i * 4 + 1] = m(1 + d * 0.9)
        arr[i * 4 + 2] = m(1 + d * 0.8 - warm * d * 1.5)
        arr[i * 4 + 3] = 255
      }
      p.setAttribute('COLOR_0', doc.createAccessor().setType('VEC4').setArray(arr).setNormalized(true).setBuffer(buf))
      n += pos.getCount()
    }
  }
  return n
}

function applyBaseColor(doc, name) {
  for (const mat of doc.getRoot().listMaterials()) {
    const hit = (BASE_COLOR[name] ?? []).find(([re]) => re.test(mat.getName()))
    if (hit) mat.setBaseColorFactor([...hit[1], mat.getBaseColorFactor()[3]])
  }
}

function smoothNormals(doc) {
  let changed = 0
  for (const mesh of doc.getRoot().listMeshes()) {
    const prims = mesh.listPrimitives()
    const tris = [] // {fn:[x,y,z], ang:[a,b,c], keys:[..], hard}
    const byKey = new Map() // position key -> tri indices
    const slotKeys = prims.map((p) => {
      const pos = p.getAttribute('POSITION')
      const keys = []
      for (let i = 0; i < pos.getCount(); i++) keys.push(pos.getElement(i, []).map((v) => v.toFixed(5)).join(','))
      return keys
    })
    prims.forEach((p, pi) => {
      const pos = p.getAttribute('POSITION')
      const idx = p.getIndices()
      const hard = KEEP_HARD.test(p.getMaterial()?.getName() ?? '')
      const P = (i) => pos.getElement(i, [])
      for (let t = 0; t < idx.getCount(); t += 3) {
        const ids = [idx.getScalar(t), idx.getScalar(t + 1), idx.getScalar(t + 2)]
        const [a, b, c] = ids.map(P)
        const sub = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]]
        const n = cross(sub(b, a), sub(c, a))
        const len = Math.hypot(...n)
        if (len < 1e-12) continue
        const fn = n.map((v) => v / len)
        const ang = [0, 1, 2].map((k) => {
          const p0 = [a, b, c][k], p1 = [a, b, c][(k + 1) % 3], p2 = [a, b, c][(k + 2) % 3]
          return angleBetween(sub(p1, p0), sub(p2, p0))
        })
        const keys = ids.map((i) => slotKeys[pi][i])
        const ti = tris.push({ fn, ang, keys, hard }) - 1
        for (const k of new Set(keys)) (byKey.get(k) ?? byKey.set(k, []).get(k)).push(ti)
      }
    })
    prims.forEach((p, pi) => {
      if (KEEP_HARD.test(p.getMaterial()?.getName() ?? '')) return
      const nrm = p.getAttribute('NORMAL')
      for (let i = 0; i < nrm.getCount(); i++) {
        const ref = nrm.getElement(i, [])
        const rl = Math.hypot(...ref) || 1
        const r = ref.map((v) => v / rl)
        const acc = [0, 0, 0]
        for (const ti of byKey.get(slotKeys[pi][i]) ?? []) {
          const T = tris[ti]
          if (T.hard) continue
          if (T.fn[0] * r[0] + T.fn[1] * r[1] + T.fn[2] * r[2] < COS) continue
          const k = T.keys.indexOf(slotKeys[pi][i])
          for (let q = 0; q < 3; q++) acc[q] += T.fn[q] * T.ang[k]
        }
        const l = Math.hypot(...acc)
        if (l < 1e-9) continue
        nrm.setElement(i, acc.map((v) => v / l))
        changed++
      }
    })
  }
  return changed
}
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
const angleBetween = (u, v) => Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (Math.hypot(...u) * Math.hypot(...v) || 1))))

function fingerprint(doc) {
  const out = {}
  const h = (arr) => { let s = 0; for (let i = 0; i < arr.length; i++) s = (s * 31 + (arr[i] * 1000 | 0)) | 0; return s }
  const root = doc.getRoot()
  out.nodes = root.listNodes().map((n) => n.getName()).join('|')
  out.mats = root.listNodes().flatMap((n) => n.getMatrix()) // compared with 1e-5 tolerance (TRS re-serialisation noise)
  out.skins = root.listSkins().map((s) => s.listJoints().length + ':' + h(s.getInverseBindMatrices()?.getArray() ?? [])).join('|')
  out.anims = root.listAnimations().map((a) => a.getName() + ':' + a.listChannels().map((c) => c.getTargetPath() + h(c.getSampler().getInput().getArray()) + h(c.getSampler().getOutput().getArray())).join(',')).join('|')
  out.prims = root.listMeshes().flatMap((m) => m.listPrimitives().map((p) => ['POSITION', 'JOINTS_0', 'WEIGHTS_0'].map((s) => (p.getAttribute(s) ? h(p.getAttribute(s).getArray()) : 'none')).join('/') + ':' + h(p.getIndices().getArray()) + ':' + p.getMaterial().getName())).join('|')
  out.tris = root.listMeshes().flatMap((m) => m.listPrimitives().map((p) => p.getIndices().getCount() / 3)).reduce((a, b) => a + b, 0)
  return out
}

import { statSync } from 'node:fs'
const eq = (a, b) => (Array.isArray(a) ? a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-5) : a === b)
for (const name of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ROUGHNESS)) {
  const src = SOURCES[name] ?? `${DIR}/experimental/original/${name}.glb`
  COS = Math.cos(((SMOOTH_DEG[name] ?? SMOOTH_DEG_DEFAULT) * Math.PI) / 180)
  KEEP_HARD = KEEP_HARD_BY_MODEL[name] ?? KEEP_HARD_DEFAULT
  const base = fingerprint(await io.read(src))
  for (const variant of ['B', 'C']) {
    const doc = await io.read(src)
    applyMaterials(doc, name)
    if (variant === 'C') { applyBaseColor(doc, name); applyFurVariation(doc, name) }
    const n = variant === 'C' ? smoothNormals(doc) : 0
    const out = `${DIR}/experimental/${name}.${variant}.glb`
    await io.write(out, doc)
    const fp = fingerprint(await io.read(out))
    const same = Object.keys(base).every((k) => eq(base[k], fp[k]))
    console.log(name, variant, 'normalsChanged', n, 'invariantsIdentical', same, 'KiB', (statSync(out).size / 1024).toFixed(1), 'orig KiB', (statSync(src).size / 1024).toFixed(1))
    if (!same) for (const k of Object.keys(base)) if (!eq(base[k], fp[k])) console.log('  DIFF', k)
  }
}
