# Implementation Notes: items-player-060 ranged weapon inventory, trade and use integrity

**Reviewed:** 2026-09-21  
**Branch/codebase:** `main`

## Current-code findings that matter

- `src/items/itemInstances.ts` confirms the regression described by the plan: `hunting_bow` is in `IDENTITY_ONLY_ITEM_KINDS`; the other ranged weapons are count-backed. Keep `WeaponMaintenanceKind` melee-only. Add one iterable ranged-kind declaration + predicate and compose it into `INSTANCE_BACKED_KINDS`; remove `hunting_bow` from the story-oriented identity-only list.
- `createAcquiredInstance()` in `src/items/trade.ts` is already the generic mint boundary used by acquisition/merchant stock. Ranged kinds should return plain `ItemInstance` here. Prefer one ranged predicate branch over six cases.
- The live Merchant path is no longer plain `settleTransaction()`: `src/app/inventoryWiring.ts` calls `settleMerchantStockTransaction()` against persistent `NpcAuthoritativeState.merchantStock`. `src/settlement/merchantTrade.ts` generates assortment as kind/count data, then materializes instance-backed stock through `createAcquiredInstance()`. Audit/test this path first; keep `settleTransaction()` compatible because tests/other callers still use it.
- `trade.ts` already has the right mixed-ownership primitives: `isInstanceBackedKind`, `selectInstancesToSell`, `transferInventoryInstance`, instance-aware offer removal, reservation and capacity helpers. Extending the central classification should route ranged weapons through these paths; do not add ranged-specific transaction code.
- `HeldTool.ts` is the main semantic mismatch after conversion. `resolveInstanceId()` and `syncWithInventory()` currently gate concrete identity on `isWeaponMaintenanceKind`. Generalize that gate to instance-backed held items (or a narrow helper representing held items requiring identity). Do not make every instance-backed story/container item a held tool; `isToolKind` remains the holdability gate.
- `Inventory.holdsAny()` is already the ownership-neutral query and NPC combat resolvers use it in the important weapon-selection paths. Avoid changing combat back to `count()`.
- `npcLoadout.ts` still explicitly seeds guard `crossbow` and shepherd `sling` with `inventory.add()`; hunter `hunting_bow` also falls through the count branch in `seedDefaultRoleWeapon()`. These must use the same generic acquisition/instance creation rule. Do not change ammo: `arrow`, variants, `bolt`, `stone` stay counts.
- `tradeCatalog.ts`: normal Merchant catalog contains `short_bow`, `hunting_bow`, `long_bow`, `crossbow`, `sling`; `masterwork_hunting_bow` is deliberately only in fallback trade value and remains exceptional. No balance/catalog availability change is needed.
- `playerRanged.ts`/catalog ranged config already model weapon/ammo capability separately from ownership. The ownership fix should not duplicate ranged-family metadata there. The central ranged instance list should be checked against catalog ranged capability in tests so drift fails loudly.

## Scope / effort interpretation

The plan is still a single end-to-end lifecycle fix, but recon reduces expected implementation effort to **M**: most cross-system behavior already exists behind generic instance-aware seams. Treat Merchant/NPC trade, Inventory grouping, capacity and drop/pickup as verification-first. Change shared code only for failures demonstrated by focused tests; do not proactively rewrite those paths.

The genuinely expected code changes are concentrated in central ranged classification/acquisition, `HeldTool` identity, NPC ranged loadout seeding, one versioned cross-owner save migration and focused invariant/regression tests.

## Persistence / migration

Use the real versioned save pipeline in `src/persistence/saveData.ts`, not a boot-only normalization in `createApp.ts`. Current main is save version 52.

The armor v37→v38 migration is the closest complete precedent because it converts counts to instances across ownership locations, not only player Inventory. The ranged migration must cover every persisted Inventory-shaped owner that can legally contain these goods, especially:

- player `inventory` + `inventoryInstances`;
- `npcStates[*].personalInventory`;
- `npcStates[*].merchantStock` (introduced in v46 and now authoritative Merchant stock);
- household/container Inventory snapshots where generic transfers can place weapons;
- dropped world items: convert a count-backed ranged drop to its existing `instance` payload form rather than minting again on pickup.

Preserve existing `hunting_bow` instance rows. Only mint for residual legacy counts, delete those counts in the same migration, and use deterministic migration IDs (the armor migration pattern), not `Date.now()`/runtime `createItemInstanceId()`. If `heldTool` stores only kind plus optional `heldInstanceId`, retain a valid existing ID; when converting an old count-held ranged kind with no ID, let normal restore choose the deterministic first owned instance rather than adding another save field.

Also audit current-save schema validation for instance rows and bump/register exactly one migration step. Do not rely only on runtime `migrateWeaponCountsToInstances()`; that helper covers melee player Inventory semantics and is not a substitute for cross-owner save migration.

## Drop/pickup and capacity

The generic persisted item-instance shape already supports plain `{ id, kind }`, and `Inventory.toSaveItemInstance()`/instance parsing do not require weapon-maintenance fields for generic instances. Reuse that path.

Capacity math in `trade.ts` already distinguishes incoming concrete instances via `effectiveCarriedInstanceWeight()` + `itemSizeUnits()`. Ensure Merchant/NPC reservation resolves ranged purchases into `incomingInstances` before preflight. Do not count the same ranged purchase simultaneously in `stackPurchases` and `incomingInstances`.

## Suggested implementation order

1. Add ranged kind type/list/set/predicate; compose into instance-backed kinds; simplify `createAcquiredInstance()`.
2. Generalize `HeldTool` concrete-instance resolution.
3. Fix NPC initial ranged loadout seeding to create instances.
4. Verify Merchant stock materialization + Merchant/NPC transaction paths and drop/pickup with the new classification; change only gaps exposed by tests.
5. Add v52→v53 migration across all persisted owners, then schema/version tests.
6. Add one table-driven ranged-family matrix plus focused Merchant/NPC transfer, held-instance and migration tests.

## Test traps / guardrails

- A completeness test should derive the expected reusable ranged family from catalog `ranged` + holdability metadata and compare it with the central ranged instance list; comparing two hand-written lists would not protect against the original regression.
- Test Merchant **persistent stock** conversion/seeding, not only `settleTransaction()`; otherwise a ranged kind may be instance-backed while the vendor still owns only a legacy count and appears out of stock.
- Test NPC first-materialization loadout and restored NPC state separately. Loadout seeding is intentionally one-time; conversion must not cause reconstruction to grant a second bow/crossbow/sling.
- For two same-kind weapons, assert exact ID preservation through NPC barter and drop→pickup. Ordinary Merchant catalog purchase may mint a new stock instance during stock initialization, but the purchase itself must transfer that stocked instance rather than replace it.
- Keep `masterwork_hunting_bow` out of ordinary Merchant availability while still covering acquisition/equip/sell/persistence.
- Run targeted tests plus typecheck/build; browser verification remains with the User.
