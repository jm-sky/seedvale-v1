# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T10:15:00.395Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Frames: 313
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 5a95c52c56f8e6a75e2b5ae006260991a06f7a9e
  runId: 2026-10-30T10-13-10-619Z-txc0k7
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
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=7730ms npc=57
  gpuTimer: available=true resolved=true samples=312 span=postprocess+labels

FPS:
  avg: 23.6
  min: 6
  p1: 10

Frame time (wall-clock):
  avg: 42.4 ms
  p50: 40.1 ms
  p95: 54.2 ms
  p99: 97.3 ms
  max: 173 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.9 p95=12.2 p99=44.8 max=72.6 n=313
  render: p50=32.2 p95=44.3 p99=65.3 max=162.7 n=313
  frame: p50=40.1 p95=54.2 p99=97.3 max=173 n=313

Rendering (combined renderer.info):
  draw calls: 2057 avg / 2366 max
  triangles: 7.76M avg
  mirror draws: 295 avg
  geometries: 924
  textures: 827

Pass submissions (actual):
  reliability: observed
  frames: 315 shadowRefresh=315 shadowSkipped=0
  mirror calls avg: 295
  shadow calls avg: 392
  main calls avg: 1369

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1236 tris=1.43M meshes=1236 inst=3666
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=540 tris=680.5k meshes=540 inst=540
  fauna            draws=434 tris=162.6k meshes=434 inst=434
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=722 tris=854.0k meshes=722 inst=2880
  npc              draws=32 tris=37.7k meshes=32 inst=32
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=155 tris=293.3k meshes=155 inst=1778
  houseInteractive draws=64 tris=10.0k meshes=64 inst=64
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=5 tris=4.8k meshes=5 inst=5
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=5 tris=25.0k meshes=5 inst=32
  storageContainer draws=30 tris=10.1k meshes=30 inst=138
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.8k meshes=24 inst=78
  workplace        draws=26 tris=17.4k meshes=26 inst=26
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=9.6k meshes=5 inst=12
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=32 tris=3.5k meshes=32 inst=32
  fireCampfire     draws=40 tris=1.1k meshes=40 inst=40
  decor            draws=194 tris=377.2k meshes=194 inst=277
  other            draws=59 tris=1.8k meshes=59 inst=59

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=29 draws=267 tris=320.9k skinned=267/267
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Wizard           agents=4 draws=47 tris=46.9k skinned=47/47
      Farmer           agents=5 draws=42 tris=63.0k skinned=42/42
      Herbalist        agents=4 draws=41 tris=52.4k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.7k skinned=27/27
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
    by distance band:
      mid  agents=3 camera-relevant=2 draws=32 tris=37.7k
      far  agents=54 camera-relevant=19 draws=508 tris=642.8k
  Fauna:
    by family (sorted by draws):
      horse            agents=11 draws=88 tris=24.0k skinned=88/88
      dog              agents=15 draws=83 tris=29.0k skinned=83/83
      sheep            agents=23 draws=46 tris=14.0k skinned=46/46
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      chicken          agents=7 draws=35 tris=4.5k skinned=0/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=5 draws=10 tris=20.0k skinned=10/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=2 draws=2 tris=2.4k skinned=0/2
    by distance band:
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=97 camera-relevant=22 draws=424 tris=159.4k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=439 composed=439 multiplied=439 skinned=0
  settlement               nodes=2468 composed=2468 multiplied=2468 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4473 composed=4473 multiplied=4473 skinned=540
  fauna                    nodes=4683 composed=4683 multiplied=4683 skinned=388
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=783 composed=766 multiplied=783 skinned=9
  top scene children:
    fauna ×100               nodes=4683 composed=4683 multiplied=4683 skinned=388
    npc ×57                  nodes=4473 composed=4473 multiplied=4473 skinned=540
    settlement ×5            nodes=2468 composed=2468 multiplied=2468 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×5      nodes=383 composed=383 multiplied=383 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.8 ms
  NPC            5.1 ms
  FAUNA          2.0 ms
  PHYSICS        0.1 ms
  RENDER         29.5 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=34.0 ms draws=2053 tris=7.75M
  hide-grass         render=30.6 ms draws=2015 tris=7.43M
  hide-vegetation    render=26.3 ms draws=1871 tris=6.65M
  hide-vegetation-grass render=25.5 ms draws=1832 tris=6.33M
  hide-environment   render=26.5 ms draws=1789 tris=7.70M
  hide-settlement    render=21.0 ms draws=1328 tris=6.87M
  hide-water         render=36.1 ms draws=2046 tris=6.79M
  hide-terrain       render=29.2 ms draws=2003 tris=3.70M
  hide-npc-fauna     render=16.8 ms draws=1706 tris=7.43M
  no-shadows         render=19.6 ms draws=1687 tris=5.58M
  no-ao              render=39.5 ms draws=2050 tris=7.76M
  no-bloom           render=38.7 ms draws=2030 tris=7.75M
  no-smaa            render=35.1 ms draws=2037 tris=7.76M
  no-god-rays        render=31.7 ms draws=2036 tris=7.75M
  no-film-grade      render=25.6 ms draws=2032 tris=7.75M
  no-postprocessing  render=25.0 ms draws=2013 tris=7.75M
  no-reflections     render=24.3 ms draws=1739 tris=6.76M

Frame attribution:
  frame max: 173 ms
  largest labelled hitch: 0 ms
  unattributed: 173 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 173 ms

Raw sidecar:
  sampling=full factor=1 exported=313/313

Recommendation:
Largest frame (173 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 57
  Fauna (agents): 30

NPC:
  total: 5.1 ms/frame
  crowd pass: 0.0 ms/frame (6.2 ms cumulative)
  agent updates: 2.9 ms/frame (897.0 ms cumulative)
  livestock: 1.7 ms/frame (545.0 ms cumulative)
    loaded tick: 1.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.9 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 65.4
    unique animals/frame: 57.4
    duplicate updates/frame: 8.1
    detached animals/frame: 0.0
    dog updates/frame: 15.1
    dog guard scans: 15.1/frame (120.8 predator candidates/frame)
    pest scans: 8.3/frame (8.3 rat candidates/frame)
    nearest scans: 34.4/frame (0.0 candidates/frame)
    water samples: 76.4/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 76.4/frame, 0.10 ms/frame (worst call 0.10 ms, 15297.1 colliders/frame)
    full-rate agents/frame: 0.6
    reduced-cadence agents/frame: 64.8
    behaviour executions/frame: 34.6
    presentation executions/frame: 34.5
  rats: 0.1 ms/frame (46.2 ms cumulative)
  social: 0.0 ms/frame (2.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (79.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.0 ms/frame
  agent updates: 1.9 ms/frame (590.6 ms cumulative)
  forest sampling: 0.1 ms/frame (34.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.4 ms cumulative)
    targeting: 0.1 ms/frame (20.2 ms cumulative)
    decision: 0.0 ms/frame (4.2 ms cumulative)
    behaviour: 1.1 ms/frame (345.2 ms cumulative)
    life/presentation: 0.4 ms/frame (138.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.6
    full-rate agents/frame: 9.0
    reduced-cadence agents/frame: 21.1
    behaviour executions/frame: 19.6
    presentation executions/frame: 19.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.8
    village scan candidates/frame: 1726.6
    player perception checks/frame: 30.2

  nearest scans: 27.6/frame (8647 calls)
  nearest candidates checked: 527.9/frame (165244 total)
  herd leader scans: 0.3/frame (96 calls)
  herd candidates checked: 9.2/frame (2880 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 27.7/frame (176.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 123.2/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 123.2/frame, 0.10 ms/frame (worst call 9.90 ms, 6989.9 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 22
Resident instances: full=88277 filler=113472
Submitted instances: full=75310 filler=42552
Meshes submitted: 74
LOD submitted fraction: full=0.8531100966276607 filler=0.375
Flowers: unavailable
Allocation bytes (estimated): 19367904
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 315
Shadow refresh frames: 315
Shadow skipped frames: 0

Mirror:
  calls avg: 295  tris avg: 996455
  info calls avg: 295  residual calls avg: 0
  switches avg: material=93.3 program=51.2  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=44 tris=8894
  items                        calls=1 tris=634
  other                        calls=38 tris=2303
  settlement:decor             calls=1 tris=839
  settlement:fence             calls=2 tris=9321
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=722
  settlement:fireHouseInteriorLamp calls=5 tris=542
  settlement:fireVillageTorch  calls=5 tris=359
  settlement:houseInteractive  calls=15 tris=1655
  settlement:houseStatic       calls=33 tris=80758
  settlement:landmarkGarden    calls=5 tris=83066
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=938
  settlement:landmarkWellHousehold calls=5 tris=9380
  settlement:landmarkWellPasture calls=3 tris=938
  settlement:other             calls=10 tris=351
  settlement:storageBarrel     calls=5 tris=11801
  settlement:storageContainer  calls=8 tris=2474
  settlement:storageGoods      calls=40 tris=6996
  settlement:storageHay        calls=1 tris=490
  settlement:storageTrough     calls=4 tris=1705
  settlement:storageWoodHousehold calls=1 tris=5869
  settlement:storageWoodSettlementPrimary calls=1 tris=548
  settlement:storageWoodSettlementSecondary calls=1 tris=2825
  settlement:workplace         calls=11 tris=5310
  terrain                      calls=8 tris=591696
  vegetation                   calls=23 tris=166081

Shadow (refresh only):
  calls avg: 392  tris avg: 2179204
  info calls avg: 392  residual calls avg: 0
  switches avg: material=87 program=99.5  actor: calls=40.4 material=0 program=4.8
  skinning avg: skinned calls=45.4 skeletons first used=45.4
  environment                  calls=88 tris=22755
  faunaFamily:dog              calls=6 tris=2068
  faunaFamily:donkey           calls=0 tris=19
  faunaFamily:sheep            calls=4 tris=1272
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4158
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=6 tris=6193
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8703
  settlement:fence             calls=4 tris=19796
  settlement:fireCampfire      calls=12 tris=176
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:houseInteractive  calls=16 tris=2512
  settlement:houseStatic       calls=33 tris=89974
  settlement:landmarkGarden    calls=1 tris=2400
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=13 tris=240
  settlement:storageContainer  calls=6 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1369  tris avg: 4585508
  info calls avg: 1762  residual calls avg: 0
  switches avg: material=623 program=213  actor: calls=309.5 material=187 program=86
  skinning avg: skinned calls=303.5 skeletons first used=265.9
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5627
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15126
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=30 tris=1440
  settlement:fireHouseInteriorLamp calls=10 tris=1080
  settlement:fireVillageTorch  calls=15 tris=1073
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=161004
  settlement:landmarkGarden    calls=12 tris=210456
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=18700
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=22 tris=760
  settlement:storageBarrel     calls=12 tris=26296
  settlement:storageContainer  calls=18 tris=5184
  settlement:storageGoods      calls=85 tris=15184
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=2 tris=11700
  settlement:storageWoodSettlementPrimary calls=2 tris=2184
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=84 tris=382238
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 6
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 6 total):

[LONG FRAME] 173ms
simulate        10.2ms
render         162.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              6.0ms
FAUNA            2.0ms
PHYSICS          0.1ms
RENDER         162.6ms
OTHER            2.1ms

Long frame #2:

[LONG FRAME] 113.6ms
simulate        68.2ms
render          45.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.2ms
STREAMING        0.0ms
NPC              5.5ms
FAUNA           60.5ms
PHYSICS          0.1ms
RENDER          35.3ms
OTHER            2.0ms

Long frame #3:

[LONG FRAME] 112.9ms
simulate         7.8ms
render         105.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.2ms
STREAMING        0.0ms
NPC              5.2ms
FAUNA            0.8ms
PHYSICS          0.2ms
RENDER          95.6ms
OTHER            1.9ms

Long frame #4:

[LONG FRAME] 97.5ms
simulate        72.6ms
render          24.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.5ms
FAUNA           65.1ms
PHYSICS          0.1ms
RENDER          24.6ms
OTHER            2.1ms

Long frame #5:

[LONG FRAME] 96.1ms
simulate        21.9ms
render          74.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           16.6ms
STREAMING        0.0ms
NPC             17.8ms
FAUNA            0.8ms
PHYSICS          0.3ms
RENDER          57.6ms
OTHER            3.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=34.0 ms  p95=38.7 ms  max=41.2 ms  Δavg vs baseline=—
  hide-grass           avg=30.6 ms  p95=34.4 ms  max=34.7 ms  Δavg vs baseline=-3.4 ms (-10%)
  hide-vegetation      avg=26.3 ms  p95=35.6 ms  max=36.4 ms  Δavg vs baseline=-7.8 ms (-23%)
  no vegetation/grass  avg=25.5 ms  p95=36.4 ms  max=44.6 ms  Δavg vs baseline=-8.5 ms (-25%)
  hide-environment     avg=26.5 ms  p95=31.6 ms  max=36.4 ms  Δavg vs baseline=-7.5 ms (-22%)
  hide-settlement      avg=21.0 ms  p95=22.9 ms  max=28.1 ms  Δavg vs baseline=-13.0 ms (-38%)
  no water             avg=36.1 ms  p95=53.7 ms  max=58.9 ms  Δavg vs baseline=+2.0 ms (+6%)
  hide-terrain         avg=29.2 ms  p95=34.5 ms  max=38.5 ms  Δavg vs baseline=-4.8 ms (-14%)
  hide-npc-fauna       avg=16.8 ms  p95=19.4 ms  max=24.1 ms  Δavg vs baseline=-17.2 ms (-51%)
  no-shadows           avg=19.6 ms  p95=22.0 ms  max=23.8 ms  Δavg vs baseline=-14.4 ms (-42%)
  no-ao                avg=39.5 ms  p95=63.6 ms  max=70.1 ms  Δavg vs baseline=+5.5 ms (+16%)
  no-bloom             avg=38.7 ms  p95=53.3 ms  max=57.1 ms  Δavg vs baseline=+4.7 ms (+14%)
  no-smaa              avg=35.1 ms  p95=44.7 ms  max=52.7 ms  Δavg vs baseline=+1.1 ms (+3%)
  no-god-rays          avg=31.7 ms  p95=50.9 ms  max=57.4 ms  Δavg vs baseline=-2.4 ms (-7%)
  no-film-grade        avg=25.6 ms  p95=30.0 ms  max=37.8 ms  Δavg vs baseline=-8.4 ms (-25%)
  no postprocessing    avg=25.0 ms  p95=27.5 ms  max=27.6 ms  Δavg vs baseline=-9.0 ms (-26%)
  no mirrors           avg=24.3 ms  p95=25.9 ms  max=28.5 ms  Δavg vs baseline=-9.7 ms (-29%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=37.7 ms  p95=40.5 ms  max=41.4 ms
  CPU wall      avg=34.0 ms  p95=38.7 ms  max=41.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
