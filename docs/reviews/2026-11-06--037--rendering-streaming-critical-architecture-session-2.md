# SeedVale V1 Revival — Rendering Streaming Critical Architecture Review (Session 2)

**Reviewer:** OpenAI Codex (GPT), independent graphics/architecture review. **Date:** 2026-11-06.

**Reviewed HEAD:** `3c249cb62ddde343be2b654fae43315a484f8054`, local `main`; clean tree at entry. Review/documentation only; no runtime changes, browser, benchmark or heavy tests.

**Verdict:** the architecture can keep detailed rendering local within a 12 × 12 km continent; it does not allocate detailed meshes for the entire continent. It does **not yet establish predictable traversal latency or bounded publication/upload work**. Existing worker generation, chunk hysteresis, shared materials, grass caps and regional instancing are useful foundations. The main weaknesses are work arriving outside the finalization limit and regional reconstruction amplifying individual chunk lifecycle events. No evidence justifies reducing simulation, vegetation richness or abandoning Three.js/WebGL2. System 16 remains **partial**, without performance or visual acceptance.

## Continuity and evidence

Read [Session 1 and its handoff](./2026-11-06--036--rendering-gpu-critical-architecture-session-1.md), the system matrix, CLAUDE.md, Strategic Brief decisions, architecture lifecycle/rendering guidance and performance/worker guidance. Historical evidence includes research 019, plan 143 implementation notes and review 025 (loading-window prewarm). Those older measurements are not current performance results.

HEAD is the supplied Session 1 documentation commit. The diff from Session 1's source `ac9717721e3eb68feadf45b5c476e5de18924735` includes climate-driven biome selection in tile/mesh/grass/far-tile generation and tree environment sampling, sight-blocker registration in chunk/WorldBundle lifecycle, actor sight presentation and an added reflection-layer constant. Relevant changed paths were inspected; batching, grass assembly, prewarm and far-ring owners themselves are unchanged. These workload changes prevent treating old forest/stream measurements as today's baseline. There are no changes since the supplied documentation commit.

R1–R11 remain existing evidence, not newly GPU-verified conclusions. This session extends R8's program-family boundary and R6's attribution concern; it does not repeat the composer/shadow/mirror audit. Changed actor concealment is outside this vegetation review. Actor LOD, skeletons, full settlement construction and continent-wide simulation scheduling remain open.

“Confirmed mechanism” below means source-demonstrated control/data flow. Performance significance remains a hypothesis until measured. No GPU memory leak or measured FPS improvement is asserted.

## End-to-end execution and ownership

| Boundary | Actual owner and execution | Cost / validity boundary |
| --- | --- | --- |
| Selection | `chunkManager.ts:2997` `recheck`: square Chebyshev load window plus pinned home chunks; movement recheck every quarter chunk | Default size 64 m, load radius 3, unload radius 4. Desired ordinary window is 49 chunks; hysteresis can retain more, plus distant pins. Selection is player-local, not camera-local. |
| Starts | `drainLoadQueue` starts two missing chunks per update, nearest first; recheck replaces queued demand | Count limit includes neither synchronous per-start preparation cost nor retirement work. `waitForChunks` directly starts its requested set. |
| Preparation | `ensureLoaded`, `retainRiverTilesFor`, `paramsFor` run on main thread before storage/worker await | River tile acquisition, road/settlement context, modifications and parameter construction are not all moved to workers. Time `terrainPrepare`/river stages before attributing a hitch to GL. |
| Canonical tile | `acquireCanonicalTile` reads persistent cache, requests worker on miss, persists fresh output | Identity checks after storage and worker prevent stale tile publication; runtime receives a clone so deformation does not mutate canonical cache data. |
| Workers | Singleton `chunkWorkerPool`: hydrology rows → tiles → meshes → knowledge → far → map → grass | Finite workers, background headroom, FIFO within each class. Main-to-worker grids are structured cloned; tile/mesh/grass typed-array results are transferred. This is not zero-copy in both directions. |
| Mesh finalization | One mesh **or** content stage starts per gameplay update; mesh stage awaits worker/cache | `buildAndAttachMesh` publishes in its continuation; water extraction/creation, rivers and grass request follow. Multiple previously started stages may finish in one frame. |
| Content | `attachChunkContent` is synchronous, template readiness checked before selection | Resolves tree lifecycle, builds placement arrays, regional instances, items/crops/environment, bridges and colliders. One selected content stage can still exceed a frame budget. |
| First draw | Three renderer culls and updates object buffers, selects/links programs and binds textures | Scene attachment is not GPU upload completion. First main/shadow/mirror visibility may move cost to a later frame. |
| Retirement | `unload` cancels jobs, removes geometry/water/river/grass, unregisters presence/colliders/sight, removes region contributions | Synchronous across every evicted record during recheck. Region contributions can trigger reconstruction of surviving neighbors. |
| World replacement | `rebuildWorldBundle` snapshots authoritative state, disposes old projections, builds fresh, checks staleness before publication | Failed rebuild leaves old disposed fields gated; stale fresh bundle is disposed. Render stack survives. ChunkManager disposal clears its mesh cache; templates remain application/module cached. |

Worker tile generation includes vegetation placement, items, environment and crops; mesh jobs compute terrain Y/normal/color/bare-ground data; grass jobs compute matrices/colors/phases/wind factors/bounds. Three.js objects remain on the main thread. A cached tile still needs runtime cloning, mesh construction and presentation; a mesh-data cache hit avoids computation, not fresh geometry allocation/upload.

## Findings

| ID | Priority / classification | Finding |
| --- | --- | --- |
| S2-1 | High · confirmed budget gap; impact unmeasured | Finalization limits starts, not publication or first upload; grass bypasses that queue |
| S2-2 | High · confirmed amplification; impact unmeasured | Regional instancing reconstructs surviving content on each membership change, including teardown |
| S2-3 | Medium · confirmed cancellation/accounting gap | Canceled worker computations continue and cease counting toward background headroom |
| S2-4 | Medium · confirmed asynchronous state race | Initial grass callback guards by key rather than request/record identity |
| S2-5 | Medium · confirmed batching trade-off | Regional LOD and culling submit more than the individually visible/near content |
| S2-6 | Medium · conditional first-use gap | Existing prewarm omits object-side variant bits and cannot warm uploads |
| S2-7 | Medium · optional-path performance risk | Far ring trades low submission count for uncullable geometry and repeated merged-buffer updates |

### S2-1 — Publication and uploads escape the frame limit

**Evidence:** `chunkManager.ts:2008–2040, 2148–2290, 1716–1783`; `grass.ts:619–710`; installed Three `WebGLRenderer` object projection and `WebGLAttributes` upload paths.

`drainFinalizeQueue(1)` does not await `runFinalize`. Mesh construction after `await requestChunkMeshData` and water/river creation after that execute outside the selected update's synchronous timing. Worker completions from several started stages can land before one render. The 8 ms idle drain also measures start time rather than future continuation cost; its do/while intentionally permits one stage to exceed 8 ms. Grass initial/filler/main results build or attach buffers in callbacks without the terrain/content finalization queue. LOD changes can lazily create a grass geometry tier.

The regular terrain path still allocates `PlaneGeometry`, rotates it, loops over Y and installs worker attributes on the main thread. Worker migration removed expensive terrain math, not all geometry assembly. Water core-grid extraction and river construction remain additional work. GPU buffers/textures are uploaded lazily on rendering; a scene-add timer cannot measure that work. Frustum rejection can defer first upload until a camera turn, making an apparently quiet frame expensive.

**Recommendation:** extend the existing publication/finalization boundary to ready mesh/grass results, with identity validation at consumption and observed CPU time plus pending byte/count accounting. Keep rendering uploads separately observable. Do not claim a strict GPU-time bound from a CPU deadline. Do not add per-chunk `compileAsync` or a second global scheduler. Measure first whether continuation work, upload, compile or synchronous preparation dominates.

**Verification:** burst worker completions, cold/warm cache, rapid turn after offscreen stream-in, teleport and repeated cutout/remesh. Correlate start, completion, publication, bytes and first actual render, including frames whose finalize-start count is one or zero.

### S2-2 — Region membership changes rebuild neighboring instance buffers

**Evidence:** `vegetationRegionBatcher.ts` `rebuild`, `setChunkPlacements`, `clearChunkPlacements`; `instancedProps.ts:140–260`; `chunkManager.ts` `attachChunkContent`, `unload`, `dispose`.

For every affected region/kind, rebuild disposes the old InstancedMeshes, concatenates all surviving chunk placements, allocates exactly sized new instance matrices, populates matrices and computes bounds for each species/primitive. Shared GLB geometry/materials survive correctly. The new instanceMatrix buffers must upload again on the next draw even for unchanged neighboring trees. Each content stage can rebuild several kinds. Multiple chunk evictions in one recheck rebuild the same region repeatedly. Whole-manager disposal calls unload on each record **before** batcher.dispose, constructing survivor groups that are subsequently reconstructed/disposed again during the same teardown.

For nine equal contributions arriving individually, cumulative instance construction is proportional to `1+2+...+9=45` chunk contributions for a final nine-contribution region; this is analytical work amplification, not a measured stall. Retirement creates a similar repeated survivor cost. Bounds scans multiply by primitive count. A single chop uses swap-remove rather than full reconstruction, which is a useful existing exception.

**Recommendation:** preserve chunk-owned contributions and stable resource keys; coalesce dirty region/kind rebuilds at an existing publication boundary, and provide a bulk retirement path that does not reconstruct doomed projections. Only consider capacity/reuse or finer groups after measuring; they add bookkeeping and retained capacity. Geometry/material merging is not required to address this instance-buffer churn.

**Verification:** region edge crossings, diagonal traversal, nine arrivals, mass eviction, rebuild and chop followed by sibling arrival. Count builds, disposed/created instance buffers and matrices uploaded, with memory settling after repeat routes.

### S2-3 — Canceling ownership is not canceling execution

**Evidence:** `chunkWorkerPool.ts:230–266` and `cancelByNamespacedKey`; worker `ctx.onmessage`.

Queued cancellation removes a job. In-flight cancellation deletes it from `inflight` and rejects its promise, but sends no interrupt and does not terminate its worker. The worker remains unavailable until its synchronous computation and response transfer finish. The late result is ignored; it cannot resolve the canceled job. New demand waits for occupied physical workers even when logical `busyCount` falls.

Background headroom counts `inflight` entries, so canceled-but-running background jobs no longer count. A different free worker can accept another background job; the advertised spare foreground capacity is therefore not guaranteed during cancellation. With one worker there is inherently no spare capacity. Fixed class priority can delay grass/far work under sustained tile/mesh demand. These mechanisms are bounded by physical worker count; they are not evidence of unbounded threads or stale terrain attachment.

**Recommendation:** distinguish canceled ownership from physical occupancy in the existing pool accounting. Preserve foreground headroom until completion. Consider cooperative cancellation or worker replacement only for measured long jobs, including initialization/hydrology reinstall costs. Reordering priorities alone cannot interrupt a running synchronous job.

**Verification:** cancel running background jobs while submitting foreground work; assert physical occupancy/headroom and latency, not only rejected promises. Test rapid reversals with a cold tile cache.

### S2-4 — Initial grass completion can mutate a replacement record's pending state

**Evidence:** `ensureGrass` `.then/.catch` at `chunkManager.ts:1733–1782`; contrast filler/main request sequence guards at `1812` onward; `removeGrass:1785`.

The initial request captures `record` but reads `chunks.get(key)` in both handlers and checks only existence. Sequence: old initial request is pending; unload cancels it (promise rejection queued); a same-key replacement is installed and starts grass before that rejection handler executes; old catch clears **replacement** `grassPending`. A later sync can then issue redundant work and supersede the replacement request. A fulfilled promise whose handler is pending across removal/replacement likewise lacks an identity check. This is a source-level permitted interleaving, not an observed player reproduction; ordinary cross-frame movement may not hit the necessary microtask timing. Cancellation prevents a still-running canceled worker from resolving the old promise, narrowing the trigger.

**Recommendation:** use the existing captured record identity and request-sequence convention for initial grass too, in success and failure handlers. Avoid creating new cancellation infrastructure. Verify same-turn removal/reload and ensure at most one owned grass projection; filler/main guards are already stronger.

### S2-5 — Region granularity couples LOD, culling and submission

**Evidence:** `vegetationRegionBatcher.ts` `REGION_CHUNKS=3`, `maxFraction`, `rebuild`; `instancedProps.ts` `applyCount`, bounds and removal.

A default region spans 192 × 192 m. The maximum member LOD fraction applies to the entire region/kind, so one near chunk retains detail for farther members. Each species/primitive has a union sphere covering full initial placement capacity; changing `count` does not tighten it. An intersecting sphere submits that bucket's entire selected prefix, including offscreen instances. Removal leaves conservative old bounds, which is safe but progressively less selective. No per-instance frustum or occlusion selection exists here. Every resident scene object still participates in scene traversal even when draws are culled.

Placements are concatenated by chunk contribution, then LOD keeps a prefix per species. Seeded randomness **inside each chunk** does not make this concatenated region prefix an unbiased sample of the region: equally populated chunks A then B at fraction 0.5 can retain A and omit B. This can create spatially uneven forest thinning tied to residency/insertion order. Identity is unaffected; it is a presentation issue requiring images. Enlarging regions could worsen this despite reducing draws.

**Recommendation:** retain the draw reduction, but evaluate per-contribution quotas/interleaving within existing region ownership and compare region sizes only with matched draw/triangle/visual evidence. Do not lower density or treat persistent tree presence as visibility. Do not infer GPU savings from draw count alone.

Grass is finer: one mesh per species/chunk, prefix count and near/mid/far geometry tiers; filler residency and optional main storage cap avoid allocating all candidates at distance. Bounds use actual instance elevation and conservative geometry/wind padding from `grassBounds.ts`. This is stronger than flat Y=0 bounds. GPU cost still scales with submitted blades and overdraw, rather than with draw calls alone.

### S2-6 — Prewarm is valuable but not complete first-use coverage

**Evidence:** `programPrewarm.ts` `objectProgramFlags`, `cloneForStaging`, template staging and `prewarmRenderPrograms`; `createApp.ts:923,3031,3901`; `chunkManager.programPrewarmTemplates`; installed Three `WebGLPrograms` and renderer compilation/upload paths.

Current startup and successful rebuild prewarm use live scene plus default-enabled loaded chunk templates as instanced representatives. Terrain shares one Standard material; grass shares a material; per-chunk uniforms/instance counts/geometry tiers do not inherently create programs. A 1×1 target correctly matches ordinary composer/mirror target output mode. Template inclusion already addresses species absent from the home scene; proposing another prewarm service is unjustified.

However, deduplication is by material UUID plus a limited flag string. Instanced staging creates a fresh mesh without `instanceColor` (and without instanced morph texture); Three keys `instancingColor` separately. Thus colored-instance runtime objects cannot be represented correctly by this clone path. Geometry color item size, morph detail and other object bits are also not fully encoded by the coarse claim key. The reviewed region vegetation path does **not** assign instanceColor, so this is a conditional extension of R8, not proof of a forest-traversal compiler stall. New materials loaded after snapshot, changed light/shadow configuration or light overflow can still introduce programs. Shared material identity is not a universal variant identity.

Compilation does not draw: no geometry/instance buffer upload or ordinary material texture residency is established by prewarm success. Shadow-depth and postprocessing programs are separate first-use boundaries. A timeout rejects the wrapper but does not cancel Three's compilation promise; the 15 s cap limits waiting, not all driver work. Many distinct material UUIDs can cause staging overhead even when Three ultimately shares a program; program count and staging material count should not be conflated.

**Recommendation:** retain existing mechanism; add representatives only for demonstrated missing runtime keys. Record exact new program key/owner and compile/link events separately from buffer/texture upload. A frame with `programDelta=0` can still stall on uploads; a positive delta does not prove compilation caused the whole stall. No pre-upload policy is recommended without a byte/workload census.

### S2-7 — Optional far terrain amortizes draws, not visibility or updates

**Evidence:** `farTerrain.ts:103–277`, `farTerrainFlag.ts`; `farTile.ts` and residency mask.

Far terrain remains opt-in (enabled radius default 600 m, clamp 400–1000). Fine 8 m and coarse 16 m grids are merged into two meshes, with six pending jobs and a 120 ms rebuild interval. Frustum culling is explicitly disabled. When dirty, rebuild rewrites all retained tiles into dense slots and marks each used attribute prefix for upload, even if one tile changed. Initial buffer allocation uses capacity rather than drawRange; later update ranges bound sub-updates. Reduced draw count does not eliminate whole-ring vertex processing; fragment mask/fog cannot undo vertex submission. Ring work may also be submitted in additional passes according to layers/cast flags.

The canopy shell uses the same coarse representation. `FAR_CANOPY_KEEP_CHUNKS = Infinity` intentionally disables retaining canopy over resident terrain following an author-reported floating-shell defect. Do not describe the documented distance-2 canopy policy as currently active. There is an acknowledged visual gap in the LOD-thinned resident forest band (Q148), not approval to reduce it further.

**Recommendation:** keep optional-path results separate from ordinary traversal. Measure whole-prefix bytes and ring vertices before considering stable slots/dirty ranges or spatially subdivided draw groups. Those trade more draws and bookkeeping for less rebuild/upload/vertex work. Preserve seam/skirt/elevation correctness and the existing canopy decision.

## Memory, resource lifetime and scaling model

| Resource | Ownership / retained data | Retirement behavior and limits |
| --- | --- | --- |
| Tile grids | Runtime chunk record; canonical storage/cache has separate semantics | Runtime clone retains query/deformation arrays while resident; this is not disposable immediately after GPU upload. |
| Mesh data | Manager LRU, default 64 MiB | `normal/color/bareGround` typed arrays are also referenced by live regular geometry attributes. Evicting LRU entry does not free arrays still owned by geometry. `positionY` is copied into position Y. |
| Terrain geometry | New per attachment/remesh; shared manager material | Mesh detach + geometry.dispose on unload; CPU arrays live until references disappear. Regular plane also retains UV/index/position. No on-upload CPU release; context recovery/reconstruction must be considered before introducing one. |
| Grass | Chunk meshes, per-tier shape geometries, shared instance attributes across tiers, shared system material | Worker matrices bound directly, avoiding throwaway full-sized constructor matrix allocation. Cached tiers retain small shape buffers; release disposes every cached geometry and InstancedMesh. Counts reduce draws, not necessarily stored capacity. |
| Regional props | Cached GLB geometry/material/texture; region placements and per-primitive instance matrices | Rebuild/dispose frees instance resources, not shared templates. Each primitive repeats matrix storage. Swap-remove marks full instanceMatrix dirty without update ranges. |
| Chunk water/river | Chunk-owned planes/materials/masks and river geometry | Explicit disposal on eviction. Multiple lake levels amplify plane/material work; Session 1's format/capability finding remains separate. |
| Far ring | Two capacity-sized dynamic geometry buffers, retained tile arrays, mask texture/material | Explicit canceled requests and geometry/material/texture disposal; no whole-continent allocation. |
| Templates/textures | Module/asset caches, `sharedGpu` convention in `loadGltf.ts`, surface texture caches | Intended reuse across chunk and world replacement. Chunk disposal deliberately does not dispose shared templates; their continued existence is not evidence of leakage. Full application asset-cache lifetime is not exhaustively audited here. |

Analytical sizes, **not measured GPU residency**: mesh-data payload is `32 × resolution²` bytes (Y 1 + normals 3 + colors 3 + bare 1 floats). At 193 this is 1,191,968 bytes (~1.14 MiB), not the cache comment's ~180 KB. A 64 MiB budget holds about 56 such entries, before other retained arrays. At 65 it is 135,200 bytes. Regular geometry additionally has position, UV and index data; cache and geometry share some arrays, so simply summing both payloads double-counts CPU data but not separate GPU storage. One prop instance matrix is 64 bytes **per primitive bucket**; grass adds phase/base/tip/wind attributes (32 bytes), for 96 bytes per stored instance before shape/driver overhead.

Regular terrain triangle count is `2(resolution−1)²` per full chunk: 8,192 at 65 and 73,728 at 193. Forty-nine fully submitted chunks would be 401,408 or 3,612,672 terrain triangles per pass respectively, before hysteresis/pins/water/vegetation. These are upper-work illustrations for the selected window, not actual visible counts. Near terrain has no distance topology LOD in this path; far-ring LOD does not simplify resident sheets. Roads largely shape/tint the terrain rather than adding one draw per road segment; bridges and water remain separate projections.

Regular terrain bounds are computed by Three from final position attributes when first needed; cut geometry computes its sphere explicitly. Both include elevation, and world XZ translation is applied through matrixWorld. No elevation-blind terrain culling defect was established. Lazy first bounds computation is additional main-thread work absent from the mesh-assembly timer. Do not transfer Session 1's shadow-volume defect to terrain frustum culling.

Rebuild correctly separates authoritative tree/resource mutations from projections: presence is unregistered, sparse overrides survive same-world reconstruction, and placement keys support removing one tree from regional contribution data so a sibling rebuild does not resurrect it. LOD omission does not delete trees. This review does not certify all tree growth/persistence semantics or offscreen canopy queries.

## Verification needed before architectural acceptance

No browser/GPU run was performed. Existing source/tests establish mechanisms, not current frame-time or memory results. Use seed **415424794**, exact SHA/config/resolution/DPR/backend metadata; keep WSL/Mesa and native Windows/Arc datasets separate. Historical seed-42/193 results are context only.

1. Capture cold boot, cold-cache traversal, warm revisits, dense forest, shoreline/multiple lake levels, mountain slopes, region-boundary reversals, teleport, repeated world rebuild, and farTerrain off/on as distinct workloads. Include a camera turn exposing previously resident content.
2. Correlate worker queue/physical occupancy/cancellation, preparation, result delivery, finalization start, actual publication, regional rebuild count, created attributes, first draw, buffer/texture bytes and first program key. Preserve raw exceptional frames, p50/p95/p99/max and long-frame attribution. Existing grass finalization diagnostics/program census are useful starting points; do not create parallel telemetry by default.
3. Record CPU submission separately from GPU duration. Session 1 R6 still applies: current GPU query excludes mirror. Capture main/shadow/mirror separately or use an accurately scoped whole-render query; no synchronous query/readback waits.
4. Run deterministic callback-order checks for S2-4 and physical headroom checks for S2-3 before claiming race closure. For regional changes verify tree chop/regrowth, mining, sibling load/unload and stable IDs, plus LOD coverage images in opposite traversal orders.
5. Repeat routes/rebuilds until memory settles; compare JS heap, live arrays, renderer counts and GPU allocations/deletions. Counts are not GPU bytes. Inspect shared-cache references and render lists before calling persistent resources a leak.

Correction order suggested for a separately authorized implementation: establish publication/upload attribution; fix initial grass ownership guard and worker occupancy semantics; eliminate rebuild-on-bulk-dispose and coalesce regional reconstruction; then evaluate regional LOD distribution and optional-ring updates with paired visual/performance evidence. No formal implementation plan, density change, simulation reduction or new renderer is approved by this review.

## Checks performed

`git diff --check` and relative review-link validation passed. A small CPU-only probe using `node --import tsx` and the production staging builder confirmed `source.instanceColor !== null` while its staging clone has `instanceColor === null`; it also checked the 193-resolution payload arithmetic (1,191,968 bytes; 56 entries within 64 MiB). No WebGL context, world generation or test suite was run. The first attempt through the tsx CLI was blocked by its sandbox IPC pipe; invoking the loader directly succeeded. These checks do not establish driver compile time, visual correctness or GPU memory usage.

## Compact continuation handoff

**Report:** `docs/reviews/2026-11-06--037--rendering-streaming-critical-architecture-session-2.md`. **Reviewed source/HEAD:** `3c249cb62ddde343be2b654fae43315a484f8054`. **Documentation commit:** obtain with `git log -1 --format=%H -- <report path>`.

**Covered:** bounded 16.3 chunk selection → workers → publication → first-render ownership, template prewarm coverage, terrain/grass/regional prop culling and disposal, optional far ring/canopy and rebuild interaction. S2-1/S2-2 are strongest traversal cost mechanisms; S2-3/S2-4 are narrow cancellation/state defects; S2-5 is a draw/visibility/coverage trade-off. No runtime measurements or implementation changes.

**Remaining:** native and WSL current-source GPU validation, exact runtime program/material/texture census, full app asset-cache retention, actor LOD/skeletons, full settlement publication and broader simulation cost. Session 1 R1–R11 remain linked evidence with their original qualifications. System 16 stays partial. Next session should either validate measured traversal/upload attribution or review actors as an explicitly separate boundary; neither is implicitly accepted here.
