# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T15:17:12.535Z
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
Frames: 707
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0fd9a5443e86d86e8f0324e138ffad505b644fc2
  runId: 2026-11-03T15-16-14-040Z-x0s4bv
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
  camera: pos=(426.8, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5027ms npc=8
  gpuTimer: available=true resolved=true samples=710 span=postprocess+labels

FPS:
  avg: 59.5
  min: 2
  p1: 10

Frame time (wall-clock):
  avg: 16.8 ms
  p50: 13.6 ms
  p95: 27.2 ms
  p99: 96.5 ms
  max: 538.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.7 p95=13.8 p99=25.4 max=69.9 n=707
  render: p50=8.3 p95=13.9 p99=88.8 max=532.8 n=707
  frame: p50=13.6 p95=27.2 p99=96.5 max=538.2 n=707

Rendering (combined renderer.info):
  draw calls: 390 avg / 1147 max
  triangles: 9.60M avg
  mirror draws: 55 avg
  geometries: 632
  textures: 331

Pass submissions (actual):
  reliability: observed
  frames: 713 shadowRefresh=299 shadowSkipped=414
  mirror calls avg: 55
  shadow calls avg: 146
  main calls avg: 259

Scene (one-pass estimate):
  terrain          draws=58 tris=4.28M meshes=58 inst=58
  grass            draws=36 tris=433.7k meshes=36 inst=55893
  vegetation       draws=134 tris=1.05M meshes=134 inst=660
  environment      draws=47 tris=17.6k meshes=47 inst=59
  settlement       draws=358 tris=542.8k meshes=358 inst=913
  water            draws=44 tris=3.18M meshes=44 inst=44
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=171 tris=70.4k meshes=171 inst=171
  items            draws=271 tris=20.3k meshes=271 inst=271
  other            draws=216 tris=27.0k meshes=216 inst=216

Shadow casters (one-pass estimate):
  terrain          draws=58 tris=4.28M meshes=58 inst=58
  vegetation       draws=120 tris=1.01M meshes=120 inst=634
  environment      draws=46 tris=17.6k meshes=46 inst=58
  settlement       draws=259 tris=448.8k meshes=259 inst=776
  items            draws=30 tris=15.3k meshes=30 inst=30
  other            draws=95 tris=14.5k meshes=95 inst=95

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
  terrain                  nodes=58 composed=58 multiplied=58 skinned=0
  grass                    nodes=47 composed=47 multiplied=47 skinned=0
  vegetation               nodes=157 composed=157 multiplied=157 skinned=0
  environment              nodes=66 composed=66 multiplied=66 skinned=0
  settlement               nodes=703 composed=703 multiplied=703 skinned=0
  water                    nodes=44 composed=44 multiplied=44 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1776 composed=1776 multiplied=1776 skinned=151
  items                    nodes=418 composed=418 multiplied=418 skinned=0
  other                    nodes=424 composed=407 multiplied=424 skinned=9
  top scene children:
    fauna ×42                nodes=1776 composed=1776 multiplied=1776 skinned=151
    settlement ×1            nodes=703 composed=703 multiplied=703 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    chunk-items ×25          nodes=415 composed=415 multiplied=415 skinned=0
    Group ×36                nodes=244 composed=244 multiplied=244 skinned=9
    chunk ×58                nodes=58 composed=58 multiplied=58 skinned=0
    Root_Scene ×16           nodes=56 composed=56 multiplied=56 skinned=0
    chunk-grass ×11          nodes=47 composed=47 multiplied=47 skinned=0
    chunk-water ×43          nodes=43 composed=43 multiplied=43 skinned=0
    chunk-river ×38          nodes=38 composed=38 multiplied=38 skinned=0
    Object3D ×30             nodes=30 composed=30 multiplied=30 skinned=0
    chunk-vegetation ×1      nodes=19 composed=19 multiplied=19 skinned=0

Systems:
  WATER          1.3 ms
  STREAMING      1.2 ms
  NPC            1.2 ms
  FAUNA          1.9 ms
  PHYSICS        0.1 ms
  RENDER         9.3 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. WATER

Critical spikes:
  WATER: 14
  STREAMING: 13

Hitches (>= 8 ms): total=27
  chunk water            n=13 avg=12.3 max=31.1
  chunk mesh             n=13 avg=15.0 max=23.9
  chunk river            n=1 avg=12.6 max=12.6

Isolation probes:
  full               render=5.3 ms draws=243 tris=5.14M
  hide-grass         render=5.1 ms draws=210 tris=4.02M
  hide-vegetation    render=4.2 ms draws=129 tris=3.69M
  hide-vegetation-grass render=4.3 ms draws=100 tris=2.63M
  hide-environment   render=5.2 ms draws=224 tris=5.08M
  hide-settlement    render=5.1 ms draws=243 tris=5.14M
  hide-water         render=5.3 ms draws=231 tris=4.32M
  hide-terrain       render=5.4 ms draws=218 tris=3.33M
  hide-npc-fauna     render=4.7 ms draws=239 tris=5.09M
  no-shadows         render=5.5 ms draws=236 tris=4.98M
  no-ao              render=5.5 ms draws=237 tris=5.14M
  no-bloom           render=5.6 ms draws=230 tris=5.14M
  no-smaa            render=5.7 ms draws=240 tris=5.14M
  no-god-rays        render=5.4 ms draws=243 tris=5.14M
  no-film-grade      render=5.3 ms draws=239 tris=5.09M
  no-postprocessing  render=5.3 ms draws=218 tris=5.09M
  no-reflections     render=5.8 ms draws=191 tris=4.27M

Frame attribution:
  frame max: 538.2 ms
  largest labelled hitch: 31.1 ms
  unattributed: 507.1 ms

Long frames:
  threshold: 80 ms
  count: 11
  worst: 538.2 ms

Raw sidecar:
  sampling=full factor=1 exported=707/707

Recommendation:
Largest frame (538.2 ms) is not explained by labelled hitches (largest 31.1 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 29

NPC:
  total: 1.2 ms/frame
  crowd pass: 0.0 ms/frame (3.1 ms cumulative)
  agent updates: 0.6 ms/frame (434.3 ms cumulative)
  livestock: 0.4 ms/frame (274.6 ms cumulative)
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
    nearest scans: 5.3/frame (0.0 candidates/frame)
    water samples: 14.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 14.2/frame, 0.00 ms/frame (worst call 0.10 ms, 2496.9 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 11.2
    behaviour executions/frame: 5.3
    presentation executions/frame: 4.7
  rats: 0.1 ms/frame (50.9 ms cumulative)
  social: 0.0 ms/frame (3.0 ms cumulative)
  streaming: 0.0 ms/frame (0.9 ms cumulative)
  maintenance: 0.1 ms/frame (50.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.9 ms/frame
  agent updates: 1.9 ms/frame (1334.7 ms cumulative)
  forest sampling: 0.1 ms/frame (75.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (24.9 ms cumulative)
    targeting: 0.0 ms/frame (12.6 ms cumulative)
    decision: 0.0 ms/frame (21.3 ms cumulative)
    behaviour: 1.1 ms/frame (791.1 ms cumulative)
    life/presentation: 0.4 ms/frame (314.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.2
    sensing passes/frame: 28.6
    decision passes/frame: 28.6
    high-priority agents/frame: 1.3
    expensive behaviour agents/frame: 17.9
    full-rate agents/frame: 11.5
    reduced-cadence agents/frame: 17.1
    behaviour executions/frame: 19.2
    presentation executions/frame: 18.2

  sensing/cache:
    forest samples/frame: 29.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 51.3
    player perception checks/frame: 28.6

  nearest scans: 23.2/frame (16383 calls)
  nearest candidates checked: 86.3/frame (61028 total)
  herd leader scans: 0.2/frame (142 calls)
  herd candidates checked: 5.8/frame (4118 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.9/frame (169.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 62.8/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 62.8/frame, 0.10 ms/frame (worst call 1.40 ms, 9524.1 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 77
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.13 ms
    max 0.40 ms

  allocation/setup:
    avg 0.07 ms
    max 0.20 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.04 ms
    max 0.20 ms
  scene attach (`scene.add`):
    avg 0.04 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.37 ms
    max 1.10 ms

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
    allocation/setup avg/max: 0.06 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.21 / 0.90 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 11
Resident instances: full=166426 filler=58637
Submitted instances: full=48228 filler=7664
Meshes submitted: 35
LOD submitted fraction: full=0.2897864516361626 filler=0.1307024574927094
Flowers: unavailable
Allocation bytes (estimated): 21606048
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=30 discard(unload=0,oor=0) cancel=0 streamIn=15 streamOut=25 invalidate=0
Finalization: observed completions=30

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 713
Shadow refresh frames: 299
Shadow skipped frames: 414

Mirror:
  calls avg: 55  tris avg: 666858
  info calls avg: 55  residual calls avg: 0
  switches avg: material=23.9 program=14.7  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2.9 skeletons first used=2.9
  environment                  calls=3 tris=2828
  items                        calls=0 tris=136
  other                        calls=21 tris=4222
  settlement:decor             calls=3 tris=8279
  settlement:fence             calls=0 tris=29
  settlement:fireHouseExteriorLamp calls=0 tris=10
  settlement:fireHouseInteriorLamp calls=0 tris=7
  settlement:fireVillageTorch  calls=0 tris=10
  settlement:houseInteractive  calls=0 tris=25
  settlement:houseStatic       calls=1 tris=1320
  settlement:landmarkWellHousehold calls=0 tris=43
  settlement:other             calls=0 tris=888
  settlement:storageBarrel     calls=0 tris=330
  settlement:storageContainer  calls=0 tris=75
  settlement:storageGoods      calls=1 tris=118
  settlement:storageTrough     calls=0 tris=44
  settlement:storageWoodHousehold calls=0 tris=177
  settlement:storageWoodSettlementPrimary calls=0 tris=7
  terrain                      calls=5 tris=346021
  vegetation                   calls=20 tris=302412

Shadow (refresh only):
  calls avg: 146  tris avg: 1802149
  info calls avg: 146  residual calls avg: 0
  switches avg: material=66.4 program=68.2  actor: calls=11.5 material=0 program=2.3
  skinning avg: skinned calls=15.3 skeletons first used=7.4
  environment                  calls=8 tris=6198
  faunaFamily:chicken          calls=1 tris=76
  faunaFamily:cow              calls=0 tris=164
  faunaFamily:dog              calls=1 tris=289
  faunaFamily:horse            calls=1 tris=234
  faunaFamily:rabbit           calls=0 tris=304
  faunaFamily:rat              calls=0 tris=121
  faunaFamily:rooster          calls=0 tris=100
  faunaFamily:sheep            calls=1 tris=200
  faunaFamily:stag             calls=3 tris=2001
  faunaFamily:wolf             calls=1 tris=256
  items                        calls=4 tris=1736
  npcFamily:Farmer             calls=1 tris=1055
  npcFamily:Knight_Cloth       calls=1 tris=797
  npcFamily:Peasant            calls=2 tris=1818
  npcFamily:Peasant_Boots      calls=0 tris=409
  npcFamily:Ranger_NoHood      calls=0 tris=435
  npcFamily:woodcutter         calls=0 tris=327
  other                        calls=33 tris=9147
  settlement:decor             calls=20 tris=50521
  settlement:fence             calls=0 tris=105
  settlement:fireHouseInteriorLamp calls=1 tris=66
  settlement:houseInteractive  calls=1 tris=232
  settlement:houseStatic       calls=5 tris=6611
  settlement:landmarkGarden    calls=0 tris=257
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=1 tris=213
  settlement:landmarkWellPasture calls=0 tris=27
  settlement:other             calls=1 tris=4095
  settlement:storageContainer  calls=1 tris=313
  settlement:storageHay        calls=0 tris=59
  settlement:storageTrough     calls=0 tris=208
  settlement:storageWoodHousehold calls=0 tris=814
  settlement:storageWoodSettlementPrimary calls=0 tris=81
  settlement:workplace         calls=0 tris=387
  terrain                      calls=14 tris=1052530
  vegetation                   calls=44 tris=659963

Main:
  calls avg: 259  tris avg: 8140780
  info calls avg: 334  residual calls avg: 0
  switches avg: material=128.8 program=47.2  actor: calls=5.2 material=4.3 program=2.3
  skinning avg: skinned calls=13.8 skeletons first used=5.1
  environment                  calls=9 tris=7928
  faunaFamily:bear             calls=0 tris=304
  faunaFamily:chicken          calls=0 tris=35
  faunaFamily:cow              calls=0 tris=162
  faunaFamily:dog              calls=0 tris=97
  faunaFamily:horse            calls=0 tris=41
  faunaFamily:rabbit           calls=0 tris=74
  faunaFamily:rooster          calls=0 tris=47
  faunaFamily:sheep            calls=0 tris=104
  faunaFamily:stag             calls=0 tris=146
  faunaFamily:wolf             calls=1 tris=385
  grass                        calls=36 tris=5432103
  items                        calls=46 tris=4143
  npcFamily:Farmer             calls=0 tris=350
  npcFamily:Knight_Cloth       calls=1 tris=819
  npcFamily:Peasant            calls=1 tris=1432
  npcFamily:Ranger_NoHood      calls=0 tris=91
  other                        calls=73 tris=14691
  settlement:decor             calls=5 tris=17514
  settlement:fence             calls=0 tris=58
  settlement:fireHouseExteriorLamp calls=0 tris=19
  settlement:fireHouseInteriorLamp calls=0 tris=13
  settlement:fireVillageTorch  calls=0 tris=27
  settlement:houseInteractive  calls=0 tris=53
  settlement:houseStatic       calls=2 tris=2686
  settlement:landmarkGarden    calls=0 tris=851
  settlement:landmarkNoticeBoard calls=0 tris=0
  settlement:landmarkWellCentral calls=0 tris=37
  settlement:landmarkWellHousehold calls=0 tris=88
  settlement:other             calls=0 tris=1869
  settlement:storageBarrel     calls=0 tris=718
  settlement:storageContainer  calls=1 tris=159
  settlement:storageGoods      calls=1 tris=254
  settlement:storageHay        calls=0 tris=1
  settlement:storageTrough     calls=0 tris=96
  settlement:storageWoodHousehold calls=0 tris=381
  settlement:storageWoodSettlementPrimary calls=0 tris=15
  settlement:workplace         calls=0 tris=35
  terrain                      calls=20 tris=1440213
  vegetation                   calls=52 tris=736631
  water                        calls=7 tris=476411


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 11
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 11 total):

[LONG FRAME] 538.2ms
simulate         4.4ms
render         532.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA            1.3ms
PHYSICS          0.2ms
RENDER         532.8ms
OTHER            2.1ms

Long frame #2:

[LONG FRAME] 148ms
simulate         5.9ms
render         141.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER         141.9ms
OTHER            3.5ms

Long frame #3:

[LONG FRAME] 147.3ms
simulate        33.3ms
render         111.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING       11.3ms
NPC              6.0ms
FAUNA           11.0ms
PHYSICS          0.0ms
RENDER         111.5ms
OTHER            7.3ms

streaming / stages:
  chunkUpdate                  11.3ms
  terrainPrepare               3.1ms
  riverChannelSegmentsNear     2.3ms

Long frame #4:

[LONG FRAME] 125.2ms
simulate         5.6ms
render         119.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           54.8ms
STREAMING       37.9ms
NPC              1.4ms
FAUNA            2.6ms
PHYSICS          0.2ms
RENDER          64.5ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              15.3ms
  riverFinalize                12.6ms
  waterFinalize                9.7ms
  chunkFinalize                0.2ms
  chunkUpdate                  0.2ms

hitches:
  STREAMING chunk mesh             15.3ms
  WATER chunk water            9.7ms
  WATER chunk river            12.6ms

Long frame #5:

[LONG FRAME] 119.3ms
simulate         9.1ms
render         109.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              2.9ms
FAUNA            2.6ms
PHYSICS          0.2ms
RENDER         109.0ms
OTHER            4.3ms

---

[Seedvale Program Census]

Programs created: 134
Program count: final=134 max=134

By frame:
  frame 0   +91 programs   <== largest transition
  frame 9   +1 program
  frame 92   +1 program
  frame 118   +1 program
  frame 138   +1 program
  frame 149   +1 program
  frame 1174   +14 programs
  frame 1218   +3 programs
  frame 1435   +21 programs

Largest transition — frame 0 (+91 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=ca32daaf stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e9019ed7-ed1b-4532-836a-027940560426 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4d79916e-6f1e-40cf-91e6-54d97ac7653f
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=0cd8b135-8b2f-4af0-9d58-abcb712dc5a3
  #3 type=ShaderMaterial name='' bucket=other cacheKey=4,5,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=72bc9fc7-2204-4fd0-956a-f13b6048deba
  #4 type=ShaderMaterial name='' bucket=water cacheKey=6,7,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2b9a5b9f-31cb-4616-a011-e8460bfa273a
  #5 type=MeshStandardMaterial name='HalloweenBits' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=b24f037 fHash=547224f1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ad39cb2e-22e4-4fa6-8548-b4a282166931 (HalloweenBits)
  #6 type=ShaderMaterial name='' bucket=water cacheKey=6,7,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3083f6e2-25e9-428e-840d-9d4cbe37525e
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=75b1dce1-d5af-42e4-8909-12cc6fc8524f
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f1d5ac12-a493-4f99-a9a5-d20f3b95c8d7
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2b7c06f3-1191-4cf4-97d4-a28d83ef105b (Wood)
  #10 type=ShaderMaterial name='' cacheKey=8,9,highp,srgb-linear,fa… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2d53b558-2a5d-4a4c-aac8-c31ad0d75e1b
  #13 type=ShaderMaterial name='' bucket=grass cacheKey=10,11,highp,srgb-linear,… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=82335a04-8162-4fb6-a3b4-d7c35cc8e5de
  #14 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=17b8e3df-85ab-4671-a499-44e70e26067d (Main)
  #15 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=ebfa71bd fHash=3f59c0a3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b1fcba9f-234d-4d25-86a7-2c3ac72992c0 (Main)
  #16 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=64ba3d52-5fd2-40d2-8fb4-9677bd0df4c4 (Material.001)
  #17 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=038dcff5-402a-4fe4-84a6-6a54303eac88 (lambert2SG)
  #18 type=MeshPhysicalMaterial name='Material #55.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=28fefd22 fHash=d3c0e09e stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=98476d0c-14d6-4ef5-9041-93c38cbbb006 (Material #55.002)
  #19 type=MeshPhysicalMaterial name='Material #54.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=b1c1b8a0 fHash=27c8d486 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dc3c90a9-3481-4d7d-b725-20cfd0b7a849 (Material #54.002)
  #20 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=4be16ad2 fHash=63f37341 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=823fb0b8-8fd2-4373-a23b-69a4406e5351 (BlackBear_mat)
  #21 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2ad3950d-d1e6-4904-b169-37545981dd9a (Green)
  #22 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=29fc3455-4418-4a6a-ba03-7fb3bc8fb873 (Stone)
  #23 type=MeshStandardMaterial name='NormalTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=ab1dd48f fHash=943c7b97 stage=postprocess-render
  #24 type=MeshStandardMaterial name='Leaves_NormalTree' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c8df3222 fHash=7a23219b stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2c3af040-958a-4ab7-b5bb-66519d19f86c (Leaves_NormalTree)
  #25 type=MeshStandardMaterial name='Wood' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=643ad3a2 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=71177129-a5e6-418a-8e59-36e9b41c3435 (Wood)
  #26 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=items cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9e1c6446-d0f4-4caf-8b80-e802d6df265f (Pond_Pack_MAT)
  #27 type=MeshStandardMaterial name='PineTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=86d8050b fHash=9f0671e7 stage=postprocess-render
  #28 type=MeshStandardMaterial name='PineTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=6550e08d fHash=e1e27532 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=37fdee17-2abf-4c64-a140-5cfd1c6c81a5 (Flowers)
  #29 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=80917d5e fHash=633146b4 stage=postprocess-render
  #30 type=MeshStandardMaterial name='bush_berry_red' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=a9324552 fHash=9b37dc78 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c071228f-fae9-4562-9b7f-c960c4a0f85c (bush_berry_red)
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3061f6ee-e928-4f89-bbaf-acc8a9dd7807 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2379ce5d-41b7-465d-802a-98ff2d43ac0a (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=02d57b89-5a48-412b-9538-2128418726dc (MI_Hair_1)
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
      material=8678fb4c-dfc6-455d-9e3f-dd7d177a8418 (Green)
  #49 type=MeshStandardMaterial name='MapleTree_Bark' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=85240540-db26-474f-a18c-403e4dad06d6 (NormalTree_Bark)
  #50 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=904ba09d-8a1f-4df3-8a53-51bcd0f7b3e0 (PineTree_Leaves)
  #51 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=90ae457d-8e62-487d-97b8-60d459b50902 (stockpiles_vc)
  #52 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=bcb23937-ccb2-4753-9297-d18a39b05a14
  #53 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7fb8ac9d-98de-4d79-aba8-5b5a7f6163a0 (MI_Regular_Male)
  #54 type=MeshStandardMaterial name='MI_Superhero_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ad5b7cce fHash=eb61e819 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=653299e2-252a-4380-9299-12b478e53b8f (MI_Eyes)
  #55 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=bd0ea411-7a9c-4162-984f-fd45a658c730 (MI_WoodTrim)
  #56 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=fe3c70fe-82fc-4f54-a00f-5208ab5d7bdd (MI_WoodTrim)
  #57 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=d801b615-3837-4128-9c91-c1043bdf283a
  #58 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2b6c8be7 fHash=d9be0b50 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=4b7cf677-7749-48f0-98d2-d584e44734ce
  #59 type=MeshStandardMaterial name='MI_Banner' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=969dd16b fHash=da775605 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c74502e3-63cf-4a33-acb3-6a23ea4315c4 (MI_Trim_Props_Vertex)
  #60 type=MeshStandardMaterial name='White' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f299d5d7 fHash=1b5e9115 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d456d0e5-07c4-4a69-876c-6d7ff7233b1a (Main)
  #61 type=MeshStandardMaterial name='Material' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=c2697ed8 fHash=b4e24e stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=8c657b13-ce21-41b3-a75a-fe13afdf4138 (Material)
  #62 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1f0df1b2-b8bb-49e3-b759-2efc31690a92 (MI_Knight)
  #63 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=008008a3-428f-4f5c-9558-6306305c9785 (MI_Hair_1)
  #64 type=MeshStandardMaterial name='SV_WorkSkirtBlue' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=d8e50ec3 fHash=189af887 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b86402e6-e838-4157-9ddf-c7433248c0d2 (SV_WorkSkirtBlue)
  #65 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=afb8de20 fHash=950d7105 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=466ca582-e7d0-4947-afb3-4b1d1cf5df84 (MI_Peasant)
  #66 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=9dc1f851 fHash=baf2480 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7210f01e-9ce4-4050-969f-f405ca167b3c (MI_Peasant)
  #67 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #68 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #69 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #70 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=2b8b1ea7-32da-4104-ade0-e905a8b831b5 (MI_WindowGlass)
  #71 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #72 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cfdfbbf0-9e3b-4a89-ad83-6629d65e250c (MI_WindowGlass)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=22690955, #4=1bb00362, #6=e6d01ae7, #10=5b43c776, #13=3f71df04, #67=df7c703d, #68=f92c8d8c, #73=279cec18, #74=84736a68, #75=aa2edbee, #76=7bae0bb2, #77=436caea4, #78=886438e7, #79=d99a5b29, #80=2003ced8, #81=28dfa407, #82=756a0b19, #83=b2354ff2, #84=ea82969e, #85=7dab8d9a, #86=378e1fb7, #87=78acf7ea, #88=a312c579, #89=b817515d
    fragmentShaderHash differs: #0=ca32daaf, #1=ae17ade6, #3=2cf9fa62, #4=a38bbf04, #6=e34491ff, #10=70b71dad, #13=d4350921, #67=236b3b0b, #68=87d053eb, #73=4d6bcede, #74=ffecb62a, #75=76ced00a, #76=fb55b3c0, #77=2d687ef1, #78=dc2a89b5, #79=109e33fc, #80=db0f470a, #81=9775cd0e, #82=5c741650, #83=2aad9943, #84=a2297d9f, #85=1022767b, #86=ce0bf6b4, #87=707f290c, #88=c05e2256, #89=669a1bfa
    bucket differs: #0=other, #1=other, #3=other, #4=water, #6=water, #10=(unknown), #13=grass, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=(unset), #4=1, #6=(unset), #10=(unset), #13=(unset), #67=(unset), #68=(unset), #73=(unset), #74=(unset), #75=(unset), #76=(unset), #77=(unset), #78=(unset), #79=(unset), #80=(unset), #81=(unset), #82=(unset), #83=(unset), #84=(unset), #85=(unset), #86=(unset), #87=(unset), #88=(unset), #89=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #6=0, #10=(unknown), #13=0, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #6=false, #10=(unknown), #13=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #6=true, #10=(unknown), #13=true, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #6=false, #10=(unknown), #13=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #6=false, #10=(unknown), #13=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #6=true, #10=(unknown), #13=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #6=false, #10=(unknown), #13=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #6=false, #10=(unknown), #13=false, #67=(unknown), #68=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown), #88=(unknown), #89=(unknown)
  MeshStandardMaterial (46 programs):
    vertexShaderHash differs: #2=5c2c57a3, #5=b24f037, #7=e3408c64, #9=d38f15a4, #14=54e03756, #15=ebfa71bd, #16=a99aa494, #17=7bb77142, #20=4be16ad2, #21=c0d790d1, #22=a9733c9d, #23=ab1dd48f, #24=c8df3222, #25=643ad3a2, #26=c3bc6325, #27=86d8050b, #28=6550e08d, #29=80917d5e, #30=a9324552, #31=842fe1df, #32=ac268392, #33=1c179521, #34=a369060f, #48=190d3a9c, #49=9dbe8ee7, #50=3bea20f6, #51=a64d124e, #52=94297e69, #53=20daccfa, #54=ad5b7cce, #55=12873951, #56=c5e73b05, #57=66d360c8, #58=2b6c8be7, #59=969dd16b, #60=f299d5d7, #61=c2697ed8, #62=140c5e62, #63=ee59055a, #64=d8e50ec3, #65=afb8de20, #66=9dc1f851, #69=13a74ec7, #70=9dcf1cb4, #71=fc941d05, #72=e551c572
    fragmentShaderHash differs: #2=e354d864, #5=547224f1, #7=c0b8fc9f, #9=6578c10d, #14=d391c52, #15=3f59c0a3, #16=63f9c0d1, #17=87728b15, #20=63f37341, #21=a81023c3, #22=bd723c8a, #23=943c7b97, #24=7a23219b, #25=6578c10d, #26=ded4be89, #27=9f0671e7, #28=e1e27532, #29=633146b4, #30=9b37dc78, #31=34995f15, #32=25a41317, #33=71f22dc6, #34=f6cbc3c, #48=633146b4, #49=8dba9dd, #50=5b26a60d, #51=546e469, #52=aa0735a8, #53=a8862f4a, #54=eb61e819, #55=d4c95125, #56=d4c95125, #57=c0b8fc9f, #58=d9be0b50, #59=da775605, #60=1b5e9115, #61=b4e24e, #62=46d4b31c, #63=e8d88acf, #64=189af887, #65=950d7105, #66=baf2480, #69=3ab4c629, #70=2d1aa4a, #71=3ab4c629, #72=2d1aa4a
    bucket differs: #2=terrain, #5=environment, #7=other, #9=other, #14=fauna, #15=fauna, #16=fauna, #17=fauna, #20=fauna, #21=vegetation, #22=environment, #23=(unknown), #24=vegetation, #25=environment, #26=items, #27=(unknown), #28=vegetation, #29=(unknown), #30=vegetation, #31=other, #32=other, #33=other, #34=(unknown), #48=vegetation, #49=vegetation, #50=vegetation, #51=settlement, #52=other, #53=other, #54=other, #55=settlement, #56=settlement, #57=settlement, #58=settlement, #59=settlement, #60=fauna, #61=fauna, #62=npc, #63=npc, #64=npc, #65=npc, #66=npc, #69=(unknown), #70=settlement, #71=(unknown), #72=settlement
    define STANDARD differs: #2=, #5=, #7=, #9=, #14=, #15=, #16=, #17=, #20=, #21=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #29=(unset), #30=, #31=, #32=, #33=, #34=(unset), #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=, #57=, #58=, #59=, #60=, #61=, #62=, #63=, #64=, #65=, #66=, #69=(unset), #70=, #71=(unset), #72=
    flag alphaTest differs: #2=0, #5=0, #7=0, #9=0, #14=0, #15=0, #16=0, #17=0, #20=0, #21=0, #22=0, #23=(unknown), #24=0.45, #25=0, #26=0, #27=(unknown), #28=0.45, #29=(unknown), #30=0.5, #31=0, #32=0, #33=0, #34=(unknown), #48=0, #49=0, #50=0.5, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0, #59=0, #60=0, #61=0, #62=0, #63=0, #64=0, #65=0, #66=0, #69=(unknown), #70=0, #71=(unknown), #72=0
    flag envMap differs: #2=false, #5=false, #7=false, #9=false, #14=false, #15=false, #16=false, #17=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag flatShading differs: #2=false, #5=false, #7=true, #9=false, #14=false, #15=false, #16=false, #17=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=true, #53=false, #54=false, #55=false, #56=false, #57=true, #58=true, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag fog differs: #2=true, #5=true, #7=true, #9=true, #14=true, #15=true, #16=true, #17=true, #20=true, #21=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #29=(unknown), #30=true, #31=true, #32=true, #33=true, #34=(unknown), #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true, #59=true, #60=true, #61=true, #62=true, #63=true, #64=true, #65=true, #66=true, #69=(unknown), #70=true, #71=(unknown), #72=true
    flag map differs: #2=false, #5=true, #7=false, #9=false, #14=false, #15=false, #16=false, #17=true, #20=true, #21=false, #22=false, #23=(unknown), #24=true, #25=false, #26=true, #27=(unknown), #28=true, #29=(unknown), #30=true, #31=true, #32=true, #33=true, #34=(unknown), #48=false, #49=true, #50=true, #51=false, #52=false, #53=true, #54=true, #55=true, #56=true, #57=false, #58=false, #59=true, #60=false, #61=false, #62=true, #63=true, #64=false, #65=true, #66=true, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag normalMap differs: #2=true, #5=false, #7=false, #9=false, #14=false, #15=false, #16=false, #17=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=true, #56=true, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag transparent differs: #2=false, #5=false, #7=false, #9=false, #14=false, #15=false, #16=false, #17=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=true, #71=(unknown), #72=true
    flag vertexColors differs: #2=true, #5=false, #7=false, #9=false, #14=false, #15=true, #16=false, #17=false, #20=true, #21=false, #22=false, #23=(unknown), #24=true, #25=false, #26=true, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=true, #32=true, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=true, #52=false, #53=true, #54=true, #55=false, #56=false, #57=false, #58=true, #59=true, #60=false, #61=true, #62=false, #63=false, #64=false, #65=false, #66=true, #69=(unknown), #70=false, #71=(unknown), #72=false
    flag wireframe differs: #2=false, #5=false, #7=false, #9=false, #14=false, #15=false, #16=false, #17=false, #20=false, #21=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #29=(unknown), #30=false, #31=false, #32=false, #33=false, #34=(unknown), #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=false, #66=false, #69=(unknown), #70=false, #71=(unknown), #72=false
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
    vertexShaderHash differs: #18=28fefd22, #19=b1c1b8a0
    fragmentShaderHash differs: #18=d3c0e09e, #19=27c8d486
    flag vertexColors differs: #18=false, #19=true
  MeshDepthMaterial (13 programs):
    vertexShaderHash differs: #35=59ed5d71, #36=2efa42a8, #37=b69ba143, #38=2e7a6fcb, #39=c203b19a, #40=7c1e7b69, #41=c203b19a, #42=585a1ea4, #43=1c1d4a6, #44=263c45d6, #45=e4717b03, #46=63010727, #47=c844a62a
    fragmentShaderHash differs: #35=d729897e, #36=41e40a66, #37=d729897e, #38=758a4164, #39=41e40a66, #40=758a4164, #41=a9dd0dee, #42=a9dd0dee, #43=97cbbbfc, #44=d729897e, #45=41e40a66, #46=41e40a66, #47=758a4164
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1174 (+14):
  Program #96
    material: MeshStandardMaterial ''
    materialUuid: 0cd8b135-8b2f-4af0-9d58-abcb712dc5a3
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #97
    material: MeshStandardMaterial 'Wood'
    materialUuid: a28d6ba0-0935-44c3-b1a2-854b88e0d5cc
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #98
    material: MeshStandardMaterial 'Green'
    materialUuid: 8678fb4c-dfc6-455d-9e3f-dd7d177a8418
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
    materialUuid: 8124d046-dcae-4d79-a856-1f0746640e6c
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #100
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 7c110942-5589-4f4c-b218-704fc5a3681f
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #101
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 1c020778-99cf-48a2-9e18-6c5a0f2df03f
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
    materialUuid: 7d95e11e-4a2e-4c65-9330-2db1dabafabd
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #103
    material: MeshStandardMaterial 'bush_berry_blue'
    materialUuid: c071228f-fae9-4562-9b7f-c960c4a0f85c
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 7f5a6061
    fragmentShaderHash: 3c069eef
  Program #104
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 2c3af040-958a-4ab7-b5bb-66519d19f86c
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
    materialUuid: 7fb8ac9d-98de-4d79-aba8-5b5a7f6163a0
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #106
    material: MeshStandardMaterial 'MI_Superhero_Male'
    materialUuid: 653299e2-252a-4380-9299-12b478e53b8f
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d18a83d8
    fragmentShaderHash: e7a1342f
  Program #107
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 3061f6ee-e928-4f89-bbaf-acc8a9dd7807
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #108
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 2379ce5d-41b7-465d-802a-98ff2d43ac0a
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #109
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 02d57b89-5a48-412b-9538-2128418726dc
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1435 (+21):
  Program #113
    material: ShaderMaterial 'SkyShader'
    materialUuid: e9019ed7-ed1b-4532-836a-027940560426
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: dbd39394
  Program #114
    material: ShaderMaterial ''
    materialUuid: 82335a04-8162-4fb6-a3b4-d7c35cc8e5de
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #115
    material: MeshStandardMaterial ''
    materialUuid: 0cd8b135-8b2f-4af0-9d58-abcb712dc5a3
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #116
    material: MeshStandardMaterial 'Wood'
    materialUuid: a28d6ba0-0935-44c3-b1a2-854b88e0d5cc
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #117
    material: MeshStandardMaterial 'Green'
    materialUuid: 8678fb4c-dfc6-455d-9e3f-dd7d177a8418
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
    materialUuid: 8124d046-dcae-4d79-a856-1f0746640e6c
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #119
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 7c110942-5589-4f4c-b218-704fc5a3681f
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 1c020778-99cf-48a2-9e18-6c5a0f2df03f
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
    materialUuid: 7d95e11e-4a2e-4c65-9330-2db1dabafabd
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'bush_berry_blue'
    materialUuid: c071228f-fae9-4562-9b7f-c960c4a0f85c
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 893dfcb5
    fragmentShaderHash: 95a4d290
  Program #123
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 2c3af040-958a-4ab7-b5bb-66519d19f86c
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
    materialUuid: 7fb8ac9d-98de-4d79-aba8-5b5a7f6163a0
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Superhero_Male'
    materialUuid: 653299e2-252a-4380-9299-12b478e53b8f
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ad5b7cce
    fragmentShaderHash: c4ae56d0
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 3061f6ee-e928-4f89-bbaf-acc8a9dd7807
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 2379ce5d-41b7-465d-802a-98ff2d43ac0a
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 02d57b89-5a48-412b-9538-2128418726dc
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: ShaderMaterial ''
    materialUuid: 3083f6e2-25e9-428e-840d-9d4cbe37525e
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
    materialUuid: f1d5ac12-a493-4f99-a9a5-d20f3b95c8d7
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #132
    material: ShaderMaterial ''
    materialUuid: 6650cd5a-b9f2-4f39-a38f-029167719901
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #133
    material: ShaderMaterial ''
    materialUuid: 1b060fec-2dfe-4237-bf8f-edeae5a08925
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7

---

[Seedvale Program Compile Cost]

No isolated per-program GPU compile/link timer exists in the public Three.js/WebGL API without patching internals (out of scope here). Each number below is the wall-clock duration of the renderer.render() call (mirror-render/postprocess-render) that first-used the program, reported ONLY when that program was the single new program created during that specific call — an upper bound that also includes the rest of that call's render cost, not an isolated compile/link timer.
Excluded — no reliable per-program timing: 129 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 9
  #91
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 142.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 92
  #92
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 529.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 118
  #93
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 105.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 138
  #94
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 106.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 149
  #95
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 103.3 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 985.7 ms
  programs >1 ms: 5
  max: 529.1 ms (#92)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.3 ms  p95=6.2 ms  max=6.4 ms  Δavg vs baseline=—
  hide-grass           avg=5.1 ms  p95=5.9 ms  max=6.7 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-vegetation      avg=4.2 ms  p95=4.9 ms  max=5.0 ms  Δavg vs baseline=-1.1 ms (-20%)
  no vegetation/grass  avg=4.3 ms  p95=5.0 ms  max=5.6 ms  Δavg vs baseline=-1.0 ms (-19%)
  hide-environment     avg=5.2 ms  p95=6.1 ms  max=6.5 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-settlement      avg=5.1 ms  p95=7.2 ms  max=7.7 ms  Δavg vs baseline=-0.2 ms (-3%)
  no water             avg=5.3 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=+0.0 ms (+1%)
  hide-terrain         avg=5.4 ms  p95=6.9 ms  max=7.8 ms  Δavg vs baseline=+0.1 ms (+2%)
  hide-npc-fauna       avg=4.7 ms  p95=5.9 ms  max=6.5 ms  Δavg vs baseline=-0.6 ms (-11%)
  no-shadows           avg=5.5 ms  p95=7.1 ms  max=7.8 ms  Δavg vs baseline=+0.2 ms (+4%)
  no-ao                avg=5.5 ms  p95=7.2 ms  max=7.6 ms  Δavg vs baseline=+0.2 ms (+5%)
  no-bloom             avg=5.6 ms  p95=7.1 ms  max=7.4 ms  Δavg vs baseline=+0.3 ms (+6%)
  no-smaa              avg=5.7 ms  p95=7.1 ms  max=7.4 ms  Δavg vs baseline=+0.5 ms (+9%)
  no-god-rays          avg=5.4 ms  p95=6.5 ms  max=6.9 ms  Δavg vs baseline=+0.1 ms (+3%)
  no-film-grade        avg=5.3 ms  p95=6.3 ms  max=6.7 ms  Δavg vs baseline=+0.0 ms (+0%)
  no postprocessing    avg=5.3 ms  p95=6.3 ms  max=6.4 ms  Δavg vs baseline=+0.0 ms (+1%)
  no mirrors           avg=5.8 ms  p95=6.6 ms  max=7.2 ms  Δavg vs baseline=+0.5 ms (+9%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=23.7 ms  p95=26.3 ms  max=27.1 ms
  CPU wall      avg=5.3 ms  p95=6.2 ms  max=6.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=4 prefetched=14
