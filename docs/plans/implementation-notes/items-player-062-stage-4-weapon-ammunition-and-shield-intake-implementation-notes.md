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
| W2a | obsidian_knife | knife / compact | pierce | 15 / 1.6 / .6 / .13 / .08 / .19 / 5 | .08 / .20 | yes | .35 | 55 | Common |
| W2a | halberd | polearm / spear | cut | 25 / 3.2 / .5 / .34 / .12 / .44 / 13 | .18 / .40 | yes | 3.5 | 95 | Common |
| W2a | mace | blunt / tool | blunt | 21 / 1.9 / .45 / .30 / .10 / .36 / 10 | .12 / .30 | no | 1.8 | 50 | Common |
| W2a | sword | sword / sword | cut | 22 / 2.35 / .42 / .23 / .10 / .32 / 9 | .20 / .40 | yes | 1.5 | 65 | Common |
| W2b | obsidian_dagger | dagger / compact | pierce | 17 / 1.7 / .58 / .12 / .08 / .18 / 5 | .08 / .20 | yes | .45 | 65 | Common |
| W2b | club | blunt / tool | blunt | 13 / 1.9 / .5 / .25 / .10 / .30 / 7 | .08 / .25 | no | 1.2 | 12 | Common |
| W2b | war_hammer | blunt / tool | blunt | 26 / 2.1 / .38 / .38 / .12 / .46 / 13 | .14 / .35 | no | 3 | 80 | Common |
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

W2b–d remain proposed contract rows pending first-batch review; no runtime admission until their own verified commits. Upper-tier rows have no source and require 063 factory guards before release.

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
