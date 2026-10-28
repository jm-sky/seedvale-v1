# Seedvale Performance Benchmark Report

> Generated: 2026-10-28T17:19:33.765Z
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
Frames: 1405
Quality: High
Pixel ratio: 1.25

Reproducibility:
  gitSha: 36e99ef6c31000b683619916b4d19a210408760e
  runId: 2026-10-28T17-18-34-023Z-bnl3y6
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
  camera: pos=(-8.1, 8.4, 31.7)
  anchor: (-8.1, 20.5)
  populationGate: stable waited=5242ms npc=20
  gpuTimer: available=true resolved=true samples=1409 span=postprocess+labels

FPS:
  avg: 57.6
  min: 13
  p1: 33

Frame time (wall-clock):
  avg: 17.4 ms
  p50: 17.7 ms
  p95: 21.2 ms
  p99: 30.1 ms
  max: 74.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=3 p95=4.5 p99=14.6 max=60.9 n=1405
  render: p50=14.2 p95=17.2 p99=19 max=41 n=1405
  frame: p50=17.7 p95=21.2 p99=30.1 max=74.2 n=1405

Rendering (combined renderer.info):
  draw calls: 1808 avg / 2175 max
  triangles: 12.53M avg
  mirror draws: 335 avg
  geometries: 577
  textures: 493

Pass submissions (actual):
  reliability: observed
  frames: 1414 shadowRefresh=1414 shadowSkipped=0
  mirror calls avg: 335
  shadow calls avg: 421
  main calls avg: 1052

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=84 tris=7.46M meshes=84 inst=562716
  vegetation       draws=101 tris=249.6k meshes=101 inst=176
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=702 tris=692.1k meshes=702 inst=1307
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=188 tris=238.0k meshes=188 inst=188
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=162 tris=17.6k meshes=162 inst=162
  other            draws=234 tris=26.3k meshes=234 inst=234

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=99 tris=242.8k meshes=99 inst=174
  environment      draws=136 tris=21.3k meshes=136 inst=136
  settlement       draws=422 tris=488.6k meshes=422 inst=972
  npc              draws=16 tris=22.9k meshes=16 inst=16
  fauna            draws=14 tris=4.6k meshes=14 inst=14
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=108 tris=14.8k meshes=108 inst=108

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=71 tris=51.1k meshes=71 inst=451
  houseInteractive draws=20 tris=3.1k meshes=20 inst=20
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=7.8k meshes=3 inst=10
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
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Wizard           agents=2 draws=24 tris=23.8k skinned=24/24
      Farmer           agents=2 draws=18 tris=26.3k skinned=18/18
      Peasant_Boots    agents=2 draws=18 tris=24.2k skinned=18/18
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      near agents=2 camera-relevant=2 draws=16 tris=22.9k
      far  agents=18 camera-relevant=11 draws=172 tris=215.1k
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
      near agents=2 camera-relevant=1 draws=6 tris=2.5k
      mid  agents=1 camera-relevant=1 draws=8 tris=2.2k
      far  agents=49 camera-relevant=20 draws=198 tris=83.7k

Systems:
  WATER          2.7 ms
  NPC            1.4 ms
  FAUNA          1.1 ms
  PHYSICS        0.1 ms
  RENDER         11.0 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=10.1 ms draws=1785 tris=12.47M
  hide-grass         render=10.4 ms draws=1757 tris=5.84M
  hide-vegetation    render=11.0 ms draws=1758 tris=12.36M
  hide-vegetation-grass render=12.3 ms draws=1711 tris=5.67M
  hide-environment   render=13.2 ms draws=1716 tris=12.52M
  hide-settlement    render=9.6 ms draws=733 tris=11.31M
  hide-water         render=13.2 ms draws=1806 tris=12.29M
  hide-terrain       render=13.1 ms draws=1761 tris=8.58M
  hide-npc-fauna     render=7.5 ms draws=1583 tris=12.30M
  no-shadows         render=8.5 ms draws=1367 tris=10.38M
  no-ao              render=10.5 ms draws=1788 tris=12.46M
  no-bloom           render=10.1 ms draws=1803 tris=12.52M
  no-smaa            render=10.3 ms draws=1813 tris=12.52M
  no-god-rays        render=10.9 ms draws=1793 tris=12.46M
  no-film-grade      render=10.3 ms draws=1813 tris=12.52M
  no-postprocessing  render=10.7 ms draws=1785 tris=12.52M
  no-reflections     render=10.8 ms draws=1472 tris=11.61M

Frame attribution:
  frame max: 74.2 ms
  largest labelled hitch: 0 ms
  unattributed: 74.2 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=1405/1405

Recommendation:
Largest frame (74.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.4 ms/frame
  crowd pass: 0.0 ms/frame (9.2 ms cumulative)
  agent updates: 0.9 ms/frame (1261.6 ms cumulative)
  livestock: 0.3 ms/frame (404.4 ms cumulative)
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
      behaviour: 0.1 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.0 ms/frame
    update calls/frame: 19.1
    unique animals/frame: 19.1
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.2 predator candidates/frame)
    pest scans: 1.2/frame (1.2 rat candidates/frame)
    nearest scans: 5.7/frame (0.0 candidates/frame)
    water samples: 11.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 11.4/frame, 0.00 ms/frame (worst call 0.30 ms, 636.4 colliders/frame)
    full-rate agents/frame: 0.0
    reduced-cadence agents/frame: 19.1
    behaviour executions/frame: 5.7
    presentation executions/frame: 5.3
  rats: 0.1 ms/frame (99.7 ms cumulative)
  social: 0.0 ms/frame (4.3 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (140.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.1 ms/frame
  agent updates: 1.1 ms/frame (1495.7 ms cumulative)
  forest sampling: 0.1 ms/frame (105.3 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (19.9 ms cumulative)
    targeting: 0.0 ms/frame (18.3 ms cumulative)
    decision: 0.0 ms/frame (14.8 ms cumulative)
    behaviour: 0.6 ms/frame (855.8 ms cumulative)
    life/presentation: 0.3 ms/frame (380.6 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 29.0
    decision passes/frame: 29.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 14.7
    full-rate agents/frame: 8.8
    reduced-cadence agents/frame: 20.2
    behaviour executions/frame: 14.7
    presentation executions/frame: 13.7

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 29.0
    village scan candidates/frame: 369.3
    player perception checks/frame: 29.0

  nearest scans: 20.8/frame (29235 calls)
  nearest candidates checked: 153.3/frame (215422 total)
  herd leader scans: 0.1/frame (134 calls)
  herd candidates checked: 2.9/frame (4020 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.1/frame (120.6 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 72.4/frame, 0.10 ms/frame (worst call 0.60 ms)
    collider queries: 72.4/frame, 0.10 ms/frame (worst call 0.80 ms, 4694.8 colliders/frame)

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
Frames: 1414
Shadow refresh frames: 1414
Shadow skipped frames: 0

Mirror:
  calls avg: 335  tris avg: 908903
  info calls avg: 335  residual calls avg: 0
  environment                  calls=1 tris=434
  other                        calls=51 tris=10514
  settlement:decor             calls=85 tris=160902
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
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
  settlement:other             calls=9 tris=162
  settlement:storageBarrel     calls=6 tris=7612
  settlement:storageContainer  calls=22 tris=1344
  settlement:storageGoods      calls=29 tris=5974
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=3 tris=800
  settlement:storageWoodHousehold calls=1 tris=2730
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=8 tris=4503
  terrain                      calls=9 tris=626412
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 421  tris avg: 2019053
  info calls avg: 421  residual calls avg: 0
  environment                  calls=5 tris=1534
  faunaFamily:fox              calls=4 tris=1945
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:sheep            calls=2 tris=610
  items                        calls=1 tris=327
  npcFamily:Peasant_Boots      calls=9 tris=12096
  npcFamily:Wizard             calls=0 tris=25
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=67 tris=13677
  settlement:decor             calls=196 tris=384574
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
  settlement:storageWoodHousehold calls=1 tris=1560
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=19 tris=1400548
  vegetation                   calls=40 tris=169113

Main:
  calls avg: 1052  tris avg: 9602734
  info calls avg: 1473  residual calls avg: 0
  environment                  calls=87 tris=10251
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:deer             calls=1 tris=417
  faunaFamily:dog              calls=17 tris=5820
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rabbit           calls=3 tris=1847
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:sheep            calls=6 tris=1830
  faunaFamily:stag             calls=2 tris=1284
  faunaFamily:wolf             calls=19 tris=9300
  grass                        calls=49 tris=6690564
  items                        calls=3 tris=932
  npcFamily:Farmer             calls=9 tris=13142
  npcFamily:Knight_Cloth       calls=19 tris=24806
  npcFamily:Peasant            calls=37 tris=45721
  npcFamily:Peasant_Boots      calls=18 tris=24206
  npcFamily:Wizard             calls=24 tris=23798
  npcFamily:blacksmith         calls=10 tris=14387
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=131 tris=21599
  settlement:decor             calls=167 tris=319388
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
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
  settlement:storageGoods      calls=58 tris=11948
  settlement:storageHay        calls=2 tris=976
  settlement:storageTrough     calls=6 tris=1600
  settlement:storageWoodHousehold calls=2 tris=5460
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
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

  baseline             avg=10.1 ms  p95=11.5 ms  max=12.5 ms  Δavg vs baseline=—
  hide-grass           avg=10.4 ms  p95=12.3 ms  max=16.4 ms  Δavg vs baseline=+0.3 ms (+3%)
  hide-vegetation      avg=11.0 ms  p95=13.0 ms  max=13.3 ms  Δavg vs baseline=+0.9 ms (+9%)
  no vegetation/grass  avg=12.3 ms  p95=13.6 ms  max=14.3 ms  Δavg vs baseline=+2.2 ms (+22%)
  hide-environment     avg=13.2 ms  p95=13.9 ms  max=14.1 ms  Δavg vs baseline=+3.1 ms (+31%)
  hide-settlement      avg=9.6 ms  p95=10.3 ms  max=10.6 ms  Δavg vs baseline=-0.5 ms (-5%)
  no water             avg=13.2 ms  p95=14.0 ms  max=14.8 ms  Δavg vs baseline=+3.1 ms (+31%)
  hide-terrain         avg=13.1 ms  p95=14.0 ms  max=14.9 ms  Δavg vs baseline=+3.0 ms (+30%)
  hide-npc-fauna       avg=7.5 ms  p95=8.8 ms  max=9.4 ms  Δavg vs baseline=-2.6 ms (-26%)
  no-shadows           avg=8.5 ms  p95=10.0 ms  max=14.1 ms  Δavg vs baseline=-1.6 ms (-16%)
  no-ao                avg=10.5 ms  p95=11.7 ms  max=12.0 ms  Δavg vs baseline=+0.4 ms (+4%)
  no-bloom             avg=10.1 ms  p95=10.9 ms  max=12.0 ms  Δavg vs baseline=+0.0 ms (+0%)
  no-smaa              avg=10.3 ms  p95=12.1 ms  max=12.3 ms  Δavg vs baseline=+0.2 ms (+2%)
  no-god-rays          avg=10.9 ms  p95=13.7 ms  max=14.8 ms  Δavg vs baseline=+0.8 ms (+8%)
  no-film-grade        avg=10.3 ms  p95=11.5 ms  max=11.7 ms  Δavg vs baseline=+0.2 ms (+2%)
  no postprocessing    avg=10.7 ms  p95=12.2 ms  max=12.9 ms  Δavg vs baseline=+0.6 ms (+6%)
  no mirrors           avg=10.8 ms  p95=11.9 ms  max=12.5 ms  Δavg vs baseline=+0.7 ms (+7%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (31 samples resolved during the baseline window)
  GPU elapsed   avg=19.7 ms  p95=20.2 ms  max=20.6 ms
  CPU wall      avg=10.1 ms  p95=11.5 ms  max=12.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
