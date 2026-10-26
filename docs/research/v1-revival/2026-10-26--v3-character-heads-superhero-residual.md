# V3 → V1 character heads: SuperHero FullBody residual

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Status:** Hazard note for V3→V1 character-asset migration; not a migration plan.  
**V3 fix commit:** [`74a01f20`](https://github.com/jm-sky/seedvale/commit/74a01f20) (Issue #20 head-pack repair).  
**Full evidence (V3):** [session notes §11–§12](https://github.com/jm-sky/seedvale/blob/main/docs/issues/2026-10-23--021--peasant-shoulder-session-notes.md).

## Why this note exists

When copying Quaternius / CharacterKit character GLBs from V3 into V1, **do not ship the pre-repair `*_Head.glb` packs**. Heads built with only a coarse neck Y-cut still contain Superhero FullBody shoulder/arm skin. Attaching the head (V1 asset browser, V2 `buildHuman`, V3 `CharacterKit`) rebinds that residual onto the outfit skeleton, so dark SuperHero mesh pokes through Peasant (and other) cloth at the shoulders.

A separate **Body↔Arms outfit seam** can remain after the head fix. Do not confuse the two; this note covers only the head-pack contamination.

## Problem (confirmed)

| Fact | Detail |
|---|---|
| Contaminating nodes | `SuperHero_Male` (`MI_Superhero_Male`), `Superhero_Female` (`MI_Superhero_Female`) |
| Provenance | `Superhero_{Male\|Female}_FullBody.gltf` → historical `headOnly(minY)` kept triangles with all verts `Y > 1.5` (male) / `1.44` (female) |
| What the Y-cut left | Shoulder/upper-arm skin still weighted to clavicle / upperarm / lowerarm / hand |
| Runtime | Head attach loads **every** skinned mesh in the head GLB (no name filter). Head off = GLB not loaded — discriminator for diagnosis |
| Affected products | All eight packs: `{Male,Female}_Head{,_Lean,_Round,_Warm}.glb` |

Eyes / Eyebrows are fine (Head-only weights). Do **not** “fix” by skipping attach of `SuperHero_*` — that mesh is the face/neck skin.

## Solution (pipeline, not runtime)

V3 repair is **asset rebuild**, not CharacterKit filtering:

1. Shared transforms in V3 [`scripts/assets/head-cut.mjs`](https://github.com/jm-sky/seedvale/blob/main/scripts/assets/head-cut.mjs):
   - `headOnly(minY)` — existing neck Y-cut on Superhero materials.
   - `dropArmWeightedTris()` — on Superhero materials, drop any triangle with ≥1 **arm-dominant** vert (largest skin weight on `clavicle_*` / `upperarm_*` / `lowerarm_*` / `hand_*` / finger joints). Keeps Head / `neck_01` / spine face and neck.
2. Rebuild via [`scripts/assets/build-head-variants.mjs`](https://github.com/jm-sky/seedvale/blob/main/scripts/assets/build-head-variants.mjs) (**Base** + Lean/Round/Warm). FullBody source: extracted UBC path, or fallback `legacy/seedvale/public/models/parked/character-pack/models/`.
3. Do **not** run V3 `build-assets.mjs` for this (broken `unifySkins` / path layout). Prefer the focused head builder.

**Acceptance after rebuild:** Superhero meshes have **0 arm-dominant used verts**; Eyes/Eyebrows/`SuperHero_*` nodes still present; kit triangle budget still holds. Browser A/B: same camera/pose/`Walk_Loop`, head ON vs OFF — ON must not add SuperHero shoulder/arm skin.

## Migration checklist (V3 characters → V1)

1. Copy character outfits / hair / anims / eq as planned from **current V3 `public/assets/characters/`** (post-`74a01f20`), **or** rebuild heads with the same `head-cut` filter before copy.
2. Verify each migrated `*_Head*.glb`: no arm-dominant Superhero verts (gltf-transform inventory, same metric as V3 `_temp/issue20/head-mesh-inventory-after.json`).
3. Wire V1 head attach the same way as today (full head pack); do not add a runtime mesh-name skip as the product fix.
4. Visual check: Peasant (and at least one other outfit) with head ON — no SuperHero penetration at shoulders; expect possible leftover Body↔Arms holes (outfit issue, out of scope here).
5. If V1 still has bit-identical pre-repair heads under `public/assets/characters/` or compare mounts, replace them; old V2/legacy copies are contaminated evidence, not ship targets.

## Explicit non-goals for the migrating agent

- No CharacterKit / V1 runtime “hide SuperHero_Male” workaround.
- No Peasant outfit simplify / S7 soften-seal-tuck in the same pass unless separately authorized.
- No silent one-off hex edit of a GLB without regenerating through the documented head builder.
