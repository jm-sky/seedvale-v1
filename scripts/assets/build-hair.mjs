#!/usr/bin/env node
/**
 * Builds the hairstyle pack (render--014) from Universal Base Characters [Standard] "Hairstyles / Rigged to Head Bone"
 * (_temp/extracted/, CC0) into public/assets/characters/hair.glb: one node `HAIR_<Style>` per style, all skinned to the
 * 65-bone UBC skeleton so the runtime can rebind them to any outfit skeleton by bone name (same as the eq modules).
 * Base colour only (greyscale hair atlas, tinted per actor at runtime), 256 px, simplified, meshopt. No animations.
 * Usage: node scripts/assets/build-hair.mjs            (hair.glb)
 *        node scripts/assets/build-hair.mjs --variants  (hair_<Round|Lean>.glb: the same pack warped to the face variants of
 *            build-head-variants.mjs, so hair and beard keep their fit on the Round/Lean heads; the pack is in the male frame)
 */
import { Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, flatten, join, mergeDocuments, meshopt, prune, resample, simplify, textureCompress, unpartition, weld } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { EYE_Z, FACE_VARIANTS, warpDocument } from './head-warp.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const SRC = path.join(ROOT, '_temp/extracted/Universal_Base_CharactersStandard/Universal Base Characters[Standard]/Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)')
const OUT_DIR = path.join(ROOT, 'public/assets/characters')

/** Style → source file and simplify ratio (1 = untouched). Budget D-REN-11: pack ≤ ~1 MB, a human wears one style (≤ ~1.5 k tris). */
const STYLES = {
  Buzzed: ['Hair_Buzzed', 1],
  BuzzedFemale: ['Hair_BuzzedFemale', 1],
  Parted: ['Hair_SimpleParted', 0.7],
  Long: ['Hair_Long', 0.4],
  Buns: ['Hair_Buns', 0.35],
  Beard: ['Hair_Beard', 0.8],
}

await MeshoptSimplifier.ready
await MeshoptEncoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': (await import('meshoptimizer')).MeshoptDecoder,
})

const baseColorOnly = () => (doc) => {
  for (const m of doc.getRoot().listMaterials()) {
    m.setNormalTexture(null)
    m.setMetallicRoughnessTexture(null)
    m.setOcclusionTexture(null)
    m.setMetallicFactor(0)
    m.setRoughnessFactor(1)
  }
}
const nameNodes = (name) => (doc) => {
  const nodes = doc.getRoot().listNodes().filter((n) => n.getMesh())
  nodes.forEach((n, i) => n.setName(nodes.length > 1 ? `HAIR_${name}_${i}` : `HAIR_${name}`))
}

async function build(kind) {
const OUT = path.join(OUT_DIR, kind ? `hair_${kind}.glb` : 'hair.glb')
const pack = new Document()
for (const [name, [file, ratio]] of Object.entries(STYLES)) {
  const doc = await io.read(path.join(SRC, `${file}.gltf`))
  await doc.transform(
    prune(), dedup(), resample(), baseColorOnly(), weld(),
    ...(ratio === 1 ? [] : [simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.02 })]),
    ...(kind ? [warpDocument(kind, EYE_Z.Male)] : []),
    textureCompress({ encoder: sharp, targetFormat: 'png', resize: [256, 256] }),
    flatten(), join({ keepNamed: false }), prune(), nameNodes(name),
  )
  mergeDocuments(pack, doc)
}
const root = pack.getRoot()
const [keep, ...rest] = root.listScenes()
for (const sc of rest) {
  for (const n of sc.listChildren()) keep.addChild(n)
  sc.dispose()
}
await pack.transform(dedup(), prune(), unpartition(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
await io.write(OUT, pack)
const tri = (m) => m.listPrimitives().reduce((n, p) => n + (p.getIndices()?.getCount() ?? 0) / 3, 0)
for (const n of root.listNodes().filter((x) => x.getMesh())) console.log(n.getName(), Math.round(tri(n.getMesh())), 'tris')
console.log(`${path.relative(ROOT, OUT)}  ${Math.round(fs.statSync(OUT).size / 1024)} KB  skins: ${root.listSkins().length}  textures: ${root.listTextures().length}  materials: ${root.listMaterials().map((m) => m.getName()).join(',')}`)
}

if (process.argv.includes('--variants')) for (const kind of FACE_VARIANTS) await build(kind)
else await build()
