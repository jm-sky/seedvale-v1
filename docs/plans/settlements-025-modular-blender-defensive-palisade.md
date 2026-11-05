# Plan: Modular Blender Defensive Palisade

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** polish
**Priority:** medium · **Effort:** L
**Depends on:** -
**Domain:** `settlements`
**Subdomains:** `buildings`
**Tags:** `revival` `rendering` `assets` `performance`

## Goal

Replace the fence-like *visual representation* of V1 defensive palisades with a convincing, modular, Blender-authored wooden fortification, with photographic wood textures tuned to V1's art direction. Preserve V1 settlement placement, player construction, simulation, persistence, collision, and existing batching. This is an asset-first initiative, not permission to rebuild settlement systems.

**Author direction (2026-11-05):** use a dedicated Blender session; make the palisade modular and performance-oriented. The V3 generated palisade is an accepted visual reference, not an obligatory code transfer.

## Verified starting point

- V1 `src/settlement/settlementPalisade.ts` uses `WALL_URL` (`/models/settlement/wall.glb`) for entrance fortifications, with `WALL_TARGET_HEIGHT = 1.85`, `WALL_HALF_LENGTH = 2.2` and OBB projection from final placements. Short wings and 'closed' rings, gate/corridor/coastal gaps are already supported.
- V1 `src/world/palisade.ts`, `palisadeProp.ts`, `createPalisades.ts` own distinct player-built segments: 2.2 m length, snapped endpoints, per-segment persistent identity/progress, completion-gated collider; current visual is a row of thin stakes plus horizontal rails.
- V1 `src/render/instancedProps.ts` and settlement props already instance/batch fences. The 2026-10-28 Track B investigation reported **4 main-pass / 4 shadow / 2 mirror** submissions and **18,584 main-pass triangles** for all visible fences in its settlement-heavy sample. Those are scenario-specific diagnostic readings, *not a per-palisade budget*.
- V3 reference: `src/game/render/structures/kitModels.ts::palisadeItems` creates seven touching, sharpened 3.0–3.4 m stakes per 2.2 m piece, three geometry variants and a binding pole; `fenceSlope.ts` fits pieces to slopes. V3's render/bake architecture is not V1's ownership model.

## Scope

1. **Blender asset package:** a 2.2 m straight defensive segment at V3-like ~3.0–3.4 m silhouette, with close-set sharpened logs, structurally plausible ties, slight controlled irregularity and a ground-contact base; up to three compatible visual variants. Correct axis, origin/pivot, naming, units, normals, UVs, shared texture/material, exported GLB plus editable .blend and reproducible export notes.
2. **Module interfaces:** straight segment first; explicit treatment for continuous joins, turns/corners, open ends, gate openings and sloped terrain. Reuse same visual family for settlement-owned and player-built palisades, but **do not merge their authoritative domain systems**. Gates, corners and dressing become additional assets only when a documented real placement need requires them.
3. **Textures:** photographic wood albedo processed to match V1 lighting/colour; shared atlas, optional normal/roughness only if measured visual value warrants their memory/bandwidth. No unique texture per variant or alpha foliage.
4. **Integration as separate gated slice:** replace visual templates without altering V1 generated placement IDs, construction requirements, snap length, colliders, NPC navigation or save schema. Review geometry-vs-OBB thickness/height separately; fix actual mismatches without silently changing gameplay.
5. **Performance, screenshots and rollback:** compare same-scene before/after on native target hardware, including populated settlements, long visible runs, slopes, shadow and water/mirror conditions; preserve the old renderer as a rollback option until sign-off.

## Preliminary asset budgets — targets, not proven runtime limits

| Resource | Initial target | Validation |
| --- | --- | --- |
| Straight module | **≤ 300 triangles** at 2.2 m, each LOD0 variant | Inspect exported GLB including hidden primitives, caps and ties |
| Variants | **1 base + up to 2 alternatives**, same footprint and material | No per-variant draw material explosion |
| Materials | **1 opaque material / module** (ideally 1 merged primitive) | Count exported primitives and actual main/shadow/mirror submissions |
| Texture | **1 shared 1024×1024 wood atlas**, compressed/transcoded where V1 supports it; no unique atlas per variant | Inspect actual GPU memory, loading and close-up appearance; 512 option if appropriate |
| Long run | **100 visible segments ≲ 30k LOD0 triangles** before extra props/shadows | Synthetic worst-case camera, not a claimed typical workload |
| Draw calls | **No per-segment draw-call growth**; reuse V1's instancing/batching | Count main, shadow and reflection submissions separately against matched baseline |
| Shadow | Keep useful near shadows; no unconditional extra shadow-casting primitives | Side-by-side near/far quality and shadow workload |

These are *initial production constraints* for a low-poly asset, deliberately conservative and revisable against V3 geometry, Blender appearance and V1 frame captures. Do not treat a triangle-only estimate as a measured FPS improvement.

## LOD decision

**Do not require a separately authored LOD1 in the first Blender delivery.** First evaluate LOD0 with V1's existing streaming/visibility and batching; adding distance-based asset swaps can worsen draw calls, memory and transition quality.

After the first test, **author LOD1 only if evidence warrants it**: e.g. long-run distant palisades materially increase triangle/shadow cost, exceed scene-specific rendering budgets, or cause a reproducible frame regression. Candidate LOD1 target **≤ 120 triangles per 2.2 m** with the same outer silhouette and shared material; evaluate LOD transition thresholds from projected screen size and tested cameras, **not a guessed fixed distance**. Consider simple far culling before LOD2/impostors, but never remove important landmark/fortification silhouettes without author visual approval.

## Blender-session handoff

- Start with **one** export-ready straight 2.2 m module and a reference comparison to V3 at gameplay camera height. Verify UV mapping, atlas tone, joins on straight and angled runs, slopes and silhouettes before making variants.
- Produce side-by-side renders from player height and mid/far distances; report actual GLB triangle count, mesh primitives, materials, texture sizes and file size. Do not claim runtime savings from Blender-only measurements.
- Iterate up to two deterministic variants only after the base is accepted; keep the module interface unchanged.
- Keep the .blend source, legal texture provenance/licence, exported GLB and generation/export method in an asset-specific documented location. Preserve V1 asset-loading/disposal ownership.

## Verification / acceptance

- Palisade **unambiguously reads as a defensive wall**, visibly distinct from low plank/rail fences; no obvious daylight slots, hovering bases, bad joints, seams or exaggerated repeated patterns.
- Straight sections, turns, entrances, slope transitions, near-ground intersection and end caps look credible without obstructing intended gaps.
- Settlement palisade and player-constructed palisade preserve existing segment identities, build/remove actions, save/load, placement snapping, progress display, OBB collision and NPC obstacle behaviour. No new worldgen/save epoch unless demonstrably required and separately approved.
- Native matched A/B: record main/shadow/mirror draw calls, triangle submissions, frame p50/p95, GPU/CPU where available, memory and load cost; compare matched camera/seed/weather/time and heavy/palisade-focused scenes. No material performance regression is accepted without a stated author-approved trade-off.
- Add/adjust focused tests only for actual integration boundaries and document manual screenshot/runtime verification; code inspection alone is not visual/performance proof.
- Important new public/architectural functions get concise JSDoc with appropriate `@domain`.

## Non-goals and gates

- **Not included:** English-style dry-stone field walls (separate plan), generalized fence-system redesign, new settlement placement algorithms, gates with new gameplay interactions, damage/destruction mechanics, pathfinding rewrite, V3 renderer transplantation.
- **D4 / Revival gate:** inert Blender source/exports and documentation may proceed now; integrating a new renderer-visible asset or changing benchmark workload waits for the applicable Revival performance/integration authorization. This plan does not supersede that gate.
- **Visual gate:** author accepts the Blender base silhouette and wood treatment before variants or runtime rollout. If the ≤300-triangle limit visibly fails, present a measured cost/quality comparison rather than degrading the silhouette silently.

## References

- [Revival Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md)
- [Revival Master Roadmap](../research/v1-revival/2026-10-27--master-revival-roadmap.md)
- [Settlement Track B performance attribution](../research/v1-revival/2026-10-28--settlement-track-b-next-optimization.md)
- V1: `src/settlement/settlementPalisade.ts`, `src/settlement/propSpecs.ts`, `src/world/palisade.ts`, `src/world/palisadeProp.ts`, `src/world/createPalisades.ts`, `src/render/instancedProps.ts`
- V3: `src/game/render/structures/kitModels.ts`, `fenceVariants.ts`, `fenceSlope.ts`
