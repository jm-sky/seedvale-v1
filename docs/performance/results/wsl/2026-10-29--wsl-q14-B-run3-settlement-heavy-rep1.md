# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T18:59:38.841Z
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
Frames: 322
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 591231d7e90a73b5c8c869eb81ed60d1f5478c1c
  runId: 2026-10-29T18-57-47-390Z-3ipea2
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
  populationGate: stable waited=8627ms npc=53
  gpuTimer: available=true resolved=true samples=321 span=postprocess+labels

FPS:
  avg: 24.8
  min: 15
  p1: 18

Frame time (wall-clock):
  avg: 40.3 ms
  p50: 40.1 ms
  p95: 49.8 ms
  p99: 56 ms
  max: 66.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=7.4 p95=9.6 p99=14.3 max=39.7 n=322
  render: p50=30.8 p95=42.3 p99=48.3 max=58.7 n=322
  frame: p50=40.1 p95=49.8 p99=56 max=66.2 n=322

Rendering (combined renderer.info):
  draw calls: 2092 avg / 2422 max
  triangles: 7.75M avg
  mirror draws: 314 avg
  geometries: 964
  textures: 829

Pass submissions (actual):
  reliability: observed
  frames: 324 shadowRefresh=324 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 405
  main calls avg: 1373

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
  other            draws=511 tris=29.8k meshes=511 inst=513

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=749 tris=826.8k meshes=749 inst=2664
  npc              draws=32 tris=37.7k meshes=32 inst=32
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=116 tris=15.0k meshes=116 inst=116

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
      far  agents=88 camera-relevant=23 draws=389 tris=149.0k

Systems:
  WATER          3.5 ms
  NPC            4.5 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         28.9 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=30.1 ms draws=2098 tris=7.75M
  hide-grass         render=29.4 ms draws=2073 tris=7.44M
  hide-vegetation    render=22.2 ms draws=1910 tris=6.65M
  hide-vegetation-grass render=22.5 ms draws=1882 tris=6.34M
  hide-environment   render=23.6 ms draws=1869 tris=7.70M
  hide-settlement    render=17.0 ms draws=1286 tris=6.86M
  hide-water         render=30.9 ms draws=2079 tris=6.79M
  hide-terrain       render=28.3 ms draws=2041 tris=3.70M
  hide-npc-fauna     render=14.6 ms draws=1743 tris=7.43M
  no-shadows         render=17.2 ms draws=1714 tris=5.58M
  no-ao              render=32.6 ms draws=2090 tris=7.76M
  no-bloom           render=30.9 ms draws=2084 tris=7.76M
  no-smaa            render=30.7 ms draws=2101 tris=7.77M
  no-god-rays        render=31.0 ms draws=2102 tris=7.76M
  no-film-grade      render=31.3 ms draws=2105 tris=7.76M
  no-postprocessing  render=23.3 ms draws=2056 tris=7.75M
  no-reflections     render=21.8 ms draws=1765 tris=6.77M

Frame attribution:
  frame max: 66.2 ms
  largest labelled hitch: 0 ms
  unattributed: 66.2 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=322/322

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.5 ms/frame
  crowd pass: 0.0 ms/frame (6.5 ms cumulative)
  agent updates: 2.6 ms/frame (821.2 ms cumulative)
  livestock: 1.5 ms/frame (495.1 ms cumulative)
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
    pest scans: 7.2/frame (7.2 rat candidates/frame)
    nearest scans: 30.1/frame (0.0 candidates/frame)
    water samples: 65.7/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 65.7/frame, 0.10 ms/frame (worst call 0.20 ms, 14323.5 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 55.9
    behaviour executions/frame: 30.2
    presentation executions/frame: 30.1
  rats: 0.2 ms/frame (52.0 ms cumulative)
  social: 0.0 ms/frame (1.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (72.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.2 ms/frame (398.6 ms cumulative)
  forest sampling: 0.1 ms/frame (30.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.2 ms cumulative)
    targeting: 0.0 ms/frame (11.9 ms cumulative)
    decision: 0.0 ms/frame (5.0 ms cumulative)
    behaviour: 0.6 ms/frame (194.6 ms cumulative)
    life/presentation: 0.4 ms/frame (113.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.4
    full-rate agents/frame: 6.6
    reduced-cadence agents/frame: 23.6
    behaviour executions/frame: 18.4
    presentation executions/frame: 18.3

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 120.7
    village scan candidates/frame: 1612.5
    player perception checks/frame: 30.2

  nearest scans: 25.7/frame (8265 calls)
  nearest candidates checked: 455.7/frame (146736 total)
  herd leader scans: 0.3/frame (110 calls)
  herd candidates checked: 10.2/frame (3300 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.5/frame (155.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 62.6/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 62.6/frame, 0.10 ms/frame (worst call 0.30 ms, 1175.0 colliders/frame)

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
Frames: 324
Shadow refresh frames: 324
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 993150
  info calls avg: 314  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=632
  other                        calls=38 tris=2295
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
  calls avg: 405  tris avg: 2175815
  info calls avg: 405  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=4 tris=1376
  faunaFamily:dog              calls=6 tris=1950
  faunaFamily:sheep            calls=4 tris=1194
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2094
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=4 tris=3745
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8665
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
  calls avg: 1373  tris avg: 4581694
  info calls avg: 1778  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5757
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15123
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
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=30.1 ms  p95=35.1 ms  max=36.0 ms  Δavg vs baseline=—
  hide-grass           avg=29.4 ms  p95=34.4 ms  max=36.3 ms  Δavg vs baseline=-0.7 ms (-2%)
  hide-vegetation      avg=22.2 ms  p95=26.0 ms  max=32.5 ms  Δavg vs baseline=-8.0 ms (-26%)
  no vegetation/grass  avg=22.5 ms  p95=28.9 ms  max=31.5 ms  Δavg vs baseline=-7.6 ms (-25%)
  hide-environment     avg=23.6 ms  p95=27.9 ms  max=30.1 ms  Δavg vs baseline=-6.5 ms (-22%)
  hide-settlement      avg=17.0 ms  p95=20.0 ms  max=20.8 ms  Δavg vs baseline=-13.1 ms (-44%)
  no water             avg=30.9 ms  p95=38.5 ms  max=41.1 ms  Δavg vs baseline=+0.7 ms (+2%)
  hide-terrain         avg=28.3 ms  p95=34.3 ms  max=34.6 ms  Δavg vs baseline=-1.8 ms (-6%)
  hide-npc-fauna       avg=14.6 ms  p95=16.3 ms  max=17.3 ms  Δavg vs baseline=-15.5 ms (-52%)
  no-shadows           avg=17.2 ms  p95=21.9 ms  max=25.7 ms  Δavg vs baseline=-12.9 ms (-43%)
  no-ao                avg=32.6 ms  p95=43.2 ms  max=64.6 ms  Δavg vs baseline=+2.5 ms (+8%)
  no-bloom             avg=30.9 ms  p95=39.5 ms  max=48.9 ms  Δavg vs baseline=+0.8 ms (+3%)
  no-smaa              avg=30.7 ms  p95=36.9 ms  max=43.8 ms  Δavg vs baseline=+0.6 ms (+2%)
  no-god-rays          avg=31.0 ms  p95=37.3 ms  max=43.1 ms  Δavg vs baseline=+0.9 ms (+3%)
  no-film-grade        avg=31.3 ms  p95=37.6 ms  max=38.0 ms  Δavg vs baseline=+1.2 ms (+4%)
  no postprocessing    avg=23.3 ms  p95=26.2 ms  max=43.9 ms  Δavg vs baseline=-6.8 ms (-23%)
  no mirrors           avg=21.8 ms  p95=23.9 ms  max=28.4 ms  Δavg vs baseline=-8.3 ms (-28%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=42.7 ms  p95=48.4 ms  max=49.6 ms
  CPU wall      avg=30.1 ms  p95=35.1 ms  max=36.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
