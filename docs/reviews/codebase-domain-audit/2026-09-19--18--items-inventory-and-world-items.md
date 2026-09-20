# Codebase domain audit 18 — Items, inventory & world items

**Date:** 2026-09-20  
**Area:** 18 — Items, inventory & world items  
**Scope:** code correctness, architecture, lifecycle/persistence, performance  
**Baseline:** current `main` (`91aaa65bc295d5102f5561d902f0c7e22458f94c` during final recon)  
**Result:** ⚠️ reviewed with two unresolved high findings

## 1. Scope

Traced:

```text
item definition
→ stack / instance identity
→ creation
→ world spawn / pickup
→ inventory/container insertion
→ owner transfer
→ equip/use/consume
→ drop
→ world representation
→ removal/destruction
→ save/load
→ rebuild / stream-in / stream-out
```

Covered player inventory, NPC personal inventory, household items, settlement/world containers, animal packs, transport cargo boundaries, dropped items, renewable/world pickups, tools/weapons/armor/liquid containers, consumables, quest instances, harvested resources and corpse loot where they enter the item lifecycle.

Missing item kinds, recipes and gameplay features are intentionally excluded.

Primary code inspected includes:

- `src/items/Inventory.ts`
- `src/items/inventoryTransfer.ts`
- `src/items/itemInstances.ts`
- `src/items/armorItemInstances.ts`
- `src/items/HeldTool.ts`
- `src/items/equipment.ts`
- `src/items/createDroppedItems.ts`
- `src/items/createItemSpawners.ts`
- `src/items/authoredWorldPickups.ts`
- `src/items/trade.ts`
- `src/app/gameLoop.ts`
- `src/app/interactables.ts`
- `src/app/inventoryWiring.ts`
- `src/app/actions/containerActions.ts`
- `src/app/actions/containerInstanceTransfer.ts`
- `src/world/createPlacedContainers.ts`
- `src/world/worldGeneratedContainers.ts`
- `src/app/saveState.ts`
- `src/persistence/saveData.ts`
- NPC/household/corpse/transport ownership seams and the related plans/reviews.

## 2. Entry points and state owners

### Item definitions and identity

`ITEM_DEFS` / `ITEM_CATALOG` own kind-level data. `Inventory` deliberately separates ordinary stack counts from `ItemInstance` records with stable `id` for stateful/identity-bearing items. Persisted instances retain kind plus supported mutable metadata such as durability, sharpness, liquid contents, tent condition and armor quality through `SaveItemInstance`.

This is the correct ownership split: stacks identify fungible quantity by kind; instances identify physical/stateful objects by stable ID.

### Inventory ownership

`Inventory` is the shared authoritative storage primitive for the player, NPC belongings, household storage, container contents and several logistics owners. It owns counts, instances and perishable food batches. `snapshotInventoryContents()` / `inventoryFromContents()` provide the reusable persistence boundary.

`transferInventoryCount()` and `transferInventoryInstance()` already provide rollback-safe generic ownership transfer between two `Inventory` instances. Count transfer preserves food freshness; instance transfer preserves exact identity.

### Equipment / held state

`HeldTool` and `EquipmentState` are projections over inventory ownership, not second item owners. They retain only selected kind/instance IDs and validate against live inventory. `HeldTool.syncWithInventory()` clears/re-resolves removed held items; equipment lookup/export is live-valid and does not recreate missing armor.

The wooden-torch/combat switching path preserves a lit portable torch by moving it to belt carry while a primary weapon is drawn, then restores it only if the inventory still owns the torch.

### World items

There are three pickup authorities:

- chunk/world-generated items through `ChunkManager.collectItem()`;
- settlement/renewable/authored points through `ItemSpawners.collect()`;
- persistent player/runtime drops through `DroppedItems.collect()`.

`collectItem()` in `src/app/interactables.ts` routes the selected `WorldItemRef` to exactly one authority.

Player-created `DroppedItem` records persist their stable drop ID, kind, X/Z, optional exact instance snapshot and optional food batch. Cave spatial identity is the known exception already covered by `items-player-051`.

### Containers / corpses / packs

Placed and world-generated containers keep their own `Inventory`. World-generated containers prefer a saved snapshot by stable container ID over authored initial contents, preventing authored loot from being re-seeded on ordinary restore/rebuild.

NPC corpse loot uses the NPC post-death handoff rather than a second UI-owned inventory. Animal pack contents remain on the persistent animal inventory and are re-resolved by animal ID for UI actions.

### Persistence

`buildSaveData()` serializes player counts/instances, dropped items, placed/world-generated containers, carried container state, NPC authoritative states, households and transport state in one save snapshot. Current restore does not generally mint replacement instances; the visible armor-ID minting in `saveData.ts` is a versioned v37→v38 migration, not an every-load rebuild path.

## 3. Flows traced

### Ordinary stack pickup

```text
Interactable item
→ inventory.canAdd(kind)
→ collectItem(ref)
→ source registry removes/marks collected
→ inventory.add(kind)
→ HUD / inventory resync
```

For ordinary count-backed items the preflight and destination add currently use the same kind-level weight/size model, so the normal single-threaded path is internally consistent.

### Stateful / exact-instance pickup

```text
Interactable item
→ inventory.canAdd(kind)          // kind-only preflight
→ collectItem(ref)               // source ownership removed here
→ restore SaveItemInstance or createAcquiredInstance(kind)
→ inventory.addInstance(...)     // boolean result ignored
→ authored one-shot id marked consumed
→ pickup counted as success
```

This ordering is F18-1.

### Inventory-to-inventory transfer

```text
source Inventory
→ destination capacity check
→ source remove
→ destination add
→ rollback source if destination unexpectedly rejects
```

The shared helpers in `inventoryTransfer.ts` are a sound atomic boundary and should be reused more consistently.

### Container transfer

Count and instance transfer UI has several specialized branches. Corpse withdrawal and normal container instance withdrawal already use rollback-aware helpers. Deposit paths are less consistent: some mutate the source before re-resolving destination, while instance deposit mutates destination before source removal. This is F18-3.

### Drop and restore

```text
Inventory remove
→ DroppedItems.drop(exact instance snapshot / food batch)
→ save: droppedItems
→ createDroppedItems(initial)
→ world pickup
→ restore instance/freshness
```

Instance metadata survives ordinary surface drop→pickup. Cave Y/spatial context does not; that is existing `items-player-051`.

### Containers and rebuild

`WorldGeneratedContainers` constructs contents from the saved row when the stable container ID exists; only a fresh container gets `initialCounts` / `initialInstances`. Placed container state similarly serializes contents rather than regenerating them. No restore-time duplicate seeding was found in these owners.

### NPC / household / logistics ownership

NPC personal inventory and household storage reuse `InventoryContentsSnapshot`. Existing economy audit F1 already found a separate cargo-conservation problem where economic goods can leave authoritative stock and live only in transient work/cargo state; that is owned by `settlements-npcs-052`, not duplicated here. Carrier-death cargo disposition is already owned by `settlements-npcs-054`.

## 4. Findings

### F18-1 — HIGH — world pickup removes source ownership before exact destination admission is known, and ignores failed instance insertion

**Affected flow:** world/spawner/dropped pickup → exact instance reconstruction → player inventory → authored one-shot consumption

**Files / symbols:**

- `src/app/gameLoop.ts::tryCollectWorldItem` inside the item interaction branch
- `src/app/interactables.ts::collectItem`
- `src/items/Inventory.ts::canAdd`, `canAddInstance`, `addInstance`
- `src/items/createDroppedItems.ts::collect`
- `src/items/createItemSpawners.ts::collect`
- `src/terrain/chunkManager.ts::collectItem`
- `src/items/authoredWorldPickups.ts::buildAuthoredOneTimePickups`

**Code evidence**

The pickup loop first performs only a kind-level check:

```ts
if (!inventory.canAdd(ref.kind)) {
  ...
  break
}
```

It then removes/collects from the world authority:

```ts
const collected = collectItem(ref, bundle.chunkManager, bundle.itemSpawners, bundle.droppedItems)
if (!collected) continue
```

Only after source removal does it reconstruct the exact instance and attempt destination insertion:

```ts
const restoredInstance = collected.instance
  ? Inventory.instancesFromJSON([collected.instance])[0] ?? null
  : null
const acquiredInstance = restoredInstance ?? createAcquiredInstance(collected.kind)
if (acquiredInstance) inventory.addInstance(acquiredInstance)
...
if (collected.authoredOneShot) consumedWorldPickupIds.add(ref.id)
picked += 1
```

The return value from `addInstance()` is ignored. A failed insertion therefore still counts as a successful pickup, and an authored one-shot can be marked consumed after the world representation was removed even though ownership never reached the player.

The preflight is also semantically weaker than the commit: `canAdd(kind)` knows only catalog kind weight/size, while `addInstance()` rejects duplicate instance IDs and applies instance-specific admission.

**Why wrong / fragile**

The ownership transition is not atomic. The required invariant is:

```text
world owns exact item
XOR
inventory owns exact item
```

A destination rejection currently permits neither owner to retain it. This is particularly serious for unique keys, quest/story instances, quality-bearing armor, filled/stateful containers and dropped weapons/tools because the exact instance may not be reproducible.

The issue also breaks exact-once authored semantics: "source consumed" is recorded independently of successful destination ownership.

**Affected consumers**

- player pickup of instance-backed world items;
- dropped tools, weapons, armor, tents/traps/liquid containers;
- authored one-shot keys and other exact-instance pickups;
- quest logic that expects an exact instance ID after pickup;
- pickup feedback/HUD because the loop reports success even on failed insertion.

**Owner domain:** `items-player`

**Existing plan coverage**

- `items-player-051` covers cave spatial continuity only.
- `ui-input-027` covers dropped-item candidate cost only.
- `quests-progression-056` protects a specific story-item flow, not the generic world→inventory ownership commit.
- No current plan owns generic pickup atomicity.

**Recommended action**

Create `items-player-053-atomic-world-pickup-ownership-transfer.md`. Make the pickup transaction validate the exact payload and only retire/consume the source when destination ownership is committed, with lossless rollback/fail-closed semantics for all three pickup authorities.

---

### F18-2 — MEDIUM — `canAddInstance()` omits liquid payload mass, so a filled container can be admitted above the carry limit

**Affected flow:** instance transfer/pickup → inventory capacity admission → carried weight

**Files / symbols:**

- `src/items/Inventory.ts::totalWeight`
- `src/items/Inventory.ts::canAddInstance`
- `src/items/Inventory.ts::addInstance`
- `src/items/Inventory.ts::inventoryFullToastText`
- `src/items/armorItemInstances.ts::effectiveInstanceWeight`
- all transfer paths that call `canAddInstance`

**Code evidence**

Existing carried weight correctly includes liquid:

```ts
for (const instance of this.instances.values()) {
  total += effectiveInstanceWeight(instance)
  if (isLiquidContainerInstance(instance)) {
    total += instance.amountLitres * LIQUID_DENSITY_KG_PER_LITRE
  }
}
```

But incoming-instance admission does not:

```ts
canAddInstance(instance: ItemInstance): boolean {
  const weightOk =
    this.totalWeight() + effectiveInstanceWeight(instance) <= this.maxWeight + 1e-9
  return weightOk && this.hasSizeRoom(instance.kind, 1)
}
```

`effectiveInstanceWeight()` explicitly documents that liquid contents are added separately by `Inventory.totalWeight()`. That separate addition is missing for the incoming instance.

Therefore the same full waterskin/bucket has one mass after it enters the inventory and a smaller mass during its admission check.

Armor quality is not affected by this specific bug: `effectiveInstanceWeight()` already applies armor quality weight scaling.

**Why wrong / fragile**

The inventory capacity invariant can be false immediately after a successful `addInstance()`. Any caller relying on `canAddInstance()` for atomic transfer safety can accept a filled liquid container that should not fit.

The generic instance capacity predicate is the correct owner for this calculation; callers should not duplicate liquid-specific arithmetic.

**Affected consumers**

- player/container/NPC instance transfers;
- filled waterskins/buckets moved between inventories;
- any future stateful instance whose payload contributes physical mass;
- capacity feedback based on the same admission predicate.

**Owner domain:** `items-player`

**Existing plan coverage**

No active plan found that corrects instance admission mass. `items-player-001` established liquid-container state, while current code already includes liquid mass in `totalWeight()`; the mismatch remains in the generic admission seam.

**Recommended action**

Create `items-player-054-instance-payload-capacity-admission.md`. Introduce/reuse one authoritative effective incoming-instance mass calculation and use it consistently in `canAddInstance()`, related transaction capacity calculations and instance-aware capacity feedback.

---

### F18-3 — MEDIUM — container UI transfer adapters do not consistently preserve atomic ownership on failed/stale transitions

**Affected flow:** player inventory ↔ placed/world container/animal pack → UI transfer session → owner re-resolution

**Files / symbols:**

- `src/app/actions/containerActions.ts::createContainerActions`
  - `configureContainerScreen().onDeposit`
  - `onDepositInstance`
  - `onWithdraw`
  - `onTakeAll`
- `src/app/actions/containerInstanceTransfer.ts::withdrawInstanceRollbackSafe`
- `src/items/inventoryTransfer.ts::transferInventoryCount`
- `src/items/inventoryTransfer.ts::transferInventoryInstance`

**Code evidence**

Count deposit removes from the player before resolving the live destination store:

```ts
const batches = inventory.removeWithFreshness(kind, amount, nowDays)
if (!batches) return
...
const store = containerContents(openTransfer.id)
if (!store) return
```

If the open transfer target has become stale/missing, the function returns with the source already decremented and no rollback.

Instance deposit uses the opposite mutation order:

```ts
if (!store.depositInstance(openTransfer.id, instance)) return
if (!inventory.removeInstance(instanceId)) return
```

If source removal unexpectedly fails after destination insertion, both owners retain the same exact instance ID. The animal-pack instance deposit uses the same destination-first shape.

This is inconsistent with the repository's own generic transfer helpers and `withdrawInstanceRollbackSafe()`, which explicitly treat a two-owner move as a rollback-safe transaction.

**Why wrong / fragile**

The UI adapter is implementing ownership transfer policy itself in several branches. That creates separate failure semantics depending on transfer direction and owner type, despite both sides already using the same `Inventory` model.

Even where normal synchronous UI sequencing makes the failure uncommon, stale owner references/rebuild lifecycle or invariant failures must fail closed instead of converting into item loss/duplication.

**Affected consumers**

- placed-container deposits;
- world-generated-container deposits;
- animal-pack deposits;
- any future owner added to the shared transfer screen;
- instance identity and perishable freshness on failed moves.

**Owner domain:** `items-player`

**Existing plan coverage**

No current plan owns generic container-transfer atomicity. `settlements-npcs-032` and `items-player-028/032` cover different access/resource-policy questions; `fauna-039` established pack inventory but does not close the shared UI transaction inconsistency.

**Recommended action**

Create `items-player-055-container-transfer-transaction-atomicity.md`. Route compatible Inventory↔Inventory moves through the existing transfer helpers and provide one rollback-safe adapter for ID-addressed container stores, including stale-target behavior.

---

### F18-4 — HIGH — dropped items do not preserve cave spatial identity

**Affected flow:** drop → world representation → interaction → save/load/rebuild

**Files / symbols:**

- `src/items/createDroppedItems.ts::DroppedItem`
- `createDroppedItems`
- `src/app/inventoryWiring.ts::dropItems`
- `src/app/interactables.ts` dropped-item spatial projection
- other underground-capable drop producers

**Code evidence**

`DroppedItem` persists X/Z but no cave/domain identity and `createDroppedItems` grounds through surface `sampleHeight`. This was independently confirmed by area 7.

**Why wrong / fragile**

A cave item can reconstruct on terrain above the cave or become interaction-invisible across surface/cave filtering.

**Affected consumers**

Player drops, overflow drops, projectile misses and corpse-loot handoffs capable of occurring underground.

**Owner domain:** `items-player`

**Existing plan coverage**

Fully owned by `items-player-051-cave-aware-dropped-item-continuity.md`, created by area 7. Do not create another plan.

**Recommended action**

Implement `items-player-051`.

---

### F18-5 — MEDIUM — dropped-item interaction discovery performs global quadratic grouping each frame

**Affected flow:** dropped world items → interaction candidate discovery → frame CPU/GC

**Files / symbols:**

- `src/app/gameLoop.ts`
- `src/app/interactables.ts::groupDroppedItemCandidates`
- `DroppedItems.nodes()`

**Code evidence**

The interaction adapter groups the whole dropped-item array with nested pairwise comparisons and additional reconstruction scans. This is global dropped-history work in the normal frame path.

**Why wrong / fragile**

Cost grows with total persistent dropped items rather than nearby interactable density.

**Affected consumers**

Interaction targeting and frame stability in long-running/cluttered worlds.

**Owner domain:** `ui-input`, consuming the `items-player` registry

**Existing plan coverage**

Already owned by `ui-input-027-interaction-candidate-dropped-item-scaling.md`.

**Recommended action**

Implement `ui-input-027`; no duplicate plan.

## 5. Architecture observations

Positive boundaries to preserve:

- `Inventory` is shared rather than player-only duplicated state.
- Stack quantity and exact-instance identity are explicitly distinct.
- Save conversion keeps instance IDs and supported metadata.
- Food freshness transfer has explicit source/destination checkpointing.
- Generic Inventory↔Inventory transfer helpers already implement rollback.
- Equipment/held state is referential projection over inventory ownership, not another owner.
- World-generated container restore prefers saved contents by stable ID, avoiding authored loot re-minting.
- Player/NPC/household inventories use the same snapshot shape.
- Authored one-shot pickups have stable source IDs and a persisted consumed-ID set.
- Dropped instance snapshots preserve weapon/trap/tent/armor/liquid metadata on ordinary surface round-trips.

Not promoted to findings:

- `DroppedItems.get()/collect()` use linear array lookup. The important per-frame scaling defect is already F18-5; pickup-time O(D) work alone is not established as a separate material problem.
- Zero count entries may remain in `Inventory.counts`, but `isEmpty()` and serialization consumers tolerate this and no correctness break was found.
- Armor migration intentionally mints stable migration IDs when converting legacy count-backed armor. It runs only in the versioned migration chain, not every restore.
- `HeldTool` re-resolves a removed weapon instance to another owned instance of the same kind by design; it does not retain ownership itself.

## 6. Cross-domain dependencies / follow-ups

- Area 7 already owns cave/location continuity evidence; reuse `items-player-051`.
- Area 20 already owns interaction target identity and dropped-item candidate scaling; reuse `ui-input-027` / `ui-input-028`.
- Economy/transport conservation from area 11 remains under `settlements-npcs-052`; do not convert economic cargo into an item-specific duplicate registry.
- Carrier-death cargo disposition remains under `settlements-npcs-054`.
- Quest-specific recovery mechanisms should consume the generic atomic pickup/transfer invariants rather than creating per-quest copies.
- Persistence should continue storing authoritative owner state; no new parallel global item registry is recommended.

## 7. Existing plans that already cover findings

Checked against current plans/code:

- `items-player-051-cave-aware-dropped-item-continuity.md` — F18-4.
- `ui-input-027-interaction-candidate-dropped-item-scaling.md` — F18-5.
- `ui-input-028-interaction-target-identity-and-cycle-lifecycle.md` — stale/cycled interaction target lifetime; relevant to removed pickup targets but not item ownership commit.
- `settlements-npcs-052-persistent-economic-work-cargo-and-local-transfer-conservation.md` — economic work/cargo conservation.
- `settlements-npcs-054-transport-carrier-death-and-cargo-disposition.md` — cargo ownership when a carrier dies.
- `quests-progression-056-dungeon-bandit-story-item-integrity-and-recovery.md` — specific story-item integrity/recovery; not a substitute for generic pickup atomicity.

## 8. New plans required

1. `items-player-053-atomic-world-pickup-ownership-transfer.md` — F18-1.
2. `items-player-054-instance-payload-capacity-admission.md` — F18-2.
3. `items-player-055-container-transfer-transaction-atomicity.md` — F18-3.

## 9. Verification limits

Review only. No production gameplay code was changed.

Static source/control-flow review and existing tests/plans/reviews were used. No browser verification was run. `pnpm docs:sync` was not run.

The audit did not classify missing item types, recipes or gameplay content as findings.

## 10. Master status update

Area 18 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

F18-1 and F18-4 are high-severity ownership/continuity findings; F18-4 already has a plan, while F18-1 receives a focused plan here. F18-2/F18-3 are medium correctness/architecture findings. F18-5 is an existing medium performance finding already planned.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
