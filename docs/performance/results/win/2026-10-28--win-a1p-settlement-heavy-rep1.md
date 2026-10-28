# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T15:32:49.802Z
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
Frames: 790
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: ccc4d3783a9d069d308a635a8e47179f6645cb17
  runId: 2026-10-28T15-31-39-298Z-8ef0p4
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
  populationGate: stable waited=5694ms npc=53
  gpuTimer: available=true resolved=true samples=790 span=postprocess+labels

FPS:
  avg: 27
  min: 2
  p1: 12

Frame time (wall-clock):
  avg: 37 ms
  p50: 35.2 ms
  p95: 50 ms
  p99: 85 ms
  max: 512.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=9.7 p95=22.7 p99=56.5 max=63.2 n=790
  render: p50=25.1 p95=30.4 p99=35.2 max=504.7 n=790
  frame: p50=35.2 p95=50 p99=85 max=512.3 n=790

Rendering (combined renderer.info):
  draw calls: 2184 avg / 2543 max
  triangles: 7.76M avg
  mirror draws: 344 avg
  geometries: 983
  textures: 846

Pass submissions (actual):
  reliability: observed
  frames: 792 shadowRefresh=792 shadowSkipped=0
  mirror calls avg: 344
  shadow calls avg: 404
  main calls avg: 1435

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1459 tris=1.37M meshes=1459 inst=3548
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=509 tris=628.5k meshes=509 inst=509
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=20 tris=25.6k meshes=20 inst=20
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
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.3k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=25.6k
      far  agents=51 camera-relevant=19 draws=489 tris=602.8k
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
  WATER          3.5 ms
  NPC            3.8 ms
  FAUNA          3.4 ms
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
  full               render=19.5 ms draws=2191 tris=7.76M
  hide-grass         render=20.3 ms draws=2154 tris=7.44M
  hide-vegetation    render=19.4 ms draws=2008 tris=6.66M
  hide-vegetation-grass render=33.3 ms draws=1958 tris=6.33M
  hide-environment   render=18.8 ms draws=1960 tris=7.71M
  hide-settlement    render=16.1 ms draws=1308 tris=6.88M
  hide-water         render=18.7 ms draws=2162 tris=6.78M
  hide-terrain       render=20.4 ms draws=2132 tris=3.70M
  hide-npc-fauna     render=13.9 ms draws=1833 tris=7.44M
  no-shadows         render=15.4 ms draws=1805 tris=5.58M
  no-ao              render=19.5 ms draws=2184 tris=7.77M
  no-bloom           render=19.2 ms draws=2166 tris=7.75M
  no-smaa            render=19.2 ms draws=2174 tris=7.76M
  no-god-rays        render=19.5 ms draws=2173 tris=7.76M
  no-film-grade      render=18.9 ms draws=2167 tris=7.75M
  no-postprocessing  render=19.5 ms draws=2145 tris=7.76M
  no-reflections     render=19.7 ms draws=1820 tris=6.76M

Frame attribution:
  frame max: 512.3 ms
  largest labelled hitch: 0 ms
  unattributed: 512.3 ms

Long frames:
  threshold: 80 ms
  count: 22
  worst: 512.3 ms

Raw sidecar:
  sampling=full factor=1 exported=790/790

Recommendation:
Largest frame (512.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.8 ms/frame
  crowd pass: 0.0 ms/frame (13.2 ms cumulative)
  agent updates: 2.3 ms/frame (1838.6 ms cumulative)
  livestock: 1.1 ms/frame (894.6 ms cumulative)
    loaded tick: 1.1 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.1 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.1
    unique animals/frame: 50.1
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.0
    dog guard scans: 13.0/frame (104.3 predator candidates/frame)
    pest scans: 6.1/frame (6.1 rat candidates/frame)
    nearest scans: 24.5/frame (0.0 candidates/frame)
    water samples: 55.7/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 55.7/frame, 0.10 ms/frame (worst call 0.90 ms, 12668.0 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 55.9
    behaviour executions/frame: 24.6
    presentation executions/frame: 19.9
  rats: 0.1 ms/frame (71.4 ms cumulative)
  social: 0.0 ms/frame (4.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (131.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.4 ms/frame
  agent updates: 3.5 ms/frame (2765.1 ms cumulative)
  forest sampling: 0.1 ms/frame (60.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (11.4 ms cumulative)
    targeting: 0.0 ms/frame (17.8 ms cumulative)
    decision: 0.0 ms/frame (8.0 ms cumulative)
    behaviour: 3.0 ms/frame (2401.8 ms cumulative)
    life/presentation: 0.3 ms/frame (220.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.1
    sensing passes/frame: 29.8
    decision passes/frame: 29.8
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.0
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 18.0
    presentation executions/frame: 15.7

  sensing/cache:
    forest samples/frame: 30.1
    fire scan candidates/frame: 119.4
    village scan candidates/frame: 1615.0
    player perception checks/frame: 29.8

  nearest scans: 23.8/frame (18786 calls)
  nearest candidates checked: 416.1/frame (328726 total)
  herd leader scans: 0.2/frame (157 calls)
  herd candidates checked: 6.0/frame (4710 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 22.7/frame (157.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 115.2/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 115.2/frame, 0.10 ms/frame (worst call 2.30 ms, 1957.1 colliders/frame)

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
Frames: 792
Shadow refresh frames: 792
Shadow skipped frames: 0

Mirror:
  calls avg: 344  tris avg: 995553
  info calls avg: 344  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2297
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3120
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
  calls avg: 404  tris avg: 2176668
  info calls avg: 404  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=21
  faunaFamily:dog              calls=7 tris=2120
  faunaFamily:donkey           calls=0 tris=139
  faunaFamily:sheep            calls=4 tris=1188
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4080
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=4 tris=3710
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
  calls avg: 1435  tris avg: 4586985
  info calls avg: 1840  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5863
  grass                        calls=33 tris=316772
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=109 tris=133838
  npcFamily:Peasant_Boots      calls=9 tris=12110
  npcFamily:Wizard             calls=35 tris=34944
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15128
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=90 tris=6240
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
Long frames: 22
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 22 total):

[LONG FRAME] 512.3ms
simulate         7.5ms
render         504.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.1ms
STREAMING        0.0ms
NPC              2.9ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER         498.7ms
OTHER            3.7ms

Long frame #2:

[LONG FRAME] 90.6ms
simulate        54.8ms
render          35.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.1ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           46.1ms
PHYSICS          0.1ms
RENDER          27.7ms
OTHER            5.0ms

Long frame #3:

[LONG FRAME] 89.8ms
simulate        57.6ms
render          31.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.0ms
STREAMING        0.0ms
NPC              6.7ms
FAUNA           45.5ms
PHYSICS          0.0ms
RENDER          24.0ms
OTHER            5.6ms

Long frame #4:

[LONG FRAME] 88.6ms
simulate        63.2ms
render          25.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.2ms
STREAMING        0.0ms
NPC              7.1ms
FAUNA           50.9ms
PHYSICS          0.0ms
RENDER          18.2ms
OTHER            5.2ms

Long frame #5:

[LONG FRAME] 88.1ms
simulate        61.3ms
render          26.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        0.0ms
NPC              6.5ms
FAUNA           49.9ms
PHYSICS          0.0ms
RENDER          19.3ms
OTHER            5.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.5 ms  p95=21.8 ms  max=23.6 ms  Δavg vs baseline=—
  hide-grass           avg=20.3 ms  p95=26.1 ms  max=28.3 ms  Δavg vs baseline=+0.8 ms (+4%)
  hide-vegetation      avg=19.4 ms  p95=22.5 ms  max=23.2 ms  Δavg vs baseline=-0.1 ms (-1%)
  no vegetation/grass  avg=33.3 ms  p95=20.1 ms  max=479.9 ms  Δavg vs baseline=+13.8 ms (+71%)
  hide-environment     avg=18.8 ms  p95=20.3 ms  max=21.8 ms  Δavg vs baseline=-0.7 ms (-4%)
  hide-settlement      avg=16.1 ms  p95=17.8 ms  max=19.0 ms  Δavg vs baseline=-3.4 ms (-17%)
  no water             avg=18.7 ms  p95=20.1 ms  max=20.7 ms  Δavg vs baseline=-0.9 ms (-4%)
  hide-terrain         avg=20.4 ms  p95=23.8 ms  max=25.2 ms  Δavg vs baseline=+0.9 ms (+4%)
  hide-npc-fauna       avg=13.9 ms  p95=15.3 ms  max=16.1 ms  Δavg vs baseline=-5.6 ms (-29%)
  no-shadows           avg=15.4 ms  p95=16.5 ms  max=16.9 ms  Δavg vs baseline=-4.2 ms (-21%)
  no-ao                avg=19.5 ms  p95=22.0 ms  max=23.4 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-bloom             avg=19.2 ms  p95=21.3 ms  max=21.7 ms  Δavg vs baseline=-0.3 ms (-2%)
  no-smaa              avg=19.2 ms  p95=20.8 ms  max=24.4 ms  Δavg vs baseline=-0.3 ms (-2%)
  no-god-rays          avg=19.5 ms  p95=21.4 ms  max=21.6 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-film-grade        avg=18.9 ms  p95=20.5 ms  max=20.6 ms  Δavg vs baseline=-0.6 ms (-3%)
  no postprocessing    avg=19.5 ms  p95=22.3 ms  max=23.2 ms  Δavg vs baseline=+0.0 ms (+0%)
  no mirrors           avg=19.7 ms  p95=21.6 ms  max=22.2 ms  Δavg vs baseline=+0.2 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=20.9 ms  p95=23.2 ms  max=24.0 ms
  CPU wall      avg=19.5 ms  p95=21.8 ms  max=23.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
