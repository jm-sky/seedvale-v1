# Implementation notes: Combat correctness prelude

**Plan:** `npc-067-combat-correctness-prelude.md` · verified at `fe49547f` (2026-11-04, static).

## P1 projectile

- `src/combat/projectile.ts`: `PROJECTILE_HIT_RADIUS = 0.6` (l.37), `segmentPointDistance()` (l.53, keep — other callers may use it), `sweptProjectileHit()` (l.72). Candidates are `ProjectileCandidate { id, x, z, alive }`. Return type stays `string | null`; callers in `gameLoop.ts` need no change.
- Quadratic: segment `P(t) = A + t·D`, `|P(t) − C|² = r²`. Take the smaller root in `[0,1]`; if `|A − C| ≤ r` → `t = 0`. `|D| = 0` → hit iff `|A − C| ≤ r`, `t = 0`. Compare `(t, id)` lexicographically.

## P2 ready-weapon defense

- Today: `resolveNpcDefenseConfig(carried)` (`npcCombat.ts:290`) is called from the incoming-damage resolver (`npcCombat.ts:~419`, `const defense = resolveNpcDefenseConfig(params.carried)`). The caller is `NpcAgent.applyIncomingCombatDamage` (`NpcAgent.ts:~2502`, which increments the private `defenseAttempt` at `:2505`).
- Change the resolver input from "carried inventory" to "ready defense source" supplied by `NpcAgent` from its current combat mode (it already knows melee vs ranged mode and the selected weapons through `resolveNpcMeleeWeapon`/`resolveNpcRangedWeapon`). Keep the pure resolver free of `NpcAgent` imports.
- Do **not** touch `defenseAttempt` — 065 S2 replaces it with the durable ordinal.

## P3 attacker identity

- Player path: `createFauna.ts:144` `onHumanHit?: (damage, attackerX, attackerZ)` → `AnimalAgent.ts:1113`, `:3440`, `:3800` (`chaseHuman`), `:4216–4220`; the gameLoop closure at `gameLoop.ts:~2991` builds `applyPlayerDamage({… attackerKey: 'fauna' …})`.
- NPC path: callback `(targetId, amount, attackerX, attackerZ, attackerAnimalId)` already receives the animal ID (`gameLoop.ts:~3027`) but passes `attackerKey: 'fauna'` at `:3031` — just use `attackerAnimalId`.
- Add `attackerId` + `species` to `onHumanHit` (extend the signature; there are two forwarding sites in `createFauna.ts` l.1416, l.1471). Search settlement-owned fauna (livestock/dogs) for other `onHumanHit` providers before finishing.

## P4 exact-instance weapons

- `NpcMeleeWeapon` (`npcCombat.ts:43`); player precedent for exact-instance wear: `gameLoop.ts:1422` maps `isWeaponItemInstance(inst) ? applySharpnessWear(inst, profile) : inst` and `getSharpnessDamageModifier` (import at `gameLoop.ts:119`). Reuse those helpers (`src/items/weaponMaintenance.ts:110`) for NPCs; write back through `Inventory.updateInstance` (or the existing instance-update API the player path uses).
- Tie order: score, then kind, then instance ID (lexical) — matches the npc-053 lexical tie-break convention.

## Order and lanes

P1 and P3 are independent of other lanes except `gameLoop.ts` (062 W3 must not be concurrently in flight). P2/P4 edit `npcCombat.ts`/`NpcAgent.ts` — run after 062's NPC-family additions (W2a), before 065 S3.

## P1 implementation — 2026-11-04

Replaced perpendicular-distance selection with earliest quadratic segment–circle entry time, start-inside/zero-length containment, lexical stable-ID ties and dead-candidate exclusion. Existing radius and caller spatial filters unchanged; `segmentPointDistance` remains available. Verified with 84 focused projectile/NPC combat/spatial tests, Vue type-check, scoped ESLint and production build. Fixtures cover near off-center vs far centered, reversed input, ties, start-inside, zero-length, tangency/end contact and out-of-segment circles. No manual projectile check performed. No save or typed-damage change.

## P3 implementation — 2026-11-04

Both fauna→human callbacks carry actual animal ID and species. `AnimalAgent` supplies identity from its own authoritative fields; both `createFauna` forwarding sites pass the callback unchanged (including its extra/settlement-owned agents). There are no separate onHumanHit/onNpcHit providers under `src/settlement`; gameLoop is the live recipient for both. Player and NPC damage use the actual ID as attackerKey. Species is available at the callback seam for 065; no typed damage/profile runtime is activated here.

171 focused tests pass (AnimalAgent/createFauna/defenseResolver), including public-update tests for actual player/NPC contacts with correct ID/species and no callback to the other target. Vue type-check, scoped ESLint and production build verified. No browser verification or aggression behavior change. Defense outcomes can differ from previous encounters because the deterministic key is now per animal, as intended.
