# Seedvale Performance Benchmark Report

> Generated: 2026-11-01T08:09:40.039Z
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
Frames: 305
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a7c2852c84647366a278187efd01c59eb0baf944
  runId: 2026-11-01T08-07-57-316Z-yb6h04
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
  gpuTimer: available=true resolved=true samples=304 span=postprocess+labels

FPS:
  avg: 40.3
  min: 7
  p1: 23

Frame time (wall-clock):
  avg: 24.8 ms
  p50: 25.9 ms
  p95: 29.4 ms
  p99: 44 ms
  max: 147.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.1 p95=8.1 p99=33.5 max=137.8 n=305
  render: p50=20.3 p95=23.7 p99=24.6 max=26.4 n=305
  frame: p50=25.9 p95=29.4 p99=44 max=147.9 n=305

Rendering (combined renderer.info):
  draw calls: 1590 avg / 2177 max
  triangles: 9.78M avg
  mirror draws: 323 avg
  geometries: 675
  textures: 321

Pass submissions (actual):
  reliability: observed
  frames: 307 shadowRefresh=154 shadowSkipped=153
  mirror calls avg: 323
  shadow calls avg: 541
  main calls avg: 983

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.22M meshes=72 inst=549991
  vegetation       draws=102 tris=263.9k meshes=102 inst=183
  environment      draws=48 tris=24.5k meshes=48 inst=48
  settlement       draws=693 tris=865.8k meshes=693 inst=2109
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=241 tris=96.1k meshes=241 inst=241
  items            draws=261 tris=31.7k meshes=261 inst=261
  other            draws=419 tris=28.6k meshes=419 inst=419

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=100 tris=257.1k meshes=100 inst=181
  environment      draws=48 tris=24.5k meshes=48 inst=48
  settlement       draws=452 tris=621.2k meshes=452 inst=1763
  npc              draws=75 tris=98.4k meshes=75 inst=75
  fauna            draws=52 tris=15.6k meshes=52 inst=52
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
      near agents=4 camera-relevant=4 draws=26 tris=5.7k
      mid  agents=8 camera-relevant=6 draws=26 tris=9.9k
      far  agents=49 camera-relevant=15 draws=189 tris=80.5k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=125 composed=125 multiplied=125 skinned=0
  environment              nodes=72 composed=72 multiplied=72 skinned=0
  settlement               nodes=1394 composed=1394 multiplied=1394 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2557 composed=2557 multiplied=2557 skinned=206
  items                    nodes=399 composed=399 multiplied=399 skinned=0
  other                    nodes=680 composed=663 multiplied=680 skinned=9
  top scene children:
    fauna ×61                nodes=2557 composed=2557 multiplied=2557 skinned=206
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1394 composed=1394 multiplied=1394 skinned=0
    Group ×81                nodes=512 composed=512 multiplied=512 skinned=9
    chunk-items ×26          nodes=366 composed=366 multiplied=366 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×33             nodes=33 composed=33 multiplied=33 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-environmen ×4      nodes=25 composed=25 multiplied=25 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          3.2 ms
  NPC            2.6 ms
  FAUNA          2.5 ms
  PHYSICS        0.1 ms
  RENDER         14.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=13.4 ms draws=1590 tris=9.77M
  hide-grass         render=13.3 ms draws=1546 tris=4.76M
  hide-vegetation    render=13.2 ms draws=1556 tris=9.68M
  hide-vegetation-grass render=13.2 ms draws=1507 tris=4.67M
  hide-environment   render=13.2 ms draws=1561 tris=9.76M
  hide-settlement    render=10.1 ms draws=817 tris=8.78M
  hide-water         render=13.8 ms draws=1577 tris=9.62M
  hide-terrain       render=13.3 ms draws=1536 tris=6.53M
  hide-npc-fauna     render=9.9 ms draws=1319 tris=9.53M
  no-shadows         render=11.6 ms draws=1328 tris=8.72M
  no-ao              render=13.3 ms draws=1582 tris=9.78M
  no-bloom           render=14.1 ms draws=1579 tris=9.78M
  no-smaa            render=13.6 ms draws=1592 tris=9.78M
  no-god-rays        render=13.6 ms draws=1596 tris=9.78M
  no-film-grade      render=13.7 ms draws=1593 tris=9.78M
  no-postprocessing  render=14.0 ms draws=1560 tris=9.77M
  no-reflections     render=14.2 ms draws=1268 tris=8.92M

Frame attribution:
  frame max: 147.9 ms
  largest labelled hitch: 0 ms
  unattributed: 147.9 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 147.9 ms

Raw sidecar:
  sampling=full factor=1 exported=305/305

Recommendation:
Largest frame (147.9 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.6 ms/frame
  crowd pass: 0.0 ms/frame (2.8 ms cumulative)
  agent updates: 1.3 ms/frame (401.6 ms cumulative)
  livestock: 0.9 ms/frame (282.2 ms cumulative)
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
    dog guard scans: 6.0/frame (36.2 predator candidates/frame)
    pest scans: 3.9/frame (3.9 rat candidates/frame)
    nearest scans: 20.1/frame (0.0 candidates/frame)
    water samples: 53.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 53.2/frame, 0.10 ms/frame (worst call 0.10 ms, 9503.3 colliders/frame)
    full-rate agents/frame: 1.1
    reduced-cadence agents/frame: 27.1
    behaviour executions/frame: 20.1
    presentation executions/frame: 20.1
  rats: 0.2 ms/frame (52.4 ms cumulative)
  social: 0.0 ms/frame (1.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (49.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.5 ms/frame
  agent updates: 2.4 ms/frame (741.5 ms cumulative)
  forest sampling: 0.1 ms/frame (24.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.8 ms cumulative)
    targeting: 0.0 ms/frame (5.1 ms cumulative)
    decision: 0.0 ms/frame (3.0 ms cumulative)
    behaviour: 1.9 ms/frame (572.8 ms cumulative)
    life/presentation: 0.3 ms/frame (100.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.6
    full-rate agents/frame: 7.0
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 18.6
    presentation executions/frame: 18.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 583.2
    player perception checks/frame: 30.2

  nearest scans: 26.6/frame (8120 calls)
  nearest candidates checked: 258.2/frame (78753 total)
  herd leader scans: 0.4/frame (114 calls)
  herd candidates checked: 11.2/frame (3420 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.0/frame (169.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 111.2/frame, 0.10 ms/frame (worst call 0.50 ms)
    collider queries: 111.2/frame, 0.10 ms/frame (worst call 1.00 ms, 21511.1 colliders/frame)

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
Frames: 307
Shadow refresh frames: 154
Shadow skipped frames: 153

Mirror:
  calls avg: 323  tris avg: 858521
  info calls avg: 323  residual calls avg: 0
  switches avg: material=110.5 program=56.7  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=435
  other                        calls=108 tris=5799
  settlement:decor             calls=49 tris=113162
  settlement:fence             calls=2 tris=3243
  settlement:fireCampfire      calls=4 tris=310
  settlement:fireHouseExteriorLamp calls=12 tris=578
  settlement:fireHouseInteriorLamp calls=4 tris=433
  settlement:fireVillageTorch  calls=13 tris=897
  settlement:houseInteractive  calls=14 tris=1490
  settlement:houseStatic       calls=33 tris=43376
  settlement:landmarkGarden    calls=3 tris=35190
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=938
  settlement:landmarkWellHousehold calls=3 tris=2814
  settlement:landmarkWellPasture calls=3 tris=938
  settlement:other             calls=9 tris=30316
  settlement:storageBarrel     calls=6 tris=10414
  settlement:storageContainer  calls=9 tris=1974
  settlement:storageGoods      calls=30 tris=5662
  settlement:storageHay        calls=1 tris=245
  settlement:storageTrough     calls=3 tris=1204
  settlement:storageWoodHousehold calls=1 tris=4304
  settlement:storageWoodSettlementPrimary calls=1 tris=783
  settlement:workplace         calls=5 tris=2044
  terrain                      calls=8 tris=591468
  vegetation                   calls=2 tris=678

Shadow (refresh only):
  calls avg: 541  tris avg: 2099818
  info calls avg: 541  residual calls avg: 0
  switches avg: material=152 program=172.3  actor: calls=128.3 material=0 program=15.6
  skinning avg: skinned calls=122.3 skeletons first used=33.6
  environment                  calls=2 tris=1736
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=1 tris=2522
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=86 tris=13926
  settlement:decor             calls=188 tris=366867
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
  terrain                      calls=18 tris=1326608
  vegetation                   calls=32 tris=172682

Main:
  calls avg: 983  tris avg: 7868793
  info calls avg: 1267  residual calls avg: 0
  switches avg: material=387.3 program=186  actor: calls=202.8 material=126 program=58
  skinning avg: skinned calls=190.8 skeletons first used=37.3
  environment                  calls=15 tris=9047
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=20 tris=2592
  faunaFamily:dog              calls=22 tris=7740
  faunaFamily:horse            calls=10 tris=2863
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=12 tris=3660
  faunaFamily:wolf             calls=17 tris=8728
  grass                        calls=43 tris=5012082
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=261 tris=21023
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 147.9ms
simulate       137.8ms
render           9.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              3.1ms
FAUNA          133.0ms
PHYSICS          0.2ms
RENDER           9.7ms
OTHER            1.7ms

Long frame #2:

[LONG FRAME] 141.1ms
simulate       130.4ms
render          10.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              2.5ms
FAUNA          126.2ms
PHYSICS          0.2ms
RENDER          10.4ms
OTHER            1.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=13.4 ms  p95=15.4 ms  max=16.2 ms  Δavg vs baseline=—
  hide-grass           avg=13.3 ms  p95=15.3 ms  max=15.3 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=13.2 ms  p95=15.0 ms  max=15.1 ms  Δavg vs baseline=-0.2 ms (-1%)
  no vegetation/grass  avg=13.2 ms  p95=15.1 ms  max=16.5 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-environment     avg=13.2 ms  p95=15.9 ms  max=16.6 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-settlement      avg=10.1 ms  p95=12.0 ms  max=12.4 ms  Δavg vs baseline=-3.3 ms (-25%)
  no water             avg=13.8 ms  p95=17.7 ms  max=19.5 ms  Δavg vs baseline=+0.4 ms (+3%)
  hide-terrain         avg=13.3 ms  p95=14.6 ms  max=14.9 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-npc-fauna       avg=9.9 ms  p95=11.3 ms  max=11.7 ms  Δavg vs baseline=-3.4 ms (-26%)
  no-shadows           avg=11.6 ms  p95=12.6 ms  max=13.1 ms  Δavg vs baseline=-1.7 ms (-13%)
  no-ao                avg=13.3 ms  p95=15.1 ms  max=15.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=14.1 ms  p95=16.8 ms  max=29.8 ms  Δavg vs baseline=+0.8 ms (+6%)
  no-smaa              avg=13.6 ms  p95=15.8 ms  max=15.9 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-god-rays          avg=13.6 ms  p95=16.2 ms  max=17.0 ms  Δavg vs baseline=+0.3 ms (+2%)
  no-film-grade        avg=13.7 ms  p95=16.2 ms  max=16.5 ms  Δavg vs baseline=+0.4 ms (+3%)
  no postprocessing    avg=14.0 ms  p95=17.5 ms  max=17.6 ms  Δavg vs baseline=+0.6 ms (+4%)
  no mirrors           avg=14.2 ms  p95=17.0 ms  max=17.6 ms  Δavg vs baseline=+0.8 ms (+6%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=33.2 ms  p95=39.1 ms  max=39.4 ms
  CPU wall      avg=13.4 ms  p95=15.4 ms  max=16.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
