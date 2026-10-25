# Seedvale V1 Revival — R2: Architecture & Simulation

**Created at:** 2026-10-25  
**Created by:** ChatGPT GPT-6  
**Status:** `done` — comparative source research; runtime acceptance and comparable performance measurements are not implied.  
**Purpose:** evidence for Astra's decisions, not an architecture selection, migration roadmap or implementation authorization.

## 1. Executive summary

V1 has substantial reusable architecture, not merely atmosphere and content. Its persistent NPC state, household and settlement inventories, atomic production executor, source-accounting ledger, offscreen travel handoffs, agricultural catch-up, habitat recovery, worker-backed terrain pipeline and bounded caches already solve problems that V3 has either deferred or solved for a narrower workload. These mechanisms should be treated as preservation requirements before evaluating cleaner replacements. [E01](#e01-v1-composition-and-lifecycle) [E04](#e04-v1-settlement-continuity) [E06](#e06-v1-economy) [E08](#e08-v1-fauna)

The strongest potential improvements are **selective**, particularly V3's reusable A* scratch arrays and heap, explicit navigation result states and bounded preparation, V2/V3's mechanically checked dependency boundaries, and V3's serialized save operations, revision checks and staged publication. None establishes that a complete V3 runtime would improve V1. V1 already has local A*, stuck recovery, fauna spatial indexing, throttled animal work, terrain workers, vegetation batching and controlled shadows. Rebuilding these under new names would duplicate working owners. [E03](#e03-v1-navigation) [E09](#e09-v1-spatial-queries) [E15](#e15-v2-layering-and-diagnostics) [E19](#e19-v3-navigation) [E24](#e24-v3-save-boundary)

Three particularly consequential qualifications:

- **V1's deterministic foundation is not deterministic replay of all simulation.** `NpcAgent` uses `Math.random()` for reactions, wandering and recovery; `gameLoop.tick()` clamps frame delta to 0.05 s. Seeded generation, reproducible helper functions and a fully replayable session are different guarantees. V2 saves an RNG cursor, but does not save system interval accumulators. V3 preserves per-resident RNG/state at its save checkpoint while explicitly dropping Far execution. [E02](#e02-v1-time-and-randomness) [E12](#e12-v2-simulation-root-and-time) [E17](#e17-v3-live-npc-runtime)
- **V3's generic scheduler is not the production NPC clock driver.** `AgentScheduler` exists and is tested; live residents are composed by `NpcLiveHost` and `NpcG2Consumer` through `SessionSimulation` closed boundaries. Both the generic scheduler and the live host exclude Far execution; the live host cancels Far goals and drops pending elapsed without catch-up. Importing that policy would remove V1's selective offscreen travel/economy continuity. [E16](#e16-v3-agent-registry-grid-and-generic-scheduler) [E17](#e17-v3-live-npc-runtime) [E18](#e18-v3-world-step-and-clocks)
- **Historical performance figures cannot rank the versions.** V1's September stream/settlement captures, V2's Node simulation and Windows/SwiftShader captures, and V3's navigation replay use different scenes, populations, time semantics and hardware. The V3 cache experiment proves a large improvement within V3's own corpus; it does not prove a speedup over V1. Reducing population, detail, effects or simulated behavior is not an acceptable performance claim for this revival. [E10](#e10-v1-performance-evidence) [E15](#e15-v2-layering-and-diagnostics) [E22](#e22-v3-navigation-measurements-and-prior-comparison)

### Snapshot and method

All three `main` heads were pinned before inspection; subsequent source statements and links refer to these immutable commits:

| Version | Repository | Analyzed commit |
|---|---|---|
| V1 | `jm-sky/seedvale-v1` | [`00a1e0332aa034104d9021e82b0bf5299c4216e1`](https://github.com/jm-sky/seedvale-v1/commit/00a1e0332aa034104d9021e82b0bf5299c4216e1) |
| V2 | `jm-sky/seedvales-v2` | [`9ba54815493b886eb1bdce032f5209aeb2856c37`](https://github.com/jm-sky/seedvales-v2/commit/9ba54815493b886eb1bdce032f5209aeb2856c37) |
| V3 | `jm-sky/seedvale` | [`17a81bd1ea0cea1920525a92b52d754e155a3ead`](https://github.com/jm-sky/seedvale/commit/17a81bd1ea0cea1920525a92b52d754e155a3ead) |

Method: GitHub repository trees, repository instructions, targeted documentation and source/test inspection. No application code, settings, budgets or quality profiles were changed. No game tests, builds, browser runs, GPU benchmarks or simulation soaks were executed for R2. Historical test/measurement evidence is attributed to its source, not presented as independently reproduced here. Listed test cases were inspected where specified; additional test files identified in the trees are marked as located only.

V1 preparation included `CLAUDE.md`, `CODE_INDEX`, `STATE`, architecture, persistence and performance owners and the plans index. V2 preparation included `CLAUDE.md`, the documentation index, code map and relevant state/performance material. V3 preparation included `AGENTS.md`, `CLAUDE.md`, the documentation index, port ledger, architecture comparison and navigation research. [R1][v1-r1] and the revival README arrived during R2 in documentation-only commit `996295cbc1410738e6a988faac90942bef4f9c4b`; both were read before publication. Its diff changes only R1 and research indexes, so the analyzed V1 code SHA above remains valid. R1 is preserved unchanged. R2 extends its ownership/continuity evidence with direct cross-version comparison rather than repeating its feature inventory. Only R2 is delivered.

Evidence labels used below:

| Label | Meaning |
|---|---|
| **V — Implemented and verified** | Explicit verification evidence exists for the stated scope; distinguish historical evidence from a new independent run. R2 supplies no new runtime V verdicts. |
| **I — Implemented, not independently verified** | Current code was inspected; execution, integration or performance was not reproduced for R2. Tests strengthen the evidence but are not a fresh PASS. |
| **P — Partial or disabled** | Some implementation exists, but the stated feature is incomplete, gated or off by default. |
| **Plan — Planned only** | Documentation describes a mechanism without confirmed current activation/implementation. |
| **U — Unknown** | Evidence is insufficient for the specific claim. |

## 2. Architecture comparison

### 2.1 Subsystem matrix

Each row separates implemented mechanism from maturity and compatibility. Evidence groups in §8 include exact source owners, relevant tests and prior findings.

| Subsystem | V1 current implementation | V2 current implementation | V3 current implementation | Correctness evidence, meaningful difference and integration concern |
|---|---|---|---|---|
| Composition and ownership | **I:** `createApp` composes app services; stable `WorldBundle` fields are replaced on rebuild. `SettlementsManager` owns persistent registries separately from streamed agents. | **I:** `Game` facade around data-oriented `Sim`; mutable `GameState`, read-only world foundation, terrain/node/actor indexes and registered systems. | **I:** `SceneSession` composes rendering and structural ports; pure session/sim modules own world-step consumers and save staging. | V1 lifecycle tests and V3 session tests exist; V2/V3 layer-check scripts enforce forbidden imports. V1's agent classes and loop still mix simulation with Three.js. V3 also retains a large composition module: separation is a dependency property, not a file-size guarantee. [E01](#e01-v1-composition-and-lifecycle) [E12](#e12-v2-simulation-root-and-time) [E18](#e18-v3-world-step-and-clocks) [E25](#e25-cross-version-context-and-instructions) |
| Initialization and teardown | **I:** initial world has deferred `backgroundReady` and settlement `homeReady`; inert stubs are replaced on the stable bundle. Rebuild disposes old resources, builds fresh, rechecks staleness, then publishes; failed rebuild blocks ticking. | **I:** `Sim` reconstructs terrain and spatial indexes from world/state; deterministic world cache is separate from saves. | **I:** `assembleWorld` builds fields/query/caves/structures; staged NPC preparation precedes consumer attachment; session disposal retires consumers and render resources. | V1 already has race/staleness defenses. Its rebuild is **not** rollback to a still-running old world: old fields can already be disposed. V3's staged-save publication cannot be substituted for general world rebuild without defining resource ownership. [E01](#e01-v1-composition-and-lifecycle) [E14](#e14-v2-world-generation-and-save) [E17](#e17-v3-live-npc-runtime) [E23](#e23-v3-world-identity-and-streaming) |
| Time and scheduling | **I/P:** frame `dt` capped at 50 ms; day length defaults to 480 real s. Time-skip gates ordinary NPC/fauna updates and resolves catch-up; helper functions and per-domain elapsed-day anchors coexist with frame-based execution. | **I/P:** `Sim.step` substeps gameplay time; calendar is ×24; registered systems run at intervals. Per-agent LOD and decision deadlines are separate. Guard stops after 400 iterations. | **I:** clock exposes real/game/calendar deltas; world-step driver closes due boundaries. **I/P:** generic scheduler has 0.1/0.5 s Near/Mid intervals and no Far ticks; production residents use grouped due boundaries. | V1 time-skip and offscreen tests, V2 tier tests, V3 scheduler/clock/session tests exist. Different day speeds, lag handling and save phases make whole-scheduler replacement HIGH risk. The V2 guard can leave time unprocessed for an unusually large call; V3 generic scheduler grows substep size to consume all input. [E02](#e02-v1-time-and-randomness) [E05](#e05-v1-offscreen-and-time-skip-tests) [E12](#e12-v2-simulation-root-and-time) [E16](#e16-v3-agent-registry-grid-and-generic-scheduler) [E18](#e18-v3-world-step-and-clocks) |
| Randomness and event/state order | **I/P:** deterministic generation and pure pressure/arbitration helpers coexist with uncontrolled runtime NPC randomness. Shared simulation contracts are adapters, not one global replay engine. | **I:** `Sim.rng` restored from `state.rng`, copied back after stepping; deterministic registration order; transient simulation events signal presentation changes. | **I/P:** stable agent order, deterministic A* heap ties, ID-derived due phases; live NPC saves retain RNG cursor. Closed boundaries coordinate clock and consumer progress. | No end-to-end cross-browser replay was reproduced. V2 system accumulators and projectiles are intentionally unsaved. V3 generic ordering and live continuation are distinct contracts. Changing iteration order can change random draw assignment or winning candidates even with a seed. [E02](#e02-v1-time-and-randomness) [E12](#e12-v2-simulation-root-and-time) [E17](#e17-v3-live-npc-runtime) [E19](#e19-v3-navigation) |
| Local pathfinding | **I:** shared bounded A* for NPCs/fauna; 1.5 m default cells, 6 m padding, 1,500-node cap; direct LOS, slope checks, cost-aware simplification and diagonal guard; request-local maps/string keys/open array. | **I:** shared AI steering/detours/road polylines; separate player-autopilot A* uses 16 m cells, 400 m margin, 60,000 expansion cap, typed arrays and heap. | **I:** shared 1 m navigation raster, 64 m tiles, radius clearance, doors, 96 m local-distance cap, 4,000 nodes, reusable typed scratch/heap and resumable searches. | V1 navigation tests, V2 pathfinding/movement tests, V3 A*/raster/failure tests exist. V2's autopilot is not an AI-local-nav replacement. V3 has explicit `not-ready` vs `unreachable`/`capped`; geometry preparation can be more expensive than the search. V1's fauna cost preferences must survive any adapted LOS/smoothing. [E03](#e03-v1-navigation) [E13](#e13-v2-navigation-and-spatial-indexes) [E19](#e19-v3-navigation) [E22](#e22-v3-navigation-measurements-and-prior-comparison) |
| Navigation execution and obstacles | **I:** route output does not move agents; locomotion/slope/collision remain authority. Watchdog escalates repath → escape → abandon with repeated-rescue fallback; cave and water adapters exist. | **I/P:** near movement collides, detours and separates; distant `full=false` movement is cheaper and less physically detailed. Stuck timer decays on progress, then returns failure. | **I:** stamped raster invalidation; planning door cells versus physical door port; swept movement/action validation; goal/path failure handling; bounded unstuck rung. | V1 recovery/cave regression test files exist; V3 watchdog tests cover executed recovery history and rung limits. A route is not proof of safe movement. Door semantics, decks, caves, radii and transient obstacles must match V1's final collision authority. [E03](#e03-v1-navigation) [E13](#e13-v2-navigation-and-spatial-indexes) [E20](#e20-v3-navigation-execution-and-invalidation) |
| Spatial queries and scans | **I:** 16 m fauna proximity buckets rebuilt once per wild-fauna pass with reusable arrays and conservative margin; bound occupancy aggregated separately. Settlement checks are locality/checkpoint based. | **I:** actor/ground/corpse/trace hashes, building indexes and resource `NodeCache`. AI updates still visit actor lists to test due time; slow ecology scans building/inventory collections. | **I:** ID-based 32 m agent grid maintained by registry moves, structure collider index, local ring queries. Generic scheduler still visits `registry.ordered()`; that method allocates a fresh array. | V1 fauna-proximity test file located; V3 inspected tests compare grid queries to brute force over 500 seeded agents. No version is globally scan-free. V1 query returns a conservative candidate set; V3 returns exact-radius IDs and clears output; V2 appends to supplied output. Replacing APIs without preserving these contracts changes behavior. [E04](#e04-v1-settlement-continuity) [E09](#e09-v1-spatial-queries) [E13](#e13-v2-navigation-and-spatial-indexes) [E16](#e16-v3-agent-registry-grid-and-generic-scheduler) |
| NPC foundation | **I:** `NpcAgent` integrates shared health/stamina/vigor, needs, scored pressures, action/FSM execution, plans, work, cargo, travel and social behavior; persistent authoritative state lives outside streamed runtime. | **I:** utility options and multistep duties/work, actors in `GameState`, decision cadence independent of locomotion LOD, explicit near/far update counters. | **I/P:** live canonical cast, `NpcLife` and shared nav host, G3 durable section; current flags enable live NPCs and G3. Social pair and social-need flags remain false by default. | V1 provides more economic/agent integrations than V3's current day-life slice. V3 work visits and abstract home meals do not prove stock-backed production/consumption parity. `npcLive.ts` header still says default OFF, contradicted by current `NPC_LIVE_ENABLED=true`; config and actual caller win. [E04](#e04-v1-settlement-continuity) [E11](#e11-v1-npc-decision-and-state) [E12](#e12-v2-simulation-root-and-time) [E17](#e17-v3-live-npc-runtime) |
| Fauna and habitats | **I:** common `AnimalAgent` for wild/livestock; update sections throttled selectively, life/needs remain active; persistent habitat FSM, bound-population authority, depletion/recovery, tombstones and persistence classes. | **I:** animal state in `GameState`, decision/movement LOD, species rules, periodic den replenishment and world ecology. | **Plan/P:** generic agent/nav contracts support animal kinds/radii and save helpers, but integrated wildlife/livestock lifecycle remains future M6/M8 work in the port ledger. | V1 spawner tests and cadence/persistent-occupant tests exist; V2 fauna/den systems are executable code. V3 animal-compatible types and unused animal assets are not live fauna parity. Do not replace ecological state with proximity-based respawn or Far freeze. [E08](#e08-v1-fauna) [E12](#e12-v2-simulation-root-and-time) [E17](#e17-v3-live-npc-runtime) [E25](#e25-cross-version-context-and-instructions) |
| Economy, production and trade | **I:** separate settlement bulk stock, concrete household food/items, NPC personal inventory, transient work carry, transport cargo, merchant stock and source ledger; all-or-nothing production and delivery-driven attribution. | **I:** actor/building inventories, `npc/works`, trade and slow household/tax/den systems; conservation tests and optional event ledger. | **P/Plan:** money/trade data and item/container foundations exist; warehouse production, caravans and taxes remain later scope per ledger. | Inspected V1 production tests cover exact amounts, missing owners/inputs, duplicate rows, malformed amounts and instance outputs. Source tests cover repeated-event realization and entitlement claims. V2 conservation tests are useful oracles, not a replacement for V1 owners. V3 cleaner containers do not implement V1 logistics. [E06](#e06-v1-economy) [E07](#e07-v1-transport-commitments) [E15](#e15-v2-layering-and-diagnostics) [E25](#e25-cross-version-context-and-instructions) |
| Generated and mutable world | **I:** procedural reconstruction plus saved deltas; six disposable worldgen-cache namespaces; clone base chunk tiles before runtime modifications; bounded mesh-data cache separate from generated tiles. | **I:** `generateWorld(seed,gen)` with supported generator versions, binary world serialization/cache and separate mutable save. | **I:** canonical snapshot/overlay identity on production world path; generated-window path also exists; saves bind world/snapshot/overlay/query identities. | V2 generator-contract/version tests and V3 canonical hash tests exist. V1 cache-version bumps prevent stale cache hits; they do **not** automatically preserve old world geometry/IDs. V3 authored canonical world is a different product/data contract, not a drop-in cache for procedural V1. [E14](#e14-v2-world-generation-and-save) [E23](#e23-v3-world-identity-and-streaming) [E26](#e26-v1-persistence-and-worldgen-cache) |
| Saves and recovery | **I:** schema v56 with explicit one-version migration chain, read/write validation, damaged-slot overwrite refusal; sparse world deltas and registries; named slots in IndexedDB. | **I:** version/compatibility bridges, supported generator reconstruction, validated save and frozen real-save fixture. `snapshot()` is shallow; `roundTrip()` deep-clones via JSON. | **I/P:** schema v11 strict current-version parser, bounded payload, FIFO save/load queue, checksum/identity checks, generation/revision guards, atomic two-store IDB commit and staged restore. | V1 save tests and V2 compatibility fixture exist; V3 integrity tests and IDB failure/race suites exist. V3 currently **rejects other save versions**, rather than providing V1's long migration chain. No inspected mechanism establishes automatic cross-version conversion or arbitrary corruption repair. [E14](#e14-v2-world-generation-and-save) [E24](#e24-v3-save-boundary) [E26](#e26-v1-persistence-and-worldgen-cache) |
| Rendering, streaming and memory | **I:** existing workers for chunk tile/mesh/grass data, bounded finalization and stale-result guards, 64 MiB runtime mesh cache, region vegetation batching, shadow/reflection scheduling and postprocessing. | **I:** camera-local terrain/vegetation preparation, 2.5 ms vegetation rebuild target, imported instanced models, tree LOD/impostors and pooled presentation techniques. | **I/P:** camera-local chunk ring, terrain merging/LOD and shared resource owners; nav raster cache currently 256 tiles; render/asset diagnostics and separate quality budgets. | V1 current rendering is richer than a lower-content V3 workload. CPU slicing can preserve output but can delay appearance; worker/GL lifecycle and invalidation still need verification. A nominal ms budget is not a hard bound if one atomic operation exceeds it. [E10](#e10-v1-performance-evidence) [E21](#e21-v1v2-streaming-and-memory) [E22](#e22-v3-navigation-measurements-and-prior-comparison) [E23](#e23-v3-world-identity-and-streaming) |

### 2.2 Consequential source details

**State separation in V1 is uneven, not absent.** The shared navigation API, offscreen survival and production executor are data-oriented seams. The agent classes still read/write `mesh.position`, update animation and perform decisions in the same object. This makes lifecycle reconstruction and headless execution harder, but it does not justify replacing the rules those classes integrate. `WorldBundle` and settlement authoritative registries already provide boundaries to work through. [E01](#e01-v1-composition-and-lifecycle) [E03](#e03-v1-navigation) [E04](#e04-v1-settlement-continuity) [E06](#e06-v1-economy)

**Current V1 has tests omitted from an older V3 comparison snapshot.** The October 8 architecture review explicitly inspected a copied V1 tree without tests. Current V1 includes navigation, offscreen survival, production, source-ledger, save and lifecycle suites. Its historical “no tests in snapshot” statement cannot support “V1 has no tests.” Likewise its broad “no full-world scans” characterization of V2 needs qualification: locality queries coexist with outer actor-list passes and low-frequency world-system scans. These are contextual corrections, not edits to that historical review. [E05](#e05-v1-offscreen-and-time-skip-tests) [E06](#e06-v1-economy) [E12](#e12-v2-simulation-root-and-time) [E25](#e25-cross-version-context-and-instructions)

**Do not equate spatial-index presence with cheap scheduling.** V3 `SpatialGrid.pull` finds an ID with `indexOf` inside its bucket before swap removal; removal is therefore occupancy dependent, despite the broad O(1) header claim. `AgentRegistry.ordered()` creates an array, and the generic scheduler calls it during dispatch. V2 proximity APIs allocate by default unless callers supply/reuse output, and supplied output is appended rather than cleared. V1's once-per-pass fauna rebuild is O(N), but reuses buckets and conservatively handles movement during the pass. A persistent shared ID grid may help at larger scale; it is not automatically cheaper for V1's current population or safer for same-frame queries. [E09](#e09-v1-spatial-queries) [E13](#e13-v2-navigation-and-spatial-indexes) [E16](#e16-v3-agent-registry-grid-and-generic-scheduler)

**Navigation geometry and route policy differ.** V1's `cellCost` rejects costly ground on LOS and smoothing shortcuts, retaining preferred-ground detours. V2 autopilot uses road/forest/wet/slope costs over a coarse grid. V3 local raster currently uses slope/wet costs without V2 road/forest terms; animal door handling and radius clearance are separate concerns. Replacing V1 routes with geometrically legal V3 routes may silently lose water/preference behavior even when both reach the goal. No complete-route cache was found in the inspected V3 nav stack; tile caching, retry suppression and retained sliced-search state solve different problems. Sliced A* is used by staged preparation; the live `NpcLiveNav.searchCore()` uses `PathQueue.process()` with the finder's default unsliced search, while sharing a raster-build quota. Do not infer a universal per-live-search expansion slice from the existence of `PathFinder.find(req, slice)`. [E03](#e03-v1-navigation) [E13](#e13-v2-navigation-and-spatial-indexes) [E19](#e19-v3-navigation) [E20](#e20-v3-navigation-execution-and-invalidation) [E22](#e22-v3-navigation-measurements-and-prior-comparison)

**V1 production atomicity is preflight-based.** `executeProduction` validates every owner/input/output before synchronous mutations, and its tests cover ordinary refusal and exact quantities. It is not a general rollback transaction: unexpected failure of a later mutation after an earlier accepted mutation is not undone in this function. Preserve the current preflight/owner assumptions and investigate injected late failures before extending the guarantee to arbitrary failures or new owner implementations. This is a limit of the demonstrated guarantee, not a reproduced production-loss bug. [E06](#e06-v1-economy)

## 3. V1 preservation inventory

These are existing implementation capabilities to protect, with explicit limits. They are not a request to freeze all internals.

| Capability and owner | Why it matters | Regression to guard against |
|---|---|---|
| Stable `WorldBundle`, background boot, rebuild validity gate and stale-publication check | Long-lived app consumers survive replacement through current-field reads or explicit rebinding. | Late worker/background completion touching disposed world; callbacks retaining old terrain; ticking between disposal and publication. Failure currently leaves a blocked world, not automatic rollback. [E01](#e01-v1-composition-and-lifecycle) |
| `SettlementsManager` authoritative registries, independent settlement/terrain streaming radii | Health, needs, households, economies, relationships and livestock state outlive scene agents. | Treating render/chunk visibility as entity existence; reseeding stocks or residents on reload; losing detached livestock or mutable structure state. [E04](#e04-v1-settlement-continuity) [E26](#e26-v1-persistence-and-worldgen-cache) |
| NPC pressure arbitration and shared action contracts | Economic, need, threat and other producers converge on the existing executor rather than competing independent controllers. | A new scheduler deciding actions separately from current interruption/commitment rules, or an index becoming a second authoritative NPC registry. [E11](#e11-v1-npc-decision-and-state) |
| Offscreen travel/survival, cargo and arrival handoffs | World-day checkpoints progress selected commitments without constructing a Three.js agent; survival spends real personal provisions at threshold crossings. | Far freeze, arrival without cargo/provisions, both detailed and offscreen modes progressing the same order, repeated delivery. This is selective continuity, not proof of fully simulated unloaded settlements. [E04](#e04-v1-settlement-continuity) [E05](#e05-v1-offscreen-and-time-skip-tests) [E07](#e07-v1-transport-commitments) |
| Household agricultural anchors and stock ownership | Catch-up and one-time seed grants are history-bearing data, separate from generated fields and presentation. | Replaying entire history at stream-in, duplicating starter seeds, storing crop visuals as economy truth. [E04](#e04-v1-settlement-continuity) [E26](#e26-v1-persistence-and-worldgen-cache) |
| Shared production executor and source attribution | Mixed bulk/item recipes preflight and commit through explicit owners. Source entitlement follows actual delivered/realized goods and idempotent event IDs. | Free production at a “work visit,” scalar replacement of concrete food/item instances, provenance reconstructed from aggregate stock, duplicate entitlement accrual. [E06](#e06-v1-economy) |
| Fauna importance cadence inside one `update()` | Ordinary behavior/animation can be reduced without suspending the life/needs/corpse path; critical interactions remain immediate. | Whole-agent distance throttling that freezes sensing, hunger, carcasses or breeding/production timers, or accumulates unsafe movement steps. [E08](#e08-v1-fauna) |
| Habitat population authority, recovery and persistence classes | Bound occupancy differs from animals merely standing nearby; intact depleted habitats can recover. Ordinary wild individuals and declared persistent occupants intentionally persist differently. | Proximity-based population top-up duplicating roaming animals; replacing a one-shot quest den with generic respawn; losing recovery progress or tombstones. [E08](#e08-v1-fauna) |
| Existing fauna proximity index and cross-system encounter composition | One wild-pool index avoids per-animal global searches; livestock/threat composition has explicit provenance. | Counting livestock twice, losing strict radius/self/dead predicates, overlooking conservative same-pass movement margin. [E09](#e09-v1-spatial-queries) |
| Shared local nav plus actual movement/cave/water adapters | Routes remain advisory; final terrain/collision rules, slope limits and recovery are separate. | Applying a raster route directly to transforms, cross-layer target leakage, missing water traversal or stuck/low-stamina recovery. [E03](#e03-v1-navigation) |
| Migrated save history and disposable caches | V1 already distinguishes authoritative deltas from acceleration data and refuses unreadable-slot overwrite. | Replacing migration with “current version only,” persisting cache entries as world truth, mutating a shared cached base, orphaning stable IDs after worldgen changes. [E26](#e26-v1-persistence-and-worldgen-cache) |
| Current rich presentation and existing optimizations | Worker extraction, bounded caches, batching, reflection and shadow scheduling already coexist with V1 appearance. | Claiming speedup after removing effects, inhabitants, vegetation or distant continuity; adding another batching/worker manager instead of fixing current hot paths. [E10](#e10-v1-performance-evidence) [E21](#e21-v1v2-streaming-and-memory) |

Known limits to preserve honestly: ordinary wild individual state and NPC transient execution state do not all survive saves/rebuilds. V1's documentation distinguishes persistent personal inventory/transport cargo from transient work carry. Protecting V1 does not mean claiming those gaps are already solved. [E26](#e26-v1-persistence-and-worldgen-cache)

R1 also points to existing September 21 agent and lifecycle audits. They already own follow-ups for merchant pack-animal continuity, spatial state seams, agent rendering census, CPU attribution and fresh-world failure cleanup. These findings are existing research, not newly diagnosed R2 bugs. The inspected `agentPresentationLod.ts` already has shared presentation-only Near/Mid/Far rules (18/36 m) for optional nodes; simulation and silhouette-bearing geometry remain outside that policy. A proposal to “add agent LOD” would therefore be redundant unless it names a measured remaining gap. The lifecycle audit separately identifies partial-construction cleanup concerns; the presence of a final stale-publication guard does not prove every allocation on a throwing constructor path is cleaned up. [E27](#e27-r1-and-existing-v1-follow-ups)

## 4. Potential improvement candidates

Research-level effort scale: XS = small isolated adaptation; S = bounded local change; M = several owners/adapters; L = cross-system integration; XL = fundamental compatibility work. Estimates include necessary verification conceptually, not a delivery commitment. Benefits below are hypotheses unless §6 identifies an actual measured source result. No row is a final migration decision.

| Candidate / source implementation | V1 problem and expected benefit | Broad integration approach and dependencies | Effort / risk | Confidence and missing verification |
|---|---|---|---|---|
| C1: reusable heap/scratch A* from V3 `PathFinder`, supported by V2 heap approach | V1 allocates per-search maps/keys/nodes and linearly scans its open list. Could reduce search/GC cost without changing world detail. | Adapt search storage behind V1 `findPath` contract; retain V1 `NavigationQuery`, slope, `cellCost`, corner and smoothing semantics. Dependencies: equivalent coordinate/tie/goal rules and agent adapters. Full V3 raster is not required to study this mechanism. | **M / MEDIUM** | HIGH confidence in implementation difference, MEDIUM in benefit. Need V1 search-count/node/allocation profile and route/cost/failure equivalence corpus; no comparative timing exists. [E03](#e03-v1-navigation) [E13](#e13-v2-navigation-and-spatial-indexes) [E19](#e19-v3-navigation) |
| C2: explicit nav outcomes, fair admission and deterministic work quotas from V3 `PathQueue`, raster and sliced finder | Several simultaneous cold searches can cause bursts; conflating unavailable data with no route creates bad retries. Could spread work while keeping output and simulation depth. | Fit request ownership/cancellation to V1 current action intent and recovery; preserve direct fast path and old route during valid waits. Dependencies: gameplay-clock expiry, world revision, cold geometry costs, starvation policy, chunk readiness. | **L / HIGH** | HIGH mechanism confidence; MEDIUM transfer value. Need actual V1 burst evidence and maximum atomic-call timing. Generic `PathQueue.process()` alone is not a hard CPU bound: it invokes finder with its default unsliced search. [E19](#e19-v3-navigation) [E20](#e20-v3-navigation-execution-and-invalidation) |
| C3: dependency checks from V2/V3 `check-layers.mjs` | V1 presentation dependencies make data-only testing and lifecycle reasoning difficult. A guard could prevent new coupling while owners are improved. | Apply checks to already-pure V1 areas and deliberate newly extracted seams, with explicit existing exceptions; keep `WorldBundle` composition and adapters. No immediate blanket ban over all V1 agents. | **S / LOW** for guard; **L / HIGH** for broad extraction | HIGH structural confidence. Need inventory of allowed V1 seams and baseline violations; script adoption alone changes no runtime cost. [E01](#e01-v1-composition-and-lifecycle) [E15](#e15-v2-layering-and-diagnostics) [E25](#e25-cross-version-context-and-instructions) |
| C4: save-operation serialization, revision guard and staged restore from V3 | V1 validates outgoing/existing saves, but inspected `writeSave` reads existing row and later writes via separate transactions. Concurrent writers/session replacement deserve stronger explicit protection. | Extend V1 save owners with queue/revision or equivalent atomic ownership checks; retain v56 migration chain, existing slots and all domain snapshots. Stage restore through V1 rebuild validity gate. Dependencies: capture readiness, async boot, inventory identity, failure cleanup and cross-tab behavior. | **L / HIGH** | HIGH code-difference confidence, MEDIUM actual defect exposure. No concurrent-write reproduction performed. Require interleaving/fault-injection oracles before claiming lost-update prevention. V3 current-version rejection must not come with the mechanism. [E24](#e24-v3-save-boundary) [E26](#e26-v1-persistence-and-worldgen-cache) |
| C5: saved RNG cursor / stable ordering from V2 and V3 resident state | V1 runtime randomness prevents repeatable behavior diagnosis. Could support repeatable local scenarios and stronger continuation tests. | Introduce scoped RNG at specific existing decision boundaries, preserving distributions and stable identity; decide cursor ownership and checkpoint semantics explicitly. Dependencies: draw order, save migration, time-skip, stream-in and visual-only randomness separation. | **L / HIGH** | HIGH evidence of V1 gap; MEDIUM feasibility without behavior drift. Seeded RNG does not fix frame partitioning or lost transient work state. Need split-step and save/continuation tests, not just same-seed generation. [E02](#e02-v1-time-and-randomness) [E12](#e12-v2-simulation-root-and-time) [E17](#e17-v3-live-npc-runtime) |
| C6: incremental shared ID grid / registry pattern from V3 | Could help cross-NPC/fauna queries at larger populations or stable headless state, beyond V1's existing wild-only index. | First compare adapters over current owners; preserve V1 fauna index if cheaper. Index is derived, not a second state authority. Dependencies: all move/remove/restore paths, layers, livestock ownership and stable candidate ordering. | **M–L / MEDIUM–HIGH** | HIGH implementation confidence, LOW–MEDIUM performance confidence. Need query fan-out, occupancy and allocation measurements, plus same-frame movement/radius equivalence. V3 bucket removal and ordered iteration are not allocation-free/O(1) in all respects. [E09](#e09-v1-spatial-queries) [E16](#e16-v3-agent-registry-grid-and-generic-scheduler) |
| C7: V2 conservation/event-ledger oracles and V3 validity-aware diagnostics | V1 has strong local transaction tests, but a shared scenario oracle could expose duplication/loss across travel, rebuild and save. Could improve diagnosis with minimal production cost. | Reuse V1 perf/transaction owners; adapt optional ledgers around actual committed operations and matched scenarios. Dependencies: distinguish creation, transfer, spoilage, tombstone and destruction; capture logical time and authoritative population. | **M / LOW–MEDIUM** | HIGH diagnostic value, no performance speedup promised. Need scenario-specific invariants and overhead measurement with instrumentation on/off. Avoid counting intent as production. [E06](#e06-v1-economy) [E15](#e15-v2-layering-and-diagnostics) [E22](#e22-v3-navigation-measurements-and-prior-comparison) |
| C8: staged preparation and measured cache working-set practice from V3 | V1 still has synchronous cold terrain/river work and large streaming tails. Could reduce spikes while preserving identical geometry/populations. | Adapt deterministic bounded preparation at existing V1 cache/worker boundaries; reuse current finalization queues and stale guards. Dependencies: cold/warm measurements, byte budgets, mutation epochs and no gameplay query dependence on visible terrain. | **M–L / MEDIUM–HIGH** | HIGH evidence for V3 cache thrash correction; MEDIUM applicability to any specific V1 cache. Need V1 access traces and exact output parity. Do not copy “256 tiles” or add a second terrain worker pipeline. [E10](#e10-v1-performance-evidence) [E21](#e21-v1v2-streaming-and-memory) [E22](#e22-v3-navigation-measurements-and-prior-comparison) |

Two attractive-looking transfers remain weak candidates: replacing V1's scheduler wholesale with V3's Near/Mid/Far policy, and replacing V1's economy/fauna with V3 foundations. Both currently lose more demonstrated behavior than they supply. V2 tree impostors/time-sliced vegetation preparation are relevant architectural prior art, but their asset/appearance suitability belongs to R3; R2 does not recommend a visual swap. [E08](#e08-v1-fauna) [E17](#e17-v3-live-npc-runtime) [E21](#e21-v1v2-streaming-and-memory)

## 5. High-risk architectural boundaries

| Boundary | Concrete incompatibility / failure mode | Verification needed before change |
|---|---|---|
| Save and state ownership | V1 stock, concrete items, personal inventory, temporary work carry and transport cargo are distinct owners. V3's current save sections/pose authority and item model are not the same schema. V2 `snapshot()` shallowly references nested live state. | Enumerate every owner at capture and reconstruction; detached capture at a closed boundary; no double owner or dropped item instance; historical V1 saves remain loadable. Test save while transporting, producing, dead, mounted and waiting for async world preparation. [E06](#e06-v1-economy) [E14](#e14-v2-world-generation-and-save) [E24](#e24-v3-save-boundary) [E26](#e26-v1-persistence-and-worldgen-cache) |
| World generation and identity | V1 regenerates geometry and IDs from seed/config and per-namespace algorithms. V2 keeps supported generator versions; V3 pins canonical snapshot/overlay/query hashes. New scale/terrain/layout can invalidate houses, crop IDs, resource sites, caves and NPC references despite a cache miss. | Freeze representative existing saves/world samples; compare identity and geometry at persisted references; define old-world retention or explicit migration/refusal. Cache invalidation alone is insufficient. Item IDs/catalog changes also require preservation of counts, instances, freshness and references. [E14](#e14-v2-world-generation-and-save) [E23](#e23-v3-world-identity-and-streaming) [E26](#e26-v1-persistence-and-worldgen-cache) |
| Clocks and time-skip | V1 480 s day, frame clamp and catch-up differ from V2/V3 calendar/gameplay time. V3 stamina uses real delta while other effects use game/calendar fields. An apparently harmless multiplier can accelerate movement or double-age crops/corpses. | Map units at each current API; compare normal versus split skip, save/checkpoint and stream-out/in. Count elapsed time exactly once and test interruption, pause, hidden tab and long frames. No day-length rebalance is authorized by R2. [E02](#e02-v1-time-and-randomness) [E05](#e05-v1-offscreen-and-time-skip-tests) [E18](#e18-v3-world-step-and-clocks) |
| Navigation and movement | V1 point query/cost/slope rules differ from V3 raster clearance/door planning and fixed distance limits; V2 far movement omits detailed collision. Changed query order or recovery can cross walls or abandon reachable work. | Matched start/goal/profile/layer corpus, exact collision checks, cost-aware shortcuts, dynamic doors/felling/building/terrain edits, slopes, shorelines and cave entrances. Test stale result cancellation and no movement on `not-ready`; route success is not arrival success. [E03](#e03-v1-navigation) [E13](#e13-v2-navigation-and-spatial-indexes) [E19](#e19-v3-navigation) [E20](#e20-v3-navigation-execution-and-invalidation) |
| Streaming and lifetime | V1 terrain, settlement runtime and fauna presence have different lifetimes; stubs/background promises and detached animals complicate replacement. V3 staged preparation and render rings are separate from authoritative state. | Rapid move/teleport/new-world/rebuild/dispose with pending work; every stale completion ignored/disposed; all closures rebound; state survives unload without duplication. Measure retained buffers, geometries/textures and listener/consumer counts over repeated cycles. [E01](#e01-v1-composition-and-lifecycle) [E04](#e04-v1-settlement-continuity) [E21](#e21-v1v2-streaming-and-memory) |
| NPC/fauna/economy integration | Critical agents must not be throttled solely by player distance. V1 predators see deliberately composed NPC/livestock data; transport handoff changes who executes an order. V3 Far currently drops goals/elapsed. | Same authoritative population and inventories before/after tier changes; mounted/owned/hunting/threatened agents remain active; death/recovery/harvest persists correctly; detailed/offscreen cargo progression is mutually exclusive and arrival is idempotent. [E04](#e04-v1-settlement-continuity) [E07](#e07-v1-transport-commitments) [E08](#e08-v1-fauna) [E17](#e17-v3-live-npc-runtime) |
| Render/simulation coupling | V1 mesh positions are read by agents and proximity rebuild; visual simplification or delayed construction may accidentally change gameplay. Pure V3 registry poses offer a pattern but not a ready conversion. | Run the affected rules with presentation absent/late while keeping the same terrain/collision authority; compare interaction range, threats and resource ownership. LOD/culling must alter presentation only where rules require continuity. [E09](#e09-v1-spatial-queries) [E11](#e11-v1-npc-decision-and-state) [E16](#e16-v3-agent-registry-grid-and-generic-scheduler) |

## 6. Performance opportunities

### 6.1 Proven historical bottlenecks and observation limits

| Evidence | What was measured | What it does and does not establish |
|---|---|---|
| V1 stream 029, September 21 | High quality, seed 42, rain, 1920×945, 30 s: average frame 23.1 ms, p95 36.5 ms, max 98.5 ms; NPC 2.0 ms/frame, fauna 1.4, render category 12.2. Long-frame stage rows include river-tile builds around 43–51 ms. | Real scenario-specific costs, with CPU categories and overlapping stage attribution. An NPC category spike can include environment/river queries called inside NPC execution; it is not proof that NPC decisions alone caused the stall. No new reproduction at the analyzed SHA. [E10](#e10-v1-performance-evidence) |
| V1 settlement-heavy 030 and performance owner summary | Isolation reported render 23.3 → 14.4 ms without NPC/fauna and 23.3 → 19.1 without settlement content; scene estimate 1,516 settlement draws; NPC category about 4.7 ms. | Strong attribution leads for agent/settlement rendering. Hiding content measures exposed cost, not an acceptable optimization or guaranteed recoverable saving. Passes, submission and scene estimates are not additive isolated GPU times. [E10](#e10-v1-performance-evidence) |
| V1 September 14 trace audit | Main-thread scripted animation stall roughly 577 ms; largest individual GPU task about 27.4 ms; river/terrain functions prominent in samples. | Establishes a CPU/main-thread stall. Missing per-sample `timeDeltas` prevents assigning hundreds of ms to one sampled function. Later stage timing is better evidence for specific costs. [E10](#e10-v1-performance-evidence) |
| V2 historical render baseline | Medium marching vegetation rebuild p95 24–38.7 ms; static scene preparation much lower; SwiftShader draw/FPS explicitly excluded from native GPU conclusions. | Cold/rebuild preparation can dominate despite cheap steady state. No direct V1 comparison; V2 current art and scene differ from that baseline. [E15](#e15-v2-layering-and-diagnostics) |
| V2 native laptop results, October 7 | Reported Intel Arc 140V, Windows Chrome, seed 1337, three 60 s rounds/profile: vsync 60 FPS; GPU p95 low/medium/high 8.4/11.8/12.3 ms; CPU frame p95 3.2/4.4/6.7 ms. | Actual hardware evidence for that test. Does not prove V2 scales better at V1 visual/simulation parity, nor performance during extended travel or phone play. PERF's older “no GPU/device measurement” prose is stale relative to its Device results section. [E15](#e15-v2-layering-and-diagnostics) |

### 6.2 Previously benchmarked optimizations

**V3 raster capacity correction is a measured success within one fixed nav corpus.** Review201 replayed 18,000 results/250 actors with identical outcome hash `c371dae46a95`: capacity 64 caused 26,219 builds and 294.4 s wall time; capacity 256 caused 196 builds and 7.1 s. Cached tile payload increased from 2.77 to 11.06 MiB. This was about 41× faster for the replay, not a 41× game speedup. Current config is 256. The remaining cold tail was still large, and 256 was justified against 196 distinct tiles in that corpus, not all future worlds. [E22](#e22-v3-navigation-measurements-and-prior-comparison)

**V2 vegetation amortization has reported before/after evidence with qualifications.** PERF records medium march vegetation rebuild p95 24–38.7 → 3.8 ms and preparation p95 20.97 → 7.95 ms, explicitly one run with confirmation gaps. Current `Vegetation` contains the time-sliced job/budget mechanism. V1 already time-slices finalization and region-batches vegetation; the transferable lesson is to locate remaining unsliced work, not import a second vegetation owner. [E15](#e15-v2-layering-and-diagnostics) [E21](#e21-v1v2-streaming-and-memory)

**V1 optimization history must travel with the baseline.** The performance owner records worker mesh extraction, cache and region batching as implemented. The small reflection-content exclusion produced modest draw reduction without clear FPS/WATER gain. Earlier `compileAsync` experiments regressed; R2 did not re-read every experiment artifact, so those negative results are attributed to the performance/research indexes rather than newly verified. Do not repeat generic prewarming or count already-landed batching as new savings. [E10](#e10-v1-performance-evidence) [E21](#e21-v1v2-streaming-and-memory) [E25](#e25-cross-version-context-and-instructions)

### 6.3 Implemented improvements without comparable measurements

- V3 heap/scratch reuse, resumable raster builds/searches, staged attach and failure backoff are real code. Their individual contribution versus V1's local finder is **unmeasured**. Historical warm-cache gain must not be reassigned to slicing or heap changes.
- V1's animal cadence, pooled fauna buckets, bounded mesh cache, chunk workers and region batches are real code. Historical category improvements and current counters do not isolate each mechanism without a matched A/B.
- V2/V3 dependency enforcement and state/pose separation improve auditability and testability. They are not demonstrated FPS optimizations.
- V3 save integrity/atomicity and closed-boundary capture are correctness mechanisms. They may add allocations/copying and should not be sold as a faster save without measurement.

### 6.4 Hypotheses requiring profiling; appearance and depth must remain equivalent

| Opportunity | Plausible saving | Required evidence / preservation condition |
|---|---|---|
| Avoid repeated synchronous river/terrain work in V1 | Reduce cold main-thread spikes; reuse canonical query results or stage existing work. | Identify exact callers/cache misses and longest indivisible operation; retain identical local water, river/shore precedence and fauna/player query answers. Latest V1 commit already unifies shoreline queries; do not re-propose that fix. [E01](#e01-v1-composition-and-lifecycle) [E10](#e10-v1-performance-evidence) [E21](#e21-v1v2-streaming-and-memory) |
| Reduce duplicate agent/settlement submissions and animation work | Target costs exposed by settlement-heavy isolation without reducing inhabitants. | Same models, silhouettes, visible effects and actor count; separate animation CPU, skinning/submission, color/shadow/reflection passes. Verify culling does not freeze simulation or nearby interaction. Detailed visual choices remain R3. [E10](#e10-v1-performance-evidence) |
| Reduce A* allocation/open-list work | Lower burst search CPU and GC. | Search-call/node distribution, heap allocation and route parity before/after; no change in fauna preference or collision authority. [E03](#e03-v1-navigation) [E19](#e19-v3-navigation) |
| Spread nonurgent work across existing intervals | Reduce peaks from synchronized decisions, cache misses or resource maintenance. | Preserve accumulated elapsed, critical-event response, production/cargo conservation and ecology progression; compare p95/p99 and worst atomic unit, not average alone. V1 existing animal policy is the baseline. [E08](#e08-v1-fauna) [E12](#e12-v2-simulation-root-and-time) |
| Size existing caches from access traces | Avoid expensive regeneration without arbitrary memory growth. | Cold/warm hit rate, bytes including scratch/retained dependencies, eviction churn, world switch teardown. Cache must remain disposable and base tiles immutable. [E21](#e21-v1v2-streaming-and-memory) [E22](#e22-v3-navigation-measurements-and-prior-comparison) [E26](#e26-v1-persistence-and-worldgen-cache) |

No opportunity above authorizes changing tree density, effect quality, shadow resolution, simulation population or day length. A valid future comparison must retain equivalent visible content and simulation commitments, record hardware/renderer/profile/seed/camera/weather/clock/active systems, and distinguish first-touch, warm steady state, travel and teardown. V1's performance monitor and V2/V3 benches are existing tooling to adapt, not evidence that another framework is needed.

## 7. Research gaps and questions for Astra

These are unordered questions, not a work queue.

1. **Required continuity contract:** Which current V1 execution resets are acceptable, and which must eventually preserve intent/work carry/path progress? Existing authoritative persistence should not be mistaken for full execution persistence. Can selective event-based offscreen continuity remain the primary model for long commitments?
2. **Determinism target:** Is the intended guarantee same-seed world generation, repeatable local simulation, save/continuation within tolerance, or bit-identical replay independent of frame partition and platform? These have very different scope. Current V1 does not satisfy the strongest form; saved RNG alone will not establish it.
3. **World compatibility:** Must all existing V1 saves retain exact terrain/layout after generator/scale changes? V1's cache fingerprints are not generator-version retention. V2's version-gated generation and V3's identity pins are useful contrasting evidence, not a decided replacement policy.
4. **Navigation workload:** How many actual V1 searches occur, what triggers them, which fail, and how much time is terrain sampling versus open-list/allocations? Is C1 sufficient, or does cold geometry justify C2/C8? A warm synthetic navigation corpus cannot answer this alone.
5. **Preferred versus physical routes:** Which V1 agent/water/cave preferences must survive shared rasterization? What is the exact surface/cave/deck authority at the proposed adapter? A geometry-neutral core must not erase per-agent traversal semantics.
6. **State extraction scope:** Which existing pure V1 seams can be strengthened without replacing all of `NpcAgent`/`AnimalAgent`? What minimum pose/state projection lets rendering vary without changing proximity or movement truth?
7. **Save concurrency/recovery:** Are simultaneous manual/autosave/load, hidden-tab completion and cross-tab writes realistically possible under V1 callers? The separate read/put path warrants a race oracle; a defect and its user impact have not been reproduced here. What recovery guarantee is wanted beyond refusal and keeping the old committed row on failed writes?
8. **Economy offscreen coverage:** Travel, transport and agriculture have concrete catch-up paths; full unloaded production/needs equivalence was not established. Which stock flows and tasks currently stop at stream-out? Resolve this through actual owners rather than infer a complete aggregate economy from registry persistence.
9. **Fauna scale:** Current V1 has a wild spatial index and section cadence. Are remaining cross-system scans measurable at the intended richer population? Would incremental registry maintenance save anything after exact same-pass/layer rules are preserved?
10. **Performance baseline:** The latest V1 artifacts are useful but not matched to V2/V3. What is the representative V1 workload and target hardware for later A/B? Which GPU passes and asset identities dominate occupied settlements? Keep visual QA with R3 while R2 supplies ownership/cost boundaries.
11. **Evidence availability:** V3 review201's raw replay files were local/ignored; the checked-in review preserves method and aggregates, not all raw data. R1 arrived in a documentation-only commit and analyzes the same V1 code snapshot; its continuity/lifecycle findings are incorporated as prior evidence, not fresh reproductions. Reconcile later measurements with these exact snapshots rather than silently mixing revisions.

## 8. Evidence index

All source links below are commit-pinned. “Inspected” means the source or targeted relevant ranges were read for R2; it does not mean tests were executed. Test files marked “located” were identified in the pinned repository tree but not read in full. Historical research is contextual evidence; current source takes precedence.

### E01: V1 composition and lifecycle

- Inspected: [`src/app/worldBundle.ts`][v1-world] — `WorldBundle`, `createWorldBundle`, `rebuildWorldBundle`, background initialization, stale/failed/published handling and disposal.
- Inspected: [`src/app/gameLoop.ts`][v1-loop] — `tick`, validity gate, time-skip gating, NPC/fauna/terrain update order.
- Inspected: [`src/app/saveState.ts`][v1-save-state] — app/domain snapshot assembly and restore wiring.
- Inspected: [`docs/architecture/ARCHITECTURE.md`][v1-arch], [`src/app/worldRebuildLifecycle.test.ts`][v1-life-test]. `createApp.ts` composition ownership was established through these callers/docs; its entire body was not re-audited.

### E02: V1 time and randomness

- Inspected: [`src/world/dayNight.ts`][v1-day] — `createDayNightState` (480 s), `tickDayNight`.
- Inspected ranges: [`src/app/gameLoop.ts`][v1-loop] — `Math.min(rawDt, 0.05)`, `timeSkip.tick`, skip completion and ordinary update gate.
- Inspected ranges: [`src/ai/NpcAgent.ts`][v1-npc] — `Math.random` in reactions/wander/recovery; `update`, `resolveTimeSkip` and movement integration.

### E03: V1 navigation

- Inspected: [`src/navigation/navigation.ts`][v1-nav] — `findPath`, `segmentWalkable`, `simplifyPath`, local bounds and node cap; [`navigationStats.ts`][v1-navstats].
- Inspected: [`src/navigation/navigation.test.ts`][v1-navtest], [`src/ai/npcMovementWatchdog.ts`][v1-watch], [`npcMovementRecovery.ts`][v1-recovery].
- Located regression suites: `src/ai/npcMovementSurfaceRegression.test.ts`, `npcMovementCaveIntegration.test.ts`, `npcMovementRecovery.test.ts`. Call-site integration inspected in `NpcAgent` and `AnimalAgent`; full regression execution not performed.

### E04: V1 settlement continuity

- Inspected ranges: [`src/settlement/SettlementsManager.ts`][v1-settlements] — registry initialization, `unload`, `recheck`, `resolveTravelAndTransportCheckpoints`, `resolveMerchantJourneyCheckpoints`, agricultural anchors, capture/restore APIs and detached livestock.
- Inspected: [`src/ai/npcOffscreenSurvival.ts`][v1-offscreen] — `resolveNpcOffscreenTravelInterval`, threshold-based provision consumption and `cannot-progress`.

### E05: V1 offscreen and time-skip tests

- Inspected: [`src/ai/npcOffscreenSurvival.test.ts`][v1-offscreen-test].
- Located: `src/ai/NpcAgent.timeSkip.test.ts`, `src/ai/npcTravel.test.ts`, `src/ai/npcTravelCheckpoint.ts`; source behavior checked through E02/E04, not full suite reproduction.

### E06: V1 economy

- Inspected: [`src/economy/productionExecutor.ts`][v1-production] — `preflightProductionInputs`, `executeProduction`, owner preflight, normalized recipe and transactional mutations; [`productionExecutor.test.ts`][v1-production-test].
- Inspected: [`src/economy/sourceLedger.ts`][v1-ledger] and [`sourceLedger.test.ts`][v1-ledger-test] — source quantities, realized events, entitlement accrual/claims and sparse persistence.
- Located related owners/tests: `settlementEconomy.ts`, `npcWork.ts`, `localExchange.ts`, `interSettlementFoodTransport.ts`, `oreTransportDemand.ts`, `foodTransportDemand.ts` under `src/economy/`. Their existence is not independent acceptance of every trade path.

### E07: V1 transport commitments

- Inspected: [`src/world/transportOrder.ts`][v1-transport] — order/cargo-reference and offscreen execution representation.
- Execution/handoff callers: E04; save representation: E26. Full long-distance economic conservation was not run.

### E08: V1 fauna

- Inspected: [`src/fauna/createFauna.ts`][v1-fauna] — shared agent iteration, proximity rebuild, bound occupancy and spawner bookkeeping.
- Inspected: [`src/fauna/animalUpdateCadence.ts`][v1-cadence], targeted [`AnimalAgent.ts`][v1-animal] ranges and [`AnimalSpawner.ts`][v1-spawner] — critical cadence exemptions, accumulated movement limits, population binding, depletion and recovery.
- Inspected explanatory owner: [`docs/architecture/performance-and-workers.md`][v1-workers-doc]. Located suites: `animalUpdateCadence.test.ts`, `persistentOccupants.test.ts`, `AnimalSpawner.test.ts`, `habitatPressure.test.ts` under `src/fauna/`.

### E09: V1 spatial queries

- Inspected: [`src/fauna/faunaProximity.ts`][v1-proximity] — `createFaunaProximityIndex`, conservative covering cells, strict counting and bucket reuse.
- Call order: E08 and [`gameLoop.ts`][v1-loop], including NPC/fauna encounter composition. Located: `src/fauna/faunaProximity.test.ts`, `src/app/faunaEncounterComposition.test.ts`.

### E10: V1 performance evidence

- Inspected: [`docs/performance/README.md`][v1-perf] — current mechanisms, historical limits, September 21 attribution and already-landed optimizations.
- Inspected relevant sections: [`stream 029`][v1-stream], [`settlement-heavy 030`][v1-heavy]. Recorded on September 21; artifacts do not prove a new measurement at analyzed HEAD.
- Inspected: [`2026-09-14 main-thread frame spike trace audit`][v1-trace] — timing limits and river/terrain lead. Located corresponding trace summary under `docs/performance/trace-results/`.
- Inspected source: [`src/render/shadowBudget.ts`][v1-shadow], [`src/perf/benchmark.ts`][v1-bench]. Broader asset/visual decisions excluded from R2.

### E11: V1 NPC decision and state

- Inspected: [`src/ai/npcDecision.ts`][v1-decision] and integration ranges in [`NpcAgent.ts`][v1-npc]; state ownership/checkpoint callers in E04.
- Shared contracts located under `src/simulation/`: `types.ts`, `scoreActions.ts`, `actionLifecycle.ts`, `interactionQueue.ts`. Referenced in inspected `STATE`/agent imports; not all shared modules re-audited.

### E12: V2 simulation root and time

- Inspected: [`src/game/sim/sim.ts`][v2-sim] — `Sim`, `step`, `lodInterval`, RNG/state/index ownership and 400-step guard.
- Inspected: [`worldSystems.ts`][v2-systems] — `installSystems`, ecology/household/den loops and intervals; [`time.ts`][v2-time], [`config/calibration.ts`][v2-config], [`core/rng.ts`][v2-rng]. V2 LOD intervals are 0.1 s through 180 m, 0.5 s through 700 m and 3 s beyond; NPC/animal elapsed deltas are capped at 30 s per due update.
- Inspected: [`npc/ai.ts`][v2-npc], [`fauna/ai.ts`][v2-fauna] — outer scans, accumulated actor deltas, due/decision scheduling. Located LOD tests: `src/game/sim/tiers.test.ts`.

### E13: V2 navigation and spatial indexes

- Inspected: [`src/game/sim/movement.ts`][v2-move] — `steerTo`, `routeVia`, separation, full/cheap movement and stuck decay.
- Inspected: [`pathfinding.ts`][v2-nav] — player-autopilot A*; [`navigation.ts`][v2-mapnav] — caller and discovery loop; [`world/spatial.ts`][v2-grid] — `SpatialHash` query/output semantics.
- Located: `movementOrbit.test.ts`, `pathfinding.test.ts`, `caveNav.test.ts` in `src/game/sim/`, and `src/game/world/spatial.test.ts`.

### E14: V2 world generation and save

- Inspected: [`src/game/world/gen/generate.ts`][v2-gen], [`world/types.ts`][v2-world-types] — seed/generator selection and supported world representation.
- Inspected: [`src/game/save/db.ts`][v2-db], [`compat.ts`][v2-compat], [`snapshot.ts`][v2-snapshot], [`validate.ts`][v2-validate], [`compat.fixture.test.ts`][v2-fixture].
- Located world-generation/version/serialization suites under `src/game/world/gen/` and `src/game/world/serialize.test.ts`; no fresh generation or frozen-save execution.

### E15: V2 layering and diagnostics

- Inspected: [`scripts/check-layers.mjs`][v2-layers], [`scripts/bench/sim-bench.ts`][v2-bench], [`docs/state/PERF.md`][v2-perf].
- Inspected: [`src/game/sim/conservation.test.ts`][v2-conserve], [`npc/works.ts`][v2-works], [`trade.ts`][v2-trade]. Existing ledger/oracle design is useful without adopting the whole simulation.
- Native raw artifact located: `docs/performance/2026-10-07--01--laptop.json`; numbers here are attributed to PERF's summary, not independently recomputed from that JSON.

### E16: V3 agent registry, grid and generic scheduler

- Inspected: [`src/game/sim/agents/registry.ts`][v3-registry], [`spatialGrid.ts`][v3-grid], [`scheduler.ts`][v3-scheduler], [`config/agents.ts`][v3-agent-config].
- Inspected: [`spatialGrid.test.ts`][v3-grid-test], [`scheduler.test.ts`][v3-scheduler-test]. Note fresh-array iteration, bucket `indexOf`, default far exclusion and input-dependent substeps.

### E17: V3 live NPC runtime

- Inspected: [`src/game/session/npcLive.ts`][v3-live], [`npcG2Consumer.ts`][v3-g2], [`sim/npc/life.ts`][v3-npc-life], [`config/npcAi.ts`][v3-npc-config].
- Actual activation/capture wiring: inspected ranges in [`session/sceneSession.ts`][v3-scene]. `NPC_LIVE_ENABLED=true`; `npcG3Enabled()` follows live enablement; social pairs/need false. Host header's default-OFF statement is stale.
- Durable capture, `dropFar`, staged preparation and per-resident fault handling inspected. Located live/cast/G3/restore tests in `src/game/session/`; not run.

### E18: V3 world-step and clocks

- Inspected: [`src/game/core/clock.ts`][v3-clock], [`session/sessionClock.ts`][v3-session-clock], [`sessionSimulation.ts`][v3-simulation], [`worldStep.ts`][v3-world-step].
- Relevant symbols: `GameClock.prepareStep/commitStep`, `vitalsStepFrom`, `SessionClock.prepareStep`, consumer attachment and closed-boundary execution. Located clock/world-step/session-continuation tests beside these owners.

### E19: V3 navigation

- Inspected: [`src/game/sim/agents/nav/astar.ts`][v3-astar] — `PathFinder.find`, typed heap/scratch, retained sliced searches and explicit outcomes.
- Inspected: [`raster.ts`][v3-raster], [`navWorld.ts`][v3-navworld], [`pathQueue.ts`][v3-queue] and E16 config — LRU tiles/build quotas, door planning and fair intent-aware admission.
- Located A*, raster, queue and readiness suites beside these files. Unsliced live queue invocation versus sliced staged preparation distinguished through E17/E20.

### E20: V3 navigation execution and invalidation

- Inspected: [`src/game/sim/npc/liveNav.ts`][v3-live-nav], [`agents/nav/steering.ts`][v3-steering], [`stuck.ts`][v3-stuck], [`stuck.test.ts`][v3-stuck-test].
- Inspected callers: E17 invalidate/preparation/restore and scene felling invalidation; located `sweep.test.ts`, `pathFailures.test.ts`, `goalFailures.test.ts`, `unstuckRung.test.ts`, `session/npcStagedFelledNav.test.ts`.

### E21: V1/V2 streaming and memory

- Inspected relevant ranges: [`V1 src/terrain/chunkManager.ts`][v1-chunks] — `drainByBudget`, finalization queue, `requestChunkMeshData`, mutation epochs, stale-result guards and river tile retention.
- Inspected: [`chunkWorkerPool.ts`][v1-pool], [`chunkMeshCache.ts`][v1-meshcache], [`vegetationRegionBatcher.ts`][v1-batcher].
- Inspected: [`V2 src/game/render/vegetation.ts`][v2-vegetation], [`terrainChunks.ts`][v2-chunks] — presentation preparation/LOD/cache lifecycle; performance result limitations in E15.

### E22: V3 navigation measurements and prior comparison

- Inspected: [`docs/reviews/2026-10-22--201--opus-architecture-review-m4-activation-vegetation-nav-cache.md`][v3-review201] §2 — fixed-corpus cache experiment, historical D-ARCH-95…98 contracts and remaining cold tails. Raw local files were not available in R2.
- Reused and checked against current direct sources: [`docs/research/2026-10-17--018--navigation-v1-v2-v3-hybrid-routing.md`][v3-navresearch]. Its older cache/default/gate descriptions are historical, not current activation truth.
- Inspected: [`docs/plans/performance--001--v1-v2-render-and-asset-reuse.md`][v3-perfplan] — matched-scene evidence and distinction between static asset metrics and GPU timings; still a planning document.

### E23: V3 world identity and streaming

- Inspected: [`src/game/session/assembleWorld.ts`][v3-assemble], [`world/canonical/worldIdentity.ts`][v3-identity], [`session/worldLifecycle.ts`][v3-lifecycle], [`render/chunkRing.ts`][v3-ring].
- World identity fields consumed by E24; hash/overlay validation suites located under `src/game/world/canonical/`. Not all terrain renderer or canonical snapshot binary data re-audited.

### E24: V3 save boundary

- Inspected: [`src/game/save/saveService.ts`][v3-save], [`parseSave.ts`][v3-parse], [`restoreSave.ts`][v3-restore], [`saveConstants.ts`][v3-save-config], [`saveIntegrity.test.ts`][v3-integrity].
- Inspected: [`src/game/session/idbSaveStorage.ts`][v3-idb] — `writeAtomic`, two-store transaction, expected revision and generation checks, abort/complete handling.
- Located additional tests: `session/idbSaveCommit.test.ts`, `session/idbSaveStorage.test.ts`, `save/saveService.test.ts`, `save/parseSave.test.ts`. Restore placement repair is bounded and domain-specific, not universal corruption recovery.

### E25: Cross-version context and instructions

- Read V1 `CLAUDE.md`, `docs/CODE_INDEX.md`, `docs/STATE.md`, `docs/plans/README.md`, `docs/research/README.md` at the pinned commit.
- Read V2 `CLAUDE.md`, `docs/README.md`, `docs/state/CODE-MAP.md`, relevant `PROGRESS`/PERF ranges. No root `AGENTS.md` existed at that snapshot.
- Read V3 `AGENTS.md`, `CLAUDE.md`, `docs/INDEX.md`, relevant `PROGRESS` ranges, [`PORT-LEDGER.md`][v3-ports], [`docs/comparison/README.md`][v3-comparison] and [`2026-10-08 architecture review`][v3-oldreview]. Imported/copied trees were used as pointers only; consequential claims here use direct V1/V2/V3 source snapshots.

### E26: V1 persistence and worldgen cache

- Inspected: [`src/persistence/saveData.ts`][v1-save] — `CURRENT_SAVE_VERSION=56`, schema/inspection and `migrateStoredSave`; [`saveDb.ts`][v1-db] — read/write validation, slot status and overwrite guard; [`saveDb.test.ts`][v1-db-test].
- Inspected: [`src/persistence/worldgenCacheDb.ts`][v1-worldcache], [`docs/state/persistence.md`][v1-persistence] — namespace/version/fingerprint separation, clone-before-mutation and persistence taxonomy; chunk cache caller in E21.
- Six documented namespaces: `locations-coarse`, `abandoned-cemeteries`, `caves-v2`, `chunk-tiles`, `road-routes`, `settlement-definitions`. Individual namespace fingerprint implementations were not all re-audited; no cache corruption/failure tests executed.

### E27: R1 and existing V1 follow-ups

- Read: [R1 baseline][v1-r1] at documentation commit `996295cbc1410738e6a988faac90942bef4f9c4b`; its code baseline is identical to R2's V1 baseline.
- Read: [`docs/reviews/2026-09-21--agent-performance-and-simulation-boundary-followups.md`][v1-agent-audit] and [`docs/reviews/2026-09-21--player-world-lifecycle-followups.md`][v1-lifecycle-audit]. Findings retain their original evidence status; associated plans were not implemented or edited here.
- Inspected: [`src/render/agentPresentationLod.ts`][v1-agent-lod] — `resolveAgentPresentationLevel`, optional-node policy and importance override.

### Handoff to Astra

Strongest bounded candidates: C1 search-storage adaptation, C3 dependency guards and C7 conservation/diagnostic oracles; C2/C8 bounded cold preparation and C4 save atomicity have meaningful mechanisms but require workload/compatibility proof. Preserve V1's authoritative registries, selective offscreen commitments, real inventory/source accounting, habitat lifecycle, movement/cave/water semantics and current presentation. The decisive unresolved questions are the required determinism/continuity guarantee, old-save/world identity policy and measured V1 hot paths. No migration order or wholesale replacement decision is made here.

[v1-world]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/app/worldBundle.ts
[v1-loop]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/app/gameLoop.ts
[v1-save-state]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/app/saveState.ts
[v1-arch]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/architecture/ARCHITECTURE.md
[v1-life-test]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/app/worldRebuildLifecycle.test.ts
[v1-day]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/world/dayNight.ts
[v1-npc]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/ai/NpcAgent.ts
[v1-nav]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/navigation/navigation.ts
[v1-navstats]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/navigation/navigationStats.ts
[v1-navtest]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/navigation/navigation.test.ts
[v1-watch]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/ai/npcMovementWatchdog.ts
[v1-recovery]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/ai/npcMovementRecovery.ts
[v1-settlements]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/settlement/SettlementsManager.ts
[v1-offscreen]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/ai/npcOffscreenSurvival.ts
[v1-offscreen-test]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/ai/npcOffscreenSurvival.test.ts
[v1-production]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/economy/productionExecutor.ts
[v1-production-test]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/economy/productionExecutor.test.ts
[v1-ledger]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/economy/sourceLedger.ts
[v1-ledger-test]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/economy/sourceLedger.test.ts
[v1-transport]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/world/transportOrder.ts
[v1-fauna]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/fauna/createFauna.ts
[v1-cadence]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/fauna/animalUpdateCadence.ts
[v1-animal]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/fauna/AnimalAgent.ts
[v1-spawner]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/fauna/AnimalSpawner.ts
[v1-workers-doc]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/architecture/performance-and-workers.md
[v1-proximity]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/fauna/faunaProximity.ts
[v1-perf]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/performance/README.md
[v1-stream]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/performance/results/2026-09-21--029--benchmark-stream.md
[v1-heavy]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/performance/results/2026-09-21--030--benchmark-settlement-heavy.md
[v1-trace]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/performance/audits/2026-09-14--main-thread-frame-spike-trace.md
[v1-shadow]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/render/shadowBudget.ts
[v1-bench]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/perf/benchmark.ts
[v1-decision]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/ai/npcDecision.ts
[v1-chunks]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/terrain/chunkManager.ts
[v1-pool]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/terrain/chunkWorkerPool.ts
[v1-meshcache]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/terrain/chunkMeshCache.ts
[v1-batcher]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/terrain/vegetationRegionBatcher.ts
[v1-save]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/persistence/saveData.ts
[v1-db]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/persistence/saveDb.ts
[v1-db-test]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/persistence/saveDb.test.ts
[v1-worldcache]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/persistence/worldgenCacheDb.ts
[v1-persistence]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/state/persistence.md
[v2-sim]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/sim.ts
[v2-systems]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/worldSystems.ts
[v2-time]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/time.ts
[v2-config]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/config/calibration.ts
[v2-rng]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/core/rng.ts
[v2-npc]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/npc/ai.ts
[v2-fauna]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/fauna/ai.ts
[v2-move]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/movement.ts
[v2-nav]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/pathfinding.ts
[v2-mapnav]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/navigation.ts
[v2-grid]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/spatial.ts
[v2-gen]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/gen/generate.ts
[v2-world-types]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/world/types.ts
[v2-db]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/save/db.ts
[v2-compat]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/save/compat.ts
[v2-snapshot]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/save/snapshot.ts
[v2-validate]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/save/validate.ts
[v2-fixture]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/save/compat.fixture.test.ts
[v2-layers]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/scripts/check-layers.mjs
[v2-bench]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/scripts/bench/sim-bench.ts
[v2-perf]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/docs/state/PERF.md
[v2-conserve]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/conservation.test.ts
[v2-works]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/npc/works.ts
[v2-trade]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/trade.ts
[v2-vegetation]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/vegetation.ts
[v2-chunks]: https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/terrainChunks.ts
[v3-registry]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/registry.ts
[v3-grid]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/spatialGrid.ts
[v3-scheduler]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/scheduler.ts
[v3-agent-config]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/config/agents.ts
[v3-grid-test]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/spatialGrid.test.ts
[v3-scheduler-test]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/scheduler.test.ts
[v3-live]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/npcLive.ts
[v3-g2]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/npcG2Consumer.ts
[v3-npc-life]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/npc/life.ts
[v3-npc-config]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/config/npcAi.ts
[v3-scene]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/sceneSession.ts
[v3-clock]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/core/clock.ts
[v3-session-clock]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/sessionClock.ts
[v3-simulation]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/sessionSimulation.ts
[v3-world-step]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/worldStep.ts
[v3-astar]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/astar.ts
[v3-raster]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/raster.ts
[v3-navworld]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/navWorld.ts
[v3-queue]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/pathQueue.ts
[v3-live-nav]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/npc/liveNav.ts
[v3-steering]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/steering.ts
[v3-stuck]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/stuck.ts
[v3-stuck-test]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/sim/agents/nav/stuck.test.ts
[v3-review201]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/reviews/2026-10-22--201--opus-architecture-review-m4-activation-vegetation-nav-cache.md
[v3-navresearch]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/research/2026-10-17--018--navigation-v1-v2-v3-hybrid-routing.md
[v3-perfplan]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/plans/performance--001--v1-v2-render-and-asset-reuse.md
[v3-assemble]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/assembleWorld.ts
[v3-identity]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/world/canonical/worldIdentity.ts
[v3-lifecycle]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/worldLifecycle.ts
[v3-ring]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/render/chunkRing.ts
[v3-save]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/save/saveService.ts
[v3-parse]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/save/parseSave.ts
[v3-restore]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/save/restoreSave.ts
[v3-save-config]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/save/saveConstants.ts
[v3-integrity]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/save/saveIntegrity.test.ts
[v3-idb]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/src/game/session/idbSaveStorage.ts
[v3-ports]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/state/PORT-LEDGER.md
[v3-comparison]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/comparison/README.md
[v3-oldreview]: https://github.com/jm-sky/seedvale/blob/17a81bd1ea0cea1920525a92b52d754e155a3ead/docs/reviews/2026-10-08--001--v1-v2-architecture-review.md
[v1-r1]: https://github.com/jm-sky/seedvale-v1/blob/996295cbc1410738e6a988faac90942bef4f9c4b/docs/research/v1-revival/2026-10-25--001--v1-baseline.md
[v1-agent-audit]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/reviews/2026-09-21--agent-performance-and-simulation-boundary-followups.md
[v1-lifecycle-audit]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/docs/reviews/2026-09-21--player-world-lifecycle-followups.md
[v1-agent-lod]: https://github.com/jm-sky/seedvale-v1/blob/00a1e0332aa034104d9021e82b0bf5299c4216e1/src/render/agentPresentationLod.ts
