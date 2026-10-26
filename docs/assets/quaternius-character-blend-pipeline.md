# Quaternius character `.blend` pipeline (All_Male / All_Female)

**Date:** 2026-10-23 · **Status:** reference (not a plan)  
**Related:** [Issue #20 handoff](../issues/2026-10-23--020--peasant-pipeline-handoff.md), v2 research [007](../reference/research/v2/2026-10-03--007--quaternius-outfit-blend-modular-variants.md), [BLENDER-SKILLS.md](BLENDER-SKILLS.md)

Short map so agents do not re-hunt “custom” Blender masters that were never committed.


**V1 package note (2026-10-26):** In `legacy/seedvale`, Blender `PACK` defaults to [`docs/blender/sources/characters/quaternius/outfits/`](../blender/sources/characters/quaternius/outfits/) (`Quaternius_Outfits_All_Male.blend`). See [quaternius-v1-character-cutover.md](./quaternius-v1-character-cutover.md). Do not copy blends from V3 `_temp`.


## Verdict

| Question | Answer |
|---|---|
| Where is `All_Male.blend`? | Local Quaternius Source pack (git-ignored). Not on GitHub. |
| Are there Claude/MCP-edited master `.blend` files? | **No.** Scripts load stock blends, export `.raw.glb`, then restore the scene. |
| Can we rebuild the variants? | **Yes** — stock blends + `scripts/assets/blender-*.py` + Node post-process. Fix the pack path first. |

## Source files (local only)

Expected by the Blender scripts (`PACK`):

```text
_temp/extracted/Modular Character Outfits - Fantasy[Source]/
  All_Male.blend
  All_Female.blend
  All_Female_v2.blend   # optional; only if save_v2_blend() was run
```

As of 2026-10-23 the pack lives under the inventory layout instead:

```text
_temp/models/quaternius-x/modular-character-outfits-fantasy-source/
  Modular Character Outfits - Fantasy[Source]/
    All_Male.blend      (~15 MB, stock Quaternius, dated 2025-07-05)
    All_Female.blend    (~14 MB)
```

`_temp/extracted/` currently has only the nature MegaKit symlink — **not** this outfit pack. Before re-running Blender scripts, symlink or copy the Source folder to the `PACK` path above (or set `SV_ROOT` / adjust `PACK` in the script).

`jm-sky/seedvales-v2` never committed these blends (`_temp` git-ignored). Remote tree only has unrelated texture `.blend` files under `docs/assets/textures/`.

## What each script builds

All under `scripts/assets/`. Blender 5.x (MCP `execute_blender_code` or Scripting workspace). Env: `SV_ROOT`, often `SV_SEXES` / `SV_VARIANTS` / `SV_MODE` / `SV_OUT`.

| Script | Input | Output |
|---|---|---|
| `blender-character-variants.py` | `All_<Sex>.blend` | `assets-src/characters/{Male,Female}_{Peasant_Boots,Blacksmith,Herbalist}.raw.glb` |
| `blender-equipment-modules.py` | copy of `All_<Sex>.blend` under `_temp/work/` (source never saved) | `assets-src/characters/eq/<Module>_<Sex>.raw.glb` (Bracers, Jerkin, Trousers, Ranger_Plain, …) |
| `blender-dress-modules.py` | female Noble/Peasant parts (helpers from equipment script) | `NobleBodice`, `LongSkirt`, `Dress`, `PeasantSkirt` → `eq/*_Female.raw.glb`; optional `save_v2_blend()` → `All_Female_v2.blend` |
| `blender-armour-modules.py` | Peasant + procedural | Chainmail, StuddedLeather, PaddedJacket, LeatherCap → `eq/` |

Post-process (Node, no Blender):

- `build-characters.mjs --raw` → `public/assets/characters/`
- `build-equipment-modules.mjs` → `public/assets/characters/eq/` (only listed production modules; not every raw candidate)

Committed raws already exist under `assets-src/characters/` (+ `eq/`). Re-export only when the Source mesh or script recipe changes.

## Explicitly not from `All_*.blend`

| Product | Actual pipeline |
|---|---|
| Face Round / Lean / Warm | `head-warp.mjs` + `build-head-variants.mjs` (Node morph of Base Characters heads) |
| Body Fat / heavy / stout | `build-body-morph.mjs` / morph targets on outfits — not a saved `.blend` |
| Base Male/Female Peasant | Upstream **Outfits** glTF → historical `build-characters` / Fat — not authored by `blender-character-variants.py` |
| Woodcutter “outfit” | Data: `woodcutter.outfit = 'Peasant'`; held axe kit is separate (`build-held-items.mjs`) |

## Reproduce checklist

1. Ensure `PACK` resolves to a folder that contains stock `All_Male.blend` / `All_Female.blend`.
2. Run the relevant `blender-*.py` in Blender 5.x (scene restored afterwards; do not expect a new master `.blend` unless you call `save_v2_blend()`).
3. Run the matching `build-*.mjs` for simplify / meshopt / Fat.
4. For dress modules that need a durable Blender copy: after `build_dresses()`, call `save_v2_blend()` so `All_Female_v2.blend` lands next to the stock file (that copy is still git-ignored under `_temp/`).

## Why no custom masters in git

Design (D-REN-8 era): Blender is dev-only. Scripts snapshot the scene, export contract `.raw.glb`, restore. The committed product is the raw/GLB recipe chain, not an edited Quaternius master. Missing `All_Female_v2.blend` or `work_<Sex>.blend` is expected unless someone re-ran the optional save helpers on this machine.
