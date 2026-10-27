# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T17:30:42.917Z
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
Frames: 785
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: c460b224eadfa395e400da3413815327530adaf7
  runId: 2026-10-27T17-29-56-324Z-f85ese
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
  avg: 54
  min: 9
  p1: 38

Frame time (wall-clock):
  avg: 18.5 ms
  p50: 18.5 ms
  p95: 22.2 ms
  p99: 26.5 ms
  max: 110.6 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=6.1 p95=8.7 p99=14.7 max=98.1 n=785
  render: p50=11.7 p95=14.8 p99=16.2 max=19.8 n=785
  frame: p50=18.5 p95=22.2 p99=26.5 max=110.6 n=785

Rendering (combined renderer.info):
  draw calls: 323 avg / 543 max
  triangles: 5.03M avg
  mirror draws: 70 avg
  geometries: 559
  textures: 574

Pass submissions (actual):
  reliability: observed
  frames: 785 shadowRefresh=72 shadowSkipped=713
  mirror calls avg: 70
  shadow calls avg: 188
  main calls avg: 215

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
  other            draws=223 tris=26.2k meshes=223 inst=223

Shadow casters (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  vegetation       draws=95 tris=241.6k meshes=95 inst=170
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=442 tris=490.1k meshes=442 inst=985
  items            draws=16 tris=10.4k meshes=16 inst=16
  other            draws=106 tris=14.6k meshes=106 inst=106

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
  FAUNA          1.5 ms
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
  full               render=9.3 ms draws=319 tris=5.00M
  hide-grass         render=9.2 ms draws=280 tris=2.66M
  hide-vegetation    render=8.4 ms draws=302 tris=4.88M
  hide-vegetation-grass render=8.7 ms draws=276 tris=2.65M
  hide-environment   render=8.5 ms draws=329 tris=5.09M
  hide-settlement    render=7.5 ms draws=231 tris=4.93M
  hide-water         render=8.8 ms draws=321 tris=4.56M
  hide-terrain       render=8.9 ms draws=293 tris=3.24M
  hide-npc-fauna     render=5.9 ms draws=231 tris=4.97M
  no-shadows         render=9.0 ms draws=322 tris=5.00M
  no-ao              render=8.7 ms draws=319 tris=5.05M
  no-bloom           render=7.8 ms draws=307 tris=5.00M
  no-smaa            render=8.6 ms draws=317 tris=5.00M
  no-god-rays        render=8.5 ms draws=320 tris=5.00M
  no-film-grade      render=8.6 ms draws=315 tris=4.97M
  no-postprocessing  render=8.2 ms draws=308 tris=5.07M
  no-reflections     render=8.6 ms draws=255 tris=4.49M

Frame attribution:
  frame max: 110.6 ms
  largest labelled hitch: 0 ms
  unattributed: 110.6 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 110.6 ms

Raw sidecar:
  sampling=full factor=1 exported=785/785

Recommendation:
Largest frame (110.6 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.6 ms/frame
  crowd pass: 0.0 ms/frame (4.3 ms cumulative)
  agent updates: 0.8 ms/frame (658.6 ms cumulative)
  livestock: 0.5 ms/frame (361.2 ms cumulative)
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
    pest scans: 1.3/frame (1.3 rat candidates/frame)
    nearest scans: 8.1/frame (0.0 candidates/frame)
    water samples: 16.5/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 16.5/frame, 0.00 ms/frame (worst call 0.20 ms, 925.1 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.0
    behaviour executions/frame: 8.1
    presentation executions/frame: 6.9
  rats: 0.1 ms/frame (87.4 ms cumulative)
  social: 0.0 ms/frame (3.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (91.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.5 ms/frame
  agent updates: 1.5 ms/frame (1141.2 ms cumulative)
  forest sampling: 0.1 ms/frame (68.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.2 ms cumulative)
    targeting: 0.0 ms/frame (11.4 ms cumulative)
    decision: 0.0 ms/frame (7.6 ms cumulative)
    behaviour: 0.9 ms/frame (684.1 ms cumulative)
    life/presentation: 0.3 ms/frame (268.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.8
    decision passes/frame: 29.8
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.5
    full-rate agents/frame: 7.5
    reduced-cadence agents/frame: 22.3
    behaviour executions/frame: 17.5
    presentation executions/frame: 15.7

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 29.8
    village scan candidates/frame: 366.9
    player perception checks/frame: 29.8

  nearest scans: 24.8/frame (19435 calls)
  nearest candidates checked: 174.6/frame (137062 total)
  herd leader scans: 0.2/frame (192 calls)
  herd candidates checked: 7.3/frame (5760 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 24.1/frame (160.2 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 124.3/frame, 0.10 ms/frame (worst call 0.90 ms)
    collider queries: 124.3/frame, 0.10 ms/frame (worst call 1.10 ms, 8040.4 colliders/frame)

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
Frames: 785
Shadow refresh frames: 72
Shadow skipped frames: 713

Mirror:
  calls avg: 70  tris avg: 555701
  info calls avg: 70  residual calls avg: 0
  other                        calls=4 tris=4584
  settlement:decor             calls=38 tris=84344
  settlement:houseStatic       calls=9 tris=4191
  settlement:storageBarrel     calls=1 tris=1382
  settlement:storageContainer  calls=1 tris=252
  settlement:storageTrough     calls=1 tris=200
  terrain                      calls=5 tris=404987
  vegetation                   calls=9 tris=55911

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
  calls avg: 215  tris avg: 4329968
  info calls avg: 253  residual calls avg: 0
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
  vegetation                   calls=6 tris=61040
  water                        calls=8 tris=524288


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

[LONG FRAME] 110.6ms
simulate        98.1ms
render          12.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            3.9ms
STREAMING        0.0ms
NPC              1.4ms
FAUNA           92.9ms
PHYSICS          0.1ms
RENDER           8.5ms
OTHER            3.8ms

Long frame #2:

[LONG FRAME] 91.1ms
simulate        83.8ms
render           7.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.3ms
FAUNA           78.6ms
PHYSICS          0.1ms
RENDER           7.2ms
OTHER            3.8ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=9.3 ms  p95=10.4 ms  max=10.4 ms  Δavg vs baseline=—
  hide-grass           avg=9.2 ms  p95=10.5 ms  max=10.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-vegetation      avg=8.4 ms  p95=9.6 ms  max=9.8 ms  Δavg vs baseline=-0.9 ms (-10%)
  no vegetation/grass  avg=8.7 ms  p95=9.8 ms  max=9.9 ms  Δavg vs baseline=-0.7 ms (-7%)
  hide-environment     avg=8.5 ms  p95=9.5 ms  max=9.5 ms  Δavg vs baseline=-0.8 ms (-9%)
  hide-settlement      avg=7.5 ms  p95=8.8 ms  max=8.9 ms  Δavg vs baseline=-1.8 ms (-20%)
  no water             avg=8.8 ms  p95=10.2 ms  max=10.7 ms  Δavg vs baseline=-0.5 ms (-6%)
  hide-terrain         avg=8.9 ms  p95=9.7 ms  max=9.9 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-npc-fauna       avg=5.9 ms  p95=7.3 ms  max=7.5 ms  Δavg vs baseline=-3.5 ms (-37%)
  no-shadows           avg=9.0 ms  p95=10.3 ms  max=10.4 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-ao                avg=8.7 ms  p95=10.6 ms  max=11.7 ms  Δavg vs baseline=-0.6 ms (-6%)
  no-bloom             avg=7.8 ms  p95=9.0 ms  max=9.3 ms  Δavg vs baseline=-1.5 ms (-16%)
  no-smaa              avg=8.6 ms  p95=10.3 ms  max=11.6 ms  Δavg vs baseline=-0.8 ms (-8%)
  no-god-rays          avg=8.5 ms  p95=9.5 ms  max=9.6 ms  Δavg vs baseline=-0.8 ms (-9%)
  no-film-grade        avg=8.6 ms  p95=10.4 ms  max=10.6 ms  Δavg vs baseline=-0.7 ms (-8%)
  no postprocessing    avg=8.2 ms  p95=9.2 ms  max=9.4 ms  Δavg vs baseline=-1.1 ms (-12%)
  no mirrors           avg=8.6 ms  p95=10.0 ms  max=10.5 ms  Δavg vs baseline=-0.7 ms (-7%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
