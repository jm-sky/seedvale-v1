# System Critical Review Matrix

**Status:** inventory pending · **Created:** 2026-11-03

This register tracks **system-level critical review coverage**, not individual review reports. The area inventory, complexity classifications, readiness gates and review history will be established in a separate, evidence-based session. Do not treat placeholder rows or historic reviews as verified coverage.

## Review methodology

- Reviews are independent and critical: assess correctness, architecture, determinism, lifecycle, persistence, performance, regression risks and alignment with the V1 Revival direction as relevant to scope.
- Reviewers may challenge fundamental architectural decisions and propose alternative architectures, provided they explain evidence, trade-offs, migration cost and risks. Findings and proposals are **not implementation approval**.
- GPT (ChatGPT) is expected to perform most reviews; Anthropic (e.g. Claude Opus) may independently review selected areas. Record each provider's coverage separately.
- One capable agent may run the review end-to-end. For larger systems, a strong coordinator may delegate bounded evidence gathering or targeted investigations to smaller sessions, while retaining responsibility for the final critical assessment.
- Match model capability and reasoning effort to system complexity; smaller, well-bounded systems can be reviewed by a smaller model.
- Review readiness must reflect **actual implementation and active Revival work**. Mark systems awaiting substantial planned changes as waiting, or split out mature subareas as partial. An early architectural review may be commissioned explicitly to inform a pending decision.
- Prefer current code and tests over documentation; distinguish verified behaviour, documented intent and outstanding runtime/visual/performance checks.
- Link each review report and relevant Revival blockers. A historical, narrow or superseded review does not automatically count as current system-level coverage.

## Readiness

- `ready` — major relevant changes finished; suitable for a system-level review.
- `partial` — some subareas are reviewable; scope and exclusions must be stated.
- `waiting` — significant Revival work remains; record the blocker.
- `unassessed` — requires inventory and verification.

Review cells should identify the date, model, report link and coverage/validity where available; otherwise use `not verified`.

## System review coverage

| Area / subsystem | Complexity / suggested model | Last major change (date / evidence) | Readiness / Revival blocker | GPT critical review | Anthropic critical review |
| --- | --- | --- | --- | --- | --- |
| *To be populated by a dedicated repository inventory session* | — | — | `unassessed` | `not verified` | `not verified` |

## Maintenance

Update rows when major implementation changes land, blockers close or reviews are completed. Re-evaluate whether past reviews remain current after significant architectural changes. Keep completed review reports in [README.md](./README.md) and link them from the appropriate cells here.
