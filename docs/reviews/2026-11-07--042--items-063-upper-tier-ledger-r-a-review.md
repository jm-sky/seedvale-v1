# Review 042 — items-player-063 upper-tier issuance ledger (Opus R-A)

**Date:** 2026-11-07
**Reviewer:** Claude Opus 5.5 (independent; did not author 063)
**Scope:** Opus review **R-A** required by the [side-initiative index §7](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md#7-required-opus--astra-involvement): the 063 ledger protocol, its enabled-issuer list, determinism, save/load, duplication protection and readiness for [items-player-064](../plans/items-player-064-stage-4-living-world-sources-and-npc-weapon-use.md) slice **U**. Reviewed against [plan 063](../plans/items-player-063-upper-tier-singleton-issuance-ledger.md), its [implementation notes](../plans/implementation-notes/items-player-063-upper-tier-singleton-issuance-ledger-implementation-notes.md), [review 032](./2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md), the Stage 4 proposal P7a and the integration matrix U rows.
**Baseline:** `main` @ `78c47dbf` (063 landed in `06eabd08`; later commits up to v62 do not change the ledger files, only add save versions/owners elsewhere).
**Evidence:** static source reading; focused Vitest (9 files / 300 tests pass: `upperTierIssuance`, `upperTierTransfers`, `treasureGameplay`, `saveData`, `saveDb`, `interactables`, `stage4UpperTierMelee`, `stage4Bows`, `merchantStage4Sources`); a **temporary probe test (not committed, removed)** for F1/F2. No browser, gameplay or performance check (none applicable — no player-visible change). Markers: ✅ verified · 🟡 Opus resolution · ❓ author decision.

## 1. Verdict

**063 core protocol: PASS. 064 slice U: NO-GO until R1–R3 land and U1–U4 are satisfied.**

The claim transaction, reentrancy lock, rollback, capability-gated factories, app-owned lifetime, migration and duplicate rejection are correct and well tested. Today **no production issuer exists** (✅ `claimUpperTierInstance` / `markUpperTierDestroyed` have no non-test callers; none of the 14 identities is in any merchant, household, loadout, pickup or quest source), so nothing below is a live player bug yet. But two defects turn the first real specimen into a save hazard: one path sells a claimed specimen into the void, and any orphaned live claim makes **every subsequent save write fail**. Together they mean any future leak bricks saving instead of degrading gracefully. These must be fixed before U enables a source; 063 stays `in progress` until then.

## 2. What is correct ✅

| Area | Evidence |
| --- | --- |
| Restricted list | `src/items/upperTierIdentities.ts:7` — exactly the 14 matrix U identities; 6 weapons registered, 8 armor IDs listed ahead of 066 registration (string set, no order dependency). Test asserts length 14. |
| Claim transaction | `src/items/upperTierIssuance.ts:49` — rejects already-claimed kind (live **or** destroyed) and a per-ledger in-flight lock (`activeClaims` WeakMap) blocks reentrancy; preflight → create → capacity → snapshot → add → commitSource → ledger write last. Every failure removes the exact destination instance and restores the source snapshot; a failed restore throws instead of silently leaving partial state. |
| Factory capability | `createWeaponInstance` / `createArmorInstance` return `null` for restricted kinds without `UPPER_TIER_FACTORY_ACCESS` (`weaponMaintenance.ts:102`, `armorItemInstances.ts:51`); type overloads exclude `UpperTierIdentity` from public signatures. |
| Generic bypass guards | `createAcquiredInstance` (`trade.ts:204`), `Inventory.canAdd` count path (`Inventory.ts:365`), grant (`createApp.ts:1366`), starting loadout (`createApp.ts:408`), NPC legacy count→instance hydration (`npcState.ts:323`), maintenance hydration (`weaponMaintenance.ts:159`, `armorItemInstances.ts:162`), count-only treasure snapshot (`treasureGameplay.ts`), item-only pickups without a durable payload (`interactables.ts:1617`), merchant count purchases (`trade.ts:422`, `:510`) and every offer/buy-back path (`trade.ts:170`, `:389`). |
| Transfers | Exact-ID moves via `transferInventoryInstance` never call factories; corpse handoff, looting, drops and pickup keep the ID (`upperTierTransfers.test.ts`). Equipment/held references are ID references, not owners. |
| Lifetime | Ledger owned by app composition outside `WorldBundle` (`createApp.ts:644`), same idiom as `consumedWorldPickupIds`; cleared only on New Game (`createApp.ts:2998`); loading another slot reloads the page, so no cross-save bleed. Exported by `saveState.ts:286` (deep clone). |
| Migration | `migrateSaveV58ToV59` (`saveData.ts:4757`) seeds only exact instances, keeps duplicates so current-schema validation rejects them (`migration-failed`, previous slot untouched) — matches "never repair corrupt data into accepted state". |
| Tombstones | `markUpperTierDestroyed` only transitions the matching live ID; a destroyed kind can never be re-claimed (permanent until the A8 reappearance policy). |
| Worldgen | No cache or `WORLDGEN_EPOCH` involvement — correct; nothing worldgen-derived refers to the ledger. |

## 3. Findings

### F1 — P1 (blocker for U): `sellInstancesForCoins` sells a claimed specimen into the void ✅

- `src/items/trade.ts:828` `sellInstancesForCoins` → `resolveInstanceSellPrice` (`tradeCatalog.ts:523`) → `canSell(kind)` is true for every kind except `shell`/`coin`. No restricted-kind check. The instance is removed and coins added; there is no durable destination.
- Reached from the player inventory sell action while a merchant is open (`inventoryWiring.ts:477`), and `inventoryView.ts` already shows a non-zero sell price for restricted instances.
- Probe: claim `yewmaster_longbow` → `sellInstancesForCoins(inv, [id])` returns `{ result: 'ok', totalCoins: 1170 }`, specimen count 0, ledger still `live`.
- Contradicts plan 063 Pitfalls ("a sale must move the exact instance to a durable stock owner … refuse") and the notes' claim that unsupported catalog sales are refused. The guards covered the *offer* paths but not this instance-sale path.

**R1 (required):** refuse restricted kinds in `sellInstancesForCoins` (and make `resolveInstanceSellPrice` return `null` for them so the UI shows them as unsellable). Sale-back to a merchant, if ever wanted, is a U design item (exact-instance move into `merchantStock`), not this path. Add the case to the bypass test.

### F2 — P1 (blocker for U): an orphaned live claim makes every save write fail ✅

- `diagnoseUpperTierOwnerRows` (`upperTierIdentities.ts:88`) returns an error for a `live` claim with 0 matching owners; `validateUpperTierSaveOwnership` runs inside `isSaveData` (`saveData.ts:3105`); `writeSave`/`createSave` (`saveDb.ts:310`, `:369`) refuse any outgoing snapshot that fails `isSaveData` (`invalid-outgoing-snapshot`).
- Probe: `diagnoseUpperTierOwnerRows({ yewmaster_longbow: live 'gone' }, [])` → `"live claim yewmaster_longbow:gone has 0 matching owners"`.
- Consequence: the first time a specimen leaves the enumerated owners — F1, a future void path, an owner domain the walker does not list (F3), a `carried`/transient owner — the ledger keeps the live claim (correctly: "missing owner ≠ destruction"), but **autosave and manual save fail for the rest of the session and the progress since the last good save is lost**. A data-integrity guard thus escalates a lost item into lost play time.
- Plan 063 §5 asked to reject "a ledger entry contradicting owners", but also states "missing owner ≠ destruction". The implementation conflated the two. 🟡 Resolution: they are different classes.
  - **Reject (load and write):** duplicate physical IDs, two specimens of one identity, an owner row whose ID differs from the live claim, an owner of a `destroyed` or unclaimed identity, count stacks / bare drops. These indicate duplication — the A8 invariant itself.
  - **Accept with diagnostic (load and write):** a `live` claim with zero owners. The claim stays `live` (no reissue, no automatic tombstone), a `logSaveDiagnostic('upper-tier-orphan-claim', kind)` records it. This is the "missing ≠ destruction" rule and cannot create a second specimen.

**R2 (required):** split the diagnostic into duplicate-class (reject) vs orphan-class (accept + diagnostic), keep the existing rejection tests, add an orphan-claim save/load round-trip test.

### F3 — P2 (required before U): owner enumeration is hand-listed with no completeness guard ✅

- `upperTierOwnerRowsFromSave` (`saveData.ts:1643`) names 11 owner domains. It already misses one instance-bearing domain: `settlementEconomies[*].food.instances` (`economy/settlementEconomy.ts:52`). Food-only today, so no live gap, but it shows the list drifts silently; since 063, three save versions (v60–v62) have been added without anyone revisiting it.
- The test (`upperTierIssuance.test.ts`, `it.each`) asserts each *listed* domain is found; nothing fails when a new `SaveData` field starts holding `SaveItemInstance[]` (future U pickup records, quest escrow, cart cargo, wild-fauna carcass loot).
- Meanwhile `hasUpperTierCountStack` (`saveData.ts:1721`) is a full recursive walk — the two checks disagree on what "the save" is.

**R3 (required):** make coverage structural. Either (a) a test that builds a maximal fixture and recursively finds every `instances` array / `instance` payload path, asserting each path is either in the owner walker or in an explicit "non-owner" allowlist; or (b) a typed `Record<keyof SaveData, 'owner' | 'none'>` classification that fails type-check when `SaveData` gains a field. Add `settlementEconomies` food to the walker. (a) is recommended — it also catches nested owners inside NPC/household snapshots.

### F4 — P2: U needs a deterministic source designation, not first-materialized-wins 🟡

The ledger is first-come. Merchant stock seeds lazily on first settlement materialization (`seedMerchantStockIfNeeded` + latch) and households on first construction; quests/pickups on player action. If several alternative sources may claim one identity, **which** settlement holds it depends on the player's exploration order — same seed, different worlds. This violates the 064 rule "Same seed + source → same result" in spirit and makes U untestable by seed.

🟡 **U1 (Opus resolution, author confirmation requested as Q-U2):** each identity gets **one designated host** per world, computed deterministically from seed + worldgen data (e.g. a hash over the stable, eligible source keys of that identity), before any materialization; only the designated source may call `claim`, with a stable `issuanceKey` such as `merchant:<settlementId>:<npcId>:<kind>` or `quest:<questId>:<kind>`. The ledger stays the safety net against double issuance, not the selection mechanism. If the designated source becomes unavailable (settlement abandoned, quest failed), the identity stays unissued until the A8 policy says otherwise.

### F5 — P2: U wiring and per-source rules that 063 does not yet provide

These are not 063 defects; they are preconditions U must implement, recorded here so 064 U does not discover them mid-slice.

- **U2 — ledger reach.** The ledger reaches only `saveState`. Sources live inside `WorldBundle` / `SettlementsManager` (merchant/household seeding) and `interactables` (pickups/rewards). Thread it **by reference** through the existing composition seam exactly like `consumedWorldPickupIds` (`createApp.ts:874`, `:2929`) — no second registry, no copy per bundle.
- **U3 — latch atomicity.** For merchant/household sources, the stock-init latch and the claim must commit in one step: claim before inserting into stock (already in 064 notes), and a failed/refused claim must still set the latch (no reseed on reconstruction/reload). Test: claim → reload → reconstruct settlement → no second attempt, specimen still in stock.
- **U4 — purchase path.** Count purchases of restricted kinds are hard-refused (`trade.ts:422`, `:510`); the exact-instance purchase path (`resolveMerchantPurchaseInstances`, `trade.ts:454`) is the one U must use. Verify the merchant UI sends `instanceIds` for restricted rows and add a test that buying moves the same ID player-side.
- **Issued armor quality.** `createIssuedInstance` hard-codes `'common'` for armor (`upperTierIssuance.ts:38`); `ArmorQuality` has no Exceptional/Legendary tier, and the matrix marks four armor identities "unique/legendary". 🟡 Tier is identity-level (profile), not an armor-quality roll: when 066 registers these kinds, the claim input should take the identity's authored quality from one table owned next to `UPPER_TIER_IDENTITY_LIST`, not a caller argument.
- **Non-persistent owners.** `NpcAgent.carried` and other transient work inventories are not persisted (`docs/state/persistence.md`). No path moves restricted instances into them today (✅ grep of `carried.add*`), but U must not route specimens through `carried`; add a refusal or a test.

### F6 — P3: invisible but persisted specimens (input for the A8 policy question) ✅

- Burial: `finalizeNpcCorpseBurial` calls `dropNpcCorpseLoot(postDeath, null)` (`npcPostDeath.ts:202`), which returns early, so the loot **remains in the terminal corpse snapshot** forever — still an enumerated owner, so no orphan and no duplicate, but the specimen becomes unreachable.
- Carrier death: transport cargo stays on the dead NPC's state (documented gap in `commitNpcDeath`).
- Not a correctness defect; it is a product question: a buried Legendary sword is either a permanent grave good or should be dropped at the grave. Folded into Q-U1.

### F7 — P3 cleanups (non-blocking)

- The record shape `{ instanceId, issuanceKey, status: 'live' | 'destroyed' }` is declared three times (`UpperTierIssuanceRecord`, `UpperTierIssuance`, inline in `SaveData` and `saveData.ts:1692/1697/4758`). Export one `UpperTierClaimStatus` union and one record type (project rule: dedicated union types) and reuse them.
- `UPPER_TIER_FACTORY_ACCESS` is an exported symbol — the capability is by convention. Add a test asserting it is imported only by `upperTierIssuance.ts`, `weaponMaintenance.ts` and `armorItemInstances.ts`.
- `hasUpperTierCountStack` walks the whole save tree on every `isSaveData` (each write, each load, each `inspectStoredSave` of an existing slot before overwrite). Not per-frame, but unnecessary once R3 gives a named owner list — scope it to owner domains.
- Instance IDs are `item:${Date.now()}:${n}` (`itemInstances.ts:288`) — existing pattern, acceptable because the ledger is keyed by identity. U determinism tests must compare identity → designated source, never instance IDs.

## 4. Enabled-issuer list (R-A acceptance item)

| Issuer | State at `78c47dbf` |
| --- | --- |
| Merchant stock / premium offers | none — the 064 O1/O3 lists contain no U identity ✅ |
| Household starter stock | none ✅ |
| NPC loadouts | none; shepherd weights typed `Exclude<…, UpperTierIdentity>` ✅ |
| Authored pickups / quest rewards / treasure | none; item-only pickups of restricted kinds refused ✅ |
| Debug grants | refused through `grantItem` / factories ✅ |
| Fixture issuers | tests only ✅ |

The list is empty. U may add issuers only after R1–R3 and with U1–U4; each new issuer must be added to this table in the 064 notes and exercised through the 063 test matrix.

## 5. Required corrections and gates

| ID | Owner | Required before | Content |
| --- | --- | --- | --- |
| **R1** | 063 | 064 U | Refuse restricted kinds in `sellInstancesForCoins` / `resolveInstanceSellPrice`; bypass test |
| **R2** | 063 | 064 U | Orphan live claim = accept + diagnostic; duplicates still reject; round-trip test |
| **R3** | 063 | 064 U | Structural owner-coverage test; add `settlementEconomies` food |
| **U1** | 064 U | first issuer | Deterministic designated host per identity; stable `issuanceKey` format (Q-U2 ✅ (a)) |
| **U2–U4** | 064 U | first issuer | Ledger by reference; latch + claim atomicity; exact-instance purchase path |
| armor quality | 066 + 064 U | first armor issuer | Identity-owned authored quality table |
| **Q-U1** | author | 064 U | ✅ answered (a) 2026-11-07: permanent loss, no reissue |
| F7 | 063 | optional | Type dedupe, capability import test, scoped count walk |

R1–R3 are small (one session, no save version bump: R2 changes validation only and accepts strictly more saves; R3 adds a test and one walker domain). After R1–R3 green, **R-A is satisfied for the 063 protocol**; U then proceeds on its own preconditions and the author's Q-U1/Q-U2 answers. A re-review is not required for R1–R3; an Opus spot check of the **first** U issuer is recommended (same pattern as review 033).

## 6. Questions for the author (mirrored in queue §3)

**Answered 2026-11-07:** Q-U1 → **(a)** („Nie da się go odzyskać, przepada.”) — destruction is a permanent tombstone, no reissue; burial keeps the specimen as a grave good (F6 needs no change). Q-U2 → **(a)** — U1 designated host is binding. Archived in queue archive §3.

- **Q-U1 — A8 po zniszczeniu / grobie:** (a) zniszczony lub pochowany egzemplarz przepada na zawsze, tożsamość nigdy nie wraca [rek. na start]; (b) po zniszczeniu tożsamość może raz wrócić z innego, deterministycznego źródła; (c) pochówek upuszcza przedmioty unikatowe przy grobie zamiast je zakopywać, reszta jak (a).
- **Q-U2 — gdzie pojawia się unikat:** (a) każdy unikat ma jedno z góry wyznaczone źródło na świat (z seeda), to samo przy każdej grze na tym seedzie [rek.]; (b) wygrywa pierwsze źródło, które gracz odwiedzi (zależne od kolejności zwiedzania).

## 7. Resolution — 2026-11-07

R1–R3 landed in `fda82efa` (see 063 notes); the walker is recursive, which also closed an uncovered owner class not listed in F3 (animal saddlebag packs). U1–U4 landed with 064 U in `1c8c0ab4`. Opus spot check of the first issuer (§5) is still recommended and not yet done.
