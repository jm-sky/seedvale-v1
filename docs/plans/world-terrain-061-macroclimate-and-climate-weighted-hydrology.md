# Plan: Static macroclimate and climate-weighted hydrology

**Created:** 2026-11-04
**Status:** `planned` 📋 (C1 may start in parallel with world-terrain-060 as previews only; C2+ after 060 R2)
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** tools-026, world-terrain-060
**Domain:** `world-terrain`
**Subdomains:** `terrain` `hydrology` `worldgen`
**Tags:** `geography` `climate` `rivers` `hydrology` `worldgen` `epoch`
**Model:** Opus (C2, H1–H2 calibration), Sonnet (C1, H3–H6)

## Goal

Stages S3 + S4 of the geography program in **one** plan, because runoff and channel thresholds are calibrated together on the final relief:

1. A shared, static **macroclimate** (temperature, precipitation, maritime) — cold/boreal north, temperate centre, warmer/drier south, coherent transitions, inland arid areas possible but no fixed desert quota (G2, G3).
2. **Fewer perennial rivers/streams plus dry drainage valleys without surface water**; no seasonal stream mechanic (G4).

Authority: [G1–G4](../research/v1-revival/2026-11-04--geography-exploration-author-decisions-g1-g9.md). Candidate mechanism: [proposal §3, §4B, §4C](../research/v1-revival/2026-11-04--geography-exploration-architecture-proposal.md#b-macroclimate-and-geographical-regions). Targets come from the tools-026 D6 packet as confirmed by the author, not from the proposal's 🎯 ranges.

## Verified starting point (2026-11-04)

- Climate is global: `computeClimate(seed, elapsedDays)` (`src/world/weather.ts`) has no position; `temperatureFor(season, type)`.
- Biomes: `biomeWeightsAt(moistureRegion, altitude01, region)` (`biomeRegions.ts`) — seeded moisture FBM + altitude, no latitude term. (Biome changes are world-terrain-062; this plan only produces the fields.)
- Hydrology (`worldHydrology.ts`): priority-flood → breach-then-lake → D8 on the flooded surface; **every land cell contributes `1`** (~L784) and a stream starts at `streamAccumulation` cells (`DEFAULT_RIVER_THRESHOLDS.stream`) on the 8 m grid; chains, lakes (`lakeMinCells 600`), mouth ramps, sparse payload per `hydrologyId`, copied to workers; golden-hash test; `WORLD_HYDROLOGY_VERSION = 1`.
- Wet/land queries: sea-only `isFloorBelowSea` (terrainClassification) vs shared `waterSurface.isWetFloor` (review 030 contract in `docs/state/water.md`). Stream consumers include `waterSurface.ts`, `chunkVegetation.ts`, `chunkItems.ts`, `chunkCrops.ts`, `grassPlacement.ts`, `chunkEnvironment.ts`, `mapProjection.ts`, road crossings (`roadRiverCrossing.ts`).

## Design

**Acyclicity (contract):** climate reads only the unconditioned floor (after 060 landforms) and its own coarse sea mask — never hydrology, biomes, settlements or weather. Hydrology reads climate runoff. Biomes may later read rivers; rivers never read biomes.

- **C1 `src/terrain/macroClimate.ts`** — pure `macroClimateAt(x, z) → { temperature, precipitation, maritime }`: latitude term (north = −Z), lapse from unconditioned height (scaled to V1 heights; V2/V3 coefficients are not transferable), bounded regional noise (reuse the moisture-region noise as the precipitation term), maritime term from a coarse coast-distance grid (🟡 32–64 m cells, ≤ 0.6 MB) computed once from the unconditioned sea mask. Installed with the hydrology payload under the same lifetime (`hydrologyId`), hashed into it. Optional cheap spine-based orographic term (windward wetter, lee drier) from 060 spine descriptors — a technical choice, decided in C2 from previews.
- **C2 preview + author look** — continent preview layers T, P, runoff, and a provisional dominant-biome classification; both seeds + spot seeds. **Gate:** author approves the regional look on previews (G2 asks for calibrated transitions and preview review).
- **H1 runoff-weighted accumulation + area thresholds** — `acc[cell] = runoff(T, P)` (clamped range from C2) instead of `1`; initiation and class thresholds in m² converted by cell area. One calibration on the final relief.
- **H2 two drainage tiers** — *perennial channel* (water ribbon, bed carving, wet queries, crossings, fishing/drinking/swimming, map blue; lake outlets and lake-fed chains always perennial; headwater taper so rivers do not start abruptly) and *dry drainage line* (terrain only: shallow valley, stony/greener strip; **not wet, not a road obstacle**; faint line on the diagnostic map only). Stored as a class on the existing chain payload — no second network.
- **H3 map hierarchy** — gameplay map/minimap draws perennial chains by width class; diagnostic all-streams mode keeps dry lines.
- **H4 parallel artifacts** — re-run the tools-026 detector; only if artifact-class pairs survive H1–H2: flat-resolution fix (gradient toward lower + away from higher on filled flats). No meander pass.
- **H5 outcome assertions + waterfall candidates** — census asserts 060 `intendedOutcome` (crater holds a lake, lake-with-island has its island); records steep perennial reaches at genuine scarps as **data only** for world-terrain-064; home stream still present and plausible.
- **H6 close the calibration** — `WORLD_HYDROLOGY_VERSION` bump + golden hashes; dependent caches; downstream **re-census only** (settlements, roads, crossings/bridges, access, caves, catalog lakes via `worldgen:lakes:census` once Q109 is on `main`); payload size and boot time; 058 continuity checks (outlets, lake-fed, mouth ramps) unchanged.

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| C1 | macroClimate module + coast grid + unit tests (determinism, query-order independence, worker parity) + preview layers; **no consumers** | S | 060 R0 (can run beside R1–R3 on the current relief, previews only) |
| C2 | Final fields on 060 relief, optional orographic term, author look review (§3) | O | 060 R2 |
| H1–H2 | Runoff + area thresholds + two tiers, calibrated against the confirmed S0 targets | O | C2 approved; 060 R4 landed (landforms in the floor) |
| H3 | Map hierarchy | S | H2 |
| H4 | Parallel artifact fix (only if needed) | S | H2 |
| H5–H6 | Assertions, waterfall-candidate data, bumps, re-census, notes | S | H2 |

## Done when

- River metrics meet the author-confirmed targets on both seeds (proposal starting points: perennial density ~⅓–½ of today, heads −60 %, ≥ 3 recognizable systems, ≥ 35 % land > 300 m from perennial water, 0 artifact-class parallel pairs) — **the confirmed numbers replace these**.
- Climate: mean temperature monotonic over 5 latitude bands, regional noise visibly breaks bands; author approved the C2 look.
- 058 continuity checks green; hydrology boot not slower beyond noise; payload size reported.
- Gameplay-mode and diagnostic previews before/after committed; 3 catchments on `415424794` checked in 3D (raw drainage vs smoothed path vs banks) → §2.
- type-check, lint, tests; notes + `docs/state/water.md` / terrain state updated.

## Stop if

- A dry-drainage line must be wet for some consumer (→ design question).
- Settlements lose all water access in a region (→ suitability question for 063, not a hydrology hack).
- Quests/props depend on small streams that disappear (census river-bound objects first; → author).
- Hydrology boot time grows materially.

## Coordination

- Q109 owns the catalog-lake code until it lands; H6 only re-runs its census.
- Q92 (river visual polish) and Q98 (confluence seams) stay deferred until after H6 — fewer, larger rivers change their scope.
- Q84-a (river-enclosed roadless settlement) and Q110 (residual bridges) are re-checked in H6 and finally in the road retry after world-terrain-063.
