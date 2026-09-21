# Plan: Deer thicket capacity and natural population recovery

**Created:** 2026-09-21
**Status:** `done` ✅ (implemented 2026-09-21 — automated tests; browser verification by user)
**Priority:** high · **Effort:** M
**Depends on:** ~~fauna-041~~
**Domain:** `fauna`
**Type:** `fix`
**Subdomains:** `population` `habitat` `lifecycle`
**Tags:** `deer` `thicket` `depletion` `recovery`
**Roadmap:** -
**Model:** Sonnet, Composer

## Goal

Remove the systemic deer-population deadlock exposed by the hunter profession quest without creating quest-specific fauna.

A normal deer `thicket` should support a slightly larger local population and a depleted but physically intact habitat should be able to recover naturally over world time. `disabled` must remain the stronger state for a habitat the player physically destroys.

The fix extends the existing `PreySpawner`, `spawnPointId`, game-day respawn and recovery mechanisms. Do not create a quest-owned spawn path or a second population authority.

## Confirmed current behavior

Current `main` has:

- deer `thicket`: `maxPreyCount: 3`, `respawnIntervalDays: 1`;
- depletion threshold = smallest integer strictly greater than half of `maxPreyCount`, therefore 2 deaths for a cap of 3;
- `updateSpawners()` replenishes only `active` habitats;
- `depleted` does not recover by waiting;
- `tickSpawnPointRecovery()` handles only `disabled → recovering → active`;
- `MIN_RECOVERY_POPULATION = 2`;
- managed occupancy is already authoritative by `spawnPointId` after fauna-041;
- ring deer are unmanaged and are not part of this plan.

This creates a real availability problem: a three-deer harvest objective can consume two deer from a three-animal thicket, push it to `depleted`, and lose the normal replenishment path before the habitat can supply the third harvest. NPC/predator/natural deaths use the same death accounting and can cause the same lockout.

## Decisions

### 1. Raise normal deer-thicket capacity globally from 3 to 4

Change the canonical ordinary deer `thicket` spec:

```text
maxPreyCount: 3 → 4
```

This is a fauna balance rule for every ordinary deer thicket, **not** a special case near the home settlement and not conditional on a quest.

With the existing `>50%` depletion rule:

```text
cap 4
→ depletion threshold 3 deaths
→ after three deaths one member may remain
```

This lets the habitat and the quest use the same ecosystem semantics. Do not inspect quest state from fauna placement/spawning.

### 2. Give intact `depleted` habitats natural recovery

`depleted` means a population collapse in an intact habitat, not permanent reproductive shutdown.

For recoverable finite-interval managed habitats:

```text
depleted + bound population > 0
→ slow recovery: 3 world-days per successful animal materialization

depleted + bound population = 0
→ recolonization delay: 6 world-days before the first successful animal
→ then 3 world-days for the next animal

bound population >= MIN_RECOVERY_POPULATION (2)
→ state = active
→ deathsThisCycle = 0
→ normal active respawn rules resume
```

Use 6 days as the deterministic V1 value within the discussed 5–7 day range.

Natural recovery must use managed habitat membership/capacity from fauna-041, not proximity, for the population it owns. It must never exceed `effectiveMaxPreyCount()` / ordinary capacity after persistent-slot reservation.

### 3. Keep player-destroyed habitat semantics distinct

Preserve:

```text
depleted
→ player [E] Zniszcz
→ disabled
→ RECOVERY_DAYS (21)
→ recovering
→ nearby same-kind population >= MIN_RECOVERY_POPULATION
→ active
```

Natural depleted recovery must **not** run for `disabled` or `recovering`.

This distinction is intentional:

- `depleted` = animals were heavily reduced, habitat still exists;
- `disabled` = player physically destroyed/burned the habitat;
- `recovering` = destroyed habitat has waited out its recovery delay and is checking ecological recolonization.

Do not shorten the existing 21-day destroyed-habitat penalty.

### 4. Preserve world-time and off-screen semantics

Recovery is world simulation, not camera/player proximity behavior.

It must progress from the same world-day delta used by managed respawn, including large time skips/off-screen simulation. A player must not need to stand near the thicket.

A large `dayDelta` may catch up multiple eligible recovery intervals, but recovery must stop at the state/cap boundary and must not duplicate animals.

### 5. Persist meaningful depleted-recovery progress

Current `daysSinceLastRespawn` is deliberately omitted from `SavedSpawnPointState` because active replacement timing is short-lived. Natural depleted recovery is multi-day ecological state and must not silently restart or complete incorrectly across save/load.

Add the smallest explicit persisted timing/progress field needed for depleted natural recovery. Keep backward compatibility for saves without it by defaulting to zero progress.

Do not overload `disabledAtDay`: it remains the timestamp of physical habitat destruction and owns the existing `disabled/recovering` lifecycle.

### 6. Failed materialization must not consume recovery

Reuse fauna-041's explicit successful-spawn contract.

If terrain/candidate resolution fails:

- do not increment logical population;
- do not transition to `active`;
- do not consume the recovery interval as if an animal appeared;
- avoid an unbounded retry loop in one update.

Retry on a later eligible fauna update.

## Species / scenario boundaries

V1 should implement the recovery rule generically for ordinary recoverable finite-interval managed habitats where the existing lifecycle permits it, rather than hard-code a deer-only recovery function.

However:

- only the deer `thicket` capacity changes from 3 to 4;
- `wolfDen` remains one-shot with `respawnIntervalDays: Infinity` and must not naturally repopulate;
- `canRecover: false` continues to prevent recovery;
- scenario overrides from `effectiveMaxPreyCount()` / `effectiveRespawnIntervalDays()` remain authoritative;
- do not change rock-den/bear/wolf capacities as part of this balance fix.

If current scenario semantics make generic depleted recovery unsafe for a specific existing spawner type, keep that type excluded explicitly through existing capability/state data rather than quest-specific checks.

## Relevant files / symbols

Minimum implementation surface to verify against current `main`:

- `src/fauna/createFauna.ts`
  - `SPAWNER_SPECS` deer thicket capacity;
  - managed initial fill;
  - `handleAnimalDeath()`;
  - world-day `dayDelta` update path;
  - existing once-per-day recovery pass;
  - successful materialization callback and bound-count authority.
- `src/fauna/AnimalSpawner.ts`
  - `PreySpawner`;
  - `SpawnPointState`;
  - `depletionThreshold()` / `shouldDeplete()`;
  - `updateSpawners()`;
  - `tickSpawnPointRecovery()`;
  - `SavedSpawnPointState`, snapshot/restore.
- `src/fauna/AnimalSpawner.test.ts`
  - active respawn, depletion and recovery lifecycle tests.
- `src/fauna/persistentOccupants.ts`
  - reuse `ordinaryHabitatCapacity()`; do not duplicate reserved-slot arithmetic.
- `src/fauna/wolfDenScenario.ts`
  - preserve effective capacity/interval overrides.
- focused `createFauna` tests if needed to prove the configured deer capacity and integration behavior.

Add JSDoc to any new public/architectural recovery helper or state field where it improves preflight discovery; use `@domain fauna` where appropriate.

## Implementation shape

Prefer one fauna-owned population lifecycle path:

```text
world day delta
→ active habitat replenishment OR depleted natural recovery
→ authoritative bound occupancy
→ successful materialization
→ state transition when recovery population reaches 2
```

Do not add a quest callback, quest availability query, home-settlement special case, timer manager, or parallel animal registry.

Keep locality semantics separate:

- managed replenishment / depleted recovery population = habitat ownership (`spawnPointId`);
- existing `recovering → active` after physical destruction = nearby same-kind ecological condition within `SPAWNER_RADIUS`.

## Tests

Automated coverage must include at least:

1. deer thicket canonical capacity is 4;
2. `depletionThreshold(4) === 3`;
3. after two deaths from a cap-4 deer thicket it remains `active`;
4. after three deaths it becomes `depleted`;
5. depleted habitat with one bound survivor does not recover before 3 world-days;
6. after 3 world-days a successful recovery spawn reaches population 2 and transitions to `active`, resetting `deathsThisCycle`;
7. empty depleted habitat does not recolonize before 6 world-days;
8. at 6 world-days exactly one successful colonizer appears; the second follows only after the 3-day slow-recovery interval;
9. large time skip/off-screen `dayDelta` catches up deterministically without exceeding capacity or duplicating spawns;
10. failed recovery materialization does not count as population or falsely transition state;
11. `disabled` and `recovering` do not use depleted natural recovery and retain the existing 21-day/nearby-population lifecycle;
12. `wolfDen` / `Infinity` and `canRecover: false` do not enter natural depleted repopulation;
13. persistent reserved slots reduce ordinary capacity correctly during recovery;
14. save/load preserves partial depleted-recovery progress; older snapshots without the new field restore safely;
15. two same-kind habitats recover only from their own bound managed population;
16. a regression scenario equivalent to the hunter objective remains systemically completable: three player-caused managed deer deaths can occur before cap-4 depletion, without any quest-specific spawn.

## Non-goals

Do not include:

- quest-specific deer spawning;
- special fauna capacity near the home settlement;
- changes to the hunter quest objective/counter;
- ring-spawn deer population authority or regional wildlife migration;
- broad species rebalance;
- changes to NPC hunting selection;
- changes to predator kill semantics;
- changes to death provenance;
- changes to habitat placement;
- UI changes.

Ring-spawn/regional population authority remains a separate future ecosystem concern.

## Verification

Technical verification:

```text
targeted AnimalSpawner/fauna tests
npx tsc --noEmit
pnpm run lint:fix
pnpm run build
pnpm run test
```

Do not run `pnpm docs:sync` manually.

Manual browser verification is performed by the User. Suggested scenario: locate an ordinary deer thicket, verify four-animal capacity, reduce it to one animal, advance world time and confirm slow natural recovery; then fully eliminate a depleted population and verify the longer recolonization path.

## Success criteria

```text
ordinary deer thicket
→ capacity 4

heavy hunting / NPC / predator losses
→ depleted intact habitat
→ slow natural population recovery

local extinction
→ longer recolonization
→ slow recovery
→ active at population 2

player destroys habitat
→ disabled
→ existing stronger 21-day recovery lifecycle
```

The hunter quest becomes completable through ordinary ecosystem rules, while fauna remains independent from quest state.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
