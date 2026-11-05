# Q90 — NPC voices and dialogue editorial audit

**Casting update — 2026-11-05:** The [NPC-Voice map](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md#npc-voice-map) is authoritative. Earlier casting holds/alternatives in this dated evidence are superseded: Kasia→Expressive Female, Anna→Laura, Piotr→Country Baritone, Molly→Hannah, Piers→Warm Male Friend (farmer; no runtime key), Jakub→Arthur, Patric→Dramatic, generic hunter→Cowboy, male farmer→Casual, general female→Warm Conversational, fisher→Rick. Existing file source/transcript/context QC and missing runtime bindings remain separate gates. See [cleanup report](./2026-11-05--npc-voice-cleanup.md). No transcript, recording ID, filename or ledger verdict is changed.

**Date:** 2026-11-04  
**Status:** **Author-approved 2026-11-04** (87-take Fish Audio script and editorial text-only pass); recording, QC, casting and runtime integration remain outstanding.  
**V1 evidence pin:** `bca03d453bfb0177a9d2801c4d2ccc7ca0c3b7a5` (`main` when research began).  
**Scope:** Documentation only, in English. V1 remains authoritative. No runtime, audio, canonical transcript, casting implementation, quest logic or simulation changes. No Fish Audio generation.

**Q90 author approval (2026-11-04):** The author reviewed and approved the complete [87-take Fish Audio script](./2026-11-04--q90-fish-audio-script.md) (P0 12 / P1 54 / P2 21) as the recording text and production selection. Ordinary activity/needs/profession/family/settlement dialogue is text-only by default, not a mandate to voice every response; the author accepts the editorial text-only proposals without further line-by-line review. MP3 scope is selective: dialogue opening/closing, trade opening/closing, generic quest cues and selected exact key-quest lines, plus spontaneous weather, campfire NPC–NPC exchanges, danger/combat, interruption from hunger/exhaustion, and separately selected significant events. The approved 87 rows are the current bounded script, not an exhaustive promise to cover every listed category or authorize extra recordings. The author generates audio in Fish Audio. No MP3 is generated or QC-passed by this approval; source/casting mismatch holds, Q88/Q89 and Q40 integration gates remain. Do not add unlisted takes automatically.

## Deliverables and decision boundary

| Deliverable | Owner |
| --- | --- |
| Prioritized findings and coverage conclusions | This audit |
| Existing dialogue corrections, 40 needs-slot candidates, daily/relationship/quest writing | [Writing proposals](./2026-11-04--q90-dialogue-proposals.md) |
| 87 proposed takes, with UUID, intent, restrictions, transcript, generation input, filename, priority and disposition | [Reviewable script](./2026-11-04--q90-fish-audio-script.md), [JSON](./2026-11-04--q90-fish-audio-script.json) |
| All 317 existing file dispositions and per-speaker core-coverage matrix | [Coverage JSON](./2026-11-04--q90-coverage.json) |
| Every previous Q31/catalog proposal reconciled | [81-row supersession table](./2026-11-04--q90-supersession.md), [JSON](./2026-11-04--q90-supersession.json) |

**Approved direction:** [2026-10-31 audit §12](./2026-10-31--npc-voices-dialogue-audit.md#12-author-decisions--approved-2026-10-31-supersedes-open-questions-in-11) and the later [npc-065 casting decisions](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md): stable speaker, four existing archetypes, English NPC dialogue, exact subtitles for spoken cues alongside full quest text, staged profession/social variety, maximal suitable donor reuse, truthful moderate reactions. The user explicitly authorized this Q90 documentation pass despite queue dependencies. This does not approve the resulting text, resolve casting conflicts or unblock runtime/audio production.

**Editorial proposals:** every new/revised sentence, the production selection of 87 takes, the conditional 72-file reuse shortlist, and old-row dispositions. Retaining an earlier good sentence is not approval of it. No ledger verdict is changed.

## Evidence and method

Read the Strategic Brief, 2026-10-31 audit and expansion catalog (Markdown + JSON), Q31 script, complete npc-065 including 2026-11-03/04 casting addenda, QC report/ledger, queue Q90 and repository instructions. Rechecked current source rather than assuming the plan had landed:

- [`npcVoiceLines.ts`](../../../src/ai/npcVoiceLines.ts): role/gender hierarchy still ignores supplied `voiceProfileId`; Q30 `avoidUrl` exists. `npcVoiceClips.ts` is absent at this pin.
- [`NpcAgent.ts`](../../../src/ai/NpcAgent.ts): constructor speaker profile; successful combat start (2661); exhaustion (3291); threat branches (3414–3419); food selection (3566); terminal schedule-work action (3652); shelter entry (6668–6681); bark and proximity playback (7254 onward).
- [`npcBarkRequest.ts`](../../../src/ai/npcBarkRequest.ts), [`weatherPressure.ts`](../../../src/ai/weatherPressure.ts): current weather-chain and pressure predicates, not forecast or exposure knowledge.
- [`npcDialogueGreeting.ts`](../../../src/ui-vue/npcDialogueGreeting.ts), [`dialogue.ts`](../../../src/ai/dialogue.ts), [`dialogueTemplates.ts`](../../../src/ai/dialogueTemplates.ts): exact displayed strings, archetype buckets and supplied context.
- [`store.ts`](../../../src/ui-vue/store.ts) close/accept paths (1276–1286), [`createApp.ts`](../../../src/app/createApp.ts) quest hook (2009–2013): existing semantic cues remain separate from detailed displayed text.
- [`campfireTalk.ts`](../../../src/ai/campfireTalk.ts), [`socialBehaviour.ts`](../../../src/ai/socialBehaviour.ts): six whole pairs, gender-only selection, existing social lifecycle. No weather, work-history or speaker eligibility in the selector.
- [`characters.ts`](../../../src/ai/characters.ts): eleven roles, authored keys, Anna/Piotr/Kasia/Marek reserved identities; `jakub` authored key.
- [`quests.ts`](../../../src/quests/quests.ts): reviewed authored dialogue and current reaction/outcome types; detailed field pass for `relay-anna-piotr`, `shells-dla-kasi`, `woda-dla-marka`, `drewno-na-naprawe`. [`authoredRepairDeliveries.ts`](../../../src/quests/authoredRepairDeliveries.ts), [`lostHunterNaturalCave.ts`](../../../src/quests/lostHunterNaturalCave.ts), [`lostTreasureChroniclesElder.ts`](../../../src/quests/lostTreasureChroniclesElder.ts): concrete binding and consequential-dialogue checks. This is not a full translation/audit of every generated quest or domain callback.
- Staged [V3 voice catalog](../../v3-donor/voices/docs/NPC-VOICE-CATALOG.md), [ordinary interaction bank](../../v3-donor/voices/docs/ordinary-interactions.md), [daily scenes](../../v3-donor/characters/profiles/saltmere-daily-conversations.md), and [donor quality review](../../v3-donor/voices/reviews/2026-10-20--185--npc-dialogue-quality-audit.md). These are selective text/donor evidence, not V1 runtime authority or current remote V3 acceptance.

Fetched files were pinned to the same V1 commit through the GitHub connector. The untruncated Git tree validates every ledger file's `gitBlob` against staged donor bytes, and each `inV1Public` file against its public copy. The ledger's pre-existing `small.en` transcripts are evidence for review, **not a new listening pass**. No audio decoding/listening, generation, browser playtest or runtime test was performed. ASR cannot prove timbre identity or settle ambiguous words.

## Prioritized findings

| ID / priority | Current evidence / consequence | Proposed disposition |
| --- | --- | --- |
| Q90-F01 / P0 | Stable speaker routing has not landed. `voiceProfileIdFor` yields role:gender; `buildNpcVoiceLookupKeys` falls back to general voice; campfire uses gender. | Keep Q88 gate. None of this script may be mixed into old scope pools as an expedient fill. One speaker per NPC; missing compatible clip stays silent/text-only. No new architecture proposed. |
| Q90-F02 / P0 | Ledger has **317 pending, 0 pass**, including 275 ASR matches. Casting acceptance and `in_repo` do not pass clips. | Count approved reusable coverage as zero, but preserve conditional reuse to avoid wasting recordings. Do not interpret “zero approved” as an order to remake 317 files. |
| Q90-F03 / P0 | Q31 calls `general_female_weather_shelter_01` neutral; QC ASR says “Rain's coming down hard! Better get inside!” Current neutral key can therefore select suspected rain speech in snow. Guard counterpart ASR is neutral despite current rain registration. | Author confirms actual words; propose reclassification only then. Do not fix a subtitle while leaving contradictory audio. Snow chain logic is sound, semantic registration evidence is suspect. |
| Q90-F04 / P0 | Dramatic `combat_start_01/02` ASR says watch is over; `quest_complete_01/02` says hunger; `quest_declined_01` says rest; help files speak assistance responses. | Quarantine mislabeled meanings, confirm audio, retain as provenance/possible correctly classified alternates only after QC. Three held replacement proposals cover combat, completion and task-end; no false quest/combat imports. |
| Q90-F05 / P0 | FairyTail, george and Rick now have approved casting directions but **zero existing recordings** under their UUIDs. Legacy `general_male` is a different UUID and is held for inconsistent audible identity. Brian is permanently rejected globally. | New UUID-specific packs: 12 core slots each. Do not relabel old Casual files or count Brian's 38 perfect ASR matches as usable coverage. Preserve equal eligible male casting weights; bookmarks alone are not QC. |
| Q90-F06 / P0 | Shell quest completion gives relations only, while both merchant completion recordings imply a material reward. Generic audio is not an exact reading of the full quest outcome. | Neutral merchant completion proposal; keep objective/count/reward text exact and separate. No generic congratulation over disappointed/grief response. |
| Q90-F07 / P1 | Guard morning greeting orders weapons sheathed; hunter morning greeting reaches proximity without time filtering. Guard greeting day filter exists only at explicit open. | Keep eligible good day greeting; propose one time-neutral guard greeting. Apply future shared eligibility before selection; do not invent weapon enforcement. Arthur greeting 02 is a reusable time-neutral candidate. |
| Q90-F08 / P1 | Work end is a completed terminal schedule action, not end of day/watch. Hannah, Dramatic and several donor work clips imply shift completion, tool handling or next action. | Task-level wording. Prefer Cowboy `work_finished_02` as conditional reuse, cancel an unnecessary new Cowboy take. Dramatic watch text can be retained only for a real verified duty-end context, not today's general event. |
| Q90-F09 / P1 | `pickDialogueLine` receives only need/personality/busy. Its water/food lines claim a well/garden, cold water, last barrel, no hurry or fine weather. Neutral busy fallback claims imminent completion. | 40 safe English slot candidates; retain stronger specificity only where callers actually supply it. Distinguish water duty from thirst and seeking from completed consumption. |
| Q90-F10 / P1 | Existing about-self repeats “I am” and always says cheerful workers love their job. Activity template adds “no hurry” even to combat. Grumpy farewell asserts work resumption. | Bounded template corrections; eleven profession observations, selectively retaining good earlier copy. No changes to simulation, archetype derivation or current activity. |
| Q90-F11 / P1 | Six campfire pairs can assert weather forecasts, all-day work, wolves/tracks or road danger without supplied observations. Female weather question ASR is “Long day”, not the expected cold question. | Retain files as evidence; do not treat any whole current pair as context-safe for Q90. Two neutral paired proposals replace that production direction, pending stable-speaker/context binding and actual durations. |
| Q90-F12 / P1 | Good recorded English is often adequate. General male danger ASR is “ALERT! EVERYONE, WATCH OUT!”, not the older catalog's wolf claim. General male farewell ASR is only “Take care out there!”, not an extended supplies promise. | Correct the *audit conclusion*, not canonical transcripts: earlier F02/F03 concerns here are unconfirmed/superseded by newer ASR evidence. Both legacy files still face voice-identity hold. Do not commission solely to fix a disproven catalog inference. |
| Q90-F13 / P1 | 2026-10-31 audit says Q30 is unimplemented. Current bark request supplies last URL and resolver avoids it when alternatives exist. Different URLs can still have same/near-identical text. | Mark old no-dedup finding historical. Do not add a new repetition architecture. Diversify structure selectively; do not re-record all cross-speaker duplicate sentences. |
| Q90-F14 / P2 | Personality/relationship affect text-only greeting fallback; voiced variants lack these filters. V3 tiers differ from V1. Local standing thresholds were only proposed. | Six personal and two held local-standing greeting takes. Existing four personal levels remain. Do not infer known crimes/rescues, deny trade or change quest permissions through tone. |
| Q90-F15 / P2 | Declared intents are not producers. No `call_for_help`, thirst, injury, repair completion, bereavement or weather-remark request found in inspected current bark call-sites. `quest_offer` is not evidenced by inspected store/composition voice calls. | No new recording budget for these events. Retain old text ideas with explicit binding/knowledge gates. This is a bounded source finding, not proof no indirect caller can exist anywhere. |

Other English issues worth fixing only where used: “Support needed!” reads like a radio call; “Threat nearby”/“Something hostile” reads like system telemetry; “Seeking cover” is stilted; “You picked the wrong guy!” is overly modern/brash for a default guard; “I haven't eaten all day” and “My watch is done” assert history the trigger does not carry. Prefer existing safe same-speaker alternatives before a new take. Simple “Good to see you”, “Watch your step out there” and “A clear price saves a long argument” do not need embellishment.

## Recomputed coverage and reuse

Inventory is **317 distinct files = 109 V1 public + 208 donor-only**. Every shared file is byte-identical to its staged counterpart; this is not an acoustic-duplicate test. ASR: 275 matches, 42 mismatches. Five banks exceed 20% mismatch: legacy general female/male, guard, Dramatic guard, primary shepherd. Their bank gates survive casting acceptance.

The core matrix uses **12 existing-event slots**: greeting, attention, farewell, three quest reactions, exhaustion, hunger, neutral shelter, danger, combat, task end. Guard response and livestock danger are additional role slots. “Physical slot exists” uses ledger file metadata and must not be confused with correct words/context. The JSON keeps all files, proposed take references, selected candidates and empty approved lists separately.

| Speaker / target | Files (public) | ASR match / mismatch | Selected conditional reuse slots | Remaining direction |
| --- | ---: | ---: | ---: | --- |
| FairyTail primary male | 0 (0) | 0 / 0 | 0 | 12 core takes P0; craft and optional variants separately. |
| george older male | 0 (0) | 0 / 0 | 0 | 12 core takes P1; age eligibility, not automatic birthday recast. |
| Rick alternative male | 0 (0) | 0 / 0 | 0 | 12 core takes P1; not fisherman-only. |
| Hannah | 38 (0) | 36 / 2 | 11 | Replace work-end semantics; retain safe recorded core. |
| Guard | 22 (22) | 17 / 5 | 9 incl. guard response | Three physical core gaps (needs, task end), time-neutral greeting and less theatrical combat proposal. Neutral-weather candidate needs mismatch confirmation. |
| Arthur | 21 (21) | 21 / 0 | 7 | Four physical gaps (needs, shelter, task end); neutral accepted-quest cue without return/stealth instructions. |
| Expressive Female merchant | 17 (17) | 16 / 1 | 5 | Six physical core gaps; neutral completion/farewell alternatives; source identity confirmation before production. |
| Dramatic guard | 40 (0) | 31 / 9 | 10 incl. guard response | Three held semantic replacements; role fit and mismatch gate unresolved. |
| Cowboy | 38 (0) | 35 / 3 | 12 | Reuse, including QC correction of “All right/Alright”; no duplicate core pack. |
| catalog Laura | 38 (0) | 36 / 2 | 12 | Source UUID held; no new takes, not Kate. |
| Hetalia primary shepherd | 5 (5) | 2 / 3 | 0 | Gender/role and mismatch hold; nine physical core gaps, no speculative new pack. Species-specific danger not generic-safe. |
| Sleepless Historian | 10 (0) | 10 / 0 | 3 | Role unresolved; nine physical core gaps. Flock/sheep lines held; same-speaker generic danger can cover a flock-threat warning without naming stock. |
| Mark pilot | 6 (0) | 6 / 0 | 3 | Greeting/farewell/danger reuse candidates; thanks/daily/advice need bindings. Ten physical core+guard-response gaps, full pack authorization absent. |
| legacy Casual Male | 22 (22) | 12 / 10 | 0 | Hold identity; four physical core gaps are not a reason to commission obsolete target. |
| legacy Warm Female | 22 (22) | 15 / 7 | 0 | Hold identity; five physical core gaps; Hannah is a potential stable cast, never an in-conversation fallback. |
| Brian | 38 (0) | 38 / 0 | 0 | Permanent global exclusion. |

**72 shortlisted reuse files = 21 already-public + 51 donor-only**; all remain pending, some additionally held for source/casting/bank review. These are a practical review shortlist, not a claim the remaining 245 are bad. Keep unused thanks/offers/age/pilot clips for later appropriate contexts. Do not delete archived recordings.

The ledger's `voiceId` is a profile alias rather than UUID for four `_b` banks (Dramatic, Cowboy, Laura, Historian). Resolve aliases using the donor Voice sources table and later author decisions. This does not prove the audible source UUID, particularly Laura. ASR itself can mislead heuristic tags: legacy male rain ASR reads “Range coming down hard” and has `weatherWord=none` despite rain catalog text; never admit that as neutral merely because the tag says none.

Good reuse examples: Hannah attention 02 avoids the uncertain “overhear” ASR; Hannah hunger 01 avoids ambiguous “work and wait”; Arthur greeting 02 avoids morning; Cowboy hunger 02 avoids a travel claim; merchant_b exhaustion 02 avoids standing-history claims; Mark danger is brief and species-neutral. Actual canonical spelling/contractions still need confirmation where relevant (e.g. Mark farewell “will ya” versus catalog “will you”).

## Production budget and deduplication

| Priority | Proposed takes | Composition |
| --- | ---: | --- |
| P0 | 12 | FairyTail's twelve core existing-event slots. |
| P1 | 54 | george/Rick core 24; guard 5; Arthur 5; merchant 8; Hannah task end 1; profession replies 11. |
| P2 | 21 | Personal/local greetings 8; weather variants 6; held Dramatic semantic repairs 3; two complete campfire pairs 4. |
| Total | **87** | Proposals only; approval and production can be staged. |

This is not a claim that 87 recordings make every possible cast complete. Held shepherd/Mark/child banks and new-event bindings remain explicitly out of the recording budget. Neutral shelter covers all three admitted weather types within a speaker; snow/storm specificity is optional P2. Weather silence does not require repeating Q31's entire three-voice weather matrix.

Dedup checks: unique proposed filenames, no collision with any existing asset or old Q31/catalog filename; unique normalized transcripts within each speaker (86 unique texts across 87 takes); no exact normalized match with existing ledger catalog/ASR transcripts. Retained earlier *unrecorded* proposal text is mapped to one Q90 take. Comparison normalizes case/punctuation, not semantic equivalence or audio. Editorial semantic review removed an unnecessary Cowboy work-end replacement because a same-speaker candidate exists. The identical “Hello. What brings you here?” appears once for Guard and once as FairyTail’s calm variant; this is intentional separate-speaker coverage, not two takes for one NPC. Cross-speaker near-equivalents such as defending oneself are also intentional; they are not grounds for borrowing another speaker.

The [81-row table](./2026-11-04--q90-supersession.md) supersedes the **old production proposal schedule**, not existing canonical recordings. Every old filename has an action and Q90 alternatives or conditional reuse reference. Legacy male/female UUID assignments, redundant weather variants and unbound new-event lines are not automatic production orders. Q31's implemented weather-chain contract remains valid; its older descriptions of actual audio and general fallback are historical.

## Author decisions still open

1. **Resolved 2026-11-04:** Author approved the complete 87-take script (P0 12 / P1 54 / P2 21) for Fish Audio generation. This approval does not waive clip QC, casting/source holds or runtime prerequisites.
2. **Resolve remaining identity/casting gates.** Merchant source UUID (including suspected Laura mismatch), legacy general voice inconsistencies, Dramatic role fit, Historian final role, primary shepherd gender/role metadata; Molly's assignment remains a candidate. Named roles/keys and existing voice identity must survive future integration. The three new male directions are already selected; only their recordings/QC are missing, not another bookmark decision.
3. **Confirm discrepant actual speech.** Especially female/guard weather and Dramatic shuffled meanings, plus the complete 42-row mismatch list. ASR punctuation/spelling differences need proportional review; no automatic canonical replacement.
4. **Decide optional local-standing thresholds and later binding scope.** Profession/personal greeting and campfire text is prepared; no new selector, runtime trigger or dialogue architecture is introduced here. Keep Q46/event work separately owned.
5. **Later, only if desired:** authorize Mark's full pack; choose child voices and child→adult policy. Neither blocks reviewing this bounded adult script. Do not rename Anna/Piotr/Kasia/Marek as a side effect of English writing.

No narrative rewrite is required for this package. Inherited relative “tomorrow” and authored water-quality claims are flagged in the writing pass for a later quest decision rather than silently changing objectives or simulation.

## Verification and handoff

Executed documentation checks: ledger/tree reconciliation for all 317 donor files and all 109 public copies; counts and UUID shape/blocklist checks; required per-take fields; exact generation-input/transcript equality; proposed filename/transcript uniqueness and asset collisions; normalized comparison with both ledger transcript columns; complete 29+52 supersession coverage; exactly two paired exchanges with one question/answer each; local repository-link targets; source-file integrity against fetched pin. No runtime checks are claimed or required for this documentation-only change.

Next action: author reviews this packet, resolves the relevant production holds, then generates only the selected approved takes. Q88/Q89 must retain their own casting/clip gates; Q40 waits for delivered QC-passed files and exact speaker/transcript integration. **Q90 editorial/script approval is complete**; audio generation, QC and downstream implementation remain incomplete. Do not register proposed filenames, assign a new speaker through a missing-clip fallback, or replace canonical subtitles from this document without approval.
