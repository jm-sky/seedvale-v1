# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T15:39:20.993Z
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
Frames: 749
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: ccc4d3783a9d069d308a635a8e47179f6645cb17
  runId: 2026-10-28T15-38-09-457Z-ajxl2y
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
  viewport: 1586x806
  drawingBuffer: 1982x1007
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=6072ms npc=53
  gpuTimer: available=true resolved=true samples=755 span=postprocess+labels

FPS:
  avg: 26.6
  min: 8
  p1: 11

Frame time (wall-clock):
  avg: 37.5 ms
  p50: 36.7 ms
  p95: 48.8 ms
  p99: 87.5 ms
  max: 129.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=9.7 p95=15 p99=58.7 max=69.5 n=749
  render: p50=26.4 p95=31.9 p99=41.2 max=73.9 n=749
  frame: p50=36.7 p95=48.8 p99=87.5 max=129.2 n=749

Rendering (combined renderer.info):
  draw calls: 2183 avg / 2542 max
  triangles: 7.76M avg
  mirror draws: 344 avg
  geometries: 978
  textures: 869

Pass submissions (actual):
  reliability: observed
  frames: 756 shadowRefresh=756 shadowSkipped=0
  mirror calls avg: 344
  shadow calls avg: 404
  main calls avg: 1434

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1459 tris=1.37M meshes=1459 inst=3548
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=509 tris=628.5k meshes=509 inst=509
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=20 tris=25.6k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

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
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.3k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=25.6k
      far  agents=51 camera-relevant=19 draws=489 tris=602.8k
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
      far  agents=88 camera-relevant=20 draws=389 tris=149.0k

Systems:
  WATER          3.9 ms
  NPC            3.9 ms
  FAUNA          2.6 ms
  PHYSICS        0.1 ms
  RENDER         21.8 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.4 ms draws=2183 tris=7.76M
  hide-grass         render=21.0 ms draws=2143 tris=7.44M
  hide-vegetation    render=19.3 ms draws=1987 tris=6.65M
  hide-vegetation-grass render=19.7 ms draws=1954 tris=6.33M
  hide-environment   render=20.2 ms draws=1948 tris=7.71M
  hide-settlement    render=16.9 ms draws=1289 tris=6.86M
  hide-water         render=20.7 ms draws=2169 tris=6.80M
  hide-terrain       render=20.1 ms draws=2110 tris=3.70M
  hide-npc-fauna     render=13.0 ms draws=1820 tris=7.44M
  no-shadows         render=17.2 ms draws=1785 tris=5.58M
  no-ao              render=20.3 ms draws=2155 tris=7.75M
  no-bloom           render=22.2 ms draws=2154 tris=7.76M
  no-smaa            render=19.1 ms draws=2157 tris=7.76M
  no-god-rays        render=20.2 ms draws=2142 tris=7.75M
  no-film-grade      render=19.1 ms draws=2147 tris=7.75M
  no-postprocessing  render=20.0 ms draws=2106 tris=7.75M
  no-reflections     render=20.4 ms draws=1791 tris=6.75M

Frame attribution:
  frame max: 129.2 ms
  largest labelled hitch: 0 ms
  unattributed: 129.2 ms

Long frames:
  threshold: 80 ms
  count: 20
  worst: 129.2 ms

Raw sidecar:
  sampling=full factor=1 exported=749/749

Recommendation:
Largest frame (129.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.9 ms/frame
  crowd pass: 0.0 ms/frame (12.1 ms cumulative)
  agent updates: 2.4 ms/frame (1826.3 ms cumulative)
  livestock: 1.2 ms/frame (909.8 ms cumulative)
    loaded tick: 1.2 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (105.0 predator candidates/frame)
    pest scans: 6.5/frame (6.5 rat candidates/frame)
    nearest scans: 26.5/frame (0.0 candidates/frame)
    water samples: 57.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 57.6/frame, 0.10 ms/frame (worst call 0.80 ms, 12887.9 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 26.7
    presentation executions/frame: 21.2
  rats: 0.1 ms/frame (63.8 ms cumulative)
  social: 0.0 ms/frame (4.0 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (127.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.6 ms/frame
  agent updates: 2.6 ms/frame (1911.3 ms cumulative)
  forest sampling: 0.1 ms/frame (55.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (12.5 ms cumulative)
    targeting: 0.0 ms/frame (17.0 ms cumulative)
    decision: 0.0 ms/frame (7.0 ms cumulative)
    behaviour: 2.0 ms/frame (1535.1 ms cumulative)
    life/presentation: 0.3 ms/frame (233.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 6.6
    reduced-cadence agents/frame: 23.7
    behaviour executions/frame: 17.8
    presentation executions/frame: 15.5

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 121.1
    village scan candidates/frame: 1618.0
    player perception checks/frame: 30.3

  nearest scans: 25.0/frame (18691 calls)
  nearest candidates checked: 452.8/frame (339143 total)
  herd leader scans: 0.2/frame (159 calls)
  herd candidates checked: 6.4/frame (4770 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.3/frame (177.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 58.4/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 58.4/frame, 0.00 ms/frame (worst call 1.50 ms, 1206.3 colliders/frame)

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
Frames: 756
Shadow refresh frames: 756
Shadow skipped frames: 0

Mirror:
  calls avg: 344  tris avg: 995546
  info calls avg: 344  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2290
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3120
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
  vegetation                   calls=23 tris=165556

Shadow (refresh only):
  calls avg: 404  tris avg: 2177055
  info calls avg: 404  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=0 tris=133
  faunaFamily:dog              calls=6 tris=1950
  faunaFamily:sheep            calls=4 tris=1096
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3662
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=5 tris=4815
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8720
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
  calls avg: 1434  tris avg: 4586775
  info calls avg: 1838  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5667
  grass                        calls=33 tris=316772
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=109 tris=133838
  npcFamily:Peasant_Boots      calls=9 tris=12110
  npcFamily:Wizard             calls=35 tris=34944
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15114
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=90 tris=6240
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
  settlement:storageGoods      calls=85 tris=15184
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=2 tris=11700
  settlement:storageWoodSettlementPrimary calls=2 tris=2184
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=84 tris=382238
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 20
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 20 total):

[LONG FRAME] 129.2ms
simulate        69.5ms
render          59.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           14.4ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           60.0ms
PHYSICS          0.1ms
RENDER          45.1ms
OTHER            6.0ms

Long frame #2:

[LONG FRAME] 95.5ms
simulate        58.1ms
render          37.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.9ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA           48.4ms
PHYSICS          0.0ms
RENDER          26.2ms
OTHER            5.5ms

Long frame #3:

[LONG FRAME] 91.8ms
simulate        57.1ms
render          34.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.4ms
STREAMING        0.0ms
NPC              3.5ms
FAUNA           48.0ms
PHYSICS          0.0ms
RENDER          25.2ms
OTHER            5.7ms

Long frame #4:

[LONG FRAME] 89.2ms
simulate        14.9ms
render          73.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           24.0ms
STREAMING        0.0ms
NPC              5.7ms
FAUNA            1.9ms
PHYSICS          0.1ms
RENDER          49.9ms
OTHER            7.6ms

Long frame #5:

[LONG FRAME] 88.5ms
simulate        55.6ms
render          32.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.9ms
STREAMING        0.0ms
NPC              3.4ms
FAUNA           46.6ms
PHYSICS          0.0ms
RENDER          23.9ms
OTHER            5.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.4 ms  p95=22.7 ms  max=23.4 ms  Δavg vs baseline=—
  hide-grass           avg=21.0 ms  p95=23.2 ms  max=26.5 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-vegetation      avg=19.3 ms  p95=20.7 ms  max=23.2 ms  Δavg vs baseline=-2.1 ms (-10%)
  no vegetation/grass  avg=19.7 ms  p95=22.3 ms  max=24.5 ms  Δavg vs baseline=-1.7 ms (-8%)
  hide-environment     avg=20.2 ms  p95=22.3 ms  max=23.2 ms  Δavg vs baseline=-1.1 ms (-5%)
  hide-settlement      avg=16.9 ms  p95=18.9 ms  max=19.5 ms  Δavg vs baseline=-4.5 ms (-21%)
  no water             avg=20.7 ms  p95=21.8 ms  max=22.2 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-terrain         avg=20.1 ms  p95=22.6 ms  max=23.1 ms  Δavg vs baseline=-1.2 ms (-6%)
  hide-npc-fauna       avg=13.0 ms  p95=14.9 ms  max=15.4 ms  Δavg vs baseline=-8.3 ms (-39%)
  no-shadows           avg=17.2 ms  p95=19.2 ms  max=20.2 ms  Δavg vs baseline=-4.2 ms (-20%)
  no-ao                avg=20.3 ms  p95=21.9 ms  max=24.2 ms  Δavg vs baseline=-1.0 ms (-5%)
  no-bloom             avg=22.2 ms  p95=25.6 ms  max=26.7 ms  Δavg vs baseline=+0.8 ms (+4%)
  no-smaa              avg=19.1 ms  p95=21.7 ms  max=22.9 ms  Δavg vs baseline=-2.3 ms (-11%)
  no-god-rays          avg=20.2 ms  p95=22.5 ms  max=24.5 ms  Δavg vs baseline=-1.1 ms (-5%)
  no-film-grade        avg=19.1 ms  p95=22.0 ms  max=22.9 ms  Δavg vs baseline=-2.3 ms (-11%)
  no postprocessing    avg=20.0 ms  p95=21.6 ms  max=21.6 ms  Δavg vs baseline=-1.4 ms (-7%)
  no mirrors           avg=20.4 ms  p95=21.8 ms  max=21.8 ms  Δavg vs baseline=-1.0 ms (-5%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=21.2 ms  p95=30.7 ms  max=36.3 ms
  CPU wall      avg=21.4 ms  p95=22.7 ms  max=23.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
