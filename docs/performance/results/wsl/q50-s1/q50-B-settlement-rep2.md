# Seedvale Performance Benchmark Report

> Generated: 2026-11-01T07:16:38.402Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement
Duration: 30s
Frames: 298
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: caab7ae2d9e449f3a7f6ac893a26f689386d892e
  runId: 2026-11-01T07-14-52-404Z-639lat
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
  camera: pos=(-8.1, 11.7, -0.3)
  anchor: (-8.1, -11.5)
  populationGate: stable waited=5093ms npc=24
  gpuTimer: available=true resolved=true samples=297 span=postprocess+labels

FPS:
  avg: 36.4
  min: 13
  p1: 19

Frame time (wall-clock):
  avg: 27.4 ms
  p50: 27.2 ms
  p95: 35.6 ms
  p99: 54 ms
  max: 76.4 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.2 p95=8.6 p99=36.6 max=60.3 n=298
  render: p50=20.9 p95=24.4 p99=27 max=71.2 n=298
  frame: p50=27.2 p95=35.6 p99=54 max=76.4 n=298

Rendering (combined renderer.info):
  draw calls: 1781 avg / 2111 max
  triangles: 10.19M avg
  mirror draws: 324 avg
  geometries: 670
  textures: 320

Pass submissions (actual):
  reliability: observed
  frames: 300 shadowRefresh=300 shadowSkipped=0
  mirror calls avg: 324
  shadow calls avg: 476
  main calls avg: 982

Scene (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  grass            draws=72 tris=7.22M meshes=72 inst=549991
  vegetation       draws=102 tris=263.9k meshes=102 inst=183
  environment      draws=48 tris=24.5k meshes=48 inst=48
  settlement       draws=693 tris=865.8k meshes=693 inst=2109
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=223 tris=289.1k meshes=223 inst=223
  fauna            draws=241 tris=96.1k meshes=241 inst=241
  items            draws=261 tris=31.7k meshes=261 inst=261
  other            draws=424 tris=28.6k meshes=424 inst=424

Shadow casters (one-pass estimate):
  terrain          draws=64 tris=4.72M meshes=64 inst=64
  vegetation       draws=100 tris=257.1k meshes=100 inst=181
  environment      draws=48 tris=24.5k meshes=48 inst=48
  settlement       draws=452 tris=621.2k meshes=452 inst=1763
  npc              draws=75 tris=98.4k meshes=75 inst=75
  fauna            draws=54 tris=19.6k meshes=54 inst=54
  items            draws=43 tris=26.0k meshes=43 inst=43
  other            draws=111 tris=14.5k meshes=111 inst=111

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=89 tris=109.4k meshes=89 inst=816
  houseInteractive draws=34 tris=5.3k meshes=34 inst=34
  fence            draws=4 tris=6.5k meshes=4 inst=32
  storageWoodSettlementPrimary draws=3 tris=2.3k meshes=3 inst=3
  storageWoodHousehold draws=3 tris=10.9k meshes=3 inst=14
  storageContainer draws=18 tris=4.6k meshes=18 inst=62
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=3.0k meshes=8 inst=30
  workplace        draws=9 tris=6.0k meshes=9 inst=9
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=4.0k meshes=3 inst=5
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=14 tris=1.5k meshes=14 inst=14
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=199 tris=380.6k meshes=199 inst=302
  other            draws=35 tris=77.3k meshes=35 inst=409

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=111 tris=135.1k skinned=111/111
      Farmer           agents=4 draws=35 tris=51.7k skinned=35/35
      Knight_Cloth     agents=3 draws=29 tris=37.5k skinned=29/29
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      Ranger_NoHood    agents=1 draws=13 tris=15.2k skinned=13/13
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=7 tris=10.8k skinned=7/7
    by distance band:
      mid  agents=8 camera-relevant=3 draws=75 tris=98.4k
      far  agents=16 camera-relevant=9 draws=148 tris=190.7k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      dog              agents=6 draws=33 tris=11.6k skinned=33/33
      horse            agents=4 draws=32 tris=8.7k skinned=32/32
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      wolf             agents=6 draws=24 tris=11.8k skinned=24/24
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      bear             agents=6 draws=6 tris=4.0k skinned=6/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=4 camera-relevant=4 draws=20 tris=5.4k
      mid  agents=9 camera-relevant=6 draws=34 tris=14.2k
      far  agents=48 camera-relevant=15 draws=187 tris=76.5k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=64 composed=64 multiplied=64 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=125 composed=125 multiplied=125 skinned=0
  environment              nodes=72 composed=72 multiplied=72 skinned=0
  settlement               nodes=1394 composed=1394 multiplied=1394 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1878 composed=1878 multiplied=1878 skinned=223
  fauna                    nodes=2557 composed=2557 multiplied=2557 skinned=206
  items                    nodes=399 composed=399 multiplied=399 skinned=0
  other                    nodes=686 composed=669 multiplied=686 skinned=9
  top scene children:
    fauna ×61                nodes=2557 composed=2557 multiplied=2557 skinned=206
    npc ×24                  nodes=1878 composed=1878 multiplied=1878 skinned=223
    settlement ×3            nodes=1394 composed=1394 multiplied=1394 skinned=0
    Group ×82                nodes=518 composed=518 multiplied=518 skinned=9
    chunk-items ×26          nodes=366 composed=366 multiplied=366 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×64                nodes=64 composed=64 multiplied=64 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×33             nodes=33 composed=33 multiplied=33 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-environmen ×4      nodes=25 composed=25 multiplied=25 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0

Systems:
  WATER          3.3 ms
  NPC            2.7 ms
  FAUNA          2.4 ms
  PHYSICS        0.1 ms
  RENDER         17.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=16.1 ms draws=1786 tris=10.19M
  hide-grass         render=15.5 ms draws=1745 tris=5.17M
  hide-vegetation    render=15.9 ms draws=1777 tris=10.17M
  hide-vegetation-grass render=15.6 ms draws=1732 tris=5.15M
  hide-environment   render=16.0 ms draws=1771 tris=10.18M
  hide-settlement    render=11.4 ms draws=899 tris=9.00M
  hide-water         render=16.0 ms draws=1783 tris=10.03M
  hide-terrain       render=15.8 ms draws=1739 tris=6.72M
  hide-npc-fauna     render=10.9 ms draws=1455 tris=9.89M
  no-shadows         render=12.0 ms draws=1334 tris=8.72M
  no-ao              render=16.1 ms draws=1775 tris=10.19M
  no-bloom           render=15.9 ms draws=1768 tris=10.18M
  no-smaa            render=16.5 ms draws=1778 tris=10.18M
  no-god-rays        render=16.3 ms draws=1782 tris=10.19M
  no-film-grade      render=16.6 ms draws=1783 tris=10.19M
  no-postprocessing  render=16.0 ms draws=1753 tris=10.19M
  no-reflections     render=15.8 ms draws=1448 tris=9.33M

Frame attribution:
  frame max: 76.4 ms
  largest labelled hitch: 0 ms
  unattributed: 76.4 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Raw sidecar:
  sampling=full factor=1 exported=298/298

Recommendation:
Largest frame (76.4 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.7 ms/frame
  crowd pass: 0.0 ms/frame (2.5 ms cumulative)
  agent updates: 1.3 ms/frame (396.7 ms cumulative)
  livestock: 1.0 ms/frame (295.1 ms cumulative)
    loaded tick: 1.0 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.0 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.5 ms/frame
      life/presentation: 0.3 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 28.2
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.0
    dog guard scans: 6.0/frame (36.2 predator candidates/frame)
    pest scans: 3.6/frame (3.6 rat candidates/frame)
    nearest scans: 20.1/frame (0.0 candidates/frame)
    water samples: 52.4/frame, 0.00 ms/frame (worst call 0.10 ms)
    collider queries: 52.4/frame, 0.10 ms/frame (worst call 0.10 ms, 8522.4 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 27.2
    behaviour executions/frame: 20.1
    presentation executions/frame: 20.1
  rats: 0.2 ms/frame (52.8 ms cumulative)
  social: 0.0 ms/frame (2.4 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (47.3 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.4 ms/frame
  agent updates: 2.4 ms/frame (714.9 ms cumulative)
  forest sampling: 0.1 ms/frame (25.6 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (5.5 ms cumulative)
    targeting: 0.0 ms/frame (6.9 ms cumulative)
    decision: 0.0 ms/frame (4.0 ms cumulative)
    behaviour: 1.8 ms/frame (538.2 ms cumulative)
    life/presentation: 0.3 ms/frame (103.8 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.1
    full-rate agents/frame: 8.1
    reduced-cadence agents/frame: 22.1
    behaviour executions/frame: 19.1
    presentation executions/frame: 19.1

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 583.4
    player perception checks/frame: 30.2

  nearest scans: 27.2/frame (8100 calls)
  nearest candidates checked: 249.8/frame (74455 total)
  herd leader scans: 0.3/frame (90 calls)
  herd candidates checked: 9.1/frame (2700 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 27.1/frame (178.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 69.4/frame, 0.10 ms/frame (worst call 0.20 ms)
    collider queries: 69.4/frame, 0.10 ms/frame (worst call 0.90 ms, 12807.0 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=321136 filler=614615
Submitted instances: full=260618 filler=289373
Meshes submitted: 72
LOD submitted fraction: full=0.811550246624483 filler=0.470819944192706
Flowers: unavailable
Allocation bytes (estimated): 89832096
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 300
Shadow refresh frames: 300
Shadow skipped frames: 0

Mirror:
  calls avg: 324  tris avg: 855747
  info calls avg: 324  residual calls avg: 0
  switches avg: material=110.5 program=56  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=1 tris=434
  other                        calls=109 tris=5794
  settlement:decor             calls=49 tris=112795
  settlement:fence             calls=2 tris=3232
  settlement:fireCampfire      calls=4 tris=309
  settlement:fireHouseExteriorLamp calls=12 tris=576
  settlement:fireHouseInteriorLamp calls=4 tris=432
  settlement:fireVillageTorch  calls=13 tris=894
  settlement:houseInteractive  calls=14 tris=1485
  settlement:houseStatic       calls=33 tris=43235
  settlement:landmarkGarden    calls=3 tris=35076
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=3 tris=935
  settlement:landmarkWellHousehold calls=3 tris=2805
  settlement:landmarkWellPasture calls=3 tris=935
  settlement:other             calls=9 tris=30218
  settlement:storageBarrel     calls=6 tris=10380
  settlement:storageContainer  calls=9 tris=1968
  settlement:storageGoods      calls=30 tris=5644
  settlement:storageHay        calls=1 tris=244
  settlement:storageTrough     calls=3 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4290
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=5 tris=2037
  terrain                      calls=8 tris=589548
  vegetation                   calls=2 tris=676

Shadow (refresh only):
  calls avg: 476  tris avg: 1466097
  info calls avg: 476  residual calls avg: 0
  switches avg: material=119 program=142.5  actor: calls=127.8 material=0 program=15.8
  skinning avg: skinned calls=121.8 skeletons first used=33.7
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=15 tris=4168
  faunaFamily:rat              calls=2 tris=3016
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=73 tris=13371
  settlement:decor             calls=174 tris=332953
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=11 tris=32488
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=12 tris=884452
  vegetation                   calls=2 tris=17024

Main:
  calls avg: 982  tris avg: 7864232
  info calls avg: 1457  residual calls avg: 0
  switches avg: material=386.4 program=187.6  actor: calls=198.6 material=124.4 program=57.6
  skinning avg: skinned calls=186.6 skeletons first used=28.7
  environment                  calls=15 tris=9047
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=20 tris=2592
  faunaFamily:dog              calls=20 tris=6994
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=4 tris=8008
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=12 tris=3660
  faunaFamily:wolf             calls=18 tris=8774
  grass                        calls=43 tris=5012082
  items                        calls=1 tris=880
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=9 tris=11990
  npcFamily:Peasant            calls=56 tris=67943
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:blacksmith         calls=10 tris=14387
  other                        calls=264 tris=21051
  settlement:decor             calls=85 tris=191331
  settlement:fence             calls=4 tris=6464
  settlement:fireCampfire      calls=8 tris=617
  settlement:fireHouseExteriorLamp calls=24 tris=1152
  settlement:fireHouseInteriorLamp calls=8 tris=864
  settlement:fireVillageTorch  calls=30 tris=2146
  settlement:houseInteractive  calls=30 tris=3300
  settlement:houseStatic       calls=66 tris=86470
  settlement:landmarkGarden    calls=6 tris=70152
  settlement:landmarkNoticeBoard calls=4 tris=72
  settlement:landmarkWellCentral calls=10 tris=3740
  settlement:landmarkWellHousehold calls=5 tris=5610
  settlement:landmarkWellPasture calls=5 tris=1870
  settlement:other             calls=20 tris=60496
  settlement:storageBarrel     calls=12 tris=20760
  settlement:storageContainer  calls=18 tris=3936
  settlement:storageGoods      calls=59 tris=11288
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=6 tris=2400
  settlement:storageWoodHousehold calls=2 tris=8580
  settlement:storageWoodSettlementPrimary calls=2 tris=1560
  settlement:workplace         calls=15 tris=7358
  terrain                      calls=27 tris=1989848
  vegetation                   calls=10 tris=3574
  water                        calls=3 tris=155648


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=16.1 ms  p95=18.0 ms  max=19.1 ms  Δavg vs baseline=—
  hide-grass           avg=15.5 ms  p95=16.9 ms  max=17.4 ms  Δavg vs baseline=-0.6 ms (-4%)
  hide-vegetation      avg=15.9 ms  p95=17.6 ms  max=18.2 ms  Δavg vs baseline=-0.2 ms (-1%)
  no vegetation/grass  avg=15.6 ms  p95=17.3 ms  max=17.9 ms  Δavg vs baseline=-0.5 ms (-3%)
  hide-environment     avg=16.0 ms  p95=18.8 ms  max=19.4 ms  Δavg vs baseline=-0.2 ms (-1%)
  hide-settlement      avg=11.4 ms  p95=12.4 ms  max=12.8 ms  Δavg vs baseline=-4.7 ms (-29%)
  no water             avg=16.0 ms  p95=18.0 ms  max=21.9 ms  Δavg vs baseline=-0.1 ms (-1%)
  hide-terrain         avg=15.8 ms  p95=17.8 ms  max=18.1 ms  Δavg vs baseline=-0.4 ms (-2%)
  hide-npc-fauna       avg=10.9 ms  p95=12.1 ms  max=12.8 ms  Δavg vs baseline=-5.3 ms (-33%)
  no-shadows           avg=12.0 ms  p95=13.0 ms  max=13.4 ms  Δavg vs baseline=-4.1 ms (-25%)
  no-ao                avg=16.1 ms  p95=17.5 ms  max=18.1 ms  Δavg vs baseline=-0.0 ms (-0%)
  no-bloom             avg=15.9 ms  p95=17.3 ms  max=24.5 ms  Δavg vs baseline=-0.2 ms (-1%)
  no-smaa              avg=16.5 ms  p95=18.2 ms  max=21.5 ms  Δavg vs baseline=+0.4 ms (+2%)
  no-god-rays          avg=16.3 ms  p95=18.7 ms  max=18.9 ms  Δavg vs baseline=+0.2 ms (+1%)
  no-film-grade        avg=16.6 ms  p95=19.2 ms  max=20.2 ms  Δavg vs baseline=+0.5 ms (+3%)
  no postprocessing    avg=16.0 ms  p95=17.1 ms  max=17.7 ms  Δavg vs baseline=-0.1 ms (-1%)
  no mirrors           avg=15.8 ms  p95=17.0 ms  max=17.4 ms  Δavg vs baseline=-0.3 ms (-2%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (29 samples resolved during the baseline window)
  GPU elapsed   avg=55.3 ms  p95=78.5 ms  max=78.6 ms
  CPU wall      avg=16.1 ms  p95=18.0 ms  max=19.1 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
