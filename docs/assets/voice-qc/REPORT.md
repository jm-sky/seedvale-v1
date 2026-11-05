# Voice QC ledger — report (npc-065 S1, Q87)

This ASR report documents existing files; [2026-11-05 casting](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md#npc-voice-map) supersedes older bank casting holds, while every row remains QC-pending. Casual Male Speaker is approved for male farmer; mixed-source recordings require individual QC.

Generated 2026-11-02 by `scripts/voice/voice-qc-ledger.py` (faster-whisper `small.en`, CPU, int8) over all 317 files in `docs/v3-donor/voices/mp3` (the 109 files in `public/sounds/voices` are byte-identical copies, flagged `inV1Public`). Data: [`ledger.json`](./ledger.json). ASR proves spoken words only; taste/pronunciation remain author-owned (`author`/`verdict` start `unheard`/`pending`). Catalog `voice_id` is a profile name for some `_b` banks; the tool maps both forms.

## Mismatch rate per speaker

| Speaker | files | mismatch | rate |
| --- | ---: | ---: | ---: |
| `general_female` | 22 | 7 | 32% ⚠ >20 % |
| `general_female_b` | 38 | 2 | 5% |
| `general_male` | 22 | 10 | 45% ⚠ >20 % |
| `general_male_b` | 38 | 0 | 0% |
| `guard_male` | 22 | 5 | 23% ⚠ >20 % |
| `guard_male_b` | 40 | 9 | 22% ⚠ >20 % |
| `hunter_male` | 21 | 0 | 0% |
| `hunter_male_b` | 38 | 3 | 8% |
| `mark_hornblower` | 6 | 0 | 0% |
| `merchant_female` | 17 | 1 | 6% |
| `merchant_female_b` | 38 | 2 | 5% |
| `shepherd_male` | 5 | 3 | 60% ⚠ >20 % |
| `shepherd_male_b` | 10 | 0 | 0% |

⚠ banks exceed the npc-065 stop threshold (> 20 %) — **do not import/register these banks until the author confirms the actual text** (many rows are stale catalog text or swapped filenames, e.g. `general_male_*_greeting` rows are shifted by one; a few are plain spelling/punctuation variants that pass once normalized spelling is tolerated).

## Mismatch list (catalog → ASR)

| File | WER | Catalog text | ASR text |
| --- | ---: | --- | --- |
| `campfire_female_weather_question_01.mp3` | 1.0 | Cold tonight, isn't it? | Long day |
| `campfire_male_weather_answer_01.mp3` | 0.167 | Yeah. Feels like rain by morning. | Yeah, it feels like rain by morning. |
| `general_female_b_attention_01.mp3` | 0.4 | Hey — over here a moment. | Hey, overhear a moment. |
| `general_female_b_hungry_02.mp3` | 0.167 | My stomach's empty. Work can wait. | My stomach's empty, work and wait. |
| `general_female_call_for_help_01.mp3` | 0.75 | Oh! Help! Support needed! | Help! Help! Someone! Quickly! |
| `general_female_child_farewell_02.mp3` | 2.0 | See you later! | I should get back home now. |
| `general_female_child_greeting_01.mp3` | 0.5 | Hi! Want to play? | Hi! Wanna play? |
| `general_female_danger_alert_01.mp3` | 0.25 | Alert! Everyone, watch out! | Everyone, watch out! |
| `general_female_old_farewell_02.mp3` | 1.667 | Take care of yourself out there. | Off you go then. May the road treat you kindly. |
| `general_female_weather_shelter_01.mp3` | 0.889 | This weather's getting worse. Time to get under cover. | Rain's coming down hard! Better get inside! |
| `general_male_call_for_help_01.mp3` | 0.25 | Help! Help! Someone! quickly! | Help someone quickly! |
| `general_male_combat_start_01.mp3` | 0.5 | Alright then. Come on! | All right then, come on! |
| `general_male_danger_alert_01.mp3` | 0.25 | Wolf! Everyone, watch out! | ALERT! EVERYONE, WATCH OUT! |
| `general_male_greeting_01.mp3` | 1.167 | Hello, traveler. Good to see you. | Good day, how are you doing today? |
| `general_male_old_farewell_01.mp3` | 1.0 | Go safely. These old roads have their dangers. | Take care of yourself out there. |
| `general_male_old_farewell_02.mp3` | 2.0 | Take care of yourself. | Go safely. These old roads have their dangers. |
| `general_male_old_greeting_01.mp3` | 1.143 | Good to see you. Been traveling far? | Ah, there you are. Come, speak your mind. |
| `general_male_old_greeting_02.mp3` | 1.0 | Ah, there you are. Come, speak your mind. | Hello, you're new around here? |
| `general_male_young_greeting_01.mp3` | 1.0 | Hello, you're new around here. | Hi! Want to play? |
| `guard_male_attention_01.mp3` | 1.2 | You there. Hold a moment. | Traveler, a word if you please. |
| `guard_male_b_agree_02.mp3` | 0.25 | All right. I'll see what I can do. | Alright, I'll see what I can do. |
| `guard_male_b_call_for_help_01.mp3` | 1.2 | I need help here! Now! | Hold on, I'm coming to help. |
| `guard_male_b_call_for_help_02.mp3` | 1.6 | Another pair of hands, quickly! | Keep back from it. I'll come to you. |
| `guard_male_b_combat_start_01.mp3` | 1.125 | Stand down! I don't want to hurt you! | My watch is done. I can put my feet up. |
| `guard_male_b_combat_start_02.mp3` | 1.143 | All right, then. I'll stop you myself! | That's the end of my duty for now. |
| `guard_male_b_danger_alert_01.mp3` | 1.75 | Get clear! Danger ahead! | This reigns making it hard to see. |
| `guard_male_b_quest_complete_01.mp3` | 1.286 | You've done well. I appreciate the help. | I need a bite before I go back to it. |
| `guard_male_b_quest_complete_02.mp3` | 1.6 | That's handled, then. Good work. | An empty belly makes for a poor watch. |
| `guard_male_b_quest_declined_01.mp3` | 0.875 | I understand. I'll have to try another way. | I need a moment off my feet. |
| `guard_male_call_for_help_01.mp3` | 1.0 | Could use a hand here! | Oh! Help! Support needed! |
| `guard_male_farewell_01.mp3` | 1.286 | Move along, and stay out of trouble. | Safe travels. Keep your eyes open on the road. |
| `guard_male_quest_offer_01.mp3` | 1.444 | I could use someone capable. Interested in some work? | We have a problem that needs dealing with. Think you can handle it? |
| `guard_male_weather_shelter_01.mp3` | 1.143 | Rain's coming down hard. Better get inside. | This weather's getting worse. Time to get under cover. |
| `hunter_male_b_attention_02.mp3` | 0.167 | Here a moment, if you're free. | Hear a moment, if you're free. |
| `hunter_male_b_combat_start_02.mp3` | 0.4 | All right. I'll defend myself! | Alright, I'll defend myself. |
| `hunter_male_b_quest_offer_02.mp3` | 0.333 | I've a favour to ask. Have you a moment? | I have a favor to ask. Have you a moment? |
| `merchant_female_b_quest_declined_01.mp3` | 0.286 | That's all right. I had to ask. | That's alright. I had to ask. |
| `merchant_female_b_quest_offer_01.mp3` | 0.3 | I've a favour to ask, if you have the time. | I have a favor to ask, if you have the time. |
| `merchant_female_quest_accepted_02.mp3` | 0.333 | Good. I knew you looked dependable. | Good. I know you look dependable. |
| `shepard_male_danger_alert_01.mp3` | 1.0 | Wolf in the flock! Get! away! from! the! sheep!! | Woof! Everyone, watch out! |
| `shepherd_male_greeting_01.mp3` | 1.0 | Hello there. Looking for wool, or just passing through? | Morning, keeping an eye on the flock. |
| `shepherd_male_greeting_02.mp3` | 1.286 | Morning. Keeping an eye on the flock? | Hello there, looking for wool or just passing through? |

## Claims / weather / role tags (heuristic, review before use)

Weather words: none ×313, rain ×4.

| File | tags | Text (ASR) |
| --- | --- | --- |
| `campfire_female_road_answer_02.mp3` | weather=none roles=hunter claims=species,time,location | Not much. Saw fresh tracks near the forest, though. Bigger than deer! I wouldn't wander out there alone tonight. |
| `campfire_male_road_answer_01.mp3` | weather=none roles=hunter,shepherd claims=species | mostly the usual bad weather wolves near the woods and someone saying the northern trail isn't as safe as it used to be |
| `campfire_male_weather_answer_01.mp3` | weather=rain roles= claims=time | Yeah, it feels like rain by morning. |
| `general_female_b_warning_01.mp3` | weather=none roles=guard claims= | Watch yourself out there. Things have been restless. |
| `general_female_b_warning_02.mp3` | weather=none roles=farmer claims= | Take care beyond the fields, soft ground and sharp teeth. |
| `general_female_danger_alert_01.mp3` | weather=none roles=guard claims= | Everyone, watch out! |
| `general_female_weather_shelter_01.mp3` | weather=rain roles= claims= | Rain's coming down hard! Better get inside! |
| `general_male_b_warning_01.mp3` | weather=none roles=guard claims= | Watch yourself out there, things have been restless. |
| `general_male_b_warning_02.mp3` | weather=none roles=farmer claims= | Take care beyond the fields, soft ground and sharp teeth. |
| `general_male_danger_alert_01.mp3` | weather=none roles=guard claims= | ALERT! EVERYONE, WATCH OUT! |
| `guard_male_b_combat_start_01.mp3` | weather=none roles=guard claims= | My watch is done. I can put my feet up. |
| `guard_male_b_greeting_01.mp3` | weather=none roles=guard claims= | Good day. Need a word with the watch? |
| `guard_male_b_hungry_02.mp3` | weather=none roles=guard claims= | An empty belly makes for a poor watch. |
| `guard_male_b_quest_complete_02.mp3` | weather=none roles=guard claims= | An empty belly makes for a poor watch. |
| `guard_male_b_weather_shelter_01.mp3` | weather=rain roles= claims= | This rain's making it hard to see. |
| `guard_male_b_work_finished_01.mp3` | weather=none roles=guard claims= | My watch is done. I can put my feet up. |
| `hunter_male_b_warning_01.mp3` | weather=none roles=hunter claims= | Don't follow a trail you can't find your way back from. |
| `hunter_male_farewell_01.mp3` | weather=none roles=guard claims= | Watch your step out there! |
| `hunter_male_well_wish_01.mp3` | weather=none roles=hunter claims= | Good hunting. |
| `hunter_male_well_wish_02.mp3` | weather=none roles=hunter claims= | May the trail be kind to you. |
| `merchant_female_b_weather_shelter_02.mp3` | weather=rain roles= claims= | We ought to get out of this rain. |
| `merchant_female_greeting_02.mp3` | weather=none roles=merchant claims= | Ah, a customer! Come, take a look! |
| `merchant_female_quest_offer_01.mp3` | weather=none roles=merchant claims= | I may have a little work for someone willing to earn a few coins. |
| `merchant_female_warning_01.mp3` | weather=none roles=merchant claims=species,location | Careful on the road. Goods aren't the only thing bandits are after. |
| `shepard_male_danger_alert_01.mp3` | weather=none roles=guard claims= | Woof! Everyone, watch out! |
| `shepherd_male_b_livestock_danger_01.mp3` | weather=none roles=shepherd claims= | Away from the sheep. Get back. |
| `shepherd_male_b_livestock_danger_02.mp3` | weather=none roles=shepherd claims= | Keep the flock together. Move! |
| `shepherd_male_farewell_01.mp3` | weather=none roles=shepherd claims=species | Take care. Keep clear of the wolves. |
| `shepherd_male_greeting_01.mp3` | weather=none roles=shepherd claims=time | Morning, keeping an eye on the flock. |
| `shepherd_male_livestock_danger_01.mp3` | weather=none roles=shepherd claims=species | Wolf in the flock! Get away from the sheep! |

## Proposed casting sample (3 clips per speaker, matched clips preferred; for S2 — voice work deferred by author priority)


- `general_female`: `general_female_greeting_01.mp3`, `general_female_farewell_01.mp3`, `general_female_exhausted_01.mp3`
- `general_female_b`: `general_female_b_greeting_01.mp3`, `general_female_b_farewell_01.mp3`, `general_female_b_exhausted_01.mp3`
- `general_male`: `general_male_farewell_01.mp3`, `general_male_exhausted_01.mp3`, `campfire_male_road_answer_01.mp3`
- `general_male_b`: `general_male_b_greeting_01.mp3`, `general_male_b_farewell_01.mp3`, `general_male_b_exhausted_01.mp3`
- `guard_male`: `guard_male_greeting_01.mp3`, `guard_male_danger_alert_01.mp3`, `guard_male_agree_01.mp3`
- `guard_male_b`: `guard_male_b_greeting_01.mp3`, `guard_male_b_farewell_01.mp3`, `guard_male_b_exhausted_01.mp3`
- `hunter_male`: `hunter_male_greeting_01.mp3`, `hunter_male_farewell_01.mp3`, `hunter_male_danger_alert_01.mp3`
- `hunter_male_b`: `hunter_male_b_greeting_01.mp3`, `hunter_male_b_farewell_01.mp3`, `hunter_male_b_exhausted_01.mp3`
- `mark_hornblower`: `npc_mark_hornblower_daily_01.mp3`, `npc_mark_hornblower_danger_alert_01.mp3`, `npc_mark_hornblower_farewell_01.mp3`
- `merchant_female`: `merchant_female_greeting_01.mp3`, `merchant_female_farewell_01.mp3`, `merchant_female_quest_offer_01.mp3`
- `merchant_female_b`: `merchant_female_b_greeting_01.mp3`, `merchant_female_b_farewell_01.mp3`, `merchant_female_b_exhausted_01.mp3`
- `shepherd_male`: `shepherd_male_farewell_01.mp3`, `shepherd_male_livestock_danger_01.mp3`
- `shepherd_male_b`: `shepherd_male_b_greeting_01.mp3`, `shepherd_male_b_farewell_01.mp3`, `shepherd_male_b_danger_alert_01.mp3`
