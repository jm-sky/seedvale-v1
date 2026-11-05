# npc-069 — Content-bound ASR text acceptance (33 reusable files)

**Date:** 2026-11-05 · **Status:** 33/33 accepted for **transcript/semantic equivalence only**. This is **not** a listening, speaker-identity, production-asset or runtime QC pass.

[Structured per-file evidence](npc-069-text-acceptance.json) · [Production selection](../../research/v1-revival/2026-11-05--npc-069-production-package.md) · [Historical ASR ledger](ledger.json) · [Historical speaker identity audit](IDENTITY-AUDIT.md)

## Author policy

Small differences between Whisper ASR and canonical scripts are **acceptable**, even if they reflect a minor actually spoken variation, provided the intended meaning, event and context stay the same. Do not spend manual listening effort or commission regeneration solely to resolve those differences. Punctuation/case changes and equivalent contractions pass automatically.

**Reviewed subset:** exactly 33 `reuse-QC-pending` records selected in the frozen npc-069 production manifest. Source identity is bound to original `gitBlob` and `sha256` on every row; a replaced/re-encoded file requires new assessment. No source files, historical ledger, authoritative author decisions or voice registry were changed.

| Text result | Files |
| --- | ---: |
| Exact words after case/punctuation normalization | **29** |
| Minor semantically equivalent difference, accepted | **4** |
| Material mismatch needing text review | **0** |
| **Text accepted** | **33 / 33** |

## Four non-identical wordings, all accepted

| NPC / recording | Canonical | Historical ASR | Reason |
| --- | --- | --- | --- |
| Marek / `npc_mark_hornblower_farewell_01.mp3` | “will you” | “will ya” | Spoken contraction |
| Kasia / `merchant_female_quest_accepted_02.mp3` | “I knew you looked dependable” | “I know you look dependable” | Minor tense change; positive meaning unchanged |
| Anna / `merchant_female_b_combat_start_02.mp3` | “I don't want a fight” | “I don't want to fight” | Equivalent defensive intent |
| Molly / `general_female_b_attention_01.mp3` | “over here” | “overhear” | Likely word-boundary ASR mistake |

The complete original and ASR transcripts, filenames, source blobs, hashes, selected characterKeys and explicit reasons are in the JSON. Avoid repeating transcript QC for these **unchanged** files unless later evidence contradicts these findings.

## Boundaries and remaining gates

- **Speaker identity:** a separate embedding comparison exists. It remains probabilistic; `strong-match` is not final listening approval, and some selected clips (e.g. Marek danger, Molly danger) were historically `ambiguous`. Use the existing identity audit and author source decisions, not this text acceptance to resolve those.
- **Sound quality:** no one listened to these 33 clips during this review. Artifacts, delivery, pronunciation and clipping are not evaluated.
- **Context and runtime:** selected semantic intents and restrictions remain as in the npc-069 manifest; `npc-065`/Q88 governs same-speaker resolver and subsequent registration. This document never auto-admits an MP3.
- **ASR uncertainty:** this is a documented acceptance of minor differences, not proof that Whisper output is a faithful verbatim transcript. Exact displayed/spoken wording policy in UI integration must respect the reviewed semantic-equivalence allowance and any separately agreed strict display fidelity.

**Next useful step:** apply identity evidence specifically to these 33 files, then limited audio listening on low-confidence files; no need to rerun full 317-file ASR to resolve minor differences.
