# Plan: Far terrain ring (600–1000 m) without bare-ground pop-in

**Created:** 2026-11-05
**Status:** `in progress` 🔄
**Progress:** F0 done 2026-11-05 ([notes](implementation-notes/world-terrain-066-far-terrain-ring-implementation-notes.md)); author answers recorded (notes §8); F1 implemented 2026-11-05 (queue Q147; browser look → queue §2), F2 next
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `terrain` `rendering` `lod`
**Tags:** `visual` `performance` `fog` `vegetation`
**Model:** Opus plan → Sonnet slices (F1+ implementation), Opus review at F2/F3 gates

## Goal

Make relief visible from far away (author 2026-11-05, after the 060 R2 range previews: "z daleka nie widać terenu"). ✅ Author chose §3 option (a): a separate cheap far-terrain representation.

✅ Author constraints (2026-11-05):

1. **Radius 600–1000 m is enough** — no 1–2 km horizon in this plan.
2. **No "bare terrain behind the fog, then trees pop in".** Distant forest must already read as forest; approaching must not reveal naked ground that is later filled by trees.

Non-goals: changing the detailed streamed ring (`loadRadius 3 × 64 m`), its content or worldgen output; far water reflections; far settlements beyond simple silhouettes (F4, optional); any simulation/streaming/persistence effect.

## Current state (verified 2026-11-05, `793d246b`)

- Detailed terrain exists only within `loadRadius 3 × chunkSize 64` ≈ 192 m (`src/config/worldConfig.ts`). Beyond it nothing is drawn.
- `terrainVisualHorizon()` (`src/terrain/terrainVisualHorizon.ts`, plan world-terrain-035) derives `fadeStart`/`opaqueAt` (≈ 160 m) from `loadRadius` only; `capOutdoorFogToTerrainHorizon()` (`src/world/weatherVisuals.ts`) caps outdoor fog by it every frame (`gameLoop.ts::applyDayNight`). This fog cap is what currently hides the chunk-load boundary, including trees, rocks and houses appearing.
- Camera far plane is 500 m (`waterMirror.ts` comment); the far ring needs ≥ ring radius (🟡 verify the owner of the main camera in F0).
- Reusable far-data source 🟡: **map raster tiles** — `buildMapTile()` (`src/world/map/mapRasterTile.ts`) already runs in the chunk worker (`chunkHeightmap.worker.ts`) and returns `heights`, `floors` and `classes` (`Ocean`, `InlandWater`, `Shore`, `Mountain`, `Meadow`, `Forest`, `Desert`, `Swamp`) on a 64-sample tile at steps 1–16 m. Step 4 (256 m tile) / step 8 (512 m tile) fits a 600–1000 m ring. F0 must confirm that its heights match runtime tile heights well enough (hydrology correction, rivers, range spines included?) and that the result is cached/cheap.
- Vegetation density LOD: `distanceLod.ts`, `vegetationRegionBatcher.ts` (`VegetationLodClass` `silhouette` for trees). Trees exist only in loaded chunks.
- Cave mouths: the proxy is now shown only over a resident chunk (`793d246b`), so it no longer hangs beyond streamed terrain; the far mesh has no cutouts (holes of ~10 m are invisible at ≥ 190 m).
- Donor: V3 `src/game/render/farTerrain.ts` (local checkout `../seedvale-v3`, `47733d6b`, read 2026-11-05; research [WORLD-03](../research/v1-revival/2026-10-26--007--unified-candidate-matrix.md#world-03)). Technique worth taking: each far vertex = **minimum of 9 height samples (±16 m) minus `FAR_DROP_M` 1.5 m**, so the far mesh always sits under the real terrain and needs no clipping at the seam (plus `polygonOffset`); heights from world coordinates only, so neighbouring tiles share border vertices without cracks or skirts; lake vertices at lake level in the deep-water colour; nearest tiles first with a per-call budget. Not applicable as-is: whole-continent mesh (2048 m tiles, 32 m step, far plane 7000 m, fog far 900 m) built synchronously on the main thread; **no vegetation at all** — V3 does not solve author constraint 2.

## Design

Three visual bands around the player:

| Band | Distance | Content |
| --- | --- | --- |
| Near (unchanged) | 0 – ~192 m | streamed chunks: terrain, water, trees, props, settlements |
| Hand-off | ~140 – ~200 m | near content is fully present; far layers fade out under it (dither/depth bias), never the other way round |
| Far | ~170 m – `farRadius` (default 800 m 🟡, quality presets 600 / 800 / 1000) | far ground mesh + **forest canopy layer** + water plane + (F4) settlement silhouettes; fog becomes opaque at `farRadius` |

Key rules:

1. **Forest is never drawn as bare ground in the far band.** Where the far data says `Forest` (or forest factor ≥ threshold), the far ring draws a canopy representation: at minimum a raised, darker canopy shell (ground height + typical crown height, broken edges, vertex-colour noise); at most cheap instanced tree impostors on a deterministic hash grid. F2 chooses after a side-by-side screenshot test; the author judges the look.
2. **Hand-off direction:** near trees must already be present when the far canopy fades out at that spot. The far canopy is suppressed only over chunks that are `ready` *and* have their vegetation attached (state owned by `ChunkManager`; expose a narrow read-only residency query, do not duplicate chunk state). Until then the canopy stays, so the player sees canopy → real trees, never ground → trees.
3. **Near/far terrain seam (revised by F0):** far vertices use the raw map-raster height (≤ 0.3 m drop + `polygonOffset`), and far fragments are **discarded over chunks whose terrain mesh is attached** (per-chunk residency mask texture owned via a read-only `ChunkManager` query). V3's min-of-9 rule was measured and rejected: it sinks the far surface 3–23 m below V1 relief (notes §1).
4. **Fog:** `TerrainVisualHorizon` gains a far-ring-aware contract: with the far ring enabled, outdoor fog becomes opaque at `farRadius` (with a fade band) instead of ≈ 160 m. Weather fog still wins (never weakened); cave-interior fog is unchanged. Without the far ring (flag off), behaviour is identical to today.
5. **Near-ring boundary exposure (the main risk):** pushing fog out makes the ~192 m chunk boundary visible for everything that is *not* in the far ring — rocks, bushes, houses, roads, rivers, NPCs/animals. Mitigations, in order: far ring carries the large silhouettes (forest F2, water F1, settlements F4); small props (rocks, bushes, grass) at 190 m are a few pixels and use the existing density LOD; anything still popping is handled by a distance dither-in at the chunk edge (F3). If an object class still pops visibly after F3 → stop and ask (author constraint 2).
6. **Presentation only.** Far data is never read by simulation, collision, AI, map or saves. Deterministic from the seed; rebuilt with `WorldBundle`.
7. **Performance budget (🟡 targets, measured in F5):** ≤ ~10 extra draw calls for ground + water (≤ ~20 with canopy impostors), far mesh ≤ ~100k triangles, rebuild only when the player crosses a far-tile boundary (worker job, no per-frame CPU work), no shadow casting/receiving, not in the water-reflection pass unless F5 shows it is free. Revertable behind a flag.

## Slices

| Slice | Model | Content | Done when |
| --- | --- | --- | --- |
| **F0 recon** ✅ 2026-11-05 | O | Verify map raster tile heights vs runtime tile heights at 3 places (plain, range, river valley, seed `415424794`) and cost per tile; camera far-plane owner; fog/day-night chain; check V3's min-of-9 rule on V1 heights (river beds, carved roads); pick tile step/radius layout; list the classes that pop at the 192 m boundary with fog pushed to 800 m (screenshots with a debug fog override) | notes file with numbers + screenshots; layout fixed; risks for 5. updated |
| **F1 far ground + water + fog** | S | `?farTerrain=1` flag (default off): worker-built far tile meshes from map raster tiles, biome colours from the same palette as `biomeColors.ts` (no second palette), flat water at water level for `Ocean`/`InlandWater`, seam rule 3, fog contract rule 4, camera far ≥ `farRadius` | flag on: relief visible to `farRadius` on the 060 ranges; flag off: no behaviour change (tests); type-check/test green; browser screenshots (`?seed=415424794&farTerrain=1`) → §2 |
| **F2 forest canopy** | S (+O review) | canopy shell vs impostor prototype; hand-off rule 2 via `ChunkManager` vegetation residency | side-by-side screenshots for the author: forest reads as forest at 300/600 m; walking/flying towards a forest shows no bare-ground frame (recorded video/sequence); author picks the look |
| **F3 boundary hand-off** | S | dither-in at chunk edge for classes found in F0 that still pop; seam polish | F0's pop list closed or explicitly accepted by the author |
| **F4 settlement silhouettes** (optional) | S | simple roof/block silhouettes for settlements in the far band from settlement layout data | only if F0/F3 show houses popping visibly; author decides |
| **F5 performance + default** | S → author | WSL A/B (flag off vs on, reference route) per the performance protocol; quality presets 600/800/1000; Windows Arc A/B by the author (queue §4) | WSL A/B within budget → default-on proposal to the author; never claim FPS gains |

## Stop if

- Any band shows bare ground that is later filled by trees (author constraint 2) and F2/F3 cannot fix it within budget → ask the author.
- Map raster heights deviate visibly from near terrain (steps/cliffs at the hand-off) and a fix would need a new height pipeline → ask (F0).
- WSL A/B regresses beyond the budget at the 600 m preset.
- A visual compromise is needed (e.g. accept popping rocks/houses, lower radius than 600 m).

## Open questions for the author

- Default radius per quality preset (🟡 proposal: low 600 / medium 800 / high 1000) — decide at F5.
- F2 look (canopy shell vs impostors) — decide on screenshots. ✅ Author 2026-11-05: start with the simplest variant (canopy shell, also over LOD-thinned near-ring forest), refine later.
- ✅ Fog (author 2026-11-05): opaque at `farRadius` with the far ring on.

## Review 041 cross-reference (2026-11-06)

[review 041](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md) **F16-18** (merged far-ring geometry bypasses fine culling, repeated buffer updates) — keep the ring optional; evaluate with ring on/off matched silhouettes, uploads and p95/p99 when F2 (Q148) resumes. Program: [roadmap §audit 041](../research/v1-revival/2026-10-27--master-revival-roadmap.md#rendering--performance-audit-041--program-2026-11-06).
