# Plan: Stable NPC Voice Casting, V3 Donor QC and Selective Recording

**Created:** 2026-11-02
**Status:** `planned` 📋
**Type:** feature
**Priority:** medium · **Effort:** L
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `dialogue`
**Tags:** `voice` `audio` `casting` `v3-donor` `revival-q45`

## Production ownership boundary — 2026-11-05

The [next Fish Audio production batch plan](npc-069-next-fish-audio-production-batch.md) owns the bounded **recording-order reconciliation**, 1–3 variant coverage matrix for each selected non-quest named NPC situation, and five exact quest-offer audio candidates. This plan (`npc-065`) continues to own voice identity/casting implementation, resolver, donor QC, registry, and S5 technical missing-line workflow. Its historical scripts, count estimates and S5 do **not** constitute independent duplicate audio orders. New spoken text is authored by GPT Astra. Audio production and runtime integration remain separate.

## Current status and navigation — 2026-11-05

- **Production tooling — 2026-11-06:** [Safe CLI and usage](../../scripts/voice/PRODUCTION.md), [API recon / technical handoff](../research/v1-revival/2026-11-06--fish-production-handoff.md), and [159-order queue](../research/v1-revival/2026-11-06--fish-production-queue.md). Offline preparation and mocked transport tests only; no generation, listening approval or registry changes. npc-069 owns the frozen 72-order selection; Q90 retains its original 87 orders.
- [Author-approved casting](#npc-voice-map) — latest author decisions; historical speaker aliases are not runtime assignments.
- [Implemented runtime / asset / QC / recording status](#implementation-and-recording-status) — independently verified facts.
- [Q90 approved recording texts](../research/v1-revival/2026-11-04--q90-fish-audio-script.md) · [Named NPC draft script](../research/v1-revival/2026-11-05--named-npc-voice-script.md).
- [NPC Voice Cleanup report and hygiene inventory](../research/v1-revival/2026-11-05--npc-voice-cleanup.md).

## NPC-Voice map

Approved decisions now live in [permanent CASTING.md](../design/npc-voices/CASTING.md).
This anchor remains for historical links; this plan owns implementation only.

## Historical implementation and recording status (before cleanup)

Verified against V1 `main` / `origin/main` `59c6ae15` on 2026-11-05. The permanent casting map records author intent; code remains authoritative for implemented behaviour.

| Layer | Current evidence / gate |
| --- | --- |
| Author-approved casting | Map above. Casual Male Speaker is approved for **male farmer**; the historical issue was mixed recording sources, not rejection of this UUID. Warm Conversational is approved for general middle-aged women. Verify each old file's actual source separately. |
| Implemented runtime assignment | `src/ai/npcVoiceLines.ts` still resolves role/gender/age → general pools, ignores `voiceProfileId` as a speaker constraint and has no named manifest overrides. Q88 is unimplemented; no map assignment is claimed live. Children currently reach adult fallback in code; intended silence/age policy is not implemented. |
| Existing MP3 | 317 donor MP3s, including 109 byte-identical public root copies; 208 donor-only. Another 6 `bak` + 3 `references` MP3s are outside the ledger. Bank filenames/UUID metadata do not prove audible source. |
| QC-approved MP3 | **0**: all 317 ledger rows remain `pending`. Casting approval never promotes a file to `pass`; bank mismatch and context gates remain. |
| Pending recording | Q90: 87 author-approved texts (12 / 54 / 21), no delivered Q90 MP3s. Named packet: 89 drafts, 27 reuse placements (25 files), 10 Q90 references; no extra production order. New mapped UUIDs without donor files need selective future scripts/recording, not automatic pack generation. |

### Runtime identity crosswalk (not a casting implementation)

| Map name | Current `characterKey` | Runtime role / binding |
| --- | --- | --- |
| Marek | `marek_hornblower` | `guard`, reserved |
| Kasia | `kasia_hornblower` | `trader`, reserved |
| Anna | `anna_lesniewska` | `farmer`, reserved; Woodward is an editorial alias |
| Piotr | `piotr_lesniewski` | `woodcutter`, reserved; Woodward is an editorial alias |
| Molly | `molly_lambert` | `shepherd`, guaranteed home resident |
| Piers | none | Farmer is author-approved direction; no runtime key/resident/story binding. Preserve editorial ID `piers`; do not invent a key. |
| Jakub | `jakub` | `hunter`, guaranteed home resident; Jacob is an editorial alias |
| Kazimierz | `kazimierz` | Elder is narrative function; initial `farmer` baseline may be reassigned by staffing; no `elder` Role |
| Archibald | `archibald` | Known identity key; no inspected live resident binding |
| Patric | `patric_smith` | Known key, intended blacksmith in a larger settlement; not yet bound |
| Rudolf | `rudolf` | Reeve office identity; existing adult's role preserved or fallback `farmer`; voice undecided |

Sources: [`characters.ts`](../../src/ai/characters.ts), [`homeAuthoredResidents.ts`](../../src/settlement/homeAuthoredResidents.ts), [`npcVoiceLines.ts`](../../src/ai/npcVoiceLines.ts). `Elder`, `Middle`, `Old`, `Child` are editorial map labels, not new runtime enum values or chosen age thresholds.

## Historical design and decision record

The sections below preserve the original plan, counts and dated listening history. **Casting lists, role candidates, child-speaker availability and recording estimates below are superseded wherever they differ from the current map/status above.** The map does not define new hashing weights, fallback eligibility or age-transition mechanics. Keep the earlier equal-weight direction only within eligible candidates; do not reinterpret it as permission to draw from every mapped voice.

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

A **speaker** = one Fish voice UUID ([donor catalog §Voice sources](../design/npc-voices/CATALOG.md#voice-sources)). Counts = files on disk (V1 `public/` primaries + staged donors). ✓n = clips for that intent; — = none. "Live" columns only.

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

**Historical candidate table — superseded by the current map.** In particular Brian is globally blocked, named casts take precedence, Cowboy belongs to generic hunters, Casual to male farmers, Rick to fishers; Hannah is Molly’s named cast, not the approved generic female voice. No unresolved map slot gains an automatic assignment from this old table.

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

Dev-only tool, not a runtime/package dependency: `scripts/voice/voice-qc-ledger.py` (Python + `faster-whisper` `small.en`, CPU) over canonical V1 `public/sounds/voices/*.mp3` and archived excluded-speaker recordings, resolved by the migration inventory → `docs/assets/voice-qc/ledger.json`, one row per file:

`file`, `gitBlob`, `speaker` (catalog UUID → speaker id; `shepard_` typo mapped explicitly), `intent`, `catalogText`, `asrText`, `wer` (normalized), `durationSec`, `auto` (`match` ≤ 0.15 WER / `mismatch` / `unreadable`), editorial tags (`roles`, `weatherWord` rain/snow/storm/none, `claims` e.g. species/time/forecast, `humor`), `author` (`pass`/`fail`/`unheard`), `verdict`.

- ASR proves *which words were spoken*, not taste or pronunciation. The author does **not** listen to all 317 files: (a) one casting round per speaker, 3 representative clips each (≈ 39 clips) → speaker accept/reject; (b) every `mismatch` row; (c) Mark's 6 clips.
- `verdict = pass` ⇔ speaker accepted ∧ (`auto = match` ∨ author confirmed actual text, which then replaces `catalogText`) ∧ editorial tags set ∧ no unsupported claim (audit F02/F09: e.g. general male “Wolf! Everyone, watch out!” fails for generic `danger_alert`).
- CPU cost ≈ minutes; **do not run while a benchmark is in progress** (WSL shares the host CPU).

### 5. Donor import

Storage migration is complete: retained recordings are canonical under `public/sounds/voices/`; excluded speakers are archived. Only separately QC-passed clips may be newly registered in runtime (same filenames; no automatic registration). Update `docs/assets/SOUNDS.md` (S29) and the V1 catalog `docs/design/npc-voices/CATALOG.md` (`in_repo`, speaker, QC ref). No re-encoding.

### 6. Prioritized missing-recording list (after reuse)

**S5/Q90 editorial and 87-take Fish Audio script author-approved 2026-11-04; recordings/QC/integration not complete.** [Current audit](../research/v1-revival/2026-11-04--q90-npc-voices-editorial-audit.md) and [recording script](../research/v1-revival/2026-11-04--q90-fish-audio-script.md) supersede the provisional counts below for production review: **87 proposed takes (P0 12 / P1 54 / P2 21)**, **72 conditional reuse candidates**, **0 ledger-passed clips**. Includes [explicit dispositions for all 81 Q31/catalog proposals](../research/v1-revival/2026-11-04--q90-supersession.md). The three 2026-11-04 male targets have no existing recordings. Coverage counts here are historical Q90 scope, not a complete 2026-11-05 map inventory; zero files are QC-approved. No source, canonical transcript, audio or QC verdict changed. The following table is the historical S5 estimate, not a current recording order.

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

## Historical casting decisions

The complete dated author listening and casting record moved to
[CASTING.md](../design/npc-voices/CASTING.md). Global exclusions remain in force.
