import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { prune } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
/**
 * Extracts the six V1-equivalent tree LOD representations (LOD0 + LOD1 meshes and the 8-view impostor rows) from the
 * V3 tree package (`seedvale-v3` `public/assets/trees.glb`, `trees-impostors*.png/.json`, `trees-build.json`) into the
 * inert, versioned package `public/assets/tree-lod/v1/`. Nothing here is loaded by the game runtime.
 *
 *   node scripts/assets/extract-tree-lod.mjs [--v3=../seedvale] [--out=public/assets/tree-lod/v1]
 *
 * Geometry, materials, embedded textures, UVs and vertex attributes are carried over unchanged (roots are kept whole,
 * everything else is pruned, meshopt re-encoded like the donor). The atlas rows are cropped, not re-rendered; the
 * impostor JSON is rewritten with the new row order, the other row fields are copied verbatim.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d
const V3 = resolve(arg('v3', '../seedvale'))
const OUT = resolve(arg('out', 'public/assets/tree-lod/v1'))
const SRC = join(V3, 'public/assets')

/** V1 model → V3 variant. Order = V1 `TREE_SPECS` species index order (`src/settlement/propSpecs.ts`). */
export const TREE_LOD_MAP = [
  { v1Model: 'birch_1.glb', v1SpeciesIndex: 3, v1Height: 4.4, v3Variant: 'Birch_A' },
  { v1Model: 'maple_1.glb', v1SpeciesIndex: 4, v1Height: 4.8, v3Variant: 'Maple_A' },
  { v1Model: 'deadtree_1.glb', v1SpeciesIndex: 5, v1Height: 3.6, v3Variant: 'Dead_A' },
  { v1Model: 'pine_1.glb', v1SpeciesIndex: 6, v1Height: 4.6, v3Variant: 'Pine_A' },
  { v1Model: 'pine_3.glb', v1SpeciesIndex: 7, v1Height: 5.2, v3Variant: 'Pine_B' },
  { v1Model: 'pine_5.glb', v1SpeciesIndex: 8, v1Height: 4.0, v3Variant: 'Pine_C' },
]

if (import.meta.url === `file://${process.argv[1]}`) {
  await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
  mkdirSync(OUT, { recursive: true })
  const read = (f) => JSON.parse(readFileSync(join(SRC, f), 'utf8'))
  const atlasJson = read('trees-impostors.json')
  const build = read('trees-build.json')
  const donorRev = (await import('node:child_process')).execSync('git rev-parse HEAD', { cwd: V3 }).toString().trim()

  // 1. GLB: keep the six roots, prune the rest.
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder })
  const doc = await io.read(join(SRC, 'trees.glb'))
  const keep = new Set(TREE_LOD_MAP.map((m) => m.v3Variant))
  const scene = doc.getRoot().getDefaultScene()
  for (const n of scene.listChildren()) {
    if (!keep.has(n.getName())) {
      scene.removeChild(n)
      n.dispose()
    }
  }
  await doc.transform(prune())
  // Re-encode with meshopt like the donor (the extension is already in the document from the read).
  doc.createExtension(ALL_EXTENSIONS.find((e) => e.EXTENSION_NAME === 'EXT_meshopt_compression')).setRequired(true).setEncoderOptions({ method: 'QUANTIZE' })
  await io.write(join(OUT, 'trees-lod.glb'), doc)

  // 2. Impostor atlases: crop six rows (image row of V3 row i = (rows-1-i)*cell, rowOrigin "bottom").
  const cell = atlasJson.cell
  const wide = atlasJson.views * cell
  const srcRows = atlasJson.rows
  const rows = TREE_LOD_MAP.map((m, newIndex) => {
    const v3Row = srcRows.findIndex((r) => r.name === m.v3Variant)
    if (v3Row < 0) throw new Error(`${m.v3Variant} missing from trees-impostors.json`)
    return { newIndex, v3Row, ...srcRows[v3Row] }
  })
  for (const file of ['trees-impostors.png', 'trees-impostors-normal.png']) {
    const outFile = file.replace('trees-impostors', 'trees-lod-impostors')
    // Raw RGBA row strips, top→bottom = highest new row first (rowOrigin "bottom"); lossless, no blending.
    const strips = await Promise.all([...rows].reverse().map((r) => sharp(join(SRC, file))
      .extract({ left: 0, top: (srcRows.length - 1 - r.v3Row) * cell, width: wide, height: cell }).ensureAlpha().raw().toBuffer()))
    await sharp(Buffer.concat(strips), { raw: { width: wide, height: rows.length * cell, channels: 4 } })
      .png({ compressionLevel: 9 }).toFile(join(OUT, outFile))
  }
  writeFileSync(join(OUT, 'trees-lod-impostors.json'), `${JSON.stringify({
    views: atlasJson.views,
    cell,
    rowOrigin: atlasJson.rowOrigin,
    rows: rows.map(({ name, kind, halfWidth, minY, maxY }) => ({ name, kind, halfWidth, minY, maxY })),
  }, null, 2)}\n`)

  // 3. Manifest.
  const variants = Object.fromEntries(build.variants.map((v) => [v.name, v]))
  const manifest = {
    packageVersion: 1,
    inert: true,
    provenance: {
      donor: 'jm-sky/seedvale-v3',
      donorCommit: donorRev,
      donorFiles: ['public/assets/trees.glb', 'public/assets/trees-impostors.png', 'public/assets/trees-impostors-normal.png', 'public/assets/trees-impostors.json', 'public/assets/trees-build.json'],
      generator: 'scripts/assets/extract-tree-lod.mjs',
    },
    files: { glb: 'trees-lod.glb', atlas: 'trees-lod-impostors.png', atlasNormal: 'trees-lod-impostors-normal.png', atlasJson: 'trees-lod-impostors.json' },
    atlas: { views: atlasJson.views, cell, rowOrigin: atlasJson.rowOrigin, width: wide, height: rows.length * cell, rows: rows.length },
    trees: TREE_LOD_MAP.map((m, i) => {
      const v = variants[m.v3Variant]
      const lod0 = { node: `${m.v3Variant}/LOD0`, tris: v.lod0.tris }
      const lod1 = { node: `${m.v3Variant}/LOD1`, tris: v.lod1.tris, how: v.lod1How, iou: v.lod1Iou }
      return {
        ...m,
        kind: rows[i].kind,
        glbRoot: m.v3Variant,
        lod0,
        lod1,
        impostor: { row: i, v3Row: rows[i].v3Row, views: atlasJson.views, halfWidth: rows[i].halfWidth, minY: rows[i].minY, maxY: rows[i].maxY },
        v3Scale: v.scale,
        v3Height: rows[i].maxY,
        v1ToV3HeightRatio: Number((rows[i].maxY / m.v1Height).toFixed(4)),
      }
    }),
  }
  writeFileSync(join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`wrote ${OUT}`)
}
