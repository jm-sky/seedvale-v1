# SeedVale V1 Revival — Actor Rendering, LOD & Memory Critical Architecture Review (Session 3, Independent Evidence Supplement)

**Reviewer:** Grok Bot, independent graphics/architecture review. **Status:** done within the bounded source/CPU scope; corrective work and runtime acceptance remain open. **System 16:** partial, not accepted. Findings do not authorize implementation.

## 1. Reviewed snapshot, date and continuity

- **Date:** 2026-11-06, Europe/Warsaw (CET).
- **Reviewed source:** `7c6ea3c47d7ebc3be7ea5e84275fd50524d90bfb`, `main`, existing S661L Windows checkout. Clean tree before documentation changes.
- [Session 1](./2026-11-06--036--rendering-gpu-critical-architecture-session-1.md) reviewed `ac9717721e3eb68feadf45b5c476e5de18924735`; its documentation commit was `3c249cb62ddde343be2b654fae43315a484f8054`.
- [Session 2](./2026-11-06--037--rendering-streaming-critical-architecture-session-2.md) reviewed that `3c249cb6` snapshot; supplied documentation commit `3d9e2893` exists in the current history.
- Inspected intervening changed paths and current actor owners. Between the Session 1 and Session 2 source snapshots, actor-specific changes added player-eye sight concealment/layers, contact billboards and composition wiring. These paths are assessed here for actor presentation/lifetime, not assumed verified by Session 2. Since the Session 2 source snapshot, the enumerated NPC/fauna/player/character/render/settlement actor owners have no source changes. Later biome/tree workload and documentation/tooling changes still invalidate comparisons with old world performance numbers. A clean pull advanced the initial checkout from `bc4d65c0` to the reviewed SHA; that advancement did not change application source.

Read CLAUDE.md, the two reports, [review matrix](./SYSTEM-REVIEW-MATRIX.md), [Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md), [architecture](../architecture/ARCHITECTURE.md), [graphics decisions](../architecture/GRAPHICS.md), [performance/workers](../architecture/performance-and-workers.md) and [CODE_INDEX](../CODE_INDEX.md). Followed actual imports into assembly, cache, animation, sight, settlement and world owners. Relevant prior evidence includes [culling review 029](./2026-10-28--029--world-terrain-050-a1-skinned-mesh-culling-review.md), world-terrain-041/050 plans and notes, Q20 skeleton-sharing notes, tools-022 body-build notes and current outfit/appearance code.

**Verdict:** local actor ownership, stable NPC state, shared assets and actor-local palette sharing are sound foundations. They do not establish bounded actor initialization/publication work or efficient hidden-actor animation. Fauna retain nonconservative first-pose skinned bounds; live garment rebinding loses named build morphs; two retirement paths omit deterministic resource release. Ordinary kit NPCs currently have no effective optional-part LOD despite the distance policy. No Critical finding was established; three findings are High. There is no measured FPS, frame-time gain, GPU-memory total or permanent-leak claim in this report.


### Concurrent review reconciliation / unique finding IDs

During the required pre-push pull, independent [review 038](./2026-11-06--038--rendering-actors-lod-memory-critical-architecture-session-3.md) landed in commit `261826eee6de48c0e32c7377fc7f24f483e4a6f4`, against the **same reviewed source SHA**. Its report, index row and provider attribution are preserved unchanged. This report was renumbered **039**, uses distinct **S3B-*** finding IDs and supplements that work; it is not Session 4 or a replacement for 038. The investigations were conducted independently before the concurrent report was discovered. Repeated mechanisms below are explicitly corroborating evidence, not extra unique defect counts.

| This supplement | Review 038 | Relationship |
| --- | --- | --- |
| S3B-1 | S3-6 | New real-asset CPU counterexamples turn the conditional animal-bounds concern into a confirmed nonconservative-bound defect. |
| S3B-2 | S3-3 | Same publication-budget risk, independently corroborated; do not count twice. |
| S3B-3 | Not identified there | New confirmed runtime garment named-morph/influence defect, using production assembly and real derivative assets. |
| S3B-4 / S3B-5 | S3-1 / S3-2 | Same retirement omissions; player disposal-event probe adds evidence. This reviewer rates them Medium, whereas 038 rates them High; the original ratings are not rewritten or withdrawn. |
| S3B-6 / S3B-7 | S3-4 / S3-5 | Corroborated mixer/LOD limitations, not new discoveries. |

The pull also advanced upstream to `6e20d6df4f0ba12628857a82debf8f15b60d04bd` with rumour/dialogue/save-v61 and queue work. Inspected changed-path list and the createApp/inventoryWiring deltas: these do not change the enumerated actor construction, animation, bounds or retirement owners. Those upstream changes are preserved and are **not** new broad simulation/save acceptance. All probes/test results in this report remain tied to `7c6ea3c47d7ebc3be7ea5e84275fd50524d90bfb`.

## 2. Scope and explicit exclusions

Covered the requested A–F seams:

1. NPC/player assembly, wild and domestic animal factories, mounted presentation, scene attachment and authoritative-state ownership.
2. Actor distance policy, native frustum tests, animated bounds, sight concealment, animation cadence and transition behavior.
3. Skeleton compatibility, palette/clip reuse, mixer ownership, equipment rebinding and independent animation.
4. Multipart submission, materials/textures, rigid versus skinned batching, shadow-distance and transparency implications.
5. GLTF caches, per-actor resources, normal removal, detached livestock, settlement stream-out/in and WorldBundle reconstruction.
6. Current profession outfits, female garments, hair/head variation, live body-build derivatives, children and implemented player equipment seams. This is not a wardrobe-quality review or approval of planned armor/child assets.

**Excluded:** full game-loop CPU performance, global NPC/fauna scheduling, workers/simulation batching, economy/offscreen simulation (Session 4); renderer/postprocessing/shadow architecture, water reflection design, full terrain streaming, regional vegetation batching and far terrain (Sessions 1–2). Their actor-specific intersections are cross-referenced, not re-counted as new findings. No browser, WebGL context, benchmark, heavy integration run, application/test/configuration/plan/roadmap edit or Session 4 work occurred. Exhaustive per-asset/pose visual acceptance and application-wide cache teardown are not claimed.

## 3. Actor architecture and ownership map

| Presentation family / boundary | Authority and construction | Update / retirement owner |
| --- | --- | --- |
| Resident NPC | `createSettlement.ts:1426–1515` derives stable `settlementNpcId`, obtains `npcStateRegistry.getOrCreate`, applies presentation-owner gate, then calls `NpcAgent.create`. `npcAppearance.ts` derives role/sex/age/stable-ID appearance. `assembleCharacter.ts` loads body/head/selected hair/garments and rebinds parts to body Bones. | `NpcAgent` wraps/scales, shares compatible skeletons, installs cull envelope, creates one animation set and label. Settlement updates agents. `NpcAgent.dispose` stops animation, removes label and calls `disposeObject3D`; settlement removes root. |
| Wild fauna | `createFauna.ts` loads/prepares templates, SkeletonUtils-clones each visual and constructs `AnimalAgent`. `AnimalSpawner`/materialized-group lifecycle selects residents; it is not the GLTF owner. Current fauna-050 is not an all-continent always-resident mesh array. | `AnimalAgent` shares palettes and owns animation/labels/corpse/pack attachments. `createFauna.disposeAgent:506–514` additionally detaches and calls `disposeObject3D`. |
| Livestock / detached animals | `settlement/livestock.ts` caches prepared templates, selects appearance from stable animal ID, hydrates persistent records and uses the same `AnimalAgent`. Transfer to detached collections changes hosting, not animal identity. | `disposeLivestock:1143–1149` performs agent cleanup, detach and GPU-object cleanup. Manager-wide detached teardown differs: S3B-5. |
| Mount | The existing livestock/animal actor remains the presentation; mounting does not instantiate a second horse or mixer. | `AnimalAgent.driveMounted:2596–2604` flushes cadence accumulators and presents every update. Lead, ownership and active actions raise importance. Cart/pack goods authority stays outside the visual. |
| Player | `PlayerController.create:594–664` assembles/loads, clones mutable outfit materials and prepares the model. Equipment-derived appearance and per-slot rebinding are presentation adapters, not inventory authority. | One player mixer; generation tokens protect delayed appearance/tool/accessory results. No call to actor skeleton sharing or actor cull-envelope installation. Final current-model cleanup is present; successful replacement retirement differs: S3B-4. |
| Assets / animation | `loadGltf.ts` module `Map<string, Promise<CachedGltf>>` retains URL templates and clips. Geometry/materials are marked `sharedGpu`; SkeletonUtils clones actor transforms/Bones/skeletons, not all vertex/texture payloads. Assembly shares clips. | Templates intentionally outlive actors/WorldBundle. Mutable tint materials and bone textures are actor-owned. `disposeObject3D:217–241` skips cached geometry/materials but does dispose skinned skeletons. |
| World / sight | `worldRebuildLifecycle` snapshots authority before disposing projections; player survives and rebinds world samplers. `playerSight.ts` reads accepted resident collections after actor updates (`gameLoop.ts:3189–3205`). | Sight uses layers, not actor root visibility. Cache/contact pruning and pooled billboards are world-owned; `dispose` reveals touched actors, clears contacts and releases sprites/materials/textures. No unbounded actor-reference retention was established there. |

Normal NPC flow is **stable state → deterministic look → cloned/assembled projection → actor-local animation → scene submission**. `member.scale` approximates children using a uniformly scaled adult kit; it does not establish a new child rig. Scene/model identity is not saved entity identity. Current NPC owner gates and livestock capture/hydration preserve that separation through the inspected residency paths. This does not overrule the separate wild-fauna continuity defects in [review 035](./2026-11-06--035--continent-wide-wild-fauna-architecture-review.md).

## 4. Prioritized findings

Severity expresses correctness/scalability priority, not measured milliseconds. A source-confirmed mechanism may still have unmeasured performance impact.

| ID | Severity | Classification | Finding / evidence status |
| --- | --- | --- | --- |
| **S3B-1** | **High** | **confirmed defect** | Fauna/livestock keep first-pose per-mesh bounds that exclude later animated vertices. New bounded real-asset counterexamples validate the previously deferred animal-bounds concern. |
| **S3B-2** | **High** | **architectural risk** | Resident actor construction and scene publication have no per-update work budget; warm cached promise fan-out can concentrate assembly/bounds work and defer first-use uploads. Impact is a performance hypothesis, not a measured hitch. |
| **S3B-3** | **High** | **confirmed defect** | Production garment rebinding loses named morph metadata: Heavy/Slim bodies deform while attached skirts/bodices remain at base weights. |
| S3B-4 | Medium | confirmed defect | Successful player model replacement retires materials but not the removed model's skeleton resources. |
| S3B-5 | Medium | confirmed defect | Manager-wide detached-livestock teardown skips the mesh-resource cleanup used by ordinary livestock/wild retirement. |
| S3B-6 | Medium | performance hypothesis | Living resident NPC animation/presentation remains full-update-rate even when offscreen or sight-concealed; distance cadence exists only for ordinary animals. Revalidated known scaling limitation. |
| S3B-7 | Medium | improvement / confirmed coverage gap | Optional-part LOD still registers legacy attachment names, not current kit hair/beard nodes. Existing limited policy is effectively absent for ordinary kit NPCs; not a newly introduced regression claim. |

### S3B-1 — Animal animated bounds are not conservative

**Files/symbols/evidence:** `AnimalAgent.ts:1872–1875,1918–1930,2698–2738,3343–3382`; wild/livestock template cloning; `actorCullBounds.ts:61–166` is installed by NPCs only. Installed Three.js **0.185.1** `SkinnedMesh.computeBoundingSphere` samples the current pose; `Frustum.intersectsObject` computes it only while null. Mixer updates do not refresh it. Native mesh raycast also uses the cached sphere and optional bounding box. Skeleton sharing does not install animation bounds.

**Bounded confirmation:** decoded shipped wolf, deer and horse GLBs with MeshoptDecoder; replaced materials/textures only to avoid DOM/WebGL; used production `prepareProp(root, 1)` and `shareActorSkeletons`, one palette per animal. Froze each native sphere after `Idle` at 1/60 s, then sampled actual `Walk`, `Gallop`, `Death` at 17 times each. `getVertexPosition` includes skinning/morphing; it was not skinned twice. Maximum vertex distance **outside** its original sphere, divided by the model's fitted height:

| Asset | Walk | Gallop | Death |
| --- | ---: | ---: | ---: |
| wolf.glb | 0.113 | 0.214 | 1.002 |
| deer.glb | 0.108 | 0.163 | 1.168 |
| horse.glb | 0.129 | 0.317 | 1.130 |

For each worst sample, a six-plane CPU frustum containing the escaped world-space vertex rejected the actual mesh via `Frustum.intersectsObject`. This is a mathematical false-rejection counterexample, **not an in-game screenshot, measured frequency or gameplay-size claim**. Small submeshes are particularly vulnerable; e.g. wolf `mesh_0_1` during Walk at ~0.267 s and Death at ~1.067 s. An exploratory broader-clip probe also found excursions; the table uses the narrower production-fit/shared confirmation.

**Trigger:** first visible pose initializes native bounds; later locomotion, collapse or settled corpse moves a component beyond them near a camera/light clipping plane. First visibility after traversal can choose a different initial pose, so the symptom can depend on exposure order.

**Root cause:** per-mesh single-pose bounds are used as lifetime animated bounds; the proven NPC-envelope mechanism was not applied/validated for animals. Sharing palettes does not repair spatial bounds.

**Consequences:** incorrect partial model/shadow disappearance is possible for wild fauna, livestock and mounts; ray broad-phase can also be nonconservative for consumers that actually raycast these visuals. No authoritative hit/AI failure or observed screenshot defect is claimed.

**Minimal corrective approach:** separately authorize extending the existing actor-bound ownership seam to animal assemblies, validating quadruped clip/morph/corpse envelopes and failing open when unproven. Do not blindly assume the human padding heuristic covers every animal.

**Alternatives/trade-offs:** asset/clip envelopes precomputed once per compatible template reduce spawn cost but need invalidation for morphology/attachments; per-frame exact CPU bounds add vertex work and are not the default recommendation; disabling native culling is correctness-safe but submits more geometry.

**Verification:** real-camera edge views and light-frustum cases for all species, mounted/led forms, attacks, hurt, death and rehydrated corpses; CPU tests must contain every sampled vertex and survive scaling/rotation/clone. **Confidence: high** for nonconservative bounds; runtime visibility frequency/cost unmeasured.

### S3B-2 — Actor initialization/publication is outside a bounded presentation budget

**Files/symbols/evidence:** `createSettlement.ts:585–600,1426–1515` and `flatMembers.map` immediately following; `SettlementsManager.ensureLoaded:1257–1306`; `NpcAgent` constructor `1899–1953`; `assembleCharacter.ts:49–85,130–213`; `actorCullBounds.installActorCullBounds`. Settlement construction starts a whole resident batch concurrently. Each completed `NpcAgent.create` adds its mesh to the scene **before** `collectAgentBatch` finishes and before manager acceptance. Warm URL caches still clone hierarchies, rebind parts, allocate materials/actions/labels and synchronously scan skinned vertices for preparation/bounds. Loading hair/eq packs clones more than the selected final parts; fetching shared animation clips also clones their scene before it is discarded.

`Promise.allSettled` correctly collects successful siblings for rollback; manager entry/residency guards correctly dispose obsolete results. Those correctness guards do not distribute construction or speculative scene attachment across updates. No actor-specific publication budget was found. Multiple settlements/template completions can converge before a render. Actual GPU upload occurs on subsequent submission, not at `scene.add`.

**Trigger:** warm revisits, multiple residency arrivals, startup neighbors, teleport/rapid reversal or a set of shared cold asset promises resolving together.

**Root cause:** asynchronous I/O fan-out is treated as work distribution; individual continuations still execute synchronous Three.js/DOM construction and publish immediately. Terrain finalization limits do not bound this actor path.

**Consequences:** concentrated main-thread allocation/bounds work and later first-use work are plausible; projections can exist before their settlement is accepted for normal actor updates/sight collection. This is not proof of duplicate authoritative NPCs, broken rollback, a particular stall duration or one full geometry upload per actor. Cached geometry/textures are normally shared; new palettes and newly encountered asset/morph variants have different upload lifetimes.

**Minimal corrective approach:** measure actor stages, then use the existing settlement construction/publication owner to consume ready visual work incrementally, checking current entry/owner at consumption. Keep authoritative state and stable IDs intact; make speculative versus accepted attachment explicit. A local presentation budget must not silently defer required simulation, interaction or ownership handoff.

**Alternatives/trade-offs:** cache compatible assembled render templates/clip-only loading to remove redundant preparation; that adds variant-key and clone-correctness obligations. Coalesce at an existing publication seam rather than introduce another global scheduler. Worker migration does not mechanically move Three.js/DOM ownership or eliminate first draw/upload work.

**Verification:** counts/time of requested/ready/constructed/attached/accepted/discarded actors per frame; per-stage allocations and vertices scanned; cold/warm routes and first camera exposure, including cancellation and late sibling failure. Preserve the existing all-settled rollback checks. **Confidence: high** in the missing work boundary; performance impact unmeasured. This is the **actor-specific extension** of Session 2 S2-1, not a duplicate terrain finding or full settlement-lifecycle review.

### S3B-3 — Runtime garment rebinding loses named body-build morphs

**Files/symbols/evidence:** `assembleCharacter.rebindAllSkinned:49–85` constructs `new SkinnedMesh(src.geometry, src.material)` but copies neither `src.morphTargetDictionary` nor `src.morphTargetInfluences`. The comment near `assembleCharacter:194` incorrectly assumes reused geometry includes the named dictionary. Installed Three `Mesh.updateMorphTargets` regenerates names from BufferAttribute.name or numeric indices; GLTFLoader applies `extras.targetNames` to the **mesh object**, not the geometry. The existing Asset Browser `mountCompareGarments` explicitly copies both fields; the production path does not. `applyBodyBuild:80–106` looks up `Fat`/`Slim` by name, reports unsupported meshes and still applies the build to supported body parts.

A bounded probe substituted only disk/material loading on GLTFLoader and called the **real production** `assembleCharacter` for Female Peasant + WorkSkirt + NobleBodice, Heavy and Slim. Real derivative garment source meshes had `{Fat:0,Slim:1}` dictionaries with unnamed morph BufferAttributes. Production rebound garments had `{'0':0,'1':1}` and `[0,0]` influences. Heavy body meshes became `[1,0]`; Slim body meshes became `[0,1]`; both garment weights stayed zero. Assembly returned `build heavy/slim: no morph on EQ_WorkSkirt, EQ_NobleBodice` warnings rather than rejecting the mismatched projection. The on-disk/unit tests pass because they test source target presence or manually supplied dictionaries, not this runtime assembly contract.

**Trigger:** a non-base live body build with affected rebound garments. `npcAppearance` selects build derivatives and female skirts/bodices; the default-enabled NPC body-build path logs warnings and keeps the assembled result. This is current shipped behavior, not an assumption about planned per-slot armor.

**Root cause/consequences:** morph geometry reuse was conflated with preservation of per-mesh semantic names/weights. Body and clothing silently diverge in morph state, breaking customization/visual continuity and creating a concrete risk of penetration or gaps. GPU morph data can still exist for garments whose intended influence is never applied. The state mismatch is confirmed; exact rendered artifacts and GPU cost are unmeasured. Authoritative identity/equipment/stats are not changed.

**Minimal corrective approach:** align runtime rebinding with the existing preview contract: preserve named morph dictionary and independently owned influences before build application; verify support for the whole assembled build rather than treating warnings as evidence of compatible clothing. Do not mutate shared geometry/attributes or silently remove clothing.

**Alternatives/trade-offs:** a build-support failure can retain the complete base presentation rather than a partly morphed actor, but that changes the intended appearance and needs explicit policy. A shared narrow rebinding helper could prevent preview/runtime drift, provided it does not merge their ownership or trigger a wardrobe rewrite.

**Verification:** use real derivative GLBs through production assembly for Heavy/Slim, all WorkSkirt dyes and NobleBodice, plus supported equipment; assert named dictionaries and selected influences on body and garment, independent actors and unchanged source/cache state. Then verify bounds, animated seams and successful/stale player swaps. **Confidence: high** for the metadata/influence defect; visual severity per outfit needs author/runtime inspection.

### S3B-4 — Successful player swaps do not retire removed skeletons

**Files/symbols/evidence:** `PlayerController.replaceModelRoot:942–974` stops the old mixer, calls `disposeOutfitMaterialClones(oldRoot)`, detaches the old root, remounts carried/equipment visuals and binds the next mixer. `disposeOutfitMaterialClones` disposes mutable materials, not skeletons. Final `PlayerController.dispose:1743–1760` reaches only the currently installed model. In contrast, stale async results use `disposePlayerVisual`/`disposeObject3D` and do retire skeletons.

A bounded CPU probe called the real replacement method on a small receiver with unrelated animation/remount hooks stubbed. The old skinned model had a `computeBoneTexture()` allocation and disposal listener: replacement detached it, left `skeleton.boneTexture` non-null and emitted **zero** texture-dispose events. No GL allocation was made by this probe; it verifies the missing disposal call, not GPU growth.

**Trigger/root cause:** successful outfit/model replacement after the old model has been rendered; removal uses a materials-only cleanup intended to preserve shared assets rather than the complete actor-owned-resource retirement contract.

**Consequences:** the old palette texture has no deterministic disposal on that path. Browser/driver resource reclamation and any retained render-list references require observation; an unbounded permanent JS/GPU leak is **not** established. Material cleanup and stale-load tokens are present and should not be reported as missing.

**Minimal corrective approach:** after moving/detaching resources that deliberately survive the swap, retire the old model through the existing complete visual disposer, leaving cached geometry/textures and carried attachments alive. Do not dispose a palette still used by the newly installed projection.

**Alternatives/trade-offs:** explicitly retire unique old skeletons if full traversal cannot respect surviving attachments; this duplicates ownership knowledge and needs stronger tests. Test successful A→B→C, not only stale B rejection, with disposal spies and warmed renderer counts. Verify equipment/tool remount and async races. **Confidence: high** for missing retirement; native GPU retention unmeasured.

### S3B-5 — Detached-livestock manager disposal bypasses GPU-object cleanup

**Files/symbols/evidence:** `SettlementsManager.dispose:1829–1835` calls `animal.dispose()`, removes the detached root and clears collections. `AnimalAgent.dispose:2026–2044` retires claims/corpse/label/animation/debug/pack resources, but intentionally does not retire the animal mesh. Ordinary `disposeLivestock:1143–1149` and `createFauna.disposeAgent:506–514` additionally call `disposeObject3D(agent.mesh)`.

**Trigger/root cause:** WorldBundle/manager destruction while detached livestock exist; a hosting transfer preserves the actor but its terminal owner omits the second half of the established disposal contract.

**Consequences:** detached animal skeleton palettes and any instance-owned visual materials/capsule fallback geometry are not explicitly released there. The agent already disposes its pack attachment; do not count it twice. Collection clearing means no permanent manager-held actor-reference leak was demonstrated.

**Minimal corrective approach:** reuse the existing complete livestock retirement path at terminal detached teardown; keep ordinary transfers non-disposing. An alternative is moving mesh ownership into `AnimalAgent.dispose`, but that changes every caller's contract and is a larger regression surface.

**Verification:** detached/owned/led/mounted and ordinary livestock across repeated rebuilds; spy skeleton/material/fallback geometry disposal, ensure shared assets survive and transfer back to a settlement never disposes a live actor. Native renderer allocation/deletion settling still required. **Confidence: high** in the cleanup mismatch; GPU bytes/growth unmeasured.

### S3B-6 — Visibility does not bound living NPC presentation CPU

**Files/symbols/evidence:** `NpcAgent.update:3858–3915` synchronizes animation, observation/debug/activity and labels, then calls `this.anim.update(dt)` for every living resident update. No camera/frustum/sight-concealment guard applies. `playerSight.update` runs later in the loop; layer concealment suppresses submission/information, not that update work. Death stops advancing the mixer once its pose is settled. `AnimalAgent.tickPresentation` instead consumes a separate cadence accumulator, but its policy has no visibility input either.

**Trigger/root cause:** resident population grows or the camera turns away/actors are blocked; resident simulation and presentation remain coupled in the NPC update tail. Shared skeletons do not skip independent mixer track evaluation.

**Consequences:** animation/label CPU can scale with resident, not visible, NPC count. Native renderer frustum/layer rejection can avoid relevant draws and palette work while mixer work has already happened. Do not equate this with GPU skinning of every hidden actor or with all autonomous simulation being wasteful. Existing recon identified this limitation; this session revalidates the owner and contrasts current animal cadence.

**Minimal corrective approach:** profile the existing presentation tail and, if significant, give only presentation evaluation a lower-rate/reveal-safe policy within its current owner. Keep movement, attack timing, injury, state, identity and required gameplay full and independent. Reconcile animation phase on reveal; do not use stale bounds to decide whether safe bounds should update.

**Alternatives/trade-offs:** distance-only cadence is simpler but misses concealed nearby cohorts; visibility-aware presentation must account for shadow-visible actors, interactions and one-shots. Skipping label content work separately is lower risk than pausing every mixer. A new simulation scheduler is neither necessary nor authorized here.

**Verification:** equal resident population with visible, behind-camera and player-eye-blocked cohorts; count actual mixer updates/track bindings and label writes separately from simulation and draw calls. Compare reappearance, combat/interaction and death continuity. **Confidence: high** in current execution; **medium** that this dominates a particular workload without measurements.

### S3B-7 — Legacy optional-node registration misses the current kit

**Files/symbols/evidence:** `NpcAgent.ts:1954–1963` only registers `ubcHairAttachment` and `ubcBeardAttachment`. `assembleCharacter` and `characterFiles.hairNodeName` produce current `HAIR_*` rebound nodes, with deprecated attachment URLs null in `npcAppearance.ts`. The visibility adapter returns null when no optional references are found. `resolveAgentPresentationLevel` has 18/36 m tiers; mid and far merely hide registered optional nodes. No replacement geometry/actor proxy is selected.

**Trigger/root cause/consequence:** ordinary assembled kits never match the old registration contract; the policy name is not evidence of draw/triangle LOD for current NPCs. Full bodies/head/clothing remain detailed while resident and submitted. This was already documented in earlier recon; it is a revalidated coverage limitation, not evidence that hiding all hair is approved or that identity changes.

**Minimal corrective approach:** make the current limitation explicit and, only after confirming safe/acceptable optional parts, extend this existing adapter with assembly-owned references rather than guessed traversal names or a parallel LOD framework. Preserve body silhouette and identity-bearing/equipment visuals.

**Alternatives/trade-offs:** retain full detail and pursue safe mesh/material merging; or test optional-part LOD with author images and hysteresis. Current thresholds have no hysteresis and mid/far do not differ further; rapid threshold crossing matters only once real optional nodes are registered. Combat forces near; arbitrary distant disappearance/proxy policy remains an author decision.

**Verification:** representative role/sex/head/hair/beard/build assemblies must expose the intended nodes; near/mid/far, combat, approach/retreat and teleport must preserve authoritative records and not pop mandatory clothes/gear. **Confidence: high** in registration mismatch; savings/visual acceptability unmeasured.

## 5. LOD, visibility and the ten architectural questions

### Actual policies are not unified

| Family | Geometry / visibility | Animation and transition behavior |
| --- | --- | --- |
| NPC | Conservative shared actor envelope on each skinned component; native main/light frustum culling. Fail-open for unsupported transforms. Optional-node policy at 18/36 m is mostly inactive for current kits. Sight changes layers, not root visibility/state. | Living mixer every resident update. Combat forces optional-detail near. No threshold hysteresis; no geometry replacement or visual-LOD actor reconstruction. |
| Ordinary wild/domestic animal | Native cached per-mesh spheres: S3B-1. No actor geometry LOD or use of `resolveAgentPresentationLevel`. Sight layers independent of death visibility. | Presentation full through 20 m; otherwise base intervals 1/20 s through 36 m and 1/10 s farther away. Stable-ID phase shortens these by up to 30%, so these are not strict 20/10 Hz caps; frame quantization also matters. |
| Important / mounted animal | Same geometry/bounds. | Engagement/threat, player coupling/ownership, committed traversal/cave, swimming and active one-shot can force immediate work. Mounted presentation is unconditional. These are deliberate continuity guards, not a unified visibility-aware LOD. |
| Player | Local hero needs no distant-actor LOD. Assembled rebound parts disable native frustum culling; body may retain native lazy bounds. No canonical-palette sharing installation. | Independent full-rate player mixer and action timers. Async appearance generation tokens prevent stale installation; swaps are not distance transitions. |

`animalUpdateCadence.ts` separately exposes behavior and presentation intervals; life/required gameplay sections remain outside the presentation gate. This review does not certify all behavioral cadence semantics, which belong to Session 4. Label opacity/spatial hiding and 36 m shadow switches are not actor geometry LOD. NPC and animal labels cache changed values, but their presentation sync calls still execute at their respective rates.

### Explicit answers

1. **Does visual complexity scale predictably with resident population?** Mostly linearly in per-actor nodes, primitives, local palettes and mixer bindings for fixed variants; no demonstrated per-frame initialization/publication ceiling. Variant/attachment mix changes the coefficient. Not every continent entity is a resident visual.
2. **What continues outside the camera view?** Living NPC animation/label preparation, actor updates, transform traversal and sight/observation work; animals continue presentation at their distance/importance cadence. Main-view rejection does not suppress all shadow work. Actual GPU vertex skinning only happens for submitted geometry in participating passes.
3. **Are policies consistent across families?** No: NPC envelopes/full-rate mixers/legacy optional adapter; animals stale native bounds/separate cadence; mounts immediate; player local full detail. A shared distance constant is not a common LOD implementation.
4. **Can visual LOD alter simulation or identity?** Inspected optional visibility/layer/cull paths do not mutate authority or recreate actors. Animal presentation cadence is distinct from behavioral/life sections. Settlement residency does reconstruct projections, using existing ID/registry/owner gates; this bounded observation is not full persistence or fauna-050 sign-off.
5. **Is skeleton sharing effective and safe?** Yes for the tested compatible actor-local rigs; it rejects incompatible palettes and preserves actor independence. Male kits intentionally retain a separate head palette. It does not share poses between actors, merge meshes or remove mixers. Player does not opt in.
6. **Are mixers updated more often than necessary?** NPCs always update while resident/alive, even concealed; this is a strong candidate for avoidable presentation CPU, not a proven bottleneck. Ordinary animals already throttle; important/mounted ones intentionally do not. Any further reduction needs phase/reveal/action validation.
7. **Are draw calls/materials/shadows controlled?** Shared geometry/textures/program reuse and 36 m actor shadow gates help. Multipart bodies/head/hair/garments still multiply native submissions; no actor mesh merge or skinned instancing is present. Current optional-part LOD provides little control for kits. Runtime counts/cost remain unknown.
8. **Can settlement streaming cause creation/upload bursts?** Yes by mechanism: concurrent batch completion plus synchronous assembly/bounds and immediate attachment; first draw can defer palette/new-variant uploads. Actual hitch size and whether CPU, uploads or shader first-use dominates require capture.
9. **Are resources correctly shared/retained/disposed?** Mostly explicit: intentional URL cache lifetime, independent actor rigs and shared immutable GPU assets; ordinary NPC/wild/livestock teardown reaches skeleton disposal. Player successful swaps and terminal detached teardown are exceptions. No permanent unbounded memory leak was established.
10. **Strongest plausible bottlenecks and measurement needs?** Actor initialization/bounds/GC bursts; hidden NPC mixer/label CPU; multipart main/shadow draw submission; visible skin/morph vertex work; per-actor palettes and accumulated variant cache residency. Each needs separate attribution, not an FPS inference from actor count.

## 6. Skeleton and animation assessment

`actorSkeletonSharing.ts` chooses the actor's largest suitable canonical palette, checks actual weighted Bone identity, valid matrices and inverse-bind compatibility up to a constant right factor (tolerance `1e-5`). It remaps skin indices only where exact equivalence can be shown; cached remapped geometries share other attributes/index/morph streams. Incompatible cases retain their own skeleton. Calls occur **after per-actor cloning/assembly**, so there is no cross-actor pose contamination. Independent mixer/Bone objects are preserved; recoloring and morph influences remain instance-local.

Current real-asset tests cover the shipped supported outfit/sex set at default build and head/hair combinations. Male kits retain **two** palettes because the male head is not exactly compatible; female kits use one. Multipart fauna use one. Tests also check unchanged source indices/inverse binds, independent actors, remapped-geometry reuse, clone parity, bounds/picking parity and palette disposal. Fauna parity samples the first four clips per asset, not every fauna clip/pose.

This is the later, broad Q20 actor-local optimization, **not** the earlier body-only experiment that was reverted. Historical WSL results are evidence of that experiment only, not current Windows performance acceptance.

Cost separation:

- **Mixer CPU:** evaluates each actor's own active tracks/blends and updates Bone/local properties. Shared immutable clips do not make one mixer evaluation serve all actors.
- **Palette CPU/upload:** installed Three `WebGLObjects.update` keys skeleton work by Skeleton and `info.render.frame`, so compatible meshes using one skeleton do not each need a separate `skeleton.update` in that renderer frame. Bone textures are created lazily on actual use. Separate renderer invocations/passes and first use still need careful attribution.
- **Skinning/morph GPU:** vertices in each submitted mesh/pass still execute vertex deformation. Fewer palettes do not reduce those vertices or native draw calls.
- **Creation:** SkeletonUtils clone, repeated pack-scene clones, rebinding, action setup and exact CPU box scans are separate from steady animation.

Rebound head/hair/garment meshes use body Bones and do not create a second mixer. Skeleton compatibility does not preserve morph metadata automatically; S3B-3 is an independent assembly defect. Missing bones warn and retain a source bone rather than proving a new arbitrary asset compatible; current tested kits have no warnings, but that fallback must not become approval of future armor/rigs. Player accessories likewise need compatibility tests before opting into canonical sharing. No global pose-sharing, mixer pooling or baked-crowd renderer is justified by the current evidence.

## 7. Draw calls and GPU resource analysis

Actors use ordinary Mesh/SkinnedMesh parts, not InstancedMesh/BatchedMesh for the independently animated body. Native submission scales approximately as the sum of submitted primitive/material groups over actors and participating passes; labels/sprites/tools add separate work. One actor is not one draw. Shared Material/Texture identity improves reuse but does not automatically combine objects; cloned tint materials may share programs, so material count is not program count.

A small **GLB-JSON topology/material census**, not a rendered draw census, found:

| Input asset | Primitives in file | Material alpha / sidedness sampled |
| --- | ---: | --- |
| Male Peasant / Female Peasant | 5 / 4 | OPAQUE, double-sided |
| Male Blacksmith | 6 | OPAQUE, double-sided |
| hair.glb / eq/Female.glb | 7 / 17 across their packs | OPAQUE, double-sided; only selected nodes are attached, not the entire pack |
| wolf.glb / horse.glb | 4 / 8 | OPAQUE; wolf double-sided, horse single-sided |

Bodies precede separate head/hair/garment/equipment additions. These counts do not represent every role, a final assembled actor's calls or runtime visibility. The sampled hair is not transparent-blend hair; do not assume transparency sorting explains its cost. Other equipment/assets need their own census. Labels and last-known contact sprites have different transparency/DOM behavior. Double-sided materials can increase raster/shadow cost; reducing that is a visual-correctness decision, not an automatic optimization.

NPC/fauna `*_SHADOW_DISTANCE` is 36 m, applied through cached label-distance state and subtree cast flags. Animal presentation cadence can delay crossing updates briefly; off-camera casters inside the light volume are not equivalent to main-view actors. Render-layer/mirror participation was already addressed in Session 1; do not multiply every actor by every global pass or re-open the global shadow architecture here.

Analytical resource distinctions, **not measured GPU bytes**:

- Geometry/texture payloads are largely URL/template shared. N clones do not imply N copies of every vertex/texture buffer.
- Skeleton matrix data is conceptually 16 Float32 values per bone (64 bytes/bone); actual texture dimensions, packing, uploads and driver allocation are separate. Actor-local sharing reduces unique palettes, not resident Bone/mixer state across actors.
- Remapped geometry adds a skin-index attribute and geometry wrapper for each cached mapping; most other attributes are shared. Geometry-keyed morph texture packing may still differ between wrappers. Count unique resources rather than summing references.
- Mutable outfit/hair tint materials are cloned; their textures normally remain shared. Appearance derivatives under `body-preview/` occupy distinct URL cache entries and can retain duplicate base/morph/embedded-texture data across variants.
- Morph targets do not inherently add triangles or meshes, but do add decode/storage/upload and vertex work, plus relevant shader variants. Zero influence does not prove zero allocated morph storage.

D11's bounded compatible Peasant merge remains a credible **experiment**, not an implemented optimization. Merge only within actual material/rig/morph compatibility; retaining material groups still retains draws. A rigid held tool or repeated attachment is a different instancing candidate from a customized skinned body.

## 8. Lifecycle, memory and recent model integration

| Resource / retained reference | Current assessment |
| --- | --- |
| `loadGltf` URL→Promise→template/clip graph | Intentional application/module lifetime; reused through actor and WorldBundle destruction. No automatic per-world cache teardown or size-budget guarantee established. Finite encountered URL variants form a high-water set; not by itself a leak. |
| Actor Bones/skeletons/mixer/actions | Per actor. Normal `disposeObject3D` reaches palettes even when geometry/materials are shared. Shared palette disposal is idempotent; current tests observe one texture-dispose event. Missing retirement paths: S3B-4/S3B-5. |
| Remap WeakMap | Values are cached under source geometry; source geometries remain reachable from the template cache. Expected reuse of mappings, not a proven retained actor/Bone graph. |
| Tint materials / textures | Cloned mutable materials retired on ordinary visual cleanup; shared texture lifetime belongs to caches. Material.dispose alone does not mean the texture cache was retired. Do not dispose shared maps during one actor removal. |
| Scene, labels, callbacks | Normal owners remove roots and label DOM, stop actions and invalidate async generations. Player finished listener is removed/rebound. `playerSight` clears touched actors each update and periodically prunes ID caches; billboards pool to high-water size until world disposal. No unbounded callback/manager actor-retention path established. |
| Construction failure / obsolete residency | All-settled actor collection makes late successes rollback-owned; manager entry guards discard obsolete successful factories. Early scene attachment remains S3B-2's lifecycle/performance risk, not a claim that rollback is absent. |
| Authoritative state / world rebuild | NPC/animal registries are deliberately retained/snapshotted independently of scene objects. Their persistence is not a graphics leak. Complete offscreen/identity correctness is outside this review. |

**Recent work actually present:** current kit roles include authored Farmer/Woodcutter/Blacksmith, female coercion for unavailable male-only outfits, WorkSkirt dyes and female trader NobleBodice. Head/hair/beard and tint choices derive from stable IDs; named looks override selected fields. Current code now rolls muscular/slim/heavy builds (60/20/20 weights) and loads morph-carrying body/equipment derivatives for non-base builds. The older tools-022 preview-only text is historical; its later notes and current `npcAppearance`/`characterFiles`/`assembleCharacter` establish the live rollout.

Production `rebindAllSkinned` preserves geometry/rig binding but **does not preserve named morph dictionaries/influences** (S3B-3), unlike the preview rebinder. Build application occurs after attachment, before NPC bounds installation, so body and garment morph states can already diverge at that boundary. Existing bounds tests include male/female Peasant, authored male Farmer/Woodcutter/Blacksmith and a legacy rig, through representative movement/work/attack/death clips. The sharing suite covers more default-build outfits/head/hair combinations. Neither is an exhaustive **nonzero Heavy/Slim × profession × garments × pose** envelope/independence proof; on-disk morph-presence and unit influence tests do not fill that gap.

Children still use scaled adult presentation, not a shipped child-proportion rig. Body/armor equipment selection and per-slot accessory lifecycle exist, but the full items-player-037 modular wardrobe draft must not be described as delivered. Skirts and profession parts add compatibility/primitive/morph/cache costs; no full garment-quality verdict or new outfit simplification is authorized.

## 9. Architectural alternatives and trade-offs

| Option | Benefit / cost boundary | Constraints / recommendation |
| --- | --- | --- |
| Extend existing bound/disposal owners | Repairs correctness/lifetime without changing simulation or art population. Cached template envelopes can avoid repeated vertex scans. | First validate per-species/morph/attachment support and retain fail-open behavior; no parallel bounds framework. |
| Presentation-only cadence / label dirty work | Can reduce hidden/distant CPU while keeping authoritative simulation intact. | Reveal/phase, one-shots, interaction and shadow continuity need explicit tests. Extend current owners/animal cadence seam, not a global simulation scheduler. |
| Compatible actor-local mesh/material merge | Can reduce native submissions while preserving independent per-actor animation and customization. | D11 bounded experiment only; requires correct inverse binds, transforms, morphs, normals, material grouping and disposal. May increase cached variant geometry. Do not merge incompatible palettes by force. |
| Rigid attachments instancing | Useful for many repeated unskinned items when transforms/ownership/selection are explicit. | Bone-following, per-actor interaction, materials and lifecycle may outweigh a few saved calls. Measure the real cohort first. |
| Cross-actor skinned instancing / baked animation | Potential draw reduction for a proven large homogeneous crowd workload. | Per-instance pose palettes, morphs, clothing, attachments, transitions and selection need custom shaders/data/lifecycle; significant maintenance in vanilla WebGL2. Not the first response to the demonstrated local defects. |
| Far actor proxy / disappearance | Could reduce submitted geometry but changes silhouette/recognition/interaction representation. | D10 remains unapproved. Never erase authoritative actors, cut population/simulation or silently reduce visual richness to manufacture a performance win. |

Keep vanilla Three.js/WebGL2, deterministic autonomy, independent animation and stable IDs. Correct ownership/retirement and bounded existing publication are better supported than replacing the renderer or adding a crowd framework now.

## 10. Checks performed and measurements still required

### Bounded checks actually performed

1. `git` snapshot/history/diff inspection, current imports/call sites and installed Three.js 0.185.1 source. No runtime FPS inference from historical reports.
2. CPU-only command:

   ```text
   pnpm exec vitest run src/render/actorSkeletonSharing.assets.test.ts src/render/actorCullBounds.assets.test.ts src/render/agentPresentationLod.test.ts src/render/agentPresentationVisibility.test.ts --reporter=dot
   ```

   **4 files / 80 tests passed**, exit 0. Materials are substituted in the asset fixtures; this verifies skinning/bounds/control contracts, not rendering appearance or performance.
3. Additional focused command:

   ```text
   pnpm exec vitest run src/player/PlayerController.appearance.test.ts src/fauna/animalUpdateCadence.test.ts src/characters/bodyBuild.test.ts src/characters/characterAssets.onDisk.test.ts --reporter=dot
   ```

   **3 files / 29 tests passed, but the command exited 1**: the player appearance suite's jsdom worker could not start because installed jsdom could not resolve `is-potential-custom-element-name`. Player appearance tests were read, **not successfully run**. No dependency/configuration repair or alternate environment was attempted. Do not report all eight requested suites as green.
4. Small stdin Node/tsx CPU probes, no repository test/source files added: shipped fauna animated-bound counterexamples (S3B-1), real production garment/build assembly (S3B-3), the real player replacement method with disposal listener (S3B-4), and seven GLB-JSON material/topology inputs (§7). The GLB parser retained real geometry/rig/animation data while stripping rendering materials/textures for CPU loading. No scene benchmark, GL context, uploads or GPU measurements occurred.
5. Documentation checks: explicit three-file scope, `git diff --check`, report section/link checks and final repository status before/after commit. See the documentation commit for this report; no application implementation is included.

### Required follow-up evidence, separately authorized

Use reference seed **415424794**, exact SHA, variant/cohort counts, camera path, resolution/DPR, quality, flags and backend. Keep native Windows/Intel Arc and WSL/Mesa datasets separate. Prefer existing agent CPU diagnostics, scene census and renderer counters; do not create another profiling framework by default.

| Cost / correctness boundary | Required evidence |
| --- | --- |
| Animation CPU | Actual mixer-update count, active tracks, label writes and presentation timing for equal resident populations: visible / behind camera / eye-concealed; separate simulation categories. |
| Palette CPU / uploads | Unique submitted Skeleton count, palette update/texture upload events per renderer invocation; cold first draw versus warm steady state. Compare sharing on/off only with matched appearance/pose. |
| Skinning / morph GPU | Submitted vertices/triangles, morph-active variants and measured GPU duration for matched actor/main/shadow workloads. No assumption that fewer palettes mean less vertex work. |
| Draw/material/shadow cost | Final assembled role/sex/build/gear census; calls, primitives, material states and actual participating passes. Separate double-sided raster cost, alpha behavior, labels and attachments. |
| Creation / publication | Request→asset-ready→clone→rebind→tint→bounds→label/actions→attach→accept→first-use timeline, per-frame actor counts and allocation/GC; warm/cold dense settlement entry, turn, teleport and reversal. |
| Memory / lifetime | Repeated successful player swaps, detached transfer/rebuild and settlement stream cycles after caches warm. Compare reachable JS graphs, unique arrays/geometries/materials/textures/palettes and native allocation/deletion settling. Renderer counts are not GPU bytes. |
| Bounds / visual continuity | Actual camera/light edge images plus real-asset CPU containment across all fauna and nonzero body-build/profession/garment poses; mounts, combat, interaction, rapid reveal and settled corpses. |
| Authority / async safety | State/ID snapshots across presentation changes, delayed/stale loads, rollback and host transfers; no equipment/stat/death/quest changes from render LOD. Re-run the currently blocked player suite once the existing dependency installation is repaired under separate scope. |

A first-use frame may have shared geometry already resident yet allocate a new palette; a new derivative may require geometry/morph/texture work; a program may already exist despite a new material UUID. Measure those separately. Session 1's render-timer scope and Session 2's publication/upload distinctions still apply.

## 11. Cross-system risks and validity boundaries

- **16 ↔ 17:** assembly, palettes, morphs, wardrobe component count and player visual retirement overlap model/animation/outfit lifecycle. This is a bounded system-16 presentation review with limited system-17 evidence, **not full system-17 coverage or wardrobe acceptance**.
- **16 ↔ 06:** incremental actor publication must retain all-settled rollback and current-entry checks, and distinguish speculative scene roots from accepted live residency. S3B-2 does not certify the entire settlements-023 lifecycle.
- **16 ↔ 11/12:** the same AnimalAgent carries wild/domestic/mounted presentation, so bounds/retirement corrections must cover all owners. Behavior/catch-up and review 035's unresolved identity defects remain separate.
- **16 ↔ 15:** caches surviving rebuild are intentional, while per-actor palettes/materials require explicit retirement. Do not purge immutable cache textures from one actor or dispose shared state registries to reduce a graphics counter.
- **16 ↔ 07/13/20:** animation cadence is not authoritative action/health/combat scheduling. Any implementation that makes gameplay depend on camera visibility would violate the architecture, not solve S3B-6.
- **16 ↔ 27:** attribution must separate clone/bounds work, label/animation CPU, renderer submission, palette uploads and GPU skinning; counts alone cannot select the bottleneck.

## 12. Recommendations requiring author approval

This review authorizes **documentation only**. Suggested priorities for separately approved work:

1. Correct animal animated bounds and runtime named-morph rebinding through the existing owners, with real-asset containment/build-synchronization checks; fix the two deterministic retirement omissions without evicting shared assets.
2. Attribute actor construction/first-use work, then decide a bounded settlement-owned visual publication approach. Preserve simulation/identity, interactions and rollback during partial preparation.
3. Measure hidden NPC presentation before changing mixer cadence; consider label dirty work independently. Validate reveal/phase and active gameplay continuity.
4. Treat current-kit optional-detail coverage and D11-compatible merging as controlled alternatives, with matched author-reviewed images and performance evidence. Do not silently authorize hair/gear removal, all-actor instancing, D10 proxies, population cuts or a new global scheduler.
5. Verify nonzero Heavy/Slim/profession/garment combinations and repair/rerun the blocked player-test environment under its own scope. No wardrobe rollout/child-rig/armor-plan decision is made here.

## 13. Compact continuation handoff

**Completed:** bounded Session 3 architecture/ownership review of A–F; all ten questions answered. **Source:** `7c6ea3c47d7ebc3be7ea5e84275fd50524d90bfb`. **Findings:** no Critical; High **S3B-1** nonconservative animal animated bounds, **S3B-2** unbudgeted actor construction/publication and **S3B-3** lost garment build-morph names; Medium S3B-4/S3B-5 retirement omissions, S3B-6 hidden NPC presentation cost hypothesis and S3B-7 legacy optional-LOD coverage gap. Existing findings are identified as revalidated where appropriate.

**Report:** `docs/reviews/2026-11-06--039--actor-rendering-lod-memory-session-3-evidence-supplement.md`. **Documentation SHA:** obtain with `git log -1 --format=%H -- <report path>`; it is deliberately separate from the reviewed source SHA.

**Not accepted/unreviewed exhaustively:** current native/WSL GPU timings or memory retention, real-camera fauna clipping frequency, full build/garment/clip visual matrix, application-wide cache retirement and broad simulation/loop performance. Four CPU suites passed; three additional suites passed within a command that failed to start the player/jsdom suite. No code fix or performance acceptance is implied.

**Recommended Session 4, only when separately commissioned:** full game-loop and presentation/simulation timing boundaries; global resident/offscreen NPC/fauna scheduling; worker scheduling and simulation batching; economy/offscreen world cost and authoritative time/catch-up invariants. Begin from a fresh SHA/diff and use this report's cost separation; do not reopen Sessions 1–3 merely to grow finding counts. Runtime/GPU actor validation remains a separately authorized evidence task, not an automatically started benchmark. System 16 stays **partial**; system 17 has cross-reference only.
