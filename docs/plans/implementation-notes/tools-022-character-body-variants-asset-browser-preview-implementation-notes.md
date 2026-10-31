# Implementation notes: Character body variants — Asset Browser preview

**Date:** 2026-10-31
**Plan:** [tools-022](../tools-022-character-body-variants-asset-browser-preview.md)
**Scope:** recon and implementation handoff only; no feature implementation or asset regeneration performed.
**Verified source:** V1 `395e96e6e4575090346b4d25a3ebe6b54738b5aa`; V3 donor `47733d6ba0fe96d4607be22c470c7331c76c2c5c`.

**Implementation model:** Opus; cheaper fallback: Sonnet. The rest-space/quantization and morph-binding work warrants Opus; Sonnet is suitable once the audit gates and target contracts below are followed, with author visual review.

## 1. Conclusion and evidence limits

Use the shipped V1 GLBs as the input to a **Node-only, preview-only** morph post-process. Do not rebuild the source outfits, require a local Source pack, or invoke Blender to start this experiment. V1 already has the warp, meshopt-capable build dependencies and a separate Asset Browser attachment path. V3 supplies a useful generator, but not a safe drop-in implementation.

The baseline UI label should be **Muscular (original)**, with all preview influences zero. The donor calls zero influence “normal”; that is a technical weight, not evidence that the stock Super Hero physique satisfies the author's Normal silhouette.

Confirmed through connector reads:

- Current source files and repository inventories were inspected, including the plan, planning guide, metadata contract, CODE_INDEX, STATE, relevant appearance/asset/browser code and V3 donor scripts.
- The GLB JSON chunks of **20 of 22 shipped outfit files** were parsed from actual base64 binary responses: 19 contain named `Fat` targets; Male_Woodcutter does not. Female_Head and hair.glb were also sampled; neither contains body targets. WorkSkirt_Female.raw.glb has no morph targets.
- These are structural observations, not decoded meshopt geometry, a rendered inspection, an animation run or a performance measurement.
- GitHub's contents reader returned empty content for files above 1 MB: Male_Blacksmith, Male_Farmer, eq/Male, eq/Female and anims. A Git-blob read fallback was rejected by the connector's UTF-8 restriction. Their paths, sizes and callers are verified; **their target coverage, numeric geometry and clip names are not**. Complete that bounded binary audit from a checkout before generation. Do not infer their contents from neighboring files.
- No .blend was opened. Master presence and exporter object contracts are verified; internal Blender scene contents are not.
- No automated build/test/browser/screenshot/FPS checks were run in this documentation-only task.

This handoff resolves ownership and implementation direction. Numeric rest-space validation, the five unread binaries and visual quality remain explicit implementation gates.

## 2. Actual V1 assets and author modifications

Canonical current kit URLs are defined by `src/characters/characterFiles.ts`: `bodyUrl`, `headUrl`, `hairUrl`, `eqUrl`, `ANIMS_URL`, `hairNodeName`, `eqNodeName`. Use those mappings rather than legacy UBC paths.

All bodies below live in `public/assets/characters/`. Sizes are exact repository bytes. “Fat p/n” counts primitives with POSITION/NORMAL targets; a primitive count is not a draw-call measurement.

| Outfit | Male bytes; Fat p/n | Female bytes; Fat p/n |
|---|---:|---:|
| Peasant | 775208; 5/5 | 508348; 4/4 |
| Peasant_Boots | 707740; 5/5 | 494616; 4/4 |
| Blacksmith | 1630256; unread | 481324; 5/5 |
| Herbalist | 740224; 5/5 | 490164; 4/4 |
| Ranger | 1046552; 9/9 | 1047040; 9/9 |
| Ranger_NoHood | 1024984; 9/9 | 1025456; 9/9 |
| Knight | 874244; 6/6 | 853488; 6/6 |
| Knight_Cloth | 797704; 5/5 | 796088; 5/5 |
| Knight_Helm | 896292; 6/6 | 875412; 6/6 |
| Wizard | 884900; 7/7 | 910664; 7/7 |
| Farmer | 1052448; unread | not shipped |
| Woodcutter | 647004; absent | not shipped |

The 19 morph-bearing inspected bodies use `EXT_meshopt_compression` and `KHR_mesh_quantization`, mesh extras `targetNames: ["Fat"]`, and zero mesh default weights. Unmoved meshes can legitimately have no target: e.g. a hood/helmet. None of the 20 inspected body files carries animations. This does not prove that every vertex delta is correct.

Other relevant shipped inputs:

| Path under public/assets/characters | Verified role / bytes |
|---|---|
| eq/Male.glb | module pack, 1741056; binary targets not audited |
| eq/Female.glb | module/garment pack, 1940376; binary targets not audited |
| anims.glb | shared clips, 2555596; actual clip list still to inspect |
| Male_Head[_{Lean,Round,Warm}].glb | separate head packs, 680764–681012 |
| Female_Head[_{Lean,Round,Warm}].glb | separate head packs, 714568–714732 |
| hair[_{Lean,Round,Warm}].glb | separate named hair/beard packs, 414044–414224 |

`characterTypes.ts` defines 12 outfit names, `MALE_ONLY_OUTFITS`, head-only `Base | Lean | Round | Warm`, `WORK_SKIRTS` and `SKIRTED_FEMALE_OUTFITS`. `baseGarments(sex, outfit, skirt)` supplies WorkSkirt for Female Peasant, Peasant_Boots, Herbalist and Wizard. Do not substitute the old PeasantSkirt node.

Source inventory that must be preserved:

- `docs/blender/sources/characters/quaternius/outfits/Quaternius_Outfits_All_Male.blend` (**20415954 bytes**) and its `.blend1` backup (**20215290 bytes**) are committed. No female character master .blend was found in the repository tree.
- `scripts/assets/blender-character-variants.py` defaults PACK to that repository folder and prefers `Quaternius_Outfits_All_<Sex>.blend`, falling back to `All_<Sex>.blend`. `AUTHORED` explicitly exports Male_Farmer (Peasant parts + hat), Male_Woodcutter (Woodcutter parts) and Male_Blacksmith (including apron, bracers and belt). `CLEAN_FEET` and material handling separate stock/procedural parts from the edited master. This is evidence of an authored export contract, not a reason to replace it.
- `assets-src/characters/` contains committed raw exports: both sexes of Blacksmith, Herbalist, Peasant_Boots, plus Male_Farmer and Male_Woodcutter. `assets-src/characters/eq/` contains WorkSkirt/Red/Blue, NobleBodice and equipment/armor raws, including some candidates not included in the shipped pack.
- Separate older custom inputs exist at `docs/blender/sources/characters/custom/{blacksmith,peasant,woodcutter}/outfit.glb` (6807680 / 6670296 / 5639476 bytes). The custom READMEs associate these with `prepare-custom-ubc-npc.py` and `public/models/characters/ubc/npc/`. They are **not** interchangeable with current `assets-src` raws.
- Repository-local male base/hair source files exist under `docs/blender/sources/characters/quaternius/{ubc-base,hair}/`. Parked full-body glTF + BIN sources for **both sexes** also exist under `public/models/parked/character-pack/models/`; parked Peasant/Ranger sources live in its `outfits/` directory. Neither requires importing a fresh CharacterKit.
- Older `public/models/characters/ubc/` GLBs and `/compare/v2|v3/` browser mounts belong to other pipelines/comparisons. They must not become the generation source just because their labels are familiar.

### Documentation discrepancies

`docs/assets/quaternius-character-blend-pipeline.md` still says custom masters are not committed, Woodcutter is Peasant data, and Fat generation is available. Current tree/exporter/types contradict those statements. Its later V1 note only partially repairs the older text. V1 has **no** `scripts/assets/build-body-morph.mjs`, despite the warp comment/document referring to it. Do not report current Node outfit builders as automatically regenerating Fat: neither inspected builder calls that missing stage.

`npc-062` still discusses the older UBC material path; it is not a dependency authorizing runtime material work here. `items-player-037` is a draft concerning runtime slots, also outside scope.

## 3. Reusable pipeline and V3 donor

### V1 build ownership

- `scripts/assets/build-characters.mjs`: `--raw`, selected variant names and `--out`; reads committed raws without Blender. Stock outfit rebuilds still depend on local Fantasy pack glTF sources. Tight `RAW_ERROR` entries protect authored male outfits. It simplifies/joins/meshopt-encodes and preserves the selected source look; **do not run it simply to add preview morphs**.
- `build-equipment-modules.mjs`: `MODULES`, `RATIO`, `INFLATE`, `TEX_SIZE`; a selected-module run requires `--out`. A full rebuild uses local stock sources as well as raws and rewrites both packs. Do not rebuild equipment from incomplete local sources. Current table includes IronHelm, PlateCuirass, Pauldrons, LeatherBoots, WorkSkirt dyes, NobleBodice, LeatherJerkin, Bracers, LeatherTrousers, Chainmail, StuddedLeather, PaddedJacket, LeatherCap and Gloves.
- `build-head-variants.mjs` and `head-warp.mjs` generate separate face-shape files, not body targets. Their upstream source staging and head-only cuts are unrelated to the body preview.
- Dependencies already in package.json: `@gltf-transform/{core,extensions,functions} ^4.5.1`, `meshoptimizer ^1.3.0`; rendering uses `three ^0.185.1`, Vue 3. No new dependency is justified for the donor technique. Use the lockfile and supported Node version (Docs Sync uses Node 22); await meshopt encoder/decoder readiness.

### V3: selectively reuse, not transplant

V3 `scripts/assets/body-warp.mjs` is byte-identical to V1 (blob `65d9e06156e3388c17dd09d5b2ac0888ebf8eb81`). It exports `BODY_MORPH = 'Fat'`, sex-specific `BODY` parameters and `warpBody(sex, p)`. The spatial warp expects **rest-space metres**, +Y up, +Z forward, horizontal rest arms. It pushes the belly forward and widens waist/hips/arms. Its comment's claim about untouched upper regions must be verified numerically at seams, not accepted as a strict zero mask.

V3 `build-body-morph.mjs` (blob `919978b2687eeb4f753b8a2d3f2397acc6d7af8a`) provides:

- `dequant(node)`: forms each joint world matrix × inverse bind matrix, checks all joints agree, and checks the common rest transform is uniform scale plus translation.
- `processFile(file, sex)`: converts decoded normalized mesh coordinates to rest metres, applies the warp, divides displacement by rest scale and writes relative targets. Adds zero weights and `extras.targetNames`.
- `quantized(...)`: normalized Int16 deltas, rounded to 11-bit steps; retains meshopt/quantization rather than resimplifying the mesh.

Required adaptations:

1. **No in-place production writes.** Add an explicit output directory and preview input manifest; reject source/output aliasing. Prefer `public/assets/characters/body-preview/`, retaining body filenames and `eq/<Sex>.glb`. All game URL helpers continue returning the original files. No heads/hair/animations need duplication.
2. The donor deletes **all** primitive targets before writing Fat. Preserve unrelated targets, target names, node/mesh weights and any animation weight tracks. Replace only the requested preview target by name with consistent primitive indices; pad zero deltas where needed within a mesh. Validate shared meshes/accessors instead of disposing data another target still references.
3. The donor OUTFITS list omits Farmer/Woodcutter and infers sex from basename. Use an explicit sex/path allowlist derived from actual V1 files; never synthesize Female_Farmer/Woodcutter. Include authored bodies and both equipment packs.
4. Validate the actual decoded rest transforms, uniform **nonzero positive** scale, units, axis orientation, JOINTS/WEIGHTS, normals and vertex counts. Reject unsupported transforms with the file/node name. Identity/unquantized inputs are valid only if the same rest-space contract holds. Do not apply metre-valued displacement directly to normalized Int16 positions.
5. Process a shared mesh once only when all its users have compatible rest transforms. Preserve indices, UVs, skin weights/joints, inverse binds, materials, texture payloads and base POSITION/NORMAL. No new simplify, join, tint or texture conversion.
6. The donor normal calculation differentiates the warp along the normal (approximately J·n). That is not generally the correct normal transformation for nonuniform deformation (inverse-transpose Jacobian). Do not use it as proof of shading quality. For new targets use a numerically validated inverse-transpose deformation transform (or equivalent verified surface-normal calculation), with seam checks. Existing Fat normals are reference data, not automatically certified.
7. Donor quantization clamps each delta to [-1,1]; fail/report overflow rather than silently clipping new targets. Position and normal deltas need separate error checks. Float32 preview targets are an acceptable first quality baseline; quantize only after measuring error. Donor omits equipment NORMAL targets for its historical size budget: do not silently inherit that quality compromise.
8. Idempotence means same source + parameters → same decoded geometry, target ordering and coverage, without accumulated deformation. Always derive from untouched base positions, never from the last preview result. Record source hashes/parameters/output byte counts; write atomically. Repeat generation and compare semantic output (byte determinism where supported).

Do not import V3 `src/game/render/actors/characterKit.ts`. That implementation merges primitives into cached templates and intersects supported morph names; V1 deliberately uses unmerged assembly. Only the isolated asset-building technique is useful here.

## 4. Browser integration: exact seam, no gameplay edits

### Current path

`AssetBrowser.vue` builds the wired index with `buildAssetIndex()`, merges the disk manifest, resolves selection with `resolveLoadEntry`, and calls `viewer.loadReference/loadTarget`. `BrowserState` owns IDs/free URLs, compareHead, hairColor, pose and clip; it has **no body build or full CharacterAppearance editor**.

`createViewer.ts` owns reference/target slots, animation reconciliation, camera framing, held/accessory previews and dirty rendering. `createAssetSlot.ts::load` loads body/clips, applies prepare, attaches the compare kit, measures bounds and creates AnimationMixer. It **does not call assembleCharacter**.

`mountCompareGarments.ts::{attachCompareHead,attachCompareGarments,attachCompareKit}` already implements tool-only skeleton rebinding. Its `rebindAllSkinned` and separate garment loop construct `new SkinnedMesh(src.geometry, src.material)`, bind by joint name and set `frustumCulled=false`. Geometry morph attributes survive via the reused geometry, but named dictionaries and source influence arrays are **not explicitly copied**. Constructor defaults are not a reliable preservation contract. Both paths need explicit independent dictionary/influence copies for preview assets and regression tests.

Despite the “fail closed” comment, missing bones currently warn and fall back to source bones. New preview eligibility must reject partial/unbound garments rather than treating that result as compatible.

### Recommended minimal implementation

1. Add a small **browser-local** preview catalog/adapter under `src/tools/assetBrowser/`, using `CharacterSex`, outfit/head/hair constants, `characterFiles.ts` mappings and `baseGarments`. Represent the exact V1 body/head/hair/garment combination being inspected. Keep new preview entries out of shared gameplay appearance definitions. Existing generic AssetIndex/UBC/v2/v3 entries retain their behavior.
2. Use the existing asset selector to choose the sex/outfit entries; no new panel or side-by-side design is required. The existing UI has a head toggle and hair-color control, not independent current-kit face/hair-style selectors. Preserve every currently available choice; do not claim those absent selectors already exist. Where a head/hair combination is provided by the preview entry, retain its exact URLs/node selection on build changes.
3. Assemble preview entries using the existing browser attachment functions extended narrowly for current named garment and optional hair nodes. `CompareGarment` in shared `assetIndex.ts` is currently only `'PeasantSkirt'`; do **not** cast WorkSkirt to that type. A tool-local descriptor can use existing `CharacterGarment`/equipment node strings and pass validated node selections into the browser attachment helper. Retain matching `headUrl(sex, head)` and `hairUrl(head)`; hair nodes are `HAIR_<style>` / `HAIR_Beard`.
4. Initially load the derivative body/eq once per preview entry at zero weights; use original head/hair files and original `ANIMS_URL`. Preserve base rest attributes/materials, so zero weights reproduce the original silhouette. Add **one build selector** for the inspected preview character. Use reference as the character owner when present, otherwise target; do not automatically morph unrelated comparison slots or held items. Expose this ownership in the label/status.
5. Add a tool-only `applyBodyBuild` operation to the slot/viewer path. After all attachments have loaded, collect compatible meshes, clear only owned body-target weights and set the selected target by dictionary name. Repeat after load/reload/attachment completion. On a pure build switch, do not reload the GLB, recreate AnimationMixer, reset animation time, change selected IDs/head/hair/outfit, reset transforms or move the camera.
6. Scope capability detection to catalogued V1 preview assets and their selected attachments. A target on some body meshes is insufficient if a required skirt/armor module cannot follow. Head/hair/helmet with verified zero movement is allowed to remain unchanged; missing deformation on an affected garment is a reason to disable that build with a visible explanation. Never advertise a partial Heavy as ready.
7. Keep existing compare entries/layouts unchanged. Preserve URL/query behavior; add validated optional build state to `urlParams.ts` and the UI URL-sync watcher so screenshots can be reproduced. Invalid/unavailable builds fall back visibly to Muscular. Do not use an arbitrary URL containing “Male” as capability evidence.
8. Refresh cached skinned bounds/bbox diagnostics when weights change, then mark the viewer dirty. Preserve framing for comparisons; offer the existing reframe action if needed. Clear/recompute per-mesh bounds as required by Three's skinned bounding behavior, not only the slot Box3Helper. Verify moving animation bounds/culling separately.
9. Guard asynchronous entry loads against stale completion during rapid changes. Only the current slot load may publish its model/weights/status; discarded scene clones must be cleaned up. The current slot load lacks its own generation token; viewer `previewSeq` only protects accessory/held follow-up work.

The proposed `/assets/characters/body-preview/` location already satisfies `playerVisualPreset.ts::companionAnimationUrl` for body files, returning the original ANIMS_URL; its `/eq/` exclusion also fits. Keep explicit preview animation metadata available in the adapter and test this behavior. Do not move derivatives under `/compare/body-preview/` and expect `compareCompanionAnimationUrl` to work: it accepts only v2/v3.

### Ownership / invariants

- `src/characters/assembleCharacter.ts`, `CharacterAppearance`, `npcAppearance.ts`, `NpcAgent.ts`, player assembly and all original production GLBs stay unchanged. Runtime calls assembleCharacter; NpcAgent's child approximation scales a wrapper. Neither is an integration seam for this plan.
- `loadGltf.ts` caches URLs and returns SkeletonUtils clones. Geometry/materials carry `sharedGpu`; influences must be per mesh instance. Do not mutate cached geometry/material state or another slot's influences.
- Slot unload already calls `disposeOutfitMaterialClones` and `disposeObject3D`; the latter respects shared geometry/material flags and disposes clone skeletons. Any new tool-owned geometry/skeleton/material must enter this ownership path. No per-switch typed arrays, vertex warping or scene traversal in the frame loop.
- Browser UBC tint/hair handling and render-mode lighting already exist. Preserve authored materials rather than “fixing” darkness within the body experiment.
- `mountAccessoryPreview.ts::applyAccessoryPreview` can mount another cloned mesh *after* slot assembly. For Heavy/Slim, either feed compatible derivative equipment through the existing tool path and reapply weights after mount, or show unsupported status. Do not leave an overlaid old pauldron at baseline while claiming armor support. Do not alter gameplay accessory binding.

## 5. Variant decisions and bounded sequence

| Variant | Starting point and implementation gate |
|---|---|
| Muscular | Unmodified base positions, owned body weights zero. Default/reference; must pass identity comparison. |
| Heavy | Reuse existing Fat where present. Generate missing compatible targets from untouched shipped GLBs with V1 warp. Check actual overweight belly/fat distribution, especially female profile; do not equate “target exists” with accepted Heavy. |
| Slim | New bounded rest-space warp, with shared settings across each body's garments. Not negative Fat, head Lean or uniform XYZ scale. Preserve joint locations, hands/feet/neck attachment zones; inspect limb thickness and clothing in animation. No existing Slim body target was found in inspected assets. |
| Normal | Optional separate target reducing conspicuous musculature. Spatial narrowing may not remove modeled muscle definition or painted shading; assess actual geometry first. If unconvincing, keep unavailable and record why. |
| Child | Exploratory and unavailable by default. No dedicated child asset/rig was identified in the current kit; runtime uses scaled adults. A spatial morph alone cannot reposition joint centers or guarantee child proportions and animation contacts. Do not ship “small adult” or start a new child rig project here. |

Implementation order: complete the five-file/dequantization audit → original versus zero-weight preview identity → Heavy on Male/Female Peasant + WorkSkirt → morph-preserving attachment tests → single selector and in-place switching → Slim → authored professions and equipment matrix → bounded Normal/Child feasibility outcome → screenshots and costs.

No preemptive author decision is needed for these engineering choices. Author judgment is needed for silhouette credibility, any proposed visible quality compromise, and a Child that would need new modeling/rigging. Failed variants remain explicitly experimental/blocked; no runtime rollout follows from a successful browser preview.

## 6. Verification handoff

### Focused automated checks

- Add generator tests for decoded rest coordinates (including quantized and identity inputs), invalid/nonuniform transforms, shared-mesh users, target ordering/name preservation, zero padding, no silent quantization overflow, finite deltas, idempotent output and preservation of base geometry/skins/materials. Compare actual decoded original and output accessors, not just file size or target names.
- Add a synthetic multi-primitive garment test to `mountCompareGarments.test.ts` that has **two named targets with nonzero source weights**. Confirm attributes/relative semantics, dictionary names, independent influences and skeleton rebinding after attachment. Existing tests only cover empty-geometry binding and PeasantSkirt; they do not prove morph preservation.
- Extend slot/browser tests for supported/unsupported builds, reapply after attachment/reload, retained animation/selection, no cross-slot/cache mutation, stale load rejection and bounded cleanup. Extend `state.default.test.ts`/`urlParams.test.ts` for the baseline and round trip. Test against WorkSkirt names, not only legacy PeasantSkirt.
- Run focused Vitest files, `pnpm type-check`, `pnpm build` and lint for changed files. Existing `src/characters/characterFiles.test.ts` and `characterAssets.onDisk.test.ts` remain useful production-URL guards. Inspect the final diff to ensure no game consumers or original GLBs changed.
- `pnpm assets:list-character-animations` currently scans `public/models/characters`, **not** the current `public/assets/characters/anims.glb`. Obtain exact clip names/tracks from that GLB via NodeIO/JSON; do not rely on its generated historical report.

### Animation / visual matrix

Use `/asset-browser.html`, real current-kit preview entries, fixed cameras, lighting and resolution. Test both sexes for Peasant/Peasant_Boots, Herbalist/Wizard + female WorkSkirt dyes; add Male Farmer, Woodcutter and Blacksmith with their authored hat/suspenders/apron/materials, and representative Ranger/Knight/Cloth/Helm bodies. Female Farmer/Woodcutter do not exist; do not report them as tested.

Test compatible modular plate/leather/chain/padded pieces and pauldrons where shipped/attached. Cover Rest, exact available Idle/Walk/Run/Sit clips and actual bending/kneeling clips if present. Record unavailable clips by name/category; the viewer falls back to idle/first clip, so check the applied clip rather than assuming a requested name succeeded. Current `setClip` plays clips and `update` advances the mixer even though some UI text still says “@t=0”.

Inspect front/side/back and animated shoulder/arm/belly/hip/thigh/neck seams, skirt/apron clearance, feet/hands, hat/hair/helmet alignment and transitions. In particular check Heavy sitting/kneeling belly penetration and Slim garment gaps. Check rest identity and silhouette before changing lighting.

`createSnapshot.ts::captureSnapshot` already exports a PNG of the canvas plus report text; UI currently downloads `alignment-snapshot.png`. Add the build, sex/outfit, attachment list, actual clip and sampled time to report labels and use meaningful filenames. Capture matched Muscular/Heavy/Slim front and side images for both sexes, female skirt and each authored profession; add Normal/Child only if real candidates exist. Use a deterministic sampled animation time for still comparisons (test/manual sampling hook is sufficient; no timeline editor). Inspect the exported images and record defects/uncertainty; an author-owned visual pass remains pending until the author reviews it.

### Cost / isolation evidence

Record per original/derivative file: compressed bytes, unique vertex/index/accessor bytes, target count/semantics, mesh/material count and triangle count. For context the audited Male_Peasant has 5852 primitive vertex entries / 8576 triangles; Female_Peasant has 5206 / 5915. Sum of accessor counts can duplicate shared storage, so report unique-accessor bytes separately.

One dense POSITION target costs 12 bytes per vertex as decoded Float32, or 6 as normalized Int16 source storage; NORMAL doubles those source figures. Male_Peasant POSITION+NORMAL Float32 would be about 140448 bytes per target before compression/sharing. These are array estimates, not complete GPU memory measurements. Three may expand/repack morph streams into GPU textures and adds skinning/material overhead.

Morphs do not inherently add meshes, triangles or draw calls, but they add decode/upload/morph-texture memory, vertex work and potential shader variants even at zero influence. Derivative GLBs also duplicate base asset/texture payloads on disk and may occupy a second URL cache entry; avoid copying unchanged heads/hair/anims. The donor's eq “2 MB” comment is a historical constraint, not permission to sacrifice normals or a newly measured budget.

Measure the same **single** preview character, renderer/backend, resolution, lighting, camera and animation: original GLB → derivative zero weights → Heavy/Slim. Separate first load/shader warm-up from steady-state frame times; collect renderer.info render calls/triangles, geometries/textures/program counts, load/decode time and switch latency. For quad views report the repeated view renders; do not compare them to single view. Inspect memory/resource counters after repeated switches and unloads (cache retention is expected; unbounded new URLs/instances are not). Report observed costs without claiming game FPS gains or running a world benchmark.

Rollback is removal of browser-only wiring, generator/preview outputs and their tests. Original URL mappings, source GLBs/raws/.blend, saves and NPC/player behavior remain untouched.
