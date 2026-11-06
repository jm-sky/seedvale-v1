# Implementation Notes: fauna-050 — World wild fauna habitats

## F1 — settlement habitat planner + `safetyBeltWidth` (2026-11-05, Q141)

Status: **implemented · technically verified** (type-check, lint, `pnpm vitest run src/fauna src/app` 95 files / 1245 tests). Not browser-verified.

### What changed

- New `src/fauna/settlementFaunaHabitats.ts` owns the pure placement logic that `createFauna()` ran inline for home: `planSettlementFaunaHabitats(input)` (ring individuals, then habitat spawners), `findWalkableNearSite`, `safetyBeltWidth`, `predatorDenRingForBelt`, `settlementFaunaSiteRandom`, plus the placement constants moved verbatim (`SPAWNS`, `SPAWN_RING_OFFSET`, `SPAWNER_RING_OFFSET`, `PREDATOR_DEN_RING_OFFSET`, `SPAWNER_SPECS`, `spawnerId`, `measureSlope`, ...). `createFauna.ts` re-exports the previously exported names, so no importer changed.
- The planner takes the RNG as an input. Home passes the shared `seed ^ 0xfa11` stream; the planner draws from it in exactly the old order, **including the per-prop draws** (rock/wolf den mouth = 1 draw, thicket = 2), which are now returned as `propRandoms` instead of being drawn at materialization. The extras / closed-pressure code after the planner keeps drawing from the same stream.
- Two hooks keep the side-effect order identical to the inline build: `onRingPlanned` (ring agents are created before any spawner carves terrain, so their ground Y is unchanged) and `onSpawnerPlaced` (state restore, rock-den carve, scorch, prop, label run before the next site is sampled, because carving/scorching changes later slope and height samples). `groundY`/`slope` in the plan are sampled before carving, as before.
- `habitatSpawnerRingAttempts(spec, denRing = PREDATOR_DEN_RING_OFFSET)`: the den ring is now a parameter; default = home (unchanged).
- Non-home sites: `settlementFaunaSiteRandom(worldSeed, settlementId)` (FNV-1a of the id, salted) — independent of build order and of the shared stream. Not wired to any caller yet (F3).

### `safetyBeltWidth(size, character, forestShare)` — 🟡 provisional numbers

Width in metres past the footprint radius = inner edge of the predator-den ring. Base by size `OUTPOST 40 · SM 55 · MD 70 · LG 85 · XL 100`; `closed` x0.75; minus 40 m per 1.0 of forest share above 0.35; floor 30 m. `MD / default / 0.35 = 70 m` = `HOME_SAFETY_BELT_WIDTH` (= `PREDATOR_DEN_RING_OFFSET[0]`).

Important: the **home belt is always exactly 70 m regardless of home size**. Home size is variable (`homeSize: 'auto'`), and a size-dependent value would move home dens and break the bit-identical invariant, so the home build keeps the constant ring and the function is only for non-home sites. Non-`MD` values are proposals; re-tune in F3/F4 with a census (author decision if it changes feel).

### Verification

- `src/fauna/settlementFaunaHabitats.test.ts`: golden test compares the planner against a verbatim port of the pre-extraction inline placement on seeds 42 and 415424794 x footprint 22/48/72 (synthetic deterministic terrain with river, lake, road and stateful rock-den carving): ring list (positions, herd ids, life stages, mother links), spawner ids/positions/groundY/slope/propRandoms and the next RNG value after the build are all `toEqual`. Plus ids (`home:cave`, `home:cave:bear`, `home:wolfDen`), belt tests (3 sizes x 2 characters, forest, floor, belt(home)=70, den ring 70-130), per-site RNG independence and build-order independence.
- Caveat: the golden test runs on synthetic samplers, not the real `ChunkManager` terrain, and not through `createFauna` itself (it needs GLB loading). The wiring in `createFauna` (hooks) was checked by reading; **a browser check of the home world on `?seed=415424794` is still owed** (queue §2): dens/caves and wild animals at the same places as before F1.

### Baseline counts (WSL) — partly recorded

- ✅ From code (static, home): ring individuals `SPAWNS` = 17 (+ herd juveniles, deer/stag/boar/rabbit herds, random 0-2 each); habitat initial fill rock den wolf 2 + thicket deer 4 + wolf den 2 + rock den bear 1 = 9. Home peak ≈ 26 live wild agents (+ juveniles), matching the plan's recon; plus pressure dens, dungeon residents, livestock. F2-F4 budget: <= 1.5 x that, so <= ~39 live wild agents in the loaded region.
- ❓ **Not measured:** `faunaAgentUpdatesMs` p95 on the WSL bench route and the live-agent count from a running world. Needs a browser run (Chrome, WSL baseline); handed to the author / a browser session via queue §4. Do not compare with Windows numbers.

## F2 — group (de)materialization inside `createFauna` (2026-11-05, Q142)

Status: **implemented · technically verified** (type-check, lint, `pnpm vitest run src/fauna src/app src/persistence`). Not browser-verified. **No non-home group is wired to a caller yet** (F3 wires `SettlementsManager`); home build and ids unchanged.

### What changed

- New `src/fauna/faunaGroupLifecycle.ts` (pure, no Three.js): `CarriedSpawnerStore` (carried states + save union), `catchUpSpawnerLifecycle` (lazy day catch-up), `isGroupEngaged` + `ENGAGED_DEMATERIALIZE_TIMEOUT_SEC` (20 s), `materializedPopulation`, `FaunaHabitatGroupInput`.
- `createFauna` keeps ONE registry (`agents`, `spawners`, `spawnerById`, proximity index). A `groups` map holds a light `HabitatGroupRecord` per group (spawner ids, ring animal ids, cached plan). Home is the `pinned` group: always materialized, `dematerializeGroup('home')` -> `'pinned'`.
- New `Fauna` API: `materializeGroup(input, nowDays)`, `dematerializeGroup(id, nowDays)` -> `'done' | 'deferred' | 'unknown' | 'pinned'`, `isGroupMaterialized`, `getMaterializedGroupIds`, `snapshotSpawnPoints()`. `getSpawners()` stays "live spawners" (all existing consumers unchanged).
- **Save union (the known pitfall).** `saveState.ts` and the in-session rebuild carry in `worldBundle.ts` now use `snapshotSpawnPoints()` = live spawners + carried rows (live first, carried sorted by id). The initial `initialSpawnerState` map seeds the carried store, so a loaded save keeps rows for groups that were never materialized this session. Shape unchanged (`SaveSpawnPoint[]`), no `CURRENT_SAVE_VERSION` bump. Side effect: save rows whose spawner no longer exists in the world (stale ids) are now kept instead of dropped on the next save; harmless, but a stale row never self-cleans.
- **Sites.** First materialization plans with `settlementFaunaSiteRandom(seed, groupId)` through `planSettlementFaunaHabitats` (same hooks as home) and caches the plan; re-materialization replays the cached plan, so sites are identical even though terrain carving (rock den depression, scorch) changes later samples. Terrain edits are applied once per spawner per instance (`terrainEditedKeys`), since they are not idempotent.
- **Dematerialize.** Counts live bound animals per spawner (same predicate as `boundOccupancyCounts`), writes `{state, runtime: {atDays, boundCount, daysSinceLastRespawn}}` into the carried store, removes the spawners/props/labels, disposes the group's agents (ring + bound), clears `animalToSpawner` / pressure cache / den-trip entries. Persistent occupants (none declared for non-home groups) are captured to the registry first. Individuals are not persisted.
- **Lazy catch-up.** On materialize, a carried entry with runtime data runs `catchUpSpawnerLifecycle` (the production `updateSpawners` -> `updateDepletedSpawnerRecovery` -> daily `tickSpawnPointRecovery`, in 0.25-day quanta, capped at 120 days, virtual bound count instead of agents). The result is the number of animals created (`materializedPopulation`): survivors re-created, not an unconditional full fill. Entries loaded from a save have no runtime data: no catch-up, existing rule (full fill if active, none otherwise), matching today's `lastWorldDays` no-backlog policy.
- **Engaged hysteresis.** A group with a living agent whose `getDebugInfo().updateImportance === 'immediate'` (combat/chase/trip/player-led; distance signal is off because the observer is far) returns `'deferred'`; `update()` retries each frame, completing when disengaged or after 20 real seconds; at most one group per frame. A fresh agent that has not run `update()` yet reports `immediate` (initial value), so a group dematerialized in the same frame it was materialized defers one frame.
- **Toggle.** New `DebugSystemName` `worldFaunaHabitats` (`?debugDisableSystems=worldFaunaHabitats`): `materializeGroup` returns `false` for non-home groups; also off with `animals`. Home unaffected.

### Verification

- `src/fauna/faunaGroupLifecycle.test.ts` (15): union snapshot, carried runtime kept out of rows, **catch-up parity** (lazy vs 0.01-day continuous ticking for active refill / at cap / depleted with and without survivors / disabled -> recovering -> active / disabled with nobody nearby), population rules, hysteresis predicate.
- `src/fauna/createFauna.groups.test.ts` (9, real `createFauna`, GLB loads mocked to fail -> procedural/capsule fallbacks, jsdom, flat terrain): materialize -> dematerialize -> materialize gives identical sites and agent counts; home ids/positions identical with and without a group; unmaterialized disabled spawner survives save -> reload -> materialize; depleted spawner recovers via catch-up after real deaths; deferred dematerialization (mocked engaged agent) completes on timeout and is cancelled by re-materialize; scene children back to baseline after dematerialize, empty after dispose; toggle.

### Limits / for F3

- 🟡 Daily recovery check uses the bound count as the "nearby same-kind" proxy; live code counts animals within `SPAWNER_RADIUS`.
- Non-home groups reuse `SPAWNS`/`SPAWNER_SPECS` as-is (ring individuals not habitat-bound yet; Q139-b conversion is F4). Their `wolfDen` spawners are NOT fed to the quest tracker (`isWolfDenCleared` is home-only) but the daily `shouldActivateWolfDenProblem` loop iterates all live spawners, so F3 must decide whether non-home dens may run that scenario.
- Deaths of animals that wander outside the loaded region while their group persists are unaffected; only materialized animals die (plan invariant 2).
- Not wired: `SettlementsManager` load/unload, `closedSettlements` pressure per group (Q133), wilderness cells (F4).

## Review 035 — status relabel and rework (Opus, 2026-11-06)

[Review 035](../../reviews/2026-11-06--035--continent-wide-wild-fauna-architecture-review.md): **REWORK REQUIRED** for continent-wide continuity. Each finding was checked against code at `474ce2cb`; the response table is in the plan, [§ Review 035 response](../fauna-050-world-wild-fauna-habitats.md#review-035-response-2026-11-06). No runtime code changed in this step.

- **F1 relabel:** extracted + synthetic golden verified. Still owed: WSL baseline and a home check on the real continent. Planner side effects (carving during planning) get a frozen-input contract for non-home groups in C0.
- **F2 relabel:** streaming infrastructure (group map, cached plan, save union, toggle). The F2 "Stop if" (*catch-up cannot match continuous lifecycle without persisting individuals*) was in fact hit. The 15 + 9 tests prove timer parity and site identity, not individual or ecological continuity. The test "carry() keeps runtime data out of the persisted rows" asserts the R2 information loss. C2 rewrites it into a round-trip assertion.
- **Not reachable in production yet:** no non-home group is materialized (F3 not wired), so R1/R2/R6 do not affect current play. Home keeps the already documented reload limitation (ordinary wild animals resurrect, quest bindings `invalidated`). Q035-d decides whether C1/C2 also fix that.
- **Next:** C0 (S, ready, no decision needed) in parallel with author answers Q035-a…d → C1 (O spec) → C2 → C3 → C4 → F3.
