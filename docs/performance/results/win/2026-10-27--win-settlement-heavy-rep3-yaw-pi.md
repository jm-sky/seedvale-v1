# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:13:39.360Z
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
Frames: 773
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-12-42-509Z-8jn5ne
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
  camera: pos=(-572.2, 17.3, -1169.4)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=5116ms npc=53
  cameraControl: yaw=3.1 pitch=0.4 distance=12
  gpuTimer: available=true resolved=true samples=779 span=postprocess+labels

FPS:
  avg: 28.1
  min: 7
  p1: 12

Frame time (wall-clock):
  avg: 35.6 ms
  p50: 34 ms
  p95: 67.9 ms
  p99: 81.6 ms
  max: 133.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.8 p95=41.4 p99=54.6 max=74.8 n=773
  render: p50=25.1 p95=29.5 p99=36.5 max=86.6 n=773
  frame: p50=34 p95=67.9 p99=81.6 max=133.6 n=773

Rendering (combined renderer.info):
  draw calls: 1574 avg / 1943 max
  triangles: 7.91M avg
  mirror draws: 348 avg
  geometries: 1339
  textures: 2355

Pass submissions (actual):
  reliability: observed
  frames: 780 shadowRefresh=780 shadowSkipped=0
  mirror calls avg: 349
  shadow calls avg: 432
  main calls avg: 794

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1463 tris=1.37M meshes=1463 inst=3529
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=30.6k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=817 tris=840.3k meshes=817 inst=2709
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=17 tris=9.0k meshes=17 inst=17
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=122 tris=15.8k meshes=122 inst=122

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=13.0k meshes=10 inst=10
  storageWoodSettlementOverflow draws=2 tris=5.6k meshes=2 inst=2
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
  decor            draws=202 tris=382.5k meshes=202 inst=308
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
      mid  agents=2 camera-relevant=0 draws=20 tris=23.5k
      far  agents=51 camera-relevant=6 draws=500 tris=597.8k
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
      mid  agents=4 camera-relevant=2 draws=17 tris=9.0k
      far  agents=87 camera-relevant=2 draws=382 tris=143.2k

Systems:
  WATER          4.0 ms
  NPC            4.4 ms
  FAUNA          3.1 ms
  PHYSICS        0.1 ms
  RENDER         19.7 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=17.9 ms draws=1570 tris=7.91M
  hide-grass         render=17.9 ms draws=1539 tris=7.14M
  hide-vegetation    render=17.3 ms draws=1434 tris=6.99M
  hide-vegetation-grass render=17.3 ms draws=1411 tris=6.22M
  hide-environment   render=17.9 ms draws=1472 tris=7.89M
  hide-settlement    render=15.4 ms draws=999 tris=7.34M
  hide-water         render=17.8 ms draws=1545 tris=6.51M
  hide-terrain       render=17.6 ms draws=1513 tris=4.08M
  hide-npc-fauna     render=11.5 ms draws=1224 tris=7.59M
  no-shadows         render=14.9 ms draws=1166 tris=5.73M
  no-ao              render=18.9 ms draws=1559 tris=7.91M
  no-bloom           render=17.3 ms draws=1558 tris=7.92M
  no-smaa            render=17.5 ms draws=1564 tris=7.92M
  no-god-rays        render=17.5 ms draws=1563 tris=7.91M
  no-film-grade      render=18.7 ms draws=1571 tris=7.93M
  no-postprocessing  render=17.5 ms draws=1551 tris=7.93M
  no-reflections     render=17.5 ms draws=1217 tris=6.75M

Frame attribution:
  frame max: 133.6 ms
  largest labelled hitch: 0 ms
  unattributed: 133.6 ms

Long frames:
  threshold: 80 ms
  count: 12
  worst: 133.6 ms

Raw sidecar:
  sampling=full factor=1 exported=773/773

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.4 ms/frame
  crowd pass: 0.0 ms/frame (9.6 ms cumulative)
  agent updates: 2.7 ms/frame (2111.3 ms cumulative)
  livestock: 1.4 ms/frame (1077.1 ms cumulative)
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
      behaviour: 0.9 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (91.8 predator candidates/frame)
    pest scans: 6.0/frame (6.0 rat candidates/frame)
    nearest scans: 26.1/frame (0.0 candidates/frame)
    water samples: 54.8/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 54.8/frame, 0.10 ms/frame (worst call 1.10 ms, 12245.0 colliders/frame)
    full-rate agents/frame: 1.8
    reduced-cadence agents/frame: 54.7
    behaviour executions/frame: 27.0
    presentation executions/frame: 21.5
  rats: 0.1 ms/frame (57.0 ms cumulative)
  social: 0.0 ms/frame (4.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (137.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.1 ms/frame
  agent updates: 3.0 ms/frame (2353.8 ms cumulative)
  forest sampling: 0.1 ms/frame (60.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (5.0 ms cumulative)
    targeting: 0.0 ms/frame (16.8 ms cumulative)
    decision: 0.0 ms/frame (9.1 ms cumulative)
    behaviour: 2.7 ms/frame (2061.5 ms cumulative)
    life/presentation: 0.2 ms/frame (159.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 21.2
    decision passes/frame: 21.2
    high-priority agents/frame: 1.0
    expensive behaviour agents/frame: 12.0
    full-rate agents/frame: 6.1
    reduced-cadence agents/frame: 15.1
    behaviour executions/frame: 13.0
    presentation executions/frame: 11.4

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 84.8
    village scan candidates/frame: 1613.6
    player perception checks/frame: 21.2

  nearest scans: 20.3/frame (15703 calls)
  nearest candidates checked: 419.0/frame (323857 total)
  herd leader scans: 0.1/frame (94 calls)
  herd candidates checked: 3.6/frame (2820 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.8/frame (122.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 14.3/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 14.3/frame, 0.00 ms/frame (worst call 0.10 ms, 182.2 colliders/frame)

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
Frames: 780
Shadow refresh frames: 780
Shadow skipped frames: 0

Mirror:
  calls avg: 349  tris avg: 1161009
  info calls avg: 349  residual calls avg: 0
  environment                  calls=2 tris=1868
  items                        calls=1 tris=316
  other                        calls=90 tris=7497
  settlement:decor             calls=105 tris=188261
  settlement:fireHouseExteriorLamp calls=23 tris=1560
  settlement:fireHouseInteriorLamp calls=3 tris=270
  settlement:fireVillageTorch  calls=3 tris=179
  settlement:houseInteractive  calls=8 tris=825
  settlement:houseStatic       calls=27 tris=49662
  settlement:landmarkGarden    calls=3 tris=17538
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=5610
  settlement:other             calls=9 tris=180
  settlement:storageBarrel     calls=5 tris=8304
  settlement:storageContainer  calls=16 tris=1536
  settlement:storageGoods      calls=10 tris=2060
  settlement:storageHay        calls=1 tris=244
  settlement:storageTrough     calls=2 tris=1000
  settlement:storageWoodHousehold calls=5 tris=5039
  settlement:storageWoodSettlementOverflow calls=1 tris=1718
  settlement:storageWoodSettlementPrimary calls=1 tris=2440
  settlement:workplace         calls=6 tris=3685
  terrain                      calls=10 tris=737280
  vegetation                   calls=14 tris=123142

Shadow (refresh only):
  calls avg: 432  tris avg: 2187982
  info calls avg: 432  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=21
  faunaFamily:cow              calls=5 tris=1831
  faunaFamily:dog              calls=9 tris=3179
  faunaFamily:donkey           calls=0 tris=108
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=4 tris=1090
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=5 tris=5272
  npcFamily:Peasant            calls=15 tris=17265
  npcFamily:Wizard             calls=0 tris=473
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=28 tris=8599
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
  calls avg: 794  tris avg: 4566535
  info calls avg: 1226  residual calls avg: 0
  environment                  calls=4 tris=3736
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=5 tris=1920
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=2 tris=610
  grass                        calls=29 tris=776440
  items                        calls=48 tris=4042
  npcFamily:Herbalist          calls=24 tris=23793
  npcFamily:Knight_Cloth       calls=15 tris=17123
  npcFamily:Peasant            calls=119 tris=107746
  npcFamily:Peasant_Boots      calls=32 tris=32316
  npcFamily:Wizard             calls=46 tris=41879
  npcFamily:blacksmith         calls=30 tris=29799
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=148 tris=15484
  settlement:decor             calls=1 tris=886
  settlement:fireCampfire      calls=18 tris=227
  settlement:fireHouseExteriorLamp calls=27 tris=1872
  settlement:fireHouseInteriorLamp calls=3 tris=324
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=9 tris=990
  settlement:houseStatic       calls=30 tris=88894
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:other             calls=7 tris=132
  settlement:storageBarrel     calls=6 tris=13840
  settlement:storageContainer  calls=19 tris=2448
  settlement:storageGoods      calls=18 tris=3708
  settlement:storageTrough     calls=2 tris=1600
  settlement:storageWoodHousehold calls=6 tris=2673
  settlement:storageWoodSettlementPrimary calls=2 tris=2148
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=19 tris=7346
  terrain                      calls=23 tris=1695744
  vegetation                   calls=32 tris=240757
  water                        calls=20 tris=1409024


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 12
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 12 total):

[LONG FRAME] 133.6ms
simulate        74.8ms
render          58.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           19.5ms
STREAMING        0.0ms
NPC              4.3ms
FAUNA           64.4ms
PHYSICS          0.0ms
RENDER          39.0ms
OTHER            6.4ms

Long frame #2:

[LONG FRAME] 113.7ms
simulate        26.9ms
render          86.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           29.4ms
STREAMING        0.0ms
NPC             15.2ms
FAUNA            2.4ms
PHYSICS          0.1ms
RENDER          57.3ms
OTHER            9.3ms

Long frame #3:

[LONG FRAME] 87.4ms
simulate        57.7ms
render          29.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.9ms
STREAMING        0.0ms
NPC              4.2ms
FAUNA           48.3ms
PHYSICS          0.0ms
RENDER          21.9ms
OTHER            5.1ms

Long frame #4:

[LONG FRAME] 84.4ms
simulate        66.0ms
render          18.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC             18.4ms
FAUNA           43.3ms
PHYSICS          0.1ms
RENDER          18.2ms
OTHER            4.4ms

Long frame #5:

[LONG FRAME] 83ms
simulate        54.6ms
render          28.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.7ms
STREAMING        0.0ms
NPC             49.0ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER          19.5ms
OTHER            5.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=17.9 ms  p95=19.1 ms  max=19.5 ms  Δavg vs baseline=—
  hide-grass           avg=17.9 ms  p95=18.8 ms  max=19.2 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=17.3 ms  p95=18.6 ms  max=18.8 ms  Δavg vs baseline=-0.6 ms (-3%)
  no vegetation/grass  avg=17.3 ms  p95=18.3 ms  max=18.9 ms  Δavg vs baseline=-0.6 ms (-4%)
  hide-environment     avg=17.9 ms  p95=19.3 ms  max=21.5 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-settlement      avg=15.4 ms  p95=15.9 ms  max=16.7 ms  Δavg vs baseline=-2.5 ms (-14%)
  no water             avg=17.8 ms  p95=18.8 ms  max=21.3 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-terrain         avg=17.6 ms  p95=18.6 ms  max=19.0 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-npc-fauna       avg=11.5 ms  p95=12.2 ms  max=12.4 ms  Δavg vs baseline=-6.4 ms (-36%)
  no-shadows           avg=14.9 ms  p95=15.9 ms  max=17.6 ms  Δavg vs baseline=-3.0 ms (-17%)
  no-ao                avg=18.9 ms  p95=23.1 ms  max=26.4 ms  Δavg vs baseline=+1.0 ms (+5%)
  no-bloom             avg=17.3 ms  p95=18.0 ms  max=18.4 ms  Δavg vs baseline=-0.5 ms (-3%)
  no-smaa              avg=17.5 ms  p95=18.5 ms  max=18.7 ms  Δavg vs baseline=-0.4 ms (-2%)
  no-god-rays          avg=17.5 ms  p95=18.1 ms  max=18.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  no-film-grade        avg=18.7 ms  p95=21.1 ms  max=21.1 ms  Δavg vs baseline=+0.8 ms (+5%)
  no postprocessing    avg=17.5 ms  p95=18.3 ms  max=18.7 ms  Δavg vs baseline=-0.4 ms (-2%)
  no mirrors           avg=17.5 ms  p95=19.0 ms  max=21.0 ms  Δavg vs baseline=-0.4 ms (-2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=23.1 ms  p95=25.4 ms  max=26.3 ms
  CPU wall      avg=17.9 ms  p95=19.1 ms  max=19.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
