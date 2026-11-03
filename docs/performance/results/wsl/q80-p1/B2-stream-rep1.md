# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T16:51:37.807Z
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
Frames: 739
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a25e47aa423419e56bb240801251d699bb6b8759
  runId: 2026-11-03T16-50-39-198Z-fusb03
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
  camera: pos=(426.7, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5082ms npc=8
  gpuTimer: available=true resolved=true samples=741 span=postprocess+labels

FPS:
  avg: 61.8
  min: 2
  p1: 10

Frame time (wall-clock):
  avg: 16.2 ms
  p50: 12.8 ms
  p95: 25.9 ms
  p99: 99.2 ms
  max: 453.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4 p95=12.2 p99=19.3 max=51.4 n=739
  render: p50=8.1 p95=14.8 p99=89.2 max=445.3 n=739
  frame: p50=12.8 p95=25.9 p99=99.2 max=453.9 n=739

Rendering (combined renderer.info):
  draw calls: 379 avg / 1539 max
  triangles: 9.32M avg
  mirror draws: 53 avg
  geometries: 665
  textures: 334

Pass submissions (actual):
  reliability: observed
  frames: 744 shadowRefresh=295 shadowSkipped=449
  mirror calls avg: 53
  shadow calls avg: 148
  main calls avg: 252

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=50 tris=836.9k meshes=50 inst=98785
  vegetation       draws=158 tris=1.31M meshes=158 inst=843
  environment      draws=53 tris=17.8k meshes=53 inst=65
  settlement       draws=358 tris=542.8k meshes=358 inst=913
  water            draws=48 tris=3.47M meshes=48 inst=48
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=171 tris=70.4k meshes=171 inst=171
  items            draws=292 tris=23.9k meshes=292 inst=292
  other            draws=219 tris=27.1k meshes=219 inst=219

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=144 tris=1.24M meshes=144 inst=811
  environment      draws=52 tris=17.8k meshes=52 inst=64
  settlement       draws=259 tris=448.8k meshes=259 inst=776
  items            draws=35 tris=18.6k meshes=35 inst=35
  other            draws=94 tris=14.4k meshes=94 inst=94

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=33 tris=50.0k meshes=33 inst=324
  houseInteractive draws=14 tris=2.2k meshes=14 inst=14
  fence            draws=4 tris=2.0k meshes=4 inst=10
  storageWoodSettlementPrimary draws=1 tris=780 meshes=1 inst=1
  storageWoodHousehold draws=1 tris=4.7k meshes=1 inst=6
  storageContainer draws=6 tris=1.9k meshes=6 inst=26
  storageHay       draws=1 tris=488 meshes=1 inst=1
  storageTrough    draws=4 tris=1.4k meshes=4 inst=14
  workplace        draws=4 tris=3.5k meshes=4 inst=4
  landmarkWellCentral draws=5 tris=1.9k meshes=5 inst=5
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=1 tris=1.6k meshes=1 inst=2
  landmarkNoticeBoard draws=2 tris=36 meshes=2 inst=2
  fireHouseInteriorLamp draws=6 tris=648 meshes=6 inst=6
  decor            draws=165 tris=353.8k meshes=165 inst=243
  other            draws=7 tris=21.9k meshes=7 inst=113

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=2 draws=19 tris=22.0k skinned=19/19
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Ranger_NoHood    agents=1 draws=14 tris=16.3k skinned=14/14
      Knight_Cloth     agents=1 draws=9 tris=11.9k skinned=9/9
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=8 tris=10.9k skinned=8/8
    by distance band:
      far  agents=8 camera-relevant=0 draws=77 tris=99.5k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=7 draws=28 tris=13.7k skinned=28/28
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      dog              agents=2 draws=10 tris=3.8k skinned=10/10
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      sheep            agents=4 draws=8 tris=2.4k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rat              agents=1 draws=2 tris=4.0k skinned=2/2
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      far  agents=42 camera-relevant=0 draws=171 tris=70.4k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=65 composed=65 multiplied=65 skinned=0
  grass                    nodes=65 composed=65 multiplied=65 skinned=0
  vegetation               nodes=187 composed=187 multiplied=187 skinned=0
  environment              nodes=73 composed=73 multiplied=73 skinned=0
  settlement               nodes=703 composed=703 multiplied=703 skinned=0
  water                    nodes=48 composed=48 multiplied=48 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1776 composed=1776 multiplied=1776 skinned=151
  items                    nodes=455 composed=455 multiplied=455 skinned=0
  other                    nodes=426 composed=409 multiplied=426 skinned=9
  top scene children:
    fauna ×42                nodes=1776 composed=1776 multiplied=1776 skinned=151
    settlement ×1            nodes=703 composed=703 multiplied=703 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    chunk-items ×29          nodes=452 composed=452 multiplied=452 skinned=0
    Group ×36                nodes=244 composed=244 multiplied=244 skinned=9
    chunk ×65                nodes=65 composed=65 multiplied=65 skinned=0
    chunk-grass ×15          nodes=65 composed=65 multiplied=65 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    chunk-water ×47          nodes=47 composed=47 multiplied=47 skinned=0
    chunk-river ×42          nodes=42 composed=42 multiplied=42 skinned=0
    Object3D ×30             nodes=30 composed=30 multiplied=30 skinned=0
    chunk-vegetation ×1      nodes=19 composed=19 multiplied=19 skinned=0

Systems:
  WATER          1.3 ms
  STREAMING      1.0 ms
  NPC            1.1 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         9.3 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. WATER

Critical spikes:
  STREAMING: 12
  WATER: 9

Hitches (>= 8 ms): total=21
  chunk mesh             n=12 avg=13.1 max=44.6
  chunk water            n=9 avg=10.7 max=14.0

Isolation probes:
  full               render=5.3 ms draws=213 tris=4.36M
  hide-grass         render=4.9 ms draws=188 tris=4.03M
  hide-vegetation    render=4.3 ms draws=118 tris=2.83M
  hide-vegetation-grass render=4.0 ms draws=93 tris=2.48M
  hide-environment   render=4.8 ms draws=202 tris=4.36M
  hide-settlement    render=4.6 ms draws=216 tris=4.42M
  hide-water         render=4.9 ms draws=205 tris=3.68M
  hide-terrain       render=5.9 ms draws=192 tris=2.68M
  hide-npc-fauna     render=4.2 ms draws=213 tris=4.36M
  no-shadows         render=5.2 ms draws=207 tris=4.20M
  no-ao              render=5.4 ms draws=207 tris=4.36M
  no-bloom           render=5.6 ms draws=200 tris=4.36M
  no-smaa            render=5.5 ms draws=210 tris=4.36M
  no-god-rays        render=5.1 ms draws=214 tris=4.37M
  no-film-grade      render=5.1 ms draws=214 tris=4.37M
  no-postprocessing  render=5.1 ms draws=193 tris=4.42M
  no-reflections     render=5.3 ms draws=179 tris=3.57M

Frame attribution:
  frame max: 453.9 ms
  largest labelled hitch: 44.6 ms
  unattributed: 409.3 ms

Long frames:
  threshold: 80 ms
  count: 10
  worst: 453.9 ms

Raw sidecar:
  sampling=full factor=1 exported=739/739

Recommendation:
Largest frame (453.9 ms) is not explained by labelled hitches (largest 44.6 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 29

NPC:
  total: 1.1 ms/frame
  crowd pass: 0.0 ms/frame (3.4 ms cumulative)
  agent updates: 0.6 ms/frame (425.9 ms cumulative)
  livestock: 0.4 ms/frame (266.6 ms cumulative)
    loaded tick: 0.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 12.1
    unique animals/frame: 12.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 2.0
    dog guard scans: 2.0/frame (14.1 predator candidates/frame)
    pest scans: 0.7/frame (0.7 rat candidates/frame)
    nearest scans: 4.8/frame (0.0 candidates/frame)
    water samples: 10.1/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 10.1/frame, 0.00 ms/frame (worst call 2.00 ms, 1650.0 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 11.0
    behaviour executions/frame: 5.1
    presentation executions/frame: 4.5
  rats: 0.1 ms/frame (53.5 ms cumulative)
  social: 0.0 ms/frame (3.3 ms cumulative)
  streaming: 0.0 ms/frame (0.9 ms cumulative)
  maintenance: 0.1 ms/frame (58.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.4 ms/frame (1043.0 ms cumulative)
  forest sampling: 0.1 ms/frame (68.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (20.6 ms cumulative)
    targeting: 0.0 ms/frame (11.4 ms cumulative)
    decision: 0.0 ms/frame (16.3 ms cumulative)
    behaviour: 0.7 ms/frame (553.5 ms cumulative)
    life/presentation: 0.4 ms/frame (285.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.2
    sensing passes/frame: 29.2
    decision passes/frame: 29.2
    high-priority agents/frame: 0.8
    expensive behaviour agents/frame: 16.7
    full-rate agents/frame: 8.4
    reduced-cadence agents/frame: 20.8
    behaviour executions/frame: 17.5
    presentation executions/frame: 16.2

  sensing/cache:
    forest samples/frame: 29.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 50.5
    player perception checks/frame: 29.2

  nearest scans: 22.4/frame (16560 calls)
  nearest candidates checked: 87.8/frame (64868 total)
  herd leader scans: 0.2/frame (177 calls)
  herd candidates checked: 6.9/frame (5133 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.5/frame (165.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 41.8/frame, 0.10 ms/frame (worst call 3.90 ms)
    collider queries: 41.8/frame, 0.10 ms/frame (worst call 4.00 ms, 5810.5 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 15
  empty builds (no instances): 72
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.18 ms
    max 0.70 ms

  allocation/setup:
    avg 0.10 ms
    max 0.50 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.06 ms
    max 0.30 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.43 ms
    max 1.40 ms

  per chunk:
    instances avg/max 3866.1 / 6988
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 57992 / 0
    matrix instances bound: 57992
    instanced attributes created: 225
    shared material refs: 45
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 23/23
    instances: 134741 (max 32465)
    allocation/setup avg/max: 0.05 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 23/23
    instances: 44671 (max 10763)
    allocation/setup avg/max: 0.04 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 23/23
    instances: 177517 (max 44129)
    allocation/setup avg/max: 0.02 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 8/8
    instances: 637461 (max 184195)
    allocation/setup avg/max: 0.06 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=333014 filler=289574
Submitted instances: full=76794 filler=21989
Meshes submitted: 48
LOD submitted fraction: full=0.23060291759505605 filler=0.07593568483358312
Flowers: unavailable
Allocation bytes (estimated): 59768448
Upload bytes (observed): unavailable
Lifecycle: req=30 complete=30 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=21 invalidate=0
Finalization: observed completions=30

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 744
Shadow refresh frames: 295
Shadow skipped frames: 449

Mirror:
  calls avg: 53  tris avg: 685852
  info calls avg: 53  residual calls avg: 0
  switches avg: material=23.4 program=15.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3 skeletons first used=3
  environment                  calls=3 tris=2962
  items                        calls=0 tris=126
  other                        calls=20 tris=4298
  settlement:decor             calls=2 tris=7049
  settlement:fence             calls=0 tris=24
  settlement:fireHouseExteriorLamp calls=0 tris=7
  settlement:fireHouseInteriorLamp calls=0 tris=5
  settlement:fireVillageTorch  calls=0 tris=7
  settlement:houseInteractive  calls=0 tris=18
  settlement:houseStatic       calls=1 tris=1052
  settlement:landmarkWellHousehold calls=0 tris=30
  settlement:other             calls=0 tris=704
  settlement:storageBarrel     calls=0 tris=264
  settlement:storageContainer  calls=0 tris=60
  settlement:storageGoods      calls=0 tris=92
  settlement:storageTrough     calls=0 tris=35
  settlement:storageWoodHousehold calls=0 tris=145
  settlement:storageWoodSettlementPrimary calls=0 tris=5
  terrain                      calls=5 tris=352718
  vegetation                   calls=21 tris=316377

Shadow (refresh only):
  calls avg: 148  tris avg: 1812095
  info calls avg: 148  residual calls avg: 0
  switches avg: material=67.1 program=68.5  actor: calls=12.7 material=0 program=2.2
  skinning avg: skinned calls=16.3 skeletons first used=7.5
  environment                  calls=8 tris=6141
  faunaFamily:boar             calls=1 tris=595
  faunaFamily:chicken          calls=1 tris=105
  faunaFamily:cow              calls=1 tris=191
  faunaFamily:dog              calls=1 tris=338
  faunaFamily:horse            calls=1 tris=237
  faunaFamily:rabbit           calls=0 tris=297
  faunaFamily:rat              calls=0 tris=163
  faunaFamily:rooster          calls=0 tris=114
  faunaFamily:sheep            calls=1 tris=215
  faunaFamily:stag             calls=3 tris=1630
  items                        calls=4 tris=1729
  npcFamily:Farmer             calls=1 tris=1247
  npcFamily:Knight_Cloth       calls=1 tris=808
  npcFamily:Peasant            calls=2 tris=2027
  npcFamily:Peasant_Boots      calls=0 tris=414
  npcFamily:Ranger_NoHood      calls=0 tris=551
  npcFamily:woodcutter         calls=0 tris=442
  other                        calls=33 tris=9167
  settlement:decor             calls=21 tris=51123
  settlement:fence             calls=0 tris=107
  settlement:fireHouseInteriorLamp calls=1 tris=68
  settlement:houseInteractive  calls=2 tris=241
  settlement:houseStatic       calls=5 tris=6821
  settlement:landmarkGarden    calls=0 tris=260
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=1 tris=221
  settlement:landmarkWellPasture calls=0 tris=27
  settlement:other             calls=1 tris=4151
  settlement:storageContainer  calls=1 tris=318
  settlement:storageHay        calls=0 tris=61
  settlement:storageTrough     calls=0 tris=211
  settlement:storageWoodHousehold calls=0 tris=825
  settlement:storageWoodSettlementPrimary calls=0 tris=85
  settlement:workplace         calls=0 tris=404
  terrain                      calls=14 tris=1051561
  vegetation                   calls=44 tris=669196

Main:
  calls avg: 252  tris avg: 7888027
  info calls avg: 325  residual calls avg: 0
  switches avg: material=124.3 program=48.6  actor: calls=5.1 material=4 program=2
  skinning avg: skinned calls=13.7 skeletons first used=5.1
  environment                  calls=9 tris=7825
  faunaFamily:bear             calls=0 tris=295
  faunaFamily:chicken          calls=0 tris=47
  faunaFamily:cow              calls=0 tris=119
  faunaFamily:dog              calls=0 tris=77
  faunaFamily:horse            calls=0 tris=38
  faunaFamily:rabbit           calls=0 tris=136
  faunaFamily:rat              calls=0 tris=16
  faunaFamily:rooster          calls=0 tris=45
  faunaFamily:sheep            calls=0 tris=100
  faunaFamily:stag             calls=0 tris=114
  faunaFamily:wolf             calls=1 tris=588
  grass                        calls=36 tris=5180356
  items                        calls=43 tris=3906
  npcFamily:Farmer             calls=0 tris=247
  npcFamily:Knight_Cloth       calls=0 tris=608
  npcFamily:Peasant            calls=1 tris=1121
  npcFamily:Ranger_NoHood      calls=0 tris=109
  other                        calls=71 tris=14609
  settlement:decor             calls=5 tris=15715
  settlement:fence             calls=0 tris=49
  settlement:fireHouseExteriorLamp calls=0 tris=15
  settlement:fireHouseInteriorLamp calls=0 tris=11
  settlement:fireVillageTorch  calls=0 tris=22
  settlement:houseInteractive  calls=0 tris=42
  settlement:houseStatic       calls=2 tris=2239
  settlement:landmarkGarden    calls=0 tris=602
  settlement:landmarkNoticeBoard calls=0 tris=0
  settlement:landmarkWellCentral calls=0 tris=33
  settlement:landmarkWellHousehold calls=0 tris=67
  settlement:other             calls=0 tris=1615
  settlement:storageBarrel     calls=0 tris=618
  settlement:storageContainer  calls=1 tris=135
  settlement:storageGoods      calls=1 tris=204
  settlement:storageHay        calls=0 tris=1
  settlement:storageTrough     calls=0 tris=82
  settlement:storageWoodHousehold calls=0 tris=327
  settlement:storageWoodSettlementPrimary calls=0 tris=14
  settlement:workplace         calls=0 tris=33
  terrain                      calls=19 tris=1432829
  vegetation                   calls=52 tris=739561
  water                        calls=7 tris=483757


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

[LONG FRAME] 453.9ms
simulate         7.5ms
render         445.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.1ms
NPC              1.4ms
FAUNA            1.5ms
PHYSICS          0.2ms
RENDER         445.1ms
OTHER            5.5ms

Long frame #2:

[LONG FRAME] 183.2ms
simulate         6.9ms
render         176.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA            1.9ms
PHYSICS          0.1ms
RENDER         176.1ms
OTHER            3.4ms

Long frame #3:

[LONG FRAME] 163.9ms
simulate         6.4ms
render         157.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.4ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA            1.2ms
PHYSICS          0.2ms
RENDER         149.9ms
OTHER            3.6ms

Long frame #4:

[LONG FRAME] 159.1ms
simulate        14.6ms
render         143.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        3.5ms
NPC              1.3ms
FAUNA            5.5ms
PHYSICS          0.2ms
RENDER         143.4ms
OTHER            5.1ms

streaming / stages:
  chunkUpdate                  3.5ms
  riverChannelSegmentsNear     0.9ms
  terrainPrepare               0.3ms
  riverTileBuild               0.2ms

Long frame #5:

[LONG FRAME] 157.8ms
simulate        13.2ms
render         143.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.4ms
STREAMING        2.1ms
NPC              3.4ms
FAUNA            3.7ms
PHYSICS          0.2ms
RENDER         143.1ms
OTHER            4.9ms

streaming / stages:
  chunkUpdate                  2.1ms

---

[Seedvale Program Census]

Programs created: 134
Program count: final=134 max=134

By frame:
  frame 0   +91 programs   <== largest transition
  frame 144   +1 program
  frame 146   +1 program
  frame 185   +2 programs
  frame 269   +1 program
  frame 1258   +14 programs
  frame 1302   +3 programs
  frame 1518   +21 programs

Largest transition — frame 0 (+91 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=ca32daaf stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6943b157-8a3a-445d-ae5d-766edf31c840 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9ec15ec9-edd1-4a53-b591-642788581d1f
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=d8de1b3d-beee-4df2-ab20-7e97b7aff388
  #3 type=ShaderMaterial name='' bucket=other cacheKey=4,5,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a53662a8-ccdd-42b5-ba7a-4a26582ab297
  #4 type=ShaderMaterial name='' bucket=water cacheKey=6,7,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2bcc28b6-411b-4e87-9459-ae0716e67573
  #5 type=ShaderMaterial name='' bucket=water cacheKey=6,7,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=eed1aa49-99bb-4d31-9832-f61b4ba15514
  #6 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=845d3716-726d-4ea0-b4c8-7990586c8d04
  #7 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=fd434342-0b90-4623-9f9a-8b3174c60055
  #8 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5da19242-7804-41fb-a393-7d2e9b3a4180 (Wood)
  #9 type=ShaderMaterial name='' cacheKey=8,9,highp,srgb-linear,fa… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #10 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #11 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9fbc7695-edf8-4064-91bc-c025e6e365be
  #12 type=ShaderMaterial name='' bucket=grass cacheKey=10,11,highp,srgb-linear,… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ecbeb219-2678-4b9b-bf8b-a6812877ba52
  #13 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5aa8c3eb-a448-4782-977e-3e43c8709c64 (Main)
  #14 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=ebfa71bd fHash=3f59c0a3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=213863c5-c1d6-42a9-a216-cf16f4e38568 (Main)
  #15 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bfe5c98f-e10f-47d4-92bf-d3ea11d8560f (Material.001)
  #16 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=844e40f6-f14f-4b13-988d-c309d245fb06 (lambert2SG)
  #17 type=MeshPhysicalMaterial name='Material #55.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=28fefd22 fHash=d3c0e09e stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e39849c7-7924-4d0c-a0b0-ee2bcfa64877 (Material #55.002)
  #18 type=MeshPhysicalMaterial name='Material #54.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=b1c1b8a0 fHash=27c8d486 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e11b53ab-b39f-4201-92c4-72e8fb4baae5 (Material #54.002)
  #19 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=4be16ad2 fHash=63f37341 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=cb7415dd-a4de-4196-8dee-023edb37e0b5 (BlackBear_mat)
  #20 type=MeshStandardMaterial name='Mushrooms' bucket=items cacheKey=physical,STANDARD,,highp… vHash=b4b22c53 fHash=4b6ecb51 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=cd9876e7-ddc0-4492-884b-abffa83b7599 (Mushrooms)
  #21 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=363257d1-0656-497a-8597-832c6c009e03 (Green)
  #22 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7f82e321-955f-44dd-a6c3-d6a83a9015ec (Stone)
  #23 type=MeshStandardMaterial name='NormalTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=ab1dd48f fHash=943c7b97 stage=postprocess-render
  #24 type=MeshStandardMaterial name='Leaves_NormalTree' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c8df3222 fHash=7a23219b stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1dacd1c9-9560-4b34-a5b0-76b6c4a91621 (Leaves_NormalTree)
  #25 type=MeshStandardMaterial name='Wood' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=643ad3a2 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2f6e8c86-41fe-4e73-90c0-fb24add6ad98 (Wood)
  #26 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=items cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6d83e182-8a33-4f62-9949-c809cba959ad (Pond_Pack_MAT)
  #27 type=MeshStandardMaterial name='PineTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=86d8050b fHash=9f0671e7 stage=postprocess-render
  #28 type=MeshStandardMaterial name='PineTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=6550e08d fHash=e1e27532 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=314fc537-f051-4fc3-b191-473232014514 (Flowers)
  #29 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=80917d5e fHash=633146b4 stage=postprocess-render
  #30 type=MeshStandardMaterial name='bush_berry_red' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=a9324552 fHash=9b37dc78 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=21e4a040-0e36-42f2-af08-638aba122632 (bush_berry_red)
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6c978edc-e115-449a-b771-5382db9520f8 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c9ddbbc4-e589-4dc8-9a2a-c796e6399db1 (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=52b405f5-bb5c-4501-8ea2-80e4b2e93cc0 (MI_Hair_1)
  #34 type=MeshStandardMaterial name='lambert2SG' cacheKey=physical,STANDARD,,highp… vHash=a369060f fHash=f6cbc3c stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=7c1e7b69 fHash=758a4164 stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=1c1d4a6 fHash=97cbbbfc stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=63010727 fHash=41e40a66 stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c844a62a fHash=758a4164 stage=postprocess-render
  #48 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3d5bb292-15c0-46e6-9676-0fe74fc75c28 (Green)
  #49 type=MeshStandardMaterial name='MapleTree_Bark' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=38628d56-6710-490b-9175-8c0bdcbca4b0 (NormalTree_Bark)
  #50 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7e8eb348-073e-4b3e-9b8b-68c8056dd105 (PineTree_Leaves)
  #51 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e7bb73c7-ca17-461a-b4cd-3174745bd517 (stockpiles_vc)
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=bf9e6246-61e8-42fa-8528-a576e044d5e8
  #53 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f76505f6-ca9f-49bf-980e-8abd39b162dd (MI_Regular_Male)
  #54 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5d12b9ec-9895-4299-92a0-0c945dfcb2ea (MI_Eyes)
  #55 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=c8835478-7614-4ced-86d4-5e3801463458 (MI_WoodTrim)
  #56 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=2e4ebd30-e3b3-4768-b8f3-cf6a366e95ce (MI_WoodTrim)
  #57 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=41dedd48-bdc4-43af-95de-4ebc7375bdd2
  #58 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2b6c8be7 fHash=d9be0b50 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=0ee6c4a6-87ce-41a0-91ac-1713d888d15f
  #59 type=MeshStandardMaterial name='MI_Trim_Furniture' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=80dfdc64 fHash=58b0f5f4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f3691081-31be-4dfe-81be-18249522a4e2 (MI_Trim_Props_Vertex)
  #60 type=MeshStandardMaterial name='White' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f299d5d7 fHash=1b5e9115 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=136d78b9-fb76-4d0f-92a8-3d0b303871d9 (Main)
  #61 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=9030af55 fHash=d45c027b stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a08dedbf-b006-4710-8967-f86b85321b1e (Material.001)
  #62 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d253171c-cdc8-4831-af91-902d0cbe9750 (MI_Knight)
  #63 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b42ee89d-0010-4ca2-b92c-e4cff74f24b8 (MI_Hair_1)
  #64 type=MeshStandardMaterial name='SV_WorkSkirtBlue' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=d8e50ec3 fHash=189af887 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6c7220f2-490d-47d1-bb6a-d4b46ee807a4 (SV_WorkSkirtBlue)
  #65 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=afb8de20 fHash=950d7105 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=086ec44d-a909-45bf-b53a-b2f64e64e42e (MI_Peasant)
  #66 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=9dc1f851 fHash=baf2480 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d71da703-9de1-4806-b457-d0e7bbecd87f (MI_Peasant)
  #67 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #69 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #70 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0928425d-d2d1-480e-8952-05ec26dfe229 (MI_WindowGlass)
  #71 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #72 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2ae04e95-c56f-4a3e-a4e0-0995a0dddc67 (MI_WindowGlass)
  #73 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #74 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #75 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #76 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #77 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #78 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #79 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #80 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #81 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #82 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #83 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #84 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #85 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #86 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #87 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #88 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #89 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=669a1bfa stage=postprocess-render
  #90 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=22690955, #4=1bb00362, #5=e6d01ae7, #9=5b43c776, #12=3f71df04, #67=f92c8d8c, #68=df7c703d, #73=279cec18, #74=84736a68, #75=aa2edbee, #76=7bae0bb2, #77=436caea4, #78=886438e7, #79=d99a5b29, #80=2003ced8, #81=28dfa407, #82=756a0b19, #83=b2354ff2, #84=ea82969e, #85=7dab8d9a, #86=378e1fb7, #87=78acf7ea, #88=a312c579, #89=b817515d
    fragmentShaderHash differs: #0=ca32daaf, #1=ae17ade6, #3=2cf9fa62, #4=a38bbf04, #5=e34491ff, #9=70b71dad, #12=d4350921, #67=87d053eb, #68=236b3b0b, #73=4d6bcede, #74=ffecb62a, #75=76ced00a, #76=fb55b3c0, #77=2d687ef1, #78=dc2a89b5, #79=109e33fc, #80=db0f470a, #81=9775cd0e, #82=5c741650, #83=2aad9943, #84=a2297d9f, #85=1022767b, #86=ce0bf6b4, #87=707f290c, #88=c05e2256, #89=669a1bfa
    bucket differs: #0=other, #1=other, #3=other, #4=water, #5=water, #9=(unknown), #12=grass, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=(unset), #4=1, #5=(unset), #9=(unset), #12=(unset), #67=(unset), #68=(unset), #73=(unset), #74=(unset), #75=(unset), #76=(unset), #77=(unset), #78=(unset), #79=(unset), #80=(unset), #81=(unset), #82=(unset), #83=(unset), #84=(unset), #85=(unset), #86=(unset), #87=(unset), #88=(unset), #89=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #9=(unknown), #12=0, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #9=(unknown), #12=true, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #9=(unknown), #12=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #9=(unknown), #12=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
  MeshStandardMaterial (46 programs):
    vertexShaderHash differs: #2=5c2c57a3, #6=e3408c64, #8=d38f15a4, #13=54e03756, #14=ebfa71bd, #15=a99aa494, #16=7bb77142, #19=4be16ad2, #20=b4b22c53, #21=c0d790d1, #22=a9733c9d, #23=ab1dd48f, #24=c8df3222, #25=643ad3a2, #26=c3bc6325, #27=86d8050b, #28=6550e08d, #29=80917d5e, #30=a9324552, #31=842fe1df, #32=ac268392, #33=1c179521, #34=a369060f, #48=190d3a9c, #49=9dbe8ee7, #50=3bea20f6, #51=a64d124e, #52=94297e69, #53=20daccfa, #54=1dcbc6ff, #55=12873951, #56=c5e73b05, #57=66d360c8, #58=2b6c8be7, #59=80dfdc64, #60=f299d5d7, #61=9030af55, #62=140c5e62, #63=ee59055a, #64=d8e50ec3, #65=afb8de20, #66=9dc1f851, #69=13a74ec7, #70=9dcf1cb4, #71=fc941d05, #72=e551c572
    fragmentShaderHash differs: #2=e354d864, #6=c0b8fc9f, #8=6578c10d, #13=d391c52, #14=3f59c0a3, #15=63f9c0d1, #16=87728b15, #19=63f37341, #20=4b6ecb51, #21=a81023c3, #22=bd723c8a, #23=943c7b97, #24=7a23219b, #25=6578c10d, #26=ded4be89, #27=9f0671e7, #28=e1e27532, #29=633146b4, #30=9b37dc78, #31=34995f15, #32=25a41317, #33=71f22dc6, #34=f6cbc3c, #48=633146b4, #49=8dba9dd, #50=5b26a60d, #51=546e469, #52=aa0735a8, #53=a8862f4a, #54=1a1c0d8, #55=d4c95125, #56=d4c95125, #57=c0b8fc9f, #58=d9be0b50, #59=58b0f5f4, #60=1b5e9115, #61=d45c027b, #62=46d4b31c, #63=e8d88acf, #64=189af887, #65=950d7105, #66=baf2480, #69=3ab4c629, #70=2d1aa4a, #71=3ab4c629, #72=2d1aa4a
    bucket differs: #2=terrain, #6=other, #8=other, #13=fauna, #14=fauna, #15=fauna, #16=fauna, #19=fauna, #20=items, #21=vegetation, #22=environment, #23=(unknown), #24=vegetation, #25=environment, #26=items, #27=(unknown), #28=vegetation, #29=(unknown), #30=vegetation, #31=other, #32=other, #33=other, #34=(unknown), #48=vegetation, #49=vegetation, #50=vegetation, #51=settlement, #52=other, #53=other, #54=other, #55=settlement, #56=settlement, #57=settlement, #58=settlement, #59=settlement, #60=fauna, #61=fauna, #62=npc, #63=npc, #64=npc, #65=npc, #66=npc, #69=(unknown), #70=settlement, #71=(unknown), #72=settlement
    define STANDARD differs: #2=, #6=, #8=, #13=, #14=, #15=, #16=, #19=, #20=, #21=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #29=(unset), #30=, #31=, #32=, #33=, #34=(unset), #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=, #57=, #58=, #59=, #60=, #61=, #62=, #63=, #64=, #65=, #66=, #69=(unset), #70=, #71=(unset), #72=
    flag alphaTest differs: #2=0, #6=0, #8=0, #13=0, #14=0, #15=0, #16=0, #19=0, #20=0, #21=0, #22=0, #23=(unknown), #24=0.45, #25=0, #26=0, #27=(unknown), #28=0.45, #29=(unknown), #30=0.5, #31=0, #32=0, #33=0, #34=(unknown), #48=0, #49=0, #50=0.5, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0, #59=0, #60=0, #61=0, #62=0, #63=0, #64=0, #65=0, #66=0, #69=(unknown), #70=0, #71=(unknown), #72=0
    flag envMap differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #19=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag flatShading differs: #2=false, #6=true, #8=false, #13=false, #14=false, #15=false, #16=false, #19=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=true, #53=false, #54=false, #55=false, #56=false, #57=true, #58=true, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag fog differs: #2=true, #6=true, #8=true, #13=true, #14=true, #15=true, #16=true, #19=true, #20=true, #21=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #29=(unknown), #30=true, #31=true, #32=true, #33=true, #34=(unknown), #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true, #59=true, #60=true, #61=true, #62=true, #63=true, #64=true, #65=true, #66=true, #69=(unknown), #70=true, #71=(unknown), #72=true
    flag map differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=true, #19=true, #20=true, #21=false, #22=false, #23=(unknown), #24=true, #25=false, #26=true, #27=(unknown), #28=true, #29=(unknown), #30=true, #31=true, #32=true, #33=true, #34=(unknown), #48=false, #49=true, #50=true, #51=false, #52=false, #53=true, #54=true, #55=true, #56=true, #57=false, #58=false, #59=true, #60=false, #61=false, #62=true, #63=true, #64=false, #65=true, #66=true, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag normalMap differs: #2=true, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #19=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=true, #56=true, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag transparent differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #19=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=true, #71=(unknown), #72=true
    flag vertexColors differs: #2=true, #6=false, #8=false, #13=false, #14=true, #15=false, #16=false, #19=true, #20=false, #21=false, #22=false, #23=(unknown), #24=true, #25=false, #26=true, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=true, #32=true, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=true, #52=false, #53=true, #54=true, #55=false, #56=false, #57=false, #58=true, #59=true, #60=false, #61=true, #62=false, #63=false, #64=false, #65=false, #66=true, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag wireframe differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #19=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
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
  MeshPhysicalMaterial (2 programs):
    vertexShaderHash differs: #17=28fefd22, #18=b1c1b8a0
    fragmentShaderHash differs: #17=d3c0e09e, #18=27c8d486
    flag vertexColors differs: #17=false, #18=true
  MeshDepthMaterial (13 programs):
    vertexShaderHash differs: #35=59ed5d71, #36=2efa42a8, #37=b69ba143, #38=2e7a6fcb, #39=c203b19a, #40=7c1e7b69, #41=c203b19a, #42=585a1ea4, #43=1c1d4a6, #44=263c45d6, #45=e4717b03, #46=63010727, #47=c844a62a
    fragmentShaderHash differs: #35=d729897e, #36=41e40a66, #37=d729897e, #38=758a4164, #39=41e40a66, #40=758a4164, #41=a9dd0dee, #42=a9dd0dee, #43=97cbbbfc, #44=d729897e, #45=41e40a66, #46=41e40a66, #47=758a4164
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1258 (+14):
  Program #96
    material: MeshStandardMaterial ''
    materialUuid: d8de1b3d-beee-4df2-ab20-7e97b7aff388
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #97
    material: MeshStandardMaterial 'Wood'
    materialUuid: 0fb810b1-451a-4ed5-ac31-1f1b27d69c69
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #98
    material: MeshStandardMaterial 'Green'
    materialUuid: 3d5bb292-15c0-46e6-9676-0fe74fc75c28
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
  Program #99
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: 2f6e8c86-41fe-4e73-90c0-fb24add6ad98
    object: Mesh 'chunk-environment-region-0,0|fallenLog-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #100
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 8f5659f7-b328-4065-81f8-cfaec7c2d325
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #101
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3a541371-0503-4893-83d8-b82173e6eea8
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
  Program #102
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 911a3e02-7da3-4d65-98ed-36371761fb65
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #103
    material: MeshStandardMaterial 'bush_berry_blue'
    materialUuid: 21e4a040-0e36-42f2-af08-638aba122632
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 7f5a6061
    fragmentShaderHash: 3c069eef
  Program #104
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 1dacd1c9-9560-4b34-a5b0-76b6c4a91621
    object: Mesh 'settlement-bushes-4:0'
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
  Program #105
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: f76505f6-ca9f-49bf-980e-8abd39b162dd
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #106
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 5d12b9ec-9895-4299-92a0-0c945dfcb2ea
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #107
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 6c978edc-e115-449a-b771-5382db9520f8
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #108
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c9ddbbc4-e589-4dc8-9a2a-c796e6399db1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #109
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 52b405f5-bb5c-4501-8ea2-80e4b2e93cc0
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1518 (+21):
  Program #113
    material: ShaderMaterial 'SkyShader'
    materialUuid: 6943b157-8a3a-445d-ae5d-766edf31c840
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: dbd39394
  Program #114
    material: ShaderMaterial ''
    materialUuid: ecbeb219-2678-4b9b-bf8b-a6812877ba52
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #115
    material: MeshStandardMaterial ''
    materialUuid: d8de1b3d-beee-4df2-ab20-7e97b7aff388
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #116
    material: MeshStandardMaterial 'Wood'
    materialUuid: 0fb810b1-451a-4ed5-ac31-1f1b27d69c69
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #117
    material: MeshStandardMaterial 'Green'
    materialUuid: 3d5bb292-15c0-46e6-9676-0fe74fc75c28
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
  Program #118
    material: MeshStandardMaterial 'lambert2SG'
    materialUuid: 2f6e8c86-41fe-4e73-90c0-fb24add6ad98
    object: Mesh 'chunk-environment-region-0,0|fallenLog-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #119
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 8f5659f7-b328-4065-81f8-cfaec7c2d325
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3a541371-0503-4893-83d8-b82173e6eea8
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
    materialUuid: 911a3e02-7da3-4d65-98ed-36371761fb65
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'bush_berry_blue'
    materialUuid: 21e4a040-0e36-42f2-af08-638aba122632
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 893dfcb5
    fragmentShaderHash: 95a4d290
  Program #123
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 1dacd1c9-9560-4b34-a5b0-76b6c4a91621
    object: Mesh 'settlement-bushes-4:0'
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
  Program #124
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: f76505f6-ca9f-49bf-980e-8abd39b162dd
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 5d12b9ec-9895-4299-92a0-0c945dfcb2ea
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 6c978edc-e115-449a-b771-5382db9520f8
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: c9ddbbc4-e589-4dc8-9a2a-c796e6399db1
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 52b405f5-bb5c-4501-8ea2-80e4b2e93cc0
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: ShaderMaterial ''
    materialUuid: eed1aa49-99bb-4d31-9832-f61b4ba15514
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #130
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #131
    material: MeshBasicMaterial ''
    materialUuid: fd434342-0b90-4623-9f9a-8b3174c60055
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #132
    material: ShaderMaterial ''
    materialUuid: 9f6c7c22-c869-478b-9700-76b32f770a80
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #133
    material: ShaderMaterial ''
    materialUuid: 701d0844-afaf-42d4-a52a-efa3c50aefb3
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

Frame 144
  #91
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 440.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 146
  #92
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 138.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 269
  #95
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 81.9 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 660.3 ms
  programs >1 ms: 3
  max: 440.1 ms (#91)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.3 ms  p95=7.1 ms  max=7.8 ms  Δavg vs baseline=—
  hide-grass           avg=4.9 ms  p95=5.6 ms  max=6.4 ms  Δavg vs baseline=-0.4 ms (-7%)
  hide-vegetation      avg=4.3 ms  p95=5.4 ms  max=6.9 ms  Δavg vs baseline=-1.0 ms (-19%)
  no vegetation/grass  avg=4.0 ms  p95=4.9 ms  max=5.2 ms  Δavg vs baseline=-1.2 ms (-23%)
  hide-environment     avg=4.8 ms  p95=5.3 ms  max=5.7 ms  Δavg vs baseline=-0.5 ms (-10%)
  hide-settlement      avg=4.6 ms  p95=5.6 ms  max=6.1 ms  Δavg vs baseline=-0.7 ms (-12%)
  no water             avg=4.9 ms  p95=5.7 ms  max=6.1 ms  Δavg vs baseline=-0.4 ms (-7%)
  hide-terrain         avg=5.9 ms  p95=12.2 ms  max=17.0 ms  Δavg vs baseline=+0.6 ms (+12%)
  hide-npc-fauna       avg=4.2 ms  p95=4.9 ms  max=5.6 ms  Δavg vs baseline=-1.1 ms (-21%)
  no-shadows           avg=5.2 ms  p95=6.0 ms  max=6.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-ao                avg=5.4 ms  p95=7.2 ms  max=7.4 ms  Δavg vs baseline=+0.1 ms (+2%)
  no-bloom             avg=5.6 ms  p95=7.2 ms  max=7.7 ms  Δavg vs baseline=+0.3 ms (+6%)
  no-smaa              avg=5.5 ms  p95=7.5 ms  max=7.7 ms  Δavg vs baseline=+0.2 ms (+4%)
  no-god-rays          avg=5.1 ms  p95=6.1 ms  max=7.0 ms  Δavg vs baseline=-0.1 ms (-3%)
  no-film-grade        avg=5.1 ms  p95=6.3 ms  max=6.4 ms  Δavg vs baseline=-0.2 ms (-3%)
  no postprocessing    avg=5.1 ms  p95=6.2 ms  max=6.8 ms  Δavg vs baseline=-0.1 ms (-3%)
  no mirrors           avg=5.3 ms  p95=5.9 ms  max=6.1 ms  Δavg vs baseline=+0.1 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=20.4 ms  p95=23.1 ms  max=24.4 ms
  CPU wall      avg=5.3 ms  p95=7.1 ms  max=7.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=4 prefetched=14
