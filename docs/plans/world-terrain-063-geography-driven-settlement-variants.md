# Plan: Geography-driven settlement pattern — variant comparison and author selection

**Created:** 2026-11-04
**Status:** `planned` 📋 (V0 tooling may start after tools-026; V1+ after world-terrain-061, preferably 062)
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** tools-026, world-terrain-061
**Domain:** `world-terrain`
**Subdomains:** `settlements` `worldgen`
**Tags:** `geography` `settlements` `travel` `roads` `worldgen` `epoch`
**Model:** Opus (V1 contract, V3 shortlist), Sonnet (V0, V2, V4)

## Goal

Stage S6 of the geography program (G5): a **geography-driven settlement pattern with shorter actual journeys and wilderness retained**. Compare variants around **22, 25 and 28 settlements × start spacing × geographic suitability**, present the best **2–3** with routes, statistics and previews, and implement **the variant the author selects** — no count is pre-selected. Then hand over to the deferred road close-out (Q61–Q64) and the single fixture re-export (G1).

Author field evidence (not a measured baseline): walking the **left-hand road from the home settlement** to the second settlement feels too long — the tools-026 D3 route is the concrete case every variant reports.

## Verified starting point (2026-11-04)

- `settlementLayout.ts`: seeded Poisson-disc selection over land cells; home first; `SETTLEMENT_SPACING_M 1150` relaxing by `SPACING_RELAX_STEP_M 100` down to `SETTLEMENT_MIN_DISTANCE_M = 4 × TRAVEL_HOUR_M` (720 m); `SETTLEMENT_TARGET_COUNT 22`; a cheap local suitability probe + seeded jitter; RNG graph with `SETTLEMENT_MAX_EDGE_M 2400` / band pruning at 10 h.
- **Contract:** the layout is a pure function of seed + terrain config, explicitly **without hydrology**, so every realm computes the same result (memoized by `settlementPlanCache`). Adding water access or climate to suitability changes that contract (hydrology/climate payload must be available wherever the layout runs) — V1 decides it explicitly.
- Downstream owners: `settlementPlanCache.ts`, `roadNetwork.ts`, size progression (MD → LG → XL within ~1.5 km of home, Brief), cemeteries, caves (`largeCaves.ts`; queue §3 Q100 open), transport/expedition distances.

## Design

- **V0 variant runner** (script, no runtime change): builds the layout for an override set `{ target, startSpacing, suitabilityWeight }` and runs the tools-026 D3 route census + quadrant coverage + guarantees on seeds `42`, `415424794` and 3–5 spot seeds; prints one comparison table; draws previews with routes.
- **V1 suitability term** — extend the existing candidate ranking (no parallel density map): macroclimate (temperate, moderately moist), lowland slope, near perennial water or coast, outside 060 landform footprints and passes' crest. Weight levels: none (today) / moderate / strong. The layout keeps computing in every realm: either read macroclimate + hydrology from the installed payload (then the layout waits for hydrology install — check boot order) or use a cheap analytic proxy; Opus picks one in V1 notes with evidence.
- **V2 matrix** — 22 / ~25 / ~28 × start spacing 1150 / ~1050 / ~950 (verify the relax floor stays reachable) × weight none / moderate / strong; stop early where suitable land runs out.
- **V3 shortlist** — rank by the proposal's priority order: (1) 0 roadless, 1 component, progression/home-growth guarantees; (2) shorter neighbour journeys (indicative median ~5–7 game h, p90 ≤ 9 h — use the author-confirmed S0 targets); (3) wilderness kept (indicative ≥ 20 % land beyond ~5 h); (4) no empty half (quadrant coverage); (5) NPC transport/trade distances acceptable. Present 2–3 variants in a research note with previews, numbers and the author route → queue §3 (Polish, short options).
- **V4 implement the selection** — constants/weights, cache bumps (settlement defs, road routes, caves, cemeteries, locations-coarse after Q109), downstream censuses (access, yards, cemeteries, caves, catalog lakes), one timed walk of the author route on `415424794` recorded separately from geometry.

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| V0 | Variant runner + comparison table (on current terrain for tooling only) | S | tools-026 D3 |
| V1 | Suitability term + realm/boot contract decision | O | 061 H6 |
| V2 | Matrix run on final geography | S | V1; 062 B1 preferred (previews show final biomes) |
| V3 | Shortlist note + §3 question | O | V2 |
| V4 | Implement the author's variant, bumps, censuses, walk | S | author answer |

## Done when

- Author selected a variant; implemented constants reproduce its census numbers on both seeds.
- 0 roadless settlements and 1 component (or the author accepted an explained exception), progression/home-growth guarantees hold, access 0 unreachable.
- Author route reported before/after (hours, ratio, detour causes).
- Caches bumped; notes + `docs/state/` settlement/world docs updated; queue Q61 un-deferred.

## Stop if

- Every variant fails a priority-1 guarantee (→ author with data).
- Suitability makes the layout depend on streaming order or the player.
- Variant selection needs reduced simulation (fewer NPCs/households per settlement) — not approved.

## Hand-over (geography close-out, queue order)

Q61 → Q62 → Q63 → Q64 (+ Q110 residual bridges, Q84-a re-check) on the final geography; Q64 performs the single fixture re-export and close-out census; then a WSL A/B (boot, `stream`, `settlement-heavy`), Windows confirmation via queue §4, and an **epoch-batch close proposal** to the author (G1).
