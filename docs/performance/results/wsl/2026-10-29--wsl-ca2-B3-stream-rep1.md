# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T21:15:31.928Z
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
Frames: 591
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0cfb9ed3548021fbb5d0e96e462211d300ef8cac
  runId: 2026-10-29T21-14-36-833Z-ufkd5q
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
  camera: pos=(426.7, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5061ms npc=20
  gpuTimer: available=true resolved=true samples=594 span=postprocess+labels

FPS:
  avg: 44.9
  min: 1
  p1: 8

Frame time (wall-clock):
  avg: 22.3 ms
  p50: 17.7 ms
  p95: 42.4 ms
  p99: 129.2 ms
  max: 709.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.1 p95=12.6 p99=41.8 max=92.3 n=591
  render: p50=12.8 p95=23 p99=121.8 max=701.9 n=591
  frame: p50=17.7 p95=42.4 p99=129.2 max=709.9 n=591

Rendering (combined renderer.info):
  draw calls: 817 avg / 2115 max
  triangles: 8.91M avg
  mirror draws: 147 avg
  geometries: 744
  textures: 534

Pass submissions (actual):
  reliability: observed
  frames: 597 shadowRefresh=316 shadowSkipped=281
  mirror calls avg: 146
  shadow calls avg: 228
  main calls avg: 534

Scene (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  grass            draws=50 tris=836.9k meshes=50 inst=98785
  vegetation       draws=249 tris=23.7k meshes=249 inst=1144
  environment      draws=141 tris=6.9k meshes=141 inst=156
  settlement       draws=661 tris=285.2k meshes=661 inst=1148
  water            draws=51 tris=3.69M meshes=51 inst=51
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=359 tris=32.6k meshes=359 inst=359
  other            draws=230 tris=25.9k meshes=230 inst=230

Shadow casters (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  vegetation       draws=206 tris=20.0k meshes=206 inst=1008
  environment      draws=114 tris=2.6k meshes=114 inst=123
  settlement       draws=454 tris=96.1k meshes=454 inst=904
  items            draws=46 tris=26.1k meshes=46 inst=46
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
  workplace        draws=6 tris=756 meshes=6 inst=6
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=9 tris=972 meshes=9 inst=9
  fireCampfire     draws=11 tris=348 meshes=11 inst=11
  decor            draws=236 tris=14.4k meshes=236 inst=319
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
  terrain                  nodes=72 composed=72 multiplied=72 skinned=0
  grass                    nodes=65 composed=65 multiplied=65 skinned=0
  vegetation               nodes=290 composed=290 multiplied=290 skinned=0
  environment              nodes=204 composed=204 multiplied=204 skinned=0
  settlement               nodes=1163 composed=1163 multiplied=1163 skinned=0
  water                    nodes=51 composed=51 multiplied=51 skinned=0
  npc                      nodes=1486 composed=1486 multiplied=1486 skinned=174
  fauna                    nodes=2288 composed=2288 multiplied=2288 skinned=188
  items                    nodes=561 composed=561 multiplied=561 skinned=0
  other                    nodes=442 composed=425 multiplied=442 skinned=9
  top scene children:
    fauna ×51                nodes=2288 composed=2288 multiplied=2288 skinned=188
    npc ×19                  nodes=1486 composed=1486 multiplied=1486 skinned=174
    settlement ×3            nodes=1163 composed=1163 multiplied=1163 skinned=0
    chunk-items ×36          nodes=552 composed=552 multiplied=552 skinned=0
    Group ×37                nodes=260 composed=260 multiplied=260 skinned=9
    chunk-environmen ×3      nodes=143 composed=143 multiplied=143 skinned=0
    chunk ×72                nodes=72 composed=72 multiplied=72 skinned=0
    chunk-grass ×15          nodes=65 composed=65 multiplied=65 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    chunk-water ×50          nodes=50 composed=50 multiplied=50 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          2.1 ms
  STREAMING      1.8 ms
  NPC            1.7 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         13.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. STREAMING

Critical spikes:
  STREAMING: 9
  WATER: 5

Hitches (>= 8 ms): total=14
  chunk mesh             n=9 avg=17.9 max=27.9
  chunk water            n=5 avg=10.9 max=15.8

Isolation probes:
  full               render=7.3 ms draws=318 tris=4.39M
  hide-grass         render=7.0 ms draws=295 tris=3.35M
  hide-vegetation    render=6.1 ms draws=174 tris=4.36M
  hide-vegetation-grass render=6.0 ms draws=148 tris=3.33M
  hide-environment   render=7.0 ms draws=288 tris=4.36M
  hide-settlement    render=6.4 ms draws=295 tris=4.32M
  hide-water         render=6.9 ms draws=307 tris=3.40M
  hide-terrain       render=6.9 ms draws=292 tris=2.10M
  hide-npc-fauna     render=5.6 ms draws=321 tris=4.37M
  no-shadows         render=6.9 ms draws=316 tris=4.27M
  no-ao              render=6.9 ms draws=312 tris=4.39M
  no-bloom           render=6.8 ms draws=311 tris=4.42M
  no-smaa            render=7.0 ms draws=321 tris=4.42M
  no-god-rays        render=7.6 ms draws=324 tris=4.42M
  no-film-grade      render=7.4 ms draws=324 tris=4.42M
  no-postprocessing  render=6.9 ms draws=301 tris=4.42M
  no-reflections     render=7.4 ms draws=244 tris=3.98M

Frame attribution:
  frame max: 709.9 ms
  largest labelled hitch: 27.9 ms
  unattributed: 682 ms

Long frames:
  threshold: 80 ms
  count: 15
  worst: 709.9 ms

Raw sidecar:
  sampling=full factor=1 exported=591/591

Recommendation:
Largest frame (709.9 ms) is not explained by labelled hitches (largest 27.9 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.7 ms/frame
  crowd pass: 0.0 ms/frame (6.0 ms cumulative)
  agent updates: 0.8 ms/frame (489.1 ms cumulative)
  livestock: 0.4 ms/frame (210.2 ms cumulative)
    loaded tick: 0.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 14.1
    unique animals/frame: 13.8
    duplicate updates/frame: 0.3
    detached animals/frame: 0.0
    dog updates/frame: 2.7
    dog guard scans: 2.7/frame (21.8 predator candidates/frame)
    pest scans: 1.2/frame (1.2 rat candidates/frame)
    nearest scans: 6.3/frame (0.0 candidates/frame)
    water samples: 9.8/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 9.8/frame, 0.00 ms/frame (worst call 0.10 ms, 698.3 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 14.1
    behaviour executions/frame: 6.3
    presentation executions/frame: 5.8
  rats: 0.1 ms/frame (75.6 ms cumulative)
  social: 0.0 ms/frame (1.8 ms cumulative)
  streaming: 0.2 ms/frame (130.2 ms cumulative)
  maintenance: 0.1 ms/frame (68.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.3 ms/frame (776.4 ms cumulative)
  forest sampling: 0.1 ms/frame (60.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (15.9 ms cumulative)
    targeting: 0.0 ms/frame (8.9 ms cumulative)
    decision: 0.0 ms/frame (8.8 ms cumulative)
    behaviour: 0.7 ms/frame (403.5 ms cumulative)
    life/presentation: 0.4 ms/frame (213.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 7.2
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 17.8
    presentation executions/frame: 16.8

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 22.3
    village scan candidates/frame: 259.6
    player perception checks/frame: 30.3

  nearest scans: 25.5/frame (15047 calls)
  nearest candidates checked: 139.0/frame (82169 total)
  herd leader scans: 0.3/frame (185 calls)
  herd candidates checked: 9.4/frame (5550 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.9/frame (163.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 49.5/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 49.5/frame, 0.00 ms/frame (worst call 0.20 ms, 928.1 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 77
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.21 ms
    max 1.90 ms

  allocation/setup:
    avg 0.05 ms
    max 0.30 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.20 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.40 ms
    max 2.40 ms

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
    allocation/setup avg/max: 0.04 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.05 / 1.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.02 / 0.10 ms
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
Resident instances: full=333014 filler=289574
Submitted instances: full=76794 filler=21989
Meshes submitted: 48
LOD submitted fraction: full=0.23060291759505605 filler=0.07593568483358312
Flowers: unavailable
Allocation bytes (estimated): 59768448
Upload bytes (observed): unavailable
Lifecycle: req=30 complete=30 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=21 invalidate=0
Finalization: observed completions=30

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 597
Shadow refresh frames: 316
Shadow skipped frames: 281

Mirror:
  calls avg: 146  tris avg: 488454
  info calls avg: 146  residual calls avg: 0
  environment                  calls=7 tris=1750
  items                        calls=1 tris=498
  other                        calls=25 tris=4820
  settlement:decor             calls=5 tris=2255
  settlement:fence             calls=1 tris=1971
  settlement:fireCampfire      calls=4 tris=102
  settlement:fireHouseExteriorLamp calls=5 tris=221
  settlement:fireHouseInteriorLamp calls=2 tris=166
  settlement:fireVillageTorch  calls=6 tris=457
  settlement:houseInteractive  calls=5 tris=506
  settlement:houseStatic       calls=11 tris=10003
  settlement:landmarkGarden    calls=2 tris=20657
  settlement:landmarkNoticeBoard calls=1 tris=12
  settlement:landmarkWellCentral calls=2 tris=620
  settlement:landmarkWellHousehold calls=2 tris=1911
  settlement:landmarkWellPasture calls=1 tris=539
  settlement:other             calls=3 tris=58
  settlement:storageBarrel     calls=2 tris=3709
  settlement:storageContainer  calls=9 tris=682
  settlement:storageGoods      calls=12 tris=2469
  settlement:storageHay        calls=0 tris=156
  settlement:storageTrough     calls=1 tris=458
  settlement:storageWoodHousehold calls=0 tris=1557
  settlement:storageWoodSettlementPrimary calls=0 tris=264
  settlement:workplace         calls=3 tris=1231
  terrain                      calls=6 tris=425240
  vegetation                   calls=28 tris=6314

Shadow (refresh only):
  calls avg: 228  tris avg: 1403420
  info calls avg: 228  residual calls avg: 0
  environment                  calls=4 tris=256
  faunaFamily:cow              calls=1 tris=411
  faunaFamily:horse            calls=1 tris=214
  faunaFamily:rabbit           calls=1 tris=431
  faunaFamily:rat              calls=0 tris=443
  faunaFamily:sheep            calls=0 tris=27
  faunaFamily:stag             calls=4 tris=2392
  faunaFamily:wolf             calls=0 tris=130
  items                        calls=4 tris=2085
  npcFamily:Knight_Cloth       calls=1 tris=1866
  npcFamily:Peasant            calls=1 tris=1643
  npcFamily:Peasant_Boots      calls=0 tris=502
  npcFamily:woodcutter         calls=0 tris=445
  other                        calls=41 tris=10090
  settlement:decor             calls=68 tris=2828
  settlement:fireHouseInteriorLamp calls=1 tris=69
  settlement:houseInteractive  calls=1 tris=209
  settlement:houseStatic       calls=9 tris=4062
  settlement:landmarkGarden    calls=0 tris=258
  settlement:landmarkNoticeBoard calls=1 tris=12
  settlement:landmarkWellCentral calls=2 tris=609
  settlement:other             calls=2 tris=42
  settlement:storageContainer  calls=3 tris=304
  settlement:storageHay        calls=0 tris=153
  settlement:storageTrough     calls=1 tris=167
  settlement:storageWoodHousehold calls=0 tris=662
  settlement:storageWoodSettlementPrimary calls=0 tris=244
  settlement:workplace         calls=1 tris=85
  terrain                      calls=18 tris=1362447
  vegetation                   calls=60 tris=10333

Main:
  calls avg: 534  tris avg: 7632560
  info calls avg: 666  residual calls avg: 0
  environment                  calls=58 tris=5052
  faunaFamily:bear             calls=1 tris=541
  faunaFamily:chicken          calls=5 tris=707
  faunaFamily:cow              calls=0 tris=100
  faunaFamily:dog              calls=10 tris=3371
  faunaFamily:horse            calls=0 tris=18
  faunaFamily:rabbit           calls=0 tris=177
  faunaFamily:rat              calls=1 tris=2562
  faunaFamily:sheep            calls=4 tris=1089
  faunaFamily:stag             calls=0 tris=76
  faunaFamily:wolf             calls=1 tris=569
  grass                        calls=36 tris=5164875
  items                        calls=45 tris=5084
  npcFamily:Farmer             calls=7 tris=9685
  npcFamily:Knight_Cloth       calls=5 tris=6276
  npcFamily:Peasant            calls=31 tris=38603
  npcFamily:Peasant_Boots      calls=5 tris=7002
  npcFamily:blacksmith         calls=6 tris=8290
  other                        calls=68 tris=14312
  settlement:decor             calls=10 tris=4440
  settlement:fence             calls=3 tris=3930
  settlement:fireCampfire      calls=9 tris=201
  settlement:fireHouseExteriorLamp calls=9 tris=436
  settlement:fireHouseInteriorLamp calls=3 tris=329
  settlement:fireVillageTorch  calls=13 tris=912
  settlement:houseInteractive  calls=9 tris=1004
  settlement:houseStatic       calls=19 tris=17281
  settlement:landmarkGarden    calls=4 tris=40255
  settlement:landmarkNoticeBoard calls=1 tris=24
  settlement:landmarkWellCentral calls=3 tris=1262
  settlement:landmarkWellHousehold calls=4 tris=3803
  settlement:landmarkWellPasture calls=3 tris=1078
  settlement:other             calls=6 tris=115
  settlement:storageBarrel     calls=5 tris=7363
  settlement:storageContainer  calls=18 tris=1355
  settlement:storageGoods      calls=24 tris=4927
  settlement:storageHay        calls=1 tris=299
  settlement:storageTrough     calls=3 tris=912
  settlement:storageWoodHousehold calls=1 tris=3091
  settlement:storageWoodSettlementPrimary calls=1 tris=520
  settlement:workplace         calls=6 tris=2454
  terrain                      calls=24 tris=1735697
  vegetation                   calls=67 tris=12735
  water                        calls=8 tris=520089


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 15
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 15 total):

[LONG FRAME] 709.9ms
simulate         6.9ms
render         701.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.2ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER         701.9ms
OTHER            4.1ms

Long frame #2:

[LONG FRAME] 167.1ms
simulate        27.8ms
render         139.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.1ms
STREAMING        0.0ms
NPC             13.3ms
FAUNA            6.7ms
PHYSICS          0.2ms
RENDER         134.3ms
OTHER            7.5ms

Long frame #3:

[LONG FRAME] 149.6ms
simulate         5.5ms
render         144.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA            0.9ms
PHYSICS          0.2ms
RENDER         144.1ms
OTHER            2.9ms

Long frame #4:

[LONG FRAME] 146.8ms
simulate         6.3ms
render         138.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.0ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER         138.5ms
OTHER            5.4ms

Long frame #5:

[LONG FRAME] 137.9ms
simulate         6.4ms
render         131.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.9ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER         125.7ms
OTHER            3.0ms

---

[Seedvale Program Census]

Programs created: 114
Program count: final=114 max=114

By frame:
  frame 0   +71 programs   <== largest transition
  frame 130   +1 program
  frame 131   +1 program
  frame 135   +1 program
  frame 160   +1 program
  frame 236   +1 program
  frame 293   +1 program
  frame 1102   +12 programs
  frame 1103   +3 programs
  frame 1146   +3 programs
  frame 1365   +19 programs

Largest transition — frame 0 (+71 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8203cac5-4e62-4ed3-9e70-5b3ebe5ecc09 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5b3e470f-9159-4bf0-9855-a035266467a8
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=b71d45ea-e997-46fa-9dd5-525ff3d61be9
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dafb2ed1-240d-44b2-beb7-84805a3e21a3
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=76ceb6e7-c94e-4b79-8110-eb323762c812
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=95766d2a-7518-4424-b3f4-594fb57f7a10
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4e9a683f-34a0-4946-a0be-ff56c5e72bfb
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=11123d0f-ef3d-46c2-abbb-c075f38317ad
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f0bdf0bd-c7b3-4197-9aa2-334d4e2c77dd
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0b271667-fdf0-4f89-8f9d-518b1de6cae0 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2450b6c2-97ac-4a1c-9e1c-5fca1853573a
  #13 type=MeshStandardMaterial name='' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=23c3fd9e-9b7e-4e33-a46a-0a37ca950aee
  #14 type=MeshStandardMaterial name='' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=bc17343 fHash=d9be0b50 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=2b931c03-ad8c-4d59-ac4c-b78d685058d9
  #15 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2738bfc8-7586-422f-8fd8-2f9fb98626d2 (Main)
  #16 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e43c0b73-ac8b-4b59-bc87-c4e489f55ed4 (Material.001)
  #17 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=115a28a2-8612-4446-b70e-70e065ef1267 (lambert2SG)
  #18 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=aff1953c-1d4c-488f-8d08-4e0a5833dcc2 (Material #55)
  #19 type=MeshStandardMaterial name='Wood' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=643ad3a2 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=49b5339f-f2b0-45d7-96d7-3b8de0851ac2 (Wood)
  #20 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=57261e30-864b-4520-9e3d-5880faa12e62 (Green)
  #21 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=565808fc-d92a-47f9-a7e5-c910c1cf7df4 (MI_WoodTrim)
  #22 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #23 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9c40db89-3eb1-4615-aeda-b4a334a853aa (MI_WindowGlass)
  #24 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=432b6e0e-a40e-4833-bb5e-ae4aadd5a1ef (MI_WoodTrim)
  #25 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #26 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=693dc757-7f7e-4b35-a3c8-672bd1bfcedf (MI_WindowGlass)
  #27 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e37c9406 fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=62a78978-ce7a-47e9-b73b-f47d26c0ab7f (Wood_Light)
  #28 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #29 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3e5100cc-d999-4d48-aaa1-047675975166 (Main)
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0f870fdb-d904-47f2-9e7b-7f67968a93a0 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=de10cdb6-7e79-4fb4-b85a-1312aaf957b3 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=48dcba45-ef75-4eaa-bb9c-ebde4fe69dcc (MI_Hair_1)
  #34 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #41 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0dc83598-761f-4e87-afc5-b1e796206c23 (stockpiles_vc)
  #42 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=f28e59e3-994b-42bf-8cae-abb4361ecfd8
  #43 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=f2da6715-4eea-4f71-9c77-c249019a0025 (Handle)
  #44 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1b259322-ce70-42a3-9bdf-432a13db631d (DarkGreen)
  #45 type=MeshStandardMaterial name='Diffuse_Color' bucket=other cacheKey=physical,STANDARD,,highp… vHash=46e727b4 fHash=19e96258 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=52965363-32ab-462d-b87d-0606847f1f1a (Diffuse_Color)
  #46 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7a97f0e6-f0cf-48be-9099-1f8ac285c3ed (Pond_Pack_MAT)
  #47 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=094a0362-029d-4616-8d69-2459afd7ae6a (MI_Regular_Male)
  #48 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=5ebb4ab2 fHash=3d0711f8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=e1eb041a-1b9f-42ec-9a6e-3cdfa313cb83 (Green)
  #49 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6105be99-70c3-4629-87e3-5a545d052e84 (MI_Eyes)
  #50 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2a9f9189-76ad-43df-912f-4ecd2d5ac1c4 (MI_Hair_1)
  #51 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b1daf036-ab8f-419b-8dc9-270bcc478057 (PathRocks)
  #52 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ae3c29c5-7984-4a65-bced-d361dc323b8b (MI_Peasant)
  #53 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #54 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #55 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #56 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #69 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #70 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #28=df7c703d, #29=f92c8d8c, #53=279cec18, #54=84736a68, #55=aa2edbee, #56=7bae0bb2, #57=436caea4, #58=886438e7, #59=d99a5b29, #60=2003ced8, #61=28dfa407, #62=756a0b19, #63=b2354ff2, #64=ea82969e, #65=7dab8d9a, #66=378e1fb7, #67=78acf7ea, #68=a312c579, #69=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #28=236b3b0b, #29=87d053eb, #53=4d6bcede, #54=ffecb62a, #55=76ced00a, #56=fb55b3c0, #57=2d687ef1, #58=dc2a89b5, #59=109e33fc, #60=db0f470a, #61=9775cd0e, #62=5c741650, #63=2aad9943, #64=a2297d9f, #65=1022767b, #66=ce0bf6b4, #67=707f290c, #68=c05e2256, #69=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #28=(unset), #29=(unset), #53=(unset), #54=(unset), #55=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown)
  MeshStandardMaterial (33 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=66d360c8, #14=bc17343, #15=54e03756, #16=a99aa494, #17=7bb77142, #19=643ad3a2, #20=c0d790d1, #21=c5e73b05, #22=13a74ec7, #23=9dcf1cb4, #24=12873951, #25=fc941d05, #26=e551c572, #27=e37c9406, #30=fd8301ed, #31=842fe1df, #32=ac268392, #33=1c179521, #41=a64d124e, #42=94297e69, #43=3abb47a8, #44=9434da33, #45=46e727b4, #46=c3bc6325, #47=20daccfa, #48=5ebb4ab2, #49=1dcbc6ff, #50=cde317ee, #51=b643916d, #52=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=c0b8fc9f, #14=d9be0b50, #15=d391c52, #16=63f9c0d1, #17=87728b15, #19=6578c10d, #20=a81023c3, #21=d4c95125, #22=3ab4c629, #23=2d1aa4a, #24=d4c95125, #25=3ab4c629, #26=2d1aa4a, #27=c7daf23, #30=2f2885d5, #31=34995f15, #32=25a41317, #33=71f22dc6, #41=546e469, #42=aa0735a8, #43=85d3c28d, #44=77dfd097, #45=19e96258, #46=ded4be89, #47=a8862f4a, #48=3d0711f8, #49=1a1c0d8, #50=512afd6f, #51=754b87bd, #52=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=environment, #15=fauna, #16=fauna, #17=fauna, #19=settlement, #20=settlement, #21=settlement, #22=(unknown), #23=settlement, #24=settlement, #25=(unknown), #26=settlement, #27=settlement, #30=fauna, #31=other, #32=other, #33=other, #41=settlement, #42=other, #43=settlement, #44=other, #45=other, #46=other, #47=other, #48=settlement, #49=other, #50=npc, #51=settlement, #52=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #19=, #20=, #21=, #22=(unset), #23=, #24=, #25=(unset), #26=, #27=, #30=, #31=, #32=, #33=, #41=, #42=, #43=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #16=0, #17=0, #19=0, #20=0, #21=0, #22=(unknown), #23=0, #24=0, #25=(unknown), #26=0, #27=0, #30=0, #31=0, #32=0, #33=0, #41=0, #42=0, #43=0, #44=0, #45=0, #46=0, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=(unknown), #23=false, #24=false, #25=(unknown), #26=false, #27=false, #30=false, #31=false, #32=false, #33=false, #41=false, #42=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=(unknown), #23=false, #24=false, #25=(unknown), #26=false, #27=false, #30=false, #31=false, #32=false, #33=false, #41=false, #42=true, #43=true, #44=false, #45=false, #46=false, #47=false, #48=true, #49=false, #50=false, #51=false, #52=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #19=true, #20=true, #21=true, #22=(unknown), #23=true, #24=true, #25=(unknown), #26=true, #27=true, #30=true, #31=true, #32=true, #33=true, #41=true, #42=true, #43=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=true, #19=false, #20=false, #21=true, #22=(unknown), #23=false, #24=true, #25=(unknown), #26=false, #27=false, #30=false, #31=true, #32=true, #33=true, #41=false, #42=false, #43=false, #44=false, #45=true, #46=true, #47=true, #48=false, #49=true, #50=true, #51=true, #52=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=true, #22=(unknown), #23=false, #24=true, #25=(unknown), #26=false, #27=false, #30=false, #31=false, #32=false, #33=false, #41=false, #42=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=(unknown), #23=true, #24=false, #25=(unknown), #26=true, #27=false, #30=false, #31=false, #32=false, #33=false, #41=false, #42=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=true, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=(unknown), #23=false, #24=false, #25=(unknown), #26=false, #27=false, #30=false, #31=true, #32=true, #33=false, #41=true, #42=false, #43=false, #44=false, #45=false, #46=true, #47=true, #48=false, #49=true, #50=false, #51=false, #52=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=(unknown), #23=false, #24=false, #25=(unknown), #26=false, #27=false, #30=false, #31=false, #32=false, #33=false, #41=false, #42=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false
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
  MeshDepthMaterial (7 programs):
    vertexShaderHash differs: #34=59ed5d71, #35=2efa42a8, #36=b69ba143, #37=2e7a6fcb, #38=585a1ea4, #39=263c45d6, #40=e4717b03
    fragmentShaderHash differs: #34=d729897e, #35=41e40a66, #36=d729897e, #37=758a4164, #38=41e40a66, #39=d729897e, #40=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1102 (+12):
  Program #77
    material: MeshStandardMaterial ''
    materialUuid: b71d45ea-e997-46fa-9dd5-525ff3d61be9
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #78
    material: MeshStandardMaterial ''
    materialUuid: 0c37f0a9-24c5-4857-a8c2-421a4e68ca0b
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d7607dd2
    fragmentShaderHash: 83e94369
  Program #79
    material: MeshStandardMaterial 'Green'
    materialUuid: 639175e4-6543-44d3-9754-d25ae71b548b
    object: Mesh 'chunk-vegetation-region-1,0|tree-living-8:1'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519687,srgb,(shader, renderer) => {
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
    vertexShaderHash: 5d74bf7a
    fragmentShaderHash: 36a1c4f4
  Program #80
    material: MeshStandardMaterial ''
    materialUuid: 2b931c03-ad8c-4d59-ac4c-b78d685058d9
    object: Mesh 'chunk-environment-region-1,-1|rockCluster-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 173e6a8f
    fragmentShaderHash: 81522c3c
  Program #81
    material: MeshStandardMaterial 'Material'
    materialUuid: 23830f35-a0df-43df-a2e3-70d857c7342c
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ffd6113c
    fragmentShaderHash: ab492ef7
  Program #82
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 0dc83598-761f-4e87-afc5-b1e796206c23
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #83
    material: MeshStandardMaterial 'Wood_Light'
    materialUuid: 62a78978-ce7a-47e9-b73b-f47d26c0ab7f
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 539c1710
    fragmentShaderHash: 806d1775
  Program #84
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 094a0362-029d-4616-8d69-2459afd7ae6a
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #85
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 6105be99-70c3-4629-87e3-5a545d052e84
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #86
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 0f870fdb-d904-47f2-9e7b-7f67968a93a0
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #87
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: de10cdb6-7e79-4fb4-b85a-1312aaf957b3
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #88
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 48dcba45-ef75-4eaa-bb9c-ebde4fe69dcc
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1365 (+19):
  Program #95
    material: ShaderMaterial 'SkyShader'
    materialUuid: 8203cac5-4e62-4ed3-9e70-5b3ebe5ecc09
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #96
    material: ShaderMaterial ''
    materialUuid: 95766d2a-7518-4424-b3f4-594fb57f7a10
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #97
    material: MeshStandardMaterial ''
    materialUuid: b71d45ea-e997-46fa-9dd5-525ff3d61be9
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #98
    material: MeshStandardMaterial ''
    materialUuid: 0c37f0a9-24c5-4857-a8c2-421a4e68ca0b
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520711,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 66d360c8
    fragmentShaderHash: 4e17aba
  Program #99
    material: MeshStandardMaterial 'Green'
    materialUuid: 639175e4-6543-44d3-9754-d25ae71b548b
    object: Mesh 'chunk-vegetation-region-1,0|tree-living-8:1'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520711,srgb,(shader, renderer) => {
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
    vertexShaderHash: 5e531be4
    fragmentShaderHash: f192625
  Program #100
    material: MeshStandardMaterial ''
    materialUuid: 2b931c03-ad8c-4d59-ac4c-b78d685058d9
    object: Mesh 'chunk-environment-region-1,-1|rockCluster-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8520711,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: bc17343
    fragmentShaderHash: c31a836d
  Program #101
    material: MeshStandardMaterial 'Material'
    materialUuid: 23830f35-a0df-43df-a2e3-70d857c7342c
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ec50e5ba
    fragmentShaderHash: ed7b2db8
  Program #102
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 0dc83598-761f-4e87-afc5-b1e796206c23
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #103
    material: MeshStandardMaterial 'Wood_Light'
    materialUuid: 62a78978-ce7a-47e9-b73b-f47d26c0ab7f
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: e37c9406
    fragmentShaderHash: 7fd57936
  Program #104
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 094a0362-029d-4616-8d69-2459afd7ae6a
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #105
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 6105be99-70c3-4629-87e3-5a545d052e84
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #106
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 0f870fdb-d904-47f2-9e7b-7f67968a93a0
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #107
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: de10cdb6-7e79-4fb4-b85a-1312aaf957b3
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #108
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 48dcba45-ef75-4eaa-bb9c-ebde4fe69dcc
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #109
    material: ShaderMaterial ''
    materialUuid: 4e9a683f-34a0-4946-a0be-ff56c5e72bfb
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #110
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #111
    material: MeshBasicMaterial ''
    materialUuid: f0bdf0bd-c7b3-4197-9aa2-334d4e2c77dd
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #112
    material: ShaderMaterial ''
    materialUuid: e714f1bc-0ae4-4b5a-9aaf-1277e441f62a
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #113
    material: ShaderMaterial ''
    materialUuid: 49b712f4-ce73-48f3-9ae9-15d22d622247
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
Excluded — no reliable per-program timing: 108 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 130
  #71
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 696.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 131
  #72
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 81.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 135
  #73
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 111.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 160
  #74
      material: MeshStandardMaterial 'Green'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 83.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 236
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 134.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 293
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 79.8 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1186.7 ms
  programs >1 ms: 6
  max: 696.3 ms (#71)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=7.3 ms  p95=8.4 ms  max=10.8 ms  Δavg vs baseline=—
  hide-grass           avg=7.0 ms  p95=8.3 ms  max=8.8 ms  Δavg vs baseline=-0.3 ms (-4%)
  hide-vegetation      avg=6.1 ms  p95=7.4 ms  max=7.7 ms  Δavg vs baseline=-1.1 ms (-15%)
  no vegetation/grass  avg=6.0 ms  p95=7.0 ms  max=9.3 ms  Δavg vs baseline=-1.3 ms (-17%)
  hide-environment     avg=7.0 ms  p95=8.0 ms  max=8.7 ms  Δavg vs baseline=-0.3 ms (-4%)
  hide-settlement      avg=6.4 ms  p95=7.5 ms  max=7.8 ms  Δavg vs baseline=-0.8 ms (-11%)
  no water             avg=6.9 ms  p95=8.3 ms  max=8.6 ms  Δavg vs baseline=-0.3 ms (-4%)
  hide-terrain         avg=6.9 ms  p95=8.4 ms  max=8.7 ms  Δavg vs baseline=-0.4 ms (-5%)
  hide-npc-fauna       avg=5.6 ms  p95=6.2 ms  max=8.7 ms  Δavg vs baseline=-1.6 ms (-22%)
  no-shadows           avg=6.9 ms  p95=7.8 ms  max=7.8 ms  Δavg vs baseline=-0.3 ms (-5%)
  no-ao                avg=6.9 ms  p95=8.0 ms  max=9.0 ms  Δavg vs baseline=-0.4 ms (-5%)
  no-bloom             avg=6.8 ms  p95=8.1 ms  max=8.6 ms  Δavg vs baseline=-0.5 ms (-6%)
  no-smaa              avg=7.0 ms  p95=8.4 ms  max=8.9 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-god-rays          avg=7.6 ms  p95=9.0 ms  max=10.3 ms  Δavg vs baseline=+0.3 ms (+5%)
  no-film-grade        avg=7.4 ms  p95=8.8 ms  max=9.9 ms  Δavg vs baseline=+0.1 ms (+2%)
  no postprocessing    avg=6.9 ms  p95=8.7 ms  max=10.5 ms  Δavg vs baseline=-0.3 ms (-4%)
  no mirrors           avg=7.4 ms  p95=8.4 ms  max=8.5 ms  Δavg vs baseline=+0.1 ms (+2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=21.1 ms  p95=23.2 ms  max=23.6 ms
  CPU wall      avg=7.3 ms  p95=8.4 ms  max=10.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
