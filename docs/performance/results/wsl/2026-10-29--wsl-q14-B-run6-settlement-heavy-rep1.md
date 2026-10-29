# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T19:11:58.059Z
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
Frames: 245
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 591231d7e90a73b5c8c869eb81ed60d1f5478c1c
  runId: 2026-10-29T19-10-04-050Z-aeq2kh
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
  populationGate: stable waited=6307ms npc=53
  gpuTimer: available=true resolved=true samples=244 span=postprocess+labels

FPS:
  avg: 21.4
  min: 1
  p1: 11

Frame time (wall-clock):
  avg: 46.8 ms
  p50: 38.8 ms
  p95: 53.5 ms
  p99: 88.7 ms
  max: 1272.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.6 p95=11.9 p99=13.4 max=41.6 n=245
  render: p50=30.2 p95=45.5 p99=79 max=1261.9 n=245
  frame: p50=38.8 p95=53.5 p99=88.7 max=1272.3 n=245

Rendering (combined renderer.info):
  draw calls: 2168 avg / 2504 max
  triangles: 7.76M avg
  mirror draws: 315 avg
  geometries: 961
  textures: 827

Pass submissions (actual):
  reliability: observed
  frames: 247 shadowRefresh=247 shadowSkipped=0
  mirror calls avg: 315
  shadow calls avg: 409
  main calls avg: 1445

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
  other            draws=510 tris=29.7k meshes=510 inst=510

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=42 tris=49.4k meshes=42 inst=42
  fauna            draws=17 tris=5.6k meshes=17 inst=17
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
      mid  agents=4 camera-relevant=2 draws=42 tris=49.4k
      far  agents=49 camera-relevant=19 draws=459 tris=580.1k
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
      far  agents=87 camera-relevant=20 draws=382 tris=146.6k

Systems:
  WATER          3.5 ms
  NPC            4.7 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         35.0 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=30.8 ms draws=2168 tris=7.76M
  hide-grass         render=31.8 ms draws=2126 tris=7.44M
  hide-vegetation    render=24.0 ms draws=1969 tris=6.65M
  hide-vegetation-grass render=26.8 ms draws=1958 tris=6.35M
  hide-environment   render=27.4 ms draws=1880 tris=7.71M
  hide-settlement    render=17.6 ms draws=1375 tris=6.88M
  hide-water         render=34.3 ms draws=2164 tris=6.81M
  hide-terrain       render=32.9 ms draws=2118 tris=3.71M
  hide-npc-fauna     render=14.7 ms draws=1817 tris=7.44M
  no-shadows         render=17.0 ms draws=1779 tris=5.58M
  no-ao              render=24.8 ms draws=2162 tris=7.76M
  no-bloom           render=33.1 ms draws=2144 tris=7.75M
  no-smaa            render=34.8 ms draws=2152 tris=7.75M
  no-god-rays        render=33.8 ms draws=2165 tris=7.76M
  no-film-grade      render=34.9 ms draws=2146 tris=7.75M
  no-postprocessing  render=28.0 ms draws=2132 tris=7.76M
  no-reflections     render=23.0 ms draws=1850 tris=6.77M

Frame attribution:
  frame max: 1272.3 ms
  largest labelled hitch: 0 ms
  unattributed: 1272.3 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 1272.3 ms

Raw sidecar:
  sampling=full factor=1 exported=245/245

Recommendation:
Largest frame (1272.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (7.2 ms cumulative)
  agent updates: 2.6 ms/frame (629.5 ms cumulative)
  livestock: 1.6 ms/frame (394.3 ms cumulative)
    loaded tick: 1.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 7.4/frame (7.4 rat candidates/frame)
    nearest scans: 30.5/frame (0.0 candidates/frame)
    water samples: 67.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 67.8/frame, 0.10 ms/frame (worst call 0.20 ms, 15403.0 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 55.9
    behaviour executions/frame: 30.6
    presentation executions/frame: 30.6
  rats: 0.2 ms/frame (50.2 ms cumulative)
  social: 0.0 ms/frame (1.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (54.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.3 ms/frame (328.8 ms cumulative)
  forest sampling: 0.1 ms/frame (23.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.6 ms cumulative)
    targeting: 0.0 ms/frame (11.3 ms cumulative)
    decision: 0.0 ms/frame (3.8 ms cumulative)
    behaviour: 0.7 ms/frame (159.8 ms cumulative)
    life/presentation: 0.4 ms/frame (97.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.3
    full-rate agents/frame: 8.4
    reduced-cadence agents/frame: 21.8
    behaviour executions/frame: 19.3
    presentation executions/frame: 19.3

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 121.0
    village scan candidates/frame: 1619.6
    player perception checks/frame: 30.2

  nearest scans: 26.2/frame (6426 calls)
  nearest candidates checked: 447.3/frame (109586 total)
  herd leader scans: 0.3/frame (80 calls)
  herd candidates checked: 9.8/frame (2400 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.9/frame (166.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 74.4/frame, 0.10 ms/frame (worst call 0.20 ms)
    collider queries: 74.4/frame, 0.10 ms/frame (worst call 0.10 ms, 1369.9 colliders/frame)

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
Frames: 247
Shadow refresh frames: 247
Shadow skipped frames: 0

Mirror:
  calls avg: 315  tris avg: 997158
  info calls avg: 315  residual calls avg: 0
  environment                  calls=44 tris=8901
  items                        calls=1 tris=635
  other                        calls=38 tris=2291
  settlement:decor             calls=1 tris=840
  settlement:fence             calls=2 tris=9330
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=723
  settlement:fireHouseInteriorLamp calls=5 tris=542
  settlement:fireVillageTorch  calls=5 tris=359
  settlement:houseInteractive  calls=15 tris=1657
  settlement:houseStatic       calls=33 tris=80828
  settlement:landmarkGarden    calls=5 tris=83138
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=939
  settlement:landmarkWellHousehold calls=5 tris=9388
  settlement:landmarkWellPasture calls=3 tris=939
  settlement:other             calls=10 tris=351
  settlement:storageBarrel     calls=5 tris=11812
  settlement:storageContainer  calls=28 tris=2325
  settlement:storageGoods      calls=40 tris=7002
  settlement:storageHay        calls=1 tris=490
  settlement:storageTrough     calls=4 tris=1707
  settlement:storageWoodHousehold calls=1 tris=5874
  settlement:storageWoodSettlementPrimary calls=1 tris=548
  settlement:storageWoodSettlementSecondary calls=1 tris=2827
  settlement:workplace         calls=11 tris=5314
  terrain                      calls=8 tris=592212
  vegetation                   calls=23 tris=166226

Shadow (refresh only):
  calls avg: 409  tris avg: 2177352
  info calls avg: 409  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=7 tris=2336
  faunaFamily:sheep            calls=4 tris=1257
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3125
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=2793
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=29 tris=8600
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
  calls avg: 1445  tris avg: 4588680
  info calls avg: 1854  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5489
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=140 tris=15095
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

[LONG FRAME] 1272.3ms
simulate        10.1ms
render        1261.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.5ms
STREAMING        0.0ms
NPC              5.6ms
FAUNA            1.4ms
PHYSICS          0.2ms
RENDER        1256.3ms
OTHER            3.3ms

Long frame #2:

[LONG FRAME] 104.4ms
simulate        12.5ms
render          91.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.7ms
STREAMING        0.1ms
NPC              6.9ms
FAUNA            2.5ms
PHYSICS          0.2ms
RENDER          84.2ms
OTHER            2.8ms

Long frame #3:

[LONG FRAME] 94.6ms
simulate         8.6ms
render          85.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.8ms
STREAMING        0.0ms
NPC              5.8ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER          80.0ms
OTHER            1.9ms

Long frame #4:

[LONG FRAME] 81.1ms
simulate        10.4ms
render          70.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              6.5ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER          70.3ms
OTHER            2.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=30.8 ms  p95=36.5 ms  max=36.9 ms  Δavg vs baseline=—
  hide-grass           avg=31.8 ms  p95=38.3 ms  max=49.6 ms  Δavg vs baseline=+1.0 ms (+3%)
  hide-vegetation      avg=24.0 ms  p95=28.8 ms  max=30.7 ms  Δavg vs baseline=-6.7 ms (-22%)
  no vegetation/grass  avg=26.8 ms  p95=30.8 ms  max=35.1 ms  Δavg vs baseline=-4.0 ms (-13%)
  hide-environment     avg=27.4 ms  p95=31.6 ms  max=33.6 ms  Δavg vs baseline=-3.4 ms (-11%)
  hide-settlement      avg=17.6 ms  p95=19.2 ms  max=31.2 ms  Δavg vs baseline=-13.2 ms (-43%)
  no water             avg=34.3 ms  p95=43.4 ms  max=51.1 ms  Δavg vs baseline=+3.5 ms (+11%)
  hide-terrain         avg=32.9 ms  p95=42.2 ms  max=42.5 ms  Δavg vs baseline=+2.1 ms (+7%)
  hide-npc-fauna       avg=14.7 ms  p95=16.2 ms  max=17.1 ms  Δavg vs baseline=-16.1 ms (-52%)
  no-shadows           avg=17.0 ms  p95=19.0 ms  max=19.7 ms  Δavg vs baseline=-13.7 ms (-45%)
  no-ao                avg=24.8 ms  p95=35.6 ms  max=36.9 ms  Δavg vs baseline=-6.0 ms (-19%)
  no-bloom             avg=33.1 ms  p95=39.6 ms  max=42.6 ms  Δavg vs baseline=+2.4 ms (+8%)
  no-smaa              avg=34.8 ms  p95=47.8 ms  max=51.0 ms  Δavg vs baseline=+4.0 ms (+13%)
  no-god-rays          avg=33.8 ms  p95=39.7 ms  max=48.5 ms  Δavg vs baseline=+3.1 ms (+10%)
  no-film-grade        avg=34.9 ms  p95=45.7 ms  max=82.3 ms  Δavg vs baseline=+4.1 ms (+13%)
  no postprocessing    avg=28.0 ms  p95=40.8 ms  max=64.8 ms  Δavg vs baseline=-2.8 ms (-9%)
  no mirrors           avg=23.0 ms  p95=29.2 ms  max=32.8 ms  Δavg vs baseline=-7.8 ms (-25%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=43.9 ms  p95=69.5 ms  max=69.9 ms
  CPU wall      avg=30.8 ms  p95=36.5 ms  max=36.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
