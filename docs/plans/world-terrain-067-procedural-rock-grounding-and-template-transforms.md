# Plan: Procedural rock grounding and prepared-template transforms

**Created:** 2026-11-06
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** L
**Depends on:** none
**Domain:** `world-terrain`
**Subdomains:** `terrain` `vegetation` `rendering`
**Tags:** `placement` `mountains` `grounding`
**Model:** Opus, Sonnet

Implementation guide: [implementation notes](./implementation-notes/world-terrain-067-procedural-rock-grounding-and-template-transforms-implementation-notes.md).

## Problem and executive finding

Mountain testing reports floating rocks and a bright apparent gap beneath distant rocks. Investigation at `94d56096` established three independent defects/mechanisms, without identifying which produced the reported image:

1. Prepared GLB root offsets are added in world space after placement yaw/scale. The geometry consequently moves away from the point whose terrain height was sampled, and its base no longer necessarily stays at that height.
2. The new `rockOutcrop` composition grounds all its separated shards against one centre height. A whole shard can float above a slope even when the composition's global bounding box intersects the ground.
3. Bilinear height sampling and the visible terrain's piecewise triangular surface disagree inside non-planar grid cells.

Ordinary boulders, clusters and logs also use a single ground anchor without footprint adaptation. The absence of pitch/roll alone does not prove a defect; upright vegetation and natural rock overhangs remain valid.

**Confidence:** high for the transform defect, the outcrop reproduction and the interpolation discrepancy. Attribution of the original visual report, the magnitude of interpolation error in that scene, and the apparent missing terrain remain unverified. No screenshot, camera pose or launch flags were supplied with the investigation. Do not claim the reported scene is fixed from geometry tests alone.

## Why a new plan

- [173](./archive/2026-08-20--173--terrain-aware-procedural-placement.md) implemented per-element grounding for stone circles and cemeteries; it did not repair prepared GLB transforms or ordinary instanced rock footprints.
- [006](./archive/world-terrain-006-world-generation-placement-correctness.md) extended terrain context to monoliths and ruins. Its visual verification remains outstanding; this plan does not close it wholesale.
- [044](./archive/world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md) separates resident movement queries from analytical fallbacks. Rock attachment here samples the runtime tile directly, so that movement fallback is not the established cause.
- [060](./world-terrain-060-macro-relief-ranges-passes-and-landforms.md) increased exposed mountain relief and added `rockOutcrop` in `94d56096`. The outcrop defect is a new implementation gap; older transform behaviour predates it.
- [066](./world-terrain-066-far-terrain-ring.md) owns near/far presentation. Missing terrain must be diagnosed against that owner rather than hidden by changing rock Y.

These are related records, not unfinished implementation prerequisites. Recheck their current code before implementation; neither their archive location nor verification status establishes a regression.

## Scope and independently verifiable slices

### G0 — capture the visual failure and classify support

Reproduce on reference seed `415424794`, recording build SHA, world configuration, save/new-world state, URL flags, camera/player pose, object kind and placement/resource identity where present. Include a close view and the original distant view. Identify `largeRock`, `rockCluster` and `rockOutcrop` explicitly; they have different rendering paths.

At the suspect footprint, distinguish:

- near terrain mesh absent, cut out or not rendered;
- near terrain present but fogged, versus far terrain providing a different coarse surface;
- object geometry displaced from its sampled anchor;
- a supported main body with unsupported separate stones/shards.

Use separate raycasts against near and far terrain, mesh/residency inspection, and the same camera with `farTerrain=0` / `farTerrain=1` and diagnostic fog isolation. Wait for streaming to settle, then repeat during approach and across unload/reload. Inspect any cave cutout before treating a hole as accidental.

This is a gate for attributing and closing the reported visual defect, not a blocker for reproducing and correcting the established geometry defects. A missing-terrain fix is conditional on this evidence: if it belongs to 066, record and repair it in that owner with a concrete reproduction; do not invent a residency/fog redesign here.

### G1 — preserve the prepared model's anchor under yaw and scale

For the affected natural templates, ensure the preparation translation belongs inside placement yaw and scale. A model centred with its feet at zero must remain centred at placement X/Z with its feet at ground Y after either transform.

Reuse template preparation, flattening and instance-matrix construction. Keep instanced and applicable cloned natural-prop paths consistent. Scope the correction explicitly; do not silently change every `prepareProp`/`placeOnGround` consumer, fences or settlement fixtures. Do not bake unique geometry per placement.

Keep generated positions, yaw, scale, species/variant selection, resource IDs and mining state unchanged. Correcting their visual projection does not authorize relocating worldgen candidates or persistent entities.

### G2 — sample the rendered triangle surface for grounding

Add an explicit terrain-grounding operation alongside existing apron-grid sampling. It must read the same runtime tile and use the same cell diagonal and vertex heights as the visible regular mesh. On dry mountain terrain, those heights agree with `floorHeights`; preserve deliberate water-surface and seabed placement semantics for other callers.

Use this operation in the affected rock grounding path and the terrain context supplied to repaired outcrops. Keep scalar-field interpolation and existing analytical/worldgen query contracts unchanged. Do not globally replace bilinear sampling, alter detailed movement queries, or make bridge decks into terrain.

Reuse apron indexing and local terrain helpers; a triangle normal or footprint plane may inform orientation, but orientation is a separate object-specific policy. Cutout interiors are absent surface, not evidence for lowering a prop onto an imaginary triangle.

### G3 — ground outcrop shards before merging

Extend `createRockOutcrop` with the existing terrain-context pattern. Resolve each shard's actual world X/Z after composition yaw, then determine its support before merging. Preserve deterministic shape/colour, authored local irregularity and one merged mesh per outcrop. Avoid reapplying group yaw after it has been baked into world-aware offsets.

Check each shard independently. A global `bbox.min.y < 0` is insufficient. Reuse `rotateOffsetY`, terrain sampling and bounded orientation helpers; do not globally tilt props or apply a constant sinking offset. Validate support against the shard footprint on slopes and locally curved terrain.

### G4 — resolve residual boulder/cluster footprint failures

After G1–G3, measure residual gaps on ordinary rocks and logs. Apply a bounded support rule to failing boulders using their prepared, scaled and rotated footprint. Preserve upright trees/bushes; this slice does not authorize changing their orientation policy.

For `rock_cluster_a`, first establish the asset's connected stone components and intended footprint. Its height-fitted template is approximately 9.78 × 0.90 × 11.61 m: one rigid transform cannot independently support separated stones on an arbitrary hillside. If individual stones remain suspended, prepare reusable component/support data once per template and ground those components at content creation while retaining one logical resource and existing batched removal semantics. Do not silently shrink the asset via `fitMax`, replace its appearance, or allocate a unique mesh/material per stone per placement.

Any footprint probes outside the owning tile's apron must use an existing canonical terrain mechanism or a narrowly extended canonical query. Clamping distant samples to the apron edge is not support. Preserve deterministic placement independent of neighbour load order; do not fall back to raw terrain where shaped terrain is required, and do not synchronously generate neighbouring chunks from a render/update hot path.

If component extraction or canonical boundary support requires a broader architectural change, stop this slice at documented evidence and seek review; G1–G3 remain independently landable. Do not mark the whole plan done while a confirmed cluster failure is merely deferred.

## Constraints, performance and non-goals

- Preserve deterministic worldgen, resource identities, mining stages, save state, chunk ownership, `WorldBundle` lifecycle and unload/reload behaviour.
- Terrain sampling and support fitting occur at content creation/rebuild, never per frame. Cache reusable template bounds/components; retain instancing and shared GPU ownership.
- Keep slices independently revertable. Record sampled-point count, chunk-content preparation time, instance/primitive counts and draw calls before/after on the same scene. Compare WSL with WSL and native Windows with Windows; do not infer FPS gains from unit tests.
- No relief/hydrology changes, new placement manager, persistence redesign, global prop tilt, blanket Y offset, density reduction, asset rescaling or unrelated vegetation audit.
- A purely visual transform/support correction does not by itself require changing canonical tile caches or save schema. If implementation changes generated placement data, version the affected namespace and apply the existing worldgen-epoch policy; do not invalidate unrelated caches.
- Add JSDoc to important new public/architectural functions where useful for preflight, preferably with `@domain world-terrain`.

## Regression verification

### Automated

1. Prepared non-centred templates, including real rock assets: centre/base invariants across yaw and scale, nested transforms, and parity between corrected clone/instance paths. The oracle must be geometric support, not the old clone implementation alone.
2. Rendered-ground sampler versus raycasts into production mesh triangles: both sides of the diagonal, corners/edges, saddle and planar cells, negative coordinates and neighbouring chunk seams. Retain bilinear results for non-height scalar fields.
3. Outcrop support per shard on planes in both directions and on a local depression/ridge; preserve determinism, colours, merged mesh count and controlled burial. Check surface contact, not only global bounds.
4. Boulder and individual cluster-stone support with non-unit scale/yaw and boundary-spanning footprints. Test the selected canonical boundary policy without dependence on chunk arrival order.
5. Region rebuild, LOD and unload remove all contributions. Mining base → override → depleted → reload preserves resource identity, removes every visual component and keeps colliders coherent.
6. Targeted regression checks for monoliths, stone circles and ruins ensure their existing per-element placement is preserved; water-bound vegetation retains its separate anchoring policy.

Investigation baseline: eight existing suites, 63 tests passed (instancedProps, vegetationRegionBatcher, chunkMeshData, farTerrain, terrainVisualHorizon, rockOutcrops, rockOutcrop, decorProps). They do not establish slope support or screenshot correctness. Run focused changed-system tests, type-check, lint and build for implementation; broaden only when changes justify it.

### Browser / manual

- Seeds `415424794`, `42`, `1234`; record exact coordinates and camera pose rather than relying on obsolete landform coordinates in earlier notes.
- Flat ground, steep mountains, crag/summit, saddle and local concavity; inspect ordinary boulders, clusters and outcrops separately, plus representative trees/bushes/logs and terrain-aware landmarks.
- Chunk seams and the outer streaming boundary: close/distant views, approach/retreat, camera rotation, unload/reload and save/load.
- Same scene with far terrain off/on; isolate fog diagnostically and inspect near/far support separately. No permanent visibility reduction to conceal a defect.
- Mine a repaired rock through its stages and revisit it after streaming/reload.
- Check native Windows/Intel Arc and WSL separately, including visible gaps, excessive burial and unchanged batching cost.

## Done when

- G1–G4 established failures have discriminating regression tests and implemented fixes; any conditional missing-terrain defect has an evidence-backed resolution in its proper owner.
- The reported visual failure is reproduced/classified and its outcome observed in the browser; if unavailable, status remains `verification needed` with the missing evidence named.
- No entire stone/shard floats because of anchor drift or shared-centre placement in the accepted scenes; natural supported overhangs are distinguished from detached geometry.
- Determinism, mining identity, chunk cleanup and performance constraints pass verification. Record technical and browser results separately.
- Update this plan, its notes and the relevant current-state owner only when implementation changes behaviour. Do not close archived plans' unrelated checks.

## Model escalation

The bounded repair direction can be finalized by Sol; the repository metadata uses its required Opus/Sonnet vocabulary for implementation routing. Sonnet can handle the isolated transform/sampler/outcrop slices with these notes; Opus is preferred for the combined footprint/batching and boundary-contract work. Astra review is warranted only if evidence requires a shared simulation-ground authority or near/far residency redesign, not simply because several render files participate.
