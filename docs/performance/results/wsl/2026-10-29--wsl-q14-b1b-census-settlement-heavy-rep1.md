# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T20:26:53.724Z
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
Frames: 403
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: ea33b4d32d4a376e4accf0bd24a2b8b4170a5ff9
  runId: 2026-10-29T20-25-17-471Z-hwgjk7
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
  camera: pos=(-572.2, 17.3, -1146.8)
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)
  populationGate: stable waited=9188ms npc=53
  gpuTimer: available=true resolved=true samples=403 span=postprocess+labels

FPS:
  avg: 26.9
  min: 12
  p1: 13

Frame time (wall-clock):
  avg: 37.1 ms
  p50: 36 ms
  p95: 43.5 ms
  p99: 79.8 ms
  max: 83.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.7 p95=9.1 p99=51.7 max=59.4 n=403
  render: p50=28.8 p95=35.9 p99=38.3 max=44.4 n=403
  frame: p50=36 p95=43.5 p99=79.8 max=83.4 n=403

Rendering (combined renderer.info):
  draw calls: 2220 avg / 2555 max
  triangles: 6.64M avg
  mirror draws: 325 avg
  geometries: 1018
  textures: 801

Pass submissions (actual):
  reliability: observed
  frames: 406 shadowRefresh=406 shadowSkipped=0
  mirror calls avg: 325
  shadow calls avg: 403
  main calls avg: 1492

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=74 tris=1.20M meshes=74 inst=117862
  vegetation       draws=234 tris=13.9k meshes=234 inst=624
  environment      draws=322 tris=16.5k meshes=322 inst=370
  settlement       draws=1336 tris=976.1k meshes=1336 inst=3402
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=501 tris=629.5k meshes=501 inst=501
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=512 tris=29.9k meshes=512 inst=514

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=205 tris=12.6k meshes=205 inst=570
  environment      draws=280 tris=5.2k meshes=280 inst=286
  settlement       draws=793 tris=446.1k meshes=793 inst=2685
  npc              draws=20 tris=25.8k meshes=20 inst=20
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=117 tris=15.1k meshes=117 inst=117

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=5 tris=4.8k meshes=5 inst=5
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=5 tris=21.8k meshes=5 inst=28
  storageContainer draws=76 tris=9.0k meshes=76 inst=122
  storageHay       draws=8 tris=3.9k meshes=8 inst=8
  storageTrough    draws=24 tris=7.0k meshes=24 inst=70
  workplace        draws=24 tris=14.1k meshes=24 inst=24
  landmarkWellCentral draws=25 tris=9.3k meshes=25 inst=25
  landmarkWellPasture draws=20 tris=7.5k meshes=20 inst=20
  landmarkGarden   draws=5 tris=8.8k meshes=5 inst=11
  landmarkNoticeBoard draws=10 tris=180 meshes=10 inst=10
  fireHouseInteriorLamp draws=28 tris=3.0k meshes=28 inst=28
  fireCampfire     draws=47 tris=876 meshes=47 inst=47
  decor            draws=236 tris=14.4k meshes=236 inst=319
  other            draws=59 tris=1.8k meshes=59 inst=59

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=28 draws=258 tris=310.4k skinned=258/258
      blacksmith       agents=5 draws=54 tris=75.6k skinned=54/54
      Wizard           agents=4 draws=47 tris=46.9k skinned=47/47
      Herbalist        agents=4 draws=41 tris=52.4k skinned=41/41
      woodcutter       agents=4 draws=29 tris=44.3k skinned=29/29
      Peasant_Boots    agents=3 draws=27 tris=36.7k skinned=27/27
      Farmer           agents=3 draws=25 tris=37.6k skinned=25/25
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
    by distance band:
      mid  agents=2 camera-relevant=2 draws=20 tris=25.8k
      far  agents=51 camera-relevant=19 draws=481 tris=603.7k
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
      far  agents=88 camera-relevant=21 draws=389 tris=149.0k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=76 composed=76 multiplied=76 skinned=0
  grass                    nodes=96 composed=96 multiplied=96 skinned=0
  vegetation               nodes=263 composed=263 multiplied=263 skinned=0
  environment              nodes=478 composed=478 multiplied=478 skinned=0
  settlement               nodes=2440 composed=2440 multiplied=2440 skinned=0
  water                    nodes=49 composed=49 multiplied=49 skinned=0
  npc                      nodes=4158 composed=4158 multiplied=4158 skinned=501
  fauna                    nodes=4345 composed=4345 multiplied=4345 skinned=364
  items                    nodes=816 composed=816 multiplied=816 skinned=0
  other                    nodes=785 composed=768 multiplied=785 skinned=9
  top scene children:
    fauna ×91                nodes=4345 composed=4345 multiplied=4345 skinned=364
    npc ×53                  nodes=4158 composed=4158 multiplied=4158 skinned=501
    settlement ×5            nodes=2440 composed=2440 multiplied=2440 skinned=0
    chunk-items ×46          nodes=805 composed=805 multiplied=805 skinned=0
    Group ×98                nodes=614 composed=614 multiplied=614 skinned=9
    chunk-environmen ×6      nodes=403 composed=403 multiplied=403 skinned=0
    chunk-grass ×22          nodes=96 composed=96 multiplied=96 skinned=0
    chunk ×76                nodes=76 composed=76 multiplied=76 skinned=0
    Root_Scene ×18           nodes=60 composed=60 multiplied=60 skinned=0
    chunk-water ×48          nodes=48 composed=48 multiplied=48 skinned=0
    chunk-river ×44          nodes=44 composed=44 multiplied=44 skinned=0
    Object3D ×31             nodes=31 composed=31 multiplied=31 skinned=0

Systems:
  WATER          3.5 ms
  NPC            4.4 ms
  FAUNA          1.9 ms
  PHYSICS        0.1 ms
  RENDER         25.7 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=25.5 ms draws=2214 tris=6.63M
  hide-grass         render=26.2 ms draws=2182 tris=6.32M
  hide-vegetation    render=26.2 ms draws=2034 tris=6.62M
  hide-vegetation-grass render=25.5 ms draws=2001 tris=6.30M
  hide-environment   render=22.0 ms draws=1872 tris=6.62M
  hide-settlement    render=18.0 ms draws=1421 tris=5.75M
  hide-water         render=28.5 ms draws=2204 tris=5.67M
  hide-terrain       render=26.8 ms draws=2162 tris=2.58M
  hide-npc-fauna     render=15.3 ms draws=1864 tris=6.31M
  no-shadows         render=18.0 ms draws=1830 tris=5.02M
  no-ao              render=29.5 ms draws=2210 tris=6.64M
  no-bloom           render=26.9 ms draws=2198 tris=6.64M
  no-smaa            render=26.4 ms draws=2195 tris=6.63M
  no-god-rays        render=27.2 ms draws=2204 tris=6.64M
  no-film-grade      render=27.0 ms draws=2203 tris=6.64M
  no-postprocessing  render=26.3 ms draws=2151 tris=6.62M
  no-reflections     render=22.7 ms draws=1857 tris=5.80M

Frame attribution:
  frame max: 83.4 ms
  largest labelled hitch: 0 ms
  unattributed: 83.4 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 83.4 ms

Raw sidecar:
  sampling=full factor=1 exported=403/403

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.4 ms/frame
  crowd pass: 0.0 ms/frame (6.9 ms cumulative)
  agent updates: 2.6 ms/frame (1046.2 ms cumulative)
  livestock: 1.4 ms/frame (551.0 ms cumulative)
    loaded tick: 1.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.7 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 56.4
    unique animals/frame: 50.4
    duplicate updates/frame: 6.0
    detached animals/frame: 0.0
    dog updates/frame: 13.1
    dog guard scans: 13.1/frame (104.8 predator candidates/frame)
    pest scans: 7.2/frame (7.2 rat candidates/frame)
    nearest scans: 29.9/frame (0.0 candidates/frame)
    water samples: 61.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 61.6/frame, 0.10 ms/frame (worst call 0.10 ms, 13352.1 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 56.2
    behaviour executions/frame: 30.0
    presentation executions/frame: 29.9
  rats: 0.1 ms/frame (51.3 ms cumulative)
  social: 0.0 ms/frame (2.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (88.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.9 ms/frame
  agent updates: 1.9 ms/frame (754.4 ms cumulative)
  forest sampling: 0.1 ms/frame (34.5 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (7.6 ms cumulative)
    targeting: 0.0 ms/frame (9.5 ms cumulative)
    decision: 0.0 ms/frame (4.1 ms cumulative)
    behaviour: 1.2 ms/frame (494.5 ms cumulative)
    life/presentation: 0.4 ms/frame (156.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.2
    full-rate agents/frame: 6.7
    reduced-cadence agents/frame: 23.0
    behaviour executions/frame: 18.2
    presentation executions/frame: 18.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 118.7
    village scan candidates/frame: 1463.9
    player perception checks/frame: 29.7

  nearest scans: 25.5/frame (10294 calls)
  nearest candidates checked: 452.4/frame (182335 total)
  herd leader scans: 0.4/frame (169 calls)
  herd candidates checked: 12.6/frame (5070 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.0/frame (163.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 37.0/frame, 0.00 ms/frame (worst call 1.80 ms)
    collider queries: 37.0/frame, 0.00 ms/frame (worst call 0.20 ms, 569.0 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 22
Resident instances: full=482171 filler=113472
Submitted instances: full=75310 filler=42552
Meshes submitted: 74
LOD submitted fraction: full=0.15618940168529422 filler=0.375
Flowers: unavailable
Allocation bytes (estimated): 57181728
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 406
Shadow refresh frames: 406
Shadow skipped frames: 0

Mirror:
  calls avg: 325  tris avg: 825964
  info calls avg: 325  residual calls avg: 0
  environment                  calls=53 tris=3900
  items                        calls=1 tris=632
  other                        calls=38 tris=2297
  settlement:decor             calls=1 tris=837
  settlement:fence             calls=2 tris=9292
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=15 tris=720
  settlement:fireHouseInteriorLamp calls=5 tris=540
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1650
  settlement:houseStatic       calls=33 tris=80502
  settlement:landmarkGarden    calls=5 tris=82803
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=5 tris=9350
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11764
  settlement:storageContainer  calls=28 tris=2316
  settlement:storageGoods      calls=40 tris=6974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=4 tris=1700
  settlement:storageWoodHousehold calls=1 tris=5850
  settlement:storageWoodSettlementPrimary calls=1 tris=546
  settlement:storageWoodSettlementSecondary calls=1 tris=2816
  settlement:workplace         calls=11 tris=5293
  terrain                      calls=8 tris=589824
  vegetation                   calls=24 tris=3332

Shadow (refresh only):
  calls avg: 403  tris avg: 1610928
  info calls avg: 403  residual calls avg: 0
  environment                  calls=88 tris=1952
  faunaFamily:chicken          calls=1 tris=96
  faunaFamily:cow              calls=4 tris=1243
  faunaFamily:dog              calls=7 tris=2133
  faunaFamily:sheep            calls=3 tris=978
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2362
  npcFamily:Peasant            calls=9 tris=10463
  npcFamily:Wizard             calls=6 tris=5684
  npcFamily:blacksmith         calls=11 tris=15296
  other                        calls=30 tris=8707
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
  settlement:storageWoodHousehold calls=1 tris=6240
  settlement:storageWoodSettlementPrimary calls=1 tris=1092
  settlement:storageWoodSettlementSecondary calls=2 tris=5632
  settlement:workplace         calls=9 tris=6690
  terrain                      calls=19 tris=1400832
  vegetation                   calls=74 tris=8616

Main:
  calls avg: 1492  tris avg: 4197423
  info calls avg: 1895  residual calls avg: 0
  environment                  calls=210 tris=10082
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=19 tris=5830
  grass                        calls=33 tris=315860
  items                        calls=204 tris=15910
  npcFamily:Farmer             calls=17 tris=25379
  npcFamily:Herbalist          calls=11 tris=14911
  npcFamily:Peasant            calls=119 tris=146157
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Wizard             calls=23 tris=23045
  npcFamily:blacksmith         calls=22 tris=30592
  other                        calls=141 tris=15128
  settlement:decor             calls=2 tris=1673
  settlement:fence             calls=4 tris=18584
  settlement:fireCampfire      calls=36 tris=455
  settlement:fireHouseExteriorLamp calls=30 tris=1440
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
  settlement:storageGoods      calls=85 tris=15184
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=8 tris=3400
  settlement:storageWoodHousehold calls=2 tris=11700
  settlement:storageWoodSettlementPrimary calls=2 tris=2184
  settlement:storageWoodSettlementSecondary calls=4 tris=11264
  settlement:workplace         calls=37 tris=15494
  terrain                      calls=28 tris=2064384
  vegetation                   calls=88 tris=7472
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 4
Shown: 4 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 4 shown, 4 total):

[LONG FRAME] 83.4ms
simulate        51.7ms
render          31.6ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.0ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA           46.1ms
PHYSICS          0.2ms
RENDER          25.7ms
OTHER            1.3ms

Long frame #2:

[LONG FRAME] 82.7ms
simulate        53.9ms
render          28.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            5.6ms
STREAMING        0.0ms
NPC              3.8ms
FAUNA           48.3ms
PHYSICS          0.1ms
RENDER          23.3ms
OTHER            1.6ms

Long frame #3:

[LONG FRAME] 81.6ms
simulate        59.4ms
render          22.1ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.3ms
STREAMING        0.0ms
NPC              6.5ms
FAUNA           50.6ms
PHYSICS          0.2ms
RENDER          22.0ms
OTHER            1.9ms

Long frame #4:

[LONG FRAME] 80.1ms
simulate        55.1ms
render          24.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              5.0ms
FAUNA           48.4ms
PHYSICS          0.1ms
RENDER          24.8ms
OTHER            1.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=25.5 ms  p95=28.4 ms  max=28.9 ms  Δavg vs baseline=—
  hide-grass           avg=26.2 ms  p95=29.4 ms  max=30.1 ms  Δavg vs baseline=+0.7 ms (+3%)
  hide-vegetation      avg=26.2 ms  p95=29.7 ms  max=30.3 ms  Δavg vs baseline=+0.7 ms (+3%)
  no vegetation/grass  avg=25.5 ms  p95=28.2 ms  max=29.2 ms  Δavg vs baseline=+0.1 ms (+0%)
  hide-environment     avg=22.0 ms  p95=23.8 ms  max=24.3 ms  Δavg vs baseline=-3.5 ms (-14%)
  hide-settlement      avg=18.0 ms  p95=19.3 ms  max=19.6 ms  Δavg vs baseline=-7.5 ms (-30%)
  no water             avg=28.5 ms  p95=39.0 ms  max=43.7 ms  Δavg vs baseline=+3.0 ms (+12%)
  hide-terrain         avg=26.8 ms  p95=29.9 ms  max=33.2 ms  Δavg vs baseline=+1.3 ms (+5%)
  hide-npc-fauna       avg=15.3 ms  p95=17.0 ms  max=19.1 ms  Δavg vs baseline=-10.2 ms (-40%)
  no-shadows           avg=18.0 ms  p95=19.7 ms  max=19.7 ms  Δavg vs baseline=-7.5 ms (-29%)
  no-ao                avg=29.5 ms  p95=39.9 ms  max=43.6 ms  Δavg vs baseline=+4.0 ms (+16%)
  no-bloom             avg=26.9 ms  p95=30.8 ms  max=30.9 ms  Δavg vs baseline=+1.4 ms (+5%)
  no-smaa              avg=26.4 ms  p95=29.8 ms  max=30.7 ms  Δavg vs baseline=+0.9 ms (+4%)
  no-god-rays          avg=27.2 ms  p95=31.4 ms  max=31.6 ms  Δavg vs baseline=+1.7 ms (+7%)
  no-film-grade        avg=27.0 ms  p95=32.1 ms  max=33.6 ms  Δavg vs baseline=+1.5 ms (+6%)
  no postprocessing    avg=26.3 ms  p95=41.4 ms  max=48.5 ms  Δavg vs baseline=+0.8 ms (+3%)
  no mirrors           avg=22.7 ms  p95=24.0 ms  max=24.1 ms  Δavg vs baseline=-2.8 ms (-11%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=35.1 ms  p95=48.6 ms  max=49.0 ms
  CPU wall      avg=25.5 ms  p95=28.4 ms  max=28.9 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
