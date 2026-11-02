# Seedvale Performance Benchmark Report

> Generated: 2026-11-02T15:32:07.161Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Baseline]
> - [Seedvale Pass Submissions]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: settlement-walk
Duration: 30s
Frames: 224
Quality: High
Pixel ratio: 1

Reproducibility:
  gitSha: a05ea60dc0ccd87ab39b4bb8b06b9d08f5b8678e
  runId: 2026-11-02T15-29-46-070Z-61gk7v
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
  camera: pos=(-0.9, 10.3, 10.6)
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=3 m/s duration=30s
  populationGate: stable waited=5075ms npc=24
  gpuTimer: available=true resolved=true samples=223 span=postprocess+labels

FPS:
  avg: 21.4
  min: 2
  p1: 5

Frame time (wall-clock):
  avg: 46.8 ms
  p50: 38.8 ms
  p95: 77.9 ms
  p99: 209.2 ms
  max: 404 ms

Distributions (CPU wall-clock; render may include GPU wait):
  update: p50=8.7 p95=18.5 p99=42.5 max=90.5 n=224
  render: p50=28.7 p95=53.5 p99=189.5 max=395.9 n=224
  frame: p50=38.8 p95=77.9 p99=209.2 max=404 n=224

Rendering (combined renderer.info):
  draw calls: 1771 avg / 2335 max
  triangles: 10.76M avg
  mirror draws: 298 avg
  geometries: 935
  textures: 407

Pass submissions (actual):
  reliability: observed
  frames: 226 shadowRefresh=220 shadowSkipped=6
  mirror calls avg: 299
  shadow calls avg: 496
  main calls avg: 990

Scene (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  grass            draws=72 tris=7.87M meshes=72 inst=583858
  vegetation       draws=100 tris=267.0k meshes=100 inst=178
  environment      draws=44 tris=17.0k meshes=44 inst=44
  settlement       draws=716 tris=905.3k meshes=716 inst=1992
  water            draws=25 tris=1.78M meshes=25 inst=25
  npc              draws=225 tris=290.2k meshes=225 inst=225
  fauna            draws=243 tris=96.7k meshes=243 inst=243
  items            draws=158 tris=17.4k meshes=158 inst=158
  other            draws=342 tris=27.9k meshes=342 inst=342

Shadow casters (one-pass estimate):
  terrain          draws=55 tris=4.05M meshes=55 inst=55
  vegetation       draws=98 tris=260.1k meshes=98 inst=176
  environment      draws=44 tris=17.0k meshes=44 inst=44
  settlement       draws=472 tris=659.6k meshes=472 inst=1643
  npc              draws=68 tris=86.4k meshes=68 inst=68
  fauna            draws=42 tris=11.3k meshes=42 inst=42
  items            draws=23 tris=14.4k meshes=23 inst=23
  other            draws=105 tris=14.4k meshes=105 inst=105

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=89 tris=109.4k meshes=89 inst=816
  houseInteractive draws=34 tris=5.3k meshes=34 inst=34
  fence            draws=8 tris=7.7k meshes=8 inst=38
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
  decor            draws=215 tris=443.2k meshes=215 inst=302
  other            draws=35 tris=51.8k meshes=35 inst=283

Agent detail (one-pass estimate):
  NPC:
    by family (sorted by draws):
      Peasant          agents=12 draws=111 tris=135.1k skinned=111/111
      Farmer           agents=4 draws=36 tris=52.6k skinned=36/36
      Knight_Cloth     agents=3 draws=28 tris=36.6k skinned=28/28
      Peasant_Boots    agents=2 draws=18 tris=24.4k skinned=18/18
      Ranger_NoHood    agents=1 draws=14 tris=16.3k skinned=14/14
      blacksmith       agents=1 draws=10 tris=14.4k skinned=10/10
      woodcutter       agents=1 draws=8 tris=10.9k skinned=8/8
    by distance band:
      near agents=3 camera-relevant=2 draws=26 tris=36.2k
      mid  agents=4 camera-relevant=4 draws=42 tris=50.2k
      far  agents=17 camera-relevant=10 draws=157 tris=203.8k
  Fauna:
    by family (sorted by draws):
      deer             agents=5 draws=35 tris=10.5k skinned=35/35
      dog              agents=6 draws=33 tris=11.6k skinned=33/33
      horse            agents=4 draws=32 tris=8.7k skinned=32/32
      wolf             agents=7 draws=28 tris=13.7k skinned=28/28
      chicken          agents=5 draws=25 tris=3.2k skinned=0/25
      sheep            agents=11 draws=22 tris=6.7k skinned=22/22
      stag             agents=3 draws=18 tris=11.0k skinned=15/18
      boar             agents=3 draws=15 tris=6.9k skinned=15/15
      fox              agents=2 draws=8 tris=3.7k skinned=8/8
      cow              agents=1 draws=7 tris=2.5k skinned=7/7
      duck             agents=2 draws=6 tris=224 skinned=0/6
      rat              agents=3 draws=6 tris=12.0k skinned=6/6
      bear             agents=4 draws=4 tris=2.7k skinned=4/4
      rabbit           agents=3 draws=3 tris=2.0k skinned=3/3
      rooster          agents=1 draws=1 tris=1.2k skinned=0/1
    by distance band:
      near agents=4 camera-relevant=2 draws=23 tris=6.9k
      mid  agents=5 camera-relevant=4 draws=19 tris=4.4k
      far  agents=51 camera-relevant=25 draws=201 tris=85.4k

Matrix work (one scene traversal, steady state):
  terrain                  nodes=55 composed=55 multiplied=55 skinned=0
  grass                    nodes=93 composed=93 multiplied=93 skinned=0
  vegetation               nodes=122 composed=122 multiplied=122 skinned=0
  environment              nodes=65 composed=65 multiplied=65 skinned=0
  settlement               nodes=1472 composed=1472 multiplied=1472 skinned=0
  water                    nodes=25 composed=25 multiplied=25 skinned=0
  npc                      nodes=1880 composed=1880 multiplied=1880 skinned=225
  fauna                    nodes=2562 composed=2562 multiplied=2562 skinned=208
  items                    nodes=247 composed=247 multiplied=247 skinned=0
  other                    nodes=581 composed=564 multiplied=581 skinned=9
  top scene children:
    fauna ×60                nodes=2562 composed=2562 multiplied=2562 skinned=208
    npc ×24                  nodes=1880 composed=1880 multiplied=1880 skinned=225
    settlement ×3            nodes=1472 composed=1472 multiplied=1472 skinned=0
    Group ×64                nodes=418 composed=418 multiplied=418 skinned=9
    chunk-items ×20          nodes=247 composed=247 multiplied=247 skinned=0
    chunk-grass ×21          nodes=93 composed=93 multiplied=93 skinned=0
    chunk ×55                nodes=55 composed=55 multiplied=55 skinned=0
    Root_Scene ×14           nodes=52 composed=52 multiplied=52 skinned=0
    Object3D ×28             nodes=28 composed=28 multiplied=28 skinned=0
    chunk-river ×26          nodes=26 composed=26 multiplied=26 skinned=0
    chunk-water ×24          nodes=24 composed=24 multiplied=24 skinned=0
    chunk-environmen ×3      nodes=22 composed=22 multiplied=22 skinned=0

Systems:
  WATER          4.8 ms
  NPC            4.0 ms
  FAUNA          2.8 ms
  PHYSICS        0.2 ms
  RENDER         31.1 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  (none)

Hitches (>= 8 ms): total=0
  (none)

Isolation probes:
  full               render=22.5 ms draws=1673 tris=9.97M
  hide-grass         render=28.9 ms draws=1659 tris=4.34M
  hide-vegetation    render=32.1 ms draws=1705 tris=9.89M
  hide-vegetation-grass render=27.5 ms draws=1661 tris=4.25M
  hide-environment   render=29.8 ms draws=1704 tris=9.98M
  hide-settlement    render=13.9 ms draws=847 tris=8.86M
  hide-water         render=26.7 ms draws=1692 tris=9.82M
  hide-terrain       render=27.9 ms draws=1644 tris=7.35M
  hide-npc-fauna     render=16.6 ms draws=1356 tris=9.67M
  no-shadows         render=20.9 ms draws=1442 tris=9.10M
  no-ao              render=23.2 ms draws=1678 tris=9.97M
  no-bloom           render=24.8 ms draws=1694 tris=9.98M
  no-smaa            render=28.8 ms draws=1716 tris=9.98M
  no-god-rays        render=30.8 ms draws=1721 tris=9.98M
  no-film-grade      render=27.5 ms draws=1722 tris=9.98M
  no-postprocessing  render=23.8 ms draws=1687 tris=9.98M
  no-reflections     render=18.7 ms draws=1374 tris=9.20M

Frame attribution:
  frame max: 404 ms
  largest labelled hitch: 0 ms
  unattributed: 404 ms

Long frames:
  threshold: 80 ms
  count: 11
  worst: 404 ms

Raw sidecar:
  sampling=full factor=1 exported=224/224

Recommendation:
Largest frame (404 ms) is not explained by labelled hitches (largest 0 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 24
  Fauna (agents): 29

NPC:
  total: 4.0 ms/frame
  crowd pass: 0.0 ms/frame (2.6 ms cumulative)
  agent updates: 1.9 ms/frame (429.7 ms cumulative)
  livestock: 1.5 ms/frame (328.0 ms cumulative)
    loaded tick: 1.5 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 1.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.1 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.8 ms/frame
      life/presentation: 0.4 ms/frame
      other update: 0.2 ms/frame
    update calls/frame: 28.3
    unique animals/frame: 27.2
    duplicate updates/frame: 1.0
    detached animals/frame: 0.0
    dog updates/frame: 6.1
    dog guard scans: 6.1/frame (42.4 predator candidates/frame)
    pest scans: 4.0/frame (4.0 rat candidates/frame)
    nearest scans: 19.6/frame (0.0 candidates/frame)
    water samples: 45.4/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 45.4/frame, 0.10 ms/frame (worst call 2.50 ms, 6747.0 colliders/frame)
    full-rate agents/frame: 1.4
    reduced-cadence agents/frame: 26.9
    behaviour executions/frame: 19.6
    presentation executions/frame: 19.6
  rats: 0.3 ms/frame (70.9 ms cumulative)
  social: 0.0 ms/frame (1.6 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.3 ms/frame (57.2 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 2.8 ms/frame
  agent updates: 2.7 ms/frame (611.7 ms cumulative)
  forest sampling: 0.1 ms/frame (33.4 ms cumulative)
  other (spawners/forage/cleanup/...): 0.1 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (8.4 ms cumulative)
    targeting: 0.0 ms/frame (7.6 ms cumulative)
    decision: 0.0 ms/frame (4.5 ms cumulative)
    behaviour: 1.7 ms/frame (380.8 ms cumulative)
    life/presentation: 0.5 ms/frame (122.5 ms cumulative)
    other update: 0.2 ms/frame

  adaptive candidates:
    agent updates/frame: 29.3
    sensing passes/frame: 29.3
    decision passes/frame: 29.3
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 17.7
    full-rate agents/frame: 6.1
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 17.7
    presentation executions/frame: 17.6

  sensing/cache:
    forest samples/frame: 29.3
    fire scan candidates/frame: 29.3
    village scan candidates/frame: 447.1
    player perception checks/frame: 29.3

  nearest scans: 23.5/frame (5260 calls)
  nearest candidates checked: 220.8/frame (49449 total)
  herd leader scans: 0.4/frame (80 calls)
  herd candidates checked: 10.4/frame (2320 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 23.7/frame (164.7 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 76.9/frame, 0.10 ms/frame (worst call 0.60 ms)
    collider queries: 76.9/frame, 0.10 ms/frame (worst call 1.00 ms, 12165.1 colliders/frame)

---

[Seedvale Grass Baseline]

Chunks resident: 21
Resident instances: full=330419 filler=631233
Submitted instances: full=270893 filler=312965
Meshes submitted: 72
LOD submitted fraction: full=0.8198469216358624 filler=0.4957994908377731
Flowers: unavailable
Allocation bytes (estimated): 92318592
Upload bytes (observed): unavailable
Lifecycle: req=0 complete=0 discard(unload=0,oor=0) cancel=0 streamIn=0 streamOut=0 invalidate=0
Finalization: unobserved completions=0

---

[Seedvale Pass Submissions]

Reliability: observed
Frames: 226
Shadow refresh frames: 220
Shadow skipped frames: 6

Mirror:
  calls avg: 299  tris avg: 708115
  info calls avg: 299  residual calls avg: 0
  switches avg: material=106 program=61.4  actor: calls=0 material=0 program=0
  skinning avg: skinned calls=2.3 skeletons first used=2.3
  environment                  calls=1 tris=592
  other                        calls=93 tris=5199
  settlement:decor             calls=34 tris=91520
  settlement:fence             calls=3 tris=2626
  settlement:fireCampfire      calls=3 tris=199
  settlement:fireHouseExteriorLamp calls=11 tris=536
  settlement:fireHouseInteriorLamp calls=4 tris=401
  settlement:fireVillageTorch  calls=15 tris=1070
  settlement:houseInteractive  calls=14 tris=1514
  settlement:houseStatic       calls=32 tris=40716
  settlement:landmarkGarden    calls=3 tris=33193
  settlement:landmarkNoticeBoard calls=1 tris=27
  settlement:landmarkWellCentral calls=4 tris=1420
  settlement:landmarkWellHousehold calls=5 tris=3565
  settlement:landmarkWellPasture calls=2 tris=604
  settlement:other             calls=10 tris=18985
  settlement:storageBarrel     calls=6 tris=9474
  settlement:storageContainer  calls=9 tris=1804
  settlement:storageGoods      calls=30 tris=5882
  settlement:storageHay        calls=1 tris=266
  settlement:storageTrough     calls=3 tris=1094
  settlement:storageWoodHousehold calls=1 tris=4014
  settlement:storageWoodSettlementPrimary calls=1 tris=670
  settlement:workplace         calls=5 tris=2325
  terrain                      calls=6 tris=453253
  vegetation                   calls=6 tris=27362

Shadow (refresh only):
  calls avg: 496  tris avg: 1593678
  info calls avg: 496  residual calls avg: 0
  switches avg: material=137.3 program=160.5  actor: calls=123 material=0 program=16.3
  skinning avg: skinned calls=117.9 skeletons first used=25.9
  environment                  calls=0 tris=280
  faunaFamily:chicken          calls=9 tris=1175
  faunaFamily:cow              calls=5 tris=1760
  faunaFamily:dog              calls=10 tris=3735
  faunaFamily:horse            calls=16 tris=4364
  faunaFamily:rat              calls=1 tris=2275
  faunaFamily:rooster          calls=1 tris=1178
  faunaFamily:sheep            calls=7 tris=2179
  npcFamily:Farmer             calls=16 tris=23895
  npcFamily:Knight_Cloth       calls=9 tris=11911
  npcFamily:Peasant            calls=19 tris=21998
  npcFamily:Peasant_Boots      calls=9 tris=12222
  npcFamily:Ranger_NoHood      calls=13 tris=14565
  npcFamily:woodcutter         calls=8 tris=10855
  other                        calls=68 tris=13254
  settlement:decor             calls=197 tris=417883
  settlement:fence             calls=2 tris=1616
  settlement:fireHouseInteriorLamp calls=6 tris=648
  settlement:houseInteractive  calls=14 tris=2198
  settlement:houseStatic       calls=33 tris=50046
  settlement:landmarkGarden    calls=1 tris=1600
  settlement:landmarkNoticeBoard calls=2 tris=36
  settlement:landmarkWellCentral calls=5 tris=1870
  settlement:other             calls=11 tris=21982
  settlement:storageContainer  calls=6 tris=1908
  settlement:storageHay        calls=1 tris=488
  settlement:storageTrough     calls=2 tris=1200
  settlement:storageWoodHousehold calls=1 tris=4680
  settlement:storageWoodSettlementPrimary calls=1 tris=780
  settlement:workplace         calls=4 tris=3548
  terrain                      calls=12 tris=889912
  vegetation                   calls=8 tris=67636

Main:
  calls avg: 990  tris avg: 8505110
  info calls avg: 1474  residual calls avg: 0
  switches avg: material=421.8 program=200.7  actor: calls=232 material=146 program=64.1
  skinning avg: skinned calls=224.9 skeletons first used=34.7
  environment                  calls=17 tris=7517
  faunaFamily:bear             calls=3 tris=1921
  faunaFamily:chicken          calls=15 tris=1947
  faunaFamily:cow              calls=4 tris=1572
  faunaFamily:deer             calls=22 tris=6731
  faunaFamily:dog              calls=15 tris=5380
  faunaFamily:duck             calls=1 tris=23
  faunaFamily:horse            calls=13 tris=3508
  faunaFamily:rat              calls=4 tris=7158
  faunaFamily:rooster          calls=1 tris=605
  faunaFamily:sheep            calls=11 tris=3348
  faunaFamily:wolf             calls=18 tris=9105
  grass                        calls=41 tris=5833870
  items                        calls=29 tris=4124
  npcFamily:Farmer             calls=19 tris=28145
  npcFamily:Knight_Cloth       calls=17 tris=22008
  npcFamily:Peasant            calls=59 tris=71173
  npcFamily:Peasant_Boots      calls=9 tris=12060
  npcFamily:Ranger_NoHood      calls=12 tris=13674
  npcFamily:blacksmith         calls=6 tris=9231
  npcFamily:woodcutter         calls=3 tris=4275
  other                        calls=234 tris=18898
  settlement:decor             calls=66 tris=178004
  settlement:fence             calls=5 tris=5213
  settlement:fireCampfire      calls=5 tris=396
  settlement:fireHouseExteriorLamp calls=23 tris=1113
  settlement:fireHouseInteriorLamp calls=8 tris=813
  settlement:fireVillageTorch  calls=31 tris=2207
  settlement:houseInteractive  calls=28 tris=3158
  settlement:houseStatic       calls=63 tris=80775
  settlement:landmarkGarden    calls=8 tris=82580
  settlement:landmarkNoticeBoard calls=3 tris=59
  settlement:landmarkWellCentral calls=9 tris=3251
  settlement:landmarkWellHousehold calls=10 tris=7316
  settlement:landmarkWellPasture calls=3 tris=1208
  settlement:other             calls=20 tris=38031
  settlement:storageBarrel     calls=12 tris=19639
  settlement:storageContainer  calls=17 tris=3648
  settlement:storageGoods      calls=61 tris=11936
  settlement:storageHay        calls=1 tris=687
  settlement:storageTrough     calls=5 tris=2190
  settlement:storageWoodHousehold calls=2 tris=8038
  settlement:storageWoodSettlementPrimary calls=2 tris=1498
  settlement:workplace         calls=11 tris=5330
  terrain                      calls=24 tris=1734651
  vegetation                   calls=16 tris=54651
  water                        calls=4 tris=192838


---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 11
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 11 total):

[LONG FRAME] 404ms
simulate         8.0ms
render         395.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.1ms
STREAMING        0.0ms
NPC              3.0ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER         395.9ms
OTHER            3.3ms

Long frame #2:

[LONG FRAME] 214.2ms
simulate        24.2ms
render         190.0ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.5ms
STREAMING        0.0ms
NPC              8.0ms
FAUNA            1.3ms
PHYSICS          0.3ms
RENDER         182.5ms
OTHER           14.6ms

Long frame #3:

[LONG FRAME] 211.7ms
simulate         8.4ms
render         203.2ms
TERRAIN          0.0ms
GRASS            0.1ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.6ms
STREAMING        0.0ms
NPC              3.1ms
FAUNA            1.0ms
PHYSICS          0.1ms
RENDER         195.5ms
OTHER            4.3ms

Long frame #4:

[LONG FRAME] 200.8ms
simulate        12.8ms
render         187.8ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            7.1ms
STREAMING        0.1ms
NPC              5.9ms
FAUNA            2.5ms
PHYSICS          0.2ms
RENDER         180.4ms
OTHER            4.6ms

streaming / stages:
  chunkFinalize                0.1ms
  chunkUpdate                  0.1ms

Long frame #5:

[LONG FRAME] 187.9ms
simulate         8.3ms
render         179.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              3.4ms
FAUNA            1.5ms
PHYSICS          0.2ms
RENDER         179.5ms
OTHER            3.3ms

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=22.5 ms  p95=28.6 ms  max=29.2 ms  Δavg vs baseline=—
  hide-grass           avg=28.9 ms  p95=45.8 ms  max=64.8 ms  Δavg vs baseline=+6.4 ms (+28%)
  hide-vegetation      avg=32.1 ms  p95=47.6 ms  max=75.0 ms  Δavg vs baseline=+9.6 ms (+43%)
  no vegetation/grass  avg=27.5 ms  p95=35.7 ms  max=40.0 ms  Δavg vs baseline=+5.0 ms (+22%)
  hide-environment     avg=29.8 ms  p95=45.0 ms  max=58.9 ms  Δavg vs baseline=+7.2 ms (+32%)
  hide-settlement      avg=13.9 ms  p95=18.0 ms  max=18.9 ms  Δavg vs baseline=-8.7 ms (-38%)
  no water             avg=26.7 ms  p95=34.4 ms  max=37.4 ms  Δavg vs baseline=+4.1 ms (+18%)
  hide-terrain         avg=27.9 ms  p95=32.0 ms  max=99.4 ms  Δavg vs baseline=+5.4 ms (+24%)
  hide-npc-fauna       avg=16.6 ms  p95=24.8 ms  max=33.4 ms  Δavg vs baseline=-5.9 ms (-26%)
  no-shadows           avg=20.9 ms  p95=26.8 ms  max=29.9 ms  Δavg vs baseline=-1.6 ms (-7%)
  no-ao                avg=23.2 ms  p95=33.3 ms  max=38.5 ms  Δavg vs baseline=+0.7 ms (+3%)
  no-bloom             avg=24.8 ms  p95=32.8 ms  max=48.0 ms  Δavg vs baseline=+2.3 ms (+10%)
  no-smaa              avg=28.8 ms  p95=40.5 ms  max=46.2 ms  Δavg vs baseline=+6.2 ms (+28%)
  no-god-rays          avg=30.8 ms  p95=37.0 ms  max=38.1 ms  Δavg vs baseline=+8.3 ms (+37%)
  no-film-grade        avg=27.5 ms  p95=39.0 ms  max=46.7 ms  Δavg vs baseline=+5.0 ms (+22%)
  no postprocessing    avg=23.8 ms  p95=40.3 ms  max=56.5 ms  Δavg vs baseline=+1.3 ms (+6%)
  no mirrors           avg=18.7 ms  p95=22.7 ms  max=25.1 ms  Δavg vs baseline=-3.9 ms (-17%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (28 samples resolved during the baseline window)
  GPU elapsed   avg=44.3 ms  p95=54.1 ms  max=56.0 ms
  CPU wall      avg=22.5 ms  p95=28.6 ms  max=29.2 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.

River tiles (window): sync computes=0 sync ms total=0.0 max=0.0 store hits=0 prefetched=0
