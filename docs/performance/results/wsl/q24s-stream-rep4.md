# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T20:18:55.260Z
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
Frames: 432
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c78db12c1354f74b3f62e65ee4923a50c52f6879
  runId: 2026-10-30T20-17-51-061Z-0ufcm7
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
  camera: pos=(426.9, 0.9, -10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s
  populationGate: stable waited=5071ms npc=24
  gpuTimer: available=true resolved=true samples=433 span=postprocess+labels

FPS:
  avg: 32.7
  min: 2
  p1: 4

Frame time (wall-clock):
  avg: 30.6 ms
  p50: 21.6 ms
  p95: 55.3 ms
  p99: 243.6 ms
  max: 569.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.1 p95=25.2 p99=59.6 max=105.6 n=432
  render: p50=14 p95=27 p99=183.5 max=560.6 n=432
  frame: p50=21.6 p95=55.3 p99=243.6 max=569.3 n=432

Rendering (combined renderer.info):
  draw calls: 744 avg / 2098 max
  triangles: 10.82M avg
  mirror draws: 125 avg
  geometries: 746
  textures: 371

Pass submissions (actual):
  reliability: observed
  frames: 436 shadowRefresh=269 shadowSkipped=167
  mirror calls avg: 125
  shadow calls avg: 206
  main calls avg: 479

Scene (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  grass            draws=36 tris=433.7k meshes=36 inst=55893
  vegetation       draws=199 tris=1.32M meshes=199 inst=841
  environment      draws=127 tris=25.5k meshes=127 inst=143
  settlement       draws=646 tris=738.7k meshes=646 inst=1412
  water            draws=47 tris=3.40M meshes=47 inst=47
  npc              draws=213 tris=273.1k meshes=213 inst=213
  fauna            draws=232 tris=96.8k meshes=232 inst=232
  items            draws=338 tris=28.6k meshes=338 inst=338
  other            draws=217 tris=26.7k meshes=217 inst=217

Shadow casters (one-pass estimate):
  terrain          draws=65 tris=4.79M meshes=65 inst=65
  vegetation       draws=183 tris=1.27M meshes=183 inst=813
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=417 tris=504.0k meshes=417 inst=1099
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=98 tris=14.5k meshes=98 inst=98

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=77 tris=77.8k meshes=77 inst=580
  houseInteractive draws=26 tris=4.1k meshes=26 inst=26
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=10.1k meshes=3 inst=13
  storageContainer draws=18 tris=4.3k meshes=18 inst=58
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.8k meshes=8 inst=28
  workplace        draws=8 tris=4.1k meshes=8 inst=8
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=4.0k meshes=3 inst=5
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=13 tris=1.4k meshes=13 inst=13
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=194 tris=377.2k meshes=194 inst=277
  other            draws=27 tris=504 meshes=27 inst=27

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=109 tris=133.2k skinned=109/109
      Farmer           agents=4 draws=33 tris=49.9k skinned=33/33
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
      Wizard           agents=1 draws=12 tris=12.0k skinned=12/12
      Herbalist        agents=1 draws=10 tris=14.2k skinned=10/10
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      far  agents=23 camera-relevant=0 draws=213 tris=273.1k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      sheep            agents=14 draws=28 tris=8.5k skinned=28/28
      dog              agents=4 draws=22 tris=7.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      cow              agents=2 draws=14 tris=4.9k skinned=14/14
      donkey           agents=2 draws=14 tris=4.0k skinned=14/14
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      far  agents=60 camera-relevant=0 draws=232 tris=96.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=65 composed=65 multiplied=65 skinned=0
  grass                    nodes=47 composed=47 multiplied=47 skinned=0
  vegetation               nodes=234 composed=234 multiplied=234 skinned=0
  environment              nodes=221 composed=221 multiplied=221 skinned=0
  settlement               nodes=1293 composed=1293 multiplied=1293 skinned=0
  water                    nodes=47 composed=47 multiplied=47 skinned=0
  npc                      nodes=1801 composed=1801 multiplied=1801 skinned=213
  fauna                    nodes=2626 composed=2626 multiplied=2626 skinned=212
  items                    nodes=522 composed=522 multiplied=522 skinned=0
  other                    nodes=428 composed=411 multiplied=428 skinned=9
  top scene children:
    fauna ×60                nodes=2626 composed=2626 multiplied=2626 skinned=212
    npc ×23                  nodes=1801 composed=1801 multiplied=1801 skinned=213
    settlement ×3            nodes=1293 composed=1293 multiplied=1293 skinned=0
    chunk-items ×32          nodes=513 composed=513 multiplied=513 skinned=0
    Group ×35                nodes=248 composed=248 multiplied=248 skinned=9
    chunk-environmen ×3      nodes=163 composed=163 multiplied=163 skinned=0
    chunk ×65                nodes=65 composed=65 multiplied=65 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    chunk-grass ×11          nodes=47 composed=47 multiplied=47 skinned=0
    chunk-water ×46          nodes=46 composed=46 multiplied=46 skinned=0
    chunk-river ×40          nodes=40 composed=40 multiplied=40 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.2 ms
  STREAMING      2.3 ms
  NPC            3.1 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         17.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  STREAMING: 7
  WATER: 6

Hitches (>= 8 ms): total=13
  chunk water            n=6 avg=11.9 max=20.0
  chunk mesh             n=7 avg=10.9 max=15.5

Isolation probes:
  full               render=9.1 ms draws=303 tris=6.21M
  hide-grass         render=9.0 ms draws=274 tris=5.15M
  hide-vegetation    render=8.1 ms draws=166 tris=4.35M
  hide-vegetation-grass render=8.0 ms draws=136 tris=3.31M
  hide-environment   render=9.3 ms draws=282 tris=6.19M
  hide-settlement    render=8.4 ms draws=278 tris=6.19M
  hide-water         render=8.9 ms draws=285 tris=5.16M
  hide-terrain       render=9.3 ms draws=271 tris=3.89M
  hide-npc-fauna     render=7.3 ms draws=303 tris=6.21M
  no-shadows         render=9.0 ms draws=293 tris=5.97M
  no-ao              render=8.9 ms draws=297 tris=6.21M
  no-bloom           render=8.6 ms draws=285 tris=6.14M
  no-smaa            render=9.0 ms draws=300 tris=6.21M
  no-god-rays        render=9.0 ms draws=299 tris=6.13M
  no-film-grade      render=8.7 ms draws=303 tris=6.21M
  no-postprocessing  render=8.5 ms draws=275 tris=6.14M
  no-reflections     render=9.1 ms draws=230 tris=5.22M

Frame attribution:
  frame max: 569.3 ms
  largest labelled hitch: 20 ms
  unattributed: 549.3 ms

Long frames:
  threshold: 80 ms
  count: 19
  worst: 569.3 ms

Raw sidecar:
  sampling=full factor=1 exported=432/432

Recommendation:
Largest frame (569.3 ms) is not explained by labelled hitches (largest 20 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 23
  Fauna (agents): 30

NPC:
  total: 3.1 ms/frame
  crowd pass: 0.0 ms/frame (4.9 ms cumulative)
  agent updates: 1.2 ms/frame (534.1 ms cumulative)
  livestock: 1.2 ms/frame (510.8 ms cumulative)
    loaded tick: 1.2 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 24.3
    unique animals/frame: 23.3
    duplicate updates/frame: 1.1
    detached animals/frame: 0.0
    dog updates/frame: 5.4
    dog guard scans: 5.4/frame (43.5 predator candidates/frame)
    pest scans: 2.6/frame (2.6 rat candidates/frame)
    nearest scans: 11.7/frame (0.0 candidates/frame)
    water samples: 21.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 21.2/frame, 0.00 ms/frame (worst call 0.20 ms, 1922.8 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 24.0
    behaviour executions/frame: 11.9
    presentation executions/frame: 11.1
  rats: 0.1 ms/frame (51.8 ms cumulative)
  social: 0.0 ms/frame (2.5 ms cumulative)
  streaming: 0.4 ms/frame (156.3 ms cumulative)
  maintenance: 0.2 ms/frame (68.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.9 ms/frame (804.9 ms cumulative)
  forest sampling: 0.1 ms/frame (48.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (11.7 ms cumulative)
    targeting: 0.0 ms/frame (8.6 ms cumulative)
    decision: 0.0 ms/frame (6.3 ms cumulative)
    behaviour: 1.1 ms/frame (487.1 ms cumulative)
    life/presentation: 0.4 ms/frame (189.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.5
    expensive behaviour agents/frame: 18.6
    full-rate agents/frame: 8.3
    reduced-cadence agents/frame: 22.0
    behaviour executions/frame: 19.1
    presentation executions/frame: 18.3

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 28.7
    village scan candidates/frame: 375.7
    player perception checks/frame: 30.3

  nearest scans: 26.0/frame (11251 calls)
  nearest candidates checked: 211.8/frame (91501 total)
  herd leader scans: 0.3/frame (138 calls)
  herd candidates checked: 9.6/frame (4140 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.6/frame (172.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 86.4/frame, 0.10 ms/frame (worst call 3.90 ms)
    collider queries: 86.4/frame, 0.10 ms/frame (worst call 0.80 ms, 6516.2 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 79
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.25 ms
    max 1.10 ms

  allocation/setup:
    avg 0.20 ms
    max 1.00 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.01 ms
    max 0.10 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.06 ms
    max 0.40 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.51 ms
    max 1.80 ms

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
    allocation/setup avg/max: 0.07 / 0.40 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  grain:
    buckets/meshes: 28/28
    instances: 50940 (max 10763)
    allocation/setup avg/max: 0.04 / 0.30 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 28/28
    instances: 203309 (max 44129)
    allocation/setup avg/max: 0.05 / 1.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.10 ms
  filler:
    buckets/meshes: 9/9
    instances: 716563 (max 184195)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.01 / 0.10 ms

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
Frames: 436
Shadow refresh frames: 269
Shadow skipped frames: 167

Mirror:
  calls avg: 125  tris avg: 962842
  info calls avg: 125  residual calls avg: 0
  switches avg: material=56.7 program=34.3  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=3.5 skeletons first used=3.5
  environment                  calls=5 tris=4764
  items                        calls=1 tris=490
  other                        calls=19 tris=4954
  settlement:decor             calls=2 tris=6208
  settlement:fence             calls=1 tris=2005
  settlement:fireCampfire      calls=2 tris=157
  settlement:fireHouseExteriorLamp calls=4 tris=214
  settlement:fireHouseInteriorLamp calls=1 tris=161
  settlement:fireVillageTorch  calls=6 tris=442
  settlement:houseInteractive  calls=4 tris=492
  settlement:houseStatic       calls=11 tris=10312
  settlement:landmarkGarden    calls=2 tris=19975
  settlement:landmarkNoticeBoard calls=1 tris=11
  settlement:landmarkWellCentral calls=2 tris=598
  settlement:landmarkWellHousehold calls=2 tris=1909
  settlement:landmarkWellPasture calls=1 tris=545
  settlement:other             calls=3 tris=55
  settlement:storageBarrel     calls=2 tris=3844
  settlement:storageContainer  calls=4 tris=741
  settlement:storageGoods      calls=12 tris=2400
  settlement:storageHay        calls=0 tris=151
  settlement:storageTrough     calls=2 tris=483
  settlement:storageWoodHousehold calls=0 tris=1641
  settlement:storageWoodSettlementPrimary calls=0 tris=254
  settlement:workplace         calls=3 tris=1163
  terrain                      calls=6 tris=428932
  vegetation                   calls=27 tris=470111

Shadow (refresh only):
  calls avg: 206  tris avg: 2445097
  info calls avg: 206  residual calls avg: 0
  switches avg: material=95.1 program=92.4  actor: calls=10.3 material=0 program=1.9
  skinning avg: skinned calls=14.2 skeletons first used=5.7
  environment                  calls=14 tris=8511
  faunaFamily:boar             calls=0 tris=129
  faunaFamily:chicken          calls=1 tris=94
  faunaFamily:cow              calls=1 tris=246
  faunaFamily:dog              calls=0 tris=186
  faunaFamily:horse            calls=1 tris=235
  faunaFamily:rabbit           calls=0 tris=238
  faunaFamily:rat              calls=0 tris=89
  faunaFamily:rooster          calls=0 tris=89
  faunaFamily:sheep            calls=1 tris=181
  faunaFamily:stag             calls=2 tris=1296
  items                        calls=4 tris=2040
  npcFamily:Farmer             calls=1 tris=1157
  npcFamily:Knight_Cloth       calls=1 tris=1143
  npcFamily:Peasant            calls=2 tris=1768
  npcFamily:Peasant_Boots      calls=0 tris=363
  npcFamily:Ranger_NoHood      calls=0 tris=452
  npcFamily:woodcutter         calls=0 tris=402
  other                        calls=36 tris=9485
  settlement:decor             calls=40 tris=80793
  settlement:fireHouseInteriorLamp calls=1 tris=130
  settlement:houseInteractive  calls=2 tris=386
  settlement:houseStatic       calls=9 tris=12115
  settlement:landmarkGarden    calls=0 tris=327
  settlement:landmarkNoticeBoard calls=0 tris=8
  settlement:landmarkWellCentral calls=1 tris=412
  settlement:other             calls=1 tris=27
  settlement:storageContainer  calls=2 tris=647
  settlement:storageHay        calls=0 tris=100
  settlement:storageTrough     calls=1 tris=424
  settlement:storageWoodHousehold calls=0 tris=1688
  settlement:storageWoodSettlementPrimary calls=0 tris=159
  settlement:workplace         calls=1 tris=707
  terrain                      calls=19 tris=1364808
  vegetation                   calls=62 tris=954261

Main:
  calls avg: 479  tris avg: 8306126
  info calls avg: 615  residual calls avg: 0
  switches avg: material=233.9 program=105.9  actor: calls=74.7 material=54.9 program=27.3
  skinning avg: skinned calls=78.3 skeletons first used=17
  environment                  calls=41 tris=13512
  faunaFamily:bear             calls=1 tris=506
  faunaFamily:chicken          calls=5 tris=688
  faunaFamily:cow              calls=0 tris=72
  faunaFamily:dog              calls=10 tris=3253
  faunaFamily:horse            calls=0 tris=34
  faunaFamily:rabbit           calls=0 tris=96
  faunaFamily:rat              calls=1 tris=2424
  faunaFamily:rooster          calls=0 tris=47
  faunaFamily:sheep            calls=4 tris=1210
  faunaFamily:stag             calls=0 tris=232
  faunaFamily:wolf             calls=1 tris=414
  grass                        calls=35 tris=4885108
  items                        calls=48 tris=5307
  npcFamily:Farmer             calls=7 tris=10072
  npcFamily:Knight_Cloth       calls=4 tris=5611
  npcFamily:Peasant            calls=31 tris=38058
  npcFamily:Peasant_Boots      calls=5 tris=6616
  npcFamily:blacksmith         calls=5 tris=7655
  other                        calls=56 tris=14481
  settlement:decor             calls=4 tris=11747
  settlement:fence             calls=3 tris=4027
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=9 tris=425
  settlement:fireHouseInteriorLamp calls=3 tris=320
  settlement:fireVillageTorch  calls=12 tris=884
  settlement:houseInteractive  calls=9 tris=980
  settlement:houseStatic       calls=19 tris=18171
  settlement:landmarkGarden    calls=4 tris=38857
  settlement:landmarkNoticeBoard calls=1 tris=24
  settlement:landmarkWellCentral calls=3 tris=1213
  settlement:landmarkWellHousehold calls=4 tris=3852
  settlement:landmarkWellPasture calls=3 tris=1098
  settlement:other             calls=6 tris=110
  settlement:storageBarrel     calls=5 tris=7628
  settlement:storageContainer  calls=7 tris=1445
  settlement:storageGoods      calls=23 tris=4809
  settlement:storageHay        calls=1 tris=291
  settlement:storageTrough     calls=3 tris=964
  settlement:storageWoodHousehold calls=1 tris=3272
  settlement:storageWoodSettlementPrimary calls=1 tris=499
  settlement:workplace         calls=5 tris=2359
  terrain                      calls=24 tris=1732484
  vegetation                   calls=62 tris=934106
  water                        calls=8 tris=541198


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 19
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 19 total):

[LONG FRAME] 569.3ms
simulate         7.1ms
render         560.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.5ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         555.2ms
OTHER            5.3ms

Long frame #2:

[LONG FRAME] 318.6ms
simulate         8.5ms
render         307.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.4ms
STREAMING        5.8ms
NPC              2.3ms
FAUNA            1.5ms
PHYSICS          0.1ms
RENDER         300.6ms
OTHER            0.9ms

streaming / stages:
  waterFinalize                2.9ms
  terrainFinalize              2.4ms
  chunkFinalize                0.5ms
  chunkUpdate                  0.5ms

Long frame #3:

[LONG FRAME] 282.7ms
simulate         7.2ms
render         275.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.6ms
STREAMING        0.0ms
NPC              2.1ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER         269.5ms
OTHER            4.5ms

Long frame #4:

[LONG FRAME] 271.9ms
simulate        95.2ms
render         175.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          153.8ms
STREAMING       74.1ms
NPC              8.0ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER          21.6ms
OTHER           13.4ms

streaming / stages:
  chunkUpdate                  74.1ms
  riverTileBuild               67.4ms
  terrainPrepare               5.3ms
  riverChannelSegmentsNear     0.4ms

Long frame #5:

[LONG FRAME] 249.6ms
simulate        16.9ms
render         232.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       33.4ms
NPC              7.6ms
FAUNA            5.3ms
PHYSICS          0.2ms
RENDER         232.3ms
OTHER            0.0ms

streaming / stages:
  terrainFinalize              20.4ms
  waterFinalize                12.2ms
  riverFinalize                0.3ms
  chunkFinalize                0.2ms
  chunkUpdate                  0.2ms

hitches:
  STREAMING chunk mesh             10.2ms
  STREAMING chunk mesh             10.2ms
  WATER chunk water            12.1ms

---

[Seedvale Program Census]

Programs created: 130
Program count: final=130 max=130

By frame:
  frame 0   +74 programs   <== largest transition
  frame 5   +1 program
  frame 75   +1 program
  frame 76   +1 program
  frame 77   +1 program
  frame 83   +2 programs
  frame 87   +1 program
  frame 95   +1 program
  frame 98   +1 program
  frame 113   +1 program
  frame 205   +1 program
  frame 877   +19 programs
  frame 921   +4 programs
  frame 1133   +22 programs

Largest transition — frame 0 (+74 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=b5ca2441 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=e6f36034-23ee-4970-8369-e0b9a0990195 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=dce742c4-1264-456a-bccc-c6832bc5ba83
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=e354d864 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=dd442653-a3b6-42f6-85a9-c7c4202698be
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=postprocess-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a7a3909f-152f-4647-9618-0efc27f23ec8
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=112356e8-a2b5-4de0-bc77-f0f50751dba0
  #5 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=3f71df04 fHash=d4350921 stage=postprocess-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f4baf742-6f4e-4eef-a76d-5998cc807403
  #6 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=4e887dbb-7118-4ff3-96de-2a0d93005153
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=d99ee400-e4d3-43c7-8728-5c030fc2ee42
  #8 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=5efaf074 fHash=5cf0ca9a stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7e159538-5ef7-4cbb-b26b-fc84e06561da
  #9 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f6c1cfe4-0c4c-4745-bea6-5be0342a24b5 (Wood)
  #10 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=postprocess-render
  #11 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=postprocess-render
  #12 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=postprocess-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=f033b853-134d-4829-a851-97da39dfd14b
  #13 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=55c98ecf-05aa-41b4-a753-7ef936eb24a2 (Flowers)
  #14 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=b087a1e3-05ad-4e48-a957-cb29dcc6ee4e (Green)
  #15 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d1d7f50b-f3af-4398-bc46-56ade319fc06 (Stone)
  #16 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=004aac74-0ee2-4f3f-a100-0bfaa32d1ee4 (None)
  #17 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d2142b43-3a7a-42d2-b86f-e12ae4184ffb (Pink)
  #18 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=54e03756 fHash=d391c52 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3c3174a1-92fa-4da3-9ad1-b89b6be2f129 (Main)
  #19 type=MeshStandardMaterial name='Material.001' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=a99aa494 fHash=63f9c0d1 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7516a1ac-0ab2-46af-bd75-28a46fe9e73b (Material.001)
  #20 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=dc79ff78-bd82-468d-8143-9e53ee7d60ae (lambert2SG)
  #21 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=postprocess-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=a2029f52-2d6f-42b6-ae59-cadb062d58aa (Material #55)
  #22 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=900650ef-f09c-4554-a15b-d8530ad55585 (MI_WoodTrim)
  #23 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=postprocess-render
  #24 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=ae19fc6c-bc25-4bcc-bf9b-83201aff2ec5 (MI_WindowGlass)
  #25 type=MeshStandardMaterial name='' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=66d360c8 fHash=c0b8fc9f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=51ce1b51-1e4e-4b94-a268-f868ed5ba2cb
  #26 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=81f2bbf9-7bab-4846-bc2f-cb2c9ddc9c35 (MI_WoodTrim)
  #27 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=postprocess-render
  #28 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3bb93d47-35b8-40bf-9740-3a8c4e1b3b75 (MI_WindowGlass)
  #29 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=postprocess-render
  #30 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=postprocess-render
  #31 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6a1cdeeb-9db7-4a6c-8ea4-6b783b5ac8ed (Main)
  #32 type=MeshStandardMaterial name='MI_Peasant' bucket=other cacheKey=physical,STANDARD,,highp… vHash=842fe1df fHash=34995f15 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=d42bd692-3673-467e-b6e3-9650d32a5f68 (MI_Peasant)
  #33 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=ac268392 fHash=25a41317 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=6a799d09-f2a6-496b-b67b-2c0da472856f (MI_Hair_1)
  #34 type=MeshStandardMaterial name='MI_Hair_1' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1c179521 fHash=71f22dc6 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ea7ecb4d-b1f0-4609-8146-18583e358cf0 (MI_Hair_1)
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
      material=f8000fc5-072e-4481-b9ce-be9b97ec6756 (Green)
  #45 type=MeshStandardMaterial name='NormalTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=2f7179e3 fHash=943c7b97 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=d77cd498-6afe-4962-ae35-4da238b7a1df (MapleTree_Bark)
  #46 type=MeshStandardMaterial name='PineTree_Leaves' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=34fd10df fHash=e1e27532 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9b5a94c1-ccea-4a86-9b52-847392ab5d3b (MapleTree_Leaves)
  #47 type=MeshStandardMaterial name='stockpiles_vc' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=a64d124e fHash=546e469 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=0ee6cdab-ec18-485f-8c40-ff68dfe6e599 (stockpiles_vc)
  #48 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=5d57cd8e-72fa-420a-abe9-3f3833215b93
  #49 type=MeshStandardMaterial name='lambert5SG' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=3abb47a8 fHash=85d3c28d stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=0dd8ef52-42e5-4d0d-8f32-2c1344810eac (Handle)
  #50 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=c4ff29c7-4ebe-4977-adbc-e389ff259c0e (DarkGreen)
  #51 type=MeshStandardMaterial name='MI_Regular_Male' bucket=other cacheKey=physical,STANDARD,,highp… vHash=20daccfa fHash=a8862f4a stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=18d61407-ac2b-418d-96f2-fc13c3cd756c (MI_Regular_Male)
  #52 type=MeshStandardMaterial name='MI_Eyes' bucket=other cacheKey=physical,STANDARD,,highp… vHash=1dcbc6ff fHash=1a1c0d8 stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=799de572-5168-42c1-945d-b8fba5c1325f (MI_Eyes)
  #53 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=7cc5ba13-705b-47e9-8cb5-c1bc5bb6691d (PathRocks)
  #54 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=cde317ee fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=50a49e56-314a-4b7a-b958-14ba413602a3 (SV_MI_Peasant)
  #55 type=MeshStandardMaterial name='SV_MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=1d0412b3 fHash=512afd6f stage=postprocess-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=ecee137c-d5e7-4830-adf1-a83b8896474f (MI_Knight)
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
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #9=d38f15a4, #13=e4cbf8ca, #14=c0d790d1, #15=a9733c9d, #16=6db98a06, #17=d3fd7a87, #18=54e03756, #19=a99aa494, #20=7bb77142, #22=c5e73b05, #23=13a74ec7, #24=9dcf1cb4, #25=66d360c8, #26=12873951, #27=fc941d05, #28=e551c572, #31=fd8301ed, #32=842fe1df, #33=ac268392, #34=1c179521, #44=190d3a9c, #45=2f7179e3, #46=34fd10df, #47=a64d124e, #48=94297e69, #49=3abb47a8, #50=9434da33, #51=20daccfa, #52=1dcbc6ff, #53=b643916d, #54=cde317ee, #55=1d0412b3
    fragmentShaderHash differs: #2=e354d864, #7=c0b8fc9f, #9=6578c10d, #13=135696d3, #14=a81023c3, #15=bd723c8a, #16=efed8e98, #17=2eae9a54, #18=d391c52, #19=63f9c0d1, #20=87728b15, #22=d4c95125, #23=3ab4c629, #24=2d1aa4a, #25=c0b8fc9f, #26=d4c95125, #27=3ab4c629, #28=2d1aa4a, #31=2f2885d5, #32=34995f15, #33=25a41317, #34=71f22dc6, #44=633146b4, #45=943c7b97, #46=e1e27532, #47=546e469, #48=aa0735a8, #49=85d3c28d, #50=77dfd097, #51=a8862f4a, #52=1a1c0d8, #53=754b87bd, #54=512afd6f, #55=512afd6f
    bucket differs: #2=terrain, #7=other, #9=other, #13=vegetation, #14=vegetation, #15=environment, #16=environment, #17=vegetation, #18=fauna, #19=fauna, #20=fauna, #22=settlement, #23=(unknown), #24=settlement, #25=settlement, #26=settlement, #27=(unknown), #28=settlement, #31=fauna, #32=other, #33=other, #34=other, #44=settlement, #45=settlement, #46=settlement, #47=settlement, #48=other, #49=settlement, #50=other, #51=other, #52=other, #53=settlement, #54=npc, #55=npc
    define STANDARD differs: #2=, #7=, #9=, #13=, #14=, #15=, #16=, #17=, #18=, #19=, #20=, #22=, #23=(unset), #24=, #25=, #26=, #27=(unset), #28=, #31=, #32=, #33=, #34=, #44=, #45=, #46=, #47=, #48=, #49=, #50=, #51=, #52=, #53=, #54=, #55=
    flag alphaTest differs: #2=0, #7=0, #9=0, #13=0.45, #14=0, #15=0, #16=0, #17=0, #18=0, #19=0, #20=0, #22=0, #23=(unknown), #24=0, #25=0, #26=0, #27=(unknown), #28=0, #31=0, #32=0, #33=0, #34=0, #44=0, #45=0, #46=0.45, #47=0, #48=0, #49=0, #50=0, #51=0, #52=0, #53=0, #54=0, #55=0
    flag envMap differs: #2=false, #7=false, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=false, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=false, #49=false, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag flatShading differs: #2=false, #7=true, #9=false, #13=false, #14=false, #15=false, #16=false, #17=false, #18=false, #19=false, #20=false, #22=false, #23=(unknown), #24=false, #25=true, #26=false, #27=(unknown), #28=false, #31=false, #32=false, #33=false, #34=false, #44=false, #45=false, #46=false, #47=false, #48=true, #49=true, #50=false, #51=false, #52=false, #53=false, #54=false, #55=false
    flag fog differs: #2=true, #7=true, #9=true, #13=true, #14=true, #15=true, #16=true, #17=true, #18=true, #19=true, #20=true, #22=true, #23=(unknown), #24=true, #25=true, #26=true, #27=(unknown), #28=true, #31=true, #32=true, #33=true, #34=true, #44=true, #45=true, #46=true, #47=true, #48=true, #49=true, #50=true, #51=true, #52=true, #53=true, #54=true, #55=true
    flag map differs: #2=false, #7=false, #9=false, #13=true, #14=false, #15=false, #16=true, #17=false, #18=false, #19=false, #20=true, #22=true, #23=(unknown), #24=false, #25=false, #26=true, #27=(unknown), #28=false, #31=false, #32=true, #33=true, #34=true, #44=false, #45=true, #46=true, #47=false, #48=false, #49=false, #50=false, #51=true, #52=true, #53=true, #54=true, #55=true
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



Frame 877 (+19):
  Program #85
    material: MeshStandardMaterial ''
    materialUuid: dd442653-a3b6-42f6-85a9-c7c4202698be
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: c6e1effe
  Program #86
    material: MeshStandardMaterial 'Wood'
    materialUuid: 89aca63f-cc98-4578-9f01-bac550d3eab7
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #87
    material: MeshStandardMaterial 'Green'
    materialUuid: 098d17e9-0257-423f-a5d2-49e3841a9d58
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
  Program #88
    material: MeshStandardMaterial 'Green'
    materialUuid: a76db2c4-91d7-4b27-812e-adc15fa3236a
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
  Program #89
    material: MeshStandardMaterial 'Berry'
    materialUuid: ca6fa82e-6ab9-4c11-835a-0781634312bf
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #90
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 0b295796-6e8a-4891-844a-58b466d50cc7
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #91
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 55c98ecf-05aa-41b4-a753-7ef936eb24a2
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
  Program #92
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: d0e50c23-4f76-47be-8eac-e4d2346bc5ab
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #93
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 4657c72a-ee43-4fc6-a295-d6699f6e1d14
    object: Mesh 'chunk-vegetation-region-1,0|fern-0:0'
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
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 0ee6cdab-ec18-485f-8c40-ff68dfe6e599
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389633,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: b1240858
    fragmentShaderHash: 3e4cebff
  Program #95
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 18d61407-ac2b-418d-96f2-fc13c3cd756c
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ea63cc7c
    fragmentShaderHash: d6a943a2
  Program #96
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 81f2bbf9-7bab-4846-bc2f-cb2c9ddc9c35
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #97
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 799de572-5168-42c1-945d-b8fba5c1325f
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 806bd7f3
    fragmentShaderHash: 726a0794
  Program #98
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: d42bd692-3673-467e-b6e3-9650d32a5f68
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521955,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 992406d3
    fragmentShaderHash: 2c6b8f53
  Program #99
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6a799d09-f2a6-496b-b67b-2c0da472856f
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8391680,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5935d4f4
    fragmentShaderHash: 242d6451
  Program #100
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: ea7ecb4d-b1f0-4609-8146-18583e358cf0
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388608,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 710f60b5
    fragmentShaderHash: 9148a446
  Program #101
    material: MeshStandardMaterial ''
    materialUuid: 31d4f6a7-af7f-4396-b203-bde73e3239f1
    object: Mesh 'settlement-house-chests-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519687,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d7607dd2
    fragmentShaderHash: 83e94369
  Program #102
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #103
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: 3bb93d47-35b8-40bf-9740-3a8c4e1b3b75
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 1133 (+22):
  Program #108
    material: ShaderMaterial 'SkyShader'
    materialUuid: e6f36034-23ee-4970-8369-e0b9a0990195
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: bb964b00
  Program #109
    material: ShaderMaterial ''
    materialUuid: f4baf742-6f4e-4eef-a76d-5998cc807403
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 3f71df04
    fragmentShaderHash: 133a5fd6
  Program #110
    material: MeshStandardMaterial ''
    materialUuid: dd442653-a3b6-42f6-85a9-c7c4202698be
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v8
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 112ce173
  Program #111
    material: MeshStandardMaterial 'Wood'
    materialUuid: 89aca63f-cc98-4578-9f01-bac550d3eab7
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #112
    material: MeshStandardMaterial 'Green'
    materialUuid: 098d17e9-0257-423f-a5d2-49e3841a9d58
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
  Program #113
    material: MeshStandardMaterial 'Green'
    materialUuid: a76db2c4-91d7-4b27-812e-adc15fa3236a
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
  Program #114
    material: MeshStandardMaterial 'Berry'
    materialUuid: ca6fa82e-6ab9-4c11-835a-0781634312bf
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #115
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: 0b295796-6e8a-4891-844a-58b466d50cc7
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #116
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 55c98ecf-05aa-41b4-a753-7ef936eb24a2
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
  Program #117
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: d0e50c23-4f76-47be-8eac-e4d2346bc5ab
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #118
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 4657c72a-ee43-4fc6-a295-d6699f6e1d14
    object: Mesh 'chunk-vegetation-region-1,0|fern-0:0'
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
  Program #119
    material: MeshStandardMaterial 'stockpiles_vc'
    materialUuid: 0ee6cdab-ec18-485f-8c40-ff68dfe6e599
    object: Mesh 'settlement-wood-primary:Pile_05'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389633,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: a64d124e
    fragmentShaderHash: 708cd00
  Program #120
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 18d61407-ac2b-418d-96f2-fc13c3cd756c
    object: SkinnedMesh 'Male_Peasant_Arms_2'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 20daccfa
    fragmentShaderHash: 462f06fb
  Program #121
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: 799de572-5168-42c1-945d-b8fba5c1325f
    object: SkinnedMesh 'Eyes'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1dcbc6ff
    fragmentShaderHash: 4ae95805
  Program #122
    material: MeshStandardMaterial 'MI_Peasant'
    materialUuid: d42bd692-3673-467e-b6e3-9650d32a5f68
    object: SkinnedMesh 'Male_Peasant_Arms_1'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,1,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522979,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 842fe1df
    fragmentShaderHash: 5b4c15e4
  Program #123
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: 6a799d09-f2a6-496b-b67b-2c0da472856f
    object: SkinnedMesh 'Eyebrows'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8391680,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: ac268392
    fragmentShaderHash: 7e30a042
  Program #124
    material: MeshStandardMaterial 'MI_Hair_1'
    materialUuid: ea7ecb4d-b1f0-4609-8146-18583e358cf0
    object: SkinnedMesh 'HAIR_Parted'
    asset: /assets/characters/Male_Peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 1c179521
    fragmentShaderHash: 19f05a0f
  Program #125
    material: ShaderMaterial ''
    materialUuid: 4e887dbb-7118-4ff3-96de-2a0d93005153
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #126
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 10,11,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #127
    material: MeshBasicMaterial ''
    materialUuid: 7e159538-5ef7-4cbb-b26b-fc84e06561da
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: basic,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,0,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efaf074
    fragmentShaderHash: eddf6fa7
  Program #128
    material: ShaderMaterial ''
    materialUuid: e4578200-b2d1-45e7-8de7-8d75b80cef2a
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #129
    material: ShaderMaterial ''
    materialUuid: 41b6e9ff-d8aa-4e73-9eb4-b3bc29ffd635
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
Excluded — no reliable per-program timing: 121 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 5
  #74
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 287.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 75
  #75
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 130.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 76
  #76
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 116.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 77
  #77
      material: MeshStandardMaterial 'Pond_Pack_MAT'
      object: Mesh 'Branch_2b'
      asset: /models/items/branch.glb
      compile/link: 150.1 ms  (upper bound — whole mirror-render call, see note above)

Frame 87
  #80
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 152.0 ms  (upper bound — whole mirror-render call, see note above)

Frame 95
  #81
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 294.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 98
  #82
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,-1|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 151.5 ms  (upper bound — whole postprocess-render call, see note above)

Frame 113
  #83
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 175.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 205
  #84
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 133.5 ms  (upper bound — whole mirror-render call, see note above)

Summary:
  total measured compile/link time: 1591.7 ms
  programs >1 ms: 9
  max: 294.7 ms (#81)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.1 ms  p95=10.9 ms  max=11.4 ms  Δavg vs baseline=—
  hide-grass           avg=9.0 ms  p95=10.3 ms  max=11.0 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=8.1 ms  p95=9.2 ms  max=9.7 ms  Δavg vs baseline=-1.1 ms (-12%)
  no vegetation/grass  avg=8.0 ms  p95=9.5 ms  max=9.8 ms  Δavg vs baseline=-1.1 ms (-12%)
  hide-environment     avg=9.3 ms  p95=11.4 ms  max=12.7 ms  Δavg vs baseline=+0.2 ms (+2%)
  hide-settlement      avg=8.4 ms  p95=10.0 ms  max=10.4 ms  Δavg vs baseline=-0.7 ms (-7%)
  no water             avg=8.9 ms  p95=10.2 ms  max=10.7 ms  Δavg vs baseline=-0.3 ms (-3%)
  hide-terrain         avg=9.3 ms  p95=11.1 ms  max=11.5 ms  Δavg vs baseline=+0.2 ms (+2%)
  hide-npc-fauna       avg=7.3 ms  p95=8.8 ms  max=10.0 ms  Δavg vs baseline=-1.8 ms (-20%)
  no-shadows           avg=9.0 ms  p95=10.1 ms  max=10.4 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-ao                avg=8.9 ms  p95=10.4 ms  max=10.9 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-bloom             avg=8.6 ms  p95=10.4 ms  max=11.6 ms  Δavg vs baseline=-0.5 ms (-5%)
  no-smaa              avg=9.0 ms  p95=10.5 ms  max=11.3 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-god-rays          avg=9.0 ms  p95=10.2 ms  max=11.0 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-film-grade        avg=8.7 ms  p95=10.8 ms  max=11.1 ms  Δavg vs baseline=-0.4 ms (-5%)
  no postprocessing    avg=8.5 ms  p95=10.2 ms  max=10.8 ms  Δavg vs baseline=-0.6 ms (-6%)
  no mirrors           avg=9.1 ms  p95=10.9 ms  max=11.2 ms  Δavg vs baseline=+0.0 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=29.1 ms  p95=34.6 ms  max=34.9 ms
  CPU wall      avg=9.1 ms  p95=10.9 ms  max=11.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=6 sync ms total=270.8 max=67.3 store hits=0 prefetched=0
