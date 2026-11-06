# SeedVale V1 Revival — CPU, Game Loop & Simulation Performance Critical Review (Session 4)

**Reviewer:** ChatGPT GPT-6; independent static architecture review. **Date:** 2026-11-06.  
**Reviewed source:** `ed875da44c5aea0c5a7f92df9787f67db7197443` (`main`). **Review status:** completed within bounded static scope; **system 16 stays partial**.  
**Verification:** GitHub source/tests and prior reports inspected. No local test execution, profiling trace, browser/driver run, GPU test, benchmark or runtime confirmation.

## 1. Context, continuity and boundaries

Read [Session 1 (036)](./2026-11-06--036--rendering-gpu-critical-architecture-session-1.md), [Session 2 (037)](./2026-11-06--037--rendering-streaming-critical-architecture-session-2.md), [Session 3 (038)](./2026-11-06--038--rendering-actors-lod-memory-critical-architecture-session-3.md), and [independent Session 3 supplement (039)](./2026-11-06--039--actor-rendering-lod-memory-session-3-evidence-supplement.md). Examined `CLAUDE.md`, `docs/CODE_INDEX.md`, `docs/reviews/SYSTEM-REVIEW-MATRIX.md`, `docs/research/v1-revival/STRATEGIC-BRIEF.md`, `docs/architecture/ARCHITECTURE.md`, `docs/architecture/performance-and-workers.md` and relevant current source/tests.

Comparison from Session 3 source `7c6ea3c47` to current `main` identified rumour/dialogue, save and application-wiring changes, review documents and later planning/voice-tooling edits. The core `gameLoop`, `SettlementsManager`, `AnimalAgent`, cadence, chunk manager and worker pool were unchanged in compared paths. This does not certify other changes as performance-neutral.

**Scope:** rAF scheduling; CPU frame and simulation cadence; NPC, settlement and wild/domestic fauna; unloaded-world checkpoints; worker priorities and cancellations; chunk/actor publication interaction; tracing/profiling. **Excluded:** full AI/economy/quest correctness, persistence, asset/actor disposal and GPU/visual audits already covered in Sessions 1–3, implementation and heavy benchmarking.

**Verdict:** Existing local controls (chunk start/finalization slots, workers, fauna importance cadence, checkpoint-based offscreen work, benchmark and CPU timers) are meaningful. Their composition does **not** provide an aggregate main-thread frame-time bound. Two significant population-scaling paths are confirmed in code: the detached-livestock per-frame scan of *all retained NPC states*, and the per-settlement O(N²) crowd pass. No FPS impact is claimed without measurements. Preserve living-world autonomy, identity and deterministic ownership; do not reduce simulation/population to obtain FPS.

## 2. End-to-end execution map

| Stage | Verified execution path | Budget/semantic boundary |
| --- | --- | --- |
| Browser | [`appRenderLoop.ts:148–174`](../../src/app/appRenderLoop.ts) schedules the next `requestAnimationFrame` before invoking `GameLoop.tick` | One synchronous browser-frame driver; optional debug/resize callbacks are separate |
| Frame clock | [`gameLoop.ts:1061–1099`](../../src/app/gameLoop.ts): `timer.update`, `rawDt`, world-valid gate, `dt = Math.min(rawDt, 0.05)`, skip clock | Variable-step, capped to 50 ms; no fixed-step accumulator |
| World/streaming | [`gameLoop.ts:2895–2936`](../../src/app/gameLoop.ts): discovery → chunk update → far terrain/caves → resource updates | Terrain and settlements have independent distance-triggered rechecks |
| Loaded NPCs | [`gameLoop.ts:2943–3023`](../../src/app/gameLoop.ts): local candidate arrays → `SettlementsManager.update` → per-settlement crowd → all live NPC updates, social, rats, livestock | Synchronous main-thread work for all loaded residents |
| Wild fauna | [`gameLoop.ts:3024–3159`](../../src/app/gameLoop.ts): livestock snapshot → fauna update → traps and carts | All materialized animal sensing/decision/life runs each live frame; selected movement/visual sections are cadence-gated |
| Other CPU work | [`gameLoop.ts:3160–3216`](../../src/app/gameLoop.ts): items, fire, water/grass, sight and minimap | Some presentation CPU is outside ``NPC` and `FAUNA` categories |
| Renderer | [`gameLoop.ts:3257–3368`](../../src/app/gameLoop.ts): light sync → mirror → beauty/postprocess → labels; monitor and GPU query | `simulateMs` means *pre-render wall time*; GPU query begins after mirror |
| Skip boundary | [`gameLoop.ts:1123–1152,2665–2685`](../../src/app/gameLoop.ts): live agents frozen during skip; one synchronous `resolveTimeSkip` pass at completion | Actor × skip-duration catch-up can be concentrated in a single frame |
| Async publication | [`SettlementsManager.ts:1257–1307`](../../src/settlement/SettlementsManager.ts), [`createSettlement.ts:1489–1614`](../../src/settlement/createSettlement.ts), [`chunkManager.ts:2144–2225`](../../src/terrain/chunkManager.ts) | Async job completion is main-thread continuation; local start budgets do not cap arrival CPU or first GPU use |

There is no source-based proof that the 50 ms clamp preserves identical simulation progression across frame rates or tab suspension: normal rAF time above the cap is not replayed. Absolute-day offscreen checkpoints and separately defined time-skip semantics protect particular workflows; they are not a global fixed-step contract.

## 3. Scaling and offscreen analysis

| Work family | What cost follows | Cadence |
| --- | --- | --- |
| NPC crowd | **Sum over loaded settlements of N(N−1)/2 NPC pairs** | Every active settlement frame |
| NPC FSM/needs/animation | Loaded settlement resident count | Per-frame; mixer progresses even when model is not in camera (S3-4) |
| Detached pack follow-target association | **All retained materialized/restored NPC states** when one detached animal exists | **Every frame**; independent of active merchant journeys |
| Settlement recheck | Candidate cells, loaded entries and retained NPC registry checkpoints | On player movement threshold or time-skip, not every frame |
| Fauna sensing/decision/life | Materialized animals, not all potential continent animals | Every live frame; movement/presentation conditionally reduced |
| Fauna spawner state | Live spawners + materialized animals | Time advances every frame; daily recovery adds day-boundary scans |
| Construction/reification | Simultaneous ready chunks, resident models, settlement content | Event-driven, with unbounded individual main-thread continuation cost |
| Distant transport / NPC state | Committed orders and registry states | At relevant checkpoint, not full world AI evaluation per frame |

[`npcState.ts:391–461`](../../src/settlement/npcState.ts) retains states created/restored so far, including unloaded settlements. This is **not** proof that never-visited continent NPCs are allocated. [`createFauna.ts:1403–1655`](../../src/fauna/createFauna.ts) operates on materialized habitat groups and fauna actors. Thus V1 already avoids a naive per-frame loop over every hypothetical world resident, but some persistent state is unexpectedly revisited at full frame rate.

## 4. Findings — severity, classification and evidence

| ID | Severity | Class | Summary |
| --- | --- | --- | --- |
| **S4-1** | **High** | confirmed architectural scaling defect | Any detached livestock triggers a per-frame retained-NPC registry scan |
| **S4-2** | **High** | architectural risk, verified complexity | All pairs of NPCs in each loaded settlement are tested every frame |
| **S4-3** | **High** | architectural risk / performance hypothesis | One skip-completion frame can replay all loaded residents over many half-hour steps |
| **S4-4** | **High** | confirmed integration budget gap / unmeasured spike hypothesis | Chunk/grass/model completion and streaming can coincide outside local budget accounting |
| S4-5 | Medium | observability limitation | Frame, worker event, main-thread publication, GC and GPU costs are not fully joined |
| S4-6 | Medium | time/determinism semantics risk | Variable capped timestep does not preserve dropped real time as fixed steps |
| S4-7 | Medium | architectural scaling risk | Fauna sensing and spawner bookkeeping remain frequent despite behavior cadence |
| S4-8 | Medium | confirmed cross-session defect (S2-3) | Cancelled worker jobs lose logical occupancy but retain physical worker slot |

### S4-1 — Detached livestock scales with retained world population

**Affected:** [`SettlementsManager.ts:1579–1618`](../../src/settlement/SettlementsManager.ts), [`npcState.ts:391–461`](../../src/settlement/npcState.ts). **Confidence:** high for mechanism, medium for actual frame impact.

**Evidence / root:** Every call to `SettlementsManager.update` with `detachedLivestock.length > 0` builds `originByAnimal` then always runs `npcStates.forEach` to regenerate `merchantByPackAnimalKey`. Only *after* this full scan does `merchantByPackAnimalKey.size > 0` gate live target resolution. `NpcStateRegistry` holds states beyond streamed actor lifetime, so a single detached animal causes O(all retained NPC records) repeated each frame, even when no relevant merchant pack journey exists. This contradicts the nearby comment if interpreted as gating the scan.

**Trigger / consequence:** Animal ownership, led/mounted detached state or merchant pack animal + a save/playthrough with many known NPCs; potential progressively higher background CPU/allocations without nearby population change.

**Minimum correction:** derive active pack associations from existing journey transition/ownership events or keep a correctly invalidated keyed index under current registry ownership, preserving origin+animal ID composite keys. **Alternative/trade-off:** memoizing scan results without complete invalidation risks stale journey/identity state; no new global simulation scheduler is needed. **Verify:** fixed one-animal scenario with growing retained NPC states, transitions assign/cancel/return, multi-origin animal-ID collision, save/load/rebuild, CPU timing. No measured FPS impact claimed.

### S4-2 — NPC crowd is quadratic per settlement and includes dead-agent pair slots

**Affected:** [`createSettlement.ts:1795–1816`](../../src/settlement/createSettlement.ts), [`npcCrowd.ts:44–97`](../../src/ai/npcCrowd.ts). **Confidence:** high complexity, medium real-world impact.

**Evidence / root:** `npcCrowd.run(agents,dt)` unconditionally iterates every `i, j>i` pair, computes distance then checks near-count/separation. Corpses remain in the pair list, although they are excluded from physical pushing. Reused arrays save allocation but not pair comparisons. Work grows with N(N−1)/2 each active frame, atop per-agent FSM, pathing, labels and social work.

**Trigger / consequence:** Large settlement or several simultaneously loaded settlement populations; possible CPU spikes and non-linear steady cost. **Minimum correction:** retain `npcCrowd` ownership and symmetric force semantics but evaluate a deterministic settlement-local spatial-neighbor index, pairing once per unordered pair. **Alternative/trade-off:** lower-frequency crowd updates are simpler but risk physical overlap/near-count behavior and time-step changes. **Verify:** count pair evaluations and wall time against N; compare exact impulse/near-count results including clustered, empty, corpse and border cases, order stability, and settlement-heavy p95/p99.

### S4-3 — Skip-end replay has no aggregate per-frame limit

**Affected:** [`gameLoop.ts:1123–1152`](../../src/app/gameLoop.ts), [`SettlementsManager.ts:1520–1543`](../../src/settlement/SettlementsManager.ts), [`NpcAgent.ts:936–942,3934–4004`](../../src/ai/NpcAgent.ts), [`createFauna.ts:1652–1655`](../../src/fauna/createFauna.ts), [`timeSkip.ts:112–149`](../../src/world/timeSkip.ts). **Confidence:** high path, medium spike hypothesis.

**Evidence / root:** While active skip suppresses live NPC/fauna ticks, `skip.justFinished` invokes `settlementsManager.resolveTimeSkip` and `fauna.resolveTimeSkip` synchronously. For each loaded ordinary NPC, `NpcAgent.resolveTimeSkip` loops through chunks of at most `TIME_SKIP_SAMPLE_HOURS = 0.5` with schedule/needs/stock transactions. Other committed-travel and animal pathways have specialized catch-up logic. No count/time deadline subdivides total replay.

**Trigger / consequence:** Long wait/rest with a large loaded population may stall one frame, regardless of absence of work during the skip. **Minimum correction:** first measure replay calls, hours, entities and time; if expensive, stage only semantically equivalent owner-local catch-up with an atomic state/publication boundary. **Alternative/trade-off:** analytical timestamp folding is promising only for pure state; needs/profession inventory mutations and ordering make blind simplification dangerous. **Verify:** 1–24h skips across populations, record deterministic snapshots of needs/stock/corpses/travel/quest state before and after; interruptions and reload; Chrome main-thread trace.

### S4-4 — Independent start budgets do not cap result-publication bursts

**Affected:** [`chunkManager.ts:1321–1333,2144–2225,3041–3068`](../../src/terrain/chunkManager.ts), [`createSettlement.ts:585–600,1489–1614`](../../src/settlement/createSettlement.ts), [`SettlementsManager.ts:1257–1307,1407–1433`](../../src/settlement/SettlementsManager.ts), [`gameLoop.ts:2899–2901,3002–3037,3257–3339`](../../src/app/gameLoop.ts). **Confidence:** high mechanism, medium actual hitch contribution. **Overlap:** Session 2 S2-1/S2-2 and Session 3 S3-3/S3B-2; not new duplicate defect counts.

**Evidence / root:** Chunk limits two starts and one finalize-*start* per game frame; `runFinalize` awaits a mesh worker/cache result but the drain does not await the continuation. Grass and regional instances have additional asynchronous callbacks; content stage may take arbitrarily long. `collectAgentBatch` initiates many `NpcAgent.create` promises, attaches actor meshes before settlement acceptance, and waits for `Promise.allSettled`, without a shared actor publication budget. Terrain and settlement rechecks are separately player-motion-triggered; several unloads can run synchronously. First GPU buffer upload/program use occurs after scene attachment.

**Trigger / consequence:** Crossing chunk/settlement boundaries, cold/warm asset resolution, teleport, camera turn after offscreen publication, world rebuild; plausible correlated CPU main-thread plus first-use GPU spikes. **Minimum correction:** instrument prepare/result/attach/first-draw counts and durations at established owner seams, then coalesce ready publication within existing chunk and settlement lifecycle with stale-identity/rollback checks. **Alternative/trade-off:** new global scheduler adds cross-owner ordering and architecture complexity and cannot bound GPU submission by CPU time. **Verify:** repeated stream/settlement-walk cold/warm routes; synchronized worker completions, loaded NPC count, region rebuild counters, first use and p99 GPU/CPU separation.

### S4-5 — Diagnostics capture rAF spans but not complete browser-task causality

**Affected:** [`perf/monitor.ts:279–405,469–484`](../../src/perf/monitor.ts), [`perf/types.ts:10–27`](../../src/perf/types.ts), [`perf/agentCpuDiag.ts`](../../src/perf/agentCpuDiag.ts), [`gameLoop.ts:3257–3368`](../../src/app/gameLoop.ts), [`perf/gpuTimer.ts`](../../src/perf/gpuTimer.ts). **Confidence:** high.

**Evidence / root:** Monitor already collects frame p50/p95/p99, long frames with category/stage samples, and agent-specific CPU counts. Its `queueMicrotask` commits a frame after same-task microtasks and uses `performance.now() - frameStartedAt`, so such continuations are included. Separate worker message tasks, browser garbage collection and other work **between** rAF callbacks are not attributed to their cause by the per-frame CPU categories. `simulateMs` includes all pre-render presentation preparation, not strictly simulation. GPU elapsed query begins around beauty/postprocess/labels; the earlier mirror is outside its timing span. `SHADOWS`/`POSTPROCESS` category slots are reserved, not independently measured.

**Trigger / consequence:** Misleading attribution of long frames and difficulty linking queue delays, synchronous actor publication, shader/driver upload and CPU GC. **Minimum correction:** extend existing perf monitor/benchmark sidecar with timestamped worker queue/start/complete and main-thread publication stages, and align them to Chrome long tasks/GC and GPU timer provenance. **Alternative/trade-off:** second independent profiling framework duplicates infrastructure; avoid. **Verify:** trace benchmark window marks against Chrome events, worker queue latency, cold/warm first draw and p95/p99, including mirror and beauty boundaries.

### S4-6 — 50 ms variable-step cap is not fixed-step simulation

**Affected:** [`gameLoop.ts:1061–1099`](../../src/app/gameLoop.ts), [`appRenderLoop.ts:148–174`](../../src/app/appRenderLoop.ts), [`NpcAgent.ts:3239–3316`](../../src/ai/NpcAgent.ts), [`timeSkip.ts:112–149`](../../src/world/timeSkip.ts). **Confidence:** high policy, medium gameplay risk.

**Evidence / root:** Browser rAF drives a single variable `dt` update capped at 50ms; no fixed-timestep accumulator or repayment of elapsed excess. The cap avoids a giant single movement step, but under prolonged frame stalls/background-tab throttling simulation may progress slower than wall time. Nonlinear steering, targeting and decisions need not be frame-cadence invariant. Day-based offscreen checkpoints and explicit skip handling are separate contracts.

**Trigger / consequence:** Sustained low FPS, tab suspension, long frame or rebuild; potential phase/timer/drift differences, **not a confirmed determinism bug without replay evidence**. **Minimum correction:** define intentional real/game time contract and test controlled elapsed-time replays with 15/30/60Hz, tab resume and skip. **Alternative/trade-off:** converting entire simulation to a fixed-step accumulator is invasive, can cause catch-up spirals and may change action ordering. Do not approve in this review. **Verify:** state snapshots, combat/needs progression and frame-time tail across frame cadences.

### S4-7 — Fauna cadence protects behavior but not all CPU

**Affected:** [`createFauna.ts:1425–1516,1532–1571,1578–1643`](../../src/fauna/createFauna.ts), [`AnimalAgent.ts:3667–3769,3971–3990`](../../src/fauna/AnimalAgent.ts), [`animalUpdateCadence.ts:65–78,95–172`](../../src/fauna/animalUpdateCadence.ts). **Confidence:** high execution path, medium impact.

**Evidence / root:** Every materialized animal is sampled and `AnimalAgent.update` called each live frame. Sensing/targeting/decision and vital life tick remain full rate to preserve threat reaction and timing. Movement and presentation have deterministic stable-ID phase-spread cadence; high-priority action, mounted/led/owned, committed traversal and near-player animals are immediate; the movement step is speed capped. This is **not** an absent scheduler or offscreen freezing. The `dayDelta` (difference in fractional game days) normally becomes positive every advancing frame, causing `boundOccupancyCounts` rebuild over agents and spawner updates each frame. A separate recovery loop runs on integer-day rollover, potentially another burst.

**Trigger / consequence:** Many materialized wild animals and live spawners, especially at day boundary; full-rate baseline remains O(active entities) despite visual/motion savings. **Minimum correction:** isolate forest sampling, sensing, targeting and spawner bookkeeping with existing `agentCpuDiag`, then test event/timestamp-driven spawner count caching at fauna owner if significant. **Alternative/trade-off:** directly throttling threat sensing risks unsafe delayed reaction; no such change recommended without behavioral equivalence. **Verify:** spawn/death/corpse/recovery/day rollover, combat/flee, habitat materialize/dematerialize, saved identity and p99 timing.

### S4-8 — Worker cancellation affects logical ownership, not execution (S2-3 repeated)

**Affected:** [`chunkWorkerPool.ts:200–266,283–331,399–451`](../../src/terrain/chunkWorkerPool.ts), [`chunkHeightmap.worker.ts:45–145`](../../src/terrain/chunkHeightmap.worker.ts), [`chunkWorkerPool.test.ts:158–195`](../../src/terrain/chunkWorkerPool.test.ts). **Confidence:** high, previously documented in Session 2 S2-3.

**Evidence / root:** Fixed worker count up to six; priority order hydrology rows → tile → mesh → world knowledge → far tile → map tile → grass. Background headroom is computed from logical `inflight` jobs. `cancelByNamespacedKey` deletes the in-flight record and rejects the promise while an already-running synchronous worker computation continues. On another free worker, a background job may then be admitted as if the canceled background worker were free, eliminating intended foreground spare capacity. The existing tests separately exercise normal headroom and stale canceled result; the combined cancellation/headroom case is missing. Worker replies use transferable arrays for many result buffers, but requests/other structured payloads still clone and result continuations run on main thread.

**Trigger / consequence:** Rapid movement/reversals, priority inversion and delay to newly requested terrain job; bounded physical threads, not limitless background workers. **Minimum correction:** retain physically occupied slot accounting independently from canceled logical promise ownership in *the same pool*. **Alternative/trade-off:** worker terminate/respawn incurs startup/hydrology reinstall costs and may worsen frame stability. **Verify:** deterministic two-worker cancel-background/second-background/foreground sequence, queue latency, disposal, worker failure/recovery and real-device trace. Do **not** duplicate S2-3 as a new independent issue.

## 5. Answers to ten required questions

| Question | Demonstrated vs hypothetical |
| --- | --- |
| 1. Unbounded main-thread work? | Yes, per-loaded-settlement N² crowd, retained-NPC scan under detached livestock, per-entity skip replay, synchronous content and actor publication; actual durations unmeasured. |
| 2. Correlated spikes? | Yes, separate movement-triggered terrain/settlement rechecks and concurrent async completions can coincide with rendering. Magnitude/priority unmeasured. |
| 3. Total population cost? | Retained `npcStates` scan (S4-1) and checkpoint passes scale with known/stored NPCs; daily resident/Fauna AI scales with *materialized* actors only. |
| 4. Offscreen continuity? | Checkpoints and habitat/materialization ownership avoid full-world per-frame AI; full semantic correctness of distant simulation is outside this bounded review. |
| 5. Deterministic cadence? | Fauna cadence phases are ID-derived and high-priority branches full-rate; bit-identical outcomes across FPS, catch-up and frame-rate variance not proven. |
| 6. Worker starvation? | Finite pool, fixed priority and canceled occupancy mismatch confirmed; real queue delays unmeasured. |
| 7. Continuations bypass budgets? | Yes; one finalize-start is not an async completion, grass/actor callbacks and first uploads have separate boundaries. |
| 8. Simulation vs rendering profiling? | Partially separated broad CPU + agent diagnostics; pre-render includes presentation, worker callbacks/GC lack joined attribution; GPU beauty timer excludes mirror. |
| 9. Traversal/settlement stutters? | Highest *plausible* candidates: region/actor publication, synchronous unloading, queued worker completions, first-use compile/upload and NPC crowd; rank by trace, not assertion. |
| 10. Unified scheduler or local fixes? | Prefer targeted existing owner corrections. No evidence yet justifies new global scheduling infrastructure. |

## 6. Profiling gaps and cross-session synthesis

Sessions [036](./2026-11-06--036--rendering-gpu-critical-architecture-session-1.md), [037](./2026-11-06--037--rendering-streaming-critical-architecture-session-2.md) and [038](./2026-11-06--038--rendering-actors-lod-memory-critical-architecture-session-3.md), with [039](./2026-11-06--039--actor-rendering-lod-memory-session-3-evidence-supplement.md), show GPU passes/shadows, terrain/vegetation worker publication and actor construction/animation form independent cost centers. A chunk/settlement entry can mix chunk unload/rebuild, new resident construction, shadow/mirror/main renderer and deferred uploads in or around a few rAFs. A single owner-local budget cannot bound that sum.

Current instrumentation already includes `perf/monitor.ts` p50/p95/p99, long-frame stages; `perf/agentCpuDiag.ts` for crowd/agents/livestock/fauna; `gpuTimer.ts` GPU elapsed when extension available; `perf/benchmarkScenarios.ts` scenarios `settlement-heavy`, `settlement-walk`, `stream`, `stress`; `scripts/perf/run-benchmark-series.mjs` for reproducible samples. No new profiling framework is warranted.

**Still missing for acceptance:** synchronized long tasks, worker occupancy/cancellation latency, main-thread publication by count/bytes, rAF vs between-rAF tasks, GC, skip-end resident×hours, crowd N², first-use shader/buffer uploads; mirror/beauty/shadows GPU scopes; native Windows Intel Arc and representative weaker hardware. Measure cold and warm runs, p95/p99/max and device/world seed/SHA provenance; do not equate draw calls or wall-clock render submission with GPU execution.

## 7. Alternatives, decisions and continuation handoff

**Proposals requiring author approval (no implementation authorized):** prioritize the small, isolated registry scan (S4-1); keep cancellation headroom correction S2-3 within existing worker pool; instrument/check N² crowd and skip-end catch-up before redesign; attribute publication/result bursts within existing terrain/settlement ownership before suggesting unified scheduler. Refuse unmeasured population caps, offscreen suspension, a blanket fixed-step rewrite or moving all simulation to Web Workers. Any cadence/catch-up change must preserve deterministic outcomes, state identity, inventory conservation, combat reactions, and load/unload handoff.

**Review coverage:** bounded CPU, loop, worker, offscreen scheduling and perf-diagnostics slice of system 16.4; cross-cutting evidence for systems 06, 07, 11, 13 **does not** confer their system-level review acceptance. Keep **system 16 `partial`** and all four cross-domain statuses unchanged.

**Recommended final Session 5 (separate authorization):** consolidate independent 036–040 findings without double-counting overlapping S2/S3/S4 mechanisms; establish targeted correctness/replay tests and real-device CPU/worker/GPU verification gates; rank only measured bottlenecks; propose small owner-local corrections and decisions. Do not start implementation or Session 5 from this review.

**Documentation-only change:** this report, `docs/reviews/README.md` index and `docs/reviews/SYSTEM-REVIEW-MATRIX.md` entry. No application code, tests, configuration, plan or roadmap changes.
