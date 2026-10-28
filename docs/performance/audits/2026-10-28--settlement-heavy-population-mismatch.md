# Settlement-heavy: investigation of the 69 / 69 / 53 NPC mismatch

**Date:** 2026-10-28
**Classification:** exact cohort unresolved; leading explanation is timing-dependent settlement materialization/retention during startup teleport.
**Source inspected:** `main` at `36ff212728b3c98cba3affdfbf8821e860b35aef`. Capture reference: `721af157d6b3aee7ad071647716cd4b4403e936b`.
**Scope:** existing captures and static inspection only; documentation-only changes. No new benchmark, trace, runtime instrumentation, fixture or simulation changes.

## 1. Executive finding

The reported **69 / 69 / 53 measures instantiated NPC agents in all completed, loaded settlements**, including settlements outside the selected benchmark village. It is neither the authoritative world NPC count nor a count of NPCs submitted to the camera. The selected village is identical in all three captures and has **15 definition residents**, not 53 or 69.

The mismatch is real in the materialized scene: rep3 has 152 fewer NPC meshes and 387 fewer settlement meshes than reps1/2. This is strong evidence for a different loaded settlement cohort, rather than a cosmetic counter discrepancy or 16 NPCs failing camera visibility. It does **not** establish that 16 authoritative NPC identities were lost or that world generation produced different residents.

A concrete source-level race can retain startup settlements after teleport: `recheck()` skips entries still building, completion does not revalidate distance, and another `recheck()` requires player displacement. The two eagerly requested home neighbors are prime candidates. If they complete before the teleport check, they can be unloaded; if still pending, they can complete afterwards and remain loaded at the stationary benchmark pose. This mechanism is verified in code; its responsibility for these particular 16 agents is **not proven**. Existing artifacts do not contain loaded settlement IDs, per-settlement NPC rosters, authoritative IDs or pending-build history.

`waitForStablePopulation` correctly implements its narrow unchanged-count test. It is **insufficient as a workload-readiness/equivalence gate**. Longer sleeping or hardcoding 69 cannot resolve the underlying ambiguity. A0a/B0 remains **UNVERIFIED**. Reps1/2 are reusable as a qualified diagnostic pair, not as a certified three-repetition baseline.

## 2. Existing evidence matrix

Source files are under `docs/performance/results/win/` with stem `2026-10-27--win-ready-settlement-heavy-repN`:

| Capture | Report | Raw frames | Metadata | Human report |
| --- | --- | --- | --- | --- |
| rep1 | [JSON](../results/win/2026-10-27--win-ready-settlement-heavy-rep1.json) | [raw JSON](../results/win/2026-10-27--win-ready-settlement-heavy-rep1.raw.json) | [meta](../results/win/2026-10-27--win-ready-settlement-heavy-rep1.meta.json) | [MD](../results/win/2026-10-27--win-ready-settlement-heavy-rep1.md) |
| rep2 | [JSON](../results/win/2026-10-27--win-ready-settlement-heavy-rep2.json) | [raw JSON](../results/win/2026-10-27--win-ready-settlement-heavy-rep2.raw.json) | [meta](../results/win/2026-10-27--win-ready-settlement-heavy-rep2.meta.json) | [MD](../results/win/2026-10-27--win-ready-settlement-heavy-rep2.md) |
| rep3 | [JSON](../results/win/2026-10-27--win-ready-settlement-heavy-rep3.json) | [raw JSON](../results/win/2026-10-27--win-ready-settlement-heavy-rep3.raw.json) | [meta](../results/win/2026-10-27--win-ready-settlement-heavy-rep3.meta.json) | [MD](../results/win/2026-10-27--win-ready-settlement-heavy-rep3.md) |

| Evidence | rep1 | rep2 | rep3 |
| --- | ---: | ---: | ---: |
| Loaded NPC agents, gate / start / end / context | 69 / 69 / 69 / 69 | 69 / 69 / 69 / 69 | 53 / 53 / 53 / 53 |
| Gate waited / unchanged (ms), all `stable` | 6052 / 5014 | 6310 / 5258 | 5977 / 5006 |
| Selected settlement | `-2_-4` | same | same |
| Definition families / residents | 8 / 15 | 8 / 15 | 8 / 15 |
| Loaded terrain chunks / wild-fauna agents | 76 / 30 | 76 / 30 | 76 / 30 |
| Scene NPC meshes / triangles | 672 / 808321 | 672 / 808321 | 520 / 621283 |
| Scene settlement meshes / triangles | 1902 / 1614829 | 1902 / 1614829 | 1515 / 1376781 |
| FPS average | 23.7 | 26.4 | 28.3 |
| Frame p50 / p95 / p99 (ms) | 42.6 / 75 / 87.7 | 38.9 / 42 / 51.6 | 35.5 / 42.2 / 80.5 |
| Long frames (>80 ms) | 21 | 1 | 11 |
| Average all-render draw calls | 2441 | 2403 | 2368 |
| Observed main / shadow / mirror calls per pass frame | 1665 / 424 / 353 | 1630 / 420 / 353 | 1593 / 423 / 353 |
| NPC-family main calls, unrounded sum/frame | 428.18 | 428.87 | 353.88 |
| NPC-family shadow calls, unrounded sum/frame | 25.19 | 26.84 | 27.57 |
| NPC-family mirror calls | 0 | 0 | 0 |
| GPU elapsed average / p95 (ms) | 23.04 / 29.00 | 21.86 / 27.85 | 20.29 / 23.67 |
| GPU resolved samples | 606 | 720 | 772 |
| Full raw / monitor frames | 602 | 715 | 768 |
| Pass collector frames / shadow refresh frames | 607 / 607 | 721 / 721 | 773 / 773 |
| Geometries / textures at report context | 973 / 1090 | 974 / 1049 | 962 / 1042 |

Common configuration: `tools-001-v1`, seed 42, terrain resolution 193, terrain load radius 3, High, warm, requested 30 s, viewport and drawing buffer 1600×900, DPR approximately 1. Day 0, 07:00, spring/rain. Device strings match: native Windows Chrome 156, Intel Arc 140V ANGLE D3D11. Metadata identifies fresh profile and 30 s cooldown per launch, driver 32.0.101.8860, `hardwareClass: diagnostic`; power/thermal was not captured (manual device fields are null).

Selected settlement: **Podgórze Górska**, mountain XL, anchor `(x,z)=(-572.2128201173618,-1158.086991767399)` in all three. Recorded camera position is identically `(-572.2128201173618,17.327987037854086,-1146.8145192132304)`, quaternion `(-0.17410813759359453,0,0,0.9847265389049336)`; `cameraControl=null` throughout. **Player coordinates are not exported separately.** Source teleports to the anchor (`benchmark.ts:252–278`); matching camera/anchor supports the same intended pose, but is not a saved player-position history. Camera is captured when constructing the report, after isolation probes, not continuously during the window (`benchmark.ts:391–416`).

JSON reference locations: rep1 `frameTime:13`, scene `:51`, agent detail `:407`, passes `:659`, context `:1652`; rep2 corresponding lines `13/51/407/659/1592`; rep3 `13/51/407/659/1650`. All `.meta.json` files are 13 lines. Each `.raw.json:1` exactly equals the report's embedded `raw`; all are `sampling.mode=full`, factor 1, exported/original counts equal. Raw rows contain only `i/frameMs/simulateMs/renderMs/drawCalls/triangles`, **no NPC count, ID, settlement ID, position or pending-operation time series**. Thus start/end agreement does not prove no intermediate count changes.

Pass values above use attributed `callsAvg`, not the inclusive `main.infoCallsAvg` (2089/2050/2015, including shadow). They are not directly additive with monitor draw averages: `benchmark.ts:344–355` ends the monitor session, waits 200 ms for GPU polling, then ends the collector. The collectors have different frame counts; mirror scheduling also differs from a per-frame total. All pass reports say `observed`, shadow-skipped frames 0. GPU span is `postprocess+labels`; all have disjoint/skipped 0 and unresolved 1, not a measurement of simulation CPU work.

### NPC model-family evidence

These are **appearance families**, not households or origin settlements (`NpcAgent.create`, `src/ai/NpcAgent.ts:1999–2002`; `censusAgentDetail`, `src/perf/sceneCensus.ts:425–490`).

| Model family | Agents rep1 / rep2 / rep3 | Main calls/frame rep1 / rep2 / rep3 |
| --- | --- | --- |
| Peasant | 33 / 33 / 24 | 205 / 206 / 164 |
| Peasant_Boots | 9 / 9 / 6 | 57 / 57 / 42 |
| Wizard | 9 / 9 / 8 | 65 / 65 / 60 |
| blacksmith | 6 / 6 / 5 | 40 / 40 / 36 |
| Knight_Cloth | 4 / 4 / 2 | 19 / 19 / 10 |
| Herbalist | 4 / 4 / 4 | 25 / 25 / 25 |
| woodcutter | 4 / 4 / 4 | 17 / 17 / 17 |

The difference is distributed **9+3+1+1+2=16** across five appearance families. This is compatible with a whole settlement's mixed residents; it is not evidence for a named 16-person visitor party. NPC near/mid/far scene counts are `0/2/67`, `0/3/66`, `0/3/50`; root-point camera-relevant counts total 21/19/21. This does not locate the extra agents: snapshots occur after the window, moving actors change bands, and the camera estimate is not mesh visibility or actual submissions. Main NPC submissions are materially higher in both 69-agent runs, even though shadow and mirror contributions are almost unchanged.

## 3. Counter semantics and lifecycle

### Definition identity → authoritative state → runtime agent → report

1. **World/fixture:** `src/main.ts:46–53` calls `createApp` without a save for `?benchmark=`. `src/app/createApp.ts:489–498` uses `createBenchmarkWorldConfig`; `src/config/worldConfig.ts:623–634` starts from base config and applies High. `src/perf/benchmarkFixture.ts:25–32` fixes seed/time/resolution/radius. Day progression is disabled (`createApp.ts:567–570`); NPC actions and asynchronous loading still execute. This is a fresh fixture world, not a reset to the selected settlement immediately before each sample. `benchmark.ts:220–225,544–551` saves/restores position/time/quality; repeated calls in one app do not reconstruct authoritative state. These artifacts instead describe independent launches.
2. **Resident definitions:** `generateSettlementDef` and its shared core (`src/settlement/settlementGenerator.ts:571–625,790`), `cellSeed` (`:171`) and `generateFamilies` generate deterministic families plus authored residents/staffing. `settlementNpcId` / `settlementNpcDescriptors` (`src/settlement/npcIdentity.ts:13–48`) derive stable `${settlementId}:npc:${memberIndex}` identities. Looking up a definition does not instantiate its agents. `selectHeavySettlement` (`src/perf/heavySettlementScenario.ts:35–121`) ranks mountain definitions by size, residents, distance and ID, independent of loaded meshes; it does not select whichever village happens to have loaded first.
3. **Authoritative state:** manager-owned `npcStates` (`src/settlement/SettlementsManager.ts:679–682`) uses `createNpcStateRegistry` (`src/settlement/npcState.ts:370–425`): `getOrCreate` inserts into an ID-keyed map, reusing state on reconstruction; serialization/iteration retain states after settlement unloading. The registry is lazy, so even its size would mean **known instantiated authoritative states**, not every potential procedural resident in the whole world. Fresh state has `merchantJourney=null` (`npcState.ts:316–340`).
4. **Materialization:** `createSettlement` first awaits props/livestock/rats/signposts (`src/settlement/createSettlement.ts:687,985,1038,1062`), flattens definition members (`:1114–1131`), calls registry `getOrCreate` before awaiting model construction (`:1319–1355`), and awaits the resident `Promise.all` (`:1381–1477`). `NpcAgent.create` awaits character/animation assets and falls back to a capsule on model failure (`src/ai/NpcAgent.ts:1956–2005`), rather than simply dropping 16 failed models. Meshes can be added before the whole settlement is published (`createSettlement.ts:1376`). The manager counter only sees a completed settlement; temporary scene/counter disagreement is possible during construction.
5. **Residents and visitors:** residents may be suppressed for expired corpse presentation, merchant journey or residency ownership (`createSettlement.ts:1340–1353`). `resolveTravellingVisitors` (`SettlementsManager.ts:914–953`) finds authoritative visiting merchants and resolves original identity; `createSettlement.ts:1482–1512` appends their runtime agents. `resolveNpcPresentationOwner` (`src/settlement/npcPresentationOwner.ts:61–80`) assigns visiting merchants to destination, outbound/returning to no presentation, otherwise explicit residency or original settlement. These are presentation ownership rules; they do not delete authoritative identities. There is no separate fixed-size random visitor population added by this construction path.
6. **Registration/activation:** the counted registration is effectively publication of `Entry.settlement` (`SettlementsManager.ts:1082–1084,1183`). `getLoaded()` returns every entry with that field (`:1549–1555`); `Settlement.npcs` is the constructed `agents` array (`createSettlement.ts:1555`). The resident array is not an active/visible-agent registry: its ordinary update loops over the array (`:1642–1657`), without removing sleeping, dead, hidden, distant or travelling entries from this metric. Merchant categories count if their agent is in that array; offscreen-only identities do not. The counter does not deduplicate IDs across arrays, though state itself is keyed by ID and materialization uses shared ownership policy. No evidence establishes duplicate registration here.
7. **Unload/deregistration:** `unload()` hands off offscreen travel/transport, disposes presentation, removes the entry (`SettlementsManager.ts:1291–1303`). `createSettlement.ts:1739–1754` disposes agents/meshes; `NpcAgent.dispose` (`:3967–3973`) does not remove registry state. Thus an NPC can disappear from this counter while its authoritative state survives. Camera frustum alone cannot change it; player-distance settlement streaming can. Chunk readiness indirectly controls when an entry becomes countable.
8. **Benchmark consumption:** `src/app/createApp.ts:3881–3900` provides `npcCount = getLoaded().reduce((n,s) => n+s.npcs.length,0)`. `src/perf/monitor.ts:485` reads this provider live. `benchmark.ts:315–321` samples `populationStart` after the gate. `populationEnd` and top-level context come **after isolation probes** (`:364–375`), not precisely at measured-window end. `agentCpu.population.npcLoaded` merely copies context (`src/perf/agentCpuDiag.ts:875–878`), not an independent NPC census. `settlementFamilyCount/residentCount` at both endpoints copy the selected **definition**; they do not verify those residents materialized. `agentDetail` is a separate scene snapshot, filtering effective visibility/renderable meshes (`sceneCensus.ts:449–457`).

For clarity, use **definition residents**, **known authoritative NPC states**, **loaded NPC agents**, and **render submissions** as four distinct quantities. None is a substitute for the others. `faunaCount` is independently `bundle.fauna.getAgents().length`, not all settlement-owned livestock; its constant 30 does not establish equal settlement livestock workloads.

## 4. Startup/streaming race and gate assessment

`src/app/worldBundle.ts:279–282,680–689` supplies settlement load/unload radii **300/420 world units**, separate from fixture terrain load radius **3 chunks**. `SettlementsManager.ts:1072–1098` starts home construction without awaiting it; home is never distance-unloaded. `:1214–1216` eagerly starts two home neighbors. `createApp.ts:868` only catches `backgroundReady` failure; it does not await it before readiness/auto-benchmark (`:3873–3879,3909`). The background task awaits home (`worldBundle.ts:2192–2252`), not completion of all eager/target neighbor entries.

The source-level race is:

- Benchmark selects a distant definition and teleports (`benchmark.ts:241–278`).
- Movement causes `recheck()`; it requests all definitions within 300 units and removes completed non-home settlements beyond 420 units (`SettlementsManager.ts:1306–1321`). **Pending entries are skipped.**
- `ensureLoaded()` awaits chunks then `createSettlement`; completion checks only whether an entry still exists, publishes it and clears `pendingPromise` (`:1174–1207`). Despite its nearby comment about leaving range, it does **not** compare the current player position against distance. `recheck()` also does not delete a pending entry.
- Another `recheck()` needs at least `loadRadius*0.25 = 75` units of displacement (`:1156–1160,1446–1449`). The stationary settlement-heavy scenario provides none deliberately. A startup neighbor completing after the teleport check can therefore remain loaded for the whole capture, not merely load a few seconds late.

This proves a timing-dependent **retention mechanism**, not that either 53 or 69 is the intended fixture workload. It also explains why a longer unchanged-count period would be ineffective if an extra completed settlement stays registered indefinitely. Other in-flight settlements from startup could participate; the eager two are candidates, not an identified cohort.

`waitForStablePopulation` (`src/perf/benchmark.ts:72–74,121–148`) polls every 250 ms, resets its timestamp on numeric changes, releases after 5000 ms unchanged, times out at 90000 ms. It does not examine selected settlement presence, required IDs, build promises, visitor state, home/background readiness, distance eligibility or authoritative state. A paused build, unstarted cohort, count-preserving identity exchange, wrong selected village, or incomplete stable agent set can pass. Sampling can also miss changes between polls. Timeout still permits a flagged capture (`:293–296`).

Terrain preload (`benchmark.ts:205–211`) awaits only the terrain ring; `src/terrain/chunkManager.ts:2828–2841` waits for requested chunks, not settlement promises or NPC assets. Available signals `settlementDefinitionCacheReady`, `homeReady`, `backgroundReady` cover different subsets, **none alone proves scenario-wide equivalence**. Internal per-entry `pendingPromise` is relevant readiness evidence but is not exposed as a fixture-wide readiness contract. Even awaiting all builds without reconciling retained out-of-range entries would leave the timing-dependent set intact.

## 5. Confirmed facts versus hypotheses

| Explanation | Assessment / distinguishing evidence |
| --- | --- |
| Different selected settlement, seed, camera, quality or resolution | Contradicted by recorded fields; exact same selected definition and camera. Separate player position history is absent. |
| Different loaded settlement set caused by startup completion order | **Leading hypothesis.** Real code path above plus mixed-family NPC and settlement-mesh differences. Need IDs and completion/unload ordering to identify the cohort. |
| One or more settlements still incomplete in rep3 | Possible; aggregate gate cannot exclude it. No pending promises/errors recorded. Capture persistence alone cannot distinguish incomplete target-neighbor builds from extra retained startup entries in reps1/2. |
| Genuine resident-generation difference elsewhere | Not demonstrated. Same selected definition, deterministic identity/generation and unchanged source weigh against it; other definitions were not exported, so cannot fully exclude. |
| Delayed visitor/merchant arrivals or presentation-owner suppression | Supported as general lifecycle mechanisms, not as this 16-agent explanation. Day/time is fixed, fresh state has no journey, and accompanying settlement geometry difference favors a settlement cohort. Journey/ID history is missing. |
| Duplicate registration/cleanup defect | No positive evidence. Map entries are settlement-keyed, `ensureLoaded` rejects existing entries, shared presentation ownership suppresses duplicate home/destination materialization. Aggregate data cannot prove unique live IDs. The pending-entry retention issue does not require duplicate IDs. |
| Save/localStorage fixture contamination | Normal benchmark entry explicitly bypasses save and localStorage config; metadata says independent fresh profiles. No positive evidence. Persistent disposable worldgen cache remains a timing/input consideration, not a proven cause. |
| Camera culling alone / misleading counter only | Cannot explain count formula plus fewer settlement meshes and family agents. Count is misleading if interpreted as authoritative or selected-village NPCs, but scene difference is independently present. |

Cache boundary: `src/settlement/settlementPlanCache.ts:117–148,203–220,387–399` clears runtime caches, hydrates without replacing computed keys, and resolves/records definitions; `worldBundle.ts:1361–1380` awaits best-effort hydration before home resolution. `settlementWorldgenCache.ts:615–624` validates records and treats hydrate failure as a miss. Rebuild clears via `worldBundle.ts:2754` → `src/settlement/roadNetwork.ts:178–180` → `clearSettlementDefCache`. Existing metadata does not include cache-hit/definition digests or build chronology; an alleged cache/worldgen defect cannot be established here. Do not invalidate caches or alter generation based on this hypothesis.

`git diff --name-only 721af157 HEAD` and `git log 721af157..HEAD` show five subsequent commits: documentation/artifacts plus `scripts/trace_analyzer/trace_parser.py`. **No `src/` file changed.** All runtime paths above therefore match the benchmark SHA. The previously resolved warm-up, camera-control, first-shadow-map and GPU-timer issues are not reopened by these findings.

## 6. Benchmark impact and reuse

Rep3 is not an equivalent scene for A0a/B0 comparison with reps1/2: both actor materialization and settlement geometry differ. The lower GPU elapsed and main NPC submissions are consistent with lower workload but do not quantify its FPS cost. Shadow NPC submissions actually rise slightly; mirror has no NPC-family calls; both passes otherwise remain close. Counting 16 agents alone cannot explain GPU/CPU balance or tail latency.

Reps1/2 match the recorded configuration, complete NPC model-family census/mesh/triangle totals, settlement geometry and resident grass counts (482171 full / 1025429 filler). Main NPC submissions differ by less than one call/frame unrounded. This makes them a useful **matched diagnostic pair at the recorded aggregate/census level** for actor and settlement attribution. They do not prove identical authoritative/live IDs or actor transforms. Their main `environment` submissions differ **132 versus 95** (rep3:132); main NPC totals are almost equal, so the 35-call main-pass difference between the two 69-agent captures is primarily outside the NPC family buckets. Dynamic fauna submissions differ too. Environment provenance is not exported at finer granularity here; do not claim identical whole-frame work.

The 69-agent pair itself has FPS 23.7 versus 26.4, p95 75 versus 42 ms and long frames 21 versus 1. Thus substantial variation exists at equal loaded NPC counts. No causal attribution of spikes, thermal changes or FPS gains follows from these files. Keep both as diagnostic evidence; do not average them with rep3, claim an optimization gain, or promote the pair to certified A0a/B0. Two reps also do not meet the runbook's minimum three. Existing C0 forest/warm-stream and water verdicts remain unchanged.

## 7. Smallest safe next step

**Do not implement a correction yet.** The single most informative diagnostic action is a **startup settlement-roster/lifecycle comparison at the teleport checkpoint and gate release**, seeking one 69-agent and one 53-agent startup if available. It needs no timed performance window or Chrome trace. Record, in one coherent diagnostic snapshot/log:

- player position and last recheck position; each manager entry's settlement ID/coordinates, distance, home/eager origin, pending/completed status, build completion/unload order;
- sorted live NPC IDs per completed settlement, definition resident IDs/count, visitors and presentation-owner exclusions; known authoritative IDs including offscreen states;
- whether required target-neighbor materialization remains pending or failed.

This one comparison identifies whether the 16-ID difference belongs to startup neighbors, incomplete local settlements, visitors, duplicates or different definitions. A loaded-only inspector can establish the cohort, but private pending/recheck state is needed to establish chronology. No such snapshot exists in these artifacts; obtaining it is future diagnostic work, not performed or authorized as code changes by this report.

The smallest corrective **acceptance condition**, once that result identifies the intended fixture set, is to reuse existing definition IDs and relevant build promises to require the same completed settlement/agent roster at the anchor, with no relevant pending operation, and validate that roster again at actual measured-window end. Definition-derived expected residents must account for visitors, travel and corpse/residency ownership; a raw universal count or selected village's 15 residents alone cannot establish whole-scene equivalence. Also compare selected definition, pose/configuration and scene/family census. Retained extra cohorts must be detected, not just missing target residents. Reuse `homeReady`/entry completion where applicable; `backgroundReady` alone is insufficient. Keep the numeric stability test as a secondary diagnostic, without arbitrary extra delay, freezing simulation or changing spawns.

No Cursor implementation handoff or implementation plan is warranted until the cohort is identified. In particular, a production streaming fix versus benchmark-only readiness/validation is a decision requiring that evidence; do not alter simulation just to choose 69 over 53.

## 8. Later verification with minimum measurement

First verify the roster diagnosis using startup inspection only. After a separately authorized correction, verify readiness rejects the divergent/pending/extra roster and accepts the agreed fixture roster; inspect start and actual window-end IDs, selected village, player/camera/configuration and family/scene census. Exercise differing completion order without collecting a new full performance suite merely to test a gate.

A new benchmark is **not necessary for this investigation or to identify the cohort**. Existing captures cannot retrospectively recover missing IDs or pending-operation history. For future A0a/B0 certification, a matched set meeting the existing runbook (at least three warmed captures plus variance assessment) will still be needed if equivalence cannot be established for reused captures. The present pair remains diagnostic, and this report neither schedules captures nor authorizes runtime changes. Reuse all unaffected C0/control evidence; no other scenario needs repetition for this finding.

## Related evidence

- [Native Windows baseline summary](../results/2026-10-27--win-arc-native-harness-fixes-and-baseline.md), especially READY recapture section.
- [Arc baseline runbook](../2026-10-27--arc-baseline-runbook.md), capture equivalence and READY/STOP requirements.
- [Three-track roadmap](../../research/v1-revival/2026-10-27--performance-three-track-roadmap.md), benchmark reuse policy.
