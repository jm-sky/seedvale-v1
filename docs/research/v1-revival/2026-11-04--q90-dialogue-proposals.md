# Q90 — English dialogue writing proposals

**2026-11-04 · editorial proposals, not approved canonical dialogue.** No source string, dialogue command, quest identifier, outcome or transcript is changed. [Audit](./2026-11-04--q90-npc-voices-editorial-audit.md) owns evidence; [recording script](./2026-11-04--q90-fish-audio-script.md) owns the only proposed take budget. Text below without a recording ID is **text-only preparation**, not another recording order.

## Voice and character direction

Use clear conversational English with contractions where natural. Medieval life supplies the detail: grain, thread, an edge, a meal, an honest price. Avoid turning every villager into a proverb machine. One memorable profession observation is enough; plain replies do the rest.

| Existing archetype | Writing rule | Avoid |
| --- | --- | --- |
| `calm` | Short, complete thoughts; give the other person room. | Adding “no hurry” to hunger, combat or every activity. |
| `cheerful` | Welcoming and practical; occasional self-aware joke. | Forced delight in every job; jokes during urgent needs or danger. |
| `curious` | Ask about the player or notice the craft. | Claiming discoveries, forecasts or knowledge not supplied by V1. |
| `grumpy` | Economical, dry, mildly impatient; can still care about familiar people. | Universal hostility, threats, modern slang, refusing services through flavor text. |

FairyTail is the new primary male direction, george the older-male direction and Rick an alternative male direction. These are **speaker choices, not personality classes**: a calm NPC is not automatically george, and a grumpy NPC is not automatically Rick. The selective script assigns a few useful examples, not a four-way voice matrix. Do not imitate a named fictional character in generation instructions.

Mark remains the author-approved Friendly Male pilot (`marek_hornblower`). Keep its human warmth: the existing “You learn who's had a hard day if you bother to listen.” is good characterization, subject to a real daily-topic binding. Jacob uses Arthur (`jakub`); keep practical outdoor speech without assuming every task is a deadly hunt. Kasia/Kate remains a trader, not V3's textile specialist. Anna/Ann and Piotr/Peter are presentation preferences, not permission to rename the current quest bindings.

## Greetings, farewells and ordinary replies

The script supplies 12 basic existing-event intents in each of the three new male voices. Existing Hannah/Arthur/guard/merchant greetings are retained as QC candidates. The following are proposed English replacements for the **text-only** fallback slots of `npcDialogueGreeting.ts`; they must not be played over an unrelated greeting recording.

| Archetype | Day / ordinary (two alternatives) | Night | Familiar (`friendly` / `trusted`) |
| --- | --- | --- | --- |
| calm | Hello. / Good to meet you. | Good evening. | Welcome back. |
| cheerful | Hello! Good to see you. / Oh, hello! What can I do for you? | Hello! Still awake, then? | There you are! Good to see you again. |
| curious | Hello. What brings you here? / Hello! What is on your mind? | A late visit. What brings you here? | Back again? What is new with you? |
| grumpy | Yes? What do you need? / Hm. Go on. | Out late, are you? Go on, then. | Oh, it is you. I am listening. |

“Good to meet you” is stranger-only; if that eligibility is unavailable use “Hello.” Keep the current night boundary (`<0.2` or `>=0.85`) rather than adding a new clock interpretation. Current fallback selection chooses night before familiarity; this pass does not reorder it.

| Existing owner / slot | Proposed English text | Preservation / condition |
| --- | --- | --- |
| `goodbyeLine`, calm | Farewell. / Take care. | Any committed farewell; time-neutral. |
| `goodbyeLine`, cheerful | It was good to talk. Take care! / Until next time! | No stock or return-location promise. |
| `goodbyeLine`, curious | I hope we speak again. / Take care. I would like to hear more another time. | A wish, not a scheduled meeting. |
| `goodbyeLine`, grumpy | Right, then. Take care. / Off you go, then. | Replaces “Spadam do roboty.”; no unsupported return-to-work claim. |
| `aboutSelfLine`, calm | I am {displayName}, a {roleLabel}.{familyClause} | Actual identity/profession only. |
| `aboutSelfLine`, cheerful | My name is {displayName}. I work as a {roleLabel}.{familyClause} | Removes automatic “I love it!” claim; profession observation may follow separately. |
| `aboutSelfLine`, curious | I am {displayName}, a {roleLabel}.{familyClause} What brings you this way? | Avoid awkward “Where are you here from?” construction. |
| `aboutSelfLine`, grumpy | {displayName}. I am a {roleLabel}.{familyClause} What else did you want to know? | Terse, not threatening. |
| `familyPhrase` | My family: {actual relation/name list}. | Only supplied entries; omit entire clause when empty. No invented spouse/child. |
| `currentActivityLine`, neutral | {actual activity sentence}.{optional expected end time} | Use supplied `CurrentActivity`; do not infer current work from profession. |
| activity `combat` | I am fighting. | No “without hurry”, question or joke; do not make unavailable dialogue accessible. |
| activity `sleep` | I am sleeping. | Semantic translation only; do not wake NPC or introduce sleep talk. Prefer no conversation if existing interaction policy blocks it. |
| activity `work` / `eat` / `wander` / `talking` / `idle` | I am working. / I am eating. / I am walking about. / I am talking with you. / Nothing in particular. | Literal current activity. Add flavor only when the input proves it safe. |
| activity need `water` / `waterDuty` / `food` / `wood` | I am fetching water. / I am seeing to the household water. / I am looking for food. / I am working on the wood. | Keep household water duty distinct from personal thirst. |
| optional `endHour` suffix | I expect to finish around {formattedHour}. | Preserve existing supplied value and formatter; expectation, not a deadline promise. Omit when absent. |
| `aboutVillageLine` | This is {name}, {terrainPhrase}. It is a {sizePhrase} settlement.{resourceClause} | Actual inputs; `OUTPOST` = “outlying”, not an invented population count. |
| village food/resource clauses | We mainly depend on {foodSourcePhrase}. / The area has {resourceLabel}. | Metadata about local resource type, not “plenty in stock”; no item availability promise. |
| `aboutAreaLine`, no names | Nothing else comes to mind just now. Ask me another time. | No map reveal. |
| `aboutAreaLine`, names supplied | Places I can tell you about:\n{unchanged resolved names} | Keep every name and the existing reveal effect. No invented distances or directions. |

Role labels for the 11 V1 roles: woodcutter, farmer, guard, trader, miner, fisher, hunter, blacksmith, shepherd, weaver (`textile_worker`), herbalist. Spoken labels do not change the role IDs. Family labels: husband, wife, child; `single` adds no relationship phrase. Terrain/food/resource labels should translate their exact current enum values; do not map a desert to a named region or add geography.

## Profession variety

The recording script has exactly one proposal for each of V1's eleven roles. It retains nine good earlier catalog observations verbatim in their intended meaning and adapts speaker assignment where the old voice is held. Other retained lines also remain identifiable through the supersession ledger. Highlights:

- Woodcutter, calm: “Wood has a grain. Fighting it only tires your arms.”
- Farmer, cheerful: “Farm work teaches patience. Whether you wanted the lesson or not.”
- Guard, calm: “I keep watch. A quiet watch is no cause for complaint.”
- Trader, calm: “A clear price saves a long argument.”
- Fisher, grumpy: “Fish have no respect for a busy person.”
- Weaver, curious: “A small mistake in the thread can travel a long way.”

These answer the existing self/profession topic; they are not unsolicited work barks. The profession is required, the currently held item is not. Keep the factual name/family reply visible alongside a short separately subtitled craft observation. Do not cut factual text to fit a recording. george's shepherd proposal applies only if the approved final casting admits that role; it does not replace an already assigned shepherd voice.

## Needs and activity bank: bounded corrections

`dialogue.ts` currently has 80 Polish entries (five needs × four archetypes × two busy buckets × two variants). Several assume a well, garden, cold water, final trip or fine weather that `pickDialogueLine(personality, need, busy)` cannot verify. Below is one proposed safe English replacement per **slot**, 40 lines. This is an editorial correction set, not an instruction to delete the other good variant. Additional existing good variants may be translated without changing meaning. The `doing` bucket means `busy=true`; it does not establish arrival, consumption or completion. Avoid claims that water was drunk or food eaten unless a later caller supplies that fact.

| Need | Archetype | Seeking | Doing (`busy`) |
| --- | --- | --- | --- |
| water | calm | I need some water. | I am seeing to my water. |
| water | cheerful | A drink would be welcome. | Water first, then. |
| water | curious | I am looking for a drink of water. | I am getting myself some water. |
| water | grumpy | I need a drink. | Let me see to this water. |
| waterDuty | calm | I am fetching water for the household. | I am seeing to the household water. |
| waterDuty | cheerful | Time to bring some water home. | A little care saves a spill. |
| waterDuty | curious | I am going to fetch water for home. | Water never carries itself, does it? |
| waterDuty | grumpy | Someone has to fetch the water. | Let me get on with the water. |
| food | calm | I am looking for something to eat. | I am seeing to my food. |
| food | cheerful | Time to find a bite. | Food first. I am hungry. |
| food | curious | I wonder what I can find to eat. | I am sorting out something to eat. |
| food | grumpy | I need food. | Let me see to my food first. |
| wood | calm | I am going to see to the wood. | One thing at a time. |
| wood | cheerful | Time to fetch some wood. | Keeping at it. |
| wood | curious | I am going for wood. Have you done much woodwork? | I wonder what this wood will be used for. |
| wood | grumpy | Wood again. Someone has to do it. | Let me get on with it. |
| idle | calm | I have a moment. | A quiet moment suits me. |
| idle | cheerful | Nothing pressing. Good to see you. | It is good to have a moment to talk. |
| idle | curious | Have you seen much of the settlement? | What do you make of this place? |
| idle | grumpy | A moment to myself, if you please. | Let me have a moment. |

For cheerful/curious water-duty jokes, use only ordinary safe interaction, never an urgent interrupt. If the caller cannot distinguish critical needs, keep the calm factual replacement. The idle lines should not be used when the interaction context reports combat or another urgent activity. This is a future text-selection constraint, not a new simulation rule.

Neutral fallback proposals: seeking “I have something to see to.”; doing “I am occupied just now.” The current doing fallback “Zaraz kończę.” promises near completion without an ETA.

## Assistance and contextual responses

These translate existing committed outcomes; do not rerun or alter the commands. No recordings budgeted for these dynamic/outcome-specific replies.

| Existing condition | NPC reply proposal |
| --- | --- |
| food `given` | Here. Have something to eat. |
| water `given` | Here. Have a drink. |
| food `no_item` | I have no food with me. |
| water `no_item` | I have nothing to drink with me. |
| `inventory_full` | You have no room to carry it. |
| `unwilling` | I am sorry, but I do not want to share it. |
| expedition accepted | I would be glad to join you. Tell me when we are leaving. |
| `active-accompany` / `active-work-contract` | I cannot just now. I have another commitment. |
| `critical-need` / `combat-or-flee` | Not now. I must deal with this first. |
| `not-adult` | I am too young for that. |
| other expedition refusal | Thank you for asking, but I would rather stay. |

Player choice proposals preserve intent: “Could you spare some food?” / “Could you spare some water?” / “I will pay you {coins} coins for your work.” / “Will you join me for {requested duration}?” / “All right. I will see to it.” / “Not this time.” Payment intent does not claim transfer succeeded; durations remain the actual selected half/one/two/three days or supplied value. These are NPC-dialogue presentation scope, not player voice recordings.

## Relationships and reputation

Keep `stranger`, `acquainted`, `friendly`, `trusted`. No new “hostile” personal tier imported from V3. The script's six personal greeting variants are explicit-open only and use the existing relation/archetype inputs. Neutral core greetings remain valid for proximity. Do not claim a remembered rescue, debt or crime from a scalar score.

The two local-standing variants are **held proposals**. Earlier catalog thresholds (trust <= -30; respect trust >=30 and renown >=20) remain unapproved. A local reputation score is not proof the NPC knows a particular deed. Suggested wording remains “I'll hear you out, but let's keep this straightforward.” / “You're welcome here. What would you like to talk about?” Neither changes trade access, quest eligibility or relationship values.

Current quest reactions already have real per-choice relation guards. Preserve their stakes and exact conditions, rather than applying pleasant generic greetings as replacements for disappointed or grateful quest replies.

## Quest dialogue: exact information stays visible

The generic quest cue has its **own matching subtitle**, separate from the exact displayed objective/result. It must never be labelled a recording of the longer quest text. Below are text-only proposed translations/corrections tied to current source fields. Keep the quest IDs, stage order, `playerLine` commands, required items and consequences. Names below intentionally match V1's current binding strings.

### `relay-anna-piotr` — `src/quests/quests.ts`

| Field | Proposed English |
| --- | --- |
| title | A Message for Piotr |
| description | Anna asks you to tell Piotr that they are going fishing tomorrow at dawn. |
| offerLine | Could you give Piotr a message? Tell him we are going fishing tomorrow at dawn. |
| stage description | Speak to Piotr. |
| reminderLine | Have you told Piotr about fishing at dawn? |
| playerLine | Anna says you are going fishing tomorrow at dawn. |
| progressLine | Thank you for telling me. I will be there at dawn. |
| reportPromptLine | Have you told Piotr? |
| reportPlayerLine | Yes. He will be there at dawn. |
| reportLine | Good. Thank you for passing on the message! |

Do not add a location, reward or elapsed-time check. “Tomorrow” is inherited authored dialogue; whether it should become an absolute day after delays is a separate quest design decision, not silently fixed here. Outcome `delivered` gives relations +1 with Anna/Piotr, no material reward. A cue saying “Here is your reward” is unsuitable.

### `shells-dla-kasi`

| Field | Proposed English |
| --- | --- |
| title / description | Shells for Kasia / Kasia needs three shells to decorate her doorstep. |
| offerLine | The doorstep could use a little colour. If you are by the sea, look out for three pretty shells. I would like to decorate it with them. |
| stage description | Gather 3 shells. |
| reminderLine | Have you found any pretty shells? |
| stage playerLine / reportPlayerLine | I have three. I chose the prettiest. |
| reportPromptLine | Did you find anything by the sea? |
| reportLine | Oh, these will do nicely. They will brighten up the doorstep. |

Keep `gather_item`, `kind: shell`, `count: 3`, `delivered`, relation +1 with Kasia. No coin reward exists here. This is a concrete reason for the proposed neutral merchant completion cue. The report expresses an intended use, not a newly placed decoration.

### `woda-dla-marka`

| Field | Proposed English |
| --- | --- |
| title / description | Water for Marek / Marek has his hands full and asks you to draw water from the well for him. |
| offerLine | I have my hands full. If you pass the well, could you draw some water for me? |
| stage description | Draw water from the well. |
| reminderLine | Have you been to the well? |
| progressLine (narration) | The well water is clean and cool. Time to return to Marek. |
| reportPromptLine | Did you manage to get to the well? |
| reportPlayerLine | Yes. I drew some fresh water. |
| reportLine | Good. Just what I needed. Here, for your trouble. |

Keep the actual `interact_well` objective; do not introduce a bucket/item-delivery requirement. Keep shown reward **5 coins**, relation +1 and `delivered`. The narration's water-quality claim is inherited quest copy, not verified water-quality simulation; retain pending author choice rather than inventing such a check. No new Mark recording is included in Q90.

### `drewno-na-naprawe`

| Field | Proposed English |
| --- | --- |
| title / description | Wood for Repairs / Piotr's fence is coming apart. Gather branches for the repair. |
| offerLine | One of the fence sections is coming loose again. If you are gathering wood, put aside five sturdy branches for the repair. |
| stage description | Gather 5 branches. |
| reminderLine | Have you found anything suitable for that fence? |
| stage playerLine / reportPlayerLine | I have five sturdy branches. They should do the job. |
| reportPromptLine | Have you brought anything for the fence repair? |
| reportLine | Yes, these will do. They should make that loose section firm again. |
| alreadyRepairedOfferLine | The fence is sound again. I see someone has taken matters in hand. Thank you. |
| alreadyRepairedReminderLine | I see you have already repaired the fence. You did not need to wait for me to ask. |
| alreadyRepairedPlayerLine | I have already repaired your fence. |
| already_repaired resultText | Well now, the fence is holding without me having to ask. Thank you for helping. |

Adding the exact **five** to the vague offer is an editorial clarification of the existing objective, not a count change. Preserve `branch ×5`, delivered reward **8 coins**, relation +1, and the separate `already_repaired` outcome. Do not promise the repair is complete just because branches were handed over; the dedicated actual-repair branch owns that claim. Keep materialization's real repair-target binding (`authoredRepairDeliveries.ts`).

### Lost hunter — bounded consequential-response pass

`lostHunterNaturalCave.ts` supplies actual witness, giver and cave-description values. These selected rewrites preserve the existing path and the emotional weight; they are not a complete quest translation or new narrative facts.

| Source field / condition | Proposed English |
| --- | --- |
| offerLine | He has not returned from the hunt. I do not know which way he went. |
| stage 0 description / reminder | Speak to {witnessName}; they may have seen the missing hunter. / {witnessName} may know which way he went. |
| witness progressLine | I was the last to see him. He was heading towards {caveDescription}. I have not seen him since. |
| pack objective description | Find his pack in the indicated cave and take what he left behind. |
| return progressLine | These are his things. I am glad you brought them back. What will you do with the bow? |
| return-bow base reply | Thank you. At least this has come home. |
| return-bow friendly+ overlay | I knew that if you found it, you would not leave it behind. |
| keep-bow base reply | I will not wrestle you for it. But I had hoped you would give it back. |
| keep-bow trusted overlay | I asked you for news, not for you to take his belongings. |

Keep `requireItemInstanceId: binding.bowInstanceId`, the two physical outcome IDs, the returned/kept ownership effects and trusted keep-bow relation penalty. Do not declare the hunter dead: the inspected dialogue does not establish that. “At least this has come home” preserves grief without inventing a corpse or confirmed death. Generic celebratory completion is inappropriate over the hurt response; missing contextual cue stays silent.

The elder dispute (`lostTreasureChroniclesElder.ts`) already has material-help versus neighbor-help and support versus reconciliation branches. Preserve those, rather than rewriting the elder into a headman or inventing settlement powers. One useful faithful pair: “It is easy for you to say. It was not your possession that went missing.” and, in its existing trusted overlay, “I would not hear that from a stranger. From you… I will think on it.” The branch conditions and consequences, not a broad reputation score, decide which is valid.

## Short NPC–NPC / campfire exchanges

The recording budget contains only two complete pairs, adapted from earlier good catalog proposals:

| Pair | First speaker | Answering speaker |
| --- | --- | --- |
| CF90-1, calm | FairyTail: “Mind if I enjoy a quiet moment here?” | Hannah: “Not at all. A little quiet suits me.” |
| CF90-2, cheerful | Hannah: “Do you think doing nothing counts as practice?” | Rick: “If it does, I'm improving by the minute.” |

These do not depend on a forecast, road rumor or an all-day work history. Reuse V1's existing campfire pairing/lifecycle; whole-pair eligibility must include both stable speakers. No male/female general fallback. For non-campfire NPC–NPC conversation, these remain **text ideas only** until an existing reachable presentation surface is verified; do not add a producer to use them. V3's 17 daily scenes are useful for craft specificity, not permission to transplant Saltmere identities or scene commands.

## Deferred lines and author choices

Thirst, injury, danger-ended, completed-repair, bereavement and ambient-weather remarks remain good bounded future topics. The earlier catalog's factual constraints still apply, but there is no new recording order for them here. `waterDuty` is not thirst; a globally known death is not NPC knowledge; a passed threat is not proof it died. The source-audited event/binding owner must come before production.

Author review is needed for the script/budget, residual casting/source issues, local-standing thresholds, optional pair/variant bindings, Mark's full-pack authorization and child/age policy. No major narrative change is proposed; inherited quest phrasing issues are called out rather than silently redesigned.
