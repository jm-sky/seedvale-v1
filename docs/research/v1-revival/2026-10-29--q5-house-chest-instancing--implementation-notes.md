# Track B Q5 — interior house chests instanced per settlement: implementation notes

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Commit:** `b2691195` · **Status:** implemented and technically verified. Browser/visual acceptance is **pending** (queue §2). WSL A/B: [report](../../performance/results/2026-10-29--wsl-q5-house-chest-instancing-ab.md). Native Windows confirmation: queue §4.

## What landed already (verified before choosing)

- Wood-pile tiers (`4347c274`, `woodPileTiers.ts`) and lantern template merge (`405742dc`) are in `main`. Candidate #1 of the [Track B shortlist](./2026-10-28--settlement-track-b-next-optimization.md) is done. This slice is **candidate #2** (residual interior chests).

## Mechanism

- **Before.** `buildSettlementProps` (`settlement/props.ts`) created one procedural `createPlacedContainerProp()` group for every house with a `chest` furniture entry: five meshes (body, lid, two straps, clasp) and two new materials per house, parented to the house.
- **After.** The house loop pushes `houseChestPlacement(hut, furniture)` into `chestPlacements`. After the loop, one `buildInstancedProps([createPlacedContainerProp()], chestPlacements, 'settlement-house-chests')` group joins the settlement group, tagged `storageContainer`. That is five `InstancedMesh` draws per settlement, whatever the house count.
- **Transform.** `houseChestPlacement` maps the furniture position through the house matrix (Y yaw, uniform scale, translation). It uses house yaw + furniture yaw and cancels the house scale as the child path did. A parity test compares every part's world matrix against the old child path, including a non-unit house scale and off-origin positions (float32 tolerance).
- **Shadows.** `buildInstancedProps` copies each part's flags: body cast + receive, lid cast, straps and clasp neither (test).
- **Toggle.** `?chestInstancing=0` (`perf/flags.ts` `isChestInstancingEnabled`, read once per settlement build) restores the per-house groups.

## Identity and lifecycle

- Nothing reads the interior chest mesh. Interaction and storage use `landmarks.householdStorages` and settlement-storage positions, not furniture meshes. Inventory, persistence and household identity are untouched.
- The template is created per settlement build and owned by the settlement group. `disposeSettlementGroup` → `disposeObject3D` releases its geometry, materials and the instance buffers, as it did for the per-house groups. The template is not marked `sharedGpu`, so nothing is leaked or double-owned.
- Player-placed and worldgen containers (`placedContainers`, `createPlacedCrateProp`) are unchanged.

## Visual identity and known differences

- 🟡 **Culling granularity.** Culling is now one bounding sphere per settlement per part, instead of per house. Chests outside the view frustum but inside the settlement sphere are submitted as part of the same draw. Triangles are unchanged per chest (they were already tiny: 9k in the census for 122 instances). No shading, material or position change is expected.
- Reflection layers: none are set on settlement content, so mirror behaviour is the same default as before.

## Files / tests

`src/settlement/props.ts` (`houseChestPlacement`, chest placement collection, instanced group), `src/perf/flags.ts` (`isChestInstancingEnabled`), `src/settlement/houseChestInstancing.test.ts` (transform parity × 3, shadow policy and one bucket per part).

`vitest src/settlement src/render src/perf`: 1 447 passed (before the parity test fix; the test file then passed 4/4). `vue-tsc` and ESLint are clean.

**Not covered automatically:** full `buildSettlementProps` with real house definitions; checked by the benchmark census (instances unchanged, 122) and the visual check.
