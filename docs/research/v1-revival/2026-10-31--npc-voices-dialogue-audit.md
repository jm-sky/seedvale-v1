# NPC Voices & Dialogue — Revival audit and diversity proposal

**Date:** 2026-10-31  
**Status:** Research complete; proposals pending author approval. No production code or audio changed.  
**V1 source pin:** `ca2d0020b825e2e0c7f46d30d599b76eac10b169`  
**V3 donor pin:** `47733d6ba0fe96d4607be22c470c7331c76c2c5c`  
**Authority:** Current task, Strategic Brief unified voice goal, Q11/Q30/Q31/Q40. English-only applies to all newly proposed NPC dialogue/display text/audio. This does not silently approve a full-game localization or name migration.

## 1. Deliverables and evidence limits

- [New line catalog](./2026-10-31--npc-voice-expansion-catalog.md): 52 additional proposed recordings, with conditions, profiles, filenames and generation input.
- [Machine-readable catalog](./2026-10-31--npc-voice-expansion-catalog.json): those 52 proposals plus 29 explicitly referenced existing Q31 rows. Q31 is not a second production order.
- [Inventory and duplicate ledger](./2026-10-31--npc-voice-audit-inventory.json): 399 donor-catalog entries, file/blob presence in both repositories and staged V1 donor assets, all 48 active V1 manifest pools, exact and similar text groups.

Method: untruncated recursive Git trees, source inspection, catalog parsing, normalized-text comparison and token-set similarity. Git blob equality establishes identical stored file bytes; different hashes do not establish different spoken content. No MP3 decoding, listening, browser session, FPS measurement, runtime test execution or full-game localization census was performed. All transcripts remain source/catalog evidence, especially history-recovered entries. Excessive repetition below is a structural risk, not measured player exposure.

Read Strategic Brief, queue Q11/Q30/Q31/Q40, planning index/rules, current state/navigation, Q11 recon and Q31 script; relevant plans npc-044/045/049/050/056, ai-002 and ui-input-047 plus its implementation notes. Older plans describe superseded stages: do not restore legacy packs or follow their stale freeze/Polish-UI assumptions as new decisions.

## 2. Asset and text inventory

| Layer | Verified count / meaning |
| --- | --- |
| V1 flat public voice MP3 | 109 |
| Main semantic manifest | 60 URLs in 48 keys; 37 keys have exactly one URL |
| Separate campfire registry | 12 files, 6 paired exchanges, 3 topics |
| Other V1 flat files | 37 outside those two registries; presence is not runtime activation |
| V3 flat voice MP3 | 317 |
| Staged V1 donor MP3 | 317; every file matches current V3 name and Git blob SHA |
| Shared V1-public/V3-public | All 109 V1 files byte-identical to their V3 counterparts |
| Additional donor recordings | 208 = 202 second-bank clips + 6 Mark Hornblower pilot clips |
| Donor catalog | 399 unique entries: 317 in_repo, 82 planned |
| Exact duplicate MP3 blobs within V3 | 0; no acoustic-duplicate claim |
| Normalized recorded-text duplicate groups | 45 groups involving 91 files; 7 groups have multiple V1-public files |

Counts exclude V1 `bak/` and `references/`, historical comparison copies and non-MP3 files. They are not playback inventories. The JSON identifies every catalog filename and registration separately.

V1 text sources are not one corpus: `ai/dialogue.ts` has five need buckets × four archetypes × doing/seeking, two phrases per bucket (80 lines plus two neutral fallbacks); `dialogueTemplates.ts` builds self/family, activity, village, assistance, expedition and farewell text; `npcDialogueGreeting.ts` pairs selected English recordings with Polish translations; `NpcDialogueMenu.vue`, `store.ts`, domain callbacks and quest definitions supply additional displayed dialogue. Dynamic names, durations, family, locations and quest results cannot be voiced by substituting a vaguely matching generic recording.

### Active semantic coverage

There are 24 declared semantic intents, including three weather-specific variants. A declaration, a pool and a live producer are separate facts.

| Exact scope | Registered keys / files | Coverage |
| --- | --- | --- |
| general:female | 6 / 6 | greeting, farewell, exhausted, weather_shelter, danger_alert, call_for_help |
| general:male | 9 / 9 | greeting, farewell, exhausted, hungry, weather_shelter_rain, danger_alert, combat_start, call_for_help, work_finished |
| merchant:female | 5 / 7 | greeting, farewell, confirmation, thanks, attention |
| guard:male | 13 / 18 | greeting, farewell, attention, refusal, thanks, quest_accepted, quest_declined, quest_complete, weather_shelter_rain, danger_alert, combat_start, call_for_help, guard_response |
| hunter:male | 14 / 19 | greeting, farewell, confirmation, attention, thanks, warning, well_wish, quest_offer, quest_accepted, quest_declined, quest_complete, danger_alert, combat_start, call_for_help |
| shepherd:male | 1 / 1 | livestock_danger |

Other professions, male traders, female guards/hunters/shepherds have no dedicated active scope. They use general gender fallback where available. No active age-keyed or NPC-specific keys exist, despite lookup support and files on disk. For example, female hunger/work-finished is silent; male snow shelter is silent; female shelter uses neutral weather wording. Q31 targets these known gaps.

The 37 unregistered non-campfire files include generic female thanks/confirmation/quest reactions, merchant quest pools, guard offer/warning/confirmation, age bands, shepherd greetings/farewell and hunter second variants. Reuse/QC is cheaper than re-recording merely because these files are not registered. Some semantic intents still lack proven call-sites, so registration alone may have no audible effect.

### Profiles

Six primary Fish profiles cover general male/female, guard male, hunter male, merchant female and shepherd male. Campfire male/female are aliases of the general voices. UUIDs are in the catalog; simulation `trader` maps to filename scope `merchant`; `confirmation` maps to keyword `agree`. Legacy filename typo `shepard_male_danger_alert_01.mp3` must be explicitly mapped, not silently renamed.

## 3. Current runtime and trigger boundaries

| Source / event | Implemented behavior | Missing or proposed |
| --- | --- | --- |
| `NpcAgent` exhaustion | `goTo/execute` becomes exhausted; requests `exhausted` | More same-profile variants; no new tiredness threshold |
| Need arbitration | Selecting food after a different need requests `hungry` | No thirsty bark merely because water need exists |
| `beginSeekShelter` | Existing shelter behavior carries current weather; Q31 rain/storm/snow lookup | Fog, light rain below pressure threshold, dry cold and clearing do not have ambient bark triggers |
| Animal-threat perception | New threat episode requests `danger_alert`, or `livestock_danger` for flock threat | Request carries episode ID, not species/stock-kind eligibility metadata |
| `beginCombat` | Requests `combat_start` after accepted combat start | Do not assume female combat is impossible because its pool is missing |
| Guard assistance | Existing response branch requests `guard_response` | Preserve real successful intervention conditions |
| Terminal execute | `work_finished` only when completed action is classified as schedule work | Does not mean the entire day/watch ended or a particular item was produced |
| `call_for_help` | Manifest, limiter policy and request API exist | No producer found in inspected NpcAgent/social/settlement/composition paths; confirm integration before commissioning as immediately usable |
| Player proximity | Relation drives normal→attention, warm/enthusiastic→greeting; OCEAN/traits/local renown affect reaction probability | No relation-specific clip filters or reputation-based tone; proximity bypasses greeting time-context filtering |
| Dialogue open | One greeting payload; known transcript and time validation, otherwise text-only | Relation/personality affect fallback text only when clip is absent/ineligible |
| Offer acceptance/close | Store requests quest_accepted, quest_declined or farewell | Semantic cues, not exact readings of displayed quest/farewell text |
| Quest completion | QuestManager requests quest_complete through injected stable-NPC-ID callback; unloaded NPC is silent | Generic clip may assert danger/reward absent from actual outcome |
| Quest offer | Intent and some files exist | Inspected store/QuestManager voice calls do not establish a live quest_offer producer; do not equate type union with implementation |
| Campfire | Social pairing selects whole Q/A once; opposite genders only; delayed answer belongs to existing lifecycle | No weather, actual work, knowledge, voice-profile or personality eligibility at selection |
| Proactive follow-up | Existing deliver_world_knowledge path and NPC-initiated dialogue | Not a generic news, death, repair, injury or reputation-event bark system |

Primary paths: `src/ai/NpcAgent.ts`, `npcBarkRequest.ts`, `npcBarkPolicies.ts`, `npcBarkLimiter.ts`, `npcVoiceLines.ts`, `socialBehaviour.ts`, `campfireTalk.ts`, `src/ui-vue/npcDialogueGreeting.ts`, `store.ts`, `src/quests/QuestManager.ts`, `src/app/createApp.ts`.

Limiter uses simulation seconds and settlement/area IDs. Weather: 900 s per NPC, 2 per area/300 s; optional shared budget 4/300 s. Hungry/exhausted: 1200 s, 2/300 s; work_finished: 1200 s, 1/300 s. Threat policies use 60 s windows/cooldowns and episode suppression. Q30 is still ready, not implemented at the pin: limiter has no clip/transcript memory and pool choice uses Math.random. Playback can be inaudible/unconfigured after admission; accepted does not prove listener exposure.

## 4. Findings and minimal corrective directions

| ID / severity | Evidence and consequence | Minimal direction |
| --- | --- | --- |
| F01 HIGH — timbre switches | `voiceProfileIdFor` returns role:gender, but lookup ignores supplied voiceProfileId. A hunter greeting is hunter voice, exhaustion and shelter can be general male; shepherd greeting is general male but livestock danger is shepherd. Campfire uses general voices for all matching genders. | Freeze a compatible speaker profile, then select only recordings within it, across dialogue, barks, quests and campfire. Missing audio stays text-only/silent after an explicitly approved fallback policy. |
| F02 HIGH — species overclaim | General male danger catalog says “Wolf! Everyone, watch out!”; livestock line names wolf/sheep. Producer covers an animal-threat episode without those specific guards. Some transcripts were recovered heuristically. | Listen/QC first; use neutral proposed P0 lines or supply verified species/livestock guards. Do not silently edit a transcript under existing audio. |
| F03 HIGH — text/audio contract | UI is Polish; audio English. Greeting is faithful translation, other cues are semantic. Donor general_male_farewell_01 prompt adds “I'll be here if you need supplies.” absent from caption. | Canonical English resolved line + exact recording binding; quarantine mismatches until actual listening. Preserve quest outcomes and dynamic information even if unvoiced. |
| F04 MEDIUM — repetition | 37/48 singleton keys; no URL dedup; identical texts across profiles still repeat after URL dedup. | Complete Q30, then bounded transcript/semantic-family recent history as a separate proposal. Add Q31 variants; do not raise speech frequency. |
| F05 MEDIUM — campfire truth | Six exchanges selected by gender only; forecasts, time, worked-since-sunrise and road/wolf observations lack supplied conditions. | Gate whole pairs with real facts; replace unsupported assertions with neutral pairs. Keep existing pairing, relationship effects and cancellation. |
| F06 MEDIUM — social flattening | Voiced greeting ignores relation/personality. Personal levels are stranger/acquainted/friendly/trusted; local reputation has five -100..100 dimensions and separate renown. | Select a few familiar/tone variants from existing inputs. Low trust is not personal hostility and never changes trade/quest permission. |
| F07 MEDIUM — incomplete catalog/registration | 37 non-campfire files unregistered; merchant_female_greeting_03 missing from V1 catalog and deliberately text-only on open. Donor catalog describes it, shared file hashes match. | Audit/reconcile existing entries with listening before registration; use donor evidence without claiming the inferred transcript is heard truth. |
| F08 MEDIUM — context beyond weather | Proximity greeting can choose “Morning” without the dialogue-open guard; hunter quest-complete can imply lethal danger for mundane work; guard greeting asserts weapon rules. | Shared presentation eligibility filters for all consumers, selecting eligible candidates before random choice. |
| F09 MEDIUM — Q31 wording exceeds trigger | Snow pressure can arise above intensity .45 or from cold floor; “snow piling up”, “can barely see”, “snowing harder” are not proven. Storm type does not prove a lightning flash/thunder sound occurred at that moment. “Haven't eaten all day” is not established by hungry. | Review the existing rows before recording; see §8. Keep IDs and Q40 ownership, not another 29-line batch. |
| F10 LOW — documentation drift | V1 catalog says Polish UI; older notes still mention freeze/legacy stages; donor in_repo is not listen-QC. | Retain historical evidence; explicitly supersede new-content language direction here and reconcile runtime catalog only when assets/implementation change. |

No defect here is a claim of measured audible behavior in the browser.

## 5. V3 donor disposition

All 317 files are already staged under `docs/v3-donor/voices/mp3/`. Use those pinned bytes; no additional import/download is needed for the audit.

| Candidate | Size / disposition | Dependencies |
| --- | --- | --- |
| Shared primary and campfire files | 109; already V1 public assets, identical hashes | QC and registration/context reconciliation; no duplicate copying |
| general_male_b | 38 | Author taste ledger says mechanical/no emotion; do not make it a default just because available |
| general_female_b | 38 | Candidate second stable voice after listening/casting; 38 texts duplicate male_b exactly |
| merchant_female_b | 38 | Candidate independent speaker bank, not random alternate timbre per sentence |
| guard_male_b | 40 | Author flagged unnatural/narration-like delivery; casting decision required |
| hunter_male_b | 38 | Candidate stable hunter bank; wording/context QC still applies |
| shepherd_male_b | 10 | Limited bank: greeting/farewell/danger/help/livestock; insufficient by itself for full life-bark coverage |
| Mark Hornblower pilot | 6 | Existing friendly-male cast evidence from V3. Bind V1 characterKey marek_hornblower explicitly; never display name or any guard. No automatic V1 rename to Mark |
| Ordinary/greeting text banks | English condition tables and 17 daily scenes | Adapt role/condition ideas, not V3 social tiers, Saltmere roster, M4/S4 runtime or unsupported professions |

Mark files: greeting, farewell, danger_alert and thanks match V1 semantic vocabulary, but thanks still needs an actual approved presentation call-site. road_advice and daily need explicit new line/topic bindings. V3's current inert exact-line manifest includes only greeting/farewell/road_advice and all three are `unverified`. The resolver is useful as a contract example (profile + exact line + transcript + QC digest), not evidence that V3 has working live dialogue audio. Its six-file pilot is not approval to record the remaining pack.

V3 ordinary text contains miller/carpenter/charcoal_burner/innkeeper, absent from V1 Role; do not add professions to fit donor text. Kate's textile scene cannot be copied onto V1 Kasia simply because the surname matches: V1 Kasia is a trader.

## 6. Duplicate and repetition analysis

The JSON contains every exact group and similar pair. Normalization ignores case and punctuation, not meaning. Token Jaccard >= .70 flags near matches for editorial review; it can score reordered words as 1.0. It is not an acoustic or semantic classifier.

Examples:
- general male/female exhaustion: “I need to sit down for a while.”
- general male/guard rain: “Rain's coming down hard. Better get inside.”
- guard/hunter help: “Could use a hand here!”
- `shepard_*danger_alert` and `shepherd_*livestock_danger`: same wolf/sheep text, different file hashes.
- 38 male_b/female_b sentence pairs are identical, including greetings, needs, combat and weather.
- near pairs: “Thank you. I appreciate it.” vs “Thank you. I really appreciate it.”; “I need to sit down for a while.” vs donor merchant's expanded variant.
- semantic formula repetition persists below the numeric threshold: safe travels / good work / count on you / come back when done. Variants should sometimes change phrasing structure, not just add “very” or “really”.

Cross-gender duplicate sentences are not inherently faults; they should share a text/family repetition key where appropriate. Do not delete useful coverage or re-record 38 pairs simply to achieve unique wording.

Q30 URL dedup remains the approved bounded first step. Proposed later policy: retain last 3 normalized line IDs per area for 300 simulation seconds plus last line per NPC; prune on request and world disposal. Try a finite eligible pool, never random retry loops. Optional exhaustion of alternatives means silence; required danger/help may repeat if silence would remove the only cue. This exception and memory sizes need approval, and are not changes to Q30's current definition. Do not add listener position/budget redesign under this audit. Keep history presentation-only, independent of simulation RNG/state.

## 7. Proposed diversity model — no new simulation system

### Personality

V1 already stores BigFivePersonality (OCEAN, five 0..1 values). `nearestArchetype` derives calm/cheerful/curious/grumpy for text buckets. Deterministic generation jitters four anchors; traits curious/energetic/fast_worker/night_owl/sociable remain separate and already affect behavior.

**Recommendation:** keep these four archetypes as the first editorial style buckets. Neutral lines serve everyone; add one style override only where it noticeably changes the encounter. No four-way expansion of every recording.

Optional later derived dimensions, not new persistent traits:
- Outgoing/reserved: extraversion; not “openness”, which already means receptiveness/curiosity.
- Curious/practical: openness.
- Reassuring/terse: editorial projection of agreeableness, used cautiously.
- Composed/anxious: neuroticism. Do not label neuroticism “impulsiveness”.
- Cheerful/grumpy: current archetype tone, not new authoritative mood.

Independent presentation dimensions could express mixed characters better but multiply eligibility rules and recording cost. Existing archetypes are sufficient for this pass. “Calm/impulsive” would require a new interpretation/model and is not recommended now. Do not alter OCEAN, social scores, work speed or decision weights to make a sentence eligible.

### Selection and fallbacks

Proposed extension of existing resolver, not a second dialogue engine:

1. Domain owner commits the real action/open/transition and supplies minimal existing facts. No voice-triggered world effect.
2. Read stable speaker casting. Authored characterKey override; procedural assignment from stable NPC identity and a versioned/frozen compatible profile mapping. Do not use array position, current pool length or clip availability. Preserve identity across streaming/rebuild/save/load and later role changes; define age progression policy explicitly.
3. Filter by hard truth: actual intent, weather, activity/outcome, relation, known facts, age compatibility, same voice profile and verified transcript.
4. Prefer exact authored/context line; then one useful profession OR relation OR personality variant; then same-profile neutral semantic line; then text-only/silence. Never relax weather/species/fact truth or change speaker profile to fill a gap.
5. Suppress recent repeats within bounded presentation history; select once per committed turn, store one immutable text/URL payload. Never reroll on Vue render or consume simulation RNG for new presentation choices.
6. Keep dynamic quest facts as their actual English text. If no exact recording exists, show text-only rather than append a generic unrelated spoken completion under those subtitles.

Weather chain remains snow→neutral, rain→neutral, storm→rain→neutral, but within the chosen profile. Q31 currently prefers weather correctness across role scopes; proposed profile locking must preserve weather correctness while forbidding timbre switches. Approve silence/coverage strategy before implementation.

A profile is reusable by many NPCs; profession is text/context, not necessarily a unique actor voice. Initial recording allocation: core existing-intent coverage first, 11 selective profession replies (one per current Role), six familiar/archetype greetings, two optional local-standing greetings. Do not multiply all roles × genders × personality × relation × weather.

Humor: understated observations about work, rest or mild inconvenience, mainly cheerful/curious variants; no jokes during danger, serious injury, bereavement, critical hunger, alarming weather or distrust. The catalog marks humorous rows explicitly. No humor variant changes facts or grants resources.

## 8. P0/P1/P2 and implementation dependencies

Priority is editorial/engineering urgency, not approval or immediate generation readiness.

| Work | P0 | P1 | P2 |
| --- | --- | --- | --- |
| Existing Q31 | Batch A: 12 | Batch B: 9 | Batch C: 8 |
| New catalog | 3 neutral/context-safe replacement candidates | 32: primary-profile gaps, profession replies and selective greetings | 17: new weather/needs/event bindings, reputation and campfire pairs |
| Runtime | Q30; exact text/QC and profile contract decision | Same-profile routing, English dialogue payloads, existing-fact selectors | Approved new triggers and richer pair/standing eligibility |
| Donor | Reconcile existing V1 files/transcripts | Reuse suitable staged banks after casting/QC | Broader named/pair material only after admission exists |

**Total review queue: 81 rows = 29 existing + 52 new.** This is not a recommendation to generate all 81 now. Reuse approved existing donor recordings where they cover the chosen fixed profile; cancel superseded proposed rows explicitly.

Before recording Q31, propose the following wording corrections in its owning script (not silently adopted here):
- male snow 01: “Snow's coming down. Time to get under cover.”
- guard snow 01: “Snow's coming down. Find some shelter.”
- female snow 02: “Still snowing. I'm heading home.”
- guard snow 02: “Best get under cover in this snow.”
- male storm 01: “Storm's on us. I'm getting indoors.”
- female storm 01: “This storm's getting rough. I'm heading inside.”
- female hungry 01: “I'm hungry. Time to find a bite.”
- male work_finished 02 / female work_finished 01 are safe completion-level variants; avoid treating completion as end of day. Existing “enough work for today” and donor “my watch is done” need stronger end-of-duty conditions.
Other Q31 mood/intensity claims are editorial candidates too: a shelter request does not prove soaked clothes, gale damage or a measured lack of visibility. Prefer neutral observation unless exact guards are supplied. Q31 filename ownership and 12/9/8 accounting stay intact.

| Dependency | Concrete change / owner | Approval or prerequisite |
| --- | --- | --- |
| D0 | Listening/QC ledger: exact file hash, actual speech, voice, English locale, pronunciation, duration and prompt | Before any existing recording becomes an exact subtitle source; audio not generated here |
| D1 | Profile-bound manifest/resolution across npcVoiceLines, bark request, UI/quest and campfire consumers | Approve casting/fallback policy; expand existing seams, no parallel audio engine |
| D2 | Shared English text+clip committed payload, using existing session/turn guards | Migrate greeting first, then ordinary replies and quest cues; dynamic text may remain unvoiced |
| D3 | Selective existing-fact filters for relation/archetype/profession/topic/follow-up | No new action or social simulation; new intents still need type/manifest and explicit call-site bindings |
| D4 | Local-standing tone projection | Proposed trust ±30, renown >=20 are draft thresholds; do not invent hostile RelationLevel or specific crime knowledge |
| D5 | Optional weather-observation trigger | Author must approve; once per observed episode, existing clock/budget; no global per-frame scan |
| D6 | Needs/injury/repair/death/threat-end producers or confirmed help producer | Locate actual domain edge, truth/knowledge and lifecycle contract first; no assumption that audio events already exist |
| D7 | Profile/context-compatible whole campfire pairs | Existing socialBehaviour pairing and NpcAgent lifecycle retained; no independent answer admission |

Production order recommendation: verify/reconcile source recordings and author decisions → Q30 + Q31 wording review → generate only approved Q31/profile-compatible rows → Q40 registers delivered files → exact English/payload/profile implementation → existing-fact variants → separately approved new event adapters. Q40 must remain blocked until files actually exist; do not register planned URLs.

## 9. English-only migration boundaries

All new proposed lines, displayed equivalents and generation inputs are English. Existing inconsistencies:
- V1 catalog explicitly documents Polish UI / English semantic clips.
- Greeting table and fallback greetings are Polish.
- Need/personality bank, dynamic dialogue templates and player invitations are Polish.
- Quest and domain result strings remain Polish in existing paths; generic English cues are not translations of those full results.
- Existing names/character keys are not dialogue-language errors to rename opportunistically.
- V3 English tables are source candidates, not permission to copy its names, locales or social rules.
- `generation_input` metadata can differ substantively from catalog text: recorded general male farewell; planned general male agree and child farewell 11. Correct only after deciding actual intended/recorded text.

Propose bounded NPC-dialogue migration, preserving identifiers and callback contracts. No translations of all inventory/HUD/game screens are included. Preserve dynamic values and exact quest meaning; never trade quest information for convenient existing audio. New Fish inputs here deliberately equal the canonical text without expressive tags. Future tags are metadata only and require per-voice audition; they must never appear in display text.

## 10. Verification handoff

Documentation checks performed: unique 399 parsed catalog filenames; statuses 317/82; all 317 in_repo entries match V3/staged assets; all 60 manifest URLs exist in V1; 12 campfire files exist; all 109 shared hashes match; 29 Q31 rows parsed; 52 proposal filenames unique and do not collide with existing/planned catalog or Q31; each proposal has text, intent, conditions, role/style, Fish profile/UUID, filename and generation_input. New texts checked against donor catalog and Q31 for exact normalized duplicates. Mechanical near-match candidates are editorial, not measured repetition.

Later implementation verification:
- Same NPC keeps one profile through greeting, weather, hunger, quest and campfire; reload/rebuild and role/age lifecycle tests.
- Correct snow/rain/storm/weather-neutral fallbacks with no cross-profile fallback.
- No wolf/sheep, morning, forecast, finished-watch, resource, reward or known-deed claim without its actual condition.
- No repeat when alternatives exist; bounded memory and required-cue exception behavior tested; no change to world decisions, needs, relationships or quest effects.
- One selected line gives one English payload; exact clip/text binding, missing/QC-failed clips text-only; stale async/UI replies remain suppressed.
- Campfire question/answer coherence, profile compatibility, interruption before answer, same-gender silent simulation preserved.
- Real audio listen pass on seed 415424794, mixed professions/genders and repeated encounter scenarios; time-skip/streaming and silence remain observable tests. No automatic full-suite or benchmark claim is made for this documentation change.

## 11. Author decisions to approve

1. Adopt fixed voice identity with same-profile fallback and text-only/silence when a line is missing; decide coverage budget and child/age policy before activation.
2. Use existing four archetypes for selective dialogue style; no new persistent personality dimensions.
3. Accept bounded English NPC-dialogue migration and exact text/audio pairing; decide whether quest-specific text remains unvoiced until exact recordings exist.
4. Approve Q31 wording corrections and first recording subset from P0/P1; retain contextual restrained humor.
5. Select donor casts: Mark→V1 marek_hornblower explicit binding; whether to defer/revoice rejected male_b/guard_b timbres.
6. Decide whether P2 weather, thirst, injury/aftermath/repair/bereavement, reputation tones and expanded campfire pairs should gain runtime bindings. Their catalog entries are proposals only.

No open proposal above changes the Strategic Brief's approved decision table, simulation model, production assets or queue completion state.

## 12. Author decisions — approved 2026-10-31 (supersedes open questions in §11)

These are explicit author approvals for **NPC Voices & Dialogue** direction, not approval of all proposed catalog rows or immediate runtime implementation. §11 remains the historical list of questions; answers below take precedence over audit recommendations where they differ.

1. **Stable NPC voice:** Each NPC retains one speaker voice across contexts; no cross-voice fallback. Missing compatible audio may use text-only/silence. **Children:** separate boy/girl voice variants, initially only a few lines, **low priority**. Age transition policy remains undecided.
2. **Personality:** Use the four existing archetypes (`calm`, `cheerful`, `curious`, `grumpy`) for selected dialogue variants, not an exhaustive four-way recording matrix. Opus may choose only two archetypes for the initial stage. No new persistent simulation personality traits approved.
3. **Language and quests:** All NPC dialogue is to be English; this is not blanket full-game HUD/inventory localization. Generic English *spoken reactions* are permitted for quests while the separately displayed English text retains exact quest objectives, outcomes and dynamic details. Do not misrepresent a generic cue as an exact reading.
4. **Recording scope and style:** Cover basic reactions **plus profession and social variety**, delivered in stages. Author explicitly wants **more humor and characteristic sayings** than the audit's restrained-humor recommendation. Relevance, real event truth and avoidance of inappropriate jokes in acute emergencies remain requirements; exact Q31 wording corrections and per-line production selections still need editorial/QC handling.
5. **V3 donors:** **Maximize reuse** of V3 voices, including considering banks previously judged weaker. This does not cancel approved stable voice identity or listening/QC requirements. **Mark Hornblower:** use after listening; author reports Mark's V3 voice sounds good. Bind to the corresponding V1 stable character identity without an automatic rename.
6. **Living-world speech:** Extend NPC reactions to **real** events (including thirst, injuries, end of danger, completed repairs, relations and campfire variety), with **natural, moderate** spontaneous frequency. Broader omniscient social commentary is not authorized: use facts/knowledge actually available to NPCs. Specific new triggers, budgets, and adapter details are to be planned and verified.

**Implementation boundary:** This record approves product direction and answers the six questions, but does not mark Q30/Q31/Q40 done, authorize generation of every proposed recording, or change production code/assets. Resolve ordinary technical details through existing owners and planning rules.

