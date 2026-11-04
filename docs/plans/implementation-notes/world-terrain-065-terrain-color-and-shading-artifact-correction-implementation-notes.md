# Implementation notes — world-terrain-065 terrain color/shading artifact correction

Plan: [`../world-terrain-065-terrain-color-and-shading-artifact-correction.md`](../world-terrain-065-terrain-color-and-shading-artifact-correction.md)
Recon: 2026-11-04 (Opus, static code reading against `main` @ `697157c4`+). Nothing here was browser-verified.

## 0. What changed vs. the plan's evidence section

- **Mesh spacing is not guaranteed to be 1 m.** `createWorldConfig()` (`src/config/worldConfig.ts:589`) takes `resolution` from `?res=` > localStorage (`stored.terrain.resolution`) > `DEFAULT_RESOLUTION = 65`. An author profile can carry 33 (2 m faces) or higher. `flatShading` is also persisted (`applyStoredTerrain`). Record the **effective** `config.terrain.resolution` and `flatShading` in every repro (GUI "Terrain" folder shows both; triangle count is shown there too). The `WorldConfig` JSDoc saying "Default: 193" is stale — the code default is 65.
- **Sun shadow frustum default changed 3 days before the report.** `?shadowFrustum=tight` became the default on 2026-11-01 (`src/perf/flags.ts::shadowFrustumModeFromUrl`): ±56 m half-extent (`SHADOW_FRUSTUM_TIGHT_HALF`) centred 24 m **ahead of the player along camera forward** (`gameLoop.ts` ~2870–2882), instead of ±80 m centred on the player. Two shadow cadence flags are also default-on since 2026-11-01/02 (`shadowActorCadence`, `shadowMotionCadence`). These are the most recent changes in the shading path and must be A/B'd first.
- three.js is **r185** (`package.json` `^0.185.1`); comments in `buildChunkGeometry.ts` still say r180. The include directives the terrain shader replaces (`#include <color_fragment>`, `<roughnessmap_fragment>`, `<normal_fragment_maps>`, `<opaque_fragment>`) all still exist in r185 `meshphysical.glsl.js` — verified.

## 1. Ranked hypotheses and the cheapest discriminator for each

"Large straight-edged triangular patches near a shoreline" fits several mechanisms. Order the A/B by cost; stop once one toggle **and** one data view agree.

| # | Mechanism | Owner | Expected signature | Discriminator (existing control unless marked NEW) |
|---|---|---|---|---|
| H1 | **Shadow-frustum boundary.** Outside the shadow camera's ortho box three returns "lit" (`shadowmap_pars_fragment`: `inFrustum && shadowCoord.z <= 1.0`). The box is square in light space, so its footprint on the ground is a parallelogram whose edges cut terrain/tree shadows along long straight lines. Tight mode moves the box with camera **yaw**. | `src/world/createLights.ts` (`follow`, `SHADOW_FRUSTUM_*`), `gameLoop.ts` shadow centre | Edge moves when rotating the camera (tight) or walking; disappears/moves with `?shadowFrustum=legacy`; varies with `?hour=`. | `?shadowFrustum=legacy`; GUI "Terrain self-shadow" off; `debugDisableSystems=trees,grass` to remove other casters. |
| H2 | **Shadow depth range / near plane.** Sun sits at `followTarget(y=0) + sunOffset` (length ≈ 86 m), `near=1`, `far=200`, sun elevation floored at `MIN_SUN_DIRECTION_Y = 0.28` (≈ 24 m above y=0 at low sun). Elevated terrain or casters can fall in front of the near plane → clipped from the map; the clip plane intersects sloped ground in a straight line. Also acne at bias `-0.0002` on 1024² over 112–160 m. | `createLights.ts` | Depends on sun angle and player altitude; straight line where clip plane meets ground; acne as fine stripes rather than big patches. | `?hour=12` vs low-sun hour; `terrainCastsShadow` off; GUI "Shadow map size" 512/1024. |
| H3 | **Shadow refresh cadence lag.** S1/S2 cadences skip shadow-map refreshes while the frustum centre moves or only actors move, so the map can be one frame stale relative to `sun.position`. | `src/perf/flags.ts`, `shadowBudget.ts`, `gameLoop.ts` | Only during motion; static screenshot clean. | `?shadowMotionCadence=0&shadowActorCadence=0`. |
| H4 | **Hydrology correction facets.** `hydrologyCorrectionAt()` (`src/terrain/worldHydrologyStore.ts:131`) is **bilinear on an 8 m grid** (`RIVER_CELL_STEP = 8`, `riverNetwork.ts:18`). Breach cuts are cones (`worldHydrology.ts` ~531–540, `breachSideSlope`), filled pits are near-flat (`pitEpsM 0.05` + ε gradient). Both add C0-only surfaces with creases on 8 m cell lines → normal discontinuities (lighting) and near-constant heights inside shore smoothsteps (color). Shorelines are exactly where breaches to the sea and filled coastal pits occur. | `worldHydrology.ts` (generation), `worldHydrologyStore.ts` (sampling), consumed via `sampleRawTexel` in `chunkHeightmap.ts:664` | World-anchored, static, independent of camera/sun position; edges on multiples of 8 m in world XZ (grid origin `h.originX/originZ`); visible in normal view (H4a: lighting) or albedo view (H4b: color). | NEW `normal`/`vertexColor` debug views (§3); headless correction raster (§4). |
| H5 | **Vertex-color thresholds on near-flat ground.** `colorForTerrain()` (`biomeColors.ts:128`) blends seabed→sand within ±0.25 m (`SEABED_BLEND`) and sand→land within ±0.35–0.5 m of `waterLevel + sandBand`; `applySlopeRock` is a steepness ramp on central-difference normals. On a plateau sitting inside one of those bands, the per-vertex result is interpolated linearly across each triangle, so the colour boundary follows triangle edges. With 1 m faces this only reads as "large triangles" when the plateau itself is large and planar (→ usually H4 underneath). Also note `lerpHSL` between distant hues. | `src/terrain/biomeColors.ts`, `src/terrain/chunkMeshData.ts` | World-anchored; survives `vertexColor` view; disappears under the lit-but-shadowless view only if it is lighting. | NEW `vertexColor` view. |
| H6 | **Shader height bands on planar triangles.** `WET_SAND_CHUNK` darkens 38 % across `waterLevel .. +0.4 m` of `vWorldPos.y`, which is linear per triangle. Same planar-plateau caveat as H5. | `buildChunkGeometry.ts` (`WET_SAND_CHUNK`) | Visible in `albedo` view but **not** in `vertexColor` view. | NEW `albedo` vs `vertexColor` views. |
| H7 | **N8AO half-res reconstruction.** `aoPass.configuration.halfRes = true`, `depthAwareUpsampling = true` (`src/render/createPostProcessing.ts:86–87`), default quality `Performance`. Screen-space, blotchy at depth discontinuities such as the water plane edge. | `createPostProcessing.ts` | Screen-space: changes with camera distance/FOV, not world-anchored. | GUI "Ambient occlusion" off; "AO quality"; "AO transparency-aware". |
| H8 | **Water planes over sand.** Chunk water (`src/world/createWater.ts::createChunkWater`) draws a sea plane at `waterLevel + 0.07` plus one lake plane per distinct lake level, cover-masked by a linear-filtered heightmap texture; `maskHeightsForLakeLevel` uses `DRY_LIFT = 10` m jumps. Ocean singleton is a 64-segment plane (`createOcean.ts`), hidden inside `fadeInner`. Segments = `min(resolution - 1, 256)`, i.e. same face size as terrain. | `createWater.ts`, `waterMaterial.ts`, `createOcean.ts` | Translucent tint only where floor ≈ water level; lake plane bleeding would show at a lake level, not sea level. | `water reflections` off is **not** enough — hide via DevTools is not possible (no global scene handle). Use the `vertexColor` view: if the patch persists with water visible on top, compare with camera under/over; else temporarily add `water` to `DebugSystemName` (§3, optional). |

The current evidence (shoreline, large, straight, triangular) makes **H1 and H4** the leading candidates. Do not treat this ranking as a finding.

## 2. Repro protocol (Gate A inputs)

- URL base: `/?seed=415424794&gui=1&camdebug=1` (+ `&hour=<H>` from `src/world/dayNight.ts:209`). `?camdebug=1` (`createCameraDebugOverlay.ts`) prints camera position; use it to log the pose.
- Fixed pose for A/B: `?fly&flyPose=x,z,h,yaw,pitch` (`src/debug/flyCam.ts`; `h` is height above ground). The fly camera does **not** move the player, so in fly mode the shadow frustum stays at the player — that is itself a useful discriminator (H1: artifact edge stays world-fixed while flying away; walk to move it). For player-view repro use normal play and log `camdebug` output.
- Kill noise: `&debugDisableSystems=grass,npcs,animals,weather,playerModel` (keep `trees` when testing H1 — trees are the main shadow casters near shore; add `trees` only for the terrain-only run). Values: `src/debug/debugMode.ts::DebugSystemName`.
- Fresh profile or explicit `?res=65` so a stored resolution does not leak in (the headless screenshot tool already uses a fresh Chrome profile: `scripts/tools/settlement-shot.mjs`; it only supports `flyPose=home`, so for a shoreline pose open the URL manually or copy its CDP capture pattern into a scratchpad script — do not add a new repo tool for this plan).
- Location: ask the author for the screenshot's position (`?camdebug=1` readout) — record the request in queue §3. Meanwhile, any reference-seed shoreline with flat sand and a tree line is a valid first search area.

## 3. Instrumentation decision (dev-only, URL-gated, part of A)

Static recon cannot separate H4/H5/H6/H8 with existing controls — there is no way to see raw vertex colour or geometric normals, and the scene is not exposed on `window`. Add **one** dev-only debug view, owned by the terrain material:

- `src/debug/debugMode.ts`: `export type TerrainDebugView = 'vertexColor' | 'albedo' | 'normal' | 'bareGround'` (dedicated union type) and `terrainDebugViewFromUrl(): TerrainDebugView | null` reading `?debugTerrainView=`. Follow the existing `try { new URLSearchParams(window.location.search) } catch` + `typeof window === 'undefined'` pattern of `isSystemEnabled()` (the material is also built in tests/node).
- `src/terrain/buildChunkGeometry.ts::applyTerrainSurfaceShader`: when a view is set, replace `#include <opaque_fragment>` with a direct write and keep everything else unchanged:
  - `vertexColor` → `vColor.rgb` (pre-shader per-vertex colour; `USE_COLOR` is defined because `vertexColors: true`),
  - `albedo` → `diffuseColor.rgb` (after dirt/macro/wet-sand/weather chunks),
  - `normal` → geometric vertex normal, not the detail-normal-mapped `normal` (use `normalize( vNormal ) * 0.5 + 0.5`; view-space is fine for spotting creases),
  - `bareGround` → `vec3( vBareGround )`.
  Append the view to `customProgramCacheKey` (`chunk-terrain-surface[-detail]-v8` + `-dbg-<view>`) or three will reuse the normal program. No new materials, no per-chunk variants: still one shared material created by `chunkManager.ts:1282`.
- Thread it in by reading the flag inside `createTerrainMaterial()` (it is only called from `chunkManager.ts`), so no new constructor parameter crosses `ChunkManager`. `OutputPass` still applies colour-space/tone mapping; that is acceptable for relative comparison — say so in the report.
- Optional, only if H8 cannot be excluded otherwise: add `'water'` to `DebugSystemName` and skip `addTo(scene)` for chunk water + ocean in their existing owners. Do not add it pre-emptively.
- Keep the instrumentation after the fix (it is the reproduction tool for regressions); document it in the diagnostic report and in `docs/STATE.md` debug-flag list if one exists for terrain (check `docs/state/` before writing).

Tests: extend `src/terrain/buildChunkGeometryMaterial.test.ts` (it already compiles/inspects the injected shader) — assert that with a view set the fragment contains the override and the cache key differs, and without it the shader is byte-identical to today.

## 4. Headless data checks (no GPU)

For H4/H5, a scratchpad `pnpm tsx` script (not committed unless it becomes a reusable tool) over a ~200 × 200 m window around the repro point:

- Hydrology install pattern: copy from `scripts/tools/continent-preview-png.ts` (it builds and `installWorldHydrology()`s the world's hydrology before sampling).
- Correction field = `sampleFloorAt(x,z,p) − sampleRawFloorUncorrected(x,z,p)` (`chunkHeightmap.ts:705–709`); non-zero = breach (<0) or fill (>0). Lake level: `hydrologyLakeLevelAt`.
- Run the real `computeChunkMeshData()` for the chunk(s) and dump `color`/`normal`/`positionY` as PNGs; compare visible edge orientation/spacing with the 8 m hydrology grid, 1 m mesh diagonals and 64 m chunk borders.
- If H4 is confirmed, the deterministic test belongs next to the owner: `src/terrain/worldHydrologyView.test.ts` (existing hydrology sampling tests; there is no `worldHydrologyStore.test.ts`) or `src/terrain/chunkMeshData.test.ts` (e.g. normal discontinuity across a correction-cell line below a threshold).

## 5. Fix ownership by confirmed cause (B) — and where to stop and ask

- **H1/H2/H3 (shadow system):** owner is `createLights.ts` + `gameLoop.ts` shadow centre, but defaults belong to `world-terrain-055`/`056`. Reverting a default (`tight` → `legacy`, cadence flags off) or changing frustum size/near/far is a **visual/perf trade-off → stop and ask the author** with measured options; a perf A/B is required for any frustum/cadence change (WSL baseline first, never mix with Windows). A correctness fix that does not change cost (e.g. a soft fade of shadow strength toward the frustum edge inside the existing shadow chunk, or keeping near/far covering terrain height range) still needs before/after screenshots at noon and low sun.
- **H4 (hydrology correction):** smoothing the correction (e.g. a smoother kernel than bilinear in `hydrologyCorrectionAt`, or C1 cone/fill shaping in `worldHydrology.ts`) changes deterministic worldgen output → bump the hydrology/terrain cache fingerprint and assess `WORLDGEN_EPOCH` per `src/persistence/worldgenEpoch.ts` (heights move under placed objects). Persisted tile grids live in the `chunk-tiles` worldgen cache (`src/terrain/chunkTileWorldgenCache.ts`, `CHUNK_TILE_CACHE_VERSION = 26`, stores `floorHeights` etc.) → bump it; the hydrology data has its own cache owner (check `src/persistence/worldgenFixtureNamespaces.ts`). This is a worldgen change touching 058 — **ask before landing**; verify with `pnpm tsx scripts/tools/continent-preview-png.ts` before/after.
- **H5/H6 (colour thresholds):** fix in `biomeColors.ts` / `WET_SAND_CHUNK`; must not change palettes. `ChunkMeshData` is not persisted (`src/terrain/chunkMeshCache.ts` is an in-memory LRU; the `chunk-tiles` cache stores input grids, not colours), so a colour-only change needs no cache bump and no `WORLDGEN_EPOCH` bump — verify that the change does not alter any persisted grid.
- **H7 (N8AO):** configuration only in `createPostProcessing.ts`; any quality-preset default change → ask (039 owns the budget).
- **H8 (water):** owner `createWater.ts`/`waterMaterial.ts`; keep one shared geometry per chunk.

## 6. Pitfalls

- `computeVertexNormals()` must never be called on chunk geometry (seam mismatch; see `computeChunkMeshData` JSDoc).
- `normal` in the fragment shader after `normal_fragment_maps` already includes the detail normal map — use `vNormal` for geometric creases.
- Do not edit `src/` while a benchmark is running (Vite serves the live tree).
- Terrain receives shadows from trees/props too; "terrain self-shadow off" alone does not remove shadows on terrain.
- Fly mode leaves the player (and therefore the tight shadow frustum centre and the ocean follow) behind.
- Never claim visual correctness from tests; final acceptance is the author's (queue §2).
