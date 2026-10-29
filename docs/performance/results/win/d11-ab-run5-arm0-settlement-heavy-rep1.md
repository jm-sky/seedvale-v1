# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T16:38:14.945Z
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
Frames: 803
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: cee85ed2fa8531600e58aa2d0c646c3cff2cb102
  runId: 2026-10-29T16-37-07-536Z-m60c9w
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
  populationGate: stable waited=6751ms npc=53
  gpuTimer: available=true resolved=true samples=809 span=postprocess+labels

FPS:
  avg: 28.2
  min: 2
  p1: 11

Frame time (wall-clock):
  avg: 35.4 ms
  p50: 34.2 ms
  p95: 41.8 ms
  p99: 89.1 ms
  max: 496.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.9 p95=9.5 p99=63.9 max=71.8 n=803
  render: p50=27 p95=32.4 p99=36.5 max=490.4 n=803
  frame: p50=34.2 p95=41.8 p99=89.1 max=496.6 n=803

Rendering (combined renderer.info):
  draw calls: 2126 avg / 2462 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 932
  textures: 856

Pass submissions (actual):
  reliability: observed
  frames: 810 shadowRefresh=810 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 403
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
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=30 tris=37.5k meshes=30 inst=30
  fauna            draws=17 tris=5.6k meshes=17 inst=17
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
      mid  agents=4 camera-relevant=3 draws=17 tris=5.6k
      far  agents=87 camera-relevant=21 draws=382 tris=146.6k

Systems:
  WATER          4.6 ms
  NPC            4.5 ms
  FAUNA          2.0 ms
  PHYSICS        0.1 ms
  RENDER         22.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=20.9 ms draws=2131 tris=7.75M
  hide-grass         render=20.9 ms draws=2099 tris=7.44M
  hide-vegetation    render=19.9 ms draws=1945 tris=6.65M
  hide-vegetation-grass render=20.2 ms draws=1917 tris=6.34M
  hide-environment   render=19.6 ms draws=1857 tris=7.70M
  hide-settlement    render=15.3 ms draws=1327 tris=6.87M
  hide-water         render=20.9 ms draws=2098 tris=6.79M
  hide-terrain       render=19.9 ms draws=2051 tris=3.69M
  hide-npc-fauna     render=13.7 ms draws=1767 tris=7.43M
  no-shadows         render=15.8 ms draws=1734 tris=5.58M
  no-ao              render=19.3 ms draws=2108 tris=7.75M
  no-bloom           render=18.5 ms draws=2100 tris=7.75M
  no-smaa            render=18.8 ms draws=2104 tris=7.75M
  no-god-rays        render=19.2 ms draws=2092 tris=7.75M
  no-film-grade      render=19.6 ms draws=2098 tris=7.75M
  no-postprocessing  render=20.2 ms draws=2079 tris=7.76M
  no-reflections     render=19.3 ms draws=1789 tris=6.76M

Frame attribution:
  frame max: 496.6 ms
  largest labelled hitch: 0 ms
  unattributed: 496.6 ms

Long frames:
  threshold: 80 ms
  count: 14
  worst: 496.6 ms

Raw sidecar:
  sampling=full factor=1 exported=803/803

Recommendation:
Largest frame (496.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.5 ms/frame
  crowd pass: 0.0 ms/frame (14.8 ms cumulative)
  agent updates: 2.8 ms/frame (2279.8 ms cumulative)
  livestock: 1.3 ms/frame (1059.7 ms cumulative)
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
      behaviour: 0.8 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.9 predator candidates/frame)
    pest scans: 6.1/frame (6.1 rat candidates/frame)
    nearest scans: 24.6/frame (0.0 candidates/frame)
    water samples: 53.4/frame, 0.00 ms/frame (worst call 1.00 ms)
    collider queries: 53.4/frame, 0.10 ms/frame (worst call 0.90 ms, 11437.0 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 56.4
    behaviour executions/frame: 24.7
    presentation executions/frame: 20.0
  rats: 0.1 ms/frame (72.0 ms cumulative)
  social: 0.0 ms/frame (4.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (157.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.0 ms/frame
  agent updates: 2.0 ms/frame (1572.2 ms cumulative)
  forest sampling: 0.1 ms/frame (73.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.5 ms cumulative)
    targeting: 0.0 ms/frame (23.2 ms cumulative)
    decision: 0.0 ms/frame (9.5 ms cumulative)
    behaviour: 1.4 ms/frame (1129.2 ms cumulative)
    life/presentation: 0.3 ms/frame (256.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 29.8
    decision passes/frame: 29.8
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 17.8
    presentation executions/frame: 15.7

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 119.2
    village scan candidates/frame: 1496.0
    player perception checks/frame: 29.8

  nearest scans: 24.1/frame (19348 calls)
  nearest candidates checked: 417.3/frame (335095 total)
  herd leader scans: 0.3/frame (201 calls)
  herd candidates checked: 7.5/frame (6030 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.6/frame (159.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 51.6/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 51.6/frame, 0.00 ms/frame (worst call 0.90 ms, 895.9 colliders/frame)

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
Frames: 810
Shadow refresh frames: 810
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993143
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2288
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
  calls avg: 403  tris avg: 2175047
  info calls avg: 403  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=2 tris=626
  faunaFamily:dog              calls=6 tris=2044
  faunaFamily:sheep            calls=4 tris=1128
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4274
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=1 tris=1454
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
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1409  tris avg: 4585167
  info calls avg: 1812  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5603
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15110
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
Long frames: 14
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 14 total):

[LONG FRAME] 496.6ms
simulate         6.0ms
render         490.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          461.4ms
STREAMING        0.0ms
NPC              4.2ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER          29.2ms
OTHER            1.0ms

Long frame #2:

[LONG FRAME] 98.8ms
simulate        63.2ms
render          35.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.1ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA           57.4ms
PHYSICS          0.1ms
RENDER          26.4ms
OTHER            1.9ms

Long frame #3:

[LONG FRAME] 98.6ms
simulate        71.8ms
render          26.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              8.3ms
FAUNA           61.6ms
PHYSICS          0.1ms
RENDER          26.3ms
OTHER            2.2ms

Long frame #4:

[LONG FRAME] 95.9ms
simulate        68.8ms
render          26.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              5.1ms
FAUNA           62.0ms
PHYSICS          0.1ms
RENDER          26.9ms
OTHER            1.8ms

Long frame #5:

[LONG FRAME] 93.2ms
simulate        65.9ms
render          27.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.9ms
FAUNA           58.8ms
PHYSICS          0.1ms
RENDER          27.0ms
OTHER            2.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=20.9 ms  p95=22.5 ms  max=23.7 ms  Δavg vs baseline=—
  hide-grass           avg=20.9 ms  p95=22.1 ms  max=23.6 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-vegetation      avg=19.9 ms  p95=20.9 ms  max=21.2 ms  Δavg vs baseline=-1.0 ms (-5%)
  no vegetation/grass  avg=20.2 ms  p95=24.9 ms  max=27.2 ms  Δavg vs baseline=-0.7 ms (-4%)
  hide-environment     avg=19.6 ms  p95=21.8 ms  max=25.5 ms  Δavg vs baseline=-1.3 ms (-6%)
  hide-settlement      avg=15.3 ms  p95=16.4 ms  max=17.6 ms  Δavg vs baseline=-5.6 ms (-27%)
  no water             avg=20.9 ms  p95=22.5 ms  max=25.7 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-terrain         avg=19.9 ms  p95=21.5 ms  max=22.1 ms  Δavg vs baseline=-1.0 ms (-5%)
  hide-npc-fauna       avg=13.7 ms  p95=16.5 ms  max=21.8 ms  Δavg vs baseline=-7.3 ms (-35%)
  no-shadows           avg=15.8 ms  p95=17.8 ms  max=18.7 ms  Δavg vs baseline=-5.1 ms (-24%)
  no-ao                avg=19.3 ms  p95=21.1 ms  max=25.0 ms  Δavg vs baseline=-1.6 ms (-8%)
  no-bloom             avg=18.5 ms  p95=22.1 ms  max=23.8 ms  Δavg vs baseline=-2.4 ms (-12%)
  no-smaa              avg=18.8 ms  p95=22.7 ms  max=26.3 ms  Δavg vs baseline=-2.1 ms (-10%)
  no-god-rays          avg=19.2 ms  p95=21.2 ms  max=22.0 ms  Δavg vs baseline=-1.7 ms (-8%)
  no-film-grade        avg=19.6 ms  p95=22.1 ms  max=22.9 ms  Δavg vs baseline=-1.4 ms (-6%)
  no postprocessing    avg=20.2 ms  p95=23.3 ms  max=24.4 ms  Δavg vs baseline=-0.8 ms (-4%)
  no mirrors           avg=19.3 ms  p95=21.0 ms  max=26.2 ms  Δavg vs baseline=-1.6 ms (-8%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=25.8 ms  p95=26.9 ms  max=34.1 ms
  CPU wall      avg=20.9 ms  p95=22.5 ms  max=23.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
