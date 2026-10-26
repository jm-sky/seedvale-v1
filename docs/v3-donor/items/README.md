# Item Illustration Sources

**Created at:** 2026-10-22  
**Created by:** ChatGPT Luna

This directory contains source and reference images for SeedVale item illustrations.

## Canonical paths

- `style-reference-image.png`: approved reference; send actual PNG bytes to the image model.
- `sheets/`: original six-item 3 × 2 sheets and JSON sidecars (committed). `cells/`, `cells-opaque/`, and `*.derived-alpha.png` are local-only (see `.gitignore`).
- `manifest.json`: per-item status (`generated` / `approved` / …) and provenance.
- `../../public/assets/items/<item-id>.png`: cropped illustrations using exact catalogue IDs (status `generated` until author approval).
- Pipeline CLI: `uv run scripts/items/illustrations/cli.py` — see [ITEM-ILLUSTRATIONS.md](../../docs/assets/ITEM-ILLUSTRATIONS.md).

## Purpose

- Store approved visual style references.
- Store original AI-generated image sheets (6 items per sheet).
- Preserve source images before cropping or optimization.
- Provide consistent references for future generation sessions.

## Art Style

Renaissance artisan notebook illustrations inspired by Leonardo da Vinci: monochrome graphite, sepia ink, fine cross-hatching and strong contours.

Each item has a soft, irregular, semi-transparent parchment background fading into transparency.

## Rules

- Preserve original PNG files and verify genuine alpha: transparent gaps and semi-transparent parchment patches.
- Never overwrite approved reference images.
- Use descriptive, consistent filenames.
- Final individual illustrations belong in `public/assets/items/`.

## Related Documentation

- `docs/assets/ITEM-ILLUSTRATIONS.md`
- `docs/plans/items--007--item-illustration-pipeline.md`
- `docs/plans/items--007--item-illustration-style-reference.md`
