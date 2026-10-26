# NPC greeting library — hierarchical text candidates

**Status:** `draft`
**Created:** 2026-10-15
**Domain:** dialogue, NPC, social knowledge
**Roadmap:** M4 generic NPC talk; M7 authored quest recognition; M9 known deeds and crime exposure
**Depends on:** D-CMP-13, D-NPC-22, D-ROAD-19/S4, quests--004 Q1
**Finished:** —

This is a reusable **text library for any generated or authored NPC**, not a list of Saltmere residents. It extends the five [Saltmere conversation drafts](saltmere-daily-conversations.md). The library records candidate lines and their eligibility; it does not establish a runtime social resolver, reputation thresholds, a new achievement system or a voice/MP3 assignment. The M4 implementation must use the eventual S4 relationship, reputation and knowledge owners. Until then, all conditional branches are draft content, not playable promises.

## Source and reuse

The [V1 NPC Voice Catalog](NPC-VOICE-CATALOG.md) already contains English general, age and profession greetings. V1 `legacy/seedvale/src/ai/dialogueTemplates.ts` contributes the reusable self/village/work *topics*, but its Polish text and random personality buckets are not directly playable English lines. V2 `legacy/SeedVales/src/ui/panels/DialogPanel.vue` supplies the neutral/friendly/hostile greeting idea and three short lines; V2 `legacy/SeedVales/src/game/sim/memory.ts` supplies remarks for remembered deeds. Their old `opinion > 30` / `< -30` checks and global-badge exposure are **not** current selection rules. The [port ledger](../state/PORT-LEDGER.md#economy-and-quests) still records dialogue as M4 and known deeds as M9. Current V3 [profession flavour](../../src/game/data/npc/flavour.ts) remains a separate bark bank, available for ordinary conversation responses.

`V1:<stem>` below means verbatim text from the voice catalog's `<stem>.mp3` entry; it does **not** mean that clip is verified for this actor or played by M4. `V2:panel` and `V2:memory` mean verbatim lines from the named files. `New` marks a fresh text candidate where the old projects have no safe, fitting line. Text IDs do not include names, sex, profession or a current relationship score in a way that would change an NPC's identity or save key.

## Hierarchy and eligibility

```text
greeting/
  known_deed/         concrete occurrence known to this speaker; later M7/M9
  personal_relation/  this NPC's directed opinion of the player; M4 after S4
  local_standing/     applicable settlement reputation, if S4 defines a query
  profession/         actual profession and appropriate encounter context
  age/                child or elder fallback, where the line fits the actor
  general/            male/female corpus variants, then common fallback
```

This is a **fallback hierarchy for text authoring**, not a frozen priority algorithm. M4/S4 decides how simultaneous eligible signals resolve, including hostility versus favourable public standing. Selection must not concatenate branches into incoherent praise and accusation. The sex buckets preserve useful existing V1 wording and future voice availability; English meaning must not depend on sex, and any NPC can use a suitable common line. The actor's actual role, age and location still govern whether a line fits. No generic NPC calls a player “hero” merely because renown is high: the speaker needs evidence of a specific beneficial deed and a reason to approve it.

Public achievements are facts in the player's record, **not** proof that an NPC knows them. A settlement known deed is local, and an individual can know an event without an achievement. A rumour received elsewhere may be false, incomplete or not yet propagated. A character may react only to a fact available through the eventual NPC/community knowledge owner. Lawful grave access must never satisfy a grave-disturbance accusation. Choose the neutral fallback whenever the required knowledge, scope or source is absent.

## `greeting/general` — available without social state

| Text ID | Suggested eligibility | English text | Source |
|---|---|---|---|
| `greeting.general.common.01` | Any speaking NPC | Good day, traveller. | V2:panel, neutral |
| `greeting.general.common.02` | Any speaking NPC | Good day. How are you doing? | V1:`general_male_greeting_02` / `general_female_greeting_02` |
| `greeting.general.male.01` | Male corpus variant | Hello, traveler. Good to see you. | V1:`general_male_greeting_01` |
| `greeting.general.female.01` | Female corpus variant | Hello there. Good to see you. | V1:`general_female_greeting_01` |
| `greeting.general.male.02` | Male corpus variant | Good to see you. Been traveling far? | V1:`general_male_old_greeting_01`; no elder-only meaning |
| `greeting.general.female.02` | Female corpus variant | Well now, what brings you my way? | V1:`general_female_old_greeting_01`; no elder-only meaning |

The `male`/`female` labels describe the V1 voice text source and candidate pool. They are not a rule that NPCs of one sex must always sound alike. The all-actor `common` fallbacks cover missing or unsuitable variants.

## `greeting/age` — only when age makes the line natural

| Text ID | Suggested eligibility | English text | Source |
|---|---|---|---|
| `greeting.age.child.01` | Child who can converse | Hi! Want to play? | V1:`general_female_child_greeting_01`; wording is usable for any child |
| `greeting.age.child.02` | Child who can converse | Hey! I haven't seen you around before. | V1:`general_male_young_greeting_02`; use only when genuinely unfamiliar |
| `greeting.age.elder.01` | Elder who already recognizes the player | Ah, there you are. Come, speak your mind. | V1:`general_male_old_greeting_02` |
| `greeting.age.elder.02` | Elder, any sex | Well now, what brings you my way? | V1:`general_female_old_greeting_01` |

## `greeting/personal_relation` — seven accepted tiers

These labels and inclusive ranges are D-NPC-22. The line condition is the **speaker's** opinion of the player, not the player's opinion of the speaker or settlement standing. Neutral is the general fallback. The lines are candidate tone, not entitlement to a service or proof that the NPC remembers a particular meeting.

| Tier | Score | Text ID | English text | Source |
|---|---:|---|---|---|
| Hostile | −100…−61 | `greeting.relation.hostile.01` | What do you want? | V2:panel hostile greeting |
| Hostile | −100…−61 | `greeting.relation.hostile.02` | Speak quickly. What do you need? | New; ordinary lawful talk remains possible |
| Unfriendly | −60…−21 | `greeting.relation.unfriendly.01` | Good day. What is it? | New; ordinary talk remains possible |
| Unfriendly | −60…−21 | `greeting.relation.unfriendly.02` | You can speak. Keep it brief. | New |
| Neutral | −20…20 | `greeting.relation.neutral.01` | Good day, traveller. | V2:panel neutral greeting |
| Positive | 21…40 | `greeting.relation.positive.01` | Good to see you! | V2:panel friendly greeting; V3 tier differs |
| Positive | 21…40 | `greeting.relation.positive.02` | Hello again. How have you been? | New; only if this actor has met the player |
| Warm | 41…60 | `greeting.relation.warm.01` | There you are. It's good to see you. | New; only if familiar |
| Warm | 41…60 | `greeting.relation.warm.02` | Come, tell me how your day has gone. | New |
| Friendly | 61…80 | `greeting.relation.friendly.01` | I'm glad you came by. | New |
| Friendly | 61…80 | `greeting.relation.friendly.02` | It's always good to see you. | New |
| Close | 81…100 | `greeting.relation.close.01` | I'm glad you're here. | New |
| Close | 81…100 | `greeting.relation.close.02` | Stay a while. Tell me what's on your mind. | New |

No tier alone offers lodging, food, gifts, quest rewards or secrets.

## `greeting/local_standing` — public standing, not personal affection

The current `src/game/data/character/reputation.ts` is a display placeholder. S4 must decide which dimensions and thresholds constitute applicable local standing; these descriptive buckets do not pick numbers or average dimensions into a new score. Use the **speaker's current settlement**, or an explicitly known foreign settlement in an authored line, never a global value guessed from the player's UI.

| Text ID | Suggested eligibility | English text | Source |
|---|---|---|---|
| `greeting.standing.respected.01` | Local community recognizes repeated helpful conduct; speaker aware | People here speak well of you. Good day. | New |
| `greeting.standing.respected.02` | Same; only if this speaker accepts the community view | Welcome back. You've done right by this place. | New |
| `greeting.standing.wary.01` | Local community is wary; speaker aware | I've heard concerns. What brings you here? | New |
| `greeting.standing.wary.02` | Local concern without a proven charge | Good day. I'll hear what you have to say. | New |

Do not use a positive local line for a hostile NPC automatically. Do not turn low local standing into a false accusation of a specific crime. Reputation can reflect many causes; a named deed line requires its own known fact.

## `greeting/known_deed` — named facts, staged by supplier

Every row requires a **real event or status** plus knowledge in this speaker or this settlement, not a UI badge alone. `Later` means the underlying fact/exposure or social owner is not currently supplied in V3; it is text inventory, not M4 output. The words “our village” are valid only for a beneficiary community the speaker belongs to. Prefer a direct witness or participant for a personal thank-you. An NPC may disagree with public praise.

| Text ID | Required known fact | English text | Source and earliest gate |
|---|---|---|---|
| `greeting.deed.defender.01` | Speaker knows the player resolved a concrete threat to this settlement | Hello, hero. Our village owes you much. | New; M7+ real incident/evidence, local approval |
| `greeting.deed.defender.02` | Speaker knows a specific dangerous animal deed that benefited this community | They say you have killed beasts that troubled us. We are grateful. | V2:memory `beast_slayer`; M6/M7 event + knowledge |
| `greeting.deed.quest_participant.01` | Speaker personally participated in a completed quest and knows the player's act | I won't forget what you did. | Adapted V2:memory; M7 event/actor binding |
| `greeting.deed.rat_catcher.01` | Speaker knows actual rat control here; farmer or trader accepts it | Thank you for dealing with the rats. | V2:memory `rat_catcher`; later real rat supplier |
| `greeting.deed.healer.01` | Speaker knows the player successfully treated a local person or animal | You've helped people here heal. Thank you. | New; later health + local knowledge |
| `greeting.deed.caretaker.01` | Speaker knows repeated local corpse care | Thank you for keeping this place clean. | New; later real corpse/deed supplier |
| `greeting.deed.theft.01` | Speaker knows the player was caught stealing here or received credible local news | I heard you were caught stealing. Don't try that here. | V2:memory `thief`, narrowed to known local fact; M9 exposure |
| `greeting.deed.grave_robber.01` | This settlement knows an **unauthorized exposed grave disturbance** | I heard you disturbed the graves. What do you want? | New; V1 local `grave_robber` precedent, M9 exposure |
| `greeting.deed.grave_robber.02` | Same; speaker is directly affected or openly condemns it | You're not welcome among the graves. State your business. | New; M9, contextual access authority required |

“Grave digger” is an occupation as well as an insult, so an accusation should describe the proven act. A legal search under specific permission is not the same fact as desecration. The V1 local known-deed identifiers `caretaker`, `healer` and `grave_robber` are **reference names**, not established V3 runtime IDs. V1 global `treasure_hunter` / `relic_seeker` achievements alone do not unlock any spoken claim of public knowledge.

## `greeting/profession` — ordinary work context

This bank is keyed by current V3 `ProfessionId`, so it applies to generated NPCs as well as authored ones. A work line is eligible only if the actor's role and encounter context fit; use the general fallback while travelling, resting or off duty. An item mention never creates stock or opens a transaction. Texts marked `New` fill roles without a safe greeting in the V1 voice catalog; they may be replaced by a suitable V1/V2 line if one is found in a later bounded source audit.

| Profession | Text ID | English text | Source |
|---|---|---|---|
| `guard` | `greeting.job.guard.01` | Good day. State your business. | V1:`guard_male_greeting_01` |
| `trader` | `greeting.job.trader.01` | Welcome, traveler. Looking for something useful today? | V1:`merchant_female_greeting_01`; only at an actual trading opportunity |
| `hunter` | `greeting.job.hunter.01` | Morning. Heading into the woods? | V1:`hunter_male_greeting_01`; morning and near a viable route |
| `shepherd` | `greeting.job.shepherd.01` | Morning. Keeping an eye on the flock? | V1:`shepherd_male_greeting_02`; only with a real flock |
| `farmer` | `greeting.job.farmer.01` | Good day. The fields keep us busy. | New; only where the NPC really works fields |
| `woodcutter` | `greeting.job.woodcutter.01` | Good day. Careful around the timber. | New; near timber work |
| `herbalist` | `greeting.job.herbalist.01` | Good day. Are you looking for a remedy? | New; only when service/stock actually available |
| `blacksmith` | `greeting.job.blacksmith.01` | Good day. Mind the hot iron. | New; near an active forge |
| `miner` | `greeting.job.miner.01` | Good day. Watch your footing by the workings. | New; real mine/worksite |
| `fisher` | `greeting.job.fisher.01` | Good day. Keep clear of the nets. | New; near real net work |
| `miller` | `greeting.job.miller.01` | Good day. Mind the sacks. | New; real mill/worksite, not Saltmere |
| `carpenter` | `greeting.job.carpenter.01` | Good day. Keep back while I cut. | New; active workshop |
| `charcoal_burner` | `greeting.job.charcoal_burner.01` | Good day. Stay clear of the covered heap. | New; active charcoal work |
| `innkeeper` | `greeting.job.innkeeper.01` | Welcome. What brings you in? | New; actual inn, not Saltmere |

## M4/M7/M9 binding examples and checks

| Situation | Eligible candidate | Required guard |
|---|---|---|
| Unknown generated NPC, no social state | `greeting.general.*` | No invented familiarity or work context |
| Generated guard at a post | `greeting.job.guard.01` | Real duty/location, otherwise general |
| Personally Hostile NPC in a respected settlement | Hostile or neutral line | S4 resolves precedence; no forced public praise |
| Friendly NPC with no knowledge of a hidden treasure | Friendly or general line | No achievement-based revelation |
| Settlement knows the player defended it from a real threat | `greeting.deed.defender.*` | Same beneficiary, incident resolved, speaker aware and approving |
| Player legally examines a permitted grave | General/relation line | No `grave_robber` accusation |
| Player disturbs a grave unseen and unexposed | General/relation line | No omniscient accusation |
| Local grave disturbance is exposed | `greeting.deed.grave_robber.*` | Same settlement and actual known unauthorized event |

At implementation time, test fallback coverage for both V3 sex values and all 14 profession IDs; every generated NPC must have a valid greeting even without relationship/reputation/deed state. Test that changes of display name do not change line IDs, that repeated opening does not mutate relationship or knowledge, and that a save/load or Near/Mid transition does not invent or forget a known fact. M4 can ship general, age, relation and context-valid profession text once S4 supplies the social owner. Local standing needs the S4 query. Known-deed branches need the specific M7/M9 suppliers and exposure rules; do not enable the examples just because the text exists.
