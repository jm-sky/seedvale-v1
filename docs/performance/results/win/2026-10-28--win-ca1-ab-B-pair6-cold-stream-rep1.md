# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:54:06.188Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Program Census]
> - [Seedvale Program Attribution]
> - [Seedvale Program Compile Cost]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: stream
Duration: 30s
Frames: 1356
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-53-14-874Z-mtwpr8
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
  camera: pos=(426.9, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5062ms npc=20
  gpuTimer: available=true resolved=true samples=1367 span=postprocess+labels

FPS:
  avg: 58.3
  min: 2
  p1: 17

Frame time (wall-clock):
  avg: 17.2 ms
  p50: 14.8 ms
  p95: 27.3 ms
  p99: 58.8 ms
  max: 439.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.5 p95=8 p99=40.5 max=98.4 n=1356
  render: p50=10.8 p95=19 p99=27.4 max=430.8 n=1356
  frame: p50=14.8 p95=27.3 p99=58.8 max=439.4 n=1356

Rendering (combined renderer.info):
  draw calls: 868 avg / 2036 max
  triangles: 10.64M avg
  mirror draws: 155 avg
  geometries: 763
  textures: 579

Pass submissions (actual):
  reliability: observed
  frames: 1368 shadowRefresh=597 shadowSkipped=771
  mirror calls avg: 154
  shadow calls avg: 297
  main calls avg: 566

Scene (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  grass            draws=50 tris=836.9k meshes=50 inst=98785
  vegetation       draws=221 tris=1.62M meshes=221 inst=1036
  environment      draws=134 tris=30.9k meshes=134 inst=157
  settlement       draws=616 tris=665.9k meshes=616 inst=1126
  water            draws=51 tris=3.69M meshes=51 inst=51
  npc              draws=174 tris=222.1k meshes=174 inst=174
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=359 tris=32.6k meshes=359 inst=359
  other            draws=231 tris=26.0k meshes=231 inst=231

Shadow casters (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  vegetation       draws=205 tris=1.57M meshes=205 inst=1008
  environment      draws=133 tris=30.8k meshes=133 inst=156
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=46 tris=26.1k meshes=46 inst=46
  other            draws=102 tris=14.5k meshes=102 inst=102

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=67 tris=43.7k meshes=67 inst=379
  houseInteractive draws=18 tris=2.8k meshes=18 inst=18
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.0k meshes=3 inst=9
  storageContainer draws=30 tris=3.2k meshes=30 inst=42
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.0k meshes=8 inst=20
  workplace        draws=8 tris=4.1k meshes=8 inst=8
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=9 tris=972 meshes=9 inst=9
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=27 tris=504 meshes=27 inst=27

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=11 draws=100 tris=122.8k skinned=100/100
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Farmer           agents=2 draws=16 tris=24.5k skinned=16/16
      Wizard           agents=1 draws=12 tris=12.0k skinned=12/12
      Herbalist        agents=1 draws=10 tris=14.2k skinned=10/10
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      far  agents=19 camera-relevant=0 draws=174 tris=222.1k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      cow              agents=2 draws=14 tris=4.9k skinned=14/14
      donkey           agents=2 draws=14 tris=4.0k skinned=14/14
      dog              agents=2 draws=12 tris=3.9k skinned=12/12
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      horse            agents=1 draws=8 tris=2.2k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      far  agents=51 camera-relevant=0 draws=197 tris=86.4k

Systems:
  WATER          2.3 ms
  STREAMING      0.5 ms
  NPC            1.3 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         9.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  RENDER: 9
  WATER: 2
  STREAMING: 1
  FAUNA: 1

Hitches (>= 8 ms): total=3
  chunk mesh             n=1 avg=11.3 max=11.3
  chunk water            n=2 avg=8.9 max=9.8

Isolation probes:
  full               render=6.4 ms draws=274 tris=5.65M
  hide-grass         render=5.9 ms draws=250 tris=5.30M
  hide-vegetation    render=5.3 ms draws=157 tris=3.68M
  hide-vegetation-grass render=5.0 ms draws=130 tris=3.31M
  hide-environment   render=6.0 ms draws=260 tris=5.71M
  hide-settlement    render=5.6 ms draws=253 tris=5.61M
  hide-water         render=5.9 ms draws=264 tris=4.76M
  hide-terrain       render=5.8 ms draws=246 tris=3.41M
  hide-npc-fauna     render=5.4 ms draws=278 tris=5.72M
  no-shadows         render=5.8 ms draws=269 tris=5.45M
  no-ao              render=5.8 ms draws=268 tris=5.65M
  no-bloom           render=6.1 ms draws=258 tris=5.59M
  no-smaa            render=6.1 ms draws=272 tris=5.63M
  no-god-rays        render=6.4 ms draws=278 tris=5.72M
  no-film-grade      render=6.3 ms draws=278 tris=5.72M
  no-postprocessing  render=5.8 ms draws=251 tris=5.65M
  no-reflections     render=6.1 ms draws=220 tris=4.59M

Frame attribution:
  frame max: 439.4 ms
  largest labelled hitch: 11.3 ms
  unattributed: 428.1 ms

Long frames:
  threshold: 80 ms
  count: 7
  worst: 439.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1356/1356

Recommendation:
Largest frame (439.4 ms) is not explained by labelled hitches (largest 11.3 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (7.4 ms cumulative)
  agent updates: 0.8 ms/frame (1019.0 ms cumulative)
  livestock: 0.3 ms/frame (345.7 ms cumulative)
    loaded tick: 0.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.1 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 14.6
    unique animals/frame: 14.4
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 2.9
    dog guard scans: 2.9/frame (23.2 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 3.8/frame (0.0 candidates/frame)
    water samples: 7.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 7.4/frame, 0.00 ms/frame (worst call 0.10 ms, 543.7 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 14.4
    behaviour executions/frame: 3.9
    presentation executions/frame: 3.4
  rats: 0.1 ms/frame (107.2 ms cumulative)
  social: 0.0 ms/frame (5.5 ms cumulative)
  streaming: 0.1 ms/frame (139.4 ms cumulative)
  maintenance: 0.1 ms/frame (134.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (1764.9 ms cumulative)
  forest sampling: 0.1 ms/frame (104.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (25.9 ms cumulative)
    targeting: 0.0 ms/frame (18.6 ms cumulative)
    decision: 0.0 ms/frame (14.1 ms cumulative)
    behaviour: 0.7 ms/frame (1015.2 ms cumulative)
    life/presentation: 0.4 ms/frame (483.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 29.8
    decision passes/frame: 29.8
    high-priority agents/frame: 0.4
    expensive behaviour agents/frame: 14.9
    full-rate agents/frame: 9.7
    reduced-cadence agents/frame: 20.1
    behaviour executions/frame: 15.3
    presentation executions/frame: 14.2

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 23.0
    village scan candidates/frame: 275.7
    player perception checks/frame: 29.8

  nearest scans: 20.4/frame (27633 calls)
  nearest candidates checked: 112.2/frame (152138 total)
  herd leader scans: 0.1/frame (96 calls)
  herd candidates checked: 2.1/frame (2880 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.8/frame (123.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 65.3/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 65.3/frame, 0.10 ms/frame (worst call 1.00 ms, 3034.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 15
  empty builds (no instances): 72
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.12 ms
    max 0.30 ms

  allocation/setup:
    avg 0.05 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.01 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.20 ms
  callback total (build + lod + attach):
    avg 0.25 ms
    max 0.50 ms

  per chunk:
    instances avg/max 48325.5 / 87357
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 724882 / 0
    matrix instances bound: 724882
    instanced attributes created: 225
    shared material refs: 45
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 15/15
    instances: 271779 (max 32465)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 15/15
    instances: 90329 (max 10763)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 15/15
    instances: 362774 (max 44129)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 8/8
    instances: 637461 (max 184195)
    allocation/setup avg/max: 0.19 / 1.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=724882 filler=289574
Submitted instances: full=76794 filler=21989
Meshes submitted: 48
LOD submitted fraction: full=0.10594000126917208 filler=0.07593568483358312
Flowers: unavailable
Allocation bytes (estimated): 97387776
Upload bytes (observed): unavailable
Lifecycle: req=30 complete=30 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=21 invalidate=0
Finalization: observed completions=30

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1368
Shadow refresh frames: 597
Shadow skipped frames: 771

Mirror:
  calls avg: 154  tris avg: 889940
  info calls avg: 154  residual calls avg: 0
  environment                  calls=5 tris=3985
  items                        calls=1 tris=516
  other                        calls=32 tris=4839
  settlement:decor             calls=8 tris=19423
  settlement:fence             calls=1 tris=2187
  settlement:fireCampfire      calls=2 tris=189
  settlement:fireHouseExteriorLamp calls=5 tris=244
  settlement:fireHouseInteriorLamp calls=2 tris=183
  settlement:fireVillageTorch  calls=7 tris=508
  settlement:houseInteractive  calls=5 tris=561
  settlement:houseStatic       calls=12 tris=10783
  settlement:landmarkGarden    calls=2 tris=23563
  settlement:landmarkNoticeBoard calls=1 tris=13
  settlement:landmarkWellCentral calls=2 tris=689
  settlement:landmarkWellHousehold calls=2 tris=2161
  settlement:landmarkWellPasture calls=2 tris=599
  settlement:other             calls=3 tris=65
  settlement:storageBarrel     calls=3 tris=4044
  settlement:storageContainer  calls=10 tris=741
  settlement:storageGoods      calls=13 tris=2742
  settlement:storageHay        calls=0 tris=183
  settlement:storageTrough     calls=2 tris=494
  settlement:storageWoodHousehold calls=1 tris=1678
  settlement:storageWoodSettlementPrimary calls=0 tris=299
  settlement:workplace         calls=3 tris=1364
  terrain                      calls=6 tris=412093
  vegetation                   calls=24 tris=395964

Shadow (refresh only):
  calls avg: 297  tris avg: 2255728
  info calls avg: 297  residual calls avg: 0
  environment                  calls=10 tris=5475
  faunaFamily:cow              calls=2 tris=800
  faunaFamily:duck             calls=1 tris=26
  faunaFamily:fox              calls=0 tris=142
  faunaFamily:horse            calls=2 tris=508
  faunaFamily:rabbit           calls=1 tris=575
  faunaFamily:rat              calls=1 tris=1274
  faunaFamily:sheep            calls=0 tris=58
  faunaFamily:stag             calls=6 tris=3387
  items                        calls=4 tris=2046
  npcFamily:Knight_Cloth       calls=3 tris=4036
  npcFamily:Peasant            calls=3 tris=3632
  npcFamily:Peasant_Boots      calls=1 tris=941
  npcFamily:woodcutter         calls=1 tris=924
  other                        calls=51 tris=11222
  settlement:decor             calls=102 tris=204353
  settlement:fireHouseInteriorLamp calls=1 tris=120
  settlement:houseInteractive  calls=2 tris=360
  settlement:houseStatic       calls=15 tris=6783
  settlement:landmarkGarden    calls=1 tris=466
  settlement:landmarkNoticeBoard calls=1 tris=22
  settlement:landmarkWellCentral calls=3 tris=1089
  settlement:other             calls=4 tris=75
  settlement:storageContainer  calls=5 tris=517
  settlement:storageHay        calls=1 tris=270
  settlement:storageTrough     calls=1 tris=277
  settlement:storageWoodHousehold calls=1 tris=1087
  settlement:storageWoodSettlementPrimary calls=1 tris=431
  settlement:workplace         calls=2 tris=2039
  terrain                      calls=19 tris=1364972
  vegetation                   calls=54 tris=637820

Main:
  calls avg: 566  tris avg: 8728578
  info calls avg: 709  residual calls avg: 0
  environment                  calls=51 tris=13529
  faunaFamily:bear             calls=1 tris=662
  faunaFamily:chicken          calls=6 tris=804
  faunaFamily:cow              calls=0 tris=176
  faunaFamily:dog              calls=11 tris=3755
  faunaFamily:horse            calls=0 tris=52
  faunaFamily:rabbit           calls=0 tris=157
  faunaFamily:rat              calls=2 tris=3207
  faunaFamily:sheep            calls=4 tris=1233
  faunaFamily:stag             calls=0 tris=251
  faunaFamily:wolf             calls=2 tris=840
  grass                        calls=36 tris=5428697
  items                        calls=47 tris=5377
  npcFamily:Farmer             calls=7 tris=10922
  npcFamily:Knight_Cloth       calls=6 tris=7541
  npcFamily:Peasant            calls=36 tris=43936
  npcFamily:Peasant_Boots      calls=6 tris=7934
  npcFamily:blacksmith         calls=6 tris=9339
  other                        calls=84 tris=14687
  settlement:decor             calls=14 tris=34829
  settlement:fence             calls=3 tris=4430
  settlement:fireCampfire      calls=5 tris=377
  settlement:fireHouseExteriorLamp calls=10 tris=497
  settlement:fireHouseInteriorLamp calls=3 tris=375
  settlement:fireVillageTorch  calls=14 tris=1031
  settlement:houseInteractive  calls=10 tris=1145
  settlement:houseStatic       calls=22 tris=19832
  settlement:landmarkGarden    calls=5 tris=46671
  settlement:landmarkNoticeBoard calls=2 tris=28
  settlement:landmarkWellCentral calls=4 tris=1447
  settlement:landmarkWellHousehold calls=4 tris=4355
  settlement:landmarkWellPasture calls=3 tris=1214
  settlement:other             calls=7 tris=132
  settlement:storageBarrel     calls=5 tris=8156
  settlement:storageContainer  calls=21 tris=1499
  settlement:storageGoods      calls=27 tris=5615
  settlement:storageHay        calls=1 tris=362
  settlement:storageTrough     calls=3 tris=1001
  settlement:storageWoodHousehold calls=1 tris=3399
  settlement:storageWoodSettlementPrimary calls=1 tris=595
  settlement:workplace         calls=6 tris=2807
  terrain                      calls=24 tris=1741365
  vegetation                   calls=56 tris=823842
  water                        calls=7 tris=470824


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 7
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 7 total):

[LONG FRAME] 439.4ms
simulate         8.3ms
render         430.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.6ms
STREAMING        1.0ms
NPC              1.1ms
FAUNA            2.1ms
PHYSICS          0.1ms
RENDER         425.4ms
OTHER            4.1ms

streaming / stages:
  contentFinalize              1.0ms
  chunkFinalize                1.0ms
  chunkUpdate                  1.0ms

Long frame #2:

[LONG FRAME] 282.9ms
simulate         4.9ms
render         277.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        1.6ms
NPC              0.9ms
FAUNA            1.0ms
PHYSICS          0.0ms
RENDER         277.1ms
OTHER            2.2ms

streaming / stages:
  contentFinalize              1.6ms
  chunkFinalize                1.6ms
  chunkUpdate                  1.6ms

Long frame #3:

[LONG FRAME] 278.1ms
simulate        50.6ms
render         226.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          215.0ms
STREAMING       42.6ms
NPC              2.8ms
FAUNA            1.8ms
PHYSICS          0.1ms
RENDER          11.6ms
OTHER            4.2ms

streaming / stages:
  chunkUpdate                  42.6ms
  riverTileBuild               36.6ms
  terrainPrepare               1.4ms
  riverChannelSegmentsNear     0.3ms

Long frame #4:

[LONG FRAME] 229.3ms
simulate         2.9ms
render         225.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          216.2ms
STREAMING        0.0ms
NPC              0.9ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER           9.5ms
OTHER            1.7ms

Long frame #5:

[LONG FRAME] 195.7ms
simulate         4.2ms
render         190.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING       17.6ms
NPC              1.2ms
FAUNA            1.0ms
PHYSICS          0.0ms
RENDER         190.9ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              10.6ms
  waterFinalize                6.1ms
  contentFinalize              0.8ms
  chunkFinalize                0.8ms
  chunkUpdate                  0.8ms
  riverFinalize                0.1ms

---

[Seedvale Program Census]

Programs created: 129
Program count: final=128 max=128

By frame:
  frame 0   +75 programs   <== largest transition
  frame 49   +1 program
  frame 416   +1 program
  frame 455   +2 programs
  frame 456   +1 program
  frame 546   +1 program
  frame 550   +1 program
  frame 559   +1 program
  frame 694   +1 program
  frame 984   +1 program
  frame 1103   +1 program
  frame 2151   +18 programs
  frame 2198   +3 programs
  frame 2434   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6ea1842f-f024-4d89-a049-4aa042b4c38f (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e441b9c0-ad55-4c8a-9869-96be009a6ddb
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=5c71a619-1c7b-4ba8-87b8-8935a83c57fb
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3acff323-c5bf-4d28-970d-38a24fa1685a
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f4f5767f-5c14-4140-b14d-c9c6c8b2e6eb
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=762a7e2d-9023-404e-a77b-33e5a06ac0df
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=038078c1-052c-431e-b038-1e57d8b22132
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=52bff394-700b-40c8-a996-93d9dca4e349
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5fc0968c-b7f3-4e08-bcd9-0bac143ae42f
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d4cb8831-82d4-4c81-8c0e-426a81a29729 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=317f298f-ad76-4313-b168-d9accb96ae45
  #13 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b1bebaa2-8a57-4aa3-bf96-f8e82eea2832 (None)
  #14 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3e7608c2-91d9-4f7f-8bd8-a79cc96d7e56 (Flowers)
  #15 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1ea79b59-f642-42fa-8641-8d1457270795 (Green)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5f97bba6-ac7d-48d9-b7a7-adc2ab71f990 (Stone)
  #17 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f5af5c32-24e6-46ec-9bff-26b9b7a39a2b (Pink)
  #18 type=MeshStandardMaterial name='Wood_Light' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ba32d23a-e103-420a-8bdb-0a6e3e7cf26e (Material.001)
  #19 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=93962378-755e-43a8-99c3-26766bc9b382 (MI_WoodTrim)
  #20 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #21 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=eb55626d-5fe7-4667-bc23-aa43ae58582c (MI_WindowGlass)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4fb5ec91-de9c-452e-af0c-d2f42d178e54 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c7f27010-bac1-46ae-a473-81baedc41ab9 (MI_WindowGlass)
  #25 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #26 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #27 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=93751015-948a-4118-9335-15feb5565a96 (Main)
  #28 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=569c33a3-3613-4df9-aad9-e0226fd0f944 (lambert2SG)
  #29 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b31b785d-2507-4ec8-bd55-b475dd439a15 (Material #55)
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0590f488-a8f7-4e1d-b563-2e95374ab94b (Main)
  #31 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=297caa24-02a7-4af2-941d-18e556c47170 (MapleTree_Leaves)
  #32 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4466eea4-3931-4c38-993a-b2f56d2d8d17 (Green)
  #33 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=ef523b67-54c7-4908-ab3c-d238dba225e3 (MapleTree_Bark)
  #34 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5986c73c-610d-4b32-a173-56d24dd03bd0 (MI_Peasant)
  #35 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=133c6d5a-0b8c-4771-92a7-0211ecf38395 (MI_Hair_1)
  #36 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fc1b012c-3688-4287-8375-e04d41ef9dea (MI_Hair_1)
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d80c6bfd-1319-4884-800d-a1197c12b4e7 (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=0f8e002f-6c06-4cb5-90de-f58ddd904d86
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=072eff1a-aeb9-4ded-94c5-b9d71c242083 (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3834f604-0633-4722-adf0-b91952c93472 (DarkGreen)
  #51 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1b17cfde-1486-4fb9-aac6-765d605c59da (Pond_Pack_MAT)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=48e5dbc3-bd00-49d0-b0bc-7ee7d6d06177 (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5f4022ad-d074-440a-98a8-c22d7ee2689a (MI_Eyes)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3ce71d74-9884-4e6b-861f-b9198841b1f1 (MI_Hair_1)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1197f7ec-2c92-4b96-a6bc-9c33c1a712a0 (MI_Knight)
  #56 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=712567b2-7066-4039-bdb8-99bba1552fcb (PathRocks)
  #57 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #72 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #73 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #74 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #25=df7c703d, #26=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #25=236b3b0b, #26=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #25=(unset), #26=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #25=(unknown), #26=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=6db98a06, #14=e4cbf8ca, #15=c0d790d1, #16=a9733c9d, #17=d3fd7a87, #18=f3a1039e, #19=c5e73b05, #20=13a74ec7, #21=9dcf1cb4, #22=12873951, #23=fc941d05, #24=e551c572, #27=54e03756, #28=7bb77142, #30=fd8301ed, #31=d9d07622, #32=190d3a9c, #33=9dbe8ee7, #34=842fe1df, #35=ac268392, #36=1c179521, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=c3bc6325, #52=20daccfa, #53=1dcbc6ff, #54=cde317ee, #55=1d0412b3, #56=b643916d
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=efed8e98, #14=135696d3, #15=a81023c3, #16=bd723c8a, #17=2eae9a54, #18=c7daf23, #19=d4c95125, #20=3ab4c629, #21=2d1aa4a, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #27=d391c52, #28=87728b15, #30=2f2885d5, #31=135696d3, #32=633146b4, #33=8dba9dd, #34=34995f15, #35=25a41317, #36=71f22dc6, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=ded4be89, #52=a8862f4a, #53=1a1c0d8, #54=512afd6f, #55=512afd6f, #56=754b87bd
    bucket differs: #2=terrain, #7=other, #9=other, #13=environment, #14=vegetation, #15=vegetation, #16=environment, #17=vegetation, #18=fauna, #19=settlement, #20=(unknown), #21=settlement, #22=settlement, #23=(unknown), #24=settlement, #27=fauna, #28=fauna, #30=fauna, #31=settlement, #32=settlement, #33=settlement, #34=other, #35=other, #36=other, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=other, #54=npc, #55=npc, #56=settlement
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=(unset), #21=, #22=, #23=(unset), #24=, #27=, #28=, #30=, #31=, #32=, #33=, #34=, #35=, #36=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0.45, #15=0, #16=0, #17=0, #18=0, #19=0, #20=(unknown), #21=0, #22=0, #23=(unknown), #24=0, #27=0, #28=0, #30=0, #31=0.45, #32=0, #33=0, #34=0, #35=0, #36=0, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=(unknown), #21=true, #22=true, #23=(unknown), #24=true, #27=true, #28=true, #30=true, #31=true, #32=true, #33=true, #34=true, #35=true, #36=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=true, #30=false, #31=true, #32=false, #33=true, #34=true, #35=true, #36=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=true, #20=(unknown), #21=false, #22=true, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=true, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=true, #22=false, #23=(unknown), #24=true, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=true, #35=true, #36=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=(unknown), #21=false, #22=false, #23=(unknown), #24=false, #27=false, #28=false, #30=false, #31=false, #32=false, #33=false, #34=false, #35=false, #36=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
  MeshBasicMaterial (3 programs):
    vertexShaderHash differs: #8=5efaf074, #11=d459e49b, #12=b6911298
    fragmentShaderHash differs: #8=5cf0ca9a, #11=a8a9bac3, #12=73a25d1e
    bucket differs: #8=other, #11=(unknown), #12=other
    flag alphaTest differs: #8=0, #11=(unknown), #12=0
    flag envMap differs: #8=false, #11=(unknown), #12=false
    flag fog differs: #8=true, #11=(unknown), #12=false
    flag map differs: #8=true, #11=(unknown), #12=true
    flag normalMap differs: #8=false, #11=(unknown), #12=false
    flag transparent differs: #8=true, #11=(unknown), #12=true
    flag vertexColors differs: #8=false, #11=(unknown), #12=false
    flag wireframe differs: #8=false, #11=(unknown), #12=false
  MeshPhysicalMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (10 programs):
    vertexShaderHash differs: #37=59ed5d71, #38=b69ba143, #39=2e7a6fcb, #40=585a1ea4, #41=c203b19a, #42=c203b19a, #43=585a1ea4, #44=263c45d6, #45=2efa42a8, #46=e4717b03
    fragmentShaderHash differs: #37=d729897e, #38=d729897e, #39=758a4164, #40=41e40a66, #41=41e40a66, #42=a9dd0dee, #43=a9dd0dee, #44=d729897e, #45=41e40a66, #46=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2151 (+18):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: 5c71a619-1c7b-4ba8-87b8-8935a83c57fb
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: 6d571cc9-4ae3-40db-a7af-69cbe699dcd2
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 0141c44f-ac57-4aaf-8751-d3de646f6556
    object: Mesh 'mesh_0_1'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 780f6dcc
    fragmentShaderHash: dbb99308
  Program #89
    material: MeshStandardMaterial 'Green'
    materialUuid: 4b223363-dc42-49a0-9901-b656519a9805
    object: Mesh 'settlement-bushes-6:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: d0069e25
    fragmentShaderHash: c94ff2d5
  Program #90
    material: MeshStandardMaterial 'Berry'
    materialUuid: b76aca89-ae03-4986-86cc-70d03b5ce511
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: ef523b67-54c7-4908-ab3c-d238dba225e3
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3e7608c2-91d9-4f7f-8bd8-a79cc96d7e56
    object: Mesh 'mesh_0'
    asset: /models/nature/flower_clump_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 6d95624c
    fragmentShaderHash: 5a74547b
  Program #93
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: bbe168bc-16a5-4a54-81cc-217afa4c3ea7
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: aa606f78-3ed7-473b-8f15-c1dc0dfc5b40
    object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8392193,8519683,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 3858a100
    fragmentShaderHash: 4abfdd1b
  Program #95
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: d80c6bfd-1319-4884-800d-a1197c12b4e7
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #96
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 4fb5ec91-de9c-452e-af0c-d2f42d178e54
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #97
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 48e5dbc3-bd00-49d0-b0bc-7ee7d6d06177
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #98
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 5f4022ad-d074-440a-98a8-c22d7ee2689a
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #99
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 5986c73c-610d-4b32-a173-56d24dd03bd0
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 133c6d5a-0b8c-4771-92a7-0211ecf38395
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #101
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: fc1b012c-3688-4287-8375-e04d41ef9dea
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #102
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #103
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: c7f27010-bac1-46ae-a473-81baedc41ab9
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 2434 (+22):
  Program #107
    material: ShaderMaterial 'SkyShader'
    materialUuid: 6ea1842f-f024-4d89-a049-4aa042b4c38f
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #108
    material: ShaderMaterial ''
    materialUuid: 762a7e2d-9023-404e-a77b-33e5a06ac0df
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #109
    material: MeshStandardMaterial ''
    materialUuid: 5c71a619-1c7b-4ba8-87b8-8935a83c57fb
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #110
    material: MeshStandardMaterial 'Wood'
    materialUuid: 6d571cc9-4ae3-40db-a7af-69cbe699dcd2
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: 0141c44f-ac57-4aaf-8751-d3de646f6556
    object: Mesh 'mesh_0_1'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 80917d5e
    fragmentShaderHash: 3414bdd9
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: 4b223363-dc42-49a0-9901-b656519a9805
    object: Mesh 'settlement-bushes-6:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: c0d790d1
    fragmentShaderHash: 3aaee6d6
  Program #113
    material: MeshStandardMaterial 'Berry'
    materialUuid: b76aca89-ae03-4986-86cc-70d03b5ce511
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #114
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: ef523b67-54c7-4908-ab3c-d238dba225e3
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #115
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3e7608c2-91d9-4f7f-8bd8-a79cc96d7e56
    object: Mesh 'mesh_0'
    asset: /models/nature/flower_clump_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 5641a2de
    fragmentShaderHash: ac9d73ac
  Program #116
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: bbe168bc-16a5-4a54-81cc-217afa4c3ea7
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #117
    material: MeshStandardMaterial 'Leaves'
    materialUuid: aa606f78-3ed7-473b-8f15-c1dc0dfc5b40
    object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8392193,8520707,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 984eda2a
    fragmentShaderHash: d65a968c
  Program #118
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: d80c6bfd-1319-4884-800d-a1197c12b4e7
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #119
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 48e5dbc3-bd00-49d0-b0bc-7ee7d6d06177
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #120
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 5f4022ad-d074-440a-98a8-c22d7ee2689a
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #121
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 5986c73c-610d-4b32-a173-56d24dd03bd0
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #122
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 133c6d5a-0b8c-4771-92a7-0211ecf38395
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: fc1b012c-3688-4287-8375-e04d41ef9dea
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #124
    material: ShaderMaterial ''
    materialUuid: 038078c1-052c-431e-b038-1e57d8b22132
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #125
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #126
    material: MeshBasicMaterial ''
    materialUuid: 5fc0968c-b7f3-4e08-bcd9-0bac143ae42f
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #127
    material: ShaderMaterial ''
    materialUuid: 7a8a6f55-3cf8-41da-83c5-20c3438f7d46
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #128
    material: ShaderMaterial ''
    materialUuid: 88e1d122-93b2-4f19-ab88-7bb220cd35c4
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7

---

[Seedvale Program Compile Cost]

No isolated per-program GPU compile/link timer exists in the public Three.js/WebGL API without patching internals (out of scope here). Each number below is the wall-clock duration of the renderer.render() call (mirror-render/postprocess-render) that first-used the program, reported ONLY when that program was the single new program created during that specific call — an upper bound that also includes the rest of that call's render cost, not an isolated compile/link timer.
Excluded — no reliable per-program timing: 120 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 49
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 17.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 416
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 25.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 456
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 26.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 546
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 213.7 ms  (upper bound — whole mirror-render call, see note above)

Frame 550
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 16.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 559
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 188.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 694
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 16.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 984
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 214.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 1103
  #85
      material: MeshStandardMaterial ''
      object: Mesh ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 273.5 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 992.2 ms
  programs >1 ms: 9
  max: 273.5 ms (#85)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.4 ms  p95=8.2 ms  max=9.8 ms  Δavg vs baseline=—
  hide-grass           avg=5.9 ms  p95=6.9 ms  max=8.2 ms  Δavg vs baseline=-0.5 ms (-7%)
  hide-vegetation      avg=5.3 ms  p95=6.1 ms  max=6.5 ms  Δavg vs baseline=-1.1 ms (-17%)
  no vegetation/grass  avg=5.0 ms  p95=5.8 ms  max=6.1 ms  Δavg vs baseline=-1.4 ms (-22%)
  hide-environment     avg=6.0 ms  p95=7.0 ms  max=7.2 ms  Δavg vs baseline=-0.4 ms (-7%)
  hide-settlement      avg=5.6 ms  p95=7.1 ms  max=7.7 ms  Δavg vs baseline=-0.8 ms (-13%)
  no water             avg=5.9 ms  p95=6.8 ms  max=7.4 ms  Δavg vs baseline=-0.5 ms (-8%)
  hide-terrain         avg=5.8 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=-0.6 ms (-9%)
  hide-npc-fauna       avg=5.4 ms  p95=6.3 ms  max=7.6 ms  Δavg vs baseline=-1.0 ms (-15%)
  no-shadows           avg=5.8 ms  p95=7.1 ms  max=8.0 ms  Δavg vs baseline=-0.6 ms (-9%)
  no-ao                avg=5.8 ms  p95=6.7 ms  max=7.1 ms  Δavg vs baseline=-0.6 ms (-10%)
  no-bloom             avg=6.1 ms  p95=7.1 ms  max=7.5 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-smaa              avg=6.1 ms  p95=7.2 ms  max=7.3 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-god-rays          avg=6.4 ms  p95=8.6 ms  max=9.0 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-film-grade        avg=6.3 ms  p95=7.3 ms  max=7.7 ms  Δavg vs baseline=-0.1 ms (-2%)
  no postprocessing    avg=5.8 ms  p95=6.8 ms  max=7.0 ms  Δavg vs baseline=-0.6 ms (-9%)
  no mirrors           avg=6.1 ms  p95=7.4 ms  max=8.4 ms  Δavg vs baseline=-0.3 ms (-4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=11.1 ms  p95=13.2 ms  max=14.2 ms
  CPU wall      avg=6.4 ms  p95=8.2 ms  max=9.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
