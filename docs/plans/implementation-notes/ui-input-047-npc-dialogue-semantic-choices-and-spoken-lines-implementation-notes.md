# Implementation Notes: ui-input-047 — NPC dialogue semantic choices and spoken lines

[Source plan](../ui-input-047-npc-dialogue-semantic-choices-and-spoken-lines.md).

## Review baseline and constraints

Verified against V1 `5c21bad4f47f865144dddadee40821140eb2ac69` on 2026-10-30, including `PLANNING.md`, `PLAN-METADATA.md`, `STATE.md`, plan index and Strategic Brief. This is source review, not executed tests, listening or browser acceptance. Status stays planned; existing implemented plans are context, not unfinished dependencies. The stale generated next-ID/index entries must not cause reuse of 047; regenerate them with repository tooling when applicable, never hand-edit generated indexes.

Keep V1 conversation authority and the already agreed shared-window reskin. D4 still gates runtime integration; this documentation review grants no runtime exception. No donor dialogue engine, broad voice migration, new quest schema or persistent conversation log.

## 1. Existing ownership and concrete discrepancies

| Owner | Verified contract / consequence |
| --- | --- |
| `src/ui-vue/NpcDialogueMenu.vue` | Owns `messages`, navigation, `rootChoices/groupChoices/topicChoices`, `opt/onChoose`. `say` currently echoes labels. `watch(responseText)` appends only when the computed string changes: two intentional identical replies can disappear; navigation can replay a prompt. |
| `src/ui-vue/store.ts` | `openNpcDialogueMenu` owns NPC identity, context and greeting playback. `resetNpcDialogueMenu` is shared by close, accept and `invalidateWorldBoundUiSessions`. The current menu watches only `state.open`; an open-to-open replacement or batched close/reopen can bypass reset. |
| `src/ui-vue/components/DialogueWindow.vue` | Presentation-only `DialogueMessage { id, speaker, text }` and `DialogueChoice { id, label, variant?, disabled? }`. Speakers are only npc/player: do not mislabel system feedback as NPC speech. Its window keydown listener maps 1..9; Escape is delegated by the parent with `escCloses=false`. |
| `src/quests/QuestManager.ts` | `QuestDialogAction { label, onSelect, topicScoped? }` contains deliberate Player speech. `QuestDialogTopic { label, resolve }` is navigation. Neither topics nor overrides expose `playerLine`. |
| `src/ai/npcVoiceLines.ts` | Returns a randomly selected URL or undefined, not transcript metadata. Profile selection is deterministic; URL selection currently is not. Do not conflate these. |
| `src/app/inventoryWiring.ts` | Owns live food/water, wage, trade/order/gift, area/follow-up and expedition callbacks. UI wording must not duplicate their decisions. |

## 2. Choice migration matrix

Keep the semantic contract local to the menu or a small adjacent helper; shared `DialogueChoice` need not carry domain semantics. Model control kind and optional committed utterance separately: a duration parameter can commit speech and a callback without echoing its label. Do not make all four categories mutually exclusive in a way that prevents this.

| Current IDs / path | History and dispatch |
| --- | --- |
| `group:*`, `back`, `close` | Silent navigation/exit. No generated NPC replay on back. Retain existing close behavior. |
| `trade`, `artisan`, `giveItem` | Silent screen actions; existing callbacks own transitions. |
| `report:*`, `required:*`, `activeMatters`, `matter:*`, `helpTopic:*` | Silent navigation, never quest titles as Player speech. Deliberate entry may append its resolved NPC prompt once. Preserve root report-before-required ordering and origin/back behavior. |
| `help` | Existing full Player question, then offer-only resolution once. |
| `food`, `water`, `guardReward` | Explicit natural request, e.g. “Czy możesz dać mi coś do jedzenia?”; never “Poproś o…” as speech. Append callback response once. |
| `area`, `aboutSelf`, `currentActivity`, `aboutVillage`, `goodbye` | Labels already are utterances; explicitly classify as speech. Resolve NPC response once at selection, not in reactive evaluation. Goodbye still enters its response topic; close remains separate. |
| `proposeJoin` | Silent navigation to duration choices. |
| `days:*` | Parameter commit: one full invitation, one existing `onProposeJoin(days)`, one returned reply. Back does none of these. |
| `pay`, `defer` | Separate natural intent/defer wording from controls. Payment utterance must not assert success; callback can report insufficient funds/stale claim. Deferral only resets menu, not the wage claim. |
| `joinAccept`, `joinDecline` | Natural Player acceptance/refusal instead of “Weź go ze sobą”; existing fresh domain evaluation determines result. |
| `accept`, `decline` (quest offer) | Explicit Player speech before existing close-producing callback. Only expose refusal when `onDecline` exists; otherwise silent leave/back. No delayed close or fabricated NPC acceptance reply. |
| `action:*` | Use exact `QuestDialogAction.label` as Player speech and existing `onSelect` once; never rewrite authored branches from quest titles or inspect definitions in Vue. |

### Quest boundaries

- `resolveNpcDialogueHelp` uses `resolveNpcQuestOffers`, not generic `onInteract`. Only deliberate help entry admits offers. `getNpcDialogueQuestPreview` remains read-only.
- Active picker includes active/required-action/report; shortcuts and `selectNpcDialogueHelpTopic` resolve live on selection. A navigation classification means no Player utterance, **not** that the existing resolver is side-effect-free: quest context resolution can stamp journals or reconcile knowledge/state. Do not move it into computed builders or call it a second time for history.
- `collectGiverActions`, `resolveTalkToNpc`, `resolveTalkToNpcChoice`, `resolveReceiveWorldKnowledge`, `reportOverride`, `resolveStageDialogueActions` already project authored Player lines into action labels. `abandonDialogAction` is spoken and topic-scoped; `alreadyRepairedGatherAction` is spoken too. Preserve these, conditional reactions, exact-item branches, cooldowns, physical outcomes and live validation.
- Capture the current action's utterance before `selectNpcDialogueHelpAction` replaces `helpResult`. Capture the returned/current NPC line after the single callback without resolving the quest again.
- `acceptNpcDialogueOffer` invokes onAccept, plays quest_accepted and resets; ordinary close invokes optional onDecline and plays quest_declined/farewell. `openMerchantFromDialogue` closes with decline:false. Do not turn Back into decline or gift/order opening into quest rejection.
- The ephemeral message log never writes `QuestJournalEvent` or replaces `QuestManager`'s persistent heard-line journal. Opening greeting and preview must leave journal/progress/rewards unchanged.

## 3. Greeting text/audio boundary

Reuse `resolveNpcVoiceLine` and its NPC-specific → role/age → general fallback. Add a small greeting-only presentation resolver/payload (proposed name is not an existing API), owned by store opening, carrying resolved text and optional URL. Resolve a URL once, look up its transcript once, validate context, and use that exact pair; never call the random resolver again for playback.

Canonical source: `docs/dialogue/NPC-VOICE-CATALOG.md`. It explicitly describes Polish UI and English semantic audio. Active manifest greeting coverage at the reviewed pin:

| Active URL filename(s) | Catalog evidence |
| --- | --- |
| general_male_greeting_01 / general_female_greeting_01 | Transcript available |
| guard_male_greeting_01 / _02 | Both available; _02 starts “Morning” |
| hunter_male_greeting_01 / _02 | Both available; _01 starts “Morning” |
| merchant_female_greeting_01 / _02 / _03 | Only _01 and _02 have entries; _03 has no verified transcript in this catalog |

All filenames above use .mp3 under `/sounds/voices/`. Additional age/shepherd files on disk are not registered in the current manifest; presence on disk is not permission to expand runtime coverage.

Use a bounded static greeting transcript/Polish-translation mapping, not Markdown parsing at runtime. No donor transcript may be assumed to match a same-named V1 asset. Missing _03 evidence → text-only fallback, not a guessed translation. Use source transcription as provisional evidence and require listening acceptance; no listening was performed here. Context-incompatible selections also fall back without arbitrary resampling loops. Do not modify other semantic intent pools.

Available context is `npc.personality`, `npc.id`, `timeOfDay` and `questManager.getRelation/getRelationLevel(npc.id)` at open. Personal relation is not settlement reputation. New fallback/invitation variation can use a stable hash of identity, intent, context and ephemeral turn ordinal; no simulation RNG or persisted counter. Select once and store the result. Personality variation must not alter a recorded transcript's meaning.

Populate greeting/session state coherently before exposing the open event. Stop reaction voice on every open; then play at most one paired URL through the existing `playNpcVoice` → `playNpcVoiceAt` path. No clip or unconfigured audio must still display text. Special openings append greeting then payment/join prompt; payment wins when both exist. Follow-up presence does not auto-consume area knowledge.

Existing quest/farewell audio remains semantic. In particular, `selectNpcDialogueHelpAction` intentionally does not play confirmation; `QuestManager.applyOutcome` owns the injected quest_complete voice hook. Do not play audio from a generic history watcher. Preserve close/accept voice intent ownership.

## 4. Session, turn and async ownership

Introduce a monotonic UI session revision in the existing store, advanced by every explicit open and every reset, including world rebuild/dispose. Watch that revision with immediate initialization so mounting into an already-open session works. Key session validity by revision, not NPC ID alone: reopening the same NPC and rebuilding a runtime actor are new sessions.

The menu owns turn/request revisions and pending UI state. Remove `watch(responseText)` as an append mechanism. Append from explicit opening/selection results, snapshotting `aboutSelfLine/aboutVillageLine/currentActivityLine/goodbyeLine` only when entered. Existing template helpers are data-only but `goodbyeLine` is random; do not call it from history-producing computed state.

`askAboutArea` currently awaits a string-or-Promise callback and has neither a stale-result guard nor catch. Capture NPC, callback, session and turn before dispatch. Invalidate the presentation token on close, navigation away and newer turns. Both resolution and finally must check ownership before writing topic/area text/pending state. Reset pending state for the new session independently; old completion must not unlock a new request. Rejection produces no invented NPC speech or unhandled promise; allow deliberate retry.

The current inventory wiring normally returns a string, but the public async contract still needs deferred-promise tests. `onAskAboutArea` already shares `deliverNpcWorldKnowledgeFollowUp` with pending guard/hunter knowledge: stale UI suppression must not repeat or undo that authoritative delivery.

Validate session/open state and overlay top before appending Player speech or invoking any callback. Reuse `ui.openStack` / `useOverlayScreen`; prevent numeric-key activation of underlying dialogue when gift/order screens cover it. Consume a current choice-generation token synchronously for one-shot actions; ignore held-key repeats. Do not globally deduplicate by message text, callback identity, or NPC ID. A new deliberate question/invitation after navigation is valid.

Immediate-close paths may hide their just-committed Player line; preserve this existing close UX instead of keeping the screen alive. Do not append late NPC messages after reset.

## 5. Expedition constraints

`JOIN_DURATION_OPTIONS` is 0.5, 1, 2, 3. Pure authored invitation variants use “na pół dnia”, “na jeden dzień”, “na dwa dni”, “na trzy dni”. Never add promises about reward, danger, provisions or willingness.

`inventoryWiring.onProposeJoin` builds `{ completionPolicy: 'duration', durationDays }`, calls `NpcAgent.respondToVoluntaryJoinInvitation` with current time, then formats `voluntaryJoinResponseLine`. Both invitation and NPC proposal use the existing evaluator. Acceptance starts `startAccompany({ kind: 'voluntary' }, 'follow')`; the reviewed call does not transfer the duration to the commitment. Phrase the duration as the requested outing, not a verified automatic return timer. Changing accompaniment lifecycle is outside this plan.

`onRespondToJoinProposal` clears the presentation proposal and delegates fresh accept/refuse evaluation; refusal and stale-proposal replies are not equivalent. Wording changes must not change score, blockers, initiative cooldown, work contracts, supplies or persistence.

## 6. Verification handoff

Use existing Vitest/jsdom + Vue `createApp/h/nextTick` mounting, as in `src/ui-vue/screens/InventoryScreen.test.ts`; no new framework. Add mounted `NpcDialogueMenu` tests, not only pure classification snapshots.

- Existing suites: `src/ui-vue/npcDialogueOpen.test.ts`, `npcDialogueVoice.test.ts`, `npcDialogueTrade.test.ts`, `worldBoundUiSessions.test.ts`; `src/ai/dialogueTemplates.test.ts`, `npcVoiceLines.test.ts`, `voluntaryExpeditionJoin.test.ts`; relevant `src/quests/QuestManager.test.ts` cases.
- Important test gap: the quest turn-in test in `npcDialogueVoice.test.ts` has its playQuestVoice/playAt assertions commented out with TODO. Its passing title is not evidence of one completion cue. Restore meaningful assertions for the actual completion path during implementation.
- Mounted tests must cover every matrix row, identical replies on different turns, no replay on Back, special-open ordering, already-open mount, same-tick reopen, NPC replacement, world reset, rapid click/key repeat and covered overlays.
- Deferred promises: close/reopen same NPC, switch NPC, navigate away, second request resolves first, stale finally, rejection and retry. Assert message order, topic and busy state as well as callback counts.
- Quest integration: offer-only admission, mixed contexts, required talk/choice, gather/report rewards exactly once, topic-scoped abandon, story offer without decline, accept/close/trade voice behavior and persistent journal invariants.
- Greeting tests: each registered paired URL uses its own translation; unknown transcript/missing URL/context mismatch is text-only; stop-before-play and at most one clip; muted/unconfigured playback does not remove text.
- Expedition: all four exact numeric arguments, full grammatical Player line followed by actual reply, refusal/stale NPC proposal, repeated-input suppression and no callback on Back.
- Run focused tests and `pnpm type-check`; add relevant lint/build checks for changed implementation files. Manual audio/visual/interaction acceptance belongs to the author (seed `415424794`), never infer it from mocks.

## References

- [Planning rules](../PLANNING.md)
- [Strategic Brief](../../research/v1-revival/STRATEGIC-BRIEF.md)
- [Grouping and quest priority](../archive/ui-input-024-npc-dialogue-grouping-and-quest-priority.md)
- [Offer / active context separation](../archive/ui-input-036-quest-dialogue-offer-active-context-separation.md)
- [Voice catalog](../../dialogue/NPC-VOICE-CATALOG.md)
