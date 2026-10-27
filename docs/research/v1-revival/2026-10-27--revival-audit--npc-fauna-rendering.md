# Revival audit — NPC / fauna rendering (Track A)

**Created:** 2026-10-27 by Claude Opus 5.5 (subagent, one of five parallel specialist auditors)<br>
**Status:** research — not approved scope; **PENDING BASELINE**<br>
**V1 pin (authoritative):** `c460b224` (clean `main`)<br>
**V3 donor pin:** `907e17cd` (`/home/madeyskij/projects/private/seedvale`); V2 = `legacy/SeedVales/` inside that checkout<br>
**Extends, does not replace:** [Track A deep recon §10](./2026-10-26--v1-performance-transfer-v2-v3-recon.md#10-track-a-deep-recon--npc-and-fauna-rendering-2026-10-27) (done at `a23ecfd9`). Owners stay `world-terrain-050` (render) and `npc-063` (CPU attribution); `npc-064` is the spatial seam. No new plan ID is proposed.<br>
**Method:** targeted source reads at the pins, Three `0.185.1` package source, GLB JSON-chunk inspection of `public/assets/characters/*`, and the diagnostic smoke `docs/performance/results/2026-10-27--032--benchmark-settlement-heavy.*`. No runtime change, no test or benchmark run.

**Evidence labels:** **[code]** read at pin · **[doc]** repository document · **[measured-diagnostic]** from smoke 032 (not an acceptance baseline) · **[hypothesis]** inference that still needs measurement.

> Smoke 032 caveats: 15 s, 109 frames, one rep. It was captured at `e124e866`, which is **before** the runbook's minimum instrument SHA `94a74470` (main/shadow residual fix). It has no GPU timer (`available=false`) and one unattributed 8.49 s frame. Read it for its shape only. No number in it is a baseline.

---

## 1. Verified state (delta vs §10)

### 1.1 What changed in the NPC/fauna render area since `a23ecfd9`

27 commits, but only these touch Track A runtime owners **[code]** (`git diff a23ecfd9..c460b224`):

| Change | Track A effect |
| --- | --- |
| `assembleCharacter.ts::applyClothTint` now tags cloned materials `sharedGpu=false`, `ubcOutfitMaterial=true`, `defaultMap` (review 026) | Disposal/tint bookkeeping only. Per-NPC material cloning (and so per-NPC material count) is unchanged. |
| `ubcOutfitMaterials.ts::applyOutfitTint(…, isCurrent)` + idempotent clone guard | Fixes a stale-load race on the player path. NPCs don't call `applyOutfitTint`. |
| `gameLoop.ts` + new `src/perf/passSubmissionCollector.ts` (P0) | **§10.7 A0a's deliverable now exists**: opt-in actual submissions per pass (mirror/shadow/main), with `npcFamily:*` / `faunaFamily:*` buckets and a residual. Disabled by default. |
| `NpcAgent.spatialLifecycle.test.ts` (npc-064 Stage 0B, tests only) | No runtime change. The npc-064 refactor is still unimplemented (plan status `draft`). |
| npc-062 (`planned`), items-player-037 / V3 equipment catalogue (`src/items/v3Equipment/*`) | Data/compatibility only. No mesh, slot-visual or assembler change for NPCs. |

### 1.2 §10 claims: which still hold

| §10 claim | Status at `c460b224` | Evidence |
| --- | --- | --- |
| Rebound kit meshes (head/hair/garments) set `frustumCulled=false` | **Holds** | [code] `assembleCharacter.ts:73` |
| Optional-node LOD registers only the legacy `ubcHairAttachment`/`ubcBeardAttachment`; kit NPCs register nothing | **Holds**. In practice LOD is inert for every kit NPC | [code] `NpcAgent.ts:1915-1922`; the kit's hair nodes are named `HAIR_*` (GLB JSON) |
| `anim.update(dt)` runs every living tick and in the dead settle window. There's no mixer cadence | **Holds** | [code] `NpcAgent.ts:3766`, `:3118`; `shared/agentAnimationSet.ts:135` |
| No mixer-only CPU span (A0b) | **Holds**. Still missing | [code] `perf/agentCpuDiag.ts` has no mixer/label span; [doc] readiness audit lists it as P1 |
| 36 m distance shadows for NPC and fauna; agents excluded from the mirror via layer 2 | **Holds, now measured** | [code] `NPC_SHADOW_DISTANCE=36` (`NpcAgent.ts:510`), `FAUNA_SHADOW_DISTANCE=36` (`AnimalAgent.ts:410`); [measured-diagnostic] mirror NPC/fauna submissions = 0 |
| Corpse loot and expiry read `mesh.visible`; concealment writes it | **Holds** | [code] `NpcAgent.ts:2233-2239, 2260-2265` |
| Fauna has a presentation/behaviour cadence | **Holds, now measured** | [measured-diagnostic] livestock: 51.0 reduced vs 0.8 full-rate agents/frame |
| "Trial native skinned culling" (§10.4/A1), framed as if absent | **Corrected**. Native culling is **already on** for body GLB meshes and all fauna meshes, but with an *uninflated sphere taken from the pose at the first test*. Only the rebound meshes are uncullable. | [code] default `frustumCulled=true`; three `math/Frustum.js:146-152` computes `SkinnedMesh.boundingSphere` lazily once, using the current bone transforms. [measured-diagnostic] main NPC 352 actual vs 520 census; fauna 103 vs 399 |
| "A0a: build bounded actual-pass capture" | **Done as P0** (shared with B0) | [code] `passSubmissionCollector.ts`; [doc] readiness audit status "P0 implemented" |

### 1.3 New verified facts (gaps §10 did not cover)

**Why ~10 draws per NPC.** [code + GLB JSON] The kit is not merged. Each glTF mesh node becomes its own `SkinnedMesh`, and each multi-primitive node becomes several meshes:

| Part (male examples) | Mesh nodes / primitives | Culled? |
| --- | --- | --- |
| Body `Male_Peasant.glb` | 4 / 5 (Arms, Body, Feet, Legs; 2 materials) | yes (lazy sphere) |
| Body `Male_Wizard.glb` / `Male_Blacksmith.glb` | 6 / 7 · 5 / 6 | yes |
| Head `Male_Head*.glb` | 3 (SuperHero head, Eyes, Eyebrows) | **no** |
| Hair `hair.glb` node(s) | 0–1 hair + 0–1 beard | **no** |
| `eq/Female.glb` `PeasantSkirt` (female base garment) | 0–1 | **no** |

Census: Peasant has 218 meshes over 24 agents (9.1 each); the whole NPC population has 520 over 53 (9.8). That matches the table [measured-diagnostic].

**One skeleton per mesh, ≈10 per NPC.** [code] `rebindAllSkinned` builds `new Skeleton(newBones, src.skeleton.boneInverses)` for every rebound mesh. Body skins are separate per node: `Male_Peasant.glb` has 4 skins with distinct IBM accessors, 65 joints each. `loadGltf` uses `SkeletonUtils.clone`, which clones one skeleton per mesh. Three r185 runs `skeleton.update()` once per frame for each submitted skeleton (65 mat4 multiplies) and flags `boneTexture.needsUpdate` (`WebGLObjects.js:46-55`, `Skeleton.js:204-221`). Every submitted actor mesh therefore costs one bone-texture upload per frame. Separate IBM accessors per part mean you can't share one skeleton without re-baking geometry. V3 does that re-bake (§2).

**Uncullable rebound meshes probably dominate NPC main submissions.** [hypothesis, consistent with measured-diagnostic] There are ≈4–5 rebound meshes per NPC × 53 ≈ 240 main submissions regardless of camera. That leaves ≈110 culled-in body submissions ≈ 22 agents × 5, which agrees with the census's 20 root-point camera-relevant agents. Off-screen and far NPCs therefore still pay for heads, eyes, eyebrows, hair and skirts in draws, skeleton updates and bone uploads.

**Actor draws look disproportionately expensive.** [measured-diagnostic, isolation probes]

- `hide-npc-fauna`: render 27.6 → 17.8 ms (−9.9 ms), −507 draws.
- `hide-settlement`: −3.3 ms, −887 draws.
- That is ≈19 µs per actor draw vs ≈4 µs per settlement draw. September's historical isolation showed the same shape: 23.3 → 14.4 ms, −38% [doc `performance/README.md:142`].
- With no GPU timer, the split between skinning vertex work (GPU), skeleton/bone-upload work (CPU/driver) and per-NPC unique material state can't be determined. **CPU vs GPU attribution is open.**

**Bounds are fragile (correctness risk, not a cost).** [code] A body/fauna `SkinnedMesh.boundingSphere` is computed once, at the first frustum test after spawn, from the pose at that moment, and is never inflated or refreshed. Poses well outside that envelope can clip at screen edges: sleep, death, attack reach, mounted. The first test also loops over all vertices with the bone transform on the render thread. That is a small materialization-time cost [hypothesis].

**Distance distribution.** [measured-diagnostic] 49 of 53 NPCs and 88 of 91 fauna sit in the Far band (>36 m from the observer), with no Near agents. Far NPCs keep full detail (≈10 draws, full mixer) because the LOD adapter is inert for kit NPCs.

**Shadow and mirror.** [measured-diagnostic] Shadow refreshed on 101 of 109 frames. On refresh frames NPC submissions were 32 and fauna 10, which fits the 4 Mid-band agents and the 36 m caster gate. Mirror actor submissions were 0. On this capture, shadow and mirror passes aren't where actor cost sits; the main pass is.

**Main-pass share.** [measured-diagnostic] NPC 352 + fauna 103 = 455 of 1596 main calls (28.5%). NPC main triangles were 375k of 2.03M.

**CPU side.** [measured-diagnostic] The reported "NPC agent updates 83.1 ms/frame" is dominated by one 8.49 s frame (NPC 8432 ms in that frame). Without it, cumulative (9059.5 − 8432.2)/108 ≈ **5.8 ms/frame**. September recorded 4.7 ms [doc]. Mixer share is unknown (no A0b). The 8.49 s frame is unattributed and could be materialization or first-frame work. **Do not attribute it to rendering.**

**Spawn path.** [code] `assembleCharacter` calls `loadGltf` (a full clone) on all of `hair.glb` (6 skinned meshes) and on `eq/<sex>.glb` (13 meshes), only to rebind 1–2 named nodes. The other clones and skeletons become garbage on every materialization. This is a possible stream-in hitch/GC contributor [hypothesis]. Per-NPC material clones (cloth/hair tint, `cloneOutfitMaterials`) also make every NPC's materials unique.

**Fauna.** [code/measured-diagnostic] No explicit cull settings: default culling with lazy spheres. Horse ≈8, dog ≈5.6, sheep 2 draws/agent; chicken, duck and rooster aren't skinned. Fauna main submissions (103) are already about 26% of census, so culling works there. The remaining risk is bounds correctness, not draw volume.

---

## 2. Reusable V1 / V2 / V3 solutions (what is actually implemented)

| Source | Implemented mechanism | Reuse verdict |
| --- | --- | --- |
| **V1** `agentPresentationLod.ts` + `agentPresentationVisibility.ts` | Near/Mid/Far 18/36 m, `important` override, cached optional-node adapter | **Reuse directly.** Registering kit nodes is a small change. No new LOD system is needed. |
| **V1** `agentStatusLabel` → `setSubtreeCastShadow` | Single owner of distance caster transitions | Reuse for any shadow-detail change (A4). Keep a single writer. |
| **V1** `animalUpdateCadence.ts` | Fauna presentation/behaviour cadence | Pattern reference for the NPC mixer cadence. Don't share its table blindly. |
| **V1** `passSubmissionCollector`, `sceneCensus.censusAgentDetail`, isolation probes | Actual per-pass family attribution | Decision instrument for every stage below. |
| **V3** `playerBodyView.ts:81-99 enableCulling` | After assembly: `updateMatrixWorld`, `skeleton.update`, `computeBoundingSphere`, radius `r*1.5+0.5`, `frustumCulled=true` per skinned mesh; NPC opt-in `frustumCull:true` (`:230`) | **Reuse the recipe** (≈15 lines) for all V1 actor skinned meshes, including rebound ones. Check the factors against V1 clips; don't copy them blindly. |
| **V3** `characterKit.ts` (render--004 B2) | Same Quaternius kit. Merges primitives per base-colour texture onto **one skeleton**, rebinding by joint name with an IBM deviation check (`:540-637`). Tests: Peasant **5 groups** (`characterKit.test.ts:521-523`), worst female swap **≤7 draws, ≤17.5k tris** (`:619-664`). | **Strongest structural donor.** It would cut V1 Peasant from ≈9 draws/≈9 skeletons to 5/1. Costs: it converts materials to Lambert (a visual change that conflicts with V1 MeshStandard + npc-062), a template/instance ownership change, and assembly-time CPU. Port the **math** (join, re-bake, merge), not V3's template/instance lifecycle. |
| **V3** `sceneSession.ts:2058-2080 frameNpcBody` | Hides beyond 150 m and passes `dt=0`. Per-NPC shadow-caster revision feeds the shadow budget. | Distance hide relies on V3's registry-pose simulation, so it's **not** transferable to V1 actor lifetime (corpse `mesh.visible` coupling). The caster-revision idea belongs to the shadow scheduler (Track B/shadow owner), not Track A first slices. |
| **V2** `legacy/SeedVales/src/game/render/actors.ts` | Root `visible` per-actor sphere cull (`:653`); offscreen skips the mixer; merged one-draw procedural placeholders beyond 320 m (`:40, :76-129`); skinned meshes `frustumCulled=false` | Root culling: **rejected** (main-only, kills shadows, collides with corpse visibility). Placeholders: the only *actor impostor-like* trick in either donor. Blocked on a V1 lifecycle/proxy contract (npc-064 4A/4B). |
| Actor impostors / instanced crowds / VAT | **Not found** in V2 or V3 (search finds only tree impostors) | Nothing to port. A new invention would be a new system; out of scope. |

---

## 3. Problems and risks

1. **Uncullable rebound meshes** (≈240 main submissions, 53-NPC scene). These are pure waste for off-screen NPCs [hypothesis/measured-diagnostic].
2. **Per-mesh skeletons** multiply CPU skeleton updates and bone-texture uploads ≈10× per NPC [code]. Culling helps only for actors that are off-screen.
3. **Fragile lazy bounds** on body and fauna meshes. Possible popping today; any LOD/cull change could make it visible [code/hypothesis].
4. **LOD inert for kit NPCs.** 49 Far NPCs render eyes and eyebrows (sub-pixel at >36 m) at full cost [code/measured-diagnostic].
5. **Measurement debt.**
   - No GPU timer on Arc in smoke 032.
   - Smoke 032 is below the instrument minimum SHA.
   - The 8.49 s unattributed NPC frame.
   - No mixer-only span.
   - The camera-relevant census metric is a root point, not an envelope.
6. **Lifecycle coupling.** `mesh.visible` is gameplay-relevant for NPC corpses. Fauna corpse hiding writes descendant and material visibility. A culling helper must never write `visible`.
7. **Ordering hazard.** Crowd separation runs after the agent update, so final pose is known only after the manager loop. Bounds must cover that displacement, which matters for the sphere radius pad. Per-mesh native culling reads `matrixWorld` at render time, so it is safe [code §10.2].
8. **Equipment track multiplication** (§4.4). Any per-slot armor mesh added through the current rebind path costs +1 draw, +1 skeleton and +1–2 material clones per slot per NPC, and is uncullable.
9. **Spawn churn.** Whole-GLB clones discarded per NPC [hypothesis; needs materialization timing].
10. **Concurrent writers.** `NpcAgent.ts` is shared with npc-064 stages, and `assembleCharacter.ts` with player equipment work. Serialize.

---

## 4. Recommended architecture, alternatives, trade-offs

### 4.1 Recommended: four presentation-only layers, each inside an existing owner

1. **Bounds layer (world-terrain-050).** Add one pure helper, e.g. `src/render/actorCullBounds.ts::installActorCullBounds(root)`. It is called once after final assembly or normalization at NPC kit, legacy, capsule (no-op), wild-fauna `wrapModel` and livestock clone points, and again after any re-assembly (appearance change, hydration). It:
   - computes each skinned sphere from a conservative pose (bind pose + inflation, per V3);
   - sets `frustumCulled=true`, including on rebound meshes;
   - writes only `boundingSphere`/`frustumCulled`, **never** `visible`.
   Unknown family or failure leaves things as they are, i.e. drawn ("fail open"). There's no registry and no per-frame work. Main and shadow frusta keep using native tests, so off-camera casters within 36 m still cast.
2. **Detail-LOD layer (world-terrain-050).** Register kit nodes that are visually negligible at Far (`Eyes`, `Eyebrows`, perhaps the beard) in the existing `AgentPresentationVisibility`, with the `important` override. Hair, head, skirt and outfit stay; they are silhouette and identity.
3. **CPU cadence layer (npc-063, after A0b).** Distance-bounded ordinary-loop mixer cadence, per §10.5, unchanged.
4. **Structural layer (conditional, world-terrain-050).** Port V3 CharacterKit's join/re-bake/merge math into V1 `assembleCharacter`: one shared skeleton per actor and per-texture merged groups, keeping V1 material classes. Do this only if layers 1–2 leave measured per-draw or per-skeleton actor cost.

### 4.2 Alternatives considered

| Alternative | Trade-off | Verdict |
| --- | --- | --- |
| Whole-actor root `visible` cull (V2) | Removes main **and** shadow; collides with corpse/loot `mesh.visible` | Reject, as in §10 |
| Per-frame exact skinned bounds (`Box3.setFromObject`/vertex loop) | Correct, but the CPU cost can erase the win | Reject |
| Distance hide + `dt=0` (V3 150 m) | Simple, but V1 actors are gameplay objects | Reject for V1 |
| Far procedural one-draw placeholder (V2) | Big draw cut at distance; needs a proxy lifetime and a pop policy | Defer; blocked on the npc-064 4A/4B lifecycle contract plus an author visual decision |
| Shared skeleton without merge | Saves skeleton/bone uploads, not draws; still needs the IBM re-bake | Possible as step 1 of layer 4; same risk class as the merge |
| Full V3 CharacterKit port (templates, Lambert, instance class) | Largest reduction; visual and ownership change, conflicts with npc-062 | Reject as a single port; harvest the math only |
| GPU instancing / VAT crowds | No donor implementation; new system | Out of scope |

### 4.3 Invariants this design keeps (V1 CLAUDE.md)

- Simulation keeps no camera input. Every layer is presentation only.
- Identity stays tied to agent/state IDs, never to mesh objects.
- Bounds are re-installed with each runtime rebuild, as a property of the runtime projection only.
- Time-skip and hydration are unaffected.
- No second visibility authority or per-frame allocation.

### 4.4 Equipment-track contract implications (future NPC/player armor visuals)

Current paths:
- NPC `rebindAllSkinned`: own `Skeleton`, `frustumCulled=false`.
- Player `ubcAccessoryBind.ts:55-76 bindAccessoryToPlayerSkeleton`: own `Skeleton`, default lazy culling.

Every equipped slot therefore adds ≥1 draw (more for multi-material) and 1 skeleton/bone upload per actor per frame in the main pass, plus the shadow pass within 36 m. Garment meshes in `eq/Male.glb` already span 8 materials (`MI_Knight`, `MI_Ranger`, `SV_*`), so per-texture merging can't fold them all into one group. Before NPC armor visuals ship, the equipment track should accept this visual contract (proposal, not scope):

1. Slot visuals **bind to the actor's single canonical skeleton**, with no new `Skeleton` per mesh, once layer 4 exists. Until then, cap the number of slot meshes per NPC.
2. Each visual declares a **merge key** (texture/material family), so compatible slots can join body groups.
3. Each visual declares an **identity-critical** flag (LOD-exempt, e.g. guard helmet) versus **detail** (Far-hideable).
4. Each visual declares **coverage**: which body meshes it hides, which lets occluded body parts drop. V3 has related skirt-occlusion diagnostics.
5. Each visual contributes to actor cull bounds through the same helper, never `frustumCulled=false`.
6. Visuals are a projection of equipment state (no render-side authority) and are re-installed on rebuild.
7. Every new slot asset family is checked against the per-NPC draw budget in `passSubmissions.main.byBucket`.

---

## 5. Conditional stages (Cursor-sized; one concern, one reversible commit each)

Before each stage: `pnpm claude:preflight <owner>` and a check of owners changed since `c460b224`. All stages are **presentation only** and default-preserving. Rollback is one `git revert` unless noted.

| ID | Owner plan | Deliverable | Prerequisite | Measurement gate (keep only if) | Rollback |
| --- | --- | --- | --- | --- | --- |
| **A0-cert** | world-terrain-050 (+B0 shared) | Certified A0a capture per the runbook at ≥ `94a74470`, ≥3 warmed 30 s reps, front + rear camera, family counts recorded. No code. | Runbook, author Arc session | Reliability `observed`; rep variance noted; NPC/fauna populations equal across reps | n/a |
| **A1′ — cull bounds for all actor skinned meshes** | world-terrain-050 | `installActorCullBounds` helper plus calls after NPC kit assembly (replaces `frustumCulled=false` at `assembleCharacter.ts:73` with a cullable inflated sphere) and on NPC legacy GLB; unit tests for the envelope (death roll, sleep, scale, parent transform), unknown → drawn | A0-cert. **PENDING BASELINE** | `main.byBucket npcFamily:*` calls drop clearly beyond rep noise in the rear-camera pose; render p50/p95 not worse; zero clipping at screen edges (author visual: turn, attack, sleep, die); off-camera caster within 36 m still casts | Revert the commit; old behaviour = rebound unculled |
| **A2′ — fauna bounds inflation** | world-terrain-050 | Same helper at `createFauna.wrapModel` and livestock clone, one species family per commit (start with horse or dog: highest draws) | A1′ kept | Fauna calls not increased; no clipping in death/harvest/remains/mounted checks; mainly a **correctness** win, so perf is "no regression" | Revert per species |
| **A5′ — Far detail LOD (eyes/eyebrows)** | world-terrain-050 | Register `Eyes`/`Eyebrows` (kit node names, verified per head GLB) in the existing `createAgentPresentationVisibility`; keep the important override; tests that nodes are found for kit NPCs | Independent of A1′, but measure after it | Far-band NPC calls drop by ≈2 per Far NPC that is still submitted; author sees no face popping at the 36 m boundary | Revert; the adapter returns to no nodes |
| **A0b — NPC mixer/label spans** | npc-063 | Mixer-only and label-sync spans plus execution counters in `agentCpuDiag`; disabled path stays cheap | none (can run in parallel with A1′) | Spans add up within the agent-update total; disabled overhead within noise | Revert |
| **A3 — ordinary-loop mixer cadence** | npc-063 + world-terrain-050 | Per §10.7 A3, unchanged | A0b shows mixer ≥ a material share of the ≈5.8 ms. **PENDING BASELINE** | Mixer CPU drops; sim parity tests; author sees no stutter at Mid/Near | Revert |
| **A6 — spawn churn trim** | world-terrain-050 | Clone only the requested hair/eq nodes instead of the whole GLB per NPC (or reuse one template subtree) | Materialization timing captured (stream benchmark) | Stream hitch count/p99 not worse; allocation down | Revert |
| **A7 — shared skeleton + per-texture merge (one family)** | world-terrain-050 | Port V3 join/IBM re-bake/merge math into V1 assembler for one outfit family behind a family allow-list; keep V1 materials | A1′+A5′ kept **and** certified data still shows actor per-draw cost; author approves the visual-diff risk | That family's draws/agent drop (target is V3's ~5 groups for Peasant); render p50 improves beyond noise; tint/hair colour/npc-062 parity screenshots pass | Remove the family from the allow-list (flag-level), then revert |
| **A4 — shadow detail** | world-terrain-050 | Per §10.7 A4 | Certified shadow actor share is non-negligible (smoke: 42 of 421) | Per §10.7 | Revert |

Recommended order: A0-cert → A1′ → A5′ → (A0b in parallel) → A2′ → A3 / A6 → A7 → A4. A1′ and A5′ are both ≈1 file plus 1 call site plus tests, and neither touches simulation.

---

## 6. Benchmark and acceptance criteria

Decision metrics come from the P0 export (`*.json` `passSubmissions`, `agentDetail`, `isolation`, `agentCpu`, distributions; `*.raw.json` per frame):

- **Primary (render):**
  - `passSubmissions.main.byBucket["npcFamily:*"].callsAvg` (sum) and `["faunaFamily:*"]`;
  - `passSubmissions.shadow` actor buckets (refresh frames only);
  - `renderTime.p50/p95`;
  - `isolation[hide-npc-fauna].renderMsAvg − isolation[full].renderMsAvg` (the "exposed actor cost"; it should shrink).
- **Primary (CPU):** `agentCpu.npc.agentUpdates` and, after A0b, the mixer span. Report it with and without frames > 1 s, never the raw average alone.
- **Guards:**
  - `frameTime.p95/p99`, hitch and long-frame counts;
  - main `residualCallsAvg` ≈ 0;
  - `reliability = observed`;
  - identical NPC/fauna family counts across compared runs;
  - mirror actor calls stay 0.
- **Keep rule:** improvement beyond the larger of 2× rep-to-rep spread and 5% on the primary metric of that stage, with no guard regression beyond the same spread, plus author visual acceptance. Otherwise revert. *(Threshold is an author decision, §7.)*
- **GPU claims:** only if `gpuTimer.available=true`. Otherwise label the result "render wall-clock (CPU+GPU wait)".
- **No FPS claims** without certified before/after reps on the same SHA lineage.

### Baseline results slot (paste certified A0a numbers; leave blank until measured)

| Metric | Smoke 032 (diagnostic only) | A0a front rep avg | A0a rear rep avg | Rep spread | After A1′ | After A5′ | After A7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Instrument SHA | `e124e866` (pre-min) | | | | | | |
| NPC / fauna agents (family-matched) | 53 / 91 census | | | | | | |
| Main calls total | 1596 | | | | | | |
| Main NPC calls (Σ npcFamily) | 352 | | | | | | |
| Main fauna calls (Σ faunaFamily) | 103 | | | | | | |
| Main NPC tris | 375k | | | | | | |
| Shadow NPC / fauna calls (refresh) | 32 / 10 | | | | | | |
| Shadow refresh frames / total | 101 / 109 | | | | | | |
| Mirror actor calls | 0 | | | | | | |
| Census NPC meshes / Far agents | 520 / 49 | | | | | | |
| Render p50 / p95 (ms) | 36.1 / 49.0 | | | | | | |
| Isolation full − hide-npc-fauna (ms) | 9.9 | | | | | | |
| Frame p95 / p99 (ms) | 104.6 / 262 | | | | | | |
| NPC agent updates ms/frame (excl. >1 s) | ≈5.8 | | | | | | |
| NPC mixer ms/frame (A0b) | n/a | | | | | | |
| GPU timer available | no | | | | | | |
| Long frames ≥80 ms / max | 12 / 8494.7 | | | | | | |

---

## 7. Author decisions needed

1. **Approve A1′ semantics:** replace lazy first-pose spheres and `frustumCulled=false` with one inflated install-time sphere for all actor skinned meshes. The risk is rare edge popping versus wasted draws today.
2. **Far detail policy:** may eyes and eyebrows (and the beard?) disappear beyond 36 m for non-important NPCs? Hair, head, outfit and skirt stay.
3. **Keep/revert threshold** for §6 (proposed: max(2× rep spread, 5%)) and whether the rear-camera pose is a required gate.
4. **A7 direction:** port V3 merge math into V1 with MeshStandard kept, versus accepting V3's Lambert conversion, versus not merging at all. This decides whether actor draw volume is solved structurally.
5. **Equipment contract (§4.4):** will NPCs ever show per-slot armor? If yes, adopt skeleton/merge-key/coverage/identity flags before armor assets land.
6. **The 8.49 s NPC frame:** commission a separate attribution (npc-063 / materialization) rather than letting it skew Track A averages?
7. **GPU timing on Arc:** accept wall-clock-only evidence for Track A, or require a GPU-timer-capable capture before A7?

### Contradictions with existing documents

- §10.4/A1 frames native skinned culling as a new trial. In fact it is already active, with fragile lazy bounds, for body/fauna. The real gap is the rebound meshes plus inflation. (This audit, §1.2.)
- §10.7 A0a remains listed as the first Composer task. Its core deliverable shipped as the P0 collector; what remains is the certified capture (A0-cert).
- Smoke 032 is cited as "latest", but it predates the runbook's minimum instrument SHA. Treat it as non-comparable to A0a.
