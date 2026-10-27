# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:10:07.474Z
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

Scenario: forest
Duration: 30s
Frames: 315
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-09-10-217Z-tetn2o
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 29.2
  min: 8
  p1: 13

Frame time (wall-clock):
  avg: 34.3 ms
  p50: 36.1 ms
  p95: 46.2 ms
  p99: 78.4 ms
  max: 124.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.4 p95=9.6 p99=41.5 max=102.1 n=315
  render: p50=26.6 p95=37.1 p99=53.4 max=71.5 n=315
  frame: p50=36.1 p95=46.2 p99=78.4 max=124.6 n=315

Rendering (combined renderer.info):
  draw calls: 1879 avg / 2579 max
  triangles: 12.56M avg
  mirror draws: 349 avg
  geometries: 560
  textures: 494

Pass submissions (actual):
  reliability: observed
  frames: 315 shadowRefresh=315 shadowSkipped=0
  mirror calls avg: 349
  shadow calls avg: 431
  main calls avg: 1099

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=84 tris=7.46M meshes=84 inst=562716
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=722 tris=693.5k meshes=722 inst=1320
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=164 tris=16.0k meshes=164 inst=164
  other            draws=231 tris=25.9k meshes=231 inst=231

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  npc              draws=18 tris=24.2k meshes=18 inst=18
  fauna            draws=16 tris=8.6k meshes=16 inst=16
  items            draws=21 tris=12.6k meshes=21 inst=21
  other            draws=105 tris=14.4k meshes=105 inst=105

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=20 tris=8.9k meshes=20 inst=20
  storageContainer draws=32 tris=3.5k meshes=32 inst=46
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.2k meshes=8 inst=22
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=29 tris=540 meshes=29 inst=29

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=9 draws=82 tris=101.0k skinned=82/82
      Peasant_Boots    agents=4 draws=38 tris=49.3k skinned=38/38
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Wizard           agents=2 draws=24 tris=23.8k skinned=24/24
      blacksmith       agents=1 draws=10 tris=12.3k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      near agents=2 camera-relevant=2 draws=18 tris=24.2k
      far  agents=18 camera-relevant=11 draws=174 tris=211.8k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=3 draws=24 tris=6.5k skinned=24/24
      dog              agents=4 draws=23 tris=7.8k skinned=23/23
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      sheep            agents=8 draws=16 tris=4.9k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      chicken          agents=3 draws=15 tris=1.9k skinned=0/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      near agents=1 camera-relevant=1 draws=2 tris=610
      mid  agents=3 camera-relevant=2 draws=14 tris=8.0k
      far  agents=48 camera-relevant=15 draws=196 tris=79.7k

Systems:
  WATER          4.1 ms
  NPC            1.9 ms
  FAUNA          2.2 ms
  PHYSICS        0.1 ms
  RENDER         22.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.1 ms draws=1849 tris=12.55M
  hide-grass         render=20.6 ms draws=1800 tris=5.86M
  hide-vegetation    render=18.7 ms draws=1801 tris=12.38M
  hide-vegetation-grass render=19.1 ms draws=1684 tris=5.51M
  hide-environment   render=17.9 ms draws=1688 tris=12.36M
  hide-settlement    render=12.3 ms draws=765 tris=11.43M
  hide-water         render=21.2 ms draws=1913 tris=12.50M
  hide-terrain       render=20.5 ms draws=1795 tris=8.61M
  hide-npc-fauna     render=13.9 ms draws=1516 tris=12.12M
  no-shadows         render=11.5 ms draws=1785 tris=11.43M
  no-ao              render=17.7 ms draws=1845 tris=12.55M
  no-bloom           render=16.9 ms draws=1771 tris=12.37M
  no-smaa            render=31.2 ms draws=1963 tris=12.85M
  no-god-rays        render=21.4 ms draws=1852 tris=12.55M
  no-film-grade      render=20.8 ms draws=1853 tris=12.55M
  no-postprocessing  render=13.8 ms draws=1488 tris=11.64M
  no-reflections     render=0.0 ms draws=0 tris=0

Frame attribution:
  frame max: 124.6 ms
  largest labelled hitch: 0 ms
  unattributed: 124.6 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 124.6 ms

Raw sidecar:
  sampling=full factor=1 exported=315/315

Recommendation:
Largest frame (124.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.9 ms/frame
  crowd pass: 0.0 ms/frame (3.1 ms cumulative)
  agent updates: 1.0 ms/frame (303.8 ms cumulative)
  livestock: 0.6 ms/frame (181.3 ms cumulative)
    loaded tick: 0.6 ms/frame
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
    update calls/frame: 19.0
    unique animals/frame: 19.0
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.0 predator candidates/frame)
    pest scans: 1.9/frame (1.9 rat candidates/frame)
    nearest scans: 10.4/frame (0.0 candidates/frame)
    water samples: 20.1/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 20.1/frame, 0.00 ms/frame (worst call 0.10 ms, 1145.2 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 18.6
    behaviour executions/frame: 10.7
    presentation executions/frame: 10.6
  rats: 0.2 ms/frame (54.0 ms cumulative)
  social: 0.0 ms/frame (2.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (42.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.2 ms/frame
  agent updates: 2.1 ms/frame (672.4 ms cumulative)
  forest sampling: 0.1 ms/frame (31.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.4 ms cumulative)
    targeting: 0.0 ms/frame (7.6 ms cumulative)
    decision: 0.0 ms/frame (4.6 ms cumulative)
    behaviour: 1.4 ms/frame (451.6 ms cumulative)
    life/presentation: 0.4 ms/frame (128.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 20.7
    full-rate agents/frame: 9.6
    reduced-cadence agents/frame: 20.4
    behaviour executions/frame: 20.7
    presentation executions/frame: 20.7

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 365.5
    player perception checks/frame: 30.0

  nearest scans: 28.9/frame (9118 calls)
  nearest candidates checked: 198.7/frame (62595 total)
  herd leader scans: 0.2/frame (75 calls)
  herd candidates checked: 7.1/frame (2250 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 28.8/frame (202.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 208.6/frame, 0.20 ms/frame (worst call 2.00 ms)
    collider queries: 208.6/frame, 0.10 ms/frame (worst call 1.40 ms, 11449.4 colliders/frame)

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
    avg 0.00 ms
    max 0.00 ms
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
    avg 0.50 ms
    max 0.50 ms

  per chunk:
    instances avg/max 260284.0 / 260284
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 83427 / 176857
    matrix instances bound: 260284
    instanced attributes created: 20
    shared material refs: 4
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 1/1
    instances: 31364 (max 31364)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 1/1
    instances: 10411 (max 10411)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 1/1
    instances: 41652 (max 41652)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 1/1
    instances: 176857 (max 176857)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=616454 filler=1247320
Submitted instances: full=265630 filler=297074
Meshes submitted: 72
LOD submitted fraction: full=0.43089995360562183 filler=0.23816983612865986
Flowers: unavailable
Allocation bytes (estimated): 178922304
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=1 discard(unload=0,oor=0) cancel=0 streamIn=1 streamOut=0 invalidate=0
Finalization: observed completions=1

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 315
Shadow refresh frames: 315
Shadow skipped frames: 0

Mirror:
  calls avg: 349  tris avg: 909534
  info calls avg: 349  residual calls avg: 0
  environment                  calls=1 tris=435
  other                        calls=58 tris=10605
  settlement:decor             calls=84 tris=158612
  settlement:fence             calls=2 tris=3242
  settlement:fireCampfire      calls=4 tris=310
  settlement:fireHouseExteriorLamp calls=32 tris=2191
  settlement:fireHouseInteriorLamp calls=4 tris=379
  settlement:fireVillageTorch  calls=13 tris=897
  settlement:houseInteractive  calls=11 tris=1159
  settlement:houseStatic       calls=25 tris=18475
  settlement:landmarkGarden    calls=6 tris=52781
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1876
  settlement:landmarkWellHousehold calls=5 tris=3752
  settlement:landmarkWellPasture calls=3 tris=938
  settlement:other             calls=8 tris=150
  settlement:storageBarrel     calls=6 tris=7636
  settlement:storageContainer  calls=22 tris=1348
  settlement:storageGoods      calls=29 tris=5993
  settlement:storageHay        calls=1 tris=490
  settlement:storageTrough     calls=3 tris=803
  settlement:storageWoodHousehold calls=7 tris=3128
  settlement:storageWoodSettlementPrimary calls=2 tris=894
  settlement:workplace         calls=8 tris=4517
  terrain                      calls=9 tris=628401
  vegetation                   calls=2 tris=678

Shadow (refresh only):
  calls avg: 431  tris avg: 2025839
  info calls avg: 431  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=7 tris=3397
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=2 tris=3839
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=66 tris=13542
  settlement:decor             calls=196 tris=384574
  settlement:fireHouseInteriorLamp calls=2 tris=216
  settlement:houseInteractive  calls=4 tris=628
  settlement:houseStatic       calls=23 tris=10310
  settlement:landmarkGarden    calls=1 tris=800
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=8 tris=804
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=4 tris=1782
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1099  tris avg: 9620640
  info calls avg: 1530  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=858
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=19 tris=9560
  grass                        calls=49 tris=6690564
  items                        calls=1 tris=880
  npcFamily:Knight_Cloth       calls=24 tris=29113
  npcFamily:Peasant            calls=60 tris=66066
  npcFamily:Peasant_Boots      calls=33 tris=41134
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=12255
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=140 tris=21650
  settlement:decor             calls=161 tris=311098
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=63 tris=4368
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=50 tris=36834
  settlement:landmarkGarden    calls=12 tris=105228
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=16 tris=300
  settlement:storageBarrel     calls=12 tris=15224
  settlement:storageContainer  calls=43 tris=2688
  settlement:storageGoods      calls=58 tris=11948
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=1600
  settlement:storageWoodHousehold calls=14 tris=6237
  settlement:storageWoodSettlementPrimary calls=4 tris=1782
  settlement:workplace         calls=16 tris=9006
  terrain                      calls=26 tris=1916120
  vegetation                   calls=6 tris=1958
  water                        calls=4 tris=229376


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

[LONG FRAME] 124.6ms
simulate       102.1ms
render          22.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.2ms
STREAMING        0.0ms
NPC              3.3ms
FAUNA           94.6ms
PHYSICS          0.2ms
RENDER          16.3ms
OTHER            4.0ms

Long frame #2:

[LONG FRAME] 105.5ms
simulate        84.2ms
render          21.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.1ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA           79.0ms
PHYSICS          0.1ms
RENDER          14.1ms
OTHER            3.4ms

Long frame #3:

[LONG FRAME] 100.5ms
simulate        82.6ms
render          17.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA           77.2ms
PHYSICS          0.1ms
RENDER          17.6ms
OTHER            4.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.1 ms  p95=26.8 ms  max=27.5 ms  Δavg vs baseline=—
  hide-grass           avg=20.6 ms  p95=23.1 ms  max=23.4 ms  Δavg vs baseline=-1.5 ms (-7%)
  hide-vegetation      avg=18.7 ms  p95=21.3 ms  max=21.5 ms  Δavg vs baseline=-3.4 ms (-15%)
  no vegetation/grass  avg=19.1 ms  p95=22.6 ms  max=23.1 ms  Δavg vs baseline=-3.0 ms (-14%)
  hide-environment     avg=17.9 ms  p95=18.2 ms  max=18.2 ms  Δavg vs baseline=-4.2 ms (-19%)
  hide-settlement      avg=12.3 ms  p95=13.0 ms  max=13.0 ms  Δavg vs baseline=-9.8 ms (-44%)
  no water             avg=21.2 ms  p95=24.6 ms  max=25.1 ms  Δavg vs baseline=-0.9 ms (-4%)
  hide-terrain         avg=20.5 ms  p95=23.6 ms  max=23.9 ms  Δavg vs baseline=-1.7 ms (-7%)
  hide-npc-fauna       avg=13.9 ms  p95=19.3 ms  max=20.9 ms  Δavg vs baseline=-8.2 ms (-37%)
  no-shadows           avg=11.5 ms  p95=11.5 ms  max=11.5 ms  Δavg vs baseline=-10.6 ms (-48%)
  no-ao                avg=17.7 ms  p95=19.7 ms  max=20.2 ms  Δavg vs baseline=-4.5 ms (-20%)
  no-bloom             avg=16.9 ms  p95=18.3 ms  max=18.6 ms  Δavg vs baseline=-5.2 ms (-23%)
  no-smaa              avg=31.2 ms  p95=34.2 ms  max=34.3 ms  Δavg vs baseline=+9.1 ms (+41%)
  no-god-rays          avg=21.4 ms  p95=24.2 ms  max=24.3 ms  Δavg vs baseline=-0.7 ms (-3%)
  no-film-grade        avg=20.8 ms  p95=23.7 ms  max=23.7 ms  Δavg vs baseline=-1.3 ms (-6%)
  no postprocessing    avg=13.8 ms  p95=13.8 ms  max=13.8 ms  Δavg vs baseline=-8.3 ms (-38%)
  no mirrors           avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-22.1 ms (-100%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
