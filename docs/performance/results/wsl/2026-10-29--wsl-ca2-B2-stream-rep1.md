# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T21:12:40.026Z
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
Frames: 437
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0cfb9ed3548021fbb5d0e96e462211d300ef8cac
  runId: 2026-10-29T21-11-38-228Z-tegtcu
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
  viewport: 1600x813
  drawingBuffer: 1600x813
  camera: pos=(427, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5084ms npc=20
  gpuTimer: available=true resolved=true samples=439 span=postprocess+labels

FPS:
  avg: 35.8
  min: 1
  p1: 5

Frame time (wall-clock):
  avg: 27.9 ms
  p50: 20.1 ms
  p95: 58.8 ms
  p99: 210.1 ms
  max: 1052.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.3 p95=19.7 p99=64 max=84.6 n=437
  render: p50=12.3 p95=23.1 p99=191.7 max=1045.2 n=437
  frame: p50=20.1 p95=58.8 p99=210.1 max=1052.4 n=437

Rendering (combined renderer.info):
  draw calls: 706 avg / 2028 max
  triangles: 10.25M avg
  mirror draws: 122 avg
  geometries: 728
  textures: 580

Pass submissions (actual):
  reliability: observed
  frames: 442 shadowRefresh=273 shadowSkipped=169
  mirror calls avg: 122
  shadow calls avg: 201
  main calls avg: 447

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=49 tris=1.18M meshes=49 inst=124428
  vegetation       draws=210 tris=1.47M meshes=210 inst=925
  environment      draws=135 tris=29.1k meshes=135 inst=151
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=367 tris=31.4k meshes=367 inst=367
  other            draws=229 tris=25.8k meshes=229 inst=229

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=192 tris=1.43M meshes=192 inst=893
  environment      draws=134 tris=29.1k meshes=134 inst=150
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=43 tris=24.6k meshes=43 inst=43
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

Matrix work (one scene traversal, steady state):
  terrain                  nodes=71 composed=71 multiplied=71 skinned=0
  grass                    nodes=64 composed=64 multiplied=64 skinned=0
  vegetation               nodes=246 composed=246 multiplied=246 skinned=0
  environment              nodes=231 composed=231 multiplied=231 skinned=0
  settlement               nodes=1191 composed=1191 multiplied=1191 skinned=0
  water                    nodes=53 composed=53 multiplied=53 skinned=0
  npc                      nodes=1486 composed=1486 multiplied=1486 skinned=174
  fauna                    nodes=2288 composed=2288 multiplied=2288 skinned=188
  items                    nodes=566 composed=566 multiplied=566 skinned=0
  other                    nodes=443 composed=426 multiplied=443 skinned=9
  top scene children:
    fauna ×51                nodes=2288 composed=2288 multiplied=2288 skinned=188
    npc ×19                  nodes=1486 composed=1486 multiplied=1486 skinned=174
    settlement ×3            nodes=1191 composed=1191 multiplied=1191 skinned=0
    chunk-items ×36          nodes=557 composed=557 multiplied=557 skinned=0
    Group ×37                nodes=260 composed=260 multiplied=260 skinned=9
    chunk-environmen ×3      nodes=163 composed=163 multiplied=163 skinned=0
    chunk ×71                nodes=71 composed=71 multiplied=71 skinned=0
    chunk-grass ×15          nodes=64 composed=64 multiplied=64 skinned=0
    chunk-water ×52          nodes=52 composed=52 multiplied=52 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    chunk-river ×42          nodes=42 composed=42 multiplied=42 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.0 ms
  STREAMING      2.5 ms
  NPC            2.0 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         16.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. STREAMING

Critical spikes:
  STREAMING: 13
  WATER: 7

Hitches (>= 8 ms): total=20
  chunk mesh             n=13 avg=12.2 max=25.7
  chunk water            n=7 avg=11.2 max=16.3

Isolation probes:
  full               render=8.2 ms draws=301 tris=6.21M
  hide-grass         render=7.7 ms draws=272 tris=5.15M
  hide-vegetation    render=6.9 ms draws=163 tris=4.35M
  hide-vegetation-grass render=6.5 ms draws=135 tris=3.34M
  hide-environment   render=7.8 ms draws=280 tris=6.20M
  hide-settlement    render=7.4 ms draws=275 tris=6.12M
  hide-water         render=7.8 ms draws=287 tris=5.24M
  hide-terrain       render=7.7 ms draws=265 tris=3.86M
  hide-npc-fauna     render=6.3 ms draws=296 tris=6.15M
  no-shadows         render=7.6 ms draws=286 tris=5.90M
  no-ao              render=7.6 ms draws=290 tris=6.15M
  no-bloom           render=7.8 ms draws=288 tris=6.21M
  no-smaa            render=7.8 ms draws=298 tris=6.21M
  no-god-rays        render=8.2 ms draws=301 tris=6.21M
  no-film-grade      render=8.1 ms draws=301 tris=6.21M
  no-postprocessing  render=7.4 ms draws=270 tris=6.06M
  no-reflections     render=7.9 ms draws=227 tris=5.14M

Frame attribution:
  frame max: 1052.4 ms
  largest labelled hitch: 25.7 ms
  unattributed: 1026.7 ms

Long frames:
  threshold: 80 ms
  count: 17
  worst: 1052.4 ms

Raw sidecar:
  sampling=full factor=1 exported=437/437

Recommendation:
Largest frame (1052.4 ms) is not explained by labelled hitches (largest 25.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 2.0 ms/frame
  crowd pass: 0.0 ms/frame (4.5 ms cumulative)
  agent updates: 0.8 ms/frame (365.9 ms cumulative)
  livestock: 0.5 ms/frame (212.1 ms cumulative)
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
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 13.4
    unique animals/frame: 13.1
    duplicate updates/frame: 0.3
    detached animals/frame: 0.0
    dog updates/frame: 2.4
    dog guard scans: 2.4/frame (19.5 predator candidates/frame)
    pest scans: 1.1/frame (1.1 rat candidates/frame)
    nearest scans: 6.1/frame (0.0 candidates/frame)
    water samples: 11.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 11.5/frame, 0.00 ms/frame (worst call 0.10 ms, 892.2 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 13.3
    behaviour executions/frame: 6.2
    presentation executions/frame: 5.7
  rats: 0.2 ms/frame (66.3 ms cumulative)
  social: 0.0 ms/frame (2.9 ms cumulative)
  streaming: 0.3 ms/frame (136.4 ms cumulative)
  maintenance: 0.1 ms/frame (62.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.0 ms/frame (872.1 ms cumulative)
  forest sampling: 0.1 ms/frame (44.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.8 ms cumulative)
    targeting: 0.0 ms/frame (9.1 ms cumulative)
    decision: 0.0 ms/frame (7.4 ms cumulative)
    behaviour: 1.2 ms/frame (538.1 ms cumulative)
    life/presentation: 0.4 ms/frame (193.4 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.5
    expensive behaviour agents/frame: 17.4
    full-rate agents/frame: 7.3
    reduced-cadence agents/frame: 23.0
    behaviour executions/frame: 17.9
    presentation executions/frame: 16.9

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 19.2
    village scan candidates/frame: 247.6
    player perception checks/frame: 30.3

  nearest scans: 24.4/frame (10663 calls)
  nearest candidates checked: 122.3/frame (53428 total)
  herd leader scans: 0.3/frame (113 calls)
  herd candidates checked: 7.8/frame (3390 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.1/frame (149.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 68.6/frame, 0.10 ms/frame (worst call 0.50 ms)
    collider queries: 68.6/frame, 0.10 ms/frame (worst call 1.50 ms, 3469.8 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 75
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.18 ms
    max 0.70 ms

  allocation/setup:
    avg 0.11 ms
    max 0.60 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.02 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.35 ms
    max 1.30 ms

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
    allocation/setup avg/max: 0.06 / 0.30 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.04 / 0.50 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.08 / 0.20 ms
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
Frames: 442
Shadow refresh frames: 273
Shadow skipped frames: 169

Mirror:
  calls avg: 122  tris avg: 939160
  info calls avg: 122  residual calls avg: 0
  environment                  calls=5 tris=4796
  items                        calls=1 tris=416
  other                        calls=19 tris=4916
  settlement:decor             calls=4 tris=10351
  settlement:fence             calls=1 tris=1638
  settlement:fireCampfire      calls=2 tris=138
  settlement:fireHouseExteriorLamp calls=4 tris=183
  settlement:fireHouseInteriorLamp calls=1 tris=138
  settlement:fireVillageTorch  calls=5 tris=383
  settlement:houseInteractive  calls=4 tris=421
  settlement:houseStatic       calls=10 tris=8634
  settlement:landmarkGarden    calls=2 tris=16881
  settlement:landmarkNoticeBoard calls=1 tris=10
  settlement:landmarkWellCentral calls=1 tris=522
  settlement:landmarkWellHousehold calls=2 tris=1609
  settlement:landmarkWellPasture calls=1 tris=444
  settlement:other             calls=3 tris=49
  settlement:storageBarrel     calls=2 tris=3213
  settlement:storageContainer  calls=8 tris=590
  settlement:storageGoods      calls=10 tris=2061
  settlement:storageHay        calls=0 tris=128
  settlement:storageTrough     calls=1 tris=397
  settlement:storageWoodHousehold calls=0 tris=1352
  settlement:storageWoodSettlementPrimary calls=0 tris=226
  settlement:workplace         calls=2 tris=1023
  terrain                      calls=6 tris=420782
  vegetation                   calls=27 tris=458027

Shadow (refresh only):
  calls avg: 201  tris avg: 2401756
  info calls avg: 201  residual calls avg: 0
  environment                  calls=13 tris=8443
  faunaFamily:boar             calls=1 tris=254
  faunaFamily:cow              calls=1 tris=251
  faunaFamily:horse            calls=0 tris=120
  faunaFamily:rabbit           calls=0 tris=230
  faunaFamily:rat              calls=0 tris=367
  faunaFamily:sheep            calls=0 tris=31
  faunaFamily:stag             calls=2 tris=1331
  items                        calls=4 tris=2050
  npcFamily:Knight_Cloth       calls=1 tris=1127
  npcFamily:Peasant            calls=1 tris=1014
  npcFamily:Peasant_Boots      calls=0 tris=537
  npcFamily:woodcutter         calls=0 tris=475
  other                        calls=37 tris=9633
  settlement:decor             calls=43 tris=88030
  settlement:fireHouseInteriorLamp calls=0 tris=48
  settlement:houseInteractive  calls=1 tris=148
  settlement:houseStatic       calls=7 tris=3142
  settlement:landmarkGarden    calls=0 tris=190
  settlement:landmarkNoticeBoard calls=0 tris=9
  settlement:landmarkWellCentral calls=1 tris=445
  settlement:other             calls=1 tris=29
  settlement:storageContainer  calls=2 tris=233
  settlement:storageHay        calls=0 tris=107
  settlement:storageTrough     calls=1 tris=132
  settlement:storageWoodHousehold calls=0 tris=526
  settlement:storageWoodSettlementPrimary calls=0 tris=171
  settlement:workplace         calls=1 tris=751
  terrain                      calls=18 tris=1361555
  vegetation                   calls=62 tris=920379

Main:
  calls avg: 447  tris avg: 7792084
  info calls avg: 580  residual calls avg: 0
  environment                  calls=38 tris=13101
  faunaFamily:bear             calls=1 tris=451
  faunaFamily:chicken          calls=4 tris=564
  faunaFamily:cow              calls=0 tris=93
  faunaFamily:dog              calls=8 tris=2753
  faunaFamily:rabbit           calls=0 tris=95
  faunaFamily:rat              calls=1 tris=2198
  faunaFamily:sheep            calls=3 tris=961
  faunaFamily:stag             calls=1 tris=565
  faunaFamily:wolf             calls=1 tris=493
  grass                        calls=34 tris=4419423
  items                        calls=41 tris=4482
  npcFamily:Farmer             calls=6 tris=8314
  npcFamily:Knight_Cloth       calls=4 tris=4965
  npcFamily:Peasant            calls=27 tris=32597
  npcFamily:Peasant_Boots      calls=4 tris=5752
  npcFamily:blacksmith         calls=5 tris=6738
  other                        calls=55 tris=14149
  settlement:decor             calls=7 tris=17679
  settlement:fence             calls=2 tris=3261
  settlement:fireCampfire      calls=3 tris=270
  settlement:fireHouseExteriorLamp calls=8 tris=362
  settlement:fireHouseInteriorLamp calls=3 tris=272
  settlement:fireVillageTorch  calls=11 tris=765
  settlement:houseInteractive  calls=8 tris=831
  settlement:houseStatic       calls=16 tris=14428
  settlement:landmarkGarden    calls=3 tris=32677
  settlement:landmarkNoticeBoard calls=1 tris=21
  settlement:landmarkWellCentral calls=3 tris=1070
  settlement:landmarkWellHousehold calls=3 tris=3198
  settlement:landmarkWellPasture calls=2 tris=884
  settlement:other             calls=5 tris=97
  settlement:storageBarrel     calls=4 tris=6353
  settlement:storageContainer  calls=15 tris=1163
  settlement:storageGoods      calls=20 tris=4101
  settlement:storageHay        calls=1 tris=247
  settlement:storageTrough     calls=3 tris=784
  settlement:storageWoodHousehold calls=1 tris=2666
  settlement:storageWoodSettlementPrimary calls=1 tris=441
  settlement:workplace         calls=5 tris=2069
  terrain                      calls=23 tris=1709166
  vegetation                   calls=61 tris=908769
  water                        calls=9 tris=563154


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

[LONG FRAME] 1052.4ms
simulate         6.1ms
render        1045.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.3ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER        1040.0ms
OTHER            4.5ms

Long frame #2:

[LONG FRAME] 322.9ms
simulate        68.6ms
render         253.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          234.6ms
STREAMING       51.7ms
NPC              5.3ms
FAUNA            7.1ms
PHYSICS          0.2ms
RENDER          18.4ms
OTHER            5.6ms

streaming / stages:
  chunkUpdate                  51.7ms
  riverTileBuild               48.9ms
  terrainPrepare               1.2ms
  riverChannelSegmentsNear     0.5ms

Long frame #3:

[LONG FRAME] 245.6ms
simulate         7.9ms
render         236.4ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.7ms
STREAMING        1.7ms
NPC              1.4ms
FAUNA            0.9ms
PHYSICS          0.2ms
RENDER         231.7ms
OTHER            4.9ms

streaming / stages:
  chunkUpdate                  1.7ms

Long frame #4:

[LONG FRAME] 211.5ms
simulate        22.3ms
render         187.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       12.1ms
NPC             10.5ms
FAUNA            4.0ms
PHYSICS          0.8ms
RENDER         187.4ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              10.7ms
  chunkFinalize                0.8ms
  chunkUpdate                  0.8ms
  riverFinalize                0.2ms
  waterFinalize                0.1ms

hitches:
  STREAMING chunk mesh             10.7ms

Long frame #5:

[LONG FRAME] 211.4ms
simulate         8.6ms
render         202.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        2.0ms
NPC              1.7ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER         202.3ms
OTHER            4.1ms

streaming / stages:
  contentFinalize              2.0ms
  chunkFinalize                2.0ms
  chunkUpdate                  2.0ms

---

[Seedvale Program Census]

Programs created: 128
Program count: final=128 max=128

By frame:
  frame 0   +75 programs   <== largest transition
  frame 5   +1 program
  frame 95   +1 program
  frame 97   +3 programs
  frame 107   +1 program
  frame 110   +1 program
  frame 115   +1 program
  frame 207   +1 program
  frame 912   +15 programs
  frame 913   +3 programs
  frame 957   +4 programs
  frame 1169   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=578829a1-3482-480f-b414-e108193650ee (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=85a63090-cb67-4710-b1b2-566973d2e18e
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=037ca274-be2a-42aa-a35a-7e7f74cf1e1b
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cc1267e1-5c4d-4592-8d4a-c2e9e643134c
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7878040c-162d-49c2-b62c-34539935d89d
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=01276d4a-b137-44f8-aefb-68a6ee93d7c6
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0aa73757-d069-4104-be7e-0b6ca3e6f935
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=a6c52235-c264-4927-b8a6-167361323d78
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=103ab368-9866-4217-a8b5-5e6b9e763a25
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=749c02e3-838e-4399-a753-fed2c1698c5a (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=96452db7-f106-4b43-885b-e22873b52b9d
  #13 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=beda0424-851a-4c39-b9bd-3af2e375b0aa (None)
  #14 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2cf1345a-ec29-45ec-b600-163532337928 (Flowers)
  #15 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e7c22ca0-6721-442d-b029-a775ca1b5a2f (Green)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2f1168d5-b63e-4fed-b7da-56547f032226 (Stone)
  #17 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=eeb25e1c-7f9f-4dc8-86bb-bf28c4720dbf (Pink)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=01176bb0-27c7-46b4-993b-e8ad7d63d2ba (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=20cff7f5-bdd9-447f-911c-f57e33d620e5 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=62073229-b42d-427a-b8c8-74eafec817f0 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=29b0b790-2eb0-40b4-8bfa-51be295f5bff (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=84bc97ce-541c-4647-8fa6-13c152f8c3cf (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=24d4f0bb-8348-4532-b5d1-bdc5f719a89e (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4744b93c-5a1c-4439-9176-af195f4c1c08 (MI_WoodTrim)
  #26 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #27 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=447305d1-46d0-4fd9-a321-273758afee81 (MI_WindowGlass)
  #28 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #29 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d6cdd640-0d50-47f9-8d25-49e2956e0b1d (Main)
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=acd6a670-3754-4aad-a796-9e50a38ef275 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=02836360-783a-4e3c-acda-ddcb703024c6 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=18fffc74-1ad8-49ad-bb8a-8ef7ac87a460 (MI_Hair_1)
  #34 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #44 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0d638d73-0a01-442d-b4bd-5396fc6214e8 (Green)
  #45 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=1eb7a4d3-be15-4892-9137-00f8658c7f42 (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=811e9efa-b06c-4cef-8c8f-377ab27b8065 (MapleTree_Leaves)
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9f9712d8-1c52-483d-87f4-93893b1147f2 (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=71f12e94-ec4c-4d70-b9cb-57ddc7636350
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=dde8838c-6d2c-45da-8ee4-84b770b67995 (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e2daabde-d17b-4b8e-971b-05ffd4e9709c (DarkGreen)
  #51 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8e2b0cb1-acb1-4bbd-9329-c7917982fc83 (Pond_Pack_MAT)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6edcf47a-0704-482c-be4a-e58c0329c3dd (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=45f2bc69-01c2-4aa5-adc0-d67223e07cdb (MI_Eyes)
  #54 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=063164e9-50a6-4370-a114-1f961bca792b (PathRocks)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=64436321-279b-4c62-8c39-29de4135641f (MI_Hair_1)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=37d30ebf-8e68-49e9-9f38-f91aed763aa8 (MI_Peasant)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #28=df7c703d, #29=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #28=236b3b0b, #29=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #28=(unset), #29=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=6db98a06, #14=e4cbf8ca, #15=c0d790d1, #16=a9733c9d, #17=d3fd7a87, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=12873951, #26=fc941d05, #27=e551c572, #30=fd8301ed, #31=842fe1df, #32=ac268392, #33=1c179521, #44=190d3a9c, #45=2f7179e3, #46=3bea20f6, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=c3bc6325, #52=20daccfa, #53=1dcbc6ff, #54=b643916d, #55=cde317ee, #56=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=efed8e98, #14=135696d3, #15=a81023c3, #16=bd723c8a, #17=2eae9a54, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=d4c95125, #26=3ab4c629, #27=2d1aa4a, #30=2f2885d5, #31=34995f15, #32=25a41317, #33=71f22dc6, #44=633146b4, #45=943c7b97, #46=5b26a60d, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=ded4be89, #52=a8862f4a, #53=1a1c0d8, #54=754b87bd, #55=512afd6f, #56=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=environment, #14=vegetation, #15=vegetation, #16=environment, #17=vegetation, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=(unknown), #27=settlement, #30=fauna, #31=other, #32=other, #33=other, #44=settlement, #45=settlement, #46=settlement, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=other, #54=settlement, #55=npc, #56=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=(unset), #27=, #30=, #31=, #32=, #33=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0.45, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=(unknown), #27=0, #30=0, #31=0, #32=0, #33=0, #44=0, #45=0, #46=0.45, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=(unknown), #27=true, #30=true, #31=true, #32=true, #33=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=true, #32=true, #33=true, #44=false, #45=true, #46=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=true, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=(unknown), #27=true, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=true, #32=true, #33=false, #44=false, #45=false, #46=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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
    vertexShaderHash differs: #34=59ed5d71, #35=2efa42a8, #36=b69ba143, #37=2e7a6fcb, #38=585a1ea4, #39=c203b19a, #40=c203b19a, #41=585a1ea4, #42=263c45d6, #43=e4717b03
    fragmentShaderHash differs: #34=d729897e, #35=41e40a66, #36=d729897e, #37=758a4164, #38=41e40a66, #39=41e40a66, #40=a9dd0dee, #41=a9dd0dee, #42=d729897e, #43=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 912 (+15):
  Program #84
    material: MeshStandardMaterial ''
    materialUuid: 037ca274-be2a-42aa-a35a-7e7f74cf1e1b
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #85
    material: MeshStandardMaterial 'Wood'
    materialUuid: 6bb10d15-be98-471f-b522-578d1136ee36
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #86
    material: MeshStandardMaterial 'Green'
    materialUuid: a6a57158-8fdd-4f4a-a670-b82c92296d2b
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
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: 7c8b80fe-8db0-4434-a38c-f40b69c18aa2
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
    material: MeshStandardMaterial 'Berry'
    materialUuid: 45baf7e7-300d-4b98-b012-f3a74b8ca039
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #89
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 1eb7a4d3-be15-4892-9137-00f8658c7f42
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1bd8d9e3
    fragmentShaderHash: e2f189d1
  Program #90
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 2cf1345a-ec29-45ec-b600-163532337928
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
  Program #91
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: f2a0af74-0d26-48d6-9795-f385f6400b28
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #92
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 26033451-bf6e-437e-b5ed-336ea362efb8
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
  Program #93
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 9f9712d8-1c52-483d-87f4-93893b1147f2
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #94
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 6edcf47a-0704-482c-be4a-e58c0329c3dd
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #95
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 45f2bc69-01c2-4aa5-adc0-d67223e07cdb
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #96
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: acd6a670-3754-4aad-a796-9e50a38ef275
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #97
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 02836360-783a-4e3c-acda-ddcb703024c6
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 18fffc74-1ad8-49ad-bb8a-8ef7ac87a460
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1169 (+22):
  Program #106
    material: ShaderMaterial 'SkyShader'
    materialUuid: 578829a1-3482-480f-b414-e108193650ee
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #107
    material: ShaderMaterial ''
    materialUuid: 01276d4a-b137-44f8-aefb-68a6ee93d7c6
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #108
    material: MeshStandardMaterial ''
    materialUuid: 037ca274-be2a-42aa-a35a-7e7f74cf1e1b
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #109
    material: MeshStandardMaterial 'Wood'
    materialUuid: 6bb10d15-be98-471f-b522-578d1136ee36
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #110
    material: MeshStandardMaterial 'Green'
    materialUuid: a6a57158-8fdd-4f4a-a670-b82c92296d2b
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
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: 7c8b80fe-8db0-4434-a38c-f40b69c18aa2
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
    material: MeshStandardMaterial 'Berry'
    materialUuid: 45baf7e7-300d-4b98-b012-f3a74b8ca039
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #113
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 1eb7a4d3-be15-4892-9137-00f8658c7f42
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ab1dd48f
    fragmentShaderHash: 8661e8c2
  Program #114
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 2cf1345a-ec29-45ec-b600-163532337928
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
  Program #115
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: f2a0af74-0d26-48d6-9795-f385f6400b28
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #116
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 26033451-bf6e-437e-b5ed-336ea362efb8
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
  Program #117
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 9f9712d8-1c52-483d-87f4-93893b1147f2
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #118
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 6edcf47a-0704-482c-be4a-e58c0329c3dd
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #119
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 45f2bc69-01c2-4aa5-adc0-d67223e07cdb
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #120
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: acd6a670-3754-4aad-a796-9e50a38ef275
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #121
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 02836360-783a-4e3c-acda-ddcb703024c6
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #122
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 18fffc74-1ad8-49ad-bb8a-8ef7ac87a460
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #123
    material: ShaderMaterial ''
    materialUuid: 0aa73757-d069-4104-be7e-0b6ca3e6f935
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #124
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #125
    material: MeshBasicMaterial ''
    materialUuid: 103ab368-9866-4217-a8b5-5e6b9e763a25
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #126
    material: ShaderMaterial ''
    materialUuid: cb0ada31-d7b4-479b-81ba-118aa687623f
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #127
    material: ShaderMaterial ''
    materialUuid: c4f1d671-c430-45b5-96e0-af4fa73d5867
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
Excluded — no reliable per-program timing: 122 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 5
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 204.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 95
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 1035.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 107
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 232.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 110
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 182.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 115
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 85.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 207
  #83
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 95.9 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 1835.8 ms
  programs >1 ms: 6
  max: 1035.3 ms (#76)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=8.2 ms  p95=10.0 ms  max=11.7 ms  Δavg vs baseline=—
  hide-grass           avg=7.7 ms  p95=9.0 ms  max=9.2 ms  Δavg vs baseline=-0.5 ms (-6%)
  hide-vegetation      avg=6.9 ms  p95=8.1 ms  max=9.4 ms  Δavg vs baseline=-1.3 ms (-16%)
  no vegetation/grass  avg=6.5 ms  p95=7.9 ms  max=8.4 ms  Δavg vs baseline=-1.7 ms (-21%)
  hide-environment     avg=7.8 ms  p95=9.0 ms  max=9.7 ms  Δavg vs baseline=-0.4 ms (-5%)
  hide-settlement      avg=7.4 ms  p95=9.1 ms  max=10.0 ms  Δavg vs baseline=-0.9 ms (-10%)
  no water             avg=7.8 ms  p95=9.2 ms  max=9.9 ms  Δavg vs baseline=-0.4 ms (-5%)
  hide-terrain         avg=7.7 ms  p95=9.7 ms  max=9.7 ms  Δavg vs baseline=-0.5 ms (-6%)
  hide-npc-fauna       avg=6.3 ms  p95=8.1 ms  max=8.3 ms  Δavg vs baseline=-1.9 ms (-23%)
  no-shadows           avg=7.6 ms  p95=8.6 ms  max=8.8 ms  Δavg vs baseline=-0.7 ms (-8%)
  no-ao                avg=7.6 ms  p95=9.8 ms  max=10.3 ms  Δavg vs baseline=-0.6 ms (-7%)
  no-bloom             avg=7.8 ms  p95=9.3 ms  max=10.2 ms  Δavg vs baseline=-0.4 ms (-5%)
  no-smaa              avg=7.8 ms  p95=9.5 ms  max=10.1 ms  Δavg vs baseline=-0.4 ms (-5%)
  no-god-rays          avg=8.2 ms  p95=9.8 ms  max=10.0 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-film-grade        avg=8.1 ms  p95=9.9 ms  max=11.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=7.4 ms  p95=8.6 ms  max=8.7 ms  Δavg vs baseline=-0.8 ms (-10%)
  no mirrors           avg=7.9 ms  p95=9.3 ms  max=11.1 ms  Δavg vs baseline=-0.4 ms (-4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=24.8 ms  p95=28.9 ms  max=29.8 ms
  CPU wall      avg=8.2 ms  p95=10.0 ms  max=11.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
