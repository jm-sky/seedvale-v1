# Seedvale Performance Benchmark Report

> Generated: 2026-09-21T08:16:37.941Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-heavy
Duration: 30s
Quality: High
Pixel ratio: 1

Reproducibility:
  fixture: tools-001-v1
  seed: 42
  elapsedDays: 0
  timeOfDay: 0.292
  season: spring
  weather: rain
  terrainResolution: 193
  loadRadius: 3
  grassMacroVariation: ON
  viewport: 1920x945
  anchor: (-572.2, -1158.1)
  settlement: Podgórze Górska (-2_-4) terrain=mountain size=XL families=8 residents=15 pos=(-572.2, -1158.1)

FPS:
  avg: 22.2
  min: 9
  p1: 13

Frame time:
  avg: 45 ms
  p95: 65.6 ms
  max: 114.3 ms

Rendering:
  draw calls: 2311 avg / 2694 max
  triangles: 8.00M avg
  mirror draws: 354 avg
  geometries: 1047
  textures: 929

Scene (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  grass            draws=89 tris=1.21M meshes=89 inst=118278
  vegetation       draws=214 tris=755.3k meshes=214 inst=599
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=1516 tris=1.38M meshes=1516 inst=3586
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=511 tris=1.16M meshes=511 inst=511
  fauna            draws=399 tris=152.2k meshes=399 inst=399
  items            draws=555 tris=44.6k meshes=555 inst=555
  other            draws=501 tris=36.5k meshes=501 inst=503

Shadow casters (one-pass estimate):
  terrain          draws=76 tris=5.60M meshes=76 inst=76
  vegetation       draws=202 tris=732.8k meshes=202 inst=587
  environment      draws=265 tris=47.3k meshes=265 inst=279
  settlement       draws=809 tris=834.9k meshes=809 inst=2705
  npc              draws=22 tris=47.7k meshes=22 inst=22
  fauna            draws=10 tris=3.2k meshes=10 inst=10
  items            draws=55 tris=32.2k meshes=55 inst=55
  other            draws=117 tris=25.3k meshes=117 inst=117

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
  other            draws=63 tris=3.4k meshes=63 inst=67

Systems:
  WATER          4.1 ms
  NPC            4.7 ms
  FAUNA          1.6 ms
  PHYSICS        0.1 ms
  RENDER         25.7 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  (none)

Hitches (>= 8 ms):
  (none)

Isolation probes:
  full               render=23.3 ms draws=2307 tris=7.99M
  hide-grass         render=24.0 ms draws=2278 tris=7.69M
  hide-vegetation    render=23.9 ms draws=2133 tris=6.91M
  hide-vegetation-grass render=22.2 ms draws=2096 tris=6.59M
  hide-environment   render=22.9 ms draws=2045 tris=8.04M
  hide-settlement    render=19.1 ms draws=1375 tris=7.10M
  hide-water         render=23.3 ms draws=2270 tris=6.95M
  hide-terrain       render=21.3 ms draws=2268 tris=3.96M
  hide-npc-fauna     render=14.4 ms draws=1940 tris=7.39M
  no-shadows         render=19.6 ms draws=1915 tris=5.79M
  no-ao              render=25.6 ms draws=2280 tris=7.91M
  no-bloom           render=22.6 ms draws=2268 tris=7.91M
  no-smaa            render=23.7 ms draws=2323 tris=8.02M
  no-god-rays        render=23.0 ms draws=2288 tris=7.92M
  no-film-grade      render=22.8 ms draws=2321 tris=8.02M
  no-postprocessing  render=24.6 ms draws=2288 tris=8.00M
  no-reflections     render=23.4 ms draws=1967 tris=7.02M

Frame attribution:
  frame max: 114.3 ms
  largest labelled hitch: 0 ms
  unattributed: 114.3 ms

Long frames:
  threshold: 80 ms
  count: 3
  worst: 114.3 ms

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (12.0 ms cumulative)
  agent updates: 2.7 ms/frame (1648.8 ms cumulative)
  livestock: 1.6 ms/frame (969.7 ms cumulative)
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
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 55.5
    unique animals/frame: 49.6
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.9
    dog guard scans: 12.9/frame (102.9 predator candidates/frame)
    pest scans: 7.1/frame (7.1 rat candidates/frame)
    nearest scans: 29.3/frame (0.0 candidates/frame)
    water samples: 58.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 58.1/frame, 0.10 ms/frame (worst call 1.40 ms, 12624.8 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 55.1
    behaviour executions/frame: 29.5
    presentation executions/frame: 25.2
  rats: 0.1 ms/frame (77.7 ms cumulative)
  social: 0.0 ms/frame (5.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (136.7 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.6 ms/frame (965.1 ms cumulative)
  forest sampling: 0.1 ms/frame (56.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (10.6 ms cumulative)
    targeting: 0.0 ms/frame (17.5 ms cumulative)
    decision: 0.0 ms/frame (7.2 ms cumulative)
    behaviour: 1.0 ms/frame (608.5 ms cumulative)
    life/presentation: 0.3 ms/frame (205.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.0
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 18.0
    presentation executions/frame: 16.8

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 117.4
    village scan candidates/frame: 1580.3
    player perception checks/frame: 29.7

  nearest scans: 26.5/frame (16217 calls)
  nearest candidates checked: 469.2/frame (287618 total)
  herd leader scans: 0.3/frame (157 calls)
  herd candidates checked: 7.7/frame (4710 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.7/frame (180.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 122.7/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 122.7/frame, 0.10 ms/frame (worst call 0.20 ms, 2057.0 colliders/frame)

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 53
  Fauna (agents): 30

NPC:
  total: 4.7 ms/frame
  crowd pass: 0.0 ms/frame (12.0 ms cumulative)
  agent updates: 2.7 ms/frame (1648.8 ms cumulative)
  livestock: 1.6 ms/frame (969.7 ms cumulative)
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
      life/presentation: 0.5 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 55.5
    unique animals/frame: 49.6
    duplicate updates/frame: 5.9
    detached animals/frame: 0.0
    dog updates/frame: 12.9
    dog guard scans: 12.9/frame (102.9 predator candidates/frame)
    pest scans: 7.1/frame (7.1 rat candidates/frame)
    nearest scans: 29.3/frame (0.0 candidates/frame)
    water samples: 58.1/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 58.1/frame, 0.10 ms/frame (worst call 1.40 ms, 12624.8 colliders/frame)
    full-rate agents/frame: 0.4
    reduced-cadence agents/frame: 55.1
    behaviour executions/frame: 29.5
    presentation executions/frame: 25.2
  rats: 0.1 ms/frame (77.7 ms cumulative)
  social: 0.0 ms/frame (5.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (136.7 ms cumulative)
  unattributed: 0.1 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.6 ms/frame (965.1 ms cumulative)
  forest sampling: 0.1 ms/frame (56.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (10.6 ms cumulative)
    targeting: 0.0 ms/frame (17.5 ms cumulative)
    decision: 0.0 ms/frame (7.2 ms cumulative)
    behaviour: 1.0 ms/frame (608.5 ms cumulative)
    life/presentation: 0.3 ms/frame (205.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.0
    full-rate agents/frame: 6.5
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 18.0
    presentation executions/frame: 16.8

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 117.4
    village scan candidates/frame: 1580.3
    player perception checks/frame: 29.7

  nearest scans: 26.5/frame (16217 calls)
  nearest candidates checked: 469.2/frame (287618 total)
  herd leader scans: 0.3/frame (157 calls)
  herd candidates checked: 7.7/frame (4710 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.7/frame (180.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 122.7/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 122.7/frame, 0.10 ms/frame (worst call 0.20 ms, 2057.0 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 1
  empty builds (no instances): 0
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.10 ms
    max 0.10 ms

  allocation/setup:
    avg 0.00 ms
    max 0.00 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.00 ms
    max 0.00 ms
  scene attach (`scene.add`):
    avg 0.10 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.30 ms
    max 0.30 ms

  per chunk:
    instances avg/max 46684.0 / 46684
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 14817 / 31867
    matrix instances bound: 46684
    instanced attributes created: 20
    shared material refs: 4
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 1/1
    instances: 5345 (max 5345)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 1/1
    instances: 1885 (max 1885)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 1/1
    instances: 7587 (max 7587)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 1/1
    instances: 31867 (max 31867)
    allocation/setup avg/max: 0.00 / 0.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

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

[LONG FRAME] 114.3ms
simulate        64.2ms
render          49.6ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           11.6ms
STREAMING        0.0ms
NPC              8.6ms
FAUNA           42.5ms
PHYSICS          0.2ms
RENDER          37.8ms
OTHER           13.5ms

Long frame #2:

[LONG FRAME] 109.1ms
simulate        37.8ms
render          70.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           25.5ms
STREAMING        0.0ms
NPC             20.1ms
FAUNA            1.8ms
PHYSICS          0.2ms
RENDER          45.2ms
OTHER           16.3ms

Long frame #3:

[LONG FRAME] 80.8ms
simulate        17.3ms
render          63.2ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER           18.2ms
STREAMING        0.0ms
NPC              6.1ms
FAUNA            0.9ms
PHYSICS          0.1ms
RENDER          45.1ms
OTHER           10.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=23.3 ms  p95=27.3 ms  max=28.2 ms  Δavg vs baseline=—
  hide-grass           avg=24.0 ms  p95=27.2 ms  max=27.3 ms  Δavg vs baseline=+0.6 ms (+3%)
  hide-vegetation      avg=23.9 ms  p95=27.2 ms  max=27.9 ms  Δavg vs baseline=+0.6 ms (+3%)
  no vegetation/grass  avg=22.2 ms  p95=25.4 ms  max=25.6 ms  Δavg vs baseline=-1.1 ms (-5%)
  hide-environment     avg=22.9 ms  p95=27.1 ms  max=28.0 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-settlement      avg=19.1 ms  p95=22.7 ms  max=23.3 ms  Δavg vs baseline=-4.2 ms (-18%)
  no water             avg=23.3 ms  p95=28.4 ms  max=29.7 ms  Δavg vs baseline=+0.0 ms (+0%)
  hide-terrain         avg=21.3 ms  p95=22.2 ms  max=22.4 ms  Δavg vs baseline=-2.0 ms (-9%)
  hide-npc-fauna       avg=14.4 ms  p95=16.2 ms  max=18.4 ms  Δavg vs baseline=-9.0 ms (-38%)
  no-shadows           avg=19.6 ms  p95=22.3 ms  max=22.4 ms  Δavg vs baseline=-3.7 ms (-16%)
  no-ao                avg=25.6 ms  p95=31.6 ms  max=35.0 ms  Δavg vs baseline=+2.3 ms (+10%)
  no-bloom             avg=22.6 ms  p95=27.2 ms  max=30.9 ms  Δavg vs baseline=-0.7 ms (-3%)
  no-smaa              avg=23.7 ms  p95=27.3 ms  max=28.1 ms  Δavg vs baseline=+0.3 ms (+2%)
  no-god-rays          avg=23.0 ms  p95=26.1 ms  max=26.4 ms  Δavg vs baseline=-0.4 ms (-2%)
  no-film-grade        avg=22.8 ms  p95=24.9 ms  max=25.5 ms  Δavg vs baseline=-0.5 ms (-2%)
  no postprocessing    avg=24.6 ms  p95=29.2 ms  max=29.3 ms  Δavg vs baseline=+1.2 ms (+5%)
  no mirrors           avg=23.4 ms  p95=26.1 ms  max=26.6 ms  Δavg vs baseline=+0.0 ms (+0%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
