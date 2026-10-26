# Quest and Gameplay Feature Proposals

**Created at:** 2026-10-09  
**Created by:** ChatGPT Luna

**Status:** `planned`
**Domain:** quests / world simulation
**Roadmap:** M7 (quests); shared mechanics may need to land earlier with their owning systems
**Depends on:** domain curation and implementation planning for the affected systems
**Finished:** -

## Purpose

This document records features intended for SeedVale, not a wishlist for possible future consideration. The proposals below are **expected to be implemented**. Their detailed design, dependencies, scope, and milestone placement still need to be worked out against the current canon and codebase before implementation.

Treat v1/v2 behaviour as reference material to investigate, not as proof that the same implementation already exists or should be copied blindly. Reuse existing systems and avoid quest-specific duplicates of general simulation mechanics.

## 1. Rat Plague

Expand the existing v1 *Rat Plague* quest and support it with general world-simulation mechanics.

### General building deterioration and rat pressure

- Add building deterioration as a general mechanic, rather than a special case implemented only for this quest.
- A deteriorating or damaged storage building should be one possible source of rat pressure and infestation.
- The relationship between storage condition, infestation pressure, rat population, and recovery should be systemic and testable. Exact rules and balancing remain to be designed.

### Optional expanded quest path

After receiving the quest, the player can investigate the storage building or a dedicated storage area enclosed by a fence.

The expanded encounter should include:
- finding and destroying the rat nest;
- fighting the rats in the area;
- a **Rat Alpha boss** encounter.

Poison may be an optional approach, not a mandatory solution. If poison is implemented, the game should clearly warn the player about the risk to other animals and account for those consequences. Do not introduce poison as a consequence-free shortcut.

The quest should remain connected to the general infestation and building-condition systems; completing it must not rely solely on scripted quest flags that bypass world state.

## 2. Quiet tasks: repairing without being asked

Implement the v2-style quiet-task pattern: some buildings or objects can be visibly damaged without an NPC explicitly requesting help.

- The player can notice the damage and repair it on their own initiative.
- After the repair, a member of the relevant household notices and thanks the player.
- The interaction should feel like a small discovery and a social reward, not a conventional quest accepted from a quest giver.

Investigate the v2 implementation and behaviour before designing the port. Reuse the existing repair, household, relationship, and dialogue mechanisms where available.

## 3. Wounded dog companion

Implement the v2-style wounded-dog encounter and companion progression.

- The player can find and help a wounded dog.
- The dog can later become the player's companion.
- The companion can help the player detect or find treasures.

This is a required gameplay feature, not merely an optional idea. Investigate how v2 handled the encounter, companion state, and treasure-finding behaviour, then adapt it to the current architecture and canon.

Keep animal behaviour and companion simulation separate from presentation. Define the treasure-detection rules and player feedback during detailed design.

## Implementation notes

- These features are intended to be delivered, but this document does not authorize implementing them ahead of the established roadmap.
- Before implementation, verify the current canon, roadmap, quest engine, and relevant v1/v2 reference material.
- Identify shared mechanics (especially building deterioration, infestation, repairs, household reactions, and animal companions) and assign them to their owning domains rather than duplicating them inside quest scripts.
- Add appropriate simulation and quest tests, including edge cases such as poisoning non-target animals and preserving consistent world state.

## 4. Village elder — former adventurer

Expand the existing home-settlement `elder` role and the v1 *Lost Treasure Chronicles* story into a single authored character for v3. **This is an agreed narrative/gameplay direction, not an implementation task or confirmation that the imported v1 quests already work in v3.**

### Character and discovery

- The elder lives in the existing `elder` household in the starting settlement. He now leads a quiet, ordinary life; his history as an adventurer is initially unknown to the player.
- Reveal his past gradually through authored dialogue, anecdotes about old expeditions and companions, and personal memories. Keep the stories grounded in SeedVale's low-fantasy/realistic setting.
- Use the existing/planned personal relationship and local settlement reputation systems to shape when he opens up, how much he tells the player, and which leads he shares. Do **not** add a bespoke elder-trust score.
- His stories can provide clues, locations, and quests connected to *Lost Treasure Chronicles*. Preserve the distinction between individual quests; do not merge the storyline into one mandatory quest chain.

### Legendary sword — personal gift, not quest payout

- The elder keeps a legendary sword in his home as a real, persistent, uniquely identified item with ownership and history; do not spawn it only when a reward dialogue is triggered.
- He may choose to give the sword to a player he has come to trust and respect. This should be a surprising, personal gesture rather than an automatic reward for completing a specific quest or the treasure storyline.
- Receiving the sword must remain possible without completing all of *Lost Treasure Chronicles*. Gate the opportunity through meaningful relationship/reputation and appropriate narrative circumstances, not an arbitrary player-level requirement.
- Respect established item uniqueness and physical transfer rules. Balance the acquisition carefully: the item is potentially very powerful for the starting settlement.

### Scope and open details

- Reuse the existing household slot and NPC/quest/item systems as they become available; do not introduce a parallel elder-specific interaction or quest framework.
- Decide the elder's stable NPC identity/name, exact backstory, sword identity and lore, dialogue variants, and gift conditions during detailed content design. Existing legendary sword definitions are candidates, not an automatic selection.
- Implement against the v3 roadmap when the relevant NPC dialogue, relationship/reputation, quest and persistent-item mechanics are ready. No implementation is implied by this proposal.

**Reference material:** [v1 Lost Treasure Chronicles roadmap](roadmaps/v1/quests-lost-something-chronicles.md), [elder winter quest](catalog/v1/v1-lost-treasure-chronicles-elder-winter/README.md), [elder dispute quest](catalog/v1/v1-lost-treasure-chronicles-elder-dispute/README.md). These are imported reference, not v3 canon or verified implementations.

## 5. Cemetery treasure quests — grave access and permissions

Keep **two separate authored questlines** in v3: Marek's *Old Treasure in the Bear Cave* (a treasure map buried in a grave) and *Lost Treasure Chronicles* (an encoded chronicle potentially buried in a researcher's grave; the treasure map itself is found later). Preserve each quest's distinct clues, destinations, items, and outcomes. This is an agreed feature direction, not authorization to implement the quests now.

### Marek's quest — family permission

Opening the relevant grave can be lawful when the deceased's family grants permission. Provide three alternative negotiation paths, using the shared NPC-relationship and settlement-reputation systems:

- **A. Established trust:** a high relationship with the family earns permission without payment.
- **B. Moderate trust or good standing:** a moderately positive family relationship and/or sufficiently positive local reputation permits an upfront payment plus a binding promise to return any personal mementos of the deceased recovered during the expedition.
- **C. No established relationship:** an upfront payment plus a binding promise to give the family an agreed share of the treasure; lack of prior familiarity should not itself block negotiation, but hostility and other context can matter.

All three routes grant permission only for the specified grave. Use actual persistent items for recoverable mementos, not rewards spawned by a dialogue outcome. Track promises as durable obligations: the player may break them, but the affected NPCs remember and respond. Do not invent a separate quest-only debt, permission, or reputation system.

### Settlement authority — a shared alternative for both quests

For either quest, the village head (reeve/mayor, as appropriate to the settlement) can authorize opening the specific grave in the settlement's interest, independently of family permission.

- Authorization requires an **upfront payment into the settlement treasury** and a commitment to give the **settlement** an agreed share of the recovered treasure. These are public settlement proceeds, **not private payments or bribes** to the village head.
- **Local settlement reputation is a meaningful gate:** a trusted player may obtain permission on reasonable terms; neutral standing may mean less favorable terms; a player with sufficiently poor reputation can be refused regardless of available money. Exact thresholds and amounts remain for detailed design and balancing.
- The settlement has a legitimate interest in archaeological or historical discoveries. Historically valuable finds can be formally donated or deposited as exhibits, contributing to settlement prestige/reputation. Record such deposits and provenance persistently; **do not create a full museum/building system solely for these quests**.
- The authorization makes the excavation lawful, but **does not make the family approve**. If the player uses this route against the family's wishes and disturbs the grave, the player's relationship with the family deteriorates. Merely discussing or obtaining permission should not trigger that penalty.
- The family may voluntarily support a donation to the settlement, allowing both the relationship and settlement standing to benefit where justified.

The treasure-share commitment should be settled against treasure **actually acquired by the player**, with no duplicated loot or money creation. Account for Marek's existing keep-the-treasure versus return-the-sealed-casket outcome; do not charge a promised share on the full casket contents when the player did not retain them.

### Other grave-access paths and consequences

- **Unauthorized excavation remains possible**, including attempts at night or while sneaking. It is not a mandatory quest failure, but carries the normal risk of the deed becoming known and causing social/reputation consequences; use shared world rules rather than scripted punishment.
- **Lost Treasure Chronicles** retains its distinct cemetery-caretaker favor/authorized-access path and its investigation alternative at the expedition ruins. Do not collapse it into Marek's quest or require the village-head route.
- Permission must refer to the **specific grave and scope of work**, rather than allowing arbitrary digging throughout the cemetery. Investigation and prior world changes should persist; finding or excavating the site before taking the quest must not duplicate items.
- Historical artifacts, family mementos, treasure ownership, and promised shares may have different recipients. Make competing claims and the effects of unfulfilled promises explicit during detailed quest design.

### Scope and open details

This section captures agreed gameplay decisions. Exact relationship/reputation thresholds, fees, percentage shares, dialogue, artifact classification, ownership disputes, and the rules governing which authority may lawfully authorize excavation remain to be designed against v3 canon and the economy. Reuse shared cemetery, ownership, NPC relationship, settlement treasury, knowledge/reputation, promises, and quest systems as they become available. No implementation or roadmap reprioritization is implied.

**Reference material:** [v1 bear-cave treasure quest](catalog/v1/v1-skarb-jaskini-niedzwiedzia/README.md), [v1 cemetery caretaker favor](catalog/v1/v1-lost-treasure-cemetery-favour/README.md), and [Lost Treasure Chronicles roadmap](roadmaps/v1/quests-lost-something-chronicles.md). Imported v1 material is reference, not proof of v3 implementation.
