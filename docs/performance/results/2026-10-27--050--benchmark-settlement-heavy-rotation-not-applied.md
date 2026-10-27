# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:53:14.668Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Frames: 233
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-52-34-556Z-6p4f31
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
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 19.8
  min: 3
  p1: 8

Frame time (wall-clock):
  avg: 50.6 ms
  p50: 49.4 ms
  p95: 55.2 ms
  p99: 119.1 ms
  max: 395.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=10.3 p95=13.6 p99=57.9 max=58.8 n=233
  render: p50=38.6 p95=43.5 p99=93.8 max=386.2 n=233
  frame: p50=49.4 p95=55.2 p99=119.1 max=395.4 n=233

Rendering (combined renderer.info):
  draw calls: 2375 avg / 2777 max
  triangles: 7.86M avg
  mirror draws: 347 avg
  geometries: 1048
  textures: 2205

Pass submissions (actual):
  reliability: observed
  frames: 233 shadowRefresh=233 shadowSkipped=0
  mirror calls avg: 347
  shadow calls avg: 425
  main calls avg: 1603

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1512 tris=1.37M meshes=1512 inst=3578
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=807 tris=831.5k meshes=807 inst=2699
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=17 tris=7.8k meshes=17 inst=17
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=117 tris=15.1k meshes=117 inst=117

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=8.2k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=27.8k meshes=56 inst=56
  storageContainer draws=76 tris=9.0k meshes=76 inst=122
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.0k meshes=24 inst=70
  workplace        draws=26 tris=17.4k meshes=26 inst=26
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=8.8k meshes=5 inst=11
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=28 tris=3.0k meshes=28 inst=28
  fireCampfire     draws=40 tris=1.1k meshes=40 inst=40
  decor            draws=199 tris=387.0k meshes=199 inst=305
  other            draws=59 tris=1.8k meshes=59 inst=59

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      Peasant_Boots    agents=6 draws=55 tris=72.1k skinned=55/55
      blacksmith       agents=5 draws=54 tris=64.9k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=37 tris=49.6k skinned=37/37
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=23.5k
      far  agents=51 camera-relevant=17 draws=500 tris=597.8k
  Fauna:
    by family (sorted by draws):
      horse            agents=10 draws=80 tris=21.8k skinned=80/80
      dog              agents=13 draws=73 tris=25.2k skinned=73/73
      sheep            agents=20 draws=40 tris=12.2k skinned=40/40
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=5 draws=10 tris=20.0k skinned=10/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      mid  agents=5 camera-relevant=4 draws=17 tris=7.8k
      far  agents=86 camera-relevant=17 draws=382 tris=144.4k

Systems:
  WATER          5.8 ms
  NPC            4.1 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         33.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  GRASS: 1

Hitches (>= 8 ms): total=1
  grass generation       n=1 avg=8.1 max=8.1

Isolation probes:
  full               render=30.4 ms draws=2375 tris=7.85M
  hide-grass         render=27.7 ms draws=2342 tris=7.54M
  hide-vegetation    render=27.7 ms draws=2194 tris=6.77M
  hide-vegetation-grass render=27.4 ms draws=2167 tris=6.46M
  hide-environment   render=28.1 ms draws=2086 tris=7.81M
  hide-settlement    render=24.0 ms draws=1503 tris=7.13M
  hide-water         render=29.3 ms draws=2378 tris=6.90M
  hide-terrain       render=30.0 ms draws=2337 tris=3.81M
  hide-npc-fauna     render=18.9 ms draws=1891 tris=7.42M
  no-shadows         render=25.4 ms draws=1984 tris=5.68M
  no-ao              render=29.3 ms draws=2367 tris=7.85M
  no-bloom           render=29.0 ms draws=2363 tris=7.86M
  no-smaa            render=30.1 ms draws=2374 tris=7.86M
  no-god-rays        render=29.5 ms draws=2376 tris=7.86M
  no-film-grade      render=29.9 ms draws=2379 tris=7.87M
  no-postprocessing  render=30.8 ms draws=2347 tris=7.86M
  no-reflections     render=29.5 ms draws=2020 tris=6.87M

Frame attribution:
  frame max: 395.4 ms
  largest labelled hitch: 8.1 ms
  unattributed: 387.3 ms

Long frames:
  threshold: 80 ms
  count: 9
  worst: 395.4 ms

Raw sidecar:
  sampling=full factor=1 exported=233/233

Recommendation:
Largest frame (395.4 ms) is not explained by labelled hitches (largest 8.1 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.1 ms/frame
  crowd pass: 0.0 ms/frame (3.1 ms cumulative)
  agent updates: 2.5 ms/frame (583.7 ms cumulative)
  livestock: 1.2 ms/frame (289.2 ms cumulative)
    loaded tick: 1.2 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 55.5
    unique animals/frame: 49.6
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.8
    dog guard scans: 12.8/frame (89.9 predator candidates/frame)
    pest scans: 6.0/frame (6.0 rat candidates/frame)
    nearest scans: 29.6/frame (0.0 candidates/frame)
    water samples: 63.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 63.6/frame, 0.10 ms/frame (worst call 0.90 ms, 13295.5 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 55.4
    behaviour executions/frame: 29.7
    presentation executions/frame: 29.7
  rats: 0.1 ms/frame (19.4 ms cumulative)
  social: 0.0 ms/frame (1.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (46.4 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.8 ms/frame (408.7 ms cumulative)
  forest sampling: 0.1 ms/frame (24.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (3.8 ms cumulative)
    targeting: 0.0 ms/frame (5.3 ms cumulative)
    decision: 0.0 ms/frame (1.2 ms cumulative)
    behaviour: 1.2 ms/frame (273.6 ms cumulative)
    life/presentation: 0.3 ms/frame (77.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 26.0
    decision passes/frame: 26.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.0
    full-rate agents/frame: 6.0
    reduced-cadence agents/frame: 20.0
    behaviour executions/frame: 16.0
    presentation executions/frame: 16.0

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 102.8
    village scan candidates/frame: 1570.4
    player perception checks/frame: 26.0

  nearest scans: 25.0/frame (5816 calls)
  nearest candidates checked: 456.8/frame (106425 total)
  herd leader scans: 0.3/frame (59 calls)
  herd candidates checked: 7.6/frame (1770 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 27.0/frame (172.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 15.7/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 15.7/frame, 0.00 ms/frame (worst call 0.10 ms, 222.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 12
  empty builds (no instances): 1
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.95 ms
    max 8.10 ms

  allocation/setup:
    avg 0.88 ms
    max 8.00 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.02 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.11 ms
    max 0.40 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 1.20 ms
    max 9.00 ms

  per chunk:
    instances avg/max 105348.2 / 266667
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 404239 / 859939
    matrix instances bound: 1264178
    instanced attributes created: 240
    shared material refs: 48
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 12/12
    instances: 151719 (max 32075)
    allocation/setup avg/max: 0.10 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 12/12
    instances: 50989 (max 10670)
    allocation/setup avg/max: 0.66 / 7.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 12/12
    instances: 201531 (max 42240)
    allocation/setup avg/max: 0.07 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 12/12
    instances: 859939 (max 181682)
    allocation/setup avg/max: 0.05 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

---

[Seedvale Grass Baseline]

Chunks resident: 23
Resident instances: full=482171 filler=1025429
Submitted instances: full=75310 filler=42954
Meshes submitted: 75
LOD submitted fraction: full=0.15618940168529422 filler=0.04188880946413647
Flowers: unavailable
Allocation bytes (estimated): 144729600
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=13 discard(unload=0,oor=0) cancel=0 streamIn=12 streamOut=0 invalidate=0
Finalization: observed completions=13

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 233
Shadow refresh frames: 233
Shadow skipped frames: 0

Mirror:
  calls avg: 347  tris avg: 992019
  info calls avg: 347  residual calls avg: 0
  environment                  calls=44 tris=8904
  items                        calls=1 tris=624
  other                        calls=35 tris=2221
  settlement:decor             calls=1 tris=833
  settlement:fence             calls=2 tris=9287
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=45 tris=3096
  settlement:fireHouseInteriorLamp calls=5 tris=536
  settlement:fireVillageTorch  calls=5 tris=353
  settlement:houseInteractive  calls=15 tris=1637
  settlement:houseStatic       calls=33 tris=80239
  settlement:landmarkGarden    calls=5 tris=82255
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=923
  settlement:landmarkWellHousehold calls=5 tris=9310
  settlement:landmarkWellPasture calls=2 tris=923
  settlement:other             calls=9 tris=346
  settlement:storageBarrel     calls=4 tris=11708
  settlement:storageContainer  calls=28 tris=2305
  settlement:storageGoods      calls=38 tris=6913
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1694
  settlement:storageWoodHousehold calls=10 tris=4421
  settlement:storageWoodSettlementPrimary calls=1 tris=1060
  settlement:storageWoodSettlementSecondary calls=1 tris=2780
  settlement:workplace         calls=11 tris=5246
  terrain                      calls=8 tris=592355
  vegetation                   calls=22 tris=161606

Shadow (refresh only):
  calls avg: 425  tris avg: 2180721
  info calls avg: 425  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=1 tris=153
  faunaFamily:cow              calls=2 tris=789
  faunaFamily:dog              calls=7 tris=2218
  faunaFamily:donkey           calls=1 tris=249
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=4 tris=1194
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4126
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=2961
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=29 tris=8600
  settlement:fence             calls=4 tris=19796
  settlement:fireCampfire      calls=12 tris=176
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:houseInteractive  calls=16 tris=2512
  settlement:houseStatic       calls=33 tris=89974
  settlement:landmarkGarden    calls=1 tris=2400
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=13 tris=240
  settlement:storageContainer  calls=20 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=16 tris=7128
  settlement:storageWoodSettlementPrimary calls=2 tris=2148
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554815

Main:
  calls avg: 1603  tris avg: 4687227
  info calls avg: 2028  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1922
  faunaFamily:cow              calls=7 tris=2408
  faunaFamily:dog              calls=35 tris=11537
  faunaFamily:donkey           calls=7 tris=1966
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3935
  faunaFamily:sheep            calls=14 tris=4182
  grass                        calls=33 tris=315935
  items                        calls=191 tris=15149
  npcFamily:Herbalist          calls=25 tris=26873
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=161 tris=175276
  npcFamily:Peasant_Boots      calls=41 tris=47945
  npcFamily:Wizard             calls=59 tris=56389
  npcFamily:blacksmith         calls=36 tris=38295
  npcFamily:woodcutter         calls=17 tris=15152
  other                        calls=122 tris=14834
  settlement:decor             calls=2 tris=1659
  settlement:fence             calls=4 tris=18494
  settlement:fireCampfire      calls=36 tris=451
  settlement:fireHouseExteriorLamp calls=80 tris=5541
  settlement:fireHouseInteriorLamp calls=10 tris=1067
  settlement:fireVillageTorch  calls=15 tris=1061
  settlement:houseInteractive  calls=30 tris=3260
  settlement:houseStatic       calls=65 tris=159787
  settlement:landmarkGarden    calls=12 tris=208650
  settlement:landmarkNoticeBoard calls=2 tris=35
  settlement:landmarkWellCentral calls=10 tris=3708
  settlement:landmarkWellHousehold calls=10 tris=18539
  settlement:landmarkWellPasture calls=5 tris=1838
  settlement:other             calls=22 tris=750
  settlement:storageBarrel     calls=12 tris=26082
  settlement:storageContainer  calls=57 tris=4842
  settlement:storageGoods      calls=72 tris=13267
  settlement:storageHay        calls=2 tris=968
  settlement:storageTrough     calls=8 tris=3373
  settlement:storageWoodHousehold calls=18 tris=7912
  settlement:storageWoodSettlementPrimary calls=4 tris=4259
  settlement:storageWoodSettlementSecondary calls=4 tris=11167
  settlement:workplace         calls=37 tris=15354
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 9
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 9 total):

[LONG FRAME] 395.4ms
simulate         9.0ms
render         386.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              2.0ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER         386.2ms
OTHER            5.7ms

streaming / stages:
  contentFinalize              6.3ms

Long frame #2:

[LONG FRAME] 157.7ms
simulate        17.3ms
render         140.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           29.9ms
STREAMING        0.1ms
NPC              7.9ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER         110.3ms
OTHER            8.7ms

streaming / stages:
  chunkUpdate                  0.1ms

Long frame #3:

[LONG FRAME] 127.8ms
simulate        29.3ms
render          98.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           34.4ms
STREAMING        0.0ms
NPC              5.3ms
FAUNA            4.4ms
PHYSICS          0.2ms
RENDER          64.1ms
OTHER           19.4ms

hitches:
  GRASS grass generation       8.1ms

Long frame #4:

[LONG FRAME] 100.6ms
simulate        15.8ms
render          84.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              4.4ms
FAUNA            1.1ms
PHYSICS          0.3ms
RENDER          84.3ms
OTHER           10.3ms

Long frame #5:

[LONG FRAME] 90ms
simulate        58.8ms
render          31.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           49.1ms
PHYSICS          0.1ms
RENDER          31.0ms
OTHER            5.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=30.4 ms  p95=31.6 ms  max=31.7 ms  Δavg vs baseline=—
  hide-grass           avg=27.7 ms  p95=28.3 ms  max=28.4 ms  Δavg vs baseline=-2.7 ms (-9%)
  hide-vegetation      avg=27.7 ms  p95=28.0 ms  max=28.0 ms  Δavg vs baseline=-2.7 ms (-9%)
  no vegetation/grass  avg=27.4 ms  p95=28.5 ms  max=28.7 ms  Δavg vs baseline=-3.0 ms (-10%)
  hide-environment     avg=28.1 ms  p95=29.1 ms  max=29.3 ms  Δavg vs baseline=-2.3 ms (-7%)
  hide-settlement      avg=24.0 ms  p95=24.5 ms  max=24.7 ms  Δavg vs baseline=-6.4 ms (-21%)
  no water             avg=29.3 ms  p95=30.5 ms  max=30.6 ms  Δavg vs baseline=-1.1 ms (-4%)
  hide-terrain         avg=30.0 ms  p95=32.1 ms  max=32.3 ms  Δavg vs baseline=-0.4 ms (-1%)
  hide-npc-fauna       avg=18.9 ms  p95=20.8 ms  max=21.0 ms  Δavg vs baseline=-11.4 ms (-38%)
  no-shadows           avg=25.4 ms  p95=27.8 ms  max=28.2 ms  Δavg vs baseline=-5.0 ms (-16%)
  no-ao                avg=29.3 ms  p95=30.9 ms  max=31.2 ms  Δavg vs baseline=-1.1 ms (-3%)
  no-bloom             avg=29.0 ms  p95=30.6 ms  max=30.9 ms  Δavg vs baseline=-1.3 ms (-4%)
  no-smaa              avg=30.1 ms  p95=30.9 ms  max=30.9 ms  Δavg vs baseline=-0.3 ms (-1%)
  no-god-rays          avg=29.5 ms  p95=29.7 ms  max=29.7 ms  Δavg vs baseline=-0.9 ms (-3%)
  no-film-grade        avg=29.9 ms  p95=31.0 ms  max=31.2 ms  Δavg vs baseline=-0.4 ms (-1%)
  no postprocessing    avg=30.8 ms  p95=32.7 ms  max=33.0 ms  Δavg vs baseline=+0.4 ms (+1%)
  no mirrors           avg=29.5 ms  p95=31.2 ms  max=31.4 ms  Δavg vs baseline=-0.9 ms (-3%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
