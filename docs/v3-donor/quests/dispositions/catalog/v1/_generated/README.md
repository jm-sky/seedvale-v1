# Generated opportunities (seedvale v1)

**Status:** `verification needed`
**Created:** -
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -
**Source:** imported from seedvale v1 (`seedvale-v1/src/quests/opportunities/`); no `meta.ts` here because these are generated per world, not authored per quest

## Summary

The v1 opportunity generators create quest definitions at runtime from world state (settlement NPCs, habitat pressure, landmarks, animals). They are not one-off quests: each generator yields a family of quest ids keyed by settlement, NPC, animal, or spawner. Authored quests have their own folders under `../`.

## Generators

- **`rpgQuestMatrices.ts`**: RPG settlement matrices. Id prefix `rpg:<matrixId>:<settlementId>:<sourceId>` (`rpgQuestId`). Matrix ids: `old-place-secret` (titled "Sekret starego miejsca"), `suspicious-transport` (titled "Podejrzany transport"; the module quest `suspicious-transport-cave-cache` uses this id), `settlement-agreement` (titled "Umowa między osadami"). Collectors: `collectRpgQuestOpportunities` and per-matrix candidate collectors. Limits neighbour settlements to `RPG_NEIGHBOR_SETTLEMENT_LIMIT` (2).
- **`hunterProfessionQuests.ts`**: hunter profession ladder. Id prefix `hunter-profession:<settlementId>:<giverNpcId>:<step>` (`hunterProfessionQuestId`, step 1 to 3). Titles: "Pierwsze trofea" (step 1, outcome `hunter_i_complete`), "Poroża jeleni" (step 2, `hunter_ii_complete`), "Pomoc przy zagajniku" (step 3, `hunter_iii_complete`). Step 3 is the prerequisite of the hunters brotherhood introduction quest.
- **`guardProfessionQuests.ts`**: guard evening duty. Id prefix `guard-evening-duty:<settlementId>:<giverNpcId>` (`guardEveningDutyQuestId`). Title "Światła na noc", outcome `guard_evening_lights_complete`; the duty is torch-related (the module imports `SettlementVillageTorch`; the exact steps were not traced). Giver chosen by `selectGuardQuestGiver`. Its rewards live in `guardRewards.ts` (not covered here).
- **`settlementQuestOpportunities.ts`**: settlement problems detected from fauna and habitat state. Id prefixes:
  - `world:wolf-den-pressure:<spawnerId>` (wolf den pressure; `spawnerId` is `<settlementId>:wolfDen`).
  - `world:lost-livestock:<settlementId>:<animalId>` (outcomes `live_return`, `dead_confirmed`, `unavailable`).
  - `world:injured-cow:<settlementId>:<animalId>` (outcomes `cow_treated`, `cow_slaughtered`).
  Collectors: `collectWolfDenPressureOpportunities`, `collectLostLivestockOpportunities`, `collectInjuredCowOpportunities`, and the combined `collectSettlementQuestOpportunities`.
- **`worldQuestMaterialization.ts`**: turns the settlement opportunities into `QuestDef`s. Titles: "Wilki pod osadą" (wolf den), "Zagubione zwierzę" (lost livestock), "Ranna krowa" (injured cow; stage `deliver-meat`, one beef). Entry points: `materializeSettlementQuestOpportunity` and `buildWorldDrivenSettlementQuests`.

## Supporting files (not quest definitions)

- `rpgQuestMaterialization.ts`: materializes the RPG matrix candidates into quest definitions (titles as above).
- `settlementQuestSelection.ts`, `settlementNpcMaterialization.ts`, `worldQuestOpportunityTypes.ts`: selection, NPC setup and shared opportunity types.

## Related docs

- [Quests progression plan 016: world-driven settlement quest opportunities](../../../../reference/quests/progression-plans/v1/quests-progression-016-world-driven-settlement-quest-opportunities.md).
- [Quests progression plan 017: RPG settlement quest matrices](../../../../reference/quests/progression-plans/v1/quests-progression-017-rpg-settlement-quest-matrices.md).
- [Quests progression plan 020: hunter profession quests and wildlife help](../../../../reference/quests/progression-plans/v1/quests-progression-020-hunter-profession-quests-and-wildlife-help.md).
- [Quests progression plan 021: guard rewards and evening settlement duty](../../../../reference/quests/progression-plans/v1/quests-progression-021-guard-rewards-and-evening-settlement-duty.md).

## Open questions

- ❓ The v1 generator outputs were not enumerated against a running world; only the code paths are summarised here.
- ❓ `guardRewards.ts` and `authoredRepairDeliveries.ts` were excluded from scope; their reward details are not recorded.
