# NPC Character Art Direction — Author Decisions (2026-10-27)

**Status:** author-agreed visual direction; technical pipeline and implementation not approved
**Target:** SeedVale V1 (`jm-sky/seedvale-v1`)
**Scope:** NPC body variety, profession outfits, female garments, selective unique NPC looks, Blender source preservation, modular armor appearance
**Implementation:** none authorized by this record. Respect the revival D4 performance-first integration freeze.

## 1. Agreed artistic direction

- **B — shared base body silhouettes and skeleton, recognizable profession-specific outfits.** Preserve variety without creating separate independent actor/animation systems for each profession.
- Prefer visually coherent, medieval-inspired, practical clothing. Named, important characters may have unique looks.
- Body variety: retain the Superhero/Base reference, explore existing stout/Fat variants and suitable young/child proportions. **Slim is not a requirement.** The face-shape alternatives (Base/Lean/Round/Warm) are a separate dimension from body build; the existing Lean *face* does not constitute a request for a Slim *body*.
- Female bodies and clothing should have a **more modest bust and less exaggerated waist**. Technical corrections should preserve mesh integrity and clothing fit.
- Do not replace the author's hand-edited V1 Blender work with generated V3 assets without first inspecting and evaluating the originals.

## 2. Clothing and roles

| Subject | Author direction | Implementation clarification |
| --- | --- | --- |
| Herbalist | No hood; possible green vest | Check current hooded model and authoring source; vest is a candidate, not mandatory. |
| Female working skirt (`WorkSkirt`, provisional name) | Looser, to mid-calf; e.g. field workers | Practical silhouette, animation clearance. |
| Female long skirt (`LongSkirt`, provisional name) | Ankle-length; e.g. merchants, inn waitresses | Can be more fitted at waist/hips, **not tight**, with ease/flaring toward hem. |
| Aprons | Selected professions; also wives of husbands in selected professions **if the wife has no profession** | Define eligibility deterministically, based on actual profession/family data; do not give every woman an apron. Apron as detachable visual garment is a candidate technical approach, not yet selected. Exact professions/household mapping remain open. |
| Kate Hornblower (merchant) | Green dress, with long skirt | Unique named-character override should retain her identity. |
| Peasant farmer | Hat desired | First check whether the existing V1 source `.blend` already contains it. |
| Miner | Dark Peasant-style clothing | Prefer reusing the Peasant base; validate desired appearance before new geometry. |
| Modular armor | Visible armor components compatible with common body/rig | Coordinate appearance with selected layered armor and body-area protection gameplay; no premature parallel equipment mechanics. |

**Historical correction:** original V1 did not have skirts; the currently wired `PeasantSkirt` was added through the later V3 CharacterKit transfer. Do not conflate original V1 authored assets with the current V1 runtime.

## 3. Skirt quality requirement

The current skirt sometimes clips through the knee during animation. Both variants must be verified with **actual V1 animation clips** (walk/run, idle, sitting and relevant work animations where present), across the supported female builds and footwear. Investigate geometry clearance, deformation weights around thigh/knee/calf, and potential under-skirt body occlusion. The actual root cause is **not yet established**. Prefer a source/asset-level fit and skinning fix, not ad hoc Three.js masking, and avoid introducing runtime cloth simulation as a default. Inspect animation poses and generated GLB before judging success.

## 4. Existing source and pipeline — distinct facts

### V1 author-created assets

`docs/blender/README.md` documents hand-authored UBC profession assets and the source layout:
- `docs/blender/sources/characters/quaternius/outfits/Quaternius_Outfits_All_Male.blend` (plus `Textures/`)
- `docs/blender/sources/characters/custom/<profession>/outfit.glb`
- `scripts/assets/prepare-custom-ubc-npc.py` (custom Blacksmith/Woodcutter source preparation)

These are **V1's own manual Blender works without MCP**, not identical to the V3 procedural scripts. Existing runtime `src/ai/npcAppearance.ts` currently selects `Peasant` for male Woodcutter and `Blacksmith` for male Blacksmith; determine whether manually authored outputs are active, parked or superseded before selecting a donor.

### V3 procedural donors

V3 `scripts/assets/` contains:
- `blender-character-variants.py` (Peasant_Boots, Blacksmith and **hooded** Herbalist)
- `blender-dress-modules.py` (Dress, LongSkirt, PeasantSkirt, etc.)
- `blender-equipment-modules.py`, `blender-armour-modules.py`
- `build-head-variants.mjs` / `head-warp.mjs` (face variants)
- `build-body-morph.mjs` / `body-warp.mjs` (`Fat` morph baked into outfit/equipment GLBs).

V3's dress script currently sets `BUST_FLATTEN = 0.0`, documenting prior clipping/hole at the sternum when attempting `0.65`; therefore its bust correction is **not a proven ready-made fix**. V2 reference body variant used Fat weights 0/0.5/1 and excluded children from Fat. Current V1 `src/characters/characterTypes.ts` exposes face variants and only `PeasantSkirt` as base garment; `src/characters/assembleCharacter.ts` rebinds garment skinned meshes. None of these code facts constitutes Blender/browser visual verification.

V3's `docs/assets/quaternius-character-blend-pipeline.md` describes its own **different** upstream source arrangement; its claim that custom .blend masters are absent applies to V3, **not V1**.

## 4a. Author-inspected V1 Blender master — 2026-10-27

**Evidence:** author's direct inspection of `Quaternius_Outfits_All_Male.blend`; these are source-scene observations, **not** verification that current live V1 uses these exact variants.

| Hand-edited source variant | Confirmed authoring details |
| --- | --- |
| `Peasant` | Has a hat; lower legs are wrapped in cloth/rags instead of wearing boots. |
| `Woodcutter` | Peasant-derived outfit with boots and brown suspenders. |
| `Blacksmith` | Peasant-derived outfit with boots, an additional belt, leather forearm protectors adapted from Ranger, and a black front apron/panel. |

**Preservation intent:** retain these manual author edits as valuable V1 source work. The Blacksmith's black front apron is a potential **bounded Claude + Blender MCP improvement**, preserving the rest of the hand-authored outfit; this is a candidate, not an authorized implementation task.

**Required targeted follow-up:** compare this `.blend` and any exported custom GLBs with the **live V1** CharacterKit/runtime mapping, especially the current `Woodcutter → Peasant` fallback and the existing `Blacksmith` asset; distinguish source assets, generated output, and actually loaded model. Check whether the Peasant hat can be reused for the requested farmer appearance. Do not assume the manually edited master is already used by the live runtime.

## 5. Unresolved design/technical decisions

- Exact professions and spouse/no-profession rules that receive an apron; relationship with profession-specific base garments.
- Child/young proportions, rig/animation fitting, and which V1 assets can be reused.
- How many body-build weights are desirable in V1 and whether shipped GLBs retain the Fat morph; check mesh and runtime before declaring it live.
- Specific hat, vest, apron, dress, armor visual modules and their source-of-truth Blender files.
- Skirt clipping root cause and sufficient gait/animation/pose coverage.
- Offline asset recipe (V1 manual .blend as source vs selectively adapted V3 Blender/Python/Node recipes), reproducibility and export/verification gates.
- Actor render costs: additional skinned meshes/skeletons/materials must align with ongoing NPC/fauna render optimization, not invalidate performance measurement mid-track.

## 6. Evidence and coordination

- V1: `docs/blender/README.md`, `docs/blender/SEEDVALE_CHARACTER_RULES.md`, `scripts/assets/prepare-custom-ubc-npc.py`, `src/ai/npcAppearance.ts`, `src/characters/{characterTypes,baseGarments,assembleCharacter}.ts`.
- V3: `docs/assets/quaternius-character-blend-pipeline.md` and `scripts/assets/*` listed above.
- Revival: `docs/research/v1-revival/STRATEGIC-BRIEF.md`, `2026-10-27--revival-audit--npc-fauna-rendering.md` and `2026-10-27--revival-audit--equipment-armor-combat.md`.

This record captures **author visual decisions and static code/document recon**, not a completed asset inspection, Blender execution, game test, or approval to implement. Draft an implementation plan only after targeted source and animation inspection and reconciliation with the performance-first freeze.
