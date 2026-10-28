# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:30:02.765Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Program Census]
> - [Seedvale Program Attribution]
> - [Seedvale Program Compile Cost]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: stream
Duration: 30s
Frames: 1401
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d7ddb33720d54ece4e216ee27ed1e7ffa968a234
  runId: 2026-10-28T22-29-17-793Z-l8j5x2
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
  viewport: 1586x806
  drawingBuffer: 1982x1007
  camera: pos=(427, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5009ms npc=20
  gpuTimer: available=true resolved=true samples=1407 span=postprocess+labels

FPS:
  avg: 60
  min: 8
  p1: 16

Frame time (wall-clock):
  avg: 16.7 ms
  p50: 14.7 ms
  p95: 28.2 ms
  p99: 61.9 ms
  max: 129.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.5 p95=9.5 p99=49.6 max=114.2 n=1401
  render: p50=10.6 p95=19.4 p99=27.2 max=62 n=1401
  frame: p50=14.7 p95=28.2 p99=61.9 max=129.4 n=1401

Rendering (combined renderer.info):
  draw calls: 877 avg / 2038 max
  triangles: 10.71M avg
  mirror draws: 154 avg
  geometries: 749
  textures: 591

Pass submissions (actual):
  reliability: observed
  frames: 1411 shadowRefresh=613 shadowSkipped=798
  mirror calls avg: 153
  shadow calls avg: 309
  main calls avg: 571

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=48 tris=1.11M meshes=48 inst=113076
  vegetation       draws=199 tris=1.32M meshes=199 inst=841
  environment      draws=127 tris=25.5k meshes=127 inst=143
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=47 tris=3.40M meshes=47 inst=47
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=338 tris=28.6k meshes=338 inst=338
  other            draws=217 tris=25.7k meshes=217 inst=217

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=183 tris=1.27M meshes=183 inst=813
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=98 tris=14.5k meshes=98 inst=98

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=67 tris=43.7k meshes=67 inst=379
  houseInteractive draws=18 tris=2.8k meshes=18 inst=18
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.0k meshes=3 inst=9
  storageContainer draws=30 tris=3.2k meshes=30 inst=42
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.0k meshes=8 inst=20
  workplace        draws=8 tris=4.1k meshes=8 inst=8
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=9 tris=972 meshes=9 inst=9
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=27 tris=504 meshes=27 inst=27

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=11 draws=100 tris=122.8k skinned=100/100
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Farmer           agents=2 draws=16 tris=24.5k skinned=16/16
      Wizard           agents=1 draws=12 tris=12.0k skinned=12/12
      Herbalist        agents=1 draws=10 tris=14.2k skinned=10/10
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      far  agents=19 camera-relevant=0 draws=174 tris=222.1k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      cow              agents=2 draws=14 tris=4.9k skinned=14/14
      donkey           agents=2 draws=14 tris=4.0k skinned=14/14
      dog              agents=2 draws=12 tris=3.9k skinned=12/12
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      horse            agents=1 draws=8 tris=2.2k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      far  agents=51 camera-relevant=0 draws=197 tris=86.4k

Systems:
  WATER          2.0 ms
  STREAMING      0.7 ms
  NPC            1.4 ms
  FAUNA          1.6 ms
  PHYSICS        0.1 ms
  RENDER         9.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  STREAMING: 7
  WATER: 3

Hitches (>= 8 ms): total=10
  chunk mesh             n=7 avg=8.8 max=11.6
  chunk water            n=3 avg=8.6 max=9.2

Isolation probes:
  full               render=6.0 ms draws=296 tris=6.15M
  hide-grass         render=5.7 ms draws=267 tris=5.08M
  hide-vegetation    render=5.2 ms draws=161 tris=4.33M
  hide-vegetation-grass render=4.9 ms draws=133 tris=3.31M
  hide-environment   render=5.9 ms draws=280 tris=6.20M
  hide-settlement    render=5.6 ms draws=279 tris=6.19M
  hide-water         render=6.0 ms draws=279 tris=5.10M
  hide-terrain       render=5.7 ms draws=261 tris=3.82M
  hide-npc-fauna     render=5.3 ms draws=301 tris=6.21M
  no-shadows         render=5.7 ms draws=286 tris=5.90M
  no-ao              render=5.8 ms draws=295 tris=6.21M
  no-bloom           render=5.8 ms draws=288 tris=6.21M
  no-smaa            render=5.9 ms draws=298 tris=6.21M
  no-god-rays        render=5.9 ms draws=293 tris=6.07M
  no-film-grade      render=6.1 ms draws=296 tris=6.15M
  no-postprocessing  render=5.8 ms draws=273 tris=6.15M
  no-reflections     render=6.0 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 129.4 ms
  largest labelled hitch: 11.6 ms
  unattributed: 117.8 ms

Long frames:
  threshold: 80 ms
  count: 8
  worst: 129.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1401/1401

Recommendation:
Largest frame (129.4 ms) is not explained by labelled hitches (largest 11.6 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (8.0 ms cumulative)
  agent updates: 0.8 ms/frame (1070.6 ms cumulative)
  livestock: 0.2 ms/frame (348.0 ms cumulative)
    loaded tick: 0.2 ms/frame
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
    update calls/frame: 14.7
    unique animals/frame: 14.5
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.5 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 3.8/frame (0.0 candidates/frame)
    water samples: 6.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 6.1/frame, 0.00 ms/frame (worst call 0.10 ms, 408.4 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 14.5
    behaviour executions/frame: 3.9
    presentation executions/frame: 3.4
  rats: 0.1 ms/frame (113.8 ms cumulative)
  social: 0.0 ms/frame (4.7 ms cumulative)
  streaming: 0.1 ms/frame (191.4 ms cumulative)
  maintenance: 0.1 ms/frame (141.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.6 ms/frame (2260.7 ms cumulative)
  forest sampling: 0.1 ms/frame (106.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.0 ms cumulative)
    targeting: 0.0 ms/frame (17.8 ms cumulative)
    decision: 0.0 ms/frame (17.4 ms cumulative)
    behaviour: 1.1 ms/frame (1563.3 ms cumulative)
    life/presentation: 0.3 ms/frame (421.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.7
    expensive behaviour agents/frame: 15.1
    full-rate agents/frame: 10.2
    reduced-cadence agents/frame: 19.8
    behaviour executions/frame: 15.8
    presentation executions/frame: 14.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.3
    village scan candidates/frame: 278.4
    player perception checks/frame: 30.0

  nearest scans: 20.6/frame (28833 calls)
  nearest candidates checked: 110.8/frame (155261 total)
  herd leader scans: 0.1/frame (145 calls)
  herd candidates checked: 3.1/frame (4350 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.0/frame (127.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 62.2/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 62.2/frame, 0.00 ms/frame (worst call 0.50 ms, 3088.3 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.12 ms
    max 0.30 ms

  allocation/setup:
    avg 0.04 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.02 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.26 ms
    max 0.40 ms

  per chunk:
    instances avg/max 145839.8 / 271541
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 886124 / 1884833
    matrix instances bound: 2770957
    instanced attributes created: 380
    shared material refs: 76
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 19/19
    instances: 332550 (max 32465)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 19/19
    instances: 1884833 (max 184184)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 12
Resident instances: full=539276 filler=1145900
Submitted instances: full=75602 filler=37465
Meshes submitted: 39
LOD submitted fraction: full=0.14019166437964975 filler=0.03269482502836198
Flowers: unavailable
Allocation bytes (estimated): 161776896
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=32 discard(unload=0,oor=0) cancel=0 streamIn=16 streamOut=25 invalidate=0
Finalization: observed completions=32

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1411
Shadow refresh frames: 613
Shadow skipped frames: 798

Mirror:
  calls avg: 153  tris avg: 869156
  info calls avg: 153  residual calls avg: 0
  environment                  calls=4 tris=3855
  items                        calls=1 tris=505
  other                        calls=33 tris=4795
  settlement:decor             calls=8 tris=20028
  settlement:fence             calls=1 tris=2161
  settlement:fireCampfire      calls=2 tris=188
  settlement:fireHouseExteriorLamp calls=5 tris=242
  settlement:fireHouseInteriorLamp calls=2 tris=182
  settlement:fireVillageTorch  calls=7 tris=501
  settlement:houseInteractive  calls=5 tris=556
  settlement:houseStatic       calls=12 tris=10573
  settlement:landmarkGarden    calls=2 tris=23474
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=676
  settlement:landmarkWellHousehold calls=2 tris=2128
  settlement:landmarkWellPasture calls=2 tris=594
  settlement:other             calls=3 tris=65
  settlement:storageBarrel     calls=3 tris=3955
  settlement:storageContainer  calls=10 tris=726
  settlement:storageGoods      calls=13 tris=2710
  settlement:storageHay        calls=0 tris=180
  settlement:storageTrough     calls=2 tris=483
  settlement:storageWoodHousehold calls=0 tris=1636
  settlement:storageWoodSettlementPrimary calls=0 tris=294
  settlement:workplace         calls=3 tris=1351
  terrain                      calls=5 tris=404601
  vegetation                   calls=23 tris=382849

Shadow (refresh only):
  calls avg: 309  tris avg: 2251587
  info calls avg: 309  residual calls avg: 0
  environment                  calls=11 tris=5560
  faunaFamily:boar             calls=5 tris=2391
  faunaFamily:cow              calls=2 tris=763
  faunaFamily:duck             calls=1 tris=38
  faunaFamily:fox              calls=1 tris=301
  faunaFamily:horse            calls=2 tris=498
  faunaFamily:rabbit           calls=1 tris=636
  faunaFamily:rat              calls=1 tris=1378
  faunaFamily:sheep            calls=0 tris=64
  faunaFamily:stag             calls=5 tris=3353
  faunaFamily:wolf             calls=0 tris=118
  items                        calls=4 tris=2066
  npcFamily:Knight_Cloth       calls=3 tris=3868
  npcFamily:Peasant            calls=3 tris=3500
  npcFamily:Peasant_Boots      calls=1 tris=1016
  npcFamily:woodcutter         calls=1 tris=900
  other                        calls=52 tris=11376
  settlement:decor             calls=107 tris=213678
  settlement:fireHouseInteriorLamp calls=1 tris=125
  settlement:houseInteractive  calls=2 tris=372
  settlement:houseStatic       calls=15 tris=6859
  settlement:landmarkGarden    calls=1 tris=499
  settlement:landmarkNoticeBoard calls=1 tris=23
  settlement:landmarkWellCentral calls=3 tris=1164
  settlement:other             calls=4 tris=81
  settlement:storageContainer  calls=5 tris=528
  settlement:storageHay        calls=1 tris=287
  settlement:storageTrough     calls=1 tris=278
  settlement:storageWoodHousehold calls=1 tris=1089
  settlement:storageWoodSettlementPrimary calls=1 tris=458
  settlement:workplace         calls=2 tris=2130
  terrain                      calls=19 tris=1366157
  vegetation                   calls=53 tris=620034

Main:
  calls avg: 571  tris avg: 8831146
  info calls avg: 719  residual calls avg: 0
  environment                  calls=51 tris=13489
  faunaFamily:bear             calls=1 tris=643
  faunaFamily:chicken          calls=6 tris=811
  faunaFamily:cow              calls=1 tris=199
  faunaFamily:dog              calls=11 tris=3853
  faunaFamily:horse            calls=0 tris=51
  faunaFamily:rabbit           calls=0 tris=162
  faunaFamily:rat              calls=2 tris=3204
  faunaFamily:sheep            calls=4 tris=1226
  faunaFamily:stag             calls=1 tris=472
  faunaFamily:wolf             calls=2 tris=883
  grass                        calls=37 tris=5551006
  items                        calls=46 tris=5337
  npcFamily:Farmer             calls=7 tris=10981
  npcFamily:Knight_Cloth       calls=6 tris=7679
  npcFamily:Peasant            calls=36 tris=44155
  npcFamily:Peasant_Boots      calls=6 tris=8021
  npcFamily:blacksmith         calls=7 tris=9442
  other                        calls=87 tris=14699
  settlement:decor             calls=14 tris=36238
  settlement:fence             calls=3 tris=4468
  settlement:fireCampfire      calls=5 tris=382
  settlement:fireHouseExteriorLamp calls=10 tris=503
  settlement:fireHouseInteriorLamp calls=4 tris=379
  settlement:fireVillageTorch  calls=14 tris=1038
  settlement:houseInteractive  calls=11 tris=1161
  settlement:houseStatic       calls=22 tris=19954
  settlement:landmarkGarden    calls=5 tris=47607
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1449
  settlement:landmarkWellHousehold calls=4 tris=4374
  settlement:landmarkWellPasture calls=3 tris=1227
  settlement:other             calls=7 tris=133
  settlement:storageBarrel     calls=5 tris=8162
  settlement:storageContainer  calls=21 tris=1500
  settlement:storageGoods      calls=27 tris=5662
  settlement:storageHay        calls=1 tris=365
  settlement:storageTrough     calls=3 tris=1001
  settlement:storageWoodHousehold calls=1 tris=3386
  settlement:storageWoodSettlementPrimary calls=1 tris=599
  settlement:workplace         calls=6 tris=2838
  terrain                      calls=24 tris=1742834
  vegetation                   calls=55 tris=810033
  water                        calls=7 tris=459861


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

[LONG FRAME] 129.4ms
simulate       114.2ms
render          15.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.6ms
STREAMING        0.0ms
NPC            109.4ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER          10.4ms
OTHER            4.2ms

streaming / stages:
  riverTileBuild               96.2ms
  terrainPrepare               6.5ms
  riverChannelSegmentsNear     0.2ms

Long frame #2:

[LONG FRAME] 128ms
simulate       108.8ms
render          19.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.2ms
STREAMING      100.8ms
NPC              1.4ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER          13.8ms
OTHER            5.9ms

streaming / stages:
  chunkUpdate                  100.8ms
  riverTileBuild               94.6ms
  terrainPrepare               1.6ms
  riverChannelSegmentsNear     0.5ms

Long frame #3:

[LONG FRAME] 118.3ms
simulate        90.5ms
render          26.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       84.5ms
NPC              1.5ms
FAUNA            0.9ms
PHYSICS          0.0ms
RENDER          26.8ms
OTHER            4.6ms

streaming / stages:
  chunkUpdate                  84.5ms
  riverTileBuild               80.2ms
  terrainPrepare               1.1ms
  riverChannelSegmentsNear     0.1ms

Long frame #4:

[LONG FRAME] 90.9ms
simulate        78.5ms
render          12.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING       68.4ms
NPC              3.6ms
FAUNA            1.2ms
PHYSICS          0.0ms
RENDER          12.1ms
OTHER            5.5ms

streaming / stages:
  chunkUpdate                  68.4ms
  riverTileBuild               66.2ms
  terrainPrepare               1.1ms
  riverChannelSegmentsNear     0.4ms

Long frame #5:

[LONG FRAME] 90.6ms
simulate        66.7ms
render          23.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        2.0ms
NPC              1.7ms
FAUNA           57.3ms
PHYSICS          0.1ms
RENDER          16.4ms
OTHER            5.8ms

streaming / stages:
  contentFinalize              2.0ms
  chunkFinalize                2.0ms
  chunkUpdate                  2.0ms

---

[Seedvale Program Census]

Programs created: 131
Program count: final=130 max=130

By frame:
  frame 0   +75 programs   <== largest transition
  frame 77   +1 program
  frame 85   +1 program
  frame 441   +1 program
  frame 460   +1 program
  frame 489   +1 program
  frame 518   +1 program
  frame 576   +1 program
  frame 590   +1 program
  frame 754   +1 program
  frame 1049   +1 program
  frame 1173   +1 program
  frame 2225   +18 programs
  frame 2272   +5 programs
  frame 2507   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=37b0dd76-9d71-4af6-bcbb-3763560d5d1d (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2e37f83c-9d78-4176-b99d-7f9246cc8f72
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=76b1ea5a-5e12-459a-b4eb-53fa505cda0e
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b8f7c04d-3f2d-4628-838e-cdad33cf8826
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f0a64083-34dd-4c3b-972a-9d40303745e7
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3d2071e6-6511-4abb-aae0-9cb80ae9f9b9
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8fa755fa-20fa-4231-a0df-25efafd7528d
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c11e25e7-4c89-47c1-a58d-fff8df7c1d8d
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=99c9b3f4-ab13-4724-a551-5eec994149a1
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=af196252-1570-438e-afbb-e7639eefb102 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=30c1d3f1-43d3-400c-9817-fd81e34bd9cf
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9d66d023-6388-4701-b9b8-dc8cd9b95735 (Green)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2134acec-d936-4036-bbb9-0e3b8572d71f (Pink)
  #15 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d0334cd8-9745-48c8-84be-4899fb7cb4e4 (Flowers)
  #16 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7ab07791-b3e4-4282-8333-6bae99180f72 (None)
  #17 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fbc78365-8f35-419b-a403-d75360e3af70 (Wood)
  #18 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=80c6d069-43bd-4bc4-a8a9-9f990fc42d37 (MI_WoodTrim)
  #19 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #20 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a52461c7-3a19-43b3-83e4-cc3e1a8e3169 (MI_WindowGlass)
  #21 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=30381e4d-0660-450b-ab5c-33970b4f308e (MI_WoodTrim)
  #22 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #23 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d201572f-d196-4e2f-bd99-6ef5e66bfc2e (MI_WindowGlass)
  #24 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e37c9406 fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e174788c-188f-4232-b7e9-af1339c1305d (Wood_Light)
  #25 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #26 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #27 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4aa61317-b30b-48f9-895b-db8fbc467c80 (MapleTree_Leaves)
  #28 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1442e282-fda8-4dc8-9c1a-942cf8c6a2ed (Green)
  #29 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=e1e65191-4f90-45d0-bf82-13ee8ee1f235 (MapleTree_Bark)
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8e2d64ac-712f-42b8-b7f2-e7d4fabff494 (Main)
  #31 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=42a70eea-7cab-4673-8196-d72ac3a5c8ee (lambert2SG)
  #32 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=04c5f114-f643-47cc-9b7b-1f3c7e21162c (Material #55)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d1040267-4fce-40dc-9930-a93c26441628 (Main)
  #34 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=de27a584-d919-4b9d-9d24-6b2b6ae02d93 (MI_Knight)
  #35 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7c63aa3e-745f-4a02-8ba7-be0415d0e93e (MI_Knight)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c4e3089f-2f32-43cc-b86c-42120f72594d (MI_Hair_1)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4eaf31e7-1e77-42a2-802c-b6d2d5316100 (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3ef3ed5f-5b4f-49cf-9c5d-1351ac42586f (MI_Peasant)
  #39 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=912dd743-41fb-44ce-8658-dd2269b252f1 (MI_Hair_1)
  #40 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8064d3d1-ecf4-4d26-973d-32fe1835785c (MI_Hair_1)
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #51 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=14ae32f2-c5c5-401a-97b3-662d7c172ff9 (stockpiles_vc)
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=a5be5534-ec00-4e9e-b8d1-571bd0c2d0ef
  #53 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=95a77f31-ed36-413d-a5e9-53c583794bfd (Handle)
  #54 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a221961e-40ab-4879-9ab8-e98b8d4ade31 (DarkGreen)
  #55 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8ec86975-99f7-4540-8f2b-2a0732248b13 (Pond_Pack_MAT)
  #56 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=62db7e44-9a72-4cec-a09e-847572f27cde (PathRocks)
  #57 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #72 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #73 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #74 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #25=df7c703d, #26=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #25=236b3b0b, #26=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #25=(unset), #26=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=d3fd7a87, #15=e4cbf8ca, #16=6db98a06, #17=f3a1039e, #18=c5e73b05, #19=13a74ec7, #20=9dcf1cb4, #21=12873951, #22=fc941d05, #23=e551c572, #24=e37c9406, #27=d9d07622, #28=190d3a9c, #29=9dbe8ee7, #30=54e03756, #31=7bb77142, #33=fd8301ed, #34=140c5e62, #35=eb2eade3, #36=c8a982c1, #37=ee59055a, #38=842fe1df, #39=ac268392, #40=1c179521, #51=a64d124e, #52=94297e69, #53=3abb47a8, #54=9434da33, #55=c3bc6325, #56=b643916d
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=2eae9a54, #15=135696d3, #16=efed8e98, #17=c7daf23, #18=d4c95125, #19=3ab4c629, #20=2d1aa4a, #21=d4c95125, #22=3ab4c629, #23=2d1aa4a, #24=c7daf23, #27=135696d3, #28=633146b4, #29=8dba9dd, #30=d391c52, #31=87728b15, #33=2f2885d5, #34=46d4b31c, #35=6eafecb9, #36=8ab73626, #37=e8d88acf, #38=34995f15, #39=25a41317, #40=71f22dc6, #51=546e469, #52=aa0735a8, #53=85d3c28d, #54=77dfd097, #55=ded4be89, #56=754b87bd
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=settlement, #18=settlement, #19=(unknown), #20=settlement, #21=settlement, #22=(unknown), #23=settlement, #24=settlement, #27=settlement, #28=settlement, #29=settlement, #30=fauna, #31=fauna, #33=fauna, #34=npc, #35=npc, #36=npc, #37=npc, #38=other, #39=other, #40=other, #51=settlement, #52=other, #53=settlement, #54=other, #55=other, #56=settlement
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=(unset), #20=, #21=, #22=(unset), #23=, #24=, #27=, #28=, #29=, #30=, #31=, #33=, #34=, #35=, #36=, #37=, #38=, #39=, #40=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0.45, #16=0, #17=0, #18=0, #19=(unknown), #20=0, #21=0, #22=(unknown), #23=0, #24=0, #27=0.45, #28=0, #29=0, #30=0, #31=0, #33=0, #34=0, #35=0, #36=0, #37=0, #38=0, #39=0, #40=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=(unknown), #20=false, #21=false, #22=(unknown), #23=false, #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=(unknown), #20=false, #21=false, #22=(unknown), #23=false, #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=true, #53=true, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=(unknown), #20=true, #21=true, #22=(unknown), #23=true, #24=true, #27=true, #28=true, #29=true, #30=true, #31=true, #33=true, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=true, #16=true, #17=false, #18=true, #19=(unknown), #20=false, #21=true, #22=(unknown), #23=false, #24=false, #27=true, #28=false, #29=true, #30=false, #31=true, #33=false, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #51=false, #52=false, #53=false, #54=false, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=true, #19=(unknown), #20=false, #21=true, #22=(unknown), #23=false, #24=false, #27=false, #28=false, #29=true, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=(unknown), #20=true, #21=false, #22=(unknown), #23=true, #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=(unknown), #20=false, #21=false, #22=(unknown), #23=false, #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=true, #36=true, #37=false, #38=true, #39=true, #40=false, #51=true, #52=false, #53=false, #54=false, #55=true, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=(unknown), #20=false, #21=false, #22=(unknown), #23=false, #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
  MeshBasicMaterial (3 programs):
    vertexShaderHash differs: #8=5efaf074, #11=d459e49b, #12=b6911298
    fragmentShaderHash differs: #8=5cf0ca9a, #11=a8a9bac3, #12=73a25d1e
    bucket differs: #8=other, #11=(unknown), #12=other
    flag alphaTest differs: #8=0, #11=(unknown), #12=0
    flag envMap differs: #8=false, #11=(unknown), #12=false
    flag fog differs: #8=true, #11=(unknown), #12=false
    flag map differs: #8=true, #11=(unknown), #12=true
    flag normalMap differs: #8=false, #11=(unknown), #12=false
    flag transparent differs: #8=true, #11=(unknown), #12=true
    flag vertexColors differs: #8=false, #11=(unknown), #12=false
    flag wireframe differs: #8=false, #11=(unknown), #12=false
  MeshPhysicalMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (10 programs):
    vertexShaderHash differs: #41=59ed5d71, #42=b69ba143, #43=2e7a6fcb, #44=585a1ea4, #45=c203b19a, #46=c203b19a, #47=585a1ea4, #48=263c45d6, #49=2efa42a8, #50=e4717b03
    fragmentShaderHash differs: #41=d729897e, #42=d729897e, #43=758a4164, #44=41e40a66, #45=41e40a66, #46=a9dd0dee, #47=a9dd0dee, #48=d729897e, #49=41e40a66, #50=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2225 (+18):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: 76b1ea5a-5e12-459a-b4eb-53fa505cda0e
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: e174788c-188f-4232-b7e9-af1339c1305d
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 01f9db61-8e83-4e50-be8d-6c6d8023af5a
    object: Mesh 'mesh_0_1'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 780f6dcc
    fragmentShaderHash: dbb99308
  Program #89
    material: MeshStandardMaterial 'Green'
    materialUuid: af27bdd7-7b14-4834-b6c8-794489646e52
    object: Mesh 'settlement-bushes-6:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: d0069e25
    fragmentShaderHash: c94ff2d5
  Program #90
    material: MeshStandardMaterial 'Berry'
    materialUuid: d8f323d3-9e09-48b5-8afa-d0dc76ac76f7
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: e1e65191-4f90-45d0-bf82-13ee8ee1f235
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: d0334cd8-9745-48c8-84be-4899fb7cb4e4
    object: Mesh 'mesh_0'
    asset: /models/nature/flower_clump_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 6d95624c
    fragmentShaderHash: 5a74547b
  Program #93
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: ad93761f-8216-4add-99cb-e8e7a5bf82c8
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: bf41fa6a-5122-40b2-95da-1fa7cc48d825
    object: Mesh 'chunk-vegetation-region-1,0|fern-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8392193,8519683,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 3858a100
    fragmentShaderHash: 4abfdd1b
  Program #95
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 14ae32f2-c5c5-401a-97b3-662d7c172ff9
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #96
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 30381e4d-0660-450b-ab5c-33970b4f308e
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #97
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: c1309be2-4cd3-4f74-bcc7-daf27c7ae2a3
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #98
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 622fa6c9-a50c-40c0-a2a3-ccc674f410ab
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #99
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 3ef3ed5f-5b4f-49cf-9c5d-1351ac42586f
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 912dd743-41fb-44ce-8658-dd2269b252f1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 8064d3d1-ecf4-4d26-973d-32fe1835785c
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #102
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #103
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: d201572f-d196-4e2f-bd99-6ef5e66bfc2e
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2507 (+22):
  Program #109
    material: ShaderMaterial 'SkyShader'
    materialUuid: 37b0dd76-9d71-4af6-bcbb-3763560d5d1d
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #110
    material: ShaderMaterial ''
    materialUuid: 8fa755fa-20fa-4231-a0df-25efafd7528d
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #111
    material: MeshStandardMaterial ''
    materialUuid: 76b1ea5a-5e12-459a-b4eb-53fa505cda0e
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #112
    material: MeshStandardMaterial 'Wood'
    materialUuid: e174788c-188f-4232-b7e9-af1339c1305d
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #113
    material: MeshStandardMaterial 'Green'
    materialUuid: 01f9db61-8e83-4e50-be8d-6c6d8023af5a
    object: Mesh 'mesh_0_1'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 80917d5e
    fragmentShaderHash: 3414bdd9
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: af27bdd7-7b14-4834-b6c8-794489646e52
    object: Mesh 'settlement-bushes-6:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: c0d790d1
    fragmentShaderHash: 3aaee6d6
  Program #115
    material: MeshStandardMaterial 'Berry'
    materialUuid: d8f323d3-9e09-48b5-8afa-d0dc76ac76f7
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #116
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: e1e65191-4f90-45d0-bf82-13ee8ee1f235
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #117
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: d0334cd8-9745-48c8-84be-4899fb7cb4e4
    object: Mesh 'mesh_0'
    asset: /models/nature/flower_clump_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 5641a2de
    fragmentShaderHash: ac9d73ac
  Program #118
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: ad93761f-8216-4add-99cb-e8e7a5bf82c8
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #119
    material: MeshStandardMaterial 'Leaves'
    materialUuid: bf41fa6a-5122-40b2-95da-1fa7cc48d825
    object: Mesh 'chunk-vegetation-region-1,0|fern-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8392193,8520707,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 984eda2a
    fragmentShaderHash: d65a968c
  Program #120
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 14ae32f2-c5c5-401a-97b3-662d7c172ff9
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #121
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: c1309be2-4cd3-4f74-bcc7-daf27c7ae2a3
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #122
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 622fa6c9-a50c-40c0-a2a3-ccc674f410ab
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #123
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 3ef3ed5f-5b4f-49cf-9c5d-1351ac42586f
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 912dd743-41fb-44ce-8658-dd2269b252f1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 8064d3d1-ecf4-4d26-973d-32fe1835785c
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #126
    material: ShaderMaterial ''
    materialUuid: 3d2071e6-6511-4abb-aae0-9cb80ae9f9b9
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #127
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #128
    material: MeshBasicMaterial ''
    materialUuid: 99c9b3f4-ab13-4724-a551-5eec994149a1
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #129
    material: ShaderMaterial ''
    materialUuid: 8cdcd796-88be-4676-b676-011865b8306d
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #130
    material: ShaderMaterial ''
    materialUuid: 59a99c05-866c-492d-9b1a-613bcf4cdb4a
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7

---

[Seedvale Program Compile Cost]

No isolated per-program GPU compile/link timer exists in the public Three.js/WebGL API without patching internals (out of scope here). Each number below is the wall-clock duration of the renderer.render() call (mirror-render/postprocess-render) that first-used the program, reported ONLY when that program was the single new program created during that specific call — an upper bound that also includes the rest of that call's render cost, not an isolated compile/link timer.
Excluded — no reliable per-program timing: 120 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 77
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 13.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 85
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 11.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 441
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 45.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 460
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 38.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 489
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 35.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 518
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 24.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 576
  #81
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 22.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 590
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 15.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 754
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 10.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 1049
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 52.7 ms  (upper bound — whole mirror-render call, see note above)

Frame 1173
  #85
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 21.2 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 292.2 ms
  programs >1 ms: 11
  max: 52.7 ms (#84)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.0 ms  p95=6.9 ms  max=11.3 ms  Δavg vs baseline=—
  hide-grass           avg=5.7 ms  p95=6.6 ms  max=7.3 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-vegetation      avg=5.2 ms  p95=6.1 ms  max=7.1 ms  Δavg vs baseline=-0.8 ms (-14%)
  no vegetation/grass  avg=4.9 ms  p95=5.6 ms  max=5.9 ms  Δavg vs baseline=-1.1 ms (-19%)
  hide-environment     avg=5.9 ms  p95=7.0 ms  max=7.2 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-settlement      avg=5.6 ms  p95=6.9 ms  max=8.0 ms  Δavg vs baseline=-0.4 ms (-7%)
  no water             avg=6.0 ms  p95=7.2 ms  max=7.8 ms  Δavg vs baseline=-0.0 ms (-1%)
  hide-terrain         avg=5.7 ms  p95=6.6 ms  max=6.7 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-npc-fauna       avg=5.3 ms  p95=5.9 ms  max=5.9 ms  Δavg vs baseline=-0.7 ms (-12%)
  no-shadows           avg=5.7 ms  p95=6.5 ms  max=7.0 ms  Δavg vs baseline=-0.4 ms (-6%)
  no-ao                avg=5.8 ms  p95=6.6 ms  max=7.2 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-bloom             avg=5.8 ms  p95=6.7 ms  max=7.1 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-smaa              avg=5.9 ms  p95=7.2 ms  max=7.7 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-god-rays          avg=5.9 ms  p95=6.9 ms  max=7.0 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-film-grade        avg=6.1 ms  p95=7.3 ms  max=7.5 ms  Δavg vs baseline=+0.0 ms (+1%)
  no postprocessing    avg=5.8 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=-0.3 ms (-4%)
  no mirrors           avg=6.0 ms  p95=6.8 ms  max=8.3 ms  Δavg vs baseline=-0.0 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=14.1 ms  p95=15.7 ms  max=16.3 ms
  CPU wall      avg=6.0 ms  p95=6.9 ms  max=11.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
