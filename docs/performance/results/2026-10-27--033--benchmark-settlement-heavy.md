# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T16:55:43.877Z
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
Frames: 258
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T16-54-51-970Z-nktumu
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
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 19.8
  min: 1
  p1: 7

Frame time (wall-clock):
  avg: 50.5 ms
  p50: 47.2 ms
  p95: 56.2 ms
  p99: 134.2 ms
  max: 669.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=12.5 p95=18.3 p99=28.4 max=39.8 n=258
  render: p50=34 p95=39.2 p99=123.3 max=630.8 n=258
  frame: p50=47.2 p95=56.2 p99=134.2 max=669.5 n=258

Rendering (combined renderer.info):
  draw calls: 2280 avg / 2703 max
  triangles: 7.76M avg
  mirror draws: 345 avg
  geometries: 959
  textures: 993

Pass submissions (actual):
  reliability: observed
  frames: 258 shadowRefresh=251 shadowSkipped=7
  mirror calls avg: 345
  shadow calls avg: 424
  main calls avg: 1522

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=1515 tris=1.38M meshes=1515 inst=3581
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=520 tris=621.3k meshes=520 inst=520
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=510 tris=29.7k meshes=510 inst=512

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=191 tris=40.0k meshes=191 inst=205
  settlement       draws=805 tris=833.3k meshes=805 inst=2697
  npc              draws=30 tris=35.1k meshes=30 inst=30
  fauna            draws=17 tris=5.6k meshes=17 inst=17
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=115 tris=14.8k meshes=115 inst=115

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=145 tris=259.2k meshes=145 inst=1577
  houseInteractive draws=56 tris=8.8k meshes=56 inst=56
  fence            draws=14 tris=54.5k meshes=14 inst=270
  storageWoodSettlementPrimary draws=10 tris=8.2k meshes=10 inst=10
  storageWoodSettlementSecondary draws=6 tris=16.9k meshes=6 inst=6
  storageWoodHousehold draws=56 tris=24.9k meshes=56 inst=56
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
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=59 tris=1.8k meshes=59 inst=59

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
      mid  agents=3 camera-relevant=2 draws=30 tris=35.1k
      far  agents=50 camera-relevant=17 draws=490 tris=586.2k
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
      mid  agents=4 camera-relevant=3 draws=17 tris=5.6k
      far  agents=87 camera-relevant=19 draws=382 tris=146.6k

Systems:
  WATER          6.2 ms
  NPC            5.3 ms
  FAUNA          2.2 ms
  PHYSICS        0.1 ms
  RENDER         30.8 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=25.6 ms draws=2251 tris=7.63M
  hide-grass         render=26.1 ms draws=2218 tris=7.31M
  hide-vegetation    render=23.8 ms draws=2209 tris=6.93M
  hide-vegetation-grass render=24.4 ms draws=2044 tris=6.28M
  hide-environment   render=25.5 ms draws=2095 tris=7.77M
  hide-settlement    render=21.5 ms draws=1401 tris=6.93M
  hide-water         render=25.1 ms draws=2309 tris=6.86M
  hide-terrain       render=25.1 ms draws=2202 tris=3.70M
  hide-npc-fauna     render=18.4 ms draws=1780 tris=7.25M
  no-shadows         render=0.0 ms draws=0 tris=0
  no-ao              render=29.0 ms draws=1985 tris=6.86M
  no-bloom           render=27.1 ms draws=2332 tris=7.85M
  no-smaa            render=29.5 ms draws=2338 tris=7.84M
  no-god-rays        render=27.0 ms draws=2335 tris=7.84M
  no-film-grade      render=26.5 ms draws=2257 tris=7.63M
  no-postprocessing  render=27.0 ms draws=2650 tris=8.81M
  no-reflections     render=26.2 ms draws=1969 tris=6.83M

Frame attribution:
  frame max: 669.5 ms
  largest labelled hitch: 0 ms
  unattributed: 669.5 ms

Long frames:
  threshold: 80 ms
  count: 4
  worst: 669.5 ms

Raw sidecar:
  sampling=full factor=1 exported=258/258

Recommendation:
Largest frame (669.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 5.3 ms/frame
  crowd pass: 0.0 ms/frame (4.5 ms cumulative)
  agent updates: 2.8 ms/frame (713.9 ms cumulative)
  livestock: 1.8 ms/frame (476.4 ms cumulative)
    loaded tick: 1.8 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.8 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.1 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.9 ms/frame
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 54.7
    unique animals/frame: 48.9
    duplicate updates/frame: 5.8
    detached animals/frame: 0.0
    dog updates/frame: 12.7
    dog guard scans: 12.7/frame (101.3 predator candidates/frame)
    pest scans: 7.2/frame (7.2 rat candidates/frame)
    nearest scans: 29.4/frame (0.0 candidates/frame)
    water samples: 57.0/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 57.0/frame, 0.10 ms/frame (worst call 0.30 ms, 12193.9 colliders/frame)
    full-rate agents/frame: 0.5
    reduced-cadence agents/frame: 54.2
    behaviour executions/frame: 29.4
    presentation executions/frame: 29.4
  rats: 0.3 ms/frame (65.5 ms cumulative)
  social: 0.0 ms/frame (2.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (74.0 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 2.2 ms/frame
  agent updates: 2.1 ms/frame (534.8 ms cumulative)
  forest sampling: 0.1 ms/frame (36.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (12.8 ms cumulative)
    targeting: 0.1 ms/frame (14.4 ms cumulative)
    decision: 0.0 ms/frame (5.0 ms cumulative)
    behaviour: 0.9 ms/frame (228.7 ms cumulative)
    life/presentation: 0.7 ms/frame (174.7 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.4
    full-rate agents/frame: 8.7
    reduced-cadence agents/frame: 21.3
    behaviour executions/frame: 19.4
    presentation executions/frame: 19.4

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 117.3
    village scan candidates/frame: 1572.9
    player perception checks/frame: 30.0

  nearest scans: 25.2/frame (6506 calls)
  nearest candidates checked: 419.9/frame (108345 total)
  herd leader scans: 0.2/frame (41 calls)
  herd candidates checked: 4.8/frame (1230 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.0/frame (190.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 75.2/frame, 0.10 ms/frame (worst call 1.70 ms)
    collider queries: 75.2/frame, 0.10 ms/frame (worst call 0.80 ms, 1391.6 colliders/frame)

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
Frames: 258
Shadow refresh frames: 251
Shadow skipped frames: 7

Mirror:
  calls avg: 345  tris avg: 986359
  info calls avg: 345  residual calls avg: 0
  environment                  calls=44 tris=8866
  items                        calls=1 tris=617
  other                        calls=34 tris=2254
  settlement:decor             calls=1 tris=824
  settlement:fence             calls=2 tris=9148
  settlement:fireCampfire      calls=9 tris=112
  settlement:fireHouseExteriorLamp calls=44 tris=3072
  settlement:fireHouseInteriorLamp calls=5 tris=532
  settlement:fireVillageTorch  calls=5 tris=352
  settlement:houseInteractive  calls=15 tris=1624
  settlement:houseStatic       calls=32 tris=79254
  settlement:landmarkGarden    calls=5 tris=81519
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=921
  settlement:landmarkWellHousehold calls=5 tris=9205
  settlement:landmarkWellPasture calls=2 tris=921
  settlement:other             calls=9 tris=343
  settlement:storageBarrel     calls=4 tris=11582
  settlement:storageContainer  calls=28 tris=2280
  settlement:storageGoods      calls=39 tris=6812
  settlement:storageHay        calls=1 tris=480
  settlement:storageTrough     calls=4 tris=1674
  settlement:storageWoodHousehold calls=10 tris=4351
  settlement:storageWoodSettlementPrimary calls=1 tris=1049
  settlement:storageWoodSettlementSecondary calls=1 tris=2772
  settlement:workplace         calls=11 tris=5211
  terrain                      calls=8 tris=589824
  vegetation                   calls=22 tris=160916

Shadow (refresh only):
  calls avg: 424  tris avg: 2178885
  info calls avg: 424  residual calls avg: 0
  environment                  calls=88 tris=22755
  faunaFamily:cow              calls=4 tris=1337
  faunaFamily:dog              calls=8 tris=2455
  faunaFamily:rat              calls=1 tris=1611
  faunaFamily:sheep            calls=4 tris=1089
  items                        calls=13 tris=8427
  npcFamily:Herbalist          calls=2 tris=2769
  npcFamily:Peasant            calls=9 tris=10351
  npcFamily:Wizard             calls=5 tris=4502
  npcFamily:blacksmith         calls=11 tris=13164
  other                        calls=29 tris=8631
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
  calls avg: 1522  tris avg: 4649842
  info calls avg: 1935  residual calls avg: 0
  environment                  calls=95 tris=19665
  faunaFamily:chicken          calls=15 tris=1906
  faunaFamily:cow              calls=7 tris=2403
  faunaFamily:dog              calls=34 tris=11444
  faunaFamily:donkey           calls=7 tris=1961
  faunaFamily:horse            calls=24 tris=6419
  faunaFamily:rat              calls=2 tris=3895
  faunaFamily:sheep            calls=14 tris=4301
  grass                        calls=33 tris=316772
  items                        calls=191 tris=15137
  npcFamily:Herbalist          calls=24 tris=26631
  npcFamily:Knight_Cloth       calls=10 tris=8610
  npcFamily:Peasant            calls=160 tris=174724
  npcFamily:Peasant_Boots      calls=41 tris=47698
  npcFamily:Wizard             calls=59 tris=55690
  npcFamily:blacksmith         calls=35 tris=37761
  npcFamily:woodcutter         calls=17 tris=15128
  other                        calls=119 tris=14905
  settlement:decor             calls=2 tris=1641
  settlement:fence             calls=4 tris=18224
  settlement:fireCampfire      calls=35 tris=446
  settlement:fireHouseExteriorLamp calls=79 tris=5507
  settlement:fireHouseInteriorLamp calls=10 tris=1059
  settlement:fireVillageTorch  calls=15 tris=1052
  settlement:houseInteractive  calls=29 tris=3236
  settlement:houseStatic       calls=65 tris=157884
  settlement:landmarkGarden    calls=12 tris=206377
  settlement:landmarkNoticeBoard calls=2 tris=35
  settlement:landmarkWellCentral calls=10 tris=3668
  settlement:landmarkWellHousehold calls=10 tris=18338
  settlement:landmarkWellPasture calls=5 tris=1834
  settlement:other             calls=22 tris=743
  settlement:storageBarrel     calls=12 tris=25786
  settlement:storageContainer  calls=57 tris=4789
  settlement:storageGoods      calls=77 tris=13570
  settlement:storageHay        calls=2 tris=957
  settlement:storageTrough     calls=8 tris=3334
  settlement:storageWoodHousehold calls=18 tris=7801
  settlement:storageWoodSettlementPrimary calls=4 tris=4179
  settlement:storageWoodSettlementSecondary calls=4 tris=11046
  settlement:workplace         calls=36 tris=15194
  terrain                      calls=28 tris=2064384
  vegetation                   calls=78 tris=347422
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

[LONG FRAME] 669.5ms
simulate        38.1ms
render         630.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           24.0ms
STREAMING        0.0ms
NPC             19.9ms
FAUNA            3.7ms
PHYSICS          0.1ms
RENDER         606.8ms
OTHER           15.0ms

Long frame #2:

[LONG FRAME] 489.3ms
simulate         8.5ms
render         480.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER          391.2ms
STREAMING        0.0ms
NPC              1.3ms
FAUNA            2.0ms
PHYSICS          0.2ms
RENDER          89.0ms
OTHER            5.6ms

Long frame #3:

[LONG FRAME] 169ms
simulate        12.2ms
render         156.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        0.0ms
NPC              4.1ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER         156.4ms
OTHER            6.6ms

Long frame #4:

[LONG FRAME] 108ms
simulate         9.3ms
render          98.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.8ms
FAUNA            1.3ms
PHYSICS          0.1ms
RENDER          98.2ms
OTHER            6.5ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=25.6 ms  p95=26.4 ms  max=26.4 ms  Δavg vs baseline=—
  hide-grass           avg=26.1 ms  p95=28.0 ms  max=28.3 ms  Δavg vs baseline=+0.5 ms (+2%)
  hide-vegetation      avg=23.8 ms  p95=24.5 ms  max=24.5 ms  Δavg vs baseline=-1.8 ms (-7%)
  no vegetation/grass  avg=24.4 ms  p95=25.4 ms  max=25.5 ms  Δavg vs baseline=-1.2 ms (-5%)
  hide-environment     avg=25.5 ms  p95=26.0 ms  max=26.1 ms  Δavg vs baseline=-0.1 ms (-0%)
  hide-settlement      avg=21.5 ms  p95=22.8 ms  max=23.1 ms  Δavg vs baseline=-4.1 ms (-16%)
  no water             avg=25.1 ms  p95=27.1 ms  max=27.3 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-terrain         avg=25.1 ms  p95=26.2 ms  max=26.4 ms  Δavg vs baseline=-0.5 ms (-2%)
  hide-npc-fauna       avg=18.4 ms  p95=23.5 ms  max=25.5 ms  Δavg vs baseline=-7.3 ms (-28%)
  no-shadows           avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-25.6 ms (-100%)
  no-ao                avg=29.0 ms  p95=29.0 ms  max=29.0 ms  Δavg vs baseline=+3.4 ms (+13%)
  no-bloom             avg=27.1 ms  p95=29.5 ms  max=30.0 ms  Δavg vs baseline=+1.5 ms (+6%)
  no-smaa              avg=29.5 ms  p95=35.3 ms  max=36.5 ms  Δavg vs baseline=+3.9 ms (+15%)
  no-god-rays          avg=27.0 ms  p95=27.5 ms  max=27.6 ms  Δavg vs baseline=+1.4 ms (+5%)
  no-film-grade        avg=26.5 ms  p95=28.5 ms  max=28.9 ms  Δavg vs baseline=+0.9 ms (+3%)
  no postprocessing    avg=27.0 ms  p95=27.0 ms  max=27.0 ms  Δavg vs baseline=+1.4 ms (+5%)
  no mirrors           avg=26.2 ms  p95=27.0 ms  max=27.1 ms  Δavg vs baseline=+0.6 ms (+2%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
