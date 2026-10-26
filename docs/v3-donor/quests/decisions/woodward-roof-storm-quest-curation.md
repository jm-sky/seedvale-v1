# Woodward Repairs and Q03 Storm — Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Sol

**Status:** Accepted author narrative design (D-QUEST-38). Documentation only; not implementation authorization.

## Quest chain and identity

Keep three distinct authored repair quests in the Woodward household, in narrative order:

1. V1 `drewno-na-naprawe`: the **Woodward household fence**, not Peter's logging cart or the communal pasture fence.
2. V1 `kamienie-dla-piotra`: the **Woodward house foundation**.
3. Adapt V2 `q03-a-roof-before-rain` into a later **Woodward house roof** incident, involving Ann and Peter. Keep three meaningful choices from Q03: proper beam replacement, a dry room/extension that leaves the original problem unresolved, or a temporary prop with future repair needed. These are mutually alternative plans for one damaged roof, not three separate damage events.

Use Peter/Ann identities already reserved by Q-012. The Hewer household remains a distinct family in the world; the imported Q03's Hewer ownership, Joan-specific room and Ralph common-store dialogue are **not** carried into the adapted Woodward quest verbatim. Any use of a dependent relative, extension, communal supplies or other NPC requires independent narrative and world-state justification.

Do not rename the household fence as a cart merely to make this sequence work. This decision does not supersede **D-QUEST-22**: `sporne-drewno`, Peter's separate logging cart and Ann's separate communal pasture fence retain their own targets, priorities and consequences. Do not silently combine material sinks or double-pay the same contribution.

## Storm trigger and global weather arbitration

**Author decision:** After the Woodward house **foundation is actually repaired in authoritative world state**, a damaging storm must occur **between 1 and 3 in-game calendar days later**. Finishing material delivery alone does not count as repair completion. The condition can be met by player work or autonomous NPC work. The quest may acknowledge progress but must not drive a separate weather clock.

- Schedule **one pending roof incident / storm requirement** per Woodward household and foundation-repair episode, based on an absolute game-calendar timestamp. It must be deterministic, save/load safe and idempotent (no repeated scheduling on re-evaluation, reloading, or reopening a quest).
- Use the **existing single global weather state machine** (`src/game/sim/weather/`, D-ARCH-34); quest content may register a bounded scheduling constraint but must **never spawn an independent weather instance** or pile weather overrides on top of current weather.
- In the 1–3-day interval, if the natural forecast already contains a suitably strong storm, **use that one** for the roof incident and consume the pending requirement. If there is no suitable storm, the weather authority must deterministically steer **one** phase into a suitable storm within the interval. Do not initiate a second or third storm while one is active; coalesce competing requests to the same world storm phase. The exact reservation/arbitration API and priority against other authored weather events are future weather-system design work, not established runtime behaviour.
- Enforce the 3-day upper bound in **game-calendar time**, including fast-forward, off-screen progression and resumed saves. If no safe slot exists before the bound because of another active storm, **reuse that active storm** if it meets the damaging-storm threshold; any unresolved contract conflict needs explicit weather design rather than an overlapping storm.
- The storm is a **world weather event** visible to all actors and areas affected by the global weather system, not a private particle effect for the quest. Roof damage is recorded **once** in authoritative building condition via a stable incident identifier. No duplicate damage when the storm spans several simulation steps, a save is loaded, or the player leaves and returns.
- After damage, Q03 becomes available in response to real roof state; Peter and Ann can notice, plan and repair without the player. Never pin them in place or freeze an unfinished repair for quest purposes. No quest-only `roofDamaged` durability substitute.

## Integration and delivery boundaries

- Existing weather machine already simulates a single seeded phase sequence and persisted state. It does **not** yet establish a quest-triggered forecast reservation or storm-arbitration contract; design/test that extension before implementing the guarantee.
- Shared building condition, structural damage, repair/construction and autonomous NPC work require the common M10+ building/repair system. Quest orchestration is M7; schedules/behaviour M4; rewards/inventory use ordinary real transfers, not duplicated quest-only economy.
- Verify determinism, no overlapping storm phases, at-most-once incident, save/reload, world-time acceleration, NPC-only foundation repair and NPC-only roof repair. Assert storm occurrence in `[foundationRepairTime + 1 day, foundationRepairTime + 3 days]` under ordinary simulation.
- Legacy quest numbers/material counts and imported Q03 payouts are reference only, pending later M7 balancing.

## Sources

- [Woodward timber priorities — D-QUEST-22](woodward-timber-priority-curation.md).
- [Q-012 identity and quest curation](quest-curation-and-q-012.md).
- [V1 wood for fence](../quests/catalog/v1/v1-drewno-na-naprawe/README.md).
- [V1 stone for foundation](../quests/catalog/v1/v1-kamienie-dla-piotra/README.md).
- [V2 Q03 source](../quests/catalog/v2/q03-a-roof-before-rain/README.md).
- [Weather machine](../../src/game/sim/weather/weatherMachine.ts).
