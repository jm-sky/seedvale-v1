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

## Author-edited V1 outfits → live CharacterKit (2026-10-28)

**This is the live path.** The male master `quaternius/outfits/Quaternius_Outfits_All_Male.blend` holds the
author's hand-edited collections `Peasant` (hat, cloth leg wraps), `Woodcutter` (boots, suspenders) and
`Blacksmith` (boots, extra belt, Ranger bracers, dark tunic panel, leather work apron `Male_Blacksmith_Apron`).

```text
master .blend
  → scripts/assets/blender-character-variants.py  (SV_BUILD=authored; Blender 5.2, MCP or Scripting tab)
  → assets-src/characters/Male_{Farmer,Woodcutter,Blacksmith}.raw.glb   (byte-reproducible)
  → node scripts/assets/build-characters.mjs --raw Male_Farmer Male_Woodcutter Male_Blacksmith
  → public/assets/characters/Male_{Farmer,Woodcutter,Blacksmith}.glb    (CharacterKit body; assembleCharacter)
```

Each outfit exports as **one joined skinned mesh** (one draw call per material). Materials sharing a texture
collapse; Hue/Saturation value-multiply materials (`MI_Blacksmith`, `MI_Blacksmith_Belt`) are baked into their
512 px copy; every flat colour of an outfit goes into one palette texture. The bone-parented Peasant hat is
rigidly skinned to `Head`. Run with `os.environ['SV_ROOT'] = r'<repo>'` when exec'd; `SV_OUT` redirects output
for verification. The blacksmith apron is authored by `scripts/assets/blender-blacksmith-apron.py`
(re-runnable; replaces only `Male_Blacksmith_Apron`). Female bodies for these outfits do not exist.

Procedural mode (`Peasant_Boots`, `Herbalist`, female `Blacksmith`) needs stock Peasant parts: the male master's
`Male_Peasant_Feet` is author-edited, so the male build reads `Male_Woodcutter_Feet` and fails fast on author
materials. The female master is not in this repo (`Female_*` raws cannot be regenerated here).

Evidence and limits: `docs/research/v1-revival/2026-10-28--npc-character-blender-verification.md`.

## Quaternius UBC custom profession NPCs (tools-017) — legacy, not loaded by runtime

`public/models/characters/ubc/npc/*` is not referenced by `src/` since the CharacterKit cut-over; the live
bodies come from the section above. `custom/<profession>/outfit.glb` are older exports of the same master
(pre-apron) and `prepare-custom-ubc-npc.py` does not run on Windows as-is (spawns `npx` without a shell).

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
