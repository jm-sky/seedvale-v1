# Seedvale Performance Benchmark Report

> Generated: 2026-10-31T08:41:13.745Z
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
Frames: 1179
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 977966ac6b0ce19aabe3e3acdf91b9462c21824e
  runId: 2026-10-31T08-40-12-279Z-01xjs0
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
  populationGate: stable waited=5081ms npc=24
  gpuTimer: available=true resolved=true samples=1187 span=postprocess+labels

FPS:
  avg: 44.9
  min: 6
  p1: 26

Frame time (wall-clock):
  avg: 22.3 ms
  p50: 22 ms
  p95: 26.7 ms
  p99: 39.1 ms
  max: 162.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.4 p95=6.1 p99=19.9 max=145.6 n=1179
  render: p50=17.3 p95=21 p99=23.5 max=32.6 n=1179
  frame: p50=22 p95=26.7 p99=39.1 max=162.2 n=1179

Rendering (combined renderer.info):
  draw calls: 1716 avg / 1987 max
  triangles: 9.97M avg
  mirror draws: 261 avg
  geometries: 662
  textures: 292

Pass submissions (actual):
  reliability: observed
  frames: 1188 shadowRefresh=1188 shadowSkipped=0
  mirror calls avg: 261
  shadow calls avg: 540
  main calls avg: 914

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.12M meshes=72 inst=542412
  vegetation       draws=105 tris=251.5k meshes=105 inst=180
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=669 tris=757.1k meshes=669 inst=1535
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=247 tris=98.7k meshes=247 inst=247
  items            draws=251 tris=25.0k meshes=251 inst=251
  other            draws=422 tris=28.5k meshes=422 inst=422

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=103 tris=244.6k meshes=103 inst=178
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=429 tris=512.9k meshes=429 inst=1190
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
  decor            draws=196 tris=374.2k meshes=196 inst=279
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
      near agents=5 camera-relevant=3 draws=27 tris=7.8k
      mid  agents=8 camera-relevant=5 draws=27 tris=11.8k
      far  agents=48 camera-relevant=13 draws=193 tris=79.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=128 composed=128 multiplied=128 skinned=0
  environment              nodes=262 composed=262 multiplied=262 skinned=0
  settlement               nodes=1345 composed=1345 multiplied=1345 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2637 composed=2637 multiplied=2637 skinned=212
  items                    nodes=371 composed=371 multiplied=371 skinned=0
  other                    nodes=677 composed=660 multiplied=677 skinned=9
  top scene children:
    fauna ×61                nodes=2637 composed=2637 multiplied=2637 skinned=212
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1345 composed=1345 multiplied=1345 skinned=0
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
  WATER          2.4 ms
  NPC            2.3 ms
  FAUNA          1.4 ms
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
  full               render=13.0 ms draws=1723 tris=9.97M
  hide-grass         render=13.5 ms draws=1685 tris=5.42M
  hide-vegetation    render=12.9 ms draws=1675 tris=9.81M
  hide-vegetation-grass render=12.4 ms draws=1628 tris=5.26M
  hide-environment   render=12.9 ms draws=1624 tris=9.95M
  hide-settlement    render=9.3 ms draws=946 tris=8.99M
  hide-water         render=13.1 ms draws=1726 tris=9.89M
  hide-terrain       render=12.3 ms draws=1680 tris=6.11M
  hide-npc-fauna     render=8.8 ms draws=1411 tris=9.69M
  no-shadows         render=7.7 ms draws=1211 tris=7.86M
  no-ao              render=10.5 ms draws=1711 tris=9.94M
  no-bloom           render=10.3 ms draws=1717 tris=9.98M
  no-smaa            render=11.3 ms draws=1723 tris=9.97M
  no-god-rays        render=12.1 ms draws=1722 tris=9.97M
  no-film-grade      render=13.0 ms draws=1716 tris=9.97M
  no-postprocessing  render=11.3 ms draws=1692 tris=9.97M
  no-reflections     render=12.9 ms draws=1463 tris=9.23M

Frame attribution:
  frame max: 162.2 ms
  largest labelled hitch: 0 ms
  unattributed: 162.2 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 162.2 ms

Raw sidecar:
  sampling=full factor=1 exported=1179/1179

Recommendation:
Largest frame (162.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.3 ms/frame
  crowd pass: 0.0 ms/frame (11.2 ms cumulative)
  agent updates: 1.4 ms/frame (1688.8 ms cumulative)
  livestock: 0.6 ms/frame (729.3 ms cumulative)
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
    dog guard scans: 6.0/frame (48.4 predator candidates/frame)
    pest scans: 2.3/frame (2.3 rat candidates/frame)
    nearest scans: 12.3/frame (0.0 candidates/frame)
    water samples: 26.8/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 26.8/frame, 0.00 ms/frame (worst call 0.10 ms, 2081.4 colliders/frame)
    full-rate agents/frame: 1.3
    reduced-cadence agents/frame: 26.9
    behaviour executions/frame: 12.6
    presentation executions/frame: 13.8
  rats: 0.1 ms/frame (151.4 ms cumulative)
  social: 0.0 ms/frame (6.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (155.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.4 ms/frame (1599.2 ms cumulative)
  forest sampling: 0.1 ms/frame (106.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (18.9 ms cumulative)
    targeting: 0.0 ms/frame (19.8 ms cumulative)
    decision: 0.0 ms/frame (16.2 ms cumulative)
    behaviour: 0.8 ms/frame (992.1 ms cumulative)
    life/presentation: 0.3 ms/frame (336.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.6
    full-rate agents/frame: 7.2
    reduced-cadence agents/frame: 22.5
    behaviour executions/frame: 14.6
    presentation executions/frame: 13.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.7
    village scan candidates/frame: 438.0
    player perception checks/frame: 29.7

  nearest scans: 21.7/frame (25593 calls)
  nearest candidates checked: 218.6/frame (257768 total)
  herd leader scans: 0.2/frame (183 calls)
  herd candidates checked: 4.7/frame (5490 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.6/frame (128.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 59.2/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 59.2/frame, 0.10 ms/frame (worst call 0.20 ms, 5704.6 colliders/frame)

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
Frames: 1188
Shadow refresh frames: 1188
Shadow skipped frames: 0

Mirror:
  calls avg: 261  tris avg: 741242
  info calls avg: 261  residual calls avg: 0
  switches avg: material=97 program=51.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=434
  other                        calls=94 tris=5508
  settlement:decor             calls=25 tris=51521
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=11 tris=504
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=11 tris=1155
  settlement:houseStatic       calls=23 tris=24953
  settlement:landmarkGarden    calls=6 tris=70152
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=3 tris=2805
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=7 tris=120
  settlement:storageBarrel     calls=5 tris=8996
  settlement:storageContainer  calls=8 tris=1842
  settlement:storageGoods      calls=25 tris=5150
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4290
  settlement:storageWoodSettlementPrimary calls=1 tris=390
  settlement:workplace         calls=5 tris=2037
  terrain                      calls=8 tris=552684
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 540  tris avg: 2121227
  info calls avg: 540  residual calls avg: 0
  switches avg: material=156 program=171  actor: calls=128 material=0 program=15
  skinning avg: skinned calls=122 skeletons first used=27.7
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
  npcFamily:woodcutter         calls=6 tris=9203
  other                        calls=82 tris=13854
  settlement:decor             calls=193 tris=369881
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
  calls avg: 914  tris avg: 7105817
  info calls avg: 1454  residual calls avg: 0
  switches avg: material=342 program=166  actor: calls=181.3 material=112 program=50
  skinning avg: skinned calls=174.3 skeletons first used=27.1
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:dog              calls=27 tris=9556
  faunaFamily:horse            calls=10 tris=2950
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=10 tris=3050
  faunaFamily:wolf             calls=12 tris=6023
  grass                        calls=41 tris=4546384
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=227 tris=20503
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 162.2ms
simulate       145.6ms
render          16.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              3.1ms
FAUNA          140.6ms
PHYSICS          0.2ms
RENDER          16.4ms
OTHER            1.8ms

Long frame #2:

[LONG FRAME] 118.1ms
simulate       102.2ms
render          15.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA           98.3ms
PHYSICS          0.2ms
RENDER          15.6ms
OTHER            1.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=13.0 ms  p95=14.0 ms  max=14.1 ms  Δavg vs baseline=—
  hide-grass           avg=13.5 ms  p95=14.3 ms  max=15.0 ms  Δavg vs baseline=+0.5 ms (+4%)
  hide-vegetation      avg=12.9 ms  p95=14.7 ms  max=15.0 ms  Δavg vs baseline=-0.0 ms (-0%)
  no vegetation/grass  avg=12.4 ms  p95=13.6 ms  max=14.2 ms  Δavg vs baseline=-0.5 ms (-4%)
  hide-environment     avg=12.9 ms  p95=14.4 ms  max=15.4 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-settlement      avg=9.3 ms  p95=10.7 ms  max=11.0 ms  Δavg vs baseline=-3.7 ms (-29%)
  no water             avg=13.1 ms  p95=14.8 ms  max=18.1 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-terrain         avg=12.3 ms  p95=13.5 ms  max=13.6 ms  Δavg vs baseline=-0.7 ms (-5%)
  hide-npc-fauna       avg=8.8 ms  p95=9.8 ms  max=11.9 ms  Δavg vs baseline=-4.2 ms (-32%)
  no-shadows           avg=7.7 ms  p95=9.2 ms  max=11.5 ms  Δavg vs baseline=-5.3 ms (-41%)
  no-ao                avg=10.5 ms  p95=12.2 ms  max=14.3 ms  Δavg vs baseline=-2.4 ms (-19%)
  no-bloom             avg=10.3 ms  p95=11.8 ms  max=12.0 ms  Δavg vs baseline=-2.7 ms (-21%)
  no-smaa              avg=11.3 ms  p95=12.5 ms  max=13.1 ms  Δavg vs baseline=-1.7 ms (-13%)
  no-god-rays          avg=12.1 ms  p95=13.3 ms  max=14.7 ms  Δavg vs baseline=-0.9 ms (-7%)
  no-film-grade        avg=13.0 ms  p95=14.2 ms  max=17.6 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=11.3 ms  p95=12.8 ms  max=14.4 ms  Δavg vs baseline=-1.6 ms (-12%)
  no mirrors           avg=12.9 ms  p95=15.4 ms  max=16.4 ms  Δavg vs baseline=-0.1 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (36 samples resolved during the baseline window)
  GPU elapsed   avg=19.2 ms  p95=19.7 ms  max=20.4 ms
  CPU wall      avg=13.0 ms  p95=14.0 ms  max=14.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
