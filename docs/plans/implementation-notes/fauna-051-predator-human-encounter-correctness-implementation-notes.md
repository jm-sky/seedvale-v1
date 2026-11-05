# Implementation notes — fauna-051

**Source inspection:** 2026-11-05, GitHub V1 `main`; static only. Re-check at implementation start. Source plan: [fauna-051](../fauna-051-predator-human-encounter-correctness.md). Corrected after [review 034](../../reviews/2026-11-05--034--items-player-067-fauna-051-combat-plans-review.md) (2026-11-05).

## Ownership and working entry points

- `src/fauna/AnimalAgent.ts`: `takeDamage(damage, source?: 'npc' | 'player')` near line 3206 updates HP, injury and provocation; no NPC attacker's identity is passed. `chaseHuman` and `chaseNpc` near lines 4218–4285 use direct `steerToward`; `updatePredator` near line 4613 instead uses `stepNavRescue(this.chaseNav, ...)` for animal prey. Use existing `chaseNav` lifecycle, not another nav owner.
- `src/fauna/predatorHumanDecision.ts`: `decidePredatorHumanIntent` and `scorePredatorHumanIntents`; `RETALIATION_ATTACK_CHANCE = 0.75`, `PROVOKED_FLEE_HP_RATIO = 0.4`, `PROVOCATION_SECONDS = 8`; bear/wolf get close retaliation rolls, fox does not.
- `src/fauna/predatorIntentCommitment.ts`: `resolveCommittedPredatorIntent` freezes per-encounter aggression and holds attack/flee up to 2 seconds, with hard overrides. Keep commitment scope separate for player/NPC.
- `src/fauna/AnimalAgent.ts::refreshThrottledHumanIntent`: `Math.random()` on encounter or provocation, near lines 3969–3999; NPC counterpart near 4149–4183. Replace with an event-indexed deterministic draw, not per-tick RNG: hash (`animalId`, target key — `PLAYER_INTENT_TARGET_KEY` or NPC id, per-agent encounter ordinal incremented on new encounter/provocation) in the shape of `combat/criticalHit.ts::criticalRoll`. Ordinal and commitments are transient (not in `AnimalSaveState`; `snapshot()`/`hydrate()` unchanged).
- `src/fauna/faunaDecision.ts`: `FAUNA_BEHAVIOUR_PRIORITY` makes `player-ignore` (90) dominate `npc-attack-frenzied` (70), `npc-*` (60), `fire-avoid` (50), `scare-flee` (48), `frenzy-beeline` (40) and `dog-guard` (35); the `player-ignore` case runs `updatePredator`. Fix in `isBehaviourValid` with explicit live NPC-aggression/frenzy/fire context; preserve every other urgency order. Note `refreshThrottledHumanIntent` does not check `this.frenzied`.
- `src/fauna/animalDefs.ts`: wolf walk 3.2, sprint 6.5, player notice 10, panic 3, wolf-den defense radius 16; bear sprint 6.0; alpha `speedMultiplier` 1.05. Player walk 6 (`world/travelUnits.ts::PLAYER_WALK_SPEED`, Q81-a), sprint ×1.8 (`PlayerController.ts::SPRINT_MULTIPLIER`) — pursuit of a moving player is speed-bound; Q-C1 answered (a): no speed change in §A; optional (a+b) burst only as species data in §C after measurement. `AnimalDef` has no body radius; there is no player–animal body collision, so a wolf can physically reach 0.8 m centre distance. `src/fauna/faunaCombat.ts`: wolf 50 HP, human bite 12; `AnimalAgent.ts` common `CONTACT_RANGE = 0.8`, `ATTACK_COOLDOWN = 0.6`, stamina cost 0.05.
- `src/fauna/animalUpdateCadence.ts`: `resolveAnimalUpdateImportance` keeps combat/threat and agents within 12 m full rate. Never regress this for new nav work.
- Human-hit callback (`gameLoop.ts` ≈3023 → `applyPlayerDamage`) takes attacker animal id/species and has no spatial-context check. NPC-to-fauna provenance: `CombatTargetHit.attackerId` (`combat/combatIntent.ts`) already arrives in `combatTargetForAnimal().applyDamage` (`faunaCombat.ts` ≈143) for melee (`applyNpcMeleeHit`) and projectiles (`npcCombat.ts` ≈411) and is dropped — pass it to `takeDamage`. Retaliation preference goes through the existing `resolveNpcTarget`/`npcTarget` lock (LOOSE-ENDS: lock ignores range once set). Avoid a new global aggro registry.
- Spatial: player→animal hits already filter by `WorldSpatialContext` (`interactables.ts` ≈578, ≈1455). For bites, add an attack-time same-context check via the resolver the fauna update already can receive; cave/surface perception belongs to `fauna-045`.

## Integration boundaries / hazards

1. Keep player/NPC/fauna identities stable across streamed updates and rebuilds. Aggressor references must be validated against current live actor and context; do not persist stale object references.
2. Audit existing `chaseNav` helper reset, target identity and movement cadence before sharing it between human and prey pursuit; never multiplex active destinations without resetting state.
3. Contact geometry contract is **owned and written by** [items-player-067](../items-player-067-melee-weapon-reach-and-damage-balance.md) (its notes); default centre-to-centre. Fauna retains attack decision and impact eligibility; a human-bite distance change uses a separate human-target constant — `CONTACT_RANGE` also drives prey hunting (≈4643), dog pest pursuit (≈4843), dog-vs-wolf (≈5127) and rabid attacks (≈5229).
4. Any persisted encounter ordinal or attacker identity must follow existing `snapshot()/hydrate()` contracts and migration rules; do not add accidental save format changes. `fauna-049` owns future animal tier/elite mechanics.
5. Separate three outcomes in diagnosis: chose `attack`, reached bite distance and *landed* damage. Do not infer success from intent alone. Preserve fire, nearby humans, hunger, rabies, dog guard, wolf den and cave semantics.

## Targeted verification

`src/fauna/predatorHumanDecision.test.ts`, `predatorIntentCommitment.test.ts`, `faunaDecision.test.ts`, `AnimalAgent.test.ts`, `animalVariants.test.ts`, `animalUpdateCadence.test.ts`, `animalTerritory.test.ts`; add obstacle chase, aggressor with player present, repeatability and spatial hit exclusions. Run focused tests, type-check, lint and build when implementation is done; report manual browser checks separately. Add `@domain fauna` JSDoc to new public targeting/contact helpers.

## Implementation log — §B (Q152, 2026-11-05)

Landed (technically verified; not browser-verified):

- **B1 identity:** `AnimalAgent.takeDamage(damage, source?, attackerId?)`; `combatTargetForAnimal().applyDamage` passes `hit.attackerId`. `CombatTargetHit` unchanged (the field already existed). `aggressorNpcId` is remembered on `source: 'npc'` hits and preferred by `resolveNpcTarget()` (overrides an existing lock, same `npcTarget`, no registry) while `provokedTimer > 0` and the NPC is in `nearbyNpcs`; cleared by `resetHumanThreatState()` or on window expiry. Not done: an explicit spatial-context check for the aggressor (`nearbyNpcs` is caller-bounded; context belongs to §A3/fauna-045); the "player stronger immediate threat" case is already covered because player-attack/-flee (90) outrank NPC branches.
- **B2 arbitration:** `faunaDecision.ts::isBehaviourValid('player-ignore')` is false when a live NPC threat (frenzied, or `npcIntent` attack/flee), non-frenzied fire, or non-frenzied scare is active. Priority table untouched; `dog-guard` is unaffected (dogs are never `role: 'predator'`).
- **B3 deterministic roll:** `Math.random()` in `refreshThrottledHumanIntent` / `refreshThrottledNpcIntent` replaced by `nextEncounterRoll(targetKey)` = `criticalRoll(animalId, 'encounter:'+targetKey, encounterOrdinal++)`. Ordinal/aggressor/lock/commitments reset in `hydrate()` via `resetEncounterState()`; no save change. Documented in `docs/state/fauna.md` (Combat).
- Tests: `AnimalAgent.encounter.test.ts` (aggressor lock vs nearer bystander, override of an existing lock, fallback when absent, identical rolls for same ids/order, ordinal advance on provocation, no redraw while stable, hydrate reset), `faunaDecision.test.ts` (player-ignore un-masking), `faunaCombat.test.ts` (attackerId forwarded). The player-path roll shares the same helper but is only covered via the NPC path (player noticing is probabilistic).

## Implementation log — §A (Q151, 2026-11-05)

Landed (technically verified; not browser-verified):

- **A1 nav:** `chaseHuman` / `chaseNpc` now use `stepNavRescue(this.chaseNav, ...)` instead of direct `steerToward`; the prey-hunt path is untouched. `chaseNav` is claimed per target (`bindHumanChaseNav`: key `'player'` or NPC id; a changed key or a leftover prey route is cleared) and released (`releaseHumanChaseNav`) when the tick's branch is not `player-attack` / `npc-attack` / `npc-attack-frenzied`, on stamina exhaustion and in `resetEncounterState()` (hydrate). No new per-frame work: A* runs only through the existing watchdog (`STUCK_CHECK_INTERVAL_SEC` strikes) or when a route is stale.
- **A2 contact:** `humanBite.ts::HUMAN_BITE_RANGE = 0.8` (centre-to-centre, same value as before, separate from `CONTACT_RANGE`, which is unchanged). Cooldown 0.6 s / stamina cost / speeds unchanged (Q-C1 (a)).
- **A3 spatial check:** `humanBite.ts::biteSharesSpatialContext` (same `WorldSpatialContext` + `HUMAN_BITE_MAX_DY = 2` m) is applied in the `gameLoop.ts` player-bite callback at attack time (one agent lookup + two resolver queries per bite). NOT done: the same check for NPC bites (`onNpcHit` has no NPC context/height) and an agent-side check inside `AnimalAgent` (would need `createFauna.ts` plumbing, owned by another agent) -> follow-up.
- Tests: `AnimalAgent.chase.test.ts` (constant, cooldown-bounded bites, no bite on a sprinting target, wall detour without entering the collider, determinism, nav claim/release/target change, spatial check cases).

### Closure measurements (headless, deterministic; `SEEDVALE_CHASE_REPORT=1 pnpm vitest run src/fauna/AnimalAgent.chase.test.ts`)

Setup: wolf/bear id `wolf-chase`, flat ground, no colliders, wolf faces the player, player starts 8 m away, held alert (perception not measured), provoked every 6 s, dt 0.05 s, 20 s. Player: standing (a fighting player is closure-equivalent; the 3 m lunge only shortens the gap), walking 6 m/s, sprinting 10.8 m/s directly away. These are modeled, deterministic numbers, not playtest statistics.

| animal vs player | landed bites / 20 s | first bite | min distance | stamina exhausted at |
|---|---|---|---|---|
| wolf vs standing | 25 | 1.15 s | 0.48 m | 4.1 s |
| wolf vs walking | 0 | none | 4.90 m | 5.5 s |
| wolf vs sprinting | 0 | none | 7.67 m | 5.5 s |
| bear vs standing | 27 | 1.25 s | 0.50 m | 4.1 s |
| bear vs walking | 0 | none | 7.70 m | 5.5 s |
| bear vs sprinting | 0 | none | 7.70 m | 5.5 s |

Findings:
1. A wolf's sprint Stamina lasts ~5.5 s (~4.1 s while biting), i.e. ~35 m of pursuit; a walking player (6 m/s vs wolf 6.5) is never bitten from 8 m and a sprinting one is out of reach. Per the plan this is the §C input for the optional (a+b) burst decision: predators currently **never** land a bite on a retreating human that starts >= 4.9 m away. No speed change was made.
2. Obstacle (4 m x 5 m block between wolf and standing player): the old direct steer stays pinned against the block for the whole chase. With `chaseNav` the stuck watchdog fires its repath only after ~4.5 s (two strikes at 1.5 s check interval), the detour is walked in ~2 s and the first bite lands at 6.85 s. The watchdog latency alone burns ~80% of the wolf's sprint Stamina; shortening it for predator chase would change the watchdog constants shared with NPCs -> author/§C question, not changed here.
3. A thin (1 m) wall is not avoided: the existing `findPath` returns a straight 2-point route through it (cell-centre walkability sampling), so the wolf stays pinned. Pre-existing nav-grid limitation shared with every nav user; out of scope (no new pathfinder). The shared contact-contract "thin obstacles" half (067 verification 4) is therefore characterised, not fixed.
4. Contact-contract items covered (shared half of 067 verification 4, fauna side): centre-to-centre bite range, vertical separation (>2 m), cave vs surface and cave vs cave via `biteSharesSpatialContext`; moving targets (walking/sprinting rows) never take ghost bites; no bite without being within 0.8 m.
5. First `update()` of a fresh agent banks `CADENCE_PRIME_SEC` (1 s) and teleports up to ~6.8 m in one tick (pre-existing); the harness consumes it with a warm-up tick.
6. After Stamina exhaustion the agent wanders with `Math.random()` (non-deterministic after ~5 s); determinism is asserted only for the pre-exhaustion window.

Cadence: no change to `resolveAnimalUpdateImportance` inputs; no new scans (one cheap null check per tick).

