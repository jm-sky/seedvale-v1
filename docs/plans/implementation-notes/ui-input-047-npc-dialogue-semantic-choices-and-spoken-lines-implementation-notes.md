# Implementation Notes: ui-input-047 — NPC dialogue semantic choices and spoken lines

## Verified integration points (main, 2026-10-30)

- `src/ui-vue/NpcDialogueMenu.vue`: `MenuChoice extends DialogueChoice` carries `run` and optional `say`; `opt` and `onChoose` implement the current label-as-speech behavior. `rootChoices`, `groupChoices`, `topicChoices` are the complete central choice builders. `messages` with `pushMessage` is ephemeral. `watch(responseText)` appends NPC responses. The `watch(state.open)` handler clears the messages, resets menu and calls `resolveNpcDialogueOpenTopic()`.
- `src/ui-vue/components/DialogueWindow.vue`: `DialogueMessage` only has `id, speaker, text`; `DialogueChoice` only has `id, label, variant?, disabled?`. Keyboard selection emits a choice ID. Prefer keeping it presentation-only, with semantic resolution in parent.
- `src/ui-vue/store.ts::openNpcDialogueMenu`: writes `state.npc`, `npcHeading`, `timeOfDay`, `settlement`, clears `helpResult`, sets payment/join proposals and `state.open = true`, then calls `npc.stopPlayerReactionVoice()` and `playNpcVoice(npc, resolveNpcVoiceLine(npc, 'greeting'))`. Avoid double greeting selection/playback in separate store and Vue watchers; inspect the voice resolver's actual text mapping before selecting the matching displayed quote.
- `store.ts::resolveNpcDialogueOpenTopic`: returns only `payment | joinProposal | null`. Do not turn quest presence into automatic `help`. `resolveNpcDialogueHelp`, `selectNpcDialogueHelpAction`, `selectNpcDialogueHelpTopic`, `applyNpcDialogueQuestOverride` must retain QuestManager ownership.
- `NpcDialogueMenu.vue::openProposeJoin` sets topic, `proposeJoin(days)` invokes `state.onProposeJoin?.(days)` then changes to `proposeJoinResult`. `JOIN_DURATION_OPTIONS` uses 0.5, 1, 2, 3; format full correct Polish phrases using structured numeric days, not literal menu labels.
- `src/ai/dialogueTemplates.ts` provides pure topical text functions and `voluntaryJoinResponseLine(accepted, blockers)`; `src/ai/dialogue.ts` provides `nearestArchetype`. Some template pools use `Math.random()`, so never invoke them from repeatedly reevaluated computed state if stability matters.
- `src/ai/voluntaryExpeditionJoin.ts` and `NpcAgent.respondToVoluntaryJoinInvitation()` own actual decisions. `src/app/inventoryWiring.ts` wires the invitation; don't change domain decisions or introduce a recruitment path.

## Important architectural decisions

- Use a small discriminated UI choice semantic or equivalent typed contract in `NpcDialogueMenu.vue` (or adjacent pure helper). Separate button label, optional committed Player utterance, and callback. Preserve ordinary `DialogueChoice` UI interface. No generic tree engine.
- Prefer a single explicit committed event to append Player message and run an action, rather than relying on the label echo flag. Prevent duplicate call on rapid selection where necessary without blocking valid repeated conversations.
- Consider authored quest `playerLine` and action labels separately: inspect current `QuestDialogOverride` / `QuestDialogTopic` payload and quest-specific action types before migrating each `say: true`; a visually labeled topic is not necessarily a spoken line.
- Greeting text should be supplied from the same selected voice-line metadata (when possible) or exact catalog transcript. If voice API only exposes an opaque clip or is missing exact transcript, choose text-only rather than falsely pairing unrelated speech; coordinate audio ownership in `store.ts`.
- Avoid watchers generating extra NPC turns from rerenders or reentering topics; inspect `responseText` transitions and null/empty reset behavior. Async `askAboutArea()` can resolve after NPC swap/close; guard by dialogue session identity.
- New sentence pools belong near existing `dialogueTemplates.ts` (or small adjacent pure module); vary Player invitations without influencing willingness score. Avoid new stateful dialogue service.

## Tests and guardrails

- Existing: `src/ui-vue/npcDialogueOpen.test.ts`, `npcDialogueVoice.test.ts`, `src/ai/dialogueTemplates.test.ts`, `src/ai/voluntaryExpeditionJoin.test.ts`. Add targeted tests of choice semantics via extracted pure choice builder or Vue component tests, ensuring all branches are covered.
- `npcDialogueVoice.test.ts` asserts stop-reaction-before-one-greeting. Preserve this invariant while adding matching visible text.
- `DialogueWindow.vue` owns keydown 1..9 and Escape forwarding; do not regress screen/overlay handling.
- Confirm exact voice clips/catalog support before claiming audio-to-text parity. Run relevant tests plus browser walkthrough (ordinary dialogue, quest, payment, NPC-initiated join, four invitation durations, cancel, rapid switching).
- Static repo inspection only; no runtime, voice listening or performance measurement was performed in preparing these notes.

## References

- `docs/plans/archive/ui-input-024-npc-dialogue-grouping-and-quest-priority.md`
- `docs/plans/archive/ui-input-036-quest-dialogue-offer-active-context-separation.md`
- `docs/plans/archive/npc-031-voluntary-expedition-joining.md`
- `docs/research/v1-revival/STRATEGIC-BRIEF.md` (V1 dialogue ownership / D4 sequencing)
