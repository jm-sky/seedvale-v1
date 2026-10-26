# G04 Herbalist Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Luna

**Status:** Accepted narrative direction (author, 2026-10-14); design detail and implementation deferred to M5/M7.

## D-QUEST-32 — Decision

- **KEEP/REWRITE** V2 G04 `Root by the Stream` as Dora Herbert's authored story: her son Toby is ill, their household needs yarrow, mint and chamomile, and the player may help by gathering, buying or obtaining the herbs through ordinary social exchanges, or may decline.
- **RETIRE** V1 `ziola-dla-anny` (`Herbs for Anna`) as a separate authored quest. Ann Woodward is the reserved farmer, not Dora or a stand-in herbalist. Preserve only the generic *restock medicinal herbs* need as an ordinary future economy/world-driven request when shared stock and demand systems support it; it is not a second Toby incident or duplicate payout.
- **Do not implement special quest-only co-location or caregiving AI.** Toby is an ordinary persistent child NPC whose illness, rest and recovery use the shared health/needs and schedule systems. Dora continues her usual life and work, with ordinary, plausible adjustments to caring for him and reduced long excursions; neither person is pinned inside a home by a quest flag or forced into an indefinite scripted wait.
- NPC agency persists without the player: Dora may obtain supplies herself or enlist another resident through ordinary available behaviour, while Toby may recover naturally. Do not require a second simulated NPC to stand guard at the house; do not promise a new generic caregiver scheduler for this quest.
- Keep the original 48-hour medical urgency as an authored narrative opportunity for *earlier* relief, not an arbitrary failure/death clock. Assess late help against Toby's actual health and existing supplies when the necessary systems exist; no guaranteed worsening or death for nonparticipation.
- Multiple routes to the same ingredients are legitimate. Use persistent item ownership/transfers and actual stocks, not free quest-generated herbal bundles. Dora's payment, if any, comes from her real purse/stock; favour her and Toby's personal relations over inflated global reputation.
- Plant identity and potential hemlock danger must use M5's shared forage recognition/knowledge (G-37, D-ROAD-16) and physical herb nodes. **Reject** the imported proposal to substitute yarrow with hemlock randomly only while G04 is active. No quest-only gathering, illness, healing or poison system.
- A short optional follow-up interaction with Toby (including the promised story) can remain. The G07/Greybeard link through Dora's knowledge is a **soft continuity link**, not an automatic entitlement to poison or a forced G04 prerequisite. Any precise G07 poison route must be reconciled separately against its curated wolf canon and shared knowledge/social systems.

## Open M5/M7 detail, not accepted as fixed

Exact time thresholds, illness severity and treatment impact, Dora's fallback action, dialogue, ingredient quantities/availability, optional advance, reward levels and the final G07 gate. Retain original imported source/metadata as historical reference, not verified SeedVale runtime.

## Sources

- [G04 catalog](../quests/catalog/v2/g04-root-by-the-stream/README.md) and [V2 code snapshot](../comparison/code/SeedVales-v2/src/game/data/quests/g04.ts)
- [V1 Herbs for Anna](../quests/catalog/v1/v1-ziola-dla-anny/README.md)
- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md) and [Review 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md), AD-41…AD-58
- [Quest curation and Q-012](quest-curation-and-q-012.md), [D-ROAD-16](DECISIONS.md), [M5/M7 roadmap](../roadmap/ROADMAP.md)
