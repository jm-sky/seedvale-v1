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

**Screenshot evidence** (author, captured 2026-11-04 13:33, local-only file `_temp/screenshots/terrain-artifacts.jpg`, gitignored; read it with the Read tool):
- HUD: **09:15**, spring, weather **"Mgła" (fog)**, 11 °C, so not noon. The player's shadow is long. North-up minimap, player arrow pointing north, so the camera roughly faces north and world X/Z ≈ screen axes.
- Place: open sand at a lake/sea shore, with water on the left and a pond lower right. The minimap shows inland lakes and rivers, i.e. a 058 lake area.
- The sand shows **several large planar areas of uniform tone, roughly 20–40 m across**, separated by **crisp straight edges**. Three or four edges **meet near the player**. With a north-facing camera most edges run **diagonally** (~30–45° on screen), so they are **not** the axis-aligned 64 m chunk grid. Edges that do look axis-aligned and a 4-way crossing would be the signature of a chunk corner; check that against `camdebug` coordinates.
- The **shoreline itself is a polygon of long straight segments** (both water bodies), not a smooth contour. That means the **height surface is piecewise planar at a scale far above the 1 m mesh** here. The colour/tone patches are then just the sun shading differently-tilted planes, which is why it reads as "not lighting".
- Ground fog is active (`src/world/groundFog.ts`: 5 upright, player-facing translucent cards 18–32 m wide, 30–45 m from the player, only for `weather.type === 'fog'`, not covered by `debugDisableSystems`). They can add straight-edged light veils where a card meets the terrain. The author also saw the defect in clear weather, so fog is at most an overlay here, not the cause.

**Second screenshot** (author, 2026-11-05 16:48, local-only `_temp/screenshots/terrain-artifacts - mountains.jpg.png`; taken after terrain-060 R1–R2 `7f40e4fb` and far-terrain F1 `f3f01284`, so on `CHUNK_TILE_CACHE_VERSION` 27):
- HUD 13:34, spring, weather **"Mgła" (fog) again**, 11 °C. Mountain slope, no roads/villages/grass blades in view, a stream at upper left.
- Large regions of uniform tone (sunlit green vs blue-grey, fog-coloured) with **straight edges and a right-angle corner** ~15–40 m from the player; the surface relief (detail normals, ripples) continues unbroken across the edges, so the step is a **tone/colour overlay, not a height crease**.
- Static findings (Opus, 2026-11-05, not browser-verified):
  - `region` passed to `biomeWeightsAt` in `computeChunkMeshData` is the global `config.region`, not a per-chunk value — excluded.
  - There is no terrain mesh LOD; `castShadow` is the only per-chunk terrain presentation flag.
  - Base fields (`sampleFloorAt`, range spines, landforms, hydrology correction) are pure functions of world XZ with global stores that throw when not installed — no silent per-worker fallback. With no roads in view, S2/S3 do not apply.
  - **S7 (new, ranked first for both screenshots): ground-fog cards.** Both screenshots are in fog. `src/world/groundFog.ts` puts 5 upright `MeshBasicMaterial` cards (18–32 m wide, `transparent`, `depthTest: true`, `fog: false`, no soft-particle depth fade) 30–45 m from the player, 0.3–1.6 m above the ground sampled at the card **centre**. The texture `public/images/fog/fog-blend-01.png` has alpha 0 on all borders but up to ~91/255 in its bottom band, so on a slope the dense bottom band is **cut by the terrain along a hard straight line** and the card reads as a straight-edged grey veil over the ground. Cards are world-anchored (they only rotate to face the player), matching "patches do not move with the camera".
  - S7 conflicts with the author's earlier remark that the defect was also seen in clear weather (§1). ❓ Ask the author.
- **Cheapest discriminator:** the same place with `?debugDisableSystems=weather` (disables the ground-fog group via `isSystemEnabled('weather')`), or the same pose in clear weather. If the patches disappear, the owner is `groundFog.ts` (fix options: a depth-fade soft-particle edge, or horizontal/ground-hugging cards; both are a visual choice, so **ask** first), not terrain data.

**S7 excluded (author, 2026-11-05):** with `?debugDisableSystems=weather` the green squares are still visible.

### Root cause found — terrain height creases (Opus, 2026-11-05, against `main` @ `e235c01c`)

Headless Chrome on the author's Vite (`:5577`, fresh profile, `?fly&flyPose=…&flyTop&hour=12&debugDisableSystems=npcs,animals,weather,grass,playerModel,trees,fog`) plus a headless `sampleFloorAt` raster (1 m step, hillshade + second-difference crease map). Local images are under `_temp/screenshots/agent-065/` (gitignored).

**Excluded with evidence:**
- **Chunk-seam data (S1/S2/S6).** In the browser, the shared edges between home and non-home chunks, and between ordinary neighbours, are identical: `position.y`, `color` and `normal` differ by 0.0000. The material is shared (one uuid), and all chunks have the same `castShadow`/`receiveShadow`/`renderOrder`.
- **Shadows.** `renderer.shadowMap.enabled = false` and `?shadowFrustum=legacy` leave the patterns unchanged.

**Confirmed causes.** Both are piecewise-smooth **height** fields with C¹ breaks, so sunlit facets meet at sharp straight or curved edges.
1. **Range spines (terrain-060 R1–R2, `7f40e4fb`, 2026-11-05)**, `src/terrain/rangeSpines.ts::sampleRangeSpines`. Summit (−2340, −680) top-down shot `mtn-top.png`; crease maps `crease-raw.png` (no hydrology) and `crease-summit.png`. Crease lines radiate from one point, with arcs about 110 m out; the second difference reaches 1.4 m/m².
   - Core profile `core = (1 − d/coreHalfWidth)^1.5` has a non-zero slope at d = 0. A cross-section of `summitM` through the crest is a tent: 28.8 m at the crest, falling linearly by about 1.2 m per 8 m on both sides. The result is a sharp ridge line along the spine.
   - `closestOnPolyline` measures distance to a 9-vertex polyline with segments hundreds of metres long. That gives straight crest lines and a bisector crease on the concave side of each vertex, where `t` (and so summit/pass terms) jumps.
   - Hard `max()` compositions create crease lines where the two fields cross: `spine.gate` vs `noiseGate`, `spine.crest` vs `ridge01`, `gate`/`crest`/`summitM` across spines.
   - These lines are then bent by the Worley warp.
2. **Hydrology correction (058 H3, `5f127b450`, 2026-11-03)**, `worldHydrologyStore.ts::hydrologyCorrectionAt`. Crease map `crease-corr.png`: wherever a fill or breach is non-zero (up to +5.6 m here), the crease map shows an exact **8 m square grid**. Bilinear interpolation on the 8 m cell grid has slope breaks on every cell line, so fills read as square tiles and as planar facets. This also explains the first (shore) screenshot (polygonal shoreline, planar sand facets), which predates 060.

**Fix directions (not implemented; both change persisted worldgen output, so the chunk-tile/hydrology cache must be bumped and `WORLDGEN_EPOCH` assessed; 058/060 ownership, so ask the author first):**
- **Spines:** a C¹ crest profile, e.g. `core = smoothstep(1, 0, d/coreHalfWidth)` or `(1 − u²)^k`; smoothed/densified spine polyline or a blended `t` near vertices; smooth max (`smax`) instead of hard `max` for the gate and crest unions.
- **Hydrology:** C¹ interpolation of the correction, e.g. smoothstep-weighted bilinear or bicubic over the existing 8 m cells, keeping drainage guarantees (breach depth must still cut the channel; re-run the census and golden hash).

### Fix implemented (Opus, 2026-11-05)

Author decision 2026-11-05: **A — fix both** (spines + hydrology). The crease maps showed a third, larger source: the Worley ridge itself (pre-060, but switched to full strength under a spine). The radiating fan of lines at the summit came from a Voronoi vertex.

| Source | Change | Owner |
|---|---|---|
| Worley ridge `1 − (F2 − F1)` | F2 → `smin(F2, F3, 20 m)` (polynomial, exact where F3 − F2 ≥ 20 m); gap rounded at the ridge line with `roundCrease(g, 40 m)` (`g²(2a − g)/a²` below `a`, identity above, so nothing farther than 40 m from a ridge line changes); 0-floor as softplus (k 0.04). Evaluated only where `mountainGate > 0` (identical output, saves the 3×3 scan in lowland). | `src/terrain/worleyNoise.ts` |
| Spine crest V | core profile on the nearest segment's `roundCrease(d, 50 m)` distance; crest height and profile beyond 50 m unchanged | `src/terrain/rangeSpines.ts` |
| Spine `t` jump on concave-vertex bisector | `t` = softmin-weighted blend of per-segment arc lengths (60 m). *Distances are not averaged:* a first attempt did average them, which lifted the crest near every vertex and lowered the top peaks by up to 6 m (census). | `rangeSpines.ts::blendedOnPolyline` |
| Hard `max` unions (gate, crest, massif envelope) | `unionWithSpine`: polynomial smooth max with softness fading to 0 as both inputs → 0 (lowland stays exact `max`; overshoot ≤ 0.025) | `rangeSpines.ts`, `chunkHeightmap.ts` |
| Pass factor stepping to 1 at the envelope edge (it scales the noise gate too) | `1 − (1 − pf) · envelope` | `rangeSpines.ts` |
| Hydrology correction 8 m squares | bicubic Catmull-Rom over 4×4 cells (exact at cell centres, reproduces ramps, C¹; may overshoot by a few % next to a single-cell cut); empty-block fast path and same-block direct indexing | `src/terrain/worldHydrologyStore.ts::hydrologyCorrectionAt` |

**Bumps:** `CHUNK_TILE_CACHE_VERSION` 28, `WORLD_HYDROLOGY_VERSION` 3, `ROAD_ROUTE_CACHE_VERSION` 15, `SETTLEMENT_DEFINITION_CACHE_VERSION` 27, `CAVES_V2_VERSION` 9, `ABANDONED_CEMETERY_VERSION` 12, `LOCATIONS_COARSE_VERSION` 6 (same set as 060 R1–R2). **No `WORLDGEN_EPOCH` bump:** epoch 1 is the open Revival batch (060 plan G1). The worldgen boot fixtures in `public/worldgen-fixtures/` were already stale since 060 (version mismatch → plain cache miss); re-export them separately.

**Measurements** (headless `sampleFloorAt`, seed 415424794, 301 × 301 m around the summit (−2340, −680), 1 m step; second difference in m):

| | max | p99.9 | p99 | samples > 0.3 |
|---|---|---|---|---|
| before (`main` @ `ebfd6563`) | 1.417 | 0.953 | 0.340 | 1048 |
| after | 0.301 | 0.215 | 0.160 | 1 |

Hydrology correction alone: max 0.360 → 0.160, samples > 0.15 501 → 6.

- **Relief census** (`census-range-spines.ts 415424794,42`):
  - Top peaks 77.4 → 77.3 m (415424794) and 69.3 → 70.8 m (42); crestMax within ±2.5 m.
  - Pass max grades were already above the 0.12 target before this change and are about unchanged (060 R1 issue, not this plan).
  - **Cross-slope on `rp:rs:-10_-3:0` rose from 14.0 % to 23.9 %**, and on `:1` from 10.5 % to 16.6 %. This is the smooth union now lifting the gate near the passes. Watch it in the 060 R2 review / pass-corridor work.
- **River census** (`census-rivers.ts --network`, both seeds):
  - 0 dry sinks, 0 edge drains; mouth errors unchanged.
  - Stream density 11.99 → 12.01 km/km² (415424794) and 12.34 → 12.43 (42); lakes 19 → 20 and 15 → 14.
  - Parallel-pair "artifact?" candidates on 415424794 rose from 2 to 4 (runs 150–166 m, just over the 150 m threshold) — note for tools-026.
- **Cost of `sampleFloorAt`** (min of 6 × 160 k samples, node):
  - lowland around home 1.226 → 1.130 µs (−8 %, from the lazy Worley);
  - summit 1.574 → 1.741 µs (+10.6 %).
  - Worker chunk generation was not measured in the browser. Any FPS/streaming claim → queue §4.
- **Tests:** full suite green (9276); `grassPlacement` golden snapshot updated (heights in the seed-42 mountain chunk moved slightly; blade counts 87 → 89 / 12 → 11 in chunk (−18, 6)). New test: hydrology correction has no slope break on cell lines.

**Separate finding (not this defect):** at the home spawn, the per-chunk sea water inside the 3×3 home block is lighter than the water outside it. The step sits on the ±96 m chunk lines, and on land there is no step (`home-terrain-250.png`). This is a water presentation seam (chunk water vs. outer chunks/ocean ring), related to Q98, not terrain.

### Reopened — third screenshot after the fix (2026-11-05, not yet diagnosed)

✅ Author, 2026-11-05: the defect is **still visible after the C¹ fix** — "widać łączenie kwadratów na terenie" (square joins are visible on the terrain). New local screenshot `_temp/screenshots/terrain-artifacts - ground.jpg` (file time 2026-11-05 20:52, ~2 h 40 min after `09c033db` landed at 18:12). The plan is back to `in progress`; **no diagnosis or fix was done in this session** (author: record conclusions only).

What the screenshot shows (Opus, read from the image only, not browser-verified):
- HUD **11:46**, spring, weather **"Deszcz" (rain)**, 10 °C. Open lowland/foothill terrain with scattered clover/grass, no road, village or water in view; the minimap shows relief with a river to the west. Camera looks steeply down at the player.
- A **straight-edged diagonal band** runs from the upper centre through the player to the lower right. Inside it the **wet specular sheen is much brighter** than outside; its left edge is a crisp straight line over the whole visible length, and the lower-right part meets a darker area along another straight edge. Further up, a curved bright specular lobe sits next to the band.
- Unlike screenshot 1 (fog, shore) and 2 (fog, mountain), this is **rain**, a third weather type, and **away from mountains and shores**, so it is not explained only by the spine/Worley/hydrology creases the fix targeted.

🟡 Conclusions (hypotheses, not verified):
- Rain makes the terrain glossy, so the sun highlight is very sensitive to the surface normal. A crisp straight specular step therefore means **either a remaining normal (C¹) break** in the height field, **or a step in a roughness/wetness term**, along a straight line. Both read as "joined squares".
- Candidates to check, in order:
  1. **Remaining height creases from other terrain terms** not touched by 065 — regional smoothing / clearings / corridor falloffs (`chunkHeightmap.ts`: `applyRegionalSmoothing`, `applyTerrainCorridors`; picks the strongest single segment per texel, a hard switch), landforms, or the hydrology correction where the bicubic still overshoots next to a single-cell cut. Discriminator: headless crease map (§ Root cause, 1 m step) at this pose.
  2. **Wetness/roughness presentation step** in the terrain material (`src/terrain/buildChunkGeometry.ts`, wetness driven from `src/world/weather.ts` / `gameLoop.ts`) — e.g. a per-chunk or grid-quantised wetness/puddle term. Discriminator: same pose in clear weather vs rain; if the band vanishes in clear weather but the crease map is clean, the owner is the material.
  3. **Chunk-seam data** (S1–S6): excluded for screenshot 2 at `e235c01c` (identical shared edges), but not re-checked at this pose. A band edge exactly on a 64 m chunk line would reopen it.
- ❓ Did the author's tab actually run `09c033db` (page reloaded after 18:12)? The tile cache version bump drops old tiles, so a reload is enough.

**Next session's first steps:** get the pose (`?camdebug=1` or the author), then (1) crease map + `sampleFloorAt` cross-sections at that pose, (2) clear vs rain at the same pose, (3) check whether the edges line up with the 64 m chunk grid or the 8 m hydrology cells.

**Re-ranking after the screenshot:** the polygonal shoreline is the strongest single clue. Something makes the **terrain height planar over tens of metres** near shores and lakes. The prime candidate is the **global hydrology correction layer** (bilinear on 8 m cells; priority-flood fills with an ε gradient over D8 neighbours; `terminalMinCells` raises small below-sea inland components; lake rule in `sampleRawTexel`). Despite the author's "probably older" (uncertain), the screenshot was taken after it landed (`5f127b450`, 2026-11-03). A raised or filled area sitting on bilinear 8 m patches near `waterLevel` gives exactly flat facets and straight water contours. Chunk-seam data mismatch (S1–S3) remains second, decided by the coordinates. **First checks:**
1. Get the pose (`?camdebug=1`) or locate this shore on seed `415424794` from the minimap shape. Sample `sampleFloorAt − sampleRawFloorUncorrected` (correction) and `hydrologyLakeLevelAt` over ±60 m (§4). Non-zero correction under the facets settles it.
2. Same pose at `5f127b450^` (worktree, pre-correction) vs `main`, fresh profile, clear weather (there is no URL weather override; use the GUI "Pora roku / Pogoda" folder or `debugDisableSystems=weather` and confirm the fog cards are gone).
3. Only then the seam test (§4 first block) and the profile A/B (S1).

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
