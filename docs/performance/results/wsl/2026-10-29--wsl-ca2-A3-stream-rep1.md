# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T21:18:32.882Z
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
Frames: 422
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0cfb9ed3548021fbb5d0e96e462211d300ef8cac
  runId: 2026-10-29T21-17-30-868Z-pfzg2w
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
  populationGate: stable waited=5069ms npc=20
  gpuTimer: available=true resolved=true samples=423 span=postprocess+labels

FPS:
  avg: 33.5
  min: 1
  p1: 5

Frame time (wall-clock):
  avg: 29.8 ms
  p50: 21.1 ms
  p95: 57.8 ms
  p99: 206.5 ms
  max: 1025.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.8 p95=19.8 p99=59.8 max=83.5 n=422
  render: p50=13.9 p95=24.3 p99=195.5 max=1016.4 n=422
  frame: p50=21.1 p95=57.8 p99=206.5 max=1025.2 n=422

Rendering (combined renderer.info):
  draw calls: 815 avg / 2044 max
  triangles: 11.18M avg
  mirror draws: 140 avg
  geometries: 756
  textures: 574

Pass submissions (actual):
  reliability: observed
  frames: 426 shadowRefresh=299 shadowSkipped=127
  mirror calls avg: 140
  shadow calls avg: 214
  main calls avg: 513

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
  other            draws=230 tris=25.9k meshes=230 inst=230

Shadow casters (one-pass estimate):
  terrain          draws=72 tris=5.31M meshes=72 inst=72
  vegetation       draws=205 tris=1.57M meshes=205 inst=1008
  environment      draws=133 tris=30.8k meshes=133 inst=156
  settlement       draws=410 tris=476.8k meshes=410 inst=883
  items            draws=46 tris=26.1k meshes=46 inst=46
  other            draws=101 tris=14.4k meshes=101 inst=101

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

Matrix work (one scene traversal, steady state):
  terrain                  nodes=72 composed=72 multiplied=72 skinned=0
  grass                    nodes=65 composed=65 multiplied=65 skinned=0
  vegetation               nodes=262 composed=262 multiplied=262 skinned=0
  environment              nodes=231 composed=231 multiplied=231 skinned=0
  settlement               nodes=1191 composed=1191 multiplied=1191 skinned=0
  water                    nodes=51 composed=51 multiplied=51 skinned=0
  npc                      nodes=1486 composed=1486 multiplied=1486 skinned=174
  fauna                    nodes=2288 composed=2288 multiplied=2288 skinned=188
  items                    nodes=561 composed=561 multiplied=561 skinned=0
  other                    nodes=442 composed=425 multiplied=442 skinned=9
  top scene children:
    fauna ×51                nodes=2288 composed=2288 multiplied=2288 skinned=188
    npc ×19                  nodes=1486 composed=1486 multiplied=1486 skinned=174
    settlement ×3            nodes=1191 composed=1191 multiplied=1191 skinned=0
    chunk-items ×36          nodes=552 composed=552 multiplied=552 skinned=0
    Group ×37                nodes=260 composed=260 multiplied=260 skinned=9
    chunk-environmen ×3      nodes=163 composed=163 multiplied=163 skinned=0
    chunk ×72                nodes=72 composed=72 multiplied=72 skinned=0
    chunk-grass ×15          nodes=65 composed=65 multiplied=65 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    chunk-water ×50          nodes=50 composed=50 multiplied=50 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.1 ms
  STREAMING      2.2 ms
  NPC            2.1 ms
  FAUNA          2.3 ms
  PHYSICS        0.1 ms
  RENDER         17.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  STREAMING: 6
  WATER: 2

Hitches (>= 8 ms): total=8
  chunk mesh             n=6 avg=19.4 max=29.5
  chunk water            n=2 avg=8.2 max=8.3

Isolation probes:
  full               render=8.0 ms draws=278 tris=5.72M
  hide-grass         render=7.6 ms draws=253 tris=5.39M
  hide-vegetation    render=6.7 ms draws=157 tris=3.68M
  hide-vegetation-grass render=6.4 ms draws=132 tris=3.34M
  hide-environment   render=8.1 ms draws=256 tris=5.64M
  hide-settlement    render=7.2 ms draws=256 tris=5.70M
  hide-water         render=7.3 ms draws=261 tris=4.66M
  hide-terrain       render=7.5 ms draws=246 tris=3.41M
  hide-npc-fauna     render=6.4 ms draws=278 tris=5.72M
  no-shadows         render=7.9 ms draws=269 tris=5.45M
  no-ao              render=7.4 ms draws=268 tris=5.65M
  no-bloom           render=7.8 ms draws=262 tris=5.63M
  no-smaa            render=7.9 ms draws=271 tris=5.65M
  no-god-rays        render=8.0 ms draws=278 tris=5.72M
  no-film-grade      render=7.8 ms draws=278 tris=5.72M
  no-postprocessing  render=7.5 ms draws=255 tris=5.72M
  no-reflections     render=7.7 ms draws=220 tris=4.59M

Frame attribution:
  frame max: 1025.2 ms
  largest labelled hitch: 29.5 ms
  unattributed: 995.7 ms

Long frames:
  threshold: 80 ms
  count: 16
  worst: 1025.2 ms

Raw sidecar:
  sampling=full factor=1 exported=422/422

Recommendation:
Largest frame (1025.2 ms) is not explained by labelled hitches (largest 29.5 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 2.1 ms/frame
  crowd pass: 0.0 ms/frame (3.0 ms cumulative)
  agent updates: 0.9 ms/frame (395.8 ms cumulative)
  livestock: 0.5 ms/frame (213.8 ms cumulative)
    loaded tick: 0.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 15.7
    unique animals/frame: 15.5
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.5
    dog guard scans: 3.5/frame (27.7 predator candidates/frame)
    pest scans: 1.7/frame (1.7 rat candidates/frame)
    nearest scans: 7.7/frame (0.0 candidates/frame)
    water samples: 12.7/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 12.7/frame, 0.00 ms/frame (worst call 0.10 ms, 902.0 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 15.7
    behaviour executions/frame: 7.7
    presentation executions/frame: 7.3
  rats: 0.2 ms/frame (68.8 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.3 ms/frame (131.9 ms cumulative)
  maintenance: 0.1 ms/frame (55.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.3 ms/frame
  agent updates: 2.2 ms/frame (925.8 ms cumulative)
  forest sampling: 0.1 ms/frame (47.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.3 ms cumulative)
    targeting: 0.0 ms/frame (10.5 ms cumulative)
    decision: 0.0 ms/frame (5.6 ms cumulative)
    behaviour: 1.4 ms/frame (581.4 ms cumulative)
    life/presentation: 0.5 ms/frame (208.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.7
    expensive behaviour agents/frame: 19.1
    full-rate agents/frame: 9.4
    reduced-cadence agents/frame: 20.9
    behaviour executions/frame: 19.8
    presentation executions/frame: 19.2

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 29.1
    village scan candidates/frame: 322.0
    player perception checks/frame: 30.3

  nearest scans: 25.4/frame (10728 calls)
  nearest candidates checked: 146.3/frame (61735 total)
  herd leader scans: 0.2/frame (70 calls)
  herd candidates checked: 5.0/frame (2100 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.2/frame (167.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 70.4/frame, 0.10 ms/frame (worst call 6.50 ms)
    collider queries: 70.4/frame, 0.10 ms/frame (worst call 1.80 ms, 2267.3 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 15
  empty builds (no instances): 74
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.23 ms
    max 1.40 ms

  allocation/setup:
    avg 0.16 ms
    max 1.30 ms
  instanceMatrix bind:
    avg 0.01 ms
    max 0.10 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.41 ms
    max 1.70 ms

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
    allocation/setup avg/max: 0.09 / 0.90 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 15/15
    instances: 90329 (max 10763)
    allocation/setup avg/max: 0.04 / 0.20 ms
    instanceMatrix bind avg/max: 0.01 / 0.10 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 15/15
    instances: 362774 (max 44129)
    allocation/setup avg/max: 0.03 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 8/8
    instances: 637461 (max 184195)
    allocation/setup avg/max: 0.09 / 0.20 ms
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
Frames: 426
Shadow refresh frames: 299
Shadow skipped frames: 127

Mirror:
  calls avg: 140  tris avg: 936263
  info calls avg: 140  residual calls avg: 0
  environment                  calls=5 tris=4275
  items                        calls=1 tris=510
  other                        calls=24 tris=4984
  settlement:decor             calls=5 tris=13181
  settlement:fence             calls=1 tris=2124
  settlement:fireCampfire      calls=2 tris=172
  settlement:fireHouseExteriorLamp calls=5 tris=223
  settlement:fireHouseInteriorLamp calls=2 tris=167
  settlement:fireVillageTorch  calls=6 tris=467
  settlement:houseInteractive  calls=5 tris=511
  settlement:houseStatic       calls=11 tris=10187
  settlement:landmarkGarden    calls=2 tris=20564
  settlement:landmarkNoticeBoard calls=1 tris=12
  settlement:landmarkWellCentral calls=2 tris=625
  settlement:landmarkWellHousehold calls=2 tris=1997
  settlement:landmarkWellPasture calls=2 tris=584
  settlement:other             calls=3 tris=58
  settlement:storageBarrel     calls=2 tris=3811
  settlement:storageContainer  calls=9 tris=700
  settlement:storageGoods      calls=12 tris=2485
  settlement:storageHay        calls=0 tris=152
  settlement:storageTrough     calls=2 tris=475
  settlement:storageWoodHousehold calls=0 tris=1609
  settlement:storageWoodSettlementPrimary calls=0 tris=267
  settlement:workplace         calls=3 tris=1245
  terrain                      calls=6 tris=426362
  vegetation                   calls=26 tris=438686

Shadow (refresh only):
  calls avg: 214  tris avg: 2393052
  info calls avg: 214  residual calls avg: 0
  environment                  calls=13 tris=8176
  faunaFamily:cow              calls=1 tris=262
  faunaFamily:horse            calls=1 tris=146
  faunaFamily:rabbit           calls=0 tris=264
  faunaFamily:rat              calls=0 tris=415
  faunaFamily:sheep            calls=0 tris=27
  faunaFamily:stag             calls=4 tris=2271
  faunaFamily:wolf             calls=1 tris=256
  items                        calls=5 tris=2117
  npcFamily:Knight_Cloth       calls=1 tris=1329
  npcFamily:Peasant            calls=1 tris=1196
  npcFamily:Peasant_Boots      calls=0 tris=490
  npcFamily:woodcutter         calls=0 tris=434
  other                        calls=39 tris=9837
  settlement:decor             calls=50 tris=102843
  settlement:fireHouseInteriorLamp calls=1 tris=58
  settlement:houseInteractive  calls=1 tris=176
  settlement:houseStatic       calls=8 tris=3669
  settlement:landmarkGarden    calls=0 tris=230
  settlement:landmarkNoticeBoard calls=1 tris=11
  settlement:landmarkWellCentral calls=1 tris=537
  settlement:other             calls=2 tris=34
  settlement:storageContainer  calls=2 tris=276
  settlement:storageHay        calls=0 tris=131
  settlement:storageTrough     calls=1 tris=154
  settlement:storageWoodHousehold calls=0 tris=610
  settlement:storageWoodSettlementPrimary calls=0 tris=209
  settlement:workplace         calls=1 tris=896
  terrain                      calls=18 tris=1362244
  vegetation                   calls=61 tris=893756

Main:
  calls avg: 513  tris avg: 8519067
  info calls avg: 671  residual calls avg: 0
  environment                  calls=45 tris=13052
  faunaFamily:bear             calls=1 tris=593
  faunaFamily:chicken          calls=6 tris=718
  faunaFamily:cow              calls=0 tris=92
  faunaFamily:dog              calls=10 tris=3385
  faunaFamily:horse            calls=0 tris=50
  faunaFamily:rabbit           calls=0 tris=68
  faunaFamily:rat              calls=1 tris=2547
  faunaFamily:sheep            calls=4 tris=1120
  faunaFamily:stag             calls=1 tris=349
  faunaFamily:wolf             calls=1 tris=598
  grass                        calls=36 tris=5183259
  items                        calls=47 tris=5253
  npcFamily:Farmer             calls=7 tris=9891
  npcFamily:Knight_Cloth       calls=5 tris=6275
  npcFamily:Peasant            calls=32 tris=39445
  npcFamily:Peasant_Boots      calls=5 tris=7201
  npcFamily:blacksmith         calls=6 tris=8477
  other                        calls=67 tris=14262
  settlement:decor             calls=9 tris=23277
  settlement:fence             calls=3 tris=4268
  settlement:fireCampfire      calls=4 tris=339
  settlement:fireHouseExteriorLamp calls=9 tris=444
  settlement:fireHouseInteriorLamp calls=3 tris=334
  settlement:fireVillageTorch  calls=13 tris=938
  settlement:houseInteractive  calls=9 tris=1022
  settlement:houseStatic       calls=20 tris=18114
  settlement:landmarkGarden    calls=4 tris=40509
  settlement:landmarkNoticeBoard calls=1 tris=25
  settlement:landmarkWellCentral calls=3 tris=1295
  settlement:landmarkWellHousehold calls=4 tris=4024
  settlement:landmarkWellPasture calls=3 tris=1176
  settlement:other             calls=6 tris=117
  settlement:storageBarrel     calls=5 tris=7615
  settlement:storageContainer  calls=19 tris=1399
  settlement:storageGoods      calls=24 tris=5006
  settlement:storageHay        calls=1 tris=300
  settlement:storageTrough     calls=3 tris=951
  settlement:storageWoodHousehold calls=1 tris=3215
  settlement:storageWoodSettlementPrimary calls=1 tris=535
  settlement:workplace         calls=6 tris=2561
  terrain                      calls=23 tris=1730387
  vegetation                   calls=58 tris=865176
  water                        calls=8 tris=509750


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 16
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 16 total):

[LONG FRAME] 1025.2ms
simulate         7.5ms
render        1016.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA            1.6ms
PHYSICS          0.2ms
RENDER        1016.4ms
OTHER            4.7ms

Long frame #2:

[LONG FRAME] 255.7ms
simulate        56.5ms
render         198.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          182.0ms
STREAMING       48.3ms
NPC              2.2ms
FAUNA            1.2ms
PHYSICS          0.2ms
RENDER          16.0ms
OTHER            5.8ms

streaming / stages:
  chunkUpdate                  48.3ms
  riverTileBuild               45.1ms
  terrainPrepare               1.5ms
  riverChannelSegmentsNear     0.5ms

Long frame #3:

[LONG FRAME] 237.5ms
simulate         7.1ms
render         230.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.9ms
FAUNA            1.4ms
PHYSICS          0.2ms
RENDER         230.2ms
OTHER            3.7ms

Long frame #4:

[LONG FRAME] 225.5ms
simulate         9.8ms
render         214.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        7.2ms
NPC              2.2ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER         214.2ms
OTHER            0.3ms

streaming / stages:
  terrainFinalize              2.5ms
  waterFinalize                2.5ms
  chunkUpdate                  2.0ms
  contentFinalize              1.3ms
  chunkFinalize                1.3ms
  riverFinalize                0.1ms

Long frame #5:

[LONG FRAME] 209.9ms
simulate         6.2ms
render         202.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          191.9ms
STREAMING        0.2ms
NPC              1.1ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER          10.8ms
OTHER            4.9ms

streaming / stages:
  chunkUpdate                  0.2ms
  contentFinalize              0.1ms
  chunkFinalize                0.1ms

---

[Seedvale Program Census]

Programs created: 128
Program count: final=128 max=128

By frame:
  frame 0   +75 programs   <== largest transition
  frame 5   +1 program
  frame 8   +1 program
  frame 86   +1 program
  frame 88   +3 programs
  frame 101   +1 program
  frame 110   +1 program
  frame 235   +1 program
  frame 884   +18 programs
  frame 927   +4 programs
  frame 1136   +22 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ce65b7bd-3d21-46ed-8b2a-d1959dd9bfc4 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c7f676c1-33f8-401a-aeaf-8f741229c1f7
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=8464d409-82ad-4619-964e-ad74cde17182
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f07d72bb-7fe5-455b-b946-ff9a3db9e1a0
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c63e93a4-5d6d-4923-bd4d-61c03ea7107c
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=298279fb-67f1-4b6e-8a0d-22fae0d4ff1a
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=572dac7f-d8dd-4e48-adfc-f601d70bc5c5
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=60c6a48f-b5e1-4e6a-be49-c77d9dcecebf
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=509c8363-7eb2-4c87-9d8b-b0501792a71d
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=55388270-7eb1-4cf6-8ade-bb3c1df7d6d7 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d34bbe46-9297-4cf6-8d20-8d772ffbe0d8
  #13 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=75f72e2a-ca33-4594-8055-9def52f744b0 (None)
  #14 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5e4588d5-6b51-47fd-8e28-4fefaddae29a (Flowers)
  #15 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a124da3e-22bd-40cf-925e-18c7cbe2cf81 (Green)
  #16 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1ac15866-d17a-47ef-b0c9-4ed04487e67c (Pink)
  #17 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b32014ed-c2df-4c86-8cca-57bed10d05d2 (Stone)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=fb3e9451-81a3-4c6a-a463-60ceccb84d1d (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=bf842ffe-a50f-4b90-a268-95bf4ebaca07 (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=1a719254-3a36-4364-9f9f-0761f9765e41 (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3ae1bfa5-b641-470a-8b96-149ba10c2341 (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=aaa2a017-74c6-4d96-8035-841e775af7a3 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7f229479-b70e-4164-958e-e2959df638a2 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=59bafbfb-4624-4914-b817-3602271a9fe3 (MI_WoodTrim)
  #26 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #27 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1a3de9d0-5626-4abc-aaf5-021ed24f6d7c (MI_WindowGlass)
  #28 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #29 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #30 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f3d54863-de75-4577-b345-53583c3ef8ff (Main)
  #31 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=208bf16b-90b5-40fd-a59b-e2ac2169b740 (MI_Peasant)
  #32 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3eac78e2-3fff-42bb-9e17-114ad34259fc (MI_Hair_1)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0b596a27-3a63-47cc-b64f-1040c5823990 (MI_Hair_1)
  #34 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #35 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2efa42a8 fHash=41e40a66 stage=postprocess-render
  #36 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #37 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #38 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #39 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #40 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #44 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e457671f-7a2c-4909-91b4-467381a05e2a (Green)
  #45 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=03354308-1335-4ad4-aab1-3f9f76e33112 (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d648e608-8568-4b7e-8f3e-f86b43c75a63 (MapleTree_Leaves)
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ee1dac3b-09fc-447f-a9c4-4639080f9f37 (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=6b43a422-20ce-4126-bac3-279f69e1f7c5
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=b1dd34f9-95b7-4afe-856d-5e67efb6ade0 (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=72f74a22-8735-483a-ae83-4ae1c18f3dff (DarkGreen)
  #51 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2aa6e575-7cc9-4ca5-a269-620009582b56 (Pond_Pack_MAT)
  #52 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ebf22a6f-0a52-4af7-9569-9a9d8d13b15e (MI_Regular_Male)
  #53 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=47158a78-62aa-476e-8155-dfd2e8687df5 (MI_Eyes)
  #54 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a577e969-95eb-41cc-b81f-fe5cc020d5f1 (PathRocks)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2ba11bfd-78e1-4a97-a742-23181cc68592 (MI_Hair_1)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d5ac12b8-b6c5-49ed-9ed4-f10440e817f9 (MI_Knight)
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
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=3f71df04, #6=e6d01ae7, #10=5b43c776, #28=df7c703d, #29=f92c8d8c, #57=279cec18, #58=84736a68, #59=aa2edbee, #60=7bae0bb2, #61=436caea4, #62=886438e7, #63=d99a5b29, #64=2003ced8, #65=28dfa407, #66=756a0b19, #67=b2354ff2, #68=ea82969e, #69=7dab8d9a, #70=378e1fb7, #71=78acf7ea, #72=a312c579, #73=b817515d
    fragmentShaderHash differs: #0=b5ca2441, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=d4350921, #6=e34491ff, #10=70b71dad, #28=236b3b0b, #29=87d053eb, #57=4d6bcede, #58=ffecb62a, #59=76ced00a, #60=fb55b3c0, #61=2d687ef1, #62=dc2a89b5, #63=109e33fc, #64=db0f470a, #65=9775cd0e, #66=5c741650, #67=2aad9943, #68=a2297d9f, #69=1022767b, #70=ce0bf6b4, #71=707f290c, #72=c05e2256, #73=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=grass, #6=water, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #10=(unset), #28=(unset), #29=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset), #68=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=false, #6=true, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #10=(unknown), #28=(unknown), #29=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown), #68=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown)
  MeshStandardMaterial (34 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=6db98a06, #14=e4cbf8ca, #15=c0d790d1, #16=d3fd7a87, #17=a9733c9d, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=12873951, #26=fc941d05, #27=e551c572, #30=fd8301ed, #31=842fe1df, #32=ac268392, #33=1c179521, #44=190d3a9c, #45=9dbe8ee7, #46=3bea20f6, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=c3bc6325, #52=20daccfa, #53=1dcbc6ff, #54=b643916d, #55=cde317ee, #56=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=efed8e98, #14=135696d3, #15=a81023c3, #16=2eae9a54, #17=bd723c8a, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=d4c95125, #26=3ab4c629, #27=2d1aa4a, #30=2f2885d5, #31=34995f15, #32=25a41317, #33=71f22dc6, #44=633146b4, #45=8dba9dd, #46=5b26a60d, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=ded4be89, #52=a8862f4a, #53=1a1c0d8, #54=754b87bd, #55=512afd6f, #56=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=environment, #14=vegetation, #15=vegetation, #16=vegetation, #17=environment, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=(unknown), #27=settlement, #30=fauna, #31=other, #32=other, #33=other, #44=settlement, #45=settlement, #46=settlement, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=other, #54=settlement, #55=npc, #56=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=(unset), #27=, #30=, #31=, #32=, #33=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0, #14=0.45, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=(unknown), #27=0, #30=0, #31=0, #32=0, #33=0, #44=0, #45=0, #46=0.45, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=(unknown), #27=true, #30=true, #31=true, #32=true, #33=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=true, #15=false, #16=false, #17=false, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=true, #32=true, #33=true, #44=false, #45=true, #46=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=true, #23=(unknown), #24=false, #25=true, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=true, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=true, #25=false, #26=(unknown), #27=true, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=true, #32=true, #33=false, #44=false, #45=false, #46=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=(unknown), #27=false, #30=false, #31=false, #32=false, #33=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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
    vertexShaderHash differs: #34=59ed5d71, #35=2efa42a8, #36=b69ba143, #37=2e7a6fcb, #38=585a1ea4, #39=c203b19a, #40=c203b19a, #41=585a1ea4, #42=263c45d6, #43=e4717b03
    fragmentShaderHash differs: #34=d729897e, #35=41e40a66, #36=d729897e, #37=758a4164, #38=41e40a66, #39=41e40a66, #40=a9dd0dee, #41=a9dd0dee, #42=d729897e, #43=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 884 (+18):
  Program #84
    material: MeshStandardMaterial ''
    materialUuid: 8464d409-82ad-4619-964e-ad74cde17182
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #85
    material: MeshStandardMaterial 'Wood'
    materialUuid: 96636868-8ef2-47b3-be69-8b0d32785441
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #86
    material: MeshStandardMaterial 'Green'
    materialUuid: a6083e14-a696-4db6-a5bc-ac1387e773a1
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
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: d0da54d6-b2a5-45f0-a322-770897e816dd
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
  Program #88
    material: MeshStandardMaterial 'Berry'
    materialUuid: 3912b3fe-f86c-4fae-9784-ad1b845797e2
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #89
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 03354308-1335-4ad4-aab1-3f9f76e33112
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #90
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 5e4588d5-6b51-47fd-8e28-4fefaddae29a
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
  Program #91
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 376565e7-9852-48ef-9825-c83bf29f9962
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #92
    material: MeshStandardMaterial 'Leaves'
    materialUuid: e1f57cb4-fc8d-48cf-9c4a-c6cbfebdbdfb
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
  Program #93
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: ee1dac3b-09fc-447f-a9c4-4639080f9f37
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #94
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: ebf22a6f-0a52-4af7-9569-9a9d8d13b15e
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #95
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 59bafbfb-4624-4914-b817-3602271a9fe3
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #96
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 47158a78-62aa-476e-8155-dfd2e8687df5
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #97
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 208bf16b-90b5-40fd-a59b-e2ac2169b740
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3eac78e2-3fff-42bb-9e17-114ad34259fc
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 0b596a27-3a63-47cc-b64f-1040c5823990
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #100
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #101
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: 1a3de9d0-5626-4abc-aaf5-021ed24f6d7c
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 1136 (+22):
  Program #106
    material: ShaderMaterial 'SkyShader'
    materialUuid: ce65b7bd-3d21-46ed-8b2a-d1959dd9bfc4
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #107
    material: ShaderMaterial ''
    materialUuid: 298279fb-67f1-4b6e-8a0d-22fae0d4ff1a
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #108
    material: MeshStandardMaterial ''
    materialUuid: 8464d409-82ad-4619-964e-ad74cde17182
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #109
    material: MeshStandardMaterial 'Wood'
    materialUuid: 96636868-8ef2-47b3-be69-8b0d32785441
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #110
    material: MeshStandardMaterial 'Green'
    materialUuid: a6083e14-a696-4db6-a5bc-ac1387e773a1
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
  Program #111
    material: MeshStandardMaterial 'Green'
    materialUuid: d0da54d6-b2a5-45f0-a322-770897e816dd
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
  Program #112
    material: MeshStandardMaterial 'Berry'
    materialUuid: 3912b3fe-f86c-4fae-9784-ad1b845797e2
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #113
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 03354308-1335-4ad4-aab1-3f9f76e33112
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #114
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 5e4588d5-6b51-47fd-8e28-4fefaddae29a
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
  Program #115
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 376565e7-9852-48ef-9825-c83bf29f9962
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #116
    material: MeshStandardMaterial 'Leaves'
    materialUuid: e1f57cb4-fc8d-48cf-9c4a-c6cbfebdbdfb
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
  Program #117
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: ee1dac3b-09fc-447f-a9c4-4639080f9f37
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #118
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: ebf22a6f-0a52-4af7-9569-9a9d8d13b15e
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #119
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 47158a78-62aa-476e-8155-dfd2e8687df5
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #120
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 208bf16b-90b5-40fd-a59b-e2ac2169b740
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #121
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 3eac78e2-3fff-42bb-9e17-114ad34259fc
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #122
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 0b596a27-3a63-47cc-b64f-1040c5823990
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #123
    material: ShaderMaterial ''
    materialUuid: 572dac7f-d8dd-4e48-adfc-f601d70bc5c5
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #124
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #125
    material: MeshBasicMaterial ''
    materialUuid: 509c8363-7eb2-4c87-9d8b-b0501792a71d
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #126
    material: ShaderMaterial ''
    materialUuid: c6df88c9-d7e1-4708-919f-b7857c47bdbb
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #127
    material: ShaderMaterial ''
    materialUuid: 6d9d1dd6-602b-46b2-b05a-55a3ca983ed3
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
Excluded — no reliable per-program timing: 122 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 5
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 289.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 8
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 467.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 86
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 1011.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 101
  #81
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 179.1 ms  (upper bound — whole mirror-render call, see note above)

Frame 110
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 208.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 235
  #83
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 190.1 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 2345.8 ms
  programs >1 ms: 6
  max: 1011.5 ms (#77)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=8.0 ms  p95=9.0 ms  max=12.3 ms  Δavg vs baseline=—
  hide-grass           avg=7.6 ms  p95=8.8 ms  max=9.9 ms  Δavg vs baseline=-0.5 ms (-6%)
  hide-vegetation      avg=6.7 ms  p95=7.7 ms  max=8.0 ms  Δavg vs baseline=-1.3 ms (-16%)
  no vegetation/grass  avg=6.4 ms  p95=7.6 ms  max=8.4 ms  Δavg vs baseline=-1.6 ms (-20%)
  hide-environment     avg=8.1 ms  p95=9.0 ms  max=9.2 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-settlement      avg=7.2 ms  p95=9.0 ms  max=10.0 ms  Δavg vs baseline=-0.8 ms (-10%)
  no water             avg=7.3 ms  p95=8.9 ms  max=10.8 ms  Δavg vs baseline=-0.7 ms (-9%)
  hide-terrain         avg=7.5 ms  p95=8.5 ms  max=9.4 ms  Δavg vs baseline=-0.5 ms (-6%)
  hide-npc-fauna       avg=6.4 ms  p95=8.2 ms  max=10.3 ms  Δavg vs baseline=-1.6 ms (-20%)
  no-shadows           avg=7.9 ms  p95=9.0 ms  max=9.2 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-ao                avg=7.4 ms  p95=8.8 ms  max=9.2 ms  Δavg vs baseline=-0.6 ms (-7%)
  no-bloom             avg=7.8 ms  p95=8.9 ms  max=9.3 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-smaa              avg=7.9 ms  p95=9.6 ms  max=14.2 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-god-rays          avg=8.0 ms  p95=9.7 ms  max=12.5 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-film-grade        avg=7.8 ms  p95=9.6 ms  max=9.8 ms  Δavg vs baseline=-0.2 ms (-3%)
  no postprocessing    avg=7.5 ms  p95=8.6 ms  max=9.2 ms  Δavg vs baseline=-0.5 ms (-6%)
  no mirrors           avg=7.7 ms  p95=9.1 ms  max=10.7 ms  Δavg vs baseline=-0.3 ms (-4%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=12.3 ms  p95=14.9 ms  max=15.6 ms
  CPU wall      avg=8.0 ms  p95=9.0 ms  max=12.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
