# Ann–Peter Message — Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Sol

**Status:** Accepted author decision (D-QUEST-37, 2026-10-14); narrative curation only, no game implementation.

## D-QUEST-37 — KEEP / REWRITE V1 `relay-anna-piotr`

Keep the V1 “Message for Piotr” as a small, authored NPC-to-NPC message quest, not merely an ambient favour.

- **Cast:** Ann Woodward (`ann_woodward`) asks the player to deliver a message to her husband Peter Woodward (`peter_woodward`). Preserve their reserved identities and marriage. The V1 message about fishing together at dawn can be retained as the story detail; it is not a requirement to implement a fishing activity for the couple.
- **Availability:** Ann can offer the quest when the spouses are physically apart, whether Peter is away working (e.g. chopping wood in the forest) or Ann herself is away from Peter. Availability derives from actual NPC positions and daily schedules; do not script artificial separation or hold either NPC for the quest.
- **Deadline:** The delivery is possible only until Ann and Peter meet again. Their actual reunion closes the opportunity whether or not the player acts; do not invent a fixed-hour quest timer. The offer/dialogue must communicate that urgency before acceptance.
- **Success:** The player speaks to Peter and delivers the message before the reunion. No obligatory return to Ann. Reward **+2 personal relationship with Ann, +1 with Peter**, with no coin, item, or settlement reputation payout.
- **Unaccepted:** If the spouses reunite before the player accepts, the opportunity simply disappears with no penalty.
- **Accepted but undelivered:** If the spouses meet before the player delivers the message, the accepted quest closes without success and the player receives **−1 personal relationship with Ann**. This applies even if the reunion happens unexpectedly quickly; no additional exception or guaranteed grace period.
- **Autonomy:** Ann and Peter can communicate directly when they meet. A missed or completed message does not block their ordinary schedules or their own plans.
- **Repeatability:** Do not farm relationship increases via repeated offers for the same message. A future opportunity must be a genuinely new message/incident, with unique identity and an appropriate availability/cooldown policy decided at M7.

## Implementation boundaries

Reuse M4 NPC positions, schedules and encounters, the shared M7 quest lifecycle and dialogue, and canonical individual relationship state. No quest-specific messenger AI, NPC teleportation, quest-owned proximity simulation, or artificial stops. Preserve the distinct outcomes across save/load. The exact definition of “meet”, how a completed delivery reaches Ann's knowledge, and recurrence tuning are M4/M7 implementation contracts, not new author decisions. No implementation is authorized by this curation.

## Sources

- [V1 Message for Piotr](../quests/catalog/v1/v1-relay-anna-piotr/README.md)
- [Q-012 cast and quest curation](quest-curation-and-q-012.md)
- [Review 024 — v1/v2 quest consistency](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md)
- [Review 059 — Final Audit Synthesis, AD-41…AD-58](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md)
- [M4 NPC daily-life AI](../plans/npc--003--npc-daily-life-ai.md)
