# Geography & Exploration — Author Decisions G1–G9

**Date:** 2026-11-04  
**Status:** Approved strategic directions; staged plans written 2026-11-04 ([roadmap — geography program](./2026-10-27--master-revival-roadmap.md#geography-program--staged-plans-opus-2026-11-04), queue Q111–Q130); technical calibration and donor inspection pending (tools-026)  
**Authority:** Author answers to the [Opus architecture proposal §8](./2026-11-04--geography-exploration-architecture-proposal.md#8-strategic-decisions-requiring-author-approval). This document supersedes its unapproved G1–G9 option text where the author clarified or deviated.  
**Implementation:** No runtime implementation or detailed plan is approved by this documentation update. Follow [Strategic Brief](./STRATEGIC-BRIEF.md), [Master Roadmap](./2026-10-27--master-revival-roadmap.md) and [session queue](./AUTONOMOUS-SESSION-QUEUE.md).

## Approved directions

| ID | Decision |
| --- | --- |
| **G1 — Epoch** | Include the geography rebuild in the still-open `WORLDGEN_EPOCH = 1`; close road tuning (Q64) and re-export fixtures **after** geography, hydrology and settlement recalibration. Coordinate save compatibility and cache versioning. |
| **G2 — Regional geography** | Distinct cold/boreal north, temperate centre, warmer/drier south; sand is **not** restricted to beaches: inland arid/desert areas are possible. Do not interpret this as authorization for an enormous desert or a fixed desert quota; design/calibrate coherent regional transitions and review previews. |
| **G3 — Climate reach** | Shared geography, biomes, runoff/rivers, local temperature and local rain-versus-snow precipitation phase in the first implementation. Broader weather-frequency and living-world effects are not approved for this first scope. |
| **G4 — Watercourses** | Fewer perennial rivers/streams plus dry drainage valleys without surface water; **no seasonal stream mechanic**. Recalibrate on final macro relief and climate. |
| **G5 — Settlements** | Geography-driven settlement pattern and **shorter actual journeys**, with wilderness retained. Compare variants around 22, 25 and 28 settlements × spacing × geographic suitability. Present the best 2–3 with routes, statistics and previews **for author selection**; no count selected yet. |
| **G6 — Landmarks** | First package: natural crags/hills, spine summits, lakes with islands, craters/crater lakes and derived waterfalls; volcanic regions and castle/large ruins later. Keep the wider catalog in the vision, roughly 3–5 major attractions/world as a calibration target without per-kind guarantees. Inspect the **SeedVales V2 waterfall** as a potential selective donor before designing it. |
| **G7 — Discovery** | Vague NPC legends/rumours reveal a **coarse search area** on the map containing the landmark somewhere inside; no precise pin, names learned on discovery, approximately 3–4 concurrent open leads. Inspect the **SeedVales V2 rumour → approximate-area** mechanism for selective adaptation; reuse V1 discovery/knowledge and quest ownership, not a parallel system. |
| **G8 — Mountains** | Connected mountain ranges/ridges/massifs and traversable passes. Preserve current overall relief heights provisionally, **unless S0 measures peaks too low**; allow locally steep, dramatic summits. Inspect **V3 steep summits and carved road passes** for a possible V1/V3 hybrid; decide the shape/height profile after measured profiles and previews, not by blanket V3 transfer. |
| **G9 — Structure placement** | **Always separate large structures from large settlements**; do not use the proposal's conditional co-location-with-combined-budget option. Still measure standalone and adjacent scene performance where relevant; no permission to co-locate follows from good benchmark numbers. |

## Author field observations and design constraints

- **G5 travel:** On the current map, walking the **left-hand road from the home settlement** to the second settlement feels too long. Use that route as a concrete author-reported experience to reproduce; distinguish road detours from Euclidean distance and compare real game travel durations in variant previews. This is evidence of user experience, **not a measured baseline**.
- **G2 ambiguity resolved:** The initial phrase “sand only at coasts” must not rule out inland deserts. The dominant climate gradient and any desert extent still require visual calibration; avoid claiming an agreed size, number or location of deserts.
- **G6 donor:** V2 had a waterfall; verify actual V2 implementation/asset and suitability, including interaction and performance, before choosing a transfer.
- **G7 donor:** V2's legend/rumour generated an approximate map region that contained a hidden landmark. Preserve that experience while checking V1 systems first.
- **G8 open design:** V1 mountains occasionally lack steep peaks; V3 made all summits very steep and carved road passes. A hybrid is a **candidate to discuss after recon**, not a preapproved algorithm.

## Q114 visual baseline feedback (author, 2026-11-04)

These judgements concern **current V1 diagnostic previews**, not a new worldgen implementation or final acceptance targets:

- **G4 — Streams:** author prefers the `--stream-m2=1920` preview over denser variants (fewer visible watercourses). This is a **visual preference for the S0 comparison**, **not** approval to set the production stream-initiation threshold to 1920 m²; calibrate after relief and climate changes, then compare again.
- **G8 — Mountains:** current relief/mountain appearance in Q114 previews looks OK to the author. This does not cancel the approved connected-ranges/pass requirements or the pending V3 recon and measured height/shape decision.
- **G5 — Roads:** road appearance on the preview looks OK; **travel distance is not acceptable**. The west/left road from home to the next settlement on seed `415424794` is too long in actual play. Q113 measured home → `-4_-2` at 1429 m (polyline ratio 1.04, about 8.4 in-game hours as a distance/speed estimate, **not** a timed walk). Keep shorter journeys as a key criterion for Q127 variant comparisons; do not mistake visual approval for travel-distance approval.
- **Lakes:** author suspects the current lakes may be slightly too large **or** too numerous. This is an observation requiring a side-by-side size/count comparison, **not** a selected lake-count or size threshold. Preserve earlier Q96 lake reduction unless later comparison supports a change.

No generator, routing, threshold, or settlement-count implementation is authorized by this feedback alone. Present the measured comparisons and any remaining tradeoffs before final calibration/selection.

## Dependencies and next steps (planning only)

1. **S0:** Baselines, river/relief profiles and geography previews, measured route from home via the left road, travel-time census; inspect V2 waterfall and rumour/area implementation, V3 mountains/pass generation in bounded recon.
2. **Relief first:** Macro mountain ranges and landform descriptor framework → static macroclimate → climate-weighted hydrology/dry drainage → regional biomes/weather → settlement variants → road close-out and fixture export; preserve deterministic generation and simulation/presentation boundaries.
3. Present G5's 2–3 leading variants and G8 visual/mountain-height tradeoffs to the author. Keep any new technical fork or visual compromise explicit. Do not promote unmeasured thresholds or donor ideas into approved facts.
4. Convert approved strategic direction to **small plans** under normal planning rules after targeted code recon. Track planning/execution in the [session queue](./AUTONOMOUS-SESSION-QUEUE.md), not in this decision record.

**No code was changed and no runtime, visual or performance verification was performed to approve these decisions.**
