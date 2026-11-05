# Implementation notes — world-terrain-066 far terrain ring

Plan: [`../world-terrain-066-far-terrain-ring.md`](../world-terrain-066-far-terrain-ring.md) · Queue: Q146

## F0 recon (Opus, 2026-11-05, `main` @ `72bba8fe`)

Evidence = headless measurements (`scripts/tools/far-terrain-recon.ts`, reproducible) + code reading + browser screenshots (WSL2 Chrome D3D12, fresh profile, seed `415424794`). Nothing here is a performance claim.

### 1. Map-raster heights vs runtime chunk heights

`buildMapTile()` rasterizes `sampleRawTexelAt()` = the analytic field **plus** the global-hydrology correction and lake rule (`chunkHeightmap.ts::sampleRawTexel`). ✅ So range spines, breach cuts, filled pits and lake surfaces are already in it. Streamed chunks (`computeChunkTexel`) add three more stages that the raster never has: regional village smoothing, road/clearing corridors, river channel carving (+ ford/bridge projection).

Measured with `pnpm tsx scripts/tools/far-terrain-recon.ts [--seed=…] [--areas=home,range] [--radius=6]` — 13 × 13 chunks (832 m square) per area, every 2nd mesh vertex, full `ChunkTileParams` (roads, village, rivers, fords, bridges as `ChunkManager.paramsFor` builds them; cemetery inputs omitted, they do not shape height):

| Seed / area | Shaped − raw floor, p01 / p99 / min / max (m) |
| --- | --- |
| 415424794 home (0, 0) | river chunks −2.74 / +0.17 / −4.99 / +2.05 · road/village −0.33 / +0.52 / −1.71 / +2.67 · plain 0 |
| 415424794 range (−2340, −680) | river −2.74 / 0 / −4.69 / +2.97 · road −1.06 / +0.65 / −2.2 / +2.6 · plain 0 |
| 42 home | river −2.65 / +0.02 / −6.93 / +2.16 · road −3.3 / +0.21 / −6.59 / +1.5 · plain 0 |

Far-mesh candidates, interpolated bilinearly on a world-aligned grid and compared with the shaped near floor at dry points (`poke` = far above near, `gap` = near − far). Wet sea/lake points counted separately. River ribbons are not modelled, so river-chunk pokes are an upper bound. Excerpt (full tables: rerun the script):

| Area · category | Rule | dry poke > 0.25 m | poke max | gap p50 / p95 / p99 (m) |
| --- | --- | --- | --- | --- |
| 415 range · plain | raw, 4 m grid | 1.7 % | 0.9 | 0 / 0.19 / 0.44 |
| 415 range · plain | raw, 8 m | 13.9 % | 1.84 | 0.01 / 0.6 / 1.39 |
| 415 range · plain | raw, 16 m | 25.8 % | 3.28 | 0.1 / 1.68 / 3.97 |
| 415 range · plain | **V3 min-of-9 ±16 m − 1.5, 8 m** | 0 | 0 | **9.29 / 17.9 / 23.47** |
| 415 range · plain | min-of-9 ±4 m − 1.0, 4 m | 0 | 0 | 2.97 / 6.1 / 8.02 |
| 415 range · river | raw, 4 m | 12.5 % | 4.6 | 0 / 0.16 / 0.31 |
| 415 range · river | V3 min-of-9, 8 m | 0.9 % | 1.94 | 4.49 / 10.72 / 14.44 |
| 415 home · plain | raw, 8 m | 17.6 % | 1.24 | 0.01 / 0.59 / 0.86 |
| 415 home · plain | V3 min-of-9, 8 m | 0 | 0 | 3.66 / 6.32 / 7.41 |
| 42 home · road | raw, 4 m | 8.7 % | 6.57 | 0 / 0.24 / 0.44 |

Conclusions:

- ✅ **No new height pipeline is needed.** The raster is the exact unshaped runtime surface. Off roads/rivers/villages, the only error is interpolation: about 0.2 m p95 at a 4 m grid, 0.6 m at 8 m, 1–1.7 m at 16 m.
- ❌ **V3's min-of-9 rule does not fit V1 relief.** On the 060 range slopes it sinks the far surface 9 m (p50) to 23 m (p99) below the real ground, and still 3–7 m on the home plains. At the hand-off this would read as a visible downward step at ~190 m. Smaller radii only shrink the step (±4 m: 3–8 m on the range). They do not remove it, and they still poke through in river beds (min rule p99 poke 1–2 m).
- ✅ **Use raw heights and clip the far mesh where near terrain exists.** Far vertex = raster height (minus ≤ 0.3 m, plus `polygonOffset` as a belt). Fragments over chunks whose terrain mesh is attached are discarded with a small chunk-residency mask texture (world-anchored, one texel per chunk, updated only when residency changes). Near and far then never overlap, so pokes inside the ring do not matter and there is no z-fighting. At the ring edge the seam step is the interpolation error above, plus up to 2–7 m where a road cut or river channel crosses the edge (local notches, 190 m+ away, in haze). Rule 3 of the plan changes accordingly (see §6).
- **Rivers are absent from the raster surface.** Carved channels and ribbons exist only in streamed chunks, so with fog pushed out, rivers end at the ring edge (screenshot §5). The raster tile already returns river polylines (`riverPoints`/`riverRuns`, width-filtered per step). A flat far ribbon from them is a cheap F1/F3 option.
- Lakes: raster `heights` = water surface over the floor, and `classes` = `InlandWater`/`Ocean`, so the far mesh can paint lake/sea vertices as water at the correct level. No separate lake mesh is needed for F1.

### 2. Cost per tile

Node, `buildMapTile` with full coverage: about **9–14 ms per 64 × 64-sample tile at any step** (≈ 2 µs per sample including classification). Chunk tile `computeChunkTile` p50 is 8.9–10.7 ms for comparison. Cost scales with samples, not area.

### 3. Camera, fog and ocean chain (owners)

- **Camera far plane:** `src/scene/createCamera.ts` (`PerspectiveCamera(60, aspect, 0.1, 500)`), created in `app/renderStack.ts:83`. `debug/flyCam.ts` raises it in flight. F1 needs `far ≥ farRadius + margin` (~1100 m for the 1000 m preset). Depth precision at 800 m with near 0.1 is about 0.4 m (24-bit). That is fine because near and far do not overlap (mask), and the mirror camera copies the projection (`waterMirror.ts`).
- **Fog chain:** `dayNight.ts` base fog **`fogNear = 50 + 80·day`, `fogFar = 150 + 100·day`** (day: 130/250 m, night: 50/150 m) → `applyWeatherOverlay` (weather multipliers, e.g. fog weather `fogFarMul 0.32`) → `capOutdoorFogToTerrainHorizon` (currently `opaqueAt` 160 m, `fadeStart` 120 m) → lightning → `resolveSceneFog` (cave interior) → `scene.fog` in `gameLoop.ts::applyDayNight`. ⚠️ **Lifting the horizon cap alone gives at most 250 m.** The *authored day/night fog curve* itself must extend to `farRadius` for the far ring to be seen. That changes the atmosphere of the whole outdoor game (not just the ring), so it is a look decision → author question (§7). Weather multipliers keep working on top (fog weather would still close in).
- **Ocean:** one follow-the-player plane, `size = (unloadRadius·2 + 4)·chunkSize` = 768 m (±384 m), `fadeInner/Outer` = 192/256 m (`worldBundle.ts::buildOcean`). It must grow to ≥ 2·`farRadius`. Beyond the ring it then serves as far sea water, and the far ground mesh occludes it inland.
- **Shadows:** far 200 m. The far mesh neither casts nor receives (plan rule 7).

### 4. Tile layout (decision)

`buildMapTile`'s fixed 64-sample tile couples tile size to step (step 8 = 512 m, step 16 = 1024 m tiles), which is too coarse to snap a ring around the player. Its coverage gating and river decimation are map concerns. **Decision:** a far-tile worker job that reuses the map's per-sample path (`sampleRawTexelAt` → `classifyMapTexel` → `mapRasterClassOf`). Extract `buildMapTile`'s sample loop into a shared helper rather than copying it. Colours come from `biomeColors.ts` (`colorForTerrain` / `applySlopeRock` / `applyMountainRock`) per vertex. No second palette.

- Far tile = **256 m**, world-aligned. Two levels: **8 m grid (32 × 32 cells, 2 048 triangles)** for tiles whose centre is within ~450 m, **16 m grid (512 triangles)** beyond. Measured error: 0.6 m p95 at 8 m (1.4 m p99 on range slopes), 1–1.7 m p95 at 16 m.
- 800 m preset: a 7 × 7 tile window (1 792 m) around the player's tile. Roughly 25 tiles at 8 m + 24 at 16 m ≈ **63k triangles**. That is under the ~100k budget, before mask-culled tiles fully inside the ring are dropped (the central 3 × 3 tiles are mostly covered by near terrain).
- Build: first window ≈ 49 tiles × ~1 100 samples × 2 µs ≈ 110 ms worker time (once per world/teleport). Crossing a 256 m tile boundary adds 7 tiles ≈ 15 ms worker time. No per-frame CPU work.
- Draw calls: tiles are merged into **one geometry per level**, rebuilt on window shift (memcpy of ≤ 50k vertices), or a `BatchedMesh` (three r185) → 2 draws for ground. Water is coloured in the ground mesh (§1), plus the existing ocean plane.
- Hand-off seam where the 8 m and 16 m levels meet: shared border vertices sampled at world coordinates. Cracks are possible only between levels. Add a skirt (a few metres down) on the 16 m level's inner edge.

### 5. What appears at the ~192 m boundary with fog pushed out (pop list)

Browser, `?seed=415424794&fly&flyPose=<x,z,agl,yaw,pitch>&hour=12&debugDisableSystems=fog,weather,playerModel` vs the same URL with fog. Screenshots are local-only (scratchpad, not committed): home looking SE at 30 m AGL and the range summit (−2340, −680) at 6 m AGL looking north.

Observed (browser-verified for these two poses only):

- **Home SE (`flyPose=0,0,30,-2.356,-0.1`), meadow with rivers:** without fog, the streamed terrain ends in a **hard edge against the sky** at roughly 200–300 m (a jagged horizon line, no far ground). The river ribbons run right to that edge and stop. Distant trees are single scattered specimens. This is a meadow, so it does not show the forest-thinning case (below); a forest pose is still owed (F2 entry check). A dark cave-mouth-like disc sits at the edge on the right. With fog (today's look), everything past ~150 m becomes flat haze silhouettes, so the edge is hidden and so is all relief.
- **Range summit (`flyPose=-2340,-680,6,0,-0.06`):** the near ring itself fills the view (crest and summit within ~200 m), and fog vs no fog differs only in the haze on the far right shoulder. Relief past the summit is not visible in either case. From the summit, the far ring is what would show the rest of the range.
- Neither pose showed houses at the edge. The village was behind the camera. Houses popping is still unverified (F3/F4 check).

From code (not yet seen in a browser):

| Class | Behaviour at / inside the ring edge | Owner | Covered by |
| --- | --- | --- | --- |
| Terrain | Square Chebyshev ring of 3 chunks (192 m worst case, 224 m on the axes, ~317 m at corners), plus retained chunks up to `unloadRadius 4` → ragged, history-dependent edge | `ChunkManager` | far ground + residency mask (F1) |
| **Trees (and large rocks, cacti)** | **Density LOD already thins them to 8 % (`DENSITY_LOD_FLOOR`) at chunk distance 3 and ~49 % at distance 2**. LOD is per 3 × 3-chunk region (max fraction of contributing chunks). Under today's 160 m fog this is hidden. With 800 m fog the outer 130–220 m band shows **sparse forest over bare ground**, which violates author constraint 2 even before the ring edge | `distanceLod.ts`, `vegetationRegionBatcher.ts` | **F2 must cover this band**: the far canopy must stay drawn over near chunks whose tree LOD fraction is low, not only over unloaded ones, or the tree LOD floor must rise when the far ring is on (perf cost), or near-ring trees need an impostor tier. This adds a third option to the F2 decision |
| Rivers (ribbon + carved channel) | End abruptly at the ring edge | `riverGeometry`, chunk water | far river ribbons from raster `riverPoints` (F1/F3) |
| Grass | Ring radius 2 (~96–160 m), visible as a ground-tone boundary | grass pipeline | existing; accept or tone-match far colour (F3) |
| Settlement buildings | Exist only in loaded chunks → houses pop at ~190 m | settlement props | F4 silhouettes (optional) |
| Bushes, ferns, small rocks | Few pixels at 190 m, already LOD-thinned | vegetation batcher | accept (F3 check) |
| NPCs, animals | 1–2 px at 190 m | actors | accept |
| Cave mouth proxy | Only over a resident chunk (`793d246b`) | caves | none needed (a hole of ~10 m is invisible) |

### 6. Updated design rules (supersede the plan where they differ)

- Rule 3 (seam): **raw raster heights with a small drop (≤ 0.3 m) + chunk-residency mask clip**, not V3's min-of-9 (measured 3–23 m sink, §1). `polygonOffset` stays as a belt.
- Rule 2 (hand-off) gains: the canopy suppression test is "near trees present **at full LOD**", not just "chunk resident" (§5 trees). The same residency mask texture can carry a per-chunk tree-LOD byte, with one owner: `ChunkManager` exposes a read-only per-chunk `{terrainAttached, treeLodFraction}` query.
- Rule 4 (fog): the far-ring-aware contract must also own the base day fog distance, not only the horizon cap (§3).
- Layout: §4.

### 7. Questions for the author (queue §3)

1. **Fog distance = whole-game atmosphere.** The base day fog reaches only 250 m today. Showing relief to 800 m means clearer air in all outdoor views (haze to `farRadius`, night unchanged at ~150 m, weather still closes in). OK, or keep a hazier look (e.g. fog opaque at ~600 m even at the 800 m preset)?
2. Covering the thinned near-ring forest (§5) is part of F2 and has a cost (canopy drawn over the 130–220 m band, a higher tree-LOD floor, or impostors). Confirm that F2 prototypes all three and the author picks on screenshots.

### 8. Author answers (2026-11-05)

- ✅ Question 1 → **(a)**: with the far ring on, outdoor fog becomes opaque at `farRadius` (fade band before it). Night and weather still close in on top. F1 owns this change in the fog contract, including the base day fog curve.
- ✅ Question 2 → recommendation accepted (the canopy also covers the LOD-thinned near-ring band), **starting with the simplest variant** that meets constraint 2: a canopy shell drawn over unloaded chunks and over chunks with low tree-LOD fraction. Impostors or a higher LOD floor only if the shell does not read as forest on the screenshots.

## F0 result

Layout fixed (§4). Seam rule changed to raw + mask (§6). Pop list (§5) adds the tree-LOD band as the main constraint-2 risk. F1 is unblocked (§8).

## F1 far ground + water + fog (Sonnet, 2026-11-05)

Implemented behind `?farTerrain` (absent/`0` = off; bare/`1` = 800 m; `400`–`1000` = radius; `src/terrain/farTerrainFlag.ts`).

- **Tiles:** `src/terrain/farTile.ts::computeFarTile` (worker job `farTile`, background queue next to map tiles). World-aligned 256 m tiles; 8 m grid (32 cells) within 450 m, 16 m grid beyond. Heights = `sampleRawTexelAt` (raw map-raster surface, notes §1) − 0.3 m; apron-inclusive central-difference normals; 6 m skirt ring per tile for level-boundary cracks. Colours from the same `biomeColors.ts` functions as streamed terrain (`farTileColor.ts`; no road/scorch tint).
- **Water:** sea vertices follow bathymetry (the ocean plane, grown to `2·farRadius + 2 chunks`, draws over them); lake vertices sit at the lake surface in a flat colour (`LAKE_WATER`, 🟡 look). No far river ribbons yet (still open, F3).
- **Manager:** `src/terrain/farTerrain.ts` — wanted window = tiles with centre within `farRadius + 181 m` (≈ 46 tiles at 800 m), nearest first, ≤ 6 jobs in flight, merged into two meshes (one per level, ≤ 2 draws), rebuilt ≤ every 120 ms on change. Lambert material (scene lights, fog on), `polygonOffset`, no shadows.
- **Seam:** fragment discard over chunks whose terrain mesh is attached. `ChunkManager.terrainResidency()` is a read-only `{version, coords}` (version bumps on first mesh attach/removal); the manager copies it into a toroidal 64² `R8` texture (chunk index mod 64), so no re-centring.
- **Fog contract:** `terrainVisualHorizon({…, farRadius})` → `opaqueAt = farRadius`, `fadeStart = 0.45·farRadius`, `farRadius` field set. `farRingBaseFog` widens the authored day fog (130/250 m at noon) toward 0.45·`farRadius`/`farRadius` by `dayFactor`; night and dusk keep today's close-in fog, weather multipliers and the horizon cap still apply on top. Flag off = identical to before (test).
- **Camera:** far plane `max(500, 1.25·farRadius)` (`createCamera(aspect, far)`); fly cam keeps its own overrides.

Verification: type-check, lint, full `pnpm run test` green (781 files); new unit tests (`farTerrain.test.ts`, `farTerrainFlag.test.ts`, `terrainVisualHorizon.test.ts`). **Browser-observed (WSL Chrome, seed `415424794`, `&fly&flyPose=-2340,-680,40,0,-0.1&hour=12`, noon, no npcs/animals/weather/grass):** with `farTerrain=1` the relief and range ridges are visible through the haze far past the streamed ring; without it only a flat grey silhouette. The harness camera was at the home pose (agl 40), not the summit — so range-summit view, night, water/lake, hand-off seam inspection and forest/tree-LOD band are **not** yet checked. Screenshots local-only. Not measured: perf (Lambert incl. point-light loop on a large mesh, mirror pass also draws the far mesh — F5).

Open for F2/F3/F5: forest canopy (the far ground is currently bare in forests, constraint 2 still unmet with the flag on), river ribbons, grass-to-far colour match, perf A/B.
