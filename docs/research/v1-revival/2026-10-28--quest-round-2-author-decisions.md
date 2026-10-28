# Quest Revival — Author Decisions and Group Session Index (Round 2)

**Created:** 2026-10-28  
**Status:** **Author direction recorded; group-level detailed design pending.** No content integration or implementation plan is approved.  
**Repository:** `jm-sky/seedvale-v1` `main`  
**Sources:** [original complete 61-row prioritization](./2026-10-28--quest-portfolio-prioritization.md), [61-record source evidence](./2026-10-27--quest-revival-matrix.md), [runtime evidence](./2026-10-27--quest-revival-runtime-evidence.md), [Strategic Brief](./STRATEGIC-BRIEF.md).

## Decision precedence and boundaries

- These decisions **supersede conflicting provisional recommendations** in the 2026-10-28 portfolio. They do not rewrite or erase historical V3 curation, previous research findings or confirmed V1 behavior.
- **Round 1:** The author provided a direction for 60 of 61 catalogue records. R48 (rare hare Q01) remains **open**. A direction of `Rewrite / Polish`, `Keep / Merge` or `Add / Defer` expresses intent, not a finalized technical scope.
- **Round 2, Group 1:** The author selected linked family dialogue, meaningful shell variation, a real water handover, and merged treatment of Anna's sick child. Then clarified that **NOT all Anna/Piotr quests must remain independent**: some belong to a series, and **one wood quest may be removed**. This latest clarification replaces the earlier tentative “all independent quests” assumption. The exact wood source ID and final structure remain open.
- **R21 now has a different story.** Busy Piotr asks the player to pick flowers and deliver them to his wife Anna. Anna responds by asking the player to take **honey** to Piotr. Guarantee a **nearby hive with bees**. The old fishing-message courier premise is **superseded**, not a rejected mechanic for all quests. Exact flowers, honey ownership/source and transfer remain to be designed.
- **Weather policy correction:** There is **no author-imposed prohibition** on story-triggered/scheduled weather. It may be changed where worthwhile. Any proposed mechanism must still keep authoritative simulation and saves coherent; R50 is currently **deferred**, so no storm is approved now.
- **V1 preservation-first:** All 39 original V1 records have source-level counterparts, but not guaranteed appearance or verified playability. The 22 original V2 stories are absent as authored quests in V1. Preserving generic world-driven animal incidents, physical items, settlement work, quest IDs and consequences remains essential wherever the author is not explicitly changing them.
- **D4 Performance-First integration freeze** remains active. This record and the seven checklists are discussion artifacts only; no gameplay code, quest definitions, V3 donor sources, roadmap phases or implementation tickets are changed.

## Seven group session dossiers

1. [Anna, Piotr and everyday settlement life](./quest-decision-round-2/01-anna-piotr-settlement-life.md) — 12 records: R01, R02, R03, R09, R21, R23, R26, R33, R38, R43, R50, R54.
2. [NPC relationships and social conflicts](./quest-decision-round-2/02-npc-relationships-social-conflicts.md) — 6 records: R34, R41, R42, R47, R51, R61.
3. [Hunters, fauna, wolves and livestock](./quest-decision-round-2/03-hunters-fauna-wolves.md) — 14 records: R05, R06, R07, R08, R10, R20, R30, R31, R32, R36, R40, R46, R48, R49.
4. [Exploration, scouting and settlement cemetery](./quest-decision-round-2/04-exploration-scouting-cemeteries.md) — 6 records: R22, R25, R27, R28, R37, R39.
5. [Treasures, caves and lost artifacts](./quest-decision-round-2/05-treasures-caves-artifacts.md) — 10 records: R04, R11, R17, R18, R19, R24, R52, R58, R59, R60.
6. [Trade, transport and economy](./quest-decision-round-2/06-trade-transport-economy.md) — 8 records: R29, R35, R44, R45, R53, R55, R56, R57.
7. [Chronicles and long-form progression](./quest-decision-round-2/07-chronicles-progression.md) — 5 records: R12, R13, R14, R15, R16.

These are **separate discussion sessions**, not implementation batches, milestones, or coding-agent instructions. Each file has the inherited author direction, current/donor story, maturity label, open decisions and focused checkboxes.

## High-impact cross-group coordination

- **Anna/Piotr / R21 / child illness:** session 1 owns the family series structure, one possible wood-quest consolidation, flower → honey exchange, local hive placement and R38 + G04 cast changes. Do not commit to independent source-ID lifecycles until decided.
- **Greybeard/wolves:** session 3 owns R06/R30/R31/R32/G07's shared wolf identity, real settlement approaches (including `frenzyWolf` comparison), den states, merchant horse and reward arbitration.
- **Sheep theft:** session 3 owns merging the authored Anna stray story R36 with V2 G01's theft narrative, while generic fauna-origin lost-livestock opportunities survive.
- **Cemetery:** sessions 2/4 own settlement R37 + Q14 rewrite and merge. Session 7 owns R12's actual grave-access authority. Their physical site equivalence is **not yet proven**.
- **Exceptional swords:** R59's captain-owned sword must stay distinct from the former-adventurer elder's personal sword; R06/R30 existing sword rewards also need later coherence if rewritten.
- **Large worlds/settlements:** R59 is desired near an LG/XL settlement; site generation and availability must be verified.
- **High-value deferred queue:** R35 shipwreck rescue and R60 Ash House vault sit **near the front of deferred consideration**, not approved for execution. R45 is low priority. R55 needs an honest feasibility check rather than assuming either XS or XL.
- **R22 existence:** `samotna-wieza` is in current `src/quests/quests.ts`; the physical landmark is resolved conditionally. The expanded V3 stolen-valuables investigation is **not** currently the V1 authored quest.

## Targeted R21 implementation evidence (not an implementation decision)

- Existing `src/world/createBeehives.ts` builds **1–2 deterministic wild hives near settlement trees** when trees are available; it does **not** guarantee a hive close to Anna/Piotr's home.
- `src/world/beehives.ts` owns saved harvest/burn status and time-based production; `src/app/actions/gatheringActions.ts` permits harvesting actual `honey` with possible sting. The current presentation creates hive meshes and explicitly notes **no bee agents or per-frame bee simulation**.
- Therefore the author-required **nearby hive with bees** needs a focused choice about deterministic local anchoring and bee presentation. Check accessibility, available honey, a previously burned/emptied hive, streaming/save identity, and flowers as real gatherable items before committing to a specific quest mechanism. Avoid false claims that the new R21 story is already implemented.

## Completeness and evidence limits

- **61/61 unique source records**, partitioned once across seven group files: **39 V1 + 22 V2**, including R48 awaiting a decision. Historical V3 `3 keep / 48 rewrite / 4 merge / 5 retire / 1 defer` remains unchanged.
- Decisions are **author directions**. Per-story detailed design, implementation cost, actual completed playthroughs, per-seed offer rates, saves, graphics and performance are not verified by this docs-only publication.
