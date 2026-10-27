# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:02:55.685Z
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
Frames: 227
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-02-03-657Z-rjwpin
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
  avg: 17.5
  min: 1
  p1: 7

Frame time (wall-clock):
  avg: 57 ms
  p50: 46.6 ms
  p95: 54.1 ms
  p99: 151.8 ms
  max: 1478.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=11.8 p95=16.6 p99=20.7 max=58.1 n=227
  render: p50=34.2 p95=40.4 p99=137.8 max=1443.6 n=227
  frame: p50=46.6 p95=54.1 p99=151.8 max=1478.5 n=227

Rendering (combined renderer.info):
  draw calls: 2368 avg / 2774 max
  triangles: 7.82M avg
  mirror draws: 345 avg
  geometries: 959
  textures: 1002

Pass submissions (actual):
  reliability: observed
  frames: 227 shadowRefresh=223 shadowSkipped=4
  mirror calls avg: 345
  shadow calls avg: 426
  main calls avg: 1604

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1515 tris=1.38M meshes=1515 inst=3581
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=29.7k meshes=510 inst=510

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=805 tris=833.3k meshes=805 inst=2697
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=19 tris=9.6k meshes=19 inst=19
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=115 tris=14.8k meshes=115 inst=115

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
      far  agents=51 camera-relevant=17 draws=500 tris=597.8k
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
      mid  agents=5 camera-relevant=3 draws=19 tris=9.6k
      far  agents=86 camera-relevant=18 draws=380 tris=142.6k

Systems:
  WATER          4.8 ms
  NPC            4.9 ms
  FAUNA          1.9 ms
  PHYSICS        0.1 ms
  RENDER         39.4 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=26.2 ms draws=2399 tris=7.86M
  hide-grass         render=26.2 ms draws=2295 tris=7.35M
  hide-vegetation    render=24.8 ms draws=2218 tris=6.77M
  hide-vegetation-grass render=27.1 ms draws=2261 tris=6.64M
  hide-environment   render=24.9 ms draws=2108 tris=7.81M
  hide-settlement    render=22.3 ms draws=1467 tris=6.83M
  hide-water         render=25.9 ms draws=2513 tris=7.24M
  hide-terrain       render=26.1 ms draws=2345 tris=3.81M
  hide-npc-fauna     render=17.7 ms draws=1835 tris=7.23M
  no-shadows         render=0.0 ms draws=0 tris=0
  no-ao              render=0.0 ms draws=0 tris=0
  no-bloom           render=27.4 ms draws=2385 tris=7.86M
  no-smaa            render=26.9 ms draws=2401 tris=7.86M
  no-god-rays        render=28.3 ms draws=2409 tris=7.87M
  no-film-grade      render=25.6 ms draws=2401 tris=7.86M
  no-postprocessing  render=0.0 ms draws=0 tris=0
  no-reflections     render=27.4 ms draws=2046 tris=6.87M

Frame attribution:
  frame max: 1478.5 ms
  largest labelled hitch: 0 ms
  unattributed: 1478.5 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 1478.5 ms

Raw sidecar:
  sampling=full factor=1 exported=227/227

Recommendation:
Largest frame (1478.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.9 ms/frame
  crowd pass: 0.0 ms/frame (3.9 ms cumulative)
  agent updates: 2.6 ms/frame (590.8 ms cumulative)
  livestock: 1.7 ms/frame (389.5 ms cumulative)
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
      behaviour: 0.8 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 55.2
    unique animals/frame: 49.3
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.8
    dog guard scans: 12.8/frame (102.4 predator candidates/frame)
    pest scans: 7.1/frame (7.1 rat candidates/frame)
    nearest scans: 29.7/frame (0.0 candidates/frame)
    water samples: 59.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 59.1/frame, 0.10 ms/frame (worst call 0.20 ms, 12711.4 colliders/frame)
    full-rate agents/frame: 0.7
    reduced-cadence agents/frame: 54.5
    behaviour executions/frame: 29.9
    presentation executions/frame: 29.9
  rats: 0.2 ms/frame (54.2 ms cumulative)
  social: 0.0 ms/frame (2.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (62.6 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 1.9 ms/frame
  agent updates: 1.8 ms/frame (404.8 ms cumulative)
  forest sampling: 0.1 ms/frame (27.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.2 ms cumulative)
    targeting: 0.0 ms/frame (8.9 ms cumulative)
    decision: 0.0 ms/frame (4.7 ms cumulative)
    behaviour: 0.9 ms/frame (198.2 ms cumulative)
    life/presentation: 0.5 ms/frame (114.7 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.7
    full-rate agents/frame: 7.3
    reduced-cadence agents/frame: 22.7
    behaviour executions/frame: 18.7
    presentation executions/frame: 18.7

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 118.4
    village scan candidates/frame: 1569.8
    player perception checks/frame: 30.0

  nearest scans: 26.4/frame (5986 calls)
  nearest candidates checked: 448.7/frame (101863 total)
  herd leader scans: 0.3/frame (63 calls)
  herd candidates checked: 8.3/frame (1890 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.7/frame (174.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 73.4/frame, 0.10 ms/frame (worst call 3.30 ms)
    collider queries: 73.4/frame, 0.10 ms/frame (worst call 0.20 ms, 1320.0 colliders/frame)

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
Frames: 227
Shadow refresh frames: 223
Shadow skipped frames: 4

Mirror:
  calls avg: 345  tris avg: 990223
  info calls avg: 345  residual calls avg: 0
  environment                  calls=44 tris=8905
  items                        calls=1 tris=618
  other                        calls=34 tris=2262
  settlement:decor             calls=1 tris=825
  settlement:fence             calls=2 tris=9169
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=44 tris=3079
  settlement:fireHouseInteriorLamp calls=5 tris=533
  settlement:fireVillageTorch  calls=5 tris=353
  settlement:houseInteractive  calls=15 tris=1628
  settlement:houseStatic       calls=33 tris=79438
  settlement:landmarkGarden    calls=5 tris=81709
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=923
  settlement:landmarkWellHousehold calls=5 tris=9226
  settlement:landmarkWellPasture calls=2 tris=923
  settlement:other             calls=9 tris=345
  settlement:storageBarrel     calls=4 tris=11609
  settlement:storageContainer  calls=28 tris=2285
  settlement:storageGoods      calls=39 tris=6820
  settlement:storageHay        calls=1 tris=482
  settlement:storageTrough     calls=4 tris=1678
  settlement:storageWoodHousehold calls=10 tris=4357
  settlement:storageWoodSettlementPrimary calls=1 tris=1050
  settlement:storageWoodSettlementSecondary calls=1 tris=2779
  settlement:workplace         calls=11 tris=5223
  terrain                      calls=8 tris=592422
  vegetation                   calls=22 tris=161624

Shadow (refresh only):
  calls avg: 426  tris avg: 2178494
  info calls avg: 426  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=7 tris=2439
  faunaFamily:dog              calls=7 tris=2291
  faunaFamily:donkey           calls=1 tris=233
  faunaFamily:rat              calls=0 tris=126
  faunaFamily:sheep            calls=3 tris=946
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3220
  npcFamily:Peasant            calls=9 tris=10305
  npcFamily:Wizard             calls=5 tris=4908
  npcFamily:blacksmith         calls=11 tris=13105
  other                        calls=29 tris=8600
  settlement:fence             calls=4 tris=19707
  settlement:fireCampfire      calls=12 tris=175
  settlement:fireHouseInteriorLamp calls=8 tris=860
  settlement:houseInteractive  calls=16 tris=2501
  settlement:houseStatic       calls=33 tris=89571
  settlement:landmarkGarden    calls=1 tris=2389
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1862
  settlement:landmarkWellPasture calls=5 tris=1862
  settlement:other             calls=13 tris=239
  settlement:storageContainer  calls=20 tris=2449
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1792
  settlement:storageWoodHousehold calls=16 tris=7096
  settlement:storageWoodSettlementPrimary calls=2 tris=2138
  settlement:storageWoodSettlementSecondary calls=2 tris=5607
  settlement:workplace         calls=9 tris=6660
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1604  tris avg: 4687648
  info calls avg: 2023  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1918
  faunaFamily:cow              calls=7 tris=2418
  faunaFamily:dog              calls=35 tris=11516
  faunaFamily:donkey           calls=7 tris=1974
  faunaFamily:horse            calls=24 tris=6459
  faunaFamily:rat              calls=2 tris=3916
  faunaFamily:sheep            calls=14 tris=4283
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15143
  npcFamily:Herbalist          calls=25 tris=26964
  npcFamily:Knight_Cloth       calls=10 tris=8636
  npcFamily:Peasant            calls=162 tris=177306
  npcFamily:Peasant_Boots      calls=42 tris=48090
  npcFamily:Wizard             calls=59 tris=56036
  npcFamily:blacksmith         calls=36 tris=38086
  npcFamily:woodcutter         calls=17 tris=15247
  other                        calls=117 tris=14898
  settlement:decor             calls=2 tris=1651
  settlement:fence             calls=4 tris=18338
  settlement:fireCampfire      calls=35 tris=448
  settlement:fireHouseExteriorLamp calls=80 tris=5542
  settlement:fireHouseInteriorLamp calls=10 tris=1066
  settlement:fireVillageTorch  calls=15 tris=1058
  settlement:houseInteractive  calls=30 tris=3256
  settlement:houseStatic       calls=65 tris=158876
  settlement:landmarkGarden    calls=12 tris=207675
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3691
  settlement:landmarkWellHousehold calls=10 tris=18453
  settlement:landmarkWellPasture calls=5 tris=1845
  settlement:other             calls=22 tris=750
  settlement:storageBarrel     calls=12 tris=25948
  settlement:storageContainer  calls=57 tris=4819
  settlement:storageGoods      calls=77 tris=13641
  settlement:storageHay        calls=2 tris=963
  settlement:storageTrough     calls=8 tris=3355
  settlement:storageWoodHousehold calls=18 tris=7842
  settlement:storageWoodSettlementPrimary calls=4 tris=4201
  settlement:storageWoodSettlementSecondary calls=4 tris=11115
  settlement:workplace         calls=37 tris=15289
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
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

[LONG FRAME] 1478.5ms
simulate        34.4ms
render        1443.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.4ms
STREAMING        0.0ms
NPC             16.9ms
FAUNA            1.1ms
PHYSICS          0.3ms
RENDER        1443.1ms
OTHER           16.7ms

Long frame #2:

[LONG FRAME] 1043.2ms
simulate         9.5ms
render        1033.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              2.6ms
FAUNA            1.1ms
PHYSICS          0.1ms
RENDER        1033.2ms
OTHER            6.0ms

Long frame #3:

[LONG FRAME] 152ms
simulate        16.1ms
render         135.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.3ms
STREAMING        0.0ms
NPC              6.1ms
FAUNA            2.6ms
PHYSICS          0.2ms
RENDER         130.3ms
OTHER            7.5ms

Long frame #4:

[LONG FRAME] 151.2ms
simulate        12.3ms
render         138.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              5.7ms
FAUNA            1.0ms
PHYSICS          0.2ms
RENDER         138.6ms
OTHER            5.6ms

Long frame #5:

[LONG FRAME] 91.4ms
simulate        58.1ms
render          32.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.0ms
STREAMING        0.0ms
NPC              4.4ms
FAUNA           48.0ms
PHYSICS          0.1ms
RENDER          24.1ms
OTHER            5.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=26.2 ms  p95=27.0 ms  max=27.1 ms  Δavg vs baseline=—
  hide-grass           avg=26.2 ms  p95=27.8 ms  max=28.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-vegetation      avg=24.8 ms  p95=25.4 ms  max=25.4 ms  Δavg vs baseline=-1.4 ms (-5%)
  no vegetation/grass  avg=27.1 ms  p95=32.5 ms  max=33.9 ms  Δavg vs baseline=+0.9 ms (+4%)
  hide-environment     avg=24.9 ms  p95=25.3 ms  max=25.3 ms  Δavg vs baseline=-1.3 ms (-5%)
  hide-settlement      avg=22.3 ms  p95=24.4 ms  max=24.6 ms  Δavg vs baseline=-3.9 ms (-15%)
  no water             avg=25.9 ms  p95=26.7 ms  max=26.8 ms  Δavg vs baseline=-0.3 ms (-1%)
  hide-terrain         avg=26.1 ms  p95=26.8 ms  max=26.9 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-npc-fauna       avg=17.7 ms  p95=18.5 ms  max=18.5 ms  Δavg vs baseline=-8.5 ms (-32%)
  no-shadows           avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-26.2 ms (-100%)
  no-ao                avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-26.2 ms (-100%)
  no-bloom             avg=27.4 ms  p95=30.8 ms  max=31.3 ms  Δavg vs baseline=+1.2 ms (+5%)
  no-smaa              avg=26.9 ms  p95=27.6 ms  max=27.6 ms  Δavg vs baseline=+0.7 ms (+3%)
  no-god-rays          avg=28.3 ms  p95=32.2 ms  max=33.0 ms  Δavg vs baseline=+2.1 ms (+8%)
  no-film-grade        avg=25.6 ms  p95=26.0 ms  max=26.0 ms  Δavg vs baseline=-0.6 ms (-2%)
  no postprocessing    avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-26.2 ms (-100%)
  no mirrors           avg=27.4 ms  p95=31.1 ms  max=31.7 ms  Δavg vs baseline=+1.3 ms (+5%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
