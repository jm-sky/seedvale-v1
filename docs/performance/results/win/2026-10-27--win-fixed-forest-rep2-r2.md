# Seedvale Performance Benchmark Report

> Generated: 2026-10-27T21:12:18.155Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: forest
Duration: 30s
Frames: 1173
Quality: High
Pixel ratio: 1.0000000149011612

Reproducibility:
  gitSha: 5b6f1e05f9216a3480cde2c9bc0a2b1182239c23
  runId: 2026-10-27T21-11-29-676Z-1dundo
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5204ms npc=20
  gpuTimer: available=true resolved=true samples=1181 span=postprocess+labels

FPS:
  avg: 44.6
  min: 15
  p1: 19

Frame time (wall-clock):
  avg: 22.4 ms
  p50: 22.3 ms
  p95: 29.1 ms
  p99: 53 ms
  max: 64.7 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=4.8 p95=11.4 p99=34.2 max=50.6 n=1173
  render: p50=17 p95=19.7 p99=20.6 max=30.7 n=1173
  frame: p50=22.3 p95=29.1 p99=53 max=64.7 n=1173

Rendering (combined renderer.info):
  draw calls: 1829 avg / 2177 max
  triangles: 12.43M avg
  mirror draws: 331 avg
  geometries: 583
  textures: 533

Pass submissions (actual):
  reliability: observed
  frames: 1182 shadowRefresh=1182 shadowSkipped=0
  mirror calls avg: 331
  shadow calls avg: 434
  main calls avg: 1064

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=84 tris=7.46M meshes=84 inst=562716
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=709 tris=687.7k meshes=709 inst=1307
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=192 tris=236.0k meshes=192 inst=192
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=233 tris=26.1k meshes=233 inst=233

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=445 tris=487.5k meshes=445 inst=988
  npc              draws=18 tris=24.2k meshes=18 inst=18
  fauna            draws=16 tris=8.6k meshes=16 inst=16
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=107 tris=14.7k meshes=107 inst=107

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=20 tris=14.5k meshes=20 inst=20
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
  decor            draws=200 tris=383.4k meshes=200 inst=306
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
      near agents=2 camera-relevant=2 draws=18 tris=24.2k
      far  agents=18 camera-relevant=11 draws=174 tris=211.8k
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
      near agents=1 camera-relevant=1 draws=2 tris=610
      mid  agents=3 camera-relevant=2 draws=14 tris=8.0k
      far  agents=48 camera-relevant=18 draws=196 tris=79.7k

Systems:
  WATER          2.6 ms
  NPC            1.7 ms
  FAUNA          1.6 ms
  PHYSICS        0.1 ms
  RENDER         13.4 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=12.3 ms draws=1829 tris=12.44M
  hide-grass         render=12.4 ms draws=1776 tris=5.74M
  hide-vegetation    render=11.7 ms draws=1783 tris=12.26M
  hide-vegetation-grass render=12.0 ms draws=1740 tris=5.58M
  hide-environment   render=12.0 ms draws=1745 tris=12.43M
  hide-settlement    render=8.8 ms draws=777 tris=11.24M
  hide-water         render=12.2 ms draws=1837 tris=12.21M
  hide-terrain       render=12.1 ms draws=1789 tris=8.61M
  hide-npc-fauna     render=8.2 ms draws=1557 tris=12.18M
  no-shadows         render=10.0 ms draws=1417 tris=10.41M
  no-ao              render=12.4 ms draws=1817 tris=12.43M
  no-bloom           render=12.3 ms draws=1811 tris=12.43M
  no-smaa            render=12.6 ms draws=1821 tris=12.43M
  no-god-rays        render=12.5 ms draws=1822 tris=12.43M
  no-film-grade      render=12.5 ms draws=1820 tris=12.43M
  no-postprocessing  render=13.0 ms draws=1798 tris=12.43M
  no-reflections     render=12.0 ms draws=1491 tris=11.63M

Frame attribution:
  frame max: 64.7 ms
  largest labelled hitch: 0 ms
  unattributed: 64.7 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1173/1173

Recommendation:
Largest frame (64.7 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.7 ms/frame
  crowd pass: 0.0 ms/frame (6.0 ms cumulative)
  agent updates: 0.9 ms/frame (1076.0 ms cumulative)
  livestock: 0.5 ms/frame (644.5 ms cumulative)
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
      behaviour: 0.4 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 0.8/frame (0.8 rat candidates/frame)
    nearest scans: 6.4/frame (0.0 candidates/frame)
    water samples: 16.4/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 16.4/frame, 0.00 ms/frame (worst call 0.70 ms, 935.8 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 6.4
    presentation executions/frame: 5.9
  rats: 0.1 ms/frame (97.3 ms cumulative)
  social: 0.0 ms/frame (3.7 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (113.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.6 ms/frame
  agent updates: 1.5 ms/frame (1806.2 ms cumulative)
  forest sampling: 0.1 ms/frame (79.2 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (14.4 ms cumulative)
    targeting: 0.0 ms/frame (11.3 ms cumulative)
    decision: 0.0 ms/frame (9.3 ms cumulative)
    behaviour: 1.2 ms/frame (1372.0 ms cumulative)
    life/presentation: 0.2 ms/frame (254.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 28.2
    decision passes/frame: 28.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 13.2
    full-rate agents/frame: 5.6
    reduced-cadence agents/frame: 22.6
    behaviour executions/frame: 13.2
    presentation executions/frame: 11.8

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 0.0
    village scan candidates/frame: 365.2
    player perception checks/frame: 28.2

  nearest scans: 21.6/frame (25309 calls)
  nearest candidates checked: 174.6/frame (204775 total)
  herd leader scans: 0.2/frame (238 calls)
  herd candidates checked: 6.1/frame (7140 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 19.6/frame (113.3 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 32.9/frame, 0.00 ms/frame (worst call 0.60 ms)
    collider queries: 32.9/frame, 0.00 ms/frame (worst call 0.10 ms, 1394.4 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=616454 filler=1247320
Submitted instances: full=265630 filler=297074
Meshes submitted: 72
LOD submitted fraction: full=0.43089995360562183 filler=0.23816983612865986
Flowers: unavailable
Allocation bytes (estimated): 178922304
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 1182
Shadow refresh frames: 1182
Shadow skipped frames: 0

Mirror:
  calls avg: 331  tris avg: 795864
  info calls avg: 331  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=85 tris=156946
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=2 tris=301
  settlement:fireHouseExteriorLamp calls=32 tris=2184
  settlement:fireHouseInteriorLamp calls=4 tris=378
  settlement:fireVillageTorch  calls=13 tris=894
  settlement:houseInteractive  calls=11 tris=1155
  settlement:houseStatic       calls=25 tris=18417
  settlement:landmarkGarden    calls=6 tris=52614
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:landmarkWellHousehold calls=5 tris=3740
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=8 tris=150
  settlement:storageBarrel     calls=6 tris=7612
  settlement:storageContainer  calls=22 tris=1344
  settlement:storageGoods      calls=21 tris=4416
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=800
  settlement:storageWoodHousehold calls=7 tris=5699
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=8 tris=4503
  terrain                      calls=7 tris=515820
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 434  tris avg: 2023984
  info calls avg: 434  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=4 tris=1832
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=2 tris=3604
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:Wizard             calls=3 tris=2728
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=67 tris=13672
  settlement:decor             calls=199 tris=376502
  settlement:fireHouseInteriorLamp calls=2 tris=216
  settlement:houseInteractive  calls=4 tris=628
  settlement:houseStatic       calls=23 tris=10310
  settlement:landmarkGarden    calls=1 tris=800
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=9 tris=168
  settlement:storageContainer  calls=8 tris=804
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=400
  settlement:storageWoodHousehold calls=4 tris=6940
  settlement:storageWoodSettlementPrimary calls=2 tris=891
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1064  tris avg: 9613763
  info calls avg: 1498  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=0 tris=101
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=1 tris=699
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=0 tris=309
  faunaFamily:wolf             calls=20 tris=9810
  grass                        calls=49 tris=6690564
  items                        calls=1 tris=880
  npcFamily:Knight_Cloth       calls=24 tris=29113
  npcFamily:Peasant            calls=60 tris=66066
  npcFamily:Peasant_Boots      calls=33 tris=41134
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=12255
  npcFamily:woodcutter         calls=9 tris=12136
  other                        calls=126 tris=21539
  settlement:decor             calls=164 tris=303026
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=4 tris=602
  settlement:fireHouseExteriorLamp calls=63 tris=4368
  settlement:fireHouseInteriorLamp calls=7 tris=756
  settlement:fireVillageTorch  calls=25 tris=1788
  settlement:houseInteractive  calls=21 tris=2310
  settlement:houseStatic       calls=50 tris=36834
  settlement:landmarkGarden    calls=12 tris=105228
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=10 tris=7480
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=16 tris=300
  settlement:storageBarrel     calls=12 tris=15224
  settlement:storageContainer  calls=43 tris=2688
  settlement:storageGoods      calls=37 tris=7595
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=1600
  settlement:storageWoodHousehold calls=14 tris=11395
  settlement:storageWoodSettlementPrimary calls=4 tris=1782
  settlement:workplace         calls=16 tris=9006
  terrain                      calls=26 tris=1916120
  vegetation                   calls=6 tris=1958
  water                        calls=4 tris=229376


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=12.3 ms  p95=13.4 ms  max=13.7 ms  Δavg vs baseline=—
  hide-grass           avg=12.4 ms  p95=13.5 ms  max=13.9 ms  Δavg vs baseline=+0.1 ms (+1%)
  hide-vegetation      avg=11.7 ms  p95=12.6 ms  max=13.1 ms  Δavg vs baseline=-0.6 ms (-5%)
  no vegetation/grass  avg=12.0 ms  p95=12.8 ms  max=13.2 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-environment     avg=12.0 ms  p95=12.9 ms  max=13.4 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-settlement      avg=8.8 ms  p95=9.6 ms  max=9.6 ms  Δavg vs baseline=-3.5 ms (-28%)
  no water             avg=12.2 ms  p95=13.0 ms  max=13.4 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=12.1 ms  p95=12.7 ms  max=12.9 ms  Δavg vs baseline=-0.2 ms (-2%)
  hide-npc-fauna       avg=8.2 ms  p95=9.0 ms  max=9.8 ms  Δavg vs baseline=-4.1 ms (-33%)
  no-shadows           avg=10.0 ms  p95=10.7 ms  max=11.1 ms  Δavg vs baseline=-2.3 ms (-19%)
  no-ao                avg=12.4 ms  p95=13.1 ms  max=13.5 ms  Δavg vs baseline=+0.1 ms (+1%)
  no-bloom             avg=12.3 ms  p95=13.1 ms  max=13.9 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-smaa              avg=12.6 ms  p95=13.5 ms  max=13.8 ms  Δavg vs baseline=+0.3 ms (+2%)
  no-god-rays          avg=12.5 ms  p95=13.0 ms  max=13.3 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-film-grade        avg=12.5 ms  p95=13.8 ms  max=14.3 ms  Δavg vs baseline=+0.2 ms (+1%)
  no postprocessing    avg=13.0 ms  p95=14.3 ms  max=14.3 ms  Δavg vs baseline=+0.7 ms (+6%)
  no mirrors           avg=12.0 ms  p95=12.7 ms  max=12.8 ms  Δavg vs baseline=-0.3 ms (-2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (35 samples resolved during the baseline window)
  GPU elapsed   avg=22.5 ms  p95=24.2 ms  max=25.8 ms
  CPU wall      avg=12.3 ms  p95=13.4 ms  max=13.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
