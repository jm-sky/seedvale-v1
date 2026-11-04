# Implementation notes: Stage 4 donor intake — weapons, ammunition and shields

**Plan:** `items-player-062-stage-4-weapon-ammunition-and-shield-intake.md` · verified at `fe49547f` (2026-11-04, static).

## Owners and seams (verified)

| Concern | Where | Notes |
| --- | --- | --- |
| Kind identity | `src/items/items.ts` (`ItemKind`, `ITEM_DEFS`) | new rows next to their family |
| Gameplay profile | `src/items/itemCatalog.ts` — `MeleeConfig` (l.25: damage/range/arcDot/windUp/hitWindow/recovery/staminaCost), `DefenseConfig` (l.42), `RangedConfig` (l.76, `ammoKinds` l.98), `ThrowableConfig` (l.118) | `damageType?` arrives from 065 S1; author it on every new config |
| Ammo bonus | `ARROW_DAMAGE_BONUS` (`itemCatalog.ts:1905`), read at player release `src/app/gameLoop.ts:1544` | the table name is arrow-specific but is the only ammo-bonus owner — extend it (and optionally rename to an ammo-neutral name in the same commit with all callers) rather than adding a second table |
| Sling / crossbow ammo lists | sling `ammoKinds: ['stone']` (`itemCatalog.ts:1434`), crossbow `ammoKinds: ['bolt']` (l.1413) | ordered admission; first held kind wins at release |
| Throw path | `rangedConfigFromThrowable()` (`itemCatalog.ts:1921`), `throwable` on `stone` | `sling_stone` must **not** get `throwable` |
| Instance families | `src/items/itemInstances.ts` — `WEAPON_MAINTENANCE_KIND_LIST` (l.104), `ARMOR_KIND_LIST`; `createAcquiredInstance()` dispatch (`src/items/trade.ts:199`) | new maintenance weapons must be added to the list, otherwise acquisition yields count-backed items with no sharpness |
| NPC selection | `src/ai/npcCombat.ts` — candidate kinds are **derived from the catalog** (`MELEE_CAPABLE_KINDS`, `RANGED_CAPABLE_KINDS`, l.31–40); family maps `NPC_MELEE_WEAPON_FAMILY` / `NPC_RANGED_WEAPON_FAMILY` are explicit and **total** (test-enforced) | Stage 4 proposal's "explicit candidate lists" is inaccurate: registration alone makes an owned kind selectable. Classify each new melee kind (`compact`/`sword`/`axe`/`spear`/`tool`); halberd → `spear` (polearm reach), mace → `tool` unless a reviewed reason exists to add a family — adding a family value touches profession preference tables |
| Defense | `DEFENSE_CAPABLE_KINDS` = catalog `defense?.canBlock` | shields get **no** `defense` entry (A7) |
| Donor policy | `src/items/v3Equipment/compatibility.ts` (`POLICY`), `validation.ts` (hard-coded conflict guard, canonical-collision check, `compatibleFamily` l.24), `compatibility.test.ts`, `contracts.test.ts` | W1 edits these together; see Stage 4 proposal §"Stage 3 compatibility policy evolution" table — it lists the exact per-ID changes and test points. `validation.ts:39` slot projection is changed by 044, not here |
| Models | `modelUrl` per catalog row; procedural fallback exists (e.g. sling `modelUrl: null`) | no new meshes required; fallback must keep the actual kind |

## Pitfalls

- **Ammo identity through fallback:** projectiles carry `ammoKind` and `attackKey: ranged:<kind>`; miss/expiry drops the kind for the player, NPC expiry drops nothing (existing asymmetry — record, do not "fix").
- **NPC ammo damage:** NPC projectiles use base config damage without the bonus table (Stage 4 proposal owner table). For `bolt_heavy`/`bolt_blunt`/`sling_stone`, decide in W0 whether bonuses apply to NPCs; if yes, apply only to the new kinds and test both actors.
- **Stone dual role:** `stone` is a resource, throwable and sling ammo. `sling_stone` is only sling ammo. `compatibleFamily` currently assumes stone-ammo = resource + throwable; W1 removes only the approved candidate relationship.
- **Policy counts:** current validation requires a non-empty decision array; keep truthful technical questions rather than emptying it.
- **Tiers:** never infer rarity from an ID prefix or donor flag; take tier from the matrix row.
- **Save:** adding item kinds is additive (count/instance validators accept any registered `ItemKind`); no `CURRENT_SAVE_VERSION` bump expected. If a validator turns out to enumerate kinds, extend it — still no migration.

## W0 deliverable format

Append a table per batch to this file: `id | family | damageType | melee/ranged numbers | maintenance? | mass | base price | NPC family | model/fallback | tier`. The first melee batch gets an Opus spot review (index §7) before W2b.

## Order

065 S1 must be on `main` first. Then W1 → W2a… (serialize with 044-M on catalog files) → W3a–c (finish before 065 S3 starts, both touch `gameLoop.ts`) → W4 → W5.

## W0 slice contract — 2026-11-04

Authored V1 profiles below are initial bounded tuning within existing family mechanics, not converted donor stats. No source is enabled. All melee rows are holdable weapons, spawn none, and use an explicitly registered procedural fallback retaining the actual kind. Blades/axes/polearms use existing sharpness/condition; blunt weapons use the count-backed tool path. Defense numbers use the closest existing family envelope. First W2a batch requires Opus spot review before W2b (index §7 and W0 deliverable rule).

Melee tuple = damage / range / arcDot / windUp / hitWindow / recovery / staminaCost. Defense tuple = full-block chance / partial reduction (canBlock true). Mass kg; price base coins. These are authored V1 fields, not donor data.

| Batch | ID | Family / NPC family | Type | Melee tuple | Defense | Maintenance | Mass | Price | Tier |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W2a | obsidian_knife | knife / compact | pierce | 15 / 1.6 / .6 / .13 / .08 / .19 / 5 | .08 / .20 | yes | .35 | 30 | Common |
| W2a | halberd | polearm / spear | cut | 25 / 3.2 / .5 / .34 / .12 / .44 / 13 | .18 / .40 | yes | 3.5 | 45 | Common |
| W2a | mace | blunt / tool | blunt | 21 / 1.9 / .45 / .30 / .10 / .36 / 10 | .12 / .30 | no | 1.8 | 30 | Common |
| W2a | sword | sword / sword | cut | 22 / 2.35 / .42 / .23 / .10 / .32 / 9 | .24 / .48 | yes | 1.9 | 45 | Common |
| W2b | obsidian_dagger | dagger / compact | pierce | 17 / 1.7 / .58 / .12 / .08 / .18 / 5 | .08 / .20 | yes | .45 | 36 | Common |
| W2b | club | blunt / tool | blunt | 13 / 1.9 / .5 / .25 / .10 / .30 / 7 | .08 / .25 | no | 1.2 | 12 | Common |
| W2b | war_hammer | blunt / tool | blunt | 26 / 2.1 / .38 / .38 / .12 / .46 / 13 | .14 / .35 | no | 3 | 45 | Common |
| W2b | staff | blunt / tool | blunt | 11 / 2.8 / .5 / .24 / .10 / .28 / 6 | .20 / .35 | no | 1 | 15 | Common |
| W2c | ashgrove_dagger | dagger / compact | pierce | 21 / 1.75 / .6 / .11 / .08 / .17 / 5 | .12 / .25 | yes | .4 | 160 | Masterwork |
| W2c | millbrook_shortsword | sword / sword | cut | 28 / 2.2 / .5 / .17 / .10 / .24 / 8 | .25 / .45 | yes | 1.2 | 220 | Masterwork |
| W2c | fenmoor_sword | sword / sword | cut | 33 / 2.45 / .42 / .22 / .11 / .30 / 10 | .25 / .45 | yes | 1.5 | 300 | Masterwork |
| W2c | stonebridge_longsword | sword / sword | cut | 38 / 2.7 / .35 / .28 / .12 / .36 / 12 | .25 / .45 | yes | 1.8 | 320 | Masterwork |
| W2d | pinewatch_longsword | sword / sword | cut | 42 / 2.8 / .38 / .27 / .12 / .34 / 12 | .28 / .48 | yes | 1.7 | 600 | Exceptional, U |
| W2d | kestrel_dagger | dagger / compact | pierce | 29 / 1.8 / .62 / .10 / .08 / .15 / 5 | .20 / .35 | yes | .35 | 900 | Legendary, U |
| W2d | harrow_shortsword | sword / sword | cut | 43 / 2.3 / .52 / .16 / .10 / .22 / 8 | .32 / .52 | yes | 1.15 | 1100 | Legendary, U |
| W2d | ironvale_sword | sword / sword | cut | 49 / 2.55 / .45 / .21 / .11 / .28 / 10 | .32 / .52 | yes | 1.4 | 1300 | Legendary, U |
| W2d | greywatch_longsword | sword / sword | cut | 55 / 2.85 / .38 / .26 / .12 / .32 / 12 | .32 / .52 | yes | 1.7 | 1500 | Legendary, U |

W2c–d remain proposed contract rows; no runtime admission until their own verified commits. Upper-tier rows have no source and require 063 factory guards before release.

Ranged tuple = damage / range / projectileSpeed / drawTime / recovery / stamina / accuracy / criticalChance. Both bows are maintenance-free instance-backed ranged weapons, arrows in existing order (arrow, broadhead, war); pierce base with actual ammo type override. Procedural fallback must retain identity.

| Batch | ID | Family | Type | Ranged tuple / bonus | Mass | Price | Tier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W3a | marlow_longbow | bow | pierce | 30 / 21 / 35 / .64 / .38 / 11 / .82 / .08 | 1.5 | 280 | Masterwork |
| W3a | yewmaster_longbow | bow | pierce | 43 / 25 / 39 / .58 / .34 / 10 / .92 / .14 | 1.3 | 1300 | Legendary, U |
| W3b | sling_stone | sling-only ammo | blunt | +2 | .08 | 2 | Common |
| W3c | bolt_heavy | crossbow-only ammo | pierce | +6 | .12 | 4 | Common |
| W3c | bolt_blunt | crossbow-only ammo | blunt | +0 | .10 | 3 | Common |

Ammo bonuses apply equally to player and NPC for these three new kinds only; preserve native NPC arrows/base damage. W3 snapshot carries actual chosen ammo identity and type, and fallback/drop uses that identity. New ammo is count-backed; sling_stone has neither resource nor throwable capability.

| Batch | ID | Family / mechanics | Mass | Price | Model |
| --- | --- | --- | --- | --- | --- |
| W4 | wooden_shield | count-backed inventory-only, no hold/equip/defense | 2.5 | 25 | procedural ground fallback |
| W4 | iron_rimmed_shield | count-backed inventory-only, no hold/equip/defense | 4 | 55 | procedural ground fallback |
| W4 | buckler | count-backed inventory-only, no hold/equip/defense | 1.5 | 35 | procedural ground fallback |

W5 keeps falchion, composite_bow, arrow_blunt unregistered and all 12 donor future flags unchanged. No armor profile is admitted in 062. W1 changes only the exact ten approved policy cases and the existing-slot family projection already landed by 044-M; shield policy remains deferred for gameplay.

## W1 implementation — 2026-11-04

Exact ten-ID policy evolution per the proposal, with independent historical-table-plus-approved-delta fixture and exact totals. Arrow-only canonical alias exception allows the approved A1 relationship; historical aliases otherwise remain strict and unforgeable. Distinct candidates cannot restore former aliases or gain projection. Verification revision refreshed to main's 044-M commit (`dd1ff563`); all 87 immutable source rows and 12 future flags unchanged. No new runtime item or source in this slice. Donor policy tests, Vue type-check, scoped lint and production build checked.

## W2a implementation and review handoff — 2026-11-04

Implemented exactly the four W0 W2a rows: obsidian_knife, halberd, mace, sword. Catalog, ItemKind, held/melee type contracts, NPC families, trade value, maintenance classification and procedural ground/held fallback are complete. Blade/polearm instances retain condition; mace is count-backed. The initial W2a commit accidentally enabled merchant stock; review 033 R1 removes that source. No worldgen/household source, NPC kit or reward was enabled. No save-version bump (additive registered kinds). No donor runtime conversion/import.

Verification: 347 tests across 11 files (batch ownership/transfer/geometry, catalog/capabilities/held/maintenance, NPC combat, save payloads, S1 math and donor policy), Vue type-check, scoped ESLint and production build. No gameplay/browser check; fixture-grant ordinary weapon/attack-fauna check remains pending.

**Required Opus spot review before W2b:** inspect the four W0 rows and their actual catalog profiles, defense, mass/price, maintenance and held fallback. Confirm V1 family envelope and whether obsidian knife should share native knife utility capabilities (currently weapon-only, no donor capability activation). Remaining W0 W2b–d/W3 rows are proposed contracts for review, not registered runtime content. The initial source-free claim was incorrect (merchant candidates); see R1 below. W2b originally waited for this review.

## Review 033 — first-batch Opus spot review (2026-11-04)

[Review 033](../../reviews/2026-11-04--033--items-062-w2a-first-melee-batch-spot-review.md): **NO-GO for W2b until R1.** Profiles match W0 and the V1 envelope, but the W2a kinds were added to `MERCHANT_STOCK`, which is a live merchant source (the "no merchant source" statement in the W2a section above is incorrect). R1: remove them from `MERCHANT_STOCK` (keep `MERCHANT_PRICES`), add a 062-wide no-source guard test, correct the docs. R2/R3 (sword defense/mass, rationale rows, CATALOG holdable count) ride with W2b. `obsidian_knife` stays weapon-only (F4). Price scale (F2) is an open author question, not blocking.

## Review 033 R1 correction — 2026-11-04

Removed all four W2a kinds from live `MERCHANT_STOCK`, retaining prices and load/profile support. The shared no-source regression covers catalog spawn, ordinary/premium/home pools and generated assortments (50 reference-derived seeds × five terrains × five sizes × home/non-home × four traders). Later 062 batches extend this list; only 064 removes a kind as it enables its source. Saves containing already issued W2a goods remain loadable, including merchant stock; no coercion or save/epoch bump. This fixes generation going forward, not historical ownership. W2b gate opens once this correction lands with green checks.

R1 validation: 52 tests / 3 files, Vue type-check, scoped ESLint and production Vite build. No browser verification.

## W2a R2/R3 and F2 author resolution — 2026-11-04

Per review 033 R2, `sword` defense is `.24/.48` and mass is `1.9 kg`, between `short_sword` and `long_sword`. Obsidian knife (and W2b obsidian dagger) keeps `.08/.20` defense: brittle glass edges are poor at parrying; both remain weapon-only so they cannot change harvesting auto-pick behavior (F4).

Per author direction following review 033 F2, Common melee prices follow existing V1 family anchors rather than a rarity premium: W2a `obsidian_knife 30` (above dagger 24 by a modest step for its 15 damage vs 14, and well below premium damascus_knife 90), `halberd 45` (spear 32 plus reach/damage 25), `mace 30` (near axe 25 at comparable damage), `sword 45` (below long_sword 50 at lower damage). W2b uses `obsidian_dagger 36` (between dagger 24 and family sword 40, matching its damage 17), `club 12`, `war_hammer 45` (high damage offset by slow wind-up/recovery; below long_sword 50), and `staff 15` (defensive reach, low damage). Prices remain barter/sale values, not acquisition sources.

## W2b implementation — 2026-11-04

Registered exactly `obsidian_dagger`, `club`, `war_hammer`, and `staff` with the W0 melee/damage/defense/mass tuples, procedural identity-preserving ground and held fallback, NPC families (`compact` / `tool`), and no source. Obsidian dagger is condition-backed; blunt weapons remain count-backed. Existing mace sphere fallback is preserved. R1 guard now covers all eight 062 melee kinds. No save version or worldgen epoch change.

Verification: 113 tests across seven focused catalog/ownership/geometry, source-guard, maintenance, donor-policy and S1 math files pass; scoped ESLint passes. NPC-family/save suites, Vue type-check and production build also pass in the coordinated verification recorded in the side-initiative index §8. No browser verification.

## W2c implementation — 2026-11-04

Registered exactly `ashgrove_dagger`, `millbrook_shortsword`, `fenmoor_sword` and `stonebridge_longsword` with the W0 melee/defense/mass/price tuples, NPC families (`compact` / `sword`), condition-backed maintenance instances and identity-preserving procedural ground/held fallbacks (reusing the knife, short-sword and long-sword fallback geometry). `fenmoor_sword` is a distinct kind; `masterwork_sword` is untouched (A3). No source, kit or reward enabled; the shared no-source guard now covers all twelve 062 melee kinds. No save-version or worldgen-epoch change (additive kinds; save round-trip fixture extended).

Note: donor policy rows for ashgrove/millbrook/stonebridge remain `deferred` (W1 fixture of 25 deferred is unchanged); the policy gates donor activation, not V1 authored kinds, and no policy test needed changing. W2d (five upper-tier profiles) is next and is gated by 063 factory guards for any release; no source.

Verification: 156 files / 2257 tests (`src/items`, `src/settlement`, `npcCombat`, `saveData`), Vue type-check, scoped ESLint and production build pass. No browser verification.

## W2d implementation — 2026-11-04

Registered the five A8 upper-tier melee identities (`pinewatch_longsword`, `kestrel_dagger`, `harrow_shortsword`, `ironvale_sword`, `greywatch_longsword`) with the W0 tuples, NPC families, maintenance-instance classification, prices and procedural fallbacks. They have **no source**: the 063 guards already refuse them in `createAcquiredInstance`, count inventories, grants and sales, and `claimUpperTierInstance` (via `createWeaponInstance` with factory access) is the only creation path. `stage4UpperTierMelee.test.ts` verifies profiles, tier ordering against the Masterwork batch, generic refusal, a ledger claim producing a full-condition instance that can be held, and procedural geometry. The shared no-source guard now covers all 17 melee kinds.

Type consequence: `WeaponMaintenanceKind` now includes restricted identities whose ordinary factory returns null, so three ordinary-factory callers narrow with `isUpperTierIdentity` (starting loadout in `createApp.ts`, shepherd weapon table/selector in `npcLoadout.ts`, melee-determinism fixture in `npcCombat.test.ts`). No save-version or worldgen-epoch change. The melee batch of 062 (W2a–W2d, 17 kinds) is complete; **R-A is still required before 064 U enables any source**.

Verification: `src/items`, `src/ai`, `src/persistence`, `src/settlement`, `src/app` (4388 pass), Vue type-check, scoped ESLint, production build. One unrelated failure exists on baseline `04b4773b`: `src/fauna/AnimalAgent.test.ts` "067 P3 … forwards the actual animal ID and species" (from `393f4d67`); logged in LOOSE-ENDS. No browser verification.
