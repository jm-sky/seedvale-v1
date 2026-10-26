# Ordinary NPC interactions — farewells, work and weather

**Status:** `draft`
**Created:** 2026-10-15
**Domain:** dialogue, NPC
**Roadmap:** M4 everyday conversation text; later M5/M6 situational triggers
**Depends on:** D-CMP-13, D-NPC-22, D-ROAD-19/S4, quests--004 Q1
**Finished:** —

This is the next reusable text bank after [greetings](greetings.md), for authored and generated NPCs. It covers what a person may say when a conversation ends, when asked about their current activity, and when commenting on observed weather. It is **text preparation only**. A line's condition must be checked against the real NPC/world state; the presence of English text or an old voice clip does not establish the action, weather observation or audio playback in V3.

## Source and hierarchy

`V1:<stem>` is the exact displayed phrase under `<stem>.mp3` in the [V1 voice catalog](NPC-VOICE-CATALOG.md); it does not bind an MP3. `V1 template` refers to `legacy/seedvale/src/ai/dialogueTemplates.ts::currentActivityLine`, which supplies the *current-activity question/reply pattern* in Polish; English text below is adapted when so marked. `V3 flavour` refers to already accepted English barks in [flavour.ts](../../src/game/data/npc/flavour.ts). `New` is a short new line where no suitable source text exists. V2's `DialogPanel.vue` has quest, trade, gift, bed and news actions, but no general work/weather conversation tree to copy.

```text
ordinary/
  farewell/
    relation/       tone candidate from this NPC's directed opinion
    profession/     actual role plus appropriate encounter context
    age/            child/elder voice-text candidate
    general/        safe fallback for every speaking NPC
  activity/
    current/        requires actual schedule/action state, never profession alone
    work_bark/      existing V3 profession line at a matching work scene
  weather/
    observed/       requires weather the NPC can plausibly observe
    shelter/        requires worsening rain/storm and a safe suggestion
```

As with greetings, this is an editorial fallback tree; S4/M4 sets final selection, variant stability, interruption and social ownership. Text IDs do not use NPC names or current scores. A sex-labelled V1 corpus line is a reusable English candidate, not a claim that one sex must speak a certain way. Existing greeting + farewell lines should not be selected if they duplicate each other awkwardly in one exchange.

## `ordinary/farewell/general` and age

| Text ID | English text | Eligibility | Source |
|---|---|---|---|
| `ordinary.farewell.general.01` | Take care out there. | Any speaking NPC | V1:`general_male_farewell_01` |
| `ordinary.farewell.general.02` | Take care of yourself. | Any speaking NPC | V1:`general_female_farewell_01` |
| `ordinary.farewell.general.03` | Safe travels. Watch yourself on the road. | Leaving on a journey or road | V1:`general_male_farewell_02` |
| `ordinary.farewell.general.04` | Safe travels. Come back soon. | Journey; NPC would welcome return | V1:`general_female_farewell_02` |
| `ordinary.farewell.age.child.01` | Bye! See you later! | Child who can converse | V1:`general_female_child_farewell_01` |
| `ordinary.farewell.age.young.01` | See you later! | Familiar younger NPC | V1:`general_male_young_farewell_01` |
| `ordinary.farewell.age.elder.01` | Go safely. These old roads have their dangers. | Elder; road context | V1:`general_male_old_farewell_01` |
| `ordinary.farewell.age.elder.02` | Take care, dear. And mind your step. | Elder whose established voice fits the intimacy | V1:`general_female_old_farewell_01` |

## `ordinary/farewell/relation` — tone without new entitlements

Use the accepted D-NPC-22 relation tier of this NPC toward the player. These are candidate tones; the final S4 resolver must also consider context and public standing. A hostile person may end lawful talk without stopping commerce or public information access. Positive feeling does not grant lodging, supplies or a quest.

| Tier | Text ID | English text | Source |
|---|---|---|---|
| Hostile | `ordinary.farewell.hostile.01` | Move along, and stay out of trouble. | V1:`guard_male_farewell_01`; only a suitably stern speaker |
| Hostile | `ordinary.farewell.hostile.02` | That is all for now. | New; general fallback |
| Unfriendly | `ordinary.farewell.unfriendly.01` | Good day. | New |
| Neutral | `ordinary.farewell.neutral.01` | Take care out there. | V1:`general_male_farewell_01` |
| Positive | `ordinary.farewell.positive.01` | See you later! | V1:`general_male_young_farewell_01`; any familiar age if tone fits |
| Warm | `ordinary.farewell.warm.01` | Safe travels. Come back soon. | V1:`general_female_farewell_02` |
| Friendly | `ordinary.farewell.friendly.01` | Take care of yourself out there. | V1:`general_female_old_farewell_02`; any familiar adult if tone fits |
| Close | `ordinary.farewell.close.01` | Come back when you can. I'll be glad to see you. | New |

## `ordinary/farewell/profession`

These V1 role lines are reusable for a matching actual profession. They are not restricted to the source voice profile's sex. A road, flock or hunt must be relevant to the conversation; otherwise use `farewell/general`.

| Profession | Text ID | English text | Source / condition |
|---|---|---|---|
| `guard` | `ordinary.farewell.guard.01` | Safe travels. Keep your eyes open on the road. | V1:`guard_male_farewell_02`; road advice |
| `hunter` | `ordinary.farewell.hunter.01` | Watch your step out there. | V1:`hunter_male_farewell_01`; outdoors |
| `hunter` | `ordinary.farewell.hunter.02` | Stay downwind, and keep your eyes open. | V1:`hunter_male_farewell_02`; relevant hunt |
| `trader` | `ordinary.farewell.trader.01` | Safe travels. Come back if you need anything. | V1:`merchant_female_farewell_01`; actual trading availability |
| `shepherd` | `ordinary.farewell.shepherd.01` | Take care. Keep clear of the wolves. | V1:`shepherd_male_farewell_01`; only if wolf risk is known here |

For professions without a fitting V1 role farewell, the general bank is complete. There is no need to invent fourteen job-specific goodbyes merely to mirror the fourteen profession IDs.

## `ordinary/activity/current` — player asks what the NPC is doing

The reusable V1 topic is “What are you doing now?” Only the **actual action/schedule state** may select a reply. If the activity is unavailable or stale, use the neutral reply. Statements about item creation, crop harvest, a stocked home or a deadline require their real suppliers and are absent here.

| Text ID | Player option or NPC reply | English text | Condition / source |
|---|---|---|---|
| `ordinary.activity.ask` | Player option | What are you doing now? | V1 `currentActivityLine` topic, translated |
| `ordinary.activity.unknown` | NPC reply | Just taking a moment. | New; safe neutral fallback |
| `ordinary.activity.work` | NPC reply | Working. I can talk for a moment. | Adapted V1 `currentActivityLine`; NPC really at work and available |
| `ordinary.activity.rest` | NPC reply | Resting for a while. | Adapted V1 `currentActivityLine`; actual rest |
| `ordinary.activity.water` | NPC reply | I'm going to fetch water. | Adapted V1 `currentActivityLine`; actual water trip |
| `ordinary.activity.meal` | NPC reply | I'm having something to eat. | Adapted V1 `currentActivityLine`; actual meal, no player food offer |
| `ordinary.activity.social` | NPC reply | I was speaking with someone. | Adapted V1 `currentActivityLine`; only after genuine social interaction |
| `ordinary.activity.work_finished` | NPC reply | There. That's enough work for today. | V1:`general_male_work_finished_01`; completed duty, not merely time of day |

Sleeping or fleeing NPCs may have no dialogue surface. Do not wake them or force a spoken line merely to satisfy this menu. Busy/interruptible policy belongs to M4 agent AI and talk interaction.

## `ordinary/activity/work_bark` — reuse the current V3 bank

These are **ambient or context replies**, not generic answers to `ordinary.activity.ask`. Their existing V3 IDs remain in `flavour.ts`; the table states where a bark could be eligible. Do not duplicate their text as a second owned phrase bank or select them just from the profession field.

| Profession | Existing `flavour.ts` bark | Eligible only when |
|---|---|---|
| `farmer` | “These seedlings need a gentler hand.” | Visible seedling work |
| `woodcutter` | “This trunk will split along the grain.” | Handling a real trunk |
| `hunter` | “Best keep downwind of the deer.” | Deer or deer sign actually known nearby |
| `guard` | “Keep to the road after dark.” | Giving road advice, not claiming night duty |
| `herbalist` | “This yarrow should be gathered before rain.” | Actual yarrow in view |
| `trader` | “Let me weigh that properly.” | Actual weighing or transaction |
| `blacksmith` | “A sound edge takes patient work.” | Smith at a credible work scene |
| `shepherd` | “Keep the flock close together.” | Actual flock present |
| `miner` | “Keep the lamp clear of dust.” | Lamp and active mine work |
| `fisher` | “Best mend this mesh before casting.” | Net work |
| `miller` | “Tie that sack before the flour spills.” | Sacks and mill work |
| `carpenter` | “Mark the board before you cut.” | Board work |
| `charcoal_burner` | “Keep the earth packed over the heap.” | Covered heap work |
| `innkeeper` | “Mind the rushlight near the straw.” | Actual rushlight/straw at an inn |

## `ordinary/weather` — observation, not a forecast

The player option `ordinary.weather.ask` is **“How is the weather treating you?”** (New). The following lines require weather that the NPC can plausibly perceive; indoor NPCs without a window/observation can use the generic reply. The old V1 rain clips are spoken-text precedents only. Do not forecast a storm from a static string or suggest entering a locked/unreachable building.

| Text ID | English text | Condition | Source |
|---|---|---|---|
| `ordinary.weather.clear.01` | A fair day to be outside. | Clear, daylight, speaker outdoors | New |
| `ordinary.weather.overcast.01` | The sky's holding for now. | Overcast, no active rain | New |
| `ordinary.weather.rain.01` | Rain's coming down hard. Better get inside. | Heavy actual rain, safe shelter known | V1:`general_male_weather_shelter_01` |
| `ordinary.weather.worsening.01` | This weather's getting worse. Time to get under cover. | Worsening observed rain/storm, safe shelter known | V1:`general_female_weather_shelter_01` |
| `ordinary.weather.snow.01` | Snow's coming down. Watch your footing. | Actual snowfall, exposed path | New |
| `ordinary.weather.unknown.01` | I've been indoors. You'll have a better sense of it. | Speaker has no recent outdoor/weather observation | New |

## Still missing after this text batch

| Area | Existing source | Missing fact or supplier | Earliest useful content work |
|---|---|---|---|
| Everyday conversation for all 17 Saltmere residents | [17 resident scene drafts](saltmere-daily-conversations.md), V1 self/village/work templates, V3 role barks | Actor-specific voice review, scene placement and S4 relationship/knowledge resolution; Q-026 working names | Text drafted; no runtime binding until roster/S4/M4 |
| True rumours and directions | V1 `aboutAreaLine`; V2 “Ask for news”; M3 board candidates | Speaker-known site/lead ID, exact vs approximate precision, disclosure policy | After M3 survey + S4 knowledge contract |
| Requests for food, water, gifts, trade or lodging | V1 assistance lines, V2 panel actions, V1 voice `thanks`/`refusal` | Real stock, title, money, permission, availability and conserved transfer | M4/M5/M8 supplier-backed scripts |
| Danger, injury, rescue and bereavement | V1 warnings/help/alerts; V2 quest scenes | Real observed threat, health/death state, interruption and aftermath | M5/M6 and later quest slices |
| Deeds, crime, promises and quest outcomes | V2 memory remarks; V1 local known deeds; [greetings](greetings.md) | Witness/knowledge/exposure, incident identity, effects and save | S4 contract, M7/M9 implementation |
| Voice and captions | V1 catalog has many phrases and some files | Approved final text, verified clip match, voice pilot/Q-002 | M7 pilot; broader voice M9 |

Next content pass: review the 17 resident scenes in their actual M4 locations and select each actor's voice after S4. A large quest-dialogue rewrite waits for the Q3 supplier-backed M7 selection, and a new generic bark should be written only when the existing V1/V2/V3 bank has no fitting line.
