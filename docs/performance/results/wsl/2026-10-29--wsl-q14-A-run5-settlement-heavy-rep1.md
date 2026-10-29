# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T19:07:45.023Z
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
Frames: 327
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 591231d7e90a73b5c8c869eb81ed60d1f5478c1c
  runId: 2026-10-29T19-05-49-555Z-ju0tlw
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
  populationGate: stable waited=5562ms npc=53
  gpuTimer: available=true resolved=true samples=326 span=postprocess+labels

FPS:
  avg: 24.1
  min: 7
  p1: 18

Frame time (wall-clock):
  avg: 41.5 ms
  p50: 42.5 ms
  p95: 50 ms
  p99: 55.2 ms
  max: 142.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.4 p95=11.7 p99=16.8 max=32.6 n=327
  render: p50=33.7 p95=40.2 p99=46.3 max=136.3 n=327
  frame: p50=42.5 p95=50 p99=55.2 max=142.8 n=327

Rendering (combined renderer.info):
  draw calls: 2128 avg / 2459 max
  triangles: 7.75M avg
  mirror draws: 312 avg
  geometries: 964
  textures: 825

Pass submissions (actual):
  reliability: observed
  frames: 329 shadowRefresh=329 shadowSkipped=0
  mirror calls avg: 312
  shadow calls avg: 410
  main calls avg: 1407

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1291 tris=1.36M meshes=1291 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=509 tris=29.5k meshes=509 inst=510

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=30 tris=37.5k meshes=30 inst=30
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=114 tris=14.7k meshes=114 inst=114

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
      mid  agents=3 camera-relevant=2 draws=30 tris=37.5k
      far  agents=50 camera-relevant=19 draws=471 tris=592.0k
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
  WATER          5.0 ms
  NPC            4.6 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         28.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=31.4 ms draws=2123 tris=7.75M
  hide-grass         render=31.3 ms draws=2098 tris=7.44M
  hide-vegetation    render=25.8 ms draws=1944 tris=6.65M
  hide-vegetation-grass render=25.4 ms draws=1910 tris=6.34M
  hide-environment   render=24.9 ms draws=1866 tris=7.70M
  hide-settlement    render=20.4 ms draws=1327 tris=6.86M
  hide-water         render=32.2 ms draws=2122 tris=6.79M
  hide-terrain       render=30.6 ms draws=2072 tris=3.70M
  hide-npc-fauna     render=17.7 ms draws=1780 tris=7.43M
  no-shadows         render=20.5 ms draws=1749 tris=5.58M
  no-ao              render=29.0 ms draws=2115 tris=7.75M
  no-bloom           render=34.5 ms draws=2101 tris=7.75M
  no-smaa            render=34.8 ms draws=2108 tris=7.75M
  no-god-rays        render=33.9 ms draws=2106 tris=7.75M
  no-film-grade      render=34.3 ms draws=2114 tris=7.75M
  no-postprocessing  render=27.0 ms draws=2081 tris=7.75M
  no-reflections     render=26.5 ms draws=1804 tris=6.77M

Frame attribution:
  frame max: 142.8 ms
  largest labelled hitch: 0 ms
  unattributed: 142.8 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 142.8 ms

Raw sidecar:
  sampling=full factor=1 exported=327/327

Recommendation:
Largest frame (142.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.6 ms/frame
  crowd pass: 0.0 ms/frame (6.4 ms cumulative)
  agent updates: 2.6 ms/frame (837.9 ms cumulative)
  livestock: 1.5 ms/frame (501.8 ms cumulative)
    loaded tick: 1.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.5 ms/frame
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
    pest scans: 6.6/frame (6.6 rat candidates/frame)
    nearest scans: 30.1/frame (0.0 candidates/frame)
    water samples: 64.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 64.5/frame, 0.10 ms/frame (worst call 1.00 ms, 14017.4 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 56.0
    behaviour executions/frame: 30.3
    presentation executions/frame: 30.2
  rats: 0.2 ms/frame (77.4 ms cumulative)
  social: 0.0 ms/frame (2.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (76.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.4 ms/frame (467.9 ms cumulative)
  forest sampling: 0.1 ms/frame (33.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.6 ms cumulative)
    targeting: 0.0 ms/frame (11.7 ms cumulative)
    decision: 0.0 ms/frame (4.0 ms cumulative)
    behaviour: 0.6 ms/frame (204.9 ms cumulative)
    life/presentation: 0.5 ms/frame (160.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.8
    full-rate agents/frame: 7.3
    reduced-cadence agents/frame: 22.9
    behaviour executions/frame: 18.8
    presentation executions/frame: 18.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.7
    village scan candidates/frame: 1622.8
    player perception checks/frame: 30.2

  nearest scans: 25.2/frame (8252 calls)
  nearest candidates checked: 446.6/frame (146037 total)
  herd leader scans: 0.1/frame (49 calls)
  herd candidates checked: 4.5/frame (1470 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.4/frame (186.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 66.6/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 66.6/frame, 0.00 ms/frame (worst call 0.20 ms, 1169.6 colliders/frame)

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
Frames: 329
Shadow refresh frames: 329
Shadow skipped frames: 0

Mirror:
  calls avg: 312  tris avg: 990068
  info calls avg: 312  residual calls avg: 0
  environment                  calls=43 tris=8839
  items                        calls=1 tris=630
  other                        calls=37 tris=2224
  settlement:decor             calls=1 tris=834
  settlement:fence             calls=2 tris=9264
  settlement:fireCampfire      calls=9 tris=113
  settlement:fireHouseExteriorLamp calls=15 tris=718
  settlement:fireHouseInteriorLamp calls=5 tris=538
  settlement:fireVillageTorch  calls=5 tris=357
  settlement:houseInteractive  calls=15 tris=1645
  settlement:houseStatic       calls=33 tris=80257
  settlement:landmarkGarden    calls=5 tris=82551
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=932
  settlement:landmarkWellHousehold calls=5 tris=9322
  settlement:landmarkWellPasture calls=2 tris=932
  settlement:other             calls=9 tris=349
  settlement:storageBarrel     calls=4 tris=11728
  settlement:storageContainer  calls=28 tris=2309
  settlement:storageGoods      calls=39 tris=6953
  settlement:storageHay        calls=1 tris=487
  settlement:storageTrough     calls=4 tris=1695
  settlement:storageWoodHousehold calls=1 tris=5832
  settlement:storageWoodSettlementPrimary calls=0 tris=544
  settlement:storageWoodSettlementSecondary calls=1 tris=2807
  settlement:workplace         calls=11 tris=5277
  terrain                      calls=8 tris=588031
  vegetation                   calls=22 tris=165052

Shadow (refresh only):
  calls avg: 410  tris avg: 2179647
  info calls avg: 410  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=6 tris=2137
  faunaFamily:dog              calls=6 tris=2057
  faunaFamily:sheep            calls=4 tris=1220
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=5154
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=4 tris=3688
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
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1407  tris avg: 4584791
  info calls avg: 1816  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5345
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=139 tris=14991
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

[LONG FRAME] 142.8ms
simulate         6.3ms
render         136.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              3.5ms
FAUNA            1.1ms
PHYSICS          0.2ms
RENDER         136.3ms
OTHER            1.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=31.4 ms  p95=38.6 ms  max=39.7 ms  Δavg vs baseline=—
  hide-grass           avg=31.3 ms  p95=35.3 ms  max=38.9 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-vegetation      avg=25.8 ms  p95=31.2 ms  max=31.5 ms  Δavg vs baseline=-5.6 ms (-18%)
  no vegetation/grass  avg=25.4 ms  p95=30.7 ms  max=34.0 ms  Δavg vs baseline=-6.0 ms (-19%)
  hide-environment     avg=24.9 ms  p95=28.5 ms  max=31.1 ms  Δavg vs baseline=-6.5 ms (-21%)
  hide-settlement      avg=20.4 ms  p95=22.4 ms  max=23.0 ms  Δavg vs baseline=-11.0 ms (-35%)
  no water             avg=32.2 ms  p95=36.8 ms  max=38.3 ms  Δavg vs baseline=+0.8 ms (+3%)
  hide-terrain         avg=30.6 ms  p95=33.7 ms  max=43.7 ms  Δavg vs baseline=-0.8 ms (-3%)
  hide-npc-fauna       avg=17.7 ms  p95=20.1 ms  max=22.2 ms  Δavg vs baseline=-13.7 ms (-44%)
  no-shadows           avg=20.5 ms  p95=22.6 ms  max=23.0 ms  Δavg vs baseline=-10.9 ms (-35%)
  no-ao                avg=29.0 ms  p95=42.2 ms  max=46.8 ms  Δavg vs baseline=-2.4 ms (-8%)
  no-bloom             avg=34.5 ms  p95=41.5 ms  max=47.4 ms  Δavg vs baseline=+3.1 ms (+10%)
  no-smaa              avg=34.8 ms  p95=44.8 ms  max=45.8 ms  Δavg vs baseline=+3.4 ms (+11%)
  no-god-rays          avg=33.9 ms  p95=43.3 ms  max=53.1 ms  Δavg vs baseline=+2.5 ms (+8%)
  no-film-grade        avg=34.3 ms  p95=39.5 ms  max=40.3 ms  Δavg vs baseline=+2.9 ms (+9%)
  no postprocessing    avg=27.0 ms  p95=35.0 ms  max=45.2 ms  Δavg vs baseline=-4.4 ms (-14%)
  no mirrors           avg=26.5 ms  p95=30.1 ms  max=30.2 ms  Δavg vs baseline=-4.9 ms (-16%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=55.3 ms  p95=63.4 ms  max=63.9 ms
  CPU wall      avg=31.4 ms  p95=38.6 ms  max=39.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
