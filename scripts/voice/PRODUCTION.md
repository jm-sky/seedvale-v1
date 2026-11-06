# Fish Audio production CLI

Python 3.10+ standard library only. Run from the repository root. Owned by
[npc-065](../../docs/plans/npc-065-stable-npc-voice-casting-and-donor-qc.md)
for tooling/QC and [npc-069](../../docs/plans/npc-069-next-fish-audio-production-batch.md)
for frozen selection. [Technical recon and remaining gates](../../docs/research/v1-revival/2026-11-06--fish-production-handoff.md).

## Offline preparation

```bash
python3 scripts/voice/voice_production.py validate
python3 scripts/voice/voice_production.py plan --json > /tmp/seedvale-voice-queue.json
python3 scripts/voice/voice_production.py generate --model s2.1-pro > /tmp/seedvale-voice-dry-run.txt
```

All three are offline. `generate` defaults to dry-run and never reads the API
key or creates staging files unless `--execute` is supplied. A model is required
even for dry-run. Text goes to `text` unchanged; the frozen UUID goes to
`reference_id`. Delivery cues are preserved as provenance, never added to input.

Filters combine by intersection:

```bash
python3 scripts/voice/voice_production.py plan --batch npc-069 --priority P0
python3 scripts/voice/voice_production.py plan --speaker marek_hornblower
python3 scripts/voice/voice_production.py plan --recording-id Q90-001 --recording-id Q90-003
```

`--speaker` accepts the exact normalized speaker key or Fish UUID. Q90 uses its
original profile key; npc-069 uses characterKey or generic role. IDs are always
original: the two female restoration IDs **include `.mp3`** despite their new
`n69_restore_` output filenames. Q90 aliases do not become npc-069 jobs when
filtering by batch; they remain Q90-owned orders with extra context in `aliases`.

The inventory check scans the public voice bank, donor archive, staging and any
`--inventory /external/delivery/folder` roots. Any matching output filename blocks
an order for reconciliation; it never proves the file's identity or QC. Provide
all delivery folders and retain the same staging root between runs. Unavailable
offline/web outputs cannot be detected without their inventory.

## One later authorized test

**No generation is authorized by this guide.** After the author separately
authorizes one specific ID/model, use a persistent, backed-up directory outside
the repository. Avoid `/tmp` for real production. The default temporary staging
path is for read-only planning; writes require an explicit `--stage`.

Load `FISH_API_KEY` from the environment or a secret manager. For an interactive
Bash session, this keeps the value out of command history:

```bash
read -rsp 'Fish API key: ' FISH_API_KEY
export FISH_API_KEY
python3 scripts/voice/voice_production.py generate --recording-id Q90-001 --model s2.1-pro --stage /persistent/seedvale-voice-staging
# Only after separate authorization for precisely this recording/model:
python3 scripts/voice/voice_production.py generate --recording-id Q90-001 --model s2.1-pro --stage /persistent/seedvale-voice-staging --execute
unset FISH_API_KEY
```

No endpoint override, credential file, SDK dependency or automatic model fallback
exists in this CLI. Supported model choices reflect documentation checked during
recon; refresh that research before later production. A recognized server model
name is not an immutable model-version pin.

Future separately authorized bulk work additionally requires `--bulk`.
Execution is serial and stops at the first failure. There is no hidden retry.
`--retries 1` or `2` permits exponential backoff **only for explicit HTTP 429**.
401/402/other errors stop; timeouts, disconnections, 5xx, invalid responses and
interruptions are treated as ambiguous. Redirects are refused.

Every request first reserves its ID directory, saves frozen provenance, and
fsyncs an `in-flight` event. Partial response bytes remain in `response.partial`.
Validated media and receipts publish atomically without replacing files. The
append-only events preserve request state, including an optional diagnostic
request header ID. Filesystem failures may leave only the reservation or an
earlier event; that still blocks another request.

Reruns block every reserved ID, including failed/ambiguous attempts. After inspecting
the full plan, `--only-orderable` explicitly skips those IDs and inventory
collisions to continue unrelated jobs. It never retries blocked IDs. Keep backups:
deleting/changing the staging root loses the attempt history. There is deliberately
no reset, force or automatic ambiguous-request reconciliation command. Resolve
provider billing/output evidence first, preserve the old attempt outside the
active root with a documented cross-reference, and obtain explicit authorization
before any replacement attempt. This CLI cannot supply exactly-once remote billing.

## Import a website-generated MP3

First get the canonical job from `plan --json --recording-id <original-ID>`.
Create a **credential-free**, operator-attested binding JSON outside the repo:

```json
{
  "recording_id": "<exact job recording_id>",
  "job_sha256": "<exact job job_sha256>",
  "voice_uuid": "<exact job voice_uuid>",
  "generation_input": "<exact job generation_input, including whitespace>",
  "sha256": "<SHA256 of the downloaded bytes>",
  "operator": "<person confirming the source>",
  "source_reference": "<Fish web project/history ID or local capture reference>",
  "generated_at": "<actual generation time>",
  "model": "<actual web model, or explicit unknown-with-reason>"
}
```

```bash
sha256sum /downloads/fish-download.mp3
python3 scripts/voice/voice_production.py import --recording-id Q90-001 --file /downloads/fish-download.mp3 --binding /downloads/binding.json --stage /persistent/seedvale-voice-staging
python3 scripts/voice/voice_production.py verify --stage /persistent/seedvale-voice-staging > /tmp/seedvale-voice-qc-handoff.json
```

Import checks identity fields, exact input, source evidence, hash and media
structure. It rejects historical author-rejected bytes and never overwrites
an attempt or MP3. Binding is human attestation, **not** cryptographic proof of
audible speaker identity. A misleading filename, catalog UUID or supplied binding
cannot substitute for source/listening QC. Conflicting existing attempts need
manual reconciliation before import, too.

## Verification and QC

`verify` checks complete MPEG Layer III frames, tags, sample rate, channel count,
duration, hashes, immutable-source metadata and receipts. It reports incomplete
attempts explicitly, and fails on missing/tampered completed media or stale
provenance. No ffmpeg/ffprobe executable is installed in this session; the bounded
stdlib checker does **not** decode frames or prove speech completeness. Unsupported
tag/layout cases are rejected for investigation; they are never silently repaired
or re-encoded. It may conservatively reject otherwise playable files.

The machine-readable handoff retains `qc: pending` and
`listening_approved: false`, source hashes, exact transcripts, UUID, context gates,
media paths and attempt states. New output requires decoding, transcript/context,
identity/delivery/artifact checks and explicit final admission under npc-065.
Existing ledger/identity tools remain historical evidence owners; this command
does not rerun them or write their decisions. The 33 unchanged reusable files
are hash-checked through `voice_assets.evidence_path`; their existing text acceptance
is preserved. No operation writes the live bank, registry, gameplay or historical QC.

```bash
python3 -m unittest discover -s scripts/voice -p 'test_*.py' -v
```

Use one trusted local producer/staging filesystem; reservation directories guard
concurrent CLI runs, not hostile local tampering. Reports contain dialogue and
provenance, never authentication headers, remote error bodies or full response
headers. Do not put credentials in import evidence. A CLI failure exits nonzero;
inspect input filters, `plan` availability and retained events before proceeding.
