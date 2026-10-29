# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T19:36:48.200Z
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
Frames: 765
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 8a2bea88cd5d6e56da741e08e2bbffd5e04c483e
  runId: 2026-10-29T19-35-38-676Z-s65p5q
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
  populationGate: stable waited=6079ms npc=53
  gpuTimer: available=true resolved=true samples=770 span=postprocess+labels

FPS:
  avg: 27.5
  min: 7
  p1: 11

Frame time (wall-clock):
  avg: 36.4 ms
  p50: 34.4 ms
  p95: 55.2 ms
  p99: 94.8 ms
  max: 140.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.7 p95=22.1 p99=64.9 max=108.6 n=765
  render: p50=27 p95=33.1 p99=36.4 max=46.4 n=765
  frame: p50=34.4 p95=55.2 p99=94.8 max=140.9 n=765

Rendering (combined renderer.info):
  draw calls: 2089 avg / 2419 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 964
  textures: 863

Pass submissions (actual):
  reliability: observed
  frames: 771 shadowRefresh=771 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 403
  main calls avg: 1371

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
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=30 tris=37.5k meshes=30 inst=30
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=117 tris=15.1k meshes=117 inst=117

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
      mid  agents=3 camera-relevant=2 draws=10 tris=3.2k
      far  agents=88 camera-relevant=20 draws=389 tris=149.0k

Systems:
  WATER          4.0 ms
  NPC            4.4 ms
  FAUNA          3.7 ms
  PHYSICS        0.1 ms
  RENDER         22.6 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.3 ms draws=2079 tris=7.74M
  hide-grass         render=21.1 ms draws=2052 tris=7.43M
  hide-vegetation    render=19.8 ms draws=1900 tris=6.65M
  hide-vegetation-grass render=19.5 ms draws=1867 tris=6.33M
  hide-environment   render=19.8 ms draws=1860 tris=7.69M
  hide-settlement    render=15.4 ms draws=1278 tris=6.86M
  hide-water         render=21.1 ms draws=2071 tris=6.79M
  hide-terrain       render=20.2 ms draws=2032 tris=3.70M
  hide-npc-fauna     render=13.1 ms draws=1733 tris=7.43M
  no-shadows         render=17.3 ms draws=1703 tris=5.57M
  no-ao              render=20.1 ms draws=2075 tris=7.74M
  no-bloom           render=20.4 ms draws=2086 tris=7.76M
  no-smaa            render=18.2 ms draws=2072 tris=7.75M
  no-god-rays        render=18.8 ms draws=2073 tris=7.75M
  no-film-grade      render=18.3 ms draws=2065 tris=7.75M
  no-postprocessing  render=20.7 ms draws=2036 tris=7.74M
  no-reflections     render=20.5 ms draws=1748 tris=6.75M

Frame attribution:
  frame max: 140.9 ms
  largest labelled hitch: 0 ms
  unattributed: 140.9 ms

Long frames:
  threshold: 80 ms
  count: 34
  worst: 140.9 ms

Raw sidecar:
  sampling=full factor=1 exported=765/765

Recommendation:
Largest frame (140.9 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.4 ms/frame
  crowd pass: 0.0 ms/frame (13.9 ms cumulative)
  agent updates: 2.8 ms/frame (2109.0 ms cumulative)
  livestock: 1.3 ms/frame (984.4 ms cumulative)
    loaded tick: 1.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 6.1/frame (6.1 rat candidates/frame)
    nearest scans: 24.8/frame (0.0 candidates/frame)
    water samples: 50.5/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 50.5/frame, 0.10 ms/frame (worst call 1.00 ms, 11257.2 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 25.0
    presentation executions/frame: 20.3
  rats: 0.1 ms/frame (64.9 ms cumulative)
  social: 0.0 ms/frame (5.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (150.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.7 ms/frame
  agent updates: 3.7 ms/frame (2814.3 ms cumulative)
  forest sampling: 0.1 ms/frame (65.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.4 ms cumulative)
    targeting: 0.0 ms/frame (25.3 ms cumulative)
    decision: 0.0 ms/frame (8.7 ms cumulative)
    behaviour: 3.2 ms/frame (2410.6 ms cumulative)
    life/presentation: 0.3 ms/frame (233.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 7.8
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 17.8
    presentation executions/frame: 15.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.4
    village scan candidates/frame: 1612.7
    player perception checks/frame: 30.1

  nearest scans: 25.0/frame (19100 calls)
  nearest candidates checked: 440.4/frame (336888 total)
  herd leader scans: 0.2/frame (157 calls)
  herd candidates checked: 6.2/frame (4710 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.0/frame (165.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 78.7/frame, 0.10 ms/frame (worst call 1.50 ms)
    collider queries: 78.7/frame, 0.10 ms/frame (worst call 0.10 ms, 1351.1 colliders/frame)

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
Frames: 771
Shadow refresh frames: 771
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 994441
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8877
  items                        calls=1 tris=633
  other                        calls=38 tris=2300
  settlement:decor             calls=1 tris=838
  settlement:fence             calls=2 tris=9304
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=721
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1652
  settlement:houseStatic       calls=33 tris=80606
  settlement:landmarkGarden    calls=5 tris=82910
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=9362
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11779
  settlement:storageContainer  calls=28 tris=2319
  settlement:storageGoods      calls=40 tris=6983
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1702
  settlement:storageWoodHousehold calls=1 tris=5858
  settlement:storageWoodSettlementPrimary calls=1 tris=547
  settlement:storageWoodSettlementSecondary calls=1 tris=2820
  settlement:workplace         calls=11 tris=5300
  terrain                      calls=8 tris=590589
  vegetation                   calls=23 tris=165770

Shadow (refresh only):
  calls avg: 403  tris avg: 2173559
  info calls avg: 403  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=35
  faunaFamily:cow              calls=3 tris=969
  faunaFamily:dog              calls=7 tris=2411
  faunaFamily:sheep            calls=4 tris=1147
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2260
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=2 tris=1975
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
  vegetation                   calls=78 tris=554118

Main:
  calls avg: 1371  tris avg: 4581225
  info calls avg: 1774  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5283
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
Long frames: 34
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 34 total):

[LONG FRAME] 140.9ms
simulate       108.6ms
render          32.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.5ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA          101.9ms
PHYSICS          0.2ms
RENDER          24.6ms
OTHER            2.2ms

Long frame #2:

[LONG FRAME] 108.4ms
simulate        61.6ms
render          46.4ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           14.7ms
STREAMING        0.0ms
NPC              4.2ms
FAUNA           55.8ms
PHYSICS          0.2ms
RENDER          31.6ms
OTHER            1.8ms

Long frame #3:

[LONG FRAME] 106.3ms
simulate        69.6ms
render          36.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.2ms
STREAMING        0.0ms
NPC              5.5ms
FAUNA           61.8ms
PHYSICS          0.2ms
RENDER          27.3ms
OTHER            2.3ms

Long frame #4:

[LONG FRAME] 100.5ms
simulate        64.8ms
render          35.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.0ms
STREAMING        0.0ms
NPC              4.3ms
FAUNA           58.6ms
PHYSICS          0.1ms
RENDER          26.6ms
OTHER            1.9ms

Long frame #5:

[LONG FRAME] 99.5ms
simulate        72.7ms
render          26.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.8ms
STREAMING        0.1ms
NPC              5.7ms
FAUNA           65.6ms
PHYSICS          0.1ms
RENDER          19.7ms
OTHER            1.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.3 ms  p95=22.4 ms  max=24.9 ms  Δavg vs baseline=—
  hide-grass           avg=21.1 ms  p95=23.2 ms  max=26.0 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-vegetation      avg=19.8 ms  p95=21.2 ms  max=22.5 ms  Δavg vs baseline=-1.5 ms (-7%)
  no vegetation/grass  avg=19.5 ms  p95=20.7 ms  max=20.8 ms  Δavg vs baseline=-1.9 ms (-9%)
  hide-environment     avg=19.8 ms  p95=21.7 ms  max=23.4 ms  Δavg vs baseline=-1.6 ms (-7%)
  hide-settlement      avg=15.4 ms  p95=17.9 ms  max=18.1 ms  Δavg vs baseline=-5.9 ms (-28%)
  no water             avg=21.1 ms  p95=25.6 ms  max=26.2 ms  Δavg vs baseline=-0.3 ms (-1%)
  hide-terrain         avg=20.2 ms  p95=21.5 ms  max=22.7 ms  Δavg vs baseline=-1.1 ms (-5%)
  hide-npc-fauna       avg=13.1 ms  p95=15.5 ms  max=15.7 ms  Δavg vs baseline=-8.2 ms (-38%)
  no-shadows           avg=17.3 ms  p95=20.1 ms  max=35.9 ms  Δavg vs baseline=-4.0 ms (-19%)
  no-ao                avg=20.1 ms  p95=22.5 ms  max=27.5 ms  Δavg vs baseline=-1.2 ms (-6%)
  no-bloom             avg=20.4 ms  p95=23.2 ms  max=30.6 ms  Δavg vs baseline=-1.0 ms (-5%)
  no-smaa              avg=18.2 ms  p95=21.9 ms  max=22.1 ms  Δavg vs baseline=-3.1 ms (-15%)
  no-god-rays          avg=18.8 ms  p95=21.2 ms  max=21.9 ms  Δavg vs baseline=-2.6 ms (-12%)
  no-film-grade        avg=18.3 ms  p95=20.4 ms  max=21.6 ms  Δavg vs baseline=-3.0 ms (-14%)
  no postprocessing    avg=20.7 ms  p95=22.8 ms  max=23.9 ms  Δavg vs baseline=-0.6 ms (-3%)
  no mirrors           avg=20.5 ms  p95=23.2 ms  max=29.6 ms  Δavg vs baseline=-0.8 ms (-4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=22.3 ms  p95=33.7 ms  max=34.6 ms
  CPU wall      avg=21.3 ms  p95=22.4 ms  max=24.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
