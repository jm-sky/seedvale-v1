# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T19:33:31.656Z
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
Frames: 939
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 8a2bea88cd5d6e56da741e08e2bbffd5e04c483e
  runId: 2026-10-29T19-32-25-502Z-al7zjo
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
  populationGate: stable waited=6970ms npc=53
  gpuTimer: available=true resolved=true samples=945 span=postprocess+labels

FPS:
  avg: 32.3
  min: 10
  p1: 24

Frame time (wall-clock):
  avg: 30.9 ms
  p50: 30.8 ms
  p95: 36.7 ms
  p99: 41.6 ms
  max: 99.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.6 p95=8.9 p99=12.4 max=67.6 n=939
  render: p50=24.1 p95=28.8 p99=32.3 max=39.6 n=939
  frame: p50=30.8 p95=36.7 p99=41.6 max=99.6 n=939

Rendering (combined renderer.info):
  draw calls: 2164 avg / 2501 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 929
  textures: 817

Pass submissions (actual):
  reliability: observed
  frames: 946 shadowRefresh=946 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 404
  main calls avg: 1446

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
      far  agents=88 camera-relevant=19 draws=389 tris=149.0k

Systems:
  WATER          2.8 ms
  NPC            4.4 ms
  FAUNA          1.0 ms
  PHYSICS        0.1 ms
  RENDER         21.0 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=19.9 ms draws=2160 tris=7.75M
  hide-grass         render=19.9 ms draws=2135 tris=7.44M
  hide-vegetation    render=18.7 ms draws=1980 tris=6.65M
  hide-vegetation-grass render=19.1 ms draws=1950 tris=6.34M
  hide-environment   render=19.0 ms draws=1871 tris=7.71M
  hide-settlement    render=14.8 ms draws=1352 tris=6.86M
  hide-water         render=19.8 ms draws=2149 tris=6.79M
  hide-terrain       render=18.7 ms draws=2100 tris=3.69M
  hide-npc-fauna     render=11.4 ms draws=1806 tris=7.43M
  no-shadows         render=14.2 ms draws=1771 tris=5.58M
  no-ao              render=18.8 ms draws=2133 tris=7.74M
  no-bloom           render=17.5 ms draws=2139 tris=7.75M
  no-smaa            render=16.3 ms draws=2150 tris=7.76M
  no-god-rays        render=16.8 ms draws=2149 tris=7.76M
  no-film-grade      render=16.4 ms draws=2136 tris=7.75M
  no-postprocessing  render=18.8 ms draws=2115 tris=7.76M
  no-reflections     render=17.8 ms draws=1821 tris=6.76M

Frame attribution:
  frame max: 99.6 ms
  largest labelled hitch: 0 ms
  unattributed: 99.6 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 99.6 ms

Raw sidecar:
  sampling=full factor=1 exported=939/939

Recommendation:
Largest frame (99.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.4 ms/frame
  crowd pass: 0.0 ms/frame (17.0 ms cumulative)
  agent updates: 2.8 ms/frame (2640.3 ms cumulative)
  livestock: 1.3 ms/frame (1202.2 ms cumulative)
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
    pest scans: 5.3/frame (5.3 rat candidates/frame)
    nearest scans: 21.4/frame (0.0 candidates/frame)
    water samples: 52.1/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 52.1/frame, 0.10 ms/frame (worst call 0.80 ms, 11244.7 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 21.6
    presentation executions/frame: 18.6
  rats: 0.1 ms/frame (76.2 ms cumulative)
  social: 0.0 ms/frame (6.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (179.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.0 ms/frame
  agent updates: 1.0 ms/frame (956.1 ms cumulative)
  forest sampling: 0.1 ms/frame (80.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (16.7 ms cumulative)
    targeting: 0.0 ms/frame (26.6 ms cumulative)
    decision: 0.0 ms/frame (11.1 ms cumulative)
    behaviour: 0.5 ms/frame (483.3 ms cumulative)
    life/presentation: 0.3 ms/frame (263.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.1
    full-rate agents/frame: 6.6
    reduced-cadence agents/frame: 23.6
    behaviour executions/frame: 16.1
    presentation executions/frame: 14.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.9
    village scan candidates/frame: 1611.8
    player perception checks/frame: 30.2

  nearest scans: 22.8/frame (21393 calls)
  nearest candidates checked: 416.3/frame (390946 total)
  herd leader scans: 0.2/frame (230 calls)
  herd candidates checked: 7.3/frame (6900 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.9/frame (134.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 40.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 40.5/frame, 0.00 ms/frame (worst call 0.10 ms, 762.4 colliders/frame)

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
Frames: 946
Shadow refresh frames: 946
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
  calls avg: 404  tris avg: 2170128
  info calls avg: 404  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=3 tris=1088
  faunaFamily:dog              calls=7 tris=2141
  faunaFamily:sheep            calls=4 tris=1188
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2337
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=4 tris=4238
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
  vegetation                   calls=77 tris=548494

Main:
  calls avg: 1446  tris avg: 4588741
  info calls avg: 1850  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5517
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

[LONG FRAME] 99.6ms
simulate        67.6ms
render          31.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.6ms
STREAMING        0.0ms
NPC              5.2ms
FAUNA           60.4ms
PHYSICS          0.2ms
RENDER          24.5ms
OTHER            1.7ms

Long frame #2:

[LONG FRAME] 93.7ms
simulate        65.9ms
render          27.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.3ms
STREAMING        0.0ms
NPC              3.7ms
FAUNA           60.5ms
PHYSICS          0.2ms
RENDER          22.2ms
OTHER            1.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.9 ms  p95=22.9 ms  max=24.9 ms  Δavg vs baseline=—
  hide-grass           avg=19.9 ms  p95=23.2 ms  max=28.2 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-vegetation      avg=18.7 ms  p95=20.0 ms  max=22.1 ms  Δavg vs baseline=-1.2 ms (-6%)
  no vegetation/grass  avg=19.1 ms  p95=20.7 ms  max=22.1 ms  Δavg vs baseline=-0.8 ms (-4%)
  hide-environment     avg=19.0 ms  p95=20.4 ms  max=21.2 ms  Δavg vs baseline=-0.9 ms (-5%)
  hide-settlement      avg=14.8 ms  p95=18.1 ms  max=25.2 ms  Δavg vs baseline=-5.1 ms (-26%)
  no water             avg=19.8 ms  p95=21.7 ms  max=22.5 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=18.7 ms  p95=21.5 ms  max=23.4 ms  Δavg vs baseline=-1.2 ms (-6%)
  hide-npc-fauna       avg=11.4 ms  p95=14.5 ms  max=16.8 ms  Δavg vs baseline=-8.5 ms (-43%)
  no-shadows           avg=14.2 ms  p95=16.2 ms  max=17.6 ms  Δavg vs baseline=-5.7 ms (-29%)
  no-ao                avg=18.8 ms  p95=19.0 ms  max=41.4 ms  Δavg vs baseline=-1.2 ms (-6%)
  no-bloom             avg=17.5 ms  p95=19.7 ms  max=21.8 ms  Δavg vs baseline=-2.4 ms (-12%)
  no-smaa              avg=16.3 ms  p95=17.9 ms  max=20.0 ms  Δavg vs baseline=-3.6 ms (-18%)
  no-god-rays          avg=16.8 ms  p95=18.8 ms  max=19.3 ms  Δavg vs baseline=-3.2 ms (-16%)
  no-film-grade        avg=16.4 ms  p95=17.4 ms  max=18.2 ms  Δavg vs baseline=-3.5 ms (-18%)
  no postprocessing    avg=18.8 ms  p95=22.2 ms  max=26.8 ms  Δavg vs baseline=-1.1 ms (-6%)
  no mirrors           avg=17.8 ms  p95=19.2 ms  max=19.9 ms  Δavg vs baseline=-2.1 ms (-11%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=26.1 ms  p95=27.7 ms  max=27.9 ms
  CPU wall      avg=19.9 ms  p95=22.9 ms  max=24.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
