# Seedvale Performance Benchmark Report

> Generated: 2026-10-31T08:43:41.351Z
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
Frames: 1132
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 977966ac6b0ce19aabe3e3acdf91b9462c21824e
  runId: 2026-10-31T08-42-40-094Z-ivs6pb
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
  camera: pos=(-8.1, 11.7, -0.3)
  anchor: (-8.1, -11.5)
  populationGate: stable waited=5180ms npc=24
  gpuTimer: available=true resolved=true samples=1139 span=postprocess+labels

FPS:
  avg: 46.1
  min: 7
  p1: 16

Frame time (wall-clock):
  avg: 21.7 ms
  p50: 20.5 ms
  p95: 25.9 ms
  p99: 60.8 ms
  max: 153.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.1 p95=5.9 p99=42.8 max=132.1 n=1132
  render: p50=15.7 p95=20.9 p99=22.2 max=70.3 n=1132
  frame: p50=20.5 p95=25.9 p99=60.8 max=153.4 n=1132

Rendering (combined renderer.info):
  draw calls: 1812 avg / 2118 max
  triangles: 10.49M avg
  mirror draws: 288 avg
  geometries: 676
  textures: 319

Pass submissions (actual):
  reliability: observed
  frames: 1140 shadowRefresh=1140 shadowSkipped=0
  mirror calls avg: 288
  shadow calls avg: 540
  main calls avg: 983

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
  other            draws=414 tris=28.7k meshes=414 inst=416

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=103 tris=244.6k meshes=103 inst=178
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=427 tris=515.8k meshes=427 inst=1188
  npc              draws=75 tris=98.4k meshes=75 inst=75
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
      mid  agents=8 camera-relevant=2 draws=75 tris=98.4k
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
      near agents=2 camera-relevant=1 draws=13 tris=4.1k
      mid  agents=11 camera-relevant=8 draws=41 tris=15.5k
      far  agents=48 camera-relevant=13 draws=193 tris=79.1k

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
  other                    nodes=669 composed=652 multiplied=669 skinned=9
  top scene children:
    fauna ×61                nodes=2637 composed=2637 multiplied=2637 skinned=212
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1342 composed=1342 multiplied=1342 skinned=0
    Group ×78                nodes=502 composed=502 multiplied=502 skinned=9
    chunk-items ×26          nodes=371 composed=371 multiplied=371 skinned=0
    chunk-environmen ×5      nodes=214 composed=214 multiplied=214 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.4 ms
  NPC            2.1 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         14.0 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.9 ms draws=1803 tris=10.49M
  hide-grass         render=13.6 ms draws=1770 tris=5.58M
  hide-vegetation    render=13.0 ms draws=1772 tris=10.33M
  hide-vegetation-grass render=12.6 ms draws=1725 tris=5.42M
  hide-environment   render=12.4 ms draws=1725 tris=10.48M
  hide-settlement    render=9.7 ms draws=1004 tris=9.43M
  hide-water         render=13.7 ms draws=1811 tris=10.33M
  hide-terrain       render=12.8 ms draws=1761 tris=6.58M
  hide-npc-fauna     render=8.1 ms draws=1493 tris=10.20M
  no-shadows         render=8.2 ms draws=1297 tris=8.44M
  no-ao              render=10.8 ms draws=1791 tris=10.44M
  no-bloom           render=11.4 ms draws=1803 tris=10.49M
  no-smaa            render=13.2 ms draws=1810 tris=10.49M
  no-god-rays        render=14.6 ms draws=1812 tris=10.49M
  no-film-grade      render=14.4 ms draws=1808 tris=10.49M
  no-postprocessing  render=11.3 ms draws=1780 tris=10.49M
  no-reflections     render=10.7 ms draws=1517 tris=9.70M

Frame attribution:
  frame max: 153.4 ms
  largest labelled hitch: 0 ms
  unattributed: 153.4 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 153.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1132/1132

Recommendation:
Largest frame (153.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.1 ms/frame
  crowd pass: 0.0 ms/frame (10.7 ms cumulative)
  agent updates: 1.3 ms/frame (1433.9 ms cumulative)
  livestock: 0.6 ms/frame (702.5 ms cumulative)
    loaded tick: 0.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (48.3 predator candidates/frame)
    pest scans: 2.2/frame (2.2 rat candidates/frame)
    nearest scans: 12.7/frame (0.0 candidates/frame)
    water samples: 26.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 26.8/frame, 0.00 ms/frame (worst call 0.10 ms, 2141.9 colliders/frame)
    full-rate agents/frame: 1.3
    reduced-cadence agents/frame: 26.9
    behaviour executions/frame: 12.9
    presentation executions/frame: 11.2
  rats: 0.1 ms/frame (79.1 ms cumulative)
  social: 0.0 ms/frame (4.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (146.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.7 ms/frame (1954.0 ms cumulative)
  forest sampling: 0.1 ms/frame (102.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (21.6 ms cumulative)
    targeting: 0.0 ms/frame (21.3 ms cumulative)
    decision: 0.0 ms/frame (14.6 ms cumulative)
    behaviour: 1.2 ms/frame (1347.4 ms cumulative)
    life/presentation: 0.3 ms/frame (350.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.6
    decision passes/frame: 29.6
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.0
    full-rate agents/frame: 7.7
    reduced-cadence agents/frame: 21.9
    behaviour executions/frame: 15.0
    presentation executions/frame: 13.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.6
    village scan candidates/frame: 437.8
    player perception checks/frame: 29.6

  nearest scans: 21.7/frame (24578 calls)
  nearest candidates checked: 219.2/frame (248122 total)
  herd leader scans: 0.2/frame (200 calls)
  herd candidates checked: 5.3/frame (6000 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.8/frame (133.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 38.4/frame, 0.10 ms/frame (worst call 1.10 ms)
    collider queries: 38.4/frame, 0.00 ms/frame (worst call 0.20 ms, 3749.3 colliders/frame)

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
Frames: 1140
Shadow refresh frames: 1140
Shadow skipped frames: 0

Mirror:
  calls avg: 288  tris avg: 789085
  info calls avg: 288  residual calls avg: 0
  switches avg: material=104.9 program=54.4  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=434
  other                        calls=110 tris=5777
  settlement:decor             calls=25 tris=51521
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=11 tris=504
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=11 tris=1155
  settlement:houseStatic       calls=27 tris=32622
  settlement:landmarkGarden    calls=6 tris=70152
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=3740
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=7 tris=120
  settlement:storageBarrel     calls=6 tris=10380
  settlement:storageContainer  calls=9 tris=1968
  settlement:storageGoods      calls=26 tris=5356
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4290
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=5 tris=2037
  terrain                      calls=8 tris=589548
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 540  tris avg: 2049806
  info calls avg: 540  residual calls avg: 0
  switches avg: material=157.9 program=176.9  actor: calls=129 material=0 program=16
  skinning avg: skinned calls=123 skeletons first used=28
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
  other                        calls=81 tris=13993
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
  terrain                      calls=18 tris=1326820
  vegetation                   calls=34 tris=155892

Main:
  calls avg: 983  tris avg: 7651402
  info calls avg: 1524  residual calls avg: 0
  switches avg: material=364.8 program=174.8  actor: calls=191.6 material=114.9 program=51
  skinning avg: skinned calls=184.6 skeletons first used=28.1
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:dog              calls=27 tris=9660
  faunaFamily:horse            calls=14 tris=4032
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=10 tris=3050
  faunaFamily:wolf             calls=16 tris=7960
  grass                        calls=43 tris=4905808
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=1 tris=1092
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=262 tris=20957
  settlement:decor             calls=48 tris=102204
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=21 tris=1008
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=55 tris=67476
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
  settlement:workplace         calls=15 tris=7358
  terrain                      calls=27 tris=1989848
  vegetation                   calls=10 tris=3794
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

[LONG FRAME] 153.4ms
simulate       132.1ms
render          20.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.4ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA          128.7ms
PHYSICS          0.3ms
RENDER          15.5ms
OTHER            1.7ms

Long frame #2:

[LONG FRAME] 125ms
simulate       112.2ms
render          12.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.1ms
NPC              2.2ms
FAUNA          108.6ms
PHYSICS          0.1ms
RENDER          12.5ms
OTHER            1.5ms

streaming / stages:
  chunkUpdate                  0.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.9 ms  p95=14.8 ms  max=16.1 ms  Δavg vs baseline=—
  hide-grass           avg=13.6 ms  p95=15.3 ms  max=19.3 ms  Δavg vs baseline=+0.7 ms (+6%)
  hide-vegetation      avg=13.0 ms  p95=14.4 ms  max=15.4 ms  Δavg vs baseline=+0.1 ms (+1%)
  no vegetation/grass  avg=12.6 ms  p95=13.6 ms  max=14.3 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-environment     avg=12.4 ms  p95=13.6 ms  max=13.8 ms  Δavg vs baseline=-0.5 ms (-4%)
  hide-settlement      avg=9.7 ms  p95=11.5 ms  max=11.5 ms  Δavg vs baseline=-3.2 ms (-25%)
  no water             avg=13.7 ms  p95=14.6 ms  max=14.9 ms  Δavg vs baseline=+0.8 ms (+6%)
  hide-terrain         avg=12.8 ms  p95=14.0 ms  max=14.3 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-npc-fauna       avg=8.1 ms  p95=9.7 ms  max=15.0 ms  Δavg vs baseline=-4.8 ms (-37%)
  no-shadows           avg=8.2 ms  p95=10.5 ms  max=13.5 ms  Δavg vs baseline=-4.6 ms (-36%)
  no-ao                avg=10.8 ms  p95=12.2 ms  max=13.9 ms  Δavg vs baseline=-2.1 ms (-16%)
  no-bloom             avg=11.4 ms  p95=12.5 ms  max=12.7 ms  Δavg vs baseline=-1.5 ms (-11%)
  no-smaa              avg=13.2 ms  p95=17.2 ms  max=21.9 ms  Δavg vs baseline=+0.3 ms (+2%)
  no-god-rays          avg=14.6 ms  p95=16.8 ms  max=17.4 ms  Δavg vs baseline=+1.7 ms (+13%)
  no-film-grade        avg=14.4 ms  p95=15.5 ms  max=15.8 ms  Δavg vs baseline=+1.5 ms (+12%)
  no postprocessing    avg=11.3 ms  p95=14.2 ms  max=16.0 ms  Δavg vs baseline=-1.6 ms (-12%)
  no mirrors           avg=10.7 ms  p95=11.9 ms  max=15.5 ms  Δavg vs baseline=-2.2 ms (-17%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (32 samples resolved during the baseline window)
  GPU elapsed   avg=22.2 ms  p95=23.5 ms  max=24.7 ms
  CPU wall      avg=12.9 ms  p95=14.8 ms  max=16.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
