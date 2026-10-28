# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T15:48:17.391Z
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
Frames: 1081
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: ccc4d3783a9d069d308a635a8e47179f6645cb17
  runId: 2026-10-28T15-47-14-362Z-r9vv8z
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5188ms npc=20
  gpuTimer: available=true resolved=true samples=1088 span=postprocess+labels

FPS:
  avg: 37.6
  min: 6
  p1: 16

Frame time (wall-clock):
  avg: 26.6 ms
  p50: 25.3 ms
  p95: 38.3 ms
  p99: 63.2 ms
  max: 157 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.4 p95=11.6 p99=42.6 max=137 n=1081
  render: p50=18.4 p95=24.7 p99=29.8 max=37.7 n=1081
  frame: p50=25.3 p95=38.3 p99=63.2 max=157 n=1081

Rendering (combined renderer.info):
  draw calls: 1821 avg / 2201 max
  triangles: 12.54M avg
  mirror draws: 336 avg
  geometries: 584
  textures: 517

Pass submissions (actual):
  reliability: observed
  frames: 1089 shadowRefresh=1089 shadowSkipped=0
  mirror calls avg: 336
  shadow calls avg: 424
  main calls avg: 1062

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=84 tris=7.46M meshes=84 inst=562716
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=702 tris=692.1k meshes=702 inst=1307
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=188 tris=238.0k meshes=188 inst=188
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=231 tris=25.9k meshes=231 inst=231

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=422 tris=488.6k meshes=422 inst=972
  npc              draws=16 tris=22.9k meshes=16 inst=16
  fauna            draws=16 tris=6.0k meshes=16 inst=16
  items            draws=23 tris=14.4k meshes=23 inst=23
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
      Peasant          agents=9 draws=82 tris=101.0k skinned=82/82
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Wizard           agents=2 draws=24 tris=23.8k skinned=24/24
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Peasant_Boots    agents=2 draws=18 tris=24.2k skinned=18/18
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      near agents=1 camera-relevant=1 draws=9 tris=12.1k
      mid  agents=1 camera-relevant=1 draws=7 tris=10.8k
      far  agents=18 camera-relevant=11 draws=172 tris=215.1k
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
      near agents=2 camera-relevant=2 draws=3 tris=1.3k
      mid  agents=3 camera-relevant=1 draws=13 tris=4.7k
      far  agents=47 camera-relevant=17 draws=196 tris=82.3k

Systems:
  WATER          3.1 ms
  NPC            1.6 ms
  FAUNA          2.4 ms
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
  full               render=14.4 ms draws=1808 tris=12.53M
  hide-grass         render=15.2 ms draws=1761 tris=5.84M
  hide-vegetation    render=14.5 ms draws=1770 tris=12.36M
  hide-vegetation-grass render=14.5 ms draws=1738 tris=5.67M
  hide-environment   render=15.0 ms draws=1754 tris=12.52M
  hide-settlement    render=10.1 ms draws=763 tris=11.32M
  hide-water         render=15.1 ms draws=1833 tris=12.30M
  hide-terrain       render=14.1 ms draws=1781 tris=8.58M
  hide-npc-fauna     render=9.3 ms draws=1585 tris=12.30M
  no-shadows         render=10.8 ms draws=1450 tris=10.52M
  no-ao              render=12.9 ms draws=1843 tris=12.53M
  no-bloom           render=13.3 ms draws=1836 tris=12.53M
  no-smaa            render=13.4 ms draws=1846 tris=12.53M
  no-god-rays        render=13.2 ms draws=1841 tris=12.53M
  no-film-grade      render=13.0 ms draws=1842 tris=12.53M
  no-postprocessing  render=13.2 ms draws=1818 tris=12.53M
  no-reflections     render=13.3 ms draws=1506 tris=11.62M

Frame attribution:
  frame max: 157 ms
  largest labelled hitch: 0 ms
  unattributed: 157 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 157 ms

Raw sidecar:
  sampling=full factor=1 exported=1081/1081

Recommendation:
Largest frame (157 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.6 ms/frame
  crowd pass: 0.0 ms/frame (9.0 ms cumulative)
  agent updates: 1.0 ms/frame (1061.4 ms cumulative)
  livestock: 0.4 ms/frame (457.7 ms cumulative)
    loaded tick: 0.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.3/frame (1.3 rat candidates/frame)
    nearest scans: 6.6/frame (0.0 candidates/frame)
    water samples: 15.3/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 15.3/frame, 0.00 ms/frame (worst call 1.00 ms, 863.5 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 6.6
    presentation executions/frame: 6.3
  rats: 0.1 ms/frame (112.1 ms cumulative)
  social: 0.0 ms/frame (4.0 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (129.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.4 ms/frame
  agent updates: 2.4 ms/frame (2632.7 ms cumulative)
  forest sampling: 0.1 ms/frame (85.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (20.1 ms cumulative)
    targeting: 0.0 ms/frame (18.5 ms cumulative)
    decision: 0.0 ms/frame (14.6 ms cumulative)
    behaviour: 1.9 ms/frame (2062.8 ms cumulative)
    life/presentation: 0.3 ms/frame (340.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.8
    full-rate agents/frame: 7.5
    reduced-cadence agents/frame: 22.8
    behaviour executions/frame: 15.8
    presentation executions/frame: 14.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 371.2
    player perception checks/frame: 30.2

  nearest scans: 21.6/frame (23400 calls)
  nearest candidates checked: 161.3/frame (174401 total)
  herd leader scans: 0.1/frame (160 calls)
  herd candidates checked: 4.4/frame (4800 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.7/frame (129.0 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 71.9/frame, 0.10 ms/frame (worst call 1.40 ms)
    collider queries: 71.9/frame, 0.10 ms/frame (worst call 1.00 ms, 4907.4 colliders/frame)

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
Frames: 1089
Shadow refresh frames: 1089
Shadow skipped frames: 0

Mirror:
  calls avg: 336  tris avg: 909849
  info calls avg: 336  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10523
  settlement:decor             calls=85 tris=161162
  settlement:fence             calls=2 tris=3235
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=32 tris=2186
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=895
  settlement:houseInteractive  calls=11 tris=1156
  settlement:houseStatic       calls=25 tris=18434
  settlement:landmarkGarden    calls=6 tris=52662
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1872
  settlement:landmarkWellHousehold calls=5 tris=3743
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=9 tris=162
  settlement:storageBarrel     calls=6 tris=7619
  settlement:storageContainer  calls=22 tris=1345
  settlement:storageGoods      calls=29 tris=5979
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=801
  settlement:storageWoodHousehold calls=1 tris=2733
  settlement:storageWoodSettlementPrimary calls=1 tris=781
  settlement:workplace         calls=8 tris=4507
  terrain                      calls=9 tris=626987
  vegetation                   calls=2 tris=677

Shadow (refresh only):
  calls avg: 424  tris avg: 2020862
  info calls avg: 424  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=0 tris=12
  faunaFamily:fox              calls=6 tris=2968
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=0 tris=303
  faunaFamily:rat              calls=0 tris=169
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Knight_Cloth       calls=0 tris=188
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:Wizard             calls=0 tris=273
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
  calls avg: 1062  tris avg: 9607550
  info calls avg: 1485  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=13 tris=4154
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=850
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=2 tris=979
  faunaFamily:wolf             calls=18 tris=8697
  grass                        calls=49 tris=6690564
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=37 tris=45721
  npcFamily:Peasant_Boots      calls=18 tris=24206
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=168 tris=322372
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
  settlement:storageWoodHousehold calls=2 tris=5460
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
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

[LONG FRAME] 157ms
simulate       137.0ms
render          19.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.9ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA          131.5ms
PHYSICS          0.1ms
RENDER          13.9ms
OTHER            4.2ms

Long frame #2:

[LONG FRAME] 118.3ms
simulate       101.1ms
render          16.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.8ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA           93.9ms
PHYSICS          0.1ms
RENDER          12.1ms
OTHER            5.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=14.4 ms  p95=16.6 ms  max=17.7 ms  Δavg vs baseline=—
  hide-grass           avg=15.2 ms  p95=23.1 ms  max=26.5 ms  Δavg vs baseline=+0.8 ms (+6%)
  hide-vegetation      avg=14.5 ms  p95=16.8 ms  max=17.5 ms  Δavg vs baseline=+0.1 ms (+1%)
  no vegetation/grass  avg=14.5 ms  p95=18.1 ms  max=20.2 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-environment     avg=15.0 ms  p95=17.9 ms  max=23.1 ms  Δavg vs baseline=+0.7 ms (+5%)
  hide-settlement      avg=10.1 ms  p95=12.4 ms  max=16.8 ms  Δavg vs baseline=-4.3 ms (-30%)
  no water             avg=15.1 ms  p95=17.4 ms  max=18.0 ms  Δavg vs baseline=+0.7 ms (+5%)
  hide-terrain         avg=14.1 ms  p95=16.0 ms  max=16.7 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-npc-fauna       avg=9.3 ms  p95=11.3 ms  max=11.7 ms  Δavg vs baseline=-5.1 ms (-35%)
  no-shadows           avg=10.8 ms  p95=15.0 ms  max=20.1 ms  Δavg vs baseline=-3.6 ms (-25%)
  no-ao                avg=12.9 ms  p95=14.1 ms  max=19.8 ms  Δavg vs baseline=-1.4 ms (-10%)
  no-bloom             avg=13.3 ms  p95=15.1 ms  max=15.7 ms  Δavg vs baseline=-1.1 ms (-7%)
  no-smaa              avg=13.4 ms  p95=14.9 ms  max=18.8 ms  Δavg vs baseline=-0.9 ms (-7%)
  no-god-rays          avg=13.2 ms  p95=14.9 ms  max=15.2 ms  Δavg vs baseline=-1.1 ms (-8%)
  no-film-grade        avg=13.0 ms  p95=15.9 ms  max=17.8 ms  Δavg vs baseline=-1.4 ms (-10%)
  no postprocessing    avg=13.2 ms  p95=17.7 ms  max=19.6 ms  Δavg vs baseline=-1.1 ms (-8%)
  no mirrors           avg=13.3 ms  p95=15.2 ms  max=15.6 ms  Δavg vs baseline=-1.1 ms (-7%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=22.5 ms  p95=23.3 ms  max=23.9 ms
  CPU wall      avg=14.4 ms  p95=16.6 ms  max=17.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
