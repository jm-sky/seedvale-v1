# Q106 — world-location catalog lakes vs real water (recon)

**Date:** 2026-11-04 · **Author:** Claude Opus 5.5 · **Status:** recon done; author 2026-11-04 answered Q106-a **(a) fix now** → implementation row **Q109** ready (step 5, map coast colour, not yet decided).
**Source:** [review 030 F2](../../reviews/2026-11-03--030--geography-hydrology-architecture-review.md#findings). Legend: ✅ checked in code / by census · 🟡 inference.

## 1. What the catalog does today (✅ code)

- `worldLocationCatalog.classifyCoarseCell` (`src/world/locations/worldLocationCatalog.ts`) classifies each 48 m coarse cell (`LOCATION_SCAN_STEP`): `isFloorBelowSea(floorH)` → wet; wet + `isOceanMix(continentalness)` → `CELL_NONE` (ocean), else `CELL_WATER`. Land cells → ridge test → `CELL_MOUNTAIN` or `CELL_NONE`.
- `floodFillLakes` flood-fills 4-connected `CELL_WATER` cells; a component of ≥ `MIN_LAKE_CELLS` (3) becomes a `lake` location with id `lake:<cx>,<cz>` (centroid cell) and a seeded name.
- Each `sampleFloorAt` / `sampleContinentalnessAt` / `sampleMountainRidgeAt` / `sampleHeightAt` call runs the **full** `sampleRawTexel`, so a cell costs 1–3 full texel evaluations; `sampleRawTexelAt` returns all of them at once.

## 2. Census (✅ `pnpm worldgen:lakes:census`, whole ±6144 m continent)

| seed | lake locations today | of which touch the open sea | pure inland | with the map rule (below sea **or** lake surface) | of which touch the sea | pure inland |
| --- | --- | --- | --- | --- | --- | --- |
| 42 | 146 | **139** | 7 | 189 | 139 | **50** (43 contain hydrology lake cells) |
| 415424794 | 147 | **135** | 12 | 190 | 135 | **55** (43 contain hydrology lake cells) |

Near home (seed 415424794, ≤ 1.5 km): today 22 lake locations, e.g. (−168, −72), (264, −208), (210, −414) — all coastal sea; the only inland one is (401, −38). With the map rule and sea rejection, 10 inland bodies remain within 1.5 km (nearest (401, −38), (−328, −56), (−450, −66)).

**Finding (✅):** the problem is larger than F2 stated. Besides missing the above-sea lakes, ~95 % of today's catalog lakes are **pieces of coastal sea**: the continentalness ocean gate does not cover the shallow coastal band of the finite continent (058), so below-sea cells there pass as "inland water". The map's `classifyMapTexel` uses the same gate, so those texels are painted as `inland_water` there too (🟡 visible as lake-coloured coast — not browser-checked).

## 3. Persistence and consumers (✅ code)

- **Coarse tiles** — IndexedDB namespace `locations-coarse` (`locationsCoarseCache.ts`, v3), tile state bytes per cell. A new cell state or rule = version bump 3 → 4 (plain cache miss, never migrated).
- **Save** — `discoveredLocations` (`{ id, state, source }`), navigation targets, escort `location` refs and NPC follow-up `selectedLocationIds` hold location **ids**; `getById('lake:cx,cz')` resolves any such id blindly to that cell centre, so an obsolete id never crashes (it points at a sea cell).
- **Epoch** — `WORLDGEN_EPOCH` 1 lists "map/location discovery and knowledge"; the Revival batch already bumped it, so the fix needs **no epoch bump and no save migration**. Dev saves written at epoch 1 before the fix may keep a few obsolete lake ids (harmless, above).
- **Consumers** (generic, no lake-specific logic): map markers/labels (`mapData`, `drawMap`, `WorldMapScreen`), proximity discovery, NPC knowledge reveal / follow-up delivery, guard local knowledge, navigation targets, escort destinations. Quests have no lake-specific use. `seedProfile` counts inland wet cells with its own `isFloorBelowSea` call (same sea gap — informational only).

## 4. Proposed slice (Q109, S — approved by the author 2026-11-04)

1. `classifyCoarseCell`: one `sampleRawTexelAt` per cell (fewer texel evaluations than today); wet = `isWetTexel(h, floorH, waterLevel)` (sea or lake, the `classifyMapTexel` rule); keep a distinct ocean state (e.g. `CELL_OCEAN`) instead of folding it into `CELL_NONE`.
2. `floodFillLakes`: a component that touches an ocean cell is sea — no `lake` location. Keep the expanding flood fill so the result is query-order independent (world-013 §9).
3. `LOCATIONS_COARSE_VERSION` 3 → 4; no epoch bump, no save migration.
4. Tests: catalog unit test with a synthetic coast + above-sea lake (coast component rejected, lake found, ids stable across query order); census row both seeds: lake locations = pure inland count (≈ 50 / 55), 0 touching the sea.
5. Optional, separate decision: the same coastal-band gap in `classifyMapTexel` (map paints coastal sea as inland water) — screenshot first, then fix in the map rule if confirmed.

Stop if: the flood fill would need to scan beyond the bounded expansion it does today, or a consumer turns out to depend on lake count/placement (quests).
