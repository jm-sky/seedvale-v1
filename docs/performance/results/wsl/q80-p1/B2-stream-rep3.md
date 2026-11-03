# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T16:58:41.312Z
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
Frames: 692
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a25e47aa423419e56bb240801251d699bb6b8759
  runId: 2026-11-03T16-57-43-019Z-0uza3f
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
  populationGate: stable waited=5036ms npc=8
  gpuTimer: available=true resolved=true samples=694 span=postprocess+labels

FPS:
  avg: 55.9
  min: 2
  p1: 10

Frame time (wall-clock):
  avg: 17.9 ms
  p50: 13.8 ms
  p95: 36.6 ms
  p99: 98.2 ms
  max: 545.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.7 p95=16.2 p99=37.3 max=81.7 n=692
  render: p50=8.7 p95=15.2 p99=90 max=538 n=692
  frame: p50=13.8 p95=36.6 p99=98.2 max=545.5 n=692

Rendering (combined renderer.info):
  draw calls: 384 avg / 1448 max
  triangles: 9.53M avg
  mirror draws: 52 avg
  geometries: 665
  textures: 332

Pass submissions (actual):
  reliability: observed
  frames: 697 shadowRefresh=295 shadowSkipped=402
  mirror calls avg: 52
  shadow calls avg: 144
  main calls avg: 257

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
  other            draws=218 tris=26.9k meshes=218 inst=218

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=144 tris=1.24M meshes=144 inst=811
  environment      draws=52 tris=17.8k meshes=52 inst=64
  settlement       draws=259 tris=448.8k meshes=259 inst=776
  items            draws=35 tris=18.6k meshes=35 inst=35
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
  grass                    nodes=65 composed=65 multiplied=65 skinned=0
  vegetation               nodes=187 composed=187 multiplied=187 skinned=0
  environment              nodes=73 composed=73 multiplied=73 skinned=0
  settlement               nodes=703 composed=703 multiplied=703 skinned=0
  water                    nodes=48 composed=48 multiplied=48 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1776 composed=1776 multiplied=1776 skinned=151
  items                    nodes=455 composed=455 multiplied=455 skinned=0
  other                    nodes=424 composed=407 multiplied=424 skinned=9
  top scene children:
    fauna ×42                nodes=1776 composed=1776 multiplied=1776 skinned=151
    settlement ×1            nodes=703 composed=703 multiplied=703 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    chunk-items ×29          nodes=452 composed=452 multiplied=452 skinned=0
    Group ×36                nodes=244 composed=244 multiplied=244 skinned=9
    chunk ×65                nodes=65 composed=65 multiplied=65 skinned=0
    chunk-grass ×15          nodes=65 composed=65 multiplied=65 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    chunk-water ×47          nodes=47 composed=47 multiplied=47 skinned=0
    chunk-river ×42          nodes=42 composed=42 multiplied=42 skinned=0
    Object3D ×30             nodes=30 composed=30 multiplied=30 skinned=0
    chunk-vegetation ×1      nodes=19 composed=19 multiplied=19 skinned=0

Systems:
  WATER          1.4 ms
  STREAMING      1.2 ms
  NPC            1.2 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         10.1 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. WATER

Critical spikes:
  STREAMING: 13
  WATER: 11

Hitches (>= 8 ms): total=24
  chunk water            n=11 avg=11.8 max=19.4
  chunk mesh             n=13 avg=11.6 max=18.1

Isolation probes:
  full               render=5.3 ms draws=213 tris=4.36M
  hide-grass         render=5.4 ms draws=188 tris=4.03M
  hide-vegetation    render=4.5 ms draws=118 tris=2.83M
  hide-vegetation-grass render=4.4 ms draws=93 tris=2.48M
  hide-environment   render=5.5 ms draws=202 tris=4.36M
  hide-settlement    render=5.1 ms draws=216 tris=4.42M
  hide-water         render=5.3 ms draws=205 tris=3.68M
  hide-terrain       render=5.5 ms draws=192 tris=2.68M
  hide-npc-fauna     render=4.6 ms draws=216 tris=4.42M
  no-shadows         render=5.3 ms draws=209 tris=4.26M
  no-ao              render=5.8 ms draws=207 tris=4.36M
  no-bloom           render=5.8 ms draws=200 tris=4.36M
  no-smaa            render=5.7 ms draws=210 tris=4.36M
  no-god-rays        render=5.6 ms draws=216 tris=4.42M
  no-film-grade      render=5.7 ms draws=213 tris=4.36M
  no-postprocessing  render=5.6 ms draws=191 tris=4.37M
  no-reflections     render=5.7 ms draws=177 tris=3.51M

Frame attribution:
  frame max: 545.5 ms
  largest labelled hitch: 19.4 ms
  unattributed: 526.1 ms

Long frames:
  threshold: 80 ms
  count: 14
  worst: 545.5 ms

Raw sidecar:
  sampling=full factor=1 exported=692/692

Recommendation:
Largest frame (545.5 ms) is not explained by labelled hitches (largest 19.4 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 29

NPC:
  total: 1.2 ms/frame
  crowd pass: 0.0 ms/frame (3.2 ms cumulative)
  agent updates: 0.7 ms/frame (450.5 ms cumulative)
  livestock: 0.4 ms/frame (273.4 ms cumulative)
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
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 5.4/frame (0.0 candidates/frame)
    water samples: 14.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 14.1/frame, 0.00 ms/frame (worst call 1.80 ms, 2335.0 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 11.9
    behaviour executions/frame: 5.4
    presentation executions/frame: 4.8
  rats: 0.1 ms/frame (54.2 ms cumulative)
  social: 0.0 ms/frame (2.7 ms cumulative)
  streaming: 0.0 ms/frame (0.9 ms cumulative)
  maintenance: 0.1 ms/frame (55.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.0 ms/frame (1387.8 ms cumulative)
  forest sampling: 0.1 ms/frame (72.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.0 ms cumulative)
    targeting: 0.0 ms/frame (9.5 ms cumulative)
    decision: 0.0 ms/frame (10.9 ms cumulative)
    behaviour: 1.3 ms/frame (892.6 ms cumulative)
    life/presentation: 0.4 ms/frame (287.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.2
    sensing passes/frame: 29.2
    decision passes/frame: 29.2
    high-priority agents/frame: 0.2
    expensive behaviour agents/frame: 17.7
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 21.1
    behaviour executions/frame: 17.9
    presentation executions/frame: 16.5

  sensing/cache:
    forest samples/frame: 29.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 50.5
    player perception checks/frame: 29.2

  nearest scans: 23.6/frame (16299 calls)
  nearest candidates checked: 99.1/frame (68559 total)
  herd leader scans: 0.2/frame (163 calls)
  herd candidates checked: 6.8/frame (4727 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.7/frame (167.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 38.6/frame, 0.00 ms/frame (worst call 2.00 ms)
    collider queries: 38.6/frame, 0.00 ms/frame (worst call 1.00 ms, 5439.4 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 15
  empty builds (no instances): 72
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.27 ms
    max 2.10 ms

  allocation/setup:
    avg 0.23 ms
    max 2.10 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.05 ms
    max 0.40 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.53 ms
    max 2.80 ms

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
    allocation/setup avg/max: 0.12 / 1.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 23/23
    instances: 44671 (max 10763)
    allocation/setup avg/max: 0.05 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 23/23
    instances: 177517 (max 44129)
    allocation/setup avg/max: 0.03 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 8/8
    instances: 637461 (max 184195)
    allocation/setup avg/max: 0.11 / 0.30 ms
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
Frames: 697
Shadow refresh frames: 295
Shadow skipped frames: 402

Mirror:
  calls avg: 52  tris avg: 659907
  info calls avg: 52  residual calls avg: 0
  switches avg: material=22.7 program=14.9  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2.8 skeletons first used=2.8
  environment                  calls=3 tris=2848
  items                        calls=0 tris=133
  other                        calls=20 tris=4138
  settlement:decor             calls=2 tris=7221
  settlement:fence             calls=0 tris=20
  settlement:fireHouseExteriorLamp calls=0 tris=7
  settlement:fireHouseInteriorLamp calls=0 tris=5
  settlement:fireVillageTorch  calls=0 tris=7
  settlement:houseInteractive  calls=0 tris=17
  settlement:houseStatic       calls=1 tris=883
  settlement:landmarkWellHousehold calls=0 tris=35
  settlement:other             calls=0 tris=658
  settlement:storageBarrel     calls=0 tris=230
  settlement:storageContainer  calls=0 tris=52
  settlement:storageGoods      calls=0 tris=84
  settlement:storageTrough     calls=0 tris=31
  settlement:storageWoodHousehold calls=0 tris=121
  settlement:storageWoodSettlementPrimary calls=0 tris=3
  terrain                      calls=5 tris=341596
  vegetation                   calls=20 tris=301939

Shadow (refresh only):
  calls avg: 144  tris avg: 1800855
  info calls avg: 144  residual calls avg: 0
  switches avg: material=66.2 program=67.9  actor: calls=10.4 material=0 program=2.1
  skinning avg: skinned calls=14.1 skeletons first used=7.2
  environment                  calls=8 tris=6115
  faunaFamily:boar             calls=0 tris=125
  faunaFamily:chicken          calls=1 tris=88
  faunaFamily:cow              calls=0 tris=141
  faunaFamily:dog              calls=1 tris=293
  faunaFamily:horse            calls=1 tris=215
  faunaFamily:rabbit           calls=1 tris=347
  faunaFamily:rat              calls=0 tris=109
  faunaFamily:rooster          calls=0 tris=118
  faunaFamily:sheep            calls=1 tris=192
  faunaFamily:stag             calls=3 tris=1767
  items                        calls=4 tris=1731
  npcFamily:Farmer             calls=1 tris=846
  npcFamily:Knight_Cloth       calls=1 tris=727
  npcFamily:Peasant            calls=2 tris=1768
  npcFamily:Peasant_Boots      calls=0 tris=373
  npcFamily:Ranger_NoHood      calls=0 tris=221
  npcFamily:woodcutter         calls=0 tris=258
  other                        calls=33 tris=9146
  settlement:decor             calls=20 tris=50222
  settlement:fence             calls=0 tris=78
  settlement:fireHouseInteriorLamp calls=1 tris=64
  settlement:houseInteractive  calls=1 tris=231
  settlement:houseStatic       calls=5 tris=6920
  settlement:landmarkGarden    calls=0 tris=271
  settlement:landmarkNoticeBoard calls=0 tris=3
  settlement:landmarkWellCentral calls=1 tris=197
  settlement:landmarkWellPasture calls=0 tris=19
  settlement:other             calls=1 tris=4297
  settlement:storageContainer  calls=1 tris=330
  settlement:storageHay        calls=0 tris=60
  settlement:storageTrough     calls=0 tris=221
  settlement:storageWoodHousehold calls=0 tris=857
  settlement:storageWoodSettlementPrimary calls=0 tris=74
  settlement:workplace         calls=0 tris=373
  terrain                      calls=14 tris=1049809
  vegetation                   calls=44 tris=662252

Main:
  calls avg: 257  tris avg: 8078509
  info calls avg: 332  residual calls avg: 0
  switches avg: material=128.4 program=48.4  actor: calls=5 material=4 program=2
  skinning avg: skinned calls=13.6 skeletons first used=5.2
  environment                  calls=9 tris=8059
  faunaFamily:bear             calls=0 tris=309
  faunaFamily:chicken          calls=0 tris=43
  faunaFamily:cow              calls=0 tris=126
  faunaFamily:dog              calls=0 tris=80
  faunaFamily:horse            calls=0 tris=15
  faunaFamily:rabbit           calls=0 tris=152
  faunaFamily:rat              calls=0 tris=11
  faunaFamily:rooster          calls=0 tris=60
  faunaFamily:sheep            calls=0 tris=106
  faunaFamily:stag             calls=0 tris=127
  faunaFamily:wolf             calls=1 tris=529
  grass                        calls=36 tris=5365085
  items                        calls=47 tris=4229
  npcFamily:Farmer             calls=0 tris=245
  npcFamily:Knight_Cloth       calls=1 tris=666
  npcFamily:Peasant            calls=1 tris=1153
  npcFamily:Ranger_NoHood      calls=0 tris=47
  other                        calls=71 tris=14649
  settlement:decor             calls=5 tris=16708
  settlement:fence             calls=0 tris=45
  settlement:fireHouseExteriorLamp calls=0 tris=15
  settlement:fireHouseInteriorLamp calls=0 tris=11
  settlement:fireVillageTorch  calls=0 tris=20
  settlement:houseInteractive  calls=0 tris=41
  settlement:houseStatic       calls=1 tris=1999
  settlement:landmarkGarden    calls=0 tris=672
  settlement:landmarkNoticeBoard calls=0 tris=0
  settlement:landmarkWellCentral calls=0 tris=16
  settlement:landmarkWellHousehold calls=0 tris=75
  settlement:other             calls=0 tris=1536
  settlement:storageBarrel     calls=0 tris=540
  settlement:storageContainer  calls=0 tris=122
  settlement:storageGoods      calls=1 tris=206
  settlement:storageTrough     calls=0 tris=74
  settlement:storageWoodHousehold calls=0 tris=289
  settlement:storageWoodSettlementPrimary calls=0 tris=7
  settlement:workplace         calls=0 tris=14
  terrain                      calls=20 tris=1443560
  vegetation                   calls=53 tris=738259
  water                        calls=7 tris=478909


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 14
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 14 total):

[LONG FRAME] 545.5ms
simulate         6.5ms
render         538.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA            1.2ms
PHYSICS          0.1ms
RENDER         537.8ms
OTHER            4.8ms

Long frame #2:

[LONG FRAME] 251.4ms
simulate        23.3ms
render         227.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.4ms
STREAMING        0.0ms
NPC              3.3ms
FAUNA            2.5ms
PHYSICS          0.2ms
RENDER         222.8ms
OTHER           18.2ms

Long frame #3:

[LONG FRAME] 194.1ms
simulate         6.8ms
render         187.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA            1.7ms
PHYSICS          0.1ms
RENDER         187.0ms
OTHER            3.5ms

Long frame #4:

[LONG FRAME] 131.6ms
simulate         6.0ms
render         125.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA            1.3ms
PHYSICS          0.1ms
RENDER         125.2ms
OTHER            3.4ms

Long frame #5:

[LONG FRAME] 113.9ms
simulate         7.4ms
render         106.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING       27.9ms
NPC              1.2ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER         106.2ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              15.3ms
  waterFinalize                10.9ms
  contentFinalize              1.4ms
  chunkFinalize                1.4ms
  chunkUpdate                  1.4ms
  riverFinalize                0.3ms

hitches:
  STREAMING chunk mesh             8.8ms

---

[Seedvale Program Census]

Programs created: 134
Program count: final=134 max=134

By frame:
  frame 0   +90 programs   <== largest transition
  frame 9   +1 program
  frame 102   +1 program
  frame 103   +1 program
  frame 105   +1 program
  frame 146   +1 program
  frame 153   +1 program
  frame 1180   +14 programs
  frame 1223   +3 programs
  frame 1439   +21 programs

Largest transition — frame 0 (+90 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=ca32daaf stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3f862ec4-fe92-45bc-a6a2-df7bde8702cf (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1af33021-357e-48d9-98cf-7f046ebc39f2
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=23e255dd-3dc1-4ff6-a6b7-24747a9e8942
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3ffb5ff3-eda2-4cf0-9367-c95357b5f68f
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=53c528fd-f2ce-43b0-a634-00ff461d62b3
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9d18f693-4b4c-4fb5-9ad2-7f949b766eac
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e7b8921e-aa14-41e1-ad27-b3c9786d62b7
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=d13a79ee-3971-4ec9-9898-32ee68f6b750
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=871d262c-c21c-40c0-8d8d-08ebc6f496ce
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8147ffa4-2f8d-4f79-b9a1-fce92932307b (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=30ae0dc1-2c8c-4fb3-8288-e43939877265
  #13 type=MeshStandardMaterial name='HalloweenBits' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=b24f037 fHash=547224f1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1739e8cc-0a68-4fa4-9416-a4455e58de90 (HalloweenBits)
  #14 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fcb46a2d-ad4a-491b-9274-a556325ccbe5 (Green)
  #15 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a3e5c185-8dcf-4f76-bae1-1e46f68d07c8 (Stone)
  #16 type=MeshStandardMaterial name='NormalTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=ab1dd48f fHash=943c7b97 stage=postprocess-render
  #17 type=MeshStandardMaterial name='Leaves_NormalTree' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c8df3222 fHash=7a23219b stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d5cce462-cca9-42a2-8b0f-5de50b4ed248 (Leaves_NormalTree)
  #18 type=MeshStandardMaterial name='Wood' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=643ad3a2 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c16991c3-9ca9-4f76-a202-be617eca6cab (Wood)
  #19 type=MeshStandardMaterial name='PineTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=86d8050b fHash=9f0671e7 stage=postprocess-render
  #20 type=MeshStandardMaterial name='PineTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=6550e08d fHash=e1e27532 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c504f545-dcfa-4115-a802-af220074da0d (Flowers)
  #21 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=80917d5e fHash=633146b4 stage=postprocess-render
  #22 type=MeshStandardMaterial name='bush_berry_red' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=a9324552 fHash=9b37dc78 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2b33897c-cea0-4fa3-8544-71893f1d5586 (bush_berry_red)
  #23 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=40b30c8f-a0d1-440e-a2b8-c08ecaebb5a3 (Main)
  #24 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=ebfa71bd fHash=3f59c0a3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=300ef053-fa02-444b-8781-566c06f27f13 (Main)
  #25 type=MeshStandardMaterial name='Material.001' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9d7dc8c4-3e08-4b00-a768-3be784ac92b6 (Wood)
  #26 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=aaa7667c-0804-4358-9ed7-538b49f11257 (lambert2SG)
  #27 type=MeshPhysicalMaterial name='Material #55.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=28fefd22 fHash=d3c0e09e stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2284664a-930d-4f98-9cc9-e7dd17bc1339 (Material #55.002)
  #28 type=MeshPhysicalMaterial name='Material #54.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=b1c1b8a0 fHash=27c8d486 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=afcfc4ae-38d2-443a-b649-d4e68ceb4ef2 (Material #54.002)
  #29 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=4be16ad2 fHash=63f37341 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=999a9130-a347-40d1-848d-2b23383fc37d (BlackBear_mat)
  #30 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e9a249ab-29f3-4bda-a6ad-82c30bb5e461 (MI_Peasant)
  #31 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=59a49d44-e5f7-4199-9895-a4a9ad62bfc6 (MI_Hair_1)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f422b6b0-1ca1-4479-a926-174dfd016dd2 (MI_Hair_1)
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
      material=5a8ae932-87dc-448a-92b1-4fe13192707e (Green)
  #48 type=MeshStandardMaterial name='MapleTree_Bark' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=fa715d94-267a-4e79-8833-cf51215e7ee9 (NormalTree_Bark)
  #49 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9cdf5ea4-080b-4d5f-b10e-c9e183f1de44 (PineTree_Leaves)
  #50 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=247f4d78-5ac3-4342-b954-2405d75bfdb6 (stockpiles_vc)
  #51 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=ff181a99-68cc-4bbf-a6b5-c193361261b1
  #52 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0ff59b65-e090-4d1f-a3a5-4f2824bc2d36 (Pond_Pack_MAT)
  #53 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2cb76609-9e0b-48e1-ae99-23d04c70e4c7 (MI_Regular_Male)
  #54 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=8a004504-a844-40fb-8256-9d9d3ca7ae42 (MI_WoodTrim)
  #55 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=992777cf-986a-4365-b025-558eecb811af (MI_WoodTrim)
  #56 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f41b56d0-a13b-4a38-a952-8ed5375c23b9 (MI_Eyes)
  #57 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=13a99c9f-75cb-47d1-ba53-4c544a7f9275
  #58 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2b6c8be7 fHash=d9be0b50 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=afc08a40-6ff5-4d32-9049-36e972302cf1
  #59 type=MeshStandardMaterial name='MI_Banner' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=969dd16b fHash=da775605 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=93f90301-a027-4a8a-bfc8-1c09e37f8d90 (MI_Trim_Props_Vertex)
  #60 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=31f18c56-4c89-487d-8856-092a8673aa79 (Main)
  #61 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=22b3f681-7da4-4f1c-a5f4-438f3adb7517 (MI_Knight)
  #62 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9f624da2-c361-4ffc-97db-a0d62c0b3c53 (MI_Hair_1)
  #63 type=MeshStandardMaterial name='SV_WorkSkirtBlue' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=d8e50ec3 fHash=189af887 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f3d4b15d-8ae5-4192-b3fa-c0da4c8318ef (SV_WorkSkirtBlue)
  #64 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=afb8de20 fHash=950d7105 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ec5e11ad-7251-4756-9184-2cb4444ad33b (MI_Peasant)
  #65 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=9dc1f851 fHash=baf2480 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0b48eb89-1906-4d1d-aec7-e56a246133a9 (MI_Peasant)
  #66 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #67 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #68 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #69 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=940388d7-fd37-4ca0-8ce4-84bf508ba275 (MI_WindowGlass)
  #70 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #71 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=62e28016-1347-4246-896e-9172b4e4a7f5 (MI_WindowGlass)
  #72 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #73 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #74 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #75 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #76 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #77 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #78 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #79 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #80 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #81 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #82 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #83 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #84 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #85 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #86 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #87 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #88 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=669a1bfa stage=postprocess-render
  #89 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=3f71df04, #10=5b43c776, #66=df7c703d, #67=f92c8d8c, #72=279cec18, #73=84736a68, #74=aa2edbee, #75=7bae0bb2, #76=436caea4, #77=886438e7, #78=d99a5b29, #79=2003ced8, #80=28dfa407, #81=756a0b19, #82=b2354ff2, #83=ea82969e, #84=7dab8d9a, #85=378e1fb7, #86=78acf7ea, #87=a312c579, #88=b817515d
    fragmentShaderHash differs: #0=ca32daaf, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=d4350921, #10=70b71dad, #66=236b3b0b, #67=87d053eb, #72=4d6bcede, #73=ffecb62a, #74=76ced00a, #75=fb55b3c0, #76=2d687ef1, #77=dc2a89b5, #78=109e33fc, #79=db0f470a, #80=9775cd0e, #81=5c741650, #82=2aad9943, #83=a2297d9f, #84=1022767b, #85=ce0bf6b4, #86=707f290c, #87=c05e2256, #88=669a1bfa
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #66=(unset), #67=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset), #76=(unset), #77=(unset), #78=(unset), #79=(unset), #80=(unset), #81=(unset), #82=(unset), #83=(unset), #84=(unset), #85=(unset), #86=(unset), #87=(unset), #88=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #66=(unknown), #67=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown)
  MeshStandardMaterial (45 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=b24f037, #14=c0d790d1, #15=a9733c9d, #16=ab1dd48f, #17=c8df3222, #18=643ad3a2, #19=86d8050b, #20=6550e08d, #21=80917d5e, #22=a9324552, #23=54e03756, #24=ebfa71bd, #25=a99aa494, #26=7bb77142, #29=4be16ad2, #30=842fe1df, #31=ac268392, #32=1c179521, #33=a369060f, #47=190d3a9c, #48=9dbe8ee7, #49=3bea20f6, #50=a64d124e, #51=94297e69, #52=c3bc6325, #53=20daccfa, #54=12873951, #55=c5e73b05, #56=1dcbc6ff, #57=66d360c8, #58=2b6c8be7, #59=969dd16b, #60=fd8301ed, #61=140c5e62, #62=ee59055a, #63=d8e50ec3, #64=afb8de20, #65=9dc1f851, #68=13a74ec7, #69=9dcf1cb4, #70=fc941d05, #71=e551c572
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=547224f1, #14=a81023c3, #15=bd723c8a, #16=943c7b97, #17=7a23219b, #18=6578c10d, #19=9f0671e7, #20=e1e27532, #21=633146b4, #22=9b37dc78, #23=d391c52, #24=3f59c0a3, #25=63f9c0d1, #26=87728b15, #29=63f37341, #30=34995f15, #31=25a41317, #32=71f22dc6, #33=f6cbc3c, #47=633146b4, #48=8dba9dd, #49=5b26a60d, #50=546e469, #51=aa0735a8, #52=ded4be89, #53=a8862f4a, #54=d4c95125, #55=d4c95125, #56=1a1c0d8, #57=c0b8fc9f, #58=d9be0b50, #59=da775605, #60=2f2885d5, #61=46d4b31c, #62=e8d88acf, #63=189af887, #64=950d7105, #65=baf2480, #68=3ab4c629, #69=2d1aa4a, #70=3ab4c629, #71=2d1aa4a
    bucket differs: #2=terrain, #7=other, #9=other, #13=environment, #14=vegetation, #15=environment, #16=(unknown), #17=vegetation, #18=environment, #19=(unknown), #20=vegetation, #21=(unknown), #22=vegetation, #23=fauna, #24=fauna, #25=vegetation, #26=fauna, #29=fauna, #30=other, #31=other, #32=other, #33=(unknown), #47=vegetation, #48=vegetation, #49=vegetation, #50=settlement, #51=other, #52=other, #53=other, #54=settlement, #55=settlement, #56=other, #57=settlement, #58=settlement, #59=settlement, #60=fauna, #61=npc, #62=npc, #63=npc, #64=npc, #65=npc, #68=(unknown), #69=settlement, #70=(unknown), #71=settlement
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=(unset), #17=, #18=, #19=(unset), #20=, #21=(unset), #22=, #23=, #24=, #25=, #26=, #29=, #30=, #31=, #32=, #33=(unset), #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=, #57=, #58=, #59=, #60=, #61=, #62=, #63=, #64=, #65=, #68=(unset), #69=, #70=(unset), #71=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0, #15=0, #16=(unknown), #17=0.45, #18=0, #19=(unknown), #20=0.45, #21=(unknown), #22=0.5, #23=0, #24=0, #25=0, #26=0, #29=0, #30=0, #31=0, #32=0, #33=(unknown), #47=0, #48=0, #49=0.5, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0, #59=0, #60=0, #61=0, #62=0, #63=0, #64=0, #65=0, #68=(unknown), #69=0, #70=(unknown), #71=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #68=(unknown), #69=false, #70=(unknown), #71=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=true, #52=false, #53=false, #54=false, #55=false, #56=false, #57=true, #58=true, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #68=(unknown), #69=false, #70=(unknown), #71=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=(unknown), #17=true, #18=true, #19=(unknown), #20=true, #21=(unknown), #22=true, #23=true, #24=true, #25=true, #26=true, #29=true, #30=true, #31=true, #32=true, #33=(unknown), #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true, #59=true, #60=true, #61=true, #62=true, #63=true, #64=true, #65=true, #68=(unknown), #69=true, #70=(unknown), #71=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=false, #15=false, #16=(unknown), #17=true, #18=false, #19=(unknown), #20=true, #21=(unknown), #22=true, #23=false, #24=false, #25=false, #26=true, #29=true, #30=true, #31=true, #32=true, #33=(unknown), #47=false, #48=true, #49=true, #50=false, #51=false, #52=true, #53=true, #54=true, #55=true, #56=true, #57=false, #58=false, #59=true, #60=false, #61=true, #62=true, #63=false, #64=true, #65=true, #68=(unknown), #69=false, #70=(unknown), #71=false
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=true, #49=false, #50=false, #51=false, #52=false, #53=false, #54=true, #55=true, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #68=(unknown), #69=false, #70=(unknown), #71=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #68=(unknown), #69=true, #70=(unknown), #71=true
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=true, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=true, #25=false, #26=false, #29=true, #30=true, #31=true, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=true, #51=false, #52=true, #53=true, #54=false, #55=false, #56=true, #57=false, #58=true, #59=true, #60=false, #61=false, #62=false, #63=false, #64=false, #65=true, #68=(unknown), #69=false, #70=(unknown), #71=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #21=(unknown), #22=false, #23=false, #24=false, #25=false, #26=false, #29=false, #30=false, #31=false, #32=false, #33=(unknown), #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #68=(unknown), #69=false, #70=(unknown), #71=false
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



Frame 1180 (+14):
  Program #96
    material: MeshStandardMaterial ''
    materialUuid: 23e255dd-3dc1-4ff6-a6b7-24747a9e8942
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #97
    material: MeshStandardMaterial 'Wood'
    materialUuid: 9d7dc8c4-3e08-4b00-a768-3be784ac92b6
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #98
    material: MeshStandardMaterial 'Green'
    materialUuid: 5a8ae932-87dc-448a-92b1-4fe13192707e
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
    materialUuid: c16991c3-9ca9-4f76-a202-be617eca6cab
    object: Mesh 'chunk-environment-region-0,0|fallenLog-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #100
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 8322ffc9-95d8-4535-a4f7-b6842eed21a7
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #101
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3d4da646-a1e2-42a2-8955-d0367485485c
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
    materialUuid: 64b759d7-6c62-4ca6-8a35-6e76e981a306
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #103
    material: MeshStandardMaterial 'Leaves_NormalTree'
    materialUuid: d5cce462-cca9-42a2-8b0f-5de50b4ed248
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
    vertexShaderHash: 2a1d4d38
    fragmentShaderHash: 5477a31d
  Program #104
    material: MeshStandardMaterial 'bush_berry_red'
    materialUuid: 2b33897c-cea0-4fa3-8544-71893f1d5586
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee440db4
    fragmentShaderHash: a96cc074
  Program #105
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 2cb76609-9e0b-48e1-ae99-23d04c70e4c7
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #106
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: f41b56d0-a13b-4a38-a952-8ed5375c23b9
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #107
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: e9a249ab-29f3-4bda-a6ad-82c30bb5e461
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #108
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 59a49d44-e5f7-4199-9895-a4a9ad62bfc6
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #109
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f422b6b0-1ca1-4479-a926-174dfd016dd2
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1439 (+21):
  Program #113
    material: ShaderMaterial 'SkyShader'
    materialUuid: 3f862ec4-fe92-45bc-a6a2-df7bde8702cf
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: dbd39394
  Program #114
    material: ShaderMaterial ''
    materialUuid: e7b8921e-aa14-41e1-ad27-b3c9786d62b7
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #115
    material: MeshStandardMaterial ''
    materialUuid: 23e255dd-3dc1-4ff6-a6b7-24747a9e8942
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #116
    material: MeshStandardMaterial 'Wood'
    materialUuid: 9d7dc8c4-3e08-4b00-a768-3be784ac92b6
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #117
    material: MeshStandardMaterial 'Green'
    materialUuid: 5a8ae932-87dc-448a-92b1-4fe13192707e
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
    materialUuid: c16991c3-9ca9-4f76-a202-be617eca6cab
    object: Mesh 'chunk-environment-region-0,0|fallenLog-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #119
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 8322ffc9-95d8-4535-a4f7-b6842eed21a7
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 3d4da646-a1e2-42a2-8955-d0367485485c
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
    materialUuid: 64b759d7-6c62-4ca6-8a35-6e76e981a306
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'Leaves_NormalTree'
    materialUuid: d5cce462-cca9-42a2-8b0f-5de50b4ed248
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
    vertexShaderHash: c8df3222
    fragmentShaderHash: 7501dfe
  Program #123
    material: MeshStandardMaterial 'bush_berry_red'
    materialUuid: 2b33897c-cea0-4fa3-8544-71893f1d5586
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a9324552
    fragmentShaderHash: 481650a5
  Program #124
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 2cb76609-9e0b-48e1-ae99-23d04c70e4c7
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: f41b56d0-a13b-4a38-a952-8ed5375c23b9
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: e9a249ab-29f3-4bda-a6ad-82c30bb5e461
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 59a49d44-e5f7-4199-9895-a4a9ad62bfc6
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: f422b6b0-1ca1-4479-a926-174dfd016dd2
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: ShaderMaterial ''
    materialUuid: 9d18f693-4b4c-4fb5-9ad2-7f949b766eac
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
    materialUuid: 871d262c-c21c-40c0-8d8d-08ebc6f496ce
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #132
    material: ShaderMaterial ''
    materialUuid: 9a891f15-9a50-495e-93d5-c563df22b395
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #133
    material: ShaderMaterial ''
    materialUuid: fdbf6e99-3639-47cd-a933-62e98210dadd
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
Excluded — no reliable per-program timing: 128 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 9
  #90
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 130.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 102
  #91
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 534.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 103
  #92
      material: MeshStandardMaterial 'Material'
      object: SkinnedMesh 'Cube_1'
      asset: /models/fauna/dog_husky.glb
      compile/link: 218.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 105
  #93
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 66.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 146
  #94
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 88.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 153
  #95
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 85.6 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1123.4 ms
  programs >1 ms: 6
  max: 534.0 ms (#91)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.3 ms  p95=6.6 ms  max=7.1 ms  Δavg vs baseline=—
  hide-grass           avg=5.4 ms  p95=6.8 ms  max=8.5 ms  Δavg vs baseline=+0.1 ms (+2%)
  hide-vegetation      avg=4.5 ms  p95=5.5 ms  max=6.2 ms  Δavg vs baseline=-0.9 ms (-16%)
  no vegetation/grass  avg=4.4 ms  p95=5.7 ms  max=6.4 ms  Δavg vs baseline=-1.0 ms (-18%)
  hide-environment     avg=5.5 ms  p95=6.3 ms  max=8.9 ms  Δavg vs baseline=+0.2 ms (+4%)
  hide-settlement      avg=5.1 ms  p95=6.8 ms  max=6.9 ms  Δavg vs baseline=-0.3 ms (-5%)
  no water             avg=5.3 ms  p95=6.9 ms  max=7.4 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-terrain         avg=5.5 ms  p95=6.9 ms  max=8.4 ms  Δavg vs baseline=+0.2 ms (+3%)
  hide-npc-fauna       avg=4.6 ms  p95=5.9 ms  max=6.3 ms  Δavg vs baseline=-0.7 ms (-14%)
  no-shadows           avg=5.3 ms  p95=6.3 ms  max=7.3 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-ao                avg=5.8 ms  p95=7.1 ms  max=7.7 ms  Δavg vs baseline=+0.5 ms (+10%)
  no-bloom             avg=5.8 ms  p95=7.6 ms  max=8.5 ms  Δavg vs baseline=+0.5 ms (+10%)
  no-smaa              avg=5.7 ms  p95=7.5 ms  max=8.6 ms  Δavg vs baseline=+0.4 ms (+8%)
  no-god-rays          avg=5.6 ms  p95=7.3 ms  max=8.6 ms  Δavg vs baseline=+0.2 ms (+5%)
  no-film-grade        avg=5.7 ms  p95=6.9 ms  max=8.4 ms  Δavg vs baseline=+0.3 ms (+6%)
  no postprocessing    avg=5.6 ms  p95=7.1 ms  max=7.7 ms  Δavg vs baseline=+0.3 ms (+6%)
  no mirrors           avg=5.7 ms  p95=6.2 ms  max=6.4 ms  Δavg vs baseline=+0.4 ms (+8%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.4 ms  p95=25.5 ms  max=25.9 ms
  CPU wall      avg=5.3 ms  p95=6.6 ms  max=7.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=1 sync ms total=56.5 max=56.5 store hits=3 prefetched=11
