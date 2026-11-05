# Plan: Predator-human encounter correctness and retaliation

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** L
**Depends on:** -
**Domain:** `fauna`
**Subdomains:** `predation` `lifecycle`
**Tags:** `combat` `ai` `navigation` `determinism` `v1-revival`
**Model:** Sonnet, Composer
**Roadmap:** -

## Goal

Make ordinary wolf and other predator encounters credible: a predator that decides to retaliate should be able to pursue, orient, reach and attack the right aggressor while retaining believable species-specific fear, flight, stamina and territorial behavior. Address confirmed decision/navigation defects independently of subjective aggression tuning. Coordinate reach/contact semantics with [items-player-067](./items-player-067-melee-weapon-reach-and-damage-balance.md); keep the **player's existing 3 m lunge unchanged**.

The 2026-11-05 AI audit identifies weak human pursuit and target attribution alongside the weapon audit's reach mismatch; neither audit is runtime verification. Do **not** assume the fix is simply more HP or a globally larger `RETALIATION_ATTACK_CHANCE`.

Pre-implementation [review 034](../reviews/2026-11-05--034--items-player-067-fauna-051-combat-plans-review.md) (2026-11-05, static) corrected this plan: pursuit credibility is bounded by player speed (Q81-a open; Q-C1 answered 2026-11-05: (a), optionally (a+b)), attacker identity already exists at the NPC hit seam, `player-ignore` masks more branches than NPC attack, and encounter determinism is transient by design (no save change).

## Verified current contracts and surfaces

- `src/fauna/AnimalAgent.ts::chaseHuman/chaseNpc` currently steer directly toward people; predator-vs-prey `updatePredator` uses `stepNavRescue(this.chaseNav, ...)`. `attackHuman/attackNpc` use a common 0.8 m XZ contact threshold and 0.6 s cooldown.
- `src/fauna/predatorHumanDecision.ts`: wolf/bear special provoked retaliation roll (0.75 when eligible), low-HP flee threshold (0.4), fire/crowd suppression, species/hunger/territoriality scoring; fox intentionally remains more cautious.
- `src/fauna/predatorIntentCommitment.ts`: 2-second encounter-local decision commitment and forced re-evaluation after a hit; preserve the intended no-per-frame-thrashing property.
- `src/fauna/faunaDecision.ts`: player branches priority 90 vs NPC branches 60; `player-ignore` (90) outranks `npc-attack-frenzied` (70), all `npc-*` (60), `fire-avoid` (50), `scare-flee`, `frenzy-beeline` and `dog-guard`, and then runs `updatePredator`; `refreshThrottledHumanIntent` does not exclude frenzied predators.
- `AnimalAgent.takeDamage(damage, source?: 'player'|'npc')` lacks a stable NPC aggressor identity, although `CombatTargetHit.attackerId` already reaches `combatTargetForAnimal().applyDamage` (melee and NPC projectiles) and is discarded there. An NPC target lock already exists (`resolveNpcTarget` / `npcTarget`). The two human-intent paths use `Math.random()` for new encounter/provocation decisions.
- Speeds: player walk `PLAYER_WALK_SPEED = 6` m/s (open author question Q81-a), sprint ×1.8 = 10.8; predator sprint wolf 6.5, alpha ≈6.8, bear 6.0 (boar 6.4, prey). A walking player out-paces a bear and a wolf closes at ≈0.5 m/s; nothing catches a sprinting player.
- Encounter state (`provokedTimer`, intent commitments, `npcTarget`) is **not** in `AnimalSaveState`; wild animals persist only as habitat-slot occupants (`persistentOccupants.ts`).
- Spatial separation: player outgoing hits are already spatial-context filtered (world-027); animal bites (`chaseHuman`, `gameLoop.ts` `onHumanHit` callback) are XZ-only. Cave/surface **perception** is owned by `fauna-045` (planned).
- `src/fauna/animalDefs.ts`, `animalVariants.ts`, `animalUpdateCadence.ts`, `faunaCombat.ts`: species traits, alpha/dangerous modifiers, high-priority full-rate updates, bite damage and current speed. Near-player combat should not be throttled.
- `src/combat/incomingHumanHit.ts` and current player/NPC damage pipeline own human protection, hit profiles, physical injuries and typed armor; never bypass them.

## Scope and implementation slices

### A — Chase and contact correctness (first)

1. Reuse the existing fauna `chaseNav` / `stepNavRescue` stuck detection and bounded local A* for **player and NPC** pursuit; preserve the existing prey-hunt path. Explicitly reset/retarget navigation state when a chase terminates, the target changes, combat is interrupted, or a different movement intent takes over. Avoid persistent stuck loops and pathfinding every frame.
2. Measure and report actual closure, chase Stamina and bite cooldown against a standing, fighting, walking and sprinting player, without granting teleportation or unconditional hits. **Do not change player movement speed here** (Q81-a). Author Q-C1 (2026-11-05): **(a)** keep speeds and measure pursuit; **(a+b)** is also allowed — a short predator sprint burst as species data, decided only in §C from measurements. Bite contact follows the contract owned by items-player-067 (default centre-to-centre; a human-bite change gets its own human-target constant, never via shared `CONTACT_RANGE`); retain species differences and the unchanged player lunge.
3. At attack time only, require the bite target to share the predator's spatial context, reusing the existing world spatial-context resolver; height/bridge separation is optional and uses existing world queries. Do not change perception (owned by `fauna-045`; if it lands first, reuse its composition). No per-frame raycasts or extra global scans.
4. Preserve wolf-vs-prey, predator-vs-NPC, dog guarding and cave traversal; be conservative when modifying shared `CONTACT_RANGE` because it also governs animal-on-animal contact.

### B — Aggressor identity and deterministic decisions

1. Preserve human **attacker identity** through the actual incoming hit entry point: thread the existing `CombatTargetHit.attackerId` (and `'player'`) into `takeDamage`, not merely `source:'npc'`. Feed the live aggressor into the existing `npcTarget` lock preferentially for retaliation — no new lock/registry, no targeting an unrelated bystander. Maintain target validity when NPC unloads/dies, moves into a different spatial context or the player becomes a stronger immediate threat.
2. Correct the arbitration where `player-ignore` masks active NPC threat, frenzied NPC attack, fire avoidance and scare/guard branches. Express it in `isBehaviourValid` (live NPC aggression / frenzy / fire context), keeping distinct player/NPC awareness and stable intent commitments. Do not simply reverse the entire priority table.
3. Replace `Math.random()` in predator-human aggression selection with a keyed roll over (`animalId`, target key, per-agent in-memory encounter ordinal), reusing the `combat/criticalHit.ts::criticalRoll` hash pattern — no shared mutable global RNG, no per-frame redraws. Encounter state stays **transient** (8 s provocation window; same precedent as the player's unsaved crit attempt counter): it resets on hydrate/rebuild/streaming and that reset is tested and documented. No save-format change; persisting it would be a separate author question.
4. Check high-priority full-rate cadence and avoid new costly per-frame spatial scans. Add focused diagnostics only where needed to confirm selected target, decision reason, navigation fallback and actual contact.

### C — Calibrate natural retaliation and retreat

1. Re-examine injured wolf/bear fleeing below 40% HP, 75% eligible retaliation probability and 2 s hold in **measured** isolated encounters (starting knife, other weapon families, moving/retreating human, nearby NPCs and fires). Change values only when test/playtest evidence supports a clear gain.
   Optional per Q-C1 (a+b): if the §A2 closure measurements show predators can never land a bite on a retreating human, propose a bounded, Stamina-limited sprint burst as per-species data in `animalDefs` (no new movement system, no change to player speed or the lunge); record before/after evidence and keep it revertable.
2. Preserve meaningful retreat for heavily injured animals and distinct wolf/bear/fox temperament. Territory, hunger, pack composition, alpha/dangerous variants, crowd and fire should remain relevant. Tactical pack coordination is **not** automatically in scope.
3. Do not make predators universally hostile, attack through obstacles, ignore exhaustion, or chase endlessly. Maintain predictable offscreen/streaming semantics and avoid inventing new offscreen fights.

## Boundaries and integration

- Fauna owns decisions, pursuit, aggression identity and bite eligibility. Items-player-067 owns weapon parameters, melee acquisition, outgoing weapon hit semantics **and the written contact contract** (in its implementation notes); read it before editing any shared consumer; avoid duplicate distance/collider implementations. §C calibration runs after 067 §A and this plan's §A.
- `fauna-045` owns cave/surface perception; this plan only adds the attack-time same-context bite check.
- Reuse existing `AnimalAgent`, `HealthState`, fauna nav rescue, decision scoring and commitment; no parallel `PredatorCombatManager`, bespoke pathfinder or rewrite of wildlife AI.
- No new pack formation framework, difficulty-tier system (`fauna-049` owns that), ecosystem spawn changes, combat UI, new save format without migration review, or human-target player combat.
- Preserve player/NPC/fauna identity across reconstruction, persistence and streaming; do not promise full offscreen encounter simulation absent existing support.
- Balance choices remain bounded and reversible, with author review of major temperament or difficulty changes.

## Verification / acceptance

1. Automated cases: provoked wolf chooses correct living attacker; NPC initiates attack with player nearby; `player-ignore` does not mask NPC retaliation, frenzied NPC attack or fire avoidance; target death/unload and reacquisition behave correctly.
2. A chasing wolf/NPC-path predator routes around a representative obstacle via existing nav rescue, exits stuck states, does not run endless A*, and stops/reclaims nav correctly after fleeing or changing target.
3. Repeated simulation with the same actor/target identity and event order yields the same decisions; provocation rerolls are keyed by the encounter ordinal; hydrate/rebuild/streaming resets encounter state deterministically (documented transient state, no save change).
4. Melee contact tests with items-player-067 verify bite vs player weapon reach, moving targets, obstacle separation, height/bridge/cave separation and lack of ghost hits. No unconditional bite for proximity alone.
5. Regression tests cover wolf, alpha wolf, bear, fox, dog guard, fauna-vs-fauna predation, NPCs, fires, crowds, hunger, den defense, cooldown and Stamina exhaustion.
6. Controlled playtests (standing, fighting, walking and sprinting player) compare old/new closure rate, time-to-first-bite, actual landed bites, player HP lost, predator fleeing, pursuit success and TTK, with a repeatable seed and equipment. Clearly distinguish modeled probabilities from observed statistics.
7. No regression to high-priority fauna cadence, streamed identity, performance or save compatibility; report measured evidence separately from source-level review.
8. Add JSDoc with `@domain fauna` for new public decision, aggro-target or contact helpers.

## Implementation handoff

Start with target/nav correctness and deterministic contract tests; adjust reach and retreat numbers only after shared weapon/predator contact tests and measured scenarios. Recheck current source and [items-player-067](./items-player-067-melee-weapon-reach-and-damage-balance.md) at implementation time. Maintain [implementation notes](./implementation-notes/fauna-051-predator-human-encounter-correctness-implementation-notes.md) under `PLANNING.md`. No runtime changes or test pass is claimed by this plan.
