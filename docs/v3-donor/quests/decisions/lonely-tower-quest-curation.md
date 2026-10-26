# Lonely Tower — Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Sol

**Status:** Accepted author narrative decision (2026-10-14). Implementation deferred to M7 and its required shared systems.

## Decision D-QUEST-34 — KEEP / REWRITE

Keep V1 `samotna-wieza` (Lonely Tower), rewritten as an investigation of a thief/bandit cache containing stolen, lightweight valuables. Peter Woodward notices light or movement near an old tower and asks the player to investigate. No bandits are present at the tower, and none return as part of this quest. Do not add combat, hostile NPC spawns or a bandit AI subsystem to support it.

## Narrative flow

1. Peter reports suspicious lights at the tower. The tower is a real persistent discoverable landmark; earlier independent discovery can count.
2. The player investigates and finds a real world-container cache and evidence that it was used to hide stolen property.
3. The player can carry the cache contents in normal inventory without a cart or special storage. Suitable categories: gems, rings, daggers, books, maps and small quantities of valuable herbs. Keep total weight modest and respect actual item carrying capacity, persistent item identity and ownership.
4. The player reports the discovery to the home settlement's reeve, then visits the neighbouring settlement to report the found property there too. Both settlements may have claimants. NPC identities should be assigned against the canonical settlement cast during M7; do not conflate the reeve with Mark, Kate, Ann or Peter.
5. Identifiable owners recognise their property via concrete clues (e.g. ring engraving or book inscription) and may reward an honest return from real inventories/funds.
6. Once the ownership enquiries in both settlements are completed, the reeve may formally grant remaining unclaimed items to the player. Merely not having identified a claimant immediately does not make stolen goods free loot.

## Branches and consequences

- Honest reporting and return: actual ownership transfers; owner-specific relationships and locally known reputation reflect the deeds; optional modest owner-funded rewards.
- Concealment or keeping claimed items: possible theft/appropriation consequences only as facts become known via plausible evidence, discovery or communication, not automatic omniscient penalties. Preserve the player's ability to choose dishonesty.
- Some items remain unclaimed and are legally awarded after the two-settlement enquiry. Do not require a new legal-administration simulation or arbitrary countdown.
- The player may find or recover the cache before accepting Peter's request; avoid duplication, repeated rewards or respawning goods.

## Overlaps and design boundaries

V1 `world:dungeon-bandit` (Bandits' Stash) and `rpg:suspicious-transport` (Suspicious Transport) are separate potential incidents with overlapping evidence, item and ownership mechanics. Do not merge them by theme; avoid using the same specific cache twice. This quest's tower must be a distinct persistent location and container.

Use the unified M7 authored quest system, M3 discovery/knowledge, real inventory, item ownership and transfers, and M8/M9 economy/social exposure where needed. No quest-only ownership database, special investigator simulation, cross-settlement legal engine, bandit activity system or human combat requirement.

## Implementation follow-ups (not approved as fixed numbers)

At M7, determine a suitably located canonical tower, claimant cast in both settlements, distinct low-weight items/identifying evidence, precise outcomes and rewards, and whether a relevant existing ownership/recognition seam is available. If downstream ownership or cross-settlement resolution mechanisms are not ready, stage or defer that slice rather than faking them. Maintain deterministic persistent state and save/load correctness.

## Sources

- [V1 Lonely Tower](../quests/catalog/v1/v1-samotna-wieza/README.md)
- [V1 Bandits' Stash](../quests/catalog/v1/v1-dungeon-bandit-treasure/README.md)
- [V1 Suspicious Transport](../quests/catalog/v1/v1-suspicious-transport-cave-cache/README.md)
- [Quest curation and Q-012](quest-curation-and-q-012.md)
- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md)
- [Review 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md), AD-41…AD-58
