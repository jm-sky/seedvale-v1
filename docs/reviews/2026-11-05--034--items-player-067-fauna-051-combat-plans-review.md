# Review 034 — items-player-067 + fauna-051 pre-implementation plan review

**Date:** 2026-11-05
**Scope:** [items-player-067](../plans/items-player-067-melee-weapon-reach-and-damage-balance.md) + [notes](../plans/implementation-notes/items-player-067-melee-weapon-reach-and-damage-balance-implementation-notes.md); [fauna-051](../plans/fauna-051-predator-human-encounter-correctness.md) + [notes](../plans/implementation-notes/fauna-051-predator-human-encounter-correctness-implementation-notes.md). Checked against current `main` source, related plans (items-player-062/064/066, npc-067, fauna-045, fauna-049), the [combat/armor proposal](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md) and the [Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md).
**Method:** static source reading only. No build, test, browser or performance run. Nothing here is runtime evidence.
**Author constraint (2026-11-05):** the player lunge stays unchanged (`MAX_LUNGE_DISTANCE = 3`, `LUNGE_STAMINA_COST = 15`, `FALLBACK_APPROACH_DISTANCE = 1`, `GAP_CLOSE_BUFFER = 0.1`, applied at attack request through `player.gapClose()`).

**Verdict:** both plans may proceed **after the corrections below** (applied in this commit). Each had one false premise or unscoped premise that would have sent the implementer after the wrong fix. Three author questions are recorded in the queue §3 (Q-C1–Q-C3).

## Verified claims (correct)

- 34 `melee` configs in `ITEM_CATALOG`. Knife is `pierce 12 / 1.6 m / arc 0.6 / 0.12+0.08+0.18 s / 4 St`. With the start character's Strength 0.6 (×1.06) a knife hit does 12.72 damage, so it takes 4 hits to kill a 50 HP wolf. The plan's figure is correct.
- Lunge constants and their call order: drain, then lunge, then `lifecycle.start`. `resolveMeleeHits` checks XZ range plus arc and returns every candidate that passes.
- The `GAZE_RANGE = 5` / `COMBAT_TARGET_RANGE = 7` constants.
- `takeDamage(damage, source?)` has no attacker identity. `chaseHuman` and `chaseNpc` steer straight at the target, while prey pursuit uses `stepNavRescue(this.chaseNav)`.
- `CONTACT_RANGE 0.8`, `ATTACK_COOLDOWN 0.6`, `RETALIATION_ATTACK_CHANCE 0.75`, `PROVOKED_FLEE_HP_RATIO 0.4`, `PROVOCATION_SECONDS 8`, `PREDATOR_INTENT_COMMIT_SEC 2`.
- Human-intent rolls use `Math.random()` in both refresh paths. Priorities are `player-ignore` 90 vs `npc-attack` 60. Full-rate update radius is 12 m.
- Line references in both notes are within a few lines of the current code.

## Findings

### P1-1 (067 §A3) — the "stale 5 m candidate" defect does not exist as described

`meleeCandidates` is rebuilt **every frame** from `interactables` (`gameLoop.ts` ≈1365). That list is filtered by spatial context (`filterInteractablesSameSpatialContext`) and centred on the player's current position, i.e. after the lunge. The hit fires at least one wind-up after the request, and the lunge already happened in the request frame. A target the weapon can legally hit is at most `range` ≤ 3.2 m away, which is always inside the 5 m candidate radius. So there is no mismatch between candidates and hits for any reachable target.

The real seams are elsewhere:

- **(a) Reachable distance vs acquisition range.** The farthest start distance a lunge can still turn into a hit is `range + 2.9`. That is 4.5 m for the knife and 6.1 m for the halberd. Acquisition goes out to 7 m. Against a stationary target between those distances, the attack still starts, the player pays 4+15 Stamina and the lunge, and the swing misses. This is behaviour next to the lunge, not a candidate bug. Because the author froze the lunge, it is **author question Q-C2** and must not be fixed silently.
- **(b) Yaw locked at request, positions read at impact.** `attackYaw` is computed at the request. Target positions are read at impact, 0.10–0.38 s later. A wolf sprinting at 6.5 m/s moves up to ≈2.5 m in that window, enough to leave the arc or the range. This is the post-lunge moving-target case worth testing. Any fix must keep "one attack, one yaw" (items-player-011), or the author must explicitly accept a change.

**Applied:** §A3 now says "verify with regression tests and fix only reproduced defects". It names (a) as Q-C2 and (b) as the case to test. It forbids changing `COMBAT_TARGET_RANGE` or the lunge without the author.

### P1-2 (051 §A2) — player speed makes "credible pursuit" impossible to fix with navigation alone

Player walk is 6 m/s (`PLAYER_WALK_SPEED`, still open as **Q81-a**) and sprint is ×1.8 = 10.8 m/s. Predator sprint speeds: wolf 6.5, alpha ≈6.8, bear 6.0, boar 6.4. A walking player outruns a bear. A wolf closes on a walking player at ≈0.5 m/s. No predator can catch a sprinting player. The plan's goal "reach a moving human" therefore depends on a speed decision (Q81-a or species data) that fauna-051 does not own.

**Applied:** §A2 now measures closure and reports it. It does not change player speed. Predator speed changes go to **Q-C1**, and §C stays measurement-gated.

### P1-3 (067 §B) — catalog retuning collides with the agreed V1 envelope and armor calibration

The [combat proposal §6.1](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md) and [items-player-062](../plans/items-player-062-stage-4-weapon-ammunition-and-shield-intake.md) fix five anchors:

| Weapon | Damage | Range (m) | Stamina |
|---|---|---|---|
| knife | 12 | 1.6 | 4 |
| short sword | 18 | 2.1 | 7 |
| long sword | 28 | 2.6 | 12 |
| spear | 20 | 3.0 | 9 |
| axe | 20 | 2.0 | 10 |

All 17 Stage 4 profiles (062) and the A8 tier rule were authored relative to these anchors. §6.1 also says base damage and timing stay unchanged so that armor can be evaluated on its own. [items-player-066](../plans/items-player-066-layered-armor-catalogue-acquisition-and-balance.md) slice C (balance closure, author playtest) owns that evaluation. The Strategic Brief says Opus owns balancing and integration design.

**Applied:**
- Changing an anchor is **author question Q-C3**.
- Other retuning must keep the five anchors and the order relative to them.
- Retuning is sequenced with 066 C (it does not land during the 066 C playtest).
- An Opus review is required before catalog numbers land. The author's model choice "Sonnet, Composer" is unchanged.

### P2-1 (both) — the "joint contact contract" had no owner and no default

The code already settles most of it:

- `MeleeConfig.range` is centre-to-centre XZ distance in **five** consumers:
  - player hit (`resolveMeleeHits`)
  - NPC approach gates (`NpcAgent.ts` ≈2733, ≈2816)
  - NPC hit (≈2773, single candidate)
  - UI stat rows (`buildInventoryDetailStatRows.ts`, `catalogueStatStrength.ts`)
- No species has a body radius. `AnimalDef` only has `modelHeight`.
- `PLAYER_COLLISION_RADIUS = 0.35`. There is no player–animal body collision.
- `CONTACT_RANGE` is also used for animal–animal predation and dog/wolf fights.

**Applied — contract owner is 067, default stated:**
- `range` stays centre-to-centre.
- Size awareness only as an optional `radius` on `MeleeHitCandidate` (default 0), read from one per-species data field. It is added only if the scenario numbers show misses against large animals.
- NPC approach gates must use the same helper as the hits.
- A change to the human-bite distance gets its own human-target constant. Animal–animal `CONTACT_RANGE` stays as it is.

### P2-2 (051 §B1) — attacker identity already reaches the seam and is thrown away

`CombatTargetHit` already carries `attackerId` (`combat/combatIntent.ts`), including the NPC projectile path (`npcCombat.ts` ≈411). `combatTargetForAnimal().applyDamage` calls `animal.takeDamage(hit.amount, 'npc')` and drops the id. An existing NPC target lock (`AnimalAgent.resolveNpcTarget` / `npcTarget`) already exists, with a LOOSE-ENDS note that it ignores range once locked.

**Applied:** notes now say to pass the id through and feed aggressor preference into the existing `npcTarget`. No new lock or registry.

### P2-3 (051 §B2) — `player-ignore` masks more than `npc-attack`

`player-ignore` (90) also outranks:

- `npc-attack-frenzied` (70)
- `npc-flee` / `npc-ignore` (60)
- `fire-avoid` (50)
- `scare-flee` (48)
- `frenzy-beeline` (40)
- `dog-guard` (35)

The case then runs `updatePredator`. `refreshThrottledHumanIntent` does not exclude frenzied predators.

**Applied:** acceptance covers frenzied and fire cases. The fix goes into `isBehaviourValid` (live NPC aggression context) rather than renumbering the table.

### P2-4 (051 §B3) — determinism vs persistence was left open

`AnimalSaveState` does not hold encounter state (`provokedTimer`, commitments, `npcTarget`). Wild animals persist only as habitat-slot occupants (`persistentOccupants.ts`). Reproducing a decision across save/load would need a save-format change under the P2 `persistence-008` policy.

There is a precedent for keeping such counters transient: player crits use `criticalRoll(attackerId, attackKey, attempt)` with a counter that is not saved.

**Applied:**
- Roll = hash of (`animalId`, target key, per-agent in-memory encounter ordinal), using the `criticalRoll` pattern.
- The state is transient. It resets on hydrate or rebuild, and that reset is tested and documented.
- No save bump. Persisting it would be a separate author question.

### P2-5 (051 §A3 ↔ fauna-045) — bite spatial validation overlaps a planned owner

[fauna-045](../plans/fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md) (planned, high) owns cave/surface perception through `Caves.spatialContextAt`.

Current state:
- Player hits are already filtered by spatial context: `interactables.ts` ≈578, and `buildCombatTarget` ≈1455.
- Animal bites are not. Neither `chaseHuman` nor the `onHumanHit` callback (`gameLoop.ts` ≈3023) checks it.

**Applied:** §A3 is limited to an attack-time same-context check that reuses the existing resolver. Perception changes stay in fauna-045. If fauna-045 lands first, reuse its composition.

### P3

1. The `gameLoop.ts` ≈1361 comment says weapon range is "currently <=2.6". Halberd is 3.2, spear 3.0 and staff 2.8. Fix the comment in 067 (comment only).
2. 067 cross-checks were missing [npc-067](../plans/npc-067-combat-correctness-prelude.md) (in progress; same `npcCombat.ts`; `resolveNpcMeleeWeapon` ranks by catalog damage × sharpness). Added.
3. 067 cardinality: melee candidates include settlement livestock and dogs. A knife swing at a wolf can hit owned animals today. The tests now cover collateral damage to owned animals.
4. 067 §C: boar is `role: 'prey'` and never uses the predator–human decision. Its row measures time to kill and flight only.
5. The plan said the two plans were in parallel with "no hard dependency". That stays true, and sequencing is now explicit:
   - the contract text is written in 067 notes before either side edits a shared consumer;
   - 051 §C calibration runs after 067 §A and 051 §A.

## Not changed

Lunge and its constants; model metadata; plan IDs and status (`planned`).
