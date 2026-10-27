# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T20:59:54.654Z
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
Frames: 708
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T20-58-52-224Z-kcdr1a
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
  camera: pos=(-572.2, 17.3, -1169.4)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=5333ms npc=53
  cameraControl: yaw=3.1 pitch=0.4 distance=12
  gpuTimer: available=true resolved=true samples=714 span=postprocess+labels

FPS:
  avg: 27.1
  min: 10
  p1: 12

Frame time (wall-clock):
  avg: 36.9 ms
  p50: 35.8 ms
  p95: 72.4 ms
  p99: 80.3 ms
  max: 100.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.5 p95=51.1 p99=53.6 max=79.5 n=708
  render: p50=25.3 p95=28.7 p99=29.6 max=32.8 n=708
  frame: p50=35.8 p95=72.4 p99=80.3 max=100.5 n=708

Rendering (combined renderer.info):
  draw calls: 1574 avg / 1942 max
  triangles: 7.86M avg
  mirror draws: 351 avg
  geometries: 1368
  textures: 2933

Pass submissions (actual):
  reliability: observed
  frames: 715 shadowRefresh=715 shadowSkipped=0
  mirror calls avg: 351
  shadow calls avg: 430
  main calls avg: 793

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1459 tris=1.37M meshes=1459 inst=3525
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=30.3k meshes=510 inst=512

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=823 tris=838.4k meshes=823 inst=2715
  npc              draws=32 tris=35.4k meshes=32 inst=32
  fauna            draws=16 tris=5.1k meshes=16 inst=16
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=120 tris=15.5k meshes=120 inst=120

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=13.0k meshes=10 inst=10
  storageWoodSettlementOverflow draws=4 tris=11.3k meshes=4 inst=4
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
  decor            draws=206 tris=374.9k meshes=206 inst=312
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
      mid  agents=3 camera-relevant=1 draws=32 tris=35.4k
      far  agents=50 camera-relevant=5 draws=488 tris=585.9k
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
      mid  agents=4 camera-relevant=0 draws=16 tris=5.1k
      far  agents=87 camera-relevant=4 draws=383 tris=147.1k

Systems:
  WATER          4.0 ms
  NPC            4.6 ms
  FAUNA          4.0 ms
  PHYSICS        0.1 ms
  RENDER         20.0 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=19.7 ms draws=1570 tris=7.85M
  hide-grass         render=19.4 ms draws=1547 tris=7.08M
  hide-vegetation    render=18.7 ms draws=1462 tris=7.01M
  hide-vegetation-grass render=18.9 ms draws=1422 tris=6.23M
  hide-environment   render=19.0 ms draws=1481 tris=7.83M
  hide-settlement    render=16.5 ms draws=994 tris=7.27M
  hide-water         render=19.2 ms draws=1547 tris=6.44M
  hide-terrain       render=18.9 ms draws=1514 tris=4.01M
  hide-npc-fauna     render=12.7 ms draws=1225 tris=7.53M
  no-shadows         render=16.0 ms draws=1172 tris=5.67M
  no-ao              render=19.9 ms draws=1579 tris=7.87M
  no-bloom           render=19.5 ms draws=1563 tris=7.86M
  no-smaa            render=19.4 ms draws=1565 tris=7.86M
  no-god-rays        render=19.4 ms draws=1564 tris=7.86M
  no-film-grade      render=19.5 ms draws=1566 tris=7.86M
  no-postprocessing  render=19.9 ms draws=1548 tris=7.86M
  no-reflections     render=19.7 ms draws=1240 tris=6.73M

Frame attribution:
  frame max: 100.5 ms
  largest labelled hitch: 0 ms
  unattributed: 100.5 ms

Long frames:
  threshold: 80 ms
  count: 9
  worst: 100.5 ms

Raw sidecar:
  sampling=full factor=1 exported=708/708

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.6 ms/frame
  crowd pass: 0.0 ms/frame (10.1 ms cumulative)
  agent updates: 2.8 ms/frame (1955.2 ms cumulative)
  livestock: 1.6 ms/frame (1124.2 ms cumulative)
    loaded tick: 1.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 1.1 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.6
    unique animals/frame: 50.5
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (105.0 predator candidates/frame)
    pest scans: 6.5/frame (6.5 rat candidates/frame)
    nearest scans: 26.5/frame (0.0 candidates/frame)
    water samples: 56.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 56.5/frame, 0.10 ms/frame (worst call 0.80 ms, 12225.8 colliders/frame)
    full-rate agents/frame: 3.4
    reduced-cadence agents/frame: 52.1
    behaviour executions/frame: 27.3
    presentation executions/frame: 22.2
  rats: 0.0 ms/frame (33.6 ms cumulative)
  social: 0.0 ms/frame (3.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (117.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 4.0 ms/frame
  agent updates: 3.9 ms/frame (2794.5 ms cumulative)
  forest sampling: 0.1 ms/frame (55.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.4 ms cumulative)
    targeting: 0.0 ms/frame (12.5 ms cumulative)
    decision: 0.0 ms/frame (4.5 ms cumulative)
    behaviour: 3.5 ms/frame (2513.3 ms cumulative)
    life/presentation: 0.2 ms/frame (167.0 ms cumulative)
    other update: 0.0 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 24.0
    decision passes/frame: 24.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.6
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 17.6
    behaviour executions/frame: 14.6
    presentation executions/frame: 12.8

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 96.2
    village scan candidates/frame: 1342.5
    player perception checks/frame: 24.0

  nearest scans: 22.0/frame (15552 calls)
  nearest candidates checked: 422.1/frame (298849 total)
  herd leader scans: 0.2/frame (119 calls)
  herd candidates checked: 5.0/frame (3570 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.1/frame (161.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 49.5/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 49.5/frame, 0.00 ms/frame (worst call 0.70 ms, 717.2 colliders/frame)

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
Frames: 715
Shadow refresh frames: 715
Shadow skipped frames: 0

Mirror:
  calls avg: 351  tris avg: 1146323
  info calls avg: 351  residual calls avg: 0
  environment                  calls=2 tris=1871
  items                        calls=1 tris=316
  other                        calls=89 tris=7324
  settlement:decor             calls=107 tris=184794
  settlement:fireHouseExteriorLamp calls=23 tris=1562
  settlement:fireHouseInteriorLamp calls=3 tris=270
  settlement:fireVillageTorch  calls=3 tris=179
  settlement:houseInteractive  calls=8 tris=826
  settlement:houseStatic       calls=27 tris=49731
  settlement:landmarkGarden    calls=3 tris=17563
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=5618
  settlement:other             calls=9 tris=180
  settlement:storageBarrel     calls=5 tris=8316
  settlement:storageContainer  calls=16 tris=1538
  settlement:storageGoods      calls=9 tris=1857
  settlement:storageHay        calls=1 tris=244
  settlement:storageTrough     calls=2 tris=1001
  settlement:storageWoodHousehold calls=5 tris=5046
  settlement:storageWoodSettlementOverflow calls=2 tris=5640
  settlement:storageWoodSettlementPrimary calls=1 tris=2820
  settlement:workplace         calls=6 tris=3690
  terrain                      calls=10 tris=738311
  vegetation                   calls=15 tris=106828

Shadow (refresh only):
  calls avg: 430  tris avg: 2188761
  info calls avg: 430  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=3
  faunaFamily:cow              calls=1 tris=459
  faunaFamily:dog              calls=8 tris=2530
  faunaFamily:donkey           calls=0 tris=28
  faunaFamily:sheep            calls=4 tris=1212
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3694
  npcFamily:Peasant            calls=16 tris=19391
  npcFamily:Wizard             calls=7 tris=6705
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=28 tris=8599
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
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 793  tris avg: 4523407
  info calls avg: 1223  residual calls avg: 0
  environment                  calls=4 tris=3736
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=5 tris=1920
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=2 tris=610
  grass                        calls=29 tris=776440
  items                        calls=48 tris=4042
  npcFamily:Herbalist          calls=24 tris=23793
  npcFamily:Knight_Cloth       calls=15 tris=17123
  npcFamily:Peasant            calls=119 tris=107746
  npcFamily:Peasant_Boots      calls=32 tris=32316
  npcFamily:Wizard             calls=46 tris=41879
  npcFamily:blacksmith         calls=30 tris=29799
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=148 tris=15484
  settlement:decor             calls=1 tris=886
  settlement:fireCampfire      calls=18 tris=227
  settlement:fireHouseExteriorLamp calls=27 tris=1872
  settlement:fireHouseInteriorLamp calls=3 tris=324
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=9 tris=990
  settlement:houseStatic       calls=30 tris=88894
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:other             calls=7 tris=132
  settlement:storageBarrel     calls=6 tris=13840
  settlement:storageContainer  calls=19 tris=2448
  settlement:storageGoods      calls=18 tris=3708
  settlement:storageTrough     calls=2 tris=1600
  settlement:storageWoodHousehold calls=6 tris=2673
  settlement:storageWoodSettlementPrimary calls=2 tris=2148
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=19 tris=7346
  terrain                      calls=23 tris=1695744
  vegetation                   calls=31 tris=197629
  water                        calls=20 tris=1409024


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 9
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 9 total):

[LONG FRAME] 100.5ms
simulate        79.5ms
render          20.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC             17.8ms
FAUNA           57.4ms
PHYSICS          0.0ms
RENDER          20.8ms
OTHER            4.4ms

Long frame #2:

[LONG FRAME] 92.6ms
simulate        72.1ms
render          20.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC             23.2ms
FAUNA           44.2ms
PHYSICS          0.1ms
RENDER          20.3ms
OTHER            4.7ms

Long frame #3:

[LONG FRAME] 87.5ms
simulate        59.1ms
render          28.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.4ms
STREAMING        0.0ms
NPC             12.3ms
FAUNA           42.2ms
PHYSICS          0.1ms
RENDER          19.9ms
OTHER            4.6ms

Long frame #4:

[LONG FRAME] 82.1ms
simulate        52.9ms
render          29.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.9ms
STREAMING        0.0ms
NPC              3.7ms
FAUNA           44.4ms
PHYSICS          0.1ms
RENDER          20.1ms
OTHER            4.9ms

Long frame #5:

[LONG FRAME] 81.5ms
simulate        52.0ms
render          29.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.4ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           42.9ms
PHYSICS          0.2ms
RENDER          21.1ms
OTHER            4.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.7 ms  p95=20.8 ms  max=22.0 ms  Δavg vs baseline=—
  hide-grass           avg=19.4 ms  p95=20.1 ms  max=21.6 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-vegetation      avg=18.7 ms  p95=19.3 ms  max=21.1 ms  Δavg vs baseline=-1.0 ms (-5%)
  no vegetation/grass  avg=18.9 ms  p95=19.6 ms  max=24.3 ms  Δavg vs baseline=-0.8 ms (-4%)
  hide-environment     avg=19.0 ms  p95=19.9 ms  max=21.0 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-settlement      avg=16.5 ms  p95=17.2 ms  max=21.7 ms  Δavg vs baseline=-3.1 ms (-16%)
  no water             avg=19.2 ms  p95=19.9 ms  max=19.9 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-terrain         avg=18.9 ms  p95=19.9 ms  max=20.6 ms  Δavg vs baseline=-0.8 ms (-4%)
  hide-npc-fauna       avg=12.7 ms  p95=13.8 ms  max=14.4 ms  Δavg vs baseline=-7.0 ms (-36%)
  no-shadows           avg=16.0 ms  p95=16.8 ms  max=17.8 ms  Δavg vs baseline=-3.7 ms (-19%)
  no-ao                avg=19.9 ms  p95=20.6 ms  max=22.1 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-bloom             avg=19.5 ms  p95=20.7 ms  max=22.0 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=19.4 ms  p95=20.2 ms  max=20.2 ms  Δavg vs baseline=-0.3 ms (-1%)
  no-god-rays          avg=19.4 ms  p95=20.1 ms  max=20.3 ms  Δavg vs baseline=-0.3 ms (-1%)
  no-film-grade        avg=19.5 ms  p95=20.2 ms  max=20.2 ms  Δavg vs baseline=-0.2 ms (-1%)
  no postprocessing    avg=19.9 ms  p95=21.2 ms  max=21.6 ms  Δavg vs baseline=+0.3 ms (+1%)
  no mirrors           avg=19.7 ms  p95=21.3 ms  max=21.9 ms  Δavg vs baseline=+0.0 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=17.7 ms  p95=20.0 ms  max=36.0 ms
  CPU wall      avg=19.7 ms  p95=20.8 ms  max=22.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
