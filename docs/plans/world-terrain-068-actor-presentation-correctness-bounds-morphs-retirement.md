# Plan: Actor presentation correctness — animated bounds, garment morphs, actor retirement

**Created:** 2026-11-06
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `rendering`
**Tags:** `rendering` `actors` `lifecycle` `v1-revival` `review-041`
**Roadmap:** -

## Goal

Fix the confirmed actor-presentation correctness and lifetime defects from the [review 041 synthesis](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md) (priority classes **A1** and part of **A2**), each as an independently verifiable stage in the existing owners. No FPS claim; these are correctness fixes.

| Stage | Findings | Owner (verified 2026-11-06 at `917f1491`) | Queue |
| --- | --- | --- | --- |
| **A1** animal animated bounds | F16-24 (S3-6 + S3B-1), guardrail F16-26 | `src/fauna/AnimalAgent.ts` (wild + livestock templates), `src/render/actorCullBounds.ts` | Q173 |
| **A2** garment named morphs | F16-27 (S3B-3) | `src/characters/assembleCharacter.ts` (`rebindSkinnedMeshes`, `new SkinnedMesh(src.geometry, src.material)` ~L73), `src/characters/bodyBuild.ts` | Q174 |
| **A3** actor retirement | F16-19 (S3-1 + S3B-4), F16-20 (S3-2 + S3B-5) | `src/player/PlayerController.ts` (`replaceModelRoot` ~L942), `src/settlement/SettlementsManager.ts` (`dispose` ~L1849), `src/settlement/livestock.ts` (retire paths `disposeObject3D(agent.mesh)` ~L1147/L1267) | Q175 |

## Verified current code (2026-11-06)

- **A1:** `installActorCullBounds` is called only from `NpcAgent.ts` (~L1911). Animals keep Three r185 native lazy `SkinnedMesh` bounding spheres computed once at first frustum test (current pose); mixer updates never refresh them. Review 039 measured shipped wolf/deer/horse `Walk`/`Gallop`/`Death` vertices outside the frozen sphere (CPU probe at `7c6ea3c4`, not rerun).
- **A2:** the rebind creates a fresh `SkinnedMesh` from geometry + material only; the source mesh's GLTF-assigned `morphTargetDictionary` names and owned `morphTargetInfluences` are not carried, so name-driven body-build weights (Heavy/Slim) reach the body but not garments (039 production probe: numeric names, zero garment weights on WorkSkirt/NobleBodice).
- **A3 player:** `replaceModelRoot` calls `disposeOutfitMaterialClones(this.modelRoot)` and `removeFromParent()` but never `disposePlayerVisual(old)` (skeleton bone texture, accessory geometry). Survivors that must be reparented first: torch belt socket, held-tool swing pivot, equipment visuals (`remountEquipmentVisuals`).
- **A3 livestock:** `SettlementsManager.dispose()` calls `animal.dispose()` for detached livestock; `AnimalAgent.dispose()` releases claims/corpse/label/pack visual but not `this.mesh` resources — normal retire paths in `livestock.ts` additionally call `disposeObject3D(agent.mesh)`.

## Scope and direction

- **A1:** install conservative animated bounds for animals through the existing actor-bounds owner (extend `actorCullBounds.ts` with a quadruped/species envelope, or an analogous pose-envelope sampled once per template from its shipped clips — decide in recon from cost). Unsupported rigs/scales **fail open** (`frustumCulled = false`). Covers clones/scale, death/corpse pose, mounted animals and shadow-camera culling. Retain actor-local skeleton sharing unchanged (F16-26: add a parity assertion to the existing `actorSkeletonSharing.assets.test.ts` fixtures so a future rig change cannot silently break the bounds assumption).
- **A2:** preserve per-mesh morph names and an actor-owned influence array in the existing rebinding path (never share the influence array across actors); body-build application keeps its current call sites. Do not change which build an NPC gets.
- **A3:** player — retire superseded actor-owned resources after survivors are reparented; shared GLTF cache must survive (`disposeObject3D` already skips shared assets — verify for the player path). Livestock — reuse the established full livestock retirement at manager terminal teardown only; do not add a second disposal helper.

## Non-goals

No global animated instancing, cross-actor palette pooling, actor LOD changes (F16-23 → [world-terrain-050](./world-terrain-050-agent-performance-render-census-and-lod.md)), animation cadence (F16-22), or fauna behaviour changes.

## Verification ("done when" per stage)

- **A1:** CPU real-asset fixture (extend `src/render/actorCullBounds.assets.test.ts`): every sampled vertex of every species' clips (incl. death) inside the installed bounds for clone scales in use; fail-open path tested. Census of fauna draw/shadow calls before/after on `?seed=415424794` (conservative bounds may add edge draws — record, no FPS claim; keep the change revertable as one commit and list it in queue §4 if the draw delta is non-trivial). Browser: animals at screen/shadow edges do not pop → §2.
- **A2:** test through production assembly: garments on Heavy/Slim have named dictionaries matching the body and non-zero weights; two actors with different builds keep independent weights. Browser seam check (both sexes, roles with skirts/bodices) → §2 (author look: intended fit restoration, but visible).
- **A3:** spies for A→B→C successful outfit swaps: each superseded root's owned skeleton/geometry/material disposed exactly once, live equipment/held tool/torch survive, cache entries not disposed. World rebuild with detached + reclaimed livestock: owned resources disposed once, no double free. Optional: renderer `info.memory` plateau over repeated swaps (browser).
- Common: `pnpm run type-check`, targeted `pnpm vitest run`, lint on touched files; JSDoc on changed public functions (`@domain`).

## Stop if

- A1 needs per-frame CPU skinning or per-frame bounds recompute → stop, report cost options (§3).
- A1 forces culling off for whole species → measurable draw increase; land behind a revertable boundary and ask before default.
- A2 shows garment GLBs lack morph targets matching body-build names (asset gap) → record per asset in §3; no code workaround.
- A3 requires changing equipment/held-tool ownership contracts.
