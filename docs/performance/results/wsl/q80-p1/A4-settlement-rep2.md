# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T16:44:05.286Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement
Duration: 30s
Frames: 336
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a25e47aa423419e56bb240801251d699bb6b8759
  runId: 2026-11-03T16-42-27-140Z-4x12fv
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
  viewport: 1600x813
  drawingBuffer: 1600x813
  camera: pos=(8.5, 7.6, 34)
  anchor: (8.5, 22.7)
  populationGate: stable waited=5042ms npc=8
  gpuTimer: available=true resolved=true samples=335 span=postprocess+labels

FPS:
  avg: 48
  min: 1
  p1: 29

Frame time (wall-clock):
  avg: 20.9 ms
  p50: 18 ms
  p95: 23.4 ms
  p99: 34 ms
  max: 808 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.9 p95=7.1 p99=19.3 max=25.1 n=336
  render: p50=13.7 p95=15.9 p99=18.3 max=802.8 n=336
  frame: p50=18 p95=23.4 p99=34 max=808 n=336

Rendering (combined renderer.info):
  draw calls: 1158 avg / 1197 max
  triangles: 10.53M avg
  mirror draws: 208 avg
  geometries: 479
  textures: 328

Pass submissions (actual):
  reliability: observed
  frames: 338 shadowRefresh=169 shadowSkipped=169
  mirror calls avg: 208
  shadow calls avg: 510
  main calls avg: 683

Scene (one-pass estimate):
  terrain          draws=49 tris=3.61M meshes=49 inst=49
  grass            draws=72 tris=6.30M meshes=72 inst=476018
  vegetation       draws=138 tris=326.1k meshes=138 inst=206
  environment      draws=37 tris=14.7k meshes=37 inst=37
  settlement       draws=388 tris=603.6k meshes=388 inst=936
  water            draws=35 tris=2.51M meshes=35 inst=35
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=161 tris=65.1k meshes=161 inst=161
  items            draws=136 tris=15.5k meshes=136 inst=136
  other            draws=217 tris=26.9k meshes=217 inst=217

Shadow casters (one-pass estimate):
  terrain          draws=49 tris=3.61M meshes=49 inst=49
  vegetation       draws=126 tris=296.3k meshes=126 inst=194
  environment      draws=37 tris=14.7k meshes=37 inst=37
  settlement       draws=290 tris=510.0k meshes=290 inst=800
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=55 tris=20.3k meshes=55 inst=55
  items            draws=20 tris=12.9k meshes=20 inst=20
  other            draws=100 tris=15.5k meshes=100 inst=100

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=33 tris=50.0k meshes=33 inst=324
  houseInteractive draws=14 tris=2.2k meshes=14 inst=14
  fence            draws=2 tris=1.2k meshes=2 inst=6
  storageWoodSettlementPrimary draws=1 tris=780 meshes=1 inst=1
  storageWoodHousehold draws=1 tris=4.7k meshes=1 inst=6
  storageContainer draws=6 tris=1.9k meshes=6 inst=26
  storageHay       draws=1 tris=488 meshes=1 inst=1
  storageTrough    draws=4 tris=1.4k meshes=4 inst=14
  workplace        draws=4 tris=3.5k meshes=4 inst=4
  landmarkWellCentral draws=5 tris=1.9k meshes=5 inst=5
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=1 tris=1.6k meshes=1 inst=2
  landmarkNoticeBoard draws=2 tris=36 meshes=2 inst=2
  fireHouseInteriorLamp draws=6 tris=648 meshes=6 inst=6
  decor            draws=198 tris=415.8k meshes=198 inst=271
  other            draws=7 tris=21.9k meshes=7 inst=113

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=2 draws=19 tris=22.0k skinned=19/19
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Ranger_NoHood    agents=1 draws=14 tris=16.3k skinned=14/14
      Knight_Cloth     agents=1 draws=9 tris=11.9k skinned=9/9
      Peasant_Boots    agents=1 draws=9 tris=12.2k skinned=9/9
      woodcutter       agents=1 draws=8 tris=10.9k skinned=8/8
    by distance band:
      mid  agents=8 camera-relevant=7 draws=77 tris=99.5k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=7 draws=28 tris=13.7k skinned=28/28
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      stag             agents=2 draws=12 tris=7.3k skinned=10/12
      boar             agents=2 draws=10 tris=4.6k skinned=10/10
      dog              agents=2 draws=10 tris=3.8k skinned=10/10
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      sheep            agents=4 draws=8 tris=2.4k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rabbit           agents=4 draws=4 tris=2.7k skinned=4/4
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rat              agents=1 draws=2 tris=4.0k skinned=2/2
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=2 camera-relevant=2 draws=10 tris=2.8k
      mid  agents=12 camera-relevant=8 draws=45 tris=17.5k
      far  agents=27 camera-relevant=14 draws=106 tris=44.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=49 composed=49 multiplied=49 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=164 composed=164 multiplied=164 skinned=0
  environment              nodes=55 composed=55 multiplied=55 skinned=0
  settlement               nodes=753 composed=753 multiplied=753 skinned=0
  water                    nodes=35 composed=35 multiplied=35 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1719 composed=1719 multiplied=1719 skinned=142
  items                    nodes=212 composed=212 multiplied=212 skinned=0
  other                    nodes=432 composed=415 multiplied=432 skinned=9
  top scene children:
    fauna ×41                nodes=1719 composed=1719 multiplied=1719 skinned=142
    settlement ×1            nodes=753 composed=753 multiplied=753 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    Group ×36                nodes=252 composed=252 multiplied=252 skinned=9
    chunk-items ×17          nodes=212 composed=212 multiplied=212 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    Root_Scene ×19           nodes=62 composed=62 multiplied=62 skinned=0
    chunk ×49                nodes=49 composed=49 multiplied=49 skinned=0
    chunk-water ×34          nodes=34 composed=34 multiplied=34 skinned=0
    Object3D ×30             nodes=30 composed=30 multiplied=30 skinned=0
    chunk-river ×27          nodes=27 composed=27 multiplied=27 skinned=0
    chunk-vegetation ×1      nodes=20 composed=20 multiplied=20 skinned=0

Systems:
  WATER          2.2 ms
  NPC            1.4 ms
  FAUNA          1.7 ms
  PHYSICS        0.1 ms
  RENDER         13.9 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. FAUNA

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=10.6 ms draws=1162 tris=10.54M
  hide-grass         render=9.8 ms draws=1109 tris=4.98M
  hide-vegetation    render=9.3 ms draws=1111 tris=10.46M
  hide-vegetation-grass render=9.2 ms draws=1069 tris=4.91M
  hide-environment   render=10.2 ms draws=1155 tris=10.52M
  hide-settlement    render=7.3 ms draws=601 tris=9.73M
  hide-water         render=17.1 ms draws=1152 tris=9.57M
  hide-terrain       render=10.4 ms draws=1130 tris=7.63M
  hide-npc-fauna     render=7.3 ms draws=953 tris=10.36M
  no-shadows         render=8.8 ms draws=921 tris=9.67M
  no-ao              render=10.2 ms draws=1162 tris=10.54M
  no-bloom           render=11.9 ms draws=1156 tris=10.54M
  no-smaa            render=10.6 ms draws=1167 tris=10.54M
  no-god-rays        render=10.5 ms draws=1169 tris=10.54M
  no-film-grade      render=10.7 ms draws=1168 tris=10.54M
  no-postprocessing  render=10.6 ms draws=1139 tris=10.53M
  no-reflections     render=10.3 ms draws=955 tris=9.65M

Frame attribution:
  frame max: 808 ms
  largest labelled hitch: 0 ms
  unattributed: 808 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 808 ms

Raw sidecar:
  sampling=full factor=1 exported=336/336

Recommendation:
Largest frame (808 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 28

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (1.2 ms cumulative)
  agent updates: 0.6 ms/frame (193.9 ms cumulative)
  livestock: 0.6 ms/frame (200.9 ms cumulative)
    loaded tick: 0.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 12.1
    unique animals/frame: 12.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 2.0
    dog guard scans: 2.0/frame (13.3 predator candidates/frame)
    pest scans: 2.0/frame (2.0 rat candidates/frame)
    nearest scans: 12.0/frame (0.0 candidates/frame)
    water samples: 30.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 30.4/frame, 0.00 ms/frame (worst call 0.10 ms, 5405.2 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 11.1
    behaviour executions/frame: 12.0
    presentation executions/frame: 12.0
  rats: 0.1 ms/frame (37.3 ms cumulative)
  social: 0.0 ms/frame (2.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (24.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.7 ms/frame
  agent updates: 1.7 ms/frame (573.4 ms cumulative)
  forest sampling: 0.1 ms/frame (29.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.3 ms cumulative)
    targeting: 0.0 ms/frame (5.0 ms cumulative)
    decision: 0.0 ms/frame (10.3 ms cumulative)
    behaviour: 0.9 ms/frame (314.7 ms cumulative)
    life/presentation: 0.5 ms/frame (161.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 28.2
    sensing passes/frame: 24.8
    decision passes/frame: 24.8
    high-priority agents/frame: 0.9
    expensive behaviour agents/frame: 20.4
    full-rate agents/frame: 16.5
    reduced-cadence agents/frame: 8.2
    behaviour executions/frame: 21.2
    presentation executions/frame: 21.2

  sensing/cache:
    forest samples/frame: 28.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 52.5
    player perception checks/frame: 24.8

  nearest scans: 25.6/frame (8596 calls)
  nearest candidates checked: 109.7/frame (36873 total)
  herd leader scans: 0.1/frame (18 calls)
  herd candidates checked: 1.5/frame (504 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 30.6/frame (180.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 68.0/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 68.0/frame, 0.10 ms/frame (worst call 0.90 ms, 10705.8 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=276307 filler=518860
Submitted instances: full=226039 filler=249979
Meshes submitted: 72
LOD submitted fraction: full=0.8180719272403523 filler=0.4817850672628455
Flowers: unavailable
Allocation bytes (estimated): 76336032
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 338
Shadow refresh frames: 169
Shadow skipped frames: 169

Mirror:
  calls avg: 208  tris avg: 890505
  info calls avg: 208  residual calls avg: 0
  switches avg: material=79.5 program=49.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=4.5 skeletons first used=4.5
  environment                  calls=1 tris=1856
  other                        calls=41 tris=9995
  settlement:decor             calls=66 tris=140204
  settlement:fireHouseExteriorLamp calls=8 tris=360
  settlement:fireHouseInteriorLamp calls=3 tris=270
  settlement:fireVillageTorch  calls=3 tris=179
  settlement:houseInteractive  calls=9 tris=990
  settlement:houseStatic       calls=17 tris=25239
  settlement:landmarkNoticeBoard calls=1 tris=12
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=3 tris=935
  settlement:other             calls=4 tris=10956
  settlement:storageBarrel     calls=3 tris=5536
  settlement:storageContainer  calls=5 tris=1062
  settlement:storageGoods      calls=22 tris=3996
  settlement:storageTrough     calls=1 tris=600
  settlement:storageWoodHousehold calls=1 tris=2340
  settlement:storageWoodSettlementPrimary calls=1 tris=390
  settlement:workplace         calls=1 tris=824
  terrain                      calls=9 tris=663276
  vegetation                   calls=12 tris=20708

Shadow (refresh only):
  calls avg: 510  tris avg: 1736976
  info calls avg: 510  residual calls avg: 0
  switches avg: material=125 program=153.4  actor: calls=131.8 material=0 program=19.7
  skinning avg: skinned calls=125.8 skeletons first used=28.9
  environment                  calls=1 tris=2843
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rabbit           calls=1 tris=750
  faunaFamily:rat              calls=1 tris=2748
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  faunaFamily:wolf             calls=0 tris=163
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=79 tris=14652
  settlement:decor             calls=186 tris=396063
  settlement:fence             calls=2 tris=1212
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=7 tris=21912
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1400
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=15 tris=1105920
  vegetation                   calls=5 tris=4516

Main:
  calls avg: 683  tris avg: 8775445
  info calls avg: 950  residual calls avg: 0
  switches avg: material=312.7 program=166  actor: calls=143.4 material=97.7 program=47
  skinning avg: skinned calls=138.4 skeletons first used=25.4
  environment                  calls=6 tris=7141
  faunaFamily:bear             calls=3 tris=1998
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:duck             calls=3 tris=112
  faunaFamily:fox              calls=8 tris=3532
  faunaFamily:horse            calls=7 tris=1941
  faunaFamily:rabbit           calls=4 tris=2696
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=7 tris=2130
  faunaFamily:wolf             calls=24 tris=11772
  grass                        calls=49 tris=5552360
  items                        calls=11 tris=2211
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=128 tris=21300
  settlement:decor             calls=121 tris=253403
  settlement:fireHouseExteriorLamp calls=15 tris=720
  settlement:fireHouseInteriorLamp calls=5 tris=540
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=18 tris=1980
  settlement:houseStatic       calls=34 tris=50478
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=1870
  settlement:other             calls=7 tris=21912
  settlement:storageBarrel     calls=6 tris=11072
  settlement:storageContainer  calls=9 tris=2124
  settlement:storageGoods      calls=37 tris=6756
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=7 tris=4932
  terrain                      calls=23 tris=1694936
  vegetation                   calls=29 tris=46920
  water                        calls=14 tris=966656


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

[LONG FRAME] 808ms
simulate         5.0ms
render         802.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA            2.0ms
PHYSICS          0.1ms
RENDER         802.6ms
OTHER            1.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=10.6 ms  p95=13.1 ms  max=13.6 ms  Δavg vs baseline=—
  hide-grass           avg=9.8 ms  p95=11.6 ms  max=11.9 ms  Δavg vs baseline=-0.7 ms (-7%)
  hide-vegetation      avg=9.3 ms  p95=10.8 ms  max=11.0 ms  Δavg vs baseline=-1.2 ms (-12%)
  no vegetation/grass  avg=9.2 ms  p95=10.6 ms  max=10.9 ms  Δavg vs baseline=-1.3 ms (-13%)
  hide-environment     avg=10.2 ms  p95=11.9 ms  max=12.2 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-settlement      avg=7.3 ms  p95=8.6 ms  max=9.3 ms  Δavg vs baseline=-3.3 ms (-31%)
  no water             avg=17.1 ms  p95=13.1 ms  max=221.3 ms  Δavg vs baseline=+6.5 ms (+62%)
  hide-terrain         avg=10.4 ms  p95=12.4 ms  max=13.2 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-npc-fauna       avg=7.3 ms  p95=8.4 ms  max=8.9 ms  Δavg vs baseline=-3.2 ms (-30%)
  no-shadows           avg=8.8 ms  p95=10.6 ms  max=11.8 ms  Δavg vs baseline=-1.7 ms (-17%)
  no-ao                avg=10.2 ms  p95=11.8 ms  max=12.0 ms  Δavg vs baseline=-0.4 ms (-4%)
  no-bloom             avg=11.9 ms  p95=18.2 ms  max=30.4 ms  Δavg vs baseline=+1.3 ms (+12%)
  no-smaa              avg=10.6 ms  p95=12.6 ms  max=14.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-god-rays          avg=10.5 ms  p95=12.3 ms  max=12.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no-film-grade        avg=10.7 ms  p95=13.1 ms  max=14.0 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=10.6 ms  p95=12.0 ms  max=12.2 ms  Δavg vs baseline=+0.1 ms (+1%)
  no mirrors           avg=10.3 ms  p95=12.8 ms  max=14.3 ms  Δavg vs baseline=-0.3 ms (-3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=55.3 ms  p95=72.8 ms  max=77.1 ms
  CPU wall      avg=10.6 ms  p95=13.1 ms  max=13.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
