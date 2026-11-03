# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T17:02:46.460Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement
Duration: 30s
Frames: 399
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a25e47aa423419e56bb240801251d699bb6b8759
  runId: 2026-11-03T17-01-16-373Z-xpeabe
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
  camera: pos=(-8.1, 11.7, -0.3)
  anchor: (-8.1, -11.5)
  populationGate: stable waited=5223ms npc=8
  gpuTimer: available=true resolved=true samples=400 span=postprocess+labels

FPS:
  avg: 56.8
  min: 23
  p1: 26

Frame time (wall-clock):
  avg: 17.6 ms
  p50: 17.1 ms
  p95: 19.9 ms
  p99: 37.9 ms
  max: 44.1 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.7 p95=5 p99=27.1 max=32.9 n=399
  render: p50=13 p95=14.7 p99=17.1 max=18.9 n=399
  frame: p50=17.1 p95=19.9 p99=37.9 max=44.1 n=399

Rendering (combined renderer.info):
  draw calls: 1120 avg / 1145 max
  triangles: 9.51M avg
  mirror draws: 210 avg
  geometries: 578
  textures: 279

Pass submissions (actual):
  reliability: observed
  frames: 403 shadowRefresh=202 shadowSkipped=201
  mirror calls avg: 210
  shadow calls avg: 490
  main calls avg: 652

Scene (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  grass            draws=72 tris=8.01M meshes=72 inst=599288
  vegetation       draws=134 tris=319.2k meshes=134 inst=210
  environment      draws=51 tris=20.6k meshes=51 inst=51
  settlement       draws=358 tris=542.8k meshes=358 inst=913
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=171 tris=70.4k meshes=171 inst=171
  items            draws=210 tris=16.7k meshes=210 inst=210
  other            draws=397 tris=28.4k meshes=397 inst=397

Shadow casters (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  vegetation       draws=130 tris=305.4k meshes=130 inst=206
  environment      draws=51 tris=20.6k meshes=51 inst=51
  settlement       draws=259 tris=448.8k meshes=259 inst=776
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=20 tris=12.3k meshes=20 inst=20
  other            draws=93 tris=14.2k meshes=93 inst=93

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=33 tris=50.0k meshes=33 inst=324
  houseInteractive draws=14 tris=2.2k meshes=14 inst=14
  fence            draws=4 tris=2.0k meshes=4 inst=10
  storageWoodSettlementPrimary draws=1 tris=780 meshes=1 inst=1
  storageWoodHousehold draws=1 tris=4.7k meshes=1 inst=6
  storageContainer draws=6 tris=1.9k meshes=6 inst=26
  storageHay       draws=1 tris=488 meshes=1 inst=1
  storageTrough    draws=4 tris=1.4k meshes=4 inst=14
  workplace        draws=4 tris=3.5k meshes=4 inst=4
  landmarkWellCentral draws=5 tris=1.9k meshes=5 inst=5
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=1 tris=1.6k meshes=1 inst=2
  landmarkNoticeBoard draws=2 tris=36 meshes=2 inst=2
  fireHouseInteriorLamp draws=6 tris=648 meshes=6 inst=6
  decor            draws=165 tris=353.8k meshes=165 inst=243
  other            draws=7 tris=21.9k meshes=7 inst=113

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=2 draws=19 tris=22.0k skinned=19/19
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Ranger_NoHood    agents=1 draws=14 tris=16.3k skinned=14/14
      Knight_Cloth     agents=1 draws=9 tris=11.9k skinned=9/9
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=8 tris=10.9k skinned=8/8
    by distance band:
      near agents=2 camera-relevant=0 draws=17 tris=23.1k
      mid  agents=6 camera-relevant=4 draws=60 tris=76.5k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=7 draws=28 tris=13.7k skinned=28/28
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      dog              agents=2 draws=10 tris=3.8k skinned=10/10
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      sheep            agents=4 draws=8 tris=2.4k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rat              agents=1 draws=2 tris=4.0k skinned=2/2
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=1 camera-relevant=1 draws=8 tris=2.2k
      mid  agents=12 camera-relevant=9 draws=46 tris=17.4k
      far  agents=29 camera-relevant=6 draws=117 tris=50.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=67 composed=67 multiplied=67 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=166 composed=166 multiplied=166 skinned=0
  environment              nodes=79 composed=79 multiplied=79 skinned=0
  settlement               nodes=703 composed=703 multiplied=703 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1776 composed=1776 multiplied=1776 skinned=151
  items                    nodes=318 composed=318 multiplied=318 skinned=0
  other                    nodes=643 composed=626 multiplied=643 skinned=9
  top scene children:
    fauna ×42                nodes=1776 composed=1776 multiplied=1776 skinned=151
    settlement ×1            nodes=703 composed=703 multiplied=703 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    Group ×75                nodes=478 composed=478 multiplied=478 skinned=9
    chunk-items ×27          nodes=318 composed=318 multiplied=318 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×67                nodes=67 composed=67 multiplied=67 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×29             nodes=29 composed=29 multiplied=29 skinned=0
    chunk-environmen ×4      nodes=27 composed=27 multiplied=27 skinned=0
    chunk-river ×25          nodes=25 composed=25 multiplied=25 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.0 ms
  NPC            1.3 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         11.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=9.9 ms draws=1118 tris=9.51M
  hide-grass         render=9.8 ms draws=1082 tris=3.71M
  hide-vegetation    render=9.7 ms draws=1106 tris=9.49M
  hide-vegetation-grass render=9.5 ms draws=1068 tris=3.70M
  hide-environment   render=10.0 ms draws=1113 tris=9.51M
  hide-settlement    render=7.0 ms draws=667 tris=8.81M
  hide-water         render=10.2 ms draws=1126 tris=9.36M
  hide-terrain       render=10.0 ms draws=1088 tris=6.82M
  hide-npc-fauna     render=7.3 ms draws=946 tris=9.36M
  no-shadows         render=23.5 ms draws=889 tris=8.69M
  no-ao              render=9.8 ms draws=1119 tris=9.51M
  no-bloom           render=10.1 ms draws=1112 tris=9.51M
  no-smaa            render=9.9 ms draws=1122 tris=9.51M
  no-god-rays        render=10.4 ms draws=1124 tris=9.51M
  no-film-grade      render=10.1 ms draws=1125 tris=9.51M
  no-postprocessing  render=10.5 ms draws=1097 tris=9.51M
  no-reflections     render=10.0 ms draws=911 tris=8.73M

Frame attribution:
  frame max: 44.1 ms
  largest labelled hitch: 0 ms
  unattributed: 44.1 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=399/399

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 29

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (1.1 ms cumulative)
  agent updates: 0.5 ms/frame (216.9 ms cumulative)
  livestock: 0.6 ms/frame (223.0 ms cumulative)
    loaded tick: 0.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 12.1
    unique animals/frame: 12.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 2.0
    dog guard scans: 2.0/frame (14.1 predator candidates/frame)
    pest scans: 2.0/frame (2.0 rat candidates/frame)
    nearest scans: 12.1/frame (0.0 candidates/frame)
    water samples: 23.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 23.5/frame, 0.00 ms/frame (worst call 0.10 ms, 4075.8 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 11.1
    behaviour executions/frame: 12.1
    presentation executions/frame: 12.1
  rats: 0.1 ms/frame (46.3 ms cumulative)
  social: 0.0 ms/frame (2.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (30.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.5 ms/frame (615.6 ms cumulative)
  forest sampling: 0.1 ms/frame (32.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (4.3 ms cumulative)
    targeting: 0.0 ms/frame (4.0 ms cumulative)
    decision: 0.0 ms/frame (4.8 ms cumulative)
    behaviour: 1.0 ms/frame (379.4 ms cumulative)
    life/presentation: 0.4 ms/frame (155.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.3
    sensing passes/frame: 29.3
    decision passes/frame: 29.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.5
    full-rate agents/frame: 9.6
    reduced-cadence agents/frame: 19.7
    behaviour executions/frame: 19.5
    presentation executions/frame: 19.5

  sensing/cache:
    forest samples/frame: 29.3
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 51.3
    player perception checks/frame: 29.3

  nearest scans: 25.8/frame (10290 calls)
  nearest candidates checked: 101.2/frame (40375 total)
  herd leader scans: 0.2/frame (84 calls)
  herd candidates checked: 6.1/frame (2436 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 27.9/frame (195.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 59.3/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 59.3/frame, 0.10 ms/frame (worst call 0.80 ms, 9982.7 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=342752 filler=656535
Submitted instances: full=279982 filler=319306
Meshes submitted: 72
LOD submitted fraction: full=0.8168646718326954 filler=0.4863503088182656
Flowers: unavailable
Allocation bytes (estimated): 95931552
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 403
Shadow refresh frames: 202
Shadow skipped frames: 201

Mirror:
  calls avg: 210  tris avg: 777218
  info calls avg: 210  residual calls avg: 0
  switches avg: material=80.8 program=36.4  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=0 tris=433
  other                        calls=102 tris=5424
  settlement:decor             calls=35 tris=94853
  settlement:fence             calls=1 tris=403
  settlement:fireHouseExteriorLamp calls=6 tris=287
  settlement:fireHouseInteriorLamp calls=2 tris=215
  settlement:fireVillageTorch  calls=2 tris=178
  settlement:houseInteractive  calls=6 tris=658
  settlement:houseStatic       calls=17 tris=25176
  settlement:landmarkWellHousehold calls=2 tris=933
  settlement:other             calls=2 tris=10899
  settlement:storageBarrel     calls=3 tris=5522
  settlement:storageContainer  calls=4 tris=1059
  settlement:storageGoods      calls=14 tris=2548
  settlement:storageTrough     calls=1 tris=599
  settlement:storageWoodHousehold calls=0 tris=2334
  settlement:storageWoodSettlementPrimary calls=0 tris=389
  terrain                      calls=8 tris=624858
  vegetation                   calls=1 tris=606

Shadow (refresh only):
  calls avg: 490  tris avg: 1650442
  info calls avg: 490  residual calls avg: 0
  switches avg: material=120 program=145.8  actor: calls=130.8 material=0 program=16.9
  skinning avg: skinned calls=124.8 skeletons first used=27.9
  environment                  calls=1 tris=868
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=3528
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=72 tris=13662
  settlement:decor             calls=165 tris=353843
  settlement:fence             calls=4 tris=2020
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=7 tris=21912
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1400
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=14 tris=1032192
  vegetation                   calls=13 tris=36220

Main:
  calls avg: 652  tris avg: 7903167
  info calls avg: 910  residual calls avg: 0
  switches avg: material=280.7 program=125.6  actor: calls=108.5 material=80.7 program=34.6
  skinning avg: skinned calls=111.1 skeletons first used=18.7
  environment                  calls=14 tris=4438
  faunaFamily:bear             calls=1 tris=666
  faunaFamily:chicken          calls=5 tris=698
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=4 tris=1610
  faunaFamily:horse            calls=8 tris=2179
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  faunaFamily:wolf             calls=23 tris=11397
  grass                        calls=43 tris=5794532
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  other                        calls=241 tris=20080
  settlement:decor             calls=62 tris=183125
  settlement:fence             calls=2 tris=808
  settlement:fireHouseExteriorLamp calls=12 tris=576
  settlement:fireHouseInteriorLamp calls=3 tris=324
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=34 tris=50478
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=1870
  settlement:other             calls=7 tris=21912
  settlement:storageBarrel     calls=6 tris=11072
  settlement:storageContainer  calls=9 tris=2124
  settlement:storageGoods      calls=35 tris=6344
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=6 tris=3284
  terrain                      calls=21 tris=1547480
  vegetation                   calls=4 tris=1632
  water                        calls=3 tris=155648


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.9 ms  p95=11.9 ms  max=12.4 ms  Δavg vs baseline=—
  hide-grass           avg=9.8 ms  p95=11.6 ms  max=13.2 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=9.7 ms  p95=11.8 ms  max=11.9 ms  Δavg vs baseline=-0.2 ms (-3%)
  no vegetation/grass  avg=9.5 ms  p95=11.1 ms  max=11.2 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-environment     avg=10.0 ms  p95=11.9 ms  max=12.8 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-settlement      avg=7.0 ms  p95=8.8 ms  max=9.9 ms  Δavg vs baseline=-2.9 ms (-30%)
  no water             avg=10.2 ms  p95=12.1 ms  max=12.7 ms  Δavg vs baseline=+0.3 ms (+3%)
  hide-terrain         avg=10.0 ms  p95=12.2 ms  max=13.3 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-npc-fauna       avg=7.3 ms  p95=8.5 ms  max=9.0 ms  Δavg vs baseline=-2.6 ms (-26%)
  no-shadows           avg=23.5 ms  p95=10.1 ms  max=456.2 ms  Δavg vs baseline=+13.6 ms (+137%)
  no-ao                avg=9.8 ms  p95=12.0 ms  max=12.8 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=10.1 ms  p95=12.1 ms  max=13.3 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-smaa              avg=9.9 ms  p95=11.7 ms  max=12.3 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-god-rays          avg=10.4 ms  p95=12.1 ms  max=12.4 ms  Δavg vs baseline=+0.5 ms (+5%)
  no-film-grade        avg=10.1 ms  p95=11.7 ms  max=13.2 ms  Δavg vs baseline=+0.2 ms (+2%)
  no postprocessing    avg=10.5 ms  p95=11.9 ms  max=13.6 ms  Δavg vs baseline=+0.6 ms (+6%)
  no mirrors           avg=10.0 ms  p95=12.0 ms  max=12.2 ms  Δavg vs baseline=+0.1 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=30.7 ms  p95=35.4 ms  max=35.9 ms
  CPU wall      avg=9.9 ms  p95=11.9 ms  max=12.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
