# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T13:49:38.916Z
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
Frames: 854
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 2bca37bcba8388d22d324c73733c03da695da59e
  runId: 2026-10-29T13-48-31-229Z-m7f6dy
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
  populationGate: stable waited=7919ms npc=53
  gpuTimer: available=true resolved=true samples=860 span=postprocess+labels

FPS:
  avg: 29.3
  min: 10
  p1: 23

Frame time (wall-clock):
  avg: 34.2 ms
  p50: 34.8 ms
  p95: 40.5 ms
  p99: 44.2 ms
  max: 96.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.6 p95=8.8 p99=11.7 max=61.4 n=854
  render: p50=28 p95=32.7 p99=35.3 max=39.3 n=854
  frame: p50=34.8 p95=40.5 p99=44.2 max=96.7 n=854

Rendering (combined renderer.info):
  draw calls: 2098 avg / 2435 max
  triangles: 7.76M avg
  mirror draws: 314 avg
  geometries: 924
  textures: 780

Pass submissions (actual):
  reliability: observed
  frames: 861 shadowRefresh=861 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 410
  main calls avg: 1373

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1293 tris=1.35M meshes=1293 inst=3382
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=751 tris=822.2k meshes=751 inst=2666
  npc              draws=20 tris=25.8k meshes=20 inst=20
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
  decor            draws=199 tris=387.0k meshes=199 inst=305
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
      mid  agents=2 camera-relevant=2 draws=20 tris=25.8k
      far  agents=51 camera-relevant=19 draws=481 tris=603.7k
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
      far  agents=88 camera-relevant=21 draws=389 tris=149.0k

Systems:
  WATER          4.0 ms
  NPC            4.5 ms
  FAUNA          1.0 ms
  PHYSICS        0.1 ms
  RENDER         23.0 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.9 ms draws=2096 tris=7.76M
  hide-grass         render=21.9 ms draws=2051 tris=7.43M
  hide-vegetation    render=21.2 ms draws=1896 tris=6.64M
  hide-vegetation-grass render=20.9 ms draws=1868 tris=6.34M
  hide-environment   render=21.2 ms draws=1860 tris=7.70M
  hide-settlement    render=17.7 ms draws=1294 tris=6.87M
  hide-water         render=22.2 ms draws=2076 tris=6.79M
  hide-terrain       render=21.1 ms draws=2023 tris=3.69M
  hide-npc-fauna     render=13.2 ms draws=1730 tris=7.43M
  no-shadows         render=17.4 ms draws=1699 tris=5.57M
  no-ao              render=20.7 ms draws=2078 tris=7.75M
  no-bloom           render=19.7 ms draws=2061 tris=7.75M
  no-smaa            render=18.0 ms draws=2062 tris=7.75M
  no-god-rays        render=18.3 ms draws=2073 tris=7.75M
  no-film-grade      render=18.4 ms draws=2067 tris=7.74M
  no-postprocessing  render=21.1 ms draws=2038 tris=7.75M
  no-reflections     render=20.8 ms draws=1737 tris=6.75M

Frame attribution:
  frame max: 96.7 ms
  largest labelled hitch: 0 ms
  unattributed: 96.7 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 96.7 ms

Raw sidecar:
  sampling=full factor=1 exported=854/854

Recommendation:
Largest frame (96.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.5 ms/frame
  crowd pass: 0.0 ms/frame (14.0 ms cumulative)
  agent updates: 2.8 ms/frame (2349.0 ms cumulative)
  livestock: 1.4 ms/frame (1190.4 ms cumulative)
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
      behaviour: 0.8 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.9 predator candidates/frame)
    pest scans: 6.0/frame (6.0 rat candidates/frame)
    nearest scans: 24.5/frame (0.0 candidates/frame)
    water samples: 62.0/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 62.0/frame, 0.10 ms/frame (worst call 0.90 ms, 13516.9 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.3
    behaviour executions/frame: 24.6
    presentation executions/frame: 19.7
  rats: 0.1 ms/frame (79.3 ms cumulative)
  social: 0.0 ms/frame (3.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (162.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.0 ms/frame
  agent updates: 1.0 ms/frame (830.5 ms cumulative)
  forest sampling: 0.1 ms/frame (71.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.8 ms cumulative)
    targeting: 0.0 ms/frame (24.8 ms cumulative)
    decision: 0.0 ms/frame (9.7 ms cumulative)
    behaviour: 0.5 ms/frame (384.8 ms cumulative)
    life/presentation: 0.3 ms/frame (263.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.6
    full-rate agents/frame: 7.2
    reduced-cadence agents/frame: 23.1
    behaviour executions/frame: 17.6
    presentation executions/frame: 15.0

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 121.0
    village scan candidates/frame: 1609.7
    player perception checks/frame: 30.2

  nearest scans: 25.1/frame (21474 calls)
  nearest candidates checked: 448.5/frame (383017 total)
  herd leader scans: 0.3/frame (266 calls)
  herd candidates checked: 9.3/frame (7980 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.9/frame (157.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 27.4/frame, 0.00 ms/frame (worst call 1.10 ms)
    collider queries: 27.4/frame, 0.00 ms/frame (worst call 0.20 ms, 426.2 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 22
Resident instances: full=482171 filler=113472
Submitted instances: full=75310 filler=42552
Meshes submitted: 74
LOD submitted fraction: full=0.15618940168529422 filler=0.375
Flowers: unavailable
Allocation bytes (estimated): 57181728
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 861
Shadow refresh frames: 861
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 994306
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8876
  items                        calls=1 tris=633
  other                        calls=38 tris=2300
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9303
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=721
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1652
  settlement:houseStatic       calls=33 tris=80595
  settlement:landmarkGarden    calls=5 tris=82899
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=9361
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11778
  settlement:storageContainer  calls=28 tris=2319
  settlement:storageGoods      calls=40 tris=6982
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1702
  settlement:storageWoodHousehold calls=1 tris=5857
  settlement:storageWoodSettlementPrimary calls=1 tris=547
  settlement:storageWoodSettlementSecondary calls=1 tris=2819
  settlement:workplace         calls=11 tris=5299
  terrain                      calls=8 tris=590509
  vegetation                   calls=23 tris=165748

Shadow (refresh only):
  calls avg: 410  tris avg: 2180181
  info calls avg: 410  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=27
  faunaFamily:cow              calls=4 tris=1409
  faunaFamily:dog              calls=7 tris=2249
  faunaFamily:donkey           calls=0 tris=128
  faunaFamily:sheep            calls=4 tris=1248
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=5 tris=6167
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=3440
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8723
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
  calls avg: 1373  tris avg: 4581871
  info calls avg: 1784  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5929
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15128
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 96.7ms
simulate        61.4ms
render          35.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.9ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA           55.4ms
PHYSICS          0.1ms
RENDER          26.2ms
OTHER            2.2ms

Long frame #2:

[LONG FRAME] 81ms
simulate        59.4ms
render          21.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           53.2ms
PHYSICS          0.1ms
RENDER          21.5ms
OTHER            1.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.9 ms  p95=24.9 ms  max=27.1 ms  Δavg vs baseline=—
  hide-grass           avg=21.9 ms  p95=23.9 ms  max=24.6 ms  Δavg vs baseline=-1.0 ms (-5%)
  hide-vegetation      avg=21.2 ms  p95=22.3 ms  max=22.4 ms  Δavg vs baseline=-1.7 ms (-8%)
  no vegetation/grass  avg=20.9 ms  p95=21.9 ms  max=23.3 ms  Δavg vs baseline=-2.0 ms (-9%)
  hide-environment     avg=21.2 ms  p95=21.9 ms  max=22.4 ms  Δavg vs baseline=-1.7 ms (-7%)
  hide-settlement      avg=17.7 ms  p95=19.2 ms  max=19.9 ms  Δavg vs baseline=-5.2 ms (-23%)
  no water             avg=22.2 ms  p95=24.8 ms  max=25.2 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-terrain         avg=21.1 ms  p95=22.3 ms  max=23.0 ms  Δavg vs baseline=-1.7 ms (-8%)
  hide-npc-fauna       avg=13.2 ms  p95=14.9 ms  max=15.7 ms  Δavg vs baseline=-9.7 ms (-42%)
  no-shadows           avg=17.4 ms  p95=19.1 ms  max=19.6 ms  Δavg vs baseline=-5.5 ms (-24%)
  no-ao                avg=20.7 ms  p95=22.2 ms  max=22.6 ms  Δavg vs baseline=-2.2 ms (-10%)
  no-bloom             avg=19.7 ms  p95=21.6 ms  max=24.6 ms  Δavg vs baseline=-3.2 ms (-14%)
  no-smaa              avg=18.0 ms  p95=18.8 ms  max=19.4 ms  Δavg vs baseline=-4.9 ms (-21%)
  no-god-rays          avg=18.3 ms  p95=20.9 ms  max=22.2 ms  Δavg vs baseline=-4.5 ms (-20%)
  no-film-grade        avg=18.4 ms  p95=19.6 ms  max=20.0 ms  Δavg vs baseline=-4.5 ms (-20%)
  no postprocessing    avg=21.1 ms  p95=22.6 ms  max=31.0 ms  Δavg vs baseline=-1.8 ms (-8%)
  no mirrors           avg=20.8 ms  p95=22.1 ms  max=22.5 ms  Δavg vs baseline=-2.1 ms (-9%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=21.0 ms  p95=22.5 ms  max=24.5 ms
  CPU wall      avg=22.9 ms  p95=24.9 ms  max=27.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
