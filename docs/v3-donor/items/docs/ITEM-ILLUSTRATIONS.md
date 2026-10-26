# Item illustrations

**Created at:** 2026-10-22  
**Created by:** Cursor Composer  
**Status:** local pipeline ready; mass generation not authorised

Catalogue inventory / shop illustrations (2D PNG). Runtime SVG icons in `src/game/ui/items/icons/` stay untouched until a separate UI integration pass.

## Paths

| Path | Role |
|---|---|
| `assets-src/items/style-reference-image.png` | Author-approved style reference (send real PNG bytes) |
| `assets-src/items/sheets/` | Original 3×2 generation sheets + sidecar JSON (committed). Staging `cells/` / `cells-opaque/` and `*.derived-alpha.png` are gitignored — regenerable locally. |
| `assets-src/items/manifest.json` | Per-item status and provenance |
| `assets-src/items/pilot-batch-01.png` | Prior pilot sheet (six crops already under `public/`) |
| `public/assets/items/<item-id>.png` | Individual 512×512 crops (catalogue `id`) |

## Statuses

| Status | Meaning |
|---|---|
| `missing` | No illustration yet (default when absent from the manifest) |
| `generated` | PNG written; **not** taste-approved |
| `approved` | Author approved; pipeline refuses overwrite |
| `rejected` | Failed review; may regenerate with `--overwrite-generated` |

API success never implies `approved`.

## Geometry

- Sheet: **1536×1024**, grid **3×2**, cell **512×512**, row-major ID order.
- Alpha: genuine PNG transparency between items; irregular semi-transparent parchment per item.

## Cell post-process (after split)

Naive grid crops often leave the parchment+item off-centre or with neighbour bleed on the cell edge. After each 512×512 crop the pipeline (on by default):

1. **Bleed cleanup** — drop small border-touching connected components.
2. **Recenter** — place the opaque bbox in the centre of a transparent 512×512 canvas (default margin 24px; slight uniform shrink if needed). Never fills with black.
3. **Parchment soften** — lower alpha on warm parchment fill toward `--target-alpha` (default 180), keeping dark linework and outer `A=0`.

`validate --cell` also checks: no edge contact, content-centre offset within ±24px, transparent fraction ≥ 0.20.

Flags: `--no-postprocess`, `--no-soften-parchment`, `--margin`, `--target-alpha`.

## CLI

Requires [`uv`](https://docs.astral.sh/uv/) and `OPENROUTER_API_KEY` in the environment or repo-root `.env` (git-ignored). Never print the key.

```bash
uv run scripts/items/illustrations/cli.py list-missing
uv run scripts/items/illustrations/cli.py dry-run
uv run scripts/items/illustrations/cli.py dry-run --ids long_sword,wooden_shield,hammer,bread,ashgrove_dagger,stoneford_mail
uv run scripts/items/illustrations/cli.py generate --ids long_sword,wooden_shield,hammer,bread,ashgrove_dagger,stoneford_mail --confirm-paid
uv run scripts/items/illustrations/cli.py split assets-src/items/sheets/<sheet>.png --ids id1,id2,id3,id4,id5,id6
uv run scripts/items/illustrations/cli.py derive-alpha assets-src/items/sheets/<sheet>.png
uv run scripts/items/illustrations/cli.py split assets-src/items/sheets/<sheet>.png --ids id1,... --derive-alpha --update-manifest --overwrite-generated
uv run scripts/items/illustrations/cli.py reprocess-generated
uv run scripts/items/illustrations/cli.py soften-parchment --ids long_sword,stoneford_mail,sword --preview
uv run scripts/items/illustrations/cli.py validate public/assets/items/<id>.png --cell
uv run scripts/items/illustrations/cli.py review-notes --ids long_sword,sword
uv run --with pytest --with httpx --with pillow pytest scripts/items/illustrations/tests -q
```

`generate` without `--confirm-paid` exits without calling OpenRouter.

`reprocess-generated` re-splits every manifest `generated` item from its local source sheet (`--derive-alpha` + cell post-process). No OpenRouter calls.

`soften-parchment --preview` writes before/after composites under `_temp/items/parchment-alpha/` (git-ignored). `--write` overwrites PNGs (refuses `approved` without the usual overwrite rules).

`review-notes` runs cell validation and prints human visual-review criteria (proportions, family, style, tier craftsmanship, alpha) plus sibling PNG paths for side-by-side inspection. It never calls OpenRouter and never starts a paid regenerate.

Current prompt revision: `style-2026-10-22-v4` (weapon blade-to-hilt cues, tier craftsmanship, relative sword comparisons, full-length arrow vs bolt cues).

`openai/gpt-image-2` often returns **opaque RGB** (no alpha). Validation fails on purpose. Use `--derive-alpha` (edge flood-fill of pale gaps) for an explicit post-process, or inspect `sheets/<stem>/cells-opaque/` review crops (local only). Derived `*.derived-alpha.png` is regenerable and gitignored; provenance stays on the original sheet + JSON. Derived alpha is labeled in the manifest notes — it is not model-native transparency.

## Model and cost

- Default model: `openai/gpt-image-2` via `POST https://openrouter.ai/api/v1/images`
- Defaults: `aspect_ratio=3:2`, `quality=high`, `background=auto` (OpenAI rejects `transparent`; alpha is requested in the prompt and validated on the PNG), style PNG as `input_references`, `provider.data_collection=deny` + `zdr=true`
- Expected cost band: about **USD 0.05–0.25 per sheet** at high quality with one reference; confirm with response `usage.cost`. Quality setting dominates the bill.

## Plans and style

- [items--007 pipeline](../plans/items--007--item-illustration-pipeline.md)
- [style reference](../plans/items--007--item-illustration-style-reference.md)
- [OpenRouter research](../research/2026-10-22--item-images-openrouter-pipeline.md)

## Next paid command

After author approval of budget and dry-run content:

```bash
uv run scripts/items/illustrations/cli.py generate \
  --ids long_sword,wooden_shield,hammer,bread,ashgrove_dagger,stoneford_mail \
  --confirm-paid
```
