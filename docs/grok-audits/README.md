# Grok Audits — V1 Evidence Workspace

**Created:** 2026-11-06  
**Status:** setup pending independent review; no Grok runs authorized

This workspace contains **bounded, evidence-first investigation tasks** suitable for Grok in SeedVale V1. It is not an implementation roadmap, a source of approved architectural decisions, or a substitute for the [system review matrix](../reviews/SYSTEM-REVIEW-MATRIX.md).

## Navigation

- [Audit queue](./QUEUE.md) — proposed tasks, priorities, execution gates and status.
- [Audit reports](./audits/README.md) — report index; currently empty.
- [V1 Revival Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md) — approved direction and constraints.
- [Revival session queue](../research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md) — authoritative active work and dependencies.
- [System Review Matrix](../reviews/SYSTEM-REVIEW-MATRIX.md) — independent system-level review coverage.

## Operating rules

1. **Review before execution:** this workspace and its initial queue require an independent review. No Grok session starts before explicit author approval after that review.
2. **Evidence, not decisions:** Grok may inspect code, tests and docs and record findings. It must not approve changes, create implementation plans, change priorities in Revival, or alter runtime code.
3. **Source hierarchy:** current V1 code and tests > implementation notes/reviews > plans > architecture/state docs > vision. V2/V3 are references only. Verify documentation claims against code.
4. **Bounded scope:** each run needs a concrete task ID, in-scope paths/questions, exclusions, expected output and stopping criteria. Avoid broad whole-repo conclusions from incomplete sampling.
5. **No false positives as facts:** distinguish confirmed defects, risks/hypotheses and optional improvements. Every finding should contain file paths, symbols/line references when available, evidence, impact, confidence and a minimal verification or correction suggestion.
6. **Ownership safeguards:** preserve deterministic, authoritative simulation, entity identity and persistence, offscreen behavior and render/simulation separation. Flag implications without proposing unapproved cross-system refactors.
7. **Audit output only:** publish one Markdown report in `audits/` with task ID and date, add it to the report index and update the queue. Findings are candidates requiring a stronger-model or author review before promotion to a plan or work item.
8. **No inferred verification:** static inspection cannot establish runtime, browser-visual or performance correctness. Record what was not tested.
9. **Respect active work:** check the Revival queue and current commits immediately before each run; defer overlapping or unstable files. Avoid duplicating already-commissioned Astra/Sol reviews.

## Report format

`audits/YYYY-MM-DD--GA-###--short-topic.md`

Each report should include: task ID and date; model/environment; repository ref/commit; scope and exclusions; methodology and files checked; findings (severity, confidence, code evidence, impact, suggested verification); negative results; limits/unverified assumptions; and recommended review disposition. Use links relative to `docs/grok-audits/audits/` when practical.

## Status vocabulary

- `proposed` — candidate awaiting workspace/queue review
- `queued` — approved for potential assignment, not started
- `in progress` — Grok investigation underway
- `review needed` — report delivered, awaiting independent validation
- `accepted` — reviewed findings accepted as evidence, **not implementation approval**
- `closed` — concluded, rejected, superseded or no actionable findings (record reason)
- `deferred` — blocked by active work or overlap

**Separation of concerns:** the audit queue never replaces the Revival task queue or the system review matrix. Reviewers decide whether a finding warrants a separate issue, plan, or existing-task update.
