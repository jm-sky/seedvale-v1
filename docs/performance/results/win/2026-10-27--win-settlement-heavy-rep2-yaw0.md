# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:12:02.342Z
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
Frames: 602
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-11-02-578Z-1ccg8l
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
  populationGate: stable waited=5341ms npc=53
  cameraControl: yaw=0 pitch=0.4 distance=12
  gpuTimer: available=true resolved=true samples=606 span=postprocess+labels

FPS:
  avg: 22
  min: 5
  p1: 8

Frame time (wall-clock):
  avg: 45.5 ms
  p50: 40.4 ms
  p95: 82.9 ms
  p99: 124.5 ms
  max: 183.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=10.5 p95=54 p99=94.8 max=101.1 n=602
  render: p50=29.1 p95=44 p99=54.9 max=87.9 n=602
  frame: p50=40.4 p95=82.9 p99=124.5 max=183.8 n=602

Rendering (combined renderer.info):
  draw calls: 2331 avg / 2718 max
  triangles: 7.86M avg
  mirror draws: 351 avg
  geometries: 1009
  textures: 1652

Pass submissions (actual):
  reliability: observed
  frames: 607 shadowRefresh=607 shadowSkipped=0
  mirror calls avg: 351
  shadow calls avg: 423
  main calls avg: 1556

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1482 tris=1.37M meshes=1482 inst=3548
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=516 tris=30.5k meshes=516 inst=518

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=814 tris=833.0k meshes=814 inst=2706
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=24 tris=10.3k meshes=24 inst=24
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=121 tris=15.6k meshes=121 inst=121

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=11.0k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=30.6k meshes=56 inst=56
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
  decor            draws=201 tris=382.8k meshes=201 inst=307
  other            draws=64 tris=1.9k meshes=64 inst=64

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
      mid  agents=6 camera-relevant=4 draws=24 tris=10.3k
      far  agents=85 camera-relevant=16 draws=375 tris=141.9k

Systems:
  WATER          4.4 ms
  NPC            6.0 ms
  FAUNA          4.1 ms
  PHYSICS        0.1 ms
  RENDER         25.9 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=23.0 ms draws=2325 tris=7.86M
  hide-grass         render=21.1 ms draws=2289 tris=7.54M
  hide-vegetation    render=21.2 ms draws=2148 tris=6.78M
  hide-vegetation-grass render=20.6 ms draws=2108 tris=6.46M
  hide-environment   render=21.1 ms draws=2067 tris=7.82M
  hide-settlement    render=18.2 ms draws=1455 tris=6.99M
  hide-water         render=21.1 ms draws=2311 tris=6.90M
  hide-terrain       render=21.3 ms draws=2272 tris=3.82M
  hide-npc-fauna     render=14.2 ms draws=1817 tris=7.41M
  no-shadows         render=17.8 ms draws=1921 tris=5.68M
  no-ao              render=21.6 ms draws=2311 tris=7.87M
  no-bloom           render=21.9 ms draws=2309 tris=7.87M
  no-smaa            render=21.7 ms draws=2331 tris=7.88M
  no-god-rays        render=21.3 ms draws=2327 tris=7.87M
  no-film-grade      render=21.6 ms draws=2344 tris=7.88M
  no-postprocessing  render=21.8 ms draws=2320 tris=7.88M
  no-reflections     render=21.9 ms draws=2007 tris=6.91M

Frame attribution:
  frame max: 183.8 ms
  largest labelled hitch: 0 ms
  unattributed: 183.8 ms

Long frames:
  threshold: 80 ms
  count: 39
  worst: 183.8 ms

Raw sidecar:
  sampling=full factor=1 exported=602/602

Recommendation:
Largest frame (183.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 6.0 ms/frame
  crowd pass: 0.0 ms/frame (10.4 ms cumulative)
  agent updates: 3.4 ms/frame (2054.1 ms cumulative)
  livestock: 2.3 ms/frame (1370.5 ms cumulative)
    loaded tick: 2.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 2.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 1.7 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (91.8 predator candidates/frame)
    pest scans: 6.5/frame (6.5 rat candidates/frame)
    nearest scans: 29.5/frame (0.0 candidates/frame)
    water samples: 63.2/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 63.2/frame, 0.10 ms/frame (worst call 0.80 ms, 13941.8 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 56.3
    behaviour executions/frame: 29.6
    presentation executions/frame: 25.1
  rats: 0.1 ms/frame (64.4 ms cumulative)
  social: 0.0 ms/frame (3.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (136.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 4.1 ms/frame
  agent updates: 4.1 ms/frame (2444.6 ms cumulative)
  forest sampling: 0.1 ms/frame (51.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.3 ms cumulative)
    targeting: 0.0 ms/frame (17.9 ms cumulative)
    decision: 0.0 ms/frame (3.2 ms cumulative)
    behaviour: 3.6 ms/frame (2139.1 ms cumulative)
    life/presentation: 0.3 ms/frame (180.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 22.2
    decision passes/frame: 22.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.3
    full-rate agents/frame: 6.7
    reduced-cadence agents/frame: 15.5
    behaviour executions/frame: 14.3
    presentation executions/frame: 13.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 88.7
    village scan candidates/frame: 1612.9
    player perception checks/frame: 22.2

  nearest scans: 21.4/frame (12868 calls)
  nearest candidates checked: 429.8/frame (258751 total)
  herd leader scans: 0.1/frame (74 calls)
  herd candidates checked: 3.7/frame (2220 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.4/frame (138.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 89.8/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 89.8/frame, 0.10 ms/frame (worst call 0.90 ms, 1969.2 colliders/frame)

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
Frames: 607
Shadow refresh frames: 607
Shadow skipped frames: 0

Mirror:
  calls avg: 351  tris avg: 987853
  info calls avg: 351  residual calls avg: 0
  environment                  calls=43 tris=8851
  items                        calls=1 tris=631
  other                        calls=37 tris=2228
  settlement:decor             calls=1 tris=835
  settlement:fence             calls=2 tris=9277
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=45 tris=3115
  settlement:fireHouseInteriorLamp calls=5 tris=539
  settlement:fireVillageTorch  calls=5 tris=357
  settlement:houseInteractive  calls=15 tris=1647
  settlement:houseStatic       calls=33 tris=80369
  settlement:landmarkGarden    calls=5 tris=82667
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=933
  settlement:landmarkWellHousehold calls=5 tris=9335
  settlement:landmarkWellPasture calls=2 tris=933
  settlement:other             calls=9 tris=349
  settlement:storageBarrel     calls=4 tris=11745
  settlement:storageContainer  calls=28 tris=2312
  settlement:storageGoods      calls=39 tris=6466
  settlement:storageHay        calls=1 tris=487
  settlement:storageTrough     calls=4 tris=1697
  settlement:storageWoodHousehold calls=10 tris=4448
  settlement:storageWoodSettlementPrimary calls=1 tris=1072
  settlement:storageWoodSettlementSecondary calls=1 tris=2811
  settlement:workplace         calls=11 tris=5284
  terrain                      calls=8 tris=588852
  vegetation                   calls=21 tris=160650

Shadow (refresh only):
  calls avg: 423  tris avg: 2178799
  info calls avg: 423  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=1 tris=82
  faunaFamily:cow              calls=5 tris=1719
  faunaFamily:dog              calls=7 tris=2244
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=4 tris=1119
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2118
  npcFamily:Peasant            calls=10 tris=11185
  npcFamily:Wizard             calls=2 tris=1587
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
  calls avg: 1556  tris avg: 4691709
  info calls avg: 1979  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=13 tris=3868
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=165 tris=181300
  npcFamily:Peasant_Boots      calls=42 tris=48628
  npcFamily:Wizard             calls=60 tris=56931
  npcFamily:blacksmith         calls=36 tris=38577
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=129 tris=14892
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=81 tris=5616
  settlement:fireHouseInteriorLamp calls=10 tris=1080
  settlement:fireVillageTorch  calls=15 tris=1073
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=161004
  settlement:landmarkGarden    calls=12 tris=210456
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=18700
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=22 tris=760
  settlement:storageBarrel     calls=12 tris=26296
  settlement:storageContainer  calls=58 tris=4884
  settlement:storageGoods      calls=44 tris=8234
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=18 tris=8019
  settlement:storageWoodSettlementPrimary calls=4 tris=4296
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 39
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 39 total):

[LONG FRAME] 183.8ms
simulate        95.5ms
render          87.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           18.0ms
STREAMING        0.0ms
NPC             83.6ms
FAUNA            4.7ms
PHYSICS          0.2ms
RENDER          70.1ms
OTHER            7.2ms

Long frame #2:

[LONG FRAME] 145.1ms
simulate       101.1ms
render          43.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.2ms
STREAMING        0.1ms
NPC              3.3ms
FAUNA           93.1ms
PHYSICS          0.1ms
RENDER          34.5ms
OTHER            4.8ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #3:

[LONG FRAME] 130.5ms
simulate       100.1ms
render          30.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.1ms
STREAMING        0.0ms
NPC              7.6ms
FAUNA           86.2ms
PHYSICS          0.1ms
RENDER          21.3ms
OTHER            6.2ms

Long frame #4:

[LONG FRAME] 129.4ms
simulate       100.1ms
render          29.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.0ms
STREAMING        0.0ms
NPC              3.8ms
FAUNA           91.5ms
PHYSICS          0.1ms
RENDER          21.2ms
OTHER            4.8ms

Long frame #5:

[LONG FRAME] 125.2ms
simulate        95.4ms
render          29.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.5ms
STREAMING        0.0ms
NPC              3.4ms
FAUNA           87.8ms
PHYSICS          0.1ms
RENDER          22.3ms
OTHER            4.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=23.0 ms  p95=31.1 ms  max=37.5 ms  Δavg vs baseline=—
  hide-grass           avg=21.1 ms  p95=23.2 ms  max=23.7 ms  Δavg vs baseline=-1.8 ms (-8%)
  hide-vegetation      avg=21.2 ms  p95=22.6 ms  max=23.9 ms  Δavg vs baseline=-1.8 ms (-8%)
  no vegetation/grass  avg=20.6 ms  p95=22.4 ms  max=23.5 ms  Δavg vs baseline=-2.4 ms (-10%)
  hide-environment     avg=21.1 ms  p95=23.5 ms  max=23.8 ms  Δavg vs baseline=-1.9 ms (-8%)
  hide-settlement      avg=18.2 ms  p95=19.9 ms  max=20.5 ms  Δavg vs baseline=-4.7 ms (-21%)
  no water             avg=21.1 ms  p95=22.6 ms  max=23.0 ms  Δavg vs baseline=-1.8 ms (-8%)
  hide-terrain         avg=21.3 ms  p95=22.9 ms  max=23.0 ms  Δavg vs baseline=-1.7 ms (-7%)
  hide-npc-fauna       avg=14.2 ms  p95=15.8 ms  max=16.1 ms  Δavg vs baseline=-8.7 ms (-38%)
  no-shadows           avg=17.8 ms  p95=19.2 ms  max=19.4 ms  Δavg vs baseline=-5.2 ms (-23%)
  no-ao                avg=21.6 ms  p95=23.6 ms  max=26.5 ms  Δavg vs baseline=-1.4 ms (-6%)
  no-bloom             avg=21.9 ms  p95=24.9 ms  max=27.1 ms  Δavg vs baseline=-1.1 ms (-5%)
  no-smaa              avg=21.7 ms  p95=24.0 ms  max=24.5 ms  Δavg vs baseline=-1.2 ms (-5%)
  no-god-rays          avg=21.3 ms  p95=22.5 ms  max=22.8 ms  Δavg vs baseline=-1.7 ms (-7%)
  no-film-grade        avg=21.6 ms  p95=23.0 ms  max=23.4 ms  Δavg vs baseline=-1.3 ms (-6%)
  no postprocessing    avg=21.8 ms  p95=23.5 ms  max=25.7 ms  Δavg vs baseline=-1.1 ms (-5%)
  no mirrors           avg=21.9 ms  p95=23.2 ms  max=24.4 ms  Δavg vs baseline=-1.0 ms (-4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=21.6 ms  p95=28.1 ms  max=32.0 ms
  CPU wall      avg=23.0 ms  p95=31.1 ms  max=37.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
