# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T21:10:44.948Z
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
Frames: 1575
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 448d0534a9372f81e91c0790129e704428a92509
  runId: 2026-10-30T21-08-43-450Z-b5ja1w
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
  camera: pos=(1291, 8, -0.3)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=90s
  populationGate: stable waited=5084ms npc=24
  gpuTimer: available=true resolved=true samples=1578 span=postprocess+labels

FPS:
  avg: 30.5
  min: 0
  p1: 6

Frame time (wall-clock):
  avg: 32.8 ms
  p50: 16.2 ms
  p95: 41.5 ms
  p99: 174.1 ms
  max: 7580.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.3 p95=18.7 p99=46.9 max=7570.7 n=1575
  render: p50=10.1 p95=20.8 p99=72.2 max=1105.6 n=1575
  frame: p50=16.2 p95=41.5 p99=174.1 max=7580.4 n=1575

Rendering (combined renderer.info):
  draw calls: 398 avg / 2112 max
  triangles: 6.84M avg
  mirror draws: 66 avg
  geometries: 772
  textures: 408

Pass submissions (actual):
  reliability: observed
  frames: 1581 shadowRefresh=675 shadowSkipped=906
  mirror calls avg: 66
  shadow calls avg: 142
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
  other            draws=470 tris=28.9k meshes=470 inst=472

Shadow casters (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  vegetation       draws=146 tris=769.9k meshes=146 inst=568
  environment      draws=138 tris=21.7k meshes=138 inst=138
  settlement       draws=481 tris=596.5k meshes=481 inst=1477
  items            draws=22 tris=14.9k meshes=22 inst=22
  other            draws=98 tris=14.9k meshes=98 inst=98

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
  other                    nodes=723 composed=706 multiplied=723 skinned=9
  top scene children:
    fauna ×67                nodes=2812 composed=2812 multiplied=2812 skinned=219
    npc ×28                  nodes=2191 composed=2191 multiplied=2191 skinned=262
    settlement ×3            nodes=1496 composed=1496 multiplied=1496 skinned=0
    Group ×84                nodes=546 composed=546 multiplied=546 skinned=9
    chunk-items ×28          nodes=360 composed=360 multiplied=360 skinned=0
    chunk-environmen ×3      nodes=231 composed=231 multiplied=231 skinned=0
    chunk-grass ×16          nodes=72 composed=72 multiplied=72 skinned=0
    chunk ×68                nodes=68 composed=68 multiplied=68 skinned=0
    Root_Scene ×19           nodes=62 composed=62 multiplied=62 skinned=0
    chunk-water ×58          nodes=58 composed=58 multiplied=58 skinned=0
    chunk-river ×45          nodes=45 composed=45 multiplied=45 skinned=0
    Object3D ×29             nodes=29 composed=29 multiplied=29 skinned=0

Systems:
  WATER          2.3 ms
  STREAMING      2.1 ms
  NPC            13.4 ms
  FAUNA          1.7 ms
  PHYSICS        0.1 ms
  RENDER         11.4 ms

Detected bottlenecks:
  1. NPC
  2. RENDER
  3. WATER

Critical spikes:
  STREAMING: 21
  WATER: 13

Hitches (>= 8 ms): total=34
  chunk mesh             n=21 avg=12.5 max=23.9
  chunk water            n=13 avg=11.8 max=22.0

Isolation probes:
  full               render=9.8 ms draws=323 tris=9.15M
  hide-grass         render=9.8 ms draws=316 tris=4.08M
  hide-vegetation    render=9.0 ms draws=276 tris=8.95M
  hide-vegetation-grass render=9.2 ms draws=251 tris=3.78M
  hide-environment   render=9.7 ms draws=316 tris=9.10M
  hide-settlement    render=9.0 ms draws=309 tris=9.16M
  hide-water         render=9.7 ms draws=306 tris=7.52M
  hide-terrain       render=9.7 ms draws=303 tris=7.00M
  hide-npc-fauna     render=7.9 ms draws=323 tris=9.17M
  no-shadows         render=9.2 ms draws=310 tris=8.97M
  no-ao              render=9.3 ms draws=319 tris=9.11M
  no-bloom           render=9.6 ms draws=312 tris=9.11M
  no-smaa            render=9.8 ms draws=329 tris=9.18M
  no-god-rays        render=10.1 ms draws=331 tris=9.18M
  no-film-grade      render=10.1 ms draws=332 tris=9.18M
  no-postprocessing  render=9.3 ms draws=308 tris=9.18M
  no-reflections     render=10.0 ms draws=280 tris=8.73M

Frame attribution:
  frame max: 7580.4 ms
  largest labelled hitch: 23.9 ms
  unattributed: 7556.5 ms

Long frames:
  threshold: 80 ms
  count: 25
  worst: 7580.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1575/1575

Recommendation:
Largest frame (7580.4 ms) is not explained by labelled hitches (largest 23.9 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 28
  Fauna (agents): 30

NPC:
  total: 13.4 ms/frame
  crowd pass: 0.0 ms/frame (17.8 ms cumulative)
  agent updates: 1.2 ms/frame (1835.8 ms cumulative)
  livestock: 0.9 ms/frame (1384.4 ms cumulative)
    loaded tick: 0.9 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.9 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 24.4
    unique animals/frame: 22.6
    duplicate updates/frame: 1.8
    detached animals/frame: 0.0
    dog updates/frame: 4.6
    dog guard scans: 4.6/frame (36.8 predator candidates/frame)
    pest scans: 1.9/frame (1.9 rat candidates/frame)
    nearest scans: 9.8/frame (0.0 candidates/frame)
    water samples: 21.4/frame, 0.00 ms/frame (worst call 1.00 ms)
    collider queries: 21.4/frame, 0.00 ms/frame (worst call 0.20 ms, 2438.8 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 24.3
    behaviour executions/frame: 9.8
    presentation executions/frame: 8.8
  rats: 0.1 ms/frame (109.9 ms cumulative)
  social: 0.0 ms/frame (8.5 ms cumulative)
  streaming: 11.1 ms/frame (17464.0 ms cumulative)
  maintenance: 0.1 ms/frame (227.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.7 ms/frame
  agent updates: 1.7 ms/frame (2668.1 ms cumulative)
  forest sampling: 0.1 ms/frame (147.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (29.3 ms cumulative)
    targeting: 0.0 ms/frame (25.4 ms cumulative)
    decision: 0.0 ms/frame (15.9 ms cumulative)
    behaviour: 1.1 ms/frame (1781.3 ms cumulative)
    life/presentation: 0.3 ms/frame (528.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.1
    sensing passes/frame: 29.2
    decision passes/frame: 29.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.9
    full-rate agents/frame: 8.0
    reduced-cadence agents/frame: 21.2
    behaviour executions/frame: 16.9
    presentation executions/frame: 15.7

  sensing/cache:
    forest samples/frame: 30.1
    fire scan candidates/frame: 32.2
    village scan candidates/frame: 316.6
    player perception checks/frame: 29.2

  nearest scans: 24.3/frame (38206 calls)
  nearest candidates checked: 199.6/frame (314302 total)
  herd leader scans: 0.3/frame (406 calls)
  herd candidates checked: 7.7/frame (12180 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.3/frame (150.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 76.0/frame, 0.10 ms/frame (worst call 1.60 ms)
    collider queries: 76.0/frame, 0.10 ms/frame (worst call 1.00 ms, 4835.0 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 43
  empty builds (no instances): 360
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.14 ms
    max 0.70 ms

  allocation/setup:
    avg 0.07 ms
    max 0.50 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.06 ms
    max 2.00 ms
  scene attach (`scene.add`):
    avg 0.06 ms
    max 0.20 ms
  callback total (build + lod + attach):
    avg 0.41 ms
    max 2.40 ms

  per chunk:
    instances avg/max 4947.7 / 63902
    meshes avg/max 3.05 / 4
    geometries avg/max 3.05 / 4
    geometries after lod apply avg/max 6.05 / 7
    instances full/filler: 163134 / 49615
    matrix instances bound: 212749
    instanced attributes created: 655
    shared material refs: 131
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 63/63
    instances: 337819 (max 32465)
    allocation/setup avg/max: 0.04 / 0.50 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms
  grain:
    buckets/meshes: 63/63
    instances: 112369 (max 10763)
    allocation/setup avg/max: 0.01 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 63/63
    instances: 448838 (max 44129)
    allocation/setup avg/max: 0.01 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  filler:
    buckets/meshes: 22/22
    instances: 1612895 (max 184195)
    allocation/setup avg/max: 0.08 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
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
Frames: 1581
Shadow refresh frames: 675
Shadow skipped frames: 906

Mirror:
  calls avg: 66  tris avg: 707228
  info calls avg: 66  residual calls avg: 0
  switches avg: material=34.9 program=22.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.6 skeletons first used=3.6
  environment                  calls=3 tris=2022
  items                        calls=0 tris=158
  other                        calls=12 tris=4963
  settlement:decor             calls=1 tris=1888
  settlement:fence             calls=0 tris=744
  settlement:fireCampfire      calls=1 tris=57
  settlement:fireHouseExteriorLamp calls=2 tris=78
  settlement:fireHouseInteriorLamp calls=1 tris=58
  settlement:fireVillageTorch  calls=2 tris=153
  settlement:houseInteractive  calls=2 tris=179
  settlement:houseStatic       calls=5 tris=4582
  settlement:landmarkGarden    calls=1 tris=7486
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=1 tris=230
  settlement:landmarkWellHousehold calls=1 tris=639
  settlement:landmarkWellPasture calls=1 tris=217
  settlement:other             calls=1 tris=21
  settlement:storageBarrel     calls=1 tris=1737
  settlement:storageContainer  calls=2 tris=344
  settlement:storageGoods      calls=4 tris=874
  settlement:storageHay        calls=0 tris=58
  settlement:storageTrough     calls=1 tris=224
  settlement:storageWoodHousehold calls=0 tris=784
  settlement:storageWoodSettlementPrimary calls=0 tris=97
  settlement:workplace         calls=1 tris=385
  terrain                      calls=5 tris=402520
  vegetation                   calls=20 tris=276882

Shadow (refresh only):
  calls avg: 142  tris avg: 2088083
  info calls avg: 142  residual calls avg: 0
  switches avg: material=66.1 program=64.7  actor: calls=4.4 material=0 program=0.8
  skinning avg: skinned calls=8.8 skeletons first used=4.4
  environment                  calls=9 tris=4939
  faunaFamily:boar             calls=0 tris=24
  faunaFamily:chicken          calls=0 tris=43
  faunaFamily:cow              calls=0 tris=94
  faunaFamily:dog              calls=0 tris=85
  faunaFamily:duck             calls=0 tris=2
  faunaFamily:horse            calls=0 tris=94
  faunaFamily:rabbit           calls=0 tris=95
  faunaFamily:rat              calls=0 tris=65
  faunaFamily:rooster          calls=0 tris=41
  faunaFamily:sheep            calls=0 tris=82
  faunaFamily:stag             calls=1 tris=598
  items                        calls=3 tris=1474
  npcFamily:Farmer             calls=0 tris=536
  npcFamily:Knight_Cloth       calls=0 tris=418
  npcFamily:Peasant            calls=1 tris=701
  npcFamily:Peasant_Boots      calls=0 tris=163
  npcFamily:Ranger_NoHood      calls=0 tris=202
  npcFamily:woodcutter         calls=0 tris=144
  other                        calls=32 tris=8996
  settlement:decor             calls=18 tris=35214
  settlement:fence             calls=0 tris=639
  settlement:fireCampfire      calls=0 tris=4
  settlement:fireHouseInteriorLamp calls=1 tris=74
  settlement:houseInteractive  calls=1 tris=224
  settlement:houseStatic       calls=6 tris=8991
  settlement:landmarkGarden    calls=0 tris=197
  settlement:landmarkNoticeBoard calls=0 tris=5
  settlement:landmarkWellCentral calls=1 tris=245
  settlement:landmarkWellPasture calls=1 tris=206
  settlement:other             calls=1 tris=28
  settlement:storageContainer  calls=1 tris=415
  settlement:storageHay        calls=0 tris=59
  settlement:storageTrough     calls=1 tris=296
  settlement:storageWoodHousehold calls=0 tris=1087
  settlement:storageWoodSettlementPrimary calls=0 tris=102
  settlement:storageWoodSettlementSecondary calls=0 tris=234
  settlement:workplace         calls=0 tris=326
  terrain                      calls=19 tris=1375880
  vegetation                   calls=44 tris=645060

Main:
  calls avg: 257  tris avg: 5248967
  info calls avg: 331  residual calls avg: 0
  switches avg: material=138.8 program=66.1  actor: calls=30.1 material=22.5 program=11.6
  skinning avg: skinned calls=37.6 skeletons first used=9.3
  environment                  calls=18 tris=5702
  faunaFamily:bear             calls=0 tris=152
  faunaFamily:chicken          calls=2 tris=195
  faunaFamily:cow              calls=0 tris=133
  faunaFamily:dog              calls=3 tris=1047
  faunaFamily:donkey           calls=1 tris=170
  faunaFamily:horse            calls=0 tris=19
  faunaFamily:rabbit           calls=0 tris=20
  faunaFamily:rat              calls=0 tris=947
  faunaFamily:rooster          calls=0 tris=16
  faunaFamily:sheep            calls=2 tris=541
  faunaFamily:stag             calls=0 tris=101
  faunaFamily:wolf             calls=0 tris=114
  grass                        calls=17 tris=1913993
  items                        calls=22 tris=2117
  npcFamily:Farmer             calls=2 tris=3345
  npcFamily:Herbalist          calls=0 tris=600
  npcFamily:Knight_Cloth       calls=2 tris=2146
  npcFamily:Peasant            calls=14 tris=16891
  npcFamily:Peasant_Boots      calls=1 tris=1886
  npcFamily:Wizard             calls=1 tris=507
  npcFamily:blacksmith         calls=2 tris=2220
  other                        calls=36 tris=13739
  settlement:decor             calls=1 tris=3661
  settlement:fence             calls=1 tris=1462
  settlement:fireCampfire      calls=1 tris=113
  settlement:fireHouseExteriorLamp calls=3 tris=154
  settlement:fireHouseInteriorLamp calls=1 tris=116
  settlement:fireVillageTorch  calls=4 tris=304
  settlement:houseInteractive  calls=3 tris=355
  settlement:houseStatic       calls=7 tris=6316
  settlement:landmarkGarden    calls=1 tris=14723
  settlement:landmarkNoticeBoard calls=0 tris=9
  settlement:landmarkWellCentral calls=1 tris=459
  settlement:landmarkWellHousehold calls=1 tris=1274
  settlement:landmarkWellPasture calls=1 tris=429
  settlement:other             calls=2 tris=42
  settlement:storageBarrel     calls=2 tris=3432
  settlement:storageContainer  calls=3 tris=643
  settlement:storageGoods      calls=9 tris=1741
  settlement:storageHay        calls=0 tris=114
  settlement:storageTrough     calls=1 tris=444
  settlement:storageWoodHousehold calls=0 tris=1560
  settlement:storageWoodSettlementPrimary calls=0 tris=189
  settlement:workplace         calls=2 tris=771
  terrain                      calls=21 tris=1551237
  vegetation                   calls=49 tris=560972
  water                        calls=16 tris=1132159


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 25
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 25 total):

[LONG FRAME] 7580.4ms
simulate      7570.7ms
render           9.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC           7564.8ms
FAUNA            1.3ms
PHYSICS          0.1ms
RENDER           9.4ms
OTHER            4.7ms

Long frame #2:

[LONG FRAME] 5336.8ms
simulate      5330.2ms
render           6.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        3.9ms
NPC           5321.9ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER           6.3ms
OTHER            3.6ms

streaming / stages:
  chunkUpdate                  3.8ms
  terrainPrepare               2.3ms
  riverChannelSegmentsNear     0.2ms
  riverTileBuild               0.1ms

Long frame #3:

[LONG FRAME] 4507.4ms
simulate      4499.8ms
render           7.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC           4495.1ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER           7.4ms
OTHER            4.0ms

Long frame #4:

[LONG FRAME] 1113.2ms
simulate         7.3ms
render        1105.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.8ms
STREAMING        0.0ms
NPC              2.4ms
FAUNA            1.2ms
PHYSICS          0.1ms
RENDER        1099.9ms
OTHER            3.8ms

Long frame #5:

[LONG FRAME] 493.3ms
simulate        20.8ms
render         470.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          190.7ms
STREAMING       10.7ms
NPC              2.2ms
FAUNA            1.0ms
PHYSICS          0.0ms
RENDER         279.7ms
OTHER            9.0ms

streaming / stages:
  chunkUpdate                  10.7ms
  terrainPrepare               1.8ms
  riverChannelSegmentsNear     0.2ms
  riverTileBuild               0.1ms

---

[Seedvale Program Census]

Programs created: 138
Program count: final=138 max=138

By frame:
  frame 0   +75 programs   <== largest transition
  frame 5   +1 program
  frame 70   +1 program
  frame 72   +2 programs
  frame 87   +3 programs
  frame 97   +1 program
  frame 104   +1 program
  frame 209   +1 program
  frame 555   +1 program
  frame 2027   +19 programs
  frame 2070   +7 programs
  frame 2285   +26 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cb5cde52-67f9-4087-8cac-df3f6971d783 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c3c11844-923a-4292-8c9e-75b5d07be92a
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=778bebc5-1a93-4002-925d-29b662a763e6
  #3 type=ShaderMaterial name='' bucket=other cacheKey=4,5,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=31da0e52-bf3b-4d45-8705-5e7964c726a1
  #4 type=ShaderMaterial name='' bucket=water cacheKey=6,7,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4951fdf2-3e1f-41cb-96d0-2564c02a14f8
  #5 type=ShaderMaterial name='' bucket=water cacheKey=6,7,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c433d30d-3f60-431a-b82c-ce884b2ec393
  #6 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=242a66cc-6d5b-4815-b479-f0022adaffbf
  #7 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ca93a209-ee86-486c-8443-5aa8daca54af
  #8 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=17ec61f7-b79c-4ab8-8025-a92103fa386a (Wood)
  #9 type=ShaderMaterial name='' cacheKey=8,9,highp,srgb-linear,fa… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #10 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #11 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e4373d85-6e8b-4a9c-b8d5-f39390a2c2b6
  #12 type=ShaderMaterial name='' bucket=grass cacheKey=10,11,highp,srgb-linear,… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6dde67da-e809-4101-bacb-f24c73ae3075
  #13 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ae489134-a683-4e3a-8b76-7a6b1c93d1c3 (Main)
  #14 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=77a962af-6c3c-4359-b8cc-3b8623347d1c (Material.001)
  #15 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=aee3e425-4441-4f58-919e-e897db72ecd0 (lambert2SG)
  #16 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=41e9a9f8-1096-44d1-814f-311871097add (Material #55)
  #17 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=22cd526a-98da-4ecc-95b8-9655cddd15f1 (Green)
  #18 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c1a735c7-7009-43e7-b417-621a37528fc7 (Pink)
  #19 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=561c1c0b-624a-436c-9d71-42724d8d59bf (Flowers)
  #20 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2aee53f4-bd3f-4306-ab85-c60f7bf670cb (Stone)
  #21 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c52c7ad0-70ec-4aaa-b1e1-8c703d459225 (None)
  #22 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=items cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c311b83b-a474-413b-a5be-4535b88ab145 (Pond_Pack_MAT)
  #23 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=5e0e94dd-76cf-4f34-9fbb-cee6cc99cb08 (MI_WoodTrim)
  #24 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #25 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a5f6f64a-3d93-47ba-9430-95b0f84a0b5b (MI_WindowGlass)
  #26 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=79bd8c58-b6d6-40f6-84af-6f9079869a5e
  #27 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=e411d720-3b2a-42fe-a13c-4cacc4a2fa53 (MI_WoodTrim)
  #28 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #29 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b66c0b49-c65f-4235-b637-cd86ce1f5279 (MI_WindowGlass)
  #30 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #31 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a55ff8b5-e370-4752-82b0-ed5e091e0a7c (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6d4394d4-4906-4f3c-ad0f-202f2c841ffb (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c4085d70-00c1-40f1-925d-2f6b41476cda (MI_Hair_1)
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #44 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f43f1ed1-1b5c-41b6-b16b-9dff44f9699c (Green)
  #45 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=bca3de96-5a93-4279-8f7c-73aa645609dc (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e1aaec0c-0bbe-4bb7-a9af-3286f6df51ca (MapleTree_Leaves)
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4b4dd885-6267-4408-9326-a488992efd3d (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=2169e66f-18f4-48ac-8fd9-46949bc7dc55
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=e2f1580e-8355-4902-8bed-0f3aa2a35d5a (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e7922410-31fc-49e7-96cf-0e231d7a5772 (DarkGreen)
  #51 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d712dd21-e908-45cd-b030-27f24843c1c9 (MI_Regular_Male)
  #52 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=13872087-d854-47dc-90bb-2f3f83af0f24 (MI_Eyes)
  #53 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d74d75b7-373e-460d-8044-621631891e73 (Main)
  #54 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c1abaeed-9aea-4134-af2a-2160720491f1 (PathRocks)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f56c3089-9c32-4a63-a46c-972da5701d96 (SV_MI_Peasant)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5f0e8121-f515-44ff-8979-f359c93d11c1 (MI_Knight)
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
  #73 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=669a1bfa stage=postprocess-render
  #74 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=22690955, #4=1bb00362, #5=e6d01ae7, #9=5b43c776, #12=3f71df04, #30=df7c703d, #31=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=2cf9fa62, #4=a38bbf04, #5=e34491ff, #9=70b71dad, #12=d4350921, #30=236b3b0b, #31=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=669a1bfa
    bucket differs: #0=other, #1=other, #3=other, #4=water, #5=water, #9=(unknown), #12=grass, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=(unset), #4=1, #5=(unset), #9=(unset), #12=(unset), #30=(unset), #31=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #9=(unknown), #12=0, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #9=(unknown), #12=true, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #9=(unknown), #12=false, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #30=(unknown), #31=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (35 programs):
    vertexShaderHash differs: #2=5c2c57a3, #6=e3408c64, #8=d38f15a4, #13=54e03756, #14=a99aa494, #15=7bb77142, #17=c0d790d1, #18=d3fd7a87, #19=e4cbf8ca, #20=a9733c9d, #21=6db98a06, #22=c3bc6325, #23=c5e73b05, #24=13a74ec7, #25=9dcf1cb4, #26=66d360c8, #27=12873951, #28=fc941d05, #29=e551c572, #32=842fe1df, #33=ac268392, #34=1c179521, #44=190d3a9c, #45=2f7179e3, #46=3bea20f6, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=20daccfa, #52=1dcbc6ff, #53=fd8301ed, #54=b643916d, #55=cde317ee, #56=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #6=c0b8fc9f, #8=6578c10d, #13=d391c52, #14=63f9c0d1, #15=87728b15, #17=a81023c3, #18=2eae9a54, #19=135696d3, #20=bd723c8a, #21=efed8e98, #22=ded4be89, #23=d4c95125, #24=3ab4c629, #25=2d1aa4a, #26=c0b8fc9f, #27=d4c95125, #28=3ab4c629, #29=2d1aa4a, #32=34995f15, #33=25a41317, #34=71f22dc6, #44=633146b4, #45=943c7b97, #46=5b26a60d, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=a8862f4a, #52=1a1c0d8, #53=2f2885d5, #54=754b87bd, #55=512afd6f, #56=512afd6f
    bucket differs: #2=terrain, #6=other, #8=other, #13=fauna, #14=fauna, #15=fauna, #17=vegetation, #18=vegetation, #19=vegetation, #20=environment, #21=environment, #22=items, #23=settlement, #24=(unknown), #25=settlement, #26=settlement, #27=settlement, #28=(unknown), #29=settlement, #32=other, #33=other, #34=other, #44=settlement, #45=settlement, #46=settlement, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=fauna, #54=settlement, #55=npc, #56=npc
    define STANDARD differs: #2=, #6=, #8=, #13=, #14=, #15=, #17=, #18=, #19=, #20=, #21=, #22=, #23=, #24=(unset), #25=, #26=, #27=, #28=(unset), #29=, #32=, #33=, #34=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #6=0, #8=0, #13=0, #14=0, #15=0, #17=0, #18=0, #19=0.45, #20=0, #21=0, #22=0, #23=0, #24=(unknown), #25=0, #26=0, #27=0, #28=(unknown), #29=0, #32=0, #33=0, #34=0, #44=0, #45=0, #46=0.45, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=false, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #6=true, #8=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=true, #27=false, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #6=true, #8=true, #13=true, #14=true, #15=true, #17=true, #18=true, #19=true, #20=true, #21=true, #22=true, #23=true, #24=(unknown), #25=true, #26=true, #27=true, #28=(unknown), #29=true, #32=true, #33=true, #34=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=true, #17=false, #18=false, #19=true, #20=false, #21=true, #22=true, #23=true, #24=(unknown), #25=false, #26=false, #27=true, #28=(unknown), #29=false, #32=true, #33=true, #34=true, #44=false, #45=true, #46=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=false, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #6=false, #8=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=true, #24=(unknown), #25=false, #26=false, #27=true, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=true, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=true, #26=false, #27=false, #28=(unknown), #29=true, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #6=false, #8=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=true, #23=false, #24=(unknown), #25=false, #26=false, #27=false, #28=(unknown), #29=false, #32=true, #33=true, #34=false, #44=false, #45=false, #46=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=false, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #17=false, #18=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=false, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
  MeshBasicMaterial (3 programs):
    vertexShaderHash differs: #7=5efaf074, #10=d459e49b, #11=b6911298
    fragmentShaderHash differs: #7=5cf0ca9a, #10=a8a9bac3, #11=73a25d1e
    bucket differs: #7=other, #10=(unknown), #11=other
    flag alphaTest differs: #7=0, #10=(unknown), #11=0
    flag envMap differs: #7=false, #10=(unknown), #11=false
    flag fog differs: #7=true, #10=(unknown), #11=false
    flag map differs: #7=true, #10=(unknown), #11=true
    flag normalMap differs: #7=false, #10=(unknown), #11=false
    flag transparent differs: #7=true, #10=(unknown), #11=true
    flag vertexColors differs: #7=false, #10=(unknown), #11=false
    flag wireframe differs: #7=false, #10=(unknown), #11=false
  MeshPhysicalMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (9 programs):
    vertexShaderHash differs: #35=59ed5d71, #36=2efa42a8, #37=b69ba143, #38=2e7a6fcb, #39=c203b19a, #40=c203b19a, #41=585a1ea4, #42=263c45d6, #43=e4717b03
    fragmentShaderHash differs: #35=d729897e, #36=41e40a66, #37=d729897e, #38=758a4164, #39=41e40a66, #40=a9dd0dee, #41=a9dd0dee, #42=d729897e, #43=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2027 (+19):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: 778bebc5-1a93-4002-925d-29b662a763e6
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: 3cc1e0d3-3fd1-41f1-8231-015dea2bfb5f
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: a49c56a9-e04d-4222-9013-63b16d7de775
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
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: 7e588b49-8313-4a81-91b0-4ecb53189fa7
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #90
    material: MeshStandardMaterial 'Green'
    materialUuid: 68a024fc-0503-454a-92e5-e46f2c5bcaae
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
  Program #91
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 3cacd295-4709-4942-a336-3fbb0caf27ef
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #92
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 1e5269b8-97e1-42d2-aeef-5622b8f77134
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
    materialUuid: 048eb408-3601-43d6-8c19-0b536258ed1d
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: d76873fe-6cf2-4125-8433-2354a532c393
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
  Program #95
    material: MeshStandardMaterial 'Mushrooms'
    materialUuid: 814a024e-443a-4fcc-ab77-d8b4a957023d
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 83e57f3f
    fragmentShaderHash: 15fea9b7
  Program #96
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: d712dd21-e908-45cd-b030-27f24843c1c9
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 13872087-d854-47dc-90bb-2f3f83af0f24
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: a55ff8b5-e370-4752-82b0-ed5e091e0a7c
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6d4394d4-4906-4f3c-ad0f-202f2c841ffb
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c4085d70-00c1-40f1-925d-2f6b41476cda
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #101
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: 35a29aad-339c-4084-b4c1-098fcc72e969
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1e92ce5b
    fragmentShaderHash: 3735e0a9
  Program #102
    material: MeshStandardMaterial ''
    materialUuid: 8734fc92-869b-4b2d-b247-95d0b6387508
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 29daea16
    fragmentShaderHash: 83e94369
  Program #103
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: bdcc7ebe-b23a-404f-a0f2-e0df03235a0e
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 7c8100cb
    fragmentShaderHash: 2c84ad03
  Program #104
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: a1f454aa-9976-4f62-9247-9a7197340ae3
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a26aa35d
    fragmentShaderHash: cf881fac

Frame 2285 (+26):
  Program #112
    material: ShaderMaterial 'SkyShader'
    materialUuid: cb5cde52-67f9-4087-8cac-df3f6971d783
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #113
    material: ShaderMaterial ''
    materialUuid: 6dde67da-e809-4101-bacb-f24c73ae3075
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #114
    material: MeshStandardMaterial ''
    materialUuid: 778bebc5-1a93-4002-925d-29b662a763e6
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #115
    material: MeshStandardMaterial 'Wood'
    materialUuid: 3cc1e0d3-3fd1-41f1-8231-015dea2bfb5f
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: a49c56a9-e04d-4222-9013-63b16d7de775
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
    materialUuid: 7e588b49-8313-4a81-91b0-4ecb53189fa7
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #118
    material: MeshStandardMaterial 'Green'
    materialUuid: 68a024fc-0503-454a-92e5-e46f2c5bcaae
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
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 3cacd295-4709-4942-a336-3fbb0caf27ef
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 1e5269b8-97e1-42d2-aeef-5622b8f77134
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
    materialUuid: 048eb408-3601-43d6-8c19-0b536258ed1d
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'Leaves'
    materialUuid: d76873fe-6cf2-4125-8433-2354a532c393
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
    materialUuid: 814a024e-443a-4fcc-ab77-d8b4a957023d
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b4b22c53
    fragmentShaderHash: af711478
  Program #124
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: d712dd21-e908-45cd-b030-27f24843c1c9
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 13872087-d854-47dc-90bb-2f3f83af0f24
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: a55ff8b5-e370-4752-82b0-ed5e091e0a7c
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6d4394d4-4906-4f3c-ad0f-202f2c841ffb
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c4085d70-00c1-40f1-925d-2f6b41476cda
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: 35a29aad-339c-4084-b4c1-098fcc72e969
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 127e1a7
    fragmentShaderHash: bc850bfa
  Program #130
    material: MeshStandardMaterial ''
    materialUuid: 8734fc92-869b-4b2d-b247-95d0b6387508
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520711,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: e3408c64
    fragmentShaderHash: 4e17aba
  Program #131
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: bdcc7ebe-b23a-404f-a0f2-e0df03235a0e
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 21af24b7
    fragmentShaderHash: c4ca7b4
  Program #132
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: a1f454aa-9976-4f62-9247-9a7197340ae3
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 49797de9
    fragmentShaderHash: 32bd48fd
  Program #133
    material: ShaderMaterial ''
    materialUuid: c433d30d-3f60-431a-b82c-ce884b2ec393
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #134
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #135
    material: MeshBasicMaterial ''
    materialUuid: ca93a209-ee86-486c-8443-5aa8daca54af
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #136
    material: ShaderMaterial ''
    materialUuid: b3a56556-7b49-4ec7-aa3c-390ade973352
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #137
    material: ShaderMaterial ''
    materialUuid: 902703c5-5401-479e-adde-6d3ec30d87b9
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1

---

[Seedvale Program Compile Cost]

No isolated per-program GPU compile/link timer exists in the public Three.js/WebGL API without patching internals (out of scope here). Each number below is the wall-clock duration of the renderer.render() call (mirror-render/postprocess-render) that first-used the program, reported ONLY when that program was the single new program created during that specific call — an upper bound that also includes the rest of that call's render cost, not an isolated compile/link timer.
Excluded — no reliable per-program timing: 131 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 5
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 317.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 70
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 140.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 87
  #79
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 188.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 97
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,0|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 207.9 ms  (upper bound — whole mirror-render call, see note above)

Frame 104
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 88.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 209
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 197.8 ms  (upper bound — whole mirror-render call, see note above)

Frame 555
  #85
      material: MeshStandardMaterial 'lambert2SG'
      object: Mesh 'chunk-vegetation-region-3,-1|reed-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 100.1 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1241.6 ms
  programs >1 ms: 7
  max: 317.7 ms (#75)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.8 ms  p95=11.6 ms  max=11.7 ms  Δavg vs baseline=—
  hide-grass           avg=9.8 ms  p95=11.8 ms  max=11.9 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=9.0 ms  p95=10.8 ms  max=11.6 ms  Δavg vs baseline=-0.7 ms (-7%)
  no vegetation/grass  avg=9.2 ms  p95=11.2 ms  max=13.1 ms  Δavg vs baseline=-0.6 ms (-6%)
  hide-environment     avg=9.7 ms  p95=11.8 ms  max=13.1 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-settlement      avg=9.0 ms  p95=10.2 ms  max=10.9 ms  Δavg vs baseline=-0.8 ms (-8%)
  no water             avg=9.7 ms  p95=11.3 ms  max=11.8 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=9.7 ms  p95=11.3 ms  max=11.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-npc-fauna       avg=7.9 ms  p95=9.5 ms  max=9.5 ms  Δavg vs baseline=-1.9 ms (-19%)
  no-shadows           avg=9.2 ms  p95=10.1 ms  max=10.2 ms  Δavg vs baseline=-0.5 ms (-5%)
  no-ao                avg=9.3 ms  p95=10.4 ms  max=12.1 ms  Δavg vs baseline=-0.5 ms (-5%)
  no-bloom             avg=9.6 ms  p95=10.7 ms  max=11.9 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-smaa              avg=9.8 ms  p95=11.0 ms  max=13.1 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-god-rays          avg=10.1 ms  p95=12.0 ms  max=17.6 ms  Δavg vs baseline=+0.3 ms (+3%)
  no-film-grade        avg=10.1 ms  p95=12.3 ms  max=12.7 ms  Δavg vs baseline=+0.3 ms (+3%)
  no postprocessing    avg=9.3 ms  p95=11.7 ms  max=12.9 ms  Δavg vs baseline=-0.5 ms (-5%)
  no mirrors           avg=10.0 ms  p95=12.2 ms  max=14.7 ms  Δavg vs baseline=+0.3 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.5 ms  p95=27.5 ms  max=27.8 ms
  CPU wall      avg=9.8 ms  p95=11.6 ms  max=11.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=13 prefetched=25
