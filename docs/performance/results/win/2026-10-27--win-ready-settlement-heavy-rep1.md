# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:24:12.185Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Frames: 602
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-22-55-189Z-74hprc
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
  viewport: 1600x900
  drawingBuffer: 1600x900
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=6052ms npc=69
  gpuTimer: available=true resolved=true samples=606 span=postprocess+labels

FPS:
  avg: 23.7
  min: 8
  p1: 11

Frame time (wall-clock):
  avg: 42.2 ms
  p50: 42.6 ms
  p95: 75 ms
  p99: 87.7 ms
  max: 130.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=9.9 p95=49.9 p99=56.7 max=99 n=602
  render: p50=29.4 p95=34 p99=35.1 max=37.1 n=602
  frame: p50=42.6 p95=75 p99=87.7 max=130.4 n=602

Rendering (combined renderer.info):
  draw calls: 2441 avg / 2809 max
  triangles: 7.93M avg
  mirror draws: 352 avg
  geometries: 973
  textures: 1090

Pass submissions (actual):
  reliability: observed
  frames: 607 shadowRefresh=607 shadowSkipped=0
  mirror calls avg: 353
  shadow calls avg: 424
  main calls avg: 1665

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=1902 tris=1.61M meshes=1902 inst=4389
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=672 tris=808.3k meshes=672 inst=672
  fauna            draws=471 tris=178.6k meshes=471 inst=471
  items            draws=574 tris=55.0k meshes=574 inst=574
  other            draws=523 tris=30.0k meshes=523 inst=525

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=228 tris=43.6k meshes=228 inst=242
  settlement       draws=984 tris=916.8k meshes=984 inst=3248
  npc              draws=20 tris=23.5k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=74 tris=42.5k meshes=74 inst=74
  other            draws=128 tris=15.2k meshes=128 inst=128

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=193 tris=300.0k meshes=193 inst=1943
  houseInteractive draws=72 tris=11.3k meshes=72 inst=72
  fence            draws=18 tris=61.0k meshes=18 inst=302
  storageWoodSettlementPrimary draws=14 tris=10.0k meshes=14 inst=14
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=72 tris=32.1k meshes=72 inst=72
  storageContainer draws=100 tris=11.7k meshes=100 inst=158
  storageHay       draws=10 tris=4.9k meshes=10 inst=10
  storageTrough    draws=30 tris=8.8k meshes=30 inst=88
  workplace        draws=31 tris=19.9k meshes=31 inst=31
  landmarkWellCentral draws=35 tris=13.1k meshes=35 inst=35
  landmarkWellPasture draws=25 tris=9.3k meshes=25 inst=25
  landmarkGarden   draws=7 tris=11.2k meshes=7 inst=14
  landmarkNoticeBoard draws=14 tris=252 meshes=14 inst=14
  fireHouseInteriorLamp draws=36 tris=3.9k meshes=36 inst=36
  fireCampfire     draws=44 tris=1.7k meshes=44 inst=44
  decor            draws=198 tris=398.6k meshes=198 inst=305
  other            draws=79 tris=2.2k meshes=79 inst=79

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=33 draws=300 tris=363.4k skinned=300/300
      Wizard           agents=9 draws=107 tris=106.4k skinned=107/107
      Peasant_Boots    agents=9 draws=84 tris=109.3k skinned=84/84
      blacksmith       agents=6 draws=64 tris=77.2k skinned=64/64
      Herbalist        agents=4 draws=41 tris=52.1k skinned=41/41
      Knight_Cloth     agents=4 draws=39 tris=50.3k skinned=39/39
      woodcutter       agents=4 draws=37 tris=49.6k skinned=37/37
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=23.5k
      far  agents=67 camera-relevant=19 draws=652 tris=784.8k
  Fauna:
    by family (sorted by draws):
      horse            agents=12 draws=96 tris=26.2k skinned=96/96
      dog              agents=17 draws=96 tris=33.0k skinned=96/96
      sheep            agents=27 draws=54 tris=16.5k skinned=54/54
      chicken          agents=8 draws=40 tris=5.2k skinned=0/40
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      cow              agents=4 draws=28 tris=9.8k skinned=28/28
      donkey           agents=3 draws=21 tris=6.0k skinned=21/21
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      rat              agents=7 draws=14 tris=28.0k skinned=14/14
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      mid  agents=3 camera-relevant=3 draws=10 tris=3.2k
      far  agents=106 camera-relevant=18 draws=461 tris=175.4k

Systems:
  WATER          3.9 ms
  NPC            4.7 ms
  FAUNA          3.7 ms
  PHYSICS        0.1 ms
  RENDER         25.4 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=24.9 ms draws=2437 tris=7.92M
  hide-grass         render=25.1 ms draws=2404 tris=7.61M
  hide-vegetation    render=24.6 ms draws=2260 tris=6.85M
  hide-vegetation-grass render=24.1 ms draws=2234 tris=6.53M
  hide-environment   render=24.3 ms draws=2188 tris=7.88M
  hide-settlement    render=20.3 ms draws=1521 tris=7.04M
  hide-water         render=24.7 ms draws=2418 tris=6.96M
  hide-terrain       render=24.4 ms draws=2380 tris=3.88M
  hide-npc-fauna     render=15.0 ms draws=1861 tris=7.42M
  no-shadows         render=20.6 ms draws=2035 tris=5.75M
  no-ao              render=25.0 ms draws=2433 tris=7.93M
  no-bloom           render=25.1 ms draws=2411 tris=7.92M
  no-smaa            render=24.8 ms draws=2413 tris=7.92M
  no-god-rays        render=24.6 ms draws=2416 tris=7.92M
  no-film-grade      render=24.7 ms draws=2417 tris=7.92M
  no-postprocessing  render=24.8 ms draws=2397 tris=7.93M
  no-reflections     render=24.5 ms draws=2063 tris=6.93M

Frame attribution:
  frame max: 130.4 ms
  largest labelled hitch: 0 ms
  unattributed: 130.4 ms

Long frames:
  threshold: 80 ms
  count: 21
  worst: 130.4 ms

Raw sidecar:
  sampling=full factor=1 exported=602/602

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 69
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (10.2 ms cumulative)
  agent updates: 2.8 ms/frame (1691.4 ms cumulative)
  livestock: 1.5 ms/frame (904.0 ms cumulative)
    loaded tick: 1.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.9 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 72.6
    unique animals/frame: 58.5
    duplicate updates/frame: 14.1
    detached animals/frame: 0.0
    dog updates/frame: 17.1
    dog guard scans: 17.1/frame (137.1 predator candidates/frame)
    pest scans: 8.9/frame (8.9 rat candidates/frame)
    nearest scans: 38.3/frame (0.0 candidates/frame)
    water samples: 78.8/frame, 0.10 ms/frame (worst call 0.80 ms)
    collider queries: 78.8/frame, 0.10 ms/frame (worst call 0.10 ms, 14699.4 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 72.3
    behaviour executions/frame: 38.5
    presentation executions/frame: 31.8
  rats: 0.2 ms/frame (100.0 ms cumulative)
  social: 0.0 ms/frame (3.2 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (129.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 3.7 ms/frame
  agent updates: 3.6 ms/frame (2189.5 ms cumulative)
  forest sampling: 0.1 ms/frame (40.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (9.5 ms cumulative)
    targeting: 0.0 ms/frame (18.1 ms cumulative)
    decision: 0.0 ms/frame (5.5 ms cumulative)
    behaviour: 3.2 ms/frame (1901.8 ms cumulative)
    life/presentation: 0.3 ms/frame (180.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.1
    full-rate agents/frame: 7.9
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 19.1
    presentation executions/frame: 17.5

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 151.2
    village scan candidates/frame: 2939.1
    player perception checks/frame: 30.2

  nearest scans: 26.5/frame (15979 calls)
  nearest candidates checked: 534.7/frame (321890 total)
  herd leader scans: 0.3/frame (152 calls)
  herd candidates checked: 7.6/frame (4560 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.8/frame (169.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 108.5/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 108.5/frame, 0.10 ms/frame (worst call 0.80 ms, 2093.2 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 23
Resident instances: full=482171 filler=1025429
Submitted instances: full=75310 filler=42954
Meshes submitted: 75
LOD submitted fraction: full=0.15618940168529422 filler=0.04188880946413647
Flowers: unavailable
Allocation bytes (estimated): 144729600
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 607
Shadow refresh frames: 607
Shadow skipped frames: 0

Mirror:
  calls avg: 353  tris avg: 991656
  info calls avg: 353  residual calls avg: 0
  environment                  calls=44 tris=8880
  items                        calls=1 tris=633
  other                        calls=38 tris=2281
  settlement:decor             calls=1 tris=838
  settlement:fence             calls=2 tris=9307
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3125
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1653
  settlement:houseStatic       calls=33 tris=80635
  settlement:landmarkGarden    calls=5 tris=82939
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=937
  settlement:landmarkWellHousehold calls=5 tris=9365
  settlement:landmarkWellPasture calls=3 tris=937
  settlement:other             calls=10 tris=351
  settlement:storageBarrel     calls=5 tris=11783
  settlement:storageContainer  calls=28 tris=2320
  settlement:storageGoods      calls=40 tris=6985
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1703
  settlement:storageWoodHousehold calls=10 tris=4462
  settlement:storageWoodSettlementPrimary calls=1 tris=1076
  settlement:storageWoodSettlementSecondary calls=1 tris=2821
  settlement:workplace         calls=11 tris=5302
  terrain                      calls=8 tris=590796
  vegetation                   calls=22 tris=161181

Shadow (refresh only):
  calls avg: 424  tris avg: 2176237
  info calls avg: 424  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=5 tris=1635
  faunaFamily:dog              calls=8 tris=2612
  faunaFamily:sheep            calls=4 tris=1253
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2557
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=2959
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=30 tris=8730
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
  settlement:storageWoodHousehold calls=16 tris=7128
  settlement:storageWoodSettlementPrimary calls=2 tris=2148
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=79 tris=554878

Main:
  calls avg: 1665  tris avg: 4760655
  info calls avg: 2089  residual calls avg: 0
  environment                  calls=132 tris=23306
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=12 tris=3716
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=19 tris=16560
  npcFamily:Peasant            calls=205 tris=215607
  npcFamily:Peasant_Boots      calls=57 tris=61836
  npcFamily:Wizard             calls=65 tris=61367
  npcFamily:blacksmith         calls=40 tris=42054
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=130 tris=14982
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=81 tris=5616
  settlement:fireHouseInteriorLamp calls=10 tris=1080
  settlement:fireVillageTorch  calls=15 tris=1073
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=161004
  settlement:landmarkGarden    calls=12 tris=210456
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=18700
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=22 tris=760
  settlement:storageBarrel     calls=12 tris=26296
  settlement:storageContainer  calls=58 tris=4884
  settlement:storageGoods      calls=79 tris=13948
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=18 tris=8019
  settlement:storageWoodSettlementPrimary calls=4 tris=4296
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=80 tris=370510
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 21
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 21 total):

[LONG FRAME] 130.4ms
simulate        95.2ms
render          35.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            9.4ms
STREAMING        0.0ms
NPC              4.6ms
FAUNA           86.7ms
PHYSICS          0.1ms
RENDER          25.8ms
OTHER            3.8ms

Long frame #2:

[LONG FRAME] 129.5ms
simulate        99.0ms
render          30.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.5ms
STREAMING        0.0ms
NPC              4.8ms
FAUNA           90.0ms
PHYSICS          0.1ms
RENDER          22.7ms
OTHER            4.4ms

Long frame #3:

[LONG FRAME] 93.2ms
simulate        61.9ms
render          31.1ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.7ms
STREAMING        0.0ms
NPC             11.5ms
FAUNA           45.6ms
PHYSICS          0.2ms
RENDER          23.4ms
OTHER            4.8ms

Long frame #4:

[LONG FRAME] 91.4ms
simulate        57.8ms
render          33.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.1ms
STREAMING        0.0ms
NPC              6.2ms
FAUNA           46.8ms
PHYSICS          0.1ms
RENDER          25.4ms
OTHER            4.8ms

Long frame #5:

[LONG FRAME] 90.4ms
simulate        57.0ms
render          33.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            8.3ms
STREAMING        0.0ms
NPC              5.1ms
FAUNA           47.2ms
PHYSICS          0.1ms
RENDER          25.0ms
OTHER            4.7ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=24.9 ms  p95=25.9 ms  max=26.9 ms  Δavg vs baseline=—
  hide-grass           avg=25.1 ms  p95=30.3 ms  max=34.4 ms  Δavg vs baseline=+0.2 ms (+1%)
  hide-vegetation      avg=24.6 ms  p95=29.4 ms  max=30.0 ms  Δavg vs baseline=-0.3 ms (-1%)
  no vegetation/grass  avg=24.1 ms  p95=25.1 ms  max=26.2 ms  Δavg vs baseline=-0.8 ms (-3%)
  hide-environment     avg=24.3 ms  p95=25.5 ms  max=26.0 ms  Δavg vs baseline=-0.6 ms (-2%)
  hide-settlement      avg=20.3 ms  p95=20.8 ms  max=21.0 ms  Δavg vs baseline=-4.6 ms (-19%)
  no water             avg=24.7 ms  p95=25.1 ms  max=26.0 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-terrain         avg=24.4 ms  p95=24.8 ms  max=25.5 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-npc-fauna       avg=15.0 ms  p95=15.5 ms  max=15.6 ms  Δavg vs baseline=-9.9 ms (-40%)
  no-shadows           avg=20.6 ms  p95=21.4 ms  max=21.4 ms  Δavg vs baseline=-4.3 ms (-17%)
  no-ao                avg=25.0 ms  p95=25.5 ms  max=26.9 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-bloom             avg=25.1 ms  p95=25.9 ms  max=26.2 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-smaa              avg=24.8 ms  p95=26.1 ms  max=27.0 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-god-rays          avg=24.6 ms  p95=25.6 ms  max=25.9 ms  Δavg vs baseline=-0.3 ms (-1%)
  no-film-grade        avg=24.7 ms  p95=25.7 ms  max=26.0 ms  Δavg vs baseline=-0.2 ms (-1%)
  no postprocessing    avg=24.8 ms  p95=26.3 ms  max=26.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no mirrors           avg=24.5 ms  p95=25.1 ms  max=25.5 ms  Δavg vs baseline=-0.4 ms (-2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=19.9 ms  p95=21.0 ms  max=21.7 ms
  CPU wall      avg=24.9 ms  p95=25.9 ms  max=26.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
