# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T22:52:33.816Z
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
Frames: 366
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a6676a11dacf7cd048859d09268c7b2c1dfdab28
  runId: 2026-10-29T22-50-56-369Z-ymxeta
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
  populationGate: stable waited=5126ms npc=20
  gpuTimer: available=true resolved=true samples=365 span=postprocess+labels

FPS:
  avg: 42.9
  min: 17
  p1: 19

Frame time (wall-clock):
  avg: 23.3 ms
  p50: 22.8 ms
  p95: 30.9 ms
  p99: 53.7 ms
  max: 59.1 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.9 p95=8.1 p99=38.8 max=44.8 n=366
  render: p50=18.3 p95=22.5 p99=28.6 max=31.2 n=366
  frame: p50=22.8 p95=30.9 p99=53.7 max=59.1 n=366

Rendering (combined renderer.info):
  draw calls: 1858 avg / 2214 max
  triangles: 11.52M avg
  mirror draws: 333 avg
  geometries: 598
  textures: 445

Pass submissions (actual):
  reliability: observed
  frames: 368 shadowRefresh=368 shadowSkipped=0
  mirror calls avg: 333
  shadow calls avg: 454
  main calls avg: 1072

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.47M meshes=72 inst=563579
  vegetation       draws=112 tris=4.1k meshes=112 inst=194
  environment      draws=168 tris=7.5k meshes=168 inst=168
  settlement       draws=687 tris=306.6k meshes=687 inst=1269
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=184 tris=238.1k meshes=184 inst=184
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=164 tris=16.0k meshes=164 inst=164
  other            draws=231 tris=25.9k meshes=231 inst=231

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=101 tris=3.7k meshes=101 inst=179
  environment      draws=130 tris=2.3k meshes=130 inst=130
  settlement       draws=466 tris=107.9k meshes=466 inst=993
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
  workplace        draws=7 tris=2.7k meshes=7 inst=7
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=11 tris=348 meshes=11 inst=11
  decor            draws=236 tris=14.4k meshes=236 inst=319
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
      far  agents=49 camera-relevant=20 draws=198 tris=83.7k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=133 composed=133 multiplied=133 skinned=0
  environment              nodes=245 composed=245 multiplied=245 skinned=0
  settlement               nodes=1218 composed=1218 multiplied=1218 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1563 composed=1563 multiplied=1563 skinned=184
  fauna                    nodes=2299 composed=2299 multiplied=2299 skinned=188
  items                    nodes=254 composed=254 multiplied=254 skinned=0
  other                    nodes=447 composed=430 multiplied=447 skinned=9
  top scene children:
    fauna ×52                nodes=2299 composed=2299 multiplied=2299 skinned=188
    npc ×20                  nodes=1563 composed=1563 multiplied=1563 skinned=184
    settlement ×3            nodes=1218 composed=1218 multiplied=1218 skinned=0
    Group ×42                nodes=286 composed=286 multiplied=286 skinned=9
    chunk-items ×20          nodes=254 composed=254 multiplied=254 skinned=0
    chunk-environmen ×4      nodes=180 composed=180 multiplied=180 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.9 ms
  NPC            1.8 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         15.3 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=14.4 ms draws=1846 tris=11.51M
  hide-grass         render=13.7 ms draws=1797 tris=4.81M
  hide-vegetation    render=13.7 ms draws=1799 tris=11.51M
  hide-vegetation-grass render=13.9 ms draws=1751 tris=4.81M
  hide-environment   render=13.7 ms draws=1735 tris=11.51M
  hide-settlement    render=9.9 ms draws=762 tris=11.15M
  hide-water         render=14.7 ms draws=1869 tris=11.29M
  hide-terrain       render=14.6 ms draws=1821 tris=7.58M
  hide-npc-fauna     render=9.7 ms draws=1613 tris=11.29M
  no-shadows         render=11.3 ms draws=1425 tris=10.04M
  no-ao              render=13.9 ms draws=1840 tris=11.51M
  no-bloom           render=14.1 ms draws=1830 tris=11.51M
  no-smaa            render=14.1 ms draws=1839 tris=11.51M
  no-god-rays        render=14.1 ms draws=1839 tris=11.51M
  no-film-grade      render=14.2 ms draws=1844 tris=11.51M
  no-postprocessing  render=15.0 ms draws=1829 tris=11.52M
  no-reflections     render=14.3 ms draws=1527 tris=10.77M

Frame attribution:
  frame max: 59.1 ms
  largest labelled hitch: 0 ms
  unattributed: 59.1 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=366/366

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.8 ms/frame
  crowd pass: 0.0 ms/frame (2.3 ms cumulative)
  agent updates: 0.9 ms/frame (342.0 ms cumulative)
  livestock: 0.6 ms/frame (206.4 ms cumulative)
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
    water samples: 24.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 24.9/frame, 0.00 ms/frame (worst call 0.10 ms, 1422.9 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 10.6
    presentation executions/frame: 10.6
  rats: 0.1 ms/frame (45.9 ms cumulative)
  social: 0.0 ms/frame (2.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (38.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.1 ms/frame (769.9 ms cumulative)
  forest sampling: 0.1 ms/frame (32.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.3 ms cumulative)
    targeting: 0.0 ms/frame (7.0 ms cumulative)
    decision: 0.0 ms/frame (5.3 ms cumulative)
    behaviour: 1.4 ms/frame (514.7 ms cumulative)
    life/presentation: 0.4 ms/frame (163.4 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.6
    full-rate agents/frame: 7.3
    reduced-cadence agents/frame: 22.9
    behaviour executions/frame: 19.6
    presentation executions/frame: 19.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 367.1
    player perception checks/frame: 30.2

  nearest scans: 28.2/frame (10337 calls)
  nearest candidates checked: 202.7/frame (74172 total)
  herd leader scans: 0.4/frame (130 calls)
  herd candidates checked: 10.7/frame (3900 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.9/frame (174.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 146.4/frame, 0.10 ms/frame (worst call 1.10 ms)
    collider queries: 146.4/frame, 0.10 ms/frame (worst call 1.00 ms, 8486.2 colliders/frame)

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
Frames: 368
Shadow refresh frames: 368
Shadow skipped frames: 0

Mirror:
  calls avg: 333  tris avg: 750761
  info calls avg: 333  residual calls avg: 0
  environment                  calls=3 tris=432
  other                        calls=51 tris=10514
  settlement:decor             calls=97 tris=6818
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=8 tris=187
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
  settlement:workplace         calls=7 tris=2855
  terrain                      calls=9 tris=626412
  vegetation                   calls=3 tris=70

Shadow (refresh only):
  calls avg: 454  tris avg: 1471950
  info calls avg: 454  residual calls avg: 0
  environment                  calls=2 tris=108
  faunaFamily:fox              calls=8 tris=3465
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Knight_Cloth       calls=0 tris=244
  npcFamily:Peasant            calls=0 tris=94
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=66 tris=13542
  settlement:decor             calls=235 tris=7420
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
  settlement:workplace         calls=2 tris=252
  terrain                      calls=19 tris=1400548
  vegetation                   calls=36 tris=2076

Main:
  calls avg: 1072  tris avg: 9292717
  info calls avg: 1525  residual calls avg: 0
  environment                  calls=108 tris=3880
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=13 tris=4023
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=3 tris=1777
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=2 tris=1246
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
  settlement:decor             calls=191 tris=13564
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=16 tris=373
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
  settlement:workplace         calls=14 tris=5710
  terrain                      calls=26 tris=1916120
  vegetation                   calls=8 tris=228
  water                        calls=4 tris=229376


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=14.4 ms  p95=15.6 ms  max=25.2 ms  Δavg vs baseline=—
  hide-grass           avg=13.7 ms  p95=15.3 ms  max=16.1 ms  Δavg vs baseline=-0.7 ms (-5%)
  hide-vegetation      avg=13.7 ms  p95=15.0 ms  max=15.4 ms  Δavg vs baseline=-0.7 ms (-5%)
  no vegetation/grass  avg=13.9 ms  p95=15.7 ms  max=16.0 ms  Δavg vs baseline=-0.5 ms (-3%)
  hide-environment     avg=13.7 ms  p95=15.2 ms  max=20.6 ms  Δavg vs baseline=-0.7 ms (-5%)
  hide-settlement      avg=9.9 ms  p95=11.4 ms  max=12.5 ms  Δavg vs baseline=-4.5 ms (-31%)
  no water             avg=14.7 ms  p95=17.5 ms  max=19.8 ms  Δavg vs baseline=+0.3 ms (+2%)
  hide-terrain         avg=14.6 ms  p95=19.2 ms  max=22.1 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-npc-fauna       avg=9.7 ms  p95=11.4 ms  max=12.1 ms  Δavg vs baseline=-4.7 ms (-33%)
  no-shadows           avg=11.3 ms  p95=13.1 ms  max=15.7 ms  Δavg vs baseline=-3.0 ms (-21%)
  no-ao                avg=13.9 ms  p95=16.0 ms  max=16.4 ms  Δavg vs baseline=-0.5 ms (-3%)
  no-bloom             avg=14.1 ms  p95=15.5 ms  max=22.2 ms  Δavg vs baseline=-0.3 ms (-2%)
  no-smaa              avg=14.1 ms  p95=15.8 ms  max=17.4 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-god-rays          avg=14.1 ms  p95=15.4 ms  max=16.6 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-film-grade        avg=14.2 ms  p95=16.6 ms  max=17.0 ms  Δavg vs baseline=-0.2 ms (-1%)
  no postprocessing    avg=15.0 ms  p95=16.2 ms  max=18.7 ms  Δavg vs baseline=+0.6 ms (+4%)
  no mirrors           avg=14.3 ms  p95=15.7 ms  max=15.8 ms  Δavg vs baseline=-0.1 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=47.7 ms  p95=51.4 ms  max=53.9 ms
  CPU wall      avg=14.4 ms  p95=15.6 ms  max=25.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
