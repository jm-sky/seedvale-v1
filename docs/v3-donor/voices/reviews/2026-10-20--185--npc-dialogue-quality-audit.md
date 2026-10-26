# NPC dialogue quality audit and production handoff

**Status:** `verification needed` (editorial pass complete; audio listening/runtime gates open)  
**Created at:** 2026-10-20  
**Created by:** ChatGPT Sol  
**Domain:** dialogue, NPC, narrative, voice production  
**Roadmap:** M4, M5/M6 situational events, M7 voice/quests, M9 social and knowledge  
**Scope:** Documentation and `planned` text only; no runtime, Fish request or MP3 change  
**Baseline:** `main` HEAD `c6d6e50c8881c67c3586e149b1737d4c5d2fa3d3` (2026-10-20)  
**Decided by:** ChatGPT Sol — preserve recorded speech; differentiate profession defaults only where meaningful; keep actor-authored Hornblower dialogue out of generic profiles  
**References:** [voice catalog](../dialogue/NPC-VOICE-CATALOG.md), [Saltmere scene drafts](../dialogue/saltmere-daily-conversations.md), [Hornblower pack](../dialogue/saltmere-hornblowers-dialogue-pack.md), [recorded backlog](../dialogue/recorded-lines-replacement-backlog.md), [greetings](../dialogue/greetings.md), [ordinary interactions](../dialogue/ordinary-interactions.md), [canonical population](../world/areas/home-population.md), [Q0 actor keys](../quests/canon/q0-cast-and-names.md), [vision](../vision/VISION.md)

## Executive finding

The initial issue was **not** six distinct written character voices: the original `*_b` set used one identical 38-line script for five professions/voice groups, plus four extra sheep/guard responses. It offered timbre diversity but almost no semantic variation. This pass differentiates all **126 still-planned B-profile lines** and makes **10 surgical primary/age `planned` edits**. **No `in_repo` text changed.** Generic lines are allowed to overlap when genuinely natural. The 17 Saltmere daily scenes already have actor keys, so Mark and Kate are revised as *authored scene candidates* rather than by relabelling a profession voice.

## Catalog inventory — verified against HEAD

| Section / profile | Entries | `in_repo` | `planned` | Assessment |
|---|---:|---:|---:|---|
| `general_male` | 40 | 16 | 24 | Mixed everyday tone; some overly specific wilderness and quest assumptions; 1 material prompt/transcript discrepancy |
| `guard_male` | 31 | 22 | 9 | Often curt and aggressive; useful stern lines need narrower eligibility, not general playback |
| `hunter_male` | 29 | 21 | 8 | Outdoors expertise sometimes becomes role stereotype or implies an unseen danger |
| `general_female` | 36 | 16 | 20 | Broad usable pool, but some recorded reactions are melodramatic/artificial; avoid gender-determined affect |
| `merchant_female` | 22 | 17 | 5 | Recorded corpus overidentifies trade with constant sales and supplies |
| `shepherd_male` | 5 | 5 | 0 | Small bank; threat clip is duplicated with the `shepard_` typo/alias |
| `campfire` POC | 12 | 12 | 0 | Conversational rhythm is useful, but several “news” answers presume unsupplied observations |
| Primary age-band additions | 16 | 0 | 16 | Four high-risk artificial/conditional elder/young lines revised; other short lines retained |
| `general_male_b` | 38 | 38 | 0 | Recorded; identical text to female B |
| `general_female_b` | 38 | 38 | 0 | Recorded; identical text to male B |
| `merchant_female_b` | 38 | 0 | 38 | Rewritten: people first, fair dealing without a relentless sales pitch |
| `guard_male_b` | 40 | 0 | 40 | Rewritten: measured responsibility, human warmth and context-appropriate firmness |
| `hunter_male_b` | 38 | 0 | 38 | Rewritten: restrained practical observations without constant “wilds and tracks” |
| `shepherd_male_b` | 10 | 0 | 10 | Rewritten: sheep care where relevant, ordinary social language elsewhere |
| **Total** | **393** | **185** | **208** | **136 catalog spoken-text edits, all `planned`** |

**File reconciliation at baseline:** the recursive Git tree contains **185 MP3s** directly under `public/sounds/voices/`; all 185 `in_repo` filename entries correspond exactly to those files. No `planned` entry has a corresponding file, no orphan MP3, and no duplicate MP3 filename entry. File presence does **not** prove listen-verified speech.

**B-profile deduplication:** initial **202 entries / 42 unique texts**; revised **202 entries / 164 unique texts**. The 38 repeated texts remaining occur solely between the **recorded** `general_male_b` and `general_female_b` pools. There is no exact same-text pair among the 126 newly authored planned B entries. The earlier identical general lines are left untouched: no bulk re-record simply for mathematical uniqueness.

## Findings and editorial dispositions

| ID | Finding | Disposition |
|---|---|---|
| DLG-01 | Five B profiles spoke identically across 38 ordinary/social/combat/quest lines | Rewrite 126 `planned` entries in place without changing filenames, keywords, voice UUIDs or intended meanings |
| DLG-02 | Guard phrasing often treats every conversation as an inspection; one recorded combat line is swaggering | General guard B is firmer *only when appropriate*; recorded primary stays in a listening/re-record backlog; Mark gets separate authored lines |
| DLG-03 | Merchant wording presupposes customer, current goods, and prices | New merchant B combines personal interest with practical trade; recorded primary constrained/flagged |
| DLG-04 | Hunter/general warnings assert observed stalking, woods threats, “trouble lately” | Ten selected `planned` primary/age texts corrected; recorded context-dependent claims flagged |
| DLG-05 | Shepherd wolf line exists twice, including `shepard_` misspelling | Preserve both recorded filenames and mapping; future correction requires review, no silent rename |
| DLG-06 | Campfire road answers assert concrete rumours, dangers and witnesses without simulation provenance | Do **not** use blindly; await S4 knowledge/perception; propose replacement/eligibility in backlog |
| DLG-07 | `quest_offer`, `quest_accepted`, `quest_declined`, `quest_complete` risk being mistaken for generic ambient chatter | Keep semantic distinction; only real M7 incidents may admit these; `quest_complete` text never mints a reward |
| DLG-08 | Voice sex groups can accidentally become personality buckets | Treat sex in filenames as historical voice pools, not a speech-behaviour rule; Big Five, history and situation drive authored nuance |
| DLG-09 | Some first/second variants say virtually the same thing | Keep short shared civility where believable; differentiate stress, rhythm and perspective more than stock synonyms |
| DLG-10 | The primary/recorded bank has actual-generation discrepancies | `general_male_farewell_01.mp3` is a material `generation_input` vs caption mismatch; listen first. Minor punctuation differences in three other entries are not silently “fixed” |
| DLG-11 | No M4 actor-specific recorded voice assignment exists | Text pack uses already-adopted actor keys and six existing scene IDs; no runtime contract or claimed Fish identity |

**Intent discipline:** `refusal` is an NPC declining a player request; `quest_declined` is an NPC reacting to a declined offer. `guard_response` is for a real guard response, not a general warning. `livestock_danger` presupposes actually endangered livestock. `combat_start`, `danger_alert` and `call_for_help` are event/context responses, **not** background lines emitted from the profession name. A text such as “The flock is in danger” must not make sheep or wolves appear in gameplay.

**Recording discipline:** `in_repo` captures file presence, not quality, playable attribution or the transcript's accuracy. `generation_input` is immutable across this editorial pass. Old Fish expressive prompts can be emotive/unnatural even where the nominal caption looks reasonable; the backlog records likely replacement candidates without overwriting history.

## Canon and architecture recon

1. **Vision:** no LLM in the game; deterministic simulations and authored/catalogued dialogue. Knowledge is independent of world existence. The NPC is not omniscient.
2. **Present V3:** `src/game/data/npc/flavour.ts` is a profession *card line plus three barks*, not a runtime voice resolver; `src/game/data/npc/reserved.ts` stores Mark's/Kate's stable reserved identities and personality/quirks; `src/game/audio/voiceLimiter.ts` is an audio concurrency/cooldown utility, **not** an NPC-specific speech/text mapping. Primary voice files exist on disk, but current V3 does not have a proved M4 actor-key-specific spoken-dialogue route.
3. **Authored cast:** [D-NPC-23](../world/areas/home-population.md) has **17 residents / eight occupied households** and Mark `G01` (`mark_hornblower`) and Kate `G02` (`kate_hornblower`) together at the guard plot; these actor-key→NPC-ID rows are **planned M4 bindings**, not fully instantiated residents. Mark has a one-daytime-watch schedule, no phantom replacement night guard. Kate's independent stock/roads do not imply a currently functioning shop or delivery.
4. **Existing text owners:** `greetings.md` and `ordinary-interactions.md` are conditional candidate libraries; `saltmere-daily-conversations.md` provides exactly 17 authored exchange drafts with stable speaker and option IDs. These are not wired runtime conversations. We changed only the six G01/G02 **NPC** scene texts and their provenance; player options and IDs are intact. No generic flavour bark was duplicated as a second owned bank.
5. **Planning gates:** M4 production is still gated (G1/G2/G3/E-01 open as of PROGRESS). M7 quest and voice work, M8 ownership/trading, M9 knowledge/social propagation follow their own plans. Speech skill is design direction, not an already-live adaptive dialogue engine. Existing V1/V2 voice/campfire resolvers are reference/legacy until specifically ported.

## Missing dialogue coverage — context before volume

| Need | Current authored intent/text | Actual supplier status / safe next work |
|---|---|---|
| Greetings, farewells, ordinary conversation, speaker-specific temperament | Existing `greeting`/`farewell`, [greetings](../dialogue/greetings.md), 17 scenes and Hornblower pack | Text candidates available; **M4 actor/conversation admission and S4 relation owner pending**. Add variants only on real scene review |
| Tiredness, hunger, shelter and work completion | `exhausted`, `hungry`, `weather_shelter`, `work_finished`; `ordinary/activity` drafts | Calendar/weather and data models exist, but live NPC-specific need/action-to-speech scheduling is not proven. Use only when a credible observed actor state/action result exists |
| Weather remarks | `weather_shelter` and `ordinary/weather` | M2 weather exists; NPC perception/location and a safe shelter destination must be supplied, not guessed |
| Livestock danger, guards' aid, injury and combat reactions | `livestock_danger`, `guard_response`, `danger_alert`, `call_for_help`, `combat_start` | Real sheep/threat/witness/dispatch required; M4/G1 + M6/M7, later M5 health; no phantom animal or guard |
| Family, friendship, current acquaintances | Hornblower pack plus `greetings/personal_relation` | Q0 spouse facts exist as canon; actual opinion/encounter/knowledge state and eligibility belong to M4/S4/M9 |
| Quest offers/refusals/acceptance/completion | Existing four `quest_*` keywords and draft author content | M7 incident authority and reward/source verification required; no ambient “job” without real offer |
| Commerce, food gifts, shelter, repairs, medical assistance | Generic social replies; some future text in M4/S4 plans | Ownership, real stocks, permission, transfer and service ability required by M5/M8; no line grants an item |
| Reports, rumours, witnessed events and remembered deeds | `greetings/known_deed`, campfire POC, M3 rumour text | Requires speaker-known event/lead, confidence/precision and time/witness provenance; M3/S4/M7/M9—not a random fact inserted into a bark |

**Potential *new* authored categories, not accepted keywords:** apology after a witnessed offence (M9), spontaneous help offer for visibly distressed player (M4/M5, D-NPC-22), return greeting after a *verified* absence (M8 travel and remembered meeting), grief/aftermath (persistent death/incident source M5/M6/M9), true settlement concern/shortage (M8 ownership/economy). All require an existing authoritative state/event and a future integration decision. **No intent IDs, frequencies, selectors or trigger contracts are added here.** More `exhausted` or `weather_shelter` *wording* is not a new intent.

## Production order — Fish Audio (future Cursor lane only)

1. **Stop-and-reconcile gate (P0):** identify any MP3s Cursor already made since baseline, especially the old `guard_male_b` batch. This branch deliberately retains their baseline `planned` statuses; **do not generate those filenames twice**. Merge/rebase and reconcile exact audio transcriptions before moving statuses to `in_repo`. The last checked HEAD is not a permanent lock.
2. **Listening pilot:** sample 2–4 final texts per still-planned profile, including a quiet greeting, practical request and urgent response. Check accent, pronunciation, spoken length, emotion and whether the selected Fish voice is credible for SeedVale. A pilot must be marked against real files, not merely claimed as completed.
3. **`guard_male_b` (up to 40)** after Cursor collision check: broad needs/watch/danger coverage; **not Mark's personal voice by default**.
4. **`merchant_female_b` (38)** after pilot: warm dialogue plus principled trade; **not Kate's personal voice by default**.
5. **`hunter_male_b` (38)**: practical, understated outdoors persona; threat lines behind actual perception.
6. **`shepherd_male_b` (10)**: small controlled batch, test sheep-specific urgency separately from an ordinary greeting.
7. **Selected primary `planned` gaps (82 at baseline, 10 revised here)** only after contextual need is proved; do not automatically produce all 82. **The Hornblower 43-line pack is a later M4 actor-specific pilot**, not ready for current Fish recording without identity/voice attribution.

For each batch use the exact final catalog quote, preserve Fish `voice_id`, record exact `generation_input` (including deliberate expression tags if any), verify file and spoken content, and update real per-file status. Do not assume “completed in browser” equals saved MP3.

## Checks and critical self-review

- **Structural (catalog):** 393 distinct names; all 185 `in_repo` files present; all 208 `planned` absent from the baseline voice directory; no orphan MP3. Spoken-text change is exactly **126 B + 10 primary/age = 136**, all `planned`.
- **B diversity:** 164 distinct texts from 202; only deliberate recorded cross-general-voice duplicates remain. No new exact duplicate among the 126 planned B replacements.
- **Safety:** no `src/`, MP3, voice UUID, filename, intent or existing `generation_input` change. Audio listening, browser playback and runtime integration are **not verified** by this documentation task.
- **Character quality:** Mark's kindness comes from asking, listening and making careful suggestions; Kate's from lively curiosity and fair boundaries. Neither is relentlessly cheerful, professionally monomaniacal or spouse-obsessed.
- **Quality debt:** Some newly planned generic lines still presuppose the *meaning* of their intent (e.g. rain for `weather_shelter`, a real threat for `danger_alert`). That is appropriate only **after** their eventual eligibility is implemented and tested. Text presence is never proof that a supplier exists.
- **Do not expand by reflex:** people can share “thank you” and “take care”; narrative diversity is about believable selection, not maximum string entropy.

**Handoff verdict:** **Script-ready, after branch merge and actual Cursor-file reconciliation** for the four unrecorded B profiles; **not audio-verified nor playable in V3**. The 76 recorded general-B MP3s are safe to retain as files but need no change. Named Mark/Kate content is a *text-only* authored M4 pack pending integration, timbre choice and voice QA. No architectural change is accepted by publishing this audit.
