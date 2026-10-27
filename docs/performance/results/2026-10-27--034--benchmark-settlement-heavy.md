# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T16:59:17.500Z
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
Frames: 264
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T16-58-26-216Z-m1yhgw
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
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 18.2
  min: 1
  p1: 7

Frame time (wall-clock):
  avg: 54.8 ms
  p50: 47.4 ms
  p95: 54.9 ms
  p99: 133.5 ms
  max: 1283.1 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=11.7 p95=15.8 p99=20.3 max=51.2 n=264
  render: p50=35.8 p95=40.9 p99=122.1 max=1231.3 n=264
  frame: p50=47.4 p95=54.9 p99=133.5 max=1283.1 n=264

Rendering (combined renderer.info):
  draw calls: 2326 avg / 2737 max
  triangles: 7.82M avg
  mirror draws: 345 avg
  geometries: 959
  textures: 1000

Pass submissions (actual):
  reliability: observed
  frames: 264 shadowRefresh=260 shadowSkipped=4
  mirror calls avg: 345
  shadow calls avg: 416
  main calls avg: 1572

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1515 tris=1.38M meshes=1515 inst=3581
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=805 tris=833.3k meshes=805 inst=2697
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=12 tris=3.8k meshes=12 inst=12
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=8.2k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=24.9k meshes=56 inst=56
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
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=59 tris=1.8k meshes=59 inst=59

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
      mid  agents=2 camera-relevant=2 draws=20 tris=23.5k
      far  agents=51 camera-relevant=19 draws=500 tris=597.8k
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
      mid  agents=4 camera-relevant=3 draws=12 tris=3.8k
      far  agents=87 camera-relevant=18 draws=387 tris=148.4k

Systems:
  WATER          5.0 ms
  NPC            4.9 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         37.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=27.0 ms draws=2360 tris=7.86M
  hide-grass         render=28.6 ms draws=2333 tris=7.55M
  hide-vegetation    render=26.4 ms draws=2256 tris=6.95M
  hide-vegetation-grass render=29.2 ms draws=2095 tris=6.30M
  hide-environment   render=26.4 ms draws=2110 tris=7.82M
  hide-settlement    render=22.6 ms draws=1476 tris=7.14M
  hide-water         render=27.6 ms draws=2368 tris=6.92M
  hide-terrain       render=27.2 ms draws=2315 tris=3.82M
  hide-npc-fauna     render=18.4 ms draws=1870 tris=7.42M
  no-shadows         render=26.6 ms draws=2324 tris=6.68M
  no-ao              render=329.5 ms draws=2376 tris=7.88M
  no-bloom           render=29.5 ms draws=2369 tris=7.88M
  no-smaa            render=29.5 ms draws=2261 tris=7.55M
  no-god-rays        render=28.1 ms draws=2381 tris=7.88M
  no-film-grade      render=27.8 ms draws=2372 tris=7.87M
  no-postprocessing  render=0.0 ms draws=0 tris=0
  no-reflections     render=27.6 ms draws=2002 tris=6.86M

Frame attribution:
  frame max: 1283.1 ms
  largest labelled hitch: 0 ms
  unattributed: 1283.1 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 1283.1 ms

Raw sidecar:
  sampling=full factor=1 exported=264/264

Recommendation:
Largest frame (1283.1 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.9 ms/frame
  crowd pass: 0.0 ms/frame (4.4 ms cumulative)
  agent updates: 2.6 ms/frame (684.6 ms cumulative)
  livestock: 1.7 ms/frame (451.1 ms cumulative)
    loaded tick: 1.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.1 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.9 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 55.0
    unique animals/frame: 49.1
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.8
    dog guard scans: 12.8/frame (102.0 predator candidates/frame)
    pest scans: 7.1/frame (7.1 rat candidates/frame)
    nearest scans: 29.5/frame (0.0 candidates/frame)
    water samples: 59.4/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 59.4/frame, 0.10 ms/frame (worst call 0.20 ms, 13132.6 colliders/frame)
    full-rate agents/frame: 0.8
    reduced-cadence agents/frame: 54.2
    behaviour executions/frame: 29.7
    presentation executions/frame: 29.7
  rats: 0.2 ms/frame (55.1 ms cumulative)
  social: 0.0 ms/frame (3.0 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (70.9 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.7 ms/frame (441.7 ms cumulative)
  forest sampling: 0.1 ms/frame (31.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (11.7 ms cumulative)
    targeting: 0.0 ms/frame (8.7 ms cumulative)
    decision: 0.0 ms/frame (5.4 ms cumulative)
    behaviour: 0.7 ms/frame (188.7 ms cumulative)
    life/presentation: 0.5 ms/frame (142.4 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.7
    full-rate agents/frame: 7.4
    reduced-cadence agents/frame: 22.6
    behaviour executions/frame: 18.7
    presentation executions/frame: 18.7

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 117.7
    village scan candidates/frame: 1570.9
    player perception checks/frame: 30.0

  nearest scans: 26.1/frame (6890 calls)
  nearest candidates checked: 448.8/frame (118492 total)
  herd leader scans: 0.2/frame (58 calls)
  herd candidates checked: 6.6/frame (1740 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.5/frame (187.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 31.7/frame, 0.00 ms/frame (worst call 1.60 ms)
    collider queries: 31.7/frame, 0.00 ms/frame (worst call 0.30 ms, 539.8 colliders/frame)

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
Frames: 264
Shadow refresh frames: 260
Shadow skipped frames: 4

Mirror:
  calls avg: 345  tris avg: 986411
  info calls avg: 345  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=618
  other                        calls=34 tris=2223
  settlement:decor             calls=1 tris=824
  settlement:fence             calls=2 tris=9151
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=44 tris=3073
  settlement:fireHouseInteriorLamp calls=5 tris=532
  settlement:fireVillageTorch  calls=5 tris=352
  settlement:houseInteractive  calls=15 tris=1625
  settlement:houseStatic       calls=33 tris=79282
  settlement:landmarkGarden    calls=5 tris=81548
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=921
  settlement:landmarkWellHousehold calls=5 tris=9208
  settlement:landmarkWellPasture calls=2 tris=921
  settlement:other             calls=9 tris=343
  settlement:storageBarrel     calls=4 tris=11586
  settlement:storageContainer  calls=28 tris=2281
  settlement:storageGoods      calls=39 tris=6816
  settlement:storageHay        calls=1 tris=481
  settlement:storageTrough     calls=4 tris=1674
  settlement:storageWoodHousehold calls=10 tris=4354
  settlement:storageWoodSettlementPrimary calls=1 tris=1050
  settlement:storageWoodSettlementSecondary calls=1 tris=2773
  settlement:workplace         calls=11 tris=5213
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 416  tris avg: 2172057
  info calls avg: 416  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=1 tris=452
  faunaFamily:dog              calls=6 tris=1943
  faunaFamily:donkey           calls=0 tris=54
  faunaFamily:sheep            calls=4 tris=1302
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=2896
  npcFamily:Peasant            calls=9 tris=10311
  npcFamily:Wizard             calls=1 tris=961
  npcFamily:blacksmith         calls=11 tris=13113
  other                        calls=29 tris=8611
  settlement:fence             calls=4 tris=19720
  settlement:fireCampfire      calls=12 tris=175
  settlement:fireHouseInteriorLamp calls=8 tris=861
  settlement:houseInteractive  calls=16 tris=2502
  settlement:houseStatic       calls=33 tris=89628
  settlement:landmarkGarden    calls=1 tris=2391
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1863
  settlement:landmarkWellPasture calls=5 tris=1863
  settlement:other             calls=13 tris=239
  settlement:storageContainer  calls=20 tris=2451
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1793
  settlement:storageWoodHousehold calls=16 tris=7101
  settlement:storageWoodSettlementPrimary calls=2 tris=2140
  settlement:storageWoodSettlementSecondary calls=2 tris=5610
  settlement:workplace         calls=9 tris=6664
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1572  tris avg: 4689671
  info calls avg: 1982  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1922
  faunaFamily:cow              calls=7 tris=2422
  faunaFamily:dog              calls=35 tris=11537
  faunaFamily:donkey           calls=7 tris=1977
  faunaFamily:horse            calls=24 tris=6472
  faunaFamily:rat              calls=2 tris=3928
  faunaFamily:sheep            calls=14 tris=4382
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15147
  npcFamily:Herbalist          calls=25 tris=26734
  npcFamily:Knight_Cloth       calls=10 tris=8644
  npcFamily:Peasant            calls=165 tris=182520
  npcFamily:Peasant_Boots      calls=41 tris=47877
  npcFamily:Wizard             calls=59 tris=56004
  npcFamily:blacksmith         calls=35 tris=38006
  npcFamily:woodcutter         calls=17 tris=15150
  other                        calls=119 tris=14845
  settlement:decor             calls=2 tris=1654
  settlement:fence             calls=4 tris=18373
  settlement:fireCampfire      calls=36 tris=449
  settlement:fireHouseExteriorLamp calls=80 tris=5552
  settlement:fireHouseInteriorLamp calls=10 tris=1068
  settlement:fireVillageTorch  calls=15 tris=1060
  settlement:houseInteractive  calls=30 tris=3263
  settlement:houseStatic       calls=65 tris=159174
  settlement:landmarkGarden    calls=12 tris=208064
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3698
  settlement:landmarkWellHousehold calls=10 tris=18488
  settlement:landmarkWellPasture calls=5 tris=1849
  settlement:other             calls=22 tris=747
  settlement:storageBarrel     calls=12 tris=25997
  settlement:storageContainer  calls=57 tris=4829
  settlement:storageGoods      calls=78 tris=13684
  settlement:storageHay        calls=2 tris=965
  settlement:storageTrough     calls=8 tris=3361
  settlement:storageWoodHousehold calls=18 tris=7867
  settlement:storageWoodSettlementPrimary calls=4 tris=4215
  settlement:storageWoodSettlementSecondary calls=4 tris=11136
  settlement:workplace         calls=37 tris=15318
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


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

[LONG FRAME] 1283.1ms
simulate        51.2ms
render        1231.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC             25.5ms
FAUNA            9.3ms
PHYSICS          0.1ms
RENDER        1231.1ms
OTHER           16.9ms

Long frame #2:

[LONG FRAME] 887.4ms
simulate         6.6ms
render         880.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              0.5ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER         880.5ms
OTHER            5.1ms

Long frame #3:

[LONG FRAME] 149.6ms
simulate        11.7ms
render         137.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.3ms
FAUNA            0.7ms
PHYSICS          0.2ms
RENDER         137.6ms
OTHER            5.7ms

Long frame #4:

[LONG FRAME] 124ms
simulate        10.6ms
render         113.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.1ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA            3.3ms
PHYSICS          0.2ms
RENDER         108.0ms
OTHER            6.2ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=27.0 ms  p95=27.5 ms  max=27.5 ms  Δavg vs baseline=—
  hide-grass           avg=28.6 ms  p95=32.4 ms  max=33.0 ms  Δavg vs baseline=+1.6 ms (+6%)
  hide-vegetation      avg=26.4 ms  p95=27.4 ms  max=27.4 ms  Δavg vs baseline=-0.6 ms (-2%)
  no vegetation/grass  avg=29.2 ms  p95=39.0 ms  max=42.2 ms  Δavg vs baseline=+2.2 ms (+8%)
  hide-environment     avg=26.4 ms  p95=27.4 ms  max=27.6 ms  Δavg vs baseline=-0.6 ms (-2%)
  hide-settlement      avg=22.6 ms  p95=24.3 ms  max=24.6 ms  Δavg vs baseline=-4.3 ms (-16%)
  no water             avg=27.6 ms  p95=30.8 ms  max=31.3 ms  Δavg vs baseline=+0.6 ms (+2%)
  hide-terrain         avg=27.2 ms  p95=28.2 ms  max=28.3 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-npc-fauna       avg=18.4 ms  p95=19.5 ms  max=19.6 ms  Δavg vs baseline=-8.6 ms (-32%)
  no-shadows           avg=26.6 ms  p95=26.6 ms  max=26.6 ms  Δavg vs baseline=-0.4 ms (-1%)
  no-ao                avg=329.5 ms  p95=601.7 ms  max=631.9 ms  Δavg vs baseline=+302.6 ms (+1122%)
  no-bloom             avg=29.5 ms  p95=29.7 ms  max=29.7 ms  Δavg vs baseline=+2.5 ms (+9%)
  no-smaa              avg=29.5 ms  p95=30.9 ms  max=31.0 ms  Δavg vs baseline=+2.5 ms (+9%)
  no-god-rays          avg=28.1 ms  p95=28.8 ms  max=28.9 ms  Δavg vs baseline=+1.1 ms (+4%)
  no-film-grade        avg=27.8 ms  p95=29.2 ms  max=29.2 ms  Δavg vs baseline=+0.8 ms (+3%)
  no postprocessing    avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.0 ms (-100%)
  no mirrors           avg=27.6 ms  p95=28.6 ms  max=28.8 ms  Δavg vs baseline=+0.6 ms (+2%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
