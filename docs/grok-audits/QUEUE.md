# Grok Audits — Candidate Queue

**Created:** 2026-11-06  
**Gate:** workspace + task list awaiting independent review and author approval. **All entries are proposals, not active assignments.**

This is a candidate queue for bounded Grok evidence-gathering in [SeedVale V1](https://github.com/jm-sky/seedvale-v1). See [operating rules](./README.md). At kickoff, check the [Revival session queue](../research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md), [System Review Matrix](../reviews/SYSTEM-REVIEW-MATRIX.md), current code and recent commits; narrow or defer overlapping work.

| ID | Priority | Candidate investigation | Status | Initial boundaries / acceptance |
| --- | --- | --- | --- | --- |
| GA-001 | P1 | Dead code & unused assets | `proposed` | Identify **candidates**, not delete targets; distinguish dynamic imports, registries, string lookups and runtime-loaded assets. Give usage-search evidence and uncertainty. |
| GA-002 | P1 | Duplicate implementations | `proposed` | Report concrete overlapping logic with ownership/callsite evidence; distinguish intentional presentation/simulation separation from accidental duplication. No consolidation proposals without validation. |
| GA-003 | P1 | Documentation vs code consistency | `proposed` | Check a **selected, stable documentation slice** against source/tests, with exact conflicting claims and code evidence; avoid trying to audit all docs in one run. |
| GA-004 | P2 | Memory & resource lifecycle | `proposed` | Focus on one stable subsystem; trace allocations, disposal, listeners, cancellation and ownership. Potential leaks are hypotheses until reproduced/proven. Exclude the forthcoming independent rendering/performance review scope. |
| GA-005 | P2 | Missing tests & contract coverage | `proposed` | Compare an explicitly selected contract against current tests; enumerate meaningful missing cases with source evidence, no speculative blanket coverage percentages. |
| GA-006 | P2 | Error handling & silent failures | `proposed` | Trace bounded async/failure paths and observable consequences; distinguish intended fallback behavior from lost errors. No automatic refactors. |

## Execution and review gates

1. **Independent review of these files** — review scope, prioritization, ambiguity, overlap with active Revival and evidence standards. Resolve findings before author approval.
2. **Author approves an individual task** — define exact paths/contracts and exclusions; assign a dated repository commit/ref for the run. Priority is a *suggestion*, not permission to execute.
3. **Grok writes only an audit report** in [audits/](./audits/README.md), updates indexes/status, and leaves runtime and implementation plans unchanged.
4. **Independent validation** checks high-impact claims against current code and tests; mark findings accepted/rejected/uncertain. No implementation follows automatically.

## First-run experiment

**Candidate:** `GA-001` (dead code & unused assets), after independent workspace review and explicit task approval.

Start with a narrow, stable path set chosen at kickoff rather than an unbounded repository-wide scan. Evaluate output using: traceable evidence, false-positive rate, omission of dynamic-use caveats, scope discipline and review effort. If the report is poor, revise this queue before commissioning more audits.

## Reports

No audits have run. Accepted and pending reports will appear in the [report index](./audits/README.md).

## Change log

- 2026-11-06 — initial *proposed* queue; no task approved or executed.
