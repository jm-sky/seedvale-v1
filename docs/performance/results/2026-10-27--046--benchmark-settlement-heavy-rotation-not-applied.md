# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:40:56.649Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Frames: 257
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-40-15-816Z-g9yise
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
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 19.2
  min: 8
  p1: 9

Frame time (wall-clock):
  avg: 52 ms
  p50: 49.5 ms
  p95: 96.7 ms
  p99: 106.3 ms
  max: 119.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=10.7 p95=59.3 p99=63.4 max=68.3 n=257
  render: p50=35.2 p95=40.9 p99=44.2 max=103.7 n=257
  frame: p50=49.5 p95=96.7 p99=106.3 max=119.7 n=257

Rendering (combined renderer.info):
  draw calls: 2391 avg / 2767 max
  triangles: 7.86M avg
  mirror draws: 351 avg
  geometries: 1046
  textures: 2217

Pass submissions (actual):
  reliability: observed
  frames: 257 shadowRefresh=257 shadowSkipped=0
  mirror calls avg: 351
  shadow calls avg: 424
  main calls avg: 1616

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1508 tris=1.37M meshes=1508 inst=3574
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=807 tris=831.5k meshes=807 inst=2699
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=16 tris=5.1k meshes=16 inst=16
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=8.2k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=27.8k meshes=56 inst=56
  storageContainer draws=76 tris=9.0k meshes=76 inst=122
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.0k meshes=24 inst=70
  workplace        draws=26 tris=17.4k meshes=26 inst=26
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=8.8k meshes=5 inst=11
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=28 tris=3.0k meshes=28 inst=28
  fireCampfire     draws=40 tris=1.1k meshes=40 inst=40
  decor            draws=199 tris=387.0k meshes=199 inst=305
  other            draws=59 tris=1.8k meshes=59 inst=59

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      Peasant_Boots    agents=6 draws=55 tris=72.1k skinned=55/55
      blacksmith       agents=5 draws=54 tris=64.9k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=37 tris=49.6k skinned=37/37
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=23.5k
      far  agents=51 camera-relevant=17 draws=500 tris=597.8k
  Fauna:
    by family (sorted by draws):
      horse            agents=10 draws=80 tris=21.8k skinned=80/80
      dog              agents=13 draws=73 tris=25.2k skinned=73/73
      sheep            agents=20 draws=40 tris=12.2k skinned=40/40
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=5 draws=10 tris=20.0k skinned=10/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      mid  agents=4 camera-relevant=4 draws=16 tris=5.1k
      far  agents=87 camera-relevant=18 draws=383 tris=147.1k

Systems:
  WATER          5.0 ms
  NPC            4.0 ms
  FAUNA          7.3 ms
  PHYSICS        0.1 ms
  RENDER         30.2 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=27.8 ms draws=2389 tris=7.87M
  hide-grass         render=27.3 ms draws=2357 tris=7.55M
  hide-vegetation    render=27.0 ms draws=2212 tris=6.78M
  hide-vegetation-grass render=27.6 ms draws=2121 tris=6.31M
  hide-environment   render=28.5 ms draws=2041 tris=7.62M
  hide-settlement    render=24.8 ms draws=1525 tris=7.15M
  hide-water         render=27.9 ms draws=2318 tris=6.71M
  hide-terrain       render=28.1 ms draws=2284 tris=3.75M
  hide-npc-fauna     render=19.3 ms draws=1832 tris=7.28M
  no-shadows         render=23.4 ms draws=2093 tris=6.01M
  no-ao              render=28.4 ms draws=2308 tris=7.67M
  no-bloom           render=28.8 ms draws=2371 tris=7.86M
  no-smaa            render=28.6 ms draws=2381 tris=7.86M
  no-god-rays        render=28.7 ms draws=2266 tris=7.53M
  no-film-grade      render=36.0 ms draws=2374 tris=7.85M
  no-postprocessing  render=40.2 ms draws=2348 tris=7.85M
  no-reflections     render=27.9 ms draws=2022 tris=6.86M

Frame attribution:
  frame max: 119.7 ms
  largest labelled hitch: 0 ms
  unattributed: 119.7 ms

Long frames:
  threshold: 80 ms
  count: 27
  worst: 119.7 ms

Raw sidecar:
  sampling=full factor=1 exported=257/257

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.0 ms/frame
  crowd pass: 0.0 ms/frame (4.4 ms cumulative)
  agent updates: 2.4 ms/frame (620.9 ms cumulative)
  livestock: 1.2 ms/frame (311.3 ms cumulative)
    loaded tick: 1.2 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 55.8
    unique animals/frame: 49.9
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 12.9
    dog guard scans: 12.9/frame (103.6 predator candidates/frame)
    pest scans: 7.1/frame (7.1 rat candidates/frame)
    nearest scans: 30.1/frame (0.0 candidates/frame)
    water samples: 54.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 54.9/frame, 0.10 ms/frame (worst call 1.20 ms, 12093.8 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 55.7
    behaviour executions/frame: 30.2
    presentation executions/frame: 30.2
  rats: 0.1 ms/frame (25.6 ms cumulative)
  social: 0.0 ms/frame (2.0 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (49.8 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 7.3 ms/frame
  agent updates: 7.2 ms/frame (1850.7 ms cumulative)
  forest sampling: 0.1 ms/frame (26.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.2 ms cumulative)
    targeting: 0.0 ms/frame (6.0 ms cumulative)
    decision: 0.0 ms/frame (2.5 ms cumulative)
    behaviour: 6.5 ms/frame (1667.0 ms cumulative)
    life/presentation: 0.4 ms/frame (112.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 27.0
    decision passes/frame: 27.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.0
    full-rate agents/frame: 7.0
    reduced-cadence agents/frame: 20.0
    behaviour executions/frame: 17.0
    presentation executions/frame: 17.0

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 107.6
    village scan candidates/frame: 1323.5
    player perception checks/frame: 27.0

  nearest scans: 24.5/frame (6303 calls)
  nearest candidates checked: 432.5/frame (111154 total)
  herd leader scans: 0.3/frame (81 calls)
  herd candidates checked: 9.5/frame (2430 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.6/frame (186.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 66.9/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 66.9/frame, 0.10 ms/frame (worst call 1.10 ms, 1059.3 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 23
Resident instances: full=482171 filler=1025429
Submitted instances: full=75310 filler=42954
Meshes submitted: 75
LOD submitted fraction: full=0.15618940168529422 filler=0.04188880946413647
Flowers: unavailable
Allocation bytes (estimated): 144729600
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 257
Shadow refresh frames: 257
Shadow skipped frames: 0

Mirror:
  calls avg: 351  tris avg: 992817
  info calls avg: 351  residual calls avg: 0
  environment                  calls=44 tris=8900
  items                        calls=1 tris=630
  other                        calls=38 tris=2241
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9308
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=45 tris=3115
  settlement:fireHouseInteriorLamp calls=5 tris=539
  settlement:fireVillageTorch  calls=5 tris=356
  settlement:houseInteractive  calls=15 tris=1647
  settlement:houseStatic       calls=33 tris=80539
  settlement:landmarkGarden    calls=5 tris=82716
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=931
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:landmarkWellPasture calls=2 tris=931
  settlement:other             calls=9 tris=349
  settlement:storageBarrel     calls=4 tris=11761
  settlement:storageContainer  calls=28 tris=2316
  settlement:storageGoods      calls=38 tris=6937
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1700
  settlement:storageWoodHousehold calls=10 tris=4448
  settlement:storageWoodSettlementPrimary calls=1 tris=1070
  settlement:storageWoodSettlementSecondary calls=1 tris=2805
  settlement:workplace         calls=11 tris=5282
  terrain                      calls=8 tris=592119
  vegetation                   calls=22 tris=161542

Shadow (refresh only):
  calls avg: 424  tris avg: 2175955
  info calls avg: 424  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=5 tris=1859
  faunaFamily:dog              calls=9 tris=2860
  faunaFamily:donkey           calls=0 tris=125
  faunaFamily:sheep            calls=4 tris=1301
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=1758
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=2962
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=29 tris=8600
  settlement:fence             calls=4 tris=19796
  settlement:fireCampfire      calls=12 tris=176
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:houseInteractive  calls=16 tris=2512
  settlement:houseStatic       calls=33 tris=89974
  settlement:landmarkGarden    calls=1 tris=2400
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=13 tris=240
  settlement:storageContainer  calls=20 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=16 tris=7128
  settlement:storageWoodSettlementPrimary calls=2 tris=2148
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1616  tris avg: 4694923
  info calls avg: 2041  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1934
  faunaFamily:cow              calls=7 tris=2431
  faunaFamily:dog              calls=35 tris=11610
  faunaFamily:donkey           calls=7 tris=1984
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3973
  faunaFamily:sheep            calls=15 tris=4474
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15161
  npcFamily:Herbalist          calls=25 tris=27103
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=163 tris=178198
  npcFamily:Peasant_Boots      calls=42 tris=48332
  npcFamily:Wizard             calls=60 tris=56711
  npcFamily:blacksmith         calls=36 tris=38457
  npcFamily:woodcutter         calls=17 tris=15273
  other                        calls=129 tris=14892
  settlement:decor             calls=2 tris=1667
  settlement:fence             calls=4 tris=18543
  settlement:fireCampfire      calls=36 tris=453
  settlement:fireHouseExteriorLamp calls=81 tris=5582
  settlement:fireHouseInteriorLamp calls=10 tris=1074
  settlement:fireVillageTorch  calls=15 tris=1067
  settlement:houseInteractive  calls=30 tris=3282
  settlement:houseStatic       calls=66 tris=160452
  settlement:landmarkGarden    calls=12 tris=209637
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3725
  settlement:landmarkWellHousehold calls=10 tris=18627
  settlement:landmarkWellPasture calls=5 tris=1855
  settlement:other             calls=22 tris=755
  settlement:storageBarrel     calls=12 tris=26199
  settlement:storageContainer  calls=58 tris=4865
  settlement:storageGoods      calls=70 tris=13171
  settlement:storageHay        calls=2 tris=972
  settlement:storageTrough     calls=8 tris=3388
  settlement:storageWoodHousehold calls=18 tris=7970
  settlement:storageWoodSettlementPrimary calls=4 tris=4279
  settlement:storageWoodSettlementSecondary calls=4 tris=11220
  settlement:workplace         calls=37 tris=15431
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 27
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 27 total):

[LONG FRAME] 119.7ms
simulate        15.9ms
render         103.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           18.2ms
STREAMING        0.0ms
NPC              6.3ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER          85.6ms
OTHER            8.4ms

Long frame #2:

[LONG FRAME] 111.1ms
simulate        13.0ms
render          97.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.1ms
NPC              4.7ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER          97.8ms
OTHER            7.6ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #3:

[LONG FRAME] 108.8ms
simulate        68.3ms
render          39.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.0ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           58.7ms
PHYSICS          0.1ms
RENDER          30.0ms
OTHER            5.9ms

Long frame #4:

[LONG FRAME] 104.4ms
simulate        63.8ms
render          40.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.1ms
STREAMING        0.0ms
NPC              3.8ms
FAUNA           54.1ms
PHYSICS          0.1ms
RENDER          31.3ms
OTHER            6.0ms

Long frame #5:

[LONG FRAME] 102.6ms
simulate        62.9ms
render          39.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.5ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA           53.4ms
PHYSICS          0.2ms
RENDER          30.1ms
OTHER            5.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=27.8 ms  p95=28.9 ms  max=29.1 ms  Δavg vs baseline=—
  hide-grass           avg=27.3 ms  p95=27.6 ms  max=27.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-vegetation      avg=27.0 ms  p95=28.4 ms  max=28.6 ms  Δavg vs baseline=-0.8 ms (-3%)
  no vegetation/grass  avg=27.6 ms  p95=30.2 ms  max=30.9 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-environment     avg=28.5 ms  p95=30.6 ms  max=30.9 ms  Δavg vs baseline=+0.8 ms (+3%)
  hide-settlement      avg=24.8 ms  p95=26.1 ms  max=26.3 ms  Δavg vs baseline=-3.0 ms (-11%)
  no water             avg=27.9 ms  p95=29.7 ms  max=29.9 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-terrain         avg=28.1 ms  p95=28.8 ms  max=28.9 ms  Δavg vs baseline=+0.4 ms (+1%)
  hide-npc-fauna       avg=19.3 ms  p95=20.4 ms  max=20.6 ms  Δavg vs baseline=-8.5 ms (-31%)
  no-shadows           avg=23.4 ms  p95=24.4 ms  max=24.5 ms  Δavg vs baseline=-4.3 ms (-16%)
  no-ao                avg=28.4 ms  p95=29.2 ms  max=29.3 ms  Δavg vs baseline=+0.6 ms (+2%)
  no-bloom             avg=28.8 ms  p95=31.1 ms  max=31.7 ms  Δavg vs baseline=+1.0 ms (+4%)
  no-smaa              avg=28.6 ms  p95=29.5 ms  max=29.7 ms  Δavg vs baseline=+0.8 ms (+3%)
  no-god-rays          avg=28.7 ms  p95=30.3 ms  max=30.5 ms  Δavg vs baseline=+1.0 ms (+3%)
  no-film-grade        avg=36.0 ms  p95=48.8 ms  max=51.4 ms  Δavg vs baseline=+8.3 ms (+30%)
  no postprocessing    avg=40.2 ms  p95=44.7 ms  max=44.8 ms  Δavg vs baseline=+12.4 ms (+45%)
  no mirrors           avg=27.9 ms  p95=29.7 ms  max=30.0 ms  Δavg vs baseline=+0.1 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
