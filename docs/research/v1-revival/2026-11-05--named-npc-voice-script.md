# Named NPC Fish Audio script — English

**2026-11-05 · draft for author review · source `2722c78ab6d79b3312d78877f9b96140fd97ddb1`**

[Audit and budget](./2026-11-05--named-npc-voice-audit.md) · [Machine-readable JSON](./2026-11-05--named-npc-voice-script.json) · [Reuse and QC blockers](./2026-11-05--named-npc-voice-reuse-qc.md)

This is a writing packet, not an approved generation order. **89 new draft texts**, **25 distinct existing MP3 candidates across 27 placements**, and **10 references to already approved Q90 takes**. Do not sum reference rows as new recordings. No casting or QC verdict is changed.

- Exactly one author-selected speaker per NPC. Null voice_uuid means casting hold; candidate_voice_uuid is never a generation target.
- Only new-draft rows contain generation_input. Reuse rows require listening QC; Q90 references use the existing Q90 generation order, not a second job.
- Canonical transcript for new drafts means proposed exact words, not an approved or recorded transcript. Reuse catalog transcripts remain unconfirmed until listening.
- One variant per situation is the minimum (within requested 1–3); Mark has an optional second greeting. Rain/storm/snow alternatives are optional; neutral shelter is sufficient.
- Hungry/exhausted cover their real need/pause events. There is no separate general work-interrupted recording.
- No ordinary family/resource/activity answers. No generic material-reward claim.
- After selecting an uncast NPC's speaker, suppress drafts covered by same-speaker QC-passed audio or approved Q90. Never borrow another speaker.

## Trigger contracts

| Intent | State | Trigger and truth constraint |
| --- | --- | --- |
| `greeting` | existing-event | src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity. |
| `farewell` | existing-event | src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close. |
| `attention` | existing-event | src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction. |
| `thanks` | binding-needed | Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action. |
| `refusal` | binding-needed | Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request. |
| `confirmation` | binding-needed | Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent. |
| `quest_offer` | binding-needed | Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver. |
| `quest_accepted` | existing-event | src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success. |
| `quest_declined` | existing-event | src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell. |
| `quest_complete` | existing-event | src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim. |
| `hungry` | existing-event | src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption. |
| `exhausted` | existing-event | src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day. |
| `weather_shelter` | existing-event | src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents. |
| `weather_shelter_rain` | existing-event | beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim. |
| `weather_shelter_storm` | existing-event | beginSeekShelter with current weather storm only. No inferred damage/lightning strike. |
| `weather_shelter_snow` | existing-event | beginSeekShelter with current weather snow only. Never rain fallback. |
| `danger_alert` | existing-event | NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim. |
| `combat_start` | existing-event | NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon. |
| `work_finished` | existing-event | NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim. |
| `guard_response` | existing-event | NpcAgent successful guard threat intervention; not mere profession or greeting. |
| `livestock_danger` | existing-event | NpcAgent flockThreatApplied with household at new threat episode. npcBarkRequest can reuse same-speaker danger_alert. |
| `trade_open` | binding-needed | NpcDialogueMenu.vue:openTrade -> onOpenTrade is a real action, without specific voice hook. Require successful opening for this trader; no stock promise. |
| `trade_close` | binding-needed | Trade-close-specific NPC voice hook not verified. Close with or without purchase; never imply a completed sale. |
| `reward_ack` | binding-needed | Quest-complete voice receives only giverNpcId and intent, no quest/outcome/reward receipt. Add exact binding only after actual reward grant success; never generic quest_complete. |
| `story` | binding-needed | Existing authored quest text surface, but no quest/stage-specific audio selector. Require exact quest, speaker and stage/outcome. |

## Marek (Mark) Hornblower

Runtime key: `marek_hornblower`. Role: guard.

Fish UUID: `2adcdee4b3ce4b648dc16ea65430ea76` — approved. approved.

Direction: Grounded, observant, restrained warmth; brief and firm under threat. No theatrical guard swagger.

### NV-001 — greeting · P0

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Additional conditions:** Daytime greeting; add neutral optional variant for other times.
- **Canonical transcript (QC candidate):** Good day. Is there anything I can help with?
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `npc_mark_hornblower_greeting_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/npc_mark_hornblower_greeting_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88.

### NV-002 — farewell · P0

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close.
- **Additional conditions:** Listen to resolve will you / will ya; do not silently rewrite canonical audio.
- **Canonical transcript (QC candidate):** Look after yourself, will you? I'll see you around.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `npc_mark_hornblower_farewell_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/npc_mark_hornblower_farewell_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88.

### NV-003 — thanks · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Canonical transcript (QC candidate):** I appreciate that. It means a good deal.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `npc_mark_hornblower_thanks_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/npc_mark_hornblower_thanks_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; binding-needed.

### NV-004 — danger_alert · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim.
- **Canonical transcript (QC candidate):** Back! Get clear of it!
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `npc_mark_hornblower_danger_alert_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/npc_mark_hornblower_danger_alert_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88.

### NV-005 — attention · P0

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction.
- **Canonical transcript:** A moment. What is it?
- **Generation input:** A moment. What is it?
- **Filename:** `nv1_marek_hornblower_attention_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-006 — quest_accepted · P0

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success.
- **Canonical transcript:** Good. Thank you for lending a hand.
- **Generation input:** Good. Thank you for lending a hand.
- **Filename:** `nv1_marek_hornblower_quest_accepted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-007 — quest_declined · P0

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell.
- **Canonical transcript:** All right. I won't press you.
- **Generation input:** All right. I won't press you.
- **Filename:** `nv1_marek_hornblower_quest_declined_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-008 — quest_complete · P0

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim.
- **Canonical transcript:** You've helped. Thank you.
- **Generation input:** You've helped. Thank you.
- **Filename:** `nv1_marek_hornblower_quest_complete_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-009 — hungry · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption.
- **Canonical transcript:** I'd better find a bite to eat.
- **Generation input:** I'd better find a bite to eat.
- **Filename:** `nv1_marek_hornblower_hungry_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-010 — exhausted · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day.
- **Canonical transcript:** I need a breather.
- **Generation input:** I need a breather.
- **Filename:** `nv1_marek_hornblower_exhausted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-011 — weather_shelter · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents.
- **Canonical transcript:** I'll get under cover.
- **Generation input:** I'll get under cover.
- **Filename:** `nv1_marek_hornblower_weather_shelter_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-012 — combat_start · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon.
- **Canonical transcript:** Back off. I mean it.
- **Generation input:** Back off. I mean it.
- **Filename:** `nv1_marek_hornblower_combat_start_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-013 — work_finished · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim.
- **Canonical transcript:** That's one thing seen to.
- **Generation input:** That's one thing seen to.
- **Filename:** `nv1_marek_hornblower_work_finished_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-014 — guard_response · P1

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent successful guard threat intervention; not mere profession or greeting.
- **Canonical transcript:** Stand clear. I'll handle this.
- **Generation input:** Stand clear. I'll handle this.
- **Filename:** `nv1_marek_hornblower_guard_response_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-015 — refusal · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request.
- **Canonical transcript:** No. I can't agree to that.
- **Generation input:** No. I can't agree to that.
- **Filename:** `nv1_marek_hornblower_refusal_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; binding-needed.

### NV-016 — confirmation · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent.
- **Canonical transcript:** Right. We understand each other.
- **Generation input:** Right. We understand each other.
- **Filename:** `nv1_marek_hornblower_confirmation_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; binding-needed.

### NV-017 — quest_offer · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver.
- **Canonical transcript:** Could you give me a hand with something?
- **Generation input:** Could you give me a hand with something?
- **Filename:** `nv1_marek_hornblower_quest_offer_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; binding-needed.

### NV-018 — greeting · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Canonical transcript:** Hello. I'm listening.
- **Generation input:** Hello. I'm listening.
- **Filename:** `nv1_marek_hornblower_greeting_02.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-019 — weather_shelter_rain · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim.
- **Canonical transcript:** I'll get out of this rain.
- **Generation input:** I'll get out of this rain.
- **Filename:** `nv1_marek_hornblower_weather_shelter_rain_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-020 — weather_shelter_storm · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather storm only. No inferred damage/lightning strike.
- **Canonical transcript:** I'm taking shelter from this storm.
- **Generation input:** I'm taking shelter from this storm.
- **Filename:** `nv1_marek_hornblower_weather_shelter_storm_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-021 — weather_shelter_snow · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather snow only. Never rain fallback.
- **Canonical transcript:** I'll find cover from the snow.
- **Generation input:** I'll find cover from the snow.
- **Filename:** `nv1_marek_hornblower_weather_shelter_snow_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC.

### NV-121 — reward_ack · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Quest-complete voice receives only giverNpcId and intent, no quest/outcome/reward receipt. Add exact binding only after actual reward grant success; never generic quest_complete.
- **Quest:** `woda-dla-marka`; outcome `delivered`.
- **Additional conditions:** Only after actual 5-coin reward grant succeeds. Existing interact_well objective, not water-item delivery. Binding-needed: current generic callback cannot enforce this.
- **Canonical transcript:** Here. Something for your trouble.
- **Generation input:** Here. Something for your trouble.
- **Filename:** `nv1_marek_hornblower_reward_ack_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; binding-needed.

### NV-126 — story · P2

- **NPC / voice:** Marek (Mark) Hornblower / 2adcdee4b3ce4b648dc16ea65430ea76.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Existing authored quest text surface, but no quest/stage-specific audio selector. Require exact quest, speaker and stage/outcome.
- **Quest:** `woda-dla-marka`; stage `offer`.
- **Additional conditions:** Only actual available authored offer. Preserve interact_well; no carried bucket requirement, water purity or extra objective.
- **Canonical transcript:** Could you draw some water at the well for me?
- **Generation input:** Could you draw some water at the well for me?
- **Filename:** `nv1_marek_hornblower_story_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; binding-needed.

## Kasia (Kate) Hornblower

Runtime key: `kasia_hornblower`. Role: trader.

Fish UUID: **CASTING HOLD**; candidate only `d4f161bee1934b47ad3090f05649270c`. sample-fit-approved; final named assignment and source confirmation hold.

Direction: Warm, perceptive, conversational and fair-minded. No automatic stock, discount or location promises.

### NV-022 — greeting · P0

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Canonical transcript (QC candidate):** Welcome, traveler. Looking for something useful today?
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_greeting_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_greeting_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold.

### NV-023 — farewell · P0

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close.
- **Canonical transcript (QC candidate):** Safe travels. Come back if you need anything.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_farewell_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_farewell_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold.

### NV-024 — attention · P0

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction.
- **Canonical transcript (QC candidate):** Traveler! A moment, if you please.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_attention_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_attention_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold.

### NV-025 — quest_accepted · P0

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success.
- **Additional conditions:** Use only a task requiring return to this giver, e.g. shells-dla-kasi. Not an unrestricted generic cue.
- **Canonical transcript (QC candidate):** Excellent. Come back when it's done.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_quest_accepted_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_quest_accepted_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold.

### NV-026 — quest_declined · P0

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell.
- **Canonical transcript (QC candidate):** A pity. I suppose I'll have to ask someone else.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_quest_declined_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_quest_declined_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold.

### NV-027 — hungry · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-047); **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption.
- **Additional conditions:** Existing selected food need after a different need; not a claim of fasting or food availability.
- **Canonical transcript:** I should find something to eat before I carry on.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_hungry_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-028 — exhausted · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-048); **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day.
- **Additional conditions:** Existing exhaustion transition in NpcAgent; no claim about hours worked or distance travelled.
- **Canonical transcript:** I need to rest a moment before I go on.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_exhausted_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-029 — weather_shelter · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-049); **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents.
- **Additional conditions:** Existing beginSeekShelter entry; any admitted rain/storm/snow; no arrival, intensity or forecast claim.
- **Canonical transcript:** This can wait. I'm getting out of the weather.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_weather_shelter_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-030 — danger_alert · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-050); **binding:** existing-event.
- **Trigger:** NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim.
- **Additional conditions:** Existing newly perceived animal-threat episode; species-neutral, no joke.
- **Canonical transcript:** Keep away! There is danger here!
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_danger_alert_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-031 — combat_start · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-051); **binding:** existing-event.
- **Trigger:** NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon.
- **Additional conditions:** Existing successful beginCombat; not mere threat perception or player dialogue.
- **Canonical transcript:** Stay back! Do not come closer!
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_combat_start_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-032 — work_finished · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-052); **binding:** existing-event.
- **Trigger:** NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim.
- **Additional conditions:** Existing terminal action classified as schedule work; one completed task, not end of shift/day.
- **Canonical transcript:** There. That is taken care of.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_work_finished_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-033 — quest_complete · P1

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-054); **binding:** existing-event.
- **Trigger:** src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim.
- **Additional conditions:** Existing quest completion voice callback for this loaded NPC; generic reaction, never reward/objective narration.
- **Canonical transcript:** Thank you. I appreciate what you have done.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_merchant_female_quest_complete_01.mp3`.
- **Holds:** casting-hold; source-identity-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-034 — refusal · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request.
- **Canonical transcript (QC candidate):** I'm afraid I can't agree to that.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_refusal_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_refusal_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold; binding-needed.

### NV-035 — confirmation · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent.
- **Additional conditions:** Only actual agreed trade terms; 'deal' must not imply transaction completed.
- **Canonical transcript (QC candidate):** Alright. We have a deal.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_agree_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_agree_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold; binding-needed.

### NV-036 — quest_offer · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver.
- **Canonical transcript (QC candidate):** There's something I need taken care of. Interested?
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_quest_offer_02.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_quest_offer_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold; binding-needed.

### NV-037 — trade_open · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** NpcDialogueMenu.vue:openTrade -> onOpenTrade is a real action, without specific voice hook. Require successful opening for this trader; no stock promise.
- **Canonical transcript (QC candidate):** Ah, a customer. Come, take a look.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_greeting_02.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_greeting_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold; binding-needed.

### NV-038 — trade_close · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Trade-close-specific NPC voice hook not verified. Close with or without purchase; never imply a completed sale.
- **Canonical transcript (QC candidate):** Safe travels. Come back if you need anything.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_farewell_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_farewell_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold; binding-needed.

### NV-039 — thanks · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Additional conditions:** After actual successful trade only. Not generic quest thanks.
- **Canonical transcript (QC candidate):** Thank you. Always a pleasure doing business.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `merchant_female_thanks_01.mp3`.
- **Existing asset:** `public/sounds/voices/merchant_female_thanks_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; source-identity-hold; casting-hold; binding-needed.

### NV-040 — thanks · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Additional conditions:** Non-trade helpful act only; existing trade thanks remains preferred for transactions.
- **Canonical transcript:** That's kind of you. Thank you.
- **Generation input:** That's kind of you. Thank you.
- **Filename:** `nv1_kasia_hornblower_thanks_02.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; source-identity-hold; binding-needed.

### NV-041 — weather_shelter_rain · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim.
- **Canonical transcript:** I'll find somewhere out of the rain.
- **Generation input:** I'll find somewhere out of the rain.
- **Filename:** `nv1_kasia_hornblower_weather_shelter_rain_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; source-identity-hold.

### NV-042 — weather_shelter_storm · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather storm only. No inferred damage/lightning strike.
- **Canonical transcript:** This storm calls for a roof over my head.
- **Generation input:** This storm calls for a roof over my head.
- **Filename:** `nv1_kasia_hornblower_weather_shelter_storm_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; source-identity-hold.

### NV-043 — weather_shelter_snow · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather snow only. Never rain fallback.
- **Canonical transcript:** I'm getting out of this snow.
- **Generation input:** I'm getting out of this snow.
- **Filename:** `nv1_kasia_hornblower_weather_shelter_snow_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; source-identity-hold.

### NV-124 — story · P2

- **NPC / voice:** Kasia (Kate) Hornblower / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Existing authored quest text surface, but no quest/stage-specific audio selector. Require exact quest, speaker and stage/outcome.
- **Quest:** `shells-dla-kasi`; outcome `delivered`.
- **Additional conditions:** Kasia's completed shell delivery only; future intended decoration, not already placed. No coins.
- **Canonical transcript:** These will look lovely by the doorstep.
- **Generation input:** These will look lovely by the doorstep.
- **Filename:** `nv1_kasia_hornblower_story_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; source-identity-hold; binding-needed.

## Anna (Woodward editorial alias)

Runtime key: `anna_lesniewska`. Role: farmer.

Fish UUID: **CASTING HOLD**; no named assignment. unassigned.

Direction: Energetic, sociable, practical and community-minded; no scolding-wife caricature.

### NV-044 — greeting · P0

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Canonical transcript:** Hello! What can I do for you?
- **Generation input:** Hello! What can I do for you?
- **Filename:** `nv1_anna_lesniewska_greeting_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-045 — farewell · P0

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close.
- **Canonical transcript:** Take care of yourself. We'll talk another time.
- **Generation input:** Take care of yourself. We'll talk another time.
- **Filename:** `nv1_anna_lesniewska_farewell_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-046 — attention · P0

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction.
- **Canonical transcript:** Hello there! Have you a moment?
- **Generation input:** Hello there! Have you a moment?
- **Filename:** `nv1_anna_lesniewska_attention_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-047 — thanks · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Canonical transcript:** That was thoughtful of you.
- **Generation input:** That was thoughtful of you.
- **Filename:** `nv1_anna_lesniewska_thanks_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-048 — refusal · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request.
- **Canonical transcript:** I can't take that on just now.
- **Generation input:** I can't take that on just now.
- **Filename:** `nv1_anna_lesniewska_refusal_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-049 — confirmation · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent.
- **Canonical transcript:** Yes, that sounds sensible.
- **Generation input:** Yes, that sounds sensible.
- **Filename:** `nv1_anna_lesniewska_confirmation_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-050 — quest_offer · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver.
- **Canonical transcript:** There's something I'd be glad of your help with.
- **Generation input:** There's something I'd be glad of your help with.
- **Filename:** `nv1_anna_lesniewska_quest_offer_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-051 — quest_accepted · P0

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success.
- **Canonical transcript:** I'm grateful you're willing to help.
- **Generation input:** I'm grateful you're willing to help.
- **Filename:** `nv1_anna_lesniewska_quest_accepted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-052 — quest_declined · P0

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell.
- **Canonical transcript:** All right. Thank you for hearing me out.
- **Generation input:** All right. Thank you for hearing me out.
- **Filename:** `nv1_anna_lesniewska_quest_declined_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-053 — quest_complete · P0

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim.
- **Canonical transcript:** Thank you for your help with this.
- **Generation input:** Thank you for your help with this.
- **Filename:** `nv1_anna_lesniewska_quest_complete_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-054 — hungry · P1

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption.
- **Canonical transcript:** I need a bite before I do anything else.
- **Generation input:** I need a bite before I do anything else.
- **Filename:** `nv1_anna_lesniewska_hungry_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-055 — exhausted · P1

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day.
- **Canonical transcript:** A little rest. I can't keep pushing.
- **Generation input:** A little rest. I can't keep pushing.
- **Filename:** `nv1_anna_lesniewska_exhausted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-056 — weather_shelter · P1

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents.
- **Canonical transcript:** I'll get indoors for a bit.
- **Generation input:** I'll get indoors for a bit.
- **Filename:** `nv1_anna_lesniewska_weather_shelter_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-057 — danger_alert · P1

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim.
- **Canonical transcript:** Careful! Move away from it!
- **Generation input:** Careful! Move away from it!
- **Filename:** `nv1_anna_lesniewska_danger_alert_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-058 — combat_start · P1

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon.
- **Canonical transcript:** Don't come any closer!
- **Generation input:** Don't come any closer!
- **Filename:** `nv1_anna_lesniewska_combat_start_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-059 — work_finished · P1

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim.
- **Canonical transcript:** There. One less thing to see to.
- **Generation input:** There. One less thing to see to.
- **Filename:** `nv1_anna_lesniewska_work_finished_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-060 — weather_shelter_rain · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim.
- **Canonical transcript:** Time to get out of the rain.
- **Generation input:** Time to get out of the rain.
- **Filename:** `nv1_anna_lesniewska_weather_shelter_rain_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-061 — weather_shelter_storm · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather storm only. No inferred damage/lightning strike.
- **Canonical transcript:** I'm going under cover until this storm passes.
- **Generation input:** I'm going under cover until this storm passes.
- **Filename:** `nv1_anna_lesniewska_weather_shelter_storm_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-062 — weather_shelter_snow · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather snow only. Never rain fallback.
- **Canonical transcript:** I'm heading in, out of the snow.
- **Generation input:** I'm heading in, out of the snow.
- **Filename:** `nv1_anna_lesniewska_weather_shelter_snow_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-123 — story · P2

- **NPC / voice:** Anna (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Existing authored quest text surface, but no quest/stage-specific audio selector. Require exact quest, speaker and stage/outcome.
- **Quest:** `relay-anna-piotr`; outcome `delivered`.
- **Additional conditions:** Anna's successful report only; no material reward, no renewed promise about tomorrow.
- **Canonical transcript:** I'm glad the message reached him. Thank you.
- **Generation input:** I'm glad the message reached him. Thank you.
- **Filename:** `nv1_anna_lesniewska_story_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

## Piotr (Woodward editorial alias)

Runtime key: `piotr_lesniewski`. Role: woodcutter.

Fish UUID: **CASTING HOLD**; no named assignment. unassigned.

Direction: Practical, household-first, economical with words and materials; approachable, not heroic or boorish.

### NV-063 — greeting · P0

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Canonical transcript:** Hello. What do you need?
- **Generation input:** Hello. What do you need?
- **Filename:** `nv1_piotr_lesniewski_greeting_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-064 — farewell · P0

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close.
- **Canonical transcript:** Right, then. Look after yourself.
- **Generation input:** Right, then. Look after yourself.
- **Filename:** `nv1_piotr_lesniewski_farewell_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-065 — attention · P0

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction.
- **Canonical transcript:** A word, if you've a moment.
- **Generation input:** A word, if you've a moment.
- **Filename:** `nv1_piotr_lesniewski_attention_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-066 — thanks · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Canonical transcript:** I appreciate you lending a hand.
- **Generation input:** I appreciate you lending a hand.
- **Filename:** `nv1_piotr_lesniewski_thanks_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-067 — refusal · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request.
- **Canonical transcript:** No. I can't manage that.
- **Generation input:** No. I can't manage that.
- **Filename:** `nv1_piotr_lesniewski_refusal_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-068 — confirmation · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent.
- **Canonical transcript:** That should suit me.
- **Generation input:** That should suit me.
- **Filename:** `nv1_piotr_lesniewski_confirmation_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-069 — quest_offer · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver.
- **Canonical transcript:** There's a job I could use a hand with.
- **Generation input:** There's a job I could use a hand with.
- **Filename:** `nv1_piotr_lesniewski_quest_offer_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-070 — quest_accepted · P0

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success.
- **Canonical transcript:** Good. Thanks for taking it on.
- **Generation input:** Good. Thanks for taking it on.
- **Filename:** `nv1_piotr_lesniewski_quest_accepted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-071 — quest_declined · P0

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell.
- **Canonical transcript:** Fair enough. You know your own business.
- **Generation input:** Fair enough. You know your own business.
- **Filename:** `nv1_piotr_lesniewski_quest_declined_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-072 — quest_complete · P0

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim.
- **Canonical transcript:** Thank you for seeing to that.
- **Generation input:** Thank you for seeing to that.
- **Filename:** `nv1_piotr_lesniewski_quest_complete_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-073 — hungry · P1

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption.
- **Canonical transcript:** I could do with something to eat.
- **Generation input:** I could do with something to eat.
- **Filename:** `nv1_piotr_lesniewski_hungry_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-074 — exhausted · P1

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day.
- **Canonical transcript:** I need to stop and catch my breath.
- **Generation input:** I need to stop and catch my breath.
- **Filename:** `nv1_piotr_lesniewski_exhausted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-075 — weather_shelter · P1

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents.
- **Canonical transcript:** Under cover for me.
- **Generation input:** Under cover for me.
- **Filename:** `nv1_piotr_lesniewski_weather_shelter_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-076 — danger_alert · P1

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim.
- **Canonical transcript:** Mind yourself! Get clear!
- **Generation input:** Mind yourself! Get clear!
- **Filename:** `nv1_piotr_lesniewski_danger_alert_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-077 — combat_start · P1

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon.
- **Canonical transcript:** Keep back. I'm warning you.
- **Generation input:** Keep back. I'm warning you.
- **Filename:** `nv1_piotr_lesniewski_combat_start_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-078 — work_finished · P1

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim.
- **Canonical transcript:** That bit's done.
- **Generation input:** That bit's done.
- **Filename:** `nv1_piotr_lesniewski_work_finished_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-079 — weather_shelter_rain · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim.
- **Canonical transcript:** I'm finding a roof till the rain passes.
- **Generation input:** I'm finding a roof till the rain passes.
- **Filename:** `nv1_piotr_lesniewski_weather_shelter_rain_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-080 — weather_shelter_storm · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather storm only. No inferred damage/lightning strike.
- **Canonical transcript:** I'll sit this storm out under cover.
- **Generation input:** I'll sit this storm out under cover.
- **Filename:** `nv1_piotr_lesniewski_weather_shelter_storm_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-081 — weather_shelter_snow · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather snow only. Never rain fallback.
- **Canonical transcript:** Out of the snow for a while.
- **Generation input:** Out of the snow for a while.
- **Filename:** `nv1_piotr_lesniewski_weather_shelter_snow_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.
- **Reuse rule:** Casting hold: after author selects a speaker, prefer its compatible QC-passed clips and approved Q90 rows. Suppress this draft when covered; never record both merely for a named filename.

### NV-122 — reward_ack · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Quest-complete voice receives only giverNpcId and intent, no quest/outcome/reward receipt. Add exact binding only after actual reward grant success; never generic quest_complete.
- **Quest:** `drewno-na-naprawe`; outcome `delivered`.
- **Additional conditions:** Only after actual 8-coin reward succeeds. Never already_repaired; never claim fence repair was performed.
- **Canonical transcript:** Here. You've earned this for your help.
- **Generation input:** Here. You've earned this for your help.
- **Filename:** `nv1_piotr_lesniewski_reward_ack_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-125 — story · P2

- **NPC / voice:** Piotr (Woodward editorial alias) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Existing authored quest text surface, but no quest/stage-specific audio selector. Require exact quest, speaker and stage/outcome.
- **Quest:** `drewno-na-naprawe`; outcome `delivered`.
- **Additional conditions:** Successful five-branch hand-in only; does not claim completed fence repair.
- **Canonical transcript:** Those branches should do for the repair.
- **Generation input:** Those branches should do for the repair.
- **Filename:** `nv1_piotr_lesniewski_story_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

## Molly Lambert

Runtime key: `molly_lambert`. Role: shepherd.

Fish UUID: **CASTING HOLD**; candidate only `9a9cf47702da476aa4629e2506d4a857`. Hannah candidate only.

Direction: Gentle, dreamy, affectionate but capable. No childishness or cheerful celebration of a loss.

### NV-082 — greeting · P0

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Well met. What brings you this way?
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_greeting_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_greeting_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

### NV-083 — farewell · P0

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Farewell. May the road treat you kindly.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_farewell_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_farewell_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

### NV-084 — attention · P0

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Pardon me. Could I have a word?
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_attention_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_attention_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

### NV-085 — exhausted · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** I'm worn out. I have to rest.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_exhausted_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_exhausted_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

### NV-086 — hungry · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** I need food before I can keep going.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_hungry_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_hungry_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

### NV-087 — danger_alert · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Look out — something hostile!
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_danger_alert_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_danger_alert_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

### NV-088 — thanks · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** I'm grateful. Truly.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_thanks_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_thanks_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold; binding-needed.

### NV-089 — refusal · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Sorry. I can't help with that.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_refusal_01.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_refusal_01.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold; binding-needed.

### NV-090 — confirmation · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Fine by me. We'll do it that way.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_agree_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_agree_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold; binding-needed.

### NV-091 — quest_offer · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** I could use a capable pair of hands. Interested?
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_quest_offer_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_quest_offer_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold; binding-needed.

### NV-092 — quest_declined · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** binding-needed.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell.
- **Additional conditions:** Conditional on author explicitly assigning Hannah to Molly. No Lost Lamb binding implied.
- **Canonical transcript (QC candidate):** Understood. Perhaps another day.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_quest_declined_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_quest_declined_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold; binding-needed.

### NV-093 — work_finished · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-055); **binding:** existing-event.
- **Trigger:** NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim.
- **Additional conditions:** Existing terminal action classified as schedule work; one completed task, not end of shift/day.
- **Canonical transcript:** There, that job is finished.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_general_female_b_work_finished_01.mp3`.
- **Holds:** casting-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-094 — weather_shelter_snow · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-076); **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather snow only. Never rain fallback.
- **Additional conditions:** Existing beginSeekShelter and current weather=snow; no thunder/flash, accumulation, soaked-clothes or visibility claim. Storm may also reuse rain; snow never may.
- **Canonical transcript:** Best find shelter from this snow.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_general_female_b_weather_shelter_snow_01.mp3`.
- **Holds:** casting-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-095 — weather_shelter_storm · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** Q90-reference-do-not-regenerate (Q90-079); **binding:** existing-event.
- **Trigger:** beginSeekShelter with current weather storm only. No inferred damage/lightning strike.
- **Additional conditions:** Existing beginSeekShelter and current weather=storm; no thunder/flash, accumulation, soaked-clothes or visibility claim. Storm may also reuse rain; snow never may.
- **Canonical transcript:** I am getting under cover from this storm.
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `q90_general_female_b_weather_shelter_storm_01.mp3`.
- **Holds:** casting-hold; speaker-safe-runtime-Q88; per-clip-QC.

### NV-096 — quest_accepted · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success.
- **Additional conditions:** No verified Molly-authored quest giver. Hold until an actual quest offered by her exists.
- **Canonical transcript:** Thank you. I'm glad you're willing to help.
- **Generation input:** Thank you. I'm glad you're willing to help.
- **Filename:** `nv1_molly_lambert_quest_accepted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-097 — quest_complete · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim.
- **Additional conditions:** No verified Molly quest callback; no assumption of Pip's return or reconciliation.
- **Canonical transcript:** Thank you for helping me with this.
- **Generation input:** Thank you for helping me with this.
- **Filename:** `nv1_molly_lambert_quest_complete_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-098 — weather_shelter · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents.
- **Additional conditions:** Hannah donors predict worsening weather; use neutral wording instead unless QC admits a safe neutral recording.
- **Canonical transcript:** I'll find a little shelter.
- **Generation input:** I'll find a little shelter.
- **Filename:** `nv1_molly_lambert_weather_shelter_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.

### NV-099 — combat_start · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon.
- **Additional conditions:** Only actual combat start, not flight; conditional Hannah donor combat lines are theatrical/weapon-dependent.
- **Canonical transcript:** Stay away from me!
- **Generation input:** Stay away from me!
- **Filename:** `nv1_molly_lambert_combat_start_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.

### NV-100 — weather_shelter_rain · P2

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** new-draft; **binding:** existing-event.
- **Trigger:** beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim.
- **Canonical transcript:** I'll shelter from the rain for a while.
- **Generation input:** I'll shelter from the rain for a while.
- **Filename:** `nv1_molly_lambert_weather_shelter_rain_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold.

### NV-101 — livestock_danger · P1

- **NPC / voice:** Molly Lambert / CASTING HOLD.
- **Disposition:** reuse-after-QC; **binding:** existing-event.
- **Trigger:** NpcAgent flockThreatApplied with household at new threat episode. npcBarkRequest can reuse same-speaker danger_alert.
- **Additional conditions:** Reuse via existing livestock_danger -> danger_alert alias, no extra recording or sheep/wolf claim.
- **Canonical transcript (QC candidate):** Look out — something hostile!
- **Generation input:** NONE — reference/reuse only; do not enqueue a new take.
- **Filename:** `general_female_b_danger_alert_02.mp3`.
- **Existing asset:** `docs/v3-donor/voices/mp3/general_female_b_danger_alert_02.mp3`; ASR match; ledger pending.
- **Holds:** per-clip-QC; speaker-safe-runtime-Q88; casting-hold.

## Pierce (profile spelling: Piers)

Runtime key: **none; editorial ID `piers` only**. Role: unbound traveller; no runtime profession selected.

Fish UUID: **CASTING HOLD**; no named assignment. unassigned; no runtime character key.

Direction: Plain, guarded, awkward and stubborn. No clever rogue quips, automatic apology, confession or reconciliation.

### NV-102 — greeting · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ui-vue/npcDialogueGreeting.ts:resolveNpcGreetingPresentation; NpcAgent.playReactionSound on non-normal tier. Explicit open or admitted proximity greeting; no assumed familiarity.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** What is it you want?
- **Generation input:** What is it you want?
- **Filename:** `nv1_piers_greeting_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-103 — farewell · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu, no pending offer decline. Ordinary conversation close.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** All right. I'll leave you to it.
- **Generation input:** All right. I'll leave you to it.
- **Filename:** `nv1_piers_farewell_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-104 — attention · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ai/NpcAgent.ts:playReactionSound normal reaction tier; admitted proximity reaction.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Hey. A word.
- **Generation input:** Hey. A word.
- **Filename:** `nv1_piers_attention_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-105 — thanks · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists, but no general thanks producer verified. Bind only to a committed helpful act, not an attempted action.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Thanks. That helps me.
- **Generation input:** Thanks. That helps me.
- **Filename:** `nv1_piers_thanks_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-106 — refusal · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Semantic intent exists; no general refusal voice producer verified. Bind to an actual refused request.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** No. I'm not doing that.
- **Generation input:** No. I'm not doing that.
- **Filename:** `nv1_piers_refusal_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-107 — confirmation · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Agreement maps to confirmation. Semantic intent exists; exact successful agreement voice binding absent.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** All right. I can agree to that.
- **Generation input:** All right. I can agree to that.
- **Filename:** `nv1_piers_confirmation_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-108 — quest_offer · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** Quest offers exist as text; QuestVoiceIntent admits quest_offer but no inspected producer requests it. Require actual available offer by this giver.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I need a hand. Will you hear me out?
- **Generation input:** I need a hand. Will you hear me out?
- **Filename:** `nv1_piers_quest_offer_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-109 — quest_accepted · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ui-vue/store.ts:acceptNpcDialogueOffer after onAccept. Acknowledges willingness, not task completion or guaranteed success.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Right. Thanks for agreeing.
- **Generation input:** Right. Thanks for agreeing.
- **Filename:** `nv1_piers_quest_accepted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-110 — quest_declined · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ui-vue/store.ts:closeNpcDialogueMenu with pending helpResult.offer. Decline, not generic farewell.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Fine. I won't keep asking.
- **Generation input:** Fine. I won't keep asking.
- **Filename:** `nv1_piers_quest_declined_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-111 — quest_complete · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/quests/QuestManager.ts:playQuestCompleteSound via complete outcome, loaded giver resolved in createApp. Generic thanks only; no victory, restored animal, reward or completed repair claim.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** You've helped me. Thanks.
- **Generation input:** You've helped me. Thanks.
- **Filename:** `nv1_piers_quest_complete_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-112 — hungry · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ai/NpcAgent.ts:choose selects food need after previousNeed != food. Does NOT establish work was interrupted, an empty stomach, food available or consumption.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I need something to eat. Soon.
- **Generation input:** I need something to eat. Soon.
- **Filename:** `nv1_piers_hungry_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-113 — exhausted · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ai/NpcAgent.ts:goTo/execute -> exhausted on isExhausted(stamina); action pauses. Rest, not end of day.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I can't go on without a rest.
- **Generation input:** I can't go on without a rest.
- **Filename:** `nv1_piers_exhausted_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-114 — weather_shelter · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** src/ai/NpcAgent.ts:beginSeekShelter before arrival. Neutral shared variant for rain/storm/snow through npcBarkRequest.weatherShelterVoiceIntents.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I'm getting under cover.
- **Generation input:** I'm getting under cover.
- **Filename:** `nv1_piers_weather_shelter_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-115 — danger_alert · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** NpcAgent newly perceived animal-threat episode. Species-neutral; no death, victory or all-clear claim.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Watch out! Get away from it!
- **Generation input:** Watch out! Get away from it!
- **Filename:** `nv1_piers_danger_alert_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-116 — combat_start · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** NpcAgent successful beginCombat. Do not use on mere sighting or flight; no assumed weapon.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Get back! Leave me alone!
- **Generation input:** Get back! Leave me alone!
- **Filename:** `nv1_piers_combat_start_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-117 — work_finished · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** NpcAgent terminal execute with classifyPendingActivity(action, activeNeed) === work. One task ended; no end-of-shift, tools-away or repaired-world claim.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** Finished that, at least.
- **Generation input:** Finished that, at least.
- **Filename:** `nv1_piers_work_finished_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-118 — weather_shelter_rain · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** beginSeekShelter with weather rain; storm may also use rain fallback under existing policy. No forecast/intensity/arrival claim.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I'm not staying out in this rain.
- **Generation input:** I'm not staying out in this rain.
- **Filename:** `nv1_piers_weather_shelter_rain_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-119 — weather_shelter_storm · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** beginSeekShelter with current weather storm only. No inferred damage/lightning strike.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I need cover from this storm.
- **Generation input:** I need cover from this storm.
- **Filename:** `nv1_piers_weather_shelter_storm_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

### NV-120 — weather_shelter_snow · P2

- **NPC / voice:** Pierce (profile spelling: Piers) / CASTING HOLD.
- **Disposition:** new-draft; **binding:** binding-needed.
- **Trigger:** beginSeekShelter with current weather snow only. Never rain fallback.
- **Additional conditions:** Text preparation only. No stable V1 character, role, cast or quest surface. No automatic confession, guilt, Pip custody or household admission.
- **Canonical transcript:** I'll get out of the snow.
- **Generation input:** I'll get out of the snow.
- **Filename:** `nv1_piers_weather_shelter_snow_01.mp3`.
- **Holds:** text-approval; speaker-safe-runtime-Q88; per-clip-QC; casting-hold; binding-needed.

