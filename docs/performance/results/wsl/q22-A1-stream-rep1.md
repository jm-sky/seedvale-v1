# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T15:37:01.905Z
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
Frames: 473
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 2e6bb561913e3521d7e908fa3f8cb1ad94dcfaec
  runId: 2026-10-30T15-35-59-521Z-oaf6j1
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
  viewport: 1600x934
  drawingBuffer: 1600x934
  camera: pos=(426.9, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5134ms npc=24
  gpuTimer: available=true resolved=true samples=478 span=postprocess+labels

FPS:
  avg: 32.7
  min: 1
  p1: 5

Frame time (wall-clock):
  avg: 30.6 ms
  p50: 21.3 ms
  p95: 65.6 ms
  p99: 193.8 ms
  max: 1175.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.8 p95=37.3 p99=73.4 max=131 n=473
  render: p50=13.7 p95=26.4 p99=182.1 max=1161.7 n=473
  frame: p50=21.3 p95=65.6 p99=193.8 max=1175.4 n=473

Rendering (combined renderer.info):
  draw calls: 668 avg / 2027 max
  triangles: 9.93M avg
  mirror draws: 113 avg
  geometries: 739
  textures: 368

Pass submissions (actual):
  reliability: observed
  frames: 481 shadowRefresh=280 shadowSkipped=201
  mirror calls avg: 112
  shadow calls avg: 214
  main calls avg: 415

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=49 tris=1.18M meshes=49 inst=124428
  vegetation       draws=219 tris=1.48M meshes=219 inst=934
  environment      draws=135 tris=29.1k meshes=135 inst=151
  settlement       draws=646 tris=738.7k meshes=646 inst=1412
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=213 tris=273.1k meshes=213 inst=213
  fauna            draws=232 tris=96.8k meshes=232 inst=232
  items            draws=368 tris=32.3k meshes=368 inst=368
  other            draws=220 tris=26.8k meshes=220 inst=220

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=201 tris=1.44M meshes=201 inst=902
  environment      draws=134 tris=29.1k meshes=134 inst=150
  settlement       draws=417 tris=504.0k meshes=417 inst=1099
  items            draws=44 tris=25.5k meshes=44 inst=44
  other            draws=98 tris=14.5k meshes=98 inst=98

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=77 tris=77.8k meshes=77 inst=580
  houseInteractive draws=26 tris=4.1k meshes=26 inst=26
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=10.1k meshes=3 inst=13
  storageContainer draws=18 tris=4.3k meshes=18 inst=58
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.8k meshes=8 inst=28
  workplace        draws=8 tris=4.1k meshes=8 inst=8
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=4.0k meshes=3 inst=5
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=13 tris=1.4k meshes=13 inst=13
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=194 tris=377.2k meshes=194 inst=277
  other            draws=27 tris=504 meshes=27 inst=27

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=109 tris=133.2k skinned=109/109
      Farmer           agents=4 draws=33 tris=49.9k skinned=33/33
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
      Wizard           agents=1 draws=12 tris=12.0k skinned=12/12
      Herbalist        agents=1 draws=10 tris=14.2k skinned=10/10
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      far  agents=23 camera-relevant=0 draws=213 tris=273.1k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      sheep            agents=14 draws=28 tris=8.5k skinned=28/28
      dog              agents=4 draws=22 tris=7.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      cow              agents=2 draws=14 tris=4.9k skinned=14/14
      donkey           agents=2 draws=14 tris=4.0k skinned=14/14
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      far  agents=60 camera-relevant=0 draws=232 tris=96.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=71 composed=71 multiplied=71 skinned=0
  grass                    nodes=64 composed=64 multiplied=64 skinned=0
  vegetation               nodes=256 composed=256 multiplied=256 skinned=0
  environment              nodes=231 composed=231 multiplied=231 skinned=0
  settlement               nodes=1293 composed=1293 multiplied=1293 skinned=0
  water                    nodes=53 composed=53 multiplied=53 skinned=0
  npc                      nodes=1801 composed=1801 multiplied=1801 skinned=213
  fauna                    nodes=2626 composed=2626 multiplied=2626 skinned=212
  items                    nodes=569 composed=569 multiplied=569 skinned=0
  other                    nodes=433 composed=416 multiplied=433 skinned=9
  top scene children:
    fauna ×60                nodes=2626 composed=2626 multiplied=2626 skinned=212
    npc ×23                  nodes=1801 composed=1801 multiplied=1801 skinned=213
    settlement ×3            nodes=1293 composed=1293 multiplied=1293 skinned=0
    chunk-items ×37          nodes=560 composed=560 multiplied=560 skinned=0
    Group ×35                nodes=248 composed=248 multiplied=248 skinned=9
    chunk-environmen ×3      nodes=163 composed=163 multiplied=163 skinned=0
    chunk ×71                nodes=71 composed=71 multiplied=71 skinned=0
    chunk-grass ×15          nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    chunk-water ×52          nodes=52 composed=52 multiplied=52 skinned=0
    chunk-river ×42          nodes=42 composed=42 multiplied=42 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          5.3 ms
  STREAMING      2.4 ms
  NPC            2.6 ms
  FAUNA          3.1 ms
  PHYSICS        0.1 ms
  RENDER         15.0 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  STREAMING: 21
  WATER: 14

Hitches (>= 8 ms): total=35
  chunk mesh             n=21 avg=11.7 max=21.7
  chunk water            n=14 avg=10.8 max=14.2

Isolation probes:
  full               render=8.8 ms draws=293 tris=5.83M
  hide-grass         render=8.7 ms draws=266 tris=4.79M
  hide-vegetation    render=8.1 ms draws=158 tris=4.03M
  hide-vegetation-grass render=7.5 ms draws=131 tris=2.98M
  hide-environment   render=8.7 ms draws=272 tris=5.82M
  hide-settlement    render=8.3 ms draws=268 tris=5.81M
  hide-water         render=9.0 ms draws=276 tris=4.95M
  hide-terrain       render=9.0 ms draws=264 tris=3.70M
  hide-npc-fauna     render=8.8 ms draws=293 tris=5.83M
  no-shadows         render=8.3 ms draws=283 tris=5.59M
  no-ao              render=9.2 ms draws=282 tris=5.77M
  no-bloom           render=9.5 ms draws=275 tris=5.77M
  no-smaa            render=8.6 ms draws=285 tris=5.77M
  no-god-rays        render=9.1 ms draws=293 tris=5.83M
  no-film-grade      render=10.7 ms draws=293 tris=5.83M
  no-postprocessing  render=9.8 ms draws=270 tris=5.83M
  no-reflections     render=10.6 ms draws=221 tris=4.88M

Frame attribution:
  frame max: 1175.4 ms
  largest labelled hitch: 21.7 ms
  unattributed: 1153.7 ms

Long frames:
  threshold: 80 ms
  count: 21
  worst: 1175.4 ms

Raw sidecar:
  sampling=full factor=1 exported=473/473

Recommendation:
Largest frame (1175.4 ms) is not explained by labelled hitches (largest 21.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 23
  Fauna (agents): 30

NPC:
  total: 2.6 ms/frame
  crowd pass: 0.0 ms/frame (4.3 ms cumulative)
  agent updates: 1.3 ms/frame (591.7 ms cumulative)
  livestock: 0.7 ms/frame (318.3 ms cumulative)
    loaded tick: 0.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 23.0
    unique animals/frame: 22.2
    duplicate updates/frame: 0.8
    detached animals/frame: 0.0
    dog updates/frame: 4.6
    dog guard scans: 4.6/frame (36.9 predator candidates/frame)
    pest scans: 2.2/frame (2.2 rat candidates/frame)
    nearest scans: 10.6/frame (0.0 candidates/frame)
    water samples: 20.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 20.8/frame, 0.00 ms/frame (worst call 7.40 ms, 1839.1 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 22.9
    behaviour executions/frame: 10.6
    presentation executions/frame: 9.9
  rats: 0.1 ms/frame (62.0 ms cumulative)
  social: 0.0 ms/frame (2.4 ms cumulative)
  streaming: 0.4 ms/frame (175.8 ms cumulative)
  maintenance: 0.1 ms/frame (65.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.1 ms/frame
  agent updates: 3.0 ms/frame (1417.5 ms cumulative)
  forest sampling: 0.1 ms/frame (51.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (11.5 ms cumulative)
    targeting: 0.0 ms/frame (10.4 ms cumulative)
    decision: 0.0 ms/frame (9.8 ms cumulative)
    behaviour: 2.3 ms/frame (1085.1 ms cumulative)
    life/presentation: 0.4 ms/frame (185.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.5
    sensing passes/frame: 30.5
    decision passes/frame: 30.5
    high-priority agents/frame: 0.4
    expensive behaviour agents/frame: 17.4
    full-rate agents/frame: 7.0
    reduced-cadence agents/frame: 23.5
    behaviour executions/frame: 17.9
    presentation executions/frame: 16.9

  sensing/cache:
    forest samples/frame: 30.5
    fire scan candidates/frame: 20.5
    village scan candidates/frame: 317.1
    player perception checks/frame: 30.5

  nearest scans: 24.8/frame (11727 calls)
  nearest candidates checked: 202.1/frame (95594 total)
  herd leader scans: 0.3/frame (148 calls)
  herd candidates checked: 9.4/frame (4440 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.5/frame (157.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 67.0/frame, 0.10 ms/frame (worst call 1.30 ms)
    collider queries: 67.0/frame, 0.10 ms/frame (worst call 4.30 ms, 4519.9 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 76
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.14 ms
    max 0.60 ms

  allocation/setup:
    avg 0.04 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.02 ms
    max 0.20 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.04 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.56 ms
    max 3.20 ms

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
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.01 / 0.20 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.02 / 0.20 ms
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
    allocation/setup avg/max: 0.08 / 0.30 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

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
Frames: 481
Shadow refresh frames: 280
Shadow skipped frames: 201

Mirror:
  calls avg: 112  tris avg: 885274
  info calls avg: 112  residual calls avg: 0
  switches avg: material=52.8 program=31.8  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.5 skeletons first used=3.5
  environment                  calls=5 tris=4252
  items                        calls=1 tris=401
  other                        calls=18 tris=4967
  settlement:decor             calls=2 tris=5588
  settlement:fence             calls=1 tris=1749
  settlement:fireCampfire      calls=2 tris=124
  settlement:fireHouseExteriorLamp calls=4 tris=176
  settlement:fireHouseInteriorLamp calls=1 tris=132
  settlement:fireVillageTorch  calls=5 tris=362
  settlement:houseInteractive  calls=4 tris=403
  settlement:houseStatic       calls=10 tris=9363
  settlement:landmarkGarden    calls=2 tris=16290
  settlement:landmarkNoticeBoard calls=1 tris=9
  settlement:landmarkWellCentral calls=1 tris=491
  settlement:landmarkWellHousehold calls=2 tris=1671
  settlement:landmarkWellPasture calls=1 tris=474
  settlement:other             calls=2 tris=46
  settlement:storageBarrel     calls=2 tris=3505
  settlement:storageContainer  calls=4 tris=684
  settlement:storageGoods      calls=10 tris=1992
  settlement:storageHay        calls=0 tris=125
  settlement:storageTrough     calls=1 tris=447
  settlement:storageWoodHousehold calls=0 tris=1534
  settlement:storageWoodSettlementPrimary calls=0 tris=209
  settlement:workplace         calls=2 tris=947
  terrain                      calls=5 tris=392022
  vegetation                   calls=26 tris=437474

Shadow (refresh only):
  calls avg: 214  tris avg: 2395434
  info calls avg: 214  residual calls avg: 0
  switches avg: material=97.6 program=95.9  actor: calls=11.4 material=0 program=2
  skinning avg: skinned calls=15.3 skeletons first used=5.9
  environment                  calls=13 tris=8541
  faunaFamily:boar             calls=0 tris=206
  faunaFamily:chicken          calls=1 tris=88
  faunaFamily:cow              calls=1 tris=271
  faunaFamily:dog              calls=0 tris=178
  faunaFamily:horse            calls=1 tris=249
  faunaFamily:rabbit           calls=0 tris=246
  faunaFamily:rat              calls=0 tris=86
  faunaFamily:rooster          calls=0 tris=77
  faunaFamily:sheep            calls=1 tris=176
  faunaFamily:stag             calls=2 tris=1402
  items                        calls=5 tris=2076
  npcFamily:Farmer             calls=1 tris=1296
  npcFamily:Knight_Cloth       calls=1 tris=1327
  npcFamily:Peasant            calls=2 tris=1905
  npcFamily:Peasant_Boots      calls=0 tris=523
  npcFamily:Ranger_NoHood      calls=1 tris=651
  npcFamily:woodcutter         calls=0 tris=463
  other                        calls=38 tris=9601
  settlement:decor             calls=45 tris=90092
  settlement:fireHouseInteriorLamp calls=1 tris=148
  settlement:houseInteractive  calls=3 tris=440
  settlement:houseStatic       calls=10 tris=13423
  settlement:landmarkGarden    calls=0 tris=371
  settlement:landmarkNoticeBoard calls=1 tris=9
  settlement:landmarkWellCentral calls=1 tris=469
  settlement:other             calls=2 tris=30
  settlement:storageContainer  calls=2 tris=701
  settlement:storageHay        calls=0 tris=113
  settlement:storageTrough     calls=1 tris=459
  settlement:storageWoodHousehold calls=0 tris=1822
  settlement:storageWoodSettlementPrimary calls=0 tris=181
  settlement:workplace         calls=1 tris=808
  terrain                      calls=18 tris=1360420
  vegetation                   calls=62 tris=896581

Main:
  calls avg: 415  tris avg: 7587150
  info calls avg: 550  residual calls avg: 0
  switches avg: material=206.8 program=95.8  actor: calls=61.2 material=46 program=22.6
  skinning avg: skinned calls=66 skeletons first used=14.7
  environment                  calls=33 tris=11853
  faunaFamily:bear             calls=1 tris=464
  faunaFamily:chicken          calls=4 tris=533
  faunaFamily:cow              calls=0 tris=35
  faunaFamily:dog              calls=8 tris=2636
  faunaFamily:horse            calls=0 tris=69
  faunaFamily:rabbit           calls=0 tris=91
  faunaFamily:rat              calls=1 tris=1881
  faunaFamily:rooster          calls=0 tris=40
  faunaFamily:sheep            calls=3 tris=1022
  faunaFamily:stag             calls=0 tris=243
  faunaFamily:wolf             calls=1 tris=357
  grass                        calls=32 tris=4439167
  items                        calls=39 tris=4374
  npcFamily:Farmer             calls=6 tris=8443
  npcFamily:Knight_Cloth       calls=3 tris=4358
  npcFamily:Peasant            calls=26 tris=31641
  npcFamily:Peasant_Boots      calls=4 tris=5209
  npcFamily:blacksmith         calls=4 tris=6191
  other                        calls=54 tris=14304
  settlement:decor             calls=4 tris=10104
  settlement:fence             calls=2 tris=3472
  settlement:fireCampfire      calls=3 tris=243
  settlement:fireHouseExteriorLamp calls=7 tris=345
  settlement:fireHouseInteriorLamp calls=2 tris=260
  settlement:fireVillageTorch  calls=10 tris=724
  settlement:houseInteractive  calls=7 tris=796
  settlement:houseStatic       calls=17 tris=15563
  settlement:landmarkGarden    calls=3 tris=31404
  settlement:landmarkNoticeBoard calls=1 tris=20
  settlement:landmarkWellCentral calls=3 tris=1007
  settlement:landmarkWellHousehold calls=3 tris=3278
  settlement:landmarkWellPasture calls=3 tris=949
  settlement:other             calls=5 tris=91
  settlement:storageBarrel     calls=4 tris=6934
  settlement:storageContainer  calls=6 tris=1323
  settlement:storageGoods      calls=19 tris=3949
  settlement:storageHay        calls=0 tris=241
  settlement:storageTrough     calls=3 tris=891
  settlement:storageWoodHousehold calls=1 tris=3049
  settlement:storageWoodSettlementPrimary calls=1 tris=418
  settlement:workplace         calls=4 tris=1907
  terrain                      calls=22 tris=1585596
  vegetation                   calls=58 tris=879485
  water                        calls=8 tris=502522


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 21
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 21 total):

[LONG FRAME] 1175.4ms
simulate        12.0ms
render        1161.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER         1146.8ms
STREAMING        0.0ms
NPC              5.7ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER          15.0ms
OTHER            6.6ms

Long frame #2:

[LONG FRAME] 487.4ms
simulate        10.3ms
render         475.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.5ms
STREAMING        2.0ms
NPC              2.3ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         469.0ms
OTHER            6.6ms

streaming / stages:
  chunkUpdate                  2.0ms

Long frame #3:

[LONG FRAME] 225.9ms
simulate        28.7ms
render         193.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          178.4ms
STREAMING        0.1ms
NPC              7.9ms
FAUNA            9.2ms
PHYSICS          2.7ms
RENDER          14.9ms
OTHER           12.7ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #4:

[LONG FRAME] 216.7ms
simulate         7.6ms
render         208.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.5ms
STREAMING        9.1ms
NPC              2.0ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         203.2ms
OTHER            0.0ms

streaming / stages:
  waterFinalize                3.9ms
  terrainFinalize              3.9ms
  chunkUpdate                  1.3ms
  chunkFinalize                0.7ms

Long frame #5:

[LONG FRAME] 193.9ms
simulate        10.7ms
render         182.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.5ms
STREAMING        0.3ms
NPC              1.9ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         173.5ms
OTHER            7.7ms

streaming / stages:
  chunkUpdate                  0.3ms
  chunkFinalize                0.2ms

---

[Seedvale Program Census]

Programs created: 130
Program count: final=130 max=130

By frame:
  frame 0   +74 programs   <== largest transition
  frame 8   +2 programs
  frame 9   +1 program
  frame 10   +1 program
  frame 91   +1 program
  frame 95   +1 program
  frame 97   +1 program
  frame 98   +1 program
  frame 111   +1 program
  frame 118   +1 program
  frame 243   +1 program
  frame 949   +15 programs
  frame 950   +4 programs
  frame 991   +4 programs
  frame 1205   +22 programs

Largest transition — frame 0 (+74 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ff4a10c2-f4a7-45cd-9426-f7a46988c48d (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=24eaac0d-06c0-4a77-b59f-7ec4d2dbbe5c
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=42a68b6a-4073-49f2-b200-7f3f58b74da1
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bcd146c4-eb10-4bd8-b55d-dab86130bd1d
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3e9a912a-3cfa-4a98-8e01-19b5783ba0df
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f76fa1d5-0673-4825-90f0-3b9961e8d025
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4899ec00-add7-4e2a-bb9f-760a708b7817
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=219cfe77-0841-445b-86bc-18478e50be32
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=074fd510-9781-46a4-9001-474aaac1de5b
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1b1cc287-0330-4992-8e29-45c220d134a0 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b7b36669-b0de-4d38-8573-cf9bb8d4f8fe
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=46bf1c1d-18f5-4fbd-94c6-ddad1276e4f9 (Green)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=609e764b-5368-4f52-85a1-946b26e315bd (Pink)
  #15 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=810ab949-2c41-4e65-8b15-5966c69fbae5 (Stone)
  #16 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=51bbc232-d3b0-432f-a44f-d84a27f8c02f (None)
  #17 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=899c1914-bf4d-4dc5-bfe4-12cf3ea269e9 (Flowers)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e86bc37a-67a1-4524-a80d-775d14c27b32 (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=38b10f52-1377-4b48-b912-1b9908223a60 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6399b245-3ef8-439d-87ca-aefce6abaed4 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=339c9271-e002-4499-a3fa-6659da361353 (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=655a2932-61e3-42a6-b474-52ad85ca8d49 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d87c5821-dce0-4557-a884-21b1314fb3e2 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c8d0b44b-1684-4545-82ed-38d9d8056757
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=ec44f8df-4b48-49cc-8134-7f2b42171500 (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2f3f7a6a-ad81-4251-8596-7305fae4e635 (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=24439722-740e-4b9f-9df8-67ae5712525b (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f0875249-2b5c-48c2-99a5-496411f67ea8 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3b9320e6-a3d8-44a3-aec6-c0a56e9dac3d (MI_Hair_1)
  #34 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #43 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0044683c-4328-4052-939d-10c199487ea3 (Green)
  #44 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=eb741c0a-d418-4e24-8b0b-62bb5a7e2ae1 (MapleTree_Bark)
  #45 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d8f201b9-099a-4c6f-b16e-e5fdc88191b1 (MapleTree_Leaves)
  #46 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3ee5baa2-cf99-4160-8e59-f8b5bab903ac (stockpiles_vc)
  #47 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=6bd5148b-01ee-49e0-b58f-e15a5c369428
  #48 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=26c3d506-92ab-49f3-8bcd-0c7f04c76c09 (Handle)
  #49 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a6fb3fb5-c55b-4df9-b3ef-01aef27e3037 (DarkGreen)
  #50 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9d247205-dfff-4dd0-84f8-022d2754cd6f (MI_Regular_Male)
  #51 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2962cabf-1458-4954-9457-34e2cc3e8923 (MI_Eyes)
  #52 type=MeshStandardMaterial name='White' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f299d5d7 fHash=1b5e9115 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=28ec8035-5978-44c5-b3e7-eb69cf37e88b (Main)
  #53 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bdb55438-5f78-4ec6-93ad-9e506940020f (PathRocks)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bf26ab37-61aa-45d3-b18f-cb04a5093766 (MI_Hair_1)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0cd6abc2-0e77-46ef-af6d-565414cc866f (MI_Peasant)
  #56 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #72 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=669a1bfa stage=postprocess-render
  #73 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #29=df7c703d, #30=f92c8d8c, #56=279cec18, #57=84736a68, #58=aa2edbee, #59=7bae0bb2, #60=436caea4, #61=886438e7, #62=d99a5b29, #63=2003ced8, #64=28dfa407, #65=756a0b19, #66=b2354ff2, #67=ea82969e, #68=7dab8d9a, #69=378e1fb7, #70=78acf7ea, #71=a312c579, #72=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #29=236b3b0b, #30=87d053eb, #56=4d6bcede, #57=ffecb62a, #58=76ced00a, #59=fb55b3c0, #60=2d687ef1, #61=dc2a89b5, #62=109e33fc, #63=db0f470a, #64=9775cd0e, #65=5c741650, #66=2aad9943, #67=a2297d9f, #68=1022767b, #69=ce0bf6b4, #70=707f290c, #71=c05e2256, #72=669a1bfa
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #29=(unset), #30=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=d3fd7a87, #15=a9733c9d, #16=6db98a06, #17=e4cbf8ca, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=66d360c8, #26=12873951, #27=fc941d05, #28=e551c572, #31=842fe1df, #32=ac268392, #33=1c179521, #43=190d3a9c, #44=2f7179e3, #45=3bea20f6, #46=a64d124e, #47=94297e69, #48=3abb47a8, #49=9434da33, #50=20daccfa, #51=1dcbc6ff, #52=f299d5d7, #53=b643916d, #54=cde317ee, #55=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=2eae9a54, #15=bd723c8a, #16=efed8e98, #17=135696d3, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=c0b8fc9f, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=34995f15, #32=25a41317, #33=71f22dc6, #43=633146b4, #44=943c7b97, #45=5b26a60d, #46=546e469, #47=aa0735a8, #48=85d3c28d, #49=77dfd097, #50=a8862f4a, #51=1a1c0d8, #52=1b5e9115, #53=754b87bd, #54=512afd6f, #55=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=environment, #16=environment, #17=vegetation, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=other, #32=other, #33=other, #43=settlement, #44=settlement, #45=settlement, #46=settlement, #47=other, #48=settlement, #49=other, #50=other, #51=other, #52=fauna, #53=settlement, #54=npc, #55=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #43=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #16=0, #17=0.45, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #43=0, #44=0, #45=0.45, #46=0, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=true, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=true, #48=true, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #43=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=true, #17=true, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=true, #32=true, #33=true, #43=false, #44=true, #45=true, #46=false, #47=false, #48=false, #49=false, #50=true, #51=true, #52=false, #53=true, #54=true, #55=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=true, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=false, #27=(unknown), #28=true, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=true, #32=true, #33=false, #43=false, #44=false, #45=false, #46=true, #47=false, #48=false, #49=false, #50=true, #51=true, #52=false, #53=false, #54=false, #55=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
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
  MeshDepthMaterial (9 programs):
    vertexShaderHash differs: #34=59ed5d71, #35=2efa42a8, #36=b69ba143, #37=2e7a6fcb, #38=c203b19a, #39=c203b19a, #40=585a1ea4, #41=263c45d6, #42=e4717b03
    fragmentShaderHash differs: #34=d729897e, #35=41e40a66, #36=d729897e, #37=758a4164, #38=41e40a66, #39=a9dd0dee, #40=a9dd0dee, #41=d729897e, #42=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 949 (+15):
  Program #85
    material: MeshStandardMaterial ''
    materialUuid: 42a68b6a-4073-49f2-b200-7f3f58b74da1
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #86
    material: MeshStandardMaterial 'Wood'
    materialUuid: aaae3023-9f3e-48c6-b456-ecdb48f6a138
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: 0e1db925-bb12-45d0-adb0-8313defd4d32
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
    materialUuid: 9681f007-4e93-483a-aa56-5f880d92bf56
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
    materialUuid: d4d03b6d-25c7-46b7-bad8-136d5617601f
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #90
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: a531b0e7-40eb-4af8-8c94-7ff80577b982
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #91
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 899c1914-bf4d-4dc5-bfe4-12cf3ea269e9
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
    materialUuid: 603e11df-2bbb-4d0e-a6f2-85fca4dc4da2
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: e22ce827-39e2-4972-83e9-74808f6b7145
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
    materialUuid: 3ee5baa2-cf99-4160-8e59-f8b5bab903ac
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #95
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 9d247205-dfff-4dd0-84f8-022d2754cd6f
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #96
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 2962cabf-1458-4954-9457-34e2cc3e8923
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #97
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 24439722-740e-4b9f-9df8-67ae5712525b
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f0875249-2b5c-48c2-99a5-496411f67ea8
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3b9320e6-a3d8-44a3-aec6-c0a56e9dac3d
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1205 (+22):
  Program #108
    material: ShaderMaterial 'SkyShader'
    materialUuid: ff4a10c2-f4a7-45cd-9426-f7a46988c48d
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #109
    material: ShaderMaterial ''
    materialUuid: f76fa1d5-0673-4825-90f0-3b9961e8d025
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #110
    material: MeshStandardMaterial ''
    materialUuid: 42a68b6a-4073-49f2-b200-7f3f58b74da1
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #111
    material: MeshStandardMaterial 'Wood'
    materialUuid: aaae3023-9f3e-48c6-b456-ecdb48f6a138
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: 0e1db925-bb12-45d0-adb0-8313defd4d32
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
    materialUuid: 9681f007-4e93-483a-aa56-5f880d92bf56
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
    materialUuid: d4d03b6d-25c7-46b7-bad8-136d5617601f
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #115
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: a531b0e7-40eb-4af8-8c94-7ff80577b982
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #116
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 899c1914-bf4d-4dc5-bfe4-12cf3ea269e9
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
    materialUuid: 603e11df-2bbb-4d0e-a6f2-85fca4dc4da2
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #118
    material: MeshStandardMaterial 'Leaves'
    materialUuid: e22ce827-39e2-4972-83e9-74808f6b7145
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
    materialUuid: 3ee5baa2-cf99-4160-8e59-f8b5bab903ac
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #120
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 9d247205-dfff-4dd0-84f8-022d2754cd6f
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #121
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 2962cabf-1458-4954-9457-34e2cc3e8923
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #122
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 24439722-740e-4b9f-9df8-67ae5712525b
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f0875249-2b5c-48c2-99a5-496411f67ea8
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3b9320e6-a3d8-44a3-aec6-c0a56e9dac3d
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #125
    material: ShaderMaterial ''
    materialUuid: 4899ec00-add7-4e2a-bb9f-760a708b7817
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
    materialUuid: 074fd510-9781-46a4-9001-474aaac1de5b
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #128
    material: ShaderMaterial ''
    materialUuid: 1951ca9e-9bd4-4a21-8c25-9f17ed1943ed
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #129
    material: ShaderMaterial ''
    materialUuid: 8d0a2f8f-1ca2-46a2-82b7-fff449a62430
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

Frame 9
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 59.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 10
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 76.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 91
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 98.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 95
  #79
      material: MeshStandardMaterial 'Pond_Pack_MAT'
      object: Mesh 'Branch_2b'
      asset: /models/items/branch.glb
      compile/link: 1144.3 ms  (upper bound — whole mirror-render call, see note above)

Frame 97
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 463.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 98
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 63.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 111
  #82
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 176.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 118
  #83
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 109.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 243
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 140.1 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 2331.5 ms
  programs >1 ms: 9
  max: 1144.3 ms (#79)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=8.8 ms  p95=10.3 ms  max=10.9 ms  Δavg vs baseline=—
  hide-grass           avg=8.7 ms  p95=10.6 ms  max=12.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-vegetation      avg=8.1 ms  p95=10.0 ms  max=11.3 ms  Δavg vs baseline=-0.8 ms (-9%)
  no vegetation/grass  avg=7.5 ms  p95=9.0 ms  max=10.2 ms  Δavg vs baseline=-1.3 ms (-15%)
  hide-environment     avg=8.7 ms  p95=10.7 ms  max=11.4 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-settlement      avg=8.3 ms  p95=10.1 ms  max=10.6 ms  Δavg vs baseline=-0.5 ms (-6%)
  no water             avg=9.0 ms  p95=11.3 ms  max=13.8 ms  Δavg vs baseline=+0.2 ms (+2%)
  hide-terrain         avg=9.0 ms  p95=11.5 ms  max=15.2 ms  Δavg vs baseline=+0.2 ms (+3%)
  hide-npc-fauna       avg=8.8 ms  p95=12.9 ms  max=14.1 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-shadows           avg=8.3 ms  p95=9.0 ms  max=9.7 ms  Δavg vs baseline=-0.5 ms (-6%)
  no-ao                avg=9.2 ms  p95=11.7 ms  max=12.7 ms  Δavg vs baseline=+0.4 ms (+5%)
  no-bloom             avg=9.5 ms  p95=12.0 ms  max=14.2 ms  Δavg vs baseline=+0.6 ms (+7%)
  no-smaa              avg=8.6 ms  p95=10.0 ms  max=10.9 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-god-rays          avg=9.1 ms  p95=11.0 ms  max=13.0 ms  Δavg vs baseline=+0.2 ms (+3%)
  no-film-grade        avg=10.7 ms  p95=14.1 ms  max=17.5 ms  Δavg vs baseline=+1.9 ms (+22%)
  no postprocessing    avg=9.8 ms  p95=12.2 ms  max=13.8 ms  Δavg vs baseline=+1.0 ms (+11%)
  no mirrors           avg=10.6 ms  p95=13.4 ms  max=15.4 ms  Δavg vs baseline=+1.8 ms (+20%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (32 samples resolved during the baseline window)
  GPU elapsed   avg=14.8 ms  p95=17.0 ms  max=17.2 ms
  CPU wall      avg=8.8 ms  p95=10.3 ms  max=10.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
