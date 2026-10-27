# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:08:03.375Z
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
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T21-07-18-006Z-w594tv
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
  camera: pos=(228.4, 0.9, 87.4)
  anchor: (228.4, 86.4)
  populationGate: stable waited=5233ms npc=4
  gpuTimer: available=true resolved=true samples=1681 span=postprocess+labels

FPS:
  avg: 114.4
  min: 23
  p1: 25

Frame time (wall-clock):
  avg: 8.7 ms
  p50: 8.2 ms
  p95: 9.5 ms
  p99: 40.6 ms
  max: 43 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.8 p95=4.3 p99=35.7 max=36.7 n=1671
  render: p50=4.2 p95=5.2 p99=5.7 max=6.5 n=1671
  frame: p50=8.2 p95=9.5 p99=40.6 max=43 n=1671

Rendering (combined renderer.info):
  draw calls: 265 avg / 377 max
  triangles: 6.86M avg
  mirror draws: 45 avg
  geometries: 632
  textures: 618

Pass submissions (actual):
  reliability: observed
  frames: 1682 shadowRefresh=153 shadowSkipped=1529
  mirror calls avg: 45
  shadow calls avg: 94
  main calls avg: 191

Scene (one-pass estimate):
  terrain          draws=63 tris=4.64M meshes=63 inst=63
  grass            draws=60 tris=4.46M meshes=60 inst=386321
  vegetation       draws=111 tris=757.2k meshes=111 inst=462
  environment      draws=37 tris=13.2k meshes=37 inst=42
  settlement       draws=340 tris=454.4k meshes=340 inst=517
  water            draws=49 tris=3.55M meshes=49 inst=49
  npc              draws=40 tris=48.9k meshes=40 inst=40
  fauna            draws=140 tris=62.0k meshes=140 inst=140
  items            draws=150 tris=11.6k meshes=150 inst=150
  other            draws=221 tris=26.7k meshes=221 inst=221

Shadow casters (one-pass estimate):
  terrain          draws=63 tris=4.64M meshes=63 inst=63
  vegetation       draws=105 tris=736.2k meshes=105 inst=454
  environment      draws=37 tris=13.2k meshes=37 inst=42
  settlement       draws=272 tris=406.3k meshes=272 inst=443
  items            draws=18 tris=8.9k meshes=18 inst=18
  other            draws=101 tris=15.3k meshes=101 inst=101

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=23 tris=10.3k meshes=23 inst=85
  houseInteractive draws=4 tris=628 meshes=4 inst=4
  storageWoodSettlementPrimary draws=2 tris=3.7k meshes=2 inst=2
  storageWoodHousehold draws=4 tris=7.4k meshes=4 inst=4
  storageContainer draws=8 tris=804 meshes=8 inst=10
  storageHay       draws=1 tris=488 meshes=1 inst=1
  storageTrough    draws=2 tris=400 meshes=2 inst=4
  workplace        draws=4 tris=3.5k meshes=4 inst=4
  landmarkWellCentral draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=1 tris=800 meshes=1 inst=1
  landmarkNoticeBoard draws=2 tris=36 meshes=2 inst=2
  fireHouseInteriorLamp draws=2 tris=216 meshes=2 inst=2
  decor            draws=200 tris=375.8k meshes=200 inst=305
  other            draws=14 tris=288 meshes=14 inst=14

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Wizard           agents=1 draws=12 tris=11.9k skinned=12/12
      Knight_Cloth     agents=1 draws=10 tris=12.8k skinned=10/10
      woodcutter       agents=1 draws=9 tris=12.1k skinned=9/9
      Peasant_Boots    agents=1 draws=9 tris=12.1k skinned=9/9
    by distance band:
      far  agents=4 camera-relevant=0 draws=40 tris=48.9k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      horse            agents=1 draws=8 tris=2.2k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      sheep            agents=1 draws=2 tris=610 skinned=2/2
      rat              agents=1 draws=2 tris=4.0k skinned=2/2
    by distance band:
      far  agents=34 camera-relevant=0 draws=140 tris=62.0k

Systems:
  WATER          0.8 ms
  NPC            0.3 ms
  FAUNA          1.0 ms
  PHYSICS        0.1 ms
  RENDER         3.3 ms

Detected bottlenecks:
  1. RENDER
  2. FAUNA
  3. WATER

Critical spikes:
  FAUNA: 30

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=3.2 ms draws=262 tris=6.77M
  hide-grass         render=3.0 ms draws=227 tris=4.27M
  hide-vegetation    render=2.7 ms draws=163 tris=5.79M
  hide-vegetation-grass render=2.5 ms draws=125 tris=3.18M
  hide-environment   render=3.1 ms draws=251 tris=6.82M
  hide-settlement    render=3.3 ms draws=261 tris=6.79M
  hide-water         render=3.1 ms draws=253 tris=5.93M
  hide-terrain       render=3.1 ms draws=235 tris=4.67M
  hide-npc-fauna     render=2.7 ms draws=243 tris=6.76M
  no-shadows         render=3.1 ms draws=260 tris=6.69M
  no-ao              render=3.2 ms draws=258 tris=6.84M
  no-bloom           render=3.1 ms draws=254 tris=6.90M
  no-smaa            render=3.4 ms draws=259 tris=6.77M
  no-god-rays        render=3.3 ms draws=267 tris=6.90M
  no-film-grade      render=3.2 ms draws=267 tris=6.90M
  no-postprocessing  render=3.2 ms draws=244 tris=6.90M
  no-reflections     render=3.5 ms draws=221 tris=6.10M

Frame attribution:
  frame max: 43 ms
  largest labelled hitch: 0 ms
  unattributed: 43 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1671/1671

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 4
  Fauna (agents): 30

NPC:
  total: 0.3 ms/frame
  crowd pass: 0.0 ms/frame (4.2 ms cumulative)
  agent updates: 0.2 ms/frame (301.0 ms cumulative)
  livestock: 0.1 ms/frame (87.7 ms cumulative)
    loaded tick: 0.1 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.1 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.0 ms/frame
      life/presentation: 0.0 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 3.0
    unique animals/frame: 3.0
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 0.0
    dog guard scans: 0.0/frame (0.0 predator candidates/frame)
    pest scans: 0.0/frame (0.0 rat candidates/frame)
    nearest scans: 0.6/frame (0.0 candidates/frame)
    water samples: 1.0/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 1.0/frame, 0.00 ms/frame (worst call 0.10 ms, 28.1 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 3.0
    behaviour executions/frame: 0.6
    presentation executions/frame: 0.5
  rats: 0.0 ms/frame (42.5 ms cumulative)
  social: 0.0 ms/frame (2.5 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.0 ms/frame (45.0 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.0 ms/frame
  agent updates: 1.0 ms/frame (1660.8 ms cumulative)
  forest sampling: 0.1 ms/frame (106.7 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (12.8 ms cumulative)
    targeting: 0.0 ms/frame (5.4 ms cumulative)
    decision: 0.0 ms/frame (10.2 ms cumulative)
    behaviour: 0.7 ms/frame (1207.1 ms cumulative)
    life/presentation: 0.1 ms/frame (226.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 22.3
    decision passes/frame: 22.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 10.3
    full-rate agents/frame: 6.1
    reduced-cadence agents/frame: 16.2
    behaviour executions/frame: 10.3
    presentation executions/frame: 9.3

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 16.3
    player perception checks/frame: 22.3

  nearest scans: 17.0/frame (28402 calls)
  nearest candidates checked: 24.5/frame (40899 total)
  herd leader scans: 0.1/frame (177 calls)
  herd candidates checked: 3.2/frame (5310 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.7/frame (109.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 6.6/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 6.6/frame, 0.00 ms/frame (worst call 0.10 ms, 136.6 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 15
Resident instances: full=580938 filler=1214394
Submitted instances: full=203367 filler=182945
Meshes submitted: 51
LOD submitted fraction: full=0.35006661640312736 filler=0.15064715405379145
Flowers: unavailable
Allocation bytes (estimated): 172351872
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1682
Shadow refresh frames: 153
Shadow skipped frames: 1529

Mirror:
  calls avg: 45  tris avg: 774123
  info calls avg: 45  residual calls avg: 0
  environment                  calls=4 tris=2016
  other                        calls=4 tris=4470
  terrain                      calls=6 tris=430796
  vegetation                   calls=30 tris=336987

Shadow (refresh only):
  calls avg: 94  tris avg: 2046987
  info calls avg: 94  residual calls avg: 0
  environment                  calls=4 tris=1640
  other                        calls=28 tris=8599
  terrain                      calls=19 tris=1400832
  vegetation                   calls=43 tris=635916

Main:
  calls avg: 191  tris avg: 5896344
  info calls avg: 220  residual calls avg: 0
  environment                  calls=9 tris=4140
  grass                        calls=37 tris=2572624
  npcFamily:Knight_Cloth       calls=5 tris=4386
  npcFamily:Peasant_Boots      calls=5 tris=4422
  npcFamily:Wizard             calls=5 tris=4436
  npcFamily:woodcutter         calls=4 tris=3560
  other                        calls=21 tris=13552
  terrain                      calls=22 tris=1621748
  vegetation                   calls=69 tris=701120
  water                        calls=14 tris=966656


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=3.2 ms  p95=3.7 ms  max=4.3 ms  Δavg vs baseline=—
  hide-grass           avg=3.0 ms  p95=3.7 ms  max=3.9 ms  Δavg vs baseline=-0.1 ms (-5%)
  hide-vegetation      avg=2.7 ms  p95=3.1 ms  max=3.2 ms  Δavg vs baseline=-0.5 ms (-15%)
  no vegetation/grass  avg=2.5 ms  p95=2.9 ms  max=3.0 ms  Δavg vs baseline=-0.6 ms (-20%)
  hide-environment     avg=3.1 ms  p95=3.5 ms  max=3.9 ms  Δavg vs baseline=-0.1 ms (-2%)
  hide-settlement      avg=3.3 ms  p95=4.2 ms  max=4.4 ms  Δavg vs baseline=+0.1 ms (+5%)
  no water             avg=3.1 ms  p95=3.7 ms  max=3.8 ms  Δavg vs baseline=-0.1 ms (-3%)
  hide-terrain         avg=3.1 ms  p95=3.6 ms  max=4.0 ms  Δavg vs baseline=-0.0 ms (-1%)
  hide-npc-fauna       avg=2.7 ms  p95=3.2 ms  max=3.3 ms  Δavg vs baseline=-0.5 ms (-16%)
  no-shadows           avg=3.1 ms  p95=3.6 ms  max=4.3 ms  Δavg vs baseline=-0.1 ms (-4%)
  no-ao                avg=3.2 ms  p95=3.8 ms  max=4.0 ms  Δavg vs baseline=+0.0 ms (+1%)
  no-bloom             avg=3.1 ms  p95=3.6 ms  max=3.8 ms  Δavg vs baseline=-0.1 ms (-4%)
  no-smaa              avg=3.4 ms  p95=4.0 ms  max=4.2 ms  Δavg vs baseline=+0.2 ms (+6%)
  no-god-rays          avg=3.3 ms  p95=4.0 ms  max=4.3 ms  Δavg vs baseline=+0.1 ms (+4%)
  no-film-grade        avg=3.2 ms  p95=3.8 ms  max=4.4 ms  Δavg vs baseline=+0.1 ms (+2%)
  no postprocessing    avg=3.2 ms  p95=3.8 ms  max=4.0 ms  Δavg vs baseline=+0.0 ms (+1%)
  no mirrors           avg=3.5 ms  p95=3.9 ms  max=4.1 ms  Δavg vs baseline=+0.3 ms (+11%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (38 samples resolved during the baseline window)
  GPU elapsed   avg=9.3 ms  p95=10.4 ms  max=12.1 ms
  CPU wall      avg=3.2 ms  p95=3.7 ms  max=4.3 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
