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

Mapping evidence is in `voice-identity-map.json`: donor catalog for historical
bank identities, production notes for alternate male candidates, npc-065 for
Old man/woman and Little Lem. KID has no established UUID and is reported as an
unmapped reference. Historical bank UUIDs are expected sources, not current NPC
casting assignments. This tool never imports the Whisper generator.

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
/tmp/seedvale-identity-venv/bin/python scripts/voice/voice-identity-qc.py --policy docs/assets/voice-qc/identity-policy.json --output docs/assets/voice-qc/identity-audit.json
python3 scripts/voice/voice-identity-report.py docs/assets/voice-qc/identity-audit.json docs/assets/voice-qc/IDENTITY-AUDIT.md
```

`referenceChecks` contains leave-one-content-out reference scores, with singleton
voices explicitly missing their own reference. The local policy only labels
review priorities; do not transfer these bounds to another model/reference set.
