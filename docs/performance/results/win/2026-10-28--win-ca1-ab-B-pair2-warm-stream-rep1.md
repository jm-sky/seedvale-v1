# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:35:19.610Z
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
Frames: 1432
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-34-34-020Z-ks5wd6
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
  populationGate: stable waited=5032ms npc=20
  gpuTimer: available=true resolved=true samples=1440 span=postprocess+labels

FPS:
  avg: 61.1
  min: 12
  p1: 17

Frame time (wall-clock):
  avg: 16.4 ms
  p50: 14.9 ms
  p95: 26.1 ms
  p99: 58.9 ms
  max: 85.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.5 p95=8.5 p99=39.1 max=71.4 n=1432
  render: p50=10.8 p95=18.4 p99=24.3 max=62.3 n=1432
  frame: p50=14.9 p95=26.1 p99=58.9 max=85.4 n=1432

Rendering (combined renderer.info):
  draw calls: 884 avg / 2039 max
  triangles: 10.80M avg
  mirror draws: 157 avg
  geometries: 751
  textures: 635

Pass submissions (actual):
  reliability: observed
  frames: 1441 shadowRefresh=635 shadowSkipped=806
  mirror calls avg: 156
  shadow calls avg: 307
  main calls avg: 576

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
  other            draws=220 tris=25.9k meshes=220 inst=220

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=184 tris=1.29M meshes=184 inst=822
  environment      draws=127 tris=26.2k meshes=127 inst=143
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=99 tris=14.6k meshes=99 inst=99

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
  WATER          2.1 ms
  STREAMING      0.6 ms
  NPC            1.3 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         9.3 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  WATER: 3
  STREAMING: 2

Hitches (>= 8 ms): total=5
  chunk mesh             n=2 avg=10.4 max=12.7
  chunk water            n=3 avg=8.8 max=9.8

Isolation probes:
  full               render=6.1 ms draws=300 tris=6.21M
  hide-grass         render=5.9 ms draws=268 tris=5.07M
  hide-vegetation    render=5.2 ms draws=164 tris=4.40M
  hide-vegetation-grass render=4.9 ms draws=135 tris=3.34M
  hide-environment   render=5.9 ms draws=279 tris=6.19M
  hide-settlement    render=5.6 ms draws=275 tris=6.10M
  hide-water         render=6.0 ms draws=277 tris=5.11M
  hide-terrain       render=5.6 ms draws=269 tris=3.89M
  hide-npc-fauna     render=5.4 ms draws=296 tris=6.14M
  no-shadows         render=5.9 ms draws=286 tris=5.90M
  no-ao              render=5.8 ms draws=285 tris=6.08M
  no-bloom           render=5.9 ms draws=287 tris=6.21M
  no-smaa            render=6.1 ms draws=297 tris=6.21M
  no-god-rays        render=6.0 ms draws=297 tris=6.13M
  no-film-grade      render=6.2 ms draws=300 tris=6.21M
  no-postprocessing  render=5.6 ms draws=277 tris=6.21M
  no-reflections     render=6.0 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 85.4 ms
  largest labelled hitch: 12.7 ms
  unattributed: 72.7 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 85.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1432/1432

Recommendation:
Largest frame (85.4 ms) is not explained by labelled hitches (largest 12.7 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (7.3 ms cumulative)
  agent updates: 0.8 ms/frame (1091.2 ms cumulative)
  livestock: 0.2 ms/frame (333.8 ms cumulative)
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
    dog updates/frame: 3.0
    dog guard scans: 3.0/frame (23.8 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 3.9/frame (0.0 candidates/frame)
    water samples: 5.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 5.9/frame, 0.00 ms/frame (worst call 0.20 ms, 414.5 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 14.6
    behaviour executions/frame: 3.9
    presentation executions/frame: 3.4
  rats: 0.1 ms/frame (122.1 ms cumulative)
  social: 0.0 ms/frame (2.7 ms cumulative)
  streaming: 0.1 ms/frame (110.6 ms cumulative)
  maintenance: 0.1 ms/frame (146.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (1839.8 ms cumulative)
  forest sampling: 0.1 ms/frame (108.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (22.4 ms cumulative)
    targeting: 0.0 ms/frame (18.5 ms cumulative)
    decision: 0.0 ms/frame (13.7 ms cumulative)
    behaviour: 0.8 ms/frame (1161.2 ms cumulative)
    life/presentation: 0.3 ms/frame (406.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.6
    decision passes/frame: 29.6
    high-priority agents/frame: 0.2
    expensive behaviour agents/frame: 14.9
    full-rate agents/frame: 9.3
    reduced-cadence agents/frame: 20.3
    behaviour executions/frame: 15.1
    presentation executions/frame: 14.0

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 23.3
    village scan candidates/frame: 278.7
    player perception checks/frame: 29.6

  nearest scans: 19.6/frame (28043 calls)
  nearest candidates checked: 113.9/frame (163152 total)
  herd leader scans: 0.1/frame (95 calls)
  herd candidates checked: 2.0/frame (2850 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.6/frame (120.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 67.5/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 67.5/frame, 0.00 ms/frame (worst call 0.70 ms, 2818.8 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 77
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.13 ms
    max 0.30 ms

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
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.29 ms
    max 0.70 ms

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
    allocation/setup avg/max: 0.04 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.73 / 5.50 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

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
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=26 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1441
Shadow refresh frames: 635
Shadow skipped frames: 806

Mirror:
  calls avg: 156  tris avg: 882114
  info calls avg: 156  residual calls avg: 0
  environment                  calls=4 tris=3766
  items                        calls=1 tris=527
  other                        calls=33 tris=4869
  settlement:decor             calls=8 tris=19896
  settlement:fence             calls=1 tris=2229
  settlement:fireCampfire      calls=2 tris=191
  settlement:fireHouseExteriorLamp calls=5 tris=249
  settlement:fireHouseInteriorLamp calls=2 tris=187
  settlement:fireVillageTorch  calls=7 tris=518
  settlement:houseInteractive  calls=5 tris=572
  settlement:houseStatic       calls=12 tris=10888
  settlement:landmarkGarden    calls=2 tris=23767
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=702
  settlement:landmarkWellHousehold calls=2 tris=2201
  settlement:landmarkWellPasture calls=2 tris=610
  settlement:other             calls=4 tris=67
  settlement:storageBarrel     calls=3 tris=4080
  settlement:storageContainer  calls=10 tris=748
  settlement:storageGoods      calls=14 tris=2795
  settlement:storageHay        calls=0 tris=184
  settlement:storageTrough     calls=2 tris=497
  settlement:storageWoodHousehold calls=1 tris=1686
  settlement:storageWoodSettlementPrimary calls=0 tris=305
  settlement:workplace         calls=3 tris=1390
  terrain                      calls=6 tris=410395
  vegetation                   calls=24 tris=388949

Shadow (refresh only):
  calls avg: 307  tris avg: 2260134
  info calls avg: 307  residual calls avg: 0
  environment                  calls=11 tris=5591
  faunaFamily:boar             calls=3 tris=1454
  faunaFamily:cow              calls=2 tris=779
  faunaFamily:duck             calls=1 tris=29
  faunaFamily:fox              calls=1 tris=329
  faunaFamily:horse            calls=2 tris=474
  faunaFamily:rabbit           calls=1 tris=747
  faunaFamily:rat              calls=1 tris=1021
  faunaFamily:sheep            calls=0 tris=62
  faunaFamily:stag             calls=6 tris=3924
  items                        calls=4 tris=2113
  npcFamily:Knight_Cloth       calls=3 tris=3714
  npcFamily:Peasant            calls=3 tris=3342
  npcFamily:Peasant_Boots      calls=1 tris=1173
  npcFamily:woodcutter         calls=1 tris=1039
  other                        calls=51 tris=11311
  settlement:decor             calls=105 tris=210464
  settlement:fireHouseInteriorLamp calls=1 tris=124
  settlement:houseInteractive  calls=2 tris=370
  settlement:houseStatic       calls=15 tris=6892
  settlement:landmarkGarden    calls=1 tris=483
  settlement:landmarkNoticeBoard calls=1 tris=23
  settlement:landmarkWellCentral calls=3 tris=1127
  settlement:other             calls=4 tris=78
  settlement:storageContainer  calls=5 tris=526
  settlement:storageHay        calls=1 tris=280
  settlement:storageTrough     calls=1 tris=280
  settlement:storageWoodHousehold calls=1 tris=1098
  settlement:storageWoodSettlementPrimary calls=1 tris=447
  settlement:workplace         calls=2 tris=2118
  terrain                      calls=19 tris=1363867
  vegetation                   calls=55 tris=634855

Main:
  calls avg: 576  tris avg: 8900144
  info calls avg: 725  residual calls avg: 0
  environment                  calls=50 tris=13138
  faunaFamily:bear             calls=1 tris=659
  faunaFamily:chicken          calls=6 tris=811
  faunaFamily:cow              calls=1 tris=194
  faunaFamily:dog              calls=11 tris=3875
  faunaFamily:horse            calls=0 tris=83
  faunaFamily:rabbit           calls=0 tris=211
  faunaFamily:rat              calls=2 tris=3019
  faunaFamily:sheep            calls=4 tris=1271
  faunaFamily:stag             calls=1 tris=809
  faunaFamily:wolf             calls=2 tris=885
  grass                        calls=38 tris=5612441
  items                        calls=48 tris=5473
  npcFamily:Farmer             calls=8 tris=11229
  npcFamily:Knight_Cloth       calls=6 tris=7569
  npcFamily:Peasant            calls=37 tris=44948
  npcFamily:Peasant_Boots      calls=6 tris=8108
  npcFamily:blacksmith         calls=7 tris=9545
  other                        calls=86 tris=14679
  settlement:decor             calls=14 tris=35786
  settlement:fence             calls=3 tris=4533
  settlement:fireCampfire      calls=5 tris=383
  settlement:fireHouseExteriorLamp calls=11 tris=506
  settlement:fireHouseInteriorLamp calls=4 tris=381
  settlement:fireVillageTorch  calls=15 tris=1054
  settlement:houseInteractive  calls=11 tris=1166
  settlement:houseStatic       calls=22 tris=20225
  settlement:landmarkGarden    calls=5 tris=47130
  settlement:landmarkNoticeBoard calls=2 tris=29
  settlement:landmarkWellCentral calls=4 tris=1475
  settlement:landmarkWellHousehold calls=5 tris=4453
  settlement:landmarkWellPasture calls=3 tris=1241
  settlement:other             calls=7 tris=135
  settlement:storageBarrel     calls=5 tris=8258
  settlement:storageContainer  calls=21 tris=1517
  settlement:storageGoods      calls=28 tris=5723
  settlement:storageHay        calls=1 tris=364
  settlement:storageTrough     calls=3 tris=1012
  settlement:storageWoodHousehold calls=1 tris=3431
  settlement:storageWoodSettlementPrimary calls=1 tris=608
  settlement:workplace         calls=6 tris=2872
  terrain                      calls=24 tris=1743944
  vegetation                   calls=56 tris=811869
  water                        calls=7 tris=463453


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 85.4ms
simulate        71.4ms
render          13.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.0ms
STREAMING       64.6ms
NPC              0.9ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER           9.7ms
OTHER            5.4ms

streaming / stages:
  chunkUpdate                  64.6ms
  riverTileBuild               56.6ms
  terrainPrepare               1.6ms
  riverChannelSegmentsNear     0.4ms

Long frame #2:

[LONG FRAME] 85ms
simulate        55.2ms
render          28.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           15.5ms
STREAMING       49.8ms
NPC              1.4ms
FAUNA            0.7ms
PHYSICS          0.0ms
RENDER          13.3ms
OTHER            4.3ms

streaming / stages:
  chunkUpdate                  49.8ms
  riverTileBuild               45.1ms
  terrainPrepare               1.2ms
  riverChannelSegmentsNear     0.3ms

---

[Seedvale Program Census]

Programs created: 127
Program count: final=126 max=126

By frame:
  frame 0   +72 programs   <== largest transition
  frame 6   +2 programs
  frame 53   +1 program
  frame 430   +2 programs
  frame 459   +1 program
  frame 517   +1 program
  frame 531   +1 program
  frame 992   +1 program
  frame 1118   +1 program
  frame 2198   +15 programs
  frame 2199   +3 programs
  frame 2245   +5 programs
  frame 2479   +22 programs

Largest transition — frame 0 (+72 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3df27ce7-b288-4c9c-8bd2-88d3920cfd45 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=58b8f18b-cc94-4adf-8aed-3a65d074d8cd
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=6a672c97-af90-474c-b1e7-4a8fcb648dfc
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ee216c88-0396-4e3e-aaf9-4542620d2802
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f7aaa116-d1c1-48e3-981d-222851ec46a6
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=950ede2b-3452-4cb3-bedc-32430f9880fa
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=87d9b464-3b07-44eb-835d-d1cab0456f3d
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=01dfe449-a73a-4745-aa12-937815a92fdf
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fcc6cdc3-00e0-46f8-8561-f6b5f4f895ba
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ba540037-96a9-4b4c-91cf-65f73363a3b0 (Wood)
  #10 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=58743bd1-a48f-4a97-9f98-670a42f3457d (Green)
  #11 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fced7103-e5ec-43e5-bca9-84e08a818285 (Pink)
  #12 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9d6ed2bd-87d9-4a53-ad06-2aab1515f613 (Stone)
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f37a08ae-e9ea-47e3-aafa-3db3786fda4a (Flowers)
  #14 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4e29335e-db96-4da3-8f82-70dea7aa2e90 (None)
  #15 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=41206a83-2139-4fd8-aa1c-7a314c746dec (Wood)
  #16 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=841241a1-bfd6-4837-a5a3-4de41c85258c (MI_WoodTrim)
  #17 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #18 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=af66fcbb-522e-46d1-9888-52ceddf7bc8e (MI_WindowGlass)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=9fd7ae3c-f4b3-4b8e-94b6-72a15b12d00d (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6f6aaca7-44cd-4648-863e-8cd8770d1e2e (MI_WindowGlass)
  #22 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #23 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #24 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dee7248a-56ef-47c9-b45e-954eb88de151 (Main)
  #25 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9cdafdf9-c5cd-48f5-83de-b3ca78cf1b7a (MapleTree_Leaves)
  #26 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=40d03301-3c40-4ac4-8f4a-b9aaba53c707 (Green)
  #27 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=066ae5ed-9b0a-437c-9ec0-fc91fdb671a3 (MapleTree_Bark)
  #28 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=87b48d24-795e-4f2a-8e6b-99c354e639dd (Handle)
  #29 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bdeb63fe-e29b-4beb-b1b2-d21502650e19 (PathRocks)
  #30 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=49d3ca8e fHash=baf2480 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f303f068-5450-4fb4-8d5e-49615dfc9dbf (MI_Peasant)
  #31 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f272b171-db48-40bb-a735-d2d27f59a585 (MI_Hair_1)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=17abef16-f821-4551-898e-6a66d69d5c09 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fb5829c1-36b1-4302-8738-a5bf9cf3b5a1 (MI_Knight)
  #34 type=MeshStandardMaterial name='SV_Male_Woodcutter_Palette' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c3c87c97 fHash=ee809a5f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d1079428-f86e-4802-91c8-58f375abf294 (SV_Male_Woodcutter_Palette)
  #35 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #36 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1e4387ac-0866-4430-8570-f11293563ce6 (MI_Peasant)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=16988e1a-eccd-4be4-8ae9-94b672a972f1 (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4c5e5e94-c7d6-4ec8-8a13-c75ab7ee1df6 (MI_Hair_1)
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
      material=32bfe15f-c8b0-44be-a6e6-e6473aae8c24 (stockpiles_vc)
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=7ac2cd4b-fdd2-4140-9c7a-e236b39eb26a
  #53 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=72904db3 fHash=bc151936 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d48a45e3-dae6-4a12-8a98-b320470843e2 (BlackBear_mat)
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
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #10=c0d790d1, #11=d3fd7a87, #12=a9733c9d, #13=e4cbf8ca, #14=6db98a06, #15=f3a1039e, #16=c5e73b05, #17=13a74ec7, #18=9dcf1cb4, #19=12873951, #20=fc941d05, #21=e551c572, #24=fd8301ed, #25=d9d07622, #26=190d3a9c, #27=9dbe8ee7, #28=88cdd138, #29=b643916d, #30=49d3ca8e, #31=c8a982c1, #32=ee59055a, #33=140c5e62, #34=c3c87c97, #36=842fe1df, #37=ac268392, #38=1c179521, #51=a64d124e, #52=94297e69, #53=72904db3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #10=a81023c3, #11=2eae9a54, #12=bd723c8a, #13=135696d3, #14=efed8e98, #15=c7daf23, #16=d4c95125, #17=3ab4c629, #18=2d1aa4a, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #24=2f2885d5, #25=135696d3, #26=633146b4, #27=8dba9dd, #28=f2ad9521, #29=754b87bd, #30=baf2480, #31=8ab73626, #32=e8d88acf, #33=46d4b31c, #34=ee809a5f, #36=34995f15, #37=25a41317, #38=71f22dc6, #51=546e469, #52=aa0735a8, #53=bc151936
    bucket differs: #2=terrain, #7=other, #9=other, #10=vegetation, #11=vegetation, #12=environment, #13=vegetation, #14=environment, #15=settlement, #16=settlement, #17=(unknown), #18=settlement, #19=settlement, #20=(unknown), #21=settlement, #24=fauna, #25=settlement, #26=settlement, #27=settlement, #28=settlement, #29=settlement, #30=npc, #31=npc, #32=npc, #33=npc, #34=npc, #36=other, #37=other, #38=other, #51=settlement, #52=other, #53=fauna
    define STANDARD differs: #2=, #7=, #9=, #10=, #11=, #12=, #13=, #14=, #15=, #16=, #17=(unset), #18=, #19=, #20=(unset), #21=, #24=, #25=, #26=, #27=, #28=, #29=, #30=, #31=, #32=, #33=, #34=, #36=, #37=, #38=, #51=, #52=, #53=
    flag alphaTest differs: #2=0, #7=0, #9=0, #10=0, #11=0, #12=0, #13=0.45, #14=0, #15=0, #16=0, #17=(unknown), #18=0, #19=0, #20=(unknown), #21=0, #24=0, #25=0.45, #26=0, #27=0, #28=0, #29=0, #30=0, #31=0, #32=0, #33=0, #34=0, #36=0, #37=0, #38=0, #51=0, #52=0, #53=0
    flag envMap differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
    flag flatShading differs: #2=false, #7=true, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=true, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=true, #53=false
    flag fog differs: #2=true, #7=true, #9=true, #10=true, #11=true, #12=true, #13=true, #14=true, #15=true, #16=true, #17=(unknown), #18=true, #19=true, #20=(unknown), #21=true, #24=true, #25=true, #26=true, #27=true, #28=true, #29=true, #30=true, #31=true, #32=true, #33=true, #34=true, #36=true, #37=true, #38=true, #51=true, #52=true, #53=true
    flag map differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=true, #14=true, #15=false, #16=true, #17=(unknown), #18=false, #19=true, #20=(unknown), #21=false, #24=false, #25=true, #26=false, #27=true, #28=false, #29=true, #30=true, #31=true, #32=true, #33=true, #34=false, #36=true, #37=true, #38=true, #51=false, #52=false, #53=true
    flag normalMap differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=true, #17=(unknown), #18=false, #19=true, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=true, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
    flag transparent differs: #2=false, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=true, #19=false, #20=(unknown), #21=true, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #32=false, #33=false, #34=false, #36=false, #37=false, #38=false, #51=false, #52=false, #53=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=false, #17=(unknown), #18=false, #19=false, #20=(unknown), #21=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=true, #31=true, #32=false, #33=false, #34=false, #36=true, #37=true, #38=false, #51=true, #52=false, #53=false
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



Frame 2198 (+15):
  Program #82
    material: MeshStandardMaterial ''
    materialUuid: 6a672c97-af90-474c-b1e7-4a8fcb648dfc
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #83
    material: MeshStandardMaterial 'Wood'
    materialUuid: 53161a45-7568-411c-9a56-7ded4f745e8c
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #84
    material: MeshStandardMaterial 'Green'
    materialUuid: 411ca9c9-4647-4afa-b16d-4752d0546133
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
    materialUuid: be311b42-66f3-4b85-895b-d8609a9a3dae
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
    materialUuid: 4d1d97d8-6a7e-41db-8422-5b8ada3578e4
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #87
    material: MeshStandardMaterial 'BirchTree_Bark'
    materialUuid: 066ae5ed-9b0a-437c-9ec0-fc91fdb671a3
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a920e788
    fragmentShaderHash: 3c40f72c
  Program #88
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: f37a08ae-e9ea-47e3-aafa-3db3786fda4a
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
  Program #89
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 36016a32-37f3-4f54-b2a2-a5bd73759543
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #90
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 1a45860c-bc00-4ac8-a53f-bd30b392f4c9
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
    materialUuid: 32bfe15f-c8b0-44be-a6e6-e6473aae8c24
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #92
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 40678dcd-54dc-447b-b433-4f0e164d763d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #93
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: ef8ad467-ff11-49dc-9d7a-27ec0cd2f30f
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #94
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 1e4387ac-0866-4430-8570-f11293563ce6
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #95
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 16988e1a-eccd-4be4-8ae9-94b672a972f1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #96
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 4c5e5e94-c7d6-4ec8-8a13-c75ab7ee1df6
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 2479 (+22):
  Program #105
    material: ShaderMaterial 'SkyShader'
    materialUuid: 3df27ce7-b288-4c9c-8bd2-88d3920cfd45
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #106
    material: ShaderMaterial ''
    materialUuid: 87d9b464-3b07-44eb-835d-d1cab0456f3d
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #107
    material: MeshStandardMaterial ''
    materialUuid: 6a672c97-af90-474c-b1e7-4a8fcb648dfc
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #108
    material: MeshStandardMaterial 'Wood'
    materialUuid: 53161a45-7568-411c-9a56-7ded4f745e8c
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #109
    material: MeshStandardMaterial 'Green'
    materialUuid: 411ca9c9-4647-4afa-b16d-4752d0546133
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
    materialUuid: be311b42-66f3-4b85-895b-d8609a9a3dae
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
    materialUuid: 4d1d97d8-6a7e-41db-8422-5b8ada3578e4
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #112
    material: MeshStandardMaterial 'BirchTree_Bark'
    materialUuid: 066ae5ed-9b0a-437c-9ec0-fc91fdb671a3
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a282481e
    fragmentShaderHash: 21c5c77d
  Program #113
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: f37a08ae-e9ea-47e3-aafa-3db3786fda4a
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
  Program #114
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 36016a32-37f3-4f54-b2a2-a5bd73759543
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #115
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 1a45860c-bc00-4ac8-a53f-bd30b392f4c9
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
    materialUuid: 32bfe15f-c8b0-44be-a6e6-e6473aae8c24
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #117
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 40678dcd-54dc-447b-b433-4f0e164d763d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #118
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: ef8ad467-ff11-49dc-9d7a-27ec0cd2f30f
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #119
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 1e4387ac-0866-4430-8570-f11293563ce6
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #120
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 16988e1a-eccd-4be4-8ae9-94b672a972f1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #121
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 4c5e5e94-c7d6-4ec8-8a13-c75ab7ee1df6
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #122
    material: ShaderMaterial ''
    materialUuid: 950ede2b-3452-4cb3-bedc-32430f9880fa
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
    materialUuid: fcc6cdc3-00e0-46f8-8561-f6b5f4f895ba
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #125
    material: ShaderMaterial ''
    materialUuid: 779047c2-7040-4d84-8cee-8196409632c8
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #126
    material: ShaderMaterial ''
    materialUuid: 814f2c57-2749-437c-97bf-15641552c57b
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

Frame 53
  #74
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 11.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 459
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 30.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 517
  #78
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 13.9 ms  (upper bound — whole mirror-render call, see note above)

Frame 531
  #79
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 11.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 992
  #80
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 52.0 ms  (upper bound — whole mirror-render call, see note above)

Frame 1118
  #81
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 54.5 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 173.9 ms
  programs >1 ms: 6
  max: 54.5 ms (#81)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.1 ms  p95=6.9 ms  max=7.0 ms  Δavg vs baseline=—
  hide-grass           avg=5.9 ms  p95=7.0 ms  max=7.1 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-vegetation      avg=5.2 ms  p95=6.3 ms  max=7.1 ms  Δavg vs baseline=-0.9 ms (-15%)
  no vegetation/grass  avg=4.9 ms  p95=5.9 ms  max=6.5 ms  Δavg vs baseline=-1.1 ms (-19%)
  hide-environment     avg=5.9 ms  p95=6.6 ms  max=7.3 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-settlement      avg=5.6 ms  p95=6.3 ms  max=6.9 ms  Δavg vs baseline=-0.5 ms (-9%)
  no water             avg=6.0 ms  p95=7.2 ms  max=8.3 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=5.6 ms  p95=6.3 ms  max=6.4 ms  Δavg vs baseline=-0.5 ms (-8%)
  hide-npc-fauna       avg=5.4 ms  p95=6.1 ms  max=7.4 ms  Δavg vs baseline=-0.7 ms (-11%)
  no-shadows           avg=5.9 ms  p95=6.5 ms  max=7.1 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-ao                avg=5.8 ms  p95=6.8 ms  max=7.9 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-bloom             avg=5.9 ms  p95=6.8 ms  max=7.5 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-smaa              avg=6.1 ms  p95=7.5 ms  max=8.8 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-god-rays          avg=6.0 ms  p95=7.1 ms  max=8.0 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-film-grade        avg=6.2 ms  p95=7.7 ms  max=8.6 ms  Δavg vs baseline=+0.2 ms (+3%)
  no postprocessing    avg=5.6 ms  p95=6.3 ms  max=7.2 ms  Δavg vs baseline=-0.5 ms (-8%)
  no mirrors           avg=6.0 ms  p95=7.0 ms  max=7.2 ms  Δavg vs baseline=-0.1 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=12.5 ms  p95=14.4 ms  max=15.8 ms
  CPU wall      avg=6.1 ms  p95=6.9 ms  max=7.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
