# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T06:58:19.720Z
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
Frames: 1027
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d2b14bf7cbf380131bfa43bc2bd685af918f30e5
  runId: 2026-10-30T06-57-15-903Z-8l0n55
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
  populationGate: stable waited=5653ms npc=53
  gpuTimer: available=true resolved=true samples=1033 span=postprocess+labels

FPS:
  avg: 35.3
  min: 9
  p1: 14

Frame time (wall-clock):
  avg: 28.3 ms
  p50: 28 ms
  p95: 32.4 ms
  p99: 70.3 ms
  max: 114.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.5 p95=7.8 p99=48.7 max=92.7 n=1027
  render: p50=22.3 p95=25.5 p99=28.3 max=44 n=1027
  frame: p50=28 p95=32.4 p99=70.3 max=114.7 n=1027

Rendering (combined renderer.info):
  draw calls: 2166 avg / 2501 max
  triangles: 7.76M avg
  mirror draws: 314 avg
  geometries: 964
  textures: 857

Pass submissions (actual):
  reliability: observed
  frames: 1034 shadowRefresh=1034 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 406
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
  fauna            draws=16 tris=5.1k meshes=16 inst=16
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
      mid  agents=4 camera-relevant=4 draws=16 tris=5.1k
      far  agents=87 camera-relevant=19 draws=383 tris=147.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=515 composed=515 multiplied=515 skinned=0
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
    chunk-environmen ×6      nodes=459 composed=459 multiplied=459 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          2.5 ms
  NPC            3.7 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         19.2 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=18.7 ms draws=2163 tris=7.75M
  hide-grass         render=18.1 ms draws=2125 tris=7.44M
  hide-vegetation    render=17.8 ms draws=1985 tris=6.66M
  hide-vegetation-grass render=17.8 ms draws=1938 tris=6.33M
  hide-environment   render=17.7 ms draws=1867 tris=7.70M
  hide-settlement    render=15.0 ms draws=1362 tris=6.87M
  hide-water         render=18.4 ms draws=2145 tris=6.79M
  hide-terrain       render=17.8 ms draws=2108 tris=3.70M
  hide-npc-fauna     render=11.5 ms draws=1817 tris=7.44M
  no-shadows         render=15.3 ms draws=1784 tris=5.58M
  no-ao              render=18.3 ms draws=2171 tris=7.77M
  no-bloom           render=18.8 ms draws=2165 tris=7.78M
  no-smaa            render=18.9 ms draws=2157 tris=7.76M
  no-god-rays        render=18.7 ms draws=2154 tris=7.76M
  no-film-grade      render=18.6 ms draws=2154 tris=7.76M
  no-postprocessing  render=18.4 ms draws=2137 tris=7.77M
  no-reflections     render=18.7 ms draws=1851 tris=6.78M

Frame attribution:
  frame max: 114.7 ms
  largest labelled hitch: 0 ms
  unattributed: 114.7 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 114.7 ms

Raw sidecar:
  sampling=full factor=1 exported=1027/1027

Recommendation:
Largest frame (114.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.7 ms/frame
  crowd pass: 0.0 ms/frame (15.3 ms cumulative)
  agent updates: 2.4 ms/frame (2432.3 ms cumulative)
  livestock: 1.1 ms/frame (1123.6 ms cumulative)
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
      behaviour: 0.6 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.3
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 5.1/frame (5.1 rat candidates/frame)
    nearest scans: 20.0/frame (0.0 candidates/frame)
    water samples: 47.0/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 47.0/frame, 0.10 ms/frame (worst call 0.40 ms, 10200.9 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 20.1
    presentation executions/frame: 17.0
  rats: 0.1 ms/frame (76.3 ms cumulative)
  social: 0.0 ms/frame (5.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (176.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.4 ms/frame (1392.0 ms cumulative)
  forest sampling: 0.1 ms/frame (74.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (15.4 ms cumulative)
    targeting: 0.0 ms/frame (24.8 ms cumulative)
    decision: 0.0 ms/frame (7.6 ms cumulative)
    behaviour: 0.9 ms/frame (915.8 ms cumulative)
    life/presentation: 0.3 ms/frame (285.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.5
    full-rate agents/frame: 7.1
    reduced-cadence agents/frame: 23.1
    behaviour executions/frame: 15.5
    presentation executions/frame: 14.0

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.8
    village scan candidates/frame: 1606.8
    player perception checks/frame: 30.2

  nearest scans: 22.2/frame (22762 calls)
  nearest candidates checked: 405.6/frame (416589 total)
  herd leader scans: 0.2/frame (230 calls)
  herd candidates checked: 6.7/frame (6900 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.3/frame (142.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 17.8/frame, 0.00 ms/frame (worst call 0.70 ms)
    collider queries: 17.8/frame, 0.00 ms/frame (worst call 0.40 ms, 282.6 colliders/frame)

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
Frames: 1034
Shadow refresh frames: 1034
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
  calls avg: 406  tris avg: 2177391
  info calls avg: 406  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=3 tris=960
  faunaFamily:dog              calls=7 tris=2156
  faunaFamily:sheep            calls=3 tris=1052
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3902
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=4 tris=3808
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8722
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
  calls avg: 1446  tris avg: 4588568
  info calls avg: 1851  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5344
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 114.7ms
simulate        92.7ms
render          21.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.2ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           86.3ms
PHYSICS          0.1ms
RENDER          17.6ms
OTHER            1.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=18.7 ms  p95=20.3 ms  max=24.9 ms  Δavg vs baseline=—
  hide-grass           avg=18.1 ms  p95=19.2 ms  max=19.7 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-vegetation      avg=17.8 ms  p95=18.8 ms  max=19.1 ms  Δavg vs baseline=-0.9 ms (-5%)
  no vegetation/grass  avg=17.8 ms  p95=19.7 ms  max=24.5 ms  Δavg vs baseline=-0.9 ms (-5%)
  hide-environment     avg=17.7 ms  p95=18.6 ms  max=21.9 ms  Δavg vs baseline=-1.1 ms (-6%)
  hide-settlement      avg=15.0 ms  p95=16.3 ms  max=20.5 ms  Δavg vs baseline=-3.7 ms (-20%)
  no water             avg=18.4 ms  p95=20.9 ms  max=21.8 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-terrain         avg=17.8 ms  p95=19.0 ms  max=19.4 ms  Δavg vs baseline=-0.9 ms (-5%)
  hide-npc-fauna       avg=11.5 ms  p95=12.2 ms  max=12.7 ms  Δavg vs baseline=-7.2 ms (-38%)
  no-shadows           avg=15.3 ms  p95=16.7 ms  max=22.1 ms  Δavg vs baseline=-3.4 ms (-18%)
  no-ao                avg=18.3 ms  p95=19.4 ms  max=19.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  no-bloom             avg=18.8 ms  p95=19.8 ms  max=19.8 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-smaa              avg=18.9 ms  p95=20.0 ms  max=24.9 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-god-rays          avg=18.7 ms  p95=20.0 ms  max=21.6 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-film-grade        avg=18.6 ms  p95=19.4 ms  max=20.2 ms  Δavg vs baseline=-0.1 ms (-0%)
  no postprocessing    avg=18.4 ms  p95=20.0 ms  max=20.9 ms  Δavg vs baseline=-0.3 ms (-2%)
  no mirrors           avg=18.7 ms  p95=19.9 ms  max=21.0 ms  Δavg vs baseline=-0.1 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=19.5 ms  p95=20.3 ms  max=23.1 ms
  CPU wall      avg=18.7 ms  p95=20.3 ms  max=24.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
