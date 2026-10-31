# Plan: Character body variants — Asset Browser preview

**Created:** 2026-10-31
**Status:** `planned` 📋
**Type:** feature
**Priority:** medium · **Effort:** L
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `development` `diagnostics`
**Tags:** `visual` `animation` `tooling`
**Model:** Opus, Sonnet

## Goal

Enable the author to inspect and compare male/female character **body builds** in the existing Asset Browser before approving any in-game NPC/player integration. The browser needs only a simple body-build select for the currently viewed character; side-by-side presentation is **not** required.

## Confirmed starting point

- V1 `scripts/assets/body-warp.mjs` defines the `Fat` rest-pose warp. The documented `scripts/assets/build-body-morph.mjs` was **not found** at that path in V1; V3 has an implementation to inspect and selectively adapt.
- `src/characters/characterTypes.ts` and `src/ai/npcAppearance.ts` already support `Base | Lean | Round | Warm` **head** variants; these are not body builds.
- `src/characters/assembleCharacter.ts` binds body, head, hair and optional equipment garments to the body skeleton. Its current rebind path creates new `SkinnedMesh` instances; verify preservation of morph attributes/dictionaries/influences on attached garments rather than assuming them.
- `src/tools/assetBrowser/ui/AssetBrowser.vue`, `src/tools/assetBrowser/state.ts` and `src/tools/assetBrowser/viewer/` own the existing preview/control path.
- `src/ai/NpcAgent.ts` uses `assembleCharacter` in gameplay and scales child stand-ins. **This plan must not change that behavior.**
- The binary contents of currently shipped GLBs have not been verified; inspect real assets before assuming the `Fat` morph is present.

## Scope

1. Audit the relevant shipped male/female GLBs and equipment packs for morph targets, compatibility, size and geometry. Verify whether regeneration is necessary and whether V1's existing build chain already produces any body morphs.
2. Reuse V1's body warp and, if needed, selectively adapt V3's `build-body-morph.mjs` into V1's asset pipeline. Do not overwrite production assets blindly; ensure reproducibility, idempotence and a bounded change footprint.
3. Make the following preview choices available where visual/technical quality is acceptable:
   - **Normal:** a natural, average build with less conspicuous musculature.
   - **Muscular:** existing Super Hero physique (reference/baseline).
   - **Slim:** visibly slender build, **not** merely a leaner head.
   - **Heavy:** genuinely overweight body with a prominent belly and fatty distribution, **not** a wider muscular body.
   - **Child:** age-appropriate proportions, **not** merely uniformly scaled adult geometry.
4. **Normal vs Muscular is optional** if reducing the stock Super Hero musculature cannot be achieved credibly with the current source geometry. **Child is exploratory**: if credible child proportions require new modeling/rigging, do not ship a placeholder; record the blocker. Do not label an unimplemented variant as visually complete.
5. Add one body-build selector to the Asset Browser, preserving the current sex/outfit/head/hair/animation selection. Change the currently inspected character without forcing the author to reselect other options. Keep the existing compare/layout features untouched.
6. Ensure any applied body morph follows compatible clothing, skirts and armor/equipment meshes, rather than leaving them at the base silhouette. Keep textures, materials and existing model appearance intact.

## Technical constraints

- **Asset Browser and asset-build tooling only.** No runtime NPC/player appearance selection, simulation, world generation, save format, gameplay, or production-character behavior changes.
- Use the V1 character assets/assembly conventions. V3 is a donor for isolated morph-building techniques, not a replacement CharacterKit or renderer.
- Preserve stable bone bindings, animations, material response, texture/tint/dye handling, default character visuals and resource lifecycle.
- Treat changes to shared `assembleCharacter` with particular care because gameplay calls it: prefer an isolated preview-only adapter, or a strictly opt-in and default-neutral extension with regression coverage.
- Do not merge meshes or refactor the existing kit architecture as part of this experiment.
- Record any implications of morph targets for draw calls, asset bytes, GPU/CPU memory, animated bounds/culling and shader variants; do not claim FPS impact without matched measurement.
- Add useful `@domain tools` JSDoc on new architectural/public functions where it improves code discovery.

## Verification / acceptance

- In Asset Browser, switching available body builds preserves selected sex, outfit, face, hair and animation; the original Super Hero body is unchanged in the default/baseline path.
- Test both sexes and representative Peasant, profession outfits, female skirts and available armor, with Idle, Walk, Run, Sit and any available bending/kneeling clips.
- Inspect shoulder, arm, belly, hip, thigh and neck seams, clothing penetration, skinning defects, morph deformation and animation transitions. Do not infer visual correctness from build/tests alone.
- Where the environment supports browser viewing, capture labeled screenshots of representative body builds and animation poses; review them and report artifacts, uncertainty and any cases requiring author judgment.
- Run relevant build/type checks and focused tests for asset generation and preview selection; establish that the game runtime remains unchanged.
- Report which variants are genuinely ready to view, which remain experimental/blocked, the GLB/memory cost, and any follow-up requirements. **Author visual approval is required before any future in-game integration.**

## Non-goals

- No per-NPC deterministic body-build selection or persistence.
- No gameplay/player model rollout, world performance A/B, or general CharacterKit optimization.
- No new child rig/asset-production project within this plan.
- No side-by-side comparison requirement or general Asset Browser redesign.

## Handoff

Implement as a reversible visual prototype and stop at the Asset Browser. Clearly distinguish verified results from assumptions and defer decisions on failed/unconvincing silhouettes to the author.
