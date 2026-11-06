# 035 — Continent-wide wild fauna architecture

Date: 2026-11-06. Scope: fauna-050 F1–F5 and its living-world contracts.
Reviewer: Codex (independent architectural review; requested Astra identity is not independently verified).
Source baseline: `bd3f280c`; local repository remote is `jm-sky/seedvale-v1`.

## Executive verdict: REWORK REQUIRED

Do not enable F3 or integrate F4 under the current continuity contract. Pure geography census and contract preparation may proceed. F1 is a useful extraction; F2 is useful streaming infrastructure, but its authoritative state is insufficient for the requested persistent, deterministic wildlife. This is not a recommendation to delete existing behaviours or lower density.

The design explicitly discards ordinary individuals and simulates only spawner replenishment while absent. That preserves some habitat depletion, not animals, predator/prey interactions or an autonomous ecology. Existing V1 has this limitation on reload; F2 would make it a routine travel operation. The plan's claim of “no simulation reduction” therefore does not follow from preserving the loaded AnimalAgent code. CLAUDE.md and ARCHITECTURE.md require authority separate from presentation and warn against equating terrain residency with simulation presence.

No P0 found. P1 means a blocker to this expansion/continuity objective, not a claim that an already enabled F3 is breaking production. F3 has no current production caller; F4 is unimplemented. Confirmed defects below are established by source paths, not browser reproduction.

## Evidence and verification

Read the strategic decisions, queue, review matrix, fauna-050 plan and complete implementation notes, fauna/persistence state references and code index. Followed actual entry point `src/fauna/createFauna.ts` (the requested `src/world/createFauna.ts` does not exist), `AnimalAgent.ts`, `AnimalSpawner.ts`, `faunaGroupLifecycle.ts`, settlement planner, `worldBundle.ts`, settlement lifecycle and hunting seams. Architecture documentation explicitly acknowledges wild identity/save limitations; they are not newly discovered features of F2.

Executed `pnpm vitest run src/fauna/faunaGroupLifecycle.test.ts src/fauna/createFauna.groups.test.ts src/fauna/settlementFaunaHabitats.test.ts`: **3 files / 37 tests passed**, 6.43 s. No browser, gameplay, real-asset, full-suite, build or performance verification performed. No runtime code changed. The group integration tests use mocked GLB failure/fallbacks and flat terrain. Golden placement uses synthetic terrain, not the current continent.

Latest baseline commit closes hydrology 061 H3–H6; do not retain an obsolete assumption that H6 is necessarily unfinished. Its completion does not validate fauna sites against the resulting geography.

## Findings

### R1 · P1 · Confirmed contract failure: individuals are disposable authority

`createFauna.doDematerializeGroup` captures declared persistent occupants, counts ordinary survivors, then disposes every group member. `fillGroupPopulation` creates new agents; `spawnAgent` assigns ordinary IDs using `nextAnimalId++` (around lines 779–818). `doMaterializeGroup` also replays `spawnRing` without death records. Wounds, needs, positions, juvenile/mother relationships, disease, corpses and pursuit state are not retained for ordinary animals. Ring kills are undone by a group reload; bound survivors become fresh individuals even when their number is preserved. Materialization order changes IDs.

This contradicts stable identity across streaming and undermines tracking, hunting and ownership transfer. `huntingHooks.shouldSkipForPopulationProtection` hashes animal ID, so changed identity can change even its deterministic decision. Existing architecture documents invalidate ordinary wild quest bindings on save restore rather than silently rebinding; preserve that protection until real durable identity exists.

**Minimum correction:** durable world-owned animal records, stable birth identities and death/removal records before enabling group eviction. Reuse `AnimalSaveState` and persistent-occupant snapshot patterns; extend the existing fauna owner, not a second competing fauna registry. Transfer ownership atomically when an animal becomes domestic; group membership must no longer imply permission to delete it.

### R2 · P1 · Confirmed save/rebuild divergence

`CarriedSpawnerStore.carry` retains `atDays`, `boundCount`, `daysSinceLastRespawn` only in `runtime`; `snapshot` drops them. Constructor restore has no runtime data. `materializedPopulation` then fills an active saved spawner to ordinary capacity and fills non-active ones with zero. `worldBundle.ts` around 2701 reconstructs through this same thin snapshot.

Concrete counterexample: active capacity-four habitat with one survivor, unloaded and immediately reloaded in-session, yields one survivor; inserting save/load or bundle rebuild yields four, with no recovery time. A depleted habitat's survivors are also lost after serialization. The test named “carry() keeps runtime data out of the persisted rows” positively verifies the information loss; the disabled-state round-trip test cannot establish population parity.

**Minimum correction:** persist the necessary occupancy/identity and advancement cursor, including partial timer semantics. This changes persisted representation/semantics: apply the repository save migration policy, rather than using unchanged JSON shape as evidence of compatibility. Keep the live/carried union, which correctly fixes loss of unmaterialized spawner rows.

### R3 · P1 · Confirmed: catch-up is not the live simulation

`catchUpSpawnerLifecycle` runs three replenishment functions in 0.25-day steps, capped at 120 days. It has no predation, starvation, foraging resource consumption, movement, injury, disease, birth or corpse events. Daily disabled recovery uses bound count; live `createFauna.update` counts nearby same-kind animals, including neighbours. Two bound animals away from a den can therefore activate it offscreen but not live; two unbound neighbours can produce the reverse result.

Live daily code also activates wolf-den problems and settlement trips; catch-up omits both. `faunaGroupLifecycle.test.ts::continuousTick` reproduces the virtual-count simplification, not the full live pipeline, and permits residual timer error up to 0.26 days. Passing it proves a bounded timer approximation for six fixtures, not continuous ecological equivalence. The 120-day fixed-point assertion needs proof for every supported scenario, especially before adding births, migration or external pressure.

`Fauna.resolveTimeSkip` advances materialized agents; `AnimalAgent.resolveTimeSkip` explicitly advances needs/age without replaying movement/combat. Unloaded groups only receive spawner catch-up. Equal elapsed time therefore has distinct semantic paths.

**Minimum correction:** specify a common world-time transition contract and deterministic event ordering. Offscreen updates must preserve relevant outcomes and resource accounting. Exact spatial trajectories need not match at all detail levels, but accepted abstraction/error must be explicit. Never describe timer parity as ecology parity.

### R4 · P1 · Confirmed determinism gap, partly inherited

`AnimalAgent` initializes life with `Math.random()` (line 1863); wandering and rabies infection also use uncontrolled randomness. Per-site seeded placement does not make behaviour deterministic. Additionally, `spawnHabitatPopulation` calls `findWalkableNear` with its default shared RNG, rather than a site-owned stream: stable planned anchors do not guarantee order-independent individual placement. Existing golden tests check planner output, not this complete path.

**Minimum correction:** entity/event-keyed random streams with durable cursors or deterministic event keys; stable ordering of simultaneous births/deaths/interactions. Test complete authoritative snapshots under reversed group loading order, changed frame partitions and save/rebuild insertion. Do not infer determinism from equal seeds alone.

### R5 · P1 · Confirmed latent F3 geography and destination defects

`worldBundle.buildFauna` gathers `roadCorridorsNear` only around home. `createFauna.onRoad` closes over that fixed array; `doMaterializeGroup` reuses it for distant groups. Thus a remote road absent from the home query cannot exclude a remote site. Per-group RNG does not repair the missing geography input.

The daily wolf-den trip loop runs over all live spawners but supplies the captured home `settlementCenter` and `footprintRadius` to `findSettlementOutskirtsDestination` (around 1582). If remote scenario activation is allowed, wolves can receive home-directed trips. Q142-a acknowledges scenario scope but not a substitute destination owner.

**Minimum correction:** bounded authoritative road queries at the candidate location and explicit habitat-to-settlement destination association. Test remote roads and two settlements with different centres. Do not enable F3 until both are resolved or the remote scenario path is explicitly excluded.

### R6 · P1 · Confirmed eviction policy; interaction failures remain a risk

Pending eviction forcibly calls `doDematerializeGroup` after 20 real seconds even if an agent remains engaged. Membership follows original ring/spawner IDs, not current location. A travelling/chasing animal can consequently be removed because its source settlement unloads. Fresh materialization cancellation is tested; survival of an ongoing real pursuit beyond the timeout is not.

**Minimum correction:** bounded presentation cost through spatial activation and ownership transfer, not deletion of authoritative combatants. Resolve consumer handles by durable IDs; explicitly cancel or reconnect NPC hunt/combat/player tracking references. No evidence here establishes an actual stale-reference crash, duplicate domestic animal or exploitable loot duplication; those are integration risks requiring tests.

### R7 · P2 · Geography determinism and habitat suitability remain unproven

F1's “pure” planner invokes hooks that carve/scorch terrain during planning; implementation notes confirm later samples observe these edits. Cached plans stabilize one instance, but not necessarily reversed first-visit order, overlapping groups or rebuild after player terrain changes. Separate immutable geographical suitability from deterministic system edits and persisted player changes. Give each habitat a stable identity and input revision; obey epoch policy if placement/IDs change.

F4's proposed 384 m cells are a discovery/index partition, not an ecological territory model. Independent 0–2 sites can create seams, repeated patterns and holes; settlement rings plus wilderness sites can double density at their boundaries. Use deterministic candidate priority and cross-cell exclusion with a halo. Classify against final relief, forest/biome and authoritative hydrology, not visible water meshes. Mountain passes, disconnected banks and wetlands need reachability/suitable dry resting ground, not only a centre-point height test. These are risks of the proposed F4, not defects in a nonexistent wilderness planner.

### R8 · P2 · Scalability budget is incomplete and unmeasured

Home remains pinned while remote groups add agents. Settlement streaming and terrain residency have different extents; remote dens may extend beyond resident ground. Resident-ground sampling can hold movement rather than supply an offscreen simulation. Whole-group activation produces bursts; the one-group-per-frame limit is implemented for deferred eviction, not a general budgeted materialization queue.

`groups` retains cached plans after eviction; carried rows and `terrainEditedKeys` also retain visited-world state. This is bounded by a finite world but grows with exploration. `groupAgents` filters all agents and removal creates transient arrays/sets; props and labels are recreated. Daily recovery scans agents per eligible spawner, hunting queries scan live candidates. None establishes an unacceptable measured cost, but all belong in the budget alongside agent updates.

Measure resident/active/authoritative counts separately, heap plateau after repeated routes, retained visited-site state, birth/death tombstone growth, save size, catch-up latency, frame tails, draw calls and GC. Sparse defaults must not discard non-default lifecycle state. Prefer bounded due-event scheduling and spatial indexes; keep pure planning/coarse updates worker-compatible, but establish ordering/transfer costs before moving them. Do not lower ecological density or remove behaviour to meet an unmeasured budget.

### R9 · P3 · Completion labels overstate the established contract

F1 lacks its measured WSL baseline and real-world home verification. F2 passes useful tests but not its intended end-to-end continuity gate; notes honestly disclose the limitations. F5's “docs match code” criterion is insufficient as final verification of this expansion. Retaining stale spawner rows also needs an explicit epoch/migration policy; silently deleting unknown IDs could destroy valid unloaded state.

## Architecture alternatives and recommendation

1. **Current thin spawner projection:** cheapest and suitable for replenishing encounters; reject for this task because absence erases individual history and most ecological causes.
2. **Every AnimalAgent active everywhere:** retains more behaviour but binds world scale to Three.js/runtime-agent costs, still lacks deterministic persistence, and cannot use resident terrain for continental traversal. Reject as the default solution.
3. **Recommended: one world-owned fauna authority with streamed views and simulation detail levels.** Habitat catalog owns stable geography; fauna owns durable individuals, populations, relations, deaths and timestamps; active agents project those records and execute detailed local behaviour. A common deterministic scheduler advances offscreen needs, resource use, population and interactions at a bounded cadence or by events. Terrain and settlement callbacks request presentation/activation, never create a new ecological history.

Start with existing snapshot and occupant machinery and existing world-time seams. Do not introduce a general-purpose ecosystem engine before specifying required transitions. Aggregate unobserved cohorts only if stable individual identity, tracked animals and conservation can be preserved; promotion/demotion and migration across habitats must be lossless. Exact per-individual records are simpler semantically but require memory/serialization measurements. Neither alternative is automatically cheap.

Reproduction must be distinguished from timed replenishment: current catch-up's count increment does not prove mating, parents, food cost or juvenile continuity. Agree whether replenishment represents migration or birth, then preserve those causes across loading. Predator prey depletion and corpse scavenging must affect the same authoritative resources used by loaded animals and NPC hunters.

## F1–F5 readiness

| Stage | Actual state | Review gate |
| --- | --- | --- |
| F1 | Extracted; synthetic golden tests pass | Retain; baseline and real geography/home checks outstanding; planner side effects need a frozen-input contract |
| F2 | Group/store API implemented, not wired remotely | Rework R1–R4/R6; save union is reusable; no autonomous-continuity acceptance |
| F3 | Queue ready; remote production lifecycle not wired | Hold activation; resolve R5, scenario scope and atomic settlement acceptance/unload/rollback ownership first |
| F4 | Planner/driver/census not implemented | Census and pure design may proceed; runtime blocked on corrected authority; use latest geography freezes |
| F5 | Documentation/handoff planned | Expand verification evidence before closure; document remaining simulation approximations explicitly |

## Minimal correction sequence and author decisions

First specify durable identity, deaths, population advancement and save/rebuild equivalence; then extend the existing fauna owner and persistence representation. Fix geographic query/destination ownership and replace forced interaction eviction. Only then wire one non-home settlement behind the existing toggle, validate it, and expand wilderness planning. This is a review recommendation, not an automatic plan rewrite or approval of runtime work.

Author approval is needed for the offscreen ecological abstraction and allowable approximation, birth versus immigration semantics, durable corpse/removal retention policy, and scope of the resulting fauna-050 revision. Existing Q141-a belt calibration and Q142-a wolf-den scenario choices remain open. Preserve the approved home-like density and habitat-bound replenishment direction; these approvals do not authorize dropping identity or ecology. Save migration implementation and habitat placement/epoch effects must be explicitly included in the revised scope. No decision is required merely to acknowledge the confirmed losses above.

## Verification required before integration

- Snapshot equivalence: wounded/juvenile/infected/dead/harvested animals, partial active and depleted populations; stream out/in, save/load, bundle rebuild and time skip; no resurrection, lost IDs or duplicated ownership.
- Differential evolution: loaded versus unloaded versus skip, including neighbours entering a recovery radius, predation, food depletion, death, migration and wolf-den activation. Include fractional boundaries and absences beyond 120 days; specify tolerated approximation instead of asserting exact parity.
- Determinism: both seeds 42 and 415424794, reversed group order, frame partitions, identical event inputs and save insertion; compare identity, random state, needs and lifecycle, not only sites/counts.
- Integration: NPC hunter/guard target during eviction; quest target and destroyed spawner queried unloaded; player lead/ownership transfer; long pursuit; settlement async accept/rollback and late fauna initialization; group overlap and habitat crossing. Persistent occupants must reserve capacity through corpse/tombstone and never duplicate.
- Geography census: immutable revision, full-continent capacity/site density by land cover, empty/overdense windows, safety belts, road and river clearance, lake/wetland edges, steep slopes/passes and reachable territory. Include boundary halos and settlement/wilderness overlap; repeat after relevant biome/road changes.
- Performance: reference home, neighbour travel, dense wilderness and repeated boundary oscillation; toggle A/B on matched WSL baseline, then separate native Windows confirmation. Record p95/p99 frame and fauna cost, transition maxima, memory/GC, save size and long-absence catch-up. Real assets and browser observations are required for visual/interaction acceptance.

Passing the existing 37 tests remains useful regression evidence. It does not change the REWORK REQUIRED verdict for continent-wide autonomous wildlife.
