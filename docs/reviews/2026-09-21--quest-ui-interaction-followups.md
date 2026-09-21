# Quest/UI/interaction audit follow-ups

**Date:** 2026-09-21
**Source:** cross-system audit of recent quest lifecycle, Quest Log, interaction candidate, UI/input and quest↔world-state changes on `main`.

This note records audit findings that were **not** promoted to dedicated implementation plans. Higher-ROI implementation work was split into:

- `quests-progression-081-quest-ui-completion-readiness-projection.md`
- `quests-progression-082-quest-ui-world-objective-reconciliation-coverage.md`
- `ui-input-038-quest-ui-interaction-actionability-ranking-parity.md`

## 1. Dropped-item group stable identity

### Relevant code

- `src/app/interactables.ts`
  - dropped-item grouping / `DroppedItemGroupCandidate`
- `src/interaction/interactionView.ts`
  - `interactableStableKey()`
- `src/app/gameLoop.ts`
  - `cycleCommittedKey`
  - `gazeStableTargetKey`
- existing lifecycle work: `ui-input-028-interaction-target-identity-and-cycle-lifecycle.md`

### Current behavior

A grouped dropped-item interaction is represented through one member id. `interactableStableKey()` therefore ultimately derives identity from that representative item.

If the representative member disappears while other members of the same local group remain, the group can be semantically the same pickup target but receive a different stable key.

### Impact

This can reset non-combat Tab commitment or gaze hysteresis. It does **not** currently appear to cause stale object mutation or wrong-world dispatch because interaction candidates are rebuilt and resolved from current-frame state.

### Direction

If this becomes user-visible, prefer a deterministic group identity derived from current authoritative group membership/position rather than persistent group state.

Do not create a second dropped-item registry or parallel target lifecycle. Treat this as a possible completion/follow-up of `ui-input-028`, not a separate targeting architecture.

---

## 2. `pendingReportOutcomeId` lifecycle invariant is narrow and implicit

### Relevant code

- `src/quests/QuestManager.ts`
  - `setQuestState()`
  - `advanceStage()`
  - `resolveSuccessfulTurnIn()`
  - `applyOutcome()`
- `src/quests/quests.ts`
  - `QuestProgressEntry.pendingReportOutcomeId`
- lost-livestock lifecycle: `quests-progression-075`

### Current behavior

`pendingReportOutcomeId` is captured when a branching quest enters `ready_to_report` and is then consumed when the player deliberately reports back.

Unlike `journal`, `worldKnowledge`, `dialogueCooldowns` and `observation`, `setQuestState()` does not implicitly preserve it across arbitrary state rewrites.

Today this is consistent with the intended flow: the field is narrow lifecycle intent, should exist only while waiting for report, and terminal resolution should clear it.

### Risk

A future generic state patch inserted between stage completion and report could accidentally drop the branch intent and cause the eventual report to lose its captured outcome selection.

No concrete current bug path was found during the audit.

### Direction

Keep this as a watchlist invariant unless another branching report flow is added.

If the concept becomes reused, prefer making report payload semantics explicit in the transition API / ready-to-report state construction instead of adding another generic preservation rule in `setQuestState()`.

---

## 3. `promptLabel` remains a transitional interaction-semantics adapter

### Relevant code

- `src/interaction/interactionView.ts`
  - `parseLegacyPrompt()`
  - `buildInteractionView()`
- `src/app/interactables.ts`
  - many candidate `promptLabel` producers
- completed architecture plan:
  - `ui-input-015-interaction-targeting-and-action-semantics.md`

### Current behavior

The newer interaction layer has structured `InteractionActionView` contracts for an increasing number of targets, but many candidates still derive primary/alternate availability by parsing legacy `promptLabel` strings.

This leaves part of action semantics encoded in presentation text.

### Impact

No concrete regression was found in the audited recent changes. The main risk is future drift where prompt wording and actual action availability evolve independently.

### Direction

Continue migrating opportunistically when a touched interaction already needs structured eligibility or blocked-reason semantics.

Do not start a broad mechanical rewrite of every `promptLabel`. The existing incremental `InteractionView` seam is the right destination.

---

## 4. Interaction rebuild/downed lifecycle currently looks sound

The audit did **not** find a new follow-up requiring a plan for:

- `WorldBundle` rebuild targeting invalidation,
- world-bound Vue/transfer-session invalidation,
- downed-player non-modal input gating,
- risky-water confirmation revalidation,
- corpse interaction candidate lifecycle.

These areas should stay regression-tested as adjacent interaction work lands, especially `ui-input-038`, but no separate implementation item is justified from this audit.

---

## 5. Quest terminal idempotency currently looks sound

`QuestManager.applyOutcome()` remains the single terminal path for normal complete/failed outcomes and guards against replay once the quest is terminal.

The audit found no current route for double reward, double consequence application, or duplicate terminal feedback that merits a separate plan.

Keep this invariant covered when extending branching reports or external world-source resolution.
