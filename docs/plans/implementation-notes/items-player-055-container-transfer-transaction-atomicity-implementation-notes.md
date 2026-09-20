# Implementation Notes: Container transfer transaction atomicity

## Current code reality

- `src/app/actions/containerActions.ts` is the only UI transaction coordinator for placed containers, world-generated containers, NPC corpses and equipped animal packs.
- Player, placed/world container contents and animal-pack contents are already the same authoritative primitive: `Inventory`.
- `src/items/inventoryTransfer.ts` already owns the correct generic atomic operations:
  - `transferInventoryCount(source, destination, kind, n, nowDays)` preserves freshness and rolls back a failed destination add;
  - `transferInventoryInstance(source, destination, instanceId)` preserves exact instance identity and rolls back a failed destination add.
- `containerContents(id)` currently returns the ID-addressed store, but both stores expose the live entry through `find(id)`, and the entry exposes `contents: Inventory`.
- `resolveAnimalPack(animalId)` already follows the correct lifecycle rule: stable ID in the UI session, live `AnimalAgent` + pack `Inventory` re-resolution before every mutation.
- `withdrawInstanceRollbackSafe()` is already tested and correct for genuinely ID-addressed store → destination moves. Do not replace it unless the caller can resolve both live `Inventory` owners first.

## Required implementation shape

### Resolve first, mutate second

For `container` sessions, resolve the current entry on every handler call:

```text
openTransfer.id
→ placedContainers.find(id) OR worldGeneratedContainers.find(id)
→ entry.contents
→ transfer helper
```

Do not remove from player inventory before that lookup. If neither owner contains the ID, close the stale screen and clear `openTransfer`; do not create/reconstruct a container.

For `animalPack`, keep using `resolveAnimalPack()`. A missing animal/pack should follow the same stale-session behavior before any mutation.

### Use Inventory↔Inventory transfer helpers directly

Once the live destination/source `Inventory` is resolved:

- player → container/pack count: `transferInventoryCount(inventory, target, ...)`;
- container/pack → player count: `transferInventoryCount(source, inventory, ...)`;
- player → container/pack instance: `transferInventoryInstance(inventory, target, instanceId)`;
- container/pack → player instance: `transferInventoryInstance(source, inventory, instanceId)`.

This removes the current asymmetric mutation ordering from `onDeposit`, `onDepositInstance`, animal-pack withdrawal and `onTakeAll`.

Keep corpse branches on `transferCorpseCountTo()` / `transferCorpseInstanceTo()`; corpse deposit remains forbidden.

### Partial stack movement

`transferInventoryCount()` is intentionally all-or-nothing. Partial UI behavior should therefore choose the committed amount first, then execute one atomic move.

Reuse/rename the existing `maxTransferable(inventory, kind, available)` helper so it can be applied to any destination `Inventory`, not only "take all":

```text
accepted = maxTransferable(destination, kind, requested)
accepted > 0
→ transferInventoryCount(source, destination, kind, accepted, nowDays)
```

This preserves the current capacity-limited partial semantics while keeping each committed move atomic. Do not manually slice/re-add `FoodBatch[]` in `containerActions.ts`; `transferInventoryCount()` already owns freshness preservation.

### Hooks and UI resync

Only after a successful transfer:

- update HUD weight;
- call `ctx.onInventoryChanged()`;
- refresh the active container/pack screen;
- for world/placed container withdrawals, call `ctx.onWorldContainerWithdraw?.(id, kind, movedAmount)`.

Do not fire `onWorldContainerWithdraw` for failed/stale moves. Deposits currently do not use this hook and should remain unchanged.

Capacity toast pre-checks may remain for UX, but the transfer helper must be authoritative. In particular, instance transfer success/failure must not rely on a previous `canAddInstance()` result.

## Existing helpers to keep

- `src/items/inventoryTransfer.ts`
- `src/app/actions/containerInstanceTransfer.ts`
- `src/app/actions/containerInstanceTransfer.test.ts`
- `src/items/inventoryTransfer.test.ts`
- `src/world/createPlacedContainers.ts::find`
- `src/world/worldGeneratedContainers.ts::find`
- `containerActions.ts::resolveAnimalPack`

The existing store-level `deposit/withdraw/depositInstance/withdrawInstance` APIs are still valid for other callers. This plan does not require removing or redesigning them.

## Pitfalls

- Do not cache `entry.contents` across UI events; WorldBundle/container lifecycle can invalidate the entry even while the screen is open.
- Do not keep the current destination-first instance deposit shape; it can duplicate an ID if player removal fails.
- Do not retain the current count-deposit source-first shape; a stale container ID can lose the removed stack.
- Do not implement a second animal-pack transfer algorithm; after re-resolution it is just `Inventory ↔ Inventory`.
- `onTakeAll` is intentionally a sequence of atomic moves, not one all-or-nothing transaction for the entire container.
- Plan `items-player-054` owns instance payload capacity correctness. This plan should consume `Inventory.canAddInstance/addInstance` behavior, not duplicate its weight rules.
- No save-schema change is needed.

## Tests

Prefer focused tests around transaction behavior rather than Vue rendering.

Cover at minimum:

- generic count transfer rejection preserves both inventories and food batches;
- exact-instance player → destination failure leaves one owner only;
- stale container/pack resolution performs no source mutation;
- partial stack transfer commits only the fitted amount and preserves remainder freshness;
- `onWorldContainerWithdraw` is emitted only for committed container withdrawals;
- existing `withdrawInstanceRollbackSafe` tests remain green;
- corpse no-deposit behavior remains unchanged.

If testing `createContainerActions` directly requires excessive UI/world mocks, extract only the narrow live-owner/partial-transfer transaction seam needed for these cases; do not introduce a new storage abstraction.
