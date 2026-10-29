# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T13:39:41.352Z
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
Frames: 839
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 2bca37bcba8388d22d324c73733c03da695da59e
  runId: 2026-10-29T13-38-30-960Z-t2ccig
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
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=6428ms npc=53
  gpuTimer: available=true resolved=true samples=845 span=postprocess+labels

FPS:
  avg: 28.7
  min: 12
  p1: 22

Frame time (wall-clock):
  avg: 34.8 ms
  p50: 35.4 ms
  p95: 40.7 ms
  p99: 44.7 ms
  max: 85.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7 p95=9.3 p99=12.8 max=61.6 n=839
  render: p50=28.2 p95=32.9 p99=35.7 max=39.8 n=839
  frame: p50=35.4 p95=40.7 p99=44.7 max=85.6 n=839

Rendering (combined renderer.info):
  draw calls: 2160 avg / 2495 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 929
  textures: 765

Pass submissions (actual):
  reliability: observed
  frames: 846 shadowRefresh=846 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 402
  main calls avg: 1444

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=20 tris=25.8k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=117 tris=15.1k meshes=117 inst=117

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
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=88 camera-relevant=20 draws=389 tris=149.0k

Systems:
  WATER          4.1 ms
  NPC            4.7 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         23.2 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.5 ms draws=2154 tris=7.74M
  hide-grass         render=22.2 ms draws=2131 tris=7.44M
  hide-vegetation    render=22.5 ms draws=1986 tris=6.66M
  hide-vegetation-grass render=20.7 ms draws=1941 tris=6.35M
  hide-environment   render=20.7 ms draws=1848 tris=7.69M
  hide-settlement    render=17.1 ms draws=1356 tris=6.86M
  hide-water         render=20.2 ms draws=2139 tris=6.79M
  hide-terrain       render=20.8 ms draws=2088 tris=3.69M
  hide-npc-fauna     render=13.0 ms draws=1802 tris=7.43M
  no-shadows         render=16.6 ms draws=1773 tris=5.58M
  no-ao              render=20.8 ms draws=2130 tris=7.74M
  no-bloom           render=18.7 ms draws=2121 tris=7.75M
  no-smaa            render=18.6 ms draws=2136 tris=7.75M
  no-god-rays        render=18.6 ms draws=2127 tris=7.74M
  no-film-grade      render=19.0 ms draws=2126 tris=7.74M
  no-postprocessing  render=21.0 ms draws=2118 tris=7.76M
  no-reflections     render=20.7 ms draws=1806 tris=6.75M

Frame attribution:
  frame max: 85.6 ms
  largest labelled hitch: 0 ms
  unattributed: 85.6 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 85.6 ms

Raw sidecar:
  sampling=full factor=1 exported=839/839

Recommendation:
Largest frame (85.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (16.3 ms cumulative)
  agent updates: 2.9 ms/frame (2455.8 ms cumulative)
  livestock: 1.4 ms/frame (1186.3 ms cumulative)
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
      other update: 0.1 ms/frame
    update calls/frame: 56.5
    unique animals/frame: 50.4
    duplicate updates/frame: 6.1
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.9 predator candidates/frame)
    pest scans: 6.3/frame (6.3 rat candidates/frame)
    nearest scans: 25.0/frame (0.0 candidates/frame)
    water samples: 56.2/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 56.2/frame, 0.10 ms/frame (worst call 1.00 ms, 12513.6 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 56.1
    behaviour executions/frame: 25.1
    presentation executions/frame: 19.9
  rats: 0.1 ms/frame (98.9 ms cumulative)
  social: 0.0 ms/frame (4.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (162.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.0 ms/frame (878.8 ms cumulative)
  forest sampling: 0.1 ms/frame (70.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.3 ms cumulative)
    targeting: 0.0 ms/frame (26.4 ms cumulative)
    decision: 0.0 ms/frame (9.3 ms cumulative)
    behaviour: 0.5 ms/frame (424.2 ms cumulative)
    life/presentation: 0.3 ms/frame (259.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.1
    full-rate agents/frame: 7.9
    reduced-cadence agents/frame: 22.2
    behaviour executions/frame: 18.1
    presentation executions/frame: 15.5

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 120.3
    village scan candidates/frame: 1612.2
    player perception checks/frame: 30.1

  nearest scans: 25.5/frame (21360 calls)
  nearest candidates checked: 443.3/frame (371902 total)
  herd leader scans: 0.2/frame (173 calls)
  herd candidates checked: 6.2/frame (5190 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.6/frame (162.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 34.7/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 34.7/frame, 0.00 ms/frame (worst call 0.20 ms, 598.2 colliders/frame)

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
Frames: 846
Shadow refresh frames: 846
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993129
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2273
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
  vegetation                   calls=23 tris=165556

Shadow (refresh only):
  calls avg: 402  tris avg: 2169123
  info calls avg: 402  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=50
  faunaFamily:cow              calls=1 tris=194
  faunaFamily:dog              calls=7 tris=2326
  faunaFamily:sheep            calls=4 tris=1242
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3802
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=2 tris=2390
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8712
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
  vegetation                   calls=77 tris=548494

Main:
  calls avg: 1444  tris avg: 4588306
  info calls avg: 1846  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5130
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15080
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
  vegetation                   calls=84 tris=382238
  water                        calls=14 tris=966656


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

[LONG FRAME] 85.6ms
simulate        61.6ms
render          23.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.0ms
FAUNA           55.3ms
PHYSICS          0.3ms
RENDER          23.8ms
OTHER            2.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.5 ms  p95=24.8 ms  max=25.9 ms  Δavg vs baseline=—
  hide-grass           avg=22.2 ms  p95=23.3 ms  max=23.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-vegetation      avg=22.5 ms  p95=28.6 ms  max=31.5 ms  Δavg vs baseline=-0.0 ms (-0%)
  no vegetation/grass  avg=20.7 ms  p95=22.4 ms  max=24.5 ms  Δavg vs baseline=-1.9 ms (-8%)
  hide-environment     avg=20.7 ms  p95=24.5 ms  max=26.4 ms  Δavg vs baseline=-1.8 ms (-8%)
  hide-settlement      avg=17.1 ms  p95=18.9 ms  max=19.6 ms  Δavg vs baseline=-5.5 ms (-24%)
  no water             avg=20.2 ms  p95=24.2 ms  max=27.8 ms  Δavg vs baseline=-2.3 ms (-10%)
  hide-terrain         avg=20.8 ms  p95=24.5 ms  max=25.1 ms  Δavg vs baseline=-1.7 ms (-8%)
  hide-npc-fauna       avg=13.0 ms  p95=13.5 ms  max=30.7 ms  Δavg vs baseline=-9.5 ms (-42%)
  no-shadows           avg=16.6 ms  p95=17.4 ms  max=17.6 ms  Δavg vs baseline=-5.9 ms (-26%)
  no-ao                avg=20.8 ms  p95=23.5 ms  max=24.1 ms  Δavg vs baseline=-1.7 ms (-8%)
  no-bloom             avg=18.7 ms  p95=21.1 ms  max=22.7 ms  Δavg vs baseline=-3.8 ms (-17%)
  no-smaa              avg=18.6 ms  p95=20.4 ms  max=21.2 ms  Δavg vs baseline=-4.0 ms (-18%)
  no-god-rays          avg=18.6 ms  p95=20.6 ms  max=21.9 ms  Δavg vs baseline=-3.9 ms (-17%)
  no-film-grade        avg=19.0 ms  p95=21.6 ms  max=22.1 ms  Δavg vs baseline=-3.6 ms (-16%)
  no postprocessing    avg=21.0 ms  p95=22.8 ms  max=24.9 ms  Δavg vs baseline=-1.5 ms (-7%)
  no mirrors           avg=20.7 ms  p95=23.4 ms  max=24.4 ms  Δavg vs baseline=-1.9 ms (-8%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=20.7 ms  p95=23.1 ms  max=24.2 ms
  CPU wall      avg=22.5 ms  p95=24.8 ms  max=25.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
