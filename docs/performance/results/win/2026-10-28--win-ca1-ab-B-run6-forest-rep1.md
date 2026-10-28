# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T22:24:46.262Z
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
Frames: 1398
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: bc9a68d1b3ca6384817625092bda24be4ed013f4
  runId: 2026-10-28T22-23-45-258Z-atc0lg
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
  populationGate: stable waited=5168ms npc=20
  gpuTimer: available=true resolved=true samples=1407 span=postprocess+labels

FPS:
  avg: 56.7
  min: 9
  p1: 39

Frame time (wall-clock):
  avg: 17.6 ms
  p50: 18 ms
  p95: 23.3 ms
  p99: 25.9 ms
  max: 114.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3 p95=4.4 p99=6.5 max=99.9 n=1398
  render: p50=14.5 p95=19.2 p99=20.7 max=33.4 n=1398
  frame: p50=18 p95=23.3 p99=25.9 max=114.7 n=1398

Rendering (combined renderer.info):
  draw calls: 1743 avg / 2091 max
  triangles: 12.53M avg
  mirror draws: 314 avg
  geometries: 564
  textures: 502

Pass submissions (actual):
  reliability: observed
  frames: 1408 shadowRefresh=1408 shadowSkipped=0
  mirror calls avg: 314
  shadow calls avg: 422
  main calls avg: 1007

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.47M meshes=72 inst=563579
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=642 tris=687.3k meshes=642 inst=1247
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=184 tris=238.1k meshes=184 inst=184
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=232 tris=26.0k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=422 tris=488.6k meshes=422 inst=972
  npc              draws=16 tris=23.0k meshes=16 inst=16
  fauna            draws=14 tris=4.6k meshes=14 inst=14
  items            draws=23 tris=14.4k meshes=23 inst=23
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

Systems:
  WATER          2.7 ms
  NPC            1.3 ms
  FAUNA          1.0 ms
  PHYSICS        0.1 ms
  RENDER         11.3 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=13.5 ms draws=1737 tris=12.53M
  hide-grass         render=13.5 ms draws=1686 tris=5.83M
  hide-vegetation    render=13.0 ms draws=1684 tris=12.36M
  hide-vegetation-grass render=12.8 ms draws=1636 tris=5.66M
  hide-environment   render=13.1 ms draws=1638 tris=12.51M
  hide-settlement    render=9.2 ms draws=716 tris=11.31M
  hide-water         render=12.9 ms draws=1724 tris=12.30M
  hide-terrain       render=13.2 ms draws=1673 tris=8.58M
  hide-npc-fauna     render=8.7 ms draws=1515 tris=12.30M
  no-shadows         render=8.1 ms draws=1291 tris=10.38M
  no-ao              render=11.4 ms draws=1715 tris=12.46M
  no-bloom           render=10.0 ms draws=1729 tris=12.52M
  no-smaa            render=10.3 ms draws=1739 tris=12.52M
  no-god-rays        render=10.2 ms draws=1744 tris=12.52M
  no-film-grade      render=10.4 ms draws=1751 tris=12.52M
  no-postprocessing  render=10.9 ms draws=1722 tris=12.52M
  no-reflections     render=11.0 ms draws=1432 tris=11.62M

Frame attribution:
  frame max: 114.7 ms
  largest labelled hitch: 0 ms
  unattributed: 114.7 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 114.7 ms

Raw sidecar:
  sampling=full factor=1 exported=1398/1398

Recommendation:
Largest frame (114.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (9.5 ms cumulative)
  agent updates: 0.8 ms/frame (1177.3 ms cumulative)
  livestock: 0.3 ms/frame (423.8 ms cumulative)
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
    pest scans: 0.8/frame (0.8 rat candidates/frame)
    nearest scans: 5.6/frame (0.0 candidates/frame)
    water samples: 11.3/frame, 0.00 ms/frame (worst call 0.80 ms)
    collider queries: 11.3/frame, 0.00 ms/frame (worst call 0.30 ms, 649.9 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 5.6
    presentation executions/frame: 5.3
  rats: 0.1 ms/frame (100.7 ms cumulative)
  social: 0.0 ms/frame (5.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (140.4 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.0 ms/frame
  agent updates: 1.0 ms/frame (1341.7 ms cumulative)
  forest sampling: 0.1 ms/frame (105.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (19.0 ms cumulative)
    targeting: 0.0 ms/frame (16.9 ms cumulative)
    decision: 0.0 ms/frame (10.9 ms cumulative)
    behaviour: 0.5 ms/frame (757.1 ms cumulative)
    life/presentation: 0.2 ms/frame (338.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 13.6
    full-rate agents/frame: 6.7
    reduced-cadence agents/frame: 23.4
    behaviour executions/frame: 13.6
    presentation executions/frame: 12.3

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.1
    village scan candidates/frame: 368.2
    player perception checks/frame: 30.1

  nearest scans: 19.7/frame (27530 calls)
  nearest candidates checked: 149.6/frame (209198 total)
  herd leader scans: 0.1/frame (175 calls)
  herd candidates checked: 3.8/frame (5250 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 17.0/frame (92.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 61.6/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 61.6/frame, 0.00 ms/frame (worst call 1.00 ms, 4032.9 colliders/frame)

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
Frames: 1408
Shadow refresh frames: 1408
Shadow skipped frames: 0

Mirror:
  calls avg: 314  tris avg: 907223
  info calls avg: 314  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=85 tris=160902
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
  calls avg: 422  tris avg: 2020816
  info calls avg: 422  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=0 tris=1
  faunaFamily:fox              calls=5 tris=2297
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=1 tris=1115
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant            calls=0 tris=344
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
  calls avg: 1007  tris avg: 9605566
  info calls avg: 1429  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=5 tris=1503
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=3 tris=1861
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=0 tris=251
  faunaFamily:wolf             calls=19 tris=9490
  grass                        calls=49 tris=6697644
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=57 tris=69015
  npcFamily:Peasant_Boots      calls=18 tris=24430
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=166 tris=318524
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
Long frames: 3
Shown: 3 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 3 shown, 3 total):

[LONG FRAME] 114.7ms
simulate        99.9ms
render          14.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA           97.4ms
PHYSICS          0.1ms
RENDER          14.5ms
OTHER            1.4ms

Long frame #2:

[LONG FRAME] 90.7ms
simulate        73.9ms
render          16.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.2ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA           71.7ms
PHYSICS          0.1ms
RENDER          11.5ms
OTHER            1.0ms

Long frame #3:

[LONG FRAME] 86.6ms
simulate        70.0ms
render          16.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.5ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA           67.6ms
PHYSICS          0.1ms
RENDER          11.8ms
OTHER            1.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=13.5 ms  p95=14.0 ms  max=15.8 ms  Δavg vs baseline=—
  hide-grass           avg=13.5 ms  p95=14.1 ms  max=14.5 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-vegetation      avg=13.0 ms  p95=13.9 ms  max=14.5 ms  Δavg vs baseline=-0.5 ms (-4%)
  no vegetation/grass  avg=12.8 ms  p95=15.3 ms  max=16.4 ms  Δavg vs baseline=-0.7 ms (-5%)
  hide-environment     avg=13.1 ms  p95=14.0 ms  max=17.2 ms  Δavg vs baseline=-0.4 ms (-3%)
  hide-settlement      avg=9.2 ms  p95=9.9 ms  max=10.1 ms  Δavg vs baseline=-4.3 ms (-32%)
  no water             avg=12.9 ms  p95=13.9 ms  max=14.6 ms  Δavg vs baseline=-0.6 ms (-4%)
  hide-terrain         avg=13.2 ms  p95=15.1 ms  max=15.5 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-npc-fauna       avg=8.7 ms  p95=9.3 ms  max=9.7 ms  Δavg vs baseline=-4.7 ms (-35%)
  no-shadows           avg=8.1 ms  p95=9.6 ms  max=10.5 ms  Δavg vs baseline=-5.4 ms (-40%)
  no-ao                avg=11.4 ms  p95=12.5 ms  max=13.7 ms  Δavg vs baseline=-2.1 ms (-15%)
  no-bloom             avg=10.0 ms  p95=11.3 ms  max=11.6 ms  Δavg vs baseline=-3.5 ms (-26%)
  no-smaa              avg=10.3 ms  p95=12.3 ms  max=12.9 ms  Δavg vs baseline=-3.2 ms (-24%)
  no-god-rays          avg=10.2 ms  p95=11.3 ms  max=11.7 ms  Δavg vs baseline=-3.2 ms (-24%)
  no-film-grade        avg=10.4 ms  p95=11.6 ms  max=13.3 ms  Δavg vs baseline=-3.1 ms (-23%)
  no postprocessing    avg=10.9 ms  p95=12.1 ms  max=12.6 ms  Δavg vs baseline=-2.6 ms (-19%)
  no mirrors           avg=11.0 ms  p95=11.6 ms  max=12.3 ms  Δavg vs baseline=-2.5 ms (-19%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (36 samples resolved during the baseline window)
  GPU elapsed   avg=19.8 ms  p95=20.4 ms  max=22.1 ms
  CPU wall      avg=13.5 ms  p95=14.0 ms  max=15.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
