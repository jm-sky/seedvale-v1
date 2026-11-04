# Implementation notes: Layered armor catalogue, acquisition and balance

**Plan:** `items-player-066-layered-armor-catalogue-acquisition-and-balance.md` · verified at `fe49547f` (2026-11-04, static).

## Anchors

| Concern | Anchor |
| --- | --- |
| Armor kinds | `src/items/itemInstances.ts:19` `ArmorKind`, `ARMOR_KIND_LIST` (feeds `INSTANCE_BACKED_KINDS`) |
| Defs / catalog rows | `src/items/items.ts` (`ItemKind`, `ITEM_DEFS`), `src/items/itemCatalog.ts` armor rows (pauldrons at ~l.1068–1114 after 044 rename) |
| Prices | `src/items/tradeCatalog.ts` (kind base price; quality value .55/1/1.30/1.85 already applied by trade) |
| Merchant sets | `src/settlement/merchantTrade.ts` — `PREMIUM_MERCHANT_KINDS` (~l.69), `HOME_STARTER_MERCHANT_KINDS` (~l.94), `BASIC_WEAPON_TOOL_ARMOR_KINDS` (~l.108), `METAL_KINDS` (~l.120), `HUNTING_KINDS` (~l.143), import flavour (l.278 `chainmail` → `import`); quality via `resolveMerchantArmorQuality()` (l.613) / `settlementArmorQuality.ts` |
| Household stock | `src/settlement/householdProfessionStock.ts` — `resolveHunterGrants()` (grants poor `leather_pauldron` at l.148, `leather_armor` l.157), `artisanArmorQualityFor()` l.169, `householdBlacksmithProfile()` l.187, `wantsCategory(…, 'armor')` l.209. A **textile-worker** household path must be located (search the household profession enum) — if none exists, padding goes to general Trader only and the gap is recorded (no new profession) |
| Recipes | `src/economy/production.ts` — `blacksmithRecipe(id, output, iron, coal, artisan)` l.222 (no `itemInputs`); pauldron recipe l.258, chainmail l.265 (4/2, d70/min62, exclusive); orderable list ~l.242; `ProductionDef.itemInputs` exists (l.25) |
| NPC trade policy | `src/ai/npcTradeAvailability.ts` (household positive allowlist — add new kinds explicitly; personal armor stays non-saleable) |

## Pitfalls

- The six existing kinds currently carry `damageReduction`; slice A replaces it with `resist` in the **same branch** as 065 S3 (no commit on `main` may carry both models).
- Mail restriction values **decrease** (proposal §5.1 note) — tests asserting old 1.28/1.22/.90/1.40 must be updated, not kept.
- Masses: `effectiveInstanceWeight` already applies quality mass scale once; equipped items remain in inventory weight.
- Stock latch: new assortment applies to newly initialized stock; existing saves keep theirs (acceptable; new game is the norm post-Revival).
- Item details text must say local coverage ("35 % cut resistance — torso only"); text lives in 048's presentation helpers, not in catalog notes.
- Upper-tier armor: registering a kind makes generic factories able to mint it — 063's factory guard must already cover it (063 lists the IDs up front).

## Order

A (branch, after 065 S3) → release → B brigandine → B donor batches (one commit per family batch) → C after author playtest.
