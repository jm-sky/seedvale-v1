# Seedvale Blender / MPFB2 Knowledge Base

Compact AI knowledge base for the Seedvale character asset pipeline.

**Target:** Blender 5.2 + current MPFB2 2.x.

## Read order

1. `AI_QUICK_REFERENCE.md` — minimal context; read first.
2. `AI_WORKFLOW.md` — operating rules.
3. Relevant recipe/rules file.
4. `MPFB2_REFERENCE.md` / `BLENDER_5_2_REFERENCE.md` only when technical detail is needed.
5. `TROUBLESHOOTING.md` when something fails.
6. `VERIFIED/` for procedures actually tested in Blender.

## Files

- `AI_QUICK_REFERENCE.md` — high-signal facts and rules for the agent.
- `AI_WORKFLOW.md` — how the agent should operate.
- `MPFB2_REFERENCE.md` — concise MPFB2 architecture/API map.
- `MPFB2_RECIPES.md` — repeatable procedures.
- `BLENDER_5_2_REFERENCE.md` — Blender 5.2 automation/export rules.
- `SEEDVALE_CHARACTER_RULES.md` — Seedvale-specific contract and budgets.
- `TROUBLESHOOTING.md` — known problems; only confirmed fixes become verified.
- `VERIFIED/` — tested procedures only.

## Quaternius UBC custom profession NPCs (tools-017)

Separate from MPFB2. Hand-authored outfit GLBs + shared UBC head compose.
Hair/beard are separate runtime attachments remapped onto the live UBC skeleton.

### Source layout

```text
docs/blender/sources/characters/
  quaternius/ubc-base/     # Superhero_Male_FullBody (CC0 subset)
  quaternius/hair/         # Hair_SimpleParted, Hair_Long, Hair_Beard (+ textures)
  quaternius/outfits/      # Quaternius_Outfits_All_Male.blend + Textures/ (authoring)
  custom/<profession>/outfit.glb
```

`outfits/Textures/` is required authoring dependency for the Blender master — keep it.
Build never reads `_temp/`.

### Blender export (custom outfit)

1. Select outfit meshes + Armature (exclude `WGTS_rig` / helpers).
2. Export glTF Binary (`.glb`), Selected Objects ON, Skinning ON, animations OFF.
3. Save as `custom/<profession>/outfit.glb`.

Outfit is clothing/props only; shared head/eyes/eyebrows are added by the build.
Hair/beard are **not** baked into the profession GLB — they ship as reusable
runtime assets and attach via `bindAccessoryToPlayerSkeleton`. Skinning must
stay on the UBC deformation bones (positive-weight joints must map to the
65-bone set).

### Build

```bash
pnpm assets:prepare-custom-ubc-npc
# or: python3 scripts/assets/prepare-custom-ubc-npc.py blacksmith
# hair only: python3 scripts/assets/prepare-custom-ubc-npc.py --hair-attachments
```

Adds a profession by: author `outfit.glb` → one manifest row (no hair/beard fields)
in `prepare-custom-ubc-npc.py` → rebuild.

Outputs:
- `public/models/characters/ubc/npc/male_<profession>.glb` (outfit + head)
- `public/models/characters/ubc/hair/{hair_simple,hair_long,beard}.glb`

### Inspect gate

```bash
npx @gltf-transform/cli inspect public/models/characters/ubc/npc/male_blacksmith.glb
npx @gltf-transform/cli inspect public/models/characters/ubc/hair/hair_simple.glb
```

Expect: one skin, `JOINTS_0` + `WEIGHTS_0`, UBC bone names after `gltfpack -kn`, no animation clips. Texture profile is centralized (default 512 + WebP); do not Decimate in this pipeline.

## Source priority

1. Current Seedvale code.
2. Installed Blender 5.2 API/behaviour.
3. Installed MPFB2 source/API.
4. Official Blender/MPFB2 documentation.
5. Community tutorials/examples.

Old tutorials are references, not API truth.

## Status

- `researched` — supported by current source/docs research.
- `verified` — tested in the target environment.
- `Seedvale-verified` — tested and accepted through the Seedvale pipeline.
- `assumption` — hypothesis; never present as fact.
- `obsolete` — superseded information retained for history.
