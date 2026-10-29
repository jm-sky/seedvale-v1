# Peasant body skeleton sharing (B′) — A/B, settlement-heavy

**Date:** 2026-10-29 · **By:** Claude Code (Sonnet 5.5) · **Classification:** diagnostic same-session A/B on one build, not a certified baseline.
**Decision: REVERT.** The structural effect is real, but there is no repeatable FPS gain beyond noise and p99 got worse in B. `main` carries no runtime change.

## 1. Revisions
- Base: `caa475abd8bc71bddbb7d016a27c6a5972ee5f60` (`main`).
- Experiment: `2bca37bcba8388d22d324c73733c03da695da59e` on local branch `exp/peasant-skeleton-sharing` (not pushed). Reproducible diff: [`2026-10-29--win-peasant-skeleton-sharing-experiment.patch`](./2026-10-29--win-peasant-skeleton-sharing-experiment.patch) (`git apply`; includes helper, real-asset tests, flags, counters).
- A and B are the **same build** (`2bca37bc`, `gitSha` verified per run); A = `?skelShare=0`, B = default. Only `scripts/perf/run-benchmark-series.mjs` (generic `SEEDVALE_QUERY` / `SEEDVALE_EVAL` env hooks) was kept on `main`.

## 2. Implementation (in the patch only)
- `src/characters/sharePeasantBodySkeleton.ts`: `sharePeasantBodySkeleton(sex, bodyMeshes)`, `disposeActorSkeletons(root)`, `isShareablePeasantBody` (outfit `Peasant` only; not `Peasant_Boots`/professions/legacy).
- `assembleCharacter` additionally returns `bodySkinned` (meshes that came with the body GLB, collected before head/hair/garments are rebound), so targets are identified by assembly ownership, not mesh names. Player behaviour unchanged. `NpcAgent.create` calls the helper after material/dye preparation and before `new NpcAgent` (hence before bounds); `NpcAgent.dispose` disposes each distinct actor skeleton once.
- Compatibility gate (all-or-nothing per actor, else original bindings): expected body mesh count (male 5 / female 4); `AttachedBindMode`; identical Bone objects in identical order; finite, invertible bind/inverse/world matrices; `T = inv(Ic[0])·Ip[0]` checked against **every bone** (`Ic[j]·T ≈ Ip[j]`, 1e-5; asset residual ≤1.4e-7); rebind with `Bind' = T·Bind`. No `calculateInverses()`/`pose()`; canonical inverses never mutated; idempotent. Algebra checked against Three 0.185.1 (`Skeleton.update`, `SkinnedMesh.bind/updateMatrixWorld`).

## 3. Correctness (real GLBs + real clips; vitest)
30 tests in `sharePeasantBodySkeleton.assets.test.ts` passed, plus 79 existing character/cull/appearance tests; `tsc` clean for touched files (pre-existing unrelated `ui-vue` errors), ESLint clean.
- Parity: all vertices, positions and shader-equivalent normals, through Idle, Walk, Sprint, Attack, Interact, Sitting, Kneeling, Death (7 samples each), wrapper translation + rotation + scale 0.6 + child scale 1.3: max difference ≤ 2e-5 m / 1e-4. Mutation check: dropping the `T·Bind` compensation makes 4 tests fail.
- Structure: same meshes/geometry/index counts/bind mode/Bone identity; head/hair/garments keep their own skeletons; two actors never share Skeleton or Bone; player assembly path stays unshared.
- Fail-open (all keep original skeletons and binds): perturbed inverse, reordered bones, different bone objects, missing bones, detached mode, singular, NaN inverse, NaN bind, wrong mesh count; second call idempotent.
- Bounds/picking/lifecycle: bounds sphere and box equal to unshared within 1e-3, `fallback = 0`, raycast hits identical (name, face, distance) standing and in the settled death pose; `SkeletonUtils.clone` rebuild keeps exact skinning (clone re-splits palettes); each palette disposed once, bone texture released, other actor and canonical inverses untouched.
- Correction to the recon: the male Peasant baseline is **4** Skeletons, not 5 (SkeletonUtils.clone keeps the two Arms primitives on one shared skeleton). Female is 4. Both → 1.

## 4. Structural / diagnostic result (`?skelStats=1`, separate runs diagA/diagB)
Live settlement-heavy, 38 Peasant actors admitted: eligible body meshes 163; body Skeletons **163 → 38**; no fail-open. `Skeleton.update()` executions on eligible bodies inside the 30 s window (counted between the benchmark window marks):

| | updates | rAF frames | updates / frame |
| --- | ---: | ---: | ---: |
| A | 49 898 | 818 | 61.0 |
| B | 10 640 | 760 | 14.0 |

Updates are executed `Skeleton.update()` calls only; palette uploads were not measured (a texture version bump is not an upload). Render submissions are unchanged by design (draws are workload-dependent, see below).

## 5. A/B (uninstrumented, order A B B A A B, one warm-up per variant discarded, 35 s cooldown, fresh profile, one Chrome at a time)
| Run | Var | FPS | p50 | p95 | p99 | RENDER p50/p95 | long frames | main calls | draws |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 1 | A | 29.3 | 34.8 | 40.5 | 44.2 | 28.0 / 32.7 | 2 | 1373 | 2098 |
| 2 | B | 28.8 | 34.2 | 42.3 | 91.9 | 27.3 / 31.7 | 16 | 1445 | 2164 |
| 3 | B | 30.8 | 32.8 | 39.2 | 75.0 | 26.6 / 31.0 | 4 | 1444 | 2162 |
| 4 | A | 26.2 | 36.2 | 67.4 | 95.0 | 28.7 / 34.6 | 31 | 1409 | 2126 |
| 5 | A | 30.5 | 33.1 | 38.7 | 42.2 | 26.3 / 30.8 | 4 | 1373 | 2095 |
| 6 | B | 28.6 | 34.8 | 41.2 | 90.7 | 26.7 / 31.7 | 15 | 1372 | 2093 |

Means: FPS A **28.7** [26.2–30.5] vs B **29.4** [28.6–30.8]; frame p50 34.7 vs 33.9; p95 48.9 vs 40.9 (A inflated by run 4); p99 60.5 vs **85.9**; RENDER p50 27.7 vs 26.9, p95 32.7 vs 31.5. GPU timer was available but spans `postprocess+labels` only and is not a per-NPC measurement; not interpreted.

## 6. Interpretation
- Noise: same-variant FPS spread is 4.3 (A) and 2.2 (B); the +0.7 FPS in B is well inside it. The ~0.8 ms RENDER p50 difference does not show up as a clean frame-time shift (A run 5 is faster than B runs 2 and 6). The noise threshold was not pre-registered; I used the same-variant spread as the yardstick.
- p99 was worse in all three B runs (92 / 75 / 91 ms) than in two of three A runs (44 / 42; A run 4 was 95). Hitch counts are mixed (A 2/31/4, B 16/4/15). Cause not investigated; not attributable to B′ from n=3, but it is the opposite of support.
- Population/workload: both arms had 53 NPC; main submissions differ by up to ~70 calls between runs (1372–1445), also within an arm (A: 1373–1409), so actor visibility was not perfectly matched; I did not control for it beyond the deterministic fixture.
- So: **removing ~47 of ~61 body skeleton updates per frame does not move frame time measurably** on this Arc 140V workload. The cost is evidently not dominated by palette flattening, in line with the CSS2D result.

## 7. Limits
n = 3 per arm, single session, power/thermal not logged, no browser/visual inspection of character rendering was done (only automated CPU-skinning parity), GPU-side palette uploads and Chrome trace not measured, `jsdom`-based tests not run. Same-session machine drift (A run 4) is visible.

## 8. Decision
**REVERT.** Criteria 3 and 4 fail (no repeatable improvement beyond noise; p99 worse). Branch kept locally and as the patch above. Not broadened to head/hair or other families.

## 9. Remaining evidence gaps
- NPC-only vs fauna-only render isolation and per-family attribution (the recon's step 3) to choose between mesh/material consolidation (A) and fauna work.
- Whether the three baseline long-frame clusters (A run 4) are machine noise.
- Note for the record: `NpcAgent.dispose` currently never disposes Skeleton bone textures (pre-existing; one texture per rendered skeleton per NPC). Not fixed here; a possible separate loose end.

Artifacts: `docs/performance/results/win/2026-10-29--win-skelshare-*` (warmup, diag, A/B run1–6).
