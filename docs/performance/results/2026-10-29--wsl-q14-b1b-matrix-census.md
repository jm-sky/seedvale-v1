# Q14 B1b — static subtree matrix freeze: census and deferral

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Platform: WSL2** (structural node counts only; no timing claim).
**Verdict: B1b deferred.** After B1a, the remaining static-owner share is too small to resolve with n = 3 and does not justify the lifecycle risk. B1a remains the kept Q14 result ([Windows A/B](./2026-10-29--win-q14-frame-matrix-once-ab.md)).

## Instrument

- `src/perf/matrixCensus.ts` (`ea33b4d3`) adds a **Matrix work** section to every benchmark report. For one `scene.updateMatrixWorld()` it counts visited, composed (`matrixAutoUpdate`) and re-multiplied nodes. It reports them by scene bucket and by top-level scene owner.
- It models the steady state of three r185 `Object3D.updateMatrixWorld`. A node re-multiplies when it composes or an ancestor did. One-shot `matrixWorldNeedsUpdate` flags are ignored.
- The census runs once after the measured window, so it adds no workload.
- Artifacts: `wsl/2026-10-29--wsl-q14-b1b-census-settlement-heavy-rep1.*` (fixture `tools-001-v1`, settlement-heavy, 53 NPC, SHA `ea33b4d3`).

## Census (one traversal, settlement-heavy)

| Bucket / owner | Nodes | Re-multiplied | Skinned | Can freeze? |
| --- | ---: | ---: | ---: | --- |
| Fauna (91 roots, 74 drawn) | 4 345 | 4 345 | 364 | No: animated bones |
| NPC (53 roots, all drawn) | 4 158 | 4 158 | 501 | No: animated bones |
| Settlement (5 groups) | 2 440 | 2 440 | 0 | Partly, see moving parts |
| Items (`chunk-items` ×46) | 816 | 816 | 0 | Mostly |
| Environment (`chunk-environment` ×6) | 478 | 478 | 0 | Mostly |
| Vegetation | 263 | 263 | 0 | Mostly |
| Terrain / grass / water / river chunks | 221 | 221 | 0 | Yes |
| Other (unnamed `Group` ×98, GLB roots, lights) | 785 | 785 | 9 | Unknown owners |
| **Total** | **≈13 500** | **≈13 500** | 874 | |

Every node composes and multiplies every traversal. No owner opts out yet. The `Scene` root also forces the cascade.

## Why B1b is deferred

- **Ceiling.** Actors make up 63 % of the traversal and must update. Freezing every static owner would remove at most ~35 % of one traversal. The Windows trace with B1a on (`trace-results/trace-settlement-heavy-8a2bea88-q14-B.cpu-profile.txt`) puts the whole per-frame update at ~1.9 s of a 29.5 s profiled window (`beginFrameSceneMatrices`), about 2 ms/frame under the profiler. Freezing skips compose and multiply, not the recursion itself. 🟡 The realistic B1b saving is therefore ~0.3–0.7 ms/frame on Windows. That is below the resolution the Q1 review found for n = 3 A/Bs.
- **Q1's 2–4 ms estimate is mostly spent.** It assumed three full traversals per frame. B1a already reduced that to one.
- **Moving parts inside "static" owners.** Freezing a node whose transform still changes leaves it visibly stuck. Without a runtime guard, nothing would detect that. Known writers inside settlement groups:
  - door hinges (`houseBuilder.ts` hinge `rotation.y`);
  - the logging wagon repair pose (`props.ts`, `createSettlement.ts`);
  - player/placed fire piles (`PlacedFires.ts` `scale.setScalar` by fuel);
  - fire/lamp visuals (`campfireProps.ts`, `houseLighting.ts`, flame particle pools).

  Wood-pile and storage tiers add or swap children, which is safe. A safe B1b needs per-owner opt-in plus a dev check that compares frozen nodes' composed transforms with their matrices.

## If B1b is revisited

Revisit only if a later trace shows matrix update as a top self-time item again, for example after Track A reduces actor cost. Then:

1. Set `scene.matrixAutoUpdate = false`. Without this, nothing below the root benefits.
2. Freeze the chunk-level roots in `chunkManager.ts` (terrain/water/river/grass/environment). They are positioned once at build.
3. Freeze settlement static builders by opt-in: house static batches, fences/palisades, decor, plaza, landmarks. Moving nodes stay `matrixAutoUpdate = true`. New children default to auto, so add/swap stays safe.
4. Add a `?matrixFreezeCheck=1` dev guard that logs frozen nodes whose transform no longer matches `matrix`.
5. Verify with this census (multiplied count), then run the A/B with RENDER p50 primary.

Larger actor-side items from the same census belong to Track A (Q6 A0): 874 skinned meshes each invert `bindMatrixInverse` every traversal (`SkinnedMesh.updateMatrixWorld`), plus per-mesh `Skeleton.update` in render.
