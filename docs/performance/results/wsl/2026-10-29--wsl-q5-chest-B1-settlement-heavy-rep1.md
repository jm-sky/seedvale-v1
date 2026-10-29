# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T23:06:17.491Z
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
Frames: 291
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: b2691195dc94b512073b5e4acd43e42984099ab2
  runId: 2026-10-29T23-04-25-499Z-hwhz33
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
  viewport: 1600x813
  drawingBuffer: 1600x813
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=7743ms npc=53
  gpuTimer: available=true resolved=true samples=290 span=postprocess+labels

FPS:
  avg: 25.5
  min: 7
  p1: 18

Frame time (wall-clock):
  avg: 39.2 ms
  p50: 38.6 ms
  p95: 48.3 ms
  p99: 57 ms
  max: 141.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.1 p95=9.1 p99=12.7 max=34.4 n=291
  render: p50=30.2 p95=40.1 p99=48.8 max=133.9 n=291
  frame: p50=38.6 p95=48.3 p99=57 max=141.3 n=291

Rendering (combined renderer.info):
  draw calls: 2049 avg / 2360 max
  triangles: 7.75M avg
  mirror draws: 293 avg
  geometries: 912
  textures: 831

Pass submissions (actual):
  reliability: observed
  frames: 293 shadowRefresh=293 shadowSkipped=0
  mirror calls avg: 293
  shadow calls avg: 388
  main calls avg: 1368

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1176 tris=1.36M meshes=1176 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=703 tris=826.8k meshes=703 inst=2664
  npc              draws=32 tris=37.7k meshes=32 inst=32
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
  storageContainer draws=30 tris=9.0k meshes=30 inst=122
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
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=88 camera-relevant=19 draws=389 tris=149.0k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=439 composed=439 multiplied=439 skinned=0
  settlement               nodes=2330 composed=2330 multiplied=2330 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4158 composed=4158 multiplied=4158 skinned=501
  fauna                    nodes=4345 composed=4345 multiplied=4345 skinned=364
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=783 composed=766 multiplied=783 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2330 composed=2330 multiplied=2330 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×5      nodes=383 composed=383 multiplied=383 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.5 ms
  NPC            4.4 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         27.8 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=27.5 ms draws=2052 tris=7.75M
  hide-grass         render=27.3 ms draws=2018 tris=7.43M
  hide-vegetation    render=22.0 ms draws=1869 tris=6.65M
  hide-vegetation-grass render=21.6 ms draws=1838 tris=6.34M
  hide-environment   render=21.6 ms draws=1781 tris=7.69M
  hide-settlement    render=17.5 ms draws=1329 tris=6.87M
  hide-water         render=28.3 ms draws=2035 tris=6.78M
  hide-terrain       render=25.4 ms draws=1991 tris=3.69M
  hide-npc-fauna     render=14.6 ms draws=1706 tris=7.43M
  no-shadows         render=17.2 ms draws=1685 tris=5.58M
  no-ao              render=31.4 ms draws=2050 tris=7.76M
  no-bloom           render=29.2 ms draws=2037 tris=7.75M
  no-smaa            render=31.4 ms draws=2047 tris=7.75M
  no-god-rays        render=30.9 ms draws=2051 tris=7.75M
  no-film-grade      render=30.9 ms draws=2057 tris=7.76M
  no-postprocessing  render=28.9 ms draws=2020 tris=7.75M
  no-reflections     render=22.1 ms draws=1754 tris=6.76M

Frame attribution:
  frame max: 141.3 ms
  largest labelled hitch: 0 ms
  unattributed: 141.3 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 141.3 ms

Raw sidecar:
  sampling=full factor=1 exported=291/291

Recommendation:
Largest frame (141.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.4 ms/frame
  crowd pass: 0.0 ms/frame (5.9 ms cumulative)
  agent updates: 2.5 ms/frame (731.0 ms cumulative)
  livestock: 1.4 ms/frame (413.9 ms cumulative)
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
    update calls/frame: 56.4
    unique animals/frame: 50.3
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 7.3/frame (7.3 rat candidates/frame)
    nearest scans: 29.9/frame (0.0 candidates/frame)
    water samples: 67.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 67.6/frame, 0.10 ms/frame (worst call 0.10 ms, 14534.3 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 55.9
    behaviour executions/frame: 29.9
    presentation executions/frame: 29.8
  rats: 0.1 ms/frame (36.8 ms cumulative)
  social: 0.0 ms/frame (1.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (67.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (368.5 ms cumulative)
  forest sampling: 0.1 ms/frame (26.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.4 ms cumulative)
    targeting: 0.0 ms/frame (7.9 ms cumulative)
    decision: 0.0 ms/frame (4.2 ms cumulative)
    behaviour: 0.6 ms/frame (163.3 ms cumulative)
    life/presentation: 0.4 ms/frame (120.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.9
    full-rate agents/frame: 7.5
    reduced-cadence agents/frame: 22.7
    behaviour executions/frame: 18.9
    presentation executions/frame: 18.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.8
    village scan candidates/frame: 1611.0
    player perception checks/frame: 30.2

  nearest scans: 26.4/frame (7676 calls)
  nearest candidates checked: 455.7/frame (132600 total)
  herd leader scans: 0.3/frame (89 calls)
  herd candidates checked: 9.2/frame (2670 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.7/frame (168.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 58.5/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 58.5/frame, 0.00 ms/frame (worst call 0.20 ms, 955.2 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 22
Resident instances: full=88277 filler=113472
Submitted instances: full=75310 filler=42552
Meshes submitted: 74
LOD submitted fraction: full=0.8531100966276607 filler=0.375
Flowers: unavailable
Allocation bytes (estimated): 19367904
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 293
Shadow refresh frames: 293
Shadow skipped frames: 0

Mirror:
  calls avg: 293  tris avg: 989907
  info calls avg: 293  residual calls avg: 0
  environment                  calls=43 tris=8835
  items                        calls=1 tris=630
  other                        calls=38 tris=2284
  settlement:decor             calls=1 tris=834
  settlement:fence             calls=2 tris=9260
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=15 tris=718
  settlement:fireHouseInteriorLamp calls=5 tris=538
  settlement:fireVillageTorch  calls=5 tris=356
  settlement:houseInteractive  calls=15 tris=1644
  settlement:houseStatic       calls=33 tris=80227
  settlement:landmarkGarden    calls=5 tris=82520
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=932
  settlement:landmarkWellHousehold calls=5 tris=9318
  settlement:landmarkWellPasture calls=2 tris=932
  settlement:other             calls=9 tris=349
  settlement:storageBarrel     calls=4 tris=11724
  settlement:storageContainer  calls=8 tris=2458
  settlement:storageGoods      calls=39 tris=6950
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1694
  settlement:storageWoodHousehold calls=1 tris=5830
  settlement:storageWoodSettlementPrimary calls=0 tris=544
  settlement:storageWoodSettlementSecondary calls=1 tris=2806
  settlement:workplace         calls=11 tris=5275
  terrain                      calls=8 tris=587811
  vegetation                   calls=22 tris=164990

Shadow (refresh only):
  calls avg: 388  tris avg: 2174527
  info calls avg: 388  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:dog              calls=7 tris=2160
  faunaFamily:sheep            calls=4 tris=1137
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=1 tris=1237
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=5 tris=4507
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8695
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
  settlement:storageContainer  calls=6 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1368  tris avg: 4585182
  info calls avg: 1756  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5310
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15117
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
  settlement:storageContainer  calls=18 tris=5184
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 141.3ms
simulate         7.1ms
render         133.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER         133.8ms
OTHER            2.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=27.5 ms  p95=31.4 ms  max=32.8 ms  Δavg vs baseline=—
  hide-grass           avg=27.3 ms  p95=30.8 ms  max=37.6 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-vegetation      avg=22.0 ms  p95=28.4 ms  max=29.9 ms  Δavg vs baseline=-5.5 ms (-20%)
  no vegetation/grass  avg=21.6 ms  p95=24.4 ms  max=28.8 ms  Δavg vs baseline=-5.8 ms (-21%)
  hide-environment     avg=21.6 ms  p95=25.6 ms  max=28.0 ms  Δavg vs baseline=-5.9 ms (-21%)
  hide-settlement      avg=17.5 ms  p95=18.4 ms  max=23.0 ms  Δavg vs baseline=-10.0 ms (-36%)
  no water             avg=28.3 ms  p95=34.1 ms  max=39.2 ms  Δavg vs baseline=+0.8 ms (+3%)
  hide-terrain         avg=25.4 ms  p95=32.4 ms  max=33.8 ms  Δavg vs baseline=-2.1 ms (-8%)
  hide-npc-fauna       avg=14.6 ms  p95=15.8 ms  max=16.3 ms  Δavg vs baseline=-12.8 ms (-47%)
  no-shadows           avg=17.2 ms  p95=18.3 ms  max=18.8 ms  Δavg vs baseline=-10.3 ms (-37%)
  no-ao                avg=31.4 ms  p95=41.7 ms  max=43.1 ms  Δavg vs baseline=+3.9 ms (+14%)
  no-bloom             avg=29.2 ms  p95=32.5 ms  max=35.2 ms  Δavg vs baseline=+1.8 ms (+7%)
  no-smaa              avg=31.4 ms  p95=38.2 ms  max=39.8 ms  Δavg vs baseline=+3.9 ms (+14%)
  no-god-rays          avg=30.9 ms  p95=34.6 ms  max=39.6 ms  Δavg vs baseline=+3.4 ms (+12%)
  no-film-grade        avg=30.9 ms  p95=36.4 ms  max=38.1 ms  Δavg vs baseline=+3.4 ms (+12%)
  no postprocessing    avg=28.9 ms  p95=49.2 ms  max=64.8 ms  Δavg vs baseline=+1.4 ms (+5%)
  no mirrors           avg=22.1 ms  p95=23.7 ms  max=25.9 ms  Δavg vs baseline=-5.4 ms (-20%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=61.3 ms  p95=64.5 ms  max=65.8 ms
  CPU wall      avg=27.5 ms  p95=31.4 ms  max=32.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
