# Implementation notes — world-terrain-065 terrain color/shading artifact correction

Plan: [`../world-terrain-065-terrain-color-and-shading-artifact-correction.md`](../world-terrain-065-terrain-color-and-shading-artifact-correction.md)
Recon: 2026-11-04 (Opus, static code reading against `main` @ `697157c4`+). Nothing here was browser-verified.

## 0. What changed vs. the plan's evidence section

- **Mesh spacing is not guaranteed to be 1 m.** `createWorldConfig()` (`src/config/worldConfig.ts:589`) takes `resolution` from `?res=` > localStorage (`stored.terrain.resolution`) > `DEFAULT_RESOLUTION = 65`. An author profile can carry 33 (2 m faces) or higher. `flatShading` is also persisted (`applyStoredTerrain`). Record the **effective** `config.terrain.resolution` and `flatShading` in every repro (GUI "Terrain mesh" folder shows both; triangle count is shown there too). The `WorldConfig` JSDoc saying "Default: 193" is stale — the code default is 65.
- **Sun shadow frustum default changed 3 days before the report.** `?shadowFrustum=tight` became the default on 2026-11-01 (`src/perf/flags.ts::shadowFrustumModeFromUrl`): ±56 m half-extent (`SHADOW_FRUSTUM_TIGHT_HALF`) centred 24 m **ahead of the player along camera forward** (`gameLoop.ts` ~2870–2882), instead of ±80 m centred on the player. Two shadow cadence flags are also default-on since 2026-11-01/02 (`shadowActorCadence`, `shadowMotionCadence`). The author has since excluded shadows (§1), so these are recorded only as context.
- three.js is **r185** (`package.json` `^0.185.1`); comments in `buildChunkGeometry.ts` still say r180. The include directives the terrain shader replaces (`#include <color_fragment>`, `<roughnessmap_fragment>`, `<normal_fragment_maps>`, `<opaque_fragment>`) all still exist in r185 `meshphysical.glsl.js` — verified.

## 1. Author facts (2026-11-04) and ranked hypotheses

✅ Author, after the first notes draft:
- **It was not shadows** (certain).
- Visible in **full sun on open terrain** (not only at the shoreline, not in shade).
- **Probably predates the hydrology change** (uncertain). The correction layer landed on 2026-11-03 in `5f127b450` ("058 H3 correction layer in sampleRawTexel"); its parent `5f127b450^` is the before/after checkpoint if the location is known.

So: shadow mechanisms are excluded, hydrology facets are demoted, and the search moves to screen-space post-processing, colour fields and per-fragment shading. Order the checks by cost; stop once one toggle **and** one data/debug view agree.

| # | Mechanism | Owner | Expected signature | Discriminator (existing control unless marked NEW) |
|---|---|---|---|---|
| P1 | **N8AO half-res reconstruction.** `halfRes = true`, `depthAwareUpsampling = true`, default quality `Performance` (`src/render/createPostProcessing.ts:81–87`). N8AO reconstructs normals from depth, which is planar per triangle; at grazing view angles over open ground that can turn into per-facet or banded darkening, and half-res upsampling widens it into larger blocks. Independent of the sun. | `createPostProcessing.ts` | **Screen-anchored**: shape changes with camera distance/pitch/FOV, does not stick to world XZ; unaffected by `?hour=`. | GUI "Ambient occlusion" off; then "AO quality" Low/Medium; "AO radius". |
| P2 | **God rays (screen-space radial blur).** `godRaysEnabled: true` by default (`worldConfig.ts:380`). `GodRaysShader` makes 32 samples toward the sun's screen position, weighted by a bright-pass, with no occlusion buffer, so bright ground is smeared into **straight-edged wedges radiating from the sun**. Active only while the camera faces the sun and sun elevation is below ~0.5 (`updateGodRays`: fade 0.12→0.5). `?godRaysSoft=0` selects the legacy shader. | `createPostProcessing.ts::updateGodRays`, `src/render/godRaysShader.ts` | Wedges point at the sun; appear/disappear when turning toward/away from the sun; gone at noon. | GUI "God rays" off; turn the camera 180°. |
| P3 | **Bloom** (`bloomEnabled: true`) on bright full-sun ground. | `createPostProcessing.ts` | Soft halos, not straight edges, so unlikely; cheap to exclude. | GUI "Bloom" off. |
| C1 | **Vertex-colour fields with polygonal contours.** Colour per vertex comes from `colorForTerrain()` + `biomeWeightsAt()` (`biomeColors.ts`, `biomeRegions.ts`), driven by simplex FBM fields (`m`, `moistureRegion`, `continentalness`, `mountainRidge` from `chunkHeightmap.ts::sampleRawTexelUncorrected`), blended with `lerpHSL`. Simplex lattices produce near-straight ridges and creases when a low-octave field feeds a narrow `smoothstep` or a hue blend; `sandBandAt` is a **single octave** of simplex at scale 560 m (shore only). Large patches fit this scale. | `biomeColors.ts`, `biomeRegions.ts`, `chunkMeshData.ts` | **World-anchored**; identical at every hour; present in the NEW `vertexColor` view. | NEW `vertexColor` view; headless colour PNG from `computeChunkMeshData` (§4). |
| C2 | **Shader macro colour noise.** `MACRO_COLOR_CHUNK` value noise (`terrainHash21` with `fract(p * vec2(123.34, 456.21))`) runs in float32 on `vWorldPos.xz * 0.045 … 2.1`. Far from the origin the products reach 1e5–1e6, so `fract` loses precision and the hash degenerates into structured, lattice-aligned patterns. Grid-aligned rather than triangular, but large. | `buildChunkGeometry.ts` (`MACRO_NOISE_FUNCS`, `MACRO_COLOR_CHUNK`, `MACRO_ROUGHNESS_CHUNK`) | World-anchored; present in the `albedo` view and absent in `vertexColor`; gets worse with distance from the world origin (log the world XZ). | NEW `albedo` vs `vertexColor` views; compare a spot near (0,0) with one far away. |
| S1 | **Detail normal map / tangent frame.** No tangent attribute, so three builds the TBN per fragment from screen derivatives (`getTangentFrame`, constant per triangle). Two tilings mixed by `vBareGround`, strength from the GUI, faded out over 20–50 m. In full sun, a per-triangle TBN difference shows up as lightness. | `buildChunkGeometry.ts` (`NORMAL_MAP_TWO_TAP`), `terrainDetailNormalMap.ts` | Only within ~50 m of the camera; follows mesh triangles (1 m at res 65). | GUI "Surface grain (detail normal)" → "Enabled" off (triggers a world rebuild); NEW `normal` view. |
| S2 | **Mesh settings from the author profile.** Persisted `flatShading: true` or a low `resolution` makes faceted lighting visible. | `worldConfig.ts` (`createWorldConfig`, `applyStoredTerrain`) | Every triangle is a flat facet. | Read the GUI "Terrain mesh" folder on the author's profile; compare with a fresh profile `?res=65`. |
| D1 | *(demoted — author)* **Hydrology correction facets.** Bilinear on an 8 m grid (`worldHydrologyStore.ts:131`, `RIVER_CELL_STEP = 8`); breach cones and flat fills. | `worldHydrology.ts`, `worldHydrologyStore.ts` | World-anchored; edges on 8 m world multiples; absent at `5f127b450^`. | NEW `normal` view; headless correction raster (§4); only if C1/C2/S1 fail. |
| D2 | *(demoted — open terrain)* **Shore bands:** `WET_SAND_CHUNK` (0.4 m band), seabed/sand/land smoothsteps, chunk water planes (`createWater.ts`). | as named | Only at the waterline. | `albedo` view; only if the repro is at a shore. |
| X | *(excluded — author)* Shadow frustum/near-plane/cadence (`createLights.ts`, 055/056 flags). | — | — | Do not A/B, unless every other hypothesis fails and the author agrees. |

Leading candidates are **P1/P2** (screen-space, cheap GUI toggles) and **C1/C2** (world-anchored, need the debug view). The first discriminator is therefore **screen- vs world-anchored**: move the camera sideways and change pitch while watching whether the patch edge stays on the same ground features.

## 2. Repro protocol (Gate A inputs)

- URL base: `/?seed=415424794&gui=1&camdebug=1` (+ `&hour=<H>` from `src/world/dayNight.ts:209`). `?camdebug=1` (`createCameraDebugOverlay.ts`) prints camera position; use it to log the pose.
- Fixed pose for A/B: `?fly&flyPose=x,z,h,yaw,pitch` (`src/debug/flyCam.ts`; `h` is height above ground). The fly camera does **not** move the player (shadow frustum and ocean stay behind; irrelevant now that shadows are excluded). Use small pose changes (x/z, pitch) to tell screen-anchored (P1/P2) from world-anchored (C1/C2/S1) patches. For player-view repro use normal play and log `camdebug` output.
- Kill noise: `&debugDisableSystems=grass,npcs,animals,weather,playerModel` (add `trees` for the terrain-only run). Values: `src/debug/debugMode.ts::DebugSystemName`.
- Fresh profile or explicit `?res=65` so a stored resolution does not leak in (the headless screenshot tool already uses a fresh Chrome profile: `scripts/tools/settlement-shot.mjs`; it only supports `flyPose=home`, so for a shoreline pose open the URL manually or copy its CDP capture pattern into a scratchpad script — do not add a new repo tool for this plan).
- Location: ask the author for the screenshot's position (`?camdebug=1` readout), hour and whether the camera faced the sun (P2); record the request in queue §3. Meanwhile, search open, sunlit reference-seed terrain at a few hours (e.g. `hour=10`, `12`, `16`), facing towards and away from the sun.
- If reproduced and D1 is still in doubt, run the same URL on a worktree at `5f127b450^` (before the hydrology correction) — never mix numbers or screenshots across machines.

## 3. Instrumentation decision (dev-only, URL-gated, part of A)

Static recon cannot separate C1/C2/S1/D1 with existing controls — there is no way to see raw vertex colour or geometric normals, and the scene is not exposed on `window`. Add **one** dev-only debug view, owned by the terrain material:

- `src/debug/debugMode.ts`: `export type TerrainDebugView = 'vertexColor' | 'albedo' | 'normal' | 'bareGround'` (dedicated union type) and `terrainDebugViewFromUrl(): TerrainDebugView | null` reading `?debugTerrainView=`. Follow the existing `try { new URLSearchParams(window.location.search) } catch` + `typeof window === 'undefined'` pattern of `isSystemEnabled()` (the material is also built in tests/node).
- `src/terrain/buildChunkGeometry.ts::applyTerrainSurfaceShader`: when a view is set, replace `#include <opaque_fragment>` with a direct write and keep everything else unchanged:
  - `vertexColor` → `vColor.rgb` (pre-shader per-vertex colour; `USE_COLOR` is defined because `vertexColors: true`),
  - `albedo` → `diffuseColor.rgb` (after dirt/macro/wet-sand/weather chunks),
  - `normal` → geometric vertex normal, not the detail-normal-mapped `normal` (use `normalize( vNormal ) * 0.5 + 0.5`; view-space is fine for spotting creases),
  - `bareGround` → `vec3( vBareGround )`.
  Append the view to `customProgramCacheKey` (`chunk-terrain-surface[-detail]-v8` + `-dbg-<view>`) or three will reuse the normal program. No new materials, no per-chunk variants: still one shared material created by `chunkManager.ts:1282`.
- Thread it in by reading the flag inside `createTerrainMaterial()` (it is only called from `chunkManager.ts`), so no new constructor parameter crosses `ChunkManager`. `OutputPass` still applies colour-space/tone mapping; that is acceptable for relative comparison — say so in the report.
- Optional, only if water planes cannot be excluded otherwise: add `'water'` to `DebugSystemName` and skip `addTo(scene)` for chunk water + ocean in their existing owners. Do not add it pre-emptively.
- Keep the instrumentation after the fix (it is the reproduction tool for regressions); document it in the diagnostic report and in `docs/STATE.md` debug-flag list if one exists for terrain (check `docs/state/` before writing).

Tests: extend `src/terrain/buildChunkGeometryMaterial.test.ts` (it already compiles/inspects the injected shader) — assert that with a view set the fragment contains the override and the cache key differs, and without it the shader is byte-identical to today.

## 4. Headless data checks (no GPU)

For C1 (and D1 if reopened), a scratchpad `pnpm tsx` script (not committed unless it becomes a reusable tool) over a ~200 × 200 m window around the repro point:

- Hydrology install pattern: copy from `scripts/tools/continent-preview-png.ts` (it builds and `installWorldHydrology()`s the world's hydrology before sampling).
- Correction field = `sampleFloorAt(x,z,p) − sampleRawFloorUncorrected(x,z,p)` (`chunkHeightmap.ts:705–709`); non-zero = breach (<0) or fill (>0). Lake level: `hydrologyLakeLevelAt`.
- Run the real `computeChunkMeshData()` for the chunk(s) and dump `color`/`normal`/`positionY` as PNGs; compare visible edge orientation/spacing with the 8 m hydrology grid, 1 m mesh diagonals and 64 m chunk borders.
- If D1 is confirmed, the deterministic test belongs next to the owner: `src/terrain/worldHydrologyView.test.ts` (existing hydrology sampling tests; there is no `worldHydrologyStore.test.ts`) or `src/terrain/chunkMeshData.test.ts` (e.g. normal discontinuity across a correction-cell line below a threshold).

## 5. Fix ownership by confirmed cause (B) — and where to stop and ask

- **P1 N8AO / P3 bloom:** configuration only in `createPostProcessing.ts` (e.g. `halfRes`, `depthAwareUpsampling`, radius/falloff); a quality-preset default or cost change → measured WSL A/B + **ask** (039 owns the AO budget).
- **P2 god rays:** owner `godRaysShader.ts` + `updateGodRays`. A bright-pass/sky-only mask fix (rays from sky pixels only, not lit ground) is a correctness fix; disabling by default or reducing quality is a visual compromise → **ask**.
- **C1:** fix the field/blend in `biomeColors.ts`/`biomeRegions.ts` without changing palettes (e.g. smoother blend, extra octave on a single-octave field). Colour is not persisted (see below), but a change to a persisted grid such as `biomes`/`moistureRegion` in `chunk-tiles` would be → bump `CHUNK_TILE_CACHE_VERSION`.
- **C2:** make the shader hash precision-safe (e.g. wrap `p` with `mod(p, 289.0)` before hashing, or hash in a chunk-relative frame); bump `customProgramCacheKey` (`-v9`); no new uniforms or passes.
- **S1:** owner `NORMAL_MAP_TWO_TAP` / detail normal map; strength is a GUI knob — do not hardcode a "cut" (see the comment in `createTerrainMaterial`, issue 014).

- **Shadow system (excluded by the author; only if reopened):** owner is `createLights.ts` + `gameLoop.ts` shadow centre, but defaults belong to `world-terrain-055`/`056`. Reverting a default (`tight` → `legacy`, cadence flags off) or changing frustum size/near/far is a **visual/perf trade-off → stop and ask the author** with measured options; a perf A/B is required for any frustum/cadence change (WSL baseline first, never mix with Windows). A correctness fix that does not change cost (e.g. a soft fade of shadow strength toward the frustum edge inside the existing shadow chunk, or keeping near/far covering terrain height range) still needs before/after screenshots at noon and low sun.
- **D1 (hydrology correction):** smoothing the correction (e.g. a smoother kernel than bilinear in `hydrologyCorrectionAt`, or C1 cone/fill shaping in `worldHydrology.ts`) changes deterministic worldgen output → bump the hydrology/terrain cache fingerprint and assess `WORLDGEN_EPOCH` per `src/persistence/worldgenEpoch.ts` (heights move under placed objects). Persisted tile grids live in the `chunk-tiles` worldgen cache (`src/terrain/chunkTileWorldgenCache.ts`, `CHUNK_TILE_CACHE_VERSION = 26`, stores `floorHeights` etc.) → bump it; the hydrology data has its own cache owner (check `src/persistence/worldgenFixtureNamespaces.ts`). This is a worldgen change touching 058 — **ask before landing**; verify with `pnpm tsx scripts/tools/continent-preview-png.ts` before/after.
- **D2 shore colour bands:** fix in `biomeColors.ts` / `WET_SAND_CHUNK`; must not change palettes. `ChunkMeshData` is not persisted (`src/terrain/chunkMeshCache.ts` is an in-memory LRU; the `chunk-tiles` cache stores input grids, not colours), so a colour-only change needs no cache bump and no `WORLDGEN_EPOCH` bump — verify that the change does not alter any persisted grid.
- **Water planes:** owner `createWater.ts`/`waterMaterial.ts`; keep one shared geometry per chunk.

## 6. Pitfalls

- `computeVertexNormals()` must never be called on chunk geometry (seam mismatch; see `computeChunkMeshData` JSDoc).
- `normal` in the fragment shader after `normal_fragment_maps` already includes the detail normal map — use `vNormal` for geometric creases.
- Do not edit `src/` while a benchmark is running (Vite serves the live tree).
- Terrain receives shadows from trees/props too; "terrain self-shadow off" alone does not remove shadows on terrain.
- Fly mode leaves the player (and therefore the tight shadow frustum centre and the ocean follow) behind.
- Never claim visual correctness from tests; final acceptance is the author's (queue §2).
