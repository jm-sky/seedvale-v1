# Plan: Contextual shovel finds by environment

**Created:** 2026-09-20
**Status:** `verification needed` 🔍
**Type:** feature
**Priority:** medium · **Effort:** M
**Depends on:** ~~world-terrain-047~~
**Domain:** `world-terrain`
**Subdomains:** `terrain` `resources`
**Tags:** `shovel` `digging` `loot` `biomes` `prospecting`
**Roadmap:** -
**Model:** Composer, Sonnet

## Goal

Extend ordinary shovel digging so the ground can occasionally reveal small environment-specific finds.

The feature should strengthen the existing loop:

```text
world context
→ shovel dig
→ terrain mutation
→ ordinary stone/shell result
→ rare contextual find
→ inventory or ground drop
```

Finds must come from the same shovel action and acquisition mechanisms that already exist. Do not create a second digging action, generic loot manager, per-frame scanner or parallel resource registry.

## Current baseline

Current code already provides the relevant foundations:

- `terrain/dig.ts` classifies shovel-diggable soil/sand and owns ordinary stone chance.
- `terrain/digAction.ts::applyDigAt()` mutates terrain and resolves stone plus the current independent coastal shell roll.
- coastal shell eligibility is shared through `terrain/coastalResources.ts`.
- `ChunkManager` exposes runtime terrain samplers including forest, moisture, height, ridge and continentalness.
- `terrain/biomeRegions.ts` owns forest/swamp classification inputs.
- `ResourceDeposits.queryNearest()` is the canonical bounded lookup for nearby surface ore deposits.
- `GroundActions.startDigAt()` is the authoritative completed shovel-dig call site.
- `world-007` Hidden Finds are a separate mechanism for deterministic one-shot landmark spots and must remain separate from repeatable environmental chance finds.

## Scope

### 1. Add two ordinary resource items

Add:

- `amber` — rare natural resource found mainly on ocean shore, more rarely in forest/swamp soil;
- `exceptional_shell` — rare coastal shell distinct from ordinary `shell`.

They are normal `ItemKind` resources, not quest/story items.

Use lightweight procedural ground meshes unless a suitable existing asset is already wired. This plan does not require new external assets.

Starting trade values:

- `exceptional_shell`: 12 coin-equivalent;
- `amber`: 18 coin-equivalent.

Do not add either item to normal merchant stock. Ordinary `shell` keeps its existing barter-only semantics unchanged.

### 2. Preserve current ordinary dig outcomes

Do not change the existing:

- soil/sand dig eligibility;
- terrain deformation;
- stone chances;
- ordinary coastal `shell` chance;
- inventory-overflow drop behavior.

Contextual finds are additional outcomes.

A successful shovel dig may still produce:

```text
stone + ordinary shell + at most one contextual special find
```

The special-find layer itself must return at most one item per dig.

### 3. Contextual find profiles

Use these starting probabilities.

#### Ocean shore

On the same shared ocean-shore eligibility used by current shell digging:

- `exceptional_shell`: 5%;
- `amber`: 2%.

Resolve these as one special-find table so one dig cannot award both.

The existing ordinary `shell` 18% roll remains independent.

#### Forest / swamp

For shovel-diggable soil:

- forest or deep forest: 2% `amber`;
- swamp: 2% `amber`.

Reuse existing terrain/biome signals. Do not introduce another biome classification.

If a location satisfies multiple environmental categories, use explicit priority rather than stacking several special-find rolls. Coastal eligibility wins over inland biome finds.

#### Settlement surroundings

When digging inside or near a currently relevant loaded settlement footprint, resolve one 2% “lost object” roll.

On success use a weighted table:

- 70% `coin`;
- 15% `firestarter`;
- 10% `knife`;
- 5% `sickle`.

This is one 2% category roll, not 2% independently for every listed item.

Settlement eligibility should be bounded to the actual local settlement area: prefer the settlement's existing planned boundary/footprint plus a small margin rather than a large arbitrary center radius.

Do not introduce settlement wealth or a new settlement-spatial registry for this feature.

#### Mountain prospecting

When the dig is in mountain/highland terrain and a surface ore deposit is locally nearby, resolve a 2% trace-ore find.

Use the canonical bounded `ResourceDeposits.queryNearest(x, z, range)` lookup and return one unit matching the nearby deposit:

- iron → `iron`;
- coal → `coal`;
- gold → `gold`;
- copper ore → `copper_ore`.

Use a local prospecting radius of 100 world units as the initial balance.

No nearby deposit means no ore roll.

This is a trace/prospecting find and must not call `ResourceDeposits.mine()` or decrement the deposit reserve. It is intentionally a very low-frequency side yield from digging, not a replacement for pickaxe mining.

### 4. Context resolution ownership

Keep pure chance/table resolution in the terrain digging domain.

The shovel action needs context that `digAction.ts` does not currently own:

- loaded settlement proximity;
- nearby ore deposit query;
- biome/terrain sampling already exposed by the world bundle.

Pass a narrow contextual resolver/input from `GroundActions.startDigAt()` rather than importing `SettlementsManager` or `ResourceDeposits` directly into low-level terrain code.

Do not turn `digAction.ts` into a composition root.

### 5. Acquisition behavior

Reuse the current count-backed dig acquisition path:

- if inventory can accept the item → add it and show the existing acquisition feedback;
- otherwise → drop it beside the dig through `DroppedItems`.

Do not silently discard a successful find.

For instance-backed items, use the existing acquisition-instance path if any future table includes one. The V1 table in this plan contains only count-backed kinds.

### 6. Randomness semantics

This feature follows the existing ordinary shovel stone/shell semantics: chance is rolled when the completed physical dig resolves.

Do not reuse `world/hiddenFinds.ts`, `resolvedHiddenFindSpotIds` or Hidden Find persistence. Those systems represent stable one-shot world spots, while this feature represents repeatable low-probability material discovery during physical digging.

Keep random injection available in pure resolver functions so probabilities and precedence are unit-testable.

### 7. Performance

No per-frame work.

All extra work occurs only after a completed shovel dig.

The only spatial query with meaningful cost is mountain prospecting; it must use the existing bounded deposit lookup and only execute when the terrain is eligible for prospecting.

Settlement proximity may inspect the small loaded-settlement set at dig completion; do not scan procedural settlement cells/worldwide definitions.

## Context priority

Resolve contextual eligibility in this order:

1. ocean shore;
2. settlement surroundings;
3. swamp;
4. forest/deep forest;
5. mountain prospecting;
6. none.

Only one contextual profile may roll per shovel dig.

This prevents overlapping terrain/context signals from multiplying rare-find probability.

## Expected integration

Primary files:

- `src/terrain/dig.ts`
- `src/terrain/digAction.ts`
- `src/app/actions/groundActions.ts`
- `src/items/items.ts`
- `src/items/itemCatalog.ts`
- `src/items/tradeCatalog.ts`

Likely tests:

- `src/terrain/dig.test.ts`
- `src/terrain/digAction.test.ts`
- targeted GroundActions/context resolver tests if context composition cannot remain pure inside terrain tests.

Reuse:

- `isEligibleShellDigSpot()`;
- `biomeWeightsAt()` / existing `ChunkManager` samplers;
- `ResourceDeposits.queryNearest()`;
- `SettlementsManager.getLoaded()` and existing settlement center/plan footprint data;
- `addDigItemToInventory()`;
- `dropDigItemNearby()`;
- existing acquisition toast/HUD sync.

Add JSDoc to the main contextual-find resolver/type if it becomes a reusable architectural seam; include `@domain world-terrain` where useful for preflight discovery.

## Non-goals

- no archaeology profession/system;
- no generic loot-table framework;
- no new biome system;
- no new settlement lookup service;
- no persistent per-hole discovery state;
- no depletion of ore deposits from trace finds;
- no new quest hooks;
- no badges/achievements;
- no changes to landmark Hidden Finds;
- no shovel durability;
- no external GLB asset requirement.

## Verification

Automated:

- existing dig tests stay green;
- exact probability thresholds with injectable RNG;
- special-find result is capped at one item;
- coastal priority prevents forest/swamp/settlement stacking;
- ordinary 18% shell behavior remains unchanged;
- settlement weighted table maps the 2% success deterministically from supplied RNG;
- mountain result matches the queried deposit type;
- no nearby deposit → no mountain trace result;
- overflow drops the special item rather than losing it;
- `amber` and `exceptional_shell` are valid catalog/trade/inventory items;
- TypeScript, targeted tests and lint/build appropriate to touched files pass.

Manual browser verification by the User:

- dig repeatedly at ocean shore and observe ordinary + rare coastal finds;
- verify inland forest/swamp never produces coastal finds;
- verify settlement-area finds are rare and tools are much rarer than coins;
- verify mountain trace ore corresponds to a nearby real deposit;
- verify inventory-full finds appear on the ground;
- verify normal digging/terrain deformation and Hidden Finds still behave normally.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
