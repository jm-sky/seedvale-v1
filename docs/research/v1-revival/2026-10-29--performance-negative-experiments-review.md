# Independent review — three negative FPS experiments + settlement-heavy critical path

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 (queue Q1) · **Answers:** [review request](./2026-10-29--performance-negative-experiments-opus-review.md)
**Status:** review only. No runtime change, no benchmark run, nothing merged. All three negative results stay recorded as provisional evidence.
**Sources checked:** current `main` (`b3f2059c`) source; three r185 (`node_modules/three`, 0.185.1) `Object3D`, `SkinnedMesh`; `node_modules/n8ao`; the three A/B reports and their JSON/raw bundles in `docs/performance/results/win/` (2026-10-27 … 2026-10-29, settlement-heavy); branch `experiment/d11-peasant-body-merge` at `6db369b3`; skeleton-sharing patch; [NPC recon](./2026-10-29--npc-rendering-optimization-recon.md); [trace analysis](../../performance/results/2026-10-28--win-a1p-trace-analysis.md); [forest bisect](../../performance/results/2026-10-28--win-forest-bisect-and-fixes.md).

Labels: ✅ verified in source/data · 🟡 inference/hypothesis · ❓ open.

## Verdict in one paragraph

No integration or toggle mistake explains the missing gains. In each experiment the toggle demonstrably changed only the intended mechanism, and each one moved **RENDER p50 by roughly the amount a linear per-unit cost model predicts** (−1.0 / −0.8 / −0.5 ms). Those savings are 1.5–3 % of a ~33 ms frame, while the A/B protocol (n = 3 per arm, mean FPS as the decision metric) cannot resolve less than ~2 FPS (~6 %). The results are therefore **consistent with small real savings that the protocol was too weak to confirm**, not with "the mechanism does nothing". Equally, none of the three can reach the 50–60 FPS goal: that needs ~13–17 ms off the frame. The review found one genuine resource defect (bone textures are never disposed) and one structural CPU cost that is larger than all three experiments combined (every scene traversal recomputes every object's world matrix). The next target ranking is in §5.

## 1. Confirmed defects

| # | Severity | Where | Evidence | Minimal fix |
| --- | --- | --- | --- | --- |
| F1 | **Medium (resource leak)** | `disposeObject3D` (`src/assets/loadGltf.ts:216`), used by `NpcAgent.dispose` (`src/ai/NpcAgent.ts:3998`) and fauna teardown | ✅ It disposes geometry, material and `InstancedMesh` buffers, but never `SkinnedMesh.skeleton`. Three allocates a per-Skeleton `boneTexture` (DataTexture) on first render; `Skeleton.dispose()` is the only thing that frees it. Only `PlayerController` disposes skeletons (`src/player/PlayerController.ts:105`). Both experiment reports noticed it in passing; it was never filed. Every streamed-out NPC leaks one GL texture per **rendered** runtime Skeleton (≈ one per skinned mesh: 8–10 per NPC), fauna likewise. | In the NPC/fauna teardown owner, collect distinct actor-owned skeletons and `dispose()` each once, after geometry/material disposal. Must not touch loader-cache resources (skeletons are always cloned per actor, so all are actor-owned — verify for legacy override paths). Unit test: unload N actors → `renderer.info.memory.textures` returns to baseline. Workload-neutral; may land as a recorded D4 critical-fix exception. Filed in [LOOSE-ENDS](../../plans/LOOSE-ENDS.md). |
| F2 | Low (documentation) | [forest bisect](../../performance/results/2026-10-28--win-forest-bisect-and-fixes.md) §3 "RENDER ms" column | ✅ That column is `systems.RENDER` (frame-average, ~20 ms). The A/B reports use `renderTime.p50` (~25–27 ms). Mixed side by side they look like a +6 ms RENDER regression between 10-28 and 10-29 that does not exist (`systems.RENDER` is 19.8–21.5 ms at `36e99ef6` and 20.3–22.2 ms at `fe5ff141`). | Label the column `systems.RENDER avg`. Done in this commit. |
| F3 | Low (documentation) | CSS2D report §4 "GPU timing: unavailable" | ✅ Already corrected in the NPC recon: the JSON has `gpuTimer.available = true`. Report left as written; the correction is recorded here and in the recon. | — |

**No defects found in the experiments themselves:**

- ✅ **Toggles and scope.** CSS2D: the single changed call site is the label render (`src/app/gameLoop.ts:3174`), inside the same `RENDER` span as the beauty pass; nothing moves in between. Skeleton sharing and body merge: same build per arm (`gitSha` verified in every run), the arm is a URL flag read at actor creation, and the family pass counters prove the flag was live (Peasant main submissions 119 → 80 in all three merge B runs; eligible Skeleton updates 61 → 14 per frame in the instrumented sharing runs).
- ✅ **Workload matching.** Population, chunk count, fixture, seed, camera, weather (rain) and time of day (0.2917) are identical across all 10-27 … 10-29 settlement-heavy runs. The merge A/B even shows identical Peasant triangles (146 157) in all six runs.
- ✅ **No per-frame resource recreation.** Both experiments run once per actor at `NpcAgent.create`, before bounds; neither touches the frame loop.
- ✅ **Measurement span.** All three savings fall inside the `RENDER` category (beauty + shadow + labels). The water mirror runs in `WATER`, which none of them touched. Per-frame raw data show `frameMs − (simulateMs + renderMs)` = 0.2 ms in **every** run, so the measured tick is the whole frame and a RENDER saving should reach frame time 1:1 unless something else absorbs it (see §2.3).

## 2. Measurement limitations vs falsified hypotheses

### 2.1 Observed effect size matches the linear prediction

| Experiment | Work removed | Predicted RENDER saving 🟡 | Observed RENDER p50 (A → B) | Frame p50 (A → B) | Mean FPS (A → B) |
| --- | --- | --- | --- | --- | --- |
| CSS2D matrix skip | 1 of ~3 full scene matrix traversals per frame (§3) | ~1 ms (trace: `updateMatrixWorld` 13.7 % self ≈ 3–4 ms/frame unprofiled across all traversals) | 26.3 → 25.3 (**−1.0**) | 32.6 → 32.0 (−0.6) | 31.4 → 31.2 |
| Peasant Skeleton sharing | 47 Skeleton flatten + palette refresh per frame (61 → 14) | 47 × ~10–20 µs ≈ 0.5–1 ms | 27.7 → 26.9 (**−0.8**) | 34.7 → 33.9 (−0.8) | 28.7 → 29.4 |
| D11 body merge | 39 main + 3.3 shadow submissions (~2 % of ~2 060) | 25 ms × 2 % ≈ 0.5 ms | 27.4 → 26.9 (**−0.5**) | 34.6 → 34.6 (0.0) | 28.2 → 29.0 |

Every experiment moved RENDER p50 in the predicted direction and by the predicted magnitude. **"The mechanism has no effect" is not supported; "the effect is ≤ 1 ms and below this protocol's resolution" is.** This is consistent with the authors' own reading in each report.

### 2.2 The protocol was underpowered by construction

- ✅ Same-arm spread: FPS 0.9–4.3, frame p50 1.0–3.1 ms, RENDER p50 1.2–2.4 ms (n = 3).
- 🟡 With n = 3 per arm and that spread, the minimum detectable difference is about 2 FPS / 2 ms frame p50. Every predicted saving above is below it, so a REVERT verdict was the expected outcome before the first run.
- ✅ **Mean FPS is the noisiest available metric here.** It is `frames / window`, so a handful of 80–100 ms hitch frames dominate it. Within one arm p99 ranges 42–96 ms and long-frame counts 0–31. None of the three mechanisms affects hitches. For steady-state submission/CPU slices, paired **RENDER p50 and frame p50** are the right primary metrics; mean FPS and p99 are regression guards.
- ✅ The 30-frame isolation probes in each run are too short for ±3 ms claims. In one control run `no-smaa` "saves" 4.9 ms and `no-bloom` 3.2 ms, and in another control run of the same build both are ~0. Use only the large, sign-stable probes (`hide-npc-fauna`, `no-shadows`, `hide-settlement`).

### 2.3 An uncontrolled confound: the shared-power iGPU

- ✅ The GPU timer (`postprocess+labels` span) is bimodal, ~20–23 ms vs ~27–31 ms, **independent of arm**: in the sharing session A = 31.3 / 26.8 / 30.8 and B = 29.4 / 20.7 / 23.2. In high-mode runs it equals 85–95 % of the frame time.
- 🟡 The Arc 140V is an integrated GPU that shares package power and thermal budget with the CPU. When the GPU timer sits at ~30 ms out of a ~33 ms frame, the GPU is close to co-limiting. A CPU saving can then partly turn into GPU clock or power headroom instead of shorter frames. The mode switches look like a power-state change (same SHA, same arm, same scene), which adds run-to-run noise that n = 3 cannot average out.
- ❓ Not proven. The raw per-frame export has no GPU column, so the regime cannot be stratified retroactively. Recommendation: record the GPU-timer mode per run as a covariate, add per-frame GPU span to the raw export (tooling only), and log the Windows power mode / AC state in the runbook.

### 2.4 Falsified vs not falsified

- **Falsified:** "any of these three alone yields a visible FPS gain on settlement-heavy". **Kept as negative.**
- **Not falsified:** "each removes ~0.5–1 ms of main-thread RENDER work". The data lean towards yes.
- **Not falsified, untested:** "the three savings stack to ~2–2.5 ms (≈ 7 %)". That would be detectable. The brief forbids combining them for attribution, and they would not reach the target anyway.

## 3. Actual critical path (settlement-heavy, current evidence)

A ~33 ms frame breaks down into ~6 ms `simulate` (update), ~3.6 ms `WATER` (mirror, 314 calls), ~25–27 ms `RENDER` p50 (shadow ~400 + main ~1 400 calls + N8AO/post + labels) and ~1 ms outside the tick.

**Finding: every scene traversal recomputes every world matrix** ✅

- No static content opts out of matrix updates: `matrixAutoUpdate = false` appears only in `pointLightBudget.ts` and `programPrewarm.ts`.
- In three r185, `updateMatrix()` unconditionally sets `matrixWorldNeedsUpdate = true`. Because the `Scene` root itself has `matrixAutoUpdate = true`, **`force` cascades to every descendant on every `scene.updateMatrixWorld()`**. Even an object with `matrixAutoUpdate = false` still re-multiplies its world matrix if any ancestor recomposes (`Object3D.js:1165–1200`).
- `AttachedBindMode` `SkinnedMesh` additionally inverts `bindMatrixInverse` on every traversal (`SkinnedMesh.js:296`) — ~900 actor meshes per traversal.
- Per frame the scene is traversed by the mirror render (`waterMirror.ts:245`, when it runs), the beauty render inside N8AO (`autoRenderBeauty`) and the CSS2D label render (`gameLoop.ts:3174`). That is three full compose + multiply passes over everything, including ~53 × 65 + fauna animated bones. N8AO `transparencyAware` is off (`worldConfig.ts:349`), so N8AO adds no extra scene renders.
- The pre-fix trace measured `updateMatrixWorld` at 13.7 % self plus 3.3 % `multiplyMatrices`. The CSS2D experiment removed one of the three traversals and saw ~1 ms. 🟡 Freezing static subtrees at their owners could remove most of the compose and multiply work from **all** traversals: an estimated 2–4 ms, the largest single CPU candidate identified. Not measured.

**Finding: actor submissions are the most expensive per call** ✅ (from probes) 🟡 (magnitude)

- `hide-npc-fauna` is the largest sign-stable probe: −6.4 / −9.7 ms RENDER for ~310 main + ~40 shadow calls, i.e. roughly 18–28 µs per actor submission.
- `hide-settlement` is −2.9 / −5.2 ms for ~800 calls, i.e. roughly 4–6 µs per call.
- Hiding skips actor culling, skinned draws, Skeleton flatten + palette refresh and per-instance material refresh. Each NPC part has its own material clone, so material uniforms are re-uploaded on almost every actor draw. Hiding does **not** skip mixers or the matrix traversals.
- The Peasant experiments touched 13 admitted bodies, a small slice of ~310 actor calls and ~300 runtime Skeletons. 🟡 Which part of the per-actor cost dominates is **unmeasured**: Skeleton/palette, material uniform refresh, program switches or culling. This is the gap that turned the last three experiments into guesses.

**Other large, sign-stable items (all need author decisions before any change):**

- **Shadow map** refreshes on every frame (`shadowRefreshFrames = frames`, 0 skipped): `no-shadows` −3.3 / −5.5 ms. Any cadence reduction is a visual compromise.
- **Mirror:** 314 calls, ~3.6 ms `WATER`. Reflection trims need D8/D13.
- **Far-band actor animation cadence** needs D10.

## 4. Retest merit (only under changed conditions)

| Candidate | Retest? | Condition that would justify it |
| --- | --- | --- |
| CSS2D matrix skip | **No, superseded** | Subsumed by the static matrix freeze (§5 B1). Once static subtrees are frozen, the remaining label traversal costs only the walk plus dynamic objects. Retest only if B1 is rejected; then use a matrix-specific probe (time `scene.updateMatrixWorld()` around the label pass), not a 6-run FPS A/B. |
| Peasant Skeleton sharing (B′) | **Later, conditional** | Only after A0 attribution (§5) shows Skeleton/palette work is a material share of the ~20 µs per actor call. Then extend to the head group: decoded head primitives factor against each other (≤ 1.7e-7), not against the body. Scope it per compatible group for all Base-head families, and measure with RENDER p50 primary, n ≥ 6 interleaved. Keep it separate from the merge A/B. |
| D11 Peasant body merge | **Lowest priority** | Per-NPC geometry allocation for 13 admitted bodies does not pay back on this fixture. Revisit only if (a) a closer/denser approved fixture admits many more bodies, or (b) A0 shows per-draw state cost dominates *and* sharing alone cannot remove it. In-world visual acceptance (both sexes) remains a precondition. The branch stays preserved. |

Changing the target fixture to make any candidate "win" is not proposed. A denser fixture would be a separate author decision.

## 5. Ranked next targets (settlement-heavy, ~29–33 FPS → 50–60)

Order is by expected leverage per evidence. 🟡 Every figure is a hypothesis to be measured, not a claim.

| Rank | Track | Target | Why | Next step | Gate |
| --- | --- | --- | --- | --- | --- |
| **B1** | B (shared) | **Static subtree matrix freeze.** Owners set `matrixAutoUpdate = false` on static settlement / vegetation / item / terrain assemblies after placement, update once explicitly on placement/rebuild, and make the `Scene` and static world-root groups non-auto so `force` stops cascading. | Removes compose + multiply for most of the ~3 traversals per frame. Largest CPU line in the trace; the CSS2D result is a lower bound for one traversal. No visual change. | Small plan (owner list, list of moving exceptions: doors, crops, wood-pile tiers, interactables, building stages) + focused tests (frozen objects keep correct world matrices after rebuild/streaming; moving exceptions still update). One A/B, RENDER p50 primary. | Stop if an owner cannot tell static from moving parts without behaviour changes. |
| **A0** | A (evidence) | **Actor per-submission cost attribution.** Opt-in counters in one diagnostic run: Skeleton.update executions (all actors), palette uploads, material switches and program switches per pass, time in `Skeleton.update`. Plus **one fresh author-run Chrome trace** of settlement-heavy on current `main` (the only trace predates `36e99ef6`). | Picks between material-instance sharing, Skeleton sharing (extended) and fauna work, instead of another blind A/B. | Tooling only (allowed under D4); trace via the existing [runbook](../../performance/2026-10-27--arc-baseline-runbook.md). | — |
| **A1** | A | Chosen from A0. Most likely options: (a) share equal-state actor material instances per (family part, dye), preserving per-NPC tint semantics; (b) per-group Skeleton sharing (body + head) for all Base-head families; (c) fauna (~110 main calls, a third of actor submissions, not yet reviewed). | ~310 actor calls at ~20 µs ≈ 6–9 ms is the second-largest bucket after settlement. | Slice decided after A0. | (a) must keep D11 appearance; any far-band reduction needs D10. |
| **B2** | B | Q5 (existing): top non-reflection settlement submission family. Current main buckets: `items` 204 calls (chunk items / resource deposits, 44 k triangles total — a prime instancing target), `storageGoods` 85, `houseStatic` 66, `storageContainer` 58. | Settlement + items are ~900 of 1 400 main calls. | Per Q5. | Reflection content needs D8/D13. |
| — | author | Shadow refresh cadence / static–dynamic shadow split; mirror trims; far animation cadence | Each sign-stable 3–5 ms, but each is a visual or detail trade-off. | Ask the author (queue §3) only if B1 + A1 + B2 leave the gap open; raise it in Q7. | D8/D10/D13 or a new decision. |

**Measurement guidance for whatever lands next:**

- Pre-register **RENDER p50 + frame p50** as primary metrics.
- Run n ≥ 6 interleaved runs, or batch two independently revertable slices as A / A+X / A+X+Y in one session.
- Record the GPU-timer mode per run.
- Keep mean FPS and p99 as guards.
- Never claim gains from cross-session comparisons.

## 6. Lifecycle / resource review of the two experiments (not merged)

- **Skeleton sharing patch:** cleanup correctly disposes each distinct actor skeleton once and leaves canonical inverses and other actors intact (tested). It also fixes F1 for shared bodies only. If it is ever revived, F1 should already be fixed on `main` so that cleanup behaviour is identical in both arms.
- **Body merge branch:** new actor-owned geometry, material and palette go through the existing `disposeObject3D` contract. Superseded material clones are disposed only when unreferenced. Construction cost and GC were not measured (acknowledged). 🟡 It is a low streaming-hitch risk (~5 k vertices merged per Peasant at create time), but unquantified. Same F1 dependency for the new palette is handled on the branch.
- No defects found beyond F1 and those already listed as unverified in the reports (in-world visual acceptance).
