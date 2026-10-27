# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:52:25.264Z
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
Frames: 1680
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 721af157d6b3aee7ad071647716cd4b4403e936b
  runId: 2026-10-27T21-51-32-090Z-7tyc4b
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
  populationGate: stable waited=5033ms npc=20
  gpuTimer: available=true resolved=true samples=1690 span=postprocess+labels

FPS:
  avg: 76.1
  min: 13
  p1: 23

Frame time (wall-clock):
  avg: 13.1 ms
  p50: 13 ms
  p95: 15.3 ms
  p99: 42.9 ms
  max: 78.3 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.7 p95=7.2 p99=35.4 max=70.5 n=1680
  render: p50=7.5 p95=9.6 p99=10.4 max=12.6 n=1680
  frame: p50=13 p95=15.3 p99=42.9 max=78.3 n=1680

Rendering (combined renderer.info):
  draw calls: 324 avg / 546 max
  triangles: 5.02M avg
  mirror draws: 68 avg
  geometries: 566
  textures: 575

Pass submissions (actual):
  reliability: observed
  frames: 1691 shadowRefresh=154 shadowSkipped=1537
  mirror calls avg: 68
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
  WATER          1.4 ms
  NPC            1.1 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         6.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  FAUNA: 21
  NPC: 1
  RENDER: 1

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=6.3 ms draws=318 tris=4.98M
  hide-grass         render=5.9 ms draws=269 tris=2.54M
  hide-vegetation    render=5.8 ms draws=293 tris=4.80M
  hide-vegetation-grass render=5.7 ms draws=259 tris=2.51M
  hide-environment   render=6.1 ms draws=317 tris=4.98M
  hide-settlement    render=5.3 ms draws=227 tris=4.75M
  hide-water         render=6.1 ms draws=319 tris=4.53M
  hide-terrain       render=6.0 ms draws=303 tris=3.26M
  hide-npc-fauna     render=4.1 ms draws=233 tris=4.97M
  no-shadows         render=6.3 ms draws=305 tris=4.85M
  no-ao              render=6.1 ms draws=316 tris=5.02M
  no-bloom           render=6.1 ms draws=305 tris=4.98M
  no-smaa            render=6.3 ms draws=315 tris=4.98M
  no-god-rays        render=6.1 ms draws=317 tris=4.96M
  no-film-grade      render=6.2 ms draws=313 tris=4.94M
  no-postprocessing  render=6.2 ms draws=304 tris=5.05M
  no-reflections     render=6.3 ms draws=252 tris=4.44M

Frame attribution:
  frame max: 78.3 ms
  largest labelled hitch: 0 ms
  unattributed: 78.3 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1680/1680

Recommendation:
Largest frame (78.3 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.1 ms/frame
  crowd pass: 0.0 ms/frame (8.4 ms cumulative)
  agent updates: 0.7 ms/frame (1207.6 ms cumulative)
  livestock: 0.2 ms/frame (416.3 ms cumulative)
    loaded tick: 0.2 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.2 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.1 ms/frame
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
    water samples: 9.9/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 9.9/frame, 0.00 ms/frame (worst call 0.10 ms, 604.6 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 4.4
    presentation executions/frame: 3.6
  rats: 0.1 ms/frame (114.1 ms cumulative)
  social: 0.0 ms/frame (3.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (150.1 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.1 ms/frame (1843.1 ms cumulative)
  forest sampling: 0.1 ms/frame (103.1 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (21.6 ms cumulative)
    targeting: 0.0 ms/frame (18.2 ms cumulative)
    decision: 0.0 ms/frame (14.9 ms cumulative)
    behaviour: 0.7 ms/frame (1225.4 ms cumulative)
    life/presentation: 0.2 ms/frame (368.5 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.1
    decision passes/frame: 30.1
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 12.1
    full-rate agents/frame: 6.2
    reduced-cadence agents/frame: 23.8
    behaviour executions/frame: 12.1
    presentation executions/frame: 10.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.1
    village scan candidates/frame: 364.2
    player perception checks/frame: 30.1

  nearest scans: 18.2/frame (30582 calls)
  nearest candidates checked: 143.9/frame (241711 total)
  herd leader scans: 0.2/frame (257 calls)
  herd candidates checked: 4.6/frame (7710 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 15.2/frame (89.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 23.6/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 23.6/frame, 0.00 ms/frame (worst call 1.00 ms, 1501.1 colliders/frame)

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
Frames: 1691
Shadow refresh frames: 154
Shadow skipped frames: 1537

Mirror:
  calls avg: 68  tris avg: 538313
  info calls avg: 68  residual calls avg: 0
  other                        calls=4 tris=4441
  settlement:decor             calls=37 tris=81705
  settlement:houseStatic       calls=9 tris=4060
  settlement:storageBarrel     calls=1 tris=1339
  settlement:storageContainer  calls=1 tris=244
  settlement:storageTrough     calls=1 tris=193
  terrain                      calls=5 tris=392315
  vegetation                   calls=9 tris=54161

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
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.3 ms  p95=7.7 ms  max=8.2 ms  Δavg vs baseline=—
  hide-grass           avg=5.9 ms  p95=7.1 ms  max=7.2 ms  Δavg vs baseline=-0.4 ms (-6%)
  hide-vegetation      avg=5.8 ms  p95=6.4 ms  max=7.6 ms  Δavg vs baseline=-0.4 ms (-7%)
  no vegetation/grass  avg=5.7 ms  p95=6.3 ms  max=6.3 ms  Δavg vs baseline=-0.6 ms (-9%)
  hide-environment     avg=6.1 ms  p95=7.1 ms  max=7.3 ms  Δavg vs baseline=-0.2 ms (-3%)
  hide-settlement      avg=5.3 ms  p95=6.2 ms  max=6.4 ms  Δavg vs baseline=-1.0 ms (-16%)
  no water             avg=6.1 ms  p95=7.0 ms  max=8.1 ms  Δavg vs baseline=-0.2 ms (-4%)
  hide-terrain         avg=6.0 ms  p95=6.7 ms  max=6.9 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-npc-fauna       avg=4.1 ms  p95=4.5 ms  max=5.1 ms  Δavg vs baseline=-2.1 ms (-34%)
  no-shadows           avg=6.3 ms  p95=7.2 ms  max=8.7 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-ao                avg=6.1 ms  p95=6.9 ms  max=7.0 ms  Δavg vs baseline=-0.1 ms (-2%)
  no-bloom             avg=6.1 ms  p95=7.0 ms  max=7.1 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-smaa              avg=6.3 ms  p95=7.2 ms  max=7.7 ms  Δavg vs baseline=-0.0 ms (-1%)
  no-god-rays          avg=6.1 ms  p95=7.0 ms  max=7.2 ms  Δavg vs baseline=-0.2 ms (-3%)
  no-film-grade        avg=6.2 ms  p95=7.1 ms  max=7.2 ms  Δavg vs baseline=-0.1 ms (-2%)
  no postprocessing    avg=6.2 ms  p95=6.9 ms  max=7.3 ms  Δavg vs baseline=-0.1 ms (-2%)
  no mirrors           avg=6.3 ms  p95=7.0 ms  max=7.4 ms  Δavg vs baseline=+0.1 ms (+1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=9.6 ms  p95=10.9 ms  max=11.0 ms
  CPU wall      avg=6.3 ms  p95=7.7 ms  max=8.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
