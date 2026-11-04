# Plan: Terrain color and shading artifact correction

**Created:** 2026-11-04
**Status:** `planned` 📋
**Type:** bug
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `terrain` `rendering`
**Tags:** `visual` `post-processing` `diagnostics`
**Model:** Sonnet, Composer

## Goal

Diagnose and eliminate conspicuous large, straight-edged triangular lightness/color patches on outdoor terrain (author screenshot, 2026-11-04, near a shoreline). ✅ Author: **not shadows** (certain); seen **in full sun on open terrain**; **probably older than the hydrology correction** (`5f127b450`, 2026-11-03; uncertain). Keep the existing biome palette, procedural variation, coast, weather and terrain rendering architecture intact. **The root cause is not established.** This is a correctness/visual-artifact fix, not a terrain art-direction redesign.

## Evidence — targeted static recon (2026-11-04)

Implementation notes (ranked hypotheses H1–H8, discriminators, owners, instrumentation decision): [`implementation-notes/world-terrain-065-terrain-color-and-shading-artifact-correction-implementation-notes.md`](implementation-notes/world-terrain-065-terrain-color-and-shading-artifact-correction-implementation-notes.md).


- `src/terrain/chunkMeshData.ts::computeChunkMeshData()` computes per-vertex positions, normals, biome/shore/slope/road color and `aBareGround`. `src/terrain/biomeColors.ts` owns the underlying palettes, shore bands and color modulation.
- `src/terrain/buildChunkGeometry.ts::buildRegularGeometry()` uses a regular indexed `PlaneGeometry`, with interpolated vertex colors and the worker-provided normals; `createTerrainMaterial()` uses `MeshStandardMaterial` with `vertexColors: true`, shared across chunks. Its injected shader adds world-space macro noise, dirt diffuse detail, wet-sand/weather effects, normals and roughness.
- `src/config/worldConfig.ts` defaults to a 64 m chunk with a 65 × 65 vertex mesh (1 m spacing), but `resolution` and `flatShading` can come from `?res=` or persisted settings — the author's effective values are unknown. The visible patches appear substantially larger than individual mesh triangles; a vertex-color interpolation defect is **not proven**.
- Terrain height includes the global-hydrology correction layer (`hydrologyCorrectionAt`, bilinear on an 8 m grid; breach cones and near-flat filled pits, typical at coasts) — a possible source of straight creases, demoted by the author's report (probably older than this layer).
- Terrain meshes receive shadows and cast them by default (`buildChunkGeometry.ts`, `chunkManager.ts`); sun shadows are configured in `src/world/createLights.ts` (default 1024 map via `worldConfig.ts`). Since 2026-11-01 the default frustum is `tight` (±56 m, shifted 24 m along camera forward; `?shadowFrustum=legacy` restores ±80 m centred on the player) and shadow refresh cadences (`shadowActorCadence`, `shadowMotionCadence`) are on by default — **excluded by the author**, recorded only as context.
- Screen-space post-processing is now the leading suspect: N8AO runs at half resolution with depth-aware upsampling and normals from depth; god rays (default on) radially smear bright pixels toward the sun's screen position with no occlusion buffer, giving straight-edged wedges while the camera faces a sun below ~30° elevation (`src/render/createPostProcessing.ts`, `src/render/godRaysShader.ts`). World-anchored alternatives are simplex-driven vertex-color fields (`biomeColors.ts`/`biomeRegions.ts`), float32 precision of the shader macro-noise hash at large world coordinates and the per-triangle tangent frame of the detail normal map.
- Static inspection has not reproduced the artifact or established whether it tracks camera movement, sunlight, world coordinates, triangle topology, chunk seams or a transparent/overlapping mesh. No browser/GPU verification has been performed.

## Scope

### A — Reproduce and isolate (mandatory gate; no retuning)

0. Ask the author (queue §3) for the screenshot's position (`?camdebug=1` readout), hour, weather, quality preset and effective terrain resolution; meanwhile search reference-seed shorelines. Add the dev-only, URL-gated terrain debug view `?debugTerrainView=vertexColor|albedo|normal|bareGround` on the shared terrain material (notes §3) — diagnostic instrumentation, not a correction, so it is allowed before Gate A.
1. Record a repeatable scene: seed, world coordinates, time/sun angle, weather, graphics preset, camera position/orientation, resolution/DPR and screenshot. Prefer the author's shoreline screenshot area if reproducible; otherwise find an equivalent. Capture static and camera-movement comparisons.
2. At the **same camera and world state**, A/B isolate: (a) screen- vs world-anchored: small camera translation/pitch changes, facing toward vs away from the sun, two hours (e.g. 12 and 16), (b) GUI post-processing toggles one at a time: Ambient occlusion, God rays, Bloom, (c) unlit visualization of terrain vertex colors, shader albedo, geometric normals and `aBareGround` (the debug view above), (d) detail normal map off, (e) the author's effective `resolution`/`flatShading` vs a fresh profile, (f) only if still unexplained: a checkout at `5f127b450^` (pre-hydrology). Shadow A/Bs are skipped (author excluded shadows). Restore all toggles between runs. Check also water/shore overlay meshes or z-fighting if neither lighting nor vertex data explains it.
3. Compare artifact edge geometry against the mesh grid (effective resolution), the sun's screen position (god-ray wedges), chunk borders, the 8 m hydrology grid (only if D1 is reopened), shader world-space noise and possible overlaid meshes. Confirm which pass/data produces the boundary, not merely which toggle conceals it.
4. Record observations, screenshots, effective toggles and a root-cause hypothesis supported by evidence in a short diagnostic report under `docs/performance/results/` or `docs/reviews/`, linked back here.

**Gate A:** Do not change biome palettes, shader noise, material parameters, shadow resolution, AO quality or geometry until the responsible mechanism is identified. If not reproduced, leave this plan unresolved with a precise reproduction request instead of shipping speculative changes. If the fix would change a post-processing default or quality/cost (N8AO, god rays, bloom), a persisted worldgen grid (cache + possible `WORLDGEN_EPOCH` bump) or any palette, **stop and ask the author** with measured options before Phase B (notes §5).

### B — Minimal correction (only after Gate A)

Fix the responsible existing owner only. Prefer a localized correction to mesh data/interpolation, shadow/material configuration, shader mathematics or overlay lifecycle as the evidence dictates. Preserve worker-side deterministic mesh data, shared terrain material and chunk streaming boundaries.

Avoid extra terrain draw calls/materials, per-chunk shader variants, new texture passes, or new gameplay/worldgen state. If the culprit belongs to N8AO or god rays, coordinate ownership with `world-terrain-039` (AO budget) and `056` (render-pass scheduling); do not duplicate their performance/quality work or silently flip global quality defaults. Any broader visual compromise requires author approval.

### C — Verification

- Before/after screenshots at identical camera and world state: shoreline, open meadow, slopes/mountains and a chunk seam; repeat at noon and at a low sun facing toward/away from the sun, with all default post-processing enabled.
- Verify camera movement/rotation, chunk streaming and changing weather do not reintroduce polygons, seams, popping or z-fighting. Preserve shore color transitions and biome identity.
- Add targeted deterministic tests for the confirmed numerical/mesh cause when feasible; shader or shadow cases require visual browser evidence in addition to automated checks.
- Run typecheck/lint/relevant tests/build. Check no unexpected shader variants, draw calls, allocations or material lifetime changes; if rendering cost changes, perform a matched performance A/B rather than claiming it is free.
- Agent records static/test evidence; author performs final visual acceptance in-game. Do not claim browser/GPU verification from code inspection.

## Related work / boundaries

- `world-terrain-039`: N8AO **cost budget**, not ownership of this artifact diagnosis.
- `world-terrain-055`: shadow frustum and update cadence (existing flags; avoid changing their behavior without evidence).
- `world-terrain-056`: render-pass scheduling/map quality (especially water reflection pixelation, a separate observed issue).
- `world-terrain-009`: seasonal colors; `world-terrain-021` (archived): bare-ground albedo; `world-terrain-060–062`: evolving geography/climate/biomes. Do not combine this defect with seasonal recoloring or macroregion art-direction work.

## Non-goals

Global palette replacement, new biome/splat material architecture, terrain mesh-resolution increase, shadow/AO optimization program, water reflection upgrades, geography/hydrology redesign, and visual polish unrelated to the demonstrated artifact.

## Handoff

When an important public or architectural function changes, add concise JSDoc (`@domain world-terrain` where appropriate). Keep the correction reversible and document the reproduction and chosen owner. No runtime implementation is authorized merely by creating this plan.
