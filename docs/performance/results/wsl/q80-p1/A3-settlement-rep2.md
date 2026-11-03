# Seedvale Performance Benchmark Report

> Generated: 2026-11-03T16:00:06.459Z
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
Frames: 166
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a25e47aa423419e56bb240801251d699bb6b8759
  runId: 2026-11-03T15-57-59-140Z-fw8aht
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
  populationGate: stable waited=5161ms npc=8
  gpuTimer: available=true resolved=true samples=164 span=postprocess+labels

FPS:
  avg: 15.8
  min: 0
  p1: 12

Frame time (wall-clock):
  avg: 63.2 ms
  p50: 40.4 ms
  p95: 67.2 ms
  p99: 82.5 ms
  max: 3481.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.6 p95=36.4 p99=46.3 max=70.5 n=166
  render: p50=29.8 p95=39.1 p99=47.8 max=3474.6 n=166
  frame: p50=40.4 p95=67.2 p99=82.5 max=3481.5 n=166

Rendering (combined renderer.info):
  draw calls: 1164 avg / 1208 max
  triangles: 10.53M avg
  mirror draws: 209 avg
  geometries: 479
  textures: 328

Pass submissions (actual):
  reliability: observed
  frames: 167 shadowRefresh=83 shadowSkipped=84
  mirror calls avg: 211
  shadow calls avg: 511
  main calls avg: 687

Scene (one-pass estimate):
  terrain          draws=49 tris=3.61M meshes=49 inst=49
  grass            draws=72 tris=6.30M meshes=72 inst=476018
  vegetation       draws=138 tris=326.1k meshes=138 inst=206
  environment      draws=37 tris=14.7k meshes=37 inst=37
  settlement       draws=388 tris=602.4k meshes=388 inst=936
  water            draws=35 tris=2.51M meshes=35 inst=35
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=161 tris=65.1k meshes=161 inst=161
  items            draws=136 tris=15.5k meshes=136 inst=136
  other            draws=221 tris=24.3k meshes=221 inst=223

Shadow casters (one-pass estimate):
  terrain          draws=49 tris=3.61M meshes=49 inst=49
  vegetation       draws=126 tris=296.3k meshes=126 inst=194
  environment      draws=37 tris=14.7k meshes=37 inst=37
  settlement       draws=288 tris=508.6k meshes=288 inst=793
  npc              draws=77 tris=99.5k meshes=77 inst=77
  fauna            draws=56 tris=17.6k meshes=56 inst=56
  items            draws=20 tris=12.9k meshes=20 inst=20
  other            draws=104 tris=15.5k meshes=104 inst=104

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=33 tris=50.0k meshes=33 inst=324
  houseInteractive draws=14 tris=2.2k meshes=14 inst=14
  fence            draws=2 tris=1.2k meshes=2 inst=6
  storageWoodSettlementPrimary draws=1 tris=780 meshes=1 inst=1
  storageWoodHousehold draws=1 tris=4.7k meshes=1 inst=6
  storageContainer draws=6 tris=1.9k meshes=6 inst=26
  storageHay       draws=1 tris=488 meshes=1 inst=1
  storageTrough    draws=2 tris=84 meshes=2 inst=7
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
      near agents=4 camera-relevant=4 draws=20 tris=4.1k
      mid  agents=9 camera-relevant=6 draws=36 tris=13.5k
      far  agents=28 camera-relevant=15 draws=105 tris=47.5k

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
  other                    nodes=433 composed=416 multiplied=433 skinned=9
  top scene children:
    fauna ×41                nodes=1719 composed=1719 multiplied=1719 skinned=142
    settlement ×1            nodes=753 composed=753 multiplied=753 skinned=0
    npc ×8                   nodes=627 composed=627 multiplied=627 skinned=77
    Group ×37                nodes=263 composed=263 multiplied=263 skinned=9
    chunk-items ×17          nodes=212 composed=212 multiplied=212 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    Root_Scene ×17           nodes=52 composed=52 multiplied=52 skinned=0
    chunk ×49                nodes=49 composed=49 multiplied=49 skinned=0
    chunk-water ×34          nodes=34 composed=34 multiplied=34 skinned=0
    Object3D ×30             nodes=30 composed=30 multiplied=30 skinned=0
    chunk-river ×27          nodes=27 composed=27 multiplied=27 skinned=0
    chunk-vegetation ×1      nodes=20 composed=20 multiplied=20 skinned=0

Systems:
  WATER          5.3 ms
  NPC            2.8 ms
  FAUNA          6.2 ms
  PHYSICS        0.3 ms
  RENDER         45.6 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.9 ms draws=1166 tris=10.53M
  hide-grass         render=22.9 ms draws=1122 tris=4.98M
  hide-vegetation    render=20.9 ms draws=1124 tris=10.46M
  hide-vegetation-grass render=20.9 ms draws=1079 tris=4.91M
  hide-environment   render=22.5 ms draws=1164 tris=10.52M
  hide-settlement    render=8.9 ms draws=612 tris=9.73M
  hide-water         render=33.2 ms draws=1162 tris=9.56M
  hide-terrain       render=13.9 ms draws=1137 tris=7.62M
  hide-npc-fauna     render=13.7 ms draws=960 tris=10.35M
  no-shadows         render=11.9 ms draws=931 tris=9.66M
  no-ao              render=10.4 ms draws=1161 tris=10.53M
  no-bloom           render=10.8 ms draws=1152 tris=10.53M
  no-smaa            render=15.1 ms draws=1167 tris=10.53M
  no-god-rays        render=13.6 ms draws=1167 tris=10.53M
  no-film-grade      render=13.6 ms draws=1172 tris=10.53M
  no-postprocessing  render=13.4 ms draws=1147 tris=10.53M
  no-reflections     render=10.1 ms draws=964 tris=9.64M

Frame attribution:
  frame max: 3481.5 ms
  largest labelled hitch: 0 ms
  unattributed: 3481.5 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 3481.5 ms

Raw sidecar:
  sampling=full factor=1 exported=166/166

Recommendation:
Largest frame (3481.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 8
  Fauna (agents): 28

NPC:
  total: 2.8 ms/frame
  crowd pass: 0.0 ms/frame (1.2 ms cumulative)
  agent updates: 1.2 ms/frame (194.8 ms cumulative)
  livestock: 1.3 ms/frame (216.9 ms cumulative)
    loaded tick: 1.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 12.1
    unique animals/frame: 12.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 2.0
    dog guard scans: 2.0/frame (14.1 predator candidates/frame)
    pest scans: 2.0/frame (2.0 rat candidates/frame)
    nearest scans: 12.0/frame (0.0 candidates/frame)
    water samples: 22.3/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 22.3/frame, 0.10 ms/frame (worst call 0.30 ms, 3961.7 colliders/frame)
    full-rate agents/frame: 1.2
    reduced-cadence agents/frame: 10.8
    behaviour executions/frame: 12.0
    presentation executions/frame: 12.0
  rats: 0.2 ms/frame (25.4 ms cumulative)
  social: 0.0 ms/frame (1.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (22.6 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 6.2 ms/frame
  agent updates: 6.1 ms/frame (1018.5 ms cumulative)
  forest sampling: 0.2 ms/frame (32.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.1 ms/frame (13.4 ms cumulative)
    targeting: 0.0 ms/frame (7.2 ms cumulative)
    decision: 0.1 ms/frame (9.7 ms cumulative)
    behaviour: 4.0 ms/frame (672.0 ms cumulative)
    life/presentation: 1.2 ms/frame (202.8 ms cumulative)
    other update: 0.5 ms/frame

  adaptive candidates:
    agent updates/frame: 28.2
    sensing passes/frame: 26.4
    decision passes/frame: 26.4
    high-priority agents/frame: 0.1
    expensive behaviour agents/frame: 21.9
    full-rate agents/frame: 17.0
    reduced-cadence agents/frame: 9.4
    behaviour executions/frame: 22.0
    presentation executions/frame: 22.0

  sensing/cache:
    forest samples/frame: 28.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 53.6
    player perception checks/frame: 26.4

  nearest scans: 24.9/frame (4135 calls)
  nearest candidates checked: 107.0/frame (17770 total)
  herd leader scans: 0.0/frame (7 calls)
  herd candidates checked: 1.2/frame (196 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 29.7/frame (174.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 63.9/frame, 0.20 ms/frame (worst call 2.30 ms)
    collider queries: 63.9/frame, 0.20 ms/frame (worst call 1.60 ms, 9963.3 colliders/frame)

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
Frames: 167
Shadow refresh frames: 83
Shadow skipped frames: 84

Mirror:
  calls avg: 211  tris avg: 894005
  info calls avg: 211  residual calls avg: 0
  switches avg: material=78.3 program=50.6  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=4.5 skeletons first used=4.5
  environment                  calls=1 tris=1867
  other                        calls=43 tris=8754
  settlement:decor             calls=66 tris=141043
  settlement:fireHouseExteriorLamp calls=8 tris=362
  settlement:fireHouseInteriorLamp calls=3 tris=272
  settlement:fireVillageTorch  calls=3 tris=180
  settlement:houseInteractive  calls=9 tris=996
  settlement:houseStatic       calls=17 tris=25390
  settlement:landmarkNoticeBoard calls=1 tris=12
  settlement:landmarkWellCentral calls=3 tris=941
  settlement:landmarkWellHousehold calls=3 tris=941
  settlement:other             calls=4 tris=11022
  settlement:storageBarrel     calls=3 tris=5569
  settlement:storageContainer  calls=5 tris=1068
  settlement:storageGoods      calls=22 tris=4020
  settlement:storageTrough     calls=1 tris=72
  settlement:storageWoodHousehold calls=1 tris=2354
  settlement:storageWoodSettlementPrimary calls=1 tris=392
  settlement:workplace         calls=1 tris=829
  terrain                      calls=9 tris=667248
  vegetation                   calls=12 tris=20832

Shadow (refresh only):
  calls avg: 511  tris avg: 1733381
  info calls avg: 511  residual calls avg: 0
  switches avg: material=126.8 program=152.7  actor: calls=130.5 material=0 program=17.9
  skinning avg: skinned calls=124.5 skeletons first used=27.9
  environment                  calls=1 tris=2843
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rabbit           calls=1 tris=512
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  faunaFamily:wolf             calls=1 tris=355
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=83 tris=14666
  settlement:decor             calls=187 tris=396565
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
  settlement:storageTrough     calls=2 tris=84
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=15 tris=1105920
  vegetation                   calls=5 tris=4516

Main:
  calls avg: 687  tris avg: 8771458
  info calls avg: 953  residual calls avg: 0
  switches avg: material=312.1 program=170.4  actor: calls=143 material=100.4 program=47.8
  skinning avg: skinned calls=138.9 skeletons first used=25
  environment                  calls=6 tris=7141
  faunaFamily:bear             calls=2 tris=1639
  faunaFamily:chicken          calls=9 tris=1187
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=2 tris=841
  faunaFamily:duck             calls=3 tris=112
  faunaFamily:fox              calls=8 tris=3696
  faunaFamily:horse            calls=8 tris=2162
  faunaFamily:rabbit           calls=4 tris=2696
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  faunaFamily:wolf             calls=21 tris=10360
  grass                        calls=49 tris=5552360
  items                        calls=11 tris=2211
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=14 tris=16265
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=132 tris=18715
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
  settlement:storageTrough     calls=2 tris=144
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=7 tris=4932
  terrain                      calls=23 tris=1694936
  vegetation                   calls=29 tris=46920
  water                        calls=14 tris=966656


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

[LONG FRAME] 3481.5ms
simulate         6.6ms
render        3474.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              2.1ms
FAUNA            1.9ms
PHYSICS          0.2ms
RENDER        3474.5ms
OTHER            2.5ms

Long frame #2:

[LONG FRAME] 94.1ms
simulate        70.5ms
render          23.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.1ms
STREAMING        0.2ms
NPC              3.5ms
FAUNA           64.2ms
PHYSICS          0.3ms
RENDER          16.2ms
OTHER            2.6ms

streaming / stages:
  chunkUpdate                  0.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.9 ms  p95=27.4 ms  max=36.8 ms  Δavg vs baseline=—
  hide-grass           avg=22.9 ms  p95=29.7 ms  max=29.9 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=20.9 ms  p95=25.9 ms  max=30.5 ms  Δavg vs baseline=-2.0 ms (-9%)
  no vegetation/grass  avg=20.9 ms  p95=27.7 ms  max=28.6 ms  Δavg vs baseline=-2.0 ms (-9%)
  hide-environment     avg=22.5 ms  p95=29.1 ms  max=47.3 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-settlement      avg=8.9 ms  p95=15.2 ms  max=18.3 ms  Δavg vs baseline=-14.0 ms (-61%)
  no water             avg=33.2 ms  p95=113.1 ms  max=265.9 ms  Δavg vs baseline=+10.3 ms (+45%)
  hide-terrain         avg=13.9 ms  p95=25.3 ms  max=31.6 ms  Δavg vs baseline=-9.0 ms (-39%)
  hide-npc-fauna       avg=13.7 ms  p95=31.1 ms  max=40.3 ms  Δavg vs baseline=-9.2 ms (-40%)
  no-shadows           avg=11.9 ms  p95=24.4 ms  max=28.5 ms  Δavg vs baseline=-11.0 ms (-48%)
  no-ao                avg=10.4 ms  p95=13.2 ms  max=14.1 ms  Δavg vs baseline=-12.5 ms (-55%)
  no-bloom             avg=10.8 ms  p95=13.7 ms  max=19.3 ms  Δavg vs baseline=-12.1 ms (-53%)
  no-smaa              avg=15.1 ms  p95=30.6 ms  max=38.8 ms  Δavg vs baseline=-7.8 ms (-34%)
  no-god-rays          avg=13.6 ms  p95=30.9 ms  max=31.6 ms  Δavg vs baseline=-9.4 ms (-41%)
  no-film-grade        avg=13.6 ms  p95=28.3 ms  max=38.2 ms  Δavg vs baseline=-9.4 ms (-41%)
  no postprocessing    avg=13.4 ms  p95=32.3 ms  max=41.2 ms  Δavg vs baseline=-9.5 ms (-42%)
  no mirrors           avg=10.1 ms  p95=12.6 ms  max=13.0 ms  Δavg vs baseline=-12.8 ms (-56%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=75.1 ms  p95=84.6 ms  max=85.8 ms
  CPU wall      avg=22.9 ms  p95=27.4 ms  max=36.8 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
