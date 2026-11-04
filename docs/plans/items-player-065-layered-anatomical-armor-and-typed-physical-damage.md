# Plan: Layered anatomical armor and typed physical damage (core)

**Created:** 2026-11-04
**Status:** `planned` 📋 (S1 implemented and technically verified 2026-11-04; Q-IC1/Q-IC2 approved 2026-11-04; S2/S3 retain dependency and atomic-release gates)
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** items-player-044, npc-067
**Domain:** `items-player`
**Subdomains:** `items` `inventory`
**Tags:** `v1-revival` `combat` `armor` `equipment` `layers` `persistence` `determinism` `side-initiative`
**Model:** Opus, Sonnet
**Roadmap:** -

Executor: GPT-6 Sol. Coordination, gates, lanes, save token: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). **Design authority:** [Combat & Armor proposal](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md) §3, §4, §6.1, §6.3–§6.6, §10 — formulas, contracts, fixtures and migration algorithm are binding as written there; this plan fixes slicing, ownership and the corrections of [review 032](../reviews/2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md). Dependencies apply to S2/S3 (S1 depends on nothing).

## Goal

Replace the global multiplicative armor reduction with: seven exclusive body regions, `under`/`outer` layers per slot, cut/pierce/blunt resistance per piece, one deterministic sampled hit location per accepted contact, and one pure incoming-human-hit resolver shared by player and NPCs. Inventory ownership, quality, attack lifecycles, HP/injury owners and controls stay.

## Slices

### S1 — Pure contracts and damage-type tagging (ungated, lands first)

- New dependency-light modules (proposal §3.2, §4.3): `src/items/equipmentTypes.ts` (`EquipmentSlot` after 044, `ArmorLayer`, `EquipmentPositionKey`), `src/combat/damageTypes.ts` (`DamageType`, `Resistance`), `src/combat/hitLocation.ts` (profiles table + salted sampler), `src/combat/incomingHumanHit.ts` (`resolveIncomingHumanHit`, pure).
- Optional `damageType?: DamageType` on `MeleeConfig`, `RangedConfig` (fixed-type weapons), ammo bonus/typing rows and `ThrowableConfig`; tag every existing config per proposal §6.1 table; test that every active melee/ranged/ammo/throw config is tagged.
- Golden tests: proposal §4.2 fixtures (13 / 20 / 9.9 / 12.75 / 4.455 HP, full block 0), profile weight sums = 100 and boundary rolls, salted hash vectors, expected-protection helper (15.75 % mail-only reference pierce).
- **No runtime caller.** Nothing reads `damageType` or the resolver yet. If `EquipmentSlot` still contains `arms` when S1 lands, `equipmentTypes.ts` re-exports the current union and 044 switches it.

### S2 — Layered equipment state and save (gate Q-IC1; Wave 2 on main)

- `ArmorConfig` gains `layer` + `resist` (replacing `damageReduction` on the same commit as S3/066 A — see release rule); `EquipmentState` keyed by `EquipmentPositionKey` (14 positions), `equip(instanceId, inventory)` infers position from catalog, `unequip(position)`; restore order canonical slot, under then outer; invalid refs discarded, items kept.
- Durable `incomingPhysicalHitOrdinal` per human: player (`PlayerController` seam, replacing private `defenseAttempt`) and NPC (`NpcAuthoritativeState` + `NpcStateSnapshot`, replacing `NpcAgent.defenseAttempt`).
- One save migration (token rule): `playerEquipment` slot keys → `slot:outer` (proposal §10.1 steps 1–7, starting from 044's shipped `shoulders`/`forearms` shape); absent ordinals → 0. No `WORLDGEN_EPOCH` bump.
- `armorMutationRevision` on `Inventory` + selection revision on `EquipmentState` (proposal §10.3) — the cache contract consumed by npc-068.

### S3 — Combat integration (gate Q-IC1 + Q-IC2; Wave 2 on main)

- `applyPlayerDamage` and `NpcAgent.applyIncomingCombatDamage` call `resolveIncomingHumanHit` with a discriminated physical/non-physical input; remove `incomingDamageMultiplier` from `EquipmentModifiers` (restrictions stay).
- Typed `PhysicalHit` from every source: player/NPC melee (weapon `damageType`), projectiles (`damageType` snapshotted on the projectile at fire time), fauna (species → profile/type mapping; bear large-maul/cut, small biters low-bite/pierce; explicit mapping over every species that can reach the callback), container trap (hands/cut, unblockable), mount fall (fall profile/blunt, unblockable); starvation/dehydration bypass.
- `CombatTargetHandle.applyDamage` accepts typed hit data; fauna adapter uses `amount` only. No new human targets.
- Restrictions: armor-only clamps (proposal §5.2), ranged stamina `1 + .5·(melee−1)`; injuries registered from actual HP loss; feedback data (`HumanHitResult`) exposed for 048.

## Release rule (binding)

S2, S3, items-player-066 slice A and ui-input-048 land **directly on `main`** in one orchestrated Wave 2 session (author decision 2026-11-04, no integration branch); the wave counts as released only after Opus review R-B. Never ship typed damage with global-protection labels; no permanent dual armor mode. S1 is on `main` before the branch starts.

## Non-goals

Shields/parry/dodge, armor durability, per-limb HP, location damage multipliers, human-target permissions, new controls, NPC kits (npc-068), catalog values (066), UI (048), visuals (S8).

## Verification

Per proposal §11.1 (equipment, combat, persistence groups) for the owners touched here; `loadStoredSave` fixtures v(044) → v(new) incl. explicit-shoulders-wins, stale refs, duplicate refs; next block/location identical after save + NPC reification; 30/60/120 Hz one hit per attack edge; equal player/NPC inputs give equal results. Manual verification belongs to the release (index Wave 2) — proposal §11.2 items 2, 3, 6.

Add JSDoc (`@domain items-player` / `@domain combat`) to all four new modules and to the changed `EquipmentState` API.
