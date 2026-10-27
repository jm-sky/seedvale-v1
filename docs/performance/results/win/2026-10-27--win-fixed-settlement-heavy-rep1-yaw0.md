# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:54:52.663Z
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
Frames: 802
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-53-43-948Z-uii4c2
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
  populationGate: stable waited=6706ms npc=53
  gpuTimer: available=true resolved=true samples=808 span=postprocess+labels

FPS:
  avg: 29.8
  min: 12
  p1: 23

Frame time (wall-clock):
  avg: 33.6 ms
  p50: 35.2 ms
  p95: 38 ms
  p99: 42.6 ms
  max: 83.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.2 p95=9.8 p99=12.9 max=62.3 n=802
  render: p50=24.9 p95=28.8 p99=29.7 max=34.3 n=802
  frame: p50=35.2 p95=38 p99=42.6 max=83.5 n=802

Rendering (combined renderer.info):
  draw calls: 2396 avg / 2775 max
  triangles: 7.86M avg
  mirror draws: 352 avg
  geometries: 957
  textures: 1037

Pass submissions (actual):
  reliability: observed
  frames: 809 shadowRefresh=809 shadowSkipped=0
  mirror calls avg: 351
  shadow calls avg: 421
  main calls avg: 1623

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1517 tris=1.37M meshes=1517 inst=3583
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=506 tris=29.8k meshes=506 inst=508

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=807 tris=828.7k meshes=807 inst=2699
  npc              draws=32 tris=35.4k meshes=32 inst=32
  fauna            draws=8 tris=2.6k meshes=8 inst=8
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

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
      mid  agents=3 camera-relevant=2 draws=32 tris=35.4k
      far  agents=50 camera-relevant=17 draws=488 tris=585.9k
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
      mid  agents=2 camera-relevant=2 draws=8 tris=2.6k
      far  agents=89 camera-relevant=19 draws=391 tris=149.6k

Systems:
  WATER          3.5 ms
  NPC            3.4 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         21.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=20.3 ms draws=2393 tris=7.86M
  hide-grass         render=20.2 ms draws=2376 tris=7.56M
  hide-vegetation    render=19.4 ms draws=2212 tris=6.78M
  hide-vegetation-grass render=19.4 ms draws=2193 tris=6.48M
  hide-environment   render=20.0 ms draws=2081 tris=7.80M
  hide-settlement    render=16.5 ms draws=1465 tris=6.96M
  hide-water         render=19.7 ms draws=2356 tris=6.89M
  hide-terrain       render=19.8 ms draws=2330 tris=3.81M
  hide-npc-fauna     render=12.8 ms draws=1886 tris=7.42M
  no-shadows         render=16.7 ms draws=1982 tris=5.68M
  no-ao              render=20.3 ms draws=2380 tris=7.87M
  no-bloom           render=20.0 ms draws=2352 tris=7.85M
  no-smaa            render=20.4 ms draws=2362 tris=7.86M
  no-god-rays        render=20.2 ms draws=2375 tris=7.87M
  no-film-grade      render=19.8 ms draws=2359 tris=7.85M
  no-postprocessing  render=20.0 ms draws=2334 tris=7.85M
  no-reflections     render=19.7 ms draws=2014 tris=6.86M

Frame attribution:
  frame max: 83.5 ms
  largest labelled hitch: 0 ms
  unattributed: 83.5 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 83.5 ms

Raw sidecar:
  sampling=full factor=1 exported=802/802

Recommendation:
Largest frame (83.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.4 ms/frame
  crowd pass: 0.0 ms/frame (9.7 ms cumulative)
  agent updates: 2.2 ms/frame (1731.5 ms cumulative)
  livestock: 1.0 ms/frame (818.9 ms cumulative)
    loaded tick: 1.0 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.0 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.9 predator candidates/frame)
    pest scans: 6.4/frame (6.4 rat candidates/frame)
    nearest scans: 25.8/frame (0.0 candidates/frame)
    water samples: 55.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 55.3/frame, 0.10 ms/frame (worst call 0.80 ms, 11915.5 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 56.1
    behaviour executions/frame: 26.1
    presentation executions/frame: 20.1
  rats: 0.1 ms/frame (65.3 ms cumulative)
  social: 0.0 ms/frame (3.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (123.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.1 ms/frame (911.9 ms cumulative)
  forest sampling: 0.1 ms/frame (55.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (12.4 ms cumulative)
    targeting: 0.0 ms/frame (18.5 ms cumulative)
    decision: 0.0 ms/frame (6.1 ms cumulative)
    behaviour: 0.7 ms/frame (571.3 ms cumulative)
    life/presentation: 0.3 ms/frame (203.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.4
    full-rate agents/frame: 6.2
    reduced-cadence agents/frame: 24.0
    behaviour executions/frame: 17.4
    presentation executions/frame: 14.8

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 121.0
    village scan candidates/frame: 1610.6
    player perception checks/frame: 30.3

  nearest scans: 25.1/frame (20116 calls)
  nearest candidates checked: 449.6/frame (360603 total)
  herd leader scans: 0.3/frame (278 calls)
  herd candidates checked: 10.4/frame (8340 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.2/frame (156.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 34.6/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 34.6/frame, 0.00 ms/frame (worst call 0.70 ms, 550.5 colliders/frame)

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
Frames: 809
Shadow refresh frames: 809
Shadow skipped frames: 0

Mirror:
  calls avg: 351  tris avg: 988816
  info calls avg: 351  residual calls avg: 0
  environment                  calls=43 tris=8855
  items                        calls=1 tris=631
  other                        calls=37 tris=2288
  settlement:decor             calls=1 tris=835
  settlement:fence             calls=2 tris=9281
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3116
  settlement:fireHouseInteriorLamp calls=5 tris=539
  settlement:fireVillageTorch  calls=5 tris=357
  settlement:houseInteractive  calls=15 tris=1648
  settlement:houseStatic       calls=33 tris=80402
  settlement:landmarkGarden    calls=5 tris=82701
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=934
  settlement:landmarkWellHousehold calls=5 tris=9338
  settlement:landmarkWellPasture calls=2 tris=934
  settlement:other             calls=9 tris=350
  settlement:storageBarrel     calls=4 tris=11749
  settlement:storageContainer  calls=28 tris=2313
  settlement:storageGoods      calls=39 tris=6965
  settlement:storageHay        calls=1 tris=487
  settlement:storageTrough     calls=4 tris=1698
  settlement:storageWoodHousehold calls=10 tris=4449
  settlement:storageWoodSettlementPrimary calls=1 tris=1073
  settlement:storageWoodSettlementSecondary calls=1 tris=2813
  settlement:workplace         calls=11 tris=5286
  terrain                      calls=8 tris=589095
  vegetation                   calls=21 tris=160717

Shadow (refresh only):
  calls avg: 421  tris avg: 2176267
  info calls avg: 421  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=2 tris=223
  faunaFamily:cow              calls=1 tris=318
  faunaFamily:dog              calls=6 tris=2005
  faunaFamily:donkey           calls=0 tris=84
  faunaFamily:sheep            calls=3 tris=1047
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3680
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=4 tris=3720
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=30 tris=8698
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
  calls avg: 1623  tris avg: 4695430
  info calls avg: 2045  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=11 tris=3504
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=162 tris=175912
  npcFamily:Peasant_Boots      calls=42 tris=48628
  npcFamily:Wizard             calls=60 tris=56931
  npcFamily:blacksmith         calls=36 tris=38577
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=128 tris=15010
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
  settlement:storageGoods      calls=79 tris=13948
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 83.5ms
simulate        62.3ms
render          20.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.9ms
FAUNA           55.2ms
PHYSICS          0.1ms
RENDER          20.8ms
OTHER            4.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=20.3 ms  p95=21.2 ms  max=24.9 ms  Δavg vs baseline=—
  hide-grass           avg=20.2 ms  p95=20.9 ms  max=21.8 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=19.4 ms  p95=20.1 ms  max=20.3 ms  Δavg vs baseline=-0.9 ms (-5%)
  no vegetation/grass  avg=19.4 ms  p95=20.3 ms  max=21.0 ms  Δavg vs baseline=-0.9 ms (-5%)
  hide-environment     avg=20.0 ms  p95=21.7 ms  max=24.8 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-settlement      avg=16.5 ms  p95=17.7 ms  max=18.3 ms  Δavg vs baseline=-3.8 ms (-19%)
  no water             avg=19.7 ms  p95=20.6 ms  max=21.0 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-terrain         avg=19.8 ms  p95=20.3 ms  max=20.6 ms  Δavg vs baseline=-0.5 ms (-3%)
  hide-npc-fauna       avg=12.8 ms  p95=13.2 ms  max=13.5 ms  Δavg vs baseline=-7.5 ms (-37%)
  no-shadows           avg=16.7 ms  p95=17.4 ms  max=19.6 ms  Δavg vs baseline=-3.6 ms (-18%)
  no-ao                avg=20.3 ms  p95=20.8 ms  max=22.2 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-bloom             avg=20.0 ms  p95=20.7 ms  max=21.0 ms  Δavg vs baseline=-0.3 ms (-2%)
  no-smaa              avg=20.4 ms  p95=22.0 ms  max=27.1 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-god-rays          avg=20.2 ms  p95=20.9 ms  max=21.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-film-grade        avg=19.8 ms  p95=20.3 ms  max=20.8 ms  Δavg vs baseline=-0.5 ms (-2%)
  no postprocessing    avg=20.0 ms  p95=21.1 ms  max=21.8 ms  Δavg vs baseline=-0.3 ms (-2%)
  no mirrors           avg=19.7 ms  p95=20.2 ms  max=20.5 ms  Δavg vs baseline=-0.6 ms (-3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=19.0 ms  p95=19.7 ms  max=25.7 ms
  CPU wall      avg=20.3 ms  p95=21.2 ms  max=24.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
