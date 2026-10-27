# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T13:51:39.248Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 15s
Frames: 109
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: e124e866e0ec79cbb66aa99a029f87d6445b563e
  runId: 2026-10-27T13-51-12-800Z-xmc1yd
  phase: warm
  seed: 42
  elapsedDays: 0.3695756250007086
  timeOfDay: 0.633
  season: spring
  weather: rain
  terrainResolution: 65
  loadRadius: 3
  grassMacroVariation: ON
  viewport: 948x486
  drawingBuffer: 948x486
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 7.4
  min: 0
  p1: 4

Frame time (wall-clock):
  avg: 134.4 ms
  p50: 49.2 ms
  p95: 104.6 ms
  p99: 262 ms
  max: 8494.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=11.2 p95=61.8 p99=163.6 max=8441.7 n=109
  render: p50=36.1 p95=49 p99=102.5 max=211.2 n=109
  frame: p50=49.2 p95=104.6 p99=262 max=8494.7 n=109

Rendering (combined renderer.info):
  draw calls: 2327 avg / 2738 max
  triangles: 3.36M avg
  mirror draws: 339 avg
  geometries: 954
  textures: 1040

Pass submissions (actual):
  reliability: observed
  frames: 109 shadowRefresh=101 shadowSkipped=8
  mirror calls avg: 339
  shadow calls avg: 421
  main calls avg: 1596

Scene (one-pass estimate):
  terrain          draws=76 tris=622.6k meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118589
  vegetation       draws=214 tris=757.9k meshes=214 inst=600
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1520 tris=1.37M meshes=1520 inst=3586
  water            draws=49 tris=401.4k meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.0k meshes=555 inst=555
  other            draws=504 tris=29.9k meshes=504 inst=511

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=622.6k meshes=76 inst=76
  vegetation       draws=202 tris=735.4k meshes=202 inst=588
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=816 tris=830.1k meshes=816 inst=2708
  npc              draws=41 tris=45.8k meshes=41 inst=41
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=31.6k meshes=55 inst=55
  other            draws=114 tris=15.1k meshes=114 inst=114

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=11.0k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=30.6k meshes=56 inst=56
  storageContainer draws=76 tris=9.0k meshes=76 inst=122
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.0k meshes=24 inst=70
  workplace        draws=26 tris=17.4k meshes=26 inst=26
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=8.8k meshes=5 inst=11
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=28 tris=3.0k meshes=28 inst=28
  fireCampfire     draws=40 tris=1.1k meshes=40 inst=40
  decor            draws=203 tris=379.8k meshes=203 inst=309
  other            draws=64 tris=1.9k meshes=64 inst=64

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=24 draws=218 tris=262.4k skinned=218/218
      Wizard           agents=8 draws=95 tris=94.5k skinned=95/95
      Peasant_Boots    agents=6 draws=55 tris=72.1k skinned=55/55
      blacksmith       agents=5 draws=54 tris=64.9k skinned=54/54
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      woodcutter       agents=4 draws=37 tris=49.6k skinned=37/37
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=4 camera-relevant=2 draws=41 tris=45.8k
      far  agents=49 camera-relevant=18 draws=479 tris=575.5k
  Fauna:
    by family (sorted by draws):
      horse            agents=10 draws=80 tris=21.8k skinned=80/80
      dog              agents=13 draws=73 tris=25.2k skinned=73/73
      sheep            agents=20 draws=40 tris=12.2k skinned=40/40
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=5 draws=10 tris=20.0k skinned=10/10
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=88 camera-relevant=17 draws=389 tris=149.0k

Systems:
  WATER          4.9 ms
  NPC            86.7 ms
  FAUNA          3.9 ms
  PHYSICS        0.1 ms
  RENDER         33.4 ms

Detected bottlenecks:
  1. NPC
  2. RENDER
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=27.6 ms draws=2388 tris=3.45M
  hide-grass         render=28.4 ms draws=2394 tris=3.19M
  hide-vegetation    render=30.7 ms draws=2150 tris=2.29M
  hide-vegetation-grass render=30.5 ms draws=2227 tris=2.08M
  hide-environment   render=28.5 ms draws=2144 tris=3.42M
  hide-settlement    render=24.3 ms draws=1501 tris=2.58M
  hide-water         render=28.6 ms draws=2394 tris=3.36M
  hide-terrain       render=28.6 ms draws=2316 tris=2.98M
  hide-npc-fauna     render=17.8 ms draws=1881 tris=2.99M
  no-shadows         render=23.6 ms draws=1983 tris=2.51M
  no-ao              render=0.0 ms draws=0 tris=0
  no-bloom           render=0.0 ms draws=0 tris=0
  no-smaa            render=0.0 ms draws=0 tris=0
  no-god-rays        render=0.0 ms draws=0 tris=0
  no-film-grade      render=0.0 ms draws=0 tris=0
  no-postprocessing  render=0.0 ms draws=0 tris=0
  no-reflections     render=0.0 ms draws=0 tris=0

Frame attribution:
  frame max: 8494.7 ms
  largest labelled hitch: 0 ms
  unattributed: 8494.7 ms

Long frames:
  threshold: 80 ms
  count: 12
  worst: 8494.7 ms

Raw sidecar:
  sampling=full factor=1 exported=109/109

Recommendation:
Largest frame (8494.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 86.7 ms/frame
  crowd pass: 0.0 ms/frame (1.8 ms cumulative)
  agent updates: 83.1 ms/frame (9059.5 ms cumulative)
  livestock: 3.2 ms/frame (347.0 ms cumulative)
    loaded tick: 3.2 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 3.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 2.5 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 51.8
    unique animals/frame: 46.4
    duplicate updates/frame: 5.4
    detached animals/frame: 0.0
    dog updates/frame: 11.8
    dog guard scans: 11.8/frame (71.1 predator candidates/frame)
    pest scans: 6.8/frame (6.8 rat candidates/frame)
    nearest scans: 27.7/frame (0.0 candidates/frame)
    water samples: 172.5/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 172.5/frame, 0.20 ms/frame (worst call 0.20 ms, 27261.4 colliders/frame)
    full-rate agents/frame: 0.8
    reduced-cadence agents/frame: 51.0
    behaviour executions/frame: 27.7
    presentation executions/frame: 25.4
  rats: 0.2 ms/frame (21.2 ms cumulative)
  social: 0.0 ms/frame (0.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (15.8 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 3.9 ms/frame
  agent updates: 3.8 ms/frame (414.1 ms cumulative)
  forest sampling: 0.1 ms/frame (9.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (1.9 ms cumulative)
    targeting: 0.0 ms/frame (2.3 ms cumulative)
    decision: 0.0 ms/frame (1.7 ms cumulative)
    behaviour: 3.2 ms/frame (352.3 ms cumulative)
    life/presentation: 0.3 ms/frame (34.0 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 27.0
    decision passes/frame: 27.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.2
    full-rate agents/frame: 5.3
    reduced-cadence agents/frame: 21.7
    behaviour executions/frame: 16.2
    presentation executions/frame: 15.5

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 1456.9
    player perception checks/frame: 27.0

  nearest scans: 24.5/frame (2675 calls)
  nearest candidates checked: 406.8/frame (44342 total)
  herd leader scans: 0.2/frame (26 calls)
  herd candidates checked: 7.2/frame (780 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.6/frame (165.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 161.9/frame, 0.20 ms/frame (worst call 0.20 ms)
    collider queries: 161.9/frame, 0.10 ms/frame (worst call 0.50 ms, 2998.1 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 7
  empty builds (no instances): 2
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.07 ms
    max 0.10 ms

  allocation/setup:
    avg 0.07 ms
    max 0.10 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.03 ms
    max 0.10 ms
  scene attach (`scene.add`):
    avg 0.01 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.19 ms
    max 0.30 ms

  per chunk:
    instances avg/max 71141.7 / 230826
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 159997 / 337995
    matrix instances bound: 497992
    instanced attributes created: 140
    shared material refs: 28
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 7/7
    instances: 60451 (max 27709)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 7/7
    instances: 20272 (max 9286)
    allocation/setup avg/max: 0.03 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 7/7
    instances: 79274 (max 36895)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 7/7
    instances: 337995 (max 156936)
    allocation/setup avg/max: 0.01 / 0.10 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Grass Baseline]

Chunks resident: 23
Resident instances: full=483438 filler=1027980
Submitted instances: full=75474 filler=43101
Meshes submitted: 75
LOD submitted fraction: full=0.15611929554565426 filler=0.04192785851864822
Flowers: unavailable
Allocation bytes (estimated): 145096128
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=9 discard(unload=0,oor=0) cancel=0 streamIn=7 streamOut=0 invalidate=0
Finalization: observed completions=9

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 109
Shadow refresh frames: 101
Shadow skipped frames: 8

Mirror:
  calls avg: 339  tris avg: 467234
  info calls avg: 339  residual calls avg: 0
  environment                  calls=43 tris=8784
  items                        calls=1 tris=568
  other                        calls=37 tris=2216
  settlement:decor             calls=1 tris=829
  settlement:fence             calls=2 tris=9207
  settlement:fireCampfire      calls=7 tris=105
  settlement:fireHouseExteriorLamp calls=45 tris=3091
  settlement:fireHouseInteriorLamp calls=5 tris=535
  settlement:fireVillageTorch  calls=1 tris=341
  settlement:houseInteractive  calls=15 tris=1635
  settlement:houseStatic       calls=33 tris=79763
  settlement:landmarkGarden    calls=5 tris=82043
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=926
  settlement:landmarkWellHousehold calls=5 tris=9264
  settlement:landmarkWellPasture calls=2 tris=926
  settlement:other             calls=9 tris=347
  settlement:storageBarrel     calls=4 tris=11656
  settlement:storageContainer  calls=28 tris=2295
  settlement:storageGoods      calls=36 tris=6074
  settlement:storageHay        calls=1 tris=484
  settlement:storageTrough     calls=4 tris=1684
  settlement:storageWoodHousehold calls=9 tris=4030
  settlement:storageWoodSettlementPrimary calls=1 tris=966
  settlement:storageWoodSettlementSecondary calls=1 tris=2790
  settlement:workplace         calls=11 tris=5244
  terrain                      calls=8 tris=64935
  vegetation                   calls=22 tris=166625

Shadow (refresh only):
  calls avg: 421  tris avg: 933758
  info calls avg: 421  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:chicken          calls=0 tris=6
  faunaFamily:dog              calls=6 tris=2008
  faunaFamily:donkey           calls=0 tris=20
  faunaFamily:sheep            calls=4 tris=1268
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=0 tris=71
  npcFamily:Knight_Cloth       calls=0 tris=83
  npcFamily:Peasant            calls=10 tris=11754
  npcFamily:Peasant_Boots      calls=0 tris=76
  npcFamily:Wizard             calls=11 tris=11189
  npcFamily:blacksmith         calls=11 tris=13294
  other                        calls=28 tris=8599
  settlement:fence             calls=4 tris=19796
  settlement:fireCampfire      calls=12 tris=176
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:houseInteractive  calls=16 tris=2512
  settlement:houseStatic       calls=33 tris=89974
  settlement:landmarkGarden    calls=1 tris=2400
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=13 tris=240
  settlement:storageContainer  calls=20 tris=2460
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1800
  settlement:storageWoodHousehold calls=16 tris=7057
  settlement:storageWoodSettlementPrimary calls=2 tris=2127
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=155648
  vegetation                   calls=77 tris=552567

Main:
  calls avg: 1596  tris avg: 2026279
  info calls avg: 1988  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=3600
  faunaFamily:sheep            calls=13 tris=4048
  grass                        calls=33 tris=317712
  items                        calls=202 tris=15177
  npcFamily:Herbalist          calls=23 tris=25394
  npcFamily:Knight_Cloth       calls=10 tris=8693
  npcFamily:Peasant            calls=167 tris=185056
  npcFamily:Peasant_Boots      calls=42 tris=48295
  npcFamily:Wizard             calls=57 tris=54161
  npcFamily:blacksmith         calls=36 tris=38416
  npcFamily:woodcutter         calls=17 tris=15244
  other                        calls=138 tris=15002
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=28 tris=424
  settlement:fireHouseExteriorLamp calls=90 tris=6240
  settlement:fireHouseInteriorLamp calls=10 tris=1080
  settlement:fireVillageTorch  calls=3 tris=1032
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=161004
  settlement:landmarkGarden    calls=12 tris=210456
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=18700
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=22 tris=755
  settlement:storageBarrel     calls=12 tris=26296
  settlement:storageContainer  calls=58 tris=4884
  settlement:storageGoods      calls=74 tris=13168
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=18 tris=8060
  settlement:storageWoodSettlementPrimary calls=4 tris=3902
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=229376
  vegetation                   calls=84 tris=387463
  water                        calls=14 tris=114688


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 12
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 12 total):

[LONG FRAME] 8494.7ms
simulate      8441.7ms
render          52.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.7ms
STREAMING        0.0ms
NPC           8432.2ms
FAUNA            1.8ms
PHYSICS          0.1ms
RENDER          43.2ms
OTHER            7.7ms

Long frame #2:

[LONG FRAME] 264ms
simulate       159.2ms
render         104.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.8ms
STREAMING        0.0ms
NPC            149.9ms
FAUNA            1.7ms
PHYSICS          0.3ms
RENDER          93.8ms
OTHER            7.5ms

Long frame #3:

[LONG FRAME] 239.5ms
simulate        27.9ms
render         211.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.4ms
STREAMING        0.0ms
NPC              1.5ms
FAUNA           20.9ms
PHYSICS          0.0ms
RENDER         210.8ms
OTHER            5.9ms

Long frame #4:

[LONG FRAME] 203.9ms
simulate       164.0ms
render          39.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.9ms
STREAMING        0.0ms
NPC            157.2ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER          29.8ms
OTHER            5.9ms

Long frame #5:

[LONG FRAME] 198.8ms
simulate       155.4ms
render          43.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           10.3ms
STREAMING        0.0ms
NPC            149.9ms
FAUNA            0.7ms
PHYSICS          0.1ms
RENDER          32.9ms
OTHER            4.9ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=27.6 ms  p95=28.1 ms  max=28.2 ms  Δavg vs baseline=—
  hide-grass           avg=28.4 ms  p95=29.8 ms  max=29.9 ms  Δavg vs baseline=+0.8 ms (+3%)
  hide-vegetation      avg=30.7 ms  p95=36.5 ms  max=37.2 ms  Δavg vs baseline=+3.1 ms (+11%)
  no vegetation/grass  avg=30.5 ms  p95=32.4 ms  max=32.6 ms  Δavg vs baseline=+2.9 ms (+10%)
  hide-environment     avg=28.5 ms  p95=30.6 ms  max=31.1 ms  Δavg vs baseline=+0.8 ms (+3%)
  hide-settlement      avg=24.3 ms  p95=26.5 ms  max=27.2 ms  Δavg vs baseline=-3.3 ms (-12%)
  no water             avg=28.6 ms  p95=30.5 ms  max=31.3 ms  Δavg vs baseline=+0.9 ms (+3%)
  hide-terrain         avg=28.6 ms  p95=29.5 ms  max=29.5 ms  Δavg vs baseline=+0.9 ms (+3%)
  hide-npc-fauna       avg=17.8 ms  p95=18.5 ms  max=18.6 ms  Δavg vs baseline=-9.9 ms (-36%)
  no-shadows           avg=23.6 ms  p95=24.5 ms  max=24.6 ms  Δavg vs baseline=-4.1 ms (-15%)
  no-ao                avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)
  no-bloom             avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)
  no-smaa              avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)
  no-god-rays          avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)
  no-film-grade        avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)
  no postprocessing    avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)
  no mirrors           avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-27.6 ms (-100%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
