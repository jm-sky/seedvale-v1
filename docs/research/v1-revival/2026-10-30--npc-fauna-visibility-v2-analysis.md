# NPC and fauna visibility — V2 donor assessment

**Date:** 2026-10-30  
**Status:** completed static research; experiment proposed, not implemented or measured.  
**Source pins:** V1 `d2b14bf7cbf380131bfa43bc2bd685af918f30e5`; V2 `9ba54815493b886eb1bdce032f5209aeb2856c37`; supplementary V3 `47733d6ba0fe96d4607be22c470c7331c76c2c5c`.  
**Scope:** code and existing measurement review only. No runtime changes, tests or benchmarks executed. V1 remains authoritative.

## Recommendation

**Worth a small, rendering-only occlusion experiment; not a wholesale MAP-02 port.** V1 can submit actors hidden behind opaque geometry because it has no actor occlusion gate in the inspected presentation path. Existing captures show substantial actor submission cost, but **do not establish how many submitted actors are actually fully occluded**. A significant invisible cohort, and an appreciable FPS improvement from removing it, remain hypotheses.

Separate three questions: outside-camera culling (already improved in V1), camera occlusion (candidate optimization), and player sensory knowledge/last-known ghosts (a gameplay feature). V2 implements all three concerns in different ways; transferring its sensory rules would change V1 gameplay and visible range.

## 1. What V2 actually does

The MAP-02 plan still says `planned`, but [perception.ts](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/perception.ts) and [Actors.update / updateGhosts](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/actors.ts) implement the feature.

| Mechanism | Code-observed behavior |
| --- | --- |
| Detection | Player-centered spatial actor query, compatible cave layer, range, then LOS. No facing cone in `detects`. |
| Range | Base 75 m at Perception 5 in clear daylight; modified by Perception, night, fog, precipitation, fatigue and target size; torch/fire exceptions. Not the renderer's draw distance. |
| Surface blockers | `wallBlocksSight` queries buildings around the segment, skips `NO_COLLIDE` kinds and footprints with minimum half-extent <1.2 m, then tests an inset rotated XZ rectangle. A building containing the viewer is skipped. |
| Trees and terrain | **No outdoor tree, foliage, rock-mesh or terrain-height LOS test in this path.** This is not general 3D occlusion. Building footprints cannot correctly represent height, windows or door openings. |
| Caves | Separate layers plus `caveSightOpen`, sampling open cave-grid cells along XZ every 0.75 m. This is cave-wall handling, not outdoor terrain occlusion. |
| Exceptions | Within 4 m, LOS is bypassed after the layer check. Self, companions and owned animals bypass `detects` checks; however the contact updater still queries a bounded radius (93.75 m), so “always known” does not imply unlimited 3D presentation. |
| Cadence/cache | `worldSystems` registers perception every 0.25 gameplay seconds. Transient `WeakMap<Sim, Map<id, Contact>>`, no save schema. |
| Last known | Store last detected x/y/z/rotation/time. Loss makes a stale contact; expiry after 45 gameplay seconds deletes it. Reacquisition restores current location. |
| Ghost | A cheap merged procedural human/animal placeholder, **not a translucent copy of the detailed model**; opacity 0.5, depthWrite false, no shadow or mixer. Frozen at stored pose, removed on reacquisition/expiry. |
| Indoor NPC | Sleep/shelter work excludes NPC from current detection and normal drawing. Previously cached contacts can still age into last-known: the loop does not immediately delete them merely because `indoors` became true. |
| Renderer | Only current contacts get normal visuals. Query radius 320 m; near models vs distant placeholders with hysteresis; High model thresholds human 70 m / animal 110 m. Root sphere (radius 3) frustum gate hides off-camera visuals and skips their mixer. High shadow radius 40 m. |

Sources: [PERCEPTION](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/config/calibration.ts), [wallBlocksSight / segmentHitsBox](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/detour.ts), [caveSightOpen](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/caveSpace.ts), [scheduler registration](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/worldSystems.ts), [quality thresholds](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/quality.ts). Existing [tests](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/perception.test.ts) describe range, weather, lifecycle, caves and ownership behavior; read, not run.

V2 removes/recreates normal visuals when current contact is lost/regained. Copying this would add allocation/materialization churn. Its camera-root hiding also removes off-camera shadow casters. Neither behavior should be copied into V1 as an optimization shortcut. Ghosts add transparent submissions and can remain visible where the live actor was; they are a separate product decision.

## 2. V1 already has useful foundations

- **NPC native frustum culling is implemented now.** [NpcAgent constructor](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/ai/NpcAgent.ts) calls [installActorCullBounds](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/render/actorCullBounds.ts) after assembly and before animation. Conservative actor-wide bounds are transformed to each skinned mesh, with fail-open handling. Main and shadow frusta remain independent. The October 27 finding that rebound heads/hair always draw is historical, not the current baseline.
- Fauna retains native mesh culling; the NPC envelope installer is not called in the inspected `AnimalAgent` path. [Fauna cadence](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/fauna/animalUpdateCadence.ts) already throttles ordinary presentation/mixers to roughly 20/10 Hz by distance, with full-rate importance exceptions. This is not occlusion and must not be replaced by camera-driven simulation.
- [Presentation LOD](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/render/agentPresentationLod.ts) uses 18/36 m tiers. [Its adapter](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/render/agentPresentationVisibility.ts) toggles registered optional nodes only; NPC registration still names `ubcHairAttachment` / `ubcBeardAttachment`. It does not hide the whole actor at range or provide a general kit LOD.
- NPC living updates still call `anim.update(dt)` irrespective of camera visibility. Native draw culling does not itself stop animation or scene matrix traversal.
- Both actor families have 36 m distance shadow gates through [label controller](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/ui/agentStatusLabel.ts); actor-layer exclusion already keeps them out of the water mirror. Observation levels and label fading are information/UI policies, not mesh LOS or a contact memory.
- **Missing in the inspected actor path:** camera occlusion by buildings/trees/terrain, V2-style sensory contact cache and last-known ghosts. Streaming limits materialized populations, but is not a substitute for occlusion.
- **Critical integration hazard:** `NpcAgent.hasLootableCorpse()` and `resolveCorpseLifecycle()` read root `mesh.visible`; corpse concealment owns that property. Do not put persistent camera visibility into this root or use it to skip agent updates. Fauna has its own corpse visual ownership too.

Reuse the existing [world-terrain-050](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/docs/plans/world-terrain-050-agent-performance-render-census-and-lod.md) owner, current culling/LOD and diagnostics. No new manager, registry, simulation cadence or streaming/despawn policy is required for the proposed experiment.

Supplementary V3 check: [PlayerBodyView.enableCulling](https://github.com/jm-sky/seedvale-v3/blob/47733d6ba0fe96d4607be22c470c7331c76c2c5c/src/game/render/actors/playerBodyView.ts) inflates native skinned bounds (radius ×1.5 +0.5 m). This supports the bounds approach already adapted in V1, not a missing general LOS solution. No broader V3 migration is justified by this bounded check.

## 3. What existing measurements establish

The recent [native Windows Q14 A/B](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/docs/performance/results/2026-10-29--win-q14-frame-matrix-once-ab.md) is the relevant ~31 FPS reference: B runs 29.9/32.3/31.9 FPS, mean 31.4; mean frame p50 31.1 ms and RENDER p50 23.8 ms. SHA `8a2bea88`, fixture `tools-001-v1`, 53 loaded NPC. These are historical measurements, not a new baseline at this research pin.

**Publication freshness:** while this report was being prepared, docs-only commit `12c46d6b` added the [October 30 native Q5/CA2 A/B](../../performance/results/2026-10-30--win-q5-ca2-ab.md), measured on the same runtime pin `d2b14bf7`. Its settlement-heavy runs report 35.3–37.9 FPS (n=2 per arm); it does not measure actor occlusion. Therefore ~31 FPS is the requested historical reference, not a claim about today's universal performance. Preserve that new evidence without attributing cross-session differences to actor visibility.

Representative [B run 3 JSON](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/docs/performance/results/win/2026-10-29--win-q14-B-run3-settlement-heavy-rep1.json):

| Quantity | NPC | Fauna |
| --- | ---: | ---: |
| Census agents with effectively visible renderable meshes | 53 | 91 |
| Agent root points inside camera frustum | 21 | 22 |
| Census mesh/draw estimate | 501 | 399 |
| Actual main submissions/frame | 201 | ~108 |
| Actual shadow submissions/frame | ~26 | ~14 |
| Mirror submissions | 0 | 0 |

Thus many loaded actors are outside the camera, **but V1 already rejects much of their drawing**. The remaining ~309 actor calls are ~21% of 1,446 main submissions. Neither root-point membership nor census “visible” means visible pixels; neither detects occlusion. Far-band counts (51 NPC, 88 fauna beyond 36 m) do not prove those actors are invisible.

Short post-window isolation probes in Q14 B runs [2](../../performance/results/win/2026-10-29--win-q14-B-run2-settlement-heavy-rep1.json), [3](../../performance/results/win/2026-10-29--win-q14-B-run3-settlement-heavy-rep1.json), [6](../../performance/results/win/2026-10-29--win-q14-B-run6-settlement-heavy-rep1.json) give:

| Run | Full RENDER mean | Hide all NPC/fauna | Difference |
| --- | ---: | ---: | ---: |
| 2 | 21.09 ms | 11.64 ms | −9.44 ms |
| 3 | 19.92 ms | 11.38 ms | −8.54 ms |
| 6 | 20.03 ms | 11.69 ms | −8.34 ms |

These motivate investigation of actor cost, **not an 8–9 ms occlusion saving**. They hide visible actors too, affect shadows/labels, use sequential 30-frame samples, and do not measure the occluded subset. [Isolation code](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/perf/isolationProbe.ts) continues simulation; [hideBuckets](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/perf/sceneCensus.ts) writes visibility, not mixer scheduling. RENDER is wall-clock including possible driver waits, not isolated CPU work or whole-frame FPS. Diagnostic instrumentation overhead and probe order also limit attribution.

The [older Windows trace](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/docs/performance/results/2026-10-28--win-a1p-trace-analysis.md) supports CPU submission/matrix work as a candidate bottleneck; Q14 subsequently reduced repeated matrix traversals. Do not reuse its absolute cost as current. The [WSL matrix census](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/docs/performance/results/2026-10-29--wsl-q14-b1b-matrix-census.md) counts many actor nodes, but “drawn” roots there do not prove actual submissions or occlusion. Keep WSL and native timing separate. Earlier 69-versus-53 NPC captures are non-equivalent workloads; see the [population audit](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/docs/performance/audits/2026-10-28--settlement-heavy-population-mismatch.md).

At 31 FPS, a genuine net 2 ms frame saving would mean approximately 33 FPS, 4 ms approximately 35.4 FPS. These are arithmetic illustrations, not forecasts; reaching 45–60 FPS requires much more than an unmeasured occluded subset.

## 4. Smallest useful experiment (future, not executed)

**First measure the available saving without building a general detector.**

1. Reuse the existing settlement-heavy fixture, camera, census, actual per-pass collector and isolation harness. In a fixed camera view, identify a small set of living actors **fully behind solid building walls** that currently submit meshes. Record stable IDs, family, distance and submitted calls. Include livestock; do not confuse `faunaCount=30` (wild agents) with all 91 census animals. Inspect multiple body points/extents; a hidden origin does not prove a hidden head, weapon or body.
2. A = normal; B = suppress only that verified set's presentation during the beauty pass, restoring state in `finally` before the next simulation tick. Preserve shadow submissions, root lifecycle state, targeting, AI, movement, needs, persistence and mixers. Use a tightly bounded view and revalidate the cohort; moving actors that emerge must immediately be excluded. No ghost, model unloading or animation optimization in this first attribution experiment.
3. Record removed actual calls, frame and RENDER p50/p95, NPC/fauna counts/IDs, and shadow invariance. Use warmed alternating matched windows/runs and the existing runbook's repeat policy; also include an open-view control. If this zero-detector-cost experiment is within noise, stop: adding LOS cannot rescue it. This is an optimistic local ceiling, not a deployable system.
4. Only if worthwhile, test a bounded detector against the same mask: camera-based candidates after native bounds/frustum filtering; cached/staggered building checks around 4 Hz as an initial candidate, invalidated by camera/actor/door movement. Fail open on uncertain or stale results. Measure candidate count, tests, confirmed fully occluded actors, detector p50/p95/max and **net whole-frame gain**. Reject popping or lost shadows. The cadence is tunable, not a guaranteed acceptable latency.

V2 offers the pattern of spatial prefiltering, cheap early-outs and cached results. Its footprint test is **not** a conservative V1 visibility test: V1 has walk-in houses, door geometry and vertical differences. [Existing collider registry](https://github.com/jm-sky/seedvale-v1/blob/d2b14bf7cbf380131bfa43bc2bd685af918f30e5/src/world/collision.ts) can inform broad-phase reuse, but its query covers a local 3×3 bucket neighborhood, not arbitrary sight segments, and many movement colliders lack vertical extents/opacity semantics. Do not treat every collider as an opaque infinite wall, or full-scan/raycast the whole scene per actor per frame. Full tree/terrain occlusion is outside this smallest experiment.

Cost scales with candidates × blocker candidates × sample points × update rate, plus invalidation/cache maintenance. A center ray is cheap but unsafe for whole-model culling; conservative coverage costs more. On the measured CPU-sensitive Windows path, detector cost can erase draw savings. Hiding alone also leaves mixers and matrix traversal running; saving those would be a later, separately verified presentation change.

**Decision:** investigate the measurable occluded cohort first. Adapt bounded visibility evaluation if its net gain survives noise and visual checks; leave sensory range, last-known memory and ghosts for an explicit gameplay decision. Autonomous world simulation remains unchanged.

## Opus assessment (2026-10-30)

Accepted as research input for Track A; no runtime change follows from it directly.

- **Agree:** no MAP-02 port; V2 sensory range, last-known contacts and ghosts are a gameplay decision outside P1. Camera occlusion is a rendering-only candidate. The corpse/`mesh.visible` ownership hazard (§2) is a hard constraint for any experiment.
- **Strongest signal is cost per actor, not occlusion.** Hiding all actors removes −8.3…−9.4 ms RENDER while actors are ~21 % of main submissions, so an actor submission is several times more expensive than an average one (skinned bone-texture upload / `Skeleton.update`, `bindMatrixInverse`, material/program switches). Q6 (A0 per-submission attribution) measures exactly this and is the prerequisite: it tells whether a hidden actor saves only its main-pass draws or also skeleton work.
- **Ceiling caveat for §4:** an occluded actor inside the 36 m shadow gate still casts shadows, so its skeleton is still updated and uploaded for the shadow pass; only its main-pass draws go away. Occluded actors beyond 36 m would also skip skeleton work. The cohort census in §4.1 should therefore record the near/far split.
- **Sequencing:** Q6 A0 counters → queue Q16, the §4.1–3 zero-detector cohort ceiling (fixture view, cohort census and a beauty-pass mask behind a debug flag can be prepared without benchmarks; the A/B needs the author's Windows session) → a detector (§4.4) only if the ceiling clears ~2 ms RENDER on Windows.
