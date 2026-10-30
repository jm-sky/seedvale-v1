# Plan: NPC dialogue semantic choices and spoken lines

**Created:** 2026-10-30
**Status:** `planned` 📋
**Type:** polish
**Priority:** high · **Effort:** L
**Depends on:** -
**Domain:** `ui-input`
**Subdomains:** `menus` `interaction` `feedback`
**Tags:** `ui` `audio` `npc-dialogue`
**Model:** Sonnet, Composer

## Goal

Improve V1 NPC conversations: an opening spoken greeting visible in history, and a consistent distinction between navigation/parameters and genuine speech across **all** dialogue choices, including quest actions and expedition invitations. Preserve V1's existing dialogue, quest, voice, social and NPC simulation owners and V1 dialogue-window presentation.

## Verified current state

- `src/ui-vue/NpcDialogueMenu.vue` owns the session history, groups/topics, `MenuChoice.say`, and `onChoose`. On open it clears messages but does not append a greeting. `say: true` logs the literal option label as Player speech even for actions/parameters.
- `src/ui-vue/store.ts::openNpcDialogueMenu` stops a reaction bark and plays `resolveNpcVoiceLine(npc, 'greeting')`, but no text greeting is passed to history. `resolveNpcDialogueOpenTopic` reserves automatic opening for payment and NPC-initiated joining; quests do not auto-open.
- `src/ui-vue/components/DialogueWindow.vue` is a pure display of `DialogueMessage[]` and `DialogueChoice[]`.
- Voluntary expedition invitation uses `openProposeJoin()` → duration (0.5, 1, 2, 3 days) → `state.onProposeJoin(days)` → NPC response. Both the topic and duration choices currently have `say: true`.
- `src/ai/dialogueTemplates.ts` owns pure Polish wording helpers, including `voluntaryJoinResponseLine`; some other template choices use `Math.random()`. NPC willingness/commitment is owned by `voluntaryExpeditionJoin.ts` / `NpcAgent`, not UI.
- Related completed/archived plans: `ui-input-024`, `ui-input-036`, `npc-031`, `quests-progression-014`. Respect the Revival Strategic Brief's V1 dialogue ownership and D4 integration policy.

## Requirements

### A. Opening greeting

Show exactly one appropriate NPC greeting in the conversation history on ordinary open, selected from authored variants compatible with existing personality/relation/context data, with neutral fallback. The displayed words and played greeting audio must agree when an exact recorded transcript is available; never display an unrelated invented quote as if it matched a recording. Text-only fallback is acceptable if a matching clip is unavailable. Preserve the existing stop-before-voice sequencing and payment/initiative opening priority; opening must not advance quests or create other domain effects.

### B. Semantic dialogue choices

Replace the ambiguous `say` echo behavior with explicit choice semantics: **navigation**, **parameter**, **Player speech**, or **action/feedback**. Keep display labels separate from actual history utterances. A click adds a Player message only when the Player genuinely says something. Never echo category names, quest titles, duration values, back/cancel, trade screens, orders, gifts, or other control labels as speech.

Audit all root/group/topic choices, quest shortcuts and authored quest responses, help, food/water, wage, pending NPC join proposals, and goodbye. Preserve current callbacks, quest priority, keyboard choices and navigation. Reuse quest-authored `playerLine` when available, rather than deriving a spoken sentence from a quest action label. Classify meaningful accept/refuse responses as speech where appropriate, not automatically silent.

### C. Expedition invitation

Opening `Zaproponuj udział w wyprawie` and selecting duration are navigation/parameter operations. Committing a duration appends **one** complete natural Player sentence asking the NPC to join for the chosen duration and then invokes the existing `onProposeJoin(days)` **exactly once**. Support all four current durations (half day, one, two, three days) with correct Polish inflection and multiple authored variants. Vary tone without changing the terms. No separate confirmation step; backing out commits nothing. Preserve all willingness, provisioning, accompaniment and refusal mechanics.

### D. History consistency and variation

Select each utterance once per committed action/open and keep it stable across Vue rerenders/watchers. Prefer context/identity-based deterministic variant selection for newly authored lines, avoiding repeated `Math.random()` calls during reactive evaluation. Prevent stale, empty, duplicated or out-of-order messages on close/reopen, rapid selection, topic changes, async area replies and quest transitions. Conversation log remains ephemeral UI state, not persisted social memory. Keep text/voice pairing truthful; no requirement to record new audio.

## Non-goals and constraints

No new dialogue engine, LLM, V3 dialogue runtime, NPC recruitment logic, quest state, relationship model, persistent transcript, save migration, voice catalogue rewrite, NPC–NPC conversations or unrelated visual redesign. Do not auto-open quest help. Avoid additional scanning/ticking and unnecessary reactive recomputation. Keep existing `DialogueWindow` and V1 domain ownership.

## Delivery stages

1. Add the small semantic choice/utterance contract and tests, then migrate every existing option without changing its domain callback.
2. Add opening greeting text with one text/audio resolution boundary and lifecycle tests, including special open-topic states.
3. Add pure duration-aware invitation phrasing and single-commit dispatch, preserving NPC response behavior.
4. Audit and test every quest/help/merchant/social/payment response path and async history behavior; correct residual classification and duplication.

Add concise JSDoc with `@domain ui-input` for important public helpers; keep stages reversible.

## Verification

- Normal opening has one correct greeting; opening twice resets the log; no mismatched voice/text; quest state unchanged on open.
- Category, back, quest topic labels, duration and other UI-only controls never appear as Player speech. Real Player dialogue and quest-authored lines do.
- Each of the four duration choices produces grammatical full Player speech and exactly one authoritative NPC invitation call; backing out does neither.
- Quest actions/acceptance/report, trade, assistance, payment and NPC-initiated invitations preserve domain results and keyboard access.
- No duplicate/stale replies during rapid input, async work, watchers or NPC switching. Test pure templates, store lifecycle and Vue menu/component; perform manual browser audio/visual verification. Static inspection cannot establish runtime PASS.

## Scheduling constraint

The Revival Strategic Brief retains a D4 Performance-First integration freeze. This documented plan does **not** grant an exception or authorize immediate code integration; execute only when the project's agreed sequencing or a separately recorded exception permits it.
