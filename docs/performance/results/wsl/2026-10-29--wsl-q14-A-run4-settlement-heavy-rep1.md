# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T19:03:32.242Z
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
Frames: 358
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 591231d7e90a73b5c8c869eb81ed60d1f5478c1c
  runId: 2026-10-29T19-01-56-412Z-91n3to
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
  populationGate: stable waited=7861ms npc=53
  gpuTimer: available=true resolved=true samples=357 span=postprocess+labels

FPS:
  avg: 24.9
  min: 11
  p1: 12

Frame time (wall-clock):
  avg: 40.2 ms
  p50: 41 ms
  p95: 48.5 ms
  p99: 83.8 ms
  max: 91.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7 p95=10.3 p99=52.2 max=59.2 n=358
  render: p50=33.5 p95=38.2 p99=42.1 max=43.9 n=358
  frame: p50=41 p95=48.5 p99=83.8 max=91.7 n=358

Rendering (combined renderer.info):
  draw calls: 2129 avg / 2482 max
  triangles: 6.63M avg
  mirror draws: 324 avg
  geometries: 1018
  textures: 801

Pass submissions (actual):
  reliability: observed
  frames: 360 shadowRefresh=360 shadowSkipped=0
  mirror calls avg: 324
  shadow calls avg: 396
  main calls avg: 1408

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=234 tris=13.9k meshes=234 inst=624
  environment      draws=236 tris=15.5k meshes=236 inst=284
  settlement       draws=1336 tris=976.1k meshes=1336 inst=3402
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=29.7k meshes=510 inst=510

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=205 tris=12.6k meshes=205 inst=570
  environment      draws=196 tris=4.2k meshes=196 inst=202
  settlement       draws=793 tris=446.1k meshes=793 inst=2685
  npc              draws=20 tris=25.8k meshes=20 inst=20
  fauna            draws=22 tris=7.5k meshes=22 inst=22
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
  workplace        draws=24 tris=14.1k meshes=24 inst=24
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=8.8k meshes=5 inst=11
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=28 tris=3.0k meshes=28 inst=28
  fireCampfire     draws=47 tris=876 meshes=47 inst=47
  decor            draws=236 tris=14.4k meshes=236 inst=319
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
      mid  agents=2 camera-relevant=2 draws=20 tris=25.8k
      far  agents=51 camera-relevant=19 draws=481 tris=603.7k
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
      mid  agents=5 camera-relevant=3 draws=22 tris=7.5k
      far  agents=86 camera-relevant=22 draws=377 tris=144.7k

Systems:
  WATER          5.1 ms
  NPC            4.5 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         26.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=26.2 ms draws=2139 tris=6.63M
  hide-grass         render=26.4 ms draws=2106 tris=6.32M
  hide-vegetation    render=24.1 ms draws=1941 tris=6.61M
  hide-vegetation-grass render=24.6 ms draws=1910 tris=6.30M
  hide-environment   render=25.7 ms draws=1868 tris=6.62M
  hide-settlement    render=20.4 ms draws=1326 tris=5.75M
  hide-water         render=27.4 ms draws=2122 tris=5.67M
  hide-terrain       render=25.0 ms draws=2079 tris=2.58M
  hide-npc-fauna     render=17.5 ms draws=1782 tris=6.31M
  no-shadows         render=20.9 ms draws=1756 tris=5.02M
  no-ao              render=27.7 ms draws=2135 tris=6.64M
  no-bloom           render=26.4 ms draws=2116 tris=6.64M
  no-smaa            render=26.7 ms draws=2128 tris=6.64M
  no-god-rays        render=26.1 ms draws=2122 tris=6.63M
  no-film-grade      render=26.4 ms draws=2116 tris=6.63M
  no-postprocessing  render=26.3 ms draws=2084 tris=6.63M
  no-reflections     render=25.0 ms draws=1771 tris=5.80M

Frame attribution:
  frame max: 91.7 ms
  largest labelled hitch: 0 ms
  unattributed: 91.7 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 91.7 ms

Raw sidecar:
  sampling=full factor=1 exported=358/358

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.5 ms/frame
  crowd pass: 0.0 ms/frame (6.9 ms cumulative)
  agent updates: 2.6 ms/frame (929.5 ms cumulative)
  livestock: 1.4 ms/frame (516.8 ms cumulative)
    loaded tick: 1.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 56.3
    unique animals/frame: 50.3
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.6 predator candidates/frame)
    pest scans: 7.0/frame (7.0 rat candidates/frame)
    nearest scans: 29.8/frame (0.0 candidates/frame)
    water samples: 64.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 64.4/frame, 0.10 ms/frame (worst call 0.20 ms, 14398.5 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 55.8
    behaviour executions/frame: 30.0
    presentation executions/frame: 29.9
  rats: 0.2 ms/frame (61.4 ms cumulative)
  social: 0.0 ms/frame (3.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (76.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.0 ms/frame (714.6 ms cumulative)
  forest sampling: 0.1 ms/frame (31.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.4 ms cumulative)
    targeting: 0.0 ms/frame (10.9 ms cumulative)
    decision: 0.0 ms/frame (3.8 ms cumulative)
    behaviour: 1.3 ms/frame (481.5 ms cumulative)
    life/presentation: 0.4 ms/frame (139.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.5
    full-rate agents/frame: 6.8
    reduced-cadence agents/frame: 23.4
    behaviour executions/frame: 18.5
    presentation executions/frame: 18.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.7
    village scan candidates/frame: 1605.0
    player perception checks/frame: 30.2

  nearest scans: 26.5/frame (9491 calls)
  nearest candidates checked: 470.9/frame (168576 total)
  herd leader scans: 0.4/frame (161 calls)
  herd candidates checked: 13.5/frame (4830 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.4/frame (164.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 68.0/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 68.0/frame, 0.00 ms/frame (worst call 0.30 ms, 1021.0 colliders/frame)

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
Frames: 360
Shadow refresh frames: 360
Shadow skipped frames: 0

Mirror:
  calls avg: 324  tris avg: 825962
  info calls avg: 324  residual calls avg: 0
  environment                  calls=53 tris=3900
  items                        calls=1 tris=632
  other                        calls=38 tris=2296
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=720
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
  settlement:storageGoods      calls=40 tris=6974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1700
  settlement:storageWoodHousehold calls=1 tris=5850
  settlement:storageWoodSettlementPrimary calls=1 tris=546
  settlement:storageWoodSettlementSecondary calls=1 tris=2816
  settlement:workplace         calls=11 tris=5293
  terrain                      calls=8 tris=589824
  vegetation                   calls=24 tris=3332

Shadow (refresh only):
  calls avg: 396  tris avg: 1607107
  info calls avg: 396  residual calls avg: 0
  environment                  calls=88 tris=1952
  faunaFamily:cow              calls=1 tris=347
  faunaFamily:dog              calls=7 tris=2308
  faunaFamily:sheep            calls=4 tris=1186
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2891
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=2 tris=2049
  npcFamily:blacksmith         calls=11 tris=15296
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
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=74 tris=8616

Main:
  calls avg: 1408  tris avg: 4197055
  info calls avg: 1805  residual calls avg: 0
  environment                  calls=124 tris=9050
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=21 tris=6497
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15125
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
  vegetation                   calls=88 tris=7472
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

[LONG FRAME] 91.7ms
simulate        59.2ms
render          32.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.1ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA           53.1ms
PHYSICS          0.1ms
RENDER          24.3ms
OTHER            1.6ms

Long frame #2:

[LONG FRAME] 90.2ms
simulate        53.1ms
render          37.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.8ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           46.6ms
PHYSICS          0.1ms
RENDER          27.1ms
OTHER            2.0ms

Long frame #3:

[LONG FRAME] 89.7ms
simulate        53.5ms
render          36.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.8ms
STREAMING        0.0ms
NPC              4.7ms
FAUNA           46.8ms
PHYSICS          0.2ms
RENDER          27.4ms
OTHER            1.8ms

Long frame #4:

[LONG FRAME] 84.4ms
simulate        51.2ms
render          33.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.5ms
STREAMING        0.1ms
NPC              4.8ms
FAUNA           44.7ms
PHYSICS          0.2ms
RENDER          24.5ms
OTHER            1.6ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #5:

[LONG FRAME] 83.3ms
simulate        51.9ms
render          31.3ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.5ms
STREAMING        0.0ms
NPC              4.2ms
FAUNA           45.8ms
PHYSICS          0.1ms
RENDER          22.9ms
OTHER            1.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=26.2 ms  p95=29.1 ms  max=37.0 ms  Δavg vs baseline=—
  hide-grass           avg=26.4 ms  p95=30.2 ms  max=34.2 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-vegetation      avg=24.1 ms  p95=27.4 ms  max=32.0 ms  Δavg vs baseline=-2.1 ms (-8%)
  no vegetation/grass  avg=24.6 ms  p95=29.0 ms  max=31.1 ms  Δavg vs baseline=-1.6 ms (-6%)
  hide-environment     avg=25.7 ms  p95=33.2 ms  max=37.2 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-settlement      avg=20.4 ms  p95=23.3 ms  max=26.0 ms  Δavg vs baseline=-5.8 ms (-22%)
  no water             avg=27.4 ms  p95=32.3 ms  max=43.6 ms  Δavg vs baseline=+1.2 ms (+5%)
  hide-terrain         avg=25.0 ms  p95=28.8 ms  max=29.3 ms  Δavg vs baseline=-1.2 ms (-5%)
  hide-npc-fauna       avg=17.5 ms  p95=19.7 ms  max=24.0 ms  Δavg vs baseline=-8.7 ms (-33%)
  no-shadows           avg=20.9 ms  p95=22.4 ms  max=22.7 ms  Δavg vs baseline=-5.3 ms (-20%)
  no-ao                avg=27.7 ms  p95=32.4 ms  max=37.9 ms  Δavg vs baseline=+1.5 ms (+6%)
  no-bloom             avg=26.4 ms  p95=30.4 ms  max=36.0 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-smaa              avg=26.7 ms  p95=29.3 ms  max=36.1 ms  Δavg vs baseline=+0.5 ms (+2%)
  no-god-rays          avg=26.1 ms  p95=30.3 ms  max=33.5 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-film-grade        avg=26.4 ms  p95=29.5 ms  max=34.5 ms  Δavg vs baseline=+0.2 ms (+1%)
  no postprocessing    avg=26.3 ms  p95=32.6 ms  max=47.5 ms  Δavg vs baseline=+0.1 ms (+1%)
  no mirrors           avg=25.0 ms  p95=26.6 ms  max=28.1 ms  Δavg vs baseline=-1.2 ms (-5%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=59.9 ms  p95=61.4 ms  max=69.2 ms
  CPU wall      avg=26.2 ms  p95=29.1 ms  max=37.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
