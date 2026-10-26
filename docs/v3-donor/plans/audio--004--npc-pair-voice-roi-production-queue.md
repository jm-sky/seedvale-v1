# NPC player and pair voice — shared ROI production queue

**Status:** `planned — GO WITH AMENDMENTS for preparation; production and activation gated`  
**Created at:** 2026-10-24  
**Created by:** ChatGPT Sol  
**Updated at:** 2026-10-24 (ChatGPT Sol; full script and production-order revision)  
**Domain:** audio, dialogue, NPC, authored content  
**Owner:** [audio--002](audio--002--npc-voice-and-social-dialogue.md)  
**Roadmap:** M4 conversation foundations; M7 pilot; M9 broader authored voice, without milestone promotion  
**Source recon:** `a1a44dce1ff3fa60e930fb763126034f1b933126` on `main`  
**Scope:** documentation, scripts and production planning. No MP3 generation, runtime/casting changes, QC approval or gate closure.

## 1. Decision and scope

Use **one queue for NPC–player and NPC–NPC recordings**. Start with exact, already-recorded Mark player lines; then record the other central actors' existing player conversations and a few short, complete exchanges that share their recordings. Do not buy coverage by recording every theoretical pair or a profession-wide bank. A greeting heard through deliberate player interaction is a stronger initial investment than an ambient scene behind a default-off feature, an audibility test and a short lease.

This ranking is an evidence-informed hypothesis, **not measured player traffic**. Mark, Kate and the Woodwards have strong canonical identities and narrative roles, but there are no actor-by-actor player-use/completed-listen counts. Kin-first pairing makes spouses plausible targets, not guaranteed encounters. Later queue promotion requires actual reached, audible and completed sessions. The existing three-line Mark runtime pilot remains exactly three lines; even another already-recorded Mark clip requires a separate reviewed expansion.

**Recommendation:** GO for script preparation and non-generating inventory/QC work; **GO WITH AMENDMENTS** for a staged production programme after each row's gates; **NO-GO for bulk generation, unapproved casting or runtime activation now**. This document does not authorize Fish purchases or the remaining Hornblower pack.

## 2. Reconciled current-main evidence

| Owner / evidence | Current finding | Production implication |
|---|---|---|
| [PROGRESS Now](../state/PROGRESS.md#now), [npcAi](../../src/game/config/npcAi.ts), [sceneSession](../../src/game/session/sceneSession.ts) | Live NPCs default on, 17 residents, real talk/session trade; SocialPairs still default off, DEV `?npcpairs=1` | Do not repeat older claims that all talk is detached. Text talk being live does not make voice live. |
| [ordinaryConversations](../../src/game/data/dialogue/ordinaryConversations.ts) | 17 scenes: 3 base NPC lines each plus 3 extra topics each = 102 authored NPC line entries, before dynamic activity/weather/trade and neutral fallback | The player surface is much larger than the old 51-line draft. Count exact effective text and real topic selection, not merely entries. `{name}` rows cannot use a generic MP3. |
| [SessionConversation](../../src/game/session/sessionConversation.ts), [conversation](../../src/game/sim/npc/conversation.ts) | One S4 token/lease; topic suppliers for public name/role, verified kin/parent and world-gate fact; live weather/activity context supplied by scene session | Reuse these owners; no second conversation/context/knowledge service. `gateFactBound` is currently false in the live bridge. |
| [voiceCasting](../../src/game/data/npc/voiceCasting.ts), [voice manifest](../../src/game/audio/npcVoiceManifest.ts) | Only G01 reserved Mark is cast; three exact files all `qcStatus: 'unverified'` | No other resident has a runtime voice assignment. Mark's approved timbre does not constitute file-level listening approval. |
| Git tree + [catalog](../dialogue/NPC-VOICE-CATALOG.md) | 317 MP3; 399 unique catalog filenames = 317 `in_repo` + 82 `planned`; no missing/orphan shipped filenames and no equal Git blobs | Inventory remains consistent with audio002's count, independently rechecked at this SHA. Neither file presence nor differing hashes proves good delivery or correct transcript. |
| [SocialPairs](../../src/game/sim/npc/socialPairs.ts), [npcLive](../../src/game/session/npcLive.ts) | Deterministic kin → distance → key admission; gathering requires same ID; no audio or social-need relief | Preserve pair selection, release/effect semantics and bounded spatial candidates. `seeker` is not a narrative speaker role. |
| [Clock](../../src/game/core/clock.ts), [time constants](../../src/game/config/time.ts) | `gameDt = realDt × scale`; `calendarDt = gameDt × 72` | Calendar speed is not the speech budget. See §6. |

### Measurements and what they do not establish

The [campfire/shelter evidence](implementation-notes/npc--campfire-soak-evidence-2026-10-24.md) contains the earlier proximity and later shelter probes; a separate true-state follow-up is also available:

- Earlier seed-1, 14.3-calendar-day soak: **94 proximity/goal proxy onsets** (0 at 1×, 12 at 4×, 82 at 40×), not actual completed pairs. Phases had unequal wall durations and calendar coverage; the result cannot rank rates across speeds or forecast audible conversations. Raw throwaway data are not committed; no independent reproduction is claimed here.
- A separate [true-pair-state soak](implementation-notes/npc--campfire-soak-true-pairs-2026-10-24.md) is stronger evidence than proximity: **8 distinct engaged pairs, 18 sampled onsets** (6 at 4×, 12 at 40×, none at 1×), peak 3, no sampled double membership. It still samples every ~5 real seconds: at 40× a whole 0.5-second gathering engagement may fall between samples. The 60-second 1× phase is far too short to infer zero demand. Only canonical seed 1 attached residents; attempted seed-2/3 routes did not. No audio, weather/shelter or complete actor-pair frequency table was measured, so this does not justify a per-couple production ranking.
- Later live shelter probe: 44 samples per weather, one clear and one forced-rain run, seed 1, evening 18:25–22:30, pairs DEV-enabled. Mean engaged pairs **0.73 clear / 0 rain**, peak 4 clear; socialise/play **6.36 / 0**; ring dwell **3.09 / 0**. These are occupancy samples, not unique pair starts, duration distributions, completions, listener coverage or voice plays. The ring location is approximate. Storm/snow were not sampled.
- The older [natural-pair test](implementation-notes/npc--n-pairs-natural-evidence-2026-10-23.md) explicitly marks its 23/17/17 engagements and 12/9/4 completions as **superseded** after D-ARCH-102 removed A-NAT visitor pairing. Exclude these figures from current throughput estimates.
- Fifteen adults permit 105 unordered combinations (36 male/male, 54 mixed, 15 female/female); all 17 residents permit 136. These numbers are a compatibility upper bound, **not demand or ROI**. Two children must never inherit adult clips. Adult voice identity is not selected by sex alone.

Thus rain-sensitive campfire throughput and accelerated time lower expected ambient return. No numeric listens-per-clip claim is supportable yet. A scripted, stationary listener at the green is also not an exploration-session exposure model.

## 3. Canon and script review

Read [reserved data](../../src/game/data/npc/reserved.ts), [households](../../src/game/data/npc/households.ts), [population](../world/areas/home-population.md), [Mark/Kate characterization](../dialogue/mark-hornblower-character-profile.md) and [Woodward profiles](../dialogue/woodward-character-profiles.md) together. Big Five order below is O/C/E/A/N; values are evidence, not new line-selection thresholds.

| Actor | Canon | Writing consequence |
|---|---|---|
| G01 Mark, 38, guard | .550/.723/.601/.620/.217; sociable; Steady-nerved/Thorough | Calm, observant, concise but interested in people. Dry warmth; never routine threats or a monosyllabic soldier. Day watch [06:00,18:00) is not overridden for a scene. |
| G02 Kate, 34, trader | .620/.600/.745/.706/.500; night_owl; Talkative/Warm | Curious questions, practical judgement and boundaries; social interest beyond sales. Not a money-grabbing punchline. |
| W01 Ann, 32, farmer | .420/.685/.600/.716/.620; fast_worker; Helpful/Orderly | Lively, organised and community-minded; worries and overcommitment are possible, not perpetual scolding. Approved editorial energy does not alter simulation traits. |
| W02 Peter, 36, woodcutter | .627/.672/.272/.576/.348; energetic; Close-mouthed/Diligent | Practical, household-first, asks about cost and time; affectionate and capable, not stupid, lazy or another Mark. Shares the farmer home with Ann. |

Other residents' Big Five come from [seeded generation](../../src/game/data/npc/generate.ts), not a fixed authored temperament per profession. Proposed scenes use their canonical roles/kin plus restrained conversational choices; they do not declare every smith gruff, every hunter suspicious or every farmer worried. Check the actual generated actor at casting/content review. Neutral exchanges may remain neutral; do not invent a personality bucket system. F01 co-residence with H01/H02 and T01 with L01/L02 is **not** marriage/parenthood. E01 is retired despite the technical `hunter` profession.

### Disposition of every old audio004 script

All six former sketches are withdrawn as production scripts. Their IDs are not runtime/catalog bindings; do not preserve them as aliases to different spoken words.

| Former scene / all turns reviewed | Finding | Replacement in the existing [daily dialogue document](../dialogue/saltmere-daily-conversations.md#shared-voice-scene-drafts-audio004) |
|---|---|---|
| `banter.mark.criminals.01`: “Hello, Hornblower!” / “Caught any criminals today?” / “Not yet. Fancy being the first?” | First two turns both belong to peer. Last line threatens an innocent neighbour and implies arrest/crime framing; wrong default Mark tone. | SV01 listening; SV02 optional couple warmth. |
| `banter.kate.fortune.01`: “Morning, Kate!” / “Made your fortune today?” / “Not quite. But I'm still willing to take yours.” | Broken alternation; morning gate omitted; a stock greedy-trader joke obscures Kate's fairness and interest in people. | SV03 useful cloth advice, SV04 neighbour care. |
| `banter.peter.trees.01`: “Hello, Peter!” / “Still chopping trees?” / “Only the ones that refuse to fall by themselves.” | Broken alternation; implies current work, then interchangeable lumberjack punchline. | SV05 household/community balance; SV07 concrete advice. |
| `banter.ann.farm.01`: “Morning, Ann!” / “How's life on the farm?” / “The crops don't complain. Can't say the same for Peter.” | Broken alternation and missing time gate; wife belittles husband, Ann reduced to farming. | SV05/SV06 equal, affectionate practical perspectives. |
| `banter.generic.work.01`: “Morning!” / “Long day ahead?” / “Long enough. But there's work to be done.” | Alternation can work, but time/work assumptions and no distinct relationship or useful payoff. | SV08 modest spouse rest scene, explicitly contextual. |
| `banter.generic.rest.01`: “Good evening.” / “Found yourself a quiet moment?” / “A rare one. Don't frighten it away.” | Best old premise, but evening/quiet not supplied and the question presumes a break; final line reads as a rehearsed quip. | SV09 company without conversational obligation; SV10 companionable silence. |

The old eight-scene generic pool was a quantity proposal, not eight fully authored scripts; it has no grandfathered production budget. New SV01–SV14 are explicitly assigned, alternating, complete two-turn exchanges; SV15 is a deferred four-turn example. No unassigned “peer opening” is a costed asset. Full English text, player reuse and gates live **once** in the existing dialogue document, not a second recording catalog.

### Existing player lines: freeze selectively, not blindly

Keep G01's exact three pilot lines and G02's three base lines. Woodward base greeting/advice/farewell remain useful first-contact coverage in each eventual approved individual voice; their new social scenes add domestic/community identity. No ordinaryConversations text changes occur in this session.

Do **not** immediately voice all EXTRAS. Mark's “Someone is always meant to be awake” must remain a norm, not proof of night staffing; Kate's kin response and village mending quip overemphasise work and need editorial review before spending. Ann's “Plants first, everything else after” oversimplifies her approved community role; Peter's kin reply is generic domestic division. B02's “My husband is out hunting” needs actual current activity or a later non-current rewrite; E01's past-versus-present quiet claim needs approved personal history. H02/B03's expansive wandering/chores claims need child-content review; Hazel's gate topic is currently supplier-blocked. `{name}` self introductions require the real resolved name and an actor-specific fixed text, not stitched audio. These are **generation exclusions**, not silent changes to existing runtime or catalog transcripts.

## 4. One inventory, reuse and casting policy

[NPC-VOICE-CATALOG](../dialogue/NPC-VOICE-CATALOG.md) remains the sole filename/transcript/Fish-input source; [production notes](../dialogue/voice-production-notes.md) own taste history, and [replacement backlog](../dialogue/recorded-lines-replacement-backlog.md) owns quarantine proposals. Do not create another clip registry. Scripts refer to stable line IDs; future approved production adds exact rows to the catalog and regenerates the existing manifest.

| Existing material | Use / restriction |
|---|---|
| Mark: six actor MP3; approved `Friendly Male Voice`, UUID `2adcdee4b3ce4b648dc16ea65430ea76` | P0 QC the three exact player lines. `npc_mark_hornblower_daily_01.mp3` is exact SV01 turn 2 (“You learn who's had a hard day if you bother to listen.”), staged for a separate expansion. Danger/thanks await genuine triggers; never filler. No Mark recast. |
| Kate/Ann/Peter | No dedicated catalog profile, approved actor UUID or runtime cast at recon. Existing merchant/general UUIDs are audition candidates only. Keep three independently approved actor identities; never silently make Kate `merchant_female`. |
| General female primary/B | Existing voices worth audition/QC before buying a new voice: primary `5e3be339f2df45e6a1a338bb2ce94800`; B `9a9cf47702da476aa4629e2506d4a857`. Shared scripts do not make B files exact for primary-source text. |
| General male primary | Candidate `c2a3921fd7024b9189cb912bdfe5266a`; no resident assignment yet. `general_male_farewell_01.mp3` is quarantined for transcript mismatch: prompt includes an extra supplies clause. Do not count it as safe “Take care out there.” reuse. |
| Existing merchant voices | Candidates `d4f161bee1934b47ad3090f05649270c` and `e3cd384158934cc9a01029cd7d278634`; role bank does not prove Kate identity/taste approval. |
| Male B / guard B | Negative taste notes: mechanical/narration-flat. Do not expand these 38/40-file banks or force their adoption to improve a spreadsheet ROI. |
| Hunter/shepherd banks | Role/sex/age and delivery need review. Molly is female; E01 is retired. Neither automatically inherits these voices. No automatic Mark→generic guard fallback. |

**Campfire POC: 12 files are not six ready scenes.** Cold/weather questions need actual temperature/wind/night; answers predict rain or wind turning without a verified forecast or authored knowledge. Work question “You look exhausted” needs visible fatigue; its answer claims all-day work. “Since sunrise…finally sit down” needs activity history and actual sitting, which a stand/dwell goal does not prove. Road question 1 asserts increased traveller traffic; both road answers assert observations, wolves or rumours. Quarantine those complete pairs until truthful owners exist. “Long day?” and “Anything interesting happen outside the settlement?” may be usable questions after cast/QC review, but do not make their paired answers valid. The shared general/campfire UUID aliases must be explicitly reviewed; never extend alias equivalence to a different voice. Budget **zero ready complete POC scenes**, not 12 free clips.

Reuse unit = **same approved speaker/profile + identical spoken text + compatible delivery + verified file/version**. Same words spoken by different voices cost another recording. A shared UUID alone does not verify delivery or transcript. The same file may serve multiple authorized line IDs only through an explicit reviewed exact-text binding under audio002. It does not grant another actor that voice. Existing player menu text is not an NPC recording: if Ann speaks a player question in SV03, that is one new Ann clip.

## 5. Shared production queue and budgets

Budgets below count **unique accepted new utterances**, not Fish attempts. Reuse counts are file uses avoided in a later scene; they are not additional assets. Player options stay unvoiced. **Q-002 remains open** for Fish commercial/release rights, spend budget and wider shared-versus-individual casting policy; the existing Mark taste decision does not close it. No price in currency is asserted: use actual Fish account/model charges at the authorized production session. Track characters and generated audio seconds, all retakes, listening/edit time and cost per accepted asset; do not hide casting expense in “free reuse”. Allow a planning reserve of ~25–50% additional production takes, not permission to spend it automatically.

| Order | Script preparation / frozen targets | Casting and generating | New accepted clips; reuse | QC and runtime dependency / expected return |
|---|---|---|---|---|
| **P0 — existing Mark first** | Reconcile tree/catalog, exact transcript and duration for `mark.greeting`, `mark.road.reply`, `mark.leave.reply`; inspect staged daily separately | No new casting or generation | **0 new; 3 existing player clips**, staged daily is a fourth distinct file | Listen each full file, record digest/duration/text/taste. A0/A2/A3 and S4 acceptance still apply. Highest marginal return: 3 targeted player lines for zero new clips, but current realized voice return is zero until activation. |
| **P1 — Kate + listening exchange** | G02 `kate.greeting`, `kate.work.reply`, `kate.leave.reply`; SV01 opener by G02 | Kate actor casting explicitly approved first; batch her four exact lines together | **4 new** (3 player + SV01 opener), **1 existing Mark reuse** | 3 current player bindings + one 2-turn scene after separate social-audio expansion. Nominal 5 line placements / 4 new clips; ambient return gated. Do not expand Mark pilot incidentally. |
| **P2 — Ann, then Peter; practical couple** | W01 and W02 existing greeting/advice/farewell (6); SV05 and SV06 (4); SV03 Ann question (1) and SV04 Kate question (1) | Ann then Peter after separate casting approvals; Kate uses P1 identity | **12 new**; **2 cross-context reuses**: Kate advice from P1 in SV03; Ann reply from SV06 in SV04 | Adds 6 current player lines and 4 complete pair scenes (8 placements), 14 / 12 nominal. W01 first gets player value while W02 approval is pending. Do not substitute generic-bank voices between the two. |
| **P3 — small wider-cast reuse trial** | Provisional H01 Dora and L02 Mabel, each greeting + advice + farewell; SV07 S01 question | Audit/approve stable H01/L02/S01 assignments from existing voices before recording; voices can be shared only through explicit accepted casting, with indistinguishable simultaneous speakers avoided | **3–7 new**: 2 advice clips + 1 S01 question, plus 0–4 greetings/farewells if exact compatible files unavailable. **0–4 old-file reuses**, plus Peter advice from P2 for SV07 | Six player placements + two pair placements; marginal 8 / 3–7 is only a candidate. Promote whichever actor real manual-use evidence favours; do not cast S01 solely to unlock one line. If no worthwhile S01 player/cast case, defer SV07 and subtract 1 new/2 placements. |
| **P4 — variety after measured demand** | SV02, SV08–SV12: six optional complete 2-turn scenes (12 slots); optionally SV01 Mark reply as a future player listening topic | At most **two scenes / 4 accepted clips per batch**, only where both actors already approved or justified by player coverage | **0–12 new**, up to 1 existing daily clip reused for the proposed player topic; no automatic expansion | Addresses actor/scene repetition, not theoretical pairs. A fixed cap is safer than 24 clips per “generic configuration”. New player topics require ordinary/S4 content review. SV12 elder advice exists as runtime text, not a proven MP3. |
| **P5 — later providers / children / long scenes** | SV13–SV15; weather/activity/needs variants; real quest/economy/knowledge episodes | No bulk order; freeze only against real suppliers and reviewed delivery window | **0 committed budget** | Children need age-appropriate casting. Events need knowledge/disclosure. Long scenes need playback feasibility evidence, not longer SocialPairs leases. |

**Core P1+P2 ceiling: 16 accepted new clips**, 9 new current-player line bindings, five complete 2-turn scenes (10 placements); **19 placements / 16 new assets ≈1.19**. Two of those social placements reuse new player/pair assets, and one uses the existing Mark daily recording. This is a *content reuse ratio*, not 1.19 listens per clip, a completion forecast or money ROI. With P0, 12 current-player line bindings are prepared; four distinct existing Mark files are relevant across P0–P2. No new runtime binding is applied here.

P0–P3 provisionally totals **19–23 accepted new assets**, or 18–22 without the conditional S01 opener. At most P4 adds 12; stop well before that if measurements show poor reach or repetition is already controlled by silence.

**Casting budget, separately:** for each unapproved central actor, audition two shortlisted timbres with the same two short exact lines (one base player line and one scene line): **4 candidate takes per actor, 12 total for Kate/Ann/Peter**. No Fish voice-training assumption. Only the two selected takes per actor can possibly count toward the 16 accepted production assets, after identical-input/file QC; rejected candidates and re-records never count as coverage. Conservatively budget all 12 audition takes separately until accepted overlap is proven. Audit existing samples first; cap one audition round, then resolve taste before further spend. P3 new actor auditions are conditional and separately costed, not included in 19–23.

### Stage handoff (applies to every row)

1. **Prepare:** freeze exact English, actor IDs, pair order, player line mapping, truth gates, pronunciation and provisional spoken duration. A script may be ready while casting/activation is blocked.
2. **Cast:** record explicit author approval against UUID and actor; preserve already approved identities. No approval inferred from catalog presence or this review.
3. **Generate:** only the authorized tranche, existing Fish browser workflow, exact catalog inputs; no runtime TTS. Approved samples may be promoted without regeneration after QC; never count a rejected audition as reuse.
4. **QC:** listen end-to-end; compare actual words, clauses, names, accent, pacing, volume, noise and naturalness; audition consecutive turns together. Capture actual duration and digest, retake cost and rejection reason in existing catalog/production notes. Text tags are metadata, not captions. A mismatched take fails exact-line binding.
5. **Activate:** separately reviewed audio002 manifest/casting/session integration. Player tranche first; pair tranche waits for N-PAIRS plus timing proof and its own audio acceptance. Missing/QC-failed resources yield text-only player talk or silent social activity.

## 6. Playback proposal: small, reversible and simulation-neutral

This is an amendment proposal for the audio002 owner, **not implemented code or a closed architecture gate**.

`npcLive.pairPhase` admits gathering engagement with `max(1, min(20, shorterDwellCalendarSeconds / 72))`, then steps the pair; the actual remaining lease can already be lower at publication. Non-gathering social acts use 60 game seconds. Never use the original configured 20 as the remaining time, confuse it with the approach lease, or rely on the minimum floor to claim a whole second of real dwell.

| Scale | Maximum real window from 20 game seconds | Initial ambient speech policy |
|---|---:|---|
| 1× | 20 s, often less after elapsed time/remaining dwell | Consider a complete decoded two-turn scene only when it fits. |
| 4× | 5 s | Suppress ambient pair speech. |
| 40× | 0.5 s | Suppress ambient pair speech. |

Initial admission at exactly 1× is intentionally conservative: speech never slows the clock, freezes NPCs, extends/renews a lease, changes pair candidates or affects social completion. A 15–30-word exchange is roughly 6–15 real seconds at ordinary delivery; these are writing estimates, **not media duration evidence**. Measure full decoded files before admission. Four-turn SV15 is deferred even if a fast reading could fit once.

Within existing SessionAudio, at a committed engaged-pair boundary:

- Read the actual remaining pair/dwell allowance from the existing owner through a minimal read-only adapter, if needed; current `pairOf`/`pairSnapshot` debug output does not supply a voice timing API. No polling scan or new social scheduler. Missing reliable remaining time → skip.
- Admit only with both exact, listen-verified, fully decoded clips, unlocked audio, two compatible actual casts, truthful context, listener in the existing spatial audio domain and foreground capacity. Compare `sum(full clip durations) + authored gap + safety margin` against remaining game/dwell seconds divided by scale. Proposed gap 0.25 s and margin 1 s are reversible calibration values, to be measured/reviewed, not accepted simulation constants.
- Reserve one foreground speech sequence through the **existing** limiter/owner, preserving urgent priority and manual-talk precedence. No delayed queue of old pairs. If another sound/voice prevents complete admission, stay silent; decode completion must not resurrect an expired opportunity.
- Bind transient playback to session generation, pair token, actual ordered actors and utterance index; revalidate before each turn. Full MP3 at normal speed, no clipping/excerpts or time-stretch to force a fit. An initially admitted scene can still be interrupted: pair closure, manual talk, danger, range/space loss, explicit/hidden pause, scale change away from 1×, replacement/load, disable or disposal **stop/cancel promptly**, including an in-progress clip when required. Full-duration admission is not permission to ignore invalidation. Never wait for a finished sentence before releasing the simulation.
- No terminal pair grace period, audio-only extra conversation or replay after return to 1×. Audio002's narrow immediate, decoded **player Leave** permit remains the only stated exception and must not be generalized to pairs. Player voice uses its own committed view/token validity, exact effective text and S4 lease; fast time is not permission to prolong it either.
- Optional scene choice uses stable actor/scene order or the existing seeded presentation path, never simulation RNG, `Math.random`, frame order or decode race. Proposed bounded presentation-only recent-use ring: last 2 scene IDs per actor and last 4 completed scene IDs session-wide; if all eligible scenes are recent, choose silence. Record interrupted attempts too for immediate-repeat suppression. Clear on session replacement/load; no Save field and no claim of cross-load audio replay identity. Sim outputs must match with audio on/off and across frame partitions.

Longer scenes remain **NO-GO for mass recording** until actual 1× admission/completion data justify them. Broad context-free snippets are not a remedy: the reply must answer the preceding question, and an incomplete authored exchange must not be counted as successful coverage.

## 7. Context hierarchy and existing suppliers

| Tier | Source to reuse | Admission boundary / exclusions |
|---|---|---|
| **1 — timeless** | `ordinaryConversations`, `ConversationContext` supplier checks, canonical reserved definitions and `KIN_EDGES` | Stable values/opinions/advice and exact canonical relations. A spouse edge does not establish positive attitude, a recent encounter or shared private knowledge. Intimate/teasing scenes remain deferred if their required relationship context cannot be supported. Other residents get courteous neutral scenes, not invented friendship. |
| **2 — contextual** | `sceneSession` atmosphere → `ctx.weather`; `activityLabels.activityPhrase` from actual goal/workTask; existing clock/calendar; `NpcLife`/Vitals and shelter predicate; actual spots/gathering ID and spatial domain | Weather and activity already reach player talk; time/place/needs exist in owners but not all are dialogue suppliers. Adapt those existing ports narrowly, never infer a new fact from a bark. A rain kind is not a forecast; work goal is not all-day history; vigor is not proof of an injury; a fire ID is not sitting/warmth; a home slot is not current indoor shelter. |
| **3 — event/knowledge** | Existing accepted S4 owned knowledge/directional relationship contract and future real quest, perception, economy/transaction and memory producers | Deferred when the owning producer/disclosure path is missing. Live ordinary conversation has no general incident-memory/rumour propagation supplier; SessionConversation currently supplies `danger: false`, so it is not proof of an integrated threat/perception producer. No new knowledge store; no fake crime, wolf, shortage, sale, damaged fence/cart or promised supper to justify audio. Canonical quest design is not an active incident. |

Existing `weatherRemarks` are text, not a prepaid bank. Review wording before recording: rain's “Wet again” adds history and a soil inference; snow's falling claim needs precipitation; clear's “day” needs the actual time. Existing dynamic `*.doing.reply` and `*.weather.reply` IDs can yield different effective text, so binding on ID alone is unsafe. A newly worded voice candidate cannot play under the old text until the text owner is deliberately updated and reviewed. Weather/shelter removes campfire opportunities during bad weather; do not schedule a rain campfire batch on theoretical context coverage.

## 8. Verification and next production gate

Documentation verification: all former samples disposed; SV01–SV15 speaker alternation and canonical IDs checked; reuse inputs checked against current ordinary text/catalog; filenames and inventory reconciled; relative links and `pnpm docs:check` required. No listening, Fish generation or runtime smoke is performed by this documentation revision. Its GO WITH AMENDMENTS is editorial/planning, not an independent HIGH gate.

**Documentation verification result (2026-10-24):** 15 proposed scenes / 32 ordered turns checked for unique turn IDs, canonical cast membership and strict alternation; core reuse and budgets reconciled against the current player text/catalog. `pnpm docs:check` passed all three underlying checks: 617 imported documents, 61 quests, item balance report current (311 legacy/imported broken links tolerated by the existing checker). Execution used connector-fetched, Git-blob-verified text files and an external read-only pinned-Git-tree existence adapter for unmaterialized linked assets/source paths; file reads and generator inputs used real fetched contents, not stubs. A plain partial-checkout run cannot validate absent local assets; no full binary checkout or runtime test is claimed. Two inherited documentation defects were repaired: stale Q0 line counts in the generated inventory and an unavailable legacy grass-report hyperlink, retained as a historical citation. Repository checker code was unchanged.

Before P1 generation: Q-002 rights/spend confirmation, P0 file QC and duration evidence; explicit Kate cast/batch approval; exact script adoption into the existing catalog; keep P1's social part staged if pair timing is not demonstrated. Before P2: independent Ann/Peter cast approvals and per-tranche budget. Before pair activation: N-PAIRS, retained SC/S4 and audio002 A0/A2/A3 acceptance plus read-only timing/cancellation proof. Audio completion must not award or renew any simulation effect.

Measure before P3/P4 expansion using the same supported canonical seed and scenario definitions, separate 1×/4×/40× and clear/rain trials, plus a walking/exploring player route. Additional seeds require a verified resident-attachment route first; do not repeat the known disabled-route experiment as evidence. Record **actual** pair starts/ends, identities, remaining time, listener-qualified candidates, cast/QC/length/cooldown/concurrency refusals, starts, complete exchanges, interrupted clips and repeated scenes. Also record manual talk starts and committed line selections by actor, completed player listens, repeats and refusal reasons. Normalize by **wall-clock player session time** and report sample counts and uncertainty; never divide by calendar days alone.

Use two complementary measures: (a) unique meaningful line/scene coverage per new accepted clip, (b) measured complete audible interactions per total generation+QC cost. Report marginal gain against the same fixture/baseline, include zero-exposure assets and failed attempts. Prefer characterful, frequently heard lines; cap per-actor repetition with silence before expanding banks. If social completion is poor, stop social production and retain the player-first tranche. No numeric throughput threshold is declared accepted without baseline data.

Remaining decisions: Q-002 rights/budget and casting-policy scope; author voice taste for three central actors; exact alias/cast choices for wider residents; file-level QC and measured duration; approval/adoption of new scripts; named runtime gates and timing adapter. Existing world/event supplier gaps stay deferred rather than being turned into new work for M4.

## 9. Related owners

- [Dialogue scripts and cross-context reuse](../dialogue/saltmere-daily-conversations.md#shared-voice-scene-drafts-audio004)
- [Audio002 exact text, casting, lifecycle and gates](audio--002--npc-voice-and-social-dialogue.md)
- [Catalog](../dialogue/NPC-VOICE-CATALOG.md), [taste/QC notes](../dialogue/voice-production-notes.md), [replacement backlog](../dialogue/recorded-lines-replacement-backlog.md)
- [Campfire admission review231](../reviews/2026-10-24--231--campfire-pair-admission-review.md), [current status](../state/PROGRESS.md#now)
