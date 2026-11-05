# GPT Astra Writing Handoff — npc-069 Missing Fish Audio Texts

**Date:** 2026-11-05
**Owner:** GPT Astra — new English NPC dialogue and variant writing only
**Parent:** [npc-069](../../plans/npc-069-next-fish-audio-production-batch.md)
**Status:** editorial session completed — [final package](./2026-11-05--npc-069-production-package.md), [recording script](./2026-11-05--npc-069-recording-script.md), [manifest](./2026-11-05--npc-069-production-manifest.json), [coverage](./2026-11-05--npc-069-coverage.md). Historical task brief and all five QV texts below preserved. NO Fish generation, code implementation or casting changes.

## Objective

Deliver the **exact missing English spoken texts** needed to complete the author's 2026-11-05 approved named-NPC variation policy and the 7 high-priority cleanup restorations; preserve the **five already agreed quest-specific English offers** without gratuitous rewriting.

Do not draft all voices from scratch. First reconcile source NV, Q90, same-speaker reusable candidates, existing regeneration backlog and the five QV offers; produce one deduplicated script and machine-readable recording order, keyed by original stable IDs. Preserve existing approved material and provenance.

## Fixed author-approved variant targets

For EACH of five named NPCs, target:

| Semantic intent | Count |
| --- | ---: |
| greeting | 3 |
| farewell | 2 |
| attention | 2 |
| hungry | 2 |
| exhausted | 2 |
| weather_shelter (neutral) | 2 |
| danger_alert | 2 |
| combat_start | 2 |
| work_finished | 2 |
| quest_accepted | 1 |
| quest_declined | 1 |
| quest_complete | 1 |

This equals **22 slots × 5 = 110 named NPC coverage slots**. Count suitable reusable same-speaker assets and Q90-authorized rows, not just new lines. All five specific QV offers are extra (115 base slots); any optional rain/storm/snow variants are additional, explicitly justified rows only. Separate `coverage slots`, `texts already drafted`, `existing/QC-pending`, `Q90 separately ordered`, `new missing lines`, and `held`.

NPCs + approved UUIDs/runtime keys:
- Marek `marek_hornblower` — Friendly Male `2adcdee4b3ce4b648dc16ea65430ea76`
- Kasia `kasia_hornblower` — Expressive Female `d4f161bee1934b47ad3090f05649270c`
- Anna `anna_lesniewska` — Laura `e3cd384158934cc9a01029cd7d278634`
- Piotr `piotr_lesniewski` — Country Baritone `5e03f21950f64729935dd8402c9c9702`
- Molly `molly_lambert` — Hannah `9a9cf47702da476aa4629e2506d4a857`

Piers has approved Fish voice but NO verified runtime characterKey: do not add him as sixth named character. Do not expand to Jakub/Kazimierz/Archibald/Patric/Rudolf without separate selection.

## Existing texts to REUSE, not recreate

1. [Named NV JSON](./2026-11-05--named-npc-voice-script.json): 89 new drafts (P0/P1/P2), 27 reuse placements/25 files, 10 existing Q90 references. Audit all applicable original NV IDs, including Mark/Molly pilot/reuse and Kasia Q90 references. P2 may provide existing optional neutral lines, but do not assume that a rain/snow variant replaces an approved neutral variant.
2. [Named reuse QC](./2026-11-05--named-npc-voice-reuse-qc.md): all listed reused assets require listening/source/identity/context QC. They are candidates, not passed coverage. A transcript match is not enough for Fish speaker identity. Do not commission duplicate takes simply because old clip is QC-pending; explicitly show a conditional fallback if reuse fails.
3. [Q90 approved script](./2026-11-04--q90-fish-audio-script.md) and [JSON](./2026-11-04--q90-fish-audio-script.json): 87 already approved texts; **not** new orders under this packet. Preserve Q90 IDs and exact input. Q90 references for Kasia and Molly may fill named slots if current casting/context matches.
4. [Regeneration backlog JSON](../../assets/voice-qc/regeneration-backlog.json): exactly 14 deleted/rejected audio tasks; 7 former runtime slots are restoration candidates, 7 optional explicitly deferred. Four historical ASR/catalog discrepancies need careful text/context review. Three adult male replacements were assigned to Casual Male Speaker for farmer purposes, while the generic adult male casting now uses FairyTail 1: **do not silently overwrite a UUID or cross-role an asset**. Campfire female weather question+answer must match compatible retained partner before text is final.
5. [CASTING](../../design/npc-voices/CASTING.md), [npc-065](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md), [npc-069](../../plans/npc-069-next-fish-audio-production-batch.md) for boundaries.
6. Actual events: `src/ai/NpcAgent.ts`, `src/ai/npcVoiceLines.ts`, `src/ai/npcBarkRequest.ts`, `src/ai/campfireTalk.ts`, `src/ui-vue/npcDialogueGreeting.ts`, `src/ui-vue/store.ts`, `src/quests/quests.ts`, `src/quests/QuestManager.ts`. Verify real paths and conditions first; do not assume nonexistent producer.
7. Quest decisions: [round 2](./2026-10-28--quest-round-2-author-decisions.md) and related quest-decision-round-2 files. The exact five QV texts were approved editorially in the 2026-11-05 conversation handoff but **not yet committed as separate machine-readable artifact**. Capture them in this batch's JSON after checking that original text was copied faithfully.

## Five quest-specific lines: preserve English wording unless meaningful contradiction

| QV ID | Quest | NPC | Exact English editorial text |
| --- | --- | --- | --- |
| QV-001 | `lis-przy-osadzie` | Marek | There's a fox coming closer to the village every day. Won't be long before it starts taking our chickens. If you spot it, put a stop to it before it does any damage. |
| QV-002 | `stare-ruiny` | Piotr | I came across some old ruins while I was out scouting. Didn't have time for a proper look. Think you could go and see what's there? |
| QV-003 | `shells-dla-kasi` | Kasia | You know, the doorstep could use a little colour. Next time you're by the sea, would you look for three pretty shells for me? I'd love to decorate it with them. |
| QV-004 | `woda-dla-marka` | Marek | I've got my hands full here, and I could use a drink. Would you fetch me some water from the well and bring it back? |
| QV-005 | `kamienie-dla-piotra` | Piotr | The foundation of my house needs strengthening. If you're heading out near the rocks, could you bring me six good, solid stones? That should do the job. |

QV-002 is only instantiated after nearby `smallRuins` resolution, no fixed direction. QV-004 actual filled water handover and duty gating are future Revival changes. QV-005 foundation repair is linked to household fence progression; don't claim fence was already repaired. QV-003 no guaranteed implemented doorstep visual decoration or fixed coast placement. The existing player-facing quests are Polish; later display correction and exact playback mapping are separate implementation. Q90 generic quest cues are NOT exact substitutes for these five offers.

## Editorial rules

- All **new** lines must be written by GPT Astra, natural spoken English, medieval-inspired but no mock archaism. Keep each named character recognizable and distinctive.
- 2–3 alternatives for a situation must be meaningfully different in expression, while contextually interchangeable. Do not vary objective claims, NPC profession, time/weather state or reward promises without explicit eligibility predicates.
- No immediate repeat across eligible variations; random selection is a later audio presentation task. Do not prescribe a simulation RNG mutation.
- Neutral `weather_shelter` ×2 for every named NPC. Rain/storm/snow-specific extra recordings are **optional**, not 2 each. No rain line as snow fallback.
- Generic `quest_accepted`, `quest_declined`, `quest_complete`: **1 each per NPC**, separate from exact quest offers.
- Non-quest situations must have 1–3 variants under the approved exact table; no unilateral changes to counts.
- No author approval necessary for routine editorial corrections; flag only substantive story/gameplay conflicts. Historical Q90 author approval and named drafts are not the same thing.
- No excluded British-female or Brian British voice. No speaker swap across one NPC.

## Required output in this session

1. **Source-to-slot matrix** `characterKey × intent × variant_index × conditions` with exact NV/Q90/reuse/backlog references, flag existing candidates as QC-pending.
2. **Missing-only writing list**: identify precise empty variant slots and fill with new copy. Give newly written entries stable, noncolliding IDs. Do not multiply NV P0/P1 or Q90 rows as new work.
3. **Production table and JSON**: `id`, `source_id`, `npc/characterKey`, `voice name`, `UUID`, `intent`, `conditions`, `exact Fish input`, `filename`, `delivery notes`, `status` and `QC/integration gates`, distinguishing ready / reuse pending / Q90 already ordered / held / deferred.
4. **Fish recording script** grouped by UUID, plain untagged generation text; delivery cues outside Fish input.
5. **7 restoration decisions**: exact old filename, keep/replace/hold, intended speaker and justification; explicitly note the 7 optional tasks still deferred.
6. **Five QV records** with exact wording and clear questId/offer-moment binding contract; no runtime code changes.
7. **Concise audit** showing target slots, accepted candidates, new required recordings, holds, duplicates suppressed and unresolved blockers. Avoid stating production/QC ready when not tested.
8. Save new package documents under `docs/design/npc-voices/` or `docs/research/v1-revival/`, preserve historical inputs, and link new outputs from [Revival index](./README.md) AND [npc-069](../../plans/npc-069-next-fish-audio-production-batch.md).

**Stop line:** This is text and production-documentation only. Do not generate MP3s, update live voice manifests, run Fish Audio, or implement quest/runtime features.
