# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T07:16:43.933Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: forest
Duration: 30s
Frames: 1214
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: d2b14bf7cbf380131bfa43bc2bd685af918f30e5
  runId: 2026-10-30T07-15-40-798Z-c2ftou
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
  viewport: 1920x945
  drawingBuffer: 1920x945
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5005ms npc=20
  gpuTimer: available=true resolved=true samples=1220 span=postprocess+labels

FPS:
  avg: 42.3
  min: 8
  p1: 18

Frame time (wall-clock):
  avg: 23.6 ms
  p50: 22.7 ms
  p95: 31.9 ms
  p99: 55.1 ms
  max: 132.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.8 p95=6.3 p99=38.2 max=113.6 n=1214
  render: p50=18.4 p95=25.5 p99=30.7 max=40.8 n=1214
  frame: p50=22.7 p95=31.9 p99=55.1 max=132.6 n=1214

Rendering (combined renderer.info):
  draw calls: 1710 avg / 2032 max
  triangles: 12.53M avg
  mirror draws: 302 avg
  geometries: 543
  textures: 503

Pass submissions (actual):
  reliability: observed
  frames: 1223 shadowRefresh=1223 shadowSkipped=0
  mirror calls avg: 302
  shadow calls avg: 424
  main calls avg: 984

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.47M meshes=72 inst=563579
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=607 tris=687.3k meshes=607 inst=1247
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=184 tris=238.1k meshes=184 inst=184
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=234 tris=26.3k meshes=234 inst=234

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=408 tris=488.6k meshes=408 inst=972
  npc              draws=16 tris=23.0k meshes=16 inst=16
  fauna            draws=18 tris=6.5k meshes=18 inst=18
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=108 tris=14.8k meshes=108 inst=108

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.8k meshes=3 inst=10
  storageContainer draws=18 tris=3.5k meshes=18 inst=46
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.2k meshes=8 inst=22
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=29 tris=540 meshes=29 inst=29

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=11 draws=102 tris=124.6k skinned=102/102
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      near agents=2 camera-relevant=2 draws=16 tris=23.0k
      far  agents=18 camera-relevant=11 draws=168 tris=215.0k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=3 draws=24 tris=6.5k skinned=24/24
      dog              agents=4 draws=23 tris=7.8k skinned=23/23
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      sheep            agents=8 draws=16 tris=4.9k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      chicken          agents=3 draws=15 tris=1.9k skinned=0/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      near agents=1 camera-relevant=1 draws=2 tris=610
      mid  agents=3 camera-relevant=1 draws=16 tris=5.9k
      far  agents=48 camera-relevant=16 draws=194 tris=81.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=122 composed=122 multiplied=122 skinned=0
  environment              nodes=252 composed=252 multiplied=252 skinned=0
  settlement               nodes=1204 composed=1204 multiplied=1204 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1563 composed=1563 multiplied=1563 skinned=184
  fauna                    nodes=2299 composed=2299 multiplied=2299 skinned=188
  items                    nodes=252 composed=252 multiplied=252 skinned=0
  other                    nodes=453 composed=436 multiplied=453 skinned=9
  top scene children:
    fauna ×52                nodes=2299 composed=2299 multiplied=2299 skinned=188
    npc ×20                  nodes=1563 composed=1563 multiplied=1563 skinned=184
    settlement ×3            nodes=1204 composed=1204 multiplied=1204 skinned=0
    Group ×42                nodes=286 composed=286 multiplied=286 skinned=9
    chunk-items ×20          nodes=252 composed=252 multiplied=252 skinned=0
    chunk-environmen ×4      nodes=207 composed=207 multiplied=207 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    Root_Scene ×17           nodes=58 composed=58 multiplied=58 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.6 ms
  NPC            2.2 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         16.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=14.0 ms draws=1704 tris=12.53M
  hide-grass         render=15.1 ms draws=1661 tris=5.84M
  hide-vegetation    render=12.6 ms draws=1658 tris=12.36M
  hide-vegetation-grass render=16.0 ms draws=1609 tris=5.66M
  hide-environment   render=14.2 ms draws=1614 tris=12.52M
  hide-settlement    render=11.1 ms draws=729 tris=11.28M
  hide-water         render=17.1 ms draws=1702 tris=12.30M
  hide-terrain       render=15.2 ms draws=1649 tris=8.59M
  hide-npc-fauna     render=10.2 ms draws=1479 tris=12.31M
  no-shadows         render=11.4 ms draws=1307 tris=10.51M
  no-ao              render=15.8 ms draws=1702 tris=12.53M
  no-bloom           render=15.0 ms draws=1696 tris=12.53M
  no-smaa            render=14.5 ms draws=1709 tris=12.52M
  no-god-rays        render=14.8 ms draws=1713 tris=12.52M
  no-film-grade      render=12.5 ms draws=1715 tris=12.52M
  no-postprocessing  render=14.0 ms draws=1687 tris=12.52M
  no-reflections     render=13.8 ms draws=1412 tris=11.62M

Frame attribution:
  frame max: 132.6 ms
  largest labelled hitch: 0 ms
  unattributed: 132.6 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 132.6 ms

Raw sidecar:
  sampling=full factor=1 exported=1214/1214

Recommendation:
Largest frame (132.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 2.2 ms/frame
  crowd pass: 0.0 ms/frame (14.2 ms cumulative)
  agent updates: 1.2 ms/frame (1423.5 ms cumulative)
  livestock: 0.7 ms/frame (856.9 ms cumulative)
    loaded tick: 0.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.5 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 6.2/frame (0.0 candidates/frame)
    water samples: 13.1/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 13.1/frame, 0.00 ms/frame (worst call 0.10 ms, 700.0 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 6.2
    presentation executions/frame: 5.8
  rats: 0.1 ms/frame (143.4 ms cumulative)
  social: 0.0 ms/frame (7.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (167.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.2 ms/frame (1491.0 ms cumulative)
  forest sampling: 0.1 ms/frame (103.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (25.8 ms cumulative)
    targeting: 0.0 ms/frame (18.2 ms cumulative)
    decision: 0.0 ms/frame (14.2 ms cumulative)
    behaviour: 0.7 ms/frame (845.7 ms cumulative)
    life/presentation: 0.3 ms/frame (369.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 28.9
    decision passes/frame: 28.9
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.8
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 21.3
    behaviour executions/frame: 14.8
    presentation executions/frame: 13.5

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 28.9
    village scan candidates/frame: 365.0
    player perception checks/frame: 28.9

  nearest scans: 22.1/frame (26827 calls)
  nearest candidates checked: 163.9/frame (198950 total)
  herd leader scans: 0.1/frame (160 calls)
  herd candidates checked: 4.0/frame (4800 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.1/frame (140.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 37.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 37.4/frame, 0.00 ms/frame (worst call 0.10 ms, 2511.7 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=326361 filler=624138
Submitted instances: full=265630 filler=297949
Meshes submitted: 72
LOD submitted fraction: full=0.8139146527924599 filler=0.4773767980799118
Flowers: unavailable
Allocation bytes (estimated): 91247904
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1223
Shadow refresh frames: 1223
Shadow skipped frames: 0

Mirror:
  calls avg: 302  tris avg: 907970
  info calls avg: 302  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10522
  settlement:decor             calls=85 tris=161034
  settlement:fence             calls=2 tris=3235
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=11 tris=504
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=895
  settlement:houseInteractive  calls=11 tris=1156
  settlement:houseStatic       calls=25 tris=18432
  settlement:landmarkGarden    calls=6 tris=52657
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1872
  settlement:landmarkWellHousehold calls=5 tris=3743
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=9 tris=168
  settlement:storageBarrel     calls=6 tris=7618
  settlement:storageContainer  calls=9 tris=1345
  settlement:storageGoods      calls=29 tris=5979
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=801
  settlement:storageWoodHousehold calls=1 tris=2732
  settlement:storageWoodSettlementPrimary calls=1 tris=781
  settlement:workplace         calls=8 tris=4507
  terrain                      calls=9 tris=626924
  vegetation                   calls=2 tris=677

Shadow (refresh only):
  calls avg: 424  tris avg: 2023567
  info calls avg: 424  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=8 tris=3696
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=2632
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant            calls=0 tris=57
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=67 tris=13664
  settlement:decor             calls=196 tris=384574
  settlement:fireHouseInteriorLamp calls=2 tris=216
  settlement:houseInteractive  calls=4 tris=628
  settlement:houseStatic       calls=23 tris=10310
  settlement:landmarkGarden    calls=1 tris=800
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=6 tris=804
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=1 tris=1560
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 984  tris avg: 9604137
  info calls avg: 1408  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=4 tris=1246
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=687
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=19 tris=9484
  grass                        calls=49 tris=6697644
  items                        calls=6 tris=956
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=57 tris=69015
  npcFamily:Peasant_Boots      calls=18 tris=24430
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=132 tris=21697
  settlement:decor             calls=167 tris=318660
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=21 tris=1008
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=50 tris=36834
  settlement:landmarkGarden    calls=12 tris=105228
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=16 tris=300
  settlement:storageBarrel     calls=12 tris=15224
  settlement:storageContainer  calls=18 tris=2688
  settlement:storageGoods      calls=58 tris=11948
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=1600
  settlement:storageWoodHousehold calls=2 tris=5460
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=16 tris=9006
  terrain                      calls=26 tris=1916120
  vegetation                   calls=6 tris=1958
  water                        calls=4 tris=229376


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

[LONG FRAME] 132.6ms
simulate       113.6ms
render          18.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.2ms
FAUNA          109.6ms
PHYSICS          0.2ms
RENDER          18.6ms
OTHER            2.0ms

Long frame #2:

[LONG FRAME] 115.3ms
simulate        97.8ms
render          17.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.2ms
FAUNA           93.8ms
PHYSICS          0.1ms
RENDER          17.1ms
OTHER            2.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=14.0 ms  p95=19.0 ms  max=22.3 ms  Δavg vs baseline=—
  hide-grass           avg=15.1 ms  p95=18.4 ms  max=19.6 ms  Δavg vs baseline=+1.1 ms (+8%)
  hide-vegetation      avg=12.6 ms  p95=14.5 ms  max=15.0 ms  Δavg vs baseline=-1.4 ms (-10%)
  no vegetation/grass  avg=16.0 ms  p95=23.3 ms  max=31.8 ms  Δavg vs baseline=+2.0 ms (+14%)
  hide-environment     avg=14.2 ms  p95=16.1 ms  max=16.7 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-settlement      avg=11.1 ms  p95=13.5 ms  max=15.4 ms  Δavg vs baseline=-2.9 ms (-21%)
  no water             avg=17.1 ms  p95=21.3 ms  max=22.0 ms  Δavg vs baseline=+3.1 ms (+22%)
  hide-terrain         avg=15.2 ms  p95=17.2 ms  max=17.6 ms  Δavg vs baseline=+1.2 ms (+8%)
  hide-npc-fauna       avg=10.2 ms  p95=12.4 ms  max=13.6 ms  Δavg vs baseline=-3.8 ms (-27%)
  no-shadows           avg=11.4 ms  p95=14.1 ms  max=26.7 ms  Δavg vs baseline=-2.6 ms (-18%)
  no-ao                avg=15.8 ms  p95=23.8 ms  max=26.0 ms  Δavg vs baseline=+1.8 ms (+13%)
  no-bloom             avg=15.0 ms  p95=21.9 ms  max=25.0 ms  Δavg vs baseline=+0.9 ms (+7%)
  no-smaa              avg=14.5 ms  p95=18.9 ms  max=19.1 ms  Δavg vs baseline=+0.5 ms (+4%)
  no-god-rays          avg=14.8 ms  p95=17.8 ms  max=19.1 ms  Δavg vs baseline=+0.8 ms (+6%)
  no-film-grade        avg=12.5 ms  p95=17.6 ms  max=18.5 ms  Δavg vs baseline=-1.5 ms (-11%)
  no postprocessing    avg=14.0 ms  p95=17.5 ms  max=19.7 ms  Δavg vs baseline=-0.1 ms (-0%)
  no mirrors           avg=13.8 ms  p95=16.6 ms  max=18.6 ms  Δavg vs baseline=-0.2 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.7 ms  p95=24.4 ms  max=25.4 ms
  CPU wall      avg=14.0 ms  p95=19.0 ms  max=22.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
