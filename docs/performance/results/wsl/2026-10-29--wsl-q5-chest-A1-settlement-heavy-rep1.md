# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T23:02:14.875Z
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
Frames: 309
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: b2691195dc94b512073b5e4acd43e42984099ab2
  runId: 2026-10-29T23-00-25-380Z-jdsmr2
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
  populationGate: stable waited=7405ms npc=53
  gpuTimer: available=true resolved=true samples=309 span=postprocess+labels

FPS:
  avg: 23.1
  min: 7
  p1: 13

Frame time (wall-clock):
  avg: 43.4 ms
  p50: 41 ms
  p95: 56.7 ms
  p99: 78.5 ms
  max: 143.1 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.8 p95=13.2 p99=54.2 max=57.6 n=309
  render: p50=32.2 p95=44.4 p99=55.6 max=134.4 n=309
  frame: p50=41 p95=56.7 p99=78.5 max=143.1 n=309

Rendering (combined renderer.info):
  draw calls: 2093 avg / 2424 max
  triangles: 7.76M avg
  mirror draws: 315 avg
  geometries: 961
  textures: 821

Pass submissions (actual):
  reliability: observed
  frames: 312 shadowRefresh=312 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 405
  main calls avg: 1373

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
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
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
      far  agents=88 camera-relevant=22 draws=389 tris=149.0k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=363 composed=363 multiplied=363 skinned=0
  settlement               nodes=2468 composed=2468 multiplied=2468 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4158 composed=4158 multiplied=4158 skinned=501
  fauna                    nodes=4345 composed=4345 multiplied=4345 skinned=364
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=783 composed=766 multiplied=783 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2468 composed=2468 multiplied=2468 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×4      nodes=307 composed=307 multiplied=307 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.7 ms
  NPC            4.8 ms
  FAUNA          2.8 ms
  PHYSICS        0.1 ms
  RENDER         29.9 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=34.8 ms draws=2092 tris=7.75M
  hide-grass         render=33.3 ms draws=2059 tris=7.44M
  hide-vegetation    render=25.3 ms draws=1898 tris=6.64M
  hide-vegetation-grass render=25.3 ms draws=1865 tris=6.33M
  hide-environment   render=27.1 ms draws=1860 tris=7.70M
  hide-settlement    render=19.1 ms draws=1281 tris=6.86M
  hide-water         render=33.0 ms draws=2076 tris=6.79M
  hide-terrain       render=30.0 ms draws=2041 tris=3.70M
  hide-npc-fauna     render=15.6 ms draws=1743 tris=7.43M
  no-shadows         render=18.7 ms draws=1710 tris=5.57M
  no-ao              render=23.6 ms draws=2080 tris=7.75M
  no-bloom           render=25.9 ms draws=2083 tris=7.76M
  no-smaa            render=32.8 ms draws=2086 tris=7.75M
  no-god-rays        render=32.8 ms draws=2082 tris=7.75M
  no-film-grade      render=31.4 ms draws=2073 tris=7.75M
  no-postprocessing  render=24.2 ms draws=2056 tris=7.76M
  no-reflections     render=24.0 ms draws=1761 tris=6.76M

Frame attribution:
  frame max: 143.1 ms
  largest labelled hitch: 0 ms
  unattributed: 143.1 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 143.1 ms

Raw sidecar:
  sampling=full factor=1 exported=309/309

Recommendation:
Largest frame (143.1 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.8 ms/frame
  crowd pass: 0.0 ms/frame (6.3 ms cumulative)
  agent updates: 2.7 ms/frame (845.7 ms cumulative)
  livestock: 1.5 ms/frame (476.7 ms cumulative)
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
      behaviour: 0.7 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (105.0 predator candidates/frame)
    pest scans: 7.4/frame (7.4 rat candidates/frame)
    nearest scans: 30.0/frame (0.0 candidates/frame)
    water samples: 58.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 58.8/frame, 0.10 ms/frame (worst call 2.30 ms, 12685.6 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 56.0
    behaviour executions/frame: 30.0
    presentation executions/frame: 30.0
  rats: 0.2 ms/frame (57.8 ms cumulative)
  social: 0.0 ms/frame (3.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (73.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.8 ms/frame
  agent updates: 2.8 ms/frame (850.9 ms cumulative)
  forest sampling: 0.1 ms/frame (32.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.9 ms cumulative)
    targeting: 0.0 ms/frame (14.4 ms cumulative)
    decision: 0.0 ms/frame (5.1 ms cumulative)
    behaviour: 1.9 ms/frame (596.0 ms cumulative)
    life/presentation: 0.5 ms/frame (146.4 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.8
    full-rate agents/frame: 7.3
    reduced-cadence agents/frame: 23.0
    behaviour executions/frame: 18.8
    presentation executions/frame: 18.8

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 121.2
    village scan candidates/frame: 1620.0
    player perception checks/frame: 30.3

  nearest scans: 26.0/frame (8023 calls)
  nearest candidates checked: 450.4/frame (139178 total)
  herd leader scans: 0.3/frame (106 calls)
  herd candidates checked: 10.3/frame (3180 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.1/frame (166.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 86.9/frame, 0.10 ms/frame (worst call 1.10 ms)
    collider queries: 86.9/frame, 0.10 ms/frame (worst call 1.00 ms, 1526.4 colliders/frame)

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
Frames: 312
Shadow refresh frames: 312
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993150
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2295
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
  calls avg: 405  tris avg: 2178216
  info calls avg: 405  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:dog              calls=7 tris=2188
  faunaFamily:sheep            calls=4 tris=1122
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2849
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=7 tris=6596
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8670
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
  calls avg: 1373  tris avg: 4581722
  info calls avg: 1778  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5785
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15123
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

[LONG FRAME] 143.1ms
simulate         8.4ms
render         134.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.9ms
STREAMING        0.1ms
NPC              5.0ms
FAUNA            1.4ms
PHYSICS          0.0ms
RENDER         127.3ms
OTHER            2.4ms

streaming / stages:
  chunkUpdate                  0.1ms

Long frame #2:

[LONG FRAME] 86.7ms
simulate        53.3ms
render          33.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.9ms
FAUNA           45.6ms
PHYSICS          0.2ms
RENDER          33.0ms
OTHER            2.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=34.8 ms  p95=47.8 ms  max=49.1 ms  Δavg vs baseline=—
  hide-grass           avg=33.3 ms  p95=44.6 ms  max=47.4 ms  Δavg vs baseline=-1.6 ms (-4%)
  hide-vegetation      avg=25.3 ms  p95=29.9 ms  max=31.3 ms  Δavg vs baseline=-9.6 ms (-28%)
  no vegetation/grass  avg=25.3 ms  p95=32.9 ms  max=36.7 ms  Δavg vs baseline=-9.5 ms (-27%)
  hide-environment     avg=27.1 ms  p95=31.1 ms  max=34.4 ms  Δavg vs baseline=-7.7 ms (-22%)
  hide-settlement      avg=19.1 ms  p95=21.5 ms  max=25.7 ms  Δavg vs baseline=-15.8 ms (-45%)
  no water             avg=33.0 ms  p95=41.8 ms  max=42.0 ms  Δavg vs baseline=-1.9 ms (-5%)
  hide-terrain         avg=30.0 ms  p95=34.7 ms  max=38.6 ms  Δavg vs baseline=-4.9 ms (-14%)
  hide-npc-fauna       avg=15.6 ms  p95=17.2 ms  max=17.8 ms  Δavg vs baseline=-19.2 ms (-55%)
  no-shadows           avg=18.7 ms  p95=20.8 ms  max=21.8 ms  Δavg vs baseline=-16.1 ms (-46%)
  no-ao                avg=23.6 ms  p95=25.4 ms  max=26.0 ms  Δavg vs baseline=-11.2 ms (-32%)
  no-bloom             avg=25.9 ms  p95=33.9 ms  max=36.6 ms  Δavg vs baseline=-8.9 ms (-26%)
  no-smaa              avg=32.8 ms  p95=39.6 ms  max=43.5 ms  Δavg vs baseline=-2.0 ms (-6%)
  no-god-rays          avg=32.8 ms  p95=37.7 ms  max=38.3 ms  Δavg vs baseline=-2.0 ms (-6%)
  no-film-grade        avg=31.4 ms  p95=38.6 ms  max=45.9 ms  Δavg vs baseline=-3.4 ms (-10%)
  no postprocessing    avg=24.2 ms  p95=26.7 ms  max=29.1 ms  Δavg vs baseline=-10.7 ms (-31%)
  no mirrors           avg=24.0 ms  p95=25.9 ms  max=26.5 ms  Δavg vs baseline=-10.8 ms (-31%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=58.0 ms  p95=66.0 ms  max=69.7 ms
  CPU wall      avg=34.8 ms  p95=47.8 ms  max=49.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
