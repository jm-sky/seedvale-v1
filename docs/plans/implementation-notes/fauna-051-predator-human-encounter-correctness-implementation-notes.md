# Implementation notes — fauna-051

**Source inspection:** 2026-11-05, GitHub V1 `main`; static only. Re-check at implementation start. Source plan: [fauna-051](../fauna-051-predator-human-encounter-correctness.md).

## Ownership and working entry points

- `src/fauna/AnimalAgent.ts`: `takeDamage(damage, source?: 'npc' | 'player')` near line 3206 updates HP, injury and provocation; no NPC attacker's identity is passed. `chaseHuman` and `chaseNpc` near lines 4218–4285 use direct `steerToward`; `updatePredator` near line 4613 instead uses `stepNavRescue(this.chaseNav, ...)` for animal prey. Use existing `chaseNav` lifecycle, not another nav owner.
- `src/fauna/predatorHumanDecision.ts`: `decidePredatorHumanIntent` and `scorePredatorHumanIntents`; `RETALIATION_ATTACK_CHANCE = 0.75`, `PROVOKED_FLEE_HP_RATIO = 0.4`, `PROVOCATION_SECONDS = 8`; bear/wolf get close retaliation rolls, fox does not.
- `src/fauna/predatorIntentCommitment.ts`: `resolveCommittedPredatorIntent` freezes per-encounter aggression and holds attack/flee up to 2 seconds, with hard overrides. Keep commitment scope separate for player/NPC.
- `src/fauna/AnimalAgent.ts::refreshThrottledHumanIntent`: `Math.random()` on encounter or provocation, near lines 3969–3999; NPC counterpart near 4149–4183. Replace with an event-indexed deterministic draw, not per-tick RNG.
- `src/fauna/faunaDecision.ts`: `FAUNA_BEHAVIOUR_PRIORITY` makes `player-ignore` (90) dominate `npc-attack` (60). Fix decision validity/priority with explicit live aggression context; preserve every other urgency order.
- `src/fauna/animalDefs.ts`: wolf walk 3.2, sprint 6.5, player notice 10, panic 3, wolf-den defense radius 16. `src/fauna/faunaCombat.ts`: wolf 50 HP, human bite 12; `AnimalAgent.ts` common `CONTACT_RANGE = 0.8`, `ATTACK_COOLDOWN = 0.6`, stamina cost 0.05.
- `src/fauna/animalUpdateCadence.ts`: `resolveAnimalUpdateImportance` keeps combat/threat and agents within 12 m full rate. Never regress this for new nav work.
- Human-hit callback currently takes attacker animal id/species; extending incoming provenance for **NPC-to-fauna** requires tracing `combatTargetForAnimal` in `src/fauna/faunaCombat.ts` and the NPC combat call site. Avoid a new global aggro registry.

## Integration boundaries / hazards

1. Keep player/NPC/fauna identities stable across streamed updates and rebuilds. Aggressor references must be validated against current live actor and context; do not persist stale object references.
2. Audit existing `chaseNav` helper reset, target identity and movement cadence before sharing it between human and prey pursuit; never multiplex active destinations without resetting state.
3. Contact geometry is a **joint contract** with [items-player-067](../items-player-067-melee-weapon-reach-and-damage-balance.md), which owns weapon reach and player hit tests. Fauna retains attack decision and impact eligibility.
4. Any persisted encounter ordinal or attacker identity must follow existing `snapshot()/hydrate()` contracts and migration rules; do not add accidental save format changes. `fauna-049` owns future animal tier/elite mechanics.
5. Separate three outcomes in diagnosis: chose `attack`, reached bite distance and *landed* damage. Do not infer success from intent alone. Preserve fire, nearby humans, hunger, rabies, dog guard, wolf den and cave semantics.

## Targeted verification

`src/fauna/predatorHumanDecision.test.ts`, `predatorIntentCommitment.test.ts`, `faunaDecision.test.ts`, `AnimalAgent.test.ts`, `animalVariants.test.ts`, `animalUpdateCadence.test.ts`, `animalTerritory.test.ts`; add obstacle chase, aggressor with player present, repeatability and spatial hit exclusions. Run focused tests, type-check, lint and build when implementation is done; report manual browser checks separately. Add `@domain fauna` JSDoc to new public targeting/contact helpers.
