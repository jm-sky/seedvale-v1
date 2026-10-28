# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:51:10.423Z
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
Frames: 1431
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d7ddb33720d54ece4e216ee27ed1e7ffa968a234
  runId: 2026-10-28T22-50-25-507Z-bslw8j
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
  camera: pos=(427.4, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5203ms npc=20
  gpuTimer: available=true resolved=true samples=1438 span=postprocess+labels

FPS:
  avg: 60.6
  min: 11
  p1: 16

Frame time (wall-clock):
  avg: 16.5 ms
  p50: 14.5 ms
  p95: 28.1 ms
  p99: 61.5 ms
  max: 92.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.6 p95=8.8 p99=46.9 max=66.5 n=1431
  render: p50=10.3 p95=18.7 p99=25.9 max=60.9 n=1431
  frame: p50=14.5 p95=28.1 p99=61.5 max=92.4 n=1431

Rendering (combined renderer.info):
  draw calls: 878 avg / 2029 max
  triangles: 10.74M avg
  mirror draws: 158 avg
  geometries: 752
  textures: 584

Pass submissions (actual):
  reliability: observed
  frames: 1441 shadowRefresh=560 shadowSkipped=881
  mirror calls avg: 157
  shadow calls avg: 309
  main calls avg: 582

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=56 tris=1.14M meshes=56 inst=117872
  vegetation       draws=205 tris=1.37M meshes=205 inst=871
  environment      draws=128 tris=26.2k meshes=128 inst=144
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=353 tris=30.2k meshes=353 inst=353
  other            draws=223 tris=26.2k meshes=223 inst=223

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=189 tris=1.32M meshes=189 inst=843
  environment      draws=127 tris=26.2k meshes=127 inst=143
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=42 tris=23.7k meshes=42 inst=42
  other            draws=101 tris=14.8k meshes=101 inst=101

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
  WATER          2.1 ms
  STREAMING      0.5 ms
  NPC            1.4 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         9.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  WATER: 1
  STREAMING: 1

Hitches (>= 8 ms): total=2
  chunk mesh             n=1 avg=10.9 max=10.9
  chunk water            n=1 avg=8.3 max=8.3

Isolation probes:
  full               render=6.1 ms draws=299 tris=6.21M
  hide-grass         render=5.9 ms draws=263 tris=5.00M
  hide-vegetation    render=5.4 ms draws=161 tris=4.37M
  hide-vegetation-grass render=5.0 ms draws=135 tris=3.34M
  hide-environment   render=5.8 ms draws=278 tris=6.19M
  hide-settlement    render=5.5 ms draws=267 tris=5.97M
  hide-water         render=6.0 ms draws=273 tris=5.03M
  hide-terrain       render=5.7 ms draws=268 tris=3.89M
  hide-npc-fauna     render=5.3 ms draws=299 tris=6.21M
  no-shadows         render=5.9 ms draws=285 tris=5.90M
  no-ao              render=5.9 ms draws=293 tris=6.21M
  no-bloom           render=6.0 ms draws=282 tris=6.14M
  no-smaa            render=5.9 ms draws=296 tris=6.21M
  no-god-rays        render=6.0 ms draws=296 tris=6.13M
  no-film-grade      render=6.1 ms draws=299 tris=6.21M
  no-postprocessing  render=5.9 ms draws=276 tris=6.21M
  no-reflections     render=6.2 ms draws=229 tris=5.22M

Frame attribution:
  frame max: 92.4 ms
  largest labelled hitch: 10.9 ms
  unattributed: 81.5 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 92.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1431/1431

Recommendation:
Largest frame (92.4 ms) is not explained by labelled hitches (largest 10.9 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (9.2 ms cumulative)
  agent updates: 0.8 ms/frame (1147.9 ms cumulative)
  livestock: 0.3 ms/frame (401.3 ms cumulative)
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
    dog updates/frame: 3.6
    dog guard scans: 3.6/frame (28.5 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.2/frame (0.0 candidates/frame)
    water samples: 7.9/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 7.9/frame, 0.00 ms/frame (worst call 0.90 ms, 532.6 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 16.1
    behaviour executions/frame: 4.2
    presentation executions/frame: 3.6
  rats: 0.1 ms/frame (138.8 ms cumulative)
  social: 0.0 ms/frame (5.1 ms cumulative)
  streaming: 0.1 ms/frame (115.2 ms cumulative)
  maintenance: 0.1 ms/frame (147.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.5 ms/frame (2132.9 ms cumulative)
  forest sampling: 0.1 ms/frame (113.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.6 ms cumulative)
    targeting: 0.0 ms/frame (20.2 ms cumulative)
    decision: 0.0 ms/frame (18.9 ms cumulative)
    behaviour: 1.0 ms/frame (1441.9 ms cumulative)
    life/presentation: 0.3 ms/frame (398.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 27.3
    decision passes/frame: 27.3
    high-priority agents/frame: 1.2
    expensive behaviour agents/frame: 13.0
    full-rate agents/frame: 9.1
    reduced-cadence agents/frame: 18.2
    behaviour executions/frame: 14.2
    presentation executions/frame: 13.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 26.8
    village scan candidates/frame: 326.9
    player perception checks/frame: 27.3

  nearest scans: 18.4/frame (26303 calls)
  nearest candidates checked: 121.5/frame (173822 total)
  herd leader scans: 0.0/frame (64 calls)
  herd candidates checked: 1.3/frame (1920 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.5/frame (103.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 34.7/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 34.7/frame, 0.00 ms/frame (worst call 0.70 ms, 1766.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.16 ms
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
    avg 0.03 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.30 ms
    max 0.80 ms

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
    allocation/setup avg/max: 0.04 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.02 / 0.20 ms
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

Chunks resident: 14
Resident instances: full=599200 filler=1274812
Submitted instances: full=80396 filler=37465
Meshes submitted: 45
LOD submitted fraction: full=0.13417222963951936 filler=0.02938864711031901
Flowers: unavailable
Allocation bytes (estimated): 179905152
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=34 discard(unload=0,oor=0) cancel=0 streamIn=18 streamOut=25 invalidate=0
Finalization: observed completions=34

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1441
Shadow refresh frames: 560
Shadow skipped frames: 881

Mirror:
  calls avg: 157  tris avg: 872713
  info calls avg: 157  residual calls avg: 0
  environment                  calls=4 tris=3817
  items                        calls=1 tris=525
  other                        calls=33 tris=4849
  settlement:decor             calls=8 tris=19995
  settlement:fence             calls=2 tris=2328
  settlement:fireCampfire      calls=2 tris=191
  settlement:fireHouseExteriorLamp calls=5 tris=250
  settlement:fireHouseInteriorLamp calls=2 tris=188
  settlement:fireVillageTorch  calls=7 tris=523
  settlement:houseInteractive  calls=5 tris=575
  settlement:houseStatic       calls=12 tris=11136
  settlement:landmarkGarden    calls=2 tris=23965
  settlement:landmarkNoticeBoard calls=1 tris=14
  settlement:landmarkWellCentral calls=2 tris=707
  settlement:landmarkWellHousehold calls=2 tris=2250
  settlement:landmarkWellPasture calls=2 tris=637
  settlement:other             calls=4 tris=67
  settlement:storageBarrel     calls=3 tris=4188
  settlement:storageContainer  calls=11 tris=770
  settlement:storageGoods      calls=14 tris=2809
  settlement:storageHay        calls=0 tris=185
  settlement:storageTrough     calls=2 tris=517
  settlement:storageWoodHousehold calls=1 tris=1755
  settlement:storageWoodSettlementPrimary calls=0 tris=306
  settlement:workplace         calls=3 tris=1395
  terrain                      calls=6 tris=407017
  vegetation                   calls=23 tris=381922

Shadow (refresh only):
  calls avg: 309  tris avg: 2238553
  info calls avg: 309  residual calls avg: 0
  environment                  calls=11 tris=5687
  faunaFamily:cow              calls=3 tris=875
  faunaFamily:duck             calls=1 tris=19
  faunaFamily:fox              calls=0 tris=211
  faunaFamily:horse            calls=2 tris=565
  faunaFamily:rabbit           calls=1 tris=774
  faunaFamily:rat              calls=1 tris=1266
  faunaFamily:sheep            calls=0 tris=62
  faunaFamily:stag             calls=6 tris=3854
  items                        calls=4 tris=1880
  npcFamily:Knight_Cloth       calls=3 tris=4348
  npcFamily:Peasant            calls=3 tris=3955
  npcFamily:Peasant_Boots      calls=1 tris=1264
  npcFamily:woodcutter         calls=1 tris=946
  other                        calls=53 tris=11510
  settlement:decor             calls=110 tris=218527
  settlement:fireHouseInteriorLamp calls=1 tris=128
  settlement:houseInteractive  calls=2 tris=382
  settlement:houseStatic       calls=15 tris=6635
  settlement:landmarkGarden    calls=1 tris=484
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1132
  settlement:other             calls=4 tris=84
  settlement:storageContainer  calls=5 tris=511
  settlement:storageHay        calls=1 tris=291
  settlement:storageTrough     calls=1 tris=263
  settlement:storageWoodHousehold calls=1 tris=1034
  settlement:storageWoodSettlementPrimary calls=1 tris=465
  settlement:workplace         calls=2 tris=2135
  terrain                      calls=19 tris=1370407
  vegetation                   calls=53 tris=598836

Main:
  calls avg: 582  tris avg: 8963017
  info calls avg: 717  residual calls avg: 0
  environment                  calls=51 tris=13372
  faunaFamily:bear             calls=1 tris=669
  faunaFamily:chicken          calls=6 tris=818
  faunaFamily:cow              calls=0 tris=169
  faunaFamily:dog              calls=12 tris=3939
  faunaFamily:horse            calls=0 tris=78
  faunaFamily:rabbit           calls=0 tris=190
  faunaFamily:rat              calls=1 tris=2912
  faunaFamily:sheep            calls=4 tris=1287
  faunaFamily:stag             calls=1 tris=569
  faunaFamily:wolf             calls=2 tris=896
  grass                        calls=37 tris=5689273
  items                        calls=48 tris=5481
  npcFamily:Farmer             calls=8 tris=11418
  npcFamily:Knight_Cloth       calls=6 tris=7828
  npcFamily:Peasant            calls=37 tris=45870
  npcFamily:Peasant_Boots      calls=6 tris=8227
  npcFamily:blacksmith         calls=7 tris=9685
  other                        calls=88 tris=14699
  settlement:decor             calls=14 tris=36476
  settlement:fence             calls=3 tris=4772
  settlement:fireCampfire      calls=5 tris=390
  settlement:fireHouseExteriorLamp calls=11 tris=515
  settlement:fireHouseInteriorLamp calls=4 tris=388
  settlement:fireVillageTorch  calls=15 tris=1075
  settlement:houseInteractive  calls=11 tris=1190
  settlement:houseStatic       calls=23 tris=20844
  settlement:landmarkGarden    calls=5 tris=48444
  settlement:landmarkNoticeBoard calls=2 tris=29
  settlement:landmarkWellCentral calls=4 tris=1501
  settlement:landmarkWellHousehold calls=5 tris=4596
  settlement:landmarkWellPasture calls=4 tris=1315
  settlement:other             calls=7 tris=138
  settlement:storageBarrel     calls=6 tris=8593
  settlement:storageContainer  calls=22 tris=1578
  settlement:storageGoods      calls=28 tris=5824
  settlement:storageHay        calls=1 tris=372
  settlement:storageTrough     calls=4 tris=1063
  settlement:storageWoodHousehold calls=1 tris=3595
  settlement:storageWoodSettlementPrimary calls=1 tris=619
  settlement:workplace         calls=6 tris=2919
  terrain                      calls=24 tris=1746086
  vegetation                   calls=55 tris=799011
  water                        calls=7 tris=454653


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 92.4ms
simulate        63.1ms
render          28.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       56.4ms
NPC              1.3ms
FAUNA            1.7ms
PHYSICS          0.0ms
RENDER          28.4ms
OTHER            4.6ms

streaming / stages:
  chunkUpdate                  56.4ms
  riverTileBuild               52.4ms
  terrainPrepare               0.9ms
  riverChannelSegmentsNear     0.3ms

---

[Seedvale Program Census]

Programs created: 130
Program count: final=129 max=129

By frame:
  frame 0   +75 programs   <== largest transition
  frame 144   +1 program
  frame 261   +1 program
  frame 505   +1 program
  frame 563   +2 programs
  frame 592   +1 program
  frame 654   +1 program
  frame 668   +1 program
  frame 849   +1 program
  frame 1146   +1 program
  frame 1257   +1 program
  frame 2328   +18 programs
  frame 2375   +4 programs
  frame 2610   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=de011519-e4ed-4bb8-9f83-d9aee85b1c24 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=50450242-0211-454f-8f30-e865dd4a5698
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=f9a86ba2-3ab8-48e0-ad29-91c07a681f42
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=840f5734-b044-487b-a48e-288b2d4417a6
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d8e2db2b-b641-4b78-b6a5-81f15f2f4594
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a3683989-384d-4224-9155-e108ff49d341
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=eb449716-afb0-4304-a9c4-c0734f770ad7
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c6864116-1fc8-4b6d-90c6-e9d398168b76
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0bdf7695-20c6-4060-8175-53441dc4ebca
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3225e767-39f9-459d-b170-edccd5dc018b (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=50e51310-4bf9-4fc4-9731-6f8c75ae032a
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c49bd7d7-7821-4aba-b0d8-ededcf229b6e (Green)
  #14 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e2b9a9e2-9137-4ce7-8bd9-721609371d48 (Stone)
  #15 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4a5cdd81-f82c-4018-bd1b-dc40e6cfccac (None)
  #16 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=699efd73-3fb7-46ce-9441-3b883f848558 (Flowers)
  #17 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=daa9191d-e1b7-4d0e-829d-95dcfb0b8bde (Pink)
  #18 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3bf41bd4-0b52-449a-90ed-3aa6427f3211 (Wood)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=39732d19-dff0-4415-8833-98a4347e281e (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=be728fac-9060-4d63-bdf8-02956f5195f9 (MI_WindowGlass)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=056fc1ff-4056-4e8d-a263-4211bbc29266 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6fd523c4-4e9c-4fc4-a5fd-3bc87ba59c2b (MI_WindowGlass)
  #25 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #26 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #27 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=85a31b90-feac-4853-a7be-c189993a6bb7 (MapleTree_Leaves)
  #28 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3d9d072c-3d5d-452e-b23f-54df3b9d0154 (Green)
  #29 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=684f3f1d-b035-441c-94d6-028a81d70b41 (MapleTree_Bark)
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=62045f46-2f97-40cb-8789-5bd60498fc62 (Main)
  #31 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0cd70a83-3deb-4753-871d-b05253a5182a (lambert2SG)
  #32 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=35c43f6f-6688-4b1a-acb6-93dea7282d97 (Material #55)
  #33 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3f650550-8b06-44ac-b07c-bffc25877a12 (Main)
  #34 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=43112dd3-0c46-4df8-b355-d68370c6807d (MI_Knight)
  #35 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0cbb6924-9454-455f-8f2e-e8b01aceb4a7 (MI_Knight)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c8a982c1 fHash=8ab73626 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3802da8b-5d41-4f3c-b02f-ae8a60a0c97e (MI_Hair_1)
  #37 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e56b9afc-b645-436e-bb63-f7c6fb2d7505 (MI_Hair_1)
  #38 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=dbe18946-6876-4f8e-8a11-aa35644e9add (MI_Peasant)
  #39 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6db1ff0f-056b-412d-b77b-dbd2f0031e2c (MI_Hair_1)
  #40 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3985f134-4bfe-4010-a0e5-ce4049dae509 (MI_Hair_1)
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #51 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=840ba7c7-038f-4bfc-9cb4-e77a5dc5e707 (stockpiles_vc)
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=9787af24-fb57-437c-9b2f-5e8422086d01
  #53 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=14c995ae-adae-42b1-b8db-d35915e09d83 (Handle)
  #54 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e3a92864-91c0-4159-b73f-73e7e703b9d6 (DarkGreen)
  #55 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=83824d6e-2247-41e2-b4a4-79b6731f1665 (Pond_Pack_MAT)
  #56 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1db5f624-7959-4550-a867-a6baed99dd2a (PathRocks)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #25=df7c703d, #26=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #25=236b3b0b, #26=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #25=(unset), #26=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=a9733c9d, #15=6db98a06, #16=e4cbf8ca, #17=d3fd7a87, #18=f3a1039e, #19=c5e73b05, #20=13a74ec7, #21=9dcf1cb4, #22=12873951, #23=fc941d05, #24=e551c572, #27=d9d07622, #28=190d3a9c, #29=9dbe8ee7, #30=54e03756, #31=7bb77142, #33=fd8301ed, #34=140c5e62, #35=eb2eade3, #36=c8a982c1, #37=ee59055a, #38=842fe1df, #39=ac268392, #40=1c179521, #51=a64d124e, #52=94297e69, #53=3abb47a8, #54=9434da33, #55=c3bc6325, #56=b643916d
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=bd723c8a, #15=efed8e98, #16=135696d3, #17=2eae9a54, #18=c7daf23, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #27=135696d3, #28=633146b4, #29=8dba9dd, #30=d391c52, #31=87728b15, #33=2f2885d5, #34=46d4b31c, #35=6eafecb9, #36=8ab73626, #37=e8d88acf, #38=34995f15, #39=25a41317, #40=71f22dc6, #51=546e469, #52=aa0735a8, #53=85d3c28d, #54=77dfd097, #55=ded4be89, #56=754b87bd
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=environment, #15=environment, #16=vegetation, #17=vegetation, #18=settlement, #19=settlement, #20=(unknown), #21=settlement, #22=settlement, #23=(unknown), #24=settlement, #27=settlement, #28=settlement, #29=settlement, #30=fauna, #31=fauna, #33=fauna, #34=npc, #35=npc, #36=npc, #37=npc, #38=other, #39=other, #40=other, #51=settlement, #52=other, #53=settlement, #54=other, #55=other, #56=settlement
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=(unset), #21=, #22=, #23=(unset), #24=, #27=, #28=, #29=, #30=, #31=, #33=, #34=, #35=, #36=, #37=, #38=, #39=, #40=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #16=0.45, #17=0, #18=0, #19=0, #20=(unknown), #21=0, #22=0, #23=(unknown), #24=0, #27=0.45, #28=0, #29=0, #30=0, #31=0, #33=0, #34=0, #35=0, #36=0, #37=0, #38=0, #39=0, #40=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=true, #53=true, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=(unknown), #21=true, #22=true, #23=(unknown), #24=true, #27=true, #28=true, #29=true, #30=true, #31=true, #33=true, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=true, #16=true, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=true, #28=false, #29=true, #30=false, #31=true, #33=false, #34=true, #35=true, #36=true, #37=true, #38=true, #39=true, #40=true, #51=false, #52=false, #53=false, #54=false, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=false, #29=true, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=true, #22=false, #23=(unknown), #24=true, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=true, #36=true, #37=false, #38=true, #39=true, #40=false, #51=true, #52=false, #53=false, #54=false, #55=true, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #29=false, #30=false, #31=false, #33=false, #34=false, #35=false, #36=false, #37=false, #38=false, #39=false, #40=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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
    vertexShaderHash differs: #41=59ed5d71, #42=b69ba143, #43=2e7a6fcb, #44=585a1ea4, #45=c203b19a, #46=c203b19a, #47=585a1ea4, #48=263c45d6, #49=2efa42a8, #50=e4717b03
    fragmentShaderHash differs: #41=d729897e, #42=d729897e, #43=758a4164, #44=41e40a66, #45=41e40a66, #46=a9dd0dee, #47=a9dd0dee, #48=d729897e, #49=41e40a66, #50=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2328 (+18):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: f9a86ba2-3ab8-48e0-ad29-91c07a681f42
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: 14fd2a52-767f-4f72-a7ea-ed7c3f51bd46
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: e2d70ba6-286f-465a-83e4-64a7cc08acf0
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
    materialUuid: 4bb21a26-0da6-4f4c-b817-09486789c504
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
    materialUuid: df97e4da-5694-43c4-9274-65da04c14a22
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 684f3f1d-b035-441c-94d6-028a81d70b41
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 699efd73-3fb7-46ce-9441-3b883f848558
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
    materialUuid: 45592dd6-15f7-45df-be28-bca3c858dd71
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 19690a0c-baa7-4a4b-9c91-24cbd24c1e5d
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
    materialUuid: 840ba7c7-038f-4bfc-9cb4-e77a5dc5e707
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #96
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 056fc1ff-4056-4e8d-a263-4211bbc29266
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #97
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: ac07be56-ecc4-4572-aef2-e38713125d8e
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #98
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 3dc70cd1-a013-479c-b3aa-306ebacf8602
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #99
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: dbe18946-6876-4f8e-8a11-aa35644e9add
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6db1ff0f-056b-412d-b77b-dbd2f0031e2c
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3985f134-4bfe-4010-a0e5-ce4049dae509
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
    materialUuid: 6fd523c4-4e9c-4fc4-a5fd-3bc87ba59c2b
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2610 (+22):
  Program #108
    material: ShaderMaterial 'SkyShader'
    materialUuid: de011519-e4ed-4bb8-9f83-d9aee85b1c24
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #109
    material: ShaderMaterial ''
    materialUuid: eb449716-afb0-4304-a9c4-c0734f770ad7
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #110
    material: MeshStandardMaterial ''
    materialUuid: f9a86ba2-3ab8-48e0-ad29-91c07a681f42
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #111
    material: MeshStandardMaterial 'Wood'
    materialUuid: 14fd2a52-767f-4f72-a7ea-ed7c3f51bd46
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: e2d70ba6-286f-465a-83e4-64a7cc08acf0
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
    materialUuid: 4bb21a26-0da6-4f4c-b817-09486789c504
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
    materialUuid: df97e4da-5694-43c4-9274-65da04c14a22
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #115
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 684f3f1d-b035-441c-94d6-028a81d70b41
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #116
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 699efd73-3fb7-46ce-9441-3b883f848558
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
    materialUuid: 45592dd6-15f7-45df-be28-bca3c858dd71
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #118
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 19690a0c-baa7-4a4b-9c91-24cbd24c1e5d
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
    materialUuid: 840ba7c7-038f-4bfc-9cb4-e77a5dc5e707
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #120
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: ac07be56-ecc4-4572-aef2-e38713125d8e
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #121
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 3dc70cd1-a013-479c-b3aa-306ebacf8602
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #122
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: dbe18946-6876-4f8e-8a11-aa35644e9add
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6db1ff0f-056b-412d-b77b-dbd2f0031e2c
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3985f134-4bfe-4010-a0e5-ce4049dae509
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #125
    material: ShaderMaterial ''
    materialUuid: a3683989-384d-4224-9155-e108ff49d341
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
    materialUuid: 0bdf7695-20c6-4060-8175-53441dc4ebca
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #128
    material: ShaderMaterial ''
    materialUuid: 1d0f881e-dc14-4b93-8710-52c5b71ca2c2
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #129
    material: ShaderMaterial ''
    materialUuid: baef9c2e-bb8c-4f9b-bc0a-228f658bfe95
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

Frame 144
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 16.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 261
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 46.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 505
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 33.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 592
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 47.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 654
  #81
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 24.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 668
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 16.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 849
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 17.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 1146
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 52.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 1257
  #85
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 17.3 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 272.4 ms
  programs >1 ms: 9
  max: 52.4 ms (#84)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.1 ms  p95=7.0 ms  max=7.4 ms  Δavg vs baseline=—
  hide-grass           avg=5.9 ms  p95=6.9 ms  max=7.7 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-vegetation      avg=5.4 ms  p95=6.6 ms  max=7.0 ms  Δavg vs baseline=-0.7 ms (-12%)
  no vegetation/grass  avg=5.0 ms  p95=5.8 ms  max=6.6 ms  Δavg vs baseline=-1.1 ms (-18%)
  hide-environment     avg=5.8 ms  p95=6.7 ms  max=7.0 ms  Δavg vs baseline=-0.3 ms (-6%)
  hide-settlement      avg=5.5 ms  p95=6.3 ms  max=7.6 ms  Δavg vs baseline=-0.7 ms (-11%)
  no water             avg=6.0 ms  p95=7.2 ms  max=7.5 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-terrain         avg=5.7 ms  p95=6.9 ms  max=7.1 ms  Δavg vs baseline=-0.4 ms (-6%)
  hide-npc-fauna       avg=5.3 ms  p95=6.3 ms  max=6.5 ms  Δavg vs baseline=-0.8 ms (-13%)
  no-shadows           avg=5.9 ms  p95=6.4 ms  max=6.6 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-ao                avg=5.9 ms  p95=6.9 ms  max=7.2 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-bloom             avg=6.0 ms  p95=7.1 ms  max=7.3 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-smaa              avg=5.9 ms  p95=7.5 ms  max=7.7 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-god-rays          avg=6.0 ms  p95=7.1 ms  max=7.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-film-grade        avg=6.1 ms  p95=7.0 ms  max=7.3 ms  Δavg vs baseline=-0.0 ms (-1%)
  no postprocessing    avg=5.9 ms  p95=6.9 ms  max=7.0 ms  Δavg vs baseline=-0.3 ms (-4%)
  no mirrors           avg=6.2 ms  p95=7.4 ms  max=7.6 ms  Δavg vs baseline=+0.1 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=12.8 ms  p95=14.1 ms  max=14.3 ms
  CPU wall      avg=6.1 ms  p95=7.0 ms  max=7.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
