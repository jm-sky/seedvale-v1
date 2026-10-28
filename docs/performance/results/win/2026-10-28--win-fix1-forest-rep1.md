# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T17:16:42.390Z
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
Frames: 1396
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 36e99ef6c31000b683619916b4d19a210408760e
  runId: 2026-10-28T17-15-42-295Z-ef85jk
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
  populationGate: stable waited=5035ms npc=20
  gpuTimer: available=true resolved=true samples=1400 span=postprocess+labels

FPS:
  avg: 58.8
  min: 11
  p1: 36

Frame time (wall-clock):
  avg: 17 ms
  p50: 17.3 ms
  p95: 20.6 ms
  p99: 27.9 ms
  max: 90.9 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3 p95=4.5 p99=9.3 max=72.8 n=1396
  render: p50=13.6 p95=16.7 p99=19.6 max=25.6 n=1396
  frame: p50=17.3 p95=20.6 p99=27.9 max=90.9 n=1396

Rendering (combined renderer.info):
  draw calls: 1818 avg / 2189 max
  triangles: 12.53M avg
  mirror draws: 335 avg
  geometries: 577
  textures: 493

Pass submissions (actual):
  reliability: observed
  frames: 1406 shadowRefresh=1406 shadowSkipped=0
  mirror calls avg: 335
  shadow calls avg: 424
  main calls avg: 1059

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
  fauna            draws=16 tris=8.6k meshes=16 inst=16
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
      mid  agents=3 camera-relevant=2 draws=14 tris=8.0k
      far  agents=48 camera-relevant=16 draws=196 tris=79.7k

Systems:
  WATER          2.6 ms
  NPC            1.3 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         10.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=10.0 ms draws=1808 tris=12.53M
  hide-grass         render=10.0 ms draws=1759 tris=5.84M
  hide-vegetation    render=9.6 ms draws=1763 tris=12.37M
  hide-vegetation-grass render=9.6 ms draws=1688 tris=5.61M
  hide-environment   render=10.0 ms draws=1718 tris=12.53M
  hide-settlement    render=7.8 ms draws=728 tris=11.27M
  hide-water         render=10.4 ms draws=1805 tris=12.31M
  hide-terrain       render=11.5 ms draws=1755 tris=8.59M
  hide-npc-fauna     render=8.3 ms draws=1576 tris=12.31M
  no-shadows         render=9.5 ms draws=1394 tris=10.45M
  no-ao              render=10.8 ms draws=1787 tris=12.48M
  no-bloom           render=10.2 ms draws=1807 tris=12.53M
  no-smaa            render=10.6 ms draws=1797 tris=12.47M
  no-god-rays        render=10.7 ms draws=1829 tris=12.53M
  no-film-grade      render=10.6 ms draws=1835 tris=12.53M
  no-postprocessing  render=11.3 ms draws=1811 tris=12.53M
  no-reflections     render=10.9 ms draws=1498 tris=11.62M

Frame attribution:
  frame max: 90.9 ms
  largest labelled hitch: 0 ms
  unattributed: 90.9 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 90.9 ms

Raw sidecar:
  sampling=full factor=1 exported=1396/1396

Recommendation:
Largest frame (90.9 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.3 ms/frame
  crowd pass: 0.0 ms/frame (8.5 ms cumulative)
  agent updates: 0.8 ms/frame (1104.8 ms cumulative)
  livestock: 0.3 ms/frame (421.7 ms cumulative)
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
    nearest scans: 5.7/frame (0.0 candidates/frame)
    water samples: 12.9/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 12.9/frame, 0.00 ms/frame (worst call 0.70 ms, 809.4 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 19.0
    behaviour executions/frame: 5.7
    presentation executions/frame: 5.3
  rats: 0.1 ms/frame (100.3 ms cumulative)
  social: 0.0 ms/frame (3.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (142.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.0 ms/frame (1458.5 ms cumulative)
  forest sampling: 0.1 ms/frame (99.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (23.8 ms cumulative)
    targeting: 0.0 ms/frame (19.5 ms cumulative)
    decision: 0.0 ms/frame (13.0 ms cumulative)
    behaviour: 0.5 ms/frame (748.7 ms cumulative)
    life/presentation: 0.3 ms/frame (443.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.8
    decision passes/frame: 29.8
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.9
    full-rate agents/frame: 8.4
    reduced-cadence agents/frame: 21.4
    behaviour executions/frame: 14.9
    presentation executions/frame: 13.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.8
    village scan candidates/frame: 367.5
    player perception checks/frame: 29.8

  nearest scans: 21.4/frame (29829 calls)
  nearest candidates checked: 156.6/frame (218665 total)
  herd leader scans: 0.1/frame (175 calls)
  herd candidates checked: 3.8/frame (5250 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.0/frame (125.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 55.5/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 55.5/frame, 0.00 ms/frame (worst call 1.40 ms, 3658.1 colliders/frame)

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
Frames: 1406
Shadow refresh frames: 1406
Shadow skipped frames: 0

Mirror:
  calls avg: 335  tris avg: 909099
  info calls avg: 335  residual calls avg: 0
  environment                  calls=0 tris=433
  other                        calls=51 tris=10499
  settlement:decor             calls=85 tris=162163
  settlement:fence             calls=2 tris=3227
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=31 tris=2181
  settlement:fireHouseInteriorLamp calls=3 tris=377
  settlement:fireVillageTorch  calls=12 tris=893
  settlement:houseInteractive  calls=10 tris=1153
  settlement:houseStatic       calls=25 tris=18391
  settlement:landmarkGarden    calls=6 tris=52539
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1867
  settlement:landmarkWellHousehold calls=5 tris=3735
  settlement:landmarkWellPasture calls=2 tris=934
  settlement:other             calls=8 tris=162
  settlement:storageBarrel     calls=6 tris=7601
  settlement:storageContainer  calls=21 tris=1342
  settlement:storageGoods      calls=29 tris=5966
  settlement:storageHay        calls=1 tris=487
  settlement:storageTrough     calls=3 tris=799
  settlement:storageWoodHousehold calls=1 tris=2726
  settlement:storageWoodSettlementPrimary calls=1 tris=779
  settlement:workplace         calls=8 tris=4497
  terrain                      calls=8 tris=625521
  vegetation                   calls=2 tris=675

Shadow (refresh only):
  calls avg: 424  tris avg: 2021029
  info calls avg: 424  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=0 tris=2
  faunaFamily:fox              calls=7 tris=3449
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=0 tris=327
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:Wizard             calls=0 tris=279
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=66 tris=13565
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
  calls avg: 1059  tris avg: 9603697
  info calls avg: 1483  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=12 tris=3472
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=2 tris=1180
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=0 tris=33
  faunaFamily:wolf             calls=19 tris=9125
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 90.9ms
simulate        72.8ms
render          17.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.2ms
STREAMING        0.0ms
NPC              1.1ms
FAUNA           70.5ms
PHYSICS          0.0ms
RENDER          12.6ms
OTHER            1.5ms

Long frame #2:

[LONG FRAME] 89.2ms
simulate        70.6ms
render          17.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.0ms
STREAMING        0.0ms
NPC              1.2ms
FAUNA           68.3ms
PHYSICS          0.0ms
RENDER          12.9ms
OTHER            1.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=10.0 ms  p95=11.2 ms  max=11.8 ms  Δavg vs baseline=—
  hide-grass           avg=10.0 ms  p95=11.7 ms  max=12.4 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=9.6 ms  p95=10.5 ms  max=10.8 ms  Δavg vs baseline=-0.4 ms (-4%)
  no vegetation/grass  avg=9.6 ms  p95=11.8 ms  max=12.2 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-environment     avg=10.0 ms  p95=11.7 ms  max=11.8 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-settlement      avg=7.8 ms  p95=8.9 ms  max=10.6 ms  Δavg vs baseline=-2.2 ms (-22%)
  no water             avg=10.4 ms  p95=11.7 ms  max=12.4 ms  Δavg vs baseline=+0.4 ms (+4%)
  hide-terrain         avg=11.5 ms  p95=12.7 ms  max=13.6 ms  Δavg vs baseline=+1.5 ms (+15%)
  hide-npc-fauna       avg=8.3 ms  p95=9.3 ms  max=9.9 ms  Δavg vs baseline=-1.7 ms (-17%)
  no-shadows           avg=9.5 ms  p95=11.5 ms  max=12.5 ms  Δavg vs baseline=-0.5 ms (-5%)
  no-ao                avg=10.8 ms  p95=13.5 ms  max=15.5 ms  Δavg vs baseline=+0.7 ms (+7%)
  no-bloom             avg=10.2 ms  p95=11.1 ms  max=11.3 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-smaa              avg=10.6 ms  p95=11.8 ms  max=12.4 ms  Δavg vs baseline=+0.6 ms (+6%)
  no-god-rays          avg=10.7 ms  p95=12.4 ms  max=13.0 ms  Δavg vs baseline=+0.7 ms (+7%)
  no-film-grade        avg=10.6 ms  p95=11.8 ms  max=12.3 ms  Δavg vs baseline=+0.6 ms (+6%)
  no postprocessing    avg=11.3 ms  p95=12.9 ms  max=15.4 ms  Δavg vs baseline=+1.3 ms (+13%)
  no mirrors           avg=10.9 ms  p95=12.4 ms  max=12.9 ms  Δavg vs baseline=+0.9 ms (+9%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=19.9 ms  p95=20.4 ms  max=20.5 ms
  CPU wall      avg=10.0 ms  p95=11.2 ms  max=11.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
