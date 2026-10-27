# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:27:23.504Z
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
Frames: 715
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-26-12-103Z-fvv4m2
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
  populationGate: stable waited=6310ms npc=69
  gpuTimer: available=true resolved=true samples=720 span=postprocess+labels

FPS:
  avg: 26.4
  min: 12
  p1: 19

Frame time (wall-clock):
  avg: 37.8 ms
  p50: 38.9 ms
  p95: 42 ms
  p99: 51.6 ms
  max: 85.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=9.6 p95=14.2 p99=21.8 max=62.3 n=715
  render: p50=29 p95=31.7 p99=32.7 max=35.5 n=715
  frame: p50=38.9 p95=42 p99=51.6 max=85.5 n=715

Rendering (combined renderer.info):
  draw calls: 2403 avg / 2777 max
  triangles: 7.93M avg
  mirror draws: 353 avg
  geometries: 974
  textures: 1049

Pass submissions (actual):
  reliability: observed
  frames: 721 shadowRefresh=721 shadowSkipped=0
  mirror calls avg: 353
  shadow calls avg: 420
  main calls avg: 1630

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1902 tris=1.61M meshes=1902 inst=4389
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=672 tris=808.3k meshes=672 inst=672
  fauna            draws=471 tris=178.6k meshes=471 inst=471
  items            draws=574 tris=55.0k meshes=574 inst=574
  other            draws=523 tris=30.0k meshes=523 inst=525

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=984 tris=916.8k meshes=984 inst=3248
  npc              draws=32 tris=35.4k meshes=32 inst=32
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
      mid  agents=3 camera-relevant=2 draws=32 tris=35.4k
      far  agents=66 camera-relevant=17 draws=640 tris=772.9k
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
      far  agents=106 camera-relevant=19 draws=461 tris=175.4k

Systems:
  WATER          3.7 ms
  NPC            4.7 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         23.4 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.7 ms draws=2403 tris=7.92M
  hide-grass         render=23.3 ms draws=2378 tris=7.62M
  hide-vegetation    render=21.9 ms draws=2217 tris=6.83M
  hide-vegetation-grass render=21.6 ms draws=2189 tris=6.52M
  hide-environment   render=22.0 ms draws=2167 tris=7.87M
  hide-settlement    render=18.7 ms draws=1491 tris=7.04M
  hide-water         render=22.3 ms draws=2381 tris=6.96M
  hide-terrain       render=22.0 ms draws=2330 tris=3.87M
  hide-npc-fauna     render=13.8 ms draws=1818 tris=7.42M
  no-shadows         render=19.6 ms draws=1987 tris=5.74M
  no-ao              render=22.7 ms draws=2374 tris=7.92M
  no-bloom           render=22.5 ms draws=2372 tris=7.93M
  no-smaa            render=22.7 ms draws=2374 tris=7.92M
  no-god-rays        render=22.6 ms draws=2372 tris=7.91M
  no-film-grade      render=22.5 ms draws=2375 tris=7.91M
  no-postprocessing  render=23.2 ms draws=2348 tris=7.92M
  no-reflections     render=22.6 ms draws=2023 tris=6.93M

Frame attribution:
  frame max: 85.5 ms
  largest labelled hitch: 0 ms
  unattributed: 85.5 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 85.5 ms

Raw sidecar:
  sampling=full factor=1 exported=715/715

Recommendation:
Largest frame (85.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 69
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (10.7 ms cumulative)
  agent updates: 2.8 ms/frame (1996.2 ms cumulative)
  livestock: 1.6 ms/frame (1124.0 ms cumulative)
    loaded tick: 1.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.6 ms/frame
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
    nearest scans: 36.7/frame (0.0 candidates/frame)
    water samples: 87.9/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 87.9/frame, 0.10 ms/frame (worst call 1.00 ms, 16978.7 colliders/frame)
    full-rate agents/frame: 0.3
    reduced-cadence agents/frame: 72.4
    behaviour executions/frame: 36.8
    presentation executions/frame: 29.3
  rats: 0.2 ms/frame (108.6 ms cumulative)
  social: 0.0 ms/frame (3.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (143.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.4 ms/frame (1017.6 ms cumulative)
  forest sampling: 0.1 ms/frame (46.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (11.3 ms cumulative)
    targeting: 0.0 ms/frame (24.0 ms cumulative)
    decision: 0.0 ms/frame (5.8 ms cumulative)
    behaviour: 1.0 ms/frame (691.9 ms cumulative)
    life/presentation: 0.3 ms/frame (195.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.3
    sensing passes/frame: 30.3
    decision passes/frame: 30.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.0
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.7
    behaviour executions/frame: 18.0
    presentation executions/frame: 16.1

  sensing/cache:
    forest samples/frame: 30.3
    fire scan candidates/frame: 151.3
    village scan candidates/frame: 2937.7
    player perception checks/frame: 30.3

  nearest scans: 25.5/frame (18226 calls)
  nearest candidates checked: 534.0/frame (381795 total)
  herd leader scans: 0.3/frame (245 calls)
  herd candidates checked: 10.3/frame (7350 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.9/frame (172.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 69.3/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 69.3/frame, 0.00 ms/frame (worst call 0.20 ms, 1237.8 colliders/frame)

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
Frames: 721
Shadow refresh frames: 721
Shadow skipped frames: 0

Mirror:
  calls avg: 353  tris avg: 991419
  info calls avg: 353  residual calls avg: 0
  environment                  calls=44 tris=8878
  items                        calls=1 tris=633
  other                        calls=38 tris=2300
  settlement:decor             calls=1 tris=838
  settlement:fence             calls=2 tris=9305
  settlement:fireCampfire      calls=9 tris=114
  settlement:fireHouseExteriorLamp calls=45 tris=3124
  settlement:fireHouseInteriorLamp calls=5 tris=541
  settlement:fireVillageTorch  calls=5 tris=358
  settlement:houseInteractive  calls=15 tris=1652
  settlement:houseStatic       calls=33 tris=80614
  settlement:landmarkGarden    calls=5 tris=82918
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=936
  settlement:landmarkWellHousehold calls=5 tris=9363
  settlement:landmarkWellPasture calls=3 tris=936
  settlement:other             calls=10 tris=350
  settlement:storageBarrel     calls=5 tris=11780
  settlement:storageContainer  calls=28 tris=2319
  settlement:storageGoods      calls=40 tris=6984
  settlement:storageHay        calls=1 tris=489
  settlement:storageTrough     calls=4 tris=1702
  settlement:storageWoodHousehold calls=10 tris=4461
  settlement:storageWoodSettlementPrimary calls=1 tris=1075
  settlement:storageWoodSettlementSecondary calls=1 tris=2820
  settlement:workplace         calls=11 tris=5300
  terrain                      calls=8 tris=590642
  vegetation                   calls=22 tris=161139

Shadow (refresh only):
  calls avg: 420  tris avg: 2176115
  info calls avg: 420  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=1 tris=234
  faunaFamily:dog              calls=6 tris=2074
  faunaFamily:sheep            calls=4 tris=1156
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=4 tris=4643
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=3 tris=2805
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=30 tris=8711
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
  calls avg: 1630  tris avg: 4758346
  info calls avg: 2050  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1944
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=35 tris=11670
  faunaFamily:donkey           calls=7 tris=2000
  faunaFamily:horse            calls=24 tris=6546
  faunaFamily:rat              calls=2 tris=4004
  faunaFamily:sheep            calls=13 tris=4072
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15171
  npcFamily:Herbalist          calls=25 tris=27250
  npcFamily:Knight_Cloth       calls=19 tris=16560
  npcFamily:Peasant            calls=206 tris=216542
  npcFamily:Peasant_Boots      calls=57 tris=61836
  npcFamily:Wizard             calls=65 tris=61367
  npcFamily:blacksmith         calls=40 tris=42054
  npcFamily:woodcutter         calls=17 tris=15319
  other                        calls=130 tris=15022
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
Long frames: 1
Shown: 1 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 1 shown, 1 total):

[LONG FRAME] 85.5ms
simulate        62.3ms
render          22.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              4.7ms
FAUNA           52.4ms
PHYSICS          0.1ms
RENDER          22.8ms
OTHER            5.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.7 ms  p95=23.5 ms  max=24.0 ms  Δavg vs baseline=—
  hide-grass           avg=23.3 ms  p95=25.7 ms  max=25.7 ms  Δavg vs baseline=+0.6 ms (+3%)
  hide-vegetation      avg=21.9 ms  p95=22.7 ms  max=22.8 ms  Δavg vs baseline=-0.8 ms (-4%)
  no vegetation/grass  avg=21.6 ms  p95=22.7 ms  max=22.9 ms  Δavg vs baseline=-1.1 ms (-5%)
  hide-environment     avg=22.0 ms  p95=23.0 ms  max=23.1 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-settlement      avg=18.7 ms  p95=19.6 ms  max=19.7 ms  Δavg vs baseline=-4.0 ms (-18%)
  no water             avg=22.3 ms  p95=23.0 ms  max=23.5 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-terrain         avg=22.0 ms  p95=23.0 ms  max=24.3 ms  Δavg vs baseline=-0.7 ms (-3%)
  hide-npc-fauna       avg=13.8 ms  p95=14.3 ms  max=14.9 ms  Δavg vs baseline=-9.0 ms (-39%)
  no-shadows           avg=19.6 ms  p95=20.8 ms  max=36.5 ms  Δavg vs baseline=-3.1 ms (-14%)
  no-ao                avg=22.7 ms  p95=23.9 ms  max=28.6 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-bloom             avg=22.5 ms  p95=23.3 ms  max=23.7 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=22.7 ms  p95=23.6 ms  max=23.8 ms  Δavg vs baseline=-0.1 ms (-0%)
  no-god-rays          avg=22.6 ms  p95=23.4 ms  max=24.4 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-film-grade        avg=22.5 ms  p95=23.4 ms  max=24.3 ms  Δavg vs baseline=-0.2 ms (-1%)
  no postprocessing    avg=23.2 ms  p95=24.6 ms  max=24.8 ms  Δavg vs baseline=+0.5 ms (+2%)
  no mirrors           avg=22.6 ms  p95=23.4 ms  max=23.6 ms  Δavg vs baseline=-0.1 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (33 samples resolved during the baseline window)
  GPU elapsed   avg=19.1 ms  p95=20.5 ms  max=20.8 ms
  CPU wall      avg=22.7 ms  p95=23.5 ms  max=24.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
