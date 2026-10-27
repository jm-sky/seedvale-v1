# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:34:06.488Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: water
Duration: 30s
Frames: 813
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-33-20-750Z-1fptkh
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
  camera: pos=(-8.1, 0.9, 101.4)
  anchor: (-8.1, 100.5)
  gpuTimer: available=false resolved=false samples=0 span=unavailable

FPS:
  avg: 55.1
  min: 11
  p1: 38

Frame time (wall-clock):
  avg: 18.2 ms
  p50: 18.2 ms
  p95: 21.9 ms
  p99: 26.6 ms
  max: 94.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6 p95=8.3 p99=15.2 max=84.2 n=813
  render: p50=11.7 p95=14.8 p99=15.8 max=17.4 n=813
  frame: p50=18.2 p95=21.9 p99=26.6 max=94.4 n=813

Rendering (combined renderer.info):
  draw calls: 326 avg / 546 max
  triangles: 5.04M avg
  mirror draws: 70 avg
  geometries: 559
  textures: 574

Pass submissions (actual):
  reliability: observed
  frames: 813 shadowRefresh=74 shadowSkipped=739
  mirror calls avg: 70
  shadow calls avg: 188
  main calls avg: 218

Scene (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  grass            draws=56 tris=2.37M meshes=56 inst=213695
  vegetation       draws=97 tris=248.5k meshes=97 inst=172
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=722 tris=693.5k meshes=722 inst=1320
  water            draws=39 tris=2.81M meshes=39 inst=39
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=145 tris=13.5k meshes=145 inst=145
  other            draws=222 tris=26.0k meshes=222 inst=222

Shadow casters (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  vegetation       draws=95 tris=241.6k meshes=95 inst=170
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  items            draws=16 tris=10.4k meshes=16 inst=16
  other            draws=105 tris=14.4k meshes=105 inst=105

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=20 tris=8.9k meshes=20 inst=20
  storageContainer draws=32 tris=3.5k meshes=32 inst=46
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.2k meshes=8 inst=22
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=10 tris=1.1k meshes=10 inst=10
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=29 tris=540 meshes=29 inst=29

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=9 draws=82 tris=101.0k skinned=82/82
      Peasant_Boots    agents=4 draws=38 tris=49.3k skinned=38/38
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Wizard           agents=2 draws=24 tris=23.8k skinned=24/24
      blacksmith       agents=1 draws=10 tris=12.3k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      far  agents=20 camera-relevant=0 draws=192 tris=236.0k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      horse            agents=3 draws=24 tris=6.5k skinned=24/24
      dog              agents=4 draws=23 tris=7.8k skinned=23/23
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      sheep            agents=8 draws=16 tris=4.9k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      chicken          agents=3 draws=15 tris=1.9k skinned=0/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
    by distance band:
      far  agents=52 camera-relevant=0 draws=212 tris=88.3k

Systems:
  WATER          2.3 ms
  NPC            1.6 ms
  FAUNA          1.2 ms
  PHYSICS        0.1 ms
  RENDER         9.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=9.0 ms draws=322 tris=5.01M
  hide-grass         render=8.3 ms draws=298 tris=2.79M
  hide-vegetation    render=8.3 ms draws=311 tris=4.96M
  hide-vegetation-grass render=8.3 ms draws=263 tris=2.54M
  hide-environment   render=9.2 ms draws=332 tris=5.09M
  hide-settlement    render=8.1 ms draws=236 tris=4.99M
  hide-water         render=8.5 ms draws=314 tris=4.48M
  hide-terrain       render=8.9 ms draws=301 tris=3.26M
  hide-npc-fauna     render=6.1 ms draws=234 tris=4.97M
  no-shadows         render=7.6 ms draws=311 tris=4.89M
  no-ao              render=0.0 ms draws=0 tris=0
  no-bloom           render=0.0 ms draws=0 tris=0
  no-smaa            render=9.3 ms draws=325 tris=5.05M
  no-god-rays        render=8.7 ms draws=328 tris=5.05M
  no-film-grade      render=8.8 ms draws=329 tris=5.06M
  no-postprocessing  render=8.0 ms draws=288 tris=4.89M
  no-reflections     render=8.9 ms draws=259 tris=4.51M

Frame attribution:
  frame max: 94.4 ms
  largest labelled hitch: 0 ms
  unattributed: 94.4 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 94.4 ms

Raw sidecar:
  sampling=full factor=1 exported=813/813

Recommendation:
Largest frame (94.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.6 ms/frame
  crowd pass: 0.0 ms/frame (4.9 ms cumulative)
  agent updates: 0.9 ms/frame (706.9 ms cumulative)
  livestock: 0.5 ms/frame (387.2 ms cumulative)
    loaded tick: 0.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.5 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 19.0
    unique animals/frame: 19.0
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.0 predator candidates/frame)
    pest scans: 1.7/frame (1.7 rat candidates/frame)
    nearest scans: 8.1/frame (0.0 candidates/frame)
    water samples: 18.6/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 18.6/frame, 0.00 ms/frame (worst call 0.10 ms, 1111.4 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.0
    behaviour executions/frame: 8.1
    presentation executions/frame: 6.7
  rats: 0.1 ms/frame (92.6 ms cumulative)
  social: 0.0 ms/frame (3.1 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (88.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.2 ms/frame
  agent updates: 1.2 ms/frame (958.9 ms cumulative)
  forest sampling: 0.1 ms/frame (72.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.0 ms cumulative)
    targeting: 0.0 ms/frame (10.6 ms cumulative)
    decision: 0.0 ms/frame (9.8 ms cumulative)
    behaviour: 0.7 ms/frame (557.3 ms cumulative)
    life/presentation: 0.3 ms/frame (224.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.1
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.5
    behaviour executions/frame: 17.1
    presentation executions/frame: 14.9

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 367.1
    player perception checks/frame: 30.0

  nearest scans: 24.1/frame (19576 calls)
  nearest candidates checked: 178.5/frame (145080 total)
  herd leader scans: 0.2/frame (196 calls)
  herd candidates checked: 7.2/frame (5880 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 22.7/frame (144.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 75.7/frame, 0.10 ms/frame (worst call 1.60 ms)
    collider queries: 75.7/frame, 0.10 ms/frame (worst call 0.80 ms, 4463.6 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 14
Resident instances: full=506458 filler=1057227
Submitted instances: full=123730 filler=89957
Meshes submitted: 48
LOD submitted fraction: full=0.24430456227367323 filler=0.08508768693951252
Flowers: unavailable
Allocation bytes (estimated): 150113760
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 813
Shadow refresh frames: 74
Shadow skipped frames: 739

Mirror:
  calls avg: 70  tris avg: 555726
  info calls avg: 70  residual calls avg: 0
  other                        calls=4 tris=4584
  settlement:decor             calls=38 tris=84348
  settlement:houseStatic       calls=9 tris=4191
  settlement:storageBarrel     calls=1 tris=1382
  settlement:storageContainer  calls=1 tris=252
  settlement:storageTrough     calls=1 tris=200
  terrain                      calls=5 tris=405005
  vegetation                   calls=9 tris=55913

Shadow (refresh only):
  calls avg: 188  tris avg: 1622382
  info calls avg: 188  residual calls avg: 0
  other                        calls=35 tris=9772
  settlement:decor             calls=82 tris=168834
  settlement:fireHouseInteriorLamp calls=1 tris=108
  settlement:houseInteractive  calls=2 tris=314
  settlement:houseStatic       calls=21 tris=9880
  settlement:storageContainer  calls=4 tris=528
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=2 tris=891
  settlement:workplace         calls=1 tris=1648
  terrain                      calls=18 tris=1327104
  vegetation                   calls=20 tris=102903

Main:
  calls avg: 218  tris avg: 4333544
  info calls avg: 256  residual calls avg: 0
  grass                        calls=39 tris=2345972
  npcFamily:Knight_Cloth       calls=14 tris=12253
  npcFamily:Peasant            calls=42 tris=37084
  npcFamily:Peasant_Boots      calls=20 tris=17630
  npcFamily:Wizard             calls=10 tris=8872
  npcFamily:blacksmith         calls=4 tris=3477
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=18 tris=13480
  settlement:decor             calls=9 tris=37592
  settlement:houseStatic       calls=17 tris=8256
  settlement:storageBarrel     calls=3 tris=2768
  settlement:storageContainer  calls=2 tris=504
  settlement:storageTrough     calls=2 tris=400
  terrain                      calls=17 tris=1253092
  vegetation                   calls=9 tris=64616
  water                        calls=8 tris=524288


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

[LONG FRAME] 94.4ms
simulate        84.2ms
render           9.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.4ms
FAUNA           77.9ms
PHYSICS          0.1ms
RENDER           9.8ms
OTHER            4.1ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.0 ms  p95=10.5 ms  max=10.9 ms  Δavg vs baseline=—
  hide-grass           avg=8.3 ms  p95=9.6 ms  max=10.1 ms  Δavg vs baseline=-0.7 ms (-7%)
  hide-vegetation      avg=8.3 ms  p95=9.4 ms  max=9.9 ms  Δavg vs baseline=-0.7 ms (-8%)
  no vegetation/grass  avg=8.3 ms  p95=9.1 ms  max=9.1 ms  Δavg vs baseline=-0.7 ms (-8%)
  hide-environment     avg=9.2 ms  p95=10.5 ms  max=10.6 ms  Δavg vs baseline=+0.1 ms (+2%)
  hide-settlement      avg=8.1 ms  p95=9.0 ms  max=9.2 ms  Δavg vs baseline=-0.9 ms (-10%)
  no water             avg=8.5 ms  p95=9.2 ms  max=9.5 ms  Δavg vs baseline=-0.5 ms (-6%)
  hide-terrain         avg=8.9 ms  p95=11.0 ms  max=11.3 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-npc-fauna       avg=6.1 ms  p95=6.9 ms  max=7.0 ms  Δavg vs baseline=-2.9 ms (-32%)
  no-shadows           avg=7.6 ms  p95=7.8 ms  max=7.8 ms  Δavg vs baseline=-1.4 ms (-16%)
  no-ao                avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-9.0 ms (-100%)
  no-bloom             avg=0.0 ms  p95=0.0 ms  max=0.0 ms  Δavg vs baseline=-9.0 ms (-100%)
  no-smaa              avg=9.3 ms  p95=10.4 ms  max=10.6 ms  Δavg vs baseline=+0.3 ms (+3%)
  no-god-rays          avg=8.7 ms  p95=10.1 ms  max=10.9 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-film-grade        avg=8.8 ms  p95=9.4 ms  max=9.7 ms  Δavg vs baseline=-0.2 ms (-3%)
  no postprocessing    avg=8.0 ms  p95=9.2 ms  max=9.3 ms  Δavg vs baseline=-1.1 ms (-12%)
  no mirrors           avg=8.9 ms  p95=10.5 ms  max=11.2 ms  Δavg vs baseline=-0.1 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
