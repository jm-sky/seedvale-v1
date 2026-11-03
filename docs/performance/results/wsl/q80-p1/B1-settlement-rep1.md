# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T15:21:17.161Z
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
Frames: 415
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: 0fd9a5443e86d86e8f0324e138ffad505b644fc2
  runId: 2026-11-03T15-19-47-357Z-wiczue
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
  camera: pos=(-8.1, 11.7, -0.3)
  anchor: (-8.1, -11.5)
  populationGate: stable waited=5076ms npc=8
  gpuTimer: available=true resolved=true samples=414 span=postprocess+labels

FPS:
  avg: 51.8
  min: 2
  p1: 27

Frame time (wall-clock):
  avg: 19.3 ms
  p50: 17.1 ms
  p95: 22.5 ms
  p99: 36.8 ms
  max: 606.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.6 p95=6.8 p99=25.8 max=35.9 n=415
  render: p50=13 p95=15.4 p99=17.9 max=601.7 n=415
  frame: p50=17.1 p95=22.5 p99=36.8 max=606.6 n=415

Rendering (combined renderer.info):
  draw calls: 1121 avg / 1152 max
  triangles: 9.51M avg
  mirror draws: 212 avg
  geometries: 576
  textures: 282

Pass submissions (actual):
  reliability: observed
  frames: 417 shadowRefresh=208 shadowSkipped=209
  mirror calls avg: 212
  shadow calls avg: 490
  main calls avg: 652

Scene (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  grass            draws=72 tris=8.01M meshes=72 inst=599288
  vegetation       draws=134 tris=319.2k meshes=134 inst=210
  environment      draws=51 tris=20.6k meshes=51 inst=51
  settlement       draws=358 tris=542.8k meshes=358 inst=913
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=171 tris=70.4k meshes=171 inst=171
  items            draws=206 tris=21.8k meshes=206 inst=206
  other            draws=398 tris=28.6k meshes=398 inst=398

Shadow casters (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  vegetation       draws=130 tris=305.4k meshes=130 inst=206
  environment      draws=51 tris=20.6k meshes=51 inst=51
  settlement       draws=259 tris=448.8k meshes=259 inst=776
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=30 tris=17.8k meshes=30 inst=30
  other            draws=94 tris=14.4k meshes=94 inst=94

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=33 tris=50.0k meshes=33 inst=324
  houseInteractive draws=14 tris=2.2k meshes=14 inst=14
  fence            draws=4 tris=2.0k meshes=4 inst=10
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
  decor            draws=165 tris=353.8k meshes=165 inst=243
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
      near agents=1 camera-relevant=0 draws=9 tris=12.2k
      mid  agents=7 camera-relevant=4 draws=68 tris=87.3k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=7 draws=28 tris=13.7k skinned=28/28
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      dog              agents=2 draws=10 tris=3.8k skinned=10/10
      chicken          agents=2 draws=10 tris=1.3k skinned=0/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      sheep            agents=4 draws=8 tris=2.4k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rat              agents=1 draws=2 tris=4.0k skinned=2/2
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=1 camera-relevant=1 draws=8 tris=2.2k
      mid  agents=12 camera-relevant=9 draws=46 tris=17.4k
      far  agents=29 camera-relevant=6 draws=117 tris=50.8k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=67 composed=67 multiplied=67 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=166 composed=166 multiplied=166 skinned=0
  environment              nodes=79 composed=79 multiplied=79 skinned=0
  settlement               nodes=703 composed=703 multiplied=703 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=627 composed=627 multiplied=627 skinned=77
  fauna                    nodes=1776 composed=1776 multiplied=1776 skinned=151
  items                    nodes=326 composed=326 multiplied=326 skinned=0
  other                    nodes=645 composed=628 multiplied=645 skinned=9
  top scene children:
    fauna ×42                nodes=1776 composed=1776 multiplied=1776 skinned=151
    settlement ×1            nodes=703 composed=703 multiplied=703 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    Group ×75                nodes=478 composed=478 multiplied=478 skinned=9
    chunk-items ×27          nodes=326 composed=326 multiplied=326 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×67                nodes=67 composed=67 multiplied=67 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    Object3D ×29             nodes=29 composed=29 multiplied=29 skinned=0
    chunk-environmen ×4      nodes=27 composed=27 multiplied=27 skinned=0
    chunk-river ×25          nodes=25 composed=25 multiplied=25 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.0 ms
  NPC            1.6 ms
  FAUNA          1.5 ms
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
  full               render=10.0 ms draws=1125 tris=9.51M
  hide-grass         render=9.7 ms draws=1083 tris=3.72M
  hide-vegetation    render=9.8 ms draws=1116 tris=9.50M
  hide-vegetation-grass render=9.7 ms draws=1072 tris=3.70M
  hide-environment   render=9.8 ms draws=1108 tris=9.51M
  hide-settlement    render=6.9 ms draws=678 tris=8.85M
  hide-water         render=10.2 ms draws=1120 tris=9.36M
  hide-terrain       render=9.9 ms draws=1086 tris=6.82M
  hide-npc-fauna     render=7.2 ms draws=948 tris=9.37M
  no-shadows         render=8.6 ms draws=886 tris=8.69M
  no-ao              render=10.1 ms draws=1119 tris=9.52M
  no-bloom           render=10.2 ms draws=1117 tris=9.52M
  no-smaa            render=10.6 ms draws=1127 tris=9.53M
  no-god-rays        render=10.2 ms draws=1123 tris=9.52M
  no-film-grade      render=10.3 ms draws=1128 tris=9.52M
  no-postprocessing  render=10.5 ms draws=1100 tris=9.52M
  no-reflections     render=10.0 ms draws=916 tris=8.73M

Frame attribution:
  frame max: 606.6 ms
  largest labelled hitch: 0 ms
  unattributed: 606.6 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 606.6 ms

Raw sidecar:
  sampling=full factor=1 exported=415/415

Recommendation:
Largest frame (606.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 29

NPC:
  total: 1.6 ms/frame
  crowd pass: 0.0 ms/frame (1.4 ms cumulative)
  agent updates: 0.6 ms/frame (232.7 ms cumulative)
  livestock: 0.8 ms/frame (343.2 ms cumulative)
    loaded tick: 0.8 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.8 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.6 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 12.1
    unique animals/frame: 12.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 2.0
    dog guard scans: 2.0/frame (14.1 predator candidates/frame)
    pest scans: 2.0/frame (2.0 rat candidates/frame)
    nearest scans: 12.0/frame (0.0 candidates/frame)
    water samples: 22.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 22.4/frame, 0.00 ms/frame (worst call 0.10 ms, 3879.0 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 11.1
    behaviour executions/frame: 12.0
    presentation executions/frame: 12.0
  rats: 0.1 ms/frame (47.4 ms cumulative)
  social: 0.0 ms/frame (1.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (27.4 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.4 ms/frame (600.4 ms cumulative)
  forest sampling: 0.1 ms/frame (38.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.6 ms cumulative)
    targeting: 0.0 ms/frame (6.4 ms cumulative)
    decision: 0.0 ms/frame (5.6 ms cumulative)
    behaviour: 0.8 ms/frame (349.9 ms cumulative)
    life/presentation: 0.3 ms/frame (145.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 29.1
    sensing passes/frame: 28.8
    decision passes/frame: 28.8
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.8
    full-rate agents/frame: 6.8
    reduced-cadence agents/frame: 21.9
    behaviour executions/frame: 17.8
    presentation executions/frame: 17.8

  sensing/cache:
    forest samples/frame: 29.1
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 49.7
    player perception checks/frame: 28.8

  nearest scans: 24.6/frame (10215 calls)
  nearest candidates checked: 104.1/frame (43181 total)
  herd leader scans: 0.3/frame (143 calls)
  herd candidates checked: 10.0/frame (4147 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.6/frame (158.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 40.4/frame, 0.00 ms/frame (worst call 0.30 ms)
    collider queries: 40.4/frame, 0.00 ms/frame (worst call 0.20 ms, 6693.3 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=342752 filler=656535
Submitted instances: full=279982 filler=319306
Meshes submitted: 72
LOD submitted fraction: full=0.8168646718326954 filler=0.4863503088182656
Flowers: unavailable
Allocation bytes (estimated): 95931552
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 417
Shadow refresh frames: 208
Shadow skipped frames: 209

Mirror:
  calls avg: 212  tris avg: 783931
  info calls avg: 212  residual calls avg: 0
  switches avg: material=81.2 program=35.6  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=435
  other                        calls=102 tris=5450
  settlement:decor             calls=36 tris=98227
  settlement:fence             calls=1 tris=405
  settlement:fireHouseExteriorLamp calls=6 tris=289
  settlement:fireHouseInteriorLamp calls=2 tris=217
  settlement:fireVillageTorch  calls=3 tris=179
  settlement:houseInteractive  calls=6 tris=662
  settlement:houseStatic       calls=17 tris=25300
  settlement:landmarkWellHousehold calls=3 tris=937
  settlement:other             calls=2 tris=10952
  settlement:storageBarrel     calls=3 tris=5549
  settlement:storageContainer  calls=5 tris=1065
  settlement:storageGoods      calls=15 tris=2560
  settlement:storageTrough     calls=1 tris=601
  settlement:storageWoodHousehold calls=1 tris=2346
  settlement:storageWoodSettlementPrimary calls=1 tris=391
  terrain                      calls=9 tris=627914
  vegetation                   calls=2 tris=609

Shadow (refresh only):
  calls avg: 490  tris avg: 1650540
  info calls avg: 490  residual calls avg: 0
  switches avg: material=120.4 program=146.1  actor: calls=130.8 material=0 program=16.9
  skinning avg: skinned calls=124.8 skeletons first used=27.9
  environment                  calls=1 tris=868
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=3581
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=72 tris=13708
  settlement:decor             calls=165 tris=353843
  settlement:fence             calls=4 tris=2020
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
  terrain                      calls=14 tris=1032192
  vegetation                   calls=13 tris=36220

Main:
  calls avg: 652  tris avg: 7906112
  info calls avg: 909  residual calls avg: 0
  switches avg: material=281.7 program=126.3  actor: calls=108.1 material=81.7 program=35.3
  skinning avg: skinned calls=109 skeletons first used=18.6
  environment                  calls=14 tris=4438
  faunaFamily:bear             calls=1 tris=666
  faunaFamily:chicken          calls=7 tris=917
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=3 tris=1865
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=7 tris=2254
  faunaFamily:wolf             calls=20 tris=10047
  grass                        calls=43 tris=5794532
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  other                        calls=241 tris=20080
  settlement:decor             calls=62 tris=183125
  settlement:fence             calls=2 tris=808
  settlement:fireHouseExteriorLamp calls=12 tris=576
  settlement:fireHouseInteriorLamp calls=3 tris=324
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=34 tris=50478
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=1870
  settlement:other             calls=7 tris=21912
  settlement:storageBarrel     calls=6 tris=11072
  settlement:storageContainer  calls=9 tris=2124
  settlement:storageGoods      calls=35 tris=6344
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=6 tris=3284
  terrain                      calls=21 tris=1547480
  vegetation                   calls=4 tris=1632
  water                        calls=3 tris=155648


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

[LONG FRAME] 606.6ms
simulate         4.5ms
render         601.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA            1.2ms
PHYSICS          0.2ms
RENDER         601.7ms
OTHER            1.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=10.0 ms  p95=13.2 ms  max=14.4 ms  Δavg vs baseline=—
  hide-grass           avg=9.7 ms  p95=11.7 ms  max=12.1 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-vegetation      avg=9.8 ms  p95=11.6 ms  max=13.0 ms  Δavg vs baseline=-0.3 ms (-3%)
  no vegetation/grass  avg=9.7 ms  p95=11.7 ms  max=12.5 ms  Δavg vs baseline=-0.3 ms (-3%)
  hide-environment     avg=9.8 ms  p95=12.0 ms  max=12.6 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-settlement      avg=6.9 ms  p95=8.6 ms  max=9.3 ms  Δavg vs baseline=-3.2 ms (-31%)
  no water             avg=10.2 ms  p95=12.6 ms  max=12.8 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-terrain         avg=9.9 ms  p95=11.7 ms  max=12.0 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-npc-fauna       avg=7.2 ms  p95=8.6 ms  max=9.1 ms  Δavg vs baseline=-2.9 ms (-29%)
  no-shadows           avg=8.6 ms  p95=10.7 ms  max=12.2 ms  Δavg vs baseline=-1.5 ms (-15%)
  no-ao                avg=10.1 ms  p95=12.3 ms  max=13.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-bloom             avg=10.2 ms  p95=12.0 ms  max=13.9 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-smaa              avg=10.6 ms  p95=13.5 ms  max=13.8 ms  Δavg vs baseline=+0.5 ms (+5%)
  no-god-rays          avg=10.2 ms  p95=12.6 ms  max=15.0 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-film-grade        avg=10.3 ms  p95=12.1 ms  max=14.7 ms  Δavg vs baseline=+0.3 ms (+3%)
  no postprocessing    avg=10.5 ms  p95=12.8 ms  max=14.0 ms  Δavg vs baseline=+0.5 ms (+5%)
  no mirrors           avg=10.0 ms  p95=12.5 ms  max=12.5 ms  Δavg vs baseline=-0.0 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=45.6 ms  p95=52.4 ms  max=53.5 ms
  CPU wall      avg=10.0 ms  p95=13.2 ms  max=14.4 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
