# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T07:01:28.167Z
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
Frames: 1055
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d2b14bf7cbf380131bfa43bc2bd685af918f30e5
  runId: 2026-10-30T07-00-24-808Z-s7btx4
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
  populationGate: stable waited=5205ms npc=53
  gpuTimer: available=true resolved=true samples=1062 span=postprocess+labels

FPS:
  avg: 36.3
  min: 16
  p1: 27

Frame time (wall-clock):
  avg: 27.6 ms
  p50: 27.9 ms
  p95: 31.6 ms
  p99: 37.2 ms
  max: 64.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.6 p95=7.4 p99=10.6 max=46.1 n=1055
  render: p50=22.2 p95=25.2 p99=29 max=39.9 n=1055
  frame: p50=27.9 p95=31.6 p99=37.2 max=64.2 n=1055

Rendering (combined renderer.info):
  draw calls: 2051 avg / 2364 max
  triangles: 7.75M avg
  mirror draws: 294 avg
  geometries: 915
  textures: 852

Pass submissions (actual):
  reliability: observed
  frames: 1063 shadowRefresh=1063 shadowSkipped=0
  mirror calls avg: 294
  shadow calls avg: 388
  main calls avg: 1369

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1176 tris=1.36M meshes=1176 inst=3380
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=703 tris=826.8k meshes=703 inst=2664
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
  storageContainer draws=30 tris=9.0k meshes=30 inst=122
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

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=243 composed=243 multiplied=243 skinned=0
  environment              nodes=439 composed=439 multiplied=439 skinned=0
  settlement               nodes=2330 composed=2330 multiplied=2330 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4158 composed=4158 multiplied=4158 skinned=501
  fauna                    nodes=4345 composed=4345 multiplied=4345 skinned=364
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=785 composed=768 multiplied=785 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2330 composed=2330 multiplied=2330 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×5      nodes=383 composed=383 multiplied=383 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×18           nodes=60 composed=60 multiplied=60 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          2.5 ms
  NPC            3.7 ms
  FAUNA          0.8 ms
  PHYSICS        0.1 ms
  RENDER         19.1 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=18.4 ms draws=2048 tris=7.75M
  hide-grass         render=18.2 ms draws=2025 tris=7.45M
  hide-vegetation    render=18.3 ms draws=1874 tris=6.66M
  hide-vegetation-grass render=17.3 ms draws=1827 tris=6.33M
  hide-environment   render=18.1 ms draws=1773 tris=7.70M
  hide-settlement    render=15.1 ms draws=1320 tris=6.86M
  hide-water         render=18.3 ms draws=2017 tris=6.78M
  hide-terrain       render=18.0 ms draws=1983 tris=3.70M
  hide-npc-fauna     render=11.6 ms draws=1692 tris=7.43M
  no-shadows         render=14.7 ms draws=1673 tris=5.58M
  no-ao              render=18.3 ms draws=2025 tris=7.75M
  no-bloom           render=18.3 ms draws=2040 tris=7.76M
  no-smaa            render=18.8 ms draws=2054 tris=7.77M
  no-god-rays        render=18.7 ms draws=2045 tris=7.77M
  no-film-grade      render=18.5 ms draws=2047 tris=7.77M
  no-postprocessing  render=18.0 ms draws=2021 tris=7.77M
  no-reflections     render=18.2 ms draws=1731 tris=6.76M

Frame attribution:
  frame max: 64.2 ms
  largest labelled hitch: 0 ms
  unattributed: 64.2 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1055/1055

Recommendation:
Largest frame (64.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 3.7 ms/frame
  crowd pass: 0.0 ms/frame (17.3 ms cumulative)
  agent updates: 2.4 ms/frame (2483.0 ms cumulative)
  livestock: 1.0 ms/frame (1067.3 ms cumulative)
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
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 5.2/frame (5.2 rat candidates/frame)
    nearest scans: 19.8/frame (0.0 candidates/frame)
    water samples: 46.6/frame, 0.00 ms/frame (worst call 0.70 ms)
    collider queries: 46.6/frame, 0.10 ms/frame (worst call 1.00 ms, 9642.9 colliders/frame)
    full-rate agents/frame: 0.7
    reduced-cadence agents/frame: 55.7
    behaviour executions/frame: 20.4
    presentation executions/frame: 17.2
  rats: 0.1 ms/frame (103.5 ms cumulative)
  social: 0.0 ms/frame (6.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (177.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 0.8 ms/frame
  agent updates: 0.8 ms/frame (857.3 ms cumulative)
  forest sampling: 0.1 ms/frame (79.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (15.7 ms cumulative)
    targeting: 0.0 ms/frame (25.5 ms cumulative)
    decision: 0.0 ms/frame (8.0 ms cumulative)
    behaviour: 0.4 ms/frame (381.3 ms cumulative)
    life/presentation: 0.3 ms/frame (277.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.4
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 15.4
    presentation executions/frame: 14.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 119.0
    village scan candidates/frame: 1609.8
    player perception checks/frame: 29.7

  nearest scans: 21.8/frame (23051 calls)
  nearest candidates checked: 401.7/frame (423762 total)
  herd leader scans: 0.1/frame (130 calls)
  herd candidates checked: 3.7/frame (3900 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.5/frame (142.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 36.2/frame, 0.00 ms/frame (worst call 0.70 ms)
    collider queries: 36.2/frame, 0.00 ms/frame (worst call 0.70 ms, 604.9 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 22
Resident instances: full=88277 filler=113472
Submitted instances: full=75310 filler=42552
Meshes submitted: 74
LOD submitted fraction: full=0.8531100966276607 filler=0.375
Flowers: unavailable
Allocation bytes (estimated): 19367904
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1063
Shadow refresh frames: 1063
Shadow skipped frames: 0

Mirror:
  calls avg: 294  tris avg: 994219
  info calls avg: 294  residual calls avg: 0
  environment                  calls=44 tris=8874
  items                        calls=1 tris=633
  other                        calls=38 tris=2281
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9301
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=721
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1652
  settlement:houseStatic       calls=33 tris=80578
  settlement:landmarkGarden    calls=5 tris=82881
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=9359
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11775
  settlement:storageContainer  calls=8 tris=2468
  settlement:storageGoods      calls=40 tris=6981
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1702
  settlement:storageWoodHousehold calls=1 tris=5856
  settlement:storageWoodSettlementPrimary calls=1 tris=547
  settlement:storageWoodSettlementSecondary calls=1 tris=2819
  settlement:workplace         calls=11 tris=5298
  terrain                      calls=8 tris=590379
  vegetation                   calls=23 tris=165711

Shadow (refresh only):
  calls avg: 388  tris avg: 2174147
  info calls avg: 388  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=1 tris=486
  faunaFamily:dog              calls=7 tris=2416
  faunaFamily:sheep            calls=4 tris=1274
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=3 tris=3136
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=2 tris=2171
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=29 tris=8633
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
  settlement:storageContainer  calls=6 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=78 tris=554118

Main:
  calls avg: 1369  tris avg: 4585288
  info calls avg: 1757  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=18 tris=5440
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15093
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
  settlement:storageContainer  calls=18 tris=5184
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

  baseline             avg=18.4 ms  p95=19.5 ms  max=19.5 ms  Δavg vs baseline=—
  hide-grass           avg=18.2 ms  p95=19.4 ms  max=20.4 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-vegetation      avg=18.3 ms  p95=20.0 ms  max=33.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  no vegetation/grass  avg=17.3 ms  p95=18.6 ms  max=19.5 ms  Δavg vs baseline=-1.1 ms (-6%)
  hide-environment     avg=18.1 ms  p95=19.7 ms  max=23.0 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-settlement      avg=15.1 ms  p95=16.1 ms  max=17.0 ms  Δavg vs baseline=-3.4 ms (-18%)
  no water             avg=18.3 ms  p95=19.4 ms  max=19.5 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=18.0 ms  p95=20.5 ms  max=24.0 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-npc-fauna       avg=11.6 ms  p95=12.4 ms  max=20.6 ms  Δavg vs baseline=-6.9 ms (-37%)
  no-shadows           avg=14.7 ms  p95=15.6 ms  max=16.8 ms  Δavg vs baseline=-3.7 ms (-20%)
  no-ao                avg=18.3 ms  p95=19.6 ms  max=26.6 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=18.3 ms  p95=19.2 ms  max=19.6 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-smaa              avg=18.8 ms  p95=20.0 ms  max=20.3 ms  Δavg vs baseline=+0.4 ms (+2%)
  no-god-rays          avg=18.7 ms  p95=19.9 ms  max=20.9 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-film-grade        avg=18.5 ms  p95=19.5 ms  max=19.9 ms  Δavg vs baseline=+0.1 ms (+0%)
  no postprocessing    avg=18.0 ms  p95=19.6 ms  max=20.6 ms  Δavg vs baseline=-0.4 ms (-2%)
  no mirrors           avg=18.2 ms  p95=19.5 ms  max=19.8 ms  Δavg vs baseline=-0.3 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=19.1 ms  p95=19.9 ms  max=20.2 ms
  CPU wall      avg=18.4 ms  p95=19.5 ms  max=19.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
