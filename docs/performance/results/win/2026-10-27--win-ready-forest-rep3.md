# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:39:01.042Z
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
Frames: 1166
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-38-00-081Z-b81nk8
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
  populationGate: stable waited=5250ms npc=20
  gpuTimer: available=true resolved=true samples=1172 span=postprocess+labels

FPS:
  avg: 45.4
  min: 10
  p1: 21

Frame time (wall-clock):
  avg: 22 ms
  p50: 22.1 ms
  p95: 26.3 ms
  p99: 48.5 ms
  max: 104.8 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.9 p95=7.5 p99=32.9 max=86.7 n=1166
  render: p50=17 p95=19.5 p99=22.9 max=48 n=1166
  frame: p50=22.1 p95=26.3 p99=48.5 max=104.8 n=1166

Rendering (combined renderer.info):
  draw calls: 1860 avg / 2225 max
  triangles: 12.55M avg
  mirror draws: 341 avg
  geometries: 568
  textures: 530

Pass submissions (actual):
  reliability: observed
  frames: 1174 shadowRefresh=1174 shadowSkipped=0
  mirror calls avg: 341
  shadow calls avg: 430
  main calls avg: 1090

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
  other            draws=232 tris=26.0k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  npc              draws=18 tris=24.2k meshes=18 inst=18
  fauna            draws=18 tris=6.5k meshes=18 inst=18
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=106 tris=14.6k meshes=106 inst=106

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
      near agents=1 camera-relevant=1 draws=2 tris=610
      mid  agents=3 camera-relevant=1 draws=16 tris=5.9k
      far  agents=48 camera-relevant=19 draws=194 tris=81.8k

Systems:
  WATER          2.7 ms
  NPC            1.3 ms
  FAUNA          1.5 ms
  PHYSICS        0.1 ms
  RENDER         13.4 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.5 ms draws=1853 tris=12.55M
  hide-grass         render=12.2 ms draws=1807 tris=5.86M
  hide-vegetation    render=12.0 ms draws=1804 tris=12.37M
  hide-vegetation-grass render=11.9 ms draws=1757 tris=5.68M
  hide-environment   render=11.9 ms draws=1763 tris=12.53M
  hide-settlement    render=8.4 ms draws=753 tris=11.34M
  hide-water         render=12.0 ms draws=1843 tris=12.32M
  hide-terrain       render=12.1 ms draws=1794 tris=8.60M
  hide-npc-fauna     render=8.2 ms draws=1581 tris=12.30M
  no-shadows         render=9.7 ms draws=1440 tris=10.53M
  no-ao              render=12.2 ms draws=1856 tris=12.56M
  no-bloom           render=12.2 ms draws=1851 tris=12.56M
  no-smaa            render=12.0 ms draws=1840 tris=12.55M
  no-god-rays        render=12.0 ms draws=1841 tris=12.55M
  no-film-grade      render=12.2 ms draws=1842 tris=12.55M
  no-postprocessing  render=12.5 ms draws=1819 tris=12.55M
  no-reflections     render=12.5 ms draws=1504 tris=11.65M

Frame attribution:
  frame max: 104.8 ms
  largest labelled hitch: 0 ms
  unattributed: 104.8 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 104.8 ms

Raw sidecar:
  sampling=full factor=1 exported=1166/1166

Recommendation:
Largest frame (104.8 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (8.1 ms cumulative)
  agent updates: 0.8 ms/frame (950.5 ms cumulative)
  livestock: 0.3 ms/frame (385.3 ms cumulative)
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
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.1/frame (1.1 rat candidates/frame)
    nearest scans: 6.3/frame (0.0 candidates/frame)
    water samples: 14.8/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 14.8/frame, 0.00 ms/frame (worst call 0.10 ms, 798.7 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 6.3
    presentation executions/frame: 5.9
  rats: 0.1 ms/frame (87.2 ms cumulative)
  social: 0.0 ms/frame (3.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (114.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.5 ms/frame (1742.4 ms cumulative)
  forest sampling: 0.1 ms/frame (77.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (15.9 ms cumulative)
    targeting: 0.0 ms/frame (15.1 ms cumulative)
    decision: 0.0 ms/frame (11.0 ms cumulative)
    behaviour: 1.0 ms/frame (1220.1 ms cumulative)
    life/presentation: 0.3 ms/frame (323.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.2
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 15.2
    presentation executions/frame: 13.9

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.7
    village scan candidates/frame: 364.7
    player perception checks/frame: 29.7

  nearest scans: 23.0/frame (26809 calls)
  nearest candidates checked: 166.1/frame (193641 total)
  herd leader scans: 0.2/frame (268 calls)
  herd candidates checked: 6.9/frame (8040 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.7/frame (135.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 34.0/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 34.0/frame, 0.00 ms/frame (worst call 0.70 ms, 2308.2 colliders/frame)

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
Frames: 1174
Shadow refresh frames: 1174
Shadow skipped frames: 0

Mirror:
  calls avg: 341  tris avg: 906598
  info calls avg: 341  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=84 tris=158110
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=32 tris=2184
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=894
  settlement:houseInteractive  calls=11 tris=1155
  settlement:houseStatic       calls=25 tris=18417
  settlement:landmarkGarden    calls=6 tris=52614
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=3740
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=8 tris=150
  settlement:storageBarrel     calls=6 tris=7612
  settlement:storageContainer  calls=22 tris=1344
  settlement:storageGoods      calls=29 tris=5974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=800
  settlement:storageWoodHousehold calls=7 tris=3119
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=8 tris=4503
  terrain                      calls=9 tris=626412
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 430  tris avg: 2022299
  info calls avg: 430  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=8 tris=3696
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:woodcutter         calls=9 tris=12136
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
  settlement:storageWoodHousehold calls=4 tris=1782
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1090  tris avg: 9621754
  info calls avg: 1520  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=6 tris=1868
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=450
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=19 tris=9325
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

[LONG FRAME] 104.8ms
simulate        86.7ms
render          17.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.0ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA           82.2ms
PHYSICS          0.0ms
RENDER          12.9ms
OTHER            3.3ms

Long frame #2:

[LONG FRAME] 80.5ms
simulate        32.0ms
render          48.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           15.1ms
STREAMING        0.1ms
NPC              1.1ms
FAUNA           27.7ms
PHYSICS          0.0ms
RENDER          32.9ms
OTHER            3.6ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.5 ms  p95=13.2 ms  max=18.6 ms  Δavg vs baseline=—
  hide-grass           avg=12.2 ms  p95=13.5 ms  max=14.4 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-vegetation      avg=12.0 ms  p95=13.5 ms  max=14.7 ms  Δavg vs baseline=-0.4 ms (-3%)
  no vegetation/grass  avg=11.9 ms  p95=12.7 ms  max=13.1 ms  Δavg vs baseline=-0.5 ms (-4%)
  hide-environment     avg=11.9 ms  p95=13.0 ms  max=13.8 ms  Δavg vs baseline=-0.6 ms (-5%)
  hide-settlement      avg=8.4 ms  p95=9.5 ms  max=11.7 ms  Δavg vs baseline=-4.0 ms (-32%)
  no water             avg=12.0 ms  p95=13.0 ms  max=13.6 ms  Δavg vs baseline=-0.5 ms (-4%)
  hide-terrain         avg=12.1 ms  p95=12.7 ms  max=14.6 ms  Δavg vs baseline=-0.3 ms (-3%)
  hide-npc-fauna       avg=8.2 ms  p95=9.2 ms  max=10.8 ms  Δavg vs baseline=-4.3 ms (-34%)
  no-shadows           avg=9.7 ms  p95=10.4 ms  max=11.0 ms  Δavg vs baseline=-2.7 ms (-22%)
  no-ao                avg=12.2 ms  p95=13.0 ms  max=13.0 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-bloom             avg=12.2 ms  p95=13.2 ms  max=17.4 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-smaa              avg=12.0 ms  p95=12.8 ms  max=13.3 ms  Δavg vs baseline=-0.4 ms (-3%)
  no-god-rays          avg=12.0 ms  p95=12.6 ms  max=12.8 ms  Δavg vs baseline=-0.4 ms (-3%)
  no-film-grade        avg=12.2 ms  p95=12.6 ms  max=12.7 ms  Δavg vs baseline=-0.3 ms (-2%)
  no postprocessing    avg=12.5 ms  p95=14.0 ms  max=14.5 ms  Δavg vs baseline=+0.1 ms (+1%)
  no mirrors           avg=12.5 ms  p95=13.9 ms  max=14.8 ms  Δavg vs baseline=+0.0 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=21.8 ms  p95=22.4 ms  max=23.9 ms
  CPU wall      avg=12.5 ms  p95=13.2 ms  max=18.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
