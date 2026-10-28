# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T17:22:26.391Z
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
Frames: 1363
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 36e99ef6c31000b683619916b4d19a210408760e
  runId: 2026-10-28T17-21-26-090Z-qjqysr
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
  populationGate: stable waited=5215ms npc=20
  gpuTimer: available=true resolved=true samples=1371 span=postprocess+labels

FPS:
  avg: 51.7
  min: 8
  p1: 24

Frame time (wall-clock):
  avg: 19.3 ms
  p50: 18.5 ms
  p95: 24.5 ms
  p99: 42.2 ms
  max: 131.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.4 p95=4.9 p99=27.8 max=110.9 n=1363
  render: p50=14.8 p95=20.3 p99=21.2 max=39.7 n=1363
  frame: p50=18.5 p95=24.5 p99=42.2 max=131.4 n=1363

Rendering (combined renderer.info):
  draw calls: 1815 avg / 2174 max
  triangles: 12.53M avg
  mirror draws: 336 avg
  geometries: 581
  textures: 517

Pass submissions (actual):
  reliability: observed
  frames: 1372 shadowRefresh=1372 shadowSkipped=0
  mirror calls avg: 336
  shadow calls avg: 424
  main calls avg: 1055

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
  other            draws=233 tris=26.1k meshes=233 inst=233

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=422 tris=488.6k meshes=422 inst=972
  npc              draws=16 tris=22.9k meshes=16 inst=16
  fauna            draws=14 tris=4.6k meshes=14 inst=14
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=107 tris=14.7k meshes=107 inst=107

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
      mid  agents=2 camera-relevant=1 draws=12 tris=4.0k
      far  agents=49 camera-relevant=21 draws=198 tris=83.7k

Systems:
  WATER          2.7 ms
  NPC            1.4 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         12.5 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=13.0 ms draws=1813 tris=12.53M
  hide-grass         render=13.1 ms draws=1764 tris=5.84M
  hide-vegetation    render=11.7 ms draws=1772 tris=12.37M
  hide-vegetation-grass render=12.7 ms draws=1728 tris=5.68M
  hide-environment   render=12.8 ms draws=1733 tris=12.53M
  hide-settlement    render=9.1 ms draws=745 tris=11.28M
  hide-water         render=13.4 ms draws=1821 tris=12.31M
  hide-terrain       render=13.0 ms draws=1772 tris=8.60M
  hide-npc-fauna     render=7.5 ms draws=1576 tris=12.31M
  no-shadows         render=8.0 ms draws=1383 tris=10.40M
  no-ao              render=10.7 ms draws=1795 tris=12.48M
  no-bloom           render=10.2 ms draws=1807 tris=12.54M
  no-smaa            render=10.2 ms draws=1807 tris=12.53M
  no-god-rays        render=10.2 ms draws=1802 tris=12.53M
  no-film-grade      render=10.0 ms draws=1800 tris=12.53M
  no-postprocessing  render=11.1 ms draws=1776 tris=12.53M
  no-reflections     render=10.7 ms draws=1466 tris=11.62M

Frame attribution:
  frame max: 131.4 ms
  largest labelled hitch: 0 ms
  unattributed: 131.4 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 131.4 ms

Raw sidecar:
  sampling=full factor=1 exported=1363/1363

Recommendation:
Largest frame (131.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (7.9 ms cumulative)
  agent updates: 0.9 ms/frame (1244.5 ms cumulative)
  livestock: 0.3 ms/frame (445.1 ms cumulative)
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
      other update: 0.1 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.0/frame (1.0 rat candidates/frame)
    nearest scans: 5.7/frame (0.0 candidates/frame)
    water samples: 11.0/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 11.0/frame, 0.00 ms/frame (worst call 0.10 ms, 617.6 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 18.9
    behaviour executions/frame: 5.9
    presentation executions/frame: 5.4
  rats: 0.1 ms/frame (102.9 ms cumulative)
  social: 0.0 ms/frame (3.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (141.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.4 ms/frame (1854.2 ms cumulative)
  forest sampling: 0.1 ms/frame (103.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.2 ms cumulative)
    targeting: 0.0 ms/frame (19.4 ms cumulative)
    decision: 0.0 ms/frame (16.2 ms cumulative)
    behaviour: 0.9 ms/frame (1174.8 ms cumulative)
    life/presentation: 0.3 ms/frame (400.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.9
    decision passes/frame: 29.9
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.5
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 14.5
    presentation executions/frame: 13.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.9
    village scan candidates/frame: 366.0
    player perception checks/frame: 29.9

  nearest scans: 21.1/frame (28719 calls)
  nearest candidates checked: 154.7/frame (210838 total)
  herd leader scans: 0.1/frame (192 calls)
  herd candidates checked: 4.2/frame (5760 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.3/frame (117.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 75.5/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 75.5/frame, 0.10 ms/frame (worst call 0.70 ms, 5026.7 colliders/frame)

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
Frames: 1372
Shadow refresh frames: 1372
Shadow skipped frames: 0

Mirror:
  calls avg: 336  tris avg: 910507
  info calls avg: 336  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=86 tris=162506
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
  calls avg: 424  tris avg: 2020445
  info calls avg: 424  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=1 tris=21
  faunaFamily:fox              calls=7 tris=3435
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Knight_Cloth       calls=0 tris=28
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
  calls avg: 1055  tris avg: 9602967
  info calls avg: 1479  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=7 tris=2031
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=3 tris=1799
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=0 tris=149
  faunaFamily:wolf             calls=19 tris=9102
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
  settlement:decor             calls=167 tris=319388
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
Long frames: 3
Shown: 3 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 3 shown, 3 total):

[LONG FRAME] 131.4ms
simulate       110.9ms
render          20.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.1ms
STREAMING        0.0ms
NPC              1.6ms
FAUNA          108.2ms
PHYSICS          0.0ms
RENDER          14.1ms
OTHER            1.4ms

Long frame #2:

[LONG FRAME] 123.5ms
simulate       103.5ms
render          19.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.7ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA          100.3ms
PHYSICS          0.1ms
RENDER          14.1ms
OTHER            1.5ms

Long frame #3:

[LONG FRAME] 95.4ms
simulate        79.0ms
render          16.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.4ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA           76.6ms
PHYSICS          0.1ms
RENDER          11.8ms
OTHER            1.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=13.0 ms  p95=13.9 ms  max=14.4 ms  Δavg vs baseline=—
  hide-grass           avg=13.1 ms  p95=14.1 ms  max=14.3 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-vegetation      avg=11.7 ms  p95=13.6 ms  max=13.8 ms  Δavg vs baseline=-1.3 ms (-10%)
  no vegetation/grass  avg=12.7 ms  p95=14.2 ms  max=17.9 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-environment     avg=12.8 ms  p95=13.8 ms  max=14.6 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-settlement      avg=9.1 ms  p95=10.8 ms  max=11.1 ms  Δavg vs baseline=-3.9 ms (-30%)
  no water             avg=13.4 ms  p95=14.7 ms  max=15.1 ms  Δavg vs baseline=+0.4 ms (+3%)
  hide-terrain         avg=13.0 ms  p95=13.8 ms  max=14.3 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-npc-fauna       avg=7.5 ms  p95=9.0 ms  max=9.4 ms  Δavg vs baseline=-5.5 ms (-42%)
  no-shadows           avg=8.0 ms  p95=9.9 ms  max=10.4 ms  Δavg vs baseline=-5.0 ms (-38%)
  no-ao                avg=10.7 ms  p95=11.7 ms  max=12.8 ms  Δavg vs baseline=-2.3 ms (-18%)
  no-bloom             avg=10.2 ms  p95=11.5 ms  max=12.6 ms  Δavg vs baseline=-2.8 ms (-21%)
  no-smaa              avg=10.2 ms  p95=11.5 ms  max=11.9 ms  Δavg vs baseline=-2.8 ms (-22%)
  no-god-rays          avg=10.2 ms  p95=11.2 ms  max=11.7 ms  Δavg vs baseline=-2.8 ms (-21%)
  no-film-grade        avg=10.0 ms  p95=10.9 ms  max=11.0 ms  Δavg vs baseline=-3.0 ms (-23%)
  no postprocessing    avg=11.1 ms  p95=12.6 ms  max=13.2 ms  Δavg vs baseline=-1.9 ms (-14%)
  no mirrors           avg=10.7 ms  p95=12.2 ms  max=13.3 ms  Δavg vs baseline=-2.3 ms (-18%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=19.9 ms  p95=20.6 ms  max=20.7 ms
  CPU wall      avg=13.0 ms  p95=13.9 ms  max=14.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
