# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T20:56:42.326Z
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
Frames: 815
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: f6f6efa2dd552d85b206b8da7df37da6e814f8a4
  runId: 2026-10-28T20-55-34-591Z-unn0s8
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
  viewport: 1536x826
  drawingBuffer: 1920x1032
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=6513ms npc=53
  gpuTimer: available=true resolved=true samples=821 span=postprocess+labels

FPS:
  avg: 27.9
  min: 8
  p1: 13

Frame time (wall-clock):
  avg: 35.8 ms
  p50: 34.1 ms
  p95: 57.4 ms
  p99: 75.9 ms
  max: 119.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.7 p95=12.8 p99=50 max=81.6 n=815
  render: p50=27.2 p95=41.3 p99=53.9 max=76 n=815
  frame: p50=34.1 p95=57.4 p99=75.9 max=119.3 n=815

Rendering (combined renderer.info):
  draw calls: 2138 avg / 2471 max
  triangles: 7.74M avg
  mirror draws: 314 avg
  geometries: 926
  textures: 837

Pass submissions (actual):
  reliability: observed
  frames: 822 shadowRefresh=822 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 409
  main calls avg: 1415

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=513 tris=30.1k meshes=513 inst=515

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=30 tris=37.5k meshes=30 inst=30
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=118 tris=15.2k meshes=118 inst=118

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=5 tris=4.8k meshes=5 inst=5
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=5 tris=21.8k meshes=5 inst=28
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
      Peasant          agents=28 draws=258 tris=310.4k skinned=258/258
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Wizard           agents=4 draws=47 tris=46.9k skinned=47/47
      Herbalist        agents=4 draws=41 tris=52.4k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.7k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=3 camera-relevant=2 draws=30 tris=37.5k
      far  agents=50 camera-relevant=19 draws=471 tris=592.0k
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
  WATER          3.9 ms
  NPC            4.7 ms
  FAUNA          1.7 ms
  PHYSICS        0.1 ms
  RENDER         23.7 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.1 ms draws=2131 tris=7.74M
  hide-grass         render=20.2 ms draws=2088 tris=7.42M
  hide-vegetation    render=19.3 ms draws=1959 tris=6.66M
  hide-vegetation-grass render=19.5 ms draws=1933 tris=6.35M
  hide-environment   render=19.2 ms draws=1824 tris=7.68M
  hide-settlement    render=17.9 ms draws=1343 tris=6.87M
  hide-water         render=21.5 ms draws=2111 tris=6.78M
  hide-terrain       render=20.4 ms draws=2054 tris=3.68M
  hide-npc-fauna     render=14.2 ms draws=1774 tris=7.42M
  no-shadows         render=18.6 ms draws=1739 tris=5.57M
  no-ao              render=21.7 ms draws=2115 tris=7.75M
  no-bloom           render=21.5 ms draws=2107 tris=7.75M
  no-smaa            render=24.5 ms draws=2116 tris=7.75M
  no-god-rays        render=23.1 ms draws=2111 tris=7.75M
  no-film-grade      render=22.0 ms draws=2111 tris=7.75M
  no-postprocessing  render=25.6 ms draws=2085 tris=7.74M
  no-reflections     render=23.0 ms draws=1809 tris=6.77M

Frame attribution:
  frame max: 119.3 ms
  largest labelled hitch: 0 ms
  unattributed: 119.3 ms

Long frames:
  threshold: 80 ms
  count: 5
  worst: 119.3 ms

Raw sidecar:
  sampling=full factor=1 exported=815/815

Recommendation:
Largest frame (119.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (19.5 ms cumulative)
  agent updates: 2.9 ms/frame (2365.5 ms cumulative)
  livestock: 1.4 ms/frame (1114.6 ms cumulative)
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
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.9 predator candidates/frame)
    pest scans: 5.2/frame (5.2 rat candidates/frame)
    nearest scans: 24.1/frame (0.0 candidates/frame)
    water samples: 52.2/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 52.2/frame, 0.10 ms/frame (worst call 0.90 ms, 11679.1 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.3
    behaviour executions/frame: 24.3
    presentation executions/frame: 20.3
  rats: 0.1 ms/frame (99.6 ms cumulative)
  social: 0.0 ms/frame (8.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (173.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.7 ms/frame
  agent updates: 1.7 ms/frame (1356.0 ms cumulative)
  forest sampling: 0.1 ms/frame (71.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.4 ms cumulative)
    targeting: 0.0 ms/frame (22.4 ms cumulative)
    decision: 0.0 ms/frame (8.8 ms cumulative)
    behaviour: 1.1 ms/frame (880.2 ms cumulative)
    life/presentation: 0.4 ms/frame (289.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 28.9
    decision passes/frame: 28.9
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.6
    full-rate agents/frame: 9.1
    reduced-cadence agents/frame: 19.8
    behaviour executions/frame: 17.6
    presentation executions/frame: 16.0

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 115.6
    village scan candidates/frame: 1624.0
    player perception checks/frame: 28.9

  nearest scans: 22.9/frame (18695 calls)
  nearest candidates checked: 407.7/frame (332256 total)
  herd leader scans: 0.1/frame (48 calls)
  herd candidates checked: 1.8/frame (1440 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 22.2/frame (153.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 53.5/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 53.5/frame, 0.00 ms/frame (worst call 0.80 ms, 1019.8 colliders/frame)

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
Frames: 822
Shadow refresh frames: 822
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 990757
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2297
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=720
  settlement:fireHouseInteriorLamp calls=5 tris=540
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=33 tris=80502
  settlement:landmarkGarden    calls=5 tris=82803
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11764
  settlement:storageContainer  calls=28 tris=2316
  settlement:storageGoods      calls=40 tris=6974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1700
  settlement:storageWoodHousehold calls=1 tris=5850
  settlement:storageWoodSettlementPrimary calls=1 tris=546
  settlement:storageWoodSettlementSecondary calls=1 tris=2816
  settlement:workplace         calls=11 tris=5293
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=163160

Shadow (refresh only):
  calls avg: 409  tris avg: 2177079
  info calls avg: 409  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=6 tris=2209
  faunaFamily:dog              calls=7 tris=2206
  faunaFamily:sheep            calls=4 tris=1178
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2376
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=4 tris=3589
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8730
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
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1415  tris avg: 4575485
  info calls avg: 1824  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=16 tris=4978
  grass                        calls=33 tris=316772
  items                        calls=196 tris=15351
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=130 tris=15022
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=30 tris=1440
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
  settlement:storageWoodHousehold calls=2 tris=11700
  settlement:storageWoodSettlementPrimary calls=2 tris=2184
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 5
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 5 total):

[LONG FRAME] 119.3ms
simulate        81.6ms
render          37.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              7.4ms
FAUNA           71.1ms
PHYSICS          0.1ms
RENDER          37.3ms
OTHER            3.3ms

Long frame #2:

[LONG FRAME] 89.9ms
simulate        51.4ms
render          38.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.5ms
STREAMING        0.0ms
NPC              6.6ms
FAUNA           42.9ms
PHYSICS          0.1ms
RENDER          31.7ms
OTHER            2.1ms

Long frame #3:

[LONG FRAME] 88ms
simulate        11.6ms
render          76.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           16.5ms
STREAMING        0.1ms
NPC              7.7ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER          59.6ms
OTHER            2.9ms

Long frame #4:

[LONG FRAME] 83ms
simulate        18.0ms
render          64.7ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           20.0ms
STREAMING        0.0ms
NPC             13.5ms
FAUNA            2.2ms
PHYSICS          0.1ms
RENDER          44.6ms
OTHER            2.5ms

Long frame #5:

[LONG FRAME] 80.7ms
simulate        51.2ms
render          29.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.4ms
STREAMING        0.1ms
NPC              3.8ms
FAUNA           46.1ms
PHYSICS          0.1ms
RENDER          21.8ms
OTHER            1.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.1 ms  p95=26.0 ms  max=28.7 ms  Δavg vs baseline=—
  hide-grass           avg=20.2 ms  p95=21.7 ms  max=21.7 ms  Δavg vs baseline=-0.9 ms (-4%)
  hide-vegetation      avg=19.3 ms  p95=20.6 ms  max=21.2 ms  Δavg vs baseline=-1.9 ms (-9%)
  no vegetation/grass  avg=19.5 ms  p95=23.3 ms  max=28.3 ms  Δavg vs baseline=-1.6 ms (-8%)
  hide-environment     avg=19.2 ms  p95=21.1 ms  max=21.8 ms  Δavg vs baseline=-1.9 ms (-9%)
  hide-settlement      avg=17.9 ms  p95=21.7 ms  max=26.1 ms  Δavg vs baseline=-3.3 ms (-15%)
  no water             avg=21.5 ms  p95=27.7 ms  max=31.5 ms  Δavg vs baseline=+0.4 ms (+2%)
  hide-terrain         avg=20.4 ms  p95=23.0 ms  max=23.2 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-npc-fauna       avg=14.2 ms  p95=15.8 ms  max=17.3 ms  Δavg vs baseline=-6.9 ms (-33%)
  no-shadows           avg=18.6 ms  p95=22.1 ms  max=26.5 ms  Δavg vs baseline=-2.5 ms (-12%)
  no-ao                avg=21.7 ms  p95=25.8 ms  max=26.9 ms  Δavg vs baseline=+0.6 ms (+3%)
  no-bloom             avg=21.5 ms  p95=22.9 ms  max=40.6 ms  Δavg vs baseline=+0.4 ms (+2%)
  no-smaa              avg=24.5 ms  p95=30.4 ms  max=50.7 ms  Δavg vs baseline=+3.4 ms (+16%)
  no-god-rays          avg=23.1 ms  p95=28.6 ms  max=29.6 ms  Δavg vs baseline=+2.0 ms (+9%)
  no-film-grade        avg=22.0 ms  p95=25.9 ms  max=28.9 ms  Δavg vs baseline=+0.8 ms (+4%)
  no postprocessing    avg=25.6 ms  p95=31.0 ms  max=32.7 ms  Δavg vs baseline=+4.5 ms (+21%)
  no mirrors           avg=23.0 ms  p95=25.1 ms  max=26.2 ms  Δavg vs baseline=+1.8 ms (+9%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=20.1 ms  p95=23.1 ms  max=26.9 ms
  CPU wall      avg=21.1 ms  p95=26.0 ms  max=28.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
