# Plan: Wild fauna across the world — settlement and wilderness habitats

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** world-terrain-060 world-terrain-061
**Queue:** Q139 (plan); F3 needs Q133 (phantom closed-pressure sites); F4 final numbers after the 060 R4 / 061 H6 freezes
**Domain:** `fauna`
**Subdomains:** `population` `lifecycle`
**Tags:** `gameplay` `persistence` `performance` `worldgen`

## Goal

Wild fauna exists across the whole continent, not only around the home settlement (author, Q134 (a), 2026-11-04). Every settlement has its own fauna surroundings, with a safety belt sized for that settlement. Between settlements, wilderness has habitats chosen by land cover (forest, rock/ridge, shore/wetland). Danger and game come from **where you are**, not from how close you are to the starting village.

No simulation reduction: species behaviour, spawner lifecycle, predator/prey and village avoidance stay exactly as they are today.

## Recon (verified 2026-11-05, Opus)

- ✅ **One home-anchored build.** `buildFauna()` (`src/app/worldBundle.ts`) calls `createFauna()` once per world with `homeDef` as `settlementCenter`/`settlementId`/`footprintRadius`. The following are all placed around **home only**:
  - ring individuals: `SPAWNS` = 17 animals at `SPAWN_RING_OFFSET` 4–27 m,
  - habitat spawners: `SPAWNER_SPECS` = rock den wolf 2, thicket deer 4, wolf den 2, rock den bear 1,
  - predator dens at `PREDATOR_DEN_RING_OFFSET` 70–130 m (Q100).

  Extras on top of that:
  - `extraHabitatSpawners`: the dark-forest treasure-site wolf dens, at fixed world positions.
  - `closedSettlements`: wolf-den pressure for closed settlements, collected by the stale legacy probe (Q133).
  - Persistent occupants: dungeon residents and the treasure-map bear.
- ✅ **No streaming.** Every wild agent lives for the whole world lifetime in one `agents` array. `update()` ticks every agent each frame, with importance tiers (`immediate` / `active` 1/30 s / `routine` 1/12 s, `docs/state/fauna.md`). A far-away agent is never unloaded. At a streaming frontier its step is held (`sampleResidentSurfaceGround` → `null`).
- ✅ **Placement RNG is one shared stream** (`createSeededRandom(seed ^ 0xfa11)`), consumed in a fixed order. Adding sites into that stream would move home placements, and materializing in a different order would change positions. New sites therefore need a **per-site seeded RNG**.
- ✅ **Persistence:**
  - Wild individuals are not persisted (population is deterministic, identity is not).
  - Spawner lifecycle is persisted thinly per stable id (`SaveSpawnPoint`; `spawnerId(settlementId, type, kind, n)` = `${settlementId}:${segment}`).
  - `saveState.ts` writes `bundle.fauna.getSpawners()`, i.e. **only spawners that currently exist**. Once spawners are streamed, saved state for an unmaterialized spawner would be dropped on the next save. F2 must carry it.
- ✅ **Settlement streaming owner:** `SettlementsManager` loads at `SETTLEMENT_LOAD_RADIUS` 300 m and unloads past the hysteresis radius. Livestock and rats are materialized and captured per settlement in that lifecycle. Livestock is persisted per individual and wild fauna is not, so wild animals need no capture, only spawner state. Terrain loads `loadRadius` 3 chunks × 64 m.
- ✅ **Lifecycle is already day-anchored:** `updateSpawners` / `updateDepletedSpawnerRecovery` / `tickSpawnPointRecovery` work in `worldDays`, and `lastWorldDays` already prevents a backlog after load. A spawner can therefore be caught up lazily when it materializes, with the same rules as continuous ticking.
- ✅ **Quest contracts bind by id:**
  - `WOLF_DEN_ID` / `isWolfDenCleared()` and `findHomeCaveSpawner()` (home `:cave`), used in `quests.ts`, `gameLoop.ts`, `createApp.ts`, `wolfDenScenario.ts`,
  - `destroy_spawn_point` by `PreySpawner.id`.

  Home ids must not change.

## Design

### Invariants

1. **One fauna registry.** World habitats are added to the existing `createFauna` instance and its `agents` array, proximity index and spawner map. No second fauna system and no per-settlement `Fauna`.
2. **Authoritative state is world-level and player-independent.** This covers habitat site lists (deterministic from seed + terrain) and spawner lifecycle (persisted per id, day-anchored). Individuals are a **projection**, materialized where the world is loaded, like settlement NPCs and livestock. Respawn and recovery give the same result whether a spawner was materialized all along or caught up on materialization. Deaths only happen to materialized animals, which matches today's policy that wild individuals are not persisted.
3. **Home stays bit-identical** in F1–F3: same ids, same positions, same RNG stream. Golden test.
4. **Determinism:**
   - Each non-home site uses `createSeededRandom(hash(seed, siteId))`, so positions do not depend on materialization order.
   - Group membership is sorted by id.
   - No camera or frame-rate dependence beyond the existing importance tiers.
5. **Revertable workload:** world habitats sit behind one config/system toggle (`isSystemEnabled` style, default ON per the 2026-11-02 rule) so a WSL A/B can switch them off.

### Habitat group

A **habitat group** = `{ groupId, anchor, spawners[], ringSpecs[] }`, produced by pure planners:

- `planSettlementFaunaHabitats(def, samplers, seed)` is the home logic extracted from `createFauna` and parametrized by settlement. Settlement ids keep the `spawnerId()` scheme (`<settlementId>:cave`, …), so they are stable and save-compatible.
- `planWildernessFaunaHabitats(cell, samplers, seed)` works on a world grid cell (🟡 ~384 m, F4 finalizes). It keeps 0–2 sites by land cover:
  - forest → thicket (deer, boar),
  - rock/ridge → rock den (wolf or bear),
  - shore/wetland → ducks.

  Sites are excluded inside any settlement's safety belt, inside road corridors and in water/river clearance (existing `isValidWildFaunaSpawnSite`, `clearsRiverChannel`, `isNearRoadCorridor`). Ids are `wild:<gx>_<gz>:<segment>[:kind]`. Only existing species and spawner types are used. When 062 adds (T,P) biomes, the classifier input changes, not the planner.
- **Safety belt** = pure `safetyBeltWidth(size, character, forestShare)`, owned by the settlement plan as reconciliation §4.3 proposed and Q134 (a) approved. It sets the inner edge of predator-den rings per settlement and the wilderness exclusion radius. It is calibrated so that home = today's 70 m inner edge, keeping home unchanged.

### Materialization lifecycle (inside `createFauna`)

- `materializeGroup(group, nowDays)`:
  - creates spawner props and spawners,
  - restores saved state from a carried `savedSpawnerState` map,
  - runs the lazy day catch-up,
  - fills populations through the existing `spawnAgent` and initial-fill paths.
- `dematerializeGroup(groupId)`:
  - records each spawner's live bound count (runtime-only; used for catch-up while unloaded),
  - writes the lifecycle snapshot into the carried map,
  - disposes the group's agents and props.

  **Hysteresis:** an agent that is `immediate` (combat, chase, trip, player-led) delays its group's dematerialization until it disengages or a bounded timeout passes. Corpses of unpersisted wild animals vanish with the group, the same as on reload today.
- **Save:** `getSpawners()` keeps meaning "live spawners". A new `snapshotSpawnPoints()` returns the union of live and carried states and writes only non-default entries. The save shape is unchanged (`SaveSpawnPoint[]`), so no `CURRENT_SAVE_VERSION` bump; the semantic "subset of world spawners" goes into `docs/state/persistence.md`.
- **Drivers:**
  - Home: always materialized (eager, as today).
  - Other settlements: `SettlementsManager` load/unload, through a callback that the composition root wires in `gameLoop` / `worldBundle`.
  - Wilderness cells: driven by the terrain-resident region (chunk load/unload). This is the same projection boundary as terrain colliders: animals never exist where ground is not resident.
- `closedSettlements` pressure dens become part of each closed settlement's own group (after Q133). The home-centric `collectNearbyClosedSettlements` path is then removed.

### Workload budget (🟡 numbers fixed in F1 baseline)

Today's home peak is ≈ 26 wild agents plus pressure dens, dungeon residents and livestock. Targets:

- **Live wild agents within the loaded region:** ≤ 1.5× today's home peak at any position on the reference seed (home included). Equivalently: what the player sees near home should not get heavier, and elsewhere it becomes comparable to home.
- **Fauna CPU:** `faunaAgentUpdatesMs` p95 (agent CPU diagnostics) ≤ +25 % against the WSL baseline on the standard bench route.
- **(De)materialization cost:** amortized, at most one group per frame. Spawner props should use existing instancing, or the props are counted and measured as draw calls.

Over budget → lower per-site capacity or site density, which is an **author decision (§3), not a silent reduction**.

## Slices

| Slice | Model | Scope | Done when | Stop if |
| --- | --- | --- | --- | --- |
| **F1** | S | Extract `planSettlementFaunaHabitats` + `safetyBeltWidth` (pure) out of `createFauna`; home path uses it; per-site RNG for non-home only; baseline counts (live wild agents near home, `faunaAgentUpdatesMs` WSL) | home golden test: identical ids + positions + RNG consumption on both seeds; planner unit tests for 3 sizes × 2 characters; belt(home) = 70 m; baseline recorded in notes | extraction changes home output |
| **F2** | S | Group (de)materialization inside `createFauna`, carried spawner-state map, `snapshotSpawnPoints()` union, lazy catch-up, engaged-agent hysteresis, world-habitat toggle | tests: materialize → dematerialize → materialize gives identical sites and spawner state; save round-trip of an unmaterialized depleted/disabled spawner; time-skip/catch-up parity against continuous ticking; no orphaned props/agents after dispose | catch-up cannot match continuous lifecycle without persisting individuals |
| **F3** | S | Non-home settlements' groups wired to `SettlementsManager` load/unload; closed-settlement pressure moved into its own settlement's group (after Q133) | headless: walking home → neighbour materializes/dematerializes the neighbour group; type-check, lint, fauna/app/quests suites; WSL A/B (toggle) against budget; browser check at a non-home settlement on `?seed=415424794` (§2) | quest/progression code assumes a single fauna anchor |
| **F4** | O→S | Wilderness cells: classifier + planner + terrain-region driver; `pnpm worldgen:fauna:census` (sites and capacity per km² by land cover, min distance to settlements/roads, both seeds) | census both seeds within the author's density answer (§3 Q139-a); no site inside a belt/road/river clearance; WSL A/B against budget; final numbers re-taken after 060 R4 / 061 H6 freezes | budget only met by reducing density below the author's answer → §3 |
| **F5** | S | Docs: `docs/state/fauna.md` (habitat groups, projection boundary), `docs/state/persistence.md` (spawner subset), plan notes; queue §4 Windows Arc A/B handoff | docs match code | — |

Ordering: F1 → F2 → F3 (needs Q133) → F4 (tool any time after F2; numbers after the freezes) → F5. Each worldgen-output-affecting slice gets its own census (roadmap cross-plan rules). Fauna sites are not cached, so no cache namespace is involved. Epoch-1 test saves are disposable (review 031).

## Open questions (author, queue §3)

- **Q139-a — wilderness density:** how many wild animals should be live around the player away from villages? (a) like around home today (~20–25 within ~250 m), recommended; (b) less: wilderness is quieter, danger comes in clusters; (c) more than home.
- **Q139-b — ring individuals without a lair** (wolf/fox/rabbit/duck/boar from `SPAWNS`): today they never respawn after being killed (until reload). In the world: (a) everything tied to habitats with respawn (killing a pack has a lasting effect, the area recovers slowly), recommended; (b) keep as is.

## Notes

- Out of scope: new species, (T,P) biomes (062), fauna on footpaths/landmarks (Q140), any change to `AnimalAgent` behaviour.
- fauna-048 (village query scaling) becomes more relevant once more settlements and groups are live. Re-check its ROI gate after F3.
