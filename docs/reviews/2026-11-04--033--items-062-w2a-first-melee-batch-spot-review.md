# Review 033 — items-player-062 W2a: first Stage 4 melee batch (Opus spot review)

**Date:** 2026-11-04
**Reviewer:** Claude Opus 5.5 (independent; did not author W0/W2a)
**Scope:** commit `ac9c1044` (062 W2a: `obsidian_knife`, `halberd`, `mace`, `sword`) against [plan 062](../plans/items-player-062-stage-4-weapon-ammunition-and-shield-intake.md), its [implementation notes](../plans/implementation-notes/items-player-062-stage-4-weapon-ammunition-and-shield-intake-implementation-notes.md) (W0 contract, W2a handoff), [review 032](./2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md) and the [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md) §7 gate. Also a forward check of the W0 W2b–d rows.
**Baseline:** `main` @ `051e99ea` (contains `ac9c1044`; later commits do not touch the W2a files).
**Evidence:** static source reading; focused Vitest runs; a temporary probe test (not committed) over `generateMerchantAssortment`; `vue-tsc`. No browser, gameplay or performance check. Markers: ✅ verified · 🟡 Opus resolution · ❓ author decision.

## 1. Verdict

**NO-GO for W2b until R1 lands. After R1: GO.**

The authored profiles, type contracts, NPC families, maintenance classification, held/ground fallbacks and save behaviour are correct and match W0 exactly. But the commit **enables a world acquisition source** — all four kinds were added to `MERCHANT_STOCK`, which is the merchant assortment candidate list, not just a display order. This contradicts the plan ("not yet obtainable through world sources — that is 064"), the W0 contract ("No source is enabled") and four documents that now state the opposite. The same pattern copied into W2b–d would put upper-tier (A8) identities into merchant stock before the 063 ledger exists. The fix is small and has an in-repo precedent.

## 2. Findings

### F1 — P1 (blocker): W2a kinds are live merchant stock ✅

- `src/items/tradeCatalog.ts:121-126` adds `obsidian_knife`, `halberd`, `mace`, `sword` to the top of `MERCHANT_STOCK`.
- `generateMerchantAssortment()` (`src/settlement/merchantTrade.ts:498`) iterates `MERCHANT_STOCK`; `specializationAffinity()` (`:290`) gives any `weapon`-category kind affinity 2 for `general` and `weapons-tools` traders. `seedMerchantStockIfNeeded()` (`:637`) then materialises them (instances for the three maintenance kinds via `createAcquiredInstance`), and `buildMerchantTradeStock()` (`src/app/inventoryWiring.ts:363`) lists them as BUY rows.
- Probe (4 traders × 4 terrains × 4 sizes × 50 seeds derived from `415424794`): **644 / 800** assortments contain at least one W2a kind (e.g. `plains/OUTPOST/…/weapons-tools: mace×3`, `obsidian_knife×3`, `halberd×3`).
- Side effects: per-trader SKU budget is finite (`picked.length >= budget`), so new candidates displace existing goods — the deterministic merchant assortment of the reference seed changes. Merchant stock is seeded lazily on first materialisation (`merchantStockInitialized`), so **existing saves** also get the changed assortment for traders not yet materialised. (Not a worldgen cache / `WORLDGEN_EPOCH` matter — the assortment is not cached and no saved reference moves.)
- The full items/settlement/persistence suites pass (159 files, 2292 tests): no test guards "no source" for 062 kinds. `stage4MeleeBatch.test.ts` checks only `spawn: 'none'`.
- Documentation now states the false claim in four places: notes §W2a ("No … merchant/household source"), `docs/items/CATALOG.md` side-initiative section ("No world source is enabled yet"), `docs/state/combat.md` ("no world acquisition source"), index §8.

**Precedent for the fix:** `masterwork_hunting_bow` has a `MERCHANT_PRICES` entry (so `tradeValue`/sell work) but is deliberately absent from `MERCHANT_STOCK`, asserted at `src/settlement/merchantTrade.test.ts:364`. `trade.test.ts:59` only requires stocked kinds to be priced, not priced kinds to be stocked.

### F2 — P2: price column is off the V1 family scale ❓ (non-blocking author question)

Profiles fit the combat-proposal §6.1 envelope (see §3), but `MERCHANT_PRICES` (also the `tradeValue` used for sell prices) does not follow the same-family V1 anchors:

| W2a kind | dmg | price | nearest V1 anchors (dmg / price) |
| --- | --- | --- | --- |
| obsidian_knife | 15 | 55 | knife 12 / 12 · dagger 14 / 24 · damascus_knife 16 / 90 (premium) |
| halberd | 25 | 95 | spear 20 / 32 · pitchfork 14 / 12 |
| mace | 21 | 50 | axe 20 / 25 · hatchet 18 / 34 |
| sword | 22 | 65 | short_sword 18 / 40 · **long_sword 28 / 50** |

A Common `sword` is priced above the stronger Common `long_sword`; Common W2a prices are ~1.3–3× their family anchors, close to the premium tier. W0 W2b repeats the scale (`obsidian_dagger` 65 vs `dagger` 24, `war_hammer` 80). No source exists, so the only live effect today is sell value of fixture-granted items — but 064 will price merchant stock from this column. This is balancing, so it goes to the author:

- **(a)** re-anchor Common prices to the family (≈ obsidian_knife 30, halberd 45, mace 30, sword 45) and re-derive W2b's column the same way **[recommended]**;
- **(b)** keep W0 prices (deliberate rarity premium for donor goods) and record the rationale in the notes.

W2b does not have to wait: without an answer it lands with the W0 prices (no source, revertable) and one later commit retunes both batches.

### F3 — P3: two profile inconsistencies inside the sword family 🟡

- `sword` defense `.20 / .40` is below `short_sword` `.22 / .45` (and well below `long_sword` `.28 / .55`), and its mass 1.5 kg is lighter than `short_sword` 1.6 kg — a mid-length sword that blocks worse and weighs less than the short one. Suggest `.24 / .48`, 1.9 kg (between short and long), or a one-line rationale in the notes.
- `obsidian_knife` defense `.08 / .20` is below plain `knife` `.12 / .35`. Defensible (brittle glass edge — poor parrying), but the reason should be written in the W0 table, since this batch sets the envelope.

### F4 — P3: `obsidian_knife` utility capabilities 🟡 resolved: keep weapon-only

The notes ask whether it should share `meat_harvesting` / `branch_trimming`. **Keep weapon-only.** `CAPABILITY_KINDS` (`src/items/itemCatalog.ts:2050`) sorts by melee damage, so with 15 damage it would outrank `knife` (12) and `dagger` (14) in `Inventory.findWithCapability()` auto-pick and silently change existing harvesting behaviour for anyone owning both; it also stays consistent with "no donor capability activation" and its `weapon`-only category. Revisit only with a gameplay reason.

### F5 — P3: stale / misleading docs ✅

- `docs/items/CATALOG.md` "Holdable" row still says 25 kinds and omits the four new holdables (now 29).
- CATALOG's "sellable through normal registered-goods paths" is true for selling, but read together with F1 it masks that they are also buyable. Correct together with R1.

### Observation (no action now): blunt weapons all map to NPC family `tool`

`mace` → `tool` follows the notes' rule and is test-covered (`resolveNpcMeleeWeapon(…, 'guard')` returns the sole owned mace). After W2b, four dedicated blunt weapons (`mace`, `club`, `war_hammer`, `staff`) will share the family of shovels and sickles in profession preference tables. Acceptable for intake (no NPC kit grants here); 064 should decide whether a `blunt` family is needed before it issues them to NPCs.

## 3. Verified correct ✅

- **W0 parity:** all four catalog rows match the W0 table exactly — melee tuple, `damageType` (pierce / cut / blunt / cut), defense, mass (`ITEM_DEFS.weight`), price, NPC family, maintenance, `spawn: 'none'`, `modelUrl: null`.
- **Envelope (§6.1 anchors):** obsidian_knife 15 between knife 12 and damascus 16; sword 22 / 2.35 between short_sword 18 / 2.1 and long_sword 28 / 2.6; halberd 25 / 3.2 above spear 20 / 3.0 with slower wind-up / recovery and higher stamina; mace 21 / 1.9 ≈ axe 20 / 2.0. Common tier stays below existing Masterwork (`masterwork_sword` 34).
- **Type contracts:** `ItemKind`, `ToolKind`, `MeleeToolKind`, `WeaponMaintenanceKind` + `WEAPON_MAINTENANCE_KIND_LIST` (18) extended in step; `HELD_ATTACH` total; NPC melee family map total (completeness test green).
- **Instances:** blades/polearm instance-backed with condition; `mace` count-backed holdable (same path as `shovel`). Equip / snapshot / transfer round-trip tested.
- **Save:** additive registered kinds; validators accept them (`saveData.test.ts` round-trip incl. held instance); no `CURRENT_SAVE_VERSION` bump needed ✅ (agree).
- **Donor policy tests:** the two `compatibility.test.ts` edits are legitimate — the "missing target" fixture needed a still-unregistered id, and `obsidian_knife` stays a `new-candidate` projection (no runtime donor conversion).
- **Fallbacks:** procedural ground + held meshes keep the actual kind (knife/sword/spear shapes reused, halberd gets an extra blade box, mace a new handle+head). Geometry tested; **not** visually verified.
- **Checks re-run here:** `pnpm vitest run src/settlement src/items src/ai/npcCombat.test.ts src/persistence` → 159 files / 2292 tests pass; `pnpm run type-check` passes.

## 4. Required corrections

| ID | Before | Change | Owner |
| --- | --- | --- | --- |
| **R1** | W2b (blocker) | Remove the four W2a kinds from `MERCHANT_STOCK`; keep their `MERCHANT_PRICES` (masterwork_hunting_bow precedent). Add a 062-wide no-source guard test: every 062-registered kind is absent from `MERCHANT_STOCK`, `PREMIUM_MERCHANT_KINDS`, `HOME_STARTER_MERCHANT_KINDS` and from `generateMerchantAssortment` output over a seed/terrain/size sweep. Later batches extend the kind list; 064 removes kinds from it as it enables sources. Correct the four documents listed in F1. Saves made since `ac9c1044` may already hold these kinds in merchant stock or player inventory — they stay loadable; never coerce (plan rollback rule). | 062 executor |
| R2 | W2b commit | Resolve F3 (adjust `sword` defense/mass or record rationale; record obsidian_knife defense rationale) and record F4 (weapon-only) in the W0 table. | 062 executor |
| R3 | W2b commit | Fix CATALOG.md holdable count/list (F5). | 062 executor |
| Q | non-blocking | F2 price scale → author (queue §3). | author |

## 5. Forward check of W0 W2b–d (contract rows, not code)

- W2b–d inherit R1 automatically once the guard test exists; **W2d (upper-tier, A8) must never be in `MERCHANT_STOCK`** — the guard is the mechanism until 063/064 own issuance.
- W2c sanity: `millbrook_shortsword` 28 dmg equals `long_sword` and beats `damascus_short_sword` 24 — fine for Masterwork, but confirm intent while doing R2. A8 overall-tier order (Masterwork < Exceptional < Legendary) holds across W2c→W2d.
- Manual check from the plan (fixture-grant one new weapon on `?seed=415424794`, attack fauna, held visual/fallback) remains pending in queue §2.

## 6. GO / NO-GO

**NO-GO for W2b now.** **GO** as soon as R1 is on `main` with the guard test green. R2/R3 ride with the W2b commit; F2 does not block.
