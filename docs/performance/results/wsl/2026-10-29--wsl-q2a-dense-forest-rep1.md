# Seedvale Performance Benchmark Report

> Generated: 2026-10-29T22:48:56.345Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: dense-forest
Duration: 30s
Frames: 426
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a6676a11dacf7cd048859d09268c7b2c1dfdab28
  runId: 2026-10-29T22-47-33-496Z-34c4l6
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
  camera: pos=(-895.1, 9.3, 367.1)
  anchor: (-895.1, 355.9)
  populationGate: stable waited=6059ms npc=26
  gpuTimer: available=true resolved=true samples=426 span=postprocess+labels

FPS:
  avg: 47.8
  min: 19
  p1: 34

Frame time (wall-clock):
  avg: 20.9 ms
  p50: 21.2 ms
  p95: 25.2 ms
  p99: 29 ms
  max: 53 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5 p95=6.9 p99=10.8 max=37.6 n=426
  render: p50=15.8 p95=19.4 p99=21 max=23.9 n=426
  frame: p50=21.2 p95=25.2 p99=29 max=53 n=426

Rendering (combined renderer.info):
  draw calls: 762 avg / 1095 max
  triangles: 16.70M avg
  mirror draws: 165 avg
  geometries: 618
  textures: 456

Pass submissions (actual):
  reliability: observed
  frames: 429 shadowRefresh=39 shadowSkipped=390
  mirror calls avg: 165
  shadow calls avg: 208
  main calls avg: 557

Scene (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  grass            draws=84 tris=17.05M meshes=84 inst=1330404
  vegetation       draws=240 tris=3.74M meshes=240 inst=2457
  environment      draws=217 tris=55.1k meshes=217 inst=265
  settlement       draws=822 tris=842.6k meshes=822 inst=1697
  water            draws=8 tris=524.3k meshes=8 inst=8
  npc              draws=238 tris=300.6k meshes=238 inst=238
  fauna            draws=226 tris=97.2k meshes=226 inst=226
  items            draws=629 tris=55.4k meshes=629 inst=629
  other            draws=199 tris=23.8k meshes=199 inst=199

Shadow casters (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  vegetation       draws=238 tris=3.73M meshes=238 inst=2455
  environment      draws=216 tris=55.1k meshes=216 inst=264
  settlement       draws=518 tris=558.4k meshes=518 inst=1331
  items            draws=72 tris=43.1k meshes=72 inst=72
  other            draws=107 tris=14.7k meshes=107 inst=107

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=102 tris=105.5k meshes=102 inst=712
  houseInteractive draws=28 tris=4.4k meshes=28 inst=28
  fence            draws=8 tris=10.9k meshes=8 inst=54
  storageWoodSettlementPrimary draws=4 tris=3.4k meshes=4 inst=4
  storageWoodSettlementSecondary draws=2 tris=5.6k meshes=2 inst=2
  storageWoodHousehold draws=4 tris=10.9k meshes=4 inst=14
  storageContainer draws=44 tris=4.9k meshes=44 inst=64
  storageHay       draws=4 tris=2.0k meshes=4 inst=4
  storageTrough    draws=10 tris=3.0k meshes=10 inst=30
  workplace        draws=13 tris=6.5k meshes=13 inst=13
  landmarkWellCentral draws=20 tris=7.5k meshes=20 inst=20
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=4 tris=4.8k meshes=4 inst=6
  landmarkNoticeBoard draws=8 tris=144 meshes=8 inst=8
  fireHouseInteriorLamp draws=14 tris=1.5k meshes=14 inst=14
  fireCampfire     draws=12 tris=176 meshes=12 inst=12
  decor            draws=196 tris=384.6k meshes=196 inst=301
  other            draws=40 tris=744 meshes=40 inst=40

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=13 draws=119 tris=141.3k skinned=119/119
      Farmer           agents=3 draws=25 tris=37.7k skinned=25/25
      woodcutter       agents=3 draws=21 tris=32.7k skinned=21/21
      Knight_Cloth     agents=2 draws=20 tris=25.6k skinned=20/20
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      Ranger_NoHood    agents=1 draws=14 tris=16.0k skinned=14/14
      Wizard           agents=1 draws=11 tris=11.1k skinned=11/11
      Herbalist        agents=1 draws=10 tris=11.7k skinned=10/10
    by distance band:
      far  agents=26 camera-relevant=4 draws=238 tris=300.6k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      wolf             agents=8 draws=32 tris=15.7k skinned=32/32
      dog              agents=4 draws=22 tris=7.7k skinned=22/22
      chicken          agents=4 draws=20 tris=2.6k skinned=0/20
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      sheep            agents=8 draws=16 tris=4.9k skinned=16/16
      horse            agents=2 draws=16 tris=4.4k skinned=16/16
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      donkey           agents=2 draws=14 tris=4.0k skinned=14/14
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      rat              agents=4 draws=8 tris=16.0k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=2 draws=2 tris=2.4k skinned=0/2
    by distance band:
      far  agents=57 camera-relevant=1 draws=226 tris=97.2k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=67 composed=67 multiplied=67 skinned=0
  grass                    nodes=109 composed=109 multiplied=109 skinned=0
  vegetation               nodes=270 composed=270 multiplied=270 skinned=0
  environment              nodes=409 composed=409 multiplied=409 skinned=0
  settlement               nodes=1614 composed=1614 multiplied=1614 skinned=0
  water                    nodes=8 composed=8 multiplied=8 skinned=0
  npc                      nodes=2029 composed=2029 multiplied=2029 skinned=238
  fauna                    nodes=2431 composed=2431 multiplied=2431 skinned=195
  items                    nodes=954 composed=954 multiplied=954 skinned=0
  other                    nodes=415 composed=398 multiplied=415 skinned=9
  top scene children:
    fauna ×57                nodes=2431 composed=2431 multiplied=2431 skinned=195
    npc ×26                  nodes=2029 composed=2029 multiplied=2029 skinned=238
    settlement ×4            nodes=1614 composed=1614 multiplied=1614 skinned=0
    chunk-items ×55          nodes=935 composed=935 multiplied=935 skinned=0
    chunk-environmen ×10     nodes=339 composed=339 multiplied=339 skinned=0
    Group ×39                nodes=268 composed=268 multiplied=268 skinned=9
    chunk-grass ×25          nodes=109 composed=109 multiplied=109 skinned=0
    chunk ×67                nodes=67 composed=67 multiplied=67 skinned=0
    Root_Scene ×16           nodes=56 composed=56 multiplied=56 skinned=0
    Object3D ×33             nodes=33 composed=33 multiplied=33 skinned=0
    chunk-vegetation ×1      nodes=22 composed=22 multiplied=22 skinned=0
    chunk-vegetation ×1      nodes=22 composed=22 multiplied=22 skinned=0

Systems:
  WATER          2.6 ms
  NPC            2.5 ms
  FAUNA          1.3 ms
  PHYSICS        0.2 ms
  RENDER         12.7 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.2 ms draws=764 tris=16.75M
  hide-grass         render=12.2 ms draws=733 tris=7.46M
  hide-vegetation    render=11.7 ms draws=605 tris=11.28M
  hide-vegetation-grass render=11.5 ms draws=576 tris=2.03M
  hide-environment   render=11.7 ms draws=668 tris=16.72M
  hide-settlement    render=10.4 ms draws=557 tris=16.64M
  hide-water         render=12.4 ms draws=761 tris=16.59M
  hide-terrain       render=12.0 ms draws=742 tris=15.10M
  hide-npc-fauna     render=10.2 ms draws=723 tris=16.54M
  no-shadows         render=11.7 ms draws=746 tris=16.25M
  no-ao              render=12.2 ms draws=758 tris=16.75M
  no-bloom           render=12.1 ms draws=745 tris=16.58M
  no-smaa            render=12.3 ms draws=761 tris=16.75M
  no-god-rays        render=12.3 ms draws=763 tris=16.75M
  no-film-grade      render=12.2 ms draws=746 tris=16.58M
  no-postprocessing  render=12.5 ms draws=728 tris=16.75M
  no-reflections     render=12.7 ms draws=591 tris=14.67M

Frame attribution:
  frame max: 53 ms
  largest labelled hitch: 0 ms
  unattributed: 53 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=426/426

Recommendation:
Largest frame (53 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 26
  Fauna (agents): 30

NPC:
  total: 2.5 ms/frame
  crowd pass: 0.0 ms/frame (5.6 ms cumulative)
  agent updates: 1.5 ms/frame (622.4 ms cumulative)
  livestock: 0.6 ms/frame (275.6 ms cumulative)
    loaded tick: 0.6 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.6 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.3 ms/frame
      life/presentation: 0.2 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 23.2
    unique animals/frame: 23.2
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 2.1/frame (2.1 rat candidates/frame)
    nearest scans: 11.6/frame (0.0 candidates/frame)
    water samples: 28.9/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 28.9/frame, 0.00 ms/frame (worst call 0.10 ms, 7463.5 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 23.0
    behaviour executions/frame: 11.6
    presentation executions/frame: 11.7
  rats: 0.2 ms/frame (68.1 ms cumulative)
  social: 0.0 ms/frame (2.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (78.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (542.6 ms cumulative)
  forest sampling: 0.1 ms/frame (41.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.7 ms cumulative)
    targeting: 0.0 ms/frame (10.0 ms cumulative)
    decision: 0.0 ms/frame (6.2 ms cumulative)
    behaviour: 0.6 ms/frame (239.4 ms cumulative)
    life/presentation: 0.4 ms/frame (183.1 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.7
    decision passes/frame: 29.7
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 18.6
    full-rate agents/frame: 7.5
    reduced-cadence agents/frame: 22.2
    behaviour executions/frame: 18.6
    presentation executions/frame: 18.6

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.7
    village scan candidates/frame: 636.2
    player perception checks/frame: 29.7

  nearest scans: 26.3/frame (11210 calls)
  nearest candidates checked: 218.1/frame (92890 total)
  herd leader scans: 0.3/frame (127 calls)
  herd candidates checked: 8.9/frame (3810 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 25.8/frame (176.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 58.1/frame, 0.10 ms/frame (worst call 0.10 ms)
    collider queries: 58.1/frame, 0.00 ms/frame (worst call 1.10 ms, 979.3 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 25
Resident instances: full=793349 filler=1493133
Submitted instances: full=647354 filler=683050
Meshes submitted: 84
LOD submitted fraction: full=0.8159763231566436 filler=0.45746092277111283
Flowers: unavailable
Allocation bytes (estimated): 219502272
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 429
Shadow refresh frames: 39
Shadow skipped frames: 390

Mirror:
  calls avg: 165  tris avg: 2070846
  info calls avg: 165  residual calls avg: 0
  environment                  calls=31 tris=10354
  items                        calls=2 tris=1261
  other                        calls=11 tris=6309
  settlement:fence             calls=1 tris=806
  settlement:fireHouseExteriorLamp calls=3 tris=144
  settlement:fireHouseInteriorLamp calls=1 tris=108
  settlement:fireVillageTorch  calls=7 tris=535
  settlement:houseInteractive  calls=3 tris=329
  settlement:houseStatic       calls=12 tris=5203
  settlement:landmarkGarden    calls=3 tris=17497
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=933
  settlement:landmarkWellHousehold calls=2 tris=933
  settlement:other             calls=5 tris=102
  settlement:storageBarrel     calls=3 tris=2762
  settlement:storageContainer  calls=7 tris=437
  settlement:storageGoods      calls=10 tris=2055
  settlement:storageHay        calls=0 tris=243
  settlement:storageTrough     calls=1 tris=200
  settlement:storageWoodHousehold calls=0 tris=778
  settlement:storageWoodSettlementPrimary calls=0 tris=389
  settlement:workplace         calls=4 tris=2032
  terrain                      calls=4 tris=331003
  vegetation                   calls=47 tris=1686585

Shadow (refresh only):
  calls avg: 208  tris avg: 4994240
  info calls avg: 208  residual calls avg: 0
  environment                  calls=20 tris=20418
  items                        calls=11 tris=4941
  other                        calls=33 tris=8672
  settlement:other             calls=2 tris=36
  terrain                      calls=19 tris=1400832
  vegetation                   calls=123 tris=3559341

Main:
  calls avg: 557  tris avg: 14174932
  info calls avg: 598  residual calls avg: 0
  environment                  calls=63 tris=21773
  faunaFamily:rat              calls=2 tris=4004
  grass                        calls=31 tris=9293262
  items                        calls=148 tris=13146
  npcFamily:Farmer             calls=8 tris=12316
  npcFamily:Peasant            calls=18 tris=20898
  npcFamily:woodcutter         calls=7 tris=11067
  other                        calls=25 tris=12778
  settlement:fence             calls=2 tris=1616
  settlement:fireHouseExteriorLamp calls=6 tris=288
  settlement:fireHouseInteriorLamp calls=2 tris=216
  settlement:fireVillageTorch  calls=15 tris=1073
  settlement:houseInteractive  calls=6 tris=660
  settlement:houseStatic       calls=24 tris=10430
  settlement:landmarkGarden    calls=6 tris=35076
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=1870
  settlement:other             calls=11 tris=204
  settlement:storageBarrel     calls=6 tris=5536
  settlement:storageContainer  calls=14 tris=876
  settlement:storageGoods      calls=20 tris=4120
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=1 tris=1560
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=9 tris=4074
  terrain                      calls=16 tris=1179648
  vegetation                   calls=98 tris=3379560
  water                        calls=3 tris=155648


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.2 ms  p95=13.8 ms  max=17.0 ms  Δavg vs baseline=—
  hide-grass           avg=12.2 ms  p95=14.9 ms  max=15.7 ms  Δavg vs baseline=-0.0 ms (-0%)
  hide-vegetation      avg=11.7 ms  p95=13.7 ms  max=15.2 ms  Δavg vs baseline=-0.4 ms (-4%)
  no vegetation/grass  avg=11.5 ms  p95=13.1 ms  max=13.6 ms  Δavg vs baseline=-0.7 ms (-6%)
  hide-environment     avg=11.7 ms  p95=14.0 ms  max=14.3 ms  Δavg vs baseline=-0.4 ms (-4%)
  hide-settlement      avg=10.4 ms  p95=12.7 ms  max=15.9 ms  Δavg vs baseline=-1.8 ms (-14%)
  no water             avg=12.4 ms  p95=14.7 ms  max=15.7 ms  Δavg vs baseline=+0.2 ms (+2%)
  hide-terrain         avg=12.0 ms  p95=14.3 ms  max=16.5 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-npc-fauna       avg=10.2 ms  p95=13.5 ms  max=19.3 ms  Δavg vs baseline=-1.9 ms (-16%)
  no-shadows           avg=11.7 ms  p95=13.1 ms  max=13.9 ms  Δavg vs baseline=-0.5 ms (-4%)
  no-ao                avg=12.2 ms  p95=14.2 ms  max=15.0 ms  Δavg vs baseline=+0.1 ms (+0%)
  no-bloom             avg=12.1 ms  p95=13.9 ms  max=14.5 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-smaa              avg=12.3 ms  p95=14.6 ms  max=15.9 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-god-rays          avg=12.3 ms  p95=14.2 ms  max=16.2 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-film-grade        avg=12.2 ms  p95=13.9 ms  max=15.3 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=12.5 ms  p95=15.0 ms  max=15.6 ms  Δavg vs baseline=+0.4 ms (+3%)
  no mirrors           avg=12.7 ms  p95=14.3 ms  max=14.3 ms  Δavg vs baseline=+0.6 ms (+5%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (30 samples resolved during the baseline window)
  GPU elapsed   avg=34.5 ms  p95=41.7 ms  max=46.3 ms
  CPU wall      avg=12.2 ms  p95=13.8 ms  max=17.0 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
