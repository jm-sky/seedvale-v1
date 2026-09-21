# Implementation Notes: fauna-047 — Deer thicket capacity and natural population recovery

## Current-code findings

- `SPAWNER_SPECS` in `src/fauna/createFauna.ts` is still the canonical ordinary habitat config; deer `thicket` is currently `maxPreyCount: 3`, `respawnIntervalDays: 1`. Change only that entry to 4.
- `handleAnimalDeath()` already accounts managed deaths by `animalToSpawner` / `spawnPointId` and changes `active → depleted` using `shouldDeplete(..., effectiveMaxPreyCount(spawner))`. Keep this path; no death-provenance or quest hooks are needed.
- Fauna-041/042 is already present: the update pass builds `boundOccupancyCounts` from live, non-persistent agents keyed by `spawnPointId`; `updateSpawners()` consumes that map and only increments occupancy after a successful materialization.
- `ordinaryHabitatCapacity(effectiveMaxPreyCount(spawner), reservedPersistentSlots)` is the existing capacity authority. Natural recovery must use the same calculation.
- Existing `tickSpawnPointRecovery()` is specifically the destroyed-habitat lifecycle: `disabled → recovering → active`, using nearby same-kind animals inside `SPAWNER_RADIUS`. Do not change that population meaning to bound occupancy.
- `daysSinceLastRespawn` is runtime-only and intentionally omitted from `SavedSpawnPointState`; it should remain the active-respawn timer. Add a separate optional persisted field for depleted natural-recovery progress.

## Recommended implementation shape

Keep active replenishment and depleted recovery in `AnimalSpawner.ts`, but as distinct state branches sharing the same caller-supplied bound-count/materialization contract. A small exported helper such as `updateDepletedSpawnerRecovery(...)` is preferable to extending `tickSpawnPointRecovery()`, because the latter has different locality semantics and a different lifecycle.

Use constants for the V1 timings (3 days with surviving bound population, 6 days when bound population is zero). Store one accumulated game-day value on `PreySpawner` (for example `depletedRecoveryDays`) and persist it as an optional field in `SavedSpawnPointState`; restore missing values as 0. Reset it when natural recovery reaches `active`, and when the habitat enters the destroyed-habitat path so stale depleted progress cannot leak into a later cycle.

In `createFauna.update()`, reuse the already-built `boundOccupancyCounts`, `reservedPersistentSlots`, and the exact same materialization closure used by active respawn. Do not put depleted recovery into the once-per-calendar-day `lastRecoveryCheckDay` pass: that pass loses fractional `dayDelta` and is for the 21-day destroyed-habitat check. Natural recovery should consume the same `dayDelta` as `updateSpawners()`, which also makes time-skip catch-up deterministic.

On a successful recovery materialization, update the local bound count exactly as active respawn does. On failure, retain the accumulated eligible time and stop attempts for that spawner for this update; otherwise a failed candidate search can spin during a large time skip. Successful catch-up may consume multiple intervals, but stop immediately at ordinary capacity or after the state becomes `active`.

## Important edge cases

`MIN_RECOVERY_POPULATION === 2` creates a real generic-recovery trap for habitats whose **ordinary** capacity is below 2. The current bear `rockDen` has `maxPreyCount: 1`; persistent-slot reservation can also reduce another habitat's ordinary capacity below 2. Such a spawner can never satisfy the plan's `bound population >= 2 → active` rule. Do not silently change the global minimum to `min(2, cap)`. Gate depleted natural recovery to recoverable, finite-interval spawners whose current `ordinaryHabitatCapacity(effectiveMaxPreyCount(...), reservedSlots) >= MIN_RECOVERY_POPULATION`. This keeps bear semantics unchanged and avoids an unrecoverable half-state.

`wolfDen` currently has `canRecover: false` by default, while scenario pressure can make its effective respawn interval finite. Eligibility therefore must check `canRecover` in addition to finite interval; do not infer eligibility from interval alone.

Persistent occupants are deliberately excluded from `boundOccupancyCounts`; their slots reserve capacity even when away/dead/tombstoned. Preserve that contract. Do not count nearby/ring fauna or persistent residents as ordinary recovered population.

Wild managed animals themselves are not persisted. A reload/rebuild reconstructs ordinary population only for `active` habitats; a restored `depleted` habitat is currently left empty. Persisting the recovery timer does **not** imply persisting a surviving deer. Do not introduce logical population or wild-individual persistence in this fix. The saved timer should survive, while the post-load bound count remains whatever the rebuilt runtime actually owns.

When a cap-4 thicket reaches the third managed death, `handleAnimalDeath()` changes it to `depleted`; subsequent deaths while depleted intentionally do not advance `deathsThisCycle`. Natural recovery should not alter this death-accounting rule.

## Tests worth placing at the ownership boundary

Most lifecycle cases belong in `src/fauna/AnimalSpawner.test.ts`: timer accumulation, 3/6-day thresholds, large `dayDelta`, failed materialization, cap/reserved-slot gating, `canRecover: false`, `Infinity`, save/restore, and transition/reset behavior. Add only focused `createFauna` coverage where needed to pin the deer spec at 4 or prove integration with the existing successful-spawn closure.

Also retain regression coverage for the existing destroyed-habitat path: it must remain nearby-population based and must not consume the new depleted-recovery timer.

## Implementation order

1. Add recovery state/progress + snapshot/restore and pure lifecycle tests in `AnimalSpawner.ts`.
2. Raise deer thicket capacity to 4.
3. Wire depleted recovery into the existing `dayDelta` / bound-occupancy / materialization path in `createFauna.ts`.
4. Add integration/regression tests; then run the plan's targeted/full verification commands.

No new manager, registry, quest dependency, proximity scan, or worker is justified.
