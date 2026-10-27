# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:45:48.135Z
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
Frames: 256
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-45-07-565Z-qtzys0
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
  avg: 20.8
  min: 7
  p1: 9

Frame time (wall-clock):
  avg: 48 ms
  p50: 49.1 ms
  p95: 55.1 ms
  p99: 105.7 ms
  max: 150.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=11.1 p95=13.7 p99=59.6 max=60.2 n=256
  render: p50=35.5 p95=41.5 p99=75.9 max=142.5 n=256
  frame: p50=49.1 p95=55.1 p99=105.7 max=150.5 n=256

Rendering (combined renderer.info):
  draw calls: 2314 avg / 2697 max
  triangles: 7.85M avg
  mirror draws: 349 avg
  geometries: 999
  textures: 1606

Pass submissions (actual):
  reliability: observed
  frames: 256 shadowRefresh=256 shadowSkipped=0
  mirror calls avg: 349
  shadow calls avg: 417
  main calls avg: 1548

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1515 tris=1.38M meshes=1515 inst=3581
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=509 tris=29.6k meshes=509 inst=511

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=805 tris=833.3k meshes=805 inst=2697
  npc              draws=42 tris=47.0k meshes=42 inst=42
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=114 tris=14.7k meshes=114 inst=114

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=8.2k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=24.9k meshes=56 inst=56
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
  decor            draws=197 tris=391.6k meshes=197 inst=303
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
      mid  agents=4 camera-relevant=2 draws=42 tris=47.0k
      far  agents=49 camera-relevant=19 draws=478 tris=574.3k
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
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=88 camera-relevant=18 draws=389 tris=149.0k

Systems:
  WATER          5.3 ms
  NPC            4.4 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         30.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=28.3 ms draws=2343 tris=7.88M
  hide-grass         render=28.3 ms draws=2298 tris=7.55M
  hide-vegetation    render=27.1 ms draws=2151 tris=6.78M
  hide-vegetation-grass render=25.9 ms draws=2178 tris=6.62M
  hide-environment   render=28.1 ms draws=2095 tris=7.81M
  hide-settlement    render=23.8 ms draws=1378 tris=6.81M
  hide-water         render=28.3 ms draws=2302 tris=6.88M
  hide-terrain       render=27.4 ms draws=2260 tris=3.79M
  hide-npc-fauna     render=19.2 ms draws=1831 tris=7.42M
  no-shadows         render=23.6 ms draws=1931 tris=5.69M
  no-ao              render=28.0 ms draws=2313 tris=7.86M
  no-bloom           render=28.1 ms draws=2306 tris=7.86M
  no-smaa            render=29.5 ms draws=2323 tris=7.86M
  no-god-rays        render=28.8 ms draws=2325 tris=7.86M
  no-film-grade      render=28.4 ms draws=2326 tris=7.86M
  no-postprocessing  render=29.8 ms draws=2302 tris=7.86M
  no-reflections     render=28.8 ms draws=1974 tris=6.87M

Frame attribution:
  frame max: 150.5 ms
  largest labelled hitch: 0 ms
  unattributed: 150.5 ms

Long frames:
  threshold: 80 ms
  count: 7
  worst: 150.5 ms

Raw sidecar:
  sampling=full factor=1 exported=256/256

Recommendation:
Largest frame (150.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.4 ms/frame
  crowd pass: 0.0 ms/frame (4.0 ms cumulative)
  agent updates: 2.6 ms/frame (655.9 ms cumulative)
  livestock: 1.4 ms/frame (348.1 ms cumulative)
    loaded tick: 1.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 55.6
    unique animals/frame: 49.7
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.9
    dog guard scans: 12.9/frame (103.1 predator candidates/frame)
    pest scans: 7.1/frame (7.1 rat candidates/frame)
    nearest scans: 29.3/frame (0.0 candidates/frame)
    water samples: 58.6/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 58.6/frame, 0.10 ms/frame (worst call 0.80 ms, 12693.8 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 55.1
    behaviour executions/frame: 29.7
    presentation executions/frame: 29.7
  rats: 0.1 ms/frame (31.2 ms cumulative)
  social: 0.0 ms/frame (2.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (55.6 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.1 ms/frame (525.7 ms cumulative)
  forest sampling: 0.1 ms/frame (30.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (5.4 ms cumulative)
    targeting: 0.0 ms/frame (6.5 ms cumulative)
    decision: 0.0 ms/frame (3.5 ms cumulative)
    behaviour: 1.2 ms/frame (308.8 ms cumulative)
    life/presentation: 0.5 ms/frame (138.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.3
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.5
    behaviour executions/frame: 18.3
    presentation executions/frame: 18.3

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 119.1
    village scan candidates/frame: 1585.7
    player perception checks/frame: 30.0

  nearest scans: 25.6/frame (6560 calls)
  nearest candidates checked: 456.1/frame (116772 total)
  herd leader scans: 0.4/frame (92 calls)
  herd candidates checked: 10.8/frame (2760 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.9/frame (170.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 18.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 18.2/frame, 0.00 ms/frame (worst call 0.10 ms, 256.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 1
  empty builds (no instances): 0
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.20 ms
    max 0.20 ms

  allocation/setup:
    avg 0.10 ms
    max 0.10 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.00 ms
    max 0.00 ms
  scene attach (`scene.add`):
    avg 0.00 ms
    max 0.00 ms
  callback total (build + lod + attach):
    avg 0.20 ms
    max 0.20 ms

  per chunk:
    instances avg/max 70755.0 / 70755
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 22574 / 48181
    matrix instances bound: 70755
    instanced attributes created: 20
    shared material refs: 4
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 1/1
    instances: 8503 (max 8503)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 1/1
    instances: 2771 (max 2771)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 1/1
    instances: 11300 (max 11300)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 1/1
    instances: 48181 (max 48181)
    allocation/setup avg/max: 0.10 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

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
Lifecycle: req=0 complete=1 discard(unload=0,oor=0) cancel=0 streamIn=1 streamOut=0 invalidate=0
Finalization: observed completions=1

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 256
Shadow refresh frames: 256
Shadow skipped frames: 0

Mirror:
  calls avg: 349  tris avg: 987993
  info calls avg: 349  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=622
  other                        calls=38 tris=2232
  settlement:decor             calls=1 tris=830
  settlement:fence             calls=2 tris=9251
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=45 tris=3086
  settlement:fireHouseInteriorLamp calls=5 tris=534
  settlement:fireVillageTorch  calls=5 tris=352
  settlement:houseInteractive  calls=15 tris=1632
  settlement:houseStatic       calls=33 tris=79948
  settlement:landmarkGarden    calls=5 tris=81981
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=920
  settlement:landmarkWellHousehold calls=5 tris=9277
  settlement:landmarkWellPasture calls=2 tris=920
  settlement:other             calls=9 tris=345
  settlement:storageBarrel     calls=4 tris=11667
  settlement:storageContainer  calls=28 tris=2297
  settlement:storageGoods      calls=39 tris=6897
  settlement:storageHay        calls=1 tris=484
  settlement:storageTrough     calls=4 tris=1688
  settlement:storageWoodHousehold calls=10 tris=4406
  settlement:storageWoodSettlementPrimary calls=1 tris=1057
  settlement:storageWoodSettlementSecondary calls=1 tris=2772
  settlement:workplace         calls=11 tris=5229
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 417  tris avg: 2173312
  info calls avg: 417  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:dog              calls=7 tris=2308
  faunaFamily:sheep            calls=4 tris=1237
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3212
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=1 tris=1348
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=30 tris=8716
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
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1548  tris avg: 4686495
  info calls avg: 1965  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1924
  faunaFamily:cow              calls=7 tris=2412
  faunaFamily:dog              calls=35 tris=11549
  faunaFamily:donkey           calls=7 tris=1969
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3941
  faunaFamily:sheep            calls=15 tris=4544
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15151
  npcFamily:Herbalist          calls=25 tris=26955
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=163 tris=179249
  npcFamily:Peasant_Boots      calls=42 tris=48034
  npcFamily:Wizard             calls=60 tris=56490
  npcFamily:blacksmith         calls=36 tris=38337
  npcFamily:woodcutter         calls=17 tris=15227
  other                        calls=129 tris=14892
  settlement:decor             calls=2 tris=1661
  settlement:fence             calls=4 tris=18502
  settlement:fireCampfire      calls=36 tris=451
  settlement:fireHouseExteriorLamp calls=80 tris=5548
  settlement:fireHouseInteriorLamp calls=10 tris=1068
  settlement:fireVillageTorch  calls=15 tris=1062
  settlement:houseInteractive  calls=30 tris=3264
  settlement:houseStatic       calls=65 tris=159897
  settlement:landmarkGarden    calls=12 tris=208812
  settlement:landmarkNoticeBoard calls=2 tris=35
  settlement:landmarkWellCentral calls=10 tris=3711
  settlement:landmarkWellHousehold calls=10 tris=18554
  settlement:landmarkWellPasture calls=5 tris=1841
  settlement:other             calls=22 tris=751
  settlement:storageBarrel     calls=12 tris=26101
  settlement:storageContainer  calls=57 tris=4846
  settlement:storageGoods      calls=78 tris=13794
  settlement:storageHay        calls=2 tris=968
  settlement:storageTrough     calls=8 tris=3375
  settlement:storageWoodHousehold calls=18 tris=7922
  settlement:storageWoodSettlementPrimary calls=4 tris=4262
  settlement:storageWoodSettlementSecondary calls=4 tris=11176
  settlement:workplace         calls=37 tris=15367
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


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

[LONG FRAME] 150.5ms
simulate         7.7ms
render         142.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.2ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER         134.4ms
OTHER            5.1ms

Long frame #2:

[LONG FRAME] 128.2ms
simulate        20.6ms
render         107.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           22.8ms
STREAMING        0.0ms
NPC             11.5ms
FAUNA            1.4ms
PHYSICS          0.0ms
RENDER          84.8ms
OTHER            7.7ms

Long frame #3:

[LONG FRAME] 126.8ms
simulate        16.0ms
render         110.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.4ms
STREAMING        0.0ms
NPC              6.8ms
FAUNA            1.7ms
PHYSICS          0.0ms
RENDER         102.1ms
OTHER            7.8ms

Long frame #4:

[LONG FRAME] 88.5ms
simulate        60.2ms
render          28.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.0ms
FAUNA           49.4ms
PHYSICS          0.1ms
RENDER          28.1ms
OTHER            5.8ms

Long frame #5:

[LONG FRAME] 87.5ms
simulate        60.1ms
render          27.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           50.6ms
PHYSICS          0.0ms
RENDER          27.3ms
OTHER            5.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=28.3 ms  p95=29.7 ms  max=30.0 ms  Δavg vs baseline=—
  hide-grass           avg=28.3 ms  p95=29.5 ms  max=29.6 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=27.1 ms  p95=28.8 ms  max=29.2 ms  Δavg vs baseline=-1.2 ms (-4%)
  no vegetation/grass  avg=25.9 ms  p95=27.5 ms  max=27.9 ms  Δavg vs baseline=-2.4 ms (-9%)
  hide-environment     avg=28.1 ms  p95=29.4 ms  max=29.5 ms  Δavg vs baseline=-0.3 ms (-1%)
  hide-settlement      avg=23.8 ms  p95=24.5 ms  max=24.6 ms  Δavg vs baseline=-4.6 ms (-16%)
  no water             avg=28.3 ms  p95=29.3 ms  max=29.4 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-terrain         avg=27.4 ms  p95=28.9 ms  max=29.1 ms  Δavg vs baseline=-0.9 ms (-3%)
  hide-npc-fauna       avg=19.2 ms  p95=20.0 ms  max=20.1 ms  Δavg vs baseline=-9.2 ms (-32%)
  no-shadows           avg=23.6 ms  p95=24.0 ms  max=24.0 ms  Δavg vs baseline=-4.7 ms (-17%)
  no-ao                avg=28.0 ms  p95=29.8 ms  max=30.1 ms  Δavg vs baseline=-0.4 ms (-1%)
  no-bloom             avg=28.1 ms  p95=28.8 ms  max=28.9 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=29.5 ms  p95=31.9 ms  max=32.2 ms  Δavg vs baseline=+1.2 ms (+4%)
  no-god-rays          avg=28.8 ms  p95=29.7 ms  max=29.9 ms  Δavg vs baseline=+0.4 ms (+1%)
  no-film-grade        avg=28.4 ms  p95=29.3 ms  max=29.4 ms  Δavg vs baseline=+0.0 ms (+0%)
  no postprocessing    avg=29.8 ms  p95=31.4 ms  max=31.4 ms  Δavg vs baseline=+1.5 ms (+5%)
  no mirrors           avg=28.8 ms  p95=29.3 ms  max=29.4 ms  Δavg vs baseline=+0.4 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
