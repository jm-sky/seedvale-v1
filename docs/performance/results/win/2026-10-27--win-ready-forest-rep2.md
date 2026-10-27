# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:36:10.683Z
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
Frames: 1237
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-35-09-066Z-ja9vzk
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
  populationGate: stable waited=5286ms npc=20
  gpuTimer: available=true resolved=true samples=1245 span=postprocess+labels

FPS:
  avg: 47.3
  min: 11
  p1: 22

Frame time (wall-clock):
  avg: 21.1 ms
  p50: 21.6 ms
  p95: 25.2 ms
  p99: 45.4 ms
  max: 91.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.6 p95=7 p99=28.3 max=73.4 n=1237
  render: p50=16.9 p95=19 p99=20.2 max=29.7 n=1237
  frame: p50=21.6 p95=25.2 p99=45.4 max=91.5 n=1237

Rendering (combined renderer.info):
  draw calls: 1871 avg / 2243 max
  triangles: 12.56M avg
  mirror draws: 341 avg
  geometries: 570
  textures: 529

Pass submissions (actual):
  reliability: observed
  frames: 1246 shadowRefresh=1246 shadowSkipped=0
  mirror calls avg: 341
  shadow calls avg: 433
  main calls avg: 1098

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=84 tris=7.46M meshes=84 inst=562716
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=722 tris=693.5k meshes=722 inst=1320
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=164 tris=16.0k meshes=164 inst=164
  other            draws=232 tris=26.0k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  npc              draws=28 tris=37.0k meshes=28 inst=28
  fauna            draws=14 tris=4.6k meshes=14 inst=14
  items            draws=21 tris=12.6k meshes=21 inst=21
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
      mid  agents=1 camera-relevant=1 draws=10 tris=12.8k
      far  agents=17 camera-relevant=10 draws=164 tris=198.9k
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

Systems:
  WATER          2.6 ms
  NPC            1.3 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         13.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.5 ms draws=1893 tris=12.57M
  hide-grass         render=12.3 ms draws=1845 tris=5.88M
  hide-vegetation    render=12.2 ms draws=1845 tris=12.40M
  hide-vegetation-grass render=11.9 ms draws=1804 tris=5.71M
  hide-environment   render=12.3 ms draws=1809 tris=12.56M
  hide-settlement    render=9.1 ms draws=807 tris=11.36M
  hide-water         render=12.6 ms draws=1890 tris=12.35M
  hide-terrain       render=12.2 ms draws=1829 tris=8.63M
  hide-npc-fauna     render=8.2 ms draws=1586 tris=12.30M
  no-shadows         render=10.0 ms draws=1456 tris=10.53M
  no-ao              render=12.4 ms draws=1857 tris=12.56M
  no-bloom           render=12.4 ms draws=1842 tris=12.56M
  no-smaa            render=12.7 ms draws=1852 tris=12.56M
  no-god-rays        render=12.3 ms draws=1855 tris=12.56M
  no-film-grade      render=12.4 ms draws=1859 tris=12.56M
  no-postprocessing  render=12.6 ms draws=1835 tris=12.56M
  no-reflections     render=12.5 ms draws=1519 tris=11.65M

Frame attribution:
  frame max: 91.5 ms
  largest labelled hitch: 0 ms
  unattributed: 91.5 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 91.5 ms

Raw sidecar:
  sampling=full factor=1 exported=1237/1237

Recommendation:
Largest frame (91.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (6.5 ms cumulative)
  agent updates: 0.8 ms/frame (980.3 ms cumulative)
  livestock: 0.3 ms/frame (353.5 ms cumulative)
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
    pest scans: 1.2/frame (1.2 rat candidates/frame)
    nearest scans: 6.2/frame (0.0 candidates/frame)
    water samples: 12.6/frame, 0.00 ms/frame (worst call 0.70 ms)
    collider queries: 12.6/frame, 0.00 ms/frame (worst call 0.90 ms, 745.4 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 6.2
    presentation executions/frame: 5.7
  rats: 0.1 ms/frame (81.7 ms cumulative)
  social: 0.0 ms/frame (3.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (115.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.2 ms/frame (1515.8 ms cumulative)
  forest sampling: 0.1 ms/frame (76.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.3 ms cumulative)
    targeting: 0.0 ms/frame (12.1 ms cumulative)
    decision: 0.0 ms/frame (11.5 ms cumulative)
    behaviour: 0.8 ms/frame (968.8 ms cumulative)
    life/presentation: 0.3 ms/frame (353.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.9
    decision passes/frame: 29.9
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.1
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 21.9
    behaviour executions/frame: 15.1
    presentation executions/frame: 13.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.9
    village scan candidates/frame: 369.0
    player perception checks/frame: 29.9

  nearest scans: 20.9/frame (25809 calls)
  nearest candidates checked: 153.1/frame (189400 total)
  herd leader scans: 0.2/frame (233 calls)
  herd candidates checked: 5.7/frame (6990 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.2/frame (124.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 41.0/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 41.0/frame, 0.00 ms/frame (worst call 1.30 ms, 2461.0 colliders/frame)

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
Frames: 1246
Shadow refresh frames: 1246
Shadow skipped frames: 0

Mirror:
  calls avg: 341  tris avg: 909470
  info calls avg: 341  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=84 tris=160982
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
  calls avg: 433  tris avg: 2028910
  info calls avg: 433  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=0 tris=2
  faunaFamily:fox              calls=4 tris=1953
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=0 tris=219
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Knight_Cloth       calls=6 tris=8105
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:Wizard             calls=0 tris=29
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
  calls avg: 1098  tris avg: 9624577
  info calls avg: 1531  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=15 tris=4633
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=0 tris=213
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:wolf             calls=18 tris=8756
  grass                        calls=49 tris=6690564
  items                        calls=1 tris=880
  npcFamily:Knight_Cloth       calls=24 tris=29113
  npcFamily:Peasant            calls=60 tris=66066
  npcFamily:Peasant_Boots      calls=33 tris=41134
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=12255
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=126 tris=21539
  settlement:decor             calls=162 tris=311962
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

[LONG FRAME] 91.5ms
simulate        73.4ms
render          17.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.2ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA           69.5ms
PHYSICS          0.0ms
RENDER          12.6ms
OTHER            3.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.5 ms  p95=13.1 ms  max=13.5 ms  Δavg vs baseline=—
  hide-grass           avg=12.3 ms  p95=13.1 ms  max=13.8 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-vegetation      avg=12.2 ms  p95=12.8 ms  max=12.8 ms  Δavg vs baseline=-0.3 ms (-3%)
  no vegetation/grass  avg=11.9 ms  p95=12.6 ms  max=13.0 ms  Δavg vs baseline=-0.6 ms (-5%)
  hide-environment     avg=12.3 ms  p95=12.8 ms  max=12.9 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-settlement      avg=9.1 ms  p95=9.7 ms  max=10.8 ms  Δavg vs baseline=-3.4 ms (-27%)
  no water             avg=12.6 ms  p95=13.4 ms  max=13.8 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-terrain         avg=12.2 ms  p95=12.9 ms  max=13.1 ms  Δavg vs baseline=-0.4 ms (-3%)
  hide-npc-fauna       avg=8.2 ms  p95=9.5 ms  max=11.8 ms  Δavg vs baseline=-4.3 ms (-34%)
  no-shadows           avg=10.0 ms  p95=10.5 ms  max=10.5 ms  Δavg vs baseline=-2.5 ms (-20%)
  no-ao                avg=12.4 ms  p95=13.1 ms  max=14.1 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-bloom             avg=12.4 ms  p95=13.3 ms  max=13.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-smaa              avg=12.7 ms  p95=13.3 ms  max=23.4 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-god-rays          avg=12.3 ms  p95=13.1 ms  max=13.6 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-film-grade        avg=12.4 ms  p95=12.9 ms  max=13.0 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=12.6 ms  p95=13.9 ms  max=14.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  no mirrors           avg=12.5 ms  p95=13.3 ms  max=13.4 ms  Δavg vs baseline=-0.0 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (36 samples resolved during the baseline window)
  GPU elapsed   avg=21.4 ms  p95=22.5 ms  max=23.0 ms
  CPU wall      avg=12.5 ms  p95=13.1 ms  max=13.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
