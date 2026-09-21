# Seedvale Performance Benchmark Report

> Generated: 2026-09-21T08:13:08.640Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Grass Finalization]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Program Census]
> - [Seedvale Program Attribution]
> - [Seedvale Program Compile Cost]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: stream
Duration: 30s
Quality: High
Pixel ratio: 1

Reproducibility:
  fixture: tools-001-v1
  seed: 42
  elapsedDays: 0
  timeOfDay: 0.292
  season: spring
  weather: rain
  terrainResolution: 193
  loadRadius: 3
  grassMacroVariation: ON
  viewport: 1920x945
  anchor: (-8.1, -11.5)
  route: start=(-8.1, -11.5) speed=14.4 m/s duration=30s

FPS:
  avg: 43.2
  min: 10
  p1: 19

Frame time:
  avg: 23.1 ms
  p95: 36.5 ms
  max: 98.5 ms

Rendering:
  draw calls: 843 avg / 2172 max
  triangles: 9.82M avg
  mirror draws: 163 avg
  geometries: 785
  textures: 668

Scene (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  grass            draws=56 tris=1.14M meshes=56 inst=117872
  vegetation       draws=201 tris=1.33M meshes=201 inst=848
  environment      draws=127 tris=25.5k meshes=127 inst=143
  settlement       draws=689 tris=673.1k meshes=689 inst=1197
  water            draws=53 tris=3.84M meshes=53 inst=53
  npc              draws=182 tris=429.7k meshes=182 inst=182
  fauna            draws=197 tris=86.4k meshes=197 inst=197
  items            draws=348 tris=28.9k meshes=348 inst=348
  other            draws=218 tris=32.4k meshes=218 inst=218

Shadow casters (one-pass estimate):
  terrain          draws=71 tris=5.23M meshes=71 inst=71
  vegetation       draws=183 tris=1.28M meshes=183 inst=818
  environment      draws=126 tris=25.5k meshes=126 inst=142
  settlement       draws=432 tris=479.7k meshes=432 inst=903
  items            draws=40 tris=22.5k meshes=40 inst=40
  other            draws=102 tris=24.7k meshes=102 inst=102

Settlement shadow casters (one-pass estimate):
  houseStatic      draws=67 tris=43.7k meshes=67 inst=379
  houseInteractive draws=18 tris=2.8k meshes=18 inst=18
  fence            draws=4 tris=5.7k meshes=4 inst=28
  storageWoodSettlementPrimary draws=6 tris=2.7k meshes=6 inst=6
  storageWoodHousehold draws=18 tris=8.0k meshes=18 inst=18
  storageContainer draws=30 tris=3.2k meshes=30 inst=42
  storageHay       draws=3 tris=1.5k meshes=3 inst=3
  storageTrough    draws=8 tris=2.0k meshes=8 inst=20
  workplace        draws=8 tris=4.1k meshes=8 inst=8
  landmarkWellCentral draws=15 tris=5.6k meshes=15 inst=15
  landmarkWellPasture draws=5 tris=1.9k meshes=5 inst=5
  landmarkGarden   draws=3 tris=3.2k meshes=3 inst=4
  landmarkNoticeBoard draws=6 tris=108 meshes=6 inst=6
  fireHouseInteriorLamp draws=9 tris=972 meshes=9 inst=9
  fireCampfire     draws=4 tris=602 meshes=4 inst=4
  decor            draws=197 tris=391.6k meshes=197 inst=303
  other            draws=31 tris=2.1k meshes=31 inst=35

Systems:
  WATER          2.5 ms
  STREAMING      0.8 ms
  NPC            2.0 ms
  FAUNA          1.4 ms
  PHYSICS        0.1 ms
  RENDER         12.2 ms

Detected bottlenecks:
  1. RENDER
  2. WATER
  3. NPC

Critical spikes:
  WATER: 3
  STREAMING: 3
  PROPS: 1

Hitches (>= 8 ms):
  chunk mesh             n=3 avg=11.2 max=17.4
  chunk items            n=1 avg=14.3 max=14.3
  chunk water            n=3 avg=8.9 max=9.3

Isolation probes:
  full               render=11.9 ms draws=303 tris=6.33M
  hide-grass         render=12.4 ms draws=273 tris=5.25M
  hide-vegetation    render=10.7 ms draws=163 tris=4.47M
  hide-vegetation-grass render=12.3 ms draws=133 tris=3.39M
  hide-environment   render=12.1 ms draws=274 tris=6.19M
  hide-settlement    render=10.0 ms draws=279 tris=6.26M
  hide-water         render=11.6 ms draws=285 tris=5.30M
  hide-terrain       render=9.7 ms draws=254 tris=3.78M
  hide-npc-fauna     render=9.2 ms draws=302 tris=6.33M
  no-shadows         render=6.0 ms draws=282 tris=5.93M
  no-ao              render=7.5 ms draws=286 tris=6.20M
  no-bloom           render=10.5 ms draws=272 tris=6.06M
  no-smaa            render=8.8 ms draws=291 tris=6.18M
  no-god-rays        render=6.9 ms draws=282 tris=6.01M
  no-film-grade      render=7.1 ms draws=285 tris=6.06M
  no-postprocessing  render=8.3 ms draws=269 tris=6.20M
  no-reflections     render=9.0 ms draws=231 tris=5.36M

Frame attribution:
  frame max: 98.5 ms
  largest labelled hitch: 17.4 ms
  unattributed: 81.1 ms

Long frames:
  threshold: 80 ms
  count: 6
  worst: 98.5 ms

Recommendation:
Largest frame (98.5 ms) is not explained by labelled hitches (largest 17.4 ms) — unattributed frame spike, not a category bottleneck.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 2.0 ms/frame
  crowd pass: 0.0 ms/frame (10.6 ms cumulative)
  agent updates: 1.1 ms/frame (1245.6 ms cumulative)
  livestock: 0.4 ms/frame (431.9 ms cumulative)
    loaded tick: 0.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 15.8
    unique animals/frame: 15.6
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.5
    dog guard scans: 3.5/frame (28.2 predator candidates/frame)
    pest scans: 1.1/frame (1.1 rat candidates/frame)
    nearest scans: 5.0/frame (0.0 candidates/frame)
    water samples: 10.6/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 10.6/frame, 0.00 ms/frame (worst call 0.20 ms, 689.2 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 15.7
    behaviour executions/frame: 5.0
    presentation executions/frame: 4.3
  rats: 0.1 ms/frame (139.6 ms cumulative)
  social: 0.0 ms/frame (7.0 ms cumulative)
  streaming: 0.1 ms/frame (138.3 ms cumulative)
  maintenance: 0.1 ms/frame (159.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.3 ms/frame (1442.9 ms cumulative)
  forest sampling: 0.1 ms/frame (97.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (26.3 ms cumulative)
    targeting: 0.0 ms/frame (17.3 ms cumulative)
    decision: 0.0 ms/frame (13.0 ms cumulative)
    behaviour: 0.7 ms/frame (791.3 ms cumulative)
    life/presentation: 0.4 ms/frame (383.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.6
    decision passes/frame: 29.6
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.0
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 22.0
    behaviour executions/frame: 15.0
    presentation executions/frame: 13.8

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 28.7
    village scan candidates/frame: 316.6
    player perception checks/frame: 29.6

  nearest scans: 21.8/frame (23896 calls)
  nearest candidates checked: 129.9/frame (142063 total)
  herd leader scans: 0.1/frame (163 calls)
  herd candidates checked: 4.5/frame (4890 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.9/frame (143.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 54.2/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 54.2/frame, 0.10 ms/frame (worst call 1.10 ms, 2206.6 colliders/frame)

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 19
  Fauna (agents): 30

NPC:
  total: 2.0 ms/frame
  crowd pass: 0.0 ms/frame (10.6 ms cumulative)
  agent updates: 1.1 ms/frame (1245.6 ms cumulative)
  livestock: 0.4 ms/frame (431.9 ms cumulative)
    loaded tick: 0.4 ms/frame
    detached tick: 0.0 ms/frame
    unattributed: 0.0 ms/frame
    animal updates: 0.4 ms/frame
    post-update (egg/readyToRemove): 0.0 ms/frame
    detached bookkeeping: 0.0 ms/frame
    AnimalAgent sections:
      sensing: 0.0 ms/frame
      targeting: 0.0 ms/frame
      decision: 0.0 ms/frame
      behaviour: 0.2 ms/frame
      life/presentation: 0.1 ms/frame
      other update: 0.1 ms/frame
    update calls/frame: 15.8
    unique animals/frame: 15.6
    duplicate updates/frame: 0.2
    detached animals/frame: 0.0
    dog updates/frame: 3.5
    dog guard scans: 3.5/frame (28.2 predator candidates/frame)
    pest scans: 1.1/frame (1.1 rat candidates/frame)
    nearest scans: 5.0/frame (0.0 candidates/frame)
    water samples: 10.6/frame, 0.00 ms/frame (worst call 0.90 ms)
    collider queries: 10.6/frame, 0.00 ms/frame (worst call 0.20 ms, 689.2 colliders/frame)
    full-rate agents/frame: 0.1
    reduced-cadence agents/frame: 15.7
    behaviour executions/frame: 5.0
    presentation executions/frame: 4.3
  rats: 0.1 ms/frame (139.6 ms cumulative)
  social: 0.0 ms/frame (7.0 ms cumulative)
  streaming: 0.1 ms/frame (138.3 ms cumulative)
  maintenance: 0.1 ms/frame (159.8 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.4 ms/frame
  agent updates: 1.3 ms/frame (1442.9 ms cumulative)
  forest sampling: 0.1 ms/frame (97.0 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (26.3 ms cumulative)
    targeting: 0.0 ms/frame (17.3 ms cumulative)
    decision: 0.0 ms/frame (13.0 ms cumulative)
    behaviour: 0.7 ms/frame (791.3 ms cumulative)
    life/presentation: 0.4 ms/frame (383.9 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 29.6
    decision passes/frame: 29.6
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 15.0
    full-rate agents/frame: 7.6
    reduced-cadence agents/frame: 22.0
    behaviour executions/frame: 15.0
    presentation executions/frame: 13.8

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 28.7
    village scan candidates/frame: 316.6
    player perception checks/frame: 29.6

  nearest scans: 21.8/frame (23896 calls)
  nearest candidates checked: 129.9/frame (142063 total)
  herd leader scans: 0.1/frame (163 calls)
  herd candidates checked: 4.5/frame (4890 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 20.9/frame (143.5 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 54.2/frame, 0.10 ms/frame (worst call 1.20 ms)
    collider queries: 54.2/frame, 0.10 ms/frame (worst call 1.10 ms, 2206.6 colliders/frame)

---

[Seedvale Grass Finalization]

Grass finalization:
  chunks: 19
  empty builds (no instances): 16
  discarded unloaded/out-of-range: 0/0

  build total (`buildGrassChunkMeshes`):
    avg 0.47 ms
    max 2.90 ms

  allocation/setup:
    avg 0.43 ms
    max 2.90 ms
  instanceMatrix bind:
    avg 0.00 ms
    max 0.00 ms
  bounds/finalize (apply worker bounds):
    avg 0.00 ms
    max 0.00 ms
  lod apply (`setLodFraction` / `setGeometryLod`):
    avg 0.15 ms
    max 1.80 ms
  scene attach (`scene.add`):
    avg 0.03 ms
    max 0.10 ms
  callback total (build + lod + attach):
    avg 0.75 ms
    max 4.40 ms

  per chunk:
    instances avg/max 145839.8 / 271541
    meshes avg/max 4.00 / 4
    geometries avg/max 4.00 / 4
    geometries after lod apply avg/max 7.00 / 7
    instances full/filler: 886124 / 1884833
    matrix instances bound: 2770957
    instanced attributes created: 380
    shared material refs: 76
  heap delta avg/max: 0.0 / 0.0 KB

  by species bucket:
  tri:
    buckets/meshes: 19/19
    instances: 332550 (max 32465)
    allocation/setup avg/max: 0.20 / 1.60 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  grain:
    buckets/meshes: 19/19
    instances: 110710 (max 10763)
    allocation/setup avg/max: 0.05 / 0.70 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  herb:
    buckets/meshes: 19/19
    instances: 442864 (max 44129)
    allocation/setup avg/max: 0.08 / 1.20 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms
  filler:
    buckets/meshes: 19/19
    instances: 1884833 (max 184184)
    allocation/setup avg/max: 0.11 / 1.00 ms
    instanceMatrix bind avg/max: 0.00 / 0.00 ms
    bounds/finalize avg/max: 0.00 / 0.00 ms

---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 6
Shown: 5 worst (by frame ms)

Read: category rows are `withCategory()` spans on that frame; OTHER is
frame total minus those categories (measurement gap, overlapping work,
or unwrapped tick code). Stages are coarse streaming/finalize labels
from the same frame; hitches are existing `recordHitch` events (>= 8 ms).

Worst frame (#1 of 5 shown, 6 total):

[LONG FRAME] 98.5ms
simulate        75.2ms
render          22.3ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.7ms
STREAMING        5.2ms
NPC             65.6ms
FAUNA            1.4ms
PHYSICS          0.2ms
RENDER          15.8ms
OTHER            3.6ms

streaming / stages:
  riverTileBuild               43.2ms
  terrainPrepare               7.3ms
  terrainFinalize              4.6ms
  chunkFinalize                0.5ms
  chunkUpdate                  0.5ms
  riverChannelSegmentsNear     0.3ms

Long frame #2:

[LONG FRAME] 93.5ms
simulate        81.1ms
render          11.4ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.2ms
STREAMING        3.4ms
NPC             73.2ms
FAUNA            2.1ms
PHYSICS          0.1ms
RENDER          11.4ms
OTHER            3.1ms

streaming / stages:
  riverTileBuild               49.0ms
  terrainPrepare               6.4ms
  contentFinalize              3.4ms
  chunkFinalize                3.4ms
  chunkUpdate                  3.4ms
  riverChannelSegmentsNear     0.9ms

Long frame #3:

[LONG FRAME] 92.7ms
simulate        69.7ms
render          22.7ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING       58.9ms
NPC              3.0ms
FAUNA            1.8ms
PHYSICS          0.1ms
RENDER          22.7ms
OTHER            6.2ms

streaming / stages:
  chunkUpdate                  58.9ms
  riverTileBuild               45.9ms
  terrainPrepare               1.6ms
  riverChannelSegmentsNear     0.4ms
  chunkFinalize                0.1ms

Long frame #4:

[LONG FRAME] 91.2ms
simulate        70.4ms
render          20.5ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            6.1ms
STREAMING       62.8ms
NPC              3.8ms
FAUNA            1.6ms
PHYSICS          0.1ms
RENDER          14.6ms
OTHER            2.2ms

streaming / stages:
  chunkUpdate                  62.8ms
  riverTileBuild               50.6ms
  terrainPrepare               1.9ms
  riverChannelSegmentsNear     0.4ms

Long frame #5:

[LONG FRAME] 82.6ms
simulate        15.0ms
render          66.9ms
TERRAIN          0.0ms
GRASS            0.0ms
VEGETATION       0.0ms
PROPS            0.0ms
SHADOWS          0.0ms
POSTPROCESS      0.0ms
WATER            0.0ms
STREAMING        0.0ms
NPC              4.7ms
FAUNA            1.8ms
PHYSICS          0.0ms
RENDER          66.9ms
OTHER            9.2ms

---

[Seedvale Program Census]

Programs created: 112
Program count: final=110 max=112

By frame:
  frame 0   +69 programs   <== largest transition
  frame 43   +1 program
  frame 45   +1 program
  frame 147   +1 program
  frame 155   +1 program
  frame 164   +1 program
  frame 193   +1 program
  frame 236   +1 program
  frame 613   +1 program
  frame 1512   +14 programs
  frame 1546   +5 programs
  frame 1764   +16 programs

Largest transition — frame 0 (+69 programs):
  #0 type=ShaderMaterial name='SkyShader' bucket=other cacheKey=0,1,highp,srgb-linear,fa… vHash=603d22a7 fHash=c6043ced stage=mirror-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=3fd3674c-2d04-4895-96e8-99a7f97f7fa9 (SkyShader)
  #1 type=ShaderMaterial name='' bucket=other cacheKey=2,3,highp,srgb-linear,fa… vHash=72aec116 fHash=ae17ade6 stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=98f50723-bbac-439f-a888-8e2fbd0d11d3
  #2 type=MeshStandardMaterial name='' bucket=terrain cacheKey=physical,STANDARD,,highp… vHash=5c2c57a3 fHash=a1daa357 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"true","envMap":"false"}
      material=01c62361-5d47-4210-af78-39b0b0c0cc52
  #3 type=ShaderMaterial name='' bucket=water cacheKey=4,5,USE_CHUNK_MASK,1,hig… vHash=1bb00362 fHash=a38bbf04 stage=mirror-render
      defines={"USE_CHUNK_MASK":1}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=058902c1-93f1-4edd-a48f-03600597d1f7
  #4 type=ShaderMaterial name='' bucket=other cacheKey=6,7,highp,srgb-linear,fa… vHash=22690955 fHash=2cf9fa62 stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=99a511ff-99d9-4e9a-8de0-8aca226142ff
  #5 type=ShaderMaterial name='' bucket=water cacheKey=4,5,highp,srgb-linear,fa… vHash=e6d01ae7 fHash=e34491ff stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=9f400ed6-cde7-438e-9d17-5b88add1a360
  #6 type=ShaderMaterial name='' bucket=grass cacheKey=8,9,highp,srgb-linear,fa… vHash=5efd8b76 fHash=9b2a34e4 stage=mirror-render
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","map":"false","normalMap":"false","envMap":"false"}
      material=aede82d0-897c-42c4-8cfe-570bd34603e1
  #7 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=e3408c64 fHash=c0b8fc9f stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=11a5b9f2-7cfc-40b1-98f9-0639c29496c7
  #8 type=MeshStandardMaterial name='Wood' bucket=other cacheKey=physical,STANDARD,,highp… vHash=d38f15a4 fHash=6578c10d stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=89703027-7ce0-4e47-9ca5-72657a5b9cdf (Wood)
  #9 type=MeshStandardMaterial name='Green' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=c0d790d1 fHash=a81023c3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=5ecdfbe6-7a84-4b7e-a733-54e7ebe68b1e (Green)
  #10 type=MeshStandardMaterial name='Pink' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=d3fd7a87 fHash=2eae9a54 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=54d49f7e-24b1-44b4-978f-81a3db11f864 (Pink)
  #11 type=MeshStandardMaterial name='Flowers' bucket=vegetation cacheKey=physical,STANDARD,,highp… vHash=e4cbf8ca fHash=135696d3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5ee14f00-073f-4b1a-812b-15b75a9a8e18 (Flowers)
  #12 type=MeshStandardMaterial name='None' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=6db98a06 fHash=efed8e98 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9c26f772-19a1-411c-bbf7-dd9b42e49132 (None)
  #13 type=MeshStandardMaterial name='Stone' bucket=environment cacheKey=physical,STANDARD,,highp… vHash=a9733c9d fHash=bd723c8a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=48e1499d-0c58-4345-8766-1dcd0405957f (Stone)
  #14 type=MeshStandardMaterial name='Wood_Light' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=f3a1039e fHash=c7daf23 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=d980a699-5d2a-4a26-b88c-a23ff0d6e76b (Wood)
  #15 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=c5e73b05 fHash=d4c95125 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=be5e8d74-d5ef-4fa4-b80b-dc8f1ac1c302 (MI_WoodTrim)
  #16 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=13a74ec7 fHash=3ab4c629 stage=mirror-render
  #17 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dcf1cb4 fHash=2d1aa4a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f92afe79-0946-43ea-a9e1-51efabc56f1b (MI_WindowGlass)
  #18 type=MeshStandardMaterial name='MI_WoodTrim' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=12873951 fHash=d4c95125 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=51705593-1218-41b5-a818-b24a11f6179b (MI_WoodTrim)
  #19 type=MeshStandardMaterial name='MI_WindowGlass' cacheKey=physical,STANDARD,,highp… vHash=fc941d05 fHash=3ab4c629 stage=mirror-render
  #20 type=MeshStandardMaterial name='MI_WindowGlass' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=e551c572 fHash=2d1aa4a stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6380f558-d6dd-425a-96c6-64cb35ef220e (MI_WindowGlass)
  #21 type=ShaderMaterial name='' cacheKey=10,11,highp,srgb-linear,… vHash=df7c703d fHash=236b3b0b stage=mirror-render
  #22 type=ShaderMaterial name='' cacheKey=12,13,highp,srgb-linear,… vHash=f92c8d8c fHash=87d053eb stage=mirror-render
  #23 type=MeshStandardMaterial name='Flowers' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=d9d07622 fHash=135696d3 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0.45","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=c07480e3-757f-4344-8ab9-ebbf8dbd5a41 (MapleTree_Leaves)
  #24 type=MeshStandardMaterial name='Green' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=190d3a9c fHash=633146b4 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=f03b5458-44b0-4176-9aa4-e615772142aa (Green)
  #25 type=MeshStandardMaterial name='MapleTree_Bark' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=9dbe8ee7 fHash=8dba9dd stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=bfdad8bc-41d5-4f7e-8609-b761ed357a84 (MapleTree_Bark)
  #26 type=MeshStandardMaterial name='Main' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=fd8301ed fHash=2f2885d5 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=7cdbc8bc-885c-491e-a584-0522de334d47 (Main)
  #27 type=MeshStandardMaterial name='Handle' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=88cdd138 fHash=f2ad9521 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c5f47091-9521-443e-9a13-d5c9f51bb518 (Handle)
  #28 type=MeshStandardMaterial name='PathRocks' bucket=settlement cacheKey=physical,STANDARD,,highp… vHash=b643916d fHash=754b87bd stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=5277a0e0-b663-4e4a-9651-8012cd4d0313 (PathRocks)
  #29 type=MeshStandardMaterial name='MI_Peasant' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=f618dfff fHash=4057772 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=8b1ceefa-f98c-4c61-b676-0d1d41049d3c (MI_Peasant)
  #30 type=MeshStandardMaterial name='MI_Hair_2' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=5ed1ec8c fHash=80443a73 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"true","envMap":"false"}
      material=69f13d55-aa54-440c-a922-4d7c2e42d014 (MI_Hair_2)
  #31 type=MeshStandardMaterial name='Blacksmith_Apron' bucket=npc cacheKey=physical,STANDARD,,highp… vHash=a9f43b6e fHash=d3ca6f1e stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=1b152656-8262-47bc-82cb-3258640a95da (Blacksmith_Apron)
  #32 type=ShaderMaterial name='' cacheKey=14,15,highp,srgb-linear,… vHash=5b43c776 fHash=70b71dad stage=mirror-render
  #33 type=SpriteMaterial name='' cacheKey=sprite,highp,srgb-linear… vHash=b0067b0d fHash=84786b6f stage=mirror-render
  #34 type=MeshBasicMaterial name='' cacheKey=basic,highp,srgb-linear,… vHash=d459e49b fHash=a8a9bac3 stage=mirror-render
  #35 type=MeshBasicMaterial name='' bucket=other cacheKey=basic,highp,srgb-linear,… vHash=b6911298 fHash=73a25d1e stage=mirror-render
      flags={"transparent":"true","alphaTest":"0","vertexColors":"false","fog":"false","wireframe":"false","map":"true","normalMap":"false","envMap":"false"}
      material=9ccc0c73-4863-4b0a-a1fa-ba436ecfa00d
  #36 type=MeshStandardMaterial name='lambert2SG' bucket=fauna cacheKey=physical,STANDARD,,highp… vHash=7bb77142 fHash=87728b15 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=bf6dce51-debc-4a89-8c14-735743d1eb5e (lambert2SG)
  #37 type=MeshPhysicalMaterial name='Material #55' bucket=fauna cacheKey=physical,STANDARD,,PHYSI… vHash=a344732e fHash=16869b56 stage=mirror-render
      defines={"STANDARD":"","PHYSICAL":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=cf68d631-a5bb-4428-8a56-717e7c481789 (Material #55)
  #38 type=MeshStandardMaterial name='DarkGreen' bucket=other cacheKey=physical,STANDARD,,highp… vHash=9434da33 fHash=77dfd097 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"false","map":"false","normalMap":"false","envMap":"false"}
      material=6cb014d0-b28d-4614-8406-a6ec302458f1 (DarkGreen)
  #39 type=MeshStandardMaterial name='Pond_Pack_MAT' bucket=other cacheKey=physical,STANDARD,,highp… vHash=c3bc6325 fHash=ded4be89 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"true","fog":"true","wireframe":"false","flatShading":"false","map":"true","normalMap":"false","envMap":"false"}
      material=51fca4eb-beec-4251-980b-259f715359ad (Pond_Pack_MAT)
  #40 type=MeshStandardMaterial name='' bucket=other cacheKey=physical,STANDARD,,highp… vHash=94297e69 fHash=aa0735a8 stage=mirror-render
      defines={"STANDARD":""}
      flags={"transparent":"false","alphaTest":"0","vertexColors":"false","fog":"true","wireframe":"false","flatShading":"true","map":"false","normalMap":"false","envMap":"false"}
      material=c49c7b55-5b8a-405a-9e2d-09666fb7081a
  #41 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=59ed5d71 fHash=d729897e stage=postprocess-render
  #42 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=b69ba143 fHash=d729897e stage=postprocess-render
  #43 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=2e7a6fcb fHash=758a4164 stage=postprocess-render
  #44 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=41e40a66 stage=postprocess-render
  #45 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=41e40a66 stage=postprocess-render
  #46 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=7c1e7b69 fHash=758a4164 stage=postprocess-render
  #47 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=c203b19a fHash=a9dd0dee stage=postprocess-render
  #48 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=585a1ea4 fHash=a9dd0dee stage=postprocess-render
  #49 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=263c45d6 fHash=d729897e stage=postprocess-render
  #50 type=MeshDepthMaterial name='' cacheKey=depth,highp,srgb-linear,… vHash=e4717b03 fHash=41e40a66 stage=postprocess-render
  #51 type=ShaderMaterial name='' cacheKey=16,17,highp,srgb-linear,… vHash=279cec18 fHash=4d6bcede stage=postprocess-render
  #52 type=ShaderMaterial name='' cacheKey=18,19,highp,srgb-linear,… vHash=84736a68 fHash=ffecb62a stage=postprocess-render
  #53 type=ShaderMaterial name='' cacheKey=20,21,highp,srgb-linear,… vHash=aa2edbee fHash=76ced00a stage=postprocess-render
  #54 type=ShaderMaterial name='' cacheKey=22,23,highp,srgb-linear,… vHash=7bae0bb2 fHash=fb55b3c0 stage=postprocess-render
  #55 type=ShaderMaterial name='' cacheKey=24,25,highp,srgb-linear,… vHash=436caea4 fHash=2d687ef1 stage=postprocess-render
  #56 type=ShaderMaterial name='' cacheKey=26,27,SMAA_THRESHOLD,0.1… vHash=886438e7 fHash=dc2a89b5 stage=postprocess-render
  #57 type=ShaderMaterial name='' cacheKey=28,29,SMAA_MAX_SEARCH_ST… vHash=d99a5b29 fHash=109e33fc stage=postprocess-render
  #58 type=ShaderMaterial name='' cacheKey=30,31,highp,srgb-linear,… vHash=2003ced8 fHash=db0f470a stage=postprocess-render
  #59 type=ShaderMaterial name='' cacheKey=32,33,highp,srgb-linear,… vHash=28dfa407 fHash=9775cd0e stage=postprocess-render
  #60 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,6,hi… vHash=756a0b19 fHash=5c741650 stage=postprocess-render
  #61 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,10,h… vHash=b2354ff2 fHash=2aad9943 stage=postprocess-render
  #62 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,14,h… vHash=ea82969e fHash=a2297d9f stage=postprocess-render
  #63 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,18,h… vHash=7dab8d9a fHash=1022767b stage=postprocess-render
  #64 type=ShaderMaterial name='' cacheKey=34,35,KERNEL_RADIUS,22,h… vHash=378e1fb7 fHash=ce0bf6b4 stage=postprocess-render
  #65 type=ShaderMaterial name='' cacheKey=34,36,NUM_MIPS,5,highp,s… vHash=78acf7ea fHash=707f290c stage=postprocess-render
  #66 type=ShaderMaterial name='' cacheKey=37,38,highp,srgb-linear,… vHash=a312c579 fHash=c05e2256 stage=postprocess-render
  #67 type=ShaderMaterial name='GodRaysShader' cacheKey=39,40,highp,srgb-linear,… vHash=b817515d fHash=ccc98549 stage=postprocess-render
  #68 type=RawShaderMaterial name='OutputShader' cacheKey=41,42,SRGB_TRANSFER,,ACE… vHash=5d2c950f fHash=3f479486 stage=postprocess-render

Differences within frame 0 (grouped by material type):
  ShaderMaterial (26 programs):
    vertexShaderHash differs: #0=603d22a7, #1=72aec116, #3=1bb00362, #4=22690955, #5=e6d01ae7, #6=5efd8b76, #21=df7c703d, #22=f92c8d8c, #32=5b43c776, #51=279cec18, #52=84736a68, #53=aa2edbee, #54=7bae0bb2, #55=436caea4, #56=886438e7, #57=d99a5b29, #58=2003ced8, #59=28dfa407, #60=756a0b19, #61=b2354ff2, #62=ea82969e, #63=7dab8d9a, #64=378e1fb7, #65=78acf7ea, #66=a312c579, #67=b817515d
    fragmentShaderHash differs: #0=c6043ced, #1=ae17ade6, #3=a38bbf04, #4=2cf9fa62, #5=e34491ff, #6=9b2a34e4, #21=236b3b0b, #22=87d053eb, #32=70b71dad, #51=4d6bcede, #52=ffecb62a, #53=76ced00a, #54=fb55b3c0, #55=2d687ef1, #56=dc2a89b5, #57=109e33fc, #58=db0f470a, #59=9775cd0e, #60=5c741650, #61=2aad9943, #62=a2297d9f, #63=1022767b, #64=ce0bf6b4, #65=707f290c, #66=c05e2256, #67=ccc98549
    bucket differs: #0=other, #1=other, #3=water, #4=other, #5=water, #6=grass, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    define USE_CHUNK_MASK differs: #0=(unset), #1=(unset), #3=1, #4=(unset), #5=(unset), #6=(unset), #21=(unset), #22=(unset), #32=(unset), #51=(unset), #52=(unset), #53=(unset), #54=(unset), #55=(unset), #56=(unset), #57=(unset), #58=(unset), #59=(unset), #60=(unset), #61=(unset), #62=(unset), #63=(unset), #64=(unset), #65=(unset), #66=(unset), #67=(unset)
    flag alphaTest differs: #0=0, #1=0, #3=0, #4=0, #5=0, #6=0, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag envMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag fog differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=true, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag map differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag normalMap differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag transparent differs: #0=false, #1=true, #3=true, #4=true, #5=true, #6=false, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag vertexColors differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
    flag wireframe differs: #0=false, #1=false, #3=false, #4=false, #5=false, #6=false, #21=(unknown), #22=(unknown), #32=(unknown), #51=(unknown), #52=(unknown), #53=(unknown), #54=(unknown), #55=(unknown), #56=(unknown), #57=(unknown), #58=(unknown), #59=(unknown), #60=(unknown), #61=(unknown), #62=(unknown), #63=(unknown), #64=(unknown), #65=(unknown), #66=(unknown), #67=(unknown)
  MeshStandardMaterial (28 programs):
    vertexShaderHash differs: #2=5c2c57a3, #7=e3408c64, #8=d38f15a4, #9=c0d790d1, #10=d3fd7a87, #11=e4cbf8ca, #12=6db98a06, #13=a9733c9d, #14=f3a1039e, #15=c5e73b05, #16=13a74ec7, #17=9dcf1cb4, #18=12873951, #19=fc941d05, #20=e551c572, #23=d9d07622, #24=190d3a9c, #25=9dbe8ee7, #26=fd8301ed, #27=88cdd138, #28=b643916d, #29=f618dfff, #30=5ed1ec8c, #31=a9f43b6e, #36=7bb77142, #38=9434da33, #39=c3bc6325, #40=94297e69
    fragmentShaderHash differs: #2=a1daa357, #7=c0b8fc9f, #8=6578c10d, #9=a81023c3, #10=2eae9a54, #11=135696d3, #12=efed8e98, #13=bd723c8a, #14=c7daf23, #15=d4c95125, #16=3ab4c629, #17=2d1aa4a, #18=d4c95125, #19=3ab4c629, #20=2d1aa4a, #23=135696d3, #24=633146b4, #25=8dba9dd, #26=2f2885d5, #27=f2ad9521, #28=754b87bd, #29=4057772, #30=80443a73, #31=d3ca6f1e, #36=87728b15, #38=77dfd097, #39=ded4be89, #40=aa0735a8
    bucket differs: #2=terrain, #7=other, #8=other, #9=vegetation, #10=vegetation, #11=vegetation, #12=environment, #13=environment, #14=settlement, #15=settlement, #16=(unknown), #17=settlement, #18=settlement, #19=(unknown), #20=settlement, #23=settlement, #24=settlement, #25=settlement, #26=fauna, #27=settlement, #28=settlement, #29=npc, #30=npc, #31=npc, #36=fauna, #38=other, #39=other, #40=other
    define STANDARD differs: #2=, #7=, #8=, #9=, #10=, #11=, #12=, #13=, #14=, #15=, #16=(unset), #17=, #18=, #19=(unset), #20=, #23=, #24=, #25=, #26=, #27=, #28=, #29=, #30=, #31=, #36=, #38=, #39=, #40=
    flag alphaTest differs: #2=0, #7=0, #8=0, #9=0, #10=0, #11=0.45, #12=0, #13=0, #14=0, #15=0, #16=(unknown), #17=0, #18=0, #19=(unknown), #20=0, #23=0.45, #24=0, #25=0, #26=0, #27=0, #28=0, #29=0, #30=0, #31=0, #36=0, #38=0, #39=0, #40=0
    flag envMap differs: #2=false, #7=false, #8=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #23=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #36=false, #38=false, #39=false, #40=false
    flag flatShading differs: #2=false, #7=true, #8=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #23=false, #24=false, #25=false, #26=false, #27=true, #28=false, #29=false, #30=false, #31=false, #36=false, #38=false, #39=false, #40=true
    flag fog differs: #2=true, #7=true, #8=true, #9=true, #10=true, #11=true, #12=true, #13=true, #14=true, #15=true, #16=(unknown), #17=true, #18=true, #19=(unknown), #20=true, #23=true, #24=true, #25=true, #26=true, #27=true, #28=true, #29=true, #30=true, #31=true, #36=true, #38=true, #39=true, #40=true
    flag map differs: #2=false, #7=false, #8=false, #9=false, #10=false, #11=true, #12=true, #13=false, #14=false, #15=true, #16=(unknown), #17=false, #18=true, #19=(unknown), #20=false, #23=true, #24=false, #25=true, #26=false, #27=false, #28=true, #29=true, #30=true, #31=false, #36=true, #38=false, #39=true, #40=false
    flag normalMap differs: #2=true, #7=false, #8=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=true, #16=(unknown), #17=false, #18=true, #19=(unknown), #20=false, #23=false, #24=false, #25=true, #26=false, #27=false, #28=false, #29=true, #30=true, #31=false, #36=false, #38=false, #39=false, #40=false
    flag transparent differs: #2=false, #7=false, #8=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=(unknown), #17=true, #18=false, #19=(unknown), #20=true, #23=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #36=false, #38=false, #39=false, #40=false
    flag vertexColors differs: #2=true, #7=false, #8=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #23=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #36=false, #38=false, #39=true, #40=false
    flag wireframe differs: #2=false, #7=false, #8=false, #9=false, #10=false, #11=false, #12=false, #13=false, #14=false, #15=false, #16=(unknown), #17=false, #18=false, #19=(unknown), #20=false, #23=false, #24=false, #25=false, #26=false, #27=false, #28=false, #29=false, #30=false, #31=false, #36=false, #38=false, #39=false, #40=false
  SpriteMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshBasicMaterial (2 programs):
    vertexShaderHash differs: #34=d459e49b, #35=b6911298
    fragmentShaderHash differs: #34=a8a9bac3, #35=73a25d1e
    bucket differs: #34=(unknown), #35=other
    flag alphaTest differs: #34=(unknown), #35=0
    flag envMap differs: #34=(unknown), #35=false
    flag fog differs: #34=(unknown), #35=false
    flag map differs: #34=(unknown), #35=true
    flag normalMap differs: #34=(unknown), #35=false
    flag transparent differs: #34=(unknown), #35=true
    flag vertexColors differs: #34=(unknown), #35=false
    flag wireframe differs: #34=(unknown), #35=false
  MeshPhysicalMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)
  MeshDepthMaterial (10 programs):
    vertexShaderHash differs: #41=59ed5d71, #42=b69ba143, #43=2e7a6fcb, #44=585a1ea4, #45=c203b19a, #46=7c1e7b69, #47=c203b19a, #48=585a1ea4, #49=263c45d6, #50=e4717b03
    fragmentShaderHash differs: #41=d729897e, #42=d729897e, #43=758a4164, #44=41e40a66, #45=41e40a66, #46=758a4164, #47=a9dd0dee, #48=a9dd0dee, #49=d729897e, #50=41e40a66
  RawShaderMaterial (1 program):
    (only one program of this type in this frame — nothing to diff)

---

[Seedvale Program Attribution]



Frame 1512 (+14):
  Program #77
    material: MeshStandardMaterial ''
    materialUuid: 01c62361-5d47-4210-af78-39b0b0c0cc52
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389696,8519683,srgb,chunk-terrain-surface-detail-v7
    defines: {"STANDARD":""}
    vertexShaderHash: 2ec22bd5
    fragmentShaderHash: 89831d77
  Program #78
    material: MeshStandardMaterial 'Wood'
    materialUuid: 01de908d-97ef-4136-a0c3-e1a31aabe238
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 320d0e37
    fragmentShaderHash: 65cafcc2
  Program #79
    material: MeshStandardMaterial 'Green'
    materialUuid: c1baca6a-c54a-4090-8b90-69c4354da2c8
    object: Mesh 'mesh_0_1'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8521731,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 780f6dcc
    fragmentShaderHash: dbb99308
  Program #80
    material: MeshStandardMaterial 'Green'
    materialUuid: 9f10e09b-cb5b-46dc-94b1-7bb01cee4dce
    object: Mesh 'settlement-bushes-6:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: d0069e25
    fragmentShaderHash: c94ff2d5
  Program #81
    material: MeshStandardMaterial 'Berry'
    materialUuid: 9809a122-544f-4d67-8b3f-02496f6ea986
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 798c4bf5
    fragmentShaderHash: c37cc244
  Program #82
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: bfdad8bc-41d5-4f7e-8609-b761ed357a84
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 2c216b4f
    fragmentShaderHash: 47812acb
  Program #83
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 5ee14f00-073f-4b1a-812b-15b75a9a8e18
    object: Mesh 'mesh_0'
    asset: /models/nature/flower_clump_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8389121,8521731,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 6d95624c
    fragmentShaderHash: 5a74547b
  Program #84
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: c6bcfb1c-f4f6-47e9-b871-e96dd0f326fd
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8519683,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: f485db97
    fragmentShaderHash: 3c5226a1
  Program #85
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 61131ce4-a751-45dc-b33b-2587da174ad7
    object: Mesh 'chunk-vegetation-region-1,0|fern-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8392193,8519683,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 3858a100
    fragmentShaderHash: 4abfdd1b
  Program #86
    material: MeshStandardMaterial 'MI_WoodTrim'
    materialUuid: 51705593-1218-41b5-a818-b24a11f6179b
    object: Mesh 'house-static-batch:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388673,8521731,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 3c9f4a85
    fragmentShaderHash: dd9a9763
  Program #87
    material: MeshStandardMaterial 'MI_Eyes'
    materialUuid: a539e9de-0937-4c16-99d3-840c63d10580
    object: SkinnedMesh 'mesh_4'
    asset: /models/characters/ubc/male_peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388672,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 45a71c87
    fragmentShaderHash: 44658c04
  Program #88
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 4a545e35-2715-4994-b572-9c4965688e21
    object: SkinnedMesh 'mesh_0'
    asset: /models/characters/ubc/male_peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388672,8521763,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: de7c9827
    fragmentShaderHash: 4fa0b088
  Program #89
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8392707,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 30e685d1
    fragmentShaderHash: 53dde5bb
  Program #90
    material: MeshStandardMaterial 'MI_WindowGlass'
    materialUuid: 6380f558-d6dd-425a-96c6-64cb35ef220e
    object: Mesh 'house-static-batch:20'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb-linear,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,0,0,0,0,0,1,0,0,0,0,8388609,8388611,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5f2e9b54
    fragmentShaderHash: 372a363a

Frame 1764 (+16):
  Program #96
    material: ShaderMaterial 'SkyShader'
    materialUuid: 3fd3674c-2d04-4895-96e8-99a7f97f7fa9
    object: Mesh ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 0,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8524801,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 603d22a7
    fragmentShaderHash: 5bec192c
  Program #97
    material: ShaderMaterial ''
    materialUuid: aede82d0-897c-42c4-8cfe-570bd34603e1
    object: Mesh 'chunk-grass-tri'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 8,9,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,1,8522755,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5efd8b76
    fragmentShaderHash: 8c624cc7
  Program #98
    material: MeshStandardMaterial ''
    materialUuid: 01c62361-5d47-4210-af78-39b0b0c0cc52
    object: Mesh 'chunk'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389696,8520707,srgb,chunk-terrain-surface-detail-v7
    defines: {"STANDARD":""}
    vertexShaderHash: 5c2c57a3
    fragmentShaderHash: 6b931360
  Program #99
    material: MeshStandardMaterial 'Wood'
    materialUuid: 01de908d-97ef-4136-a0c3-e1a31aabe238
    object: Mesh 'mesh_0'
    asset: /models/settlement/crate.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 5cee842b
    fragmentShaderHash: 1683d5db
  Program #100
    material: MeshStandardMaterial 'Green'
    materialUuid: c1baca6a-c54a-4090-8b90-69c4354da2c8
    object: Mesh 'mesh_0_1'
    asset: /models/nature/tree_b.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8522755,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 80917d5e
    fragmentShaderHash: 3414bdd9
  Program #101
    material: MeshStandardMaterial 'Green'
    materialUuid: 9f10e09b-cb5b-46dc-94b1-7bb01cee4dce
    object: Mesh 'settlement-bushes-6:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: c0d790d1
    fragmentShaderHash: 3aaee6d6
  Program #102
    material: MeshStandardMaterial 'Berry'
    materialUuid: 9809a122-544f-4d67-8b3f-02496f6ea986
    object: Mesh 'Barrel_1'
    asset: /models/settlement/barrel.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: c8368f61
    fragmentShaderHash: 8142f955
  Program #103
    material: MeshStandardMaterial 'MapleTree_Bark'
    materialUuid: bfdad8bc-41d5-4f7e-8609-b761ed357a84
    object: Mesh 'mesh_0'
    asset: /models/nature/tree_c.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388673,8522755,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: d612cf03
    fragmentShaderHash: 2a64e35c
  Program #104
    material: MeshStandardMaterial 'MapleTree_Leaves'
    materialUuid: 5ee14f00-073f-4b1a-812b-15b75a9a8e18
    object: Mesh 'mesh_0'
    asset: /models/nature/flower_clump_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8389121,8522755,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 5641a2de
    fragmentShaderHash: ac9d73ac
  Program #105
    material: MeshStandardMaterial 'PineTree_Bark'
    materialUuid: c6bcfb1c-f4f6-47e9-b871-e96dd0f326fd
    object: Mesh 'mesh_0'
    asset: /models/nature/pine_1.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388609,8520707,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: 86d8050b
    fragmentShaderHash: 33b94cf2
  Program #106
    material: MeshStandardMaterial 'Leaves'
    materialUuid: 61131ce4-a751-45dc-b33b-2587da174ad7
    object: Mesh 'chunk-vegetation-region-1,0|fern-0:0'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8392193,8520707,srgb,(shader, renderer) => {
    prevCompile?.(shader, renderer);
    shader.uniforms.uFoliageTime = uFoliageTime;
    if (!shader.vertexShader.includes("uFoliageTime")) {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uFoliageTime;"
      ).replace("#include <begin_vertex>", BEGIN_VERTEX_WIND);
    }
  }|foliage-wind-v3
    defines: {"STANDARD":""}
    vertexShaderHash: 984eda2a
    fragmentShaderHash: d65a968c
  Program #107
    material: MeshStandardMaterial 'MI_Regular_Male'
    materialUuid: 4a545e35-2715-4994-b572-9c4965688e21
    object: SkinnedMesh 'mesh_0'
    asset: /models/characters/ubc/male_peasant.glb
    cacheKey: physical,STANDARD,,highp,srgb,false,,uv,false,false,false,false,uv,false,false,uv,uv,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388672,8522787,srgb,onBeforeCompile() {
  }
    defines: {"STANDARD":""}
    vertexShaderHash: bd5799fb
    fragmentShaderHash: b5666e59
  Program #108
    material: ShaderMaterial ''
    materialUuid: 9f400ed6-cde7-438e-9d17-5b88add1a360
    object: Mesh 'ocean'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: e6d01ae7
    fragmentShaderHash: 215382b6
  Program #109
    material: ShaderMaterial ''
    materialUuid: unknown
    object: unknown ''
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 14,15,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8389635,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 5b43c776
    fragmentShaderHash: 34e03bb0
  Program #110
    material: ShaderMaterial ''
    materialUuid: 49450061-4606-4948-ada6-73b2dcb07c1f
    object: Mesh 'chunk-water'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 4,5,USE_CHUNK_MASK,1,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,8388608,8391683,srgb,onBeforeCompile() {
  }
    defines: {"USE_CHUNK_MASK":1}
    vertexShaderHash: 1bb00362
    fragmentShaderHash: a02c63f1
  Program #111
    material: ShaderMaterial ''
    materialUuid: 32879953-38fe-48ef-b164-4f466e68cfb6
    object: Mesh 'chunk-river'
    asset: (no GLB — procedural geometry or unattributed)
    cacheKey: 6,7,highp,srgb,false,,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,,,false,0,,1,16,0,0,1,0,1,0,0,0,0,1,4,0,0,0,0,8391683,srgb,onBeforeCompile() {
  }
    defines: none
    vertexShaderHash: 22690955
    fragmentShaderHash: 593d20b7

---

[Seedvale Program Compile Cost]

No isolated per-program GPU compile/link timer exists in the public Three.js/WebGL API without patching internals (out of scope here). Each number below is the wall-clock duration of the renderer.render() call (mirror-render/postprocess-render) that first-used the program, reported ONLY when that program was the single new program created during that specific call — an upper bound that also includes the rest of that call's render cost, not an isolated compile/link timer.
Excluded — no reliable per-program timing: 104 shared a render call with other new programs, 0 first-used outside a mirror/postprocess stage boundary.

Programs with measurable cost > 1 ms:

Frame 43
  #69
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 21.1 ms  (upper bound — whole postprocess-render call, see note above)

Frame 45
  #70
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 21.0 ms  (upper bound — whole postprocess-render call, see note above)

Frame 147
  #71
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 15.7 ms  (upper bound — whole postprocess-render call, see note above)

Frame 155
  #72
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 14.4 ms  (upper bound — whole postprocess-render call, see note above)

Frame 164
  #73
      material: MeshDepthMaterial ''
      object: unknown ''
      asset: (no GLB — procedural geometry or unattributed)
      compile/link: 16.2 ms  (upper bound — whole postprocess-render call, see note above)

Frame 193
  #74
      material: MeshStandardMaterial 'MapleTree_Bark'
      object: Mesh 'mesh_0'
      asset: /models/nature/maple_1.glb
      compile/link: 19.8 ms  (upper bound — whole postprocess-render call, see note above)

Frame 236
  #75
      material: MeshStandardMaterial 'Leaves'
      object: Mesh 'chunk-vegetation-region-0,0|fern-0:0'
      asset: (no GLB — procedural geometry or unattributed)
      foliage-wind-v3
      compile/link: 16.4 ms  (upper bound — whole mirror-render call, see note above)

Frame 613
  #76
      material: MeshStandardMaterial 'Green'
      object: Mesh 'mesh_0_1'
      asset: /models/nature/tree_b.glb
      foliage-wind-v3
      compile/link: 27.9 ms  (upper bound — whole postprocess-render call, see note above)

Summary:
  total measured compile/link time: 152.5 ms
  programs >1 ms: 8
  max: 27.9 ms (#76)

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=11.9 ms  p95=17.4 ms  max=17.7 ms  Δavg vs baseline=—
  hide-grass           avg=12.4 ms  p95=15.6 ms  max=16.5 ms  Δavg vs baseline=+0.5 ms (+4%)
  hide-vegetation      avg=10.7 ms  p95=14.5 ms  max=14.5 ms  Δavg vs baseline=-1.3 ms (-11%)
  no vegetation/grass  avg=12.3 ms  p95=14.0 ms  max=14.0 ms  Δavg vs baseline=+0.4 ms (+3%)
  hide-environment     avg=12.1 ms  p95=15.5 ms  max=18.7 ms  Δavg vs baseline=+0.2 ms (+2%)
  hide-settlement      avg=10.0 ms  p95=13.7 ms  max=15.6 ms  Δavg vs baseline=-2.0 ms (-16%)
  no water             avg=11.6 ms  p95=14.5 ms  max=15.3 ms  Δavg vs baseline=-0.3 ms (-3%)
  hide-terrain         avg=9.7 ms  p95=13.3 ms  max=13.4 ms  Δavg vs baseline=-2.2 ms (-18%)
  hide-npc-fauna       avg=9.2 ms  p95=12.4 ms  max=12.6 ms  Δavg vs baseline=-2.7 ms (-23%)
  no-shadows           avg=6.0 ms  p95=7.1 ms  max=9.3 ms  Δavg vs baseline=-5.9 ms (-50%)
  no-ao                avg=7.5 ms  p95=10.4 ms  max=10.8 ms  Δavg vs baseline=-4.4 ms (-37%)
  no-bloom             avg=10.5 ms  p95=16.4 ms  max=17.7 ms  Δavg vs baseline=-1.4 ms (-12%)
  no-smaa              avg=8.8 ms  p95=12.3 ms  max=12.7 ms  Δavg vs baseline=-3.1 ms (-26%)
  no-god-rays          avg=6.9 ms  p95=9.5 ms  max=10.9 ms  Δavg vs baseline=-5.0 ms (-42%)
  no-film-grade        avg=7.1 ms  p95=10.5 ms  max=12.0 ms  Δavg vs baseline=-4.8 ms (-40%)
  no postprocessing    avg=8.3 ms  p95=11.0 ms  max=11.6 ms  Δavg vs baseline=-3.7 ms (-31%)
  no mirrors           avg=9.0 ms  p95=13.8 ms  max=15.9 ms  Δavg vs baseline=-3.0 ms (-25%)

CPU/GPU separation (baseline, same RENDER span):
  EXT_disjoint_timer_query_webgl2: available (26 samples resolved during the baseline window)
  GPU elapsed   avg=13.1 ms  p95=14.8 ms  max=16.2 ms
  CPU wall      avg=11.9 ms  p95=17.4 ms  max=17.7 ms
  CPU wall time already includes any driver/GPU wait around the render call — read "CPU wall minus GPU elapsed" as an approximate upper bound, not an exact isolated CPU-only cost.
