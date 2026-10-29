# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T16:24:52.375Z
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
Frames: 820
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: cee85ed2fa8531600e58aa2d0c646c3cff2cb102
  runId: 2026-10-29T16-23-44-463Z-0p77me
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
  populationGate: stable waited=6428ms npc=53
  gpuTimer: available=true resolved=true samples=825 span=postprocess+labels

FPS:
  avg: 28.6
  min: 9
  p1: 11

Frame time (wall-clock):
  avg: 35 ms
  p50: 34.8 ms
  p95: 41.6 ms
  p99: 91.3 ms
  max: 108.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7 p95=9.9 p99=64.4 max=69.7 n=820
  render: p50=27.4 p95=32.8 p99=38.1 max=54.4 n=820
  frame: p50=34.8 p95=41.6 p99=91.3 max=108.4 n=820

Rendering (combined renderer.info):
  draw calls: 2088 avg / 2421 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 929
  textures: 816

Pass submissions (actual):
  reliability: observed
  frames: 826 shadowRefresh=826 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 401
  main calls avg: 1372

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
  other            draws=513 tris=30.1k meshes=513 inst=515

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=30 tris=37.5k meshes=30 inst=30
  fauna            draws=17 tris=5.6k meshes=17 inst=17
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
      mid  agents=4 camera-relevant=3 draws=17 tris=5.6k
      far  agents=87 camera-relevant=22 draws=382 tris=146.6k

Systems:
  WATER          4.0 ms
  NPC            4.7 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         22.7 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.5 ms draws=2102 tris=7.76M
  hide-grass         render=21.6 ms draws=2066 tris=7.44M
  hide-vegetation    render=21.1 ms draws=1907 tris=6.65M
  hide-vegetation-grass render=20.8 ms draws=1886 tris=6.34M
  hide-environment   render=21.7 ms draws=1852 tris=7.69M
  hide-settlement    render=17.7 ms draws=1289 tris=6.86M
  hide-water         render=22.1 ms draws=2064 tris=6.78M
  hide-terrain       render=20.6 ms draws=2020 tris=3.69M
  hide-npc-fauna     render=15.1 ms draws=1729 tris=7.43M
  no-shadows         render=16.9 ms draws=1691 tris=5.57M
  no-ao              render=20.4 ms draws=2068 tris=7.74M
  no-bloom           render=20.7 ms draws=2046 tris=7.74M
  no-smaa            render=22.2 ms draws=2053 tris=7.74M
  no-god-rays        render=22.0 ms draws=2055 tris=7.74M
  no-film-grade      render=22.4 ms draws=2053 tris=7.74M
  no-postprocessing  render=20.9 ms draws=2024 tris=7.74M
  no-reflections     render=20.7 ms draws=1737 tris=6.74M

Frame attribution:
  frame max: 108.4 ms
  largest labelled hitch: 0 ms
  unattributed: 108.4 ms

Long frames:
  threshold: 80 ms
  count: 11
  worst: 108.4 ms

Raw sidecar:
  sampling=full factor=1 exported=820/820

Recommendation:
Largest frame (108.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (15.4 ms cumulative)
  agent updates: 2.9 ms/frame (2392.2 ms cumulative)
  livestock: 1.4 ms/frame (1131.9 ms cumulative)
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
      other update: 0.2 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 6.1/frame (6.1 rat candidates/frame)
    nearest scans: 24.2/frame (0.0 candidates/frame)
    water samples: 51.8/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 51.8/frame, 0.10 ms/frame (worst call 0.80 ms, 11350.1 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 56.1
    behaviour executions/frame: 24.4
    presentation executions/frame: 19.8
  rats: 0.1 ms/frame (84.1 ms cumulative)
  social: 0.0 ms/frame (3.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (169.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.8 ms/frame (1465.9 ms cumulative)
  forest sampling: 0.1 ms/frame (77.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (16.8 ms cumulative)
    targeting: 0.0 ms/frame (25.0 ms cumulative)
    decision: 0.0 ms/frame (8.2 ms cumulative)
    behaviour: 1.2 ms/frame (966.0 ms cumulative)
    life/presentation: 0.4 ms/frame (298.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.9
    full-rate agents/frame: 9.7
    reduced-cadence agents/frame: 20.3
    behaviour executions/frame: 18.9
    presentation executions/frame: 16.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.1
    village scan candidates/frame: 1612.1
    player perception checks/frame: 30.0

  nearest scans: 25.9/frame (21234 calls)
  nearest candidates checked: 435.3/frame (356913 total)
  herd leader scans: 0.2/frame (147 calls)
  herd candidates checked: 5.4/frame (4410 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.0/frame (156.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 22.1/frame, 0.00 ms/frame (worst call 1.00 ms)
    collider queries: 22.1/frame, 0.00 ms/frame (worst call 0.10 ms, 373.4 colliders/frame)

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
Frames: 826
Shadow refresh frames: 826
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
  calls avg: 401  tris avg: 2173847
  info calls avg: 401  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=14
  faunaFamily:cow              calls=0 tris=74
  faunaFamily:dog              calls=7 tris=2393
  faunaFamily:donkey           calls=0 tris=7
  faunaFamily:sheep            calls=4 tris=1178
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3072
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=2 tris=2348
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
  calls avg: 1372  tris avg: 4581583
  info calls avg: 1774  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5641
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
Long frames: 11
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 11 total):

[LONG FRAME] 108.4ms
simulate        69.7ms
render          38.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.7ms
STREAMING        0.0ms
NPC              6.3ms
FAUNA           61.7ms
PHYSICS          0.1ms
RENDER          28.7ms
OTHER            1.9ms

Long frame #2:

[LONG FRAME] 100.4ms
simulate        63.8ms
render          36.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.9ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA           57.5ms
PHYSICS          0.2ms
RENDER          27.8ms
OTHER            1.5ms

Long frame #3:

[LONG FRAME] 98ms
simulate        67.1ms
render          30.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.0ms
STREAMING        0.0ms
NPC              7.4ms
FAUNA           57.7ms
PHYSICS          0.2ms
RENDER          22.9ms
OTHER            1.8ms

Long frame #4:

[LONG FRAME] 97.8ms
simulate        64.5ms
render          33.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.0ms
STREAMING        0.1ms
NPC              4.3ms
FAUNA           58.4ms
PHYSICS          0.1ms
RENDER          24.1ms
OTHER            1.8ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #5:

[LONG FRAME] 96.8ms
simulate        64.5ms
render          32.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.5ms
STREAMING        0.0ms
NPC              5.1ms
FAUNA           57.5ms
PHYSICS          0.1ms
RENDER          23.7ms
OTHER            1.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.5 ms  p95=24.4 ms  max=32.2 ms  Δavg vs baseline=—
  hide-grass           avg=21.6 ms  p95=22.6 ms  max=22.9 ms  Δavg vs baseline=-1.0 ms (-4%)
  hide-vegetation      avg=21.1 ms  p95=22.7 ms  max=28.7 ms  Δavg vs baseline=-1.4 ms (-6%)
  no vegetation/grass  avg=20.8 ms  p95=22.1 ms  max=23.8 ms  Δavg vs baseline=-1.8 ms (-8%)
  hide-environment     avg=21.7 ms  p95=23.6 ms  max=32.3 ms  Δavg vs baseline=-0.9 ms (-4%)
  hide-settlement      avg=17.7 ms  p95=18.8 ms  max=19.7 ms  Δavg vs baseline=-4.8 ms (-21%)
  no water             avg=22.1 ms  p95=24.7 ms  max=29.9 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-terrain         avg=20.6 ms  p95=22.3 ms  max=23.0 ms  Δavg vs baseline=-2.0 ms (-9%)
  hide-npc-fauna       avg=15.1 ms  p95=17.5 ms  max=24.2 ms  Δavg vs baseline=-7.4 ms (-33%)
  no-shadows           avg=16.9 ms  p95=18.3 ms  max=27.8 ms  Δavg vs baseline=-5.6 ms (-25%)
  no-ao                avg=20.4 ms  p95=23.7 ms  max=31.9 ms  Δavg vs baseline=-2.1 ms (-9%)
  no-bloom             avg=20.7 ms  p95=21.7 ms  max=22.3 ms  Δavg vs baseline=-1.8 ms (-8%)
  no-smaa              avg=22.2 ms  p95=23.3 ms  max=28.5 ms  Δavg vs baseline=-0.3 ms (-1%)
  no-god-rays          avg=22.0 ms  p95=25.4 ms  max=29.5 ms  Δavg vs baseline=-0.6 ms (-3%)
  no-film-grade        avg=22.4 ms  p95=24.3 ms  max=30.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=20.9 ms  p95=23.4 ms  max=25.5 ms  Δavg vs baseline=-1.6 ms (-7%)
  no mirrors           avg=20.7 ms  p95=22.1 ms  max=33.4 ms  Δavg vs baseline=-1.8 ms (-8%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=21.0 ms  p95=22.5 ms  max=25.5 ms
  CPU wall      avg=22.5 ms  p95=24.4 ms  max=32.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
