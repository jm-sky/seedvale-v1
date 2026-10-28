# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:45:54.648Z
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
Frames: 1434
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d7ddb33720d54ece4e216ee27ed1e7ffa968a234
  runId: 2026-10-28T22-45-09-972Z-i3y02l
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
  populationGate: stable waited=5036ms npc=20
  gpuTimer: available=true resolved=true samples=1444 span=postprocess+labels

FPS:
  avg: 63.2
  min: 10
  p1: 17

Frame time (wall-clock):
  avg: 15.8 ms
  p50: 14.3 ms
  p95: 26 ms
  p99: 60.6 ms
  max: 95.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.4 p95=7.9 p99=48.2 max=77.6 n=1434
  render: p50=10.3 p95=18 p99=22.9 max=58.6 n=1434
  frame: p50=14.3 p95=26 p99=60.6 max=95.4 n=1434

Rendering (combined renderer.info):
  draw calls: 885 avg / 2027 max
  triangles: 10.83M avg
  mirror draws: 158 avg
  geometries: 758
  textures: 634

Pass submissions (actual):
  reliability: observed
  frames: 1445 shadowRefresh=658 shadowSkipped=787
  mirror calls avg: 157
  shadow calls avg: 303
  main calls avg: 573

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
  other            draws=217 tris=25.7k meshes=217 inst=217

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=183 tris=1.27M meshes=183 inst=813
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=98 tris=14.5k meshes=98 inst=98

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
      horse            agents=1 draws=8 tris=2.2k skinned=8/8
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      far  agents=51 camera-relevant=0 draws=197 tris=86.4k

Systems:
  WATER          2.0 ms
  STREAMING      0.6 ms
  NPC            1.3 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         8.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  FAUNA: 2
  WATER: 1
  RENDER: 1

Hitches (>= 8 ms): total=1
  chunk water            n=1 avg=9.3 max=9.3

Isolation probes:
  full               render=6.4 ms draws=295 tris=6.13M
  hide-grass         render=5.5 ms draws=268 tris=5.07M
  hide-vegetation    render=4.9 ms draws=162 tris=4.37M
  hide-vegetation-grass render=4.7 ms draws=135 tris=3.34M
  hide-environment   render=5.8 ms draws=271 tris=6.07M
  hide-settlement    render=5.3 ms draws=275 tris=6.11M
  hide-water         render=5.7 ms draws=287 tris=5.25M
  hide-terrain       render=5.4 ms draws=269 tris=3.90M
  hide-npc-fauna     render=5.2 ms draws=296 tris=6.15M
  no-shadows         render=5.5 ms draws=286 tris=5.90M
  no-ao              render=5.5 ms draws=295 tris=6.21M
  no-bloom           render=5.6 ms draws=288 tris=6.21M
  no-smaa            render=5.9 ms draws=298 tris=6.21M
  no-god-rays        render=5.6 ms draws=292 tris=6.07M
  no-film-grade      render=5.6 ms draws=296 tris=6.15M
  no-postprocessing  render=5.6 ms draws=278 tris=6.21M
  no-reflections     render=5.8 ms draws=227 tris=5.14M

Frame attribution:
  frame max: 95.4 ms
  largest labelled hitch: 9.3 ms
  unattributed: 86.1 ms

Long frames:
  threshold: 80 ms
  count: 5
  worst: 95.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1434/1434

Recommendation:
Largest frame (95.4 ms) is not explained by labelled hitches (largest 9.3 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (10.1 ms cumulative)
  agent updates: 0.8 ms/frame (1076.3 ms cumulative)
  livestock: 0.2 ms/frame (345.5 ms cumulative)
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
    update calls/frame: 14.9
    unique animals/frame: 14.6
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.0
    dog guard scans: 3.0/frame (23.9 predator candidates/frame)
    pest scans: 0.8/frame (0.8 rat candidates/frame)
    nearest scans: 3.9/frame (0.0 candidates/frame)
    water samples: 7.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 7.1/frame, 0.00 ms/frame (worst call 0.20 ms, 488.8 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 14.8
    behaviour executions/frame: 3.9
    presentation executions/frame: 3.3
  rats: 0.1 ms/frame (109.4 ms cumulative)
  social: 0.0 ms/frame (4.5 ms cumulative)
  streaming: 0.1 ms/frame (116.0 ms cumulative)
  maintenance: 0.1 ms/frame (138.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.3 ms/frame (1920.4 ms cumulative)
  forest sampling: 0.1 ms/frame (110.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.8 ms cumulative)
    targeting: 0.0 ms/frame (19.9 ms cumulative)
    decision: 0.0 ms/frame (19.2 ms cumulative)
    behaviour: 0.9 ms/frame (1260.1 ms cumulative)
    life/presentation: 0.3 ms/frame (374.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.2
    expensive behaviour agents/frame: 13.4
    full-rate agents/frame: 7.1
    reduced-cadence agents/frame: 22.6
    behaviour executions/frame: 13.6
    presentation executions/frame: 12.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.6
    village scan candidates/frame: 280.9
    player perception checks/frame: 29.7

  nearest scans: 18.9/frame (27171 calls)
  nearest candidates checked: 113.0/frame (162056 total)
  herd leader scans: 0.1/frame (171 calls)
  herd candidates checked: 3.6/frame (5130 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 17.0/frame (107.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 52.9/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 52.9/frame, 0.00 ms/frame (worst call 0.10 ms, 2030.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.25 ms
    max 1.80 ms

  allocation/setup:
    avg 0.20 ms
    max 1.80 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.01 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.40 ms
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
    allocation/setup avg/max: 0.17 / 1.80 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 19/19
    instances: 1884833 (max 184184)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

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
Lifecycle: req=35 complete=31 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=26 invalidate=0
Finalization: observed completions=31

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1445
Shadow refresh frames: 658
Shadow skipped frames: 787

Mirror:
  calls avg: 157  tris avg: 881628
  info calls avg: 157  residual calls avg: 0
  environment                  calls=4 tris=3838
  items                        calls=1 tris=519
  other                        calls=34 tris=4880
  settlement:decor             calls=8 tris=20359
  settlement:fence             calls=1 tris=2229
  settlement:fireCampfire      calls=2 tris=192
  settlement:fireHouseExteriorLamp calls=5 tris=249
  settlement:fireHouseInteriorLamp calls=2 tris=187
  settlement:fireVillageTorch  calls=7 tris=516
  settlement:houseInteractive  calls=5 tris=572
  settlement:houseStatic       calls=12 tris=10931
  settlement:landmarkGarden    calls=2 tris=23913
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=698
  settlement:landmarkWellHousehold calls=2 tris=2199
  settlement:landmarkWellPasture calls=2 tris=611
  settlement:other             calls=4 tris=67
  settlement:storageBarrel     calls=3 tris=4085
  settlement:storageContainer  calls=10 tris=749
  settlement:storageGoods      calls=14 tris=2790
  settlement:storageHay        calls=0 tris=185
  settlement:storageTrough     calls=2 tris=499
  settlement:storageWoodHousehold calls=1 tris=1694
  settlement:storageWoodSettlementPrimary calls=0 tris=304
  settlement:workplace         calls=3 tris=1388
  terrain                      calls=6 tris=411145
  vegetation                   calls=23 tris=386985

Shadow (refresh only):
  calls avg: 303  tris avg: 2255253
  info calls avg: 303  residual calls avg: 0
  environment                  calls=10 tris=5405
  faunaFamily:cow              calls=2 tris=752
  faunaFamily:duck             calls=1 tris=39
  faunaFamily:fox              calls=1 tris=587
  faunaFamily:horse            calls=2 tris=428
  faunaFamily:rabbit           calls=1 tris=741
  faunaFamily:rat              calls=1 tris=1034
  faunaFamily:sheep            calls=0 tris=70
  faunaFamily:stag             calls=6 tris=3508
  faunaFamily:wolf             calls=2 tris=748
  items                        calls=4 tris=2135
  npcFamily:Knight_Cloth       calls=3 tris=3837
  npcFamily:Peasant            calls=3 tris=3453
  npcFamily:Peasant_Boots      calls=1 tris=1076
  npcFamily:woodcutter         calls=1 tris=953
  other                        calls=51 tris=11264
  settlement:decor             calls=104 tris=209333
  settlement:fireHouseInteriorLamp calls=1 tris=125
  settlement:houseInteractive  calls=2 tris=373
  settlement:houseStatic       calls=15 tris=6969
  settlement:landmarkGarden    calls=1 tris=473
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1110
  settlement:other             calls=4 tris=77
  settlement:storageContainer  calls=5 tris=530
  settlement:storageHay        calls=1 tris=274
  settlement:storageTrough     calls=1 tris=284
  settlement:storageWoodHousehold calls=1 tris=1114
  settlement:storageWoodSettlementPrimary calls=1 tris=439
  settlement:workplace         calls=2 tris=2079
  terrain                      calls=18 tris=1363580
  vegetation                   calls=54 tris=632442

Main:
  calls avg: 573  tris avg: 8883789
  info calls avg: 724  residual calls avg: 0
  environment                  calls=51 tris=13370
  faunaFamily:bear             calls=1 tris=653
  faunaFamily:chicken          calls=6 tris=795
  faunaFamily:cow              calls=1 tris=180
  faunaFamily:deer             calls=0 tris=8
  faunaFamily:dog              calls=11 tris=3831
  faunaFamily:horse            calls=0 tris=2
  faunaFamily:rat              calls=2 tris=3148
  faunaFamily:sheep            calls=4 tris=1257
  faunaFamily:wolf             calls=1 tris=734
  grass                        calls=38 tris=5602340
  items                        calls=47 tris=5395
  npcFamily:Farmer             calls=8 tris=11175
  npcFamily:Knight_Cloth       calls=6 tris=7754
  npcFamily:Peasant            calls=36 tris=44438
  npcFamily:Peasant_Boots      calls=6 tris=8069
  npcFamily:blacksmith         calls=7 tris=9498
  other                        calls=87 tris=14691
  settlement:decor             calls=14 tris=36189
  settlement:fence             calls=3 tris=4507
  settlement:fireCampfire      calls=5 tris=381
  settlement:fireHouseExteriorLamp calls=10 tris=504
  settlement:fireHouseInteriorLamp calls=4 tris=380
  settlement:fireVillageTorch  calls=15 tris=1045
  settlement:houseInteractive  calls=11 tris=1163
  settlement:houseStatic       calls=22 tris=20118
  settlement:landmarkGarden    calls=5 tris=47276
  settlement:landmarkNoticeBoard calls=2 tris=29
  settlement:landmarkWellCentral calls=4 tris=1462
  settlement:landmarkWellHousehold calls=4 tris=4421
  settlement:landmarkWellPasture calls=3 tris=1235
  settlement:other             calls=7 tris=134
  settlement:storageBarrel     calls=5 tris=8247
  settlement:storageContainer  calls=21 tris=1516
  settlement:storageGoods      calls=28 tris=5697
  settlement:storageHay        calls=1 tris=365
  settlement:storageTrough     calls=3 tris=1013
  settlement:storageWoodHousehold calls=1 tris=3440
  settlement:storageWoodSettlementPrimary calls=1 tris=603
  settlement:workplace         calls=6 tris=2853
  terrain                      calls=24 tris=1743453
  vegetation                   calls=56 tris=808780
  water                        calls=7 tris=461989


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 5
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 5 total):

[LONG FRAME] 95.4ms
simulate        77.6ms
render          17.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.6ms
STREAMING        0.1ms
NPC              1.6ms
FAUNA           74.5ms
PHYSICS          0.1ms
RENDER          11.9ms
OTHER            1.6ms

streaming / stages:
  chunkUpdate                  0.1ms

Long frame #2:

[LONG FRAME] 81.5ms
simulate        56.0ms
render          24.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       50.6ms
NPC              1.5ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER          24.7ms
OTHER            3.8ms

streaming / stages:
  chunkUpdate                  50.6ms
  riverTileBuild               46.6ms
  terrainPrepare               1.0ms
  riverChannelSegmentsNear     0.3ms

Long frame #3:

[LONG FRAME] 81.5ms
simulate        73.6ms
render           7.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING       67.2ms
NPC              0.7ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER           7.6ms
OTHER            5.2ms

streaming / stages:
  chunkUpdate                  67.2ms
  riverTileBuild               60.0ms
  terrainPrepare               1.5ms
  riverChannelSegmentsNear     0.4ms

Long frame #4:

[LONG FRAME] 80.8ms
simulate        66.9ms
render          13.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.9ms
STREAMING        0.0ms
NPC             62.4ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER           9.9ms
OTHER            3.7ms

streaming / stages:
  riverTileBuild               50.2ms
  terrainPrepare               5.7ms
  riverChannelSegmentsNear     0.3ms

Long frame #5:

[LONG FRAME] 80ms
simulate        62.1ms
render          17.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.9ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA           58.8ms
PHYSICS          0.1ms
RENDER          11.8ms
OTHER            1.8ms

---

[Seedvale Program Census]

Programs created: 127
Program count: final=126 max=126

By frame:
  frame 0   +72 programs   <== largest transition
  frame 6   +2 programs
  frame 29   +2 programs
  frame 39   +1 program
  frame 470   +1 program
  frame 531   +1 program
  frame 544   +1 program
  frame 1009   +1 program
  frame 1129   +1 program
  frame 2209   +18 programs
  frame 2256   +5 programs
  frame 2491   +22 programs

Largest transition — frame 0 (+72 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=55389c63-6482-4c57-9009-aaa6b17e7a6b (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4765a101-1cf5-4f28-a6c9-b0f24f7b1ddc
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=b2077994-69a3-4e17-9d05-7e5a21f6dc77
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e8749155-608b-4767-899c-6a8cb88d52d6
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e5e4f94a-bfdf-43aa-a828-09e889b5e11d
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e86f531d-9188-42cc-813c-bb9af5780a43
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=13768dd7-25a0-47c7-b4e7-aef9491a8e21
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=6613cd6f-5906-4232-a98b-a46683d036e1
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=079a0df9-9170-4d37-ae98-b63af72ecc3b
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ecfe8f47-0ea8-4e52-ad0f-5090c738a156 (Wood)
  #10 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f5454e01-0b22-40aa-8ac5-1fa2565539f6 (None)
  #11 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=805ba017-8086-41a0-a5c0-c045cd34bfd7 (Flowers)
  #12 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b9146b25-4e9c-4562-b83f-29a07c6b9356 (Green)
  #13 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4d1416da-1042-4d1f-b5d9-5d8cd21b8c35 (Stone)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=29ebc7d0-d765-4830-8e96-71ebcc6e779e (Pink)
  #15 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=15c39f73-d19a-4e9f-b420-dee06d166eda (Wood)
  #16 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=cb3dc37f-8791-41d1-8850-b967843e0b52 (MI_WoodTrim)
  #17 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #18 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=08857916-91bf-48c8-8dcf-652d70d26320 (MI_WindowGlass)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=f145e6b6-4bd3-41e2-98f5-ef020d048482 (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5aeef5e9-c1cc-4cc8-a6fa-8bb02274ad05 (MI_WindowGlass)
  #22 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #23 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #24 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d61252d4-7fce-4c60-957e-6ae8bb76dd47 (Main)
  #25 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=def44f46-d963-422f-a0dd-709a21abc646 (Handle)
  #26 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=57df35ec-406a-41a4-ac6d-b154967ea84e (PathRocks)
  #27 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9dbe1e52-ae45-4e87-8792-6c06cdc59996 (MapleTree_Leaves)
  #28 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0b262ee2-ee52-4ddf-a47a-31f51a707aad (Green)
  #29 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=a311dbc4-9b07-4a3c-ba97-7e22a688e3af (MapleTree_Bark)
  #30 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=23851c84-9d9c-4947-bdd1-2b610b49ef48 (MI_Knight)
  #31 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=600daac6-49ec-4107-8f23-9d8f4cc0eac2 (MI_Knight)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=28c8f14d-436a-4dcd-99c3-50e703bf9163 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ce0e2249-9583-4563-840d-2d03d81c4bee (MI_Hair_1)
  #34 type=MeshStandardMaterial name='SV_Male_Woodcutter_Palette' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c3c87c97 fHash=ee809a5f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1bb04c96-3bce-4489-92b2-390955e53f65 (SV_Male_Woodcutter_Palette)
  #35 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #36 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=dbc37aa5-7b4a-4db2-ba63-71ff518d6e0e (MI_Peasant)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a140aa15-4c71-46c0-b802-38d7828e8abf (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bdeaa70a-b200-460c-8da1-b6bc02bc2809 (MI_Hair_1)
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
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=bc2d5094 fHash=758a4164 stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c6dd5f29 fHash=ddb1b5d4 stage=postprocess-render
  #51 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=129c0957-2d5f-4aaf-a109-8b6c1634a554 (stockpiles_vc)
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=880450a2-e645-46b5-a8a7-b56cad9643cb
  #53 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=72904db3 fHash=bc151936 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3cca7ae5-a259-4d8f-9441-a98bd460774a (BlackBear_mat)
  #54 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #55 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #56 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #70 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #71 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #22=df7c703d, #23=f92c8d8c, #35=5b43c776, #54=279cec18, #55=84736a68, #56=aa2edbee, #57=7bae0bb2, #58=436caea4, #59=886438e7, #60=d99a5b29, #61=2003ced8, #62=28dfa407, #63=756a0b19, #64=b2354ff2, #65=ea82969e, #66=7dab8d9a, #67=378e1fb7, #68=78acf7ea, #69=a312c579, #70=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #22=236b3b0b, #23=87d053eb, #35=70b71dad, #54=4d6bcede, #55=ffecb62a, #56=76ced00a, #57=fb55b3c0, #58=2d687ef1, #59=dc2a89b5, #60=109e33fc, #61=db0f470a, #62=9775cd0e, #63=5c741650, #64=2aad9943, #65=a2297d9f, #66=1022767b, #67=ce0bf6b4, #68=707f290c, #69=c05e2256, #70=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #22=(unset), #23=(unset), #35=(unset), #54=(unset), #55=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #22=(unknown), #23=(unknown), #35=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown)
  MeshStandardMaterial (32 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #10=6db98a06, #11=e4cbf8ca, #12=c0d790d1, #13=a9733c9d, #14=d3fd7a87, #15=f3a1039e, #16=c5e73b05, #17=13a74ec7, #18=9dcf1cb4, #19=12873951, #20=fc941d05, #21=e551c572, #24=fd8301ed, #25=88cdd138, #26=b643916d, #27=d9d07622, #28=190d3a9c, #29=9dbe8ee7, #30=140c5e62, #31=eb2eade3, #32=c8a982c1, #33=ee59055a, #34=c3c87c97, #36=842fe1df, #37=ac268392, #38=1c179521, #51=a64d124e, #52=94297e69, #53=72904db3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #10=efed8e98, #11=135696d3, #12=a81023c3, #13=bd723c8a, #14=2eae9a54, #15=c7daf23, #16=d4c95125, #17=3ab4c629, #18=2d1aa4a, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #24=2f2885d5, #25=f2ad9521, #26=754b87bd, #27=135696d3, #28=633146b4, #29=8dba9dd, #30=46d4b31c, #31=6eafecb9, #32=8ab73626, #33=e8d88acf, #34=ee809a5f, #36=34995f15, #37=25a41317, #38=71f22dc6, #51=546e469, #52=aa0735a8, #53=bc151936
    bucket differs: #2=terrain, #7=other, #9=other, #10=environment, #11=vegetation, #12=vegetation, #13=environment, #14=vegetation, #15=settlement, #16=settlement, #17=(unknown), #18=settlement, #19=settlement, #20=(unknown), #21=settlement, #24=fauna, #25=settlement, #26=settlement, #27=settlement, #28=settlement, #29=settlement, #30=npc, #31=npc, #32=npc, #33=npc, #34=npc, #36=other, #37=other, #38=other, #51=settlement, #52=other, #53=fauna
    define STANDARD differs: #2=, #7=, #9=, #10=, #11=, #12=, #13=, #14=, #15=, #16=, #17=(unset), #18=, #19=, #20=(unset), #21=, #24=, #25=, #26=, #27=, #28=, #29=, #30=, #31=, #32=, #33=, #34=, #36=, #37=, #38=, #51=, #52=, #53=
    flag alphaTest differs: #2=0, #7=0, #9=0, #10=0, #11=0.45, #12=0, #13=0, #14=0, #15=0, #16=0, #17=(unknown), #18=0, #19=0, #20=(unknown), #21=0, #24=0, #25=0, #26=0, #27=0.45, #28=0, #29=0, #30=0, #31=0, #32=0, #33=0, #34=0, #36=0, #37=0, #38=0, #51=0, #52=0, #53=0
    flag envMap differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
    flag flatShading differs: #2=false, #7=true, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=true, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=true, #53=false
    flag fog differs: #2=true, #7=true, #9=true, #10=true, #11=true, #12=true, #13=true, #14=true, #15=true, #16=true, #17=(unknown), #18=true, #19=true, #20=(unknown), #21=true, #24=true, #25=true, #26=true, #27=true, #28=true, #29=true, #30=true, #31=true, #32=true, #33=true, #34=true, #36=true, #37=true, #38=true, #51=true, #52=true, #53=true
    flag map differs: #2=false, #7=false, #9=false, #10=true, #11=true, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=true, #20=(unknown), #21=false, #24=false, #25=false, #26=true, #27=true, #28=false, #29=true, #30=true, #31=true, #32=true, #33=true, #34=false, #36=true, #37=true, #38=true, #51=false, #52=false, #53=true
    flag normalMap differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=true, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=true, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
    flag transparent differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=true, #19=false, #20=(unknown), #21=true, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=true, #32=true, #33=false, #34=false, #36=true, #37=true, #38=false, #51=true, #52=false, #53=false
    flag wireframe differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
  MeshBasicMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (12 programs):
    vertexShaderHash differs: #39=59ed5d71, #40=b69ba143, #41=2e7a6fcb, #42=585a1ea4, #43=c203b19a, #44=c203b19a, #45=585a1ea4, #46=263c45d6, #47=2efa42a8, #48=e4717b03, #49=bc2d5094, #50=c6dd5f29
    fragmentShaderHash differs: #39=d729897e, #40=d729897e, #41=758a4164, #42=41e40a66, #43=41e40a66, #44=a9dd0dee, #45=a9dd0dee, #46=d729897e, #47=41e40a66, #48=41e40a66, #49=758a4164, #50=ddb1b5d4
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2209 (+18):
  Program #82
    material: MeshStandardMaterial ''
    materialUuid: b2077994-69a3-4e17-9d05-7e5a21f6dc77
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #83
    material: MeshStandardMaterial 'Wood'
    materialUuid: 3725fb3b-82c9-4409-bd03-a6691c6f2371
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #84
    material: MeshStandardMaterial 'Green'
    materialUuid: a3abe42e-553e-4d45-aff2-24c46ebd35cc
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
  Program #85
    material: MeshStandardMaterial 'Green'
    materialUuid: ca88eb1e-1952-4646-8285-e3bc8d5aa887
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
  Program #86
    material: MeshStandardMaterial 'Berry'
    materialUuid: d0c723c5-b63d-4773-ac19-689e60413186
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #87
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: a311dbc4-9b07-4a3c-ba97-7e22a688e3af
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #88
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 7bed6670-4265-4bb2-a44a-82ff7dc8a8a6
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
  Program #89
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 5e4407f4-60fb-4f08-92d8-41e59d1fabac
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #90
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 0b8f2730-e6ea-40bf-9080-1f0913aab8bd
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
  Program #91
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 129c0957-2d5f-4aaf-a109-8b6c1634a554
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #92
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: f145e6b6-4bd3-41e2-98f5-ef020d048482
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #93
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 989f8007-ce0d-46b2-99eb-237695087cec
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #94
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: c95a7fee-4ae4-4a3c-b48e-98e04b013089
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #95
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: dbc37aa5-7b4a-4db2-ba63-71ff518d6e0e
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #96
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: a140aa15-4c71-46c0-b802-38d7828e8abf
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #97
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: bdeaa70a-b200-460c-8da1-b6bc02bc2809
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #98
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #99
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: 5aeef5e9-c1cc-4cc8-a6fa-8bb02274ad05
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2491 (+22):
  Program #105
    material: ShaderMaterial 'SkyShader'
    materialUuid: 55389c63-6482-4c57-9009-aaa6b17e7a6b
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #106
    material: ShaderMaterial ''
    materialUuid: 13768dd7-25a0-47c7-b4e7-aef9491a8e21
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #107
    material: MeshStandardMaterial ''
    materialUuid: b2077994-69a3-4e17-9d05-7e5a21f6dc77
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #108
    material: MeshStandardMaterial 'Wood'
    materialUuid: 3725fb3b-82c9-4409-bd03-a6691c6f2371
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #109
    material: MeshStandardMaterial 'Green'
    materialUuid: a3abe42e-553e-4d45-aff2-24c46ebd35cc
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
  Program #110
    material: MeshStandardMaterial 'Green'
    materialUuid: ca88eb1e-1952-4646-8285-e3bc8d5aa887
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
  Program #111
    material: MeshStandardMaterial 'Berry'
    materialUuid: d0c723c5-b63d-4773-ac19-689e60413186
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #112
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: a311dbc4-9b07-4a3c-ba97-7e22a688e3af
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #113
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 7bed6670-4265-4bb2-a44a-82ff7dc8a8a6
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
  Program #114
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 5e4407f4-60fb-4f08-92d8-41e59d1fabac
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #115
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 0b8f2730-e6ea-40bf-9080-1f0913aab8bd
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
  Program #116
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 129c0957-2d5f-4aaf-a109-8b6c1634a554
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #117
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 989f8007-ce0d-46b2-99eb-237695087cec
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #118
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: c95a7fee-4ae4-4a3c-b48e-98e04b013089
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #119
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: dbc37aa5-7b4a-4db2-ba63-71ff518d6e0e
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #120
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: a140aa15-4c71-46c0-b802-38d7828e8abf
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #121
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: bdeaa70a-b200-460c-8da1-b6bc02bc2809
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #122
    material: ShaderMaterial ''
    materialUuid: e86f531d-9188-42cc-813c-bb9af5780a43
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #123
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 14,15,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #124
    material: MeshBasicMaterial ''
    materialUuid: 079a0df9-9170-4d37-ae98-b63af72ecc3b
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #125
    material: ShaderMaterial ''
    materialUuid: 63258a46-a169-460e-860e-381a6db1a21e
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #126
    material: ShaderMaterial ''
    materialUuid: fdc0b92c-2098-4d94-8686-c8e2ef457c7f
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

Frame 39
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 22.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 470
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 38.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 531
  #78
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 21.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 544
  #79
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,0|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 12.1 ms  (upper bound — whole mirror-render call, see note above)

Frame 1009
  #80
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 49.3 ms  (upper bound — whole mirror-render call, see note above)

Frame 1129
  #81
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 51.1 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 194.5 ms
  programs >1 ms: 6
  max: 51.1 ms (#81)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.4 ms  p95=10.9 ms  max=13.1 ms  Δavg vs baseline=—
  hide-grass           avg=5.5 ms  p95=6.2 ms  max=6.8 ms  Δavg vs baseline=-0.9 ms (-14%)
  hide-vegetation      avg=4.9 ms  p95=5.8 ms  max=6.0 ms  Δavg vs baseline=-1.5 ms (-23%)
  no vegetation/grass  avg=4.7 ms  p95=5.2 ms  max=5.4 ms  Δavg vs baseline=-1.7 ms (-27%)
  hide-environment     avg=5.8 ms  p95=6.7 ms  max=7.6 ms  Δavg vs baseline=-0.6 ms (-10%)
  hide-settlement      avg=5.3 ms  p95=6.1 ms  max=6.2 ms  Δavg vs baseline=-1.2 ms (-18%)
  no water             avg=5.7 ms  p95=7.2 ms  max=9.6 ms  Δavg vs baseline=-0.7 ms (-11%)
  hide-terrain         avg=5.4 ms  p95=6.2 ms  max=6.6 ms  Δavg vs baseline=-1.0 ms (-15%)
  hide-npc-fauna       avg=5.2 ms  p95=6.7 ms  max=7.1 ms  Δavg vs baseline=-1.2 ms (-18%)
  no-shadows           avg=5.5 ms  p95=6.6 ms  max=7.0 ms  Δavg vs baseline=-0.9 ms (-13%)
  no-ao                avg=5.5 ms  p95=6.4 ms  max=6.7 ms  Δavg vs baseline=-0.9 ms (-14%)
  no-bloom             avg=5.6 ms  p95=6.3 ms  max=8.1 ms  Δavg vs baseline=-0.8 ms (-13%)
  no-smaa              avg=5.9 ms  p95=7.2 ms  max=7.2 ms  Δavg vs baseline=-0.5 ms (-9%)
  no-god-rays          avg=5.6 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=-0.8 ms (-12%)
  no-film-grade        avg=5.6 ms  p95=6.6 ms  max=6.9 ms  Δavg vs baseline=-0.8 ms (-12%)
  no postprocessing    avg=5.6 ms  p95=6.5 ms  max=6.7 ms  Δavg vs baseline=-0.9 ms (-13%)
  no mirrors           avg=5.8 ms  p95=6.7 ms  max=6.8 ms  Δavg vs baseline=-0.6 ms (-9%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=12.3 ms  p95=14.4 ms  max=15.0 ms
  CPU wall      avg=6.4 ms  p95=10.9 ms  max=13.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
