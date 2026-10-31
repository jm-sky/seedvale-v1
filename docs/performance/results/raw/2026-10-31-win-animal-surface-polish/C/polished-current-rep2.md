# Seedvale Performance Benchmark Report

> Generated: 2026-10-31T08:23:50.403Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: current (non-canonical)
Duration: 30s
Frames: 1019
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 977966ac6b0ce19aabe3e3acdf91b9462c21824e
  runId: 2026-10-31T08-22-40-610Z-g4nhzh
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
  viewport: 1586x806
  drawingBuffer: 1982x1007
  camera: pos=(-4.6, 10.6, -6)
  populationGate: stable waited=5100ms npc=24
  gpuTimer: available=true resolved=true samples=1026 span=postprocess+labels

FPS:
  avg: 35.5
  min: 9
  p1: 17

Frame time (wall-clock):
  avg: 28.2 ms
  p50: 27.2 ms
  p95: 40.4 ms
  p99: 58.9 ms
  max: 117.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.5 p95=8.4 p99=12.8 max=96.8 n=1019
  render: p50=21.3 p95=31.6 p99=37.3 max=47 n=1019
  frame: p50=27.2 p95=40.4 p99=58.9 max=117.6 n=1019

Rendering (combined renderer.info):
  draw calls: 1712 avg / 1979 max
  triangles: 9.96M avg
  mirror draws: 263 avg
  geometries: 661
  textures: 298

Pass submissions (actual):
  reliability: observed
  frames: 1027 shadowRefresh=1027 shadowSkipped=0
  mirror calls avg: 263
  shadow calls avg: 535
  main calls avg: 915

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.12M meshes=72 inst=542412
  vegetation       draws=105 tris=251.5k meshes=105 inst=180
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=667 tris=760.1k meshes=667 inst=1533
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=247 tris=98.7k meshes=247 inst=247
  items            draws=251 tris=25.0k meshes=251 inst=251
  other            draws=424 tris=28.8k meshes=424 inst=427

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=103 tris=244.6k meshes=103 inst=178
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=427 tris=515.8k meshes=427 inst=1188
  npc              draws=66 tris=87.9k meshes=66 inst=66
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=29 tris=19.1k meshes=29 inst=29
  other            draws=108 tris=14.8k meshes=108 inst=108

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=81 tris=85.2k meshes=81 inst=652
  houseInteractive draws=28 tris=4.4k meshes=28 inst=28
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
  decor            draws=194 tris=377.2k meshes=194 inst=277
  other            draws=29 tris=540 meshes=29 inst=29

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
      mid  agents=7 camera-relevant=1 draws=66 tris=87.9k
      far  agents=17 camera-relevant=10 draws=157 tris=201.1k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      dog              agents=6 draws=33 tris=11.6k skinned=33/33
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=4 draws=32 tris=8.7k skinned=32/32
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
      near agents=5 camera-relevant=4 draws=18 tris=6.5k
      mid  agents=8 camera-relevant=4 draws=36 tris=13.1k
      far  agents=48 camera-relevant=14 draws=193 tris=79.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=128 composed=128 multiplied=128 skinned=0
  environment              nodes=262 composed=262 multiplied=262 skinned=0
  settlement               nodes=1342 composed=1342 multiplied=1342 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2637 composed=2637 multiplied=2637 skinned=212
  items                    nodes=371 composed=371 multiplied=371 skinned=0
  other                    nodes=681 composed=664 multiplied=681 skinned=9
  top scene children:
    fauna ×61                nodes=2637 composed=2637 multiplied=2637 skinned=212
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1342 composed=1342 multiplied=1342 skinned=0
    Group ×80                nodes=514 composed=514 multiplied=514 skinned=9
    chunk-items ×26          nodes=371 composed=371 multiplied=371 skinned=0
    chunk-environmen ×5      nodes=214 composed=214 multiplied=214 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          3.0 ms
  NPC            2.9 ms
  FAUNA          1.8 ms
  PHYSICS        0.2 ms
  RENDER         18.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=16.0 ms draws=1715 tris=9.96M
  hide-grass         render=14.6 ms draws=1674 tris=5.42M
  hide-vegetation    render=14.7 ms draws=1670 tris=9.80M
  hide-vegetation-grass render=19.3 ms draws=1629 tris=5.25M
  hide-environment   render=17.9 ms draws=1625 tris=9.95M
  hide-settlement    render=12.4 ms draws=933 tris=8.98M
  hide-water         render=15.3 ms draws=1705 tris=9.88M
  hide-terrain       render=18.1 ms draws=1659 tris=6.09M
  hide-npc-fauna     render=12.6 ms draws=1412 tris=9.69M
  no-shadows         render=15.2 ms draws=1201 tris=7.85M
  no-ao              render=20.8 ms draws=1709 tris=9.96M
  no-bloom           render=20.8 ms draws=1701 tris=9.96M
  no-smaa            render=20.2 ms draws=1709 tris=9.95M
  no-god-rays        render=21.6 ms draws=1721 tris=9.97M
  no-film-grade      render=22.0 ms draws=1714 tris=9.96M
  no-postprocessing  render=16.4 ms draws=1689 tris=9.95M
  no-reflections     render=18.2 ms draws=1450 tris=9.21M

Frame attribution:
  frame max: 117.6 ms
  largest labelled hitch: 0 ms
  unattributed: 117.6 ms

Long frames:
  threshold: 80 ms
  count: 5
  worst: 117.6 ms

Raw sidecar:
  sampling=full factor=1 exported=1019/1019

Recommendation:
Largest frame (117.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.9 ms/frame
  crowd pass: 0.0 ms/frame (13.7 ms cumulative)
  agent updates: 1.7 ms/frame (1696.0 ms cumulative)
  livestock: 0.9 ms/frame (931.4 ms cumulative)
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
      behaviour: 0.4 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (48.4 predator candidates/frame)
    pest scans: 2.1/frame (2.1 rat candidates/frame)
    nearest scans: 13.4/frame (0.0 candidates/frame)
    water samples: 30.3/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 30.3/frame, 0.00 ms/frame (worst call 1.10 ms, 2421.5 colliders/frame)
    full-rate agents/frame: 1.5
    reduced-cadence agents/frame: 25.7
    behaviour executions/frame: 13.4
    presentation executions/frame: 13.3
  rats: 0.1 ms/frame (103.2 ms cumulative)
  social: 0.0 ms/frame (7.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (182.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.8 ms/frame (1829.4 ms cumulative)
  forest sampling: 0.1 ms/frame (105.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (22.8 ms cumulative)
    targeting: 0.0 ms/frame (19.5 ms cumulative)
    decision: 0.0 ms/frame (25.0 ms cumulative)
    behaviour: 1.1 ms/frame (1109.4 ms cumulative)
    life/presentation: 0.4 ms/frame (424.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.9
    decision passes/frame: 29.9
    high-priority agents/frame: 1.0
    expensive behaviour agents/frame: 15.2
    full-rate agents/frame: 8.3
    reduced-cadence agents/frame: 21.6
    behaviour executions/frame: 16.2
    presentation executions/frame: 14.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.9
    village scan candidates/frame: 444.4
    player perception checks/frame: 29.9

  nearest scans: 21.7/frame (22093 calls)
  nearest candidates checked: 209.9/frame (213872 total)
  herd leader scans: 0.2/frame (204 calls)
  herd candidates checked: 6.0/frame (6120 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.8/frame (144.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 93.2/frame, 0.10 ms/frame (worst call 1.50 ms)
    collider queries: 93.2/frame, 0.10 ms/frame (worst call 1.20 ms, 8647.8 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=317513 filler=605909
Submitted instances: full=257702 filler=284710
Meshes submitted: 72
LOD submitted fraction: full=0.8116266105639769 filler=0.4698890427440424
Flowers: unavailable
Allocation bytes (estimated): 88648512
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1027
Shadow refresh frames: 1027
Shadow skipped frames: 0

Mirror:
  calls avg: 263  tris avg: 742097
  info calls avg: 263  residual calls avg: 0
  switches avg: material=98.6 program=51.6  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=434
  other                        calls=96 tris=5647
  settlement:decor             calls=25 tris=51571
  settlement:fence             calls=2 tris=3235
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=11 tris=504
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=10 tris=716
  settlement:houseInteractive  calls=11 tris=1156
  settlement:houseStatic       calls=23 tris=24977
  settlement:landmarkGarden    calls=6 tris=70220
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=3 tris=2808
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=7 tris=120
  settlement:storageBarrel     calls=5 tris=9005
  settlement:storageContainer  calls=8 tris=1844
  settlement:storageGoods      calls=25 tris=5155
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=1201
  settlement:storageWoodHousehold calls=1 tris=4294
  settlement:storageWoodSettlementPrimary calls=1 tris=390
  settlement:workplace         calls=5 tris=2039
  terrain                      calls=8 tris=553222
  vegetation                   calls=2 tris=677

Shadow (refresh only):
  calls avg: 535  tris avg: 2113588
  info calls avg: 535  residual calls avg: 0
  switches avg: material=157 program=174.1  actor: calls=120.6 material=0 program=14.1
  skinning avg: skinned calls=114.6 skeletons first used=33.1
  environment                  calls=2 tris=1736
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=11 tris=12207
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=84 tris=14114
  settlement:decor             calls=193 tris=370162
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=12 tris=1884
  settlement:houseStatic       calls=33 tris=44402
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=33 tris=155616

Main:
  calls avg: 915  tris avg: 7106040
  info calls avg: 1449  residual calls avg: 0
  switches avg: material=347.5 program=167.5  actor: calls=179.5 material=114.5 program=52.9
  skinning avg: skinned calls=172.5 skeletons first used=28.6
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:dog              calls=26 tris=9446
  faunaFamily:horse            calls=7 tris=1970
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=10 tris=2976
  faunaFamily:wolf             calls=15 tris=7272
  grass                        calls=41 tris=4546384
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=229 tris=20641
  settlement:decor             calls=43 tris=93026
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=21 tris=1008
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=46 tris=49906
  settlement:landmarkGarden    calls=12 tris=140304
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=16 tris=300
  settlement:storageBarrel     calls=12 tris=20760
  settlement:storageContainer  calls=18 tris=3936
  settlement:storageGoods      calls=56 tris=11536
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=2400
  settlement:storageWoodHousehold calls=2 tris=8580
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=9 tris=4074
  terrain                      calls=26 tris=1916120
  vegetation                   calls=10 tris=3794
  water                        calls=2 tris=81920


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

[LONG FRAME] 117.6ms
simulate        96.8ms
render          20.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.5ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA           94.3ms
PHYSICS          0.1ms
RENDER          17.1ms
OTHER            1.1ms

Long frame #2:

[LONG FRAME] 107.1ms
simulate        92.6ms
render          14.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              3.3ms
FAUNA           87.4ms
PHYSICS          0.1ms
RENDER          14.1ms
OTHER            2.0ms

Long frame #3:

[LONG FRAME] 93ms
simulate        74.8ms
render          18.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.9ms
STREAMING        0.1ms
NPC              3.2ms
FAUNA           69.6ms
PHYSICS          0.3ms
RENDER          11.1ms
OTHER            1.8ms

streaming / stages:
  chunkUpdate                  0.1ms

Long frame #4:

[LONG FRAME] 92.4ms
simulate        73.9ms
render          18.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.8ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           69.0ms
PHYSICS          0.1ms
RENDER          14.5ms
OTHER            1.4ms

Long frame #5:

[LONG FRAME] 85ms
simulate        63.8ms
render          20.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.2ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA           59.4ms
PHYSICS          0.1ms
RENDER          16.6ms
OTHER            2.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=16.0 ms  p95=18.9 ms  max=19.7 ms  Δavg vs baseline=—
  hide-grass           avg=14.6 ms  p95=18.2 ms  max=19.4 ms  Δavg vs baseline=-1.3 ms (-8%)
  hide-vegetation      avg=14.7 ms  p95=18.2 ms  max=18.4 ms  Δavg vs baseline=-1.2 ms (-8%)
  no vegetation/grass  avg=19.3 ms  p95=23.3 ms  max=24.5 ms  Δavg vs baseline=+3.3 ms (+21%)
  hide-environment     avg=17.9 ms  p95=21.0 ms  max=21.3 ms  Δavg vs baseline=+2.0 ms (+12%)
  hide-settlement      avg=12.4 ms  p95=14.4 ms  max=17.0 ms  Δavg vs baseline=-3.6 ms (-22%)
  no water             avg=15.3 ms  p95=20.2 ms  max=22.7 ms  Δavg vs baseline=-0.7 ms (-4%)
  hide-terrain         avg=18.1 ms  p95=22.2 ms  max=23.4 ms  Δavg vs baseline=+2.1 ms (+13%)
  hide-npc-fauna       avg=12.6 ms  p95=16.0 ms  max=17.3 ms  Δavg vs baseline=-3.3 ms (-21%)
  no-shadows           avg=15.2 ms  p95=18.4 ms  max=19.0 ms  Δavg vs baseline=-0.8 ms (-5%)
  no-ao                avg=20.8 ms  p95=24.5 ms  max=25.6 ms  Δavg vs baseline=+4.8 ms (+30%)
  no-bloom             avg=20.8 ms  p95=26.0 ms  max=26.4 ms  Δavg vs baseline=+4.8 ms (+30%)
  no-smaa              avg=20.2 ms  p95=24.1 ms  max=24.7 ms  Δavg vs baseline=+4.2 ms (+26%)
  no-god-rays          avg=21.6 ms  p95=24.9 ms  max=25.8 ms  Δavg vs baseline=+5.6 ms (+35%)
  no-film-grade        avg=22.0 ms  p95=24.6 ms  max=25.0 ms  Δavg vs baseline=+6.0 ms (+38%)
  no postprocessing    avg=16.4 ms  p95=21.9 ms  max=22.7 ms  Δavg vs baseline=+0.4 ms (+2%)
  no mirrors           avg=18.2 ms  p95=23.6 ms  max=24.9 ms  Δavg vs baseline=+2.2 ms (+14%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=21.7 ms  p95=23.9 ms  max=24.1 ms
  CPU wall      avg=16.0 ms  p95=18.9 ms  max=19.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
