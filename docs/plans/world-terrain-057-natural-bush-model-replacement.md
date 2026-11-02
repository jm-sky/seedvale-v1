# Plan: Natural bush model replacement and berry variant

**Created:** 2026-11-02
**Status:** `in progress` 🔄
**Type:** polish
**Priority:** medium · **Effort:** M
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `vegetation` `rendering`
**Tags:** `visual` `performance`

## Goal

Replace V1's visually artificial hedge-like and polyhedral bushes with a small set of irregular, natural-looking GLB silhouettes, retaining berry-bearing vegetation and the existing efficient instancing/streaming infrastructure.

## Author-provided assets (staged, not yet visually or technically accepted)

Staged under `public/models/nature/queue/` (moved 2026-11-02 to `assets-src/nature/`; `bush_with_flowers.glb` runtime copy lives in `public/models/nature/`):
- `bush_small.glb` — V3 Blender-edited bush, approximately 80 triangles (verify this queued export matches the V3 runtime asset).
- `bush_medium_red.glb` — Quaternius Bush, Poly Pizza EoTERLq3z2, approximately 900 triangles; red seasonal source, evaluate green material/texture variant.
- `bush_with_flowers.glb` — Quaternius Bush with Flowers, Poly Pizza U1ymDy8tbY, approximately 1.4k triangles.

Variants prepared in Blender (2026-11-02, **author chose the branchy silhouette over the dome; not yet integrated or browser-checked**), staged in the same folder with source `bush_berries_source.blend`. Each is one primitive / one material (recoloured 1024² atlas, berry and twig swatches painted in a free corner; alpha MASK, double-sided, roughness 1, no vertex colours). Triangle counts are from the exported GLBs:
- `bush_branchy.glb` — default plain bush: `bush_small` leaves re-placed on 8 crossing arched twigs (~270 tris).
- `bush_berry_blue.glb` — the same branchy bush with hanging purple-blue berry clusters (~940 tris; berries are the bulk).
- `bush_medium_green.glb` — `bush_medium_red` recoloured natural green (900 tris).
- `bush_berry_red.glb` — green medium bush with red raspberry clusters (~2170 tris; thin out berries if the performance gate fails).
The dome-shaped `bush_small` berry variant was dropped.

**Wired 2026-11-02** into `BUSH_SPECS` (same 7 slots: 0 green medium, 1 branchy, 2–3 flower clumps, 4 `bush_with_flowers`, 5 raspberry, 6 blueberry); runtime GLBs copied to `public/models/nature/`, sources (incl. `bush_berries_source.blend`) in `assets-src/nature/`. Not run, not browser/visual/performance checked. Old `bush_a/b/c`, `bush_flowers_1`, `bush_berries_1` GLBs still on disk (no active reference); procedural `createBush()` fallback untouched; `bush_with_flowers.glb` is still `BLEND` alpha.

Counts and material/texture properties are preliminary: inspect actual queued binaries, materials, primitives, alpha handling, dimensions, origin, licensing attribution and Blender source availability before integration. Keep original/source assets for reproducibility.

## Remove from active V1 vegetation/settlement rendering

Replace these `BUSH_SPECS` entries with the accepted natural variants:
- `bush_a.glb`, `bush_b.glb`, `bush_c.glb` — geometric hedge-like silhouettes.
- `bush_flowers_1.glb` — artificial rounded flower hedge.
- `bush_berries_1.glb` — glossy polyhedral bush with red spheres.

Do not delete unrelated `flower_clump_1.glb` or `flower_clump_2.glb`: the meadow-patch generator uses their existing numeric indices. Physical deletion of old GLBs only after checking every remaining consumer, including independent settlement/world props and asset tooling. Remove old models from active selection even if historical sources are retained.

Do not retain the coarse procedural `createBush()` silhouette in normal production rendering. Decide an unobtrusive resilient fallback for missing GLBs (or a confirmed bundled replacement); never turn failed asset loading into missing landscape coverage.

## Berry-bearing bush decision

Berry bushes must remain visually identifiable. **Preferred implementation: Blender-authored berry variant** of an accepted natural model, initially `bush_small`. Add a small number of muted, non-glossy berry clusters within the model/atlas; preserve its organic outline. Aim for a single GLB template with as few material primitives as practical so it remains instanced with other placements of the same variant. Provide a no-berries appearance if berry state or seasonal logic actually requires it; do not invent new gather mechanics.

**Alternative:** attach procedural berry geometry to the natural template *once*, merge/bake it into a shared renderable mesh/template before instancing. Avoid per-instance berry `Mesh` objects, per-frame placement work and extra draw-call families. Use this only if it is materially simpler and visually comparable to Blender authoring. Compare both approaches only if the first approach fails its visual/performance gate.

## Integration boundaries

- `src/settlement/propSpecs.ts`: `BUSH_SPECS` catalog, height targets and index semantics.
- `src/settlement/decorProps.ts`: `createBush()` procedural fallback.
- `src/terrain/chunkVegetation.ts`: deterministic `VegetationPlacement` generation, random `speciesIndex`, flower-only indices `FLOWER_BUSH_SPECIES_INDICES`, riparian planting. Keep generation deterministic, preserve habitat and densities; update flower indices deliberately if the catalog changes.
- `src/terrain/chunkManager.ts`: `getBushTemplates`, fallback/preload, chunk placements and region batching.
- `src/settlement/props.ts`: settlement `loadPropTemplates`, bush placement/instancing, hidden-treasure flower marker relying on catalog index 2.
- `src/terrain/vegetationRegionBatcher.ts` and `src/render/instancedProps.ts`: reuse existing shared batching; do not introduce one Object3D per shrub.

Before changing the catalog, trace other `BUSH_SPECS` consumers/tests, asset references, berry gathering and any variant-index persistence contracts. The existing `bush` kind is also used for flower clumps, so keep the flowers' placement semantics intact. Preserve instance tint/rotation/scale variation without requiring unique materials per plant.

## Staged delivery

1. Audit the three queued GLBs and screenshot their geometry/materials with consistent lighting/scale. Check attribution, triangle counts, alpha-test versus blending, material slots, bounds and shadow policy.
2. Produce representative green, autumn/red and flowering bushes. Preserve the source red version for seasonal use if supported; do not couple this visual plan to a new global seasons system.
3. Prepare and visually assess the berry variant (Blender preferred), including readability at ordinary game camera distance.
4. Swap all five obsolete bush models out of active catalogs and eliminate the ugly procedural fallback from normal use while keeping asset-load resilience. Keep meadow flower clumps and world generation behavior stable.
5. Test forest, riparian terrain, settlement clusters, meadow flowers, berry props, missing-asset fallback, chunk streaming/reload and different quality/LOD distances.
6. Compare representative before/after GPU/CPU frame-time and draw calls, including a heavy settlement and a vegetation-rich scene. If original 900/1400-triangle assets are too costly, simplify selectively in Blender or add distance variants after evidence, not preemptively.

## Acceptance

- No active V1 placement renders the five rejected hedge/polyhedron GLBs or the coarse procedural bush silhouette.
- Three queued donor shapes (or documented visually accepted revisions) supply natural variety; flowering and berry-bearing bushes are distinguishable.
- Berry functionality and existing flowers, IDs, biome placement, quantities and world/settlement ownership are not regressed.
- No per-bush mesh/draw-call explosion; existing instancing and region/chunk lifecycle preserved.
- Visual author review and matched performance comparison are recorded before marking done. Do not claim runtime/visual verification from static code review.
- Add or maintain JSDoc `@domain` tags on important new public/architectural entry points.

## Non-goals

No increase in vegetation density, changes to deterministic worldgen rules or gather yields, new seasonal simulation, wholesale vegetation renderer rewrite, or removal of source assets merely for cleanup.
