# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:38:15.931Z
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
Frames: 1416
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-37-23-465Z-k5cogf
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
  camera: pos=(426.9, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5010ms npc=20
  gpuTimer: available=true resolved=true samples=1424 span=postprocess+labels

FPS:
  avg: 61.3
  min: 3
  p1: 20

Frame time (wall-clock):
  avg: 16.3 ms
  p50: 14.9 ms
  p95: 24.8 ms
  p99: 49.7 ms
  max: 300.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.3 p95=7.4 p99=11.1 max=88.6 n=1416
  render: p50=11 p95=18.8 p99=26.2 max=294.7 n=1416
  frame: p50=14.9 p95=24.8 p99=49.7 max=300.2 n=1416

Rendering (combined renderer.info):
  draw calls: 867 avg / 2038 max
  triangles: 10.59M avg
  mirror draws: 155 avg
  geometries: 734
  textures: 578

Pass submissions (actual):
  reliability: observed
  frames: 1427 shadowRefresh=582 shadowSkipped=845
  mirror calls avg: 155
  shadow calls avg: 305
  main calls avg: 569

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=46 tris=1.14M meshes=46 inst=117724
  vegetation       draws=199 tris=1.32M meshes=199 inst=841
  environment      draws=127 tris=25.5k meshes=127 inst=143
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=47 tris=3.40M meshes=47 inst=47
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=338 tris=28.6k meshes=338 inst=338
  other            draws=226 tris=25.7k meshes=226 inst=226

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=183 tris=1.27M meshes=183 inst=813
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=101 tris=14.4k meshes=101 inst=101

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
  WATER          2.4 ms
  STREAMING      0.5 ms
  NPC            1.3 ms
  FAUNA          0.8 ms
  PHYSICS        0.1 ms
  RENDER         9.5 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  RENDER: 5
  STREAMING: 1
  FAUNA: 1

Hitches (>= 8 ms): total=1
  chunk mesh             n=1 avg=11.2 max=11.2

Isolation probes:
  full               render=5.9 ms draws=296 tris=6.14M
  hide-grass         render=6.0 ms draws=263 tris=5.00M
  hide-vegetation    render=5.3 ms draws=164 tris=4.40M
  hide-vegetation-grass render=5.0 ms draws=135 tris=3.34M
  hide-environment   render=6.0 ms draws=279 tris=6.19M
  hide-settlement    render=5.6 ms draws=275 tris=6.10M
  hide-water         render=6.0 ms draws=286 tris=5.24M
  hide-terrain       render=5.7 ms draws=269 tris=3.89M
  hide-npc-fauna     render=5.4 ms draws=296 tris=6.14M
  no-shadows         render=5.9 ms draws=286 tris=5.90M
  no-ao              render=6.0 ms draws=294 tris=6.21M
  no-bloom           render=6.3 ms draws=287 tris=6.21M
  no-smaa            render=6.0 ms draws=294 tris=6.13M
  no-god-rays        render=6.1 ms draws=300 tris=6.21M
  no-film-grade      render=6.7 ms draws=300 tris=6.21M
  no-postprocessing  render=6.1 ms draws=277 tris=6.21M
  no-reflections     render=6.2 ms draws=226 tris=5.14M

Frame attribution:
  frame max: 300.2 ms
  largest labelled hitch: 11.2 ms
  unattributed: 289 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 300.2 ms

Raw sidecar:
  sampling=full factor=1 exported=1416/1416

Recommendation:
Largest frame (300.2 ms) is not explained by labelled hitches (largest 11.2 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (9.5 ms cumulative)
  agent updates: 0.8 ms/frame (1097.3 ms cumulative)
  livestock: 0.2 ms/frame (323.9 ms cumulative)
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
    update calls/frame: 14.8
    unique animals/frame: 14.5
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.5 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 3.8/frame (0.0 candidates/frame)
    water samples: 4.9/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 4.9/frame, 0.00 ms/frame (worst call 0.20 ms, 375.1 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 14.4
    behaviour executions/frame: 4.0
    presentation executions/frame: 3.4
  rats: 0.1 ms/frame (101.1 ms cumulative)
  social: 0.0 ms/frame (3.7 ms cumulative)
  streaming: 0.1 ms/frame (130.2 ms cumulative)
  maintenance: 0.1 ms/frame (138.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 0.8 ms/frame
  agent updates: 0.8 ms/frame (1114.5 ms cumulative)
  forest sampling: 0.1 ms/frame (111.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.9 ms cumulative)
    targeting: 0.0 ms/frame (16.3 ms cumulative)
    decision: 0.0 ms/frame (14.5 ms cumulative)
    behaviour: 0.3 ms/frame (453.0 ms cumulative)
    life/presentation: 0.3 ms/frame (401.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.1
    full-rate agents/frame: 7.8
    reduced-cadence agents/frame: 22.4
    behaviour executions/frame: 14.1
    presentation executions/frame: 12.9

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.5
    village scan candidates/frame: 274.5
    player perception checks/frame: 30.2

  nearest scans: 20.0/frame (28370 calls)
  nearest candidates checked: 111.1/frame (157282 total)
  herd leader scans: 0.2/frame (252 calls)
  herd candidates checked: 5.3/frame (7560 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.6/frame (109.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 15.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 15.2/frame, 0.00 ms/frame (worst call 1.00 ms, 745.3 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 79
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.13 ms
    max 0.20 ms

  allocation/setup:
    avg 0.07 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.02 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.02 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.23 ms
    max 0.50 ms

  per chunk:
    instances avg/max 46638.1 / 87357
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 886124 / 0
    matrix instances bound: 886124
    instanced attributes created: 285
    shared material refs: 57
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 19/19
    instances: 332550 (max 32465)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.02 / 0.10 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.23 / 1.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 14
Resident instances: full=599200 filler=137739
Submitted instances: full=80396 filler=37327
Meshes submitted: 45
LOD submitted fraction: full=0.13417222963951936 filler=0.2709980470309789
Flowers: unavailable
Allocation bytes (estimated): 70746144
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=34 discard(unload=0,oor=0) cancel=0 streamIn=18 streamOut=25 invalidate=0
Finalization: observed completions=34

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1427
Shadow refresh frames: 582
Shadow skipped frames: 845

Mirror:
  calls avg: 155  tris avg: 890051
  info calls avg: 155  residual calls avg: 0
  environment                  calls=5 tris=3980
  items                        calls=1 tris=518
  other                        calls=32 tris=4882
  settlement:decor             calls=8 tris=19647
  settlement:fence             calls=1 tris=2195
  settlement:fireCampfire      calls=2 tris=189
  settlement:fireHouseExteriorLamp calls=5 tris=245
  settlement:fireHouseInteriorLamp calls=2 tris=184
  settlement:fireVillageTorch  calls=7 tris=509
  settlement:houseInteractive  calls=5 tris=562
  settlement:houseStatic       calls=12 tris=10818
  settlement:landmarkGarden    calls=2 tris=23475
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=692
  settlement:landmarkWellHousehold calls=2 tris=2169
  settlement:landmarkWellPasture calls=2 tris=600
  settlement:other             calls=4 tris=66
  settlement:storageBarrel     calls=3 tris=4054
  settlement:storageContainer  calls=10 tris=743
  settlement:storageGoods      calls=13 tris=2752
  settlement:storageHay        calls=0 tris=183
  settlement:storageTrough     calls=2 tris=495
  settlement:storageWoodHousehold calls=1 tris=1678
  settlement:storageWoodSettlementPrimary calls=0 tris=301
  settlement:workplace         calls=3 tris=1368
  terrain                      calls=6 tris=412256
  vegetation                   calls=24 tris=395648

Shadow (refresh only):
  calls avg: 305  tris avg: 2236034
  info calls avg: 305  residual calls avg: 0
  environment                  calls=11 tris=5565
  faunaFamily:boar             calls=0 tris=155
  faunaFamily:cow              calls=2 tris=842
  faunaFamily:horse            calls=2 tris=566
  faunaFamily:rabbit           calls=1 tris=765
  faunaFamily:rat              calls=1 tris=1225
  faunaFamily:sheep            calls=0 tris=81
  faunaFamily:stag             calls=5 tris=3128
  items                        calls=4 tris=1971
  npcFamily:Knight_Cloth       calls=3 tris=4228
  npcFamily:Peasant            calls=3 tris=3805
  npcFamily:Peasant_Boots      calls=1 tris=1175
  npcFamily:woodcutter         calls=1 tris=966
  other                        calls=53 tris=11454
  settlement:decor             calls=107 tris=214524
  settlement:fireHouseInteriorLamp calls=1 tris=125
  settlement:houseInteractive  calls=2 tris=373
  settlement:houseStatic       calls=15 tris=6748
  settlement:landmarkGarden    calls=1 tris=502
  settlement:landmarkNoticeBoard calls=1 tris=23
  settlement:landmarkWellCentral calls=3 tris=1173
  settlement:other             calls=4 tris=82
  settlement:storageContainer  calls=5 tris=525
  settlement:storageHay        calls=1 tris=296
  settlement:storageTrough     calls=1 tris=271
  settlement:storageWoodHousehold calls=1 tris=1064
  settlement:storageWoodSettlementPrimary calls=1 tris=473
  settlement:workplace         calls=2 tris=2131
  terrain                      calls=19 tris=1369767
  vegetation                   calls=54 tris=602031

Main:
  calls avg: 569  tris avg: 8759854
  info calls avg: 708  residual calls avg: 0
  environment                  calls=50 tris=13501
  faunaFamily:bear             calls=1 tris=673
  faunaFamily:chicken          calls=6 tris=803
  faunaFamily:cow              calls=1 tris=198
  faunaFamily:dog              calls=11 tris=3777
  faunaFamily:horse            calls=0 tris=72
  faunaFamily:rabbit           calls=0 tris=221
  faunaFamily:rat              calls=2 tris=3153
  faunaFamily:sheep            calls=4 tris=1253
  faunaFamily:wolf             calls=2 tris=925
  grass                        calls=37 tris=5462264
  items                        calls=47 tris=5425
  npcFamily:Farmer             calls=7 tris=11114
  npcFamily:Knight_Cloth       calls=6 tris=7535
  npcFamily:Peasant            calls=36 tris=44265
  npcFamily:Peasant_Boots      calls=6 tris=7914
  npcFamily:blacksmith         calls=7 tris=9386
  other                        calls=85 tris=14685
  settlement:decor             calls=14 tris=35696
  settlement:fence             calls=3 tris=4460
  settlement:fireCampfire      calls=5 tris=378
  settlement:fireHouseExteriorLamp calls=10 tris=500
  settlement:fireHouseInteriorLamp calls=3 tris=377
  settlement:fireVillageTorch  calls=14 tris=1040
  settlement:houseInteractive  calls=10 tris=1153
  settlement:houseStatic       calls=22 tris=19969
  settlement:landmarkGarden    calls=5 tris=46675
  settlement:landmarkNoticeBoard calls=2 tris=29
  settlement:landmarkWellCentral calls=4 tris=1457
  settlement:landmarkWellHousehold calls=4 tris=4392
  settlement:landmarkWellPasture calls=3 tris=1220
  settlement:other             calls=7 tris=133
  settlement:storageBarrel     calls=5 tris=8206
  settlement:storageContainer  calls=21 tris=1508
  settlement:storageGoods      calls=27 tris=5651
  settlement:storageHay        calls=1 tris=363
  settlement:storageTrough     calls=3 tris=1007
  settlement:storageWoodHousehold calls=1 tris=3420
  settlement:storageWoodSettlementPrimary calls=1 tris=601
  settlement:workplace         calls=6 tris=2836
  terrain                      calls=24 tris=1744062
  vegetation                   calls=56 tris=819989
  water                        calls=7 tris=467920


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

[LONG FRAME] 300.2ms
simulate         4.6ms
render         294.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.7ms
STREAMING        1.6ms
NPC              1.0ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER         289.1ms
OTHER            2.0ms

streaming / stages:
  contentFinalize              1.6ms
  chunkFinalize                1.6ms
  chunkUpdate                  1.6ms

Long frame #2:

[LONG FRAME] 261ms
simulate        48.2ms
render         211.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          200.0ms
STREAMING       42.1ms
NPC              2.2ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER          12.0ms
OTHER            3.8ms

streaming / stages:
  chunkUpdate                  42.1ms
  riverTileBuild               36.7ms
  terrainPrepare               1.1ms
  riverChannelSegmentsNear     0.2ms

Long frame #3:

[LONG FRAME] 240.2ms
simulate         6.1ms
render         233.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          222.2ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER          10.9ms
OTHER            4.9ms

Long frame #4:

[LONG FRAME] 194ms
simulate         4.6ms
render         188.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       11.1ms
NPC              1.5ms
FAUNA            0.9ms
PHYSICS          0.0ms
RENDER         188.6ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              5.2ms
  waterFinalize                4.7ms
  contentFinalize              1.0ms
  chunkFinalize                1.0ms
  chunkUpdate                  1.0ms
  riverFinalize                0.1ms

Long frame #5:

[LONG FRAME] 100.8ms
simulate        88.6ms
render          11.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC             84.3ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER          11.7ms
OTHER            3.9ms

streaming / stages:
  riverTileBuild               43.9ms
  terrainPrepare               7.2ms
  riverChannelSegmentsNear     0.4ms

---

[Seedvale Program Census]

Programs created: 130
Program count: final=129 max=129

By frame:
  frame 0   +75 programs   <== largest transition
  frame 50   +1 program
  frame 399   +1 program
  frame 452   +2 programs
  frame 533   +1 program
  frame 546   +1 program
  frame 552   +1 program
  frame 559   +1 program
  frame 713   +1 program
  frame 1006   +1 program
  frame 1128   +1 program
  frame 2206   +15 programs
  frame 2207   +3 programs
  frame 2253   +4 programs
  frame 2488   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9b626b38-5300-48c6-b7f2-d3e047b89124 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=788338cc-9749-4756-ac06-5e4fa6d1c8cc
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=d5ea7290-54a2-446d-8fc4-5077721fadf0
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=20699865-c664-4bdf-b299-79a880e42d34
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2ab0a502-5162-4279-87cc-45848bf268f2
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cb6c8c81-6ea6-4265-9123-ccc9166cf5bb
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e766b8ed-32de-4648-9b3b-8a14e40d03d1
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=4e67d987-848a-4619-8e91-311820cf2c3d
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f60016c3-6ac0-4be2-85b5-0d9c3bd74dfb
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=99daaf49-21e7-47c2-a10d-c1af2b64b67e (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=03b3b8dd-22bd-4642-b2ad-91e289565431
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3c45390c-e991-4dcd-a959-1e1f0d77c65a (Flowers)
  #14 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3404b31b-51ca-4256-93d1-06edc2ad742f (Green)
  #15 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2fbb250f-1d89-47e9-8bbb-d272b97d391c (Pink)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7ee06a21-e40c-48f6-8107-5914ac7b98d0 (Stone)
  #17 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f0353151-e9a2-4cd2-aea6-45291d0426d0 (None)
  #18 type=MeshStandardMaterial name='Wood_Light' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=16284162-d49d-43cf-968c-93b832b8f0fd (Material.001)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=ce74b6d6-94a4-4f21-8fc3-5ee29d311d33 (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e5827255-417c-4799-97a4-ddd66d9f009b (MI_WindowGlass)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=8be67d1b-0668-4d4f-abfb-9ef99f7a5ba8 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bcaaa218-3753-4c07-8bb0-e04f9988944c (MI_WindowGlass)
  #25 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #26 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #27 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8e701a72-fa14-4026-a1c0-33fdc1578d53 (Main)
  #28 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b2067202-8476-4413-a8a1-869a216775c9 (lambert2SG)
  #29 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=10b94fb1-12b4-4fee-bb29-34d6f69c6de9 (Material #55)
  #30 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fbe7dd94-d5ae-4065-a14b-ddd6551193b8 (MapleTree_Leaves)
  #31 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9897e5f2-ed98-41be-95b9-827ca9d99844 (Green)
  #32 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=bf0aa10f-9de7-4173-8c9a-c505c16915c0 (MapleTree_Bark)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c50483bd-5dca-4b01-8795-dfe476a8def0 (Main)
  #34 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a670878e-cdfb-49bc-a960-5063de851bfe (MI_Peasant)
  #35 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=085fd8f9-b25b-473d-bb57-f4ba178b9395 (MI_Hair_1)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5a55c1d8-7edc-4bbf-8b1a-7eb82da5cc38 (MI_Hair_1)
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e20adb0c-41c9-421e-8eff-759f89114320 (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=22f7dc8b-994e-436f-9f03-3573345f7ad0
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=51830221-f3cc-442a-8573-4db09fa7f3eb (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6f0f64af-5f0b-4ee5-9564-986ebf45ddb8 (DarkGreen)
  #51 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e5279b7c-587f-4300-93d9-a290b82835c4 (Pond_Pack_MAT)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=410996d8-888a-4197-b120-541ce62b3b01 (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=de824cf7-96af-4abf-ba12-5258e748505d (MI_Eyes)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=49eb67ba-2609-43e9-abd3-bcc713e79b6b (MI_Knight)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=97bbdd97-86f9-4772-bab6-02af6487b380 (SV_MI_Peasant)
  #56 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8112561b-e0ce-4305-844c-8caa9a399015 (PathRocks)
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
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=c0d790d1, #15=d3fd7a87, #16=a9733c9d, #17=6db98a06, #18=f3a1039e, #19=c5e73b05, #20=13a74ec7, #21=9dcf1cb4, #22=12873951, #23=fc941d05, #24=e551c572, #27=54e03756, #28=7bb77142, #30=d9d07622, #31=190d3a9c, #32=9dbe8ee7, #33=fd8301ed, #34=842fe1df, #35=ac268392, #36=1c179521, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=c3bc6325, #52=20daccfa, #53=1dcbc6ff, #54=1d0412b3, #55=cde317ee, #56=b643916d
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=a81023c3, #15=2eae9a54, #16=bd723c8a, #17=efed8e98, #18=c7daf23, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #27=d391c52, #28=87728b15, #30=135696d3, #31=633146b4, #32=8dba9dd, #33=2f2885d5, #34=34995f15, #35=25a41317, #36=71f22dc6, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=ded4be89, #52=a8862f4a, #53=1a1c0d8, #54=512afd6f, #55=512afd6f, #56=754b87bd
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=environment, #18=fauna, #19=settlement, #20=(unknown), #21=settlement, #22=settlement, #23=(unknown), #24=settlement, #27=fauna, #28=fauna, #30=settlement, #31=settlement, #32=settlement, #33=fauna, #34=other, #35=other, #36=other, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=other, #54=npc, #55=npc, #56=settlement
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=(unset), #21=, #22=, #23=(unset), #24=, #27=, #28=, #30=, #31=, #32=, #33=, #34=, #35=, #36=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=(unknown), #21=0, #22=0, #23=(unknown), #24=0, #27=0, #28=0, #30=0.45, #31=0, #32=0, #33=0, #34=0, #35=0, #36=0, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=(unknown), #21=true, #22=true, #23=(unknown), #24=true, #27=true, #28=true, #30=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=false, #15=false, #16=false, #17=true, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=true, #30=true, #31=false, #32=true, #33=false, #34=true, #35=true, #36=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=true, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=true, #22=false, #23=(unknown), #24=true, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=true, #35=true, #36=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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
    vertexShaderHash differs: #37=59ed5d71, #38=b69ba143, #39=2e7a6fcb, #40=585a1ea4, #41=c203b19a, #42=c203b19a, #43=585a1ea4, #44=263c45d6, #45=2efa42a8, #46=e4717b03
    fragmentShaderHash differs: #37=d729897e, #38=d729897e, #39=758a4164, #40=41e40a66, #41=41e40a66, #42=a9dd0dee, #43=a9dd0dee, #44=d729897e, #45=41e40a66, #46=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2206 (+15):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: d5ea7290-54a2-446d-8fc4-5077721fadf0
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: 54b06222-c1f9-42f2-9f82-680a19bf2139
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 1389d823-5fd4-4d77-b218-c3b9e1680292
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
    materialUuid: 77acef93-cd00-4e08-a3c2-9b385f8d8fbd
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
    materialUuid: d004540a-b239-428b-9c98-9c575dea9481
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: bf0aa10f-9de7-4173-8c9a-c505c16915c0
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3c45390c-e991-4dcd-a959-1e1f0d77c65a
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
    materialUuid: 9dd5561e-64dc-4a8c-bf55-973c4b17587a
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 4fe70b1c-ce04-4db9-95f5-9fc3138ebcb3
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
    materialUuid: e20adb0c-41c9-421e-8eff-759f89114320
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #96
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 410996d8-888a-4197-b120-541ce62b3b01
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: de824cf7-96af-4abf-ba12-5258e748505d
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: a670878e-cdfb-49bc-a960-5063de851bfe
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 085fd8f9-b25b-473d-bb57-f4ba178b9395
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 5a55c1d8-7edc-4bbf-8b1a-7eb82da5cc38
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 2488 (+22):
  Program #108
    material: ShaderMaterial 'SkyShader'
    materialUuid: 9b626b38-5300-48c6-b7f2-d3e047b89124
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #109
    material: ShaderMaterial ''
    materialUuid: e766b8ed-32de-4648-9b3b-8a14e40d03d1
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #110
    material: MeshStandardMaterial ''
    materialUuid: d5ea7290-54a2-446d-8fc4-5077721fadf0
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #111
    material: MeshStandardMaterial 'Wood'
    materialUuid: 54b06222-c1f9-42f2-9f82-680a19bf2139
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: 1389d823-5fd4-4d77-b218-c3b9e1680292
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
  Program #113
    material: MeshStandardMaterial 'Green'
    materialUuid: 77acef93-cd00-4e08-a3c2-9b385f8d8fbd
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
  Program #114
    material: MeshStandardMaterial 'Berry'
    materialUuid: d004540a-b239-428b-9c98-9c575dea9481
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #115
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: bf0aa10f-9de7-4173-8c9a-c505c16915c0
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #116
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3c45390c-e991-4dcd-a959-1e1f0d77c65a
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
  Program #117
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 9dd5561e-64dc-4a8c-bf55-973c4b17587a
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #118
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 4fe70b1c-ce04-4db9-95f5-9fc3138ebcb3
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
  Program #119
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: e20adb0c-41c9-421e-8eff-759f89114320
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #120
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 410996d8-888a-4197-b120-541ce62b3b01
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #121
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: de824cf7-96af-4abf-ba12-5258e748505d
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #122
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: a670878e-cdfb-49bc-a960-5063de851bfe
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 085fd8f9-b25b-473d-bb57-f4ba178b9395
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 5a55c1d8-7edc-4bbf-8b1a-7eb82da5cc38
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #125
    material: ShaderMaterial ''
    materialUuid: cb6c8c81-6ea6-4265-9123-ccc9166cf5bb
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #126
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #127
    material: MeshBasicMaterial ''
    materialUuid: f60016c3-6ac0-4be2-85b5-0d9c3bd74dfb
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #128
    material: ShaderMaterial ''
    materialUuid: 2f2a60b8-ea30-4a1b-a725-dc0ab5472475
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #129
    material: ShaderMaterial ''
    materialUuid: 268ccf88-ed9f-4af2-a4b6-0f7c9a2fb78c
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
Excluded — no reliable per-program timing: 121 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 50
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 25.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 399
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 39.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 533
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 24.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 546
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 198.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 552
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 18.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 559
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 185.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 713
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 19.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 1006
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 220.0 ms  (upper bound — whole mirror-render call, see note above)

Frame 1128
  #85
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 285.4 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1016.7 ms
  programs >1 ms: 9
  max: 285.4 ms (#85)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.9 ms  p95=6.5 ms  max=6.9 ms  Δavg vs baseline=—
  hide-grass           avg=6.0 ms  p95=7.1 ms  max=7.2 ms  Δavg vs baseline=+0.2 ms (+3%)
  hide-vegetation      avg=5.3 ms  p95=6.2 ms  max=6.4 ms  Δavg vs baseline=-0.6 ms (-10%)
  no vegetation/grass  avg=5.0 ms  p95=5.5 ms  max=6.6 ms  Δavg vs baseline=-0.9 ms (-15%)
  hide-environment     avg=6.0 ms  p95=7.0 ms  max=7.6 ms  Δavg vs baseline=+0.1 ms (+2%)
  hide-settlement      avg=5.6 ms  p95=6.2 ms  max=6.6 ms  Δavg vs baseline=-0.3 ms (-5%)
  no water             avg=6.0 ms  p95=6.8 ms  max=7.1 ms  Δavg vs baseline=+0.2 ms (+3%)
  hide-terrain         avg=5.7 ms  p95=6.6 ms  max=6.9 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-npc-fauna       avg=5.4 ms  p95=6.0 ms  max=6.1 ms  Δavg vs baseline=-0.5 ms (-9%)
  no-shadows           avg=5.9 ms  p95=6.3 ms  max=6.8 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-ao                avg=6.0 ms  p95=7.1 ms  max=8.3 ms  Δavg vs baseline=+0.2 ms (+3%)
  no-bloom             avg=6.3 ms  p95=6.9 ms  max=7.4 ms  Δavg vs baseline=+0.4 ms (+7%)
  no-smaa              avg=6.0 ms  p95=7.1 ms  max=7.7 ms  Δavg vs baseline=+0.1 ms (+2%)
  no-god-rays          avg=6.1 ms  p95=7.6 ms  max=8.2 ms  Δavg vs baseline=+0.3 ms (+5%)
  no-film-grade        avg=6.7 ms  p95=8.2 ms  max=8.8 ms  Δavg vs baseline=+0.9 ms (+15%)
  no postprocessing    avg=6.1 ms  p95=6.8 ms  max=7.6 ms  Δavg vs baseline=+0.2 ms (+3%)
  no mirrors           avg=6.2 ms  p95=6.8 ms  max=7.6 ms  Δavg vs baseline=+0.3 ms (+5%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=14.5 ms  p95=16.3 ms  max=17.7 ms
  CPU wall      avg=5.9 ms  p95=6.5 ms  max=6.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
