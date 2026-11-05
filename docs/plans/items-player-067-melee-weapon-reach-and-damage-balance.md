# Plan: Melee weapon reach and damage balance

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** L
**Depends on:** -
**Domain:** `items-player`
**Subdomains:** `items` `tools` `interaction`
**Tags:** `combat` `balance` `v1-revival` `regression`
**Model:** Sonnet, Opus
**Roadmap:** -

## Goal

Make all 34 currently configured player melee weapons and tools internally consistent, with credible reach and progression from improvised tools to dedicated weapons. Fix confirmed integration defects without deleting V1's fast action combat or its deliberate automatic lunge. Coordinate attack-contact semantics with [fauna-051](./fauna-051-predator-human-encounter-correctness.md), which owns predator reach, pursuit and retaliation.

The 2026-11-05 static weapon audit found a starting knife (12 damage, 1.6 m reach, 0.38 s base cycle, 4 Stamina) able to kill an ordinary 50-HP wolf in roughly four unobstructed hits. These are candidate balance findings, **not** measured player-vs-wolf TTK. No final numeric retuning is authorized by this plan alone: tune using scenario evidence and review the intended progression before accepting data changes.

## Verified current contracts and surfaces

- `src/items/itemCatalog.ts`: `ITEM_CATALOG[kind].melee` is the sole per-weapon source for damage, `range`, `arcDot`, `windUp`, `hitWindow`, `recovery` and `staminaCost`. Inventory/maintenance and exceptional kinds reuse the catalog.
- `src/player/playerMelee.ts`: attack lifecycle, Agility recovery, Stamina/Vigor, target acquisition, attack-direction lock and **approved** automatic gap close. `MAX_LUNGE_DISTANCE = 3`, `LUNGE_STAMINA_COST = 15`, `FALLBACK_APPROACH_DISTANCE = 1`; these are preservation requirements, **not tuning targets**.
- `src/combat/meleeAttack.ts::resolveMeleeHits`: XZ distance + arc predicate, one hit per target per swing; currently returns *every* candidate in the cone.
- `src/app/gameLoop.ts`: acquisition may consider targets farther than the ordinary `interactables` list used for hit resolution; investigate the reported 7 m acquisition / 5 m candidate mismatch at the post-lunge hit boundary.
- `src/combat/meleeStrength.ts`, `criticalHit.ts`, `meleeAgility.ts`, `src/items/weaponMaintenance.ts`: existing effective damage/cadence modifiers; `src/ai/npcCombat.ts` also consumes weapon parameters.
- `src/fauna/faunaCombat.ts` and `src/fauna/AnimalAgent.ts`: ordinary wolf 50 HP and animal bite distance currently 0.8 m. Species combat reach/response belongs to fauna-051.

## Scope and implementation slices

### A — Reach and hit-contract audit (correctness first)

1. Enumerate **all** live `melee` catalog entries (including simple tools, material variants and exceptional items). Compare reach to intended attack class, model scale, attack animation, target dimensions, attack arc and animal contact; document uncertainty where actual GLB/animation bounds have not been visually inspected. Do not claim mesh-accurate reach based on `modelUrl` alone.
2. Choose and document a shared, lightweight reach/contact convention with fauna-051 **before either plan changes the shared hit predicate**. Prefer a bounded horizontal surface/size-aware rule over global speculative range inflation. Vertical/occlusion validation should use existing `WorldSpatialContext`/world query facilities when appropriate; do not add per-frame raycasting or new physics.
3. Fix the acquisition-to-hit mismatch: a valid acquired target reached by collision-resolved lunge must be evaluated from its *current* authoritative position at impact; no bypass of distance/arc checks and no stale 5 m candidate limit. Add the exact 5–7 m and post-lunge regression cases.
4. Define deliberate weapon hit cardinality: piercing/thrust tools (knife, dagger, spear and analogous items) must not apply full damage to every target in the cone by accident; keep explicit area-swing behavior only for weapons where supported by design. Preserve one damage event per eligible target per attack and avoid target flicker.

### B — Catalog balancing

1. Produce a reproducible table for all 34 configurations: base and start-character effective damage, attack cycle, theoretical sustained DPS, Stamina efficiency, effective reach, critical/Strength/Agility/sharpness effects and armor channel. Compare knife/sickle/shears/pitchfork/hatchet/axe/shovel against dedicated military weapons, then ordinary against exceptional tiers.
2. Retune only demonstrated outliers with small, explainable catalog changes; keep each weapon family distinct (reach, burst, cadence, efficiency, cut/pierce/blunt and defensive utility). Do not solve all issues by boosting animal HP or indiscriminately nerfing knives. Validate whether heavy weapons' tradeoffs remain meaningful with typed layered armor rather than inventing a parallel armor model.
3. Keep rare upper-tier weapon identities and existing source/acquisition constraints. Cross-check with `items-player-062`, `items-player-064`, `items-player-065` and `items-player-066` before adjusting catalog rows that those initiatives own.

### C — Scenario calibration and close-out

Measure controlled repeatable knife/sickle/short sword/long sword/spear/axe interactions against ordinary wolf, alpha wolf, boar and bear with starting attributes, Stamina drain, criticals, sharpness wear and target motion. Repeat after fauna-051's pursuit/contact fixes; record actual hit count, time to kill, successful bites and player damage separately from idealized DPS. Present a before/after comparison and request author judgment on material gameplay tuning.

## Boundaries and dependencies

- **Lunge must remain** (up to 3 m, current costs and movement/steering behavior); only genuine integration bugs at its hit boundary may be repaired. No removal, cooldown redesign or speculative lunge nerf.
- No new combat engine, weapon slot, player-vs-human attack authorization, animation system, weapon durability feature or physics overhaul.
- Respect V1-owned `HealthState`, existing damage/critical/maintenance pipeline and seven-zone layered-armor release; do not introduce a second damage authority.
- The two plans are parallel workstreams with a **joint contact-contract decision**. No hard plan dependency is assumed, but edits to shared hit geometry must be coordinated; predator-only tuning stays with fauna-051.
- All catalog changes affecting NPC weapon choices/behavior must be regression-tested; keep weapon source eligibility and player starting inventory intact.
- If audit evidence does not justify an exact parameter or desired weapon specialization, document the tradeoff for author selection rather than silently choosing an irreversible balance direction.

## Verification / acceptance

1. Automated full-catalog check covers every melee entry, bounds values, computes comparable DPS/efficiency and flags unintended family inversions without hardcoding one target tuning as a universal invariant.
2. `playerMelee.test.ts`, `meleeAttack.test.ts`, `itemCatalog.test.ts`, NPC combat and weapon maintenance tests cover range/arc, timing, single hit per target, multi-target policy, snapshot/sharpness, Agility, Strength, Stamina and lunge preservation.
3. Acquisition 5–7 m + collision-resolved lunge + moving target at impact cannot silently disappear from candidate resolution or hit outside legal final reach.
4. Shared player/animal spatial-contact contract is tested with fauna-051, including normal close melee, elevation mismatch, thin obstacles, cave entrances and distinct target sizes as applicable; do not silently break NPC hunting.
5. Scenario traces show weapon hierarchy, TTK, bite frequency, Stamina/condition impact and no regressions for NPC weapon choice or animal kills. Runtime/playtest verification is explicit and separate from static/unit evidence.
6. Document old/new catalog numbers, source evidence, remaining subjective tuning decisions and manual browser test results.
7. Add JSDoc with `@domain items-player` (or actual owning domain) on new public hit/reach helpers.

## Implementation handoff

Implement correctness and tests first, catalog changes second, combined encounters last. Recheck the current branch and [fauna-051](./fauna-051-predator-human-encounter-correctness.md) before touching shared interfaces; prepare/maintain [implementation notes](./implementation-notes/items-player-067-melee-weapon-reach-and-damage-balance-implementation-notes.md) per `PLANNING.md`. This plan does not assert build, test or runtime verification.
