# NPC rendering optimization reconnaissance

**Date:** 2026-10-29  
**Status:** research; no runtime implementation or benchmark execution  
**Initial source pin:** `e51c883ebe498512eb3d29e0e137446f8e3eb320`  
**Main rechecked before delivery:** `76abca7b291b92c4ed2822a0def0945c39e12b46`. The intervening diff does not change the inspected NPC assembly, character assets, materials or culling owners. It does introduce map/audio work: do not treat historical whole-frame measurements as measurements of this newer build. Updated Strategic Brief and P0 evidence note were read.

**Decision:** Target repeated rendering work of visible Peasant parts. Material-compatible body consolidation has a verified **three-submission opportunity per fully submitted Peasant body**. However, the smallest useful first experiment is **body-only skeleton sharing with validated bind-matrix compensation**, keeping geometry, materials and submissions unchanged. It can remove four body palettes for a male Peasant, three for a female. This is a bounded hypothesis test, not a predicted FPS improvement. Do not implement a blanket one-skeleton-per-NPC substitution or a wholesale V3 CharacterKit port.

Evidence labels: **source/data** = current source or decoded shipped asset; **historical measurement** = existing exported result; **hypothesis** = unmeasured performance effect. Repository access used the GitHub connector. Local computation only decoded asset matrices and checked their algebra; no application, benchmark, visual validation or regression suite was run.

## A. Current NPC rendering structure

### Assembly and representative counts

Source owners: [assembleCharacter.ts](../../../src/characters/assembleCharacter.ts), [NpcAgent.ts](../../../src/ai/NpcAgent.ts), [npcAppearance.ts](../../../src/ai/npcAppearance.ts), [loadGltf.ts](../../../src/assets/loadGltf.ts), [ubcOutfitMaterials.ts](../../../src/assets/ubcOutfitMaterials.ts).

The live automatic path is body GLB → head → selected hair/beard → selected garments → material preparation → NPC wrapper/normalization → conservative bounds → one animation controller. Profession and appearance remain derived from NPC identity, age, gender and role. Legacy model overrides bypass kit assembly.

**Source/data:** GLTFLoader produces a separate SkinnedMesh for each mesh primitive, including multiple children under a multi-primitive authored node. SkeletonUtils.clone then clones the skeleton **per runtime mesh**, even when the source primitives shared a skin. Rebound parts also get a fresh Skeleton per mesh in `rebindAllSkinned()`.

| Concrete Base-head configuration | Authored structure | Runtime SkinnedMeshes | Submissions per complete ordinary main pass | Material state | Runtime Skeletons |
| --- | --- | ---: | ---: | --- | ---: |
| Male Peasant body only | 4 mesh nodes, 5 primitives; Arms has 2 | 5 | 5 | 2 authored materials; 5 instances after NPC preparation (4 separate MI_Peasant clones + skin) | 5 |
| Male Peasant, bald, no beard/garments | Body + 3 head primitives | 8 | 8 | 5 material names, 8 instances | 8 |
| Male Peasant + Parted hair | Above + HAIR_Parted | 9 | 9 | 5 names, 9 instances | 9 |
| Male Peasant + Parted + Beard | Above + HAIR_Beard | 10 | 10 | 5 names, 10 instances | 10 |
| Female Peasant + Base head + Long, before garment | 4 body + 3 head + 1 hair primitive | 8 | 8 | 4 material names, 8 instances after preparation | 8 |
| Live female Peasant / trader | Above + selected WorkSkirt dye; adult trader additionally NobleBodice | 8 + garment primitives | Same conditional count | Additional garment materials; retain independent dye/bodice semantics | 8 + garment primitives |

These are structural counts for fully admitted opaque parts, **not scene-wide observed submissions**. Main frustum, material visibility, shadow eligibility and additional passes determine actual work. The decoded Peasant/head/hair primitives use single materials, not runtime multi-material geometry groups. Double-sided opaque materials do not automatically require two main draws.

Exact binary inspection covered `Male_Peasant.glb`, `Female_Peasant.glb`, `Male_Head.glb`, `Female_Head.glb` and `hair.glb`. The connector returned no payload for the larger current female equipment pack and Blacksmith GLB; their complete runtime counts are not newly certified here. WorkSkirt selection and trader bodice are verified in current resolver/build source; historical skirt notes describe one extra skirt primitive. Other head variants require the same check before extending an optimization.

The [profession verification report](./2026-10-28--npc-character-blender-verification.md) calls authored Farmer/Woodcutter/Blacksmith bodies “one skinned mesh” with 4/3/6 primitives. **Do not translate that into one runtime mesh or one runtime Skeleton**: the inspected loader/clone behavior splits those primitives. Existing census is consistent with this distinction (e.g. Blacksmith 54 runtime meshes across 5 NPCs). Atlas consolidation is a separate visual/asset decision.

### Skeletal compatibility: what was actually checked

All four Peasant body skins reference the same ordered 65 bone nodes. Cloning preserves one actor-local bone hierarchy while duplicating Skeleton palette containers. Head/hair rebinding resolves names onto that body hierarchy; missing names retain source bones and generate warnings. A safe optimization must compare actual Bone references in order, not names alone.

Decoded inverse-bind matrices are **not equal**:

| Asset, comparing all its skins with its first skin | Largest component difference in inverse-bind matrices | Residual after factoring a constant right-side transform per part |
| --- | ---: | ---: |
| Male Peasant body | 1.226886 | ≤ 1.35e-7 |
| Female Peasant body | 1.187876 | ≤ 6.59e-8 |
| Male Base head | 0.102374 | ≤ 1.68e-7 |

Method: decode EXT_meshopt_compression; read all 65 MAT4 values per skin; compute `T = inverse(Icanonical[0]) * Ipart[0]`; check every `Icanonical[j] * T` against `Ipart[j]`. Same bone ordering was checked. Male body blob: `06c131eb404fb584d928c0ec75d73133699c404f`; male head: `ce9129678ac219e8c328fc743664711e0ec94f29`.

This proves neither arbitrary runtime skin equivalence nor visual acceptance, but it identifies a concrete compatibility class. Male-body versus Base-head factoring **fails** (right-transform disagreement around 0.13–0.15); some hair variants also fail against the male body. Uniform joint names do not establish one universal palette.

For AttachedBindMode, the skin operator is:

`Mworld^-1 * sum(weight[j] * BoneWorld[j] * Ipart[j]) * Bpart`.

If all `Ipart[j] = Icanonical[j] * Tpart`, replace the palette and use `Bpart' = Tpart * Bpart`. The effective operator remains equivalent within numeric error, without changing geometry or weights. Three refreshes `bindMatrixInverse` from mesh.matrixWorld in AttachedBindMode. A bare `bind()` temporarily initializes it differently, so update world matrices before bounds/CPU skin queries. DetachedBindMode does **not** have this contract and must be excluded. Never call calculateInverses()/pose() as a repair: that changes the shared rig.

Thus the older audit's “different IBM accessors require geometry rebaking” is too strong. Distinct accessors really do contain different values here, but body-only compensation is a smaller candidate. Full-actor canonicalization remains unproven.

### Existing avoided work and lifecycle

- `NpcAgent` already calls [installActorCullBounds](../../../src/render/actorCullBounds.ts) after final normalization, before animation. All supported skinned parts receive conservative per-instance sphere **and envelope box**; unsupported transforms fail open. Earlier “uncullable heads/hair” conclusions are obsolete.
- Native main/light frusta remain independent. Distance shadow policy is 36 m; actor layer exclusion already removes mirror submissions.
- Kit LOD currently registers obsolete `ubcHairAttachment`/`ubcBeardAttachment` names, so it finds no ordinary kit parts. Existing [visibility adapter](../../../src/render/agentPresentationVisibility.ts) hides optional nodes for **both Mid and Far**, not only Far. Simply registering eyes would introduce an 18 m cutoff, contrary to the older proposed 36 m rule.
- The mixer still updates living NPCs independently of rendering visibility. Sharing Skeleton containers does not remove Bone hierarchy traversal or mixer work.
- Geometry/materials are loader-cache resources unless explicitly cloned. `disposeObject3D()` disposes owned geometry/materials, but currently does **not** dispose Skeleton bone textures. Any sharing experiment must specify unique actor-owned Skeleton cleanup; never dispose another actor's/cache resources.

## B. Where time may be lost

### Existing evidence, with attribution limits

| Historical native Windows evidence | Observation |
| --- | --- |
| [Lantern same-session A/B](../../performance/results/2026-10-28--win-lantern1-ab-same-session.md), new B1/B2 JSON | Hide NPC+fauna saves 6.58 / 5.74 ms RENDER wall time; settlement hide 3.08 / 2.35 ms; shadows off 3.97 / 3.21 ms. Overlapping, sequential short probes: never sum them. |
| [CSS2D control A run5 JSON](../../performance/results/win/2026-10-29--win-css2d-ab-A-run5-settlement-heavy-rep1.json) | 53 NPCs; census 501 NPC meshes, including Peasant 258/28 NPCs. Actual main: **201 NPC + 109.76 fauna submissions/frame**. Shadow: **26.96 NPC + 11.56 fauna**. Mirror: zero actors. Main total 1411; shadow total 404. |
| Same A run5 | Peasant alone contributes **119 main submissions/frame**, about 59% of NPC main calls. Census has 51 Far NPCs; that does not mean all 51 are submitted. |
| [CSS2D experiment](../../performance/results/2026-10-29--win-css2d-matrix-skip-ab.md) | A 31.4 vs B 31.2 mean FPS, no retained gain despite plausible matrix-work reduction. Structural savings alone are insufficient. |
| [Forest bisect/fixes](../../performance/results/2026-10-28--win-forest-bisect-and-fixes.md) | Restoring a conservative raycast box removed a large regression without changing draws. Preserve the current box; do not resurrect the earlier null-box contract. |
| [Trace CPU summary](../../performance/trace-results/trace-settlement-heavy-98ddfbd1.cpu-profile.txt) | Historical whole-scene samples: updateMatrixWorld 13.7% self; projectObject 7%; setProgram 16.8% inclusive; texSubImage2D 1.2% self. No NPC-specific skeleton timing. This trace predates the fixes and slows the scenario itself. |

**Two evidence corrections:** the CSS2D report says GPU timing is absent, but its A-run5 JSON contains `context.gpuTimer.available=true`, 910 resolved samples, zero disjoint events, avg 23.5 ms, span `postprocess+labels`. This is not a per-NPC GPU measurement. Also, Chrome GPU-process task occupancy is not hardware GPU utilization; the older trace report's categorical “CPU-bound, not GPU-bound” conclusion is stronger than that evidence supports. The timer implementation uses a real elapsed query, not a JavaScript stopwatch, but the broad interval cannot isolate shader execution from submission starvation. CPU submission is a credible lead, not a proven exclusive bottleneck.

### Mechanisms

**Verified duplicated work:** each distinct submitted Skeleton flattens 65 bone matrices and dirties its palette texture. Three 0.185.1 `WebGLObjects.update` caches by Skeleton identity and `info.render.frame`; texture version checks avoid uploading an unchanged shared palette separately for every consumer. This is renderer-epoch behavior, **not a guaranteed once-per-game-frame contract**: render-list preparation, shadow rendering and multiple renderer calls matter. Count actual updates/uploads during an experiment.

**Verified submission fragmentation:** four male-body MI_Peasant primitives have equivalent intended material state after the same NPC hue operation, but remain four meshes/material clones. Female body has four MI_Peasant primitives. This is the clearest draw-consolidation target.

**Not established:** dominant character shader cost, dominant skeleton-upload cost, or dominant CPU vertex skinning. Ordinary vertex skinning runs on the GPU; CPU vertex skinning occurs in bounds/raycast queries, not automatically for every animated vertex each frame. Bounds installation is one-time. Material instance count is not shader-program count.

Fauna remains material: roughly one third of actor main submissions in the cited control. The combined hide probe also suppresses actor subtrees/labels; it is not a skinning-only measurement. Shadow actors are a small fraction of shadow submissions here, so global shadow savings cannot justify reducing NPC shadows. Shader replacement, new distance hiding and simulation cadence are not warranted by this recon.

## C. Candidate comparison

| Candidate | Verified opportunity | Expected FPS potential | Effort | Risk | Confidence |
| --- | --- | --- | --- | --- | --- |
| A: merge equivalent Peasant body primitives | Male 5 → 2 submissions; female 4 → 1, **3 removed per fully submitted body/pass** | Stronger structural upside than reference dedup; scene gain unknown | M | Medium: bind normalization, morphs, material/lifecycle and future part visibility | High on count; medium on feasibility; low on FPS |
| B: share only literally identical bindings | Male Arms' two primitives share authored skin; runtime clone duplicates it: save 1 Skeleton. Other checked body/head skins differ | Probably limited; no draw reduction | S | Low with strict equality/fallback | High on narrow opportunity; low on FPS |
| B′: body-only shared palette with validated bind compensation | Male body 5 → 1 Skeleton; female 4 → 1; no geometry/material merge | Worth one bounded test; no FPS gain established | S–M | Medium, primarily binding and disposal | High on decoded factorization; medium on integration; low on FPS |
| Far eyes/eyebrows detail | Up to 2 submitted meshes/palettes per eligible visible NPC | Unquantified; removes actual work but changes appearance | S | Appearance/LOD transitions; D10 open | High on mechanism, low on FPS |
| Shader simplification / shadow reduction / fauna redesign | No sufficiently isolated hotspot | Unknown | M+ | Visual change or broader scope | Low; defer |

### A: smallest serious merge slice

Restrict to **one Peasant body family**; keep head/hair/garments separate. Owners: `assembleCharacter` assembly contract, `NpcAgent.create` NPC-only orchestration, `ubcOutfitMaterials` material semantics, `actorCullBounds` installation, `loadGltf` resource ownership. Do not change the shared player assembly implicitly.

Normalize compatible body geometry into one binding/coordinate space, preserve skin indices/weights, normals, tangents where present, UVs, vertex colors and Fat morph data. Coalesce all equivalent cloth indices into **one material group**, plus the separate male skin group; retaining one group per original primitive saves no draws. Material equality must include textures, hue/emissive, flags and render state, not only name or base-color map. No Lambert conversion.

Eliminates three submissions and redundant mesh/material/palette work; leaves triangles, shading model, animation, fauna and simulation unchanged. Head/hair material consolidation is not included in this count. Keep semantic boundaries for replaceable equipment; do not merge independent visibility/shadow policies. Reinstall conservative bounds and preserve interaction ownership on the NPC wrapper.

Automated gate: sampled real-asset vertex/normal/morph equivalence, correct group/index ranges and material state, unchanged triangles, tint isolation between actors, raycast/world-hit parity, main/light bounds, unique disposal, clone/rebuild behavior. Benchmark protocol and keep/revert criteria are the same as D, adding observed family submissions consistent with the three-per-admitted-body reduction. Approval under D11 is required before this slice.

## D. Recommended first experiment

**B′ — one actor-local shared palette for Male/Female Peasant body primitives only.** It tests a specific duplicated cost without introducing mesh/material consolidation. If the author prefers to prioritize larger submission savings over the smaller experiment, A is the next justified option; it is not already approved.

**Intervention:** a bounded helper in the existing character module, called from `NpcAgent.create` after normal kit/material preparation and before `new NpcAgent`. `assembleCharacter/rebindAllSkinned` remain the source of binding semantics; do not alter their player behavior. Select only exact Peasant body meshes; exclude head, hair, skirt, bodice, profession bodies, legacy and fallback. No global manager.

**Compatibility gate:** actual same Bone references/order, AttachedBindMode, finite/invertible data, and a constant per-part right factor verified against **every bone**. Preserve mesh transforms, geometry, materials, weights and morph influences. Keep canonical inverses immutable. Unknown/incompatible cases retain original Skeletons. Preserve effective skinning, not just a plausible rest pose. Update matrices before normalization/bounds; no per-frame compatibility scan.

**Expected structural effect:** for a complete male Base/Parted/Beard Peasant, 10 → 6 Skeletons; female body saves 3 regardless of garment count. Draws, triangles, Bone object count, mixer work, shaders and visibility policies remain unchanged. Literal reference dedup alone cannot achieve this. Do not generalize to one Skeleton for the whole NPC.

**Cleanup:** in the NPC teardown boundary, collect unique actor-owned Skeletons and dispose each once after use; redundant pre-render palettes normally have no boneTexture yet. Do not broaden cache/player disposal. Compare the two benchmark arms with identical cleanup behavior. SkeletonUtils cloning recreates per-mesh palettes: apply the optimization after the final clone, and test any supported clone/rebuild route.

**Required automated checks before A/B:**

1. Real Peasant assets: all vertices through Walk, Sprint, attack, sitting/kneeling, Interact and settled Death; compare original and candidate positions/normals, including wrapper translation, rotation and child scale. Reuse `actorCullBounds.assets.test.ts`'s loader/clip approach; add parity assertions, not only “inside bounds.”
2. Exact target Skeleton counts; equal primitive/material/group/triangle counts; unchanged bind mode and Bone identity; two NPCs never share Skeleton/Bone instances.
3. Fail-open cases: altered inverse matrix, reordered/different bones, missing bindings, detached mode, nonfinite/singular transform; idempotence and no shared-cache mutation.
4. Conservative sphere/box and representative raycast parity; corpse reconstruction, unload/reload and unique disposal without affecting a surviving actor. Include current appearance/dye tests; leave independent garments and attachments untouched.

**One targeted measurement session:** same native Windows Arc 140V, viewport/DPR/High, seed/fixture, camera, weather/time and power conditions; warmed, counterbalanced A/B (at least three 30 s repetitions each). Pin a common current build with only the experiment toggle changed, because newer map/audio integrations invalidate blind historical whole-frame comparisons. Match NPC/fauna families and admitted body counts, not merely “53 NPC stable.” Keep a fixed settlement-heavy front pose; use a separate rear/edge/caster check for correctness. No automatic full baseline recapture.

Alongside existing frame/FPS and pass counters, use opt-in diagnostic counts/timing for **eligible NPC Skeleton.update executions and palette refresh/upload evidence**. Separate the profiled diagnostic run from unprofiled FPS acceptance; a dirty flag alone is not proof of a GPU upload. Keep diagnostics and their overhead equal in A/B arms.

**Keep only if** structural reduction occurs, effective skinning/visual/lifecycle checks pass, and mean FPS plus frame-time distributions show repeatable net improvement outside same-variant variation, without p95/p99 or hitch regression. A render-only or counter-only improvement does not satisfy this task's average-FPS objective. Choose a numerical noise threshold from that session before reading B's outcome; do not invent an expected FPS gain. **Revert** if benefit remains unresolved, only palette counts improve, or any animation/culling/picking/resource regression appears. Record a negative result and move to A or attribution; do not expand B′ until it “wins.”

## E. Remaining unknowns

Only three measurements are essential:

1. Eligible Peasant body count actually submitted and Skeleton updates/palette uploads per renderer epoch in the current settlement-heavy workload; this establishes whether B′ removes enough recurring work.
2. A matched B′ A/B with the above frame metrics. Existing combined hide data cannot substitute for it.
3. If B′ is inconclusive, separate NPC-only and fauna-only render isolation, plus material/primitive attribution for the admitted NPCs. This selects A versus a fauna investigation without launching a broad renderer redesign.

The binary factorization needs effective vertex/normal parity tests before implementation acceptance. No additional benchmark is needed merely to reconfirm authored primitive counts. Full-actor sharing, larger equipment packs and non-Base heads are outside the recommended first slice.

## F. Planning coordination and sources

- Existing owner: [world-terrain-050](../../plans/world-terrain-050-agent-performance-render-census-and-lod.md). Preserve A1′ and its conservative raycast-box fix. No new plan ID or implementation plan created.
- [npc-063](../../plans/npc-063-agent-performance-update-cost-attribution.md) owns CPU attribution; do not turn this into AI/navigation work. Coordinate `NpcAgent` edits with [npc-064](../../plans/npc-064-agent-performance-spatial-state-seam.md), but body palette sharing does not require a new spatial/lifetime system.
- [npc-062](../../plans/npc-062-ubc-runtime-material-darkness-and-authored-outfit-preservation.md) owns material appearance issues; preserve current MeshStandard, emissive behavior, dyes and authored profession variants even where older plan descriptions are stale.
- [Strategic Brief](./STRATEGIC-BRIEF.md): **D11 outfit merge/material direction remains open**. A requires explicit author selection. B′ does not merge materials or geometry and need not settle Lambert versus MeshStandard, but still requires authorization for its bounded bind-normalization experiment. D10 is required for far-eye policy. This research authorizes neither.
- Updated [P0 evidence note](../../performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md) closes P0 operationally and permits focused same-session decisions; older “certify everything first” checklists must not restart P0. Its GPU-availability shorthand should be read alongside the explicit JSON correction in B.
- Keep this report as the research owner requested by the author. A later approved slice belongs in world-terrain-050's implementation notes, with its measured result under `docs/performance/results/`. Do not mark A7/D11 implemented or accepted from this report.

Additional inspected references: [three-track roadmap](./2026-10-27--performance-three-track-roadmap.md), [older NPC/fauna audit](./2026-10-27--revival-audit--npc-fauna-rendering.md), [transfer recon §10](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27), [A1′ implementation notes](../../plans/implementation-notes/world-terrain-050-agent-performance-render-census-and-lod-implementation-notes.md), [technical review 026](../../reviews/2026-10-26--026--v1-revival-cursor-technical-review.md), [skirt investigation](./2026-10-28--female-skirts-investigation.md).

Dependency source checked through the connector: Three tag `r185` reports package version **0.185.1**, matching V1's lockfile: [GLTFLoader](https://github.com/mrdoob/three.js/blob/r185/examples/jsm/loaders/GLTFLoader.js), [SkeletonUtils](https://github.com/mrdoob/three.js/blob/r185/examples/jsm/utils/SkeletonUtils.js), [Skeleton](https://github.com/mrdoob/three.js/blob/r185/src/objects/Skeleton.js), [SkinnedMesh](https://github.com/mrdoob/three.js/blob/r185/src/objects/SkinnedMesh.js), [WebGLObjects](https://github.com/mrdoob/three.js/blob/r185/src/renderers/webgl/WebGLObjects.js), [WebGLRenderer](https://github.com/mrdoob/three.js/blob/r185/src/renderers/WebGLRenderer.js), [WebGLTextures](https://github.com/mrdoob/three.js/blob/r185/src/renderers/webgl/WebGLTextures.js). Asset matrix decoding used the upstream meshoptimizer v1.0 decoder, not an application run.
