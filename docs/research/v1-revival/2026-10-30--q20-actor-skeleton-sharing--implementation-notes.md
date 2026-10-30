# Q20 — one skeleton per actor (Track A, A1) — implementation notes

**Date:** 2026-10-30 · **By:** Claude Opus 5.5 · **Commit:** `21fe07bd` · **Status:** implemented + technically verified; **off by default** (`?actorSkeletons=1` enables) until the WSL A/B. No browser/visual check done.

## Why

Q6 A0 counters ([WSL result](../../performance/results/2026-10-30--wsl-q18-stability-and-q6-a0-counters.md)): ~313 `Skeleton.update()` per frame in `settlement-heavy` (266 main + 47 shadow), ≈ 0.87 skeleton per skinned draw. Every update recomputes a 65-bone palette and re-uploads its bone texture. The reverted body-only experiment ([Windows A/B](../../performance/results/2026-10-29--win-peasant-skeleton-sharing-ab.md)) removed only ~47 of them (Peasant bodies); this slice covers every part of every NPC family and fauna.

## Asset census (shipped GLBs, through production `assembleCharacter`)

- All NPC parts (body primitives, heads, hair, beard, `eq/` garments) carry the same 65 Bone objects after the name rebind. No bone is ever missing.
- Body primitives, hair, beard, female heads and garments: inverse binds equal `Ibody[k]·T` (one constant factor per mesh) on every **weighted** bone, residual ≤ 2e-7.
- **Male head (`SuperHero_Male`) is the exception**: not a constant factor (forcing it gives 1.6 mm vertex error). It keeps its own skeleton. Male actor = 2 skeletons, female = 1.
- Eyes/eyebrows/hair weight only one bone, so the factor check must be over weighted bones only (over all 65 bones it fails at ~0.1).
- Garments and some hair/head files list the bones in a **different order** than the body → `skinIndex` remap needed.
- Fauna: cow/deer/donkey 7, horse 8, shiba 6, husky/stag/boar 5, fox/wolf 4, rat/sheep 2 skinned meshes, each with its own skeleton; all collapse to 1 exactly.

## What changed

- `src/render/actorSkeletonSharing.ts` — `shareActorSkeletons(root)`. Canonical skeleton = first skeleton with the most bones (the body for NPCs). Per mesh, fail open (keeps its skeleton) unless: `AttachedBindMode`, finite/invertible matrices, every weighted bone is a canonical Bone, and `Ipart[j] = Icanon[k]·T` within 1e-5 on all weighted bones. Then `bind(canonical, T·Bind)`; exact because attached-mode skinning is `Mworld⁻¹ · Σ w·BoneWorld·I · Bind`. A reordered part gets a cached shallow geometry copy (all attributes and the index shared by reference, so the same GPU buffers; only a new `skinIndex`), flagged `sharedGpu`, keyed per source geometry + mapping (bounded: parts × body bone orders). Loader bones, inverse binds and geometry are never mutated. Plans all rebinds before applying; idempotent.
- `NpcAgent` constructor: called on the actor wrapper before `installActorCullBounds` (covers kit and legacy-model NPCs). `AnimalAgent` constructor: on the per-spawn visual clone (wild fauna, livestock, rats). Player unchanged.
- `src/perf/flags.ts` — `isActorSkeletonSharingEnabled()` (`?actorSkeletons=1`).
- Dispose: unchanged. `disposeObject3D` already calls `skeleton.dispose()` per skinned mesh (Q15), idempotent for a shared skeleton; remapped geometries are `sharedGpu` and skipped.

## Verification (technical only)

`src/render/actorSkeletonSharing.assets.test.ts` — 68 tests, real GLBs + clips, CPU skinning, parts as clones of one cached parse (like production):

- Every outfit × sex (Base head, hair, beard/garments): skeleton count male 2 / female 1, vertex parity ≤ 2e-5 m through Idle, Walk, Sprint, Attack, Interact, Sitting, Kneeling, Death (wrapper translation/rotation/scale + child scale).
- Every head × hair × sex: parity through Walk, Attack, Death.
- Bounds/culling (`installActorCullBounds` result, `frustumCulled`, spheres), raycast picking (object, face, distance) at bind pose and settled death pose (corpse) identical.
- Loader bones/inverse binds/`skinIndex` unmutated; remapped geometry shares `position`/index; same appearance → same cached geometry; two actors never share Skeleton or Bone; idempotent.
- Dispose: bone texture disposed exactly once; remapped geometry not disposed.
- `SkeletonUtils.clone` of a shared actor keeps exact skinning.
- All fauna GLBs → 1 skeleton, parity through their first clips; legacy `Worker.glb` rig exact.
- Mutation checks: dropping the `T·Bind` compensation fails 64 tests; forcing the male head (tolerance 1) fails 33.
- `src/ai`, `src/fauna`, `src/characters`, rats: 1 793 tests green; `tsc` clean except the pre-existing `ui-vue` demo errors; ESLint clean.

## Why off by default / not yet measured

The WSL A/B was not run in this session: three other agent sessions were live in WSL, and the runbook warns a benchmark VM crash kills every WSL process. D4: enable only after a WSL green light (CPU-slice rule).

## A/B instructions (WSL first, then Windows)

Same build, `settlement-heavy`, fixture `tools-001-v1`, High, 30 s, fresh profile, 20 s cooldown, order A B B A, nothing else heavy in WSL:

```text
# A (off, current default)
node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/wsl q20-A 1 20 settlement-heavy
# B (on)
SEEDVALE_QUERY='&actorSkeletons=1' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/wsl q20-B 1 20 settlement-heavy
```

- **Structural (expected, decides the "estimate" half of the CPU-slice rule):** Pass Submissions `Skeletons first used` main ~265 → about drawn NPCs × (1 female / 2 male) + drawn animals; shadow 47 → lower. Skinned calls and actor calls unchanged (draws are untouched by design).
- **Guards:** mean FPS, frame p50/p95/p99, RENDER p50, hitch/long-frame counts — no regression in B.
- Green → set the default on (flip `isActorSkeletonSharingEnabled` to `?actorSkeletons=0` disables) and list for the Windows A/B (queue §4); same metrics. Revert if Windows regresses or the visual check fails.

## Visual check (author, queue §2)

NPCs of several families (male/female, skirts/bodice, beards, hair styles, professions) and multi-part animals (horse, cow, dog) with `?actorSkeletons=1` vs default: walking, working, sitting, combat, death/corpse — no seams, no detached parts, faces/eyes in place.
