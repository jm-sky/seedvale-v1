/**
 * Extracts the profession-signature home dressing nodes (queue Q48 / Q42 plan §2.3)
 * from the SeedVale-v3 `public/assets/props.glb` into the compact
 * `public/models/settlement/profession-dressing.glb`.
 *
 * Licences: Quaternius packs CC0; `Hamlet_Antlers` = "Antlers" by Poly by Google
 * (CC BY 3.0, poly.pizza 9oH6TjelO-W) — credit in docs/assets/CREDITS.md;
 * hides/nets/drying-rack/herb-bed are project-owned Blender bakes.
 *
 * Usage: node scripts/assets/extract-profession-dressing.mjs <v3-repo-root>
 */
import path from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, meshopt, prune } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'

const donor = path.resolve(process.argv[2] ?? '../seedvale-v3')
const KEEP = new Set([
  'Hamlet_Antlers', 'Hamlet_HidesFrame', 'Hamlet_Shield', 'Hamlet_Banner', 'Hamlet_NetOnWall',
  'Hamlet_DryingRack', 'Hamlet_Axe', 'Hamlet_Sack', 'Hamlet_Cart', 'Hamlet_HerbBed',
])
const SRC = path.join(donor, 'public/assets/props.glb')
const DST = path.resolve('public/models/settlement/profession-dressing.glb')

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder })
const doc = await io.read(SRC)
const scene = doc.getRoot().listScenes()[0]
for (const node of scene.listChildren()) {
  if (!KEEP.has(node.getName())) node.dispose()
}
await doc.transform(prune(), dedup(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
await io.write(DST, doc)
let tris = 0
for (const n of doc.getRoot().listScenes()[0].listChildren()) {
  n.traverse((c) => { const m = c.getMesh(); if (m) for (const p of m.listPrimitives()) tris += (p.getIndices()?.getCount() ?? 0) / 3 })
  console.log(n.getName())
}
console.log('wrote', DST, 'tris', tris, 'materials', doc.getRoot().listMaterials().map(m => m.getName()).join(','))
