# Revival audit — Grass / Flowers: V3 renderer transfer (Track C)

**Created at:** 2026-10-27
**Created by:** Claude Opus 5.5 (subagent, one of five parallel specialist auditors)
**Status:** research — not approved scope; **PENDING BASELINE** (C0 benchmarks running independently; no FPS gain claimed anywhere in this file)
**Source pins:** V1 `c460b224eadfa395e400da3413815327530adaf7` (authoritative); V3 donor `907e17cd2ad487547a25a1f928b2770348183d75`.
**Builds on (not redone):** [transfer recon §9 and §12](./2026-10-26--v1-performance-transfer-v2-v3-recon.md) (§12 pinned V1 `317a5c71` / V3 `94c46473`; commit `3131b0c2` is the §12 addendum + roadmap edit, no separate doc), [three-track roadmap](./2026-10-27--performance-three-track-roadmap.md), [grass finalization](../../performance/grass-finalization.md), [benchmark readiness audit](../../performance/audits/2026-10-27--three-track-benchmark-diagnostics-readiness.md), [Arc runbook](../../performance/2026-10-27--arc-baseline-runbook.md), [plan 053 snow burial](../../plans/world-terrain-053-snow-patch-thresholds-and-grass-burial.md), [benchmark 016](../../performance/results/2026-09-14--016--benchmark-stream-grass.md), [diagnostic 032](../../performance/results/2026-10-27--032--benchmark-settlement-heavy.md).

**Evidence labels:** **[code]** read at the pins above · **[doc]** stated in a repo document · **[measured-diagnostic]** from a captured diagnostic run that is *not* a certified baseline · **[hypothesis]** inference to be tested. Nothing was built, run, type-checked or browser-verified in this audit.

---

## 1. Verified state and delta vs §12

### 1.1 Source drift since §12 pins

| Repo | Range | Grass-relevant change | Effect on §12 |
| --- | --- | --- | --- |
| V3 | `94c46473..907e17cd` | One commit, `public/assets/items/leather_jerkin.png` only **[code]** | None. All V3 grass claims carry over unchanged. |
| V1 | `317a5c71..c460b224` (23 commits) | `b21a7eb0` P0 diagnostics: `src/perf/grassBaseline.ts` (resident/submitted/lifecycle/allocation estimate), `userData.grassFullCount/grassFiller/grassSpecies` tags in `grass.ts`, request/complete/discard/cancel/streamIn/out hooks in `chunkManager.ts`, pass-submission collector in `gameLoop.ts` **[code]** | Diagnostics only, no render behaviour change. §12 "C0 add only missing grass counters" is **partially done**: resident/submitted/allocation now exist; observed upload bytes and flower attribution still `unavailable` **[measured-diagnostic 032]**. |

### 1.2 §12 claims re-verified (spot checks)

| §12 claim | Verdict at current pins |
| --- | --- |
| V1 per-bucket `InstancedMesh` built with count 0, worker matrices bound directly, worker bounds, no shadows, `REFLECTION_SKIPPED_LAYER` | ✅ `grass.ts:552-700` **[code]** |
| V1 LOD = chunk Chebyshev prefix (`densityLodFraction`, floor 0.08), filler fraction, geometry tier near/mid/far by `t<=.35/.7` | ✅ `distanceLod.ts`, `chunkManager.ts:1561-1570` **[code]** |
| V1 grass radius 2 chunks, unload at radius+1 | ✅ `worldConfig.ts:312`, `chunkManager.ts:1306-1307` **[code]** |
| V3 bands B0 16×192 r10, B1 63×128 r28, B2 251×64 r64 tail slots 128..191, sizeMul 1.35, flowers 28×96 r16 3 tris | ✅ `grassConfig.ts`, `flowerConfig.ts` **[code]**; stale "5-triangle flowers" comment still present in `grassConfig.ts` `GrassProfile.flowers` doc |
| V3 `addUpdateRange` per dirty run, `needsUpdate` once, never `clearUpdateRanges`, `DynamicDrawUsage`, `frustumCulled=false` | ✅ `grassLayer.ts:202-207, 401-405` **[code]** |
| V3 main-thread tile generation, `GRASS_CPU_MS_BUDGET=0.5`, shared 2.5 ms, first tile forced | ✅ `grassLayer.ts:333-356`, `config/budgets.ts:116,119` **[code]** |
| V3 snow uses distance-biased detail fade (`SNOW_DETAIL_FADE_M`) | ✅ `grassMaterial.ts:150-151` **[code]** — V1 053 path uses fixed detail 1.0 at instance origin |
| Three versions | V1 `three@0.185.1` (installed), V3 `^0.186.1` **[code]** — `addUpdateRange` API is present in both; one-minor gap is low risk but partial-upload behaviour must still be observed on V1's build (§12.5 stands). |

### 1.3 New facts not in §12

1. **Resident ≫ submitted (V1's real inefficiency is memory/upload, not draw count).** In 032 (settlement scene, High): 23 grass chunks resident, **483,438 full + 1,027,980 filler instances resident**, but only **75,474 full + 43,101 filler submitted** (LOD fraction 0.156 / 0.042); estimated grass instance allocation **145,096,128 bytes** **[measured-diagnostic 032]**. The estimate equals instances × 96 B (16 matrix + phase + 3 base + 3 tip + wind floats) **[code `grassBaseline.ts`]**. Roughly 84 % of full and 96 % of filler data is generated, transferred, held and (on first draw) uploaded but never drawn in that pose.
2. **Filler is generated for chunks that can never show it.** `fillerRadius = 1 + grassFillerCoverage·(radius−1)` = 1.6 on High; `grassFillerLodFraction` is 0 for chunk distance ≥ 1.6 **[code]**. The worker always emits `2 × candidates` filler candidates per chunk regardless (`FILLER_CANDIDATE_RATIO = 2`) **[code `grassPlacement.ts:476`]**. With radius 2 + hysteresis 3, ≥ 16 of 25 ring chunks carry filler that is never submitted **[code arithmetic]**.
3. **Whole-attribute GPU upload per chunk.** Each bucket wraps the full worker array in an `InstancedBufferAttribute` (StaticDraw default); Three uploads the whole array on first render regardless of `mesh.count` **[code + Three semantics]**. A 230,826-instance chunk (032 max) is ≈ 22 MB of upload in one frame **[measured-diagnostic count × code size]**. This cost lands in the *render* of the first frame after attach, not in `buildGrassChunkMeshes` (032: build avg 0.07 ms) — so current finalization timers cannot see it **[hypothesis]**. It is a plausible contributor to the "unattributed frame spike" pattern in 016/018 (218 ms unattributed vs 33 ms largest labelled hitch) **[hypothesis; must be measured, not assumed]**.
4. **Main-pass submission is much smaller than census.** 032 census: grass 89 draws / 1.21 M tris; observed pass collector main pass: **grass 33 calls / 317,712 tris** (after frustum culling) **[measured-diagnostic 032]**. Census numbers must not be used as rendered cost. Isolation probe `hide-grass` was +0.8 ms (noise) in that settlement scene — **grass is not the bottleneck there** **[measured-diagnostic]**; a grass-rich scene is still missing (readiness audit row C0 UNVERIFIED **[doc]**).
5. **Gameplay is decoupled from the grass renderer.** `world/grassForage.ts` (fauna forage patches, persisted overrides) has no import of `terrain/grass*` **[code]**; no non-test module imports `terrain/grass.ts` except `chunkManager` / worker paths **[code grep]**. Renderer replacement does not touch save data or forage — as long as the forage patch runtime meshes (`createGrassForagePatches.ts`) are left alone.
6. **Worldgen cache.** Grass placement is computed per request in the worker from `chunk-tiles` grids; it is **not** cached **[code `chunkTileWorldgenCache.ts` namespace `chunk-tiles`]**. Decorative grass/flower placement changes need **no cache namespace bump** unless the tile grids themselves change. Flower anchors come from `chunkVegetation.flowerMeadowPatches` (not separately cached) **[code]**.
7. **Settlement handling in V1 grass** is only through `roadTint` (roads + village-clearing corridors) plus sand/river/slope/ridge/altitude/desert rejection **[code `grassPlacement.ts:393-435`, `chunkMeshData.ts:214`]**. No explicit building-footprint exclusion in grass placement was found **[code grep]** — ❓ whether grass visibly pokes through floors/yards needs a screenshot check before any adapter is designed around a footprint registry.

### 1.4 Precise V1 vs V3 comparison (gap fill)

| Aspect | V1 @ `c460b224` | V3 @ `907e17cd` |
| --- | --- | --- |
| Primitive per instance | "Cluster" of flat tapered strips (fins), rest-curve baked, linear width taper → angular outline **[code `buildFinCluster`, `finHalfWidth`]** | Clump of 12 blades with roles; near blade = curved quad + tip triangle; normals bent 70 % up **[code `clumpGeometry.ts`]** |
| Triangles per instance (near / mid / far) | tri 24 / 12 / 6 (3 fins × seg 4/2/1 × 2); grain 22 / 12 / 4; herb 36 / 12 / 6; filler 12 (no tiers) **[code arithmetic]** | B0 near 36 (12 blades × 3), B1 coarse 12, B2 mid 4; flower 3 **[code]** |
| Triangles per *blade* | 8 (tri near) | 3 (near), 1 (coarse/mid) |
| Instance layout | matrix 16 f + `aPhase` 1 + `aBaseColor` 3 + `aTipColor` 3 + `aWindFactor` 1 = **96 B** **[code]** | matrix 16 f + tint vec4 = **80 B**; cached records 8 f = 32 B/slot **[code]** |
| Buffer mgmt | Per chunk × 4 buckets; worker array bound, StaticDraw, full upload once; LOD = `mesh.count` prefix (no upload); tier geometries lazily built and cached **[code]** | Fixed per-band pools, packed blocks, swap-last eviction, merged dirty runs → `addUpdateRange`, DynamicDraw **[code]** |
| Double buffering | None **[code]** | None; stale-bytes-until-regenerated policy instead **[code]** |
| GPU-side animation | Wind: `uTime`, `uWindAmp` uniforms, per-instance `aPhase`/`aWindFactor`; snow: shared `uSnowAmount` + `svSnowThreshold` at instance origin, burial shrinks height in VS; day/sun/fog uniforms; **no per-frame instance writes** **[code]** | Wind: CPU-integrated phase/direction/gust uniforms; distance fades/dither in VS/FS; snow, wet, bloom uniforms; **no per-frame instance writes** **[code]** |
| Material | Custom `ShaderMaterial`, base→tip gradient, backlight, fog **[code]** | `MeshLambertMaterial` + `onBeforeCompile`, `DoubleSide` **[code]** |
| LOD bands | 3 chunk rings (dist 0 / 1 / 2, +hysteresis 3): density 1 / 0.76 / 0.08 × lodScale; step changes at 64 m chunk borders **[code arithmetic]** | Distance-continuous per-instance fades: B0 ≤10 m, B1 ≤28 m, B2 ≤64 m, overlap crossfades **[code]** |
| Max grass distance vs fog | ~96–160 m (radius 2 chunks, chunk-centred), up to ~224 m inside hysteresis; fogFar 150–250 m by day factor, × 0.32–1 by weather **[code `dayNight.ts:119`, `weatherVisuals.ts`]** | 64 m **[code]** — would leave ~90–190 m of grass-free ground inside V1 clear-day fog |
| Culling | Per-bucket worker sphere, frustum culled **[code]** | Ring meshes `frustumCulled=false` **[code]** |
| Draw calls | ≤ 4 per resident chunk (≤ ~100 at radius 2) **[code]**; observed main pass 33 **[measured-diagnostic 032]** | 4 grass/flower bands (+2 fern bands, out of scope) independent of distance **[code]** |
| Placement thread | Worker (`chunkHeightmap.worker.ts:93`) **[code]** | Main thread, budgeted **[code]** |
| Terrain sampling | Bilinear apron grids, same grid as mesh **[code]** | 5×5 cached, 2 m mesh-aligned diagonal interpolation **[code]** |
| Flowers | `flowerMeadowPatches` → `kind:'bush'` species 2/3/4 in vegetation batcher (2 meadow candidates/chunk, 5–14 per patch) **[code]** | 96 slots/tile, stem triangle + camera-facing petal quad, FS petal discard **[code]** |
| Memory (bounded?) | Unbounded by design: ∝ resident chunks × generated candidates; 145 MB estimate in 032 **[measured-diagnostic]** | Bounded by construction: ≈ 2.39 MB instance arrays (no ferns) + 9.2 KB/cached tile **[§12 arithmetic, re-checked]** |

---

## 2. Reusable solutions (V1 / V2 / V3)

| # | Solution | Source | Reuse verdict |
| --- | --- | --- | --- |
| R1 | Worker placement + data-only bounds, main-thread Three objects | V1 `grassPlacement.ts`, `grass.ts`, finalization fix `8f9b7482` **[doc]** | **Keep.** Strictly better thread placement than V3's main-thread generation for V1's 64 m chunks. |
| R2 | GPU-side wind/snow/day uniforms, shared `uSnowAmount` (053) | V1 `grass.ts` VS **[code]** | **Keep as contract** in any renderer. |
| R3 | Prefix-ordered instances (count-only LOD, no upload) | V1 and V3 both **[code]** | Keep; V3's "B2 reads tail" trick is reusable only inside a tile ABI. |
| R4 | Bounded pool + swap-last + coalesced `addUpdateRange` | V3 `grassPool.ts`, `grassLayer.ts` **[code]** | Portable as a **data structure**; useful in V1 only if V1 stops binding whole worker arrays (option a3/b). |
| R5 | Distance-continuous dither fades (B0/B1 crossfade) | V3 `grassMaterial.ts` **[code]** | Portable as shader technique to remove V1's 64 m density steps; not a perf gain by itself **[hypothesis]**. |
| R6 | Smooth blade profile + bent normals | V3 `clumpGeometry.ts` **[code]** | Portable as geometry/normal recipe inside V1 `FinSpec` (rounded taper, normal bend) — addresses "less angular" with no ABI change. |
| R7 | Billboard flower (3 tris, petal discard), V2 palette | V3 `flowerGeometry.ts`, `flowerConfig.ts` (palette from V2 `groundPatch.ts`) **[code]** | **Portable standalone** as a new V1 instanced bucket fed by existing `flowerMeadowPatches` anchors. |
| R8 | Per-band triangle caps as test-asserted constants | V3 `grassConfig.test.ts` **[code]** | Reuse the *practice*: add a V1 test asserting worst-case submitted tris/bytes. |
| R9 | `grassBaseline.ts`, pass collector, finalization diag | V1 P0 **[code]** | Reuse for C0/C-gates; extend with first-render upload attribution only. |

---

## 3. Problems and risks

| ID | Problem / risk | Evidence | Severity |
| --- | --- | --- | --- |
| P1 | Generated-but-never-drawn data (filler beyond 1.6 chunks, full instances beyond LOD fraction) inflates worker time, transfer, heap and VRAM | §1.3 items 1–2 **[measured-diagnostic + code]** | High for memory/stream; render impact **PENDING BASELINE** |
| P2 | First-render whole-array upload per chunk invisible to current timers | §1.3 item 3 **[hypothesis]** | Potentially high for travel p99 |
| P3 | V3 radii (64 m) ≪ V1 grass reach (~96–160 m) and fog (150–250 m) → bare-ground band or density loss | §1.4 **[code]** | High visual-quality risk under option b/c |
| P4 | V3 main-thread tile generation replaces a worker advantage; forced first tile may exceed budget | §12.5 **[code]** | Medium |
| P5 | V3 2 m-grid sampler vs V1 apron/cutout mesh → floating/buried roots | §12.3 **[code]** | High for b/c |
| P6 | Lambert vs V1 custom shading shifts the olive palette even at equal RGB | §12.2 **[code]** | Medium (author look gate) |
| P7 | Snow-burial parity: V3 distance-biased detail fade ≠ V1 053 contract | §1.2 **[code]** | Medium; must keep V1 behaviour |
| P8 | Policy contradiction: `grass-finalization.md` says *do not introduce buffer pooling by default; reopen only if fresh benchmarks show grass streaming as material bottleneck* **[doc]**, while the roadmap makes Track C mandatory **[doc]** | docs | Process risk — resolve by gating every pooling stage on C0 evidence (§5) |
| P9 | V1 chunk-granular density steps (1 → 0.76 → 0.08) are visible as rings **[hypothesis]** | §1.4 **[code]** | Low–medium (visual) |
| P10 | `herb` grass bucket (36 tris near) is the costliest per-instance species and the largest full bucket in 032 (79,274) **[measured-diagnostic + code]** | 032 | Medium — tuning target, but author must accept any look change |
| P11 | Flowers as `bush` 3D models inside the vegetation batcher; replacing them touches region batches | §12.3 **[code]** | Medium; keep split at presentation, not worldgen |
| P12 | Density "preserved" claims compare counts across different primitives (V1 3-fin cluster vs V3 12-blade clump) | §9 **[doc]** | Methodology — compare screen coverage, not counts |

---

## 4. Recommended architecture, alternatives and trade-offs

### 4.1 Options

| Option | What it is | Pros | Cons / risk | Density preservation |
| --- | --- | --- | --- | --- |
| **(a) Keep V1 renderer, port selected techniques** | V1 worker placement, chunk ownership and shaders stay. Add: (a1) generate/bind only the instances a chunk can submit within its hysteresis (filler gated by filler radius; full prefix capped at max reachable LOD fraction, regrown on approach); (a2) softened blade profile + bent normals (R6); (a3) optional partial-prefix buffers (bind a growable sub-view or pooled attribute so upload ∝ submitted, R4); (a4) shader distance dither between rings (R5); (a5) V3-style billboard flowers as a new bucket (R7) | Smallest diffs; preserves worldgen/LOD/fog semantics, worker advantage, snow 053, mirror/shadow policy; each step reversible; directly attacks the measured waste (P1/P2) | Does not get V3's per-band triangle cap or 4-draw total; draw calls stay ∝ chunks; a1 regrow on approach adds worker requests (determinism: filler needs its own seeded stream, decorative only) | Exact for a2–a4 (same placement); a1 changes nothing that was drawn if gating matches LOD; a5 adds flowers |
| **(b) V3 tiled backend behind V1 adapter, reversible switch** | §12.3–12.7 C1–C6 as written | Bounded tris and memory by construction; 4 draw calls; continuous fades; author's conditional preference **[doc §9]** | Largest diff (adapter, sampler, invalidation, lifecycle); P3/P4/P5/P6/P7; requires custom radii ≫ donor → recomputed pool caps and higher tri caps, eroding the donor's measured advantage **[hypothesis]** | Must re-tune bands to V1 reach; risk of thinner far field |
| **(c) Full replacement (incl. CoverField / terrain shader)** | Import V3 grass + cover clipmap + ground shader | Matches V3 look holistically | Rewrites V1 terrain material (wetness, scorch, snow, dirt textures); explicitly out of §9/§12 scope **[doc]** | Unknown; highest visual-regression risk |

### 4.2 Recommendation

**(a) first, with (b) kept as a gated prototype — reject (c) for this track.** **[hypothesis, PENDING BASELINE]**

Reasoning: the only grass numbers available show V1 grass is **memory/upload-heavy and draw-light** (33 main-pass calls / 318 k tris, `hide-grass` noise-level in 032), while V3's main architectural advantage (bounded triangles and few draws) addresses the draw side. Option (a1/a3) attacks the measured waste with V1-native changes and no new adapter; (a2/a5) deliver the author's visual asks (less angular blades, billboard flower clumps, V1 olive palette) independent of the renderer. Proceed to (b) only if C0 in a **grass-rich** scene shows grass main-pass GPU time or triangle count is a material share of frame time *after* (a1–a3) — that is the condition under which V3's bounded bands could deliver the "decisive, measured net improvement" §9 demands. This is a sequencing proposal, not a reversal of the author's conditional preference for V3.

### 4.3 Invariants for any option

- One grass renderer attached at a time; switch only via `WorldBundle` rebuild (§12.4).
- Bind the exact V1 `uSnowAmount` object and `snowField.ts` thresholds; burial shrinks in VS (053).
- Grass stays off sun shadows and on `REFLECTION_SKIPPED_LAYER`.
- Decorative RNG: world seed + separate salt; never consume simulation RNG; no `chunk-tiles` bump unless grids change.
- Grass forage, medicinal herbs, ferns/bushes untouched.

---

## 5. Conditional small stages

Each stage: one concern, one reviewable commit, `pnpm claude:preflight` against the owning plan first, legacy behaviour default until its gate passes. "Owner plan" = existing plan to extend, or a new plan only if none fits.

| Stage | Change | Owner plan | Prerequisite | Gate (keep) | Revert / rollback |
| --- | --- | --- | --- | --- | --- |
| **C0+** | Add first-render upload attribution: bytes of grass attributes uploaded per frame (count arrays bound since last frame) and frame time of the first frame after each grass attach; mark `unavailable` otherwise. No behaviour change. | readiness audit P1 row "grass GPU upload ranges" **[doc]** | C0 runbook in progress | Numbers present in `[Seedvale Grass Baseline]`; tests pass | Delete counters; zero runtime effect |
| **CA1** | Filler gating: do not generate/bind filler for chunks requested at distance ≥ `ceil(fillerRadius)`; filler-only request when a chunk enters filler range; separate seeded filler RNG stream | world-terrain-005 (filler LOD) / grass finalization | C0 grass-rich + stream baseline (**PENDING BASELINE**) | Resident filler instances and allocation estimate drop; no visible filler pop on approach (author, motion); stream p95/p99 not worse | Revert commit; filler RNG change is decorative only (no save/cache impact) |
| **CA2** | Full-instance cap: worker emits only the prefix needed for the chunk's max reachable LOD fraction within hysteresis; regrow on approach | plan 148 / 005 | CA1 kept | Allocation and upload estimates drop; near-field density identical (screenshot A/B); no travel hitch regression | Revert; legacy path unchanged |
| **CA3** | Blade softening: rounded `finHalfWidth` profile, optional bent normals, same tri budget per tier | world-terrain-009 (seasonal/appearance draft) or new small visual plan | Author screenshot reference set | Author accepts close/mid silhouette and olive palette in motion; tri count per tier unchanged | Revert geometry constants |
| **CA4** | Billboard flower bucket: new instanced mesh (3 tris, V2 palette, petal discard) fed by `flowerMeadowPatches` anchors with seeded loose scatter; presentation-time removal of flower-species bush placements | world-terrain-009 / new decorative-flower plan; §12 C4 | CA3 optional; flower count diagnostic (currently `unavailable`) | Loose clumps read correctly; no duplicates with bushes; snow burial applied; vegetation batcher unchanged for other kinds | Toggle off bucket and restore bush flowers (keep both code paths until accepted) |
| **CA5** | Ring dither: shader distance fade across chunk density steps (R5), no count change | plan 148 | CA2 | Ring borders no longer visible (author); GPU time not worse **PENDING BASELINE** | Revert shader chunk |
| **CA6 (gated)** | Partial-prefix buffers / pooled attributes so upload bytes ∝ submitted | grass finalization (reopen explicitly, resolves P8) | C0+ shows first-render upload is a material travel hitch | Upload bytes per attach and travel p99 improve beyond run variance | Revert to whole-array binding |
| **CB (gated)** | §12 C1 → C6 V3 tiled backend behind `legacy\|tiled` dev selector, radii tuned to V1 reach | §12 C1–C6 | After CA1–CA2: grass-rich C0 shows grass draw/GPU cost material; author still wants V3 look | §12.8 keep criteria unchanged | Legacy default; bundle-rebuild switch back |

Order: C0+ → CA1 → CA2 → (CA3, CA4 in parallel by visual owner) → CA5 → CA6/CB only on evidence. Serialize all `chunkManager.ts` / `grass.ts` writers with Tracks A/B.

---

## 6. Benchmark and visual acceptance criteria

**Scenes (from runbook/readiness audit):** `?benchmark=forest` only where grass cover is verified; `?benchmark=stream` cold and warm separately; a staged meadow pose (non-canonical until formalized); `settlement-heavy` as a non-grass control. High preset, same SHA, ≥ 3 warmed reps with variance note **[doc runbook]**.

**Technical metrics per arm:** frame p50/p95/p99, hitch count/max; main-pass grass calls/tris (pass collector, not census); resident vs submitted full/filler instances; allocation estimate; first-render upload bytes and frame time after attach (C0+); worker grass request/complete/discard; JS heap trend; `renderer.info.memory` geometries over out-and-back travel.

**Gates:** numeric thresholds are agreed from C0 variance **before** CA1 lands — this audit supplies none. A stage that only moves allocation (CA1/CA2) passes on memory/upload metrics with **no frame-time regression**; it must not be described as an FPS gain unless frame percentiles improve beyond variance.

**Visual acceptance (author, in motion, near/mid/far):** olive V1 palette with subordinate vivid accents; blades planted; less angular silhouette; no visible chunk rings or band seams; loose flower clumps without opaque squares/shimmer; snow burial (053) and snowmelt unchanged; settlement/yard and road edges unchanged; fog horizon not exposing a bare band; screen-space cover not reduced (compare screenshots, not counts).

### Baseline results slot (to be filled by C0)

| Scene / arm | SHA | Device / browser | Frame p50 / p95 / p99 (ms) | Grass main calls / tris | Resident full / filler | Submitted full / filler | Alloc est. (MB) | Upload per attach (MB) | Stream hitches n / max | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| forest (grass verified) — warm | | | | | | | | | | |
| stream — cold | | | | | | | | | | |
| stream — warm | | | | | | | | | | |
| meadow (staged) — warm | | | | | | | | | | |
| settlement-heavy — control | | | | | | | | | | |

---

## 7. Author decisions needed

1. **Sequencing:** accept "(a) first, (b) gated on grass-rich C0" — or proceed straight to the §12 C1 adapter for the V3 backend regardless of C0?
2. **Reopen grass-finalization policy (P8):** allow CA1/CA2/CA6 (generation/upload trimming, possible pooling) under Track C, explicitly superseding "no buffer pooling by default"?
3. **Grass reach:** keep V1's ~96–160 m grass reach under 150–250 m fog (any V3 port must match it), or accept a shorter reach with stronger ground colour?
4. **Blade look:** soften V1 fins (CA3) as the target, or adopt V3 12-blade clumps (only under CB)? Per 2026-10-27 direction V1 is the base — confirm.
5. **`herb` grass bucket:** keep as-is (costliest near tier, 36 tris) or allow a lower-segment variant? Any look change needs your review.
6. **Flowers:** confirm billboard clumps replace the meadow flower *bushes* entirely (species 2/3/4), and whether flower density may exceed current 5–14 per patch.
7. **Settlement profile:** is grass inside yards/under building footprints currently acceptable (no explicit footprint exclusion found), or is a footprint mask in scope?

---

## Contradictions recorded

- `grass-finalization.md` ("do not introduce … buffer pooling by default") vs roadmap Track C mandatory workstream — resolve via decision 2 **[doc]**.
- §9 earlier preference for V3 clump silhouettes vs 2026-10-27 direction "V1 as base, less angular" — §12.1 already records the latter superseding; this audit follows it **[doc]**.
- V3 source comments ("5-triangle flowers", "48 slots") vs constants (3 tris, 96 slots) — constants win **[code]**.
- Census grass cost (89 draws / 1.21 M tris) vs observed main pass (33 / 318 k) in 032 — use pass collector for all gates **[measured-diagnostic]**.
