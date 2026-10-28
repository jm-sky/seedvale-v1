# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T15:42:26.634Z
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
Frames: 1049
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: ccc4d3783a9d069d308a635a8e47179f6645cb17
  runId: 2026-10-28T15-41-21-653Z-lpv8oh
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
  populationGate: stable waited=5165ms npc=20
  gpuTimer: available=true resolved=true samples=1056 span=postprocess+labels

FPS:
  avg: 36.4
  min: 11
  p1: 23

Frame time (wall-clock):
  avg: 27.5 ms
  p50: 27.5 ms
  p95: 32.4 ms
  p99: 43 ms
  max: 93.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.6 p95=8.3 p99=10.9 max=71.3 n=1049
  render: p50=20.6 p95=25 p99=28.1 max=54.1 n=1049
  frame: p50=27.5 p95=32.4 p99=43 max=93.6 n=1049

Rendering (combined renderer.info):
  draw calls: 1823 avg / 2179 max
  triangles: 12.54M avg
  mirror draws: 335 avg
  geometries: 577
  textures: 498

Pass submissions (actual):
  reliability: observed
  frames: 1057 shadowRefresh=1057 shadowSkipped=0
  mirror calls avg: 335
  shadow calls avg: 425
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
  items            draws=164 tris=16.0k meshes=164 inst=164
  other            draws=232 tris=26.0k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=422 tris=488.6k meshes=422 inst=972
  npc              draws=16 tris=22.9k meshes=16 inst=16
  fauna            draws=18 tris=6.5k meshes=18 inst=18
  items            draws=21 tris=12.6k meshes=21 inst=21
  other            draws=106 tris=14.6k meshes=106 inst=106

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
      near agents=2 camera-relevant=2 draws=16 tris=22.9k
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
      near agents=1 camera-relevant=1 draws=2 tris=610
      mid  agents=3 camera-relevant=1 draws=16 tris=5.9k
      far  agents=48 camera-relevant=19 draws=194 tris=81.8k

Systems:
  WATER          3.4 ms
  NPC            1.7 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         16.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=15.8 ms draws=1809 tris=12.53M
  hide-grass         render=14.4 ms draws=1759 tris=5.84M
  hide-vegetation    render=14.7 ms draws=1760 tris=12.36M
  hide-vegetation-grass render=14.3 ms draws=1713 tris=5.67M
  hide-environment   render=15.5 ms draws=1720 tris=12.52M
  hide-settlement    render=11.9 ms draws=736 tris=11.31M
  hide-water         render=15.7 ms draws=1809 tris=12.30M
  hide-terrain       render=15.1 ms draws=1759 tris=8.59M
  hide-npc-fauna     render=8.7 ms draws=1580 tris=12.31M
  no-shadows         render=10.3 ms draws=1417 tris=10.51M
  no-ao              render=12.9 ms draws=1813 tris=12.52M
  no-bloom           render=12.3 ms draws=1807 tris=12.52M
  no-smaa            render=12.1 ms draws=1817 tris=12.52M
  no-god-rays        render=15.6 ms draws=1823 tris=12.53M
  no-film-grade      render=16.0 ms draws=1817 tris=12.53M
  no-postprocessing  render=13.8 ms draws=1783 tris=12.52M
  no-reflections     render=14.0 ms draws=1471 tris=11.61M

Frame attribution:
  frame max: 93.6 ms
  largest labelled hitch: 0 ms
  unattributed: 93.6 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 93.6 ms

Raw sidecar:
  sampling=full factor=1 exported=1049/1049

Recommendation:
Largest frame (93.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.7 ms/frame
  crowd pass: 0.0 ms/frame (7.5 ms cumulative)
  agent updates: 1.0 ms/frame (1086.1 ms cumulative)
  livestock: 0.4 ms/frame (435.8 ms cumulative)
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
    pest scans: 1.2/frame (1.2 rat candidates/frame)
    nearest scans: 6.7/frame (0.0 candidates/frame)
    water samples: 12.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 12.1/frame, 0.00 ms/frame (worst call 0.10 ms, 728.0 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 6.7
    presentation executions/frame: 6.6
  rats: 0.1 ms/frame (107.4 ms cumulative)
  social: 0.0 ms/frame (3.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (118.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (1363.4 ms cumulative)
  forest sampling: 0.1 ms/frame (90.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (20.6 ms cumulative)
    targeting: 0.0 ms/frame (18.0 ms cumulative)
    decision: 0.0 ms/frame (18.0 ms cumulative)
    behaviour: 0.7 ms/frame (768.7 ms cumulative)
    life/presentation: 0.3 ms/frame (348.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.1
    expensive behaviour agents/frame: 16.3
    full-rate agents/frame: 8.0
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 16.3
    presentation executions/frame: 14.9

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.1
    village scan candidates/frame: 368.5
    player perception checks/frame: 30.1

  nearest scans: 23.0/frame (24163 calls)
  nearest candidates checked: 170.5/frame (178905 total)
  herd leader scans: 0.1/frame (139 calls)
  herd candidates checked: 4.0/frame (4170 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.5/frame (150.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 29.3/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 29.3/frame, 0.00 ms/frame (worst call 0.90 ms, 1780.9 colliders/frame)

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
Frames: 1057
Shadow refresh frames: 1057
Shadow skipped frames: 0

Mirror:
  calls avg: 335  tris avg: 909762
  info calls avg: 335  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10523
  settlement:decor             calls=85 tris=161054
  settlement:fence             calls=2 tris=3235
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=32 tris=2186
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=895
  settlement:houseInteractive  calls=11 tris=1156
  settlement:houseStatic       calls=25 tris=18434
  settlement:landmarkGarden    calls=6 tris=52664
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1872
  settlement:landmarkWellHousehold calls=5 tris=3744
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=9 tris=162
  settlement:storageBarrel     calls=6 tris=7619
  settlement:storageContainer  calls=22 tris=1345
  settlement:storageGoods      calls=29 tris=5980
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=801
  settlement:storageWoodHousehold calls=1 tris=2733
  settlement:storageWoodSettlementPrimary calls=1 tris=781
  settlement:workplace         calls=8 tris=4507
  terrain                      calls=9 tris=627005
  vegetation                   calls=2 tris=677

Shadow (refresh only):
  calls avg: 425  tris avg: 2023009
  info calls avg: 425  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=8 tris=3589
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=2458
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=66 tris=13555
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
  calls avg: 1062  tris avg: 9607177
  info calls avg: 1487  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=14 tris=4369
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=490
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=0 tris=91
  faunaFamily:wolf             calls=19 tris=9356
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

[LONG FRAME] 93.6ms
simulate        71.3ms
render          22.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.9ms
STREAMING        0.0ms
NPC              1.3ms
FAUNA           65.8ms
PHYSICS          0.1ms
RENDER          15.4ms
OTHER            4.1ms

Long frame #2:

[LONG FRAME] 81.3ms
simulate        56.9ms
render          24.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.4ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA           51.1ms
PHYSICS          0.0ms
RENDER          17.8ms
OTHER            4.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=15.8 ms  p95=17.9 ms  max=18.3 ms  Δavg vs baseline=—
  hide-grass           avg=14.4 ms  p95=15.0 ms  max=18.7 ms  Δavg vs baseline=-1.4 ms (-9%)
  hide-vegetation      avg=14.7 ms  p95=15.9 ms  max=16.1 ms  Δavg vs baseline=-1.1 ms (-7%)
  no vegetation/grass  avg=14.3 ms  p95=15.0 ms  max=15.1 ms  Δavg vs baseline=-1.5 ms (-10%)
  hide-environment     avg=15.5 ms  p95=17.3 ms  max=26.1 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-settlement      avg=11.9 ms  p95=14.2 ms  max=16.3 ms  Δavg vs baseline=-3.9 ms (-25%)
  no water             avg=15.7 ms  p95=17.4 ms  max=18.3 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-terrain         avg=15.1 ms  p95=16.0 ms  max=16.2 ms  Δavg vs baseline=-0.8 ms (-5%)
  hide-npc-fauna       avg=8.7 ms  p95=9.9 ms  max=10.4 ms  Δavg vs baseline=-7.2 ms (-45%)
  no-shadows           avg=10.3 ms  p95=12.5 ms  max=13.0 ms  Δavg vs baseline=-5.6 ms (-35%)
  no-ao                avg=12.9 ms  p95=15.1 ms  max=15.4 ms  Δavg vs baseline=-2.9 ms (-19%)
  no-bloom             avg=12.3 ms  p95=14.2 ms  max=15.8 ms  Δavg vs baseline=-3.5 ms (-22%)
  no-smaa              avg=12.1 ms  p95=13.0 ms  max=13.3 ms  Δavg vs baseline=-3.7 ms (-23%)
  no-god-rays          avg=15.6 ms  p95=16.8 ms  max=17.4 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-film-grade        avg=16.0 ms  p95=17.8 ms  max=18.4 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=13.8 ms  p95=15.4 ms  max=15.6 ms  Δavg vs baseline=-2.0 ms (-13%)
  no mirrors           avg=14.0 ms  p95=17.8 ms  max=25.5 ms  Δavg vs baseline=-1.9 ms (-12%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=24.1 ms  p95=25.4 ms  max=25.9 ms
  CPU wall      avg=15.8 ms  p95=17.9 ms  max=18.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
