# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T21:06:39.471Z
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
Frames: 263
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0cfb9ed3548021fbb5d0e96e462211d300ef8cac
  runId: 2026-10-29T21-04-42-496Z-9ck5xp
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
  populationGate: stable waited=5092ms npc=20
  gpuTimer: available=true resolved=true samples=262 span=postprocess+labels

FPS:
  avg: 35.1
  min: 15
  p1: 20

Frame time (wall-clock):
  avg: 28.5 ms
  p50: 29.7 ms
  p95: 42.5 ms
  p99: 48.8 ms
  max: 64.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.3 p95=11.3 p99=30.8 max=48.1 n=263
  render: p50=20.6 p95=31.7 p99=37.3 max=60.1 n=263
  frame: p50=29.7 p95=42.5 p99=48.8 max=64.6 n=263

Rendering (combined renderer.info):
  draw calls: 1752 avg / 2094 max
  triangles: 12.54M avg
  mirror draws: 314 avg
  geometries: 551
  textures: 477

Pass submissions (actual):
  reliability: observed
  frames: 265 shadowRefresh=265 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 424
  main calls avg: 1013

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
  fauna            draws=14 tris=4.6k meshes=14 inst=14
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
      near agents=1 camera-relevant=1 draws=2 tris=610
      mid  agents=2 camera-relevant=1 draws=12 tris=4.0k
      far  agents=49 camera-relevant=21 draws=198 tris=83.7k

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
  WATER          2.9 ms
  NPC            1.9 ms
  FAUNA          2.3 ms
  PHYSICS        0.1 ms
  RENDER         19.6 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=19.4 ms draws=1750 tris=12.54M
  hide-grass         render=19.1 ms draws=1702 tris=5.84M
  hide-vegetation    render=18.2 ms draws=1705 tris=12.37M
  hide-vegetation-grass render=17.2 ms draws=1656 tris=5.67M
  hide-environment   render=15.8 ms draws=1663 tris=12.53M
  hide-settlement    render=10.3 ms draws=761 tris=11.33M
  hide-water         render=20.8 ms draws=1775 tris=12.32M
  hide-terrain       render=20.2 ms draws=1721 tris=8.60M
  hide-npc-fauna     render=10.4 ms draws=1512 tris=12.31M
  no-shadows         render=12.3 ms draws=1342 tris=10.51M
  no-ao              render=18.6 ms draws=1729 tris=12.53M
  no-bloom           render=17.5 ms draws=1726 tris=12.53M
  no-smaa            render=18.8 ms draws=1737 tris=12.53M
  no-god-rays        render=18.5 ms draws=1741 tris=12.53M
  no-film-grade      render=17.2 ms draws=1739 tris=12.53M
  no-postprocessing  render=15.8 ms draws=1715 tris=12.53M
  no-reflections     render=15.1 ms draws=1424 tris=11.62M

Frame attribution:
  frame max: 64.6 ms
  largest labelled hitch: 0 ms
  unattributed: 64.6 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=263/263

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.9 ms/frame
  crowd pass: 0.0 ms/frame (1.4 ms cumulative)
  agent updates: 1.0 ms/frame (260.9 ms cumulative)
  livestock: 0.6 ms/frame (152.0 ms cumulative)
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
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 2.0/frame (2.0 rat candidates/frame)
    nearest scans: 10.5/frame (0.0 candidates/frame)
    water samples: 22.5/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 22.5/frame, 0.00 ms/frame (worst call 0.30 ms, 1352.1 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 19.0
    behaviour executions/frame: 10.6
    presentation executions/frame: 10.6
  rats: 0.2 ms/frame (44.9 ms cumulative)
  social: 0.0 ms/frame (1.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (29.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.3 ms/frame
  agent updates: 2.3 ms/frame (592.0 ms cumulative)
  forest sampling: 0.1 ms/frame (24.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.5 ms cumulative)
    targeting: 0.0 ms/frame (3.8 ms cumulative)
    decision: 0.0 ms/frame (3.4 ms cumulative)
    behaviour: 1.6 ms/frame (429.9 ms cumulative)
    life/presentation: 0.4 ms/frame (95.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 20.5
    full-rate agents/frame: 9.3
    reduced-cadence agents/frame: 21.0
    behaviour executions/frame: 20.5
    presentation executions/frame: 20.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 370.7
    player perception checks/frame: 30.2

  nearest scans: 28.4/frame (7478 calls)
  nearest candidates checked: 193.1/frame (50797 total)
  herd leader scans: 0.3/frame (74 calls)
  herd candidates checked: 8.4/frame (2220 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 28.2/frame (192.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 97.7/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 97.7/frame, 0.10 ms/frame (worst call 0.20 ms, 5969.7 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=326361 filler=624138
Submitted instances: full=265630 filler=297949
Meshes submitted: 72
LOD submitted fraction: full=0.8139146527924599 filler=0.4773767980799118
Flowers: unavailable
Allocation bytes (estimated): 91247904
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 265
Shadow refresh frames: 265
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 905397
  info calls avg: 314  residual calls avg: 0
  environment                  calls=0 tris=432
  other                        calls=51 tris=10474
  settlement:decor             calls=85 tris=161893
  settlement:fence             calls=2 tris=3220
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=10 tris=502
  settlement:fireHouseInteriorLamp calls=3 tris=377
  settlement:fireVillageTorch  calls=12 tris=891
  settlement:houseInteractive  calls=10 tris=1151
  settlement:houseStatic       calls=25 tris=18348
  settlement:landmarkGarden    calls=6 tris=52415
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1863
  settlement:landmarkWellHousehold calls=5 tris=3726
  settlement:landmarkWellPasture calls=2 tris=931
  settlement:other             calls=8 tris=161
  settlement:storageBarrel     calls=6 tris=7583
  settlement:storageContainer  calls=21 tris=1339
  settlement:storageGoods      calls=29 tris=5951
  settlement:storageHay        calls=1 tris=486
  settlement:storageTrough     calls=3 tris=797
  settlement:storageWoodHousehold calls=1 tris=2720
  settlement:storageWoodSettlementPrimary calls=1 tris=777
  settlement:workplace         calls=8 tris=4486
  terrain                      calls=8 tris=624048
  vegetation                   calls=2 tris=673

Shadow (refresh only):
  calls avg: 424  tris avg: 2022160
  info calls avg: 424  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:deer             calls=2 tris=570
  faunaFamily:fox              calls=5 tris=2510
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=1889
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant            calls=0 tris=131
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
  calls avg: 1013  tris avg: 9608138
  info calls avg: 1438  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=9 tris=3024
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=2 tris=1549
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=1 tris=429
  faunaFamily:wolf             calls=20 tris=9810
  grass                        calls=49 tris=6697644
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=57 tris=69015
  npcFamily:Peasant_Boots      calls=18 tris=24430
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=167 tris=319388
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

  baseline             avg=19.4 ms  p95=25.2 ms  max=25.9 ms  Δavg vs baseline=—
  hide-grass           avg=19.1 ms  p95=25.3 ms  max=25.8 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-vegetation      avg=18.2 ms  p95=23.8 ms  max=24.3 ms  Δavg vs baseline=-1.2 ms (-6%)
  no vegetation/grass  avg=17.2 ms  p95=23.4 ms  max=24.5 ms  Δavg vs baseline=-2.2 ms (-11%)
  hide-environment     avg=15.8 ms  p95=21.1 ms  max=23.4 ms  Δavg vs baseline=-3.6 ms (-18%)
  hide-settlement      avg=10.3 ms  p95=11.5 ms  max=12.4 ms  Δavg vs baseline=-9.1 ms (-47%)
  no water             avg=20.8 ms  p95=29.4 ms  max=31.7 ms  Δavg vs baseline=+1.4 ms (+7%)
  hide-terrain         avg=20.2 ms  p95=27.6 ms  max=27.8 ms  Δavg vs baseline=+0.8 ms (+4%)
  hide-npc-fauna       avg=10.4 ms  p95=12.2 ms  max=13.2 ms  Δavg vs baseline=-9.0 ms (-47%)
  no-shadows           avg=12.3 ms  p95=17.7 ms  max=18.8 ms  Δavg vs baseline=-7.2 ms (-37%)
  no-ao                avg=18.6 ms  p95=25.6 ms  max=29.8 ms  Δavg vs baseline=-0.9 ms (-5%)
  no-bloom             avg=17.5 ms  p95=23.0 ms  max=27.4 ms  Δavg vs baseline=-1.9 ms (-10%)
  no-smaa              avg=18.8 ms  p95=23.7 ms  max=25.9 ms  Δavg vs baseline=-0.6 ms (-3%)
  no-god-rays          avg=18.5 ms  p95=23.8 ms  max=24.1 ms  Δavg vs baseline=-1.0 ms (-5%)
  no-film-grade        avg=17.2 ms  p95=22.4 ms  max=24.8 ms  Δavg vs baseline=-2.2 ms (-11%)
  no postprocessing    avg=15.8 ms  p95=17.9 ms  max=30.2 ms  Δavg vs baseline=-3.7 ms (-19%)
  no mirrors           avg=15.1 ms  p95=17.4 ms  max=19.5 ms  Δavg vs baseline=-4.4 ms (-23%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=74.3 ms  p95=76.8 ms  max=77.3 ms
  CPU wall      avg=19.4 ms  p95=25.2 ms  max=25.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
