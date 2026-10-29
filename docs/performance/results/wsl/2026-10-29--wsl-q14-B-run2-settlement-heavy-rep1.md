# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T18:55:28.022Z
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
Frames: 279
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 591231d7e90a73b5c8c869eb81ed60d1f5478c1c
  runId: 2026-10-29T18-53-38-366Z-wvg457
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
  viewport: 1600x813
  drawingBuffer: 1600x813
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=7273ms npc=53
  gpuTimer: available=true resolved=true samples=278 span=postprocess+labels

FPS:
  avg: 21.6
  min: 1
  p1: 12

Frame time (wall-clock):
  avg: 46.2 ms
  p50: 38.1 ms
  p95: 74.4 ms
  p99: 82.9 ms
  max: 1373.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.4 p95=52.1 p99=56.6 max=75.5 n=279
  render: p50=29.4 p95=40.6 p99=50.5 max=1365.6 n=279
  frame: p50=38.1 p95=74.4 p99=82.9 max=1373.2 n=279

Rendering (combined renderer.info):
  draw calls: 2090 avg / 2415 max
  triangles: 7.74M avg
  mirror draws: 313 avg
  geometries: 961
  textures: 822

Pass submissions (actual):
  reliability: observed
  frames: 281 shadowRefresh=281 shadowSkipped=0
  mirror calls avg: 313
  shadow calls avg: 407
  main calls avg: 1370

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=29.7k meshes=510 inst=512

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=32 tris=37.7k meshes=32 inst=32
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=115 tris=14.8k meshes=115 inst=115

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=5 tris=4.8k meshes=5 inst=5
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=5 tris=21.8k meshes=5 inst=28
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
      Peasant          agents=28 draws=258 tris=310.4k skinned=258/258
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Wizard           agents=4 draws=47 tris=46.9k skinned=47/47
      Herbalist        agents=4 draws=41 tris=52.4k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.7k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=3 camera-relevant=2 draws=32 tris=37.7k
      far  agents=50 camera-relevant=19 draws=469 tris=591.8k
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
      far  agents=88 camera-relevant=21 draws=389 tris=149.0k

Systems:
  WATER          3.4 ms
  NPC            4.7 ms
  FAUNA          4.5 ms
  PHYSICS        0.1 ms
  RENDER         31.5 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=30.4 ms draws=2082 tris=7.74M
  hide-grass         render=30.0 ms draws=2060 tris=7.43M
  hide-vegetation    render=22.5 ms draws=1899 tris=6.64M
  hide-vegetation-grass render=23.0 ms draws=1880 tris=6.34M
  hide-environment   render=25.8 ms draws=1865 tris=7.70M
  hide-settlement    render=18.0 ms draws=1288 tris=6.86M
  hide-water         render=34.2 ms draws=2079 tris=6.78M
  hide-terrain       render=29.7 ms draws=2034 tris=3.69M
  hide-npc-fauna     render=14.9 ms draws=1742 tris=7.42M
  no-shadows         render=17.8 ms draws=1709 tris=5.57M
  no-ao              render=31.4 ms draws=2078 tris=7.74M
  no-bloom           render=32.5 ms draws=2072 tris=7.74M
  no-smaa            render=33.1 ms draws=2087 tris=7.75M
  no-god-rays        render=31.3 ms draws=2080 tris=7.75M
  no-film-grade      render=31.9 ms draws=2073 tris=7.74M
  no-postprocessing  render=28.1 ms draws=2056 tris=7.75M
  no-reflections     render=22.8 ms draws=1762 tris=6.75M

Frame attribution:
  frame max: 1373.2 ms
  largest labelled hitch: 0 ms
  unattributed: 1373.2 ms

Long frames:
  threshold: 80 ms
  count: 5
  worst: 1373.2 ms

Raw sidecar:
  sampling=full factor=1 exported=279/279

Recommendation:
Largest frame (1373.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (5.4 ms cumulative)
  agent updates: 2.6 ms/frame (712.5 ms cumulative)
  livestock: 1.6 ms/frame (440.8 ms cumulative)
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
      behaviour: 0.8 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 7.2/frame (7.2 rat candidates/frame)
    nearest scans: 30.3/frame (0.0 candidates/frame)
    water samples: 59.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 59.2/frame, 0.10 ms/frame (worst call 0.30 ms, 12863.3 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 55.9
    behaviour executions/frame: 30.4
    presentation executions/frame: 30.4
  rats: 0.2 ms/frame (60.3 ms cumulative)
  social: 0.0 ms/frame (1.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (63.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 4.5 ms/frame
  agent updates: 4.4 ms/frame (1241.2 ms cumulative)
  forest sampling: 0.1 ms/frame (29.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.6 ms cumulative)
    targeting: 0.0 ms/frame (8.6 ms cumulative)
    decision: 0.0 ms/frame (2.3 ms cumulative)
    behaviour: 3.7 ms/frame (1032.1 ms cumulative)
    life/presentation: 0.4 ms/frame (121.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.2
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 19.2
    presentation executions/frame: 19.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.9
    village scan candidates/frame: 1617.8
    player perception checks/frame: 30.2

  nearest scans: 26.3/frame (7332 calls)
  nearest candidates checked: 447.2/frame (124768 total)
  herd leader scans: 0.2/frame (58 calls)
  herd candidates checked: 6.2/frame (1740 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.8/frame (175.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 191.2/frame, 0.20 ms/frame (worst call 1.50 ms)
    collider queries: 191.2/frame, 0.10 ms/frame (worst call 0.20 ms, 3410.4 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 22
Resident instances: full=482171 filler=113472
Submitted instances: full=75310 filler=42552
Meshes submitted: 74
LOD submitted fraction: full=0.15618940168529422 filler=0.375
Flowers: unavailable
Allocation bytes (estimated): 57181728
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 281
Shadow refresh frames: 281
Shadow skipped frames: 0

Mirror:
  calls avg: 313  tris avg: 989609
  info calls avg: 313  residual calls avg: 0
  environment                  calls=43 tris=8834
  items                        calls=1 tris=630
  other                        calls=38 tris=2280
  settlement:decor             calls=1 tris=834
  settlement:fence             calls=2 tris=9259
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=15 tris=717
  settlement:fireHouseInteriorLamp calls=5 tris=538
  settlement:fireVillageTorch  calls=5 tris=356
  settlement:houseInteractive  calls=15 tris=1644
  settlement:houseStatic       calls=33 tris=80216
  settlement:landmarkGarden    calls=5 tris=82508
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=932
  settlement:landmarkWellHousehold calls=5 tris=9317
  settlement:landmarkWellPasture calls=2 tris=932
  settlement:other             calls=9 tris=349
  settlement:storageBarrel     calls=4 tris=11722
  settlement:storageContainer  calls=28 tris=2308
  settlement:storageGoods      calls=39 tris=6949
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=4 tris=1694
  settlement:storageWoodHousehold calls=1 tris=5829
  settlement:storageWoodSettlementPrimary calls=0 tris=544
  settlement:storageWoodSettlementSecondary calls=1 tris=2806
  settlement:workplace         calls=11 tris=5274
  terrain                      calls=8 tris=587725
  vegetation                   calls=22 tris=164966

Shadow (refresh only):
  calls avg: 407  tris avg: 2176319
  info calls avg: 407  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=5 tris=1718
  faunaFamily:dog              calls=7 tris=2373
  faunaFamily:sheep            calls=4 tris=1220
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2747
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=3 tris=2752
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8718
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
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1370  tris avg: 4575991
  info calls avg: 1777  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5251
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15110
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=30 tris=1440
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
  settlement:storageGoods      calls=85 tris=15184
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=2 tris=11700
  settlement:storageWoodSettlementPrimary calls=2 tris=2184
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=83 tris=377054
  water                        calls=14 tris=966656


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

[LONG FRAME] 1373.2ms
simulate         7.4ms
render        1365.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              4.4ms
FAUNA            1.1ms
PHYSICS          0.0ms
RENDER        1365.5ms
OTHER            2.2ms

Long frame #2:

[LONG FRAME] 95.2ms
simulate        75.5ms
render          19.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA           68.3ms
PHYSICS          0.2ms
RENDER          19.5ms
OTHER            2.6ms

Long frame #3:

[LONG FRAME] 83.8ms
simulate        60.5ms
render          23.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.1ms
NPC              4.4ms
FAUNA           54.2ms
PHYSICS          0.1ms
RENDER          23.0ms
OTHER            1.8ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #4:

[LONG FRAME] 82.7ms
simulate        57.4ms
render          25.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.5ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           51.3ms
PHYSICS          0.3ms
RENDER          19.7ms
OTHER            1.8ms

Long frame #5:

[LONG FRAME] 80.1ms
simulate        55.3ms
render          24.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.3ms
STREAMING        0.0ms
NPC              4.4ms
FAUNA           48.4ms
PHYSICS          0.2ms
RENDER          19.5ms
OTHER            2.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=30.4 ms  p95=35.2 ms  max=37.1 ms  Δavg vs baseline=—
  hide-grass           avg=30.0 ms  p95=34.5 ms  max=40.0 ms  Δavg vs baseline=-0.4 ms (-1%)
  hide-vegetation      avg=22.5 ms  p95=25.6 ms  max=29.8 ms  Δavg vs baseline=-7.9 ms (-26%)
  no vegetation/grass  avg=23.0 ms  p95=30.5 ms  max=32.1 ms  Δavg vs baseline=-7.5 ms (-25%)
  hide-environment     avg=25.8 ms  p95=28.6 ms  max=29.8 ms  Δavg vs baseline=-4.6 ms (-15%)
  hide-settlement      avg=18.0 ms  p95=20.2 ms  max=24.0 ms  Δavg vs baseline=-12.4 ms (-41%)
  no water             avg=34.2 ms  p95=46.5 ms  max=49.4 ms  Δavg vs baseline=+3.8 ms (+12%)
  hide-terrain         avg=29.7 ms  p95=36.3 ms  max=38.7 ms  Δavg vs baseline=-0.7 ms (-2%)
  hide-npc-fauna       avg=14.9 ms  p95=16.7 ms  max=17.3 ms  Δavg vs baseline=-15.5 ms (-51%)
  no-shadows           avg=17.8 ms  p95=19.6 ms  max=20.4 ms  Δavg vs baseline=-12.6 ms (-41%)
  no-ao                avg=31.4 ms  p95=43.9 ms  max=46.7 ms  Δavg vs baseline=+1.0 ms (+3%)
  no-bloom             avg=32.5 ms  p95=38.1 ms  max=40.8 ms  Δavg vs baseline=+2.1 ms (+7%)
  no-smaa              avg=33.1 ms  p95=40.5 ms  max=41.6 ms  Δavg vs baseline=+2.7 ms (+9%)
  no-god-rays          avg=31.3 ms  p95=36.2 ms  max=38.2 ms  Δavg vs baseline=+0.9 ms (+3%)
  no-film-grade        avg=31.9 ms  p95=38.6 ms  max=54.9 ms  Δavg vs baseline=+1.4 ms (+5%)
  no postprocessing    avg=28.1 ms  p95=44.9 ms  max=52.8 ms  Δavg vs baseline=-2.4 ms (-8%)
  no mirrors           avg=22.8 ms  p95=25.1 ms  max=27.1 ms  Δavg vs baseline=-7.6 ms (-25%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=38.9 ms  p95=44.2 ms  max=44.3 ms
  CPU wall      avg=30.4 ms  p95=35.2 ms  max=37.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
