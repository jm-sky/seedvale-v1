# Plan: Finite continent and global hydrology

**Created:** 2026-11-02
**Status:** `planned` 📋
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `terrain` `rendering`
**Tags:** `hydrology` `rivers` `lakes` `worldgen` `epoch`
**Model:** Sonnet, Opus

## Goal

Replace the per-tile river extraction with **one global hydrology pass over a finite 8 × 8 km continent**, so every stream drains to the sea or a lake, rivers are continuous across tiles, end exactly at their mouth and inland lakes exist above sea level. Settlement sizes grow outward from home with a guaranteed `XL` within reach, and the world gets an edge (open sea, push-back current, hard boundary at ±4096 m).

> **Superseded in part by [world-terrain-059](./world-terrain-059-world-scale-travel-time-and-sparse-settlements.md) (author, 2026-11-02, Q81):** world **12 × 12 km (±6144)**, land radius ~3.8–4.6 km, **20–25 settlements** chosen by a global selection pass (720–1800 m between neighbours), sizes by graph hops. This changes decisions 1, 2, 11 and 12 below (grid 1537², radius, W2 rings → hops, edge ±6144) and the §W1 calibration. Slice order: 059 W3 → W4 → W5 → W2′, then H1 onward; H4 needs 059 W4.

Author decision Q68 (2026-11-02): option A — see [Q67 recon §6.6](../research/v1-revival/2026-11-02--q67-hydrology-continuity-recon.md#66-author-decisions--q68-2026-11-02). Evidence and failure classes C1–C5: [Q67 recon §1–§3](../research/v1-revival/2026-11-02--q67-hydrology-continuity-recon.md). No interim quick fixes (author): the slices below land in order, each one keeping `main` building and the world playable.

## Current state (verified 2026-11-02)

- **Terrain** is analytic and unbounded: `sampleRawTexel` (`src/terrain/chunkHeightmap.ts`) evaluates continentalness/mountain/hills/detail noise per point; `floorH` is true bathymetry, `h = max(floorH, waterLevel)`. The same function runs on the main thread (settlements, roads, map projection, caves, locations) and in chunk workers (tiles, map raster, river tiles). There is no global data the sampler reads.
- **Rivers**: `computeRiverTile(tile, sampleParams)` (`src/terrain/riverNetwork.ts`) runs `computeHydrologyRegion` (D8 + bounded breach, `src/terrain/hydrology.ts`) on a 128² window (256 m core + 384 m halo, 8 m cells) and builds chains truncated at the core rect. **Every consumer goes through `computeRiverTile`**: `riverTileCache.ts` (chunk carving/ribbons), the worker `riverTile` job, `riverQuery.ts` (placement), `mapRasterTile.ts`, `debug/locationQueries.ts`. This is the seam the plan keeps.
- **Water** has one level: `waterLevel` (0.45 m, 1 unit = 1 m, `heightScale` 18). Sea-level inland "lakes" already exist (`waterBodies.ts` `detectWaterBodies`, `lakeScaleFor`). River water has its own surface (`riverWaterSampleAt`), which wins in `sampleLocalWater` (`src/terrain/waterSample.ts`). ~100 non-test files read `waterLevel`; 54 sites compare a height against it.
- **Rendering**: per-chunk flat water `createChunkWater` (`src/world/createWater.ts`) at `waterLevel + 0.07` with a heights mask; singleton ocean beyond loaded chunks (`createOcean.ts`); planar mirror at one plane (`waterMirror.ts`, reflection ≤ ~18 % of water colour, ~1–2 % at ordinary angles); river ribbons (`createRiverWater.ts`) have no mirror.
- **Settlement sizes**: `rollVillageSize` (`src/settlement/families.ts`, `SIZE_WEIGHTS` per terrain) plus `resolveSettlementProgressionPolicy` (`src/settlement/settlementProgression.ts`: near ring 1–2 ≥ one step above home, far ring 3–5 ≥ `LG`). **Finding:** the policy returns `null` for any explicit `homeSize`, and the default is now `'SM'` (`worldConfig.ts`), so **progression is currently off by default**.
- **Bounded already**: map extent `MAP_EXTENT_HALF = 4096` (`src/world/map/mapConfig.ts`). Nothing else is bounded.
- **Worker pool**: module singleton (`src/terrain/chunkWorkerPool.ts`), per-job messages only (no per-worker init state), workers may be recreated on error.
- **Caches**: per-namespace IndexedDB (`worldgenCacheDb.ts`) + boot fixture (`worldgenFixture.ts`, tools-020). `WORLDGEN_EPOCH = 1` (Revival batch still open, D3).

## Design decisions (settled by this plan)

1. **One coordinate frame.** The hydrology grid covers `[-4096, 4096]²` at `RIVER_CELL_STEP` = 8 m → 1025 × 1025 cells. Outside it everything is sea; nothing generates settlements, rivers or roads there.
2. **Continent mask on continentalness**, not on height: `c' = min(c, mask(x, z))` blended in the existing `sampleRawTexel` before `regionBias`/`landWeight`, so oceans, coasts, biomes and the map all follow from the existing field. `mask = 1` inside an inner radius (current terrain unchanged there), falling to below `oceanThreshold` at the coast band. The coast radius varies with angle by a low-frequency seeded noise (domain-warped, per-seed range), centred on the origin with a small seeded offset (home stays on land: the origin is inside the inner radius by construction). Per-seed variation: land radius **2.3–2.9 km** (inner radius 1.75 km; was 2.6–3.2 km before the Q71 calibration below), edge band ~600 m, sea from ~3 km out to 4096 m.
3. **Hydrology on the raw floor, terrain reads the result.** Order is fixed and acyclic: raw floor (with mask) → global hydrology → **correction layer** (breach cuts, filled pits) added to `floorH` inside `sampleRawTexel` → every consumer (settlements, roads, map, caves, carving) sees the conditioned surface. Hydrology never reads corrected terrain, settlements or roads.
4. **Identity in params, data in a registry.** `RawSampleParams` gains `hydrologyId: string` (hash of seed + `HYDROLOGY_VERSION` + terrain config). Chunk/settlement/road fingerprints therefore change automatically with hydrology. The data lives in a module registry keyed by that id (same pattern as `noiseHandlesFor(seed)`); the main thread installs it at boot and the pool sends an install message to every worker, including recreated ones. A sampler call with an id that is not installed throws (no silent uncorrected terrain).
5. **Pit policy: breach first, fill small, lake large** (V3 `generateHydrology` as donor, values recalibrated for V1's 18 m relief): breach a pit when a graded cut ≤ `breachMaxCut` along ≤ `breachMaxLen` cells exists (valley flanks at `breachSideSlope`); otherwise fill it to its spill level when its area < `lakeMinCells` (a flat meadow, via the correction layer); otherwise it becomes a **lake** at its spill level. Below-sea inland basins: tiny ones are raised just above sea level, the rest stay sea-level lakes (rendered today already). Starting values: `breachMaxCut` 3 m, `breachMaxLen` 48 cells, `breachSideSlope` 0.5, `lakeMinCells` 120 (~0.77 ha) — **calibrated in H1 against the census targets below**, every final value recorded with its measurement (V3 practice).
6. **Flats** get an ε gradient towards the outlet (priority-flood + ε, Barnes 2014) so D8 directions on filled areas are defined and deterministic; ties broken by cell index.
7. **Chains are global and confluence-aware**: one chain per river from its head to the sea, a lake or a join; at a confluence the branch with the larger upstream accumulation continues, the other ends at the join (no tributary re-walking the trunk). A chain ends at the first sea cell — no seabed chains. The last `MOUTH_RAMP_M` (≈ 24 m) of a chain ramps the water surface to the receiver level (sea or lake), fixing C1. Lake outlets start a lake-fed chain. Smoothing and meander run once per global chain (no tile-edge taper).
8. **River tiles become a view**: `computeRiverTile(tile, sampleParams)` keeps its signature and returns the global chains clipped to the tile core rect (interpolated boundary points, the same "truncated at the core boundary" semantics as today). All five consumers stay unchanged. Per-tile `computeHydrologyRegion` leaves the runtime (kept only until the H-perf A/B, then deleted — no parallel system).
9. **Lakes are water bodies with their own level** but no new water system: the raw sample gains `waterH = max(waterLevel, lakeLevelAt(x, z))` where `lakeLevelAt` returns the lake's level inside its basin region (the cells the flood raised, dilated by one cell) and `h = max(floorH, waterH)`. Inside a basin the shoreline is exactly `floorH < level` at full texel resolution. Water presence checks move from `h <= waterLevel` to the sample's own water height (`LocalWaterSample`, `isWetFloor` variants). Rendering reuses `createChunkWater` per distinct surface level in a chunk.
10. **Sources vs settlements (C5)**: settlement site search (which already takes a `RiverQuery`) rejects a site whose footprint + 24 m contains a visible non-lake-fed chain head and keeps the current behaviour when no candidate passes. Hydrology stays settlement-agnostic (decision 3).
11. **Distance-aware sizes** extend the existing progression policy (no new mechanism): it applies to every home size, not only `auto`; rolls are clamped by a per-ring cap (ring 1 ≤ `MD`, ring 2 ≤ `LG`, ring ≥ 3 uncapped) on the same RNG stream, so local variety stays; guarantees: one `MD`-or-larger in ring 1–2 (existing near rule), one `LG` in ring 2–3, one `XL` in ring 3–5 (≤ ~1.5 km, was `LG`). Chosen cells are distinct; a guarantee that finds no site falls back one size and is reported by the census.
12. **World edge**: beyond the outermost coast the player swimming/wading receives a push-back velocity towards the continent that grows from 0 at the edge-band start to above swim speed ~300 m further out; a hard clamp at ±4096 m (player, NPC and fauna movement owners). Boats do not exist yet.

## Slices

Each slice is one revertable commit series, verified, with owner docs updated. Cache bumps per slice: every namespace whose output changes (chunk-tiles, settlement-definitions, road routes, cemeteries/abandoned cemetery, locations coarse, caves); `hydrology` is new. All ride on `WORLDGEN_EPOCH = 1` while the Revival batch is open (follow the checklist in `src/persistence/worldgenEpoch.ts`). Re-export the reference fixtures in the last slice that changes worldgen, not after every slice.

| Slice | What | Model | Done when |
| --- | --- | --- | --- |
| **W1** | Continent mask (decision 2) + bounded settlement grid/routes (no cells outside ±4096; ocean cells already fail site search) + census `pnpm worldgen:continent:census` | S | Both seeds (42, 415424794): coast radius within the configured 2.3–2.9 km band except natural bays; settlements on a compass walk from home (8 rays, centre within ±150 m of the ray, up to the coast): **median 4–6 per seed and ≥ 5 rays with 3–7** (revised in Q71, see §W1 calibration); total settlements reported; sea at every border cell; home site unchanged (or moved < 50 m); terrain/settlement tests green; map shows the island |
| **W2** | Distance-aware settlement sizes (decision 11); census extends W1's | S | Both seeds: home = configured size; ≥ 1 MD+ in ring 1–2, ≥ 1 LG in ring 2–3, ≥ 1 **XL** in ring 3–5, no XL in ring ≤ 2; size histogram beyond ring 5 within ±5 pp of today; `settlementProgression` tests updated |
| **H1** | Pure global hydrology module (decisions 1, 5–7): floor grid, sea mask, priority-flood + ε, pit labelling and policy, flow, accumulation, classes, global chains, mouth ramp, lake records, correction layer; unit tests on synthetic grids; census `--model=global`; calibration | S (O on a calibration fork) | Census on both seeds: dry-sink drops **0**, seam breaks **0**, seabed chain length **0**, mouths at receiver level ±0.05 m, home stream reaches the bay; lake count/area, filled area and max breach cut reported and within the targets in §Verification; deterministic (same bytes with 1 vs N worker strips); compute ≤ 6 s single-thread on WSL |
| **H2** | Runtime install (decision 4): boot stage `worldHydrology` before `buildChunkManager`, strip sampling across the pool, `hydrology` IndexedDB namespace + fixture namespace, registry + worker install (incl. recreated workers), `hydrologyId` in `RawSampleParams` | S | Cold boot computes once, warm boot loads from cache (boot mark recorded), fixture import works, a worker recreated mid-session still answers; missing id throws in tests |
| **H3** | Correction layer in `sampleRawTexel` + river tiles as a view (decisions 3, 8); per-tile path behind `?hydrology=legacy` only for the A/B | S | River census on runtime data equals H1; chunk/map/placement consumers unchanged in API; terrain/river/settlement tests green; browser: home stream continuous to the bay (§2 entry) |
| **H4** | Sources vs settlements (decision 10) | S | Census: visible heads inside a footprint 0 on both seeds (home included), within 24 m ≤ 2 per seed; settlement count change ≤ 2 % |
| **L1** | Lake water semantics (decision 9): `waterH` in the raw sample, `sampleLocalWater`, `isWetFloor`/`resolveWaterShore`, and the audited `<= waterLevel` sites (placement, fauna/NPC water, wells, fishing, swimming, drinking, footsteps, map classification) | S (high) | Audit table in the implementation notes, every site resolved; tests: a lake point is water for swimming/drinking/fishing/placement, a dry point next to it is not; census: 0 trees/items/houses/road segments inside lakes |
| **L2** | Lake rendering: `createChunkWater` per distinct level in a chunk, lake material (`lakeScaleFor`), no planar mirror on lakes (author, option a) | S | Draw calls per lake chunk +1 at most; screenshots of 2–3 lakes for the author (§2); no water at a wrong level in loaded chunks |
| **E1** | World edge (decision 12) + map edge presentation | S | Player cannot pass ±4096 m; push-back felt from the edge band (browser check); NPC/fauna never leave the box; tests for the clamp |
| **P1** | WSL A/B (`boot`, `stream`, `settlement` runs) new vs `?hydrology=legacy`; then **delete** the legacy per-tile path (`computeHydrologyRegion` runtime use, worker `riverTile` compute); re-export fixtures; re-take Q37/Q44 census baselines | S | WSL report in `docs/performance/results/`; no stream/hitch regression or a recorded reason; legacy code gone; fixtures ≤ 3 MB compressed each; queue §4 lists the Windows confirmation |

Ordering: W1 → W2 (may run in parallel with H1) → H1 → H2 → H3 → H4 → L1 → L2 → E1 → P1. Queue Q60 waits for H3 (final rivers and coastline); Q70 (biome borders) is unblocked by W1.

### W1 calibration — continent size and settlement density (Q71, 2026-11-02) — superseded by 059 W3/W4

Author decision: compromise **(a) + (b)** — a slightly smaller continent and fewer settlements; the numbers (4–5 settlements on a walk in one direction, 12–20 on the continent) are orientative, the priority is a varied world to explore; size, density and pitch delegated to Opus (pitch 300 m kept unless there is a strong reason).

Findings (census `pnpm worldgen:continent:census`, rings 14):

- The first census overcounted per direction: its ±300 m band is two grid rows wide at pitch 300. A walk "in one direction" passes the villages within about half a pitch of the line, so the ray band is now **±150 m**. On the original 2.6–3.2 km continent that already gave 2–9 per ray (seed 42: 2 3 6 5 6 5 6 6; seed 415424794: 4 8 9 6 7 5 3 5), not 7–22.
- At pitch 300 almost every land cell holds a settlement (~11 per km² of land). The two orientative numbers are not consistent at a uniform density: 4–5 per direction means a land radius of ~5 pitches, and that disc holds ~60–80 cells. 12–20 in total would need a ~1 km pitch (≈ 1 per km²).
- Fewer settlements **without** a smaller continent would mean empty cells. Today roads (`neighborsFor`), entrances (`neighborSitesFor`) and cemetery sharing only look at ring-1 neighbours, so empty cells would cut villages off the road network. A larger pitch would rescale every distance-tuned system (roads, cemeteries, progression rings, Q32 travel calibration). The fewer-settlements part therefore comes from the smaller continent.

Decision: land radius **2.3–2.9 km** (inner 1.75 km, edge band 600 m, centre jitter 250 m), pitch **300 m kept**. Reasons: the diameter stays ≈ 4.5–5.5 km, which is at least two wavelengths of the 1.8–2.2 km continent/mountain/moisture fields (biome and landscape variety), and leaves room for long rivers (H1). The world edge has ≥ 1.2 km of open sea. W2's ring-3–5 XL (≤ 1.5 km) stays inside the land.

| Seed | coast per ray (m) | settlements per ray (±150 m) | median | rays 3–7 | total (was) | XL | home |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 42 | 2375 2325 2125 2100 1825 2125 2300 2375 | 1 2 6 5 6 5 6 5 | 5 | 6 | 140 (185) | 8 | (−8.1, −11.5), unchanged vs `--nomask` |
| 415424794 | 1300 2525 2475 2375 2425 2125 2025 2125 | 3 7 8 5 6 4 3 5 | 5 | 7 | 156 (201) | 16 | (17.1, 23.8), unchanged vs `--nomask` |

Low rays (seed 42 east, seed 415424794 bay at 1.3 km) are geography (natural coast/water), not the mask. Border land cells 0/516 on both seeds.

**Possible later lever (not scheduled):** if the world still feels too densely settled after H3, add "wild" empty cells together with Q62 (RNG road graph from site positions, with a neighbour window wider than ring 1). Thinning before that would leave villages without roads. Recorded in `LOOSE-ENDS.md`.

## Verification

- **Census targets (H1 calibration)**, per seed on the whole continent: every chain ends at the sea, a lake or a join; lakes: at least one per seed and no lake under 0.5 ha; max breach cut ≤ 3 m and no breach wall steeper than the flank slope; filled-pit area ≤ 3 % of land. A target that cannot be met with the documented knobs is a calibration fork → stop and ask (Opus).
- **Determinism**: hydrology bytes identical across worker counts and across cold/warm boots (hash compared in a test and in the H2 boot log).
- **Technical**: `pnpm run type-check`, `pnpm run lint:fix`, targeted `pnpm vitest run src/terrain src/settlement src/world/map`, `pnpm run build`.
- **Browser** (seed `415424794`): home stream mouth, one lake, a river through two tiles, the coast and the world edge — recorded per slice as §2 entries; look and feel stay author checks.
- **Performance**: H2 boot cost (cold/warm) and P1 stream/settlement A/B on WSL only; never claim FPS gains.

## Constraints and non-goals

- No change to river ribbon geometry, carving math, fords/bridges or water materials beyond what the slices name. Width/depth from accumulation stay as they are.
- No new water system: lakes reuse the lake/ocean water mesh and material.
- No boats, no tides, no infinite-world fallback.
- Hydrology stays independent of settlements, roads and the player (determinism, decision 3).
- Biome border work stays in Q70.

## Open questions (author)

- **Lake reflection (L2) — ANSWERED 2026-11-02 (author): (a)** lakes render without the planar mirror (sky/fog tint only); sea and rivers unchanged. L2 disables the mirror sample on water meshes whose level is not `waterLevel`.

## Risks

- **Boot time**: ~1.05 M raw samples (~3 µs each) ≈ 3–4 s single-thread, split across the pool, then cached; the fixture covers the reference seeds.
- **Memory**: correction and lake-basin grids stored as sparse 64 × 64-cell blocks (only blocks with a non-zero delta or a basin), copied once per worker; budget ≤ 4 MB per copy, measured in H2.
- **Cascade**: everything terrain-derived moves; Q37/Q44/Q47 census baselines and the Q58 numbers must be re-taken after H3.
