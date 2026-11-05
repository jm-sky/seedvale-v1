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

## Verified current contracts and surfaces

- `src/fauna/AnimalAgent.ts::chaseHuman/chaseNpc` currently steer directly toward people; predator-vs-prey `updatePredator` uses `stepNavRescue(this.chaseNav, ...)`. `attackHuman/attackNpc` use a common 0.8 m XZ contact threshold and 0.6 s cooldown.
- `src/fauna/predatorHumanDecision.ts`: wolf/bear special provoked retaliation roll (0.75 when eligible), low-HP flee threshold (0.4), fire/crowd suppression, species/hunger/territoriality scoring; fox intentionally remains more cautious.
- `src/fauna/predatorIntentCommitment.ts`: 2-second encounter-local decision commitment and forced re-evaluation after a hit; preserve the intended no-per-frame-thrashing property.
- `src/fauna/faunaDecision.ts`: player branches priority 90 vs NPC branches 60; `player-ignore` can win even when an NPC is an active attacker.
- `AnimalAgent.takeDamage(damage, source?: 'player'|'npc')` lacks a stable NPC aggressor identity; the two human-intent paths use `Math.random()` for new encounter/provocation decisions.
- `src/fauna/animalDefs.ts`, `animalVariants.ts`, `animalUpdateCadence.ts`, `faunaCombat.ts`: species traits, alpha/dangerous modifiers, high-priority full-rate updates, bite damage and current speed. Near-player combat should not be throttled.
- `src/combat/incomingHumanHit.ts` and current player/NPC damage pipeline own human protection, hit profiles, physical injuries and typed armor; never bypass them.

## Scope and implementation slices

### A — Chase and contact correctness (first)

1. Reuse the existing fauna `chaseNav` / `stepNavRescue` stuck detection and bounded local A* for **player and NPC** pursuit; preserve the existing prey-hunt path. Explicitly reset/retarget navigation state when a chase terminates, the target changes, combat is interrupted, or a different movement intent takes over. Avoid persistent stuck loops and pathfinding every frame.
2. Make reaching a moving human credible: evaluate actual closure, chase Stamina and bite cooldown without granting teleportation or unconditional hits. Coordinate the contact distance definition with items-player-067 (center-to-center vs target surface, model size, horizontal/vertical occupancy); retain species differences and existing player-lunge behavior.
3. Validate bite impact against compatible spatial context, height and obstacle separation; avoid XZ-only hits across floors/walls/caves. Reuse existing world/cave queries and authoritative actor positions; do not add heavy per-frame raycasts. Use an event/attack-time test, not extra global scans.
4. Preserve wolf-vs-prey, predator-vs-NPC, dog guarding and cave traversal; be conservative when modifying shared `CONTACT_RANGE` because it also governs animal-on-animal contact.

### B — Aggressor identity and deterministic decisions

1. Preserve human **attacker identity** through the actual incoming hit entry point: player or stable NPC id, not merely `source:'npc'`. Select an eligible live aggressor preferentially for retaliation, without creating a stale hard lock or targeting an unrelated bystander. Maintain target validity when NPC unloads/dies, moves into a different spatial context or the player becomes a stronger immediate threat.
2. Correct the arbitration where `player-ignore` masks active NPC threat. Keep distinct player/NPC awareness and stable intent commitments, with clear precedence for provocation vs environmental fear. Do not simply reverse the entire priority table.
3. Replace `Math.random()` in predator-human aggression selection with a reproducible, actor/target/encounter-event keyed roll. Define the authoritative event ordinal and its persistence/lifecycle obligations deliberately: same seed, identities and meaningful event sequence must reproduce decisions across rebuild/streaming and relevant save/load; avoid a shared mutable global RNG or independent per-frame redraws.
4. Check high-priority full-rate cadence and avoid new costly per-frame spatial scans. Add focused diagnostics only where needed to confirm selected target, decision reason, navigation fallback and actual contact.

### C — Calibrate natural retaliation and retreat

1. Re-examine injured wolf/bear fleeing below 40% HP, 75% eligible retaliation probability and 2 s hold in **measured** isolated encounters (starting knife, other weapon families, moving/retreating human, nearby NPCs and fires). Change values only when test/playtest evidence supports a clear gain.
2. Preserve meaningful retreat for heavily injured animals and distinct wolf/bear/fox temperament. Territory, hunger, pack composition, alpha/dangerous variants, crowd and fire should remain relevant. Tactical pack coordination is **not** automatically in scope.
3. Do not make predators universally hostile, attack through obstacles, ignore exhaustion, or chase endlessly. Maintain predictable offscreen/streaming semantics and avoid inventing new offscreen fights.

## Boundaries and integration

- Fauna owns decisions, pursuit, aggression identity and bite eligibility. Items-player-067 owns weapon parameters, melee acquisition and outgoing weapon hit semantics. **Agree on one contact convention before editing shared consumers**; avoid duplicate distance/collider implementations.
- Reuse existing `AnimalAgent`, `HealthState`, fauna nav rescue, decision scoring and commitment; no parallel `PredatorCombatManager`, bespoke pathfinder or rewrite of wildlife AI.
- No new pack formation framework, difficulty-tier system (`fauna-049` owns that), ecosystem spawn changes, combat UI, new save format without migration review, or human-target player combat.
- Preserve player/NPC/fauna identity across reconstruction, persistence and streaming; do not promise full offscreen encounter simulation absent existing support.
- Balance choices remain bounded and reversible, with author review of major temperament or difficulty changes.

## Verification / acceptance

1. Automated cases: provoked wolf chooses correct living attacker; NPC initiates attack with player nearby; `player-ignore` does not mask NPC retaliation; target death/unload and reacquisition behave correctly.
2. A chasing wolf/NPC-path predator routes around a representative obstacle via existing nav rescue, exits stuck states, does not run endless A*, and stops/reclaims nav correctly after fleeing or changing target.
3. Repeated simulation with same world seed, actor/target identity and same event order yields the same decisions; test provocation rerolls, save/reload and streaming/rebuild where that identity must survive.
4. Melee contact tests with items-player-067 verify bite vs player weapon reach, moving targets, obstacle separation, height/bridge/cave separation and lack of ghost hits. No unconditional bite for proximity alone.
5. Regression tests cover wolf, alpha wolf, bear, fox, dog guard, fauna-vs-fauna predation, NPCs, fires, crowds, hunger, den defense, cooldown and Stamina exhaustion.
6. Controlled playtests compare old/new time-to-first-bite, actual landed bites, player HP lost, predator fleeing, pursuit success and TTK, with a repeatable seed and equipment. Clearly distinguish modeled probabilities from observed statistics.
7. No regression to high-priority fauna cadence, streamed identity, performance or save compatibility; report measured evidence separately from source-level review.
8. Add JSDoc with `@domain fauna` for new public decision, aggro-target or contact helpers.

## Implementation handoff

Start with target/nav correctness and deterministic contract tests; adjust reach and retreat numbers only after shared weapon/predator contact tests and measured scenarios. Recheck current source and [items-player-067](./items-player-067-melee-weapon-reach-and-damage-balance.md) at implementation time. Maintain [implementation notes](./implementation-notes/fauna-051-predator-human-encounter-correctness-implementation-notes.md) under `PLANNING.md`. No runtime changes or test pass is claimed by this plan.
