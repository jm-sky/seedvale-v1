# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:10:53.256Z
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
Frames: 1240
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T21-09-51-297Z-iky3rw
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5077ms npc=20
  gpuTimer: available=true resolved=true samples=1248 span=postprocess+labels

FPS:
  avg: 47.5
  min: 11
  p1: 24

Frame time (wall-clock):
  avg: 21.1 ms
  p50: 21.4 ms
  p95: 24.9 ms
  p99: 42.2 ms
  max: 91.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.8 p95=7 p99=23.8 max=78.3 n=1240
  render: p50=16.2 p95=18.9 p99=20 max=37.7 n=1240
  frame: p50=21.4 p95=24.9 p99=42.2 max=91.4 n=1240

Rendering (combined renderer.info):
  draw calls: 1855 avg / 2212 max
  triangles: 12.55M avg
  mirror draws: 341 avg
  geometries: 574
  textures: 523

Pass submissions (actual):
  reliability: observed
  frames: 1249 shadowRefresh=1249 shadowSkipped=0
  mirror calls avg: 341
  shadow calls avg: 429
  main calls avg: 1085

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=84 tris=7.46M meshes=84 inst=562716
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=722 tris=693.5k meshes=722 inst=1320
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=233 tris=26.1k meshes=233 inst=233

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  npc              draws=18 tris=24.2k meshes=18 inst=18
  fauna            draws=14 tris=4.6k meshes=14 inst=14
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=107 tris=14.7k meshes=107 inst=107

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=20 tris=8.9k meshes=20 inst=20
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
      Peasant          agents=9 draws=82 tris=101.0k skinned=82/82
      Peasant_Boots    agents=4 draws=38 tris=49.3k skinned=38/38
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Wizard           agents=2 draws=24 tris=23.8k skinned=24/24
      blacksmith       agents=1 draws=10 tris=12.3k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      near agents=1 camera-relevant=1 draws=9 tris=12.1k
      mid  agents=1 camera-relevant=1 draws=9 tris=12.1k
      far  agents=18 camera-relevant=11 draws=174 tris=211.8k
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
      far  agents=49 camera-relevant=18 draws=198 tris=83.7k

Systems:
  WATER          2.6 ms
  NPC            1.3 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         12.9 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.4 ms draws=1854 tris=12.55M
  hide-grass         render=12.0 ms draws=1805 tris=5.86M
  hide-vegetation    render=12.1 ms draws=1805 tris=12.38M
  hide-vegetation-grass render=11.8 ms draws=1761 tris=5.68M
  hide-environment   render=12.1 ms draws=1766 tris=12.53M
  hide-settlement    render=8.7 ms draws=760 tris=11.34M
  hide-water         render=12.3 ms draws=1854 tris=12.31M
  hide-terrain       render=11.8 ms draws=1805 tris=8.60M
  hide-npc-fauna     render=8.4 ms draws=1591 tris=12.29M
  no-shadows         render=10.4 ms draws=1453 tris=10.52M
  no-ao              render=11.9 ms draws=1853 tris=12.54M
  no-bloom           render=11.8 ms draws=1846 tris=12.54M
  no-smaa            render=12.0 ms draws=1856 tris=12.54M
  no-god-rays        render=12.2 ms draws=1864 tris=12.54M
  no-film-grade      render=12.0 ms draws=1871 tris=12.54M
  no-postprocessing  render=12.5 ms draws=1860 tris=12.55M
  no-reflections     render=12.1 ms draws=1546 tris=11.64M

Frame attribution:
  frame max: 91.4 ms
  largest labelled hitch: 0 ms
  unattributed: 91.4 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 91.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1240/1240

Recommendation:
Largest frame (91.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (6.4 ms cumulative)
  agent updates: 0.8 ms/frame (957.5 ms cumulative)
  livestock: 0.3 ms/frame (368.7 ms cumulative)
    loaded tick: 0.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.1 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.1/frame (1.1 rat candidates/frame)
    nearest scans: 6.1/frame (0.0 candidates/frame)
    water samples: 13.1/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 13.1/frame, 0.00 ms/frame (worst call 0.10 ms, 719.6 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 18.9
    behaviour executions/frame: 6.3
    presentation executions/frame: 5.7
  rats: 0.1 ms/frame (91.6 ms cumulative)
  social: 0.0 ms/frame (2.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (114.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (1584.8 ms cumulative)
  forest sampling: 0.1 ms/frame (82.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (15.7 ms cumulative)
    targeting: 0.0 ms/frame (15.1 ms cumulative)
    decision: 0.0 ms/frame (13.7 ms cumulative)
    behaviour: 0.9 ms/frame (1077.3 ms cumulative)
    life/presentation: 0.2 ms/frame (301.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.2
    full-rate agents/frame: 6.7
    reduced-cadence agents/frame: 23.0
    behaviour executions/frame: 14.2
    presentation executions/frame: 12.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.7
    village scan candidates/frame: 366.8
    player perception checks/frame: 29.7

  nearest scans: 20.8/frame (25771 calls)
  nearest candidates checked: 155.9/frame (193290 total)
  herd leader scans: 0.2/frame (186 calls)
  herd candidates checked: 4.5/frame (5580 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.7/frame (121.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 40.2/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 40.2/frame, 0.00 ms/frame (worst call 0.10 ms, 2404.0 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=616454 filler=1247320
Submitted instances: full=265630 filler=297074
Meshes submitted: 72
LOD submitted fraction: full=0.43089995360562183 filler=0.23816983612865986
Flowers: unavailable
Allocation bytes (estimated): 178922304
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1249
Shadow refresh frames: 1249
Shadow skipped frames: 0

Mirror:
  calls avg: 341  tris avg: 910198
  info calls avg: 341  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10522
  settlement:decor             calls=84 tris=161111
  settlement:fence             calls=2 tris=3235
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=32 tris=2186
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=895
  settlement:houseInteractive  calls=11 tris=1156
  settlement:houseStatic       calls=25 tris=18432
  settlement:landmarkGarden    calls=6 tris=52656
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1871
  settlement:landmarkWellHousehold calls=5 tris=3743
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=8 tris=150
  settlement:storageBarrel     calls=6 tris=7618
  settlement:storageContainer  calls=22 tris=1345
  settlement:storageGoods      calls=29 tris=5979
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=801
  settlement:storageWoodHousehold calls=7 tris=3121
  settlement:storageWoodSettlementPrimary calls=2 tris=892
  settlement:workplace         calls=8 tris=4507
  terrain                      calls=9 tris=626914
  vegetation                   calls=2 tris=677

Shadow (refresh only):
  calls avg: 429  tris avg: 2022711
  info calls avg: 429  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=0 tris=14
  faunaFamily:fox              calls=6 tris=2609
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=1314
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:Wizard             calls=0 tris=133
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=66 tris=13580
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
  settlement:storageWoodHousehold calls=4 tris=1782
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1085  tris avg: 9620267
  info calls avg: 1514  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=2 tris=537
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=339
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=19 tris=9280
  grass                        calls=49 tris=6690564
  items                        calls=1 tris=880
  npcFamily:Knight_Cloth       calls=24 tris=29113
  npcFamily:Peasant            calls=60 tris=66066
  npcFamily:Peasant_Boots      calls=33 tris=41134
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=12255
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=126 tris=21539
  settlement:decor             calls=161 tris=311098
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=63 tris=4368
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
  settlement:storageWoodHousehold calls=14 tris=6237
  settlement:storageWoodSettlementPrimary calls=4 tris=1782
  settlement:workplace         calls=16 tris=9006
  terrain                      calls=26 tris=1916120
  vegetation                   calls=6 tris=1958
  water                        calls=4 tris=229376


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

[LONG FRAME] 91.4ms
simulate        78.3ms
render          12.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA           73.7ms
PHYSICS          0.1ms
RENDER          12.8ms
OTHER            3.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.4 ms  p95=13.0 ms  max=13.2 ms  Δavg vs baseline=—
  hide-grass           avg=12.0 ms  p95=12.8 ms  max=13.4 ms  Δavg vs baseline=-0.4 ms (-3%)
  hide-vegetation      avg=12.1 ms  p95=12.7 ms  max=12.7 ms  Δavg vs baseline=-0.3 ms (-2%)
  no vegetation/grass  avg=11.8 ms  p95=12.7 ms  max=12.9 ms  Δavg vs baseline=-0.6 ms (-5%)
  hide-environment     avg=12.1 ms  p95=12.9 ms  max=13.9 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-settlement      avg=8.7 ms  p95=9.1 ms  max=10.0 ms  Δavg vs baseline=-3.7 ms (-30%)
  no water             avg=12.3 ms  p95=12.9 ms  max=12.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=11.8 ms  p95=12.4 ms  max=12.4 ms  Δavg vs baseline=-0.6 ms (-5%)
  hide-npc-fauna       avg=8.4 ms  p95=8.7 ms  max=10.6 ms  Δavg vs baseline=-4.0 ms (-32%)
  no-shadows           avg=10.4 ms  p95=12.8 ms  max=14.2 ms  Δavg vs baseline=-2.0 ms (-16%)
  no-ao                avg=11.9 ms  p95=12.2 ms  max=19.5 ms  Δavg vs baseline=-0.5 ms (-4%)
  no-bloom             avg=11.8 ms  p95=12.4 ms  max=12.7 ms  Δavg vs baseline=-0.6 ms (-5%)
  no-smaa              avg=12.0 ms  p95=12.6 ms  max=15.0 ms  Δavg vs baseline=-0.4 ms (-3%)
  no-god-rays          avg=12.2 ms  p95=13.0 ms  max=13.1 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-film-grade        avg=12.0 ms  p95=12.8 ms  max=13.1 ms  Δavg vs baseline=-0.4 ms (-3%)
  no postprocessing    avg=12.5 ms  p95=13.7 ms  max=14.0 ms  Δavg vs baseline=+0.1 ms (+1%)
  no mirrors           avg=12.1 ms  p95=12.8 ms  max=13.1 ms  Δavg vs baseline=-0.2 ms (-2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=21.1 ms  p95=22.1 ms  max=22.9 ms
  CPU wall      avg=12.4 ms  p95=13.0 ms  max=13.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
