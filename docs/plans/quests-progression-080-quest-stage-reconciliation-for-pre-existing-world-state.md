# Plan: Quest stage reconciliation for pre-existing world state

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** ~~quests-progression-025~~
**Domain:** `quests-progression`
**Subdomains:** `quests`
**Tags:** `quest-lifecycle` `world-state` `inventory` `dialogue`
**Roadmap:** -

## Problem

Quest stages are sequential, but some objectives describe authoritative facts that may already be true before the quest reaches that stage.

Observed in **Stare kości**:

```text
world remains + exact signet already exist
→ Player loots the signet before the quest reaches that objective
→ quest is accepted
→ required talk stages advance normally
→ quest reaches the loot stage
→ already-true loot/possession state is not reconciled immediately
```

The signet is intentionally world-generated before quest acceptance. The world/container and inventory state are therefore valid; the quest lifecycle is stale.

`QuestManager.catchUpActiveWorldObjectives()` already supports authoritative-state catch-up for objectives including `loot_world_container` and `own_item_instance`, but stage transitions do not consistently reconcile the newly entered stage. In particular, `selectTalkToNpc()` advances through `completeObjectiveSlot()` / `advanceStage()` without then reconciling an already-satisfied world-state objective.

This can also make dialogue and Quest Log appear contradictory: an NPC may finish the current talk stage with authored copy such as “Jeśli go znajdziesz…”, while the exact item is already in Player Inventory and the newly entered objective remains temporarily visible.

## Goals

1. Make every newly entered active stage immediately reconcile objectives whose truth can be derived from current authoritative state.
2. Preserve explicit narrative/action prerequisites: earlier `talk_to_npc`, choices and other player actions are not retroactively completed merely because a later world fact is already true.
3. Allow a chain of already-satisfied state-backed stages to catch up deterministically until the next genuinely pending action/objective or `ready_to_report`.
4. Keep world/inventory systems authoritative; do not persist duplicate “discovered while quest inactive” flags in quest progress.
5. Make **Stare kości** naturally support looting the pre-existing signet before the relevant quest stage.
6. Keep dialogue truthful when an authored line depends on possession/world state already known at interaction time.

## Existing mechanisms to reuse

### Quest lifecycle

`src/quests/QuestManager.ts` already owns stage progression through:

- `completeObjectiveSlot()`;
- `advanceStage()`;
- `catchUpActiveWorldObjectives()`;
- `isWorldObjectiveSatisfied()`.

Do not add an Old Bones-specific lifecycle branch.

### Catch-up-capable facts

`isWorldObjectiveSatisfied()` already reads authoritative state for:

- `acquire_portable_container`;
- `discover_location`;
- `light_settlement_fires`;
- `loot_world_container`;
- `own_item_instance`;
- `read_item`;
- `recover_hidden_find`.

These are the initial reconciliation set. Do not make event-only objectives retrospectively true without an authoritative query proving the fact.

### Old Bones exact identity

`src/quests/oldBonesAdventureCave.ts` and `src/app/createApp.ts` already provide:

- deterministic `signetInstanceId`;
- pre-existing world-generated remains container;
- `isOldBonesRemainsLooted(...)`;
- exact inventory lookup through `inventory.getInstance(instanceId)`;
- exact-instance physical claimant resolution.

Reuse those contracts.

## Scope

### 1. Establish one stage-entry reconciliation contract

Refactor the `QuestManager` lifecycle so that after a successful transition into another `active` stage, the manager evaluates catch-up-capable objectives against current authoritative state before exposing the resulting lifecycle externally.

The implementation should have one clear transition/reconciliation boundary rather than requiring every ingress such as `selectTalkToNpc()`, `onReadItem()` or future objective handlers to remember an extra catch-up call.

Avoid uncontrolled recursion:

```text
advance stage
→ reconcile current stage
→ if satisfied, advance
→ reconcile next stage
→ stop at first non-satisfied/action-driven stage or terminal state
```

Use a bounded/iterative mechanism with cycle protection equivalent to or stronger than the current `seen stageIndex` guard in `catchUpActiveWorldObjectives()`.

Stage transitions that explicitly jump via `toStageId` must remain safe. A malformed/cyclic authored transition must not create an infinite reconciliation loop.

### 2. Preserve action semantics

Do **not** treat all objectives as historical facts.

These must still require the appropriate explicit action unless an existing authoritative-state contract specifically says otherwise:

- `talk_to_npc`;
- `talk_to_npc_choice`;
- stage `dialogueActions`;
- reports/terminal claimant choices;
- event-only interactions without a durable world-state lookup.

Example:

```text
talk to Piotr
→ talk to claimant A
→ loot objective already true
→ auto-catch-up loot only
→ claimant B talk remains pending
```

The Player having the signet must not fabricate conversations that never happened.

### 3. Align Old Bones acquisition semantics

Review the Old Bones acquisition stage in `buildOldBonesAdventureCaveQuest()`.

The narrative fact needed after the remains stage is not merely “the signet disappeared from its original container”; terminal claimant actions require the exact signet to be physically held by the Player.

Prefer expressing that with existing generic objective composition where coherent, e.g. an `all` acquisition stage combining the exact world-container fact and `own_item_instance(binding.signetInstanceId)`.

Do not introduce a new Old Bones-specific objective type.

If current ownership semantics intentionally allow the signet to be moved into another legal storage before claimant dialogue, keep the quest truthful and non-terminal rather than treating absence from the original remains as sufficient possession.

### 4. Context-aware Old Bones dialogue without lifecycle hacks

After claimant A reveals the signet clue, the dialogue should not tell the Player “Jeśli go znajdziesz…” when the exact signet is already carried.

Use or minimally extend the existing generic stage dialogue/reaction gating based on authoritative inventory state. Prefer the existing exact-instance contracts such as `requireItemInstanceId` over quest-id checks.

The desired UX is equivalent to:

```text
Player does not own exact signet:
  claimant explains what to look for

Player already owns exact signet:
  Player can acknowledge that it has already been found
  claimant responds consistently
  lifecycle then reconciles the acquisition stage
```

Do not allow presentation code to mutate stages merely because it rendered a variant. Progress still comes from explicit selected dialogue action plus normal stage reconciliation.

### 5. Keep journal/history causally correct

Catch-up of a state-backed objective may record an observation/progress entry according to existing journal rules, but it must not fabricate an NPC speaker or NPC quote.

Review `advanceStage()`, `completeObjectiveSlot()`, `progressSpeakerNpcId()`, `appendJournal()` and journal projection for catch-up transitions.

Invariant:

> A journal line attributed to an NPC exists only when an actual player↔NPC dialogue action occurred.

World/inventory catch-up is a Player/world observation unless an explicit dialogue action produced the line.

## Tests

### Generic `QuestManager` lifecycle

Add focused tests in `src/quests/QuestManager.test.ts`:

1. `talk_to_npc → already-satisfied loot_world_container → talk_to_npc`:
   - selecting the first talk advances;
   - loot stage catches up immediately;
   - second talk remains pending.

2. `talk_to_npc → already-owned own_item_instance → talk_to_npc`:
   - exact ownership stage catches up immediately.

3. Two consecutive already-satisfied state-backed stages:
   - both reconcile in one lifecycle transition;
   - manager stops at the first unsatisfied/action stage.

4. State-backed objective false:
   - no accidental advancement.

5. Later `talk_to_npc` already has all related world facts true:
   - talk is still required; no fabricated conversation.

6. Transition/jump safety:
   - reconciliation cannot loop indefinitely on authored stage transitions.

7. Journal attribution:
   - automatic world/inventory catch-up does not create an NPC-spoken note;
   - the actual selected talk action still records the correct NPC contribution.

### Old Bones regression

Extend `src/quests/oldBonesAdventureCave.test.ts` and/or the nearest integration-style QuestManager fixture:

```text
create pre-existing remains + signet
→ loot exact signet before quest acceptance/relevant stage
→ accept quest
→ perform required giver/claimant conversations
→ acquisition stage catches up without re-looting
→ optional claimant B talk remains required
→ claimant decision becomes reachable
```

Also cover:

- signet still in remains → acquisition does not catch up;
- remains looted but exact signet not in Player Inventory, when the stage requires possession → claimant decision is not falsely exposed;
- exact signet in inventory uses the “already found” dialogue variant;
- normal in-order discovery retains the existing story flow;
- no claimant conversation is journaled unless selected by the Player.

## Relevant files

- `src/quests/QuestManager.ts`
- `src/quests/QuestManager.test.ts`
- `src/quests/quests.ts`
- `src/quests/oldBonesAdventureCave.ts`
- `src/quests/oldBonesAdventureCave.test.ts`
- `src/app/createApp.ts`
- `src/items/Inventory.ts`
- `src/world/worldGeneratedContainers.ts`

Add JSDoc with `@domain quests-progression` for any new reusable stage-reconciliation helper whose lifecycle role is not obvious locally.

## Non-goals

- No quest-specific `if (questId === old-bones)` lifecycle logic.
- No global event bus for historical quest facts.
- No duplicated quest-owned inventory/world state.
- No automatic completion of conversations or claimant decisions.
- No broad rewrite of quest dialogue architecture.
- No browser verification by AI.
- No changes to world generation or signet spawning unless current code proves a separate defect.

## Verification

Automated:

- targeted `QuestManager` lifecycle/reconciliation tests;
- targeted Old Bones tests;
- existing quest test suite affected by stage-transition semantics;
- normal typecheck/test gate required by repository instructions.

Manual browser verification by User:

1. Loot the Old Bones signet before starting/progressing the quest.
2. Accept and follow the required conversations.
3. Confirm the loot objective is recognized automatically when reached.
4. Confirm dialogue acknowledges an already-carried signet rather than asking the Player to find it.
5. Confirm optional claimant dialogue still requires a real conversation.
6. Confirm claimant choice transfers/keeps the exact physical signet as authored.
7. Repeat the ordinary in-order path and confirm no regression.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
