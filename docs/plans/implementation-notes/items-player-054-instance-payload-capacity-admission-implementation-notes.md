# Implementation Notes: Instance payload capacity admission

Plan: `items-player-054-instance-payload-capacity-admission.md`

## 1. Canonical mass helper

Current code has two different concepts:

- `src/items/armorItemInstances.ts::effectiveInstanceWeight()` = structural instance mass, including armor-quality scaling;
- `Inventory.totalWeight()` = structural mass plus liquid payload.

Keep that distinction. Do **not** put liquid logic into `armorItemInstances.ts` or change `effectiveInstanceWeight()` semantics; it is also re-exported by `inventoryView.ts` and is intentionally armor-aware.

Add one small shared helper at the inventory/item boundary, preferably exported from `src/items/Inventory.ts`, e.g. `effectiveCarriedInstanceWeight(instance)`:

```text
effectiveInstanceWeight(instance)
+ liquid payload mass when isLiquidContainerInstance(instance)
```

It should be pure, use `LIQUID_DENSITY_KG_PER_LITRE`, and carry `@domain items-player` JSDoc.

This placement avoids a dependency cycle: `itemInstances.ts` cannot own the helper because `armorItemInstances.ts` already depends on item-instance types.

## 2. Inventory admission must reuse exactly the same helper

In `src/items/Inventory.ts`:

- `totalWeight()` should sum the shared carried-instance helper instead of open-coding liquid payload;
- `canAddInstance()` should add the same helper result;
- `addInstance()` already delegates to `canAddInstance()`; no separate capacity formula is needed.

Do not change `hasWeightRoom(kind)` / `canAdd(kind)`: count-backed items have no instance payload.

Do not add a capacity gate to `updateInstance()` or liquid filling. Filling an already-carried container can legitimately increase current encumbrance; this plan fixes **admission math**, not carried-item mutation policy.

## 3. Trade has two concrete-instance weight paths

`src/items/trade.ts` currently undercounts concrete instances in both directions:

- `instancesWeight(incomingInstances)`;
- `offerRemovalDelta()` when an offered kind is instance-backed.

Both currently call `effectiveInstanceWeight()`. Switch both to the canonical carried-instance helper.

Updating only incoming instances is incomplete: removing a filled container must subtract its payload mass too, otherwise `wouldFitAfterTransaction()` can incorrectly reject a transaction that would fit after the real outgoing mass is removed.

Keep stack records on `ITEM_DEFS[kind].weight`; there is no per-instance payload there.

## 4. Transfer semantics are already correct once admission is fixed

`src/items/inventoryTransfer.ts::transferInventoryInstance()` already:

1. resolves the exact source instance;
2. checks `destination.canAddInstance(instance)` before source mutation;
3. removes source ownership;
4. adds destination ownership;
5. rolls back on unexpected add failure.

Do not redesign this helper. A focused regression test should prove a filled container rejected for capacity leaves both inventories unchanged.

`items-player-053` (world pickup atomicity) and `items-player-055` (container transfer atomicity) own transaction ordering in their respective flows. They should consume the corrected admission predicate, not be pulled into this plan.

## 5. Instance-aware capacity feedback

`inventoryFullToastText(inventory, kind, n)` calls kind-level `hasWeightRoom()`, so it cannot explain a rejection caused only by payload mass.

Add a narrow instance-aware sibling rather than changing the existing kind API, for example:

```ts
inventoryFullToastTextForInstance(inventory, instance)
```

It should determine weight using the same carried-instance helper and size via `hasSizeRoom(instance.kind, 1)`.

Use it where a UI path has already failed `canAddInstance(instance)` and has the concrete instance. The important current case is `src/app/actions/containerActions.ts` withdrawal paths; `gatheringActions.ts` / tent packing can use it too for consistency, but no liquid-specific caller checks should be added.

## 6. Tests worth adding

Prefer focused additions to existing suites:

- `src/items/Inventory.test.ts`: empty / partial / full liquid container admission, post-add invariant, non-liquid regression, armor quality regression;
- `src/items/inventoryTransfer.test.ts` if present, otherwise the nearest existing transfer suite: overweight filled-container transfer is false and preserves both owners;
- `src/items/trade.test.ts`: mixed transaction with an exact filled instance verifies payload mass for incoming and outgoing concrete instances.

Use a capacity threshold between empty-container mass and filled-container mass so the regression specifically proves payload admission rather than a generic weight failure.

## 7. Scope / pitfalls

- No persistence change: `amountLitres` already round-trips in `SaveItemInstance`.
- No size/gabarite change: continue `itemSizeUnits(instance.kind)`.
- No liquid density or container-capacity tuning.
- No new owner/state registry.
- Do not special-case waterskins/buckets in callers; future payload-bearing instances should have one place to extend the mass calculation.
- Current merchant acquisition creates fresh **empty** liquid containers via `createAcquiredInstance()`; the trade fix still matters for exact owned instances and future concrete-instance transactions.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
