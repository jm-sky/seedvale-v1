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

### Open for the author (R2 preview review, before R3/R4) — ✅ answered

**Author 2026-11-05: R2 mountain look accepted** ("mountains look great"; previews "OK"); the individual sub-questions below were not answered one by one and are treated as accepted with the overall look (recorded 2026-11-06, Opus). Far-view wish → world-terrain-066.


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

### R3 correction 2 — author 2026-11-05 (second look)

Author: a crag must stand **1–3 tree heights** above the terrain; a crater may have a rim but must be a **depression in the ground, no water, no grass or plants, meteorite-sized, not half the world**. (The earlier ring r 126 m with a downhill gap was visible only on the minimap and "contained rivers and hills" — rejected.)

- **Crag:** amplitude 18–34 m (trees ≈ 10–13 m), r 70–120 m, rock weight 1 over the core.
- **Crater:** r 30–60 m (60–120 m diameter), bowl 5–8 m below ground (flat bottom to 0.3 r), low rim 2–3.5 m at 0.8 r; candidates on lowland ≥ `waterLevel + 9` with a ≤ 3–4 m probe ring so the floor stays dry; bowl area ≪ `lakeMinCells` (600) so hydrology never makes it a lake.
- **Dry bowl vs hydrology:** a depression is a pit, which 058 fills (or breaches). `landformCorrectionBypassAt` makes `sampleRawTexel` **ignore the hydrology correction inside a crater** (weight 1 to 0.85 r, fading to the footprint edge). Hydrology's own grid still sees the pit (it reads the raw floor), so a pit-fill/breach near it is not suppressed — only its effect on the terrain inside the footprint. Verified headless: conditioned floor == raw floor at the crater centres (2.3–3.8 m, `waterH` = sea level 0.45).
- **Bare ground:** `landformRockAt` → the *reported* `mountainRidge` (not the one in the height model — a first version fed it into the height and produced 30–60 m craters/crags). Grass fades with ridge (`MOUNTAIN_RIDGE_FADE_*`), trees are rejected at ridge ≥ 0.35 (`MOUNTAIN_RIDGE_REJECT`), rock exposure follows. No second vegetation mechanism.
- Caches bumped again (chunk tiles 31, hydrology 6, settlements 30, roads 18, caves 12, locations-coarse 9, cemeteries 15). Full suite 9285 green. Census: 3–5 landforms per seed; seed 415424794: crater `(-1150, -452)` r 58 m, crag `(3179, -1706)` r 99 m (floor 24 m), lake island `(2940, 1355)`.
- 🟡 Not observed in the browser. Dry-bowl neighbours: a river chain crossing a crater footprint is not excluded (not seen); roads/settlements do not yet avoid landform footprints (063 / Q61).

### R3 correction 3 — author 2026-11-05 (third look: crag good, crater shallow + stream floating, white rock)

- **Stream floated over the crater:** hydrology chains pass over the pit's filled surface, so the water ribbon hung above the bowl. `computeRiverTile` (the single source for ribbon, queries and carving) now drops chain points inside a crater footprint (`endChainsAtCraters`): the stream ends at the rim (dry sink) and restarts on the far side. Chains are post-processed, not recomputed — hydrology payload unchanged.
- **Crater deeper:** bowl 7–9.5 m (capped so the floor stays ≥ 2 m above the sea).
- **White rock:** not landform snow but `applyMountainRock`: snow tint started at 0.55 × `heightScale` (≈ 10 m) × ridge, so any 15 m rock with ridge 1 went white. Now by **metres: 45 → 75 m** × ridge (real snow lives in `snowField` at `SNOW_ALT_M` 60–140). ⚠ affects every mountain (noise massifs 25–40 m lose the white tint; ranges ≥ 60 m keep it) — a visual change beyond landforms, flagged for the author.
- **Crag:** rock/soil only on the top (weight 1 → 0 between 0.15 and 0.5 r); flanks keep grass. Geometry unchanged (18–34 m).
- Caches bumped again (chunk tiles 32, hydrology 7, settlements 31, roads 19, caves 13, locations-coarse 10, cemeteries 16). Full suite 9287 green. Not observed in the browser.

### R4 — pass-corridor grade on the final terrain (Sonnet, 2026-11-05, queue Q119)

`pnpm tsx scripts/perf/census-pass-grades.ts` — hydrology-corrected `sampleHeightAt` (production hydrology installed), 20 m steps along the corridor centreline, both directions; roads/pads not applied (separate shapers). No tuning.

| Seed | Pass | 20 m step max up / down | worst 100 m mean | steps > 12 % |
| --- | --- | --- | --- | --- |
| 42 | `-10_-5:0` | 24.2 / 18.4 % | 9.3 % | 6/60 |
| 42 | `4_5:0` | 25.8 / 19.3 % | 7.4 % | 3/60 |
| 42 | `5_-6:0` | 25.0 / 25.3 % | 8.9 % | 6/60 |
| 415424794 | `-10_-3:0` | 16.3 / 16.7 % | 9.5 % | 7/60 |
| 415424794 | `-10_-3:1` | 15.6 / 19.2 % | 5.6 % | 5/60 |
| 415424794 | `6_-7:0` | 19.7 / **41.0** % | **14.1 %** | 8/60 |

- 5 of 6 passes: worst 100 m mean ≤ 9.5 % (within the 12 % `maxGrade`); individual 20 m steps exceed it (detail-noise roughness, same class as R2 note).
- 🟡 `415424794` `rp:rs:6_-7:0` exceeds 12 % on a 100 m window (14.1 %, one 41 % step downhill) — a pass this steep would need switchbacks/route cost; whether the router still crosses it is a road census question (routed components stay 1 on `415424794`, see R4 re-census). Left for the author / Q61–063 close-out, not tuned here.
- Still not done: chunk-generation / hydrology boot time vs D7, peak memory, browser check (pass, summit, crater, lake island), landform preview layer.

### R4 — Node worldgen cost vs Q131 baseline (Sonnet, 2026-11-06, queue Q119)

`pnpm tsx scripts/perf/measure-worldgen-cost.ts --reps=3 --chunks=60` (Node/V8, WSL2, single thread; same protocol as the [Q131 note](../../research/v1-revival/2026-11-04--q131-cost-baseline-boot.md); two runs, 3 reps each; order seed 42 → `415424794`). Not browser, no FPS claim.

| Metric | Q131 baseline (42 / 415424794) | Now (42 / 415424794) | Verdict |
| --- | --- | --- | --- |
| hydrology sample (ms) | 3593–3897 / 3633–4368 | 3537–4529 / 3727–3882 | ✅ within ±20 % |
| hydrology compute (ms) | 647–751 / 631–672 | 613–761 / 546–651 | ✅ |
| chunk tile p50 / p95 (ms) | 6.8–7.3 / 7.9–11.8 | 6.8–7.6 / 10.0–12.4 | ✅ |
| layout (ms) | 621–671 / 531–572 | 683–702 / 678–694 | 🟡 +5 % / +25 % on `415424794` (layout also changed by Q37/Q93–Q95 settlement work — not attributable to relief) |
| all road routes (s) | 33.5–36.1 / 23.0–23.5 | 26.2–32.2 / 27.0–27.2 | ✅ 42 faster; 🟡 `415424794` +17 % (within ±25 %) |

Relief/landform work adds no measurable hydrology or chunk cost. Still not done: browser boot (`?bootMark=1`, cold/warm), peak worker memory, browser look at pass / summit / crater / lake island, landform preview layer.

### R4 — browser boot vs Q131 baseline (Sonnet, 2026-11-06, queue Q119)

`node scripts/perf/measure-cost-baseline.mjs 4173 <out> 415424794 <cold|warm> 3` — production build at `e053b44a`, `vite preview`, WSL2 Chrome (Mesa D3D12), n = 3; cold = fresh profile + `?worldgenFixture=0`, warm = reloaded profile (prime discarded). Raw JSON not committed. No FPS claim.

| State | Ready (s) | worldHydrology (ms) | buildSettlementsManager (ms) | createCaves (ms) | createWorldBundle (ms) | main-thread heap peak MiB |
| --- | --- | --- | --- | --- | --- | --- |
| cold (Q131) | 41.0 / 41.2 / 50.8 | 3324 / 2106 / 3994 | 2278 / 1798 / 3086 | 1078 / 1027 / 1478 | 19385 / 16841 / 26677 | 111–138 |
| cold (now) | 43.6 / 55.7 / 34.9 | 2126 / 3301 / 2589 | 3119 / 5090 / 3065 | 977 / 1426 / 999 | 19195 / 25573 / 19349 | 110–134 |
| warm (Q131) | 21.6 / 21.8 / 30.8 | 212 / 217 / 224 | 73 / 85 / 79 | 12 / 21 / 18 | 3492 / 4262 / 4504 | 88–110 |
| warm (now) | 20.2 / 20.6 / 21.1 | 194 / 198 / 200 | 78 / 83 / 90 | 25 / 13 / 18 | 3568 / 3571 / 3747 | 98–106 |

Verdict ✅ within the Q131 tolerances (±25 % ready/bundle, ±30 % per-phase): warm ready slightly faster; cold ready median 43.6 s vs 41.2 s (+6 %, one 55.7 s outlier). Workers: 6. 🟡 `buildSettlementsManager` cold median 3.1 s vs 2.3 s baseline (large spread; settlement work changed since Q131).
Peak **worker** memory not measured (the tool samples only the main-thread JS heap) — left open. Still not done: browser look at pass / summit / crater / lake island (author judgement), landform preview layer.

### R4 — author visual verdict + pass traversability (2026-11-06, queue Q119)

**Author look (browser, `415424794`):** summit OK (suggestion: more angular grey rock, less smoothing); crater OK (floor could be more concave — current relief leaves too-prominent knolls); lake island OK; passes look good, but the author could not confirm they saw `6_-7:0`. Overall geography accepted. 🟡 follow-ups (not blocking the freeze): crag/summit rock angularity, crater floor concavity.

**Traversability (Sonnet, technical, no browser walk):** `pnpm worldgen:travel:census --seeds=415424794 --routes-out=…` → `routedComponents 1` (all 22 settlements road-connected), `gradeShareOver10Pct 0`. Nearest routed polyline vs pass corridor centres: `6_-7:0` ← route `2_-8`–`6_-5` passes **87 m** from the centre (the road crosses that pass, so the router handles its 14.1 % / 41 % step); `-10_-3:1` ← `-10_2`–`-11_6` at 130 m; `-10_-3:0` nearest 662 m (not used by a road; passes only matter for roads where a route needs them). Walk limits: `SLOPE_FALLOFF_START_DEG` 35° (≈70 %), max 55°; a 41 % step ≈ 22° is not slowed for player/NPC movement, so the 12 % `maxGrade` is a road-design target, not a walkability limit. Not verified: a player/NPC actually walking the `6_-7:0` crossing.

### R4 — memory + landform preview layer (Sonnet, 2026-11-06, queue Q119)

- **Memory (browser, WSL2, `415424794`, n = 3, build at `e053b44a`+):** `measure-cost-baseline.mjs` now also records **total Chrome process-tree RSS peak** (browser + 6 workers' renderers + GPU/Mesa). Cold: 2487 / 2345 / 2546 MiB; warm: 2510 / 2440 / 2469 MiB; main-thread JS heap 97–125 MiB (unchanged vs Q131). **Per-worker peak is not measurable** via CDP (`Performance.getMetrics` returns nothing for worker targets; tried, dead code removed) — total RSS is the proxy. 🟡 Q131 recorded no RSS, so there is no pre-relief comparison; this is the new baseline for later slices. Cold ready 36.1 / 36.6 / 40.6 s, warm 20.7 s (another run, consistent with the table above).
- **Landform preview layer:** `--landforms` already existed in `continent-preview-png.ts` but had been broken since R3 (import of removed `landformDescriptorsFor`); fixed to `landformDescriptorsOf(params)`. Verified headless on `415424794`: 3 landforms, 2 spines, 3 passes drawn.

### R3 correction 4 — crater floor (author 2026-11-06, queue Q119)

Author: crater floor should be more concave; base-relief noise left too-prominent knolls inside the bowl. Fix: inside `t < 0.35` the floor is **replaced** (not offset) by a smooth concave dish — `landformHeightDeltaAt(index, x, z, baseH)` blends `baseH` → `bottom + 1.2 m · min(1, t/0.6)²` with weight `1 − smooth(0.35, 0.75, t)`; `bottom = ground − depth` is a new descriptor param fixed at generation (rand order unchanged → same landform placement). Rim unchanged. Verified on `415424794` `lf:crater:-7_-3` (r 58 m): the profile is identical in all four directions (2.45 → 2.48 → 2.58 → 2.75 → 3.3 m at t = 0 … 0.4, rim 13–15.6 m vs ~10 m surroundings). Caches bumped (chunk tile 32→33, hydrology 7→8, settlement defs →32, road routes →20, caves →14, locations-coarse →11, cemeteries →17); `WORLDGEN_EPOCH` untouched. Test added (noise invariance, concavity, edge continuity); full `vitest` 9411 green, type-check + lint clean. 🟡 Not browser-verified — author look pending (queue §2).
Rock angularity (summit/crag): design fork → queue §3 Q119-a.

### R3 correction 5 — angular rock outcrops (author 2026-11-06, option (b), queue Q119-a)

Author: crag/summit rock should read as angular grey rock; chose **(b)** a layer of large irregular rock objects standing 1–6 m above ground with colour noise (not the cave texture) over option (a) (the only "smoothing" at summits is `softCapSummitHeight` above 66 m, which would not give angularity).

- **New environment kind `rockOutcrop`** (decorative: no `resourceId`, no `id`, not mineable, not a landmark; `scale` = height in m). Reuses the existing chunk-environment pipeline (`computeChunkEnvironment` → `tile.environment` → procedural prop path in `chunkManager` + circle collider 0.4 m × scale). Relief is untouched.
- **Placement** `src/terrain/rockOutcrops.ts`: (1) **crag tops** — 5–9 per crag descriptor, seeded by descriptor id (identical across chunk borders; each chunk emits only those inside it), within 0.45 r of the centre; (2) **summit zones** — per-chunk 5 candidates × 55 % where floor ≥ 46 m and reported ridge ≥ 0.6; both reject water (+0.3 m) and road tint. Density census `pnpm tsx scripts/perf/census-outcrops.ts`: seed 42 ≈ 7 crag + ≈ 70 summit; `415424794` ≈ 7 + ≈ 95 (summit zones 10.5 / 14.2 ha).
- **Shape/colour** `createRockOutcrop(height, variant)` (`decorProps.ts`): 3–5 dodecahedron shards with position-keyed vertex jitter (watertight), stretched into tilted tapered slabs, ~20 % buried, merged into **one mesh / one draw call per outcrop**; flat-shaded; vertex colours from a grey granite `OUTCROP_PALETTE` with the existing blotch noise (no texture, so none of the cave stone colour).
- **Cache:** `CHUNK_TILE_CACHE_VERSION` 33→34 only (environment list changed; no height/hydrology change). `WORLDGEN_EPOCH` untouched — outcrops are decorative, not persisted entities.
- **Verification:** type-check, eslint, full `vitest` 9414 green; new tests `rockOutcrop.test.ts` (determinism, 1–6 m, buried, colour variation) and `rockOutcrops.test.ts` (summit-zone rule). 🟡 **Not browser-verified**: a headless `flyPose` shot could not frame the crag — look is the author's call (queue §2). Cost: outcrops only exist near crags/summits (~100/world), one mesh each, ~430 vertices; no per-frame work; not measured on the GPU.

**Landform / peak locations for browser checks (seed `415424794`, uncorrected floor, 2026-11-06)** — the older R3 coordinates in this file are stale (landforms moved with the R3 corrections): crater `lf:crater:-7_-3` (-1150, -452); crag `lf:crag:17_-10` (3179, -1706); lake island `lf:lakeIsland:16_7` (2940, 1355); highest peaks (-2322, -710) 76 m · (-2282, -970) 68 m · (1363, -1602) 64 m · (2283, -1962) 63 m. Seed 42: crater (1144, 2060), crag (-2082, -2960), peak (450, 1345) 71 m.

### R3 correction 6 — crater look 2 + rock misunderstanding (author 2026-11-06, queue Q119)

- **Crater:** floor flat but should be more concave in the middle → `CRATER_DISH_RISE_M` 1.2 → **3.5 m**, dish radius `t/0.6` → `t/0.75` (lowest in the centre, rises towards the rim). Caches bumped again (chunk tile 35, hydrology 9, settlement defs 33, roads 21, caves 15, cemeteries 18, locations-coarse 12). Tests green.
- **Rocks — misunderstanding:** the author did **not** mean standing shards (`rockOutcrop`, correction 5) but **patches of bare rock ≥ 10×10 m**: sharp irregular angular planes emerging from the softer existing surface mix (rock/soil/moss/snow). Question A (terrain-integrated Voronoi plates + rock colour) vs B (overlay plate meshes) in queue §3 Q119-b; `rockOutcrop` stays until the answer, then is removed.

### R3 correction 7 — bare-rock plates, terrain-integrated (author answer (A) 2026-11-06, queue Q119-b)

- **Implemented:** `src/terrain/rockPlates.ts` — jittered Voronoi grid of 9 m plates; a plate is rock by per-cell hash (probability 0.2 at the zone edge → 0.85 at zone 1), rock plates get their own tilted plane (slope ≤ 0.16, clamped ±0.8 m, sharp edges against neighbours) plus a `patch` weight. Neighbouring rock plates merge into patches ≥ 10×10 m; the rest stays soil/moss/snow. Pure function of `(seed, x, z, zone)` → identical across chunk borders. 🟡 defaults (author left open): cell 9 m, zone = **crag top (`landformRockAt(…, includeCrater=false)`) ∪ high ridge (`mountainRidge` 0.55→0.8)**, no plates within 1.5 m of the water level, **crater bowl excluded** (it stays the smooth dish).
- **Wiring:** `chunkHeightmap.ts` `sampleRawTexelUncorrected` adds `plate.delta` to `floorH` and raises the *reported* `mountainRidge` to `plate.patch` (grass thins, trees rejected, `applyMountainRock` colours it — no second vegetation mechanism). `RawSampleParams.rockPlates === false` disables it (cave heightfield debug fixture is pinned to the pre-plate relief, like its pre-060 mask).
- **Removed:** `rockOutcrop` (env kind, `createRockOutcrop`, `rockOutcrops.ts`, tests, `census-outcrops.ts`).
- **Cost:** 0.07 µs/sample inside the zone (Node microbench), 0 outside (gated on zone > 0.05).
- **Caches bumped** (height output changed): chunk tile 36, hydrology 10, settlement defs 34, roads 22, caves 16, cemeteries 19, locations-coarse 13. Tests green (unit + full suite). Not re-run after this bump: full pass-grade/hydrology re-census and `measure-worldgen-cost.ts` (plates move heights ≤ 0.8 m only on crags/ridges; grade impact on passes expected within noise — 🟡). `worldgen:fixture:check` was already STALE before this change (fixtures v6/v12/v25 vs current) — unchanged, tools-020.
- **Not browser-verified.** Look → queue §2 (crag `lf:crag:17_-10` (3179,-1706), peaks (-2322,-710) etc., seed `415424794`).

### R3 correction 8 — plates only on grey/white rock, grey colour, rough surface (author look 2026-11-06, queue Q119)

- **Author:** plates same colour as surroundings; also on green mountainsides; surface too smooth.
- **Fix:** zone = `rockPlateZoneOf(reported ridge)` = smoothstep(0.8, 0.95) (was 0.55–0.8 + crag), so plates exist only where the ground is already bare rock; crater damping ×0.3 of the delta. The plate no longer feeds the reported ridge (zone would be circular). Colour: `rockPlateColor.ts` recomputes the plate in the vertex-colour pass → cool light grey (0x7d8086–0xb4b7bc, per plate/facet tone, snow mix at height) over the warm-brown ridge rock. Roughness: second Voronoi layer of 2.6 m facets (slope ≤ 0.22, ±0.3 m) on top of the 9 m plane (total ≤ 1.1 m).
- Caches bumped again (chunk tile 37, hydrology 11, settlement defs 35, roads 23, caves 17, cemeteries 20, locations-coarse 14). Unit tests green; not browser-verified; far-tile colour has no plates (🟡).

### R3 correction 9 — sparser, softly blended, lower plates (author look 2026-11-06, queue Q119)

- **Author:** plates collide with rivers/objects (gold ore buried, only its label visible); too dense; straight hard edges visible for metres.
- **Fix:** `rockPlates.ts` — amplitude plane 0.6 + facets 0.2 (≤ 0.8 m); rock probability 0.7 → 0.12 at the zone edge and a coarse 40 m cluster gate keeps ~60 % of clusters (gaps between patches); plate borders domain-warped (wobbly, no straight lines); height fades to 0 over 2.8 m from a plate edge, colour over 5 m (edge distance from first/second nearest Voronoi site). Caches bumped (chunk tile 38, hydrology 12, settlement defs 36, roads 24, caves 18, cemeteries 21, locations-coarse 15).
- **Ore under plate (🟡 cause not confirmed):** deposits take `env.sampleHeight` (bilinear tile heights) while the mesh is triangulated; sharp ~1 m steps made the two disagree. Lower amplitude + soft edges shrink that gap; if it persists, give deposits a plate-free exclusion (re-check with the author). Rivers carve after the sampler, so the plate height is under the channel cut — not changed.

### R4 — re-measure after the rock-plate cache bump (Sonnet, 2026-11-06, queue Q119)

Re-run after caches chunk tile 36 / hydrology 10 / settlements 34 / roads 22 (plates move heights). Node/V8, WSL2; no browser, no FPS claim.

- **Pass grades** (`census-pass-grades.ts`): unchanged from the pre-plate numbers — 5/6 passes ≤ 9.5 % worst-100 m mean; 🟡 `415424794` `6_-7:0` still 14.1 % (one 41 % downhill step).
- **Travel** (`worldgen:travel:census`): `415424794` routed components **1**, 21 routed edges, `gradeShareOver10Pct` 0 on the author-relevant edges. Seed 42 routed components **4** (R2 re-census had 3) — 🟡 seed 42 reconnected less well after the later relief changes (crater/plates); a few edges carry 6.8–12.4 % of length over 10 % grade. Not tuned (relief freeze = measure only); candidate for the road close-out (Q61–Q64).
- **Cost** (`measure-worldgen-cost.ts --reps=3 --chunks=60`, last run): hydrology sample 3.6–4.2 s, compute 0.6–0.85 s, chunk p50 7–8 ms / p95 10–17 ms, layout 0.70–0.79 s, routes 26–30 s — ✅ within the Q131 tolerances (same as the earlier R4 cost table).

## Close-out (Opus, 2026-11-06)

Plan `done`: R0–R4 landed, author accepted R2 (2026-11-05) and the R3/R4 browser review (2026-11-06; queue Q119 archived). Hand-offs: seed 42 routed components 4 and the steep `6_-7:0` pass → road close-out Q61–Q64; ore-under-plate → re-check if it recurs; plates in the far-tile colour → world-terrain-066 if the author asks.

## Q166 — lake islands only where the basin holds water (Sonnet, 2026-11-07)

- `generateLandforms` now draws the lake-island `depth`/`knoll` **before** the pick and, per relax step, tests candidates best-score first with `lakeIslandHoldsWater` (local, acyclic: base relief + island profile, never hydrology). Rules: rim spill (min of 48 rim points at `radius`) minus 0.4 m margin must stand ≥ 1.5 m above the basin floor; wet area (24 m probe grid, `t ≤ 0.95`) ≥ 40 000 m² (hydrology `lakeMinCells` 600 × 8 m² = 3.84 ha); the knoll centre must clear the water level. Profile extracted to `lakeIslandDelta` (no change to the height formula).
- Census (`pnpm worldgen:outcomes:census --seeds=42,415424794,7,1234,99,2024,31337`): every placed island holds a lake (`OK`, 6–8/8 rim samples wet): 415424794 `lf:lakeIsland:9_9` (1707, 1681), 1234 `lf:lakeIsland:-16_11`, 2024 `lf:lakeIsland:7_19`. **No island** (shortfall reported, not forced) on seeds 42, 7, 99, 31337 — no flat-lowland candidate has a closed rim ≥ 1.5 m deep and ≥ 3.84 ha wet. Total landform counts (crag + crater + island): 42 → 2, 415424794 → 3, 7 → 3, 1234 → 5, 99 → 2, 2024 → 4, 31337 → 2, so the "3–5 on every seed" aim is missed on 3 of 7 seeds (all because the island is omitted and only 1 crag was drawn). Author decision if more are wanted: a deeper `depth` range (3.5–4.5 m today) or a wider flat-lowland tolerance.
- Old island coordinates in this file (`lf:lakeIsland:16_7`, `-1_13`) are stale for seeds 415424794 / 42.
- Caches bumped: `WORLD_HYDROLOGY_VERSION` 14→15, chunk tiles 41→42, settlement-def, road-route, caves, cemetery, locations-coarse (+1 each). No epoch bump (epoch-1 test saves disposable per roadmap cross-plan rules).
