# Q36 — Settlement storehouse: author direction and design handoff

**Date:** 2026-10-31
**Status:** Author requirements captured; implementation architecture and assets undecided.
**Scope:** Revival worldgen epoch batch Q36; Q29 remains the planning reference. No implementation authorized by this note.

## Author-confirmed requirements

1. **Every settlement has a storehouse**, including the smallest settlement. This supersedes Q29's tentative MD+/SM/OUTPOST split.
2. **Interior storage is selective.** Some stock may be represented inside (e.g. food). Other resources should be represented outside.
3. **Storage is geographically distributed.** Outdoor resource piles need not be adjacent to the storehouse; wood may be stored elsewhere in the settlement.
4. **Keep the interior spacious**, including room for the rat-related scenario. Do not pack the building with static barrels/crates/sacks at the expense of usable space.
5. **Rat infestation / storehouse closure must not block logistics.** Provide an external collection/delivery fallback point that remains available while the storehouse is closed.
6. **Prevent doorway congestion.** Several NPCs concurrently delivering or waiting must not jam the entrance or block the settlement's logistics.
7. **Full interior navigation is optional.** The author delegates the decision on whether NPCs actually enter the building, deliver indoors and navigate alongside rats to Opus after examining the current systems and tradeoffs.

## Boundaries and handoff to Opus

- Preserve V1 authoritative `SettlementEconomy`, inventories, transport orders, offscreen delivery, repair/rat gameplay, identity and persistence. Avoid creating a parallel goods ledger.
- Define storehouse vs outdoor delivery anchors and their fallback behavior, including closure, reopening, queued deliveries, and any transition already in progress. Ensure goods neither duplicate nor disappear.
- Assess doorway capacity/approach-space and NPC queue/routing behavior; prefer avoiding a single indoor delivery bottleneck where possible.
- Integrate with `VillagePlan`, `landmarks.settlementStorage`, `storageDestinations`, `storageVisuals`, `storageRepair` and the settlement layout generator. Account for Q34 house/yards placement and Q37 object-placement pass.
- V3 `warehouse-8x6-a` and stockpile assets are **references/candidates only**, not a selected building or rendering architecture. Check actual V1 assets first.
- Consider collision/clearance and draw-call budgets. Do not claim visual or FPS validation from source inspection.
- Q29's suggested single door-target and uniform adjacent overflow should be reassessed against the author requirements above.
- The storehouse's exact appearance/model, size, storage categories and indoor NPC navigation remain **open technical/design decisions**, to be resolved by Opus rather than implicitly fixed here.

## References

- [Q29 batch plan](./2026-10-30--q29-revival-epoch-batch-plan.md)
- [Strategic Brief](./STRATEGIC-BRIEF.md)
- V1: `src/economy/settlementEconomy.ts`, `src/world/transportOrder.ts`, `src/world/transportOffscreen.ts`, `src/settlement/storageDestinations.ts`, `src/settlement/storageVisuals.ts`, `src/settlement/storageRepair.ts`, `src/settlement/villagePlanner.ts`
- V3: `src/game/world/structures/houseDefs.ts`, `docs/plans/implementation-notes/settlement--m4-warehouse-2026-10-25.md`
