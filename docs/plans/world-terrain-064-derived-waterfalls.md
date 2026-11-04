# Plan: Derived waterfalls on perennial rivers

**Created:** 2026-11-04
**Status:** `draft` 📝 (finalized after the tools-026 D5 V2-waterfall verdict and world-terrain-061 H5 candidate data)
**Type:** feature
**Priority:** medium · **Effort:** M
**Depends on:** tools-026, world-terrain-061
**Domain:** `world-terrain`
**Subdomains:** `water` `rendering`
**Tags:** `geography` `landmarks` `waterfalls` `rivers`
**Model:** Opus (W0), Sonnet (W1–W3)

## Goal

Part of the G6 first landmark package: **waterfalls derived from hydrology** at genuine steep reaches of perennial rivers (scarps, crags, spine flanks from world-terrain-060) — never a post-hoc carved drop. Inspect the **SeedVales V2 waterfall** as a selective donor first (G6).

## Verified starting point (2026-11-04)

- River presentation: `src/world/createRiverWater.ts` (ribbon per chain), bed carving and mouth ramps from the global hydrology payload (058). No waterfall object exists in V1.
- 061 H5 records steep perennial reaches as data (position, drop, width class, chain id) — the only input of this plan.
- V2 waterfall: implementation and cost not yet inspected (tools-026 D5).

## Slices (provisional)

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| W0 | Decide presentation from the D5 verdict: ribbon steepening + falling sheet + foam/spray + sound loop; per-site render budget (draws, triangles, particles) and streaming lifecycle (chunk-owned, no always-resident meshes); catalog kind (`waterfall` or `lake`/`river` subtype) agreed with world-041 L0 | O | D5; 061 H5 |
| W1 | Detection rule finalized (minimum drop, perennial class, not inside settlements/roads), census per seed; stable id from chain + reach | S | W0 |
| W2 | Presentation + sound; stand-alone budget check; browser check on `415424794` | S | W1 |
| W3 | Catalog entry hand-off to world-041 L1 | S | W2 |

## Done when (provisional)

Census: waterfalls only on perennial chains at real drops (count per seed reported, no quota); presentation within its per-site budget; no swimming/pathing regression at falls; browser screenshots → §2 for the author.

## Stop if

The relief yields no genuine drops on a seed (report it — no carving to force one); presentation needs new per-frame work beyond the budget; V2 donor requires a parallel water system.
