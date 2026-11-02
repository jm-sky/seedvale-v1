#!/usr/bin/env node
/**
 * Dumps the rest-pose world vertices of a skinned head/hair mesh (glTF frame, metres) as JSON for the Blender moustache
 * script. The hair/head GLBs are meshopt-quantized with the scale folded into the inverse bind matrices, so the rest
 * position is `jointWorld * inverseBind * position`.
 * Usage: node scripts/assets/moustache-dump-head.mjs [file=public/assets/characters/Male_Head.glb] [node=SuperHero_Male] out.json
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'
import fs from 'node:fs'
import { Matrix4, Vector3 } from 'three'

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder })

/** Rest-pose world positions and indices of the first primitive of `nodeName`. */
export async function restWorld(file, nodeName, jointName = 'Head') {
  const doc = await io.read(file)
  const node = doc.getRoot().listNodes().find((x) => x.getName() === nodeName)
  const skin = node.getSkin()
  const j = skin.listJoints().findIndex((x) => x.getName() === jointName)
  const m = new Matrix4().fromArray(skin.listJoints()[j].getWorldMatrix()).multiply(new Matrix4().fromArray(skin.getInverseBindMatrices().getElement(j, [])))
  const prim = node.getMesh().listPrimitives()[0]
  const pos = prim.getAttribute('POSITION')
  const v = [0, 0, 0]
  const world = []
  for (let i = 0; i < pos.getCount(); i++) world.push(new Vector3(...pos.getElement(i, v)).applyMatrix4(m).toArray())
  return { world, indices: Array.from(prim.getIndices().getArray()) }
}

if (process.argv[1]?.endsWith('moustache-dump-head.mjs')) {
  const args = process.argv.slice(2)
  const out = args.pop()
  const [file = 'public/assets/characters/Male_Head.glb', node = 'SuperHero_Male'] = args
  const r = await restWorld(file, node)
  fs.writeFileSync(out, JSON.stringify({ v: r.world.map((a) => a.map((x) => +x.toFixed(5))), i: r.indices }))
}
