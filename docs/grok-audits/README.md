# Grok Audits — V1 Evidence Workspace

**Created:** 2026-11-06  
**Status:** independent review addressed in workspace rules; individual tasks remain proposed and require explicit author approval; no Grok runs authorized

This workspace contains **bounded, evidence-first investigation tasks** suitable for Grok in SeedVale V1. It is not an implementation roadmap, a source of approved architectural decisions, or a substitute for the [system review matrix](../reviews/SYSTEM-REVIEW-MATRIX.md).

## Navigation

- [Audit queue](./QUEUE.md) — proposed tasks, priorities, execution gates and status.
- [Audit reports](./audits/README.md) — report index; currently empty.
- [V1 Revival Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md) — approved direction and constraints.
- [Revival session queue](../research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md) — authoritative active work and dependencies.
- [System Review Matrix](../reviews/SYSTEM-REVIEW-MATRIX.md) — independent system-level review coverage.

## Operating rules

1. **Review before execution:** the initial independent workspace review findings were incorporated on 2026-11-06. This does **not** approve any audit. No Grok session starts before explicit author approval of its individual task and scope.
2. **Evidence, not decisions:** Grok may inspect code, tests and docs and record findings. It must not approve changes, create implementation plans, change priorities in Revival, or alter runtime code.
3. **Source hierarchy:** current V1 code and tests > implementation notes/reviews > plans > architecture/state docs > vision. V2/V3 are references only. Verify documentation claims against code.
4. **Bounded scope:** each run needs a concrete task ID, in-scope paths/questions, exclusions, expected output and stopping criteria. Avoid broad whole-repo conclusions from incomplete sampling. Record the precise repository commit SHA; findings apply to that snapshot only.
5. **No false positives as facts:** distinguish observed defects, static-analysis hypotheses, documentation mismatches and optional improvements. Each finding needs a stable ID (`GA-###-F##`), affected path/symbol/line references, the specific violated contract or disputed claim, current-code/test evidence, relevant callsites and usage paths, alternative explanations or counterexamples checked, impact, confidence, and the smallest reproduction/verification or correction suggestion. Do not label an inferred runtime failure `confirmed` without appropriate reproducible evidence; negative searches alone do not prove dead code or absent behavior.
6. **Ownership safeguards:** preserve deterministic, authoritative simulation, entity identity and persistence, offscreen behavior and render/simulation separation. Flag implications without proposing unapproved cross-system refactors.
7. **Audit output only:** publish one Markdown report in `audits/` with task ID and date, add it to the report index and update the queue. Findings are candidates requiring a stronger-model or author review before promotion to a plan or work item. Review disposition is **per finding**, independent of the report's lifecycle status.
8. **No inferred verification:** static inspection cannot establish runtime, browser-visual or performance correctness. Record what was not tested.
9. **Respect active work:** check the Revival queue, System Review Matrix and recent commits immediately before each run. Record overlapping `Q###` tasks, applicable matrix area IDs, existing reviews, unstable paths/contracts and explicit exclusions in the report preflight. Narrow or defer on overlap; do not duplicate commissioned Astra/Sol rendering/performance, fauna, geography or combat reviews.

## Report format

`audits/YYYY-MM-DD--GA-###--short-topic.md`

Each report should include: task ID and date; model/environment; exact repository commit SHA; preflight collisions (`Q###`, matrix area IDs, prior reviews) and exclusions; scope, stopping criteria, methodology and files checked; finding IDs and evidence per rule 5; negative results; tests actually run (or `not run`); limits/unverified assumptions; and per-finding validation status. Use links relative to `docs/grok-audits/audits/` when practical.

**Per-finding validation:** `unverified` (initial Grok claim or inconclusive), `confirmed` (independent reviewer verified the stated claim against the recorded/current code, with validation method), `rejected` (reason and counterevidence). Runtime/performance claims require runtime/performance evidence to be confirmed. A report may be `accepted` even when some findings are rejected or unverified; that status never grants implementation approval.

## Status vocabulary

- `proposed` — candidate awaiting workspace/queue review
- `queued` — approved for potential assignment, not started
- `in progress` — Grok investigation underway
- `review needed` — report delivered, awaiting independent validation
- `accepted` — reviewed findings accepted as evidence, **not implementation approval**
- `closed` — concluded, rejected, superseded or no actionable findings (record reason)
- `deferred` — blocked by active work or overlap

**Separation of concerns:** the audit queue never replaces the Revival task queue or the system review matrix. Reviewers decide whether a finding warrants a separate issue, plan, or existing-task update.
