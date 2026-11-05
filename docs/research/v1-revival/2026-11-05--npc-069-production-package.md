# npc-069 — Final production package, audit and integration/QC handoff

**Date:** 2026-11-05  
**Status:** Editorial handoff complete; generation, listening QC and runtime integration not performed.  
**Source snapshot:** `b9b936b03b74ddff04b9e64a3483e286d1ea2402` on V1 main. Source blob pins are in the manifest.  
**New spoken-copy author:** GPT-6 Astra, N69-001–N69-037. Historical source wording is preserved.

[Parent npc-069](../../plans/npc-069-next-fish-audio-production-batch.md) · [Original writing handoff](./2026-11-05--npc-069-astra-missing-voice-texts-handoff.md) · [Recording script](./2026-11-05--npc-069-recording-script.md) · [Production manifest](./2026-11-05--npc-069-production-manifest.json) · [Coverage matrix](./2026-11-05--npc-069-coverage.md)

## Frozen counts and production selection

**72 new recording jobs, not 115 new recordings.** Exactly 37 lines needed new wording. This package is the single deduplicated npc-069 selection; historical NV drafts, Q90 references and the regeneration backlog do not create parallel orders.

| Measure | Count | Interpretation |
| --- | ---: | --- |
| Named targets | 110 | 22 per NPC; exact 3 greetings, 2 each of 8 other non-quest situations, 1 each of 3 generic quest cues |
| Exact quest offers | 5 | QV-001–005, unchanged, outside randomized banks |
| Total base coverage slots | 115 | Includes conditional reuse and binding-held slots |
| Selected existing NV drafts | 29 | 28 orderable; Molly NV-096 binding-held |
| Selected existing named audio | 35 | 33 active QC-pending candidates; 2 Molly quest candidates binding-held |
| Named Q90 references | 9 | 8 Kasia, 1 Molly; already ordered elsewhere |
| Missing-only new copy | 37 | Astra: Marek 10, Kasia 9, Anna 2, Piotr 10, Molly 6 |
| New recording jobs | 72 | 28 NV + 37 N69 + 5 QV + 2 generic female restorations |
| All Q90 references in this manifest | 12 | 9 named + 3 generic male restorations; zero duplicate orders |
| Held named slots | 3 | Molly accepted / declined / complete |
| Held restoration tasks | 5 | 3 Casual farmer requests + 2 campfire weather pair members |
| Optional restoration tasks | 7 | Explicitly deferred, no generation |
| New optional weather orders | 0 | Existing Q90-076/079 remain unchanged outside this selection |
| Audio passed by this work | 0 | No listening, ASR run, generation, runtime or visual verification |

The 110-slot arithmetic is **29 NV drafts + 35 existing files + 9 Q90 orders + 37 new texts**. The three named holds overlap those source categories (one NV draft, two existing files); do not add them again. Manifest status totals are mutually exclusive: 72 ready-to-order, 33 reuse-QC-pending, 12 Q90-already-ordered, 3 binding-held, 5 restoration-held, 7 deferred-optional = 132 unique production/control records. The 115 coverage rows refer only to named slots and QV; restoration control rows are separate.

## Audit performed before writing

Read all 126 NV rows (89 drafts, 27 reuse placements/25 files, 10 Q90 aliases), all 87 Q90 orders and their reuse candidates, all 14 regeneration tasks, the canonical catalog, historical 317-row QC ledger, content-bound author decisions and migration inventory. Reviewed all 99 Mark / Expressive Female / Laura / Hannah bank rows for this scope, plus generic female restoration alternatives and both retained male weather partners. The manifest contains row-level dispositions for every NV and Q90 row, and the 99 candidate bank rows. Historical ledger availability flags and symbolic UUIDs are not current storage or identity proof.

Current retained paths were reconciled to the migration inventory and content-bound SHA256/Git blob evidence. All selected existing files have matching retained canonical paths in that inventory. The catalog resolves Laura's historical symbolic `merchant_female_b` to intended UUID `e3cd384158934cc9a01029cd7d278634`; it does not prove the recorded speaker. Casting is approved, but **all existing audio remains QC-pending**.

### Decisions that prevent duplicate or unsafe orders

| Source / conflict | Final decision |
| --- | --- |
| Marek NV-001 daytime greeting | Retain existing file, do not commission or count it in the three universal slots. NV-018 + N69-001/002 cover day and night. No fourth active greeting selected. A later substitution must preserve exactly three eligible slots. |
| Anna Laura donor greetings | Select neutral greeting 02 + NV-044 + N69-020. Day-only greeting 01 stays unselected; no new order for it. |
| Kasia greeting 02/03 | Customer/trade invitation is not universal conversation. Retain outside baseline; greeting 03 also lacks the current greeting subtitle entry despite ledger text. |
| Q90-068/072/074 (and other relation/archetype greetings) | Preserve existing Q90 orders and binding predicates; do not count them as unconditional variants. No rewritten/recommissioned equivalent of a qualified Q90 order. |
| Kasia second farewell | Q90-053, already ordered; no new copy. Existing farewell 02 promises location/supplies and is unsuitable as universal goodbye. |
| Kasia generic acceptance | Use existing `merchant_female_quest_accepted_02.mp3` pending explicit ASR/source/listening QC. Catalog “I knew you looked dependable” vs ASR “I know you look dependable” is unresolved, not silently corrected. NV-025/acceptance 01 requires return to giver and is not the generic slot. Do not generate a duplicate while this candidate is pending. |
| Anna same-speaker assets | 15 existing Laura candidates fill slots, including two attention/hunger/danger/combat variants. No automatic pass from the intended UUID. Compatible NV drafts remain fallback only where reuse fills the exact target. |
| Anna work_finished donor 01/02 | “Enough for today” / “The rest can wait” exceeds one-action-completed semantics. NV-059 + N69-021 selected. |
| Molly attention 01 | Select as second attention candidate, QC-pending. “over here” vs ASR “overhear” requires listening; mismatch alone is not grounds for a duplicate new order. |
| Molly existing exhaustion 02 and hunger 02 | Leg-specific fatigue and empty-stomach/work claims are not guaranteed; N69-034 and N69-033 fill only those missing general slots. |
| Molly weather / combat / work donor claims | Worsening-weather forecasts, “Draw!”, theatrical challenges and end-of-shift/tools-away text do not fit the shared triggers. Neutral NV + N69 and Q90-055 are selected. |
| Marek NV-003 / Molly NV-088 thanks | Outcome-safe existing gratitude can acknowledge actual quest completion. Preserve original historical intent; manifest explicitly maps to `quest_complete`. Do not invent a separate thanks producer. NV-008 / NV-097 are conditional failed-QC fallbacks, not simultaneous jobs. Molly remains binding-held. |
| NV-038 / NV-023; NV-101 / NV-087 | Same recording, one production identity. No extra trade-close/livestock order or extra coverage slot. |
| NV-027–033 / NV-093 | Alias existing Q90 IDs. Q90 owns the order and exact bytes; no new named filename or regeneration. |
| NV-094/095 and weather-specific drafts | No supplemental weather recording selected. Q90-076/079 remain separately ordered with snow/storm predicates; neither replaces a neutral slot. |
| NV-126 water offer | Historical current-mechanics draft retained. QV-004 is the selected agreed future-direction offer; do not record both. |
| Piers NV-102–120 and other named casts | Outside five-NPC batch. Piers lacks a runtime characterKey; no invented binding or sixth pack. |
| Wrong-speaker fallback | No Guard-to-Marek, Warm-to-Anna/Molly, Laura-to-Kasia, FairyTail-to-Piotr or Casual-to-generic substitution. No excluded British-female or Brian UUID in executable jobs. |

**Conditional fallback protocol:** resolve each existing candidate's exact source, actual words and context first. If it passes, reuse it. If it fails, record the failure and replace that one coverage row with one same-UUID take; never leave both as active orders. Use a compatible unselected historical NV draft first; otherwise use the selected candidate's reviewed canonical wording under the correct UUID. Do not treat an ASR hypothesis as canonical. The manifest records per-candidate fallback instructions and the explicit NV-008/NV-097 alternatives. Count any replacement only when the failure makes it necessary.

Editorial review retained NV-005 as a terse question to an approaching player: proximity admission must be real, and it must not be used as a reply to an unasked scripted question. Molly NV-086 expresses hunger as a subjective need, not a new simulation prerequisite or forced inability to move; no logic may be inferred from its wording. Both remain subject to contextual delivery QC. No historical text was rewritten on stylistic grounds.

## Restoration decisions — all fourteen original identities preserved

No original deletion, identity, ASR, hash or intended-replacement UUID is rewritten. All rejected original bytes remain excluded. New female replacements use distinct `n69_restore_` filenames to avoid confusing rejected hashes with fresh recordings.

| Original filename | Decision | Intended replacement / resolution |
| --- | --- | --- |
| `campfire_female_weather_answer_02.mp3` | hold | Warm Conversational; complete pair held with `campfire_male_weather_question_02.mp3`. |
| `campfire_female_weather_question_01.mp3` | hold | Warm Conversational; complete pair held with `campfire_male_weather_answer_01.mp3`. |
| `general_female_agree_01.mp3` | deferred-optional | Deferred; original intended UUID `5e3be339f2df45e6a1a338bb2ce94800` unchanged. |
| `general_female_farewell_01.mp3` | replace | Warm Conversational `5e3be339f2df45e6a1a338bb2ce94800`; preserved text, separate new file, QC before admission. |
| `general_female_greeting_01.mp3` | replace | Warm Conversational `5e3be339f2df45e6a1a338bb2ce94800`; preserved text, separate new file, QC before admission. |
| `general_female_quest_complete_01.mp3` | deferred-optional | Deferred; original intended UUID `5e3be339f2df45e6a1a338bb2ce94800` unchanged. |
| `general_female_quest_declined_01.mp3` | deferred-optional | Deferred; original intended UUID `5e3be339f2df45e6a1a338bb2ce94800` unchanged. |
| `general_female_thanks_01.mp3` | deferred-optional | Deferred; original intended UUID `5e3be339f2df45e6a1a338bb2ce94800` unchanged. |
| `general_male_danger_alert_01.mp3` | hold | Original Casual farmer UUID `c2a3921fd7024b9189cb912bdfe5266a` held; generic gap references Q90-010 / FairyTail 1. |
| `general_male_farewell_01.mp3` | hold | Original Casual farmer UUID `c2a3921fd7024b9189cb912bdfe5266a` held; generic gap references Q90-003 / FairyTail 1. |
| `general_male_greeting_01.mp3` | hold | Original Casual farmer UUID `c2a3921fd7024b9189cb912bdfe5266a` held; generic gap references Q90-001 / FairyTail 1. |
| `general_male_old_greeting_01.mp3` | deferred-optional | Deferred; original intended UUID `372ef39bf5bf4fd38c5c56bce607aba6` unchanged. |
| `general_male_young_farewell_01.mp3` | deferred-optional | Deferred; age/role and replacement UUID unresolved, not inferred as Little Lem or adult. |
| `general_male_young_greeting_01.mp3` | deferred-optional | Deferred; age/role and replacement UUID unresolved, not inferred as Little Lem or adult. |

### Generic male ownership

The three removed `general_male_*` files retain **Casual Male Speaker** farmer provenance (`c2a3921fd7024b9189cb912bdfe5266a`). Their generic middle-aged male semantic gaps are already covered by **FairyTail 1** Q90-001, Q90-003 and Q90-010 (`689b47ca83dd48dba90b160affb8a118`). Reference those orders once; do not edit the backlog UUID, re-label old Casual audio or order three more FairyTail takes. The three Casual replacements remain held as farmer-specific scope, with no current order. Their runtime integration requires the separate stable-speaker resolver, not a blanket general fallback.

### Exact campfire partners and reasons for holding

| Female member | Retained opposite-gender partner | Editorial/context blocker |
| --- | --- | --- |
| `campfire_female_weather_question_01.mp3`: catalog “Cold tonight, isn't it?”; historical ASR “Long day” | `campfire_male_weather_answer_01.mp3`: “Yeah. Feels like rain by morning.” | Original female transcript is discrepant. Cold + night and the male weather expectation require truthful eligibility; no unconditional weather topic. |
| `campfire_female_weather_answer_02.mp3`: “Maybe. It usually turns before dawn.” | `campfire_male_weather_question_02.mp3`: “Think this wind will last?” | Wind and pre-dawn/local-weather-pattern claim require evidence and eligibility not provided by the current gender-only pair resolver. |

The male partners are retained, not QC-passed. Their intended historical source is Casual Male Speaker, now eligible for male farmers only if actual identity is confirmed; neither is automatically a FairyTail generic male. Restore only the original complete compatible Q/A pair, never cross-pair work/road lines, never create a third replacement or a new simulation trigger here. Both female rows have **null generation_input** in this package; their historical proposed text is retained solely for review. No new campfire wording is commissioned until the partner/context contract is resolved.

The brief mentions four historical discrepancies, but the current backlog actually has **five** `transcriptReviewRequired=true` rows. All five are accounted for: female weather question (cold vs “Long day”), male greeting (catalog greeting vs “Good day, how are you doing today?”), male danger (catalog warning vs “ALERT! EVERYONE, WATCH OUT!”), optional old-male greeting (catalog travel question vs “Ah, there you are. Come, speak your mind.”), and optional young-male greeting (ordinary greeting vs “Hi! Want to play?”). Only the first three are runtime-critical. Both age-related rows remain deferred; the young row retains its unresolved casting. These are historical ASR hypotheses, not text corrections or accepted identities.

## Five quest offers and paired display proposals

The manifest's `canonical_transcript`, `generation_input` and `display_line_proposal` reproduce each original QV English line byte-for-byte. **No revision record is needed beyond “none; source bytes preserved”.** The proposals replace only the corresponding normal Polish `offerLine` when the separate implementation is ready, not the whole dialogue system.

| QV | Verified current behavior | Integration contract |
| --- | --- | --- |
| QV-001 / lis-przy-osadzie | Marek; kill_target_animal kind fox | Normal actual available fox offer; no extra species or reward promise. |
| QV-002 / stare-ruiny | Piotr; buildLandmarkQuests creates it only when resolve('smallRuins') succeeds | Resolved nearby landmark and actual offer; no fixed direction, no voice when quest omitted. |
| QV-003 / shells-dla-kasi | Kasia; gather_item shell count 3 | Preserve decorative intention. No automatic doorstep decoration or fixed coast assumption; separate future three-variety policy if implemented. |
| QV-004 / woda-dla-marka | Current objective interact_well; no actual filled-water handover requirement | **Gameplay-held:** agreed carried-water return/handover and guard-duty availability must land first. Container choice stays with quest/item owners. |
| QV-005 / kamienie-dla-piotra | Piotr; gather_item stone count 6; distinct alreadyRepairedOfferLine exists | Normal foundation-needed offer only; fence-story sequel trigger remains separately owned/unselected where unresolved. Never substitute for already-repaired acknowledgement or claim fence repair occurred. |

Read the five complete English display proposals in the recording script or manifest; they are the exact spoken input, not summaries. Current Polish offer text is evidenced by the pinned `src/quests/quests.ts`. No live offer text changed in this commit.

## Integration handoff — existing owners only

| Owner / verified seam | Required follow-up, outside this documentation commit |
| --- | --- |
| npc-065 / Q88, src/ai/npcVoiceLines.ts | Stable approved speaker by characterKey/NpcId. Current resolver still uses role/gender/age→general fallback and ignores the speaker constraint. Admit only QC-passed clips, never mixed speakers or an unassigned age/role cast. |
| NpcAgent.playReactionSound / npcDialogueGreeting.ts | Filter genuine event, time/context and speaker before choice. Current opening subtitle table is Polish and filename-bound; unfamiliar clips fall back text-only. Pair selected clip with faithful displayed text. Keep ordinary three-variant pools universal; do not silently add qualified Q90 greetings. |
| NpcAgent.requestBark / npcBarkRequest.ts | Preserve need-transition, stamina, shelter-entry, new-threat, actual beginCombat and terminal classified-work boundaries. Work is one finished action. Combat may remain silent when NPC flees instead of starting combat. Livestock-danger alias stays within speaker. |
| store.ts closeNpcDialogueMenu / acceptNpcDialogueOffer | Farewell only ordinary close; pending offer close is decline; transition into trade suppresses both. Accepted cue follows actual acceptance, never speculative availability. Current onAccept has no returned success contract: preserve truthful callback handling in later integration. |
| QuestManager.playQuestCompleteSound / lifecycleHooks.playQuestVoice | Current callback carries only giverNpcId + intent; keep generic completion working. Exact QV needs questId + actual displayed offer moment + explicit normal variant + matching giver/text. Do not play it on completion, reminder, declined or already-repaired surfaces. |
| campfireTalk.ts / existing social owner | Current selection is gender-only. Held pair restoration needs exact two-speaker identity, truthful predicates, measured answer delay, cancellation and interruption; no new social producer in this package. |
| npc-065/Q89/Q40 asset QC/admission | Retained assets already have canonical public storage, but storage is not runtime registration. New MP3s require source records, hashes, transcript/listening checks and explicit admission through existing workflow. |

**Randomisation:** event/context eligibility → fixed same-speaker identity → eligible variant → avoid immediate repetition when another eligible variant exists. Do not suppress a lone eligible cue merely because it repeats. Do not consume authoritative simulation RNG, mutate NPC simulation state or invent a new persistence/replay scheme; npc-065/Q11 owns the presentation selection contract. Preserve existing throttling, episode limits, spatial playback and cancellation. If no safe same-speaker clip is available, silence/text-only is correct.

**Molly:** the stable resident exists in `homeAuthoredResidents.ts`, but no inspected authored giver/callback in `quests.ts` establishes her three generic quest reactions. Coverage lines are supplied but held. Do not infer Lost Lamb, Pip's return, custody, reconciliation or a new quest producer.

## Production and QC checklist

1. Reconcile any recordings delivered since this source snapshot against UUID + exact text + context; suppress a now-duplicate job. Only the 72 `ready-to-order` rows are this batch's recording list; Q90 remains its own order.
2. In Fish Audio select the precise UUID; paste plain `generation_input` only. Keep delivery cues outside input. Check pronunciation of Marek and Kasia in the two self-address lines; do not silently Anglicize names or change transcripts.
3. For every output capture recording ID, exact input, actual selected UUID, generation/source provenance and SHA256 of final bytes. Preserve rejected-source hashes separately; never overwrite history.
4. Listen to the entire clip. Confirm actual audible words against script and ASR; ASR match alone does not establish identity, delivery or context. Resolve contractions and the specific mismatch candidates before setting canonical transcript.
5. Confirm stable speaker against approved reference, natural delivery, no cutoff, clipping, artifacts or unintended speech/tags. Check beginnings/endings, appropriate loudness and emotional fit. No comic or celebratory delivery on danger or adverse quest outcomes.
6. For reusable files verify the pinned Git blob/SHA256 and actual voice; if the source differs, reopen that one candidate. No bank-wide “pass” and no regeneration merely because listening is pending.
7. Test context rejection before runtime admission: nighttime greetings, snow vs rain, no available quest/ruins, pending-offer decline, trade transition, water before gameplay revision, already-repaired foundation, Molly without giver binding, fleeing instead of combat, and work action vs end of shift. Verify all outcomes preserve simulation state and RNG behavior.
8. Record listening provenance (reviewer, date, source/output hash, verdict, notes) in the existing QC process. Only then register assets and exact display binding; run the owner-specific resolver/bark/greeting/quest/campfire checks in that later implementation.

## Verification of this documentation package

Programmatic consistency checks cover exact per-NPC/intent variant indices, 115 coverage references, unique recording IDs/filenames, immutable selected NV/Q90 inputs, five byte-identical QV lines, correct approved casting, blocked UUID exclusion, plain inputs, no duplicate same-speaker transcript order, complete 14-row restoration dispositions, and unchanged source snapshot pins. Reuse paths/hashes were matched to the migration inventory; no binary content was downloaded or listened to.

No TypeScript, runtime manifest, asset, historical NV/Q90 file, casting record, QC verdict or regeneration backlog is changed. This is static documentation validation; no runtime, listening, browser or performance verification is claimed.
