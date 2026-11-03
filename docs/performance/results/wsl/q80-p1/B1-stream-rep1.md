# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T15:13:40.093Z
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
Frames: 643
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0fd9a5443e86d86e8f0324e138ffad505b644fc2
  runId: 2026-11-03T15-12-42-376Z-345npj
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
  populationGate: stable waited=5008ms npc=8
  gpuTimer: available=true resolved=true samples=645 span=postprocess+labels

FPS:
  avg: 60.1
  min: 2
  p1: 9

Frame time (wall-clock):
  avg: 16.6 ms
  p50: 13.1 ms
  p95: 26.2 ms
  p99: 112.8 ms
  max: 423.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.3 p95=12.8 p99=21.5 max=223.5 n=643
  render: p50=8.1 p95=14.3 p99=88.1 max=417.4 n=643
  frame: p50=13.1 p95=26.2 p99=112.8 max=423.6 n=643

Rendering (combined renderer.info):
  draw calls: 376 avg / 1411 max
  triangles: 9.45M avg
  mirror draws: 48 avg
  geometries: 634
  textures: 330

Pass submissions (actual):
  reliability: observed
  frames: 648 shadowRefresh=266 shadowSkipped=382
  mirror calls avg: 48
  shadow calls avg: 143
  main calls avg: 255

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=49 tris=1.18M meshes=49 inst=124428
  vegetation       draws=155 tris=1.18M meshes=155 inst=729
  environment      draws=54 tris=18.4k meshes=54 inst=66
  settlement       draws=358 tris=542.8k meshes=358 inst=913
  water            draws=51 tris=3.69M meshes=51 inst=51
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=171 tris=70.4k meshes=171 inst=171
  items            draws=320 tris=25.1k meshes=320 inst=320
  other            draws=218 tris=26.9k meshes=218 inst=218

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=133 tris=1.11M meshes=133 inst=691
  environment      draws=53 tris=18.4k meshes=53 inst=65
  settlement       draws=259 tris=448.8k meshes=259 inst=776
  items            draws=35 tris=19.2k meshes=35 inst=35
  other            draws=93 tris=14.2k meshes=93 inst=93

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
  grass                    nodes=64 composed=64 multiplied=64 skinned=0
  vegetation               nodes=182 composed=182 multiplied=182 skinned=0
  environment              nodes=73 composed=73 multiplied=73 skinned=0
  settlement               nodes=703 composed=703 multiplied=703 skinned=0
  water                    nodes=51 composed=51 multiplied=51 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1776 composed=1776 multiplied=1776 skinned=151
  items                    nodes=491 composed=491 multiplied=491 skinned=0
  other                    nodes=426 composed=409 multiplied=426 skinned=9
  top scene children:
    fauna ×42                nodes=1776 composed=1776 multiplied=1776 skinned=151
    settlement ×1            nodes=703 composed=703 multiplied=703 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    chunk-items ×31          nodes=488 composed=488 multiplied=488 skinned=0
    Group ×36                nodes=244 composed=244 multiplied=244 skinned=9
    chunk ×65                nodes=65 composed=65 multiplied=65 skinned=0
    chunk-grass ×15          nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    chunk-water ×50          nodes=50 composed=50 multiplied=50 skinned=0
    chunk-river ×41          nodes=41 composed=41 multiplied=41 skinned=0
    Object3D ×30             nodes=30 composed=30 multiplied=30 skinned=0
    chunk-vegetation ×1      nodes=19 composed=19 multiplied=19 skinned=0

Systems:
  WATER          1.1 ms
  STREAMING      1.7 ms
  NPC            1.2 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         9.4 ms

Detected bottlenecks:
  1. RENDER
  2. STREAMING
  3. FAUNA

Critical spikes:
  STREAMING: 18
  WATER: 17

Hitches (>= 8 ms): total=35
  chunk mesh             n=18 avg=11.9 max=30.6
  chunk water            n=16 avg=11.4 max=27.0
  chunk river            n=1 avg=10.3 max=10.3

Isolation probes:
  full               render=5.3 ms draws=243 tris=5.14M
  hide-grass         render=5.0 ms draws=214 tris=4.08M
  hide-vegetation    render=4.3 ms draws=130 tris=3.73M
  hide-vegetation-grass render=4.6 ms draws=100 tris=2.64M
  hide-environment   render=5.0 ms draws=223 tris=5.07M
  hide-settlement    render=4.8 ms draws=241 tris=5.09M
  hide-water         render=5.3 ms draws=227 tris=4.27M
  hide-terrain       render=5.2 ms draws=215 tris=3.30M
  hide-npc-fauna     render=4.3 ms draws=243 tris=5.14M
  no-shadows         render=5.3 ms draws=233 tris=4.92M
  no-ao              render=5.6 ms draws=233 tris=5.09M
  no-bloom           render=5.4 ms draws=226 tris=5.09M
  no-smaa            render=5.5 ms draws=240 tris=5.14M
  no-god-rays        render=5.3 ms draws=239 tris=5.09M
  no-film-grade      render=5.6 ms draws=239 tris=5.09M
  no-postprocessing  render=5.4 ms draws=216 tris=5.09M
  no-reflections     render=5.7 ms draws=193 tris=4.33M

Frame attribution:
  frame max: 423.6 ms
  largest labelled hitch: 30.6 ms
  unattributed: 393 ms

Long frames:
  threshold: 80 ms
  count: 10
  worst: 423.6 ms

Raw sidecar:
  sampling=full factor=1 exported=643/643

Recommendation:
Largest frame (423.6 ms) is not explained by labelled hitches (largest 30.6 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 29

NPC:
  total: 1.2 ms/frame
  crowd pass: 0.0 ms/frame (2.9 ms cumulative)
  agent updates: 0.6 ms/frame (397.7 ms cumulative)
  livestock: 0.4 ms/frame (235.2 ms cumulative)
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
      other update: 0.0 ms/frame
    update calls/frame: 12.1
    unique animals/frame: 12.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 2.0
    dog guard scans: 2.0/frame (14.1 predator candidates/frame)
    pest scans: 0.8/frame (0.8 rat candidates/frame)
    nearest scans: 5.3/frame (0.0 candidates/frame)
    water samples: 15.7/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 15.7/frame, 0.00 ms/frame (worst call 0.10 ms, 2591.6 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 11.9
    behaviour executions/frame: 5.4
    presentation executions/frame: 4.8
  rats: 0.1 ms/frame (43.8 ms cumulative)
  social: 0.0 ms/frame (2.1 ms cumulative)
  streaming: 0.0 ms/frame (1.3 ms cumulative)
  maintenance: 0.1 ms/frame (45.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.4 ms/frame (923.8 ms cumulative)
  forest sampling: 0.1 ms/frame (66.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.4 ms cumulative)
    targeting: 0.0 ms/frame (7.8 ms cumulative)
    decision: 0.0 ms/frame (16.9 ms cumulative)
    behaviour: 0.8 ms/frame (486.8 ms cumulative)
    life/presentation: 0.4 ms/frame (256.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.2
    sensing passes/frame: 29.2
    decision passes/frame: 29.2
    high-priority agents/frame: 1.2
    expensive behaviour agents/frame: 18.2
    full-rate agents/frame: 11.3
    reduced-cadence agents/frame: 17.9
    behaviour executions/frame: 19.4
    presentation executions/frame: 18.3

  sensing/cache:
    forest samples/frame: 29.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 50.6
    player perception checks/frame: 29.2

  nearest scans: 24.4/frame (15664 calls)
  nearest candidates checked: 92.0/frame (59172 total)
  herd leader scans: 0.2/frame (129 calls)
  herd candidates checked: 5.8/frame (3741 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 27.1/frame (167.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 40.4/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 40.4/frame, 0.00 ms/frame (worst call 0.50 ms, 5621.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 75
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.17 ms
    max 0.80 ms

  allocation/setup:
    avg 0.10 ms
    max 0.50 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.02 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.20 ms
  callback total (build + lod + attach):
    avg 0.45 ms
    max 1.60 ms

  per chunk:
    instances avg/max 3731.2 / 6988
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 70892 / 0
    matrix instances bound: 70892
    instanced attributes created: 285
    shared material refs: 57
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 28/28
    instances: 153775 (max 32465)
    allocation/setup avg/max: 0.06 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.03 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.08 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=214465 filler=137739
Submitted instances: full=87100 filler=37327
Meshes submitted: 48
LOD submitted fraction: full=0.40612687384887974 filler=0.2709980470309789
Flowers: unavailable
Allocation bytes (estimated): 33811584
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=25 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 648
Shadow refresh frames: 266
Shadow skipped frames: 382

Mirror:
  calls avg: 48  tris avg: 669000
  info calls avg: 48  residual calls avg: 0
  switches avg: material=21.5 program=14.3  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2.7 skeletons first used=2.7
  environment                  calls=3 tris=3098
  items                        calls=0 tris=139
  other                        calls=15 tris=3899
  settlement:decor             calls=1 tris=3940
  settlement:fence             calls=0 tris=15
  settlement:fireHouseExteriorLamp calls=0 tris=8
  settlement:fireHouseInteriorLamp calls=0 tris=5
  settlement:fireVillageTorch  calls=0 tris=7
  settlement:houseInteractive  calls=0 tris=18
  settlement:houseStatic       calls=1 tris=737
  settlement:landmarkWellHousehold calls=0 tris=32
  settlement:other             calls=0 tris=405
  settlement:storageBarrel     calls=0 tris=179
  settlement:storageContainer  calls=0 tris=39
  settlement:storageGoods      calls=0 tris=73
  settlement:storageTrough     calls=0 tris=22
  settlement:storageWoodHousehold calls=0 tris=87
  settlement:storageWoodSettlementPrimary calls=0 tris=7
  terrain                      calls=5 tris=336942
  vegetation                   calls=22 tris=319470

Shadow (refresh only):
  calls avg: 143  tris avg: 1840301
  info calls avg: 143  residual calls avg: 0
  switches avg: material=66.8 program=67.9  actor: calls=11.3 material=0 program=1.8
  skinning avg: skinned calls=15.3 skeletons first used=7.1
  environment                  calls=8 tris=6625
  faunaFamily:chicken          calls=1 tris=102
  faunaFamily:cow              calls=1 tris=230
  faunaFamily:dog              calls=1 tris=346
  faunaFamily:horse            calls=1 tris=369
  faunaFamily:rabbit           calls=0 tris=124
  faunaFamily:rat              calls=0 tris=226
  faunaFamily:rooster          calls=0 tris=117
  faunaFamily:sheep            calls=1 tris=204
  faunaFamily:stag             calls=1 tris=704
  faunaFamily:wolf             calls=0 tris=118
  items                        calls=4 tris=1763
  npcFamily:Farmer             calls=1 tris=1532
  npcFamily:Knight_Cloth       calls=1 tris=1075
  npcFamily:Peasant            calls=2 tris=2063
  npcFamily:Peasant_Boots      calls=1 tris=689
  npcFamily:Ranger_NoHood      calls=1 tris=673
  npcFamily:woodcutter         calls=0 tris=612
  other                        calls=33 tris=9070
  settlement:decor             calls=17 tris=38611
  settlement:fence             calls=0 tris=115
  settlement:fireHouseInteriorLamp calls=1 tris=62
  settlement:houseInteractive  calls=1 tris=210
  settlement:houseStatic       calls=3 tris=4925
  settlement:landmarkGarden    calls=0 tris=162
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=0 tris=183
  settlement:landmarkWellPasture calls=0 tris=35
  settlement:other             calls=1 tris=2305
  settlement:storageContainer  calls=1 tris=193
  settlement:storageHay        calls=0 tris=48
  settlement:storageTrough     calls=0 tris=126
  settlement:storageWoodHousehold calls=0 tris=475
  settlement:storageWoodSettlementPrimary calls=0 tris=76
  settlement:workplace         calls=0 tris=347
  terrain                      calls=14 tris=1051488
  vegetation                   calls=47 tris=714293

Main:
  calls avg: 255  tris avg: 7995418
  info calls avg: 328  residual calls avg: 0
  switches avg: material=131.2 program=48.5  actor: calls=5 material=4 program=2
  skinning avg: skinned calls=13.6 skeletons first used=5.2
  environment                  calls=9 tris=8469
  faunaFamily:bear             calls=1 tris=346
  faunaFamily:chicken          calls=0 tris=54
  faunaFamily:cow              calls=0 tris=132
  faunaFamily:dog              calls=0 tris=104
  faunaFamily:horse            calls=0 tris=29
  faunaFamily:rabbit           calls=0 tris=7
  faunaFamily:rat              calls=0 tris=68
  faunaFamily:rooster          calls=0 tris=48
  faunaFamily:sheep            calls=0 tris=100
  faunaFamily:stag             calls=0 tris=6
  faunaFamily:wolf             calls=1 tris=497
  grass                        calls=35 tris=5215938
  items                        calls=50 tris=4409
  npcFamily:Farmer             calls=0 tris=466
  npcFamily:Knight_Cloth       calls=0 tris=643
  npcFamily:Peasant            calls=1 tris=1170
  npcFamily:Ranger_NoHood      calls=0 tris=151
  other                        calls=63 tris=14656
  settlement:decor             calls=4 tris=10910
  settlement:fence             calls=0 tris=44
  settlement:fireHouseExteriorLamp calls=0 tris=19
  settlement:fireHouseInteriorLamp calls=0 tris=14
  settlement:fireVillageTorch  calls=0 tris=26
  settlement:houseInteractive  calls=0 tris=55
  settlement:houseStatic       calls=1 tris=2032
  settlement:landmarkGarden    calls=0 tris=1180
  settlement:landmarkNoticeBoard calls=0 tris=0
  settlement:landmarkWellCentral calls=0 tris=40
  settlement:landmarkWellHousehold calls=0 tris=94
  settlement:other             calls=0 tris=1181
  settlement:storageBarrel     calls=0 tris=513
  settlement:storageContainer  calls=0 tris=112
  settlement:storageGoods      calls=1 tris=243
  settlement:storageHay        calls=0 tris=1
  settlement:storageTrough     calls=0 tris=65
  settlement:storageWoodHousehold calls=0 tris=253
  settlement:storageWoodSettlementPrimary calls=0 tris=17
  settlement:workplace         calls=0 tris=41
  terrain                      calls=19 tris=1432606
  vegetation                   calls=55 tris=786978
  water                        calls=8 tris=512000


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

[LONG FRAME] 423.6ms
simulate         5.9ms
render         417.4ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA            1.2ms
PHYSICS          0.2ms
RENDER         417.4ms
OTHER            3.2ms

Long frame #2:

[LONG FRAME] 295.8ms
simulate       223.5ms
render          72.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.3ms
STREAMING      196.1ms
NPC              1.6ms
FAUNA           21.0ms
PHYSICS          0.2ms
RENDER          61.6ms
OTHER            5.0ms

streaming / stages:
  chunkUpdate                  196.1ms
  riverTileBuild               179.1ms
  riverChannelSegmentsNear     11.9ms
  terrainPrepare               0.5ms

Long frame #3:

[LONG FRAME] 232.1ms
simulate        16.5ms
render         214.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.4ms
STREAMING        4.3ms
NPC              3.5ms
FAUNA            3.0ms
PHYSICS          0.1ms
RENDER         214.6ms
OTHER            6.2ms

streaming / stages:
  chunkUpdate                  4.2ms
  riverChannelSegmentsNear     1.2ms
  chunkFinalize                0.9ms
  terrainPrepare               0.7ms
  settlementCheckpoints        0.5ms
  settlementEnsureLoaded       0.2ms

Long frame #4:

[LONG FRAME] 147.1ms
simulate         7.7ms
render         138.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.1ms
STREAMING        1.7ms
NPC              1.2ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER         134.3ms
OTHER            4.3ms

streaming / stages:
  chunkUpdate                  1.7ms

Long frame #5:

[LONG FRAME] 124ms
simulate         6.4ms
render         117.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER         116.8ms
OTHER            4.1ms

---

[Seedvale Program Census]

Programs created: 134
Program count: final=134 max=134

By frame:
  frame 0   +91 programs   <== largest transition
  frame 11   +1 program
  frame 67   +1 program
  frame 122   +1 program
  frame 139   +1 program
  frame 168   +1 program
  frame 1138   +14 programs
  frame 1182   +3 programs
  frame 1396   +21 programs

Largest transition — frame 0 (+91 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=ca32daaf stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7de18428-1322-43d9-adba-d7498bc0762e (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=76569119-5b94-4a7e-b71e-96282bc6063f
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=b42d9ab2-87d8-4962-8dac-d114c550cf0d
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a22d24e9-b4af-40a9-b91e-9a3b50b96869
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8edec198-2b7c-490c-88b4-c256f99d1d60
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2089c5fa-af62-4297-a77a-d5e878407d05
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=59595040-17d8-4fa3-ba50-e2dd038e433c
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=d4f29a35-bac9-4bf6-b77f-39e529ef1152
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3737a62e-ec4a-4224-b9e1-dbea74702791
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3caa59c2-80e0-4863-85e5-7b3ec54c837b (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=35365e34-e5db-453e-b576-33b5b410d21c
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=228b7478-bb00-494f-99fc-144b51347aa4 (Green)
  #14 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b38ba126-3f49-4e07-b433-8e55063ea751 (Stone)
  #15 type=MeshStandardMaterial name='HalloweenBits' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=b24f037 fHash=547224f1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0d322c66-4e64-4570-a048-91b95aff2c24 (HalloweenBits)
  #16 type=MeshStandardMaterial name='NormalTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=ab1dd48f fHash=943c7b97 stage=postprocess-render
  #17 type=MeshStandardMaterial name='Leaves_NormalTree' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c8df3222 fHash=7a23219b stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=37382c05-1c07-425a-a419-252965888e9d (Leaves_NormalTree)
  #18 type=MeshStandardMaterial name='Wood' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=643ad3a2 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=300fdc96-8bc1-42e0-8813-cb2423e2bd56 (Wood)
  #19 type=MeshStandardMaterial name='PineTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=86d8050b fHash=9f0671e7 stage=postprocess-render
  #20 type=MeshStandardMaterial name='PineTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=6550e08d fHash=e1e27532 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c242fc4e-18f4-4a1a-a1be-ba3e74e7c1e6 (Flowers)
  #21 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=80917d5e fHash=633146b4 stage=postprocess-render
  #22 type=MeshStandardMaterial name='bush_berry_red' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=a9324552 fHash=9b37dc78 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0c88fc37-6276-4e02-b070-0823f8ee71a1 (bush_berry_red)
  #23 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f0ba378d-e10b-41e1-a6a1-9148d0e07900 (Main)
  #24 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=ebfa71bd fHash=3f59c0a3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0fabb570-3ef6-4515-b845-59c39ffd4c64 (Main)
  #25 type=MeshStandardMaterial name='Material.001' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=491939af-ec87-4736-a3e2-09b953edab6c (Wood)
  #26 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f3a07cf6-1b60-4a94-9c52-e04813a85c1a (lambert2SG)
  #27 type=MeshPhysicalMaterial name='Material #55.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=28fefd22 fHash=d3c0e09e stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8d456cc1-8fe9-4209-976f-961b2f8df7a9 (Material #55.002)
  #28 type=MeshPhysicalMaterial name='Material #54.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=b1c1b8a0 fHash=27c8d486 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cc740494-5312-4c2a-b623-164ad2a8104a (Material #54.002)
  #29 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=4be16ad2 fHash=63f37341 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=8d37a5fa-2bdb-4a92-9486-af72430b4981 (BlackBear_mat)
  #30 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=eb67e9ca-64b2-4191-9276-a93e07437f30 (MI_Peasant)
  #31 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=60214490-fd0f-44d6-bfcc-6e86cb23e815 (MI_Hair_1)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=14202b75-8aa9-4aa1-b119-cff175450e8d (MI_Hair_1)
  #33 type=MeshStandardMaterial name='lambert2SG' cacheKey=physical,STANDARD,,highp… vHash=a369060f fHash=f6cbc3c stage=postprocess-render
  #34 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=7c1e7b69 fHash=758a4164 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=1c1d4a6 fHash=97cbbbfc stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=63010727 fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c844a62a fHash=758a4164 stage=postprocess-render
  #47 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d791bd3f-64ba-42c0-bc03-c0422b2ce267 (Green)
  #48 type=MeshStandardMaterial name='NormalTree_Bark' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=a781b097-70f1-4c76-85fe-2d8b25c91388 (NormalTree_Bark)
  #49 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=72978b9c-dcf5-4d7d-9b38-6dcf4c4a1967 (PineTree_Leaves)
  #50 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3fe6944a-1536-4ad4-9b60-b6b4650b8b93 (stockpiles_vc)
  #51 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=f1c59d53-f8f6-4860-8d59-b5e3af74bcea
  #52 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5f4e36b8-3abf-4b04-a78a-9d200d52eccd (Pond_Pack_MAT)
  #53 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1d76f46c-e0a0-4970-a406-2492c4a63d83 (MI_Regular_Male)
  #54 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=53033215-c3c9-475e-9683-93fd8eaff2d6 (MI_Eyes)
  #55 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=5f527108-581d-4120-a46b-2e26ed1d2a65 (MI_WoodTrim)
  #56 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=0e9b59ea-cd99-4bee-a122-e970d83b4976 (MI_WoodTrim)
  #57 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=b3996035-adf8-4367-86ad-487e90d09bce
  #58 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2b6c8be7 fHash=d9be0b50 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=9a896bcd-c35d-4e8c-bc09-dd21671a5661
  #59 type=MeshStandardMaterial name='MI_Trim_Furniture' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=80dfdc64 fHash=58b0f5f4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9e14f198-4be5-4353-bcdd-4b95d4668eec (MI_Trim_Props_Vertex)
  #60 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8bcf6082-9ea1-49d0-b514-c3d170475fc3 (Main)
  #61 type=MeshStandardMaterial name='Material' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=c2697ed8 fHash=b4e24e stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a30fb32b-d522-4920-9b23-c7e8ed372c7a (Material)
  #62 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c7529a79-3517-4038-93d7-ce6478155e08 (MI_Knight)
  #63 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d19a4552-1a60-4849-88ae-c2e05d3b00e7 (MI_Hair_1)
  #64 type=MeshStandardMaterial name='SV_WorkSkirtBlue' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=d8e50ec3 fHash=189af887 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b149a61e-cadb-4eef-a5bb-60bdfb91bece (SV_WorkSkirtBlue)
  #65 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=afb8de20 fHash=950d7105 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=17097c87-4b97-4d34-8b3a-27effd681b21 (MI_Peasant)
  #66 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=9dc1f851 fHash=baf2480 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3236c758-aeaa-45af-ab7c-bba03b4d118f (MI_Peasant)
  #67 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #69 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #70 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e6802274-70ab-411b-bedf-15a7939660d5 (MI_WindowGlass)
  #71 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #72 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a2000bd1-5c31-4dba-a092-bd782c0ee198 (MI_WindowGlass)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #67=f92c8d8c, #68=df7c703d, #73=279cec18, #74=84736a68, #75=aa2edbee, #76=7bae0bb2, #77=436caea4, #78=886438e7, #79=d99a5b29, #80=2003ced8, #81=28dfa407, #82=756a0b19, #83=b2354ff2, #84=ea82969e, #85=7dab8d9a, #86=378e1fb7, #87=78acf7ea, #88=a312c579, #89=b817515d
    fragmentShaderHash differs: #0=ca32daaf, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #67=87d053eb, #68=236b3b0b, #73=4d6bcede, #74=ffecb62a, #75=76ced00a, #76=fb55b3c0, #77=2d687ef1, #78=dc2a89b5, #79=109e33fc, #80=db0f470a, #81=9775cd0e, #82=5c741650, #83=2aad9943, #84=a2297d9f, #85=1022767b, #86=ce0bf6b4, #87=707f290c, #88=c05e2256, #89=669a1bfa
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #67=(unset), #68=(unset), #73=(unset), #74=(unset), #75=(unset), #76=(unset), #77=(unset), #78=(unset), #79=(unset), #80=(unset), #81=(unset), #82=(unset), #83=(unset), #84=(unset), #85=(unset), #86=(unset), #87=(unset), #88=(unset), #89=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
  MeshStandardMaterial (46 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=c0d790d1, #14=a9733c9d, #15=b24f037, #16=ab1dd48f, #17=c8df3222, #18=643ad3a2, #19=86d8050b, #20=6550e08d, #21=80917d5e, #22=a9324552, #23=54e03756, #24=ebfa71bd, #25=a99aa494, #26=7bb77142, #29=4be16ad2, #30=842fe1df, #31=ac268392, #32=1c179521, #33=a369060f, #47=190d3a9c, #48=2f7179e3, #49=3bea20f6, #50=a64d124e, #51=94297e69, #52=c3bc6325, #53=20daccfa, #54=1dcbc6ff, #55=12873951, #56=c5e73b05, #57=66d360c8, #58=2b6c8be7, #59=80dfdc64, #60=fd8301ed, #61=c2697ed8, #62=140c5e62, #63=ee59055a, #64=d8e50ec3, #65=afb8de20, #66=9dc1f851, #69=13a74ec7, #70=9dcf1cb4, #71=fc941d05, #72=e551c572
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=a81023c3, #14=bd723c8a, #15=547224f1, #16=943c7b97, #17=7a23219b, #18=6578c10d, #19=9f0671e7, #20=e1e27532, #21=633146b4, #22=9b37dc78, #23=d391c52, #24=3f59c0a3, #25=63f9c0d1, #26=87728b15, #29=63f37341, #30=34995f15, #31=25a41317, #32=71f22dc6, #33=f6cbc3c, #47=633146b4, #48=943c7b97, #49=5b26a60d, #50=546e469, #51=aa0735a8, #52=ded4be89, #53=a8862f4a, #54=1a1c0d8, #55=d4c95125, #56=d4c95125, #57=c0b8fc9f, #58=d9be0b50, #59=58b0f5f4, #60=2f2885d5, #61=b4e24e, #62=46d4b31c, #63=e8d88acf, #64=189af887, #65=950d7105, #66=baf2480, #69=3ab4c629, #70=2d1aa4a, #71=3ab4c629, #72=2d1aa4a
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=environment, #15=environment, #16=(unknown), #17=vegetation, #18=environment, #19=(unknown), #20=vegetation, #21=(unknown), #22=vegetation, #23=fauna, #24=fauna, #25=vegetation, #26=fauna, #29=fauna, #30=other, #31=other, #32=other, #33=(unknown), #47=vegetation, #48=vegetation, #49=vegetation, #50=settlement, #51=other, #52=other, #53=other, #54=other, #55=settlement, #56=settlement, #57=settlement, #58=settlement, #59=settlement, #60=fauna, #61=fauna, #62=npc, #63=npc, #64=npc, #65=npc, #66=npc, #69=(unknown), #70=settlement, #71=(unknown), #72=settlement
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=(unset), #17=, #18=, #19=(unset), #20=, #21=(unset), #22=, #23=, #24=, #25=, #26=, #29=, #30=, #31=, #32=, #33=(unset), #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=, #57=, #58=, #59=, #60=, #61=, #62=, #63=, #64=, #65=, #66=, #69=(unset), #70=, #71=(unset), #72=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #16=(unknown), #17=0.45, #18=0, #19=(unknown), #20=0.45, #21=(unknown), #22=0.5, #23=0, #24=0, #25=0, #26=0, #29=0, #30=0, #31=0, #32=0, #33=(unknown), #47=0, #48=0, #49=0.5, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0, #59=0, #60=0, #61=0, #62=0, #63=0, #64=0, #65=0, #66=0, #69=(unknown), #70=0, #71=(unknown), #72=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=true, #52=false, #53=false, #54=false, #55=false, #56=false, #57=true, #58=true, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=(unknown), #17=true, #18=true, #19=(unknown), #20=true, #21=(unknown), #22=true, #23=true, #24=true, #25=true, #26=true, #29=true, #30=true, #31=true, #32=true, #33=(unknown), #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true, #59=true, #60=true, #61=true, #62=true, #63=true, #64=true, #65=true, #66=true, #69=(unknown), #70=true, #71=(unknown), #72=true
    flag map differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=true, #16=(unknown), #17=true, #18=false, #19=(unknown), #20=true, #21=(unknown), #22=true, #23=false, #24=false, #25=false, #26=true, #29=true, #30=true, #31=true, #32=true, #33=(unknown), #47=false, #48=true, #49=true, #50=false, #51=false, #52=true, #53=true, #54=true, #55=true, #56=true, #57=false, #58=false, #59=true, #60=false, #61=false, #62=true, #63=true, #64=false, #65=true, #66=true, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=true, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=true, #56=true, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=true, #71=(unknown), #72=true
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=true, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=true, #25=false, #26=false, #29=true, #30=true, #31=true, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=true, #51=false, #52=true, #53=true, #54=true, #55=false, #56=false, #57=false, #58=true, #59=true, #60=false, #61=true, #62=false, #63=false, #64=false, #65=false, #66=true, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
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
  MeshPhysicalMaterial (2 programs):
    vertexShaderHash differs: #27=28fefd22, #28=b1c1b8a0
    fragmentShaderHash differs: #27=d3c0e09e, #28=27c8d486
    flag vertexColors differs: #27=false, #28=true
  MeshDepthMaterial (13 programs):
    vertexShaderHash differs: #34=59ed5d71, #35=2efa42a8, #36=b69ba143, #37=2e7a6fcb, #38=c203b19a, #39=7c1e7b69, #40=c203b19a, #41=585a1ea4, #42=1c1d4a6, #43=263c45d6, #44=e4717b03, #45=63010727, #46=c844a62a
    fragmentShaderHash differs: #34=d729897e, #35=41e40a66, #36=d729897e, #37=758a4164, #38=41e40a66, #39=758a4164, #40=a9dd0dee, #41=a9dd0dee, #42=97cbbbfc, #43=d729897e, #44=41e40a66, #45=41e40a66, #46=758a4164
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1138 (+14):
  Program #96
    material: MeshStandardMaterial ''
    materialUuid: b42d9ab2-87d8-4962-8dac-d114c550cf0d
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #97
    material: MeshStandardMaterial 'Wood'
    materialUuid: 491939af-ec87-4736-a3e2-09b953edab6c
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #98
    material: MeshStandardMaterial 'Green'
    materialUuid: d791bd3f-64ba-42c0-bc03-c0422b2ce267
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
    materialUuid: 0760d69d-ca9f-49fd-ae81-58c7ac521e64
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #100
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 0e927c94-39e5-4690-b1c7-fb3433959f06
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1bd8d9e3
    fragmentShaderHash: e2f189d1
  Program #101
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 1d3cc528-4f7a-423f-b7e8-355a32048011
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
    materialUuid: 1630fc9b-bb6e-46b6-a57a-816dfa0d89b4
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #103
    material: MeshStandardMaterial 'bush_berry_red'
    materialUuid: 0c88fc37-6276-4e02-b070-0823f8ee71a1
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee440db4
    fragmentShaderHash: a96cc074
  Program #104
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 37382c05-1c07-425a-a419-252965888e9d
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
    materialUuid: 1d76f46c-e0a0-4970-a406-2492c4a63d83
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #106
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 53033215-c3c9-475e-9683-93fd8eaff2d6
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #107
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: eb67e9ca-64b2-4191-9276-a93e07437f30
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #108
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 60214490-fd0f-44d6-bfcc-6e86cb23e815
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #109
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 14202b75-8aa9-4aa1-b119-cff175450e8d
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1396 (+21):
  Program #113
    material: ShaderMaterial 'SkyShader'
    materialUuid: 7de18428-1322-43d9-adba-d7498bc0762e
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: dbd39394
  Program #114
    material: ShaderMaterial ''
    materialUuid: 59595040-17d8-4fa3-ba50-e2dd038e433c
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #115
    material: MeshStandardMaterial ''
    materialUuid: b42d9ab2-87d8-4962-8dac-d114c550cf0d
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #116
    material: MeshStandardMaterial 'Wood'
    materialUuid: 491939af-ec87-4736-a3e2-09b953edab6c
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #117
    material: MeshStandardMaterial 'Green'
    materialUuid: d791bd3f-64ba-42c0-bc03-c0422b2ce267
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
    materialUuid: 0760d69d-ca9f-49fd-ae81-58c7ac521e64
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #119
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 0e927c94-39e5-4690-b1c7-fb3433959f06
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ab1dd48f
    fragmentShaderHash: 8661e8c2
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 1d3cc528-4f7a-423f-b7e8-355a32048011
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
    materialUuid: 1630fc9b-bb6e-46b6-a57a-816dfa0d89b4
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'bush_berry_red'
    materialUuid: 0c88fc37-6276-4e02-b070-0823f8ee71a1
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a9324552
    fragmentShaderHash: 481650a5
  Program #123
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 37382c05-1c07-425a-a419-252965888e9d
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
    materialUuid: 1d76f46c-e0a0-4970-a406-2492c4a63d83
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 53033215-c3c9-475e-9683-93fd8eaff2d6
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: eb67e9ca-64b2-4191-9276-a93e07437f30
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 60214490-fd0f-44d6-bfcc-6e86cb23e815
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 14202b75-8aa9-4aa1-b119-cff175450e8d
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: ShaderMaterial ''
    materialUuid: 2089c5fa-af62-4297-a77a-d5e878407d05
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #130
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #131
    material: MeshBasicMaterial ''
    materialUuid: 3737a62e-ec4a-4224-b9e1-dbea74702791
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #132
    material: ShaderMaterial ''
    materialUuid: 06337c53-041d-4216-b747-831f189fd675
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #133
    material: ShaderMaterial ''
    materialUuid: 5ad8bf21-bb95-4c4a-982c-e717d26c383f
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
Excluded — no reliable per-program timing: 129 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 11
  #91
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 377.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 67
  #92
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 394.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 122
  #93
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 130.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 139
  #94
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 210.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 168
  #95
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 113.4 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1226.9 ms
  programs >1 ms: 5
  max: 394.3 ms (#92)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.3 ms  p95=6.9 ms  max=7.2 ms  Δavg vs baseline=—
  hide-grass           avg=5.0 ms  p95=5.8 ms  max=6.3 ms  Δavg vs baseline=-0.4 ms (-7%)
  hide-vegetation      avg=4.3 ms  p95=5.0 ms  max=5.2 ms  Δavg vs baseline=-1.1 ms (-20%)
  no vegetation/grass  avg=4.6 ms  p95=6.2 ms  max=7.5 ms  Δavg vs baseline=-0.8 ms (-15%)
  hide-environment     avg=5.0 ms  p95=5.9 ms  max=6.1 ms  Δavg vs baseline=-0.3 ms (-6%)
  hide-settlement      avg=4.8 ms  p95=5.5 ms  max=7.2 ms  Δavg vs baseline=-0.5 ms (-10%)
  no water             avg=5.3 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-terrain         avg=5.2 ms  p95=6.0 ms  max=6.8 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-npc-fauna       avg=4.3 ms  p95=5.0 ms  max=5.4 ms  Δavg vs baseline=-1.1 ms (-20%)
  no-shadows           avg=5.3 ms  p95=6.3 ms  max=6.4 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-ao                avg=5.6 ms  p95=7.0 ms  max=7.8 ms  Δavg vs baseline=+0.3 ms (+5%)
  no-bloom             avg=5.4 ms  p95=6.9 ms  max=7.5 ms  Δavg vs baseline=+0.1 ms (+2%)
  no-smaa              avg=5.5 ms  p95=6.8 ms  max=7.3 ms  Δavg vs baseline=+0.2 ms (+3%)
  no-god-rays          avg=5.3 ms  p95=6.2 ms  max=6.6 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-film-grade        avg=5.6 ms  p95=7.2 ms  max=7.6 ms  Δavg vs baseline=+0.3 ms (+6%)
  no postprocessing    avg=5.4 ms  p95=7.0 ms  max=9.5 ms  Δavg vs baseline=+0.1 ms (+1%)
  no mirrors           avg=5.7 ms  p95=6.8 ms  max=8.3 ms  Δavg vs baseline=+0.4 ms (+8%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.3 ms  p95=25.2 ms  max=26.6 ms
  CPU wall      avg=5.3 ms  p95=6.9 ms  max=7.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=1 sync ms total=178.5 max=178.5 store hits=3 prefetched=15
