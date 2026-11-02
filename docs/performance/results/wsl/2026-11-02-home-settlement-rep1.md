# Seedvale Performance Benchmark Report

> Generated: 2026-11-02T15:12:35.708Z
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
Frames: 302
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a05ea60dc0ccd87ab39b4bb8b06b9d08f5b8678e
  runId: 2026-11-02T15-10-44-803Z-ialhw0
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
  populationGate: stable waited=5082ms npc=24
  gpuTimer: available=true resolved=true samples=301 span=postprocess+labels

FPS:
  avg: 32.1
  min: 7
  p1: 7

Frame time (wall-clock):
  avg: 31.1 ms
  p50: 28.8 ms
  p95: 52.9 ms
  p99: 136.3 ms
  max: 148 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.7 p95=11.5 p99=109 max=130.9 n=302
  render: p50=22.7 p95=31.9 p99=66.4 max=139.9 n=302
  frame: p50=28.8 p95=52.9 p99=136.3 max=148 n=302

Rendering (combined renderer.info):
  draw calls: 1589 avg / 2154 max
  triangles: 10.14M avg
  mirror draws: 319 avg
  geometries: 711
  textures: 346

Pass submissions (actual):
  reliability: observed
  frames: 304 shadowRefresh=152 shadowSkipped=152
  mirror calls avg: 319
  shadow calls avg: 502
  main calls avg: 1007

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.87M meshes=72 inst=583858
  vegetation       draws=102 tris=268.0k meshes=102 inst=180
  environment      draws=50 tris=19.9k meshes=50 inst=50
  settlement       draws=716 tris=905.3k meshes=716 inst=1992
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=225 tris=290.2k meshes=225 inst=225
  fauna            draws=243 tris=96.7k meshes=243 inst=243
  items            draws=247 tris=24.8k meshes=247 inst=247
  other            draws=412 tris=28.5k meshes=412 inst=412

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=100 tris=261.1k meshes=100 inst=178
  environment      draws=50 tris=19.9k meshes=50 inst=50
  settlement       draws=472 tris=659.6k meshes=472 inst=1643
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=29 tris=19.1k meshes=29 inst=29
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
      near agents=1 camera-relevant=0 draws=9 tris=12.2k
      mid  agents=7 camera-relevant=5 draws=68 tris=87.3k
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
      near agents=1 camera-relevant=1 draws=8 tris=2.2k
      mid  agents=12 camera-relevant=8 draws=46 tris=17.4k
      far  agents=47 camera-relevant=15 draws=189 tris=77.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=124 composed=124 multiplied=124 skinned=0
  environment              nodes=77 composed=77 multiplied=77 skinned=0
  settlement               nodes=1472 composed=1472 multiplied=1472 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1880 composed=1880 multiplied=1880 skinned=225
  fauna                    nodes=2562 composed=2562 multiplied=2562 skinned=208
  items                    nodes=366 composed=366 multiplied=366 skinned=0
  other                    nodes=665 composed=648 multiplied=665 skinned=9
  top scene children:
    fauna ×60                nodes=2562 composed=2562 multiplied=2562 skinned=208
    npc ×24                  nodes=1880 composed=1880 multiplied=1880 skinned=225
    settlement ×3            nodes=1472 composed=1472 multiplied=1472 skinned=0
    Group ×78                nodes=502 composed=502 multiplied=502 skinned=9
    chunk-items ×26          nodes=366 composed=366 multiplied=366 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    chunk-environmen ×5      nodes=32 composed=32 multiplied=32 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          3.5 ms
  NPC            3.0 ms
  FAUNA          3.3 ms
  PHYSICS        0.1 ms
  RENDER         19.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=17.7 ms draws=1587 tris=10.13M
  hide-grass         render=15.9 ms draws=1546 tris=4.48M
  hide-vegetation    render=17.4 ms draws=1577 tris=10.11M
  hide-vegetation-grass render=15.8 ms draws=1534 tris=4.44M
  hide-environment   render=16.4 ms draws=1573 tris=10.13M
  hide-settlement    render=13.8 ms draws=814 tris=9.18M
  hide-water         render=16.9 ms draws=1591 tris=9.98M
  hide-terrain       render=16.3 ms draws=1552 tris=7.12M
  hide-npc-fauna     render=10.8 ms draws=1298 tris=9.87M
  no-shadows         render=13.9 ms draws=1355 tris=9.35M
  no-ao              render=18.5 ms draws=1588 tris=10.14M
  no-bloom           render=17.6 ms draws=1588 tris=10.14M
  no-smaa            render=18.9 ms draws=1612 tris=10.15M
  no-god-rays        render=18.8 ms draws=1610 tris=10.15M
  no-film-grade      render=17.6 ms draws=1601 tris=10.14M
  no-postprocessing  render=17.6 ms draws=1566 tris=10.13M
  no-reflections     render=16.2 ms draws=1272 tris=9.30M

Frame attribution:
  frame max: 148 ms
  largest labelled hitch: 0 ms
  unattributed: 148 ms

Long frames:
  threshold: 80 ms
  count: 5
  worst: 148 ms

Raw sidecar:
  sampling=full factor=1 exported=302/302

Recommendation:
Largest frame (148 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 29

NPC:
  total: 3.0 ms/frame
  crowd pass: 0.0 ms/frame (3.9 ms cumulative)
  agent updates: 1.5 ms/frame (466.2 ms cumulative)
  livestock: 1.0 ms/frame (300.4 ms cumulative)
    loaded tick: 1.0 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.0 ms/frame
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
    dog guard scans: 6.0/frame (42.3 predator candidates/frame)
    pest scans: 4.0/frame (4.0 rat candidates/frame)
    nearest scans: 19.9/frame (0.0 candidates/frame)
    water samples: 52.7/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 52.7/frame, 0.10 ms/frame (worst call 0.20 ms, 7812.5 colliders/frame)
    full-rate agents/frame: 1.2
    reduced-cadence agents/frame: 27.0
    behaviour executions/frame: 20.1
    presentation executions/frame: 20.1
  rats: 0.2 ms/frame (62.7 ms cumulative)
  social: 0.0 ms/frame (1.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (59.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.3 ms/frame
  agent updates: 3.3 ms/frame (985.5 ms cumulative)
  forest sampling: 0.1 ms/frame (34.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (9.0 ms cumulative)
    targeting: 0.0 ms/frame (7.6 ms cumulative)
    decision: 0.0 ms/frame (4.0 ms cumulative)
    behaviour: 2.5 ms/frame (764.0 ms cumulative)
    life/presentation: 0.4 ms/frame (132.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.2
    sensing passes/frame: 29.2
    decision passes/frame: 29.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.4
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 21.6
    behaviour executions/frame: 18.4
    presentation executions/frame: 18.3

  sensing/cache:
    forest samples/frame: 29.2
    fire scan candidates/frame: 29.2
    village scan candidates/frame: 442.9
    player perception checks/frame: 29.2

  nearest scans: 24.6/frame (7438 calls)
  nearest candidates checked: 227.3/frame (68657 total)
  herd leader scans: 0.4/frame (114 calls)
  herd candidates checked: 10.9/frame (3306 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.8/frame (184.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 196.5/frame, 0.20 ms/frame (worst call 0.20 ms)
    collider queries: 196.5/frame, 0.20 ms/frame (worst call 6.60 ms, 34123.1 colliders/frame)

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
Frames: 304
Shadow refresh frames: 152
Shadow skipped frames: 152

Mirror:
  calls avg: 319  tris avg: 831985
  info calls avg: 319  residual calls avg: 0
  switches avg: material=112 program=60  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=434
  other                        calls=106 tris=5422
  settlement:decor             calls=32 tris=96774
  settlement:fence             calls=3 tris=3434
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=14 tris=648
  settlement:fireHouseInteriorLamp calls=5 tris=486
  settlement:fireVillageTorch  calls=18 tris=1252
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=33 tris=43235
  settlement:landmarkGarden    calls=3 tris=35076
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=3740
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=9 tris=20320
  settlement:storageBarrel     calls=6 tris=10380
  settlement:storageContainer  calls=9 tris=1968
  settlement:storageGoods      calls=34 tris=6468
  settlement:storageHay        calls=1 tris=244
  settlement:storageTrough     calls=3 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4290
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=5 tris=2037
  terrain                      calls=8 tris=589548
  vegetation                   calls=2 tris=608

Shadow (refresh only):
  calls avg: 502  tris avg: 1571216
  info calls avg: 502  residual calls avg: 0
  switches avg: material=130 program=157  actor: calls=131 material=0 program=17
  skinning avg: skinned calls=125 skeletons first used=28
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=72 tris=13662
  settlement:decor             calls=194 tris=410387
  settlement:fence             calls=2 tris=1616
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=11 tris=21984
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=12 tris=884452
  vegetation                   calls=4 tris=50984

Main:
  calls avg: 1007  tris avg: 8517748
  info calls avg: 1270  residual calls avg: 0
  switches avg: material=418.7 program=202  actor: calls=226.5 material=154.7 program=69
  skinning avg: skinned calls=217 skeletons first used=39.4
  environment                  calls=16 tris=10459
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=17 tris=2258
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=22 tris=7594
  faunaFamily:horse            calls=7 tris=2045
  faunaFamily:rat              calls=3 tris=5570
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=11 tris=3426
  faunaFamily:wolf             calls=22 tris=10718
  grass                        calls=43 tris=5661696
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=18 tris=23901
  npcFamily:Peasant            calls=66 tris=79478
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=251 tris=19759
  settlement:decor             calls=59 tris=179237
  settlement:fence             calls=6 tris=6868
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=27 tris=1296
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:fireVillageTorch  calls=40 tris=2861
  settlement:houseInteractive  calls=33 tris=3630
  settlement:houseStatic       calls=66 tris=86470
  settlement:landmarkGarden    calls=6 tris=70152
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=20 tris=40700
  settlement:storageBarrel     calls=12 tris=20760
  settlement:storageContainer  calls=18 tris=3936
  settlement:storageGoods      calls=73 tris=14172
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=6 tris=2400
  settlement:storageWoodHousehold calls=2 tris=8580
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=15 tris=7358
  terrain                      calls=27 tris=1989848
  vegetation                   calls=9 tris=5640
  water                        calls=3 tris=155648


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 5
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 5 total):

[LONG FRAME] 148ms
simulate       123.7ms
render          23.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.3ms
STREAMING        0.0ms
NPC              2.5ms
FAUNA          119.4ms
PHYSICS          0.1ms
RENDER          18.6ms
OTHER            2.1ms

Long frame #2:

[LONG FRAME] 147.3ms
simulate         5.4ms
render         139.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.3ms
STREAMING        0.0ms
NPC              2.7ms
FAUNA            1.2ms
PHYSICS          0.2ms
RENDER         131.5ms
OTHER            3.4ms

Long frame #3:

[LONG FRAME] 143.6ms
simulate       130.9ms
render          12.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.1ms
NPC              3.1ms
FAUNA          125.7ms
PHYSICS          0.2ms
RENDER          12.3ms
OTHER            2.1ms

Long frame #4:

[LONG FRAME] 136.3ms
simulate       124.0ms
render          12.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              3.2ms
FAUNA          118.9ms
PHYSICS          0.1ms
RENDER          11.8ms
OTHER            2.2ms

Long frame #5:

[LONG FRAME] 133.4ms
simulate       109.7ms
render          23.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.7ms
STREAMING        0.0ms
NPC              2.4ms
FAUNA          105.4ms
PHYSICS          0.2ms
RENDER          18.6ms
OTHER            2.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=17.7 ms  p95=24.5 ms  max=30.7 ms  Δavg vs baseline=—
  hide-grass           avg=15.9 ms  p95=22.0 ms  max=22.8 ms  Δavg vs baseline=-1.8 ms (-10%)
  hide-vegetation      avg=17.4 ms  p95=21.7 ms  max=26.4 ms  Δavg vs baseline=-0.3 ms (-2%)
  no vegetation/grass  avg=15.8 ms  p95=22.3 ms  max=25.8 ms  Δavg vs baseline=-1.9 ms (-11%)
  hide-environment     avg=16.4 ms  p95=22.7 ms  max=27.7 ms  Δavg vs baseline=-1.3 ms (-7%)
  hide-settlement      avg=13.8 ms  p95=17.6 ms  max=47.0 ms  Δavg vs baseline=-3.9 ms (-22%)
  no water             avg=16.9 ms  p95=24.5 ms  max=25.2 ms  Δavg vs baseline=-0.8 ms (-4%)
  hide-terrain         avg=16.3 ms  p95=21.4 ms  max=28.0 ms  Δavg vs baseline=-1.4 ms (-8%)
  hide-npc-fauna       avg=10.8 ms  p95=13.5 ms  max=14.1 ms  Δavg vs baseline=-7.0 ms (-39%)
  no-shadows           avg=13.9 ms  p95=19.7 ms  max=22.7 ms  Δavg vs baseline=-3.8 ms (-21%)
  no-ao                avg=18.5 ms  p95=27.8 ms  max=40.8 ms  Δavg vs baseline=+0.8 ms (+4%)
  no-bloom             avg=17.6 ms  p95=25.7 ms  max=26.5 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-smaa              avg=18.9 ms  p95=26.4 ms  max=29.5 ms  Δavg vs baseline=+1.1 ms (+6%)
  no-god-rays          avg=18.8 ms  p95=29.0 ms  max=31.0 ms  Δavg vs baseline=+1.1 ms (+6%)
  no-film-grade        avg=17.6 ms  p95=23.7 ms  max=26.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=17.6 ms  p95=28.9 ms  max=36.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no mirrors           avg=16.2 ms  p95=20.0 ms  max=24.4 ms  Δavg vs baseline=-1.5 ms (-8%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=55.6 ms  p95=68.3 ms  max=70.0 ms
  CPU wall      avg=17.7 ms  p95=24.5 ms  max=30.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
