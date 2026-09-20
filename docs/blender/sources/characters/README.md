# Character pipeline sources

Repo-local inputs for Quaternius UBC custom NPC builds (tools-017).

```text
characters/
  quaternius/     # minimal CC0 UBC base + hair + Blender outfit master
  custom/         # hand-authored profession outfit GLBs
```

Custom builds must work from a fresh checkout without `_temp/`.

Build entry: `pnpm assets:prepare-custom-ubc-npc`  
(`scripts/assets/prepare-custom-ubc-npc.py`)

See `docs/blender/README.md` for the authoring/export/build workflow.
