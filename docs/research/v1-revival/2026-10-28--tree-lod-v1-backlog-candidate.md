# Backlog candidate — V1 tree geometry LOD (6 species)

**Created:** 2026-10-28  
**Status:** candidate — not approved for implementation  
**Proposed priority:** high, **not yet ranked** against active A/B/C work  
**Area:** world vegetation / rendering  
**Owner for future planning:** existing `world-terrain` domain; confirm current plan ownership/ID under `docs/plans/PLANNING.md` before drafting a formal plan  
**D4:** performance-relevant candidate, subject to current Performance-First coordination and measurement discipline

## Objective

Improve forest-heavy FPS, frame-time stability and rendering scalability using distance-based tree representation LOD, without reducing forest density or changing deterministic placement, species selection, authoritative simulation or worldgen.

## Verified starting point and available assets

- The **inert** V1 asset package is present at [`public/assets/tree-lod/v1/README.md`](../../../public/assets/tree-lod/v1/README.md), introduced in asset commit `d867f38` (provenance as reported by the author).
- It contains `manifest.json`, `trees-lod.glb` with V3-derived LOD0/LOD1 references, an eight-direction impostor atlas, normal atlas, metadata, and extraction/validation scripts. The package README states **no game code loads the files**; original V1 `public/models/nature/*.glb` remain active.
- Current V1 uses instanced vegetation, `src/terrain/vegetationRegionBatcher.ts`, `src/render/instancedProps.ts`, and distance-dependent instance reduction; the proposed additional axis is **geometry LOD**. Verify the exact current rendering behavior when planning.
- Six supported V1 mappings:

| V1 model | V3 asset variant |
| --- | --- |
| `birch_1` | `Birch_A` |
| `maple_1` | `Maple_A` |
| `deadtree_1` | `Dead_A` |
| `pine_1` | `Pine_A` |
| `pine_3` | `Pine_B` |
| `pine_5` | `Pine_C` |

The remaining seven V1 tree models are deliberately **parked**. Do not widen coverage in this candidate.

## Candidate design (not yet authorized)

- **LOD0, near:** preserve existing V1 detailed models.
- **LOD1, medium:** selectively use prepared simplified meshes.
- **LOD2, far:** use prepared eight-direction billboard impostors.
- Integrate with V1's regional batching/instancing and tree lifecycle; **do not** port V3's entire `TreeChunks` system.
- Set LOD thresholds only after V1 visual checks and targeted measurement. V3 thresholds are references, **not** approved settings.
- Preserve entity identity, placement, height distribution, species selection, chopping, regrowth, collisions, streaming, persistence and shadows.

### Planning risks and questions

1. V3-derived LOD0 references may differ from V1's original LOD0 visually; verify silhouette/color/transitions for each of six species.
2. Assess model scale/pivot normalization and tree-height preservation, including V1's per-instance transforms.
3. Determine near/mid/far batch ownership, culling and shadow policy without per-tree simulation-side swaps.
4. Avoid visible popping, billboard yaw artifacts and rebuild/upload stutter at LOD transitions.
5. Account for region streaming/unloading and lifecycle changes (felled/regrowing trees); define GPU disposal and identity mapping.
6. Compare impact against current A/B/C bottlenecks: geometry reduction does **not** automatically reduce draw calls or improve CPU-bound frames. Include triangle, main/shadow submissions, GPU time, frame tails, allocation/upload and visual parity evidence.

## Position in the performance queue

**Candidate, high priority proposed; not approved or scheduled.** Evaluate at the next performance-prioritization gate relative to ongoing A (NPC/fauna), B (settlements), C (grass/streaming). It can become a distinct world-vegetation optimization slice only after focused recon and an author-approved implementation plan. Do not interrupt currently approved slices or disturb an existing benchmark baseline.

### Next decisions / work

1. **Coordination:** compare expected forest ROI against currently evidenced A/B/C hotspots; decide when this candidate should enter the implementation queue.
2. **Focused architecture recon and plan:** inspect real V1 sources and existing plan IDs/ownership; identify smallest reversible LOD1-first stage, then an independently gated billboard stage. The originally suggested planning model was Opus 5.5; any capable planning agent with repo access can perform it.
3. **Later implementation, only after author approval:** preserve V1 LOD0 and runtime authority, with targeted regression tests, visual verification and native GPU measurements.
4. **Keep/revert:** require measurable benefit without density, appearance, interaction, shadow or frame-tail regressions.

## Explicit constraints

No tree-height changes; no density reduction; no worldgen/simulation changes; no wholesale V3 renderer migration; no runtime authorization from this backlog entry; no unrelated D4 integration. V2/V3 are references/donors only.

## References

- [V1 tree LOD package](../../../public/assets/tree-lod/v1/README.md) — authoritative manifest and asset notes
- `src/terrain/vegetationRegionBatcher.ts`
- `src/render/instancedProps.ts`
- `src/world/treeLifecycle.ts`
- V3 donor: `src/game/render/treeLod.ts` (V3 repository)
- Asset commit: `d867f38`
- [Three-track performance roadmap](./2026-10-27--performance-three-track-roadmap.md)
- [Strategic Brief](./STRATEGIC-BRIEF.md)
