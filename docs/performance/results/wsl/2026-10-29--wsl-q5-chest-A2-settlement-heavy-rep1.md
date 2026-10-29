# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T23:14:22.201Z
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
Frames: 284
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: b2691195dc94b512073b5e4acd43e42984099ab2
  runId: 2026-10-29T23-12-26-590Z-j5id3c
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
  populationGate: stable waited=6873ms npc=53
  gpuTimer: available=true resolved=true samples=283 span=postprocess+labels

FPS:
  avg: 20.3
  min: 1
  p1: 13

Frame time (wall-clock):
  avg: 49.2 ms
  p50: 44.8 ms
  p95: 58.5 ms
  p99: 79.2 ms
  max: 1191.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.7 p95=12.8 p99=54.6 max=68.8 n=284
  render: p50=34.6 p95=45.8 p99=53.4 max=1181.4 n=284
  frame: p50=44.8 p95=58.5 p99=79.2 max=1191.4 n=284

Rendering (combined renderer.info):
  draw calls: 2165 avg / 2498 max
  triangles: 7.76M avg
  mirror draws: 314 avg
  geometries: 961
  textures: 825

Pass submissions (actual):
  reliability: observed
  frames: 286 shadowRefresh=286 shadowSkipped=0
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
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=20 tris=25.8k meshes=20 inst=20
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
  environment              nodes=515 composed=515 multiplied=515 skinned=0
  settlement               nodes=2468 composed=2468 multiplied=2468 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4158 composed=4158 multiplied=4158 skinned=501
  fauna                    nodes=4345 composed=4345 multiplied=4345 skinned=364
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=785 composed=768 multiplied=785 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2468 composed=2468 multiplied=2468 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×6      nodes=459 composed=459 multiplied=459 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×18           nodes=60 composed=60 multiplied=60 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.3 ms
  NPC            4.8 ms
  FAUNA          2.7 ms
  PHYSICS        0.1 ms
  RENDER         36.2 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=31.4 ms draws=2158 tris=7.75M
  hide-grass         render=33.3 ms draws=2124 tris=7.44M
  hide-vegetation    render=25.9 ms draws=1987 tris=6.66M
  hide-vegetation-grass render=25.4 ms draws=1945 tris=6.34M
  hide-environment   render=26.1 ms draws=1867 tris=7.70M
  hide-settlement    render=17.8 ms draws=1373 tris=6.88M
  hide-water         render=36.1 ms draws=2160 tris=6.79M
  hide-terrain       render=33.3 ms draws=2110 tris=3.70M
  hide-npc-fauna     render=15.4 ms draws=1817 tris=7.44M
  no-shadows         render=17.9 ms draws=1784 tris=5.58M
  no-ao              render=35.2 ms draws=2164 tris=7.76M
  no-bloom           render=35.4 ms draws=2157 tris=7.77M
  no-smaa            render=35.7 ms draws=2168 tris=7.76M
  no-god-rays        render=34.1 ms draws=2166 tris=7.76M
  no-film-grade      render=33.6 ms draws=2167 tris=7.76M
  no-postprocessing  render=29.0 ms draws=2151 tris=7.77M
  no-reflections     render=23.3 ms draws=1847 tris=6.76M

Frame attribution:
  frame max: 1191.4 ms
  largest labelled hitch: 0 ms
  unattributed: 1191.4 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 1191.4 ms

Raw sidecar:
  sampling=full factor=1 exported=284/284

Recommendation:
Largest frame (1191.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.8 ms/frame
  crowd pass: 0.0 ms/frame (6.3 ms cumulative)
  agent updates: 2.7 ms/frame (770.8 ms cumulative)
  livestock: 1.6 ms/frame (450.1 ms cumulative)
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
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 7.5/frame (7.5 rat candidates/frame)
    nearest scans: 30.3/frame (0.0 candidates/frame)
    water samples: 61.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 61.6/frame, 0.10 ms/frame (worst call 0.20 ms, 13739.3 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 55.8
    behaviour executions/frame: 30.3
    presentation executions/frame: 30.2
  rats: 0.2 ms/frame (46.9 ms cumulative)
  social: 0.0 ms/frame (2.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (63.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.7 ms/frame
  agent updates: 2.6 ms/frame (743.6 ms cumulative)
  forest sampling: 0.1 ms/frame (30.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (5.6 ms cumulative)
    targeting: 0.0 ms/frame (10.8 ms cumulative)
    decision: 0.0 ms/frame (5.4 ms cumulative)
    behaviour: 1.9 ms/frame (544.0 ms cumulative)
    life/presentation: 0.4 ms/frame (114.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.6
    full-rate agents/frame: 9.1
    reduced-cadence agents/frame: 21.0
    behaviour executions/frame: 19.6
    presentation executions/frame: 19.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.3
    village scan candidates/frame: 1627.8
    player perception checks/frame: 30.1

  nearest scans: 24.9/frame (7082 calls)
  nearest candidates checked: 424.5/frame (120553 total)
  herd leader scans: 0.2/frame (52 calls)
  herd candidates checked: 5.5/frame (1560 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.0/frame (194.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 147.2/frame, 0.10 ms/frame (worst call 1.50 ms)
    collider queries: 147.2/frame, 0.10 ms/frame (worst call 1.20 ms, 2463.5 colliders/frame)

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
Frames: 286
Shadow refresh frames: 286
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993144
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2289
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
  calls avg: 406  tris avg: 2177083
  info calls avg: 406  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=57
  faunaFamily:dog              calls=8 tris=2777
  faunaFamily:donkey           calls=1 tris=210
  faunaFamily:sheep            calls=4 tris=1222
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4580
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=2745
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8701
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
  calls avg: 1445  tris avg: 4588357
  info calls avg: 1851  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5149
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15112
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
Long frames: 3
Shown: 3 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 3 shown, 3 total):

[LONG FRAME] 1191.4ms
simulate         9.7ms
render        1181.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.1ms
NPC              4.4ms
FAUNA            3.3ms
PHYSICS          0.1ms
RENDER        1181.4ms
OTHER            2.1ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #2:

[LONG FRAME] 93.6ms
simulate        68.8ms
render          24.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.3ms
STREAMING        0.0ms
NPC              6.5ms
FAUNA           60.0ms
PHYSICS          0.1ms
RENDER          19.3ms
OTHER            2.4ms

Long frame #3:

[LONG FRAME] 80.2ms
simulate        58.2ms
render          21.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           51.1ms
PHYSICS          0.1ms
RENDER          21.7ms
OTHER            2.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=31.4 ms  p95=37.5 ms  max=43.0 ms  Δavg vs baseline=—
  hide-grass           avg=33.3 ms  p95=41.2 ms  max=43.8 ms  Δavg vs baseline=+1.9 ms (+6%)
  hide-vegetation      avg=25.9 ms  p95=30.7 ms  max=36.8 ms  Δavg vs baseline=-5.5 ms (-18%)
  no vegetation/grass  avg=25.4 ms  p95=32.5 ms  max=36.3 ms  Δavg vs baseline=-5.9 ms (-19%)
  hide-environment     avg=26.1 ms  p95=30.3 ms  max=31.6 ms  Δavg vs baseline=-5.2 ms (-17%)
  hide-settlement      avg=17.8 ms  p95=19.5 ms  max=20.0 ms  Δavg vs baseline=-13.6 ms (-43%)
  no water             avg=36.1 ms  p95=44.8 ms  max=54.8 ms  Δavg vs baseline=+4.8 ms (+15%)
  hide-terrain         avg=33.3 ms  p95=39.9 ms  max=42.1 ms  Δavg vs baseline=+2.0 ms (+6%)
  hide-npc-fauna       avg=15.4 ms  p95=17.6 ms  max=18.0 ms  Δavg vs baseline=-16.0 ms (-51%)
  no-shadows           avg=17.9 ms  p95=19.5 ms  max=24.1 ms  Δavg vs baseline=-13.5 ms (-43%)
  no-ao                avg=35.2 ms  p95=45.9 ms  max=60.1 ms  Δavg vs baseline=+3.8 ms (+12%)
  no-bloom             avg=35.4 ms  p95=40.8 ms  max=45.1 ms  Δavg vs baseline=+4.1 ms (+13%)
  no-smaa              avg=35.7 ms  p95=42.9 ms  max=45.0 ms  Δavg vs baseline=+4.4 ms (+14%)
  no-god-rays          avg=34.1 ms  p95=40.8 ms  max=46.1 ms  Δavg vs baseline=+2.7 ms (+9%)
  no-film-grade        avg=33.6 ms  p95=41.5 ms  max=44.3 ms  Δavg vs baseline=+2.3 ms (+7%)
  no postprocessing    avg=29.0 ms  p95=38.8 ms  max=64.5 ms  Δavg vs baseline=-2.3 ms (-7%)
  no mirrors           avg=23.3 ms  p95=25.5 ms  max=33.8 ms  Δavg vs baseline=-8.1 ms (-26%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=56.8 ms  p95=66.1 ms  max=82.3 ms
  CPU wall      avg=31.4 ms  p95=37.5 ms  max=43.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
