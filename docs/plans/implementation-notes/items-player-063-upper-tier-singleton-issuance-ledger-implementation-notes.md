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

## Implementation — 2026-11-04

Implemented the 14 matrix U identities in `upperTierIdentities.ts`, including armor kinds that are not yet catalog-registered. `claimUpperTierInstance()` owns creation through the existing weapon/armor factories (capability-gated), locks the kind before preflight to reject reentrant claims, checks destination capacity and source eligibility, then commits the specimen, source/payment marker and ledger in one synchronous transaction. Failed/throwing source commits restore the source snapshot and remove the exact destination instance. The destination uses the existing `Inventory` capacity/add/remove methods structurally, so a future durable pickup record can provide those operations without requiring a second inventory. A fixture verifies this contract; no pickup issuer is enabled. Destruction only changes a matching live entry to a permanent tombstone.

Generic factory, count-inventory, grant and trade paths refuse restricted kinds; item-only pickups require an exact durable instance payload, and count-only treasure snapshots reject restricted kinds. No source is enabled. Unsupported catalog sales are refused until a source can move the same instance to a durable owner.

The app owns the mutable ledger outside `WorldBundle`; same-world rebuilds retain it, new-world setup clears it, and `SaveData` stores it. Save v58 migrates to v59 by enumerating registered owner fields (player, NPC personal/cargo/merchant/corpse, household, placed/world-generated/carried containers, resource sites and exact dropped payloads). Missing-ledger migration seeds only exact instances; duplicate identity/ID, unsupported count stacks and bare restricted drops fail schema validation before runtime construction. The owner walk names persistence domains explicitly and runs at load/write, not per frame.

Tests cover same-kind competing/reentrant sources, failure and throwing-source rollback, capacity failure, all 14 generic no-count grants, permanent destruction tombstones, each persisted owner adapter, ledger-less migration, duplicate IDs including restricted↔ordinary collision, count-only inventory and bare drops. Root's separate transfer suite covers exact-ID movement across owners, save/rebuild and NPC death. Verification: 193 focused ledger/save tests pass; the coordinated batch passes 2425 tests across 166 files. After strengthening malformed/mismatched restricted drop validation, the four affected ledger/transfer/save suites pass all 200 tests. Vue type-check, scoped ESLint and production build pass. The side-initiative index §8 records the shared run. Browser verification is not applicable; there are no enabled sources or player-facing changes.

**Acceptance boundary:** implementation is in place, but independent Opus review R-A is still required before items-player-064 U can enable a source. No A8 destruction reissue policy was selected; tombstones remain permanent.

## Opus R-A — 2026-11-07

[Review 042](../../reviews/2026-11-07--042--items-063-upper-tier-ledger-r-a-review.md): claim transaction, lock, rollback, capability factories, lifetime, migration and duplicate rejection PASS; issuer list empty. Required before 064 U (no save version bump):

- **R1** — `sellInstancesForCoins` (`trade.ts`) sells a claimed specimen into the void (probe: `ok`, 1170 coins, ledger still `live`); refuse restricted kinds there and in `resolveInstanceSellPrice`; add to the bypass test. The "unsupported catalog sales are refused" line above was incomplete.
- **R2** — a `live` claim with zero owners currently fails `isSaveData`, so every later save write is refused. Split: duplicates/contradicting IDs reject; orphan live claim accepted with a save diagnostic (claim stays `live`, no reissue).
- **R3** — owner walker is hand-listed (misses `settlementEconomies[*].food.instances`); add a structural coverage test over every instance-bearing save path.

Optional F7 cleanups (type dedupe, capability import test, scoped count walk) in the review. 063 completes when R1–R3 are green.
