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
