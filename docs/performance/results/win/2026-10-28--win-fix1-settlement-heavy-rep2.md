# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T17:28:35.821Z
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
Frames: 932
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 36e99ef6c31000b683619916b4d19a210408760e
  runId: 2026-10-28T17-27-30-623Z-qn9yst
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
  populationGate: stable waited=6988ms npc=53
  gpuTimer: available=true resolved=true samples=938 span=postprocess+labels

FPS:
  avg: 32.5
  min: 12
  p1: 14

Frame time (wall-clock):
  avg: 30.8 ms
  p50: 31 ms
  p95: 36.6 ms
  p99: 71.1 ms
  max: 80.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.9 p95=9.2 p99=50 max=52.7 n=932
  render: p50=24 p95=28.3 p99=30.2 max=35.1 n=932
  frame: p50=31 p95=36.6 p99=71.1 max=80.6 n=932

Rendering (combined renderer.info):
  draw calls: 2180 avg / 2546 max
  triangles: 7.76M avg
  mirror draws: 344 avg
  geometries: 983
  textures: 877

Pass submissions (actual):
  reliability: observed
  frames: 939 shadowRefresh=939 shadowSkipped=0
  mirror calls avg: 344
  shadow calls avg: 404
  main calls avg: 1433

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1459 tris=1.37M meshes=1459 inst=3548
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=509 tris=628.5k meshes=509 inst=509
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=514 tris=30.2k meshes=514 inst=516

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=20 tris=25.6k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=119 tris=15.4k meshes=119 inst=119

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
      mid  agents=2 camera-relevant=2 draws=20 tris=25.6k
      far  agents=51 camera-relevant=19 draws=489 tris=602.8k
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
  WATER          3.6 ms
  NPC            3.7 ms
  FAUNA          2.0 ms
  PHYSICS        0.1 ms
  RENDER         19.8 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=19.2 ms draws=2192 tris=7.76M
  hide-grass         render=18.9 ms draws=2149 tris=7.44M
  hide-vegetation    render=18.5 ms draws=2012 tris=6.67M
  hide-vegetation-grass render=18.2 ms draws=1955 tris=6.33M
  hide-environment   render=19.1 ms draws=1952 tris=7.71M
  hide-settlement    render=15.4 ms draws=1287 tris=6.86M
  hide-water         render=18.9 ms draws=2169 tris=6.79M
  hide-terrain       render=18.7 ms draws=2130 tris=3.71M
  hide-npc-fauna     render=13.2 ms draws=1833 tris=7.44M
  no-shadows         render=15.7 ms draws=1800 tris=5.58M
  no-ao              render=19.1 ms draws=2171 tris=7.76M
  no-bloom           render=19.1 ms draws=2166 tris=7.76M
  no-smaa            render=19.3 ms draws=2172 tris=7.76M
  no-god-rays        render=19.1 ms draws=2177 tris=7.76M
  no-film-grade      render=25.1 ms draws=2169 tris=7.76M
  no-postprocessing  render=18.7 ms draws=2147 tris=7.76M
  no-reflections     render=19.3 ms draws=1817 tris=6.76M

Frame attribution:
  frame max: 80.6 ms
  largest labelled hitch: 0 ms
  unattributed: 80.6 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 80.6 ms

Raw sidecar:
  sampling=full factor=1 exported=932/932

Recommendation:
Largest frame (80.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.7 ms/frame
  crowd pass: 0.0 ms/frame (14.6 ms cumulative)
  agent updates: 2.4 ms/frame (2243.8 ms cumulative)
  livestock: 1.0 ms/frame (902.9 ms cumulative)
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
      behaviour: 0.5 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 5.0/frame (5.0 rat candidates/frame)
    nearest scans: 20.6/frame (0.0 candidates/frame)
    water samples: 46.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 46.3/frame, 0.10 ms/frame (worst call 1.00 ms, 10449.6 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 56.0
    behaviour executions/frame: 21.0
    presentation executions/frame: 18.3
  rats: 0.1 ms/frame (73.2 ms cumulative)
  social: 0.0 ms/frame (5.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (155.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.0 ms/frame
  agent updates: 2.0 ms/frame (1864.8 ms cumulative)
  forest sampling: 0.1 ms/frame (68.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (13.1 ms cumulative)
    targeting: 0.0 ms/frame (21.5 ms cumulative)
    decision: 0.0 ms/frame (7.7 ms cumulative)
    behaviour: 1.5 ms/frame (1417.6 ms cumulative)
    life/presentation: 0.3 ms/frame (278.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.4
    decision passes/frame: 29.4
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.1
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 21.8
    behaviour executions/frame: 16.1
    presentation executions/frame: 14.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 117.4
    village scan candidates/frame: 1610.8
    player perception checks/frame: 29.4

  nearest scans: 22.7/frame (21167 calls)
  nearest candidates checked: 412.5/frame (384495 total)
  herd leader scans: 0.2/frame (149 calls)
  herd candidates checked: 4.8/frame (4470 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.9/frame (144.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 80.5/frame, 0.10 ms/frame (worst call 1.50 ms)
    collider queries: 80.5/frame, 0.00 ms/frame (worst call 0.80 ms, 1378.8 colliders/frame)

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
Frames: 939
Shadow refresh frames: 939
Shadow skipped frames: 0

Mirror:
  calls avg: 344  tris avg: 996611
  info calls avg: 344  residual calls avg: 0
  environment                  calls=44 tris=8875
  items                        calls=1 tris=633
  other                        calls=38 tris=2298
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9302
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3123
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1652
  settlement:houseStatic       calls=33 tris=80588
  settlement:landmarkGarden    calls=5 tris=82891
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=9360
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11777
  settlement:storageContainer  calls=28 tris=2318
  settlement:storageGoods      calls=40 tris=6981
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1702
  settlement:storageWoodHousehold calls=1 tris=5856
  settlement:storageWoodSettlementPrimary calls=1 tris=547
  settlement:storageWoodSettlementSecondary calls=1 tris=2819
  settlement:workplace         calls=11 tris=5299
  terrain                      calls=8 tris=590452
  vegetation                   calls=23 tris=165732

Shadow (refresh only):
  calls avg: 404  tris avg: 2175334
  info calls avg: 404  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=1 tris=498
  faunaFamily:dog              calls=6 tris=2021
  faunaFamily:donkey           calls=0 tris=106
  faunaFamily:sheep            calls=4 tris=1190
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3540
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=2572
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8727
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
  calls avg: 1433  tris avg: 4586207
  info calls avg: 1836  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=17 tris=5088
  grass                        calls=33 tris=316772
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=109 tris=133838
  npcFamily:Peasant_Boots      calls=9 tris=12110
  npcFamily:Wizard             calls=35 tris=34944
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15125
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 80.6ms
simulate        52.7ms
render          27.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           47.0ms
PHYSICS          0.1ms
RENDER          20.4ms
OTHER            2.2ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.2 ms  p95=20.5 ms  max=21.5 ms  Δavg vs baseline=—
  hide-grass           avg=18.9 ms  p95=20.4 ms  max=20.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-vegetation      avg=18.5 ms  p95=19.6 ms  max=19.7 ms  Δavg vs baseline=-0.7 ms (-4%)
  no vegetation/grass  avg=18.2 ms  p95=19.3 ms  max=20.2 ms  Δavg vs baseline=-1.0 ms (-5%)
  hide-environment     avg=19.1 ms  p95=21.7 ms  max=21.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-settlement      avg=15.4 ms  p95=16.2 ms  max=16.9 ms  Δavg vs baseline=-3.8 ms (-20%)
  no water             avg=18.9 ms  p95=20.1 ms  max=20.4 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-terrain         avg=18.7 ms  p95=19.9 ms  max=20.1 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-npc-fauna       avg=13.2 ms  p95=14.4 ms  max=14.7 ms  Δavg vs baseline=-6.1 ms (-31%)
  no-shadows           avg=15.7 ms  p95=17.0 ms  max=17.9 ms  Δavg vs baseline=-3.5 ms (-18%)
  no-ao                avg=19.1 ms  p95=20.3 ms  max=21.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=19.1 ms  p95=20.7 ms  max=22.3 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-smaa              avg=19.3 ms  p95=20.4 ms  max=20.9 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-god-rays          avg=19.1 ms  p95=20.2 ms  max=20.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-film-grade        avg=25.1 ms  p95=38.5 ms  max=39.5 ms  Δavg vs baseline=+5.8 ms (+30%)
  no postprocessing    avg=18.7 ms  p95=19.8 ms  max=20.1 ms  Δavg vs baseline=-0.6 ms (-3%)
  no mirrors           avg=19.3 ms  p95=20.5 ms  max=22.2 ms  Δavg vs baseline=+0.0 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=19.4 ms  p95=20.2 ms  max=22.0 ms
  CPU wall      avg=19.2 ms  p95=20.5 ms  max=21.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
