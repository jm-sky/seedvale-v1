# Mark and Kate Hornblower — authored dialogue pack

**Status:** `draft` (text pack); Mark Fish voice + 6-line quality pilot `in_repo` 2026-10-20; Kate unbound; runtime still M7/M9  
**Created at:** 2026-10-20  
**Created by:** ChatGPT Sol  
**Updated at:** 2026-10-20  
**Updated by:** Composer — Mark casting approval + pilot handoff  
**Domain:** dialogue, named NPCs, Saltmere  
**Roadmap:** M4 ordinary conversations and character binding; conditional M5/M6 reactions; M7 quest dialogue; M9 knowledge/social use  
**Depends on:** D-NPC-23, D-NPC-22, D-NPC-21, Q0 cast, `src/game/data/npc/reserved.ts`, `saltmere-daily-conversations.md`  
**Decided by:** ChatGPT Sol — editorial differentiation of two established characters without proposing a new resolver, state owner or voice contract; Mark Fish UUID by author cast 2026-10-20

**Character reference:** [Mark Hornblower — personality, visual direction and contrast with Kate](mark-hornblower-character-profile.md). Use this profile for future dialogue rewrites and voice performance, while preserving the eligibility gates and current recorded-line status below.

## Identity and voice boundaries

- **Mark — `G01` / `mark_hornblower`:** 38, guard; sociable, steady-nerved, thorough; one ordinary *daytime* watch. Friendly without compulsory cheer, observant and responsible without treating every passer-by as a suspect. Short, practical wording; lets concern show through concrete advice.
- **Kate — `G02` / `kate_hornblower`:** 34, trader; talkative, warm, a night owl, practical and socially attentive. Engages people before talking goods. A clear commercial boundary is not personal hostility. More conversational and quick to ask questions than Mark.
- They are married and share the canonical guard-plot home. Neither possesses automatic knowledge of the other's current location, mood, business dealings or player conversations. The relationship is a **fact**, not a fixed positive opinion score.
- Their individual dialogue is **not** the `guard_male`, `guard_male_b`, `merchant_female` or `merchant_female_b` default corpus. Those profiles may supply noncontradictory generic fallbacks later; they are not a substitute for these authored texts.
- Mark now has an approved Fish UUID and a **6-line quality pilot** (see [Fish Audio — Mark casting + M4 handoff](#fish-audio--mark-casting--m4-handoff-2026-10-20)); that does not create a runtime selector. Kate remains unbound. All lines below remain text proposals except the six pilot MP3s. The six existing scene IDs are unchanged. Every `hornblower.*` ID beyond those six is an **editorial reference**, not a new accepted semantic runtime intent.

## Mark — warmth beneath an attentive watch

| Text reference | Line | Eligibility / narrative purpose |
|---|---|---|
| `mark.greeting` | Good day. Is there anything I can help with? | Default M4 scene greeting; neutral/friendly |
| `hornblower.mark.greeting.familiar.01` | There you are. How have you been keeping? | Only when he actually recognises the player |
| `hornblower.mark.greeting.duty.01` | Hello. I can spare a moment. What's the matter? | On watch and genuinely available to talk |
| `mark.road.reply` | If you're out late, keep to the road. It's easier to find you if you need help. | Response to an explicit road-advice question; conditional suggestion, not news of a current threat |
| `hornblower.mark.daily.01` | I don't mind the quiet days. People need them. | General reflection, *not* an assertion that today is quiet |
| `hornblower.mark.daily.02` | You learn who's had a hard day if you bother to listen. | Sociable, observant |
| `hornblower.mark.daily.03` | I can be particular about things being in their place. Kate would tell you that. | Self-aware thoroughness; occasional spouse mention |
| `hornblower.mark.daily.04` | Keeping watch is mostly noticing the small things. | Occupation without militarised language |
| `hornblower.mark.duty.01` | I ought to get back to my rounds. We'll talk again. | Actual rounds awaiting resumption; conversational exit only |
| `hornblower.mark.duty.02` | I can't leave the watch just now, I'm afraid. | Only when duty truly prevents the requested action |
| `hornblower.mark.advice.01` | If you don't know the ground, stick to a path you can follow home. | Asked for general outdoor advice |
| `hornblower.mark.advice.02` | Tell someone where you're going. It saves a lot of worry. | General advice; does not establish tracking/notification gameplay |
| `hornblower.mark.alert.01` | Back! Get clear of it! | Real perceived nearby threat, urgent and firm |
| `hornblower.mark.help.01` | Hold on! I'm coming! | Actual permitted guard response in progress; never on a failed dispatch |
| `hornblower.mark.tired.01` | I'm tired enough to overlook a loose latch. Better rest. | Real tiredness; metaphor, not a live loose-latch fault |
| `hornblower.mark.kate.01` | Kate says I still keep an eye on the door when I'm at home. She's probably right. | Occasional personal small talk; authored habit, not a tracked home action |
| `hornblower.mark.kate.02` | Kate gets people talking. I like hearing what they have to say. | Optional family small talk; avoids a location claim |
| `hornblower.mark.quest.01` | I've a concern I'd like your help with, if you'll hear me out. | M7 only with a real, active incident |
| `hornblower.mark.thanks.01` | I appreciate that. It means a good deal. | A real favour or help received |
| `mark.leave.reply` | Look after yourself, will you? I'll see you around. | Default M4 scene farewell |
| `hornblower.mark.farewell.duty.01` | Take care. Let me know if something's wrong. | End of a safe, interruptible exchange |

**Performance:** grounded and attentive; in danger, drop the conversational softness. Avoid an unbroken parade of orders, battle cries or jests. `mark.greeting` deliberately replaces the recorded generic guard line “Good day. State your business.” **That MP3 remains unchanged** and must not be assigned as the new scene line.

## Kate — warm, direct and perceptive

| Text reference | Line | Eligibility / narrative purpose |
|---|---|---|
| `kate.greeting` | Oh, hello! How's your day been? | Default M4 scene greeting; does not imply available stock |
| `hornblower.kate.greeting.familiar.01` | Oh, hello! How have you been? | Actually familiar player |
| `hornblower.kate.greeting.busy.01` | Hello! Give me a moment to finish this, will you? | Real, interruptible task in progress |
| `kate.work.reply` | Hold cloth to the light. Thin patches tell you more than the colour. | Asked about cloth quality; general advice, no current item |
| `hornblower.kate.daily.01` | I like knowing how people are getting on. There's always something to learn. | Talkative and interested in people; not omniscient |
| `hornblower.kate.daily.02` | Some days a good conversation is worth more than a sale. | Opinion, not an actual sale or shop offer |
| `hornblower.kate.daily.03` | If I'm not sure what someone means, I'd rather ask. | Clear, curious, practical |
| `hornblower.kate.daily.04` | An honest no is better than a promise you can't keep. | Warm yet firm |
| `hornblower.kate.trade.01` | Let me understand what you're looking for first. | Player asks about goods; not proof of inventory |
| `hornblower.kate.trade.02` | A fair exchange ought to leave both people satisfied. | General trade philosophy; not a price calculation |
| `hornblower.kate.trade.03` | I won't agree to something I can't make good on. | An actual proposed deal/request is unacceptable |
| `hornblower.kate.trade.04` | That depends on what you need, doesn't it? | Trade or service question; rhetorical, not a stock guarantee |
| `hornblower.kate.thanks.01` | That was kind of you. Thank you. | Real help received |
| `hornblower.kate.rest.01` | I could use a quiet moment. Just a little one. | Actual need to rest or voluntary break; no forced schedule |
| `hornblower.kate.alert.01` | Look out! Move away! | Real perceived danger; no invented attack |
| `hornblower.kate.help.01` | Help! Someone, over here! | Genuine distress, not generic greeting |
| `hornblower.kate.mark.01` | Mark takes his watch seriously. He takes people seriously, too. | Occasional spouse-related small talk; no claim of his present action |
| `hornblower.kate.mark.02` | He'll listen longer than most people think. That's Mark. | Another spouse aside; familiarity is canonical, not a new mechanic |
| `hornblower.kate.quest.01` | There's something I could use your help with. May I explain? | M7 only with a valid offer/incident |
| `hornblower.kate.refusal.01` | I'm sorry, but I can't promise that. | Refusal to a real request/commitment |
| `kate.leave.reply` | Come by again when you have a moment. | Default M4 scene farewell |
| `hornblower.kate.farewell.01` | Take care of yourself. I'd be glad to talk again. | Ordinary farewell |

**Performance:** welcoming without a permanent sales pitch; quick-thinking and curious, but willing to say no. `kate.greeting` replaces the generic recorded merchant greeting in her **draft scene only**; the existing MP3 is still valid for a properly staged merchant interaction.

## Scene integration — no new runtime contract

The six rows `mark.greeting`, `mark.road.reply`, `mark.leave.reply`, `kate.greeting`, `kate.work.reply`, `kate.leave.reply` have been updated **in place** in [17 Saltmere conversations](saltmere-daily-conversations.md). Player options and their IDs are unchanged. They do not play recorded clips just because an older catalogue line once furnished a source for the scene.

For M4, first resolve the existing canonical Q0 `actorKey` (`G01`/`G02`) through its accepted identity mapping, then make authored dialogue eligible only for that resolved actor and supported context. Prefer its approved individual text when available; fall back to compatible profession/general text for unhandled intents. Reuse the M4/S4 owner for relationship, speech style, NPC knowledge, perception, action/availability and interruption decisions. Never use a first-name search, a profession-wide “Hornblower personality” flag, or a second actor/relationship store. **This is editorial routing guidance, not a proposed manifest or resolver API.**

Do not choose the `familiar`, `busy`, `duty`, `tired`, `alert`, `help` or `quest` rows without their stated real suppliers. The household identity establishes that the two are spouses; it does not reveal a recent meeting or enable a messenger quest. Do not promise rewards, shelter, inventory, travel or quest access through these lines. In particular, Mark's day shift remains [06:00,18:00); his presence at a Q07 evening scene or G03 night-torch incident needs the existing M7 scheduling resolution, not a dialogue override.

## Fish Audio — Mark casting + M4 handoff (2026-10-20)

**Mark voice identity (approved):** Fish `Friendly Male Voice` — UUID `2adcdee4b3ce4b648dc16ea65430ea76` → catalog profile `mark_hornblower`. Casting samples and author taste ledger: [voice-production-notes.md](./voice-production-notes.md). Does **not** replace `guard_male` / `guard_male_b`.

**Quality pilot (authorized, landed):** six MP3 under `public/sounds/voices/`:

| File | Editorial ref | Status |
|---|---|---|
| `npc_mark_hornblower_greeting_01.mp3` | `mark.greeting` | `in_repo` |
| `npc_mark_hornblower_road_advice_01.mp3` | `mark.road.reply` | `in_repo` |
| `npc_mark_hornblower_farewell_01.mp3` | `mark.leave.reply` | `in_repo` |
| `npc_mark_hornblower_daily_01.mp3` | `hornblower.mark.daily.02` | `in_repo` |
| `npc_mark_hornblower_danger_alert_01.mp3` | `hornblower.mark.alert.01` | `in_repo` |
| `npc_mark_hornblower_thanks_01.mp3` | `hornblower.mark.thanks.01` | `in_repo` |

**Not authorized without a separate ask:** remaining Hornblower pack lines (~37), Kate casting, runtime resolver wiring (still M7 pilot / M9 per D-ROAD-10). Catalog rows: [NPC-VOICE-CATALOG.md](./NPC-VOICE-CATALOG.md) → Mark Hornblower.

## Editorial self-review

- Mark's routine lines contain questions, attention and everyday self-awareness, not “state your business” or a permanent military persona.
- Kate's questions, observations and boundaries differ in rhythm from Mark's watchful reassurance. Only a minority of either character's lines refer to their job or spouse.
- The six immediately usable draft scene lines require no new relationship, inventory, quest or threat state.
- Every other line has a documented eligibility gate; **no such runtime supplier or playable audio is claimed here**.
