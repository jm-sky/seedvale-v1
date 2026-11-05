# Expected speaker mapping review — 2026-11-05

## Findings and evidence boundaries

The original resolver used only ledger `voiceId`, inherited from catalog bank-level defaults. The catalog labels the age entries as heuristic prompt recovery, not filename/listening verification. The Fish generation-history JSON contains 134 phrases, without generation-to-file UUID associations. Neither it nor a current NPC casting table establishes which speaker generated an individual historical recording. The ledger and transcript QC remain unchanged.

All 13 age-specific files in the 317-row ledger are enumerated below. Two have byte-identical named references (verified by Git blob and SHA256); one has an explicit author identity decision. Ten remain unresolved. The filename is an age hint only. Embedding winners, ASR phrase matches and shared phrases do not establish a historical UUID. In particular, the KID reference repeats the young greeting phrase but has no known UUID; young recordings are not assigned wholesale to Little-Lem.

## Per-recording expectations

[Editable, content-bound overrides](../../../scripts/voice/voice-identity-overrides.json) record UUID/null, status, ledger Git blob, evidence and rationale. `historical-verified` means a byte-identical named reference; `author-confirmed` preserves an author identity decision without asserting historical generation metadata. Null blocks the ledger fallback. No unresolved candidate is promoted automatically.

| Recording | Corrected Expected | Evidence status | Embedding candidate (not proof) |
| --- | --- | --- | --- |
| general_female_child_farewell_01.mp3 | unresolved | unresolved | Little-Lem |
| general_female_child_farewell_02.mp3 | unresolved | unresolved | Little-Lem |
| general_female_child_greeting_01.mp3 | unresolved | unresolved | Little-Lem |
| general_female_old_farewell_01.mp3 | Old-woman | historical-verified | Old-man |
| general_female_old_farewell_02.mp3 | unresolved | unresolved | Old-woman |
| general_female_old_greeting_01.mp3 | unresolved | unresolved | Old-woman |
| general_male_old_farewell_01.mp3 | unresolved | unresolved | Old-man |
| general_male_old_farewell_02.mp3 | Old-man | historical-verified | Brian-British |
| general_male_old_greeting_01.mp3 | unresolved | unresolved | Old-man |
| general_male_old_greeting_02.mp3 | unresolved | unresolved | Old-man |
| general_male_young_farewell_01.mp3 | unresolved | unresolved | Little-Lem |
| general_male_young_greeting_01.mp3 | unresolved | unresolved | Little-Lem |
| general_male_young_greeting_02.mp3 | Little-Lem | author-confirmed | Little-Lem |

Exact evidence paths and original author decisions are retained in every override and in the generated JSON. The Old-woman and Old-man verified reference SHA256 hashes are respectively `44711c5b0e1f447ab2f4967a2d2c026dad61dffc5243130280a8641db5ea61d9` and `6a56390507c84fe5d5fc1601f1eb664665250bdaa7e0375093ed2cfc6b993822`.

## Before / after

Same model, revision, dependencies, preprocessing, reference inventory, audio contents and policy. Reused 354 cached embeddings, zero extractions; the model was not initialized. All best scores, margins, per-reference cosines and content exclusions are unchanged. Only expected identity, expected score, provenance and derived triage can change. Historical timing/cache evidence remains in Git (`a890e202`); current JSON records this rerun.

| Classification | Before | After |
| --- | ---: | ---: |
| ambiguous | 27 | 22 |
| missing-reference | 0 | 2 |
| strong-match | 276 | 276 |
| suspected-wrong-speaker | 14 | 7 |
| unresolved-expected | 0 | 10 |

Exactly 12 classifications changed:

| Recording | Before | After |
| --- | --- | --- |
| general_female_child_farewell_01.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_female_child_farewell_02.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_female_child_greeting_01.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_female_old_farewell_01.mp3 | ambiguous | missing-reference |
| general_female_old_farewell_02.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_female_old_greeting_01.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_male_old_farewell_01.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_male_old_farewell_02.mp3 | ambiguous | missing-reference |
| general_male_old_greeting_01.mp3 | ambiguous | unresolved-expected |
| general_male_old_greeting_02.mp3 | suspected-wrong-speaker | unresolved-expected |
| general_male_young_farewell_01.mp3 | ambiguous | unresolved-expected |
| general_male_young_greeting_01.mp3 | ambiguous | unresolved-expected |

`general_male_young_greeting_02.mp3` changes Expected to author-confirmed Little-Lem but remains ambiguous under the unchanged policy. The two verified recordings become missing-reference because their sole same-speaker reference is byte-identical and excluded; this is not a new audio defect.

## Historical remaining review (before author disposition decisions)

Seven high-confidence mismatches against the ledger remain; all favor British-female:

- `campfire_female_weather_answer_02.mp3`
- `general_female_agree_01.mp3`
- `general_female_farewell_01.mp3`
- `general_female_greeting_01.mp3`
- `general_female_quest_complete_01.mp3`
- `general_female_quest_declined_01.mp3`
- `general_female_thanks_01.mp3`

The catalog identifies British-female as a previous general-female candidate, so these may be historical bank changes rather than production mistakes. There is no per-recording historical or author confirmation to justify an override. `campfire_female_weather_question_01.mp3` also favors British-female below the score threshold and remains ambiguous. Author listening or generation metadata is required.

The ten unresolved age files above need historical metadata or an explicit author identity decision. The 22 ambiguous clips still require listening; author `guard?` is tentative and `REMOVE` is a disposition, not a speaker identity. Both remain exactly as entered, along with all `?` cells. No transcript QC, final verdict, audio or runtime casting was changed.

## Current disposition decisions and regeneration safety

The author subsequently approved exactly six replacements and seven keeps in
`unresolved-expected`; the seven suspected British-female recordings remain
pending. See [structured author decisions](author-decisions.json), the
[replacement backlog](regeneration-backlog.json) and the
[cleanup report](../../research/v1-revival/2026-11-05--npc-voice-cleanup.md).
Keeping an age-compatible recording does not resolve its historical UUID. The
identity overrides and original 317-row audit/ledger remain unchanged.

The renderer reads separate speaker comments and recording dispositions from
content-bound JSON. It reconstructs reports from scratch, retains comments across
category moves, and rejects conflicting Markdown comments, malformed/duplicate
rows or stale/incomplete structured decisions before writing. Repeated rendering
is idempotent. The old `?`, `guard?` and `REMOVE` cells remain historical evidence;
the separate Disposition column carries the approved action. Speaker identity,
transcript QC and disposition never overwrite one another.
