# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T23:10:18.206Z
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
Frames: 292
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: b2691195dc94b512073b5e4acd43e42984099ab2
  runId: 2026-10-29T23-08-25-914Z-esq06z
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
  populationGate: stable waited=7064ms npc=53
  gpuTimer: available=true resolved=true samples=292 span=postprocess+labels

FPS:
  avg: 26.2
  min: 3
  p1: 13

Frame time (wall-clock):
  avg: 38.2 ms
  p50: 36.7 ms
  p95: 45.1 ms
  p99: 80 ms
  max: 341.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.5 p95=11.1 p99=52.7 max=62.5 n=292
  render: p50=28.5 p95=36.3 p99=46.8 max=288.4 n=292
  frame: p50=36.7 p95=45.1 p99=80 max=341.3 n=292

Rendering (combined renderer.info):
  draw calls: 2015 avg / 2327 max
  triangles: 7.75M avg
  mirror draws: 294 avg
  geometries: 912
  textures: 825

Pass submissions (actual):
  reliability: observed
  frames: 295 shadowRefresh=295 shadowSkipped=0
  mirror calls avg: 293
  shadow calls avg: 388
  main calls avg: 1333

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1176 tris=1.36M meshes=1176 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=29.7k meshes=510 inst=512

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=703 tris=826.8k meshes=703 inst=2664
  npc              draws=20 tris=25.8k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=115 tris=14.8k meshes=115 inst=115

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

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=363 composed=363 multiplied=363 skinned=0
  settlement               nodes=2330 composed=2330 multiplied=2330 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4158 composed=4158 multiplied=4158 skinned=501
  fauna                    nodes=4345 composed=4345 multiplied=4345 skinned=364
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=781 composed=764 multiplied=781 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2330 composed=2330 multiplied=2330 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×4      nodes=307 composed=307 multiplied=307 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×16           nodes=56 composed=56 multiplied=56 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.4 ms
  NPC            4.6 ms
  FAUNA          1.9 ms
  PHYSICS        0.1 ms
  RENDER         26.1 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=25.3 ms draws=2010 tris=7.74M
  hide-grass         render=24.3 ms draws=1981 tris=7.44M
  hide-vegetation    render=20.4 ms draws=1836 tris=6.65M
  hide-vegetation-grass render=20.6 ms draws=1794 tris=6.33M
  hide-environment   render=22.3 ms draws=1789 tris=7.70M
  hide-settlement    render=16.8 ms draws=1293 tris=6.87M
  hide-water         render=27.1 ms draws=2004 tris=6.79M
  hide-terrain       render=24.2 ms draws=1965 tris=3.70M
  hide-npc-fauna     render=14.4 ms draws=1669 tris=7.43M
  no-shadows         render=16.7 ms draws=1651 tris=5.58M
  no-ao              render=29.7 ms draws=2024 tris=7.76M
  no-bloom           render=27.3 ms draws=2010 tris=7.76M
  no-smaa            render=26.1 ms draws=2000 tris=7.75M
  no-god-rays        render=26.1 ms draws=1997 tris=7.75M
  no-film-grade      render=25.1 ms draws=1996 tris=7.74M
  no-postprocessing  render=26.7 ms draws=1986 tris=7.76M
  no-reflections     render=21.3 ms draws=1709 tris=6.76M

Frame attribution:
  frame max: 341.3 ms
  largest labelled hitch: 0 ms
  unattributed: 341.3 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 341.3 ms

Raw sidecar:
  sampling=full factor=1 exported=292/292

Recommendation:
Largest frame (341.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.6 ms/frame
  crowd pass: 0.0 ms/frame (6.8 ms cumulative)
  agent updates: 2.6 ms/frame (756.0 ms cumulative)
  livestock: 1.6 ms/frame (454.7 ms cumulative)
    loaded tick: 1.6 ms/frame
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
    update calls/frame: 56.6
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (105.1 predator candidates/frame)
    pest scans: 7.4/frame (7.4 rat candidates/frame)
    nearest scans: 30.2/frame (0.0 candidates/frame)
    water samples: 62.9/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 62.9/frame, 0.10 ms/frame (worst call 0.20 ms, 13536.7 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 55.9
    behaviour executions/frame: 30.4
    presentation executions/frame: 30.3
  rats: 0.2 ms/frame (54.6 ms cumulative)
  social: 0.0 ms/frame (2.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (65.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.9 ms/frame
  agent updates: 2.0 ms/frame (585.6 ms cumulative)
  forest sampling: 0.1 ms/frame (31.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.0 ms cumulative)
    targeting: 0.0 ms/frame (12.0 ms cumulative)
    decision: 0.0 ms/frame (2.9 ms cumulative)
    behaviour: 1.2 ms/frame (360.1 ms cumulative)
    life/presentation: 0.4 ms/frame (124.2 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.4
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.8
    behaviour executions/frame: 18.4
    presentation executions/frame: 18.4

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 121.2
    village scan candidates/frame: 1616.9
    player perception checks/frame: 30.3

  nearest scans: 26.0/frame (7581 calls)
  nearest candidates checked: 464.2/frame (135534 total)
  herd leader scans: 0.2/frame (70 calls)
  herd candidates checked: 7.2/frame (2100 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.8/frame (183.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 66.8/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 66.8/frame, 0.10 ms/frame (worst call 0.30 ms, 1142.0 colliders/frame)

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
Frames: 295
Shadow refresh frames: 295
Shadow skipped frames: 0

Mirror:
  calls avg: 293  tris avg: 989926
  info calls avg: 293  residual calls avg: 0
  environment                  calls=43 tris=8835
  items                        calls=1 tris=630
  other                        calls=38 tris=2280
  settlement:decor             calls=1 tris=834
  settlement:fence             calls=2 tris=9261
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=15 tris=718
  settlement:fireHouseInteriorLamp calls=5 tris=538
  settlement:fireVillageTorch  calls=5 tris=356
  settlement:houseInteractive  calls=15 tris=1644
  settlement:houseStatic       calls=33 tris=80229
  settlement:landmarkGarden    calls=5 tris=82522
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
  terrain                      calls=8 tris=587825
  vegetation                   calls=22 tris=164994

Shadow (refresh only):
  calls avg: 388  tris avg: 2172585
  info calls avg: 388  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=1 tris=114
  faunaFamily:cow              calls=1 tris=374
  faunaFamily:dog              calls=7 tris=2233
  faunaFamily:sheep            calls=4 tris=1265
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=0 tris=198
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=2903
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8706
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
  calls avg: 1333  tris avg: 4582039
  info calls avg: 1721  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5817
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15108
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
Long frames: 3
Shown: 3 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 3 shown, 3 total):

[LONG FRAME] 341.3ms
simulate        52.6ms
render         288.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.2ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA           46.3ms
PHYSICS          0.1ms
RENDER         283.2ms
OTHER            2.0ms

Long frame #2:

[LONG FRAME] 86.6ms
simulate        62.5ms
render          23.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.1ms
STREAMING        0.0ms
NPC              4.7ms
FAUNA           55.8ms
PHYSICS          0.2ms
RENDER          18.8ms
OTHER            2.0ms

Long frame #3:

[LONG FRAME] 81.5ms
simulate        57.1ms
render          24.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.1ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           51.1ms
PHYSICS          0.1ms
RENDER          19.2ms
OTHER            2.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=25.3 ms  p95=30.0 ms  max=31.8 ms  Δavg vs baseline=—
  hide-grass           avg=24.3 ms  p95=27.9 ms  max=32.6 ms  Δavg vs baseline=-1.0 ms (-4%)
  hide-vegetation      avg=20.4 ms  p95=22.5 ms  max=22.8 ms  Δavg vs baseline=-4.9 ms (-19%)
  no vegetation/grass  avg=20.6 ms  p95=23.8 ms  max=24.1 ms  Δavg vs baseline=-4.7 ms (-18%)
  hide-environment     avg=22.3 ms  p95=25.6 ms  max=28.4 ms  Δavg vs baseline=-3.0 ms (-12%)
  hide-settlement      avg=16.8 ms  p95=18.7 ms  max=19.0 ms  Δavg vs baseline=-8.5 ms (-34%)
  no water             avg=27.1 ms  p95=34.0 ms  max=34.6 ms  Δavg vs baseline=+1.8 ms (+7%)
  hide-terrain         avg=24.2 ms  p95=31.0 ms  max=37.2 ms  Δavg vs baseline=-1.1 ms (-4%)
  hide-npc-fauna       avg=14.4 ms  p95=15.8 ms  max=19.3 ms  Δavg vs baseline=-11.0 ms (-43%)
  no-shadows           avg=16.7 ms  p95=18.6 ms  max=19.4 ms  Δavg vs baseline=-8.6 ms (-34%)
  no-ao                avg=29.7 ms  p95=37.8 ms  max=40.1 ms  Δavg vs baseline=+4.4 ms (+17%)
  no-bloom             avg=27.3 ms  p95=31.3 ms  max=31.7 ms  Δavg vs baseline=+2.0 ms (+8%)
  no-smaa              avg=26.1 ms  p95=31.8 ms  max=37.5 ms  Δavg vs baseline=+0.8 ms (+3%)
  no-god-rays          avg=26.1 ms  p95=31.6 ms  max=37.3 ms  Δavg vs baseline=+0.8 ms (+3%)
  no-film-grade        avg=25.1 ms  p95=29.1 ms  max=34.0 ms  Δavg vs baseline=-0.2 ms (-1%)
  no postprocessing    avg=26.7 ms  p95=39.2 ms  max=61.6 ms  Δavg vs baseline=+1.4 ms (+6%)
  no mirrors           avg=21.3 ms  p95=22.5 ms  max=25.7 ms  Δavg vs baseline=-4.1 ms (-16%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=33.5 ms  p95=35.3 ms  max=35.5 ms
  CPU wall      avg=25.3 ms  p95=30.0 ms  max=31.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
