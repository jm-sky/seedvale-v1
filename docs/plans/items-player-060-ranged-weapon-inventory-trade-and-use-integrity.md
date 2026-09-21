# Plan: Ranged weapon inventory, trade and use integrity

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** ~~items-player-059~~
**Domain:** `items-player`
**Subdomains:** `inventory` `items` `interaction`
**Tags:** `combat` `trade` `ranged`
**Roadmap:** -
**Model:** Sonnet · Composer

## Goal

Make every reusable player ranged weapon follow one coherent physical-item lifecycle across acquisition, Inventory, Merchant/NPC trade, equipping, combat, dropping, save/load and selling.

The immediate regression is a purchased `short_bow` apparently not becoming a usable Inventory item. The fix must not special-case that bow. Audit and close the same class of inconsistency for the whole current ranged-weapon family:

- `short_bow`;
- `hunting_bow`;
- `long_bow`;
- `masterwork_hunting_bow`;
- `crossbow`;
- `sling`.

Ammo/resources (`arrow`, arrow variants, `bolt`, `stone`) remain ordinary consumable/count-backed goods unless current code proves a separate physical identity is required.

The invariant after this plan is:

```text
a reusable ranged weapon exists as one physical inventory item
→ the same ownership representation is understood by trade and Inventory
→ it can be equipped
→ combat can resolve it
→ it can be dropped/transferred/sold
→ save/load preserves that ownership
```

No purchase path may take payment successfully without making the purchased weapon visible and usable by the buyer.

## Problem confirmed on current main

Current ownership classification is inconsistent with the gameplay family.

`src/items/itemInstances.ts` currently has:

- melee maintenance weapons in `WEAPON_MAINTENANCE_KINDS`;
- `hunting_bow` separately in `IDENTITY_ONLY_ITEM_KINDS`;
- other reusable ranged weapons outside both classifications.

Therefore the current ranged family is split between instance-backed and count-backed ownership even though `HeldTool`, ranged combat and NPC ranged-family resolution treat them as one class of reusable held weapons.

This is especially risky because trade has two deliberately different paths:

- stack/count goods use `Inventory.add/remove(kind, count)`;
- instance-backed goods resolve and transfer concrete `ItemInstance` objects.

The repository already centralizes acquisition through `createAcquiredInstance()`, but its correctness depends on the classification matching the item lifecycle.

Do not repair this by adding another `if (kind === 'short_bow')` in Merchant UI or trade wiring.

### Scope rule after recon

This remains one coherent lifecycle plan, but existing generic instance-aware paths are **verification-first** rather than presumed refactor work. After the central ranged classification changes, reuse the current generic Inventory/trade/world-transfer mechanisms and modify them only where targeted tests expose a concrete gap. In particular, Merchant/NPC transfer, Inventory grouping, capacity and drop/pickup already have shared instance-aware seams; do not rewrite them merely because they are named in this plan.

## 1. Establish one reusable ranged-weapon ownership contract

Introduce an explicit central classification for reusable ranged weapons, conceptually:

```ts
type RangedWeaponKind =
  | 'short_bow'
  | 'hunting_bow'
  | 'long_bow'
  | 'masterwork_hunting_bow'
  | 'crossbow'
  | 'sling'
```

The exact symbol name should follow current code conventions.

This declaration must be reusable by tests and ownership/acquisition code. Do not derive it from NPC role/loadout data and do not maintain separate hand-written copies in trade, Inventory and combat.

All current reusable ranged weapons must be instance-backed physical items.

Do not classify ammunition as reusable weapon instances.

## 2. Separate physical identity from melee maintenance semantics

Do not put bows, crossbows or slings into `WeaponMaintenanceKind` merely to obtain instance ownership.

That type currently means a melee maintenance payload with:

```text
durability + sharpness
```

`sharpness` is not a meaningful generic property for a bow, crossbow or sling.

Use the smallest shared instance representation that gives ranged weapons stable physical identity without inventing fake maintenance state. A plain `ItemInstance { id, kind }` is sufficient unless an existing ranged weapon already has real per-instance state that must be preserved.

Future ranged durability/quality may extend this representation later. It is not required here.

Remove the current exceptional `hunting_bow` identity-only special case once the ranged-family classification owns that responsibility.

## 3. Instance-backed classification must be complete

`INSTANCE_BACKED_KINDS` must include the central reusable ranged-weapon family.

Add a completeness test proving every catalog item that is a reusable ranged weapon is represented by the instance-backed ownership contract.

The test should fail when a future bow/crossbow/sling-like `ItemKind` is added to ranged combat/catalog metadata without being wired into physical ownership.

Avoid a test that merely compares two manually duplicated arrays.

## 4. Ordinary acquisition must mint exactly one usable instance

Extend the existing `src/items/trade.ts::createAcquiredInstance()` dispatch so every reusable ranged weapon produces exactly one fresh physical instance for ordinary acquisition.

This must cover existing callers of the shared acquisition boundary, including where applicable:

- Merchant purchase;
- quest/reward grant;
- world pickup;
- authored/systemic grant.

Do not add acquisition logic to Inventory UI.

For a count of N purchased/granted ranged weapons, exactly N instances must be created.

## 5. Merchant catalog purchase

Verify the live Merchant path first: `src/app/inventoryWiring.ts` → `settleMerchantStockTransaction()` against persistent `NpcAuthoritativeState.merchantStock`, with assortment/materialization in `src/settlement/merchantTrade.ts`. Keep `settleTransaction()` compatible for tests/other callers, but do not treat it as the primary runtime Merchant path.

Required atomic behaviour:

```text
validate stock + exact incoming instances + price + player capacity
→ mutate stock/ownership
→ settle coins
→ success
```

On any preflight failure:

```text
no weapon transfer
+ no stock loss
+ no coin loss
```

On success:

- purchased weapon is owned by player Inventory as an instance;
- Merchant stock decreases exactly once;
- coins settle exactly once;
- Inventory view can immediately resolve the weapon;
- weapon is eligible for equip/use without reload/reopen workarounds.

Do not keep a second count-backed Merchant representation for the same weapon.

## 6. Ordinary NPC-owned-goods purchase and barter

Audit `settleOwnedGoodsPurchase()`, `settleOwnedGoodsBarterTransaction()` and `resolvePurchaseReservations()`.

These paths already transfer real instances for instance-backed goods. Ranged weapons must use that path after the classification change.

A weapon sold by an NPC/household must move the existing physical instance to the player; it must not be destroyed and replaced with a freshly minted copy.

A player offer containing a ranged weapon must likewise transfer the concrete instance into the resolved NPC/household destination.

Preserve the existing atomic capacity and payment preflight.

## 7. Player selling

Both Merchant sell/offer paths and ordinary NPC barter must support the ranged family consistently.

For instance-backed ranged weapons:

- selection by kind/count must resolve concrete instance IDs through the existing instance sell-selection mechanism;
- explicit instance sale must remove that exact instance;
- selling an equipped weapon must leave no stale held reference after normal inventory/held-tool synchronization;
- multiple owned copies must remain distinguishable by identity even when Inventory groups them visually.

No sale may remove a count while leaving an orphan instance, or remove an instance while leaving a phantom count.

## 8. Inventory view and item details

Audit `src/items/inventoryView.ts` and the Vue Inventory item/detail/action surfaces.

Every ranged weapon owned as an instance must:

- appear in Inventory immediately after acquisition;
- show the normal label/model/category/value/capabilities;
- expose the existing equip/hold action;
- expose sell/offer behaviour when the current trade context permits it;
- show quantity/grouping correctly when multiple instances of the same kind exist.

Do not force ranged weapons into `IDENTITY_ONLY_ITEM_KINDS` UI semantics if that path is intended for story identity.

Prefer generic instance grouping already used by physical equipment/weapons.

Inventory must not require per-kind branches for each bow/crossbow/sling.

## 9. HeldTool and equip identity

`src/items/HeldTool.ts` currently stores a concrete instance ID only for `WeaponMaintenanceKind`; count-backed tools have no instance identity.

After ranged weapons become physical instances, `HeldTool` must preserve the identity of the ranged weapon actually in hand.

Generalize the held-instance rule from “maintenance weapon” to “held item whose ownership is instance-backed and whose concrete identity matters”.

Required behaviour:

- `equip(kind, instanceId?)` accepts an exact ranged instance;
- missing optional ID deterministically resolves an owned instance of that kind;
- invalid explicit ID must not cause ownership duplication;
- `syncWithInventory()` clears the held weapon if none remains;
- if the held instance was sold/dropped but another instance of the same kind remains, use the existing deterministic fallback semantics;
- save/restore of held state preserves the concrete instance where the existing save contract supports `heldInstanceId`.

Do not create a separate `HeldRangedWeapon` manager.

## 10. Player ranged combat

Audit `src/player/playerRanged.ts`, `src/app/gameLoop.ts` and the shared ranged lifecycle.

Combat capability must derive from the weapon actually owned/equipped.

For each ranged family member:

```text
owned instance
+ equipped instance
+ compatible ammo/resource where required
→ can execute existing ranged attack
```

Selling/dropping/removing the held instance must make it unavailable to combat immediately after normal synchronization.

Do not make combat depend on a stale count when ownership is instance-backed.

The existing plan 059 behaviour remains authoritative:

- bows use arrows according to current catalog config;
- crossbow uses bolts;
- sling uses stone;
- direct thrown stone remains an improvised action, not a reusable weapon instance.

## 11. NPC combat compatibility

Do not redesign NPC combat.

Verify that changing ranged weapons to instance-backed ownership does not break:

- `npcRangedWeaponFamily()`;
- profession-aware ranged selection;
- `personalInventory` ownership;
- hunter bow preference;
- guard crossbow use;
- shepherd sling use;
- ammo resolution.

Any NPC resolver that reads `Inventory.count(kind)` for reusable ranged weapons must be audited and changed to the existing ownership-neutral `holdsAny()`/instance-aware equivalent where appropriate.

Do not create NPC-only mirror counts.

## 12. Drop, pickup and world transfer

Verify the ordinary item drop/pickup path for ranged instances. The generic dropped-item contract already supports concrete instance payloads, so this should remain reuse/verification work unless tests expose a gap.

Dropping a ranged weapon must preserve its physical identity where the existing world-item representation supports instance payloads.

Picking it back up must restore the same instance rather than minting an unrelated replacement.

If the current generic dropped-item contract cannot carry an `ItemInstance`, extend that shared contract rather than special-casing bows.

Do not duplicate the item as both world count and inventory instance.

## 13. Save/load and migration

Existing saves may contain ranged weapons as counts, while `hunting_bow` may already exist as identity-only instances.

Add an idempotent migration/normalization path using the same pattern as existing count→instance migrations.

Required compatibility:

- each legacy count-backed `short_bow`, `long_bow`, `masterwork_hunting_bow`, `crossbow` and `sling` becomes the same number of fresh instances exactly once;
- existing `hunting_bow` instances remain the same physical instances;
- any legacy count form of `hunting_bow` is normalized without duplication;
- repeated normalization does not create additional weapons;
- held weapon restore resolves to a valid owned instance;
- save→load→save does not oscillate between counts and instances.

Follow current SaveData/migration ownership. Do not add a parallel ranged-inventory persistence field.

## 14. Capacity and weight

Instance conversion must not change effective carrying capacity accidentally.

Audit:

- `Inventory.totalWeight()`;
- `Inventory.totalSize()`;
- `canAddInstance()`;
- transaction `wouldFitAfterTransaction()` calculations.

One ranged weapon instance must contribute exactly the same base item weight/size as one former count-backed weapon unless existing item metadata explicitly says otherwise.

Purchase preflight must account for the actual incoming instances before payment.

## 15. Catalog, prices and stock

Keep gameplay availability and balance data in existing sources:

- `ITEM_DEFS`;
- `ITEM_CATALOG`;
- `MERCHANT_PRICES`;
- `MERCHANT_STOCK`;
- existing NPC stock/availability mechanisms.

Do not encode price/stock rules in instance creation.

Audit the complete ranged family and explicitly document which are:

- normal Merchant stock;
- ordinary NPC-owned goods when naturally present;
- exceptional/quest-only.

`masterwork_hunting_bow` should remain exceptional if that is still the current catalog contract; instance correctness must not accidentally make it normal Merchant stock.

## 16. Architectural guardrail for future reusable weapons

Add a targeted invariant test around reusable held combat items so this class of regression is difficult to reintroduce.

At minimum, for every current reusable ranged weapon verify:

```text
catalog ranged capability
→ physical instance classification
→ createAcquiredInstance() succeeds
→ Inventory recognizes ownership
→ HeldTool can equip it
→ compatible trade path can transfer/sell it
```

Where practical, use table-driven tests over the central ranged-kind declaration.

This is the answer to the broader “czy nie ma więcej takich sytuacji?” problem: adding a future ranged weapon should make a central completeness test fail until acquisition/ownership/equip support is coherent.

Do not broaden this plan into converting every holdable tool in the game to instances. If the audit discovers another reusable combat weapon with the same broken ownership contract, include it only when it is semantically part of the reusable weapon family; otherwise record a separate follow-up.

## 17. Relevant implementation seams

Verify current code before editing, with primary focus on:

- `src/items/itemInstances.ts`
  - instance classifications and clone/type guards;
- `src/items/Inventory.ts`
  - count/instance ownership, capacity and persistence boundaries;
- `src/items/inventoryView.ts`
  - grouped instance presentation;
- `src/items/trade.ts`
  - `createAcquiredInstance()`, Merchant and owned-goods transactions, sell selection;
- `src/items/tradeCatalog.ts`
  - ranged stock/pricing only where current availability requires it;
- `src/items/HeldTool.ts`
  - held concrete instance identity;
- `src/items/itemCatalog.ts`
  - ranged/holdable capability metadata;
- `src/player/playerRanged.ts`;
- `src/app/gameLoop.ts`;
- `src/app/inventoryWiring.ts`;
- `src/ai/npcCombat.ts`;
- `src/ai/npcLoadout.ts`;
- save/load normalization/migration code discovered from current `createApp.ts` and existing weapon/armor/container migrations;
- Inventory/trade/item-capability/ranged tests;
- `docs/items/WEAPONS.md`;
- `docs/items/CATALOG.md`.

Add/update JSDoc for the central reusable-ranged classification, acquisition helper and generalized held-instance ownership seam where needed for preflight discovery. Use `@domain items-player` on important architectural/public helpers.

## 18. Automated tests

Add focused tests covering the full current family, not only `short_bow`.

### Acquisition matrix

For each:

```text
short_bow
hunting_bow
long_bow
masterwork_hunting_bow
crossbow
sling
```

verify ordinary acquisition creates one instance and no shadow count.

### Merchant purchase

For every ranged weapon actually in Merchant stock:

- sufficient coins/capacity → success, one owned instance, correct coin/stock delta;
- insufficient coins → zero mutation;
- insufficient capacity → zero mutation;
- repeated purchase of two copies → two distinct instance IDs.

### NPC-owned purchase/barter

- source instance moves to buyer with same ID;
- player offer moves same ID to NPC/household;
- stale/missing instance before commit → zero mutation.

### Selling

- sell one of two instances → one remains;
- exact instance sale removes requested ID;
- equipped sold instance is cleared/re-resolved by held sync;
- payment is applied exactly once.

### Inventory/equip

For every ranged weapon:

- instance appears in grouped Inventory view;
- `holdsAny(kind)` is true;
- equip succeeds;
- held instance ID belongs to Inventory;
- removing the last instance unequips after sync.

### Combat

- bow + compatible arrow can enter existing ranged execution;
- crossbow + bolt can fire through existing plan-059 lifecycle;
- sling + stone can fire;
- weapon without compatible ammo follows existing no-ammo behaviour;
- direct thrown stone remains independent of reusable ranged ownership.

### Migration/save-load

- legacy counts convert one-for-one;
- existing hunting-bow instance is preserved;
- normalization is idempotent;
- save/load preserves number and IDs of ranged weapons;
- held instance restore never points to a non-owned ID.

### Completeness

A table-driven invariant covers every central reusable ranged kind and fails if acquisition, instance classification, holdability or ranged catalog capability drifts.

## 19. Manual verification

Browser verification is performed by the User.

Suggested scenarios:

1. buy a short bow from Merchant → it appears immediately in Inventory → equip → fire with arrows;
2. sell that bow → it disappears and cannot remain equipped;
3. buy two bows → both are represented correctly; sell one → one remains usable;
4. buy/use/sell crossbow + bolts;
5. buy/use/sell sling + stones;
6. save/load with a ranged weapon equipped;
7. load a pre-fix save containing a count-backed bow/crossbow/sling and confirm one-for-one migration;
8. ordinary NPC trade of a ranged weapon preserves the real item rather than minting a replacement.

## 20. Non-goals

Do not implement:

- new ranged weapon types;
- new ammo types;
- ranged durability/repair;
- fake `sharpness` for bows/crossbows/slings;
- weapon quality tiers;
- combat rebalance;
- new aiming/projectile systems;
- new equipment slots;
- NPC combat redesign;
- Merchant economy redesign;
- broad conversion of all tools/resources to instances;
- unrelated Inventory UI redesign.

## 21. Definition of done

The plan is complete when:

- all six current reusable ranged weapons share one explicit physical ownership contract;
- they are instance-backed without abusing melee sharpness/maintenance semantics;
- ordinary acquisition creates exactly one instance per weapon;
- Merchant purchase is atomic and cannot charge without delivering the weapon;
- ordinary NPC purchase/barter transfers the real instance;
- Merchant/NPC selling removes the real instance and settles payment once;
- Inventory shows every owned ranged weapon and supports multiple copies;
- HeldTool tracks the concrete ranged instance in hand;
- player ranged combat uses the owned/equipped weapon and existing ammo rules;
- NPC ranged combat remains compatible with instance-backed ownership;
- drop/pickup and save/load preserve ownership without duplication;
- legacy count-backed ranged weapons migrate one-for-one and idempotently;
- table-driven completeness tests protect future reusable ranged weapons from partial wiring;
- targeted automated tests pass.

Manual/browser gameplay verification is performed by the User.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
