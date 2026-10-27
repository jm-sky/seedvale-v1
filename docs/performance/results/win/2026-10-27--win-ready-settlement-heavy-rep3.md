# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:30:31.044Z
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
Frames: 768
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-29-18-900Z-5ajabq
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
  populationGate: stable waited=5977ms npc=53
  gpuTimer: available=true resolved=true samples=772 span=postprocess+labels

FPS:
  avg: 28.3
  min: 10
  p1: 12

Frame time (wall-clock):
  avg: 35.4 ms
  p50: 35.5 ms
  p95: 42.2 ms
  p99: 80.5 ms
  max: 96.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.5 p95=16.3 p99=52.1 max=66 n=768
  render: p50=25.9 p95=28.7 p99=29.5 max=30.7 n=768
  frame: p50=35.5 p95=42.2 p99=80.5 max=96.9 n=768

Rendering (combined renderer.info):
  draw calls: 2368 avg / 2741 max
  triangles: 7.86M avg
  mirror draws: 353 avg
  geometries: 962
  textures: 1042

Pass submissions (actual):
  reliability: observed
  frames: 773 shadowRefresh=773 shadowSkipped=0
  mirror calls avg: 353
  shadow calls avg: 423
  main calls avg: 1593

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
  other            draws=513 tris=30.1k meshes=513 inst=515

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=805 tris=833.3k meshes=805 inst=2697
  npc              draws=30 tris=35.1k meshes=30 inst=30
  fauna            draws=22 tris=7.5k meshes=22 inst=22
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=118 tris=15.2k meshes=118 inst=118

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
      mid  agents=3 camera-relevant=2 draws=30 tris=35.1k
      far  agents=50 camera-relevant=19 draws=490 tris=586.2k
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
      far  agents=86 camera-relevant=18 draws=377 tris=144.7k

Systems:
  WATER          3.4 ms
  NPC            4.2 ms
  FAUNA          2.3 ms
  PHYSICS        0.1 ms
  RENDER         21.2 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=20.5 ms draws=2370 tris=7.86M
  hide-grass         render=20.3 ms draws=2332 tris=7.54M
  hide-vegetation    render=19.5 ms draws=2186 tris=6.78M
  hide-vegetation-grass render=20.0 ms draws=2151 tris=6.46M
  hide-environment   render=19.9 ms draws=2094 tris=7.81M
  hide-settlement    render=16.6 ms draws=1442 tris=6.97M
  hide-water         render=20.1 ms draws=2335 tris=6.89M
  hide-terrain       render=19.9 ms draws=2294 tris=3.80M
  hide-npc-fauna     render=12.7 ms draws=1856 tris=7.42M
  no-shadows         render=16.9 ms draws=1959 tris=5.69M
  no-ao              render=20.2 ms draws=2350 tris=7.87M
  no-bloom           render=20.3 ms draws=2334 tris=7.86M
  no-smaa            render=20.6 ms draws=2342 tris=7.86M
  no-god-rays        render=20.4 ms draws=2346 tris=7.87M
  no-film-grade      render=20.3 ms draws=2342 tris=7.86M
  no-postprocessing  render=20.5 ms draws=2309 tris=7.85M
  no-reflections     render=20.1 ms draws=1982 tris=6.86M

Frame attribution:
  frame max: 96.9 ms
  largest labelled hitch: 0 ms
  unattributed: 96.9 ms

Long frames:
  threshold: 80 ms
  count: 11
  worst: 96.9 ms

Raw sidecar:
  sampling=full factor=1 exported=768/768

Recommendation:
Largest frame (96.9 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.2 ms/frame
  crowd pass: 0.0 ms/frame (10.0 ms cumulative)
  agent updates: 2.3 ms/frame (1734.2 ms cumulative)
  livestock: 1.6 ms/frame (1264.7 ms cumulative)
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
      behaviour: 1.2 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.3
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 6.3/frame (6.3 rat candidates/frame)
    nearest scans: 26.4/frame (0.0 candidates/frame)
    water samples: 58.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 58.9/frame, 0.10 ms/frame (worst call 0.90 ms, 12790.1 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 56.0
    behaviour executions/frame: 26.5
    presentation executions/frame: 20.3
  rats: 0.1 ms/frame (74.3 ms cumulative)
  social: 0.0 ms/frame (3.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (124.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.3 ms/frame
  agent updates: 2.3 ms/frame (1770.8 ms cumulative)
  forest sampling: 0.1 ms/frame (49.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (10.0 ms cumulative)
    targeting: 0.0 ms/frame (16.4 ms cumulative)
    decision: 0.0 ms/frame (6.9 ms cumulative)
    behaviour: 1.9 ms/frame (1428.5 ms cumulative)
    life/presentation: 0.3 ms/frame (214.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.5
    decision passes/frame: 29.5
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.0
    full-rate agents/frame: 8.0
    reduced-cadence agents/frame: 21.6
    behaviour executions/frame: 18.0
    presentation executions/frame: 15.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 118.1
    village scan candidates/frame: 1616.8
    player perception checks/frame: 29.5

  nearest scans: 24.8/frame (19014 calls)
  nearest candidates checked: 445.5/frame (342160 total)
  herd leader scans: 0.2/frame (117 calls)
  herd candidates checked: 4.6/frame (3510 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.0/frame (149.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 100.9/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 100.9/frame, 0.10 ms/frame (worst call 0.40 ms, 1810.1 colliders/frame)

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
Frames: 773
Shadow refresh frames: 773
Shadow skipped frames: 0

Mirror:
  calls avg: 353  tris avg: 991326
  info calls avg: 353  residual calls avg: 0
  environment                  calls=44 tris=8877
  items                        calls=1 tris=633
  other                        calls=38 tris=2300
  settlement:decor             calls=1 tris=838
  settlement:fence             calls=2 tris=9304
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3124
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1652
  settlement:houseStatic       calls=33 tris=80606
  settlement:landmarkGarden    calls=5 tris=82910
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=9362
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11779
  settlement:storageContainer  calls=28 tris=2319
  settlement:storageGoods      calls=40 tris=6983
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1702
  settlement:storageWoodHousehold calls=10 tris=4461
  settlement:storageWoodSettlementPrimary calls=1 tris=1075
  settlement:storageWoodSettlementSecondary calls=1 tris=2820
  settlement:workplace         calls=11 tris=5300
  terrain                      calls=8 tris=590587
  vegetation                   calls=22 tris=161124

Shadow (refresh only):
  calls avg: 423  tris avg: 2177754
  info calls avg: 423  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=3 tris=922
  faunaFamily:dog              calls=7 tris=2156
  faunaFamily:sheep            calls=4 tris=1220
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=5140
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=3109
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=30 tris=8717
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
  calls avg: 1593  tris avg: 4696091
  info calls avg: 2015  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=14 tris=4168
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=164 tris=179538
  npcFamily:Peasant_Boots      calls=42 tris=48628
  npcFamily:Wizard             calls=60 tris=56931
  npcFamily:blacksmith         calls=36 tris=38577
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=130 tris=15022
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
  settlement:storageGoods      calls=79 tris=13948
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
Long frames: 11
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 11 total):

[LONG FRAME] 96.9ms
simulate        65.9ms
render          30.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        0.0ms
NPC              4.5ms
FAUNA           56.8ms
PHYSICS          0.1ms
RENDER          23.4ms
OTHER            4.8ms

Long frame #2:

[LONG FRAME] 95.5ms
simulate        66.0ms
render          29.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        0.0ms
NPC              3.8ms
FAUNA           58.0ms
PHYSICS          0.2ms
RENDER          22.1ms
OTHER            4.1ms

Long frame #3:

[LONG FRAME] 83ms
simulate        52.1ms
render          30.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.3ms
STREAMING        0.0ms
NPC              3.3ms
FAUNA           44.3ms
PHYSICS          0.2ms
RENDER          23.4ms
OTHER            4.5ms

Long frame #4:

[LONG FRAME] 82.3ms
simulate        52.6ms
render          29.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.2ms
STREAMING        0.0ms
NPC              3.6ms
FAUNA           44.3ms
PHYSICS          0.0ms
RENDER          21.6ms
OTHER            4.6ms

Long frame #5:

[LONG FRAME] 82.2ms
simulate        54.2ms
render          27.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.5ms
STREAMING        0.0ms
NPC             48.6ms
FAUNA            1.0ms
PHYSICS          0.0ms
RENDER          20.3ms
OTHER            4.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=20.5 ms  p95=21.3 ms  max=21.9 ms  Δavg vs baseline=—
  hide-grass           avg=20.3 ms  p95=21.2 ms  max=21.4 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-vegetation      avg=19.5 ms  p95=20.1 ms  max=22.1 ms  Δavg vs baseline=-0.9 ms (-5%)
  no vegetation/grass  avg=20.0 ms  p95=22.1 ms  max=22.4 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-environment     avg=19.9 ms  p95=20.6 ms  max=21.2 ms  Δavg vs baseline=-0.6 ms (-3%)
  hide-settlement      avg=16.6 ms  p95=17.2 ms  max=18.2 ms  Δavg vs baseline=-3.9 ms (-19%)
  no water             avg=20.1 ms  p95=20.6 ms  max=21.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-terrain         avg=19.9 ms  p95=20.5 ms  max=21.2 ms  Δavg vs baseline=-0.5 ms (-3%)
  hide-npc-fauna       avg=12.7 ms  p95=13.3 ms  max=14.2 ms  Δavg vs baseline=-7.7 ms (-38%)
  no-shadows           avg=16.9 ms  p95=17.5 ms  max=18.7 ms  Δavg vs baseline=-3.6 ms (-17%)
  no-ao                avg=20.2 ms  p95=20.9 ms  max=21.2 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-bloom             avg=20.3 ms  p95=21.2 ms  max=22.3 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=20.6 ms  p95=21.1 ms  max=31.1 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-god-rays          avg=20.4 ms  p95=20.9 ms  max=22.6 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-film-grade        avg=20.3 ms  p95=21.0 ms  max=21.5 ms  Δavg vs baseline=-0.2 ms (-1%)
  no postprocessing    avg=20.5 ms  p95=21.5 ms  max=26.3 ms  Δavg vs baseline=-0.0 ms (-0%)
  no mirrors           avg=20.1 ms  p95=22.5 ms  max=23.9 ms  Δavg vs baseline=-0.4 ms (-2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=18.1 ms  p95=19.0 ms  max=20.1 ms
  CPU wall      avg=20.5 ms  p95=21.3 ms  max=21.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
