# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T14:36:58.365Z
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
Frames: 1156
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: fce67e812c8ba3dcc54eaa801154dc2e19f584ce
  runId: 2026-10-30T14-36-06-925Z-enqj22
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
  populationGate: stable waited=5085ms npc=24
  gpuTimer: available=true resolved=true samples=1162 span=postprocess+labels

FPS:
  avg: 43.4
  min: 4
  p1: 12

Frame time (wall-clock):
  avg: 23 ms
  p50: 20.6 ms
  p95: 37.5 ms
  p99: 86 ms
  max: 235.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.6 p95=12 p99=66.1 max=222.8 n=1156
  render: p50=14.1 p95=25.3 p99=32.9 max=202.2 n=1156
  frame: p50=20.6 p95=37.5 p99=86 max=235.7 n=1156

Rendering (combined renderer.info):
  draw calls: 830 avg / 2112 max
  triangles: 10.46M avg
  mirror draws: 144 avg
  geometries: 745
  textures: 372

Pass submissions (actual):
  reliability: observed
  frames: 1163 shadowRefresh=466 shadowSkipped=697
  mirror calls avg: 143
  shadow calls avg: 309
  main calls avg: 545

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
  other            draws=220 tris=25.8k meshes=220 inst=220

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
  WATER          2.4 ms
  STREAMING      1.0 ms
  NPC            2.7 ms
  FAUNA          2.0 ms
  PHYSICS        0.1 ms
  RENDER         12.6 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  WATER: 3
  STREAMING: 3
  PROPS: 1

Hitches (>= 8 ms): total=7
  chunk mesh             n=3 avg=11.7 max=18.3
  chunk items            n=1 avg=12.9 max=12.9
  chunk water            n=3 avg=9.8 max=11.0

Isolation probes:
  full               render=7.2 ms draws=278 tris=5.88M
  hide-grass         render=6.5 ms draws=256 tris=4.87M
  hide-vegetation    render=5.8 ms draws=158 tris=4.29M
  hide-vegetation-grass render=5.2 ms draws=131 tris=3.25M
  hide-environment   render=6.8 ms draws=266 tris=5.92M
  hide-settlement    render=6.0 ms draws=267 tris=5.99M
  hide-water         render=7.3 ms draws=274 tris=5.04M
  hide-terrain       render=6.3 ms draws=251 tris=3.70M
  hide-npc-fauna     render=5.1 ms draws=288 tris=6.01M
  no-shadows         render=5.8 ms draws=274 tris=5.70M
  no-ao              render=6.0 ms draws=274 tris=5.86M
  no-bloom           render=5.9 ms draws=275 tris=6.01M
  no-smaa            render=5.8 ms draws=280 tris=5.94M
  no-god-rays        render=6.5 ms draws=288 tris=6.01M
  no-film-grade      render=6.4 ms draws=283 tris=5.94M
  no-postprocessing  render=5.5 ms draws=260 tris=5.94M
  no-reflections     render=5.9 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 235.7 ms
  largest labelled hitch: 18.3 ms
  unattributed: 217.4 ms

Long frames:
  threshold: 80 ms
  count: 14
  worst: 235.7 ms

Raw sidecar:
  sampling=full factor=1 exported=1156/1156

Recommendation:
Largest frame (235.7 ms) is not explained by labelled hitches (largest 18.3 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 23
  Fauna (agents): 30

NPC:
  total: 2.7 ms/frame
  crowd pass: 0.0 ms/frame (14.8 ms cumulative)
  agent updates: 1.4 ms/frame (1629.2 ms cumulative)
  livestock: 0.7 ms/frame (763.6 ms cumulative)
    loaded tick: 0.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 25.1
    unique animals/frame: 24.0
    duplicate updates/frame: 1.1
    detached animals/frame: 0.0
    dog updates/frame: 5.5
    dog guard scans: 5.5/frame (41.9 predator candidates/frame)
    pest scans: 1.6/frame (1.6 rat candidates/frame)
    nearest scans: 7.6/frame (0.0 candidates/frame)
    water samples: 16.7/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 16.7/frame, 0.00 ms/frame (worst call 0.20 ms, 1361.0 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 25.0
    behaviour executions/frame: 7.6
    presentation executions/frame: 6.7
  rats: 0.1 ms/frame (158.9 ms cumulative)
  social: 0.0 ms/frame (7.3 ms cumulative)
  streaming: 0.3 ms/frame (326.4 ms cumulative)
  maintenance: 0.2 ms/frame (196.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.0 ms/frame
  agent updates: 1.9 ms/frame (2241.9 ms cumulative)
  forest sampling: 0.1 ms/frame (129.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (32.8 ms cumulative)
    targeting: 0.0 ms/frame (28.8 ms cumulative)
    decision: 0.0 ms/frame (23.9 ms cumulative)
    behaviour: 1.2 ms/frame (1435.9 ms cumulative)
    life/presentation: 0.4 ms/frame (439.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.7
    expensive behaviour agents/frame: 14.8
    full-rate agents/frame: 8.8
    reduced-cadence agents/frame: 21.0
    behaviour executions/frame: 15.5
    presentation executions/frame: 14.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 28.9
    village scan candidates/frame: 386.9
    player perception checks/frame: 29.7

  nearest scans: 21.0/frame (24256 calls)
  nearest candidates checked: 183.7/frame (212373 total)
  herd leader scans: 0.2/frame (215 calls)
  herd candidates checked: 5.6/frame (6450 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.7/frame (139.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 57.1/frame, 0.10 ms/frame (worst call 1.30 ms)
    collider queries: 57.1/frame, 0.10 ms/frame (worst call 1.40 ms, 4211.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 77
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.12 ms
    max 0.40 ms

  allocation/setup:
    avg 0.08 ms
    max 0.20 ms
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
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.29 ms
    max 0.80 ms

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
    allocation/setup avg/max: 0.05 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.02 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.03 / 0.10 ms
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
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=26 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1163
Shadow refresh frames: 466
Shadow skipped frames: 697

Mirror:
  calls avg: 143  tris avg: 865320
  info calls avg: 143  residual calls avg: 0
  switches avg: material=61.8 program=37.3  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.2 skeletons first used=3.2
  environment                  calls=4 tris=3838
  items                        calls=1 tris=514
  other                        calls=31 tris=4693
  settlement:decor             calls=4 tris=10317
  settlement:fence             calls=1 tris=2255
  settlement:fireCampfire      calls=2 tris=184
  settlement:fireHouseExteriorLamp calls=5 tris=251
  settlement:fireHouseInteriorLamp calls=2 tris=188
  settlement:fireVillageTorch  calls=7 tris=502
  settlement:houseInteractive  calls=5 tris=577
  settlement:houseStatic       calls=12 tris=11918
  settlement:landmarkGarden    calls=2 tris=25252
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=674
  settlement:landmarkWellHousehold calls=2 tris=2193
  settlement:landmarkWellPasture calls=2 tris=619
  settlement:other             calls=3 tris=64
  settlement:storageBarrel     calls=3 tris=4425
  settlement:storageContainer  calls=4 tris=861
  settlement:storageGoods      calls=14 tris=2792
  settlement:storageHay        calls=0 tris=189
  settlement:storageTrough     calls=2 tris=556
  settlement:storageWoodHousehold calls=1 tris=1910
  settlement:storageWoodSettlementPrimary calls=0 tris=288
  settlement:workplace         calls=3 tris=1343
  terrain                      calls=5 tris=401257
  vegetation                   calls=24 tris=387813

Shadow (refresh only):
  calls avg: 309  tris avg: 2295584
  info calls avg: 309  residual calls avg: 0
  switches avg: material=120.7 program=125  actor: calls=29.8 material=0 program=5.5
  skinning avg: skinned calls=31.1 skeletons first used=9.6
  environment                  calls=11 tris=6111
  faunaFamily:chicken          calls=3 tris=331
  faunaFamily:cow              calls=2 tris=705
  faunaFamily:dog              calls=1 tris=313
  faunaFamily:horse            calls=2 tris=585
  faunaFamily:rabbit           calls=1 tris=732
  faunaFamily:rat              calls=0 tris=301
  faunaFamily:rooster          calls=0 tris=278
  faunaFamily:sheep            calls=2 tris=613
  faunaFamily:stag             calls=6 tris=3631
  items                        calls=4 tris=1936
  npcFamily:Farmer             calls=3 tris=3976
  npcFamily:Knight_Cloth       calls=3 tris=3795
  npcFamily:Peasant            calls=5 tris=6020
  npcFamily:Peasant_Boots      calls=1 tris=891
  npcFamily:Ranger_NoHood      calls=1 tris=1108
  npcFamily:woodcutter         calls=1 tris=789
  other                        calls=50 tris=11008
  settlement:decor             calls=95 tris=185829
  settlement:fireHouseInteriorLamp calls=3 tris=336
  settlement:houseInteractive  calls=6 tris=986
  settlement:houseStatic       calls=19 tris=25506
  settlement:landmarkGarden    calls=1 tris=848
  settlement:landmarkNoticeBoard calls=1 tris=20
  settlement:landmarkWellCentral calls=3 tris=1011
  settlement:other             calls=4 tris=74
  settlement:storageContainer  calls=4 tris=1174
  settlement:storageHay        calls=1 tris=259
  settlement:storageTrough     calls=1 tris=749
  settlement:storageWoodHousehold calls=1 tris=2943
  settlement:storageWoodSettlementPrimary calls=1 tris=413
  settlement:workplace         calls=2 tris=1829
  terrain                      calls=19 tris=1369688
  vegetation                   calls=55 tris=660799

Main:
  calls avg: 545  tris avg: 8653946
  info calls avg: 683  residual calls avg: 0
  switches avg: material=255.2 program=116.4  actor: calls=91.1 material=66.3 program=30
  skinning avg: skinned calls=93.6 skeletons first used=20.6
  environment                  calls=49 tris=13262
  faunaFamily:bear             calls=1 tris=612
  faunaFamily:chicken          calls=6 tris=831
  faunaFamily:cow              calls=0 tris=178
  faunaFamily:dog              calls=12 tris=4039
  faunaFamily:horse            calls=0 tris=98
  faunaFamily:rabbit           calls=0 tris=177
  faunaFamily:rat              calls=1 tris=2648
  faunaFamily:rooster          calls=0 tris=108
  faunaFamily:sheep            calls=4 tris=1368
  faunaFamily:wolf             calls=3 tris=1310
  grass                        calls=38 tris=5353914
  items                        calls=45 tris=5189
  npcFamily:Farmer             calls=8 tris=11123
  npcFamily:Knight_Cloth       calls=7 tris=9408
  npcFamily:Peasant            calls=36 tris=43710
  npcFamily:Peasant_Boots      calls=6 tris=7766
  npcFamily:blacksmith         calls=6 tris=9142
  other                        calls=81 tris=14438
  settlement:decor             calls=8 tris=20937
  settlement:fence             calls=3 tris=4508
  settlement:fireCampfire      calls=5 tris=362
  settlement:fireHouseExteriorLamp calls=10 tris=499
  settlement:fireHouseInteriorLamp calls=3 tris=376
  settlement:fireVillageTorch  calls=14 tris=1002
  settlement:houseInteractive  calls=10 tris=1152
  settlement:houseStatic       calls=22 tris=21767
  settlement:landmarkGarden    calls=5 tris=49324
  settlement:landmarkNoticeBoard calls=1 tris=27
  settlement:landmarkWellCentral calls=4 tris=1383
  settlement:landmarkWellHousehold calls=4 tris=4364
  settlement:landmarkWellPasture calls=3 tris=1241
  settlement:other             calls=7 tris=127
  settlement:storageBarrel     calls=5 tris=8911
  settlement:storageContainer  calls=8 tris=1707
  settlement:storageGoods      calls=27 tris=5631
  settlement:storageHay        calls=1 tris=373
  settlement:storageTrough     calls=3 tris=1131
  settlement:storageWoodHousehold calls=1 tris=3868
  settlement:storageWoodSettlementPrimary calls=1 tris=571
  settlement:workplace         calls=6 tris=2720
  terrain                      calls=24 tris=1733380
  vegetation                   calls=56 tris=829442
  water                        calls=7 tris=480165


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 14
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 14 total):

[LONG FRAME] 235.7ms
simulate       222.8ms
render          12.7ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC            214.3ms
FAUNA            1.2ms
PHYSICS          0.3ms
RENDER          12.7ms
OTHER            7.1ms

streaming / stages:
  riverTileBuild               133.2ms
  terrainPrepare               8.0ms
  riverChannelSegmentsNear     0.5ms

Long frame #2:

[LONG FRAME] 210.3ms
simulate         7.0ms
render         202.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          187.6ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA            0.8ms
PHYSICS          0.0ms
RENDER          14.6ms
OTHER            5.6ms

Long frame #3:

[LONG FRAME] 167ms
simulate       156.0ms
render          10.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING      144.9ms
NPC              3.2ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER          10.6ms
OTHER            6.7ms

streaming / stages:
  chunkUpdate                  144.9ms
  riverTileBuild               133.2ms
  terrainPrepare               1.6ms
  riverChannelSegmentsNear     0.6ms

Long frame #4:

[LONG FRAME] 156.6ms
simulate       120.6ms
render          34.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING       72.6ms
NPC              2.1ms
FAUNA           98.4ms
PHYSICS          0.0ms
RENDER          34.0ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              28.6ms
  waterFinalize                27.5ms
  chunkFinalize                14.4ms
  chunkUpdate                  14.4ms
  contentFinalize              14.3ms
  riverFinalize                1.3ms

hitches:
  STREAMING chunk mesh             8.7ms
  STREAMING chunk mesh             8.1ms
  WATER chunk water            9.4ms
  WATER chunk water            8.9ms
  PROPS chunk items            12.9ms

Long frame #5:

[LONG FRAME] 124ms
simulate       118.3ms
render           5.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC            112.3ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER           5.4ms
OTHER            5.3ms

streaming / stages:
  riverTileBuild               95.8ms
  terrainPrepare               5.3ms
  riverChannelSegmentsNear     0.8ms

---

[Seedvale Program Census]

Programs created: 132
Program count: final=132 max=132

By frame:
  frame 0   +78 programs   <== largest transition
  frame 36   +1 program
  frame 343   +1 program
  frame 377   +2 programs
  frame 385   +2 programs
  frame 452   +1 program
  frame 534   +1 program
  frame 571   +1 program
  frame 1900   +19 programs
  frame 1947   +4 programs
  frame 2181   +22 programs

Largest transition — frame 0 (+78 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=265ea759-1bde-4291-9d7e-1744100cfaa4 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9900e3b3-96e0-4bc8-8a1b-e059f8539559
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=b8d018fe-09dd-4bfa-a281-e699b057a511
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d85fa168-a758-4850-a912-47db7b3e61be
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8572a891-08d3-40f9-a798-bf2c8671eab6
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=80c40607-8893-4bc7-89a9-7d00fbe68f71
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=138a3005-2f43-4140-8452-cf30f34be5c8
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=66b125c4-e7aa-4e3c-b2d9-a83b5744a582
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7d69f7a0-4a1c-4271-9729-fb15168b73b6
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dcacf64c-62b1-4fec-ba97-cd0b3b523150 (Wood)
  #10 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=65e09a3d-e784-4890-ba4c-ab7d93c62079 (Flowers)
  #11 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=905afc67-64f5-4e96-b7e9-fc781f48e11d (None)
  #12 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4deedbc7-a765-4dd6-bfbb-9e1508e2d29a (Green)
  #13 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5039163a-d989-4b1f-ae72-25fd588ef0e9 (Pink)
  #14 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=acde6452-dc19-498c-ae3a-727ccd4f54fa (Stone)
  #15 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e40fa1c1-8812-4696-bc75-20ce2d69bf92 (Wood)
  #16 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=018c0f0a-5f46-4e0b-a51b-840264ded1c6 (MI_WoodTrim)
  #17 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #18 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=55847879-c52f-45bd-a3e3-6595f93e8ec2 (MI_WindowGlass)
  #19 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=45450300-5ad0-45e4-b535-d2491badaa96
  #20 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=9a2c1450-f75e-4423-b097-207e2398a1e2 (MI_WoodTrim)
  #21 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #22 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=55dba95c-5603-452b-9f6b-b9796e3fbffa (MI_WindowGlass)
  #23 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #24 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #25 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=86ff356f-38f0-4682-bd42-7e565b18ff27 (MapleTree_Leaves)
  #26 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=88c09455-bd36-4628-9785-7720a6f7af57 (Green)
  #27 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=326b196c-f255-4934-a109-836e3becdd43 (MapleTree_Bark)
  #28 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #29 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #30 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a068927f-d521-4892-a7b3-c2a10860f024
  #31 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9b0de040-f142-44d8-b98d-602918b18be6 (Main)
  #32 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3e10355e-1f1c-4961-8cdf-78a105585930 (Main)
  #33 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1affa31c-15ff-4b23-b6e4-11990c4ad018 (lambert2SG)
  #34 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=226ade32-9e2e-4fb4-bc2f-eccf4a885e6c (Material #55)
  #35 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=5c9e2cd5-4808-489e-abb8-85d793774fdd (Handle)
  #36 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ba3e4815-1058-44dd-891d-502515e3a54e (PathRocks)
  #37 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=cf28ee04-47ca-4c06-af86-12697c2c120d (MI_Knight)
  #38 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=31b21bda-6bff-468f-8cfc-339a08642b41 (MI_Knight)
  #39 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ee41846b-b555-44d3-8a50-0870d1580401 (MI_Hair_1)
  #40 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bbf2a327-5549-464b-8f57-25ee650b3afc (MI_Hair_1)
  #41 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=990eaa93-379d-4a25-bf94-b5deb7ef63d5 (MI_Peasant)
  #42 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=023994c8-8583-4a83-b18a-29351a6b8878 (MI_Hair_1)
  #43 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fbe37ebc-ed99-4dad-a966-15f70b42d244 (MI_Hair_1)
  #44 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=80917d5e fHash=633146b4 stage=postprocess-render
  #45 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d612cf03 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=2e76c49c-0aca-42b4-9f3a-a13e6f6fe482 (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='lambert2SG' cacheKey=physical,STANDARD,,highp… vHash=a369060f fHash=f6cbc3c stage=postprocess-render
  #47 type=MeshStandardMaterial name='Leaves' cacheKey=physical,STANDARD,,highp… vHash=984eda2a fHash=9ac194ed stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #51 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #52 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #53 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #54 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #55 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #56 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #57 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3690a161-33e0-4c28-90e4-53e2e8cf92cf (stockpiles_vc)
  #58 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=d13905ad-1bb1-4a04-a07e-be387835afa2
  #59 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2b51e990-a915-40e3-b9dc-aba4845b6252 (DarkGreen)
  #60 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #72 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #73 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #74 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #75 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #76 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #77 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #23=df7c703d, #24=f92c8d8c, #28=5b43c776, #60=279cec18, #61=84736a68, #62=aa2edbee, #63=7bae0bb2, #64=436caea4, #65=886438e7, #66=d99a5b29, #67=2003ced8, #68=28dfa407, #69=756a0b19, #70=b2354ff2, #71=ea82969e, #72=7dab8d9a, #73=378e1fb7, #74=78acf7ea, #75=a312c579, #76=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #23=236b3b0b, #24=87d053eb, #28=70b71dad, #60=4d6bcede, #61=ffecb62a, #62=76ced00a, #63=fb55b3c0, #64=2d687ef1, #65=dc2a89b5, #66=109e33fc, #67=db0f470a, #68=9775cd0e, #69=5c741650, #70=2aad9943, #71=a2297d9f, #72=1022767b, #73=ce0bf6b4, #74=707f290c, #75=c05e2256, #76=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #23=(unset), #24=(unset), #28=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset), #76=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #23=(unknown), #24=(unknown), #28=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown)
  MeshStandardMaterial (38 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #10=e4cbf8ca, #11=6db98a06, #12=c0d790d1, #13=d3fd7a87, #14=a9733c9d, #15=f3a1039e, #16=c5e73b05, #17=13a74ec7, #18=9dcf1cb4, #19=66d360c8, #20=12873951, #21=fc941d05, #22=e551c572, #25=d9d07622, #26=190d3a9c, #27=9dbe8ee7, #31=fd8301ed, #32=54e03756, #33=7bb77142, #35=88cdd138, #36=b643916d, #37=140c5e62, #38=eb2eade3, #39=c8a982c1, #40=ee59055a, #41=842fe1df, #42=ac268392, #43=1c179521, #44=80917d5e, #45=d612cf03, #46=a369060f, #47=984eda2a, #57=a64d124e, #58=94297e69, #59=9434da33
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #10=135696d3, #11=efed8e98, #12=a81023c3, #13=2eae9a54, #14=bd723c8a, #15=c7daf23, #16=d4c95125, #17=3ab4c629, #18=2d1aa4a, #19=c0b8fc9f, #20=d4c95125, #21=3ab4c629, #22=2d1aa4a, #25=135696d3, #26=633146b4, #27=8dba9dd, #31=2f2885d5, #32=d391c52, #33=87728b15, #35=f2ad9521, #36=754b87bd, #37=46d4b31c, #38=6eafecb9, #39=8ab73626, #40=e8d88acf, #41=34995f15, #42=25a41317, #43=71f22dc6, #44=633146b4, #45=8dba9dd, #46=f6cbc3c, #47=9ac194ed, #57=546e469, #58=aa0735a8, #59=77dfd097
    bucket differs: #2=terrain, #7=other, #9=other, #10=vegetation, #11=environment, #12=vegetation, #13=vegetation, #14=environment, #15=settlement, #16=settlement, #17=(unknown), #18=settlement, #19=settlement, #20=settlement, #21=(unknown), #22=settlement, #25=settlement, #26=settlement, #27=settlement, #31=fauna, #32=fauna, #33=fauna, #35=settlement, #36=settlement, #37=npc, #38=npc, #39=npc, #40=npc, #41=other, #42=other, #43=other, #44=(unknown), #45=settlement, #46=(unknown), #47=(unknown), #57=settlement, #58=other, #59=other
    define STANDARD differs: #2=, #7=, #9=, #10=, #11=, #12=, #13=, #14=, #15=, #16=, #17=(unset), #18=, #19=, #20=, #21=(unset), #22=, #25=, #26=, #27=, #31=, #32=, #33=, #35=, #36=, #37=, #38=, #39=, #40=, #41=, #42=, #43=, #44=(unset), #45=, #46=(unset), #47=(unset), #57=, #58=, #59=
    flag alphaTest differs: #2=0, #7=0, #9=0, #10=0.45, #11=0, #12=0, #13=0, #14=0, #15=0, #16=0, #17=(unknown), #18=0, #19=0, #20=0, #21=(unknown), #22=0, #25=0.45, #26=0, #27=0, #31=0, #32=0, #33=0, #35=0, #36=0, #37=0, #38=0, #39=0, #40=0, #41=0, #42=0, #43=0, #44=(unknown), #45=0, #46=(unknown), #47=(unknown), #57=0, #58=0, #59=0
    flag envMap differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=false, #21=(unknown), #22=false, #25=false, #26=false, #27=false, #31=false, #32=false, #33=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #43=false, #44=(unknown), #45=false, #46=(unknown), #47=(unknown), #57=false, #58=false, #59=false
    flag flatShading differs: #2=false, #7=true, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=true, #20=false, #21=(unknown), #22=false, #25=false, #26=false, #27=false, #31=false, #32=false, #33=false, #35=true, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #43=false, #44=(unknown), #45=false, #46=(unknown), #47=(unknown), #57=false, #58=true, #59=false
    flag fog differs: #2=true, #7=true, #9=true, #10=true, #11=true, #12=true, #13=true, #14=true, #15=true, #16=true, #17=(unknown), #18=true, #19=true, #20=true, #21=(unknown), #22=true, #25=true, #26=true, #27=true, #31=true, #32=true, #33=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #41=true, #42=true, #43=true, #44=(unknown), #45=true, #46=(unknown), #47=(unknown), #57=true, #58=true, #59=true
    flag map differs: #2=false, #7=false, #9=false, #10=true, #11=true, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=false, #20=true, #21=(unknown), #22=false, #25=true, #26=false, #27=true, #31=false, #32=false, #33=true, #35=false, #36=true, #37=true, #38=true, #39=true, #40=true, #41=true, #42=true, #43=true, #44=(unknown), #45=true, #46=(unknown), #47=(unknown), #57=false, #58=false, #59=false
    flag normalMap differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=false, #20=true, #21=(unknown), #22=false, #25=false, #26=false, #27=true, #31=false, #32=false, #33=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #43=false, #44=(unknown), #45=true, #46=(unknown), #47=(unknown), #57=false, #58=false, #59=false
    flag transparent differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=true, #19=false, #20=false, #21=(unknown), #22=true, #25=false, #26=false, #27=false, #31=false, #32=false, #33=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #43=false, #44=(unknown), #45=false, #46=(unknown), #47=(unknown), #57=false, #58=false, #59=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=false, #21=(unknown), #22=false, #25=false, #26=false, #27=false, #31=false, #32=false, #33=false, #35=false, #36=false, #37=false, #38=true, #39=true, #40=false, #41=true, #42=true, #43=false, #44=(unknown), #45=false, #46=(unknown), #47=(unknown), #57=true, #58=false, #59=false
    flag wireframe differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=false, #21=(unknown), #22=false, #25=false, #26=false, #27=false, #31=false, #32=false, #33=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #41=false, #42=false, #43=false, #44=(unknown), #45=false, #46=(unknown), #47=(unknown), #57=false, #58=false, #59=false
  MeshBasicMaterial (3 programs):
    vertexShaderHash differs: #8=5efaf074, #29=d459e49b, #30=b6911298
    fragmentShaderHash differs: #8=5cf0ca9a, #29=a8a9bac3, #30=73a25d1e
    bucket differs: #8=other, #29=(unknown), #30=other
    flag alphaTest differs: #8=0, #29=(unknown), #30=0
    flag envMap differs: #8=false, #29=(unknown), #30=false
    flag fog differs: #8=true, #29=(unknown), #30=false
    flag map differs: #8=true, #29=(unknown), #30=true
    flag normalMap differs: #8=false, #29=(unknown), #30=false
    flag transparent differs: #8=true, #29=(unknown), #30=true
    flag vertexColors differs: #8=false, #29=(unknown), #30=false
    flag wireframe differs: #8=false, #29=(unknown), #30=false
  MeshPhysicalMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (9 programs):
    vertexShaderHash differs: #48=59ed5d71, #49=b69ba143, #50=2e7a6fcb, #51=c203b19a, #52=c203b19a, #53=585a1ea4, #54=263c45d6, #55=e4717b03, #56=2efa42a8
    fragmentShaderHash differs: #48=d729897e, #49=d729897e, #50=758a4164, #51=41e40a66, #52=a9dd0dee, #53=a9dd0dee, #54=d729897e, #55=41e40a66, #56=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1900 (+19):
  Program #87
    material: MeshStandardMaterial ''
    materialUuid: b8d018fe-09dd-4bfa-a281-e699b057a511
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #88
    material: MeshStandardMaterial 'Wood'
    materialUuid: ec9fc415-8cd7-4721-91ab-b4152281db36
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #89
    material: MeshStandardMaterial 'Green'
    materialUuid: e38bb85e-8ce5-45f5-a22a-4ba9aa6b537d
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
    material: MeshStandardMaterial 'Green'
    materialUuid: 57a3a3ad-7ef9-477f-8349-3e2693b03064
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
  Program #91
    material: MeshStandardMaterial 'Berry'
    materialUuid: b12335e3-59e5-44e9-90db-4fe7f9463b2f
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #92
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 2e76c49c-0aca-42b4-9f3a-a13e6f6fe482
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #93
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 65e09a3d-e784-4890-ba4c-ab7d93c62079
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
    materialUuid: d6aff4bf-f44a-4ec2-aca6-24ae8f8e6951
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #95
    material: MeshStandardMaterial 'Leaves'
    materialUuid: ad629701-6874-441a-84b1-8d90357f4b22
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
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 3690a161-33e0-4c28-90e4-53e2e8cf92cf
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #97
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 9a2c1450-f75e-4423-b097-207e2398a1e2
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #98
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 8262615d-3a95-4229-aae5-b90a96de2dfe
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #99
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: ed83c15f-a391-431e-acf6-518377ffed34
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #100
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 990eaa93-379d-4a25-bf94-b5deb7ef63d5
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 023994c8-8583-4a83-b18a-29351a6b8878
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #102
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: fbe37ebc-ed99-4dad-a966-15f70b42d244
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #103
    material: MeshStandardMaterial ''
    materialUuid: 6aec000e-d246-4157-b3c3-d7dd32f21be2
    object: Mesh 'settlement-house-chests-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d7607dd2
    fragmentShaderHash: 83e94369
  Program #104
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #105
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: 55dba95c-5603-452b-9f6b-b9796e3fbffa
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2181 (+22):
  Program #110
    material: ShaderMaterial 'SkyShader'
    materialUuid: 265ea759-1bde-4291-9d7e-1744100cfaa4
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #111
    material: ShaderMaterial ''
    materialUuid: 138a3005-2f43-4140-8452-cf30f34be5c8
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #112
    material: MeshStandardMaterial ''
    materialUuid: b8d018fe-09dd-4bfa-a281-e699b057a511
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #113
    material: MeshStandardMaterial 'Wood'
    materialUuid: ec9fc415-8cd7-4721-91ab-b4152281db36
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: e38bb85e-8ce5-45f5-a22a-4ba9aa6b537d
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
    materialUuid: 57a3a3ad-7ef9-477f-8349-3e2693b03064
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
    materialUuid: b12335e3-59e5-44e9-90db-4fe7f9463b2f
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #117
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 2e76c49c-0aca-42b4-9f3a-a13e6f6fe482
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #118
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 65e09a3d-e784-4890-ba4c-ab7d93c62079
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
    materialUuid: d6aff4bf-f44a-4ec2-aca6-24ae8f8e6951
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #120
    material: MeshStandardMaterial 'Leaves'
    materialUuid: ad629701-6874-441a-84b1-8d90357f4b22
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
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 3690a161-33e0-4c28-90e4-53e2e8cf92cf
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #122
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 8262615d-3a95-4229-aae5-b90a96de2dfe
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #123
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: ed83c15f-a391-431e-acf6-518377ffed34
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #124
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 990eaa93-379d-4a25-bf94-b5deb7ef63d5
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 023994c8-8583-4a83-b18a-29351a6b8878
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #126
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: fbe37ebc-ed99-4dad-a966-15f70b42d244
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #127
    material: ShaderMaterial ''
    materialUuid: 80c40607-8893-4bc7-89a9-7d00fbe68f71
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #128
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 14,15,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #129
    material: MeshBasicMaterial ''
    materialUuid: 7d69f7a0-4a1c-4271-9729-fb15168b73b6
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #130
    material: ShaderMaterial ''
    materialUuid: f79662f5-3dff-4f7b-8b97-6202b61f62e3
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #131
    material: ShaderMaterial ''
    materialUuid: b76b6252-6f8b-4fdb-99f8-716437b38041
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
Excluded — no reliable per-program timing: 127 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 36
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 24.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 343
  #79
      material: MeshStandardMaterial 'Pond_Pack_MAT'
      object: Mesh 'Branch_2b'
      asset: /models/items/branch.glb
      compile/link: 186.1 ms  (upper bound — whole mirror-render call, see note above)

Frame 452
  #84
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 26.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 534
  #85
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 17.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 571
  #86
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 18.6 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 272.9 ms
  programs >1 ms: 5
  max: 186.1 ms (#79)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=7.2 ms  p95=8.5 ms  max=13.0 ms  Δavg vs baseline=—
  hide-grass           avg=6.5 ms  p95=7.6 ms  max=8.4 ms  Δavg vs baseline=-0.7 ms (-10%)
  hide-vegetation      avg=5.8 ms  p95=7.1 ms  max=7.9 ms  Δavg vs baseline=-1.4 ms (-19%)
  no vegetation/grass  avg=5.2 ms  p95=6.1 ms  max=6.4 ms  Δavg vs baseline=-2.0 ms (-27%)
  hide-environment     avg=6.8 ms  p95=7.9 ms  max=8.6 ms  Δavg vs baseline=-0.4 ms (-6%)
  hide-settlement      avg=6.0 ms  p95=7.6 ms  max=10.4 ms  Δavg vs baseline=-1.2 ms (-16%)
  no water             avg=7.3 ms  p95=9.1 ms  max=10.0 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-terrain         avg=6.3 ms  p95=8.3 ms  max=8.5 ms  Δavg vs baseline=-0.9 ms (-12%)
  hide-npc-fauna       avg=5.1 ms  p95=6.1 ms  max=6.4 ms  Δavg vs baseline=-2.1 ms (-29%)
  no-shadows           avg=5.8 ms  p95=6.9 ms  max=7.3 ms  Δavg vs baseline=-1.4 ms (-19%)
  no-ao                avg=6.0 ms  p95=8.4 ms  max=11.3 ms  Δavg vs baseline=-1.2 ms (-17%)
  no-bloom             avg=5.9 ms  p95=7.3 ms  max=7.9 ms  Δavg vs baseline=-1.3 ms (-18%)
  no-smaa              avg=5.8 ms  p95=6.8 ms  max=7.1 ms  Δavg vs baseline=-1.4 ms (-19%)
  no-god-rays          avg=6.5 ms  p95=8.8 ms  max=10.6 ms  Δavg vs baseline=-0.7 ms (-10%)
  no-film-grade        avg=6.4 ms  p95=8.1 ms  max=10.0 ms  Δavg vs baseline=-0.8 ms (-11%)
  no postprocessing    avg=5.5 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=-1.7 ms (-24%)
  no mirrors           avg=5.9 ms  p95=6.8 ms  max=7.1 ms  Δavg vs baseline=-1.3 ms (-18%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=12.8 ms  p95=14.3 ms  max=15.2 ms
  CPU wall      avg=7.2 ms  p95=8.5 ms  max=13.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
