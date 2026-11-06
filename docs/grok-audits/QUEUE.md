# Grok Audits — Candidate Queue

**Created:** 2026-11-06  
**Gate:** independent workspace review corrections incorporated 2026-11-06; **GA-003 deferred-section, developer-tooling and items/player slices authorized 2026-11-06 and delivered for review; other task IDs remain proposals requiring explicit author approval**.

This is a candidate queue for bounded Grok evidence-gathering in [SeedVale V1](https://github.com/jm-sky/seedvale-v1). See [operating rules](./README.md). `P1`/`P2` express **relative audit research value / scheduling preference only**, not urgency or authorization in the Revival roadmap. At kickoff, check the [Revival session queue](../research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md), [System Review Matrix](../reviews/SYSTEM-REVIEW-MATRIX.md), current code and recent commits; document overlapping Q tasks, matrix IDs, previously commissioned reviews, and excluded unstable paths before proceeding.

| ID | Priority | Candidate investigation | Status | Initial boundaries / acceptance |
| --- | --- | --- | --- | --- |
| GA-001 | P2 | Dead code & unused assets | `proposed` | **Not the first experiment.** Identify candidates, never delete targets; inspect dynamic imports, registries, string lookups, build/runtime asset manifests and entry points before interpreting negative usage searches. No `unused` conclusion from text search alone. |
| GA-002 | P1 | Duplicate implementations | `proposed` | Report concrete overlapping logic with ownership/callsite evidence; distinguish intentional presentation/simulation separation from accidental duplication. No consolidation proposals without validation. |
| GA-003 | P1 | Documentation vs code consistency | `review needed` | **Preferred first experiment.** Check a small, stable documentation slice against source/tests at one pinned SHA. Quote exact disputed claims and show source/test contract, callsites and plausible exceptions. Exclude changing geography/fauna/combat/rendering seams. |
| GA-004 | P2 | Memory & resource lifecycle | `proposed` | One stable **non-rendering** subsystem only; trace allocations, disposal, listeners, cancellation and ownership. Exclude Three.js/GPU resource ownership, terrain/world streaming, LOD, culling and other commissioned Astra rendering/performance scope. Suspected leaks remain hypotheses without reproduction or proof. |
| GA-005 | P2 | Missing tests & contract coverage | `proposed` | Compare an explicitly selected contract against current tests; enumerate meaningful missing cases with source evidence, no speculative blanket coverage percentages. |
| GA-006 | P2 | Error handling & silent failures | `proposed` | Trace bounded async/failure paths and observable consequences; distinguish intended fallback behavior from lost errors. No automatic refactors. |

## Execution and review gates

1. **Independent workspace review** — completed 2026-11-06; identified corrections to first-run choice, evidence standards, overlap records and finding statuses have been incorporated. This is not task approval.
2. **Author approves an individual task** — define exact stable paths/contracts, exclusions, stop conditions, Q-task/review/matrix overlaps and a pinned repository commit SHA. Priority is a *suggestion*, not permission to execute.
3. **Grok writes only an audit report** in [audits/](./audits/README.md), updates indexes/status, and leaves runtime and implementation plans unchanged.
4. **Independent validation** checks each claim against the pinned and relevant current code/tests; mark every finding `confirmed`, `rejected` or `unverified` with evidence and reviewer. Update report/index status separately. No implementation follows automatically.

## First-run experiment

**Candidate:** `GA-003` (documentation vs code consistency), only after explicit author approval of one small, stable documentation/source slice and its pinned commit SHA. Avoid ongoing geography, fauna, combat and rendering work.

For this pilot, record: number of findings; number independently `confirmed`, `rejected` and `unverified`; false-positive share among resolved findings (`rejected / (confirmed + rejected)`, if denominator > 0); meaningful new discoveries; sampled claims missed or left unchecked; scope violations; and approximate reviewer effort. Log the independent reviewer and validation method. Do not impose a numerical pass threshold from one experiment; decide explicitly whether to adjust the queue before subsequent Grok audits.

## Reports

GA-003: [STATE deferred-section pilot](./audits/2026-11-06--GA-003--state-deferred-section.md), pinned `a75dcdfb29cd95d9634f5c87f6943daa428f44be`, `review needed`; 2 unverified findings, no independent validation or implementation approval. Second delivered slice: [developer tooling](./audits/2026-11-06--GA-003--dev-tooling.md), pinned `3c249cb62ddde343be2b654fae43315a484f8054`, `review needed`; 3 unverified findings (F03–F05). First two slices: 5 unverified findings. Third delivered slice: [items / player](./audits/2026-11-06--GA-003--items-player.md), pinned `3c249cb62ddde343be2b654fae43315a484f8054`, `review needed`; 2 unverified findings (F06-F07). Combined: 7 unverified findings, no independent validation or implementation approval. See the [report index](./audits/README.md).

## Change log

- 2026-11-06 — independent Opus validation of F01–F07 at `46636498`: all **confirmed** (F02/F06 narrowed), docs-only fixes → Revival Q167 (low priority), code/tooling candidates → LOOSE-ENDS; no false positives. [Record](./audits/2026-11-06--GA-003--opus-validation.md).

- 2026-11-06 - author-authorized GA-003 items/player slice delivered at `3c249cb62ddde343be2b654fae43315a484f8054`; 32 claim rows (19 supported static / 1 partial / 1 contradicted / 8 excluded overlap / 3 excluded scope); F06-F07 remain `unverified`. Dirty tooling report preserved byte-for-byte; earlier slices and F01-F05 retained. No runtime changes, commit, push or stash.

- 2026-11-06 — author-authorized GA-003 developer-tooling slice delivered at `3c249cb62ddde343be2b654fae43315a484f8054`; 30 claim rows (18 supported static / 1 contradicted / 2 partial / 9 excluded); F03–F05 remain `unverified`. Deferred-section pilot and F01/F02 preserved; no runtime changes, commit or push.

- 2026-11-06 — author-authorized GA-003 deferred-section pilot delivered at `a75dcdfb29cd95d9634f5c87f6943daa428f44be`; 12 bullets accounted for (4 confirmed deferred / 2 partial / 6 excluded); 2 findings remain `unverified`. No runtime changes or commit.

- 2026-11-06 — independent review corrections: GA-003 first, GA-001 P2, stronger evidence/overlap controls and pilot evaluation; tasks still `proposed`, no audit run.
- 2026-11-06 — initial *proposed* queue; no task approved or executed.
