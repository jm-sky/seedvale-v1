# Implementation notes — items-player-067

**Source inspection:** 2026-11-05, GitHub V1 `main`; static only. Re-check at implementation start. Source plan: [items-player-067](../items-player-067-melee-weapon-reach-and-damage-balance.md).

## Ownership and working entry points

- `src/items/itemCatalog.ts`: `MeleeConfig` and `ITEM_CATALOG` are the only authoritative per-kind player weapon parameters. Current starting knife: `{ damageType: 'pierce', damage: 12, range: 1.6, arcDot: 0.6, windUp: 0.12, hitWindow: 0.08, recovery: 0.18, staminaCost: 4 }`.
- `src/player/playerMelee.ts`: `createPlayerMelee` consumes `MeleeConfig`, `resolveMeleeRecovery`, stamina and vigor. `pickCombatTarget` and `rankCombatTargets` handle candidate ranking. `resolveMeleeWeaponSnapshot` resolves held maintenance instance. **Preserve** `MAX_LUNGE_DISTANCE = 3`, `LUNGE_STAMINA_COST = 15` and `FALLBACK_APPROACH_DISTANCE = 1`; no tuning of lunge.
- `src/combat/meleeAttack.ts`: `createMeleeAttackLifecycle` emits `hitReady` once; `resolveMeleeHits` returns every live candidate passing final XZ range/arc, with no shape or height check; `yawToward` is the facing convention.
- `src/app/gameLoop.ts`: `playerMelee.update` and `resolveMeleeHits` integrate outgoing hits near lines 1359–1454 (line numbers provisional). The `meleeCandidates` list is built from `interactables` **before** hit resolution. Attack request/lunge/facing near lines 2400–2428. Audit 7 m acquisition versus `GAZE_RANGE` 5 m and candidate refresh after `player.gapClose()`.
- `src/combat/meleeStrength.ts`: `applyMeleeStrength`, neutral Strength 0.5; `src/combat/criticalHit.ts`: `resolveCriticalHit`, 8% melee crit ×1.6. Do not double-apply modifiers.
- `src/items/weaponMaintenance.ts`: instance sharpness multiplier and wear. `src/ai/npcCombat.ts`: NPC uses weapon definitions, so catalog adjustments can alter AI weapon choices and combat outcomes.
- `src/fauna/faunaCombat.ts`: ordinary wolf HP 50. **Contact semantics with animals are governed jointly with** [fauna-051](../fauna-051-predator-human-encounter-correctness.md).

## Implementation constraints / hazards

1. Fix candidate visibility and final hit predicate at the authoritative impact seam, not by increasing weapon ranges or skipping collision checks. Verify timing: lunge is applied at attack request, while the hit occurs after wind-up.
2. Any target-radius or vertical contact rule must be shared/reused with fauna, and must avoid uncached scene traversal/per-frame mesh raycasts. Define exact units and center-vs-surface semantics.
3. A per-weapon cardinality rule should be data-driven or follow the existing melee configuration shape; do not silently change every weapon's crowd behavior without design tests.
4. Preserve actual weapon-instance sharpness/wear, Agility-modified recovery, Strength, criticals, armor channel/type, NPC loading and equipment source policy. Cross-check `items-player-062`/`064`/`065`/`066` (combat/armor side initiative).
5. Verify models visually before claiming model-perfect reach. The audit table is theoretical DPS without stamina cap or target movement, not a runtime measurement.

## Targeted verification

`src/player/playerMelee.test.ts`, `src/combat/meleeAttack.test.ts`, `src/items/itemCatalog.test.ts`, `src/ai/npcCombat.test.ts`, `src/fauna/faunaCombat.test.ts`; add boundary/integration cases and controlled encounter harness as specified in the plan. Run project type-check, lint, build and focused tests; report checks actually run. Add `@domain items-player` JSDoc on new authoritative reach/cardinality helpers.
