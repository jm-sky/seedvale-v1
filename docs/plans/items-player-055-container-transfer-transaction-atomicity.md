# Plan: Container transfer transaction atomicity

**Created:** 2026-09-20
**Status:** `verification needed` 🔍
**Priority:** medium · **Effort:** S
**Depends on:** none
**Domain:** `items-player`
**Subdomains:** `inventory` `interaction`
**Type:** `fix`
**Roadmap:** -
**Model:** Composer, Grok

## Goal

Make every player ↔ container/animal-pack move preserve exactly one authoritative owner on success and leave both owners unchanged on failure.

Reuse the existing `Inventory` transfer primitives instead of maintaining direction-specific mutation ordering in UI callbacks.

## Problem

`createContainerActions()` currently implements several transfer transactions inline.

Count deposit removes from player inventory before re-resolving the target container; if the live store is missing, it returns without restoring the removed quantity.

Instance deposit does the reverse: it inserts into the destination first and then removes the source. If source removal unexpectedly fails, both owners retain the same exact instance ID.

Other branches already use `transferInventoryCount()`, `transferInventoryInstance()`-style semantics or `withdrawInstanceRollbackSafe()`, so failure behavior is inconsistent across the same transfer screen.

## Scope

### 1. Reuse Inventory↔Inventory transfer helpers

Where both live owners expose their `Inventory` directly (player, animal pack, placed/world container entry), prefer:

- `transferInventoryCount()`;
- `transferInventoryInstance()`.

Preserve freshness transfer and exact instance identity through these existing primitives.

Do not rebuild the transfer logic separately in Vue callbacks.

### 2. Keep ID-addressed store operations rollback-safe

Where a store API must remain ID-addressed, provide one small rollback-safe adapter equivalent in guarantees to `withdrawInstanceRollbackSafe()`.

For count transfer, destination disappearance/staleness after the UI session was opened must not consume the player's source quantity.

For instance transfer, no failure path may produce the same instance ID in both owners.

### 3. Re-resolve live owner before mutation

The UI session may keep stable IDs, but every mutation must resolve the current live destination/source first.

If a container or pack no longer exists:

- perform no source mutation;
- close/refresh the stale transfer screen if appropriate;
- do not create replacement storage state.

### 4. Preserve intended partial transfers

"Weź wszystko" and capacity-limited stack movement may keep intended partial success.

Partial success must be defined as a sequence of committed atomic moves; the unaccepted remainder stays with the source with its original food freshness metadata.

### 5. Normalize post-transfer resync

Keep existing HUD, inventory/equipment/quick-action and container-screen refresh behavior after a committed move only.

Do not make UI state an item owner.

## Relevant files / symbols

- `src/app/actions/containerActions.ts::createContainerActions`
  - `onDeposit`
  - `onWithdraw`
  - `onDepositInstance`
  - `onWithdrawInstance`
  - `onTakeAll`
- `src/app/actions/containerInstanceTransfer.ts::withdrawInstanceRollbackSafe`
- `src/items/inventoryTransfer.ts::transferInventoryCount`
- `src/items/inventoryTransfer.ts::transferInventoryInstance`
- `src/world/createPlacedContainers.ts`
- `src/world/worldGeneratedContainers.ts`
- animal pack `Inventory` access/re-resolution in `containerActions.ts`
- focused container transfer tests

Add JSDoc with `@domain items-player` to any new public transfer adapter.

## Tests

Add focused automated coverage proving:

1. stale/missing container during player deposit leaves player count unchanged;
2. rejected count deposit preserves freshness batches exactly;
3. instance deposit success moves one exact ID, never copies it;
4. forced source-removal failure after destination preparation rolls back/fails without duplicate ownership;
5. destination-capacity failure leaves source unchanged;
6. stale animal pack/container session is a no-op for ownership;
7. normal withdraw retains rollback-safe behavior;
8. "take all" partial capacity keeps remainder and freshness at source;
9. placed and world-generated containers share the same failure semantics;
10. existing corpse no-deposit policy remains unchanged.

## Guardrails

- No new container inventory type.
- No UI-owned shadow inventory.
- No duplicate transfer algorithm for animal packs.
- Preserve current container IDs and save schema.
- Do not widen into storage-access policy (`items-player-028/032`).
- Do not change cave dropped-item continuity (`items-player-051`).
- No browser verification by the implementing agent.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
