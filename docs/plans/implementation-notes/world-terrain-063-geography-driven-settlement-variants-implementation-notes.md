# Implementation notes — world-terrain-063 geography-driven settlement variants

Plan: [world-terrain-063](../world-terrain-063-geography-driven-settlement-variants.md) · queue Q126 (V0), Q127 (V1–V3), Q186 (V1 impl), Q187 (V2 matrix).

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

## V1 contract (Opus, 2026-11-07) — written before code, implementation = queue Q186 (S)

### 1. Data sources — no new realm dependency

The layout already requires identical installed geography in every realm (its `sampleHeight` is `sampleLandHeightAt`, which reads the installed hydrology correction and lake levels — review 031 F4). V1 reads **only that installed payload**; no analytic proxy, no second layout service, no river query:

- **Climate:** `terrainSamplers.sampleBiomeWeights` (062 B1: memoized per-realm `macroClimateOf` on the same `RawSampleParams`). All four production context builders already supply it (`worldBundle.ts`, `worldContext.ts`, `chunkManager.ts`, `worldKnowledgeScan.ts`). Contract: when `region.continentMask` is set and the sampler is absent while the suitability weight is not `none`, `computeSettlementLayout` **throws** — never a silent climate-less ranking in one realm.
- **Water and reserves:** add a required `hydrologyId: string` to `SettlementResolveContext` (and so to `SettlementLayoutInput` / `RoadNetworkContext`); every builder already holds it inside its `RawSampleParams`. Layout reads it through the hydrology owners: `isInWaterfallReserve` / `waterfallReservesIn` (`waterfallSites.ts`, 064 W1) and a new memoized per-hydrology **perennial-channel distance** query (coarse grid over installed chains, owner `worldHydrologyStore.ts` or a sibling like `waterfallSites.ts`; `WeakMap` per installed data). `worldHydrologyFor` already throws for a missing install; the unconditioned id gives "no channels" (tests, legacy worlds). Coast/lake access = ring probe of `sampleHeight` (≤ `waterLevel` at 60 / 120 m).

### 2. Feasibility filters (hard, before ranking)

1. **Mainland only — default ON, lands with Q186.** A candidate whose probe site is not land-connected to the home site's landmass is rejected: bounded 8-neighbour flood fill at 18 m on the router's walkable rule (`h > waterLevel + ROUTE_WATER_CLEARANCE`, export the constant rather than copying it) from the site; reaching **1.5 km²** of land = mainland, exhausting earlier = island. Only probed (accepted-distance) candidates pay it; budget ≤ 10 ms per candidate, ≤ 300 ms per layout — measure and record; stop if beyond. Output change: seed 42 replaces `-6_11`; seed 415424794 expected unchanged (verify).
2. **Waterfall reserves** (064 W1): reject when the promoted-size footprint rectangle around the probe site intersects `waterfallReservesIn`. Today 0 footprints intersect on both seeds (Q168), so this only guards variants.
3. **060 landform footprints** (crag, crater, lake island, spine summit — `landformDescriptorsOf`): reject when the site lies inside a descriptor footprint. **Pass corridors are not excluded** (they must stay routable).

Filters 2–3 are guards with the same default ON; both are expected to change nothing on the reference seeds — if either moves a reference-seed site, record it and keep it (it was a real conflict).

### 3. Suitability term (soft, weighted, default `none`)

`score = cheapScore (today) + W · (0.5 · climate + 0.5 · water)`, both terms 0..1 at the cell centre:

- `climate = 1 − (desert + tundra + snow + swamp weights)` from `sampleBiomeWeights` (temperate, moderately moist land scores 1; use the biome keys as the sampler names them).
- `water = 1` within 150 m of a perennial channel, coast or lake, linear to 0 at 400 m (the minimum of the two distances).
- Lowland slope stays the existing `cheapScore` slope term — not counted twice.

Type: `export type SettlementSuitabilityWeight = 'none' | 'moderate' | 'strong'` → `W = 0 / 0.4 / 0.8` (the seeded jitter is 0.6, so `strong` dominates ties but not the flatness term). `SettlementLayoutOverrides.suitability` carries it; the game default stays `none` until V4. With `none`, Q186 must reproduce today's selection except where filter 1 acts (test: seed 415424794 sites identical).

### 4. Tooling

- `census-travel --suitability=none|moderate|strong`; `settlement-variants` syntax `<target>@<spacing>[/<weight>]`, default weight `none`.
- Per variant, census adds (V2 needs them): **workload** — sum of households and residents over defs plus the size histogram (review 031 F7); **long-detour edges** — count with ratio > 1.5; **author route** — home → `4_-1` polyline/ratio when the pair exists, else the nearest home neighbour east of home with its id; **land cover outside belts** — forest / wetland / rock-alpine shares of land farther than `SAFETY_BELT_BY_SIZE` (`settlementFaunaHabitats.ts`, fauna-050) from any settlement and > 30 m from any road (🟡 corridor width).
- Isolation unchanged: one fresh process per variant; `--abca` must pass.

### 5. Done when (Q186)

Contract §1–§4 implemented with JSDoc; tests at the owners (filter 1 on a synthetic island, reserve/landform rejection, `none` = today's selection apart from filter 1, missing sampler throws); main / worker / tool layouts equal on seed 415424794 (one test or the census); settlement-definition + road-route + caves + cemeteries + `locations-coarse` cache bumps for filter 1 (output change); censuses before/after on both seeds in these notes; `docs/state/` settlement doc updated.

### 6. Stop if (Q186)

Filter 1 exceeds its time budget at 18 m and a coarser step would miss real channels; a realm cannot supply `hydrologyId` without a lifecycle change; filter 1 changes a site on seed 415424794 (reference world) — report before landing.

## V1 implementation (Sonnet, 2026-11-07, Q186)

Implemented per the V1 contract; deviations and measurements:

- **Context plumbing.** `SettlementResolveContext` / `RoadNetworkContext` / `SettlementLayoutInput` gain required `hydrologyId` **and** `landformIndex`. The contract names only `hydrologyId`, but the 060 footprints need the landform index, which the layout cannot rebuild from the id; both come from one constructor, `settlementWorldGeography(rawParams)` (`settlementPlanCache.ts`), used by `worldBundle`, `chunkManager`, `worldKnowledgeScan` (so workers and census tools) and `SettlementsManager` (new required positional `worldGeography` after `region`; its two lifecycle tests shift their `args[]` indices by one).
- **Climate term** uses `1 − (desert + swamp)`: `BiomeWeights` has only desert / swamp / forest (no tundra / snow weights, unlike the contract text). Missing sampler on a `continentMask` world throws (test).
- **Channel distance** `perennialChannelDistance(hydrologyId, x, z, maxM)` lives in `worldHydrologyStore.ts` (128 m grid over installed chain segments, `WeakMap` per install; every installed chain is perennial).
- **Router constant** `ROUTE_WATER_CLEARANCE` moved to `settlement/routeConstants.ts` (no import cycle layout ↔ roadNetwork); the mainland flood walks the same rule.
- **Filter order:** spacing first, then landform → waterfall → mainland, once per cell. Cache namespaces bumped: settlement-definition v39, road-route v28, caves v20, abandoned-cemetery v24, locations-coarse v18. `WORLDGEN_EPOCH` stays 1 (this Revival batch already bumped it).
- **Tooling:** `census-travel --suitability=`, `settlement-variants` `<target>@<spacing>[/<weight>]`, census columns `workload`, `longDetourEdges`, `authorTarget`, `landCoverOutsideBeltsPct` (land farther than footprint + `safetyBeltWidth(size, character, 0.35)` from any settlement and > 30 m from any routed road; forest/wetland = biome weight ≥ 0.5, rock-alpine = ridge > 0.5 or altitude > 0.66 — 🟡 census-only thresholds).

**Output change (`none`, headless, router `2a19cf4c`):**

| | seed 42 | seed 415424794 |
| --- | --- | --- |
| sites replaced | `-6_11` (0.2 km² island) → `-4_8` | `2_-8` → `2_-7` (**waterfall-reserve guard**, site at (639, −2418); filter 1 changes nothing here) |
| routed / layout edges | 26 / 28 | 27 / 28 |
| routed components | 2 → **1** | 1 |
| households / residents | 88 / 164 | 88 / 165 |
| long-detour edges (ratio > 1.5) | 7 | 2 |
| land cover outside belts (forest · wetland · rock-alpine) | 77 · 2.4 · 14.5 % | 68.8 · 3.3 · 13.7 % |
| author target | `4_-3` east neighbour, ratio 1.01 | `4_-1` exact, 2209 m, ratio 1.78 |

The seed 415424794 change comes from filter 2 (contract §2: "record it and keep it"), not from the mainland filter, so the V1 stop-if does not fire; the author should know the reference world's `2_-8` village moved one lattice cell.

**Cost (headless, same machine as the baseline layout ≈ 1.2 s):** filters add ≈ 340–370 ms per layout (22 floods, avg ≈ 13 ms, max ≈ 28 ms, plus a one-time ≈ 60 ms waterfall index) against the contract budget of ≤ 10 ms per candidate / ≤ 300 ms per layout. The flood is dominated by `sampleHeight` (≈ 6 µs per call; 1.5 km² at 18 m = 4630 cells), so the overshoot is irreducible at 18 m without a coarser step. Running the flood after the spacing check (not on every probed cell) already removed the avoidable part. A 36 m step would meet the budget but could bridge < 36 m straits — left to the author / Opus (§3).

**Not verified:** main / worker / tool layout equality was not exercised with a real worker; all three use `settlementWorldGeography` + the same `computeSettlementLayout`, and the census (tool) and unit tests (synthetic) agree. No browser check.

## V2 — matrix (queue Q187, S, after Q186)

Matrix per plan §Design V2 on the pinned router `2a19cf4c` + Q186: targets 22 / 25 / 28 × start spacing 1150 / 1050 / 950 × weight none / moderate / strong on seeds 42 and 415424794, plus the Q116-c extension (uniform 850 / 750 m with counts as land allows; check the 720 m floor) and 3 spot seeds for the shortlisted rows only. Cheap rejection first (selected < target, any quadrant < 70 % within 5 h, components > 1), then full metrics. One results table + JSON into this file's V2 section; previews (`continent-preview-png` + route overlay from `--routes-out`) for the 6 best rows into `docs/research/v1-revival/continent-previews/063-variants/`. Clustered variants (plan V2 (ii)) are **not** in Q187 — V3 decides whether the uniform rows leave a gap worth that design.

## V2 results (Sonnet, 2026-11-07, Q187)

**Pinned router:** `2a19cf4c` + Q186 filters (headless, `pnpm worldgen:variants`, one fresh process per variant × seed). Raw data: [`v2-results.json`](../../research/v1-revival/continent-previews/063-variants/v2-results.json). Previews (hillshade + routes + sites, seeds 42 / 415424794; rows 22@1150/none · 25@950/none · 28@1050/none · 28@950/none · 35@850/none · 25@1150/strong): [`continent-previews/063-variants/`](../../research/v1-revival/continent-previews/063-variants/). Tooling added: `continent-preview-png.ts --variant=<target>@<spacing>[/<weight>]`.

**Cheap rejection:** no row failed on `selected < target` or any quadrant < 70 % within 5 h (min 74.9 %); only **components > 1** occurs: seed 42 `28@*/strong` (3 cells, 2 components); seed 415424794 `25@1150/*` and `28@1150/*` (2). All other 27-row cells have 1 component on both seeds. Rows below show `seed 42 / seed 415424794`; `p50m`/`p90m` = routed-edge polyline length (m), `long` = edges with route ratio > 1.5, `author` = nearest-to-author-route edge ratio (🟡 target lattice changes with variant, so not comparable across rows), `wild` = wilderness > 5 h %, `minQ` = worst quadrant within 5 h %.

| variant | selected | comps | p50m | p90m | long | households | author edge | wild5h % | minQ % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 22@1150/none | 22/22 | 1/1 | 1601/1578 | 2948/2209 | 7/2 | 88/88 | 4_-3×1.01 / 4_-1×1.78 | 11.1/13.2 | 81.4/80.4 |
| 22@1150/moderate | 22/22 | 1/1 | 1673/1624 | 2948/2209 | 7/2 | 94/95 | 4_-3×1.01 / 4_-1×1.78 | 11.3/15.9 | 81.4/78.7 |
| 22@1150/strong | 22/22 | 1/1 | 1625/1553 | 2948/2354 | 6/2 | 99/91 | 4_-3×1.01 / 4_-1×1.78 | 11.1/15.1 | 81.4/78.7 |
| 22@1050/none | 22/22 | 1/1 | 1608/1506 | 2948/2045 | 6/1 | 89/94 | 4_-3×1.01 / 4_-1×1.13 | 11.2/14.9 | 81.4/76.4 |
| 22@1050/moderate | 22/22 | 1/1 | 1627/1493 | 2436/1780 | 5/1 | 92/98 | 4_-3×1.01 / 4_-1×1.13 | 10.9/16.1 | 86.6/76.4 |
| 22@1050/strong | 22/22 | 1/1 | 1627/1533 | 2436/2354 | 5/1 | 93/99 | 4_-3×1.01 / 4_-1×1.13 | 11/16.3 | 86.2/76.4 |
| 22@950/none | 22/22 | 1/1 | 1601/1577 | 2436/2128 | 5/2 | 93/96 | 4_-3×1.01 / 0_4×0.99 | 11.6/14.2 | 84.8/74.9 |
| 22@950/moderate | 22/22 | 1/1 | 1601/1624 | 2149/2362 | 4/3 | 98/96 | 4_-3×1.01 / 0_4×0.98 | 11.9/15.7 | 83.1/81.3 |
| 22@950/strong | 22/22 | 1/1 | 1519/1533 | 2149/2362 | 4/3 | 101/96 | 4_-3×1.01 / 4_-1×1.13 | 12.1/15.9 | 82.9/76.6 |
| 25@1150/none | 25/25 | 1/2 | 1506/1553 | 2326/2209 | 5/2 | 95/98 | 4_-3×1.01 / 4_-1×1.78 | 7/9.1 | 89.7/81.9 |
| 25@1150/moderate | 25/25 | 1/2 | 1549/1553 | 2326/2209 | 5/2 | 101/102 | 4_-3×1.01 / 4_-1×1.78 | 6.9/9.6 | 91/81.9 |
| 25@1150/strong | 25/25 | 1/2 | 1519/1553 | 2166/2209 | 4/2 | 104/102 | 4_-3×1.01 / 4_-1×1.78 | 6.6/9.6 | 91.6/81.9 |
| 25@1050/none | 25/25 | 1/1 | 1506/1563 | 2326/2415 | 4/4 | 92/102 | 4_-3×1.01 / 4_-1×1.13 | 7/9.8 | 89.7/86.6 |
| 25@1050/moderate | 25/25 | 1/1 | 1549/1506 | 2326/2461 | 5/3 | 101/108 | 4_-3×1.01 / 4_-1×1.13 | 6.9/10.3 | 91/78.6 |
| 25@1050/strong | 25/25 | 1/1 | 1519/1506 | 2166/2461 | 4/3 | 104/108 | 4_-3×1.01 / 4_-1×1.13 | 6.6/10.3 | 91.6/78.6 |
| 25@950/none | 25/25 | 1/1 | 1437/1577 | 2131/2362 | 4/5 | 105/105 | 4_-3×1.01 / 4_-1×1.13 | 8.3/8.8 | 84.8/83.3 |
| 25@950/moderate | 25/25 | 1/1 | 1506/1493 | 2149/2128 | 4/3 | 109/107 | 4_-3×1.01 / 4_-1×1.13 | 8.2/9.7 | 84.8/81.3 |
| 25@950/strong | 25/25 | 1/1 | 1502/1533 | 2114/2128 | 4/3 | 115/108 | 4_-3×1.01 / 4_-1×1.13 | 9/9.9 | 87.8/81.3 |
| 28@1150/none | 28/28 | 1/2 | 1437/1454 | 2022/2048 | 5/3 | 104/110 | 4_-3×1.01 / 4_-1×1.78 | 4/4.1 | 95.1/93.5 |
| 28@1150/moderate | 28/28 | 1/2 | 1505/1512 | 2081/2048 | 5/3 | 110/109 | 4_-3×1.01 / 4_-1×1.78 | 3.8/4.9 | 94.5/93.5 |
| 28@1150/strong | 28/28 | 2/2 | 1506/1512 | 2081/2048 | 4/3 | 111/109 | 4_-3×1.01 / 4_-1×1.78 | 4.1/4.9 | 94.5/93.5 |
| 28@1050/none | 28/28 | 1/1 | 1437/1512 | 2081/2292 | 4/5 | 101/113 | 4_-3×1.01 / 4_-1×1.13 | 4/4.2 | 95.1/93.6 |
| 28@1050/moderate | 28/28 | 1/1 | 1505/1482 | 2081/2307 | 5/4 | 110/116 | 4_-3×1.01 / 4_-1×1.13 | 3.8/5.9 | 94.5/91.2 |
| 28@1050/strong | 28/28 | 2/1 | 1506/1482 | 2081/2307 | 4/4 | 111/116 | 4_-3×1.01 / 4_-1×1.13 | 4.1/5.9 | 94.5/91.2 |
| 28@950/none | 28/28 | 1/1 | 1437/1533 | 2005/2362 | 3/6 | 113/117 | 4_-3×1.01 / 4_-1×1.13 | 4.8/4.1 | 94.4/94.8 |
| 28@950/moderate | 28/28 | 1/1 | 1455/1533 | 2005/2362 | 3/5 | 117/119 | 4_-3×1.01 / 4_-1×1.13 | 4.6/6.5 | 94.4/84.9 |
| 28@950/strong | 28/28 | 2/1 | 1454/1533 | 2005/2362 | 3/5 | 120/119 | 4_-3×1.01 / 4_-1×1.13 | 4.9/6.5 | 94.4/84.9 |

**Uniform spacing (Q116-c, weight none; the 720 m floor `SETTLEMENT_MIN_DISTANCE_M` is reachable, never the limiter):**

| variant | seed 42: sel · comps · p50m · p90m · hh · long · wild5h · minQ | seed 415424794 |
| --- | --- | --- |
| 35@850 | 35 · 1 · 1219 · 1853 · 148 · 3 · 2.6 · 95.8 | 35 · 1 · 1354 · 2473 · 154 · 9 · 3.1 · 94.5 |
| 45@850 | **43** · 1 · 1096 · 1770 · 176 · 3 · 1.0 · 97.7 | **40** · **2** · 1162 · 2278 · 177 · 7 · 1.2 · 97.2 |
| 45@750 / 60@750 | **43** (identical) · 1 · 1147 · 1770 · 179 · 3 | **40** · **2** · 1232 · 1826 · 177 · 9 |
| 60@850/moderate | 42 · 1 · 1096 · 1837 · 176 · 3 | 40 · 2 · 1162 · 2278 · 183 · 7 |

Land runs out at **≈ 43 sites (seed 42) / 40 (seed 415424794)** at the 720 m floor: targets above that change nothing. Suitability weight barely moves anything at these densities.

**Spot seeds (shortlist rows only, weight none; sel · comps · p50m · p90m · long · wild5h · minQ):**

| variant | seed 1 | seed 7 | seed 1234 |
| --- | --- | --- | --- |
| 22@1150 | 22·1·1779·2875·5·12.2·82.9 | 22·**4**·1740·2263·1·14.5·79.5 | 22·**3**·1588·2027·2·15.8·76.0 |
| 25@950 | 25·1·1387·2229·1·13.1·82.4 | 25·**3**·1482·2264·1·10.5·80.8 | 25·**2**·1519·1909·3·7.7·84.4 |
| 28@1050 | 28·**2**·1376·2023·2·7.3·86.3 | 28·**3**·1382·2264·2·5.9·90.4 | 28·1·1406·1717·2·3.4·95.6 |
| 28@950 | 28·1·1304·2049·1·6.8·90.3 | 28·**2**·1439·2263·1·6.2·85.9 | 28·**2**·1447·1735·4·4.0·91.3 |
| 35@850 | 35·1·1122·2072·2·4.2·94.2 | 35·**2**·1262·1887·3·3.6·87.4 | 35·1·1273·1779·4·1.4·97.7 |

**Findings (for V3, no recommendation made here):**
1. Priority 1 (one routed component) holds on **both** reference seeds for 22@\*, 25@1050/950 and 28@1050/950 (except the strong-weight cells above); it fails on the spot seeds even for the **current 22@1150** (seeds 7 and 1234: 4 and 3 components) — a pre-existing property of the router/land, not of the denser variants. Denser rows do not systematically worsen connectivity.
2. Journeys: p50 route 1601 → 1437 m (28@950, −10 %), 1219 m (35@850, −24 %); p90 2948 → 2005 m on seed 42. Even 43 sites (≈ 1100 m p50) is only ≈ −30 %. The Q116-c −25…−40 % band is reachable only with ≥ 35 sites (uniform), i.e. ≈ +60–95 % households (88 → 148–179).
3. Workload scales near-linearly: households 88 (22) → 104–120 (28) → 148–154 (35) → 176–179 (43); no simulation reduction was assumed. Timing/offscreen cost not measured here (V3 / author).
4. Wilderness > 5 h falls 11–13 % → 4–8 % (28) → ~3 % (35) → ~1 % (43); quadrant coverage never goes below 74.9 %.
5. Weight `moderate`/`strong` changes 1–5 % of metrics and sometimes raises households or adds a component (28@\*/strong); weight `none` stays the simplest baseline.
6. Cost caveat from Q186 (flood ≈ 340–370 ms/layout, §3 Q186-a) applies to every row.

**A→B→A:** `pnpm worldgen:variants --seeds=42,415424794 --variants=22@1150/none,28@950/none --abca` passed (exit 0, A again identical on both seeds).

**Not done / caveats:** clustered variants (plan V2 (ii)) intentionally out of scope; timed author walk, simulation-workload timing and browser look not performed; previews are static PNGs, unreviewed by the author (→ queue §2). All numbers headless.

## V3 shortlist (Opus, 2026-11-07, Q127)

[Shortlist note](../../research/v1-revival/2026-11-07--063-v3-settlement-variant-shortlist.md): A 22@1050 · B 25@950 (recommended) · C 35@850, weight `none`; author question queue §3 Q127-G5. Re-census found: the author route improves to 1400 m on every row with start spacing ≤ 1050 although home and `4_-1` keep their positions (different home access point, route stays north of the inlet — cause not isolated 🟡, V4 confirms by walk); land cover outside belts is practically density-independent; spot seeds 7 / 1234 fail connectivity for every row including today → Q188.

## Q188 — spot-seed road connectivity (Opus, 2026-11-07, recon only, no code change)

Seeds 7 / 1234 at today's 22@1150 have 4 / 3 routed components (V2 spot seeds). Re-ran every unrouted layout pair (`diagnose-unrouted.ts` + a scratch extension: 18 m landmass labels on the router's walkable rule, `findRoute` with `marginSteps` for 450 / 900 / 1800 m boxes, timed). All 12 pairs are `waterBlocked` in the default box; entrances are dry (+3…+9.5 m, 8/8 dry neighbours).

| class | pairs | what it is | effect of a fix |
| --- | --- | --- | --- |
| **separate landmass** | 2 (seed 7: `-11_-1`, `-12_-5`, both SM) | a **1.9 km² island** — passes the V1 mainland test because it only asks "≥ 1.5 km² of connected land", not "connected to the home landmass" | rejecting it in the layout removes seed 7's 2-site component |
| **inlet detour > 450 m** | 7 (seed 7: 4, seed 1234: 3) | same landmass; a dry/ford route exists only with a 900 m box: **3.1–5.0 km roads for 1.2–1.9 km chords (ratio 2–3.8)**, A* **0.7–2.5 s** each (main thread on a cache miss) | a 900 m retry rung would merge seed 1234 into 1 component and seed 7 into 19 + 2 (island) + 1 |
| **unresolved ≤ 1800 m** | 3 (`-5_-2`–`-7_-8`, `-2_12`–`-7_10`, `-5_5`–`1_5`) | same landmass at 18 m, no route in an 1800 m box (search exhausts in 0.2–0.5 s — the start is boxed in by water / rejected crossings) | seed 7 `-7_-8` (LG) stays isolated even with the 900 m rung |

**Recommendation (→ queue §3 Q188-a):** (1) amend the V1 mainland test to "land-connected to the **home** landmass" (keep the per-cell verdict cache; mark cells reached from home as mainland), landing together with V4 in the same worldgen-output batch, after checking the reference seeds stay unchanged; (2) **do not** add a 900 m router rung — absurd 3–5 km roads and seconds of main-thread A*; (3) inlet-separated pairs on non-reference seeds become an **explained exception** (plan §Done when allows it) until a layout-side answer exists (e.g. prefer a lattice neighbour on the same shore). Reference seeds 42 / 415424794 are unaffected by (2)–(3).

## Author decisions G5 / Q188-a / Q186-a (2026-11-07) and V4 pre-check (Opus)

### Decisions (✅ author, 2026-11-07)

- **Q127-G5 → variant B:** 25 settlements, start spacing 950 m, suitability weight `none`. Priority **balance** — a living world with reachable settlements while keeping exploration and wild land. The neighbour-median drop of **−8…−12 %** is accepted in place of the earlier −25…−40 % target (plan §Goal / §V3 priority 2 are superseded by this). **Lipowy Parów need not keep its location or name.** Hard constraint: no loss of correctness of quests, NPCs, relationships and identity of existing entities.
- **Q188-a → (a):** remove incidental settlements on islands detached from the home landmass; **no multi-kilometre road detours** (no 900 m / 1800 m router rung); geographically justified exceptions may stay but must be **explicitly classified**; no additional transport systems now.
- **Q186-a → delegated** to the agent: choose the island-detection technique; keep correctness and determinism; avoid unnecessary worldgen cost. Choice below (§Q186-a).

### Q186-a — chosen technique (Opus)

Rejected: **(b) 36 m step** (can bridge < 36 m straits → wrong verdicts, violates correctness); **(c) 1.0 km² threshold** (weaker guard, and an area threshold cannot express Q188-a "connected to the home landmass" — the 1.9 km² island on seed 7 passes any threshold below it). A global landmass raster is not available cheaply: the hydrology install keeps only sparse corrections, not the raw floor grid, and a whole-continent flood at 18 m costs seconds.

**Chosen: directed home-connectivity search at 18 m** (replaces the bounded-area flood in `createMainlandTest`, same owner `settlementLayout.ts`, same walkable rule `h > waterLevel + ROUTE_WATER_CLEARANCE`):

1. A candidate site is feasible iff an 8-neighbour **best-first search** (key = straight distance to the target, ties by cell key) from its 18 m cell reaches a cell already **proven home-connected**. Proven set = the home cell plus every cell on a successful search's closed set; target = the nearest accepted site (distance, then layout index) — every accepted site is proven, so targets are ~1 km away, not across the continent.
2. **Exhausted** search (open set empty) → detached landmass of any size → reject, cache those cells as `false` (a fact, independent of order).
3. **Cap** `MAINLAND_SEARCH_MAX_CELLS` (🟡 start ≈ 4 × today's 4630 cells) reached without proof → reject as `unproven`, **do not** cache cells as `false`; count it in the census.
4. Determinism: candidate order, target choice and tie-breaks are deterministic; `true`/`false` caches are geographic facts; only `unproven` depends on the (deterministic) accepted-site order. Same code in every realm (main / worker / tools) via `settlementWorldGeography` — no new realm dependency.
5. Cost expectation 🟡: on open land the search runs roughly along the chord (hundreds of cells, ≈ 1–5 ms) instead of always filling 1.5 km² (≈ 13 ms); islands cost their own area once. V4 measures it; **budget stays ≤ 300 ms per layout** (contract §2.1) and must not exceed today's ≈ 340–370 ms. The layout is recomputed in every realm on every boot (`settlementLayoutFor` memo, no worldgen-cache hydration), so this cost is boot cost.
6. Waterfall-reserve guard (Q186-a part 2): **keep the promoted-XL rectangle** — a site may later be promoted (progression), and a narrower real-size test would let a promoted village overlap a reserve. The seed 415424794 `2_-8` → `2_-7` move stands (under variant B the reference layout changes anyway).

### Q188-a — exception classes (census, explicit)

`census-travel` / `settlement-variants` report every routed component other than home's with a class per unrouted layout pair: **`separate-landmass`** (must be **0** after the new filter — otherwise stop), **`inlet-detour`** (same landmass, route only in a > 450 m box — explained exception, stays; not routed by a wider box), **`unresolved`** (same landmass, no route ≤ 1800 m — explained exception, listed with ids), plus **`unproven`** rejections from §Q186-a 3. Reference seeds 42 / 415424794: expected 0 in every class (verify); spot seeds 7 / 1234 listed in the V4 notes. No router change, no transport system.

### V4 pre-check — compatibility with existing contracts and performance (Opus, 2026-11-07)

| Contract | Verdict | Evidence / what V4 must do |
| --- | --- | --- |
| Epoch (D3, persistence-008) | ✅ compatible | Batch epoch already 1 (`worldgenEpoch.ts`); V4 + the Q188-a filter are one worldgen-output slice of the same batch → **no epoch bump**. Epoch-1 intermediate saves are disposable (roadmap cross-plan rule F6). |
| Cache namespaces | ✅ required | Bump per output-changing slice: settlement-definition 39→40, road-route 28→29, caves 20→21, abandoned-cemetery 24→25, locations-coarse 18→19 (verify current numbers before bumping). |
| Quests / NPC / relationship identity | ✅ compatible, verify | `src/` has no hard-coded settlement id or name (grep `'<gx>_<gz>'` / `Lipowy` → none outside name morphology); quest casts bind settlements dynamically (`huntersBrotherhoodIntroduction.ts` home + second settlement, `dungeonBanditTreasure.ts` / `lostTreasureExpedition.ts` sorted neighbour ids) and persist ids, which the epoch covers. V4 **tests/census**: both seeds cast every procedural quest (home + ≥ 1 neighbour with eligible NPCs), progression XL/LG/MD + hop-level placement (left 🟡 in V3), and main / worker / cold / hydrated settlement defs + NPC ids equal (plan §Done when). |
| Lipowy Parów / author route | ✅ relaxed by author | Under B `4_-1` keeps its position on 415424794 (V3); name may change (local-uniqueness rule). Author route = home → `4_-1`, else the census `authorTarget` fallback; timed walk stays in V4 (§2). |
| Simulation scope ("no reduced simulation") | ✅ compatible | B adds sites (+19 % households, ≈ 104–105 vs 88); nothing per settlement is reduced. |
| Performance (D4 lifted, tools-026 D7 "not slower beyond noise") | ⚠️ must be measured in V4 | B is **workload-affecting**: V4 records the D7 metrics (layout + road time, cold/warm boot, households / NPCs / active transport, representative offscreen/time-skip) vs the D7 baseline and runs a **WSL A/B** (boot, `stream`, `settlement-heavy`) before calling V4 done (earlier than the plan's post-Q64 A/B, because this slice changes workload); constants stay revertable in one commit; Windows confirmation → queue §4. A regression beyond noise is **not** solved by reducing simulation — stop and ask (§3). |
| Router pin / Q61–Q63 | ✅ unchanged | Q61–Q63 run after V4; if they change reachability/journey rankings, the shortlist is re-run (plan §Router pin). |
