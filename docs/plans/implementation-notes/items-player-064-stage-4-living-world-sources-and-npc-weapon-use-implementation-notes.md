# Implementation notes: Stage 4 living-world sources and NPC weapon use

**Plan:** `items-player-064-stage-4-living-world-sources-and-npc-weapon-use.md` · verified at `fe49547f` (2026-11-04, static).

## Source owners

| Owner | Verified anchors | Use |
| --- | --- | --- |
| Trader stock | `src/settlement/merchantTrade.ts` — `MerchantSpecialization` = `general` / `weapons-tools` / `food-materials` / `imports-luxury` / `horses` (l.35); `specializationOrder(terrain)` (l.205); `seedMerchantStockIfNeeded()` (l.637) with persisted init latch; `resolveMerchantArmorQuality()` | add kinds to the existing regional/material/premium sets of the matching specialization; never to every specialization; respect assortment capacity |
| Household starter stock | `src/settlement/householdProfessionStock.ts` — `resolveHunterGrants()` (l.136), `householdBlacksmithProfile()` (l.187), `wantsCategory()` (l.209), `huntingBias()`/`metalBias()` (l.70/74), seeded `specialistRng()` (l.79), `pushGrant()` | one-time first-construction grants into `Household.items`; hunter → `sling_stone` here; blacksmith → bolts/ordinary blades by artisan category |
| Artisan orders | `src/settlement/artisanOrders.ts`, `src/economy/production.ts`, `src/settlement/artisanCraft.ts` | only if a real recipe with inputs is added and reviewed; otherwise stock only |
| NPC personal loadout | `src/ai/npcLoadout.ts` — `defaultWeaponForRole()`, `seedGuardCrossbowLoadout()` (l.146), `seedShepherdSlingLoadout()` (l.169), `seedInitialPersonalBelongingsIfNeeded()` (l.184), `isNpcLoadoutBelonging()` | N1 does **not** add new kit grants; at most a reviewed, salted choice that can yield a new ordinary kind at genuine first creation — keep existing salts/probabilities unchanged |
| NPC weapon choice | `src/ai/npcCombat.ts` family maps + `pickBestCandidate` scoring | new families/preferences go here |
| NPC trade allowlist | `src/ai/npcTradeAvailability.ts` | household positive allowlist; personal weapons are not saleable — keep |

## Pitfalls

- `seedMerchantStockIfNeeded` is latched: changing assortments affects **new** stock initialization only; existing saves keep their stock. Tests must cover "sold-out stays sold-out after reload".
- Quality is for armor; weapons have sharpness/condition via maintenance instances — do not invent weapon quality.
- Merchant quality rolls are not artisan provenance (Q13 F3) — do not describe Trader stock as crafted.
- Upper-tier slice U: acquire the 063 claim **before** inserting into stock; a merchant latch must never reseed a claimed kind; a sale back to a merchant must move the exact instance into durable stock or be refused.
- NPC ammo: NPCs spend from their own inventory owner; new ammo must be compatible with the NPC's ranged family (sling ↔ `sling_stone`; crossbow ↔ bolts).

## Order

O1/O2 as soon as their 062 profiles land (can interleave per kind) → O3 → O4 → N1 (after npc-067 because both touch `npcCombat.ts`) → U last.

## Slice record — O1/O2 (2026-11-07, Sonnet; technically verified, not browser-verified)

Format: `kind | source owner | eligibility | quantity | price | restock/init | NPC fit`.

| Kind(s) | Source owner | Eligibility | Quantity | Price | Init | NPC fit |
| --- | --- | --- | --- | --- | --- | --- |
| `obsidian_knife`, `obsidian_dagger`, `sword`, `halberd`, `mace`, `war_hammer`, `club`, `staff` | Trader (`merchantTrade.ts`, `STAGE4_ORDINARY_WEAPON_KINDS`) | `weapons-tools` only (affinity 0 elsewhere); `sword`/`halberd`/`mace`/`war_hammer` added to `METAL_KINDS` (mountain/iron = local, forest/ocean = import) | ≤ 2 per Trader (import = 1) | `MERCHANT_PRICES` = 062 base | existing persisted latch, no reseed | N1 pending |
| `sling_stone` | Trader (`weapons-tools` pref 2, `general` 1); Hunter household | any size | Trader 5/8/12/16 by size; Hunter 4 + 2·rank | 2 | latch / first construction | sling only (N1) |
| `bolt_heavy`, `bolt_blunt` | Trader (`weapons-tools` only); Blacksmith household | `bolt_heavy` rank ≥ 2, `bolt_blunt` rank ≥ 3 | Trader 2/3/5/6; household 2 + rank | 4 / 3 | latch / first construction | crossbow only (N1) |
| `sword` (rank ≥ 1, swords), `mace` (rank ≥ 2), `war_hammer` (rank ≥ 3) | Blacksmith household (`householdProfessionStock.ts`) | no extra rng draws, existing masterwork roll stream unchanged | 1 each | — | first construction | N1 pending |

- Household trade allowlist (`npcTradeAvailability.ts`): `sword`, `mace`, `war_hammer`, `sling_stone`, `bolt_heavy`, `bolt_blunt` with `noHouseholdReserve`.
- Adding kinds to `MERCHANT_STOCK` changes the weapons-tools shuffle stream, so **new** worlds' Trader stock differs from before; latched/existing stock is untouched. No worldgen epoch or save-version change.
- Tests: `merchantStage4Sources.test.ts`, `householdProfessionStock.test.ts` (064 block), `stage4NoSource.test.ts` shrunk to the still-unsourced kinds.
- Not done: O3 (masterwork), O4 (shields), N1, U; manual browse/buy/save-reload on seed `415424794` pending (queue §2).

## Slice record — O3 (2026-11-07, Sonnet; technically verified, not browser-verified)

| Kind(s) | Source owner | Eligibility | Quantity | Price | Init | NPC fit |
| --- | --- | --- | --- | --- | --- | --- |
| `ashgrove_dagger`, `millbrook_shortsword`, `fenmoor_sword`, `stonebridge_longsword`, `marlow_longbow` | Trader premium roll (`PREMIUM_MERCHANT_KINDS`) — the existing single settlement-level premium offer, owner by best specialization affinity | settlement premium chance by size; regional weight via `METAL_KINDS` (blades) / `HUNTING_KINDS` (bow) | exactly 1 per premium offer; different settlements can each hold a different specimen | 160 / 220 / 300 / 320 / 280 | existing latch | N1 pending |

- No regular-assortment path (premium kinds are skipped there); no household/artisan source; no rarity inferred from ID prefix.
- Adding 5 premium candidates dilutes the existing premium weighting and changes premium picks for **new** worlds only.
- Test: `merchantStage4Sources.test.ts` O3 block (≤1 per settlement, all five reachable, scarce, instances seed once).
- `yewmaster_longbow` and the U-tier blades remain slice U.

## Slice record — O4 (2026-11-07, Sonnet; technically verified, not browser-verified)

| Kind(s) | Source owner | Eligibility | Quantity | Price | Init | NPC fit |
| --- | --- | --- | --- | --- | --- | --- |
| `wooden_shield`, `iron_rimmed_shield`, `buckler` | Trader (`STAGE4_SHIELD_KINDS`) | `weapons-tools` (pref 2); `general` acceptable for `wooden_shield` only; metal shields in `METAL_KINDS` | ≤ 2 per Trader (import = 1) | 25 / 55 / 35 (`MERCHANT_PRICES`) | existing latch, count-backed | none — inventory-only (A7), no NPC use |

- `iron_rimmed_shield` keyed quest-reward source: **not added**. No existing quest owner was investigated/hosted for it in this slice, so it stays without a keyed source; it is still buyable from `weapons-tools` Traders. Revisit only if the author wants a quest hook.
- Shields have category `other`, so `merchantTrade.test.ts` weapons-tools coverage helper now counts `STAGE4_SHIELD_KINDS` as weapon-shop goods.
- Tests: O4 block in `merchantStage4Sources.test.ts`.

## Slice U preconditions — Opus R-A (2026-11-07)

[Review 042](../../reviews/2026-11-07--042--items-063-upper-tier-ledger-r-a-review.md) — **U is NO-GO** until 063 R1–R3 land (author answers 2026-11-07: **Q-U1 (a)** — a destroyed specimen is lost forever, the identity never returns; **Q-U2 (a)** — one designated host per identity from the seed). U then must provide:

- **U1** — one deterministic designated host per identity per world (seed + stable eligible source keys), computed before materialization; only that source calls `claimUpperTierInstance`, with a stable `issuanceKey` (`merchant:<settlementId>:<npcId>:<kind>`, `quest:<questId>:<kind>`). The ledger is the safety net, not the selector.
- **U2** — thread the app-owned ledger by reference through the existing composition seam (like `consumedWorldPickupIds`); no second registry.
- **U3** — stock-init latch and claim commit together; a refused claim still sets the latch; test claim → reload → reconstruction → no second attempt.
- **U4** — buy restricted stock only through the exact-instance purchase path (`resolveMerchantPurchaseInstances`); never route specimens through transient `carried`.
- Armor identities: authored per-identity quality table next to `UPPER_TIER_IDENTITY_LIST` once 066 registers them (claim currently hard-codes `common`).
- Record every enabled issuer in a `kind | source | issuanceKey | host rule` table here; Opus spot check of the first issuer.

## Slice record — U (2026-11-07, Sonnet; technically verified, not browser-verified)

Preconditions: 063 R1–R3 landed (`fda82efa`); author Q-U1 (a) permanent loss, Q-U2 (a) one deterministic host per identity.

**Design.**

- **U1 host designation** — `src/settlement/upperTierHosts.ts` (`createUpperTierHostResolver`). Pure function of the world seed and the layout roster (`settlementLayoutFor` cells + cached `settlementDefFor` defs); needs no materialization, player or loaded settlement. Eligible sources are traders of every non-home roster settlement (merchant profiles derived exactly like `createSettlement`), in preference tiers: `weapons-tools`/`imports-luxury` → `general` → `food-materials` (never the `horses` vendor). Worlds have only 0–2 specialist traders, so without the fallback tiers all 14 pile onto one merchant (probed: seed 42 had one eligible specialist). Identities are assigned in `UPPER_TIER_IDENTITY_LIST` order to the lowest seeded hash of (seed, identity, npcId) within the best tier that still has a trader under the cap of 4 identities per host. `issuanceKey = merchant:<settlementId>:<npcId>:<kind>`. Memoized per resolver; first use resolves all roster defs (24–25 on the benchmark config; ~2.7 s cold headless, but these defs are shared with the road network/def cache and are not materialization).
- **U2 ledger by reference** — the `createApp` ledger object → `createWorldBundle`/`rebuildWorldBundle` (trailing param) → `WorldSystemsSeed` → `buildSettlementsManager` → `createSettlementsManager` → `CreateSettlementDeps.upperTierIssuance`. No copy, no second registry; New Game clears it in place as before.
- **U3 issuance** — `issueHostedUpperTierStock` is called from `materializeSettlementResident` right after `seedMerchantStock` for trader NPCs. It is keyed on **ledger absence**, not on the stock-init latch: a kind already in the ledger (live or destroyed) is never attempted again, so reload, reconstruction, unload and sold-out stock cannot reissue, and a world whose merchant latched before this slice still receives its specimen at the next materialization. No new persisted field, no save version bump. The claim goes through `claimUpperTierInstance` into the host's own `merchantStock` (no capacity cap; the specimen sits on top of the ordinary assortment). Unregistered kinds (the 8 armor identities until items-player-066) return `null` from the claim without touching the ledger; their hosts are still designated. A dead host skips issuance (identity stays unissued).
- **U4 purchase** — `buildMerchantTradeStock` now lists one row per physical upper-tier instance (with `instanceId`, catalog price, trader markup); `MerchantScreen` already sends `instanceIds` for such rows. Count purchases and barter offers of these kinds remain refused (`trade.ts`), R1 refuses selling them back. `yewmaster_longbow` gained a `MERCHANT_PRICES` entry (1300, moved from `RESOURCE_TRADE_VALUE`); the other five already had one. Audit: `merchantStock` is touched only by seeding, the player merchant UI path and persistence; no NPC trade, household exchange, transport or pack-animal path reads it, and nothing routes a specimen through `NpcAgent.carried`.

**Enabled issuers** (063 R-A table §4 update): one issuer — Trader `merchantStock`, designated host only.

| kind | source | issuanceKey | host rule |
| --- | --- | --- | --- |
| `kestrel_dagger`, `pinewatch_longsword`, `harrow_shortsword`, `ironvale_sword`, `greywatch_longsword`, `yewmaster_longbow` | Trader `merchantStock` (live) | `merchant:<settlementId>:<npcId>:<kind>` | U1 resolver above |
| `kingsbane_hauberk`, `marshal_cuirass`, `saltmere_wardens_coat`, `northpass_riders_helm`, `thornwatch_pauldrons`, `blackpine_vambraces`, `fallowmere_gauntlets`, `ridgeguard_greaves` | Trader `merchantStock` (**dormant**) | same | designated now; issue automatically once 066 registers the kind |

Not built: authored quest-reward/discovery issuers (the matrix says "reward OR specialist sale"); armor authored-quality table (needs 066's armor registration, `ArmorQuality` has no legendary tier); a `NpcAgent.carried` refusal (no path exists).

**Tests.** `upperTierHosts.test.ts` (designation: one host per identity, ≤4 per host, deterministic across runs and defs-resolution order, differs per seed, armor designated; issuance on seeds 7/42/415424794: exactly one live specimen per registered identity in its host's stock, none for unregistered, no reissue after reconstruction, order-independent keys, dead host, sold-out/destroyed no-reissue, NPC-state save/reload round trip keeps one owner), `upperTierPurchase.test.ts` (each of the 6 buys moves the same instance id, ledger id matches, count/barter refused). No worldgen output, cache fingerprint or `WORLDGEN_EPOCH` change; existing merchant assortment RNG streams are untouched (issuance runs after seeding and draws no rng).

**Host table, reference seed `415424794`** (headless `settlementLayoutFor` + `settlementDefFor`, benchmark world config; not browser-observed): `kestrel_dagger`, `pinewatch_longsword`, `greywatch_longsword`, `yewmaster_longbow` → `-1_12:npc:3` (Pustkowie, LG); `harrow_shortsword`, `ironvale_sword` → `6_-10:npc:9` (Bukowy Jar, LG); armor (dormant) `saltmere_wardens_coat`, `northpass_riders_helm`, `thornwatch_pauldrons`, `blackpine_vambraces` → `-1_12:npc:10`; `kingsbane_hauberk`, `marshal_cuirass` → `6_-10:npc:9`; `fallowmere_gauntlets`, `ridgeguard_greaves` → `9_3:npc:0` (Wiśniowa Poręba, XL).
