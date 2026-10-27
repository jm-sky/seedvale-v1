# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:16:35.550Z
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
Frames: 1269
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-15-43-685Z-q830t4
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
  camera: pos=(426.8, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5156ms npc=20
  gpuTimer: available=true resolved=true samples=1276 span=postprocess+labels

FPS:
  avg: 55.2
  min: 4
  p1: 18

Frame time (wall-clock):
  avg: 18.1 ms
  p50: 15.9 ms
  p95: 26.2 ms
  p99: 57.1 ms
  max: 241.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.2 p95=7.9 p99=43.5 max=109.9 n=1269
  render: p50=10.4 p95=17.9 p99=23 max=192.5 n=1269
  frame: p50=15.9 p95=26.2 p99=57.1 max=241.9 n=1269

Rendering (combined renderer.info):
  draw calls: 893 avg / 2118 max
  triangles: 10.46M avg
  mirror draws: 160 avg
  geometries: 752
  textures: 676

Pass submissions (actual):
  reliability: observed
  frames: 1277 shadowRefresh=458 shadowSkipped=819
  mirror calls avg: 160
  shadow calls avg: 293
  main calls avg: 610

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
  STREAMING      0.6 ms
  NPC            1.4 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         9.4 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  STREAMING: 1

Hitches (>= 8 ms): total=1
  chunk mesh             n=1 avg=12.0 max=12.0

Isolation probes:
  full               render=6.5 ms draws=374 tris=6.03M
  hide-grass         render=6.4 ms draws=348 tris=4.97M
  hide-vegetation    render=5.8 ms draws=246 tris=4.31M
  hide-vegetation-grass render=5.6 ms draws=219 tris=3.26M
  hide-environment   render=6.5 ms draws=357 tris=6.08M
  hide-settlement    render=6.0 ms draws=358 tris=6.07M
  hide-water         render=6.6 ms draws=353 tris=4.99M
  hide-terrain       render=6.4 ms draws=348 tris=3.85M
  hide-npc-fauna     render=4.6 ms draws=291 tris=6.02M
  no-shadows         render=6.3 ms draws=364 tris=5.78M
  no-ao              render=6.5 ms draws=358 tris=5.90M
  no-bloom           render=6.9 ms draws=361 tris=6.03M
  no-smaa            render=6.5 ms draws=371 tris=6.03M
  no-god-rays        render=6.4 ms draws=375 tris=6.01M
  no-film-grade      render=6.5 ms draws=378 tris=6.09M
  no-postprocessing  render=6.3 ms draws=351 tris=6.03M
  no-reflections     render=6.7 ms draws=309 tris=5.10M

Frame attribution:
  frame max: 241.9 ms
  largest labelled hitch: 12 ms
  unattributed: 229.9 ms

Long frames:
  threshold: 80 ms
  count: 7
  worst: 241.9 ms

Raw sidecar:
  sampling=full factor=1 exported=1269/1269

Recommendation:
Largest frame (241.9 ms) is not explained by labelled hitches (largest 12 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (9.1 ms cumulative)
  agent updates: 0.7 ms/frame (890.7 ms cumulative)
  livestock: 0.4 ms/frame (486.6 ms cumulative)
    loaded tick: 0.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 15.8
    unique animals/frame: 15.6
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.5
    dog guard scans: 3.5/frame (28.0 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.4/frame (0.0 candidates/frame)
    water samples: 7.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 7.4/frame, 0.00 ms/frame (worst call 0.10 ms, 549.9 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 15.6
    behaviour executions/frame: 4.5
    presentation executions/frame: 3.9
  rats: 0.1 ms/frame (88.7 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.2 ms/frame (194.5 ms cumulative)
  maintenance: 0.1 ms/frame (124.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.2 ms/frame (1506.5 ms cumulative)
  forest sampling: 0.1 ms/frame (84.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (18.9 ms cumulative)
    targeting: 0.0 ms/frame (12.7 ms cumulative)
    decision: 0.0 ms/frame (10.9 ms cumulative)
    behaviour: 0.8 ms/frame (956.9 ms cumulative)
    life/presentation: 0.3 ms/frame (339.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.4
    expensive behaviour agents/frame: 14.3
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 22.0
    behaviour executions/frame: 14.7
    presentation executions/frame: 13.5

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.4
    village scan candidates/frame: 315.8
    player perception checks/frame: 30.2

  nearest scans: 20.2/frame (25597 calls)
  nearest candidates checked: 120.8/frame (153345 total)
  herd leader scans: 0.1/frame (169 calls)
  herd candidates checked: 4.0/frame (5070 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.5/frame (117.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 42.7/frame, 0.00 ms/frame (worst call 1.00 ms)
    collider queries: 42.7/frame, 0.00 ms/frame (worst call 0.80 ms, 1928.3 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.09 ms
    max 0.30 ms

  allocation/setup:
    avg 0.07 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.02 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.22 ms
    max 0.50 ms

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
    allocation/setup avg/max: 0.04 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.03 / 0.10 ms
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
Frames: 1277
Shadow refresh frames: 458
Shadow skipped frames: 819

Mirror:
  calls avg: 160  tris avg: 890304
  info calls avg: 160  residual calls avg: 0
  environment                  calls=5 tris=4129
  items                        calls=1 tris=501
  other                        calls=29 tris=4819
  settlement:decor             calls=6 tris=15269
  settlement:fence             calls=1 tris=2279
  settlement:fireCampfire      calls=2 tris=170
  settlement:fireHouseExteriorLamp calls=14 tris=1003
  settlement:fireHouseInteriorLamp calls=2 tris=174
  settlement:fireVillageTorch  calls=7 tris=487
  settlement:houseInteractive  calls=5 tris=531
  settlement:houseStatic       calls=12 tris=10839
  settlement:landmarkGarden    calls=2 tris=22165
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=652
  settlement:landmarkWellHousehold calls=2 tris=2206
  settlement:landmarkWellPasture calls=2 tris=618
  settlement:other             calls=3 tris=62
  settlement:storageBarrel     calls=3 tris=4043
  settlement:storageContainer  calls=10 tris=745
  settlement:storageGoods      calls=13 tris=2615
  settlement:storageHay        calls=0 tris=168
  settlement:storageTrough     calls=2 tris=506
  settlement:storageWoodHousehold calls=3 tris=1455
  settlement:storageWoodSettlementPrimary calls=1 tris=322
  settlement:workplace         calls=3 tris=1284
  terrain                      calls=5 tris=403421
  vegetation                   calls=25 tris=410001

Shadow (refresh only):
  calls avg: 293  tris avg: 2275851
  info calls avg: 293  residual calls avg: 0
  environment                  calls=11 tris=6271
  faunaFamily:boar             calls=3 tris=1613
  faunaFamily:cow              calls=2 tris=808
  faunaFamily:horse            calls=2 tris=495
  faunaFamily:rabbit           calls=1 tris=692
  faunaFamily:rat              calls=1 tris=1268
  faunaFamily:sheep            calls=0 tris=80
  faunaFamily:stag             calls=6 tris=3534
  items                        calls=4 tris=1849
  npcFamily:Knight_Cloth       calls=3 tris=4169
  npcFamily:Peasant_Boots      calls=1 tris=1188
  npcFamily:Wizard             calls=4 tris=3871
  npcFamily:woodcutter         calls=1 tris=1192
  other                        calls=50 tris=11067
  settlement:decor             calls=95 tris=189431
  settlement:fireHouseInteriorLamp calls=1 tris=109
  settlement:houseInteractive  calls=2 tris=329
  settlement:houseStatic       calls=13 tris=5865
  settlement:landmarkGarden    calls=1 tris=417
  settlement:landmarkNoticeBoard calls=1 tris=19
  settlement:landmarkWellCentral calls=3 tris=977
  settlement:other             calls=4 tris=72
  settlement:storageContainer  calls=4 tris=449
  settlement:storageHay        calls=1 tris=249
  settlement:storageTrough     calls=1 tris=235
  settlement:storageWoodHousehold calls=2 tris=883
  settlement:storageWoodSettlementPrimary calls=1 tris=453
  settlement:workplace         calls=2 tris=1836
  terrain                      calls=19 tris=1371549
  vegetation                   calls=55 tris=664879

Main:
  calls avg: 610  tris avg: 8728221
  info calls avg: 730  residual calls avg: 0
  environment                  calls=44 tris=12745
  faunaFamily:bear             calls=1 tris=627
  faunaFamily:chicken          calls=6 tris=720
  faunaFamily:cow              calls=0 tris=172
  faunaFamily:dog              calls=10 tris=3501
  faunaFamily:horse            calls=0 tris=46
  faunaFamily:rabbit           calls=0 tris=118
  faunaFamily:rat              calls=1 tris=2740
  faunaFamily:sheep            calls=4 tris=1206
  faunaFamily:stag             calls=0 tris=178
  faunaFamily:wolf             calls=1 tris=592
  grass                        calls=34 tris=5534169
  items                        calls=46 tris=5199
  npcFamily:Herbalist          calls=0 tris=399
  npcFamily:Knight_Cloth       calls=13 tris=13854
  npcFamily:Peasant            calls=51 tris=54587
  npcFamily:Peasant_Boots      calls=25 tris=27875
  npcFamily:Wizard             calls=14 tris=13100
  npcFamily:blacksmith         calls=7 tris=8116
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=76 tris=14452
  settlement:decor             calls=11 tris=27402
  settlement:fence             calls=3 tris=4568
  settlement:fireCampfire      calls=4 tris=336
  settlement:fireHouseExteriorLamp calls=29 tris=1994
  settlement:fireHouseInteriorLamp calls=3 tris=348
  settlement:fireVillageTorch  calls=14 tris=975
  settlement:houseInteractive  calls=10 tris=1060
  settlement:houseStatic       calls=22 tris=19539
  settlement:landmarkGarden    calls=4 tris=43112
  settlement:landmarkNoticeBoard calls=1 tris=26
  settlement:landmarkWellCentral calls=4 tris=1346
  settlement:landmarkWellHousehold calls=4 tris=4332
  settlement:landmarkWellPasture calls=3 tris=1235
  settlement:other             calls=7 tris=123
  settlement:storageBarrel     calls=5 tris=8048
  settlement:storageContainer  calls=20 tris=1480
  settlement:storageGoods      calls=25 tris=5234
  settlement:storageHay        calls=1 tris=330
  settlement:storageTrough     calls=3 tris=1009
  settlement:storageWoodHousehold calls=7 tris=2904
  settlement:storageWoodSettlementPrimary calls=1 tris=638
  settlement:workplace         calls=6 tris=2578
  terrain                      calls=22 tris=1635490
  vegetation                   calls=55 tris=821601
  water                        calls=7 tris=444902


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 7
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 7 total):

[LONG FRAME] 241.9ms
simulate        55.3ms
render         185.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          173.2ms
STREAMING       47.8ms
NPC              3.4ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER          12.6ms
OTHER            3.8ms

streaming / stages:
  chunkUpdate                  47.8ms
  riverTileBuild               46.0ms
  terrainPrepare               0.7ms
  riverChannelSegmentsNear     0.3ms

Long frame #2:

[LONG FRAME] 199.5ms
simulate         6.0ms
render         192.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          179.1ms
STREAMING        6.8ms
NPC              1.3ms
FAUNA            0.8ms
PHYSICS          0.0ms
RENDER          13.5ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              3.1ms
  waterFinalize                2.6ms
  chunkFinalize                1.1ms
  chunkUpdate                  1.1ms
  contentFinalize              1.0ms

Long frame #3:

[LONG FRAME] 185.5ms
simulate         5.1ms
render         179.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          171.2ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA            0.7ms
PHYSICS          0.0ms
RENDER           8.3ms
OTHER            3.8ms

Long frame #4:

[LONG FRAME] 119.6ms
simulate       109.9ms
render           9.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC            106.3ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER           9.6ms
OTHER            2.7ms

streaming / stages:
  riverTileBuild               74.6ms
  terrainPrepare               4.5ms
  riverChannelSegmentsNear     0.4ms

Long frame #5:

[LONG FRAME] 103.3ms
simulate        92.8ms
render          10.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.5ms
STREAMING        5.2ms
NPC             87.8ms
FAUNA            0.7ms
PHYSICS          0.0ms
RENDER           6.8ms
OTHER            0.0ms

streaming / stages:
  riverTileBuild               75.1ms
  terrainPrepare               5.0ms
  waterFinalize                2.7ms
  terrainFinalize              2.3ms
  riverChannelSegmentsNear     0.5ms
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

---

[Seedvale Program Census]

Programs created: 133
Program count: final=133 max=133

By frame:
  frame 0   +77 programs   <== largest transition
  frame 57   +1 program
  frame 365   +1 program
  frame 401   +1 program
  frame 408   +2 programs
  frame 484   +1 program
  frame 485   +1 program
  frame 496   +1 program
  frame 608   +1 program
  frame 931   +1 program
  frame 2036   +16 programs
  frame 2037   +3 programs
  frame 2082   +4 programs
  frame 2315   +23 programs

Largest transition — frame 0 (+77 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=mirror-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f60babc2-fc50-41d0-b805-b8111651d1c1 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=522a8adb-2078-4fa9-84ca-a6208f8cd1a5
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=7efbeb64-0678-46f5-ac85-37d05d1f2af7
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=mirror-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c2c64041-1030-4488-9462-83e487040964
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ff96ffae-4ebf-4f1a-959d-b9ea115bc373
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=mirror-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=023eb0ae-4a00-4abf-b24a-5d1385b5d552
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ee9f441a-26bf-46c6-b70f-0ba5d436536a
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=7766a79c-5bdc-4ea8-99a6-fec73993a271
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=58f94b83-9cec-4d4f-8d91-74feef7bbb3d
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7c9cad22-1bfe-4c3f-b154-ae5e8e7a920c (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=mirror-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=mirror-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=34a2cb46-a547-4e21-b3a6-89c1f9948f4e
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b680cb53-f5fc-4f89-a136-6fd1f079e4c2 (Green)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e9208ee5-b05a-4353-b811-6ef6b998567b (Pink)
  #15 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=99e98060-34b4-4e38-a7a7-0c9dc624f70d (Stone)
  #16 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3252a08e-4c0e-4bf7-accf-453aaa024219 (None)
  #17 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0364d5fc-618e-4941-9d56-d24254df2652 (Flowers)
  #18 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7202f333-43c4-4702-94b7-0198669f1543 (Wood)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=9c9199e5-90c3-485b-b097-2d3f6621ab9b (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=mirror-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9fcdc2d2-90b3-4a3e-8dce-83988dad6d4a (MI_WindowGlass)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4badaf47-4e11-4068-ac84-db4c614e968d (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=mirror-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=48fdc3e4-f054-4669-9c00-b620042df33e (MI_WindowGlass)
  #25 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=mirror-render
  #26 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=mirror-render
  #27 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=756ba2af-3e44-4b58-8234-1c6c684dcb32 (MapleTree_Leaves)
  #28 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b503d033-2d4e-4634-b47b-4d9d41384850 (Green)
  #29 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4fbbdbf1-1872-4223-862b-ee992375075a (MapleTree_Bark)
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2945600e-825a-4e7d-97d0-bad2b3c2729b (Main)
  #31 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=304c62d2-d675-4eda-b931-3f3fadc3abfb (lambert2SG)
  #32 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=mirror-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ba116756-4c28-4ded-8f9e-4cbb0b32972f (Material #55)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=093ccff5-22ab-4b7e-bfaa-3a7f79810a72 (Main)
  #34 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3e369d2e-470c-4bb2-addd-6aa518c88c06 (MI_Peasant)
  #35 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=40a94a95-3bbe-4f43-a096-ea0e0bd1faa9 (MI_Hair_1)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=66d58cca-cb36-4c92-b576-cb1b66714263 (MI_Hair_1)
  #37 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=9fa3f7fb-ec06-4332-beec-5e077af2566a
  #38 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=03f1e171-a5fc-4849-847b-78592ce82361 (Handle)
  #39 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fe5d9253-7526-4eda-af38-5086ab2d1f87 (DarkGreen)
  #40 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e4ed432d-77bf-44ef-a8cd-89afaa982083 (Pond_Pack_MAT)
  #41 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ba7beffb-a695-43a3-95a5-f2823db31412 (MI_Eyes)
  #42 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8a49303b-1d85-4947-881f-87c975325705 (PathRocks)
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #51 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #52 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #53 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=99f83b55 fHash=41e40a66 stage=postprocess-render
  #54 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3c20dbc4-e26e-43fb-8634-8e15a04926b0 (MI_Regular_Male)
  #55 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7dcb092f-2ee6-45eb-abb7-7ae5a2b66b11 (MI_Hair_1)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6cd40707-0dcb-4c99-a03b-7e4872d67a35 (SV_MI_Peasant)
  #57 type=MeshStandardMaterial name='SV_apron' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=8af563d4 fHash=b83d9cc3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9b8fb86a-9973-4709-a523-be6cbe9d716e (SV_apron)
  #58 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=4418a548 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7e2584b5-55a2-46b5-bb78-85bf5b49465f (SV_MI_Peasant)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #25=df7c703d, #26=f92c8d8c, #59=279cec18, #60=84736a68, #61=aa2edbee, #62=7bae0bb2, #63=436caea4, #64=886438e7, #65=d99a5b29, #66=2003ced8, #67=28dfa407, #68=756a0b19, #69=b2354ff2, #70=ea82969e, #71=7dab8d9a, #72=378e1fb7, #73=78acf7ea, #74=a312c579, #75=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #25=236b3b0b, #26=87d053eb, #59=4d6bcede, #60=ffecb62a, #61=76ced00a, #62=fb55b3c0, #63=2d687ef1, #64=dc2a89b5, #65=109e33fc, #66=db0f470a, #67=9775cd0e, #68=5c741650, #69=2aad9943, #70=a2297d9f, #71=1022767b, #72=ce0bf6b4, #73=707f290c, #74=c05e2256, #75=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #25=(unset), #26=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
  MeshStandardMaterial (35 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=d3fd7a87, #15=a9733c9d, #16=6db98a06, #17=e4cbf8ca, #18=f3a1039e, #19=c5e73b05, #20=13a74ec7, #21=9dcf1cb4, #22=12873951, #23=fc941d05, #24=e551c572, #27=d9d07622, #28=190d3a9c, #29=9dbe8ee7, #30=54e03756, #31=7bb77142, #33=fd8301ed, #34=842fe1df, #35=ac268392, #36=1c179521, #37=94297e69, #38=3abb47a8, #39=9434da33, #40=c3bc6325, #41=1dcbc6ff, #42=b643916d, #54=20daccfa, #55=ee59055a, #56=1d0412b3, #57=8af563d4, #58=4418a548
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=2eae9a54, #15=bd723c8a, #16=efed8e98, #17=135696d3, #18=c7daf23, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #27=135696d3, #28=633146b4, #29=8dba9dd, #30=d391c52, #31=87728b15, #33=2f2885d5, #34=34995f15, #35=25a41317, #36=71f22dc6, #37=aa0735a8, #38=85d3c28d, #39=77dfd097, #40=ded4be89, #41=1a1c0d8, #42=754b87bd, #54=a8862f4a, #55=e8d88acf, #56=512afd6f, #57=b83d9cc3, #58=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=environment, #16=environment, #17=vegetation, #18=settlement, #19=settlement, #20=(unknown), #21=settlement, #22=settlement, #23=(unknown), #24=settlement, #27=settlement, #28=settlement, #29=settlement, #30=fauna, #31=fauna, #33=fauna, #34=other, #35=other, #36=other, #37=other, #38=settlement, #39=other, #40=other, #41=other, #42=settlement, #54=other, #55=npc, #56=npc, #57=npc, #58=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=(unset), #21=, #22=, #23=(unset), #24=, #27=, #28=, #29=, #30=, #31=, #33=, #34=, #35=, #36=, #37=, #38=, #39=, #40=, #41=, #42=, #54=, #55=, #56=, #57=, #58=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #16=0, #17=0.45, #18=0, #19=0, #20=(unknown), #21=0, #22=0, #23=(unknown), #24=0, #27=0.45, #28=0, #29=0, #30=0, #31=0, #33=0, #34=0, #35=0, #36=0, #37=0, #38=0, #39=0, #40=0, #41=0, #42=0, #54=0, #55=0, #56=0, #57=0, #58=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=true, #38=true, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=(unknown), #21=true, #22=true, #23=(unknown), #24=true, #27=true, #28=true, #29=true, #30=true, #31=true, #33=true, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #41=true, #42=true, #54=true, #55=true, #56=true, #57=true, #58=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=true, #17=true, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=true, #28=false, #29=true, #30=false, #31=true, #33=false, #34=true, #35=true, #36=true, #37=false, #38=false, #39=false, #40=true, #41=true, #42=true, #54=true, #55=true, #56=true, #57=false, #58=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=false, #29=true, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=true, #22=false, #23=(unknown), #24=true, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=true, #35=true, #36=false, #37=false, #38=false, #39=false, #40=true, #41=true, #42=false, #54=true, #55=false, #56=false, #57=false, #58=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
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
    vertexShaderHash differs: #43=59ed5d71, #44=b69ba143, #45=2e7a6fcb, #46=585a1ea4, #47=c203b19a, #48=c203b19a, #49=585a1ea4, #50=263c45d6, #51=2efa42a8, #52=e4717b03, #53=99f83b55
    fragmentShaderHash differs: #43=d729897e, #44=d729897e, #45=758a4164, #46=41e40a66, #47=41e40a66, #48=a9dd0dee, #49=a9dd0dee, #50=d729897e, #51=41e40a66, #52=41e40a66, #53=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2036 (+16):
  Program #87
    material: MeshStandardMaterial ''
    materialUuid: 7efbeb64-0678-46f5-ac85-37d05d1f2af7
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #88
    material: MeshStandardMaterial 'Wood'
    materialUuid: e6b99cda-84b2-4f89-8f83-172399e3c15a
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #89
    material: MeshStandardMaterial 'Green'
    materialUuid: b85d0f8b-3c20-4b1e-a2da-db37a9cefc0a
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
    materialUuid: fdffc46d-2588-42d9-a851-c2684b91fb21
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #91
    material: MeshStandardMaterial 'Green'
    materialUuid: 43ca88df-bb32-47f7-ada8-ba3955c9aa24
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
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 4fbbdbf1-1872-4223-862b-ee992375075a
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1bd8d9e3
    fragmentShaderHash: e2f189d1
  Program #93
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 0364d5fc-618e-4941-9d56-d24254df2652
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
    materialUuid: 486eeae8-cbf8-4f6d-8536-7067bf1e77d4
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #95
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 1de0eaa6-5655-479d-a828-d3e7617cd4ae
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
    materialUuid: 3c20dbc4-e26e-43fb-8634-8e15a04926b0
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: ba7beffb-a695-43a3-95a5-f2823db31412
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 3e369d2e-470c-4bb2-addd-6aa518c88c06
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 40a94a95-3bbe-4f43-a096-ea0e0bd1faa9
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 66d58cca-cb36-4c92-b576-cb1b66714263
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 211b8c5a-4359-4500-8155-c414f10b5b4a
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Knight_Cloth.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 338ac55c
    fragmentShaderHash: 33d9f19
  Program #102
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: 5d362460-80eb-41d4-b42e-9ea36509a095
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Wizard.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521827,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 6c2cf752
    fragmentShaderHash: ebeca779

Frame 2315 (+23):
  Program #110
    material: ShaderMaterial 'SkyShader'
    materialUuid: f60babc2-fc50-41d0-b805-b8111651d1c1
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #111
    material: ShaderMaterial ''
    materialUuid: 023eb0ae-4a00-4abf-b24a-5d1385b5d552
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #112
    material: MeshStandardMaterial ''
    materialUuid: 7efbeb64-0678-46f5-ac85-37d05d1f2af7
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #113
    material: MeshStandardMaterial 'Wood'
    materialUuid: e6b99cda-84b2-4f89-8f83-172399e3c15a
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: b85d0f8b-3c20-4b1e-a2da-db37a9cefc0a
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
    materialUuid: fdffc46d-2588-42d9-a851-c2684b91fb21
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: 43ca88df-bb32-47f7-ada8-ba3955c9aa24
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
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 4fbbdbf1-1872-4223-862b-ee992375075a
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ab1dd48f
    fragmentShaderHash: 8661e8c2
  Program #118
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 0364d5fc-618e-4941-9d56-d24254df2652
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
    materialUuid: 486eeae8-cbf8-4f6d-8536-7067bf1e77d4
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #120
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 1de0eaa6-5655-479d-a828-d3e7617cd4ae
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
    materialUuid: 3c20dbc4-e26e-43fb-8634-8e15a04926b0
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #122
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: ba7beffb-a695-43a3-95a5-f2823db31412
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #123
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 3e369d2e-470c-4bb2-addd-6aa518c88c06
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 40a94a95-3bbe-4f43-a096-ea0e0bd1faa9
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 66d58cca-cb36-4c92-b576-cb1b66714263
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #126
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 211b8c5a-4359-4500-8155-c414f10b5b4a
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Knight_Cloth.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee59055a
    fragmentShaderHash: d88267ca
  Program #127
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: 5d362460-80eb-41d4-b42e-9ea36509a095
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Wizard.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522851,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 4418a548
    fragmentShaderHash: c52436ea
  Program #128
    material: ShaderMaterial ''
    materialUuid: ee9f441a-26bf-46c6-b70f-0ba5d436536a
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
    materialUuid: 58f94b83-9cec-4d4f-8d91-74feef7bbb3d
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #131
    material: ShaderMaterial ''
    materialUuid: e24d1e21-f224-46a8-b37d-6586a48b5a59
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #132
    material: ShaderMaterial ''
    materialUuid: 52b5afae-e543-4b7f-b23f-be27849a7b6a
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

Frame 57
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 22.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 365
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 27.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 401
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 27.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 484
  #82
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 171.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 485
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 19.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 496
  #84
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 177.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 608
  #85
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 19.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 931
  #86
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 170.0 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 635.7 ms
  programs >1 ms: 8
  max: 177.6 ms (#84)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.5 ms  p95=7.1 ms  max=7.3 ms  Δavg vs baseline=—
  hide-grass           avg=6.4 ms  p95=6.9 ms  max=7.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-vegetation      avg=5.8 ms  p95=6.6 ms  max=7.3 ms  Δavg vs baseline=-0.7 ms (-11%)
  no vegetation/grass  avg=5.6 ms  p95=6.4 ms  max=6.5 ms  Δavg vs baseline=-0.8 ms (-13%)
  hide-environment     avg=6.5 ms  p95=7.1 ms  max=8.7 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-settlement      avg=6.0 ms  p95=6.6 ms  max=7.0 ms  Δavg vs baseline=-0.5 ms (-7%)
  no water             avg=6.6 ms  p95=7.7 ms  max=8.0 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-terrain         avg=6.4 ms  p95=7.2 ms  max=7.2 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-npc-fauna       avg=4.6 ms  p95=5.1 ms  max=5.5 ms  Δavg vs baseline=-1.9 ms (-29%)
  no-shadows           avg=6.3 ms  p95=6.9 ms  max=6.9 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-ao                avg=6.5 ms  p95=7.3 ms  max=8.2 ms  Δavg vs baseline=+0.0 ms (+1%)
  no-bloom             avg=6.9 ms  p95=8.1 ms  max=9.3 ms  Δavg vs baseline=+0.4 ms (+7%)
  no-smaa              avg=6.5 ms  p95=7.3 ms  max=7.5 ms  Δavg vs baseline=+0.0 ms (+1%)
  no-god-rays          avg=6.4 ms  p95=6.9 ms  max=7.4 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-film-grade        avg=6.5 ms  p95=7.5 ms  max=8.3 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=6.3 ms  p95=6.9 ms  max=7.0 ms  Δavg vs baseline=-0.2 ms (-3%)
  no mirrors           avg=6.7 ms  p95=7.6 ms  max=8.6 ms  Δavg vs baseline=+0.2 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=14.2 ms  p95=16.2 ms  max=18.2 ms
  CPU wall      avg=6.5 ms  p95=7.1 ms  max=7.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
