# Seedvale Performance Benchmark Report

> Generated: 2026-10-31T08:31:17.395Z
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
Frames: 1160
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 977966ac6b0ce19aabe3e3acdf91b9462c21824e
  runId: 2026-10-31T08-30-15-078Z-unhyp2
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
  camera: pos=(-8.1, 11.7, -0.3)
  anchor: (-8.1, -11.5)
  populationGate: stable waited=5082ms npc=24
  gpuTimer: available=true resolved=true samples=1168 span=postprocess+labels

FPS:
  avg: 45
  min: 7
  p1: 33

Frame time (wall-clock):
  avg: 22.2 ms
  p50: 22 ms
  p95: 26.2 ms
  p99: 30.6 ms
  max: 147.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.4 p95=5.9 p99=8.8 max=128.4 n=1160
  render: p50=17.2 p95=21 p99=22.7 max=27.5 n=1160
  frame: p50=22 p95=26.2 p99=30.6 max=147.2 n=1160

Rendering (combined renderer.info):
  draw calls: 1809 avg / 2111 max
  triangles: 10.49M avg
  mirror draws: 287 avg
  geometries: 683
  textures: 323

Pass submissions (actual):
  reliability: observed
  frames: 1169 shadowRefresh=1169 shadowSkipped=0
  mirror calls avg: 287
  shadow calls avg: 539
  main calls avg: 983

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.12M meshes=72 inst=542412
  vegetation       draws=105 tris=251.5k meshes=105 inst=180
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=668 tris=756.5k meshes=668 inst=1534
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=247 tris=98.7k meshes=247 inst=247
  items            draws=251 tris=25.0k meshes=251 inst=251
  other            draws=412 tris=28.5k meshes=412 inst=412

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=103 tris=244.6k meshes=103 inst=178
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=428 tris=512.2k meshes=428 inst=1189
  npc              draws=75 tris=98.4k meshes=75 inst=75
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=29 tris=19.1k meshes=29 inst=29
  other            draws=106 tris=14.6k meshes=106 inst=106

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=81 tris=85.2k meshes=81 inst=652
  houseInteractive draws=28 tris=4.4k meshes=28 inst=28
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=10.9k meshes=3 inst=14
  storageContainer draws=18 tris=4.6k meshes=18 inst=62
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=3.0k meshes=8 inst=30
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=4.0k meshes=3 inst=5
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=14 tris=1.5k meshes=14 inst=14
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=195 tris=373.5k meshes=195 inst=278
  other            draws=29 tris=540 meshes=29 inst=29

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=111 tris=135.1k skinned=111/111
      Farmer           agents=4 draws=35 tris=51.7k skinned=35/35
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      mid  agents=8 camera-relevant=2 draws=75 tris=98.4k
      far  agents=16 camera-relevant=9 draws=148 tris=190.7k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      dog              agents=6 draws=33 tris=11.6k skinned=33/33
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=4 draws=32 tris=8.7k skinned=32/32
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=1 camera-relevant=1 draws=8 tris=2.2k
      mid  agents=12 camera-relevant=9 draws=46 tris=17.4k
      far  agents=48 camera-relevant=14 draws=193 tris=79.1k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=128 composed=128 multiplied=128 skinned=0
  environment              nodes=262 composed=262 multiplied=262 skinned=0
  settlement               nodes=1343 composed=1343 multiplied=1343 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2637 composed=2637 multiplied=2637 skinned=212
  items                    nodes=371 composed=371 multiplied=371 skinned=0
  other                    nodes=665 composed=648 multiplied=665 skinned=9
  top scene children:
    fauna ×61                nodes=2637 composed=2637 multiplied=2637 skinned=212
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1343 composed=1343 multiplied=1343 skinned=0
    Group ×78                nodes=502 composed=502 multiplied=502 skinned=9
    chunk-items ×26          nodes=371 composed=371 multiplied=371 skinned=0
    chunk-environmen ×5      nodes=214 composed=214 multiplied=214 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×15           nodes=54 composed=54 multiplied=54 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.4 ms
  NPC            2.4 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         14.6 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.9 ms draws=1809 tris=10.48M
  hide-grass         render=12.4 ms draws=1766 tris=5.58M
  hide-vegetation    render=12.6 ms draws=1764 tris=10.32M
  hide-vegetation-grass render=13.0 ms draws=1721 tris=5.42M
  hide-environment   render=12.8 ms draws=1721 tris=10.47M
  hide-settlement    render=8.7 ms draws=1002 tris=9.47M
  hide-water         render=12.4 ms draws=1800 tris=10.33M
  hide-terrain       render=12.0 ms draws=1751 tris=6.58M
  hide-npc-fauna     render=8.2 ms draws=1490 tris=10.20M
  no-shadows         render=7.2 ms draws=1294 tris=8.44M
  no-ao              render=10.6 ms draws=1804 tris=10.48M
  no-bloom           render=11.1 ms draws=1796 tris=10.48M
  no-smaa            render=11.9 ms draws=1800 tris=10.48M
  no-god-rays        render=13.5 ms draws=1802 tris=10.48M
  no-film-grade      render=14.0 ms draws=1803 tris=10.48M
  no-postprocessing  render=11.3 ms draws=1778 tris=10.48M
  no-reflections     render=10.6 ms draws=1517 tris=9.69M

Frame attribution:
  frame max: 147.2 ms
  largest labelled hitch: 0 ms
  unattributed: 147.2 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 147.2 ms

Raw sidecar:
  sampling=full factor=1 exported=1160/1160

Recommendation:
Largest frame (147.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.4 ms/frame
  crowd pass: 0.0 ms/frame (11.6 ms cumulative)
  agent updates: 1.4 ms/frame (1638.5 ms cumulative)
  livestock: 0.7 ms/frame (826.8 ms cumulative)
    loaded tick: 0.7 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.7 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.4 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (48.4 predator candidates/frame)
    pest scans: 2.4/frame (2.4 rat candidates/frame)
    nearest scans: 12.6/frame (0.0 candidates/frame)
    water samples: 29.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 29.6/frame, 0.00 ms/frame (worst call 0.20 ms, 2433.1 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 27.2
    behaviour executions/frame: 12.6
    presentation executions/frame: 10.8
  rats: 0.1 ms/frame (136.7 ms cumulative)
  social: 0.0 ms/frame (4.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (148.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.2 ms/frame (1420.6 ms cumulative)
  forest sampling: 0.1 ms/frame (110.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (19.9 ms cumulative)
    targeting: 0.0 ms/frame (21.3 ms cumulative)
    decision: 0.0 ms/frame (17.2 ms cumulative)
    behaviour: 0.7 ms/frame (812.3 ms cumulative)
    life/presentation: 0.3 ms/frame (330.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.8
    full-rate agents/frame: 7.4
    reduced-cadence agents/frame: 22.5
    behaviour executions/frame: 14.8
    presentation executions/frame: 13.4

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 441.2
    player perception checks/frame: 30.0

  nearest scans: 21.1/frame (24479 calls)
  nearest candidates checked: 218.1/frame (252940 total)
  herd leader scans: 0.1/frame (165 calls)
  herd candidates checked: 4.3/frame (4950 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.6/frame (110.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 43.3/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 43.3/frame, 0.10 ms/frame (worst call 1.70 ms, 4045.7 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=317513 filler=605909
Submitted instances: full=257702 filler=284710
Meshes submitted: 72
LOD submitted fraction: full=0.8116266105639769 filler=0.4698890427440424
Flowers: unavailable
Allocation bytes (estimated): 88648512
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1169
Shadow refresh frames: 1169
Shadow skipped frames: 0

Mirror:
  calls avg: 287  tris avg: 788349
  info calls avg: 287  residual calls avg: 0
  switches avg: material=103.4 program=52  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=0 tris=434
  other                        calls=109 tris=5711
  settlement:decor             calls=25 tris=51477
  settlement:fence             calls=2 tris=3229
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=10 tris=504
  settlement:fireHouseInteriorLamp calls=3 tris=378
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=10 tris=1154
  settlement:houseStatic       calls=26 tris=32594
  settlement:landmarkGarden    calls=6 tris=70092
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=934
  settlement:landmarkWellHousehold calls=5 tris=3737
  settlement:landmarkWellPasture calls=2 tris=934
  settlement:other             calls=6 tris=120
  settlement:storageBarrel     calls=6 tris=10371
  settlement:storageContainer  calls=9 tris=1966
  settlement:storageGoods      calls=26 tris=5351
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=1199
  settlement:storageWoodHousehold calls=1 tris=4286
  settlement:storageWoodSettlementPrimary calls=1 tris=779
  settlement:workplace         calls=4 tris=2035
  terrain                      calls=8 tris=589044
  vegetation                   calls=2 tris=675

Shadow (refresh only):
  calls avg: 539  tris avg: 2049501
  info calls avg: 539  residual calls avg: 0
  switches avg: material=157.9 program=173.9  actor: calls=129 material=0 program=16
  skinning avg: skinned calls=123 skeletons first used=34
  environment                  calls=2 tris=1736
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=80 tris=13818
  settlement:decor             calls=193 tris=370032
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=12 tris=1884
  settlement:houseStatic       calls=33 tris=44402
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=18 tris=1326820
  vegetation                   calls=34 tris=155892

Main:
  calls avg: 983  tris avg: 7649002
  info calls avg: 1522  residual calls avg: 0
  switches avg: material=363.2 program=170.9  actor: calls=192 material=115.2 program=52.9
  skinning avg: skinned calls=185 skeletons first used=28.7
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:dog              calls=27 tris=9660
  faunaFamily:horse            calls=14 tris=4036
  faunaFamily:rat              calls=2 tris=4743
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=10 tris=3050
  faunaFamily:wolf             calls=18 tris=9139
  grass                        calls=43 tris=4905808
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=0 tris=195
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=260 tris=20835
  settlement:decor             calls=49 tris=102906
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=21 tris=1008
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=55 tris=67476
  settlement:landmarkGarden    calls=12 tris=140304
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=16 tris=300
  settlement:storageBarrel     calls=12 tris=20760
  settlement:storageContainer  calls=18 tris=3936
  settlement:storageGoods      calls=56 tris=11536
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=2400
  settlement:storageWoodHousehold calls=2 tris=8580
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=15 tris=7358
  terrain                      calls=27 tris=1989848
  vegetation                   calls=10 tris=3794
  water                        calls=3 tris=155648


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

[LONG FRAME] 147.2ms
simulate       128.4ms
render          18.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.8ms
STREAMING        0.0ms
NPC              2.1ms
FAUNA          124.9ms
PHYSICS          0.1ms
RENDER          13.7ms
OTHER            1.6ms

Long frame #2:

[LONG FRAME] 103.2ms
simulate        83.3ms
render          19.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.7ms
STREAMING        0.0ms
NPC              2.2ms
FAUNA           79.9ms
PHYSICS          0.1ms
RENDER          14.8ms
OTHER            1.5ms

Long frame #3:

[LONG FRAME] 101.9ms
simulate        87.5ms
render          14.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA           83.8ms
PHYSICS          0.1ms
RENDER          14.0ms
OTHER            1.6ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.9 ms  p95=14.5 ms  max=14.9 ms  Δavg vs baseline=—
  hide-grass           avg=12.4 ms  p95=13.8 ms  max=14.3 ms  Δavg vs baseline=-0.5 ms (-4%)
  hide-vegetation      avg=12.6 ms  p95=13.8 ms  max=16.0 ms  Δavg vs baseline=-0.3 ms (-2%)
  no vegetation/grass  avg=13.0 ms  p95=14.4 ms  max=15.7 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-environment     avg=12.8 ms  p95=13.9 ms  max=14.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-settlement      avg=8.7 ms  p95=10.6 ms  max=10.8 ms  Δavg vs baseline=-4.2 ms (-32%)
  no water             avg=12.4 ms  p95=14.3 ms  max=14.7 ms  Δavg vs baseline=-0.5 ms (-4%)
  hide-terrain         avg=12.0 ms  p95=13.2 ms  max=13.3 ms  Δavg vs baseline=-0.9 ms (-7%)
  hide-npc-fauna       avg=8.2 ms  p95=9.1 ms  max=9.1 ms  Δavg vs baseline=-4.6 ms (-36%)
  no-shadows           avg=7.2 ms  p95=8.5 ms  max=9.1 ms  Δavg vs baseline=-5.7 ms (-44%)
  no-ao                avg=10.6 ms  p95=12.0 ms  max=12.6 ms  Δavg vs baseline=-2.3 ms (-18%)
  no-bloom             avg=11.1 ms  p95=12.5 ms  max=13.6 ms  Δavg vs baseline=-1.7 ms (-14%)
  no-smaa              avg=11.9 ms  p95=13.2 ms  max=13.4 ms  Δavg vs baseline=-1.0 ms (-8%)
  no-god-rays          avg=13.5 ms  p95=15.4 ms  max=15.7 ms  Δavg vs baseline=+0.6 ms (+5%)
  no-film-grade        avg=14.0 ms  p95=14.9 ms  max=15.3 ms  Δavg vs baseline=+1.1 ms (+9%)
  no postprocessing    avg=11.3 ms  p95=12.9 ms  max=14.5 ms  Δavg vs baseline=-1.6 ms (-12%)
  no mirrors           avg=10.6 ms  p95=12.1 ms  max=12.7 ms  Δavg vs baseline=-2.3 ms (-18%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=21.5 ms  p95=29.8 ms  max=31.0 ms
  CPU wall      avg=12.9 ms  p95=14.5 ms  max=14.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
