# Tree LOD package v1 (inert)

LOD0 + LOD1 meshes and an 8-view billboard impostor atlas for **six** V1 tree models, extracted from the V3 tree
pipeline. **Nothing in the game loads these files.** `TREE_SPECS`, placement, lifecycle and rendering are untouched;
V1 keeps using `public/models/nature/*.glb`.

## Files

| File | Content |
|---|---|
| `manifest.json` | Machine-readable mapping V1 model / species index → V3 variant → LOD nodes, triangle counts, impostor row, heights, provenance |
| `trees-lod.glb` | 6 root nodes (`Birch_A`, `Maple_A`, `Dead_A`, `Pine_A`, `Pine_B`, `Pine_C`), each with children `LOD0` and `LOD1`. Meshopt + `KHR_mesh_quantization`, textures embedded (5 materials, 9 textures) |
| `trees-lod-impostors.png` | 2048×1536 RGBA atlas: 8 views (columns, 256 px) × 6 rows (`rowOrigin: "bottom"`, row 0 = bottom image strip) |
| `trees-lod-impostors-normal.png` | Same layout, view-space normals |
| `trees-lod-impostors.json` | Atlas metadata, same schema as V3 `trees-impostors.json`, rows re-indexed 0–5 |

## Mapping (verified against V3 `scripts/assets/build-trees.mjs` `src:` fields and V1 `TREE_SPECS`)

| V1 species idx | V1 model | V1 height (m) | V3 variant | Atlas row | LOD0 tris | LOD1 tris | LOD1 method | Materials |
|---|---|---|---|---|---|---|---|---|
| 3 | `birch_1.glb` | 4.4 | `Birch_A` | 0 | 2960 | 1000 | tight cards | Bark_birch, Leaves |
| 4 | `maple_1.glb` | 4.8 | `Maple_A` | 1 | 2960 | 1000 | tight cards | Bark_maple, Leaves |
| 5 | `deadtree_1.glb` | 3.6 | `Dead_A` | 2 | 1960 | 760 | simplified | Bark_snag |
| 6 | `pine_1.glb` | 4.6 | `Pine_A` | 3 | 2128 | 448 | simplified | Bark_spruce, Leaves |
| 7 | `pine_3.glb` | 5.2 | `Pine_B` | 4 | 1998 | 449 | simplified | Bark_spruce, Leaves |
| 8 | `pine_5.glb` | 4.0 | `Pine_C` | 5 | 838 | 440 | simplified | Bark_spruce, Leaves |

## Provenance

- Donor: `jm-sky/seedvale-v3`, commit recorded in `manifest.json` (`provenance.donorCommit`); files `public/assets/trees.glb`,
  `trees-impostors.png`, `trees-impostors-normal.png`, `trees-impostors.json`, `trees-build.json`. Assets were **not regenerated**.
- Produced by `pnpm assets:trees-lod:extract` (`scripts/assets/extract-tree-lod.mjs`; needs a V3 checkout at `../seedvale` or `--v3=`).
  GLB: the other 8 variants are pruned, the six roots are kept whole and meshopt re-encoded. Atlas: rows are cropped
  losslessly (raw RGBA copy, no re-render/resample).
- The V3 variants themselves were built from the same V1 GLBs (`pack: 'v1'`, `src: <v1 model>`), so identity is by construction.

## Validation

`pnpm assets:trees-lod:validate` (`scripts/assets/validate-tree-lod.mjs`) — passes on this package:
manifest ↔ `TREE_SPECS`; V1 source model exists; per tree `LOD0`/`LOD1` mesh present with POSITION/NORMAL/TEXCOORD_0/COLOR_0,
every primitive has a material with a base-colour texture; triangle counts equal the manifest; atlas size 2048×1536; each
row's name/halfWidth/minY/maxY matches; LOD0 height matches impostor `maxY` (±0.6); all 8 views of every row have opaque
pixels; and, when the V3 checkout is present, decoded geometry/UVs/materials and atlas row pixels are identical to the donor.

## Notes for the runtime planner

- **Scale differs.** V3 models are authored at ~12–15 m (`maxY` in the JSON); V1 runtime fits each GLB to `TREE_SPECS.height`
  (3.6–5.2 m). `manifest.json` carries `v1ToV3HeightRatio` per tree. V3 meshes/impostors need a uniform scale of
  `v1Height / v3Height` (and `halfWidth` scales the same way). Do not assume the V3 mesh is the same shape at the same
  height as the V1 mesh — it is a simplified/re-textured derivative (leaf cards re-atlased, ≤3000 tris), so **LOD0 here is
  for reference/transition tests only; V1 LOD0 stays the runtime model.** Match of V1-LOD0 silhouette to the V3 LOD1/impostor is unverified.
- Materials/textures: bark textures are separate per species; all leaf cards share one `Leaves` material (MASK, PNG atlas texture).
  UVs point into that atlas — do not swap in V1's own leaf textures on these meshes.
- `COLOR_0` = (wind weight, baked AO, 1). V3 renames it to `aTreeVC` so three.js does not use it as diffuse colour; V3's
  `lodTemplate()` in `src/game/render/treeModels.ts` shows the material rebuild (Lambert, canopy normals, AO hook).
- The impostor atlas is baked "unlit albedo × soft AO"; brightness parity with Lambert needs the AO hook (V3 `TREE_AO_STRENGTH`).
- GLB uses `EXT_meshopt_compression` and `KHR_mesh_quantization` — the loader needs `MeshoptDecoder`.
- Scope B (`tree_a/b/c`, `deadtree_3/5/8/10`) is **not** included. Dead_B–E exist in the V3 donor if wanted later.
- No size/draw-call/perf figures are claimed. Package size ≈ 2.8 MB (GLB 1.35 MB, two atlases 1.5 MB), none of it fetched at runtime.
- Licence: V1 `CREDITS.md` lists the source species as Quaternius CC0; V3 re-atlased the textures — 🟡 re-confirm before shipping.
