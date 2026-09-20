# Implementation notes: npc-061 — time-skip and reification surface placement validity

**Plan:** `docs/plans/npc-061-time-skip-and-reification-surface-placement-validity.md`  
**Recon basis:** current `main`, 2026-09-20

## Core decision

Do not make coarse travel/time-skip depend on chunk residency. Keep `NpcTravelContinuity` and schedule resolution streaming-independent; validate only the **detailed materialization boundary** against the same resident surface/collider rules live NPC locomotion uses.

This plan depends on `world-terrain-044`. Its notes define the required split:
- coarse/analytical `sampleHeight` remains available off-screen;
- detailed NPC movement receives a separate nullable resident movement surface;
- missing resident ground blocks/holds detailed movement instead of falling back to analytical terrain.

Implement npc-061 against that contract after 044 lands; do not recreate its availability API in NPC code.

## Current behavior to change

`NpcAgent.resolveTimeSkip()` has two relevant paths:
- ordinary schedule catch-up resolves the semantic home/work target and `applyTimeSkipPlacement()` delegates to `placeNpcAfterTimeSkip()`;
- committed travel calls `catchUpCommittedTravel()`.

`placeNpcAfterTimeSkip()` currently:
- correctly preserves cave/mouth behavior by holding current cave-valid XYZ;
- for surface placement accepts schedule X/Z unconditionally and derives Y from coarse `sampleHeight`.

Committed-travel reconstruction/catch-up calls `reifyNpcTravel()`, then places the mesh at `reified.lastPosition` with sampled height. `reifyNpcTravel()` is intentionally pure travel-continuity math: it interpolates X/Z and drops off-screen `execution` so detailed runtime owns progress.

Do **not** put terrain/collider dependencies into `npcTravel.ts`; travel remains the spatial/time authority and must stay usable off-screen.

## Placement-validity seam

Add one NPC-owned surface materialization helper, preferably beside `placeNpcAfterTimeSkip()` in `npcMovementRecovery.ts`, that accepts injected queries rather than importing ChunkManager.

It should distinguish at least:
- valid detailed surface point -> resolved XYZ;
- resident surface unavailable -> hold/defer;
- resident surface available but invalid -> bounded deterministic local fallback or hold.

The helper should use the resident movement-ground sampler introduced by 044 for Y and availability. It must not call coarse `sampleHeight` as a fallback after resident ground reports unavailable.

For an available candidate, reuse the existing live NPC rules rather than inventing classifiers:
- current NPC water gate is the live `NpcAgent.isWalkable*()` rule (today global `waterLevel + WATER_MARGIN`; bridge-aware ground already prevents deck-as-water behavior);
- shared collider source plus `colliderActiveAtY()`;
- `isPointWalkableForNpc()` / exterior semantics from `npcColliderRim.ts` as appropriate;
- slope/step constraints from the 044 resident-aware `slopeConstraint.ts` contract.

Do not broaden this plan into local river-water redesign. If another prerequisite changes live NPC water traversal before implementation, materialization must consume that new live rule rather than preserve today's global-plane check.

## Collider detail

Validate colliders at the **resolved resident Y**, not at the old mesh Y. `Collider` supports `minY/maxY`; `colliderActiveAtY(collider, y)` is the shared filter.

For schedule/time-skip final placement, use strict recovery semantics: a point inside a collider should not become valid merely because destination-aware live locomotion can approach a collider rim for an interaction. `isExteriorPoint()` plus Y-filtered nearby colliders is safer for a teleport/materialization endpoint.

Do not add collider geometry logic outside `world/collision.ts`.

## Bounded fallback

Reuse the deterministic ring approach already represented by `sampleNearbyExteriorPoint()` / `localEscapeRadii()`, but candidate acceptance must include resident-ground availability + Y-aware collider/water/slope validity.

Important constraints:
- deterministic ordering; no `Math.random()` for authoritative relocation;
- small fixed radii/sample count;
- no A*, route replay or chunk generation;
- no home/plaza teleport fallback;
- if no valid resident candidate exists, keep the current valid live position (time skip) or defer reification (off-screen travel).

A fallback candidate must derive its own resident Y before collider validation.

## Travel reification: preserve execution until placement succeeds

This is the main lifecycle trap.

`reifyNpcTravel()` removes `execution`. Therefore do **not** commit the reified travel object before validating its interpolated point. Otherwise an unavailable/invalid resident surface can accidentally convert off-screen ownership into detailed ownership while the NPC was never materialized.

Preferred flow:

```text
travel continuity
→ interpolate candidate at nowDays (no mutation)
→ validate/materialize candidate
→ success: reifyNpcTravel() + commit mesh/state
→ unavailable/invalid without fallback: keep original travel execution and defer detailed placement
```

Use `interpolateNpcTravelPosition()` for the pre-validation candidate. Keep ETA/interpolation unchanged.

For time-skip catch-up of an already-live NPC, similarly avoid stamping/reifying travel to an invalid point before placement succeeds. If the endpoint cannot be materialized, retain the prior valid live XYZ and preserve travel continuity consistently.

## Cave boundary

Keep the existing `placeNpcAfterTimeSkip()` cave branch intact:
- `usesCaveRecoveryDomain()` decides cave/mouth ownership;
- `caveIdForRecovery()` + `npcCaveGroundY()` resolve cave floor;
- failure holds current Y;
- never pass cave endpoints through resident surface validation.

This plan is surface-only. Do not route cave/mouth placement through `sampleRuntimeSurfaceGround` or any surface fallback.

## Likely integration points

- `src/ai/npcMovementRecovery.ts`
  - extend surface time-skip placement with the validated-materialization helper/result;
  - preserve cave branch.
- `src/ai/NpcAgent.ts`
  - `applyTimeSkipPlacement()`: supply live collider/water + 044 resident-ground dependencies;
  - `catchUpCommittedTravel()` and constructor/reconstruction reification path: validate before committing `reifyNpcTravel()`;
  - reuse the same acceptance primitive used by live exterior movement where semantics match.
- `src/ai/npcTravel.ts`
  - normally no ownership change; reuse `interpolateNpcTravelPosition()` and `reifyNpcTravel()`.
- `src/ai/npcColliderRim.ts`
  - reuse deterministic exterior/ring helpers; only extend pure helpers if needed to avoid duplicating logic.
- focused tests in existing `npcMovementRecovery.test.ts`, `npcMovementCaveIntegration.test.ts`, `npcTravel.test.ts` or a small materialization-specific test file.

Do not create a new manager/registry.

## Tests worth protecting

Prioritize contract tests over large integration fixtures:

1. resident ground unavailable -> no analytical fallback and no committed reification;
2. resident ground available + collider active at resolved Y -> target rejected;
3. Y-banded collider inactive at resolved Y -> does not falsely reject;
4. water-invalid target -> rejected using the same NPC rule as live movement;
5. deterministic nearby valid candidate -> accepted with its resident Y;
6. no valid bounded candidate -> current live placement/travel execution preserved;
7. valid travel candidate -> `reifyNpcTravel()` still preserves purpose/survival/arrival metadata and clears execution exactly as today;
8. cave/mouth time skip remains `hold-cave-endpoint` and never invokes surface validation;
9. no `findPath()`/local A* is called by materialization.

## Scope traps

- 044 explicitly says coarse/time-skip queries remain streaming-independent; npc-061 changes only the point where an NPC becomes detailed.
- Do not make `NpcAgentDeps.sampleHeight` resident-only globally.
- Do not move placement authority into `npcTravel.ts`.
- Do not solve local-water architecture here.
- Do not trigger chunk loading from NPC materialization.
- Do not persist fallback search state; retry from authoritative travel/schedule state when runtime surface becomes available.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
