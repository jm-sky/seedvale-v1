# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:06:29.634Z
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
Frames: 316
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-05-36-721Z-wituec
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
  avg: 29.6
  min: 12
  p1: 14

Frame time (wall-clock):
  avg: 33.8 ms
  p50: 35.5 ms
  p95: 47.6 ms
  p99: 71.4 ms
  max: 83 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.3 p95=9.3 p99=12.6 max=63.6 n=316
  render: p50=27.8 p95=38.3 p99=57.9 max=68.2 n=316
  frame: p50=35.5 p95=47.6 p99=71.4 max=83 n=316

Rendering (combined renderer.info):
  draw calls: 1879 avg / 2592 max
  triangles: 12.55M avg
  mirror draws: 347 avg
  geometries: 570
  textures: 508

Pass submissions (actual):
  reliability: observed
  frames: 316 shadowRefresh=316 shadowSkipped=0
  mirror calls avg: 347
  shadow calls avg: 431
  main calls avg: 1100

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
  fauna            draws=18 tris=6.5k meshes=18 inst=18
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
      mid  agents=3 camera-relevant=1 draws=16 tris=5.9k
      far  agents=48 camera-relevant=18 draws=194 tris=81.8k

Systems:
  WATER          4.0 ms
  NPC            1.8 ms
  FAUNA          1.6 ms
  PHYSICS        0.1 ms
  RENDER         22.5 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.8 ms draws=1855 tris=12.55M
  hide-grass         render=19.7 ms draws=1806 tris=5.86M
  hide-vegetation    render=18.9 ms draws=1813 tris=12.38M
  hide-vegetation-grass render=19.1 ms draws=1690 tris=5.51M
  hide-environment   render=19.2 ms draws=1764 tris=12.54M
  hide-settlement    render=11.7 ms draws=773 tris=11.43M
  hide-water         render=21.4 ms draws=1852 tris=12.32M
  hide-terrain       render=19.9 ms draws=1803 tris=8.61M
  hide-npc-fauna     render=11.3 ms draws=1652 tris=12.48M
  no-shadows         render=13.6 ms draws=1450 tris=10.53M
  no-ao              render=0.0 ms draws=0 tris=0
  no-bloom           render=0.0 ms draws=0 tris=0
  no-smaa            render=0.0 ms draws=0 tris=0
  no-god-rays        render=0.0 ms draws=0 tris=0
  no-film-grade      render=0.0 ms draws=0 tris=0
  no-postprocessing  render=3593.1 ms draws=1832 tris=12.55M
  no-reflections     render=0.0 ms draws=0 tris=0

Frame attribution:
  frame max: 83 ms
  largest labelled hitch: 0 ms
  unattributed: 83 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 83 ms

Raw sidecar:
  sampling=full factor=1 exported=316/316

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.8 ms/frame
  crowd pass: 0.0 ms/frame (2.6 ms cumulative)
  agent updates: 0.9 ms/frame (299.2 ms cumulative)
  livestock: 0.6 ms/frame (177.9 ms cumulative)
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
    nearest scans: 10.5/frame (0.0 candidates/frame)
    water samples: 21.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 21.3/frame, 0.00 ms/frame (worst call 0.10 ms, 1159.7 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.0
    behaviour executions/frame: 10.5
    presentation executions/frame: 10.5
  rats: 0.1 ms/frame (41.1 ms cumulative)
  social: 0.0 ms/frame (1.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (43.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.5 ms/frame (486.1 ms cumulative)
  forest sampling: 0.1 ms/frame (29.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.8 ms cumulative)
    targeting: 0.0 ms/frame (6.0 ms cumulative)
    decision: 0.0 ms/frame (4.3 ms cumulative)
    behaviour: 0.9 ms/frame (275.5 ms cumulative)
    life/presentation: 0.4 ms/frame (126.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.4
    full-rate agents/frame: 6.4
    reduced-cadence agents/frame: 23.6
    behaviour executions/frame: 19.4
    presentation executions/frame: 19.4

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 363.4
    player perception checks/frame: 30.0

  nearest scans: 28.4/frame (8977 calls)
  nearest candidates checked: 201.2/frame (63589 total)
  herd leader scans: 0.4/frame (111 calls)
  herd candidates checked: 10.5/frame (3330 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.7/frame (174.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 80.6/frame, 0.10 ms/frame (worst call 0.20 ms)
    collider queries: 80.6/frame, 0.10 ms/frame (worst call 0.90 ms, 5387.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 2
  empty builds (no instances): 0
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.25 ms
    max 0.40 ms

  allocation/setup:
    avg 0.05 ms
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
    avg 0.55 ms
    max 0.90 ms

  per chunk:
    instances avg/max 231932.5 / 260284
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 148534 / 315331
    matrix instances bound: 463865
    instanced attributes created: 40
    shared material refs: 8
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 2/2
    instances: 56264 (max 31364)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 2/2
    instances: 19010 (max 10411)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 2/2
    instances: 73260 (max 41652)
    allocation/setup avg/max: 0.05 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 2/2
    instances: 315331 (max 176857)
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
Lifecycle: req=0 complete=2 discard(unload=0,oor=0) cancel=0 streamIn=2 streamOut=0 invalidate=0
Finalization: observed completions=2

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 316
Shadow refresh frames: 316
Shadow skipped frames: 0

Mirror:
  calls avg: 347  tris avg: 906224
  info calls avg: 347  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=58 tris=10571
  settlement:decor             calls=83 tris=157678
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=32 tris=2184
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=894
  settlement:houseInteractive  calls=11 tris=1155
  settlement:houseStatic       calls=25 tris=18417
  settlement:landmarkGarden    calls=6 tris=52614
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=3740
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=8 tris=150
  settlement:storageBarrel     calls=6 tris=7612
  settlement:storageContainer  calls=22 tris=1344
  settlement:storageGoods      calls=29 tris=5974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=800
  settlement:storageWoodHousehold calls=7 tris=3119
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=8 tris=4503
  terrain                      calls=9 tris=626412
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 431  tris avg: 2022350
  info calls avg: 431  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=1 tris=51
  faunaFamily:fox              calls=8 tris=3696
  faunaFamily:horse            calls=8 tris=2182
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
  calls avg: 1100  tris avg: 9621145
  info calls avg: 1532  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=1 tris=332
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=776
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=20 tris=9810
  grass                        calls=49 tris=6690564
  items                        calls=1 tris=880
  npcFamily:Knight_Cloth       calls=24 tris=29113
  npcFamily:Peasant            calls=60 tris=66066
  npcFamily:Peasant_Boots      calls=33 tris=41134
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=12255
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=140 tris=21654
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 83ms
simulate        63.6ms
render          19.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.7ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA           58.9ms
PHYSICS          0.2ms
RENDER          13.4ms
OTHER            3.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.8 ms  p95=26.8 ms  max=27.7 ms  Δavg vs baseline=—
  hide-grass           avg=19.7 ms  p95=22.2 ms  max=22.4 ms  Δavg vs baseline=-2.1 ms (-10%)
  hide-vegetation      avg=18.9 ms  p95=21.5 ms  max=21.6 ms  Δavg vs baseline=-2.9 ms (-13%)
  no vegetation/grass  avg=19.1 ms  p95=23.6 ms  max=23.6 ms  Δavg vs baseline=-2.7 ms (-12%)
  hide-environment     avg=19.2 ms  p95=21.3 ms  max=21.5 ms  Δavg vs baseline=-2.6 ms (-12%)
  hide-settlement      avg=11.7 ms  p95=12.8 ms  max=13.2 ms  Δavg vs baseline=-10.0 ms (-46%)
  no water             avg=21.4 ms  p95=24.4 ms  max=24.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-terrain         avg=19.9 ms  p95=23.4 ms  max=23.6 ms  Δavg vs baseline=-1.9 ms (-9%)
  hide-npc-fauna       avg=11.3 ms  p95=13.2 ms  max=13.4 ms  Δavg vs baseline=-10.5 ms (-48%)
  no-shadows           avg=13.6 ms  p95=13.8 ms  max=13.8 ms  Δavg vs baseline=-8.2 ms (-38%)
  no-ao                avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-21.8 ms (-100%)
  no-bloom             avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-21.8 ms (-100%)
  no-smaa              avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-21.8 ms (-100%)
  no-god-rays          avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-21.8 ms (-100%)
  no-film-grade        avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-21.8 ms (-100%)
  no postprocessing    avg=3593.1 ms  p95=6812.8 ms  max=7170.5 ms  Δavg vs baseline=+3571.3 ms (+16401%)
  no mirrors           avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-21.8 ms (-100%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
