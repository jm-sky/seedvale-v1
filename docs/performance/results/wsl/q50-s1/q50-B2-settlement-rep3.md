# Seedvale Performance Benchmark Report

> Generated: 2026-11-01T07:32:05.962Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement
Duration: 30s
Frames: 269
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: caab7ae2d9e449f3a7f6ac893a26f689386d892e
  runId: 2026-11-01T07-30-15-182Z-r17spb
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
  camera: pos=(-8.1, 11.7, -0.3)
  anchor: (-8.1, -11.5)
  populationGate: stable waited=5089ms npc=24
  gpuTimer: available=true resolved=true samples=268 span=postprocess+labels

FPS:
  avg: 31.6
  min: 1
  p1: 15

Frame time (wall-clock):
  avg: 31.6 ms
  p50: 27 ms
  p95: 31.5 ms
  p99: 66.3 ms
  max: 1172.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.4 p95=8.4 p99=34.8 max=104.5 n=269
  render: p50=21.1 p95=25.1 p99=28.1 max=1166.3 n=269
  frame: p50=27 p95=31.5 p99=66.3 max=1172.4 n=269

Rendering (combined renderer.info):
  draw calls: 1797 avg / 2125 max
  triangles: 10.25M avg
  mirror draws: 324 avg
  geometries: 677
  textures: 322

Pass submissions (actual):
  reliability: observed
  frames: 271 shadowRefresh=271 shadowSkipped=0
  mirror calls avg: 324
  shadow calls avg: 489
  main calls avg: 984

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.22M meshes=72 inst=549991
  vegetation       draws=103 tris=271.1k meshes=103 inst=187
  environment      draws=47 tris=18.7k meshes=47 inst=47
  settlement       draws=693 tris=865.8k meshes=693 inst=2109
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=241 tris=96.1k meshes=241 inst=241
  items            draws=261 tris=31.7k meshes=261 inst=261
  other            draws=424 tris=28.6k meshes=424 inst=424

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=101 tris=264.3k meshes=101 inst=185
  environment      draws=47 tris=18.7k meshes=47 inst=47
  settlement       draws=452 tris=621.2k meshes=452 inst=1763
  npc              draws=75 tris=98.4k meshes=75 inst=75
  fauna            draws=61 tris=21.7k meshes=61 inst=61
  items            draws=43 tris=26.0k meshes=43 inst=43
  other            draws=111 tris=14.5k meshes=111 inst=111

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=89 tris=109.4k meshes=89 inst=816
  houseInteractive draws=34 tris=5.3k meshes=34 inst=34
  fence            draws=4 tris=6.5k meshes=4 inst=32
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
  decor            draws=199 tris=380.6k meshes=199 inst=302
  other            draws=35 tris=77.3k meshes=35 inst=409

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=111 tris=135.1k skinned=111/111
      Farmer           agents=4 draws=35 tris=51.7k skinned=35/35
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      mid  agents=8 camera-relevant=3 draws=75 tris=98.4k
      far  agents=16 camera-relevant=9 draws=148 tris=190.7k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      dog              agents=6 draws=33 tris=11.6k skinned=33/33
      horse            agents=4 draws=32 tris=8.7k skinned=32/32
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      wolf             agents=6 draws=24 tris=11.8k skinned=24/24
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=6 draws=6 tris=4.0k skinned=6/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=2 camera-relevant=2 draws=10 tris=2.8k
      mid  agents=12 camera-relevant=8 draws=51 tris=18.9k
      far  agents=47 camera-relevant=14 draws=180 tris=74.4k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=126 composed=126 multiplied=126 skinned=0
  environment              nodes=69 composed=69 multiplied=69 skinned=0
  settlement               nodes=1394 composed=1394 multiplied=1394 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2557 composed=2557 multiplied=2557 skinned=206
  items                    nodes=399 composed=399 multiplied=399 skinned=0
  other                    nodes=686 composed=669 multiplied=686 skinned=9
  top scene children:
    fauna ×61                nodes=2557 composed=2557 multiplied=2557 skinned=206
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1394 composed=1394 multiplied=1394 skinned=0
    Group ×82                nodes=518 composed=518 multiplied=518 skinned=9
    chunk-items ×26          nodes=366 composed=366 multiplied=366 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×33             nodes=33 composed=33 multiplied=33 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0
    chunk-environmen ×3      nodes=22 composed=22 multiplied=22 skinned=0

Systems:
  WATER          3.2 ms
  NPC            2.6 ms
  FAUNA          2.3 ms
  PHYSICS        0.1 ms
  RENDER         21.5 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=17.5 ms draws=1801 tris=10.24M
  hide-grass         render=16.1 ms draws=1751 tris=5.23M
  hide-vegetation    render=15.8 ms draws=1777 tris=10.17M
  hide-vegetation-grass render=15.6 ms draws=1740 tris=5.16M
  hide-environment   render=16.2 ms draws=1787 tris=10.23M
  hide-settlement    render=11.3 ms draws=914 tris=9.06M
  hide-water         render=16.9 ms draws=1802 tris=10.09M
  hide-terrain       render=16.0 ms draws=1759 tris=6.78M
  hide-npc-fauna     render=11.1 ms draws=1460 tris=9.94M
  no-shadows         render=12.1 ms draws=1343 tris=8.73M
  no-ao              render=17.2 ms draws=1799 tris=10.24M
  no-bloom           render=17.3 ms draws=1792 tris=10.24M
  no-smaa            render=17.6 ms draws=1802 tris=10.24M
  no-god-rays        render=17.9 ms draws=1804 tris=10.24M
  no-film-grade      render=18.2 ms draws=1799 tris=10.24M
  no-postprocessing  render=17.0 ms draws=1774 tris=10.24M
  no-reflections     render=16.3 ms draws=1463 tris=9.39M

Frame attribution:
  frame max: 1172.4 ms
  largest labelled hitch: 0 ms
  unattributed: 1172.4 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 1172.4 ms

Raw sidecar:
  sampling=full factor=1 exported=269/269

Recommendation:
Largest frame (1172.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.6 ms/frame
  crowd pass: 0.0 ms/frame (2.3 ms cumulative)
  agent updates: 1.4 ms/frame (363.8 ms cumulative)
  livestock: 0.9 ms/frame (248.9 ms cumulative)
    loaded tick: 0.9 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.9 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.5 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (36.3 predator candidates/frame)
    pest scans: 4.0/frame (4.0 rat candidates/frame)
    nearest scans: 20.1/frame (0.0 candidates/frame)
    water samples: 54.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 54.9/frame, 0.10 ms/frame (worst call 0.10 ms, 9528.2 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 27.2
    behaviour executions/frame: 20.1
    presentation executions/frame: 20.1
  rats: 0.2 ms/frame (49.0 ms cumulative)
  social: 0.0 ms/frame (1.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (40.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.3 ms/frame
  agent updates: 2.2 ms/frame (601.8 ms cumulative)
  forest sampling: 0.1 ms/frame (21.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (5.9 ms cumulative)
    targeting: 0.0 ms/frame (4.4 ms cumulative)
    decision: 0.0 ms/frame (3.5 ms cumulative)
    behaviour: 1.6 ms/frame (438.9 ms cumulative)
    life/presentation: 0.3 ms/frame (93.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.1
    full-rate agents/frame: 6.9
    reduced-cadence agents/frame: 23.3
    behaviour executions/frame: 19.1
    presentation executions/frame: 19.0

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 588.4
    player perception checks/frame: 30.2

  nearest scans: 26.3/frame (7086 calls)
  nearest candidates checked: 250.1/frame (67280 total)
  herd leader scans: 0.2/frame (62 calls)
  herd candidates checked: 6.9/frame (1860 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.1/frame (167.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 111.4/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 111.4/frame, 0.10 ms/frame (worst call 1.40 ms, 20546.4 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=321136 filler=614615
Submitted instances: full=260618 filler=289373
Meshes submitted: 72
LOD submitted fraction: full=0.811550246624483 filler=0.470819944192706
Flowers: unavailable
Allocation bytes (estimated): 89832096
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 271
Shadow refresh frames: 271
Shadow skipped frames: 0

Mirror:
  calls avg: 324  tris avg: 858038
  info calls avg: 324  residual calls avg: 0
  switches avg: material=110.9 program=56.2  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=436
  other                        calls=109 tris=5815
  settlement:decor             calls=48 tris=112344
  settlement:fence             calls=2 tris=3244
  settlement:fireCampfire      calls=4 tris=310
  settlement:fireHouseExteriorLamp calls=12 tris=578
  settlement:fireHouseInteriorLamp calls=4 tris=434
  settlement:fireVillageTorch  calls=13 tris=897
  settlement:houseInteractive  calls=14 tris=1490
  settlement:houseStatic       calls=33 tris=43395
  settlement:landmarkGarden    calls=3 tris=35205
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=938
  settlement:landmarkWellHousehold calls=3 tris=2815
  settlement:landmarkWellPasture calls=3 tris=938
  settlement:other             calls=9 tris=30330
  settlement:storageBarrel     calls=6 tris=10418
  settlement:storageContainer  calls=9 tris=1975
  settlement:storageGoods      calls=30 tris=5665
  settlement:storageHay        calls=1 tris=245
  settlement:storageTrough     calls=3 tris=1204
  settlement:storageWoodHousehold calls=1 tris=4306
  settlement:storageWoodSettlementPrimary calls=1 tris=783
  settlement:workplace         calls=5 tris=2045
  terrain                      calls=8 tris=591723
  vegetation                   calls=2 tris=678

Shadow (refresh only):
  calls avg: 489  tris avg: 1519894
  info calls avg: 489  residual calls avg: 0
  switches avg: material=121 program=146.4  actor: calls=135.9 material=0 program=16.7
  skinning avg: skinned calls=129.9 skeletons first used=34.9
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=7 tris=2137
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=3620
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=73 tris=13371
  settlement:decor             calls=176 tris=333489
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=11 tris=32488
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=12 tris=884452
  vegetation                   calls=5 tris=67348

Main:
  calls avg: 984  tris avg: 7867695
  info calls avg: 1473  residual calls avg: 0
  switches avg: material=390.6 program=189  actor: calls=200.4 material=128.6 program=61
  skinning avg: skinned calls=188.4 skeletons first used=28.1
  environment                  calls=15 tris=9047
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=20 tris=2592
  faunaFamily:deer             calls=3 tris=810
  faunaFamily:dog              calls=22 tris=7572
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=11 tris=3453
  faunaFamily:wolf             calls=16 tris=7848
  grass                        calls=43 tris=5012082
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=264 tris=21051
  settlement:decor             calls=86 tris=194539
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=24 tris=1152
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:fireVillageTorch  calls=30 tris=2146
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=86470
  settlement:landmarkGarden    calls=6 tris=70152
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=5 tris=5610
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=20 tris=60496
  settlement:storageBarrel     calls=12 tris=20760
  settlement:storageContainer  calls=18 tris=3936
  settlement:storageGoods      calls=59 tris=11288
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=6 tris=2400
  settlement:storageWoodHousehold calls=2 tris=8580
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=15 tris=7358
  terrain                      calls=27 tris=1989848
  vegetation                   calls=10 tris=3574
  water                        calls=3 tris=155648


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 3
Shown: 3 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 3 shown, 3 total):

[LONG FRAME] 1172.4ms
simulate         5.7ms
render        1166.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.5ms
FAUNA            1.4ms
PHYSICS          0.1ms
RENDER        1166.3ms
OTHER            2.0ms

Long frame #2:

[LONG FRAME] 119.9ms
simulate       104.5ms
render          15.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.7ms
FAUNA          100.0ms
PHYSICS          0.1ms
RENDER          15.1ms
OTHER            2.0ms

Long frame #3:

[LONG FRAME] 83.4ms
simulate        70.6ms
render          12.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.6ms
FAUNA           65.8ms
PHYSICS          0.2ms
RENDER          12.5ms
OTHER            2.2ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=17.5 ms  p95=21.7 ms  max=23.8 ms  Δavg vs baseline=—
  hide-grass           avg=16.1 ms  p95=17.7 ms  max=20.4 ms  Δavg vs baseline=-1.4 ms (-8%)
  hide-vegetation      avg=15.8 ms  p95=18.2 ms  max=18.8 ms  Δavg vs baseline=-1.8 ms (-10%)
  no vegetation/grass  avg=15.6 ms  p95=18.5 ms  max=19.1 ms  Δavg vs baseline=-1.9 ms (-11%)
  hide-environment     avg=16.2 ms  p95=17.8 ms  max=18.0 ms  Δavg vs baseline=-1.3 ms (-7%)
  hide-settlement      avg=11.3 ms  p95=12.7 ms  max=13.1 ms  Δavg vs baseline=-6.3 ms (-36%)
  no water             avg=16.9 ms  p95=19.5 ms  max=20.4 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-terrain         avg=16.0 ms  p95=17.5 ms  max=18.2 ms  Δavg vs baseline=-1.5 ms (-9%)
  hide-npc-fauna       avg=11.1 ms  p95=13.2 ms  max=14.7 ms  Δavg vs baseline=-6.4 ms (-37%)
  no-shadows           avg=12.1 ms  p95=13.1 ms  max=13.5 ms  Δavg vs baseline=-5.5 ms (-31%)
  no-ao                avg=17.2 ms  p95=19.7 ms  max=19.9 ms  Δavg vs baseline=-0.3 ms (-2%)
  no-bloom             avg=17.3 ms  p95=20.3 ms  max=21.5 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=17.6 ms  p95=20.4 ms  max=21.0 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-god-rays          avg=17.9 ms  p95=20.0 ms  max=20.6 ms  Δavg vs baseline=+0.4 ms (+2%)
  no-film-grade        avg=18.2 ms  p95=22.1 ms  max=22.9 ms  Δavg vs baseline=+0.7 ms (+4%)
  no postprocessing    avg=17.0 ms  p95=18.8 ms  max=24.6 ms  Δavg vs baseline=-0.5 ms (-3%)
  no mirrors           avg=16.3 ms  p95=17.7 ms  max=18.5 ms  Δavg vs baseline=-1.2 ms (-7%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=47.0 ms  p95=51.4 ms  max=51.5 ms
  CPU wall      avg=17.5 ms  p95=21.7 ms  max=23.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
