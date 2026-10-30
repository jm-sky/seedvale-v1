# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T21:06:56.703Z
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
Frames: 1543
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 448d0534a9372f81e91c0790129e704428a92509
  runId: 2026-10-30T21-04-55-681Z-4wtkg0
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
  camera: pos=(1290.7, 8, -0.3)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=90s
  populationGate: stable waited=5035ms npc=24
  gpuTimer: available=true resolved=true samples=1546 span=postprocess+labels

FPS:
  avg: 30.5
  min: 0
  p1: 6

Frame time (wall-clock):
  avg: 32.8 ms
  p50: 16.4 ms
  p95: 39.9 ms
  p99: 163.9 ms
  max: 7634.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.6 p95=18.7 p99=57.8 max=7622.7 n=1543
  render: p50=9.7 p95=20.2 p99=86.9 max=948.9 n=1543
  frame: p50=16.4 p95=39.9 p99=163.9 max=7634.5 n=1543

Rendering (combined renderer.info):
  draw calls: 402 avg / 2100 max
  triangles: 6.70M avg
  mirror draws: 66 avg
  geometries: 775
  textures: 408

Pass submissions (actual):
  reliability: observed
  frames: 1549 shadowRefresh=696 shadowSkipped=853
  mirror calls avg: 66
  shadow calls avg: 151
  main calls avg: 255

Scene (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  grass            draws=56 tris=9.26M meshes=56 inst=676088
  vegetation       draws=170 tris=835.0k meshes=170 inst=622
  environment      draws=139 tris=21.7k meshes=139 inst=139
  settlement       draws=750 tris=885.4k meshes=750 inst=1864
  water            draws=59 tris=4.28M meshes=59 inst=59
  npc              draws=262 tris=335.5k meshes=262 inst=262
  fauna            draws=269 tris=104.0k meshes=269 inst=269
  items            draws=243 tris=19.8k meshes=243 inst=243
  other            draws=473 tris=28.7k meshes=473 inst=475

Shadow casters (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  vegetation       draws=146 tris=769.9k meshes=146 inst=568
  environment      draws=138 tris=21.7k meshes=138 inst=138
  settlement       draws=478 tris=599.7k meshes=478 inst=1475
  items            draws=22 tris=14.9k meshes=22 inst=22
  other            draws=96 tris=14.6k meshes=96 inst=96

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=91 tris=156.0k meshes=91 inst=868
  houseInteractive draws=32 tris=5.0k meshes=32 inst=32
  fence            draws=4 tris=9.7k meshes=4 inst=48
  storageWoodSettlementPrimary draws=3 tris=2.7k meshes=3 inst=3
  storageWoodSettlementSecondary draws=4 tris=11.3k meshes=4 inst=4
  storageWoodHousehold draws=3 tris=12.5k meshes=3 inst=16
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
  decor            draws=193 tris=370.2k meshes=193 inst=275
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
  settlement               nodes=1492 composed=1492 multiplied=1492 skinned=0
  water                    nodes=59 composed=59 multiplied=59 skinned=0
  npc                      nodes=2191 composed=2191 multiplied=2191 skinned=262
  fauna                    nodes=2812 composed=2812 multiplied=2812 skinned=219
  items                    nodes=363 composed=363 multiplied=363 skinned=0
  other                    nodes=725 composed=708 multiplied=725 skinned=9
  top scene children:
    fauna ×67                nodes=2812 composed=2812 multiplied=2812 skinned=219
    npc ×28                  nodes=2191 composed=2191 multiplied=2191 skinned=262
    settlement ×3            nodes=1492 composed=1492 multiplied=1492 skinned=0
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
  WATER          2.5 ms
  STREAMING      2.1 ms
  NPC            13.4 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         10.6 ms

Detected bottlenecks:
  1. NPC
  2. RENDER
  3. WATER

Critical spikes:
  STREAMING: 13
  WATER: 11

Hitches (>= 8 ms): total=24
  chunk mesh             n=13 avg=11.5 max=17.3
  chunk water            n=10 avg=9.9 max=15.4
  chunk river            n=1 avg=9.1 max=9.1

Isolation probes:
  full               render=9.7 ms draws=332 tris=9.18M
  hide-grass         render=9.5 ms draws=316 tris=4.08M
  hide-vegetation    render=9.0 ms draws=276 tris=8.95M
  hide-vegetation-grass render=8.8 ms draws=254 tris=3.81M
  hide-environment   render=9.2 ms draws=316 tris=9.10M
  hide-settlement    render=8.9 ms draws=309 tris=9.16M
  hide-water         render=9.3 ms draws=309 tris=7.55M
  hide-terrain       render=9.5 ms draws=303 tris=7.00M
  hide-npc-fauna     render=7.6 ms draws=323 tris=9.17M
  no-shadows         render=9.1 ms draws=306 tris=8.94M
  no-ao              render=9.3 ms draws=319 tris=9.11M
  no-bloom           render=9.7 ms draws=319 tris=9.18M
  no-smaa            render=9.4 ms draws=329 tris=9.18M
  no-god-rays        render=9.5 ms draws=328 tris=9.15M
  no-film-grade      render=10.0 ms draws=332 tris=9.18M
  no-postprocessing  render=9.4 ms draws=308 tris=9.18M
  no-reflections     render=10.0 ms draws=280 tris=8.73M

Frame attribution:
  frame max: 7634.5 ms
  largest labelled hitch: 17.3 ms
  unattributed: 7617.2 ms

Long frames:
  threshold: 80 ms
  count: 29
  worst: 7634.5 ms

Raw sidecar:
  sampling=full factor=1 exported=1543/1543

Recommendation:
Largest frame (7634.5 ms) is not explained by labelled hitches (largest 17.3 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 28
  Fauna (agents): 30

NPC:
  total: 13.4 ms/frame
  crowd pass: 0.0 ms/frame (12.8 ms cumulative)
  agent updates: 1.1 ms/frame (1712.5 ms cumulative)
  livestock: 0.6 ms/frame (873.1 ms cumulative)
    loaded tick: 0.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 23.8
    unique animals/frame: 22.1
    duplicate updates/frame: 1.6
    detached animals/frame: 0.0
    dog updates/frame: 4.4
    dog guard scans: 4.4/frame (35.3 predator candidates/frame)
    pest scans: 1.9/frame (1.9 rat candidates/frame)
    nearest scans: 9.9/frame (0.0 candidates/frame)
    water samples: 21.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 21.8/frame, 0.00 ms/frame (worst call 1.20 ms, 2520.7 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 23.6
    behaviour executions/frame: 9.9
    presentation executions/frame: 8.9
  rats: 0.1 ms/frame (177.9 ms cumulative)
  social: 0.0 ms/frame (6.2 ms cumulative)
  streaming: 11.4 ms/frame (17642.8 ms cumulative)
  maintenance: 0.1 ms/frame (191.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.0 ms/frame (3140.8 ms cumulative)
  forest sampling: 0.1 ms/frame (146.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (31.3 ms cumulative)
    targeting: 0.0 ms/frame (24.4 ms cumulative)
    decision: 0.0 ms/frame (21.8 ms cumulative)
    behaviour: 1.4 ms/frame (2229.6 ms cumulative)
    life/presentation: 0.3 ms/frame (511.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.1
    sensing passes/frame: 29.3
    decision passes/frame: 29.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.8
    full-rate agents/frame: 6.0
    reduced-cadence agents/frame: 23.3
    behaviour executions/frame: 15.8
    presentation executions/frame: 14.6

  sensing/cache:
    forest samples/frame: 30.1
    fire scan candidates/frame: 30.7
    village scan candidates/frame: 304.7
    player perception checks/frame: 29.3

  nearest scans: 23.9/frame (36822 calls)
  nearest candidates checked: 208.2/frame (321180 total)
  herd leader scans: 0.2/frame (241 calls)
  herd candidates checked: 4.7/frame (7230 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 22.5/frame (148.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 76.5/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 76.5/frame, 0.10 ms/frame (worst call 4.10 ms, 5579.1 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 43
  empty builds (no instances): 356
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.20 ms
    max 0.70 ms

  allocation/setup:
    avg 0.15 ms
    max 0.70 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.05 ms
    max 0.40 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.20 ms
  callback total (build + lod + attach):
    avg 0.51 ms
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
    allocation/setup avg/max: 0.14 / 4.50 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 63/63
    instances: 112369 (max 10763)
    allocation/setup avg/max: 0.03 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  herb:
    buckets/meshes: 63/63
    instances: 448838 (max 44129)
    allocation/setup avg/max: 0.03 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 22/22
    instances: 1612895 (max 184195)
    allocation/setup avg/max: 0.09 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms

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
Frames: 1549
Shadow refresh frames: 696
Shadow skipped frames: 853

Mirror:
  calls avg: 66  tris avg: 696607
  info calls avg: 66  residual calls avg: 0
  switches avg: material=34.9 program=22.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.6 skeletons first used=3.6
  environment                  calls=3 tris=1928
  items                        calls=0 tris=159
  other                        calls=12 tris=4922
  settlement:decor             calls=1 tris=2154
  settlement:fence             calls=0 tris=736
  settlement:fireCampfire      calls=1 tris=59
  settlement:fireHouseExteriorLamp calls=2 tris=79
  settlement:fireHouseInteriorLamp calls=1 tris=59
  settlement:fireVillageTorch  calls=2 tris=155
  settlement:houseInteractive  calls=2 tris=181
  settlement:houseStatic       calls=5 tris=4722
  settlement:landmarkGarden    calls=1 tris=7757
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=1 tris=231
  settlement:landmarkWellHousehold calls=1 tris=638
  settlement:landmarkWellPasture calls=1 tris=215
  settlement:other             calls=1 tris=21
  settlement:storageBarrel     calls=1 tris=1788
  settlement:storageContainer  calls=2 tris=356
  settlement:storageGoods      calls=4 tris=883
  settlement:storageHay        calls=0 tris=60
  settlement:storageTrough     calls=1 tris=231
  settlement:storageWoodHousehold calls=0 tris=813
  settlement:storageWoodSettlementPrimary calls=0 tris=98
  settlement:workplace         calls=1 tris=391
  terrain                      calls=5 tris=400508
  vegetation                   calls=19 tris=267614

Shadow (refresh only):
  calls avg: 151  tris avg: 2088890
  info calls avg: 151  residual calls avg: 0
  switches avg: material=68.1 program=67.1  actor: calls=6.9 material=0 program=1.2
  skinning avg: skinned calls=11.1 skeletons first used=4.9
  environment                  calls=9 tris=4902
  faunaFamily:boar             calls=1 tris=328
  faunaFamily:chicken          calls=0 tris=52
  faunaFamily:cow              calls=0 tris=116
  faunaFamily:dog              calls=0 tris=94
  faunaFamily:duck             calls=0 tris=5
  faunaFamily:fox              calls=0 tris=29
  faunaFamily:horse            calls=0 tris=132
  faunaFamily:rabbit           calls=0 tris=184
  faunaFamily:rat              calls=0 tris=52
  faunaFamily:rooster          calls=0 tris=43
  faunaFamily:sheep            calls=0 tris=96
  faunaFamily:stag             calls=1 tris=865
  faunaFamily:wolf             calls=0 tris=132
  items                        calls=3 tris=1511
  npcFamily:Farmer             calls=0 tris=663
  npcFamily:Knight_Cloth       calls=0 tris=534
  npcFamily:Peasant            calls=1 tris=856
  npcFamily:Peasant_Boots      calls=0 tris=263
  npcFamily:Ranger_NoHood      calls=0 tris=327
  npcFamily:woodcutter         calls=0 tris=233
  other                        calls=33 tris=9065
  settlement:decor             calls=21 tris=41222
  settlement:fence             calls=0 tris=648
  settlement:fireCampfire      calls=0 tris=4
  settlement:fireHouseInteriorLamp calls=1 tris=85
  settlement:houseInteractive  calls=2 tris=256
  settlement:houseStatic       calls=7 tris=9897
  settlement:landmarkGarden    calls=0 tris=230
  settlement:landmarkNoticeBoard calls=0 tris=6
  settlement:landmarkWellCentral calls=1 tris=291
  settlement:landmarkWellPasture calls=1 tris=208
  settlement:other             calls=1 tris=30
  settlement:storageContainer  calls=1 tris=454
  settlement:storageHay        calls=0 tris=69
  settlement:storageTrough     calls=1 tris=320
  settlement:storageWoodHousehold calls=0 tris=1181
  settlement:storageWoodSettlementPrimary calls=0 tris=117
  settlement:storageWoodSettlementSecondary calls=0 tris=235
  settlement:workplace         calls=1 tris=389
  terrain                      calls=19 tris=1374402
  vegetation                   calls=44 tris=638362

Main:
  calls avg: 255  tris avg: 5075007
  info calls avg: 336  residual calls avg: 0
  switches avg: material=137.3 program=65.8  actor: calls=30.2 material=22.5 program=11.3
  skinning avg: skinned calls=37.6 skeletons first used=9.4
  environment                  calls=18 tris=5567
  faunaFamily:bear             calls=0 tris=159
  faunaFamily:chicken          calls=2 tris=202
  faunaFamily:cow              calls=0 tris=137
  faunaFamily:dog              calls=3 tris=1076
  faunaFamily:donkey           calls=1 tris=168
  faunaFamily:horse            calls=0 tris=25
  faunaFamily:rabbit           calls=0 tris=7
  faunaFamily:rat              calls=0 tris=941
  faunaFamily:rooster          calls=0 tris=19
  faunaFamily:sheep            calls=2 tris=539
  faunaFamily:stag             calls=0 tris=54
  faunaFamily:wolf             calls=0 tris=133
  grass                        calls=16 tris=1768674
  items                        calls=20 tris=2019
  npcFamily:Farmer             calls=2 tris=3430
  npcFamily:Herbalist          calls=0 tris=594
  npcFamily:Knight_Cloth       calls=2 tris=2202
  npcFamily:Peasant            calls=14 tris=16646
  npcFamily:Peasant_Boots      calls=1 tris=1941
  npcFamily:Wizard             calls=1 tris=503
  npcFamily:blacksmith         calls=2 tris=2266
  other                        calls=37 tris=13714
  settlement:decor             calls=2 tris=4257
  settlement:fence             calls=1 tris=1452
  settlement:fireCampfire      calls=2 tris=117
  settlement:fireHouseExteriorLamp calls=3 tris=158
  settlement:fireHouseInteriorLamp calls=1 tris=119
  settlement:fireVillageTorch  calls=4 tris=309
  settlement:houseInteractive  calls=3 tris=363
  settlement:houseStatic       calls=7 tris=6434
  settlement:landmarkGarden    calls=2 tris=15444
  settlement:landmarkNoticeBoard calls=1 tris=9
  settlement:landmarkWellCentral calls=1 tris=473
  settlement:landmarkWellHousehold calls=1 tris=1266
  settlement:landmarkWellPasture calls=1 tris=428
  settlement:other             calls=2 tris=43
  settlement:storageBarrel     calls=2 tris=3539
  settlement:storageContainer  calls=3 tris=663
  settlement:storageGoods      calls=9 tris=1770
  settlement:storageHay        calls=0 tris=118
  settlement:storageTrough     calls=1 tris=457
  settlement:storageWoodHousehold calls=0 tris=1614
  settlement:storageWoodSettlementPrimary calls=0 tris=195
  settlement:workplace         calls=2 tris=788
  terrain                      calls=21 tris=1543490
  vegetation                   calls=47 tris=541791
  water                        calls=16 tris=1129010


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

[LONG FRAME] 7634.5ms
simulate      7622.7ms
render          11.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.0ms
STREAMING        0.0ms
NPC           7616.6ms
FAUNA            1.6ms
PHYSICS          0.2ms
RENDER           8.8ms
OTHER            4.3ms

Long frame #2:

[LONG FRAME] 5353.2ms
simulate      5346.7ms
render           6.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            1.8ms
STREAMING        0.0ms
NPC           5342.3ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER           4.7ms
OTHER            3.7ms

streaming / stages:
  riverTileBuild               28.5ms
  terrainPrepare               3.3ms
  riverChannelSegmentsNear     0.4ms

Long frame #3:

[LONG FRAME] 4519.7ms
simulate      4509.9ms
render           9.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            2.6ms
STREAMING        0.0ms
NPC           4503.5ms
FAUNA            2.1ms
PHYSICS          0.2ms
RENDER           7.2ms
OTHER            4.1ms

Long frame #4:

[LONG FRAME] 954.4ms
simulate         4.3ms
render         948.9ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          932.3ms
STREAMING        0.0ms
NPC              2.1ms
FAUNA            0.9ms
PHYSICS          0.2ms
RENDER          16.6ms
OTHER            2.2ms

Long frame #5:

[LONG FRAME] 521.2ms
simulate       294.3ms
render         226.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.9ms
STREAMING      283.0ms
NPC              2.9ms
FAUNA            0.7ms
PHYSICS          0.0ms
RENDER         222.8ms
OTHER            7.9ms

streaming / stages:
  chunkUpdate                  283.0ms
  terrainPrepare               271.1ms
  riverTileBuild               0.1ms
  riverChannelSegmentsNear     0.1ms

---

[Seedvale Program Census]

Programs created: 138
Program count: final=138 max=138

By frame:
  frame 0   +74 programs   <== largest transition
  frame 9   +1 program
  frame 13   +1 program
  frame 93   +1 program
  frame 95   +3 programs
  frame 96   +1 program
  frame 98   +1 program
  frame 105   +1 program
  frame 116   +1 program
  frame 233   +1 program
  frame 538   +1 program
  frame 2006   +19 programs
  frame 2050   +7 programs
  frame 2266   +26 programs

Largest transition — frame 0 (+74 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a9a320c1-1073-45cd-891f-0cec25d1a273 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d8f82df2-4b43-4054-8e4d-2edaa027de34
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=fd679957-0dfe-4aec-b001-846db34c60ff
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=91776b2e-7a4d-41a1-89eb-5130086f822a
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2c3e92c8-36ff-439a-b58f-cbdeff37f843
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e2c6dae9-0cb8-451a-950d-b17d52e47688
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=86abe602-36f0-4256-ac64-96c857be07d5
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=879d0633-1593-45a7-a3a3-a266d6447b2c
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f4ad20e6-8866-428f-950d-e95f96f74585
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3b9445d2-d14a-4c55-ab4d-0d399f61a2b3 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ddcbcdeb-b94e-4c89-9217-12086df1b8d5
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=376da9d4-ca32-450e-91dd-e11164de8a2d (Flowers)
  #14 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0b3e84fb-ad25-420c-9cb6-73e0bc455032 (None)
  #15 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b56ffdfb-6fe1-46c0-afd6-c20c8eeb2f24 (Green)
  #16 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9cc2462c-132a-4306-8d08-c6d535bb7668 (Pink)
  #17 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d0ce9625-4efa-4e70-971b-c89ec53bb308 (Stone)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e0638154-9b36-4777-bf72-e9e3081e2b70 (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=75408736-60e2-4a34-ab0e-9ddf139f5864 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d3ded065-933d-45a1-a54d-685b3d627f57 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=76666c94-4c8f-47ec-8088-f759642da2fe (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=009958b5-3a81-4dbc-9ec8-2ca6b7d15fc7 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=685596d0-dc6c-4474-8886-f6a9be70ab95 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=b986df34-911c-42a6-a12a-a09e9e3dfde7
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=1d74b861-926f-4cb2-b1a1-688a77cf632b (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5bddcba2-ad18-4684-811e-3a830f306706 (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=15204594-1b55-4182-9fe9-eb3c2c19f8a3 (Main)
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8c8a575b-4825-42c5-b41a-b01e7e517fd8 (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c75ba400-008d-4913-a72a-b4c6fb7338c9 (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ee9cda8c-d81b-4fc1-9e58-53c4f669c6ff (MI_Hair_1)
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
      material=1a327b1c-96e0-4029-ae3f-0966ff1ccfbb (Green)
  #45 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4c4120f2-84d6-4628-880a-f042806dacda (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=23df0fc7-d008-4380-8afb-60d0075aa54b (MapleTree_Leaves)
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b653cece-d6c5-4fa5-8b68-69bcae52ac3e (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=91c4bdbb-208a-4cba-be42-cfdebc026e06
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=0517dbf5-aa8c-4cd6-ad80-d457dad3b573 (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4d7b3a61-13f2-4996-bd57-64578da3198a (DarkGreen)
  #51 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=4f583f59-3cb7-4962-a98a-76ee41b994ec (MI_Regular_Male)
  #52 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3b805e0b-fb56-4f2f-812a-05432c77b47e (MI_Eyes)
  #53 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=578283bd-7e47-45bc-8df7-ef87ba376def (PathRocks)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2a05c3b6-08a1-44ff-8cab-a29ea672de0b (MI_Hair_1)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3834849b-a4ef-44ff-ad9a-000d51e642d2 (MI_Knight)
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
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=6db98a06, #15=c0d790d1, #16=d3fd7a87, #17=a9733c9d, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=66d360c8, #26=12873951, #27=fc941d05, #28=e551c572, #31=fd8301ed, #32=842fe1df, #33=ac268392, #34=1c179521, #44=190d3a9c, #45=2f7179e3, #46=3bea20f6, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=20daccfa, #52=1dcbc6ff, #53=b643916d, #54=cde317ee, #55=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=efed8e98, #15=a81023c3, #16=2eae9a54, #17=bd723c8a, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=c0b8fc9f, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=2f2885d5, #32=34995f15, #33=25a41317, #34=71f22dc6, #44=633146b4, #45=943c7b97, #46=5b26a60d, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=a8862f4a, #52=1a1c0d8, #53=754b87bd, #54=512afd6f, #55=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=environment, #15=vegetation, #16=vegetation, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=fauna, #32=other, #33=other, #34=other, #44=settlement, #45=settlement, #46=settlement, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=settlement, #54=npc, #55=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #34=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #34=0, #44=0, #45=0, #46=0.45, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=true, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #34=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=true, #44=false, #45=true, #46=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #44=false, #45=true, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=false, #27=(unknown), #28=true, #31=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=false, #44=false, #45=false, #46=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=false, #54=false, #55=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
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
    vertexShaderHash differs: #35=59ed5d71, #36=2efa42a8, #37=b69ba143, #38=2e7a6fcb, #39=c203b19a, #40=c203b19a, #41=585a1ea4, #42=263c45d6, #43=e4717b03
    fragmentShaderHash differs: #35=d729897e, #36=41e40a66, #37=d729897e, #38=758a4164, #39=41e40a66, #40=a9dd0dee, #41=a9dd0dee, #42=d729897e, #43=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 2006 (+19):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: fd679957-0dfe-4aec-b001-846db34c60ff
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Wood'
    materialUuid: 6da21c87-cfd7-462d-be77-c7843eb2cd36
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: 82ba1f91-61b1-4d73-9656-40ee0dabd715
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
    materialUuid: 9319c7ca-3364-4f8e-a685-3eaff18c1086
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #90
    material: MeshStandardMaterial 'Green'
    materialUuid: 61e4087a-4259-4161-aeba-176f8e5574e5
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
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 424f24a1-2464-4c4f-abc7-f8b34ce3aa0e
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1bd8d9e3
    fragmentShaderHash: e2f189d1
  Program #92
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: 376da9d4-ca32-450e-91dd-e11164de8a2d
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
    vertexShaderHash: 7db7358f
    fragmentShaderHash: 800accd2
  Program #93
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 220bf60f-ef7b-454d-a19f-cd4c081f8e82
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #94
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 974b5c16-f20c-4876-ae79-cbb8058ac924
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
    materialUuid: f45f5871-0020-4b85-b9be-d1d098a1771f
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 83e57f3f
    fragmentShaderHash: 15fea9b7
  Program #96
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 4f583f59-3cb7-4962-a98a-76ee41b994ec
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 3b805e0b-fb56-4f2f-812a-05432c77b47e
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 8c8a575b-4825-42c5-b41a-b01e7e517fd8
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c75ba400-008d-4913-a72a-b4c6fb7338c9
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: ee9cda8c-d81b-4fc1-9e58-53c4f669c6ff
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #101
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: c348d071-104e-417f-a64f-956167342bef
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1e92ce5b
    fragmentShaderHash: 3735e0a9
  Program #102
    material: MeshStandardMaterial ''
    materialUuid: 9ffd9dfa-faf0-4160-98bd-b3dae07cc2ca
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 29daea16
    fragmentShaderHash: 83e94369
  Program #103
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: fb9571f4-f6f8-480d-b968-b79fc30f986f
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 7c8100cb
    fragmentShaderHash: 2c84ad03
  Program #104
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: 4366e7f4-03d2-4363-839d-9ae8844cf553
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a26aa35d
    fragmentShaderHash: cf881fac

Frame 2266 (+26):
  Program #112
    material: ShaderMaterial 'SkyShader'
    materialUuid: a9a320c1-1073-45cd-891f-0cec25d1a273
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #113
    material: ShaderMaterial ''
    materialUuid: e2c6dae9-0cb8-451a-950d-b17d52e47688
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #114
    material: MeshStandardMaterial ''
    materialUuid: fd679957-0dfe-4aec-b001-846db34c60ff
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #115
    material: MeshStandardMaterial 'Wood'
    materialUuid: 6da21c87-cfd7-462d-be77-c7843eb2cd36
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: 82ba1f91-61b1-4d73-9656-40ee0dabd715
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
    materialUuid: 9319c7ca-3364-4f8e-a685-3eaff18c1086
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #118
    material: MeshStandardMaterial 'Green'
    materialUuid: 61e4087a-4259-4161-aeba-176f8e5574e5
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
    materialUuid: 424f24a1-2464-4c4f-abc7-f8b34ce3aa0e
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ab1dd48f
    fragmentShaderHash: 8661e8c2
  Program #120
    material: MeshStandardMaterial 'BirchTree_Leaves'
    materialUuid: 376da9d4-ca32-450e-91dd-e11164de8a2d
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
    vertexShaderHash: 79ee70f3
    fragmentShaderHash: 559e694b
  Program #121
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 220bf60f-ef7b-454d-a19f-cd4c081f8e82
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 974b5c16-f20c-4876-ae79-cbb8058ac924
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
    materialUuid: f45f5871-0020-4b85-b9be-d1d098a1771f
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b4b22c53
    fragmentShaderHash: af711478
  Program #124
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 4f583f59-3cb7-4962-a98a-76ee41b994ec
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 3b805e0b-fb56-4f2f-812a-05432c77b47e
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 8c8a575b-4825-42c5-b41a-b01e7e517fd8
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c75ba400-008d-4913-a72a-b4c6fb7338c9
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: ee9cda8c-d81b-4fc1-9e58-53c4f669c6ff
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: c348d071-104e-417f-a64f-956167342bef
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 127e1a7
    fragmentShaderHash: bc850bfa
  Program #130
    material: MeshStandardMaterial ''
    materialUuid: 9ffd9dfa-faf0-4160-98bd-b3dae07cc2ca
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520711,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: e3408c64
    fragmentShaderHash: 4e17aba
  Program #131
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: fb9571f4-f6f8-480d-b968-b79fc30f986f
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 21af24b7
    fragmentShaderHash: c4ca7b4
  Program #132
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: 4366e7f4-03d2-4363-839d-9ae8844cf553
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 49797de9
    fragmentShaderHash: 32bd48fd
  Program #133
    material: ShaderMaterial ''
    materialUuid: 86abe602-36f0-4256-ac64-96c857be07d5
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
    materialUuid: f4ad20e6-8866-428f-950d-e95f96f74585
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #136
    material: ShaderMaterial ''
    materialUuid: 92c663a7-90ff-40f2-8c08-6ff651898b4a
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #137
    material: ShaderMaterial ''
    materialUuid: 3da11bbf-6c00-4954-bf32-2e16bb7ce15e
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
Excluded — no reliable per-program timing: 129 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 9
  #74
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 450.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 13
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 159.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 93
  #76
      material: MeshStandardMaterial 'Pond_Pack_MAT'
      object: Mesh 'Branch_2b'
      asset: /models/items/branch.glb
      compile/link: 930.2 ms  (upper bound — whole mirror-render call, see note above)

Frame 96
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 132.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 98
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 83.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 105
  #82
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 158.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 116
  #83
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 106.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 233
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 186.5 ms  (upper bound — whole mirror-render call, see note above)

Frame 538
  #85
      material: MeshStandardMaterial 'lambert2SG'
      object: Mesh 'chunk-vegetation-region-3,-1|reed-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 180.9 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 2388.3 ms
  programs >1 ms: 9
  max: 930.2 ms (#76)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.7 ms  p95=11.3 ms  max=11.5 ms  Δavg vs baseline=—
  hide-grass           avg=9.5 ms  p95=11.4 ms  max=11.5 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=9.0 ms  p95=10.4 ms  max=11.1 ms  Δavg vs baseline=-0.7 ms (-7%)
  no vegetation/grass  avg=8.8 ms  p95=9.8 ms  max=10.4 ms  Δavg vs baseline=-0.8 ms (-9%)
  hide-environment     avg=9.2 ms  p95=10.7 ms  max=11.5 ms  Δavg vs baseline=-0.5 ms (-5%)
  hide-settlement      avg=8.9 ms  p95=10.4 ms  max=10.9 ms  Δavg vs baseline=-0.7 ms (-8%)
  no water             avg=9.3 ms  p95=11.0 ms  max=11.4 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-terrain         avg=9.5 ms  p95=12.1 ms  max=12.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-npc-fauna       avg=7.6 ms  p95=8.6 ms  max=8.7 ms  Δavg vs baseline=-2.0 ms (-21%)
  no-shadows           avg=9.1 ms  p95=10.7 ms  max=10.7 ms  Δavg vs baseline=-0.5 ms (-5%)
  no-ao                avg=9.3 ms  p95=10.6 ms  max=12.3 ms  Δavg vs baseline=-0.3 ms (-3%)
  no-bloom             avg=9.7 ms  p95=11.9 ms  max=12.2 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-smaa              avg=9.4 ms  p95=11.2 ms  max=12.3 ms  Δavg vs baseline=-0.3 ms (-3%)
  no-god-rays          avg=9.5 ms  p95=11.5 ms  max=13.0 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-film-grade        avg=10.0 ms  p95=11.8 ms  max=12.8 ms  Δavg vs baseline=+0.3 ms (+4%)
  no postprocessing    avg=9.4 ms  p95=10.9 ms  max=11.9 ms  Δavg vs baseline=-0.3 ms (-3%)
  no mirrors           avg=10.0 ms  p95=11.8 ms  max=12.6 ms  Δavg vs baseline=+0.3 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.7 ms  p95=27.7 ms  max=28.6 ms
  CPU wall      avg=9.7 ms  p95=11.3 ms  max=11.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=13 sync ms total=490.8 max=57.2 store hits=0 prefetched=0
