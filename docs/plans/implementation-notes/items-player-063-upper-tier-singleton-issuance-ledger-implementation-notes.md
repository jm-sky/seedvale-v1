# Implementation notes: Upper-tier singleton issuance ledger

**Plan:** `items-player-063-upper-tier-singleton-issuance-ledger.md` · verified at `fe49547f` (2026-11-04, static).

## Precedent to copy: `consumedWorldPickupIds`

The closest existing world-lifetime, rebuild-surviving, saved set is `consumedWorldPickupIds`:

- created in `src/app/createApp.ts:639` from `initialSave`, passed into the world composition (`createApp.ts:868`) and the game loop (`gameLoop.ts:701`, mutated at `:2280`);
- exported by `src/app/saveState.ts` (`:105`, `:165`, `:283`);
- validated/migrated in `src/persistence/saveData.ts`.

Follow the same lifetime: owned by app composition (outlives `WorldBundle` replacement), handed to consumers by reference, exported/restored through `saveState` + `saveData`. Do **not** put the ledger inside a settlement, chunk or worldgen cache. It is not part of any cache fingerprint and does not touch `WORLDGEN_EPOCH`.

## Seams

| Concern | Where |
| --- | --- |
| Instance creation | `createAcquiredInstance()` `src/items/trade.ts:199` (dispatch by family); `createArmorInstance(kind, quality, id?)` `armorItemInstances.ts:34`; `createWeaponInstance` (`weaponMaintenance.ts`); IDs from `createItemInstanceId()` `itemInstances.ts:242` (`item:${Date.now()}:${n}`) |
| Ownership moves | `transferInventoryInstance()` `src/items/inventoryTransfer.ts:40` (preflight + rollback); `transferAllInventoryContents()` `:69` is incremental, not atomic |
| Corpse | `src/settlement/npcPostDeath.ts` — full personal-inventory handoff (exact IDs) |
| Count-only snapshot (insufficient for singletons) | `snapshotTreasureContents()` `src/items/treasureGameplay.ts:289` — a restricted kind must never enter a count-only path; guard it |
| Merchant stock | `seedMerchantStockIfNeeded()` `src/settlement/merchantTrade.ts:637` + persisted init latch |
| Household starter stock | `src/settlement/householdProfessionStock.ts` (`pushGrant`) |
| Load pipeline | `loadStoredSave` → `migrateStoredSave` → validation → epoch check (`saveData.ts:4540–4565`) — the cross-domain integrity scan runs on the **validated, migrated** snapshot before world creation |

There are ~51 production `addInstance(` call sites. The bypass-guard test should not grep source; instead route restricted-kind refusal through the factories (`createAcquiredInstance`, `createArmorInstance`, `createWeaponInstance`, and the generic instance factory) with an explicit "issued by ledger" capability parameter or a separate internal factory only the claim command can call. Transfers move existing objects and never call factories — keep it that way.

## Pitfalls

- Sales: some catalog sale paths remove the item and pay coins without a durable destination. For restricted kinds, those paths must refuse (keep the sale unavailable) — a sale must move the exact instance to a durable stock owner. Audit `src/items/trade.ts` sale functions and record which are safe.
- Uncollected authored pickups that will hold upper-tier items: a rendered pickup is already a live specimen; it must carry a durable instance payload. Out of scope here (064 U), but the ledger API must accept a pickup record as a destination.
- Keep the scan bounded to load and explicit verification calls; no per-frame or per-transfer world scan.
- Save field naming: follow neighbouring top-level fields (`consumedWorldPickupIds` style); version per token rule.

## Order

Pure ledger type + claim command with in-memory fixtures → factory guards + bypass test → save field/migration + load integrity → app wiring (no issuers). Parallel-safe with 062 and 065 S1 (different files) except `saveData.ts` — hold the migration token only for the save commit.
