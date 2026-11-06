# Plan: Derived waterfalls on perennial rivers

**Created:** 2026-11-04
**Status:** `planned` 📋 — **W0 decided (Opus, 2026-11-06)** in the [implementation notes](./implementation-notes/world-terrain-064-derived-waterfalls-implementation-notes.md): the relief gives **cascades** (steepest chain segment 34°, ground ≤ 44°), not plunge falls → cascade presentation **approved by the author (Q125-a (a), 2026-11-06; author supplies the sound loop)**; W1 Sonnet (queue Q168) ready, W2 (Q169) after W1, W3 inside world-041 L1 (Q130). Amended per [review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md) 2026-11-04
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
- 061 H5 records steep perennial reaches as data (top/bottom position, drop on the shipped water/bed profile, width class, source-chain id + offset) — the only input of this plan.
- 058 notes already distinguish smoothed chain elevations from corrected ground; a "real drop" is evaluated on the profile actually shipped, not on raw relief (review 031 F9).
- V2 waterfall: **does not exist** at `seedvales-v2@9ba54815` (tools-026 D5, [donor recon §1](../research/v1-revival/2026-11-04--geography-donor-recon.md#1-waterfall-g6)). The only donor is V1's own `waterfallFactor` (`riverGeometry.ts`, whitewater per ribbon vertex, zero extra draws; dormant on current relief); lip sheet, pool mist, sound and catalog kind are new V1 work.

## Ownership direction (review 031 F2)

🟡 Chosen: **geography reserves, settlements and roads avoid.** 061 H5 candidates become reserved candidate footprints (fall reach + a small clearance) **before** settlement selection; world-terrain-063 V1 ranks sites outside them, and the road crossing owner (`roadRiverCrossing.ts`) treats a reserved reach as non-crossable in the Q61–Q64 retry. W1 eligibility therefore never depends on later settlement/road output, keeping the pipeline acyclic (relief → hydrology → landmarks → settlements → roads). Alternative not chosen: finalize eligibility after 063 V4 / Q64 against accepted footprints — it would make the waterfall set depend on settlement variants.

## Physical contract (review 031 F9)

- Identity from **source-chain id + reach offset** (061 H2 contract), independent of clipped-tile ordinal; top and bottom reach defined.
- Water-query behaviour across the fall (swim depth, wet floor, drinking) stays owned by the hydrology/water queries; the falling sheet, foam and spray are **presentation** and never a second authority for swim depth or navigation.
- Any bed correction/carving at the fall stays in the terrain/hydrology owner; presentation is chunk-owned (owner chunk = chunk containing the top reach; built/destroyed with it, no always-resident meshes).

## Slices (provisional)

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| W0 ✅ | Decide presentation from the D5 verdict: ribbon steepening + falling sheet + foam/spray + sound loop; per-site render budget (draws, triangles, particles) and streaming lifecycle (chunk-owned, no always-resident meshes); catalog kind (`waterfall` or `lake`/`river` subtype) agreed with world-041 L0 | O | D5; 061 H5 |
| W1 | Detection rule finalized (minimum drop on the shipped profile, perennial class), reserved footprints handed to 063 V1 / road crossing owner, census per seed; stable id from source chain + reach offset | S | W0; 061 H6 |
| W2 | Presentation + sound; stand-alone budget check; browser check on `415424794` | S | W1 |
| W3 | Catalog entry hand-off to world-041 L1 | S | W2 |

## Done when (provisional)

Census: waterfalls only on perennial chains at real drops on the shipped profile (count per seed reported, no quota); presentation within its per-site budget; representative player/NPC/fauna traversals near falls without swimming/pathing regression; wet/dry/navigation agreement at unloaded chunk boundaries; no settlement or road crossing inside a reserved reach; browser screenshots → §2 for the author.

## Stop if

The relief yields no genuine drops on a seed (report it — no carving to force one); presentation needs new per-frame work beyond the budget; V2 donor requires a parallel water system.
