# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:17:07.181Z
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
Frames: 495
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-16-17-856Z-givkde
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
  camera: pos=(424, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  gpuTimer: available=true resolved=true samples=18 span=postprocess+labels

FPS:
  avg: 31.7
  min: 1
  p1: 7

Frame time (wall-clock):
  avg: 31.6 ms
  p50: 24.5 ms
  p95: 61.8 ms
  p99: 145.7 ms
  max: 1048.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.1 p95=20 p99=51 max=86.4 n=495
  render: p50=16.3 p95=31.2 p99=135 max=1040.1 n=495
  frame: p50=24.5 p95=61.8 p99=145.7 max=1048.7 n=495

Rendering (combined renderer.info):
  draw calls: 813 avg / 2118 max
  triangles: 10.55M avg
  mirror draws: 139 avg
  geometries: 754
  textures: 668

Pass submissions (actual):
  reliability: observed
  frames: 495 shadowRefresh=294 shadowSkipped=201
  mirror calls avg: 139
  shadow calls avg: 213
  main calls avg: 538

Scene (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  grass            draws=60 tris=837.5k meshes=60 inst=98841
  vegetation       draws=221 tris=1.62M meshes=221 inst=1036
  environment      draws=134 tris=30.9k meshes=134 inst=157
  settlement       draws=688 tris=671.5k meshes=688 inst=1192
  water            draws=51 tris=3.69M meshes=51 inst=51
  npc              draws=180 tris=221.8k meshes=180 inst=180
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=359 tris=32.6k meshes=359 inst=359
  other            draws=232 tris=26.2k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  vegetation       draws=205 tris=1.57M meshes=205 inst=1008
  environment      draws=133 tris=30.8k meshes=133 inst=156
  settlement       draws=428 tris=478.1k meshes=428 inst=895
  items            draws=46 tris=26.1k meshes=46 inst=46
  other            draws=103 tris=14.6k meshes=103 inst=103

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
  WATER          3.7 ms
  STREAMING      1.8 ms
  NPC            2.0 ms
  FAUNA          2.2 ms
  PHYSICS        0.1 ms
  RENDER         18.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  STREAMING: 10
  WATER: 8

Hitches (>= 8 ms): total=18
  chunk mesh             n=10 avg=10.9 max=17.7
  chunk water            n=8 avg=11.3 max=17.4

Isolation probes:
  full               render=19.4 ms draws=354 tris=5.67M
  hide-grass         render=11.2 ms draws=355 tris=5.11M
  hide-vegetation    render=10.3 ms draws=243 tris=4.25M
  hide-vegetation-grass render=10.2 ms draws=218 tris=3.17M
  hide-environment   render=11.0 ms draws=359 tris=6.08M
  hide-settlement    render=10.9 ms draws=349 tris=5.84M
  hide-water         render=11.0 ms draws=376 tris=5.34M
  hide-terrain       render=11.1 ms draws=343 tris=3.80M
  hide-npc-fauna     render=8.5 ms draws=293 tris=6.02M
  no-shadows         render=11.0 ms draws=370 tris=5.86M
  no-ao              render=11.3 ms draws=366 tris=5.99M
  no-bloom           render=10.6 ms draws=365 tris=6.06M
  no-smaa            render=10.4 ms draws=380 tris=6.12M
  no-god-rays        render=10.7 ms draws=378 tris=6.06M
  no-film-grade      render=11.0 ms draws=378 tris=6.06M
  no-postprocessing  render=12.4 ms draws=347 tris=5.86M
  no-reflections     render=11.4 ms draws=308 tris=5.06M

Frame attribution:
  frame max: 1048.7 ms
  largest labelled hitch: 17.7 ms
  unattributed: 1031 ms

Long frames:
  threshold: 80 ms
  count: 17
  worst: 1048.7 ms

Raw sidecar:
  sampling=full factor=1 exported=495/495

Recommendation:
Largest frame (1048.7 ms) is not explained by labelled hitches (largest 17.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 2.0 ms/frame
  crowd pass: 0.0 ms/frame (4.5 ms cumulative)
  agent updates: 0.9 ms/frame (437.4 ms cumulative)
  livestock: 0.5 ms/frame (249.3 ms cumulative)
    loaded tick: 0.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 13.6
    unique animals/frame: 13.4
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.6
    dog guard scans: 2.6/frame (21.1 predator candidates/frame)
    pest scans: 1.2/frame (1.2 rat candidates/frame)
    nearest scans: 6.4/frame (0.0 candidates/frame)
    water samples: 12.1/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 12.1/frame, 0.00 ms/frame (worst call 0.10 ms, 890.9 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 13.5
    behaviour executions/frame: 6.4
    presentation executions/frame: 6.0
  rats: 0.1 ms/frame (62.1 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.3 ms/frame (136.6 ms cumulative)
  maintenance: 0.1 ms/frame (64.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.2 ms/frame
  agent updates: 2.2 ms/frame (1069.9 ms cumulative)
  forest sampling: 0.1 ms/frame (61.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.5 ms cumulative)
    targeting: 0.0 ms/frame (7.1 ms cumulative)
    decision: 0.0 ms/frame (9.3 ms cumulative)
    behaviour: 1.3 ms/frame (659.7 ms cumulative)
    life/presentation: 0.5 ms/frame (251.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.9
    decision passes/frame: 29.9
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.3
    full-rate agents/frame: 9.4
    reduced-cadence agents/frame: 20.5
    behaviour executions/frame: 19.3
    presentation executions/frame: 18.4

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 20.7
    village scan candidates/frame: 252.4
    player perception checks/frame: 29.9

  nearest scans: 26.1/frame (12906 calls)
  nearest candidates checked: 126.6/frame (62669 total)
  herd leader scans: 0.2/frame (92 calls)
  herd candidates checked: 5.6/frame (2760 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.4/frame (181.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 99.4/frame, 0.10 ms/frame (worst call 3.80 ms)
    collider queries: 99.4/frame, 0.10 ms/frame (worst call 1.40 ms, 3350.9 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.33 ms
    max 1.60 ms

  allocation/setup:
    avg 0.27 ms
    max 1.40 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.07 ms
    max 0.30 ms
  scene attach (`scene.add`):
    avg 0.02 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.56 ms
    max 2.00 ms

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
    allocation/setup avg/max: 0.09 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.07 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.07 / 0.70 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 19/19
    instances: 1884833 (max 184184)
    allocation/setup avg/max: 0.04 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=724882 filler=1540524
Submitted instances: full=76794 filler=22035
Meshes submitted: 48
LOD submitted fraction: full=0.10594000126917208 filler=0.014303574627853899
Flowers: unavailable
Allocation bytes (estimated): 217478976
Upload bytes (observed): unavailable
Lifecycle: req=30 complete=30 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=21 invalidate=0
Finalization: observed completions=30

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 495
Shadow refresh frames: 294
Shadow skipped frames: 201

Mirror:
  calls avg: 139  tris avg: 921997
  info calls avg: 139  residual calls avg: 0
  environment                  calls=5 tris=4394
  items                        calls=1 tris=461
  other                        calls=23 tris=4799
  settlement:decor             calls=4 tris=10290
  settlement:fence             calls=1 tris=1920
  settlement:fireCampfire      calls=2 tris=148
  settlement:fireHouseExteriorLamp calls=12 tris=842
  settlement:fireHouseInteriorLamp calls=1 tris=146
  settlement:fireVillageTorch  calls=6 tris=409
  settlement:houseInteractive  calls=4 tris=446
  settlement:houseStatic       calls=10 tris=9276
  settlement:landmarkGarden    calls=2 tris=17566
  settlement:landmarkNoticeBoard calls=1 tris=10
  settlement:landmarkWellCentral calls=1 tris=548
  settlement:landmarkWellHousehold calls=2 tris=1836
  settlement:landmarkWellPasture calls=1 tris=525
  settlement:other             calls=3 tris=51
  settlement:storageBarrel     calls=2 tris=3436
  settlement:storageContainer  calls=8 tris=631
  settlement:storageGoods      calls=11 tris=2185
  settlement:storageHay        calls=0 tris=132
  settlement:storageTrough     calls=1 tris=432
  settlement:storageWoodHousehold calls=3 tris=1215
  settlement:storageWoodSettlementPrimary calls=1 tris=268
  settlement:workplace         calls=2 tris=1093
  terrain                      calls=6 tris=407139
  vegetation                   calls=26 tris=451967

Shadow (refresh only):
  calls avg: 213  tris avg: 2416341
  info calls avg: 213  residual calls avg: 0
  environment                  calls=13 tris=8235
  faunaFamily:boar             calls=1 tris=275
  faunaFamily:cow              calls=1 tris=283
  faunaFamily:duck             calls=0 tris=3
  faunaFamily:horse            calls=1 tris=148
  faunaFamily:rabbit           calls=0 tris=275
  faunaFamily:rat              calls=0 tris=490
  faunaFamily:sheep            calls=0 tris=21
  faunaFamily:stag             calls=3 tris=1648
  items                        calls=5 tris=2104
  npcFamily:Knight_Cloth       calls=1 tris=1395
  npcFamily:Peasant_Boots      calls=0 tris=453
  npcFamily:Wizard             calls=1 tris=1295
  npcFamily:woodcutter         calls=0 tris=454
  other                        calls=38 tris=9802
  settlement:decor             calls=49 tris=100981
  settlement:fireHouseInteriorLamp calls=1 tris=57
  settlement:houseInteractive  calls=1 tris=173
  settlement:houseStatic       calls=8 tris=3559
  settlement:landmarkGarden    calls=0 tris=215
  settlement:landmarkNoticeBoard calls=1 tris=10
  settlement:landmarkWellCentral calls=1 tris=504
  settlement:other             calls=2 tris=33
  settlement:storageContainer  calls=2 tris=263
  settlement:storageHay        calls=0 tris=124
  settlement:storageTrough     calls=1 tris=148
  settlement:storageWoodHousehold calls=1 tris=461
  settlement:storageWoodSettlementPrimary calls=1 tris=227
  settlement:workplace         calls=1 tris=867
  terrain                      calls=19 tris=1364342
  vegetation                   calls=62 tris=917494

Main:
  calls avg: 538  tris avg: 8191494
  info calls avg: 674  residual calls avg: 0
  environment                  calls=38 tris=12564
  faunaFamily:bear             calls=1 tris=511
  faunaFamily:chicken          calls=5 tris=614
  faunaFamily:cow              calls=0 tris=74
  faunaFamily:dog              calls=9 tris=2972
  faunaFamily:horse            calls=0 tris=11
  faunaFamily:rabbit           calls=0 tris=94
  faunaFamily:rat              calls=1 tris=2249
  faunaFamily:sheep            calls=3 tris=1018
  faunaFamily:stag             calls=1 tris=367
  faunaFamily:wolf             calls=1 tris=460
  grass                        calls=33 tris=4945832
  items                        calls=42 tris=4768
  npcFamily:Herbalist          calls=0 tris=396
  npcFamily:Knight_Cloth       calls=11 tris=11679
  npcFamily:Peasant            calls=43 tris=46414
  npcFamily:Peasant_Boots      calls=22 tris=23687
  npcFamily:Wizard             calls=12 tris=11094
  npcFamily:blacksmith         calls=5 tris=6439
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=65 tris=14165
  settlement:decor             calls=7 tris=18150
  settlement:fence             calls=2 tris=3833
  settlement:fireCampfire      calls=4 tris=292
  settlement:fireHouseExteriorLamp calls=24 tris=1667
  settlement:fireHouseInteriorLamp calls=3 tris=290
  settlement:fireVillageTorch  calls=11 tris=819
  settlement:houseInteractive  calls=8 tris=887
  settlement:houseStatic       calls=18 tris=16341
  settlement:landmarkGarden    calls=3 tris=34484
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1125
  settlement:landmarkWellHousehold calls=4 tris=3638
  settlement:landmarkWellPasture calls=3 tris=1050
  settlement:other             calls=5 tris=101
  settlement:storageBarrel     calls=4 tris=6833
  settlement:storageContainer  calls=16 tris=1256
  settlement:storageGoods      calls=21 tris=4365
  settlement:storageHay        calls=1 tris=262
  settlement:storageTrough     calls=3 tris=861
  settlement:storageWoodHousehold calls=5 tris=2410
  settlement:storageWoodSettlementPrimary calls=1 tris=529
  settlement:workplace         calls=5 tris=2193
  terrain                      calls=22 tris=1619798
  vegetation                   calls=58 tris=898183
  water                        calls=7 tris=483477


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 17
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 17 total):

[LONG FRAME] 1048.7ms
simulate         7.0ms
render        1040.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.1ms
NPC              2.1ms
FAUNA            1.3ms
PHYSICS          0.2ms
RENDER        1040.1ms
OTHER            4.9ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #2:

[LONG FRAME] 205.3ms
simulate        53.5ms
render         150.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          125.5ms
STREAMING       40.5ms
NPC              5.1ms
FAUNA            3.2ms
PHYSICS          0.2ms
RENDER          24.4ms
OTHER            6.4ms

streaming / stages:
  chunkUpdate                  40.5ms
  riverTileBuild               38.5ms
  terrainPrepare               0.9ms
  riverChannelSegmentsNear     0.3ms
  chunkFinalize                0.1ms

Long frame #3:

[LONG FRAME] 166.8ms
simulate        10.6ms
render         155.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.6ms
NPC              2.5ms
FAUNA            1.7ms
PHYSICS          0.1ms
RENDER         155.0ms
OTHER            6.8ms

streaming / stages:
  chunkUpdate                  0.5ms

Long frame #4:

[LONG FRAME] 157.3ms
simulate         6.6ms
render         150.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER         143.1ms
OTHER            4.1ms

Long frame #5:

[LONG FRAME] 148ms
simulate         5.6ms
render         142.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER         142.1ms
OTHER            3.5ms

---

[Seedvale Program Census]

Programs created: 133
Program count: final=133 max=133

By frame:
  frame 0   +77 programs   <== largest transition
  frame 5   +2 programs
  frame 7   +1 program
  frame 28   +1 program
  frame 33   +1 program
  frame 35   +1 program
  frame 48   +1 program
  frame 60   +1 program
  frame 206   +1 program
  frame 665   +16 programs
  frame 666   +3 programs
  frame 673   +5 programs
  frame 776   +23 programs

Largest transition — frame 0 (+77 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=mirror-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bb2380da-6a02-42f9-a267-6b3001c74ab7 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e8d1861a-735f-4d22-813f-b6a73cd51be8
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=e8942a7c-f9ab-479a-bf4a-f69d15d6ef34
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=mirror-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6fb145c3-bda8-4e90-a78a-8ab816c6ee2b
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ef57590f-fc00-4649-ad3c-08155d85f37e
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=mirror-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b92fb73b-cda5-4f02-ae52-ea4a5e60257b
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c521f41c-2bc3-400a-855c-80c2fc30a736
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=85ec1c17-144b-4c4e-9a4f-7325e834d353
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e51b0935-2b24-4f59-8cdf-0deeaca2a3dc
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=03dc266c-7487-4b38-a4e7-e6d8e099d091 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=mirror-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=mirror-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d7053923-e2ca-4642-87e4-457b9f87d507
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=93b7d82b-862e-47ab-881f-5f23be1cda58 (Flowers)
  #14 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a7e19bd0-b1af-4459-b5a5-4c72929843de (None)
  #15 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0e4a00d9-7a0a-459b-b756-012fabf0d9be (Green)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6e93fd08-afff-43e8-a9c1-1b9d10311b3c (Stone)
  #17 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=68981590-27f3-4821-abc3-f528b514b65a (Pink)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5ea9ce4a-0612-48e6-a6f9-4c4606cd7bdb (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=50ac3123-4afd-4a1e-8cdf-5162c35acfa5 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f37a00af-8c04-492e-9939-e828df64a384 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=mirror-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0274f513-2d0c-43fa-8801-0af1c6f0cf72 (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=660f69ab-5bbd-4f8e-bf27-1503429ec949 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=mirror-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dc8701ff-178a-4951-b092-b0c964f1293b (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=e9bbeecc-898f-4736-aac6-4e5607c9ee9b (MI_WoodTrim)
  #26 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=mirror-render
  #27 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=80d232fb-499d-4d63-9073-35203c55335e (MI_WindowGlass)
  #28 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=mirror-render
  #29 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=mirror-render
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7d181ff7-250f-41cb-9515-418f7f40c183 (Main)
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=34139c72-4fc4-4f7e-a604-eedfc2c8f540 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f17ee46c-202d-40bb-84c0-0d91bc8b2cf9 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f915206d-dd81-4f87-a07e-4acb6676997f (MI_Hair_1)
  #34 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8fdb6d29-e27c-4f88-ac64-62d88074960f (Green)
  #35 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=edc3ddd5-6908-40ce-b90f-b1bdac0a65a3 (MapleTree_Bark)
  #36 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=29272c5f-01bf-4d61-aa0c-1156da60a962 (MapleTree_Leaves)
  #37 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=77f3fd25-5e99-4966-9037-f3ca64533730
  #38 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=fd715628-74c3-4441-a895-018dfe5642cb (Handle)
  #39 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5914d40b-16ec-48c9-abee-57f707e47831 (DarkGreen)
  #40 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e6eda8d1-bc20-444e-95ba-05903261f3e7 (Pond_Pack_MAT)
  #41 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=338ca1f4-0579-4c7c-85c7-c5bc9a9ad26b (MI_Eyes)
  #42 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5de8e8e1-b94a-474d-b00a-4ef8cea09e53 (PathRocks)
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #51 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #52 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #53 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=99f83b55 fHash=41e40a66 stage=postprocess-render
  #54 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=aca16e4a-2b75-48ea-a435-b2422dac6271 (MI_Regular_Male)
  #55 type=MeshStandardMaterial name='SV_apron' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=8af563d4 fHash=b83d9cc3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=603c54f8-2e36-466c-9420-4b39ef7aa144 (SV_apron)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=11a92409-a039-4142-929d-3b02799ddbfc (SV_MI_Peasant)
  #57 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2a7143b5-29ce-4500-b3c7-e8b00aef5e4a (MI_Hair_1)
  #58 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=4418a548 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=66fe2c21-9e8c-4648-8650-e16a27c07716 (SV_MI_Peasant)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #28=df7c703d, #29=f92c8d8c, #59=279cec18, #60=84736a68, #61=aa2edbee, #62=7bae0bb2, #63=436caea4, #64=886438e7, #65=d99a5b29, #66=2003ced8, #67=28dfa407, #68=756a0b19, #69=b2354ff2, #70=ea82969e, #71=7dab8d9a, #72=378e1fb7, #73=78acf7ea, #74=a312c579, #75=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #28=236b3b0b, #29=87d053eb, #59=4d6bcede, #60=ffecb62a, #61=76ced00a, #62=fb55b3c0, #63=2d687ef1, #64=dc2a89b5, #65=109e33fc, #66=db0f470a, #67=9775cd0e, #68=5c741650, #69=2aad9943, #70=a2297d9f, #71=1022767b, #72=ce0bf6b4, #73=707f290c, #74=c05e2256, #75=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #28=(unset), #29=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
  MeshStandardMaterial (35 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=6db98a06, #15=c0d790d1, #16=a9733c9d, #17=d3fd7a87, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=12873951, #26=fc941d05, #27=e551c572, #30=fd8301ed, #31=842fe1df, #32=ac268392, #33=1c179521, #34=190d3a9c, #35=9dbe8ee7, #36=3bea20f6, #37=94297e69, #38=3abb47a8, #39=9434da33, #40=c3bc6325, #41=1dcbc6ff, #42=b643916d, #54=20daccfa, #55=8af563d4, #56=1d0412b3, #57=ee59055a, #58=4418a548
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=efed8e98, #15=a81023c3, #16=bd723c8a, #17=2eae9a54, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=d4c95125, #26=3ab4c629, #27=2d1aa4a, #30=2f2885d5, #31=34995f15, #32=25a41317, #33=71f22dc6, #34=633146b4, #35=8dba9dd, #36=5b26a60d, #37=aa0735a8, #38=85d3c28d, #39=77dfd097, #40=ded4be89, #41=1a1c0d8, #42=754b87bd, #54=a8862f4a, #55=b83d9cc3, #56=512afd6f, #57=e8d88acf, #58=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=environment, #15=vegetation, #16=environment, #17=vegetation, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=(unknown), #27=settlement, #30=fauna, #31=other, #32=other, #33=other, #34=settlement, #35=settlement, #36=settlement, #37=other, #38=settlement, #39=other, #40=other, #41=other, #42=settlement, #54=other, #55=npc, #56=npc, #57=npc, #58=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=(unset), #27=, #30=, #31=, #32=, #33=, #34=, #35=, #36=, #37=, #38=, #39=, #40=, #41=, #42=, #54=, #55=, #56=, #57=, #58=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=(unknown), #27=0, #30=0, #31=0, #32=0, #33=0, #34=0, #35=0, #36=0.45, #37=0, #38=0, #39=0, #40=0, #41=0, #42=0, #54=0, #55=0, #56=0, #57=0, #58=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=true, #38=true, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=(unknown), #27=true, #30=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #41=true, #42=true, #54=true, #55=true, #56=true, #57=true, #58=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=true, #32=true, #33=true, #34=false, #35=true, #36=true, #37=false, #38=false, #39=false, #40=true, #41=true, #42=true, #54=true, #55=false, #56=true, #57=true, #58=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=true, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=(unknown), #27=true, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=true, #32=true, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=true, #41=true, #42=false, #54=true, #55=false, #56=false, #57=false, #58=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #54=false, #55=false, #56=false, #57=false, #58=false
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
    vertexShaderHash differs: #43=59ed5d71, #44=2efa42a8, #45=b69ba143, #46=2e7a6fcb, #47=585a1ea4, #48=c203b19a, #49=c203b19a, #50=585a1ea4, #51=263c45d6, #52=e4717b03, #53=99f83b55
    fragmentShaderHash differs: #43=d729897e, #44=41e40a66, #45=d729897e, #46=758a4164, #47=41e40a66, #48=41e40a66, #49=a9dd0dee, #50=a9dd0dee, #51=d729897e, #52=41e40a66, #53=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 665 (+16):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: e8942a7c-f9ab-479a-bf4a-f69d15d6ef34
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: ad518ce0-14fe-4d03-8ffd-8bca252b434a
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 40c0474c-ee0a-4b0d-b628-7ddc598e645b
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
    materialUuid: 1678d2ad-6d5c-4567-86e9-84253772b459
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
    materialUuid: d37971c4-b9b6-4072-8449-d9d5b1dcbe39
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: edc3ddd5-6908-40ce-b90f-b1bdac0a65a3
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 93b7d82b-862e-47ab-881f-5f23be1cda58
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
    materialUuid: df501e2e-3c71-41f8-9616-f910989640ec
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 6d027043-5c51-4584-85e0-7cdefcf6f3de
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
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: aca16e4a-2b75-48ea-a435-b2422dac6271
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #96
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 338ca1f4-0579-4c7c-85c7-c5bc9a9ad26b
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #97
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 34139c72-4fc4-4f7e-a604-eedfc2c8f540
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f17ee46c-202d-40bb-84c0-0d91bc8b2cf9
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f915206d-dd81-4f87-a07e-4acb6676997f
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c38a35af-3175-41ee-bd64-7dded1ffdbc4
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Knight_Cloth.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 338ac55c
    fragmentShaderHash: 33d9f19
  Program #101
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: 66fe2c21-9e8c-4648-8650-e16a27c07716
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521827,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 6c2cf752
    fragmentShaderHash: ebeca779

Frame 776 (+23):
  Program #110
    material: ShaderMaterial 'SkyShader'
    materialUuid: bb2380da-6a02-42f9-a267-6b3001c74ab7
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #111
    material: ShaderMaterial ''
    materialUuid: b92fb73b-cda5-4f02-ae52-ea4a5e60257b
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #112
    material: MeshStandardMaterial ''
    materialUuid: e8942a7c-f9ab-479a-bf4a-f69d15d6ef34
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #113
    material: MeshStandardMaterial 'Wood'
    materialUuid: ad518ce0-14fe-4d03-8ffd-8bca252b434a
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: 40c0474c-ee0a-4b0d-b628-7ddc598e645b
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
    material: MeshStandardMaterial 'Green'
    materialUuid: 1678d2ad-6d5c-4567-86e9-84253772b459
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
  Program #116
    material: MeshStandardMaterial 'Berry'
    materialUuid: d37971c4-b9b6-4072-8449-d9d5b1dcbe39
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #117
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: edc3ddd5-6908-40ce-b90f-b1bdac0a65a3
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #118
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 93b7d82b-862e-47ab-881f-5f23be1cda58
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
    materialUuid: df501e2e-3c71-41f8-9616-f910989640ec
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #120
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 6d027043-5c51-4584-85e0-7cdefcf6f3de
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
    materialUuid: aca16e4a-2b75-48ea-a435-b2422dac6271
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #122
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 338ca1f4-0579-4c7c-85c7-c5bc9a9ad26b
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #123
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 34139c72-4fc4-4f7e-a604-eedfc2c8f540
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f17ee46c-202d-40bb-84c0-0d91bc8b2cf9
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f915206d-dd81-4f87-a07e-4acb6676997f
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #126
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c38a35af-3175-41ee-bd64-7dded1ffdbc4
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Knight_Cloth.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee59055a
    fragmentShaderHash: d88267ca
  Program #127
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: 66fe2c21-9e8c-4648-8650-e16a27c07716
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522851,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 4418a548
    fragmentShaderHash: c52436ea
  Program #128
    material: ShaderMaterial ''
    materialUuid: c521f41c-2bc3-400a-855c-80c2fc30a736
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
    materialUuid: e51b0935-2b24-4f59-8cdf-0deeaca2a3dc
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #131
    material: ShaderMaterial ''
    materialUuid: 78e96e10-3981-4210-9507-083591713032
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #132
    material: ShaderMaterial ''
    materialUuid: 29b180a6-0c5e-4448-a3a5-61d01234487f
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
Excluded — no reliable per-program timing: 126 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 7
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 38.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 28
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 85.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 33
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 1034.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 35
  #82
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 150.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 48
  #83
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 122.7 ms  (upper bound — whole mirror-render call, see note above)

Frame 60
  #84
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 84.3 ms  (upper bound — whole mirror-render call, see note above)

Frame 206
  #85
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 118.5 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 1635.3 ms
  programs >1 ms: 7
  max: 1034.9 ms (#81)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.4 ms  p95=44.1 ms  max=56.0 ms  Δavg vs baseline=—
  hide-grass           avg=11.2 ms  p95=11.5 ms  max=11.6 ms  Δavg vs baseline=-8.2 ms (-42%)
  hide-vegetation      avg=10.3 ms  p95=10.9 ms  max=11.3 ms  Δavg vs baseline=-9.1 ms (-47%)
  no vegetation/grass  avg=10.2 ms  p95=11.3 ms  max=11.6 ms  Δavg vs baseline=-9.2 ms (-47%)
  hide-environment     avg=11.0 ms  p95=12.9 ms  max=14.1 ms  Δavg vs baseline=-8.4 ms (-43%)
  hide-settlement      avg=10.9 ms  p95=11.8 ms  max=11.9 ms  Δavg vs baseline=-8.5 ms (-44%)
  no water             avg=11.0 ms  p95=12.8 ms  max=13.0 ms  Δavg vs baseline=-8.4 ms (-43%)
  hide-terrain         avg=11.1 ms  p95=13.0 ms  max=14.2 ms  Δavg vs baseline=-8.3 ms (-43%)
  hide-npc-fauna       avg=8.5 ms  p95=9.9 ms  max=10.3 ms  Δavg vs baseline=-10.9 ms (-56%)
  no-shadows           avg=11.0 ms  p95=11.3 ms  max=11.3 ms  Δavg vs baseline=-8.4 ms (-44%)
  no-ao                avg=11.3 ms  p95=13.2 ms  max=14.3 ms  Δavg vs baseline=-8.1 ms (-42%)
  no-bloom             avg=10.6 ms  p95=14.4 ms  max=14.7 ms  Δavg vs baseline=-8.8 ms (-45%)
  no-smaa              avg=10.4 ms  p95=12.6 ms  max=14.1 ms  Δavg vs baseline=-9.0 ms (-46%)
  no-god-rays          avg=10.7 ms  p95=13.5 ms  max=13.5 ms  Δavg vs baseline=-8.7 ms (-45%)
  no-film-grade        avg=11.0 ms  p95=12.0 ms  max=12.9 ms  Δavg vs baseline=-8.4 ms (-43%)
  no postprocessing    avg=12.4 ms  p95=14.4 ms  max=14.7 ms  Δavg vs baseline=-7.0 ms (-36%)
  no mirrors           avg=11.4 ms  p95=12.2 ms  max=12.3 ms  Δavg vs baseline=-7.9 ms (-41%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (12 samples resolved during the baseline window)
  GPU elapsed   avg=19.0 ms  p95=22.6 ms  max=22.7 ms
  CPU wall      avg=19.4 ms  p95=44.1 ms  max=56.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
