# NPC Voice Cleanup — 2026-11-05

**Scope:** Documentation and dependency audit on V1 `main` `59c6ae15`; no files removed, no runtime or MP3 changes. [Current author-approved casting](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md#npc-voice-map) is the single casting authority. Q90's 87 exact approved takes and the named packet's 89 draft texts retain their recording IDs, filenames and transcripts. Historical decisions remain in the source documents and Git.

## Resolved contradictions

| Earlier statement | Current interpretation |
| --- | --- |
| Kasia's Expressive Female UUID was only a candidate; Anna and Piotr were uncast; Hannah was only a Molly candidate; Piers had no voice. | The 09:30 map approves Kasia, Anna/Laura, Piotr/Country Baritone, Molly/Hannah and Piers/Warm Male Friend. Piers still has no V1 `characterKey`; his farmer role is author direction, not implemented staffing. |
| Casual Male Speaker was held as a defective bank; Warm Conversational had a blanket casting hold. | Casual is approved for generic male farmers, Warm Conversational for general middle-aged women. Different source recordings were mixed in the old banks. Each MP3 still needs its own source, transcript, context and listening QC; neither UUID is globally rejected. |
| Dramatic was a possible guard/blacksmith; Cowboy possibly Jacob; Hetalia role/gender and Laura source were unresolved as casting. | Patric→Dramatic, generic male hunter→Cowboy, Jakub→Arthur, male shepherd→Hetalia, Anna→Laura. Old donor-file provenance and bank mismatch gates still require investigation. Guard-specific Q90 text does not become Patric's blacksmith speech by changing a label. |
| Rick was a general alternative and Little Lem/child voice choice was open. | Rick is assigned to generic male fisher; Little Lem is selected for boys. Age transition, girl voice, runtime binding and audio QC remain open. |
| Q90 JSON still said proposal awaiting approval; named packet rows used casting holds. | Q90 author approval is reflected in script metadata without changing its 87 texts, UUIDs or recording identifiers. Named rows now reference map UUIDs; text-approval, per-file QC and missing-binding gates remain. Dated audit bodies are marked as historical evidence. |

## Independent states

| State | Current finding |
| --- | --- |
| Author-approved casting | Map in npc-065. `?` slots and Rudolf remain undecided. |
| Implemented runtime assignment | `src/ai/npcVoiceLines.ts` still uses role/gender/age pools with general fallback. It ignores `voiceProfileId` as a speaker constraint. Q88 has not landed. |
| Existing MP3 | 317 ledger files: 109 public root copies and 208 donor-only. Six extra `bak` and three `references` files are outside the ledger. No Q90 proposed filename is in the public root. |
| QC-approved MP3 | 0. All 317 ledger `verdict`s are `pending`; ASR match and voice selection do not imply a pass. |
| Pending recording | Q90 87 author-approved takes; named script 89 draft takes, 27 reuse placements covering 25 unique MP3s, and 10 existing Q90 references. New map voices with no existing bank require a later selective script. |

## Repository hygiene and dependencies

| Classification | Paths / finding | Reason and deletion prerequisite |
| --- | --- | --- |
| KEEP | `docs/v3-donor/voices/mp3/` (317), `public/sounds/voices/*.mp3` (109), `docs/assets/voice-qc/`, Q31/Q90 scripts and JSON, named script and QC packet, `scripts/voice/voice-qc-ledger.py` | Donor provenance, existing runtime files, QC evidence and approved text/IDs. Q88/Q89/Q40 need the catalog, ledger, scripts and exact audio; no bulk cleanup. Public/donor duplicate bytes are intentional staging, not disposable duplicates. |
| KEEP | `docs/dialogue/NPC-VOICE-CATALOG.md`, `docs/v3-donor/voices/docs/NPC-VOICE-CATALOG.md`, `docs/v3-donor/voices/docs/fish-generation-history-2026-10-09.json` | V1 working catalog and V3 donor provenance have different owners; generation history aids source investigation. Neither is a second current casting authority. |
| ARCHIVE | `docs/v3-donor/voices/docs/voice-production-notes.md` and older V3 audio plans/review | Preserve historical casting impressions and production context. Mark dated casting statements as superseded when cited; no move needed in this session. |
| NEEDS INVESTIGATION | `public/sounds/voices/bak/` (6 MP3) | Unique bytes relative to both root and donor files. Names overlap live manifest/catalog and named reuse/Q90 references, but nested paths are not current manifest URLs. Determine original source, intended backup role and exact dependency before any removal. |
| DELETE CANDIDATE | None validated | A name match or missing runtime reference is insufficient evidence to delete audio. Reassess only after Q88/Q89/Q40 dependency review and asset provenance check. |

The QC generator reads the flat donor MP3 directory and the donor catalog; it is current for inventory/ASR but does not automatically confer author verdicts. The Q31 and Q90 generation scripts are historical/approved production records, not stale disposable scripts. No tracked temporary voice artifacts or ignored voice workspace files appeared in the scoped Git status. The three `references` files are possible future delete candidates **only after** provenance and use are resolved; they are not validated deletion targets today.

## Decisions still needed

Rudolf's named voice and the `?` profession slots (female farmer, male woodcutter/trader/blacksmith); girl voice and child-to-adult transition policy; source and transcript QC for existing files including mixed-source Casual/Warm and Laura/merchant banks; optional binding of Piers, Archibald and Patric in runtime; author review of 89 named draft texts. Q88/Q89/Q40 are implementation work outside this cleanup.

## CPU speaker identity evidence — 2026-11-05

The incremental [identity audit](../../assets/voice-qc/IDENTITY-AUDIT.md) and
[27-take calibration](../../assets/voice-qc/IDENTITY-CALIBRATION.md) compare pinned
SpeechBrain ECAPA embeddings against named Fish history references. Raw cosine
scores, reference exclusions and resource measurements are preserved separately
from the Whisper ledger. These findings prioritize manual source review; they do
not change casting, transcript QC, author verdicts or authorize MP3 removal.
[Reproducible CPU CLI](../../../scripts/voice/IDENTITY-QC.md).
