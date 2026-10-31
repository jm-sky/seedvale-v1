# Seedvale Performance Benchmark Report

> Generated: 2026-10-31T08:21:10.571Z
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
Frames: 1225
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 977966ac6b0ce19aabe3e3acdf91b9462c21824e
  runId: 2026-10-31T08-20-08-514Z-iz8p5j
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
  populationGate: stable waited=5204ms npc=24
  gpuTimer: available=true resolved=true samples=1227 span=postprocess+labels

FPS:
  avg: 58.2
  min: 9
  p1: 23

Frame time (wall-clock):
  avg: 17.2 ms
  p50: 16.7 ms
  p95: 20.8 ms
  p99: 43.4 ms
  max: 111.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.6 p95=5.4 p99=30.4 max=99.4 n=1225
  render: p50=12.5 p95=15.7 p99=18.2 max=30.8 n=1225
  frame: p50=16.7 p95=20.8 p99=43.4 max=111.2 n=1225

Rendering (combined renderer.info):
  draw calls: 1711 avg / 1983 max
  triangles: 9.96M avg
  mirror draws: 259 avg
  geometries: 632
  textures: 281

Pass submissions (actual):
  reliability: observed
  frames: 1233 shadowRefresh=1233 shadowSkipped=0
  mirror calls avg: 259
  shadow calls avg: 541
  main calls avg: 911

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
  other            draws=422 tris=28.5k meshes=422 inst=422

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=103 tris=244.6k meshes=103 inst=178
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=427 tris=515.8k meshes=427 inst=1188
  npc              draws=75 tris=98.4k meshes=75 inst=75
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=29 tris=19.1k meshes=29 inst=29
  other            draws=106 tris=14.6k meshes=106 inst=106

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
      near agents=1 camera-relevant=1 draws=9 tris=10.5k
      mid  agents=7 camera-relevant=1 draws=66 tris=87.9k
      far  agents=16 camera-relevant=9 draws=148 tris=190.7k
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
      near agents=6 camera-relevant=4 draws=28 tris=9.0k
      mid  agents=7 camera-relevant=4 draws=26 tris=10.6k
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
  other                    nodes=677 composed=660 multiplied=677 skinned=9
  top scene children:
    fauna ×61                nodes=2637 composed=2637 multiplied=2637 skinned=212
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1342 composed=1342 multiplied=1342 skinned=0
    Group ×80                nodes=514 composed=514 multiplied=514 skinned=9
    chunk-items ×26          nodes=371 composed=371 multiplied=371 skinned=0
    chunk-environmen ×5      nodes=214 composed=214 multiplied=214 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.0 ms
  NPC            1.9 ms
  FAUNA          1.6 ms
  PHYSICS        0.1 ms
  RENDER         10.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=9.4 ms draws=1718 tris=9.97M
  hide-grass         render=12.1 ms draws=1661 tris=5.37M
  hide-vegetation    render=9.3 ms draws=1674 tris=9.81M
  hide-vegetation-grass render=9.2 ms draws=1633 tris=5.26M
  hide-environment   render=9.2 ms draws=1612 tris=9.91M
  hide-settlement    render=6.5 ms draws=947 tris=8.99M
  hide-water         render=9.4 ms draws=1717 tris=9.89M
  hide-terrain       render=11.6 ms draws=1649 tris=6.09M
  hide-npc-fauna     render=6.6 ms draws=1407 tris=9.69M
  no-shadows         render=7.4 ms draws=1197 tris=7.85M
  no-ao              render=10.8 ms draws=1710 tris=9.97M
  no-bloom           render=9.7 ms draws=1716 tris=9.97M
  no-smaa            render=9.9 ms draws=1728 tris=9.97M
  no-god-rays        render=9.6 ms draws=1731 tris=9.97M
  no-film-grade      render=9.7 ms draws=1732 tris=9.97M
  no-postprocessing  render=11.0 ms draws=1704 tris=9.97M
  no-reflections     render=9.7 ms draws=1464 tris=9.23M

Frame attribution:
  frame max: 111.2 ms
  largest labelled hitch: 0 ms
  unattributed: 111.2 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 111.2 ms

Raw sidecar:
  sampling=full factor=1 exported=1225/1225

Recommendation:
Largest frame (111.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 1.9 ms/frame
  crowd pass: 0.0 ms/frame (10.0 ms cumulative)
  agent updates: 1.1 ms/frame (1400.9 ms cumulative)
  livestock: 0.5 ms/frame (616.0 ms cumulative)
    loaded tick: 0.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (48.3 predator candidates/frame)
    pest scans: 2.3/frame (2.3 rat candidates/frame)
    nearest scans: 12.0/frame (0.0 candidates/frame)
    water samples: 26.6/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 26.6/frame, 0.00 ms/frame (worst call 0.10 ms, 2097.1 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 27.1
    behaviour executions/frame: 12.0
    presentation executions/frame: 13.3
  rats: 0.1 ms/frame (130.9 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (134.4 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.5 ms/frame (1894.2 ms cumulative)
  forest sampling: 0.1 ms/frame (90.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (21.0 ms cumulative)
    targeting: 0.0 ms/frame (16.6 ms cumulative)
    decision: 0.0 ms/frame (11.5 ms cumulative)
    behaviour: 1.0 ms/frame (1285.4 ms cumulative)
    life/presentation: 0.3 ms/frame (385.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.7
    full-rate agents/frame: 7.8
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 14.7
    presentation executions/frame: 13.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 441.1
    player perception checks/frame: 30.0

  nearest scans: 20.9/frame (25544 calls)
  nearest candidates checked: 214.3/frame (262459 total)
  herd leader scans: 0.1/frame (135 calls)
  herd candidates checked: 3.3/frame (4050 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.3/frame (117.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 77.2/frame, 0.10 ms/frame (worst call 0.60 ms)
    collider queries: 77.2/frame, 0.10 ms/frame (worst call 1.10 ms, 7483.8 colliders/frame)

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
Frames: 1233
Shadow refresh frames: 1233
Shadow skipped frames: 0

Mirror:
  calls avg: 259  tris avg: 735831
  info calls avg: 259  residual calls avg: 0
  switches avg: material=96.3 program=52.6  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=0 tris=431
  other                        calls=93 tris=5467
  settlement:decor             calls=25 tris=51145
  settlement:fence             calls=2 tris=3208
  settlement:fireCampfire      calls=4 tris=306
  settlement:fireHouseExteriorLamp calls=10 tris=500
  settlement:fireHouseInteriorLamp calls=3 tris=375
  settlement:fireVillageTorch  calls=10 tris=710
  settlement:houseInteractive  calls=10 tris=1147
  settlement:houseStatic       calls=23 tris=24771
  settlement:landmarkGarden    calls=6 tris=69640
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=928
  settlement:landmarkWellHousehold calls=2 tris=2785
  settlement:landmarkWellPasture calls=2 tris=928
  settlement:other             calls=6 tris=119
  settlement:storageBarrel     calls=4 tris=8930
  settlement:storageContainer  calls=8 tris=1829
  settlement:storageGoods      calls=25 tris=5112
  settlement:storageHay        calls=1 tris=484
  settlement:storageTrough     calls=3 tris=1191
  settlement:storageWoodHousehold calls=1 tris=4259
  settlement:storageWoodSettlementPrimary calls=0 tris=387
  settlement:workplace         calls=4 tris=2022
  terrain                      calls=7 tris=548650
  vegetation                   calls=2 tris=671

Shadow (refresh only):
  calls avg: 541  tris avg: 2123119
  info calls avg: 541  residual calls avg: 0
  switches avg: material=157 program=175  actor: calls=129 material=0 program=17
  skinning avg: skinned calls=123 skeletons first used=34
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
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=82 tris=13854
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
  calls avg: 911  tris avg: 7105044
  info calls avg: 1452  residual calls avg: 0
  switches avg: material=341.7 program=169.3  actor: calls=177.6 material=111.7 program=52.3
  skinning avg: skinned calls=170.6 skeletons first used=27.4
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:dog              calls=25 tris=9082
  faunaFamily:horse            calls=6 tris=1996
  faunaFamily:rat              calls=2 tris=4985
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=10 tris=3050
  faunaFamily:wolf             calls=13 tris=6691
  grass                        calls=41 tris=4546384
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=227 tris=20503
  settlement:decor             calls=43 tris=92032
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 111.2ms
simulate        99.4ms
render          11.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA           96.7ms
PHYSICS          0.1ms
RENDER          11.5ms
OTHER            1.2ms

Long frame #2:

[LONG FRAME] 109.4ms
simulate        92.3ms
render          16.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.0ms
STREAMING        0.0ms
NPC              2.6ms
FAUNA           88.4ms
PHYSICS          0.2ms
RENDER          12.9ms
OTHER            1.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.4 ms  p95=10.4 ms  max=12.1 ms  Δavg vs baseline=—
  hide-grass           avg=12.1 ms  p95=14.6 ms  max=39.1 ms  Δavg vs baseline=+2.6 ms (+28%)
  hide-vegetation      avg=9.3 ms  p95=11.4 ms  max=12.2 ms  Δavg vs baseline=-0.1 ms (-1%)
  no vegetation/grass  avg=9.2 ms  p95=10.2 ms  max=11.3 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-environment     avg=9.2 ms  p95=10.6 ms  max=11.2 ms  Δavg vs baseline=-0.3 ms (-3%)
  hide-settlement      avg=6.5 ms  p95=7.6 ms  max=8.2 ms  Δavg vs baseline=-3.0 ms (-31%)
  no water             avg=9.4 ms  p95=10.7 ms  max=10.9 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-terrain         avg=11.6 ms  p95=14.5 ms  max=15.4 ms  Δavg vs baseline=+2.1 ms (+22%)
  hide-npc-fauna       avg=6.6 ms  p95=8.2 ms  max=8.5 ms  Δavg vs baseline=-2.8 ms (-30%)
  no-shadows           avg=7.4 ms  p95=8.9 ms  max=9.2 ms  Δavg vs baseline=-2.0 ms (-21%)
  no-ao                avg=10.8 ms  p95=10.4 ms  max=59.2 ms  Δavg vs baseline=+1.4 ms (+15%)
  no-bloom             avg=9.7 ms  p95=10.6 ms  max=10.9 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-smaa              avg=9.9 ms  p95=11.5 ms  max=12.3 ms  Δavg vs baseline=+0.4 ms (+5%)
  no-god-rays          avg=9.6 ms  p95=10.5 ms  max=10.5 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-film-grade        avg=9.7 ms  p95=10.6 ms  max=11.3 ms  Δavg vs baseline=+0.2 ms (+2%)
  no postprocessing    avg=11.0 ms  p95=12.4 ms  max=12.7 ms  Δavg vs baseline=+1.6 ms (+16%)
  no mirrors           avg=9.7 ms  p95=10.9 ms  max=11.9 ms  Δavg vs baseline=+0.3 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=22.5 ms  p95=24.9 ms  max=25.7 ms
  CPU wall      avg=9.4 ms  p95=10.4 ms  max=12.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
