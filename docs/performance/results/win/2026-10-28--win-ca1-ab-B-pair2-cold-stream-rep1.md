# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:33:00.852Z
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
Frames: 1378
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-32-08-831Z-af81pa
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
  camera: pos=(427.1, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5249ms npc=20
  gpuTimer: available=true resolved=true samples=1385 span=postprocess+labels

FPS:
  avg: 61.8
  min: 3
  p1: 17

Frame time (wall-clock):
  avg: 16.2 ms
  p50: 14.1 ms
  p95: 27.2 ms
  p99: 58.5 ms
  max: 303.1 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.3 p95=8.6 p99=41.9 max=87.8 n=1378
  render: p50=9.9 p95=17.7 p99=28 max=297.8 n=1378
  frame: p50=14.1 p95=27.2 p99=58.5 max=303.1 n=1378

Rendering (combined renderer.info):
  draw calls: 850 avg / 2040 max
  triangles: 10.47M avg
  mirror draws: 153 avg
  geometries: 734
  textures: 582

Pass submissions (actual):
  reliability: observed
  frames: 1387 shadowRefresh=500 shadowSkipped=887
  mirror calls avg: 152
  shadow calls avg: 307
  main calls avg: 569

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=49 tris=1.18M meshes=49 inst=124428
  vegetation       draws=200 tris=1.33M meshes=200 inst=852
  environment      draws=128 tris=26.2k meshes=128 inst=144
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=346 tris=28.8k meshes=346 inst=346
  other            draws=228 tris=25.8k meshes=228 inst=228

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=184 tris=1.29M meshes=184 inst=822
  environment      draws=127 tris=26.2k meshes=127 inst=143
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
  WATER          2.2 ms
  STREAMING      0.5 ms
  NPC            1.3 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         9.0 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  WATER: 1
  STREAMING: 1

Hitches (>= 8 ms): total=2
  chunk mesh             n=1 avg=10.7 max=10.7
  chunk water            n=1 avg=8.0 max=8.0

Isolation probes:
  full               render=6.0 ms draws=296 tris=6.14M
  hide-grass         render=5.7 ms draws=268 tris=5.07M
  hide-vegetation    render=4.9 ms draws=164 tris=4.40M
  hide-vegetation-grass render=4.8 ms draws=135 tris=3.34M
  hide-environment   render=6.5 ms draws=275 tris=6.13M
  hide-settlement    render=5.7 ms draws=271 tris=6.04M
  hide-water         render=6.3 ms draws=286 tris=5.24M
  hide-terrain       render=5.7 ms draws=269 tris=3.89M
  hide-npc-fauna     render=5.4 ms draws=300 tris=6.21M
  no-shadows         render=5.8 ms draws=281 tris=5.83M
  no-ao              render=5.9 ms draws=294 tris=6.21M
  no-bloom           render=6.4 ms draws=287 tris=6.21M
  no-smaa            render=5.9 ms draws=293 tris=6.14M
  no-god-rays        render=6.1 ms draws=300 tris=6.21M
  no-film-grade      render=6.0 ms draws=300 tris=6.21M
  no-postprocessing  render=5.8 ms draws=277 tris=6.21M
  no-reflections     render=6.0 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 303.1 ms
  largest labelled hitch: 10.7 ms
  unattributed: 292.4 ms

Long frames:
  threshold: 80 ms
  count: 7
  worst: 303.1 ms

Raw sidecar:
  sampling=full factor=1 exported=1378/1378

Recommendation:
Largest frame (303.1 ms) is not explained by labelled hitches (largest 10.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (7.2 ms cumulative)
  agent updates: 0.7 ms/frame (1004.3 ms cumulative)
  livestock: 0.2 ms/frame (330.0 ms cumulative)
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
    update calls/frame: 14.7
    unique animals/frame: 14.5
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.4 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 3.8/frame (0.0 candidates/frame)
    water samples: 8.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 8.8/frame, 0.00 ms/frame (worst call 0.10 ms, 597.4 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 14.6
    behaviour executions/frame: 3.8
    presentation executions/frame: 3.3
  rats: 0.1 ms/frame (114.0 ms cumulative)
  social: 0.0 ms/frame (3.4 ms cumulative)
  streaming: 0.1 ms/frame (128.6 ms cumulative)
  maintenance: 0.1 ms/frame (142.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.5 ms/frame (2003.7 ms cumulative)
  forest sampling: 0.1 ms/frame (104.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (17.7 ms cumulative)
    targeting: 0.0 ms/frame (13.7 ms cumulative)
    decision: 0.0 ms/frame (16.1 ms cumulative)
    behaviour: 1.0 ms/frame (1405.0 ms cumulative)
    life/presentation: 0.3 ms/frame (347.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.6
    expensive behaviour agents/frame: 14.0
    full-rate agents/frame: 8.5
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 14.5
    presentation executions/frame: 13.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.4
    village scan candidates/frame: 276.1
    player perception checks/frame: 30.2

  nearest scans: 19.6/frame (27074 calls)
  nearest candidates checked: 114.5/frame (157810 total)
  herd leader scans: 0.2/frame (281 calls)
  herd candidates checked: 6.1/frame (8430 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 17.9/frame (120.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 82.8/frame, 0.10 ms/frame (worst call 6.30 ms)
    collider queries: 82.8/frame, 0.10 ms/frame (worst call 0.30 ms, 2959.0 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 79
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.11 ms
    max 0.40 ms

  allocation/setup:
    avg 0.07 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.02 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.02 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.26 ms
    max 0.80 ms

  per chunk:
    instances avg/max 46638.1 / 87357
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 886124 / 0
    matrix instances bound: 886124
    instanced attributes created: 285
    shared material refs: 57
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 19/19
    instances: 332550 (max 32465)
    allocation/setup avg/max: 0.04 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=682989 filler=137739
Submitted instances: full=87100 filler=37327
Meshes submitted: 48
LOD submitted fraction: full=0.127527676141197 filler=0.2709980470309789
Flowers: unavailable
Allocation bytes (estimated): 78789888
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=25 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1387
Shadow refresh frames: 500
Shadow skipped frames: 887

Mirror:
  calls avg: 152  tris avg: 871228
  info calls avg: 152  residual calls avg: 0
  environment                  calls=4 tris=3878
  items                        calls=1 tris=500
  other                        calls=32 tris=4765
  settlement:decor             calls=8 tris=19773
  settlement:fence             calls=1 tris=2145
  settlement:fireCampfire      calls=2 tris=185
  settlement:fireHouseExteriorLamp calls=5 tris=240
  settlement:fireHouseInteriorLamp calls=2 tris=180
  settlement:fireVillageTorch  calls=7 tris=494
  settlement:houseInteractive  calls=5 tris=552
  settlement:houseStatic       calls=12 tris=10533
  settlement:landmarkGarden    calls=2 tris=23392
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=668
  settlement:landmarkWellHousehold calls=2 tris=2114
  settlement:landmarkWellPasture calls=2 tris=589
  settlement:other             calls=3 tris=64
  settlement:storageBarrel     calls=3 tris=3935
  settlement:storageContainer  calls=10 tris=723
  settlement:storageGoods      calls=13 tris=2690
  settlement:storageHay        calls=0 tris=181
  settlement:storageTrough     calls=2 tris=481
  settlement:storageWoodHousehold calls=0 tris=1633
  settlement:storageWoodSettlementPrimary calls=0 tris=292
  settlement:workplace         calls=3 tris=1345
  terrain                      calls=5 tris=404216
  vegetation                   calls=23 tris=385808

Shadow (refresh only):
  calls avg: 307  tris avg: 2250976
  info calls avg: 307  residual calls avg: 0
  environment                  calls=10 tris=5719
  faunaFamily:boar             calls=1 tris=480
  faunaFamily:cow              calls=3 tris=941
  faunaFamily:horse            calls=2 tris=615
  faunaFamily:rabbit           calls=1 tris=825
  faunaFamily:rat              calls=1 tris=1497
  faunaFamily:sheep            calls=0 tris=92
  faunaFamily:stag             calls=7 tris=3986
  items                        calls=4 tris=1741
  npcFamily:Knight_Cloth       calls=4 tris=4793
  npcFamily:Peasant            calls=4 tris=4314
  npcFamily:Peasant_Boots      calls=1 tris=1465
  npcFamily:woodcutter         calls=1 tris=1125
  other                        calls=53 tris=11376
  settlement:decor             calls=107 tris=213296
  settlement:fireHouseInteriorLamp calls=1 tris=124
  settlement:houseInteractive  calls=2 tris=364
  settlement:houseStatic       calls=14 tris=6401
  settlement:landmarkGarden    calls=1 tris=461
  settlement:landmarkNoticeBoard calls=1 tris=21
  settlement:landmarkWellCentral calls=3 tris=1077
  settlement:other             calls=4 tris=83
  settlement:storageContainer  calls=5 tris=490
  settlement:storageHay        calls=1 tris=276
  settlement:storageTrough     calls=1 tris=254
  settlement:storageWoodHousehold calls=1 tris=998
  settlement:storageWoodSettlementPrimary calls=1 tris=441
  settlement:workplace         calls=2 tris=2026
  terrain                      calls=19 tris=1366776
  vegetation                   calls=54 tris=618918

Main:
  calls avg: 569  tris avg: 8758722
  info calls avg: 694  residual calls avg: 0
  environment                  calls=51 tris=13513
  faunaFamily:bear             calls=1 tris=649
  faunaFamily:chicken          calls=6 tris=798
  faunaFamily:cow              calls=0 tris=182
  faunaFamily:dog              calls=11 tris=3824
  faunaFamily:horse            calls=0 tris=74
  faunaFamily:rabbit           calls=0 tris=173
  faunaFamily:rat              calls=2 tris=3037
  faunaFamily:sheep            calls=4 tris=1217
  faunaFamily:stag             calls=1 tris=412
  faunaFamily:wolf             calls=2 tris=925
  grass                        calls=37 tris=5474818
  items                        calls=46 tris=5311
  npcFamily:Farmer             calls=7 tris=10865
  npcFamily:Knight_Cloth       calls=6 tris=7737
  npcFamily:Peasant            calls=36 tris=43847
  npcFamily:Peasant_Boots      calls=6 tris=7966
  npcFamily:blacksmith         calls=7 tris=9377
  other                        calls=86 tris=14691
  settlement:decor             calls=14 tris=35907
  settlement:fence             calls=3 tris=4437
  settlement:fireCampfire      calls=5 tris=377
  settlement:fireHouseExteriorLamp calls=10 tris=500
  settlement:fireHouseInteriorLamp calls=3 tris=377
  settlement:fireVillageTorch  calls=14 tris=1030
  settlement:houseInteractive  calls=10 tris=1148
  settlement:houseStatic       calls=22 tris=19836
  settlement:landmarkGarden    calls=5 tris=47299
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1436
  settlement:landmarkWellHousehold calls=4 tris=4347
  settlement:landmarkWellPasture calls=3 tris=1219
  settlement:other             calls=7 tris=132
  settlement:storageBarrel     calls=5 tris=8136
  settlement:storageContainer  calls=21 tris=1497
  settlement:storageGoods      calls=27 tris=5625
  settlement:storageHay        calls=1 tris=363
  settlement:storageTrough     calls=3 tris=1000
  settlement:storageWoodHousehold calls=1 tris=3391
  settlement:storageWoodSettlementPrimary calls=1 tris=599
  settlement:workplace         calls=6 tris=2838
  terrain                      calls=24 tris=1739565
  vegetation                   calls=56 tris=815569
  water                        calls=7 tris=462999


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 7
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 7 total):

[LONG FRAME] 303.1ms
simulate         4.7ms
render         297.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        1.5ms
NPC              1.2ms
FAUNA            0.8ms
PHYSICS          0.0ms
RENDER         297.8ms
OTHER            1.7ms

streaming / stages:
  contentFinalize              1.5ms
  chunkFinalize                1.5ms
  chunkUpdate                  1.5ms

Long frame #2:

[LONG FRAME] 276.1ms
simulate        60.0ms
render         215.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          202.8ms
STREAMING       52.1ms
NPC              2.6ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER          12.5ms
OTHER            4.4ms

streaming / stages:
  chunkUpdate                  52.1ms
  riverTileBuild               46.7ms
  terrainPrepare               1.6ms
  riverChannelSegmentsNear     0.2ms

Long frame #3:

[LONG FRAME] 234.3ms
simulate         2.6ms
render         230.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          220.6ms
STREAMING        0.0ms
NPC              0.7ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER          10.1ms
OTHER            1.9ms

Long frame #4:

[LONG FRAME] 215.1ms
simulate         4.9ms
render         209.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        6.7ms
NPC              1.8ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER         209.5ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              3.4ms
  waterFinalize                2.1ms
  contentFinalize              1.1ms
  chunkFinalize                1.1ms
  chunkUpdate                  1.1ms
  riverFinalize                0.1ms

Long frame #5:

[LONG FRAME] 104.2ms
simulate        87.8ms
render          16.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.7ms
STREAMING        0.0ms
NPC             83.1ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER          11.6ms
OTHER            3.9ms

streaming / stages:
  riverTileBuild               43.4ms
  terrainPrepare               6.2ms
  riverChannelSegmentsNear     0.3ms

---

[Seedvale Program Census]

Programs created: 129
Program count: final=128 max=128

By frame:
  frame 0   +75 programs   <== largest transition
  frame 59   +1 program
  frame 60   +1 program
  frame 417   +1 program
  frame 435   +1 program
  frame 463   +1 program
  frame 508   +1 program
  frame 568   +1 program
  frame 583   +1 program
  frame 1030   +1 program
  frame 1151   +1 program
  frame 2192   +15 programs
  frame 2193   +3 programs
  frame 2239   +4 programs
  frame 2473   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=301a16cc-86df-486a-9c07-27b794101b80 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bfbe2f49-6e84-44af-ba98-f106b1f6a80d
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=09b64c0d-e620-4c2a-8083-751f33820e84
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ec7e9582-a6d3-4ded-9cf4-3bd8adb8dbd7
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=03955295-aed0-434c-8d0e-1d3c4c916388
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c7187216-dcb5-4d73-968e-3eb192c2a3ac
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=474f489d-0445-4ef4-936f-dafa0e50af89
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=32d44a0f-67f3-49c5-a475-2fcfb7abe4b5
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=71ce3c47-5262-4a7d-9cb1-5dfdeb005658
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fcc00ec2-313d-4cf5-8bcb-4eb1b65a6a42 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=74d8fe90-3512-4881-88ea-a9b58cd47ad1
  #13 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ab26aa09-cb20-422e-b50d-288fdbd04a19 (Main)
  #14 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1017715e-5b34-41ac-8472-2ec607d32048 (Material.001)
  #15 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0579f6e7-1509-4567-9a2f-97fefd7eb110 (lambert2SG)
  #16 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7108ff50-d8ae-46d6-a1b5-223c9ef79172 (Material #55)
  #17 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c3ccecb6-e04b-4ab0-98cf-395741922ab7 (Green)
  #18 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ad90b4bc-4b20-4b6d-941b-c99555a80d0e (Stone)
  #19 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=93ab8d37-c889-4f45-b89a-74db90931cb2 (None)
  #20 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=73c6b106-2f5d-497d-ae28-0935a65c752f (Flowers)
  #21 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1ec58028-3063-4cbc-85ae-a383406d391f (Pink)
  #22 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=items cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4e33db92-e9c7-4753-a0d9-230a9fccdaa1 (Pond_Pack_MAT)
  #23 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=663a5551-0d50-464b-8b7f-894da5cc3605 (MI_WoodTrim)
  #24 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #25 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=680a4b1a-24a5-481a-9eb0-384497c31398 (MI_WindowGlass)
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=6cd8f3e0-2165-42cf-8b64-f338c64496f6 (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a5ca9367-2d36-481c-bae8-98a149778bba (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=192116fc-6a92-498f-92d9-dbe53861c99b (Main)
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d5088a07-8e06-4a60-8610-8dad273d4f85 (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=91cf94aa-2d34-4446-ad32-89665cae1d19 (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5f9295c9-a273-45ff-bc61-79051dc1f957 (MI_Hair_1)
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
      material=6ca97c3f-f5d1-4fd1-b8a5-30d81eb5370b (Green)
  #46 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=02c3ac60-fbc6-4d05-99e1-1f25762c909c (MapleTree_Bark)
  #47 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=144eb4cc-fd78-4d47-a12c-4b5ffafaee98 (MapleTree_Leaves)
  #48 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f70d6785-bf5d-4100-b123-cc7e21b2b89e (stockpiles_vc)
  #49 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c219aee9-cb97-4a02-af43-a43ad48cf3d5
  #50 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=09ff3f6b-806e-42b1-9b65-16bb045d304f (Handle)
  #51 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=90450470-951c-48d8-bddb-a530aa34faaa (DarkGreen)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e66b84dc-e9d8-4ecb-8403-83da915dcf9d (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a6b03fab-78f5-4819-a299-5c52a6e040f5 (MI_Eyes)
  #54 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5b711afe-6edc-4a72-a2f7-dc22b3d83a78 (PathRocks)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=61fbd638-b8de-47fe-ad2a-5af5f57cc8a4 (MI_Knight)
  #56 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=773cd9f4-7616-40ba-9865-1c0156a4d6ff (MI_Hair_1)
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
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=54e03756, #14=a99aa494, #15=7bb77142, #17=c0d790d1, #18=a9733c9d, #19=6db98a06, #20=e4cbf8ca, #21=d3fd7a87, #22=c3bc6325, #23=c5e73b05, #24=13a74ec7, #25=9dcf1cb4, #26=12873951, #27=fc941d05, #28=e551c572, #31=fd8301ed, #32=842fe1df, #33=ac268392, #34=1c179521, #45=190d3a9c, #46=9dbe8ee7, #47=3bea20f6, #48=a64d124e, #49=94297e69, #50=3abb47a8, #51=9434da33, #52=20daccfa, #53=1dcbc6ff, #54=b643916d, #55=1d0412b3, #56=ee59055a
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=d391c52, #14=63f9c0d1, #15=87728b15, #17=a81023c3, #18=bd723c8a, #19=efed8e98, #20=135696d3, #21=2eae9a54, #22=ded4be89, #23=d4c95125, #24=3ab4c629, #25=2d1aa4a, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=2f2885d5, #32=34995f15, #33=25a41317, #34=71f22dc6, #45=633146b4, #46=8dba9dd, #47=5b26a60d, #48=546e469, #49=aa0735a8, #50=85d3c28d, #51=77dfd097, #52=a8862f4a, #53=1a1c0d8, #54=754b87bd, #55=512afd6f, #56=e8d88acf
    bucket differs: #2=terrain, #7=other, #9=other, #13=fauna, #14=fauna, #15=fauna, #17=vegetation, #18=environment, #19=environment, #20=vegetation, #21=vegetation, #22=items, #23=settlement, #24=(unknown), #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=fauna, #32=other, #33=other, #34=other, #45=settlement, #46=settlement, #47=settlement, #48=settlement, #49=other, #50=settlement, #51=other, #52=other, #53=other, #54=settlement, #55=npc, #56=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #17=, #18=, #19=, #20=, #21=, #22=, #23=, #24=(unset), #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #34=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #17=0, #18=0, #19=0, #20=0.45, #21=0, #22=0, #23=0, #24=(unknown), #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #34=0, #45=0, #46=0, #47=0.45, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=true, #50=true, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #17=true, #18=true, #19=true, #20=true, #21=true, #22=true, #23=true, #24=(unknown), #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #34=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=true, #17=false, #18=false, #19=true, #20=true, #21=false, #22=true, #23=true, #24=(unknown), #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=true, #45=false, #46=true, #47=true, #48=false, #49=false, #50=false, #51=false, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=true, #24=(unknown), #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=true, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=true, #26=false, #27=(unknown), #28=true, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=true, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=false, #45=false, #46=false, #47=false, #48=true, #49=false, #50=false, #51=false, #52=true, #53=true, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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



Frame 2192 (+15):
  Program #85
    material: MeshStandardMaterial ''
    materialUuid: 09b64c0d-e620-4c2a-8083-751f33820e84
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #86
    material: MeshStandardMaterial 'Wood'
    materialUuid: ebc35df7-33ae-4e37-9152-3b38c227f5d6
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: cb4f23a1-6a5b-40af-97ce-01a8b1d234a3
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
    materialUuid: fb011c01-632e-4422-bda0-ef1da7e42309
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
    materialUuid: 565b2481-4114-4f81-a7bf-21596f8e09f8
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #90
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 02c3ac60-fbc6-4d05-99e1-1f25762c909c
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #91
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 73c6b106-2f5d-497d-ae28-0935a65c752f
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
    materialUuid: 3aff5922-fe3c-46ee-aff7-a4691f26b0fb
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 439a7356-0ba7-4329-83ca-0735f93940cd
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
    materialUuid: f70d6785-bf5d-4100-b123-cc7e21b2b89e
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #95
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: e66b84dc-e9d8-4ecb-8403-83da915dcf9d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #96
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: a6b03fab-78f5-4819-a299-5c52a6e040f5
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #97
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: d5088a07-8e06-4a60-8610-8dad273d4f85
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 91cf94aa-2d34-4446-ad32-89665cae1d19
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 5f9295c9-a273-45ff-bc61-79051dc1f957
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 2473 (+22):
  Program #107
    material: ShaderMaterial 'SkyShader'
    materialUuid: 301a16cc-86df-486a-9c07-27b794101b80
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #108
    material: ShaderMaterial ''
    materialUuid: c7187216-dcb5-4d73-968e-3eb192c2a3ac
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #109
    material: MeshStandardMaterial ''
    materialUuid: 09b64c0d-e620-4c2a-8083-751f33820e84
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #110
    material: MeshStandardMaterial 'Wood'
    materialUuid: ebc35df7-33ae-4e37-9152-3b38c227f5d6
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: cb4f23a1-6a5b-40af-97ce-01a8b1d234a3
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
    materialUuid: fb011c01-632e-4422-bda0-ef1da7e42309
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
    materialUuid: 565b2481-4114-4f81-a7bf-21596f8e09f8
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #114
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 02c3ac60-fbc6-4d05-99e1-1f25762c909c
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #115
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 73c6b106-2f5d-497d-ae28-0935a65c752f
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
    materialUuid: 3aff5922-fe3c-46ee-aff7-a4691f26b0fb
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #117
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 439a7356-0ba7-4329-83ca-0735f93940cd
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
    materialUuid: f70d6785-bf5d-4100-b123-cc7e21b2b89e
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #119
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: e66b84dc-e9d8-4ecb-8403-83da915dcf9d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #120
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: a6b03fab-78f5-4819-a299-5c52a6e040f5
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #121
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: d5088a07-8e06-4a60-8610-8dad273d4f85
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #122
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 91cf94aa-2d34-4446-ad32-89665cae1d19
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 5f9295c9-a273-45ff-bc61-79051dc1f957
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #124
    material: ShaderMaterial ''
    materialUuid: 474f489d-0445-4ef4-936f-dafa0e50af89
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
    materialUuid: 71ce3c47-5262-4a7d-9cb1-5dfdeb005658
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #127
    material: ShaderMaterial ''
    materialUuid: 5a386b82-6f2a-4002-8354-77537b26487c
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #128
    material: ShaderMaterial ''
    materialUuid: 80ea31f7-9823-4cce-a349-da1761346d3c
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
Excluded — no reliable per-program timing: 119 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 59
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 14.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 60
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 13.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 417
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 41.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 435
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 47.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 463
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 25.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 508
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 34.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 568
  #81
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 201.2 ms  (upper bound — whole mirror-render call, see note above)

Frame 583
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,0|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 206.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 1030
  #83
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 219.2 ms  (upper bound — whole mirror-render call, see note above)

Frame 1151
  #84
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 294.5 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1098.8 ms
  programs >1 ms: 10
  max: 294.5 ms (#84)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.0 ms  p95=7.0 ms  max=7.3 ms  Δavg vs baseline=—
  hide-grass           avg=5.7 ms  p95=6.4 ms  max=6.8 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-vegetation      avg=4.9 ms  p95=5.6 ms  max=7.2 ms  Δavg vs baseline=-1.0 ms (-17%)
  no vegetation/grass  avg=4.8 ms  p95=5.9 ms  max=6.3 ms  Δavg vs baseline=-1.1 ms (-19%)
  hide-environment     avg=6.5 ms  p95=8.6 ms  max=10.5 ms  Δavg vs baseline=+0.5 ms (+9%)
  hide-settlement      avg=5.7 ms  p95=6.4 ms  max=6.4 ms  Δavg vs baseline=-0.3 ms (-5%)
  no water             avg=6.3 ms  p95=7.6 ms  max=8.2 ms  Δavg vs baseline=+0.4 ms (+6%)
  hide-terrain         avg=5.7 ms  p95=6.6 ms  max=7.3 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-npc-fauna       avg=5.4 ms  p95=6.5 ms  max=7.2 ms  Δavg vs baseline=-0.6 ms (-10%)
  no-shadows           avg=5.8 ms  p95=6.6 ms  max=7.4 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-ao                avg=5.9 ms  p95=7.1 ms  max=9.5 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-bloom             avg=6.4 ms  p95=7.9 ms  max=8.7 ms  Δavg vs baseline=+0.4 ms (+7%)
  no-smaa              avg=5.9 ms  p95=6.7 ms  max=7.7 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-god-rays          avg=6.1 ms  p95=6.9 ms  max=7.4 ms  Δavg vs baseline=+0.1 ms (+2%)
  no-film-grade        avg=6.0 ms  p95=7.5 ms  max=7.6 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=5.8 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=-0.1 ms (-2%)
  no mirrors           avg=6.0 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=+0.0 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=13.1 ms  p95=15.0 ms  max=15.3 ms
  CPU wall      avg=6.0 ms  p95=7.0 ms  max=7.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
