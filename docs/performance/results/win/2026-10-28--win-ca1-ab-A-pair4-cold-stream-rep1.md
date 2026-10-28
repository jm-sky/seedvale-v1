# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:43:36.645Z
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
Frames: 1370
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d7ddb33720d54ece4e216ee27ed1e7ffa968a234
  runId: 2026-10-28T22-42-44-125Z-wii29u
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
  populationGate: stable waited=5145ms npc=20
  gpuTimer: available=true resolved=true samples=1381 span=postprocess+labels

FPS:
  avg: 56.8
  min: 3
  p1: 14

Frame time (wall-clock):
  avg: 17.6 ms
  p50: 15.6 ms
  p95: 27.2 ms
  p99: 69.3 ms
  max: 317.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.6 p95=8.3 p99=50 max=103.1 n=1370
  render: p50=11.4 p95=18.7 p99=26 max=306.1 n=1370
  frame: p50=15.6 p95=27.2 p99=69.3 max=317.2 n=1370

Rendering (combined renderer.info):
  draw calls: 869 avg / 2032 max
  triangles: 10.67M avg
  mirror draws: 156 avg
  geometries: 765
  textures: 574

Pass submissions (actual):
  reliability: observed
  frames: 1382 shadowRefresh=559 shadowSkipped=823
  mirror calls avg: 155
  shadow calls avg: 306
  main calls avg: 571

Scene (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  grass            draws=60 tris=837.5k meshes=60 inst=98841
  vegetation       draws=221 tris=1.62M meshes=221 inst=1036
  environment      draws=134 tris=30.9k meshes=134 inst=157
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=51 tris=3.69M meshes=51 inst=51
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=359 tris=32.6k meshes=359 inst=359
  other            draws=230 tris=25.9k meshes=230 inst=230

Shadow casters (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  vegetation       draws=205 tris=1.57M meshes=205 inst=1008
  environment      draws=133 tris=30.8k meshes=133 inst=156
  settlement       draws=410 tris=476.8k meshes=410 inst=883
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
  WATER          2.5 ms
  STREAMING      0.6 ms
  NPC            1.4 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         9.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  WATER: 2
  STREAMING: 2

Hitches (>= 8 ms): total=4
  chunk water            n=2 avg=9.5 max=10.2
  chunk mesh             n=2 avg=9.3 max=9.9

Isolation probes:
  full               render=5.8 ms draws=278 tris=5.72M
  hide-grass         render=5.8 ms draws=250 tris=5.29M
  hide-vegetation    render=5.1 ms draws=156 tris=3.65M
  hide-vegetation-grass render=5.1 ms draws=132 tris=3.34M
  hide-environment   render=5.7 ms draws=253 tris=5.57M
  hide-settlement    render=5.5 ms draws=253 tris=5.63M
  hide-water         render=5.7 ms draws=257 tris=4.60M
  hide-terrain       render=5.6 ms draws=246 tris=3.41M
  hide-npc-fauna     render=5.2 ms draws=278 tris=5.72M
  no-shadows         render=5.7 ms draws=265 tris=5.38M
  no-ao              render=5.7 ms draws=269 tris=5.63M
  no-bloom           render=6.4 ms draws=265 tris=5.72M
  no-smaa            render=5.9 ms draws=275 tris=5.72M
  no-god-rays        render=6.2 ms draws=274 tris=5.65M
  no-film-grade      render=6.2 ms draws=275 tris=5.63M
  no-postprocessing  render=5.7 ms draws=255 tris=5.72M
  no-reflections     render=6.1 ms draws=223 tris=4.68M

Frame attribution:
  frame max: 317.2 ms
  largest labelled hitch: 10.2 ms
  unattributed: 307 ms

Long frames:
  threshold: 80 ms
  count: 10
  worst: 317.2 ms

Raw sidecar:
  sampling=full factor=1 exported=1370/1370

Recommendation:
Largest frame (317.2 ms) is not explained by labelled hitches (largest 10.2 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (9.8 ms cumulative)
  agent updates: 0.8 ms/frame (1128.5 ms cumulative)
  livestock: 0.3 ms/frame (356.5 ms cumulative)
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
    update calls/frame: 16.2
    unique animals/frame: 16.0
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.5
    dog guard scans: 3.5/frame (28.4 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.2/frame (0.0 candidates/frame)
    water samples: 6.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 6.8/frame, 0.00 ms/frame (worst call 1.10 ms, 501.8 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 16.1
    behaviour executions/frame: 4.2
    presentation executions/frame: 3.7
  rats: 0.1 ms/frame (107.9 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.1 ms/frame (135.1 ms cumulative)
  maintenance: 0.1 ms/frame (158.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.4 ms/frame (1934.9 ms cumulative)
  forest sampling: 0.1 ms/frame (114.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (25.4 ms cumulative)
    targeting: 0.0 ms/frame (16.4 ms cumulative)
    decision: 0.0 ms/frame (14.7 ms cumulative)
    behaviour: 0.9 ms/frame (1262.0 ms cumulative)
    life/presentation: 0.3 ms/frame (393.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.5
    full-rate agents/frame: 8.2
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 14.5
    presentation executions/frame: 13.3

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 29.8
    village scan candidates/frame: 320.7
    player perception checks/frame: 30.3

  nearest scans: 20.7/frame (28358 calls)
  nearest candidates checked: 123.7/frame (169415 total)
  herd leader scans: 0.2/frame (235 calls)
  herd candidates checked: 5.1/frame (7050 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.6/frame (120.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 50.3/frame, 0.10 ms/frame (worst call 1.30 ms)
    collider queries: 50.3/frame, 0.00 ms/frame (worst call 1.60 ms, 1673.2 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 15
  empty builds (no instances): 15
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.26 ms
    max 1.70 ms

  allocation/setup:
    avg 0.19 ms
    max 1.60 ms
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
    avg 0.01 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.39 ms
    max 1.70 ms

  per chunk:
    instances avg/max 151027.1 / 271541
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 724882 / 1540524
    matrix instances bound: 2265406
    instanced attributes created: 300
    shared material refs: 60
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 15/15
    instances: 271779 (max 32465)
    allocation/setup avg/max: 0.14 / 1.60 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 15/15
    instances: 90329 (max 10763)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 15/15
    instances: 362774 (max 44129)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 15/15
    instances: 1540524 (max 184184)
    allocation/setup avg/max: 0.01 / 0.10 ms
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
Frames: 1382
Shadow refresh frames: 559
Shadow skipped frames: 823

Mirror:
  calls avg: 155  tris avg: 880348
  info calls avg: 155  residual calls avg: 0
  environment                  calls=4 tris=3902
  items                        calls=1 tris=510
  other                        calls=33 tris=4826
  settlement:decor             calls=8 tris=19960
  settlement:fence             calls=1 tris=2290
  settlement:fireCampfire      calls=2 tris=189
  settlement:fireHouseExteriorLamp calls=5 tris=243
  settlement:fireHouseInteriorLamp calls=2 tris=183
  settlement:fireVillageTorch  calls=7 tris=509
  settlement:houseInteractive  calls=5 tris=559
  settlement:houseStatic       calls=12 tris=11073
  settlement:landmarkGarden    calls=2 tris=23441
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=684
  settlement:landmarkWellHousehold calls=2 tris=2208
  settlement:landmarkWellPasture calls=2 tris=631
  settlement:other             calls=3 tris=65
  settlement:storageBarrel     calls=3 tris=4150
  settlement:storageContainer  calls=10 tris=761
  settlement:storageGoods      calls=13 tris=2734
  settlement:storageHay        calls=0 tris=182
  settlement:storageTrough     calls=2 tris=513
  settlement:storageWoodHousehold calls=1 tris=1742
  settlement:storageWoodSettlementPrimary calls=0 tris=300
  settlement:workplace         calls=3 tris=1362
  terrain                      calls=6 tris=408771
  vegetation                   calls=23 tris=388713

Shadow (refresh only):
  calls avg: 306  tris avg: 2241251
  info calls avg: 306  residual calls avg: 0
  environment                  calls=11 tris=5679
  faunaFamily:cow              calls=2 tris=859
  faunaFamily:horse            calls=2 tris=578
  faunaFamily:rabbit           calls=1 tris=754
  faunaFamily:rat              calls=1 tris=1347
  faunaFamily:sheep            calls=0 tris=72
  faunaFamily:stag             calls=6 tris=3460
  faunaFamily:wolf             calls=1 tris=351
  items                        calls=4 tris=1930
  npcFamily:Knight_Cloth       calls=3 tris=4241
  npcFamily:Peasant            calls=3 tris=3817
  npcFamily:Peasant_Boots      calls=1 tris=1136
  npcFamily:woodcutter         calls=1 tris=1064
  other                        calls=53 tris=11446
  settlement:decor             calls=107 tris=213553
  settlement:fireHouseInteriorLamp calls=1 tris=125
  settlement:houseInteractive  calls=2 tris=373
  settlement:houseStatic       calls=15 tris=6673
  settlement:landmarkGarden    calls=1 tris=492
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1151
  settlement:other             calls=4 tris=82
  settlement:storageContainer  calls=5 tris=518
  settlement:storageHay        calls=1 tris=296
  settlement:storageTrough     calls=1 tris=267
  settlement:storageWoodHousehold calls=1 tris=1049
  settlement:storageWoodSettlementPrimary calls=1 tris=473
  settlement:workplace         calls=2 tris=2111
  terrain                      calls=19 tris=1369689
  vegetation                   calls=54 tris=607642

Main:
  calls avg: 571  tris avg: 8841491
  info calls avg: 709  residual calls avg: 0
  environment                  calls=51 tris=13474
  faunaFamily:bear             calls=1 tris=680
  faunaFamily:chicken          calls=6 tris=801
  faunaFamily:cow              calls=1 tris=189
  faunaFamily:dog              calls=11 tris=3801
  faunaFamily:horse            calls=0 tris=86
  faunaFamily:rabbit           calls=0 tris=176
  faunaFamily:rat              calls=2 tris=3100
  faunaFamily:sheep            calls=4 tris=1225
  faunaFamily:stag             calls=1 tris=645
  faunaFamily:wolf             calls=2 tris=817
  grass                        calls=36 tris=5545472
  items                        calls=46 tris=5325
  npcFamily:Farmer             calls=7 tris=10903
  npcFamily:Knight_Cloth       calls=6 tris=7576
  npcFamily:Peasant            calls=36 tris=43938
  npcFamily:Peasant_Boots      calls=6 tris=8012
  npcFamily:blacksmith         calls=7 tris=9411
  other                        calls=87 tris=14708
  settlement:decor             calls=14 tris=36007
  settlement:fence             calls=3 tris=4669
  settlement:fireCampfire      calls=5 tris=381
  settlement:fireHouseExteriorLamp calls=10 tris=499
  settlement:fireHouseInteriorLamp calls=3 tris=376
  settlement:fireVillageTorch  calls=14 tris=1039
  settlement:houseInteractive  calls=10 tris=1149
  settlement:houseStatic       calls=22 tris=20305
  settlement:landmarkGarden    calls=5 tris=46923
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1450
  settlement:landmarkWellHousehold calls=5 tris=4485
  settlement:landmarkWellPasture calls=3 tris=1291
  settlement:other             calls=7 tris=133
  settlement:storageBarrel     calls=5 tris=8461
  settlement:storageContainer  calls=21 tris=1556
  settlement:storageGoods      calls=27 tris=5627
  settlement:storageHay        calls=1 tris=362
  settlement:storageTrough     calls=3 tris=1054
  settlement:storageWoodHousehold calls=1 tris=3572
  settlement:storageWoodSettlementPrimary calls=1 tris=597
  settlement:workplace         calls=6 tris=2836
  terrain                      calls=24 tris=1746552
  vegetation                   calls=55 tris=815583
  water                        calls=7 tris=466565


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 10
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 10 total):

[LONG FRAME] 317.2ms
simulate        10.3ms
render         306.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        1.4ms
NPC              1.2ms
FAUNA            1.1ms
PHYSICS          0.0ms
RENDER         306.1ms
OTHER            7.3ms

streaming / stages:
  contentFinalize              1.4ms
  chunkFinalize                1.4ms
  chunkUpdate                  1.4ms

Long frame #2:

[LONG FRAME] 280.5ms
simulate         8.4ms
render         271.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          260.1ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER          10.9ms
OTHER            7.3ms

Long frame #3:

[LONG FRAME] 252.8ms
simulate        43.0ms
render         209.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          196.7ms
STREAMING       37.1ms
NPC              1.5ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER          12.3ms
OTHER            4.0ms

streaming / stages:
  chunkUpdate                  37.1ms
  riverTileBuild               35.1ms
  terrainPrepare               0.8ms
  riverChannelSegmentsNear     0.5ms

Long frame #4:

[LONG FRAME] 197.6ms
simulate         4.0ms
render         192.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          180.3ms
STREAMING        1.0ms
NPC              1.2ms
FAUNA            0.6ms
PHYSICS          0.0ms
RENDER          12.3ms
OTHER            2.2ms

streaming / stages:
  contentFinalize              1.0ms
  chunkFinalize                1.0ms
  chunkUpdate                  1.0ms

Long frame #5:

[LONG FRAME] 115ms
simulate       103.1ms
render          11.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA           99.9ms
PHYSICS          0.1ms
RENDER          11.6ms
OTHER            1.7ms

---

[Seedvale Program Census]

Programs created: 129
Program count: final=128 max=128

By frame:
  frame 0   +75 programs   <== largest transition
  frame 57   +1 program
  frame 431   +1 program
  frame 460   +1 program
  frame 473   +2 programs
  frame 562   +1 program
  frame 568   +1 program
  frame 578   +1 program
  frame 1020   +1 program
  frame 1138   +1 program
  frame 2179   +15 programs
  frame 2180   +3 programs
  frame 2226   +4 programs
  frame 2461   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=720d302a-49d2-4caa-8bb1-a6ba92ee2f5e (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=da0f000e-b82d-4515-9521-22572af4ef1c
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=709ef2e7-7a2e-4fee-893b-cfaf63b2bae2
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1416fec5-4f4d-440c-b246-5258a461fc72
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1cc65292-9c65-4f52-9dcb-7ece91dd684a
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d4227900-f3cc-469a-aa60-fa6f3ce75d3b
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ccb2c697-ff5e-4352-b927-a42e03f5395c
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=2b9fd89c-cd50-41d1-9919-067ebc59bd45
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7de9011d-2407-4da1-9aa0-5cc2f6a9f806
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cae9cfff-d6f0-400c-ae52-5336e45c3d83 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6df949c5-d5aa-4931-b048-3221d3872d18
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fa9b31fe-218e-4a19-89f5-e11cf9c6c7f4 (Flowers)
  #14 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b41368e0-371e-4e82-ab0c-c3c7f47bc268 (None)
  #15 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=daa7fbe5-7891-4d31-89bc-07392c7327c6 (Green)
  #16 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1f10ddc8-6d7e-490e-846b-6354e210547d (Pink)
  #17 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=aa783c00-2d32-40bb-99d6-27d010bcce3e (Stone)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0b577b18-e74d-4604-9a99-d46504a982b5 (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9ecf2494-8224-4647-8b25-dbb6452cb9ae (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4cbff982-7182-4fcf-ab02-5c0314ae27fd (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=81794e77-56bd-4a46-b794-fb89f98158a1 (Material #55)
  #22 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=items cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a613ba86-b8c2-4dd2-ba29-9914ca0a19fd (Pond_Pack_MAT)
  #23 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=75c51e02-3b4b-4142-bd6d-ba08ed52342c (MI_WoodTrim)
  #24 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #25 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b22766e5-1dce-43e4-8639-8ed0058ed49b (MI_WindowGlass)
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=e6927593-8915-4161-8763-691acef91c77 (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3151f5b0-b843-41ea-be9e-3490b534df89 (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dddcf927-224e-4ac2-b158-772734ab1d83 (Main)
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bbbca7d8-3c68-4e2b-ada4-a2b0c73258a8 (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=98ac6489-4b2a-452b-8619-ba0db3f784a0 (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=606b6c8e-ea71-4808-9076-05c9142e84b5 (MI_Hair_1)
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #45 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=adb0c1fe-fe96-4f49-b3ab-27639f2e479a (Green)
  #46 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=ae1e1792-88a9-4ea8-b117-c26d00b2e800 (MapleTree_Bark)
  #47 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=40e241f0-ae0f-4720-99b2-5751c404ee85 (MapleTree_Leaves)
  #48 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3df2d23e-4cf7-40ea-b399-67cd2dab96ca (stockpiles_vc)
  #49 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=3dd22db5-70a6-42da-abe2-673acc69da97
  #50 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=2264fac1-6dc6-4d66-9c01-8ebdd8756f9c (Handle)
  #51 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7a4304b1-70ef-46ce-b45d-b5de757c59d8 (DarkGreen)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5c9605ca-3159-44a0-ac5b-aae79e748ee0 (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=84876c9f-3a0f-4d4c-8e06-13724f595168 (MI_Eyes)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=de9109a1-72aa-4c04-bdf9-4b526e33750a (MI_Hair_1)
  #55 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0c92bf22-0ee1-4a93-8e40-eb72f3b77b61 (PathRocks)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f681aef9-f031-4461-bd4f-546a78aa5541 (MI_Knight)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #29=df7c703d, #30=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #29=236b3b0b, #30=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #29=(unset), #30=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=6db98a06, #15=c0d790d1, #16=d3fd7a87, #17=a9733c9d, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c3bc6325, #23=c5e73b05, #24=13a74ec7, #25=9dcf1cb4, #26=12873951, #27=fc941d05, #28=e551c572, #31=fd8301ed, #32=842fe1df, #33=ac268392, #34=1c179521, #45=190d3a9c, #46=9dbe8ee7, #47=3bea20f6, #48=a64d124e, #49=94297e69, #50=3abb47a8, #51=9434da33, #52=20daccfa, #53=1dcbc6ff, #54=cde317ee, #55=b643916d, #56=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=efed8e98, #15=a81023c3, #16=2eae9a54, #17=bd723c8a, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=ded4be89, #23=d4c95125, #24=3ab4c629, #25=2d1aa4a, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=2f2885d5, #32=34995f15, #33=25a41317, #34=71f22dc6, #45=633146b4, #46=8dba9dd, #47=5b26a60d, #48=546e469, #49=aa0735a8, #50=85d3c28d, #51=77dfd097, #52=a8862f4a, #53=1a1c0d8, #54=512afd6f, #55=754b87bd, #56=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=environment, #15=vegetation, #16=vegetation, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=items, #23=settlement, #24=(unknown), #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=fauna, #32=other, #33=other, #34=other, #45=settlement, #46=settlement, #47=settlement, #48=settlement, #49=other, #50=settlement, #51=other, #52=other, #53=other, #54=npc, #55=settlement, #56=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=, #24=(unset), #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #34=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=0, #24=(unknown), #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #34=0, #45=0, #46=0, #47=0.45, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=true, #50=true, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=true, #24=(unknown), #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #34=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #18=false, #19=false, #20=true, #22=true, #23=true, #24=(unknown), #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=true, #45=false, #46=true, #47=true, #48=false, #49=false, #50=false, #51=false, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=true, #24=(unknown), #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=true, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=false, #24=(unknown), #25=true, #26=false, #27=(unknown), #28=true, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=false, #45=false, #46=false, #47=false, #48=true, #49=false, #50=false, #51=false, #52=true, #53=true, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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
    vertexShaderHash differs: #35=59ed5d71, #36=2efa42a8, #37=b69ba143, #38=2e7a6fcb, #39=585a1ea4, #40=c203b19a, #41=c203b19a, #42=585a1ea4, #43=263c45d6, #44=e4717b03
    fragmentShaderHash differs: #35=d729897e, #36=41e40a66, #37=d729897e, #38=758a4164, #39=41e40a66, #40=41e40a66, #41=a9dd0dee, #42=a9dd0dee, #43=d729897e, #44=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2179 (+15):
  Program #85
    material: MeshStandardMaterial ''
    materialUuid: 709ef2e7-7a2e-4fee-893b-cfaf63b2bae2
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #86
    material: MeshStandardMaterial 'Wood'
    materialUuid: ac74e3a0-4c31-4273-a181-302451f3d94e
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: 53c63f31-c1cb-4a3b-aad6-6038838fa46b
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
    materialUuid: 4bf17c9c-1041-40e0-9b8b-d1dd03c30276
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
    materialUuid: a57463a7-2a05-4b9b-a5a5-f668168e0cda
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #90
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: ae1e1792-88a9-4ea8-b117-c26d00b2e800
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #91
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: fa9b31fe-218e-4a19-89f5-e11cf9c6c7f4
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
  Program #92
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: a1688a08-ed20-48b8-975b-bf5f3fb7f72f
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 0dc17546-e4e9-4329-aa18-83092ed352d2
    object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
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
    materialUuid: 3df2d23e-4cf7-40ea-b399-67cd2dab96ca
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #95
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 5c9605ca-3159-44a0-ac5b-aae79e748ee0
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #96
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 84876c9f-3a0f-4d4c-8e06-13724f595168
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #97
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: bbbca7d8-3c68-4e2b-ada4-a2b0c73258a8
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 98ac6489-4b2a-452b-8619-ba0db3f784a0
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 606b6c8e-ea71-4808-9076-05c9142e84b5
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 2461 (+22):
  Program #107
    material: ShaderMaterial 'SkyShader'
    materialUuid: 720d302a-49d2-4caa-8bb1-a6ba92ee2f5e
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #108
    material: ShaderMaterial ''
    materialUuid: d4227900-f3cc-469a-aa60-fa6f3ce75d3b
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #109
    material: MeshStandardMaterial ''
    materialUuid: 709ef2e7-7a2e-4fee-893b-cfaf63b2bae2
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #110
    material: MeshStandardMaterial 'Wood'
    materialUuid: ac74e3a0-4c31-4273-a181-302451f3d94e
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: 53c63f31-c1cb-4a3b-aad6-6038838fa46b
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
    materialUuid: 4bf17c9c-1041-40e0-9b8b-d1dd03c30276
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
    materialUuid: a57463a7-2a05-4b9b-a5a5-f668168e0cda
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #114
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: ae1e1792-88a9-4ea8-b117-c26d00b2e800
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #115
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: fa9b31fe-218e-4a19-89f5-e11cf9c6c7f4
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
  Program #116
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: a1688a08-ed20-48b8-975b-bf5f3fb7f72f
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #117
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 0dc17546-e4e9-4329-aa18-83092ed352d2
    object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
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
    materialUuid: 3df2d23e-4cf7-40ea-b399-67cd2dab96ca
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #119
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 5c9605ca-3159-44a0-ac5b-aae79e748ee0
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #120
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 84876c9f-3a0f-4d4c-8e06-13724f595168
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #121
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: bbbca7d8-3c68-4e2b-ada4-a2b0c73258a8
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #122
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 98ac6489-4b2a-452b-8619-ba0db3f784a0
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 606b6c8e-ea71-4808-9076-05c9142e84b5
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #124
    material: ShaderMaterial ''
    materialUuid: ccb2c697-ff5e-4352-b927-a42e03f5395c
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
    materialUuid: 7de9011d-2407-4da1-9aa0-5cc2f6a9f806
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #127
    material: ShaderMaterial ''
    materialUuid: e99ff855-50b3-46be-8944-385be1d07745
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #128
    material: ShaderMaterial ''
    materialUuid: f5111095-d3e5-4d51-8e6a-69b9b7e659f1
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

Frame 57
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 21.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 431
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 48.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 460
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 26.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 562
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 195.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 568
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 18.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 578
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 178.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 1020
  #83
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 258.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 1138
  #84
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 302.4 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1049.5 ms
  programs >1 ms: 8
  max: 302.4 ms (#84)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.8 ms  p95=6.4 ms  max=6.5 ms  Δavg vs baseline=—
  hide-grass           avg=5.8 ms  p95=6.7 ms  max=7.1 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=5.1 ms  p95=5.8 ms  max=5.9 ms  Δavg vs baseline=-0.8 ms (-14%)
  no vegetation/grass  avg=5.1 ms  p95=6.0 ms  max=7.5 ms  Δavg vs baseline=-0.8 ms (-14%)
  hide-environment     avg=5.7 ms  p95=6.8 ms  max=7.1 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-settlement      avg=5.5 ms  p95=6.5 ms  max=8.8 ms  Δavg vs baseline=-0.4 ms (-7%)
  no water             avg=5.7 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-terrain         avg=5.6 ms  p95=6.5 ms  max=6.7 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-npc-fauna       avg=5.2 ms  p95=5.9 ms  max=6.0 ms  Δavg vs baseline=-0.6 ms (-10%)
  no-shadows           avg=5.7 ms  p95=6.4 ms  max=7.2 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-ao                avg=5.7 ms  p95=6.4 ms  max=7.0 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-bloom             avg=6.4 ms  p95=7.9 ms  max=9.5 ms  Δavg vs baseline=+0.5 ms (+9%)
  no-smaa              avg=5.9 ms  p95=6.6 ms  max=6.8 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-god-rays          avg=6.2 ms  p95=7.1 ms  max=7.7 ms  Δavg vs baseline=+0.3 ms (+5%)
  no-film-grade        avg=6.2 ms  p95=7.2 ms  max=7.7 ms  Δavg vs baseline=+0.4 ms (+6%)
  no postprocessing    avg=5.7 ms  p95=6.4 ms  max=6.5 ms  Δavg vs baseline=-0.1 ms (-2%)
  no mirrors           avg=6.1 ms  p95=7.0 ms  max=7.1 ms  Δavg vs baseline=+0.2 ms (+4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (39 samples resolved during the baseline window)
  GPU elapsed   avg=10.5 ms  p95=12.3 ms  max=12.9 ms
  CPU wall      avg=5.8 ms  p95=6.4 ms  max=6.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
