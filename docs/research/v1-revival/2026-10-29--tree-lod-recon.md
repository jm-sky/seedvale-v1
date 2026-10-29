# Track D — V1 tree LOD recon (Queue Q2)

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Status:** recon done. The formal LOD1 plan (`world-terrain-055`) is **not written**: the evidence does not support it yet, so there is an author question in queue §3.
**Inputs:** [tree LOD dossier](./2026-10-28--tree-lod-v1-backlog-candidate.md), [asset package](../../../public/assets/tree-lod/v1/README.md) (`d867f38`), current source, and the existing Windows benchmark reports (no new FPS runs).

## 1. How V1 renders trees today ✅ (source)

- **Placement → lifecycle → batch.** `chunkManager.ts` `attachChunkContent` registers every tree in `treeLifecycle` (identity `makeId(x, z, species)`, stage, chop/regrow). Living, mature trees go to `vegetationRegionBatcher.setChunkPlacements(coord, 'tree-living', treeTemplates, placements)` (~l.2334). Other stages and planted trees are separate `chunk-vegetation-extras` objects.
- **Batching.** One `InstancedPropGroup` (`render/instancedProps.ts`) per **3×3-chunk region × kind**. Inside a group there is one `InstancedMesh` per template mesh part (bark, leaves) per species. Chop/regrow uses `removeByKey`. A chunk load or unload rebuilds the whole region + kind.
- **Existing distance policy.** Trees use the `silhouette` LOD class (`vegetationLodFraction`). The submitted instance count follows the shared `densityLodFraction` curve ("nearest member wins" per region). Mirror visibility is per region (`REFLECTION_DISTANT_LAYER`). Trees cast shadows.
- **Templates.** There are 13 `TREE_SPECS` (`settlement/propSpecs.ts`), each fitted to `height` 3.4–5.2 m by `prepareProp`. Materials are V1 GLB `MeshStandardMaterial` with foliage wind (`foliageWind.ts`).

## 2. V1 template cost vs package LOD1 ✅ (GLB accessor counts)

| V1 model | V1 tris | Package LOD1 tris | In package |
| --- | ---: | ---: | --- |
| `tree_c` | 6 678 | — | no (parked) |
| `deadtree_8` / `deadtree_3` / `deadtree_1` | 4 944 / 4 928 / 4 792 | — / — / 760 | only `deadtree_1` |
| `birch_1` | 4 596 | 1 000 | yes |
| `maple_1` | 3 848 | 1 000 | yes |
| `deadtree_10` / `deadtree_5` | 3 208 / 1 360 | — | no |
| `pine_1` / `pine_3` / `pine_5` | 2 128 / 1 998 / 838 | 448 / 449 / 440 | yes |
| `tree_a` / `tree_b` | 552 / 384 | — | no |

The six package species save 0.4k–3.8k triangles per instance. The heaviest V1 template (`tree_c`) and three heavy dead trees are not covered.

## 3. What the measurements say ✅ (existing Windows reports, one-pass census)

| Fixture (Windows) | FPS avg | Vegetation main draws / tris / instances | Grass tris | Terrain tris | Main calls |
| --- | ---: | --- | ---: | ---: | ---: |
| forest (`win-fix1-forest-rep3`) | 51.7 | 101 / 250k / 176 | 7.46M | 4.05M | 1 055 |
| stream (`win-ca1-ab-B-pair6-warm-stream-rep1`) | 60.7 | 199 / 1.32M / 841 | 1.12M | 4.87M | 576 |
| settlement-heavy (`win-skelshare-warmupB-…-rep1`) | 28.7 | 214 / 755k / 599 | 1.20M | 5.60M | 1 444 |

Vegetation includes bushes, ferns and reeds, so trees are a subset.

- **The bucket is small everywhere.** Trees are at most ~1.3M of 8–14M triangles and ≤ 214 main draws. In no fixture are they the dominant cost. The settlement-heavy critical path is actor/settlement CPU submission ([Q1 review](./2026-10-29--performance-negative-experiments-review.md) §3).
- **No fixture measures a dense forest.** The `forest` fixture (`seekForest`: highest `forestFactor` within 384 m of home) has only ~176 vegetation instances, with 702 settlement draws in view. Its cost is grass (7.46M tris). The dossier's "forest-heavy FPS" objective has **never been measured**.
- **Forest and stream are already at target** on Windows (51.7–56 and 60.7 FPS, against 45–60 acceptable).

## 4. Why LOD1 as packaged is a weak candidate now

1. **It adds draws.** A distance band per region needs its own `InstancedMesh` per template part, so a region with near and mid trees submits more calls than today. Windows is main-thread / submission bound in the heavy scenes, so extra calls cost more there than the triangles they save. 🟡 A per-instance LOD swap without new draws would need a different batch layout, for example near and mid bands as separate regions. That is a larger change.
2. **Visual parity risk (a `Stop if` condition).** Package LOD1 is a V3 re-atlased derivative: shared `Leaves` atlas, cards re-laid, `COLOR_0` = wind/AO, V3 Lambert material. V1 LOD0 uses per-species V1 leaf textures under `MeshStandardMaterial`. Mid-range leaf colour, brightness and silhouette continuity are unverified (IoU 0.83–0.92 vs the V3 LOD0, not vs V1). D11 sets a V1-first material direction for NPCs. Matching it here means rebuilding V1-like materials over a V3 UV atlas, and the result can still differ visibly.
3. **Coverage gap.** `tree_c` (the heaviest at 6.7k tris) and three of the four heavy dead trees are excluded by the dossier's scope.
4. **The existing density LOD already thins mid/far trees.** The remaining saving is triangles on instances that are already submitted, in scenes where triangles are not the measured limit.

## 5. If LOD1 is approved later: plan skeleton (for `world-terrain-055`)

- **Owner:** `vegetationRegionBatcher` (kind `tree-living` only), templates from `chunkManager.getTreeTemplates`. `treeLifecycle` identity, placement and chop/regrow stay untouched. `removeByKey` must remove from whichever band holds the key.
- **Band rule:** per region, from the existing `syncLod` chunk distance (no per-frame per-tree work). The band is chosen at rebuild time, so a band change is a region rebuild. Rebuild cost and upload stutter must be measured in `stream`.
- **Templates:** load `trees-lod.glb` with `MeshoptDecoder`, scale by `v1Height / v3Height`, and build materials V1-first (Standard, `foliageWind` hook, `COLOR_0` renamed so it is not diffuse).
- **Shadows/mirror:** LOD1 casts shadows like LOD0. Mirror keeps the existing region layer rule.
- **Verification:** an isolated side-by-side demo of V1 LOD0 against LOD1 at the band distance for each species (author visual gate before any runtime wiring); focused tests for band assignment, `removeByKey` across bands and dispose; A/B in a **new dense-forest fixture** plus `stream` (triangles, main/shadow calls, GPU time, p95/p99, rebuild hitches).

## 6. Recommendation

Do not write the full LOD1 plan or implement Q3 yet.

1. First add a **dense-forest benchmark fixture**. This is tooling with no runtime effect. Select the anchor by vegetation instance count, not `forestFactor` near home. Record its WSL and Windows census and FPS.
2. If trees are not a top cost there either, **close P1-D** in the P1 exit packet as "measured, not needed". The asset package stays inert and becomes a post-P1 candidate.
3. If they are, write `world-terrain-055` from §5, starting with the isolated visual-parity demo.

Author chose step 1 (2026-10-29). The `dense-forest` fixture landed in `a6676a11`. [WSL census](../../performance/results/2026-10-29--wsl-q2a-dense-forest-fixture.md): 2 457 vegetation instances and 3.7M main + 3.7M shadow tree triangles. Steps 2/3 wait for the Windows run.
