# Plan: Geography-driven settlement pattern — variant comparison and author selection

**Created:** 2026-11-04
**Status:** `in progress` 🔄 — V0 done (Q126); Q127 recon + router fix + V1 contract done 2026-11-07 ([notes](./implementation-notes/world-terrain-063-geography-driven-settlement-variants-implementation-notes.md)); next Q186 V1 impl → Q187 V2 → V3 (amended per [review 031](../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md) 2026-11-04)
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** tools-026, world-terrain-061
**Domain:** `world-terrain`
**Subdomains:** `settlements` `worldgen`
**Tags:** `geography` `settlements` `travel` `roads` `worldgen` `epoch`
**Model:** Opus (V1 contract, V3 shortlist), Sonnet (V0, V2, V4)

## Goal

Stage S6 of the geography program (G5): a **geography-driven settlement pattern with shorter actual journeys and wilderness retained** (refined by author Q116-c/d below: journeys verified before optimized; wilderness by land cover and threats, not distance). Compare variants around **22, 25 and 28 settlements × start spacing × geographic suitability**, present the best **2–3** with routes, statistics and previews, and implement **the variant the author selects** — no count is pre-selected. Then hand over to the deferred road close-out (Q61–Q64) and the single fixture re-export (G1).

Author field evidence (not a measured baseline): walking the **left-hand road from the home settlement** to the second settlement feels too long. ✅ **Author Q116-c/d (2026-11-04), [reconciliation §3–§4](../research/v1-revival/2026-11-04--q116-author-direction-reconciliation.md#3-q116-c--the-left-road-from-home-verify-before-tuning):** ~4 real minutes of walking is acceptable; the criticized road was **winding with several bridges** and may not be the D3 census route (`-4_-2`, 1429 m, near-straight). **Answered the same day:** the road is home → **Lipowy Parów** (`4_-1`, leaves east first; 1320 m, ratio 1.11) and the author wants it **25–40 % shorter**. Journeys are therefore a real target again (author route −25…−40 %; neighbour median by the same band 🟡), reached by settlement spacing/clustering, not by travel speed or time scale ([reconciliation §6](../research/v1-revival/2026-11-04--q116-author-direction-reconciliation.md#6-author-answers-2026-11-04-after-this-note)). Wilderness is **not** "land > 5 h from a settlement": that share stays a neutral diagnostic; wilderness is judged by land cover/use, habitats and threats, with a deterministic, limited relative-safety belt per settlement (size + character + surroundings; closed settlements near predators may have narrower belts; no safe zones). Geography-led siting and clusters stay sensible, but no forced empty regions for a percentage.

## Verified starting point (2026-11-04)

- `settlementLayout.ts`: seeded Poisson-disc selection over land cells; home first; `SETTLEMENT_SPACING_M 1150` relaxing by `SPACING_RELAX_STEP_M 100` down to `SETTLEMENT_MIN_DISTANCE_M = 4 × TRAVEL_HOUR_M` (720 m); `SETTLEMENT_TARGET_COUNT 22`; a cheap local suitability probe + seeded jitter; RNG graph with `SETTLEMENT_MAX_EDGE_M 2400` / band pruning at 10 h.
- **Contract (corrected, review 031 F4):** `settlementLayout.ts` takes no river query — there is **no explicit river suitability** in selection — but it is **not hydrology-independent**: its `sampleHeight` is `sampleLandHeightAt` (`worldKnowledgeScan.worldKnowledgeRoadContext`), which already reads the global hydrology correction and lake levels through `chunkHeightmap.ts`. Every realm must therefore already have identical installed geography before layout use. Adding water access or climate to suitability extends that dependency — V1 decides it explicitly.
- **Caches (review 031 F4):** `settlementPlanCache.ts` holds a single memoized layout, cell-keyed defs, progression and quest-host caches; hydrated/computed first values win; river-query registration is world-scoped. `roadNetwork.ts` caches routes. A runner that changes only constants/weights inside one realm can silently reuse the previous variant.
- Downstream owners: `settlementPlanCache.ts`, `roadNetwork.ts`, size progression (graph-hop policy, `SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M = 4000` in `settlementProgression.ts` — supersedes the older Brief's "XL within ~1.5 km", review 031 F10), cemeteries, caves (`largeCaves.ts`; queue §3 Q100 open), transport/expedition distances (`transportOffscreen.ts` keeps straight-line estimates for legacy handoffs — not a general travel model).

## Design

- **V0 variant runner** (script, no runtime change): builds the layout for an override set `{ target, startSpacing, suitabilityWeight }` and runs the tools-026 D3 route census + quadrant coverage + guarantees on seeds `42`, `415424794` and 3–5 spot seeds; prints one comparison table; draws previews with routes. **Isolation (review 031 F4):** each variant runs in a fresh process/context, or every affected cache (layout memo, defs, progression, quest hosts, road routes) is reset and the override identity is part of the cache keys; an **A → B → A** run must reproduce A exactly. Cheap rejection (spacing/coverage/guarantees) runs before expensive full routing; shortlisted candidates are then measured fully.
- **V1 suitability term** — extend the existing candidate ranking (no parallel density map): macroclimate (temperate, moderately moist), lowland slope, near perennial water or coast, outside 060 landform footprints and the 061 H5 **reserved waterfall-candidate footprints** (world-terrain-064 ownership direction), but **not** excluding 060 pass corridors (they must stay routable). Weight levels: none (today) / moderate / strong. The layout keeps computing in every realm: either read macroclimate + hydrology from the installed payload (inventory main / worker / tool construction paths and require identical installed geography before layout use — never a silent analytic fallback in only some realms) or use a cheap analytic proxy, labelled as a **ranking heuristic** with real water access validated separately on the final sites; Opus picks one in V1 notes with evidence (review 031 alternatives: prefer the installed payload where the existing hydrology install already provides it; no second layout service).
- **V2 matrix** — 22 / ~25 / ~28 × start spacing 1150 / ~1050 / ~950 (verify the relax floor stays reachable) × weight none / moderate / strong; stop early where suitable land runs out. **Extended for Q116-c (2026-11-04):** −25…−40 % journeys need ≈ 1.8–2.8× the count at uniform spacing, so add (i) closer uniform spacing ~850 / ~750 m with counts as the land allows (re-examine `SETTLEMENT_MIN_DISTANCE_M` 720 m) and (ii) **clustered** variants — geography-led bands (valleys/coast/passes) with short intra-band edges at roughly today's count; workload per variant is mandatory (no simulation reduction).
- **Router pin (review 031 F2):** V2–V3 evaluate every variant with **one pinned router revision** (recorded in the note). Q61–Q63 run after V4; if they change reachability or journey rankings, the shortlist is re-run before G5 acceptance is treated as final; Q64 export stays after selection.
- **Connectivity (review 031 F4):** components are computed over **successful, traversable route edges**; selected / defined / road-connected counts are reported separately; final site probes and promoted sizes (not nominal cell centres) satisfy footprints and spacing.
- **Travel (review 031 F9):** D3 distance ÷ speed is a labelled estimate; shortlisted routes add sampled grade/detour checks, and the author route gets a timed walk.
- **Workload (review 031 F7):** 28 vs 22 sites is ~27 % more settlements before size/household distribution — for each shortlisted variant record households, NPCs, active transport and the representative offscreen/time-skip workload against the tools-026 D7 baseline; no simulation reduction (stop-if below).
- **V3 shortlist** — rank by the proposal's priority order: (1) 0 roadless, 1 component of routed roads, progression/home-growth and authored quest-host guarantees; (2) shorter journeys: author route home → Lipowy Parów −25…−40 % and the neighbour median in the same band 🟡; (3) wilderness **reported** as land-cover/land-use shares (forest, wetland, rock/alpine outside belts and road corridors) plus the per-variant belt widths from the [reconciliation §4.3](../research/v1-revival/2026-11-04--q116-author-direction-reconciliation.md#43-smallest-compatible-direction--proposal-needs-the-author) direction once the author answers queue §3 Q134 — **no ≥ 20 % distance gate**; (4) no empty half (quadrant coverage); (5) NPC transport/trade distances acceptable. Present 2–3 variants in a research note with previews, numbers and the author route → queue §3 (Polish, short options).
- **V4 implement the selection** — constants/weights, cache bumps (settlement defs, road routes, caves, cemeteries, locations-coarse next free version after 4), downstream censuses (access, yards, cemeteries, caves, catalog lakes), one timed walk of the author route on `415424794` recorded separately from geometry.

## Slices

| Slice | Content | Model | Gate |
| --- | --- | --- | --- |
| V0 | Variant runner + comparison table (on current terrain for tooling only) | S | tools-026 D3 |
| V1 | Suitability term + realm/boot/cache contract decision (notes) | O | 061 H6 (frozen geography + reserved waterfall candidates) |
| V2 | Matrix run on final geography | S | V1; 062 B1 preferred (previews show final biomes) |
| V3 | Shortlist note + §3 question | O | V2 |
| V4 | Implement the author's variant, bumps, censuses, walk | S | author answer |

## Done when

- Author selected a variant; implemented constants reproduce its census numbers on both seeds.
- 0 roadless settlements and 1 component of **successfully routed** roads (failed crossings cannot pass; or the author accepted an explained exception), progression/home-growth guarantees and authored quest hosts hold, access 0 unreachable.
- Tests at the existing owners: A → B → A variant identity; main / worker / cold / hydrated settlement defs match.
- Author route (the road confirmed in queue Q132) reported before/after (hours, ratio, detour causes, timed walk).
- Caches bumped; notes + `docs/state/` settlement/world docs updated; queue Q61 un-deferred.

## Stop if

- Every variant fails a priority-1 guarantee (→ author with data).
- Suitability makes the layout depend on streaming order or the player.
- Variant selection needs reduced simulation (fewer NPCs/households per settlement) — not approved.

## Hand-over (geography close-out, queue order)

Q61 → Q62 → Q63 → Q64 (+ Q110 residual bridges, Q84-a re-check) on the final geography; Q64 performs the single fixture re-export and close-out census; then a WSL A/B (boot, `stream`, `settlement-heavy`), Windows confirmation via queue §4, and an **epoch-batch close proposal** to the author (G1).
