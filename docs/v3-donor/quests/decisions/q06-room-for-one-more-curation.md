# Q06 — Room for One More: Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT GPT-6

**Status:** Accepted narrative direction (D-QUEST-33); implementation deferred to M7 and shared companion readiness.

## Decision — D-QUEST-33

**KEEP / REWRITE** V2 Q06 as a family-and-travel story about Miles and Lucy Hewer, their adult son Matthew, and collecting Miles's prepaid axe head and two iron wedges from Sophie Smith in a neighbouring settlement. Preserve three distinct routes:

1. **Paid journey:** Matthew voluntarily accompanies the player under a clear, finite paid agreement. Pay is a real transfer; contract terms and balance belong to the general companion/economy systems.
2. **Voluntary journey:** Matthew joins because he wants to see more of the world, subject to his own consent, relationships, current needs and duties. The family recognises his growing independence.
3. **Solo collection:** the player takes Miles's authorisation, collects the actual order and returns it. Matthew continues his ordinary household work.

Matthew may later be available as a **normal hireable travel companion**, independently of Q06, solely through the shared companion system and its availability rules. Quest completion does not automatically recruit him or grant permanent obedience.

## Limits and continuity

- Preserve Miles, Lucy and Matthew as one consistent Hewer family. Align their placement with accepted G05 D-QUEST-27 (Miles is not Peter Woodward and should not be duplicated in the home settlement). Do not infer that V2's original H automatically equals canonical Saltmere.
- Matthew remains an autonomous NPC with work, rest, needs, personal decisions and the right to refuse, leave or return home. Do not freeze NPC schedules, reserve an NPC indefinitely, or hold dialogue participants in place while the quest awaits the player.
- Use shared NPC routines, travel/companion, inventories, item ownership, order fulfilment, and conserved money transfers. Do not create a quest-specific follower AI, employment engine, item-repair engine or NPC migration mechanic.
- The paid order must correspond to goods and payment with persistent owners; do not spawn a fresh duplicate order every time an offer is evaluated. Exact source stock, prices, permissions and equipment exchanges are M7/M8 design details.
- Campfire dialogue, references to Q02, and possible future work with Sophie are optional continuity, not conditions that hold Matthew hostage to a scene. NPC conversations and stops must be interruptible.
- If companions are not sufficiently ready when the content is implemented, **defer the accompanied branches or Q06 as needed**, rather than adding a temporary quest-only companion system. Do not silently replace the accepted three-branch story with a solo-only canonical quest.
- No generic 120 h offer expiry or 504 h quest termination merely to clear stage flags. Normal world changes (order pickup by others, conflicting obligations, illness, travel interruption) can alter availability or lead to an appropriate authored outcome. Avoid hard guarantees of NPC availability or travel safety.
- Rewards are modest and proportionate: real wages in the paid route, relationship/recognition in both accompanied routes, and ordinary reimbursement or goods for solo delivery. Exact amounts, thresholds, journal text and balance remain open.

## Relationship to existing canon

- [D-QUEST-27 — G05 Disputed Oak](disputed-oak-g05-curation.md): Miles Hewer remains a distinct woodcutter outside the home settlement.
- [D-QUEST-30 — Q04 The Handle Remembers](q04-handle-remembers-curation.md): Sophie Smith and her forge may serve as the order destination, without requiring Q04.
- AD-41…AD-58 in [review 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md): authored quest priority, multiple resolutions, real transfers, NPC autonomy and lasting social outcomes.
- [V2 Q06 description](../quests/catalog/v2/q06-room-for-one-more/README.md) and [V2 source](../comparison/code/SeedVales-v2/src/game/data/quests/q06.ts) are imported references, not binding canonical mechanics.

**Scope:** narrative curation only; no game implementation or new companion-system contract is approved by this decision.
