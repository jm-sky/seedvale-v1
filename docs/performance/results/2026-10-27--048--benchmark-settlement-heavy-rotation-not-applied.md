# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:47:04.782Z
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
Frames: 250
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-46-24-469Z-4e31vk
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
  avg: 18.9
  min: 2
  p1: 7

Frame time (wall-clock):
  avg: 52.9 ms
  p50: 49.6 ms
  p95: 86.7 ms
  p99: 139.4 ms
  max: 430.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=11.3 p95=36.3 p99=101.8 max=108.1 n=250
  render: p50=35.8 p95=43.1 p99=44.4 max=422.3 n=250
  frame: p50=49.6 p95=86.7 p99=139.4 max=430.8 n=250

Rendering (combined renderer.info):
  draw calls: 2313 avg / 2694 max
  triangles: 7.85M avg
  mirror draws: 350 avg
  geometries: 1046
  textures: 2206

Pass submissions (actual):
  reliability: observed
  frames: 250 shadowRefresh=250 shadowSkipped=0
  mirror calls avg: 350
  shadow calls avg: 415
  main calls avg: 1548

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1515 tris=1.37M meshes=1515 inst=3581
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=508 tris=29.4k meshes=508 inst=510

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=807 tris=831.5k meshes=807 inst=2699
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=113 tris=14.6k meshes=113 inst=113

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
      far  agents=51 camera-relevant=19 draws=500 tris=597.8k
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
  WATER          5.6 ms
  NPC            4.5 ms
  FAUNA          4.8 ms
  PHYSICS        0.1 ms
  RENDER         32.4 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=29.4 ms draws=2320 tris=7.86M
  hide-grass         render=29.3 ms draws=2360 tris=7.74M
  hide-vegetation    render=28.5 ms draws=2085 tris=6.62M
  hide-vegetation-grass render=28.1 ms draws=2119 tris=6.47M
  hide-environment   render=27.6 ms draws=2104 tris=7.82M
  hide-settlement    render=24.4 ms draws=1437 tris=7.13M
  hide-water         render=29.0 ms draws=2312 tris=6.89M
  hide-terrain       render=28.6 ms draws=2202 tris=3.72M
  hide-npc-fauna     render=18.4 ms draws=1873 tris=7.56M
  no-shadows         render=25.3 ms draws=1917 tris=5.69M
  no-ao              render=28.5 ms draws=2378 tris=8.06M
  no-bloom           render=28.9 ms draws=2371 tris=8.06M
  no-smaa            render=29.8 ms draws=2315 tris=7.88M
  no-god-rays        render=29.0 ms draws=2317 tris=7.88M
  no-film-grade      render=29.4 ms draws=2296 tris=7.85M
  no-postprocessing  render=32.2 ms draws=2272 tris=7.85M
  no-reflections     render=29.3 ms draws=1944 tris=6.86M

Frame attribution:
  frame max: 430.8 ms
  largest labelled hitch: 0 ms
  unattributed: 430.8 ms

Long frames:
  threshold: 80 ms
  count: 14
  worst: 430.8 ms

Raw sidecar:
  sampling=full factor=1 exported=250/250

Recommendation:
Largest frame (430.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.5 ms/frame
  crowd pass: 0.0 ms/frame (5.3 ms cumulative)
  agent updates: 2.6 ms/frame (644.5 ms cumulative)
  livestock: 1.5 ms/frame (383.5 ms cumulative)
    loaded tick: 1.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 55.7
    unique animals/frame: 49.8
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 12.9
    dog guard scans: 12.9/frame (103.4 predator candidates/frame)
    pest scans: 7.0/frame (7.0 rat candidates/frame)
    nearest scans: 28.9/frame (0.0 candidates/frame)
    water samples: 65.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 65.1/frame, 0.10 ms/frame (worst call 0.30 ms, 13635.5 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 55.1
    behaviour executions/frame: 29.6
    presentation executions/frame: 29.6
  rats: 0.1 ms/frame (28.3 ms cumulative)
  social: 0.0 ms/frame (2.0 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (54.5 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 4.8 ms/frame
  agent updates: 4.7 ms/frame (1180.5 ms cumulative)
  forest sampling: 0.1 ms/frame (27.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.1 ms cumulative)
    targeting: 0.0 ms/frame (7.9 ms cumulative)
    decision: 0.0 ms/frame (3.3 ms cumulative)
    behaviour: 3.9 ms/frame (969.9 ms cumulative)
    life/presentation: 0.5 ms/frame (131.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.8
    full-rate agents/frame: 7.7
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 18.8
    presentation executions/frame: 18.8

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 119.3
    village scan candidates/frame: 1601.1
    player perception checks/frame: 30.0

  nearest scans: 24.9/frame (6225 calls)
  nearest candidates checked: 435.7/frame (108921 total)
  herd leader scans: 0.3/frame (66 calls)
  herd candidates checked: 7.9/frame (1980 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.4/frame (177.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 115.9/frame, 0.10 ms/frame (worst call 0.30 ms)
    collider queries: 115.9/frame, 0.10 ms/frame (worst call 0.20 ms, 2009.6 colliders/frame)

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
Frames: 250
Shadow refresh frames: 250
Shadow skipped frames: 0

Mirror:
  calls avg: 350  tris avg: 988957
  info calls avg: 350  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=627
  other                        calls=37 tris=2226
  settlement:decor             calls=1 tris=833
  settlement:fence             calls=2 tris=9271
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=45 tris=3103
  settlement:fireHouseInteriorLamp calls=5 tris=537
  settlement:fireVillageTorch  calls=5 tris=355
  settlement:houseInteractive  calls=15 tris=1641
  settlement:houseStatic       calls=33 tris=80219
  settlement:landmarkGarden    calls=5 tris=82382
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=928
  settlement:landmarkWellHousehold calls=5 tris=9313
  settlement:landmarkWellPasture calls=2 tris=928
  settlement:other             calls=9 tris=348
  settlement:storageBarrel     calls=4 tris=11714
  settlement:storageContainer  calls=28 tris=2306
  settlement:storageGoods      calls=39 tris=6935
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1694
  settlement:storageWoodHousehold calls=10 tris=4430
  settlement:storageWoodSettlementPrimary calls=1 tris=1065
  settlement:storageWoodSettlementSecondary calls=1 tris=2793
  settlement:workplace         calls=11 tris=5260
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 415  tris avg: 2172481
  info calls avg: 415  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=0 tris=49
  faunaFamily:dog              calls=6 tris=1950
  faunaFamily:donkey           calls=1 tris=232
  faunaFamily:sheep            calls=3 tris=986
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2270
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=2 tris=1903
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
  calls avg: 1548  tris avg: 4690243
  info calls avg: 1963  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1934
  faunaFamily:cow              calls=7 tris=2430
  faunaFamily:dog              calls=35 tris=11608
  faunaFamily:donkey           calls=7 tris=1984
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3972
  faunaFamily:sheep            calls=13 tris=4065
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15161
  npcFamily:Herbalist          calls=25 tris=27067
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=164 tris=180755
  npcFamily:Peasant_Boots      calls=42 tris=48310
  npcFamily:Wizard             calls=60 tris=56670
  npcFamily:blacksmith         calls=36 tris=38437
  npcFamily:woodcutter         calls=17 tris=15225
  other                        calls=127 tris=14873
  settlement:decor             calls=2 tris=1667
  settlement:fence             calls=4 tris=18542
  settlement:fireCampfire      calls=36 tris=453
  settlement:fireHouseExteriorLamp calls=80 tris=5581
  settlement:fireHouseInteriorLamp calls=10 tris=1074
  settlement:fireVillageTorch  calls=15 tris=1067
  settlement:houseInteractive  calls=30 tris=3282
  settlement:houseStatic       calls=66 tris=160437
  settlement:landmarkGarden    calls=12 tris=209614
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3725
  settlement:landmarkWellHousehold calls=10 tris=18625
  settlement:landmarkWellPasture calls=5 tris=1855
  settlement:other             calls=22 tris=755
  settlement:storageBarrel     calls=12 tris=26196
  settlement:storageContainer  calls=58 tris=4865
  settlement:storageGoods      calls=79 tris=13869
  settlement:storageHay        calls=2 tris=972
  settlement:storageTrough     calls=8 tris=3387
  settlement:storageWoodHousehold calls=18 tris=7969
  settlement:storageWoodSettlementPrimary calls=4 tris=4279
  settlement:storageWoodSettlementSecondary calls=4 tris=11219
  settlement:workplace         calls=37 tris=15429
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 14
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 14 total):

[LONG FRAME] 430.8ms
simulate         8.1ms
render         422.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.9ms
FAUNA            0.8ms
PHYSICS          0.2ms
RENDER         422.3ms
OTHER            5.5ms

Long frame #2:

[LONG FRAME] 178.8ms
simulate        16.6ms
render         161.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              8.3ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         161.8ms
OTHER            7.7ms

Long frame #3:

[LONG FRAME] 139.8ms
simulate       108.1ms
render          31.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              7.2ms
FAUNA           94.9ms
PHYSICS          0.2ms
RENDER          31.3ms
OTHER            6.1ms

Long frame #4:

[LONG FRAME] 138.9ms
simulate       104.2ms
render          34.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              4.8ms
FAUNA           94.0ms
PHYSICS          0.1ms
RENDER          34.5ms
OTHER            5.3ms

Long frame #5:

[LONG FRAME] 133.4ms
simulate       100.4ms
render          32.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           90.3ms
PHYSICS          0.1ms
RENDER          32.8ms
OTHER            6.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=29.4 ms  p95=31.8 ms  max=32.3 ms  Δavg vs baseline=—
  hide-grass           avg=29.3 ms  p95=31.7 ms  max=32.3 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=28.5 ms  p95=31.1 ms  max=31.6 ms  Δavg vs baseline=-0.9 ms (-3%)
  no vegetation/grass  avg=28.1 ms  p95=29.4 ms  max=29.5 ms  Δavg vs baseline=-1.3 ms (-4%)
  hide-environment     avg=27.6 ms  p95=28.1 ms  max=28.2 ms  Δavg vs baseline=-1.8 ms (-6%)
  hide-settlement      avg=24.4 ms  p95=25.0 ms  max=25.1 ms  Δavg vs baseline=-5.0 ms (-17%)
  no water             avg=29.0 ms  p95=30.3 ms  max=30.4 ms  Δavg vs baseline=-0.3 ms (-1%)
  hide-terrain         avg=28.6 ms  p95=30.8 ms  max=31.4 ms  Δavg vs baseline=-0.8 ms (-3%)
  hide-npc-fauna       avg=18.4 ms  p95=19.9 ms  max=20.0 ms  Δavg vs baseline=-11.0 ms (-38%)
  no-shadows           avg=25.3 ms  p95=26.9 ms  max=27.2 ms  Δavg vs baseline=-4.1 ms (-14%)
  no-ao                avg=28.5 ms  p95=29.5 ms  max=29.5 ms  Δavg vs baseline=-0.9 ms (-3%)
  no-bloom             avg=28.9 ms  p95=30.1 ms  max=30.2 ms  Δavg vs baseline=-0.5 ms (-2%)
  no-smaa              avg=29.8 ms  p95=30.3 ms  max=30.4 ms  Δavg vs baseline=+0.4 ms (+1%)
  no-god-rays          avg=29.0 ms  p95=30.1 ms  max=30.3 ms  Δavg vs baseline=-0.4 ms (-1%)
  no-film-grade        avg=29.4 ms  p95=30.9 ms  max=31.1 ms  Δavg vs baseline=+0.0 ms (+0%)
  no postprocessing    avg=32.2 ms  p95=35.6 ms  max=35.7 ms  Δavg vs baseline=+2.9 ms (+10%)
  no mirrors           avg=29.3 ms  p95=30.6 ms  max=30.8 ms  Δavg vs baseline=-0.1 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
