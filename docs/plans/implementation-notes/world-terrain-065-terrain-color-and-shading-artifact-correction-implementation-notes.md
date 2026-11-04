# Implementation notes — world-terrain-065 terrain color/shading artifact correction

Plan: [`../world-terrain-065-terrain-color-and-shading-artifact-correction.md`](../world-terrain-065-terrain-color-and-shading-artifact-correction.md)
Recon: 2026-11-04 (Opus, static code reading against `main` @ `697157c4`+). Nothing here was browser-verified.

## 0. What changed vs. the plan's evidence section

- **Mesh spacing is not guaranteed to be 1 m.** `createWorldConfig()` (`src/config/worldConfig.ts:589`) takes `resolution` from `?res=` > localStorage (`stored.terrain.resolution`) > `DEFAULT_RESOLUTION = 65`. An author profile can carry 33 (2 m faces) or higher. `flatShading` is also persisted (`applyStoredTerrain`). Record the **effective** `config.terrain.resolution` and `flatShading` in every repro (GUI "Terrain mesh" folder shows both; triangle count is shown there too). The `WorldConfig` JSDoc saying "Default: 193" is stale — the code default is 65.
- **Sun shadow frustum default changed 3 days before the report.** `?shadowFrustum=tight` became the default on 2026-11-01 (`src/perf/flags.ts::shadowFrustumModeFromUrl`): ±56 m half-extent (`SHADOW_FRUSTUM_TIGHT_HALF`) centred 24 m **ahead of the player along camera forward** (`gameLoop.ts` ~2870–2882), instead of ±80 m centred on the player. Two shadow cadence flags are also default-on since 2026-11-01/02 (`shadowActorCadence`, `shadowMotionCadence`). The author has since excluded shadows (§1), so these are recorded only as context.
- three.js is **r185** (`package.json` `^0.185.1`); comments in `buildChunkGeometry.ts` still say r180. The include directives the terrain shader replaces (`#include <color_fragment>`, `<roughnessmap_fragment>`, `<normal_fragment_maps>`, `<opaque_fragment>`) all still exist in r185 `meshphysical.glsl.js` — verified.

## 1. Author facts (2026-11-04) and ranked hypotheses

✅ Author, in two rounds after the first notes draft:
- **Not shadows and not lighting** (certain). The defect is at the **joins of terrain tiles (chunks)**.
- Seen around **noon**, in full sun, on open terrain, **camera looking down at the ground** (not toward the sun).
- The patches **did not move** with the camera, so they are world-anchored.
- **Probably older than the hydrology correction** (`5f127b450`, 2026-11-03; uncertain).

This **excludes** shadows, god rays (camera not facing the sun; noon is above their fade-out), N8AO/bloom as the cause (screen-space) and lighting in general. The search is now **chunk-seam data consistency** and **per-chunk presentation**. ❓ Still unknown: whether a patch is a thin strip along the join, a triangle spanning a few metres from the join, or a whole chunk-sized area of a different tone. Ask for the screenshot (§2).

Background: seams are meant to be invisible by construction. Each chunk samples an **apron** grid one step wider than its core (`apronOriginWorld`, `computeChunkTile` in `chunkHeightmap.ts`), core vertices land exactly on apron texels, normals are central differences on that apron (`computeChunkMeshData` JSDoc), and colours are pure functions of world position plus the tile grids. A seam therefore appears **only if two neighbours' grids disagree at shared world points**, or if the presentation differs per chunk.

| # | Mechanism | Owner | Expected signature | Discriminator |
|---|---|---|---|---|
| S1 | **Stale persisted tile next to a freshly generated neighbour.** `chunk-tiles` IndexedDB cache (`src/terrain/chunkTileWorldgenCache.ts`) is keyed by `CHUNK_TILE_CACHE_VERSION` (26) + `worldgenFingerprint(ChunkTileParams)`. The fingerprint covers **inputs**, not **generator code**; a code change to `sampleRawTexel`/colour-relevant grids without a version bump keeps old tiles alive. Neighbours generated at different times then disagree in `floorHeights`/`biomes`/`roadTint`/… along the whole join. There is no URL bypass flag; a fresh browser profile has an empty cache. | `chunkTileWorldgenCache.ts`, `src/persistence/worldgenCacheDb.ts` | Whole-chunk tone or height offset with a step exactly on a 64 m chunk line; differs between the author's profile and a fresh profile at the same pose. | Same URL/pose in the author's profile vs a fresh/incognito profile (or after clearing site data). Headless: S2 test with cache off always passes → points to S1. |
| S2 | **Per-chunk inputs culled without the apron margin.** Tile params are gathered per chunk centre with a box of exactly `chunkSize` (`chunkManager.ts` ~1471–1480: `segmentsNear(x, z, config.chunkSize, …)`, `fordsNear`, `bridgesNear`, `villageSegmentsNear`, river segments). The apron extends **one step beyond** that box. A road/path/clearing/regional-smoothing/river segment whose influence reaches only the apron ring is dropped for one chunk but present in its neighbour's core, so `floorHeights`/`roadTint` differ at shared points. `segmentsNear` adds `corridorHalfWidthMargin(halfWidth, wobble)`; check whether that margin covers the full falloff (shoulder/blend) **and** the apron step. Also check `applyRegionalSmoothing`/clearings, which pick the strongest single segment per texel. | `chunkManager.ts` (tile params), `src/settlement/roadNetwork.ts` (`segmentsNear`, `villageSegmentsNear`, `fordsNear`, `bridgesNear`), `chunkHeightmap.ts` (`applyTerrainCorridors`, `applyRegionalSmoothing`, `applyRiverChannel`) | Mismatch only where a road/path/village/river influence ends near a chunk line; colour (road dirt) and normals (lighting) differ across the join. | NEW deterministic seam test (§4): build adjacent tiles + mesh data with the real params and compare shared edges. |
| S3 | **Runtime modifications replayed into one tile only.** `applyModificationToTile` (`chunkManager.ts` ~947) is designed to be applied to every overlapping chunk; `prepare` writes exact samples only on grid-aligned points of the chunk being processed. A replay path that skips a neighbour (e.g. one not loaded at the time, then loaded from cache) leaves one side modified. | `chunkManager.ts` (modification replay, `attachChunkMesh`) | Only where the player dug/scorched/prepared ground or a settlement/house prepare ran; scorch also changes colour (`SCORCH_CHARCOAL`). | Check whether the location has modifications (dig/scorch/building prepare); the seam test with one `TerrainModification` straddling a chunk line. |
| S4 | **Per-chunk grass LOD step.** Grass density and geometry tiers are chosen per chunk from the Chebyshev chunk distance (`grassLodForDistance`, `grassMainCapFor` with the far-band cap CA2 on by default, filler radius). Seen from above, grass coverage *is* the ground colour, so neighbouring chunks at different LOD read as differently toned areas with straight edges on the chunk lines. Steps move when the player crosses a chunk line, not with the camera. | `chunkManager.ts` grass LOD, grass system | Whole-chunk (or chunk-band) tone differences, changes after walking one chunk; absent with grass off. | `debugDisableSystems=grass`; `?grassMainCap=0`; GUI "Grass filler coverage" 1. |
| S5 | **Cut-geometry chunks.** Chunks overlapping a cave cutout take `buildCutGeometry` (`terrainCutout.ts` marching squares) instead of the regular sheet; re-triangulation can produce longer triangles. | `terrainCutout.ts`, `buildChunkGeometry.ts` | Only next to a cave mouth. | Location check. |
| S6 | **Colour-only data mismatch** (`biomes`, `moistureRegion`, `continentalness`, `mountainRidge`, `roadTint` apron grids) between neighbours, even with matching heights. Same root causes as S1–S3, but visible only in colour. | as S1–S3 | Colour step on the join, lighting identical. | NEW `vertexColor` view (§3) + seam test comparing `color`. |

Ranking: **S1 and S2 first** (they are data mismatches exactly on chunk lines, independent of the camera and sun, and fit "probably older than hydrology"). **S4** is next if the patches are whole-chunk tone differences. The screen-space and shading candidates from the previous draft (N8AO, god rays, bloom, shader noise precision, detail-normal TBN, hydrology facets, shore bands) are **excluded or demoted**; revisit them only if the seam test and profile A/B are both clean.

## 2. Repro protocol (Gate A inputs)

- URL base: `/?seed=415424794&gui=1&camdebug=1` (+ `&hour=<H>` from `src/world/dayNight.ts:209`). `?camdebug=1` (`createCameraDebugOverlay.ts`) prints camera position; use it to log the pose.
- Fixed pose for A/B: `?fly&flyPose=x,z,h,yaw,pitch` (`src/debug/flyCam.ts`; `h` is height above ground). The fly camera does **not** move the player (shadow frustum and ocean stay behind; irrelevant now that shadows are excluded). Fly along a chunk line to see whether the mismatch runs along the whole join or only near roads/villages (S2). For player-view repro use normal play and log `camdebug` output.
- Kill noise: `&debugDisableSystems=grass,npcs,animals,weather,playerModel` (add `trees` for the terrain-only run). Values: `src/debug/debugMode.ts::DebugSystemName`.
- Fresh profile or explicit `?res=65` so a stored resolution does not leak in (the headless screenshot tool already uses a fresh Chrome profile: `scripts/tools/settlement-shot.mjs`; it only supports `flyPose=home`, so for a shoreline pose open the URL manually or copy its CDP capture pattern into a scratchpad script — do not add a new repo tool for this plan).
- Location: ask the author for the screenshot file and position (`?camdebug=1` readout); record the request in queue §3. Chunk lines are at multiples of 64 m in world XZ (`chunkSize`; chunk (cx, cz) is centred at `cx·64, cz·64`, so lines at `±32 + 64k`) — check the screenshot pose against them.
- Profile A/B (S1): same URL and pose in the author's normal profile and in a fresh profile. Only the author's profile has the old IndexedDB tiles.

## 3. Instrumentation decision (dev-only, URL-gated, part of A)

The seam test (§4) settles the data question headlessly; in the browser there is still no way to see raw vertex colour or geometric normals (the scene is not exposed on `window`), which is needed to tell a colour seam (S6) from a normal seam and to confirm the fix visually. Add **one** dev-only debug view, owned by the terrain material:

- `src/debug/debugMode.ts`: `export type TerrainDebugView = 'vertexColor' | 'albedo' | 'normal' | 'bareGround'` (dedicated union type) and `terrainDebugViewFromUrl(): TerrainDebugView | null` reading `?debugTerrainView=`. Follow the existing `try { new URLSearchParams(window.location.search) } catch` + `typeof window === 'undefined'` pattern of `isSystemEnabled()` (the material is also built in tests/node).
- `src/terrain/buildChunkGeometry.ts::applyTerrainSurfaceShader`: when a view is set, replace `#include <opaque_fragment>` with a direct write and keep everything else unchanged:
  - `vertexColor` → `vColor.rgb` (pre-shader per-vertex colour; `USE_COLOR` is defined because `vertexColors: true`),
  - `albedo` → `diffuseColor.rgb` (after dirt/macro/wet-sand/weather chunks),
  - `normal` → geometric vertex normal, not the detail-normal-mapped `normal` (use `normalize( vNormal ) * 0.5 + 0.5`; view-space is fine for spotting creases),
  - `bareGround` → `vec3( vBareGround )`.
  Append the view to `customProgramCacheKey` (`chunk-terrain-surface[-detail]-v8` + `-dbg-<view>`) or three will reuse the normal program. No new materials, no per-chunk variants: still one shared material created by `chunkManager.ts:1282`.
- Thread it in by reading the flag inside `createTerrainMaterial()` (it is only called from `chunkManager.ts`), so no new constructor parameter crosses `ChunkManager`. `OutputPass` still applies colour-space/tone mapping; that is acceptable for relative comparison — say so in the report.
- Keep the instrumentation after the fix (it is the reproduction tool for regressions); document it in the diagnostic report and in `docs/STATE.md` debug-flag list if one exists for terrain (check `docs/state/` before writing).

Tests: extend `src/terrain/buildChunkGeometryMaterial.test.ts` (it already compiles/inspects the injected shader) — assert that with a view set the fragment contains the override and the cache key differs, and without it the shader is byte-identical to today.

## 4. Headless data checks (no GPU)

**First and cheapest (S2/S3/S6): a deterministic seam test.** Add it to `src/terrain/chunkMeshData.test.ts` (or a new `chunkSeam.test.ts` beside it). For the reference seed, pick chunk pairs that straddle a road/path, a village edge (`clearings`/`regional`), a river, a coast and plain meadow. For each pair:
Existing coverage: `src/terrain/chunkHeightmap.test.ts` → `describe('chunkHeightmap seams')` already checks shared `heights`/`floorHeights` of adjacent tiles, but **only with empty `roadSegments`/`clearings`/`regional`/`riverSegments`** and not the colour grids or mesh data. Extend that suite rather than starting a parallel one.

1. build both `ChunkTileParams` the way `chunkManager.ts::paramsFor` (line ~1419) does. `paramsFor` is a closure over the manager's road/settlement context, so it is not reachable from a test. Prefer calling the same query functions (`segmentsNear`, `villageSegmentsNear`, `fordsNear`, `bridgesNear`) with a road context built the way existing road-network tests build one; if that is impractical, hand-place a road segment whose corridor ends 0–2 m past the shared edge (that is exactly the S2 case). Do not copy `paramsFor` wholesale,
2. compute both tiles (`computeChunkTile`) and both `computeChunkMeshData()` results,
3. compare the shared edge: core column `resolution-1` of the west chunk with column `0` of the east chunk (rows likewise for N/S). Assert equal `positionY`, `normal`, `color`, `bareGround` (tolerance ~1e-5), and that both chunks' apron rings equal the neighbour's adjacent core texels for every tile grid.

Report the first failing field and its world XZ; that names the owner. A failure only on road/village pairs points at S2 query margins. If every pair passes, the data are consistent and the cause is S1 (stale cache), S3 (runtime replay) or S4 (presentation).

Only if the seam test is clean but the patch is still world-anchored: a scratchpad `pnpm tsx` script (not committed unless it becomes a reusable tool) over a ~200 × 200 m window around the repro point:

- Hydrology install pattern: copy from `scripts/tools/continent-preview-png.ts` (it builds and `installWorldHydrology()`s the world's hydrology before sampling).
- Correction field = `sampleFloorAt(x,z,p) − sampleRawFloorUncorrected(x,z,p)` (`chunkHeightmap.ts:705–709`); non-zero = breach (<0) or fill (>0). Lake level: `hydrologyLakeLevelAt`.
- Run the real `computeChunkMeshData()` for the chunk(s) and dump `color`/`normal`/`positionY` as PNGs; compare visible edge orientation/spacing with the 8 m hydrology grid, 1 m mesh diagonals and 64 m chunk borders.
- If hydrology facets are reopened and confirmed, the deterministic test belongs next to the owner: `src/terrain/worldHydrologyView.test.ts` (existing hydrology sampling tests; there is no `worldHydrologyStore.test.ts`) or `src/terrain/chunkMeshData.test.ts` (e.g. normal discontinuity across a correction-cell line below a threshold).

## 5. Fix ownership by confirmed cause (B) — and where to stop and ask

- **S1 stale cache:** bump `CHUNK_TILE_CACHE_VERSION` with a changelog line (the cache itself is correct by design). Record in the report which generator change shipped without a bump, and add a guard if a cheap one exists (e.g. a generator-version constant included in the fingerprint). Do not bump `WORLDGEN_EPOCH` unless save-referenced output changes.
- **S2 query margins:** widen the per-chunk query box to cover the apron step **plus** each influence's full falloff, in the existing query functions (`segmentsNear` etc.) or at the single call site; do not add a second query path. Tile output changes for affected chunks → bump `CHUNK_TILE_CACHE_VERSION`; assess `WORLDGEN_EPOCH` (placements may shift near roads) per `src/persistence/worldgenEpoch.ts`.
- **S3 modification replay:** fix in the replay owner in `chunkManager.ts` so every overlapping chunk receives the modification; add a straddling-modification test.
- **S4 grass LOD:** a visible density step is a visual/perf trade-off of the grass LOD (CA2, filler coverage) → **stop and ask** with screenshots and a WSL A/B.

- **Excluded/demoted candidates** (N8AO, god rays, bloom, shader-noise precision, detail-normal TBN, shadows, hydrology facets, shore bands, water planes): out of scope unless the seam test and the profile A/B are both clean; then re-plan with the author before touching them. Hydrology or any other persisted-grid change still follows the cache/`WORLDGEN_EPOCH` rules above and needs author approval (058 ownership).

## 6. Pitfalls

- `computeVertexNormals()` must never be called on chunk geometry (seam mismatch; see `computeChunkMeshData` JSDoc).
- `normal` in the fragment shader after `normal_fragment_maps` already includes the detail normal map — use `vNormal` for geometric creases.
- Do not edit `src/` while a benchmark is running (Vite serves the live tree).
- Terrain receives shadows from trees/props too; "terrain self-shadow off" alone does not remove shadows on terrain.
- Fly mode leaves the player behind; grass LOD (S4) follows the **player's** chunk, so judge S4 in normal play or move the player.
- A fresh browser profile hides S1 (empty cache); always also test the author's profile.
- Never claim visual correctness from tests; final acceptance is the author's (queue §2).
