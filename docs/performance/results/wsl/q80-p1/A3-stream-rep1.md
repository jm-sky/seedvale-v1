# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T15:42:25.764Z
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
Frames: 618
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a25e47aa423419e56bb240801251d699bb6b8759
  runId: 2026-11-03T15-41-26-375Z-lmz3lq
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
  camera: pos=(443.3, 0.9, 23.7)
  anchor: (8.5, 22.7)
  route: start=(8.5, 22.7) speed=14.4 m/s duration=30s
  populationGate: stable waited=5065ms npc=8
  gpuTimer: available=true resolved=true samples=619 span=postprocess+labels

FPS:
  avg: 57.8
  min: 1
  p1: 8

Frame time (wall-clock):
  avg: 17.3 ms
  p50: 12.5 ms
  p95: 26.1 ms
  p99: 118 ms
  max: 931 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.2 p95=10.5 p99=18.9 max=43.8 n=618
  render: p50=8 p95=16.2 p99=111.2 max=923.8 n=618
  frame: p50=12.5 p95=26.1 p99=118 max=931 n=618

Rendering (combined renderer.info):
  draw calls: 415 avg / 1458 max
  triangles: 10.21M avg
  mirror draws: 53 avg
  geometries: 706
  textures: 387

Pass submissions (actual):
  reliability: observed
  frames: 622 shadowRefresh=285 shadowSkipped=337
  mirror calls avg: 53
  shadow calls avg: 152
  main calls avg: 279

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=49 tris=1.15M meshes=49 inst=120733
  vegetation       draws=156 tris=1.02M meshes=156 inst=629
  environment      draws=56 tris=22.2k meshes=56 inst=70
  settlement       draws=388 tris=603.6k meshes=388 inst=936
  water            draws=55 tris=3.99M meshes=55 inst=55
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=161 tris=65.1k meshes=161 inst=161
  items            draws=307 tris=25.2k meshes=307 inst=307
  other            draws=220 tris=27.3k meshes=220 inst=220

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=136 tris=951.2k meshes=136 inst=591
  environment      draws=55 tris=22.2k meshes=55 inst=69
  settlement       draws=290 tris=510.0k meshes=290 inst=800
  items            draws=36 tris=19.5k meshes=36 inst=36
  other            draws=102 tris=15.7k meshes=102 inst=102

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=33 tris=50.0k meshes=33 inst=324
  houseInteractive draws=14 tris=2.2k meshes=14 inst=14
  fence            draws=2 tris=1.2k meshes=2 inst=6
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
  decor            draws=198 tris=415.8k meshes=198 inst=271
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
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      stag             agents=2 draws=12 tris=7.3k skinned=10/12
      boar             agents=2 draws=10 tris=4.6k skinned=10/10
      dog              agents=2 draws=10 tris=3.8k skinned=10/10
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      sheep            agents=4 draws=8 tris=2.4k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rabbit           agents=4 draws=4 tris=2.7k skinned=4/4
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rat              agents=1 draws=2 tris=4.0k skinned=2/2
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      far  agents=41 camera-relevant=0 draws=161 tris=65.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=65 composed=65 multiplied=65 skinned=0
  grass                    nodes=64 composed=64 multiplied=64 skinned=0
  vegetation               nodes=183 composed=183 multiplied=183 skinned=0
  environment              nodes=73 composed=73 multiplied=73 skinned=0
  settlement               nodes=753 composed=753 multiplied=753 skinned=0
  water                    nodes=55 composed=55 multiplied=55 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1719 composed=1719 multiplied=1719 skinned=142
  items                    nodes=475 composed=475 multiplied=475 skinned=0
  other                    nodes=437 composed=420 multiplied=437 skinned=9
  top scene children:
    fauna ×41                nodes=1719 composed=1719 multiplied=1719 skinned=142
    settlement ×1            nodes=753 composed=753 multiplied=753 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    chunk-items ×30          nodes=472 composed=472 multiplied=472 skinned=0
    Group ×35                nodes=246 composed=246 multiplied=246 skinned=9
    Root_Scene ×21           nodes=66 composed=66 multiplied=66 skinned=0
    chunk ×65                nodes=65 composed=65 multiplied=65 skinned=0
    chunk-grass ×15          nodes=64 composed=64 multiplied=64 skinned=0
    chunk-water ×54          nodes=54 composed=54 multiplied=54 skinned=0
    chunk-river ×33          nodes=33 composed=33 multiplied=33 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0
    chunk-vegetation ×1      nodes=21 composed=21 multiplied=21 skinned=0

Systems:
  WATER          1.3 ms
  STREAMING      1.4 ms
  NPC            1.1 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         10.9 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. STREAMING

Critical spikes:
  STREAMING: 14
  WATER: 10

Hitches (>= 8 ms): total=24
  chunk mesh             n=14 avg=14.8 max=32.5
  chunk water            n=10 avg=11.0 max=14.5

Isolation probes:
  full               render=5.3 ms draws=255 tris=5.81M
  hide-grass         render=5.1 ms draws=227 tris=4.87M
  hide-vegetation    render=4.2 ms draws=147 tris=4.61M
  hide-vegetation-grass render=4.5 ms draws=115 tris=3.62M
  hide-environment   render=5.0 ms draws=236 tris=5.80M
  hide-settlement    render=4.8 ms draws=257 tris=5.81M
  hide-water         render=5.1 ms draws=237 tris=4.55M
  hide-terrain       render=5.1 ms draws=224 tris=3.48M
  hide-npc-fauna     render=4.3 ms draws=259 tris=5.87M
  no-shadows         render=5.2 ms draws=249 tris=5.64M
  no-ao              render=5.3 ms draws=251 tris=5.81M
  no-bloom           render=5.5 ms draws=244 tris=5.81M
  no-smaa            render=5.4 ms draws=254 tris=5.81M
  no-god-rays        render=5.1 ms draws=257 tris=5.81M
  no-film-grade      render=5.3 ms draws=255 tris=5.81M
  no-postprocessing  render=5.4 ms draws=232 tris=5.81M
  no-reflections     render=5.5 ms draws=206 tris=5.01M

Frame attribution:
  frame max: 931 ms
  largest labelled hitch: 32.5 ms
  unattributed: 898.5 ms

Long frames:
  threshold: 80 ms
  count: 9
  worst: 931 ms

Raw sidecar:
  sampling=full factor=1 exported=618/618

Recommendation:
Largest frame (931 ms) is not explained by labelled hitches (largest 32.5 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 28

NPC:
  total: 1.1 ms/frame
  crowd pass: 0.0 ms/frame (2.8 ms cumulative)
  agent updates: 0.6 ms/frame (357.2 ms cumulative)
  livestock: 0.4 ms/frame (221.5 ms cumulative)
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
    dog guard scans: 2.0/frame (13.1 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 5.4/frame (0.0 candidates/frame)
    water samples: 11.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 11.9/frame, 0.00 ms/frame (worst call 0.10 ms, 1955.8 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 12.1
    behaviour executions/frame: 5.4
    presentation executions/frame: 4.9
  rats: 0.1 ms/frame (47.7 ms cumulative)
  social: 0.0 ms/frame (2.9 ms cumulative)
  streaming: 0.0 ms/frame (0.8 ms cumulative)
  maintenance: 0.1 ms/frame (43.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.4 ms/frame (841.2 ms cumulative)
  forest sampling: 0.1 ms/frame (61.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (11.8 ms cumulative)
    targeting: 0.0 ms/frame (9.5 ms cumulative)
    decision: 0.0 ms/frame (16.4 ms cumulative)
    behaviour: 0.6 ms/frame (395.7 ms cumulative)
    life/presentation: 0.4 ms/frame (262.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 28.2
    sensing passes/frame: 23.5
    decision passes/frame: 23.5
    high-priority agents/frame: 1.0
    expensive behaviour agents/frame: 18.1
    full-rate agents/frame: 15.4
    reduced-cadence agents/frame: 8.1
    behaviour executions/frame: 19.1
    presentation executions/frame: 18.7

  sensing/cache:
    forest samples/frame: 28.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 51.6
    player perception checks/frame: 23.5

  nearest scans: 25.1/frame (15518 calls)
  nearest candidates checked: 109.3/frame (67560 total)
  herd leader scans: 0.0/frame (9 calls)
  herd candidates checked: 0.4/frame (252 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 30.3/frame (161.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 29.9/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 29.9/frame, 0.00 ms/frame (worst call 0.20 ms, 4128.1 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 83
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.26 ms
    max 1.80 ms

  allocation/setup:
    avg 0.19 ms
    max 1.60 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.30 ms
  scene attach (`scene.add`):
    avg 0.04 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.58 ms
    max 2.30 ms

  per chunk:
    instances avg/max 3426.6 / 6527
    meshes avg/max 3.00 / 3
    geometries avg/max 3.00 / 3
    geometries after lod apply avg/max 6.00 / 6
    instances full/filler: 65106 / 0
    matrix instances bound: 65106
    instanced attributes created: 285
    shared material refs: 57
  heap delta avg/max: -1041.1 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 28/28
    instances: 138529 (max 28796)
    allocation/setup avg/max: 0.08 / 0.80 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 28/28
    instances: 46248 (max 9665)
    allocation/setup avg/max: 0.08 / 1.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 183669 (max 39426)
    allocation/setup avg/max: 0.04 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  filler:
    buckets/meshes: 9/9
    instances: 644573 (max 163917)
    allocation/setup avg/max: 0.10 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=197106 filler=116889
Submitted instances: full=83475 filler=37257
Meshes submitted: 48
LOD submitted fraction: full=0.4235030897080759 filler=0.318738290172728
Flowers: unavailable
Allocation bytes (estimated): 30143520
Upload bytes (observed): unavailable
Lifecycle: req=35 complete=35 discard(unload=0,oor=0) cancel=0 streamIn=19 streamOut=25 invalidate=0
Finalization: observed completions=35

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 622
Shadow refresh frames: 285
Shadow skipped frames: 337

Mirror:
  calls avg: 53  tris avg: 775270
  info calls avg: 53  residual calls avg: 0
  switches avg: material=23.6 program=17  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.2 skeletons first used=3.2
  environment                  calls=5 tris=4113
  items                        calls=0 tris=115
  other                        calls=8 tris=4806
  settlement:decor             calls=5 tris=13271
  settlement:fence             calls=0 tris=43
  settlement:fireHouseExteriorLamp calls=0 tris=8
  settlement:fireHouseInteriorLamp calls=0 tris=6
  settlement:fireVillageTorch  calls=0 tris=1
  settlement:houseInteractive  calls=0 tris=22
  settlement:houseStatic       calls=1 tris=1225
  settlement:landmarkNoticeBoard calls=0 tris=0
  settlement:landmarkWellCentral calls=0 tris=9
  settlement:landmarkWellHousehold calls=0 tris=28
  settlement:landmarkWellPasture calls=0 tris=55
  settlement:other             calls=0 tris=807
  settlement:storageBarrel     calls=0 tris=267
  settlement:storageContainer  calls=0 tris=55
  settlement:storageGoods      calls=1 tris=93
  settlement:storageTrough     calls=0 tris=42
  settlement:storageWoodHousehold calls=0 tris=143
  settlement:storageWoodSettlementPrimary calls=0 tris=4
  settlement:workplace         calls=0 tris=11
  terrain                      calls=6 tris=425230
  vegetation                   calls=27 tris=325037

Shadow (refresh only):
  calls avg: 152  tris avg: 1849860
  info calls avg: 152  residual calls avg: 0
  switches avg: material=69.1 program=69  actor: calls=7.7 material=0 program=1.1
  skinning avg: skinned calls=11.7 skeletons first used=5.9
  environment                  calls=9 tris=7335
  faunaFamily:boar             calls=1 tris=518
  faunaFamily:chicken          calls=1 tris=73
  faunaFamily:cow              calls=0 tris=155
  faunaFamily:dog              calls=0 tris=81
  faunaFamily:duck             calls=0 tris=10
  faunaFamily:horse            calls=1 tris=168
  faunaFamily:rabbit           calls=0 tris=12
  faunaFamily:rat              calls=0 tris=98
  faunaFamily:rooster          calls=0 tris=21
  faunaFamily:sheep            calls=0 tris=79
  faunaFamily:stag             calls=1 tris=502
  faunaFamily:wolf             calls=1 tris=282
  items                        calls=2 tris=1128
  npcFamily:Farmer             calls=1 tris=1245
  npcFamily:Knight_Cloth       calls=1 tris=710
  npcFamily:Peasant            calls=1 tris=916
  npcFamily:Peasant_Boots      calls=0 tris=172
  npcFamily:Ranger_NoHood      calls=0 tris=342
  npcFamily:woodcutter         calls=0 tris=152
  other                        calls=35 tris=9323
  settlement:decor             calls=26 tris=61971
  settlement:fence             calls=0 tris=268
  settlement:fireHouseInteriorLamp calls=1 tris=54
  settlement:houseInteractive  calls=1 tris=198
  settlement:houseStatic       calls=4 tris=6695
  settlement:landmarkGarden    calls=0 tris=202
  settlement:landmarkNoticeBoard calls=0 tris=3
  settlement:landmarkWellCentral calls=0 tris=183
  settlement:landmarkWellPasture calls=1 tris=407
  settlement:other             calls=1 tris=3605
  settlement:storageContainer  calls=1 tris=273
  settlement:storageHay        calls=0 tris=45
  settlement:storageTrough     calls=1 tris=224
  settlement:storageWoodHousehold calls=0 tris=706
  settlement:storageWoodSettlementPrimary calls=0 tris=63
  settlement:workplace         calls=0 tris=285
  terrain                      calls=16 tris=1151860
  vegetation                   calls=45 tris=599496

Main:
  calls avg: 279  tris avg: 8561340
  info calls avg: 361  residual calls avg: 0
  switches avg: material=141 program=56.3  actor: calls=8.1 material=5.4 program=3
  skinning avg: skinned calls=16.6 skeletons first used=5.5
  environment                  calls=13 tris=10453
  faunaFamily:bear             calls=1 tris=342
  faunaFamily:boar             calls=2 tris=795
  faunaFamily:chicken          calls=0 tris=28
  faunaFamily:cow              calls=0 tris=113
  faunaFamily:dog              calls=0 tris=12
  faunaFamily:duck             calls=0 tris=11
  faunaFamily:fox              calls=0 tris=122
  faunaFamily:horse            calls=0 tris=7
  faunaFamily:rabbit           calls=0 tris=247
  faunaFamily:rat              calls=0 tris=142
  faunaFamily:rooster          calls=0 tris=4
  faunaFamily:sheep            calls=0 tris=35
  faunaFamily:wolf             calls=2 tris=1029
  grass                        calls=40 tris=4976621
  items                        calls=49 tris=4217
  npcFamily:Farmer             calls=0 tris=570
  npcFamily:Knight_Cloth       calls=0 tris=594
  npcFamily:Peasant            calls=1 tris=587
  npcFamily:Peasant_Boots      calls=0 tris=118
  npcFamily:Ranger_NoHood      calls=1 tris=680
  npcFamily:woodcutter         calls=0 tris=105
  other                        calls=43 tris=14342
  settlement:decor             calls=11 tris=32313
  settlement:fence             calls=0 tris=111
  settlement:fireHouseExteriorLamp calls=0 tris=17
  settlement:fireHouseInteriorLamp calls=0 tris=15
  settlement:fireVillageTorch  calls=0 tris=3
  settlement:houseInteractive  calls=0 tris=47
  settlement:houseStatic       calls=2 tris=2817
  settlement:landmarkNoticeBoard calls=0 tris=0
  settlement:landmarkWellCentral calls=0 tris=18
  settlement:landmarkWellHousehold calls=0 tris=66
  settlement:landmarkWellPasture calls=0 tris=123
  settlement:other             calls=0 tris=1930
  settlement:storageBarrel     calls=0 tris=641
  settlement:storageContainer  calls=1 tris=139
  settlement:storageGoods      calls=1 tris=210
  settlement:storageTrough     calls=0 tris=102
  settlement:storageWoodHousehold calls=0 tris=346
  settlement:storageWoodSettlementPrimary calls=0 tris=8
  settlement:workplace         calls=0 tris=42
  terrain                      calls=23 tris=1730029
  vegetation                   calls=70 tris=787572
  water                        calls=14 tris=993919


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 9
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 9 total):

[LONG FRAME] 931ms
simulate         6.3ms
render         923.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.0ms
FAUNA            1.6ms
PHYSICS          0.2ms
RENDER         923.6ms
OTHER            3.5ms

Long frame #2:

[LONG FRAME] 271.6ms
simulate         4.9ms
render         266.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER         266.2ms
OTHER            2.9ms

Long frame #3:

[LONG FRAME] 167.7ms
simulate        12.5ms
render         153.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        1.8ms
NPC              4.0ms
FAUNA            2.1ms
PHYSICS          0.1ms
RENDER         153.4ms
OTHER            6.2ms

streaming / stages:
  chunkUpdate                  1.8ms
  chunkFinalize                0.1ms

Long frame #4:

[LONG FRAME] 150.2ms
simulate        17.9ms
render         131.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.4ms
STREAMING        4.4ms
NPC              3.6ms
FAUNA            7.1ms
PHYSICS          0.1ms
RENDER         126.5ms
OTHER            4.1ms

streaming / stages:
  chunkUpdate                  4.4ms
  riverTileBuild               0.4ms
  terrainPrepare               0.4ms
  riverChannelSegmentsNear     0.1ms

Long frame #5:

[LONG FRAME] 148.3ms
simulate         6.5ms
render         141.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING       24.9ms
NPC              1.2ms
FAUNA            2.1ms
PHYSICS          0.2ms
RENDER         141.3ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              13.2ms
  waterFinalize                11.5ms
  riverFinalize                0.1ms
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

hitches:
  STREAMING chunk mesh             13.2ms
  WATER chunk water            11.5ms

---

[Seedvale Program Census]

Programs created: 134
Program count: final=134 max=134

By frame:
  frame 0   +89 programs   <== largest transition
  frame 1   +2 programs
  frame 9   +1 program
  frame 86   +1 program
  frame 88   +1 program
  frame 101   +1 program
  frame 109   +1 program
  frame 1085   +14 programs
  frame 1128   +3 programs
  frame 1342   +21 programs

Largest transition — frame 0 (+89 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=ca32daaf stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5e7b0252-578f-4ecf-82de-38db6ee57044 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=16c00d25-2783-41f3-9450-8d774b972ddf
  #2 type=ShaderMaterial name='' bucket=other cacheKey=4,5,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=94e6550c-0ea9-4571-a027-0456044bde6d
  #3 type=ShaderMaterial name='' bucket=water cacheKey=6,7,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=31e6954d-1564-4f29-966c-21305179eefd
  #4 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=683ae717-3766-4adf-99f3-68dcd736c661
  #5 type=MeshStandardMaterial name='HalloweenBits' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=b24f037 fHash=547224f1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=161947e5-6c80-4107-bd86-cdb9ddcbecb4 (HalloweenBits)
  #6 type=ShaderMaterial name='' bucket=water cacheKey=6,7,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=798a56c9-bdd3-408f-8c68-c9dec8d50e2b
  #7 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d63747ed-f8cd-44a8-b619-ca4f3129134f
  #8 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=ecdefec6-91bb-4181-976c-86ae6816ab58
  #9 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=703b5d7f-6f6c-476d-af78-c3f508ce8f8b
  #10 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f2094f32-c69f-43b9-8f56-69f1f016afa2 (Wood)
  #11 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #12 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #13 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=31f440bd-2507-4604-b27a-a2f4f2bdeafd
  #14 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
  #15 type=MeshStandardMaterial name='Stone' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4e7e51a9-7484-4890-af85-56efc6d4c6fd (Wood_Light)
  #16 type=MeshStandardMaterial name='PineTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=86d8050b fHash=9f0671e7 stage=postprocess-render
  #17 type=MeshStandardMaterial name='PineTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=6550e08d fHash=e1e27532 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=20444747-9a0b-4f48-818a-ca1f6dc32c60 (Flowers)
  #18 type=MeshStandardMaterial name='NormalTree_Bark' cacheKey=physical,STANDARD,,highp… vHash=ab1dd48f fHash=943c7b97 stage=postprocess-render
  #19 type=MeshStandardMaterial name='lambert2SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3e42e9c4 fHash=d97828a7 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=80a7bff0-55e7-4112-b6f6-d39dc482856b (Wood)
  #20 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cf503892-9de4-4aef-a872-e2089d43c1ec (Main)
  #21 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=ebfa71bd fHash=3f59c0a3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=88581ec3-d36d-4f3d-a2bc-c1ab738bcb2c (Main)
  #22 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a3814e2d-d4fb-4f0c-b81d-6543d654ad62 (Material.001)
  #23 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5c72e685-8d0a-4879-b4b1-ed8f998662df (lambert2SG)
  #24 type=MeshPhysicalMaterial name='Material #55.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=28fefd22 fHash=d3c0e09e stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=563d7387-6271-4502-89b5-c7da2f8cfd2f (Material #55.002)
  #25 type=MeshPhysicalMaterial name='Material #54.002' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=b1c1b8a0 fHash=27c8d486 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b81f5fc9-5daa-4b1e-9f05-776568c2a31a (Material #54.002)
  #26 type=MeshStandardMaterial name='BlackBear_mat' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=4be16ad2 fHash=63f37341 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=37c57a29-d885-40d5-9ad5-5d441de770df (BlackBear_mat)
  #27 type=MeshStandardMaterial name='bush_berry_red' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a9324552 fHash=9b37dc78 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.5","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=468d5b86-1940-48c0-98e7-7de63bca2148 (bush_berry_red)
  #28 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9d3a0973-facf-4961-9684-c261dd293711 (Pond_Pack_MAT)
  #29 type=MeshStandardMaterial name='Green' cacheKey=physical,STANDARD,,highp… vHash=80917d5e fHash=633146b4 stage=postprocess-render
  #30 type=MeshStandardMaterial name='Leaves_NormalTree' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c8df3222 fHash=7a23219b stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5ac45700-76cf-4b19-aafd-16305a6ea748 (Leaves_NormalTree)
  #31 type=MeshStandardMaterial name='lambert2SG' cacheKey=physical,STANDARD,,highp… vHash=a369060f fHash=f6cbc3c stage=postprocess-render
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d4062e45-e9c2-41eb-a140-91b3e0c9c737 (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e4280fb2-ceee-4fda-98d4-b356232be646 (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=33dbe9e1-23b6-43cc-a5dd-ebb515f5e469 (MI_Hair_1)
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
  #48 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=61accb81-e034-42f4-b365-8f5ad5423bd3 (Green)
  #49 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=de91e827-491a-43d7-9e12-d2bdcc6b99ff (MapleTree_Bark)
  #50 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=03a6943a-9463-4216-8252-35fed7f4cb74 (MapleTree_Leaves)
  #51 type=MeshStandardMaterial name='MI_WoodTrim_Wear' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=17234739 fHash=30676c2f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=065c8557-2cf8-416d-8bf2-1d0e189b922c (MI_WoodTrim)
  #52 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e77ed416-dc94-42a1-bbaa-ab4860695a73 (stockpiles_vc)
  #53 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=746b6625-7e88-41a9-a183-a8748e020a8e
  #54 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=945dbc17-bce7-4b97-aaab-4ddaa56845ab (MI_Eyes)
  #55 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=98f459a7-ab2b-4d0a-a8c2-6de22ab55d86 (MI_WoodTrim)
  #56 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=a2327b54-9bbe-47fb-b6bc-463158a65912
  #57 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2b6c8be7 fHash=d9be0b50 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=5ae066a6-ba75-4ad6-afe4-cae74f03d139
  #58 type=MeshStandardMaterial name='MI_Trim_Props_Vertex' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=bfc76a01 fHash=92bce359 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=82127485-81ee-41b1-98af-a3207be75234 (MI_Trim_Props_Vertex)
  #59 type=MeshStandardMaterial name='White' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=f299d5d7 fHash=1b5e9115 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=95a4bdee-3082-4ba2-bd3c-2cd226db20c3 (Main)
  #60 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=140c5e62 fHash=46d4b31c stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6b25c7ea-42bf-446b-81c9-e6fc37a72df5 (MI_Knight)
  #61 type=MeshStandardMaterial name='MI_Knight' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=eb2eade3 fHash=6eafecb9 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9129433f-f1f7-4150-bae2-1c56cbdc0f7b (MI_Knight)
  #62 type=MeshStandardMaterial name='MI_Hair_1' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=ee59055a fHash=e8d88acf stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3c7177f7-a626-4bc2-9620-b51f69233ea8 (MI_Hair_1)
  #63 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=bc1bf5ac fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ca7f5112-d666-46cf-8ad1-dcf2d11cb59c (SV_MI_Peasant)
  #64 type=MeshStandardMaterial name='SV_WorkSkirt' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=c79c2ae3 fHash=974c07df stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d1dcadd0-ccea-4250-8ca6-b9b82598fb5b (SV_WorkSkirt)
  #65 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #66 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=37d63712-3422-4f6b-9a6f-eb8358917e63 (MI_WindowGlass)
  #67 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #68 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=14655073-b6da-4806-8930-2376a0e55dbf (MI_WindowGlass)
  #69 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #70 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #71 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #72 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #73 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #74 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #75 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #76 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #77 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #78 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #79 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #80 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #81 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #82 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #83 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #84 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #85 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #86 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #87 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=669a1bfa stage=postprocess-render
  #88 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #2=22690955, #3=1bb00362, #6=e6d01ae7, #7=3f71df04, #11=5b43c776, #69=f92c8d8c, #70=df7c703d, #71=279cec18, #72=84736a68, #73=aa2edbee, #74=7bae0bb2, #75=436caea4, #76=886438e7, #77=d99a5b29, #78=2003ced8, #79=28dfa407, #80=756a0b19, #81=b2354ff2, #82=ea82969e, #83=7dab8d9a, #84=378e1fb7, #85=78acf7ea, #86=a312c579, #87=b817515d
    fragmentShaderHash differs: #0=ca32daaf, #1=ae17ade6, #2=2cf9fa62, #3=a38bbf04, #6=e34491ff, #7=d4350921, #11=70b71dad, #69=87d053eb, #70=236b3b0b, #71=4d6bcede, #72=ffecb62a, #73=76ced00a, #74=fb55b3c0, #75=2d687ef1, #76=dc2a89b5, #77=109e33fc, #78=db0f470a, #79=9775cd0e, #80=5c741650, #81=2aad9943, #82=a2297d9f, #83=1022767b, #84=ce0bf6b4, #85=707f290c, #86=c05e2256, #87=669a1bfa
    bucket differs: #0=other, #1=other, #2=other, #3=water, #6=water, #7=grass, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #2=(unset), #3=1, #6=(unset), #7=(unset), #11=(unset), #69=(unset), #70=(unset), #71=(unset), #72=(unset), #73=(unset), #74=(unset), #75=(unset), #76=(unset), #77=(unset), #78=(unset), #79=(unset), #80=(unset), #81=(unset), #82=(unset), #83=(unset), #84=(unset), #85=(unset), #86=(unset), #87=(unset)
    flag alphaTest differs: #0=0, #1=0, #2=0, #3=0, #6=0, #7=0, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag envMap differs: #0=false, #1=false, #2=false, #3=false, #6=false, #7=false, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag fog differs: #0=false, #1=true, #2=true, #3=true, #6=true, #7=true, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag map differs: #0=false, #1=false, #2=false, #3=false, #6=false, #7=false, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag normalMap differs: #0=false, #1=false, #2=false, #3=false, #6=false, #7=false, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag transparent differs: #0=false, #1=true, #2=true, #3=true, #6=true, #7=false, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag vertexColors differs: #0=false, #1=false, #2=false, #3=false, #6=false, #7=false, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
    flag wireframe differs: #0=false, #1=false, #2=false, #3=false, #6=false, #7=false, #11=(unknown), #69=(unknown), #70=(unknown), #71=(unknown), #72=(unknown), #73=(unknown), #74=(unknown), #75=(unknown), #76=(unknown), #77=(unknown), #78=(unknown), #79=(unknown), #80=(unknown), #81=(unknown), #82=(unknown), #83=(unknown), #84=(unknown), #85=(unknown), #86=(unknown), #87=(unknown)
  MeshStandardMaterial (44 programs):
    vertexShaderHash differs: #4=5c2c57a3, #5=b24f037, #8=e3408c64, #10=d38f15a4, #14=c0d790d1, #15=a9733c9d, #16=86d8050b, #17=6550e08d, #18=ab1dd48f, #19=3e42e9c4, #20=54e03756, #21=ebfa71bd, #22=a99aa494, #23=7bb77142, #26=4be16ad2, #27=a9324552, #28=c3bc6325, #29=80917d5e, #30=c8df3222, #31=a369060f, #32=842fe1df, #33=ac268392, #34=1c179521, #48=190d3a9c, #49=9dbe8ee7, #50=3bea20f6, #51=17234739, #52=a64d124e, #53=94297e69, #54=1dcbc6ff, #55=12873951, #56=66d360c8, #57=2b6c8be7, #58=bfc76a01, #59=f299d5d7, #60=140c5e62, #61=eb2eade3, #62=ee59055a, #63=bc1bf5ac, #64=c79c2ae3, #65=13a74ec7, #66=9dcf1cb4, #67=fc941d05, #68=e551c572
    fragmentShaderHash differs: #4=e354d864, #5=547224f1, #8=c0b8fc9f, #10=6578c10d, #14=a81023c3, #15=bd723c8a, #16=9f0671e7, #17=e1e27532, #18=943c7b97, #19=d97828a7, #20=d391c52, #21=3f59c0a3, #22=63f9c0d1, #23=87728b15, #26=63f37341, #27=9b37dc78, #28=ded4be89, #29=633146b4, #30=7a23219b, #31=f6cbc3c, #32=34995f15, #33=25a41317, #34=71f22dc6, #48=633146b4, #49=8dba9dd, #50=5b26a60d, #51=30676c2f, #52=546e469, #53=aa0735a8, #54=1a1c0d8, #55=d4c95125, #56=c0b8fc9f, #57=d9be0b50, #58=92bce359, #59=1b5e9115, #60=46d4b31c, #61=6eafecb9, #62=e8d88acf, #63=512afd6f, #64=974c07df, #65=3ab4c629, #66=2d1aa4a, #67=3ab4c629, #68=2d1aa4a
    bucket differs: #4=terrain, #5=environment, #8=other, #10=other, #14=(unknown), #15=settlement, #16=(unknown), #17=settlement, #18=(unknown), #19=settlement, #20=fauna, #21=fauna, #22=fauna, #23=fauna, #26=fauna, #27=settlement, #28=other, #29=(unknown), #30=settlement, #31=(unknown), #32=other, #33=other, #34=other, #48=settlement, #49=settlement, #50=settlement, #51=settlement, #52=settlement, #53=other, #54=other, #55=settlement, #56=settlement, #57=settlement, #58=settlement, #59=fauna, #60=npc, #61=npc, #62=npc, #63=npc, #64=npc, #65=(unknown), #66=settlement, #67=(unknown), #68=settlement
    define STANDARD differs: #4=, #5=, #8=, #10=, #14=(unset), #15=, #16=(unset), #17=, #18=(unset), #19=, #20=, #21=, #22=, #23=, #26=, #27=, #28=, #29=(unset), #30=, #31=(unset), #32=, #33=, #34=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=, #57=, #58=, #59=, #60=, #61=, #62=, #63=, #64=, #65=(unset), #66=, #67=(unset), #68=
    flag alphaTest differs: #4=0, #5=0, #8=0, #10=0, #14=(unknown), #15=0, #16=(unknown), #17=0.45, #18=(unknown), #19=0, #20=0, #21=0, #22=0, #23=0, #26=0, #27=0.5, #28=0, #29=(unknown), #30=0.45, #31=(unknown), #32=0, #33=0, #34=0, #48=0, #49=0, #50=0.45, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0, #57=0, #58=0, #59=0, #60=0, #61=0, #62=0, #63=0, #64=0, #65=(unknown), #66=0, #67=(unknown), #68=0
    flag envMap differs: #4=false, #5=false, #8=false, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=false, #18=(unknown), #19=false, #20=false, #21=false, #22=false, #23=false, #26=false, #27=false, #28=false, #29=(unknown), #30=false, #31=(unknown), #32=false, #33=false, #34=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=(unknown), #66=false, #67=(unknown), #68=false
    flag flatShading differs: #4=false, #5=false, #8=true, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=false, #18=(unknown), #19=false, #20=false, #21=false, #22=false, #23=false, #26=false, #27=false, #28=false, #29=(unknown), #30=false, #31=(unknown), #32=false, #33=false, #34=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=true, #54=false, #55=false, #56=true, #57=true, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=(unknown), #66=false, #67=(unknown), #68=false
    flag fog differs: #4=true, #5=true, #8=true, #10=true, #14=(unknown), #15=true, #16=(unknown), #17=true, #18=(unknown), #19=true, #20=true, #21=true, #22=true, #23=true, #26=true, #27=true, #28=true, #29=(unknown), #30=true, #31=(unknown), #32=true, #33=true, #34=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true, #57=true, #58=true, #59=true, #60=true, #61=true, #62=true, #63=true, #64=true, #65=(unknown), #66=true, #67=(unknown), #68=true
    flag map differs: #4=false, #5=true, #8=false, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=true, #18=(unknown), #19=false, #20=false, #21=false, #22=false, #23=true, #26=true, #27=true, #28=true, #29=(unknown), #30=true, #31=(unknown), #32=true, #33=true, #34=true, #48=false, #49=true, #50=true, #51=true, #52=false, #53=false, #54=true, #55=true, #56=false, #57=false, #58=true, #59=false, #60=true, #61=true, #62=true, #63=true, #64=false, #65=(unknown), #66=false, #67=(unknown), #68=false
    flag normalMap differs: #4=true, #5=false, #8=false, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=false, #18=(unknown), #19=false, #20=false, #21=false, #22=false, #23=false, #26=false, #27=false, #28=false, #29=(unknown), #30=false, #31=(unknown), #32=false, #33=false, #34=false, #48=false, #49=true, #50=false, #51=true, #52=false, #53=false, #54=false, #55=true, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=(unknown), #66=false, #67=(unknown), #68=false
    flag transparent differs: #4=false, #5=false, #8=false, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=false, #18=(unknown), #19=false, #20=false, #21=false, #22=false, #23=false, #26=false, #27=false, #28=false, #29=(unknown), #30=false, #31=(unknown), #32=false, #33=false, #34=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=(unknown), #66=true, #67=(unknown), #68=true
    flag vertexColors differs: #4=true, #5=false, #8=false, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=false, #18=(unknown), #19=false, #20=false, #21=true, #22=false, #23=false, #26=true, #27=false, #28=true, #29=(unknown), #30=true, #31=(unknown), #32=true, #33=true, #34=false, #48=false, #49=false, #50=false, #51=false, #52=true, #53=false, #54=true, #55=false, #56=false, #57=true, #58=true, #59=false, #60=false, #61=true, #62=false, #63=false, #64=false, #65=(unknown), #66=false, #67=(unknown), #68=false
    flag wireframe differs: #4=false, #5=false, #8=false, #10=false, #14=(unknown), #15=false, #16=(unknown), #17=false, #18=(unknown), #19=false, #20=false, #21=false, #22=false, #23=false, #26=false, #27=false, #28=false, #29=(unknown), #30=false, #31=(unknown), #32=false, #33=false, #34=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false, #57=false, #58=false, #59=false, #60=false, #61=false, #62=false, #63=false, #64=false, #65=(unknown), #66=false, #67=(unknown), #68=false
  MeshBasicMaterial (3 programs):
    vertexShaderHash differs: #9=5efaf074, #12=d459e49b, #13=b6911298
    fragmentShaderHash differs: #9=5cf0ca9a, #12=a8a9bac3, #13=73a25d1e
    bucket differs: #9=other, #12=(unknown), #13=other
    flag alphaTest differs: #9=0, #12=(unknown), #13=0
    flag envMap differs: #9=false, #12=(unknown), #13=false
    flag fog differs: #9=true, #12=(unknown), #13=false
    flag map differs: #9=true, #12=(unknown), #13=true
    flag normalMap differs: #9=false, #12=(unknown), #13=false
    flag transparent differs: #9=true, #12=(unknown), #13=true
    flag vertexColors differs: #9=false, #12=(unknown), #13=false
    flag wireframe differs: #9=false, #12=(unknown), #13=false
  MeshPhysicalMaterial (2 programs):
    vertexShaderHash differs: #24=28fefd22, #25=b1c1b8a0
    fragmentShaderHash differs: #24=d3c0e09e, #25=27c8d486
    flag vertexColors differs: #24=false, #25=true
  MeshDepthMaterial (13 programs):
    vertexShaderHash differs: #35=59ed5d71, #36=2efa42a8, #37=b69ba143, #38=2e7a6fcb, #39=c203b19a, #40=7c1e7b69, #41=c203b19a, #42=585a1ea4, #43=1c1d4a6, #44=263c45d6, #45=e4717b03, #46=63010727, #47=c844a62a
    fragmentShaderHash differs: #35=d729897e, #36=41e40a66, #37=d729897e, #38=758a4164, #39=41e40a66, #40=758a4164, #41=a9dd0dee, #42=a9dd0dee, #43=97cbbbfc, #44=d729897e, #45=41e40a66, #46=41e40a66, #47=758a4164
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1085 (+14):
  Program #96
    material: MeshStandardMaterial ''
    materialUuid: 683ae717-3766-4adf-99f3-68dcd736c661
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #97
    material: MeshStandardMaterial 'Wood'
    materialUuid: 302acf65-9a2c-4cd6-9aa1-4403d6860eb8
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #98
    material: MeshStandardMaterial 'Green'
    materialUuid: fb865315-8054-4725-b366-187a5eab27a5
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
    materialUuid: 9cf84ef0-4e44-40b5-b9af-0c79b9643c70
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ca65e7f6
    fragmentShaderHash: ed8c9b61
  Program #100
    material: MeshStandardMaterial 'Green'
    materialUuid: 25442685-16bd-46ef-a3c2-86d747feba45
    object: Mesh 'chunk-vegetation-region-2,-1|lily-0:0'
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
  Program #101
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: de91e827-491a-43d7-9e12-d2bdcc6b99ff
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #102
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 20444747-9a0b-4f48-818a-ca1f6dc32c60
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
  Program #103
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 799e01ef-ed3b-4766-8aa5-33bd452bbd31
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #104
    material: MeshStandardMaterial 'bush_berry_red'
    materialUuid: 468d5b86-1940-48c0-98e7-7de63bca2148
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ee440db4
    fragmentShaderHash: a96cc074
  Program #105
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 5ac45700-76cf-4b19-aafd-16305a6ea748
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
  Program #106
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: d4062e45-e9c2-41eb-a140-91b3e0c9c737
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: dd4d6827
    fragmentShaderHash: 6175155
  Program #107
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 945dbc17-bce7-4b97-aaab-4ddaa56845ab
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #108
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: e4280fb2-ceee-4fda-98d4-b356232be646
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #109
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 33dbe9e1-23b6-43cc-a5dd-ebb515f5e469
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446

Frame 1342 (+21):
  Program #113
    material: ShaderMaterial 'SkyShader'
    materialUuid: 5e7b0252-578f-4ecf-82de-38db6ee57044
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: dbd39394
  Program #114
    material: ShaderMaterial ''
    materialUuid: d63747ed-f8cd-44a8-b619-ca4f3129134f
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #115
    material: MeshStandardMaterial ''
    materialUuid: 683ae717-3766-4adf-99f3-68dcd736c661
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #116
    material: MeshStandardMaterial 'Wood'
    materialUuid: 302acf65-9a2c-4cd6-9aa1-4403d6860eb8
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #117
    material: MeshStandardMaterial 'Green'
    materialUuid: fb865315-8054-4725-b366-187a5eab27a5
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
    materialUuid: 9cf84ef0-4e44-40b5-b9af-0c79b9643c70
    object: Mesh 'chunk-vegetation-region-1,0|reed-1:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #119
    material: MeshStandardMaterial 'Green'
    materialUuid: 25442685-16bd-46ef-a3c2-86d747feba45
    object: Mesh 'chunk-vegetation-region-2,-1|lily-0:0'
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
  Program #120
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: de91e827-491a-43d7-9e12-d2bdcc6b99ff
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #121
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 20444747-9a0b-4f48-818a-ca1f6dc32c60
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
  Program #122
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 799e01ef-ed3b-4766-8aa5-33bd452bbd31
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #123
    material: MeshStandardMaterial 'bush_berry_red'
    materialUuid: 468d5b86-1940-48c0-98e7-7de63bca2148
    object: Mesh 'settlement-bushes-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a9324552
    fragmentShaderHash: 481650a5
  Program #124
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 5ac45700-76cf-4b19-aafd-16305a6ea748
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
  Program #125
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: d4062e45-e9c2-41eb-a140-91b3e0c9c737
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 73cf09fb
    fragmentShaderHash: 2d146a56
  Program #126
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 945dbc17-bce7-4b97-aaab-4ddaa56845ab
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: e4280fb2-ceee-4fda-98d4-b356232be646
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 33dbe9e1-23b6-43cc-a5dd-ebb515f5e469
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: MeshBasicMaterial ''
    materialUuid: 703b5d7f-6f6c-476d-af78-c3f508ce8f8b
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #130
    material: ShaderMaterial ''
    materialUuid: 798a56c9-bdd3-408f-8c68-c9dec8d50e2b
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #131
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #132
    material: ShaderMaterial ''
    materialUuid: aa63f222-a2ca-4d89-999c-2c6ba8d7a2cd
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #133
    material: ShaderMaterial ''
    materialUuid: 7065c140-2ea8-488e-a940-2481c16a5390
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
Excluded — no reliable per-program timing: 129 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 9
  #91
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 473.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 86
  #92
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 920.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 88
  #93
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 148.9 ms  (upper bound — whole postprocess-render call, see note above)

Frame 101
  #94
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 122.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 109
  #95
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 97.3 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1763.3 ms
  programs >1 ms: 5
  max: 920.9 ms (#92)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.3 ms  p95=6.4 ms  max=7.4 ms  Δavg vs baseline=—
  hide-grass           avg=5.1 ms  p95=6.2 ms  max=7.4 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-vegetation      avg=4.2 ms  p95=4.7 ms  max=5.4 ms  Δavg vs baseline=-1.1 ms (-21%)
  no vegetation/grass  avg=4.5 ms  p95=5.6 ms  max=6.0 ms  Δavg vs baseline=-0.8 ms (-15%)
  hide-environment     avg=5.0 ms  p95=6.3 ms  max=6.6 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-settlement      avg=4.8 ms  p95=5.6 ms  max=5.8 ms  Δavg vs baseline=-0.4 ms (-8%)
  no water             avg=5.1 ms  p95=6.2 ms  max=6.7 ms  Δavg vs baseline=-0.1 ms (-3%)
  hide-terrain         avg=5.1 ms  p95=6.6 ms  max=6.7 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-npc-fauna       avg=4.3 ms  p95=5.0 ms  max=5.0 ms  Δavg vs baseline=-1.0 ms (-18%)
  no-shadows           avg=5.2 ms  p95=6.2 ms  max=7.7 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-ao                avg=5.3 ms  p95=6.5 ms  max=7.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-bloom             avg=5.5 ms  p95=7.1 ms  max=8.1 ms  Δavg vs baseline=+0.2 ms (+4%)
  no-smaa              avg=5.4 ms  p95=6.5 ms  max=6.7 ms  Δavg vs baseline=+0.1 ms (+2%)
  no-god-rays          avg=5.1 ms  p95=6.0 ms  max=6.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-film-grade        avg=5.3 ms  p95=6.2 ms  max=6.5 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=5.4 ms  p95=6.7 ms  max=7.2 ms  Δavg vs baseline=+0.1 ms (+2%)
  no mirrors           avg=5.5 ms  p95=6.5 ms  max=9.3 ms  Δavg vs baseline=+0.3 ms (+5%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=23.9 ms  p95=26.5 ms  max=30.1 ms
  CPU wall      avg=5.3 ms  p95=6.4 ms  max=7.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=2 sync ms total=0.2 max=0.1 store hits=2 prefetched=16
