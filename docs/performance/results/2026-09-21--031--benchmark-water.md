# Seedvale Performance Benchmark Report

> Generated: 2026-09-21T08:18:36.829Z
> Sections:
> - [Seedvale Benchmark]
> - [Seedvale Agent CPU]
> - [Seedvale Long Frame Attribution]
> - [Seedvale Render Isolation]

---

[Seedvale Benchmark]

Scenario: water
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
  anchor: (-8.1, 100.5)

FPS:
  avg: 83.8
  min: 21
  p1: 38

Frame time:
  avg: 11.9 ms
  p95: 19.2 ms
  max: 47.2 ms

Rendering:
  draw calls: 234 avg / 485 max
  triangles: 4.98M avg
  mirror draws: 62 avg
  geometries: 544
  textures: 489

Scene (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  grass            draws=56 tris=2.37M meshes=56 inst=213695
  vegetation       draws=97 tris=248.5k meshes=97 inst=172
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=723 tris=695.1k meshes=723 inst=1325
  water            draws=39 tris=2.81M meshes=39 inst=39
  npc              draws=190 tris=447.7k meshes=190 inst=190
  fauna            draws=212 tris=88.3k meshes=212 inst=212
  items            draws=145 tris=13.5k meshes=145 inst=145
  other            draws=211 tris=32.6k meshes=211 inst=211

Shadow casters (one-pass estimate):
  terrain          draws=54 tris=3.98M meshes=54 inst=54
  vegetation       draws=95 tris=241.6k meshes=95 inst=170
  environment      draws=49 tris=11.7k meshes=49 inst=49
  settlement       draws=446 tris=491.7k meshes=446 inst=993
  items            draws=16 tris=10.4k meshes=16 inst=16
  other            draws=105 tris=24.6k meshes=105 inst=105

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
  other            draws=33 tris=2.2k meshes=33 inst=37

Systems:
  WATER          1.5 ms
  NPC            1.6 ms
  FAUNA          1.3 ms
  PHYSICS        0.1 ms
  RENDER         6.1 ms

Detected bottlenecks:
  1. RENDER
  2. NPC
  3. WATER

Critical spikes:
  RENDER: 14

Hitches (>= 8 ms):
  (none)

Isolation probes:
  full               render=6.5 ms draws=236 tris=4.99M
  hide-grass         render=5.4 ms draws=191 tris=2.60M
  hide-vegetation    render=5.0 ms draws=204 tris=4.81M
  hide-vegetation-grass render=4.7 ms draws=168 tris=2.48M
  hide-environment   render=5.7 ms draws=236 tris=4.99M
  hide-settlement    render=7.8 ms draws=151 tris=4.86M
  hide-water         render=9.7 ms draws=232 tris=4.50M
  hide-terrain       render=7.0 ms draws=206 tris=3.20M
  hide-npc-fauna     render=5.1 ms draws=230 tris=4.94M
  no-shadows         render=5.1 ms draws=221 tris=4.85M
  no-ao              render=5.5 ms draws=224 tris=4.94M
  no-bloom           render=5.2 ms draws=223 tris=4.99M
  no-smaa            render=5.3 ms draws=230 tris=4.97M
  no-god-rays        render=6.2 ms draws=236 tris=4.99M
  no-film-grade      render=6.1 ms draws=240 tris=5.03M
  no-postprocessing  render=5.6 ms draws=207 tris=4.94M
  no-reflections     render=5.3 ms draws=170 tris=4.51M

Frame attribution:
  frame max: 47.2 ms
  largest labelled hitch: 0 ms
  unattributed: 47.2 ms

Long frames:
  threshold: 80 ms
  count: 0
  worst: (none)

Recommendation:
RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.6 ms/frame
  crowd pass: 0.0 ms/frame (10.6 ms cumulative)
  agent updates: 1.0 ms/frame (1648.0 ms cumulative)
  livestock: 0.4 ms/frame (618.8 ms cumulative)
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
    update calls/frame: 19.0
    unique animals/frame: 19.0
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.0 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.2/frame (0.0 candidates/frame)
    water samples: 9.9/frame, 0.00 ms/frame (worst call 1.60 ms)
    collider queries: 9.9/frame, 0.00 ms/frame (worst call 0.30 ms, 575.6 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 18.8
    behaviour executions/frame: 4.4
    presentation executions/frame: 3.7
  rats: 0.1 ms/frame (143.7 ms cumulative)
  social: 0.0 ms/frame (8.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (198.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (2140.6 ms cumulative)
  forest sampling: 0.1 ms/frame (141.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (29.0 ms cumulative)
    targeting: 0.0 ms/frame (26.8 ms cumulative)
    decision: 0.0 ms/frame (19.0 ms cumulative)
    behaviour: 0.7 ms/frame (1261.4 ms cumulative)
    life/presentation: 0.3 ms/frame (527.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 12.3
    full-rate agents/frame: 6.8
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 12.3
    presentation executions/frame: 11.2

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 363.2
    player perception checks/frame: 30.0

  nearest scans: 18.1/frame (30899 calls)
  nearest candidates checked: 138.5/frame (236186 total)
  herd leader scans: 0.1/frame (153 calls)
  herd candidates checked: 2.7/frame (4590 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 15.4/frame (92.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 29.0/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 29.0/frame, 0.00 ms/frame (worst call 0.20 ms, 1548.9 colliders/frame)

---

[Seedvale Agent CPU]

Population:
  NPC (loaded): 20
  Fauna (agents): 30

NPC:
  total: 1.6 ms/frame
  crowd pass: 0.0 ms/frame (10.6 ms cumulative)
  agent updates: 1.0 ms/frame (1648.0 ms cumulative)
  livestock: 0.4 ms/frame (618.8 ms cumulative)
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
    update calls/frame: 19.0
    unique animals/frame: 19.0
    duplicate updates/frame: 0.0
    detached animals/frame: 0.0
    dog updates/frame: 4.0
    dog guard scans: 4.0/frame (32.0 predator candidates/frame)
    pest scans: 0.9/frame (0.9 rat candidates/frame)
    nearest scans: 4.2/frame (0.0 candidates/frame)
    water samples: 9.9/frame, 0.00 ms/frame (worst call 1.60 ms)
    collider queries: 9.9/frame, 0.00 ms/frame (worst call 0.30 ms, 575.6 colliders/frame)
    full-rate agents/frame: 0.2
    reduced-cadence agents/frame: 18.8
    behaviour executions/frame: 4.4
    presentation executions/frame: 3.7
  rats: 0.1 ms/frame (143.7 ms cumulative)
  social: 0.0 ms/frame (8.9 ms cumulative)
  streaming: 0.0 ms/frame (0.0 ms cumulative)
  maintenance: 0.1 ms/frame (198.6 ms cumulative)
  unattributed: 0.0 ms/frame

FAUNA:
  total: 1.3 ms/frame
  agent updates: 1.3 ms/frame (2140.6 ms cumulative)
  forest sampling: 0.1 ms/frame (141.8 ms cumulative)
  other (spawners/forage/cleanup/...): 0.0 ms/frame

  AnimalAgent sections:
    sensing: 0.0 ms/frame (29.0 ms cumulative)
    targeting: 0.0 ms/frame (26.8 ms cumulative)
    decision: 0.0 ms/frame (19.0 ms cumulative)
    behaviour: 0.7 ms/frame (1261.4 ms cumulative)
    life/presentation: 0.3 ms/frame (527.7 ms cumulative)
    other update: 0.1 ms/frame

  adaptive candidates:
    agent updates/frame: 30.0
    sensing passes/frame: 30.0
    decision passes/frame: 30.0
    high-priority agents/frame: 0.0
    expensive behaviour agents/frame: 12.3
    full-rate agents/frame: 6.8
    reduced-cadence agents/frame: 23.2
    behaviour executions/frame: 12.3
    presentation executions/frame: 11.2

  sensing/cache:
    forest samples/frame: 30.0
    fire scan candidates/frame: 30.0
    village scan candidates/frame: 363.2
    player perception checks/frame: 30.0

  nearest scans: 18.1/frame (30899 calls)
  nearest candidates checked: 138.5/frame (236186 total)
  herd leader scans: 0.1/frame (153 calls)
  herd candidates checked: 2.7/frame (4590 total)
  proximity rebuild: 0.00 ms/frame
  spawner bookkeeping: 0.00 ms/frame
  proximity queries: 15.4/frame (92.1 candidates/frame)

  movement hot-path (plan fauna-033):
    water samples: 29.0/frame, 0.00 ms/frame (worst call 0.20 ms)
    collider queries: 29.0/frame, 0.00 ms/frame (worst call 0.20 ms, 1548.9 colliders/frame)

---

[Seedvale Long Frame Attribution]

Threshold: 80 ms
Long frames: 0

No frame crossed the long-frame threshold in this measured session.

---

[Seedvale Render Isolation]

Render time = RENDER category wall-clock (postprocess + label render, performance.now() around the call). This includes any driver/GPU wait unless the CPU/GPU separation section below actually measured GPU-side time — it is not isolated CPU cost on its own.

  baseline             avg=6.5 ms  p95=8.5 ms  max=12.3 ms  Δavg vs baseline=—
  hide-grass           avg=5.4 ms  p95=6.2 ms  max=6.2 ms  Δavg vs baseline=-1.1 ms (-17%)
  hide-vegetation      avg=5.0 ms  p95=5.6 ms  max=5.6 ms  Δavg vs baseline=-1.5 ms (-23%)
  no vegetation/grass  avg=4.7 ms  p95=5.5 ms  max=6.2 ms  Δavg vs baseline=-1.7 ms (-27%)
  hide-environment     avg=5.7 ms  p95=7.5 ms  max=8.4 ms  Δavg vs baseline=-0.8 ms (-13%)
  hide-settlement      avg=7.8 ms  p95=10.7 ms  max=10.7 ms  Δavg vs baseline=+1.3 ms (+20%)
  no water             avg=9.7 ms  p95=15.2 ms  max=19.9 ms  Δavg vs baseline=+3.2 ms (+50%)
  hide-terrain         avg=7.0 ms  p95=8.4 ms  max=9.7 ms  Δavg vs baseline=+0.5 ms (+7%)
  hide-npc-fauna       avg=5.1 ms  p95=6.4 ms  max=6.9 ms  Δavg vs baseline=-1.4 ms (-22%)
  no-shadows           avg=5.1 ms  p95=6.7 ms  max=7.6 ms  Δavg vs baseline=-1.3 ms (-21%)
  no-ao                avg=5.5 ms  p95=7.8 ms  max=8.3 ms  Δavg vs baseline=-1.0 ms (-16%)
  no-bloom             avg=5.2 ms  p95=6.3 ms  max=7.3 ms  Δavg vs baseline=-1.2 ms (-19%)
  no-smaa              avg=5.3 ms  p95=6.3 ms  max=6.8 ms  Δavg vs baseline=-1.2 ms (-18%)
  no-god-rays          avg=6.2 ms  p95=8.6 ms  max=11.3 ms  Δavg vs baseline=-0.3 ms (-4%)
  no-film-grade        avg=6.1 ms  p95=8.6 ms  max=9.8 ms  Δavg vs baseline=-0.4 ms (-7%)
  no postprocessing    avg=5.6 ms  p95=7.1 ms  max=7.4 ms  Δavg vs baseline=-0.9 ms (-14%)
  no mirrors           avg=5.3 ms  p95=5.9 ms  max=6.1 ms  Δavg vs baseline=-1.2 ms (-19%)

CPU/GPU separation (baseline, same RENDER span):
  NOT MEASURED — EXT_disjoint_timer_query_webgl2 is unavailable in this WebGL2 context (unsupported by the GPU/driver/browser, or no query resolved during the baseline window).
  Every render time above is CPU-side wall-clock time only (performance.now() around the render call) — it may include driver/GPU wait and must not be read as isolated CPU cost.
