# Q67 — Hydrology continuity recon (2026-11-02)

**Status:** recon done (Opus, 2026-11-02). **Author decision Q68 (2026-11-02): option A** — see §6.6. Plan done (Q69): [world-terrain-058](../../plans/world-terrain-058-finite-continent-and-global-hydrology.md), slices queue Q71–Q80. No runtime code changed; the only new code is the diagnostic census tool.

**Author direction (2026-11-02, this session):** a global hydrology model is acceptable even if it changes the current architecture; a **large, random, finite world** is acceptable — "large" means the home settlement plus 4–6 settlement areas in almost every direction (walking one way meets 4–6 settlements) and at least one `XL` settlement; **no interim quick fixes** — implement the whole solution per plan. V2/V3 hydrology may be used as donors.

Trigger: author review of the home settlement (`_temp/osada-domowa-z-gory-01.jpg`, seed `415424794`, mark 1) — a narrow stream starts at the village and ends abruptly short of the bay. Also noted by the author: the minimap shows very even biome bands without any boundary noise (§8).

## 1. Evidence

Tool (new, read-only): `pnpm worldgen:rivers:census [--seeds=42,415424794] [--tiles=8] [--rings=5] [--json]` (`scripts/perf/census-rivers.ts`). It runs the production `computeRiverTileDiagnostics` over a 16 × 16 tile square (4.1 × 4.1 km, 16.8 km²) around the origin and classifies every chain ending; settlements from `settlementDefFor` over 5 rings. ~13 s compute per seed.

| Metric (16.8 km² per seed) | seed 42 | seed 415424794 |
| --- | ---: | ---: |
| Rendered chains | 1164 | 882 |
| Rendered chain length (tributary walks overlap, counted twice) | 98.0 km | 69.7 km |
| … of it **on the seabed** (ground at water level) | **65.4 km** | **35.4 km** |
| Chains ≥ 8 cells dropped because they end in a dry sink | 58 | 69 |
| … of them continuations (river **cut mid-course**) | 7 | 3 |
| Isolated chains dropped at a dry sink (all lengths) | 3364 | 3501 |
| Seam hand-offs continued by the neighbour tile | 209 | 135 |
| Seam breaks **on land** (visible) | **22** | **17** |
| … river class (max accumulation ≥ 50) | 16 | 12 |
| … neighbour fragment ends in a dry sink | 11 | 8 |
| … neighbour fragment is 1 cell, reaching water (rejected, < 2 points) | 7 | 5 |
| … neighbour has no head at all (window disagreement) | 4 | 3 |
| Seam breaks under water (invisible) | 34 | 14 |
| Isolated stream sources inside a settlement footprint / within 40 m of it | 29 / 38 | 21 / 47 |

Home stream, seed `415424794` (the author's mark 1): it is **continuous in the hydrology data** — head `(0, 48)` inside the home footprint (centre `(17, 24)`, R 48 m), tile `0,0` → seam hand-off OK → tile `0,-1` → reaches the sea at about `(70, −36)`. Mouth profile (chain points, metres relative to `waterLevel`):

| z | ground (raw floor) | ribbon water surface |
| ---: | ---: | ---: |
| −11 | +2.39 | +0.57 |
| −15 | +0.86 | +0.08 |
| −17 | +0.28 | **−0.07** |
| −24 | +0.51 | −0.16 |
| −29 | +0.94 | −0.24 |
| −34 | +0.23 | −0.76 |
| −36 | −0.07 (sea starts) | −1.02 |

For the last ~20 m before the bay the river surface lies **below sea level while the ground beside it is still dry**. 🟡 Most likely visual result: the ribbon sinks under the sea surface / shallow-water shading and the stream reads as ending ~20 m short of the bay. Needs a browser check (queue §2).

## 2. Failure classes and root causes

**C1 — Mouth sinks below sea level before the coast.** `canonicalWaterHeight = elevation − exposedBank(flow)` is applied all the way down; nothing ramps the river to its receiver level. Near a low coast the surface drops below `waterLevel` while the banks are still above it. V3 solved exactly this with an end ramp to the receiving level (`riverChains.ts`, `END_RAMP_M`: "so it does not stop on a step above the water"). This explains the author's mark 1. ✅ numbers, 🟡 visual.

**C2 — Rivers on the seabed.** D8 keeps routing and accumulating over the sea floor (`sampleFloorAt` below `waterLevel`), so 36–67 % of rendered chain length is underwater, plus ~2000 rejected underwater blips per seed. Invisible, but it costs tile compute, ribbon geometry, carving and channel segments for every query. The chain should end at the mouth.

**C3 — No inland lakes above sea level.** A sink counts as water (`OCEAN_OUTLET`) only when its floor is at or below `waterLevel`. A closed basin on land therefore cannot become a lake, and every river draining into it is **dropped entirely** (`invalid-receiver`). The bounded breach repair (≤ 1.5 m cut, ≤ 28 cells, per tile window) only opens shallow pits. Result: ~60–70 otherwise renderable streams per 17 km² never appear, some rivers are cut mid-course, and thousands of small sources vanish. This is the largest missing piece of the hydrology.

**C4 — Tile seams on land (17–22 per 17 km²).** Every 256 m tile decides classification, repair and chain rejection inside its own 1024 m window. The upstream tile renders up to its core edge without knowing what happens downstream. The downstream tile may then (a) reject its fragment at a dry sink (C3 again), (b) reject a 1-cell fragment that already reaches water (< `MIN_CONTINUATION_CHAIN_POINTS` = 2, an 8 m gap right at the mouth), or (c) see different accumulation/repair and have no head at all. These are inherent to window-local decisions; bigger halos only make them rarer.

**C5 — Stream sources inside or next to settlements.** Hydrology runs on the raw floor, independently of settlements. A head appears wherever accumulation crosses `stream = 15` cells (~1000 m²), and site search only keeps the settlement centre clear of water. So 50–70 heads per seed start inside or next to a footprint (home: inside on seed 42, 64 m from the centre on the home seed). Not a defect of the code, but it reads as unnatural (a stream "born" in the village). It needs an explicit rule in the new model (§6.4).

**Minor:** every tributary chain re-walks the main stem down to its terminal (overlapping ribbons and carving segments on the trunk). Not visible, but double work; a confluence-aware chain builder (V3: the branch with the longest upstream continues, the shorter one ends at the join) removes it.

## 3. Why the per-tile model cannot be fixed cleanly

All the failing decisions — dry-sink repair, lake vs no lake, chain rejection, classification at the threshold — depend on terrain outside one tile's window. An infinite world has no global outlet to flood from, so V1 cannot run the standard priority-flood that guarantees every cell drains to the sea or a lake. Patching (an end ramp, a seabed cut-off, larger halos, a downstream look-ahead) would fix C1/C2 and reduce C4, but not C3 (lakes need the whole basin and its spill point) and not the window disagreements. The author has ruled out quick fixes.

## 4. Donors: how V2 and V3 compute rivers

- **V2** (`../seedvale-v3/legacy/SeedVales/src/game/world/gen/hydrology.ts`, 146 lines): a finite 8192 m world on an 8 m grid; priority-flood from the border and ocean cells; steepest descent on the filled surface; accumulation; lakes = depressions deeper than 2.5 m, shallower pits filled; rivers above an accumulation threshold; carving into the grid.
- **V3** (`../seedvale-v3/src/game/world/gen/hydrology.ts` 486 lines, `world/rivers/riverChains.ts`, `riverCarve.ts`, `config/world.ts` `LAKE`): a port of V2 with a measured pit policy — **breach first** (graded cut ≤ 16 m / 64 cells, valley flanks at slope 0.5), **lake only when a pit has ≥ 500 cells** or cannot be breached, mountain tarns (≤ 300 cells, larger mountain breaches 50 m / 180 cells), terminal below-sea basins held at sea level. Chains end at the sea, a lake, a join or a dry end, with a mouth ramp to the receiver level and lake-fed sources; the river carve is applied at query time (no bed baked into the grid). About 2 s generation for the whole world; every tuning value is recorded with its measurement.

V3 is the closest donor, but per the Revival rules it is selective: V1 keeps its own terrain sampler, chunk/tile pipeline, river geometry and carving API.

## 5. Options

| | A — finite world + global hydrology (**recommended**) | B — infinite world + two-level hydrology | C — keep per-tile, patch |
| --- | --- | --- | --- |
| Idea | Bounded continent (8 × 8 km, open sea around it); one priority-flood over the whole world at 8 m, as in V3 | A coarse 32–64 m priority-flood in large overlapping regions (e.g. 8 km), seeded from sea cells; main channels burned into terrain; 256 m tiles refine tributaries | End ramp, seabed cut-off, larger halo, downstream look-ahead |
| Fixes C1–C5 | All, by construction (every cell drains to the sea or a lake) | Mostly; region borders keep a smaller seam class | C1, C2, part of C4; **not** C3 |
| New capability | Inland lakes, map/roads/locations get a finite domain | Inland lakes | None |
| Cost | Continent mask (all terrain changes); boot-time world pass (~seconds, cached) | Two hydrology layers plus region stitching — the most complex option | Low |
| Risk | World edge design; boot time | Region-border artefacts; complexity | Remains fragile |
| Precedent | V2, V3 | none in the series | — |

Recommendation: **A**. It is the only option that removes all five classes without a parallel system, it matches the author's size criterion (§6.1), and V1's map is already bounded to exactly this extent (`MAP_EXTENT_HALF = 4096`, `src/world/map/mapConfig.ts`). B is only worth it if an infinite world is a hard requirement.

## 6. Recommended design (option A) — outline for the plan

### 6.1 World size

The settlement grid pitch is 300 m (`SETTLEMENT_GRID_STEP`). Measured occupancy is ~82 % (99 settlements in 121 cells around the home seed). To meet 4–6 settlements walking straight, one needs ~5–7 cells: 1.5–2.1 km along an axis, 2.1–3 km diagonally (cells there are 424 m apart, but side cells come into view). Add 0.7–1 km of coast and open sea. That gives a land radius of ~2.5–3 km and a world of **8192 × 8192 m** (±4096). An "about 6 km" world also passes but leaves little margin, since mountains and water lower the occupancy. The land then holds on the order of 150–250 settlements.

`XL` weights are 2–15 % per settlement depending on terrain, so a world without an XL is statistically negligible. The plan should still add a deterministic guarantee (promote the best-scoring `LG` when no XL exists), optionally within a stated distance of home (question §6.5).

### 6.2 Pipeline

1. **Continent mask** over the current sampler: land around the home area, sea towards the border, with an irregular coastline driven by the existing continentalness. One coordinated change to `sampleRawTexel` (all terrain moves → epoch batch, §7).
2. **Global hydrology pass** (worker, once per seed): sample the floor on the 1025² grid (~1.05 M samples; the census measured ~3 µs per sample, so ~3–4 s single-threaded, split across the chunk worker pool); priority-flood from sea cells; pit policy (breach first, lake at a minimum area, tarns) adapted from V3; accumulation; confluence-aware chains ending at the sea, a lake or a join; mouth ramp; no seabed chains.
3. **Terrain correction layer**: breaches and filled pits become a compact height-delta grid that `sampleRawTexel` reads, so terrain, settlements, roads, the map and the carve all see the same conditioned surface (V3 mutates its grid; V1 samples analytically everywhere, so it needs a queryable layer instead).
4. **River tiles become a view**: `computeRiverTile(tile)` slices the global chains to the tile core, so its consumers (chunk carving, ribbons, map raster, water quality, location queries, the settlement river query) keep their API. Smoothing and meandering stay per chain.
5. **Lakes as water bodies**: a new water surface level per lake (today all water is `waterLevel`). This touches the heights clamp, rendering, water queries, swimming, fishing and drinking. It is the largest slice and needs its own plan section.
6. **Persistence of the pass**: worldgen cache namespace `hydrology` in IndexedDB (same pattern as other worldgen caches) plus the boot fixture for the reference seed (tools-020 pattern), so normal boots do not recompute it.

### 6.3 Performance

There is a new boot-time cost (seconds, then cached) and a memory cost (tens of MB transient in a worker; a few MB resident for chains, the lake mask and the correction grid). On the other side, per-tile hydrology (`computeHydrologyRegion` over 128² cells per tile) disappears from streaming, and seabed ribbons and carving disappear. Measure on WSL before enabling; keep the old path switchable until the A/B.

### 6.4 Open design points for the plan

- **Sources near settlements (C5):** streams may pass through a village (plots already avoid channels), but a visible source must not start inside the footprint plus a margin. The plan settles whether that is a spring threshold, trimming the visible head, or a site-score term.
- **World edge:** open sea out to ±4096 m; what stops the player (a current pushing back, an invisible wall at the border, or nothing because there is no sailing yet).
- **Per-seed variation:** ranges for continent size, shape and coastline roughness.
- **Lake rendering budget** and whether ponds below a size are simply filled (V3: `minCells` 500).

### 6.5 Questions for the author (also in queue §3)

1. World model: **A** (finite 8 × 8 km, recommended) · **B** (infinite, two-level) · **C** (patch only — ruled out on 2026-11-02, listed for completeness).
2. XL guarantee: (a) somewhere in the world · (b) within ~1.5 km of home (recommended, so the player can reach it early) · (c) no guarantee.
3. World edge: (a) open sea plus a gentle push-back current beyond the last coast (recommended) · (b) an invisible wall at ±4096 m · (c) decide later, no boundary until boats exist.

### 6.6 Author decisions — Q68 (2026-11-02)

1. **World model: A** — finite 8 × 8 km continent with global hydrology.
2. **Settlement sizes grow with distance from home** (an earlier rule, carried over from V2 `centres.ts`: home SM, the neighbour MD about a day's march by route, then LG — quoted in V3 `docs/research/2026-10-10--004--settlement-layout-brainstorm.md`). The intended sequence outward from home is **MD → LG → XL** or **MD → LG/XL**, so exploration and quests escalate. This includes the XL guarantee within reach of home (option b, ~1.5 km). The plan must state how the current per-cell weighted roll (`rollVillageSize`, `SIZE_WEIGHTS` in `src/settlement/families.ts`) becomes distance-aware without breaking local variety.
3. **World edge: (a) with (b) as backstop** — open sea with a gentle push-back current beyond the last coast, plus a hard boundary at ±4096 m.

## 7. Cache, epoch and ordering

- Everything terrain-derived moves: chunk tiles (`CHUNK_TILE_CACHE_VERSION` 17), settlement definitions, roads, cemeteries, map tiles, worldgen fixtures. Each namespace bumps in its own slice; a new `hydrology` namespace is added.
- `WORLDGEN_EPOCH` is already `1` for the open Revival batch (D3). If the batch is still open when this lands, it rides on epoch 1 with no second bump; otherwise it needs a new epoch. Follow the checklist in `src/persistence/worldgenEpoch.ts`.
- **Ordering:** after the author's decision, an Opus plan, then S slices, all **before Q60** (village-aware A\* and crossing records are measured on the final rivers and coastline). Q37/Q60–Q64 census baselines must be re-taken after this lands.

## 8. Minimap biome bands (author note, separate task)

The minimap raster gives every texel one flat class with hard thresholds (`classifyMapTexel` in `src/world/map/mapProjection.ts`):

- the shore is a fixed 2.4 m height band (`SHORE_BAND`) — the world's sand band already varies with noise (`sandBandAt`, `src/terrain/biomeColors.ts`), the map does not use it;
- "highland" is a single height contour (`HIGHLAND_ALTITUDE = 0.45`);
- desert, swamp, forest and meadow are thresholds on macro fields with 2000–2200 m scales and 3 octaves (`moistureRegionScale`, `continentScale`), so their borders are long, smooth curves.

🟡 Part of the effect may also exist in the world (the wide pale band around the home village); this needs a look in the browser. Proposed separate task: make the map classify like the terrain (`sandBandAt`, biome weights, narrow blended borders), and add medium-scale domain warp plus higher octaves to the biome borders. Do it **after** the continent mask, which changes coastlines and the height distribution anyway.
