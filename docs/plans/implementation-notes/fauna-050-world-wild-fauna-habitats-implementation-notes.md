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

Important: the **home belt is always exactly 70 m regardless of home size**. Home size is variable (`homeSize: 'auto'`), and a size-dependent value would move home dens and break the bit-identical invariant, so the home build keeps the constant ring and the function is only for non-home sites. Non-`MD` values are proposals; re-tune in F3/F4 with a census (author decision if it changes feel). **Author Q141-a (a), 2026-11-06:** accepted as the start, keep belts narrow.

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
- **Not reachable in production yet:** no non-home group is materialized (F3 not wired), so R1/R2/R6 do not affect current play. Home keeps the already documented reload limitation (ordinary wild animals resurrect, quest bindings `invalidated`). Author Q035-d (a), 2026-11-06: C1/C2 also fix that at home.
- **Next:** ~~C0~~ (done 2026-11-06, Q159) → ~~C1~~ (spec done 2026-11-07, Q160, § C1 below) → **C2 (S, ready, Q161)** → C4 → C3 → F3.

## C1 — durable wild record spec + C3 world-time contract (Opus, 2026-11-07, Q160)

Status: **spec only, no runtime code changed.** Verified against code at `fa368e9a`. Implementation: C2 (Q161) → C4 (Q163) → C3 (Q162), Sonnet. Author answers applied: Q035-a (a) + threat bubble, Q035-b (c), Q035-c (a), Q035-d (a).

### C1.0 Facts the spec relies on (✅ checked in code)

- `CURRENT_SAVE_VERSION = 61` (`saveData.ts`), so C2 is **61 → 62** (the plan's "60 → 61" was written before v61 landed). `WORLDGEN_EPOCH = 1`.
- `AnimalSaveState` (`AnimalAgent.ts` ≈ 801) already round-trips position/yaw, HP + dead, hunger/thirst/stamina, corpse (`deathAtDays`, `meatHarvested`, `harvestedAtDays`), owner, rabid, stray, injury + recovery anchor, pack. It does **not** carry `lifeStage`, `age`, `motherId` (private mutable fields, ≈ 1771), and `herdId`, `variant`, `spawnPointId`, `humanTaste` are constructor-only. Corpse `buried` is not snapshotted.
- Ordinary ids are `${kind}-${nextAnimalId++}` (`spawnAgent`, `createFauna.ts` ≈ 822). No save field and no source literal refers to an ordinary wild id. Quest bindings to ordinary wild animals are `invalidated` on restore. `denWolfAnimalIds` is a runtime set.
- Juveniles exist only in the planned ring (`settlementFaunaHabitats.ts` ≈ 422, `motherIndex`). There are no births today. `JUVENILE_MATURITY_SECONDS = 600` (`herdCohesion.ts`).
- Deaths all funnel through `AnimalAgent.collapse()` → `handleAnimalDeath` (spawner accounting + quest hook). Removal happens when `readyToRemove()` passes (`CORPSE_REMOVE_DAYS` = 112 h, harvested linger, buried) in `createFauna.update`.
- **No wild → domestic path exists.** `transferOwnershipToPlayer()` is only called from `livestock.ts` (household → player). `isLeadable()` needs `def.lead` or a household stray episode.
- Animals have no HP regeneration and no time-based rabies death. Physical injury recovers lazily (`injuryRecovery`, items-player-045).
- `SaveSpawnPoint` has no `daysSinceLastRespawn`. **A partial respawn timer is lost on every save today**, not only on F2 carry.
- Uncontrolled randomness: `Math.random()` at `AnimalAgent.ts` 1866 (life init), 3389 (side pick), 3443/3487 (livestock production/wool stagger), 4861 (rabies bite), 5681/5683/5853 (wander/idle). Post-build respawns and den trips draw from the shared `0xfa11` stream (`random`, through `rngForSpawner` for home).
- Offscreen travel: one generic owner, `NpcTravelContinuity` (`ai/npcTravel.ts`). Its bounded, idempotent interval checkpoint is `resolveNpcTravelCheckpoint` (`ai/npcTravelCheckpoint.ts`) with a `survivalResolvedAtDays` cursor. It is called from `SettlementsManager` (≈ 1503, 1544: streaming/skip) and `NpcAgent` (≈ 4033). Purposes: `expedition`, `transport` (merchant outbound), `merchant-return`.
  - **Merchant:** ✅ real offscreen traveller (`merchantJourney.ts`).
  - **Hunter:** ✅ is a `Role`, but hunts only live, loaded targets (`huntingHooks.queryTarget`). It travels offscreen only as an expedition member.
  - **Knight:** ❌ no such role. `guard` exists; escort exists only as a work-contract scope.

  So the bubble attaches to **any NPC whose travel is executing offscreen**, not to roles. The role hook stays for later knight/hunter-trip work.
- Reusable seeded hashing: `settlementFaunaSiteRandom(worldSeed, key)` (FNV-1a + salt → `createSeededRandom`).

### C1.1 One owner, one registry

`persistentOccupants.ts`'s registry is **generalized** into the wild record registry inside `createFauna`. There is no new module-level manager. It holds:

- **declared slots** (existing fauna-018 occupants: dungeon residents, treasure-map bear). These are unchanged: `persistent:<habitatId>:<key>` ids, `removedSlots` tombstones, save field `persistentHabitatOccupants`.
- **generated records:** every ordinary wild animal (ring, initial fill, respawn/birth/immigration), at home and elsewhere.

A live `AnimalAgent` is the projection of exactly one record. A record is either **active** (an agent exists; the agent is authoritative, and the record is refreshed on demote/save) or **dormant** (no agent; the record is authoritative). There are never two agents per record, and never an agent without a record (except livestock and rats, which have their own owners).

### C1.2 Identity

| Origin | `habitatId` | `occupantKey` | `animalId` |
| --- | --- | --- | --- |
| ring individual of group G, planner index i | `<G>:ring` | `r<i>` | `<G>:ring:r<i>` |
| initial fill / respawn / birth / immigration at spawner S | `S.id` (`spawnerId()` scheme, e.g. `<settlementId>:cave`) | `b<seq>` | `<S.id>:b<seq>` |
| declared occupant | unchanged | unchanged | `persistent:…` (unchanged) |

- `seq` is a per-spawner monotonic **birth cursor** `nextBirthSeq`. It starts at 0 for the initial fill and is incremented on every creation, and never reused. Since a removed `b<seq>` can never be recreated, **generated records need no tombstones** (this satisfies Q035-c "bounded by capacity" with zero rows).
- Ring and initial fill are produced once per group. A per-group row `{ id, initializedAtDays }` marks that the group's initial population exists. From then on, an absent record means *removed*, and ring/fill are **never replayed**. This replaces ring tombstones.
- **Home:** sites, positions and the shared `0xfa11` consumption during the build stay **bit-identical**. Only the id strings change (`wolf-3` → `<home>:ring:r3` / `<home>:cave:b0`), which is safe because nothing persisted refers to ordinary ids (C1.0). Plan invariant 3 is restated as "home placement bit-identical; ids move to the durable scheme". The golden test compares positions/kinds by planner index, not ids.
- `isWolfDenCleared()` becomes derivable: every home `wolfDen` record with `seq < initialFillCount` is dead or removed. `denWolfAnimalIds` may stay as a cache rebuilt from records on restore.

### C1.3 Record fields

```ts
/** Generated wild individual (fauna-050 C1). Extends the declared-occupant row. */
type WildFaunaRecord = PersistentOccupantSaveRecord & {
  origin: WildRecordOrigin              // 'ring' | 'fill' | 'birth' | 'immigrant'
  sex: WildAnimalSex                    // 'female' | 'male' — fixed at creation (C1.4)
  herdId?: string                       // constructor input
  variant?: AnimalVariant               // constructor input (omit = normal)
  humanTaste?: boolean                  // inherited at spawn, kept (not re-derived)
  /** World-days up to which `state` has been advanced (C3 cursor). */
  advancedAtDays: number
}
```

`AnimalSaveState` gains three **optional** fields, owned by `snapshot()`/`hydrate()` (they are mutable agent state, and livestock can use them too):

- `lifeStage?: 'juvenile'` (absent = adult)
- `ageSec?: number`
- `motherId?: string`

`hydrate()` re-applies the juvenile scale when `lifeStage === 'juvenile'`. A buried corpse is never snapshotted: the record is removed at the bury tick (C1.5).

New union types go in their owning modules (`WildRecordOrigin`, `WildAnimalSex`; CLAUDE.md: dedicated unions).

### C1.4 Sex (Q035-b)

- `sex = faunaEventRandom(seed, 'sex:' + animalId)() < 0.5 ? 'female' : 'male'` at creation. It is stored in the record, never re-derived, so a later formula change cannot flip existing animals.
- **Forced female:** a ring adult that is `motherIndex` of a planned juvenile.
- `AnimalAgent` gets a readonly `sex` constructor field (default `'female'` for livestock/tests is fine; livestock ignores it). There is **no behaviour change** in C1–C4. Sex only gates births.

### C1.5 Death, removal, transfer

- **Death** is unchanged: `collapse()` → `handleAnimalDeath`. The record stays (state `health.dead` + `corpse`) through decay. A dormant record's corpse decays by absolute `deathAtDays` exactly like a live one (Q035-c).
- **Removal** deletes the record, with no tombstone. It happens when:
  - live: the `readyToRemove()` branch of `createFauna.update` (where `markRemoved` already sits for declared slots),
  - dormant: C3 `advance()` reaches `deathAtDays + corpseLingerDays(meatHarvested)`,
  - bury: removal at the disposal tick.
- **Spawner accounting:** a death of a **dormant** record (threat bubble only, C3) must call the same accounting as `handleAnimalDeath`: `deathsThisCycle++` / depletion, then the quest hook. Extract that body into one function that both paths call.
- **Domestic transfer:** there is no path today (C1.0). Rule for any future path: one call `releaseWildRecord(animalId) → AnimalSaveState`, in the same frame as the new owner's adoption. It removes the record and its habitat membership. It is **not** a death (no `deathsThisCycle`), it frees capacity, and it clears `animalToSpawner`. Invariant (assert in dev/tests): a wild record's `state.owner` is absent or `{ kind: 'none' }`.

### C1.6 Event-keyed randomness (implemented in C4)

Helper: `faunaEventRandom(seed, key) = settlementFaunaSiteRandom(seed, key)`. It reuses the existing FNV-1a seeding and is renamed or wrapped in one place, not duplicated.

| Use (site) | Key |
| --- | --- |
| life init (1866) | `life:<animalId>` |
| sex | `sex:<animalId>` |
| post-build creation placement + mother pick (respawn/birth/immigration; replaces the shared stream for **all** groups incl. home after the build) | `birth:<habitatId>:<seq>` |
| rabies bite (4861) | `rabies:<attackerId>:<targetId>:<floor(nowDays × 1440)>` |
| den-trip destination (createFauna daily loop) | `trip:<spawnerId>:<dayIndex>` |
| livestock production/wool stagger (3443/3487) | `prod:<animalId>` / `wool:<animalId>` |
| wander/idle/side pick (3389, 5681, 5683, 5853) | per-agent stream `wander:<animalId>`, re-seeded on construct/hydrate, **cursor not persisted** |
| threat-bubble encounter step (C3) | `threat:<npcId>:<stepIndex>` |

The home **build-time** draws (ring, sites, initial fill placement) stay on the shared `0xfa11` stream: bit-identical.

**Wander tolerance:** the trajectory after a promote or reload may differ from an uninterrupted run. Authoritative fields (identity, HP, needs, lifecycle, counts) must not.

### C1.7 Persistence (implemented in C2) — v61 → v62

- `SaveSpawnPoint` gains optional fields:
  - `nextBirthSeq?: number`
  - `daysSinceLastRespawn?: number` (fixes the partial-timer loss)
  - `advancedAtDays?: number` (lifecycle cursor, for dormant catch-up)

  Rows stay sparse, but a row with `nextBirthSeq > 0` or a non-zero timer is non-default and must be written.
- New optional `SaveData.wildFauna?: { groups: { id: string, initializedAtDays: number }[], records: WildFaunaRecord[] }`, sorted by id on write. Declared occupants keep `persistentHabitatOccupants`, unchanged.
- **Migration 61 → 62:** identity (`wildFauna` absent). Load rule: a group without an `initialized` row runs today's deterministic initial build/fill (full if active, none otherwise). Old saves therefore behave exactly as today: one last resurrection at migration, then durable. Spawner rows without the new fields default to `nextBirthSeq = 0` (only safe because no records exist for them).
- **Rebuild** (`worldBundle.ts` ≈ 2701 carry): the same `snapshot → restore` as save/load (one path, R2).
- Stale spawner rows/records whose habitat no longer exists are kept until an epoch bump (LOOSE-ENDS policy). They are never silently deleted.
- **Epoch impact: none.** C1–C4 move no site and no home position. Non-home site moves from C0 happened before any save referred to them.
- Size estimate 🟡: ≈ 0.3–0.5 kB per record, ≈ 26 records per settlement group → ~10 kB per visited settlement. Measure in F3 (R8 metric list).

### C1.8 Activation (implemented in C2): positional, not membership-based

- `habitatId` is the **lifecycle membership** (capacity, births, accounting). **Activation is positional:** a record is active iff its position lies inside an **activation disk** of a materialized group: centre + `footprintRadius` + outer den ring + margin. Home's disk is always active. F3/F4 drivers supply disks.
- On group materialize, promote all dormant records (any habitat) inside the new disk. On dematerialize or a disk change, demote live agents outside every remaining disk. Both are amortized through a budgeted queue (≤ N promotions per frame; N 🟡, R8). A daily pass also demotes stragglers that wandered out of every disk.
- **Engaged agents** (`updateImportance === 'immediate'`) defer their own demotion up to `ENGAGED_DEMATERIALIZE_TIMEOUT_SEC`. After that they are demoted **losslessly**, and every consumer handle is cancelled by durable id:
  - NPC hunt target (`HuntTarget.animalId` re-validation fails → the existing lost-target path),
  - den trip (`settlementTripAnimalBySpawner` entry cleared),
  - combat target handles.

  Quest `invalidated` protection is unchanged until C2 is browser-verified (plan § Decisions).
- A promote re-creates the agent with `explicitAnimalId`, the record's constructor inputs, then `hydrate(state)` **after** C3 `advance(record, record.advancedAtDays, now)`.

### C1.9 Coverage of review 035 § Verification (snapshot cases)

| Case | Covered by |
| --- | --- |
| wounded (HP, `physicalInjury`) | `AnimalSaveState` (existing fields) |
| juvenile + mother link | new `lifeStage`/`ageSec`/`motherId`; the mother is promoted by id. If the mother is dormant, the juvenile's lookup fails, and the existing loss path clears `motherId` (same as a dead mother) |
| infected | `rabid` (existing) |
| dead / harvested / buried | corpse in state; removal rules C1.5 |
| partial active / depleted population | records + spawner row (`daysSinceLastRespawn`, `nextBirthSeq`, `state`, `deathsThisCycle`) |
| stream out/in, save/load, rebuild, time skip | one snapshot shape; one `advance()` (C3) |
| no resurrection / lost ids / duplicate ownership | no replay once the group is `initialized`; monotonic `seq`; one agent per record (assert); release on domestic transfer |
| persistent occupants reserve capacity incl. corpse | unchanged `ordinaryHabitatCapacity` |

### C3 contract — common world-time transition (Q035-a (a) + threat bubble, Q035-b (c))

**Entry point** (pure, in `faunaGroupLifecycle.ts`, which owns the lifecycle math today):

```ts
advanceWildHabitat(input: {
  spawner: PreySpawner, records: WildFaunaRecord[], fromDays: number, toDays: number,
  seed: number, countKindNear: (kind, x, z, r) => number,
}): { events: WildFaunaEvent[] }  // births, immigrations, removals — applied by the caller in order
```

Callers, all on **one** path:

- dormant habitat on promote/load,
- time-skip: loaded habitats `snapshot → advance → hydrate`; this replaces `AnimalAgent.resolveTimeSkip` for wild records, while livestock keeps its path,
- unloaded habitats on skip end.

**Per record (conservation, Q035-a (a)):**

- Juvenile `ageSec` += elapsed real-equivalent seconds; maturity uses the same `JUVENILE_MATURITY_SECONDS` rule.
- Injury: the existing lazy `injuryRecovery` resolve at `toDays`.
- Needs: `tickAnimalLife` math, then **clamped to a resting ceiling** (`OFFSCREEN_NEED_CEILING` 🟡 = the species' "seek food/water" threshold): dormant animals are presumed to forage. There is **no starvation death offscreen**.
- Corpses: decay/removal by absolute days.
- Position is frozen (except bubble outcomes).
- No predation, combat, foraging-resource use or movement.

**Per habitat (event-driven, not 0.25-day quanta):**

- The next respawn event is at `lastRespawn + respawnIntervalDays`. Events are processed in order `(atDays, habitatId, key)` across all habitats advanced in one call.
- At each event, if the live count of habitat members `< ordinaryHabitatCapacity`:
  - **birth** if an alive adult female of the kind exists in the habitat (pick by `birth:<habitatId>:<seq>` over candidates sorted by id) → juvenile with `motherId`, placed near the mother;
  - otherwise **immigration** of an adult at the spawner, but **only if the habitat has no living member** (author rule);
  - otherwise no event.
- ❓ **Queue §3 Q160-a (open):** under the strict rule, a habitat left with only males stays below capacity until they die, which is less replenishment than today. Options: strict / immigration also when no adult female (recommended) / immigration whenever no birth is possible. C3 implements whichever the author picks; it is not changed silently.
- The **recovery predicate** (`disabled`/`recovering`) counts alive records of the kind within `SPAWNER_RADIUS` of the spawner (active + dormant), the same predicate as live. This fixes the R3 bound-vs-nearby divergence. Daily checks run at integer `dayIndex` boundaries, as live.
- Depletion: the same `deathsThisCycle` rules (only bubble deaths can occur dormant).
- **No 120-day cap.** The work is bounded by capacity: once full, no events. A > 120-day test is required.
- Wolf-den problem activation + settlement trips are **excluded offscreen**. Home dens are always loaded (pinned), and non-home dens do not run the scenario (Q142-a (b)). Trip windows simply elapse.

**Live path changes needed for parity (C3):** live respawn uses the same capacity rule and the same birth-vs-immigration choice, via the shared pure helper. Otherwise loaded and unloaded habitats would diverge by construction.

**Written tolerances (differential tests loaded vs unloaded vs skip):**

| Quantity | Tolerance |
| --- | --- |
| identity set, sex, origin, mother links, alive/dead, corpse phase | exact |
| habitat counts, spawner state, `deathsThisCycle`, `nextBirthSeq` | exact |
| event times (respawn/birth/immigration/maturity/removal) | loaded fires at the first frame ≥ due: ≤ one test frame step (tests use 0.01 day) |
| needs | loaded may be lower (animals forage); dormant ≤ ceiling. Assert dormant ≤ ceiling and live never starves *because of* a dormant span |
| position/trajectory | not compared (frozen dormant; wander stream tolerance C1.6) |
| predation/combat/foraging | absent offscreen (listed in `docs/state/fauna.md` as an approximation, F5) |

### C3 threat bubble (Q035-a addition)

- **Hook:** `resolveNpcTravelCheckpoint(state, nowDays, dayLengthSec)` gets an optional injected port `OffscreenTravelThreats`. It is called for the same `[fromDays, toDays]` interval, **after** the survival step and before the arrival step, and is idempotent through its own cursor `threatResolvedAtDays` on `NpcTravelContinuity` (beside `survivalResolvedAtDays`). This adds one optional save field to NPC travel, within the same v62 bump. The composition root wires the port to fauna (`SettlementsManager` call sites); there is no fauna import in `ai/`.
- **Fauna side** (`createFauna` owns the query, dormant records only; loaded animals use the live threat path):
  1. Sample the traveller path with `interpolateNpcTravelPosition` at fixed world-time steps (`THREAT_STEP_DAYS` 🟡 ≈ 1/48 day), `stepIndex = floor(atDays / THREAT_STEP_DAYS)` (partition-independent).
  2. Candidates: alive adult dormant records with `humanDanger` (the existing projection used by `destinationThreatHooks`) > 0 within `THREAT_BUBBLE_RADIUS` 🟡.
  3. The encounter roll is keyed `threat:<npcId>:<stepIndex>`.
  4. On an encounter: resolve the fight with one pure function `resolveOffscreenTravelEncounter(party, predators, rng)` → HP/injury deltas for both sides. Write back to the NPC (existing health/injury owner; death → travel `cannot-progress`, the existing semantics world-032 observes) and to the records (HP, death via the C1.5 dormant-death accounting, position moved to the encounter point).
  5. Traveller order: by `npcId`; steps in chronological order.
- **Who resolves:** fauna owns predator selection and record write-back. The NPC owner applies the traveller deltas. settlements-npcs-051 (planned) later owns party cooperation, and world-032 (draft) observes failure. Neither is a prerequisite: C3 supplies a solo/party-size-aware resolver.
- 🟡 **Resolver numbers** (encounter chance per step, rounds, damage) come from existing `ANIMAL_DEFS` attack values and NPC combat stats. **C3 Stop if:** NPC combat stats needed for the resolver do not exist → §3 question instead of inventing a combat model.
- **Roles:** applies to every offscreen-executing traveller (merchant ✅, expedition members incl. hunters ✅). "Knight" has no role in code; the port takes the NPC's role so a future role-specific rule hooks in without a contract change.
