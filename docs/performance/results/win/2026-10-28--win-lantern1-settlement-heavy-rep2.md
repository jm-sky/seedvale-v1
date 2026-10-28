# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T21:00:00.804Z
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
Frames: 818
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: f6f6efa2dd552d85b206b8da7df37da6e814f8a4
  runId: 2026-10-28T20-58-52-685Z-frll6g
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
  populationGate: stable waited=5865ms npc=53
  gpuTimer: available=true resolved=true samples=823 span=postprocess+labels

FPS:
  avg: 28.1
  min: 10
  p1: 13

Frame time (wall-clock):
  avg: 35.6 ms
  p50: 33 ms
  p95: 61.5 ms
  p99: 79.9 ms
  max: 98 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.8 p95=14.1 p99=55.3 max=58.5 n=818
  render: p50=26.1 p95=39.2 p99=53.2 max=78.5 n=818
  frame: p50=33 p95=61.5 p99=79.9 max=98 n=818

Rendering (combined renderer.info):
  draw calls: 2094 avg / 2423 max
  triangles: 7.74M avg
  mirror draws: 314 avg
  geometries: 938
  textures: 847

Pass submissions (actual):
  reliability: observed
  frames: 824 shadowRefresh=824 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 405
  main calls avg: 1376

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
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
      far  agents=88 camera-relevant=18 draws=389 tris=149.0k

Systems:
  WATER          4.0 ms
  NPC            4.6 ms
  FAUNA          2.5 ms
  PHYSICS        0.1 ms
  RENDER         22.8 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=20.7 ms draws=2091 tris=7.73M
  hide-grass         render=20.4 ms draws=2061 tris=7.42M
  hide-vegetation    render=19.5 ms draws=1905 tris=6.64M
  hide-vegetation-grass render=21.7 ms draws=1885 tris=6.34M
  hide-environment   render=21.3 ms draws=1814 tris=7.68M
  hide-settlement    render=18.1 ms draws=1303 tris=6.86M
  hide-water         render=21.1 ms draws=2077 tris=6.78M
  hide-terrain       render=20.7 ms draws=2028 tris=3.69M
  hide-npc-fauna     render=14.9 ms draws=1737 tris=7.42M
  no-shadows         render=16.8 ms draws=1701 tris=5.56M
  no-ao              render=23.2 ms draws=2085 tris=7.74M
  no-bloom           render=19.8 ms draws=2056 tris=7.73M
  no-smaa            render=23.0 ms draws=2078 tris=7.74M
  no-god-rays        render=21.6 ms draws=2070 tris=7.73M
  no-film-grade      render=20.1 ms draws=2070 tris=7.74M
  no-postprocessing  render=21.7 ms draws=2050 tris=7.74M
  no-reflections     render=24.7 ms draws=1755 tris=6.74M

Frame attribution:
  frame max: 98 ms
  largest labelled hitch: 0 ms
  unattributed: 98 ms

Long frames:
  threshold: 80 ms
  count: 9
  worst: 98 ms

Raw sidecar:
  sampling=full factor=1 exported=818/818

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.6 ms/frame
  crowd pass: 0.0 ms/frame (17.7 ms cumulative)
  agent updates: 2.8 ms/frame (2329.6 ms cumulative)
  livestock: 1.4 ms/frame (1153.7 ms cumulative)
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
    pest scans: 5.6/frame (5.6 rat candidates/frame)
    nearest scans: 23.5/frame (0.0 candidates/frame)
    water samples: 58.2/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 58.2/frame, 0.10 ms/frame (worst call 1.60 ms, 13079.8 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 56.1
    behaviour executions/frame: 23.7
    presentation executions/frame: 20.2
  rats: 0.1 ms/frame (97.3 ms cumulative)
  social: 0.0 ms/frame (7.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (173.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.5 ms/frame
  agent updates: 2.5 ms/frame (2066.5 ms cumulative)
  forest sampling: 0.1 ms/frame (69.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.6 ms cumulative)
    targeting: 0.0 ms/frame (24.6 ms cumulative)
    decision: 0.0 ms/frame (8.6 ms cumulative)
    behaviour: 2.0 ms/frame (1598.1 ms cumulative)
    life/presentation: 0.3 ms/frame (282.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 8.6
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 17.8
    presentation executions/frame: 16.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.9
    village scan candidates/frame: 1612.3
    player perception checks/frame: 30.2

  nearest scans: 24.7/frame (20175 calls)
  nearest candidates checked: 430.0/frame (351734 total)
  herd leader scans: 0.4/frame (291 calls)
  herd candidates checked: 10.7/frame (8730 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.9/frame (146.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 137.2/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 137.2/frame, 0.10 ms/frame (worst call 0.20 ms, 2823.3 colliders/frame)

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
Frames: 824
Shadow refresh frames: 824
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
  calls avg: 405  tris avg: 2176740
  info calls avg: 405  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=1 tris=502
  faunaFamily:dog              calls=6 tris=2073
  faunaFamily:sheep            calls=4 tris=1258
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4130
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=3292
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8693
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
  calls avg: 1376  tris avg: 4571279
  info calls avg: 1781  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=14 tris=4413
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
Long frames: 9
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 9 total):

[LONG FRAME] 98ms
simulate        19.2ms
render          78.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           15.4ms
STREAMING        0.0ms
NPC             15.3ms
FAUNA            1.2ms
PHYSICS          0.3ms
RENDER          63.2ms
OTHER            2.6ms

Long frame #2:

[LONG FRAME] 95.2ms
simulate        24.9ms
render          70.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           16.9ms
STREAMING        0.0ms
NPC             18.2ms
FAUNA            3.1ms
PHYSICS          0.3ms
RENDER          53.1ms
OTHER            3.6ms

Long frame #3:

[LONG FRAME] 88.4ms
simulate        54.1ms
render          34.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.1ms
STREAMING        0.0ms
NPC              9.8ms
FAUNA           41.7ms
PHYSICS          0.0ms
RENDER          24.9ms
OTHER            2.9ms

Long frame #4:

[LONG FRAME] 86.7ms
simulate        56.3ms
render          30.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              8.2ms
FAUNA           46.4ms
PHYSICS          0.2ms
RENDER          30.1ms
OTHER            1.7ms

Long frame #5:

[LONG FRAME] 85.4ms
simulate        55.7ms
render          29.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.6ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           48.9ms
PHYSICS          0.1ms
RENDER          23.0ms
OTHER            2.2ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=20.7 ms  p95=25.1 ms  max=25.6 ms  Δavg vs baseline=—
  hide-grass           avg=20.4 ms  p95=27.8 ms  max=28.9 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-vegetation      avg=19.5 ms  p95=23.0 ms  max=23.7 ms  Δavg vs baseline=-1.2 ms (-6%)
  no vegetation/grass  avg=21.7 ms  p95=26.9 ms  max=29.6 ms  Δavg vs baseline=+1.0 ms (+5%)
  hide-environment     avg=21.3 ms  p95=23.9 ms  max=26.8 ms  Δavg vs baseline=+0.6 ms (+3%)
  hide-settlement      avg=18.1 ms  p95=25.5 ms  max=25.8 ms  Δavg vs baseline=-2.6 ms (-13%)
  no water             avg=21.1 ms  p95=27.1 ms  max=28.6 ms  Δavg vs baseline=+0.4 ms (+2%)
  hide-terrain         avg=20.7 ms  p95=23.9 ms  max=26.6 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-npc-fauna       avg=14.9 ms  p95=20.6 ms  max=22.7 ms  Δavg vs baseline=-5.8 ms (-28%)
  no-shadows           avg=16.8 ms  p95=19.7 ms  max=21.0 ms  Δavg vs baseline=-3.9 ms (-19%)
  no-ao                avg=23.2 ms  p95=29.7 ms  max=39.1 ms  Δavg vs baseline=+2.5 ms (+12%)
  no-bloom             avg=19.8 ms  p95=23.3 ms  max=25.9 ms  Δavg vs baseline=-0.9 ms (-4%)
  no-smaa              avg=23.0 ms  p95=27.5 ms  max=55.5 ms  Δavg vs baseline=+2.3 ms (+11%)
  no-god-rays          avg=21.6 ms  p95=34.7 ms  max=35.8 ms  Δavg vs baseline=+0.9 ms (+4%)
  no-film-grade        avg=20.1 ms  p95=24.6 ms  max=26.4 ms  Δavg vs baseline=-0.6 ms (-3%)
  no postprocessing    avg=21.7 ms  p95=28.3 ms  max=28.4 ms  Δavg vs baseline=+1.0 ms (+5%)
  no mirrors           avg=24.7 ms  p95=34.1 ms  max=55.2 ms  Δavg vs baseline=+4.0 ms (+19%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=25.3 ms  p95=27.9 ms  max=28.3 ms
  CPU wall      avg=20.7 ms  p95=25.1 ms  max=25.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
