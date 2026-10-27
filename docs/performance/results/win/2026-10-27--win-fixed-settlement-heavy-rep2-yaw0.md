# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:56:33.176Z
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
Frames: 724
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-55-33-355Z-9s5x53
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
  populationGate: stable waited=5532ms npc=53
  cameraControl: yaw=0 pitch=0.4 distance=12
  gpuTimer: available=true resolved=true samples=729 span=postprocess+labels

FPS:
  avg: 26.1
  min: 8
  p1: 12

Frame time (wall-clock):
  avg: 38.3 ms
  p50: 38.9 ms
  p95: 44.3 ms
  p99: 81.9 ms
  max: 121.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.7 p95=12.8 p99=51.7 max=94.4 n=724
  render: p50=28.3 p95=32 p99=32.7 max=35.7 n=724
  frame: p50=38.9 p95=44.3 p99=81.9 max=121.2 n=724

Rendering (combined renderer.info):
  draw calls: 2370 avg / 2738 max
  triangles: 7.86M avg
  mirror draws: 349 avg
  geometries: 1004
  textures: 1649

Pass submissions (actual):
  reliability: observed
  frames: 730 shadowRefresh=730 shadowSkipped=0
  mirror calls avg: 349
  shadow calls avg: 423
  main calls avg: 1599

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1482 tris=1.37M meshes=1482 inst=3548
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=506 tris=29.8k meshes=506 inst=508

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=814 tris=833.0k meshes=814 inst=2706
  npc              draws=30 tris=36.5k meshes=30 inst=30
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=11.0k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=30.6k meshes=56 inst=56
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
  decor            draws=201 tris=382.8k meshes=201 inst=307
  other            draws=64 tris=1.9k meshes=64 inst=64

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
      mid  agents=3 camera-relevant=3 draws=30 tris=36.5k
      far  agents=50 camera-relevant=18 draws=490 tris=584.8k
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
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=88 camera-relevant=18 draws=389 tris=149.0k

Systems:
  WATER          3.8 ms
  NPC            4.0 ms
  FAUNA          2.7 ms
  PHYSICS        0.1 ms
  RENDER         23.6 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.3 ms draws=2375 tris=7.88M
  hide-grass         render=22.6 ms draws=2350 tris=7.57M
  hide-vegetation    render=21.7 ms draws=2188 tris=6.78M
  hide-vegetation-grass render=21.4 ms draws=2162 tris=6.48M
  hide-environment   render=22.1 ms draws=2085 tris=7.83M
  hide-settlement    render=18.7 ms draws=1495 tris=7.00M
  hide-water         render=22.3 ms draws=2348 tris=6.90M
  hide-terrain       render=21.9 ms draws=2307 tris=3.81M
  hide-npc-fauna     render=14.4 ms draws=1867 tris=7.42M
  no-shadows         render=18.7 ms draws=1970 tris=5.69M
  no-ao              render=22.6 ms draws=2360 tris=7.87M
  no-bloom           render=22.5 ms draws=2363 tris=7.88M
  no-smaa            render=22.9 ms draws=2383 tris=7.89M
  no-god-rays        render=22.7 ms draws=2372 tris=7.88M
  no-film-grade      render=22.9 ms draws=2382 tris=7.89M
  no-postprocessing  render=22.7 ms draws=2352 tris=7.88M
  no-reflections     render=22.2 ms draws=2026 tris=6.89M

Frame attribution:
  frame max: 121.2 ms
  largest labelled hitch: 0 ms
  unattributed: 121.2 ms

Long frames:
  threshold: 80 ms
  count: 8
  worst: 121.2 ms

Raw sidecar:
  sampling=full factor=1 exported=724/724

Recommendation:
Largest frame (121.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.0 ms/frame
  crowd pass: 0.0 ms/frame (10.1 ms cumulative)
  agent updates: 2.6 ms/frame (1903.8 ms cumulative)
  livestock: 1.1 ms/frame (816.9 ms cumulative)
    loaded tick: 1.1 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.1 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.9 predator candidates/frame)
    pest scans: 6.9/frame (6.9 rat candidates/frame)
    nearest scans: 28.5/frame (0.0 candidates/frame)
    water samples: 67.7/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 67.7/frame, 0.10 ms/frame (worst call 0.80 ms, 14778.2 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 56.0
    behaviour executions/frame: 28.9
    presentation executions/frame: 22.1
  rats: 0.1 ms/frame (37.3 ms cumulative)
  social: 0.0 ms/frame (3.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (114.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.7 ms/frame
  agent updates: 2.7 ms/frame (1948.0 ms cumulative)
  forest sampling: 0.1 ms/frame (48.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.7 ms cumulative)
    targeting: 0.0 ms/frame (13.7 ms cumulative)
    decision: 0.0 ms/frame (6.1 ms cumulative)
    behaviour: 2.3 ms/frame (1644.1 ms cumulative)
    life/presentation: 0.3 ms/frame (186.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 28.5
    decision passes/frame: 28.5
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.1
    full-rate agents/frame: 6.3
    reduced-cadence agents/frame: 22.2
    behaviour executions/frame: 17.1
    presentation executions/frame: 15.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 113.8
    village scan candidates/frame: 1341.0
    player perception checks/frame: 28.5

  nearest scans: 24.6/frame (17779 calls)
  nearest candidates checked: 434.0/frame (314238 total)
  herd leader scans: 0.4/frame (259 calls)
  herd candidates checked: 10.7/frame (7770 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.5/frame (180.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 17.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 17.6/frame, 0.00 ms/frame (worst call 0.10 ms, 257.8 colliders/frame)

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
Frames: 730
Shadow refresh frames: 730
Shadow skipped frames: 0

Mirror:
  calls avg: 349  tris avg: 989432
  info calls avg: 349  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=35 tris=2212
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3120
  settlement:fireHouseInteriorLamp calls=5 tris=540
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=33 tris=80502
  settlement:landmarkGarden    calls=5 tris=82803
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11764
  settlement:storageContainer  calls=28 tris=2316
  settlement:storageGoods      calls=39 tris=6445
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1700
  settlement:storageWoodHousehold calls=10 tris=4455
  settlement:storageWoodSettlementPrimary calls=1 tris=1074
  settlement:storageWoodSettlementSecondary calls=1 tris=2816
  settlement:workplace         calls=11 tris=5293
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 423  tris avg: 2178871
  info calls avg: 423  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=3 tris=1064
  faunaFamily:dog              calls=6 tris=1971
  faunaFamily:sheep            calls=4 tris=1191
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3872
  npcFamily:Peasant            calls=11 tris=12692
  npcFamily:Wizard             calls=3 tris=3341
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
  calls avg: 1599  tris avg: 4695908
  info calls avg: 2022  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=13 tris=4114
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=165 tris=180354
  npcFamily:Peasant_Boots      calls=42 tris=48628
  npcFamily:Wizard             calls=60 tris=56931
  npcFamily:blacksmith         calls=36 tris=38577
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=124 tris=14852
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=81 tris=5616
  settlement:fireHouseInteriorLamp calls=10 tris=1080
  settlement:fireVillageTorch  calls=15 tris=1073
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=161004
  settlement:landmarkGarden    calls=12 tris=210456
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=18700
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=22 tris=760
  settlement:storageBarrel     calls=12 tris=26296
  settlement:storageContainer  calls=58 tris=4884
  settlement:storageGoods      calls=54 tris=9533
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=18 tris=8019
  settlement:storageWoodSettlementPrimary calls=4 tris=4296
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 8
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 8 total):

[LONG FRAME] 121.2ms
simulate        94.4ms
render          26.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA           85.9ms
PHYSICS          0.2ms
RENDER          26.6ms
OTHER            4.6ms

Long frame #2:

[LONG FRAME] 87.4ms
simulate        55.2ms
render          32.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.7ms
STREAMING        0.0ms
NPC              3.7ms
FAUNA           46.9ms
PHYSICS          0.1ms
RENDER          23.5ms
OTHER            4.5ms

Long frame #3:

[LONG FRAME] 86.6ms
simulate        54.3ms
render          32.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.2ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           45.6ms
PHYSICS          0.1ms
RENDER          23.0ms
OTHER            4.7ms

Long frame #4:

[LONG FRAME] 86.5ms
simulate        54.3ms
render          32.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.3ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA           45.8ms
PHYSICS          0.1ms
RENDER          23.7ms
OTHER            4.7ms

Long frame #5:

[LONG FRAME] 84.7ms
simulate        52.2ms
render          32.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.0ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA           43.7ms
PHYSICS          0.2ms
RENDER          24.4ms
OTHER            4.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.3 ms  p95=22.9 ms  max=24.4 ms  Δavg vs baseline=—
  hide-grass           avg=22.6 ms  p95=23.5 ms  max=23.8 ms  Δavg vs baseline=+0.3 ms (+1%)
  hide-vegetation      avg=21.7 ms  p95=22.7 ms  max=23.4 ms  Δavg vs baseline=-0.6 ms (-3%)
  no vegetation/grass  avg=21.4 ms  p95=22.2 ms  max=22.4 ms  Δavg vs baseline=-0.9 ms (-4%)
  hide-environment     avg=22.1 ms  p95=22.8 ms  max=22.9 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-settlement      avg=18.7 ms  p95=19.5 ms  max=19.5 ms  Δavg vs baseline=-3.6 ms (-16%)
  no water             avg=22.3 ms  p95=23.4 ms  max=23.7 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-terrain         avg=21.9 ms  p95=22.9 ms  max=24.5 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-npc-fauna       avg=14.4 ms  p95=14.9 ms  max=15.3 ms  Δavg vs baseline=-7.9 ms (-35%)
  no-shadows           avg=18.7 ms  p95=19.2 ms  max=24.1 ms  Δavg vs baseline=-3.6 ms (-16%)
  no-ao                avg=22.6 ms  p95=23.1 ms  max=23.7 ms  Δavg vs baseline=+0.3 ms (+1%)
  no-bloom             avg=22.5 ms  p95=23.2 ms  max=25.3 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-smaa              avg=22.9 ms  p95=24.0 ms  max=24.8 ms  Δavg vs baseline=+0.6 ms (+3%)
  no-god-rays          avg=22.7 ms  p95=23.5 ms  max=24.7 ms  Δavg vs baseline=+0.4 ms (+2%)
  no-film-grade        avg=22.9 ms  p95=24.0 ms  max=24.2 ms  Δavg vs baseline=+0.5 ms (+2%)
  no postprocessing    avg=22.7 ms  p95=24.1 ms  max=24.5 ms  Δavg vs baseline=+0.4 ms (+2%)
  no mirrors           avg=22.2 ms  p95=23.3 ms  max=23.4 ms  Δavg vs baseline=-0.1 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=23.3 ms  p95=23.9 ms  max=24.0 ms
  CPU wall      avg=22.3 ms  p95=22.9 ms  max=24.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
