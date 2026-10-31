/**
 * Animal surface polish (P2 experiment): patches PBR scalars (B) and selectively smoothed
 * normals (C) into the fauna GLBs without touching geometry, skins or animations.
 * Usage: node scripts/animalSurfacePolish.mjs   (reads public/models/fauna/experimental/original/*.glb)
 * Writes experimental/<name>.B.glb and <name>.C.glb, then verifies invariants against the original.
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'

const DIR = 'public/models/fauna'
const SMOOTH_DEG = 50
const COS = Math.cos((SMOOTH_DEG * Math.PI) / 180)

/** [pattern, roughness] — first match wins; metalness is always 0 (dielectric). */
const ROUGHNESS = {
  sheep: [[/^black/i, 0.85], [/./, 0.92]],
  wolf: [[/eye/i, 0.3], [/nose/i, 0.45], [/./, 0.82]],
  cow: [[/eye/i, 0.3], [/muzzle/i, 0.55], [/hoof/i, 0.6], [/horn/i, 0.5], [/./, 0.78]],
  horse: [[/eye/i, 0.3], [/muzzle/i, 0.55], [/hoof/i, 0.6], [/hair/i, 0.7], [/./, 0.62]],
}
const KEEP_HARD = /eye|hoof|horn/i // never averaged with neighbours

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
  out.prims = root.listMeshes().flatMap((m) => m.listPrimitives().map((p) => ['POSITION', 'JOINTS_0', 'WEIGHTS_0'].map((s) => h(p.getAttribute(s).getArray())).join('/') + ':' + h(p.getIndices().getArray()) + ':' + p.getMaterial().getName())).join('|')
  out.tris = root.listMeshes().flatMap((m) => m.listPrimitives().map((p) => p.getIndices().getCount() / 3)).reduce((a, b) => a + b, 0)
  return out
}

import { statSync } from 'node:fs'
const eq = (a, b) => (Array.isArray(a) ? a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-5) : a === b)
for (const name of Object.keys(ROUGHNESS)) {
  const src = `${DIR}/experimental/original/${name}.glb`
  const base = fingerprint(await io.read(src))
  for (const variant of ['B', 'C']) {
    const doc = await io.read(src)
    applyMaterials(doc, name)
    const n = variant === 'C' ? smoothNormals(doc) : 0
    const out = `${DIR}/experimental/${name}.${variant}.glb`
    await io.write(out, doc)
    const fp = fingerprint(await io.read(out))
    const same = Object.keys(base).every((k) => eq(base[k], fp[k]))
    console.log(name, variant, 'normalsChanged', n, 'invariantsIdentical', same, 'KiB', (statSync(out).size / 1024).toFixed(1), 'orig KiB', (statSync(src).size / 1024).toFixed(1))
    if (!same) for (const k of Object.keys(base)) if (!eq(base[k], fp[k])) console.log('  DIFF', k)
  }
}
