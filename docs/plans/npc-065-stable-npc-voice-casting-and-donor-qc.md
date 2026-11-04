# Plan: Stable NPC Voice Casting, V3 Donor QC and Selective Recording

**Created:** 2026-11-02
**Status:** `planned` 📋
**Type:** feature
**Priority:** medium · **Effort:** L
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `dialogue`
**Tags:** `voice` `audio` `casting` `v3-donor` `revival-q45`

## Plan history

- **2026-11-02 (Opus, queue Q45):** recon against `main` `f35ba4f2` + staged donor bytes `docs/v3-donor/voices/mp3/` (V3 pin `47733d6b`). Planning only, no code or assets changed. Author direction: [voice audit §12](../research/v1-revival/2026-10-31--npc-voices-dialogue-audit.md#12-author-decisions--approved-2026-10-31-supersedes-open-questions-in-11) and [P2 decisions Q31/Q40](../research/v1-revival/2026-10-31--p2-author-decisions-q38-q39-q31-q42.md#q31--q40--voice-bank-sequencing).

## Goal

Every NPC speaks with **one fixed speaker voice** across proximity reactions, dialogue open/close, quests, barks and campfire talk. Resolution never crosses speakers; a missing compatible clip is silence (bark) or text-only (dialogue). The V3 second banks (`*_b`, 208 files) and the Mark Hornblower pilot are reused **as far as listening/transcript QC allows**, and only the gaps that remain after reuse are recorded.

Non-goals: new simulation triggers (Q46 / audit D5–D6), relation/archetype variant selection (audit D3), full English migration of the dialogue menu/templates/quests, Q30 history redesign, voice-profile persistence.

## Recon — current code (verified 2026-11-02)

| Fact | Evidence |
| --- | --- |
| `voiceProfileIdFor(gender, role)` returns `"<scope>:<gender>"`, stored on `NpcAgent.voiceProfileId` (`src/ai/NpcAgent.ts:1859`) and passed in every `NpcVoiceResolveInput` — but **`resolveNpcVoiceLineWithManifest` ignores it** | `src/ai/npcVoiceLines.ts:35,340` |
| Lookup keys: `npc:<id>` → `<scope>:<gender>:<age>` → `<scope>:<gender>` → `general:<gender>:<age>` → `general:<gender>`. The `general` fallback is the timbre switch (audit F01): a guard's exhaustion is the general male speaker | `buildNpcVoiceLookupKeys` |
| Five consumers: proximity reaction `NpcAgent.playReactionSound` (`attention`/`greeting`), bark requests `NpcAgent.requestBark` → `createRequestNpcBark`, dialogue open `resolveNpcGreetingPresentation`, dialogue close/accept `store.ts:1274,1283`, quest voice `createApp.ts:2007` | grep `resolveNpcVoiceLine` |
| Live bark producers: `exhausted`, `hungry`, `weather_shelter` (+ Q31 rain/storm/snow chain), `danger_alert`/`livestock_danger`, `combat_start`, `guard_response`, `work_finished`. No producer: `call_for_help`, `confirmation`, `thanks`, `refusal`, `warning`, `well_wish`; `quest_offer` is in `QuestVoiceIntent` but no call-site was found | `NpcAgent.ts` `requestBark(` call-sites |
| Campfire pairs selected by gender only; clips are the general male/female speakers (catalog `campfire_*` = alias UUIDs). Selection consumes the social `rng` passed by `socialBehaviour.ts:220` | `src/ai/campfireTalk.ts` |
| Dialogue-open greeting subtitles are a Polish transcript table keyed by filename; unknown clip → Polish text-only fallback by archetype | `src/ui-vue/npcDialogueGreeting.ts` |
| NPC `id` is the stable settlement `NpcId`; `role` is `readonly` and set once from `CharacterDef` (no role reassignment in `src/`); `characterKey` exists for authored residents incl. `marek_hornblower` (guard) | `NpcAgent.ts:1812,1860`, `characters.ts:25,76` |
| Children (`lifeStageForAge` infant/child) currently fall through to adult `general:<gender>` clips | `voiceAgeBandForAge` |

## Recon — speaker coverage

A **speaker** = one Fish voice UUID ([donor catalog §Voice sources](../v3-donor/voices/docs/NPC-VOICE-CATALOG.md#voice-sources)). Counts = files on disk (V1 `public/` primaries + staged donors). ✓n = clips for that intent; — = none. "Live" columns only.

| Speaker (Fish name) | files | greet | attn | farew | q_acc | q_dec | q_cmp | exh | hungry | weather | danger | combat | work_fin | other |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `general_male` (Casual) | 16 | ✓1 +4 age | — | ✓1 +3 age | — | — | — | ✓1 | ✓1 | rain ✓1 | ✓1 | ✓1 | ✓1 | campfire ×6 |
| `general_female` (Warm) | 16 | ✓1 +1 old | — | ✓1 +2 old | — | ✓1* | ✓1* | ✓1 | — | neutral ✓1 | ✓1 | — | — | campfire ×6; `child_*` ×3 are this adult voice |
| `guard_male` | 22 | ✓2 | ✓1 | ✓1 | ✓2 | ✓2 | ✓2 | — | — | rain ✓1 | ✓1 | ✓1 | — | guard_response ✓1 |
| `hunter_male` (Arthur) | 21 | ✓2 | ✓1 | ✓2 | ✓2 | ✓2 | ✓2 | — | — | — | ✓1 | ✓1 | — | |
| `merchant_female` (Expressive) | 17 | ✓3 | ✓1 | ✓2* | ✓2* | ✓1* | ✓2* | — | — | — | — | — | — | |
| `shepherd_male` (hetalia Russia) | 5 | ✓2* | — | ✓1* | — | — | — | — | — | — | ✓1 (`shepard_` typo) | — | — | livestock ✓1 |
| `general_male_b` (Brian) | 38 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | |
| `general_female_b` (Hannah) | 38 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | texts = male_b |
| `guard_male_b` (Dramatic) | 40 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | guard_response ✓2 |
| `hunter_male_b` (Cowboy) | 38 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | |
| `merchant_female_b` (Laura) | 38 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | |
| `shepherd_male_b` (Sleepless historian) | 10 | ✓2 | — | ✓2 | — | — | — | — | — | — | ✓2 | — | — | livestock ✓2 |
| `mark_hornblower` (Friendly Male) | 6 | ✓1 | — | ✓1 | — | — | — | — | — | — | ✓1 | — | — | thanks, daily, road_advice |

`*` = on disk in V1 `public/` but **not registered** in `GENERATED_VOICE_MANIFEST` (part of the 37 unregistered files, audit F07). Weather columns: `_b` banks carry neutral or rain-worded lines (e.g. `merchant_female_b_weather_shelter_02` names rain) — the QC ledger assigns each to `weather_shelter` or `weather_shelter_rain`; no speaker has snow/storm-specific text.

**Main finding.** The primary banks were authored as *role overlays on a general fallback*; the `_b` banks were authored as *complete, mostly role-neutral speakers* (2 × 19 intents, editorially revised 2026-10-20 — e.g. `hunter_male_b`/`merchant_female_b` greetings and needs lines name no profession). Under a no-cross-speaker rule the `_b` banks are therefore the best-covered voices in the project, and they can serve non-role NPCs (farmers, woodcutters, …) — this is the main "maximize reuse" lever. Primary role banks lose their borrowed general lines (guard/hunter/merchant exhaustion, hunger, weather, work end become silent until recorded), which is the accepted cost of decision §12.1.

## Design

### 1. Speaker casting (replaces `voiceProfileIdFor`)

`NpcVoiceProfileId` becomes a **speaker id** (`general_male`, `hunter_male_b`, `mark_hornblower`, …). Owner stays `src/ai/npcVoiceLines.ts` (pure, no `NpcAgent` import).

```text
castNpcVoiceSpeaker({ id, gender, role, age, characterKey }) → NpcVoiceProfileId | null
```

1. `characterKey` override table (initially `marek_hornblower → mark_hornblower`; QC-gated like any speaker).
2. Child life stage (`voiceAgeBandForAge === 'child'`) → `null` (silent / text-only) until boy/girl speakers exist (author §12.1: low priority). Adult `general_female_child_*` clips are **not** a child voice and stay unregistered.
3. Candidate list by `(gender, role)` from a frozen table `VOICE_CASTING_CANDIDATES` with weights:
   - male guard → `guard_male`, `guard_male_b`¹
   - male hunter → `hunter_male`, `hunter_male_b`
   - male shepherd → `shepherd_male`, `shepherd_male_b`
   - female trader → `merchant_female`, `merchant_female_b`
   - other male (any role, incl. male trader) → `general_male`, `hunter_male_b`, `general_male_b`¹
   - other female (any role, incl. female guard/hunter/shepherd) → `general_female`, `general_female_b`, `merchant_female_b`

   ¹ Enters the table only if the author's casting listen (slice S2) accepts the speaker (Brian and Dramatic Character Male were judged weak on 2026-10-20; §12.5 asks to reconsider them).
4. Pick by **weighted rendezvous hashing** over `stableHash(id + '|' + speaker)` (FNV-1a as in `stableVariant`). Adding/removing a candidate moves only the NPCs that win/lose that candidate; every other NPC keeps its voice across versions. Not persisted (pure derivation) → no save bump, no worldgen/epoch impact.
5. Age stays within the speaker: elderly/young age-band clips of the **same speaker** are eligible (e.g. `general_male_old_greeting_*`), never another speaker.

Role-overlay content is solved per clip, not per speaker: a farmer cast to `hunter_male_b` gets only that bank's clips whose `roles` admit `farmer`.

### 2. Clip registry with transcripts (replaces the URL manifest)

New data module `src/ai/npcVoiceClips.ts` (data only; resolver logic stays in `npcVoiceLines.ts`):

```ts
type NpcVoiceClip = {
  url: string                         // /sounds/voices/<file>.mp3
  speaker: NpcVoiceProfileId
  intent: NpcVoiceSemanticIntent
  text: string                        // canonical English transcript, QC-confirmed
  roles?: readonly Role[]             // absent = any role (role-neutral content)
  ageBand?: NpcVoiceAgeBand           // young/old-only lines
  timeContext?: 'morning' | 'notNight' // moves from GREETING_TRANSCRIPTS
}
```

Only clips with ledger verdict `pass` are listed (registry admission = QC). Index once at module load into `Map<"speaker|intent", NpcVoiceClip[]>`.

`resolveNpcVoiceLine(npc, intent, ctx?)` → `NpcVoiceClip | undefined`: pool = index[`speaker|intent`], filter `roles`/`ageBand`/`timeContext` (eligible-before-random, audit F08), then Q30 `avoidUrl` + `Math.random` pick as today. **No general/scope fallback.** Callers that only need a URL use `.url`. Q31 weather chain (`weatherShelterVoiceIntents`) and `livestock_danger → danger_alert` stay in `npcBarkRequest.ts`, now within one speaker. The `npc:<id>:<intent>` keys disappear (`characterKey` casting replaces them).

### 3. Consumers

| Consumer | Change |
| --- | --- |
| `NpcAgent` constructor | `voiceProfileId = castNpcVoiceSpeaker(...)` (nullable) |
| `playReactionSound`, `requestBark`, `store.ts` close/accept, `createApp` `playQuestVoice` | Pass through unchanged input; `null` speaker → silent. Bark decision `no-voice-asset` unchanged |
| `resolveNpcGreetingPresentation` | Subtitle = clip `text` (English) and English archetype fallback lines; Polish `GREETING_TRANSCRIPTS` removed. Within approved §12.3 (NPC dialogue English); the rest of the dialogue menu stays for the separate migration row |
| `resolveCampfireTalk` | Takes both speakers; a pair is eligible only if question clip speaker = questioner speaker and answer clip speaker = responder speaker (campfire files are re-tagged as `general_male`/`general_female` speaker clips). Mixed-speaker pairs → silent simulation conversation (existing same-gender behaviour). Keep `rng` usage shape (one draw per selection) |

### 4. QC ledger (true audio/transcript QC)

Dev-only tool, not a runtime/package dependency: `scripts/voice/voice-qc-ledger.py` (Python + `faster-whisper` `small.en`, CPU) over V1 `public/sounds/voices/*.mp3` and `docs/v3-donor/voices/mp3/*.mp3` → `docs/assets/voice-qc/ledger.json`, one row per file:

`file`, `gitBlob`, `speaker` (catalog UUID → speaker id; `shepard_` typo mapped explicitly), `intent`, `catalogText`, `asrText`, `wer` (normalized), `durationSec`, `auto` (`match` ≤ 0.15 WER / `mismatch` / `unreadable`), editorial tags (`roles`, `weatherWord` rain/snow/storm/none, `claims` e.g. species/time/forecast, `humor`), `author` (`pass`/`fail`/`unheard`), `verdict`.

- ASR proves *which words were spoken*, not taste or pronunciation. The author does **not** listen to all 317 files: (a) one casting round per speaker, 3 representative clips each (≈ 39 clips) → speaker accept/reject; (b) every `mismatch` row; (c) Mark's 6 clips.
- `verdict = pass` ⇔ speaker accepted ∧ (`auto = match` ∨ author confirmed actual text, which then replaces `catalogText`) ∧ editorial tags set ∧ no unsupported claim (audit F02/F09: e.g. general male “Wolf! Everyone, watch out!” fails for generic `danger_alert`).
- CPU cost ≈ minutes; **do not run while a benchmark is in progress** (WSL shares the host CPU).

### 5. Donor import

Only `pass` donor files are copied from `docs/v3-donor/voices/mp3/` to `public/sounds/voices/` (same filenames, ≤ 10 MB total). Update `docs/assets/SOUNDS.md` (S29) and the V1 catalog `docs/dialogue/NPC-VOICE-CATALOG.md` (`in_repo`, speaker, QC ref). No re-encoding.

### 6. Prioritized missing-recording list (after reuse)

**S5/Q90 editorial and 87-take Fish Audio script author-approved 2026-11-04; recordings/QC/integration not complete.** [Current audit](../research/v1-revival/2026-11-04--q90-npc-voices-editorial-audit.md) and [recording script](../research/v1-revival/2026-11-04--q90-fish-audio-script.md) supersede the provisional counts below for production review: **87 proposed takes (P0 12 / P1 54 / P2 21)**, **72 conditional reuse candidates**, **0 ledger-passed clips**. Includes [explicit dispositions for all 81 Q31/catalog proposals](../research/v1-revival/2026-11-04--q90-supersession.md). Later approved male UUID targets have no existing recordings; rejected/held voices are not counted as approved coverage. No source, canonical transcript, audio or QC verdict changed. The following table is the historical S5 estimate, not a current recording order.

Computed from the coverage table, assuming casting as in §1 and all existing clips pass QC; recompute from the ledger in S5. Priority = live producer × number of NPCs on that speaker. Existing script rows are reused where they exist ([Q31 script](../research/v1-revival/2026-10-31--q31-npc-bark-line-script.md), [expansion catalog](../research/v1-revival/2026-10-31--npc-voice-expansion-catalog.json)); "new" rows must be written in S5.

| Pri | Speaker | Intents (clips) | Source rows |
| --- | --- | --- | --- |
| P0 | `general_male` | attention ×2, quest_accepted ×1, quest_declined ×1, quest_complete ×1, weather_shelter (neutral) ×1, snow ×1 | new ×5; Q31 general_male neutral/snow P0 |
| P0 | `general_female` | attention ×2, quest_accepted ×1, hungry ×1, combat_start ×1, work_finished ×1, rain ×1, snow ×1 | new ×3; Q31 female hungry/work_finished (P2 → P0), rain/snow P0 |
| P1 | `guard_male` | exhausted, hungry, work_finished, weather neutral, snow | catalog P1 exhausted/hungry; new work_finished; Q31 guard neutral/snow |
| P1 | `hunter_male` | exhausted, hungry, weather_shelter, work_finished | catalog P1 ×3; new ×1 |
| P1 | `merchant_female` | exhausted, hungry, weather_shelter, danger_alert, combat_start, work_finished | catalog P1 ×3; new ×3 |
| P2 | `_b` speakers | snow/storm-specific shelter lines (neutral already covers them) | new, optional |
| P2 | `shepherd_male`, `shepherd_male_b` | attention, exhausted, hungry, weather, work_finished (few NPCs) | catalog P1 shepherd ×3 (demoted); new |
| P2 | `mark_hornblower` | attention, quest_*, needs | needs separate author authorization (V3 note: “full pack unauthorized”) |
| low | boy / girl child speakers | greeting, farewell, danger (few lines) | §12.1, new speakers — not before age policy |

Expected size: ~20 P0 + ~18 P1 clips instead of Q31's 29 + catalog's 52. Q31 P1/P2 snow/storm second variants and catalog rows for speakers not in this table are superseded until re-prioritized. Recording keeps the existing Fish UUID per speaker so new clips stay in the same voice.

## Writing ownership (author decision 2026-11-02)

GPT Astra authors all new NPC dialogue, utterances, lines and textual variants, including S5/Q90 and future expansions. Opus handles planning/recon/coordination only; Sonnet handles implementation/integration/tests only. The author approves the text and generates Fish Audio recordings. Automatic transcripts/QC of existing audio remain technical work, not creative writing.

## Slices

| Slice | Model | Content | Done when |
| --- | --- | --- | --- |
| S1 QC ledger | S (H for bulk tagging) | Tool §4, run over 109 + 208 files, editorial tags, commit ledger + short report (mismatch list, claims list) | Ledger rows for all files; `mismatch`/`claims` lists in report; no runtime change |
| S2 Casting listen | author | Listen ≈ 39 casting clips + mismatches + Mark → accept/reject speakers, confirm weights | Verdicts recorded in ledger; queue §3 answered |
| S3 Runtime casting + registry | S/high | §1–§3 with registry seeded from **already-public, `pass`** primaries; tests below | Tests green; `type-check`, `lint`; STATE/catalog updated; browser listen on seed `415424794` → §2 |
| S4 Donor import | S | §5 for `pass` donors; registry entries | Files present = registry entries; resolver tests over real registry; SOUNDS.md |
| S5 Missing-line script | GPT Astra → author | §6 recomputed from ledger; write new rows (English, humor per §12.4 except emergencies) | Author-approved line script; Q40 then registers delivered files |

S3 may land before S4 (reuse can follow incrementally). S3 must not start before S1+S2 for speakers whose clips would otherwise become audible unverified; it may start with only the speakers already registered today if S2 is late.

### Tests (S3/S4)

- Casting: deterministic per id; independent of construction order; rendezvous property (adding a candidate moves only NPCs that now pick it); child → `null`; `marek_hornblower` → Mark; weights respected statistically over 10k ids.
- Resolver: never returns a clip of another speaker for any intent (property test over registry); role-scoped clip not returned for other roles; Q31 weather chain stays within speaker; no snow request returns rain text.
- Greeting: English clip text; time-context filtering before random pick.
- Campfire: pair only when both speakers match; otherwise `undefined`, conversation unaffected.
- Registry integrity: every URL exists under `public/`; every entry has non-empty `text` and a ledger `pass` row.

## Stop conditions

- Age transition policy (child speaker → adult speaker) — needed only when child speakers are recorded; until then children are silent (queue §3).
- A speaker fails the casting listen and its removal leaves a `(gender, role)` with no candidate → ask.
- ASR shows widespread mismatch (> 20 % of a bank) → stop bank import, report.
- Any requirement to persist casting, alter simulation RNG draws or add new triggers → out of scope.

## Performance

Casting: one hash per candidate at NPC construction. Resolution: map lookup + filter of ≤ ~6 clips per request, at existing request frequency. No per-frame work, no new audio pipeline, +≤ 10 MB lazily fetched MP3s.

## Author casting decisions — 2026-11-03 (S2, first listening round)

These are author-approved voice **casting** decisions, not per-clip transcript/QC passes. Do not convert unheard ledger rows into `pass` solely from this section.

| Speaker | Fish voice ID | Decision | Casting guidance |
| --- | --- | --- | --- |
| `general_male_b` — Brian British | `65c0b8155c464a648161af8877404f11` | **REJECTED PERMANENTLY / GLOBAL DO-NOT-USE** | Artificial, mechanical, flat delivery. Never generate new clips with this Fish voice ID, cast it to any NPC, import its donor audio to runtime, or register existing clips. Earlier rejection was Mark-only; this 2026-11-03 decision supersedes it globally. Retain archived donor files for provenance only, not runtime use. |
| `guard_male_b` — Dramatic Character Male | `7a18a1851d2649108c48ec9f2c80eb2c` | **Accepted provisionally** | Theatrical but usable; consider blacksmith or another guard/watchman, **not Mark Hornblower**. Role fit to be confirmed. |
| `general_female_b` — Hannah | `9a9cf47702da476aa4629e2506d4a857` | **Accepted** | Good, pleasant voice; Molly is a candidate, not yet a locked NPC assignment. |
| `hunter_male_b` — Cowboy | `a2cecd3eda8b44178b7f1bc1379edae0` | **Accepted provisionally** | Average but usable. Jacob Hunter or a different NPC is possible; do not assume this voice was Jacob's V3 voice without verifying V3 assignment. |

Implementation invariant: blocklisted Fish voice IDs must remain excluded irrespective of speaker profile aliases or future additions. All remaining S2 speakers and individual clip verdicts stay pending further review.

### S2 second listening round — 2026-11-03 (author decisions)

- `general_male` / Casual Male: **HOLD — suspected inconsistent actual speaker**. `general_male_farewell_01.mp3` sounds pleasant, whereas `general_male_exhausted_01.mp3` sounds raspy/like a different voice. Both currently map to Fish voice ID `c2a3921fd7024b9189cb912bdfe5266a` in the QC ledger. Investigate source/generation provenance per file; **do not silently treat the shared catalog ID as proof of identical audible identity**. No bank-wide casting approval yet.
- `general_female` / Warm Conversational: **HOLD — suspected inconsistent actual speaker**. `general_female_greeting_01.mp3` sounds flat, `general_female_exhausted_01.mp3` bright and emotional. Both currently map to `5e3be339f2df45e6a1a338bb2ce94800`. Verify generation/source provenance before admitting this bank as a consistent speaker. No blanket rejection/approval.
- `guard_male`: **accepted**; author notes Mark Hornblower's separate voice sounds better. This is not a proposal to recast Mark.
- `hunter_male` / Arthur (`bd22266aba38416cb602e90ce651520c`): **accepted; author selects for Jacob, the hunter**. Verify named-character key / assignment before runtime integration. V3 quest docs call the hunter Jacob Bowman (not 'Jacob Hunter' as a surname).

All above are listening/casting judgments, **not** transcript validation or global per-clip QC verdicts. Keep the ledger's unheard rows pending, especially for the two inconsistent banks.


### S2 male Fish Audio candidates — author bookmarks (2026-11-04)

The author bookmarked the following **candidates**, not approved castings or recordings. The IDs below come from the supplied Fish Audio profile URLs; no generated clip, voice consistency, licensing, or runtime suitability has been verified.

| Fish voice / profile | Fish voice ID | Author listening impression | Possible use (not assigned) |
| --- | --- | --- | --- |
| [FairyTail 1](https://fish.audio/m/689b47ca83dd48dba90b160affb8a118) | `689b47ca83dd48dba90b160affb8a118` | Clear male voice, slight accent, somewhat storytelling-like but good | General male candidate |
| [george](https://fish.audio/m/372ef39bf5bf4fd38c5c56bce607aba6) | `372ef39bf5bf4fd38c5c56bce607aba6` | Calm, slightly raspy male voice with a slight accent | Older male character candidate |
| [Rick Sanchez](https://fish.audio/m/d2e75a3e3fd6419893057c02a375a113) | `d2e75a3e3fd6419893057c02a375a113` | Energetic, mildly sarcastic and slightly raspy male voice | Characterful male NPC candidate |

These candidates are separate from the existing `general_male` casting decision, which remains unresolved. Before producing replacements, select and audition an actual Fish Audio speaker. Do not alter the clip registry, casting table, or Q90 gap computation based only on bookmarks.

### S2 approved male voice direction — 2026-11-04

**Author decision:** use these Fish Audio bookmarked voices for different NPC purposes (casting direction; not clip QC or completed implementation):

- **FairyTail 1** — Fish voice ID `689b47ca83dd48dba90b160affb8a118`: primary `general_male` for adult men.
- **george** — Fish voice ID `372ef39bf5bf4fd38c5c56bce607aba6`: `general_old_male` for older men.
- **Rick Sanchez** — Fish voice ID `d2e75a3e3fd6419893057c02a375a113`: `general_male_v2` as an alternative speaker for per-NPC assignment, potentially suitable for fishermen; do not lock it exclusively to the fisherman profession.

Each NPC retains one selected speaker across utterances (never randomly switches voice per line). Within eligible adult male general candidates, keep the author's approved **equal casting weights**; apply age, gender, role and named-character restrictions first. The older male speaker is age-eligible, not a requirement to retroactively change an existing NPC voice with age progression. No generated clips for these three voices have yet passed QC, and this decision does not authorize unverified audio in runtime. S3/S5 should use these approved targets when assessing voice coverage and recording needs; precise internal speaker identifiers remain implementation choices.

### S2 further author listening decisions — 2026-11-03

- `merchant_female_b` (catalog: Laura): usable mature female voice, but not for Kate/Kasia Hornblower. Author says sampled voice does not sound like Laura; verify actual source ID.
- `merchant_female` (catalog: Expressive Female): greeting sample fits merchant Kate/Kasia Hornblower; source ID likely correct but not independently verified.
- `shepherd_male_b` (Sleepless Historian): accepted, calm male voice; final NPC role undecided.
- `shepherd_male` (Hetalia Russia): accepted; author recognizes voice in the samples. Fish bookmark describes female voice; verify gender metadata/role before casting.
- `mark_hornblower` (Friendly Male Voice, `2adcdee4b3ce4b648dc16ea65430ea76`): **accepted for Mark Hornblower**. Listened to daily, danger alert and farewell samples. Keep separate from other guard voices.

These are casting judgments, not individual transcript-QC verdicts. Unverified source IDs must not be treated as proven.

