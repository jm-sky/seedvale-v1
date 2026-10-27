# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:39:39.418Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Frames: 278
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-38-59-237Z-i1nhwj
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
  min: 9
  p1: 10

Frame time (wall-clock):
  avg: 50.5 ms
  p50: 48.8 ms
  p95: 86.5 ms
  p99: 103.7 ms
  max: 110.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=11.5 p95=34.8 p99=60.9 max=61.7 n=278
  render: p50=36 p95=41.6 p99=55.1 max=96.3 n=278
  frame: p50=48.8 p95=86.5 p99=103.7 max=110.7 n=278

Rendering (combined renderer.info):
  draw calls: 2393 avg / 2778 max
  triangles: 7.86M avg
  mirror draws: 350 avg
  geometries: 1000
  textures: 1603

Pass submissions (actual):
  reliability: observed
  frames: 278 shadowRefresh=278 shadowSkipped=0
  mirror calls avg: 350
  shadow calls avg: 420
  main calls avg: 1623

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1515 tris=1.38M meshes=1515 inst=3581
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=509 tris=29.6k meshes=509 inst=511

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=805 tris=833.3k meshes=805 inst=2697
  npc              draws=42 tris=47.0k meshes=42 inst=42
  fauna            draws=15 tris=3.8k meshes=15 inst=15
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
      mid  agents=4 camera-relevant=4 draws=15 tris=3.8k
      far  agents=87 camera-relevant=17 draws=384 tris=148.4k

Systems:
  WATER          5.2 ms
  NPC            4.3 ms
  FAUNA          4.7 ms
  PHYSICS        0.1 ms
  RENDER         30.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=28.7 ms draws=2495 tris=8.09M
  hide-grass         render=28.8 ms draws=2393 tris=7.57M
  hide-vegetation    render=28.0 ms draws=2307 tris=6.96M
  hide-vegetation-grass render=26.9 ms draws=2132 tris=6.30M
  hide-environment   render=27.8 ms draws=2170 tris=8.01M
  hide-settlement    render=23.6 ms draws=1477 tris=6.97M
  hide-water         render=28.0 ms draws=2386 tris=6.90M
  hide-terrain       render=27.9 ms draws=2346 tris=3.81M
  hide-npc-fauna     render=18.8 ms draws=1904 tris=7.42M
  no-shadows         render=24.3 ms draws=2003 tris=5.69M
  no-ao              render=29.4 ms draws=2518 tris=8.20M
  no-bloom           render=28.5 ms draws=2391 tris=7.86M
  no-smaa            render=29.3 ms draws=2382 tris=7.85M
  no-god-rays        render=28.9 ms draws=2384 tris=7.85M
  no-film-grade      render=29.0 ms draws=2385 tris=7.85M
  no-postprocessing  render=27.9 ms draws=2291 tris=7.65M
  no-reflections     render=29.0 ms draws=2033 tris=6.86M

Frame attribution:
  frame max: 110.7 ms
  largest labelled hitch: 0 ms
  unattributed: 110.7 ms

Long frames:
  threshold: 80 ms
  count: 17
  worst: 110.7 ms

Raw sidecar:
  sampling=full factor=1 exported=278/278

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.3 ms/frame
  crowd pass: 0.0 ms/frame (3.6 ms cumulative)
  agent updates: 2.5 ms/frame (690.4 ms cumulative)
  livestock: 1.4 ms/frame (381.6 ms cumulative)
    loaded tick: 1.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 55.8
    unique animals/frame: 49.8
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 12.9
    dog guard scans: 12.9/frame (103.5 predator candidates/frame)
    pest scans: 7.0/frame (7.0 rat candidates/frame)
    nearest scans: 29.6/frame (0.0 candidates/frame)
    water samples: 59.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 59.3/frame, 0.10 ms/frame (worst call 0.20 ms, 13023.5 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 55.6
    behaviour executions/frame: 29.8
    presentation executions/frame: 29.8
  rats: 0.1 ms/frame (29.6 ms cumulative)
  social: 0.0 ms/frame (1.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (59.3 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 4.7 ms/frame
  agent updates: 4.7 ms/frame (1299.4 ms cumulative)
  forest sampling: 0.1 ms/frame (30.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.4 ms cumulative)
    targeting: 0.0 ms/frame (5.9 ms cumulative)
    decision: 0.0 ms/frame (3.3 ms cumulative)
    behaviour: 3.8 ms/frame (1061.0 ms cumulative)
    life/presentation: 0.6 ms/frame (157.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.0
    decision passes/frame: 29.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.7
    full-rate agents/frame: 8.4
    reduced-cadence agents/frame: 20.6
    behaviour executions/frame: 18.7
    presentation executions/frame: 18.7

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 115.4
    village scan candidates/frame: 1604.6
    player perception checks/frame: 29.0

  nearest scans: 24.3/frame (6763 calls)
  nearest candidates checked: 426.8/frame (118653 total)
  herd leader scans: 0.0/frame (13 calls)
  herd candidates checked: 1.4/frame (390 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.6/frame (179.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 83.4/frame, 0.10 ms/frame (worst call 0.60 ms)
    collider queries: 83.4/frame, 0.10 ms/frame (worst call 0.30 ms, 1483.4 colliders/frame)

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
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 278
Shadow refresh frames: 278
Shadow skipped frames: 0

Mirror:
  calls avg: 350  tris avg: 988150
  info calls avg: 350  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=623
  other                        calls=38 tris=2232
  settlement:decor             calls=1 tris=831
  settlement:fence             calls=2 tris=9254
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=45 tris=3089
  settlement:fireHouseInteriorLamp calls=5 tris=535
  settlement:fireVillageTorch  calls=5 tris=353
  settlement:houseInteractive  calls=15 tris=1633
  settlement:houseStatic       calls=33 tris=79992
  settlement:landmarkGarden    calls=5 tris=82046
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=922
  settlement:landmarkWellHousehold calls=5 tris=9283
  settlement:landmarkWellPasture calls=2 tris=922
  settlement:other             calls=9 tris=346
  settlement:storageBarrel     calls=4 tris=11674
  settlement:storageContainer  calls=28 tris=2298
  settlement:storageGoods      calls=39 tris=6903
  settlement:storageHay        calls=1 tris=484
  settlement:storageTrough     calls=4 tris=1688
  settlement:storageWoodHousehold calls=10 tris=4410
  settlement:storageWoodSettlementPrimary calls=1 tris=1059
  settlement:storageWoodSettlementSecondary calls=1 tris=2775
  settlement:workplace         calls=11 tris=5234
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 420  tris avg: 2175438
  info calls avg: 420  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=2 tris=217
  faunaFamily:cow              calls=1 tris=282
  faunaFamily:dog              calls=6 tris=2034
  faunaFamily:donkey           calls=1 tris=201
  faunaFamily:sheep            calls=4 tris=1176
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4083
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=2 tris=2354
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
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1623  tris avg: 4697738
  info calls avg: 2044  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1930
  faunaFamily:cow              calls=7 tris=2424
  faunaFamily:dog              calls=35 tris=11586
  faunaFamily:donkey           calls=7 tris=1978
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3961
  faunaFamily:sheep            calls=12 tris=3800
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15157
  npcFamily:Herbalist          calls=25 tris=27045
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=165 tris=182116
  npcFamily:Peasant_Boots      calls=42 tris=48211
  npcFamily:Wizard             calls=60 tris=56626
  npcFamily:blacksmith         calls=36 tris=38419
  npcFamily:woodcutter         calls=17 tris=15264
  other                        calls=129 tris=14892
  settlement:decor             calls=2 tris=1665
  settlement:fence             calls=4 tris=18527
  settlement:fireCampfire      calls=36 tris=452
  settlement:fireHouseExteriorLamp calls=80 tris=5569
  settlement:fireHouseInteriorLamp calls=10 tris=1072
  settlement:fireVillageTorch  calls=15 tris=1065
  settlement:houseInteractive  calls=30 tris=3275
  settlement:houseStatic       calls=66 tris=160239
  settlement:landmarkGarden    calls=12 tris=209320
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3720
  settlement:landmarkWellHousehold calls=10 tris=18599
  settlement:landmarkWellPasture calls=5 tris=1850
  settlement:other             calls=22 tris=754
  settlement:storageBarrel     calls=12 tris=26162
  settlement:storageContainer  calls=58 tris=4858
  settlement:storageGoods      calls=78 tris=13842
  settlement:storageHay        calls=2 tris=971
  settlement:storageTrough     calls=8 tris=3383
  settlement:storageWoodHousehold calls=18 tris=7952
  settlement:storageWoodSettlementPrimary calls=4 tris=4273
  settlement:storageWoodSettlementSecondary calls=4 tris=11203
  settlement:workplace         calls=37 tris=15406
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 17
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 17 total):

[LONG FRAME] 110.7ms
simulate        14.2ms
render          96.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              5.4ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER          96.3ms
OTHER            7.6ms

Long frame #2:

[LONG FRAME] 105.2ms
simulate        59.9ms
render          45.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           11.2ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           50.2ms
PHYSICS          0.1ms
RENDER          34.0ms
OTHER            5.6ms

Long frame #3:

[LONG FRAME] 103.9ms
simulate        61.7ms
render          41.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.3ms
STREAMING        0.0ms
NPC              3.8ms
FAUNA           52.5ms
PHYSICS          0.1ms
RENDER          32.2ms
OTHER            6.0ms

Long frame #4:

[LONG FRAME] 103.6ms
simulate        55.7ms
render          47.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.7ms
STREAMING        0.1ms
NPC              3.9ms
FAUNA           46.5ms
PHYSICS          0.1ms
RENDER          39.1ms
OTHER            5.2ms

streaming / stages:
  chunkUpdate                  0.1ms

Long frame #5:

[LONG FRAME] 100.1ms
simulate        61.1ms
render          38.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.0ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           51.3ms
PHYSICS          0.0ms
RENDER          28.8ms
OTHER            6.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=28.7 ms  p95=30.1 ms  max=30.3 ms  Δavg vs baseline=—
  hide-grass           avg=28.8 ms  p95=29.5 ms  max=29.5 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-vegetation      avg=28.0 ms  p95=28.8 ms  max=29.0 ms  Δavg vs baseline=-0.6 ms (-2%)
  no vegetation/grass  avg=26.9 ms  p95=28.3 ms  max=28.3 ms  Δavg vs baseline=-1.7 ms (-6%)
  hide-environment     avg=27.8 ms  p95=29.4 ms  max=29.7 ms  Δavg vs baseline=-0.9 ms (-3%)
  hide-settlement      avg=23.6 ms  p95=25.0 ms  max=25.3 ms  Δavg vs baseline=-5.0 ms (-17%)
  no water             avg=28.0 ms  p95=29.4 ms  max=29.6 ms  Δavg vs baseline=-0.7 ms (-2%)
  hide-terrain         avg=27.9 ms  p95=28.9 ms  max=29.0 ms  Δavg vs baseline=-0.8 ms (-3%)
  hide-npc-fauna       avg=18.8 ms  p95=20.2 ms  max=20.3 ms  Δavg vs baseline=-9.8 ms (-34%)
  no-shadows           avg=24.3 ms  p95=26.3 ms  max=26.6 ms  Δavg vs baseline=-4.3 ms (-15%)
  no-ao                avg=29.4 ms  p95=30.9 ms  max=31.1 ms  Δavg vs baseline=+0.7 ms (+3%)
  no-bloom             avg=28.5 ms  p95=28.9 ms  max=28.9 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=29.3 ms  p95=31.6 ms  max=32.1 ms  Δavg vs baseline=+0.6 ms (+2%)
  no-god-rays          avg=28.9 ms  p95=29.5 ms  max=29.6 ms  Δavg vs baseline=+0.3 ms (+1%)
  no-film-grade        avg=29.0 ms  p95=29.8 ms  max=29.9 ms  Δavg vs baseline=+0.4 ms (+1%)
  no postprocessing    avg=27.9 ms  p95=29.4 ms  max=29.6 ms  Δavg vs baseline=-0.7 ms (-3%)
  no mirrors           avg=29.0 ms  p95=30.3 ms  max=30.4 ms  Δavg vs baseline=+0.4 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
