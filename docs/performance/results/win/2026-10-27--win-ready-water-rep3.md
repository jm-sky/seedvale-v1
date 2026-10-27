# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:55:08.898Z
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
Frames: 1671
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-54-15-710Z-tpfcnd
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
  populationGate: stable waited=5218ms npc=20
  gpuTimer: available=true resolved=true samples=1682 span=postprocess+labels

FPS:
  avg: 79.5
  min: 12
  p1: 34

Frame time (wall-clock):
  avg: 12.6 ms
  p50: 12.3 ms
  p95: 15.2 ms
  p99: 29.4 ms
  max: 80.5 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.8 p95=7.1 p99=16.6 max=74 n=1671
  render: p50=6.8 p95=9 p99=10.2 max=16.9 n=1671
  frame: p50=12.3 p95=15.2 p99=29.4 max=80.5 n=1671

Rendering (combined renderer.info):
  draw calls: 322 avg / 546 max
  triangles: 5.01M avg
  mirror draws: 66 avg
  geometries: 563
  textures: 574

Pass submissions (actual):
  reliability: observed
  frames: 1683 shadowRefresh=153 shadowSkipped=1530
  mirror calls avg: 66
  shadow calls avg: 188
  main calls avg: 218

Scene (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  grass            draws=56 tris=2.37M meshes=56 inst=213695
  vegetation       draws=97 tris=248.5k meshes=97 inst=172
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=723 tris=692.9k meshes=723 inst=1321
  water            draws=39 tris=2.81M meshes=39 inst=39
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=143 tris=15.1k meshes=143 inst=143
  other            draws=223 tris=26.2k meshes=223 inst=223

Shadow casters (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  vegetation       draws=95 tris=241.6k meshes=95 inst=170
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=443 tris=489.5k meshes=443 inst=986
  items            draws=18 tris=12.2k meshes=18 inst=18
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
  decor            draws=198 tris=391.0k meshes=198 inst=304
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
  WATER          1.3 ms
  NPC            1.2 ms
  FAUNA          1.0 ms
  PHYSICS        0.1 ms
  RENDER         5.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  FAUNA: 13
  RENDER: 5
  NPC: 4
  WATER: 1

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=5.7 ms draws=326 tris=5.05M
  hide-grass         render=5.5 ms draws=287 tris=2.71M
  hide-vegetation    render=5.5 ms draws=297 tris=4.84M
  hide-vegetation-grass render=5.2 ms draws=267 tris=2.57M
  hide-environment   render=5.5 ms draws=322 tris=5.01M
  hide-settlement    render=4.9 ms draws=231 tris=4.86M
  hide-water         render=5.5 ms draws=313 tris=4.47M
  hide-terrain       render=5.4 ms draws=298 tris=3.25M
  hide-npc-fauna     render=3.8 ms draws=232 tris=4.97M
  no-shadows         render=5.3 ms draws=310 tris=4.89M
  no-ao              render=5.5 ms draws=316 tris=5.01M
  no-bloom           render=5.5 ms draws=309 tris=5.01M
  no-smaa            render=5.7 ms draws=314 tris=4.98M
  no-god-rays        render=5.7 ms draws=316 tris=4.96M
  no-film-grade      render=5.6 ms draws=322 tris=5.01M
  no-postprocessing  render=5.6 ms draws=299 tris=5.01M
  no-reflections     render=5.9 ms draws=257 tris=4.50M

Frame attribution:
  frame max: 80.5 ms
  largest labelled hitch: 0 ms
  unattributed: 80.5 ms

Long frames:
  threshold: 80 ms
  count: 1
  worst: 80.5 ms

Raw sidecar:
  sampling=full factor=1 exported=1671/1671

Recommendation:
Largest frame (80.5 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.2 ms/frame
  crowd pass: 0.0 ms/frame (8.9 ms cumulative)
  agent updates: 0.8 ms/frame (1276.1 ms cumulative)
  livestock: 0.3 ms/frame (495.2 ms cumulative)
    loaded tick: 0.3 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.3 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.4/frame (0.0 candidates/frame)
    water samples: 9.5/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 9.5/frame, 0.00 ms/frame (worst call 0.10 ms, 562.0 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 4.4
    presentation executions/frame: 3.6
  rats: 0.1 ms/frame (98.4 ms cumulative)
  social: 0.0 ms/frame (4.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (158.7 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.0 ms/frame
  agent updates: 1.0 ms/frame (1613.4 ms cumulative)
  forest sampling: 0.1 ms/frame (97.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (18.7 ms cumulative)
    targeting: 0.0 ms/frame (19.1 ms cumulative)
    decision: 0.0 ms/frame (13.7 ms cumulative)
    behaviour: 0.6 ms/frame (1066.7 ms cumulative)
    life/presentation: 0.2 ms/frame (309.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 13.3
    full-rate agents/frame: 7.9
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 13.3
    presentation executions/frame: 12.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 364.4
    player perception checks/frame: 30.0

  nearest scans: 19.4/frame (32490 calls)
  nearest candidates checked: 144.0/frame (240679 total)
  herd leader scans: 0.1/frame (231 calls)
  herd candidates checked: 4.1/frame (6930 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 18.0/frame (110.4 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 60.5/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 60.5/frame, 0.00 ms/frame (worst call 1.60 ms, 3689.2 colliders/frame)

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
Frames: 1683
Shadow refresh frames: 153
Shadow skipped frames: 1530

Mirror:
  calls avg: 66  tris avg: 526306
  info calls avg: 66  residual calls avg: 0
  other                        calls=4 tris=4342
  settlement:decor             calls=36 tris=79867
  settlement:houseStatic       calls=9 tris=3969
  settlement:storageBarrel     calls=1 tris=1309
  settlement:storageContainer  calls=1 tris=238
  settlement:storageTrough     calls=1 tris=189
  terrain                      calls=5 tris=383578
  vegetation                   calls=9 tris=52955

Shadow (refresh only):
  calls avg: 188  tris avg: 1622352
  info calls avg: 188  residual calls avg: 0
  other                        calls=35 tris=9772
  settlement:decor             calls=82 tris=168804
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

[LONG FRAME] 80.5ms
simulate        74.0ms
render           6.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              1.3ms
FAUNA           69.4ms
PHYSICS          0.0ms
RENDER           6.3ms
OTHER            3.4ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=5.7 ms  p95=6.5 ms  max=6.6 ms  Δavg vs baseline=—
  hide-grass           avg=5.5 ms  p95=6.4 ms  max=7.5 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-vegetation      avg=5.5 ms  p95=6.4 ms  max=7.8 ms  Δavg vs baseline=-0.2 ms (-3%)
  no vegetation/grass  avg=5.2 ms  p95=5.9 ms  max=6.6 ms  Δavg vs baseline=-0.5 ms (-8%)
  hide-environment     avg=5.5 ms  p95=6.4 ms  max=6.9 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-settlement      avg=4.9 ms  p95=5.7 ms  max=5.8 ms  Δavg vs baseline=-0.8 ms (-13%)
  no water             avg=5.5 ms  p95=6.0 ms  max=6.0 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-terrain         avg=5.4 ms  p95=6.3 ms  max=6.7 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-npc-fauna       avg=3.8 ms  p95=4.6 ms  max=5.1 ms  Δavg vs baseline=-1.9 ms (-33%)
  no-shadows           avg=5.3 ms  p95=5.8 ms  max=5.8 ms  Δavg vs baseline=-0.3 ms (-6%)
  no-ao                avg=5.5 ms  p95=6.5 ms  max=6.6 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-bloom             avg=5.5 ms  p95=6.3 ms  max=7.2 ms  Δavg vs baseline=-0.2 ms (-4%)
  no-smaa              avg=5.7 ms  p95=6.2 ms  max=6.4 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-god-rays          avg=5.7 ms  p95=6.5 ms  max=7.3 ms  Δavg vs baseline=+0.0 ms (+1%)
  no-film-grade        avg=5.6 ms  p95=6.3 ms  max=6.6 ms  Δavg vs baseline=-0.1 ms (-1%)
  no postprocessing    avg=5.6 ms  p95=6.3 ms  max=6.4 ms  Δavg vs baseline=-0.1 ms (-2%)
  no mirrors           avg=5.9 ms  p95=6.5 ms  max=6.7 ms  Δavg vs baseline=+0.2 ms (+3%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=10.4 ms  p95=11.4 ms  max=11.8 ms
  CPU wall      avg=5.7 ms  p95=6.5 ms  max=6.6 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
