# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T13:03:54.956Z
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
Frames: 363
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 5c21bad4f47f865144dddadee40821140eb2ac69
  runId: 2026-10-30T13-02-11-243Z-4hkw7k
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
  populationGate: stable waited=7675ms npc=57
  gpuTimer: available=true resolved=true samples=362 span=postprocess+labels

FPS:
  avg: 26.1
  min: 10
  p1: 15

Frame time (wall-clock):
  avg: 38.3 ms
  p50: 37.8 ms
  p95: 44 ms
  p99: 68.7 ms
  max: 101.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.9 p95=10.3 p99=40.2 max=74 n=363
  render: p50=29.3 p95=35.1 p99=39.7 max=52.4 n=363
  frame: p50=37.8 p95=44 p99=68.7 max=101.7 n=363

Rendering (combined renderer.info):
  draw calls: 2050 avg / 2364 max
  triangles: 7.75M avg
  mirror draws: 295 avg
  geometries: 945
  textures: 419

Pass submissions (actual):
  reliability: observed
  frames: 365 shadowRefresh=365 shadowSkipped=0
  mirror calls avg: 295
  shadow calls avg: 389
  main calls avg: 1366

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1236 tris=1.43M meshes=1236 inst=3666
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=540 tris=680.5k meshes=540 inst=540
  fauna            draws=434 tris=162.6k meshes=434 inst=434
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=501 tris=29.7k meshes=501 inst=503

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=722 tris=854.0k meshes=722 inst=2880
  npc              draws=42 tris=49.4k meshes=42 inst=42
  fauna            draws=17 tris=5.6k meshes=17 inst=17
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=112 tris=14.9k meshes=112 inst=112

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
      mid  agents=4 camera-relevant=2 draws=42 tris=49.4k
      far  agents=53 camera-relevant=19 draws=498 tris=631.1k
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
      mid  agents=4 camera-relevant=3 draws=17 tris=5.6k
      far  agents=96 camera-relevant=20 draws=417 tris=156.9k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=439 composed=439 multiplied=439 skinned=0
  settlement               nodes=2468 composed=2468 multiplied=2468 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4473 composed=4473 multiplied=4473 skinned=540
  fauna                    nodes=4683 composed=4683 multiplied=4683 skinned=388
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=771 composed=754 multiplied=771 skinned=9
  top scene children:
    fauna ×100               nodes=4683 composed=4683 multiplied=4683 skinned=388
    npc ×57                  nodes=4473 composed=4473 multiplied=4473 skinned=540
    settlement ×5            nodes=2468 composed=2468 multiplied=2468 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×96                nodes=602 composed=602 multiplied=602 skinned=9
    chunk-environmen ×5      nodes=383 composed=383 multiplied=383 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.7 ms
  NPC            5.0 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         25.4 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=26.4 ms draws=2056 tris=7.76M
  hide-grass         render=39.5 ms draws=2025 tris=7.44M
  hide-vegetation    render=23.4 ms draws=1877 tris=6.66M
  hide-vegetation-grass render=22.7 ms draws=1831 tris=6.33M
  hide-environment   render=23.8 ms draws=1777 tris=7.69M
  hide-settlement    render=18.9 ms draws=1318 tris=6.86M
  hide-water         render=26.8 ms draws=2039 tris=6.79M
  hide-terrain       render=28.6 ms draws=1996 tris=3.70M
  hide-npc-fauna     render=16.2 ms draws=1704 tris=7.43M
  no-shadows         render=18.1 ms draws=1683 tris=5.58M
  no-ao              render=28.1 ms draws=2042 tris=7.75M
  no-bloom           render=27.1 ms draws=2042 tris=7.75M
  no-smaa            render=28.0 ms draws=2055 tris=7.76M
  no-god-rays        render=26.9 ms draws=2051 tris=7.75M
  no-film-grade      render=26.8 ms draws=2048 tris=7.75M
  no-postprocessing  render=24.5 ms draws=2015 tris=7.75M
  no-reflections     render=23.7 ms draws=1746 tris=6.75M

Frame attribution:
  frame max: 101.7 ms
  largest labelled hitch: 0 ms
  unattributed: 101.7 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 101.7 ms

Raw sidecar:
  sampling=full factor=1 exported=363/363

Recommendation:
Largest frame (101.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 57
  Fauna (agents): 30

NPC:
  total: 5.0 ms/frame
  crowd pass: 0.0 ms/frame (8.3 ms cumulative)
  agent updates: 2.8 ms/frame (1023.1 ms cumulative)
  livestock: 1.7 ms/frame (608.6 ms cumulative)
    loaded tick: 1.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 65.4
    unique animals/frame: 57.3
    duplicate updates/frame: 8.0
    detached animals/frame: 0.0
    dog updates/frame: 15.1
    dog guard scans: 15.1/frame (120.7 predator candidates/frame)
    pest scans: 8.2/frame (8.2 rat candidates/frame)
    nearest scans: 34.4/frame (0.0 candidates/frame)
    water samples: 72.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 72.3/frame, 0.10 ms/frame (worst call 0.20 ms, 14656.1 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 64.9
    behaviour executions/frame: 34.5
    presentation executions/frame: 34.3
  rats: 0.2 ms/frame (61.4 ms cumulative)
  social: 0.0 ms/frame (3.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (89.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.8 ms/frame (637.3 ms cumulative)
  forest sampling: 0.1 ms/frame (37.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.1 ms cumulative)
    targeting: 0.0 ms/frame (9.8 ms cumulative)
    decision: 0.0 ms/frame (3.3 ms cumulative)
    behaviour: 1.1 ms/frame (410.6 ms cumulative)
    life/presentation: 0.4 ms/frame (131.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.4
    full-rate agents/frame: 6.7
    reduced-cadence agents/frame: 23.5
    behaviour executions/frame: 18.4
    presentation executions/frame: 18.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.7
    village scan candidates/frame: 1735.4
    player perception checks/frame: 30.2

  nearest scans: 25.5/frame (9262 calls)
  nearest candidates checked: 513.0/frame (186209 total)
  herd leader scans: 0.2/frame (82 calls)
  herd candidates checked: 6.8/frame (2460 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.3/frame (155.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 148.2/frame, 0.10 ms/frame (worst call 1.30 ms)
    collider queries: 148.2/frame, 0.10 ms/frame (worst call 0.20 ms, 8366.3 colliders/frame)

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
Frames: 365
Shadow refresh frames: 365
Shadow skipped frames: 0

Mirror:
  calls avg: 295  tris avg: 995988
  info calls avg: 295  residual calls avg: 0
  switches avg: material=93 program=50.9  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=44 tris=8890
  items                        calls=1 tris=634
  other                        calls=38 tris=2267
  settlement:decor             calls=1 tris=839
  settlement:fence             calls=2 tris=9317
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=722
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=359
  settlement:houseInteractive  calls=15 tris=1655
  settlement:houseStatic       calls=33 tris=80723
  settlement:landmarkGarden    calls=5 tris=83030
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=938
  settlement:landmarkWellHousehold calls=5 tris=9376
  settlement:landmarkWellPasture calls=3 tris=938
  settlement:other             calls=10 tris=351
  settlement:storageBarrel     calls=5 tris=11796
  settlement:storageContainer  calls=8 tris=2473
  settlement:storageGoods      calls=40 tris=6993
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1705
  settlement:storageWoodHousehold calls=1 tris=5866
  settlement:storageWoodSettlementPrimary calls=1 tris=547
  settlement:storageWoodSettlementSecondary calls=1 tris=2824
  settlement:workplace         calls=11 tris=5308
  terrain                      calls=8 tris=591440
  vegetation                   calls=23 tris=166009

Shadow (refresh only):
  calls avg: 389  tris avg: 2173485
  info calls avg: 389  residual calls avg: 0
  switches avg: material=85.8 program=95  actor: calls=39.9 material=0.6 program=4.5
  skinning avg: skinned calls=44.6 skeletons first used=12.2
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=41
  faunaFamily:cow              calls=1 tris=436
  faunaFamily:dog              calls=6 tris=2062
  faunaFamily:sheep            calls=4 tris=1068
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=4005
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=5 tris=5019
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=29 tris=8659
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
  vegetation                   calls=77 tris=550282

Main:
  calls avg: 1366  tris avg: 4584562
  info calls avg: 1755  residual calls avg: 0
  switches avg: material=622.4 program=209.4  actor: calls=306.6 material=187 program=86
  skinning avg: skinned calls=300.6 skeletons first used=49
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=16 tris=4751
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=140 tris=15056
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
Long frames: 4
Shown: 4 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 4 shown, 4 total):

[LONG FRAME] 101.7ms
simulate        66.9ms
render          34.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.0ms
STREAMING        0.0ms
NPC              5.3ms
FAUNA           59.2ms
PHYSICS          0.1ms
RENDER          26.5ms
OTHER            2.6ms

Long frame #2:

[LONG FRAME] 99ms
simulate        74.0ms
render          24.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              4.8ms
FAUNA           67.0ms
PHYSICS          0.1ms
RENDER          24.6ms
OTHER            2.2ms

Long frame #3:

[LONG FRAME] 89.9ms
simulate        55.7ms
render          34.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.9ms
STREAMING        0.0ms
NPC              4.8ms
FAUNA           48.2ms
PHYSICS          0.1ms
RENDER          27.3ms
OTHER            2.6ms

Long frame #4:

[LONG FRAME] 81.8ms
simulate        61.7ms
render          19.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.1ms
NPC              4.9ms
FAUNA           54.3ms
PHYSICS          0.1ms
RENDER          19.7ms
OTHER            2.5ms

streaming / stages:
  chunkUpdate                  0.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=26.4 ms  p95=30.9 ms  max=46.7 ms  Δavg vs baseline=—
  hide-grass           avg=39.5 ms  p95=68.2 ms  max=71.7 ms  Δavg vs baseline=+13.1 ms (+50%)
  hide-vegetation      avg=23.4 ms  p95=26.8 ms  max=28.7 ms  Δavg vs baseline=-3.0 ms (-11%)
  no vegetation/grass  avg=22.7 ms  p95=25.6 ms  max=27.0 ms  Δavg vs baseline=-3.7 ms (-14%)
  hide-environment     avg=23.8 ms  p95=27.9 ms  max=30.1 ms  Δavg vs baseline=-2.6 ms (-10%)
  hide-settlement      avg=18.9 ms  p95=21.6 ms  max=22.5 ms  Δavg vs baseline=-7.5 ms (-29%)
  no water             avg=26.8 ms  p95=31.6 ms  max=33.3 ms  Δavg vs baseline=+0.4 ms (+2%)
  hide-terrain         avg=28.6 ms  p95=35.2 ms  max=42.4 ms  Δavg vs baseline=+2.2 ms (+8%)
  hide-npc-fauna       avg=16.2 ms  p95=17.5 ms  max=29.5 ms  Δavg vs baseline=-10.2 ms (-39%)
  no-shadows           avg=18.1 ms  p95=19.8 ms  max=20.1 ms  Δavg vs baseline=-8.3 ms (-32%)
  no-ao                avg=28.1 ms  p95=32.1 ms  max=33.9 ms  Δavg vs baseline=+1.7 ms (+6%)
  no-bloom             avg=27.1 ms  p95=30.9 ms  max=36.6 ms  Δavg vs baseline=+0.7 ms (+2%)
  no-smaa              avg=28.0 ms  p95=31.4 ms  max=32.5 ms  Δavg vs baseline=+1.6 ms (+6%)
  no-god-rays          avg=26.9 ms  p95=30.1 ms  max=31.7 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-film-grade        avg=26.8 ms  p95=31.8 ms  max=34.9 ms  Δavg vs baseline=+0.4 ms (+1%)
  no postprocessing    avg=24.5 ms  p95=28.4 ms  max=30.3 ms  Δavg vs baseline=-1.9 ms (-7%)
  no mirrors           avg=23.7 ms  p95=25.9 ms  max=27.3 ms  Δavg vs baseline=-2.7 ms (-10%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=34.7 ms  p95=36.5 ms  max=53.7 ms
  CPU wall      avg=26.4 ms  p95=30.9 ms  max=46.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
