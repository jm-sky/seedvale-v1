# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T21:21:08.928Z
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
Frames: 980
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 36e99ef6c31000b683619916b4d19a210408760e
  runId: 2026-10-28T21-20-03-179Z-ftg8bm
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
  populationGate: stable waited=5836ms npc=53
  gpuTimer: available=true resolved=true samples=986 span=postprocess+labels

FPS:
  avg: 33.6
  min: 16
  p1: 24

Frame time (wall-clock):
  avg: 29.7 ms
  p50: 30.8 ms
  p95: 35.1 ms
  p99: 41.9 ms
  max: 63.1 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.8 p95=8.1 p99=12.3 max=42.6 n=980
  render: p50=24.8 p95=28.2 p99=30.7 max=48.2 n=980
  frame: p50=30.8 p95=35.1 p99=41.9 max=63.1 n=980

Rendering (combined renderer.info):
  draw calls: 2259 avg / 2632 max
  triangles: 7.77M avg
  mirror draws: 344 avg
  geometries: 983
  textures: 877

Pass submissions (actual):
  reliability: observed
  frames: 987 shadowRefresh=987 shadowSkipped=0
  mirror calls avg: 344
  shadow calls avg: 406
  main calls avg: 1508

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
  npc              draws=20 tris=25.6k meshes=20 inst=20
  fauna            draws=26 tris=8.2k meshes=26 inst=26
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
      mid  agents=6 camera-relevant=4 draws=26 tris=8.2k
      far  agents=85 camera-relevant=21 draws=373 tris=144.0k

Systems:
  WATER          3.6 ms
  NPC            3.7 ms
  FAUNA          0.9 ms
  PHYSICS        0.1 ms
  RENDER         19.9 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=19.0 ms draws=2274 tris=7.77M
  hide-grass         render=18.7 ms draws=2231 tris=7.45M
  hide-vegetation    render=18.1 ms draws=2080 tris=6.66M
  hide-vegetation-grass render=17.9 ms draws=2058 tris=6.36M
  hide-environment   render=20.1 ms draws=1969 tris=7.73M
  hide-settlement    render=16.5 ms draws=1366 tris=6.87M
  hide-water         render=19.5 ms draws=2240 tris=6.80M
  hide-terrain       render=19.1 ms draws=2185 tris=3.70M
  hide-npc-fauna     render=13.6 ms draws=1894 tris=7.44M
  no-shadows         render=15.6 ms draws=1865 tris=5.59M
  no-ao              render=19.0 ms draws=2236 tris=7.76M
  no-bloom           render=18.9 ms draws=2231 tris=7.76M
  no-smaa            render=18.9 ms draws=2239 tris=7.77M
  no-god-rays        render=18.7 ms draws=2230 tris=7.76M
  no-film-grade      render=19.0 ms draws=2237 tris=7.77M
  no-postprocessing  render=18.8 ms draws=2217 tris=7.77M
  no-reflections     render=19.2 ms draws=1893 tris=6.77M

Frame attribution:
  frame max: 63.1 ms
  largest labelled hitch: 0 ms
  unattributed: 63.1 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=980/980

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.7 ms/frame
  crowd pass: 0.0 ms/frame (16.9 ms cumulative)
  agent updates: 2.4 ms/frame (2304.1 ms cumulative)
  livestock: 1.1 ms/frame (1067.9 ms cumulative)
    loaded tick: 1.1 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.1 ms/frame
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
    dog guard scans: 13.1/frame (104.7 predator candidates/frame)
    pest scans: 4.8/frame (4.8 rat candidates/frame)
    nearest scans: 20.6/frame (0.0 candidates/frame)
    water samples: 50.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 50.6/frame, 0.10 ms/frame (worst call 0.80 ms, 11524.2 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 20.8
    presentation executions/frame: 18.1
  rats: 0.1 ms/frame (77.6 ms cumulative)
  social: 0.0 ms/frame (5.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (174.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 0.9 ms/frame
  agent updates: 0.9 ms/frame (850.4 ms cumulative)
  forest sampling: 0.1 ms/frame (71.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (15.6 ms cumulative)
    targeting: 0.0 ms/frame (24.5 ms cumulative)
    decision: 0.0 ms/frame (8.5 ms cumulative)
    behaviour: 0.4 ms/frame (383.3 ms cumulative)
    life/presentation: 0.3 ms/frame (288.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.6
    full-rate agents/frame: 8.3
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 16.6
    presentation executions/frame: 15.0

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.2
    village scan candidates/frame: 1614.3
    player perception checks/frame: 30.0

  nearest scans: 22.8/frame (22315 calls)
  nearest candidates checked: 405.3/frame (397207 total)
  herd leader scans: 0.1/frame (117 calls)
  herd candidates checked: 3.6/frame (3510 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.7/frame (134.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 42.2/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 42.2/frame, 0.00 ms/frame (worst call 0.70 ms, 754.1 colliders/frame)

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
Frames: 987
Shadow refresh frames: 987
Shadow skipped frames: 0

Mirror:
  calls avg: 344  tris avg: 994544
  info calls avg: 344  residual calls avg: 0
  environment                  calls=43 tris=8857
  items                        calls=1 tris=631
  other                        calls=38 tris=2295
  settlement:decor             calls=1 tris=836
  settlement:fence             calls=2 tris=9283
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3117
  settlement:fireHouseInteriorLamp calls=5 tris=539
  settlement:fireVillageTorch  calls=5 tris=357
  settlement:houseInteractive  calls=15 tris=1648
  settlement:houseStatic       calls=33 tris=80420
  settlement:landmarkGarden    calls=5 tris=82719
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=934
  settlement:landmarkWellHousehold calls=5 tris=9341
  settlement:landmarkWellPasture calls=2 tris=934
  settlement:other             calls=9 tris=350
  settlement:storageBarrel     calls=4 tris=11752
  settlement:storageContainer  calls=28 tris=2314
  settlement:storageGoods      calls=39 tris=6967
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1698
  settlement:storageWoodHousehold calls=1 tris=5844
  settlement:storageWoodSettlementPrimary calls=0 tris=545
  settlement:storageWoodSettlementSecondary calls=1 tris=2813
  settlement:workplace         calls=11 tris=5288
  terrain                      calls=8 tris=589226
  vegetation                   calls=22 tris=165388

Shadow (refresh only):
  calls avg: 406  tris avg: 2175680
  info calls avg: 406  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=3 tris=1043
  faunaFamily:dog              calls=7 tris=2132
  faunaFamily:donkey           calls=2 tris=492
  faunaFamily:sheep            calls=4 tris=1290
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2852
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=2 tris=2471
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8721
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
  calls avg: 1508  tris avg: 4594009
  info calls avg: 1915  residual calls avg: 0
  environment                  calls=169 tris=26947
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5605
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
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.0 ms  p95=19.9 ms  max=20.3 ms  Δavg vs baseline=—
  hide-grass           avg=18.7 ms  p95=19.6 ms  max=19.9 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-vegetation      avg=18.1 ms  p95=18.7 ms  max=19.9 ms  Δavg vs baseline=-0.9 ms (-5%)
  no vegetation/grass  avg=17.9 ms  p95=18.7 ms  max=20.2 ms  Δavg vs baseline=-1.1 ms (-6%)
  hide-environment     avg=20.1 ms  p95=22.0 ms  max=22.9 ms  Δavg vs baseline=+1.1 ms (+6%)
  hide-settlement      avg=16.5 ms  p95=17.5 ms  max=17.6 ms  Δavg vs baseline=-2.4 ms (-13%)
  no water             avg=19.5 ms  p95=20.5 ms  max=21.1 ms  Δavg vs baseline=+0.5 ms (+3%)
  hide-terrain         avg=19.1 ms  p95=20.6 ms  max=22.2 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-npc-fauna       avg=13.6 ms  p95=15.1 ms  max=15.1 ms  Δavg vs baseline=-5.3 ms (-28%)
  no-shadows           avg=15.6 ms  p95=16.3 ms  max=17.7 ms  Δavg vs baseline=-3.3 ms (-18%)
  no-ao                avg=19.0 ms  p95=20.6 ms  max=21.0 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-bloom             avg=18.9 ms  p95=19.8 ms  max=20.3 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-smaa              avg=18.9 ms  p95=20.0 ms  max=24.7 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-god-rays          avg=18.7 ms  p95=19.7 ms  max=19.7 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-film-grade        avg=19.0 ms  p95=20.5 ms  max=21.2 ms  Δavg vs baseline=+0.1 ms (+0%)
  no postprocessing    avg=18.8 ms  p95=19.7 ms  max=20.0 ms  Δavg vs baseline=-0.1 ms (-1%)
  no mirrors           avg=19.2 ms  p95=20.2 ms  max=20.4 ms  Δavg vs baseline=+0.3 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=26.7 ms  p95=27.2 ms  max=27.6 ms
  CPU wall      avg=19.0 ms  p95=19.9 ms  max=20.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
