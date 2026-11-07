# Implementation notes — world-terrain-063 geography-driven settlement variants

Plan: [world-terrain-063](../world-terrain-063-geography-driven-settlement-variants.md) · queue Q126 (V0), Q127 (V1–V3), Q175 (V1 impl), Q176 (V2 matrix).

## V0 — variant runner (Sonnet, 2026-11-05, Q126)

`pnpm worldgen:variants [--seeds] [--variants=22@1150,28@950] [--abca]` — one fresh process per variant × seed via `census-travel.ts --target= --spacing=`; tooling seam `setSettlementLayoutOverrides` (never called by the game). A→B→A verified on seed 42.

## Q127 recon (Opus, 2026-11-07) — the baseline already failed the connectivity guarantee

Before any variant: the current tree (`0ad00f27`, 22 @ 1150) had **5 / 2 routed road components** on seeds 42 / 415424794 (11 / 8 layout-adjacent pairs without a road). `census-travel` now classifies each unrouted pair (`cap` vs `routeFailed`) and `scripts/perf/diagnose-unrouted.ts` re-runs the A* with rivers removed:

- **All 19 were router failures, none the `maxNeighborRoads` cap, and all were `waterBlocked`** — no dry path inside the default search box even without rivers. Example (415424794, home → `4_-1` Lipowy Parów, the author route of Q116-c): a ~200 m sea inlet (floor below sea level, hydrology correction 0 = ocean-connected) crosses the chord; the A* box is the endpoints' bbox + 45 m, so the detour never fit. Q132's "the author's road no longer exists" has this cause (060/061 relief and coast changes opened the inlet; the router has not changed since Q97).
- **Fix landed** (`2a19cf4c`): a `road` that fails in the default box retries with 225 m, then 450 m margins (`ROAD_RETRY_MARGIN_STEPS`). First-box routes stay byte-identical (38 / 38 baseline edges); paths to minor locations keep one box. Road-route cache v27.
- **Cost** — A* time was dominated (57 % self time) by `riverHitsOnEdge` scanning every envelope segment per step. `9dabcb39` adds a grid index (`createRiverSegmentIndex`, identical hits, census JSON byte-identical): per-route max 1336 → 599 ms, default attempts 14.3 → 5.3 s per world (headless, 415424794). With retries the worst pair is 1.17 s, still below the previous worst single route. Routes are computed on the main thread on chunk-stream cache misses (then persisted in `road-routes`), so this is a first-visit cost of the same class as before, not a new one. Both commits are independently revertable; no FPS claim.

| Census (headless) | seed 42 before → after | seed 415424794 before → after |
| --- | --- | --- |
| routed / layout edges | 18 / 29 → 26 / 29 | 20 / 28 → 27 / 28 |
| routed components | 5 → **2** | 2 → **1** |
| route length p50 | 1511 → 1608 m | 1454 → 1553 m |
| ratio p50 / max | 1.10 / — → 1.12 / 1.91 | 1.05 / — → 1.05 / 1.79 |
| home → `4_-1` (author route) | — | unrouted → **2209 m, ratio 1.78** (detour round the inlet) |

**Remaining split on seed 42:** settlement `-6_11` sits on a **0.2 km² island** (router-resolution flood fill: home landmass 32 km²). No router change can reach it — the layout must not select it (V1 below). The last 415424794 unrouted pair (`-2_-7`–`-4_-2`) has an alternative path in the graph.

**Consequence for G5:** the author route now exists but is 67 % *longer* than the remembered 1320 m; −25…−40 % (≈ 790–990 m) needs a neighbour on the near side of the inlet, i.e. a layout answer, not a router one. Every V2 variant is measured on this pinned router revision (`2a19cf4c`, plan "router pin").

## V1 contract (Opus, 2026-11-07) — written before code, implementation = queue Q175 (S)

### 1. Data sources — no new realm dependency

The layout already requires identical installed geography in every realm (its `sampleHeight` is `sampleLandHeightAt`, which reads the installed hydrology correction and lake levels — review 031 F4). V1 reads **only that installed payload**; no analytic proxy, no second layout service, no river query:

- **Climate:** `terrainSamplers.sampleBiomeWeights` (062 B1: memoized per-realm `macroClimateOf` on the same `RawSampleParams`). All four production context builders already supply it (`worldBundle.ts`, `worldContext.ts`, `chunkManager.ts`, `worldKnowledgeScan.ts`). Contract: when `region.continentMask` is set and the sampler is absent while the suitability weight is not `none`, `computeSettlementLayout` **throws** — never a silent climate-less ranking in one realm.
- **Water and reserves:** add a required `hydrologyId: string` to `SettlementResolveContext` (and so to `SettlementLayoutInput` / `RoadNetworkContext`); every builder already holds it inside its `RawSampleParams`. Layout reads it through the hydrology owners: `isInWaterfallReserve` / `waterfallReservesIn` (`waterfallSites.ts`, 064 W1) and a new memoized per-hydrology **perennial-channel distance** query (coarse grid over installed chains, owner `worldHydrologyStore.ts` or a sibling like `waterfallSites.ts`; `WeakMap` per installed data). `worldHydrologyFor` already throws for a missing install; the unconditioned id gives "no channels" (tests, legacy worlds). Coast/lake access = ring probe of `sampleHeight` (≤ `waterLevel` at 60 / 120 m).

### 2. Feasibility filters (hard, before ranking)

1. **Mainland only — default ON, lands with Q175.** A candidate whose probe site is not land-connected to the home site's landmass is rejected: bounded 8-neighbour flood fill at 18 m on the router's walkable rule (`h > waterLevel + ROUTE_WATER_CLEARANCE`, export the constant rather than copying it) from the site; reaching **1.5 km²** of land = mainland, exhausting earlier = island. Only probed (accepted-distance) candidates pay it; budget ≤ 10 ms per candidate, ≤ 300 ms per layout — measure and record; stop if beyond. Output change: seed 42 replaces `-6_11`; seed 415424794 expected unchanged (verify).
2. **Waterfall reserves** (064 W1): reject when the promoted-size footprint rectangle around the probe site intersects `waterfallReservesIn`. Today 0 footprints intersect on both seeds (Q168), so this only guards variants.
3. **060 landform footprints** (crag, crater, lake island, spine summit — `landformDescriptorsOf`): reject when the site lies inside a descriptor footprint. **Pass corridors are not excluded** (they must stay routable).

Filters 2–3 are guards with the same default ON; both are expected to change nothing on the reference seeds — if either moves a reference-seed site, record it and keep it (it was a real conflict).

### 3. Suitability term (soft, weighted, default `none`)

`score = cheapScore (today) + W · (0.5 · climate + 0.5 · water)`, both terms 0..1 at the cell centre:

- `climate = 1 − (desert + tundra + snow + swamp weights)` from `sampleBiomeWeights` (temperate, moderately moist land scores 1; use the biome keys as the sampler names them).
- `water = 1` within 150 m of a perennial channel, coast or lake, linear to 0 at 400 m (the minimum of the two distances).
- Lowland slope stays the existing `cheapScore` slope term — not counted twice.

Type: `export type SettlementSuitabilityWeight = 'none' | 'moderate' | 'strong'` → `W = 0 / 0.4 / 0.8` (the seeded jitter is 0.6, so `strong` dominates ties but not the flatness term). `SettlementLayoutOverrides.suitability` carries it; the game default stays `none` until V4. With `none`, Q175 must reproduce today's selection except where filter 1 acts (test: seed 415424794 sites identical).

### 4. Tooling

- `census-travel --suitability=none|moderate|strong`; `settlement-variants` syntax `<target>@<spacing>[/<weight>]`, default weight `none`.
- Per variant, census adds (V2 needs them): **workload** — sum of households and residents over defs plus the size histogram (review 031 F7); **long-detour edges** — count with ratio > 1.5; **author route** — home → `4_-1` polyline/ratio when the pair exists, else the nearest home neighbour east of home with its id; **land cover outside belts** — forest / wetland / rock-alpine shares of land farther than `SAFETY_BELT_BY_SIZE` (`settlementFaunaHabitats.ts`, fauna-050) from any settlement and > 30 m from any road (🟡 corridor width).
- Isolation unchanged: one fresh process per variant; `--abca` must pass.

### 5. Done when (Q175)

Contract §1–§4 implemented with JSDoc; tests at the owners (filter 1 on a synthetic island, reserve/landform rejection, `none` = today's selection apart from filter 1, missing sampler throws); main / worker / tool layouts equal on seed 415424794 (one test or the census); settlement-definition + road-route + caves + cemeteries + `locations-coarse` cache bumps for filter 1 (output change); censuses before/after on both seeds in these notes; `docs/state/` settlement doc updated.

### 6. Stop if (Q175)

Filter 1 exceeds its time budget at 18 m and a coarser step would miss real channels; a realm cannot supply `hydrologyId` without a lifecycle change; filter 1 changes a site on seed 415424794 (reference world) — report before landing.

## V2 — matrix (queue Q176, S, after Q175)

Matrix per plan §Design V2 on the pinned router `2a19cf4c` + Q175: targets 22 / 25 / 28 × start spacing 1150 / 1050 / 950 × weight none / moderate / strong on seeds 42 and 415424794, plus the Q116-c extension (uniform 850 / 750 m with counts as land allows; check the 720 m floor) and 3 spot seeds for the shortlisted rows only. Cheap rejection first (selected < target, any quadrant < 70 % within 5 h, components > 1), then full metrics. One results table + JSON into this file's V2 section; previews (`continent-preview-png` + route overlay from `--routes-out`) for the 6 best rows into `docs/research/v1-revival/continent-previews/063-variants/`. Clustered variants (plan V2 (ii)) are **not** in Q176 — V3 decides whether the uniform rows leave a gap worth that design.
