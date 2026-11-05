# Plan: Melee weapon reach and damage balance

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** L
**Depends on:** -
**Domain:** `items-player`
**Subdomains:** `items` `tools` `interaction`
**Tags:** `combat` `balance` `v1-revival` `regression`
**Model:** Sonnet, Composer
**Roadmap:** -

## Goal

Make all 34 currently configured player melee weapons and tools internally consistent, with credible reach and progression from improvised tools to dedicated weapons. Fix confirmed integration defects without deleting V1's fast action combat or its deliberate automatic lunge. Coordinate attack-contact semantics with [fauna-051](./fauna-051-predator-human-encounter-correctness.md), which owns predator reach, pursuit and retaliation.

The 2026-11-05 static weapon audit found a starting knife (12 damage, 1.6 m reach, 0.38 s base cycle, 4 Stamina) able to kill an ordinary 50-HP wolf in roughly four unobstructed hits. These are candidate balance findings, **not** measured player-vs-wolf TTK. No final numeric retuning is authorized by this plan alone: tune using scenario evidence and review the intended progression before accepting data changes.

Pre-implementation [review 034](../reviews/2026-11-05--034--items-player-067-fauna-051-combat-plans-review.md) (2026-11-05, static) corrected this plan: the suspected stale-candidate defect is not confirmed, the contact contract is owned here, and catalog retuning is bounded by the V1 envelope anchors. Author answers 2026-11-05: Q-C2 **(a)** — acquisition range and lunge unchanged, the stationary out-of-reach whiff is accepted current behavior; Q-C3 **(a)** — the five V1 anchors stay, only outliers are retuned.

## Verified current contracts and surfaces

- `src/items/itemCatalog.ts`: `ITEM_CATALOG[kind].melee` is the sole per-weapon source for damage, `range`, `arcDot`, `windUp`, `hitWindow`, `recovery` and `staminaCost`. Inventory/maintenance and exceptional kinds reuse the catalog.
- `src/player/playerMelee.ts`: attack lifecycle, Agility recovery, Stamina/Vigor, target acquisition, attack-direction lock and **approved** automatic gap close. `MAX_LUNGE_DISTANCE = 3`, `LUNGE_STAMINA_COST = 15`, `FALLBACK_APPROACH_DISTANCE = 1`; these are preservation requirements, **not tuning targets**.
- `src/combat/meleeAttack.ts::resolveMeleeHits`: XZ distance + arc predicate, one hit per target per swing; currently returns *every* candidate in the cone.
- `src/app/gameLoop.ts`: `meleeCandidates` is rebuilt **every frame** from spatial-context-filtered `interactables` (`GAZE_RANGE` 5 m) around the player's *current* (post-lunge) position; the lunge happens in the request frame, the hit ≥ one wind-up later. A legally hittable target (≤ `range` ≤ 3.2 m) is therefore always a candidate — the originally suspected "stale 5 m candidate" defect is **not confirmed by code** (review 034 P1-1). Real seams: (a) acquisition `COMBAT_TARGET_RANGE` 7 m exceeds the farthest reachable start distance `range + 2.9` (knife 4.5 m, halberd 6.1 m), so an attack + lunge can start and whiff against a stationary target — lunge-adjacent; author Q-C2 **(a)**: accepted, not to be changed; (b) `attackYaw` is locked at request while positions are read at impact (0.10–0.38 s later).
- `src/combat/meleeStrength.ts`, `criticalHit.ts`, `meleeAgility.ts`, `src/items/weaponMaintenance.ts`: existing effective damage/cadence modifiers; `src/ai/npcCombat.ts` (`resolveNpcMeleeWeapon` ranks by catalog damage × sharpness) and `src/ai/NpcAgent.ts` (approach gates `dist <= melee.range`, single-candidate `resolveMeleeHits`) also consume weapon parameters; UI stat rows show `range` against fixed ceilings.
- V1 envelope anchors (combat proposal §6.1, items-player-062): knife 12/1.6/4, short sword 18/2.1/7, long sword 28/2.6/12, spear 20/3/9, axe 20/2/10 — all Stage 4 profiles and the A8 tier rule were authored relative to them.
- `src/fauna/faunaCombat.ts` and `src/fauna/AnimalAgent.ts`: ordinary wolf 50 HP and animal bite distance currently 0.8 m. Species combat reach/response belongs to fauna-051.

## Scope and implementation slices

### A — Reach and hit-contract audit (correctness first)

1. Enumerate **all** live `melee` catalog entries (including simple tools, material variants and exceptional items). Compare reach to intended attack class, model scale, attack animation, target dimensions, attack arc and animal contact; document uncertainty where actual GLB/animation bounds have not been visually inspected. Do not claim mesh-accurate reach based on `modelUrl` alone.
2. **Contact contract — owned by this plan**, written into this plan's implementation notes *before* either plan edits a shared consumer (fauna-051 consumes it). Default, from current code: `MeleeConfig.range` keeps its **centre-to-centre XZ** meaning (player hit, NPC approach gate, NPC hit and UI all read it that way). Size awareness, only if §C evidence shows misses against large animals: an optional `radius` on `MeleeHitCandidate` (default `0`, effective reach `range + radius`) fed by **one** per-species data field in `animalDefs` (none exists today; only `modelHeight`), and NPC approach gates use the same helper as the hit. No global range inflation. Spatial separation: player outgoing hits are already spatial-context filtered (world-027); do not add per-frame raycasting or new physics.
3. **Acquisition/impact boundary — verify, fix only reproduced defects.** Add regression cases: target at 4–7 m with collision-resolved lunge (stationary and moving), target leaving the locked arc during wind-up, target in a different spatial context. Do **not** change `COMBAT_TARGET_RANGE`, attack start gating or lunge behavior to "fix" the stationary whiff (a) — author Q-C2 (a): accepted current behavior. A moving-target fix (b) must preserve "one attack, one yaw" (items-player-011) or be put to the author.
4. Define deliberate weapon hit cardinality: piercing/thrust tools (knife, dagger, spear and analogous items) must not apply full damage to every target in the cone by accident; keep explicit area-swing behavior only for weapons where supported by design. Preserve one damage event per eligible target per attack and avoid target flicker. Cover collateral hits on owned livestock/dogs (they are melee candidates today). NPC melee already resolves a single candidate and is unaffected.

### B — Catalog balancing

1. Produce a reproducible table for all 34 configurations: base and start-character effective damage, attack cycle, theoretical sustained DPS, Stamina efficiency, effective reach, critical/Strength/Agility/sharpness effects and armor channel. Compare knife/sickle/shears/pitchfork/hatchet/axe/shovel against dedicated military weapons, then ordinary against exceptional tiers.
2. Retune only demonstrated outliers with small, explainable catalog changes, **keeping the five V1 envelope anchors and every profile's position relative to them** (author Q-C3 (a): anchors are not changed); keep each weapon family distinct (reach, burst, cadence, efficiency, cut/pierce/blunt and defensive utility). Do not solve all issues by boosting animal HP or indiscriminately nerfing knives. Validate whether heavy weapons' tradeoffs remain meaningful with typed layered armor rather than inventing a parallel armor model.
3. Keep rare upper-tier weapon identities, the A8 tier rule and existing source/acquisition constraints. Cross-check with `items-player-062`, `items-player-064`, `items-player-065`, `items-player-066` and `npc-067` before adjusting catalog rows that those initiatives own. Do not land catalog numbers during `items-player-066` slice C's armor playtest (proposal §6.1 keeps base weapon damage fixed while armor is calibrated); sequence with it.
4. **Opus review gate** (Strategic Brief: Opus owns balancing and integration design) before catalog retuning or the contact contract lands.

### C — Scenario calibration and close-out

Measure controlled repeatable knife/sickle/short sword/long sword/spear/axe interactions against ordinary wolf, alpha wolf, boar (`role: 'prey'` — TTK/flight only, no retaliation path) and bear with starting attributes, Stamina drain, criticals, sharpness wear and target motion. Repeat after fauna-051's pursuit/contact fixes; record actual hit count, time to kill, successful bites and player damage separately from idealized DPS. Present a before/after comparison and request author judgment on material gameplay tuning.

## Boundaries and dependencies

- **Lunge must remain unchanged** (author, 2026-11-05): `MAX_LUNGE_DISTANCE`, `LUNGE_STAMINA_COST`, `FALLBACK_APPROACH_DISTANCE`, `GAP_CLOSE_BUFFER`, trigger condition (`dist > range`), request-time application via `gapClose()`. Only genuine hit-resolution bugs after it may be repaired. No removal, cooldown redesign, nerf, or indirect change through acquisition range.
- No new combat engine, weapon slot, player-vs-human attack authorization, animation system, weapon durability feature or physics overhaul.
- Respect V1-owned `HealthState`, existing damage/critical/maintenance pipeline and seven-zone layered-armor release; do not introduce a second damage authority.
- The two plans are parallel workstreams. This plan **owns the contact contract** (§A2); fauna-051 consumes it for bites and calibrates predators only after this plan's §A and its own §A. Predator-only tuning stays with fauna-051.
- All catalog changes affecting NPC weapon choices/behavior must be regression-tested; keep weapon source eligibility and player starting inventory intact.
- If audit evidence does not justify an exact parameter or desired weapon specialization, document the tradeoff for author selection rather than silently choosing an irreversible balance direction.

## Verification / acceptance

1. Automated full-catalog check covers every melee entry, bounds values, computes comparable DPS/efficiency and flags unintended family inversions without hardcoding one target tuning as a universal invariant.
2. `playerMelee.test.ts`, `meleeAttack.test.ts`, `itemCatalog.test.ts`, NPC combat and weapon maintenance tests cover range/arc, timing, single hit per target, multi-target policy, snapshot/sharpness, Agility, Strength, Stamina and lunge preservation.
3. Acquisition 4–7 m + collision-resolved lunge (stationary and moving target) is covered: a reachable target is always a candidate at impact, nothing hits outside legal final reach, and the stationary out-of-reach whiff is documented as accepted current behavior (Q-C2 (a); lunge untouched).
4. Shared player/animal spatial-contact contract is tested with fauna-051, including normal close melee, elevation mismatch, thin obstacles, cave entrances and distinct target sizes as applicable; do not silently break NPC hunting.
5. Scenario traces show weapon hierarchy, TTK, bite frequency, Stamina/condition impact and no regressions for NPC weapon choice or animal kills. Runtime/playtest verification is explicit and separate from static/unit evidence.
6. Document old/new catalog numbers, source evidence, remaining subjective tuning decisions and manual browser test results.
7. Add JSDoc with `@domain items-player` (or actual owning domain) on new public hit/reach helpers; update the stale "range currently <=2.6" comment at the `gameLoop.ts` melee tick.

## Implementation handoff

Implement correctness and tests first, catalog changes second, combined encounters last. Recheck the current branch and [fauna-051](./fauna-051-predator-human-encounter-correctness.md) before touching shared interfaces; prepare/maintain [implementation notes](./implementation-notes/items-player-067-melee-weapon-reach-and-damage-balance-implementation-notes.md) per `PLANNING.md`. This plan does not assert build, test or runtime verification.
