# Q04 — The Handle Remembers: Narrative Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Sol

**Status:** Accepted narrative direction (author, 2026-10-14); detailed dialogue, casting, values and implementation remain open.

## Decision — D-QUEST-30

**KEEP / REWRITE** V2 Q04 as an intimate story about Bernard's attachment to an old hammer, his daughter Sophie's concern, and their working relationship. Keep G02 `Rusty Debt` as a separate quest about a defective plowshare and an honest commercial dispute; allow optional references between them, without either quest requiring the other.

The hammer has a damaged handle and a flawed head. **The practical problem arises from the damaged tool, not a persistent medical condition, age-driven hand impairment or a generic smith skill/quality degradation model.** Age and changing family roles can remain dialogue themes, not new simulation systems.

Retain three meaningful resolutions: reforge/repair the old hammer, make a new lighter hammer while preserving the old one, or retire the hammer as a keepsake and postpone the replacement. The preferred narrative resolution is a new lighter hammer with the old one kept as a memento, but do not force it or remove player agency. Consequences should be credible and localized: the object and its disposition, limited workshop work/availability where already supported, individual relationships, and modest real-stock goods or existing smithing services as rewards.

## Casting and scope safeguards

- **Verify the current canonical population and household plans before binding or adding NPCs.** The home settlement's approved population roster is not yet fully implemented; do not transplant Bernard/Sophie into the home settlement, overwrite reserved home identities, or assume imported V2 character names and kinship are canonical. A suitable neighbouring smith household is the starting candidate, conditional on M4 settlement decisions.
- Do **not** implement sophisticated off-screen decision-making or general NPC autonomy to resolve this quest. If a resolution without player participation is needed, use a bounded authored dialogue/event outcome rather than a generic AI decision framework.
- Prefer existing inventory, condition, item transfer and smith service/order mechanisms **only when they actually exist at implementation time**. The cracked head may be an authored inspectable clue; do not introduce per-strike material physics, generic microscopic damage, NPC ergonomic/medical simulation, or a global smith-work-quality modifier for this quest.
- No quest-only crafting or repair subsystem. Avoid invisible proximity dwell checks as substitutes for explicit inspections/interactions.
- Exact scene text, whether all three endings can be implemented cheaply, resources, rewards, NPC binding and optional G02 dialogue should be settled during M7 design. If an inherited branch requires a disproportionate new subsystem, simplify that branch rather than adding the subsystem.
- Narrative curation only: **no game-code implementation authorized before M7**.

## G02 linkage — D-QUEST-41 (2026-10-14)

G02 now explicitly shares the damaged-hammer cause: its uncomfortable rebound in Bernard's hand contributed to the flawed plowshare, although he initially believed his workmanship was sound. This is compatible with the existing tool-specific, non-chronic explanation. G02's commercial dispute and Q04's family story remain independent, with optional clues and dialogue between them. See [G02 curation](g02-rusty-debt-curation.md).

## Sources

- [Q04 V2 scenario](../quests/catalog/v2/q04-the-handle-remembers/README.md)
- [G02 V2 scenario](../quests/catalog/v2/g02-rusty-debt/README.md)
- [Home population and household requirements](../world/areas/home.md)
- [V2 shared quest world (reference, not canon)](../quests/v2-shared/QUEST-WORLD.md)
