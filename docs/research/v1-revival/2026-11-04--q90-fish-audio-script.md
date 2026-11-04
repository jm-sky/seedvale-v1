# Q90 — Fish Audio recording proposals

**2026-11-04 · source `bca03d453bfb0177a9d2801c4d2ccc7ca0c3b7a5` · author-approved Fish Audio script (2026-11-04); MP3 generation/QC pending.**

Proposed takes: **87 = P0 12 / P1 54 / P2 21**. No audio generated. The author approved these exact 87 transcripts and their Fish Audio production scope on 2026-11-04; priorities define production order, not evidence of runtime readiness or passed QC. [72 conditional reuse candidates](./2026-11-04--q90-fish-audio-script.json) are separate from these counts; approved reusable clips = **0** in the current ledger.

[Audit](./2026-11-04--q90-npc-voices-editorial-audit.md) · [writing pass](./2026-11-04--q90-dialogue-proposals.md) · [machine-readable script](./2026-11-04--q90-fish-audio-script.json) · [coverage](./2026-11-04--q90-coverage.json) · [all 81 old-row dispositions](./2026-11-04--q90-supersession.md)

**Recording policy:** This is a selective voice set, not a plan to record all NPC dialogue. Routine activity/needs/family/settlement responses remain text-only. The desired MP3 surfaces are greeting/farewell, trade entry/exit, generic quest cues and selected exact important quest lines, plus spontaneous weather, campfire NPC–NPC, danger/combat, interrupted work due to needs and other individually selected significant events. Categories without rows in this script are not automatically approved new takes. [Decision](./STRATEGIC-BRIEF.md).

## Production contract

For every take, **generation input is exactly the complete Transcript cell**, with no ID, quotation marks, stage direction or tags. The JSON repeats `canonical_transcript` and `generation_input` independently per row, alongside UUID, conditions, restrictions and replacement references. All filenames are proposed, flat, under `public/sounds/voices/`; `q90_` prevents collisions and does not create runtime keys. Keep the existing speaker UUID across every line for an NPC. Do not synthesize a cross-product of this list. New speaker identifiers here are editorial labels, not runtime registrations. Old `general_male` assets must not be relabelled FairyTail.

P0 establishes twelve existing-event slots for the approved new primary male voice. P1 adds the two other approved male directions, bounded gaps in existing banks, and one profession reply per V1 role. P2 adds selective social/weather/pair variation and held Dramatic repairs. All three new male directions have **zero existing files**. Equal casting weights apply only after eligibility; do not bypass named-character restrictions.

## Speakers and gates

| Script speaker | Fish UUID | Casting / production gate |
| --- | --- | --- |
| `general_male_fairytail` (FairyTail 1) | `689b47ca83dd48dba90b160affb8a118` | approved direction; no recordings; adult male; general roles after named/role exclusions |
| `general_old_male_george` (george) | `372ef39bf5bf4fd38c5c56bce607aba6` | approved direction; no recordings; older male; initial age-eligible casting, no automatic recast on birthday |
| `general_male_v2_rick` (Rick Sanchez) | `d2e75a3e3fd6419893057c02a375a113` | approved direction; no recordings; adult male; general roles, not exclusively fisher |
| `guard_male` (Guard) | `c29549f41b3b4aa498d66d76fba0e887` | accepted casting; bank mismatch review pending; male guard; never substitute for Mark |
| `hunter_male` (Arthur) | `bd22266aba38416cb602e90ce651520c` | accepted; selected for Jacob; male hunter; named key jakub, no rename |
| `merchant_female` (Expressive Female) | `d4f161bee1934b47ad3090f05649270c` | Kate sample fit accepted; source identity still unverified; female trader; kasia_hornblower candidate, not silent reassignment |
| `general_female_b` (Hannah) | `9a9cf47702da476aa4629e2506d4a857` | accepted casting; clips pending; adult female; Molly assignment not locked |
| `guard_male_b` (Dramatic Character Male) | `7a18a1851d2649108c48ec9f2c80eb2c` | provisional; role fit and bank mismatch review pending; male guard or approved future role; not Mark; watch text remains guard-only |

All new clips require author script approval, generation by the author and transcript/identity QC. Merchant production additionally waits for source identity confirmation; Dramatic rows wait for role/casting confirmation and mismatch reconciliation. P1 profession and P2 relation/pair rows are **text-first, binding-held**, not live producers. Do not spend the recording budget to fix missing runtime eligibility.

## Trigger codes

| Intent | Actual condition / restriction |
| --- | --- |
| `greeting` | Existing explicit dialogue open or greeting proximity reaction; time-neutral text; stable speaker required. |
| `attention` | Existing normal-relation proximity attention reaction; no demand to stop simulation. |
| `farewell` | Existing committed dialogue close, not declining an offered quest. |
| `quest_accepted` | Existing successful offer acceptance; generic reaction shown separately from exact quest text. |
| `quest_declined` | Existing offered-quest decline/close; no cancellation or refusal of unrelated services. |
| `quest_complete` | Existing quest completion voice callback for this loaded NPC; generic reaction, never reward/objective narration. |
| `exhausted` | Existing exhaustion transition in NpcAgent; no claim about hours worked or distance travelled. |
| `hungry` | Existing selected food need after a different need; not a claim of fasting or food availability. |
| `weather_shelter` | Existing beginSeekShelter entry; any admitted rain/storm/snow; no arrival, intensity or forecast claim. |
| `danger_alert` | Existing newly perceived animal-threat episode; species-neutral, no joke. |
| `combat_start` | Existing successful beginCombat; not mere threat perception or player dialogue. |
| `work_finished` | Existing terminal action classified as schedule work; one completed task, not end of shift/day. |

Weather-specific rows require the existing shelter event plus the named current weather. Profession replies require the existing about-self topic and actual profession; preserve dynamic name/family facts as separate text. Greeting variants specify personal relation or unapproved local-standing tier. Campfire CF90-1 = FairyTail → Hannah (calm); CF90-2 = Hannah → Rick (cheerful). Both require compatible complete pairs, safe social context and cancellation before a delayed answer if interrupted. Their timing remains unset until recordings exist.

## Proposed takes

### P0

| ID / speaker | Intent; restrictions | Transcript = Fish input | Proposed filename | Action |
| --- | --- | --- | --- | --- |
| Q90-001 / `general_male_fairytail` | `greeting`; any; neutral | Hello there. What can I do for you? | `q90_general_male_fairytail_greeting_01.mp3` | new recording |
| Q90-002 / `general_male_fairytail` | `attention`; any; neutral | A moment, if you please. | `q90_general_male_fairytail_attention_01.mp3` | new recording |
| Q90-003 / `general_male_fairytail` | `farewell`; any; neutral | Take care, wherever you are bound. | `q90_general_male_fairytail_farewell_01.mp3` | new recording |
| Q90-004 / `general_male_fairytail` | `quest_accepted`; any; neutral | Thank you for taking this on. | `q90_general_male_fairytail_quest_accepted_01.mp3` | new recording |
| Q90-005 / `general_male_fairytail` | `quest_declined`; any; neutral | Very well. Thank you for hearing me out. | `q90_general_male_fairytail_quest_declined_01.mp3` | new recording |
| Q90-006 / `general_male_fairytail` | `quest_complete`; any; neutral | That settles the matter. Thank you. | `q90_general_male_fairytail_quest_complete_01.mp3` | new recording |
| Q90-007 / `general_male_fairytail` | `exhausted`; any; neutral | I need to stop and rest. | `q90_general_male_fairytail_exhausted_01.mp3` | new recording |
| Q90-008 / `general_male_fairytail` | `hungry`; any; neutral | I could do with a bite to eat. | `q90_general_male_fairytail_hungry_01.mp3` | new recording |
| Q90-009 / `general_male_fairytail` | `weather_shelter`; any; neutral | No sense staying out in this. Best find cover. | `q90_general_male_fairytail_weather_shelter_01.mp3` | new recording |
| Q90-010 / `general_male_fairytail` | `danger_alert`; any; neutral | Get back! Keep clear of it! | `q90_general_male_fairytail_danger_alert_01.mp3` | new recording |
| Q90-011 / `general_male_fairytail` | `combat_start`; any; neutral | Stay back from me! | `q90_general_male_fairytail_combat_start_01.mp3` | new recording |
| Q90-012 / `general_male_fairytail` | `work_finished`; any; neutral | There. That part is finished. | `q90_general_male_fairytail_work_finished_01.mp3` | new recording |

### P1

| ID / speaker | Intent; restrictions | Transcript = Fish input | Proposed filename | Action |
| --- | --- | --- | --- | --- |
| Q90-013 / `general_old_male_george` | `greeting`; any; neutral | Come, have your say. | `q90_general_old_male_george_greeting_01.mp3` | new recording |
| Q90-014 / `general_old_male_george` | `attention`; any; neutral | Could I trouble you for a word? | `q90_general_old_male_george_attention_01.mp3` | new recording |
| Q90-015 / `general_old_male_george` | `farewell`; any; neutral | Go well. Mind yourself. | `q90_general_old_male_george_farewell_01.mp3` | new recording |
| Q90-016 / `general_old_male_george` | `quest_accepted`; any; neutral | Much obliged. I shall leave it with you. | `q90_general_old_male_george_quest_accepted_01.mp3` | new recording |
| Q90-017 / `general_old_male_george` | `quest_declined`; any; neutral | Very well. I had to ask. | `q90_general_old_male_george_quest_declined_01.mp3` | new recording |
| Q90-018 / `general_old_male_george` | `quest_complete`; any; neutral | You have seen it through. Much obliged. | `q90_general_old_male_george_quest_complete_01.mp3` | new recording |
| Q90-019 / `general_old_male_george` | `exhausted`; any; neutral | I need a little rest before I go on. | `q90_general_old_male_george_exhausted_01.mp3` | new recording |
| Q90-020 / `general_old_male_george` | `hungry`; any; neutral | A bite to eat would do me good. | `q90_general_old_male_george_hungry_01.mp3` | new recording |
| Q90-021 / `general_old_male_george` | `weather_shelter`; any; neutral | I would sooner be under cover. | `q90_general_old_male_george_weather_shelter_01.mp3` | new recording |
| Q90-022 / `general_old_male_george` | `danger_alert`; any; neutral | Keep your distance! Get back! | `q90_general_old_male_george_danger_alert_01.mp3` | new recording |
| Q90-023 / `general_old_male_george` | `combat_start`; any; neutral | Back away from me! | `q90_general_old_male_george_combat_start_01.mp3` | new recording |
| Q90-024 / `general_old_male_george` | `work_finished`; any; neutral | There we are. One task finished. | `q90_general_old_male_george_work_finished_01.mp3` | new recording |
| Q90-025 / `general_male_v2_rick` | `greeting`; any; neutral | Hello. What is it you need? | `q90_general_male_v2_rick_greeting_01.mp3` | new recording |
| Q90-026 / `general_male_v2_rick` | `attention`; any; neutral | Spare me a moment? | `q90_general_male_v2_rick_attention_01.mp3` | new recording |
| Q90-027 / `general_male_v2_rick` | `farewell`; any; neutral | Off you go, then. Take care. | `q90_general_male_v2_rick_farewell_01.mp3` | new recording |
| Q90-028 / `general_male_v2_rick` | `quest_accepted`; any; neutral | Good. I appreciate the help. | `q90_general_male_v2_rick_quest_accepted_01.mp3` | new recording |
| Q90-029 / `general_male_v2_rick` | `quest_declined`; any; neutral | All right. You have heard me out, at least. | `q90_general_male_v2_rick_quest_declined_01.mp3` | new recording |
| Q90-030 / `general_male_v2_rick` | `quest_complete`; any; neutral | That is dealt with. Thank you. | `q90_general_male_v2_rick_quest_complete_01.mp3` | new recording |
| Q90-031 / `general_male_v2_rick` | `exhausted`; any; neutral | I need a rest. I am worn out. | `q90_general_male_v2_rick_exhausted_01.mp3` | new recording |
| Q90-032 / `general_male_v2_rick` | `hungry`; any; neutral | I need something to eat. | `q90_general_male_v2_rick_hungry_01.mp3` | new recording |
| Q90-033 / `general_male_v2_rick` | `weather_shelter`; any; neutral | I have had enough of this weather. Under cover for me. | `q90_general_male_v2_rick_weather_shelter_01.mp3` | new recording |
| Q90-034 / `general_male_v2_rick` | `danger_alert`; any; neutral | Move back! Keep away from it! | `q90_general_male_v2_rick_danger_alert_01.mp3` | new recording |
| Q90-035 / `general_male_v2_rick` | `combat_start`; any; neutral | Keep back! I mean it! | `q90_general_male_v2_rick_combat_start_01.mp3` | new recording |
| Q90-036 / `general_male_v2_rick` | `work_finished`; any; neutral | Finished that bit. Good. | `q90_general_male_v2_rick_work_finished_01.mp3` | new recording |
| Q90-037 / `guard_male` | `greeting`; any; neutral | Hello. What brings you here? | `q90_guard_male_greeting_01.mp3` | replacement |
| Q90-038 / `guard_male` | `combat_start`; any; neutral | Stay back. I'll defend myself! | `q90_guard_male_combat_start_01.mp3` | replacement |
| Q90-039 / `guard_male` | `hungry`; any; neutral | I need a meal before I carry on. | `q90_guard_male_hungry_01.mp3` | new recording |
| Q90-040 / `guard_male` | `exhausted`; any; neutral | I need a moment to catch my breath. | `q90_guard_male_exhausted_01.mp3` | new recording |
| Q90-041 / `guard_male` | `work_finished`; any; neutral | That task is done. | `q90_guard_male_work_finished_01.mp3` | new recording |
| Q90-042 / `hunter_male` | `hungry`; any; neutral | Best find something to eat before I carry on. | `q90_hunter_male_hungry_01.mp3` | new recording |
| Q90-043 / `hunter_male` | `exhausted`; any; neutral | I need a breather. Even good legs have limits. | `q90_hunter_male_exhausted_01.mp3` | new recording |
| Q90-044 / `hunter_male` | `weather_shelter`; any; neutral | I'll wait this weather out under cover. | `q90_hunter_male_weather_shelter_01.mp3` | new recording |
| Q90-045 / `hunter_male` | `work_finished`; any; neutral | That is finished. On to the next thing. | `q90_hunter_male_work_finished_01.mp3` | new recording |
| Q90-046 / `hunter_male` | `quest_accepted`; any; neutral | Thank you. I am glad of the help. | `q90_hunter_male_quest_accepted_01.mp3` | replacement |
| Q90-047 / `merchant_female` | `hungry`; any; neutral | I should find something to eat before I carry on. | `q90_merchant_female_hungry_01.mp3` | new recording |
| Q90-048 / `merchant_female` | `exhausted`; any; neutral | I need to rest a moment before I go on. | `q90_merchant_female_exhausted_01.mp3` | new recording |
| Q90-049 / `merchant_female` | `weather_shelter`; any; neutral | This can wait. I'm getting out of the weather. | `q90_merchant_female_weather_shelter_01.mp3` | new recording |
| Q90-050 / `merchant_female` | `danger_alert`; any; neutral | Keep away! There is danger here! | `q90_merchant_female_danger_alert_01.mp3` | new recording |
| Q90-051 / `merchant_female` | `combat_start`; any; neutral | Stay back! Do not come closer! | `q90_merchant_female_combat_start_01.mp3` | new recording |
| Q90-052 / `merchant_female` | `work_finished`; any; neutral | There. That is taken care of. | `q90_merchant_female_work_finished_01.mp3` | new recording |
| Q90-053 / `merchant_female` | `farewell`; any; neutral | Goodbye, and take care of yourself. | `q90_merchant_female_farewell_01.mp3` | replacement |
| Q90-054 / `merchant_female` | `quest_complete`; any; neutral | Thank you. I appreciate what you have done. | `q90_merchant_female_quest_complete_01.mp3` | replacement |
| Q90-055 / `general_female_b` | `work_finished`; any; neutral | There, that job is finished. | `q90_general_female_b_work_finished_01.mp3` | replacement |
| Q90-056 / `general_male_fairytail` | `profession_reply`; woodcutter; calm | Wood has a grain. Fighting it only tires your arms. | `q90_general_male_fairytail_profession_woodcutter_01.mp3` | new recording |
| Q90-057 / `general_female_b` | `profession_reply`; farmer; cheerful | Farm work teaches patience. Whether you wanted the lesson or not. | `q90_general_female_b_profession_farmer_01.mp3` | new recording |
| Q90-058 / `guard_male` | `profession_reply`; guard; calm | I keep watch. A quiet watch is no cause for complaint. | `q90_guard_male_profession_guard_01.mp3` | new recording |
| Q90-059 / `merchant_female` | `profession_reply`; trader; calm | A clear price saves a long argument. | `q90_merchant_female_profession_trader_01.mp3` | new recording |
| Q90-060 / `general_old_male_george` | `profession_reply`; miner; calm | Underground, care matters more than hurry. | `q90_general_old_male_george_profession_miner_01.mp3` | new recording |
| Q90-061 / `general_male_v2_rick` | `profession_reply`; fisher; grumpy | Fish have no respect for a busy person. | `q90_general_male_v2_rick_profession_fisher_01.mp3` | new recording |
| Q90-062 / `hunter_male` | `profession_reply`; hunter; curious | There's more to hunting than a steady hand. You have to pay attention. | `q90_hunter_male_profession_hunter_01.mp3` | new recording |
| Q90-063 / `general_male_fairytail` | `profession_reply`; blacksmith; grumpy | A rushed edge is work you have to do twice. | `q90_general_male_fairytail_profession_blacksmith_02.mp3` | new recording |
| Q90-064 / `general_old_male_george` | `profession_reply`; shepherd; cheerful | Keeping animals takes patience. They don't listen to explanations. | `q90_general_old_male_george_profession_shepherd_02.mp3` | new recording |
| Q90-065 / `general_female_b` | `profession_reply`; textile_worker; curious | A small mistake in the thread can travel a long way. | `q90_general_female_b_profession_textile_worker_02.mp3` | new recording |
| Q90-066 / `general_female_b` | `profession_reply`; herbalist; calm | With herbs, knowing what to leave alone matters too. | `q90_general_female_b_profession_herbalist_03.mp3` | new recording |

### P2

| ID / speaker | Intent; restrictions | Transcript = Fish input | Proposed filename | Action |
| --- | --- | --- | --- | --- |
| Q90-067 / `general_male_fairytail` | `greeting`; any; calm | Hello. What brings you here? | `q90_general_male_fairytail_greeting_stranger_acquainted_02.mp3` | new recording |
| Q90-068 / `general_female_b` | `greeting`; any; curious | Hello! What's on your mind today? | `q90_general_female_b_greeting_stranger_acquainted_01.mp3` | new recording |
| Q90-069 / `general_female_b` | `greeting`; any; cheerful | There you are! It's lovely to see you again. | `q90_general_female_b_greeting_friendly_trusted_02.mp3` | new recording |
| Q90-070 / `general_male_v2_rick` | `greeting`; any; grumpy | Oh, it's you. Go on, I'm listening. | `q90_general_male_v2_rick_greeting_friendly_trusted_02.mp3` | new recording |
| Q90-071 / `guard_male` | `greeting`; any; calm | Welcome back. What can I do for you? | `q90_guard_male_greeting_friendly_trusted_02.mp3` | new recording |
| Q90-072 / `merchant_female` | `greeting`; any; cheerful | Back again? I'm glad you stopped to talk. | `q90_merchant_female_greeting_friendly_trusted_01.mp3` | new recording |
| Q90-073 / `general_old_male_george` | `greeting`; any; calm | I'll hear you out, but let's keep this straightforward. | `q90_general_old_male_george_greeting_local_distrust_02.mp3` | new recording |
| Q90-074 / `general_female_b` | `greeting`; any; calm | You're welcome here. What would you like to talk about? | `q90_general_female_b_greeting_local_respect_03.mp3` | new recording |
| Q90-075 / `general_male_fairytail` | `weather_shelter_snow`; any; neutral | Snow's coming down. Time to get under cover. | `q90_general_male_fairytail_weather_shelter_snow_01.mp3` | new recording |
| Q90-076 / `general_female_b` | `weather_shelter_snow`; any; neutral | Best find shelter from this snow. | `q90_general_female_b_weather_shelter_snow_01.mp3` | new recording |
| Q90-077 / `guard_male` | `weather_shelter_snow`; any; neutral | Snow's coming down. Find some shelter. | `q90_guard_male_weather_shelter_snow_01.mp3` | new recording |
| Q90-078 / `general_male_fairytail` | `weather_shelter_rain`; any; neutral | I would rather be out of this rain. | `q90_general_male_fairytail_weather_shelter_rain_01.mp3` | new recording |
| Q90-079 / `general_female_b` | `weather_shelter_storm`; any; neutral | I am getting under cover from this storm. | `q90_general_female_b_weather_shelter_storm_01.mp3` | new recording |
| Q90-080 / `guard_male` | `weather_shelter_storm`; any; neutral | Storm's on us. Find shelter, everyone. | `q90_guard_male_weather_shelter_storm_01.mp3` | new recording |
| Q90-081 / `guard_male_b` | `combat_start`; any; neutral | Keep back. I will defend myself. | `q90_guard_male_b_combat_start_01.mp3` | replacement |
| Q90-082 / `guard_male_b` | `quest_complete`; any; neutral | The matter is settled. You have my thanks. | `q90_guard_male_b_quest_complete_01.mp3` | replacement |
| Q90-083 / `guard_male_b` | `work_finished`; any; neutral | That is one task out of the way. | `q90_guard_male_b_work_finished_01.mp3` | replacement |
| Q90-084 / `general_male_fairytail` | `campfire_question`; any; calm | Mind if I enjoy a quiet moment here? | `q90_general_male_fairytail_campfire_question_01.mp3` | new recording |
| Q90-085 / `general_female_b` | `campfire_answer`; any; calm | Not at all. A little quiet suits me. | `q90_general_female_b_campfire_answer_01.mp3` | new recording |
| Q90-086 / `general_female_b` | `campfire_question`; any; cheerful | Do you think doing nothing counts as practice? | `q90_general_female_b_campfire_question_01.mp3` | new recording |
| Q90-087 / `general_male_v2_rick` | `campfire_answer`; any; cheerful | If it does, I'm improving by the minute. | `q90_general_male_v2_rick_campfire_answer_01.mp3` | new recording |

## Reuse candidates — no generation

These are existing files, not Fish tasks. ASR and catalog text are kept separately in JSON. Neither becomes canonical by appearing here. A mismatch requires author confirmation; bank/identity gates still apply to matching files. Retain good material; do not re-record merely because a file is unregistered.

| Existing file | Speaker / intent | QC evidence | Additional constraint |
| --- | --- | --- | --- |
| `general_female_b_greeting_01.mp3` | `general_female_b` / `greeting` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_attention_02.mp3` | `general_female_b` / `attention` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_farewell_02.mp3` | `general_female_b` / `farewell` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_quest_accepted_02.mp3` | `general_female_b` / `quest_accepted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_quest_declined_02.mp3` | `general_female_b` / `quest_declined` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_quest_complete_01.mp3` | `general_female_b` / `quest_complete` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_exhausted_01.mp3` | `general_female_b` / `exhausted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_hungry_01.mp3` | `general_female_b` / `hungry` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_weather_shelter_02.mp3` | `general_female_b` / `weather_shelter` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_danger_alert_02.mp3` | `general_female_b` / `danger_alert` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `general_female_b_combat_start_01.mp3` | `general_female_b` / `combat_start` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `guard_male_greeting_01.mp3` | `guard_male` / `greeting` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. Day only; proximity has no time filter yet. |
| `guard_male_attention_01.mp3` | `guard_male` / `attention` | mismatch; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. Author must confirm actual words; ASR is a hypothesis, not canonical text. |
| `guard_male_farewell_01.mp3` | `guard_male` / `farewell` | mismatch; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. Author must confirm actual words; ASR is a hypothesis, not canonical text. |
| `guard_male_quest_accepted_01.mp3` | `guard_male` / `quest_accepted` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_quest_declined_01.mp3` | `guard_male` / `quest_declined` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_quest_complete_01.mp3` | `guard_male` / `quest_complete` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_weather_shelter_01.mp3` | `guard_male` / `weather_shelter` | mismatch; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. Author must confirm actual words; ASR is a hypothesis, not canonical text. ASR is weather-neutral; current rain-only registration is not reliable speech evidence. |
| `guard_male_danger_alert_01.mp3` | `guard_male` / `danger_alert` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_guard_response_01.mp3` | `guard_male` / `guard_response` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `hunter_male_greeting_02.mp3` | `hunter_male` / `greeting` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_attention_01.mp3` | `hunter_male` / `attention` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_farewell_01.mp3` | `hunter_male` / `farewell` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_quest_declined_01.mp3` | `hunter_male` / `quest_declined` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_quest_complete_01.mp3` | `hunter_male` / `quest_complete` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_danger_alert_01.mp3` | `hunter_male` / `danger_alert` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_combat_start_01.mp3` | `hunter_male` / `combat_start` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_greeting_01.mp3` | `merchant_female` / `greeting` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_attention_01.mp3` | `merchant_female` / `attention` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_farewell_01.mp3` | `merchant_female` / `farewell` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_quest_accepted_01.mp3` | `merchant_female` / `quest_accepted` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_quest_declined_01.mp3` | `merchant_female` / `quest_declined` | match; pending; V1 public | Requires transcript/identity/role QC and Q88; not approved for import. |
| `guard_male_b_greeting_02.mp3` | `guard_male_b` / `greeting` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_attention_01.mp3` | `guard_male_b` / `attention` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_farewell_01.mp3` | `guard_male_b` / `farewell` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_quest_accepted_01.mp3` | `guard_male_b` / `quest_accepted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_quest_declined_02.mp3` | `guard_male_b` / `quest_declined` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_exhausted_01.mp3` | `guard_male_b` / `exhausted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_hungry_01.mp3` | `guard_male_b` / `hungry` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_weather_shelter_02.mp3` | `guard_male_b` / `weather_shelter` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_danger_alert_02.mp3` | `guard_male_b` / `danger_alert` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `guard_male_b_guard_response_01.mp3` | `guard_male_b` / `guard_response` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. >20% bank mismatch gate remains. |
| `hunter_male_b_greeting_01.mp3` | `hunter_male_b` / `greeting` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_attention_01.mp3` | `hunter_male_b` / `attention` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_farewell_01.mp3` | `hunter_male_b` / `farewell` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_quest_accepted_02.mp3` | `hunter_male_b` / `quest_accepted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_quest_declined_02.mp3` | `hunter_male_b` / `quest_declined` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_quest_complete_02.mp3` | `hunter_male_b` / `quest_complete` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_exhausted_01.mp3` | `hunter_male_b` / `exhausted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_hungry_02.mp3` | `hunter_male_b` / `hungry` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_weather_shelter_02.mp3` | `hunter_male_b` / `weather_shelter` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_danger_alert_02.mp3` | `hunter_male_b` / `danger_alert` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `hunter_male_b_combat_start_02.mp3` | `hunter_male_b` / `combat_start` | mismatch; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. Author must confirm actual words; ASR is a hypothesis, not canonical text. |
| `hunter_male_b_work_finished_02.mp3` | `hunter_male_b` / `work_finished` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. Confirm completed task meaning; never interpret as end of all work. |
| `merchant_female_b_greeting_02.mp3` | `merchant_female_b` / `greeting` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_attention_01.mp3` | `merchant_female_b` / `attention` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_farewell_02.mp3` | `merchant_female_b` / `farewell` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_quest_accepted_02.mp3` | `merchant_female_b` / `quest_accepted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_quest_declined_02.mp3` | `merchant_female_b` / `quest_declined` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_quest_complete_01.mp3` | `merchant_female_b` / `quest_complete` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_exhausted_02.mp3` | `merchant_female_b` / `exhausted` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_hungry_01.mp3` | `merchant_female_b` / `hungry` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_weather_shelter_01.mp3` | `merchant_female_b` / `weather_shelter` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_danger_alert_02.mp3` | `merchant_female_b` / `danger_alert` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_combat_start_02.mp3` | `merchant_female_b` / `combat_start` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `merchant_female_b_work_finished_02.mp3` | `merchant_female_b` / `work_finished` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. Confirm completed task meaning; never interpret as end of all work. |
| `shepherd_male_b_greeting_01.mp3` | `shepherd_male_b` / `greeting` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `shepherd_male_b_farewell_01.mp3` | `shepherd_male_b` / `farewell` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `shepherd_male_b_danger_alert_01.mp3` | `shepherd_male_b` / `danger_alert` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `npc_mark_hornblower_greeting_01.mp3` | `mark_hornblower` / `greeting` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `npc_mark_hornblower_farewell_01.mp3` | `mark_hornblower` / `farewell` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
| `npc_mark_hornblower_danger_alert_01.mp3` | `mark_hornblower` / `danger_alert` | match; pending; donor only | Requires transcript/identity/role QC and Q88; not approved for import. |
