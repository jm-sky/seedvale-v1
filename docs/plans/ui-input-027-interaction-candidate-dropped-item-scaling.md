# Plan: Interaction candidate dropped-item scaling

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** S  
**Depends on:** none  
**Domain:** `ui-input`  
**Subdomains:** `interaction`  
**Type:** `optimization`  
**Roadmap:** -

## Goal

Remove the unbounded quadratic dropped-item grouping work from the per-frame interaction candidate path while preserving current grouped-pickup behavior and stable interaction semantics.

This is a focused optimization of the existing `buildInteractables()` mechanism. It must not create a second interaction manager.

## Problem

Current frame flow:

```text
gameLoop.tick
→ buildInteractables(...)
→ groupDroppedItemCandidates(droppedItems.nodes())
```

`groupDroppedItemCandidates()` performs pairwise comparisons across the whole dropped-item registry and rescans the same array while reconstructing groups. `buildInteractables()` then performs another linear `find` per group.

The resulting common implementation cost is O(D²) with multiple per-frame temporary arrays/sets, where D is total dropped-item count rather than nearby relevant count.

Dropped items are player/world runtime state and may accumulate across a long session, so this path must not scale quadratically with global history.

## Scope

### 1. Narrow candidates before grouping

Use player position and the existing interaction range contract to request or derive only dropped records that can plausibly participate in the current interaction frame.

Prefer extending the existing dropped-item registry with a bounded read/query seam if it can own a small runtime spatial index cleanly.

Do not create a global InteractionManager or copy dropped-item authority into `gameLoop.ts`.

If an index is added:

- it is derived/runtime-only;
- the dropped-item registry owns insertion/removal/index invalidation;
- stable dropped-item ids remain authoritative;
- save/load format is unchanged.

### 2. Replace all-pairs grouping

Preserve `DROPPED_ITEM_GROUP_RADIUS` semantics, but avoid comparing every record with every other global record.

Acceptable approaches:

- coarse spatial buckets sized from grouping radius;
- a registry-owned local-neighbor query followed by grouping only the bounded local slice;
- equivalent deterministic bounded lookup.

A query may inspect neighboring buckets but must still apply the exact radius predicate before union/group membership.

### 3. Remove repeated registry scans and avoidable allocations

Within one frame:

- call the dropped-item source once for the relevant slice;
- avoid `droppedItems.nodes().find(...)` per emitted group;
- carry the first record/freshness data through grouping directly;
- avoid rebuilding whole-world temporary structures when nothing outside interaction range can be targeted.

Small per-frame candidate arrays for genuinely nearby items are acceptable.

### 4. Preserve target identity and pickup behavior

Must preserve:

- instance-backed and `foodBatch` records remain individual;
- only identical plain dropped kinds group;
- grouping radius remains `DROPPED_ITEM_GROUP_RADIUS`;
- source-order/stable member ordering remains deterministic;
- `memberIds[0]` remains a stable interaction identity for the group;
- grouped quantity and freshness prompt semantics stay unchanged;
- pickup/consume action routing stays in the existing `Interactable` path;
- items outside the grouping radius do not merge even if they share a spatial bucket.

### 5. Do not move this work to a worker

The correct fix is to avoid global work.

Worker communication would require serializing mutable dropped-item state every frame and would add latency/ownership complexity for a tiny local query. No worker is allowed for this plan.

## Relevant files / symbols

- `src/app/gameLoop.ts` — per-frame `buildInteractables()` call.
- `src/app/interactables.ts::buildInteractables`.
- `src/app/interactables.ts::groupDroppedItemCandidates`.
- dropped-item registry implementation and its `nodes()/collect/drop` ownership.
- focused interaction/grouping tests.

Add JSDoc to any new cross-module query/index API; use `@domain ui-input` or the dropped-item owner domain where appropriate.

## Diagnostics

No heavy permanent profiler is required.

Add a lightweight deterministic stress/unit benchmark only if useful to prove the algorithm does not regress to all-pairs behavior. Production code should not retain diagnostic-only arrays/maps.

## Tests

Add focused tests proving:

1. identical plain items within the grouping radius form one group;
2. same-kind items outside the radius remain separate;
3. transitive grouping semantics remain equivalent to the current union-find behavior;
4. different item kinds never group;
5. instance-backed items remain individual;
6. food-batch items remain individual;
7. negative/world-coordinate bucket boundaries preserve grouping;
8. source/member order stays deterministic;
9. freshness prompt resolution does not require a second global registry scan;
10. a large global dropped-item population with only a few nearby records does not require pairwise work across all global records.

Prefer behavioral tests plus one bounded complexity contract around query candidate count rather than timing-sensitive wall-clock assertions.

## Performance verification

AI agent:

- targeted unit tests;
- type-check/lint/build as appropriate;
- no browser verification.

User:

- optional stress scenario with many dropped items;
- verify gaze/Tab targeting, grouped pickup and quick consume remain correct;
- compare frame stability if the world contains a large dropped-item population.

Success criteria:

- no O(D²) global grouping remains in the normal frame path;
- candidate/grouping work scales primarily with nearby dropped-item density;
- no repeated full-registry `find` per group;
- no new authoritative state or worker pipeline.

## Guardrails

- no second interaction manager;
- no global per-frame spatial index rebuild;
- no persistence schema change unless current dropped-item persistence representation itself changes (not expected);
- no grouping-rule change;
- no unrelated item pickup refactor;
- no worker;
- no browser verification by the implementing agent.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
