# Seedvale Performance Benchmark Report

> Generated: 2026-10-30T06:15:04.073Z
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
Frames: 1009
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 11547b5c2ceb2ec3eed473f8e24e09a0a87d2681
  runId: 2026-10-30T06-14-00-292Z-e42fs4
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
  viewport: 1586x806
  drawingBuffer: 1982x1007
  camera: pos=(-895.1, 9.3, 367.1)
  anchor: (-895.1, 355.9)
  populationGate: stable waited=5174ms npc=26
  gpuTimer: available=true resolved=true samples=1010 span=postprocess+labels

FPS:
  avg: 79
  min: 24
  p1: 39

Frame time (wall-clock):
  avg: 12.7 ms
  p50: 12.4 ms
  p95: 16.3 ms
  p99: 25.7 ms
  max: 41.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3.7 p95=6.5 p99=15.7 max=32.8 n=1009
  render: p50=8.4 p95=10.2 p99=11.6 max=15.7 n=1009
  frame: p50=12.4 p95=16.3 p99=25.7 max=41.4 n=1009

Rendering (combined renderer.info):
  draw calls: 755 avg / 1085 max
  triangles: 16.70M avg
  mirror draws: 162 avg
  geometries: 615
  textures: 453

Pass submissions (actual):
  reliability: observed
  frames: 1016 shadowRefresh=93 shadowSkipped=923
  mirror calls avg: 162
  shadow calls avg: 208
  main calls avg: 552

Scene (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  grass            draws=84 tris=17.05M meshes=84 inst=1330404
  vegetation       draws=240 tris=3.74M meshes=240 inst=2457
  environment      draws=217 tris=55.1k meshes=217 inst=265
  settlement       draws=772 tris=842.6k meshes=772 inst=1697
  water            draws=8 tris=524.3k meshes=8 inst=8
  npc              draws=238 tris=300.6k meshes=238 inst=238
  fauna            draws=226 tris=97.2k meshes=226 inst=226
  items            draws=629 tris=55.4k meshes=629 inst=629
  other            draws=201 tris=24.1k meshes=201 inst=201

Shadow casters (one-pass estimate):
  terrain          draws=67 tris=4.94M meshes=67 inst=67
  vegetation       draws=238 tris=3.73M meshes=238 inst=2455
  environment      draws=216 tris=55.1k meshes=216 inst=264
  settlement       draws=498 tris=558.4k meshes=498 inst=1331
  items            draws=72 tris=43.1k meshes=72 inst=72
  other            draws=109 tris=15.0k meshes=109 inst=109

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=102 tris=105.5k meshes=102 inst=712
  houseInteractive draws=28 tris=4.4k meshes=28 inst=28
  fence            draws=8 tris=10.9k meshes=8 inst=54
  storageWoodSettlementPrimary draws=4 tris=3.4k meshes=4 inst=4
  storageWoodSettlementSecondary draws=2 tris=5.6k meshes=2 inst=2
  storageWoodHousehold draws=4 tris=10.9k meshes=4 inst=14
  storageContainer draws=24 tris=4.9k meshes=24 inst=64
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
  settlement               nodes=1554 composed=1554 multiplied=1554 skinned=0
  water                    nodes=8 composed=8 multiplied=8 skinned=0
  npc                      nodes=2029 composed=2029 multiplied=2029 skinned=238
  fauna                    nodes=2431 composed=2431 multiplied=2431 skinned=195
  items                    nodes=954 composed=954 multiplied=954 skinned=0
  other                    nodes=419 composed=402 multiplied=419 skinned=9
  top scene children:
    fauna ×57                nodes=2431 composed=2431 multiplied=2431 skinned=195
    npc ×26                  nodes=2029 composed=2029 multiplied=2029 skinned=238
    settlement ×4            nodes=1554 composed=1554 multiplied=1554 skinned=0
    chunk-items ×55          nodes=935 composed=935 multiplied=935 skinned=0
    chunk-environmen ×10     nodes=339 composed=339 multiplied=339 skinned=0
    Group ×39                nodes=268 composed=268 multiplied=268 skinned=9
    chunk-grass ×25          nodes=109 composed=109 multiplied=109 skinned=0
    chunk ×67                nodes=67 composed=67 multiplied=67 skinned=0
    Root_Scene ×18           nodes=60 composed=60 multiplied=60 skinned=0
    Object3D ×33             nodes=33 composed=33 multiplied=33 skinned=0
    chunk-vegetation ×1      nodes=22 composed=22 multiplied=22 skinned=0
    chunk-vegetation ×1      nodes=22 composed=22 multiplied=22 skinned=0

Systems:
  WATER          1.4 ms
  NPC            2.0 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         6.8 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  FAUNA: 16
  NPC: 7
  RENDER: 6

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=6.9 ms draws=751 tris=16.58M
  hide-grass         render=6.4 ms draws=726 tris=7.46M
  hide-vegetation    render=6.8 ms draws=590 tris=11.25M
  hide-vegetation-grass render=6.9 ms draws=569 tris=2.03M
  hide-environment   render=6.4 ms draws=660 tris=16.72M
  hide-settlement    render=5.6 ms draws=557 tris=16.64M
  hide-water         render=6.6 ms draws=754 tris=16.59M
  hide-terrain       render=6.3 ms draws=735 tris=15.10M
  hide-npc-fauna     render=5.4 ms draws=722 tris=16.70M
  no-shadows         render=6.1 ms draws=739 tris=16.25M
  no-ao              render=6.2 ms draws=745 tris=16.58M
  no-bloom           render=6.5 ms draws=738 tris=16.58M
  no-smaa            render=6.8 ms draws=754 tris=16.75M
  no-god-rays        render=6.5 ms draws=756 tris=16.75M
  no-film-grade      render=7.0 ms draws=757 tris=16.75M
  no-postprocessing  render=6.5 ms draws=723 tris=16.75M
  no-reflections     render=6.9 ms draws=586 tris=14.67M

Frame attribution:
  frame max: 41.4 ms
  largest labelled hitch: 0 ms
  unattributed: 41.4 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1009/1009

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 26
  Fauna (agents): 30

NPC:
  total: 2.0 ms/frame
  crowd pass: 0.0 ms/frame (7.2 ms cumulative)
  agent updates: 1.2 ms/frame (1245.8 ms cumulative)
  livestock: 0.5 ms/frame (527.4 ms cumulative)
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
      behaviour: 0.3 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 23.2
    unique animals/frame: 23.2
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.3/frame (1.3 rat candidates/frame)
    nearest scans: 7.9/frame (0.0 candidates/frame)
    water samples: 19.4/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 19.4/frame, 0.00 ms/frame (worst call 0.50 ms, 4955.5 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 23.1
    behaviour executions/frame: 7.9
    presentation executions/frame: 7.1
  rats: 0.1 ms/frame (85.5 ms cumulative)
  social: 0.0 ms/frame (4.8 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (156.9 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.1 ms/frame (1125.1 ms cumulative)
  forest sampling: 0.1 ms/frame (72.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.8 ms cumulative)
    targeting: 0.0 ms/frame (16.7 ms cumulative)
    decision: 0.0 ms/frame (10.0 ms cumulative)
    behaviour: 0.7 ms/frame (670.3 ms cumulative)
    life/presentation: 0.3 ms/frame (273.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.3
    decision passes/frame: 29.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 16.1
    full-rate agents/frame: 8.3
    reduced-cadence agents/frame: 21.1
    behaviour executions/frame: 16.1
    presentation executions/frame: 14.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.3
    village scan candidates/frame: 639.5
    player perception checks/frame: 29.3

  nearest scans: 22.1/frame (22259 calls)
  nearest candidates checked: 188.8/frame (190521 total)
  herd leader scans: 0.1/frame (127 calls)
  herd candidates checked: 3.8/frame (3810 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 21.3/frame (135.8 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 82.2/frame, 0.10 ms/frame (worst call 0.60 ms)
    collider queries: 82.2/frame, 0.10 ms/frame (worst call 0.60 ms, 1477.3 colliders/frame)

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
Frames: 1016
Shadow refresh frames: 93
Shadow skipped frames: 923

Mirror:
  calls avg: 162  tris avg: 2071599
  info calls avg: 162  residual calls avg: 0
  environment                  calls=31 tris=10358
  items                        calls=2 tris=1262
  other                        calls=11 tris=6312
  settlement:fence             calls=1 tris=806
  settlement:fireHouseExteriorLamp calls=3 tris=144
  settlement:fireHouseInteriorLamp calls=1 tris=108
  settlement:fireVillageTorch  calls=7 tris=535
  settlement:houseInteractive  calls=3 tris=329
  settlement:houseStatic       calls=12 tris=5205
  settlement:landmarkGarden    calls=3 tris=17503
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=933
  settlement:landmarkWellHousehold calls=2 tris=933
  settlement:other             calls=5 tris=102
  settlement:storageBarrel     calls=3 tris=2763
  settlement:storageContainer  calls=4 tris=437
  settlement:storageGoods      calls=10 tris=2056
  settlement:storageHay        calls=0 tris=244
  settlement:storageTrough     calls=1 tris=200
  settlement:storageWoodHousehold calls=0 tris=778
  settlement:storageWoodSettlementPrimary calls=0 tris=389
  settlement:workplace         calls=4 tris=2033
  terrain                      calls=4 tris=331123
  vegetation                   calls=47 tris=1687198

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
  calls avg: 552  tris avg: 14174932
  info calls avg: 593  residual calls avg: 0
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
  settlement:storageContainer  calls=9 tris=876
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

  baseline             avg=6.9 ms  p95=7.7 ms  max=7.7 ms  Δavg vs baseline=—
  hide-grass           avg=6.4 ms  p95=7.2 ms  max=8.0 ms  Δavg vs baseline=-0.6 ms (-8%)
  hide-vegetation      avg=6.8 ms  p95=7.7 ms  max=8.1 ms  Δavg vs baseline=-0.2 ms (-3%)
  no vegetation/grass  avg=6.9 ms  p95=7.8 ms  max=8.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-environment     avg=6.4 ms  p95=7.7 ms  max=8.2 ms  Δavg vs baseline=-0.5 ms (-7%)
  hide-settlement      avg=5.6 ms  p95=6.9 ms  max=8.5 ms  Δavg vs baseline=-1.3 ms (-19%)
  no water             avg=6.6 ms  p95=7.9 ms  max=8.4 ms  Δavg vs baseline=-0.3 ms (-5%)
  hide-terrain         avg=6.3 ms  p95=7.3 ms  max=8.1 ms  Δavg vs baseline=-0.6 ms (-9%)
  hide-npc-fauna       avg=5.4 ms  p95=6.6 ms  max=7.6 ms  Δavg vs baseline=-1.5 ms (-22%)
  no-shadows           avg=6.1 ms  p95=6.8 ms  max=7.0 ms  Δavg vs baseline=-0.8 ms (-12%)
  no-ao                avg=6.2 ms  p95=7.1 ms  max=7.6 ms  Δavg vs baseline=-0.7 ms (-10%)
  no-bloom             avg=6.5 ms  p95=7.3 ms  max=7.6 ms  Δavg vs baseline=-0.5 ms (-7%)
  no-smaa              avg=6.8 ms  p95=7.7 ms  max=10.5 ms  Δavg vs baseline=-0.2 ms (-2%)
  no-god-rays          avg=6.5 ms  p95=7.7 ms  max=8.4 ms  Δavg vs baseline=-0.4 ms (-6%)
  no-film-grade        avg=7.0 ms  p95=8.3 ms  max=13.1 ms  Δavg vs baseline=+0.1 ms (+1%)
  no postprocessing    avg=6.5 ms  p95=7.6 ms  max=8.0 ms  Δavg vs baseline=-0.4 ms (-6%)
  no mirrors           avg=6.9 ms  p95=7.9 ms  max=8.0 ms  Δavg vs baseline=-0.0 ms (-1%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=26.6 ms  p95=29.0 ms  max=30.3 ms
  CPU wall      avg=6.9 ms  p95=7.7 ms  max=7.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
