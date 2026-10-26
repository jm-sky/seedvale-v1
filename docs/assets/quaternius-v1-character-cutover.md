# Quaternius character cutover (V3 → V1 live)

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Status:** Live cutover note for `legacy/seedvale`.

## Products

Runtime characters load from `/assets/characters/` (copied from V3 `public/assets/characters/`, post-`74a01f20` heads). See [SuperHero head residual](../research/v1-revival/2026-10-26--v3-character-heads-superhero-residual.md).

## Rebuild recipe (no V3 tree required)

| Layer | V1 path |
|---|---|
| Blender scripts | `scripts/assets/blender-*.py` — `PACK` defaults to `docs/blender/sources/characters/quaternius/outfits/` (`Quaternius_Outfits_All_Male.blend`) |
| Node builders | `scripts/assets/build-characters.mjs`, `build-equipment-modules.mjs`, `build-head-variants.mjs`, `build-hair.mjs`, `head-cut.mjs` |
| Raws | `assets-src/characters/` |
| Pipeline overview | [quaternius-character-blend-pipeline.md](./quaternius-character-blend-pipeline.md) (paths adapted for this package) |

Set `SV_ROOT` to this package root when running Blender scripts. Female Blender re-export needs a female master later; live female GLBs/raws are shipped as products.

## Heads

Prefer `node scripts/assets/build-head-variants.mjs` after any head recipe change. Parked Superhero FullBody fallback: `public/models/parked/character-pack/models`. Do not hide `SuperHero_*` meshes at runtime.
