#!/usr/bin/env node
/**
 * Builds character outfit variants into GLBs. Extra Knight/Ranger/Wizard variants come from the Quaternius
 * Outfits pack; Blender-authored variants use `--raw` (`assets-src/characters/<Name>.raw.glb`).
 *
 * Issue #20: base Peasant/Ranger can be built from Outfits with an explicit selection; experiments must use
 * `--out` (never silent production overwrites). Named recipes keep the historical base path separate from the
 * current variant flatten/join path until equivalence is proven.
 *
 * Usage:
 *   node scripts/assets/build-characters.mjs [variantName…] [--out <dir>] [--src <outfitsDir>]
 *       [--recipe base-historical|variant-current] [--checkpoint S0|S1|S2|S3|S4a|S4b|S5|full]
 *       [--simplify-ratio <n>] [--simplify-error <n>] [--no-simplify]
 *   node scripts/assets/build-characters.mjs --raw [variantName…] [--out <dir>] …
 *   node scripts/assets/build-characters.mjs --tex
 *
 * Default `--out` is `public/assets/characters` only when neither `--checkpoint` nor a non-full experiment
 * flag is set and the caller does not pass `--out`. Checkpoint / recipe experiment defaults to
 * `_temp/issue20/out` so production is never overwritten by accident.
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, flatten, join, meshopt, prune, resample, simplify, textureCompress, weld } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '../..')
const DEFAULT_SRC = path.join(ROOT, '_temp/extracted/Modular Character Outfits - Fantasy[Source]/Exports/glTF (Godot-Unreal)/Outfits')
const SOURCE_PACK_OUTFITS = path.join(
  ROOT,
  '_temp/models/quaternius-x/modular-character-outfits-fantasy-source/Modular Character Outfits - Fantasy[Source]/Exports/glTF (Godot-Unreal)/Outfits',
)
const TEX_SRC = path.join(ROOT, '_temp/extracted/Modular Character Outfits - Fantasy[Source]/Textures')
const TEX_SRC_PACK = path.join(
  ROOT,
  '_temp/models/quaternius-x/modular-character-outfits-fantasy-source/Modular Character Outfits - Fantasy[Source]/Textures',
)
const RAW_SRC = path.join(ROOT, 'assets-src/characters')
const PUBLIC_OUT = path.join(ROOT, 'public/assets/characters')
const ISSUE20_OUT = path.join(ROOT, '_temp/issue20/out')
/** Simplify ratio per raw variant when 0.35 busts the class budget (≤ 13 k tris, ≤ 1 MB). */
const RAW_RATIO = {}
/**
 * Issue #20: Male Peasant-family sleeve/shoulder cloth fails at simplify error 0.004
 * (shoulder cloth-coverage metric ~30% → ~53% exposed). Tighter error restores source-level
 * coverage; ratio stays 0.35. Female Peasant at 0.004 already matches-or-beats source coverage
 * (~31% vs source ~38%) — do not tighten Female.
 */
const RAW_ERROR = {
  Male_Peasant_Boots: 0.001,
  Male_Blacksmith: 0.001,
  Male_Herbalist: 0.001,
  // Author-edited V1 outfits (Peasant family) from blender-character-variants.py authored mode.
  Male_Farmer: 0.001,
  Male_Woodcutter: 0.001,
}
const DEFAULT_SIMPLIFY_ERROR = 0.004
const MALE_PEASANT_FAMILY_ERROR = 0.001

const CHECKPOINTS = new Set(['full', 'S0', 'S1', 'S2', 'S3', 'S4a', 'S4b', 'S5'])
const RECIPES = new Set(['base-historical', 'variant-current'])

await MeshoptSimplifier.ready
await MeshoptEncoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': (await import('meshoptimizer')).MeshoptDecoder,
})

/** Pack-derived variants (extra outfits). Base Peasant/Ranger are listed separately as BASE_OUTFITS. */
const VARIANTS = [
  ...['Male', 'Female'].map((sex) => ({ name: `${sex}_Knight`, source: `${sex}_Knight`, drop: ['Head_Armet', 'Head_Horns'], ratio: 0.35, error: DEFAULT_SIMPLIFY_ERROR })),
  ...['Male', 'Female'].map((sex) => ({ name: `${sex}_Knight_Helm`, source: `${sex}_Knight`, drop: ['Head_Horns'], ratio: 0.35, error: DEFAULT_SIMPLIFY_ERROR })),
  ...['Male', 'Female'].map((sex) => ({ name: `${sex}_Knight_Cloth`, source: `${sex}_Knight_Cloth`, drop: ['Head_Armet', 'Head_Horns'], ratio: 0.35, error: DEFAULT_SIMPLIFY_ERROR })),
  ...['Male', 'Female'].map((sex) => ({ name: `${sex}_Ranger_NoHood`, source: `${sex}_Ranger`, drop: ['Head_Hood'], ratio: 0.35, error: DEFAULT_SIMPLIFY_ERROR })),
  ...['Male', 'Female'].map((sex) => ({ name: `${sex}_Wizard`, source: `${sex}_Wizard`, drop: [], ratio: 0.5, error: DEFAULT_SIMPLIFY_ERROR })),
]

/** Base outfits historically built by build-assets (Peasant/Ranger). Head parts stay; CharacterKit uses separate heads. */
const BASE_OUTFITS = [
  {
    name: 'Male_Peasant', source: 'Male_Peasant', drop: [], ratio: 0.35,
    error: MALE_PEASANT_FAMILY_ERROR, base: true, lockBorder: true,
  },
  {
    name: 'Female_Peasant', source: 'Female_Peasant', drop: [], ratio: 0.35,
    error: DEFAULT_SIMPLIFY_ERROR, base: true,
  },
  ...['Male', 'Female'].map((sex) => ({ name: `${sex}_Ranger`, source: `${sex}_Ranger`, drop: [], ratio: 0.35, error: DEFAULT_SIMPLIFY_ERROR, base: true })),
]

/** Drop normal/roughness/ORM maps (low-poly style, 3–4× less texture memory). */
const baseColorOnly = () => (doc) => {
  for (const m of doc.getRoot().listMaterials()) {
    m.setNormalTexture(null)
    m.setMetallicRoughnessTexture(null)
    m.setOcclusionTexture(null)
    m.setMetallicFactor(0)
    m.setRoughnessFactor(1)
  }
}

const dropParts = (suffixes) => (doc) => {
  for (const n of doc.getRoot().listNodes()) {
    if (n.getMesh() && suffixes.some((s) => n.getName().endsWith(s))) {
      n.getMesh().dispose()
      n.dispose()
    }
  }
}

/** Authored sources can carry stray clips; the shared anims.glb is the only animation source. */
const dropAnimations = () => (doc) => {
  for (const a of doc.getRoot().listAnimations()) a.dispose()
}

function parseArgs(argv) {
  const args = [...argv]
  const flags = {
    raw: false,
    tex: false,
    out: null,
    src: null,
    recipe: 'variant-current',
    checkpoint: 'full',
    simplifyRatio: null,
    simplifyError: null,
    noSimplify: false,
    lockBorder: null,
    names: [],
  }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--raw') flags.raw = true
    else if (a === '--tex') flags.tex = true
    else if (a === '--out') flags.out = args[++i]
    else if (a === '--src') flags.src = args[++i]
    else if (a === '--recipe') flags.recipe = args[++i]
    else if (a === '--checkpoint') flags.checkpoint = args[++i]
    else if (a === '--simplify-ratio') flags.simplifyRatio = Number(args[++i])
    else if (a === '--simplify-error') flags.simplifyError = Number(args[++i])
    else if (a === '--no-simplify') flags.noSimplify = true
    else if (a === '--lock-border') flags.lockBorder = true
    else if (a === '--no-lock-border') flags.lockBorder = false
    else if (a.startsWith('--')) {
      console.error(`unknown flag: ${a}`)
      process.exit(2)
    } else flags.names.push(a)
  }
  return flags
}

function resolveOutfitsSrc(srcFlag) {
  if (srcFlag) return path.resolve(srcFlag)
  if (fs.existsSync(DEFAULT_SRC)) return DEFAULT_SRC
  if (fs.existsSync(SOURCE_PACK_OUTFITS)) return SOURCE_PACK_OUTFITS
  return DEFAULT_SRC
}

function resolveTexSrc() {
  if (fs.existsSync(TEX_SRC)) return TEX_SRC
  if (fs.existsSync(TEX_SRC_PACK)) return TEX_SRC_PACK
  return TEX_SRC
}

function primTris(p) {
  return (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3
}

function statsLine(doc, label) {
  const root = doc.getRoot()
  let tris = 0
  const parts = []
  for (const n of root.listNodes()) {
    const mesh = n.getMesh()
    if (!mesh) continue
    let t = 0
    for (const p of mesh.listPrimitives()) t += primTris(p)
    tris += t
    parts.push(`${n.getName()}:${Math.round(t)}`)
  }
  const skins = root.listSkins().length
  const joints = root.listSkins()[0]?.listJoints().length ?? 0
  return `${label}  tris=${Math.round(tris)}  skins=${skins}×${joints}  parts=[${parts.join(', ')}]`
}

/**
 * Build transform list for a named recipe and checkpoint.
 * Each call starts from a fresh document (caller re-reads source).
 */
function transformsFor({ recipe, checkpoint, ratio, error, noSimplify, lockBorder }) {
  const r = noSimplify ? 1 : ratio
  const skipSimplify = noSimplify || r >= 1
  const steps = []

  const pushPrep = () => {
    steps.push(prune(), dedup(), resample(), baseColorOnly())
  }
  const pushWeld = () => steps.push(weld())
  const pushSimplify = () => {
    if (!skipSimplify) {
      steps.push(simplify({
        simplifier: MeshoptSimplifier,
        ratio: r,
        error,
        ...(lockBorder ? { lockBorder: true } : {}),
      }))
    }
  }
  const pushTex = () => steps.push(textureCompress({ encoder: sharp, targetFormat: 'png', resize: [512, 512] }))
  const pushFlatten = () => steps.push(flatten())
  const pushJoin = () => steps.push(join({ keepNamed: false }), prune())
  const pushMeshopt = () => steps.push(meshopt({ encoder: MeshoptEncoder, level: 'medium' }))

  // S0 = identity after drop/animations only (handled by caller before transform)
  if (checkpoint === 'S0') return steps

  if (checkpoint === 'S1') {
    pushPrep()
    return steps
  }
  if (checkpoint === 'S2') {
    pushPrep()
    pushWeld()
    return steps
  }
  if (checkpoint === 'S3') {
    pushPrep()
    pushWeld()
    pushSimplify()
    pushTex()
    return steps
  }

  if (recipe === 'base-historical') {
    // Historical v2 @11ecd080: dedup→prune→resample→weld→simplify→tex→baseColor→prune→meshopt (no flatten/join)
    // Our prep already includes baseColorOnly early; order matches intent for diagnosis.
    if (checkpoint === 'S4a' || checkpoint === 'S4b') {
      console.error('base-historical has no flatten/join stages; use S3 or S5/full')
      process.exit(2)
    }
    pushPrep()
    pushWeld()
    pushSimplify()
    pushTex()
    steps.push(prune())
    if (checkpoint === 'S5' || checkpoint === 'full') pushMeshopt()
    return steps
  }

  // variant-current (default): includes flatten/join
  if (checkpoint === 'S4a') {
    pushPrep()
    pushWeld()
    pushSimplify()
    pushTex()
    pushFlatten()
    return steps
  }
  if (checkpoint === 'S4b') {
    pushPrep()
    pushWeld()
    pushSimplify()
    pushTex()
    pushFlatten()
    pushJoin()
    return steps
  }
  // S5 / full
  pushPrep()
  pushWeld()
  pushSimplify()
  pushTex()
  pushFlatten()
  pushJoin()
  if (checkpoint === 'S5' || checkpoint === 'full') pushMeshopt()
  return steps
}

const flags = parseArgs(process.argv.slice(2))

if (flags.tex) {
  const texRoot = resolveTexSrc()
  const outDir = flags.out ? path.resolve(flags.out) : path.join(PUBLIC_OUT, 'tex')
  fs.mkdirSync(outDir, { recursive: true })
  for (const outfit of ['Knight', 'Noble', 'Peasant', 'Ranger', 'Wizard']) {
    for (const n of [2, 3]) {
      const dst = path.join(outDir, `${outfit}_${n}.png`)
      await sharp(path.join(texRoot, outfit, `T_${outfit}_${n}_BaseColor.png`)).resize(512, 512).png({ compressionLevel: 9 }).toFile(dst)
      console.log(`${path.relative(ROOT, dst)}  ${Math.round(fs.statSync(dst).size / 1024)} KB`)
    }
  }
  process.exit(0)
}

if (!RECIPES.has(flags.recipe)) {
  console.error(`unknown --recipe ${flags.recipe}; want ${[...RECIPES].join('|')}`)
  process.exit(2)
}
if (!CHECKPOINTS.has(flags.checkpoint)) {
  console.error(`unknown --checkpoint ${flags.checkpoint}; want ${[...CHECKPOINTS].join('|')}`)
  process.exit(2)
}

const experimental = flags.checkpoint !== 'full' || flags.noSimplify || flags.simplifyRatio != null
const outDir = path.resolve(flags.out ?? (experimental ? ISSUE20_OUT : PUBLIC_OUT))
if (experimental && !flags.out && outDir === PUBLIC_OUT) {
  console.error('refusing to write checkpoint/experiment output to public/assets without --out')
  process.exit(2)
}
fs.mkdirSync(outDir, { recursive: true })

const outfitsSrc = resolveOutfitsSrc(flags.src)
if (!flags.raw && !fs.existsSync(outfitsSrc)) {
  console.error(`Outfits source missing: ${outfitsSrc}\nPass --src <dir> (local pack under _temp/models/quaternius-x/…).`)
  process.exit(1)
}

const packList = [...BASE_OUTFITS, ...VARIANTS]
const rawVariants = flags.raw && fs.existsSync(RAW_SRC)
  ? fs.readdirSync(RAW_SRC).filter((f) => f.endsWith('.raw.glb')).map((f) => {
    const name = f.slice(0, -'.raw.glb'.length)
    return {
      name,
      file: path.join(RAW_SRC, f),
      drop: [],
      ratio: RAW_RATIO[name] ?? 0.35,
      error: RAW_ERROR[name] ?? DEFAULT_SIMPLIFY_ERROR,
      lockBorder: name in RAW_ERROR,
    }
  })
  : []

const catalog = flags.raw ? rawVariants : packList
const known = new Set(catalog.map((v) => v.name))

if (flags.names.length) {
  const unknown = flags.names.filter((n) => !known.has(n))
  if (unknown.length) {
    console.error(`unknown selection: ${unknown.join(', ')}\nknown: ${[...known].sort().join(', ')}`)
    process.exit(1)
  }
}

const selected = flags.names.length ? catalog.filter((v) => flags.names.includes(v.name)) : catalog
if (selected.length === 0) {
  console.error(flags.raw ? 'no raw variants found under assets-src/characters/' : 'empty selection')
  process.exit(1)
}

// Prefer historical recipe for base outfits when caller did not override and building Peasant/Ranger from pack.
const defaultRecipeFor = (v) => (v.base && flags.recipe === 'variant-current' && !process.argv.includes('--recipe')
  ? 'base-historical'
  : flags.recipe)

for (const v of selected) {
  const recipe = flags.raw ? (process.argv.includes('--recipe') ? flags.recipe : 'variant-current') : defaultRecipeFor(v)
  const ratio = flags.simplifyRatio ?? v.ratio
  const error = flags.simplifyError ?? v.error ?? DEFAULT_SIMPLIFY_ERROR
  const lockBorder = flags.lockBorder ?? v.lockBorder ?? false
  const srcPath = v.file ?? path.join(outfitsSrc, `${v.source}.gltf`)
  if (!fs.existsSync(srcPath)) {
    console.error(`missing source: ${srcPath}`)
    process.exit(1)
  }
  const doc = await io.read(srcPath)
  await doc.transform(dropParts(v.drop), dropAnimations())
  const xforms = transformsFor({
    recipe,
    checkpoint: flags.checkpoint,
    ratio,
    error,
    noSimplify: flags.noSimplify,
    lockBorder,
  })
  if (xforms.length) await doc.transform(...xforms)
  const tag = flags.checkpoint === 'full' ? '' : `.${flags.checkpoint}`
  const dst = path.join(outDir, `${v.name}${tag}.glb`)
  await io.write(dst, doc)
  const kb = Math.round(fs.statSync(dst).size / 1024)
  console.log(`${path.relative(ROOT, dst)}  ${kb} KB  recipe=${recipe}  checkpoint=${flags.checkpoint}  ratio=${ratio}  error=${error}${lockBorder ? '  lockBorder' : ''}`)
  console.log(`  ${statsLine(doc, v.name)}`)
}
