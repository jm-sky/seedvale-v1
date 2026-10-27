# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:41:39.997Z
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
Frames: 1309
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-40-48-511Z-4wzbsm
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
  viewport: 1600x900
  drawingBuffer: 1600x900
  camera: pos=(427, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5249ms npc=20
  gpuTimer: available=true resolved=true samples=1319 span=postprocess+labels

FPS:
  avg: 54.9
  min: 4
  p1: 17

Frame time (wall-clock):
  avg: 18.2 ms
  p50: 16.6 ms
  p95: 26.5 ms
  p99: 58.2 ms
  max: 226.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.2 p95=8 p99=42.3 max=68.9 n=1309
  render: p50=11.2 p95=18.2 p99=26.8 max=203.1 n=1309
  frame: p50=16.6 p95=26.5 p99=58.2 max=226.7 n=1309

Rendering (combined renderer.info):
  draw calls: 904 avg / 2116 max
  triangles: 10.55M avg
  mirror draws: 162 avg
  geometries: 759
  textures: 668

Pass submissions (actual):
  reliability: observed
  frames: 1320 shadowRefresh=532 shadowSkipped=788
  mirror calls avg: 161
  shadow calls avg: 295
  main calls avg: 606

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=60 tris=1.18M meshes=60 inst=124577
  vegetation       draws=219 tris=1.48M meshes=219 inst=934
  environment      draws=135 tris=29.1k meshes=135 inst=151
  settlement       draws=688 tris=671.5k meshes=688 inst=1192
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=180 tris=221.8k meshes=180 inst=180
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=368 tris=32.3k meshes=368 inst=368
  other            draws=230 tris=25.9k meshes=230 inst=230

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=201 tris=1.44M meshes=201 inst=902
  environment      draws=134 tris=29.1k meshes=134 inst=150
  settlement       draws=428 tris=478.1k meshes=428 inst=895
  items            draws=44 tris=25.5k meshes=44 inst=44
  other            draws=102 tris=14.5k meshes=102 inst=102

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=67 tris=43.7k meshes=67 inst=379
  houseInteractive draws=18 tris=2.8k meshes=18 inst=18
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=18 tris=8.0k meshes=18 inst=18
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
      Peasant          agents=10 draws=90 tris=110.6k skinned=90/90
      Peasant_Boots    agents=3 draws=27 tris=35.4k skinned=27/27
      Wizard           agents=2 draws=24 tris=23.9k skinned=24/24
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Herbalist        agents=1 draws=10 tris=14.2k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      far  agents=19 camera-relevant=0 draws=180 tris=221.8k
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
  STREAMING      0.6 ms
  NPC            1.2 ms
  FAUNA          1.3 ms
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
  chunk mesh             n=2 avg=10.7 max=11.7
  chunk water            n=2 avg=8.9 max=9.7

Isolation probes:
  full               render=7.3 ms draws=378 tris=6.09M
  hide-grass         render=6.9 ms draws=351 tris=5.05M
  hide-vegetation    render=6.2 ms draws=241 tris=4.21M
  hide-vegetation-grass render=6.1 ms draws=213 tris=3.18M
  hide-environment   render=6.9 ms draws=357 tris=6.08M
  hide-settlement    render=6.5 ms draws=347 tris=5.86M
  hide-water         render=7.0 ms draws=361 tris=5.14M
  hide-terrain       render=6.9 ms draws=348 tris=3.85M
  hide-npc-fauna     render=5.1 ms draws=291 tris=6.02M
  no-shadows         render=7.1 ms draws=359 tris=5.72M
  no-ao              render=6.9 ms draws=368 tris=6.03M
  no-bloom           render=7.0 ms draws=365 tris=6.09M
  no-smaa            render=7.5 ms draws=375 tris=6.09M
  no-god-rays        render=7.0 ms draws=374 tris=6.03M
  no-film-grade      render=6.9 ms draws=378 tris=6.09M
  no-postprocessing  render=6.7 ms draws=355 tris=6.09M
  no-reflections     render=7.0 ms draws=306 tris=5.02M

Frame attribution:
  frame max: 226.7 ms
  largest labelled hitch: 11.7 ms
  unattributed: 215 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 226.7 ms

Raw sidecar:
  sampling=full factor=1 exported=1309/1309

Recommendation:
Largest frame (226.7 ms) is not explained by labelled hitches (largest 11.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.2 ms/frame
  crowd pass: 0.0 ms/frame (6.6 ms cumulative)
  agent updates: 0.7 ms/frame (890.5 ms cumulative)
  livestock: 0.2 ms/frame (272.9 ms cumulative)
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
    update calls/frame: 14.5
    unique animals/frame: 14.3
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.5 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 4.1/frame (0.0 candidates/frame)
    water samples: 7.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 7.3/frame, 0.00 ms/frame (worst call 0.10 ms, 499.3 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 14.4
    behaviour executions/frame: 4.1
    presentation executions/frame: 3.5
  rats: 0.1 ms/frame (90.2 ms cumulative)
  social: 0.0 ms/frame (4.6 ms cumulative)
  streaming: 0.1 ms/frame (113.3 ms cumulative)
  maintenance: 0.1 ms/frame (118.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (1729.1 ms cumulative)
  forest sampling: 0.1 ms/frame (91.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (21.4 ms cumulative)
    targeting: 0.0 ms/frame (18.4 ms cumulative)
    decision: 0.0 ms/frame (14.2 ms cumulative)
    behaviour: 0.9 ms/frame (1135.5 ms cumulative)
    life/presentation: 0.3 ms/frame (355.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 29.9
    decision passes/frame: 29.9
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.1
    full-rate agents/frame: 7.4
    reduced-cadence agents/frame: 22.6
    behaviour executions/frame: 14.1
    presentation executions/frame: 13.0

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 23.4
    village scan candidates/frame: 273.4
    player perception checks/frame: 29.9

  nearest scans: 19.7/frame (25842 calls)
  nearest candidates checked: 114.3/frame (149669 total)
  herd leader scans: 0.1/frame (114 calls)
  herd candidates checked: 2.6/frame (3420 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.1/frame (114.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 49.9/frame, 0.00 ms/frame (worst call 1.10 ms)
    collider queries: 49.9/frame, 0.00 ms/frame (worst call 1.60 ms, 2071.8 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.18 ms
    max 0.60 ms

  allocation/setup:
    avg 0.12 ms
    max 0.50 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.02 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.34 ms
    max 0.90 ms

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
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.05 / 0.50 ms
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

Chunks resident: 15
Resident instances: full=682989 filler=1453414
Submitted instances: full=87100 filler=37465
Meshes submitted: 48
LOD submitted fraction: full=0.127527676141197 filler=0.025777238969763604
Flowers: unavailable
Allocation bytes (estimated): 205094688
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=25 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1320
Shadow refresh frames: 532
Shadow skipped frames: 788

Mirror:
  calls avg: 161  tris avg: 892176
  info calls avg: 161  residual calls avg: 0
  environment                  calls=5 tris=4145
  items                        calls=1 tris=505
  other                        calls=29 tris=4884
  settlement:decor             calls=6 tris=15619
  settlement:fence             calls=1 tris=2254
  settlement:fireCampfire      calls=2 tris=171
  settlement:fireHouseExteriorLamp calls=15 tris=1008
  settlement:fireHouseInteriorLamp calls=2 tris=175
  settlement:fireVillageTorch  calls=7 tris=491
  settlement:houseInteractive  calls=5 tris=535
  settlement:houseStatic       calls=12 tris=10890
  settlement:landmarkGarden    calls=2 tris=21888
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=659
  settlement:landmarkWellHousehold calls=2 tris=2232
  settlement:landmarkWellPasture calls=2 tris=612
  settlement:other             calls=3 tris=63
  settlement:storageBarrel     calls=3 tris=4058
  settlement:storageContainer  calls=10 tris=744
  settlement:storageGoods      calls=13 tris=2631
  settlement:storageHay        calls=0 tris=166
  settlement:storageTrough     calls=2 tris=505
  settlement:storageWoodHousehold calls=3 tris=1464
  settlement:storageWoodSettlementPrimary calls=1 tris=326
  settlement:workplace         calls=3 tris=1294
  terrain                      calls=5 tris=403793
  vegetation                   calls=25 tris=411224

Shadow (refresh only):
  calls avg: 295  tris avg: 2269641
  info calls avg: 295  residual calls avg: 0
  environment                  calls=11 tris=5930
  faunaFamily:boar             calls=2 tris=746
  faunaFamily:cow              calls=2 tris=695
  faunaFamily:duck             calls=1 tris=45
  faunaFamily:fox              calls=1 tris=639
  faunaFamily:horse            calls=2 tris=422
  faunaFamily:rabbit           calls=1 tris=642
  faunaFamily:rat              calls=1 tris=1061
  faunaFamily:sheep            calls=0 tris=47
  faunaFamily:stag             calls=5 tris=3360
  items                        calls=4 tris=2081
  npcFamily:Knight_Cloth       calls=3 tris=3589
  npcFamily:Peasant_Boots      calls=1 tris=909
  npcFamily:Wizard             calls=3 tris=3333
  npcFamily:woodcutter         calls=1 tris=1072
  other                        calls=49 tris=11100
  settlement:decor             calls=97 tris=194108
  settlement:fireHouseInteriorLamp calls=1 tris=113
  settlement:houseInteractive  calls=2 tris=339
  settlement:houseStatic       calls=14 tris=6364
  settlement:landmarkGarden    calls=1 tris=447
  settlement:landmarkNoticeBoard calls=1 tris=21
  settlement:landmarkWellCentral calls=3 tris=1048
  settlement:other             calls=4 tris=72
  settlement:storageContainer  calls=5 tris=487
  settlement:storageHay        calls=1 tris=259
  settlement:storageTrough     calls=1 tris=259
  settlement:storageWoodHousehold calls=2 tris=914
  settlement:storageWoodSettlementPrimary calls=1 tris=469
  settlement:workplace         calls=2 tris=1944
  terrain                      calls=18 tris=1363260
  vegetation                   calls=55 tris=663864

Main:
  calls avg: 606  tris avg: 8710715
  info calls avg: 739  residual calls avg: 0
  environment                  calls=43 tris=12650
  faunaFamily:bear             calls=1 tris=638
  faunaFamily:chicken          calls=5 tris=710
  faunaFamily:cow              calls=0 tris=157
  faunaFamily:dog              calls=10 tris=3487
  faunaFamily:horse            calls=0 tris=26
  faunaFamily:rabbit           calls=0 tris=182
  faunaFamily:rat              calls=1 tris=2942
  faunaFamily:sheep            calls=4 tris=1244
  faunaFamily:stag             calls=2 tris=1166
  faunaFamily:wolf             calls=2 tris=859
  grass                        calls=34 tris=5523215
  items                        calls=47 tris=5244
  npcFamily:Herbalist          calls=0 tris=378
  npcFamily:Knight_Cloth       calls=12 tris=13060
  npcFamily:Peasant            calls=47 tris=51713
  npcFamily:Peasant_Boots      calls=24 tris=26383
  npcFamily:Wizard             calls=13 tris=12184
  npcFamily:blacksmith         calls=6 tris=7446
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=77 tris=14456
  settlement:decor             calls=11 tris=27969
  settlement:fence             calls=3 tris=4506
  settlement:fireCampfire      calls=4 tris=336
  settlement:fireHouseExteriorLamp calls=29 tris=1997
  settlement:fireHouseInteriorLamp calls=3 tris=348
  settlement:fireVillageTorch  calls=14 tris=979
  settlement:houseInteractive  calls=10 tris=1064
  settlement:houseStatic       calls=22 tris=19679
  settlement:landmarkGarden    calls=4 tris=42491
  settlement:landmarkNoticeBoard calls=1 tris=27
  settlement:landmarkWellCentral calls=4 tris=1356
  settlement:landmarkWellHousehold calls=4 tris=4381
  settlement:landmarkWellPasture calls=3 tris=1224
  settlement:other             calls=7 tris=124
  settlement:storageBarrel     calls=5 tris=8079
  settlement:storageContainer  calls=20 tris=1482
  settlement:storageGoods      calls=25 tris=5253
  settlement:storageHay        calls=1 tris=326
  settlement:storageTrough     calls=3 tris=1009
  settlement:storageWoodHousehold calls=7 tris=2907
  settlement:storageWoodSettlementPrimary calls=1 tris=640
  settlement:workplace         calls=6 tris=2599
  terrain                      calls=22 tris=1632751
  vegetation                   calls=55 tris=822415
  water                        calls=7 tris=445421


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 3
Shown: 3 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 3 shown, 3 total):

[LONG FRAME] 226.7ms
simulate        31.7ms
render         194.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       14.0ms
NPC              1.0ms
FAUNA           26.3ms
PHYSICS          0.1ms
RENDER         194.2ms
OTHER            0.0ms

streaming / stages:
  waterFinalize                6.8ms
  terrainFinalize              5.7ms
  contentFinalize              1.3ms
  chunkFinalize                1.3ms
  chunkUpdate                  1.3ms
  riverFinalize                0.1ms

Long frame #2:

[LONG FRAME] 211.9ms
simulate         7.9ms
render         203.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          190.2ms
STREAMING        0.9ms
NPC              1.5ms
FAUNA            0.9ms
PHYSICS          0.2ms
RENDER          13.0ms
OTHER            5.2ms

streaming / stages:
  chunkUpdate                  0.9ms
  terrainPrepare               0.5ms
  riverChannelSegmentsNear     0.1ms

Long frame #3:

[LONG FRAME] 181.5ms
simulate         4.0ms
render         176.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          169.0ms
STREAMING        0.0ms
NPC              0.7ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER           7.8ms
OTHER            3.2ms

---

[Seedvale Program Census]

Programs created: 133
Program count: final=133 max=133

By frame:
  frame 0   +77 programs   <== largest transition
  frame 47   +1 program
  frame 358   +1 program
  frame 387   +1 program
  frame 399   +2 programs
  frame 473   +1 program
  frame 478   +1 program
  frame 484   +1 program
  frame 610   +1 program
  frame 919   +1 program
  frame 2069   +19 programs
  frame 2116   +4 programs
  frame 2351   +23 programs

Largest transition — frame 0 (+77 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=387dc9b6-b4d1-4b7d-bceb-1b26673dfc8c (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b4e62940-c2fb-40bc-8041-eca2131e0887
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=e40a6d27-4438-4da0-add6-060623848447
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=28b40441-aba9-468f-a1d7-52f7344e047f
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=35e41063-61a2-4d04-a4ea-6f7e41f31d3d
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=216e1d0a-492f-496d-b206-b273e7d68b69
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1088a616-479e-4230-b619-ac113ad05d05
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=87a1b002-b3e9-401b-b72d-c05517dced13
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fd39522e-9a9d-4bac-a0dd-1377cdaf1a1d
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4e17fff4-5aa7-45a1-adbb-d241937e2ffb (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f2decc7a-241c-479e-a66d-dca5d5af70f2
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0f66b61c-2d9c-489f-866d-ca7a48081dc6 (Green)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9899963c-e7ae-4639-b05a-4ac1f35fd313 (Pink)
  #15 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1cea6d53-09e2-439d-8b5d-b938659ee4a4 (Flowers)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4b540ad5-2d3b-48ee-ac18-10d49649ff7d (Stone)
  #17 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d10c5ed0-2208-4f40-b457-63864c2eda17 (None)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=411be177-976a-42e7-9a73-0a0f1462d9da (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=186bb78b-69b2-427b-8272-565b1f570ce4 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5c5c53d3-bf1d-4eae-98a2-bdee1e34091e (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7f65d2c2-7bde-4cf7-b17f-5d75150bec3f (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=cb5ba3ed-31ca-4f8a-87c2-20a5ab64d5b7 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a7a36b33-7fa7-42e8-ae0d-14a9073d5e00 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=a1ac7c2d-912b-48e9-a882-314ba8bd232b (MI_WoodTrim)
  #26 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #27 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=92c39c98-1546-4e85-bcfb-31257bd12697 (MI_WindowGlass)
  #28 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #29 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3ef4070c-5fff-4488-a0c7-675c3c8d9083 (Main)
  #31 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5c13acfe-c2b2-491c-ad3f-d7f005457d33 (MapleTree_Leaves)
  #32 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b472b836-d906-4bf8-aa93-6f5c3a165d31 (Green)
  #33 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=17337543-0f64-4ff1-bf89-d63a61c43cc1 (MapleTree_Bark)
  #34 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5114cdab-159f-4fff-8a5b-a02a535b71de (MI_Peasant)
  #35 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8599bd1b-abba-4625-878c-f74b063800c1 (MI_Hair_1)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=410ffed0-6ed3-45ec-b825-2361d76cbabc (MI_Hair_1)
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=99f83b55 fHash=41e40a66 stage=postprocess-render
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=0352c8b4-479c-4d4a-8196-4197e0a42b61
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=7f9a9480-3d5d-4c5a-8860-809a1b91f1de (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=84ff534d-201d-41f6-9166-12f3dbe9cf7d (DarkGreen)
  #51 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=346c7eab-e012-425c-bf6a-a046156cae5b (Pond_Pack_MAT)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fa7eea5c-5ff1-4d7f-af5b-a1a592e8c435 (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=77f236a5-c735-45ac-82d2-de43b1ecda3a (MI_Eyes)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=70525ffd-3f70-49b8-9c34-dc92852068f9 (SV_MI_Peasant)
  #55 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=095c3652-1da9-417f-b34a-f331d5c4d1c3 (MI_Hair_1)
  #56 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ae5700fd-4d7a-4a2b-ab1d-a3473b751046 (PathRocks)
  #57 type=MeshStandardMaterial name='SV_apron' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=8af563d4 fHash=b83d9cc3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=31eda41c-5717-40a5-8cde-9f2193b78690 (SV_apron)
  #58 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=4418a548 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b6b0848c-b77f-41d2-bc89-793215c16d0b (SV_MI_Peasant)
  #59 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #72 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #73 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #74 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #75 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #76 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #28=df7c703d, #29=f92c8d8c, #59=279cec18, #60=84736a68, #61=aa2edbee, #62=7bae0bb2, #63=436caea4, #64=886438e7, #65=d99a5b29, #66=2003ced8, #67=28dfa407, #68=756a0b19, #69=b2354ff2, #70=ea82969e, #71=7dab8d9a, #72=378e1fb7, #73=78acf7ea, #74=a312c579, #75=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #28=236b3b0b, #29=87d053eb, #59=4d6bcede, #60=ffecb62a, #61=76ced00a, #62=fb55b3c0, #63=2d687ef1, #64=dc2a89b5, #65=109e33fc, #66=db0f470a, #67=9775cd0e, #68=5c741650, #69=2aad9943, #70=a2297d9f, #71=1022767b, #72=ce0bf6b4, #73=707f290c, #74=c05e2256, #75=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #28=(unset), #29=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown)
  MeshStandardMaterial (35 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=d3fd7a87, #15=e4cbf8ca, #16=a9733c9d, #17=6db98a06, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=12873951, #26=fc941d05, #27=e551c572, #30=fd8301ed, #31=d9d07622, #32=190d3a9c, #33=9dbe8ee7, #34=842fe1df, #35=ac268392, #36=1c179521, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=c3bc6325, #52=20daccfa, #53=1dcbc6ff, #54=1d0412b3, #55=ee59055a, #56=b643916d, #57=8af563d4, #58=4418a548
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=2eae9a54, #15=135696d3, #16=bd723c8a, #17=efed8e98, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=d4c95125, #26=3ab4c629, #27=2d1aa4a, #30=2f2885d5, #31=135696d3, #32=633146b4, #33=8dba9dd, #34=34995f15, #35=25a41317, #36=71f22dc6, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=ded4be89, #52=a8862f4a, #53=1a1c0d8, #54=512afd6f, #55=e8d88acf, #56=754b87bd, #57=b83d9cc3, #58=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=(unknown), #27=settlement, #30=fauna, #31=settlement, #32=settlement, #33=settlement, #34=other, #35=other, #36=other, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=other, #54=npc, #55=npc, #56=settlement, #57=npc, #58=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=(unset), #27=, #30=, #31=, #32=, #33=, #34=, #35=, #36=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=, #57=, #58=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0.45, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=(unknown), #27=0, #30=0, #31=0.45, #32=0, #33=0, #34=0, #35=0, #36=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=(unknown), #27=true, #30=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=true, #16=false, #17=true, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=true, #32=false, #33=true, #34=true, #35=true, #36=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=false, #58=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=true, #34=false, #35=false, #36=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=(unknown), #27=true, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=true, #35=true, #36=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=false, #55=false, #56=false, #57=false, #58=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false
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
  MeshDepthMaterial (11 programs):
    vertexShaderHash differs: #37=59ed5d71, #38=b69ba143, #39=2e7a6fcb, #40=585a1ea4, #41=c203b19a, #42=c203b19a, #43=585a1ea4, #44=263c45d6, #45=2efa42a8, #46=e4717b03, #47=99f83b55
    fragmentShaderHash differs: #37=d729897e, #38=d729897e, #39=758a4164, #40=41e40a66, #41=41e40a66, #42=a9dd0dee, #43=a9dd0dee, #44=d729897e, #45=41e40a66, #46=41e40a66, #47=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2069 (+19):
  Program #87
    material: MeshStandardMaterial ''
    materialUuid: e40a6d27-4438-4da0-add6-060623848447
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #88
    material: MeshStandardMaterial 'Wood'
    materialUuid: a6fa1905-502d-487e-8256-b61ca754beb5
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #89
    material: MeshStandardMaterial 'Green'
    materialUuid: aaa08795-d419-4450-89e9-6c44cf3b870a
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
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: 9c5b6edd-4f71-41bd-b9fe-408d9b05e286
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #91
    material: MeshStandardMaterial 'Green'
    materialUuid: 4db3cd55-e0a3-477d-b341-057dbcc55110
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
  Program #92
    material: MeshStandardMaterial 'BirchTree_Bark'
    materialUuid: 17337543-0f64-4ff1-bf89-d63a61c43cc1
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a920e788
    fragmentShaderHash: 3c40f72c
  Program #93
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: 1cea6d53-09e2-439d-8b5d-b938659ee4a4
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
  Program #94
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 239b5b1a-cd12-4d1b-b7b3-e6a250b3e70d
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #95
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 62c26721-8a68-47c5-bceb-bbf49eabeb75
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
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: a1ac7c2d-912b-48e9-a882-314ba8bd232b
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #97
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: fa7eea5c-5ff1-4d7f-af5b-a1a592e8c435
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #98
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 77f236a5-c735-45ac-82d2-de43b1ecda3a
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #99
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 5114cdab-159f-4fff-8a5b-a02a535b71de
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 8599bd1b-abba-4625-878c-f74b063800c1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 410ffed0-6ed3-45ec-b825-2361d76cbabc
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
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
    materialUuid: 92c39c98-1546-4e85-bcfb-31257bd12697
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a
  Program #104
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3d58bac9-5abb-412a-b3bf-2b3d9254af61
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 338ac55c
    fragmentShaderHash: 33d9f19
  Program #105
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: b6b0848c-b77f-41d2-bc89-793215c16d0b
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Wizard.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521827,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 6c2cf752
    fragmentShaderHash: ebeca779

Frame 2351 (+23):
  Program #110
    material: ShaderMaterial 'SkyShader'
    materialUuid: 387dc9b6-b4d1-4b7d-bceb-1b26673dfc8c
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #111
    material: ShaderMaterial ''
    materialUuid: 1088a616-479e-4230-b619-ac113ad05d05
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #112
    material: MeshStandardMaterial ''
    materialUuid: e40a6d27-4438-4da0-add6-060623848447
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #113
    material: MeshStandardMaterial 'Wood'
    materialUuid: a6fa1905-502d-487e-8256-b61ca754beb5
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #114
    material: MeshStandardMaterial 'Green'
    materialUuid: aaa08795-d419-4450-89e9-6c44cf3b870a
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
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: 9c5b6edd-4f71-41bd-b9fe-408d9b05e286
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: 4db3cd55-e0a3-477d-b341-057dbcc55110
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
  Program #117
    material: MeshStandardMaterial 'BirchTree_Bark'
    materialUuid: 17337543-0f64-4ff1-bf89-d63a61c43cc1
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a282481e
    fragmentShaderHash: 21c5c77d
  Program #118
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: 1cea6d53-09e2-439d-8b5d-b938659ee4a4
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
  Program #119
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 239b5b1a-cd12-4d1b-b7b3-e6a250b3e70d
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #120
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 62c26721-8a68-47c5-bceb-bbf49eabeb75
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
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: fa7eea5c-5ff1-4d7f-af5b-a1a592e8c435
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #122
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 77f236a5-c735-45ac-82d2-de43b1ecda3a
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #123
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 5114cdab-159f-4fff-8a5b-a02a535b71de
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 8599bd1b-abba-4625-878c-f74b063800c1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #125
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 410ffed0-6ed3-45ec-b825-2361d76cbabc
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #126
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3d58bac9-5abb-412a-b3bf-2b3d9254af61
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee59055a
    fragmentShaderHash: d88267ca
  Program #127
    material: MeshStandardMaterial 'SV_MI_Peasant'
    materialUuid: b6b0848c-b77f-41d2-bc89-793215c16d0b
    object: SkinnedMesh 'EQ_PeasantSkirt'
    asset: /assets/characters/Female_Wizard.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522851,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 4418a548
    fragmentShaderHash: c52436ea
  Program #128
    material: ShaderMaterial ''
    materialUuid: 216e1d0a-492f-496d-b206-b273e7d68b69
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #129
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #130
    material: MeshBasicMaterial ''
    materialUuid: fd39522e-9a9d-4bac-a0dd-1377cdaf1a1d
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #131
    material: ShaderMaterial ''
    materialUuid: 753edbd1-4b19-4e2f-ba6b-bd821954c3bc
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #132
    material: ShaderMaterial ''
    materialUuid: 9b9f0e7c-65c6-4353-ae1d-d4850aaf2261
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
Excluded — no reliable per-program timing: 125 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 47
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 20.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 358
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 27.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 387
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 26.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 473
  #82
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 188.8 ms  (upper bound — whole mirror-render call, see note above)

Frame 478
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 17.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 484
  #84
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 191.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 610
  #85
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 19.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 919
  #86
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 167.8 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 659.6 ms
  programs >1 ms: 8
  max: 191.0 ms (#84)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=7.3 ms  p95=8.0 ms  max=8.3 ms  Δavg vs baseline=—
  hide-grass           avg=6.9 ms  p95=7.5 ms  max=8.1 ms  Δavg vs baseline=-0.4 ms (-5%)
  hide-vegetation      avg=6.2 ms  p95=7.0 ms  max=7.1 ms  Δavg vs baseline=-1.1 ms (-15%)
  no vegetation/grass  avg=6.1 ms  p95=6.8 ms  max=7.2 ms  Δavg vs baseline=-1.1 ms (-16%)
  hide-environment     avg=6.9 ms  p95=7.6 ms  max=7.8 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-settlement      avg=6.5 ms  p95=7.1 ms  max=7.3 ms  Δavg vs baseline=-0.8 ms (-10%)
  no water             avg=7.0 ms  p95=7.7 ms  max=7.9 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-terrain         avg=6.9 ms  p95=7.6 ms  max=7.8 ms  Δavg vs baseline=-0.4 ms (-6%)
  hide-npc-fauna       avg=5.1 ms  p95=5.9 ms  max=6.1 ms  Δavg vs baseline=-2.1 ms (-29%)
  no-shadows           avg=7.1 ms  p95=7.5 ms  max=17.6 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-ao                avg=6.9 ms  p95=7.7 ms  max=8.2 ms  Δavg vs baseline=-0.4 ms (-5%)
  no-bloom             avg=7.0 ms  p95=7.9 ms  max=8.1 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-smaa              avg=7.5 ms  p95=8.3 ms  max=8.6 ms  Δavg vs baseline=+0.2 ms (+3%)
  no-god-rays          avg=7.0 ms  p95=7.7 ms  max=10.4 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-film-grade        avg=6.9 ms  p95=7.6 ms  max=8.0 ms  Δavg vs baseline=-0.4 ms (-5%)
  no postprocessing    avg=6.7 ms  p95=7.7 ms  max=8.0 ms  Δavg vs baseline=-0.6 ms (-8%)
  no mirrors           avg=7.0 ms  p95=7.7 ms  max=8.1 ms  Δavg vs baseline=-0.3 ms (-4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=12.4 ms  p95=14.0 ms  max=15.3 ms
  CPU wall      avg=7.3 ms  p95=8.0 ms  max=8.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
