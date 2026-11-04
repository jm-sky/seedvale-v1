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
