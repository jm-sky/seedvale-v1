# Q16 — Occluded-actor cohort ceiling (Track A) — implementation notes

**Created:** 2026-10-30 by Claude Opus 5.5 (queue Q16)  
**Source:** [visibility analysis](./2026-10-30--npc-fauna-visibility-v2-analysis.md) §4.1–3 + Opus assessment; prerequisite Q6 A0 counters (done).  
**Status:** tooling landed, **no runtime behaviour change by default** (everything gated by `?actorCohort=`). Census numbers and the A/B need a benchmark run (author Windows session, [P1 exit packet](./2026-10-30--p1-exit-packet.md) §3 S6).

## Question

How much RENDER/frame time would a *perfect, zero-cost* occlusion test save in the fixed `settlement-heavy` view, if it hid only living actors that are fully behind building walls? If that ceiling is within noise (< ~2 ms RENDER on Windows), no detector can help and the §4.4 detector is closed.

## What landed

- `src/perf/occludedActorCohort.ts`
  - `censusOccludedActors` — once per benchmark, after the population gate and before the measured window. For every living NPC/livestock/wild-fauna actor with renderable meshes whose (10 % inflated) world box intersects the camera frustum, casts rays from the camera to a 3×3×3 grid over the box against **opaque settlement meshes only** (`classifyObject === 'settlement'`; hits on transparent, alpha-tested or invisible materials are see-through, per face material). An actor is in the cohort only if all 27 samples are blocked; the first visible sample ends the test, so visible actors cost ~1 ray. Rows: stable simulation id (`NpcAgent.id` / `animalId`), family, kind, camera and player distance, near/far split at 36 m (`AGENT_PRESENTATION_MID_DISTANCE_M`, the actor shadow/presentation gate), mesh/skinned/shadow-caster counts.
  - `createActorCohortMask` — wraps the beauty render (`postProcessing.render()` in `gameLoop.ts`). Mode `mask`: hides the cohort's visible **meshes** (never the actor root, never groups/lights) for the camera passes and re-shows them for `renderer.shadowMap.render`, which three r185 calls inside the same `render()` after main projection — so shadow submissions and their skeleton updates (`WebGLObjects.update`) stay identical. Everything is restored in `finally` before the label pass and the next simulation tick. Mode `census`: same per-frame revalidation, no hiding (A arm with equal overhead).
  - Revalidation per frame (O(cohort)): an actor that moved > 5 cm, died, or had its root hidden (corpse concealment) leaves the cohort for good; any camera movement > 2 cm / tiny rotation disarms the whole mask. Never re-adds actors — it can only under-estimate the ceiling.
- `benchmark.ts`: runs the census, arms/disarms around the measured window, stores `report.occludedActorCohort = { census, mask }` and appends a `[Seedvale Occluded Actor Cohort]` section to the markdown report.
- `createApp.ts`: `actors()` host accessor (loaded settlement NPCs + livestock + wild fauna).
- `?benchYaw=<radians>` (`src/perf/flags.ts`): camera yaw for URL-autorun benchmarks, needed for the open-view control.
- Tests: `occludedActorCohort.test.ts` (census: behind wall, wall edge, transparent blocker, dead/out-of-frustum; mask: main hidden / shadow visible / restored, census mode inert, move/death/camera drop), `flags.test.ts` (`parseBenchmarkYaw`).

Hard constraints respected: root `mesh.visible` (corpse ownership) untouched; AI, movement, mixers, needs, persistence untouched; no ghosts, no unloading, no simulation change; shadows unchanged.

## Known limits

- Blockers are settlement meshes only (analysis §4: building walls); terrain and trees are ignored → the ceiling is for building occlusion only.
- The census is a single snapshot of a fixed view. NPCs walking around shrink the cohort during the window (`cohortStart → cohortEnd`, `droppedMoved`); the report shows by how much.
- Mask mode adds a cohort subtree traversal per frame (small: cohort × actor nodes). It is part of the B arm and makes the measured saving slightly pessimistic.
- Hiding a mesh also hides its children; a light parented under an actor mesh (not under a bone/group) would be hidden too. Grep 2026-10-30: no NPC/fauna code creates lights (point lights come only from the player torch, settlement campfires/house lighting, the light-budget pool and debug/tool viewers).

## A/B instructions (author Windows; WSL may run the same for a diagnostic)

Fixture `tools-001-v1`, fresh profile per rep, High preset, `settlement-heavy`, order A B B A:

```text
A: SEEDVALE_QUERY='&actorCohort=census'
B: SEEDVALE_QUERY='&actorCohort=mask'
```

n = 3 per arm. Then the **open-view control**: the same A/B with `&benchYaw=<yaw>` for a view where the census reports `fully occluded: 0` (take the default yaw from `report.context.cameraControl`/`cameraPose`, try `yaw + π`; check the cohort section of the first rep). n = 2 per arm. B − A in the control must be within noise; otherwise the mask itself costs time and the main result is invalid.

Read per run: `[Seedvale Occluded Actor Cohort]` (cohort size, near/far bands, `cohort start → end`, masked frames, hidden meshes avg) and `[Seedvale Pass Submissions]` Main/Shadow (`actor: calls`, `skeletons first used`).

**Decides:** RENDER p50 and frame p50 (guards p95/p99, long frames). Check: Shadow pass actor calls equal between arms; Main actor calls drop by ≈ the hidden mesh count. **Ceiling ≥ ~2 ms RENDER** → open the §4.4 detector as a new queue task (O). **Below** → close the detector in the P1 exit packet §2. Far-band cohort members (> 36 m, no shadow) show the extra skeleton saving; near-band ones only lose main-pass draws.

No FPS claim follows from this experiment — it is an upper bound, not a deployable optimization.
