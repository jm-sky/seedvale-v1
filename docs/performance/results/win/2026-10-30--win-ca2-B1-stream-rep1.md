# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T07:19:42.176Z
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
Frames: 1106
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d2b14bf7cbf380131bfa43bc2bd685af918f30e5
  runId: 2026-10-30T07-18-48-781Z-x0xpb9
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
  camera: pos=(426.7, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5132ms npc=20
  gpuTimer: available=true resolved=true samples=1111 span=postprocess+labels

FPS:
  avg: 49.7
  min: 3
  p1: 13

Frame time (wall-clock):
  avg: 20.1 ms
  p50: 16.7 ms
  p95: 38.7 ms
  p99: 78.3 ms
  max: 379.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.5 p95=13 p99=60 max=115.2 n=1106
  render: p50=11.1 p95=23.2 p99=32 max=319.3 n=1106
  frame: p50=16.7 p95=38.7 p99=78.3 max=379.8 n=1106

Rendering (combined renderer.info):
  draw calls: 830 avg / 1994 max
  triangles: 10.41M avg
  mirror draws: 149 avg
  geometries: 736
  textures: 634

Pass submissions (actual):
  reliability: observed
  frames: 1113 shadowRefresh=445 shadowSkipped=668
  mirror calls avg: 149
  shadow calls avg: 285
  main calls avg: 550

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=49 tris=1.18M meshes=49 inst=124428
  vegetation       draws=219 tris=1.48M meshes=219 inst=934
  environment      draws=135 tris=29.1k meshes=135 inst=151
  settlement       draws=586 tris=665.9k meshes=586 inst=1126
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=368 tris=32.3k meshes=368 inst=368
  other            draws=231 tris=26.0k meshes=231 inst=231

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=201 tris=1.44M meshes=201 inst=902
  environment      draws=134 tris=29.1k meshes=134 inst=150
  settlement       draws=398 tris=476.8k meshes=398 inst=883
  items            draws=44 tris=25.5k meshes=44 inst=44
  other            draws=103 tris=14.6k meshes=103 inst=103

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=67 tris=43.7k meshes=67 inst=379
  houseInteractive draws=18 tris=2.8k meshes=18 inst=18
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.0k meshes=3 inst=9
  storageContainer draws=18 tris=3.2k meshes=18 inst=42
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

Matrix work (one scene traversal, steady state):
  terrain                  nodes=71 composed=71 multiplied=71 skinned=0
  grass                    nodes=64 composed=64 multiplied=64 skinned=0
  vegetation               nodes=256 composed=256 multiplied=256 skinned=0
  environment              nodes=231 composed=231 multiplied=231 skinned=0
  settlement               nodes=1155 composed=1155 multiplied=1155 skinned=0
  water                    nodes=53 composed=53 multiplied=53 skinned=0
  npc                      nodes=1486 composed=1486 multiplied=1486 skinned=174
  fauna                    nodes=2288 composed=2288 multiplied=2288 skinned=188
  items                    nodes=569 composed=569 multiplied=569 skinned=0
  other                    nodes=447 composed=430 multiplied=447 skinned=9
  top scene children:
    fauna ×51                nodes=2288 composed=2288 multiplied=2288 skinned=188
    npc ×19                  nodes=1486 composed=1486 multiplied=1486 skinned=174
    settlement ×3            nodes=1155 composed=1155 multiplied=1155 skinned=0
    chunk-items ×37          nodes=560 composed=560 multiplied=560 skinned=0
    Group ×37                nodes=260 composed=260 multiplied=260 skinned=9
    chunk-environmen ×3      nodes=163 composed=163 multiplied=163 skinned=0
    chunk ×71                nodes=71 composed=71 multiplied=71 skinned=0
    chunk-grass ×15          nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×16           nodes=56 composed=56 multiplied=56 skinned=0
    chunk-water ×52          nodes=52 composed=52 multiplied=52 skinned=0
    chunk-river ×42          nodes=42 composed=42 multiplied=42 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          2.6 ms
  STREAMING      0.9 ms
  NPC            1.8 ms
  FAUNA          2.6 ms
  PHYSICS        0.1 ms
  RENDER         10.3 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  STREAMING: 16
  WATER: 5

Hitches (>= 8 ms): total=21
  chunk mesh             n=16 avg=9.8 max=18.1
  chunk water            n=5 avg=8.9 max=9.3

Isolation probes:
  full               render=5.3 ms draws=303 tris=6.21M
  hide-grass         render=5.3 ms draws=271 tris=5.07M
  hide-vegetation    render=4.8 ms draws=166 tris=4.35M
  hide-vegetation-grass render=4.7 ms draws=136 tris=3.31M
  hide-environment   render=5.3 ms draws=282 tris=6.20M
  hide-settlement    render=4.9 ms draws=278 tris=6.19M
  hide-water         render=6.3 ms draws=289 tris=5.24M
  hide-terrain       render=5.5 ms draws=271 tris=3.90M
  hide-npc-fauna     render=4.6 ms draws=303 tris=6.21M
  no-shadows         render=5.4 ms draws=293 tris=5.97M
  no-ao              render=5.5 ms draws=294 tris=6.13M
  no-bloom           render=5.8 ms draws=285 tris=6.14M
  no-smaa            render=5.4 ms draws=300 tris=6.21M
  no-god-rays        render=5.6 ms draws=303 tris=6.21M
  no-film-grade      render=5.8 ms draws=303 tris=6.21M
  no-postprocessing  render=5.1 ms draws=277 tris=6.13M
  no-reflections     render=5.5 ms draws=227 tris=5.14M

Frame attribution:
  frame max: 379.8 ms
  largest labelled hitch: 18.1 ms
  unattributed: 361.7 ms

Long frames:
  threshold: 80 ms
  count: 11
  worst: 379.8 ms

Raw sidecar:
  sampling=full factor=1 exported=1106/1106

Recommendation:
Largest frame (379.8 ms) is not explained by labelled hitches (largest 18.1 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.8 ms/frame
  crowd pass: 0.0 ms/frame (10.0 ms cumulative)
  agent updates: 1.0 ms/frame (1102.1 ms cumulative)
  livestock: 0.4 ms/frame (409.5 ms cumulative)
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
      other update: 0.1 ms/frame
    update calls/frame: 14.7
    unique animals/frame: 14.4
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.5 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 4.5/frame (0.0 candidates/frame)
    water samples: 9.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 9.5/frame, 0.00 ms/frame (worst call 0.20 ms, 644.6 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 14.6
    behaviour executions/frame: 4.5
    presentation executions/frame: 3.9
  rats: 0.1 ms/frame (118.7 ms cumulative)
  social: 0.0 ms/frame (4.2 ms cumulative)
  streaming: 0.1 ms/frame (159.1 ms cumulative)
  maintenance: 0.1 ms/frame (140.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.6 ms/frame
  agent updates: 2.6 ms/frame (2861.1 ms cumulative)
  forest sampling: 0.1 ms/frame (113.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (27.9 ms cumulative)
    targeting: 0.0 ms/frame (19.4 ms cumulative)
    decision: 0.0 ms/frame (15.9 ms cumulative)
    behaviour: 1.9 ms/frame (2080.3 ms cumulative)
    life/presentation: 0.4 ms/frame (476.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.4
    decision passes/frame: 29.4
    high-priority agents/frame: 0.4
    expensive behaviour agents/frame: 15.9
    full-rate agents/frame: 10.0
    reduced-cadence agents/frame: 19.4
    behaviour executions/frame: 16.3
    presentation executions/frame: 15.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.0
    village scan candidates/frame: 279.8
    player perception checks/frame: 29.4

  nearest scans: 20.8/frame (23022 calls)
  nearest candidates checked: 115.3/frame (127537 total)
  herd leader scans: 0.1/frame (61 calls)
  herd candidates checked: 1.7/frame (1830 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.6/frame (129.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 88.5/frame, 0.10 ms/frame (worst call 1.30 ms)
    collider queries: 88.5/frame, 0.10 ms/frame (worst call 1.00 ms, 3526.9 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 76
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.14 ms
    max 0.30 ms

  allocation/setup:
    avg 0.07 ms
    max 0.30 ms
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
    avg 0.07 ms
    max 0.20 ms
  callback total (build + lod + attach):
    avg 0.41 ms
    max 0.90 ms

  per chunk:
    instances avg/max 3731.2 / 6988
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 70892 / 0
    matrix instances bound: 70892
    instanced attributes created: 285
    shared material refs: 57
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 28/28
    instances: 153775 (max 32465)
    allocation/setup avg/max: 0.06 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.07 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=214465 filler=137739
Submitted instances: full=87100 filler=37327
Meshes submitted: 48
LOD submitted fraction: full=0.40612687384887974 filler=0.2709980470309789
Flowers: unavailable
Allocation bytes (estimated): 33811584
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=25 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1113
Shadow refresh frames: 445
Shadow skipped frames: 668

Mirror:
  calls avg: 149  tris avg: 879101
  info calls avg: 149  residual calls avg: 0
  environment                  calls=5 tris=3994
  items                        calls=1 tris=531
  other                        calls=32 tris=5003
  settlement:decor             calls=8 tris=18611
  settlement:fence             calls=1 tris=2201
  settlement:fireCampfire      calls=2 tris=185
  settlement:fireHouseExteriorLamp calls=5 tris=245
  settlement:fireHouseInteriorLamp calls=2 tris=184
  settlement:fireVillageTorch  calls=7 tris=511
  settlement:houseInteractive  calls=5 tris=564
  settlement:houseStatic       calls=12 tris=10940
  settlement:landmarkGarden    calls=2 tris=23258
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=697
  settlement:landmarkWellHousehold calls=2 tris=2195
  settlement:landmarkWellPasture calls=2 tris=596
  settlement:other             calls=4 tris=66
  settlement:storageBarrel     calls=3 tris=4097
  settlement:storageContainer  calls=4 tris=779
  settlement:storageGoods      calls=13 tris=2766
  settlement:storageHay        calls=0 tris=182
  settlement:storageTrough     calls=2 tris=500
  settlement:storageWoodHousehold calls=1 tris=1699
  settlement:storageWoodSettlementPrimary calls=0 tris=303
  settlement:workplace         calls=3 tris=1367
  terrain                      calls=6 tris=411735
  vegetation                   calls=24 tris=386045

Shadow (refresh only):
  calls avg: 285  tris avg: 2260615
  info calls avg: 285  residual calls avg: 0
  environment                  calls=11 tris=6238
  faunaFamily:cow              calls=2 tris=782
  faunaFamily:horse            calls=2 tris=554
  faunaFamily:rabbit           calls=1 tris=716
  faunaFamily:rat              calls=1 tris=1116
  faunaFamily:sheep            calls=0 tris=73
  faunaFamily:stag             calls=5 tris=3332
  faunaFamily:wolf             calls=1 tris=295
  items                        calls=4 tris=1826
  npcFamily:Knight_Cloth       calls=3 tris=4061
  npcFamily:Peasant            calls=3 tris=3655
  npcFamily:Peasant_Boots      calls=1 tris=1097
  npcFamily:woodcutter         calls=1 tris=1045
  other                        calls=50 tris=11062
  settlement:decor             calls=95 tris=189240
  settlement:fireHouseInteriorLamp calls=1 tris=109
  settlement:houseInteractive  calls=2 tris=327
  settlement:houseStatic       calls=13 tris=5837
  settlement:landmarkGarden    calls=1 tris=415
  settlement:landmarkNoticeBoard calls=1 tris=19
  settlement:landmarkWellCentral calls=3 tris=972
  settlement:other             calls=4 tris=72
  settlement:storageContainer  calls=3 tris=450
  settlement:storageHay        calls=1 tris=248
  settlement:storageTrough     calls=1 tris=234
  settlement:storageWoodHousehold calls=1 tris=918
  settlement:storageWoodSettlementPrimary calls=1 tris=396
  settlement:workplace         calls=2 tris=1825
  terrain                      calls=19 tris=1368880
  vegetation                   calls=55 tris=654820

Main:
  calls avg: 550  tris avg: 8599946
  info calls avg: 678  residual calls avg: 0
  environment                  calls=48 tris=13242
  faunaFamily:bear             calls=1 tris=665
  faunaFamily:chicken          calls=6 tris=777
  faunaFamily:cow              calls=0 tris=173
  faunaFamily:dog              calls=11 tris=3754
  faunaFamily:rabbit           calls=0 tris=141
  faunaFamily:rat              calls=1 tris=2995
  faunaFamily:sheep            calls=4 tris=1301
  faunaFamily:stag             calls=1 tris=371
  faunaFamily:wolf             calls=2 tris=772
  grass                        calls=36 tris=5337576
  items                        calls=49 tris=5496
  npcFamily:Farmer             calls=8 tris=11336
  npcFamily:Knight_Cloth       calls=5 tris=7179
  npcFamily:Peasant            calls=36 tris=44446
  npcFamily:Peasant_Boots      calls=6 tris=7873
  npcFamily:blacksmith         calls=6 tris=9268
  other                        calls=83 tris=14628
  settlement:decor             calls=13 tris=33273
  settlement:fence             calls=3 tris=4439
  settlement:fireCampfire      calls=5 tris=368
  settlement:fireHouseExteriorLamp calls=10 tris=496
  settlement:fireHouseInteriorLamp calls=3 tris=374
  settlement:fireVillageTorch  calls=14 tris=1036
  settlement:houseInteractive  calls=10 tris=1143
  settlement:houseStatic       calls=22 tris=19962
  settlement:landmarkGarden    calls=5 tris=45700
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1457
  settlement:landmarkWellHousehold calls=5 tris=4412
  settlement:landmarkWellPasture calls=3 tris=1205
  settlement:other             calls=7 tris=133
  settlement:storageBarrel     calls=5 tris=8229
  settlement:storageContainer  calls=8 tris=1536
  settlement:storageGoods      calls=27 tris=5629
  settlement:storageHay        calls=1 tris=360
  settlement:storageTrough     calls=3 tris=1010
  settlement:storageWoodHousehold calls=1 tris=3427
  settlement:storageWoodSettlementPrimary calls=1 tris=600
  settlement:workplace         calls=6 tris=2814
  terrain                      calls=23 tris=1727856
  vegetation                   calls=56 tris=797015
  water                        calls=7 tris=475798


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 11
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 11 total):

[LONG FRAME] 379.8ms
simulate        59.4ms
render         319.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          300.6ms
STREAMING       49.6ms
NPC              3.0ms
FAUNA            2.0ms
PHYSICS          0.3ms
RENDER          18.7ms
OTHER            5.6ms

streaming / stages:
  chunkUpdate                  49.6ms
  riverTileBuild               46.5ms
  terrainPrepare               1.1ms
  riverChannelSegmentsNear     0.5ms

Long frame #2:

[LONG FRAME] 316.8ms
simulate        11.7ms
render         304.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          286.9ms
STREAMING        1.6ms
NPC              2.6ms
FAUNA            2.8ms
PHYSICS          0.1ms
RENDER          17.2ms
OTHER            5.6ms

streaming / stages:
  chunkFinalize                1.6ms
  chunkUpdate                  1.6ms
  contentFinalize              1.5ms

Long frame #3:

[LONG FRAME] 279.2ms
simulate         3.6ms
render         274.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          266.9ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER           7.9ms
OTHER            1.8ms

Long frame #4:

[LONG FRAME] 123.4ms
simulate       107.9ms
render          15.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.8ms
STREAMING        0.0ms
NPC            101.6ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER          10.5ms
OTHER            4.8ms

streaming / stages:
  riverTileBuild               52.5ms
  terrainPrepare               7.0ms
  riverChannelSegmentsNear     0.5ms

Long frame #5:

[LONG FRAME] 119.8ms
simulate       115.2ms
render           4.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              0.9ms
FAUNA          112.7ms
PHYSICS          0.2ms
RENDER           4.3ms
OTHER            1.5ms

---

[Seedvale Program Census]

Programs created: 129
Program count: final=129 max=129

By frame:
  frame 0   +69 programs   <== largest transition
  frame 5   +1 program
  frame 14   +2 programs
  frame 18   +5 programs
  frame 64   +1 program
  frame 65   +1 program
  frame 299   +1 program
  frame 366   +1 program
  frame 388   +1 program
  frame 435   +1 program
  frame 451   +1 program
  frame 772   +1 program
  frame 1817   +19 programs
  frame 1863   +3 programs
  frame 2092   +22 programs

Largest transition — frame 0 (+69 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f8285806-2bc2-445d-a025-43f3c105fe9f (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0397c635-b5cd-48d3-b175-e423907b157d
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=f3f2ed79-9a1a-432b-b6cb-4518216525af
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1636e1b8-37c4-48e4-9037-705990f1ed98
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a29645a4-721e-4180-a09d-6f8a0801be3c
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4db5bd33-a76a-4865-9c97-bbda32333b82
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8b279e07-8bec-4c31-98b9-1f00a477ee88
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=38f38f68-fac9-473f-ab40-9939749380f7
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b4e11a4b-7a04-48d7-92fb-7730ccb6b89a
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=84f4b087-ef2c-4626-9b4d-b860a4a8cec1 (Wood)
  #10 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=809142c0-c2d7-4778-8d5f-ac77146f2adf (Flowers)
  #11 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2873ae07-92b3-4f73-82df-17b0a25c40f3 (Green)
  #12 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0f0eb46c-6afc-4d75-b565-dcd0547d2885 (Pink)
  #13 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bb2f10a6-4425-4042-8c45-60426e504b62 (Stone)
  #14 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #15 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #16 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6b5a15c8-95ea-4b6c-a53c-13d5577fa4b3
  #17 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=962a4e30-90b3-4902-ac81-167eb76017af (None)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e869d512-0a24-4ccc-8a13-29edaa68d82b (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e852e61d-7431-40e9-b932-46783adc7dc5 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8f24a9ec-ade5-45a0-a052-fcea054deda5 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c55dd27b-1340-4ed8-b7cb-83f9514af623 (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=00d9bff6-430f-47c4-8b3e-144cd6e14ce6 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=57e29686-4c75-49e7-a308-d674c5af8b04 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=484d1ca5-a5b8-479a-9e82-b191e0aa5042
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=5efae409-de2d-4428-8065-362f8ca8bfb5 (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f852be3a-6678-4ef4-b04e-50368efd1c72 (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=2f9329af-11f7-4376-82a1-3d0f21a95caf (Handle)
  #32 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=55895cbf-8400-42ef-bc86-b9e3228c0767 (PathRocks)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e7b4a16d-3f76-42a6-9362-f2ac0ee27d26 (Main)
  #34 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4ccdc28e-2ec8-4ff3-92bf-17febc233102 (MI_Peasant)
  #35 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9bdb9fe2-2ac2-4b70-97e0-7164616b9a18 (MI_Hair_1)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d2d2b9a7-6566-4b1e-85c7-ea4f15740e7e (MI_Hair_1)
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=bc2d5094 fHash=758a4164 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c6dd5f29 fHash=ddb1b5d4 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #47 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=005611a9-6633-4b46-a09c-7c9bf901e5a7 (Green)
  #48 type=MeshStandardMaterial name='BirchTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=231d3864 fHash=c4ce5b40 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=ca1db158-4a88-4040-8636-8803a3a47a98 (MapleTree_Bark)
  #49 type=MeshStandardMaterial name='BirchTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9b05b789 fHash=bfe2de3a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=be39a3be-6647-4fb0-ae21-2012cd2b5eaa (MapleTree_Leaves)
  #50 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=8fde8101-6b53-4fbc-9565-630414d2a19a
  #51 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #52 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #53 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #54 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #55 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #56 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #67 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #68 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #14=5b43c776, #29=df7c703d, #30=f92c8d8c, #51=279cec18, #52=84736a68, #53=aa2edbee, #54=7bae0bb2, #55=436caea4, #56=886438e7, #57=d99a5b29, #58=2003ced8, #59=28dfa407, #60=756a0b19, #61=b2354ff2, #62=ea82969e, #63=7dab8d9a, #64=378e1fb7, #65=78acf7ea, #66=a312c579, #67=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #14=70b71dad, #29=236b3b0b, #30=87d053eb, #51=4d6bcede, #52=ffecb62a, #53=76ced00a, #54=fb55b3c0, #55=2d687ef1, #56=dc2a89b5, #57=109e33fc, #58=db0f470a, #59=9775cd0e, #60=5c741650, #61=2aad9943, #62=a2297d9f, #63=1022767b, #64=ce0bf6b4, #65=707f290c, #66=c05e2256, #67=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #14=(unset), #29=(unset), #30=(unset), #51=(unset), #52=(unset), #53=(unset), #54=(unset), #55=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #14=(unknown), #29=(unknown), #30=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
  MeshStandardMaterial (28 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #10=e4cbf8ca, #11=c0d790d1, #12=d3fd7a87, #13=a9733c9d, #17=6db98a06, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=66d360c8, #26=12873951, #27=fc941d05, #28=e551c572, #31=88cdd138, #32=b643916d, #33=fd8301ed, #34=842fe1df, #35=ac268392, #36=1c179521, #47=190d3a9c, #48=231d3864, #49=9b05b789, #50=94297e69
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #10=135696d3, #11=a81023c3, #12=2eae9a54, #13=bd723c8a, #17=efed8e98, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=c0b8fc9f, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=f2ad9521, #32=754b87bd, #33=2f2885d5, #34=34995f15, #35=25a41317, #36=71f22dc6, #47=633146b4, #48=c4ce5b40, #49=bfe2de3a, #50=aa0735a8
    bucket differs: #2=terrain, #7=other, #9=other, #10=vegetation, #11=vegetation, #12=vegetation, #13=environment, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=settlement, #32=settlement, #33=fauna, #34=other, #35=other, #36=other, #47=settlement, #48=settlement, #49=settlement, #50=other
    define STANDARD differs: #2=, #7=, #9=, #10=, #11=, #12=, #13=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #34=, #35=, #36=, #47=, #48=, #49=, #50=
    flag alphaTest differs: #2=0, #7=0, #9=0, #10=0.45, #11=0, #12=0, #13=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #34=0, #35=0, #36=0, #47=0, #48=0, #49=0.45, #50=0
    flag envMap differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false
    flag flatShading differs: #2=false, #7=true, #9=false, #10=false, #11=false, #12=false, #13=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=true, #26=false, #27=(unknown), #28=false, #31=true, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=true
    flag fog differs: #2=true, #7=true, #9=true, #10=true, #11=true, #12=true, #13=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #47=true, #48=true, #49=true, #50=true
    flag map differs: #2=false, #7=false, #9=false, #10=true, #11=false, #12=false, #13=false, #17=true, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=true, #33=false, #34=true, #35=true, #36=true, #47=false, #48=true, #49=true, #50=false
    flag normalMap differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=true, #49=false, #50=false
    flag transparent differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=false, #27=(unknown), #28=true, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=true, #35=true, #36=false, #47=false, #48=false, #49=false, #50=false
    flag wireframe differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false
  MeshBasicMaterial (3 programs):
    vertexShaderHash differs: #8=5efaf074, #15=d459e49b, #16=b6911298
    fragmentShaderHash differs: #8=5cf0ca9a, #15=a8a9bac3, #16=73a25d1e
    bucket differs: #8=other, #15=(unknown), #16=other
    flag alphaTest differs: #8=0, #15=(unknown), #16=0
    flag envMap differs: #8=false, #15=(unknown), #16=false
    flag fog differs: #8=true, #15=(unknown), #16=false
    flag map differs: #8=true, #15=(unknown), #16=true
    flag normalMap differs: #8=false, #15=(unknown), #16=false
    flag transparent differs: #8=true, #15=(unknown), #16=true
    flag vertexColors differs: #8=false, #15=(unknown), #16=false
    flag wireframe differs: #8=false, #15=(unknown), #16=false
  MeshPhysicalMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (10 programs):
    vertexShaderHash differs: #37=59ed5d71, #38=bc2d5094, #39=2e7a6fcb, #40=c6dd5f29, #41=2efa42a8, #42=b69ba143, #43=c203b19a, #44=c203b19a, #45=585a1ea4, #46=263c45d6
    fragmentShaderHash differs: #37=d729897e, #38=758a4164, #39=758a4164, #40=ddb1b5d4, #41=41e40a66, #42=d729897e, #43=41e40a66, #44=a9dd0dee, #45=a9dd0dee, #46=d729897e
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1817 (+19):
  Program #85
    material: MeshStandardMaterial ''
    materialUuid: f3f2ed79-9a1a-432b-b6cb-4518216525af
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #86
    material: MeshStandardMaterial 'Wood'
    materialUuid: fa9b2e62-b111-4eb4-9710-f14bd8ae191e
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: ef1e8109-16c8-4c34-b432-ad43609171fb
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
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: dc6eafcc-3dad-4d6b-bc9c-370db014701c
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
  Program #89
    material: MeshStandardMaterial 'Berry'
    materialUuid: bdb65dac-9ae5-4dae-a014-6fe195e9e1e9
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #90
    material: MeshStandardMaterial 'BirchTree_Bark'
    materialUuid: ca1db158-4a88-4040-8636-8803a3a47a98
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a920e788
    fragmentShaderHash: 3c40f72c
  Program #91
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: 809142c0-c2d7-4778-8d5f-ac77146f2adf
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
    vertexShaderHash: 7db7358f
    fragmentShaderHash: 800accd2
  Program #92
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 63c194f8-d3de-4cb3-b01a-7908c9fe51bb
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 44ddb251-94d6-4533-94b8-53fcbfd0f685
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
  Program #94
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 12625239-229f-4082-b74c-233b3903ed4e
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #95
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 5efae409-de2d-4428-8065-362f8ca8bfb5
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #96
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: b274b1e1-c68f-415b-8742-3d2f0ad91f6f
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: db9eedc1-3e21-4f5c-8fd9-e2e8c750f7eb
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 4ccdc28e-2ec8-4ff3-92bf-17febc233102
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 9bdb9fe2-2ac2-4b70-97e0-7164616b9a18
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: d2d2b9a7-6566-4b1e-85c7-ea4f15740e7e
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #101
    material: MeshStandardMaterial ''
    materialUuid: 5a3c5e12-8956-404c-a401-1caf671d071b
    object: Mesh 'settlement-house-chests-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d7607dd2
    fragmentShaderHash: 83e94369
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
    materialUuid: f852be3a-6678-4ef4-b04e-50368efd1c72
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2092 (+22):
  Program #107
    material: ShaderMaterial 'SkyShader'
    materialUuid: f8285806-2bc2-445d-a025-43f3c105fe9f
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #108
    material: ShaderMaterial ''
    materialUuid: 4db5bd33-a76a-4865-9c97-bbda32333b82
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #109
    material: MeshStandardMaterial ''
    materialUuid: f3f2ed79-9a1a-432b-b6cb-4518216525af
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #110
    material: MeshStandardMaterial 'Wood'
    materialUuid: fa9b2e62-b111-4eb4-9710-f14bd8ae191e
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: ef1e8109-16c8-4c34-b432-ad43609171fb
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
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: dc6eafcc-3dad-4d6b-bc9c-370db014701c
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
  Program #113
    material: MeshStandardMaterial 'Berry'
    materialUuid: bdb65dac-9ae5-4dae-a014-6fe195e9e1e9
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #114
    material: MeshStandardMaterial 'BirchTree_Bark'
    materialUuid: ca1db158-4a88-4040-8636-8803a3a47a98
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a282481e
    fragmentShaderHash: 21c5c77d
  Program #115
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: 809142c0-c2d7-4778-8d5f-ac77146f2adf
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
    vertexShaderHash: 79ee70f3
    fragmentShaderHash: 559e694b
  Program #116
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 63c194f8-d3de-4cb3-b01a-7908c9fe51bb
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #117
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 44ddb251-94d6-4533-94b8-53fcbfd0f685
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
  Program #118
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 12625239-229f-4082-b74c-233b3903ed4e
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #119
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: b274b1e1-c68f-415b-8742-3d2f0ad91f6f
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #120
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: db9eedc1-3e21-4f5c-8fd9-e2e8c750f7eb
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #121
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 4ccdc28e-2ec8-4ff3-92bf-17febc233102
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #122
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 9bdb9fe2-2ac2-4b70-97e0-7164616b9a18
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: d2d2b9a7-6566-4b1e-85c7-ea4f15740e7e
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #124
    material: ShaderMaterial ''
    materialUuid: 8b279e07-8bec-4c31-98b9-1f00a477ee88
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #125
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #126
    material: MeshBasicMaterial ''
    materialUuid: b4e11a4b-7a04-48d7-92fb-7730ccb6b89a
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #127
    material: ShaderMaterial ''
    materialUuid: c1911d71-3cb9-4e45-8837-acb3f3fc0f50
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #128
    material: ShaderMaterial ''
    materialUuid: 587ce0d4-6a4e-44d6-91df-806447e9d1db
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

Frame 5
  #69
      material: MeshStandardMaterial 'MI_Eyes'
      object: SkinnedMesh 'Eyes'
      asset: /assets/characters/Male_Peasant.glb
      compile/link: 203.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 64
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 37.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 65
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 24.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 299
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 41.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 366
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 17.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 388
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 21.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 435
  #82
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 299.1 ms  (upper bound — whole mirror-render call, see note above)

Frame 451
  #83
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 285.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 772
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 265.4 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 1195.9 ms
  programs >1 ms: 9
  max: 299.1 ms (#82)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.3 ms  p95=7.1 ms  max=8.7 ms  Δavg vs baseline=—
  hide-grass           avg=5.3 ms  p95=6.0 ms  max=6.1 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=4.8 ms  p95=6.6 ms  max=7.6 ms  Δavg vs baseline=-0.5 ms (-9%)
  no vegetation/grass  avg=4.7 ms  p95=5.3 ms  max=5.5 ms  Δavg vs baseline=-0.7 ms (-12%)
  hide-environment     avg=5.3 ms  p95=6.5 ms  max=7.1 ms  Δavg vs baseline=+0.0 ms (+1%)
  hide-settlement      avg=4.9 ms  p95=5.8 ms  max=6.9 ms  Δavg vs baseline=-0.4 ms (-7%)
  no water             avg=6.3 ms  p95=7.3 ms  max=7.8 ms  Δavg vs baseline=+1.0 ms (+18%)
  hide-terrain         avg=5.5 ms  p95=7.5 ms  max=8.3 ms  Δavg vs baseline=+0.2 ms (+3%)
  hide-npc-fauna       avg=4.6 ms  p95=5.7 ms  max=5.9 ms  Δavg vs baseline=-0.7 ms (-13%)
  no-shadows           avg=5.4 ms  p95=6.4 ms  max=7.2 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-ao                avg=5.5 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=+0.1 ms (+3%)
  no-bloom             avg=5.8 ms  p95=7.5 ms  max=9.4 ms  Δavg vs baseline=+0.4 ms (+8%)
  no-smaa              avg=5.4 ms  p95=6.3 ms  max=7.4 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-god-rays          avg=5.6 ms  p95=6.4 ms  max=7.2 ms  Δavg vs baseline=+0.3 ms (+6%)
  no-film-grade        avg=5.8 ms  p95=7.4 ms  max=9.8 ms  Δavg vs baseline=+0.5 ms (+9%)
  no postprocessing    avg=5.1 ms  p95=6.4 ms  max=6.6 ms  Δavg vs baseline=-0.3 ms (-5%)
  no mirrors           avg=5.5 ms  p95=6.3 ms  max=6.6 ms  Δavg vs baseline=+0.2 ms (+4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=17.4 ms  p95=19.5 ms  max=20.6 ms
  CPU wall      avg=5.3 ms  p95=7.1 ms  max=8.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
