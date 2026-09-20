# Implementation Notes: items-player-053 atomic world pickup ownership transfer

## Current-code conclusions

- The audit finding is still present on current `main`: `gameLoop.ts::tryCollectWorldItem()` checks only `inventory.canAdd(ref.kind)`, calls `collectItem()` (source mutation), then reconstructs/adds the destination payload and ignores the boolean result.
- `Inventory.addInstance()` can fail for duplicate instance id or capacity; `add()` / `addWithFreshness()` also return authoritative booleans. Exact pickup must therefore be resolved before source mutation.
- The older `items-player-052` implementation notes saying pickup is already atomic are stale; follow current code and the 2026-09-20 items/inventory audit instead.

## Recommended shape

Keep `WorldItemRef` and the three existing source authorities. Replace the mutating-only `collectItem()` seam with a small two-phase pickup adapter in/near `src/app/interactables.ts`:

1. **Resolve/read** an immutable pickup descriptor without changing source state.
2. Reconstruct/validate the exact destination payload and run the matching admission check.
3. Commit the destination using the same already-resolved payload.
4. Only after destination success, retire the exact source id through its existing authority.
5. Only after both ownership steps succeed, run pickup side effects.

This ordering is preferable to source-first + rollback: restoring a dropped item correctly would also have to preserve its stable id and runtime-only `onCollected` callback; spawner/world rollback would need source-specific reconstruction. Do not add those rollback APIs for this plan.

The read→destination→source sequence is synchronous on the main thread: no `await` or callback should be introduced between resolving the source and retiring it. That makes the prepared source token/id stable for the transaction. Still check the source-retire result; treat an unexpected miss as an invariant failure and do not report acquisition. If implementation chooses to support explicit rollback for that impossible/stale-source case, rollback must remove the exact just-added destination payload rather than minting/re-dropping a replacement.

Add `@domain items-player` JSDoc to the new cross-module resolve/commit seam.

## Source-specific read data

### DroppedItems

`src/items/createDroppedItems.ts` already exposes `DroppedItems.get(id)`, returning the authoritative `DroppedItem { id, kind, x, z, instance?, foodBatch? }` without mutation. Reuse it.

Do not call `DroppedItems.collect(id)` until inventory insertion succeeded: `collect()` also fires the runtime-only `onCollected` callback, so calling it during admission would leak a pickup side effect on failure.

Grouped dropped targets are already restricted in `interactables.ts`: records carrying `instance` or `foodBatch` are emitted as single-member groups. Keep that rule. Plain grouped members may commit independently in deterministic `memberIds` order and stop on the first rejected member.

### ItemSpawners

`ItemSpawners.nodes()` exposes the current `ItemSpawnPoint`; it carries `instanceId` and `authoredOneShot`. Resolve these before `ItemSpawners.collect(id)`.

For `instanceId`, construct the exact saved payload `{ id: instanceId, kind }` before source mutation. If reconstruction to an `ItemInstance` fails, fail closed and leave the spawn point untouched.

Do not move `consumedWorldPickupIds` into `ItemSpawners`. It remains app-owned persistence state; add the id only after destination insertion and source retirement both succeeded.

### Chunk/world items

Current `ChunkManager.collectItem(id)` returns only `{ kind, x, z }`; chunk pickups do not carry an exact instance/food payload today. `WorldItemRef` already has stable id+kind from the interaction candidate, so ordinary destination admission can be resolved without mutating the chunk source.

Keep `ChunkManager.collectItem()` as the retirement authority and keep `collectedItemIds` ownership unchanged. Do not create a second world-item registry.

## Destination admission/commit

Resolve one of three destination forms before source mutation:

- exact saved instance → `Inventory.instancesFromJSON([row])`; require exactly one valid instance, reject malformed rows; reject duplicate id explicitly and require `inventory.canAddInstance(instance)`;
- perishable dropped batch → `inventory.canAdd(kind, 1)`, then `addWithFreshness(kind, 1, [batch], nowDays)`;
- ordinary item → `inventory.canAdd(kind, 1)`, then `add(kind, 1, nowDays)`.

Never fall back from an invalid source-supplied instance to `createAcquiredInstance(kind)`. Fresh instance creation is valid only for sources that do **not** claim an exact instance id/payload and whose kind is instance-backed by the existing acquisition rules.

Always check the boolean returned by the final destination call. A rejected destination leaves the source untouched and produces no pickup success.

`items-player-054-instance-payload-capacity-admission.md` is adjacent but not a blocker: 053 should use `canAddInstance(instance)`; 054 separately fixes that method's liquid-payload weight math. If both are implemented in one sequence, doing 054 first gives the transaction the final capacity semantics.

## Side-effect boundary

Keep all current success-only effects after the complete transfer:

- `picked += 1` / grouped success accounting;
- HUD/inventory sync and acquisition feedback;
- medicinal-herb gathering XP or other pickup-driven progression;
- `consumedWorldPickupIds.add(ref.id)`;
- quest/progression observation of the acquired item.

Capacity/error feedback may happen on admission failure. Nothing else should.

## Tests worth adding

Prefer a focused transaction/helper test rather than driving the entire frame loop.

Cover:
- dropped exact instance: same id + metadata after success;
- duplicate destination instance id: source remains, no success;
- instance capacity rejection: source remains;
- malformed exact saved instance: fail closed, no fresh replacement;
- perishable dropped item: batch preserved on failure and success;
- authored spawner instance: consumed id only after successful transfer;
- plain grouped drops: earlier successful members remain transferred, first rejected member and later members remain in world;
- ordinary `world` and renewable `spawner` pickup still retire exactly once.

No persistence schema change is needed.
