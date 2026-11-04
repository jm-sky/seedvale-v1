# Plan: Static macroclimate and climate-weighted hydrology

**Created:** 2026-11-04
**Status:** `planned` 📋 (C1 may start in parallel with world-terrain-060 as previews only; C2+ after the 060 R4 relief freeze; amended per [review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md) 2026-11-04)
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
- **Chains carry no class today (review 031 F1):** `RiverChain` holds points only; `riverChannelSegmentsNear` derives positive water width, water height and submerged bed from accumulation, and `riverWaterSampleAt` treats every segment as physical water. `worldHydrologyStore.unpackChains` and `riverChainClip.clipChainToRect` produce point-only chains, and clipping **splits** one source chain into several pieces. A flag stored only in the packed payload is therefore lost before any consumer sees it.
- **Cost (review 031 F7):** `sampleRawFloorUncorrected` evaluates the full uncorrected texel path including noise fields — re-evaluating it for runoff or per biome/weather consumer is not "one multiply". Payload after Q96: 6.63 / 6.79 MiB per installed copy (payload only).

## Design

**Acyclicity (contract):** climate reads only the unconditioned floor (after 060 landforms) and its own coarse sea mask — never hydrology, biomes, settlements or weather. Hydrology reads climate runoff. Biomes may later read rivers; rivers never read biomes. The raw-floor sampler stays independent of the climate/biome projection (no corrected-floor ↔ climate recursion).

**Boot order (review 031):** climate is computed **before** the combined hydrology payload is installed — "same lifetime" means hashed into and shipped with the same `hydrologyId`, never "query a payload that is not installed yet". The hydrology runoff pass reuses the floor values it already sampled for the grid (no second `sampleRawFloorUncorrected` pass); other consumers share one bounded climate query.

- **C1 `src/terrain/macroClimate.ts`** — pure `macroClimateAt(x, z) → { temperature, precipitation, maritime }`: latitude term (north = −Z), lapse from unconditioned height (scaled to V1 heights; V2/V3 coefficients are not transferable), bounded regional noise (reuse the moisture-region noise as the precipitation term), maritime term from a coarse coast-distance grid (🟡 32–64 m cells, ≤ 0.6 MB — one cost component among several, measured with the rest in D7 terms) computed once from the unconditioned sea mask. Installed with the hydrology payload under the same lifetime (`hydrologyId`), hashed into it. Start with latitude + lapse + existing regional noise + coast distance; a cheap spine-based orographic term (windward wetter, lee drier) from 060 spine descriptors is added **only if C2 previews show a demonstrated need**.
- **C2 preview + author look** — continent preview layers T, P, runoff, and a provisional dominant-biome classification; both seeds + spot seeds. **Gate:** author approves the regional look on previews (G2 asks for calibrated transitions and preview review).
- **H1 runoff-weighted accumulation + area thresholds** — `acc[cell] = runoff(T, P)` (clamped range from C2) instead of `1`; initiation and class thresholds in m² converted by cell area. Keep two quantities explicitly apart (review 031 F1): **raw catchment area** (m²) and **runoff-weighted effective area** (what `acc` now holds). Every consumer of accumulation — initiation/class thresholds, the width/depth mappings in `riverNetwork.ts`, mouth ramps — is converted consistently; none keeps reading the new units as old cell counts. One calibration on the final relief.
- **H2 drainage contract (review 031 F1 — specify in H2 notes before code)** — *perennial channel* (water ribbon, bed carving, wet queries, crossings, fishing/drinking/swimming, map blue; lake outlets and lake-fed chains always perennial; headwater taper so rivers do not start abruptly) and *dry drainage line* (terrain only: shallow valley, stony/greener strip; **not wet, not a road obstacle**; faint line on the diagnostic map only). Contract:
  1. **One classified drainage dataset** — no second network. Each reach carries a stable **source-chain id** and its **class**, preserved through generation → packing → cache/worker copy → `unpackChains` → `clipChainToRect` (each clipped piece keeps source id, reach class and its offset along the source chain).
  2. **Two projections** of that dataset, neither authoritative on its own: a **terrain-only dry profile** (carving, surface strip) and the **perennial wet view** (water width/height/bed).
  3. **Central adapters exclude dry reaches** for: river water sample / `isWetFloor`, fishing/drinking/swimming, road crossings and bridges, placement clearances (vegetation, items, crops, grass, buildings) and map blue — changed at the shared query owners, not per consumer.
  4. **Continuity:** dry → wet transitions (headwater taper) and lake-outlet overrides stay continuous in width, bed and water height; 058 continuity (outlets, lake-fed, mouth ramps) unchanged for perennial reaches.
  5. **Acceptance:** synthetic dry / perennial / lake-outlet chains crossing tile boundaries; class and source id survive clone, cache and clip; dry reaches carve but return no river water and no crossing; the same physical result in the worker, analytic-query and resident-terrain paths. A blue-line screenshot is not evidence.
- **H3 map hierarchy** — gameplay map/minimap draws perennial chains by width class; diagnostic all-streams mode keeps dry lines.
- **H4 parallel artifacts** — re-run the tools-026 detector; only if artifact-class pairs survive H1–H2: flat-resolution fix (gradient toward lower + away from higher on filled flats). No meander pass.
- **H5 outcome assertions + waterfall candidates** — census asserts 060 `intendedOutcome` (crater holds a lake, lake-with-island has its island); records steep perennial reaches as **data only** for world-terrain-064: top/bottom position, **drop measured on the shipped water/bed profile** (corrected ground and smoothed chain elevations, not raw relief), width class, source-chain id + offset (never a clipped-tile ordinal); home stream still present and plausible.
- **H6 close the calibration** — golden hashes; dependent caches; downstream **re-census only** (settlements, roads, crossings/bridges, access, caves, catalog lakes via `worldgen:lakes:census`); payload size, peak transient memory and boot time vs the tools-026 D7 baseline; 058 continuity checks (outlets, lake-fed, mouth ramps) unchanged. The H6 hydrology revision is the **frozen input** for river-dependent biome/riparian output (062 B1–B2), water-dependent catalog entries (world-041 L1) and settlement selection (063 V1).

Cache versions/fingerprints (`WORLD_HYDROLOGY_VERSION` and every moved namespace) change in **each output-changing slice** (C2 if fields enter the payload, H1–H2, H4), not only at H6 (review 031 F2).

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| C1 | macroClimate module + coast grid + unit tests (determinism, query-order independence, worker parity) + preview layers; **no consumers** | S | 060 R0 (can run beside R1–R3 on the current relief, previews only) |
| C2 | Final fields on the frozen 060 relief, orographic term only if needed, author look review (§3) | O | 060 R4 (relief incl. landforms frozen) |
| H1–H2 | Drainage contract note (H2 §1–5) → runoff + area/unit conversion + two tiers, calibrated against the confirmed S0 targets | O | C2 approved; 060 R4 landed |
| H3 | Map hierarchy | S | H2 |
| H4 | Parallel artifact fix (only if needed) | S | H2 |
| H5–H6 | Assertions, waterfall-candidate data, bumps, re-census, notes | S | H2 |

## Done when

- River metrics meet the author-confirmed targets on both seeds. ✅ **Author Q116-b (2026-11-04):** ≈ **−50 % total watercourse length** vs S0 (12.2 / 11.6 km per land km²), mostly by removing **minor** streams — 🟡 calibration band −40…−60 %, finalized on H2 previews; guards: ≥ 3 recognizable systems with tributary hierarchy, main-river length not cut by more than ~15 % 🟡, 0 artifact-class parallel pairs; heads and "land > 300 m from perennial water" are **reported, not gated** ([Q116 reconciliation §2](../research/v1-revival/2026-11-04--q116-author-direction-reconciliation.md#2-q116-b---50--less-total-watercourse-length)). Supersedes the Q114 1920 m² preview preference as the direction.
- Climate: elevation-adjusted temperature tendency decreases northward and regional noise visibly breaks bands; raw 5-band means reported as a diagnostic (elevation distribution can reverse a band mean); author approved the C2 look.
- Drainage contract acceptance (H2 §5) green; 058 continuity checks green; hydrology boot and peak transient memory within the tools-026 D7 tolerance; payload size reported (fewer **wet** chains need not mean a smaller payload — dry chains are retained).
- Gameplay-mode and diagnostic previews before/after committed; 3 catchments on `415424794` checked in 3D (raw drainage vs smoothed path vs banks) → §2.
- type-check, lint, tests; notes + `docs/state/water.md` / terrain state updated.

## Stop if

- A dry-drainage line must be wet for some consumer (→ design question).
- Settlements lose all water access in a region (→ suitability question for 063, not a hydrology hack).
- Quests/props depend on small streams that disappear (census river-bound objects first; → author).
- Hydrology boot time grows materially.

## Coordination

- Q109 landed 2026-11-04; H6 only re-runs its census.
- Q92 (river visual polish) and Q98 (confluence seams) stay deferred until after H6 — fewer, larger rivers change their scope.
- Q84-a (river-enclosed roadless settlement) and Q110 (residual bridges) are re-checked in H6 and finally in the road retry after world-terrain-063.
