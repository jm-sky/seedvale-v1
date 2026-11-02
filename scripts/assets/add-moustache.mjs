#!/usr/bin/env node
/**
 * Adds the `HAIR_Moustache` node to the four hair packs (hair.glb, hair_Round/Lean/Warm.glb) without a full rebuild of
 * the packs (their UBC source is not in the repo). The moustache is authored in Blender
 * (`scripts/blender/moustache/build_moustache.py` -> docs/blender/sources/characters/custom/moustache/moustache.glb) in
 * the male head frame (glTF, metres). For each pack it is warped with the same face-variant warp as the head and the
 * rest of the pack (head-warp.mjs), then expressed in that pack's quantized space, skinned 100 % to the Head bone with a
 * skin cloned from `HAIR_Beard`, and given the beard's material (`MI_Hair_1`, greyscale atlas tinted per actor at runtime).
 * Idempotent: an existing `HAIR_Moustache` is replaced. Other nodes are only re-encoded (same meshopt settings).
 * Usage: node scripts/assets/add-moustache.mjs
 */
import { Accessor, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, dequantize, meshopt, prune, unpartition } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import fs from 'node:fs'
import path from 'node:path'
import { Matrix4, Vector3 } from 'three'
import { EYE_Z, warpPoint } from './head-warp.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const DIR = path.join(ROOT, 'public/assets/characters')
const SRC = path.join(ROOT, 'docs/blender/sources/characters/custom/moustache/moustache.glb')
const PACKS = [['hair.glb', null], ['hair_Round.glb', 'Round'], ['hair_Lean.glb', 'Lean'], ['hair_Warm.glb', 'Warm']]

await MeshoptEncoder.ready
await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder })

const srcPrim = (await io.read(SRC)).getRoot().listMeshes()[0].listPrimitives()[0]
const readAll = (acc) => Array.from({ length: acc.getCount() }, (_, i) => acc.getElement(i, []))
const srcPos = readAll(srcPrim.getAttribute('POSITION'))
const srcNor = readAll(srcPrim.getAttribute('NORMAL'))
const srcUv = readAll(srcPrim.getAttribute('TEXCOORD_0'))
const srcIdx = srcPrim.getIndices().getArray()

for (const [file, kind] of PACKS) {
  const doc = await io.read(path.join(DIR, file))
  await doc.transform(dequantize())
  const root = doc.getRoot()
  root.listNodes().filter((n) => n.getName() === 'HAIR_Moustache').forEach((n) => n.dispose())
  const beard = root.listNodes().find((n) => n.getName() === 'HAIR_Beard')
  const bSkin = beard.getSkin()
  const bPrim = beard.getMesh().listPrimitives()[0]
  const head = bSkin.listJoints().findIndex((j) => j.getName() === 'Head')
  // pack space (position of the mesh) -> world rest pose: jointWorld * inverseBind
  const toWorld = new Matrix4().fromArray(bSkin.listJoints()[head].getWorldMatrix()).multiply(new Matrix4().fromArray(bSkin.getInverseBindMatrices().getElement(head, [])))
  const fromWorld = toWorld.clone().invert()
  const rot = new Matrix4().extractRotation(fromWorld)

  const warp = (p) => (kind ? warpPoint(kind, p, EYE_Z.Male) : p)
  const pos = []
  const nor = []
  const eps = 0.002
  srcPos.forEach((p, i) => {
    const a = warp(p)
    const n = srcNor[i]
    const b = warp([p[0] + n[0] * eps, p[1] + n[1] * eps, p[2] + n[2] * eps])
    const d = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize().transformDirection(rot)
    pos.push(new Vector3(...a).applyMatrix4(fromWorld).toArray())
    nor.push(d.toArray())
  })

  const buf = root.listBuffers()[0]
  const attr = (type, array) => doc.createAccessor().setType(type).setArray(array).setBuffer(buf)
  const joints = new Uint16Array(pos.length * 4)
  const weights = new Float32Array(pos.length * 4)
  for (let i = 0; i < pos.length; i++) { joints[i * 4] = head; weights[i * 4] = 1 }
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', attr(Accessor.Type.VEC3, new Float32Array(pos.flat())))
    .setAttribute('NORMAL', attr(Accessor.Type.VEC3, new Float32Array(nor.flat())))
    .setAttribute('TEXCOORD_0', attr(Accessor.Type.VEC2, new Float32Array(srcUv.flat())))
    .setAttribute('JOINTS_0', attr(Accessor.Type.VEC4, joints))
    .setAttribute('WEIGHTS_0', attr(Accessor.Type.VEC4, weights))
    .setIndices(doc.createAccessor().setType(Accessor.Type.SCALAR).setArray(new Uint16Array(srcIdx)).setBuffer(buf))
    .setMaterial(bPrim.getMaterial())
  const skin = doc.createSkin('HAIR_Moustache')
  bSkin.listJoints().forEach((j) => skin.addJoint(j))
  skin.setInverseBindMatrices(doc.createAccessor().setType(Accessor.Type.MAT4).setArray(new Float32Array(bSkin.getInverseBindMatrices().getArray())).setBuffer(buf))
  const node = doc.createNode('HAIR_Moustache').setMesh(doc.createMesh('HAIR_Moustache').addPrimitive(prim)).setSkin(skin)
  const parent = beard.getParentNode()
  if (parent) parent.addChild(node)
  else for (const sc of root.listScenes()) sc.addChild(node)

  await doc.transform(dedup(), prune(), unpartition(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
  await io.write(path.join(DIR, file), doc)
  console.log(file, `${Math.round(fs.statSync(path.join(DIR, file)).size / 1024)} KB`, kind ?? 'Base', srcIdx.length / 3, 'tris')
}
