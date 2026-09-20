# Plan: Atomic world pickup ownership transfer

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** high · **Effort:** S
**Depends on:** none
**Domain:** `items-player`
**Subdomains:** `inventory` `items` `interaction`
**Type:** `bug`
**Roadmap:** -

## Goal

Make world pickup a lossless ownership transition for both count-backed items and exact `ItemInstance` payloads.

A pickup must never retire the world source, mark an authored one-shot consumed, or report success unless the player inventory actually owns the acquired item.

## Problem

The current pickup path in `src/app/gameLoop.ts` performs only `inventory.canAdd(ref.kind)`, then calls `collectItem()`, which removes the source from its owning registry. Exact instance reconstruction and `inventory.addInstance()` happen afterwards, and the insertion result is ignored.

That permits:

```text
world source removed
→ exact destination insertion fails
→ no owner retains the item
→ pickup still reported successful
→ authored one-shot may also be marked consumed
```

The generic item lifecycle already has stable source IDs and exact saved instance payloads; the fix should strengthen that mechanism rather than add a second pickup registry.

## Scope

### 1. Introduce an exact pickup admission/commit contract

Before mutating the source, resolve enough immutable payload information to validate the actual destination transition:

- exact `SaveItemInstance` / reconstructed `ItemInstance` where the source has one;
- food batch where applicable;
- ordinary kind/count otherwise.

Do not use kind-only `canAdd()` as the final admission check for an instance-backed pickup.

Prefer a small shared transaction seam around the existing pickup authorities over source-specific logic in `gameLoop.ts`.

### 2. Preserve source ownership until destination commit is guaranteed

Cover all current `WorldItemRef.source` variants:

- `dropped`;
- `spawner`;
- `world`.

Required invariant:

```text
before commit: source owns item, destination does not
after success: source does not own item, destination owns item
after failure: source still owns item, destination unchanged
```

If the cleanest implementation must remove the source first, provide exact rollback that restores the same source identity/state. Do not re-drop an item under a new ID as generic rollback for an authored/chunk pickup.

### 3. Make destination result authoritative

Do not ignore `Inventory.add()`, `addWithFreshness()` or `addInstance()` results.

Only after successful destination ownership:

- increment pickup count;
- play acquisition feedback;
- grant pickup-driven skill XP;
- mark `consumedWorldPickupIds` for authored one-shots;
- allow quest/progression consumers to observe the acquisition.

A failed commit must be a no-op from the player's perspective except optional capacity/error feedback.

### 4. Preserve exact identity and metadata

For an incoming saved instance:

- retain the same instance ID;
- retain durability/sharpness;
- retain liquid + amount;
- retain tent condition;
- retain armor quality;
- never fall back to a fresh instance merely because destination admission failed.

Malformed payload handling must fail closed rather than silently minting a replacement for a source that claimed to carry an exact instance.

### 5. Grouped dropped pickup

Grouped plain dropped stacks may keep partial-success behavior when player capacity fills mid-group.

Each member still commits independently by stable dropped ID. A failed member stays in the world; already committed earlier members remain valid.

### 6. Authored one-shot exact-once semantics

`consumedWorldPickupIds.add(id)` must happen only after successful inventory ownership.

Restore/rebuild must continue filtering consumed authored IDs exactly as today; do not create a second quest-specific consumed ledger.

## Relevant files / symbols

- `src/app/gameLoop.ts` — item pickup interaction / current `tryCollectWorldItem`.
- `src/app/interactables.ts::collectItem` — source router; likely needs a read/commit split or transaction API.
- `src/items/createDroppedItems.ts` — exact dropped source identity/payload.
- `src/items/createItemSpawners.ts` — renewable/authored source state.
- `src/terrain/chunkManager.ts` — finite world-item collection authority.
- `src/items/Inventory.ts` — destination admission/add primitives.
- `src/items/authoredWorldPickups.ts` and app-owned `consumedWorldPickupIds`.
- focused pickup tests around instance-backed/authored failure cases.

Add JSDoc with `@domain items-player` to any new cross-module transaction/read seam.

## Tests

Add focused automated coverage proving:

1. ordinary count-backed pickup still succeeds once;
2. dropped exact instance retains the same ID/metadata;
3. destination instance-capacity failure leaves the exact dropped source present;
4. duplicate destination instance ID leaves the source present and does not report acquisition;
5. authored one-shot is not added to `consumedWorldPickupIds` when destination commit fails;
6. successful authored one-shot is consumed exactly once and stays absent after rebuild/save-load;
7. grouped plain drops allow partial success without removing the first unaccepted member;
8. perishable dropped food preserves its batch on failed pickup and on successful transfer;
9. pickup feedback/XP fires only for committed items;
10. existing chunk/spawner/dropped pickup behavior remains deterministic.

## Guardrails

- No second global item registry.
- No quest-specific generic pickup implementation.
- No new item identity for rollback.
- Do not weaken stable instance IDs.
- Do not solve cave positioning here; that is `items-player-051`.
- Do not solve dropped candidate scaling here; that is `ui-input-027`.
- No browser verification by the implementing agent.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
