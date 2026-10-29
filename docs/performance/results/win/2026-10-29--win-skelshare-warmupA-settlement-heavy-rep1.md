# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T13:36:18.901Z
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
Frames: 777
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 2bca37bcba8388d22d324c73733c03da695da59e
  runId: 2026-10-29T13-35-09-605Z-4cmyqm
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
  populationGate: stable waited=5338ms npc=53
  gpuTimer: available=true resolved=true samples=781 span=postprocess+labels

FPS:
  avg: 28.2
  min: 10
  p1: 11

Frame time (wall-clock):
  avg: 35.4 ms
  p50: 35.3 ms
  p95: 41.9 ms
  p99: 88.9 ms
  max: 100.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.9 p95=9.5 p99=60.9 max=66.7 n=777
  render: p50=27.9 p95=32.7 p99=35.2 max=49.7 n=777
  frame: p50=35.3 p95=41.9 p99=88.9 max=100.5 n=777

Rendering (combined renderer.info):
  draw calls: 2090 avg / 2426 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 924
  textures: 780

Pass submissions (actual):
  reliability: observed
  frames: 782 shadowRefresh=782 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 402
  main calls avg: 1374

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=29.7k meshes=510 inst=512

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=20 tris=25.8k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=115 tris=14.8k meshes=115 inst=115

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
      far  agents=88 camera-relevant=22 draws=389 tris=149.0k

Systems:
  WATER          4.0 ms
  NPC            4.6 ms
  FAUNA          1.9 ms
  PHYSICS        0.1 ms
  RENDER         23.2 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.5 ms draws=2085 tris=7.74M
  hide-grass         render=21.8 ms draws=2055 tris=7.43M
  hide-vegetation    render=21.1 ms draws=1907 tris=6.64M
  hide-vegetation-grass render=20.9 ms draws=1884 tris=6.34M
  hide-environment   render=20.3 ms draws=1868 tris=7.71M
  hide-settlement    render=16.2 ms draws=1302 tris=6.88M
  hide-water         render=22.1 ms draws=2062 tris=6.78M
  hide-terrain       render=21.1 ms draws=2023 tris=3.69M
  hide-npc-fauna     render=13.2 ms draws=1729 tris=7.43M
  no-shadows         render=16.9 ms draws=1694 tris=5.57M
  no-ao              render=21.2 ms draws=2069 tris=7.74M
  no-bloom           render=20.8 ms draws=2066 tris=7.75M
  no-smaa            render=21.3 ms draws=2087 tris=7.76M
  no-god-rays        render=19.8 ms draws=2064 tris=7.75M
  no-film-grade      render=19.5 ms draws=2054 tris=7.74M
  no-postprocessing  render=20.9 ms draws=2037 tris=7.75M
  no-reflections     render=21.3 ms draws=1748 tris=6.76M

Frame attribution:
  frame max: 100.5 ms
  largest labelled hitch: 0 ms
  unattributed: 100.5 ms

Long frames:
  threshold: 80 ms
  count: 15
  worst: 100.5 ms

Raw sidecar:
  sampling=full factor=1 exported=777/777

Recommendation:
Largest frame (100.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.6 ms/frame
  crowd pass: 0.0 ms/frame (13.1 ms cumulative)
  agent updates: 2.7 ms/frame (2132.8 ms cumulative)
  livestock: 1.4 ms/frame (1126.0 ms cumulative)
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
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.3
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 6.4/frame (6.4 rat candidates/frame)
    nearest scans: 25.7/frame (0.0 candidates/frame)
    water samples: 64.0/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 64.0/frame, 0.10 ms/frame (worst call 1.00 ms, 13777.6 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 56.3
    behaviour executions/frame: 25.8
    presentation executions/frame: 20.6
  rats: 0.1 ms/frame (112.1 ms cumulative)
  social: 0.0 ms/frame (4.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (151.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.9 ms/frame
  agent updates: 1.9 ms/frame (1482.1 ms cumulative)
  forest sampling: 0.1 ms/frame (60.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (12.5 ms cumulative)
    targeting: 0.0 ms/frame (25.8 ms cumulative)
    decision: 0.0 ms/frame (7.6 ms cumulative)
    behaviour: 1.4 ms/frame (1066.3 ms cumulative)
    life/presentation: 0.3 ms/frame (251.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.2
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 22.6
    behaviour executions/frame: 18.2
    presentation executions/frame: 15.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.8
    village scan candidates/frame: 1610.5
    player perception checks/frame: 30.2

  nearest scans: 25.3/frame (19681 calls)
  nearest candidates checked: 444.1/frame (345077 total)
  herd leader scans: 0.2/frame (167 calls)
  herd candidates checked: 6.4/frame (5010 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.3/frame (166.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 43.3/frame, 0.10 ms/frame (worst call 1.60 ms)
    collider queries: 43.3/frame, 0.00 ms/frame (worst call 1.00 ms, 683.2 colliders/frame)

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
Frames: 782
Shadow refresh frames: 782
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993153
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
  vegetation                   calls=23 tris=165556

Shadow (refresh only):
  calls avg: 402  tris avg: 2175056
  info calls avg: 402  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=13
  faunaFamily:dog              calls=7 tris=2232
  faunaFamily:donkey           calls=0 tris=102
  faunaFamily:sheep            calls=4 tris=1229
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2498
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=4 tris=4259
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8691
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
  vegetation                   calls=78 tris=554118

Main:
  calls avg: 1374  tris avg: 4582135
  info calls avg: 1777  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=20 tris=6193
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
Long frames: 15
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 15 total):

[LONG FRAME] 100.5ms
simulate        62.6ms
render          37.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.9ms
STREAMING        0.0ms
NPC              5.1ms
FAUNA           55.9ms
PHYSICS          0.1ms
RENDER          27.0ms
OTHER            1.5ms

Long frame #2:

[LONG FRAME] 97.5ms
simulate        66.7ms
render          30.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.7ms
STREAMING        0.0ms
NPC              5.6ms
FAUNA           59.3ms
PHYSICS          0.1ms
RENDER          23.2ms
OTHER            1.6ms

Long frame #3:

[LONG FRAME] 96.6ms
simulate        61.9ms
render          34.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.4ms
STREAMING        0.0ms
NPC              6.5ms
FAUNA           53.4ms
PHYSICS          0.1ms
RENDER          25.1ms
OTHER            2.1ms

Long frame #4:

[LONG FRAME] 95.9ms
simulate        60.7ms
render          35.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.9ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           55.3ms
PHYSICS          0.0ms
RENDER          26.1ms
OTHER            1.5ms

Long frame #5:

[LONG FRAME] 91ms
simulate        64.9ms
render          25.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.4ms
FAUNA           57.9ms
PHYSICS          0.1ms
RENDER          25.9ms
OTHER            1.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.5 ms  p95=23.5 ms  max=27.3 ms  Δavg vs baseline=—
  hide-grass           avg=21.8 ms  p95=24.0 ms  max=24.7 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-vegetation      avg=21.1 ms  p95=22.8 ms  max=22.9 ms  Δavg vs baseline=-1.3 ms (-6%)
  no vegetation/grass  avg=20.9 ms  p95=23.2 ms  max=24.8 ms  Δavg vs baseline=-1.5 ms (-7%)
  hide-environment     avg=20.3 ms  p95=22.0 ms  max=22.3 ms  Δavg vs baseline=-2.2 ms (-10%)
  hide-settlement      avg=16.2 ms  p95=18.4 ms  max=19.7 ms  Δavg vs baseline=-6.3 ms (-28%)
  no water             avg=22.1 ms  p95=23.4 ms  max=23.5 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-terrain         avg=21.1 ms  p95=22.6 ms  max=23.0 ms  Δavg vs baseline=-1.4 ms (-6%)
  hide-npc-fauna       avg=13.2 ms  p95=14.9 ms  max=15.0 ms  Δavg vs baseline=-9.3 ms (-41%)
  no-shadows           avg=16.9 ms  p95=17.9 ms  max=19.5 ms  Δavg vs baseline=-5.5 ms (-25%)
  no-ao                avg=21.2 ms  p95=22.8 ms  max=24.6 ms  Δavg vs baseline=-1.3 ms (-6%)
  no-bloom             avg=20.8 ms  p95=22.4 ms  max=22.9 ms  Δavg vs baseline=-1.6 ms (-7%)
  no-smaa              avg=21.3 ms  p95=23.8 ms  max=24.9 ms  Δavg vs baseline=-1.2 ms (-5%)
  no-god-rays          avg=19.8 ms  p95=23.6 ms  max=24.7 ms  Δavg vs baseline=-2.6 ms (-12%)
  no-film-grade        avg=19.5 ms  p95=22.6 ms  max=24.4 ms  Δavg vs baseline=-3.0 ms (-13%)
  no postprocessing    avg=20.9 ms  p95=22.4 ms  max=22.7 ms  Δavg vs baseline=-1.5 ms (-7%)
  no mirrors           avg=21.3 ms  p95=23.0 ms  max=25.4 ms  Δavg vs baseline=-1.2 ms (-5%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=24.3 ms  p95=28.5 ms  max=34.0 ms
  CPU wall      avg=22.5 ms  p95=23.5 ms  max=27.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
