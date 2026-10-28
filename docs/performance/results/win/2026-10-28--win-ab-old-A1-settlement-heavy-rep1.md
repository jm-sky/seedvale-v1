# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T21:14:42.591Z
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
Frames: 887
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 36e99ef6c31000b683619916b4d19a210408760e
  runId: 2026-10-28T21-13-36-079Z-onegz7
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
  populationGate: stable waited=6128ms npc=53
  gpuTimer: available=true resolved=true samples=893 span=postprocess+labels

FPS:
  avg: 30.9
  min: 11
  p1: 14

Frame time (wall-clock):
  avg: 32.4 ms
  p50: 32.6 ms
  p95: 41.2 ms
  p99: 69.5 ms
  max: 93.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6 p95=8.7 p99=48.2 max=57.7 n=887
  render: p50=26.7 p95=30.9 p99=38.4 max=52.2 n=887
  frame: p50=32.6 p95=41.2 p99=69.5 max=93.9 n=887

Rendering (combined renderer.info):
  draw calls: 2252 avg / 2626 max
  triangles: 7.76M avg
  mirror draws: 344 avg
  geometries: 983
  textures: 879

Pass submissions (actual):
  reliability: observed
  frames: 894 shadowRefresh=894 shadowSkipped=0
  mirror calls avg: 344
  shadow calls avg: 403
  main calls avg: 1506

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1459 tris=1.37M meshes=1459 inst=3548
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=509 tris=628.5k meshes=509 inst=509
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=42 tris=49.1k meshes=42 inst=42
  fauna            draws=20 tris=5.7k meshes=20 inst=20
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
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.3k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=4 camera-relevant=2 draws=42 tris=49.1k
      far  agents=49 camera-relevant=19 draws=467 tris=579.3k
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
      mid  agents=5 camera-relevant=4 draws=20 tris=5.7k
      far  agents=86 camera-relevant=20 draws=379 tris=146.5k

Systems:
  WATER          3.6 ms
  NPC            3.8 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         21.5 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=20.3 ms draws=2258 tris=7.76M
  hide-grass         render=20.1 ms draws=2228 tris=7.45M
  hide-vegetation    render=21.4 ms draws=2076 tris=6.66M
  hide-vegetation-grass render=20.3 ms draws=2040 tris=6.35M
  hide-environment   render=20.5 ms draws=1954 tris=7.70M
  hide-settlement    render=17.0 ms draws=1371 tris=6.88M
  hide-water         render=20.5 ms draws=2243 tris=6.80M
  hide-terrain       render=19.7 ms draws=2196 tris=3.70M
  hide-npc-fauna     render=13.8 ms draws=1907 tris=7.44M
  no-shadows         render=17.0 ms draws=1870 tris=5.59M
  no-ao              render=20.2 ms draws=2237 tris=7.76M
  no-bloom           render=20.1 ms draws=2238 tris=7.76M
  no-smaa            render=20.9 ms draws=2245 tris=7.76M
  no-god-rays        render=20.4 ms draws=2245 tris=7.77M
  no-film-grade      render=20.5 ms draws=2248 tris=7.77M
  no-postprocessing  render=20.2 ms draws=2223 tris=7.77M
  no-reflections     render=20.6 ms draws=1906 tris=6.78M

Frame attribution:
  frame max: 93.9 ms
  largest labelled hitch: 0 ms
  unattributed: 93.9 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 93.9 ms

Raw sidecar:
  sampling=full factor=1 exported=887/887

Recommendation:
Largest frame (93.9 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.8 ms/frame
  crowd pass: 0.0 ms/frame (15.5 ms cumulative)
  agent updates: 2.5 ms/frame (2207.4 ms cumulative)
  livestock: 1.0 ms/frame (916.6 ms cumulative)
    loaded tick: 1.0 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.0 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 5.4/frame (5.4 rat candidates/frame)
    nearest scans: 21.5/frame (0.0 candidates/frame)
    water samples: 49.4/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 49.4/frame, 0.10 ms/frame (worst call 0.90 ms, 10891.2 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 56.0
    behaviour executions/frame: 21.9
    presentation executions/frame: 19.0
  rats: 0.1 ms/frame (68.3 ms cumulative)
  social: 0.0 ms/frame (4.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (157.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.8 ms/frame (1566.1 ms cumulative)
  forest sampling: 0.1 ms/frame (62.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.3 ms cumulative)
    targeting: 0.0 ms/frame (21.1 ms cumulative)
    decision: 0.0 ms/frame (7.2 ms cumulative)
    behaviour: 1.3 ms/frame (1121.3 ms cumulative)
    life/presentation: 0.3 ms/frame (285.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.6
    decision passes/frame: 29.6
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.6
    full-rate agents/frame: 9.4
    reduced-cadence agents/frame: 20.2
    behaviour executions/frame: 17.6
    presentation executions/frame: 16.0

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 118.5
    village scan candidates/frame: 1615.4
    player perception checks/frame: 29.6

  nearest scans: 23.6/frame (20911 calls)
  nearest candidates checked: 414.0/frame (367217 total)
  herd leader scans: 0.2/frame (162 calls)
  herd candidates checked: 5.5/frame (4860 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.4/frame (161.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 146.3/frame, 0.10 ms/frame (worst call 1.30 ms)
    collider queries: 146.3/frame, 0.10 ms/frame (worst call 0.10 ms, 2807.5 colliders/frame)

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
Frames: 894
Shadow refresh frames: 894
Shadow skipped frames: 0

Mirror:
  calls avg: 344  tris avg: 995553
  info calls avg: 344  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2297
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
  calls avg: 403  tris avg: 2175107
  info calls avg: 403  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=37
  faunaFamily:dog              calls=7 tris=2279
  faunaFamily:sheep            calls=4 tris=1165
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3032
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=3194
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8722
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
  calls avg: 1506  tris avg: 4593249
  info calls avg: 1909  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=16 tris=4845
  grass                        calls=33 tris=316772
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=109 tris=133838
  npcFamily:Peasant_Boots      calls=9 tris=12110
  npcFamily:Wizard             calls=35 tris=34944
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15128
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=90 tris=6240
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 93.9ms
simulate        57.7ms
render          35.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              8.8ms
FAUNA           47.5ms
PHYSICS          0.2ms
RENDER          35.9ms
OTHER            1.4ms

Long frame #2:

[LONG FRAME] 81.1ms
simulate        51.9ms
render          28.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.5ms
STREAMING        0.0ms
NPC              4.8ms
FAUNA           44.9ms
PHYSICS          0.1ms
RENDER          22.3ms
OTHER            2.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=20.3 ms  p95=21.6 ms  max=22.1 ms  Δavg vs baseline=—
  hide-grass           avg=20.1 ms  p95=21.5 ms  max=21.8 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-vegetation      avg=21.4 ms  p95=23.5 ms  max=25.0 ms  Δavg vs baseline=+1.0 ms (+5%)
  no vegetation/grass  avg=20.3 ms  p95=21.7 ms  max=23.7 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-environment     avg=20.5 ms  p95=21.6 ms  max=24.1 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-settlement      avg=17.0 ms  p95=18.3 ms  max=18.6 ms  Δavg vs baseline=-3.3 ms (-16%)
  no water             avg=20.5 ms  p95=21.9 ms  max=22.4 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-terrain         avg=19.7 ms  p95=21.1 ms  max=21.7 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-npc-fauna       avg=13.8 ms  p95=14.7 ms  max=15.0 ms  Δavg vs baseline=-6.5 ms (-32%)
  no-shadows           avg=17.0 ms  p95=18.0 ms  max=19.1 ms  Δavg vs baseline=-3.3 ms (-16%)
  no-ao                avg=20.2 ms  p95=21.8 ms  max=22.5 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=20.1 ms  p95=21.8 ms  max=22.3 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=20.9 ms  p95=23.1 ms  max=25.4 ms  Δavg vs baseline=+0.5 ms (+3%)
  no-god-rays          avg=20.4 ms  p95=21.8 ms  max=22.4 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-film-grade        avg=20.5 ms  p95=22.3 ms  max=22.4 ms  Δavg vs baseline=+0.2 ms (+1%)
  no postprocessing    avg=20.2 ms  p95=21.9 ms  max=22.3 ms  Δavg vs baseline=-0.1 ms (-1%)
  no mirrors           avg=20.6 ms  p95=23.3 ms  max=28.8 ms  Δavg vs baseline=+0.3 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=20.0 ms  p95=21.4 ms  max=22.0 ms
  CPU wall      avg=20.3 ms  p95=21.6 ms  max=22.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
