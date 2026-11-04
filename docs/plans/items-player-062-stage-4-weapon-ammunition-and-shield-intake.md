# Plan: Stage 4 donor intake — weapons, ammunition and inventory-only shields

**Created:** 2026-11-04
**Status:** `in progress` 🚧 (W0/W1/W2a complete 2026-11-04; W2b waits for first-batch Opus spot review)
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** items-player-065
**Domain:** `items-player`
**Subdomains:** `items` `inventory`
**Tags:** `v1-revival` `equipment` `stage-4` `v3-donor` `weapons` `ammunition` `side-initiative`
**Model:** Opus, Sonnet
**Roadmap:** -

Executor: GPT-6 Sol. Coordination, gates and lanes: [Items × Combat side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Binding corrections: [review 032](../reviews/2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md). Dependency on items-player-065 means **slice S1 only** (`DamageType` + `damageType` tagging), not the gated S2/S3.

## Goal

Register the non-armor Stage 4 donor targets as V1-authored items, as approved by [A1–A5, A7, A9](../research/v1-revival/2026-10-28--equipment-stage-4-approved-author-decisions.md): 17 melee weapons, 2 bows, 3 ammunition kinds, 3 inventory-only shields — plus the reviewed Stage 3 policy evolution and the 3 deferred records' tracking. Items become **profiled and loadable**, not yet obtainable through world sources (that is items-player-064), except via test fixtures.

Out of scope (owned elsewhere): every armor/underlayer piece incl. brigandine and padding (items-player-066, review 032 F2); world sources/NPC distribution (064); upper-tier issuance (063); typed damage *effects* (065 S3); falchion / composite_bow / arrow_blunt registration (A9 deferred).

## Exact ID scope

Use the [87-row integration matrix](../research/v1-revival/2026-10-27--equipment-stage-4-integration-matrix.md) as the per-item authority (identity, tier, source class). Paths in scope: "New distinct melee targets (17)", "New distinct ranged targets (2)", "New ammunition targets (3)", the three shields from "Inventory-only targets", and P1 "Existing V1 reuse (26)" (policy only). The padded underlayers listed under "Inventory-only targets" are **not** in scope (review 032 F2).

Upper-tier (A8) identities among the targets — e.g. `kestrel_dagger`, `harrow_shortsword`, `ironvale_sword`, `greywatch_longsword`, `pinewatch_longsword`, `yewmaster_longbow` — get full profiles here but **no source**; the matrix "U" column marks them.

## Slices

Each slice is one commit (or a short series), independently verifiable and revertable before any source enables it.

| Slice | Content | Stage 4 ref |
| --- | --- | --- |
| **W0** | Freeze the slice contract in this plan's notes: per-batch exact IDs, authored-profile fields, `damageType`, NPC family, model/fallback, price/mass. No code. | P0 |
| **W1** | Reviewed Stage 3 policy evolution for A1–A5 + five A9 IDs, exactly as the Stage 4 proposal's policy table; expected fixture **18 existing / 8 adapt / 36 new / 0 conflict / 25 deferred, 26 verified refs, 0 candidate targets**. Policy, validation guards and tests change together. | P1 |
| **W2a–W2d** | Melee batches (~4–5 IDs each): ordinary first (`obsidian_knife`, `halberd`, `mace`, ordinary donor swords/axes/spears), then `fenmoor_sword` and Masterwork, then upper-tier profiles last. | P2 |
| **W3a** | Bows: `marlow_longbow`, `yewmaster_longbow` — authored V1 ranged profiles; `masterwork_hunting_bow`/`hunting_bow` untouched. | P3 |
| **W3b** | `sling_stone`: sling-only ammo; sling `ammoKinds` becomes `['stone', 'sling_stone']`; not throwable, not a resource. | P3 / A5 |
| **W3c** | `bolt_heavy`, `bolt_blunt`: crossbow `ammoKinds` becomes `['bolt', 'bolt_heavy', 'bolt_blunt']`. | P3 / A9 |
| **W4** | Shields `wooden_shield`, `iron_rimmed_shield`, `buckler` as inventory goods: no `defense`, no wearable/held/primary admission. | P6 / A7 |
| **W5** | Deferred-record guard: test that falchion/composite_bow/arrow_blunt have no registration, source or save entry; all 12 donor `future` flags unchanged. | P8 |

## Rules

- **Authored V1 profiles, never donor conversion.** Fit every new weapon into the existing V1 envelope (combat proposal §6.1 anchors: knife 12/1.6/4, short sword 18/2.1/7, long sword 28/2.6/12, spear 20/3/9, axe 20/2/10) and its family. Tier rule (A8): Masterwork < Unique/Exceptional < Legendary in *overall* tier, not per stat.
- Every new melee/ranged/ammo config carries `damageType` (vocabulary from 065 S1): `halberd` cut, `mace` blunt, `bolt_heavy` pierce, `bolt_blunt` blunt, `sling_stone` blunt; others by authored family (blade cut, point pierce, haft/club blunt). The 065 S1 exhaustiveness test must stay green.
- Ammo bonus: new variants get an explicit authored entry (or none) in the bonus table; A1 keeps `arrow` at 0, broadhead +4, war +8 unchanged. Decide and test NPC behaviour for new variants against the current NPC base-damage path; do not silently "fix" native NPC arrow balance.
- New melee kinds must be added to the total NPC family map in `npcCombat.ts` (completeness test). Adding a kind to the catalog makes it an NPC candidate **only if owned** — no kit grants here.
- Maintenance-backed weapons join `WEAPON_MAINTENANCE_KIND_LIST` only if their family has edge/wear today (blade/axe/spear); clubs/maces follow the existing count-backed tool path unless notes justify otherwise.
- Shields: `ITEM_DEFS` goods, count-backed unless notes prove an instance need. Item details state "inventory-only — no blocking". Shield cells in UI stay N/A.
- Preserve: all existing V1 identities, counts, priorities, profiles, saves; donor records immutable (87/87 source fidelity).

## Verification

Focused Vitest per slice: `src/items/v3Equipment/*.test.ts` (W1), catalog/instance/maintenance tests, `npcCombat.test.ts` family completeness, ranged lifecycle / player ranged / gameLoop-level ammo tests (W3). W3 positive/negative shooter matrix: sling admits `stone` + `sling_stone`, bows/crossbow reject `sling_stone`; only crossbow admits the new bolts; mixed stacks pick deterministically in `ammoKinds` order; exactly one unit consumed from the chosen owner; `stone` still throws and remains a resource; reload/cancel/no-ammo/no-double-shot unchanged. Save round-trip for every new kind (counts and instances), drop/pickup, transfer. `pnpm run type-check`, `lint:fix`, `build` at slice end.

Manual (queue §2, author or agent with browser): fixture-grant one ordinary new weapon and one new ammo on seed `415424794` (`?seed=415424794`), attack fauna, verify held visual/fallback and HUD ammo counts.

## Rollback

Before 064 enables a source: revert the slice. After a source exists: disable the source, keep load/profile support; never coerce an issued kind into another kind.

Add JSDoc (`@domain items-player`) to any new exported helper (e.g. ammo admission helpers).
