# Seedvale Performance Benchmark Report

> Generated: 2026-10-31T08:46:11.233Z
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
Frames: 1174
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 977966ac6b0ce19aabe3e3acdf91b9462c21824e
  runId: 2026-10-31T08-45-09-640Z-qkgkj4
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
  populationGate: stable waited=5103ms npc=24
  gpuTimer: available=true resolved=true samples=1182 span=postprocess+labels

FPS:
  avg: 41.1
  min: 2
  p1: 16

Frame time (wall-clock):
  avg: 24.3 ms
  p50: 23.3 ms
  p95: 28.5 ms
  p99: 62.5 ms
  max: 432.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.6 p95=6.3 p99=44.5 max=143.1 n=1174
  render: p50=17.8 p95=22.5 p99=24.5 max=429.1 n=1174
  frame: p50=23.3 p95=28.5 p99=62.5 max=432.6 n=1174

Rendering (combined renderer.info):
  draw calls: 1809 avg / 2117 max
  triangles: 10.48M avg
  mirror draws: 289 avg
  geometries: 685
  textures: 321

Pass submissions (actual):
  reliability: observed
  frames: 1183 shadowRefresh=1183 shadowSkipped=0
  mirror calls avg: 289
  shadow calls avg: 521
  main calls avg: 998

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.12M meshes=72 inst=542412
  vegetation       draws=105 tris=251.5k meshes=105 inst=180
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=667 tris=760.1k meshes=667 inst=1533
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=247 tris=98.7k meshes=247 inst=247
  items            draws=251 tris=25.0k meshes=251 inst=251
  other            draws=415 tris=28.9k meshes=415 inst=422

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=103 tris=244.6k meshes=103 inst=178
  environment      draws=143 tris=23.3k meshes=143 inst=143
  settlement       draws=427 tris=515.8k meshes=427 inst=1188
  npc              draws=56 tris=75.1k meshes=56 inst=56
  fauna            draws=52 tris=19.0k meshes=52 inst=52
  items            draws=29 tris=19.1k meshes=29 inst=29
  other            draws=109 tris=15.0k meshes=109 inst=109

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
  decor            draws=194 tris=377.2k meshes=194 inst=277
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
      near agents=1 camera-relevant=0 draws=7 tris=10.8k
      mid  agents=5 camera-relevant=1 draws=49 tris=64.3k
      far  agents=18 camera-relevant=11 draws=167 tris=214.0k
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
      mid  agents=11 camera-relevant=8 draws=44 tris=16.8k
      far  agents=49 camera-relevant=16 draws=195 tris=79.7k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=128 composed=128 multiplied=128 skinned=0
  environment              nodes=262 composed=262 multiplied=262 skinned=0
  settlement               nodes=1342 composed=1342 multiplied=1342 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2637 composed=2637 multiplied=2637 skinned=212
  items                    nodes=371 composed=371 multiplied=371 skinned=0
  other                    nodes=671 composed=654 multiplied=671 skinned=9
  top scene children:
    fauna ×61                nodes=2637 composed=2637 multiplied=2637 skinned=212
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1342 composed=1342 multiplied=1342 skinned=0
    Group ×78                nodes=502 composed=502 multiplied=502 skinned=9
    chunk-items ×26          nodes=371 composed=371 multiplied=371 skinned=0
    chunk-environmen ×5      nodes=214 composed=214 multiplied=214 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×18           nodes=60 composed=60 multiplied=60 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          2.6 ms
  NPC            2.4 ms
  FAUNA          1.8 ms
  PHYSICS        0.1 ms
  RENDER         16.0 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=14.4 ms draws=1815 tris=10.48M
  hide-grass         render=14.4 ms draws=1773 tris=5.57M
  hide-vegetation    render=13.9 ms draws=1767 tris=10.32M
  hide-vegetation-grass render=14.3 ms draws=1732 tris=5.42M
  hide-environment   render=14.2 ms draws=1720 tris=10.47M
  hide-settlement    render=10.9 ms draws=1000 tris=9.46M
  hide-water         render=14.8 ms draws=1804 tris=10.32M
  hide-terrain       render=13.3 ms draws=1755 tris=6.57M
  hide-npc-fauna     render=9.1 ms draws=1501 tris=10.20M
  no-shadows         render=7.8 ms draws=1303 tris=8.45M
  no-ao              render=11.0 ms draws=1800 tris=10.48M
  no-bloom           render=11.1 ms draws=1801 tris=10.49M
  no-smaa            render=11.5 ms draws=1819 tris=10.49M
  no-god-rays        render=13.5 ms draws=1829 tris=10.50M
  no-film-grade      render=13.2 ms draws=1836 tris=10.50M
  no-postprocessing  render=13.1 ms draws=1808 tris=10.50M
  no-reflections     render=11.5 ms draws=1548 tris=9.72M

Frame attribution:
  frame max: 432.6 ms
  largest labelled hitch: 0 ms
  unattributed: 432.6 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 432.6 ms

Raw sidecar:
  sampling=full factor=1 exported=1174/1174

Recommendation:
Largest frame (432.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.4 ms/frame
  crowd pass: 0.0 ms/frame (13.6 ms cumulative)
  agent updates: 1.5 ms/frame (1743.5 ms cumulative)
  livestock: 0.7 ms/frame (812.5 ms cumulative)
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
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (47.1 predator candidates/frame)
    pest scans: 2.1/frame (2.1 rat candidates/frame)
    nearest scans: 10.8/frame (0.0 candidates/frame)
    water samples: 21.9/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 21.9/frame, 0.00 ms/frame (worst call 0.20 ms, 1681.8 colliders/frame)
    full-rate agents/frame: 1.6
    reduced-cadence agents/frame: 25.0
    behaviour executions/frame: 11.1
    presentation executions/frame: 10.9
  rats: 0.1 ms/frame (82.3 ms cumulative)
  social: 0.0 ms/frame (7.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (144.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.8 ms/frame
  agent updates: 1.8 ms/frame (2122.1 ms cumulative)
  forest sampling: 0.1 ms/frame (116.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (26.8 ms cumulative)
    targeting: 0.0 ms/frame (23.9 ms cumulative)
    decision: 0.0 ms/frame (28.0 ms cumulative)
    behaviour: 1.2 ms/frame (1364.0 ms cumulative)
    life/presentation: 0.4 ms/frame (440.2 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.6
    expensive behaviour agents/frame: 14.4
    full-rate agents/frame: 7.9
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 14.9
    presentation executions/frame: 13.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 443.7
    player perception checks/frame: 30.0

  nearest scans: 19.4/frame (22810 calls)
  nearest candidates checked: 189.5/frame (222452 total)
  herd leader scans: 0.1/frame (168 calls)
  herd candidates checked: 4.3/frame (5040 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 17.7/frame (101.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 61.5/frame, 0.10 ms/frame (worst call 1.00 ms)
    collider queries: 61.5/frame, 0.10 ms/frame (worst call 1.00 ms, 5952.7 colliders/frame)

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
Frames: 1183
Shadow refresh frames: 1183
Shadow skipped frames: 0

Mirror:
  calls avg: 289  tris avg: 791010
  info calls avg: 289  residual calls avg: 0
  switches avg: material=104.9 program=54.5  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=0 tris=434
  other                        calls=111 tris=5902
  settlement:decor             calls=25 tris=53939
  settlement:fence             calls=2 tris=3229
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=10 tris=504
  settlement:fireHouseInteriorLamp calls=3 tris=378
  settlement:fireVillageTorch  calls=10 tris=715
  settlement:houseInteractive  calls=10 tris=1154
  settlement:houseStatic       calls=26 tris=32594
  settlement:landmarkGarden    calls=6 tris=70093
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
  terrain                      calls=8 tris=589050
  vegetation                   calls=2 tris=675

Shadow (refresh only):
  calls avg: 521  tris avg: 2026948
  info calls avg: 521  residual calls avg: 0
  switches avg: material=159 program=170.1  actor: calls=108.5 material=0 program=11.1
  skinning avg: skinned calls=102.5 skeletons first used=24
  environment                  calls=2 tris=1736
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=6 tris=1782
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=1 tris=715
  npcFamily:Peasant            calls=10 tris=11703
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=83 tris=14189
  settlement:decor             calls=193 tris=370162
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
  calls avg: 998  tris avg: 7666188
  info calls avg: 1519  residual calls avg: 0
  switches avg: material=373.5 program=179.3  actor: calls=204 material=122.5 program=55.3
  skinning avg: skinned calls=197 skeletons first used=32.1
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=0 tris=25
  faunaFamily:dog              calls=27 tris=9660
  faunaFamily:horse            calls=15 tris=4266
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=9 tris=2883
  faunaFamily:wolf             calls=17 tris=8236
  grass                        calls=43 tris=4905808
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=18 tris=26284
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=0 tris=578
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=1 tris=1856
  other                        calls=264 tris=21218
  settlement:decor             calls=48 tris=102204
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
Long frames: 6
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 6 total):

[LONG FRAME] 432.6ms
simulate         3.2ms
render         429.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.1ms
STREAMING        0.1ms
NPC              1.5ms
FAUNA            0.8ms
PHYSICS          0.1ms
RENDER         425.0ms
OTHER            1.0ms

streaming / stages:
  chunkUpdate                  0.1ms

Long frame #2:

[LONG FRAME] 165.2ms
simulate       143.1ms
render          21.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.9ms
STREAMING        0.0ms
NPC              2.2ms
FAUNA          139.5ms
PHYSICS          0.0ms
RENDER          16.0ms
OTHER            1.6ms

Long frame #3:

[LONG FRAME] 155.6ms
simulate       140.2ms
render          15.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.9ms
FAUNA          136.6ms
PHYSICS          0.2ms
RENDER          15.0ms
OTHER            1.8ms

Long frame #4:

[LONG FRAME] 113.9ms
simulate        97.2ms
render          16.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            4.6ms
STREAMING        0.0ms
NPC              2.3ms
FAUNA           93.5ms
PHYSICS          0.0ms
RENDER          11.9ms
OTHER            1.6ms

Long frame #5:

[LONG FRAME] 97.7ms
simulate        76.5ms
render          21.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.0ms
STREAMING        0.0ms
NPC              2.1ms
FAUNA           72.7ms
PHYSICS          0.1ms
RENDER          16.1ms
OTHER            1.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=14.4 ms  p95=16.3 ms  max=17.5 ms  Δavg vs baseline=—
  hide-grass           avg=14.4 ms  p95=16.0 ms  max=16.2 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=13.9 ms  p95=15.5 ms  max=16.3 ms  Δavg vs baseline=-0.5 ms (-3%)
  no vegetation/grass  avg=14.3 ms  p95=15.6 ms  max=15.9 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-environment     avg=14.2 ms  p95=15.2 ms  max=16.9 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-settlement      avg=10.9 ms  p95=12.3 ms  max=13.2 ms  Δavg vs baseline=-3.5 ms (-25%)
  no water             avg=14.8 ms  p95=16.1 ms  max=16.3 ms  Δavg vs baseline=+0.4 ms (+3%)
  hide-terrain         avg=13.3 ms  p95=14.2 ms  max=14.9 ms  Δavg vs baseline=-1.1 ms (-8%)
  hide-npc-fauna       avg=9.1 ms  p95=11.1 ms  max=11.4 ms  Δavg vs baseline=-5.3 ms (-37%)
  no-shadows           avg=7.8 ms  p95=9.1 ms  max=10.2 ms  Δavg vs baseline=-6.5 ms (-46%)
  no-ao                avg=11.0 ms  p95=12.2 ms  max=13.2 ms  Δavg vs baseline=-3.4 ms (-24%)
  no-bloom             avg=11.1 ms  p95=12.2 ms  max=12.9 ms  Δavg vs baseline=-3.3 ms (-23%)
  no-smaa              avg=11.5 ms  p95=12.5 ms  max=12.7 ms  Δavg vs baseline=-2.9 ms (-20%)
  no-god-rays          avg=13.5 ms  p95=15.5 ms  max=16.4 ms  Δavg vs baseline=-0.9 ms (-6%)
  no-film-grade        avg=13.2 ms  p95=15.4 ms  max=15.5 ms  Δavg vs baseline=-1.2 ms (-8%)
  no postprocessing    avg=13.1 ms  p95=17.1 ms  max=19.0 ms  Δavg vs baseline=-1.3 ms (-9%)
  no mirrors           avg=11.5 ms  p95=12.5 ms  max=14.5 ms  Δavg vs baseline=-2.9 ms (-20%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (34 samples resolved during the baseline window)
  GPU elapsed   avg=20.6 ms  p95=22.1 ms  max=22.4 ms
  CPU wall      avg=14.4 ms  p95=16.3 ms  max=17.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
