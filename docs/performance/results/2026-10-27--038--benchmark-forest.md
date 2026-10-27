# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:13:43.556Z
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
Frames: 300
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-12-46-211Z-m4ju7e
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
  avg: 28.9
  min: 12
  p1: 19

Frame time (wall-clock):
  avg: 34.6 ms
  p50: 36.6 ms
  p95: 47.7 ms
  p99: 52.6 ms
  max: 80.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.3 p95=10.3 p99=33.7 max=61.7 n=300
  render: p50=28.3 p95=36.4 p99=42.4 max=55.2 n=300
  frame: p50=36.6 p95=47.7 p99=52.6 max=80.4 n=300

Rendering (combined renderer.info):
  draw calls: 1898 avg / 2607 max
  triangles: 12.56M avg
  mirror draws: 349 avg
  geometries: 567
  textures: 529

Pass submissions (actual):
  reliability: observed
  frames: 300 shadowRefresh=300 shadowSkipped=0
  mirror calls avg: 349
  shadow calls avg: 431
  main calls avg: 1118

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
  fauna            draws=20 tris=10.5k meshes=20 inst=20
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
      mid  agents=4 camera-relevant=2 draws=18 tris=9.9k
      far  agents=47 camera-relevant=15 draws=192 tris=77.8k

Systems:
  WATER          4.2 ms
  NPC            1.8 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         22.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.7 ms draws=1968 tris=12.86M
  hide-grass         render=19.5 ms draws=1689 tris=5.56M
  hide-vegetation    render=20.5 ms draws=1804 tris=12.38M
  hide-vegetation-grass render=18.8 ms draws=1755 tris=5.69M
  hide-environment   render=18.4 ms draws=1760 tris=12.54M
  hide-settlement    render=12.7 ms draws=758 tris=11.34M
  hide-water         render=20.5 ms draws=1849 tris=12.32M
  hide-terrain       render=17.8 ms draws=1733 tris=8.55M
  hide-npc-fauna     render=12.2 ms draws=1586 tris=12.30M
  no-shadows         render=12.8 ms draws=1447 tris=10.53M
  no-ao              render=17.0 ms draws=1735 tris=12.25M
  no-bloom           render=15.8 ms draws=1845 tris=12.55M
  no-smaa            render=21.6 ms draws=1855 tris=12.55M
  no-god-rays        render=22.0 ms draws=1857 tris=12.55M
  no-film-grade      render=20.0 ms draws=1859 tris=12.55M
  no-postprocessing  render=16.6 ms draws=2176 tris=13.46M
  no-reflections     render=19.0 ms draws=1518 tris=11.65M

Frame attribution:
  frame max: 80.4 ms
  largest labelled hitch: 0 ms
  unattributed: 80.4 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 80.4 ms

Raw sidecar:
  sampling=full factor=1 exported=300/300

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.8 ms/frame
  crowd pass: 0.0 ms/frame (2.1 ms cumulative)
  agent updates: 1.0 ms/frame (290.9 ms cumulative)
  livestock: 0.6 ms/frame (165.3 ms cumulative)
    loaded tick: 0.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
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
    water samples: 18.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 18.4/frame, 0.00 ms/frame (worst call 0.10 ms, 1085.0 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 18.8
    behaviour executions/frame: 10.6
    presentation executions/frame: 10.6
  rats: 0.1 ms/frame (42.7 ms cumulative)
  social: 0.0 ms/frame (1.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (40.4 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.1 ms/frame (620.2 ms cumulative)
  forest sampling: 0.1 ms/frame (26.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.4 ms cumulative)
    targeting: 0.0 ms/frame (5.5 ms cumulative)
    decision: 0.0 ms/frame (4.6 ms cumulative)
    behaviour: 1.3 ms/frame (402.4 ms cumulative)
    life/presentation: 0.4 ms/frame (133.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.7
    full-rate agents/frame: 7.4
    reduced-cadence agents/frame: 22.6
    behaviour executions/frame: 19.7
    presentation executions/frame: 19.7

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 365.5
    player perception checks/frame: 30.0

  nearest scans: 28.5/frame (8559 calls)
  nearest candidates checked: 202.3/frame (60687 total)
  herd leader scans: 0.3/frame (79 calls)
  herd candidates checked: 7.9/frame (2370 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 27.1/frame (171.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 100.3/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 100.3/frame, 0.10 ms/frame (worst call 0.30 ms, 6702.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 0
  empty builds (no instances): 1
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.00 ms
    max 0.00 ms

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
    avg 0.00 ms
    max 0.00 ms

  per chunk:
    instances avg/max 0.0 / 0
    meshes avg/max 0.00 / 0
    geometries avg/max 0.00 / 0
    geometries after lod apply avg/max 0.00 / 0
    instances full/filler: 0 / 0
    matrix instances bound: 0
    instanced attributes created: 0
    shared material refs: 0
  heap delta: (performance.memory unavailable)

  by species bucket:
  tri:
    buckets/meshes: 0/0
    instances: 0 (max 0)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 0/0
    instances: 0 (max 0)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 0/0
    instances: 0 (max 0)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 0/0
    instances: 0 (max 0)
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
Lifecycle: req=0 complete=1 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: observed completions=1

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 300
Shadow refresh frames: 300
Shadow skipped frames: 0

Mirror:
  calls avg: 349  tris avg: 909536
  info calls avg: 349  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=59 tris=10579
  settlement:decor             calls=84 tris=160982
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
  calls avg: 431  tris avg: 2023847
  info calls avg: 431  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=8 tris=3696
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=1548
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
  calls avg: 1118  tris avg: 9626764
  info calls avg: 1549  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=17 tris=5117
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=2 tris=1213
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=19 tris=9332
  grass                        calls=49 tris=6690564
  items                        calls=1 tris=880
  npcFamily:Knight_Cloth       calls=24 tris=29113
  npcFamily:Peasant            calls=60 tris=66066
  npcFamily:Peasant_Boots      calls=33 tris=41134
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=12255
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=142 tris=21666
  settlement:decor             calls=162 tris=311962
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

[LONG FRAME] 80.4ms
simulate        61.7ms
render          18.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.9ms
FAUNA           56.3ms
PHYSICS          0.1ms
RENDER          18.2ms
OTHER            3.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.7 ms  p95=22.8 ms  max=22.8 ms  Δavg vs baseline=—
  hide-grass           avg=19.5 ms  p95=22.8 ms  max=23.4 ms  Δavg vs baseline=-2.1 ms (-10%)
  hide-vegetation      avg=20.5 ms  p95=25.5 ms  max=26.1 ms  Δavg vs baseline=-1.1 ms (-5%)
  no vegetation/grass  avg=18.8 ms  p95=21.9 ms  max=22.2 ms  Δavg vs baseline=-2.8 ms (-13%)
  hide-environment     avg=18.4 ms  p95=20.0 ms  max=20.4 ms  Δavg vs baseline=-3.3 ms (-15%)
  hide-settlement      avg=12.7 ms  p95=13.4 ms  max=13.5 ms  Δavg vs baseline=-8.9 ms (-41%)
  no water             avg=20.5 ms  p95=23.8 ms  max=24.0 ms  Δavg vs baseline=-1.2 ms (-6%)
  hide-terrain         avg=17.8 ms  p95=21.3 ms  max=21.8 ms  Δavg vs baseline=-3.9 ms (-18%)
  hide-npc-fauna       avg=12.2 ms  p95=13.2 ms  max=13.4 ms  Δavg vs baseline=-9.4 ms (-44%)
  no-shadows           avg=12.8 ms  p95=13.4 ms  max=13.5 ms  Δavg vs baseline=-8.8 ms (-41%)
  no-ao                avg=17.0 ms  p95=17.4 ms  max=17.5 ms  Δavg vs baseline=-4.7 ms (-22%)
  no-bloom             avg=15.8 ms  p95=17.8 ms  max=18.0 ms  Δavg vs baseline=-5.9 ms (-27%)
  no-smaa              avg=21.6 ms  p95=32.0 ms  max=34.1 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-god-rays          avg=22.0 ms  p95=25.5 ms  max=25.9 ms  Δavg vs baseline=+0.3 ms (+1%)
  no-film-grade        avg=20.0 ms  p95=22.4 ms  max=22.5 ms  Δavg vs baseline=-1.7 ms (-8%)
  no postprocessing    avg=16.6 ms  p95=16.6 ms  max=16.6 ms  Δavg vs baseline=-5.1 ms (-23%)
  no mirrors           avg=19.0 ms  p95=19.0 ms  max=19.0 ms  Δavg vs baseline=-2.7 ms (-12%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
