# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:27:42.793Z
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
Frames: 1364
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d7ddb33720d54ece4e216ee27ed1e7ffa968a234
  runId: 2026-10-28T22-26-50-027Z-4332yk
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
  populationGate: stable waited=5026ms npc=20
  gpuTimer: available=true resolved=true samples=1372 span=postprocess+labels

FPS:
  avg: 60.1
  min: 2
  p1: 17

Frame time (wall-clock):
  avg: 16.6 ms
  p50: 14.4 ms
  p95: 26.3 ms
  p99: 57.2 ms
  max: 519.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.3 p95=7.9 p99=32.6 max=86.6 n=1364
  render: p50=10.6 p95=18.5 p99=28.3 max=514 n=1364
  frame: p50=14.4 p95=26.3 p99=57.2 max=519.3 n=1364

Rendering (combined renderer.info):
  draw calls: 856 avg / 2028 max
  triangles: 10.53M avg
  mirror draws: 154 avg
  geometries: 748
  textures: 590

Pass submissions (actual):
  reliability: observed
  frames: 1374 shadowRefresh=535 shadowSkipped=839
  mirror calls avg: 153
  shadow calls avg: 306
  main calls avg: 566

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=44 tris=1.10M meshes=44 inst=111673
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
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         9.5 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  RENDER: 4
  STREAMING: 1
  FAUNA: 1

Hitches (>= 8 ms): total=1
  chunk mesh             n=1 avg=11.1 max=11.1

Isolation probes:
  full               render=7.1 ms draws=299 tris=6.20M
  hide-grass         render=6.0 ms draws=268 tris=5.07M
  hide-vegetation    render=5.6 ms draws=162 tris=4.37M
  hide-vegetation-grass render=5.3 ms draws=132 tris=3.26M
  hide-environment   render=6.0 ms draws=279 tris=6.20M
  hide-settlement    render=5.7 ms draws=278 tris=6.19M
  hide-water         render=6.1 ms draws=283 tris=5.16M
  hide-terrain       render=5.7 ms draws=269 tris=3.90M
  hide-npc-fauna     render=5.4 ms draws=300 tris=6.21M
  no-shadows         render=5.9 ms draws=286 tris=5.90M
  no-ao              render=6.2 ms draws=294 tris=6.21M
  no-bloom           render=6.2 ms draws=284 tris=6.13M
  no-smaa            render=6.8 ms draws=292 tris=6.14M
  no-god-rays        render=6.4 ms draws=300 tris=6.21M
  no-film-grade      render=6.5 ms draws=297 tris=6.13M
  no-postprocessing  render=6.1 ms draws=274 tris=6.13M
  no-reflections     render=6.4 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 519.3 ms
  largest labelled hitch: 11.1 ms
  unattributed: 508.2 ms

Long frames:
  threshold: 80 ms
  count: 8
  worst: 519.3 ms

Raw sidecar:
  sampling=full factor=1 exported=1364/1364

Recommendation:
Largest frame (519.3 ms) is not explained by labelled hitches (largest 11.1 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (8.1 ms cumulative)
  agent updates: 0.7 ms/frame (983.9 ms cumulative)
  livestock: 0.2 ms/frame (325.6 ms cumulative)
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
    update calls/frame: 14.6
    unique animals/frame: 14.4
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.3 predator candidates/frame)
    pest scans: 0.6/frame (0.6 rat candidates/frame)
    nearest scans: 3.8/frame (0.0 candidates/frame)
    water samples: 7.6/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 7.6/frame, 0.00 ms/frame (worst call 0.90 ms, 539.0 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 14.5
    behaviour executions/frame: 3.8
    presentation executions/frame: 3.3
  rats: 0.1 ms/frame (104.2 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.1 ms/frame (127.9 ms cumulative)
  maintenance: 0.1 ms/frame (139.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.1 ms/frame (1483.5 ms cumulative)
  forest sampling: 0.1 ms/frame (104.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (21.6 ms cumulative)
    targeting: 0.0 ms/frame (14.0 ms cumulative)
    decision: 0.0 ms/frame (15.3 ms cumulative)
    behaviour: 0.7 ms/frame (889.3 ms cumulative)
    life/presentation: 0.2 ms/frame (338.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 13.5
    full-rate agents/frame: 7.0
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 13.5
    presentation executions/frame: 12.3

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.3
    village scan candidates/frame: 272.8
    player perception checks/frame: 30.2

  nearest scans: 18.9/frame (25790 calls)
  nearest candidates checked: 107.9/frame (147207 total)
  herd leader scans: 0.1/frame (132 calls)
  herd candidates checked: 2.9/frame (3960 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 16.7/frame (108.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 33.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 33.2/frame, 0.00 ms/frame (worst call 0.40 ms, 1220.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.14 ms
    max 0.30 ms

  allocation/setup:
    avg 0.08 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.01 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.26 ms
    max 0.80 ms

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
    allocation/setup avg/max: 0.06 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
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
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 19/19
    instances: 1884833 (max 184184)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 11
Resident instances: full=521747 filler=1109105
Submitted instances: full=74200 filler=37465
Meshes submitted: 36
LOD submitted fraction: full=0.14221452159763256 filler=0.03377948886714964
Flowers: unavailable
Allocation bytes (estimated): 156561792
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=31 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=25 invalidate=0
Finalization: observed completions=31

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1374
Shadow refresh frames: 535
Shadow skipped frames: 839

Mirror:
  calls avg: 153  tris avg: 887683
  info calls avg: 153  residual calls avg: 0
  environment                  calls=5 tris=3990
  items                        calls=1 tris=519
  other                        calls=31 tris=4819
  settlement:decor             calls=8 tris=19060
  settlement:fence             calls=1 tris=2185
  settlement:fireCampfire      calls=2 tris=189
  settlement:fireHouseExteriorLamp calls=5 tris=244
  settlement:fireHouseInteriorLamp calls=2 tris=183
  settlement:fireVillageTorch  calls=7 tris=507
  settlement:houseInteractive  calls=5 tris=559
  settlement:houseStatic       calls=12 tris=10769
  settlement:landmarkGarden    calls=2 tris=23445
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=687
  settlement:landmarkWellHousehold calls=2 tris=2163
  settlement:landmarkWellPasture calls=2 tris=599
  settlement:other             calls=3 tris=65
  settlement:storageBarrel     calls=3 tris=4035
  settlement:storageContainer  calls=10 tris=739
  settlement:storageGoods      calls=13 tris=2736
  settlement:storageHay        calls=0 tris=183
  settlement:storageTrough     calls=2 tris=493
  settlement:storageWoodHousehold calls=1 tris=1674
  settlement:storageWoodSettlementPrimary calls=0 tris=298
  settlement:workplace         calls=3 tris=1362
  terrain                      calls=6 tris=409918
  vegetation                   calls=24 tris=396418

Shadow (refresh only):
  calls avg: 306  tris avg: 2238191
  info calls avg: 306  residual calls avg: 0
  environment                  calls=10 tris=5642
  faunaFamily:boar             calls=3 tris=1251
  faunaFamily:cow              calls=2 tris=866
  faunaFamily:duck             calls=0 tris=18
  faunaFamily:horse            calls=2 tris=555
  faunaFamily:rabbit           calls=1 tris=694
  faunaFamily:rat              calls=1 tris=1407
  faunaFamily:sheep            calls=0 tris=74
  faunaFamily:stag             calls=6 tris=3807
  items                        calls=4 tris=1872
  npcFamily:Knight_Cloth       calls=3 tris=4408
  npcFamily:Peasant            calls=3 tris=3967
  npcFamily:Peasant_Boots      calls=1 tris=1415
  npcFamily:woodcutter         calls=1 tris=990
  other                        calls=52 tris=11388
  settlement:decor             calls=105 tris=209378
  settlement:fireHouseInteriorLamp calls=1 tris=121
  settlement:houseInteractive  calls=2 tris=361
  settlement:houseStatic       calls=14 tris=6540
  settlement:landmarkGarden    calls=1 tris=481
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1125
  settlement:other             calls=4 tris=80
  settlement:storageContainer  calls=5 tris=509
  settlement:storageHay        calls=1 tris=289
  settlement:storageTrough     calls=1 tris=263
  settlement:storageWoodHousehold calls=1 tris=1032
  settlement:storageWoodSettlementPrimary calls=1 tris=462
  settlement:workplace         calls=2 tris=2066
  terrain                      calls=19 tris=1367875
  vegetation                   calls=54 tris=609233

Main:
  calls avg: 566  tris avg: 8737029
  info calls avg: 699  residual calls avg: 0
  environment                  calls=51 tris=13530
  faunaFamily:bear             calls=1 tris=644
  faunaFamily:chicken          calls=6 tris=788
  faunaFamily:cow              calls=1 tris=232
  faunaFamily:dog              calls=11 tris=3819
  faunaFamily:horse            calls=0 tris=52
  faunaFamily:rabbit           calls=0 tris=130
  faunaFamily:rat              calls=1 tris=2989
  faunaFamily:sheep            calls=4 tris=1242
  faunaFamily:wolf             calls=2 tris=889
  grass                        calls=36 tris=5440651
  items                        calls=47 tris=5406
  npcFamily:Farmer             calls=7 tris=10975
  npcFamily:Knight_Cloth       calls=6 tris=7562
  npcFamily:Peasant            calls=36 tris=44147
  npcFamily:Peasant_Boots      calls=6 tris=7970
  npcFamily:blacksmith         calls=7 tris=9382
  other                        calls=83 tris=14678
  settlement:decor             calls=14 tris=34240
  settlement:fence             calls=3 tris=4452
  settlement:fireCampfire      calls=5 tris=378
  settlement:fireHouseExteriorLamp calls=10 tris=499
  settlement:fireHouseInteriorLamp calls=3 tris=376
  settlement:fireVillageTorch  calls=14 tris=1037
  settlement:houseInteractive  calls=10 tris=1149
  settlement:houseStatic       calls=22 tris=19914
  settlement:landmarkGarden    calls=5 tris=46714
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1454
  settlement:landmarkWellHousehold calls=4 tris=4376
  settlement:landmarkWellPasture calls=3 tris=1219
  settlement:other             calls=7 tris=132
  settlement:storageBarrel     calls=5 tris=8188
  settlement:storageContainer  calls=21 tris=1505
  settlement:storageGoods      calls=27 tris=5632
  settlement:storageHay        calls=1 tris=361
  settlement:storageTrough     calls=3 tris=1006
  settlement:storageWoodHousehold calls=1 tris=3412
  settlement:storageWoodSettlementPrimary calls=1 tris=598
  settlement:workplace         calls=6 tris=2819
  terrain                      calls=24 tris=1736764
  vegetation                   calls=56 tris=825462
  water                        calls=7 tris=470575


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

[LONG FRAME] 519.3ms
simulate         5.2ms
render         514.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.1ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA            0.5ms
PHYSICS          0.0ms
RENDER         509.9ms
OTHER            3.0ms

Long frame #2:

[LONG FRAME] 287.1ms
simulate         6.9ms
render         279.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.8ms
STREAMING        1.5ms
NPC              2.1ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER         274.7ms
OTHER            2.5ms

streaming / stages:
  contentFinalize              1.5ms
  chunkFinalize                1.5ms
  chunkUpdate                  1.5ms

Long frame #3:

[LONG FRAME] 253.7ms
simulate        45.9ms
render         206.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          194.8ms
STREAMING       38.8ms
NPC              1.5ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER          12.1ms
OTHER            5.3ms

streaming / stages:
  chunkUpdate                  38.8ms
  riverTileBuild               36.3ms
  terrainPrepare               1.0ms
  riverChannelSegmentsNear     0.4ms

Long frame #4:

[LONG FRAME] 229.5ms
simulate         3.0ms
render         225.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          215.1ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER          10.5ms
OTHER            2.0ms

Long frame #5:

[LONG FRAME] 200.4ms
simulate         6.2ms
render         193.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          181.9ms
STREAMING        1.5ms
NPC              0.9ms
FAUNA            0.6ms
PHYSICS          0.0ms
RENDER          11.1ms
OTHER            4.4ms

streaming / stages:
  contentFinalize              1.5ms
  chunkFinalize                1.5ms
  chunkUpdate                  1.5ms

---

[Seedvale Program Census]

Programs created: 130
Program count: final=129 max=129

By frame:
  frame 0   +75 programs   <== largest transition
  frame 47   +1 program
  frame 411   +1 program
  frame 424   +1 program
  frame 448   +2 programs
  frame 536   +1 program
  frame 542   +1 program
  frame 552   +1 program
  frame 686   +1 program
  frame 977   +1 program
  frame 1099   +1 program
  frame 2145   +15 programs
  frame 2146   +3 programs
  frame 2192   +4 programs
  frame 2425   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=23b3bc1c-bc59-4f94-8cd3-bbc85feb56d6 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=79e37a74-3431-4e9d-9056-1ee27fcda862
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=f03f249d-8e00-4029-b69e-36946abf8831
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7c6fb7e8-a072-41ac-ba4d-b7fcfc1febfe
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3018d3e3-0a65-48eb-95e7-f10febfad09e
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fbf71a1a-969b-4655-8bb7-81519bcd44af
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c0ab189e-72fe-4544-94ae-c6c3f41fd2d4
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=87cd7a62-1249-4df4-a208-8ecf463b6554
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=96d1c45f-2d0e-4073-9ce5-825f18388413
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f4389026-3f0f-48dc-80a3-4a002a0be783 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c776e217-f9fc-4c62-aa16-89e68cd87e09
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bbb83265-dd6f-4e2f-9f38-636c63dc6925 (Flowers)
  #14 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5a0b3db0-8468-4338-a711-2a3ac2b8ea4e (Green)
  #15 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f180af73-220c-4cef-9a20-d424cf348d23 (Pink)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6b9c79de-c6c7-4ebf-9919-a32ad2b90597 (Stone)
  #17 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7bad0f64-13b7-4559-ab67-58a70ef9a2d7 (None)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d243f108-cc32-46a1-9ba4-556b85e10284 (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6bfcfb49-d13d-4874-b8b1-50748ec515f9 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=72e54633-b773-4530-8d5f-fda2ff1c030f (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2b05e3c9-c569-4ced-b707-c4b9a18b30ad (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=1e7d66cf-c67b-4e35-951a-8d56f58e42fd (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=06d7869a-f793-487b-9f57-c65595bfefd5 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=0325d2c9-f2b8-4fab-8216-eb6264f80642 (MI_WoodTrim)
  #26 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #27 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5426ec48-9a89-4b60-8ab3-432f7a75c5a3 (MI_WindowGlass)
  #28 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #29 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #30 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9ffad1ca-115d-4f42-b5fb-dfa75fea80ec (MapleTree_Leaves)
  #31 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cde450f7-c552-4968-881f-fed8357914cb (Green)
  #32 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=78de76b8-977c-4cf2-9089-4e1fce1d2968 (MapleTree_Bark)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=85c742e1-b061-4233-9b1c-330fbc43e2a3 (Main)
  #34 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=10f11550-cc67-40fa-bff0-aa212184042e (Handle)
  #35 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f6f4d481-d177-4923-a1dd-801d6536a352 (PathRocks)
  #36 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e9e02d66-deef-401b-b9ab-9b38f168652b (MI_Peasant)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=127d341a-bcf7-46c4-a3ea-5f212d48240c (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=af4b4a39-77d1-4803-9263-92e2b63a6816 (MI_Hair_1)
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
      material=edc093d3-ea6a-47bd-9bb2-eaf20f26ebd9 (stockpiles_vc)
  #50 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=793f879d-7ad1-4a71-9a8a-f99868b4576a
  #51 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2ac22de0-b8f1-49cd-a37e-48413d53eb98 (DarkGreen)
  #52 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d66a7755-f466-40ab-99da-98c19be4d4ce (Pond_Pack_MAT)
  #53 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=12c7a624-4238-4b18-8b3e-023d201b9284 (MI_Regular_Male)
  #54 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=818d8490-74ee-4e76-b0f3-b724b6f12369 (MI_Eyes)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=475b057d-2579-4d63-a320-93aac8b953d6 (MI_Knight)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a163ae45-9100-4a11-a62e-c1bc336684dc (MI_Hair_1)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #28=df7c703d, #29=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #28=236b3b0b, #29=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #28=(unset), #29=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=c0d790d1, #15=d3fd7a87, #16=a9733c9d, #17=6db98a06, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=12873951, #26=fc941d05, #27=e551c572, #30=d9d07622, #31=190d3a9c, #32=9dbe8ee7, #33=fd8301ed, #34=88cdd138, #35=b643916d, #36=842fe1df, #37=ac268392, #38=1c179521, #49=a64d124e, #50=94297e69, #51=9434da33, #52=c3bc6325, #53=20daccfa, #54=1dcbc6ff, #55=1d0412b3, #56=cde317ee
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=a81023c3, #15=2eae9a54, #16=bd723c8a, #17=efed8e98, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=d4c95125, #26=3ab4c629, #27=2d1aa4a, #30=135696d3, #31=633146b4, #32=8dba9dd, #33=2f2885d5, #34=f2ad9521, #35=754b87bd, #36=34995f15, #37=25a41317, #38=71f22dc6, #49=546e469, #50=aa0735a8, #51=77dfd097, #52=ded4be89, #53=a8862f4a, #54=1a1c0d8, #55=512afd6f, #56=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=(unknown), #27=settlement, #30=settlement, #31=settlement, #32=settlement, #33=fauna, #34=settlement, #35=settlement, #36=other, #37=other, #38=other, #49=settlement, #50=other, #51=other, #52=other, #53=other, #54=other, #55=npc, #56=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=(unset), #27=, #30=, #31=, #32=, #33=, #34=, #35=, #36=, #37=, #38=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=(unknown), #27=0, #30=0.45, #31=0, #32=0, #33=0, #34=0, #35=0, #36=0, #37=0, #38=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=true, #35=false, #36=false, #37=false, #38=false, #49=false, #50=true, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=(unknown), #27=true, #30=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #37=true, #38=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=false, #15=false, #16=false, #17=true, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=true, #31=false, #32=true, #33=false, #34=false, #35=true, #36=true, #37=true, #38=true, #49=false, #50=false, #51=false, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=false, #32=true, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=(unknown), #27=true, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=true, #37=true, #38=false, #49=true, #50=false, #51=false, #52=true, #53=true, #54=true, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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
    vertexShaderHash differs: #39=59ed5d71, #40=b69ba143, #41=2e7a6fcb, #42=585a1ea4, #43=c203b19a, #44=c203b19a, #45=585a1ea4, #46=263c45d6, #47=2efa42a8, #48=e4717b03
    fragmentShaderHash differs: #39=d729897e, #40=d729897e, #41=758a4164, #42=41e40a66, #43=41e40a66, #44=a9dd0dee, #45=a9dd0dee, #46=d729897e, #47=41e40a66, #48=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2145 (+15):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: f03f249d-8e00-4029-b69e-36946abf8831
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: b3844ef8-7d97-4cd0-b2d1-98dd513ee54c
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 0c8e6f93-a280-4ba6-b106-70092e42a440
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
    materialUuid: d8d79755-fd47-45cc-ae4d-2e23ff051f56
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
    materialUuid: 6b0146d7-2666-415a-bba9-f97774ac273a
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 78de76b8-977c-4cf2-9089-4e1fce1d2968
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: bbb83265-dd6f-4e2f-9f38-636c63dc6925
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
    materialUuid: 484feefa-e354-450a-bc6f-073e16caaac5
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 4906956d-5d77-4db7-9ce5-49a5b6cc5fde
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
    materialUuid: edc093d3-ea6a-47bd-9bb2-eaf20f26ebd9
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #96
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 12c7a624-4238-4b18-8b3e-023d201b9284
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 818d8490-74ee-4e76-b0f3-b724b6f12369
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: e9e02d66-deef-401b-b9ab-9b38f168652b
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 127d341a-bcf7-46c4-a3ea-5f212d48240c
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: af4b4a39-77d1-4803-9263-92e2b63a6816
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 2425 (+22):
  Program #108
    material: ShaderMaterial 'SkyShader'
    materialUuid: 23b3bc1c-bc59-4f94-8cd3-bbc85feb56d6
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #109
    material: ShaderMaterial ''
    materialUuid: c0ab189e-72fe-4544-94ae-c6c3f41fd2d4
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #110
    material: MeshStandardMaterial ''
    materialUuid: f03f249d-8e00-4029-b69e-36946abf8831
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #111
    material: MeshStandardMaterial 'Wood'
    materialUuid: b3844ef8-7d97-4cd0-b2d1-98dd513ee54c
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: 0c8e6f93-a280-4ba6-b106-70092e42a440
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
    materialUuid: d8d79755-fd47-45cc-ae4d-2e23ff051f56
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
    materialUuid: 6b0146d7-2666-415a-bba9-f97774ac273a
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #115
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 78de76b8-977c-4cf2-9089-4e1fce1d2968
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #116
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: bbb83265-dd6f-4e2f-9f38-636c63dc6925
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
    materialUuid: 484feefa-e354-450a-bc6f-073e16caaac5
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #118
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 4906956d-5d77-4db7-9ce5-49a5b6cc5fde
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
    materialUuid: edc093d3-ea6a-47bd-9bb2-eaf20f26ebd9
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #120
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 12c7a624-4238-4b18-8b3e-023d201b9284
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #121
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 818d8490-74ee-4e76-b0f3-b724b6f12369
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #122
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: e9e02d66-deef-401b-b9ab-9b38f168652b
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 127d341a-bcf7-46c4-a3ea-5f212d48240c
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: af4b4a39-77d1-4803-9263-92e2b63a6816
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #125
    material: ShaderMaterial ''
    materialUuid: fbf71a1a-969b-4655-8bb7-81519bcd44af
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
    materialUuid: 96d1c45f-2d0e-4073-9ce5-825f18388413
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #128
    material: ShaderMaterial ''
    materialUuid: a5ec2c1d-bbd0-43f8-a447-818d405e6862
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #129
    material: ShaderMaterial ''
    materialUuid: 135fc406-3991-42dd-84b2-c65bc2f82619
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

Frame 47
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 25.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 411
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 45.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 424
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 26.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 536
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 193.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 542
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 23.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 552
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 180.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 686
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 16.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 977
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 213.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 1099
  #85
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 271.6 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 996.1 ms
  programs >1 ms: 9
  max: 271.6 ms (#85)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=7.1 ms  p95=11.7 ms  max=19.6 ms  Δavg vs baseline=—
  hide-grass           avg=6.0 ms  p95=6.8 ms  max=7.3 ms  Δavg vs baseline=-1.1 ms (-15%)
  hide-vegetation      avg=5.6 ms  p95=6.7 ms  max=9.4 ms  Δavg vs baseline=-1.5 ms (-22%)
  no vegetation/grass  avg=5.3 ms  p95=6.4 ms  max=7.2 ms  Δavg vs baseline=-1.8 ms (-26%)
  hide-environment     avg=6.0 ms  p95=7.1 ms  max=7.9 ms  Δavg vs baseline=-1.1 ms (-16%)
  hide-settlement      avg=5.7 ms  p95=7.0 ms  max=8.1 ms  Δavg vs baseline=-1.4 ms (-19%)
  no water             avg=6.1 ms  p95=7.2 ms  max=8.3 ms  Δavg vs baseline=-1.0 ms (-14%)
  hide-terrain         avg=5.7 ms  p95=6.6 ms  max=7.0 ms  Δavg vs baseline=-1.4 ms (-19%)
  hide-npc-fauna       avg=5.4 ms  p95=6.1 ms  max=6.4 ms  Δavg vs baseline=-1.7 ms (-24%)
  no-shadows           avg=5.9 ms  p95=6.8 ms  max=7.6 ms  Δavg vs baseline=-1.2 ms (-17%)
  no-ao                avg=6.2 ms  p95=7.0 ms  max=7.3 ms  Δavg vs baseline=-0.9 ms (-13%)
  no-bloom             avg=6.2 ms  p95=6.8 ms  max=7.3 ms  Δavg vs baseline=-0.9 ms (-13%)
  no-smaa              avg=6.8 ms  p95=8.5 ms  max=8.6 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-god-rays          avg=6.4 ms  p95=7.3 ms  max=8.4 ms  Δavg vs baseline=-0.7 ms (-10%)
  no-film-grade        avg=6.5 ms  p95=7.1 ms  max=8.4 ms  Δavg vs baseline=-0.6 ms (-9%)
  no postprocessing    avg=6.1 ms  p95=6.7 ms  max=7.5 ms  Δavg vs baseline=-1.0 ms (-14%)
  no mirrors           avg=6.4 ms  p95=7.1 ms  max=7.5 ms  Δavg vs baseline=-0.7 ms (-10%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (37 samples resolved during the baseline window)
  GPU elapsed   avg=16.4 ms  p95=18.4 ms  max=19.6 ms
  CPU wall      avg=7.1 ms  p95=11.7 ms  max=19.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
