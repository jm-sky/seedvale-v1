# Settlement Track B — next optimization selection

**Date:** 2026-10-28  
**Status:** research / recommendation only; implementation not authorized  
**Source pin:** `11c2a3b100a85eee6e46f281fe6ddd8c1e9d3197`; publication recheck `d867f38729adb49039de539843bd6e6fc3d5217c`  
**Measured runtime:** `36e99ef6c31000b683619916b4d19a210408760e`, native Windows Arc, High, fixture `tools-001-v1`

## 1. Executive summary

**Select one immutable exterior-lantern template merge, under settlements-019 Stage 3.** Keep each lamp/controller in its existing house; combine the seven grey-material primitives into one, retaining the brown and light-coloured primitives separately. This makes **9 → 3 primitives per lamp without removing geometry, changing materials or batching different houses together**.

This is more concrete and smaller than the previous audit's controller/body-instancing proposal. Current GLB lamps do **not** animate their body material: `createHouseLight.setNightIntensity` changes two PointLights; only the procedural fallback changes a material colour. There is no need for per-instance emissive attributes in this slice.

Ranked alternatives: (2) instance the residual procedural interior chests, excluding already-instanced yard crates; (3) optimize one compatible food-representative family within existing storage ownership. Lamps win on directly attributed submissions, verified asset compatibility, no inventory synchronization, and preservation of per-lamp spatial granularity.

**Evidence labels:** measured = existing reports; verified = source/GLB inspection; hypothesis = proposed performance effect. No new benchmark, browser capture, runtime edit, test or asset edit was performed.

## 2. Current measured settlement rendering costs

The [post-fix summary](../../performance/results/2026-10-28--win-forest-bisect-and-fixes.md) reports 32.0 / 32.5 / 33.4 FPS (mean 32.6), frame p95 36.4 / 36.6 / 34.9 ms, 2258 / 2180 / 2222 combined calls, and 53 loaded NPCs in each run. Forest averages 56.0 FPS with 20 NPCs. These are diagnostic evidence, **not a certified baseline**. The older [A1′ series](../../performance/results/2026-10-28--win-a1p-settlement-heavy-forest-series.md) is pre-fix evidence; do not mix its timings with these rows or reopen the resolved actor-box/shoreline investigations.

Actual pass reports in `results/win/2026-10-28--win-fix1-settlement-heavy-rep{1,2,3}.{md,json}` agree on the leading settlement families:

| Family | Main calls | Shadow calls | Mirror calls | Main triangles, rep1 |
| --- | ---: | ---: | ---: | ---: |
| Exterior house lamps | 90 | 0 | 45 | 6,240 |
| Storage goods | 85 | 0 | 40 | 15,184 |
| House statics | 66 | 33 | 33 | 161,004 |
| Storage containers (mixed family) | 58 | 20 | 28 | 4,884 |
| Workplaces (mixed family) | 37 | 9 | 11 | 15,494 |
| Campfires | 36 | 12 | 9 | 455 |
| House interactive parts | 30 | 16 | 15 | 3,300 |
| Gardens | 12 | 1 | 5 | 210,456 |
| Fences | 4 | 4 | 2 | 18,584 |
| Decor | 2 | 0 | 1 | 1,673 |

Zeros mean no reported submissions for that family/pass, not absence of resident objects. Counts are rounded pass averages, not unique object counts. Mirror averages use the collector's observed-pass denominator, not a general promise of one reflection render per gameplay frame.

Rep1 JSON sums give **524 settlement main calls, 137 shadow calls and 231 mirror calls**. Total passes are main 1509 / 1433 / 1471, shadow 405 / 404 / 407, mirror 344 / 344 / 344. All three report `reliability: observed`, zero residual calls and no skipped shadow-refresh frames. Rep1 has 924 samples for each pass, versus 917 measured benchmark frames: collector and timing windows are not exactly identical.

Settlement is therefore only part of the workload. Rep1 main also includes NPCs about 203 calls, fauna about 109, items 204, environment 169, vegetation 84, grass 33, terrain 28, water 14 and other 141 (rounded rows). `items` is classified from `chunk-items` / resource-deposit roots, not automatically settlement storage or held equipment. Terrain contributes 2.06M main triangles and 1.40M shadow triangles; water contributes 0.97M main triangles. Do not assign these costs to houses.

The scene census lists **1459 settlement meshes/estimated one-pass draws**, substantially more than 524 actual main submissions. It measures resident visible-chain content, not submitted camera workload; it cannot rank this work alone.

**Timing limitations.** The systems `RENDER` values 20.2 / 19.8 / 19.8 ms are wall-clock spans, potentially including driver/GPU wait. The separate isolation-baseline GPU timers resolve at 19.3 / 19.4 / 18.4 ms (34/35/35 samples), for the broader postprocess/labels span. Neither supplies per-family GPU time. Rep1 hide-settlement changes wall render 19.3 → 15.6 ms; this removes all settlement content and is not recoverable batching savings. The historical `trace-settlement-heavy-98ddfbd1.md` samples renderer traversal/submission functions, but lacks per-sample time deltas and predates the fixes: it establishes neither current family CPU milliseconds nor a lamp GPU bottleneck. Rep1's two >80 ms frames have large FAUNA spans; lamp merging is not a demonstrated cure for those tails.

**Freshness:** `36e99ef6..11c2a3b1` changes documentation/results and one benchmark-series script line, not `src/` or runtime assets. During investigation `d867f387` added an inert tree-LOD asset package and two explicit asset-tool commands; no runtime source changed. Its README states nothing loads it, and normal build/dev commands are unchanged. No material runtime attribution change was found. Preserve these incoming files; future CA1/runtime commits require a fresh targeted diff, not an assumption of comparability.

## 3. Existing mechanisms and completed work

- `props.ts::buildSettlementProps` already uses `buildInstancedProps` for wells, crop beds, fences, yard crates, barrels, troughs, hay, bushes and cobbles. `houseBuilder.ts::createHouseStaticBatch` already combines house statics by geometry/material identity; doors stay separate. Recommending “instance houses/crates/fences” generally would duplicate existing work.
- `instancedProps.ts` keeps one bucket per species/primitive. Geometry sharing saves memory but does not combine different primitives into one submission. Its flattening ignores hidden-alternative semantics; it is not an arbitrary controller-tree batcher.
- `4347c274` is present: `woodPileTiers.ts::loadWoodPileTierTemplates/createInstancedWoodPileVisuals/createWoodPileTierPool` bake shared V2-derived tier geometry and create settlement-owned, change-driven pools. Quantity mapping, household separation and overflow remain V1-owned. The [current wood notes](../../plans/settlements-npcs-025-resource-storage-visualization--implementation-notes.md) distinguish static secondary/woodshed piles from the optimized live piles. Latest rows show only 2 main household + 2 primary + 4 secondary calls. **Do not repeat the wood optimization.**
- `storageVisuals.ts::createFoodStorageVisual` already pools representatives and skips unchanged allocations. Eight is the visible representative cap per location, not a lifetime retained-object cap or necessarily eight draw calls; a representative may contain multiple meshes.
- Existing shadow exclusions already cover exterior lamps and food. PointLight budgeting, mirror cadence/layers and settlement lifecycle stay intact.

## 4. Candidate shortlist with evidence

### 1 — Exterior lantern: merge one immutable template

**Verified asset:** `public/models/settlement/lantern.glb`, blob `fe3a9c0234c478b0f5a6be84b7242c738624d285`, inspected through base64 GLB JSON: seven mesh nodes, **nine indexed triangle primitives**, 624 triangles, POSITION/NORMAL/TEXCOORD_0, three opaque single-sided materials, no skins/animations/morph targets. Brown = one primitive/108 triangles; Grey = seven/484; Light = one/32. All three retain their original PBR values. Loader nature/wind material selectors do not target these lantern materials.

**Owners:** `props.ts::buildSettlementProps` prepares wall/floor templates using `preparePropFitMax`; `houseLighting.ts::attachLanternGlb/createHouseLight` clones them below a mount pivot. The house applies child-level inverse-scale compensation. `createSettlementNightCycle.apply` drives existing controllers; `createSettlement` registers/unregisters the light subtree.

**Cost:** directly measured 90 main + 45 mirror calls for only 6,240 main triangles. This is a submission/traversal candidate, not proven triangle/shader dominance. Exact distinct visible lamp count is not exported; do not equate calls/9 with unique houses.

**Technique:** merge only compatible same-material primitives inside the immutable GLB body, before the two existing fit operations. Keep one ordinary clone per lamp and the existing controller root. Reuse the GLB preparation/shared-resource convention; no new renderer or global placement pool. Template merging preserves per-lamp culling much better than settlement-wide instancing. LOD and cross-house baking are unnecessary.

**Hypothesis:** at unchanged full-lamp pass coverage, 90 → 30 main and 45 → 15 mirror calls; triangle content remains 624 per complete lamp. This is structural draw arithmetic, not a measured outcome, guaranteed frame-total reduction or FPS forecast. Primitive-boundary culling can change slightly. Light shading cost remains.

**Identity/lifecycle:** no inventory, interaction, persistence or stable building ID moves into the merged mesh. Controllers and lights remain attached to their current houses. No simulation/camera coupling. Risks are normalization offsets, transformed normals/UVs, material mismatch, bounds and accidental disposal of shared geometry.

### 2 — Residual interior chests: share one template and instance placements

`props.ts` creates `createPlacedContainerProp()` per furnished house, outside `assembly.staticGroup`. `src/world/containerProp.ts` constructs five opaque meshes: body/lid/two straps/clasp, two materials, no animated lid. Body/lid cast shadows; only body receives shadows. This differs from yard crates, which already use `buildInstancedProps`.

The measured **58 main / 20 shadow / 28 mirror** rows include all storage containers, not chest-only attribution. The 76-mesh shadow census is not the unique visible chest count. A chest-specific removable-call total is **unknown**; do not claim all 58 calls are recoverable.

A later slice can construct one settlement-owned chest template and feed source furniture placements into existing `buildInstancedProps`, preserving the five primitive policies and exact house/furniture scale transforms. Keep household/settlement storage anchors and registries unchanged; `app/interactables.ts` reads `householdStorages` and settlement-storage positions, not these furniture meshes. Do not alter player/world placed-container creation or ownership. Keep procedural template geometry alive until all of its settlement instances are disposed, then release once.

Expected benefit is fewer submissions and allocations, with unchanged triangles. Risk is moderate: coordinate composition, template disposal and coarser house-to-settlement culling; no stock-sync benefit. Merging all wood parts together would incorrectly combine different receiveShadow policies. Prefer placement instancing, not a global container manager.

### 3 — One compatible food-representative family

`storageVisuals.ts::allocateFoodRepresentatives/createFoodStorageVisual`, `items.ts::createItemMesh`, and `createSettlement.update` own allocation, assets and read-only inventory sync. **85 main / 40 mirror / 0 shadow** calls establish material aggregate cost, but reports do not identify kinds, primitive/material compatibility or simultaneous duplicate counts.

A later bounded slice could instance one repeated, compatible kind inside existing food-controller ownership, preserving selected kinds, eight visible slots, zero stock, independent household inventories and current GLB/fallback appearance. Existing wood-tier change-driven slot/bounds handling is a design precedent; do not blindly reuse its one-material, fixed-ground assumptions. Static placement baking is unsuitable for changing allocations; geometry sharing alone does not remove draws. No per-tick full-settlement rebuild.

Risk exceeds lamps: mixed kinds, fallback-created materials, hidden retained pools, slot reassignment, bounds and disposal. Keep authoritative inventories/persistence untouched and all pooled resources under settlement teardown. Before choosing this over chests, the minimal missing fact is a **single existing-scene breakdown of container subtype and food kind/primitive/material**; first check saved program-census data, otherwise request one narrow diagnostic snapshot in a later approved session. No new full benchmark suite is needed to settle that ranking.

**Not shortlisted:** house statics already batch and have only 66 main calls; additional distinct-geometry merging needs a proven compatible material subset. Workplaces mix market props with household smithing and mutable repair-wagon content (37 main), so indiscriminate batching is unsafe. Fences/decor submit few calls despite resident census counts. Gardens are triangle-heavy despite 12 calls, but already instanced; reducing their geometry/appearance is a separate visual choice without family GPU attribution. Fire/torch VFX and interactive doors remain controller-owned. Reflection exclusion is blocked by D8/D13 and is not this recommendation.

## 5. Comparative ROI assessment

Ratings describe relative opportunity and confidence, not predicted FPS.

| Criterion | 1. Lantern template merge | 2. Interior chest instances | 3. Food-family instances |
| --- | --- | --- | --- |
| Expected frame/FPS impact | Modest plausible submission win; GPU benefit unknown | Modest possible win including shadows | Potentially useful; duplicate-kind coverage unknown |
| Evidence | Strong: repeated family counts + inspected compatible GLB | Medium: mixed family counts + five-mesh constructor | Medium for aggregate cost, weak for selected kind |
| Complexity | Small: one asset preparation seam + focused helper/tests | Medium: furniture transforms + template ownership | Medium/high: dynamic slots/materials/fallback |
| Regression risk | Low with transform/material parity | Moderate: culling/transforms/disposal | Moderate/high: stock representation/churn |
| Reversibility | High: original template fallback / one commit | High: restore per-house props | High if old controller path retained |
| Testability | Strong geometry/material/transform oracles | Strong transform/shadow/lifetime tests | Strong state tests; asset mix still needs evidence |
| Dependency risk | Approval/baseline gate; no D8/D13 decision | Same gate + subtype attribution | Same gate + kind attribution and -025 boundary |

Lamps win because their avoidable primitive multiplicity is demonstrated, and the first step does not change spatial batching or dynamic-state ownership. This is the highest-confidence next small ROI experiment, **not proof that lamps consume the most GPU time**.

## 6. Recommended next slice — Sol 6.1 Codex handoff

**Owner:** existing [settlements-019](../../plans/archive/settlements-019-settlement-render-submission-budget.md), Stage 3; current archived status remains `verification needed`. A small owner-plan addendum should name this family, latest diagnostics and acceptance conditions after approval. No new plan ID, status change or automatic Stage-1 visual PASS in this investigation.

**Inspect/modify:**

- `src/settlement/props.ts::buildSettlementProps`: replace only the exterior-lantern template preparation input.
- Proposed narrow `src/settlement/houseLanternTemplate.ts` helper and adjacent test: load/validate/merge this one asset; no generalized asset optimizer.
- Inspect `houseLighting.ts::attachLanternGlb/createHouseLight`, `props.lampMount.test.ts`, `assets/loadGltf.ts::preparePropFitMax/markSharedGpu/disposeObject3D`; keep controller API unchanged.
- Read-only lifecycle reference: `createSettlement.ts`, `SettlementsManager.ts`, `settlementNightCycle.ts`. No planned edits there.

**Smallest implementation:**

1. Run existing owner preflight and recheck main for concurrent changes. At the lantern load seam, prepare an immutable merged template once, using the existing app-lifetime shared-template convention exemplified by `loadWoodPileTierTemplates`.
2. Validate before allocating: ordinary static visible meshes, opaque matching material identity, compatible attributes/indexing, matching render flags/layers, no custom callbacks, skin/morph/variant behaviour. Unsupported input returns the original GLB path.
3. Clone geometry, bake child transforms into the template-root frame, combine only the seven Grey primitives (e.g. Three's BufferGeometryUtils merge utility); retain Brown and Light and all material objects. Do not weld/recompute normals, drop UVs, convert materials or leave seven geometry groups that still generate seven draws.
4. Preserve template root transform and `assetUrl`; compute bounds. Continue existing wall/floor fit, pivot/yaw and inverse-house-scale code unchanged. No lamp resize or longstanding mounting “fix” in this stage.
5. Mark successful immutable generated geometry shared only after successful assembly. Keep a bounded one-asset app-lifetime cache, like existing tier templates; dispose temporary owned clones on failed preparation. Never mutate/dispose loader-owned geometry or materials. Settlement clones use existing group cleanup; unloading one settlement cannot invalidate another.
6. Keep legacy template/fallback selectable at construction for comparison/revert. No two attached body paths, per-frame rebuild, new persistent state or save/worldgen change.

Non-goals: cross-house instancing; torch/interior-table-lamp/campfire changes; food/wood/chests; light budgets; shadows/reflection masks/cadence; shaders; fog/density/visibility; NPC/fauna/grass; benchmark harness or assets.

## 7. Implementation boundaries and verification

**Focused automated checks for the future slice (none added/run here):**

- Real lantern fixture/header plus loaded-template tests: 9 → 3 render primitives, unchanged 624 triangles, original three material identities/properties, attribute values and transformed geometry/bounds.
- Wall and floor mount parity, explicit yaw, nonidentity root/child transforms and scaled/rotated houses: compare resulting world geometry, not only root positions.
- Day/night controller and two PointLight properties unchanged; exterior castShadow stays false; receiveShadow, layers and diagnostic family preserved. Procedural fallback retains its colour transition.
- Unsupported geometry/material/hidden/dynamic input falls back without mutation or leaked temporary geometry.
- Two settlement clones: dispose one, other remains valid; stream/rebuild clone recreation, rejected construction, shared-resource lifetime. Reuse existing lifecycle tests instead of redesigning the manager.
- Relevant Vitest tests, touched-file lint, type-check and build. Report actual results separately from visual acceptance.

**Manual:** near/far and edge-of-frustum views of both lamp styles, rotated/scaled houses, day/dusk/night/rain, camera turns and water reflection; confirm no offset, shading, light or silhouette change. Check house entry/doors and storage interaction still work; stream out/in and world rebuild/new-save reload. Do not declare visual correctness from tests.

**Later targeted measurement:** existing settlement-heavy fixture on matched hardware/config/camera/weather/population, old versus new template; main/shadow/mirror lamp calls and triangles, total calls, render p50/p95, frame p95/p99, GPU timer with its actual span/status, and stream-in/build/upload or first-use hitch evidence. Keep 53 loaded NPCs and comparable stock/other content; do not sum isolation deltas or A/B/C gains. No automatic forest/water/full-suite rerun.

**Stop/revert:** any visual/light/interaction/lifecycle difference; unexpected material/group incompatibility; no meaningful measured lamp-call reduction; additional geometry uploads/retention or build hitches; reproducible frame/GPU regression outweighing submission savings. If FPS gain is within noise, report it as unproven and decide retention from measured workload reduction, maintenance cost and author acceptance—not a fabricated percentage.

## 8. Risks and unresolved questions

- Baseline certification and settlements-019 Stage-1 browser verification remain unclosed in owning records. These diagnostic runs are sufficient to select a candidate, not silently pass those gates.
- **Author authorization is required before runtime implementation.** Approve this bounded slice and explicitly reconcile use of the qualified baseline with the owning performance gate (or satisfy the remaining relevant gate). No new reflection-quality decision is needed: D8/D13 remain open and unchanged.
- No per-family GPU timing or current lamp-specific CPU profile exists. Lower submissions need not produce proportional FPS improvement; this small slice alone is not a credible 32.6 → 50–60 FPS promise.
- Exact chest-only and food-kind costs remain unobserved. Their order is provisional; the lamp choice does not depend on resolving them.
- The memoized merged template is intentionally app-lived, not leaked per settlement. Do not mark arbitrary per-build geometry shared and leave it unowned.
- Historical notes describe pre-implementation states (food pooling and settlements-023 review in particular). Current source takes precedence.

## 9. Dependencies on ongoing A/C work

A1′ and its regression fixes are already in the measured runtime; no actor optimization or renewed bisect here. CA1 can proceed independently: this slice touches lantern preparation, not grass/terrain/vegetation or shared perf files. Serialize any unexpected overlap in `props.ts`; no edits to `createSettlement.ts`, `sceneCensus.ts`, pass collection, shadow scheduling or benchmark results are necessary. At later measurement, compare against a matching CA1 state or isolate the lamp toggle on one combined build; do not attribute a combined FPS delta solely to B.

## 10. Sources

Current paths/symbols above are pinned to the source revision; asset bytes were read from that pin. Key evidence:

- [CLAUDE](../../../CLAUDE.md), [CODE_INDEX](../../CODE_INDEX.md), [STATE](../../STATE.md), [plans index](../../plans/README.md).
- [Strategic Brief](./STRATEGIC-BRIEF.md), [master roadmap](./2026-10-27--master-revival-roadmap.md), [three-track roadmap](./2026-10-27--performance-three-track-roadmap.md).
- [Transfer recon §11](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#11-track-b-deep-recon--settlement-rendering-and-static-structures-2026-10-27), [settlement delta audit](./2026-10-27--revival-audit--settlement-rendering.md).
- [Performance owner](../../performance/README.md); latest [rep1](../../performance/results/win/2026-10-28--win-fix1-settlement-heavy-rep1.md) / [JSON](../../performance/results/win/2026-10-28--win-fix1-settlement-heavy-rep1.json), [rep2](../../performance/results/win/2026-10-28--win-fix1-settlement-heavy-rep2.md), [rep3](../../performance/results/win/2026-10-28--win-fix1-settlement-heavy-rep3.md); [older trace](../../performance/trace-results/trace-settlement-heavy-98ddfbd1.md).
- [settlements-019 implementation notes](../../plans/implementation-notes/settlements-019-settlement-render-submission-budget-implementation-notes.md), [storage plan](../../plans/settlements-npcs-025-resource-storage-visualization.md), [wood implementation notes](../../plans/settlements-npcs-025-resource-storage-visualization--implementation-notes.md).
- [settlements-023 notes](../../plans/implementation-notes/settlements-023-settlement-streaming-lifecycle-and-construction-rollback-implementation-notes.md), [historical plan review 028](../../reviews/2026-10-28--028--settlements-023-streaming-lifecycle-plan-review.md); current `createSettlement::owned.release` and `SettlementsManager::ensureLoaded/unload` are the lifecycle authority.
- [passSubmissionCollector](../../../src/perf/passSubmissionCollector.ts): `createPassSubmissionCollector/recordDraw/closePass/finalizeAgg`; [sceneCensus](../../../src/perf/sceneCensus.ts): `classifyObject/classifySettlementContent`; [report](../../../src/perf/report.ts).
- [props](../../../src/settlement/props.ts), [houseLighting](../../../src/settlement/houseLighting.ts), [lantern asset](../../../public/models/settlement/lantern.glb), [propSpecs](../../../src/settlement/propSpecs.ts), [loadGltf](../../../src/assets/loadGltf.ts).
- [houseBuilder](../../../src/settlement/houseBuilder.ts), [instancedProps](../../../src/render/instancedProps.ts), [containerProp](../../../src/world/containerProp.ts), [storageVisuals](../../../src/settlement/storageVisuals.ts), [woodPileTiers](../../../src/settlement/woodPileTiers.ts), [items](../../../src/items/items.ts), [interactables](../../../src/app/interactables.ts).
