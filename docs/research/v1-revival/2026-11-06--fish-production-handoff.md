# Fish Audio production preparation — technical handoff

**Date:** 2026-11-06 · **Baseline:** V1 main `e1b93d97`.
**Scope:** tested offline tooling, no API synthesis, audio production, listening
approval, casting change or runtime integration.

[Usage and safety contract](../../../scripts/voice/PRODUCTION.md) ·
[Deterministic queue](2026-11-06--fish-production-queue.md) ·
[npc-069 selection owner](../../plans/npc-069-next-fish-audio-production-batch.md) ·
[npc-065 tooling/QC owner](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md).
This extends their existing ownership; no competing production/runtime plan.

## Current source reconciliation

| Production/control category | Verified rows | Treatment |
| --- | ---: | --- |
| Q90 approved orders | 87 | P0 12, P1 54, P2 21 |
| npc-069 ready-to-order + record | 72 | P0 67, P1 5; 28 NV + 37 N69 + 5 QV + 2 restorations |
| npc-069 Q90 references | 12 | Owner/UUID/input/transcript/filename checked; zero extra jobs |
| npc-069 selected existing reuse | 33 | Current files and SHA256 checked; text accepted, final audio QC pending |
| npc-069 binding-held | 3 | Excluded |
| npc-069 restoration-held | 5 | Excluded |
| npc-069 deferred-optional | 7 | Excluded |
| npc-069 total control records | 132 | Coverage matrix is separately 115 slots |
| Unique executable recording identities | **159** | No duplicate IDs, filenames or exact UUID/input pairs |

No matching new output filenames were found in the current public voice bank or
donor archive. No local production attempt was created. This is evidence for the
checked inventory, not proof that the author has no unreported downloads. Pass
external delivery folders through `--inventory` before ordering. November 5 totals
remain current; all 33 selected retained hashes match. The later text-equivalence
acceptance (29 normalized matches, four accepted differences) does not commission
regeneration and does not become final listening approval. No new writing is needed.

Both manifests and all original row fields survive normalization, including source
references, context restrictions and runtime holds. QV-004 may be recorded under
the frozen package, but remains gameplay/binding-held. The three held Molly quest
rows are never ordered. Q90's original role, weather and relationship restrictions
remain attached even where npc-069 adds a narrower placement.

## Official API recon

Checked public official documentation without authenticating an account. The
[documentation index](https://docs.fish.audio/llms.txt) and
[agent quickstart](https://docs.fish.audio/developer-guide/resources/agent-quickstart)
route to REST and SDK docs. The requested `.md` quickstart returned an unsupported
Markdown content type in the browser tool; the canonical rendered page supplied
the content. The [OpenAPI schema](https://docs.fish.audio/api-reference/openapi.json)
was inspected at `/v1/tts`, its model enum, request schema and response.

The supported adapter is `POST https://api.fish.audio/v1/tts`, JSON with Bearer
authentication from `FISH_API_KEY`; existing approved voice UUIDs go in
`reference_id`. The `model` header selects synthesis, independently of that UUID.
Formats include MP3, WAV, PCM and Opus. This CLI fixes MP3/44.1kHz/128kbps,
`latency=normal`, `temperature=0.7`, `top_p=0.7`, `chunk_length=300`, and
`normalize=false` to avoid server text normalization. The API also exposes prosody
and chunk/token controls. No delivery tags, reference cloning or pronunciation
substitutions are added. [Endpoint reference](https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech).

The official Python distribution is `fish-audio-sdk`; modern imports use
`fishaudio.FishAudio`, with `client.tts.convert()` and `reference_id`. Older
`fish_audio_sdk` APIs still exist; SDK defaults and REST defaults can differ.
We use stdlib REST to avoid a new dependency or implicit SDK retries/defaults.
[Official Python SDK](https://docs.fish.audio/api-reference/sdk/python/overview).

Documented models include `s2.1-pro`, `s2.1-pro-free`, `s2-pro`, `s1`, and
`drama-3` (the endpoint/schema is more current than parts of the overview).
The server falls back to a paid default on unknown/omitted model values; CLI
choices and explicit selection prevent accidental typos. S1 retires December 31,
2026 and then requests naming it are served by S2.1-Pro. A model name therefore
does not pin immutable weights. Web and API expose the platform's voice features,
but documentation does not guarantee byte-identical synthesis or unchanged
historical timbre. Never assume an old approved profile sounds identical on every
model. Tags differ between generations; this pipeline keeps plain approved input.
[Models](https://docs.fish.audio/developer-guide/models-pricing/models-overview),
[TTS guide](https://docs.fish.audio/features/text-to-speech).

Public pricing currently measures TTS input in UTF-8 bytes: S2/S1 paid models
$15/M bytes; the free model $0 subject to fair use; Drama 3 lists $50/M with a
$10/M launch offer through November 30, 2026. The frozen 159 inputs total
**5,810 UTF-8 bytes**: nominal **$0.08715** at $15/M for one successful request
per ID, excluding retries or changed billing terms. This is an estimate, not a
wallet quote. Concurrency tiers are 5 (<$100 prepaid), 15 (≥$100), 50 (≥$1,000),
or enterprise. Explicit 429 responses warrant exponential backoff; native API
429 may omit Retry-After. Execution here is serial and retries 429 only when
explicitly configured. Other failures retain reservations for reconciliation.
[Pricing and rate limits](https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits).

The ordinary TTS 200 response in OpenAPI is chunked audio; no stable recording ID,
idempotency key or guaranteed retrieval/recovery handle is specified. This CLI
owns local recording identity and stores `x-request-id` only if present and safe;
that optional header is diagnostic, not a promised provider recording ID. No
automatic replay follows lost responses, partial output, 5xx or interrupted runs.
[OpenAPI response contract](https://docs.fish.audio/api-reference/openapi.json).

## Requires account verification before synthesis

Account verification/key issuance and API credit are distinct from existing
web recordings. Paid models can return 402 without API credit. Confirm actual
wallet, tier, model availability and exact voice access on the author's account.
`GET /model/{id}` can supply model details but was **not called** here; it cannot
replace an audition. Confirm that every approved historical UUID is still
available and permitted for this account/model; do not silently clone, substitute
or recast unavailable voices. [Account setup](https://docs.fish.audio/developer-guide/getting-started/quickstart),
[Get Model](https://docs.fish.audio/api-reference/endpoint/model/get-model).

The public Terms distinguish noncommercial free use and commercial paid use,
and require respect for others' rights. Project casting approval does not establish
provider licensing or consent. Confirm current account/voice permissions and
commercial rights before intended game distribution, particularly for profiles
named after recognizable characters or people; no rights were verified here.
[Fish Terms](https://fish.audio/terms/).

## Before production and admission

1. Reconcile external delivered outputs, preserve a persistent staging root and
   review the offline queue. No held/reuse/deferred rows enter generation.
2. Confirm account/voice permissions and current API/model/cost behavior. Obtain
   author authorization for a specific one-recording test and explicit model.
3. Audition the test against approved voice references. Retain exact model,
   source, parameters, input, hashes and attempt events. Expand only with separate
   authorization; multi-model exploration also requires explicit scope.
4. Decode every new staged MP3, check actual words/context, cutoff/artifacts,
   pronunciation/delivery and same-speaker identity. The installed environment
   has no ffmpeg/ffprobe; stdlib frame checks are only basic structure evidence.
5. Record content-bound final QC through npc-065. Admission, live registry,
   stable casting resolver, displayed/spoken pairing and quest binding are
   separate work. Never infer these from a successful request or import.

The CLI has no reset/force, live-bank write or QC-approval operation. Failure
reconciliation is deliberately manual where billing or output may be ambiguous.
Operator web bindings attest provenance; they do not technically authenticate
the audible voice. Source edits conservatively invalidate staged provenance.

## Verification evidence

Focused synthetic-manifest and mocked-response tests cover real counts, aliases,
exclusion policies, exact input/casting, rejected UUIDs/bytes, duplicate detection,
inventory and reservation safety, response interruption/429/HTTP failures,
manual import, hash/provenance tampering, frame checks and network-free dry-run.

Final local checks:

- `python3 -m unittest discover -s scripts/voice -p 'test_*.py' -v` — **44 passed**
  (28 production tests + 16 existing cleanup/identity tests). All synthesis responses
  were mocked; no authenticated Fish request was made.
- `python3 -m py_compile scripts/voice/voice_production.py scripts/voice/test_voice_production.py`
  and `git diff --check` — passed.
- Full `generate --model s2.1-pro` dry-run — **159 jobs**, no key or staging writes.
  Repeated `plan` output is deterministic; committed queue matches current sources.
- New documentation links resolve. Preflight passed using
  `node --import tsx scripts/claude/pre-implementation.ts npc-069`; the ordinary
  `pnpm claude:preflight npc-069` wrapper was blocked by sandbox IPC `EPERM`.

No TypeScript/runtime files changed, so application type-check/build/browser checks
were not used as evidence for this Python tooling task. Audio decoding, listening,
actual API/account access and runtime integration remain unverified.
