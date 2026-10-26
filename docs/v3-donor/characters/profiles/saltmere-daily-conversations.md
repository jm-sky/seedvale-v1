# Saltmere daily conversations — 17 resident drafts

**Status:** `draft`
**Updated at:** 2026-10-24 (ChatGPT Sol; shared player/pair voice scripts)  
**Updated by:** ChatGPT Sol  
**Created:** 2026-10-15
**Created at:** 2026-10-15  
**Created by:** ChatGPT Sol (metadata normalization; original authors retained in git)
**Domain:** dialogue, NPC
**Roadmap:** M4 conversations (quests--004 Q1)
**Depends on:** D-NPC-23, Q0 cast, D-CMP-13; S4 knowledge and relationship review before runtime binding
**Finished:** —

These 17 base non-quest exchanges are the editorial source for the current [ordinary conversation manifest](../../src/game/data/dialogue/ordinaryConversations.ts). At main `a1a44dce`, NPC–player text talk is live and the code also has three extra topics per actor plus dynamic activity/weather and conditional trade. Code owns the effective published text and supplier checks; this earlier base draft is not a complete runtime inventory. Audio remains gated: these text rows do not approve casting or bind MP3s. Every `speaker` below is the canonical Q0 cast key resolved to the real actor, not a display-name lookup. The appended shared voice scenes are new editorial proposals only.

The `*.greeting` rows are scene examples. The reusable [greeting library](greetings.md) owns future greeting selection for these actors and generated NPCs; M4 may select another eligible line without changing the scene's topic and option IDs.

## Reuse rule and source audit

Prefer existing lines before drafting new ones. `V1 voice` means the existing English text in [NPC Voice Catalog](NPC-VOICE-CATALOG.md), carried from v1. `V1 template` means the *structure* of `legacy/seedvale/src/ai/dialogueTemplates.ts` (`aboutSelfLine`, `aboutVillageLine`, `goodbyeLine`); its Polish strings need English adaptation and its old random/archetype selection is not copied. `V2 panel` means `legacy/SeedVales/src/ui/panels/DialogPanel.vue` and its short neutral greeting. `V3 flavour` means the already accepted English [profession barks](../../src/game/data/npc/flavour.ts), used verbatim or explicitly adapted where they fit this actor. `New` marks fresh text, including player prompts and the few NPC replies for which no source line fits. These are source references, not a port of either conversation engine. The [port ledger](../state/PORT-LEDGER.md#economy-and-quests) still marks the playable dialogue surface for M4.

The V1 voice catalog contains generic role lines, not complete player/NPC trees. V2's general panel supplies a greeting and actions, but its quest topics, gifts, bed requests, opinion thresholds and NPC-stopping behaviour are outside this batch. Existing voice clips are **not** assigned to these text IDs; the voice catalog's `in_repo` status does not establish that a clip matches this scene or actor.

| Conversation | Exact existing NPC lines / all NPC lines | Other source use | New text |
|---|---:|---|---|
| Mark `G01` | 0 / 3 | V1 guard lines audited and intentionally not reused as this individual's default tone | three actor-authored NPC lines and player prompts |
| Kate `G02` | 0 / 3 | V1 merchant and V3 trader lines audited; actor-specific wording selected | three actor-authored NPC lines and player prompts |
| Dora `H01` | 2 / 3 | V1 voice greeting and farewell; V3 herbalist bark minimally adapted | player prompts and one-word adaptation |
| Ralph `L01` | 2 / 3 | V2 panel greeting; V1 voice farewell; V1 self-introduction template adapted to canonical name and job | player prompts and adapted self-introduction |
| Elder `E01` | 3 / 3 | V1 voice old greeting, old farewell and general warning | player prompts only |

`V3 flavour` lines are present-day approved text rather than a fresh rewrite of their V1/V2 antecedents. Dora's scene uses an adapted V3 bark; Mark and Kate now use dedicated draft text from the [Hornblower dialogue pack](saltmere-hornblowers-dialogue-pack.md), preserving their existing scene and option IDs. The additional 12 scenes were checked against the same V1 catalog and templates, V2 panel/conversation surface, and V3 bark bank before writing new replies. V1/V2 have no safe actor-specific daily tree for these 12; their quest text carries superseded casts, sites or promises. No exact old quest scene is reused here: old names, offers and consequences would silently import superseded premises. The source cell on **every row** distinguishes verbatim reuse, adaptation and new writing.

## Text and IDs

An option points to one NPC reply, then the conversation returns to the same topic menu. The `leave` option closes the conversation after its farewell. Replies do not assert a quest state, stocked item, discovered site, current weather or current NPC activity. The live M4/S4 owner decides reachability and interruption using the real actor state. Line and option IDs remain stable if a working display name changes.

### `saltmere.daily.mark` — `G01` Mark Hornblower

| ID | Speaker | Text | Source |
|---|---|---|---|
| `mark.greeting` | `G01` | Good day. Is there anything I can help with? | New; [Hornblower pack](saltmere-hornblowers-dialogue-pack.md), ordinary greeting |
| `mark.road.option` | player | Any advice for the road? | New |
| `mark.road.reply` | `G01` | If you're out late, keep to the road. It's easier to find you if you need help. | New; Hornblower pack, hypothetical travel advice |
| `mark.leave.option` | player | I should go. | New |
| `mark.leave.reply` | `G01` | Look after yourself, will you? I'll see you around. | New; Hornblower pack, ordinary farewell |

### `saltmere.daily.kate` — `G02` Kate Hornblower

| ID | Speaker | Text | Source |
|---|---|---|---|
| `kate.greeting` | `G02` | Oh, hello! How's your day been? | New; Hornblower pack, ordinary greeting |
| `kate.work.option` | player | What makes cloth worth buying? | New |
| `kate.work.reply` | `G02` | Hold cloth to the light. Thin patches tell you more than the colour. | New; Hornblower pack, cloth advice, no current stock implied |
| `kate.leave.option` | player | I'll look around. | New |
| `kate.leave.reply` | `G02` | Come by again when you have a moment. | New; Hornblower pack, ordinary farewell |

Kate's greeting is conversational, not evidence of sale stock, a trade offer or an accessible shop. Her cloth advice describes a general test, not a present item. Neither scene assigns or replaces any existing MP3. The six actor-specific replacements are authored M4 candidates, not proof of a selectable actor-specific runtime voice.

### `saltmere.daily.dora` — `H01` Dora Herbert

| ID | Speaker | Text | Source |
|---|---|---|---|
| `dora.greeting` | `H01` | Hello there. Good to see you. | V1 voice `general_female_greeting_01` |
| `dora.herbs.option` | player | When should yarrow be gathered? | New |
| `dora.herbs.reply` | `H01` | Yarrow should be gathered before rain. | V3 flavour `herbalist.barks[0]`, one-word adaptation |
| `dora.leave.option` | player | Thank you. Goodbye. | New |
| `dora.leave.reply` | `H01` | Take care of yourself. | V1 voice `general_female_farewell_01` |

The yarrow line is ordinary advice, not a reveal of a current herb node, a claim that Dora has harvested stock, or a prediction of live weather. Removing “This” avoids implying that a particular plant is in view.

### `saltmere.daily.ralph` — `L01` Ralph Fieldman

| ID | Speaker | Text | Source |
|---|---|---|---|
| `ralph.greeting` | `L01` | Good day, traveller. | V2 panel neutral greeting |
| `ralph.work.option` | player | What do you do here? | New; V1 `aboutSelfLine` topic |
| `ralph.work.reply` | `L01` | I'm Ralph Fieldman, the reeve of Saltmere. I farm as well. | Adapted from V1 `aboutSelfLine`; D-NPC-23 identity/job |
| `ralph.leave.option` | player | Goodbye. | New |
| `ralph.leave.reply` | `L01` | Take care out there. | V1 voice `general_male_farewell_01` |

Ralph's possible reeve office stays provisional. This scene states only his canonical farming role and does not claim authority to grant a job, land access or a rumour.

### `saltmere.daily.elder` — `E01` local former adventurer

| ID | Speaker | Text | Source |
|---|---|---|---|
| `elder.greeting` | `E01` | Ah, there you are. Come, speak your mind. | V1 voice `general_male_old_greeting_02` |
| `elder.road.option` | player | Any thoughts on the old roads? | New |
| `elder.road.reply` | `E01` | Go safely. These old roads have their dangers. | V1 voice `general_male_old_farewell_01` |
| `elder.leave.option` | player | I'll be on my way. | New |
| `elder.leave.reply` | `E01` | Take care of yourself. | V1 voice `general_male_old_farewell_02` |

This is generic caution, not a precise map tip, quest lead, revelation of his past, or promise of his owned sword. E01's working name does not appear.

**Woodward character-writing reference:** [Peter and Ann Woodward profiles](woodward-character-profiles.md). Future `W01` and `W02` dialogue revisions should follow these personalities; existing generic lines remain drafts, not approved actor recordings.

## Remaining 12 residents

These scenes use the other 12 keys in the [Q0 cast](../quests/canon/q0-cast-and-names.md). Names in headings identify drafts only; working names do not appear in spoken text. Occupational replies offer general advice, not proof of current work, stocked goods, finished production, owned land or a nearby resource. Toby and Hazel are children: their topics imply no labour, guard duty or persistent illness. The V1 child text is a **phrase source**, not an assigned adult voice clip.

### `saltmere.daily.fisher` — `F01` fisher

| ID | Speaker | Text | Source |
|---|---|---|---|
| `fisher.greeting` | `F01` | Hello, traveler. Good to see you. | V1 voice `general_male_greeting_01` |
| `fisher.nets.option` | player | Any advice before casting a net? | New |
| `fisher.nets.reply` | `F01` | Mend the mesh before casting. | Adapted V3 flavour `fisher.barks[2]`; removes “this” so no net in hand is implied |
| `fisher.leave.option` | player | I'll leave you to it. | New |
| `fisher.leave.reply` | `F01` | Take care out there. | V1 voice `general_male_farewell_01` |

### `saltmere.daily.toby` — `H02` Toby Herbert

| ID | Speaker | Text | Source |
|---|---|---|---|
| `toby.greeting` | `H02` | Hi! Want to play? | V1 voice `general_female_child_greeting_01`; text only, any child |
| `toby.plants.option` | player | Do you know much about plants? | New |
| `toby.plants.reply` | `H02` | Mum knows the plants. I know which ones I shouldn't touch. | New; D-NPC-23 Dora/Toby kin and herbalist role |
| `toby.leave.option` | player | Maybe another time. | New |
| `toby.leave.reply` | `H02` | Bye! See you later! | V1 voice `general_female_child_farewell_01`; text only, any child |

### `saltmere.daily.mabel` — `L02` Mrs Fieldman

| ID | Speaker | Text | Source |
|---|---|---|---|
| `mabel.greeting` | `L02` | Hello there. Good to see you. | V1 voice `general_female_greeting_01` |
| `mabel.soil.option` | player | How can you tell when the ground needs water? | New |
| `mabel.soil.reply` | `L02` | The soil can be dry beneath the crust. | Adapted V3 flavour `farmer.barks[1]`; general observation, not a current field report |
| `mabel.leave.option` | player | Thanks for the advice. | New |
| `mabel.leave.reply` | `L02` | Take care of yourself. | V1 voice `general_female_farewell_01` |

### `saltmere.daily.stephen` — `T01` Stephen Chapman

| ID | Speaker | Text | Source |
|---|---|---|---|
| `stephen.greeting` | `T01` | Good day, traveller. | V2 panel neutral greeting |
| `stephen.road.option` | player | What matters on a trading journey? | New |
| `stephen.road.reply` | `T01` | A short route can cost as much as a long one if you pack badly. | New; D-NPC-23 trader/travel role; V1/V2 had no safe fitting line |
| `stephen.leave.option` | player | Safe journey. | New |
| `stephen.leave.reply` | `T01` | Take care out there. | V1 voice `general_male_farewell_01` |

### `saltmere.daily.ann` — `W01` Ann Woodward

| ID | Speaker | Text | Source |
|---|---|---|---|
| `ann.greeting` | `W01` | Hello there. Good to see you. | V1 voice `general_female_greeting_01` |
| `ann.seedlings.option` | player | What should I remember when tending seedlings? | New |
| `ann.seedlings.reply` | `W01` | Seedlings need a gentler hand. | Adapted V3 flavour `farmer.barks[0]`; removes “these” so no crop in view is implied |
| `ann.leave.option` | player | I'll let you get on. | New |
| `ann.leave.reply` | `W01` | Take care of yourself. | V1 voice `general_female_farewell_01` |

### `saltmere.daily.peter` — `W02` Peter Woodward

| ID | Speaker | Text | Source |
|---|---|---|---|
| `peter.greeting` | `W02` | Hello, traveler. Good to see you. | V1 voice `general_male_greeting_01` |
| `peter.wood.option` | player | Any advice for splitting wood? | New |
| `peter.wood.reply` | `W02` | Keep the wedge straight, not rushed. | V3 flavour `woodcutter.barks[1]`, verbatim general advice |
| `peter.leave.option` | player | Thanks. I'll be going. | New |
| `peter.leave.reply` | `W02` | Take care out there. | V1 voice `general_male_farewell_01` |

### `saltmere.daily.smith` — `S01` local smith

| ID | Speaker | Text | Source |
|---|---|---|---|
| `smith.greeting` | `S01` | Good day, traveller. | V2 panel neutral greeting |
| `smith.edge.option` | player | What makes a sound edge? | New |
| `smith.edge.reply` | `S01` | A sound edge takes patient work. | V3 flavour `blacksmith.barks[2]`, verbatim general advice |
| `smith.leave.option` | player | Thank you. Goodbye. | New |
| `smith.leave.reply` | `S01` | Take care out there. | V1 voice `general_male_farewell_01` |

### `saltmere.daily.molly` — `M01` Molly Lambert

| ID | Speaker | Text | Source |
|---|---|---|---|
| `molly.greeting` | `M01` | Hello there. Good to see you. | V1 voice `general_female_greeting_01` |
| `molly.flock.option` | player | What's the first rule with a flock? | New |
| `molly.flock.reply` | `M01` | Keep the flock close together. | V3 flavour `shepherd.barks[0]`, verbatim general advice |
| `molly.leave.option` | player | I'll remember that. Goodbye. | New |
| `molly.leave.reply` | `M01` | Take care of yourself. | V1 voice `general_female_farewell_01` |

Molly's reply does not assert that Pip or any sheep are present, missing or threatened. The V1 shepherd farewell about wolves was excluded because the local risk is not established for every encounter.

### `saltmere.daily.tom` — `M02` Tom Lambert

| ID | Speaker | Text | Source |
|---|---|---|---|
| `tom.greeting` | `M02` | Hello, traveler. Good to see you. | V1 voice `general_male_greeting_01` |
| `tom.work.option` | player | Do you spend more time farming or brewing? | New; D-NPC-23 roles |
| `tom.work.reply` | `M02` | The fields take most of my time. Brewing can wait its turn. | New; D-NPC-23 farming and small-beer activity, no current batch or barrel claim |
| `tom.leave.option` | player | See you around. | New |
| `tom.leave.reply` | `M02` | Take care out there. | V1 voice `general_male_farewell_01` |

### `saltmere.daily.jacob` — `B01` Jacob Bowman

| ID | Speaker | Text | Source |
|---|---|---|---|
| `jacob.greeting` | `B01` | Hello, traveler. Good to see you. | V1 voice `general_male_greeting_01` |
| `jacob.deer.option` | player | Any advice for following deer? | New |
| `jacob.deer.reply` | `B01` | Best keep downwind of the deer. | V3 flavour `hunter.barks[1]`, verbatim general advice |
| `jacob.leave.option` | player | I'll be on my way. | New |
| `jacob.leave.reply` | `B01` | Watch your step out there. | V1 voice `hunter_male_farewell_01` |

### `saltmere.daily.martha` — `B02` Martha Bowman

| ID | Speaker | Text | Source |
|---|---|---|---|
| `martha.greeting` | `B02` | Hello there. Good to see you. | V1 voice `general_female_greeting_01` |
| `martha.home.option` | player | What keeps you busy at home? | New |
| `martha.home.reply` | `B02` | There is always another small thing to see to. | New; D-NPC-23 home/garden role, no claim of current work or stock |
| `martha.leave.option` | player | I won't keep you. | New |
| `martha.leave.reply` | `B02` | Take care of yourself. | V1 voice `general_female_farewell_01` |

### `saltmere.daily.hazel` — `B03` Hazel Bowman

| ID | Speaker | Text | Source |
|---|---|---|---|
| `hazel.greeting` | `B03` | Hi! Want to play? | V1 voice `general_female_child_greeting_01`; text only, any child |
| `hazel.gate.option` | player | What do you like to watch around here? | New |
| `hazel.gate.reply` | `B03` | I count the torch posts by the gate. I always lose track. | New; D-NPC-23 child, canonical gate/torch-post visuals only |
| `hazel.leave.option` | player | I'll see you later. | New |
| `hazel.leave.reply` | `B03` | Bye! See you later! | V1 voice `general_female_child_farewell_01`; text only, any child |

No scene assigns a V1/V2 voice clip to an actor. The two child scenes need distinct staging and voice review in M4; matching source phrases do not imply they share a voice. All 12 topics are safe without quest, trade or knowledge suppliers.

## Original M4 handoff — historical checklist

The following preparation checklist predates live SC2. Reconcile it against the current code and [PROGRESS Now](../state/PROGRESS.md#now); do not reopen already-landed binding work. Audio and new scene gates remain separate.

1. Bind `speaker` keys through the validated Q0 actor table; never locate a speaker by displayed name or profession. Use one versioned text manifest when the M4 dialogue contract is set; these IDs are the candidate stable entries, not a frozen runtime schema.
2. Show a topic only when the actual NPC can talk. Conversation does not pin, teleport or pause their AI; interruption and explicit exit both close the surface cleanly.
3. Give each scene one editorial pass after S4 and the M4 cast implementation. In particular, check Kate's commercial greeting in context, with an existing neutral V1 greeting if the staging makes it false; review the two child scenes for voice and suitable safe locations.
4. Keep rumour disclosure separate until NPC knowledge and map precision are supplied. Add a rumour only when that NPC actually knows the specific fact; exact known-but-unvisited locations and approximate search areas remain distinct under D-NPC-22.
5. Do not infer spoken audio from a line's V1 voice source. M7 pilot/M9 voice work can match approved text to a verified clip or generate a new one after the script is settled.

## Shared voice scene drafts (audio004)

**Revision:** 2026-10-24, ChatGPT Sol. Editorial candidates, not recorded assets, runtime data or approved casting. [Audio004](../plans/audio--004--npc-pair-voice-roi-production-queue.md) owns the shared production order, budgets and gate ledger. [NPC-VOICE-CATALOG](NPC-VOICE-CATALOG.md) remains the only recorded transcript/filename/Fish-input catalog. These script IDs are proposed scene/turn references, never assertions that an MP3 exists.

### Common admission and reuse contract

- Each row is one whole utterance. Order is explicit; the **speaker is a canonical CastKey**, resolved through the household manifest to the live NpcId. Never assign it from display name, profession, gender, or SocialPairs seeker/target order. No automatic reversed version.
- Every scene requires those two actual actors, an engaged and valid SocialPairs token, availability, same permitted spatial context, no urgent need/danger, verified stable casts and a complete exact/QC-approved sequence. Audio004's 1× duration-fit and cancellation policy additionally applies. Missing requirements mean silence; these editorial predicates are not claims that a scene-selection API is implemented.
- **N (neutral neighbours):** courteous talk requires no invented friendship score, common history or prior introduction. A real existing hostility/disclosure restriction, when supplied, must still win. Residence alone grants no private knowledge.
- **K (kin):** verify the exact `KIN_EDGES` edge. Kin is not automatically affection or shared knowledge. Family advice may use kin alone; intimate teasing additionally needs a compatible relationship context. If that context is unavailable, defer the intimate variant and use N/neutral content. Never manufacture a new “friendship” threshold to unlock voice.
- **C (current context):** use actual clock, goal, Vitals, spot and atmosphere owners; a textual claim such as resting/sitting/quiet must be supported, not inferred from a scene title. Each C scene is deferred until the relevant existing owner is exposed to the dialogue/presentation admission seam.
- Player reuse below means **the same actor, words, approved profile and delivery**, under the stated player prompt. New player prompts/topics are future editorial integration, not current runtime options. Where a current line is named, preserve its effective text exactly. A question originally spoken by the player still costs a new NPC recording when a resident speaks it. No clip can voice the other participant's reply or substitute different subtitles.

### SV01 — listening (`saltmere.pair.listening.01`; P1; N)

Kate asks about Mark's way with people, not about an invented incident. Both are complete sentences with no work/time/place assumptions. Their identity/availability suffices; this is not intimate teasing and need not assume a positive relationship score.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv01.1` | `G02` | What makes people tell you what's troubling them? |
| `sv01.2` | `G01` | You learn who's had a hard day if you bother to listen. |

**Reuse:** G01 turn 2 is exactly the catalog's `npc_mark_hornblower_daily_01.mp3` / `hornblower.mark.daily.02`; listening QC and a separate manifest expansion are required. Future player prompt to Mark: “How do you get people to talk?” → the same reply. Kate's opener stays pair-only; no forced reuse as a greeting. **Budget:** 1 new Kate clip + 1 existing Mark candidate. About 20 words; roughly 9–12 seconds including a turn gap, measured media decides.

### SV02 — comfortable company (`saltmere.pair.hornblowers.company.01`; P4; K-intimate)

G01–G02 spouse edge and a compatible affectionate interaction; safe shared leisure, not duty or a demand to stop working. The relationship/availability gate is required; marriage alone cannot unlock this variant. It reflects Mark's reserved but sociable character and Kate's warmth without making silence a defect.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv02.1` | `G02` | You can be quiet with me, you know. |
| `sv02.2` | `G01` | I know. That's why I don't have to be. |

**Reuse:** none in ordinary player talk. The second line depends on Kate's reassurance; do not reuse it as a generic acknowledgement. **Budget:** 2 new clips; defer if relationship context is unavailable.

### SV03 — advice between neighbours (`saltmere.pair.cloth.01`; P2; N)

W01 asks G02 for general advice. Verify G02's trader role; no cloth, sale, money, stock or shopping intention is asserted. Ann's practical question does not claim she presently needs clothing.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv03.1` | `W01` | What makes cloth worth buying? |
| `sv03.2` | `G02` | Hold cloth to the light. Thin patches tell you more than the colour. |

**Reuse:** turn 2 is current `kate.work.reply`, recorded in P1. Turn 1 repeats the *player option text*, but is one **new Ann recording**. No stock provider needed; it is generic advice. **Budget:** 1 new + 1 P1 reuse.

### SV04 — asking before helping (`saltmere.pair.neighbours.01`; P2; N)

Kate's interest in people meets Ann's community-minded practicality. No neighbour in distress, favour receipt or omniscient knowledge is implied.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv04.1` | `G02` | How do you know when someone needs a hand? |
| `sv04.2` | `W01` | Ask first. People don't always need what you think. |

**Reuse:** Ann's exact turn is SV06 turn 2; record once, test the same delivery in both scenes. Future player prompt to Ann: “How can I be a useful neighbour?” → same reply. This future topic does not count as a current player binding. **Budget:** 1 new Kate + 1 P2 Ann reuse. Neither scene grants a relationship effect.

### SV05 — room for home and neighbours (`saltmere.pair.woodwards.time.01`; P2; K-neutral)

Verify W01–W02 spouse edge. This is an everyday statement of preferences, not proof of a recent favour, quarrel, planned gathering or affectionate current mood. Ann looks beyond the household; Peter asks for a reasonable share of her time. Both speak gently, without sarcasm or a scolding performance. If actual relationship state forbids this tone, suppress it.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv05.1` | `W01` | I like to leave a little time for the neighbours. |
| `sv05.2` | `W02` | So do I. Just leave a little for us. |

**Reuse:** future player prompt to Ann: “How do you make time for other people?” → turn 1 verbatim. Peter's “us” is spouse-addressed and **not** reused for a stranger/player. **Budget:** 2 new. Do not turn this into a complaint about a specific absent spouse.

### SV06 — a practical question (`saltmere.pair.woodwards.help.01`; P2; N)

Peter is willing to help but wants to understand the need; Ann knows asking is better than deciding for someone else. No actual repair request, shortage, promised labour or knowledge propagation.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv06.1` | `W02` | How do you decide who needs a hand? |
| `sv06.2` | `W01` | Ask first. People don't always need what you think. |

**Reuse:** Ann's reply serves SV04 and the proposed player topic above. Peter's opener is pair-only. Both remain their own people; Ann is not automatically right about a specific incident. **Budget:** 2 new unique recordings; SV04 does not buy the reply again.

### SV07 — a useful question (`saltmere.pair.split-wood.01`; P3 conditional; N)

S01 asks W02 for general wood-splitting advice. Verify Peter's real woodcutter role; neither a broken tool nor a current task is asserted. A smith may ask about another craft without being portrayed as incompetent. S01 remains an unspecified canonical display name.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv07.1` | `S01` | Any advice for splitting wood? |
| `sv07.2` | `W02` | Keep the wedge straight, not rushed. |

**Reuse:** turn 2 is current `peter.wood.reply`, recorded in P2. S01's question is a new clip despite matching player option text. **Budget:** 1 new + 1 P2 reuse; defer rather than fund an otherwise unused S01 voice just for this opener.

### SV08 — permission to rest (`saltmere.pair.fieldmans.rest.01`; P4; K + C)

Verify L01–L02 spouses, both actually on a voluntary rest/leisure break, with compatible gentle domestic tone. The scene does not identify unfinished crops, a meal or a particular chore. Do not play during current work or urgent need; neither character's generated Big Five is rewritten as “always overworked”.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv08.1` | `L01` | Can you leave the rest until later? |
| `sv08.2` | `L02` | I can. Don’t let me start making a list. |

**Reuse:** none for ordinary player talk; both lines depend on this shared break. **Budget:** 2 new. No sitting pose or completed work is claimed. Defer until the actual leisure/rest context is supplied; do not generate this merely to fill the P4 cap.

### SV09 — company without pressure (`saltmere.pair.company.01`; P4; N)

H01 and B02 are neighbours, not invented relatives or confidantes. An offer and immediate preference need no story about a hard day, recent bereavement or prior encounter. Neither voice needs an exaggerated sociability trait.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv09.1` | `H01` | Would you rather have company or a little quiet? |
| `sv09.2` | `B02` | Company, if I don't have to do all the talking. |

**Reuse:** future player prompt to Martha: “Would you like some company?” → B02 turn 2, only when the actual interaction is available and compatible. H01's question is not a generic greeting. **Budget:** 2 new; proposed player mapping is additional value, not implemented coverage.

### SV10 — comfortable silence (`saltmere.pair.quiet.01`; P4; N)

F01 and M02 share an admitted social interval; no friendship history or quiet weather/environment is claimed. It is a request to stop speaking, not an assertion that the whole village is silent. Select no further scene for this pair token after this exchange.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv10.1` | `F01` | Do you mind if we don't talk for a bit? |
| `sv10.2` | `M02` | Not at all. You needn't keep me entertained. |

**Reuse:** future player statement to Tom: “I don't have much to say.” → turn 2, same tone and availability; never an automatic response to all refusals. **Budget:** 2 new. The following silence is presentation pacing, not a new AI mood or hold.

### SV11 — something besides work (`saltmere.pair.lamberts.other-things.01`; P4; K-neutral)

Verify M01–M02 spouse edge and an available social context. A little hesitation is ordinary domestic humour, not proof that Tom has no interests or that Molly is dissatisfied. No flock, brewing batch or supper inventory is implied.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv11.1` | `M01` | Can we talk about something besides work? |
| `sv11.2` | `M02` | Gladly. You'll have to give me a moment to think. |

**Reuse:** future player request to Tom: “Tell me something that isn't about work.” → turn 2; pair opener not reused as a greeting. **Budget:** 2 new. Later conversation may follow, but these two lines form a complete small interaction without an unheard punchline.

### SV12 — advice for the young (`saltmere.pair.elder.advice.01`; P4; N)

T01 asks E01 for general advice, not a secret, quest lead or account of a particular adventure. E01 is retired; no hunter-duty eligibility. Stephen can ask on behalf of young people without claiming to be a child or pretending a prior mentor relationship.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv12.1` | `T01` | Any advice for the young? |
| `sv12.2` | `E01` | Listen more than you speak. You will learn more that way. |

**Reuse:** E01 turn 2 is current `elder.village1.reply` (second `village` extra, not `elder.village.reply`). Exact text exists in runtime; no corresponding approved audio is established. **Budget:** 2 new, one of which can serve that existing player line. No automatic hunter voice for E01; older-voice casting must fit the actor.

### SV13 — learning plants (`saltmere.pair.herberts.plants.01`; P5; K-parent)

Verify H01→H02 parent edge and H01 herbalist role. An available safe family interaction only; no current plant/resource or unsupervised task. H02 is eight and must have an approved age-appropriate voice. F01's shared address is not a parent edge.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv13.1` | `H02` | Do I have to know every plant? |
| `sv13.2` | `H01` | No. Start with the ones you shouldn't touch. |

**Reuse:** future player prompt to Dora: “Should I learn every plant at once?” → H01 turn 2, if the same take sounds suitable for an adult addressee. Otherwise no reuse discount. Child line stays pair-only. **Budget:** deferred, no order; adult/child role banks are not interchangeable.

### SV14 — starting again (`saltmere.pair.bowmans.counting.01`; P5; K-parent)

Verify B02→B03 parent edge. Hazel is ten; safe family talk with an age-appropriate voice. No torch posts, current counting action, remembered mistake or claim that a world feature is bound. Mild humour comes from the adult admitting the same ordinary limitation.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv14.1` | `B03` | Do you ever lose count? |
| `sv14.2` | `B02` | Often. That's why I start again. |

**Reuse:** none planned. Do not insert under Hazel's current gate topic or pretend the player has asked about counting. **Budget:** deferred, no order. Jacob B01 is canonically the other parent but cannot speak this B02 recording.

### SV15 — optional longer Hornblower scene (`saltmere.pair.hornblowers.company.long.01`; P5)

Same K-intimate and leisure gates as SV02, plus future measured full-scene feasibility. **Not an instruction to lengthen SocialPairs or record now.** SV02's first two turns are already a complete exchange; this longer alternative must be selected and budgeted as a whole before starting, not appended opportunistically.

| Turn ID | Speaker | Full English utterance |
|---|---|---|
| `sv15.1` | `G02` | You can be quiet with me, you know. |
| `sv15.2` | `G01` | I know. That's why I don't have to be. |
| `sv15.3` | `G02` | Then what would you like to talk about? |
| `sv15.4` | `G01` | Something besides me, for a start. |

**Reuse:** first two exact recordings can come from SV02 if delivery works in both. Last two are pair-only; no player reuse or fabricated past event. **Budget:** zero committed; at most two additional accepted clips if this alternative is later justified. No six/eight-turn bulk expansion follows automatically.

### Wider-cast coverage and deliberate gaps

These scenes provide specific alternatives for G01/G02, W01/W02, H01, L01/L02, S01, F01, M01/M02, T01, E01 and B02; H02/B03 remain child-gated. B01 Jacob remains covered by existing player drafts first; do not invent a witnessed hunt, tracks or wolves to force him into the pair batch. His next pair candidate should be written only when actual listener exposure and canonical knowledge justify it. No all-17 or all-105 audio-coverage claim follows from this script set.

All early scenes avoid gratuitous greetings and morning/evening fillers. Humour is optional: listening, practical questions and permission to enjoy company are useful conversation. More punchlines are not a production target. None of these drafts modifies current text, relationship values, AI schedules or provider truth.
