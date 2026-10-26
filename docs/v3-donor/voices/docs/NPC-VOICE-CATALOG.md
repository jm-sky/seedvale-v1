# NPC Voice Catalog

**Updated at:** 2026-10-20
**Updated by:** Composer — Mark Hornblower cast (`Friendly Male Voice`) + 6-line pilot

Canonical working catalog for generated NPC voice samples (barks).

Visible in-game dialogue is English (changed from Polish by D-CMP-13); strings remain translation-ready for Polish later. Generated/spoken voice samples are English. Existing clips express a semantic intent and are not automatically a literal reading of every displayed line.

Runtime generated samples currently live flat under `public/sounds/voices/`.

**Statuses:** `in_repo` (file on disk, text known) · `text_unknown` (file on disk, spoken text not verified) · `planned` (phrase + voice slot authored; no audio yet).

**Generation metadata:** when known from Fish [Generation History](https://fish.audio/app/generation-history/), store the full prompt (including expressive tags) as `generation_input:`. The blockquote is the spoken line with tags stripped. Raw scrape: [`fish-generation-history-2026-10-09.json`](./fish-generation-history-2026-10-09.json).

Imported from v1 `legacy/seedvale/docs/dialogue/NPC-VOICE-CATALOG.md` (2026-10-09); this file is the tracked canon.

## Naming

Generated runtime files use:

```text
<scope>_<gender>_[<age>]_<keyword>_<variant>.mp3
```

Examples:

```text
general_male_greeting_01.mp3
merchant_female_greeting_01.mp3
guard_male_warning_01.mp3
hunter_male_quest_complete_02.mp3
general_female_quest_declined_01.mp3
```

`scope` is `general` or a profession/role such as `merchant`, `guard`, `hunter`, or `shepherd`.

Simulation role `trader` → voice scope `merchant`. Semantic intent `confirmation` may map to filename keyword `agree`.

Current semantic keywords:

- `greeting`
- `farewell`
- `thanks`
- `agree`
- `refusal`
- `attention`
- `warning`
- `acknowledgement`
- `well_wish`
- `quest_offer`
- `quest_accepted`
- `quest_declined`
- `quest_complete`
- `exhausted`
- `hungry`
- `weather_shelter`
- `danger_alert`
- `combat_start`
- `call_for_help`
- `livestock_danger`
- `guard_response`
- `work_finished`

`refusal` means the NPC refuses something requested by the player. `quest_declined` means the player declines the NPC's quest/offer and the NPC reacts to that decision.

Campfire POC naming:

```text
campfire_<gender>_<topic>_<question|answer>_<variant>.mp3
```

Topics: `weather`, `work`, `road`.

## Voice sources

| Profile | Provider | Voice/reference | Notes |
|---|---|---|---|
| `merchant_female` | Fish Audio | `d4f161bee1934b47ad3090f05649270c` | `Expressive Female Voice`; current merchant voice. |
| `merchant_female_b` | Fish Audio | `e3cd384158934cc9a01029cd7d278634` | `Laura` (Fish Discovery); second merchant timbre. |
| `general_male` | Fish Audio | `c2a3921fd7024b9189cb912bdfe5266a` | `Casual Male Speaker`; generic male fallback. |
| `general_male_b` | Fish Audio | `65c0b8155c464a648161af8877404f11` | `Brian British`; calm middle-aged British male — second general-male timbre. Author cast taste 2026-10-20: mechanical / no emotion — [voice-production-notes.md](./voice-production-notes.md). |
| `guard_male` | Fish Audio | `c29549f41b3b4aa498d66d76fba0e887` | Fish Audio voice labelled/selected as `guard`. |
| `guard_male_b` | Fish Audio | `7a18a1851d2649108c48ec9f2c80eb2c` | `Dramatic Character Male`; deep commanding — second guard timbre. Taste: [voice production notes](./voice-production-notes.md) (2026-10-20, not signed off). |
| `hunter_male` | Fish Audio | `bd22266aba38416cb602e90ce651520c` | Arthur Morgan-style hunter voice. |
| `hunter_male_b` | Fish Audio | `a2cecd3eda8b44178b7f1bc1379edae0` | `Cowboy` (John Morgan / Old West); gritty outdoor — second hunter timbre. |
| `general_female` | Fish Audio | `5e3be339f2df45e6a1a338bb2ce94800` | `Warm Conversational`; generic female/villager. Previous candidate: `British female` (`82a3ef4504a6441e9a07acdaaf5349c1`). |
| `general_female_b` | Fish Audio | `9a9cf47702da476aa4629e2506d4a857` | `Hannah` (Fish Official); second general-female timbre. |
| `shepherd_male` | Fish Audio | `4af16ba03cee422996ec29a43e1947ee` | `hetalia Russia`. On-disk typo `shepard_male_danger_alert_01.mp3` maps to this profile (no rename this round). |
| `shepherd_male_b` | Fish Audio | `beb44e5fac1e4b33a15dfcdcc2a9421d` | `Sleepless historian`; calm British measured — second shepherd timbre. |
| `campfire_female` | Fish Audio | `5e3be339f2df45e6a1a338bb2ce94800` | Alias of `general_female` for campfire POC (provisional). |
| `campfire_male` | Fish Audio | `c2a3921fd7024b9189cb912bdfe5266a` | Alias of `general_male` for campfire POC. |
| `mark_hornblower` | Fish Audio | `2adcdee4b3ce4b648dc16ea65430ea76` | `Friendly Male Voice`; actor-specific for `G01` / Mark Hornblower (author cast 2026-10-20). Does **not** replace `guard_male`. Taste ledger: [voice-production-notes.md](./voice-production-notes.md). |

Provider page: `https://fish.audio/app/`.

Actor-specific files also use `npc_<npc-id>_<keyword>_<variant>.mp3` (see [public/sounds/README.md](../../public/sounds/README.md)).

Target diversity (no generation this round): **two Fish profiles per main scope×gender** (`*` + `*_b`) and **at least two English text variants** on core intents.

## Fish Audio generation notes

Fish Audio supports expressive text cues/tags in the generation text. These are **generation metadata only** — they must not appear in runtime filenames or semantic IDs.

Example:

```text
Yeah. [soft] Feels like [emphasis] rain by morning.
```

Guidelines:

- keep the canonical spoken phrase readable without tags,
- store tags separately from runtime filename identity,
- do not encode tags in the resolver or semantic-key naming,
- prefer subtle cues over theatrical delivery for ordinary NPCs,
- generation (download/place MP3) is a later Cursor-lane round — this catalog only authors text + voice slots.

---

# General male

Provider: Fish Audio.

Voice: `Casual Male Speaker` — `c2a3921fd7024b9189cb912bdfe5266a`.

## acknowledgement

`general_male_acknowledgement_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> I understand.

`general_male_acknowledgement_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Alright. I understand.


## agree

`general_male_agree_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`
- generation_input: `Alright. Sounds good.`

> Alright. Sounds good to me.

`general_male_agree_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Very well. Let's do it.


## attention

`general_male_attention_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Hey, you! Got a moment?

`general_male_attention_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Traveler! Over here for a moment.


## call_for_help

`general_male_call_for_help_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shouting] [emphasis] Help! [short pause] Help! Someone! [short pause] [crying loudly]quickly!`

> Help! Help! Someone! quickly!


## combat_start

`general_male_combat_start_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Alright then. [short pause] [emphasis] Come on!`

> Alright then. Come on!


## danger_alert

`general_male_danger_alert_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shouting] Wolf! [emphasis] Everyone, [short pause] watch out!`

> Wolf! Everyone, watch out!


## exhausted

`general_male_exhausted_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[tired] I need to [emphasis] sit down [short pause] for a while.`

> I need to sit down for a while.


## farewell

`general_male_farewell_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `Take care out there. I’ll be here if you need supplies.`

> Take care out there.

`general_male_farewell_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Safe travels. Watch yourself on the road.


## greeting

`general_male_greeting_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`

> Hello, traveler. Good to see you.

`general_male_greeting_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Good day. How are you doing?


## hungry

`general_male_hungry_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `I can't work on an [emphasis] empty stomach.`

> I can't work on an empty stomach.


## old_farewell

`general_male_old_farewell_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Go safely. These old roads have their dangers.`

> Go safely. These old roads have their dangers.

`general_male_old_farewell_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Take care of yourself.`

> Take care of yourself.


## old_greeting

`general_male_old_greeting_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Good to see you. Been traveling far?`

> Good to see you. Been traveling far?

`general_male_old_greeting_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Ah, there you are. Come, speak your mind.`

> Ah, there you are. Come, speak your mind.


## quest_accepted

`general_male_quest_accepted_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`
- generation_input: `Good. I knew I could count on you.`

> Good. I knew I could count on you.

`general_male_quest_accepted_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Alright. Come back when it's done.


## quest_complete

`general_male_quest_complete_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Well done. You handled that nicely.

`general_male_quest_complete_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Good work. I appreciate what you've done.


## quest_declined

`general_male_quest_declined_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> I see. That's unfortunate.

`general_male_quest_declined_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Alright. I was hoping you'd help.


## quest_offer

`general_male_quest_offer_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> I could use some help, if you've got a moment.

`general_male_quest_offer_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`
- generation_input: `There’s something I need taken care of. Interested?`

> There's something I need taken care of. Interested?


## refusal

`general_male_refusal_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> No, thank you. Not today.

`general_male_refusal_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> I'd rather not. Maybe another time.


## thanks

`general_male_thanks_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Thank you. I appreciate it.

`general_male_thanks_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Much obliged. You've been a great help.


## warning

`general_male_warning_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Careful out there. The roads aren't always safe.

`general_male_warning_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Don't go into the woods without knowing the way back.


## weather_shelter

`general_male_weather_shelter_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[loud] Rain's coming down [emphasis] hard. [short pause] Better get inside.`

> Rain's coming down hard. Better get inside.


## well_wish

`general_male_well_wish_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Good luck out there.

`general_male_well_wish_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Safe travels. May the road treat you kindly.


## work_finished

`general_male_work_finished_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `There. That's enough work for today.`

> There. That's enough work for today.


## young_farewell

`general_male_young_farewell_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `See you later!`

> See you later!


## young_greeting

`general_male_young_greeting_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Hello, you're new around here.`

> Hello, you're new around here.

`general_male_young_greeting_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Hey! I haven't seen you around before.`

> Hey! I haven't seen you around before.


---

# Guard male

Provider: Fish Audio.

Voice: `guard` — `c29549f41b3b4aa498d66d76fba0e887`.

## acknowledgement

`guard_male_acknowledgement_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`

> I understand.

`guard_male_acknowledgement_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`

> Understood. I'll remember that.


## agree

`guard_male_agree_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Understood. I’ll see to it.`

> Understood. I'll see to it.

`guard_male_agree_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`

> Very well. Consider it done.


## attention

`guard_male_attention_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`

> You there. Hold a moment.

`guard_male_attention_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`
- generation_input: `Traveler. A word, if you please.`

> Traveler. A word, if you please.


## call_for_help

`guard_male_call_for_help_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shouting]Could use [short pause] a [emphasis] hand here!`

> Could use a hand here!


## combat_start

`guard_male_combat_start_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[angry] You picked the [short pause][emphasis] wrong guy!`

> You picked the wrong guy!


## danger_alert

`guard_male_danger_alert_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[loud][shouting] Alarm! [short pause] Stay inside and keep [emphasis] clear!`

> Alarm! Stay inside and keep clear!


## farewell

`guard_male_farewell_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`

> Move along, and stay out of trouble.

`guard_male_farewell_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`
- generation_input: `Safe travels. Keep your eyes open on the road.`

> Safe travels. Keep your eyes open on the road.


## greeting

`guard_male_greeting_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Good day. State your business.`

> Good day. State your business.

`guard_male_greeting_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Morning, traveler. Keep your weapons sheathed inside the settlement.`

> Morning, traveler. Keep your weapons sheathed inside the settlement.


## guard_response

`guard_male_guard_response_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[loud] Hold on! [short pause] I'm [emphasis] coming!`

> Hold on! I'm coming!


## quest_accepted

`guard_male_quest_accepted_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Good. I knew I could count on you.`

> Good. I knew I could count on you.

`guard_male_quest_accepted_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Very well. Report back when it’s done.`

> Very well. Report back when it's done.


## quest_complete

`guard_male_quest_complete_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Well done. You handled yourself well.`

> Well done. You handled yourself well.

`guard_male_quest_complete_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Good work. The settlement owes you thanks.`

> Good work. The settlement owes you thanks.


## quest_declined

`guard_male_quest_declined_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Very well. I’ll find someone else.`

> Very well. I'll find someone else.

`guard_male_quest_declined_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `That’s disappointing. I thought I could count on you.`

> That's disappointing. I thought I could count on you.


## quest_offer

`guard_male_quest_offer_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`

> I could use someone capable. Interested in some work?

`guard_male_quest_offer_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`
- generation_input: `We have a problem that needs dealing with. Think you can handle it?`

> We have a problem that needs dealing with. Think you can handle it?


## refusal

`guard_male_refusal_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `No. I can’t allow that.`

> No. I can't allow that.

`guard_male_refusal_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`

> Not permitted. You'll have to find another way.


## thanks

`guard_male_thanks_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `You have my thanks.`

> You have my thanks.

`guard_male_thanks_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Good work. You’ve done us a service.`

> Good work. You've done us a service.


## warning

`guard_male_warning_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Stay alert. We’ve had trouble outside the walls.`

> Stay alert. We've had trouble outside the walls.

`guard_male_warning_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`

> Careful beyond the gate. The roads are not safe.


## weather_shelter

`guard_male_weather_shelter_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[loud] Rain's coming down [emphasis] hard. [short pause] Better get inside.`

> Rain's coming down hard. Better get inside.


## well_wish

`guard_male_well_wish_01.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `in_repo`
- generation_input: `Stay safe out there.`

> Stay safe out there.

`guard_male_well_wish_02.mp3`
- voice_id: `c29549f41b3b4aa498d66d76fba0e887`
- status: `planned`

> Good luck. Keep your wits about you.


---

# Hunter male

Provider: Fish Audio.

Voice: `hunter` — `bd22266aba38416cb602e90ce651520c`.

## acknowledgement

`hunter_male_acknowledgement_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> I hear you.

`hunter_male_acknowledgement_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> Alright. I understand.


## agree

`hunter_male_agree_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Alright. Sounds good.`

> Alright. Sounds good.

`hunter_male_agree_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> Fine by me. Let's do it.


## attention

`hunter_male_attention_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Hey. Over here a moment.`

> Hey. Over here a moment.

`hunter_male_attention_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> Excuse me. Could I ask you something?


## call_for_help

`hunter_male_call_for_help_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shouting]Could use [short pause] a [emphasis] hand here!`

> Could use a hand here!


## combat_start

`hunter_male_combat_start_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Alright. [short pause] Let's [emphasis] finish this.`

> Alright. Let's finish this.


## danger_alert

`hunter_male_danger_alert_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shouting] [emphasis] Danger! [pause] Keep your distance!`

> Danger! Keep your distance!


## farewell

`hunter_male_farewell_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Watch your step out there.`

> Watch your step out there.

`hunter_male_farewell_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Stay downwind, and keep your eyes open.`

> Stay downwind, and keep your eyes open.


## greeting

`hunter_male_greeting_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Morning. Heading into the woods?`

> Morning. Heading into the woods?

`hunter_male_greeting_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Good to see you. Been traveling far?`

> Good to see you. Been traveling far?


## quest_accepted

`hunter_male_quest_accepted_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Good. Meet me back here when you’re done.`

> Good. Meet me back here when you're done.

`hunter_male_quest_accepted_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Alright. Keep quiet and don’t take unnecessary risks.`

> Alright. Keep quiet and don't take unnecessary risks.


## quest_complete

`hunter_male_quest_complete_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Nicely done. You know how to handle yourself.`

> Nicely done. You know how to handle yourself.

`hunter_male_quest_complete_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Good work. Not everyone comes back from a job like that.`

> Good work. Not everyone comes back from a job like that.


## quest_declined

`hunter_male_quest_declined_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Fair enough. I’ll manage somehow.`

> Fair enough. I'll manage somehow.

`hunter_male_quest_declined_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Shame. I could’ve used another pair of hands.`

> Shame. I could've used another pair of hands.


## quest_offer

`hunter_male_quest_offer_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `I’ve got a job, if you’re not afraid of the woods.`

> I've got a job, if you're not afraid of the woods.

`hunter_male_quest_offer_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> There's something out there I could use help with.


## refusal

`hunter_male_refusal_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> No. Not worth the risk.

`hunter_male_refusal_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> I'd leave that alone if I were you.


## thanks

`hunter_male_thanks_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Thanks. I owe you one.`

> Thanks. I owe you one.

`hunter_male_thanks_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Much appreciated. That’ll help.`

> Much appreciated. That'll help.


## warning

`hunter_male_warning_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Keep away from the deep woods after dark.`

> Keep away from the deep woods after dark.

`hunter_male_warning_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `planned`

> If you see fresh tracks, think before following them.


## well_wish

`hunter_male_well_wish_01.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `Good hunting.`

> Good hunting.

`hunter_male_well_wish_02.mp3`
- voice_id: `bd22266aba38416cb602e90ce651520c`
- status: `in_repo`
- generation_input: `May the trail be kind to you.`

> May the trail be kind to you.


---

# General female / villager

Provider: Fish Audio.

Voice: `Warm Conversational` — `5e3be339f2df45e6a1a338bb2ce94800`.

## acknowledgement

`general_female_acknowledgement_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> I understand.

`general_female_acknowledgement_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Alright. I'll keep that in mind.


## agree

`general_female_agree_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `Alright. That sounds good.`

> Alright. That sounds good.

`general_female_agree_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Of course. Let's do it.


## attention

`general_female_attention_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Excuse me! Have you got a moment?

`general_female_attention_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Traveler! Could I speak with you?


## call_for_help

`general_female_call_for_help_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shout] Oh! [pause] Help! [emphasis] [shouting]Support needed!`

> Oh! Help! Support needed!


## child_farewell

`general_female_child_farewell_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Bye! See you later!`

> Bye! See you later!

`general_female_child_farewell_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `See you later!`

> See you later!


## child_greeting

`general_female_child_greeting_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[excited] Hi! [emphasis] Want to play? [laughing]`

> Hi! Want to play?


## danger_alert

`general_female_danger_alert_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[loud] Alert! [short pause] Everyone, [emphasis] watch out!`

> Alert! Everyone, watch out!


## exhausted

`general_female_exhausted_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[tired] I need to [emphasis] sit down [short pause] for a while.`

> I need to sit down for a while.


## farewell

`general_female_farewell_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `Take care of yourself.`

> Take care of yourself.

`general_female_farewell_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Safe travels. Come back soon.


## greeting

`general_female_greeting_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `Hello there. Good to see you.`

> Hello there. Good to see you.

`general_female_greeting_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Good day. How are you doing?


## old_farewell

`general_female_old_farewell_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Take care, dear. And mind your step.`

> Take care, dear. And mind your step.

`general_female_old_farewell_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Take care of yourself out there.`

> Take care of yourself out there.


## old_greeting

`general_female_old_greeting_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Well now, what brings you my way?`

> Well now, what brings you my way?


## quest_accepted

`general_female_quest_accepted_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Thank you. I knew I could count on you.

`general_female_quest_accepted_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> That means a lot. Come back when it's done.


## quest_complete

`general_female_quest_complete_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `You did it. Thank you so much`

> You did it! Thank you so much.

`general_female_quest_complete_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> I'm glad you came back. You've been a great help.


## quest_declined

`general_female_quest_declined_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `Oh... I see. Maybe someone else can help`

> Oh... I see. Maybe someone else can help.

`general_female_quest_declined_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> That's a shame. I was really hoping you would.


## quest_offer

`general_female_quest_offer_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> I could use some help, if you have a moment.

`general_female_quest_offer_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> There's something troubling me. Would you be willing to help?


## refusal

`general_female_refusal_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> No, thank you. Not today.

`general_female_refusal_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> I'd rather not, if you don't mind.


## thanks

`general_female_thanks_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `Thank you. I really appreciate it.`

> Thank you. I really appreciate it.

`general_female_thanks_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> That's very kind of you. Thank you.


## warning

`general_female_warning_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Be careful out there. It isn't safe after dark.

`general_female_warning_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Mind your footing on the road, especially after dark.


## weather_shelter

`general_female_weather_shelter_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[nervous] This weather's getting [emphasis] worse. [short pause] Time to get under cover.`

> This weather's getting worse. Time to get under cover.


## well_wish

`general_female_well_wish_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Good luck out there.

`general_female_well_wish_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Take care, and may you have a safe journey.


---

# Merchant female

Provider: Fish Audio.

Voice: `Expressive Female Voice` — `d4f161bee1934b47ad3090f05649270c`.

## agree

`merchant_female_agree_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Alright. We have a deal`

> Alright. We have a deal.

`merchant_female_agree_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `planned`

> Very well. That works for me.


## attention

`merchant_female_attention_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Traveler! A moment, if you please.`

> Traveler! A moment, if you please.

`merchant_female_attention_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `planned`

> Good day. Could we have a word?


## farewell

`merchant_female_farewell_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Safe travels. Come back if you need anything.`

> Safe travels. Come back if you need anything.

`merchant_female_farewell_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Take care out there. I’ll be here if you need supplies.`

> Take care out there. I'll be here if you need supplies.


## greeting

`merchant_female_greeting_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Welcome, traveler. Looking for something useful today?`

> Welcome, traveler. Looking for something useful today?

`merchant_female_greeting_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Ah, a customer. Come, take a look.`

> Ah, a customer. Come, take a look.

`merchant_female_greeting_03.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Ah, a traveler! Come, take a look. I might have just what you need.`

> Ah, a traveler! Come, take a look. I might have just what you need.


## quest_accepted

`merchant_female_quest_accepted_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Excellent. Come back when it’s done.`

> Excellent. Come back when it's done.

`merchant_female_quest_accepted_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Good. I knew you looked dependable.`

> Good. I knew you looked dependable.


## quest_complete

`merchant_female_quest_complete_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Well done. You’ve earned your reward.`

> Well done. You've earned your reward.

`merchant_female_quest_complete_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Excellent work. Here, this is yours.`

> Excellent work. Here, this is yours.


## quest_declined

`merchant_female_quest_declined_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `A pity. I suppose I’ll have to ask someone else.`

> A pity. I suppose I'll have to ask someone else.

`merchant_female_quest_declined_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `planned`

> Shame. I thought you might be interested.


## quest_offer

`merchant_female_quest_offer_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `I may have a little work for someone willing to earn a few coins.`

> I may have a little work for someone willing to earn a few coins.

`merchant_female_quest_offer_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `There’s something I need taken care of. Interested?`

> There's something I need taken care of. Interested?


## refusal

`merchant_female_refusal_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `I’m afraid I can’t agree to that.`

> I'm afraid I can't agree to that.

`merchant_female_refusal_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `planned`

> I'm sorry, but that won't work for me.


## thanks

`merchant_female_thanks_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Thank you. Always a pleasure doing business.`

> Thank you. Always a pleasure doing business.

`merchant_female_thanks_02.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `planned`

> Much appreciated. You've been very helpful.


## warning

`merchant_female_warning_01.mp3`
- voice_id: `d4f161bee1934b47ad3090f05649270c`
- status: `in_repo`
- generation_input: `Careful on the road. Goods aren’t the only thing bandits are after.`

> Careful on the road. Goods aren't the only thing bandits are after.


---

# Shepherd male

Provider: Fish Audio.

Voice: `hetalia Russia` — `4af16ba03cee422996ec29a43e1947ee`.

## danger_alert

`shepard_male_danger_alert_01.mp3`
- voice_id: `4af16ba03cee422996ec29a43e1947ee`
- status: `in_repo`
- note: filename typo `shepard_`; profile `shepherd_male`. Recovered from Fish generation-history 2026-10-09 (intent match 🟡)
- generation_input: `[shouting] [emphasis] Wolf in the flock! [pause] [shouting] Get! away! from! the! sheep!!`

> Wolf in the flock! Get! away! from! the! sheep!!


## farewell

`shepherd_male_farewell_01.mp3`
- voice_id: `4af16ba03cee422996ec29a43e1947ee`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Take care. Keep clear of the wolves.`

> Take care. Keep clear of the wolves.


## greeting

`shepherd_male_greeting_01.mp3`
- voice_id: `4af16ba03cee422996ec29a43e1947ee`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Hello there. [short pause] Looking for [emphasis] wool, or just passing through?`

> Hello there. Looking for wool, or just passing through?

`shepherd_male_greeting_02.mp3`
- voice_id: `4af16ba03cee422996ec29a43e1947ee`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `Morning. Keeping an eye on the flock?`

> Morning. Keeping an eye on the flock?


## livestock_danger

`shepherd_male_livestock_danger_01.mp3`
- voice_id: `4af16ba03cee422996ec29a43e1947ee`
- status: `in_repo`
- note: recovered from Fish generation-history 2026-10-09 (intent/heuristic match 🟡 — not listen-verified against this filename)
- generation_input: `[shouting] [emphasis] Wolf in the flock! [pause] [shouting] Get! away! from! the! sheep!!`

> Wolf in the flock! Get! away! from! the! sheep!!


---

# Campfire conversation POC

Campfire lines reuse `campfire_female` / `campfire_male` voice ids (aliases of general). Second campfire profiles are not a priority this round.

## Weather

`campfire_female_weather_question_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`

> Cold tonight, isn't it?

`campfire_male_weather_question_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `Think this wind will last?`

> Think this wind will last?

`campfire_female_weather_answer_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `[breathy] Maybe. [short pause] It usually [emphasis] turns before dawn.`

> Maybe. It usually turns before dawn.

`campfire_male_weather_answer_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `Yeah. [soft] Feels like [emphasis] rain by morning. [pause]`

> Yeah. Feels like rain by morning.


## Work

`campfire_female_work_question_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `You look exhausted. Been working all day?`

> You look exhausted. Been working all day?

`campfire_male_work_question_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `Long day?`

> Long day?

`campfire_female_work_answer_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `[breathy] Since sunrise. I’m glad to [emphasis] finally sit down.`

> Since sunrise. I'm glad to finally sit down.

`campfire_male_work_answer_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `[breathy] Pretty much. There’s always something that needs doing around here.`

> Pretty much. There's always something that needs doing around here.


## Road / world

`campfire_female_road_question_01.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `You hear anything from the road today? Travelers have been coming through more often.`

> You hear anything from the road today? Travelers have been coming through more often.

`campfire_male_road_question_02.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `Anything interesting happen outside the settlement?`

> Anything interesting happen outside the settlement?

`campfire_female_road_answer_02.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `in_repo`
- generation_input: `Not much. Saw fresh tracks near the forest, though. Bigger than deer. I wouldn’t wander out there alone tonight.`

> Not much. Saw fresh tracks near the forest, though. Bigger than deer. I wouldn't wander out there alone tonight.

`campfire_male_road_answer_01.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `in_repo`
- generation_input: `Mostly the usual. Bad weather, wolves near the woods, and someone saying the northern trail isn’t as safe as it used to be.`

> Mostly the usual. Bad weather, wolves near the woods, and someone saying the northern trail isn't as safe as it used to be.


---

# Planned diversity — profile B slots

Second Fish timbre per scope×gender. Fish UUIDs for all `*_b` profiles are in **Voice sources** above (Phase 0 done 2026-10-09). Filenames use a `_b` marker before the variant number so they do not collide with primary-profile clips.

**Resume (2026-10-20, editorial revision):** `general_male_b` **38/38** (Brian British), `general_female_b` **38/38** (Hannah), `guard_male_b` **40/40**, and `merchant_female_b` **38/38** (Laura), and `hunter_male_b` **38/38** (Cowboy), and `shepherd_male_b` **10/10** (Sleepless historian) are `in_repo`. Remaining B-slot Fish batches: none. The revised `merchant_female_b` / `guard_male_b` / hunter / shepherd scripts keep every filename and voice ID. **Production gate:** use this revised catalog only after the dialogue review branch is merged; if a planned clip has since been generated on another branch, reconcile that file and its real spoken text first. Cursor lane only — browser, no Fish API. PCM bypass: `_temp/fish-barks/receiver.mjs` + `_temp/bin/ffmpeg`.

Naming for B-slot planned files:

```text
<scope>_<gender>_b_<keyword>_<variant>.mp3
```

## general_male_b

### greeting

`general_male_b_greeting_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Well met. What brings you this way?`
> Well met. What brings you this way?

`general_male_b_greeting_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Ah, a visitor. Welcome.`
> Ah, a visitor. Welcome.


### farewell

`general_male_b_farewell_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Until next time. Mind the path.`
> Until next time. Mind the path.

`general_male_b_farewell_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Farewell. May the road treat you kindly.`
> Farewell. May the road treat you kindly.


### attention

`general_male_b_attention_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Hey — over here a moment.`
> Hey — over here a moment.

`general_male_b_attention_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Pardon me. Could I have a word?`
> Pardon me. Could I have a word?


### thanks

`general_male_b_thanks_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Thank you kindly. That helps a great deal.`
> Thank you kindly. That helps a great deal.

`general_male_b_thanks_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `I'm grateful. Truly.`
> I'm grateful. Truly.


### agree

`general_male_b_agree_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Agreed. Let's get on with it.`
> Agreed. Let's get on with it.

`general_male_b_agree_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Fine by me. We'll do it that way.`
> Fine by me. We'll do it that way.


### refusal

`general_male_b_refusal_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Sorry. I can't help with that.`
> Sorry. I can't help with that.

`general_male_b_refusal_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `I'd rather decline. No hard feelings.`
> I'd rather decline. No hard feelings.


### warning

`general_male_b_warning_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Watch yourself out there. Things have been [emphasis] restless.`
> Watch yourself out there. Things have been restless.

`general_male_b_warning_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Take care beyond the fields. Soft ground and sharp teeth.`
> Take care beyond the fields. Soft ground and sharp teeth.


### well_wish

`general_male_b_well_wish_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Good fortune to you.`
> Good fortune to you.

`general_male_b_well_wish_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Go carefully. I hope you find what you need.`
> Go carefully. I hope you find what you need.


### quest_offer

`general_male_b_quest_offer_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `There's a job that needs doing, if you're willing.`
> There's a job that needs doing, if you're willing.

`general_male_b_quest_offer_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `I could use a capable pair of hands. Interested?`
> I could use a capable pair of hands. Interested?


### quest_accepted

`general_male_b_quest_accepted_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Glad to hear it. Don't take too long.`
> Glad to hear it. Don't take too long.

`general_male_b_quest_accepted_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Good. I'll be waiting for news.`
> Good. I'll be waiting for news.


### quest_declined

`general_male_b_quest_declined_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `As you wish. Someone else will have to do it.`

> As you wish. Someone else will have to do it.

`general_male_b_quest_declined_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Understood. Perhaps another day.`
> Understood. Perhaps another day.


### quest_complete

`general_male_b_quest_complete_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `That's that, then. Well done.`
> That's that, then. Well done.

`general_male_b_quest_complete_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `You've finished it cleanly. Here — your due.`
> You've finished it cleanly. Here — your due.


### danger_alert

`general_male_b_danger_alert_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[shouting] [emphasis] Threat nearby! Stay sharp!`
> Threat nearby! Stay sharp!

`general_male_b_danger_alert_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[shouting] Look out — something [emphasis] hostile!`
> Look out — something hostile!


### combat_start

`general_male_b_combat_start_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[shouting] So be it. Let's [emphasis] settle this!`
> So be it. Let's settle this!

`general_male_b_combat_start_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[shouting] Enough talk. [emphasis] Draw!`
> Enough talk. Draw!


### call_for_help

`general_male_b_call_for_help_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[shouting] Help me! [emphasis] Please!`
> Help me! Please!

`general_male_b_call_for_help_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `I need help over here!`

> I need help over here!


### exhausted

`general_male_b_exhausted_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[tired] I'm worn out. I have to [emphasis] rest.`

> I'm worn out. I have to rest.

`general_male_b_exhausted_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `[tired] My legs are done. Give me a moment.`

> My legs are done. Give me a moment.


### hungry

`general_male_b_hungry_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `I need [emphasis] food before I can keep going.`

> I need food before I can keep going.

`general_male_b_hungry_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `My stomach's empty. Work can wait.`

> My stomach's empty. Work can wait.


### weather_shelter

`general_male_b_weather_shelter_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `This weather's turning [emphasis] nasty. Seeking cover.`

> This weather's turning nasty. Seeking cover.

`general_male_b_weather_shelter_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Best get under a roof before it gets worse.`

> Best get under a roof before it gets worse.


### work_finished

`general_male_b_work_finished_01.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Done for now. That's a fair day's work.`

> Done for now. That's a fair day's work.

`general_male_b_work_finished_02.mp3`
- voice_id: `65c0b8155c464a648161af8877404f11`
- status: `in_repo`
- generation_input: `Finished. Time to put the tools away.`

> Finished. Time to put the tools away.


## general_female_b

### greeting

`general_female_b_greeting_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Well met. What brings you this way?`

> Well met. What brings you this way?

`general_female_b_greeting_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Ah, a visitor. Welcome.`

> Ah, a visitor. Welcome.


### farewell

`general_female_b_farewell_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Until next time. Mind the path.`

> Until next time. Mind the path.

`general_female_b_farewell_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Farewell. May the road treat you kindly.`

> Farewell. May the road treat you kindly.


### attention

`general_female_b_attention_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Hey — over here a moment.`

> Hey — over here a moment.

`general_female_b_attention_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Pardon me. Could I have a word?`

> Pardon me. Could I have a word?


### thanks

`general_female_b_thanks_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Thank you kindly. That helps a great deal.`

> Thank you kindly. That helps a great deal.

`general_female_b_thanks_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `I'm grateful. Truly.`

> I'm grateful. Truly.


### agree

`general_female_b_agree_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Agreed. Let's get on with it.`

> Agreed. Let's get on with it.

`general_female_b_agree_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Fine by me. We'll do it that way.`

> Fine by me. We'll do it that way.


### refusal

`general_female_b_refusal_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Sorry. I can't help with that.`

> Sorry. I can't help with that.

`general_female_b_refusal_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `I'd rather decline. No hard feelings.`

> I'd rather decline. No hard feelings.


### warning

`general_female_b_warning_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Watch yourself out there. Things have been restless.`

> Watch yourself out there. Things have been restless.

`general_female_b_warning_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Take care beyond the fields. Soft ground and sharp teeth.`

> Take care beyond the fields. Soft ground and sharp teeth.


### well_wish

`general_female_b_well_wish_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Good fortune to you.`

> Good fortune to you.

`general_female_b_well_wish_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Go carefully. I hope you find what you need.`

> Go carefully. I hope you find what you need.


### quest_offer

`general_female_b_quest_offer_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `There's a job that needs doing, if you're willing.`

> There's a job that needs doing, if you're willing.

`general_female_b_quest_offer_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `I could use a capable pair of hands. Interested?`

> I could use a capable pair of hands. Interested?


### quest_accepted

`general_female_b_quest_accepted_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Glad to hear it. Don't take too long.`

> Glad to hear it. Don't take too long.

`general_female_b_quest_accepted_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Good. I'll be waiting for news.`

> Good. I'll be waiting for news.


### quest_declined

`general_female_b_quest_declined_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `As you wish. Someone else will have to do it.`

> As you wish. Someone else will have to do it.

`general_female_b_quest_declined_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Understood. Perhaps another day.`

> Understood. Perhaps another day.


### quest_complete

`general_female_b_quest_complete_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `That's that, then. Well done.`

> That's that, then. Well done.

`general_female_b_quest_complete_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `You've finished it cleanly. Here — your due.`

> You've finished it cleanly. Here — your due.


### danger_alert

`general_female_b_danger_alert_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[loud] Threat nearby! Stay sharp!`

> Threat nearby! Stay sharp!

`general_female_b_danger_alert_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[loud] Look out — something hostile!`

> Look out — something hostile!


### combat_start

`general_female_b_combat_start_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[angry] So be it. Let's settle this!`

> So be it. Let's settle this!

`general_female_b_combat_start_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[angry] Enough talk. Draw!`

> Enough talk. Draw!


### call_for_help

`general_female_b_call_for_help_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[shouting] Help me! Please!`

> Help me! Please!

`general_female_b_call_for_help_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[shouting] I need help over here!`

> I need help over here!


### exhausted

`general_female_b_exhausted_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[tired] I'm worn out. I have to rest.`

> I'm worn out. I have to rest.

`general_female_b_exhausted_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `[tired] My legs are done. Give me a moment.`

> My legs are done. Give me a moment.


### hungry

`general_female_b_hungry_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `I need food before I can keep going.`

> I need food before I can keep going.

`general_female_b_hungry_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `My stomach's empty. Work can wait.`

> My stomach's empty. Work can wait.


### weather_shelter

`general_female_b_weather_shelter_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `This weather's turning nasty. Seeking cover.`

> This weather's turning nasty. Seeking cover.

`general_female_b_weather_shelter_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Best get under a roof before it gets worse.`

> Best get under a roof before it gets worse.


### work_finished

`general_female_b_work_finished_01.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Done for now. That's a fair day's work.`

> Done for now. That's a fair day's work.

`general_female_b_work_finished_02.mp3`
- voice_id: `9a9cf47702da476aa4629e2506d4a857`
- status: `in_repo`
- generation_input: `Finished. Time to put the tools away.`

> Finished. Time to put the tools away.


## merchant_female_b

### greeting

`merchant_female_b_greeting_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Good day. Is there something on your mind?`

> Good day. Is there something on your mind?

`merchant_female_b_greeting_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Hello there. Looking for a chat, or something particular?`

> Hello there. Looking for a chat, or something particular?


### farewell

`merchant_female_b_farewell_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Take care. I hope the rest of your day goes well.`

> Take care. I hope the rest of your day goes well.

`merchant_female_b_farewell_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Until we meet again. Look after yourself.`

> Until we meet again. Look after yourself.


### attention

`merchant_female_b_attention_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Excuse me, could we speak for a moment?`

> Excuse me, could we speak for a moment?

`merchant_female_b_attention_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `A word, if you have the time?`

> A word, if you have the time?


### thanks

`merchant_female_b_thanks_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `You've saved me a lot of bother. Thank you.`

> You've saved me a lot of bother. Thank you.

`merchant_female_b_thanks_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `That was thoughtful of you. I'm grateful.`

> That was thoughtful of you. I'm grateful.


### agree

`merchant_female_b_agree_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `That sounds fair to me.`

> That sounds fair to me.

`merchant_female_b_agree_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Yes, let's do it that way.`

> Yes, let's do it that way.


### refusal

`merchant_female_b_refusal_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I'm sorry, but I can't agree to that.`

> I'm sorry, but I can't agree to that.

`merchant_female_b_refusal_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Not this time, I'm afraid.`

> Not this time, I'm afraid.


### warning

`merchant_female_b_warning_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Keep your purse close in a crowded market.`

> Keep your purse close in a crowded market.

`merchant_female_b_warning_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `A tired traveller should be careful whom they trust.`

> A tired traveller should be careful whom they trust.


### well_wish

`merchant_female_b_well_wish_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `May you meet honest people on the road.`

> May you meet honest people on the road.

`merchant_female_b_well_wish_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I hope things go well for you.`

> I hope things go well for you.


### quest_offer

`merchant_female_b_quest_offer_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I've a favour to ask, if you have the time.`

> I've a favour to ask, if you have the time.

`merchant_female_b_quest_offer_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `There's a matter I could use help with. Will you hear me out?`

> There's a matter I could use help with. Will you hear me out?


### quest_accepted

`merchant_female_b_quest_accepted_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Thank you. That takes a weight off my mind.`

> Thank you. That takes a weight off my mind.

`merchant_female_b_quest_accepted_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Good. I appreciate you taking this on.`

> Good. I appreciate you taking this on.


### quest_declined

`merchant_female_b_quest_declined_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `That's all right. I had to ask.`

> That's all right. I had to ask.

`merchant_female_b_quest_declined_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Fair enough. I'll see what else I can do.`

> Fair enough. I'll see what else I can do.


### quest_complete

`merchant_female_b_quest_complete_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `You saw it through. Thank you.`

> You saw it through. Thank you.

`merchant_female_b_quest_complete_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I'm grateful you came back with it settled.`

> I'm grateful you came back with it settled.


### danger_alert

`merchant_female_b_danger_alert_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Get back! There's danger here!`

> Get back! There's danger here!

`merchant_female_b_danger_alert_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Look out! Keep away from it!`

> Look out! Keep away from it!


### combat_start

`merchant_female_b_combat_start_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Stay back! I mean it!`

> Stay back! I mean it!

`merchant_female_b_combat_start_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I don't want a fight, but I'll defend myself!`

> I don't want a fight, but I'll defend myself!


### call_for_help

`merchant_female_b_call_for_help_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Somebody, please help!`

> Somebody, please help!

`merchant_female_b_call_for_help_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Help! Over here!`

> Help! Over here!


### exhausted

`merchant_female_b_exhausted_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I've been on my feet too long.`

> I've been on my feet too long.

`merchant_female_b_exhausted_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I need to sit for a while.`

> I need to sit for a while.


### hungry

`merchant_female_b_hungry_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I could do with a proper meal.`

> I could do with a proper meal.

`merchant_female_b_hungry_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `I should eat before I do anything else.`

> I should eat before I do anything else.


### weather_shelter

`merchant_female_b_weather_shelter_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Best find cover until this passes.`

> Best find cover until this passes.

`merchant_female_b_weather_shelter_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `We ought to get out of this rain.`

> We ought to get out of this rain.


### work_finished

`merchant_female_b_work_finished_01.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `That's enough for today. Time to put things in order.`

> That's enough for today. Time to put things in order.

`merchant_female_b_work_finished_02.mp3`
- voice_id: `merchant_female_b`
- status: `in_repo`
- generation_input: `Finished for now. The rest can wait.`

> Finished for now. The rest can wait.


## guard_male_b

### greeting

`guard_male_b_greeting_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Good day. Need a word with the watch?`

> Good day. Need a word with the watch?

`guard_male_b_greeting_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Hello there. How's your day going?`

> Hello there. How's your day going?


### farewell

`guard_male_b_farewell_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Take care. Mind your footing on the road.`

> Take care. Mind your footing on the road.

`guard_male_b_farewell_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Safe journey. Hope it's a quiet one.`

> Safe journey. Hope it's a quiet one.


### attention

`guard_male_b_attention_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Excuse me. Could you stop a moment?`

> Excuse me. Could you stop a moment?

`guard_male_b_attention_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `You there. I need a word, please.`

> You there. I need a word, please.


### thanks

`guard_male_b_thanks_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Thank you. That makes my work easier.`

> Thank you. That makes my work easier.

`guard_male_b_thanks_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Much obliged. That was good of you.`

> Much obliged. That was good of you.


### agree

`guard_male_b_agree_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `That sounds sensible. Let's do it.`

> That sounds sensible. Let's do it.

`guard_male_b_agree_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `All right. I'll see what I can do.`

> All right. I'll see what I can do.


### refusal

`guard_male_b_refusal_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Sorry, I can't help you with that.`

> Sorry, I can't help you with that.

`guard_male_b_refusal_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `No. That wouldn't be right.`

> No. That wouldn't be right.


### warning

`guard_male_b_warning_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Keep an eye on the road beyond the houses.`

> Keep an eye on the road beyond the houses.

`guard_male_b_warning_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Mind where you wander after dark.`

> Mind where you wander after dark.


### well_wish

`guard_male_b_well_wish_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Stay safe. I mean that.`

> Stay safe. I mean that.

`guard_male_b_well_wish_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `I hope your road is a quiet one.`

> I hope your road is a quiet one.


### quest_offer

`guard_male_b_quest_offer_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `There's a problem I can't ignore. Will you hear me out?`

> There's a problem I can't ignore. Will you hear me out?

`guard_male_b_quest_offer_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `I could use another pair of eyes on something. Interested?`

> I could use another pair of eyes on something. Interested?


### quest_accepted

`guard_male_b_quest_accepted_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Thank you. That will help us.`

> Thank you. That will help us.

`guard_male_b_quest_accepted_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Good. I appreciate you stepping in.`

> Good. I appreciate you stepping in.


### quest_declined

`guard_male_b_quest_declined_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `I understand. I'll have to try another way.`

> I understand. I'll have to try another way.

`guard_male_b_quest_declined_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Fair enough. It's a lot to ask.`

> Fair enough. It's a lot to ask.


### quest_complete

`guard_male_b_quest_complete_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `You've done well. I appreciate the help.`

> You've done well. I appreciate the help.

`guard_male_b_quest_complete_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `That's handled, then. Good work.`

> That's handled, then. Good work.


### danger_alert

`guard_male_b_danger_alert_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[urgent] Get clear! Danger ahead!`

> Get clear! Danger ahead!

`guard_male_b_danger_alert_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[urgent] Move away! Keep clear!`

> Move away! Keep clear!


### combat_start

`guard_male_b_combat_start_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[firm] Stand down! I don't want to hurt you!`

> Stand down! I don't want to hurt you!

`guard_male_b_combat_start_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[firm] All right, then. I'll stop you myself!`

> All right, then. I'll stop you myself!


### call_for_help

`guard_male_b_call_for_help_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[urgent] I need help here! Now!`

> I need help here! Now!

`guard_male_b_call_for_help_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[urgent] Another pair of hands, quickly!`

> Another pair of hands, quickly!


### exhausted

`guard_male_b_exhausted_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `I need a moment off my feet.`

> I need a moment off my feet.

`guard_male_b_exhausted_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `I'm tired enough to miss a step. Time to rest.`

> I'm tired enough to miss a step. Time to rest.


### hungry

`guard_male_b_hungry_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `I need a bite before I go back to it.`

> I need a bite before I go back to it.

`guard_male_b_hungry_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `An empty belly makes for a poor watch.`

> An empty belly makes for a poor watch.


### weather_shelter

`guard_male_b_weather_shelter_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `This rain's making it hard to see.`

> This rain's making it hard to see.

`guard_male_b_weather_shelter_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `Get out of this weather if you can.`

> Get out of this weather if you can.


### work_finished

`guard_male_b_work_finished_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `My watch is done. I can put my feet up.`

> My watch is done. I can put my feet up.

`guard_male_b_work_finished_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `That's the end of my duty for now.`

> That's the end of my duty for now.


### guard_response

`guard_male_b_guard_response_01.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[urgent] Hold on! I'm coming to help!`

> Hold on! I'm coming to help!

`guard_male_b_guard_response_02.mp3`
- voice_id: `guard_male_b`
- status: `in_repo`
- generation_input: `[urgent] Keep back from it! I'll come to you!`

> Keep back from it! I'll come to you!


## hunter_male_b

### greeting

`hunter_male_b_greeting_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Hello there. What brings you this way?`

> Hello there. What brings you this way?

`hunter_male_b_greeting_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Good day. Need a hand with something?`

> Good day. Need a hand with something?


### farewell

`hunter_male_b_farewell_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Mind your footing on rough ground.`

> Mind your footing on rough ground.

`hunter_male_b_farewell_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Take care. No hurry's worth a broken ankle.`

> Take care. No hurry's worth a broken ankle.


### attention

`hunter_male_b_attention_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Could you spare a moment?`

> Could you spare a moment?

`hunter_male_b_attention_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Here a moment, if you're free.`

> Here a moment, if you're free.


### thanks

`hunter_male_b_thanks_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Much obliged. That saved me some trouble.`

> Much obliged. That saved me some trouble.

`hunter_male_b_thanks_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Thank you. That was decent of you.`

> Thank you. That was decent of you.


### agree

`hunter_male_b_agree_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `That'll do. Let's go with it.`

> That'll do. Let's go with it.

`hunter_male_b_agree_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Makes sense to me.`

> Makes sense to me.


### refusal

`hunter_male_b_refusal_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `No, I can't oblige.`

> No, I can't oblige.

`hunter_male_b_refusal_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `I'd sooner leave it be.`

> I'd sooner leave it be.


### warning

`hunter_male_b_warning_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Don't follow a trail you can't find your way back from.`

> Don't follow a trail you can't find your way back from.

`hunter_male_b_warning_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Best not to rush on unfamiliar ground.`

> Best not to rush on unfamiliar ground.


### well_wish

`hunter_male_b_well_wish_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Hope the paths stay clear for you.`

> Hope the paths stay clear for you.

`hunter_male_b_well_wish_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `May you find your way home before dark.`

> May you find your way home before dark.


### quest_offer

`hunter_male_b_quest_offer_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `There's a matter I could use help with. Are you willing?`

> There's a matter I could use help with. Are you willing?

`hunter_male_b_quest_offer_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `I've a favour to ask. Have you a moment?`

> I've a favour to ask. Have you a moment?


### quest_accepted

`hunter_male_b_quest_accepted_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Good. Keep your head, and we'll manage.`

> Good. Keep your head, and we'll manage.

`hunter_male_b_quest_accepted_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Thanks. That's a load off my mind.`

> Thanks. That's a load off my mind.


### quest_declined

`hunter_male_b_quest_declined_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Fair enough. I'll find another way.`

> Fair enough. I'll find another way.

`hunter_male_b_quest_declined_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `No harm done. It was worth asking.`

> No harm done. It was worth asking.


### quest_complete

`hunter_male_b_quest_complete_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `You kept your word. Well done.`

> You kept your word. Well done.

`hunter_male_b_quest_complete_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `That's settled. Good work.`

> That's settled. Good work.


### danger_alert

`hunter_male_b_danger_alert_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Keep back! Something's near!`

> Keep back! Something's near!

`hunter_male_b_danger_alert_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `[urgent] Move! Get clear of it!`

> Move! Get clear of it!


### combat_start

`hunter_male_b_combat_start_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `[firm] I warned you. Stay back!`

> I warned you. Stay back!

`hunter_male_b_combat_start_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `[firm] All right. I'll defend myself!`

> All right. I'll defend myself!


### call_for_help

`hunter_male_b_call_for_help_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `[urgent] Over here! I need help!`

> Over here! I need help!

`hunter_male_b_call_for_help_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `[urgent] Help! Quickly, this way!`

> Help! Quickly, this way!


### exhausted

`hunter_male_b_exhausted_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Need a rest. Can't think straight like this.`

> Need a rest. Can't think straight like this.

`hunter_male_b_exhausted_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `I've walked enough for one day.`

> I've walked enough for one day.


### hungry

`hunter_male_b_hungry_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `I'd better eat before I set off again.`

> I'd better eat before I set off again.

`hunter_male_b_hungry_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Time for something to eat.`

> Time for something to eat.


### weather_shelter

`hunter_male_b_weather_shelter_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Weather's turned. Best find cover.`

> Weather's turned. Best find cover.

`hunter_male_b_weather_shelter_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `I'm not staying out in this if I can help it.`

> I'm not staying out in this if I can help it.


### work_finished

`hunter_male_b_work_finished_01.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `Done for now. Time to clean the gear.`

> Done for now. Time to clean the gear.

`hunter_male_b_work_finished_02.mp3`
- voice_id: `hunter_male_b`
- status: `in_repo`
- generation_input: `I've done what I came to do. That's enough.`

> I've done what I came to do. That's enough.


## shepherd_male_b

### livestock_danger

`shepherd_male_b_livestock_danger_01.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Away from the sheep! Get back!`

> Away from the sheep! Get back!

`shepherd_male_b_livestock_danger_02.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Keep the flock together! Move!`

> Keep the flock together! Move!


### greeting

`shepherd_male_b_greeting_01.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Hello there. How are you keeping?`

> Hello there. How are you keeping?

`shepherd_male_b_greeting_02.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Good day. Have you a moment to talk?`

> Good day. Have you a moment to talk?


### farewell

`shepherd_male_b_farewell_01.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Take care. There's no need to hurry.`

> Take care. There's no need to hurry.

`shepherd_male_b_farewell_02.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Go safely. Mind your step on the slopes.`

> Go safely. Mind your step on the slopes.


### danger_alert

`shepherd_male_b_danger_alert_01.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Look out! Keep back!`

> Look out! Keep back!

`shepherd_male_b_danger_alert_02.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Move away! There's trouble!`

> Move away! There's trouble!


### call_for_help

`shepherd_male_b_call_for_help_01.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Help! I can't manage this alone!`

> Help! I can't manage this alone!

`shepherd_male_b_call_for_help_02.mp3`
- voice_id: `shepherd_male_b`
- status: `in_repo`
- generation_input: `Over here! I need a hand!`

> Over here! I need a hand!


---

# Planned age-band variants (primary profiles)

Extra English lines for age-banded general clips. Existing on-disk age-band files stay `text_unknown` above until listened; these rows are for future generation / re-voice.

## general_male_young_greeting

`general_male_young_greeting_11.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Hey. You new around here?

`general_male_young_greeting_12.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Morning. Nice day for a walk.


## general_male_young_farewell

`general_male_young_farewell_11.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> See you around.

`general_male_young_farewell_12.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Until next time. Take care.


## general_male_old_greeting

`general_male_old_greeting_11.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Good day, young one.

`general_male_old_greeting_12.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Good day. Is there something you'd like to ask?


## general_male_old_farewell

`general_male_old_farewell_11.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Go with care, child.

`general_male_old_farewell_12.mp3`
- voice_id: `c2a3921fd7024b9189cb912bdfe5266a`
- status: `planned`

> Watch your footing, especially on the bends.


## general_female_child_greeting

`general_female_child_greeting_11.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Hello!

`general_female_child_greeting_12.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Hi there!


## general_female_child_farewell

`general_female_child_farewell_11.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`
- generation_input: `Bye! See you later!`

> Bye!

`general_female_child_farewell_12.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> See you!


## general_female_old_greeting

`general_female_old_greeting_11.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> It's good to see you. How can I help?

`general_female_old_greeting_12.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Good day to you.


## general_female_old_farewell

`general_female_old_farewell_11.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`
- generation_input: `Take care of yourself out there.`

> Take care of yourself out there.

`general_female_old_farewell_12.mp3`
- voice_id: `5e3be339f2df45e6a1a338bb2ce94800`
- status: `planned`

> Safe journey, love.


---

# Mark Hornblower (`mark_hornblower` / `G01`)

Actor-specific profile. Fish: `Friendly Male Voice` — `2adcdee4b3ce4b648dc16ea65430ea76`.  
Author casting approval: 2026-10-20. Quality **pilot only** (6 lines); remaining Hornblower pack text is not authorized for recording without a separate ask. Does not replace `guard_male` / `guard_male_b`. Runtime resolver still M7/M9 (D-ROAD-10).

## greeting

`npc_mark_hornblower_greeting_01.mp3`
- voice_id: `2adcdee4b3ce4b648dc16ea65430ea76`
- status: `in_repo`
- editorial_ref: `mark.greeting`
- generation_input: `Good day. Is there anything I can help with?`

> Good day. Is there anything I can help with?

## road_advice

`npc_mark_hornblower_road_advice_01.mp3`
- voice_id: `2adcdee4b3ce4b648dc16ea65430ea76`
- status: `in_repo`
- editorial_ref: `mark.road.reply`
- generation_input: `If you're out late, keep to the road. It's easier to find you if you need help.`

> If you're out late, keep to the road. It's easier to find you if you need help.

## farewell

`npc_mark_hornblower_farewell_01.mp3`
- voice_id: `2adcdee4b3ce4b648dc16ea65430ea76`
- status: `in_repo`
- editorial_ref: `mark.leave.reply`
- generation_input: `Look after yourself, will you? I'll see you around.`

> Look after yourself, will you? I'll see you around.

## daily

`npc_mark_hornblower_daily_01.mp3`
- voice_id: `2adcdee4b3ce4b648dc16ea65430ea76`
- status: `in_repo`
- editorial_ref: `hornblower.mark.daily.02`
- generation_input: `You learn who's had a hard day if you bother to listen.`

> You learn who's had a hard day if you bother to listen.

## danger_alert

`npc_mark_hornblower_danger_alert_01.mp3`
- voice_id: `2adcdee4b3ce4b648dc16ea65430ea76`
- status: `in_repo`
- editorial_ref: `hornblower.mark.alert.01`
- generation_input: `Back! Get clear of it!`

> Back! Get clear of it!

## thanks

`npc_mark_hornblower_thanks_01.mp3`
- voice_id: `2adcdee4b3ce4b648dc16ea65430ea76`
- status: `in_repo`
- editorial_ref: `hornblower.mark.thanks.01`
- generation_input: `I appreciate that. It means a good deal.`

> I appreciate that. It means a good deal.


---

# Coverage checklist (on-disk)

Total MP3 in `public/sounds/voices/`: **317** (on-disk recount 2026-10-20; includes +6 Mark Hornblower pilot). Prior checklist figure of 185 was stale after `*_b` batches.

With catalog quote at import: **71**.
`text_unknown` remaining: **0** (after Fish history recovery 2026-10-09: recovered 38).

Every on-disk file must appear above with `voice_id` and `status` `in_repo` or `text_unknown`.

---

# Fish generation-history scrape (2026-10-09)

Source: [Generation History](https://fish.audio/app/generation-history/). Scraped **134** unique prompt strings (tags included). Machine dump: [`fish-generation-history-2026-10-09.json`](./fish-generation-history-2026-10-09.json).

Recovered into `text_unknown` clips: **38**. Enriched existing quotes with `generation_input`: **76**.

Filename↔take matching for recoveries is **intent/heuristic only** (🟡). Listen to confirm before treating as authoritative.

## Prompts not yet attached to a catalog filename

- `Could use [short pause] a [emphasis] hand here!`
- `Hello there. Looking for wool, or just passing through?`
- `Hello there. Looking for wool? or just passing through?`
- `Hello, you're new around here?`
- `Hi! Want to play?`
- `I should get back home now.`
- `Maybe. It usually turns before dawn.`
- `Maybe. [short pause] It usually [emphasis] turns before dawn.`
- `Maybe... It usually [emphasis] turns before dawn.`
- `Maybe... [short pause] It usually [emphasis] turns before dawn.`
- `Off you go, then. May the road treat you kindly.`
- `Pretty much. There’s always something that needs doing around here.`
- `Since sunrise. I’m glad to [emphasis] finally sit down.`
- `Since sunrise. I’m glad to finally sit down.`
- `Yeah. [soft] Feels like [emphasis] rain by morning.`
- `[excited] Hi! Want to play?`
- `[loud] Everyone, [short pause] [emphasis]watch out!`
- `[loud] Rain's coming down hard. [short pause] Better get [emphasis] inside.`
- `[loud] Rain's coming down hard. [short pause] Better get inside.`
- `[nervous] Oh! [pause] Help! [emphasis] Support needed!`
- `[nervous] [emphasis] Help! [short pause] Someone! quickly!`
- `[nervous] [emphasis] Help! [short pause] Someone, quickly!`
- `[shout] Oh! [pause] Help! [emphasis] Support needed!`
- `[shouting] Alarm! [short pause] Stay inside and keep [emphasis] clear!`
- `[shouting] [emphasis] Help! [short pause] Help! Someone! [short pause] [emphasis] quickly!`
- `[shouting] [emphasis] Help! [short pause] Help! Someone! [short pause] quickly!`
- `[shouting] [emphasis] Help! [short pause] Help! Someone! quickly!`
- `[shouting] [emphasis] Help! [short pause] Help! Someone, quickly!`
- `[shouting] [emphasis] Wolf in the flock! [pause] Get away from the sheep!`
- `[shouting] [emphasis] Wolf in the flock! [pause] Get away from the sheep!!`
- `[shouting] [emphasis] Wolf in the flock! [pause] [shouting] Get away from the sheep!`
- `[shouting]Could use a [emphasis] hand here!`
- `[shouting]Could use a hand here!`
- `[soft] Since sunrise. I’m glad to [emphasis] finally sit down.`
- `[tired] I need to [emphasis] sit down for a while.`

