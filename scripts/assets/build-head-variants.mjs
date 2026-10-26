#!/usr/bin/env node
/**
 * Builds base + face-shape head packs into public/assets/characters/<Sex>_Head[_<Variant>].glb
 * (head + eyes + eyebrows, skinned to the 65-bone UBC skeleton) from Universal Base Characters
 * Superhero FullBody (CC0). Shape variants use head-warp.mjs; Base is identity (no warp).
 *
 * Issue #20: applies headOnly Y-cut + dropArmWeightedTris so Superhero shoulder/arm skin is not shipped.
 *
 * Usage: node scripts/assets/build-head-variants.mjs [Base|Round|Lean|Warm …]
 *        (default: Base + all FACE_VARIANTS; hair: node scripts/assets/build-hair.mjs --variants)
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, flatten, join, meshopt, prune, resample, simplify, textureCompress, weld } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { dropArmWeightedTris, headOnly, NECK_Y } from './head-cut.mjs'
import { EYE_Z, FACE_VARIANTS, warpDocument } from './head-warp.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const OUT = path.join(ROOT, 'public/assets/characters')
/** Canonical extracted layout; fallback is legacy parked FullBody (both sexes + textures). */
const BASECHAR_CANDIDATES = [
  path.join(ROOT, '_temp/extracted/Universal_Base_CharactersStandard/Universal Base Characters[Standard]/Base Characters/Godot - UE'),
  path.join(ROOT, 'public/models/parked/character-pack/models'),
]
/** glTF URI aliases that point at differently named files in the parked pack. */
const TEXTURE_ALIASES = [
  ['T_Hair_1_Normal_png.png', 'T_Hair_1_Normal.png'],
  ['T_Eye_Normal_png.png', 'T_Eye_Normal.png'],
]

function resolveBaseChar() {
  for (const dir of BASECHAR_CANDIDATES) {
    const male = path.join(dir, 'Superhero_Male_FullBody.gltf')
    const female = path.join(dir, 'Superhero_Female_FullBody.gltf')
    if (fs.existsSync(male) && fs.existsSync(female)) return dir
  }
  throw new Error(
    `Superhero FullBody sources not found. Tried:\n${BASECHAR_CANDIDATES.map((d) => `  ${d}`).join('\n')}`,
  )
}

/**
 * Stage sources under `_temp/work/ubc-heads/` with URI alias symlinks so we never write into legacy/.
 * Returns the staged directory path.
 */
function stageBaseChar(srcDir) {
  const work = path.join(ROOT, '_temp/work/ubc-heads')
  fs.mkdirSync(work, { recursive: true })
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name)
    const to = path.join(work, name)
    if (fs.existsSync(to)) continue
    fs.symlinkSync(path.resolve(from), to)
  }
  for (const [alias, target] of TEXTURE_ALIASES) {
    const aliasPath = path.join(work, alias)
    const targetPath = path.join(work, target)
    if (fs.existsSync(aliasPath) || !fs.existsSync(targetPath)) continue
    fs.symlinkSync(target, aliasPath)
  }
  return work
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

const ALL_KINDS = ['Base', ...FACE_VARIANTS]
const argvKinds = process.argv.slice(2).filter((a) => ALL_KINDS.includes(a))
const kinds = argvKinds.length ? argvKinds : ALL_KINDS

const BASECHAR = stageBaseChar(resolveBaseChar())
console.log('BASECHAR', path.relative(ROOT, BASECHAR))

for (const kind of kinds) {
  for (const sex of ['Male', 'Female']) {
    const doc = await io.read(`${BASECHAR}/Superhero_${sex}_FullBody.gltf`)
    const transforms = [
      headOnly(NECK_Y[sex]),
      dropArmWeightedTris(),
      prune(),
      dedup(),
      resample(),
      baseColorOnly(),
      weld(),
      simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.003 }),
    ]
    if (kind !== 'Base') transforms.push(warpDocument(kind, EYE_Z[sex]))
    transforms.push(
      textureCompress({ encoder: sharp, targetFormat: 'png', resize: [512, 512] }),
      flatten(),
      join({ keepNamed: false }),
      prune(),
      meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
    )
    await doc.transform(...transforms)
    const dst = kind === 'Base' ? `${OUT}/${sex}_Head.glb` : `${OUT}/${sex}_Head_${kind}.glb`
    await io.write(dst, doc)
    console.log(`${path.relative(ROOT, dst)}  ${Math.round(fs.statSync(dst).size / 1024)} KB`)
  }
}
