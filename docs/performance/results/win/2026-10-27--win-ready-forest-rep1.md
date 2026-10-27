# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:33:21.120Z
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
Frames: 1318
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-32-21-105Z-dnctnw
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
  populationGate: stable waited=5104ms npc=20
  gpuTimer: available=true resolved=true samples=1326 span=postprocess+labels

FPS:
  avg: 50.9
  min: 11
  p1: 33

Frame time (wall-clock):
  avg: 19.7 ms
  p50: 20.3 ms
  p95: 23 ms
  p99: 30.7 ms
  max: 91.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.3 p95=6.4 p99=14.2 max=78.3 n=1318
  render: p50=15.6 p95=17.7 p99=19.8 max=30.5 n=1318
  frame: p50=20.3 p95=23 p99=30.7 max=91.3 n=1318

Rendering (combined renderer.info):
  draw calls: 1852 avg / 2206 max
  triangles: 12.55M avg
  mirror draws: 340 avg
  geometries: 587
  textures: 531

Pass submissions (actual):
  reliability: observed
  frames: 1327 shadowRefresh=1327 shadowSkipped=0
  mirror calls avg: 340
  shadow calls avg: 427
  main calls avg: 1084

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
  other            draws=234 tris=26.3k meshes=234 inst=234

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  npc              draws=18 tris=24.2k meshes=18 inst=18
  fauna            draws=14 tris=4.6k meshes=14 inst=14
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=108 tris=14.8k meshes=108 inst=108

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
      near agents=2 camera-relevant=2 draws=18 tris=24.2k
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
      mid  agents=3 camera-relevant=2 draws=14 tris=4.6k
      far  agents=49 camera-relevant=19 draws=198 tris=83.7k

Systems:
  WATER          2.4 ms
  NPC            1.2 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         12.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=11.5 ms draws=1866 tris=12.55M
  hide-grass         render=11.3 ms draws=1817 tris=5.86M
  hide-vegetation    render=11.3 ms draws=1812 tris=12.38M
  hide-vegetation-grass render=11.0 ms draws=1761 tris=5.69M
  hide-environment   render=11.4 ms draws=1761 tris=12.54M
  hide-settlement    render=8.2 ms draws=764 tris=11.34M
  hide-water         render=11.8 ms draws=1849 tris=12.32M
  hide-terrain       render=11.9 ms draws=1795 tris=8.60M
  hide-npc-fauna     render=8.0 ms draws=1587 tris=12.30M
  no-shadows         render=9.4 ms draws=1436 tris=10.52M
  no-ao              render=11.4 ms draws=1834 tris=12.54M
  no-bloom           render=11.4 ms draws=1826 tris=12.54M
  no-smaa            render=12.1 ms draws=1841 tris=12.54M
  no-god-rays        render=11.5 ms draws=1851 tris=12.55M
  no-film-grade      render=11.6 ms draws=1860 tris=12.55M
  no-postprocessing  render=12.1 ms draws=1844 tris=12.56M
  no-reflections     render=11.9 ms draws=1529 tris=11.65M

Frame attribution:
  frame max: 91.3 ms
  largest labelled hitch: 0 ms
  unattributed: 91.3 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 91.3 ms

Raw sidecar:
  sampling=full factor=1 exported=1318/1318

Recommendation:
Largest frame (91.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.2 ms/frame
  crowd pass: 0.0 ms/frame (5.7 ms cumulative)
  agent updates: 0.7 ms/frame (964.9 ms cumulative)
  livestock: 0.3 ms/frame (361.0 ms cumulative)
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
    pest scans: 1.0/frame (1.0 rat candidates/frame)
    nearest scans: 5.9/frame (0.0 candidates/frame)
    water samples: 12.2/frame, 0.00 ms/frame (worst call 0.70 ms)
    collider queries: 12.2/frame, 0.00 ms/frame (worst call 0.40 ms, 718.6 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 5.9
    presentation executions/frame: 5.4
  rats: 0.1 ms/frame (90.2 ms cumulative)
  social: 0.0 ms/frame (2.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (118.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.1 ms/frame (1389.2 ms cumulative)
  forest sampling: 0.1 ms/frame (87.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.5 ms cumulative)
    targeting: 0.0 ms/frame (17.0 ms cumulative)
    decision: 0.0 ms/frame (11.8 ms cumulative)
    behaviour: 0.7 ms/frame (857.2 ms cumulative)
    life/presentation: 0.2 ms/frame (315.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.1
    full-rate agents/frame: 7.2
    reduced-cadence agents/frame: 22.5
    behaviour executions/frame: 14.1
    presentation executions/frame: 12.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.7
    village scan candidates/frame: 366.7
    player perception checks/frame: 29.7

  nearest scans: 20.7/frame (27318 calls)
  nearest candidates checked: 154.7/frame (203879 total)
  herd leader scans: 0.1/frame (171 calls)
  herd candidates checked: 3.9/frame (5130 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.9/frame (120.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 85.7/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 85.7/frame, 0.10 ms/frame (worst call 0.70 ms, 5536.9 colliders/frame)

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
Frames: 1327
Shadow refresh frames: 1327
Shadow skipped frames: 0

Mirror:
  calls avg: 340  tris avg: 905803
  info calls avg: 340  residual calls avg: 0
  environment                  calls=0 tris=434
  other                        calls=51 tris=10506
  settlement:decor             calls=83 tris=157879
  settlement:fence             calls=2 tris=3230
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=31 tris=2182
  settlement:fireHouseInteriorLamp calls=3 tris=378
  settlement:fireVillageTorch  calls=12 tris=893
  settlement:houseInteractive  calls=10 tris=1154
  settlement:houseStatic       calls=25 tris=18403
  settlement:landmarkGarden    calls=6 tris=52574
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1869
  settlement:landmarkWellHousehold calls=5 tris=3737
  settlement:landmarkWellPasture calls=2 tris=934
  settlement:other             calls=8 tris=150
  settlement:storageBarrel     calls=6 tris=7606
  settlement:storageContainer  calls=21 tris=1343
  settlement:storageGoods      calls=29 tris=5969
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=799
  settlement:storageWoodHousehold calls=7 tris=3116
  settlement:storageWoodSettlementPrimary calls=2 tris=890
  settlement:workplace         calls=8 tris=4500
  terrain                      calls=8 tris=625940
  vegetation                   calls=2 tris=675

Shadow (refresh only):
  calls avg: 427  tris avg: 2022930
  info calls avg: 427  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=4 tris=1837
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=2450
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Knight_Cloth       calls=0 tris=29
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=66 tris=13553
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
  calls avg: 1084  tris avg: 9620309
  info calls avg: 1512  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=1 tris=243
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=2 tris=1057
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=0 tris=67
  faunaFamily:wolf             calls=18 tris=8830
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 91.3ms
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
NPC              1.0ms
FAUNA           74.7ms
PHYSICS          0.1ms
RENDER          12.8ms
OTHER            2.6ms

Long frame #2:

[LONG FRAME] 87.9ms
simulate        70.7ms
render          16.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.0ms
STREAMING        0.0ms
NPC              1.0ms
FAUNA           67.1ms
PHYSICS          0.0ms
RENDER          12.0ms
OTHER            2.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=11.5 ms  p95=12.7 ms  max=13.4 ms  Δavg vs baseline=—
  hide-grass           avg=11.3 ms  p95=12.4 ms  max=12.6 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-vegetation      avg=11.3 ms  p95=12.3 ms  max=13.7 ms  Δavg vs baseline=-0.2 ms (-2%)
  no vegetation/grass  avg=11.0 ms  p95=11.9 ms  max=12.3 ms  Δavg vs baseline=-0.5 ms (-5%)
  hide-environment     avg=11.4 ms  p95=12.1 ms  max=21.9 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-settlement      avg=8.2 ms  p95=8.9 ms  max=9.4 ms  Δavg vs baseline=-3.4 ms (-29%)
  no water             avg=11.8 ms  p95=12.4 ms  max=12.6 ms  Δavg vs baseline=+0.3 ms (+2%)
  hide-terrain         avg=11.9 ms  p95=12.5 ms  max=15.1 ms  Δavg vs baseline=+0.3 ms (+3%)
  hide-npc-fauna       avg=8.0 ms  p95=8.8 ms  max=8.8 ms  Δavg vs baseline=-3.5 ms (-30%)
  no-shadows           avg=9.4 ms  p95=10.2 ms  max=10.3 ms  Δavg vs baseline=-2.2 ms (-19%)
  no-ao                avg=11.4 ms  p95=12.1 ms  max=13.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=11.4 ms  p95=12.0 ms  max=12.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-smaa              avg=12.1 ms  p95=12.9 ms  max=28.0 ms  Δavg vs baseline=+0.5 ms (+5%)
  no-god-rays          avg=11.5 ms  p95=12.1 ms  max=12.8 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-film-grade        avg=11.6 ms  p95=12.6 ms  max=12.7 ms  Δavg vs baseline=+0.0 ms (+0%)
  no postprocessing    avg=12.1 ms  p95=13.3 ms  max=13.7 ms  Δavg vs baseline=+0.5 ms (+5%)
  no mirrors           avg=11.9 ms  p95=12.5 ms  max=12.5 ms  Δavg vs baseline=+0.4 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (37 samples resolved during the baseline window)
  GPU elapsed   avg=18.5 ms  p95=18.9 ms  max=19.7 ms
  CPU wall      avg=11.5 ms  p95=12.7 ms  max=13.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
