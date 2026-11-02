# Seedvale Performance Benchmark Report

> Generated: 2026-11-02T15:37:00.440Z
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
Frames: 232
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a05ea60dc0ccd87ab39b4bb8b06b9d08f5b8678e
  runId: 2026-11-02T15-34-54-085Z-hjcobd
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
  populationGate: stable waited=5047ms npc=24
  gpuTimer: available=true resolved=true samples=231 span=postprocess+labels

FPS:
  avg: 19.2
  min: 1
  p1: 4

Frame time (wall-clock):
  avg: 52 ms
  p50: 37.3 ms
  p95: 85.4 ms
  p99: 256.2 ms
  max: 1409.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.8 p95=14.6 p99=35.2 max=59.6 n=232
  render: p50=28 p95=65.3 p99=246.9 max=1399.4 n=232
  frame: p50=37.3 p95=85.4 p99=256.2 max=1409.7 n=232

Rendering (combined renderer.info):
  draw calls: 1756 avg / 2354 max
  triangles: 10.72M avg
  mirror draws: 297 avg
  geometries: 949
  textures: 407

Pass submissions (actual):
  reliability: observed
  frames: 234 shadowRefresh=226 shadowSkipped=8
  mirror calls avg: 298
  shadow calls avg: 497
  main calls avg: 979

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.87M meshes=72 inst=583858
  vegetation       draws=100 tris=267.0k meshes=100 inst=178
  environment      draws=45 tris=20.1k meshes=45 inst=45
  settlement       draws=716 tris=905.3k meshes=716 inst=1992
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=225 tris=290.2k meshes=225 inst=225
  fauna            draws=243 tris=96.7k meshes=243 inst=243
  items            draws=158 tris=17.4k meshes=158 inst=158
  other            draws=357 tris=28.1k meshes=357 inst=357

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=98 tris=260.1k meshes=98 inst=176
  environment      draws=45 tris=20.1k meshes=45 inst=45
  settlement       draws=472 tris=659.6k meshes=472 inst=1643
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=43 tris=15.9k meshes=43 inst=43
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
      mid  agents=5 camera-relevant=5 draws=51 tris=63.3k
      far  agents=16 camera-relevant=9 draws=148 tris=190.7k
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
      near agents=3 camera-relevant=2 draws=15 tris=4.7k
      mid  agents=7 camera-relevant=6 draws=28 tris=11.2k
      far  agents=50 camera-relevant=24 draws=200 tris=80.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=122 composed=122 multiplied=122 skinned=0
  environment              nodes=68 composed=68 multiplied=68 skinned=0
  settlement               nodes=1472 composed=1472 multiplied=1472 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1880 composed=1880 multiplied=1880 skinned=225
  fauna                    nodes=2562 composed=2562 multiplied=2562 skinned=208
  items                    nodes=247 composed=247 multiplied=247 skinned=0
  other                    nodes=599 composed=582 multiplied=599 skinned=9
  top scene children:
    fauna ×60                nodes=2562 composed=2562 multiplied=2562 skinned=208
    npc ×24                  nodes=1880 composed=1880 multiplied=1880 skinned=225
    settlement ×3            nodes=1472 composed=1472 multiplied=1472 skinned=0
    Group ×67                nodes=436 composed=436 multiplied=436 skinned=9
    chunk-items ×20          nodes=247 composed=247 multiplied=247 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-environmen ×4      nodes=25 composed=25 multiplied=25 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          4.3 ms
  NPC            3.4 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         37.3 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=23.7 ms draws=1715 tris=9.99M
  hide-grass         render=24.3 ms draws=1674 tris=4.34M
  hide-vegetation    render=23.6 ms draws=1676 tris=9.89M
  hide-vegetation-grass render=21.2 ms draws=1619 tris=4.24M
  hide-environment   render=23.2 ms draws=1669 tris=9.97M
  hide-settlement    render=12.7 ms draws=819 tris=8.86M
  hide-water         render=25.7 ms draws=1682 tris=9.82M
  hide-terrain       render=22.0 ms draws=1656 tris=7.36M
  hide-npc-fauna     render=11.7 ms draws=1364 tris=9.67M
  no-shadows         render=15.4 ms draws=1485 tris=9.11M
  no-ao              render=26.6 ms draws=1717 tris=9.99M
  no-bloom           render=30.9 ms draws=1710 tris=9.98M
  no-smaa            render=25.1 ms draws=1717 tris=9.98M
  no-god-rays        render=23.9 ms draws=1716 tris=9.98M
  no-film-grade      render=23.5 ms draws=1717 tris=9.98M
  no-postprocessing  render=25.0 ms draws=1677 tris=9.97M
  no-reflections     render=18.3 ms draws=1342 tris=9.18M

Frame attribution:
  frame max: 1409.7 ms
  largest labelled hitch: 0 ms
  unattributed: 1409.7 ms

Long frames:
  threshold: 80 ms
  count: 14
  worst: 1409.7 ms

Raw sidecar:
  sampling=full factor=1 exported=232/232

Recommendation:
Largest frame (1409.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 29

NPC:
  total: 3.4 ms/frame
  crowd pass: 0.0 ms/frame (3.5 ms cumulative)
  agent updates: 1.6 ms/frame (376.3 ms cumulative)
  livestock: 1.2 ms/frame (278.4 ms cumulative)
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
      behaviour: 0.6 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.1
    dog guard scans: 6.1/frame (42.4 predator candidates/frame)
    pest scans: 3.9/frame (3.9 rat candidates/frame)
    nearest scans: 19.3/frame (0.0 candidates/frame)
    water samples: 40.1/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 40.1/frame, 0.10 ms/frame (worst call 0.10 ms, 6118.3 colliders/frame)
    full-rate agents/frame: 1.4
    reduced-cadence agents/frame: 26.8
    behaviour executions/frame: 19.5
    presentation executions/frame: 19.4
  rats: 0.3 ms/frame (61.8 ms cumulative)
  social: 0.0 ms/frame (1.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (56.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.0 ms/frame (468.6 ms cumulative)
  forest sampling: 0.1 ms/frame (28.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.0 ms cumulative)
    targeting: 0.0 ms/frame (5.2 ms cumulative)
    decision: 0.0 ms/frame (2.8 ms cumulative)
    behaviour: 1.2 ms/frame (267.0 ms cumulative)
    life/presentation: 0.5 ms/frame (121.7 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 29.3
    sensing passes/frame: 29.3
    decision passes/frame: 29.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.7
    full-rate agents/frame: 6.1
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 17.7
    presentation executions/frame: 17.5

  sensing/cache:
    forest samples/frame: 29.3
    fire scan candidates/frame: 29.3
    village scan candidates/frame: 448.6
    player perception checks/frame: 29.3

  nearest scans: 23.2/frame (5381 calls)
  nearest candidates checked: 217.0/frame (50350 total)
  herd leader scans: 0.3/frame (75 calls)
  herd candidates checked: 9.4/frame (2175 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.5/frame (150.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 60.6/frame, 0.10 ms/frame (worst call 0.20 ms)
    collider queries: 60.6/frame, 0.10 ms/frame (worst call 1.10 ms, 9929.0 colliders/frame)

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
Frames: 234
Shadow refresh frames: 226
Shadow skipped frames: 8

Mirror:
  calls avg: 298  tris avg: 703356
  info calls avg: 298  residual calls avg: 0
  switches avg: material=106.2 program=59  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2.4 skeletons first used=2.4
  environment                  calls=1 tris=590
  other                        calls=92 tris=5345
  settlement:decor             calls=33 tris=90220
  settlement:fence             calls=3 tris=2633
  settlement:fireCampfire      calls=3 tris=203
  settlement:fireHouseExteriorLamp calls=11 tris=535
  settlement:fireHouseInteriorLamp calls=4 tris=402
  settlement:fireVillageTorch  calls=15 tris=1074
  settlement:houseInteractive  calls=14 tris=1519
  settlement:houseStatic       calls=32 tris=40888
  settlement:landmarkGarden    calls=3 tris=32842
  settlement:landmarkNoticeBoard calls=1 tris=27
  settlement:landmarkWellCentral calls=4 tris=1434
  settlement:landmarkWellHousehold calls=4 tris=3540
  settlement:landmarkWellPasture calls=2 tris=615
  settlement:other             calls=10 tris=19031
  settlement:storageBarrel     calls=6 tris=9493
  settlement:storageContainer  calls=9 tris=1812
  settlement:storageGoods      calls=30 tris=5873
  settlement:storageHay        calls=1 tris=257
  settlement:storageTrough     calls=3 tris=1097
  settlement:storageWoodHousehold calls=1 tris=4023
  settlement:storageWoodSettlementPrimary calls=1 tris=670
  settlement:workplace         calls=5 tris=2300
  terrain                      calls=6 tris=450664
  vegetation                   calls=6 tris=26466

Shadow (refresh only):
  calls avg: 497  tris avg: 1588797
  info calls avg: 497  residual calls avg: 0
  switches avg: material=137.7 program=162.1  actor: calls=123.4 material=0 program=16.8
  skinning avg: skinned calls=117.8 skeletons first used=26
  environment                  calls=0 tris=303
  faunaFamily:chicken          calls=10 tris=1244
  faunaFamily:cow              calls=6 tris=2157
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=13 tris=3485
  faunaFamily:rat              calls=2 tris=3526
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=7 tris=2030
  npcFamily:Farmer             calls=17 tris=24365
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=15977
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=67 tris=13240
  settlement:decor             calls=197 tris=418588
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
  terrain                      calls=12 tris=880959
  vegetation                   calls=8 tris=68296

Main:
  calls avg: 979  tris avg: 8482419
  info calls avg: 1460  residual calls avg: 0
  switches avg: material=421.6 program=197.7  actor: calls=224.7 material=145.9 program=64.8
  skinning avg: skinned calls=217.7 skeletons first used=33.2
  environment                  calls=17 tris=8605
  faunaFamily:bear             calls=3 tris=1958
  faunaFamily:chicken          calls=15 tris=1927
  faunaFamily:cow              calls=5 tris=1836
  faunaFamily:deer             calls=15 tris=4453
  faunaFamily:dog              calls=15 tris=5358
  faunaFamily:duck             calls=1 tris=25
  faunaFamily:horse            calls=13 tris=3461
  faunaFamily:rat              calls=4 tris=7495
  faunaFamily:rooster          calls=0 tris=497
  faunaFamily:sheep            calls=11 tris=3246
  faunaFamily:wolf             calls=18 tris=8786
  grass                        calls=41 tris=5828659
  items                        calls=29 tris=4040
  npcFamily:Farmer             calls=19 tris=28418
  npcFamily:Knight_Cloth       calls=17 tris=21764
  npcFamily:Peasant            calls=59 tris=71036
  npcFamily:Peasant_Boots      calls=9 tris=12535
  npcFamily:Ranger_NoHood      calls=12 tris=14180
  npcFamily:blacksmith         calls=7 tris=9407
  npcFamily:woodcutter         calls=3 tris=4036
  other                        calls=233 tris=18773
  settlement:decor             calls=65 tris=177018
  settlement:fence             calls=5 tris=5257
  settlement:fireCampfire      calls=5 tris=406
  settlement:fireHouseExteriorLamp calls=23 tris=1107
  settlement:fireHouseInteriorLamp calls=8 tris=810
  settlement:fireVillageTorch  calls=31 tris=2219
  settlement:houseInteractive  calls=28 tris=3142
  settlement:houseStatic       calls=63 tris=81293
  settlement:landmarkGarden    calls=8 tris=80919
  settlement:landmarkNoticeBoard calls=3 tris=60
  settlement:landmarkWellCentral calls=9 tris=3238
  settlement:landmarkWellHousehold calls=9 tris=7273
  settlement:landmarkWellPasture calls=3 tris=1239
  settlement:other             calls=20 tris=38201
  settlement:storageBarrel     calls=12 tris=19672
  settlement:storageContainer  calls=17 tris=3652
  settlement:storageGoods      calls=61 tris=11845
  settlement:storageHay        calls=1 tris=672
  settlement:storageTrough     calls=5 tris=2203
  settlement:storageWoodHousehold calls=2 tris=8073
  settlement:storageWoodSettlementPrimary calls=2 tris=1497
  settlement:workplace         calls=11 tris=5291
  terrain                      calls=23 tris=1723208
  vegetation                   calls=15 tris=52770
  water                        calls=3 tris=191252


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

[LONG FRAME] 1409.7ms
simulate         9.9ms
render        1399.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.9ms
FAUNA            2.6ms
PHYSICS          0.0ms
RENDER        1399.3ms
OTHER            4.8ms

Long frame #2:

[LONG FRAME] 460.3ms
simulate         8.7ms
render         451.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.2ms
STREAMING        0.0ms
NPC              3.7ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER         443.7ms
OTHER            4.4ms

Long frame #3:

[LONG FRAME] 259.4ms
simulate         8.1ms
render         250.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.2ms
STREAMING        0.0ms
NPC              3.2ms
FAUNA            0.9ms
PHYSICS          0.2ms
RENDER         241.8ms
OTHER            4.1ms

Long frame #4:

[LONG FRAME] 249ms
simulate        10.7ms
render         237.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.1ms
NPC              3.0ms
FAUNA            2.6ms
PHYSICS          0.2ms
RENDER         237.7ms
OTHER            5.3ms

Long frame #5:

[LONG FRAME] 214.6ms
simulate        10.4ms
render         203.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.0ms
STREAMING        0.0ms
NPC              3.2ms
FAUNA            2.6ms
PHYSICS          0.1ms
RENDER         197.0ms
OTHER            4.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=23.7 ms  p95=34.1 ms  max=39.0 ms  Δavg vs baseline=—
  hide-grass           avg=24.3 ms  p95=35.0 ms  max=48.3 ms  Δavg vs baseline=+0.6 ms (+3%)
  hide-vegetation      avg=23.6 ms  p95=34.7 ms  max=39.2 ms  Δavg vs baseline=-0.1 ms (-0%)
  no vegetation/grass  avg=21.2 ms  p95=30.8 ms  max=33.6 ms  Δavg vs baseline=-2.5 ms (-10%)
  hide-environment     avg=23.2 ms  p95=36.7 ms  max=37.2 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-settlement      avg=12.7 ms  p95=14.5 ms  max=14.8 ms  Δavg vs baseline=-11.0 ms (-46%)
  no water             avg=25.7 ms  p95=43.2 ms  max=44.6 ms  Δavg vs baseline=+2.0 ms (+8%)
  hide-terrain         avg=22.0 ms  p95=33.4 ms  max=39.7 ms  Δavg vs baseline=-1.7 ms (-7%)
  hide-npc-fauna       avg=11.7 ms  p95=13.3 ms  max=14.4 ms  Δavg vs baseline=-12.0 ms (-51%)
  no-shadows           avg=15.4 ms  p95=18.1 ms  max=18.6 ms  Δavg vs baseline=-8.2 ms (-35%)
  no-ao                avg=26.6 ms  p95=42.3 ms  max=44.1 ms  Δavg vs baseline=+2.9 ms (+12%)
  no-bloom             avg=30.9 ms  p95=78.8 ms  max=120.6 ms  Δavg vs baseline=+7.3 ms (+31%)
  no-smaa              avg=25.1 ms  p95=36.2 ms  max=40.0 ms  Δavg vs baseline=+1.4 ms (+6%)
  no-god-rays          avg=23.9 ms  p95=36.4 ms  max=43.4 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-film-grade        avg=23.5 ms  p95=33.3 ms  max=35.8 ms  Δavg vs baseline=-0.1 ms (-0%)
  no postprocessing    avg=25.0 ms  p95=37.1 ms  max=168.2 ms  Δavg vs baseline=+1.3 ms (+6%)
  no mirrors           avg=18.3 ms  p95=22.3 ms  max=23.9 ms  Δavg vs baseline=-5.4 ms (-23%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=56.6 ms  p95=68.7 ms  max=68.9 ms
  CPU wall      avg=23.7 ms  p95=34.1 ms  max=39.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
