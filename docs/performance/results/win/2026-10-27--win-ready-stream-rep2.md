# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:44:20.708Z
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
Frames: 1291
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-43-28-766Z-8ea4pr
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
  camera: pos=(426.7, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5170ms npc=20
  gpuTimer: available=true resolved=true samples=1301 span=postprocess+labels

FPS:
  avg: 54.2
  min: 5
  p1: 17

Frame time (wall-clock):
  avg: 18.5 ms
  p50: 16.4 ms
  p95: 26.3 ms
  p99: 59.4 ms
  max: 219.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.3 p95=8.4 p99=40.7 max=108.2 n=1291
  render: p50=11 p95=17.8 p99=23.9 max=210 n=1291
  frame: p50=16.4 p95=26.3 p99=59.4 max=219.2 n=1291

Rendering (combined renderer.info):
  draw calls: 915 avg / 2109 max
  triangles: 10.45M avg
  mirror draws: 162 avg
  geometries: 752
  textures: 669

Pass submissions (actual):
  reliability: observed
  frames: 1302 shadowRefresh=549 shadowSkipped=753
  mirror calls avg: 161
  shadow calls avg: 296
  main calls avg: 611

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=60 tris=1.18M meshes=60 inst=124577
  vegetation       draws=219 tris=1.48M meshes=219 inst=934
  environment      draws=135 tris=29.1k meshes=135 inst=151
  settlement       draws=688 tris=671.5k meshes=688 inst=1192
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=180 tris=221.8k meshes=180 inst=180
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=368 tris=32.3k meshes=368 inst=368
  other            draws=229 tris=25.8k meshes=229 inst=229

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=201 tris=1.44M meshes=201 inst=902
  environment      draws=134 tris=29.1k meshes=134 inst=150
  settlement       draws=428 tris=478.1k meshes=428 inst=895
  items            draws=44 tris=25.5k meshes=44 inst=44
  other            draws=101 tris=14.4k meshes=101 inst=101

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=67 tris=43.7k meshes=67 inst=379
  houseInteractive draws=18 tris=2.8k meshes=18 inst=18
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=18 tris=8.0k meshes=18 inst=18
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
      Peasant          agents=10 draws=90 tris=110.6k skinned=90/90
      Peasant_Boots    agents=3 draws=27 tris=35.4k skinned=27/27
      Wizard           agents=2 draws=24 tris=23.9k skinned=24/24
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Herbalist        agents=1 draws=10 tris=14.2k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      far  agents=19 camera-relevant=0 draws=180 tris=221.8k
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
  WATER          2.3 ms
  STREAMING      0.7 ms
  NPC            1.3 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         9.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  STREAMING: 2
  WATER: 1

Hitches (>= 8 ms): total=3
  chunk mesh             n=2 avg=14.7 max=17.9
  chunk water            n=1 avg=8.7 max=8.7

Isolation probes:
  full               render=6.7 ms draws=378 tris=6.09M
  hide-grass         render=6.4 ms draws=339 tris=4.84M
  hide-vegetation    render=5.9 ms draws=246 tris=4.31M
  hide-vegetation-grass render=5.6 ms draws=219 tris=3.26M
  hide-environment   render=6.6 ms draws=357 tris=6.08M
  hide-settlement    render=6.1 ms draws=358 tris=6.07M
  hide-water         render=6.7 ms draws=357 tris=5.05M
  hide-terrain       render=6.3 ms draws=348 tris=3.85M
  hide-npc-fauna     render=4.8 ms draws=287 tris=5.95M
  no-shadows         render=6.5 ms draws=359 tris=5.72M
  no-ao              render=6.6 ms draws=368 tris=6.03M
  no-bloom           render=7.0 ms draws=361 tris=6.03M
  no-smaa            render=6.9 ms draws=371 tris=6.03M
  no-god-rays        render=6.7 ms draws=378 tris=6.09M
  no-film-grade      render=6.7 ms draws=375 tris=6.01M
  no-postprocessing  render=6.5 ms draws=351 tris=6.03M
  no-reflections     render=6.8 ms draws=309 tris=5.10M

Frame attribution:
  frame max: 219.2 ms
  largest labelled hitch: 17.9 ms
  unattributed: 201.3 ms

Long frames:
  threshold: 80 ms
  count: 9
  worst: 219.2 ms

Raw sidecar:
  sampling=full factor=1 exported=1291/1291

Recommendation:
Largest frame (219.2 ms) is not explained by labelled hitches (largest 17.9 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (7.5 ms cumulative)
  agent updates: 0.7 ms/frame (924.9 ms cumulative)
  livestock: 0.2 ms/frame (302.7 ms cumulative)
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
    update calls/frame: 16.0
    unique animals/frame: 15.8
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.5
    dog guard scans: 3.5/frame (28.3 predator candidates/frame)
    pest scans: 1.0/frame (1.0 rat candidates/frame)
    nearest scans: 4.5/frame (0.0 candidates/frame)
    water samples: 7.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 7.9/frame, 0.00 ms/frame (worst call 0.10 ms, 535.1 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 15.9
    behaviour executions/frame: 4.5
    presentation executions/frame: 3.8
  rats: 0.1 ms/frame (98.8 ms cumulative)
  social: 0.0 ms/frame (2.5 ms cumulative)
  streaming: 0.1 ms/frame (193.6 ms cumulative)
  maintenance: 0.1 ms/frame (131.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.2 ms/frame (1524.8 ms cumulative)
  forest sampling: 0.1 ms/frame (86.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (19.1 ms cumulative)
    targeting: 0.0 ms/frame (14.0 ms cumulative)
    decision: 0.0 ms/frame (13.0 ms cumulative)
    behaviour: 0.8 ms/frame (981.7 ms cumulative)
    life/presentation: 0.3 ms/frame (325.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.3
    expensive behaviour agents/frame: 13.9
    full-rate agents/frame: 7.4
    reduced-cadence agents/frame: 22.9
    behaviour executions/frame: 14.2
    presentation executions/frame: 13.0

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 29.5
    village scan candidates/frame: 321.2
    player perception checks/frame: 30.3

  nearest scans: 19.7/frame (25407 calls)
  nearest candidates checked: 123.0/frame (158830 total)
  herd leader scans: 0.1/frame (175 calls)
  herd candidates checked: 4.1/frame (5250 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 17.5/frame (111.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 67.1/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 67.1/frame, 0.10 ms/frame (worst call 0.80 ms, 4158.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.42 ms
    max 3.40 ms

  allocation/setup:
    avg 0.35 ms
    max 3.30 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.04 ms
    max 0.60 ms
  scene attach (`scene.add`):
    avg 0.02 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.56 ms
    max 3.50 ms

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
    allocation/setup avg/max: 0.31 / 3.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.03 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 19/19
    instances: 1884833 (max 184184)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=682989 filler=1453414
Submitted instances: full=87100 filler=37465
Meshes submitted: 48
LOD submitted fraction: full=0.127527676141197 filler=0.025777238969763604
Flowers: unavailable
Allocation bytes (estimated): 205094688
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=25 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1302
Shadow refresh frames: 549
Shadow skipped frames: 753

Mirror:
  calls avg: 161  tris avg: 875860
  info calls avg: 161  residual calls avg: 0
  environment                  calls=4 tris=3917
  items                        calls=1 tris=495
  other                        calls=30 tris=4895
  settlement:decor             calls=7 tris=16307
  settlement:fence             calls=1 tris=2278
  settlement:fireCampfire      calls=2 tris=171
  settlement:fireHouseExteriorLamp calls=14 tris=1001
  settlement:fireHouseInteriorLamp calls=2 tris=173
  settlement:fireVillageTorch  calls=7 tris=486
  settlement:houseInteractive  calls=5 tris=530
  settlement:houseStatic       calls=12 tris=10810
  settlement:landmarkGarden    calls=2 tris=22052
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=651
  settlement:landmarkWellHousehold calls=2 tris=2214
  settlement:landmarkWellPasture calls=2 tris=618
  settlement:other             calls=3 tris=62
  settlement:storageBarrel     calls=3 tris=4033
  settlement:storageContainer  calls=10 tris=742
  settlement:storageGoods      calls=13 tris=2610
  settlement:storageHay        calls=0 tris=168
  settlement:storageTrough     calls=2 tris=504
  settlement:storageWoodHousehold calls=3 tris=1452
  settlement:storageWoodSettlementPrimary calls=1 tris=324
  settlement:workplace         calls=3 tris=1288
  terrain                      calls=5 tris=402637
  vegetation                   calls=24 tris=395600

Shadow (refresh only):
  calls avg: 296  tris avg: 2227843
  info calls avg: 296  residual calls avg: 0
  environment                  calls=11 tris=5885
  faunaFamily:boar             calls=3 tris=1501
  faunaFamily:cow              calls=2 tris=692
  faunaFamily:horse            calls=2 tris=429
  faunaFamily:rabbit           calls=1 tris=622
  faunaFamily:rat              calls=1 tris=1109
  faunaFamily:sheep            calls=0 tris=48
  faunaFamily:stag             calls=6 tris=3570
  items                        calls=4 tris=2083
  npcFamily:Knight_Cloth       calls=3 tris=3572
  npcFamily:Peasant_Boots      calls=1 tris=1058
  npcFamily:Wizard             calls=3 tris=3381
  npcFamily:woodcutter         calls=1 tris=1061
  other                        calls=50 tris=11141
  settlement:decor             calls=98 tris=196078
  settlement:fireHouseInteriorLamp calls=1 tris=115
  settlement:houseInteractive  calls=2 tris=344
  settlement:houseStatic       calls=14 tris=6425
  settlement:landmarkGarden    calls=1 tris=468
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1092
  settlement:other             calls=4 tris=74
  settlement:storageContainer  calls=5 tris=496
  settlement:storageHay        calls=1 tris=264
  settlement:storageTrough     calls=1 tris=262
  settlement:storageWoodHousehold calls=2 tris=930
  settlement:storageWoodSettlementPrimary calls=1 tris=482
  settlement:workplace         calls=2 tris=1964
  terrain                      calls=19 tris=1364817
  vegetation                   calls=56 tris=617860

Main:
  calls avg: 611  tris avg: 8598739
  info calls avg: 750  residual calls avg: 0
  environment                  calls=44 tris=12419
  faunaFamily:bear             calls=1 tris=630
  faunaFamily:chicken          calls=6 tris=718
  faunaFamily:cow              calls=0 tris=132
  faunaFamily:dog              calls=10 tris=3481
  faunaFamily:horse            calls=0 tris=20
  faunaFamily:rabbit           calls=0 tris=114
  faunaFamily:rat              calls=1 tris=2888
  faunaFamily:sheep            calls=4 tris=1219
  faunaFamily:stag             calls=0 tris=232
  faunaFamily:wolf             calls=1 tris=634
  grass                        calls=34 tris=5432473
  items                        calls=44 tris=5040
  npcFamily:Herbalist          calls=0 tris=386
  npcFamily:Knight_Cloth       calls=13 tris=13884
  npcFamily:Peasant            calls=51 tris=54844
  npcFamily:Peasant_Boots      calls=26 tris=28027
  npcFamily:Wizard             calls=14 tris=13117
  npcFamily:blacksmith         calls=7 tris=8112
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=78 tris=14498
  settlement:decor             calls=12 tris=29295
  settlement:fence             calls=3 tris=4564
  settlement:fireCampfire      calls=4 tris=337
  settlement:fireHouseExteriorLamp calls=29 tris=1991
  settlement:fireHouseInteriorLamp calls=3 tris=348
  settlement:fireVillageTorch  calls=14 tris=975
  settlement:houseInteractive  calls=10 tris=1059
  settlement:houseStatic       calls=22 tris=19620
  settlement:landmarkGarden    calls=4 tris=42955
  settlement:landmarkNoticeBoard calls=1 tris=26
  settlement:landmarkWellCentral calls=4 tris=1357
  settlement:landmarkWellHousehold calls=4 tris=4349
  settlement:landmarkWellPasture calls=3 tris=1235
  settlement:other             calls=7 tris=123
  settlement:storageBarrel     calls=5 tris=8069
  settlement:storageContainer  calls=20 tris=1483
  settlement:storageGoods      calls=25 tris=5232
  settlement:storageHay        calls=1 tris=329
  settlement:storageTrough     calls=3 tris=1011
  settlement:storageWoodHousehold calls=7 tris=2896
  settlement:storageWoodSettlementPrimary calls=1 tris=640
  settlement:workplace         calls=6 tris=2589
  terrain                      calls=22 tris=1632054
  vegetation                   calls=54 tris=798623
  water                        calls=7 tris=441500


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 9
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 9 total):

[LONG FRAME] 219.2ms
simulate         8.2ms
render         210.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          193.0ms
STREAMING        0.6ms
NPC              1.5ms
FAUNA            1.0ms
PHYSICS          0.0ms
RENDER          17.0ms
OTHER            6.1ms

streaming / stages:
  chunkUpdate                  0.6ms
  terrainPrepare               0.3ms
  riverChannelSegmentsNear     0.1ms

Long frame #2:

[LONG FRAME] 201.5ms
simulate         7.0ms
render         193.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       16.4ms
NPC              1.5ms
FAUNA            1.3ms
PHYSICS          0.1ms
RENDER         193.8ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              7.8ms
  waterFinalize                7.0ms
  contentFinalize              1.3ms
  chunkFinalize                1.3ms
  chunkUpdate                  1.3ms
  riverFinalize                0.1ms

Long frame #3:

[LONG FRAME] 180.7ms
simulate         4.1ms
render         175.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          168.2ms
STREAMING        0.0ms
NPC              0.5ms
FAUNA            0.6ms
PHYSICS          0.0ms
RENDER           7.7ms
OTHER            3.7ms

Long frame #4:

[LONG FRAME] 122.3ms
simulate       108.2ms
render          13.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.7ms
STREAMING        0.0ms
NPC            104.7ms
FAUNA            0.4ms
PHYSICS          0.1ms
RENDER           9.1ms
OTHER            3.3ms

streaming / stages:
  riverTileBuild               74.3ms
  terrainPrepare               5.0ms
  riverChannelSegmentsNear     0.2ms

Long frame #5:

[LONG FRAME] 101ms
simulate        92.8ms
render           8.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            2.4ms
STREAMING        0.0ms
NPC             88.3ms
FAUNA            0.5ms
PHYSICS          0.1ms
RENDER           5.8ms
OTHER            3.9ms

streaming / stages:
  riverTileBuild               75.0ms
  terrainPrepare               4.6ms
  riverChannelSegmentsNear     0.6ms

---

[Seedvale Program Census]

Programs created: 133
Program count: final=133 max=133

By frame:
  frame 0   +77 programs   <== largest transition
  frame 33   +1 program
  frame 331   +2 programs
  frame 341   +1 program
  frame 357   +1 program
  frame 369   +1 program
  frame 443   +1 program
  frame 452   +1 program
  frame 590   +1 program
  frame 894   +1 program
  frame 2012   +16 programs
  frame 2013   +3 programs
  frame 2059   +4 programs
  frame 2292   +23 programs

Largest transition — frame 0 (+77 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ca50bb57-4ec7-4d9f-90f0-57e24767161a (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=20901cd4-3240-4f00-a329-951bd891783c
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=149dfc40-470c-4a1b-86a3-3e8d60dba115
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6cc84468-a221-44a9-b35a-8b1bdd0d8a83
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7611afca-34be-4f68-a092-c851d870a1ea
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7823d528-e613-4c25-a45a-4659f24f961e
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fd27619a-bd63-4b5a-affb-88c12c362586
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=61b94e6b-181c-4b62-b2f0-96862b501011
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=95dab7b8-f34c-4e1f-b4e7-a819f680f4c4
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=31c579c6-042b-4684-bbbc-112498c54325 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=67139abe-f60f-4d30-b0fe-84651296f805
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=afcdbafb-d902-46a3-bf1a-f74fe6fa1d1f (Green)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cf221007-5e7b-4b74-a4de-d8049eaef8de (Pink)
  #15 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e10af3d3-2ebc-4a1b-9f59-c99629802996 (Flowers)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3e82cbbd-9f51-4846-8a4b-6b69e1db8e52 (Stone)
  #17 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b9ad0666-2191-4360-9451-b7dd66c7cfad (None)
  #18 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=709e3d17-a6f4-439b-8ccc-578b8c31023e (Wood)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=69a2ffab-5b68-4c58-821c-0de608696063 (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fd889123-2cb2-4177-af29-b5d444bf5fc3 (MI_WindowGlass)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=72860840-0e7a-47c9-884a-b85038ec9f0f (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=437fd1a6-f36a-4732-add0-7c2d8d999170 (MI_WindowGlass)
  #25 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #26 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #27 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ee6099c5-6719-4d17-be47-09c939c7c97d (MapleTree_Leaves)
  #28 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9cec4d2d-c23a-4f46-b09d-ba4a0a006c20 (Green)
  #29 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=808fe833-a0e9-4384-af22-e88f6e5d8a5c (MapleTree_Bark)
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fc53dc50-9275-4c50-b290-1e00a8558fe6 (Main)
  #31 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=358c7ec6-37f7-4b9b-b01a-57fb5ed620bc (lambert2SG)
  #32 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=88de1060-b1d8-4e42-a0d8-9d1e7748c913 (Material #55)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2e5679cf-b65f-47fe-a415-2b1737dfa4ed (Main)
  #34 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fad386cd-97cd-49bd-a0d8-d3eea8e8cc04 (MI_Knight)
  #35 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=81f33405-e5ff-4eb4-8f39-e2ef70ef6d48 (MI_Knight)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ec36602d-3100-4d04-a044-366df6c7fc80 (MI_Hair_1)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f4745e05-a346-4280-87ad-16000d40dd2d (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bfc22142-b4a6-46e5-abe9-3e83e2b1c958 (MI_Peasant)
  #39 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2f37a5e3-48de-42a5-9b5f-9c695e95c34b (MI_Hair_1)
  #40 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0f2312d4-3bde-4998-bc87-cb2c08b2dc71 (MI_Hair_1)
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
  #51 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=99f83b55 fHash=41e40a66 stage=postprocess-render
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=67bae7bc-a01a-4ce3-aa81-6dfa34201967
  #53 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c4a75591-87bc-48f2-9467-4a865c943f50 (Handle)
  #54 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f81852e1-fdc4-4e42-99b7-61de92ce9c18 (DarkGreen)
  #55 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9ce78cc5-cb7c-4ef1-b958-7a5cb6f3b141 (Pond_Pack_MAT)
  #56 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c583b220-65d4-48b5-8e02-36a7bea24330 (PathRocks)
  #57 type=MeshStandardMaterial name='SV_apron' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=8af563d4 fHash=b83d9cc3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c119c327-ca73-4afd-ad2a-14f9dfbbbf53 (SV_apron)
  #58 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=4418a548 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f6e91d86-59f5-4786-b825-f00064a345c7 (SV_MI_Peasant)
  #59 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #72 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #73 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #74 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #75 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #76 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #25=df7c703d, #26=f92c8d8c, #59=279cec18, #60=84736a68, #61=aa2edbee, #62=7bae0bb2, #63=436caea4, #64=886438e7, #65=d99a5b29, #66=2003ced8, #67=28dfa407, #68=756a0b19, #69=b2354ff2, #70=ea82969e, #71=7dab8d9a, #72=378e1fb7, #73=78acf7ea, #74=a312c579, #75=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #25=236b3b0b, #26=87d053eb, #59=4d6bcede, #60=ffecb62a, #61=76ced00a, #62=fb55b3c0, #63=2d687ef1, #64=dc2a89b5, #65=109e33fc, #66=db0f470a, #67=9775cd0e, #68=5c741650, #69=2aad9943, #70=a2297d9f, #71=1022767b, #72=ce0bf6b4, #73=707f290c, #74=c05e2256, #75=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #25=(unset), #26=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
  MeshStandardMaterial (35 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=d3fd7a87, #15=e4cbf8ca, #16=a9733c9d, #17=6db98a06, #18=f3a1039e, #19=c5e73b05, #20=13a74ec7, #21=9dcf1cb4, #22=12873951, #23=fc941d05, #24=e551c572, #27=d9d07622, #28=190d3a9c, #29=9dbe8ee7, #30=54e03756, #31=7bb77142, #33=fd8301ed, #34=140c5e62, #35=eb2eade3, #36=c8a982c1, #37=ee59055a, #38=842fe1df, #39=ac268392, #40=1c179521, #52=94297e69, #53=3abb47a8, #54=9434da33, #55=c3bc6325, #56=b643916d, #57=8af563d4, #58=4418a548
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=2eae9a54, #15=135696d3, #16=bd723c8a, #17=efed8e98, #18=c7daf23, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #27=135696d3, #28=633146b4, #29=8dba9dd, #30=d391c52, #31=87728b15, #33=2f2885d5, #34=46d4b31c, #35=6eafecb9, #36=8ab73626, #37=e8d88acf, #38=34995f15, #39=25a41317, #40=71f22dc6, #52=aa0735a8, #53=85d3c28d, #54=77dfd097, #55=ded4be89, #56=754b87bd, #57=b83d9cc3, #58=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=environment, #18=settlement, #19=settlement, #20=(unknown), #21=settlement, #22=settlement, #23=(unknown), #24=settlement, #27=settlement, #28=settlement, #29=settlement, #30=fauna, #31=fauna, #33=fauna, #34=npc, #35=npc, #36=npc, #37=npc, #38=other, #39=other, #40=other, #52=other, #53=settlement, #54=other, #55=other, #56=settlement, #57=npc, #58=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=(unset), #21=, #22=, #23=(unset), #24=, #27=, #28=, #29=, #30=, #31=, #33=, #34=, #35=, #36=, #37=, #38=, #39=, #40=, #52=, #53=, #54=, #55=, #56=, #57=, #58=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0.45, #16=0, #17=0, #18=0, #19=0, #20=(unknown), #21=0, #22=0, #23=(unknown), #24=0, #27=0.45, #28=0, #29=0, #30=0, #31=0, #33=0, #34=0, #35=0, #36=0, #37=0, #38=0, #39=0, #40=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #52=true, #53=true, #54=false, #55=false, #56=false, #57=false, #58=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=(unknown), #21=true, #22=true, #23=(unknown), #24=true, #27=true, #28=true, #29=true, #30=true, #31=true, #33=true, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=true, #16=false, #17=true, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=true, #28=false, #29=true, #30=false, #31=true, #33=false, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #52=false, #53=false, #54=false, #55=true, #56=true, #57=false, #58=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=false, #29=true, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=true, #22=false, #23=(unknown), #24=true, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=true, #36=true, #37=false, #38=true, #39=true, #40=false, #52=false, #53=false, #54=false, #55=true, #56=false, #57=false, #58=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
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
  MeshDepthMaterial (11 programs):
    vertexShaderHash differs: #41=59ed5d71, #42=b69ba143, #43=2e7a6fcb, #44=585a1ea4, #45=c203b19a, #46=c203b19a, #47=585a1ea4, #48=263c45d6, #49=2efa42a8, #50=e4717b03, #51=99f83b55
    fragmentShaderHash differs: #41=d729897e, #42=d729897e, #43=758a4164, #44=41e40a66, #45=41e40a66, #46=a9dd0dee, #47=a9dd0dee, #48=d729897e, #49=41e40a66, #50=41e40a66, #51=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2012 (+16):
  Program #87
    material: MeshStandardMaterial ''
    materialUuid: 149dfc40-470c-4a1b-86a3-3e8d60dba115
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #88
    material: MeshStandardMaterial 'Wood'
    materialUuid: a093b01c-4cd8-4db3-add3-da4736d062be
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #89
    material: MeshStandardMaterial 'Green'
    materialUuid: 275d25d6-4e53-4264-bb91-a44200822fc6
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
  Program #90
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: ca49f204-7310-43e8-ae3e-c5306f81468d
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #91
    material: MeshStandardMaterial 'Green'
    materialUuid: a9c0a1e6-68e7-49b8-85c9-602b5a5ba845
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
  Program #92
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 808fe833-a0e9-4384-af22-e88f6e5d8a5c
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #93
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: e10af3d3-2ebc-4a1b-9f59-c99629802996
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
  Program #94
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: e96799cd-60ee-41ee-a319-0e07025617d2
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #95
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 48366707-2660-4c16-8ca6-b822a08d5cfe
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
  Program #96
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 0db98955-e993-4c94-808c-a1c269559e42
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 6dca5013-1805-417b-b94c-113198a21444
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: bfc22142-b4a6-46e5-abe9-3e83e2b1c958
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 2f37a5e3-48de-42a5-9b5f-9c695e95c34b
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 0f2312d4-3bde-4998-bc87-cb2c08b2dc71
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: a1b0b384-c11d-4eca-a707-8c94bcbe6e2b
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 338ac55c
    fragmentShaderHash: 33d9f19
  Program #102
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: f6e91d86-59f5-4786-b825-f00064a345c7
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521827,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 6c2cf752
    fragmentShaderHash: ebeca779

Frame 2292 (+23):
  Program #110
    material: ShaderMaterial 'SkyShader'
    materialUuid: ca50bb57-4ec7-4d9f-90f0-57e24767161a
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #111
    material: ShaderMaterial ''
    materialUuid: fd27619a-bd63-4b5a-affb-88c12c362586
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #112
    material: MeshStandardMaterial ''
    materialUuid: 149dfc40-470c-4a1b-86a3-3e8d60dba115
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #113
    material: MeshStandardMaterial 'Wood'
    materialUuid: a093b01c-4cd8-4db3-add3-da4736d062be
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: 275d25d6-4e53-4264-bb91-a44200822fc6
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
  Program #115
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: ca49f204-7310-43e8-ae3e-c5306f81468d
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: a9c0a1e6-68e7-49b8-85c9-602b5a5ba845
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
  Program #117
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 808fe833-a0e9-4384-af22-e88f6e5d8a5c
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #118
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: e10af3d3-2ebc-4a1b-9f59-c99629802996
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
  Program #119
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: e96799cd-60ee-41ee-a319-0e07025617d2
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #120
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 48366707-2660-4c16-8ca6-b822a08d5cfe
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
  Program #121
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 0db98955-e993-4c94-808c-a1c269559e42
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #122
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 6dca5013-1805-417b-b94c-113198a21444
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #123
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: bfc22142-b4a6-46e5-abe9-3e83e2b1c958
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 2f37a5e3-48de-42a5-9b5f-9c695e95c34b
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 0f2312d4-3bde-4998-bc87-cb2c08b2dc71
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #126
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: a1b0b384-c11d-4eca-a707-8c94bcbe6e2b
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee59055a
    fragmentShaderHash: d88267ca
  Program #127
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: f6e91d86-59f5-4786-b825-f00064a345c7
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522851,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 4418a548
    fragmentShaderHash: c52436ea
  Program #128
    material: ShaderMaterial ''
    materialUuid: 7823d528-e613-4c25-a45a-4659f24f961e
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #129
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #130
    material: MeshBasicMaterial ''
    materialUuid: 95dab7b8-f34c-4e1f-b4e7-a819f680f4c4
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #131
    material: ShaderMaterial ''
    materialUuid: 2b597f91-e260-49b6-b034-578f255d2246
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #132
    material: ShaderMaterial ''
    materialUuid: 3d761a05-b83c-4f0a-b6f9-84e3e56854c5
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
Excluded — no reliable per-program timing: 125 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 33
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 21.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 341
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 26.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 357
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 15.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 369
  #82
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 14.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 443
  #83
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 191.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 452
  #84
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 191.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 590
  #85
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 13.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 894
  #86
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 167.3 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 640.8 ms
  programs >1 ms: 8
  max: 191.6 ms (#83)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.7 ms  p95=7.4 ms  max=8.3 ms  Δavg vs baseline=—
  hide-grass           avg=6.4 ms  p95=7.2 ms  max=7.8 ms  Δavg vs baseline=-0.3 ms (-4%)
  hide-vegetation      avg=5.9 ms  p95=6.8 ms  max=7.0 ms  Δavg vs baseline=-0.8 ms (-12%)
  no vegetation/grass  avg=5.6 ms  p95=6.3 ms  max=6.5 ms  Δavg vs baseline=-1.1 ms (-16%)
  hide-environment     avg=6.6 ms  p95=7.7 ms  max=8.9 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-settlement      avg=6.1 ms  p95=6.9 ms  max=7.1 ms  Δavg vs baseline=-0.6 ms (-9%)
  no water             avg=6.7 ms  p95=7.7 ms  max=8.2 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-terrain         avg=6.3 ms  p95=7.0 ms  max=7.3 ms  Δavg vs baseline=-0.4 ms (-6%)
  hide-npc-fauna       avg=4.8 ms  p95=5.5 ms  max=5.9 ms  Δavg vs baseline=-1.9 ms (-28%)
  no-shadows           avg=6.5 ms  p95=7.3 ms  max=8.8 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-ao                avg=6.6 ms  p95=7.5 ms  max=7.8 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-bloom             avg=7.0 ms  p95=8.1 ms  max=8.4 ms  Δavg vs baseline=+0.3 ms (+5%)
  no-smaa              avg=6.9 ms  p95=8.0 ms  max=8.2 ms  Δavg vs baseline=+0.1 ms (+2%)
  no-god-rays          avg=6.7 ms  p95=7.5 ms  max=7.8 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-film-grade        avg=6.7 ms  p95=7.6 ms  max=7.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=6.5 ms  p95=7.4 ms  max=8.1 ms  Δavg vs baseline=-0.2 ms (-4%)
  no mirrors           avg=6.8 ms  p95=7.3 ms  max=8.0 ms  Δavg vs baseline=+0.1 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=11.1 ms  p95=12.3 ms  max=12.9 ms
  CPU wall      avg=6.7 ms  p95=7.4 ms  max=8.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
