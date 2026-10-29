# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T21:02:41.856Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: forest
Duration: 30s
Frames: 245
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0cfb9ed3548021fbb5d0e96e462211d300ef8cac
  runId: 2026-10-29T21-00-44-988Z-shklpc
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5163ms npc=20
  gpuTimer: available=true resolved=true samples=243 span=postprocess+labels

FPS:
  avg: 35
  min: 13
  p1: 22

Frame time (wall-clock):
  avg: 28.5 ms
  p50: 29.9 ms
  p95: 38 ms
  p99: 44.6 ms
  max: 79.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.5 p95=8.6 p99=29.4 max=34.9 n=245
  render: p50=23.9 p95=31 p99=36.2 max=75.1 n=245
  frame: p50=29.9 p95=38 p99=44.6 max=79.8 n=245

Rendering (combined renderer.info):
  draw calls: 1750 avg / 2087 max
  triangles: 12.54M avg
  mirror draws: 314 avg
  geometries: 557
  textures: 466

Pass submissions (actual):
  reliability: observed
  frames: 246 shadowRefresh=246 shadowSkipped=0
  mirror calls avg: 316
  shadow calls avg: 424
  main calls avg: 1011

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.47M meshes=72 inst=563579
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=642 tris=687.3k meshes=642 inst=1247
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=184 tris=238.1k meshes=184 inst=184
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=164 tris=16.0k meshes=164 inst=164
  other            draws=231 tris=25.9k meshes=231 inst=231

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=422 tris=488.6k meshes=422 inst=972
  npc              draws=16 tris=23.0k meshes=16 inst=16
  fauna            draws=21 tris=6.6k meshes=21 inst=21
  items            draws=21 tris=12.6k meshes=21 inst=21
  other            draws=105 tris=14.4k meshes=105 inst=105

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.8k meshes=3 inst=10
  storageContainer draws=32 tris=3.5k meshes=32 inst=46
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.2k meshes=8 inst=22
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=29 tris=540 meshes=29 inst=29

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=11 draws=102 tris=124.6k skinned=102/102
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      near agents=2 camera-relevant=2 draws=16 tris=23.0k
      far  agents=18 camera-relevant=11 draws=168 tris=215.0k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=3 draws=24 tris=6.5k skinned=24/24
      dog              agents=4 draws=23 tris=7.8k skinned=23/23
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      sheep            agents=8 draws=16 tris=4.9k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      chicken          agents=3 draws=15 tris=1.9k skinned=0/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      mid  agents=5 camera-relevant=2 draws=21 tris=6.6k
      far  agents=47 camera-relevant=20 draws=191 tris=81.7k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=122 composed=122 multiplied=122 skinned=0
  environment              nodes=252 composed=252 multiplied=252 skinned=0
  settlement               nodes=1246 composed=1246 multiplied=1246 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1563 composed=1563 multiplied=1563 skinned=184
  fauna                    nodes=2299 composed=2299 multiplied=2299 skinned=188
  items                    nodes=254 composed=254 multiplied=254 skinned=0
  other                    nodes=447 composed=430 multiplied=447 skinned=9
  top scene children:
    fauna ×52                nodes=2299 composed=2299 multiplied=2299 skinned=188
    npc ×20                  nodes=1563 composed=1563 multiplied=1563 skinned=184
    settlement ×3            nodes=1246 composed=1246 multiplied=1246 skinned=0
    Group ×42                nodes=286 composed=286 multiplied=286 skinned=9
    chunk-items ×20          nodes=254 composed=254 multiplied=254 skinned=0
    chunk-environmen ×4      nodes=207 composed=207 multiplied=207 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          3.2 ms
  NPC            2.0 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         19.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=19.2 ms draws=1747 tris=12.54M
  hide-grass         render=18.0 ms draws=1695 tris=5.84M
  hide-vegetation    render=15.7 ms draws=1693 tris=12.37M
  hide-vegetation-grass render=15.9 ms draws=1639 tris=5.67M
  hide-environment   render=15.0 ms draws=1642 tris=12.52M
  hide-settlement    render=10.6 ms draws=719 tris=11.32M
  hide-water         render=17.7 ms draws=1726 tris=12.30M
  hide-terrain       render=15.6 ms draws=1677 tris=8.59M
  hide-npc-fauna     render=10.9 ms draws=1516 tris=12.32M
  no-shadows         render=12.1 ms draws=1337 tris=10.52M
  no-ao              render=17.7 ms draws=1730 tris=12.53M
  no-bloom           render=17.9 ms draws=1726 tris=12.54M
  no-smaa            render=18.7 ms draws=1744 tris=12.54M
  no-god-rays        render=41.7 ms draws=1752 tris=12.54M
  no-film-grade      render=20.6 ms draws=1757 tris=12.53M
  no-postprocessing  render=16.2 ms draws=1733 tris=12.53M
  no-reflections     render=16.2 ms draws=1448 tris=11.62M

Frame attribution:
  frame max: 79.8 ms
  largest labelled hitch: 0 ms
  unattributed: 79.8 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=245/245

Recommendation:
Largest frame (79.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 2.0 ms/frame
  crowd pass: 0.0 ms/frame (1.8 ms cumulative)
  agent updates: 1.1 ms/frame (257.6 ms cumulative)
  livestock: 0.6 ms/frame (145.0 ms cumulative)
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
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.1 predator candidates/frame)
    pest scans: 2.0/frame (2.0 rat candidates/frame)
    nearest scans: 10.5/frame (0.0 candidates/frame)
    water samples: 19.2/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 19.2/frame, 0.00 ms/frame (worst call 0.10 ms, 1122.7 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 18.9
    behaviour executions/frame: 10.6
    presentation executions/frame: 10.6
  rats: 0.2 ms/frame (45.0 ms cumulative)
  social: 0.0 ms/frame (1.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (32.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.7 ms/frame (419.0 ms cumulative)
  forest sampling: 0.1 ms/frame (22.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.5 ms cumulative)
    targeting: 0.0 ms/frame (5.6 ms cumulative)
    decision: 0.0 ms/frame (2.4 ms cumulative)
    behaviour: 1.0 ms/frame (233.0 ms cumulative)
    life/presentation: 0.5 ms/frame (113.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.1
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 20.4
    full-rate agents/frame: 8.5
    reduced-cadence agents/frame: 21.6
    behaviour executions/frame: 20.4
    presentation executions/frame: 20.4

  sensing/cache:
    forest samples/frame: 30.1
    fire scan candidates/frame: 30.1
    village scan candidates/frame: 367.2
    player perception checks/frame: 30.1

  nearest scans: 28.8/frame (7053 calls)
  nearest candidates checked: 199.7/frame (48928 total)
  herd leader scans: 0.2/frame (60 calls)
  herd candidates checked: 7.3/frame (1800 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 28.2/frame (187.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 50.2/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 50.2/frame, 0.00 ms/frame (worst call 0.10 ms, 3040.5 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=616454 filler=624138
Submitted instances: full=265630 filler=297949
Meshes submitted: 72
LOD submitted fraction: full=0.43089995360562183 filler=0.4773767980799118
Flowers: unavailable
Allocation bytes (estimated): 119096832
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 246
Shadow refresh frames: 246
Shadow skipped frames: 0

Mirror:
  calls avg: 316  tris avg: 911291
  info calls avg: 316  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=86 tris=164970
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=11 tris=504
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=894
  settlement:houseInteractive  calls=11 tris=1155
  settlement:houseStatic       calls=25 tris=18417
  settlement:landmarkGarden    calls=6 tris=52614
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=3740
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=9 tris=162
  settlement:storageBarrel     calls=6 tris=7612
  settlement:storageContainer  calls=22 tris=1344
  settlement:storageGoods      calls=29 tris=5974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=800
  settlement:storageWoodHousehold calls=1 tris=2730
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=8 tris=4503
  terrain                      calls=9 tris=626412
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 424  tris avg: 2020628
  info calls avg: 424  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=1 tris=43
  faunaFamily:fox              calls=7 tris=3290
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant            calls=0 tris=234
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=66 tris=13542
  settlement:decor             calls=196 tris=384574
  settlement:fireHouseInteriorLamp calls=2 tris=216
  settlement:houseInteractive  calls=4 tris=628
  settlement:houseStatic       calls=23 tris=10310
  settlement:landmarkGarden    calls=1 tris=800
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=8 tris=804
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=1 tris=1560
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1011  tris avg: 9610048
  info calls avg: 1436  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=6 tris=1984
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=3 tris=1995
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=20 tris=9760
  grass                        calls=49 tris=6697644
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=57 tris=69015
  npcFamily:Peasant_Boots      calls=18 tris=24430
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=168 tris=322372
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=21 tris=1008
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=50 tris=36834
  settlement:landmarkGarden    calls=12 tris=105228
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=16 tris=300
  settlement:storageBarrel     calls=12 tris=15224
  settlement:storageContainer  calls=43 tris=2688
  settlement:storageGoods      calls=58 tris=11948
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=1600
  settlement:storageWoodHousehold calls=2 tris=5460
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=16 tris=9006
  terrain                      calls=26 tris=1916120
  vegetation                   calls=6 tris=1958
  water                        calls=4 tris=229376


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=19.2 ms  p95=24.7 ms  max=27.9 ms  Δavg vs baseline=—
  hide-grass           avg=18.0 ms  p95=23.5 ms  max=25.1 ms  Δavg vs baseline=-1.2 ms (-6%)
  hide-vegetation      avg=15.7 ms  p95=18.4 ms  max=19.4 ms  Δavg vs baseline=-3.5 ms (-18%)
  no vegetation/grass  avg=15.9 ms  p95=17.7 ms  max=19.4 ms  Δavg vs baseline=-3.3 ms (-17%)
  hide-environment     avg=15.0 ms  p95=15.9 ms  max=17.7 ms  Δavg vs baseline=-4.2 ms (-22%)
  hide-settlement      avg=10.6 ms  p95=12.3 ms  max=13.3 ms  Δavg vs baseline=-8.6 ms (-45%)
  no water             avg=17.7 ms  p95=22.0 ms  max=25.6 ms  Δavg vs baseline=-1.5 ms (-8%)
  hide-terrain         avg=15.6 ms  p95=18.2 ms  max=19.9 ms  Δavg vs baseline=-3.6 ms (-19%)
  hide-npc-fauna       avg=10.9 ms  p95=12.6 ms  max=12.8 ms  Δavg vs baseline=-8.3 ms (-43%)
  no-shadows           avg=12.1 ms  p95=14.4 ms  max=14.5 ms  Δavg vs baseline=-7.1 ms (-37%)
  no-ao                avg=17.7 ms  p95=21.7 ms  max=23.1 ms  Δavg vs baseline=-1.5 ms (-8%)
  no-bloom             avg=17.9 ms  p95=21.9 ms  max=22.6 ms  Δavg vs baseline=-1.3 ms (-7%)
  no-smaa              avg=18.7 ms  p95=23.4 ms  max=24.0 ms  Δavg vs baseline=-0.5 ms (-3%)
  no-god-rays          avg=41.7 ms  p95=26.5 ms  max=721.3 ms  Δavg vs baseline=+22.5 ms (+117%)
  no-film-grade        avg=20.6 ms  p95=22.9 ms  max=81.4 ms  Δavg vs baseline=+1.4 ms (+7%)
  no postprocessing    avg=16.2 ms  p95=17.5 ms  max=19.9 ms  Δavg vs baseline=-3.0 ms (-16%)
  no mirrors           avg=16.2 ms  p95=18.0 ms  max=19.2 ms  Δavg vs baseline=-3.0 ms (-16%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=74.6 ms  p95=84.2 ms  max=100.5 ms
  CPU wall      avg=19.2 ms  p95=24.7 ms  max=27.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
