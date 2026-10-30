# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T14:34:16.188Z
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
Frames: 1360
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: fce67e812c8ba3dcc54eaa801154dc2e19f584ce
  runId: 2026-10-30T14-33-24-867Z-1hsrmx
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
  camera: pos=(427.2, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5100ms npc=24
  gpuTimer: available=true resolved=true samples=1367 span=postprocess+labels

FPS:
  avg: 58.1
  min: 4
  p1: 16

Frame time (wall-clock):
  avg: 17.2 ms
  p50: 15.2 ms
  p95: 30 ms
  p99: 61.1 ms
  max: 277.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.1 p95=9.4 p99=25 max=97 n=1360
  render: p50=10.3 p95=21.3 p99=27.3 max=231.2 n=1360
  frame: p50=15.2 p95=30 p99=61.1 max=277.5 n=1360

Rendering (combined renderer.info):
  draw calls: 834 avg / 2104 max
  triangles: 10.35M avg
  mirror draws: 141 avg
  geometries: 753
  textures: 374

Pass submissions (actual):
  reliability: observed
  frames: 1368 shadowRefresh=570 shadowSkipped=798
  mirror calls avg: 141
  shadow calls avg: 318
  main calls avg: 544

Scene (one-pass estimate):
  terrain          draws=70 tris=5.16M meshes=70 inst=70
  grass            draws=49 tris=1.18M meshes=49 inst=124428
  vegetation       draws=199 tris=1.32M meshes=199 inst=841
  environment      draws=127 tris=25.5k meshes=127 inst=143
  settlement       draws=646 tris=738.7k meshes=646 inst=1412
  water            draws=52 tris=3.77M meshes=52 inst=52
  npc              draws=213 tris=273.1k meshes=213 inst=213
  fauna            draws=232 tris=96.8k meshes=232 inst=232
  items            draws=338 tris=28.6k meshes=338 inst=338
  other            draws=221 tris=26.0k meshes=221 inst=221

Shadow casters (one-pass estimate):
  terrain          draws=70 tris=5.16M meshes=70 inst=70
  vegetation       draws=183 tris=1.27M meshes=183 inst=813
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=417 tris=504.0k meshes=417 inst=1099
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=100 tris=14.7k meshes=100 inst=100

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
  terrain                  nodes=70 composed=70 multiplied=70 skinned=0
  grass                    nodes=64 composed=64 multiplied=64 skinned=0
  vegetation               nodes=234 composed=234 multiplied=234 skinned=0
  environment              nodes=221 composed=221 multiplied=221 skinned=0
  settlement               nodes=1293 composed=1293 multiplied=1293 skinned=0
  water                    nodes=52 composed=52 multiplied=52 skinned=0
  npc                      nodes=1801 composed=1801 multiplied=1801 skinned=213
  fauna                    nodes=2626 composed=2626 multiplied=2626 skinned=212
  items                    nodes=522 composed=522 multiplied=522 skinned=0
  other                    nodes=434 composed=417 multiplied=434 skinned=9
  top scene children:
    fauna ×60                nodes=2626 composed=2626 multiplied=2626 skinned=212
    npc ×23                  nodes=1801 composed=1801 multiplied=1801 skinned=213
    settlement ×3            nodes=1293 composed=1293 multiplied=1293 skinned=0
    chunk-items ×32          nodes=513 composed=513 multiplied=513 skinned=0
    Group ×35                nodes=248 composed=248 multiplied=248 skinned=9
    chunk-environmen ×3      nodes=163 composed=163 multiplied=163 skinned=0
    chunk ×70                nodes=70 composed=70 multiplied=70 skinned=0
    chunk-grass ×15          nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-water ×51          nodes=51 composed=51 multiplied=51 skinned=0
    chunk-river ×42          nodes=42 composed=42 multiplied=42 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          2.1 ms
  STREAMING      0.5 ms
  NPC            1.9 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         9.5 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  RENDER: 6
  STREAMING: 5
  WATER: 1
  FAUNA: 1

Hitches (>= 8 ms): total=6
  chunk mesh             n=5 avg=10.6 max=12.7
  chunk water            n=1 avg=9.2 max=9.2

Isolation probes:
  full               render=6.3 ms draws=288 tris=6.01M
  hide-grass         render=5.4 ms draws=254 tris=4.88M
  hide-vegetation    render=4.7 ms draws=157 tris=4.24M
  hide-vegetation-grass render=4.3 ms draws=131 tris=3.25M
  hide-environment   render=5.4 ms draws=264 tris=5.93M
  hide-settlement    render=4.8 ms draws=264 tris=5.91M
  hide-water         render=5.6 ms draws=269 tris=4.98M
  hide-terrain       render=5.2 ms draws=253 tris=3.74M
  hide-npc-fauna     render=4.5 ms draws=293 tris=6.08M
  no-shadows         render=5.5 ms draws=278 tris=5.77M
  no-ao              render=5.1 ms draws=287 tris=6.08M
  no-bloom           render=5.8 ms draws=275 tris=6.01M
  no-smaa            render=5.3 ms draws=277 tris=5.86M
  no-god-rays        render=6.2 ms draws=288 tris=6.01M
  no-film-grade      render=5.5 ms draws=283 tris=5.94M
  no-postprocessing  render=7.3 ms draws=265 tris=6.01M
  no-reflections     render=6.6 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 277.5 ms
  largest labelled hitch: 12.7 ms
  unattributed: 264.8 ms

Long frames:
  threshold: 80 ms
  count: 8
  worst: 277.5 ms

Raw sidecar:
  sampling=full factor=1 exported=1360/1360

Recommendation:
Largest frame (277.5 ms) is not explained by labelled hitches (largest 12.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 23
  Fauna (agents): 30

NPC:
  total: 1.9 ms/frame
  crowd pass: 0.0 ms/frame (11.2 ms cumulative)
  agent updates: 1.1 ms/frame (1443.9 ms cumulative)
  livestock: 0.4 ms/frame (596.7 ms cumulative)
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
    update calls/frame: 23.7
    unique animals/frame: 22.8
    duplicate updates/frame: 0.9
    detached animals/frame: 0.0
    dog updates/frame: 4.9
    dog guard scans: 4.9/frame (39.3 predator candidates/frame)
    pest scans: 1.2/frame (1.2 rat candidates/frame)
    nearest scans: 6.3/frame (0.0 candidates/frame)
    water samples: 13.2/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 13.2/frame, 0.00 ms/frame (worst call 1.50 ms, 1101.2 colliders/frame)
    full-rate agents/frame: 0.7
    reduced-cadence agents/frame: 23.0
    behaviour executions/frame: 6.9
    presentation executions/frame: 6.2
  rats: 0.1 ms/frame (132.0 ms cumulative)
  social: 0.0 ms/frame (5.4 ms cumulative)
  streaming: 0.1 ms/frame (135.8 ms cumulative)
  maintenance: 0.1 ms/frame (173.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.3 ms/frame (1835.0 ms cumulative)
  forest sampling: 0.1 ms/frame (112.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (25.7 ms cumulative)
    targeting: 0.0 ms/frame (19.6 ms cumulative)
    decision: 0.0 ms/frame (20.9 ms cumulative)
    behaviour: 0.8 ms/frame (1049.8 ms cumulative)
    life/presentation: 0.3 ms/frame (463.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.0
    decision passes/frame: 29.0
    high-priority agents/frame: 0.2
    expensive behaviour agents/frame: 15.4
    full-rate agents/frame: 10.0
    reduced-cadence agents/frame: 18.9
    behaviour executions/frame: 15.5
    presentation executions/frame: 14.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 22.4
    village scan candidates/frame: 338.5
    player perception checks/frame: 29.0

  nearest scans: 21.2/frame (28824 calls)
  nearest candidates checked: 178.1/frame (242245 total)
  herd leader scans: 0.0/frame (63 calls)
  herd candidates checked: 1.4/frame (1890 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.7/frame (151.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 78.5/frame, 0.10 ms/frame (worst call 1.10 ms)
    collider queries: 78.5/frame, 0.10 ms/frame (worst call 0.80 ms, 6116.9 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 77
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.12 ms
    max 0.70 ms

  allocation/setup:
    avg 0.06 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.04 ms
    max 0.20 ms
  scene attach (`scene.add`):
    avg 0.04 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.27 ms
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
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
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
    allocation/setup avg/max: 0.04 / 0.10 ms
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
Frames: 1368
Shadow refresh frames: 570
Shadow skipped frames: 798

Mirror:
  calls avg: 141  tris avg: 834403
  info calls avg: 141  residual calls avg: 0
  switches avg: material=60.6 program=36.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.2 skeletons first used=3.2
  environment                  calls=4 tris=3704
  items                        calls=1 tris=513
  other                        calls=30 tris=4608
  settlement:decor             calls=4 tris=9793
  settlement:fence             calls=1 tris=2138
  settlement:fireCampfire      calls=2 tris=181
  settlement:fireHouseExteriorLamp calls=5 tris=250
  settlement:fireHouseInteriorLamp calls=2 tris=188
  settlement:fireVillageTorch  calls=7 tris=500
  settlement:houseInteractive  calls=5 tris=575
  settlement:houseStatic       calls=12 tris=11572
  settlement:landmarkGarden    calls=2 tris=25039
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=681
  settlement:landmarkWellHousehold calls=2 tris=2127
  settlement:landmarkWellPasture calls=2 tris=581
  settlement:other             calls=3 tris=64
  settlement:storageBarrel     calls=3 tris=4307
  settlement:storageContainer  calls=4 tris=831
  settlement:storageGoods      calls=14 tris=2790
  settlement:storageHay        calls=0 tris=186
  settlement:storageTrough     calls=2 tris=532
  settlement:storageWoodHousehold calls=0 tris=1833
  settlement:storageWoodSettlementPrimary calls=0 tris=293
  settlement:workplace         calls=3 tris=1334
  terrain                      calls=5 tris=389028
  vegetation                   calls=23 tris=370901

Shadow (refresh only):
  calls avg: 318  tris avg: 2247825
  info calls avg: 318  residual calls avg: 0
  switches avg: material=121.9 program=126.4  actor: calls=36.3 material=0 program=6
  skinning avg: skinned calls=36.7 skeletons first used=10.8
  environment                  calls=11 tris=5685
  faunaFamily:boar             calls=3 tris=1385
  faunaFamily:chicken          calls=3 tris=332
  faunaFamily:cow              calls=2 tris=692
  faunaFamily:dog              calls=2 tris=589
  faunaFamily:duck             calls=1 tris=32
  faunaFamily:fox              calls=1 tris=512
  faunaFamily:horse            calls=2 tris=567
  faunaFamily:rabbit           calls=1 tris=700
  faunaFamily:rat              calls=0 tris=302
  faunaFamily:rooster          calls=0 tris=291
  faunaFamily:sheep            calls=2 tris=608
  faunaFamily:stag             calls=6 tris=3670
  faunaFamily:wolf             calls=1 tris=620
  items                        calls=4 tris=2121
  npcFamily:Farmer             calls=3 tris=3909
  npcFamily:Knight_Cloth       calls=3 tris=3575
  npcFamily:Peasant            calls=5 tris=5641
  npcFamily:Peasant_Boots      calls=1 tris=964
  npcFamily:Ranger_NoHood      calls=1 tris=1199
  npcFamily:woodcutter         calls=1 tris=854
  other                        calls=49 tris=10914
  settlement:decor             calls=97 tris=189309
  settlement:fireHouseInteriorLamp calls=3 tris=341
  settlement:houseInteractive  calls=6 tris=1002
  settlement:houseStatic       calls=20 tris=27201
  settlement:landmarkGarden    calls=1 tris=867
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1096
  settlement:other             calls=4 tris=74
  settlement:storageContainer  calls=4 tris=1278
  settlement:storageHay        calls=1 tris=265
  settlement:storageTrough     calls=1 tris=823
  settlement:storageWoodHousehold calls=1 tris=3219
  settlement:storageWoodSettlementPrimary calls=1 tris=423
  settlement:workplace         calls=2 tris=1877
  terrain                      calls=19 tris=1364327
  vegetation                   calls=55 tris=610542

Main:
  calls avg: 544  tris avg: 8556402
  info calls avg: 690  residual calls avg: 0
  switches avg: material=256.4 program=117.6  actor: calls=88.5 material=64.3 program=31.5
  skinning avg: skinned calls=91 skeletons first used=20.2
  environment                  calls=48 tris=13245
  faunaFamily:bear             calls=1 tris=617
  faunaFamily:chicken          calls=6 tris=825
  faunaFamily:cow              calls=0 tris=169
  faunaFamily:dog              calls=12 tris=3952
  faunaFamily:horse            calls=0 tris=107
  faunaFamily:rabbit           calls=0 tris=31
  faunaFamily:rat              calls=1 tris=2681
  faunaFamily:rooster          calls=0 tris=119
  faunaFamily:sheep            calls=5 tris=1457
  faunaFamily:wolf             calls=1 tris=385
  grass                        calls=36 tris=5248750
  items                        calls=48 tris=5443
  npcFamily:Farmer             calls=8 tris=11814
  npcFamily:Knight_Cloth       calls=5 tris=6895
  npcFamily:Peasant            calls=37 tris=44883
  npcFamily:Peasant_Boots      calls=6 tris=7719
  npcFamily:Ranger_NoHood      calls=0 tris=67
  npcFamily:blacksmith         calls=6 tris=9087
  other                        calls=80 tris=14444
  settlement:decor             calls=8 tris=19953
  settlement:fence             calls=3 tris=4353
  settlement:fireCampfire      calls=5 tris=362
  settlement:fireHouseExteriorLamp calls=11 tris=505
  settlement:fireHouseInteriorLamp calls=4 tris=381
  settlement:fireVillageTorch  calls=14 tris=1021
  settlement:houseInteractive  calls=11 tris=1165
  settlement:houseStatic       calls=22 tris=21617
  settlement:landmarkGarden    calls=5 tris=49278
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1434
  settlement:landmarkWellHousehold calls=4 tris=4315
  settlement:landmarkWellPasture calls=3 tris=1181
  settlement:other             calls=7 tris=131
  settlement:storageBarrel     calls=5 tris=8809
  settlement:storageContainer  calls=8 tris=1677
  settlement:storageGoods      calls=28 tris=5725
  settlement:storageHay        calls=1 tris=376
  settlement:storageTrough     calls=3 tris=1098
  settlement:storageWoodHousehold calls=1 tris=3780
  settlement:storageWoodSettlementPrimary calls=1 tris=591
  settlement:workplace         calls=6 tris=2761
  terrain                      calls=24 tris=1737230
  vegetation                   calls=57 tris=832152
  water                        calls=7 tris=484136


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

[LONG FRAME] 277.5ms
simulate        45.3ms
render         231.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          220.3ms
STREAMING       39.6ms
NPC              1.7ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER          10.9ms
OTHER            3.8ms

streaming / stages:
  chunkUpdate                  39.6ms
  riverTileBuild               37.2ms
  terrainPrepare               1.0ms
  riverChannelSegmentsNear     0.4ms

Long frame #2:

[LONG FRAME] 240.1ms
simulate         8.0ms
render         230.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          216.4ms
STREAMING        0.0ms
NPC              2.0ms
FAUNA            4.3ms
PHYSICS          0.2ms
RENDER          14.5ms
OTHER            2.7ms

Long frame #3:

[LONG FRAME] 223.6ms
simulate         6.9ms
render         215.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        1.2ms
NPC              1.6ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         215.6ms
OTHER            4.2ms

streaming / stages:
  contentFinalize              1.2ms
  chunkFinalize                1.2ms
  chunkUpdate                  1.2ms

Long frame #4:

[LONG FRAME] 208.1ms
simulate         3.7ms
render         202.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          189.9ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER          12.9ms
OTHER            2.5ms

Long frame #5:

[LONG FRAME] 105.1ms
simulate        97.0ms
render           7.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            1.9ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA           94.0ms
PHYSICS          0.1ms
RENDER           6.0ms
OTHER            1.4ms

---

[Seedvale Program Census]

Programs created: 131
Program count: final=131 max=131

By frame:
  frame 0   +74 programs   <== largest transition
  frame 49   +1 program
  frame 412   +1 program
  frame 439   +1 program
  frame 447   +2 programs
  frame 526   +1 program
  frame 531   +2 programs
  frame 541   +1 program
  frame 617   +1 program
  frame 646   +1 program
  frame 944   +1 program
  frame 2160   +19 programs
  frame 2207   +4 programs
  frame 2444   +22 programs

Largest transition — frame 0 (+74 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d7ff2e3a-d4a8-4669-acdb-e1f2de074e3d (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=155952dd-2914-41f9-ad77-cd9e5b98c38e
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=2df0b247-6fe3-4c98-93f4-aa59e4a88a09
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f57978c5-a8bb-4a6a-92b0-41909b7a21f2
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bced99da-566e-4ea6-be64-81aa3392c10f
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=53a08d24-12d4-4b0a-b8ac-66cdd214e7cb
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5d6b52e7-4f95-4c50-9e4a-c11951f13771
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=52936992-c530-4d91-9faa-307b3006544c
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=62a0450e-940d-4a10-9663-0acbcc4f5d68
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4d7dadc5-917c-4a76-9daf-77f8577f4123 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=48a556ee-cf84-4f63-83c4-9e99197d0f9f
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2182f4f9-02c3-4809-b1cc-44f35b6c226a (Flowers)
  #14 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=29f2f44a-44b6-45e5-b1f7-f9c70f2b7b3f (Green)
  #15 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3e1c8c4d-32aa-48b9-8a01-5682d1f680af (Pink)
  #16 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e7afcaff-9eb7-409d-83c0-f069648e651c (None)
  #17 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=20c87a91-9d04-49bb-800b-b5182f60920c (Stone)
  #18 type=MeshStandardMaterial name='Wood_Light' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5999c135-abbe-456c-b051-0763638b4b8c (Material.001)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=22c7f4d3-868f-4c75-8694-02f3e1e582c0 (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=83e96592-786c-424d-bcc5-356dc368cadf (MI_WindowGlass)
  #22 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=6e2fe4ac-a901-434f-9e62-b10b8b945b0f
  #23 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=ebab7d65-44da-44a5-bf4a-ce554bd0ab11 (MI_WoodTrim)
  #24 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #25 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6c184b3c-e873-4980-ab72-0a0b1309147e (MI_WindowGlass)
  #26 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #27 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #28 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=529ea4bf-8be3-451d-85c6-6007888c4c33 (Main)
  #29 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=33322484-90ca-4713-bf36-39918dc41c36 (lambert2SG)
  #30 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=acd0e2bf-edaa-4150-8ba4-57863290909f (Material #55)
  #31 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=291899b5-474e-494a-8087-9471d2a045e3 (MapleTree_Leaves)
  #32 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2671e935-9737-45d3-875e-fc307d3679f1 (Green)
  #33 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=c0fce520-b6cb-446b-9d6f-7aab606e5fa4 (MapleTree_Bark)
  #34 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=852b1c3f-ea58-4245-82c9-9ed3dbba712f (Main)
  #35 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f49b3d08-a9dc-400c-a035-57f2e0c10571 (MI_Peasant)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=16daa265-bc75-4c01-907b-6b8e9613566b (MI_Hair_1)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6ff26c16-be27-456e-888e-3b205368b594 (MI_Hair_1)
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0092843c-6d71-4497-933c-d15ad99b047e (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=fa108f9e-951f-42d9-89d3-9eb995d2ee88
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=d785e73b-6a29-45f8-9879-9de0ed846431 (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fa619d77-425f-45ba-b84c-6e3a352275e3 (DarkGreen)
  #51 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=022fd8d8-b837-4e9a-8793-583c6dadbbc5 (MI_Regular_Male)
  #52 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9f20fa28-63a5-464f-8e1b-9936bf2a54ba (MI_Eyes)
  #53 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2820f2ae-a517-496f-a35f-f3cc68e1942e (MI_Knight)
  #54 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5e13e6b5-a1ae-450d-b5ff-48c5a8534907 (PathRocks)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0b77d87f-9a6f-4597-a339-159202b0ac44 (MI_Hair_1)
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
  #72 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #73 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #26=df7c703d, #27=f92c8d8c, #56=279cec18, #57=84736a68, #58=aa2edbee, #59=7bae0bb2, #60=436caea4, #61=886438e7, #62=d99a5b29, #63=2003ced8, #64=28dfa407, #65=756a0b19, #66=b2354ff2, #67=ea82969e, #68=7dab8d9a, #69=378e1fb7, #70=78acf7ea, #71=a312c579, #72=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #26=236b3b0b, #27=87d053eb, #56=4d6bcede, #57=ffecb62a, #58=76ced00a, #59=fb55b3c0, #60=2d687ef1, #61=dc2a89b5, #62=109e33fc, #63=db0f470a, #64=9775cd0e, #65=5c741650, #66=2aad9943, #67=a2297d9f, #68=1022767b, #69=ce0bf6b4, #70=707f290c, #71=c05e2256, #72=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #26=(unset), #27=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #26=(unknown), #27=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=c0d790d1, #15=d3fd7a87, #16=6db98a06, #17=a9733c9d, #18=f3a1039e, #19=c5e73b05, #20=13a74ec7, #21=9dcf1cb4, #22=66d360c8, #23=12873951, #24=fc941d05, #25=e551c572, #28=54e03756, #29=7bb77142, #31=d9d07622, #32=190d3a9c, #33=9dbe8ee7, #34=fd8301ed, #35=842fe1df, #36=ac268392, #37=1c179521, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=20daccfa, #52=1dcbc6ff, #53=1d0412b3, #54=b643916d, #55=cde317ee
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=a81023c3, #15=2eae9a54, #16=efed8e98, #17=bd723c8a, #18=c7daf23, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #22=c0b8fc9f, #23=d4c95125, #24=3ab4c629, #25=2d1aa4a, #28=d391c52, #29=87728b15, #31=135696d3, #32=633146b4, #33=8dba9dd, #34=2f2885d5, #35=34995f15, #36=25a41317, #37=71f22dc6, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=a8862f4a, #52=1a1c0d8, #53=512afd6f, #54=754b87bd, #55=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=environment, #18=fauna, #19=settlement, #20=(unknown), #21=settlement, #22=settlement, #23=settlement, #24=(unknown), #25=settlement, #28=fauna, #29=fauna, #31=settlement, #32=settlement, #33=settlement, #34=fauna, #35=other, #36=other, #37=other, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=npc, #54=settlement, #55=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=(unset), #21=, #22=, #23=, #24=(unset), #25=, #28=, #29=, #31=, #32=, #33=, #34=, #35=, #36=, #37=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=(unknown), #21=0, #22=0, #23=0, #24=(unknown), #25=0, #28=0, #29=0, #31=0.45, #32=0, #33=0, #34=0, #35=0, #36=0, #37=0, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=false, #24=(unknown), #25=false, #28=false, #29=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=true, #23=false, #24=(unknown), #25=false, #28=false, #29=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=(unknown), #21=true, #22=true, #23=true, #24=(unknown), #25=true, #28=true, #29=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #37=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=false, #15=false, #16=true, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=false, #23=true, #24=(unknown), #25=false, #28=false, #29=true, #31=true, #32=false, #33=true, #34=false, #35=true, #36=true, #37=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=false, #23=true, #24=(unknown), #25=false, #28=false, #29=false, #31=false, #32=false, #33=true, #34=false, #35=false, #36=false, #37=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=true, #22=false, #23=false, #24=(unknown), #25=true, #28=false, #29=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=false, #24=(unknown), #25=false, #28=false, #29=false, #31=false, #32=false, #33=false, #34=false, #35=true, #36=true, #37=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=false, #54=false, #55=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=false, #24=(unknown), #25=false, #28=false, #29=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #37=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
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
    vertexShaderHash differs: #38=59ed5d71, #39=b69ba143, #40=2e7a6fcb, #41=c203b19a, #42=c203b19a, #43=585a1ea4, #44=263c45d6, #45=2efa42a8, #46=e4717b03
    fragmentShaderHash differs: #38=d729897e, #39=d729897e, #40=758a4164, #41=41e40a66, #42=a9dd0dee, #43=a9dd0dee, #44=d729897e, #45=41e40a66, #46=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2160 (+19):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: 2df0b247-6fe3-4c98-93f4-aa59e4a88a09
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: 2578bad0-928b-4887-aaa9-3ac40c972f03
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 6862e743-52ea-40ff-8eed-f48844eba25f
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
    materialUuid: 56d202e6-242c-42ec-b30b-0c52d5b6bcb6
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
    materialUuid: 57d1db95-98d2-4af5-9ae0-73ab73cf2809
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: c0fce520-b6cb-446b-9d6f-7aab606e5fa4
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 2182f4f9-02c3-4809-b1cc-44f35b6c226a
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
    materialUuid: db444d39-1935-4a13-a8a9-f387da6994f7
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 3f119004-da18-47ed-bf83-6748b169bccc
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
    materialUuid: 0092843c-6d71-4497-933c-d15ad99b047e
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #96
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: ebab7d65-44da-44a5-bf4a-ce554bd0ab11
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #97
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 022fd8d8-b837-4e9a-8793-583c6dadbbc5
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #98
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 9f20fa28-63a5-464f-8e1b-9936bf2a54ba
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #99
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: f49b3d08-a9dc-400c-a035-57f2e0c10571
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 16daa265-bc75-4c01-907b-6b8e9613566b
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6ff26c16-be27-456e-888e-3b205368b594
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #102
    material: MeshStandardMaterial ''
    materialUuid: 6f4dcb8c-a8ed-43c1-b5be-3cfc63df3f0e
    object: Mesh 'settlement-house-chests-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d7607dd2
    fragmentShaderHash: 83e94369
  Program #103
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #104
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: 6c184b3c-e873-4980-ab72-0a0b1309147e
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2444 (+22):
  Program #109
    material: ShaderMaterial 'SkyShader'
    materialUuid: d7ff2e3a-d4a8-4669-acdb-e1f2de074e3d
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #110
    material: ShaderMaterial ''
    materialUuid: 5d6b52e7-4f95-4c50-9e4a-c11951f13771
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #111
    material: MeshStandardMaterial ''
    materialUuid: 2df0b247-6fe3-4c98-93f4-aa59e4a88a09
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #112
    material: MeshStandardMaterial 'Wood'
    materialUuid: 2578bad0-928b-4887-aaa9-3ac40c972f03
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #113
    material: MeshStandardMaterial 'Green'
    materialUuid: 6862e743-52ea-40ff-8eed-f48844eba25f
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
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: 56d202e6-242c-42ec-b30b-0c52d5b6bcb6
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
  Program #115
    material: MeshStandardMaterial 'Berry'
    materialUuid: 57d1db95-98d2-4af5-9ae0-73ab73cf2809
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #116
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: c0fce520-b6cb-446b-9d6f-7aab606e5fa4
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #117
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 2182f4f9-02c3-4809-b1cc-44f35b6c226a
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
  Program #118
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: db444d39-1935-4a13-a8a9-f387da6994f7
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #119
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 3f119004-da18-47ed-bf83-6748b169bccc
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
  Program #120
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 0092843c-6d71-4497-933c-d15ad99b047e
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #121
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 022fd8d8-b837-4e9a-8793-583c6dadbbc5
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #122
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 9f20fa28-63a5-464f-8e1b-9936bf2a54ba
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #123
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: f49b3d08-a9dc-400c-a035-57f2e0c10571
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 16daa265-bc75-4c01-907b-6b8e9613566b
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6ff26c16-be27-456e-888e-3b205368b594
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #126
    material: ShaderMaterial ''
    materialUuid: 53a08d24-12d4-4b0a-b8ac-66cdd214e7cb
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #127
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #128
    material: MeshBasicMaterial ''
    materialUuid: 62a0450e-940d-4a10-9663-0acbcc4f5d68
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #129
    material: ShaderMaterial ''
    materialUuid: 1f96b2a5-585d-4c69-aaa9-75d3078dd1d5
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #130
    material: ShaderMaterial ''
    materialUuid: 2e666b06-bf6b-4bb1-a33d-06b22e515c20
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
Excluded — no reliable per-program timing: 123 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 49
  #74
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 16.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 412
  #75
      material: MeshStandardMaterial 'Pond_Pack_MAT'
      object: Mesh 'Branch_2b'
      asset: /models/items/branch.glb
      compile/link: 188.0 ms  (upper bound — whole mirror-render call, see note above)

Frame 439
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 28.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 526
  #79
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 219.0 ms  (upper bound — whole mirror-render call, see note above)

Frame 541
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 212.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 617
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 13.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 646
  #84
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 15.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 944
  #85
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 214.9 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 907.4 ms
  programs >1 ms: 8
  max: 219.0 ms (#79)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.3 ms  p95=8.2 ms  max=8.8 ms  Δavg vs baseline=—
  hide-grass           avg=5.4 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=-0.8 ms (-13%)
  hide-vegetation      avg=4.7 ms  p95=5.3 ms  max=5.8 ms  Δavg vs baseline=-1.6 ms (-25%)
  no vegetation/grass  avg=4.3 ms  p95=4.9 ms  max=6.1 ms  Δavg vs baseline=-1.9 ms (-31%)
  hide-environment     avg=5.4 ms  p95=6.5 ms  max=6.9 ms  Δavg vs baseline=-0.9 ms (-15%)
  hide-settlement      avg=4.8 ms  p95=5.8 ms  max=6.3 ms  Δavg vs baseline=-1.4 ms (-23%)
  no water             avg=5.6 ms  p95=6.7 ms  max=7.0 ms  Δavg vs baseline=-0.7 ms (-11%)
  hide-terrain         avg=5.2 ms  p95=6.4 ms  max=6.8 ms  Δavg vs baseline=-1.0 ms (-16%)
  hide-npc-fauna       avg=4.5 ms  p95=5.5 ms  max=5.8 ms  Δavg vs baseline=-1.8 ms (-29%)
  no-shadows           avg=5.5 ms  p95=6.4 ms  max=7.1 ms  Δavg vs baseline=-0.8 ms (-13%)
  no-ao                avg=5.1 ms  p95=6.6 ms  max=7.1 ms  Δavg vs baseline=-1.1 ms (-18%)
  no-bloom             avg=5.8 ms  p95=8.2 ms  max=9.2 ms  Δavg vs baseline=-0.4 ms (-7%)
  no-smaa              avg=5.3 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=-0.9 ms (-15%)
  no-god-rays          avg=6.2 ms  p95=8.2 ms  max=12.9 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-film-grade        avg=5.5 ms  p95=7.1 ms  max=10.6 ms  Δavg vs baseline=-0.8 ms (-12%)
  no postprocessing    avg=7.3 ms  p95=10.9 ms  max=12.2 ms  Δavg vs baseline=+1.0 ms (+17%)
  no mirrors           avg=6.6 ms  p95=7.9 ms  max=9.7 ms  Δavg vs baseline=+0.4 ms (+6%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=14.0 ms  p95=15.7 ms  max=15.9 ms
  CPU wall      avg=6.3 ms  p95=8.2 ms  max=8.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
