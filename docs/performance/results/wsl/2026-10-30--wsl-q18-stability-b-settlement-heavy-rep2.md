# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T10:19:11.252Z
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
Frames: 317
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 5a95c52c56f8e6a75e2b5ae006260991a06f7a9e
  runId: 2026-10-30T10-17-21-135Z-k6s4j0
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
  populationGate: stable waited=7439ms npc=57
  gpuTimer: available=true resolved=true samples=316 span=postprocess+labels

FPS:
  avg: 21
  min: 6
  p1: 11

Frame time (wall-clock):
  avg: 47.6 ms
  p50: 45.3 ms
  p95: 65.2 ms
  p99: 92.4 ms
  max: 176.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.4 p95=15.8 p99=61 max=69.8 n=317
  render: p50=35.7 p95=48.5 p99=69.5 max=168.2 n=317
  frame: p50=45.3 p95=65.2 p99=92.4 max=176.4 n=317

Rendering (combined renderer.info):
  draw calls: 2093 avg / 2413 max
  triangles: 7.76M avg
  mirror draws: 295 avg
  geometries: 924
  textures: 823

Pass submissions (actual):
  reliability: observed
  frames: 319 shadowRefresh=319 shadowSkipped=0
  mirror calls avg: 295
  shadow calls avg: 393
  main calls avg: 1405

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1236 tris=1.43M meshes=1236 inst=3666
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=540 tris=680.5k meshes=540 inst=540
  fauna            draws=434 tris=162.6k meshes=434 inst=434
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=722 tris=854.0k meshes=722 inst=2880
  npc              draws=20 tris=25.8k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=155 tris=293.3k meshes=155 inst=1778
  houseInteractive draws=64 tris=10.0k meshes=64 inst=64
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=5 tris=4.8k meshes=5 inst=5
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=5 tris=25.0k meshes=5 inst=32
  storageContainer draws=30 tris=10.1k meshes=30 inst=138
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.8k meshes=24 inst=78
  workplace        draws=26 tris=17.4k meshes=26 inst=26
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=9.6k meshes=5 inst=12
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=32 tris=3.5k meshes=32 inst=32
  fireCampfire     draws=40 tris=1.1k meshes=40 inst=40
  decor            draws=194 tris=377.2k meshes=194 inst=277
  other            draws=59 tris=1.8k meshes=59 inst=59

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=29 draws=267 tris=320.9k skinned=267/267
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Wizard           agents=4 draws=47 tris=46.9k skinned=47/47
      Farmer           agents=5 draws=42 tris=63.0k skinned=42/42
      Herbalist        agents=4 draws=41 tris=52.4k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.7k skinned=27/27
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=25.8k
      far  agents=55 camera-relevant=19 draws=520 tris=654.7k
  Fauna:
    by family (sorted by draws):
      horse            agents=11 draws=88 tris=24.0k skinned=88/88
      dog              agents=15 draws=83 tris=29.0k skinned=83/83
      sheep            agents=23 draws=46 tris=14.0k skinned=46/46
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      chicken          agents=7 draws=35 tris=4.5k skinned=0/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=5 draws=10 tris=20.0k skinned=10/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=2 draws=2 tris=2.4k skinned=0/2
    by distance band:
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=97 camera-relevant=20 draws=424 tris=159.4k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=515 composed=515 multiplied=515 skinned=0
  settlement               nodes=2468 composed=2468 multiplied=2468 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4473 composed=4473 multiplied=4473 skinned=540
  fauna                    nodes=4683 composed=4683 multiplied=4683 skinned=388
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=783 composed=766 multiplied=783 skinned=9
  top scene children:
    fauna ×100               nodes=4683 composed=4683 multiplied=4683 skinned=388
    npc ×57                  nodes=4473 composed=4473 multiplied=4473 skinned=540
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
  WATER          3.8 ms
  NPC            5.5 ms
  FAUNA          3.0 ms
  PHYSICS        0.1 ms
  RENDER         33.4 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=35.7 ms draws=2085 tris=7.75M
  hide-grass         render=41.1 ms draws=2062 tris=7.45M
  hide-vegetation    render=25.7 ms draws=1908 tris=6.66M
  hide-vegetation-grass render=27.4 ms draws=1879 tris=6.35M
  hide-environment   render=28.3 ms draws=1791 tris=7.70M
  hide-settlement    render=19.5 ms draws=1361 tris=6.87M
  hide-water         render=37.8 ms draws=2082 tris=6.79M
  hide-terrain       render=31.6 ms draws=2041 tris=3.71M
  hide-npc-fauna     render=17.2 ms draws=1743 tris=7.44M
  no-shadows         render=19.0 ms draws=1726 tris=5.58M
  no-ao              render=29.8 ms draws=2084 tris=7.75M
  no-bloom           render=34.4 ms draws=2067 tris=7.75M
  no-smaa            render=34.3 ms draws=2077 tris=7.76M
  no-god-rays        render=35.0 ms draws=2084 tris=7.76M
  no-film-grade      render=36.1 ms draws=2081 tris=7.76M
  no-postprocessing  render=27.4 ms draws=2049 tris=7.75M
  no-reflections     render=25.9 ms draws=1777 tris=6.76M

Frame attribution:
  frame max: 176.4 ms
  largest labelled hitch: 0 ms
  unattributed: 176.4 ms

Long frames:
  threshold: 80 ms
  count: 10
  worst: 176.4 ms

Raw sidecar:
  sampling=full factor=1 exported=317/317

Recommendation:
Largest frame (176.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 57
  Fauna (agents): 30

NPC:
  total: 5.5 ms/frame
  crowd pass: 0.0 ms/frame (10.4 ms cumulative)
  agent updates: 3.0 ms/frame (937.9 ms cumulative)
  livestock: 2.0 ms/frame (626.8 ms cumulative)
    loaded tick: 2.0 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 2.0 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.1 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 1.0 ms/frame
      life/presentation: 0.6 ms/frame
      other update: 0.3 ms/frame
    update calls/frame: 65.4
    unique animals/frame: 57.4
    duplicate updates/frame: 8.1
    detached animals/frame: 0.0
    dog updates/frame: 15.1
    dog guard scans: 15.1/frame (120.8 predator candidates/frame)
    pest scans: 8.3/frame (8.3 rat candidates/frame)
    nearest scans: 34.9/frame (0.0 candidates/frame)
    water samples: 77.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 77.4/frame, 0.10 ms/frame (worst call 0.20 ms, 15917.1 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 64.8
    behaviour executions/frame: 35.0
    presentation executions/frame: 34.9
  rats: 0.2 ms/frame (49.6 ms cumulative)
  social: 0.0 ms/frame (3.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (85.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.0 ms/frame
  agent updates: 2.9 ms/frame (917.6 ms cumulative)
  forest sampling: 0.1 ms/frame (36.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.1 ms cumulative)
    targeting: 0.0 ms/frame (12.0 ms cumulative)
    decision: 0.0 ms/frame (4.0 ms cumulative)
    behaviour: 2.1 ms/frame (663.7 ms cumulative)
    life/presentation: 0.5 ms/frame (153.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.6
    full-rate agents/frame: 9.1
    reduced-cadence agents/frame: 21.1
    behaviour executions/frame: 19.6
    presentation executions/frame: 19.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.8
    village scan candidates/frame: 1745.9
    player perception checks/frame: 30.2

  nearest scans: 24.9/frame (7878 calls)
  nearest candidates checked: 476.3/frame (150984 total)
  herd leader scans: 0.2/frame (52 calls)
  herd candidates checked: 4.9/frame (1560 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.7/frame (181.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 178.9/frame, 0.20 ms/frame (worst call 0.90 ms)
    collider queries: 178.9/frame, 0.10 ms/frame (worst call 1.10 ms, 10387.5 colliders/frame)

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
Frames: 319
Shadow refresh frames: 319
Shadow skipped frames: 0

Mirror:
  calls avg: 295  tris avg: 996415
  info calls avg: 295  residual calls avg: 0
  switches avg: material=93.3 program=51.1  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=44 tris=8893
  items                        calls=1 tris=634
  other                        calls=38 tris=2303
  settlement:decor             calls=1 tris=839
  settlement:fence             calls=2 tris=9321
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=722
  settlement:fireHouseInteriorLamp calls=5 tris=542
  settlement:fireVillageTorch  calls=5 tris=359
  settlement:houseInteractive  calls=15 tris=1655
  settlement:houseStatic       calls=33 tris=80754
  settlement:landmarkGarden    calls=5 tris=83063
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=938
  settlement:landmarkWellHousehold calls=5 tris=9379
  settlement:landmarkWellPasture calls=3 tris=938
  settlement:other             calls=10 tris=351
  settlement:storageBarrel     calls=5 tris=11801
  settlement:storageContainer  calls=8 tris=2474
  settlement:storageGoods      calls=40 tris=6996
  settlement:storageHay        calls=1 tris=490
  settlement:storageTrough     calls=4 tris=1705
  settlement:storageWoodHousehold calls=1 tris=5868
  settlement:storageWoodSettlementPrimary calls=1 tris=548
  settlement:storageWoodSettlementSecondary calls=1 tris=2825
  settlement:workplace         calls=11 tris=5310
  terrain                      calls=8 tris=591673
  vegetation                   calls=23 tris=166074

Shadow (refresh only):
  calls avg: 393  tris avg: 2175991
  info calls avg: 393  residual calls avg: 0
  switches avg: material=85.9 program=97.6  actor: calls=41.2 material=0.4 program=3.9
  skinning avg: skinned calls=45.9 skeletons first used=45.9
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=41
  faunaFamily:cow              calls=6 tris=2005
  faunaFamily:dog              calls=7 tris=2164
  faunaFamily:sheep            calls=4 tris=1220
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3813
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=1 tris=1268
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8690
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
  calls avg: 1405  tris avg: 4588651
  info calls avg: 1798  residual calls avg: 0
  switches avg: material=623 program=213  actor: calls=307.8 material=187 program=88
  skinning avg: skinned calls=301.8 skeletons first used=264.2
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5130
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15125
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
Long frames: 10
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 10 total):

[LONG FRAME] 176.4ms
simulate         8.1ms
render         168.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.0ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER         168.1ms
OTHER            2.0ms

Long frame #2:

[LONG FRAME] 94ms
simulate        62.3ms
render          31.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              5.0ms
FAUNA           55.6ms
PHYSICS          0.1ms
RENDER          31.6ms
OTHER            1.5ms

Long frame #3:

[LONG FRAME] 93.4ms
simulate        69.8ms
render          23.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           63.0ms
PHYSICS          0.2ms
RENDER          23.5ms
OTHER            1.9ms

Long frame #4:

[LONG FRAME] 92.4ms
simulate        21.2ms
render          71.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC             16.9ms
FAUNA            1.6ms
PHYSICS          0.3ms
RENDER          71.1ms
OTHER            2.4ms

Long frame #5:

[LONG FRAME] 92.1ms
simulate        61.5ms
render          30.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.1ms
STREAMING        0.0ms
NPC              5.5ms
FAUNA           54.0ms
PHYSICS          0.1ms
RENDER          24.6ms
OTHER            1.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=35.7 ms  p95=40.5 ms  max=42.0 ms  Δavg vs baseline=—
  hide-grass           avg=41.1 ms  p95=61.5 ms  max=69.3 ms  Δavg vs baseline=+5.4 ms (+15%)
  hide-vegetation      avg=25.7 ms  p95=29.5 ms  max=30.8 ms  Δavg vs baseline=-10.0 ms (-28%)
  no vegetation/grass  avg=27.4 ms  p95=36.0 ms  max=51.9 ms  Δavg vs baseline=-8.3 ms (-23%)
  hide-environment     avg=28.3 ms  p95=38.5 ms  max=70.6 ms  Δavg vs baseline=-7.4 ms (-21%)
  hide-settlement      avg=19.5 ms  p95=22.4 ms  max=23.1 ms  Δavg vs baseline=-16.2 ms (-45%)
  no water             avg=37.8 ms  p95=49.7 ms  max=52.4 ms  Δavg vs baseline=+2.1 ms (+6%)
  hide-terrain         avg=31.6 ms  p95=38.4 ms  max=42.2 ms  Δavg vs baseline=-4.1 ms (-12%)
  hide-npc-fauna       avg=17.2 ms  p95=19.5 ms  max=20.5 ms  Δavg vs baseline=-18.5 ms (-52%)
  no-shadows           avg=19.0 ms  p95=22.8 ms  max=23.3 ms  Δavg vs baseline=-16.7 ms (-47%)
  no-ao                avg=29.8 ms  p95=43.0 ms  max=46.0 ms  Δavg vs baseline=-5.9 ms (-16%)
  no-bloom             avg=34.4 ms  p95=39.1 ms  max=40.8 ms  Δavg vs baseline=-1.3 ms (-4%)
  no-smaa              avg=34.3 ms  p95=40.6 ms  max=44.7 ms  Δavg vs baseline=-1.4 ms (-4%)
  no-god-rays          avg=35.0 ms  p95=43.4 ms  max=46.7 ms  Δavg vs baseline=-0.7 ms (-2%)
  no-film-grade        avg=36.1 ms  p95=44.8 ms  max=47.7 ms  Δavg vs baseline=+0.4 ms (+1%)
  no postprocessing    avg=27.4 ms  p95=36.9 ms  max=60.3 ms  Δavg vs baseline=-8.3 ms (-23%)
  no mirrors           avg=25.9 ms  p95=33.2 ms  max=36.9 ms  Δavg vs baseline=-9.8 ms (-28%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=37.3 ms  p95=39.5 ms  max=39.8 ms
  CPU wall      avg=35.7 ms  p95=40.5 ms  max=42.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
