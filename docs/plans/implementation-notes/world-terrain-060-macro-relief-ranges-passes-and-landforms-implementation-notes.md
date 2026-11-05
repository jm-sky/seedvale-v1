# Implementation notes — world-terrain-060 macro relief

Plan: [world-terrain-060](../world-terrain-060-macro-relief-ranges-passes-and-landforms.md).

## R0 — descriptor framework (Sonnet, 2026-11-05, queue Q117)

`src/terrain/landformDescriptors.ts` (bucket index, radius/overlap bounds, sampler hook), zero descriptors bit-identical; sampler cost ≈ +2–3 % (noise level, WSL, 400k samples). See commit `4dab874f`.

## R1–R2 — range spines, passes, summits (Opus, 2026-11-05, queue Q118)

### What landed

- `src/terrain/rangeSpines.ts` — pure generator + sampler; `rangeSpinesFor(seed, region)` in `chunkHeightmap.ts` (cached per region object, then per seed + region JSON — workers clone params per job). Only finite-continent worlds (`region.continentMask`) get spines; the legacy/infinite configuration and every test without a mask are unchanged.
- Range spines are **not** landform descriptors: a 2–4.4 km polyline exceeds the R0 radius bound (512 m). They have their own per-sample bound instead: ≤ 3 spines × 8 segments, behind a per-spine bounding box, evaluated on the already-computed Worley warp (no new noise evaluation). P1 point landforms (R3) still use the R0 bucket index.
- **Generation (acyclic):** reads only the continent land weight (continent noise + mask) and the noise mountain gate. 64 seeded candidate paths (6 km, 8 segments, ±0.22 rad turns) are trimmed to their longest contiguous run with land weight ≥ 0.8 and ≥ 1150 m from the origin (home reserve, centreline), capped at a seeded 2.2–4.4 km length; scored by length + mean noise-gate overlap (old massifs join the ranges); greedily kept ≥ 1500 m apart up to a seeded target of 1–3. First attempt required the whole spine plus both flanks inland (≥ 0.92): 5 of 7 seeds got no range at all — interior bays cut almost every straight candidate, hence the trimming.
- **Sampler:** `mountainGate = max(noiseGate, spineGate) × passFactor × landWeight`; `mountainRidge = max(worleyRidge, spineCrest) × mountainGate` (consumers keep the 0..1 "connected ridge strength" meaning — rock exposure, snow tint, resources follow the new crest automatically); a spine counts as full massif envelope (massif gain 1.25). Envelope: full inside 45 % of the 420 m half width, 650 m end tapers. Crest/summit core: `(1 − d/210 m)^1.5` — a sharp crest line with steep upper flanks.
- **Summits (R2, G8):** metre-scale term outside `heightScale` (reconciliation §1 — tree line, meadows, grass, biomes keep their altitude-fraction classes in the lowland): crest lift 9 m along the core + 1–3 Gaussian summits per spine (σ 170–260 m); the longest spine of the world carries the top summit (+34 m), the others +10…20 m. A tanh soft ceiling (knee 66 m → ceiling 82 m, `softCapSummitHeight`) absorbs summits that stand on unusually high base relief; lowland, hills and noise massifs (≤ ~41 m) are below the knee and untouched.
- **Passes:** 1 per spine, 2 on spines > 3.2 km, placed in the middle 30–70 % of their share of the spine; the gate, crest and summit term drop by 80 % within ±110 m and recover over the next 110 m. `corridor` = centre on the spine, direction across it, half length = half width + 180 m, width 60 m, intended max grade 0.12. Summits avoid ±330 m around each pass and the end tapers.

### Measurements — spines, peaks and passes (raw uncorrected floor, 20 m grid; `scripts/perf/_spines-probe.ts` style probe, not committed)

| Seed | Spines | Top peak (m) | Pass saddles (m) |
| --- | --- | --- | --- |
| 42 | 3 | 69.3 | 10.1 · 10.0 · 9.0 |
| 415424794 | 2 | 77.4 | 10.1 / 13.1 · 7.1 |
| 1 | 2 | 76.8 | 13.0 · 14.8 / 11.4 |
| 7 | 2 | 70.3 | 7.1 · 8.4 |
| 1234 | 3 | 81.2 (95.1 before the soft ceiling) | 8.8 · 5.1 / 7.1 · 8.7 |
| 99991 | 2 | 70.9 | 16.4 / 11.4 · 6.8 / 5.8 |
| 2026 | 2 | 72.3 | 8.0 · 8.7 |

S0 baseline top peaks: 33.1 m (42), 38.3 m (415424794).

**Pass grades.** Along the corridor centreline (raw floor, 20 m steps) the steepest 20 m step is 18–41 % (cross-slope over the 60 m width 8–14 %); the mean grade from the corridor ends to the saddle is ≈ 2–4 % (e.g. seed 42 pass profile, 40 m steps: −3 … 1 … 8 9 10 10 9 12 13 13 13 11 10 4 … −9). For comparison, random 1.2 km land transects without any range have a steepest 20 m step of p50 21–26 %, p90 43–46 % on both seeds — the corridor peaks are ordinary detail-noise roughness, not the range. The binding check stays at R4 (after hydrology correction, road shaping, pads; `slopeConstraint.ts` and router costs, both directions). The 0.12 `maxGrade` is the intended corridor grade at that scale, not a 20 m-step limit.

Probe: `pnpm tsx scripts/perf/census-range-spines.ts [seeds]` (spines, top peak, crest max, saddle heights, corridor grades).

### Relief census vs S0 (`worldgen:continent:census --relief`, production hydrology, 16 m grid)

Data: [`2026-11-05--relief-census-060-r2.json`](../../research/v1-revival/census-data/2026-11-05--relief-census-060-r2.json) vs S0 [`2026-11-04--relief-census.json`](../../research/v1-revival/census-data/2026-11-04--relief-census.json).

| Metric | 42: S0 → R2 | 415424794: S0 → R2 |
| --- | --- | --- |
| Top peak / prominence | 33.1 / 32.6 → **71.3 / 70.9 m** | 38.3 → **76.9 / 76.4 m** |
| Height p50 / p90 / p99 | 5.6 / 9.4 / 15.3 → 6.0 / 13.5 / 35.2 m | 5.5 / 9.6 / 17.0 → 5.7 / 12.3 / 34.8 m |
| Land ≥ 15 m (≈ above the 12 m tree line) | 1.1 → 5.7 % | 1.8 → 4.4 % |
| Land ≥ 60 m (enters `SNOW_ALT_M`) | 0 → 0.03 % | 0 → 0.09 % |
| Slopes 10–20° / 20–30° / ≥ 30° | 4.25 / 0.07 / 0.01 → 7.95 / 0.76 / 0.13 % | 4.58 / 0.15 / 0.03 → 7.04 / 0.73 / 0.13 % |
| Gated ridge land (proxy) / components | 11.3 % / 40 → 24.1 % / 38 | 14.3 % / 37 → 23.2 % / 35 |
| Largest ridge components (km² / extent) | 0.45 / 1.2 km, 0.42 / 1.9 km | → 2.07 / 3.5 km, 1.84 / 3.1 km, 1.65 / 2.9 km | → 3.24 / 4.7 km, 1.89 / 3.4 km |
| Land km² | 34.8 → 34.9 | 36.4 → 36.4 |

Gated ridge land doubles: bare-rock/alpine bands grow (reconciliation §1 consequence 2) — part of the author's R2 preview judgement. Isolated noise massifs remain (≈ 35 other ridge components; R2 peaks list keeps 50–60 m crests and 20–40 m massifs).

### Downstream re-census (both seeds; no tuning)

- **Settlements:** 22 / 22 selected and defined on both seeds; home unchanged (8.5, 22.7) / (59.9, −5.2).
- **Travel** (`worldgen:travel:census`): routed components 4 → **3** (42: 14·7·1) and 4 → **1** (415424794: all 22 connected); routed edges 18 → 21 / 19 → 21; route p50 1666 → 1635 m / 1535 → 1556 m, ratio p50 1.14 → 1.19 / 1.09 → 1.13; max 2658 → 2567 / 2153 → 3263 m (415424794: one edge detours around a range — 18.6 player-hours estimate); route length on 10–20° 0.4 → 0.8 / 0.3 → 0.7 %, 20–30° 0 → 0.2 / 0 %. River crossings 141 → 218 / 141 → 178 (more streams off the ranges — consequence 4; 061 recalibrates hydrology on the frozen relief). Wilderness > 5 h 10.9 → 10.8 / 13.6 → 14.7 %. Changes in route topology, not a road-shaping change.
- **Access / composition** (`worldgen:access:census`): 0 unreachable yard gates / storage / bay slots on both seeds, 0 overlapping and 0 wet object discs, runtime props unchanged in kind. Seed 42 LG: path ribbon ∩ wall 3 and one centreline ≤ 0.3 m (Q93 measured 0 centreline within rings ≤ 8; this census covers the whole island) — layouts move with the terrain; left to the 063 / Q61 close-out.

### Cost (WSL, tsx, 400k random points over the island)

Full uncorrected sampler 1.8–1.96 µs/sample; the spine term alone 0.04–0.06 µs/sample = **2.2–3.0 %** of the sampler (plus the R0 hook, ≈ 2–3 %, noise level). Within the R0 note budget; chunk-generation / hydrology-boot timing vs the D7 baseline is an R4 item.

### Render checks (code read, not browser)

- Chunk bounds: `buildChunkGeometry.ts` calls `computeBoundingSphere()` on the real geometry — taller chunks get correct bounds.
- Snow tint `biomeColors.ts` clamps altitude to 0..1 of the ramp — no overflow at 4× `heightScale`.
- Shadow camera far 200 m / fog silhouettes on 70 m slopes: **not checked** (browser, → queue §2).

### Open for the author (R2 preview review, before R3/R4)

Previews: `docs/research/v1-revival/continent-previews/continent-<seed>-standard-relief-ranges-060r2.png` (7 seeds; white = spine, yellow = pass corridor). Questions: do the ranges read as ranges; is the larger bare-rock area acceptable; peak height (top 69–81 m on 7 seeds); range count (2–3 per seed — 1 possible by the seeded target, not observed); home reserve 1150 m (seed 42: a 63 m crest ~1.3 km north of home).

## R3 + R4 (partial) — P1 landforms, cache bumps, re-census (Sonnet, 2026-11-05, queue Q119)

Author accepted the R2 previews 2026-11-05 ("OK").

### R3 — what landed (`9f9931cb`)

- `landformDescriptors.ts`: `generateLandforms(seed, ctx)` + per-kind profiles in `landformHeightDeltaAt`. Kinds: `crag` (knoll, amplitude 7–13 m, r 110–170 m), `crater` (bowl 3–4.5 m + rim 2.5–4 m, r 200–270 m), `lakeIsland` (basin 3.5–4.5 m with central knoll 4–6 m, r 200–270 m). `spineSummit` stays a range-spine term (R2), not a point landform. Profiles are continuous and exactly 0 at the footprint edge (test).
- Selection: jittered 180 m candidates on **flat lowland** of the descriptor-free base relief (`sampleRawTexelUncorrected(..., withLandforms = false)` — acyclic; no hydrology/climate/settlements/roads). Crags: floor 4–11.5 m above the sea... basins ≥ `waterLevel + 5.5` (so the basin floor stays dry and hydrology decides whether it fills); probe-ring range ≤ 2.5 m (basins) / 4 m (crags), relaxed ×1.6 / ×2.4 in deterministic steps; home reserve 1150 m + radius; ≥ 700 m between landforms; ids `lf:<kind>:<gx>_<gz>` from the candidate cell. Target: 1 lake island, 1 crater, 1–3 crags (no per-kind guarantee). Only finite-continent worlds (`region.continentMask`) get landforms, like the spines.
- Hook: `landformIndexForParams` in `chunkHeightmap.ts` (WeakMap fast path per region object — **never stringify the region per sample**; the first version did and slowed `createCaves` tests ~3×). `landformDescriptorsOf(params)` for census/debug.
- Census `pnpm tsx scripts/perf/census-landforms.ts [seeds]`: 7 seeds — 3 / 3 / 3 / 4 / 5 / 4 / 5 landforms (seed 42 and 415424794: 1 lake island + 1 crater + 1 crag each); **no shortfall in any of the 7 seeds** vs the 3–5 target. Generation ≈ 70–80 ms per world per realm (each terrain worker builds its own copy).
- Caches bumped (output-changing slice): `CHUNK_TILE_CACHE_VERSION` 28→29, `WORLD_HYDROLOGY_VERSION` 3→4, settlement defs 27→28, road routes 15→16, caves 9→10, locations-coarse 6→7, abandoned cemeteries 12→13. `WORLDGEN_EPOCH` untouched (open Revival batch).
- Sampler cost (WSL, 400k random points): 1.86–1.90 µs/sample — unchanged vs R2 (1.8–1.96).

### R4 — re-census after R3 (both seeds, no tuning)

- Settlements 22 / 22 defined; routed components **42: 3, 415424794: 1** (same as R2); routed edges 20 / 21; route p50 1587 / 1585 m, ratio p50 1.16 / 1.11, max 2333 / 3402 m; river crossings 192 / 178; wilderness > 5 h 11.3 / 13.9 %.
- Access census: 0 unreachable yard gates / storage / bay slots, 0 body-clearance failures, 0 wet object discs. Seed 42 LG: 1 overlapping object disc and 3 paths crossing discs; seed 415424794 MD: 2 and LG: 1 path-ribbon ∩ wall; runtime props: some `on path` hits (market props, plaza-adjacent) — not compared with S0 here, 🟡 pre-existing class (Q93/Q95), left to the 063 / Q61 close-out.
- Catalog lakes (`worldgen:lakes:census`): inland wet cells 1288→1884 (42) and 1329→2204 (415424794); lake locations 141→178 / 145→185; within 1.5 km of home 20→30 / 22→31. Lakes census compares against the pre-058 baseline, not R2.

### Not done (R4 remainder → Resume)

- Pass-corridor **grade check after hydrology correction / road shaping / pads, both directions** against `slopeConstraint.ts` (R2 numbers are raw floor only).
- Chunk-generation time and **hydrology boot time** vs the D7 baseline (cold/cold, warm/warm); peak memory.
- Browser check on `415424794` (clear worldgen cache): cross one pass, stand on one summit, look at one crater / lake island (the landforms are placed away from the home: `lf:crater:8_14` at (1565, 2593), `lf:lakeIsland:16_7` at (2940, 1355), `lf:crag:16_8` at (2957, 1539)). Landform **look** (profiles, rock exposure on crags — crags are knolls only, no extra rock) is an author judgement.
- Previews with landform overlay (`continent-preview-png.ts` has no landform layer yet) and committed R3 exports in a per-topic folder.

### R3 correction after the author's look at the first landforms (2026-11-05)

Author: the crater read as a huge lake with islands; a crater only makes sense **dry** and does **not need to be big**; lake island OK; "crag" unexplained (= `crag`: a small isolated rocky hill/knoll rising out of flat lowland — currently only a smooth knoll, no extra rock).

Cause: a bowl below the surroundings is a depression, and hydrology fills every such pit (lake above `lakeMinCells`, filled pit otherwise) — a dry bowl cannot exist with the current 058 correction. **Fix:** `crater` is now a dry **tuff ring**: raised rim (3.5–5 m, Gaussian at 0.78 r), interior at ground level, a gap in the rim on the downhill side (lowest of 16 ring samples) so no pit forms; radius 70–130 m (was 200–270). Candidates use the crag lowland rules. Census (7 seeds): still 3–5 landforms per seed, no shortfall. All caches bumped once more (chunk tiles 30, hydrology 5, settlements 29, roads 17, caves 11, locations-coarse 8, cemeteries 14). Full `pnpm vitest run` green (9285). Dry crater on a slope whose notch faces uphill-of-a-ridge is possible only where the 16-sample minimum is itself a local rise — not observed; checked visually only after the author's browser look.
