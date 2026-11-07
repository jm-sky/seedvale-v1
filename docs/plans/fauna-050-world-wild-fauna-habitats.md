# Plan: Wild fauna across the world — settlement and wilderness habitats

**Created:** 2026-11-05
**Status:** `in progress` 🔄 — **rework after [review 035](../reviews/2026-11-06--035--continent-wide-wild-fauna-architecture-review.md) (REWORK REQUIRED, 2026-11-06):** F3/F4 runtime on hold until the continuity slices C1–C4 below land; see [§ Review 035 response](#review-035-response-2026-11-06)
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** world-terrain-060 world-terrain-061
**Implementation notes:** [fauna-050 notes](implementation-notes/fauna-050-world-wild-fauna-habitats-implementation-notes.md) (F1 extracted 2026-11-05 — baseline + home browser check outstanding; F2 streaming infrastructure 2026-11-05 — continuity contract reworked by C1–C4)
**Queue:** Q139 (plan); F3 needs Q133 (phantom closed-pressure sites); F4 final numbers after the 060 R4 / 061 H6 freezes
**Domain:** `fauna`
**Subdomains:** `population` `lifecycle`
**Tags:** `gameplay` `persistence` `performance` `worldgen`

## Goal

Wild fauna exists across the whole continent, not only around the home settlement (author, Q134 (a), 2026-11-04). Every settlement has its own fauna surroundings, with a safety belt sized for that settlement. Between settlements, wilderness has habitats chosen by land cover (forest, rock/ridge, shore/wetland). Danger and game come from **where you are**, not from how close you are to the starting village.

No simulation reduction: species behaviour, spawner lifecycle, predator/prey and village avoidance stay exactly as they are today. **Since review 035 this also means: streaming must not erase individuals.** Unloading a group demotes its animals to durable world-owned records; it never deletes or re-creates them. Keeping the loaded `AnimalAgent` code unchanged is not enough on its own.

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
2. **Authoritative state is world-level and player-independent** (revised after review 035). This covers:
   - habitat site lists (deterministic from seed + frozen terrain inputs),
   - spawner lifecycle (persisted per id, day-anchored, with an advancement cursor),
   - **every wild individual as a durable record** (C1): stable birth id, kind, life stage/age, HP, needs, position, mother link, infection, habitat membership, alive/dead + corpse timeline.

   A live `AnimalAgent` is a **projection** of its record. Materialize = promote (record → agent), dematerialize = demote (agent → record), both lossless. ~~Deaths only happen to materialized animals~~ is replaced by the common world-time transition (C3): the same rules advance an animal whether its group is loaded, unloaded or time-skipped, within an explicitly documented tolerance.
3. **Home placement stays bit-identical** in F1–F3: same sites, positions and build-time RNG stream. Golden test by planner index. Ordinary ids move to the durable scheme (`<group>:ring:r<i>`, `<spawnerId>:b<seq>`, C1.2); no persisted reference to ordinary ids exists.
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

> **Superseded in part by review 035.** The bullets below describe what F2 implemented. Three of its rules are replaced by C1–C4: individuals are disposed on unload, the 20 s timeout forcibly evicts engaged agents, and the save keeps only thin spawner rows. Keep the save union and the cached site plan.

- `materializeGroup(group, nowDays)`:
  - creates spawner props and spawners,
  - restores saved state from a carried `savedSpawnerState` map,
  - runs the lazy day catch-up,
  - fills populations through the existing `spawnAgent` and initial-fill paths.
- `dematerializeGroup(groupId)`:
  - records each spawner's live bound count (runtime-only; used for catch-up while unloaded),
  - writes the lifecycle snapshot into the carried map,
  - disposes the group's agents and props.

  **Hysteresis:** an agent that is `immediate` (combat, chase, trip, player-led) delays its group's dematerialization until it disengages or a bounded timeout passes. Corpses of unpersisted wild animals vanish with the group, the same as on reload today. *(F2; replaced by C2: demotion keeps the record, including the corpse timeline.)*
- **Save:** `getSpawners()` keeps meaning "live spawners". A new `snapshotSpawnPoints()` returns the union of live and carried states and writes only non-default entries. The save shape is unchanged (`SaveSpawnPoint[]`), so no `CURRENT_SAVE_VERSION` bump; the semantic "subset of world spawners" goes into `docs/state/persistence.md`. *(F2; review 035 R2: this drops the carried runtime on save/rebuild, so a depleted habitat refills to capacity. C2 persists the advancement cursor and the individuals: save bump + migration.)*
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

- **Also measure (review 035 R8):** resident / active / authoritative record counts separately; heap plateau after repeated home ↔ neighbour routes and boundary oscillation; retained visited-site state (`groups` plans, carried rows, `terrainEditedKeys`, tombstones); save size; long-absence catch-up latency; materialization burst frame tails (p95/p99); draw calls; GC. Whole-group activation needs a budgeted materialization queue, not only the deferred-eviction limit.

Over budget → lower per-site capacity or site density, which is an **author decision (§3), not a silent reduction**.

### F4 additions (review 035 R7)

- Deterministic candidate priority + cross-cell exclusion with a halo. A 384 m cell is a discovery/index partition, not a territory.
- An explicit rule for settlement-ring vs wilderness overlap, so density does not double at the boundary.
- Classify against final relief, forest/biome and **authoritative hydrology**, not water meshes.
- Reachability + dry resting ground for passes, disconnected banks and wetlands, not only a centre-point height test.
- Each habitat has a stable id + an input revision; placement/id changes follow the epoch policy.

## Review 035 response (2026-11-06)

Owner response to [review 035](../reviews/2026-11-06--035--continent-wide-wild-fauna-architecture-review.md), written by Opus after checking each finding against the code at `474ce2cb`.

### Findings checked against code

| # | Verdict | Checked where | Response |
| --- | --- | --- | --- |
| R1 identity | ✅ agree | `createFauna.ts` `nextAnimalId++` (≈ 818), `doDematerializeGroup` disposes all members, re-materialize replays the ring | C1 + C2 |
| R2 save/rebuild | ✅ agree — **a real bug, not only a contract gap** | `faunaGroupLifecycle.ts` `snapshot()` writes only `saved`; `materializedPopulation` with no runtime = full fill if `active` | C2 (save bump + migration). Not reachable in production today: no non-home group is materialized (F3 not wired) |
| R3 catch-up ≠ ecology | ✅ agree | `catchUpSpawnerLifecycle` = timers only; daily check uses bound count vs live "nearby same-kind" | C3. Author: conservation-only + traveller threat bubble (Q035-a) |
| R4 randomness | ✅ agree, partly inherited | `AnimalAgent.ts` `Math.random()` at 1863 (life), 4828 (rabies), 5648/5820 (wander); default shared RNG in `findWalkableNear` | C4. Wander keeps a per-agent seeded stream **without a persisted cursor**: an accepted trajectory tolerance, stated in `docs/state/fauna.md` |
| R5 remote roads / trip target | ✅ agree | `worldBundle.buildFauna` queries `roadCorridorsNear` around home only; den-trip loop passes the captured home `settlementCenter`/`footprintRadius` | C0 (no decision needed) |
| R6 forced eviction | ✅ agree | `ENGAGED_DEMATERIALIZE_TIMEOUT_SEC` → `doDematerializeGroup` regardless of engagement | Once demotion is lossless (C2), eviction is harmless for state. C2 adds explicit handle cancel/reconnect by durable id for NPC hunt/combat/quest/player-lead. Ownership moves to the animal's **current position cell**, not its source group |
| R7 planner side effects / F4 seams | 🟡 agree as risk | F1 notes: carving hooks change later samples | Non-home groups plan against frozen inputs, then apply edits (home keeps the golden interleaved order). F4 design gets candidate priority + cross-cell halo exclusion + settlement/wilderness overlap rule + reachability (§ F4 additions) |
| R8 budget | 🟡 agree | — | Metric list added to § Workload budget |
| R9 labels | ✅ agree | — | F1/F2 relabelled in the slice table and notes |

### Decisions taken here (architecture, within the approved scope)

- **One owner.** Durable records live in the existing `createFauna` registry and reuse the `persistentOccupants.ts` pattern (slot key `habitatId:occupantKey`, `PersistentOccupantSaveRecord`, removed-slot tombstones) and `AnimalSaveState`. An ordinary habitat member becomes an occupant whose slot is generated by a birth cursor (`<habitatId>:b<seq>`) instead of declared. There is no second fauna registry and no general ecosystem engine.
- **Stable ids.** Birth id = `<habitatId>:b<seq>`, where `seq` is a per-habitat cursor persisted with the spawner row. Ring individuals of non-home groups become habitat-bound, as Q139-b (a) already requires. Home ring ids stay the same while home placement stays bit-identical (scope: §3 Q035-d).
- **Quest bindings.** The ordinary-wild `invalidated` protection in `QuestManager` stays until C2 is browser-verified. Rebinding by durable id is a later, explicit step.
- **Domestic transfer.** Taming or leading an animal moves its record atomically to the livestock owner and removes it from habitat membership. Membership no longer implies permission to delete.
- **Persistence.** C2 bumps `CURRENT_SAVE_VERSION` and adds a migration. An old save without records keeps today's deterministic initial fill. Stale spawner rows (LOOSE-ENDS) are kept until an epoch bump, never silently deleted.
- **Epoch.** C1/C2 do not move home placement. Planning non-home groups against frozen inputs (C0) moves their sites, but no saves refer to them yet, so this lands inside the next coordinated `WORLDGEN_EPOCH` bump (D3) if one is pending, otherwise in epoch 1, which is still disposable (review 031).
- **Wording.** "Catch-up parity" from now on means **timer parity**, never ecology parity.

### Author answers (2026-11-06, queue §3 Q035-a…d, Q141-a, Q142-a)

- **Q035-a (a) conservation-only offscreen**, with one addition. Travelling NPCs (merchant, knight, hunter) must face **real threats**, so the area around them may be simulated in more detail than the rest of the world. C3 therefore defines a second detail level, the **threat bubble**: wild records near an offscreen travelling NPC (`merchantJourney.ts`, `npcTravel.ts` / `npcExpeditionTravel.ts`) take part in coarse encounter resolution (predator records may engage the traveller; outcomes write back to both records). Everywhere else there is no offscreen predation. 🟡 The traveller-side contract (who resolves the fight, and how it feeds world-032 / settlements-npcs-051) is part of the C1/C3 spec. Knight/hunter traveller roles must be verified in code first; where a role does not exist yet, the bubble only provides the hook.
- **Q035-b (c) mixed replenishment:** birth when an adult female of the kind lives in the habitat (the juvenile gets `motherId`; timing reuses the respawn interval unless C3 specifies otherwise), immigration of an adult when the habitat is empty. 🟡 `AnimalAgent` has no sex attribute today, so the C1 record adds a deterministic sex derived from the birth id.
- **Q160-a (b), 2026-11-07:** refines Q035-b: immigration happens whenever the habitat has no living adult female of the kind (not only when empty), so a male-only remnant never blocks recovery.
- **Q035-c (a):** corpses follow the normal world-time decay (also offscreen) and disappear at 112 h. Only the birth cursor and removed-record tombstones persist, bounded by habitat capacity.
- **Q035-d (a):** home ordinary wild animals become durable too (one rule for the whole world). Home initial placement stays bit-identical; the save gets a bump + migration.
- **Q141-a (a):** provisional belt widths accepted as the starting point. The belt must not be too wide ("it gets boring"); re-tune after the F4 census.
- **Q142-a (b):** the wolf-den problem scenario stays home-only for now (C0 guard). Other dens are ordinary dens.

## Slices

| Slice | Model | Scope | Done when | Stop if |
| --- | --- | --- | --- | --- |
| **F1** | S | Extract `planSettlementFaunaHabitats` + `safetyBeltWidth` (pure) out of `createFauna`; home path uses it; per-site RNG for non-home only; baseline counts (live wild agents near home, `faunaAgentUpdatesMs` WSL) | **extracted, technically verified (synthetic golden).** Outstanding: WSL baseline, home browser check on the real continent | extraction changes home output |
| **F2** | S | Group (de)materialization inside `createFauna`, carried spawner-state map, `snapshotSpawnPoints()` union, lazy catch-up, engaged-agent hysteresis, world-habitat toggle | **streaming infrastructure implemented, not wired.** Continuity contract not met (review 035 R1–R4/R6) → C1–C4. Reused: save union, cached plan, toggle, group map | catch-up cannot match continuous lifecycle without persisting individuals — **hit (review 035)** |
| **C0** | S | Review 035 R5 + R4 (placement) + R7 (non-home): per-group road query at the group anchor (bounded `roadCorridorsNear`), habitat → settlement destination owner on the spawner (den trips use the group's own centre/footprint), explicit home-only guard for the wolf-den scenario until Q142-a, site-owned RNG for `spawnHabitatPopulation`/`findWalkableNear` in non-home groups, non-home planning against frozen inputs then edits; home bit-identical | tests: remote road absent from the home query excludes a remote site; two settlements with different centres → den trip targets its own settlement; reversed group materialization order → identical non-home positions; home golden unchanged | home output changes |
| **C1** | O→S | **spec done 2026-11-07 (Q160, [notes §C1](implementation-notes/fauna-050-world-wild-fauna-habitats-implementation-notes.md#c1--durable-wild-record-spec--c3-world-time-contract-opus-2026-11-07-q160)); implementation folded into C2.** Durable wild record schema inside the existing fauna owner: birth ids + per-habitat cursor, record fields, death/removal records, domestic-transfer rule, event-keyed RNG keys; S row added on completion | spec in notes covers every review 035 §Verification snapshot case; reuse map to `persistentOccupants.ts` / `AnimalSaveState` | needs a second registry |
| **C2** | S | Lossless demote/promote + save/rebuild: records captured on dematerialize, eviction cancels/reconnects handles by durable id, `CURRENT_SAVE_VERSION` bump + migration, rebuild through the same snapshot | snapshot equivalence (wounded/juvenile/infected/dead/harvested, partial + depleted) across stream out/in, save/load, bundle rebuild: no resurrection, lost ids or duplicate ownership; NPC hunter/quest target during eviction; long pursuit across eviction | migration needs data that is not available |
| **C3** | S (contract in notes §C3, 2026-11-07) | Common world-time transition `advance(records, habitat, fromDays, toDays)` used by unloaded catch-up, time-skip (loaded and unloaded) and load, with the abstraction from Q035-a (a) + the traveller threat bubble and Q035-b (c) births/immigration, and deterministic event ordering; recovery predicate counts records within `SPAWNER_RADIUS` (fixes the bound-vs-nearby divergence); wolf-den activation/trips included or explicitly excluded | differential tests loaded vs unloaded vs skip with **written tolerances**, including fractional boundaries, > 120 days, neighbours entering the recovery radius, den activation | tolerance cannot be met without reducing behaviour → §3 |
| **C4** | S | Determinism: entity/event-keyed streams (life init, infection, respawn picks); per-agent seeded wander (cursor not persisted, stated tolerance) | authoritative snapshots equal on seeds 42 + 415424794 under reversed group order, different frame partitions, save insertion | — |
| **F3** | S | **Blocked on C0–C4.** Non-home settlements' groups wired to `SettlementsManager` load/unload; closed-settlement pressure moved into its own settlement's group (after Q133) | headless: walking home → neighbour materializes/dematerializes the neighbour group; type-check, lint, fauna/app/quests suites; WSL A/B (toggle) against budget; browser check at a non-home settlement on `?seed=415424794` (§2); atomic settlement accept/unload/rollback ordering tested (late fauna init) | quest/progression code assumes a single fauna anchor |
| **F4** | O→S | **Census + pure design may proceed; runtime after F3.** Wilderness cells: classifier + planner + terrain-region driver; `pnpm worldgen:fauna:census` (sites and capacity per km² by land cover, min distance to settlements/roads, both seeds) | census both seeds within the author's density answer (§3 Q139-a); no site inside a belt/road/river clearance; WSL A/B against budget; final numbers re-taken after 060 R4 / 061 H6 freezes | budget only met by reducing density below the author's answer → §3 |
| **F5** | S | Docs: `docs/state/fauna.md` (habitat groups, projection boundary, **remaining offscreen approximations listed explicitly**), `docs/state/persistence.md` (wild records + spawner cursor), plan notes; queue §4 Windows Arc A/B handoff | docs match code; review 035 §Verification items each marked verified / handed to §2 / §4 | — |

Ordering (revised 2026-11-06): F1 → F2 → **C0 (done 2026-11-06, technical; den-trip two-centre test deferred to F3) ∥ C1 → C2 → C3 → C4** → F3 → F4 runtime (census tool may run earlier) (tool any time after F2; numbers after the freezes) → F5. Each worldgen-output-affecting slice gets its own census (roadmap cross-plan rules). Fauna sites are not cached, so no cache namespace is involved. Epoch-1 test saves are disposable (review 031).

**Execution sequence (Opus, 2026-11-06 — architecture by Opus, implementation by Sonnet):**

1. ~~**Q160 C1 — one Opus session**~~ (done 2026-11-07) writes in the notes: (a) the durable wild record spec (birth id `<habitatId>:b<seq>` + persisted cursor, deterministic sex from the birth id, fields reused from `AnimalSaveState` / `PersistentOccupantSaveRecord`, death/removal tombstones bounded by capacity, domestic transfer, event-keyed RNG keys, `CURRENT_SAVE_VERSION` 61 → 62 migration shape (v61 landed meanwhile), epoch impact); (b) the **C3 world-time transition contract** incl. the traveller threat bubble hook (verify merchant / knight / hunter traveller roles in `merchantJourney.ts`, `npcTravel.ts`, `npcExpeditionTravel.ts` first) and written tolerances — so C3 needs no second Opus session unless the code disproves the contract; (c) paste-ready S rows for C2, C3 and C4 with done-when and stop-if.
2. **S:** C2 (lossless demote/promote + save/rebuild) → C4 (entity/event-keyed randomness; may follow C2 directly, independent of C3) → C3 implementation.
3. **S:** F3 (wire non-home groups; Q133 done 2026-11-05, so only C0–C4 gate it) → F4 runtime (census/pure planner may run earlier, after 062 B1 when land cover moves) → F5.
4. Living-world lane: runs after or beside the geography main path; fauna rows change no worldgen output, so they never collide with geography cache bumps.

## Author decisions (2026-11-05, queue §3 Q139)

Answered: **Q139-a (a)** and **Q139-b (a)**. Consequences: wilderness density target = home-like (~20–25 live wild animals within ~250 m of the player); the `SPAWNS` lairless ring individuals become habitat-bound (spawner with respawn) for non-home and wilderness groups. Home keeps its current ring in F1–F3 (bit-identical); converting the home ring is a separate, explicit step in F4 with its own census.

Original options:

- **Q139-a — wilderness density:** how many wild animals should be live around the player away from villages? (a) like around home today (~20–25 within ~250 m), recommended; (b) less: wilderness is quieter, danger comes in clusters; (c) more than home.
- **Q139-b — ring individuals without a lair** (wolf/fox/rabbit/duck/boar from `SPAWNS`): today they never respawn after being killed (until reload). In the world: (a) everything tied to habitats with respawn (killing a pack has a lasting effect, the area recovers slowly), recommended; (b) keep as is.

## Notes

- Out of scope: new species, (T,P) biomes (062), fauna on footpaths/landmarks (Q140), any change to `AnimalAgent` behaviour.
- fauna-048 (village query scaling) becomes more relevant once more settlements and groups are live. Re-check its ROI gate after F3.
