# CPU speaker identity QC

Run from the repository root (Python 3.12; no CUDA or paid API):

```sh
python3 -m venv /tmp/seedvale-identity-venv
/tmp/seedvale-identity-venv/bin/pip install -r scripts/voice/identity-requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
python3 -m unittest discover -s scripts/voice -p 'test_voice_identity*.py'
/tmp/seedvale-identity-venv/bin/python scripts/voice/voice-identity-qc.py --sample docs/assets/voice-qc/identity-sample.json --output docs/assets/voice-qc/identity-calibration.json
```

Omit `--sample` for the full ledger, **only after reviewing calibration**. Default
cache/model location is ignored `_temp/voice-identity`; `--cache` overrides it.
The pinned model revision, installed library versions and decoding recipe scope
content-hash caches. MP3 decoding uses PyAV (no system FFmpeg needed), mono 16kHz,
full clips without VAD; inference uses CPU with two threads by default.

Bank/reference mapping evidence is in `voice-identity-map.json`: donor catalog for historical
bank identities, production notes for alternate male candidates, npc-065 for
Old man/woman and Little Lem. KID has no established UUID and is reported as an
unmapped reference. Historical bank UUIDs are expected sources, not current NPC
casting assignments. This tool never imports the Whisper generator.

Per-recording expectations live in `voice-identity-overrides.json` (override path
with `--overrides`). Each entry requires a ledger `gitBlob`, UUID or explicit
null, evidence, and status (`historical-verified`, `author-confirmed`, or
`unresolved`). Overrides precede the ledger; null blocks fallback and classifies
as `unresolved-expected`. Unlisted files fall back to the original bank mapping.
Unknown ledger speakers also remain unresolved. Stale content bindings, unknown
UUIDs and unknown filenames fail validation. Add corrections to JSON, not Python;
retain original ledger `voiceId`, exposed as `ledgerVoiceId` in audit rows.
Filename age, matching transcript and embedding winner alone are not proof.
See [the mapping review](../../docs/assets/voice-qc/IDENTITY-MAPPING-REVIEW.md)
for the 13 age exceptions and unresolved historical British-female candidates.

Every eligible reference/target cosine is retained. Identical content is excluded
before averaging scores per UUID, including an identical target renamed in the
reference set. Reference duplicates for the same UUID count once. Best-to-second
margin is across UUID means, not takes. A missing expected reference is explicit;
no default threshold, probability or defective-file verdict is assigned.

The JSON retains audio/ledger/mapping hashes, model revision, library versions,
reference inventory, exclusions, errors, CPU seconds, wall time and peak RSS.
Resource metrics include model initialization and decoding; wall time includes
model download on a cold run. Existing ASR and author verdicts remain untouched.

After reviewing the calibration gate, reproduce the full triage and Markdown:

```sh
/tmp/seedvale-identity-venv/bin/python scripts/voice/voice-identity-qc.py --policy docs/assets/voice-qc/identity-policy.json --output /tmp/seedvale-identity-current.json
python3 scripts/voice/voice-identity-report.py docs/assets/voice-qc/identity-audit.json docs/assets/voice-qc/IDENTITY-AUDIT.md
```

For a mapping-only rerun, add `--cache-only` to the QC command: it recomputes all
scores/classifications from existing version-scoped embeddings and fails a cache
miss without loading the model. Schema v2 records the override file hash,
per-row evidence/status, original ledger voiceId and whether the model initialized.

Author decisions are now owned by
[`author-decisions.json`](../../docs/assets/voice-qc/author-decisions.json), bound
by filename and historical Git blob. Disposition (`keep` / `replace` / `pending`)
is separate from `speakerAssessment`, expected-identity overrides and transcript
QC. The seven empty unresolved-age cells mean keep; other empty cells remain
pending. The original `?`, `guard?`, `REMOVE` and speaker comments remain evidence.
The renderer can reconstruct Markdown from scratch and preserves decisions across
classification changes. Conflicting Markdown edits, stale bindings, incomplete
coverage or malformed/duplicate rows fail before writing. Edit structured author
evidence explicitly when a new author decision arrives; neither identity nor
transcript verdicts are inferred from disposition.

The [replacement backlog](../../docs/assets/voice-qc/regeneration-backlog.json)
records removed paths, original blobs, SHA256, texts and integration gates.

## Migrated storage and historical evidence

Canonical retained audio lives in `public/sounds/voices/`; source storage is not
a runtime/QC admission. `voice_assets.py` resolves each historical bank recording
through [migration-inventory.json](../../docs/assets/voice-qc/migration-inventory.json).
The 38 globally excluded Brian British bank files are archive-only. Six unique
backups and 38 named reference paths are in `docs/archive/voice-donor/`. Exact
reference duplicates are relative symlinks; use a Git checkout preserving symlinks
or materialize their target bytes when transporting evidence.

The committed audit/ledger are historical snapshots. Their original presence flags,
source paths, expected identities and scores remain evidence, not live availability.
Historical audit config hashes resolve to exact archived files under
`docs/archive/voice-donor/qc-config-2026-11-05/`; current config changes paths only.
The identity CLI refuses to overwrite the historical audit. On a new `--output`,
retained audio is checked/extracted normally; 14 removed rows reuse their original
scores with `historicalEvidence: true` and `audioAvailability: removed-author-decision`.
This is not a fresh identity assessment of absent audio. Render historical Markdown
from the committed audit and current decisions as shown above.

The ASR generator resolves all 303 retained bank recordings (265 canonical + 38
archived), preserves all 317 original cached ledger rows byte-for-byte, and retains
authorized removed rows. Neither regeneration tool writes author-decisions.json.
For historical extraction of deleted audio, recover by exact commit/path/hash from
[deletion-manifest.json](../../docs/assets/voice-qc/deletion-manifest.json) into a
separate temporary checkout. Never restore rejected takes to the playable tree.
