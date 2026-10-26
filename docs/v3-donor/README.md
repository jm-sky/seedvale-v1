# V3 donor intake

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Status:** Staging copies from Seedvale V3 for later V1 integration — **not** an implementation backlog and **not** runtime wiring.

Provenance: copied from V3 repo `jm-sky/seedvale` at commit [`199f98e2`](https://github.com/jm-sky/seedvale/commit/199f98e215418999fc589891163afd321df7803f) (`199f98e215418999fc589891163afd321df7803f`).

This tree holds selected V3 assets, character briefs, item data/docs and plans so revival work can use them without depending on the V3 working tree. Merging into `public/` or V1 gameplay code is a separate decision.

## Packages

| Package | Path | Status | Contents (approx.) |
| --- | --- | --- | --- |
| Character kit (NPC/player) | live: [`public/assets/characters/`](../../public/assets/characters/), sources: [`assets-src/characters/`](../../assets-src/characters/) | **DONE** (earlier cutover; not duplicated here) | Quaternius / CharacterKit GLBs + build scripts. Head hazard: [SuperHero residual note](../research/v1-revival/2026-10-26--v3-character-heads-superhero-residual.md). |
| Voices / Fish Audio | [`voices/`](./voices/) | Staged | **317** MP3 barks (~10 MB) + voice catalog / production docs. Plans under [`plans/`](./plans/) (`audio--002`, `audio--004`). |
| Character profiles | [`characters/`](./characters/) | Staged | Bios for Hornblowers, Woodwards, **Casimir Eastwood**; Saltmere dialogue packs; **5** reference PNGs (~12 MB); `q0-cast-and-names`. |
| Items | [`items/`](./items/) | Staged | **A.** 125 GPT illustration PNGs (~51 MB) + manifest/style. **B.** 107 game-icons.net category/type SVGs + maps. Donor TS defs + illustration docs. Plans: `items--007`. |
| Concept art | [`art/`](./art/) | Staged | 6 SeedVale concept PNGs (~18 MB) + optional `menu-bg-world-alive.jpg`. |

Total staged tree ≈ **95 MB**.

## Layout

```text
docs/v3-donor/
  README.md                 # this index
  voices/
    mp3/                    # 317 bark clips
    docs/                   # NPC-VOICE-CATALOG, production notes, Fish history, …
  characters/
    profiles/               # character + dialogue markdown
    references/             # likeness PNGs
  items/
    illustrations/          # generated item crops (PNG)
    icons/                  # type/category SVG glyphs + attribution
    data/                   # weapons/armor/goods/catalog/types + itemIcons maps
    docs/                   # ITEM-ILLUSTRATIONS, exceptional-equipment-copy
    manifest.json
    style-reference-image.png
    README.md               # V3 assets-src/items README
  art/                      # concept art + menu bg
  plans/                    # selected V3 plans (copies only; not merged into docs/plans/)
```

## Explicit excludes (this intake)

- `_temp/fish-barks/` (WAV / casting batches)
- World SFX `.ogg` under V3 `public/sounds/`
- V3 runtime audio TS (`npcVoiceManifest`, etc.)
- `assets-src/items/sheets/` (~278 MB OpenRouter generation sheets — regenerable; final crops are included)
- Full `_temp/icons/` game-icons archive (~18 MB)
- Character/stat SVG set `src/game/ui/character/icons/` (not the item catalogue)
- Quaternius `_temp` source packs (kit already live in V1)

## Notes

- **Illustration gap:** V3 catalogue has more defs than committed crops (~169 defs vs 125 PNGs). Missing IDs stay a V3 production gap, not filled here.
- **Voices vs V1 runtime:** staging does not overwrite `public/sounds/voices/`. V1 still has its own clips (including a few filenames only on V1).
- **Item TS / icon maps:** reference copies under `items/data/` — do not treat as a drop-in replacement for V1 `src/items/`.
- **Plans:** kept under `plans/` so they do not collide with V1's `docs/plans/` backlog numbering.
