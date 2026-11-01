# Seedvale Performance Benchmark Report

> Generated: 2026-11-01T07:24:20.969Z
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
Frames: 285
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: caab7ae2d9e449f3a7f6ac893a26f689386d892e
  runId: 2026-11-01T07-22-34-105Z-toxv5u
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
  populationGate: stable waited=5019ms npc=24
  gpuTimer: available=true resolved=true samples=285 span=postprocess+labels

FPS:
  avg: 36.3
  min: 8
  p1: 13

Frame time (wall-clock):
  avg: 27.6 ms
  p50: 26.8 ms
  p95: 32.9 ms
  p99: 76.1 ms
  max: 123.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.3 p95=9 p99=50.2 max=106.8 n=285
  render: p50=19.6 p95=24.2 p99=26.4 max=69 n=285
  frame: p50=26.8 p95=32.9 p99=76.1 max=123.7 n=285

Rendering (combined renderer.info):
  draw calls: 1776 avg / 2102 max
  triangles: 10.18M avg
  mirror draws: 322 avg
  geometries: 670
  textures: 320

Pass submissions (actual):
  reliability: observed
  frames: 288 shadowRefresh=288 shadowSkipped=0
  mirror calls avg: 323
  shadow calls avg: 478
  main calls avg: 977

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.22M meshes=72 inst=549991
  vegetation       draws=102 tris=263.9k meshes=102 inst=183
  environment      draws=49 tris=30.2k meshes=49 inst=49
  settlement       draws=693 tris=865.8k meshes=693 inst=2109
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=241 tris=96.1k meshes=241 inst=241
  items            draws=263 tris=30.1k meshes=263 inst=263
  other            draws=425 tris=28.8k meshes=425 inst=425

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=100 tris=257.1k meshes=100 inst=181
  environment      draws=49 tris=30.2k meshes=49 inst=49
  settlement       draws=452 tris=621.2k meshes=452 inst=1763
  npc              draws=75 tris=98.4k meshes=75 inst=75
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=41 tris=24.3k meshes=41 inst=41
  other            draws=112 tris=14.6k meshes=112 inst=112

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
      near agents=1 camera-relevant=1 draws=9 tris=10.5k
      mid  agents=7 camera-relevant=2 draws=66 tris=87.9k
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
      near agents=5 camera-relevant=5 draws=22 tris=6.0k
      mid  agents=8 camera-relevant=5 draws=32 tris=13.6k
      far  agents=48 camera-relevant=13 draws=187 tris=76.5k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=125 composed=125 multiplied=125 skinned=0
  environment              nodes=75 composed=75 multiplied=75 skinned=0
  settlement               nodes=1394 composed=1394 multiplied=1394 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2557 composed=2557 multiplied=2557 skinned=206
  items                    nodes=401 composed=401 multiplied=401 skinned=0
  other                    nodes=688 composed=671 multiplied=688 skinned=9
  top scene children:
    fauna ×61                nodes=2557 composed=2557 multiplied=2557 skinned=206
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1394 composed=1394 multiplied=1394 skinned=0
    Group ×82                nodes=518 composed=518 multiplied=518 skinned=9
    chunk-items ×26          nodes=368 composed=368 multiplied=368 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    Object3D ×33             nodes=33 composed=33 multiplied=33 skinned=0
    chunk-environmen ×5      nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          3.3 ms
  NPC            3.1 ms
  FAUNA          2.5 ms
  PHYSICS        0.1 ms
  RENDER         16.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=15.9 ms draws=1779 tris=10.18M
  hide-grass         render=15.2 ms draws=1736 tris=5.17M
  hide-vegetation    render=15.6 ms draws=1765 tris=10.16M
  hide-vegetation-grass render=15.5 ms draws=1722 tris=5.15M
  hide-environment   render=15.5 ms draws=1766 tris=10.18M
  hide-settlement    render=11.0 ms draws=898 tris=9.00M
  hide-water         render=15.6 ms draws=1778 tris=10.03M
  hide-terrain       render=14.9 ms draws=1729 tris=6.72M
  hide-npc-fauna     render=10.5 ms draws=1455 tris=9.89M
  no-shadows         render=11.9 ms draws=1332 tris=8.72M
  no-ao              render=16.1 ms draws=1778 tris=10.19M
  no-bloom           render=16.3 ms draws=1774 tris=10.19M
  no-smaa            render=16.1 ms draws=1784 tris=10.19M
  no-god-rays        render=15.8 ms draws=1786 tris=10.19M
  no-film-grade      render=16.6 ms draws=1787 tris=10.19M
  no-postprocessing  render=15.7 ms draws=1762 tris=10.19M
  no-reflections     render=15.7 ms draws=1458 tris=9.33M

Frame attribution:
  frame max: 123.7 ms
  largest labelled hitch: 0 ms
  unattributed: 123.7 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 123.7 ms

Raw sidecar:
  sampling=full factor=1 exported=285/285

Recommendation:
Largest frame (123.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 3.1 ms/frame
  crowd pass: 0.0 ms/frame (2.1 ms cumulative)
  agent updates: 1.4 ms/frame (412.8 ms cumulative)
  livestock: 1.3 ms/frame (361.6 ms cumulative)
    loaded tick: 1.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.9 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.3
    unique animals/frame: 27.3
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.1
    dog guard scans: 6.1/frame (36.4 predator candidates/frame)
    pest scans: 3.7/frame (3.7 rat candidates/frame)
    nearest scans: 20.2/frame (0.0 candidates/frame)
    water samples: 51.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 51.5/frame, 0.10 ms/frame (worst call 0.10 ms, 8870.2 colliders/frame)
    full-rate agents/frame: 1.1
    reduced-cadence agents/frame: 27.2
    behaviour executions/frame: 20.2
    presentation executions/frame: 20.1
  rats: 0.2 ms/frame (58.6 ms cumulative)
  social: 0.0 ms/frame (1.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (44.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.5 ms/frame
  agent updates: 2.5 ms/frame (714.0 ms cumulative)
  forest sampling: 0.1 ms/frame (22.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (4.5 ms cumulative)
    targeting: 0.0 ms/frame (5.8 ms cumulative)
    decision: 0.0 ms/frame (4.5 ms cumulative)
    behaviour: 1.8 ms/frame (526.6 ms cumulative)
    life/presentation: 0.4 ms/frame (120.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.2
    full-rate agents/frame: 8.4
    reduced-cadence agents/frame: 21.8
    behaviour executions/frame: 19.2
    presentation executions/frame: 19.2

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 30.1
    village scan candidates/frame: 599.9
    player perception checks/frame: 30.1

  nearest scans: 24.9/frame (7087 calls)
  nearest candidates checked: 242.9/frame (69220 total)
  herd leader scans: 0.1/frame (42 calls)
  herd candidates checked: 4.4/frame (1260 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.7/frame (192.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 179.0/frame, 0.20 ms/frame (worst call 1.00 ms)
    collider queries: 179.0/frame, 0.20 ms/frame (worst call 2.00 ms, 33144.0 colliders/frame)

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
Frames: 288
Shadow refresh frames: 288
Shadow skipped frames: 0

Mirror:
  calls avg: 323  tris avg: 854883
  info calls avg: 323  residual calls avg: 0
  switches avg: material=110.5 program=55  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=434
  other                        calls=109 tris=5794
  settlement:decor             calls=48 tris=111931
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=12 tris=576
  settlement:fireHouseInteriorLamp calls=4 tris=432
  settlement:fireVillageTorch  calls=13 tris=894
  settlement:houseInteractive  calls=14 tris=1485
  settlement:houseStatic       calls=33 tris=43235
  settlement:landmarkGarden    calls=3 tris=35076
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=3 tris=2805
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=9 tris=30218
  settlement:storageBarrel     calls=6 tris=10380
  settlement:storageContainer  calls=9 tris=1968
  settlement:storageGoods      calls=30 tris=5644
  settlement:storageHay        calls=1 tris=244
  settlement:storageTrough     calls=3 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4290
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=5 tris=2037
  terrain                      calls=8 tris=589548
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 478  tris avg: 1467593
  info calls avg: 478  residual calls avg: 0
  switches avg: material=119 program=143  actor: calls=129 material=0 program=16
  skinning avg: skinned calls=123 skeletons first used=34
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=73 tris=13371
  settlement:decor             calls=175 tris=333265
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
  vegetation                   calls=2 tris=17024

Main:
  calls avg: 977  tris avg: 7861738
  info calls avg: 1455  residual calls avg: 0
  switches avg: material=388 program=191  actor: calls=193.6 material=126 program=63
  skinning avg: skinned calls=181.6 skeletons first used=27.2
  environment                  calls=15 tris=9047
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=20 tris=2592
  faunaFamily:dog              calls=20 tris=6992
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=12 tris=3660
  faunaFamily:wolf             calls=13 tris=6282
  grass                        calls=43 tris=5012082
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=264 tris=21051
  settlement:decor             calls=85 tris=191331
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

[LONG FRAME] 123.7ms
simulate       106.8ms
render          16.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.5ms
FAUNA          102.7ms
PHYSICS          0.1ms
RENDER          16.6ms
OTHER            1.7ms

Long frame #2:

[LONG FRAME] 100.8ms
simulate        75.3ms
render          25.2ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.7ms
STREAMING        0.0ms
NPC              2.2ms
FAUNA           71.3ms
PHYSICS          0.1ms
RENDER          20.6ms
OTHER            1.8ms

Long frame #3:

[LONG FRAME] 83.9ms
simulate        71.1ms
render          12.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.7ms
FAUNA           66.6ms
PHYSICS          0.2ms
RENDER          12.5ms
OTHER            1.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=15.9 ms  p95=17.8 ms  max=20.8 ms  Δavg vs baseline=—
  hide-grass           avg=15.2 ms  p95=16.7 ms  max=19.5 ms  Δavg vs baseline=-0.7 ms (-4%)
  hide-vegetation      avg=15.6 ms  p95=17.4 ms  max=18.6 ms  Δavg vs baseline=-0.3 ms (-2%)
  no vegetation/grass  avg=15.5 ms  p95=17.8 ms  max=18.0 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-environment     avg=15.5 ms  p95=18.1 ms  max=19.4 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-settlement      avg=11.0 ms  p95=12.1 ms  max=13.2 ms  Δavg vs baseline=-4.9 ms (-31%)
  no water             avg=15.6 ms  p95=18.1 ms  max=21.1 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-terrain         avg=14.9 ms  p95=16.2 ms  max=16.5 ms  Δavg vs baseline=-1.0 ms (-6%)
  hide-npc-fauna       avg=10.5 ms  p95=11.4 ms  max=11.9 ms  Δavg vs baseline=-5.4 ms (-34%)
  no-shadows           avg=11.9 ms  p95=12.9 ms  max=13.5 ms  Δavg vs baseline=-4.1 ms (-26%)
  no-ao                avg=16.1 ms  p95=17.9 ms  max=19.2 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-bloom             avg=16.3 ms  p95=20.2 ms  max=22.0 ms  Δavg vs baseline=+0.4 ms (+2%)
  no-smaa              avg=16.1 ms  p95=18.0 ms  max=20.4 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-god-rays          avg=15.8 ms  p95=18.6 ms  max=19.6 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-film-grade        avg=16.6 ms  p95=18.7 ms  max=19.4 ms  Δavg vs baseline=+0.6 ms (+4%)
  no postprocessing    avg=15.7 ms  p95=17.2 ms  max=20.4 ms  Δavg vs baseline=-0.2 ms (-1%)
  no mirrors           avg=15.7 ms  p95=17.1 ms  max=18.0 ms  Δavg vs baseline=-0.2 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=51.5 ms  p95=56.2 ms  max=56.4 ms
  CPU wall      avg=15.9 ms  p95=17.8 ms  max=20.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
