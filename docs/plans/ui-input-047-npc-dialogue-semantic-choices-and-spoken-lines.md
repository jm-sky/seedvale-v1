# Plan: NPC dialogue semantic choices and spoken lines

**Created:** 2026-10-30
**Status:** `verification needed` 🔍
**Type:** polish
**Priority:** high · **Effort:** L
**Depends on:** -
**Domain:** `ui-input`
**Subdomains:** `menus` `interaction` `feedback`
**Tags:** `ui` `audio` `npc-dialogue`
**Model:** Sonnet, Composer

## Goal

Improve V1 NPC conversations: an opening spoken greeting visible in history, and a consistent distinction between navigation/parameters and genuine speech across **all** dialogue choices, including quest actions and expedition invitations. Preserve V1's existing dialogue, quest, voice, social and NPC simulation owners and V1 dialogue-window presentation.

Implementation handoff: [implementation notes](./implementation-notes/ui-input-047-npc-dialogue-semantic-choices-and-spoken-lines-implementation-notes.md).

Review baseline: `5c21bad4f47f865144dddadee40821140eb2ac69` (2026-10-30). Source inspection only; no runtime or listening PASS.

## Verified current state

- `src/ui-vue/NpcDialogueMenu.vue` owns the session history, groups/topics, `MenuChoice.say`, and `onChoose`. On open it clears messages but does not append a greeting. `say: true` logs the literal option label as Player speech even for actions/parameters.
- `src/ui-vue/store.ts::openNpcDialogueMenu` stops a reaction bark and plays `resolveNpcVoiceLine(npc, 'greeting')`, but no text greeting is passed to history. `resolveNpcDialogueOpenTopic` reserves automatic opening for payment and NPC-initiated joining; quests do not auto-open.
- `src/ui-vue/components/DialogueWindow.vue` is a pure display of `DialogueMessage[]` and `DialogueChoice[]`.
- Voluntary expedition invitation uses `openProposeJoin()` → duration (0.5, 1, 2, 3 days) → `state.onProposeJoin(days)` → NPC response. Both the topic and duration choices currently have `say: true`.
- `src/ai/dialogueTemplates.ts` owns data-only Polish wording helpers, including `voluntaryJoinResponseLine`; some other template choices use `Math.random()`. NPC willingness/commitment is owned by `voluntaryExpeditionJoin.ts` / `NpcAgent`, not UI.
- Related implemented/archived plans (archive placement is not manual acceptance): `ui-input-024`, `ui-input-036`, `npc-031`, `quests-progression-014`. Respect the Revival Strategic Brief's V1 dialogue ownership and D4 integration policy.

## Requirements

### A. Opening greeting

Show exactly one NPC greeting per explicit open. Resolve one presentation payload in the store, then let the menu append that snapshot; never independently select text and audio. Keep Polish UI: existing recordings are English semantic cues, so a paired greeting uses an authored faithful Polish translation of the selected clip's catalog transcript, not an unrelated personality quote or a claim that the recording is Polish. Reuse only active V1 manifest URLs. A missing/unverified transcript or incompatible context yields an authored text-only fallback; do not silence all existing greetings because their language differs.

Use actual personality, personal relation and time-of-day inputs available at open; do not infer reputation from profession or invent social state. Context-specific recordings must be eligible (e.g. “Morning” must not play at night); neutral fallback requires no new simulation query. Do not import donor recordings or expand the voice catalogue. For special opens, append greeting first, then exactly one existing payment/join prompt; retain payment > join proposal > root priority. Stop the reaction bark before at most one greeting playback, including on text-only opens. Opening/previewing must not admit offers, advance quests, stamp journals or consume pending follow-ups.

### B. Semantic dialogue choices

Replace the ambiguous `say` echo behavior with explicit choice semantics: **navigation**, **parameter**, **Player speech**, or **action/feedback**. Control kind and optional committed utterance are separate dimensions: a parameter commit may produce a full spoken invitation. Keep display labels separate from actual history utterances. A click adds a Player message only when the Player genuinely says something. Never echo category names, quest titles, duration values, back/cancel, trade screens, orders, gifts, or other control labels as speech.

Audit all root/group/topic choices, quest shortcuts and authored quest responses, help, food/water, wage, pending NPC join proposals, and goodbye. Preserve current callbacks, quest priority, keyboard choices and navigation. Reuse `QuestDialogAction.label` unchanged as authored speech: `QuestManager` already projects `playerLine`, `reportPlayerLine` and its defaults into this field. `QuestDialogOverride` and `QuestDialogTopic` have no `playerLine` field; Vue must not inspect quest definitions or infer semantics from label wording. Use explicit natural utterances for ordinary requests and meaningful accept/refuse responses; keep action labels separate. A spoken request is intent, not proof of success (especially payment and quest acceptance). Preserve current immediate close after offer acceptance/decline; no extra confirmation screen or delayed close just to display a line.

Respect optional `offer.onDecline`: expose spoken refusal only when this callback exists. For a story offer without it, offer a silent exit/back, not “Odmów” falsely suggesting rejection. Keep existing close semantics: ordinary close can decline an exposed offer, while trade transition uses `decline: false`. This is a presentation correction, not a new offer policy. All existing quest routing, callbacks, outcomes, cooldowns and journal writes remain domain-owned.

### C. Expedition invitation

Opening `Zaproponuj udział w wyprawie` and selecting duration are navigation/parameter operations. Committing a duration appends **one** complete natural Player sentence asking the NPC to join for the chosen duration and then invokes the existing `onProposeJoin(days)` **exactly once**. Support all four current durations (half day, one, two, three days) with correct Polish inflection and multiple authored variants. Vary tone without changing the terms. No separate confirmation step; backing out commits nothing. Preserve all willingness, provisioning, accompaniment and refusal mechanics. The duration is a proposal used by existing evaluation; do not promise automatic timed dismissal or add it here. Current acceptance calls `startAccompany({ kind: 'voluntary' }, 'follow')` without storing the proposed duration in that call.

### D. History consistency and variation

Select each utterance once per committed action/open and keep it stable across Vue rerenders/watchers. Prefer context/identity-based deterministic variant selection for newly authored lines, avoiding repeated `Math.random()` calls during reactive evaluation. Make history event-driven: one committed choice/response event, not a watcher of changing response strings. Identical text from two deliberate turns is two valid messages; reevaluation of one turn is not a new message. Navigation/back must not replay already heard NPC text; entering a quest context deliberately may produce its current prompt once.

Use a store-owned monotonic session revision on every open and reset (including world invalidation), plus a menu request/turn revision for async replies. Reopening the same NPC or replacing an open NPC must reset history even if `open` never becomes observably false. Close, navigation away and a newer turn invalidate pending presentation work; a stale completion/finally must not modify the new session, its topic or busy flag. Catch rejected area requests, clear only their own pending state, and allow retry without inventing an NPC reply. Do not roll back already performed world-knowledge delivery or retry domain callbacks automatically.

Before dispatch, validate open session, current choice generation, disabled/busy state and overlay ownership. Consume a one-shot choice before its callback, preventing double clicks/key repeat from applying an action twice; permit a fresh deliberate attempt after returning through navigation. Do not replay closed-session callbacks or let numeric keys activate dialogue underneath a gift/order overlay. Conversation log remains ephemeral UI state, not persisted social memory. Greeting pairing is the bounded new audio contract; existing quest/farewell cues remain semantic cues, not exact subtitles. Do not add voice playback for every NPC history message or duplicate the QuestManager completion voice hook. No new recordings are required.

## Non-goals and constraints

No new dialogue engine, LLM, V3 dialogue runtime, NPC recruitment logic, quest state, relationship model, persistent transcript, save migration, voice catalogue rewrite, NPC–NPC conversations or unrelated visual redesign. Do not auto-open quest help. Avoid additional scanning/ticking and unnecessary reactive recomputation. Keep existing `DialogueWindow` and V1 domain ownership.

## Delivery stages

1. Introduce session/turn identity and explicit history commits with mounted-menu regression tests; remove the response-text watcher as a history writer. Keep the shared window presentation-only.
2. Migrate all choice builders using the classification matrix in the notes; preserve live quest callbacks, offer policy and close/overlay boundaries.
3. Resolve opening greeting text/audio once in the store and add catalog-backed pairing, fallback and special-open tests.
4. Add pure duration-aware invitation phrasing and single-commit dispatch, then run the quest/help/payment/voice/overlay regression matrix.

Add concise JSDoc with `@domain ui-input` for important public helpers; keep stages reversible.

## Verification

- Normal opening has one correct greeting; opening twice resets the log; no mismatched voice/text; quest state unchanged on open.
- Category, back, quest topic labels, duration and other UI-only controls never appear as Player speech. Real Player dialogue and quest-authored lines do.
- Each of the four duration choices produces grammatical full Player speech and exactly one authoritative NPC invitation call; backing out does neither.
- Quest actions/acceptance/report, trade, assistance, payment and NPC-initiated invitations preserve domain results and keyboard access.
- Identical consecutive replies survive as distinct turns; navigating back and computed reevaluation append nothing. Test same-tick close/reopen, reopening the same NPC, open-to-open NPC replacement, world invalidation, rejected promises and out-of-order async completion.
- Mixed offer/active/report/required-action contexts retain offer-only help, quest-scoped abandon and live revalidation. Test story offers without decline, ordinary close, acceptance, and trade transition; verify actual quest progress, rewards and journal effects, not only text.
- Verify disabled controls, numeric selection, held-key repeat, double click, Escape, backdrop guard and gift/order overlays. No callback after close or from a covered dialogue.
- Reuse existing Vitest/jsdom + Vue mounting (no new test framework). Run focused suites listed in the notes and `pnpm type-check`; relevant lint/build checks follow actual implementation changes. Pure helpers alone cannot verify watcher scheduling or DOM input.
- Author browser/listening checks use seed `415424794`: ordinary/special opens, each greeting variant actually used, text-only fallback, quests, four invitation durations, cancel and rapid switching. Static inspection and mocked playback cannot establish runtime/audio PASS.

## Scheduling constraint

The Revival Strategic Brief retains a D4 Performance-First integration freeze. This documented plan does **not** grant an exception or authorize immediate code integration; execute only when the project's agreed sequencing or a separately recorded exception permits it.
