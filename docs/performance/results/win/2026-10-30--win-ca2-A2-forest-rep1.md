# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T07:28:58.910Z
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
Frames: 1157
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: d2b14bf7cbf380131bfa43bc2bd685af918f30e5
  runId: 2026-10-30T07-27-55-862Z-5skjo2
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
  populationGate: stable waited=5013ms npc=20
  gpuTimer: available=true resolved=true samples=1161 span=postprocess+labels

FPS:
  avg: 41.7
  min: 8
  p1: 16

Frame time (wall-clock):
  avg: 24 ms
  p50: 23.3 ms
  p95: 30.3 ms
  p99: 63.6 ms
  max: 131.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.1 p95=6.2 p99=44.3 max=115.4 n=1157
  render: p50=18.8 p95=24.3 p99=29.2 max=53.5 n=1157
  frame: p50=23.3 p95=30.3 p99=63.6 max=131.5 n=1157

Rendering (combined renderer.info):
  draw calls: 1711 avg / 2040 max
  triangles: 12.54M avg
  mirror draws: 303 avg
  geometries: 540
  textures: 503

Pass submissions (actual):
  reliability: observed
  frames: 1166 shadowRefresh=1166 shadowSkipped=0
  mirror calls avg: 303
  shadow calls avg: 422
  main calls avg: 985

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.47M meshes=72 inst=563579
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=607 tris=687.3k meshes=607 inst=1247
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=184 tris=238.1k meshes=184 inst=184
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=163 tris=16.8k meshes=163 inst=163
  other            draws=232 tris=26.0k meshes=232 inst=232

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=408 tris=488.6k meshes=408 inst=972
  npc              draws=16 tris=23.0k meshes=16 inst=16
  fauna            draws=18 tris=6.5k meshes=18 inst=18
  items            draws=22 tris=13.5k meshes=22 inst=22
  other            draws=106 tris=14.6k meshes=106 inst=106

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.8k meshes=3 inst=10
  storageContainer draws=18 tris=3.5k meshes=18 inst=46
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
      mid  agents=3 camera-relevant=1 draws=16 tris=5.9k
      far  agents=48 camera-relevant=16 draws=194 tris=81.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=122 composed=122 multiplied=122 skinned=0
  environment              nodes=252 composed=252 multiplied=252 skinned=0
  settlement               nodes=1204 composed=1204 multiplied=1204 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1563 composed=1563 multiplied=1563 skinned=184
  fauna                    nodes=2299 composed=2299 multiplied=2299 skinned=188
  items                    nodes=253 composed=253 multiplied=253 skinned=0
  other                    nodes=449 composed=432 multiplied=449 skinned=9
  top scene children:
    fauna ×52                nodes=2299 composed=2299 multiplied=2299 skinned=188
    npc ×20                  nodes=1563 composed=1563 multiplied=1563 skinned=184
    settlement ×3            nodes=1204 composed=1204 multiplied=1204 skinned=0
    Group ×42                nodes=286 composed=286 multiplied=286 skinned=9
    chunk-items ×20          nodes=253 composed=253 multiplied=253 skinned=0
    chunk-environmen ×4      nodes=207 composed=207 multiplied=207 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.7 ms
  NPC            1.9 ms
  FAUNA          1.7 ms
  PHYSICS        0.1 ms
  RENDER         16.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.0 ms draws=1697 tris=12.53M
  hide-grass         render=14.2 ms draws=1648 tris=5.84M
  hide-vegetation    render=12.9 ms draws=1656 tris=12.37M
  hide-vegetation-grass render=15.8 ms draws=1603 tris=5.67M
  hide-environment   render=14.6 ms draws=1609 tris=12.52M
  hide-settlement    render=9.9 ms draws=727 tris=11.32M
  hide-water         render=15.2 ms draws=1696 tris=12.31M
  hide-terrain       render=14.7 ms draws=1644 tris=8.59M
  hide-npc-fauna     render=9.3 ms draws=1458 tris=12.24M
  no-shadows         render=9.0 ms draws=1266 tris=10.39M
  no-ao              render=11.3 ms draws=1697 tris=12.52M
  no-bloom           render=10.3 ms draws=1671 tris=12.46M
  no-smaa            render=10.8 ms draws=1702 tris=12.52M
  no-god-rays        render=11.4 ms draws=1704 tris=12.52M
  no-film-grade      render=13.6 ms draws=1699 tris=12.52M
  no-postprocessing  render=11.6 ms draws=1681 tris=12.52M
  no-reflections     render=12.3 ms draws=1403 tris=11.62M

Frame attribution:
  frame max: 131.5 ms
  largest labelled hitch: 0 ms
  unattributed: 131.5 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 131.5 ms

Raw sidecar:
  sampling=full factor=1 exported=1157/1157

Recommendation:
Largest frame (131.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.9 ms/frame
  crowd pass: 0.0 ms/frame (12.4 ms cumulative)
  agent updates: 1.2 ms/frame (1391.4 ms cumulative)
  livestock: 0.5 ms/frame (528.0 ms cumulative)
    loaded tick: 0.5 ms/frame
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
    nearest scans: 6.4/frame (0.0 candidates/frame)
    water samples: 10.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 10.1/frame, 0.00 ms/frame (worst call 0.20 ms, 565.4 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 18.8
    behaviour executions/frame: 6.6
    presentation executions/frame: 6.1
  rats: 0.1 ms/frame (126.9 ms cumulative)
  social: 0.0 ms/frame (5.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (137.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.7 ms/frame
  agent updates: 1.7 ms/frame (1934.7 ms cumulative)
  forest sampling: 0.1 ms/frame (114.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (26.4 ms cumulative)
    targeting: 0.0 ms/frame (22.5 ms cumulative)
    decision: 0.0 ms/frame (16.8 ms cumulative)
    behaviour: 1.1 ms/frame (1239.5 ms cumulative)
    life/presentation: 0.3 ms/frame (400.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.8
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.6
    behaviour executions/frame: 14.8
    presentation executions/frame: 13.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 367.0
    player perception checks/frame: 30.2

  nearest scans: 21.6/frame (24964 calls)
  nearest candidates checked: 161.5/frame (186877 total)
  herd leader scans: 0.2/frame (188 calls)
  herd candidates checked: 4.9/frame (5640 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.9/frame (116.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 41.7/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 41.7/frame, 0.10 ms/frame (worst call 0.80 ms, 2820.0 colliders/frame)

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
Frames: 1166
Shadow refresh frames: 1166
Shadow skipped frames: 0

Mirror:
  calls avg: 303  tris avg: 911291
  info calls avg: 303  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=86 tris=164970
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
  settlement:storageContainer  calls=9 tris=1344
  settlement:storageGoods      calls=29 tris=5974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=800
  settlement:storageWoodHousehold calls=1 tris=2730
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=8 tris=4503
  terrain                      calls=9 tris=626412
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 422  tris avg: 2020814
  info calls avg: 422  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:duck             calls=0 tris=14
  faunaFamily:fox              calls=8 tris=3685
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Knight_Cloth       calls=0 tris=55
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
  settlement:storageContainer  calls=6 tris=804
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=1 tris=1560
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 985  tris avg: 9607895
  info calls avg: 1408  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=4 tris=1380
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=2 tris=1085
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=5 tris=3036
  faunaFamily:wolf             calls=18 tris=9068
  grass                        calls=49 tris=6697644
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=57 tris=69015
  npcFamily:Peasant_Boots      calls=18 tris=24430
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=167 tris=319388
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
  settlement:storageContainer  calls=18 tris=2688
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

[LONG FRAME] 131.5ms
simulate       115.4ms
render          15.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.1ms
NPC              2.1ms
FAUNA          111.4ms
PHYSICS          0.1ms
RENDER          15.8ms
OTHER            1.8ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #2:

[LONG FRAME] 110.7ms
simulate        83.2ms
render          27.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.1ms
STREAMING        0.0ms
NPC              1.7ms
FAUNA           79.5ms
PHYSICS          0.1ms
RENDER          18.3ms
OTHER            2.0ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.0 ms  p95=12.9 ms  max=14.6 ms  Δavg vs baseline=—
  hide-grass           avg=14.2 ms  p95=15.5 ms  max=25.5 ms  Δavg vs baseline=+2.2 ms (+18%)
  hide-vegetation      avg=12.9 ms  p95=14.4 ms  max=17.2 ms  Δavg vs baseline=+0.9 ms (+8%)
  no vegetation/grass  avg=15.8 ms  p95=17.8 ms  max=19.5 ms  Δavg vs baseline=+3.8 ms (+32%)
  hide-environment     avg=14.6 ms  p95=19.7 ms  max=24.4 ms  Δavg vs baseline=+2.6 ms (+22%)
  hide-settlement      avg=9.9 ms  p95=10.9 ms  max=11.5 ms  Δavg vs baseline=-2.1 ms (-18%)
  no water             avg=15.2 ms  p95=17.5 ms  max=18.4 ms  Δavg vs baseline=+3.2 ms (+27%)
  hide-terrain         avg=14.7 ms  p95=17.6 ms  max=27.9 ms  Δavg vs baseline=+2.7 ms (+23%)
  hide-npc-fauna       avg=9.3 ms  p95=11.6 ms  max=12.2 ms  Δavg vs baseline=-2.7 ms (-23%)
  no-shadows           avg=9.0 ms  p95=10.4 ms  max=11.0 ms  Δavg vs baseline=-2.9 ms (-25%)
  no-ao                avg=11.3 ms  p95=13.1 ms  max=13.5 ms  Δavg vs baseline=-0.7 ms (-6%)
  no-bloom             avg=10.3 ms  p95=12.8 ms  max=13.0 ms  Δavg vs baseline=-1.7 ms (-14%)
  no-smaa              avg=10.8 ms  p95=12.6 ms  max=13.7 ms  Δavg vs baseline=-1.2 ms (-10%)
  no-god-rays          avg=11.4 ms  p95=12.9 ms  max=14.7 ms  Δavg vs baseline=-0.6 ms (-5%)
  no-film-grade        avg=13.6 ms  p95=15.3 ms  max=16.1 ms  Δavg vs baseline=+1.6 ms (+14%)
  no postprocessing    avg=11.6 ms  p95=14.5 ms  max=15.0 ms  Δavg vs baseline=-0.3 ms (-3%)
  no mirrors           avg=12.3 ms  p95=17.2 ms  max=21.6 ms  Δavg vs baseline=+0.3 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=22.8 ms  p95=24.2 ms  max=24.7 ms
  CPU wall      avg=12.0 ms  p95=12.9 ms  max=14.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
