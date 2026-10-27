# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:06:39.214Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: water
Duration: 30s
Frames: 1664
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T21-05-45-653Z-wpcgwi
  phase: warm
  fixture: tools-001-v1
  seed: 42
  elapsedDays: 0
  timeOfDay: 0.292
  season: spring
  weather: rain
  terrainResolution: 193
  loadRadius: 3
  grassMacroVariation: ON
  viewport: 1600x900
  drawingBuffer: 1600x900
  camera: pos=(-8.1, 0.9, 101.4)
  anchor: (-8.1, 100.5)
  populationGate: stable waited=5016ms npc=20
  gpuTimer: available=true resolved=true samples=1675 span=postprocess+labels

FPS:
  avg: 75.8
  min: 12
  p1: 23

Frame time (wall-clock):
  avg: 13.2 ms
  p50: 12.7 ms
  p95: 16.8 ms
  p99: 44 ms
  max: 83.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.9 p95=7.4 p99=36.6 max=74.2 n=1664
  render: p50=7.4 p95=9.7 p99=12.3 max=21.4 n=1664
  frame: p50=12.7 p95=16.8 p99=44 max=83.5 n=1664

Rendering (combined renderer.info):
  draw calls: 323 avg / 549 max
  triangles: 5.01M avg
  mirror draws: 67 avg
  geometries: 561
  textures: 575

Pass submissions (actual):
  reliability: observed
  frames: 1676 shadowRefresh=152 shadowSkipped=1524
  mirror calls avg: 67
  shadow calls avg: 189
  main calls avg: 218

Scene (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  grass            draws=56 tris=2.37M meshes=56 inst=213695
  vegetation       draws=97 tris=248.5k meshes=97 inst=172
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=722 tris=693.5k meshes=722 inst=1320
  water            draws=39 tris=2.81M meshes=39 inst=39
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=143 tris=15.1k meshes=143 inst=143
  other            draws=226 tris=26.6k meshes=226 inst=226

Shadow casters (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  vegetation       draws=95 tris=241.6k meshes=95 inst=170
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  items            draws=18 tris=12.2k meshes=18 inst=18
  other            draws=109 tris=15.0k meshes=109 inst=109

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=20 tris=8.9k meshes=20 inst=20
  storageContainer draws=32 tris=3.5k meshes=32 inst=46
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.2k meshes=8 inst=22
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=29 tris=540 meshes=29 inst=29

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=9 draws=82 tris=101.0k skinned=82/82
      Peasant_Boots    agents=4 draws=38 tris=49.3k skinned=38/38
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Wizard           agents=2 draws=24 tris=23.8k skinned=24/24
      blacksmith       agents=1 draws=10 tris=12.3k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      far  agents=20 camera-relevant=0 draws=192 tris=236.0k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=3 draws=24 tris=6.5k skinned=24/24
      dog              agents=4 draws=23 tris=7.8k skinned=23/23
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      sheep            agents=8 draws=16 tris=4.9k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      chicken          agents=3 draws=15 tris=1.9k skinned=0/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      far  agents=52 camera-relevant=0 draws=212 tris=88.3k

Systems:
  WATER          1.4 ms
  NPC            1.1 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         6.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  FAUNA: 17
  RENDER: 5

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=5.7 ms draws=323 tris=5.02M
  hide-grass         render=5.7 ms draws=279 tris=2.63M
  hide-vegetation    render=5.4 ms draws=302 tris=4.87M
  hide-vegetation-grass render=5.3 ms draws=268 tris=2.58M
  hide-environment   render=5.6 ms draws=323 tris=5.02M
  hide-settlement    render=5.0 ms draws=230 tris=4.83M
  hide-water         render=5.6 ms draws=310 tris=4.44M
  hide-terrain       render=5.5 ms draws=299 tris=3.25M
  hide-npc-fauna     render=3.9 ms draws=229 tris=4.93M
  no-shadows         render=5.4 ms draws=302 tris=4.82M
  no-ao              render=6.0 ms draws=307 tris=4.92M
  no-bloom           render=5.7 ms draws=315 tris=5.05M
  no-smaa            render=5.7 ms draws=320 tris=5.02M
  no-god-rays        render=5.7 ms draws=313 tris=4.92M
  no-film-grade      render=5.6 ms draws=328 tris=5.05M
  no-postprocessing  render=5.6 ms draws=300 tris=5.02M
  no-reflections     render=5.9 ms draws=258 tris=4.50M

Frame attribution:
  frame max: 83.5 ms
  largest labelled hitch: 0 ms
  unattributed: 83.5 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 83.5 ms

Raw sidecar:
  sampling=full factor=1 exported=1664/1664

Recommendation:
Largest frame (83.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.1 ms/frame
  crowd pass: 0.0 ms/frame (9.2 ms cumulative)
  agent updates: 0.7 ms/frame (1203.2 ms cumulative)
  livestock: 0.3 ms/frame (420.3 ms cumulative)
    loaded tick: 0.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.1 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.4/frame (0.0 candidates/frame)
    water samples: 8.8/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 8.8/frame, 0.00 ms/frame (worst call 0.10 ms, 517.6 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 4.4
    presentation executions/frame: 3.7
  rats: 0.1 ms/frame (98.6 ms cumulative)
  social: 0.0 ms/frame (3.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (154.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.2 ms/frame (1991.6 ms cumulative)
  forest sampling: 0.1 ms/frame (101.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (20.0 ms cumulative)
    targeting: 0.0 ms/frame (17.5 ms cumulative)
    decision: 0.0 ms/frame (13.6 ms cumulative)
    behaviour: 0.8 ms/frame (1366.6 ms cumulative)
    life/presentation: 0.2 ms/frame (358.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 28.8
    decision passes/frame: 28.8
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 13.3
    full-rate agents/frame: 8.2
    reduced-cadence agents/frame: 20.6
    behaviour executions/frame: 13.3
    presentation executions/frame: 12.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 28.8
    village scan candidates/frame: 333.6
    player perception checks/frame: 28.8

  nearest scans: 18.8/frame (31331 calls)
  nearest candidates checked: 141.6/frame (235557 total)
  herd leader scans: 0.1/frame (135 calls)
  herd candidates checked: 2.4/frame (4050 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 17.9/frame (104.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 40.7/frame, 0.00 ms/frame (worst call 1.10 ms)
    collider queries: 40.7/frame, 0.00 ms/frame (worst call 0.10 ms, 2611.4 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 14
Resident instances: full=506458 filler=1057227
Submitted instances: full=123730 filler=89957
Meshes submitted: 48
LOD submitted fraction: full=0.24430456227367323 filler=0.08508768693951252
Flowers: unavailable
Allocation bytes (estimated): 150113760
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1676
Shadow refresh frames: 152
Shadow skipped frames: 1524

Mirror:
  calls avg: 67  tris avg: 530515
  info calls avg: 67  residual calls avg: 0
  other                        calls=4 tris=4376
  settlement:decor             calls=36 tris=80522
  settlement:houseStatic       calls=9 tris=4001
  settlement:storageBarrel     calls=1 tris=1320
  settlement:storageContainer  calls=1 tris=240
  settlement:storageTrough     calls=1 tris=191
  terrain                      calls=5 tris=386632
  vegetation                   calls=9 tris=53377

Shadow (refresh only):
  calls avg: 189  tris avg: 1622535
  info calls avg: 189  residual calls avg: 0
  other                        calls=36 tris=9925
  settlement:decor             calls=82 tris=168834
  settlement:fireHouseInteriorLamp calls=1 tris=108
  settlement:houseInteractive  calls=2 tris=314
  settlement:houseStatic       calls=21 tris=9880
  settlement:storageContainer  calls=4 tris=528
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=2 tris=891
  settlement:workplace         calls=1 tris=1648
  terrain                      calls=18 tris=1327104
  vegetation                   calls=20 tris=102903

Main:
  calls avg: 218  tris avg: 4333544
  info calls avg: 256  residual calls avg: 0
  grass                        calls=39 tris=2345972
  npcFamily:Knight_Cloth       calls=14 tris=12253
  npcFamily:Peasant            calls=42 tris=37084
  npcFamily:Peasant_Boots      calls=20 tris=17630
  npcFamily:Wizard             calls=10 tris=8872
  npcFamily:blacksmith         calls=4 tris=3477
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=18 tris=13480
  settlement:decor             calls=9 tris=37592
  settlement:houseStatic       calls=17 tris=8256
  settlement:storageBarrel     calls=3 tris=2768
  settlement:storageContainer  calls=2 tris=504
  settlement:storageTrough     calls=2 tris=400
  terrain                      calls=17 tris=1253092
  vegetation                   calls=9 tris=64616
  water                        calls=8 tris=524288


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 83.5ms
simulate        74.2ms
render           9.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.2ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA           70.0ms
PHYSICS          0.0ms
RENDER           6.0ms
OTHER            3.2ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.7 ms  p95=6.5 ms  max=6.7 ms  Δavg vs baseline=—
  hide-grass           avg=5.7 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=5.4 ms  p95=6.0 ms  max=6.6 ms  Δavg vs baseline=-0.3 ms (-6%)
  no vegetation/grass  avg=5.3 ms  p95=6.0 ms  max=6.3 ms  Δavg vs baseline=-0.5 ms (-8%)
  hide-environment     avg=5.6 ms  p95=6.3 ms  max=6.5 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-settlement      avg=5.0 ms  p95=6.0 ms  max=6.7 ms  Δavg vs baseline=-0.7 ms (-13%)
  no water             avg=5.6 ms  p95=6.3 ms  max=6.7 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-terrain         avg=5.5 ms  p95=6.1 ms  max=6.4 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-npc-fauna       avg=3.9 ms  p95=4.4 ms  max=5.1 ms  Δavg vs baseline=-1.8 ms (-32%)
  no-shadows           avg=5.4 ms  p95=6.1 ms  max=9.0 ms  Δavg vs baseline=-0.3 ms (-5%)
  no-ao                avg=6.0 ms  p95=6.9 ms  max=9.3 ms  Δavg vs baseline=+0.3 ms (+5%)
  no-bloom             avg=5.7 ms  p95=6.8 ms  max=7.9 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-smaa              avg=5.7 ms  p95=7.1 ms  max=8.1 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-god-rays          avg=5.7 ms  p95=6.3 ms  max=6.8 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-film-grade        avg=5.6 ms  p95=6.4 ms  max=7.0 ms  Δavg vs baseline=-0.1 ms (-2%)
  no postprocessing    avg=5.6 ms  p95=6.6 ms  max=7.5 ms  Δavg vs baseline=-0.1 ms (-2%)
  no mirrors           avg=5.9 ms  p95=6.5 ms  max=6.9 ms  Δavg vs baseline=+0.1 ms (+2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=10.3 ms  p95=11.6 ms  max=11.7 ms
  CPU wall      avg=5.7 ms  p95=6.5 ms  max=6.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
