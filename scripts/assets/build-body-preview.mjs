import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
/**
 * @domain tools
 * Asset Browser body-build preview generator (tools-022). Reads the shipped character GLBs, appends the missing
 * `Fat` / `Slim` morph targets and writes derivatives under `public/assets/characters/body-preview/`.
 * Never writes the source files (input/output aliasing is rejected). Same input + parameters → same decoded output.
 *
 *   node scripts/assets/build-body-preview.mjs [--src dir] [--out dir] [--only Male_Peasant,eq/Female] [--no-compress]
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// Node ≥ 22.18 strips types natively; characterTypes.ts is import-free, so the outfit allowlist has one owner.
import { FEMALE_OUTFITS } from '../../src/characters/characterTypes.ts'
import { addPreviewTargets, PREVIEW_MORPHS } from './body-preview-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const args = process.argv.slice(2)
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : def
}
const src = path.resolve(opt('src', path.join(root, 'public/assets/characters')))
const out = path.resolve(opt('out', path.join(root, 'public/assets/characters/body-preview')))
const only = opt('only', '')
const compress = !args.includes('--no-compress')

if (out === src || out.startsWith(src + path.sep) === false && src.startsWith(out + path.sep)) {
  throw new Error('output must not alias the source directory')
}

/**
 * Explicit allowlist: live outfit bodies + eq packs (heads/hair/anims are reused from the originals). Female bodies
 * outside `FEMALE_OUTFITS` (e.g. Female_Knight/Ranger kept as equipment-module sources) are skipped.
 */
export function previewInputs(dir) {
  const female = new Set(FEMALE_OUTFITS)
  const bodies = fs.readdirSync(dir)
    .filter((f) => /^(Male|Female)_(?!Head)[A-Za-z_]+\.glb$/.test(f))
    .filter((f) => !f.startsWith('Female_') || female.has(f.slice('Female_'.length, -'.glb'.length)))
    .map((f) => ({ file: f, sex: f.startsWith('Male') ? 'Male' : 'Female' }))
  const eq = ['Male', 'Female'].map((sex) => ({ file: `eq/${sex}.glb`, sex }))
  return [...bodies, ...eq].filter((e) => fs.existsSync(path.join(dir, e.file)))
}

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
})
const sha = (b) => createHash('sha256').update(b).digest('hex').slice(0, 16)

const manifest = { morphs: PREVIEW_MORPHS, files: {} }
const wanted = only ? new Set(only.split(',')) : null
for (const { file, sex } of previewInputs(src)) {
  if (wanted && !wanted.has(file.replace(/\.glb$/, ''))) continue
  const input = path.join(src, file)
  const output = path.join(out, file)
  if (path.resolve(input) === path.resolve(output)) throw new Error(`alias: ${file}`)
  const doc = await io.read(input)
  const report = addPreviewTargets(doc, sex, { fileLabel: file })
  if (compress) {
    doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER })
  }
  const bytes = await io.writeBinary(doc)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  const tmp = `${output}.tmp`
  fs.writeFileSync(tmp, bytes)
  fs.renameSync(tmp, output)
  const added = report.flatMap((r) => r.added)
  manifest.files[file] = {
    sex,
    srcSha: sha(fs.readFileSync(input)),
    srcBytes: fs.statSync(input).size,
    outBytes: bytes.length,
    meshes: report.length,
    added: added.length,
  }
  console.log(`${file}: ${fs.statSync(input).size} -> ${bytes.length} bytes, +${added.length} targets on ${report.length} meshes`)
}
if (!wanted) fs.writeFileSync(path.join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
