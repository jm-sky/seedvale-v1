# Item illustrations: catalogue baseline and generation pipeline

**Status:** `in progress`
**Created at:** 2026-10-22  
**Created by:** ChatGPT Luna
**Updated at:** 2026-10-22 (Cursor Composer; local OpenRouter pipeline landed, no paid generation)
**Domain:** items / visual assets
**Roadmap:** optional item UI art side track; no gameplay dependency
**Depends on:** existing item catalogue and item UI; style approval before image production
**Finished:** —

## Purpose and scope

Establish a source-based starting count and a staged process for creating **2D inventory/catalogue item illustrations** for SeedVale. This is not a proposal to replace world-space 3D models, change combat/economy rules, or create images immediately.

Canonical runtime source: `src/game/data/items/catalog.ts` combines `weapons.ts`, `armor.ts` and `goods.ts`. Types and the distinction between `tier`, `availability` and per-instance `quality` live in `src/game/data/items/types.ts`. All counts below refer to distinct catalogue definitions, **not physical inventory instances**, not rendered icons, and not distinct quality variants. Snapshot: default branch, inspected 2026-10-22. Recount after catalogue changes.

## Catalogue baseline

| Category / subdivision | Definitions |
|---|---:|
| Melee weapons | 30 |
| Ranged weapons | 8 |
| Armour | 39 |
| Shields | 3 |
| Ammunition | 7 |
| Tools | 37 |
| Food | 10 |
| Herbs | 6 |
| Medical | 2 |
| Resources | 21 |
| Books | 3 |
| Miscellaneous | 3 |
| **Total** | **169** |

Equipment (weapons + armour + shields + ammo): **87**. All remaining goods: **82**.

| Item tier | Definitions |
|---|---:|
| `common` | 155 |
| `masterwork` | 7 |
| `legendary` | 7 |
| **Total** | **169** |

| Availability | Definitions |
|---|---:|
| `active` | 141 |
| `future` | 12 |
| `unique` | 14 |
| `quest-only` | 2 |
| **Total** | **169** |

These are **independent** axes. All seven legendary definitions are `unique`, but seven other `unique` definitions have `common` tier. Neither `masterwork` nor `legendary` means an individual instance's `poor | average | good | exceptional` quality. Tier counts by equipment subgroup:

| Subgroup | Common | Masterwork | Legendary | Total |
|---|---:|---:|---:|---:|
| Melee | 22 | 4 | 4 | 30 |
| Ranged | 6 | 1 | 1 | 8 |
| Armour | 35 | 2 | 2 | 39 |
| Shield | 3 | 0 | 0 | 3 |
| Ammo | 7 | 0 | 0 | 7 |

Examples for the pilot: `sword`, `long_sword`, `mail_shirt`, `kingsbane_hauberk`, `ironvale_sword`, `shield` definitions (verify exact shield ID), a tool and a food/resource item. The 7 legendary items are `kestrel_dagger`, `harrow_shortsword`, `ironvale_sword`, `greywatch_longsword`, `yewmaster_longbow`, `kingsbane_hauberk`, `marshal_cuirass`. The 7 masterwork items are `ashgrove_dagger`, `millbrook_shortsword`, `fenmoor_sword`, `stonebridge_longsword`, `marlow_longbow`, `stoneford_mail`, `ravenmoor_cuirass`.

## Approved direction and asset locations

The author approved Renaissance graphite/sepia notebook sketches with strong contours and subtle hatching. Each object has an irregular semi-transparent parchment patch fading into true transparency. Use the actual reference PNG at `assets-src/items/style-reference-image.png` along with [style rules](items--007--item-illustration-style-reference.md).

- Original 3 × 2 six-item sheets: `assets-src/items/sheets/`.
- Approved individual PNG files: `public/assets/items/<item-id>.png`.
- Local generation: repository agent using OpenRouter and a supported GPT image model; see [pipeline notes](../research/2026-10-22--item-images-openrouter-pipeline.md). Confirm current API schema, model and costs before use.
- First step: local dry run, no paid generation. The pilot API request needs author approval.

## Workflow: repository agent and orchestrator

1. **Style (approved):** canonical reference image and parchment-patch transparency are fixed for the pilot; revisit only if a concrete defect emerges.
2. **Local OpenRouter pipeline and asset manifest:** **done (tooling).** CLI at `scripts/items/illustrations/cli.py`, manifest at `assets-src/items/manifest.json`, usage in [ITEM-ILLUSTRATIONS.md](../assets/ITEM-ILLUSTRATIONS.md). Six prior pilot crops are seeded as `generated` (not approved). Dry-run verified; **no paid OpenRouter call yet**. Still open: one-to-one vs shared bases; do not confuse `tier` with `quality`.
3. **Pilot:** after an approved budget, generate one six-item 3 × 2 sheet (default dry-run IDs: `long_sword`, `wooden_shield`, `hammer`, `bread`, `ashgrove_dagger`, `stoneford_mail`). Judge recognition at actual UI thumbnail size, consistency, silhouettes, cropping, transparent edges, visual hierarchy, and whether special equipment still fits grounded medieval art direction.
4. **Pilot review + corrections:** author approves taste; document revised style guide, negative constraints, sample prompt pattern and output specs before any bulk jobs.
5. **Production batches:** group by visual family, use a stable prompt recipe and the approved guide, output to staging, track generation version and audit per asset. Prefer deterministic file naming by catalogue `id`; prioritize `active` items, then `unique`/`quest-only` where needed, and defer `future` unless explicitly requested.
6. **Integration/verification:** use existing item icon/asset loading patterns rather than introducing a parallel item catalogue. Review actual inventory/shop/catalogue screens, missing-file fallback, asset sizes and licensing/provenance; verify no runtime/render budget regression.

## Decisions deliberately open

- Exact visual calibration of the approved art direction against the existing UI.
- Camera angle, framing, dimensions, thumbnail size, and lighting. The illustration style and parchment-patch alpha direction are already approved.
- Visual signals for `common` / `masterwork` / `legendary` versus UI tier borders/badges; avoid quality-based asset explosion.
- Whether all 169 definitions merit individual images or whether suitable visually identical goods share a source image.
- Exact OpenRouter model, request route, costs and validation implementation. Do not begin mass generation or runtime changes before pilot approval.

## Boundaries and handoff

This plan captures the binding author-approved style and background, but does not approve mass production. An orchestrator session owns the manifest, decisions and handoffs; child sessions return concise findings and proposed updates. Consult `AGENTS.md`, `docs/INDEX.md`, `docs/state/PROGRESS.md` and this plan before work. Existing `src/game/ui/items/itemIcons.ts`, `itemTypeIcon.ts` and `src/game/ui/items/icons/` are current icon paths; do not replace them by assumption. No images are generated in the style exploration stage.
