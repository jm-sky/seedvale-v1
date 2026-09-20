# Implementation Notes: world-terrain-048 — Contextual shovel finds by environment

Recon baseline: current `main` on 2026-09-20.

These notes record implementation-specific decisions from current code. Follow current source if it drifts.

## 1. Keep `GroundActions.startDigAt()` as the only shovel completion seam

`src/app/actions/groundActions.ts::startDigAt()` currently:

1. verifies `soil_digging`;
2. resolves `getDigProfileAt(x, z, bundle.chunkManager)`;
3. runs the physical busy action;
4. on completion calls `applyDigAt(...)`;
5. resolves authored/landmark Hidden Find consequences;
6. syncs Quick Actions.

Do not add another input, `Interactable`, Quick Action or shovel action.

The contextual-find result should be resolved as part of the ordinary completed dig before/alongside the existing post-dig Hidden Find checks. Hidden Finds remain separate because they own one-shot spatial identity/persistence.

## 2. Current low-level dig acquisition is already the correct grant path

`src/terrain/digAction.ts` already exports:

- `addDigItemToInventory(kind, feedback, amount)`;
- `dropDigItemNearby(kind, x, z, feedback, random)`.

`applyDigAt()` already uses those semantics for stone and the coastal shell addition from world-terrain-047.

Extend that same path. Do not call `ctx.grantItem()` for ordinary contextual dig resources unless a future instance-backed outcome requires composition-level handling.

A small helper such as `grantDigFind(kind, ...)` may be worthwhile only if it removes repeated inventory-capacity/drop code for shell + contextual finds; do not build a generic loot service.

## 3. Do not fold this into `world/hiddenFinds.ts`

Current Hidden Finds are materially different:

- `world/hiddenFinds.ts` derives deterministic landmark spots from stable landmark ids;
- `GroundActions` records those spots in `resolvedHiddenFindSpotIds`;
- cemetery/landmark consequences can drive badges/reputation;
- save/load preserves resolved one-shot spots.

Contextual shovel finds have no stable spot identity and follow the existing `Math.random`/injectable-RNG action semantics of `resolveDigStone()` and `resolveDigShell()`.

No new SaveData field is required.

## 4. Prefer one pure contextual resolver in the terrain domain

Keep probability/priority logic testable without `WorldBundle`.

Recommended shape is conceptually:

```ts
type DigContextualFindContext = {
  coastal: boolean
  settlement: boolean
  swamp: boolean
  forest: boolean
  mountainOre?: MineableOre
}

resolveContextualDigFind(context, random): ItemKind | null
```

Exact naming may follow nearby code.

The resolver should own:

- category priority;
- the single-special-find cap;
- probability thresholds;
- settlement weighted outcome;
- ore type → item mapping.

It should not own Three.js, inventory, settlements or resource-deposit objects.

`dig.ts` is the natural location if kept small; if the table grows enough to obscure ground-profile logic, use one focused sibling such as `terrain/digFinds.ts`. Do not create a cross-domain generic loot module.

## 5. Coastal classification is already canonical

Use `isEligibleShellDigSpot(x, z, profile, chunkManager)` / the same `coastalResources.ts` predicate already used by ordinary shell digging.

Do not approximate coast by height alone.

Current ordinary shell constants/functions in `dig.ts`:

- `SHELL_CHANCE_SHORE_DIG = 0.18`;
- `resolveDigShell()`;
- `isEligibleShellDigSpot()`.

Leave them intact.

The 5% exceptional-shell / 2% amber coastal special table is additional and mutually exclusive inside that table.

A simple probability interval is sufficient:

```text
0.00–0.05 exceptional_shell
0.05–0.07 amber
otherwise none
```

This produces a total 7% coastal special chance while preserving the independent ordinary-shell roll.

## 6. Forest and swamp signals should reuse existing samplers

`ChunkManager` already exposes:

- `sampleHeight`;
- `sampleMountainRidge`;
- `sampleMoistureRegion`;
- `sampleForestFactor`;
- `sampleForestBiome`;
- `sampleContinentalness`.

`WorldContext` mirrors the same read-only signals.

For forest, prefer `sampleForestBiome(x, z)` and accept `forest` or `deepForest`.

For swamp, use `biomeWeightsAt()` with the current position's:

- moisture = `sampleMoistureRegion(x, z)`;
- altitude fraction derived from `sampleHeight`, `waterLevel`, `heightScale`;
- existing `region`.

Use the same altitude convention already used by current biome consumers; do not invent a separate swamp threshold. A swamp eligibility threshold should be based on the existing soft weight (recommended `>= 0.55`, matching established world-site use such as `treasureSites.ts`) rather than any new noise or hard moisture cutoff.

Only shovel-diggable soil should use inland forest/swamp tables; sand coast is handled earlier.

## 7. Settlement proximity can remain composition-level and event-driven

`SettlementsManager.getLoaded()` returns the currently materialized settlements. `Settlement` exposes:

- `id`;
- `center: Vector3`;
- `size`;
- `spawn`;
- `landmarks`.

The authoritative planned footprint lives on the associated `SettlementDef.plan.boundary`, while size config also carries a footprint radius.

Do not add a world-wide settlement index for one event-driven check.

At dig completion, resolve the nearest loaded settlement and consider the point eligible when it lies within that settlement's planned boundary radius plus a small fixed margin (recommended 12 world units). If the live `Settlement` does not expose its plan directly, resolve its definition through the manager's existing definition/cache seam rather than reconstructing village size geometry ad hoc.

The home and ordinary streamed procedural settlements are sufficient for V1. Do not expand this plan into founded-colony materialization unless current source already exposes them through the same loaded-settlement list.

## 8. Mountain prospecting must use the existing ore authority

`src/terrain/resourceDeposits.ts::ResourceDeposits.queryNearest(x, z, range, options?)` is the canonical bounded ore query.

Important properties:

- it returns `DepositTarget` with `type: MineableOre`;
- default query context is surface;
- it respects current depletion;
- it already serves both player and NPC mining;
- no render-object scan is needed.

At a completed shovel dig:

1. first establish mountain/highland eligibility from existing terrain signals;
2. only then call `bundle.resourceDeposits.queryNearest(x, z, 100)` (use the actual WorldBundle field name from current source);
3. pass only the returned ore type into the pure contextual resolver.

Do not call `mine()` and do not mutate `ResourceDepletionState`.

Use the existing mineable mapping:

- `iron` → `iron`;
- `coal` → `coal`;
- `gold` → `gold`;
- `copper_ore` → `copper_ore`.

For mountain eligibility, reuse the current mountain/ridge signal already sampled by `getDigProfileAt()`; do not create a “mountain biome” enum. Note that shovel digging rejects bare rock via `ROCK_MOUNTAIN_RIDGE_THRESHOLD`, so prospecting applies to diggable highland/mountain soil around deposits, not the bare-rock point itself.

If the current ridge threshold leaves no useful eligible shoulder band, use altitude/highland plus a lower ridge signal in the context resolver rather than weakening `getDigProfileAt()`'s rock rejection.

## 9. Context should be supplied narrowly to `applyDigAt()`

Today `applyDigAt()` receives:

- chunk manager;
- x/z;
- resolved `DigProfile`;
- `DigFeedback`;
- RNG.

Do not make `digAction.ts` import `SettlementsManager` or `ResourceDeposits`.

Two low-risk shapes are acceptable:

- add an optional plain `contextualFind` / `DigContextualFindContext` argument resolved by `GroundActions`; or
- have `GroundActions` call one pure context resolver then pass the resolved `ItemKind | null` into `applyDigAt()`.

Prefer the first if it keeps all dig-find chance rolls together under one injected RNG; prefer the second if it materially reduces coupling and tests remain clear.

Do not duplicate the same special-find roll both in `GroundActions` and `digAction.ts`.

## 10. Items: add normal catalog entries, not quest instances

`src/items/items.ts` owns `ItemKind`, `ITEM_DEFS` and procedural fallback meshes.

Add:

- `amber`;
- `exceptional_shell`.

Both are count-backed ordinary resources:

- categories: `['resource']`;
- very small weight/size comparable to shell/gems;
- no instance identity;
- no holdable capability;
- no story category.

Use distinctive procedural geometry/colors in `createItemMesh()` if there is no current GLB. Do not add asset documentation unless a new media file is actually introduced.

`src/items/itemCatalog.ts` is a total catalog over `ItemKind`; add the required entries/metadata there so compile-time exhaustiveness remains intact.

## 11. Trade semantics

`src/items/tradeCatalog.ts` currently gives explicit fallback resource values and separately prevents ordinary `shell` and `coin` from normal sell behavior.

Add explicit resource values:

- `exceptional_shell: 12`;
- `amber: 18`.

Do not place them in merchant stock tables.

Do not change ordinary `shell`'s special barter-only behavior.

The two new resources should be sellable through the ordinary fallback/resource valuation path unless the current trade code requires a small explicit allow path. Keep that change local.

## 12. Probability resolver details

Use one random stream passed into the pure resolver, not one independent 2% roll for every possible settlement tool.

Required V1 behavior:

- coastal special: 5% exceptional shell, next 2% amber;
- settlement: 2% category success, then weighted result 70/15/10/5;
- swamp: 2% amber;
- forest/deepForest: 2% amber;
- mountain with nearby ore: 2% matching ore;
- no eligible context: none.

Context priority:

```text
coastal > settlement > swamp > forest > mountain > none
```

A location should run only the highest-priority contextual profile.

Keep ordinary stone and ordinary shell rolls independent from this resolver.

## 13. Tests worth adding

### Pure resolver

Test with fixed RNG samples around every boundary:

- coastal exceptional shell below 0.05;
- coastal amber in 0.05–0.07;
- coastal none above;
- settlement category miss;
- settlement category hit + each weighted branch;
- forest/swamp amber hit/miss;
- mountain hit maps every `MineableOre`;
- priority picks only one context.

### Dig action

Existing `digAction` tests should cover:

- contextual item fits → inventory;
- full inventory → ground drop;
- ordinary shell can coexist with one contextual special;
- at most one contextual special is granted.

### Composition

Only add a focused `groundActions`/context test if needed to prove:

- settlement footprint resolution;
- nearby-deposit result is passed through;
- no deposit query when mountain eligibility is false.

Avoid booting a full world just to test probability tables.

## 14. Persistence/lifecycle

No new persistent state.

The only world mutation remains the existing terrain deformation, which already follows the current terrain-modification persistence/lifecycle contract.

The contextual find is consumed immediately into inventory/drop state. No runtime manager, cache, tick or dispose path is required.

## 15. Implementation order

1. Add `amber` and `exceptional_shell` item/catalog/trade entries.
2. Add the pure contextual-find types/table/resolver and unit tests.
3. Compose biome/coast/settlement/ore context at `GroundActions.startDigAt()`.
4. Extend `applyDigAt()` acquisition to grant/drop at most one contextual find.
5. Add targeted integration tests and update relevant item/state docs only if implementation makes them stale.
6. Run the smallest relevant TypeScript/tests/lint/build checks.
7. Leave browser verification to the User.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
