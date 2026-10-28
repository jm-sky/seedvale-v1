# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:56:26.732Z
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
Frames: 1420
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-55-41-723Z-bhm2d3
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
  camera: pos=(426.8, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5207ms npc=20
  gpuTimer: available=true resolved=true samples=1430 span=postprocess+labels

FPS:
  avg: 60.7
  min: 8
  p1: 18

Frame time (wall-clock):
  avg: 16.5 ms
  p50: 14.7 ms
  p95: 27.4 ms
  p99: 56.1 ms
  max: 123.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.5 p95=9 p99=38.8 max=113.1 n=1420
  render: p50=10.7 p95=19 p99=26 max=59.5 n=1420
  frame: p50=14.7 p95=27.4 p99=56.1 max=123.3 n=1420

Rendering (combined renderer.info):
  draw calls: 887 avg / 2030 max
  triangles: 10.78M avg
  mirror draws: 157 avg
  geometries: 748
  textures: 588

Pass submissions (actual):
  reliability: observed
  frames: 1431 shadowRefresh=629 shadowSkipped=802
  mirror calls avg: 156
  shadow calls avg: 312
  main calls avg: 576

Scene (one-pass estimate):
  terrain          draws=66 tris=4.87M meshes=66 inst=66
  grass            draws=43 tris=1.12M meshes=43 inst=115158
  vegetation       draws=199 tris=1.32M meshes=199 inst=841
  environment      draws=127 tris=25.5k meshes=127 inst=143
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=48 tris=3.47M meshes=48 inst=48
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=338 tris=28.6k meshes=338 inst=338
  other            draws=221 tris=26.2k meshes=221 inst=221

Shadow casters (one-pass estimate):
  terrain          draws=66 tris=4.87M meshes=66 inst=66
  vegetation       draws=183 tris=1.27M meshes=183 inst=813
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=102 tris=15.0k meshes=102 inst=102

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
      horse            agents=1 draws=8 tris=2.2k skinned=8/8
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      far  agents=51 camera-relevant=0 draws=197 tris=86.4k

Systems:
  WATER          2.1 ms
  STREAMING      0.5 ms
  NPC            1.4 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         9.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  RENDER: 2
  STREAMING: 1

Hitches (>= 8 ms): total=1
  chunk mesh             n=1 avg=11.8 max=11.8

Isolation probes:
  full               render=6.1 ms draws=296 tris=6.14M
  hide-grass         render=5.8 ms draws=268 tris=5.07M
  hide-vegetation    render=5.1 ms draws=162 tris=4.37M
  hide-vegetation-grass render=4.9 ms draws=135 tris=3.34M
  hide-environment   render=6.0 ms draws=279 tris=6.19M
  hide-settlement    render=5.4 ms draws=275 tris=6.10M
  hide-water         render=5.9 ms draws=286 tris=5.24M
  hide-terrain       render=5.5 ms draws=265 tris=3.86M
  hide-npc-fauna     render=5.2 ms draws=300 tris=6.21M
  no-shadows         render=5.7 ms draws=291 tris=5.97M
  no-ao              render=5.8 ms draws=294 tris=6.21M
  no-bloom           render=5.9 ms draws=287 tris=6.21M
  no-smaa            render=5.9 ms draws=293 tris=6.14M
  no-god-rays        render=5.8 ms draws=297 tris=6.13M
  no-film-grade      render=5.9 ms draws=300 tris=6.21M
  no-postprocessing  render=5.8 ms draws=277 tris=6.21M
  no-reflections     render=6.0 ms draws=227 tris=5.14M

Frame attribution:
  frame max: 123.3 ms
  largest labelled hitch: 11.8 ms
  unattributed: 111.5 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 123.3 ms

Raw sidecar:
  sampling=full factor=1 exported=1420/1420

Recommendation:
Largest frame (123.3 ms) is not explained by labelled hitches (largest 11.8 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (7.8 ms cumulative)
  agent updates: 0.8 ms/frame (1129.4 ms cumulative)
  livestock: 0.3 ms/frame (366.2 ms cumulative)
    loaded tick: 0.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.1 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 14.9
    unique animals/frame: 14.7
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.0
    dog guard scans: 3.0/frame (24.0 predator candidates/frame)
    pest scans: 0.8/frame (0.8 rat candidates/frame)
    nearest scans: 3.9/frame (0.0 candidates/frame)
    water samples: 6.9/frame, 0.00 ms/frame (worst call 1.30 ms)
    collider queries: 6.9/frame, 0.00 ms/frame (worst call 0.10 ms, 444.1 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 14.8
    behaviour executions/frame: 3.9
    presentation executions/frame: 3.3
  rats: 0.1 ms/frame (112.7 ms cumulative)
  social: 0.0 ms/frame (5.4 ms cumulative)
  streaming: 0.1 ms/frame (137.9 ms cumulative)
  maintenance: 0.1 ms/frame (150.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (1868.6 ms cumulative)
  forest sampling: 0.1 ms/frame (117.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.0 ms cumulative)
    targeting: 0.0 ms/frame (20.4 ms cumulative)
    decision: 0.0 ms/frame (14.9 ms cumulative)
    behaviour: 0.8 ms/frame (1170.7 ms cumulative)
    life/presentation: 0.3 ms/frame (401.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 28.6
    decision passes/frame: 28.6
    high-priority agents/frame: 0.4
    expensive behaviour agents/frame: 14.1
    full-rate agents/frame: 9.0
    reduced-cadence agents/frame: 19.7
    behaviour executions/frame: 14.5
    presentation executions/frame: 13.5

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.2
    village scan candidates/frame: 284.6
    player perception checks/frame: 28.6

  nearest scans: 19.2/frame (27279 calls)
  nearest candidates checked: 111.3/frame (157979 total)
  herd leader scans: 0.1/frame (74 calls)
  herd candidates checked: 1.6/frame (2220 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.6/frame (100.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 70.2/frame, 0.10 ms/frame (worst call 1.10 ms)
    collider queries: 70.2/frame, 0.10 ms/frame (worst call 0.80 ms, 3550.0 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 77
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.12 ms
    max 0.30 ms

  allocation/setup:
    avg 0.07 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.05 ms
    max 0.20 ms
  scene attach (`scene.add`):
    avg 0.02 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.27 ms
    max 1.00 ms

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
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.37 / 2.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 13
Resident instances: full=567121 filler=137739
Submitted instances: full=77830 filler=37327
Meshes submitted: 42
LOD submitted fraction: full=0.13723702701892543 filler=0.2709980470309789
Flowers: unavailable
Allocation bytes (estimated): 67666560
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=33 discard(unload=0,oor=0) cancel=0 streamIn=17 streamOut=26 invalidate=0
Finalization: observed completions=33

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1431
Shadow refresh frames: 629
Shadow skipped frames: 802

Mirror:
  calls avg: 156  tris avg: 877618
  info calls avg: 156  residual calls avg: 0
  environment                  calls=4 tris=3695
  items                        calls=1 tris=518
  other                        calls=34 tris=4886
  settlement:decor             calls=8 tris=20276
  settlement:fence             calls=1 tris=2224
  settlement:fireCampfire      calls=2 tris=191
  settlement:fireHouseExteriorLamp calls=5 tris=247
  settlement:fireHouseInteriorLamp calls=2 tris=185
  settlement:fireVillageTorch  calls=7 tris=512
  settlement:houseInteractive  calls=5 tris=568
  settlement:houseStatic       calls=12 tris=10915
  settlement:landmarkGarden    calls=2 tris=23756
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=692
  settlement:landmarkWellHousehold calls=2 tris=2189
  settlement:landmarkWellPasture calls=2 tris=610
  settlement:other             calls=4 tris=66
  settlement:storageBarrel     calls=3 tris=4075
  settlement:storageContainer  calls=10 tris=748
  settlement:storageGoods      calls=13 tris=2772
  settlement:storageHay        calls=0 tris=183
  settlement:storageTrough     calls=2 tris=499
  settlement:storageWoodHousehold calls=1 tris=1697
  settlement:storageWoodSettlementPrimary calls=0 tris=301
  settlement:workplace         calls=3 tris=1383
  terrain                      calls=6 tris=410377
  vegetation                   calls=23 tris=384206

Shadow (refresh only):
  calls avg: 312  tris avg: 2242112
  info calls avg: 312  residual calls avg: 0
  environment                  calls=11 tris=5533
  faunaFamily:boar             calls=1 tris=554
  faunaFamily:cow              calls=2 tris=779
  faunaFamily:deer             calls=0 tris=40
  faunaFamily:duck             calls=1 tris=28
  faunaFamily:fox              calls=1 tris=355
  faunaFamily:horse            calls=2 tris=444
  faunaFamily:rabbit           calls=1 tris=767
  faunaFamily:rat              calls=1 tris=1241
  faunaFamily:sheep            calls=0 tris=68
  faunaFamily:stag             calls=7 tris=4469
  faunaFamily:wolf             calls=1 tris=668
  items                        calls=4 tris=2073
  npcFamily:Knight_Cloth       calls=3 tris=3994
  npcFamily:Peasant            calls=3 tris=3594
  npcFamily:Peasant_Boots      calls=1 tris=1106
  npcFamily:woodcutter         calls=1 tris=980
  other                        calls=52 tris=11433
  settlement:decor             calls=108 tris=216620
  settlement:fireHouseInteriorLamp calls=1 tris=127
  settlement:houseInteractive  calls=2 tris=380
  settlement:houseStatic       calls=15 tris=6962
  settlement:landmarkGarden    calls=1 tris=506
  settlement:landmarkNoticeBoard calls=1 tris=24
  settlement:landmarkWellCentral calls=3 tris=1187
  settlement:other             calls=4 tris=82
  settlement:storageContainer  calls=5 tris=537
  settlement:storageHay        calls=1 tris=293
  settlement:storageTrough     calls=1 tris=281
  settlement:storageWoodHousehold calls=1 tris=1104
  settlement:storageWoodSettlementPrimary calls=1 tris=469
  settlement:workplace         calls=3 tris=2174
  terrain                      calls=19 tris=1367620
  vegetation                   calls=54 tris=605619

Main:
  calls avg: 576  tris avg: 8878675
  info calls avg: 726  residual calls avg: 0
  environment                  calls=51 tris=13027
  faunaFamily:bear             calls=1 tris=679
  faunaFamily:chicken          calls=6 tris=811
  faunaFamily:cow              calls=1 tris=184
  faunaFamily:dog              calls=11 tris=3856
  faunaFamily:horse            calls=0 tris=20
  faunaFamily:rabbit           calls=0 tris=184
  faunaFamily:rat              calls=2 tris=3190
  faunaFamily:sheep            calls=4 tris=1256
  faunaFamily:wolf             calls=1 tris=688
  grass                        calls=38 tris=5608664
  items                        calls=47 tris=5373
  npcFamily:Farmer             calls=7 tris=11111
  npcFamily:Knight_Cloth       calls=6 tris=7725
  npcFamily:Peasant            calls=37 tris=44783
  npcFamily:Peasant_Boots      calls=6 tris=8182
  npcFamily:blacksmith         calls=7 tris=9632
  other                        calls=88 tris=14706
  settlement:decor             calls=15 tris=36973
  settlement:fence             calls=3 tris=4560
  settlement:fireCampfire      calls=5 tris=386
  settlement:fireHouseExteriorLamp calls=11 tris=508
  settlement:fireHouseInteriorLamp calls=4 tris=383
  settlement:fireVillageTorch  calls=15 tris=1054
  settlement:houseInteractive  calls=11 tris=1169
  settlement:houseStatic       calls=22 tris=20314
  settlement:landmarkGarden    calls=5 tris=47616
  settlement:landmarkNoticeBoard calls=2 tris=29
  settlement:landmarkWellCentral calls=4 tris=1468
  settlement:landmarkWellHousehold calls=5 tris=4463
  settlement:landmarkWellPasture calls=3 tris=1252
  settlement:other             calls=7 tris=135
  settlement:storageBarrel     calls=5 tris=8310
  settlement:storageContainer  calls=21 tris=1528
  settlement:storageGoods      calls=28 tris=5732
  settlement:storageHay        calls=1 tris=366
  settlement:storageTrough     calls=3 tris=1023
  settlement:storageWoodHousehold calls=1 tris=3466
  settlement:storageWoodSettlementPrimary calls=1 tris=606
  settlement:workplace         calls=6 tris=2870
  terrain                      calls=24 tris=1744126
  vegetation                   calls=55 tris=798436
  water                        calls=7 tris=458185


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

[LONG FRAME] 123.3ms
simulate       113.1ms
render           9.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA          109.9ms
PHYSICS          0.1ms
RENDER           9.7ms
OTHER            1.9ms

Long frame #2:

[LONG FRAME] 109.7ms
simulate        76.2ms
render          32.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           17.8ms
STREAMING       67.0ms
NPC              2.9ms
FAUNA            2.1ms
PHYSICS          0.1ms
RENDER          14.8ms
OTHER            5.0ms

streaming / stages:
  chunkUpdate                  67.0ms
  riverTileBuild               61.6ms
  terrainPrepare               1.5ms
  riverChannelSegmentsNear     0.4ms

Long frame #3:

[LONG FRAME] 105.5ms
simulate        88.7ms
render          16.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.8ms
STREAMING        0.0ms
NPC             82.7ms
FAUNA            1.3ms
PHYSICS          0.1ms
RENDER          11.8ms
OTHER            4.8ms

streaming / stages:
  riverTileBuild               65.7ms
  terrainPrepare               7.5ms
  riverChannelSegmentsNear     0.4ms

Long frame #4:

[LONG FRAME] 82.5ms
simulate        66.3ms
render          16.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA           58.7ms
PHYSICS          0.1ms
RENDER          16.0ms
OTHER            5.9ms

Long frame #5:

[LONG FRAME] 80.7ms
simulate        74.4ms
render           6.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING       67.7ms
NPC              1.0ms
FAUNA            0.6ms
PHYSICS          0.0ms
RENDER           6.1ms
OTHER            5.2ms

streaming / stages:
  chunkUpdate                  67.7ms
  riverTileBuild               58.8ms
  terrainPrepare               1.7ms
  riverChannelSegmentsNear     0.4ms

---

[Seedvale Program Census]

Programs created: 127
Program count: final=126 max=126

By frame:
  frame 0   +72 programs   <== largest transition
  frame 159   +2 programs
  frame 408   +1 program
  frame 513   +1 program
  frame 572   +2 programs
  frame 670   +1 program
  frame 683   +1 program
  frame 858   +1 program
  frame 1144   +1 program
  frame 1270   +1 program
  frame 2329   +18 programs
  frame 2376   +4 programs
  frame 2611   +22 programs

Largest transition — frame 0 (+72 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=88288321-17b1-4833-a346-13560dc5b5a6 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e4b7143e-8018-4dda-9f22-5dee58e8bcd0
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=c5679762-ddfb-4759-93d3-56d8f888145f
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=76db5b4d-fad5-477f-adc7-c476ce10d0ec
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=11e452f1-410d-40c9-b44b-84e2b701559b
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d7f5eb7b-f050-499a-ba4c-b0ec064496d8
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=18b3eb59-16c7-4c05-81ee-b73706a6b496
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=2ac3e396-d5e4-4f99-9bea-c299c1cb96ad
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0d3690df-138c-4933-9303-df5952bae710
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f7dfc694-5e86-4d4a-a158-0bb5e34378bb (Wood)
  #10 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e51f613f-d056-45a6-a1db-aa908066f332 (None)
  #11 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a8375b64-771e-43e7-90cc-ed6ecae6edd2 (Flowers)
  #12 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=90f829b2-c63b-4216-83c7-4cad094e1731 (Green)
  #13 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=baeac546-74af-4d54-a1e6-406ae1469e53 (Pink)
  #14 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2752a605-3458-4259-bfbb-f3e78cd19a33 (Stone)
  #15 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fc7076f2-7cf0-44a7-bc4c-f236ac50a4ce (Wood)
  #16 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=46e816ff-9d03-4fa4-b115-990983b43c34 (MI_WoodTrim)
  #17 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #18 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e04d519b-7449-487a-8ba4-06e556d6bea5 (MI_WindowGlass)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=879cafad-61b3-40ac-a9c1-e9c14f102de0 (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dcf46161-952c-47e0-8de5-c1cd4b68484a (MI_WindowGlass)
  #22 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #23 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #24 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=745ca488-a769-47dc-9d32-e98744d6b4c7 (Handle)
  #25 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=df18b8f4-9a36-4433-bb14-cbaed03dd78a (PathRocks)
  #26 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b19d034b-619c-49c9-8f51-bd19db1202a3 (Main)
  #27 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=88d94c9e-29ca-43d3-a3cb-0bfa12789c19 (MapleTree_Leaves)
  #28 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=76a14b82-e566-42c3-870d-230cc405d7dd (Green)
  #29 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=1bb523a6-bc68-4603-a182-bae756ae6235 (MapleTree_Bark)
  #30 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=017609c6-e9a6-4929-9c01-8366ca13e6c1 (MI_Knight)
  #31 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9269f510-62e5-416b-8a7d-b7a1b4087e07 (MI_Knight)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9d604ebd-c62c-4793-9ba3-026560cf66b8 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f9a37ce5-bb47-46ef-8b8f-a90cd1e01e3f (MI_Hair_1)
  #34 type=MeshStandardMaterial name='SV_Male_Woodcutter_Palette' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c3c87c97 fHash=ee809a5f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=485e2df6-f399-4f59-8362-8d921303b5a2 (SV_Male_Woodcutter_Palette)
  #35 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #36 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=49c21f8e-4376-4be5-a4ba-967051d80ea9 (MI_Peasant)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8780735a-dd93-4154-81d3-15af239bb34d (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=382c727d-78e0-4b9f-b4fb-3d45600235da (MI_Hair_1)
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #49 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a734f5e7-0bb1-4f4a-a969-36167b84ec51 (stockpiles_vc)
  #50 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=0d9798ae-1aea-4908-8cd0-66c10e0595a6
  #51 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8b8ee727-28ac-456b-8239-07860f0e79f5 (DarkGreen)
  #52 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c69b1d79-a49d-4f06-b9b2-dfa9e57c9c78 (Pond_Pack_MAT)
  #53 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=72904db3 fHash=bc151936 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=02a77fa1-a6ef-4695-a704-8f75cf316bf3 (BlackBear_mat)
  #54 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #55 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #56 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #70 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #71 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #22=df7c703d, #23=f92c8d8c, #35=5b43c776, #54=279cec18, #55=84736a68, #56=aa2edbee, #57=7bae0bb2, #58=436caea4, #59=886438e7, #60=d99a5b29, #61=2003ced8, #62=28dfa407, #63=756a0b19, #64=b2354ff2, #65=ea82969e, #66=7dab8d9a, #67=378e1fb7, #68=78acf7ea, #69=a312c579, #70=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #22=236b3b0b, #23=87d053eb, #35=70b71dad, #54=4d6bcede, #55=ffecb62a, #56=76ced00a, #57=fb55b3c0, #58=2d687ef1, #59=dc2a89b5, #60=109e33fc, #61=db0f470a, #62=9775cd0e, #63=5c741650, #64=2aad9943, #65=a2297d9f, #66=1022767b, #67=ce0bf6b4, #68=707f290c, #69=c05e2256, #70=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #22=(unset), #23=(unset), #35=(unset), #54=(unset), #55=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #10=6db98a06, #11=e4cbf8ca, #12=c0d790d1, #13=d3fd7a87, #14=a9733c9d, #15=f3a1039e, #16=c5e73b05, #17=13a74ec7, #18=9dcf1cb4, #19=12873951, #20=fc941d05, #21=e551c572, #24=88cdd138, #25=b643916d, #26=fd8301ed, #27=d9d07622, #28=190d3a9c, #29=9dbe8ee7, #30=140c5e62, #31=eb2eade3, #32=c8a982c1, #33=ee59055a, #34=c3c87c97, #36=842fe1df, #37=ac268392, #38=1c179521, #49=a64d124e, #50=94297e69, #51=9434da33, #52=c3bc6325, #53=72904db3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #10=efed8e98, #11=135696d3, #12=a81023c3, #13=2eae9a54, #14=bd723c8a, #15=c7daf23, #16=d4c95125, #17=3ab4c629, #18=2d1aa4a, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #24=f2ad9521, #25=754b87bd, #26=2f2885d5, #27=135696d3, #28=633146b4, #29=8dba9dd, #30=46d4b31c, #31=6eafecb9, #32=8ab73626, #33=e8d88acf, #34=ee809a5f, #36=34995f15, #37=25a41317, #38=71f22dc6, #49=546e469, #50=aa0735a8, #51=77dfd097, #52=ded4be89, #53=bc151936
    bucket differs: #2=terrain, #7=other, #9=other, #10=environment, #11=vegetation, #12=vegetation, #13=vegetation, #14=environment, #15=settlement, #16=settlement, #17=(unknown), #18=settlement, #19=settlement, #20=(unknown), #21=settlement, #24=settlement, #25=settlement, #26=fauna, #27=settlement, #28=settlement, #29=settlement, #30=npc, #31=npc, #32=npc, #33=npc, #34=npc, #36=other, #37=other, #38=other, #49=settlement, #50=other, #51=other, #52=other, #53=fauna
    define STANDARD differs: #2=, #7=, #9=, #10=, #11=, #12=, #13=, #14=, #15=, #16=, #17=(unset), #18=, #19=, #20=(unset), #21=, #24=, #25=, #26=, #27=, #28=, #29=, #30=, #31=, #32=, #33=, #34=, #36=, #37=, #38=, #49=, #50=, #51=, #52=, #53=
    flag alphaTest differs: #2=0, #7=0, #9=0, #10=0, #11=0.45, #12=0, #13=0, #14=0, #15=0, #16=0, #17=(unknown), #18=0, #19=0, #20=(unknown), #21=0, #24=0, #25=0, #26=0, #27=0.45, #28=0, #29=0, #30=0, #31=0, #32=0, #33=0, #34=0, #36=0, #37=0, #38=0, #49=0, #50=0, #51=0, #52=0, #53=0
    flag envMap differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false
    flag flatShading differs: #2=false, #7=true, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=true, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #49=false, #50=true, #51=false, #52=false, #53=false
    flag fog differs: #2=true, #7=true, #9=true, #10=true, #11=true, #12=true, #13=true, #14=true, #15=true, #16=true, #17=(unknown), #18=true, #19=true, #20=(unknown), #21=true, #24=true, #25=true, #26=true, #27=true, #28=true, #29=true, #30=true, #31=true, #32=true, #33=true, #34=true, #36=true, #37=true, #38=true, #49=true, #50=true, #51=true, #52=true, #53=true
    flag map differs: #2=false, #7=false, #9=false, #10=true, #11=true, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=true, #20=(unknown), #21=false, #24=false, #25=true, #26=false, #27=true, #28=false, #29=true, #30=true, #31=true, #32=true, #33=true, #34=false, #36=true, #37=true, #38=true, #49=false, #50=false, #51=false, #52=true, #53=true
    flag normalMap differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=true, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=true, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false
    flag transparent differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=true, #19=false, #20=(unknown), #21=true, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=true, #32=true, #33=false, #34=false, #36=true, #37=true, #38=false, #49=true, #50=false, #51=false, #52=true, #53=false
    flag wireframe differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false
  MeshBasicMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (10 programs):
    vertexShaderHash differs: #39=59ed5d71, #40=b69ba143, #41=2e7a6fcb, #42=585a1ea4, #43=c203b19a, #44=c203b19a, #45=585a1ea4, #46=263c45d6, #47=2efa42a8, #48=e4717b03
    fragmentShaderHash differs: #39=d729897e, #40=d729897e, #41=758a4164, #42=41e40a66, #43=41e40a66, #44=a9dd0dee, #45=a9dd0dee, #46=d729897e, #47=41e40a66, #48=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2329 (+18):
  Program #83
    material: MeshStandardMaterial ''
    materialUuid: c5679762-ddfb-4759-93d3-56d8f888145f
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #84
    material: MeshStandardMaterial 'Wood'
    materialUuid: c3297ad6-8293-4fce-a09a-989161144cf7
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #85
    material: MeshStandardMaterial 'Green'
    materialUuid: dad8d723-4e76-4723-8171-7b92a0c74745
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
  Program #86
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: a5495fc5-3297-4f1c-9991-e229acea606f
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: 159df9ed-8b38-4dce-a9f4-cf6be5daa056
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
  Program #88
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 1bb523a6-bc68-4603-a182-bae756ae6235
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #89
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: a8375b64-771e-43e7-90cc-ed6ecae6edd2
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
  Program #90
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 3f4c7fe4-7c4c-4860-b592-849ca6a94afa
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #91
    material: MeshStandardMaterial 'Leaves'
    materialUuid: a929cee8-ec65-4685-a3cc-18710519b9d5
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
  Program #92
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: a734f5e7-0bb1-4f4a-a969-36167b84ec51
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #93
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 879cafad-61b3-40ac-a9c1-e9c14f102de0
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #94
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 67f63022-d6c7-4b7e-927a-942847dc8b6d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #95
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 0feb0995-49d3-43b7-8cbd-800a2bdae1ad
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #96
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 49c21f8e-4376-4be5-a4ba-967051d80ea9
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #97
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 8780735a-dd93-4154-81d3-15af239bb34d
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 382c727d-78e0-4b9f-b4fb-3d45600235da
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #99
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #100
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: dcf46161-952c-47e0-8de5-c1cd4b68484a
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2611 (+22):
  Program #105
    material: ShaderMaterial 'SkyShader'
    materialUuid: 88288321-17b1-4833-a346-13560dc5b5a6
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #106
    material: ShaderMaterial ''
    materialUuid: d7f5eb7b-f050-499a-ba4c-b0ec064496d8
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #107
    material: MeshStandardMaterial ''
    materialUuid: c5679762-ddfb-4759-93d3-56d8f888145f
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #108
    material: MeshStandardMaterial 'Wood'
    materialUuid: c3297ad6-8293-4fce-a09a-989161144cf7
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #109
    material: MeshStandardMaterial 'Green'
    materialUuid: dad8d723-4e76-4723-8171-7b92a0c74745
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
  Program #110
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: a5495fc5-3297-4f1c-9991-e229acea606f
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: 159df9ed-8b38-4dce-a9f4-cf6be5daa056
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
  Program #112
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 1bb523a6-bc68-4603-a182-bae756ae6235
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #113
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: a8375b64-771e-43e7-90cc-ed6ecae6edd2
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
  Program #114
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 3f4c7fe4-7c4c-4860-b592-849ca6a94afa
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #115
    material: MeshStandardMaterial 'Leaves'
    materialUuid: a929cee8-ec65-4685-a3cc-18710519b9d5
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
  Program #116
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: a734f5e7-0bb1-4f4a-a969-36167b84ec51
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #117
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 67f63022-d6c7-4b7e-927a-942847dc8b6d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #118
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 0feb0995-49d3-43b7-8cbd-800a2bdae1ad
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #119
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 49c21f8e-4376-4be5-a4ba-967051d80ea9
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #120
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 8780735a-dd93-4154-81d3-15af239bb34d
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #121
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 382c727d-78e0-4b9f-b4fb-3d45600235da
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #122
    material: ShaderMaterial ''
    materialUuid: 18b3eb59-16c7-4c05-81ee-b73706a6b496
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #123
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 14,15,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #124
    material: MeshBasicMaterial ''
    materialUuid: 0d3690df-138c-4933-9303-df5952bae710
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #125
    material: ShaderMaterial ''
    materialUuid: a98829d0-85a1-46ba-9e4b-dd1f6a81da21
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #126
    material: ShaderMaterial ''
    materialUuid: d38f84fc-922a-4615-9a4b-1dfb4462bc9d
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

Frame 408
  #74
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 40.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 513
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 11.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 670
  #78
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 16.2 ms  (upper bound — whole mirror-render call, see note above)

Frame 683
  #79
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,0|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 16.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 858
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 12.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 1144
  #81
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 48.2 ms  (upper bound — whole mirror-render call, see note above)

Frame 1270
  #82
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 23.4 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 168.6 ms
  programs >1 ms: 7
  max: 48.2 ms (#81)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.1 ms  p95=6.9 ms  max=7.2 ms  Δavg vs baseline=—
  hide-grass           avg=5.8 ms  p95=6.5 ms  max=8.4 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-vegetation      avg=5.1 ms  p95=6.1 ms  max=6.3 ms  Δavg vs baseline=-1.0 ms (-16%)
  no vegetation/grass  avg=4.9 ms  p95=6.1 ms  max=6.3 ms  Δavg vs baseline=-1.2 ms (-20%)
  hide-environment     avg=6.0 ms  p95=8.0 ms  max=8.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-settlement      avg=5.4 ms  p95=6.3 ms  max=6.6 ms  Δavg vs baseline=-0.7 ms (-11%)
  no water             avg=5.9 ms  p95=6.8 ms  max=7.1 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-terrain         avg=5.5 ms  p95=6.4 ms  max=6.4 ms  Δavg vs baseline=-0.6 ms (-9%)
  hide-npc-fauna       avg=5.2 ms  p95=6.1 ms  max=6.4 ms  Δavg vs baseline=-0.9 ms (-14%)
  no-shadows           avg=5.7 ms  p95=6.6 ms  max=7.2 ms  Δavg vs baseline=-0.4 ms (-7%)
  no-ao                avg=5.8 ms  p95=6.6 ms  max=6.8 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-bloom             avg=5.9 ms  p95=7.1 ms  max=7.4 ms  Δavg vs baseline=-0.2 ms (-4%)
  no-smaa              avg=5.9 ms  p95=7.1 ms  max=7.7 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-god-rays          avg=5.8 ms  p95=6.6 ms  max=6.9 ms  Δavg vs baseline=-0.3 ms (-5%)
  no-film-grade        avg=5.9 ms  p95=6.7 ms  max=6.8 ms  Δavg vs baseline=-0.2 ms (-3%)
  no postprocessing    avg=5.8 ms  p95=6.7 ms  max=6.8 ms  Δavg vs baseline=-0.3 ms (-5%)
  no mirrors           avg=6.0 ms  p95=6.8 ms  max=7.5 ms  Δavg vs baseline=-0.2 ms (-3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=13.2 ms  p95=14.6 ms  max=15.3 ms
  CPU wall      avg=6.1 ms  p95=6.9 ms  max=7.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
