# Seedvale Performance Benchmark Report

> Generated: 2026-11-01T08:32:38.319Z
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
Frames: 299
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a7c2852c84647366a278187efd01c59eb0baf944
  runId: 2026-11-01T08-30-49-438Z-l2z4iy
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
  populationGate: stable waited=5070ms npc=24
  gpuTimer: available=true resolved=true samples=298 span=postprocess+labels

FPS:
  avg: 37.1
  min: 7
  p1: 20

Frame time (wall-clock):
  avg: 26.9 ms
  p50: 26.7 ms
  p95: 30.4 ms
  p99: 49.6 ms
  max: 139.2 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=5.3 p95=7.2 p99=33.3 max=123.6 n=299
  render: p50=20.9 p95=25 p99=27.2 max=60.8 n=299
  frame: p50=26.7 p95=30.4 p99=49.6 max=139.2 n=299

Rendering (combined renderer.info):
  draw calls: 1843 avg / 2171 max
  triangles: 10.81M avg
  mirror draws: 322 avg
  geometries: 688
  textures: 326

Pass submissions (actual):
  reliability: observed
  frames: 301 shadowRefresh=301 shadowSkipped=0
  mirror calls avg: 322
  shadow calls avg: 541
  main calls avg: 979

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
      near agents=1 camera-relevant=1 draws=9 tris=10.5k
      mid  agents=7 camera-relevant=2 draws=66 tris=87.9k
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
      near agents=4 camera-relevant=4 draws=17 tris=4.0k
      mid  agents=9 camera-relevant=5 draws=37 tris=15.5k
      far  agents=48 camera-relevant=13 draws=187 tris=76.5k

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
  WATER          3.2 ms
  NPC            2.6 ms
  FAUNA          2.1 ms
  PHYSICS        0.1 ms
  RENDER         17.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=16.3 ms draws=1842 tris=10.81M
  hide-grass         render=16.5 ms draws=1807 tris=5.81M
  hide-vegetation    render=16.3 ms draws=1804 tris=10.64M
  hide-vegetation-grass render=16.0 ms draws=1761 tris=5.63M
  hide-environment   render=17.0 ms draws=1823 tris=10.81M
  hide-settlement    render=11.6 ms draws=938 tris=9.60M
  hide-water         render=16.8 ms draws=1841 tris=10.66M
  hide-terrain       render=17.0 ms draws=1804 tris=6.92M
  hide-npc-fauna     render=10.9 ms draws=1520 tris=10.52M
  no-shadows         render=11.4 ms draws=1348 tris=8.72M
  no-ao              render=20.4 ms draws=1874 tris=10.83M
  no-bloom           render=19.3 ms draws=1860 tris=10.83M
  no-smaa            render=20.1 ms draws=1870 tris=10.83M
  no-god-rays        render=20.0 ms draws=1872 tris=10.83M
  no-film-grade      render=24.9 ms draws=1857 tris=10.82M
  no-postprocessing  render=16.6 ms draws=1840 tris=10.82M
  no-reflections     render=16.2 ms draws=1534 tris=9.97M

Frame attribution:
  frame max: 139.2 ms
  largest labelled hitch: 0 ms
  unattributed: 139.2 ms

Long frames:
  threshold: 80 ms
  count: 2
  worst: 139.2 ms

Raw sidecar:
  sampling=full factor=1 exported=299/299

Recommendation:
Largest frame (139.2 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 30

NPC:
  total: 2.6 ms/frame
  crowd pass: 0.0 ms/frame (2.2 ms cumulative)
  agent updates: 1.3 ms/frame (397.8 ms cumulative)
  livestock: 0.9 ms/frame (276.3 ms cumulative)
    loaded tick: 0.9 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.9 ms/frame
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
    pest scans: 4.0/frame (4.0 rat candidates/frame)
    nearest scans: 20.1/frame (0.0 candidates/frame)
    water samples: 57.8/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 57.8/frame, 0.10 ms/frame (worst call 0.20 ms, 10098.7 colliders/frame)
    full-rate agents/frame: 1.0
    reduced-cadence agents/frame: 27.2
    behaviour executions/frame: 20.1
    presentation executions/frame: 20.1
  rats: 0.2 ms/frame (62.2 ms cumulative)
  social: 0.0 ms/frame (1.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.2 ms/frame (47.5 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.1 ms/frame
  agent updates: 2.1 ms/frame (626.0 ms cumulative)
  forest sampling: 0.1 ms/frame (22.9 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (6.4 ms cumulative)
    targeting: 0.0 ms/frame (4.8 ms cumulative)
    decision: 0.0 ms/frame (3.9 ms cumulative)
    behaviour: 1.5 ms/frame (444.0 ms cumulative)
    life/presentation: 0.4 ms/frame (114.3 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.2
    sensing passes/frame: 30.2
    decision passes/frame: 30.2
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 19.3
    full-rate agents/frame: 8.4
    reduced-cadence agents/frame: 21.8
    behaviour executions/frame: 19.3
    presentation executions/frame: 19.2

  sensing/cache:
    forest samples/frame: 30.2
    fire scan candidates/frame: 30.2
    village scan candidates/frame: 585.4
    player perception checks/frame: 30.2

  nearest scans: 26.9/frame (8036 calls)
  nearest candidates checked: 252.7/frame (75560 total)
  herd leader scans: 0.2/frame (73 calls)
  herd candidates checked: 7.3/frame (2190 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 26.9/frame (191.9 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 101.7/frame, 0.10 ms/frame (worst call 0.70 ms)
    collider queries: 101.7/frame, 0.10 ms/frame (worst call 1.80 ms, 19515.4 colliders/frame)

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
Frames: 301
Shadow refresh frames: 301
Shadow skipped frames: 0

Mirror:
  calls avg: 322  tris avg: 852473
  info calls avg: 322  residual calls avg: 0
  switches avg: material=110.1 program=55.8  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2 skeletons first used=2
  environment                  calls=0 tris=433
  other                        calls=109 tris=5774
  settlement:decor             calls=48 tris=111989
  settlement:fence             calls=2 tris=3221
  settlement:fireCampfire      calls=4 tris=308
  settlement:fireHouseExteriorLamp calls=12 tris=574
  settlement:fireHouseInteriorLamp calls=4 tris=431
  settlement:fireVillageTorch  calls=12 tris=891
  settlement:houseInteractive  calls=13 tris=1480
  settlement:houseStatic       calls=33 tris=43091
  settlement:landmarkGarden    calls=3 tris=34959
  settlement:landmarkNoticeBoard calls=1 tris=18
  settlement:landmarkWellCentral calls=2 tris=932
  settlement:landmarkWellHousehold calls=2 tris=2796
  settlement:landmarkWellPasture calls=2 tris=932
  settlement:other             calls=8 tris=30118
  settlement:storageBarrel     calls=6 tris=10346
  settlement:storageContainer  calls=9 tris=1961
  settlement:storageGoods      calls=29 tris=5625
  settlement:storageHay        calls=0 tris=243
  settlement:storageTrough     calls=3 tris=1196
  settlement:storageWoodHousehold calls=1 tris=4276
  settlement:storageWoodSettlementPrimary calls=1 tris=777
  settlement:workplace         calls=4 tris=2030
  terrain                      calls=8 tris=587589
  vegetation                   calls=2 tris=674

Shadow (refresh only):
  calls avg: 541  tris avg: 2099823
  info calls avg: 541  residual calls avg: 0
  switches avg: material=151 program=169.3  actor: calls=128.3 material=0 program=15.6
  skinning avg: skinned calls=122.3 skeletons first used=33.6
  environment                  calls=2 tris=1736
  faunaFamily:chicken          calls=10 tris=1296
  faunaFamily:cow              calls=7 tris=2450
  faunaFamily:dog              calls=10 tris=3840
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=1 tris=2527
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=8 tris=2440
  npcFamily:Farmer             calls=17 tris=25375
  npcFamily:Knight_Cloth       calls=10 tris=12816
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12208
  npcFamily:Ranger_NoHood      calls=13 tris=15186
  npcFamily:woodcutter         calls=7 tris=10814
  other                        calls=86 tris=13926
  settlement:decor             calls=188 tris=366867
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
  terrain                      calls=18 tris=1326608
  vegetation                   calls=32 tris=172682

Main:
  calls avg: 979  tris avg: 7861121
  info calls avg: 1520  residual calls avg: 0
  switches avg: material=387.1 program=187.8  actor: calls=195.9 material=125.1 program=59.8
  skinning avg: skinned calls=183.9 skeletons first used=27.9
  environment                  calls=15 tris=9047
  faunaFamily:bear             calls=2 tris=1332
  faunaFamily:chicken          calls=20 tris=2592
  faunaFamily:dog              calls=22 tris=7740
  faunaFamily:horse            calls=8 tris=2182
  faunaFamily:rat              calls=3 tris=6060
  faunaFamily:rooster          calls=1 tris=1200
  faunaFamily:sheep            calls=12 tris=3660
  faunaFamily:wolf             calls=14 tris=6865
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
Long frames: 2
Shown: 2 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 2 shown, 2 total):

[LONG FRAME] 139.2ms
simulate       123.6ms
render          15.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              2.8ms
FAUNA          119.2ms
PHYSICS          0.1ms
RENDER          15.3ms
OTHER            1.7ms

Long frame #2:

[LONG FRAME] 103ms
simulate        87.3ms
render          15.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              2.6ms
FAUNA           82.8ms
PHYSICS          0.2ms
RENDER          15.2ms
OTHER            2.2ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=16.3 ms  p95=18.4 ms  max=21.5 ms  Δavg vs baseline=—
  hide-grass           avg=16.5 ms  p95=19.2 ms  max=19.5 ms  Δavg vs baseline=+0.3 ms (+2%)
  hide-vegetation      avg=16.3 ms  p95=20.0 ms  max=21.7 ms  Δavg vs baseline=+0.0 ms (+0%)
  no vegetation/grass  avg=16.0 ms  p95=18.2 ms  max=19.8 ms  Δavg vs baseline=-0.3 ms (-2%)
  hide-environment     avg=17.0 ms  p95=20.0 ms  max=26.8 ms  Δavg vs baseline=+0.7 ms (+4%)
  hide-settlement      avg=11.6 ms  p95=13.6 ms  max=14.3 ms  Δavg vs baseline=-4.7 ms (-29%)
  no water             avg=16.8 ms  p95=19.7 ms  max=19.7 ms  Δavg vs baseline=+0.5 ms (+3%)
  hide-terrain         avg=17.0 ms  p95=18.9 ms  max=19.5 ms  Δavg vs baseline=+0.7 ms (+4%)
  hide-npc-fauna       avg=10.9 ms  p95=12.2 ms  max=13.0 ms  Δavg vs baseline=-5.4 ms (-33%)
  no-shadows           avg=11.4 ms  p95=12.3 ms  max=13.4 ms  Δavg vs baseline=-4.9 ms (-30%)
  no-ao                avg=20.4 ms  p95=24.7 ms  max=28.4 ms  Δavg vs baseline=+4.1 ms (+25%)
  no-bloom             avg=19.3 ms  p95=23.6 ms  max=24.9 ms  Δavg vs baseline=+3.0 ms (+19%)
  no-smaa              avg=20.1 ms  p95=24.4 ms  max=25.4 ms  Δavg vs baseline=+3.8 ms (+23%)
  no-god-rays          avg=20.0 ms  p95=24.2 ms  max=25.6 ms  Δavg vs baseline=+3.7 ms (+23%)
  no-film-grade        avg=24.9 ms  p95=22.6 ms  max=222.5 ms  Δavg vs baseline=+8.6 ms (+53%)
  no postprocessing    avg=16.6 ms  p95=20.2 ms  max=29.3 ms  Δavg vs baseline=+0.3 ms (+2%)
  no mirrors           avg=16.2 ms  p95=21.4 ms  max=25.3 ms  Δavg vs baseline=-0.1 ms (-0%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=69.1 ms  p95=79.7 ms  max=80.8 ms
  CPU wall      avg=16.3 ms  p95=18.4 ms  max=21.5 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
