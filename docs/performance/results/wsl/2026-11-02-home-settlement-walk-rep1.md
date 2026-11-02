# Seedvale Performance Benchmark Report

> Generated: 2026-11-02T15:26:44.816Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-walk
Duration: 30s
Frames: 210
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a05ea60dc0ccd87ab39b4bb8b06b9d08f5b8678e
  runId: 2026-11-02T15-24-35-473Z-i4w0rh
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
  camera: pos=(-0.9, 10.3, 10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=3 m/s duration=30s
  populationGate: stable waited=5109ms npc=24
  gpuTimer: available=true resolved=true samples=208 span=postprocess+labels

FPS:
  avg: 17.4
  min: 1
  p1: 4

Frame time (wall-clock):
  avg: 57.5 ms
  p50: 40.5 ms
  p95: 137.5 ms
  p99: 282.2 ms
  max: 1168.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=9.4 p95=17.3 p99=60.3 max=96 n=210
  render: p50=30.1 p95=126.8 p99=269.6 max=1157.1 n=210
  frame: p50=40.5 p95=137.5 p99=282.2 max=1168.7 n=210

Rendering (combined renderer.info):
  draw calls: 1756 avg / 2379 max
  triangles: 10.65M avg
  mirror draws: 295 avg
  geometries: 947
  textures: 410

Pass submissions (actual):
  reliability: observed
  frames: 211 shadowRefresh=204 shadowSkipped=7
  mirror calls avg: 294
  shadow calls avg: 497
  main calls avg: 980

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.87M meshes=72 inst=583858
  vegetation       draws=100 tris=267.0k meshes=100 inst=178
  environment      draws=44 tris=17.0k meshes=44 inst=44
  settlement       draws=716 tris=905.3k meshes=716 inst=1992
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=225 tris=290.2k meshes=225 inst=225
  fauna            draws=243 tris=96.7k meshes=243 inst=243
  items            draws=158 tris=17.4k meshes=158 inst=158
  other            draws=392 tris=28.3k meshes=392 inst=392

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=98 tris=260.1k meshes=98 inst=176
  environment      draws=44 tris=17.0k meshes=44 inst=44
  settlement       draws=472 tris=659.6k meshes=472 inst=1643
  npc              draws=68 tris=86.4k meshes=68 inst=68
  fauna            draws=48 tris=14.4k meshes=48 inst=48
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=105 tris=14.4k meshes=105 inst=105

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=89 tris=109.4k meshes=89 inst=816
  houseInteractive draws=34 tris=5.3k meshes=34 inst=34
  fence            draws=8 tris=7.7k meshes=8 inst=38
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=10.9k meshes=3 inst=14
  storageContainer draws=18 tris=4.6k meshes=18 inst=62
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=3.0k meshes=8 inst=30
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=4.0k meshes=3 inst=5
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=14 tris=1.5k meshes=14 inst=14
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=215 tris=443.2k meshes=215 inst=302
  other            draws=35 tris=51.8k meshes=35 inst=283

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=111 tris=135.1k skinned=111/111
      Farmer           agents=4 draws=36 tris=52.6k skinned=36/36
      Knight_Cloth     agents=3 draws=28 tris=36.6k skinned=28/28
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      Ranger_NoHood    agents=1 draws=14 tris=16.3k skinned=14/14
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=8 tris=10.9k skinned=8/8
    by distance band:
      near agents=3 camera-relevant=2 draws=26 tris=36.2k
      mid  agents=4 camera-relevant=4 draws=42 tris=50.2k
      far  agents=17 camera-relevant=10 draws=157 tris=203.8k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      dog              agents=6 draws=33 tris=11.6k skinned=33/33
      horse            agents=4 draws=32 tris=8.7k skinned=32/32
      wolf             agents=7 draws=28 tris=13.7k skinned=28/28
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=1 camera-relevant=0 draws=5 tris=1.9k
      mid  agents=9 camera-relevant=8 draws=43 tris=12.4k
      far  agents=50 camera-relevant=23 draws=195 tris=82.3k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=122 composed=122 multiplied=122 skinned=0
  environment              nodes=65 composed=65 multiplied=65 skinned=0
  settlement               nodes=1472 composed=1472 multiplied=1472 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1880 composed=1880 multiplied=1880 skinned=225
  fauna                    nodes=2562 composed=2562 multiplied=2562 skinned=208
  items                    nodes=247 composed=247 multiplied=247 skinned=0
  other                    nodes=641 composed=624 multiplied=641 skinned=9
  top scene children:
    fauna ×60                nodes=2562 composed=2562 multiplied=2562 skinned=208
    npc ×24                  nodes=1880 composed=1880 multiplied=1880 skinned=225
    settlement ×3            nodes=1472 composed=1472 multiplied=1472 skinned=0
    Group ×74                nodes=478 composed=478 multiplied=478 skinned=9
    chunk-items ×20          nodes=247 composed=247 multiplied=247 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0
    chunk-environmen ×3      nodes=22 composed=22 multiplied=22 skinned=0

Systems:
  WATER          5.0 ms
  NPC            3.9 ms
  FAUNA          2.8 ms
  PHYSICS        0.2 ms
  RENDER         40.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=30.0 ms draws=1717 tris=9.99M
  hide-grass         render=27.6 ms draws=1672 tris=4.34M
  hide-vegetation    render=27.1 ms draws=1701 tris=9.89M
  hide-vegetation-grass render=24.9 ms draws=1657 tris=4.25M
  hide-environment   render=24.5 ms draws=1700 tris=9.98M
  hide-settlement    render=13.5 ms draws=850 tris=8.87M
  hide-water         render=23.8 ms draws=1708 tris=9.83M
  hide-terrain       render=23.9 ms draws=1673 tris=7.37M
  hide-npc-fauna     render=12.6 ms draws=1365 tris=9.68M
  no-shadows         render=16.3 ms draws=1478 tris=9.11M
  no-ao              render=26.3 ms draws=1706 tris=9.99M
  no-bloom           render=23.4 ms draws=1694 tris=9.99M
  no-smaa            render=25.4 ms draws=1707 tris=9.99M
  no-god-rays        render=25.5 ms draws=1711 tris=9.99M
  no-film-grade      render=24.2 ms draws=1712 tris=9.99M
  no-postprocessing  render=25.6 ms draws=1687 tris=9.99M
  no-reflections     render=20.8 ms draws=1364 tris=9.20M

Frame attribution:
  frame max: 1168.7 ms
  largest labelled hitch: 0 ms
  unattributed: 1168.7 ms

Long frames:
  threshold: 80 ms
  count: 15
  worst: 1168.7 ms

Raw sidecar:
  sampling=full factor=1 exported=210/210

Recommendation:
Largest frame (1168.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 29

NPC:
  total: 3.9 ms/frame
  crowd pass: 0.0 ms/frame (3.7 ms cumulative)
  agent updates: 1.8 ms/frame (376.1 ms cumulative)
  livestock: 1.5 ms/frame (320.8 ms cumulative)
    loaded tick: 1.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 28.1
    unique animals/frame: 27.1
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (42.2 predator candidates/frame)
    pest scans: 4.0/frame (4.0 rat candidates/frame)
    nearest scans: 19.4/frame (0.0 candidates/frame)
    water samples: 49.0/frame, 0.10 ms/frame (worst call 0.20 ms)
    collider queries: 49.0/frame, 0.10 ms/frame (worst call 0.10 ms, 7438.7 colliders/frame)
    full-rate agents/frame: 1.3
    reduced-cadence agents/frame: 26.8
    behaviour executions/frame: 19.7
    presentation executions/frame: 19.6
  rats: 0.3 ms/frame (61.4 ms cumulative)
  social: 0.0 ms/frame (4.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (52.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.8 ms/frame
  agent updates: 2.7 ms/frame (560.0 ms cumulative)
  forest sampling: 0.1 ms/frame (30.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.5 ms cumulative)
    targeting: 0.0 ms/frame (5.0 ms cumulative)
    decision: 0.0 ms/frame (5.1 ms cumulative)
    behaviour: 1.7 ms/frame (358.7 ms cumulative)
    life/presentation: 0.5 ms/frame (114.0 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 29.1
    sensing passes/frame: 29.1
    decision passes/frame: 29.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.4
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 21.5
    behaviour executions/frame: 18.4
    presentation executions/frame: 18.3

  sensing/cache:
    forest samples/frame: 29.1
    fire scan candidates/frame: 29.1
    village scan candidates/frame: 445.2
    player perception checks/frame: 29.1

  nearest scans: 24.3/frame (5106 calls)
  nearest candidates checked: 224.1/frame (47062 total)
  herd leader scans: 0.1/frame (31 calls)
  herd candidates checked: 4.3/frame (899 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.5/frame (185.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 120.6/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 120.6/frame, 0.20 ms/frame (worst call 1.50 ms, 20745.7 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=330419 filler=631233
Submitted instances: full=270893 filler=312965
Meshes submitted: 72
LOD submitted fraction: full=0.8198469216358624 filler=0.4957994908377731
Flowers: unavailable
Allocation bytes (estimated): 92318592
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 211
Shadow refresh frames: 204
Shadow skipped frames: 7

Mirror:
  calls avg: 294  tris avg: 694975
  info calls avg: 294  residual calls avg: 0
  switches avg: material=104.3 program=60.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2.3 skeletons first used=2.3
  environment                  calls=1 tris=614
  other                        calls=91 tris=5052
  settlement:decor             calls=33 tris=89253
  settlement:fence             calls=3 tris=2527
  settlement:fireCampfire      calls=2 tris=184
  settlement:fireHouseExteriorLamp calls=11 tris=523
  settlement:fireHouseInteriorLamp calls=4 tris=393
  settlement:fireVillageTorch  calls=14 tris=1025
  settlement:houseInteractive  calls=13 tris=1474
  settlement:houseStatic       calls=32 tris=40386
  settlement:landmarkGarden    calls=3 tris=32362
  settlement:landmarkNoticeBoard calls=1 tris=27
  settlement:landmarkWellCentral calls=4 tris=1421
  settlement:landmarkWellHousehold calls=4 tris=3543
  settlement:landmarkWellPasture calls=2 tris=567
  settlement:other             calls=10 tris=18807
  settlement:storageBarrel     calls=6 tris=9367
  settlement:storageContainer  calls=9 tris=1785
  settlement:storageGoods      calls=30 tris=5768
  settlement:storageHay        calls=1 tris=264
  settlement:storageTrough     calls=3 tris=1081
  settlement:storageWoodHousehold calls=1 tris=3978
  settlement:storageWoodSettlementPrimary calls=1 tris=658
  settlement:workplace         calls=5 tris=2200
  terrain                      calls=6 tris=442166
  vegetation                   calls=7 tris=29744

Shadow (refresh only):
  calls avg: 497  tris avg: 1589580
  info calls avg: 497  residual calls avg: 0
  switches avg: material=137.1 program=161.1  actor: calls=123.5 material=0 program=16.7
  skinning avg: skinned calls=117.5 skeletons first used=26.2
  environment                  calls=0 tris=319
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=6 tris=2222
  faunaFamily:dog              calls=9 tris=3605
  faunaFamily:horse            calls=13 tris=3412
  faunaFamily:rabbit           calls=0 tris=50
  faunaFamily:rat              calls=1 tris=2767
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=7 tris=2177
  npcFamily:Farmer             calls=17 tris=25060
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21844
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=15787
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=67 tris=13211
  settlement:decor             calls=197 tris=417938
  settlement:fence             calls=2 tris=1616
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=11 tris=21982
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=12 tris=882011
  vegetation                   calls=8 tris=69094

Main:
  calls avg: 980  tris avg: 8412861
  info calls avg: 1462  residual calls avg: 0
  switches avg: material=422 program=199.1  actor: calls=226.4 material=145.1 program=63.2
  skinning avg: skinned calls=219.3 skeletons first used=33.5
  environment                  calls=17 tris=7309
  faunaFamily:bear             calls=3 tris=1884
  faunaFamily:chicken          calls=15 tris=1931
  faunaFamily:cow              calls=5 tris=1678
  faunaFamily:deer             calls=21 tris=6484
  faunaFamily:dog              calls=15 tris=5131
  faunaFamily:duck             calls=1 tris=28
  faunaFamily:horse            calls=13 tris=3576
  faunaFamily:rat              calls=4 tris=7432
  faunaFamily:rooster          calls=0 tris=557
  faunaFamily:sheep            calls=11 tris=3336
  faunaFamily:wolf             calls=16 tris=7709
  grass                        calls=41 tris=5761673
  items                        calls=33 tris=4480
  npcFamily:Farmer             calls=19 tris=28464
  npcFamily:Knight_Cloth       calls=17 tris=21768
  npcFamily:Peasant            calls=58 tris=70356
  npcFamily:Peasant_Boots      calls=8 tris=11527
  npcFamily:Ranger_NoHood      calls=12 tris=14030
  npcFamily:blacksmith         calls=6 tris=8659
  npcFamily:woodcutter         calls=3 tris=3756
  other                        calls=233 tris=18736
  settlement:decor             calls=64 tris=175564
  settlement:fence             calls=5 tris=5041
  settlement:fireCampfire      calls=5 tris=374
  settlement:fireHouseExteriorLamp calls=23 tris=1092
  settlement:fireHouseInteriorLamp calls=7 tris=797
  settlement:fireVillageTorch  calls=30 tris=2132
  settlement:houseInteractive  calls=28 tris=3104
  settlement:houseStatic       calls=63 tris=80380
  settlement:landmarkGarden    calls=8 tris=78599
  settlement:landmarkNoticeBoard calls=3 tris=59
  settlement:landmarkWellCentral calls=9 tris=3193
  settlement:landmarkWellHousehold calls=9 tris=7268
  settlement:landmarkWellPasture calls=3 tris=1143
  settlement:other             calls=20 tris=37819
  settlement:storageBarrel     calls=12 tris=19501
  settlement:storageContainer  calls=17 tris=3622
  settlement:storageGoods      calls=60 tris=11701
  settlement:storageHay        calls=1 tris=661
  settlement:storageTrough     calls=5 tris=2173
  settlement:storageWoodHousehold calls=2 tris=7996
  settlement:storageWoodSettlementPrimary calls=2 tris=1486
  settlement:workplace         calls=10 tris=5078
  terrain                      calls=23 tris=1713712
  vegetation                   calls=16 tris=58481
  water                        calls=4 tris=201772


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 15
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 15 total):

[LONG FRAME] 1168.7ms
simulate        11.2ms
render        1157.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           11.2ms
STREAMING        0.0ms
NPC              3.9ms
FAUNA            2.0ms
PHYSICS          0.1ms
RENDER        1146.0ms
OTHER            5.5ms

Long frame #2:

[LONG FRAME] 327.2ms
simulate        12.4ms
render         314.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.2ms
STREAMING        0.0ms
NPC              6.1ms
FAUNA            1.2ms
PHYSICS          0.2ms
RENDER         308.3ms
OTHER            5.2ms

Long frame #3:

[LONG FRAME] 282.4ms
simulate        26.8ms
render         254.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              9.7ms
FAUNA            5.2ms
PHYSICS          0.2ms
RENDER         254.6ms
OTHER           12.4ms

Long frame #4:

[LONG FRAME] 280.3ms
simulate         9.0ms
render         270.8ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.3ms
STREAMING        0.0ms
NPC              2.7ms
FAUNA            1.5ms
PHYSICS          0.1ms
RENDER         264.5ms
OTHER            5.1ms

Long frame #5:

[LONG FRAME] 264.7ms
simulate         7.0ms
render         257.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.5ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA            0.8ms
PHYSICS          0.2ms
RENDER         249.0ms
OTHER            3.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=30.0 ms  p95=49.6 ms  max=77.4 ms  Δavg vs baseline=—
  hide-grass           avg=27.6 ms  p95=36.8 ms  max=43.8 ms  Δavg vs baseline=-2.4 ms (-8%)
  hide-vegetation      avg=27.1 ms  p95=40.3 ms  max=80.5 ms  Δavg vs baseline=-2.9 ms (-10%)
  no vegetation/grass  avg=24.9 ms  p95=34.0 ms  max=72.0 ms  Δavg vs baseline=-5.1 ms (-17%)
  hide-environment     avg=24.5 ms  p95=35.3 ms  max=36.7 ms  Δavg vs baseline=-5.5 ms (-18%)
  hide-settlement      avg=13.5 ms  p95=15.9 ms  max=16.5 ms  Δavg vs baseline=-16.5 ms (-55%)
  no water             avg=23.8 ms  p95=43.2 ms  max=44.8 ms  Δavg vs baseline=-6.2 ms (-21%)
  hide-terrain         avg=23.9 ms  p95=35.0 ms  max=37.1 ms  Δavg vs baseline=-6.1 ms (-20%)
  hide-npc-fauna       avg=12.6 ms  p95=15.3 ms  max=20.7 ms  Δavg vs baseline=-17.4 ms (-58%)
  no-shadows           avg=16.3 ms  p95=19.9 ms  max=22.3 ms  Δavg vs baseline=-13.7 ms (-46%)
  no-ao                avg=26.3 ms  p95=42.3 ms  max=44.6 ms  Δavg vs baseline=-3.7 ms (-12%)
  no-bloom             avg=23.4 ms  p95=36.0 ms  max=38.5 ms  Δavg vs baseline=-6.6 ms (-22%)
  no-smaa              avg=25.4 ms  p95=38.1 ms  max=40.4 ms  Δavg vs baseline=-4.7 ms (-16%)
  no-god-rays          avg=25.5 ms  p95=45.7 ms  max=56.2 ms  Δavg vs baseline=-4.5 ms (-15%)
  no-film-grade        avg=24.2 ms  p95=40.3 ms  max=42.6 ms  Δavg vs baseline=-5.8 ms (-19%)
  no postprocessing    avg=25.6 ms  p95=57.8 ms  max=78.4 ms  Δavg vs baseline=-4.4 ms (-15%)
  no mirrors           avg=20.8 ms  p95=26.2 ms  max=31.1 ms  Δavg vs baseline=-9.2 ms (-31%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=59.2 ms  p95=72.4 ms  max=72.7 ms
  CPU wall      avg=30.0 ms  p95=49.6 ms  max=77.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
