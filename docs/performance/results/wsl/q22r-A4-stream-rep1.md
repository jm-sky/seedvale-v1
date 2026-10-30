# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T21:20:54.116Z
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
Duration: 90s
Frames: 1582
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 448d0534a9372f81e91c0790129e704428a92509
  runId: 2026-10-30T21-18-51-829Z-d2zs4i
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
  camera: pos=(1290.9, 8, -0.3)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=90s
  populationGate: stable waited=5070ms npc=24
  gpuTimer: available=true resolved=true samples=1584 span=postprocess+labels

FPS:
  avg: 30.9
  min: 0
  p1: 6

Frame time (wall-clock):
  avg: 32.3 ms
  p50: 15.3 ms
  p95: 45.9 ms
  p99: 166.8 ms
  max: 7686.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.3 p95=30.9 p99=61.5 max=7678 n=1582
  render: p50=9.1 p95=18.7 p99=71.8 max=1164.1 n=1582
  frame: p50=15.3 p95=45.9 p99=166.8 max=7686.9 n=1582

Rendering (combined renderer.info):
  draw calls: 397 avg / 2104 max
  triangles: 6.83M avg
  mirror draws: 67 avg
  geometries: 764
  textures: 405

Pass submissions (actual):
  reliability: observed
  frames: 1587 shadowRefresh=669 shadowSkipped=918
  mirror calls avg: 67
  shadow calls avg: 141
  main calls avg: 257

Scene (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  grass            draws=56 tris=9.26M meshes=56 inst=676088
  vegetation       draws=170 tris=835.0k meshes=170 inst=622
  environment      draws=139 tris=21.7k meshes=139 inst=139
  settlement       draws=753 tris=882.3k meshes=753 inst=1866
  water            draws=59 tris=4.28M meshes=59 inst=59
  npc              draws=262 tris=335.5k meshes=262 inst=262
  fauna            draws=269 tris=104.0k meshes=269 inst=269
  items            draws=243 tris=19.8k meshes=243 inst=243
  other            draws=473 tris=28.7k meshes=473 inst=475

Shadow casters (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  vegetation       draws=146 tris=769.9k meshes=146 inst=568
  environment      draws=138 tris=21.7k meshes=138 inst=138
  settlement       draws=481 tris=596.5k meshes=481 inst=1477
  items            draws=22 tris=14.9k meshes=22 inst=22
  other            draws=96 tris=14.6k meshes=96 inst=96

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=91 tris=156.0k meshes=91 inst=868
  houseInteractive draws=32 tris=5.0k meshes=32 inst=32
  fence            draws=4 tris=9.7k meshes=4 inst=48
  storageWoodSettlementPrimary draws=3 tris=2.7k meshes=3 inst=3
  storageWoodSettlementSecondary draws=4 tris=11.3k meshes=4 inst=4
  storageWoodHousehold draws=4 tris=13.9k meshes=4 inst=16
  storageContainer draws=18 tris=5.2k meshes=18 inst=70
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=10 tris=3.6k meshes=10 inst=36
  workplace        draws=12 tris=4.6k meshes=12 inst=12
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=10 tris=3.7k meshes=10 inst=10
  landmarkGarden   draws=3 tris=4.8k meshes=3 inst=6
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=16 tris=1.7k meshes=16 inst=16
  fireCampfire     draws=24 tris=352 meshes=24 inst=24
  decor            draws=195 tris=365.6k meshes=195 inst=277
  other            draws=31 tris=1.3k meshes=31 inst=31

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=13 draws=122 tris=145.8k skinned=122/122
      Farmer           agents=4 draws=35 tris=51.5k skinned=35/35
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Peasant_Boots    agents=3 draws=28 tris=37.0k skinned=28/28
      Herbalist        agents=2 draws=21 tris=26.7k skinned=21/21
      woodcutter       agents=2 draws=14 tris=21.9k skinned=14/14
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
    by distance band:
      far  agents=28 camera-relevant=0 draws=262 tris=335.5k
  Fauna:
    by family (sorted by draws):
      chicken          agents=8 draws=40 tris=5.2k skinned=0/40
      dog              agents=7 draws=37 tris=13.5k skinned=37/37
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      sheep            agents=13 draws=26 tris=7.9k skinned=26/26
      horse            agents=3 draws=24 tris=6.5k skinned=24/24
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      cow              agents=2 draws=14 tris=4.9k skinned=14/14
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      far  agents=67 camera-relevant=0 draws=269 tris=104.0k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=68 composed=68 multiplied=68 skinned=0
  grass                    nodes=72 composed=72 multiplied=72 skinned=0
  vegetation               nodes=198 composed=198 multiplied=198 skinned=0
  environment              nodes=269 composed=269 multiplied=269 skinned=0
  settlement               nodes=1496 composed=1496 multiplied=1496 skinned=0
  water                    nodes=59 composed=59 multiplied=59 skinned=0
  npc                      nodes=2191 composed=2191 multiplied=2191 skinned=262
  fauna                    nodes=2812 composed=2812 multiplied=2812 skinned=219
  items                    nodes=363 composed=363 multiplied=363 skinned=0
  other                    nodes=725 composed=708 multiplied=725 skinned=9
  top scene children:
    fauna ×67                nodes=2812 composed=2812 multiplied=2812 skinned=219
    npc ×28                  nodes=2191 composed=2191 multiplied=2191 skinned=262
    settlement ×3            nodes=1496 composed=1496 multiplied=1496 skinned=0
    Group ×85                nodes=552 composed=552 multiplied=552 skinned=9
    chunk-items ×28          nodes=360 composed=360 multiplied=360 skinned=0
    chunk-environmen ×3      nodes=231 composed=231 multiplied=231 skinned=0
    chunk-grass ×16          nodes=72 composed=72 multiplied=72 skinned=0
    chunk ×68                nodes=68 composed=68 multiplied=68 skinned=0
    chunk-water ×58          nodes=58 composed=58 multiplied=58 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-river ×45          nodes=45 composed=45 multiplied=45 skinned=0
    Object3D ×29             nodes=29 composed=29 multiplied=29 skinned=0

Systems:
  WATER          1.8 ms
  STREAMING      2.1 ms
  NPC            13.4 ms
  FAUNA          2.3 ms
  PHYSICS        0.1 ms
  RENDER         10.7 ms

Detected bottlenecks:
  1. NPC
  2. RENDER
  3. FAUNA

Critical spikes:
  WATER: 13
  STREAMING: 9

Hitches (>= 8 ms): total=22
  chunk mesh             n=9 avg=11.3 max=22.2
  chunk water            n=12 avg=11.0 max=19.4
  chunk river            n=1 avg=8.3 max=8.3

Isolation probes:
  full               render=9.1 ms draws=323 tris=9.15M
  hide-grass         render=9.1 ms draws=316 tris=4.08M
  hide-vegetation    render=8.3 ms draws=276 tris=8.95M
  hide-vegetation-grass render=8.2 ms draws=254 tris=3.81M
  hide-environment   render=8.7 ms draws=316 tris=9.10M
  hide-settlement    render=8.3 ms draws=309 tris=9.16M
  hide-water         render=8.7 ms draws=309 tris=7.55M
  hide-terrain       render=8.8 ms draws=303 tris=7.00M
  hide-npc-fauna     render=7.2 ms draws=323 tris=9.17M
  no-shadows         render=8.4 ms draws=310 tris=8.97M
  no-ao              render=8.6 ms draws=319 tris=9.11M
  no-bloom           render=8.9 ms draws=319 tris=9.18M
  no-smaa            render=9.0 ms draws=326 tris=9.15M
  no-god-rays        render=9.3 ms draws=331 tris=9.18M
  no-film-grade      render=9.0 ms draws=332 tris=9.18M
  no-postprocessing  render=8.3 ms draws=301 tris=9.11M
  no-reflections     render=8.9 ms draws=272 tris=8.66M

Frame attribution:
  frame max: 7686.9 ms
  largest labelled hitch: 22.2 ms
  unattributed: 7664.7 ms

Long frames:
  threshold: 80 ms
  count: 29
  worst: 7686.9 ms

Raw sidecar:
  sampling=full factor=1 exported=1582/1582

Recommendation:
Largest frame (7686.9 ms) is not explained by labelled hitches (largest 22.2 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 28
  Fauna (agents): 30

NPC:
  total: 13.4 ms/frame
  crowd pass: 0.0 ms/frame (11.4 ms cumulative)
  agent updates: 1.1 ms/frame (1680.8 ms cumulative)
  livestock: 0.8 ms/frame (1270.4 ms cumulative)
    loaded tick: 0.8 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.8 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.5 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 23.8
    unique animals/frame: 22.0
    duplicate updates/frame: 1.8
    detached animals/frame: 0.0
    dog updates/frame: 4.3
    dog guard scans: 4.3/frame (34.8 predator candidates/frame)
    pest scans: 1.7/frame (1.7 rat candidates/frame)
    nearest scans: 9.4/frame (0.0 candidates/frame)
    water samples: 19.3/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 19.3/frame, 0.00 ms/frame (worst call 0.20 ms, 2325.6 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 23.7
    behaviour executions/frame: 9.4
    presentation executions/frame: 8.4
  rats: 0.1 ms/frame (174.0 ms cumulative)
  social: 0.0 ms/frame (7.8 ms cumulative)
  streaming: 11.2 ms/frame (17758.3 ms cumulative)
  maintenance: 0.1 ms/frame (186.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.3 ms/frame
  agent updates: 2.3 ms/frame (3614.3 ms cumulative)
  forest sampling: 0.1 ms/frame (148.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (34.8 ms cumulative)
    targeting: 0.0 ms/frame (22.0 ms cumulative)
    decision: 0.0 ms/frame (18.6 ms cumulative)
    behaviour: 1.7 ms/frame (2694.7 ms cumulative)
    life/presentation: 0.3 ms/frame (516.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.1
    sensing passes/frame: 28.9
    decision passes/frame: 28.9
    high-priority agents/frame: 0.2
    expensive behaviour agents/frame: 16.4
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 20.8
    behaviour executions/frame: 16.6
    presentation executions/frame: 15.4

  sensing/cache:
    forest samples/frame: 30.1
    fire scan candidates/frame: 29.6
    village scan candidates/frame: 297.2
    player perception checks/frame: 28.9

  nearest scans: 23.3/frame (36884 calls)
  nearest candidates checked: 194.4/frame (307577 total)
  herd leader scans: 0.2/frame (249 calls)
  herd candidates checked: 4.7/frame (7470 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.2/frame (141.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 84.2/frame, 0.10 ms/frame (worst call 1.10 ms)
    collider queries: 84.2/frame, 0.10 ms/frame (worst call 1.00 ms, 5483.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 43
  empty builds (no instances): 350
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.16 ms
    max 1.10 ms

  allocation/setup:
    avg 0.11 ms
    max 1.00 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.05 ms
    max 0.50 ms
  scene attach (`scene.add`):
    avg 0.05 ms
    max 0.50 ms
  callback total (build + lod + attach):
    avg 0.38 ms
    max 1.90 ms

  per chunk:
    instances avg/max 4947.7 / 63902
    meshes avg/max 3.05 / 4
    geometries avg/max 3.05 / 4
    geometries after lod apply avg/max 6.05 / 7
    instances full/filler: 163134 / 49615
    matrix instances bound: 212749
    instanced attributes created: 655
    shared material refs: 131
  heap delta avg/max: 87.9 / 3780.1 KB

  by species bucket:
  tri:
    buckets/meshes: 63/63
    instances: 337819 (max 32465)
    allocation/setup avg/max: 0.06 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  grain:
    buckets/meshes: 63/63
    instances: 112369 (max 10763)
    allocation/setup avg/max: 0.03 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 63/63
    instances: 448838 (max 44129)
    allocation/setup avg/max: 0.02 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 22/22
    instances: 1612895 (max 184195)
    allocation/setup avg/max: 0.10 / 0.90 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 16
Resident instances: full=370069 filler=713935
Submitted instances: full=307382 filler=368706
Meshes submitted: 56
LOD submitted fraction: full=0.8306072651316376 filler=0.5164419730087473
Flowers: unavailable
Allocation bytes (estimated): 104064384
Upload bytes (observed): unavailable
Lifecycle: req=100 complete=100 discard(unload=0,oor=0) cancel=0 streamIn=43 streamOut=48 invalidate=0
Finalization: observed completions=100

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1587
Shadow refresh frames: 669
Shadow skipped frames: 918

Mirror:
  calls avg: 67  tris avg: 698036
  info calls avg: 67  residual calls avg: 0
  switches avg: material=34.8 program=21.6  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.6 skeletons first used=3.6
  environment                  calls=3 tris=1989
  items                        calls=0 tris=166
  other                        calls=13 tris=4961
  settlement:decor             calls=1 tris=1764
  settlement:fence             calls=0 tris=711
  settlement:fireCampfire      calls=1 tris=58
  settlement:fireHouseExteriorLamp calls=2 tris=79
  settlement:fireHouseInteriorLamp calls=1 tris=59
  settlement:fireVillageTorch  calls=2 tris=154
  settlement:houseInteractive  calls=2 tris=181
  settlement:houseStatic       calls=5 tris=4454
  settlement:landmarkGarden    calls=1 tris=7521
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=1 tris=230
  settlement:landmarkWellHousehold calls=1 tris=616
  settlement:landmarkWellPasture calls=1 tris=205
  settlement:other             calls=1 tris=21
  settlement:storageBarrel     calls=1 tris=1694
  settlement:storageContainer  calls=2 tris=337
  settlement:storageGoods      calls=4 tris=881
  settlement:storageHay        calls=0 tris=58
  settlement:storageTrough     calls=1 tris=216
  settlement:storageWoodHousehold calls=0 tris=762
  settlement:storageWoodSettlementPrimary calls=0 tris=97
  settlement:workplace         calls=1 tris=391
  terrain                      calls=5 tris=399837
  vegetation                   calls=20 tris=270741

Shadow (refresh only):
  calls avg: 141  tris avg: 2080937
  info calls avg: 141  residual calls avg: 0
  switches avg: material=65.5 program=63.8  actor: calls=4.1 material=0 program=0.8
  skinning avg: skinned calls=8.6 skeletons first used=4.3
  environment                  calls=9 tris=4952
  faunaFamily:chicken          calls=0 tris=30
  faunaFamily:cow              calls=0 tris=88
  faunaFamily:dog              calls=0 tris=72
  faunaFamily:horse            calls=0 tris=75
  faunaFamily:rabbit           calls=0 tris=81
  faunaFamily:rat              calls=0 tris=60
  faunaFamily:rooster          calls=0 tris=23
  faunaFamily:sheep            calls=0 tris=60
  faunaFamily:stag             calls=1 tris=741
  faunaFamily:wolf             calls=0 tris=44
  items                        calls=3 tris=1482
  npcFamily:Farmer             calls=0 tris=410
  npcFamily:Knight_Cloth       calls=0 tris=364
  npcFamily:Peasant            calls=0 tris=578
  npcFamily:Peasant_Boots      calls=0 tris=164
  npcFamily:Ranger_NoHood      calls=0 tris=204
  npcFamily:woodcutter         calls=0 tris=145
  other                        calls=32 tris=8964
  settlement:decor             calls=17 tris=33782
  settlement:fence             calls=0 tris=659
  settlement:fireCampfire      calls=0 tris=4
  settlement:fireHouseInteriorLamp calls=1 tris=71
  settlement:houseInteractive  calls=1 tris=214
  settlement:houseStatic       calls=6 tris=8997
  settlement:landmarkGarden    calls=0 tris=194
  settlement:landmarkNoticeBoard calls=0 tris=5
  settlement:landmarkWellCentral calls=1 tris=244
  settlement:landmarkWellPasture calls=1 tris=213
  settlement:other             calls=1 tris=27
  settlement:storageContainer  calls=1 tris=416
  settlement:storageHay        calls=0 tris=58
  settlement:storageTrough     calls=1 tris=297
  settlement:storageWoodHousehold calls=0 tris=1090
  settlement:storageWoodSettlementPrimary calls=0 tris=99
  settlement:storageWoodSettlementSecondary calls=0 tris=236
  settlement:workplace         calls=0 tris=311
  terrain                      calls=19 tris=1372790
  vegetation                   calls=44 tris=642692

Main:
  calls avg: 257  tris avg: 5268999
  info calls avg: 330  residual calls avg: 0
  switches avg: material=138.9 program=64.5  actor: calls=30.1 material=22.5 program=11.4
  skinning avg: skinned calls=37.5 skeletons first used=9.4
  environment                  calls=18 tris=5611
  faunaFamily:bear             calls=0 tris=147
  faunaFamily:chicken          calls=2 tris=197
  faunaFamily:cow              calls=0 tris=106
  faunaFamily:dog              calls=3 tris=1078
  faunaFamily:donkey           calls=1 tris=159
  faunaFamily:horse            calls=0 tris=23
  faunaFamily:rabbit           calls=0 tris=18
  faunaFamily:rat              calls=0 tris=916
  faunaFamily:rooster          calls=0 tris=11
  faunaFamily:sheep            calls=2 tris=528
  faunaFamily:stag             calls=0 tris=116
  faunaFamily:wolf             calls=0 tris=90
  grass                        calls=17 tris=1950256
  items                        calls=22 tris=2122
  npcFamily:Farmer             calls=2 tris=3400
  npcFamily:Herbalist          calls=0 tris=562
  npcFamily:Knight_Cloth       calls=2 tris=2077
  npcFamily:Peasant            calls=14 tris=16917
  npcFamily:Peasant_Boots      calls=1 tris=1933
  npcFamily:Wizard             calls=0 tris=475
  npcFamily:blacksmith         calls=2 tris=2294
  other                        calls=38 tris=13719
  settlement:decor             calls=1 tris=3293
  settlement:fence             calls=1 tris=1381
  settlement:fireCampfire      calls=1 tris=115
  settlement:fireHouseExteriorLamp calls=3 tris=154
  settlement:fireHouseInteriorLamp calls=1 tris=116
  settlement:fireVillageTorch  calls=4 tris=306
  settlement:houseInteractive  calls=3 tris=355
  settlement:houseStatic       calls=7 tris=6143
  settlement:landmarkGarden    calls=1 tris=14743
  settlement:landmarkNoticeBoard calls=0 tris=9
  settlement:landmarkWellCentral calls=1 tris=462
  settlement:landmarkWellHousehold calls=1 tris=1224
  settlement:landmarkWellPasture calls=1 tris=403
  settlement:other             calls=2 tris=42
  settlement:storageBarrel     calls=2 tris=3302
  settlement:storageContainer  calls=3 tris=617
  settlement:storageGoods      calls=9 tris=1738
  settlement:storageHay        calls=0 tris=113
  settlement:storageTrough     calls=1 tris=422
  settlement:storageWoodHousehold calls=0 tris=1484
  settlement:storageWoodSettlementPrimary calls=0 tris=189
  settlement:workplace         calls=2 tris=780
  terrain                      calls=21 tris=1541653
  vegetation                   calls=48 tris=548687
  water                        calls=16 tris=1138827


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 29
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 29 total):

[LONG FRAME] 7686.9ms
simulate      7678.0ms
render           8.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC           7672.1ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER           8.5ms
OTHER            5.0ms

Long frame #2:

[LONG FRAME] 5389.2ms
simulate      5381.5ms
render           7.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            1.9ms
STREAMING        0.1ms
NPC           5376.6ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER           5.6ms
OTHER            4.1ms

streaming / stages:
  riverTileBuild               29.1ms
  terrainPrepare               2.9ms
  riverChannelSegmentsNear     0.3ms
  chunkUpdate                  0.1ms

Long frame #3:

[LONG FRAME] 4531.4ms
simulate      4522.1ms
render           9.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            2.8ms
STREAMING        0.0ms
NPC           4517.4ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER           6.6ms
OTHER            3.5ms

Long frame #4:

[LONG FRAME] 1174ms
simulate         8.6ms
render        1164.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.7ms
FAUNA            1.7ms
PHYSICS          0.1ms
RENDER        1164.1ms
OTHER            5.3ms

Long frame #5:

[LONG FRAME] 458.6ms
simulate       295.6ms
render         162.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING      286.8ms
NPC              1.8ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER         162.6ms
OTHER            6.7ms

streaming / stages:
  chunkUpdate                  286.8ms
  terrainPrepare               271.3ms
  riverChannelSegmentsNear     0.1ms

---

[Seedvale Program Census]

Programs created: 138
Program count: final=138 max=138

By frame:
  frame 0   +74 programs   <== largest transition
  frame 5   +1 program
  frame 76   +1 program
  frame 78   +4 programs
  frame 85   +1 program
  frame 89   +1 program
  frame 96   +1 program
  frame 109   +1 program
  frame 219   +1 program
  frame 540   +1 program
  frame 2037   +19 programs
  frame 2078   +7 programs
  frame 2288   +26 programs

Largest transition — frame 0 (+74 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=82d8167d-9d3d-42bd-b2d5-14425b14d852 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a4e2b05c-1de5-4cb7-8c05-26d99cdcc463
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=ae5c826d-ce8b-4e14-b089-ebeee44923e5
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e00b1bf4-a2f4-41c1-ab7a-f453d22cd5ff
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a68cb172-0194-4ca3-bab9-0f2a54bd2771
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f245c6a8-bd2f-4162-b346-a7dbfe13f079
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=859d9d3d-f550-4ba7-9076-d86e9136117c
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=9b284872-60ee-453d-90e7-efa2233b41fb
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=67964abe-4972-41ea-bc07-a14f9c8a7eb6
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6d45fc0c-13bd-47a7-887b-b0b6dfe92d12 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=dd873ad8-b93d-45c6-b634-1e81e4e56fab
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7d599937-fc44-4cf4-a309-7d334667465a (Flowers)
  #14 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dab74d25-36bb-44ed-b0f8-a16e2cc25e4b (Green)
  #15 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=23289822-0293-4f6d-a65c-e201c62edc33 (Pink)
  #16 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=82cda631-db25-4bd4-9633-588fa4a1331d (Stone)
  #17 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=84b57c8a-946e-4266-8aad-3d61154b0965 (None)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=751d09b2-1092-4551-9a81-198debabe441 (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6e4120a6-7f02-4eb3-915f-5b7416129f01 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d2c3689d-6dc7-4b45-9272-ef5a468519f7 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f4417800-4e72-40ea-bdc3-05d7a894445a (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4dd83e9e-8359-4d7d-975c-9dcb803c618e (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=64a0a73d-4ba1-4bb7-a16f-cae8a6dc3f84 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=61b13a75-3ac7-411b-8e5c-3adeb5782b2b
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=998e635f-da18-4f9c-b501-a478a45af177 (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=71946476-8fd3-4a19-921f-a3a452adb778 (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=92b3db73-ed2a-4656-8a06-7b07aebcc869 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=27fe7186-8857-4605-bcb1-941d2d8df280 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=41f8f83f-4ee8-4217-b5b5-f3dce4f3ba78 (MI_Hair_1)
  #34 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #43 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=abab9a99-958b-48ab-8e02-8a59a161c45f (Green)
  #44 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=d1d4c18a-4f3e-4a15-b690-9b0717601ae6 (MapleTree_Bark)
  #45 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8ae673a3-bd88-4705-85a3-3fa7db426cf3 (MapleTree_Leaves)
  #46 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=82421693-3a8c-4c4a-ba60-0d3d70749d2a (stockpiles_vc)
  #47 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=b61457b8-159e-4595-8bad-4a5b6d794f96
  #48 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=b0d1b431-f0b6-48b4-af32-9a2bd1627fbf (Handle)
  #49 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8b8da3b3-f0bd-44b8-a4eb-9df39ef47c8a (DarkGreen)
  #50 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=54f179c3-0c42-49a8-8f03-60edc015bb24 (MI_Regular_Male)
  #51 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=aec14df6-a917-4f7e-a4c0-7b361ebfbea6 (MI_Eyes)
  #52 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5acdcdce-3b31-47c8-ad38-9260f5f6cc12 (Main)
  #53 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=74e7d30f-c55b-40ba-9c6b-cdbbbcf33723 (PathRocks)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=de9b8883-bc3d-42db-802f-3ab7f9da6e60 (MI_Hair_1)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f4b4c6fb-ff4a-4538-b4ec-cd7271c299f3 (MI_Knight)
  #56 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #69 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #72 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=669a1bfa stage=postprocess-render
  #73 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #29=df7c703d, #30=f92c8d8c, #56=279cec18, #57=84736a68, #58=aa2edbee, #59=7bae0bb2, #60=436caea4, #61=886438e7, #62=d99a5b29, #63=2003ced8, #64=28dfa407, #65=756a0b19, #66=b2354ff2, #67=ea82969e, #68=7dab8d9a, #69=378e1fb7, #70=78acf7ea, #71=a312c579, #72=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #29=236b3b0b, #30=87d053eb, #56=4d6bcede, #57=ffecb62a, #58=76ced00a, #59=fb55b3c0, #60=2d687ef1, #61=dc2a89b5, #62=109e33fc, #63=db0f470a, #64=9775cd0e, #65=5c741650, #66=2aad9943, #67=a2297d9f, #68=1022767b, #69=ce0bf6b4, #70=707f290c, #71=c05e2256, #72=669a1bfa
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #29=(unset), #30=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #29=(unknown), #30=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=c0d790d1, #15=d3fd7a87, #16=a9733c9d, #17=6db98a06, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=66d360c8, #26=12873951, #27=fc941d05, #28=e551c572, #31=842fe1df, #32=ac268392, #33=1c179521, #43=190d3a9c, #44=2f7179e3, #45=3bea20f6, #46=a64d124e, #47=94297e69, #48=3abb47a8, #49=9434da33, #50=20daccfa, #51=1dcbc6ff, #52=fd8301ed, #53=b643916d, #54=cde317ee, #55=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=a81023c3, #15=2eae9a54, #16=bd723c8a, #17=efed8e98, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=c0b8fc9f, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=34995f15, #32=25a41317, #33=71f22dc6, #43=633146b4, #44=943c7b97, #45=5b26a60d, #46=546e469, #47=aa0735a8, #48=85d3c28d, #49=77dfd097, #50=a8862f4a, #51=1a1c0d8, #52=2f2885d5, #53=754b87bd, #54=512afd6f, #55=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=vegetation, #16=environment, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=other, #32=other, #33=other, #43=settlement, #44=settlement, #45=settlement, #46=settlement, #47=other, #48=settlement, #49=other, #50=other, #51=other, #52=fauna, #53=settlement, #54=npc, #55=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #43=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #43=0, #44=0, #45=0.45, #46=0, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=true, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=true, #48=true, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #43=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=false, #15=false, #16=false, #17=true, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=true, #32=true, #33=true, #43=false, #44=true, #45=true, #46=false, #47=false, #48=false, #49=false, #50=true, #51=true, #52=false, #53=true, #54=true, #55=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=true, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=false, #27=(unknown), #28=true, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=true, #32=true, #33=false, #43=false, #44=false, #45=false, #46=true, #47=false, #48=false, #49=false, #50=true, #51=true, #52=false, #53=false, #54=false, #55=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #43=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
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
  MeshDepthMaterial (9 programs):
    vertexShaderHash differs: #34=59ed5d71, #35=2efa42a8, #36=b69ba143, #37=2e7a6fcb, #38=c203b19a, #39=c203b19a, #40=585a1ea4, #41=263c45d6, #42=e4717b03
    fragmentShaderHash differs: #34=d729897e, #35=41e40a66, #36=d729897e, #37=758a4164, #38=41e40a66, #39=a9dd0dee, #40=a9dd0dee, #41=d729897e, #42=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2037 (+19):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: ae5c826d-ce8b-4e14-b089-ebeee44923e5
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: ca6eab2b-0189-498c-aadf-a97cdcdc1781
    object: Mesh 'chunk-vegetation-region-6,0|lily-0:0'
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
  Program #88
    material: MeshStandardMaterial 'Pink'
    materialUuid: 32403d37-5bde-49c7-95b3-01659e92e10c
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1d9ad13b
    fragmentShaderHash: b949dbe8
  Program #89
    material: MeshStandardMaterial 'Stone'
    materialUuid: 838415ff-f046-4e3f-8a84-827b389d1e98
    object: Mesh 'chunk-environment-region-5,-1|largeRock-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b3c52649
    fragmentShaderHash: acd7dae2
  Program #90
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: b9d597e5-9f09-447c-8c6c-0e7012e4210a
    object: Mesh 'mesh_0'
    asset: /models/nature/deadtree_3.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1bd8d9e3
    fragmentShaderHash: e2f189d1
  Program #91
    material: MeshStandardMaterial 'Flowers'
    materialUuid: 7d599937-fc44-4cf4-a309-7d334667465a
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
    vertexShaderHash: 363d51a0
    fragmentShaderHash: 8ab72265
  Program #92
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 83d50468-8dab-4acf-86bd-b124d768c8c8
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_3.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 42a56bca-9cb9-4b5c-884d-c986540229f7
    object: Mesh 'chunk-vegetation-region-6,-1|fern-0:0'
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
  Program #94
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 54f179c3-0c42-49a8-8f03-60edc015bb24
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #95
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: aec14df6-a917-4f7e-a4c0-7b361ebfbea6
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #96
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 92b3db73-ed2a-4656-8a06-7b07aebcc869
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #97
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 27fe7186-8857-4605-bcb1-941d2d8df280
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 41f8f83f-4ee8-4217-b5b5-f3dce4f3ba78
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #99
    material: MeshStandardMaterial ''
    materialUuid: 07e65982-1767-4687-b9fa-e8898af861c8
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 29daea16
    fragmentShaderHash: 83e94369
  Program #100
    material: MeshStandardMaterial 'Green'
    materialUuid: cdedc2f4-8dc4-4264-93ab-0b51827708ad
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
  Program #101
    material: MeshStandardMaterial 'Mushrooms'
    materialUuid: 5cc1c284-6899-4830-81ef-c90d99329910
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 83e57f3f
    fragmentShaderHash: 15fea9b7
  Program #102
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: 4b25c80f-d8a8-48b9-bb2c-868b2bf00ba8
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1e92ce5b
    fragmentShaderHash: 3735e0a9
  Program #103
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: cc635531-f406-474e-9e08-4a6d3431a3a1
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 7c8100cb
    fragmentShaderHash: 2c84ad03
  Program #104
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: df7ea3ad-9da2-42bc-a7f6-99038647bc82
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a26aa35d
    fragmentShaderHash: cf881fac

Frame 2288 (+26):
  Program #112
    material: ShaderMaterial 'SkyShader'
    materialUuid: 82d8167d-9d3d-42bd-b2d5-14425b14d852
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #113
    material: ShaderMaterial ''
    materialUuid: f245c6a8-bd2f-4162-b346-a7dbfe13f079
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #114
    material: MeshStandardMaterial ''
    materialUuid: ae5c826d-ce8b-4e14-b089-ebeee44923e5
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #115
    material: MeshStandardMaterial 'Wood'
    materialUuid: 2c16f397-9a1a-4e63-a3e7-7ad4e26bd562
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: cdedc2f4-8dc4-4264-93ab-0b51827708ad
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
  Program #117
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: 32403d37-5bde-49c7-95b3-01659e92e10c
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #118
    material: MeshStandardMaterial 'Green'
    materialUuid: ca6eab2b-0189-498c-aadf-a97cdcdc1781
    object: Mesh 'chunk-vegetation-region-6,0|lily-0:0'
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
  Program #119
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 36462711-e6ca-4598-a0e6-e2570e76fbc7
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ab1dd48f
    fragmentShaderHash: 8661e8c2
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 7d599937-fc44-4cf4-a309-7d334667465a
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
  Program #121
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: b2efee9a-1145-40a9-aca3-dc040ea8c451
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 42a56bca-9cb9-4b5c-884d-c986540229f7
    object: Mesh 'chunk-vegetation-region-6,-1|fern-0:0'
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
  Program #123
    material: MeshStandardMaterial 'Mushrooms'
    materialUuid: 5cc1c284-6899-4830-81ef-c90d99329910
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b4b22c53
    fragmentShaderHash: af711478
  Program #124
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 54f179c3-0c42-49a8-8f03-60edc015bb24
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: aec14df6-a917-4f7e-a4c0-7b361ebfbea6
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 92b3db73-ed2a-4656-8a06-7b07aebcc869
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 27fe7186-8857-4605-bcb1-941d2d8df280
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 41f8f83f-4ee8-4217-b5b5-f3dce4f3ba78
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: 4b25c80f-d8a8-48b9-bb2c-868b2bf00ba8
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 127e1a7
    fragmentShaderHash: bc850bfa
  Program #130
    material: MeshStandardMaterial ''
    materialUuid: d43b25de-0572-4f20-b91d-1fdfd5ec8511
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520711,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: e3408c64
    fragmentShaderHash: 4e17aba
  Program #131
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: cc635531-f406-474e-9e08-4a6d3431a3a1
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 21af24b7
    fragmentShaderHash: c4ca7b4
  Program #132
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: df7ea3ad-9da2-42bc-a7f6-99038647bc82
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 49797de9
    fragmentShaderHash: 32bd48fd
  Program #133
    material: ShaderMaterial ''
    materialUuid: 859d9d3d-f550-4ba7-9076-d86e9136117c
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #134
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #135
    material: MeshBasicMaterial ''
    materialUuid: 67964abe-4972-41ea-bc07-a14f9c8a7eb6
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #136
    material: ShaderMaterial ''
    materialUuid: b649fbfa-2af9-485e-ad91-9bea9c6c675a
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #137
    material: ShaderMaterial ''
    materialUuid: bde06612-b1c6-4292-ab54-e35174c13189
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1

---

[Seedvale Program Compile Cost]

No isolated per-program GPU compile/link timer exists in the public Three.js/WebGL API without patching internals (out of scope here). Each number below is the wall-clock duration of the renderer.render() call (mirror-render/postprocess-render) that first-used the program, reported ONLY when that program was the single new program created during that specific call — an upper bound that also includes the rest of that call's render cost, not an isolated compile/link timer.
Excluded — no reliable per-program timing: 130 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 5
  #74
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 273.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 76
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 1158.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 85
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 239.8 ms  (upper bound — whole mirror-render call, see note above)

Frame 89
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 123.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 96
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 149.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 109
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 205.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 219
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 172.8 ms  (upper bound — whole mirror-render call, see note above)

Frame 540
  #85
      material: MeshStandardMaterial 'lambert2SG'
      object: Mesh 'chunk-vegetation-region-3,-1|reed-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 107.4 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 2429.9 ms
  programs >1 ms: 8
  max: 1158.2 ms (#75)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.1 ms  p95=11.0 ms  max=12.4 ms  Δavg vs baseline=—
  hide-grass           avg=9.1 ms  p95=11.2 ms  max=11.4 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=8.3 ms  p95=10.4 ms  max=11.3 ms  Δavg vs baseline=-0.8 ms (-9%)
  no vegetation/grass  avg=8.2 ms  p95=9.3 ms  max=9.7 ms  Δavg vs baseline=-0.9 ms (-9%)
  hide-environment     avg=8.7 ms  p95=9.9 ms  max=10.9 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-settlement      avg=8.3 ms  p95=9.5 ms  max=9.7 ms  Δavg vs baseline=-0.8 ms (-8%)
  no water             avg=8.7 ms  p95=10.6 ms  max=11.5 ms  Δavg vs baseline=-0.4 ms (-5%)
  hide-terrain         avg=8.8 ms  p95=10.6 ms  max=10.7 ms  Δavg vs baseline=-0.3 ms (-4%)
  hide-npc-fauna       avg=7.2 ms  p95=8.7 ms  max=8.8 ms  Δavg vs baseline=-1.9 ms (-21%)
  no-shadows           avg=8.4 ms  p95=8.8 ms  max=8.8 ms  Δavg vs baseline=-0.7 ms (-7%)
  no-ao                avg=8.6 ms  p95=10.1 ms  max=10.7 ms  Δavg vs baseline=-0.5 ms (-6%)
  no-bloom             avg=8.9 ms  p95=10.1 ms  max=10.8 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-smaa              avg=9.0 ms  p95=10.7 ms  max=12.1 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-god-rays          avg=9.3 ms  p95=11.2 ms  max=11.9 ms  Δavg vs baseline=+0.2 ms (+3%)
  no-film-grade        avg=9.0 ms  p95=11.4 ms  max=12.8 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=8.3 ms  p95=9.7 ms  max=10.5 ms  Δavg vs baseline=-0.8 ms (-8%)
  no mirrors           avg=8.9 ms  p95=10.2 ms  max=11.0 ms  Δavg vs baseline=-0.2 ms (-3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=21.7 ms  p95=25.9 ms  max=27.1 ms
  CPU wall      avg=9.1 ms  p95=11.0 ms  max=12.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=13 sync ms total=496.7 max=46.4 store hits=0 prefetched=0
