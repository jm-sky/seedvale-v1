# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T07:07:51.242Z
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
Frames: 1062
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d2b14bf7cbf380131bfa43bc2bd685af918f30e5
  runId: 2026-10-30T07-06-48-710Z-4du0n0
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
  populationGate: stable waited=5960ms npc=53
  gpuTimer: available=true resolved=true samples=1069 span=postprocess+labels

FPS:
  avg: 36.5
  min: 13
  p1: 14

Frame time (wall-clock):
  avg: 27.4 ms
  p50: 26.7 ms
  p95: 31.8 ms
  p99: 70.4 ms
  max: 76.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.4 p95=7.7 p99=49.9 max=54 n=1062
  render: p50=21.2 p95=24.3 p99=26.7 max=47.8 n=1062
  frame: p50=26.7 p95=31.8 p99=70.4 max=76.3 n=1062

Rendering (combined renderer.info):
  draw calls: 2165 avg / 2499 max
  triangles: 7.76M avg
  mirror draws: 314 avg
  geometries: 964
  textures: 830

Pass submissions (actual):
  reliability: observed
  frames: 1070 shadowRefresh=1070 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 406
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
  other            draws=510 tris=29.7k meshes=510 inst=512

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
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
      far  agents=88 camera-relevant=21 draws=389 tris=149.0k

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
  other                    nodes=781 composed=764 multiplied=781 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2468 composed=2468 multiplied=2468 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×6      nodes=459 composed=459 multiplied=459 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×16           nodes=56 composed=56 multiplied=56 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          2.5 ms
  NPC            3.7 ms
  FAUNA          1.6 ms
  PHYSICS        0.1 ms
  RENDER         18.2 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=17.5 ms draws=2166 tris=7.76M
  hide-grass         render=17.4 ms draws=2133 tris=7.45M
  hide-vegetation    render=16.6 ms draws=1978 tris=6.66M
  hide-vegetation-grass render=16.2 ms draws=1946 tris=6.34M
  hide-environment   render=17.8 ms draws=1857 tris=7.70M
  hide-settlement    render=13.5 ms draws=1356 tris=6.87M
  hide-water         render=17.3 ms draws=2134 tris=6.78M
  hide-terrain       render=16.8 ms draws=2100 tris=3.71M
  hide-npc-fauna     render=11.2 ms draws=1808 tris=7.43M
  no-shadows         render=14.1 ms draws=1771 tris=5.58M
  no-ao              render=17.3 ms draws=2154 tris=7.77M
  no-bloom           render=17.4 ms draws=2145 tris=7.76M
  no-smaa            render=17.8 ms draws=2154 tris=7.76M
  no-god-rays        render=17.5 ms draws=2139 tris=7.75M
  no-film-grade      render=17.5 ms draws=2136 tris=7.75M
  no-postprocessing  render=16.9 ms draws=2113 tris=7.75M
  no-reflections     render=17.6 ms draws=1817 tris=6.75M

Frame attribution:
  frame max: 76.3 ms
  largest labelled hitch: 0 ms
  unattributed: 76.3 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1062/1062

Recommendation:
Largest frame (76.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.7 ms/frame
  crowd pass: 0.0 ms/frame (17.6 ms cumulative)
  agent updates: 2.3 ms/frame (2435.0 ms cumulative)
  livestock: 1.1 ms/frame (1198.3 ms cumulative)
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
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 4.9/frame (4.9 rat candidates/frame)
    nearest scans: 19.5/frame (0.0 candidates/frame)
    water samples: 43.5/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 43.5/frame, 0.00 ms/frame (worst call 0.90 ms, 9429.0 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 19.7
    presentation executions/frame: 16.6
  rats: 0.1 ms/frame (94.5 ms cumulative)
  social: 0.0 ms/frame (5.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (180.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.5 ms/frame (1619.6 ms cumulative)
  forest sampling: 0.1 ms/frame (78.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.3 ms cumulative)
    targeting: 0.0 ms/frame (23.5 ms cumulative)
    decision: 0.0 ms/frame (8.8 ms cumulative)
    behaviour: 1.1 ms/frame (1141.4 ms cumulative)
    life/presentation: 0.3 ms/frame (291.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.8
    full-rate agents/frame: 6.6
    reduced-cadence agents/frame: 23.7
    behaviour executions/frame: 14.8
    presentation executions/frame: 13.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.9
    village scan candidates/frame: 1611.4
    player perception checks/frame: 30.2

  nearest scans: 21.2/frame (22525 calls)
  nearest candidates checked: 396.2/frame (420720 total)
  herd leader scans: 0.2/frame (229 calls)
  herd candidates checked: 6.5/frame (6870 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.9/frame (126.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 29.3/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 29.3/frame, 0.00 ms/frame (worst call 0.10 ms, 514.4 colliders/frame)

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
Frames: 1070
Shadow refresh frames: 1070
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
  calls avg: 406  tris avg: 2174983
  info calls avg: 406  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=4 tris=1465
  faunaFamily:dog              calls=6 tris=2119
  faunaFamily:donkey           calls=1 tris=323
  faunaFamily:sheep            calls=4 tris=1220
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2044
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=2 tris=2290
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
  calls avg: 1445  tris avg: 4588439
  info calls avg: 1851  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5215
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
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=17.5 ms  p95=18.7 ms  max=22.4 ms  Δavg vs baseline=—
  hide-grass           avg=17.4 ms  p95=19.2 ms  max=20.6 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-vegetation      avg=16.6 ms  p95=17.7 ms  max=20.9 ms  Δavg vs baseline=-0.9 ms (-5%)
  no vegetation/grass  avg=16.2 ms  p95=17.2 ms  max=22.7 ms  Δavg vs baseline=-1.3 ms (-7%)
  hide-environment     avg=17.8 ms  p95=22.3 ms  max=30.3 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-settlement      avg=13.5 ms  p95=14.8 ms  max=15.4 ms  Δavg vs baseline=-4.0 ms (-23%)
  no water             avg=17.3 ms  p95=18.9 ms  max=21.8 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-terrain         avg=16.8 ms  p95=17.9 ms  max=19.9 ms  Δavg vs baseline=-0.7 ms (-4%)
  hide-npc-fauna       avg=11.2 ms  p95=12.0 ms  max=13.0 ms  Δavg vs baseline=-6.3 ms (-36%)
  no-shadows           avg=14.1 ms  p95=16.1 ms  max=22.2 ms  Δavg vs baseline=-3.5 ms (-20%)
  no-ao                avg=17.3 ms  p95=18.4 ms  max=18.6 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-bloom             avg=17.4 ms  p95=18.5 ms  max=18.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-smaa              avg=17.8 ms  p95=18.7 ms  max=25.2 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-god-rays          avg=17.5 ms  p95=18.4 ms  max=19.3 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-film-grade        avg=17.5 ms  p95=19.3 ms  max=24.0 ms  Δavg vs baseline=-0.1 ms (-0%)
  no postprocessing    avg=16.9 ms  p95=18.1 ms  max=18.7 ms  Δavg vs baseline=-0.7 ms (-4%)
  no mirrors           avg=17.6 ms  p95=19.5 ms  max=23.9 ms  Δavg vs baseline=+0.0 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=19.1 ms  p95=19.6 ms  max=21.0 ms
  CPU wall      avg=17.5 ms  p95=18.7 ms  max=22.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
