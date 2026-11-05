# Plan: Next Fish Audio Production Batch — Named NPC Variants, Quest Offers and Restoration

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** polish
**Priority:** medium · **Effort:** M
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `dialogue`
**Tags:** `audio` `polish` `revival`

## Editorial freeze — 2026-11-05

The [final production package](../research/v1-revival/2026-11-05--npc-069-production-package.md), [English recording script](../research/v1-revival/2026-11-05--npc-069-recording-script.md), [deduplicated manifest](../research/v1-revival/2026-11-05--npc-069-production-manifest.json) and [exact coverage matrix](../research/v1-revival/2026-11-05--npc-069-coverage.md) complete the writing/reconciliation handoff. **115 base slots; 37 newly written missing-slot lines; 72 new recording jobs** (28 existing NV texts + 37 Astra texts + 5 preserved QV offers + 2 generic female restorations). All five casts and five QV offers are unchanged.

Named coverage uses 29 existing NV drafts (one held), 35 existing audio candidates (two held), 9 Q90 orders and 37 new texts. The manifest also references three existing generic male Q90 orders: **12 Q90 references, zero duplicate orders**. Three Molly quest slots and five restoration tasks remain held; seven optional restoration tasks remain deferred. No optional weather take is newly commissioned. All reuse remains QC-pending, with conditional one-slot fallback rather than duplicate generation. See the package for five actual backlog transcript-review flags (the earlier handoff count of four was stale).

**Production selection is now frozen by those outputs; earlier TBD counts below are historical.** The plan remains `planned` because author generation, audio QC and separate runtime/display binding remain outstanding. No audio, casting, live registry or runtime change was made. All QV playback is binding-held; QV-004 additionally awaits real water handover and duty gating. npc-065 retains QC/casting/runtime ownership.

## Goal and author rules

Prepare ONE bounded, recording-ready **English Fish Audio package**: five approved quest-specific NPC offers, high-value named NPC situations, and missing coverage after the 2026-11-05 rejected-audio cleanup. **The approved per-NPC variant target is fixed in the table below**, including QC-passed same-speaker reusable audio, existing Q90 orders and newly commissioned takes. Select the exact count by usefulness and source coverage; do not blindly order three new recordings. Where multiple eligible variants exist, presentation may choose among them with repeat suppression. Quest-specific offers are one precise line per quest/offer variant, not a generic randomized offer bank.

This is **production planning / editorial reconciliation**, NOT a runtime implementation plan, a new casting decision, a blanket approval of all Q90 or named drafts, or authorization to generate MP3s. GPT Astra writes any new dialogue text, including additional variants and revisions. Author records in Fish Audio. No other agent invents new spoken copy.

## Authority and non-duplication

| Owner / artifact | Existing responsibility | This plan may do | This plan must not do |
| --- | --- | --- | --- |
| [npc-065](npc-065-stable-npc-voice-casting-and-donor-qc.md) | Speaker identity, donor QC, voice registry/resolver, S5 missing-line workflow | Consume verified speaker/candidate/QC state; submit concrete production gaps | Redesign casting, age policy, resolver, import or runtime registrations |
| [CASTING](../design/npc-voices/CASTING.md) | Approved Fish UUID per named character / generic role | Reference exact speaker UUID | Substitute voices or invent characterKey |
| [Named script JSON](../research/v1-revival/2026-11-05--named-npc-voice-script.json) | Existing NV IDs / 89 new drafts, reuse placements and Q90 refs | Select existing NV rows, commission missing variants through Astra with new stable IDs | Copy selected rows as newly invented jobs; double-count reuse |
| [Q90 script](../research/v1-revival/2026-11-04--q90-fish-audio-script.md) | 87 previously approved scripts, separate orders | Reuse referenced Q90 ID in coverage matrix, avoid duplicate recording | Recommission or rewrite approved Q90 entries |
| [Regeneration backlog](../assets/voice-qc/regeneration-backlog.json) | 14 rejected recordings: 7 former runtime coverage, 7 optional | Select exact regeneration targets, track changed proposed text and eligibility | Rewrite deletion/identity provenance; enable optional audio automatically |
| [ui-input-047](ui-input-047-npc-dialogue-semantic-choices-and-spoken-lines.md) | Dialogue semantic choices and displayed/spoken presentation | Require textual pairing and accurate offer moment | Reimplement dialogue UI or choice semantics |
| Quest code / Revival quest decisions | Quest mechanics, conditional offer and authored dialogue authority | Supply five exact scripts and future display-text correction proposals | Change quest objectives, implement revised quests, play a generic `quest_offer` for a specific quest |

Source-of-truth priority: live code and tests > implementation evidence > plans > other research. Historical source script and QC decisions remain immutable; maintain links rather than competing copies.

## Production selection

### A — Five exact quest offers

| Recording ID | Quest ID | Giver | Fish UUID | Gate |
| --- | --- | --- | --- | --- |
| QV-001 | `lis-przy-osadzie` | Marek | `2adcdee4b3ce4b648dc16ea65430ea76` | Normal offer; fox target |
| QV-002 | `stare-ruiny` | Piotr | `5e03f21950f64729935dd8402c9c9702` | Only instantiated for resolved nearby smallRuins |
| QV-003 | `shells-dla-kasi` | Kasia | `d4f161bee1934b47ad3090f05649270c` | Three shells; no implemented decoration promise |
| QV-004 | `woda-dla-marka` | Marek | `2adcdee4b3ce4b648dc16ea65430ea76` | Revised direction needs water handover and guard duty gating; not yet runtime truth |
| QV-005 | `kamienie-dla-piotra` | Piotr | `5e03f21950f64729935dd8402c9c9702` | Six stones, household foundation; sequel/conditional repair without claiming prior completion |

Preserve the five English lines agreed on 2026-11-05 as editorial candidates; record their exact bytes in the final manifest, not only dialogue summaries. If changed by Astra, retain a revision record. Bind later to the actual questId, exact offer moment and variant, with player-facing text/voice fidelity. Quest offers are explicitly exempt from the 1–3 randomized non-quest rule.

### B — Named NPCs: approved per-situation variation targets (author decision 2026-11-05)

**Applies to all five:** `marek_hornblower`, `kasia_hornblower`, `anna_lesniewska`, `piotr_lesniewski`, `molly_lambert`.

| Situation / intent | Variants per named NPC | Rule |
| --- | ---: | --- |
| `greeting` | **3** | Condition-qualified; no daytime-only clip at night |
| `farewell` | **2** | Actual ordinary goodbye |
| `attention` | **2** | Genuine proximity attention |
| `hungry` | **2** | Actual need transition |
| `exhausted` | **2** | Actual exhaustion/pause |
| `weather_shelter` (neutral) | **2** | Weather-neutral, safe in all eligible shelter contexts |
| `danger_alert` | **2** | Threat newly perceived; no invented species |
| `combat_start` | **2** | Combat actually begins; no assumed weapon |
| `work_finished` | **2** | One work action finished, not end of shift |
| `quest_accepted` | **1** | Generic cue; no objective/reward claims |
| `quest_declined` | **1** | Generic response to actual decline |
| `quest_complete` | **1** | Generic outcome-safe acknowledgement |

**19 non-quest/non-generic-quest situation variants + 3 generic quest reaction cues = 22 candidate coverage slots per NPC, 110 slots total across five NPCs.** These are **coverage targets, NOT 110 new recordings**: existing Q90 orders, existing reusable same-speaker clips and previously drafted NV texts count where context and QC permit. Five exact quest offers are separate, one each. Total scoped coverage = **115 slots** before optional weather-specific additions or applicability holds. Current new-recording count is **TBD only after de-duplication**.

**Weather choice approved:** exactly **2 neutral shelter variants** per NPC, plus **optional** weather-specific rain/storm/snow takes only when existing approved text/context makes them worthwhile. Specific weather takes are supplemental, not a substitute for the neutral pair and not automatically commissioned. They have their own eligibility predicates and are never pooled unconditionally with incompatible weather. Do not manufacture a new three-variants-per-weather mandate.

**Interpretation:** Count per **NPC × situation × eligible context**, rather than just count different filenames. A clip with an incompatible time, relation, profession, speaker or trigger does not fill the required general slot. Existing audio remains QC-pending until passed. If a cue has no reachable producer for an NPC, classify it as **binding-held** rather than fabricate a producer or force runtime scope; still write the coverage line if editorially in scope.

**Randomisation handoff:** Context eligibility first, stable same-speaker identity second, eligible variants 1–3 (here fixed 2 or 3), then no immediate repetition when alternatives exist. Audio-only presentation variability must not consume authoritative simulation RNG. Runtime strategy is separately owned by npc-065/Q11.

### B — Historical selection guidance (exact 3/2/1 table above governs)

Initial eligible runtime characters: `marek_hornblower`, `kasia_hornblower`, `anna_lesniewska`, `piotr_lesniewski`, `molly_lambert`. Piers is deferred without a verified runtime character binding. Other named characters may be assessed later but are not silently added to this batch.

Mandatory **coverage matrix by characterKey × semantic intent × context condition**; 1–3 eligible variants at completion, not 1–3 *new* takes. Initial selection:
- Dialogue: `greeting`, `farewell`, `attention` (only when the verified event is available), `quest_accepted`, `quest_declined`, `quest_complete` (where the NPC can perform that event).
- World reactions: `hungry`, `exhausted`, neutral `weather_shelter`, `danger_alert`, `combat_start`, `work_finished` (only when actually eligible and meaningful for that NPC).
- Rain/storm/snow: conditional alternatives to the neutral weather slot, **not additional mandatory 1–3 each** unless individually chosen as their own situations. Never play rain text for snow.
- Optional events such as `guard_response`, trade entry/exit or livestock danger: add only after verified real producers and role conditions. No automatic voice coverage of routine family/resources/activity explanation.

Start from NV P0 and relevant P1, but **do not restrict the final coverage matrix to the old 16 P0 drafts**. Marek's pilot clips, Kasia and Molly same-speaker reuse, plus Q90 references may fill slots after listening/QC. Keep references to existing NV IDs/Q90 IDs, record each reuse only once per unique recording, and distinguish `existing/QC-pending` from `ready-to-order`.

For each approved situation, have Astra fill the exact target **3 / 2 / 1** after subtracting valid existing NV drafts, Q90 orders and QC-eligible reused clips. Do not treat the earlier 1–3 range as discretionary now. New texts must be meaningfully distinct while interchangeable under shared triggering conditions; avoid merely changing punctuation or a synonym. Ensure variants are semantically interchangeable for the same trigger/conditions. Different weather/relationship/time eligibility does not create an unconditional random pool.

### C — Cleanup restoration

Review the 7 `runtime-coverage-restoration` items in the 14-row regeneration backlog: general female greeting/farewell, general male greeting/farewell/danger, female campfire weather question/answer. Treat their identifiers as original provenance, not automatic permission to restore. Compare with Q90 generic male entries and approved casting: backlog adult male source is Casual Male Speaker for farmer usage, whereas the general adult male direction is FairyTail 1. Resolve role/slot ownership without silent speaker substitution or duplicate orders. Check campfire pairs against retained partner and transcript evidence. Retain all other 7 items explicitly as `deferred-optional`, including both age-ambiguous `general_male_young_*` clips.

Generic regeneration does **not** count toward the 1–3 per named NPC when it violates the NPC's own approved voice UUID.

## Required reconciliation pass BEFORE finalizing recording count

For every proposed row produce:
`recording_id`, `characterKey` or generic role, `speaker_name`, `fish_voice_uuid`, `semantic_intent`, `context_predicates`, `trigger/source`, `quest_id` (quest only), `offer_variant` (quest only), `canonical_transcript`, `generation_input`, `suggested_filename`, `source_id/file`, `qc_verdict`, `priority`, `disposition` (`record/reuse/held/deferred`), `delivery_cue`, and `runtime_gate`. Existing/Q90/rejected rows retain their original IDs. New variant IDs must not collide with NV, Q90 or QV.

A row may be counted as orderable only if casting is approved, script is stable, there is no same-speaker compatible reusable/previously commissioned item, and its truthful event conditions are known. Keep a distinct **coverage target count**, **new recording order count**, **already ordered elsewhere count**, **QC-pending reuse count**, **held count**. The former 28-take estimate is **superseded** by the explicit 115-slot coverage model; actual new recordings remain unknown pending reconciliation.

## Runtime handoff (not implementation)

Variation selection belongs to presentation/audio only, with approved stable speaker and semantic eligibility filters first; apply repeat suppression and deterministic/replay-safe presentation selection **without consuming simulation RNG or modifying authoritative simulation state**. Exact RNG source and persistence/replay contract belong to the runtime owner (npc-065 / Q11), not to this production plan. Fallback is appropriate same-speaker compatible clip or silence/text-only, **never another speaker**.

Quest playback requires `questId` + specific displayed `offer` moment + explicit variant and matching text. `QuestLifecycleHooks.playQuestVoice(npcId,intent)` alone is insufficient; implementation integration is separate and must not break existing `quest_complete`. Review other plans before adding new runtime tasks.

## Astra writing session handoff

[Detailed, current-session writing brief](../research/v1-revival/2026-11-05--npc-069-astra-missing-voice-texts-handoff.md) is the authoritative task packet for preparing **only missing wording**. It does not reopen approved casting or authorize Fish generation.

## Deliverables / acceptance

1. Conflict and dedup table linking every selected row to NV, Q90, backlog or QV; explicit list of exclusions and holds.
2. Human-readable recording script grouped by Fish UUID. Exact Fish input is plain English text; delivery guidance is **outside** the input.
3. Machine-readable, stable-ID production manifest plus coverage matrix (exact approved 3/2/1 targets for each named character/event and a single exact quest-offer line per quest).
4. Five paired quest display-line correction proposals with implementation gates, not automatic gameplay edits.
5. QC protocol: UUID, actual audible words/ASR, natural delivery, context, file hash SHA256, listening provenance and no cutoff/artifacts. No asset/runtime admission without QC.
6. Link outputs from `docs/research/v1-revival/README.md` or permanent voice index. Do not overwrite historical script/author decisions.
7. Pass review demonstrating no overlapping recording orders, excluded speaker UUIDs, wrong-role generic substitutions, missing variant eligibility, or stale quest assumptions.

## Sequence

1. Recon and conflict audit of live manifests, named script, Q90, cleanup backlog and npc-065.
2. Coverage matrix and reuse QC shortlist; fulfill the **approved 3/2/1 exact targets**, with contextual eligibility and explicit holds.
3. Astra editorial pass only for genuinely missing new variants and five aligned quest offers.
4. Freeze one manifest/recording script; author generates Fish Audio outside this plan.
5. Asset QC, then separate implementation handoff through existing owners.

**Out of scope:** new Fish MP3s, runtime changes, speaker reassignment, simulation trigger creation, broad English dialogue migration, unconditional creation of 3 new takes per event, and all deferred quests.
