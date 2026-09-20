# Implementation Notes: Cave-aware dropped-item continuity

## Current state verified

- `src/items/createDroppedItems.ts` is the sole owner of player/runtime world drops. `DroppedItem` currently persists `id/kind/x/z` plus optional `instance` and `foodBatch`; mesh spawn, falling and `settleNear()` all use surface `sampleHeight`.
- `src/app/worldBundle.ts` constructs `DroppedItems` before `createCaves()`. It already uses a late-bound `cavesRef` pattern for other cave consumers; reuse that instead of importing `Caves` into the item module.
- `src/world/spatialContext.ts` is the canonical identity contract. Reuse `WorldSpatialContext`, `WORLD_SPATIAL_CONTEXT_SURFACE` and `spatialContextsEqual()`; do not add a dropped-item-specific cave flag/type.
- `Caves.queryGroundIn(caveId, x, y, z)` is the correct stateless cave-scoped floor query. `spatialContextAt()` is for deriving context from a known XYZ, not for reconstructing a persisted cave drop from X/Z.
- `src/app/gameLoop.ts` already stores `spatialContext` on each active player projectile (world-027), so projectile expiry can forward that exact captured context without a new cave query.
- `src/app/interactables.ts::groupDroppedItemCandidates` currently groups plain drops only by kind + XZ radius. `spatialContextForPayload()` treats ordinary item payloads as surface unless they have another explicit cave-aware owner.
- `src/app/saveState.ts` serializes `bundle.droppedItems.nodes()` directly. `SaveDroppedItem` in `src/persistence/saveData.ts` is a shallow DTO; prior optional-field additions to drops did not require a schema bump because legacy absence is accepted.
- Same-world rebuild copies `[...bundle.droppedItems.nodes()]` before `dispose()`, so extending the record itself automatically carries the new fields through rebuild.

## Recommended record / placement contract

Extend both runtime and save shapes with optional:

```ts
y?: number
spatialContext?: WorldSpatialContext
```

Normalize missing `spatialContext` to surface. For cave records, require both cave context and a usable persisted `y`; do not infer cave identity from X/Z.

Keep exact cave Y as authoritative continuity data. On initial restore/rebuild, a cave drop with persisted Y should be spawned directly at that Y rather than first calling surface `placeOnGround()`. This matters because `DroppedItems` is constructed before `cavesRef` is populated.

Inject a narrow ground resolver from `worldBundle.ts`, conceptually:

```ts
(item) =>
  item.spatialContext?.kind === 'cave'
    ? cavesRef?.queryGroundIn(item.spatialContext.caveId, item.x, item.y ?? 0, item.z)?.floorY ?? null
    : chunkManager.sampleHeight(item.x, item.z)
```

Exact naming/signature is flexible, but the resolver must return `null` for unresolved cave ground and must never fall back to terrain for a cave record. A temporarily unavailable cave resolver should leave the item at its retained Y / retry on a later falling tick, not teleport it to the surface.

For API churn, prefer adding one final optional placement/options object to `drop()` rather than adding more positional scalar parameters. Preserve the existing instance/callback/freshness contract; this plan is not an item-physics redesign.

## Call sites that actually need context

Thread cave context only where the producer can legitimately be underground:

- `src/app/inventoryWiring.ts` player inventory drops: derive once from player XYZ via the already-injected/current cave spatial resolver and pass the player's current Y.
- `src/app/createApp.ts::grantItem` overflow drops and other player-position overflow paths (including gathering/actions that may execute underground): same player XYZ/context rule.
- `src/app/gameLoop.ts` projectile miss/expiry: pass `projectile.spatialContext`; use the projectile's current/end Y input if the runtime wrapper has/gets one, otherwise resolve floor Y from its captured cave context before creating the drop. Do not use the player's current context after firing.
- `src/settlement/npcPostDeath.ts::dropNpcCorpseLoot`: see the corpse continuity note below.
- Surface-only producers such as terrain dig results can keep the default surface path.

Do not blindly edit every `DroppedItems.drop()` caller to derive cave context. Only producers whose source position can exist underground need it.

## NPC corpse continuity is a real prerequisite inside this plan

Current `NpcPostDeathState` stores only `x/z/yaw`. Natural corpse expiry may happen after stream-out/rebuild, so `dropNpcCorpseLoot()` cannot reliably recover the deceased NPC's original cave identity later.

To satisfy the plan's corpse-loot invariant, extend the authoritative post-death transform with optional backward-compatible `y` and `spatialContext` (or an equivalent single persisted spatial-position record), set them in `commitNpcDeath()` from the live NPC's current XYZ/context, clone them in `cloneNpcPostDeath()`, and use them when materializing remaining loot.

This state already round-trips through `NpcStateRegistry.serialize()` / `SaveData.npcStates`; do not create a corpse-only registry. Legacy post-death records without these fields remain surface-compatible.

Also update corpse presentation restore: `NpcAgent` currently reconstructs a corpse with `sampleHeight(post.x, post.z)`. A cave corpse carrying persisted Y must not be rematerialized on the surface before its loot later drops.

## Falling and terrain settling

- Falling ground must be resolved from the item's stored spatial context every tick.
- When a cave ground lookup returns `null`, fail closed: do not substitute `sampleHeight`.
- `settleNear()` is called because surface terrain changed. Skip cave-context items entirely; terrain digging above a tunnel must not re-arm their gravity against surface ground.
- Surface behavior should stay byte-for-byte equivalent where practical.

## Interaction / grouping

`groupDroppedItemCandidates()` must only union records when `spatialContextsEqual(normalizedA, normalizedB)` is true in addition to current kind/radius rules. Include the normalized context on the produced group/candidate so downstream projection does not have to re-lookup by X/Z.

For dropped-item payloads, `spatialContextForPayload()` should use the stored/grouped dropped context. Keep the existing central player-vs-target context filter from world-027; do not weaken it.

## Fauna / world consumers

The relevant risk is any consumer that scans `DroppedItems.nodes()` and turns food into an attraction/consumption target using only X/Z. Carry the drop's normalized `WorldSpatialContext` into that candidate and use the same shared context equality rule already used by world-027/fauna integration. Do not add `isInCave` booleans.

ID-based `get()/consume()` semantics can remain unchanged; context belongs to the authoritative drop record.

## Persistence / migration

A save-version bump is probably unnecessary if the current validator still accepts `droppedItems` shallowly, matching the prior optional `instance` addition. Verify the validator before committing; only add a migration/version bump if current validation explicitly enumerates dropped-item fields.

Legacy missing `y/spatialContext` means surface. Never synthesize cave identity for old saves from X/Z.

## Tests worth adding / adjusting

Prioritize focused tests around existing owners rather than a large integration fixture:

- `createDroppedItems`: legacy surface restore; cave direct-Y restore; cave falling via injected resolver; resolver-null does not surface-fallback; `settleNear()` ignores cave items.
- `interactables`: same-kind/same-XZ surface + cave records stay separate; dropped candidate projects stored context.
- projectile expiry: forwards the projectile's captured context.
- NPC post-death: death snapshot retains cave Y/context, clone/serialize round-trip keeps them, corpse cleanup forwards them to all instance/plain/perishable drops.
- rebuild/save round trip: copied/saved dropped record keeps id, instance/freshness, Y and caveId.

Do not fold `items-player-053` pickup atomicity or `ui-input-027` candidate-scaling work into this change.

## Suggested implementation order

1. Extend `DroppedItem` / `SaveDroppedItem` and add normalized context + injected ground resolution in `createDroppedItems.ts`.
2. Wire the late-bound resolver in `worldBundle.ts`; lock restore/falling/`settleNear` tests.
3. Update player/projectile/overflow drop producers.
4. Extend persisted NPC post-death spatial transform and corpse restore/drop handoff.
5. Make interaction grouping/projection context-aware.
6. Audit/update fauna dropped-food projection.
7. Run focused unit/type/build checks; browser verification remains with the User.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
