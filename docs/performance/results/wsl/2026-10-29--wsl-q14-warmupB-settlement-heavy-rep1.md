# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T18:47:20.948Z
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
Frames: 300
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 591231d7e90a73b5c8c869eb81ed60d1f5478c1c
  runId: 2026-10-29T18-45-30-841Z-hnq2sy
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
  populationGate: stable waited=5689ms npc=53
  gpuTimer: available=true resolved=true samples=299 span=postprocess+labels

FPS:
  avg: 21.5
  min: 1
  p1: 12

Frame time (wall-clock):
  avg: 46.6 ms
  p50: 40.4 ms
  p95: 55.8 ms
  p99: 82.1 ms
  max: 1259.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.2 p95=10.8 p99=21.4 max=58.4 n=300
  render: p50=32.5 p95=44.8 p99=59 max=1250.7 n=300
  frame: p50=40.4 p95=55.8 p99=82.1 max=1259.8 n=300

Rendering (combined renderer.info):
  draw calls: 2161 avg / 2494 max
  triangles: 7.76M avg
  mirror draws: 314 avg
  geometries: 961
  textures: 826

Pass submissions (actual):
  reliability: observed
  frames: 302 shadowRefresh=302 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 403
  main calls avg: 1444

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
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
      far  agents=88 camera-relevant=20 draws=389 tris=149.0k

Systems:
  WATER          3.3 ms
  NPC            4.6 ms
  FAUNA          1.7 ms
  PHYSICS        0.1 ms
  RENDER         34.8 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=32.0 ms draws=2157 tris=7.75M
  hide-grass         render=31.0 ms draws=2121 tris=7.43M
  hide-vegetation    render=24.8 ms draws=1973 tris=6.65M
  hide-vegetation-grass render=25.0 ms draws=1945 tris=6.34M
  hide-environment   render=26.4 ms draws=1862 tris=7.70M
  hide-settlement    render=17.3 ms draws=1353 tris=6.86M
  hide-water         render=34.1 ms draws=2153 tris=6.80M
  hide-terrain       render=33.0 ms draws=2115 tris=3.71M
  hide-npc-fauna     render=15.0 ms draws=1817 tris=7.44M
  no-shadows         render=17.6 ms draws=1782 tris=5.58M
  no-ao              render=34.1 ms draws=2159 tris=7.76M
  no-bloom           render=36.1 ms draws=2161 tris=7.77M
  no-smaa            render=35.3 ms draws=2169 tris=7.76M
  no-god-rays        render=34.7 ms draws=2160 tris=7.76M
  no-film-grade      render=34.5 ms draws=2154 tris=7.76M
  no-postprocessing  render=33.8 ms draws=2135 tris=7.76M
  no-reflections     render=22.8 ms draws=1836 tris=6.76M

Frame attribution:
  frame max: 1259.8 ms
  largest labelled hitch: 0 ms
  unattributed: 1259.8 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 1259.8 ms

Raw sidecar:
  sampling=full factor=1 exported=300/300

Recommendation:
Largest frame (1259.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.6 ms/frame
  crowd pass: 0.0 ms/frame (4.9 ms cumulative)
  agent updates: 2.6 ms/frame (766.3 ms cumulative)
  livestock: 1.5 ms/frame (446.2 ms cumulative)
    loaded tick: 1.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.3
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 7.3/frame (7.3 rat candidates/frame)
    nearest scans: 30.0/frame (0.0 candidates/frame)
    water samples: 60.8/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 60.8/frame, 0.10 ms/frame (worst call 0.30 ms, 13090.1 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 55.8
    behaviour executions/frame: 30.1
    presentation executions/frame: 30.0
  rats: 0.2 ms/frame (67.5 ms cumulative)
  social: 0.0 ms/frame (2.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (67.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.7 ms/frame
  agent updates: 1.7 ms/frame (495.2 ms cumulative)
  forest sampling: 0.1 ms/frame (30.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.7 ms cumulative)
    targeting: 0.0 ms/frame (10.0 ms cumulative)
    decision: 0.0 ms/frame (4.1 ms cumulative)
    behaviour: 0.9 ms/frame (266.9 ms cumulative)
    life/presentation: 0.4 ms/frame (134.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.1
    full-rate agents/frame: 6.0
    reduced-cadence agents/frame: 24.2
    behaviour executions/frame: 18.1
    presentation executions/frame: 18.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.8
    village scan candidates/frame: 1606.3
    player perception checks/frame: 30.2

  nearest scans: 26.2/frame (7850 calls)
  nearest candidates checked: 462.0/frame (138591 total)
  herd leader scans: 0.3/frame (95 calls)
  herd candidates checked: 9.5/frame (2850 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.8/frame (157.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 58.9/frame, 0.10 ms/frame (worst call 1.60 ms)
    collider queries: 58.9/frame, 0.00 ms/frame (worst call 0.10 ms, 992.0 colliders/frame)

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
Frames: 302
Shadow refresh frames: 302
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993148
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2292
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
  calls avg: 403  tris avg: 2177097
  info calls avg: 403  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=1 tris=373
  faunaFamily:dog              calls=6 tris=1950
  faunaFamily:rat              calls=1 tris=1896
  faunaFamily:sheep            calls=4 tris=1224
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3137
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=3112
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=29 tris=8614
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
  calls avg: 1444  tris avg: 4588528
  info calls avg: 1847  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5319
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=140 tris=15113
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
Long frames: 4
Shown: 4 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 4 shown, 4 total):

[LONG FRAME] 1259.8ms
simulate         8.8ms
render        1250.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.0ms
FAUNA            1.7ms
PHYSICS          0.2ms
RENDER        1250.6ms
OTHER            2.2ms

Long frame #2:

[LONG FRAME] 95.9ms
simulate        11.4ms
render          84.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              5.3ms
FAUNA            1.7ms
PHYSICS          0.2ms
RENDER          84.2ms
OTHER            4.5ms

Long frame #3:

[LONG FRAME] 82.5ms
simulate         9.6ms
render          72.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              5.8ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER          72.3ms
OTHER            2.4ms

Long frame #4:

[LONG FRAME] 82.1ms
simulate        58.4ms
render          23.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.1ms
NPC              3.6ms
FAUNA           52.6ms
PHYSICS          0.1ms
RENDER          23.2ms
OTHER            2.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=32.0 ms  p95=39.7 ms  max=45.0 ms  Δavg vs baseline=—
  hide-grass           avg=31.0 ms  p95=42.3 ms  max=43.7 ms  Δavg vs baseline=-1.0 ms (-3%)
  hide-vegetation      avg=24.8 ms  p95=26.9 ms  max=29.0 ms  Δavg vs baseline=-7.2 ms (-23%)
  no vegetation/grass  avg=25.0 ms  p95=29.7 ms  max=35.1 ms  Δavg vs baseline=-7.0 ms (-22%)
  hide-environment     avg=26.4 ms  p95=29.8 ms  max=36.5 ms  Δavg vs baseline=-5.6 ms (-18%)
  hide-settlement      avg=17.3 ms  p95=18.6 ms  max=18.9 ms  Δavg vs baseline=-14.7 ms (-46%)
  no water             avg=34.1 ms  p95=41.3 ms  max=45.7 ms  Δavg vs baseline=+2.1 ms (+6%)
  hide-terrain         avg=33.0 ms  p95=38.3 ms  max=44.8 ms  Δavg vs baseline=+1.0 ms (+3%)
  hide-npc-fauna       avg=15.0 ms  p95=17.8 ms  max=18.9 ms  Δavg vs baseline=-16.9 ms (-53%)
  no-shadows           avg=17.6 ms  p95=19.8 ms  max=20.6 ms  Δavg vs baseline=-14.4 ms (-45%)
  no-ao                avg=34.1 ms  p95=49.5 ms  max=73.8 ms  Δavg vs baseline=+2.2 ms (+7%)
  no-bloom             avg=36.1 ms  p95=42.5 ms  max=52.7 ms  Δavg vs baseline=+4.1 ms (+13%)
  no-smaa              avg=35.3 ms  p95=42.3 ms  max=45.2 ms  Δavg vs baseline=+3.4 ms (+11%)
  no-god-rays          avg=34.7 ms  p95=40.8 ms  max=42.5 ms  Δavg vs baseline=+2.7 ms (+8%)
  no-film-grade        avg=34.5 ms  p95=46.3 ms  max=51.6 ms  Δavg vs baseline=+2.5 ms (+8%)
  no postprocessing    avg=33.8 ms  p95=57.4 ms  max=71.7 ms  Δavg vs baseline=+1.8 ms (+6%)
  no mirrors           avg=22.8 ms  p95=26.9 ms  max=29.2 ms  Δavg vs baseline=-9.2 ms (-29%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=36.3 ms  p95=38.0 ms  max=49.3 ms
  CPU wall      avg=32.0 ms  p95=39.7 ms  max=45.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
