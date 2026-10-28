/**
 * Extracts the five firewood tier meshes (`pile_firewood_{1,5,7,14,20}`) from the
 * SeedVales-v2 `stockpiles.glb` into the compact firewood-only
 * `public/models/settlement/wood_pile_tiers.glb` (plan settlements-npcs-025, wood
 * stockpile V2-donor optimisation). Own Blender-authored models, no external credits.
 *
 * Usage: node scripts/assets/extract-wood-pile-tiers.mjs <donor-repo-root>
 * `@gltf-transform/*` and `meshoptimizer` are resolved from the donor repo's
 * node_modules (they are not V1 dependencies).
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const donor = path.resolve(process.argv[2] ?? '../seedvale-2')
const req = createRequire(path.join(donor, 'package.json'))
const { NodeIO } = req('@gltf-transform/core')
const { ALL_EXTENSIONS } = req('@gltf-transform/extensions')
const { meshopt, prune } = req('@gltf-transform/functions')
const { MeshoptDecoder, MeshoptEncoder } = req('meshoptimizer')

const KEEP = new Set(['pile_firewood_1', 'pile_firewood_5', 'pile_firewood_7', 'pile_firewood_14', 'pile_firewood_20'])
const SRC = path.join(donor, 'public/assets/stockpiles.glb')
const DST = path.resolve('public/models/settlement/wood_pile_tiers.glb')

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder })
const doc = await io.read(SRC)
const scene = doc.getRoot().listScenes()[0]
for (const node of scene.listChildren()) {
  if (!KEEP.has(node.getName())) node.dispose()
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
await io.write(DST, doc)
console.log('wrote', DST)
