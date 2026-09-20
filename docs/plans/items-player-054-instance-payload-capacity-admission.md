# Plan: Instance payload capacity admission

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** medium · **Effort:** S
**Model:** Composer, Grok
**Depends on:** none
**Domain:** `items-player`
**Subdomains:** `inventory` `items`
**Type:** `bug`
**Roadmap:** -

## Goal

Make one authoritative instance-capacity calculation account for the full physical payload of an `ItemInstance`, so preflight and post-insertion inventory weight cannot disagree.

## Problem

`Inventory.totalWeight()` correctly adds liquid payload mass on top of a liquid container's base instance weight.

`Inventory.canAddInstance()` adds only `effectiveInstanceWeight(instance)`. That helper explicitly excludes liquid contents.

A filled waterskin/bucket can therefore pass `canAddInstance()` / `addInstance()` even when its real post-insertion weight exceeds `maxWeight`.

## Scope

### 1. Centralize effective carried weight of one instance

Add or extend a small item/inventory helper that returns the complete carried mass for an instance:

```text
instance structural/effective weight
+ payload mass owned by the instance
```

Today the extra payload is liquid volume × `LIQUID_DENSITY_KG_PER_LITRE`.

Keep armor-quality scaling through `effectiveInstanceWeight()`; do not duplicate that logic.

### 2. Use the same calculation for current and incoming state

Make these paths agree:

- `Inventory.totalWeight()`;
- `Inventory.canAddInstance()`;
- any mixed transaction capacity calculation that accepts concrete incoming instances;
- instance-specific capacity feedback where the caller has the actual instance.

After a successful `addInstance(instance)`:

```text
inventory.totalWeight() <= inventory.maxWeight
```

must hold whenever it held before the insertion.

### 3. Keep size semantics unchanged

This is not a packing redesign. Continue using `itemSizeUnits(instance.kind)` for size/gabarite unless current code provides instance-specific size state in the future.

### 4. Keep ownership semantics separate

Do not fold source/destination transaction ordering into this plan. Generic pickup atomicity is `items-player-053`; container transaction consistency is `items-player-055`.

This plan fixes admission math.

## Relevant files / symbols

- `src/items/Inventory.ts::totalWeight`
- `src/items/Inventory.ts::canAddInstance`
- `src/items/Inventory.ts::addInstance`
- `src/items/Inventory.ts::inventoryFullToastText` or a new instance-aware sibling if needed
- `src/items/armorItemInstances.ts::effectiveInstanceWeight`
- `src/items/liquidContainer.ts`
- `src/items/trade.ts` concrete-instance capacity helpers
- focused Inventory/transfer tests

Add JSDoc with `@domain items-player` to any new shared effective-instance-mass helper.

## Tests

Add focused automated coverage proving:

1. empty liquid container admission uses base/effective instance mass;
2. partially filled container includes liquid mass;
3. full container is rejected when base container would fit but base + liquid would not;
4. successful full-container insertion leaves total weight within max;
5. armor quality effective weight remains unchanged;
6. non-liquid instance kinds keep existing capacity behavior;
7. `transferInventoryInstance()` rejects an overweight filled container without mutating either owner;
8. mixed trade/transaction capacity calculation does not undercount a concrete filled instance where such instances are accepted.

## Guardrails

- No liquid-specific capacity checks scattered through UI/action callers.
- No duplicate armor weight formula.
- No persistence schema change.
- No change to liquid density/capacity gameplay tuning.
- No browser verification by the implementing agent.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
