# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T20:55:41.421Z
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
Frames: 1620
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 448d0534a9372f81e91c0790129e704428a92509
  runId: 2026-10-30T20-53-40-673Z-sdb7b6
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
  populationGate: stable waited=5033ms npc=24
  gpuTimer: available=true resolved=true samples=1622 span=postprocess+labels

FPS:
  avg: 32.8
  min: 0
  p1: 6

Frame time (wall-clock):
  avg: 30.5 ms
  p50: 15.2 ms
  p95: 33.7 ms
  p99: 158 ms
  max: 7652.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.1 p95=15.2 p99=49.8 max=7643.4 n=1620
  render: p50=9.5 p95=19.7 p99=64.1 max=365.2 n=1620
  frame: p50=15.2 p95=33.7 p99=158 max=7652.8 n=1620

Rendering (combined renderer.info):
  draw calls: 372 avg / 2108 max
  triangles: 6.71M avg
  mirror draws: 62 avg
  geometries: 769
  textures: 409

Pass submissions (actual):
  reliability: observed
  frames: 1625 shadowRefresh=675 shadowSkipped=950
  mirror calls avg: 62
  shadow calls avg: 142
  main calls avg: 238

Scene (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  grass            draws=56 tris=9.26M meshes=56 inst=676088
  vegetation       draws=170 tris=835.0k meshes=170 inst=622
  environment      draws=139 tris=21.7k meshes=139 inst=139
  settlement       draws=751 tris=883.5k meshes=751 inst=1864
  water            draws=59 tris=4.28M meshes=59 inst=59
  npc              draws=262 tris=335.5k meshes=262 inst=262
  fauna            draws=269 tris=104.0k meshes=269 inst=269
  items            draws=243 tris=19.8k meshes=243 inst=243
  other            draws=443 tris=28.4k meshes=443 inst=444

Shadow casters (one-pass estimate):
  terrain          draws=68 tris=5.01M meshes=68 inst=68
  vegetation       draws=146 tris=769.9k meshes=146 inst=568
  environment      draws=138 tris=21.7k meshes=138 inst=138
  settlement       draws=481 tris=598.1k meshes=481 inst=1477
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
  decor            draws=195 tris=367.2k meshes=195 inst=277
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
  other                    nodes=689 composed=672 multiplied=689 skinned=9
  top scene children:
    fauna ×67                nodes=2812 composed=2812 multiplied=2812 skinned=219
    npc ×28                  nodes=2191 composed=2191 multiplied=2191 skinned=262
    settlement ×3            nodes=1496 composed=1496 multiplied=1496 skinned=0
    Group ×79                nodes=516 composed=516 multiplied=516 skinned=9
    chunk-items ×28          nodes=360 composed=360 multiplied=360 skinned=0
    chunk-environmen ×3      nodes=231 composed=231 multiplied=231 skinned=0
    chunk-grass ×16          nodes=72 composed=72 multiplied=72 skinned=0
    chunk ×68                nodes=68 composed=68 multiplied=68 skinned=0
    chunk-water ×58          nodes=58 composed=58 multiplied=58 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-river ×45          nodes=45 composed=45 multiplied=45 skinned=0
    Object3D ×29             nodes=29 composed=29 multiplied=29 skinned=0

Systems:
  WATER          1.9 ms
  STREAMING      1.9 ms
  NPC            13.0 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         10.5 ms

Detected bottlenecks:
  1. NPC
  2. RENDER
  3. STREAMING

Critical spikes:
  STREAMING: 13
  WATER: 10

Hitches (>= 8 ms): total=23
  chunk water            n=10 avg=12.9 max=27.1
  chunk mesh             n=13 avg=11.3 max=16.5

Isolation probes:
  full               render=9.4 ms draws=311 tris=9.18M
  hide-grass         render=9.3 ms draws=316 tris=4.08M
  hide-vegetation    render=8.9 ms draws=276 tris=8.95M
  hide-vegetation-grass render=8.8 ms draws=254 tris=3.81M
  hide-environment   render=9.5 ms draws=316 tris=9.10M
  hide-settlement    render=8.7 ms draws=309 tris=9.16M
  hide-water         render=9.3 ms draws=309 tris=7.55M
  hide-terrain       render=9.3 ms draws=303 tris=7.00M
  hide-npc-fauna     render=7.5 ms draws=323 tris=9.17M
  no-shadows         render=9.2 ms draws=310 tris=8.97M
  no-ao              render=9.1 ms draws=319 tris=9.11M
  no-bloom           render=9.3 ms draws=312 tris=9.11M
  no-smaa            render=9.5 ms draws=318 tris=9.08M
  no-god-rays        render=9.6 ms draws=324 tris=9.11M
  no-film-grade      render=9.7 ms draws=325 tris=9.11M
  no-postprocessing  render=9.2 ms draws=308 tris=9.18M
  no-reflections     render=9.4 ms draws=280 tris=8.73M

Frame attribution:
  frame max: 7652.8 ms
  largest labelled hitch: 27.1 ms
  unattributed: 7625.7 ms

Long frames:
  threshold: 80 ms
  count: 23
  worst: 7652.8 ms

Raw sidecar:
  sampling=full factor=1 exported=1620/1620

Recommendation:
Largest frame (7652.8 ms) is not explained by labelled hitches (largest 27.1 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 28
  Fauna (agents): 30

NPC:
  total: 13.0 ms/frame
  crowd pass: 0.0 ms/frame (12.0 ms cumulative)
  agent updates: 1.2 ms/frame (1906.0 ms cumulative)
  livestock: 0.7 ms/frame (1199.2 ms cumulative)
    loaded tick: 0.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.4 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 24.4
    unique animals/frame: 22.6
    duplicate updates/frame: 1.9
    detached animals/frame: 0.0
    dog updates/frame: 4.6
    dog guard scans: 4.6/frame (37.0 predator candidates/frame)
    pest scans: 1.9/frame (1.9 rat candidates/frame)
    nearest scans: 9.4/frame (0.0 candidates/frame)
    water samples: 19.7/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 19.7/frame, 0.00 ms/frame (worst call 0.10 ms, 2215.8 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 24.3
    behaviour executions/frame: 9.4
    presentation executions/frame: 8.5
  rats: 0.1 ms/frame (106.3 ms cumulative)
  social: 0.0 ms/frame (7.4 ms cumulative)
  streaming: 10.8 ms/frame (17518.1 ms cumulative)
  maintenance: 0.1 ms/frame (211.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (2069.6 ms cumulative)
  forest sampling: 0.1 ms/frame (136.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (33.8 ms cumulative)
    targeting: 0.0 ms/frame (21.7 ms cumulative)
    decision: 0.0 ms/frame (20.8 ms cumulative)
    behaviour: 0.7 ms/frame (1189.5 ms cumulative)
    life/presentation: 0.3 ms/frame (529.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.1
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.2
    expensive behaviour agents/frame: 16.5
    full-rate agents/frame: 8.0
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 16.7
    presentation executions/frame: 15.5

  sensing/cache:
    forest samples/frame: 30.1
    fire scan candidates/frame: 33.0
    village scan candidates/frame: 319.8
    player perception checks/frame: 29.7

  nearest scans: 23.5/frame (38004 calls)
  nearest candidates checked: 192.3/frame (311597 total)
  herd leader scans: 0.2/frame (340 calls)
  herd candidates checked: 6.3/frame (10200 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 22.8/frame (152.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 60.9/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 60.9/frame, 0.10 ms/frame (worst call 1.80 ms, 3930.9 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 43
  empty builds (no instances): 351
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.16 ms
    max 0.50 ms

  allocation/setup:
    avg 0.09 ms
    max 0.50 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.20 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.20 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.62 ms
    max 5.50 ms

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
    allocation/setup avg/max: 0.05 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  grain:
    buckets/meshes: 63/63
    instances: 112369 (max 10763)
    allocation/setup avg/max: 0.03 / 0.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  herb:
    buckets/meshes: 63/63
    instances: 448838 (max 44129)
    allocation/setup avg/max: 0.02 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 22/22
    instances: 1612895 (max 184195)
    allocation/setup avg/max: 0.10 / 0.60 ms
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
Frames: 1625
Shadow refresh frames: 675
Shadow skipped frames: 950

Mirror:
  calls avg: 62  tris avg: 699484
  info calls avg: 62  residual calls avg: 0
  switches avg: material=32.9 program=21.6  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.6 skeletons first used=3.6
  environment                  calls=3 tris=2068
  items                        calls=0 tris=139
  other                        calls=11 tris=4917
  settlement:decor             calls=1 tris=1758
  settlement:fence             calls=0 tris=655
  settlement:fireCampfire      calls=1 tris=50
  settlement:fireHouseExteriorLamp calls=1 tris=68
  settlement:fireHouseInteriorLamp calls=0 tris=51
  settlement:fireVillageTorch  calls=2 tris=135
  settlement:houseInteractive  calls=1 tris=157
  settlement:houseStatic       calls=5 tris=4165
  settlement:landmarkGarden    calls=1 tris=6577
  settlement:landmarkNoticeBoard calls=0 tris=4
  settlement:landmarkWellCentral calls=1 tris=199
  settlement:landmarkWellHousehold calls=1 tris=565
  settlement:landmarkWellPasture calls=1 tris=188
  settlement:other             calls=1 tris=18
  settlement:storageBarrel     calls=1 tris=1585
  settlement:storageContainer  calls=2 tris=315
  settlement:storageGoods      calls=4 tris=766
  settlement:storageHay        calls=0 tris=51
  settlement:storageTrough     calls=1 tris=206
  settlement:storageWoodHousehold calls=0 tris=720
  settlement:storageWoodSettlementPrimary calls=0 tris=84
  settlement:workplace         calls=1 tris=341
  terrain                      calls=5 tris=400652
  vegetation                   calls=19 tris=273203

Shadow (refresh only):
  calls avg: 142  tris avg: 2093874
  info calls avg: 142  residual calls avg: 0
  switches avg: material=65.7 program=64.1  actor: calls=4.6 material=0 program=0.8
  skinning avg: skinned calls=9 skeletons first used=4.4
  environment                  calls=9 tris=4960
  faunaFamily:boar             calls=0 tris=58
  faunaFamily:chicken          calls=0 tris=44
  faunaFamily:cow              calls=0 tris=102
  faunaFamily:dog              calls=0 tris=85
  faunaFamily:horse            calls=0 tris=103
  faunaFamily:rabbit           calls=0 tris=104
  faunaFamily:rat              calls=0 tris=47
  faunaFamily:rooster          calls=0 tris=39
  faunaFamily:sheep            calls=0 tris=83
  faunaFamily:stag             calls=1 tris=582
  items                        calls=3 tris=1452
  npcFamily:Farmer             calls=0 tris=534
  npcFamily:Knight_Cloth       calls=0 tris=494
  npcFamily:Peasant            calls=1 tris=770
  npcFamily:Peasant_Boots      calls=0 tris=163
  npcFamily:Ranger_NoHood      calls=0 tris=202
  npcFamily:woodcutter         calls=0 tris=112
  other                        calls=32 tris=8989
  settlement:decor             calls=17 tris=34780
  settlement:fence             calls=0 tris=654
  settlement:fireCampfire      calls=0 tris=4
  settlement:fireHouseInteriorLamp calls=1 tris=72
  settlement:houseInteractive  calls=1 tris=218
  settlement:houseStatic       calls=6 tris=8812
  settlement:landmarkGarden    calls=0 tris=194
  settlement:landmarkNoticeBoard calls=0 tris=5
  settlement:landmarkWellCentral calls=1 tris=242
  settlement:landmarkWellPasture calls=1 tris=211
  settlement:other             calls=1 tris=28
  settlement:storageContainer  calls=1 tris=404
  settlement:storageHay        calls=0 tris=58
  settlement:storageTrough     calls=1 tris=288
  settlement:storageWoodHousehold calls=0 tris=1053
  settlement:storageWoodSettlementPrimary calls=0 tris=99
  settlement:storageWoodSettlementSecondary calls=0 tris=234
  settlement:workplace         calls=0 tris=322
  terrain                      calls=19 tris=1374899
  vegetation                   calls=44 tris=652372

Main:
  calls avg: 238  tris avg: 5146997
  info calls avg: 311  residual calls avg: 0
  switches avg: material=129.6 program=62.6  actor: calls=26.3 material=19.8 program=9.6
  skinning avg: skinned calls=33.9 skeletons first used=8.7
  environment                  calls=16 tris=5584
  faunaFamily:bear             calls=0 tris=130
  faunaFamily:chicken          calls=1 tris=178
  faunaFamily:cow              calls=0 tris=96
  faunaFamily:dog              calls=3 tris=938
  faunaFamily:donkey           calls=0 tris=113
  faunaFamily:horse            calls=0 tris=14
  faunaFamily:rabbit           calls=0 tris=29
  faunaFamily:rat              calls=0 tris=796
  faunaFamily:rooster          calls=0 tris=16
  faunaFamily:sheep            calls=1 tris=456
  faunaFamily:stag             calls=0 tris=40
  faunaFamily:wolf             calls=0 tris=133
  grass                        calls=16 tris=1832550
  items                        calls=19 tris=1846
  npcFamily:Farmer             calls=2 tris=3022
  npcFamily:Herbalist          calls=0 tris=401
  npcFamily:Knight_Cloth       calls=1 tris=1824
  npcFamily:Peasant            calls=12 tris=14986
  npcFamily:Peasant_Boots      calls=1 tris=1715
  npcFamily:Wizard             calls=0 tris=339
  npcFamily:blacksmith         calls=1 tris=2001
  other                        calls=34 tris=13693
  settlement:decor             calls=1 tris=3551
  settlement:fence             calls=1 tris=1287
  settlement:fireCampfire      calls=1 tris=97
  settlement:fireHouseExteriorLamp calls=3 tris=134
  settlement:fireHouseInteriorLamp calls=1 tris=101
  settlement:fireVillageTorch  calls=4 tris=267
  settlement:houseInteractive  calls=3 tris=309
  settlement:houseStatic       calls=6 tris=5586
  settlement:landmarkGarden    calls=1 tris=12886
  settlement:landmarkNoticeBoard calls=0 tris=8
  settlement:landmarkWellCentral calls=1 tris=394
  settlement:landmarkWellHousehold calls=1 tris=1129
  settlement:landmarkWellPasture calls=1 tris=370
  settlement:other             calls=2 tris=36
  settlement:storageBarrel     calls=2 tris=3093
  settlement:storageContainer  calls=3 tris=582
  settlement:storageGoods      calls=7 tris=1512
  settlement:storageHay        calls=0 tris=99
  settlement:storageTrough     calls=1 tris=403
  settlement:storageWoodHousehold calls=0 tris=1422
  settlement:storageWoodSettlementPrimary calls=0 tris=162
  settlement:workplace         calls=2 tris=680
  terrain                      calls=21 tris=1540953
  vegetation                   calls=47 tris=553554
  water                        calls=16 tris=1137796


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 23
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 23 total):

[LONG FRAME] 7652.8ms
simulate      7643.4ms
render           9.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC           7637.9ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER           9.2ms
OTHER            4.5ms

Long frame #2:

[LONG FRAME] 5310ms
simulate      5305.1ms
render           4.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC           5300.7ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER           4.6ms
OTHER            3.8ms

streaming / stages:
  terrainPrepare               3.1ms
  riverChannelSegmentsNear     0.3ms
  riverTileBuild               0.1ms

Long frame #3:

[LONG FRAME] 4498ms
simulate      4490.6ms
render           7.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC           4486.1ms
FAUNA            0.6ms
PHYSICS          0.1ms
RENDER           7.1ms
OTHER            3.9ms

Long frame #4:

[LONG FRAME] 442.8ms
simulate       312.3ms
render         130.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING      300.0ms
NPC              2.6ms
FAUNA            0.9ms
PHYSICS          0.0ms
RENDER         130.2ms
OTHER            9.1ms

streaming / stages:
  chunkUpdate                  300.0ms
  terrainPrepare               289.5ms
  riverChannelSegmentsNear     0.3ms

Long frame #5:

[LONG FRAME] 376.8ms
simulate        10.0ms
render         365.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           23.9ms
STREAMING        1.7ms
NPC              2.4ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER         341.2ms
OTHER            6.4ms

streaming / stages:
  chunkUpdate                  1.7ms
  terrainPrepare               1.3ms
  riverChannelSegmentsNear     0.1ms

---

[Seedvale Program Census]

Programs created: 138
Program count: final=138 max=138

By frame:
  frame 0   +75 programs   <== largest transition
  frame 12   +2 programs
  frame 13   +1 program
  frame 15   +1 program
  frame 77   +1 program
  frame 81   +1 program
  frame 90   +1 program
  frame 93   +1 program
  frame 100   +1 program
  frame 203   +1 program
  frame 579   +1 program
  frame 2077   +19 programs
  frame 2121   +7 programs
  frame 2337   +26 programs

Largest transition — frame 0 (+75 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=53d36bb0-c654-4ea9-9679-21a5e2b04b89 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=911580ea-deec-4c5d-9e4b-ff62056bfa80
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=ef6fa868-9432-405b-b426-54182e5c4194
  #3 type=ShaderMaterial name='' bucket=other cacheKey=4,5,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d15bfad2-bae6-43bc-a583-0ded4c4555e7
  #4 type=ShaderMaterial name='' bucket=water cacheKey=6,7,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ed9a8b1b-22ba-4dfb-9863-0bcce6273ce4
  #5 type=ShaderMaterial name='' bucket=water cacheKey=6,7,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=15159312-f9d5-4c0d-8545-287c762b0faa
  #6 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c033a163-294e-4ca0-89b2-a8393ac26efa
  #7 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=0dab3878-f8ef-49cb-a7b0-fb4e1b6375f1
  #8 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=eb52be6d-f55d-4397-93ac-51bff6b092ab (Wood)
  #9 type=ShaderMaterial name='' cacheKey=8,9,highp,srgb-linear,fa… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #10 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #11 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2fe26ca6-947a-4077-9fb2-9e8012389000
  #12 type=ShaderMaterial name='' bucket=grass cacheKey=10,11,highp,srgb-linear,… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=103bc7f4-da7e-4684-b530-2c2212c421a3
  #13 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3ac607bf-516c-4a01-9c51-2b902103a5db (Green)
  #14 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c61284a6-db44-400c-820d-71244857937b (Pink)
  #15 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7ced7c53-0ff3-417d-90a3-7d820b281002 (Main)
  #16 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=16497bba-6696-4799-868b-ce07ec94e607 (Material.001)
  #17 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=94b0a5fd-3d14-46cb-9920-a91981f7b190 (lambert2SG)
  #18 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d4518224-771f-4797-9588-825df365776d (Material #55)
  #19 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=95b320d1-7a89-43b1-8291-8d6231c05bda (Stone)
  #20 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=46ec3b5d-befd-4d9b-a95b-9431d0769e0d (None)
  #21 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c363fdab-b8c5-4dd5-a642-48ba6a50a619 (Flowers)
  #22 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=items cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=e5f7313d-4b0a-4d1b-86b0-b29baa611eb2 (Pond_Pack_MAT)
  #23 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=4d0e2a22-2fb0-47c7-9554-d4cad42116a5 (MI_WoodTrim)
  #24 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #25 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4d721896-da46-4f91-bfbd-601b0ddae290 (MI_WindowGlass)
  #26 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=e41af9a3-271c-41d0-a2b0-375d6d9a6bd1
  #27 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=cda032d9-acf7-4ed7-b4dd-d0f46efabe44 (MI_WoodTrim)
  #28 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #29 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a649a749-1eb8-48fe-880c-56712b301e79 (MI_WindowGlass)
  #30 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #31 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2b1d42ab-50d3-43d5-b254-9bd3fa5fa5ff (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=68517d9d-e4d8-47db-98dd-d949d6bcd9da (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=b02017ea-da4e-467d-a11b-86bee39fdd4b (MI_Hair_1)
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
      material=0cbf4428-921e-429e-a4a6-0366f4f9a1c0 (Green)
  #45 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=a7c72f7f-8f9d-41a5-94e2-4e93606f9d3e (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='MapleTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3bea20f6 fHash=5b26a60d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=96e63441-65e0-4765-8519-65d159f7691c (MapleTree_Leaves)
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6b011a9e-da4b-4d5e-a5a5-d029e05beefb (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=ccd18362-92e6-415a-9edc-9367aede6846
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=a5fe17a9-e32f-4cae-acee-992fd96045d4 (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=56757774-ff41-4310-8232-8e596cf0b581 (DarkGreen)
  #51 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d14e7a2a-901f-45de-8487-62731cefc21d (MI_Regular_Male)
  #52 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=2d3c7f85-1f49-4429-9b69-30b6d77f7ea0 (MI_Eyes)
  #53 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9cc495ca-5d89-4797-915b-8c95efb85d77 (Main)
  #54 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=11f7d62c-9c1b-40f0-8db9-f17b1e2f72fc (PathRocks)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=3d4df175-b637-449a-88d6-5a483d2f8f40 (MI_Peasant)
  #56 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=a419a478-fc76-454f-a12a-cde7374d6f3c (SV_MI_Peasant)
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
    vertexShaderHash differs: #2=5c2c57a3, #6=e3408c64, #8=d38f15a4, #13=c0d790d1, #14=d3fd7a87, #15=54e03756, #16=a99aa494, #17=7bb77142, #19=a9733c9d, #20=6db98a06, #21=e4cbf8ca, #22=c3bc6325, #23=c5e73b05, #24=13a74ec7, #25=9dcf1cb4, #26=66d360c8, #27=12873951, #28=fc941d05, #29=e551c572, #32=842fe1df, #33=ac268392, #34=1c179521, #44=190d3a9c, #45=2f7179e3, #46=3bea20f6, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=20daccfa, #52=1dcbc6ff, #53=fd8301ed, #54=b643916d, #55=1d0412b3, #56=cde317ee
    fragmentShaderHash differs: #2=e354d864, #6=c0b8fc9f, #8=6578c10d, #13=a81023c3, #14=2eae9a54, #15=d391c52, #16=63f9c0d1, #17=87728b15, #19=bd723c8a, #20=efed8e98, #21=135696d3, #22=ded4be89, #23=d4c95125, #24=3ab4c629, #25=2d1aa4a, #26=c0b8fc9f, #27=d4c95125, #28=3ab4c629, #29=2d1aa4a, #32=34995f15, #33=25a41317, #34=71f22dc6, #44=633146b4, #45=943c7b97, #46=5b26a60d, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=a8862f4a, #52=1a1c0d8, #53=2f2885d5, #54=754b87bd, #55=512afd6f, #56=512afd6f
    bucket differs: #2=terrain, #6=other, #8=other, #13=vegetation, #14=vegetation, #15=fauna, #16=fauna, #17=fauna, #19=environment, #20=environment, #21=vegetation, #22=items, #23=settlement, #24=(unknown), #25=settlement, #26=settlement, #27=settlement, #28=(unknown), #29=settlement, #32=other, #33=other, #34=other, #44=settlement, #45=settlement, #46=settlement, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=fauna, #54=settlement, #55=npc, #56=npc
    define STANDARD differs: #2=, #6=, #8=, #13=, #14=, #15=, #16=, #17=, #19=, #20=, #21=, #22=, #23=, #24=(unset), #25=, #26=, #27=, #28=(unset), #29=, #32=, #33=, #34=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=, #56=
    flag alphaTest differs: #2=0, #6=0, #8=0, #13=0, #14=0, #15=0, #16=0, #17=0, #19=0, #20=0, #21=0.45, #22=0, #23=0, #24=(unknown), #25=0, #26=0, #27=0, #28=(unknown), #29=0, #32=0, #33=0, #34=0, #44=0, #45=0, #46=0.45, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0, #56=0
    flag envMap differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=false, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag flatShading differs: #2=false, #6=true, #8=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=true, #27=false, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag fog differs: #2=true, #6=true, #8=true, #13=true, #14=true, #15=true, #16=true, #17=true, #19=true, #20=true, #21=true, #22=true, #23=true, #24=(unknown), #25=true, #26=true, #27=true, #28=(unknown), #29=true, #32=true, #33=true, #34=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true, #56=true
    flag map differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #17=true, #19=false, #20=true, #21=true, #22=true, #23=true, #24=(unknown), #25=false, #26=false, #27=true, #28=(unknown), #29=false, #32=true, #33=true, #34=true, #44=false, #45=true, #46=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=false, #54=true, #55=true, #56=true
    flag normalMap differs: #2=true, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=false, #23=true, #24=(unknown), #25=false, #26=false, #27=true, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=true, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag transparent differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=true, #26=false, #27=false, #28=(unknown), #29=true, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
    flag vertexColors differs: #2=true, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=true, #23=false, #24=(unknown), #25=false, #26=false, #27=false, #28=(unknown), #29=false, #32=true, #33=true, #34=false, #44=false, #45=false, #46=false, #47=true, #48=false, #49=false, #50=false, #51=true, #52=true, #53=false, #54=false, #55=false, #56=false
    flag wireframe differs: #2=false, #6=false, #8=false, #13=false, #14=false, #15=false, #16=false, #17=false, #19=false, #20=false, #21=false, #22=false, #23=false, #24=(unknown), #25=false, #26=false, #27=false, #28=(unknown), #29=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false, #56=false
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



Frame 2077 (+19):
  Program #86
    material: MeshStandardMaterial ''
    materialUuid: ef6fa868-9432-405b-b426-54182e5c4194
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: faa7eb53-7464-4125-990d-ca55b58386c1
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
    materialUuid: 45000be2-c1f6-4cdd-a336-8d49fe81ae6e
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1d9ad13b
    fragmentShaderHash: b949dbe8
  Program #89
    material: MeshStandardMaterial 'Stone'
    materialUuid: 8a83fbfb-8a47-4430-b4e1-f42ec842ff19
    object: Mesh 'chunk-environment-region-5,-1|largeRock-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b3c52649
    fragmentShaderHash: acd7dae2
  Program #90
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: 122f5dbf-a025-4bff-902b-a8b70645d134
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_3.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #91
    material: MeshStandardMaterial 'PineTree_Leaves'
    materialUuid: c363fdab-b8c5-4dd5-a642-48ba6a50a619
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
    vertexShaderHash: 2bcd2d09
    fragmentShaderHash: 5493d3ba
  Program #92
    material: MeshStandardMaterial 'NormalTree_Bark'
    materialUuid: 6d7302c5-18b2-40ec-b6a4-93a3fa628444
    object: Mesh 'mesh_0'
    asset: /models/nature/deadtree_3.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1bd8d9e3
    fragmentShaderHash: e2f189d1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 865688d0-7c7b-4437-8e87-492d74e89e33
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
    materialUuid: d14e7a2a-901f-45de-8487-62731cefc21d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #95
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 2d3c7f85-1f49-4429-9b69-30b6d77f7ea0
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #96
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 2b1d42ab-50d3-43d5-b254-9bd3fa5fa5ff
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #97
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 68517d9d-e4d8-47db-98dd-d949d6bcd9da
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #98
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: b02017ea-da4e-467d-a11b-86bee39fdd4b
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #99
    material: MeshStandardMaterial ''
    materialUuid: 25c53f23-654c-4d34-9636-bb4c62332e49
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 29daea16
    fragmentShaderHash: 83e94369
  Program #100
    material: MeshStandardMaterial 'Green'
    materialUuid: ce9c1750-3679-4909-ab0b-db11b2f972ec
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
    materialUuid: 9766ddae-ca08-41ac-8c0c-e125fdd061fa
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 83e57f3f
    fragmentShaderHash: 15fea9b7
  Program #102
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: 23c40873-8fb9-4557-a64f-07d01344cb0e
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1e92ce5b
    fragmentShaderHash: 3735e0a9
  Program #103
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 1a1c065a-1b23-4273-aa4f-b16a5edaf6a7
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 7c8100cb
    fragmentShaderHash: 2c84ad03
  Program #104
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: 37b99472-1a09-43fa-a8b7-879d901d376b
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a26aa35d
    fragmentShaderHash: cf881fac

Frame 2337 (+26):
  Program #112
    material: ShaderMaterial 'SkyShader'
    materialUuid: 53d36bb0-c654-4ea9-9679-21a5e2b04b89
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #113
    material: ShaderMaterial ''
    materialUuid: 103bc7f4-da7e-4684-b530-2c2212c421a3
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #114
    material: MeshStandardMaterial ''
    materialUuid: ef6fa868-9432-405b-b426-54182e5c4194
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #115
    material: MeshStandardMaterial 'Wood'
    materialUuid: b49ee9c5-df67-410f-8a66-60c4aba9945e
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #116
    material: MeshStandardMaterial 'Green'
    materialUuid: ce9c1750-3679-4909-ab0b-db11b2f972ec
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
    materialUuid: 45000be2-c1f6-4cdd-a336-8d49fe81ae6e
    object: Mesh 'settlement-well-central-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3e42e9c4
    fragmentShaderHash: d48c36b2
  Program #118
    material: MeshStandardMaterial 'Green'
    materialUuid: faa7eb53-7464-4125-990d-ca55b58386c1
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
    materialUuid: 02073760-83d0-4066-af4e-8d7e9bc8acc9
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #120
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: c363fdab-b8c5-4dd5-a642-48ba6a50a619
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
    materialUuid: c5d04623-a76b-4a50-b617-3ef13b7591fe
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #122
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 865688d0-7c7b-4437-8e87-492d74e89e33
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
    materialUuid: 9766ddae-ca08-41ac-8c0c-e125fdd061fa
    object: Mesh 'mesh_0'
    asset: /models/nature/mushroom_a.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b4b22c53
    fragmentShaderHash: af711478
  Program #124
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: d14e7a2a-901f-45de-8487-62731cefc21d
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #125
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 2d3c7f85-1f49-4429-9b69-30b6d77f7ea0
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #126
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 2b1d42ab-50d3-43d5-b254-9bd3fa5fa5ff
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #127
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 68517d9d-e4d8-47db-98dd-d949d6bcd9da
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #128
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: b02017ea-da4e-467d-a11b-86bee39fdd4b
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #129
    material: MeshStandardMaterial 'SV_WorkSkirt'
    materialUuid: 23c40873-8fb9-4557-a64f-07d01344cb0e
    object: SkinnedMesh 'EQ_WorkSkirt'
    asset: /assets/characters/Female_Peasant_Boots.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 127e1a7
    fragmentShaderHash: bc850bfa
  Program #130
    material: MeshStandardMaterial ''
    materialUuid: eb846aab-dd97-4dcd-ad16-8597af2444a2
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8520711,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: e3408c64
    fragmentShaderHash: 4e17aba
  Program #131
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: 1a1c065a-1b23-4273-aa4f-b16a5edaf6a7
    object: SkinnedMesh 'Female_Peasant_Arms'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 21af24b7
    fragmentShaderHash: c4ca7b4
  Program #132
    material: MeshStandardMaterial 'MI_Hair_2'
    materialUuid: 37b99472-1a09-43fa-a8b7-879d901d376b
    object: SkinnedMesh 'HAIR_Buns'
    asset: /assets/characters/Female_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 49797de9
    fragmentShaderHash: 32bd48fd
  Program #133
    material: ShaderMaterial ''
    materialUuid: 15159312-f9d5-4c0d-8545-287c762b0faa
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
    materialUuid: 0dab3878-f8ef-49cb-a7b0-fb4e1b6375f1
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #136
    material: ShaderMaterial ''
    materialUuid: 8bed7b04-13eb-41b4-8cd3-667298a10eca
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7
  Program #137
    material: ShaderMaterial ''
    materialUuid: 1d1bb83e-06f3-46a7-a1f9-8a158561f3b8
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

Frame 13
  #77
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 38.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 15
  #78
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 105.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 77
  #79
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 139.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 81
  #80
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 280.6 ms  (upper bound — whole postprocess-render call, see note above)

Frame 90
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 121.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 93
  #82
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 151.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 100
  #83
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 150.3 ms  (upper bound — whole postprocess-render call, see note above)

Frame 203
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 140.6 ms  (upper bound — whole mirror-render call, see note above)

Frame 579
  #85
      material: MeshStandardMaterial 'lambert2SG'
      object: Mesh 'chunk-vegetation-region-3,-1|reed-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 334.8 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 1462.4 ms
  programs >1 ms: 9
  max: 334.8 ms (#85)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.4 ms  p95=11.4 ms  max=12.3 ms  Δavg vs baseline=—
  hide-grass           avg=9.3 ms  p95=11.3 ms  max=11.8 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-vegetation      avg=8.9 ms  p95=10.6 ms  max=11.0 ms  Δavg vs baseline=-0.5 ms (-6%)
  no vegetation/grass  avg=8.8 ms  p95=9.8 ms  max=11.0 ms  Δavg vs baseline=-0.6 ms (-7%)
  hide-environment     avg=9.5 ms  p95=11.6 ms  max=12.2 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-settlement      avg=8.7 ms  p95=9.9 ms  max=10.6 ms  Δavg vs baseline=-0.7 ms (-8%)
  no water             avg=9.3 ms  p95=12.0 ms  max=12.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=9.3 ms  p95=10.6 ms  max=11.2 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-npc-fauna       avg=7.5 ms  p95=8.9 ms  max=9.2 ms  Δavg vs baseline=-2.0 ms (-21%)
  no-shadows           avg=9.2 ms  p95=10.6 ms  max=10.7 ms  Δavg vs baseline=-0.3 ms (-3%)
  no-ao                avg=9.1 ms  p95=11.2 ms  max=11.9 ms  Δavg vs baseline=-0.3 ms (-3%)
  no-bloom             avg=9.3 ms  p95=10.3 ms  max=12.0 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-smaa              avg=9.5 ms  p95=10.7 ms  max=13.3 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-god-rays          avg=9.6 ms  p95=11.7 ms  max=11.9 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-film-grade        avg=9.7 ms  p95=11.4 ms  max=12.0 ms  Δavg vs baseline=+0.2 ms (+2%)
  no postprocessing    avg=9.2 ms  p95=11.0 ms  max=11.2 ms  Δavg vs baseline=-0.3 ms (-3%)
  no mirrors           avg=9.4 ms  p95=10.8 ms  max=12.8 ms  Δavg vs baseline=-0.0 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.9 ms  p95=27.2 ms  max=29.4 ms
  CPU wall      avg=9.4 ms  p95=11.4 ms  max=12.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=13 prefetched=25
