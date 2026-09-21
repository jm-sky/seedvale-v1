# Implementation Notes: ui-input-027 — Interaction candidate dropped-item scaling

**Status:** `verification needed` 🔍

## What was implemented

- `createDroppedItems()` maintains a runtime-only XZ bucket index and monotonic source-order map; `queryNear(x, z, radius)` returns exact-radius matches in insertion order. Index insert/remove runs on `drop()`, hydrate, and `disposeNode()`; `dispose()` clears all index state.
- `groupDroppedItemCandidates()` uses per-slice spatial buckets for union edges (exact `DROPPED_ITEM_GROUP_RADIUS` predicate), single-pass root→members assembly, and returns `DroppedItemGroupCandidate` with `first` for prompt metadata.
- `buildInteractables()` calls `queryNear` once at `GAZE_RANGE + DROPPED_ITEM_GROUP_RADIUS` and no longer rescans `nodes()` per group for freshness.
- Tests extended in `src/app/interactables.test.ts` and `src/items/createDroppedItems.test.ts`. Browser verification not performed (User-owned).

## Current code facts

- Hot path is exactly `gameLoop.tick → buildInteractables()`; `src/app/interactables.ts` currently calls `groupDroppedItemCandidates(droppedItems.nodes())` every frame.
- `groupDroppedItemCandidates()` is global O(D²): pairwise union, then full-array rescans per component. `buildInteractables()` additionally calls `droppedItems.nodes().find(...)` once per emitted group to recover freshness.
- `src/items/createDroppedItems.ts` owns the authoritative runtime dropped-record array. Drop X/Z is immutable after insertion; falling changes only mesh Y. This makes an incremental XZ index registry-owned and low-risk.
- All removals already converge through private `disposeNode()` (`collect`, `consume`, perishable cleanup), so index removal belongs there. Initial records and `drop()` are the only insertion paths.
- Existing tests for grouping live in `src/app/interactables.test.ts`; extend them rather than creating a parallel interaction test harness.
- The performance audit source is `docs/reviews/codebase-domain-audit/2026-09-19--24--performance-and-workers.md` F24-1.

## Recommended implementation shape

Extend `DroppedItems` with one read-only local query, e.g. `queryNear(x, z, radius)`, backed by a runtime-only coarse XZ bucket index inside `createDroppedItems()`.

Use a cell size derived from `DROPPED_ITEM_GROUP_RADIUS` or another small fixed size appropriate to this query. The query must:
- inspect all cells intersecting the requested disk/halo;
- apply an exact squared-distance predicate after bucket lookup;
- return records in the same stable source/insertion order as `nodes()`.

Do not reuse/import `src/fauna/faunaProximity.ts`: it is fauna-specific and rebuild-oriented. Its pattern is useful precedent only (coarse buckets + exact predicate). Dropped items should maintain buckets incrementally because their X/Z is stable.

To preserve source order without scanning the global `items` array every frame, keep a runtime-only monotonic order value per dropped id (initial array order, then append order) and sort only the local result by that order. Remove its entry together with the bucket entry in `disposeNode()`. No persistence change is needed.

`buildInteractables()` should call the dropped source once, group that returned slice, and receive enough data from grouping to build the prompt without re-looking up the first id. Prefer returning the first `DroppedItem` (or its `foodBatch`) as part of the group result rather than adding another registry lookup.

## Query radius / grouping boundary

`GAZE_RANGE` (5 m today) is the effective maximum ordinary interaction-candidate range in `buildInteractables()`, not `INTERACT_RANGE` (2.5 m). Query around the player with a grouping halo of at least `DROPPED_ITEM_GROUP_RADIUS`, then let the existing interaction selection keep its final range semantics.

There is a real edge case in the plan wording: current whole-registry union-find allows arbitrarily long transitive same-kind chains. A strictly bounded local query cannot also preserve membership of a chain extending indefinitely outside the query radius. Do **not** reintroduce global scans to preserve that pathological behavior.

Preserve transitivity for all records returned by the local query and include the one-radius halo so directly adjacent members at the interaction boundary are not split. Add a focused boundary test documenting this contract. If implementation instead chooses connected-component expansion through the index, it must remain index-driven and proportional to the intersecting component, never fall back to scanning all drops.

## Lifecycle pitfalls

- `disposeNode()` currently finds the authoritative record with `items.findIndex()`. That non-frame pickup/removal cost is outside this plan; do not broaden scope unless required by the index bookkeeping.
- `reconcilePerishableLifecycle()` removes through `disposeNode()`; ensure bucket/order cleanup happens there automatically.
- `dispose()` must clear buckets/order metadata.
- `settleNear()` and `tick()` do not change record X/Z, so they must not touch the index.
- `instance` and `foodBatch` records still participate in the local query but remain singleton groups.
- Stable group identity remains `memberIds[0]`; bucket iteration order must never become identity order.

## Grouping implementation

Once input is local, the existing union-find is acceptable for tiny local sets, but the plan explicitly asks to remove all-pairs grouping. Use per-kind local buckets/neighbour lookup while constructing union-find edges, applying the exact `DROPPED_ITEM_GROUP_RADIUS` squared-distance check. Keep singleton treatment for `instance`/`foodBatch`.

Avoid the second O(N²) reconstruction pass: build root → group metadata in one source-order pass after unions. This also naturally preserves member order.

## Verification

Extend `src/app/interactables.test.ts` for existing grouping cases plus:
- negative cell coordinates / bucket boundary;
- source order across multiple buckets;
- query halo at `GAZE_RANGE`;
- large global population with a small local result (assert result/candidate count, not wall-clock time);
- freshness prompt path uses the carried first record rather than a second global lookup.

A small direct `createDroppedItems()` query test is appropriate because lifecycle/index ownership lives there. Browser verification remains user-only.
