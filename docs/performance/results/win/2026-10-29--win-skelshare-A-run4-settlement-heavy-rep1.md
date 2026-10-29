# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T13:59:45.255Z
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
Frames: 712
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 2bca37bcba8388d22d324c73733c03da695da59e
  runId: 2026-10-29T13-58-33-932Z-w8qksz
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
  populationGate: stable waited=7018ms npc=53
  gpuTimer: available=true resolved=true samples=717 span=postprocess+labels

FPS:
  avg: 26.2
  min: 9
  p1: 11

Frame time (wall-clock):
  avg: 38.2 ms
  p50: 36.2 ms
  p95: 67.4 ms
  p99: 95 ms
  max: 107.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7 p95=37.3 p99=62.4 max=78.6 n=712
  render: p50=28.7 p95=34.6 p99=42.5 max=55.5 n=712
  frame: p50=36.2 p95=67.4 p99=95 max=107.4 n=712

Rendering (combined renderer.info):
  draw calls: 2126 avg / 2462 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 929
  textures: 810

Pass submissions (actual):
  reliability: observed
  frames: 719 shadowRefresh=719 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 404
  main calls avg: 1409

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=32 tris=37.7k meshes=32 inst=32
  fauna            draws=17 tris=5.6k meshes=17 inst=17
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
      Peasant          agents=28 draws=258 tris=310.4k skinned=258/258
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Wizard           agents=4 draws=47 tris=46.9k skinned=47/47
      Herbalist        agents=4 draws=41 tris=52.4k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.7k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=3 camera-relevant=2 draws=32 tris=37.7k
      far  agents=50 camera-relevant=19 draws=469 tris=591.8k
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
      far  agents=87 camera-relevant=21 draws=382 tris=146.6k

Systems:
  WATER          4.0 ms
  NPC            5.0 ms
  FAUNA          3.4 ms
  PHYSICS        0.1 ms
  RENDER         23.9 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.3 ms draws=2119 tris=7.75M
  hide-grass         render=20.9 ms draws=2091 tris=7.44M
  hide-vegetation    render=20.8 ms draws=1938 tris=6.65M
  hide-vegetation-grass render=22.0 ms draws=1905 tris=6.33M
  hide-environment   render=19.3 ms draws=1851 tris=7.69M
  hide-settlement    render=18.0 ms draws=1317 tris=6.86M
  hide-water         render=21.1 ms draws=2094 tris=6.78M
  hide-terrain       render=21.3 ms draws=2054 tris=3.69M
  hide-npc-fauna     render=13.1 ms draws=1766 tris=7.43M
  no-shadows         render=18.3 ms draws=1734 tris=5.58M
  no-ao              render=21.9 ms draws=2110 tris=7.76M
  no-bloom           render=22.5 ms draws=2099 tris=7.75M
  no-smaa            render=21.7 ms draws=2097 tris=7.75M
  no-god-rays        render=21.9 ms draws=2094 tris=7.75M
  no-film-grade      render=21.4 ms draws=2095 tris=7.75M
  no-postprocessing  render=23.2 ms draws=2082 tris=7.76M
  no-reflections     render=22.2 ms draws=1786 tris=6.75M

Frame attribution:
  frame max: 107.4 ms
  largest labelled hitch: 0 ms
  unattributed: 107.4 ms

Long frames:
  threshold: 80 ms
  count: 31
  worst: 107.4 ms

Raw sidecar:
  sampling=full factor=1 exported=712/712

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 5.0 ms/frame
  crowd pass: 0.0 ms/frame (14.9 ms cumulative)
  agent updates: 2.9 ms/frame (2030.2 ms cumulative)
  livestock: 1.8 ms/frame (1262.6 ms cumulative)
    loaded tick: 1.8 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.8 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 1.2 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.6
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (105.0 predator candidates/frame)
    pest scans: 6.5/frame (6.5 rat candidates/frame)
    nearest scans: 26.9/frame (0.0 candidates/frame)
    water samples: 73.6/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 73.6/frame, 0.10 ms/frame (worst call 0.90 ms, 16664.9 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 56.4
    behaviour executions/frame: 27.0
    presentation executions/frame: 21.6
  rats: 0.1 ms/frame (67.8 ms cumulative)
  social: 0.0 ms/frame (4.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (145.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.4 ms/frame
  agent updates: 3.4 ms/frame (2406.7 ms cumulative)
  forest sampling: 0.1 ms/frame (58.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.1 ms cumulative)
    targeting: 0.0 ms/frame (18.5 ms cumulative)
    decision: 0.0 ms/frame (7.2 ms cumulative)
    behaviour: 2.8 ms/frame (2006.3 ms cumulative)
    life/presentation: 0.3 ms/frame (243.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.5
    full-rate agents/frame: 8.0
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 18.5
    presentation executions/frame: 16.5

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 121.2
    village scan candidates/frame: 1622.6
    player perception checks/frame: 30.3

  nearest scans: 25.2/frame (17924 calls)
  nearest candidates checked: 448.7/frame (319502 total)
  herd leader scans: 0.4/frame (264 calls)
  herd candidates checked: 11.1/frame (7920 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.1/frame (163.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 108.2/frame, 0.10 ms/frame (worst call 1.50 ms)
    collider queries: 108.2/frame, 0.10 ms/frame (worst call 0.80 ms, 2295.2 colliders/frame)

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
Frames: 719
Shadow refresh frames: 719
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 991771
  info calls avg: 314  residual calls avg: 0
  environment                  calls=43 tris=8853
  items                        calls=1 tris=631
  other                        calls=38 tris=2294
  settlement:decor             calls=1 tris=835
  settlement:fence             calls=2 tris=9279
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=719
  settlement:fireHouseInteriorLamp calls=5 tris=539
  settlement:fireVillageTorch  calls=5 tris=357
  settlement:houseInteractive  calls=15 tris=1648
  settlement:houseStatic       calls=33 tris=80390
  settlement:landmarkGarden    calls=5 tris=82688
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=934
  settlement:landmarkWellHousehold calls=5 tris=9337
  settlement:landmarkWellPasture calls=2 tris=934
  settlement:other             calls=9 tris=350
  settlement:storageBarrel     calls=4 tris=11748
  settlement:storageContainer  calls=28 tris=2313
  settlement:storageGoods      calls=39 tris=6964
  settlement:storageHay        calls=1 tris=487
  settlement:storageTrough     calls=4 tris=1698
  settlement:storageWoodHousehold calls=1 tris=5842
  settlement:storageWoodSettlementPrimary calls=0 tris=545
  settlement:storageWoodSettlementSecondary calls=1 tris=2812
  settlement:workplace         calls=11 tris=5286
  terrain                      calls=8 tris=589004
  vegetation                   calls=22 tris=165325

Shadow (refresh only):
  calls avg: 404  tris avg: 2175961
  info calls avg: 404  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=44
  faunaFamily:cow              calls=2 tris=589
  faunaFamily:dog              calls=7 tris=2126
  faunaFamily:sheep            calls=4 tris=1113
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4847
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=2482
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8728
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
  calls avg: 1409  tris avg: 4584943
  info calls avg: 1812  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5360
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
Long frames: 31
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 31 total):

[LONG FRAME] 107.4ms
simulate        75.2ms
render          32.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.6ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           69.3ms
PHYSICS          0.1ms
RENDER          24.5ms
OTHER            1.9ms

Long frame #2:

[LONG FRAME] 106.7ms
simulate        78.6ms
render          27.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC             10.3ms
FAUNA           66.1ms
PHYSICS          0.1ms
RENDER          27.9ms
OTHER            2.2ms

Long frame #3:

[LONG FRAME] 101.1ms
simulate        74.0ms
render          26.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              5.5ms
FAUNA           66.8ms
PHYSICS          0.2ms
RENDER          26.9ms
OTHER            1.7ms

Long frame #4:

[LONG FRAME] 99.4ms
simulate        69.1ms
render          30.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC             66.7ms
FAUNA            0.8ms
PHYSICS          0.2ms
RENDER          30.0ms
OTHER            1.6ms

Long frame #5:

[LONG FRAME] 99ms
simulate        60.9ms
render          38.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.8ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           54.8ms
PHYSICS          0.1ms
RENDER          29.3ms
OTHER            1.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.3 ms  p95=23.5 ms  max=24.6 ms  Δavg vs baseline=—
  hide-grass           avg=20.9 ms  p95=23.5 ms  max=24.5 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-vegetation      avg=20.8 ms  p95=22.8 ms  max=23.5 ms  Δavg vs baseline=-0.6 ms (-3%)
  no vegetation/grass  avg=22.0 ms  p95=28.7 ms  max=30.9 ms  Δavg vs baseline=+0.7 ms (+3%)
  hide-environment     avg=19.3 ms  p95=22.9 ms  max=30.1 ms  Δavg vs baseline=-2.0 ms (-9%)
  hide-settlement      avg=18.0 ms  p95=20.1 ms  max=23.6 ms  Δavg vs baseline=-3.3 ms (-16%)
  no water             avg=21.1 ms  p95=24.2 ms  max=27.6 ms  Δavg vs baseline=-0.3 ms (-1%)
  hide-terrain         avg=21.3 ms  p95=23.8 ms  max=24.4 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-npc-fauna       avg=13.1 ms  p95=16.3 ms  max=16.8 ms  Δavg vs baseline=-8.2 ms (-39%)
  no-shadows           avg=18.3 ms  p95=22.4 ms  max=24.0 ms  Δavg vs baseline=-3.0 ms (-14%)
  no-ao                avg=21.9 ms  p95=26.0 ms  max=27.0 ms  Δavg vs baseline=+0.6 ms (+3%)
  no-bloom             avg=22.5 ms  p95=26.3 ms  max=29.3 ms  Δavg vs baseline=+1.2 ms (+5%)
  no-smaa              avg=21.7 ms  p95=23.6 ms  max=29.5 ms  Δavg vs baseline=+0.3 ms (+1%)
  no-god-rays          avg=21.9 ms  p95=24.3 ms  max=26.6 ms  Δavg vs baseline=+0.6 ms (+3%)
  no-film-grade        avg=21.4 ms  p95=24.4 ms  max=25.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  no postprocessing    avg=23.2 ms  p95=28.5 ms  max=32.6 ms  Δavg vs baseline=+1.8 ms (+9%)
  no mirrors           avg=22.2 ms  p95=26.6 ms  max=27.9 ms  Δavg vs baseline=+0.9 ms (+4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (32 samples resolved during the baseline window)
  GPU elapsed   avg=33.8 ms  p95=34.9 ms  max=35.0 ms
  CPU wall      avg=21.3 ms  p95=23.5 ms  max=24.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
