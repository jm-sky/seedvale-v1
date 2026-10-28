# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:12:21.871Z
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
Frames: 1331
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-11-21-351Z-m4lu1y
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5206ms npc=20
  gpuTimer: available=true resolved=true samples=1340 span=postprocess+labels

FPS:
  avg: 50.9
  min: 11
  p1: 33

Frame time (wall-clock):
  avg: 19.6 ms
  p50: 18.9 ms
  p95: 25.8 ms
  p99: 30.4 ms
  max: 94.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.4 p95=4.8 p99=8.3 max=73.7 n=1331
  render: p50=15.1 p95=21.4 p99=22.9 max=38.5 n=1331
  frame: p50=18.9 p95=25.8 p99=30.4 max=94.7 n=1331

Rendering (combined renderer.info):
  draw calls: 1778 avg / 2104 max
  triangles: 12.55M avg
  mirror draws: 314 avg
  geometries: 559
  textures: 474

Pass submissions (actual):
  reliability: observed
  frames: 1341 shadowRefresh=1341 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 425
  main calls avg: 1038

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.47M meshes=72 inst=563579
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=643 tris=687.0k meshes=643 inst=1248
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=184 tris=238.1k meshes=184 inst=184
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=232 tris=26.0k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=423 tris=488.3k meshes=423 inst=973
  npc              draws=16 tris=23.0k meshes=16 inst=16
  fauna            draws=18 tris=6.5k meshes=18 inst=18
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=106 tris=14.6k meshes=106 inst=106

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.8k meshes=3 inst=10
  storageContainer draws=32 tris=3.5k meshes=32 inst=46
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.2k meshes=8 inst=22
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=198 tris=391.3k meshes=198 inst=304
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
      far  agents=48 camera-relevant=24 draws=194 tris=81.8k

Systems:
  WATER          2.8 ms
  NPC            1.5 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         12.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=13.9 ms draws=1780 tris=12.55M
  hide-grass         render=13.6 ms draws=1730 tris=5.85M
  hide-vegetation    render=12.5 ms draws=1729 tris=12.37M
  hide-vegetation-grass render=14.1 ms draws=1676 tris=5.67M
  hide-environment   render=13.7 ms draws=1681 tris=12.53M
  hide-settlement    render=9.6 ms draws=756 tris=11.33M
  hide-water         render=14.2 ms draws=1773 tris=12.32M
  hide-terrain       render=13.4 ms draws=1724 tris=8.60M
  hide-npc-fauna     render=7.9 ms draws=1518 tris=12.32M
  no-shadows         render=8.0 ms draws=1355 tris=10.46M
  no-ao              render=10.0 ms draws=1770 tris=12.55M
  no-bloom           render=10.0 ms draws=1763 tris=12.55M
  no-smaa            render=10.2 ms draws=1751 tris=12.49M
  no-god-rays        render=10.4 ms draws=1775 tris=12.55M
  no-film-grade      render=10.1 ms draws=1772 tris=12.55M
  no-postprocessing  render=11.3 ms draws=1753 tris=12.55M
  no-reflections     render=10.4 ms draws=1459 tris=11.64M

Frame attribution:
  frame max: 94.7 ms
  largest labelled hitch: 0 ms
  unattributed: 94.7 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 94.7 ms

Raw sidecar:
  sampling=full factor=1 exported=1331/1331

Recommendation:
Largest frame (94.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.5 ms/frame
  crowd pass: 0.0 ms/frame (8.2 ms cumulative)
  agent updates: 0.9 ms/frame (1247.8 ms cumulative)
  livestock: 0.3 ms/frame (446.8 ms cumulative)
    loaded tick: 0.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.1/frame (1.1 rat candidates/frame)
    nearest scans: 5.8/frame (0.0 candidates/frame)
    water samples: 13.6/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 13.6/frame, 0.00 ms/frame (worst call 0.80 ms, 804.3 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 5.9
    presentation executions/frame: 5.4
  rats: 0.1 ms/frame (130.4 ms cumulative)
  social: 0.0 ms/frame (4.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (148.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.1 ms/frame (1443.5 ms cumulative)
  forest sampling: 0.1 ms/frame (99.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (21.9 ms cumulative)
    targeting: 0.0 ms/frame (18.0 ms cumulative)
    decision: 0.0 ms/frame (15.5 ms cumulative)
    behaviour: 0.6 ms/frame (835.8 ms cumulative)
    life/presentation: 0.3 ms/frame (360.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.0
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 22.0
    behaviour executions/frame: 15.0
    presentation executions/frame: 13.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.1
    village scan candidates/frame: 364.8
    player perception checks/frame: 30.1

  nearest scans: 22.1/frame (29372 calls)
  nearest candidates checked: 160.7/frame (213904 total)
  herd leader scans: 0.3/frame (347 calls)
  herd candidates checked: 7.8/frame (10410 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.4/frame (129.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 60.2/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 60.2/frame, 0.10 ms/frame (worst call 1.20 ms, 3383.4 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=616454 filler=624138
Submitted instances: full=265630 filler=297949
Meshes submitted: 72
LOD submitted fraction: full=0.43089995360562183 filler=0.4773767980799118
Flowers: unavailable
Allocation bytes (estimated): 119096832
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1341
Shadow refresh frames: 1341
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 907756
  info calls avg: 314  residual calls avg: 0
  environment                  calls=0 tris=433
  other                        calls=51 tris=10490
  settlement:decor             calls=85 tris=163105
  settlement:fence             calls=2 tris=3225
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=10 tris=503
  settlement:fireHouseInteriorLamp calls=3 tris=377
  settlement:fireVillageTorch  calls=12 tris=892
  settlement:houseInteractive  calls=10 tris=1152
  settlement:houseStatic       calls=25 tris=18376
  settlement:landmarkGarden    calls=6 tris=52496
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1866
  settlement:landmarkWellHousehold calls=5 tris=3732
  settlement:landmarkWellPasture calls=2 tris=933
  settlement:other             calls=8 tris=162
  settlement:storageBarrel     calls=6 tris=7595
  settlement:storageContainer  calls=21 tris=1341
  settlement:storageGoods      calls=29 tris=5961
  settlement:storageHay        calls=1 tris=487
  settlement:storageTrough     calls=3 tris=798
  settlement:storageWoodHousehold calls=1 tris=2724
  settlement:storageWoodSettlementPrimary calls=1 tris=778
  settlement:workplace         calls=8 tris=4493
  terrain                      calls=8 tris=625011
  vegetation                   calls=2 tris=674

Shadow (refresh only):
  calls avg: 425  tris avg: 2023705
  info calls avg: 425  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=8 tris=3616
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=2974
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant            calls=0 tris=69
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=66 tris=13542
  settlement:decor             calls=196 tris=384560
  settlement:fireHouseInteriorLamp calls=2 tris=216
  settlement:houseInteractive  calls=4 tris=628
  settlement:houseStatic       calls=23 tris=10310
  settlement:landmarkGarden    calls=1 tris=800
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=8 tris=804
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=1 tris=1560
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1038  tris avg: 9615326
  info calls avg: 1463  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=34 tris=10433
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=3 tris=1770
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=20 tris=9810
  grass                        calls=49 tris=6697644
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=57 tris=69015
  npcFamily:Peasant_Boots      calls=18 tris=24430
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=167 tris=319374
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
  settlement:storageContainer  calls=43 tris=2688
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 94.7ms
simulate        73.7ms
render          20.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.8ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA           70.5ms
PHYSICS          0.1ms
RENDER          14.9ms
OTHER            1.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=13.9 ms  p95=15.0 ms  max=16.0 ms  Δavg vs baseline=—
  hide-grass           avg=13.6 ms  p95=14.3 ms  max=15.9 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-vegetation      avg=12.5 ms  p95=14.4 ms  max=15.7 ms  Δavg vs baseline=-1.4 ms (-10%)
  no vegetation/grass  avg=14.1 ms  p95=15.7 ms  max=16.0 ms  Δavg vs baseline=+0.3 ms (+2%)
  hide-environment     avg=13.7 ms  p95=15.3 ms  max=15.8 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-settlement      avg=9.6 ms  p95=11.2 ms  max=13.0 ms  Δavg vs baseline=-4.3 ms (-31%)
  no water             avg=14.2 ms  p95=15.3 ms  max=15.6 ms  Δavg vs baseline=+0.4 ms (+3%)
  hide-terrain         avg=13.4 ms  p95=14.5 ms  max=16.6 ms  Δavg vs baseline=-0.4 ms (-3%)
  hide-npc-fauna       avg=7.9 ms  p95=9.2 ms  max=9.3 ms  Δavg vs baseline=-5.9 ms (-43%)
  no-shadows           avg=8.0 ms  p95=9.8 ms  max=11.2 ms  Δavg vs baseline=-5.9 ms (-42%)
  no-ao                avg=10.0 ms  p95=11.3 ms  max=11.8 ms  Δavg vs baseline=-3.9 ms (-28%)
  no-bloom             avg=10.0 ms  p95=11.1 ms  max=11.6 ms  Δavg vs baseline=-3.8 ms (-28%)
  no-smaa              avg=10.2 ms  p95=11.3 ms  max=12.5 ms  Δavg vs baseline=-3.6 ms (-26%)
  no-god-rays          avg=10.4 ms  p95=12.6 ms  max=13.3 ms  Δavg vs baseline=-3.4 ms (-25%)
  no-film-grade        avg=10.1 ms  p95=11.7 ms  max=12.9 ms  Δavg vs baseline=-3.7 ms (-27%)
  no postprocessing    avg=11.3 ms  p95=13.3 ms  max=14.8 ms  Δavg vs baseline=-2.5 ms (-18%)
  no mirrors           avg=10.4 ms  p95=11.3 ms  max=11.8 ms  Δavg vs baseline=-3.5 ms (-25%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=20.4 ms  p95=21.3 ms  max=22.2 ms
  CPU wall      avg=13.9 ms  p95=15.0 ms  max=16.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
