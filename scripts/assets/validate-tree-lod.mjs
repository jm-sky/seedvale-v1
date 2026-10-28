import { getBounds, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'
/**
 * Lightweight validation of the inert tree LOD package `public/assets/tree-lod/v1/` (see its README.md).
 *
 *   node scripts/assets/validate-tree-lod.mjs [--pkg=public/assets/tree-lod/v1] [--v3=../seedvale]
 *
 * Always checks: manifest ↔ V1 `TREE_SPECS`, GLB LOD0/LOD1 presence, material/texture dependencies, triangle counts
 * and bounds vs the manifest, atlas size and row metadata. With the V3 donor checkout present it also compares decoded
 * geometry and atlas pixels with the donor (skipped with a note otherwise). Exit code 1 on any failure.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d
const PKG = resolve(arg('pkg', 'public/assets/tree-lod/v1'))
const V3 = resolve(arg('v3', '../seedvale'))
let failures = 0
const check = (ok, msg) => { if (!ok) { failures++; console.error(`FAIL ${msg}`) } return ok }

await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder })
const manifest = JSON.parse(readFileSync(join(PKG, 'manifest.json'), 'utf8'))
const atlasJson = JSON.parse(readFileSync(join(PKG, manifest.files.atlasJson), 'utf8'))
const doc = await io.read(join(PKG, manifest.files.glb))
const root = doc.getRoot()
const scene = root.getDefaultScene()

// V1 TREE_SPECS (parsed from source, no runtime import).
const specSrc = readFileSync('src/settlement/propSpecs.ts', 'utf8')
const specs = [...specSrc.slice(specSrc.indexOf('TREE_SPECS = ['), specSrc.indexOf('] as const', specSrc.indexOf('TREE_SPECS = ['))).matchAll(/url: '\/models\/nature\/([^']+)', height: ([\d.]+)/g)].map((m) => ({ model: m[1], height: Number(m[2]) }))

check(scene.listChildren().length === manifest.trees.length, `GLB roots ${scene.listChildren().length} != ${manifest.trees.length}`)
check(atlasJson.rows.length === manifest.trees.length, 'atlas rows != trees')
const atlasMeta = await sharp(join(PKG, manifest.files.atlas)).metadata()
const normalMeta = await sharp(join(PKG, manifest.files.atlasNormal)).metadata()
for (const m of [atlasMeta, normalMeta]) check(m.width === manifest.atlas.width && m.height === manifest.atlas.height, `atlas size ${m.width}x${m.height} != ${manifest.atlas.width}x${manifest.atlas.height}`)

const donorIo = existsSync(join(V3, 'public/assets/trees.glb')) ? new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder }) : null
const donorDoc = donorIo ? await donorIo.read(join(V3, 'public/assets/trees.glb')) : null
const donorAtlas = donorIo ? JSON.parse(readFileSync(join(V3, 'public/assets/trees-impostors.json'), 'utf8')) : null
if (!donorDoc) console.log('note: V3 donor checkout not found — donor comparison skipped')

const meshTris = (node) => node.getMesh()?.listPrimitives().reduce((a, p) => a + p.getIndices().getCount() / 3, 0) ?? 0
const attrsEqual = (a, b) => a.getCount() === b.getCount() && a.getType() === b.getType() && a.getComponentType() === b.getComponentType() && a.getArray().every((v, i) => v === b.getArray()[i])

const rowsOut = []
for (const t of manifest.trees) {
  const spec = specs[t.v1SpeciesIndex]
  check(spec?.model === t.v1Model && spec.height === t.v1Height, `${t.v1Model}: TREE_SPECS[${t.v1SpeciesIndex}] is ${spec?.model}/${spec?.height}`)
  check(existsSync(join('public/models/nature', t.v1Model)), `${t.v1Model}: V1 model missing`)
  const rootNode = scene.listChildren().find((n) => n.getName() === t.glbRoot)
  if (!check(rootNode, `${t.glbRoot}: root missing`)) continue
  const lods = {}
  for (const k of ['LOD0', 'LOD1']) {
    const n = rootNode.listChildren().find((c) => c.getName() === k)
    if (!check(n?.getMesh(), `${t.glbRoot}/${k}: mesh missing`)) continue
    const prims = n.getMesh().listPrimitives()
    const mats = prims.map((p) => p.getMaterial())
    check(mats.every(Boolean), `${t.glbRoot}/${k}: primitive without material`)
    for (const p of prims) {
      check(!!p.getAttribute('POSITION') && !!p.getAttribute('TEXCOORD_0') && !!p.getAttribute('NORMAL'), `${t.glbRoot}/${k}: missing POSITION/TEXCOORD_0/NORMAL`)
      check(!!p.getMaterial()?.getBaseColorTexture(), `${t.glbRoot}/${k}: ${p.getMaterial()?.getName()} has no baseColor texture`)
      check(!!p.getAttribute('COLOR_0'), `${t.glbRoot}/${k}: missing COLOR_0 (wind/AO)`)
    }
    const triCount = meshTris(n)
    check(triCount === t[k === 'LOD0' ? 'lod0' : 'lod1'].tris, `${t.glbRoot}/${k}: tris ${triCount} != manifest`)
    const b = getBounds(n)
    lods[k] = { tris: triCount, materials: [...new Set(mats.map((m) => m.getName()))], maxY: Number(b.max[1].toFixed(3)) }
    if (donorDoc) {
      const dn = donorDoc.getRoot().getDefaultScene().listChildren().find((c) => c.getName() === t.v3Variant).listChildren().find((c) => c.getName() === k)
      const dps = dn.getMesh().listPrimitives()
      const same = dps.length === prims.length && prims.every((p, i) => p.getMaterial().getName() === dps[i].getMaterial().getName()
        && p.getMaterial().getBaseColorTexture().getImage().length === dps[i].getMaterial().getBaseColorTexture().getImage().length
        && ['POSITION', 'NORMAL', 'TEXCOORD_0', 'COLOR_0'].every((s) => attrsEqual(p.getAttribute(s), dps[i].getAttribute(s)))
        && p.getIndices().getArray().every((v, j) => v === dps[i].getIndices().getArray()[j]))
      check(same, `${t.glbRoot}/${k}: geometry/material differs from donor`)
    }
  }
  const row = atlasJson.rows[t.impostor.row]
  check(row?.name === t.glbRoot && row.halfWidth === t.impostor.halfWidth && row.maxY === t.impostor.maxY && row.minY === t.impostor.minY, `${t.glbRoot}: atlas row ${t.impostor.row} mismatch`)
  check(Math.abs((lods.LOD0?.maxY ?? 0) - row.maxY) < 0.6, `${t.glbRoot}: LOD0 maxY ${lods.LOD0?.maxY} vs impostor maxY ${row.maxY}`)
  // Atlas row has visible pixels in every view cell, and matches the donor pixels.
  const rowBuf = (file, top, h) => sharp(join(PKG, file)).extract({ left: 0, top, width: manifest.atlas.width, height: h }).raw().toBuffer()
  const top = (manifest.atlas.rows - 1 - t.impostor.row) * manifest.atlas.cell
  const px = await rowBuf(manifest.files.atlas, top, manifest.atlas.cell)
  for (let v = 0; v < manifest.atlas.views; v++) {
    let opaque = 0
    for (let y = 0; y < manifest.atlas.cell; y++) for (let x = 0; x < manifest.atlas.cell; x++) if (px[(y * manifest.atlas.width + v * manifest.atlas.cell + x) * 4 + 3] > 128) opaque++
    check(opaque > 500, `${t.glbRoot}: impostor view ${v} nearly empty (${opaque} opaque px)`)
  }
  if (donorAtlas) {
    for (const [file, dfile] of [[manifest.files.atlas, 'trees-impostors.png'], [manifest.files.atlasNormal, 'trees-impostors-normal.png']]) {
      const a = await rowBuf(file, top, manifest.atlas.cell)
      const dTop = (donorAtlas.rows.length - 1 - t.impostor.v3Row) * manifest.atlas.cell
      const d = await sharp(join(V3, 'public/assets', dfile)).extract({ left: 0, top: dTop, width: manifest.atlas.width, height: manifest.atlas.cell }).raw().toBuffer()
      check(Buffer.compare(a, d) === 0, `${t.glbRoot}: ${file} row pixels differ from donor`)
    }
  }
  rowsOut.push({ v1: t.v1Model, v3: t.glbRoot, idx: t.v1SpeciesIndex, row: t.impostor.row, lod0Tris: lods.LOD0?.tris, lod1Tris: lods.LOD1?.tris, materials: lods.LOD0?.materials.join('+'), height: row.maxY, halfWidth: row.halfWidth })
}
console.log(`GLB: ${root.listMaterials().length} materials [${root.listMaterials().map((m) => m.getName())}], ${root.listTextures().length} textures`)
console.table(rowsOut)
console.log(failures ? `${failures} check(s) FAILED` : 'all checks passed')
process.exit(failures ? 1 : 0)
