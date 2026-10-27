# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:58:10.905Z
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
Frames: 681
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-57-12-790Z-9dm8k0
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
  viewport: 1600x900
  drawingBuffer: 1600x900
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=5268ms npc=53
  cameraControl: yaw=0 pitch=0.4 distance=12
  gpuTimer: available=true resolved=true samples=687 span=postprocess+labels

FPS:
  avg: 25.3
  min: 8
  p1: 11

Frame time (wall-clock):
  avg: 39.5 ms
  p50: 36.8 ms
  p95: 80.9 ms
  p99: 87.2 ms
  max: 122.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.8 p95=51.2 p99=57.4 max=97.3 n=681
  render: p50=26.2 p95=30.4 p99=31.4 max=40.8 n=681
  frame: p50=36.8 p95=80.9 p99=87.2 max=122.5 n=681

Rendering (combined renderer.info):
  draw calls: 2379 avg / 2746 max
  triangles: 7.87M avg
  mirror draws: 346 avg
  geometries: 1051
  textures: 2241

Pass submissions (actual):
  reliability: observed
  frames: 688 shadowRefresh=688 shadowSkipped=0
  mirror calls avg: 345
  shadow calls avg: 427
  main calls avg: 1606

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1462 tris=1.37M meshes=1462 inst=3528
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=509 tris=30.2k meshes=509 inst=511

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=818 tris=836.1k meshes=818 inst=2710
  npc              draws=52 tris=60.0k meshes=52 inst=52
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=119 tris=15.4k meshes=119 inst=119

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=13.0k meshes=10 inst=10
  storageWoodSettlementOverflow draws=2 tris=5.6k meshes=2 inst=2
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=30.6k meshes=56 inst=56
  storageContainer draws=76 tris=9.0k meshes=76 inst=122
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.0k meshes=24 inst=70
  workplace        draws=26 tris=17.4k meshes=26 inst=26
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=8.8k meshes=5 inst=11
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=28 tris=3.0k meshes=28 inst=28
  fireCampfire     draws=40 tris=1.1k meshes=40 inst=40
  decor            draws=203 tris=378.2k meshes=203 inst=309
  other            draws=64 tris=1.9k meshes=64 inst=64

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      Peasant_Boots    agents=6 draws=55 tris=72.1k skinned=55/55
      blacksmith       agents=5 draws=54 tris=64.9k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=37 tris=49.6k skinned=37/37
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=5 camera-relevant=3 draws=52 tris=60.0k
      far  agents=48 camera-relevant=18 draws=468 tris=561.3k
  Fauna:
    by family (sorted by draws):
      horse            agents=10 draws=80 tris=21.8k skinned=80/80
      dog              agents=13 draws=73 tris=25.2k skinned=73/73
      sheep            agents=20 draws=40 tris=12.2k skinned=40/40
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=5 draws=10 tris=20.0k skinned=10/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=88 camera-relevant=18 draws=389 tris=149.0k

Systems:
  WATER          3.7 ms
  NPC            3.9 ms
  FAUNA          5.5 ms
  PHYSICS        0.1 ms
  RENDER         22.1 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=21.0 ms draws=2386 tris=7.89M
  hide-grass         render=21.0 ms draws=2353 tris=7.57M
  hide-vegetation    render=20.5 ms draws=2213 tris=6.81M
  hide-vegetation-grass render=20.2 ms draws=2178 tris=6.49M
  hide-environment   render=20.4 ms draws=2080 tris=7.82M
  hide-settlement    render=17.2 ms draws=1493 tris=7.00M
  hide-water         render=20.9 ms draws=2373 tris=6.92M
  hide-terrain       render=20.9 ms draws=2327 tris=3.82M
  hide-npc-fauna     render=13.3 ms draws=1868 tris=7.41M
  no-shadows         render=17.5 ms draws=1973 tris=5.69M
  no-ao              render=20.8 ms draws=2385 tris=7.89M
  no-bloom           render=21.4 ms draws=2384 tris=7.90M
  no-smaa            render=21.4 ms draws=2400 tris=7.90M
  no-god-rays        render=21.4 ms draws=2405 tris=7.91M
  no-film-grade      render=21.2 ms draws=2398 tris=7.90M
  no-postprocessing  render=21.3 ms draws=2365 tris=7.89M
  no-reflections     render=21.0 ms draws=2032 tris=6.88M

Frame attribution:
  frame max: 122.5 ms
  largest labelled hitch: 0 ms
  unattributed: 122.5 ms

Long frames:
  threshold: 80 ms
  count: 41
  worst: 122.5 ms

Raw sidecar:
  sampling=full factor=1 exported=681/681

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.9 ms/frame
  crowd pass: 0.0 ms/frame (5.8 ms cumulative)
  agent updates: 2.6 ms/frame (1767.6 ms cumulative)
  livestock: 1.1 ms/frame (723.2 ms cumulative)
    loaded tick: 1.1 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.1 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.6
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (105.1 predator candidates/frame)
    pest scans: 6.8/frame (6.8 rat candidates/frame)
    nearest scans: 27.7/frame (0.0 candidates/frame)
    water samples: 63.1/frame, 0.00 ms/frame (worst call 0.70 ms)
    collider queries: 63.1/frame, 0.10 ms/frame (worst call 0.70 ms, 13336.7 colliders/frame)
    full-rate agents/frame: 1.5
    reduced-cadence agents/frame: 54.1
    behaviour executions/frame: 28.4
    presentation executions/frame: 22.0
  rats: 0.1 ms/frame (41.2 ms cumulative)
  social: 0.0 ms/frame (3.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (107.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 5.5 ms/frame
  agent updates: 5.5 ms/frame (3745.9 ms cumulative)
  forest sampling: 0.1 ms/frame (43.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.1 ms cumulative)
    targeting: 0.0 ms/frame (12.6 ms cumulative)
    decision: 0.0 ms/frame (4.8 ms cumulative)
    behaviour: 5.1 ms/frame (3485.0 ms cumulative)
    life/presentation: 0.2 ms/frame (158.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 24.2
    decision passes/frame: 24.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.8
    full-rate agents/frame: 6.1
    reduced-cadence agents/frame: 18.1
    behaviour executions/frame: 14.8
    presentation executions/frame: 13.3

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 97.0
    village scan candidates/frame: 1343.7
    player perception checks/frame: 24.2

  nearest scans: 22.2/frame (15091 calls)
  nearest candidates checked: 426.9/frame (290735 total)
  herd leader scans: 0.2/frame (131 calls)
  herd candidates checked: 5.8/frame (3930 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.1/frame (175.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 19.1/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 19.1/frame, 0.00 ms/frame (worst call 0.10 ms, 304.4 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 23
Resident instances: full=482171 filler=1025429
Submitted instances: full=75310 filler=42954
Meshes submitted: 75
LOD submitted fraction: full=0.15618940168529422 filler=0.04188880946413647
Flowers: unavailable
Allocation bytes (estimated): 144729600
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 688
Shadow refresh frames: 688
Shadow skipped frames: 0

Mirror:
  calls avg: 345  tris avg: 988708
  info calls avg: 345  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=35 tris=2212
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3120
  settlement:fireHouseInteriorLamp calls=5 tris=540
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=33 tris=80502
  settlement:landmarkGarden    calls=5 tris=82803
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11764
  settlement:storageContainer  calls=28 tris=2316
  settlement:storageGoods      calls=35 tris=5722
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1700
  settlement:storageWoodHousehold calls=10 tris=4455
  settlement:storageWoodSettlementPrimary calls=1 tris=1074
  settlement:storageWoodSettlementSecondary calls=1 tris=2816
  settlement:workplace         calls=11 tris=5293
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 427  tris avg: 2181039
  info calls avg: 427  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:dog              calls=8 tris=2559
  faunaFamily:sheep            calls=4 tris=1225
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3637
  npcFamily:Peasant            calls=18 tris=21284
  npcFamily:Wizard             calls=4 tris=3977
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=29 tris=8600
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
  settlement:storageContainer  calls=20 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=16 tris=7128
  settlement:storageWoodSettlementPrimary calls=2 tris=2148
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=77 tris=548494

Main:
  calls avg: 1606  tris avg: 4701615
  info calls avg: 2033  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=13 tris=3865
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=168 tris=186116
  npcFamily:Peasant_Boots      calls=42 tris=48628
  npcFamily:Wizard             calls=61 tris=57813
  npcFamily:blacksmith         calls=36 tris=38577
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=124 tris=14852
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=81 tris=5616
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
  settlement:storageContainer  calls=58 tris=4884
  settlement:storageGoods      calls=58 tris=8844
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=18 tris=8019
  settlement:storageWoodSettlementPrimary calls=4 tris=4296
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 41
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 41 total):

[LONG FRAME] 122.5ms
simulate        92.7ms
render          29.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.9ms
STREAMING        0.0ms
NPC              3.8ms
FAUNA           84.3ms
PHYSICS          0.0ms
RENDER          21.8ms
OTHER            4.7ms

Long frame #2:

[LONG FRAME] 121.1ms
simulate        95.4ms
render          25.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              3.2ms
FAUNA           88.0ms
PHYSICS          0.1ms
RENDER          25.6ms
OTHER            4.1ms

Long frame #3:

[LONG FRAME] 119.8ms
simulate        97.3ms
render          22.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              3.3ms
FAUNA           89.3ms
PHYSICS          0.0ms
RENDER          22.4ms
OTHER            4.6ms

Long frame #4:

[LONG FRAME] 116.8ms
simulate        93.2ms
render          23.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              3.5ms
FAUNA           85.5ms
PHYSICS          0.1ms
RENDER          23.3ms
OTHER            4.3ms

Long frame #5:

[LONG FRAME] 116.4ms
simulate        95.4ms
render          20.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           87.2ms
PHYSICS          0.1ms
RENDER          20.7ms
OTHER            4.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=21.0 ms  p95=21.9 ms  max=22.6 ms  Δavg vs baseline=—
  hide-grass           avg=21.0 ms  p95=21.6 ms  max=23.9 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-vegetation      avg=20.5 ms  p95=21.2 ms  max=21.8 ms  Δavg vs baseline=-0.5 ms (-2%)
  no vegetation/grass  avg=20.2 ms  p95=21.0 ms  max=21.5 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-environment     avg=20.4 ms  p95=21.3 ms  max=21.6 ms  Δavg vs baseline=-0.5 ms (-3%)
  hide-settlement      avg=17.2 ms  p95=17.9 ms  max=18.2 ms  Δavg vs baseline=-3.7 ms (-18%)
  no water             avg=20.9 ms  p95=21.7 ms  max=21.9 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-terrain         avg=20.9 ms  p95=21.9 ms  max=23.1 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-npc-fauna       avg=13.3 ms  p95=13.8 ms  max=14.0 ms  Δavg vs baseline=-7.7 ms (-37%)
  no-shadows           avg=17.5 ms  p95=18.3 ms  max=18.3 ms  Δavg vs baseline=-3.5 ms (-17%)
  no-ao                avg=20.8 ms  p95=21.4 ms  max=21.6 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=21.4 ms  p95=22.3 ms  max=22.5 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-smaa              avg=21.4 ms  p95=22.2 ms  max=22.9 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-god-rays          avg=21.4 ms  p95=22.3 ms  max=23.0 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-film-grade        avg=21.2 ms  p95=21.7 ms  max=23.7 ms  Δavg vs baseline=+0.2 ms (+1%)
  no postprocessing    avg=21.3 ms  p95=22.3 ms  max=23.1 ms  Δavg vs baseline=+0.3 ms (+2%)
  no mirrors           avg=21.0 ms  p95=22.3 ms  max=22.9 ms  Δavg vs baseline=+0.1 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=23.3 ms  p95=24.2 ms  max=24.3 ms
  CPU wall      avg=21.0 ms  p95=21.9 ms  max=22.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
