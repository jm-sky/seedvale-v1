# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:51:57.595Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Frames: 249
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-51-17-237Z-6lv8qw
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
  avg: 20.7
  min: 6
  p1: 12

Frame time (wall-clock):
  avg: 48.2 ms
  p50: 49.4 ms
  p95: 54.8 ms
  p99: 84.7 ms
  max: 163.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=10.7 p95=13 p99=56.9 max=58.6 n=249
  render: p50=37.4 p95=42.4 p99=51.6 max=146.8 n=249
  frame: p50=49.4 p95=54.8 p99=84.7 max=163.8 n=249

Rendering (combined renderer.info):
  draw calls: 2386 avg / 2772 max
  triangles: 7.86M avg
  mirror draws: 351 avg
  geometries: 1000
  textures: 1599

Pass submissions (actual):
  reliability: observed
  frames: 249 shadowRefresh=249 shadowSkipped=0
  mirror calls avg: 351
  shadow calls avg: 419
  main calls avg: 1617

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1517 tris=1.37M meshes=1517 inst=3583
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=807 tris=828.7k meshes=807 inst=2699
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=12 tris=7.2k meshes=12 inst=12
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=117 tris=15.1k meshes=117 inst=117

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=8.2k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=24.9k meshes=56 inst=56
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
      mid  agents=4 camera-relevant=3 draws=12 tris=7.2k
      far  agents=87 camera-relevant=19 draws=387 tris=145.0k

Systems:
  WATER          5.6 ms
  NPC            4.1 ms
  FAUNA          2.0 ms
  PHYSICS        0.1 ms
  RENDER         30.9 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=28.6 ms draws=2389 tris=7.85M
  hide-grass         render=28.6 ms draws=2357 tris=7.54M
  hide-vegetation    render=27.4 ms draws=2209 tris=6.77M
  hide-vegetation-grass render=27.2 ms draws=2113 tris=6.29M
  hide-environment   render=27.2 ms draws=2104 tris=7.82M
  hide-settlement    render=23.8 ms draws=1519 tris=7.15M
  hide-water         render=28.8 ms draws=2401 tris=6.92M
  hide-terrain       render=28.2 ms draws=2350 tris=3.82M
  hide-npc-fauna     render=19.3 ms draws=1904 tris=7.42M
  no-shadows         render=24.4 ms draws=1882 tris=5.36M
  no-ao              render=27.8 ms draws=2512 tris=8.20M
  no-bloom           render=28.8 ms draws=2392 tris=7.88M
  no-smaa            render=29.1 ms draws=2403 tris=7.88M
  no-god-rays        render=29.2 ms draws=2406 tris=7.88M
  no-film-grade      render=28.8 ms draws=2405 tris=7.88M
  no-postprocessing  render=27.1 ms draws=2380 tris=7.88M
  no-reflections     render=29.3 ms draws=2053 tris=6.89M

Frame attribution:
  frame max: 163.8 ms
  largest labelled hitch: 0 ms
  unattributed: 163.8 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 163.8 ms

Raw sidecar:
  sampling=full factor=1 exported=249/249

Recommendation:
Largest frame (163.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.1 ms/frame
  crowd pass: 0.0 ms/frame (2.8 ms cumulative)
  agent updates: 2.4 ms/frame (601.4 ms cumulative)
  livestock: 1.2 ms/frame (308.5 ms cumulative)
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
    update calls/frame: 55.5
    unique animals/frame: 49.6
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.8
    dog guard scans: 12.8/frame (102.8 predator candidates/frame)
    pest scans: 6.2/frame (6.2 rat candidates/frame)
    nearest scans: 29.3/frame (0.0 candidates/frame)
    water samples: 56.7/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 56.7/frame, 0.10 ms/frame (worst call 0.20 ms, 11905.3 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 55.2
    behaviour executions/frame: 29.5
    presentation executions/frame: 29.5
  rats: 0.1 ms/frame (25.7 ms cumulative)
  social: 0.0 ms/frame (1.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (60.3 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 2.0 ms/frame
  agent updates: 2.0 ms/frame (486.7 ms cumulative)
  forest sampling: 0.1 ms/frame (26.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (5.7 ms cumulative)
    targeting: 0.0 ms/frame (7.0 ms cumulative)
    decision: 0.0 ms/frame (3.4 ms cumulative)
    behaviour: 1.2 ms/frame (308.3 ms cumulative)
    life/presentation: 0.4 ms/frame (103.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 27.0
    decision passes/frame: 27.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.9
    full-rate agents/frame: 6.7
    reduced-cadence agents/frame: 20.3
    behaviour executions/frame: 16.9
    presentation executions/frame: 16.8

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 106.9
    village scan candidates/frame: 1576.7
    player perception checks/frame: 27.0

  nearest scans: 24.8/frame (6165 calls)
  nearest candidates checked: 456.6/frame (113702 total)
  herd leader scans: 0.2/frame (59 calls)
  herd candidates checked: 7.1/frame (1770 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.5/frame (180.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 18.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 18.6/frame, 0.00 ms/frame (worst call 0.20 ms, 280.9 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 10
  empty builds (no instances): 0
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.95 ms
    max 5.70 ms

  allocation/setup:
    avg 0.83 ms
    max 5.10 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.10 ms
    max 0.30 ms
  scene attach (`scene.add`):
    avg 0.05 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 1.44 ms
    max 6.20 ms

  per chunk:
    instances avg/max 90736.4 / 266667
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 290503 / 616861
    matrix instances bound: 907364
    instanced attributes created: 200
    shared material refs: 40
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 10/10
    instances: 109859 (max 32075)
    allocation/setup avg/max: 0.09 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 10/10
    instances: 36687 (max 10670)
    allocation/setup avg/max: 0.07 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 10/10
    instances: 143957 (max 42240)
    allocation/setup avg/max: 0.64 / 4.60 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 10/10
    instances: 616861 (max 181682)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

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
Lifecycle: req=0 complete=10 discard(unload=0,oor=0) cancel=0 streamIn=10 streamOut=0 invalidate=0
Finalization: observed completions=10

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 249
Shadow refresh frames: 249
Shadow skipped frames: 0

Mirror:
  calls avg: 351  tris avg: 991913
  info calls avg: 351  residual calls avg: 0
  environment                  calls=44 tris=8901
  items                        calls=1 tris=624
  other                        calls=38 tris=2241
  settlement:decor             calls=1 tris=834
  settlement:fence             calls=2 tris=9287
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=45 tris=3097
  settlement:fireHouseInteriorLamp calls=5 tris=536
  settlement:fireVillageTorch  calls=5 tris=353
  settlement:houseInteractive  calls=15 tris=1638
  settlement:houseStatic       calls=33 tris=80256
  settlement:landmarkGarden    calls=5 tris=82290
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=924
  settlement:landmarkWellHousehold calls=5 tris=9312
  settlement:landmarkWellPasture calls=2 tris=924
  settlement:other             calls=9 tris=347
  settlement:storageBarrel     calls=4 tris=11711
  settlement:storageContainer  calls=28 tris=2306
  settlement:storageGoods      calls=39 tris=6923
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1694
  settlement:storageWoodHousehold calls=10 tris=4423
  settlement:storageWoodSettlementPrimary calls=1 tris=1061
  settlement:storageWoodSettlementSecondary calls=1 tris=2782
  settlement:workplace         calls=11 tris=5249
  terrain                      calls=8 tris=592193
  vegetation                   calls=22 tris=161562

Shadow (refresh only):
  calls avg: 419  tris avg: 2178242
  info calls avg: 419  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:dog              calls=7 tris=2413
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=4 tris=1093
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2652
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=3010
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
  vegetation                   calls=79 tris=554858

Main:
  calls avg: 1617  tris avg: 4688443
  info calls avg: 2036  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1923
  faunaFamily:cow              calls=7 tris=2411
  faunaFamily:dog              calls=35 tris=11545
  faunaFamily:donkey           calls=7 tris=1968
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3940
  faunaFamily:sheep            calls=13 tris=4008
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15151
  npcFamily:Herbalist          calls=25 tris=26919
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=160 tris=174781
  npcFamily:Peasant_Boots      calls=42 tris=48017
  npcFamily:Wizard             calls=59 tris=56442
  npcFamily:blacksmith         calls=36 tris=38295
  npcFamily:woodcutter         calls=17 tris=15159
  other                        calls=129 tris=14892
  settlement:decor             calls=2 tris=1660
  settlement:fence             calls=4 tris=18500
  settlement:fireCampfire      calls=36 tris=451
  settlement:fireHouseExteriorLamp calls=80 tris=5546
  settlement:fireHouseInteriorLamp calls=10 tris=1068
  settlement:fireVillageTorch  calls=15 tris=1062
  settlement:houseInteractive  calls=30 tris=3263
  settlement:houseStatic       calls=65 tris=159866
  settlement:landmarkGarden    calls=12 tris=208766
  settlement:landmarkNoticeBoard calls=2 tris=35
  settlement:landmarkWellCentral calls=10 tris=3710
  settlement:landmarkWellHousehold calls=10 tris=18550
  settlement:landmarkWellPasture calls=5 tris=1840
  settlement:other             calls=22 tris=750
  settlement:storageBarrel     calls=12 tris=26096
  settlement:storageContainer  calls=57 tris=4845
  settlement:storageGoods      calls=78 tris=13790
  settlement:storageHay        calls=2 tris=968
  settlement:storageTrough     calls=8 tris=3374
  settlement:storageWoodHousehold calls=18 tris=7919
  settlement:storageWoodSettlementPrimary calls=4 tris=4261
  settlement:storageWoodSettlementSecondary calls=4 tris=11174
  settlement:workplace         calls=37 tris=15363
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 6
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 6 total):

[LONG FRAME] 163.8ms
simulate        16.9ms
render         146.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           19.5ms
STREAMING        0.0ms
NPC              8.3ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         127.3ms
OTHER            7.7ms

Long frame #2:

[LONG FRAME] 150.2ms
simulate         9.2ms
render         140.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.0ms
STREAMING        1.5ms
NPC              1.5ms
FAUNA            1.0ms
PHYSICS          0.4ms
RENDER         131.9ms
OTHER            4.9ms

streaming / stages:
  contentFinalize              1.5ms
  chunkFinalize                1.5ms
  chunkUpdate                  1.5ms

Long frame #3:

[LONG FRAME] 85ms
simulate        58.6ms
render          26.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.3ms
FAUNA           48.8ms
PHYSICS          0.1ms
RENDER          26.2ms
OTHER            5.5ms

Long frame #4:

[LONG FRAME] 84.4ms
simulate        58.4ms
render          25.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.2ms
FAUNA           48.9ms
PHYSICS          0.1ms
RENDER          25.8ms
OTHER            5.3ms

Long frame #5:

[LONG FRAME] 83.9ms
simulate        57.4ms
render          26.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           48.1ms
PHYSICS          0.1ms
RENDER          26.2ms
OTHER            5.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=28.6 ms  p95=29.9 ms  max=30.1 ms  Δavg vs baseline=—
  hide-grass           avg=28.6 ms  p95=30.7 ms  max=31.1 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-vegetation      avg=27.4 ms  p95=28.0 ms  max=28.0 ms  Δavg vs baseline=-1.1 ms (-4%)
  no vegetation/grass  avg=27.2 ms  p95=27.8 ms  max=27.9 ms  Δavg vs baseline=-1.4 ms (-5%)
  hide-environment     avg=27.2 ms  p95=28.5 ms  max=28.7 ms  Δavg vs baseline=-1.4 ms (-5%)
  hide-settlement      avg=23.8 ms  p95=24.7 ms  max=24.7 ms  Δavg vs baseline=-4.8 ms (-17%)
  no water             avg=28.8 ms  p95=29.8 ms  max=30.0 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-terrain         avg=28.2 ms  p95=29.4 ms  max=29.5 ms  Δavg vs baseline=-0.3 ms (-1%)
  hide-npc-fauna       avg=19.3 ms  p95=22.8 ms  max=23.4 ms  Δavg vs baseline=-9.2 ms (-32%)
  no-shadows           avg=24.4 ms  p95=25.2 ms  max=25.3 ms  Δavg vs baseline=-4.2 ms (-15%)
  no-ao                avg=27.8 ms  p95=28.4 ms  max=28.4 ms  Δavg vs baseline=-0.8 ms (-3%)
  no-bloom             avg=28.8 ms  p95=30.4 ms  max=30.7 ms  Δavg vs baseline=+0.3 ms (+1%)
  no-smaa              avg=29.1 ms  p95=31.2 ms  max=31.5 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-god-rays          avg=29.2 ms  p95=30.7 ms  max=31.0 ms  Δavg vs baseline=+0.6 ms (+2%)
  no-film-grade        avg=28.8 ms  p95=29.9 ms  max=30.0 ms  Δavg vs baseline=+0.3 ms (+1%)
  no postprocessing    avg=27.1 ms  p95=28.9 ms  max=29.1 ms  Δavg vs baseline=-1.5 ms (-5%)
  no mirrors           avg=29.3 ms  p95=30.0 ms  max=30.1 ms  Δavg vs baseline=+0.7 ms (+2%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
