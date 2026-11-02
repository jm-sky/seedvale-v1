# Seedvale Performance Benchmark Report

> Generated: 2026-11-02T15:21:54.673Z
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
Frames: 259
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a05ea60dc0ccd87ab39b4bb8b06b9d08f5b8678e
  runId: 2026-11-02T15-19-48-724Z-5g8wu5
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
  populationGate: stable waited=5090ms npc=24
  gpuTimer: available=true resolved=true samples=259 span=postprocess+labels

FPS:
  avg: 25.9
  min: 8
  p1: 12

Frame time (wall-clock):
  avg: 38.6 ms
  p50: 37.5 ms
  p95: 57.7 ms
  p99: 86 ms
  max: 119.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.5 p95=12.7 p99=42.4 max=101.2 n=259
  render: p50=30.6 p95=45.6 p99=60.4 max=107.9 n=259
  frame: p50=37.5 p95=57.7 p99=86 max=119.6 n=259

Rendering (combined renderer.info):
  draw calls: 1582 avg / 2149 max
  triangles: 10.14M avg
  mirror draws: 317 avg
  geometries: 707
  textures: 342

Pass submissions (actual):
  reliability: observed
  frames: 261 shadowRefresh=130 shadowSkipped=131
  mirror calls avg: 317
  shadow calls avg: 501
  main calls avg: 1003

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.87M meshes=72 inst=583858
  vegetation       draws=102 tris=268.0k meshes=102 inst=180
  environment      draws=53 tris=28.9k meshes=53 inst=53
  settlement       draws=716 tris=905.3k meshes=716 inst=1992
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=225 tris=290.2k meshes=225 inst=225
  fauna            draws=243 tris=96.7k meshes=243 inst=243
  items            draws=247 tris=24.8k meshes=247 inst=247
  other            draws=413 tris=28.6k meshes=413 inst=413

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=100 tris=261.1k meshes=100 inst=178
  environment      draws=53 tris=28.9k meshes=53 inst=53
  settlement       draws=472 tris=659.6k meshes=472 inst=1643
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=29 tris=19.1k meshes=29 inst=29
  other            draws=106 tris=14.6k meshes=106 inst=106

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
      mid  agents=7 camera-relevant=3 draws=68 tris=87.3k
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
      far  agents=47 camera-relevant=16 draws=189 tris=77.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=124 composed=124 multiplied=124 skinned=0
  environment              nodes=85 composed=85 multiplied=85 skinned=0
  settlement               nodes=1472 composed=1472 multiplied=1472 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1880 composed=1880 multiplied=1880 skinned=225
  fauna                    nodes=2562 composed=2562 multiplied=2562 skinned=208
  items                    nodes=366 composed=366 multiplied=366 skinned=0
  other                    nodes=667 composed=650 multiplied=667 skinned=9
  top scene children:
    fauna ×60                nodes=2562 composed=2562 multiplied=2562 skinned=208
    npc ×24                  nodes=1880 composed=1880 multiplied=1880 skinned=225
    settlement ×3            nodes=1472 composed=1472 multiplied=1472 skinned=0
    Group ×78                nodes=502 composed=502 multiplied=502 skinned=9
    chunk-items ×26          nodes=366 composed=366 multiplied=366 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    chunk-environmen ×7      nodes=40 composed=40 multiplied=40 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          5.4 ms
  NPC            3.7 ms
  FAUNA          2.8 ms
  PHYSICS        0.2 ms
  RENDER         24.9 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.4 ms draws=1592 tris=10.14M
  hide-grass         render=21.5 ms draws=1551 tris=4.48M
  hide-vegetation    render=20.8 ms draws=1581 tris=10.11M
  hide-vegetation-grass render=21.0 ms draws=1539 tris=4.45M
  hide-environment   render=20.7 ms draws=1578 tris=10.13M
  hide-settlement    render=13.1 ms draws=819 tris=9.19M
  hide-water         render=20.6 ms draws=1586 tris=9.99M
  hide-terrain       render=20.1 ms draws=1546 tris=7.12M
  hide-npc-fauna     render=16.2 ms draws=1298 tris=9.87M
  no-shadows         render=17.9 ms draws=1351 tris=9.36M
  no-ao              render=22.5 ms draws=1584 tris=10.14M
  no-bloom           render=21.7 ms draws=1577 tris=10.14M
  no-smaa            render=21.6 ms draws=1582 tris=10.14M
  no-god-rays        render=22.9 ms draws=1589 tris=10.14M
  no-film-grade      render=21.5 ms draws=1595 tris=10.14M
  no-postprocessing  render=20.6 ms draws=1571 tris=10.14M
  no-reflections     render=20.8 ms draws=1273 tris=9.31M

Frame attribution:
  frame max: 119.6 ms
  largest labelled hitch: 0 ms
  unattributed: 119.6 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 119.6 ms

Raw sidecar:
  sampling=full factor=1 exported=259/259

Recommendation:
Largest frame (119.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 29

NPC:
  total: 3.7 ms/frame
  crowd pass: 0.0 ms/frame (3.9 ms cumulative)
  agent updates: 1.8 ms/frame (455.4 ms cumulative)
  livestock: 1.4 ms/frame (367.4 ms cumulative)
    loaded tick: 1.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (42.3 predator candidates/frame)
    pest scans: 4.1/frame (4.1 rat candidates/frame)
    nearest scans: 20.3/frame (0.0 candidates/frame)
    water samples: 50.3/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 50.3/frame, 0.10 ms/frame (worst call 0.20 ms, 7877.6 colliders/frame)
    full-rate agents/frame: 1.1
    reduced-cadence agents/frame: 27.1
    behaviour executions/frame: 20.3
    presentation executions/frame: 20.3
  rats: 0.2 ms/frame (64.1 ms cumulative)
  social: 0.0 ms/frame (2.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (54.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.8 ms/frame
  agent updates: 2.7 ms/frame (704.5 ms cumulative)
  forest sampling: 0.1 ms/frame (35.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.5 ms cumulative)
    targeting: 0.0 ms/frame (8.0 ms cumulative)
    decision: 0.0 ms/frame (5.7 ms cumulative)
    behaviour: 1.7 ms/frame (451.3 ms cumulative)
    life/presentation: 0.5 ms/frame (140.6 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 29.2
    sensing passes/frame: 29.2
    decision passes/frame: 29.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 6.3
    reduced-cadence agents/frame: 22.9
    behaviour executions/frame: 17.8
    presentation executions/frame: 17.8

  sensing/cache:
    forest samples/frame: 29.2
    fire scan candidates/frame: 29.2
    village scan candidates/frame: 438.7
    player perception checks/frame: 29.2

  nearest scans: 24.9/frame (6441 calls)
  nearest candidates checked: 225.8/frame (58472 total)
  herd leader scans: 0.4/frame (94 calls)
  herd candidates checked: 10.5/frame (2726 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.4/frame (157.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 76.2/frame, 0.10 ms/frame (worst call 0.20 ms)
    collider queries: 76.2/frame, 0.10 ms/frame (worst call 0.20 ms, 13810.5 colliders/frame)

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
Frames: 261
Shadow refresh frames: 130
Shadow skipped frames: 131

Mirror:
  calls avg: 317  tris avg: 828393
  info calls avg: 317  residual calls avg: 0
  switches avg: material=111.8 program=58  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=0 tris=432
  other                        calls=106 tris=5428
  settlement:decor             calls=31 tris=95972
  settlement:fence             calls=3 tris=3421
  settlement:fireCampfire      calls=4 tris=307
  settlement:fireHouseExteriorLamp calls=13 tris=646
  settlement:fireHouseInteriorLamp calls=4 tris=484
  settlement:fireVillageTorch  calls=17 tris=1247
  settlement:houseInteractive  calls=15 tris=1644
  settlement:houseStatic       calls=33 tris=43069
  settlement:landmarkGarden    calls=3 tris=34942
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=931
  settlement:landmarkWellHousehold calls=5 tris=3726
  settlement:landmarkWellPasture calls=2 tris=931
  settlement:other             calls=8 tris=20242
  settlement:storageBarrel     calls=6 tris=10340
  settlement:storageContainer  calls=9 tris=1960
  settlement:storageGoods      calls=33 tris=6443
  settlement:storageHay        calls=0 tris=243
  settlement:storageTrough     calls=3 tris=1195
  settlement:storageWoodHousehold calls=1 tris=4274
  settlement:storageWoodSettlementPrimary calls=1 tris=777
  settlement:workplace         calls=4 tris=2029
  terrain                      calls=8 tris=587289
  vegetation                   calls=1 tris=606

Shadow (refresh only):
  calls avg: 501  tris avg: 1570904
  info calls avg: 501  residual calls avg: 0
  switches avg: material=130 program=155  actor: calls=131 material=0 program=17
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
  settlement:decor             calls=193 tris=410075
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
  calls avg: 1003  tris avg: 8524984
  info calls avg: 1265  residual calls avg: 0
  switches avg: material=415.8 program=200.9  actor: calls=221.5 material=151.4 program=68.5
  skinning avg: skinned calls=214.5 skeletons first used=39.7
  environment                  calls=16 tris=10459
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=20 tris=6821
  faunaFamily:horse            calls=3 tris=983
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=11 tris=3228
  faunaFamily:wolf             calls=24 tris=11772
  grass                        calls=43 tris=5661696
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=18 tris=23901
  npcFamily:Peasant            calls=66 tris=79478
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=251 tris=19812
  settlement:decor             calls=59 tris=185277
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
Long frames: 4
Shown: 4 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 4 shown, 4 total):

[LONG FRAME] 119.6ms
simulate       101.2ms
render          18.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              5.6ms
FAUNA           94.0ms
PHYSICS          0.2ms
RENDER          18.1ms
OTHER            1.5ms

Long frame #2:

[LONG FRAME] 115.1ms
simulate         7.1ms
render         107.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           29.2ms
STREAMING        0.0ms
NPC              2.4ms
FAUNA            2.8ms
PHYSICS          0.2ms
RENDER          78.6ms
OTHER            1.9ms

Long frame #3:

[LONG FRAME] 90ms
simulate         7.3ms
render          82.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           20.1ms
STREAMING        0.0ms
NPC              3.3ms
FAUNA            2.8ms
PHYSICS          0.2ms
RENDER          62.5ms
OTHER            1.1ms

Long frame #4:

[LONG FRAME] 83.1ms
simulate        67.1ms
render          15.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              3.7ms
FAUNA           61.8ms
PHYSICS          0.1ms
RENDER          15.8ms
OTHER            1.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.4 ms  p95=28.2 ms  max=60.9 ms  Δavg vs baseline=—
  hide-grass           avg=21.5 ms  p95=26.4 ms  max=29.9 ms  Δavg vs baseline=-0.9 ms (-4%)
  hide-vegetation      avg=20.8 ms  p95=25.4 ms  max=28.3 ms  Δavg vs baseline=-1.6 ms (-7%)
  no vegetation/grass  avg=21.0 ms  p95=27.6 ms  max=34.2 ms  Δavg vs baseline=-1.4 ms (-6%)
  hide-environment     avg=20.7 ms  p95=25.7 ms  max=25.8 ms  Δavg vs baseline=-1.7 ms (-8%)
  hide-settlement      avg=13.1 ms  p95=16.3 ms  max=17.7 ms  Δavg vs baseline=-9.3 ms (-41%)
  no water             avg=20.6 ms  p95=24.3 ms  max=24.5 ms  Δavg vs baseline=-1.8 ms (-8%)
  hide-terrain         avg=20.1 ms  p95=23.2 ms  max=24.0 ms  Δavg vs baseline=-2.3 ms (-10%)
  hide-npc-fauna       avg=16.2 ms  p95=20.9 ms  max=26.5 ms  Δavg vs baseline=-6.2 ms (-28%)
  no-shadows           avg=17.9 ms  p95=20.9 ms  max=21.9 ms  Δavg vs baseline=-4.5 ms (-20%)
  no-ao                avg=22.5 ms  p95=30.1 ms  max=47.9 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-bloom             avg=21.7 ms  p95=27.8 ms  max=28.3 ms  Δavg vs baseline=-0.7 ms (-3%)
  no-smaa              avg=21.6 ms  p95=26.2 ms  max=43.7 ms  Δavg vs baseline=-0.8 ms (-4%)
  no-god-rays          avg=22.9 ms  p95=31.3 ms  max=64.0 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-film-grade        avg=21.5 ms  p95=31.9 ms  max=35.3 ms  Δavg vs baseline=-0.9 ms (-4%)
  no postprocessing    avg=20.6 ms  p95=25.5 ms  max=33.8 ms  Δavg vs baseline=-1.8 ms (-8%)
  no mirrors           avg=20.8 ms  p95=27.5 ms  max=29.9 ms  Δavg vs baseline=-1.6 ms (-7%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=65.4 ms  p95=74.8 ms  max=77.0 ms
  CPU wall      avg=22.4 ms  p95=28.2 ms  max=60.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
