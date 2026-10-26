# Woodward Timber Priority — Quest Curation

**Created at:** 2026-10-13  
**Created by:** ChatGPT Sol

**Status:** Accepted author decisions (D-QUEST-22); detailed reward amounts and presentation remain open. This is narrative/world-state curation, not implementation authorization (M7).

## Scope and cast

- Keep and revise v1 `sporne-drewno`, `drewno-dla-piotra` and `drewno-dla-anny`; do not merge them into v2 Q03 or G05 merely because all involve timber or a woodcutter.
- Ann Woodward (`ann_woodward`) and Peter Woodward (`peter_woodward`) are spouses. Peter represents the household's own repairs, especially his logging cart; Ann prioritizes shared settlement infrastructure, especially the communal pasture fence.
- The disputed priority is practical, not a marital feud. The two repair targets are separate real objects with persistent damage/repair state.

## Player choice and time

1. `sporne-drewno` initially forces the player to choose who receives help *first*, seemingly excluding the other.
2. Once the first person's delivery/help is resolved, the second follow-up becomes available immediately. Both can be completed in the same playthrough.
3. The player has **4 hours of in-game time** for prompt help to the second person. Help within that window earns the normal/full corresponding reward; later help remains possible but earns a reduced quest reward. The precise clock-start event and tuning are open for M7; do not silently convert the timer into quest failure.
4. The timer itself does **not** damage structures, destroy harvests, or impose artificial penalties. Actual lost work, crop exposure, etc. may follow only from the persistent real-world condition of the unfixed cart/fence.

## Repairs and rewards

- Problems must exist in authoritative world state and be visibly damaged; repair is a real state transition, not a quest-only completion flag.
- Before requested materials are supplied, the quest-related NPC must not autonomously resolve the reserved target and invalidate the authored problem. This restriction must not stop the player from repairing it.
- Once materials are supplied, the quest NPC performs repairs via ordinary autonomous repair behaviour; delivering materials does not teleport or instantly complete the repair.
- The player can discover an **optional, hidden** opportunity to offer labour and participate in the repair. It is not a mandatory or openly advertised journal objective.
- Repair work earns rewards under the **planned general repair/reward mechanism**, not a special quest-specific repair payout. Supplying materials and performing real repair work are distinct contributions; do not duplicate reward for a single contribution.
- The player may repair a target independently, without first being asked or delivering materials. The NPC recognises the deed, but unsolicited repair yields a **smaller reward** than agreed help; do not require delivery for an intact target.
- Exact reward amounts, recognition dialogue and how the hidden offer appears are left for later design; older v1 reward numbers are reference values, not confirmed new balance.

## Related quests and scope boundaries

- `drewno-na-naprawe` (household fence) and `kamienie-dla-piotra` (foundation) remain distinct physical repair targets; this decision does not merge them with the cart or communal pasture fence.
- Respect AD-42–45 (authored priority, real contributions, alternative solutions, quiet help), AD-48 (resources), AD-51–52 (relationships/identities), and Review 024 F-13 (distinct repair sinks).
- Inherited v1 [plan 073](../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md) is useful implementation reference but not evidence that SeedVale currently has the mechanics.

## Sources

- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md), especially F-13.
- [Review 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md), Final Audit Synthesis AD-41…AD-58.
- [Quest catalog](../quests/README.md) and [Q-012 curation](quest-curation-and-q-012.md).
