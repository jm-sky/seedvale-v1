# HAIR_Moustache source

Chevron / woodcutter moustache for the CharacterKit hair packs (120 tris, UVs inside the beard's atlas patch of `MI_Hair_1`).

| File | Role |
|------|------|
| `moustache.blend` | Blender scene (HeadRef = Male head rest pose + the moustache) |
| `moustache.glb` | Raw export (glTF frame, metres, no skin) — input of `scripts/assets/add-moustache.mjs` |

Rebuild: `node scripts/assets/moustache-dump-head.mjs public/assets/characters/Male_Head.glb SuperHero_Male <head.json>`, run
`scripts/blender/moustache/build_moustache.py` in Blender (`HEAD_JSON`, `OUT_DIR` set), then `node scripts/assets/add-moustache.mjs`
(idempotent; patches `hair.glb`, `hair_Round/Lean/Warm.glb`).
