# NPC voice expansion — English approval catalog

**Q90 editorial handoff (2026-11-04, awaiting author approval):** [Current audit/script](./2026-11-04--q90-npc-voices-editorial-audit.md) and [all 52 catalog-row dispositions](./2026-11-04--q90-supersession.md) supersede this historical additive production proposal schedule for review. Do not generate both catalogs. Original text/JSON remain evidence; new proposals do not change canonical transcripts.

**Date:** 2026-10-31  
**Status:** Proposed text only; no audio generated, no production registration.  
**Audit and dependency definitions:** [audit report](./2026-10-31--npc-voices-dialogue-audit.md)  
**Structured production handoff:** [JSON catalog](./2026-10-31--npc-voice-expansion-catalog.json)

## Reading and generation rules

52 additional rows: P0=3, P1=32, P2=17. They supplement, rather than replace or duplicate, [Q31's 29 planned clips](./2026-10-31--q31-npc-bark-line-script.md). The JSON includes Q31 as source-referenced existing work; keep one production owner per filename.

For **every new row below, generation_input is exactly the complete Text cell**, without quotes, IDs, condition text or delivery instructions. Thus English display text = canonical transcript = generation_input. The JSON repeats that explicit field per row for direct handoff. No tags are used in this proposal. Filenames are proposed flat assets under public/sounds/voices/; descriptive context keywords are a proposed extension, not keys the current runtime automatically understands. Variant 11 avoids existing and Q31 slots. Do not register any file before it exists and passes QC.

All rows await text and production approval. Priority is not readiness: D0 listening/QC and D1 profile-safe routing are common release gates. Existing event rows can often be recorded after text/profile approval before implementation; rows with new triggers must not be described as runtime-ready. Do not mix a general male profession line into an NPC cast to hunter/guard/shepherd: either use it for the explicitly compatible general-profile speaker or commission the same approved text for that NPC's chosen profile.

No cross-product generation. Each row is one explicitly budgeted voice/text take. Other genders/profiles use an eligible neutral line in their own profile or remain unvoiced. The present catalog is an adult pilot; child casting and age progression need a separate decision.

## Fish profiles

| Profile | Fish voice ID |
| --- | --- |
| general_male | `c2a3921fd7024b9189cb912bdfe5266a` |
| general_female | `5e3be339f2df45e6a1a338bb2ce94800` |
| guard_male | `c29549f41b3b4aa498d66d76fba0e887` |
| hunter_male | `bd22266aba38416cb602e90ce651520c` |
| merchant_female | `d4f161bee1934b47ad3090f05649270c` |
| shepherd_male | `4af16ba03cee422996ec29a43e1947ee` |

Provider IDs are sourced from the repository catalog, not revalidated against the live Fish service. Fish generation remains manual, after approval. Do not use actor imitation instructions; use the selected catalog voice ID.

## Existing Q31 — retain one queue

| Priority | Existing batch | Count | Action |
| --- | --- | --- | --- |
| P0 | A — weather foundation | 12 | Review wording flagged in audit §8, then generate approved rows |
| P1 | B — weather alternates | 9 | Same filenames and Q40 registration owner |
| P2 | C — needs/work/exhaustion gaps | 8 | Do not re-author these as new files |

Q31's original text and prompts are preserved in the JSON as source evidence, not silently corrected. Proposed wording changes in audit §8 are approval alternatives, never simultaneous extra takes.

## P0 — new proposed recordings

| File / voice | Intent | Text = generation_input | Eligibility | Role / style / humor | Dependencies |
| --- | --- | --- | --- | --- | --- |
| `general_male_danger_alert_11.mp3` (general_male) | `danger_alert` | Look out! Get clear of it! | Existing new perceived animal-threat episode; any species. | any; neutral; humor=false | D0, D1 |
| `shepherd_male_livestock_danger_11.mp3` (shepherd_male) | `livestock_danger` | The animals are in danger! Keep back! | Existing flock-threat episode; no claim that the predator is a wolf or livestock are sheep. | shepherd; neutral; humor=false | D0, D1 |
| `general_male_farewell_11.mp3` (general_male) | `farewell` | Take care. I hope your journey goes well. | Committed farewell; no promise of stock, location or future availability. | any; neutral; humor=false | D0, D1 |

## P1 — new proposed recordings

| File / voice | Intent | Text = generation_input | Eligibility | Role / style / humor | Dependencies |
| --- | --- | --- | --- | --- | --- |
| `general_female_danger_alert_11.mp3` (general_female) | `danger_alert` | Watch out! Move away from it! | Existing new perceived animal-threat episode; any species. | any; neutral; humor=false | D0, D1 |
| `guard_male_combat_start_11.mp3` (guard_male) | `combat_start` | Stay back. I'll defend myself! | Existing successful beginCombat, not greeting or a mere threat sighting. | guard; neutral; humor=false | D0, D1 |
| `general_male_call_for_help_11.mp3` (general_male) | `call_for_help` | Somebody, help me! | Real admitted help-request event; producer must first be located or separately implemented. | any; neutral; humor=false | D0, D1, D6 |
| `general_female_call_for_help_11.mp3` (general_female) | `call_for_help` | Please, somebody! I can't manage alone! | Real admitted help-request event; producer must first be located or separately implemented. | any; neutral; humor=false | D0, D1, D6 |
| `hunter_male_hungry_11.mp3` (hunter_male) | `hungry` | Best find something to eat before I carry on. | Existing hungry transition; no promise of hunting or available food. | hunter; neutral; humor=false | D0, D1 |
| `hunter_male_exhausted_11.mp3` (hunter_male) | `exhausted` | I need a breather. Even good legs have limits. | Existing exhaustion transition. | hunter; neutral; humor=false | D0, D1 |
| `hunter_male_weather_shelter_11.mp3` (hunter_male) | `weather_shelter` | I'll wait this weather out under cover. | Existing seekShelter entry; weather-neutral, no finished arrival claim. | hunter; neutral; humor=false | D0, D1 |
| `merchant_female_hungry_11.mp3` (merchant_female) | `hungry` | Time for a bite. An empty stomach is poor company. | Existing hungry transition. Safe, relaxed context only: no acute threat, injury, bereavement or critical need; if severity is unavailable use a neutral fallback. | trader; neutral; humor=true | D0, D1 |
| `merchant_female_exhausted_11.mp3` (merchant_female) | `exhausted` | I need to rest a moment before I go on. | Existing exhaustion transition. | trader; neutral; humor=false | D0, D1 |
| `merchant_female_weather_shelter_11.mp3` (merchant_female) | `weather_shelter` | This can wait. I'm getting out of the weather. | Existing seekShelter entry. | trader; neutral; humor=false | D0, D1 |
| `guard_male_hungry_11.mp3` (guard_male) | `hungry` | I need a meal before I carry on. | Existing hungry transition; does not claim watch ended. | guard; neutral; humor=false | D0, D1 |
| `guard_male_exhausted_11.mp3` (guard_male) | `exhausted` | I need a moment to catch my breath. | Existing exhaustion transition. | guard; neutral; humor=false | D0, D1 |
| `shepherd_male_hungry_11.mp3` (shepherd_male) | `hungry` | It's time I found a bite to eat. | Existing hungry transition. | shepherd; neutral; humor=false | D0, D1 |
| `shepherd_male_exhausted_11.mp3` (shepherd_male) | `exhausted` | My legs need a rest. Just a moment. | Existing exhaustion transition. | shepherd; neutral; humor=false | D0, D1 |
| `shepherd_male_weather_shelter_11.mp3` (shepherd_male) | `weather_shelter` | Best get myself under cover. | Existing seekShelter entry; no claim flock followed or is safe. | shepherd; neutral; humor=false | D0, D1 |
| `general_male_profession_reply_woodcutter_11.mp3` (general_male) | `profession_reply` | Wood has a grain. Fighting it only tires your arms. | Existing about-self/profession topic selected; adult with actual role=woodcutter; general craft observation, no claim of current work, tools or stock. | woodcutter; calm; humor=false | D0, D1, D3 |
| `general_female_profession_reply_farmer_11.mp3` (general_female) | `profession_reply` | Farm work teaches patience. Whether you wanted the lesson or not. | Existing about-self/profession topic selected; adult with actual role=farmer; general craft observation, no claim of current work, tools or stock. Safe, relaxed context only: no acute threat, injury, bereavement or critical need; if severity is unavailable use a neutral fallback. | farmer; cheerful; humor=true | D0, D1, D3 |
| `guard_male_profession_reply_guard_11.mp3` (guard_male) | `profession_reply` | I keep watch. Most days, a sharp eye is enough. | Existing about-self/profession topic selected; adult with actual role=guard; general craft observation, no claim of current work, tools or stock. | guard; calm; humor=false | D0, D1, D3 |
| `merchant_female_profession_reply_trader_11.mp3` (merchant_female) | `profession_reply` | A clear price saves a long argument. | Existing about-self/profession topic selected; adult with actual role=trader; general craft observation, no claim of current work, tools or stock. | trader; calm; humor=false | D0, D1, D3 |
| `general_male_profession_reply_miner_11.mp3` (general_male) | `profession_reply` | Underground, care matters more than hurry. | Existing about-self/profession topic selected; adult with actual role=miner; general craft observation, no claim of current work, tools or stock. | miner; calm; humor=false | D0, D1, D3 |
| `general_female_profession_reply_fisher_11.mp3` (general_female) | `profession_reply` | Fishing leaves you plenty of time to practise patience. | Existing about-self/profession topic selected; adult with actual role=fisher; general craft observation, no claim of current work, tools or stock. | fisher; cheerful; humor=false | D0, D1, D3 |
| `hunter_male_profession_reply_hunter_11.mp3` (hunter_male) | `profession_reply` | There's more to hunting than a steady hand. You have to pay attention. | Existing about-self/profession topic selected; adult with actual role=hunter; general craft observation, no claim of current work, tools or stock. | hunter; calm; humor=false | D0, D1, D3 |
| `general_male_profession_reply_blacksmith_11.mp3` (general_male) | `profession_reply` | A rushed edge is work you have to do twice. | Existing about-self/profession topic selected; adult with actual role=blacksmith; general craft observation, no claim of current work, tools or stock. | blacksmith; grumpy; humor=false | D0, D1, D3 |
| `shepherd_male_profession_reply_shepherd_11.mp3` (shepherd_male) | `profession_reply` | Keeping animals takes patience. They don't listen to explanations. | Existing about-self/profession topic selected; adult with actual role=shepherd; general craft observation, no claim of current work, tools or stock. Safe, relaxed context only: no acute threat, injury, bereavement or critical need; if severity is unavailable use a neutral fallback. | shepherd; cheerful; humor=true | D0, D1, D3 |
| `general_female_profession_reply_textile_worker_11.mp3` (general_female) | `profession_reply` | A small mistake in the thread can travel a long way. | Existing about-self/profession topic selected; adult with actual role=textile_worker; general craft observation, no claim of current work, tools or stock. | textile_worker; curious; humor=false | D0, D1, D3 |
| `general_female_profession_reply_herbalist_11.mp3` (general_female) | `profession_reply` | With herbs, knowing what to leave alone matters too. | Existing about-self/profession topic selected; adult with actual role=herbalist; general craft observation, no claim of current work, tools or stock. | herbalist; calm; humor=false | D0, D1, D3 |
| `general_male_greeting_stranger_calm_11.mp3` (general_male) | `greeting` | Hello. What brings you here? | Explicit open; personal relation stranger or acquainted; calm style. | any; calm; humor=false | D0, D1, D2, D3 |
| `general_female_greeting_stranger_curious_11.mp3` (general_female) | `greeting` | Hello! What's on your mind today? | Explicit open; stranger or acquainted; curious style. | any; curious; humor=false | D0, D1, D2, D3 |
| `general_female_greeting_familiar_cheerful_11.mp3` (general_female) | `greeting` | There you are! It's lovely to see you again. | Explicit open; friendly or trusted; cheerful style; no acute emergency. | any; cheerful; humor=false | D0, D1, D2, D3 |
| `general_male_greeting_familiar_grumpy_11.mp3` (general_male) | `greeting` | Oh, it's you. Go on, I'm listening. | Explicit open; friendly or trusted; grumpy style; no hostility implied. | any; grumpy; humor=false | D0, D1, D2, D3 |
| `guard_male_greeting_familiar_calm_11.mp3` (guard_male) | `greeting` | Welcome back. What can I do for you? | Explicit open; friendly or trusted; guard, any time. | guard; calm; humor=false | D0, D1, D2, D3 |
| `merchant_female_greeting_familiar_cheerful_11.mp3` (merchant_female) | `greeting` | Back again? I'm glad you stopped to talk. | Explicit open; friendly or trusted; no assumption of shopping or stock. | trader; cheerful; humor=false | D0, D1, D2, D3 |

## P2 — new proposed recordings

| File / voice | Intent | Text = generation_input | Eligibility | Role / style / humor | Dependencies |
| --- | --- | --- | --- | --- | --- |
| `general_male_greeting_local_distrust_11.mp3` (general_male) | `greeting` | I'll hear you out, but let's keep this straightforward. | Explicit open; proposed local trust <= -30, supplied by current settlement reputation; tone only, not refusal or accusation. | any; neutral; humor=false | D0, D1, D2, D3, D4 |
| `general_female_greeting_local_respect_11.mp3` (general_female) | `greeting` | You're welcome here. What would you like to talk about? | Explicit open; proposed local trust >= 30 and renown >= 20; local standing only, no specific deed claim. | any; neutral; humor=false | D0, D1, D2, D3, D4 |
| `general_male_weather_remark_fog_11.mp3` (general_male) | `weather_remark` | Hard to see far in this fog. | New optional remark; actual fog, outdoors, no acute threat; once per observed weather episode. | any; neutral; humor=false | D0, D1, D5 |
| `general_female_weather_remark_light_rain_11.mp3` (general_female) | `weather_remark` | A little rain. At least I needn't water my sleeves. | New optional remark; actual light rain outdoors, no critical need/threat or shelter interruption. Safe, relaxed context only: no acute threat, injury, bereavement or critical need; if severity is unavailable use a neutral fallback. | any; cheerful; humor=true | D0, D1, D5 |
| `general_female_weather_remark_clearing_11.mp3` (general_female) | `weather_remark` | The rain's stopped. That's a welcome change. | New optional remark; verified rain-to-dry edge observed by this NPC, outdoors. | any; neutral; humor=false | D0, D1, D5 |
| `general_male_weather_remark_cold_dry_11.mp3` (general_male) | `weather_remark` | Cold enough to make me wish I'd stayed inside. | New optional remark; actual dry cold outdoors; proposed temperature <= -2 C; no exposure/body-temperature simulation. | any; grumpy; humor=false | D0, D1, D5 |
| `general_female_thirsty_11.mp3` (general_female) | `thirsty` | I need a drink of water before I carry on. | New bark on existing need=water transition, not household waterDuty; no inferred thirst from weather. | any; neutral; humor=false | D0, D1, D6 |
| `general_male_thirsty_11.mp3` (general_male) | `thirsty` | Time to find some water. My throat's dry. | New bark on existing need=water transition, not waterDuty. | any; neutral; humor=false | D0, D1, D6 |
| `general_male_injured_11.mp3` (general_male) | `injured` | That hurts. I need to get it seen to. | New bark; real new injury/health event, alive and able to speak; episode-scoped. | any; neutral; humor=false | D0, D1, D6 |
| `general_female_danger_passed_11.mp3` (general_female) | `danger_passed` | It's quiet again. I hope it stays that way. | New bark; prior observed threat episode ended and no current threat; no claim attacker died. | any; neutral; humor=false | D0, D1, D6 |
| `general_male_repair_finished_11.mp3` (general_male) | `repair_finished` | That's the repair finished. Let's hope it holds. | New presentation binding after a real completed repair and committed condition update; not ordinary work_finished. | any; neutral; humor=false | D0, D1, D6 |
| `general_female_bereavement_11.mp3` (general_female) | `bereavement` | I still catch myself expecting to see them. | New dialogue eligibility: death of a genuinely known close person plus knowledge/relationship evidence; never global death visibility. | any; neutral; humor=false | D0, D1, D6 |
| `hunter_male_knowledge_ready_11.mp3` (hunter_male) | `knowledge_ready` | I've got something to tell you about the area. | Existing pending deliver_world_knowledge follow-up; new voice binding, no automatic reveal or consume. | hunter; neutral; humor=false | D0, D1, D3 |
| `general_male_campfire_question_rest_11.mp3` (general_male) | `campfire_question` | Mind if I enjoy a quiet moment here? | Existing valid campfire pair, general_male questioner; select whole pair CF01, no emergency. | any; calm; humor=false | D0, D1, D7 |
| `general_female_campfire_answer_rest_11.mp3` (general_female) | `campfire_answer` | Not at all. A little quiet suits me. | CF01 answer only while the same valid paired conversation remains active; general_female responder. | any; calm; humor=false | D0, D1, D7 |
| `general_female_campfire_question_humor_11.mp3` (general_female) | `campfire_question` | Do you think doing nothing counts as practice? | Existing valid campfire pair, general_female questioner; CF02, safe relaxed social context. Safe, relaxed context only: no acute threat, injury, bereavement or critical need; if severity is unavailable use a neutral fallback. | any; cheerful; humor=true | D0, D1, D7 |
| `general_male_campfire_answer_humor_11.mp3` (general_male) | `campfire_answer` | If it does, I'm improving by the minute. | CF02 answer only while same valid pair remains active; general_male responder; safe relaxed context. Safe, relaxed context only: no acute threat, injury, bereavement or critical need; if severity is unavailable use a neutral fallback. | any; cheerful; humor=true | D0, D1, D7 |

## Pair and condition notes

- CF01: general_male_campfire_question_rest_11 → general_female_campfire_answer_rest_11.
- CF02: general_female_campfire_question_humor_11 → general_male_campfire_answer_humor_11.
- Resolve a complete pair before starting. Actual clip duration determines answer timing after generation/QC; do not guess delay now. An interrupted pair must not play its answer.
- “Profession reply” is an answer to the existing self/profession topic, not a claim the NPC is currently performing that job. Binding and text migration require D3.
- Familiarity uses existing friendly/trusted relations. Proposed local respect/distrust uses settlement standing, not personal hostility or omniscient knowledge of deeds.
- Humor is optional and restricted to safe contexts. Hungry merchant humor requires noncritical hunger; if no severity input is supplied, choose a neutral line.
- New intent strings are proposals requiring type/manifest/selection/call-site work as appropriate; filenames do not create events.
- Review existing donor coverage before approving a take; cancel superseded rows explicitly instead of paying for both.

